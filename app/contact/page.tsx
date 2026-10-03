"use client";
import { useState } from "react";
import Link from "next/link";
const inputStyle = { width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: "8px", color: "#fff", fontSize: "0.9rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" } as React.CSSProperties;
const labelStyle = { display: "block", color: "#666", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" } as React.CSSProperties;
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }));
  async function handleSubmit(e: React.FormEvent) { e.preventDefault(); setStatus("loading"); const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); setStatus(res.ok ? "success" : "error"); }
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        <Link href="/" style={{ color: "#d4a843", fontSize: "0.85rem", textDecoration: "none", display: "inline-block", marginBottom: "2rem" }}>← Back to home</Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Contact us</h1>
        <p style={{ color: "#888", fontSize: "0.9rem", lineHeight: "1.6", marginTop: "8px" }}>
          EduCreation • Kolkata - 700105, India<br />
          Email: support@educreators.org<br />
          WhatsApp Support: +91 8276926995<br />
          Call/UPI: +91 9052416158
        </p>
        <p style={{ color: "#555", marginBottom: "2.5rem", fontSize: "0.85rem", marginTop: "8px" }}>We respond within 24 hours</p>
        {status === "success" ? (<div style={{ background: "#0f1f0f", border: "1px solid #1e3a1e", borderRadius: "12px", padding: "2rem", textAlign: "center" }}><div style={{ fontSize: "2rem" }}>✓</div><p style={{ color: "#4caf7d", fontWeight: 600 }}>Message sent!</p><Link href="/" style={{ color: "#d4a843" }}>Back to home →</Link></div>) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div><label style={labelStyle}>Your name *</label><input required placeholder="Priya Sharma" value={form.name} onChange={set("name")} style={inputStyle} /></div>
              <div><label style={labelStyle}>Email *</label><input required type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} style={inputStyle} /></div>
            </div>
            <div><label style={labelStyle}>Subject</label><select value={form.subject} onChange={set("subject")} style={inputStyle}><option value="">Select a topic</option><option>Free PDF Guide - Get Personalized Plan</option><option>Pricing & plans - Parent ₹1,999 / School Plans</option><option>School / institution enquiry</option><option>Technical support - PDF not received</option><option>General question</option></select></div>
            <div><label style={labelStyle}>Message *</label><textarea required rows={5} placeholder="Tell us Class, Subject, Topic you need PDF for..." value={form.message} onChange={set("message")} style={{ ...inputStyle, resize: "vertical" }} /></div>
            <button type="submit" style={{ padding: "14px", background: "linear-gradient(135deg, #d4a843, #f0c060)", border: "none", borderRadius: "8px", color: "#000", fontWeight: 700, cursor: "pointer" }}>Send Message →</button>
          </form>)}
      </div>
    </div>
  );
}