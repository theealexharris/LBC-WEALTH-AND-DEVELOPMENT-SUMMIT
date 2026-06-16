import { Router, type Request, type Response, type NextFunction } from "express";
import { timingSafeEqual, createHash } from "node:crypto";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { logger } from "../lib/logger";

const router = Router();

let pool: Pool | null = null;
function getPool(): Pool | null {
  if (!process.env["DATABASE_URL"]) return null;
  if (!pool) pool = new Pool({ connectionString: process.env["DATABASE_URL"], ssl: true });
  return pool;
}

function getJwtSecret(): string {
  return process.env["JWT_SECRET"] ?? "lbc-summit-jwt-secret-change-in-production";
}

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

router.post("/admin/login", (req, res) => {
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
    logger.warn("Failed admin login attempt");
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

    const result = await db.query(query, params);
    const countResult = await db.query("SELECT COUNT(*) FROM attendees");
    const total = parseInt(countResult.rows[0].count, 10);

    res.json({ registrations: result.rows, total, page, limit });
  } catch (err) {
    logger.error({ err }, "Admin: failed to fetch registrations");
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

router.patch("/admin/attendees/:registrationId/checkin", requireAdmin, async (req, res) => {
  const { registrationId } = req.params;
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

router.get("/admin/export", (req, res, next) => {
  // Allow token via query param for direct browser download
  const queryToken = String(req.query["token"] ?? "");
  if (queryToken && !req.headers["authorization"]) {
    req.headers["authorization"] = `Bearer ${queryToken}`;
  }
  next();
}, requireAdmin, async (req, res) => {
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
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
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
