import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "student") redirect("/login");

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Welcome back, {session.user.name.split(" ")[0]} 👋
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>Here's your learning overview.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Sessions Completed", value: "—" },
          { label: "Concepts Mastered", value: "—" },
          { label: "Current Streak", value: "—" },
          { label: "Subscription", value: "Trial" },
        ].map((card) => (
          <div key={card.label} style={{
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "12px",
            padding: "1.25rem",
          }}>
            <div style={{ color: "#555", fontSize: "0.8rem", marginBottom: "0.5rem" }}>{card.label}</div>
            <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#d4a843" }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "2rem", background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#aaa", marginBottom: "1rem" }}>Upcoming Sessions</h2>
        <p style={{ color: "#444", fontSize: "0.9rem" }}>No sessions scheduled yet. Your mentor will schedule your first session soon.</p>
      </div>
    </div>
  );
}
