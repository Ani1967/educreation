import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/auth";

const NAV_ITEMS: Record<string, { label: string; href: string }[]> = {
  student: [
    { label: "Overview",    href: "/dashboard/student" },
    { label: "My Sessions", href: "/dashboard/student/sessions" },
    { label: "Settings",    href: "/dashboard/settings" },
  ],
  parent: [
    { label: "Overview",     href: "/dashboard/parent" },
    { label: "Reports",      href: "/dashboard/parent/reports" },
    { label: "Subscription", href: "/dashboard/parent/subscription" },
    { label: "Settings",     href: "/dashboard/settings" },
  ],
  mentor: [
    { label: "Overview",    href: "/dashboard/mentor" },
    { label: "My Students", href: "/dashboard/mentor/students" },
    { label: "Sessions",    href: "/dashboard/mentor/sessions" },
    { label: "Settings",    href: "/dashboard/settings" },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin" },
    { label: "Bookings", href: "/dashboard/admin/bookings" },
    { label: "Users",    href: "/dashboard/admin/users" },
    { label: "Settings", href: "/dashboard/settings" },
  ],
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const role = session.user.role as string;
  const navItems = NAV_ITEMS[role] || [];

  return (
    <div className="dash-shell">

      <aside className="dash-sidebar">

        <div className="dash-logo-block">
          <Link href="/" className="dash-logo-text">
            EduCreation
          </Link>
          <span className="dash-role-text">{role} portal</span>
        </div>

        <nav className="dash-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="dash-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="dash-user-block">
          <div className="dash-user-name">{session.user.name}</div>
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}>
            <button type="submit" className="dash-signout-btn">
              Sign out
            </button>
          </form>
        </div>

      </aside>

      <main className="dash-main">
        {children}
      </main>

    </div>
  );
}
