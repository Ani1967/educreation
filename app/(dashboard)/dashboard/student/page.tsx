import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { students, sessions, users, parentReports } from "@/lib/db/schema";
import { eq, desc, gte, and } from "drizzle-orm";
import Link from "next/link";

const TIER_COLOR: Record<string, string> = {
  spark:      "#5b8dee",
  illuminate: "#d4a843",
  mastery:    "#c084fc",
};

const TIER_LABEL: Record<string, string> = {
  spark: "Spark", illuminate: "Illuminate", mastery: "Mastery",
};

function fmtDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}
function fmtTime(d: Date | string) {
  return new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}
function fmtShort(d: Date | string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default async function StudentDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "student") redirect("/login");

  const userId   = Number(session.user.id);
  const firstName = session.user.name?.split(" ")[0] ?? "there";

  // ── Data fetch ────────────────────────────────────────────────────
  const [student] = await db
    .select().from(students).where(eq(students.userId, userId)).limit(1);

  let mentorName: string | null = null;
  if (student?.mentorId) {
    const [m] = await db.select({ name: users.name }).from(users)
      .where(eq(users.id, student.mentorId)).limit(1);
    mentorName = m?.name ?? null;
  }

  const now = new Date();

  const [nextSession] = student
    ? await db.select().from(sessions)
        .where(and(
          eq(sessions.studentId, student.id),
          gte(sessions.scheduledAt, now),
          eq(sessions.status, "scheduled"),
        ))
        .orderBy(sessions.scheduledAt)
        .limit(1)
    : [undefined];

  const pastSessions = student
    ? await db.select().from(sessions)
        .where(eq(sessions.studentId, student.id))
        .orderBy(desc(sessions.scheduledAt))
        .limit(5)
    : [];

  const [latestReport] = student
    ? await db.select().from(parentReports)
        .where(eq(parentReports.studentId, student.id))
        .orderBy(desc(parentReports.weekStart))
        .limit(1)
    : [undefined];

  const completedCount = pastSessions.filter(s => s.status === "completed").length;
  const tier = student?.subscriptionTier;

  // ── Shared styles ─────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: "14px",
    padding: "1.4rem 1.5rem",
  };
  const label: React.CSSProperties = {
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.09em",
    color: "#555",
    marginBottom: "0.4rem",
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", color: "#fff" }}>

      {/* ── Section 1: Header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.2rem", letterSpacing: "-0.3px" }}>
              Hello, {firstName} 👋
            </h1>
            <p style={{ color: "#555", fontSize: "0.9rem" }}>
              {student
                ? `${student.class} · ${student.board}${mentorName ? ` · Mentor: ${mentorName}` : ""}`
                : "Your profile is being set up."}
            </p>
          </div>

          {/* Subscription badge */}
          {tier && (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              border: `1px solid ${TIER_COLOR[tier]}44`,
              background: `${TIER_COLOR[tier]}12`,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: TIER_COLOR[tier] }} />
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: TIER_COLOR[tier] }}>
                {TIER_LABEL[tier]} Plan
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Quick stats row ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "0.75rem",
        marginBottom: "1.5rem",
      }}>
        {[
          { label: "Sessions Done",    value: completedCount || "—" },
          { label: "Next Session",     value: nextSession ? fmtShort(nextSession.scheduledAt) : "—" },
          { label: "Your Mentor",      value: mentorName || "TBD" },
          { label: "Plan",             value: tier ? TIER_LABEL[tier] : "Trial" },
        ].map(c => (
          <div key={c.label} style={{ ...card, padding: "1rem 1.1rem" }}>
            <div style={label}>{c.label}</div>
            <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#d4a843" }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* ── Section 5: Next Session ── */}
      {nextSession ? (
        <div style={{
          ...card,
          marginBottom: "1.25rem",
          borderColor: "rgba(212,168,67,0.25)",
          background: "rgba(212,168,67,0.04)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ ...label, color: "#d4a843" }}>Your next session</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: "0.25rem" }}>
                {fmtDate(nextSession.scheduledAt)}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#888" }}>
                {fmtTime(nextSession.scheduledAt)}
                {nextSession.durationMins ? ` · ${nextSession.durationMins} min` : ""}
                {nextSession.subjects && nextSession.subjects.length > 0
                  ? ` · ${nextSession.subjects.join(", ")}`
                  : ""}
              </div>
              {nextSession.nextSessionPlan && (
                <div style={{
                  marginTop: "0.75rem",
                  padding: "0.6rem 0.875rem",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  color: "#aaa",
                  lineHeight: 1.6,
                }}>
                  <span style={{ color: "#555", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    Mentor plan for this session:{" "}
                  </span>
                  {nextSession.nextSessionPlan}
                </div>
              )}
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.5rem",
              flexShrink: 0,
            }}>
              <div style={{
                padding: "0.4rem 0.875rem",
                borderRadius: "999px",
                background: "rgba(212,168,67,0.15)",
                color: "#d4a843",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}>
                Scheduled
              </div>
              <p style={{ fontSize: "0.75rem", color: "#444", textAlign: "right" }}>
                Have paper + pencil ready.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          ...card,
          marginBottom: "1.25rem",
          borderStyle: "dashed",
          borderColor: "#2a2a2a",
          textAlign: "center",
          padding: "2rem",
        }}>
          <div style={{ color: "#555", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
            No session scheduled yet.
          </div>
          <a
            href="https://wa.me/919052416158?text=Hi%20I%20want%20to%20book%20a%20session"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              padding: "0.5rem 1.25rem",
              background: "#25d366",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            📱 Book a session via WhatsApp
          </a>
        </div>
      )}

      {/* ── Section 4: Latest Weekly Report ── */}
      {latestReport ? (
        <div style={{ ...card, marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <div style={label}>Latest report from your mentor</div>
              <div style={{ fontSize: "1rem", fontWeight: 600, color: "#fff" }}>
                Week of{" "}
                {new Date(latestReport.weekStart).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                {" – "}
                {new Date(latestReport.weekEnd).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </div>
            <div style={{
              padding: "0.35rem 0.875rem",
              background: "rgba(76,175,125,0.12)",
              border: "1px solid rgba(76,175,125,0.2)",
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "#4caf7d",
            }}>
              {latestReport.sessionsCompleted} session{latestReport.sessionsCompleted !== 1 ? "s" : ""} completed
            </div>
          </div>

          {/* Concepts covered */}
          {latestReport.conceptsCovered && latestReport.conceptsCovered.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <div style={label}>Topics covered</div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {latestReport.conceptsCovered.map(c => (
                  <span key={c} style={{
                    padding: "0.25rem 0.65rem",
                    background: "rgba(212,168,67,0.1)",
                    border: "1px solid rgba(212,168,67,0.2)",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    color: "#d4a843",
                  }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Progress summary */}
          {latestReport.progressSummary && (
            <div style={{ marginBottom: latestReport.mentorNote ? "1rem" : "0" }}>
              <div style={label}>Progress summary</div>
              <p style={{ fontSize: "0.9rem", color: "#ccc", lineHeight: 1.75 }}>
                {latestReport.progressSummary}
              </p>
            </div>
          )}

          {/* Mentor note */}
          {latestReport.mentorNote && (
            <div style={{
              padding: "0.75rem 1rem",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid #1e1e1e",
              borderLeft: "3px solid #d4a843",
              borderRadius: "0 8px 8px 0",
            }}>
              <div style={{ ...label, marginBottom: "0.3rem" }}>Note from your mentor</div>
              <p style={{ fontSize: "0.875rem", color: "#aaa", lineHeight: 1.7 }}>
                {latestReport.mentorNote}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ ...card, marginBottom: "1.25rem", borderStyle: "dashed", borderColor: "#2a2a2a" }}>
          <div style={label}>Latest report</div>
          <p style={{ color: "#444", fontSize: "0.875rem" }}>
            Your first weekly report will appear here after your mentor completes a session.
          </p>
        </div>
      )}

      {/* ── Past sessions ── */}
      {pastSessions.length > 0 && (
        <div style={{ ...card, marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#aaa" }}>Session History</div>
            <Link href="/dashboard/student/sessions" style={{ color: "#d4a843", fontSize: "0.8rem", textDecoration: "none" }}>
              View all →
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {pastSessions.map(s => (
              <div key={s.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 0.875rem",
                background: "#161616",
                borderRadius: "8px",
                border: "1px solid #1e1e1e",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}>
                <div>
                  <div style={{ fontSize: "0.87rem", fontWeight: 500 }}>
                    {fmtDate(s.scheduledAt)}
                  </div>
                  {s.subjects && s.subjects.length > 0 && (
                    <div style={{ color: "#555", fontSize: "0.78rem", marginTop: "0.1rem" }}>
                      {s.subjects.join(", ")}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  {s.durationMins && (
                    <span style={{ fontSize: "0.75rem", color: "#555" }}>{s.durationMins} min</span>
                  )}
                  <span style={{
                    padding: "0.2rem 0.6rem",
                    borderRadius: "6px",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    background: s.status === "completed" ? "rgba(76,175,125,0.12)" : "rgba(255,255,255,0.05)",
                    color: s.status === "completed" ? "#4caf7d" : "#555",
                  }}>
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Subjects ── */}
      {student?.subjects && student.subjects.length > 0 && (
        <div style={card}>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#aaa", marginBottom: "0.75rem" }}>
            My Subjects
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {student.subjects.map(sub => (
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
