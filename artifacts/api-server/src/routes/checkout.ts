import { Router } from "express";
import Stripe from "stripe";
import { logger } from "../lib/logger";
import { getPool } from "../lib/db";
import {
  PRICE_IDS,
  TICKET_LABELS,
  TICKET_AMOUNTS,
  createAttendeeRecord,
} from "../lib/registration";
import { sendConfirmationSMS } from "../lib/sms";
import { EMAIL_RE, PHONE_RE, STRIPE_SESSION_RE } from "../lib/validators";

const router = Router();

function getStripe(): Stripe | null {
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key) return null;
  return new Stripe(key);
}

const SITE_URL =
  process.env["SITE_URL"] ?? "https://lbc-wealth-and-development-summit.onrender.com";
const MAX_FIELD_LEN = 200;
const MAX_LONG_FIELD_LEN = 500;

function cap(s: unknown, max: number): string {
  return String(s ?? "").slice(0, max);
}

router.post("/checkout/session", async (req, res) => {
  const {
    ticketType, firstName, lastName, email, phone,
    company, jobTitle, city, state,
    accessibilityNeeds, emergencyContactName, emergencyContactPhone,
    agreeTerms, agreeUpdates, agreeSms,
  } = req.body;

  // Required field presence
  if (!ticketType || !firstName || !lastName || !email || !phone || !agreeTerms) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  // Format validation
  if (!EMAIL_RE.test(String(email))) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }

  if (!PHONE_RE.test(String(phone))) {
    res.status(400).json({ error: "Invalid phone number format" });
    return;
  }

  // Emergency contact phone validation (if provided)
  if (emergencyContactPhone && !PHONE_RE.test(String(emergencyContactPhone))) {
    res.status(400).json({ error: "Invalid emergency contact phone number" });
    return;
  }

  // Length limits
  if (
    String(firstName).length > MAX_FIELD_LEN ||
    String(lastName).length > MAX_FIELD_LEN ||
    String(email).length > MAX_FIELD_LEN
  ) {
    res.status(400).json({ error: "Field value too long" });
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
        ticketType: cap(ticketType, 50),
        firstName: cap(firstName, MAX_FIELD_LEN),
        lastName: cap(lastName, MAX_FIELD_LEN),
        email: cap(email, MAX_FIELD_LEN),
        phone: cap(phone, 30),
        company: cap(company, MAX_FIELD_LEN),
        jobTitle: cap(jobTitle, MAX_FIELD_LEN),
        city: cap(city, MAX_FIELD_LEN),
        state: cap(state, 10),
        accessibilityNeeds: cap(accessibilityNeeds, MAX_LONG_FIELD_LEN),
        emergencyContactName: cap(emergencyContactName, MAX_FIELD_LEN),
        emergencyContactPhone: cap(emergencyContactPhone, 30),
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
  if (!sessionId || !STRIPE_SESSION_RE.test(sessionId)) {
    res.status(400).json({ error: "Invalid session ID" });
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
      ).catch((err: unknown) => {
        logger.warn({ err }, "Failed to send confirmation SMS");
      });
    }

    const fullRecord = await db.query(
      `SELECT registration_id, ticket_number, ticket_type, amount_paid,
              first_name, last_name, email, qr_code
       FROM attendees WHERE registration_id = $1`,
      [record.registration_id]
    );
    const attendee = fullRecord.rows[0];

    res.json({
      success: true,
      registrationId: attendee.registration_id as string,
      ticketNumber: attendee.ticket_number as string,
      ticketType: TICKET_LABELS[attendee.ticket_type as string] ?? (attendee.ticket_type as string),
      amountPaid: attendee.amount_paid as number,
      firstName: attendee.first_name as string,
      lastName: attendee.last_name as string,
      email: attendee.email as string,
      qrCode: attendee.qr_code as string,
    });
  } catch (err) {
    logger.error({ err }, "Checkout verify failed");
    res.status(500).json({ error: "Verification failed. Please contact support." });
  }
});

export default router;
