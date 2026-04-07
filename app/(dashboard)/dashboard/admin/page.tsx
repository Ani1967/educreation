import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  bookings, users, students, sessions,
  subscriptions, parentReports,
} from "@/lib/db/schema";
import { count, eq, sum, desc, gte, and, sql } from "drizzle-orm";
import Link from "next/link";
import SendReportsButton from "./SendReportsButton";
import BookingStatusButton from "./bookings/BookingStatusButton";

const STATUS_COLOR: Record<string, string> = {
  new: "#d4a843", contacted: "#5b8dee", converted: "#4caf7d", dropped: "#444",
};
const STATUS_LABEL: Record<string, string> = {
  new: "New", contacted: "Contacted", converted: "Converted", dropped: "Dropped",
};
const STATUS_NEXT: Record<string, string> = {
  new: "contacted", contacted: "converted", converted: "dropped", dropped: "new",
};

function StatCard({
  label, value, sub, accent = "#d4a843",
}: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div style={{
      background: "#111", border: "1px solid #1e1e1e", borderRadius: 12,
      padding: "1.1rem 1.25rem",
    }}>
      <div style={{ color: "#555", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>{label}</div>
      <div style={{ fontSize: "1.9rem", fontWeight: 800, color: accent, lineHeight: 1, marginBottom: "0.25rem" }}>{value}</div>
      {sub && <div style={{ color: "#444", fontSize: "0.75rem" }}>{sub}</div>}
    </div>
  );
}

export default async function AdminCommandCentre() {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/login");

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd   = new Date(todayStart.getTime() + 86400000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // ── Parallel data fetch ──────────────────────────────────────────
  const [
    [{ total: totalUsers }],
    [{ total: totalStudents }],
    [{ total: newBookings }],
    [{ total: totalBookings }],
    [{ total: reportCount }],
    [{ total: activeSubs }],
    mrrResult,
    recentBookings,
    todaysSessions,
    recentUsers,
    subsByTier,
    studentsByStatus,
  ] = await Promise.all([
    db.select({ total: count() }).from(users),
    db.select({ total: count() }).from(students),
    db.select({ total: count() }).from(bookings).where(eq(bookings.status, "new")),
    db.select({ total: count() }).from(bookings),
    db.select({ total: count() }).from(parentReports),
    db.select({ total: count() }).from(subscriptions).where(eq(subscriptions.status, "active")),
    db.select({ total: sum(subscriptions.amountPaise) }).from(subscriptions)
      .where(eq(subscriptions.status, "active")),
    db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(6),
    db.select().from(sessions)
      .where(and(
        gte(sessions.scheduledAt, todayStart),
        sql`${sessions.scheduledAt} < ${todayEnd}`
      ))
      .orderBy(sessions.scheduledAt).limit(8),
    db.select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt })
      .from(users).orderBy(desc(users.createdAt)).limit(5),
    db.select({ tier: subscriptions.tier, total: count() }).from(subscriptions)
      .where(eq(subscriptions.status, "active"))
      .groupBy(subscriptions.tier),
    db.select({ status: students.subscriptionStatus, total: count() }).from(students)
      .groupBy(students.subscriptionStatus),
  ]);

  const mrr = Math.round((Number(mrrResult[0]?.total ?? 0)) / 100);

  const tierMap: Record<string, number> = {};
  subsByTier.forEach(r => { tierMap[r.tier ?? ""] = Number(r.total); });
  const statusMap: Record<string, number> = {};
  studentsByStatus.forEach(r => { statusMap[r.status ?? ""] = Number(r.total); });

  const newBookingsCount  = Number(newBookings);
  const activeSubsCount   = Number(activeSubs);

  return (
    <div style={{ padding: "1.75rem", color: "#fff", minHeight: "100vh", background: "#0a0a0a" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <div style={{ fontSize: "0.72rem", color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>
            EduCreation · Admin Command Centre
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#eee", marginBottom: "0.2rem" }}>
            {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </h1>
          <p style={{ color: "#555", fontSize: "0.85rem" }}>
            All data live from the database · refreshes on every page load
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Link href="/dashboard/admin/bookings" style={linkBtn}>All Bookings</Link>
          <Link href="/dashboard/admin/users" style={linkBtn}>All Users</Link>
          <SendReportsButton />
        </div>
      </div>

      {/* ── Stat strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <StatCard label="Monthly Revenue" value={`₹${mrr.toLocaleString("en-IN")}`} sub={`${activeSubsCount} active subscriptions`} accent="#d4a843" />
        <StatCard label="Active Students" value={Number(totalStudents)} sub={`${statusMap["trial"] ?? 0} on trial`} accent="#4caf7d" />
        <StatCard label="New Bookings" value={newBookingsCount} sub="awaiting follow-up" accent={newBookingsCount > 0 ? "#ff9800" : "#444"} />
        <StatCard label="Total Users" value={Number(totalUsers)} sub={`${Number(totalUsers) - Number(totalStudents)} non-students`} />
        <StatCard label="Sessions Today" value={todaysSessions.length} sub="scheduled" accent={todaysSessions.length > 0 ? "#5b8dee" : "#444"} />
        <StatCard label="Reports Sent" value={Number(reportCount)} sub="all time" accent="#a855f7" />
      </div>

      {/* ── Subscription breakdown ── */}
      {activeSubsCount > 0 && (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ color: "#555", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Active Plans</span>
          {(["spark", "illuminate", "mastery"] as const).map(tier => (
            <div key={tier} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: tier === "mastery" ? "#d4a843" : tier === "illuminate" ? "#5b8dee" : "#4caf7d" }}>
                {tierMap[tier] ?? 0}
              </div>
              <div style={{ fontSize: "0.7rem", color: "#555", textTransform: "capitalize" }}>{tier}</div>
            </div>
          ))}
          <div style={{ marginLeft: "auto", color: "#555", fontSize: "0.78rem" }}>
            Spark ₹499 · Illuminate ₹999 · Mastery ₹1,999
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", alignItems: "start" }}>

        {/* ── Booking pipeline ── */}
        <div>
          <SectionHeader title="Booking Pipeline" count={Number(totalBookings)} link="/dashboard/admin/bookings" linkLabel="View all" />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {recentBookings.length === 0 && (
              <Empty text="No bookings yet — share your landing page to start getting requests." />
            )}
            {recentBookings.map(b => {
              const waText = encodeURIComponent(`Hi ${b.parentName}, this is EduCreation. We received your session request for ${b.studentName} (${b.class}, ${b.board}). When would be a good time for the free demo session?`);
              const waLink = `https://wa.me/${b.whatsapp.replace(/\D/g, "")}?text=${waText}`;
              return (
                <div key={b.id} style={{
                  background: "#111",
                  border: "1px solid #1e1e1e",
                  borderLeft: `3px solid ${STATUS_COLOR[b.status]}`,
                  borderRadius: 10,
                  padding: "0.875rem 1rem",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{b.studentName}</span>
                        <span style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: 3, background: STATUS_COLOR[b.status] + "22", color: STATUS_COLOR[b.status], fontWeight: 700, textTransform: "uppercase" }}>
                          {STATUS_LABEL[b.status]}
                        </span>
                      </div>
                      <div style={{ color: "#666", fontSize: "0.78rem" }}>
                        {b.parentName} · {b.class} · {b.board}
                        {b.subject ? ` · ${b.subject}` : ""}
                      </div>
                      {b.concern && (
                        <div style={{ color: "#444", fontSize: "0.75rem", marginTop: "0.25rem", fontStyle: "italic" }}>"{b.concern}"</div>
                      )}
                      <div style={{ color: "#333", fontSize: "0.7rem", marginTop: "0.2rem" }}>
                        {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", alignItems: "flex-end" }}>
                      <a href={waLink} target="_blank" rel="noopener noreferrer" style={{
                        padding: "4px 10px", background: "#0d1f0d", border: "1px solid #25d366",
                        borderRadius: 6, color: "#25d366", fontSize: "0.72rem", fontWeight: 600, textDecoration: "none",
                      }}>WA ↗</a>
                      <BookingStatusButton id={b.id} currentStatus={b.status} nextStatus={STATUS_NEXT[b.status]} nextLabel={`→ ${STATUS_LABEL[STATUS_NEXT[b.status]]}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Today's sessions */}
          <div>
            <SectionHeader title="Sessions Today" count={todaysSessions.length} />
            {todaysSessions.length === 0 ? (
              <Empty text="No sessions scheduled today." />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {todaysSessions.map(s => (
                  <div key={s.id} style={{
                    background: "#111", border: "1px solid #1e1e1e", borderRadius: 8,
                    padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Student #{s.studentId}</div>
                      <div style={{ color: "#555", fontSize: "0.75rem" }}>
                        {new Date(s.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · {s.durationMins} min
                        {s.subjects?.length ? ` · ${s.subjects.join(", ")}` : ""}
                      </div>
                    </div>
                    <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: 4, fontWeight: 700, textTransform: "uppercase",
                      background: s.status === "scheduled" ? "rgba(91,141,238,0.15)" : s.status === "completed" ? "rgba(76,175,125,0.15)" : "rgba(255,255,255,0.06)",
                      color: s.status === "scheduled" ? "#5b8dee" : s.status === "completed" ? "#4caf7d" : "#666",
                    }}>{s.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent signups */}
          <div>
            <SectionHeader title="Recent Signups" count={Number(totalUsers)} link="/dashboard/admin/users" linkLabel="View all" />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {recentUsers.map(u => (
                <div key={u.id} style={{
                  background: "#111", border: "1px solid #1e1e1e", borderRadius: 8,
                  padding: "0.65rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{u.name}</span>
                    <span style={{ color: "#444", fontSize: "0.75rem", marginLeft: "0.5rem" }}>{u.email}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: 3, fontWeight: 700, textTransform: "uppercase",
                      background: u.role === "admin" ? "rgba(212,168,67,0.15)" : u.role === "mentor" ? "rgba(168,85,247,0.15)" : u.role === "parent" ? "rgba(91,141,238,0.15)" : "rgba(76,175,125,0.15)",
                      color: u.role === "admin" ? "#d4a843" : u.role === "mentor" ? "#c084fc" : u.role === "parent" ? "#5b8dee" : "#4caf7d",
                    }}>{u.role}</span>
                    <span style={{ color: "#333", fontSize: "0.68rem" }}>
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "1rem 1.25rem" }}>
            <div style={{ fontSize: "0.72rem", color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>Quick Actions</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {[
                { href: "/dashboard/admin/bookings", label: "📋 Manage Bookings", sub: `${newBookingsCount} new` },
                { href: "/dashboard/admin/users",    label: "👥 Manage Users",    sub: `${Number(totalUsers)} total` },
                { href: "/",                          label: "🌐 View Live Site",   sub: "educreators.org" },
                { href: "/contact",                   label: "📨 Contact Page",     sub: "test form" },
              ].map(a => (
                <Link key={a.href} href={a.href} style={{
                  background: "#161616", border: "1px solid #1e1e1e", borderRadius: 8,
                  padding: "0.65rem 0.75rem", textDecoration: "none", display: "block",
                  transition: "border-color 0.15s",
                }}>
                  <div style={{ color: "#d4a843", fontWeight: 600, fontSize: "0.8rem" }}>{a.label}</div>
                  <div style={{ color: "#444", fontSize: "0.72rem", marginTop: "0.15rem" }}>{a.sub}</div>
                </Link>
              ))}
            </div>
            <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#555", fontSize: "0.72rem" }}>Weekly Parent Reports</div>
                <div style={{ color: "#333", fontSize: "0.68rem" }}>Auto-runs every Sunday 8 AM IST</div>
              </div>
              <SendReportsButton />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────

const linkBtn: React.CSSProperties = {
  background: "#111", border: "1px solid #1e1e1e", borderRadius: 8,
  padding: "7px 14px", color: "#aaa", fontSize: "0.8rem", fontWeight: 500,
  textDecoration: "none", display: "inline-block",
};

function SectionHeader({ title, count, link, linkLabel }: {
  title: string; count: number; link?: string; linkLabel?: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{title}</span>
        <span style={{ background: "#1a1a1a", color: "#555", borderRadius: 4, padding: "1px 7px", fontSize: "0.72rem", fontWeight: 600 }}>{count}</span>
      </div>
      {link && linkLabel && (
        <Link href={link} style={{ color: "#d4a843", fontSize: "0.75rem", textDecoration: "none" }}>{linkLabel} →</Link>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: "1.25rem", color: "#333", fontSize: "0.8rem", textAlign: "center" }}>
      {text}
    </div>
  );
}
