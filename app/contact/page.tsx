"use client";

import { useState } from "react";
import Link from "next/link";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(201,169,110,0.2)",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "0.9rem",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#666",
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: "6px",
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "success" : "error");
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "4rem 1.5rem" }}>

        <Link href="/" style={{ color: "#d4a843", fontSize: "0.85rem", textDecoration: "none", display: "inline-block", marginBottom: "2rem" }}>
          ← Back to home
        </Link>

        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.25rem" }}>Contact us</h1>
        <p style={{ color: "#555", marginBottom: "2.5rem", fontSize: "0.9rem" }}>
          We respond within 24 hours · WhatsApp: +91 90524 16158
        </p>

        {status === "success" ? (
          <div style={{ background: "#0f1f0f", border: "1px solid #1e3a1e", borderRadius: "12px", padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✓</div>
            <p style={{ color: "#4caf7d", fontWeight: 600, marginBottom: "0.5rem" }}>Message sent!</p>
            <p style={{ color: "#555", fontSize: "0.875rem" }}>Check your inbox — we've sent you a confirmation. We'll reply within 24 hours.</p>
            <Link href="/" style={{ display: "inline-block", marginTop: "1.5rem", color: "#d4a843", fontSize: "0.875rem", textDecoration: "none" }}>
              Back to home →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Your name *</label>
                <input type="text" required placeholder="Priya Sharma" value={form.name} onChange={set("name")} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input type="email" required placeholder="you@example.com" value={form.email} onChange={set("email")} style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Subject</label>
              <select value={form.subject} onChange={set("subject")} style={inputStyle}>
                <option value="">Select a topic</option>
                <option>Book a free session</option>
                <option>Pricing &amp; plans</option>
                <option>School / institution enquiry</option>
                <option>Technical support</option>
                <option>General question</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Message *</label>
              <textarea
                required
                rows={5}
                placeholder="Tell us how we can help..."
                value={form.message}
                onChange={set("message")}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            {status === "error" && (
              <div style={{ padding: "0.75rem 1rem", background: "#1f0f0f", border: "1px solid #3a1e1e", borderRadius: "8px", color: "#ff6b6b", fontSize: "0.875rem" }}>
                Something went wrong. Please WhatsApp us at +91 90524 16158.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                padding: "14px",
                background: status === "loading" ? "#333" : "linear-gradient(135deg, #d4a843, #f0c060)",
                border: "none",
                borderRadius: "8px",
                color: status === "loading" ? "#888" : "#000",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: status === "loading" ? "not-allowed" : "pointer",
                letterSpacing: "0.04em",
              }}
            >
              {status === "loading" ? "Sending…" : "Send Message →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
