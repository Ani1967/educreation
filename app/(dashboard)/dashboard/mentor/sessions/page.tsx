import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { sessions, students, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import SessionNoteForm from "./SessionNoteForm";

const STATUS_COLOR: Record<string, string> = {
  scheduled:  "#d4a843",
  completed:  "#4caf7d",
  cancelled:  "#ff6b6b",
  no_show:    "#666",
};

export default async function MentorSessionsPage() {
  const session = await auth();
  if (!session || session.user.role !== "mentor") redirect("/login");

  const mentorUserId = Number(session.user.id);

  const allSessions = await db
    .select({
      id:              sessions.id,
      studentId:       sessions.studentId,
      scheduledAt:     sessions.scheduledAt,
      durationMins:    sessions.durationMins,
      subjects:        sessions.subjects,
      status:          sessions.status,
      sessionNotes:    sessions.sessionNotes,
      nextSessionPlan: sessions.nextSessionPlan,
    })
    .from(sessions)
    .where(eq(sessions.mentorId, mentorUserId))
    .orderBy(desc(sessions.scheduledAt))
    .limit(50);

  // Get student user names for display
  const studentIds = [...new Set(allSessions.map((s) => s.studentId))];
  const studentNameMap: Record<number, string> = {};
  for (const sid of studentIds) {
    const [st] = await db.select({ userId: students.userId }).from(students).where(eq(students.id, sid)).limit(1);
    if (st) {
      const [u] = await db.select({ name: users.name }).from(users).where(eq(users.id, st.userId)).limit(1);
      if (u) studentNameMap[sid] = u.name;
    }
  }

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>Sessions</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>{allSessions.length} sessions</p>

      {allSessions.length === 0 ? (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "#444" }}>
          No sessions yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {allSessions.map((s) => (
            <div key={s.id} style={{
              background: "#111",
              border: "1px solid #1e1e1e",
              borderLeft: `3px solid ${STATUS_COLOR[s.status] || "#333"}`,
              borderRadius: "12px",
              padding: "1.25rem 1.5rem",
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "1rem" }}>
                    {studentNameMap[s.studentId] || `Student #${s.studentId}`}
                  </div>
                  <div style={{ color: "#666", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    {new Date(s.scheduledAt).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    {" · "}
                    {new Date(s.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    {" · "}{s.durationMins} min
                    {s.subjects && s.subjects.length > 0 && ` · ${s.subjects.join(", ")}`}
                  </div>
                </div>
                <span style={{
                  padding: "0.2rem 0.6rem",
                  borderRadius: "4px",
                  background: (STATUS_COLOR[s.status] || "#555") + "22",
                  color: STATUS_COLOR[s.status] || "#555",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}>
                  {s.status.replace("_", " ")}
                </span>
              </div>

              {/* Existing notes */}
              {s.sessionNotes && (
                <div style={{ padding: "0.75rem", background: "#161616", borderRadius: "8px", marginBottom: "0.75rem" }}>
                  <div style={{ color: "#555", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Session Notes</div>
                  <p style={{ color: "#aaa", fontSize: "0.875rem" }}>{s.sessionNotes}</p>
                  {s.nextSessionPlan && (
                    <p style={{ color: "#5b8dee", fontSize: "0.85rem", marginTop: "0.4rem" }}>
                      <strong style={{ color: "#444" }}>Next: </strong>{s.nextSessionPlan}
                    </p>
                  )}
                </div>
              )}

              {/* Note form for completed sessions */}
              {s.status === "completed" && (
                <SessionNoteForm
                  sessionId={s.id}
                  existingNotes={s.sessionNotes}
                  existingPlan={s.nextSessionPlan}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
