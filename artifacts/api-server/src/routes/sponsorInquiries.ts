import { Router } from "express";
import { logger } from "../lib/logger";
import { getPool } from "../lib/db";
import { sendSponsorInquiryEmail } from "../lib/email";

const router = Router();

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

router.post("/sponsor-inquiries", async (req, res) => {
  const { name, organization, email, phone, interest, message } = req.body;

  if (!name || !organization || !email || !interest) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (!EMAIL_RE.test(String(email))) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }

  const db = getPool();

  if (!db) {
    logger.warn("DATABASE_URL not configured — sponsor inquiry not persisted");
    res.status(503).json({ error: "Service temporarily unavailable. Please try again later." });
    return;
  }

  try {
    await db.query(
      `INSERT INTO sponsor_inquiries (name, organization, email, phone, interest, message)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, organization, email, phone || null, interest, message || null]
    );

    logger.info({ interest }, "Sponsor inquiry saved");

    sendSponsorInquiryEmail({ name, organization, email, phone: phone || null, interest, message: message || null })
      .catch((err) => logger.error({ err }, "Failed to send sponsor inquiry notification email"));

    res.status(201).json({ success: true, message: "Inquiry received successfully" });
  } catch (err) {
    logger.error({ err }, "Error saving sponsor inquiry");
    res.status(500).json({ error: "Failed to submit inquiry" });
  }
});

export default router;
