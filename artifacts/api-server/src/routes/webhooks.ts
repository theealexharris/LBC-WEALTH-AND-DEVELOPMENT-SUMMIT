import { Router, type Request, type Response } from "express";
import Stripe from "stripe";
import { logger } from "../lib/logger";
import { getPool } from "../lib/db";
import { createAttendeeRecord, TICKET_LABELS, TICKET_AMOUNTS } from "../lib/registration";
import { sendConfirmationSMS } from "../lib/sms";

const router = Router();

router.post("/webhooks/stripe", async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"];
  const stripeKey = process.env["STRIPE_SECRET_KEY"];

  if (!stripeKey) {
    res.status(503).json({ error: "Stripe not configured" });
    return;
  }

  // Reject unsigned webhook requests — do not fall back to unverified JSON
  if (!webhookSecret || !sig) {
    logger.warn("Webhook received without signature — rejecting");
    res.status(400).json({ error: "Webhook signature required" });
    return;
  }

  const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
  if (!rawBody) {
    logger.warn("Webhook received without raw body");
    res.status(400).json({ error: "Invalid webhook request" });
    return;
  }

  const stripe = new Stripe(stripeKey);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    logger.error({ err }, "Webhook signature verification failed");
    res.status(400).json({ error: "Invalid webhook signature" });
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const db = getPool();
    if (!db) {
      logger.warn("DATABASE_URL not configured — webhook registration skipped");
      res.json({ received: true });
      return;
    }

    try {
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
        stripeSessionId: session.id,
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
          logger.warn({ err }, "Failed to send confirmation SMS via webhook");
        });
      }

      logger.info({ registrationId: record.registration_id }, "Webhook: attendee created");
    } catch (err) {
      logger.error({ err }, "Webhook: failed to create attendee");
    }
  }

  res.json({ received: true });
});

export default router;
