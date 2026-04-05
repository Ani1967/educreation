import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { students, sessions, users, parentReports } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { sendWeeklyReportEmail } from "@/lib/email";

// This route is called by Vercel Cron every Sunday at 8:00 AM IST (2:30 AM UTC)
// Protected by CRON_SECRET — Vercel sends the Authorization header automatically.

export async function GET(req: NextRequest) {
  // Auth check
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Week window: last Monday 00:00 → last Sunday 23:59 IST
  // We run on Sunday — so "this week" = Mon to today (Sun)
  const weekEnd = new Date(now);
  weekEnd.setHours(23, 59, 59, 999);

  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const weekLabel = `${weekStart.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${weekEnd.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;

  // Get all active students who have a parent linked
  const allStudents = await db
    .select()
    .from(students)
    .where(and(
      // only process students that have a parent linked
    ));

  const results: { studentId: number; status: string; email?: string }[] = [];

  for (const student of allStudents) {
    // Skip if no parent linked
    if (!student.parentId) continue;

    // Check if a report already exists for this week (avoid duplicate sends)
    const [existing] = await db
      .select({ id: parentReports.id })
      .from(parentReports)
      .where(and(
        eq(parentReports.studentId, student.id),
        gte(parentReports.weekStart, weekStart),
        lte(parentReports.weekEnd, weekEnd),
      ))
      .limit(1);

    if (existing) {
      results.push({ studentId: student.id, status: "already_sent" });
      continue;
    }

    // Get this week's completed sessions
    const weekSessions = await db
      .select()
      .from(sessions)
      .where(and(
        eq(sessions.studentId, student.id),
        gte(sessions.scheduledAt, weekStart),
        lte(sessions.scheduledAt, weekEnd),
        eq(sessions.status, "completed"),
      ));

    const sessionsCompleted = weekSessions.length;

    // Collect unique subjects/concepts
    const conceptSet = new Set<string>();
    for (const s of weekSessions) {
      if (s.subjects) s.subjects.forEach((sub) => conceptSet.add(sub));
    }
    const conceptsCovered = [...conceptSet];

    // Collect mentor notes for the week
    const mentorNoteLines = weekSessions
      .filter((s) => s.sessionNotes)
      .map((s) => s.sessionNotes!)
      .join(" ");

    // Generate a plain-language progress summary
    let progressSummary = "";
    if (sessionsCompleted === 0) {
      progressSummary = "No sessions were completed this week. Your mentor will be in touch to reschedule.";
    } else {
      const conceptList = conceptsCovered.length > 0
        ? `Topics covered include: ${conceptsCovered.join(", ")}.`
        : "";
      progressSummary = `${student.class} student completed ${sessionsCompleted} session${sessionsCompleted > 1 ? "s" : ""} this week. ${conceptList} Keep up the momentum — consistent sessions are the key to mastery.`;
    }

    // Get the most recent session's nextSessionPlan as the "mentor note"
    const latestSession = weekSessions.sort(
      (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    )[0];
    const mentorNote = latestSession?.sessionNotes || "";

    // Get parent email + name
    const [parentUser] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, student.parentId))
      .limit(1);

    if (!parentUser?.email) {
      results.push({ studentId: student.id, status: "no_parent_email" });
      continue;
    }

    // Get student name
    const [studentUser] = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, student.userId))
      .limit(1);

    // Get mentor name
    let mentorName = "Your Mentor";
    if (student.mentorId) {
      const [mentor] = await db
        .select({ name: users.name })
        .from(users)
        .where(eq(users.id, student.mentorId))
        .limit(1);
      if (mentor) mentorName = mentor.name;
    }

    // Save report to DB
    const [savedReport] = await db
      .insert(parentReports)
      .values({
        studentId: student.id,
        weekStart,
        weekEnd,
        sessionsCompleted,
        conceptsCovered: conceptsCovered.length > 0 ? conceptsCovered : [],
        progressSummary,
        mentorNote: mentorNote || null,
      })
      .returning();

    // Send email
    const { id: emailId, error } = await sendWeeklyReportEmail(parentUser.email, {
      parentName:        parentUser.name,
      studentName:       studentUser?.name || "your child",
      studentClass:      student.class,
      studentBoard:      student.board,
      mentorName,
      weekLabel,
      sessionsCompleted,
      conceptsCovered,
      progressSummary,
      mentorNote,
      dashboardUrl:      `${process.env.NEXTAUTH_URL}/dashboard/parent`,
    });

    if (error) {
      results.push({ studentId: student.id, status: `email_failed: ${error}`, email: parentUser.email });
      continue;
    }

    // Mark email sent
    await db
      .update(parentReports)
      .set({ emailSentAt: new Date() })
      .where(eq(parentReports.id, savedReport.id));

    results.push({ studentId: student.id, status: "sent", email: parentUser.email });
  }

  console.log(`[weekly-reports] ${new Date().toISOString()} — processed ${results.length} students`, results);

  return NextResponse.json({
    ok: true,
    weekLabel,
    processed: results.length,
    results,
  });
}
