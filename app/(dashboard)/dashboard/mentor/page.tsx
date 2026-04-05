import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { students, sessions, users } from "@/lib/db/schema";
import { eq, desc, gte, and } from "drizzle-orm";
import Link from "next/link";

export default async function MentorDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "mentor") redirect("/login");

  const mentorUserId = Number(session.user.id);

  // My students
  const myStudents = await db
    .select({
      id:    students.id,
      userId: students.userId,
      class: students.class,
      board: students.board,
      subscriptionTier: students.subscriptionTier,
      subscriptionStatus: students.subscriptionStatus,
    })
    .from(students)
    .where(eq(students.mentorId, mentorUserId));

  const studentIds = myStudents.map((s) => s.id);

  // Get student user names
  const studentUsers = myStudents.length > 0
    ? await db
        .select({ id: users.id, name: users.name })
        .from(users)
        .where(eq(users.id, myStudents[0].userId)) // simplified for now — fetched per student in detail page
    : [];

  // Sessions today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todaySessions = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.mentorId, mentorUserId), gte(sessions.scheduledAt, todayStart)))
    .orderBy(sessions.scheduledAt)
    .limit(10);

  // Recent sessions needing notes
  const pendingNotes = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.mentorId, mentorUserId), eq(sessions.status, "completed")))
    .orderBy(desc(sessions.scheduledAt))
    .limit(5);

  const pendingNotesCount = pendingNotes.filter((s) => !s.sessionNotes).length;

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.25rem" }}>
        Mentor Dashboard
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        {session.user.name}
      </p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Active Students",   value: myStudents.length },
          { label: "Today's Sessions",  value: todaySessions.length },
          { label: "Pending Notes",     value: pendingNotesCount || "—" },
          { label: "Total Sessions",    value: "—" },
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

      {/* Today's sessions */}
      <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#aaa" }}>Today's Sessions</h2>
          <Link href="/dashboard/mentor/sessions" style={{ color: "#d4a843", fontSize: "0.8rem", textDecoration: "none" }}>
            All sessions →
          </Link>
        </div>
        {todaySessions.length === 0 ? (
          <p style={{ color: "#444", fontSize: "0.9rem" }}>No sessions scheduled for today.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {todaySessions.map((s) => (
              <div key={s.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                background: "#161616",
                borderRadius: "8px",
                fontSize: "0.875rem",
              }}>
                <div>
                  <div style={{ color: "#bbb" }}>
                    {new Date(s.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    {" · "}{s.durationMins} min
                    {s.subjects && s.subjects.length > 0 && ` · ${s.subjects.join(", ")}`}
                  </div>
                </div>
                <Link href={`/dashboard/mentor/sessions`} style={{
                  padding: "0.3rem 0.6rem",
                  background: "#1a2a1a",
                  border: "1px solid #2a4a2a",
                  borderRadius: "6px",
                  color: "#4caf7d",
                  fontSize: "0.75rem",
                  textDecoration: "none",
                }}>
                  Add Notes
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My students */}
      <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#aaa" }}>My Students</h2>
          <Link href="/dashboard/mentor/students" style={{ color: "#d4a843", fontSize: "0.8rem", textDecoration: "none" }}>
            View all →
          </Link>
        </div>
        {myStudents.length === 0 ? (
          <p style={{ color: "#444", fontSize: "0.9rem" }}>No students assigned yet. Admin will assign students to you.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {myStudents.slice(0, 5).map((s) => (
              <div key={s.id} style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.75rem 1rem",
                background: "#161616",
                borderRadius: "8px",
                fontSize: "0.875rem",
              }}>
                <span style={{ color: "#bbb" }}>
                  {s.class} · {s.board}
                </span>
                <span style={{ color: s.subscriptionTier ? "#d4a843" : "#555", textTransform: "capitalize", fontSize: "0.8rem" }}>
                  {s.subscriptionTier || "Trial"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
