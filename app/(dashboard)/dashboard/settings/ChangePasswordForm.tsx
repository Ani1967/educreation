"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) {
      setStatus("error");
      setMessage("New passwords don't match.");
      return;
    }
    setStatus("loading");
    setMessage("");

    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    const data = await res.json();

    if (data.success) {
      setStatus("success");
      setMessage("Password updated successfully.");
      setCurrent(""); setNext(""); setConfirm("");
    } else {
      setStatus("error");
      setMessage(data.error || "Something went wrong.");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.7rem 1rem",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {[
        { label: "Current Password", value: current, set: setCurrent },
        { label: "New Password",     value: next,    set: setNext },
        { label: "Confirm New",      value: confirm, set: setConfirm },
      ].map(({ label, value, set }) => (
        <div key={label}>
          <label style={{ display: "block", color: "#888", fontSize: "0.8rem", marginBottom: "0.35rem" }}>
            {label}
          </label>
          <input
            type="password"
            value={value}
            onChange={(e) => set(e.target.value)}
            required
            placeholder="••••••••"
            style={inputStyle}
          />
        </div>
      ))}

      {message && (
        <div style={{
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          background: status === "success" ? "#1a3a1a" : "#2a1a1a",
          border: `1px solid ${status === "success" ? "#4caf7d44" : "#ff6b6b44"}`,
          color: status === "success" ? "#4caf7d" : "#ff6b6b",
          fontSize: "0.875rem",
        }}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          padding: "0.8rem",
          background: status === "loading" ? "#333" : "linear-gradient(135deg, #d4a843, #f0c060)",
          border: "none",
          borderRadius: "8px",
          color: status === "loading" ? "#888" : "#000",
          fontWeight: 700,
          fontSize: "0.9rem",
          cursor: status === "loading" ? "not-allowed" : "pointer",
        }}
      >
        {status === "loading" ? "Saving…" : "Update Password"}
      </button>
    </form>
  );
}
