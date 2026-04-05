import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { students, parentReports } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function ParentReportsPage() {
  const session = await auth();
  if (!session || session.user.role !== "parent") redirect("/login");

  const parentUserId = Number(session.user.id);

  const [child] = await db
    .select()
    .from(students)
    .where(eq(students.parentId, parentUserId))
    .limit(1);

  const reports = child
    ? await db
        .select()
        .from(parentReports)
        .where(eq(parentReports.studentId, child.id))
        .orderBy(desc(parentReports.weekStart))
    : [];

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>Weekly Reports</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>{reports.length} reports · generated every Sunday</p>

      {reports.length === 0 ? (
        <div style={{
          background: "#111",
          border: "1px solid #1e1e1e",
          borderRadius: "12px",
          padding: "2rem",
          textAlign: "center",
          color: "#444",
        }}>
          No reports yet. Reports are auto-generated every Sunday after your child's sessions.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {reports.map((r) => (
            <div key={r.id} style={{
              background: "#111",
              border: "1px solid #1e1e1e",
              borderRadius: "12px",
              padding: "1.5rem",
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1rem" }}>
                    Week of {new Date(r.weekStart).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                  <div style={{ color: "#555", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                    {r.sessionsCompleted} session{r.sessionsCompleted !== 1 ? "s" : ""} completed
                    {r.emailSentAt && ` · Emailed ${new Date(r.emailSentAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                  </div>
                </div>
                <div style={{
                  padding: "0.3rem 0.75rem",
                  background: "#1a3a1a",
                  border: "1px solid #4caf7d33",
                  borderRadius: "6px",
                  color: "#4caf7d",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}>
                  {r.sessionsCompleted} / wk
                </div>
              </div>

              {/* Concepts covered */}
              {r.conceptsCovered && r.conceptsCovered.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ color: "#555", fontSize: "0.75rem", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Concepts Covered
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {r.conceptsCovered.map((c) => (
                      <span key={c} style={{
                        padding: "0.2rem 0.6rem",
                        background: "#1a1a2a",
                        border: "1px solid #2a2a4a",
                        borderRadius: "20px",
                        color: "#8899ff",
                        fontSize: "0.8rem",
                      }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress summary */}
              {r.progressSummary && (
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ color: "#555", fontSize: "0.75rem", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Progress Summary
                  </div>
                  <p style={{ color: "#bbb", fontSize: "0.9rem", lineHeight: 1.7 }}>{r.progressSummary}</p>
                </div>
              )}

              {/* Mentor note */}
              {r.mentorNote && (
                <div style={{ padding: "0.875rem", background: "#161616", borderRadius: "8px", borderLeft: "3px solid #d4a843" }}>
                  <div style={{ color: "#888", fontSize: "0.75rem", marginBottom: "0.3rem" }}>Personal note from your mentor</div>
                  <p style={{ color: "#ccc", fontSize: "0.875rem", fontStyle: "italic" }}>{r.mentorNote}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
