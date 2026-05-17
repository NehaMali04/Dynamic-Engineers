# Dynamic Engineers Backend

## Setup

1. Install dependencies:
```
cd backend
npm install
```

2. Configure `.env` file:
- Open `backend/.env`
- Set your Gmail App Password:
  - Go to: myaccount.google.com > Security > 2-Step Verification > App Passwords
  - Create app password for "Mail"
  - Paste it in `GMAIL_PASS`

3. Run the server:
```
npm start
```

Server runs on http://localhost:3001

## What it does
- POST /api/contact → sends email to Dynamicengineering4522@gmail.com + returns WhatsApp link
- Frontend opens WhatsApp with pre-filled message for Amol (7709052619)
- If backend is offline, form falls back to direct WhatsApp link
