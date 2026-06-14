import { Router } from "express";
import { Pool } from "pg";
import { logger } from "../lib/logger";

const router = Router();

let pool: Pool | null = null;

function getPool(): Pool | null {
  if (!process.env["DATABASE_URL"]) return null;
  if (!pool) {
    pool = new Pool({ connectionString: process.env["DATABASE_URL"], ssl: true });
  }
  return pool;
}

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
const VALID_TICKETS = new Set(["general", "vip", "group"]);

router.post("/registrations", async (req, res) => {
  const { firstName, lastName, email, phone, ticketPreference, organization, consent } = req.body;

  if (!firstName || !lastName || !email || !phone || !ticketPreference || !consent) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (!EMAIL_RE.test(String(email))) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }

  if (!PHONE_RE.test(String(phone))) {
    res.status(400).json({ error: "Invalid phone number" });
    return;
  }

  if (!VALID_TICKETS.has(String(ticketPreference))) {
    res.status(400).json({ error: "Invalid ticket preference" });
    return;
  }

  const db = getPool();

  if (!db) {
    logger.warn("DATABASE_URL not configured — registration not persisted");
    res.status(503).json({ error: "Service temporarily unavailable. Please try again later." });
    return;
  }

  try {
    await db.query(
      `INSERT INTO registrations (first_name, last_name, email, phone, ticket_preference, organization, consent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [firstName, lastName, email, phone, ticketPreference, organization || null, Boolean(consent)]
    );

    logger.info({ ticketPreference }, "Registration saved");
    res.status(201).json({ success: true, message: "Registration saved successfully" });
  } catch (err) {
    logger.error({ err }, "Error saving registration");
    res.status(500).json({ error: "Failed to save registration" });
  }
});

export default router;
