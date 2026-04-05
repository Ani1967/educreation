import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

const ROLE_COLOR: Record<string, string> = {
  student: "#5b8dee",
  parent:  "#4caf7d",
  mentor:  "#d4a843",
  admin:   "#ff6b6b",
};

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/login");

  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Users
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>{allUsers.length} registered accounts</p>

      <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
              {["Name", "Email", "Role", "Status", "Joined"].map((h) => (
                <th key={h} style={{
                  padding: "0.875rem 1.25rem",
                  textAlign: "left",
                  color: "#555",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allUsers.map((u, i) => (
              <tr key={u.id} style={{
                borderBottom: i < allUsers.length - 1 ? "1px solid #161616" : "none",
                transition: "background 0.15s",
              }}>
                <td style={{ padding: "0.875rem 1.25rem", fontWeight: 600, fontSize: "0.9rem" }}>
                  {u.name}
                </td>
                <td style={{ padding: "0.875rem 1.25rem", color: "#888", fontSize: "0.875rem" }}>
                  {u.email}
                </td>
                <td style={{ padding: "0.875rem 1.25rem" }}>
                  <span style={{
                    padding: "0.2rem 0.6rem",
                    borderRadius: "4px",
                    background: (ROLE_COLOR[u.role] || "#555") + "22",
                    color: ROLE_COLOR[u.role] || "#555",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1.25rem" }}>
                  <span style={{
                    padding: "0.2rem 0.6rem",
                    borderRadius: "4px",
                    background: u.isActive ? "#1a3a1a" : "#2a1a1a",
                    color: u.isActive ? "#4caf7d" : "#ff6b6b",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}>
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ padding: "0.875rem 1.25rem", color: "#555", fontSize: "0.8rem" }}>
                  {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {allUsers.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center", color: "#444" }}>
            No users yet.
          </div>
        )}
      </div>
    </div>
  );
}
