import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

const INSFORGE_URL = process.env["INSFORGE_URL"];
const INSFORGE_SERVICE_KEY = process.env["INSFORGE_SERVICE_KEY"];

router.post("/registrations", async (req, res) => {
  const { firstName, lastName, email, phone, ticketPreference, organization, consent } = req.body;

  if (!firstName || !lastName || !email || !phone || !ticketPreference || !consent) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (!INSFORGE_URL || !INSFORGE_SERVICE_KEY) {
    logger.warn("InsForge credentials not configured — registration not persisted");
    res.status(200).json({ success: true, message: "Registration received (backend not yet configured)" });
    return;
  }

  try {
    const response = await fetch(`${INSFORGE_URL}/rest/v1/registrations`, {
      method: "POST",
      headers: {
        "apikey": INSFORGE_SERVICE_KEY,
        "Authorization": `Bearer ${INSFORGE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        ticket_preference: ticketPreference,
        organization: organization || null,
        consent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error({ status: response.status, body: errorText }, "InsForge insert failed");
      res.status(500).json({ error: "Failed to save registration" });
      return;
    }

    logger.info({ email, ticketPreference }, "Registration saved");
    res.status(201).json({ success: true, message: "Registration saved successfully" });
  } catch (err) {
    logger.error({ err }, "Error saving registration");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
