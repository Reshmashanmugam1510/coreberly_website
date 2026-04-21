import nodemailer from "nodemailer";

function buildTransport() {
  const service = process.env.SMTP_SERVICE;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "false") === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (service && user && pass) {
    return nodemailer.createTransport({
      service,
      auth: { user, pass }
    });
  }

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { name, email, phone, projectType, message } = body;

    if (!name || !email || !phone || !projectType || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transport = buildTransport();
    if (!transport) {
      return res.status(503).json({ error: "Mail service is not configured" });
    }

    const toAddress = process.env.CONTACT_TO || "coreberly@gmail.com";
    const fromAddress = process.env.MAIL_FROM || process.env.SMTP_USER || email;

    const subject = `Coreberly enquiry from ${name}`;
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Consultation Type: ${projectType}`,
      "",
      "Message:",
      message
    ].join("\n");

    const info = await transport.sendMail({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject,
      text
    });

    return res.status(200).json({ success: true, messageId: info.messageId || null });
  } catch {
    return res.status(500).json({ error: "Failed to send message" });
  }
}
