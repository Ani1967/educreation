import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { students, sessions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

const STATUS_COLOR: Record<string, string> = {
  scheduled:  "#d4a843",
  completed:  "#4caf7d",
  cancelled:  "#ff6b6b",
  no_show:    "#666",
};

const STATUS_LABEL: Record<string, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show:   "No Show",
};

export default async function StudentSessionsPage() {
  const session = await auth();
  if (!session || session.user.role !== "student") redirect("/login");

  const userId = Number(session.user.id);

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.userId, userId))
    .limit(1);

  const allSessions = student
    ? await db
        .select()
        .from(sessions)
        .where(eq(sessions.studentId, student.id))
        .orderBy(desc(sessions.scheduledAt))
    : [];

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>My Sessions</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>{allSessions.length} total sessions</p>

      {allSessions.length === 0 ? (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "#444" }}>
          No sessions yet. Your mentor will schedule your first session.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {allSessions.map((s) => (
            <div key={s.id} style={{
              background: "#111",
              border: "1px solid #1e1e1e",
              borderLeft: `3px solid ${STATUS_COLOR[s.status] || "#333"}`,
              borderRadius: "12px",
              padding: "1.25rem 1.5rem",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "1rem" }}>
                    {new Date(s.scheduledAt).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </div>
                  <div style={{ color: "#666", fontSize: "0.85rem", marginTop: "0.25rem" }}>
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
                }}>
                  {STATUS_LABEL[s.status]}
                </span>
              </div>

              {s.sessionNotes && (
                <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "#161616", borderRadius: "8px", color: "#888", fontSize: "0.85rem" }}>
                  <strong style={{ color: "#666", fontSize: "0.75rem", display: "block", marginBottom: "0.25rem" }}>Mentor Notes</strong>
                  {s.sessionNotes}
                </div>
              )}

              {s.nextSessionPlan && (
                <div style={{ marginTop: "0.5rem", color: "#5b8dee", fontSize: "0.85rem" }}>
                  <strong style={{ color: "#444", fontSize: "0.75rem" }}>Next: </strong>{s.nextSessionPlan}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
