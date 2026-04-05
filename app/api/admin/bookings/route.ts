import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// PATCH /api/admin/bookings — update booking status
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, status } = await req.json();

  const validStatuses = ["new", "contacted", "converted", "dropped"];
  if (!id || !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await db.update(bookings).set({ status }).where(eq(bookings.id, id));

  return NextResponse.json({ success: true });
}
