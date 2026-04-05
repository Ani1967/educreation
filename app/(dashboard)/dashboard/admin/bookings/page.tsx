import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import BookingStatusButton from "./BookingStatusButton";

const STATUS_COLOR: Record<string, string> = {
  new:       "#d4a843",
  contacted: "#5b8dee",
  converted: "#4caf7d",
  dropped:   "#666",
};

const STATUS_NEXT: Record<string, string> = {
  new:       "contacted",
  contacted: "converted",
  converted: "dropped",
  dropped:   "new",
};

const STATUS_LABEL: Record<string, string> = {
  new:       "New",
  contacted: "Contacted",
  converted: "Converted",
  dropped:   "Dropped",
};

export default async function AdminBookingsPage() {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/login");

  const allBookings = await db
    .select()
    .from(bookings)
    .orderBy(desc(bookings.createdAt));

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Booking Requests
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        {allBookings.length} total — manage free session enquiries
      </p>

      {/* Status filter legend */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {Object.entries(STATUS_COLOR).map(([s, c]) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            <span style={{ color: "#aaa", fontSize: "0.8rem", textTransform: "capitalize" }}>{s}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {allBookings.length === 0 && (
          <div style={{ color: "#444", padding: "2rem", textAlign: "center" }}>
            No bookings yet. Share your landing page link to start getting enquiries.
          </div>
        )}

        {allBookings.map((b) => {
          const waText = encodeURIComponent(
            `Hi ${b.parentName}, this is EduCreation. We received your request for ${b.studentName} (${b.class}, ${b.board}). When would be a good time for the free demo session?`
          );
          const waLink = `https://wa.me/${b.whatsapp.replace(/\D/g, "")}?text=${waText}`;

          return (
            <div key={b.id} style={{
              background: "#111",
              border: "1px solid #1e1e1e",
              borderLeft: `3px solid ${STATUS_COLOR[b.status] || "#333"}`,
              borderRadius: "12px",
              padding: "1.25rem 1.5rem",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "1rem",
              alignItems: "start",
            }}>
              {/* Left: info */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: 700, fontSize: "1rem" }}>{b.studentName}</span>
                  <span style={{
                    fontSize: "0.7rem",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    background: STATUS_COLOR[b.status] + "22",
                    color: STATUS_COLOR[b.status],
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}>
                    {STATUS_LABEL[b.status]}
                  </span>
                </div>
                <div style={{ color: "#888", fontSize: "0.875rem", display: "flex", flexWrap: "wrap", gap: "0.5rem 1.5rem" }}>
                  <span>Parent: {b.parentName}</span>
                  <span>{b.class} · {b.board}</span>
                  {b.subject && <span>Subject: {b.subject}</span>}
                  {b.preferredTime && <span>Preferred: {b.preferredTime}</span>}
                </div>
                {b.concern && (
                  <div style={{ color: "#555", fontSize: "0.825rem", marginTop: "0.5rem", fontStyle: "italic" }}>
                    "{b.concern}"
                  </div>
                )}
                <div style={{ color: "#444", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                  {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  {b.email && ` · ${b.email}`}
                </div>
              </div>

              {/* Right: actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.5rem 0.9rem",
                    background: "#1a3a1a",
                    border: "1px solid #25d366",
                    borderRadius: "8px",
                    color: "#25d366",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  WhatsApp ↗
                </a>
                <BookingStatusButton
                  id={b.id}
                  currentStatus={b.status}
                  nextStatus={STATUS_NEXT[b.status]}
                  nextLabel={`→ ${STATUS_LABEL[STATUS_NEXT[b.status]]}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
