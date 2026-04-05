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

export default async function ParentDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "parent") redirect("/login");

  const parentUserId = Number(session.user.id);

  // Find child: student whose parentId = this user
  const [child] = await db
    .select()
    .from(students)
    .where(eq(students.parentId, parentUserId))
    .limit(1);

  // Get child's user record (name, email)
  let childUser: { name: string; email: string } | null = null;
  if (child) {
    const [cu] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, child.userId))
      .limit(1);
    childUser = cu ?? null;
  }

  // Get mentor name
  let mentorName: string | null = null;
  if (child?.mentorId) {
    const [mentor] = await db.select({ name: users.name }).from(users).where(eq(users.id, child.mentorId)).limit(1);
    mentorName = mentor?.name ?? null;
  }

  // Sessions this week
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekSessions = child
    ? await db
        .select()
        .from(sessions)
        .where(and(eq(sessions.studentId, child.id), gte(sessions.scheduledAt, weekStart)))
        .orderBy(desc(sessions.scheduledAt))
    : [];

  const completedThisWeek = weekSessions.filter((s) => s.status === "completed");

  // Latest parent report
  const [latestReport] = child
    ? await db
        .select()
        .from(parentReports)
        .where(eq(parentReports.studentId, child.id))
        .orderBy(desc(parentReports.weekStart))
        .limit(1)
    : [undefined];

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.25rem" }}>
        Hello, {session.user.name.split(" ")[0]}
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        {child ? `Tracking ${childUser?.name ?? "your child"}'s learning journey` : "Your child's profile is being set up."}
      </p>

      {/* Child card */}
      {child && childUser && (
        <div style={{
          background: "#111",
          border: "1px solid #1e1e1e",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.4rem" }}>{childUser.name}</div>
            <div style={{ color: "#666", fontSize: "0.875rem" }}>
              {child.class} · {child.board}
              {child.city && ` · ${child.city}`}
            </div>
            {child.subjects && child.subjects.length > 0 && (
              <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
                {child.subjects.map((sub) => (
                  <span key={sub} style={{
                    padding: "0.2rem 0.6rem",
                    background: "#1a1a2a",
                    border: "1px solid #2a2a4a",
                    borderRadius: "20px",
                    color: "#8899ff",
                    fontSize: "0.75rem",
                  }}>
                    {sub}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            {child.subscriptionTier ? (
              <span style={{
                padding: "0.3rem 0.8rem",
                borderRadius: "6px",
                background: (TIER_COLOR[child.subscriptionTier] || "#555") + "22",
                color: TIER_COLOR[child.subscriptionTier] || "#555",
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "capitalize",
              }}>
                {child.subscriptionTier} plan
              </span>
            ) : (
              <span style={{ color: "#555", fontSize: "0.8rem" }}>Trial</span>
            )}
            {mentorName && (
              <div style={{ color: "#666", fontSize: "0.8rem", marginTop: "0.4rem" }}>
                Mentor: {mentorName}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Sessions This Week", value: weekSessions.length },
          { label: "Completed This Week", value: completedThisWeek.length },
          { label: "Concepts Covered",    value: completedThisWeek.reduce((acc, s) => acc + (s.subjects?.length ?? 0), 0) || "—" },
          { label: "Weekly Reports",      value: latestReport ? "1 available" : "None yet" },
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

      {/* Latest report preview */}
      <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#aaa" }}>Latest Weekly Report</h2>
          <Link href="/dashboard/parent/reports" style={{ color: "#d4a843", fontSize: "0.8rem", textDecoration: "none" }}>
            View all →
          </Link>
        </div>
        {!latestReport ? (
          <p style={{ color: "#444", fontSize: "0.9rem" }}>
            Reports are generated every Sunday after your child's sessions. Check back after the first week.
          </p>
        ) : (
          <div>
            <div style={{ color: "#666", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
              Week of {new Date(latestReport.weekStart).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
              {" – "}
              {new Date(latestReport.weekEnd).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
            </div>
            {latestReport.progressSummary && (
              <p style={{ color: "#bbb", fontSize: "0.9rem", lineHeight: 1.6 }}>{latestReport.progressSummary}</p>
            )}
            {latestReport.mentorNote && (
              <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "#161616", borderRadius: "8px" }}>
                <div style={{ color: "#666", fontSize: "0.75rem", marginBottom: "0.25rem" }}>Mentor note</div>
                <p style={{ color: "#aaa", fontSize: "0.875rem", fontStyle: "italic" }}>{latestReport.mentorNote}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* This week's sessions */}
      {weekSessions.length > 0 && (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#aaa", marginBottom: "1rem" }}>This Week's Sessions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {weekSessions.map((s) => (
              <div key={s.id} style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.75rem 1rem",
                background: "#161616",
                borderRadius: "8px",
                fontSize: "0.875rem",
              }}>
                <span style={{ color: "#bbb" }}>
                  {new Date(s.scheduledAt).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                  {s.subjects && s.subjects.length > 0 && ` · ${s.subjects.join(", ")}`}
                </span>
                <span style={{
                  color: s.status === "completed" ? "#4caf7d" : s.status === "scheduled" ? "#d4a843" : "#666",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
