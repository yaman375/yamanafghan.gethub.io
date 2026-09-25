const nodemailer = require("nodemailer");

const TO_EMAIL = process.env.CONTACT_TO || "yamanafghan210@gmail.com";

function json(res, status, body) {
  res.status(status).json(body);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed." });

  try {
    const { name, email, project = "", message, website = "" } = req.body || {};

    // Honeypot: quiet success for basic bots.
    if (website) return json(res, 200, { success: true });

    if (!name || !email || !message) {
      return json(res, 400, { error: "Name, email and message are required." });
    }

    const cleanName = String(name).trim().slice(0, 80);
    const cleanEmail = String(email).trim().slice(0, 160);
    const cleanProject = String(project).trim().slice(0, 120);
    const cleanMessage = String(message).trim().slice(0, 4000);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(cleanEmail)) {
      return json(res, 400, { error: "Please enter a valid email address." });
    }
    if (cleanMessage.length < 10) {
      return json(res, 400, { error: "Please provide a little more detail about your project." });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return json(res, 500, { error: "Email service is not configured yet." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: TO_EMAIL,
      replyTo: cleanEmail,
      subject: `New portfolio inquiry${cleanProject ? ` — ${cleanProject}` : ""}`,
      text:
`New project inquiry from your portfolio

Name: ${cleanName}
Email: ${cleanEmail}
Project type: ${cleanProject || "Not specified"}

Message:
${cleanMessage}

Reply directly to this email to contact the client.`
    });

    return json(res, 200, { success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return json(res, 500, { error: "Could not send the message. Please try again later." });
  }
};
