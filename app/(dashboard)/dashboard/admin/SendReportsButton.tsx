"use client";

import { useState } from "react";

export default function SendReportsButton() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<string>("");

  async function trigger() {
    setState("loading");
    try {
      const res = await fetch("/api/admin/send-reports", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setState("done");
        setResult(`Processed ${data.processed} student${data.processed !== 1 ? "s" : ""} · ${data.weekLabel}`);
      } else {
        setState("error");
        setResult(data.error || "Unknown error");
      }
    } catch {
      setState("error");
      setResult("Network error");
    }
    setTimeout(() => setState("idle"), 6000);
  }

  return (
    <div style={{ textAlign: "right" }}>
      <button
        onClick={trigger}
        disabled={state === "loading"}
        style={{
          padding: "0.6rem 1.2rem",
          background: state === "done" ? "#1a3a1a" : state === "error" ? "#2a1a1a" : "linear-gradient(135deg,#d4a843,#f0c060)",
          border: "none",
          borderRadius: "8px",
          color: state === "done" ? "#4caf7d" : state === "error" ? "#ff6b6b" : "#000",
          fontWeight: 700,
          fontSize: "0.85rem",
          cursor: state === "loading" ? "not-allowed" : "pointer",
        }}
      >
        {state === "loading" ? "Sending…" : state === "done" ? "Sent ✓" : state === "error" ? "Failed ✗" : "Send Reports Now"}
      </button>
      {result && (
        <div style={{ color: state === "error" ? "#ff6b6b" : "#4caf7d", fontSize: "0.75rem", marginTop: "0.4rem" }}>
          {result}
        </div>
      )}
    </div>
  );
}
