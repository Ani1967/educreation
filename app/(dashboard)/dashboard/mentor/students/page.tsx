import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { students, users, sessions } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm";

const TIER_COLOR: Record<string, string> = {
  spark:      "#5b8dee",
  illuminate: "#d4a843",
  mastery:    "#c084fc",
};

export default async function MentorStudentsPage() {
  const session = await auth();
  if (!session || session.user.role !== "mentor") redirect("/login");

  const mentorUserId = Number(session.user.id);

  const myStudents = await db
    .select()
    .from(students)
    .where(eq(students.mentorId, mentorUserId));

  // Fetch user names for each student
  const enriched = await Promise.all(
    myStudents.map(async (s) => {
      const [u] = await db
        .select({ name: users.name, email: users.email })
        .from(users)
        .where(eq(users.id, s.userId))
        .limit(1);

      const [{ sessionCount }] = await db
        .select({ sessionCount: count() })
        .from(sessions)
        .where(eq(sessions.studentId, s.id));

      return { ...s, userName: u?.name ?? "—", userEmail: u?.email ?? "—", sessionCount };
    })
  );

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>My Students</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>{enriched.length} students assigned to you</p>

      {enriched.length === 0 ? (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "#444" }}>
          No students assigned yet. Admin will assign students to you.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {enriched.map((s) => (
            <div key={s.id} style={{
              background: "#111",
              border: "1px solid #1e1e1e",
              borderRadius: "12px",
              padding: "1.25rem 1.5rem",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "1rem",
              alignItems: "center",
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.3rem" }}>{s.userName}</div>
                <div style={{ color: "#666", fontSize: "0.875rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <span>{s.class} · {s.board}</span>
                  {s.city && <span>{s.city}</span>}
                  <span>{s.sessionCount} sessions</span>
                  <span style={{ color: "#444" }}>{s.userEmail}</span>
                </div>
                {s.subjects && s.subjects.length > 0 && (
                  <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
                    {s.subjects.map((sub) => (
                      <span key={sub} style={{
                        padding: "0.15rem 0.5rem",
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
                {s.notes && (
                  <div style={{ marginTop: "0.5rem", color: "#555", fontSize: "0.825rem", fontStyle: "italic" }}>
                    {s.notes}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                {s.subscriptionTier ? (
                  <span style={{
                    display: "block",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "6px",
                    background: (TIER_COLOR[s.subscriptionTier] || "#555") + "22",
                    color: TIER_COLOR[s.subscriptionTier] || "#555",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "capitalize",
                    marginBottom: "0.4rem",
                    textAlign: "center",
                  }}>
                    {s.subscriptionTier}
                  </span>
                ) : (
                  <span style={{ display: "block", color: "#444", fontSize: "0.8rem", marginBottom: "0.4rem" }}>Trial</span>
                )}
                <span style={{
                  color: s.subscriptionStatus === "active" ? "#4caf7d" : "#666",
                  fontSize: "0.75rem",
                  textTransform: "capitalize",
                }}>
                  {s.subscriptionStatus || "trial"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
