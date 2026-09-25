const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname)));

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, project = "", message, website = "" } = req.body || {};
    if (website) return res.json({ success: true });
    if (!name || !email || !message) return res.status(400).json({ error: "Name, email and message are required." });

    const cleanName = String(name).trim().slice(0, 80);
    const cleanEmail = String(email).trim().slice(0, 160);
    const cleanProject = String(project).trim().slice(0, 120);
    const cleanMessage = String(message).trim().slice(0, 4000);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (cleanMessage.length < 10) return res.status(400).json({ error: "Please provide more project details." });
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return res.status(500).json({ error: "Email service is not configured yet." });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO || "yamanafghan210@gmail.com",
      replyTo: cleanEmail,
      subject: `New portfolio inquiry${cleanProject ? ` — ${cleanProject}` : ""}`,
      text: `New project inquiry\n\nName: ${cleanName}\nEmail: ${cleanEmail}\nProject: ${cleanProject || "Not specified"}\n\n${cleanMessage}`
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not send the message." });
  }
});

app.listen(PORT, () => console.log(`Portfolio running at http://localhost:${PORT}`));
