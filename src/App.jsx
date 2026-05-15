import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Download,
  Droplets,
  Edit,
  FileText,
  Filter,
  Heart,
  LayoutDashboard,
  LogOut,
  Mail,
  MoreVertical,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import emailjs from "@emailjs/browser";

const T = {
  bg0: "#07080f", bg1: "#0c0e1a", card: "#111420", card2: "#161928",
  border: "rgba(255,255,255,0.06)", border2: "rgba(255,255,255,0.11)",
  red: "#e03535", redL: "rgba(224,53,53,0.13)",
  green: "#2f9e44", greenL: "rgba(47,158,68,0.13)",
  amber: "#e67700", amberL: "rgba(230,119,0,0.13)",
  blue: "#1971c2", blueL: "rgba(25,113,194,0.13)",
  purple: "#7048e8", purpleL: "rgba(112,72,232,0.13)",
  t0: "#f1f3f5", t1: "#adb5bd", t2: "#6c757d", t3: "#495057",
};

const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const COMPONENTS = ["Whole Blood", "Plasma", "Platelets", "RBC"];
const ROLES = ["Administrator", "Hospital Staff", "Blood Bank Staff", "Requester"];
const AVATAR_COLORS = ["#e03535", "#1971c2", "#2f9e44", "#7048e8", "#e67700", "#0c8599", "#9c36b5", "#e8590c"];

const INITIAL_INVENTORY = [
  { type: "A+", units: 45, cap: 100, expiring: 3, color: "#e03535" },
  { type: "A-", units: 12, cap: 50, expiring: 1, color: "#c92a2a" },
  { type: "B+", units: 38, cap: 80, expiring: 2, color: "#e8590c" },
  { type: "B-", units: 5, cap: 40, expiring: 0, color: "#d9480f" },
  { type: "AB+", units: 22, cap: 60, expiring: 1, color: "#9c36b5" },
  { type: "AB-", units: 3, cap: 30, expiring: 0, color: "#7048e8" },
  { type: "O+", units: 67, cap: 120, expiring: 5, color: "#1971c2" },
  { type: "O-", units: 8, cap: 80, expiring: 2, color: "#0c8599" },
];

const MONTHLY = [
  { m: "Jan", donated: 124, used: 98 }, { m: "Feb", donated: 145, used: 112 },
  { m: "Mar", donated: 132, used: 125 }, { m: "Apr", donated: 167, used: 143 },
  { m: "May", donated: 189, used: 156 }, { m: "Jun", donated: 201, used: 178 },
];

const INITIAL_DONORS = [
  { id: 1, name: "Rajesh Kumar", blood: "O+", last: "15 Nov 2024", eligible: true, count: 8, phone: "+919876543210" },
  { id: 2, name: "Priya Sharma", blood: "A+", last: "01 Dec 2024", eligible: true, count: 12, phone: "+918765432109" },
  { id: 3, name: "Amit Patel", blood: "B+", last: "10 Jan 2025", eligible: false, count: 5, phone: "+917654321098" },
  { id: 4, name: "Sunita Verma", blood: "AB-", last: "20 Oct 2024", eligible: true, count: 3, phone: "+916543210987" },
  { id: 5, name: "Vikram Singh", blood: "O-", last: "05 Feb 2025", eligible: false, count: 7, phone: "+915432109876" },
  { id: 6, name: "Meera Nair", blood: "A-", last: "14 Sep 2024", eligible: true, count: 15, phone: "+914321098765" },
];

const INITIAL_REQUESTS = [
  { id: "REQ-001", hospital: "AIIMS Mumbai", blood: "O-", units: 3, urgency: "critical", status: "pending", date: "15 May 2025" },
  { id: "REQ-002", hospital: "Lilavati Hospital", blood: "A+", units: 2, urgency: "high", status: "approved", date: "14 May 2025" },
  { id: "REQ-003", hospital: "Hinduja Hospital", blood: "B+", units: 5, urgency: "normal", status: "fulfilled", date: "13 May 2025" },
  { id: "REQ-004", hospital: "Kokilaben Hosp.", blood: "AB+", units: 1, urgency: "high", status: "pending", date: "12 May 2025" },
  { id: "REQ-005", hospital: "Breach Candy Hosp.", blood: "O+", units: 4, urgency: "normal", status: "fulfilled", date: "11 May 2025" },
  { id: "REQ-006", hospital: "Jaslok Hospital", blood: "A-", units: 2, urgency: "critical", status: "pending", date: "10 May 2025" },
];

const INITIAL_UNITS = [
  { id: "BU-2501", type: "O+", comp: "Whole Blood", collected: "10 May 2025", expires: "10 Jun 2025", status: "available" },
  { id: "BU-2502", type: "A-", comp: "Plasma", collected: "08 May 2025", expires: "06 Jun 2025", status: "reserved" },
  { id: "BU-2503", type: "B+", comp: "Platelets", collected: "05 May 2025", expires: "12 May 2025", status: "expiring" },
  { id: "BU-2504", type: "AB+", comp: "RBC", collected: "12 May 2025", expires: "12 Jul 2025", status: "available" },
  { id: "BU-2505", type: "O-", comp: "Whole Blood", collected: "13 May 2025", expires: "13 Jun 2025", status: "available" },
];

const INITIAL_USERS = [
  { id: 1, name: "Admin User", email: "admin@bloodbank.in", role: "Administrator", status: "active", last: "Just now" },
  { id: 2, name: "Dr. Anita Rao", email: "anita.rao@aiims.in", role: "Hospital Staff", status: "active", last: "2 hrs ago" },
  { id: 3, name: "Suresh Menon", email: "suresh@bloodbank.in", role: "Blood Bank Staff", status: "active", last: "1 day ago" },
  { id: 4, name: "Kavya Iyer", email: "kavya@lilavati.in", role: "Requester", status: "inactive", last: "3 days ago" },
];

