require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const nodemailer = require('nodemailer');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('../')); // serve frontend from root

// ── Email transporter (Gmail) ──────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,   // Gmail App Password
  },
});

// ── POST /api/contact ──────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ success: false, error: 'Name and message are required.' });
  }

  // 1. Send email to owner
  try {
    await transporter.sendMail({
      from: `"Dynamic Engineers Website" <${process.env.GMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `New Enquiry from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#0a1628,#c0392b);padding:20px 24px;">
            <h2 style="color:white;margin:0;font-size:1.2rem;">New Enquiry — Dynamic Engineers</h2>
          </div>
          <div style="padding:24px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Email:</strong> ${email || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <p style="background:#f7f8fc;padding:14px;border-radius:8px;border-left:4px solid #c0392b;">${message}</p>
          </div>
          <div style="background:#f7f8fc;padding:12px 24px;font-size:0.8rem;color:#888;">
            Sent from Dynamic Engineers website contact form
          </div>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error('Email error:', emailErr.message);
    // Don't fail the whole request if email fails
  }

  // 2. Build WhatsApp wa.me link (returned to frontend to open)
  const waText = encodeURIComponent(
    `Hello Dynamic Engineers,\n\n*New Enquiry Received*\n\n*Name:* ${name}\n*Phone:* ${phone || 'N/A'}\n*Email:* ${email || 'N/A'}\n\n*Message:*\n${message}`
  );
  const waLink = `https://wa.me/${process.env.OWNER_PHONE}?text=${waText}`;

  return res.json({ success: true, waLink });
});

// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`✅ Dynamic Engineers backend running on http://localhost:${PORT}`);
});
