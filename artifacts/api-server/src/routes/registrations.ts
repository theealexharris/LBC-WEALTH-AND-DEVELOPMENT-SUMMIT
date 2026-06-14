import { Router } from "express";
import { Pool } from "pg";
import { logger } from "../lib/logger";

const router = Router();

let pool: Pool | null = null;

function getPool(): Pool | null {
  if (!process.env["DATABASE_URL"]) return null;
  if (!pool) {
    pool = new Pool({ connectionString: process.env["DATABASE_URL"], ssl: { rejectUnauthorized: false } });
  }
  return pool;
}

router.post("/registrations", async (req, res) => {
  const { firstName, lastName, email, phone, ticketPreference, organization, consent } = req.body;

  if (!firstName || !lastName || !email || !phone || !ticketPreference || !consent) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const db = getPool();

  if (!db) {
    logger.warn("DATABASE_URL not configured — registration not persisted");
    res.status(200).json({ success: true, message: "Registration received" });
    return;
  }

  try {
    await db.query(
      `INSERT INTO registrations (first_name, last_name, email, phone, ticket_preference, organization, consent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [firstName, lastName, email, phone, ticketPreference, organization || null, consent]
    );

    logger.info({ email, ticketPreference }, "Registration saved");
    res.status(201).json({ success: true, message: "Registration saved successfully" });
  } catch (err) {
    logger.error({ err }, "Error saving registration");
    res.status(500).json({ error: "Failed to save registration" });
  }
});

export default router;
