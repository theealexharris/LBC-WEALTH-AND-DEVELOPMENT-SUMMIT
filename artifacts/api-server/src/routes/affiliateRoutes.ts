import { Router, type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../lib/logger";
import { getPool } from "../lib/db";
import { EMAIL_RE, PHONE_RE } from "../lib/validators";
import {
  hashPassword,
  verifyPassword,
  generateUniqueAffiliateCode,
  recordClick,
} from "../lib/affiliates";

const router = Router();
const MAX_LEN = 200;

function getJwtSecret(): string {
  const secret = process.env["JWT_SECRET"];
  if (!secret) throw new Error("JWT_SECRET environment variable is required");
  return secret;
}

function clientIp(req: Request): string {
  const fwd = req.headers["x-forwarded-for"];
  return (Array.isArray(fwd) ? fwd[0] : fwd)?.split(",")[0]?.trim()
    ?? req.socket.remoteAddress
    ?? "unknown";
}

// ── Affiliate auth middleware ────────────────────────────────────────────────
interface AffiliateReq extends Request {
  affiliateId?: string;
}

function requireAffiliate(req: AffiliateReq, res: Response, next: NextFunction): void {
  const auth = req.headers["authorization"] ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const payload = jwt.verify(token, getJwtSecret()) as { sub?: string; role?: string };
    if (payload.role !== "affiliate" || !payload.sub) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    req.affiliateId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ── Register ─────────────────────────────────────────────────────────────────
router.post("/affiliate/register", async (req, res) => {
  const { firstName, lastName, email, phone, password, payoutEmail } = req.body ?? {};

  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  if (!EMAIL_RE.test(String(email))) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }
  if (phone && !PHONE_RE.test(String(phone))) {
    res.status(400).json({ error: "Invalid phone number" });
    return;
  }
  if (String(password).length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  const db = getPool();
  if (!db) {
    res.status(503).json({ error: "Service temporarily unavailable" });
    return;
  }

  try {
    const existing = await db.query("SELECT 1 FROM affiliates WHERE email = $1", [String(email).toLowerCase()]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: "An affiliate account with this email already exists." });
      return;
    }

    const passwordHash = await hashPassword(String(password));
    const code = await generateUniqueAffiliateCode(db, String(firstName));

    await db.query(
      `INSERT INTO affiliates (first_name, last_name, email, phone, password_hash, affiliate_code, payout_email, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'pending')`,
      [
        String(firstName).slice(0, MAX_LEN),
        String(lastName).slice(0, MAX_LEN),
        String(email).toLowerCase().slice(0, MAX_LEN),
        phone ? String(phone).slice(0, 30) : null,
        passwordHash,
        code,
        payoutEmail ? String(payoutEmail).slice(0, MAX_LEN) : String(email).toLowerCase().slice(0, MAX_LEN),
      ]
    );

    logger.info({ code }, "New affiliate registered (pending approval)");
    res.status(201).json({
      success: true,
      affiliateCode: code,
      message: "Application received. Your account is pending approval — you'll be notified once activated.",
    });
  } catch (err) {
    logger.error({ err }, "Affiliate registration failed");
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// ── Login ────────────────────────────────────────────────────────────────────
router.post("/affiliate/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }

  const db = getPool();
  if (!db) {
    res.status(503).json({ error: "Service temporarily unavailable" });
    return;
  }

  try {
    const result = await db.query(
      "SELECT id, password_hash, status FROM affiliates WHERE email = $1",
      [String(email).toLowerCase()]
    );
    const affiliate = result.rows[0];
    // Always run a comparison to reduce timing leakage on unknown emails.
    const ok = affiliate
      ? await verifyPassword(String(password), affiliate.password_hash as string)
      : await verifyPassword(String(password), "x:y");

    if (!affiliate || !ok) {
      res.status(401).json({ error: "Incorrect email or password" });
      return;
    }
    if (affiliate.status === "pending") {
      res.status(403).json({ error: "Your account is pending approval." });
      return;
    }
    if (affiliate.status === "suspended") {
      res.status(403).json({ error: "Your account has been suspended. Contact support." });
      return;
    }

    const token = jwt.sign({ sub: affiliate.id, role: "affiliate" }, getJwtSecret(), { expiresIn: "12h" });
    res.json({ token });
  } catch (err) {
    logger.error({ err }, "Affiliate login failed");
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// ── Dashboard (self) ─────────────────────────────────────────────────────────
router.get("/affiliate/dashboard", requireAffiliate, async (req: AffiliateReq, res) => {
  const db = getPool();
  if (!db) {
    res.status(503).json({ error: "Service temporarily unavailable" });
    return;
  }
  try {
    const result = await db.query(
      `SELECT first_name, last_name, email, affiliate_code, commission_rate, status,
              total_clicks, total_sales, total_commissions_cents, total_paid_cents, created_at
       FROM affiliates WHERE id = $1`,
      [req.affiliateId]
    );
    const a = result.rows[0];
    if (!a) {
      res.status(404).json({ error: "Affiliate not found" });
      return;
    }

    const pending = await db.query(
      `SELECT COALESCE(SUM(commission_amount_cents),0) AS cents
       FROM commissions WHERE affiliate_id = $1 AND status = 'pending'`,
      [req.affiliateId]
    );
    const approved = await db.query(
      `SELECT COALESCE(SUM(commission_amount_cents),0) AS cents
       FROM commissions WHERE affiliate_id = $1 AND status = 'approved'`,
      [req.affiliateId]
    );

    res.json({
      firstName: a.first_name,
      lastName: a.last_name,
      email: a.email,
      affiliateCode: a.affiliate_code,
      commissionRate: Number(a.commission_rate),
      status: a.status,
      totalClicks: a.total_clicks,
      totalSales: a.total_sales,
      totalCommissionsCents: a.total_commissions_cents,
      totalPaidCents: a.total_paid_cents,
      pendingCents: Number(pending.rows[0].cents),
      approvedCents: Number(approved.rows[0].cents),
    });
  } catch (err) {
    logger.error({ err }, "Affiliate dashboard fetch failed");
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

// ── Referral history (self) ──────────────────────────────────────────────────
router.get("/affiliate/referrals", requireAffiliate, async (req: AffiliateReq, res) => {
  const db = getPool();
  if (!db) {
    res.status(503).json({ error: "Service temporarily unavailable" });
    return;
  }
  try {
    const result = await db.query(
      `SELECT c.sale_amount_cents, c.commission_amount_cents, c.status, c.created_at
       FROM commissions c WHERE c.affiliate_id = $1
       ORDER BY c.created_at DESC LIMIT 100`,
      [req.affiliateId]
    );
    res.json({ referrals: result.rows });
  } catch (err) {
    logger.error({ err }, "Affiliate referrals fetch failed");
    res.status(500).json({ error: "Failed to load referrals" });
  }
});

// ── Click tracking (public) ──────────────────────────────────────────────────
router.post("/affiliate/track-click", async (req, res) => {
  const code = String(req.body?.code ?? "").trim().toUpperCase();
  if (!code || code.length > 40 || !/^[A-Z0-9]+$/.test(code)) {
    res.status(400).json({ error: "Invalid referral code" });
    return;
  }
  const db = getPool();
  if (!db) {
    res.json({ tracked: false });
    return;
  }
  try {
    const tracked = await recordClick(db, code, clientIp(req));
    res.json({ tracked });
  } catch (err) {
    logger.error({ err }, "Click tracking failed");
    res.json({ tracked: false });
  }
});

export default router;
