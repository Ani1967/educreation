import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { students, sessions, users } from "@/lib/db/schema";
import { eq, desc, gte, and } from "drizzle-orm";
import Link from "next/link";

const TIER_COLOR: Record<string, string> = {
  spark:      "#5b8dee",
  illuminate: "#d4a843",
  mastery:    "#c084fc",
};

const STATUS_COLOR: Record<string, string> = {
  scheduled:  "#d4a843",
  completed:  "#4caf7d",
  cancelled:  "#ff6b6b",
  no_show:    "#666",
};

export default async function StudentDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "student") redirect("/login");

  const userId = Number(session.user.id);

  // Get student record
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.userId, userId))
    .limit(1);

  // Get mentor name if assigned
  let mentorName: string | null = null;
  if (student?.mentorId) {
    const [mentor] = await db.select({ name: users.name }).from(users).where(eq(users.id, student.mentorId)).limit(1);
    mentorName = mentor?.name ?? null;
  }

  // Get upcoming + recent sessions
  const now = new Date();
  const upcomingSessions = student
    ? await db
        .select()
        .from(sessions)
        .where(and(eq(sessions.studentId, student.id), gte(sessions.scheduledAt, now), eq(sessions.status, "scheduled")))
        .orderBy(sessions.scheduledAt)
        .limit(3)
    : [];

  const pastSessions = student
    ? await db
        .select()
        .from(sessions)
        .where(eq(sessions.studentId, student.id))
        .orderBy(desc(sessions.scheduledAt))
        .limit(5)
    : [];

  const completedCount = pastSessions.filter((s) => s.status === "completed").length;

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.25rem" }}>
        Welcome back, {session.user.name.split(" ")[0]} 👋
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        {student ? `${student.class} · ${student.board}` : "Your profile is being set up."}
      </p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Sessions Completed", value: completedCount || "—" },
          { label: "Upcoming Sessions",  value: upcomingSessions.length || "—" },
          { label: "Mentor",             value: mentorName || "TBD" },
          { label: "Subscription",       value: student?.subscriptionTier
              ? <span style={{ color: TIER_COLOR[student.subscriptionTier], textTransform: "capitalize" }}>{student.subscriptionTier}</span>
              : <span style={{ color: "#555" }}>Trial</span>
          },
        ].map((card) => (
          <div key={card.label} style={{
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "12px",
            padding: "1.25rem",
          }}>
            <div style={{ color: "#555", fontSize: "0.8rem", marginBottom: "0.5rem" }}>{card.label}</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#d4a843" }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Upcoming sessions */}
      <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#aaa" }}>Upcoming Sessions</h2>
          <Link href="/dashboard/student/sessions" style={{ color: "#d4a843", fontSize: "0.8rem", textDecoration: "none" }}>
            View all →
          </Link>
        </div>
        {upcomingSessions.length === 0 ? (
          <p style={{ color: "#444", fontSize: "0.9rem" }}>No upcoming sessions. Your mentor will schedule one soon.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {upcomingSessions.map((s) => (
              <div key={s.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.875rem 1rem",
                background: "#161616",
                borderRadius: "8px",
                border: "1px solid #1e1e1e",
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    {new Date(s.scheduledAt).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                    {" "}&middot;{" "}
                    {new Date(s.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {s.subjects && s.subjects.length > 0 && (
                    <div style={{ color: "#666", fontSize: "0.8rem", marginTop: "0.2rem" }}>{s.subjects.join(", ")}</div>
                  )}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#d4a843" }}>{s.durationMins} min</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subjects */}
      {student?.subjects && student.subjects.length > 0 && (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#aaa", marginBottom: "0.75rem" }}>My Subjects</h2>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {student.subjects.map((sub) => (
              <span key={sub} style={{
                padding: "0.3rem 0.75rem",
                background: "#1a1a2a",
                border: "1px solid #2a2a4a",
                borderRadius: "20px",
                color: "#8899ff",
                fontSize: "0.85rem",
              }}>
                {sub}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
