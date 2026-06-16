import { randomBytes } from "node:crypto";
// Note: generatePaymentId() is intentionally separate from generateRegistrationId()
// to prevent ID namespace collisions between attendee and payment records.
import QRCode from "qrcode";
import type { Pool } from "pg";

export function generateRegistrationId(): string {
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `LBC-2026-${rand}`;
}

export function generateTicketNumber(): string {
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `TKT-${rand}`;
}

export function generatePaymentId(): string {
  const rand = randomBytes(4).toString("hex").toUpperCase();
  return `PAY-${rand}`;
}

export async function generateQRCode(registrationId: string): Promise<string> {
  return QRCode.toDataURL(registrationId, { width: 300, margin: 2 });
}

export const TICKET_LABELS: Record<string, string> = {
  general: "General Admission",
  general_plus_one: "General Admission + Guest",
  vip: "VIP Admission",
  vip_plus_one: "VIP Admission + Guest",
  executive: "Executive Sponsor Pass",
};

export const TICKET_AMOUNTS: Record<string, number> = {
  general: 2500,
  general_plus_one: 3500,
  vip: 9700,
  vip_plus_one: 14500,
  executive: 25000,
};

export const PRICE_IDS: Record<string, string> = {
  general: "price_1TikgcGWCvAl090EVzNs0rdA",
  general_plus_one: "price_1TikmvGWCvAl090EC1kbHIk3",
  vip: "price_1TikpXGWCvAl090EAQwd14ft",
  vip_plus_one: "price_1Tiks1GWCvAl090Eqse5mKsf",
  executive: "price_1Tikx2GWCvAl090EvsbqvkIS",
};

export interface AttendeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  jobTitle?: string;
  city?: string;
  state?: string;
  accessibilityNeeds?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  ticketType: string;
  amountPaid: number;
  stripeSessionId: string;
  agreeTerms: boolean;
  agreeUpdates: boolean;
  agreeSms: boolean;
}

export async function createAttendeeRecord(pool: Pool, data: AttendeeData) {
  const existing = await pool.query(
    "SELECT registration_id, ticket_number FROM attendees WHERE stripe_session_id = $1",
    [data.stripeSessionId]
  );
  if (existing.rows.length > 0) {
    return existing.rows[0] as { registration_id: string; ticket_number: string };
  }

  const registrationId = generateRegistrationId();
  const ticketNumber = generateTicketNumber();
  const qrCode = await generateQRCode(registrationId);

  await pool.query(
    `INSERT INTO attendees (
      registration_id, ticket_number, first_name, last_name, email, phone,
      company, job_title, city, state, accessibility_needs,
      emergency_contact_name, emergency_contact_phone,
      ticket_type, amount_paid, payment_status, stripe_session_id,
      qr_code, agree_terms, agree_updates, agree_sms
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'paid',$16,$17,$18,$19,$20)`,
    [
      registrationId, ticketNumber,
      data.firstName, data.lastName, data.email, data.phone,
      data.company || null, data.jobTitle || null,
      data.city || null, data.state || null, data.accessibilityNeeds || null,
      data.emergencyContactName || null, data.emergencyContactPhone || null,
      data.ticketType, data.amountPaid, data.stripeSessionId,
      qrCode, data.agreeTerms, data.agreeUpdates, data.agreeSms,
    ]
  );

  await pool.query(
    `INSERT INTO payments (payment_id, registration_id, stripe_session_id, amount, status)
     VALUES ($1, $2, $3, $4, 'paid')`,
    [generatePaymentId(), registrationId, data.stripeSessionId, data.amountPaid]
  );

  return { registration_id: registrationId, ticket_number: ticketNumber };
}
