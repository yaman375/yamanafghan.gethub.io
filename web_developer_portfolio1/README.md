# Yaman Afghan — Professional Portfolio

This version includes:
- Professional responsive design
- Improved project presentation and conversion-focused contact CTA
- JavaScript navigation, animations and typing effect
- Real contact form backend
- Vercel serverless email endpoint
- Gmail SMTP support with Reply-To set to the client's email
- Basic input validation and honeypot anti-spam field

## 1. Configure email

Use a Gmail App Password for `yamanafghan210@gmail.com`.

1. Turn on 2-Step Verification for the Google account.
2. Create a Google App Password.
3. Copy the generated 16-character password.
4. On Vercel, add these environment variables:
   - `SMTP_USER` = `yamanafghan210@gmail.com`
   - `SMTP_PASS` = your 16-character Gmail App Password
   - `CONTACT_TO` = `yamanafghan210@gmail.com`

Never put the App Password inside frontend JavaScript or commit it to GitHub.

## 2. Deploy to Vercel

Upload this project as a Vercel project.

The static pages are served normally and `/api/contact` runs as a serverless function.

After deployment, open `/contact.html` and submit a test message. The message should arrive at `yamanafghan210@gmail.com`.

## 3. Run locally

Install Node.js, then from this folder:

```bash
npm install
```

Create a `.env` file using `.env.example` and add your Gmail App Password.

Then:

```bash
npm start
```

Open `http://localhost:3000`.

## Important

The contact form does not claim success until the backend successfully sends the email.
Client replies are routed through `Reply-To`, so clicking Reply in Gmail replies directly to the client.
