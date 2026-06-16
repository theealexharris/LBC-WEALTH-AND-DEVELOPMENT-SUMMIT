import { Router } from "express";
import Stripe from "stripe";
import { Pool } from "pg";
import { logger } from "../lib/logger";
import {
  PRICE_IDS,
  TICKET_LABELS,
  TICKET_AMOUNTS,
  createAttendeeRecord,
} from "../lib/registration";
import { sendConfirmationSMS } from "../lib/sms";

const router = Router();

let pool: Pool | null = null;
function getPool(): Pool | null {
  if (!process.env["DATABASE_URL"]) return null;
  if (!pool) pool = new Pool({ connectionString: process.env["DATABASE_URL"], ssl: true });
  return pool;
}

function getStripe(): Stripe | null {
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key) return null;
  return new Stripe(key);
}

const SITE_URL =
  process.env["SITE_URL"] ?? "https://lbc-wealth-and-development-summit.onrender.com";

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

router.post("/checkout/session", async (req, res) => {
  const {
    ticketType, firstName, lastName, email, phone,
    company, jobTitle, city, state,
    accessibilityNeeds, emergencyContactName, emergencyContactPhone,
    agreeTerms, agreeUpdates, agreeSms,
  } = req.body;

  if (!ticketType || !firstName || !lastName || !email || !phone || !agreeTerms) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (!EMAIL_RE.test(String(email))) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }

  const priceId = PRICE_IDS[String(ticketType)];
  if (!priceId) {
    res.status(400).json({ error: "Invalid ticket type" });
    return;
  }

  const stripe = getStripe();
  if (!stripe) {
    res.status(503).json({ error: "Payment service not configured. Please try again later." });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: String(email),
      success_url: `${SITE_URL}/register/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/register`,
      metadata: {
        ticketType: String(ticketType),
        firstName: String(firstName),
        lastName: String(lastName),
        email: String(email),
        phone: String(phone),
        company: company ? String(company) : "",
        jobTitle: jobTitle ? String(jobTitle) : "",
        city: city ? String(city) : "",
        state: state ? String(state) : "",
        accessibilityNeeds: accessibilityNeeds ? String(accessibilityNeeds) : "",
        emergencyContactName: emergencyContactName ? String(emergencyContactName) : "",
        emergencyContactPhone: emergencyContactPhone ? String(emergencyContactPhone) : "",
        agreeTerms: agreeTerms ? "true" : "false",
        agreeUpdates: agreeUpdates ? "true" : "false",
        agreeSms: agreeSms ? "true" : "false",
      },
      payment_method_types: ["card"],
      billing_address_collection: "auto",
    });

    res.json({ url: session.url });
  } catch (err) {
    logger.error({ err }, "Stripe session creation failed");
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

router.get("/checkout/verify", async (req, res) => {
  const sessionId = String(req.query["session_id"] ?? "");
  if (!sessionId) {
    res.status(400).json({ error: "Missing session_id" });
    return;
  }

  const stripe = getStripe();
  if (!stripe) {
    res.status(503).json({ error: "Payment service not configured" });
    return;
  }

  const db = getPool();
  if (!db) {
    res.status(503).json({ error: "Database not configured" });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      res.status(402).json({ error: "Payment not completed" });
      return;
    }

    const meta = session.metadata ?? {};
    const ticketType = meta["ticketType"] ?? "general";
    const amountPaid = session.amount_total ?? TICKET_AMOUNTS[ticketType] ?? 0;

    const record = await createAttendeeRecord(db, {
      firstName: meta["firstName"] ?? "",
      lastName: meta["lastName"] ?? "",
      email: meta["email"] ?? (session.customer_email ?? ""),
      phone: meta["phone"] ?? "",
      company: meta["company"] || undefined,
      jobTitle: meta["jobTitle"] || undefined,
      city: meta["city"] || undefined,
      state: meta["state"] || undefined,
      accessibilityNeeds: meta["accessibilityNeeds"] || undefined,
      emergencyContactName: meta["emergencyContactName"] || undefined,
      emergencyContactPhone: meta["emergencyContactPhone"] || undefined,
      ticketType,
      amountPaid,
      stripeSessionId: sessionId,
      agreeTerms: meta["agreeTerms"] === "true",
      agreeUpdates: meta["agreeUpdates"] === "true",
      agreeSms: meta["agreeSms"] === "true",
    });

    if (meta["agreeSms"] === "true" && meta["phone"]) {
      sendConfirmationSMS(
        meta["phone"],
        record.registration_id,
        TICKET_LABELS[ticketType] ?? ticketType,
        meta["firstName"] ?? ""
      ).catch(() => {});
    }

    const fullRecord = await db.query(
      "SELECT * FROM attendees WHERE registration_id = $1",
      [record.registration_id]
    );
    const attendee = fullRecord.rows[0];

    res.json({
      success: true,
      registrationId: attendee.registration_id,
      ticketNumber: attendee.ticket_number,
      ticketType: TICKET_LABELS[attendee.ticket_type] ?? attendee.ticket_type,
      amountPaid: attendee.amount_paid,
      firstName: attendee.first_name,
      lastName: attendee.last_name,
      email: attendee.email,
      qrCode: attendee.qr_code,
    });
  } catch (err) {
    logger.error({ err }, "Checkout verify failed");
    res.status(500).json({ error: "Verification failed. Please contact support." });
  }
});

export default router;
