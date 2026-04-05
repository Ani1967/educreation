import { NextResponse } from "next/server";
import { auth } from "@/auth";

// POST /api/admin/send-reports — manually trigger the weekly report cron (admin only)
export async function POST() {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/cron/weekly-reports`, {
    headers: {
      authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
