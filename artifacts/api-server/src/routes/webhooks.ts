import { Router, type Request, type Response } from "express";
import Stripe from "stripe";
import { Pool } from "pg";
import { logger } from "../lib/logger";
import { createAttendeeRecord, TICKET_LABELS, TICKET_AMOUNTS } from "../lib/registration";
import { sendConfirmationSMS } from "../lib/sms";

const router = Router();

let pool: Pool | null = null;
function getPool(): Pool | null {
  if (!process.env["DATABASE_URL"]) return null;
  if (!pool) pool = new Pool({ connectionString: process.env["DATABASE_URL"], ssl: true });
  return pool;
}

router.post(
  "/webhooks/stripe",
  // raw body is set in app.ts for this route
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"];
    const stripeKey = process.env["STRIPE_SECRET_KEY"];

    if (!stripeKey) {
      res.status(503).json({ error: "Stripe not configured" });
      return;
    }

    const stripe = new Stripe(stripeKey);
    let event: Stripe.Event;

    try {
      if (webhookSecret && sig) {
        event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
      } else {
        event = JSON.parse((req.body as Buffer).toString()) as Stripe.Event;
      }
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
          ).catch(() => {});
        }

        logger.info({ registrationId: record.registration_id }, "Webhook: attendee created");
      } catch (err) {
        logger.error({ err }, "Webhook: failed to create attendee");
      }
    }

    res.json({ received: true });
  }
);

export default router;
