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
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#0a0a0a",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px",
        minWidth: "220px",
        background: "#111",
        borderRight: "1px solid #1e1e1e",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{
          padding: "1.5rem",
          borderBottom: "1px solid #1e1e1e",
          flexShrink: 0,
        }}>
          <Link href="/" style={{ textDecoration: "none", display: "block" }}>
            <div style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #d4a843, #f0c060)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
            }}>
              EduCreation
            </div>
          </Link>
          <div style={{
            marginTop: "0.35rem",
            fontSize: "0.72rem",
            color: "#555",
            textTransform: "capitalize",
            letterSpacing: "0.03em",
          }}>
            {role} portal
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0.75rem 0" }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "block",
                padding: "0.55rem 1.5rem",
                color: "#888",
                textDecoration: "none",
                fontSize: "0.875rem",
                lineHeight: 1.4,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User + Sign out */}
        <div style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid #1e1e1e",
          flexShrink: 0,
        }}>
          <div style={{
            color: "#555",
            fontSize: "0.78rem",
            marginBottom: "0.6rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: 1.3,
          }}>
            {session.user.name}
          </div>
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}>
            <button type="submit" style={{
              background: "none",
              border: "1px solid #2a2a2a",
              borderRadius: "6px",
              color: "#555",
              padding: "0.4rem 0.75rem",
              fontSize: "0.78rem",
              cursor: "pointer",
              width: "100%",
              textAlign: "center",
            }}>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: "auto", minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
