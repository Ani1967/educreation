"use client";

import { useState } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  background: "rgba(255,255,255,0.05)",
  border: "0.5px solid rgba(201,169,110,0.3)", borderRadius: "6px",
  color: "var(--ivory)", fontFamily: "'DM Sans',sans-serif",
  fontSize: "0.9rem", outline: "none",
};
const selectStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px",
  background: "rgba(26,23,20,0.95)",
  border: "0.5px solid rgba(201,169,110,0.3)", borderRadius: "6px",
  color: "var(--ivory)", fontFamily: "'DM Sans',sans-serif",
  fontSize: "0.9rem", outline: "none",
};
const labelStyle: React.CSSProperties = {
  fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase",
  color: "var(--gold)", display: "block", marginBottom: "6px",
};
const grid2: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px",
};

export default function BookingForm() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    const data = new FormData(e.currentTarget);
    const payload = {
      parent_name:    data.get("parent_name"),
      student_name:   data.get("student_name"),
      whatsapp:       data.get("whatsapp"),
      email:          data.get("email"),
      class:          data.get("class"),
      board:          data.get("board"),
      subject:        data.get("subject"),
      preferred_time: data.get("preferred_time"),
      concern:        data.get("concern"),
    };
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setState("success");
        const name = String(data.get("student_name") || "");
        const cls  = String(data.get("class") || "");
        const msg  = `Hi, I just booked a free session for ${name} (${cls}) on educreators.org. Please confirm the time.`;
        setTimeout(() => {
          window.open(`https://wa.me/919052416158?text=${encodeURIComponent(msg)}`, "_blank");
        }, 1500);
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div style={{ marginTop: "2rem", textAlign: "center", padding: "1.25rem", background: "rgba(59,109,17,0.12)", border: "0.5px solid rgba(59,109,17,0.3)", borderRadius: "8px", maxWidth: "520px", marginLeft: "auto", marginRight: "auto" }}>
        <p style={{ color: "#7ec850", fontWeight: 500, marginBottom: "4px" }}>Booking received!</p>
        <p style={{ fontSize: "0.85rem", color: "rgba(240,230,206,0.6)" }}>We will WhatsApp you within 2 hours to confirm your session.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "2rem", maxWidth: "520px", marginLeft: "auto", marginRight: "auto", textAlign: "left" }}>
      <div style={grid2}>
        <div>
          <label style={labelStyle}>Parent name *</label>
          <input type="text" name="parent_name" required placeholder="e.g. Priya Sharma" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Student name *</label>
          <input type="text" name="student_name" required placeholder="e.g. Arjun" style={inputStyle} />
        </div>
      </div>
      <div style={grid2}>
        <div>
          <label style={labelStyle}>Class *</label>
          <select name="class" required style={selectStyle}>
            <option value="">Select class</option>
            {["Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Board *</label>
          <select name="board" required style={selectStyle}>
            <option value="">Select board</option>
            {["CBSE","ICSE","West Bengal Board","Other"].map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>
      <div style={grid2}>
        <div>
          <label style={labelStyle}>WhatsApp number *</label>
          <input type="tel" name="whatsapp" required placeholder="e.g. 9876543210" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Email (for confirmation)</label>
          <input type="email" name="email" placeholder="optional but recommended" style={inputStyle} />
        </div>
      </div>
      <div style={grid2}>
        <div>
          <label style={labelStyle}>Main subject concern</label>
          <select name="subject" style={selectStyle}>
            <option value="">Select subject</option>
            {["Science","Mathematics","English","Geography","History","All subjects"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Preferred session time</label>
          <select name="preferred_time" style={selectStyle}>
            <option value="">Select time</option>
            {["Morning (7–9am)","Afternoon (1–3pm)","Evening (5–7pm)","Evening (7–9pm)","Weekend morning"].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>What&apos;s your main concern about your child&apos;s learning?</label>
        <textarea name="concern" rows={3} placeholder="e.g. She studies hard but forgets everything in exams..." style={{ ...inputStyle, resize: "vertical" }} />
      </div>
      <button type="submit" disabled={state === "loading"} style={{ width: "100%", padding: "14px", background: "var(--gold)", color: "var(--dark)", border: "none", borderRadius: "6px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s", opacity: state === "loading" ? 0.7 : 1 }}>
        {state === "loading" ? "Sending..." : "BOOK MY FREE SESSION →"}
      </button>
      {state === "error" && (
        <div style={{ marginTop: "1rem", textAlign: "center", padding: "1rem", background: "rgba(163,45,45,0.12)", border: "0.5px solid rgba(163,45,45,0.3)", borderRadius: "8px" }}>
          <p style={{ color: "#e87070", fontSize: "0.85rem" }}>Something went wrong. WhatsApp us at <a href="https://wa.me/919052416158" style={{ color: "var(--gold)" }}>+91 90524 16158</a></p>
        </div>
      )}
    </form>
  );
}
