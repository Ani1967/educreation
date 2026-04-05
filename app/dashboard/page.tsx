import { auth } from "@/auth";
import { redirect } from "next/navigation";

const ROLE_HOME: Record<string, string> = {
  student: "/dashboard/student",
  parent:  "/dashboard/parent",
  mentor:  "/dashboard/mentor",
  admin:   "/dashboard/admin",
};

export default async function DashboardIndex() {
  const session = await auth();
  if (!session) redirect("/login");
  const role = session.user.role as string;
  redirect(ROLE_HOME[role] || "/login");
}
