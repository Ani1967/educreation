import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/auth";

const NAV_ITEMS: Record<string, { label: string; href: string }[]> = {
  student: [
    { label: "Overview",    href: "/dashboard/student" },
    { label: "My Sessions", href: "/dashboard/student/sessions" },
  ],
  parent: [
    { label: "Overview",     href: "/dashboard/parent" },
    { label: "Reports",      href: "/dashboard/parent/reports" },
    { label: "Subscription", href: "/dashboard/parent/subscription" },
  ],
  mentor: [
    { label: "Overview",    href: "/dashboard/mentor" },
    { label: "My Students", href: "/dashboard/mentor/students" },
    { label: "Sessions",    href: "/dashboard/mentor/sessions" },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "Bookings", href: "/dashboard/admin/bookings" },
    { label: "Users",    href: "/dashboard/admin/users" },
  ],
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const role = session.user.role as string;
  const navItems = NAV_ITEMS[role] || [];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: "200px",
        flexShrink: 0,
        background: "#111",
        borderRight: "1px solid #222",
        display: "flex",
        flexDirection: "column",
      }}>

        {/* Logo block */}
        <div style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid #222",
        }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{
              display: "block",
              fontSize: "18px",
              fontWeight: 800,
              background: "linear-gradient(135deg, #d4a843, #f0c060)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              EduCreation
            </span>
          </Link>
          <span style={{
            display: "block",
            marginTop: "4px",
            fontSize: "11px",
            color: "#555",
            textTransform: "capitalize",
          }}>
            {role} portal
          </span>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, paddingTop: "8px", paddingBottom: "8px" }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "block",
                padding: "9px 20px",
                fontSize: "14px",
                color: "#999",
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User + sign out */}
        <div style={{
          padding: "14px 20px",
          borderTop: "1px solid #222",
        }}>
          <div style={{
            fontSize: "13px",
            color: "#555",
            marginBottom: "10px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {session.user.name}
          </div>
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}>
            <button
              type="submit"
              style={{
                display: "block",
                width: "100%",
                padding: "6px 0",
                background: "transparent",
                border: "1px solid #333",
                borderRadius: "6px",
                color: "#666",
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              Sign out
            </button>
          </form>
        </div>

      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
        {children}
      </main>

    </div>
  );
}
