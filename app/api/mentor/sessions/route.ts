import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sessions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// PATCH /api/mentor/sessions — save session notes + next plan
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user.role !== "mentor" && session.user.role !== "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const mentorUserId = Number(session.user.id);
  const { id, sessionNotes, nextSessionPlan } = await req.json();

  if (!id) return NextResponse.json({ error: "Missing session id" }, { status: 400 });

  // Ensure the session belongs to this mentor (unless admin)
  const where = session.user.role === "admin"
    ? eq(sessions.id, id)
    : and(eq(sessions.id, id), eq(sessions.mentorId, mentorUserId));

  await db
    .update(sessions)
    .set({ sessionNotes: sessionNotes || null, nextSessionPlan: nextSessionPlan || null })
    .where(where);

  return NextResponse.json({ success: true });
}
