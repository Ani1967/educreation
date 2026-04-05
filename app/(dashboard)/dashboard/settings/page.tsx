import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div style={{ padding: "2rem", color: "#fff", maxWidth: "500px" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.25rem" }}>Settings</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>Manage your account</p>

      {/* Account info */}
      <div style={{
        background: "#111",
        border: "1px solid #1e1e1e",
        borderRadius: "12px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
      }}>
        <h2 style={{ fontSize: "0.8rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
          Account
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {[
            { label: "Name",  value: session.user.name },
            { label: "Email", value: session.user.email },
            { label: "Role",  value: session.user.role },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", gap: "1rem" }}>
              <span style={{ color: "#555", fontSize: "0.875rem", width: "50px", flexShrink: 0 }}>{label}</span>
              <span style={{ color: "#bbb", fontSize: "0.875rem", textTransform: "capitalize" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div style={{
        background: "#111",
        border: "1px solid #1e1e1e",
        borderRadius: "12px",
        padding: "1.5rem",
      }}>
        <h2 style={{ fontSize: "0.8rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>
          Change Password
        </h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
