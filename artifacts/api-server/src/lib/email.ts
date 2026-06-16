import nodemailer from "nodemailer";
import { logger } from "./logger";

const SUPPORT_EMAIL = "Support@LBCwealthanddevelopmentsummit.com";

function createTransporter() {
  const host = process.env["SMTP_HOST"];
  const user = process.env["SMTP_USER"];
  const pass = process.env["SMTP_PASS"];
  if (!host || !user || !pass) return null;

  const port = parseInt(process.env["SMTP_PORT"] ?? "587", 10);
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export interface SponsorInquiryData {
  name: string;
  organization: string;
  email: string;
  phone?: string | null;
  interest: string;
  message?: string | null;
}

export async function sendSponsorInquiryEmail(data: SponsorInquiryData): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) {
    logger.warn("SMTP not configured — sponsor inquiry email not sent");
    return;
  }

  const interestLabels: Record<string, string> = {
    corporate: "Corporate Sponsorship",
    local: "Local Business Partner",
    financial: "Financial Institution",
    nonprofit: "Nonprofit / Community Group",
    veteran: "Veteran Organization",
    media: "Media Partner",
    vendor: "Vendor / Exhibitor",
    other: "Other",
  };

  const interestLabel = interestLabels[data.interest] ?? data.interest;
  const fromAddress = process.env["SMTP_USER"] ?? SUPPORT_EMAIL;

  const textBody = [
    "New Sponsor Inquiry — LBC Wealth & Development Summit 2026",
    "=".repeat(58),
    `Contact Name:      ${data.name}`,
    `Organization:      ${data.organization}`,
    `Email:             ${data.email}`,
    `Phone:             ${data.phone || "Not provided"}`,
    `Partnership Type:  ${interestLabel}`,
    `Message:           ${data.message || "None"}`,
    "",
    "Reply directly to this email to respond to the inquiry.",
  ].join("\n");

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0f1729;color:#ffffff;border-radius:12px;">
      <div style="background:#c79d35;padding:16px 24px;border-radius:8px 8px 0 0;margin:-24px -24px 24px;">
        <h2 style="margin:0;color:#0a0f1e;font-size:18px;">New Sponsor Inquiry</h2>
        <p style="margin:4px 0 0;color:#0a0f1e;font-size:13px;opacity:0.8;">LBC Wealth &amp; Development Summit 2026</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:#9ca3af;width:140px;">Contact Name</td><td style="padding:8px 0;color:#ffffff;font-weight:600;">${esc(data.name)}</td></tr>
        <tr><td style="padding:8px 0;color:#9ca3af;">Organization</td><td style="padding:8px 0;color:#ffffff;font-weight:600;">${esc(data.organization)}</td></tr>
        <tr><td style="padding:8px 0;color:#9ca3af;">Email</td><td style="padding:8px 0;"><a href="mailto:${esc(data.email)}" style="color:#c79d35;">${esc(data.email)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#9ca3af;">Phone</td><td style="padding:8px 0;color:#ffffff;">${esc(data.phone || "Not provided")}</td></tr>
        <tr><td style="padding:8px 0;color:#9ca3af;">Partnership</td><td style="padding:8px 0;color:#ffffff;">${esc(interestLabel)}</td></tr>
        ${data.message ? `<tr><td style="padding:8px 0;color:#9ca3af;vertical-align:top;">Message</td><td style="padding:8px 0;color:#ffffff;">${esc(data.message)}</td></tr>` : ""}
      </table>
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.1);font-size:12px;color:#6b7280;">
        Reply directly to this email to respond to the inquiry at <a href="mailto:${esc(data.email)}" style="color:#c79d35;">${esc(data.email)}</a>.
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"LBC Summit" <${fromAddress}>`,
      to: SUPPORT_EMAIL,
      replyTo: data.email,
      subject: `New Sponsor Inquiry — ${data.organization} (${interestLabel})`,
      text: textBody,
      html: htmlBody,
    });
    logger.info({ organization: data.organization, interest: data.interest }, "Sponsor inquiry email sent");
  } catch (err) {
    logger.error({ err }, "Failed to send sponsor inquiry email");
  }
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
