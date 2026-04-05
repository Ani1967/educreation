import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/auth";

const NAV_ITEMS: Record<string, { label: string; href: string }[]> = {
  student: [
    { label: "Overview", href: "/dashboard/student" },
    { label: "My Sessions", href: "/dashboard/student/sessions" },
    { label: "Progress", href: "/dashboard/student/progress" },
  ],
  parent: [
    { label: "Overview",      href: "/dashboard/parent" },
    { label: "Reports",       href: "/dashboard/parent/reports" },
    { label: "Subscription",  href: "/dashboard/parent/subscription" },
  ],
  mentor: [
    { label: "Overview", href: "/dashboard/mentor" },
    { label: "My Students", href: "/dashboard/mentor/students" },
    { label: "Sessions", href: "/dashboard/mentor/sessions" },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "Bookings", href: "/dashboard/admin/bookings" },
    { label: "Users", href: "/dashboard/admin/users" },
    { label: "Sessions", href: "/dashboard/admin/sessions" },
  ],
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const role = session.user.role as string;
  const navItems = NAV_ITEMS[role] || [];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px",
        background: "#111",
        borderRight: "1px solid #1e1e1e",
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem 0",
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: "0 1.5rem 1.5rem", borderBottom: "1px solid #1e1e1e" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #d4a843, #f0c060)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              EduCreation
            </div>
          </Link>
          <div style={{
            marginTop: "0.4rem",
            fontSize: "0.75rem",
            color: "#555",
            textTransform: "capitalize",
          }}>
            {role} portal
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "1rem 0" }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "block",
                padding: "0.6rem 1.5rem",
                color: "#aaa",
                textDecoration: "none",
                fontSize: "0.9rem",
                transition: "color 0.2s",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User + Signout */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #1e1e1e" }}>
          <div style={{ color: "#666", fontSize: "0.8rem", marginBottom: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
              color: "#666",
              padding: "0.4rem 0.75rem",
              fontSize: "0.8rem",
              cursor: "pointer",
              width: "100%",
            }}>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}
