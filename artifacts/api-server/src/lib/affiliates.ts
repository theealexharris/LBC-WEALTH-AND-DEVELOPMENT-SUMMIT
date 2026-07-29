import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Pool } from "pg";
import { logger } from "./logger";

const scrypt = promisify(scryptCb);

// Commission rate paid to affiliates on each referred sale.
export const COMMISSION_RATE = 0.2;

// Referral attribution window (days) — how long a click stays valid.
export const REFERRAL_WINDOW_DAYS = 30;

// ── Password hashing (salted scrypt) ─────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const keyBuf = Buffer.from(key, "hex");
  if (keyBuf.length !== derived.length) return false;
  return timingSafeEqual(keyBuf, derived);
}

// ── Referral code generator: FIRSTNAME + 4 random digits ─────────────────────
export function generateAffiliateCode(firstName: string): string {
  const base = (firstName || "LBC")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 10) || "LBC";
  const digits = String(Math.floor(1000 + (randomBytes(2).readUInt16BE(0) % 9000)));
  return `${base}${digits}`;
}

// Generate a code guaranteed unique against the affiliates table.
export async function generateUniqueAffiliateCode(db: Pool, firstName: string): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateAffiliateCode(firstName);
    const existing = await db.query("SELECT 1 FROM affiliates WHERE affiliate_code = $1", [code]);
    if (existing.rows.length === 0) return code;
  }
  // Extremely unlikely fallback — append extra entropy.
  return `${generateAffiliateCode(firstName)}${randomBytes(2).toString("hex").toUpperCase()}`;
}

// ── Schema bootstrap — idempotent, runs on server startup ────────────────────
export async function ensureAffiliateSchema(db: Pool): Promise<void> {
  await db.query(`
    CREATE TABLE IF NOT EXISTS affiliates (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name      TEXT NOT NULL,
      last_name       TEXT NOT NULL,
      email           TEXT NOT NULL UNIQUE,
      phone           TEXT,
      password_hash   TEXT NOT NULL,
      affiliate_code  TEXT NOT NULL UNIQUE,
      commission_rate NUMERIC NOT NULL DEFAULT 0.20,
      status          TEXT NOT NULL DEFAULT 'pending',
      payout_email    TEXT,
      total_clicks    INTEGER NOT NULL DEFAULT 0,
      total_sales     INTEGER NOT NULL DEFAULT 0,
      total_commissions_cents INTEGER NOT NULL DEFAULT 0,
      total_paid_cents        INTEGER NOT NULL DEFAULT 0,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS referrals (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      affiliate_id    UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
      affiliate_code  TEXT NOT NULL,
      visitor_ip      TEXT,
      converted       BOOLEAN NOT NULL DEFAULT FALSE,
      stripe_session_id TEXT,
      purchase_amount_cents INTEGER,
      clicked_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      converted_at    TIMESTAMPTZ
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS commissions (
      id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      affiliate_id         UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
      referral_id          UUID REFERENCES referrals(id) ON DELETE SET NULL,
      stripe_session_id    TEXT UNIQUE,
      sale_amount_cents    INTEGER NOT NULL,
      commission_rate      NUMERIC NOT NULL,
      commission_amount_cents INTEGER NOT NULL,
      status               TEXT NOT NULL DEFAULT 'pending',
      created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      approved_at          TIMESTAMPTZ,
      paid_at              TIMESTAMPTZ
    );
  `);

  await db.query("CREATE INDEX IF NOT EXISTS idx_referrals_affiliate ON referrals(affiliate_id);");
  await db.query("CREATE INDEX IF NOT EXISTS idx_commissions_affiliate ON commissions(affiliate_id);");

  logger.info("Affiliate schema ensured");
}

// ── Record a click (idempotency is soft — every click is a row) ──────────────
export async function recordClick(db: Pool, code: string, ip: string | null): Promise<boolean> {
  const aff = await db.query(
    "SELECT id FROM affiliates WHERE affiliate_code = $1 AND status = 'active'",
    [code]
  );
  const affiliate = aff.rows[0];
  if (!affiliate) return false;

  await db.query(
    "INSERT INTO referrals (affiliate_id, affiliate_code, visitor_ip) VALUES ($1, $2, $3)",
    [affiliate.id, code, ip]
  );
  await db.query("UPDATE affiliates SET total_clicks = total_clicks + 1 WHERE id = $1", [affiliate.id]);
  return true;
}

// ── Create a commission from a converted Stripe session ──────────────────────
// Idempotent on stripe_session_id (commissions.stripe_session_id UNIQUE).
export async function createCommissionForSale(
  db: Pool,
  code: string,
  stripeSessionId: string,
  saleAmountCents: number
): Promise<void> {
  const aff = await db.query(
    "SELECT id, commission_rate FROM affiliates WHERE affiliate_code = $1 AND status = 'active'",
    [code]
  );
  const affiliate = aff.rows[0];
  if (!affiliate) {
    logger.warn({ code }, "Referral code has no active affiliate — no commission created");
    return;
  }

  const rate = Number(affiliate.commission_rate) || COMMISSION_RATE;
  const commissionCents = Math.round(saleAmountCents * rate);

  // Attach to the most recent unconverted click for this affiliate, if any.
  const ref = await db.query(
    `UPDATE referrals SET converted = TRUE, stripe_session_id = $1,
            purchase_amount_cents = $2, converted_at = NOW()
     WHERE id = (
       SELECT id FROM referrals
       WHERE affiliate_id = $3 AND converted = FALSE
       ORDER BY clicked_at DESC LIMIT 1
     )
     RETURNING id`,
    [stripeSessionId, saleAmountCents, affiliate.id]
  );
  const referralId = ref.rows[0]?.id ?? null;

  try {
    // ON CONFLICT DO NOTHING makes this idempotent on duplicate Stripe webhooks.
    // Only bump the affiliate's running totals when a NEW commission row is inserted
    // (RETURNING yields no row on conflict), so repeated events don't double-count.
    const inserted = await db.query(
      `INSERT INTO commissions
         (affiliate_id, referral_id, stripe_session_id, sale_amount_cents, commission_rate, commission_amount_cents)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (stripe_session_id) DO NOTHING
       RETURNING id`,
      [affiliate.id, referralId, stripeSessionId, saleAmountCents, rate, commissionCents]
    );

    if (inserted.rows.length === 0) {
      logger.info({ code, stripeSessionId }, "Commission already recorded for session — skipping");
      return;
    }

    await db.query(
      `UPDATE affiliates
         SET total_sales = total_sales + 1,
             total_commissions_cents = total_commissions_cents + $1
       WHERE id = $2`,
      [commissionCents, affiliate.id]
    );
    logger.info({ code, commissionCents }, "Affiliate commission created");
  } catch (err) {
    logger.error({ err, code }, "Failed to create affiliate commission");
  }
}
