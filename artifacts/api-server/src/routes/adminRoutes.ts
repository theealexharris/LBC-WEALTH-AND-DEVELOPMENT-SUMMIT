import { Router, type Request, type Response, type NextFunction } from "express";
import { timingSafeEqual, createHash } from "node:crypto";
import jwt from "jsonwebtoken";
import { logger } from "../lib/logger";
import { getPool } from "../lib/db";

const router = Router();

// ── JWT ───────────────────────────────────────────────────────────────────────
function getJwtSecret(): string {
  const secret = process.env["JWT_SECRET"];
  if (!secret) throw new Error("JWT_SECRET environment variable is required");
  return secret;
}

// ── Auth middleware ───────────────────────────────────────────────────────────
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers["authorization"] ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    jwt.verify(token, getJwtSecret());
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ── Simple in-memory rate limiter for login (5 attempts / 15 min per IP) ──────
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const WINDOW = 15 * 60 * 1000; // 15 minutes
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

// ── Escape CSV cells to prevent formula injection ─────────────────────────────
function escapeCSVCell(value: string): string {
  // Prevent spreadsheet formula injection (Excel / Google Sheets)
  if (/^[=+\-@\t\r]/.test(value)) return `'${value}`;
  return value;
}

// ── Routes ───────────────────────────────────────────────────────────────────
router.post("/admin/login", (req, res) => {
  const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim()
    ?? req.socket.remoteAddress
    ?? "unknown";

  if (!checkRateLimit(ip)) {
    logger.warn({ ip }, "Admin login rate limit exceeded");
    res.status(429).json({ error: "Too many login attempts. Please wait 15 minutes." });
    return;
  }

  const { password } = req.body as { password?: string };
  const adminPassword = process.env["ADMIN_PASSWORD"];

  if (!adminPassword) {
    res.status(503).json({ error: "Admin not configured" });
    return;
  }

  if (!password) {
    res.status(400).json({ error: "Password required" });
    return;
  }

  const provided = createHash("sha256").update(String(password)).digest();
  const expected = createHash("sha256").update(adminPassword).digest();

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    logger.warn({ ip }, "Failed admin login attempt");
    res.status(401).json({ error: "Incorrect password" });
    return;
  }

  const token = jwt.sign({ role: "admin" }, getJwtSecret(), { expiresIn: "8h" });
  res.json({ token });
});

router.get("/admin/registrations", requireAdmin, async (req, res) => {
  const db = getPool();
  if (!db) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }

  const search = String(req.query["search"] ?? "").trim();
  const page = Math.max(1, parseInt(String(req.query["page"] ?? "1"), 10));
  const limit = Math.min(100, Math.max(10, parseInt(String(req.query["limit"] ?? "50"), 10)));
  const offset = (page - 1) * limit;

  try {
    let query: string;
    let params: (string | number)[];

    if (search) {
      query = `
        SELECT registration_id, ticket_number, first_name, last_name, email, phone,
               company, job_title, ticket_type, amount_paid, payment_status,
               registration_date, checked_in, checked_in_at
        FROM attendees
        WHERE LOWER(first_name || ' ' || last_name) LIKE $1
           OR LOWER(email) LIKE $1
           OR LOWER(registration_id) LIKE $1
           OR LOWER(ticket_type) LIKE $1
        ORDER BY registration_date DESC
        LIMIT $2 OFFSET $3
      `;
      params = [`%${search.toLowerCase()}%`, limit, offset];
    } else {
      query = `
        SELECT registration_id, ticket_number, first_name, last_name, email, phone,
               company, job_title, ticket_type, amount_paid, payment_status,
               registration_date, checked_in, checked_in_at
        FROM attendees
        ORDER BY registration_date DESC
        LIMIT $1 OFFSET $2
      `;
      params = [limit, offset];
    }

    const [result, countResult] = await Promise.all([
      db.query(query, params),
      db.query("SELECT COUNT(*) AS total FROM attendees"),
    ]);

    const total = parseInt(String(countResult.rows[0]?.total ?? "0"), 10);
    res.json({ registrations: result.rows, total, page, limit });
  } catch (err) {
    logger.error({ err }, "Admin: failed to fetch registrations");
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

router.patch("/admin/attendees/:registrationId/checkin", requireAdmin, async (req, res) => {
  const { registrationId } = req.params;

  // Validate registration ID format
  if (!/^LBC-2026-[A-F0-9]{6}$/i.test(registrationId)) {
    res.status(400).json({ error: "Invalid registration ID format" });
    return;
  }

  const db = getPool();
  if (!db) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }

  try {
    const current = await db.query(
      "SELECT checked_in FROM attendees WHERE registration_id = $1",
      [registrationId]
    );
    if (current.rows.length === 0) {
      res.status(404).json({ error: "Registration not found" });
      return;
    }

    const newState = !current.rows[0].checked_in;
    await db.query(
      "UPDATE attendees SET checked_in = $1, checked_in_at = $2 WHERE registration_id = $3",
      [newState, newState ? new Date() : null, registrationId]
    );

    res.json({ checkedIn: newState });
  } catch (err) {
    logger.error({ err }, "Admin: check-in failed");
    res.status(500).json({ error: "Check-in failed" });
  }
});

// CSV export — Authorization header only (no query-param token)
router.get("/admin/export", requireAdmin, async (req, res) => {
  const db = getPool();
  if (!db) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }

  try {
    const result = await db.query(`
      SELECT registration_id, ticket_number, first_name, last_name, email, phone,
             company, job_title, city, state, ticket_type, amount_paid, payment_status,
             registration_date, checked_in, checked_in_at
      FROM attendees
      ORDER BY registration_date DESC
    `);

    const headers = [
      "Registration ID", "Ticket Number", "First Name", "Last Name",
      "Email", "Phone", "Company", "Job Title", "City", "State",
      "Ticket Type", "Amount Paid ($)", "Payment Status",
      "Registration Date", "Checked In", "Check-In Time",
    ];

    const rows = result.rows.map((r) => [
      r.registration_id, r.ticket_number, r.first_name, r.last_name,
      r.email, r.phone, r.company ?? "", r.job_title ?? "",
      r.city ?? "", r.state ?? "",
      r.ticket_type, ((r.amount_paid as number) / 100).toFixed(2),
      r.payment_status,
      new Date(r.registration_date as string).toLocaleString(),
      r.checked_in ? "Yes" : "No",
      r.checked_in_at ? new Date(r.checked_in_at as string).toLocaleString() : "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((v) => `"${escapeCSVCell(String(v)).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="lbc-summit-registrations-${Date.now()}.csv"`
    );
    res.send(csv);
  } catch (err) {
    logger.error({ err }, "Admin: CSV export failed");
    res.status(500).json({ error: "Export failed" });
  }
});

router.get("/admin/attendees/:registrationId/qr", requireAdmin, async (req, res) => {
  const { registrationId } = req.params;

  if (!/^LBC-2026-[A-F0-9]{6}$/i.test(registrationId)) {
    res.status(400).json({ error: "Invalid registration ID format" });
    return;
  }

  const db = getPool();
  if (!db) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }

  try {
    const result = await db.query(
      "SELECT qr_code FROM attendees WHERE registration_id = $1",
      [registrationId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ qrCode: result.rows[0].qr_code });
  } catch (err) {
    logger.error({ err }, "Admin: QR fetch failed");
    res.status(500).json({ error: "Failed to fetch QR code" });
  }
});

export default router;