const STATUS_CFG = {
  pending: { bg: T.amberL, color: T.amber, label: "Pending" },
  approved: { bg: T.blueL, color: T.blue, label: "Approved" },
  fulfilled: { bg: T.greenL, color: T.green, label: "Fulfilled" },
  critical: { bg: T.redL, color: T.red, label: "Critical" },
  high: { bg: T.amberL, color: T.amber, label: "High" },
  normal: { bg: T.greenL, color: T.green, label: "Normal" },
  available: { bg: T.greenL, color: T.green, label: "Available" },
  reserved: { bg: T.blueL, color: T.blue, label: "Reserved" },
  expiring: { bg: T.amberL, color: T.amber, label: "Expiring" },
  active: { bg: T.greenL, color: T.green, label: "Active" },
  inactive: { bg: T.border, color: T.t2, label: "Inactive" },
};

function avatarColor(i) { return AVATAR_COLORS[i % AVATAR_COLORS.length]; }
function initials(name) { return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(); }
function avatarColorForEmail(email) {
  const code = Array.from(String(email || "")).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}
function userDisplayNameFromEmail(email) {
  const local = String(email || "").split("@")[0] || "User";
  const parts = local.split(/[._-]+/).filter(Boolean);
  return parts.length ? parts.map((part) => part[0].toUpperCase() + part.slice(1)).join(" ") : "User";
}
function getUserRoleForEmail(email) {
  const normalized = String(email || "").toLowerCase();
  if (normalized.endsWith("@bloodbank.in")) return "Administrator";
  if (normalized.includes("aiims") || normalized.includes("hospital")) return "Hospital Staff";
  return "Requester";
}
function today() { return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
function generateOtp() { return String(Math.floor(100000 + Math.random() * 900000)); }

function downloadCsv(filename, rows) {
  if (!rows.length) {
    alert("There is no visible data to export.");
    return;
  }
  const headers = Object.keys(rows[0]);
  const escapeCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [headers.join(","), ...rows.map((row) => headers.map((h) => escapeCell(row[h])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function Card({ children, style }) {
  return <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, ...style }}>{children}</div>;
}

function Btn({ onClick, children, variant = "ghost", style = {}, disabled = false }) {
  const styles = {
    primary: { background: disabled ? T.card2 : T.red, color: "#fff" },
    ghost: { background: T.card2, border: `1px solid ${T.border}`, color: T.t1 },
    text: { background: "none", color: T.red, padding: "4px 0" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: "flex", alignItems: "center", gap: 6, border: "none", borderRadius: 8,
      padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit", opacity: disabled ? 0.72 : 1, ...styles[variant], ...style,
    }}>
      {children}
    </button>
  );
}

function IconButton({ children, onClick, tone = T.t2, title }) {
  return (
    <button title={title} onClick={onClick} style={{
      background: "none", border: "none", cursor: "pointer", color: tone,
      display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 4,
    }}>
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 7, color: T.t2, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {label}
      {children}
    </label>
  );
}

function Input(props) {
  return <input {...props} style={{ background: T.card2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 12px", color: T.t0, outline: "none", fontFamily: "inherit", fontSize: 14, ...props.style }} />;
}

function Select(props) {
  return <select {...props} style={{ background: T.card2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "11px 12px", color: T.t0, outline: "none", fontFamily: "inherit", fontSize: 14, ...props.style }} />;
}

function BloodBadge({ type, small }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", background: T.redL,
      color: T.red, border: "1px solid rgba(224,53,53,0.28)", borderRadius: 6,
      padding: small ? "2px 8px" : "4px 12px", fontSize: small ? 11 : 13,
      fontWeight: 700,
    }}>{type}</span>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || { bg: T.border, color: T.t2, label: status };
  return <span style={{ display: "inline-block", background: cfg.bg, color: cfg.color, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>{cfg.label}</span>;
}

function Modal({ title, children, onClose, footer }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 20, background: "rgba(0,0,0,0.68)", display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
      <Card style={{ width: 430, maxWidth: "100%", padding: 22, boxShadow: "0 24px 80px rgba(0,0,0,0.45)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ color: T.t0, fontSize: 18, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.t2, fontSize: 24, cursor: "pointer", lineHeight: 1 }}>x</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
        {footer && <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>{footer}</div>}
      </Card>
    </div>
  );
}

function LoginScreen({ onNext, onSkip }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        throw new Error("Enter a valid email address, for example student@gmail.com.");
      }
      if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
        throw new Error("EmailJS is not configured yet. Add your EmailJS VITE_* values in .env.");
      }
      const otp = generateOtp();
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          to_email: cleanEmail,
          otp,
          code: otp,
          passcode: otp,
          otp_code: otp,
          to_name: cleanEmail.split("@")[0],
          valid_for: "2 minutes",
          valid_until: new Date(Date.now() + 120000).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        { publicKey: EMAILJS_CONFIG.publicKey },
      );
      onNext(cleanEmail, otp);
    } catch (err) {
      setError(err.message || "Could not send OTP email. Check your EmailJS service and template settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: 700, background: T.bg0, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ flex: 1, background: "#0c0614", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 56, position: "relative", overflow: "hidden" }}>
        {[320, 480, 640, 800].map((s, i) => (
          <div key={s} style={{ position: "absolute", width: s, height: s, borderRadius: "50%", border: `1px solid rgba(224,53,53,${0.07 - i * 0.012})`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        ))}
        <div style={{ position: "relative", textAlign: "center" }}>
          <svg width={88} height={108} viewBox="0 0 88 108" style={{ marginBottom: 28 }}>
            <path d="M44 6 C44 6 10 50 10 70 C10 90 25 102 44 102 C63 102 78 90 78 70 C78 50 44 6 44 6Z" fill={T.red} />
            <ellipse cx="34" cy="74" rx="10" ry="14" fill="rgba(255,255,255,0.08)" />
            <path d="M30 72 C30 64 36 58 44 58" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
          <h1 style={{ color: T.t0, fontSize: 26, fontWeight: 800, margin: "0 0 10px" }}>LifeFlow Blood Bank</h1>
          <p style={{ color: T.t2, fontSize: 14, lineHeight: 1.7, maxWidth: 280, margin: "0 auto 40px" }}>Secure blood inventory management with mobile OTP access.</p>
          <div style={{ display: "flex", gap: 36 }}>
            {[["200+", "Active Donors"], ["8", "Blood Types"], ["2 min", "OTP Expiry"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ color: T.red, fontSize: 20, fontWeight: 800 }}>{n}</div>
                <div style={{ color: T.t3, fontSize: 11, marginTop: 3, textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ width: 460, display: "flex", flexDirection: "column", justifyContent: "center", padding: 56, background: T.bg1, borderLeft: `1px solid ${T.border}` }}>
        <div style={{ marginBottom: 34 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: T.red, display: "flex", alignItems: "center", justifyContent: "center" }}><Droplets size={20} color="#fff" /></div>
            <span style={{ fontWeight: 700, fontSize: 15, color: T.t0 }}>LifeFlow</span>
          </div>
          <h2 style={{ color: T.t0, fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>Welcome back</h2>
          <p style={{ color: T.t2, fontSize: 14, margin: 0 }}>Sign in with your email address.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Field label="Email Address">
            <div style={{ position: "relative" }}>
              <Mail size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.t3 }} />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@gmail.com" style={{ width: "100%", boxSizing: "border-box", paddingLeft: 42 }} />
            </div>
          </Field>
          {error && <div style={{ color: T.red, background: T.redL, border: "1px solid rgba(224,53,53,0.22)", borderRadius: 8, padding: 12, fontSize: 13, lineHeight: 1.5 }}>{error}</div>}
          <button onClick={submit} disabled={loading} style={{ background: loading ? T.card2 : T.red, color: "#fff", border: "none", borderRadius: 8, padding: "13px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
            {loading && <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} />}
            {loading ? "Sending OTP..." : "Sign In"}
          </button>
          <button onClick={onSkip} disabled={loading} style={{ background: "none", color: T.t1, border: `1px solid ${T.border2}`, borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            Skip OTP and Enter App
          </button>
        </div>
        <div style={{ marginTop: 24, padding: 16, background: T.card, borderRadius: 8, border: `1px solid ${T.border}` }}>
          <p style={{ color: T.t2, fontSize: 12, margin: 0, lineHeight: 1.6 }}>Use any valid email address. EmailJS will send a 6-digit OTP to that inbox.</p>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function OTPScreen({ email, expectedOtp, expiresAt, onVerify, onBack }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const refs = useRef([]);

  useEffect(() => {
    if (timer <= 0) return undefined;
    const t = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleInput = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const verify = async () => {
    setError("");
    setLoading(true);
    try {
      if (!expectedOtp || !expiresAt) {
        throw new Error("OTP session is missing. Please go back and send the code again.");
      }
      if (Date.now() > expiresAt) {
        throw new Error("OTP expired. Please send a new code.");
      }
      if (otp.join("") !== expectedOtp) {
        throw new Error("Invalid OTP.");
      }
      onVerify();
    } catch (err) {
      setError(err.message || "Invalid or expired OTP. Please check the email code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError("");
    setResending(true);
    try {
      onBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  const complete = otp.join("").length === 6;
  const mm = String(Math.floor(timer / 60)).padStart(2, "0");
  const ss = String(timer % 60).padStart(2, "0");

  return (
    <div style={{ minHeight: 700, background: T.bg0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "48px 44px", width: 400, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.redL, border: "1px solid rgba(224,53,53,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Shield size={28} color={T.red} />
        </div>
        <h2 style={{ color: T.t0, fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>Verify Identity</h2>
        <p style={{ color: T.t2, fontSize: 14, margin: "0 0 28px", lineHeight: 1.6 }}>A 6-digit code was sent to<br /><strong style={{ color: T.t1 }}>{email}</strong></p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
          {otp.map((v, i) => (
            <input key={i} ref={(el) => { refs.current[i] = el; }} value={v} onChange={(e) => handleInput(i, e.target.value)} onKeyDown={(e) => { if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus(); }} maxLength={1} style={{ width: 48, height: 58, textAlign: "center", fontSize: 24, fontWeight: 800, background: T.card2, borderRadius: 8, border: `2px solid ${v ? T.red : T.border2}`, color: T.t0, outline: "none", fontFamily: "inherit" }} />
          ))}
        </div>
        <div style={{ color: T.t2, fontSize: 13, marginBottom: 18, minHeight: 20 }}>
          {timer > 0 ? <span>Expires in <strong style={{ color: T.amber }}>{mm}:{ss}</strong></span> : <button onClick={resend} disabled={resending} style={{ background: "none", border: "none", color: T.red, cursor: "pointer", fontFamily: "inherit" }}>Send code again</button>}
        </div>
        {error && <div style={{ color: T.red, background: T.redL, border: "1px solid rgba(224,53,53,0.22)", borderRadius: 8, padding: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}
        <button onClick={verify} disabled={!complete || loading} style={{ width: "100%", background: complete ? T.red : T.card2, border: "none", borderRadius: 8, padding: 13, color: "#fff", fontSize: 15, fontWeight: 700, cursor: complete ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
          {loading && <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} />}
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>
        <p style={{ color: T.t2, fontSize: 13, marginTop: 18 }}>Didn't receive it? <button onClick={resend} disabled={resending} style={{ background: "none", border: "none", color: T.red, cursor: "pointer", fontFamily: "inherit", padding: 0 }}>{resending ? "Opening..." : "Send code again"}</button></p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function MainApp({ data, actions, currentUser, page, setPage, onLogout }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const nav = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "inventory", icon: Package, label: "Inventory" },
    { id: "requests", icon: FileText, label: "Requests", badge: data.requests.filter((r) => r.status === "pending").length },
    { id: "donors", icon: Heart, label: "Donors" },
    { id: "users", icon: Users, label: "Users" },
  ];

  return (
    <div style={{ display: "flex", minHeight: 860, background: T.bg0, fontFamily: "'DM Sans', system-ui, sans-serif", color: T.t0 }}>
      <div style={{ width: 232, background: T.bg1, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, alignSelf: "flex-start", minHeight: 860 }}>
        <div style={{ padding: "22px 18px 16px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: T.red, display: "flex", alignItems: "center", justifyContent: "center" }}><Droplets size={20} color="#fff" /></div>
            <div><div style={{ fontWeight: 800, fontSize: 14 }}>LifeFlow</div><div style={{ fontSize: 11, color: T.t3 }}>Blood Bank System</div></div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "14px 10px" }}>
          <div style={{ fontSize: 10, color: T.t3, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 8px 8px" }}>Main Menu</div>
          {nav.map(({ id, icon: Icon, label, badge }) => {
            const active = page === id;
            return (
              <button key={id} onClick={() => setPage(id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px", borderRadius: 8, marginBottom: 2, background: active ? T.redL : "none", border: `1px solid ${active ? "rgba(224,53,53,0.22)" : "transparent"}`, color: active ? T.red : T.t2, fontSize: 13, fontWeight: active ? 700 : 400, cursor: "pointer", textAlign: "left" }}>
                <Icon size={17} /> {label}
                {!!badge && <span style={{ marginLeft: "auto", background: T.red, color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 800 }}>{badge}</span>}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "10px 10px 18px", borderTop: `1px solid ${T.border}` }}>
          <button onClick={() => setSettingsOpen(true)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px", borderRadius: 8, background: "none", border: "none", color: T.t2, fontSize: 13, cursor: "pointer" }}><Settings size={17} /> Settings</button>
          <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px", borderRadius: 8, background: "none", border: "none", color: T.red, fontSize: 13, cursor: "pointer" }}><LogOut size={17} /> Sign Out</button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 8px 0", marginTop: 8, borderTop: `1px solid ${T.border}` }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: avatarColorForEmail(currentUser.email), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{initials(currentUser.name)}</div>
            <div><div style={{ fontSize: 13, fontWeight: 700 }}>{currentUser.name}</div><div style={{ fontSize: 11, color: T.t3 }}>{currentUser.role}</div></div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ background: T.bg1, borderBottom: `1px solid ${T.border}`, padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "7px 14px" }}>
            <Search size={14} color={T.t3} /><input placeholder="Search..." style={{ background: "none", border: "none", color: T.t1, outline: "none", fontSize: 13, width: 180, fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => alert(`${data.requests.filter((r) => r.status === "pending").length} pending blood requests need attention.`)} style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "7px 10px", cursor: "pointer", color: T.t1, display: "flex", alignItems: "center" }}><Bell size={16} /></button>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: avatarColorForEmail(currentUser.email), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{initials(currentUser.name)}</div>
          </div>
        </div>
        <div style={{ padding: 24 }}>
          {page === "dashboard" && <DashboardPage data={data} setPage={setPage} />}
          {page === "inventory" && <InventoryPage data={data} actions={actions} />}
          {page === "requests" && <RequestsPage data={data} actions={actions} />}
          {page === "donors" && <DonorsPage data={data} actions={actions} />}
          {page === "users" && <UsersPage data={data} actions={actions} />}
        </div>
      </div>

      {settingsOpen && (
        <Modal title="Settings" onClose={() => setSettingsOpen(false)} footer={<Btn variant="primary" onClick={() => setSettingsOpen(false)}>Save Settings</Btn>}>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: T.t1, fontSize: 14 }}>SMS alerts <input type="checkbox" defaultChecked style={{ accentColor: T.red }} /></label>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: T.t1, fontSize: 14 }}>Low stock reminders <input type="checkbox" defaultChecked style={{ accentColor: T.red }} /></label>
          <Field label="Default branch"><Input defaultValue="Mumbai Central Blood Bank" /></Field>
        </Modal>
      )}
    </div>
  );
}

function DashboardPage({ data, setPage }) {
  const pieData = data.inventory.map((b) => ({ name: b.type, value: b.units }));
  const pieColors = data.inventory.map((b) => b.color);
  const pending = data.requests.filter((r) => r.status === "pending").length;
  const stats = [
    { label: "Total Blood Units", value: String(data.inventory.reduce((s, b) => s + b.units, 0)), delta: "+12%", up: true, icon: Droplets, color: T.red },
    { label: "Active Donors", value: String(data.donors.length), delta: "+8%", up: true, icon: Users, color: T.green },
    { label: "Pending Requests", value: String(pending), delta: "+3", up: false, icon: Clock, color: T.amber },
    { label: "Critical Stock", value: String(data.inventory.filter((b) => b.units / b.cap < 0.2).length), delta: "Types", up: false, icon: AlertTriangle, color: T.purple },
  ];

  return (
    <div>
      <div style={{ marginBottom: 22 }}><h1 style={{ fontSize: 21, fontWeight: 800, margin: "0 0 4px" }}>Dashboard</h1><p style={{ color: T.t2, fontSize: 13, margin: 0 }}>Friday, 15 May 2025 - Good morning, Admin</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {stats.map(({ label, value, delta, up, icon: Icon, color }) => (
          <Card key={label} style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}><div style={{ width: 38, height: 38, borderRadius: 8, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={19} color={color} /></div><span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, color: up ? T.green : T.amber }}>{up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{delta}</span></div>
            <div style={{ fontSize: 30, fontWeight: 800 }}>{value}</div><div style={{ fontSize: 12, color: T.t2, marginTop: 4 }}>{label}</div>
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginBottom: 18 }}>
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, margin: "0 0 16px" }}>Donation vs Usage Trend</h3>
          <div style={{ height: 200 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={MONTHLY} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} /><XAxis dataKey="m" tick={{ fill: T.t2, fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: T.t2, fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: T.card2, border: `1px solid ${T.border2}`, borderRadius: 8, color: T.t0, fontSize: 12 }} /><Area type="monotone" dataKey="donated" stroke={T.red} strokeWidth={2} fill="rgba(224,53,53,0.18)" /><Area type="monotone" dataKey="used" stroke={T.blue} strokeWidth={2} fill="rgba(25,113,194,0.16)" /></AreaChart></ResponsiveContainer></div>
        </Card>
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, margin: "0 0 12px" }}>Stock Distribution</h3>
          <div style={{ height: 200 }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={82} paddingAngle={3} dataKey="value">{pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}</Pie><Tooltip contentStyle={{ background: T.card2, border: `1px solid ${T.border2}`, borderRadius: 8, color: T.t0, fontSize: 12 }} /></PieChart></ResponsiveContainer></div>
        </Card>
      </div>
      <Card style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><h3 style={{ fontSize: 14, margin: 0 }}>Recent Requests</h3><button onClick={() => setPage("requests")} style={{ background: "none", border: "none", color: T.red, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>View all</button></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data.requests.slice(0, 4).map((r) => <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: T.card2, borderRadius: 8, border: `1px solid ${T.border}` }}><BloodBadge type={r.blood} small /><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{r.hospital}</div><div style={{ fontSize: 11, color: T.t2 }}>{r.units} units - {r.date}</div></div><StatusBadge status={r.status} /></div>)}
        </div>
      </Card>
    </div>
  );
}

function InventoryPage({ data, actions }) {
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ type: "O+", comp: "Whole Blood", collected: today(), expires: "30 Jun 2025", status: "available" });
  const visibleUnits = filter === "all" ? data.units : data.units.filter((u) => u.status === filter);

  const save = () => {
    if (modal?.mode === "edit") actions.updateUnit(modal.item.id, form);
    else actions.addUnit(form);
    setModal(null);
  };

  return (
    <div>
      <Header title="Blood Inventory" subtitle="Manage blood units across all types and components" action={<Btn variant="primary" onClick={() => { setForm({ type: "O+", comp: "Whole Blood", collected: today(), expires: "30 Jun 2025", status: "available" }); setModal({ mode: "add" }); }}><Plus size={15} /> Add Blood Unit</Btn>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {data.inventory.map((b) => {
          const pct = (b.units / b.cap) * 100;
          const bar = pct < 20 ? T.red : pct < 40 ? T.amber : T.green;
          return <Card key={b.type} style={{ padding: 16 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><span style={{ fontSize: 22, fontWeight: 900, color: b.color }}>{b.type}</span>{pct < 20 && <AlertTriangle size={15} color={T.red} />}</div><div style={{ fontSize: 30, fontWeight: 800 }}>{b.units}</div><div style={{ fontSize: 11, color: T.t2, marginBottom: 10 }}>of {b.cap} units cap.</div><div style={{ height: 5, background: T.border2, borderRadius: 3, marginBottom: 6 }}><div style={{ width: `${pct}%`, height: "100%", background: bar, borderRadius: 3 }} /></div><div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}><span style={{ color: T.t2 }}>{Math.round(pct)}%</span>{b.expiring > 0 && <span style={{ color: T.amber }}>{b.expiring} expiring</span>}</div></Card>;
        })}
      </div>
      <Card style={{ padding: 20, marginBottom: 18 }}><h3 style={{ fontSize: 14, margin: "0 0 16px" }}>Inventory vs Capacity</h3><div style={{ height: 180 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={data.inventory} barGap={4} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} /><XAxis dataKey="type" tick={{ fill: T.t2, fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: T.t2, fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: T.card2, border: `1px solid ${T.border2}`, borderRadius: 8, color: T.t0, fontSize: 12 }} /><Bar dataKey="cap" radius={[3, 3, 0, 0]} fill="rgba(255,255,255,0.06)" name="Capacity" /><Bar dataKey="units" radius={[3, 3, 0, 0]} name="Available">{data.inventory.map((d) => <Cell key={d.type} fill={d.color} />)}</Bar></BarChart></ResponsiveContainer></div></Card>
      <TableCard title="Blood Units Registry" tools={<><Btn variant="ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setFilter(filter === "all" ? "available" : filter === "available" ? "reserved" : filter === "reserved" ? "expiring" : "all")}><Filter size={13} /> {filter === "all" ? "Filter" : filter}</Btn><Btn variant="ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => downloadCsv("blood-units.csv", visibleUnits)}><Download size={13} /> Export</Btn></>}>
        <DataTable headers={["Unit ID", "Blood Type", "Component", "Collected", "Expires", "Status", "Actions"]} rows={visibleUnits.map((u) => [u.id, <BloodBadge type={u.type} small />, u.comp, u.collected, u.expires, <StatusBadge status={u.status} />, <RowActions onEdit={() => { setForm(u); setModal({ mode: "edit", item: u }); }} onDelete={() => actions.deleteUnit(u.id)} />])} />
      </TableCard>
      {modal && <Modal title={modal.mode === "edit" ? "Edit Blood Unit" : "Add Blood Unit"} onClose={() => setModal(null)} footer={<><Btn onClick={() => setModal(null)}>Cancel</Btn><Btn variant="primary" onClick={save}>Save</Btn></>}><Field label="Blood Type"><Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{BLOOD_TYPES.map((b) => <option key={b}>{b}</option>)}</Select></Field><Field label="Component"><Select value={form.comp} onChange={(e) => setForm({ ...form, comp: e.target.value })}>{COMPONENTS.map((c) => <option key={c}>{c}</option>)}</Select></Field><Field label="Collected"><Input value={form.collected} onChange={(e) => setForm({ ...form, collected: e.target.value })} /></Field><Field label="Expires"><Input value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })} /></Field><Field label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{["available", "reserved", "expiring"].map((s) => <option key={s}>{s}</option>)}</Select></Field></Modal>}
    </div>
  );
}

function RequestsPage({ data, actions }) {
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ hospital: "", blood: "O+", units: 1, urgency: "normal", status: "pending", date: today() });
  const filtered = filter === "all" ? data.requests : data.requests.filter((r) => r.status === filter);

  return (
    <div>
      <Header title="Blood Requests" subtitle="Track and manage incoming blood requests from hospitals" action={<Btn variant="primary" onClick={() => { setForm({ hospital: "", blood: "O+", units: 1, urgency: "normal", status: "pending", date: today() }); setModal({ mode: "add" }); }}><Plus size={15} /> New Request</Btn>} />
      <SummaryCards items={[["Total", data.requests.length, T.blue], ["Pending", data.requests.filter((r) => r.status === "pending").length, T.amber], ["Approved", data.requests.filter((r) => r.status === "approved").length, T.blue], ["Fulfilled", data.requests.filter((r) => r.status === "fulfilled").length, T.green]]} suffix="Requests" />
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>{["all", "pending", "approved", "fulfilled"].map((f) => <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", border: `1px solid ${filter === f ? T.red : T.border}`, background: filter === f ? T.redL : "none", color: filter === f ? T.red : T.t2, fontSize: 13, fontWeight: filter === f ? 700 : 400, textTransform: "capitalize" }}>{f === "all" ? "All Requests" : f}</button>)}</div>
      <TableCard title="Requests" tools={<Btn variant="ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => downloadCsv("blood-requests.csv", filtered)}><Download size={13} /> Export</Btn>}>
        <DataTable headers={["Request ID", "Hospital", "Blood", "Units", "Urgency", "Status", "Date", "Actions"]} rows={filtered.map((r) => [r.id, r.hospital, <BloodBadge type={r.blood} small />, `${r.units} units`, <StatusBadge status={r.urgency} />, <StatusBadge status={r.status} />, r.date, <div style={{ display: "flex", gap: 6 }}>{r.status === "pending" && <button onClick={() => actions.approveRequest(r.id)} style={{ background: T.greenL, border: "1px solid rgba(47,158,68,0.28)", borderRadius: 6, padding: "4px 10px", color: T.green, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}><CheckCircle size={12} style={{ verticalAlign: -2, marginRight: 4 }} />Approve</button>}<IconButton title="Request details" onClick={() => alert(`${r.hospital} requested ${r.units} ${r.blood} units.`)}><MoreVertical size={14} /></IconButton></div>])} />
      </TableCard>
      {modal && <Modal title="New Request" onClose={() => setModal(null)} footer={<><Btn onClick={() => setModal(null)}>Cancel</Btn><Btn variant="primary" onClick={() => { actions.addRequest(form); setModal(null); }}>Save</Btn></>}><Field label="Hospital"><Input value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} placeholder="Hospital name" /></Field><Field label="Blood Type"><Select value={form.blood} onChange={(e) => setForm({ ...form, blood: e.target.value })}>{BLOOD_TYPES.map((b) => <option key={b}>{b}</option>)}</Select></Field><Field label="Units"><Input type="number" min="1" value={form.units} onChange={(e) => setForm({ ...form, units: Number(e.target.value) })} /></Field><Field label="Urgency"><Select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>{["normal", "high", "critical"].map((s) => <option key={s}>{s}</option>)}</Select></Field></Modal>}
    </div>
  );
}

function DonorsPage({ data, actions }) {
  const [search, setSearch] = useState("");
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", blood: "O+", last: today(), eligible: true, count: 1, phone: "+91" });
  const donors = data.donors.filter((d) => (!eligibleOnly || d.eligible) && d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <Header title="Donors" subtitle="Manage donor records, eligibility and donation history" action={<Btn variant="primary" onClick={() => { setForm({ name: "", blood: "O+", last: today(), eligible: true, count: 1, phone: "+91" }); setModal({ mode: "add" }); }}><Plus size={15} /> Register Donor</Btn>} />
      <SummaryCards items={[["Total Donors", data.donors.length, T.red], ["Eligible Now", data.donors.filter((d) => d.eligible).length, T.green], ["Donated This Month", 23, T.blue], ["Avg Donations", "6.4", T.purple]]} />
      <TableCard title="Donor Registry" tools={<><div style={{ display: "flex", alignItems: "center", gap: 7, background: T.card2, border: `1px solid ${T.border}`, borderRadius: 7, padding: "7px 12px" }}><Search size={13} color={T.t3} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search donors..." style={{ background: "none", border: "none", outline: "none", color: T.t1, fontSize: 12, width: 140, fontFamily: "inherit" }} /></div><Btn variant="ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setEligibleOnly((p) => !p)}><Filter size={13} /> {eligibleOnly ? "Eligible" : "Filter"}</Btn><Btn variant="ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => downloadCsv("donors.csv", donors)}><Download size={13} /> Export</Btn></>}>
        <DataTable headers={["Donor", "Blood Type", "Last Donation", "Eligibility", "Donations", "Contact", "Actions"]} rows={donors.map((d, i) => [<div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: "50%", background: `${avatarColor(i)}22`, border: `1px solid ${avatarColor(i)}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: avatarColor(i) }}>{initials(d.name)}</div><span style={{ fontWeight: 600 }}>{d.name}</span></div>, <BloodBadge type={d.blood} small />, d.last, d.eligible ? "Eligible" : "Not Eligible", d.count, d.phone, <div style={{ display: "flex", gap: 8 }}><IconButton title="Edit donor" onClick={() => { setForm(d); setModal({ mode: "edit", item: d }); }}><Edit size={14} /></IconButton><IconButton title="Call donor" onClick={() => alert(`Call ${d.name} at ${d.phone}`)}><Phone size={14} /></IconButton><IconButton title="Delete donor" tone={T.red} onClick={() => actions.deleteDonor(d.id)}><Trash2 size={14} /></IconButton></div>])} />
      </TableCard>
      {modal && <Modal title={modal.mode === "edit" ? "Edit Donor" : "Register Donor"} onClose={() => setModal(null)} footer={<><Btn onClick={() => setModal(null)}>Cancel</Btn><Btn variant="primary" onClick={() => { modal.mode === "edit" ? actions.updateDonor(modal.item.id, form) : actions.addDonor(form); setModal(null); }}>Save</Btn></>}><Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field><Field label="Blood Type"><Select value={form.blood} onChange={(e) => setForm({ ...form, blood: e.target.value })}>{BLOOD_TYPES.map((b) => <option key={b}>{b}</option>)}</Select></Field><Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field><Field label="Last Donation"><Input value={form.last} onChange={(e) => setForm({ ...form, last: e.target.value })} /></Field><label style={{ color: T.t1, fontSize: 14 }}><input type="checkbox" checked={form.eligible} onChange={(e) => setForm({ ...form, eligible: e.target.checked })} style={{ accentColor: T.red, marginRight: 8 }} /> Eligible now</label></Modal>}
    </div>
  );
}

function UsersPage({ data, actions }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "Requester", status: "active", last: "Just now" });

  return (
    <div>
      <Header title="User Management" subtitle="Manage system users, roles and access permissions" action={<Btn variant="primary" onClick={() => { setForm({ name: "", email: "", role: "Requester", status: "active", last: "Just now" }); setModal({ mode: "add" }); }}><Plus size={15} /> Add User</Btn>} />
      <SummaryCards items={[["Total Users", data.users.length, T.blue], ["Active", data.users.filter((u) => u.status === "active").length, T.green], ["Inactive", data.users.filter((u) => u.status === "inactive").length, T.amber], ["Roles", 4, T.purple]]} />
      <TableCard title="System Users" tools={<Btn variant="ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => downloadCsv("users.csv", data.users)}><Download size={13} /> Export</Btn>}>
        <DataTable headers={["User", "Email", "Role", "Status", "Last Active", "Actions"]} rows={data.users.map((u, i) => [<div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 34, height: 34, borderRadius: "50%", background: `${avatarColor(i)}22`, border: `1px solid ${avatarColor(i)}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: avatarColor(i) }}>{initials(u.name)}</div><span style={{ fontWeight: 600 }}>{u.name}</span></div>, u.email, u.role, <StatusBadge status={u.status} />, u.last, <RowActions onEdit={() => { setForm(u); setModal({ mode: "edit", item: u }); }} onDelete={() => actions.deleteUser(u.id)} />])} />
      </TableCard>
      <Card style={{ padding: 20, marginTop: 20 }}><h3 style={{ fontSize: 14, margin: "0 0 16px" }}>Role Permissions Overview</h3><div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>{ROLES.map((role, i) => <div key={role} style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}><div style={{ fontSize: 12, fontWeight: 800, color: avatarColor(i), marginBottom: 10 }}>{role}</div>{["Inventory", "Requests", "Reports"].map((p) => <div key={p} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T.t2, marginBottom: 6 }}><CheckCircle size={11} color={avatarColor(i)} />{p}</div>)}</div>)}</div></Card>
      {modal && <Modal title={modal.mode === "edit" ? "Edit User" : "Add User"} onClose={() => setModal(null)} footer={<><Btn onClick={() => setModal(null)}>Cancel</Btn><Btn variant="primary" onClick={() => { modal.mode === "edit" ? actions.updateUser(modal.item.id, form) : actions.addUser(form); setModal(null); }}>Save</Btn></>}><Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field><Field label="Email"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field><Field label="Role"><Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{ROLES.map((r) => <option key={r}>{r}</option>)}</Select></Field><Field label="Status"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{["active", "inactive"].map((s) => <option key={s}>{s}</option>)}</Select></Field></Modal>}
    </div>
  );
}

function Header({ title, subtitle, action }) {
  return <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}><div><h1 style={{ fontSize: 21, fontWeight: 800, margin: "0 0 4px" }}>{title}</h1><p style={{ color: T.t2, fontSize: 13, margin: 0 }}>{subtitle}</p></div>{action}</div>;
}

function SummaryCards({ items, suffix = "" }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>{items.map(([l, v, c]) => <Card key={l} style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}><div style={{ fontSize: 28, fontWeight: 800, color: c }}>{v}</div><div style={{ fontSize: 13, color: T.t2 }}>{l} {suffix}</div></Card>)}</div>;
}

function TableCard({ title, tools, children }) {
  return <Card style={{ overflow: "hidden" }}><div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}><h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{title}</h3><div style={{ display: "flex", gap: 8, alignItems: "center" }}>{tools}</div></div><div style={{ overflowX: "auto" }}>{children}</div></Card>;
}

function DataTable({ headers, rows }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead><tr style={{ borderBottom: `1px solid ${T.border}`, background: T.card2 }}>{headers.map((h) => <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: T.t2, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i} style={{ borderBottom: `1px solid ${T.border}`, background: i % 2 ? T.card2 : "transparent" }}>{row.map((cell, j) => <td key={j} style={{ padding: "13px 16px", color: j === 0 ? T.t0 : T.t1 }}>{cell}</td>)}</tr>)}</tbody>
    </table>
  );
}

function RowActions({ onEdit, onDelete }) {
  return <div style={{ display: "flex", gap: 8 }}><IconButton title="Edit" onClick={onEdit}><Edit size={14} /></IconButton><IconButton title="Delete" tone={T.red} onClick={onDelete}><Trash2 size={14} /></IconButton></div>;
}

export default function BloodManagementSystem() {
  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [otpSession, setOtpSession] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [units, setUnits] = useState(INITIAL_UNITS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [donors, setDonors] = useState(INITIAL_DONORS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]);

  const addOrSelectUserByEmail = (nextEmail) => {
    const emailKey = String(nextEmail || "").trim().toLowerCase();
    if (!emailKey) return;
    const existing = users.find((user) => user.email.toLowerCase() === emailKey);
    if (existing) {
      setCurrentUser(existing);
      return;
    }
    const newUser = {
      id: Date.now(),
      name: userDisplayNameFromEmail(emailKey),
      email: emailKey,
      role: getUserRoleForEmail(emailKey),
      status: "active",
      last: "Just now",
    };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
  };

  const recomputeInventory = (nextUnits) => {
    setInventory((prev) => prev.map((blood) => ({
      ...blood,
      units: nextUnits.filter((u) => u.type === blood.type && u.status !== "reserved").length,
      expiring: nextUnits.filter((u) => u.type === blood.type && u.status === "expiring").length,
    })));
  };

  const actions = useMemo(() => ({
    addUnit: (unit) => setUnits((prev) => {
      const next = [{ ...unit, id: `BU-${2500 + prev.length + 1}` }, ...prev];
      recomputeInventory(next);
      return next;
    }),
    updateUnit: (id, patch) => setUnits((prev) => {
      const next = prev.map((u) => u.id === id ? { ...u, ...patch } : u);
      recomputeInventory(next);
      return next;
    }),
    deleteUnit: (id) => setUnits((prev) => {
      if (!confirm("Delete this blood unit?")) return prev;
      const next = prev.filter((u) => u.id !== id);
      recomputeInventory(next);
      return next;
    }),
    addRequest: (request) => setRequests((prev) => [{ ...request, id: `REQ-${String(prev.length + 1).padStart(3, "0")}` }, ...prev]),
    approveRequest: (id) => setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "approved" } : r)),
    addDonor: (donor) => setDonors((prev) => [{ ...donor, id: Date.now(), count: Number(donor.count) || 1 }, ...prev]),
    updateDonor: (id, patch) => setDonors((prev) => prev.map((d) => d.id === id ? { ...d, ...patch } : d)),
    deleteDonor: (id) => setDonors((prev) => confirm("Delete this donor?") ? prev.filter((d) => d.id !== id) : prev),
    addUser: (user) => setUsers((prev) => [{ ...user, id: Date.now() }, ...prev]),
    updateUser: (id, patch) => setUsers((prev) => prev.map((u) => u.id === id ? { ...u, ...patch } : u)),
    deleteUser: (id) => setUsers((prev) => confirm("Delete this user?") ? prev.filter((u) => u.id !== id) : prev),
  }), []);

  const data = { inventory, units, requests, donors, users };

  if (screen === "login") return <LoginScreen onNext={(nextEmail, otp) => { setEmail(nextEmail); setOtpSession({ otp, expiresAt: Date.now() + 120000 }); setScreen("otp"); }} onSkip={() => { addOrSelectUserByEmail(email); setScreen("app"); }} />;
  if (screen === "otp") return <OTPScreen email={email} expectedOtp={otpSession?.otp} expiresAt={otpSession?.expiresAt} onVerify={() => { addOrSelectUserByEmail(email); setScreen("app"); }} onBack={() => { setOtpSession(null); setScreen("login"); }} />;
  return <MainApp data={data} actions={actions} currentUser={currentUser} page={page} setPage={setPage} onLogout={() => { setScreen("login"); setPage("dashboard"); setEmail(""); setOtpSession(null); }} />;
}
