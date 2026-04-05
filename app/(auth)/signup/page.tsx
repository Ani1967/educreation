"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ROLES = [
  { value: "student", label: "Student" },
  { value: "parent", label: "Parent" },
  { value: "mentor", label: "Mentor" },
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Signup failed.");
    } else {
      router.push("/login?registered=1");
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "1rem",
    }}>
      <div style={{
        background: "#111",
        border: "1px solid #2a2a2a",
        borderRadius: "16px",
        padding: "2.5rem",
        width: "100%",
        maxWidth: "420px",
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            background: "linear-gradient(135deg, #d4a843, #f0c060)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
          }}>
            EduCreation
          </div>
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { label: "Full Name", field: "name", type: "text", placeholder: "Rahul Sharma" },
            { label: "Email", field: "email", type: "email", placeholder: "you@example.com" },
            { label: "Password", field: "password", type: "password", placeholder: "••••••••" },
            { label: "Phone (optional)", field: "phone", type: "tel", placeholder: "+91 98765 43210" },
          ].map(({ label, field, type, placeholder }) => (
            <div key={field} style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", color: "#aaa", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                {label}
              </label>
              <input
                type={type}
                value={form[field as keyof typeof form]}
                onChange={(e) => update(field, e.target.value)}
                required={field !== "phone"}
                placeholder={placeholder}
                style={inputStyle}
              />
            </div>
          ))}

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", color: "#aaa", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
              I am a…
            </label>
            <select
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {error && (
            <div style={{
              background: "#2a1010",
              border: "1px solid #5a1a1a",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              color: "#ff6b6b",
              fontSize: "0.875rem",
              marginBottom: "1rem",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.85rem",
              background: loading ? "#555" : "linear-gradient(135deg, #d4a843, #f0c060)",
              border: "none",
              borderRadius: "8px",
              color: "#000",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "#555", fontSize: "0.875rem", marginTop: "1.5rem" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#d4a843", textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
