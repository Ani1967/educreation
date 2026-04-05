import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { bookings, users, students } from "@/lib/db/schema";
import { count } from "drizzle-orm";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/login");

  const [[{ bookingCount }], [{ userCount }], [{ studentCount }]] = await Promise.all([
    db.select({ bookingCount: count() }).from(bookings),
    db.select({ userCount: count() }).from(users),
    db.select({ studentCount: count() }).from(students),
  ]);

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Admin Dashboard
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>Platform overview.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Users", value: userCount },
          { label: "Enrolled Students", value: studentCount },
          { label: "Total Bookings", value: bookingCount },
          { label: "Active Sessions", value: "—" },
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <Link href="/dashboard/admin/bookings" style={{
          background: "#111",
          border: "1px solid #1e1e1e",
          borderRadius: "12px",
          padding: "1.5rem",
          textDecoration: "none",
          display: "block",
          transition: "border-color 0.2s",
        }}>
          <div style={{ color: "#d4a843", fontWeight: 600, marginBottom: "0.5rem" }}>Manage Bookings →</div>
          <div style={{ color: "#555", fontSize: "0.875rem" }}>Review new demo session requests</div>
        </Link>
        <Link href="/dashboard/admin/users" style={{
          background: "#111",
          border: "1px solid #1e1e1e",
          borderRadius: "12px",
          padding: "1.5rem",
          textDecoration: "none",
          display: "block",
        }}>
          <div style={{ color: "#d4a843", fontWeight: 600, marginBottom: "0.5rem" }}>Manage Users →</div>
          <div style={{ color: "#555", fontSize: "0.875rem" }}>View students, parents & mentors</div>
        </Link>
      </div>
    </div>
  );
}
