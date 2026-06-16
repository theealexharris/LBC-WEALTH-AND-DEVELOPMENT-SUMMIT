import { logger } from "./logger";

export async function sendSMS(to: string, body: string): Promise<void> {
  const fromNumber = process.env["TWILIO_PHONE_NUMBER"];
  const accountSid = process.env["TWILIO_ACCOUNT_SID"];
  const authToken = process.env["TWILIO_AUTH_TOKEN"];

  if (!fromNumber || !accountSid || !authToken) {
    logger.warn("Twilio not configured — SMS not sent");
    return;
  }

  try {
    const { default: twilio } = await import("twilio");
    const client = twilio(accountSid, authToken);
    await client.messages.create({ body, from: fromNumber, to });
    logger.info({ to: to.replace(/\d(?=\d{4})/g, "*") }, "SMS sent");
  } catch (err) {
    logger.error({ err }, "Failed to send SMS");
  }
}

export async function sendConfirmationSMS(
  phone: string,
  registrationId: string,
  ticketType: string,
  firstName: string
): Promise<void> {
  const body =
    `Hi ${firstName}! Your registration for the LBC Wealth & Development Summit 2026 is confirmed. ` +
    `Ticket: ${ticketType}. Registration ID: ${registrationId}. ` +
    `Event: Aug 15-16, 2026 | Hotel Current, Long Beach, CA. See you there!`;
  await sendSMS(phone, body);
}
