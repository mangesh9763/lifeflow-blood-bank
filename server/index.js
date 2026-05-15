import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const app = express();
const PORT = 5000;
const OTP_TTL_MS = 2 * 60 * 1000;
const otpStore = new Map();

app.use(cors());
app.use(express.json());

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
const client = TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN
  ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  : null;

function normalizePhone(phone) {
  return String(phone || "").replace(/\s+/g, "");
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function removeOtp(phone) {
  const entry = otpStore.get(phone);
  if (entry?.timeout) clearTimeout(entry.timeout);
  otpStore.delete(phone);
}

app.post("/api/send-otp", async (req, res) => {
  const phone = normalizePhone(req.body.phone);

  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    return res.status(400).json({ message: "Enter a valid phone number in international format, for example +919876543210." });
  }

  if (!client || !TWILIO_PHONE_NUMBER) {
    return res.status(500).json({ message: "Twilio is not configured. Create a .env file with your Twilio credentials." });
  }

  const otp = generateOtp();
  removeOtp(phone);

  const timeout = setTimeout(() => otpStore.delete(phone), OTP_TTL_MS);
  otpStore.set(phone, { otp, expiresAt: Date.now() + OTP_TTL_MS, timeout });

  try {
    await client.messages.create({
      body: `Your LifeFlow Blood Bank OTP is ${otp}. It expires in 2 minutes.`,
      from: TWILIO_PHONE_NUMBER,
      to: phone,
    });

    res.json({ message: "OTP sent successfully." });
  } catch (error) {
    removeOtp(phone);
    console.error("Twilio send error:", error);
    res.status(502).json({ message: "Could not send OTP. Check your Twilio account, phone number, and trial permissions." });
  }
});

app.post("/api/verify-otp", (req, res) => {
  const phone = normalizePhone(req.body.phone);
  const otp = String(req.body.otp || "").trim();
  const entry = otpStore.get(phone);

  if (!entry) {
    return res.status(400).json({ message: "OTP expired or not requested. Please resend the code." });
  }

  if (Date.now() > entry.expiresAt) {
    removeOtp(phone);
    return res.status(400).json({ message: "OTP expired. Please resend the code." });
  }

  if (entry.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP. Please check the code and try again." });
  }

  removeOtp(phone);
  res.json({ message: "OTP verified successfully." });
});

app.listen(PORT, () => {
  console.log(`OTP server running on http://localhost:${PORT}`);
});
