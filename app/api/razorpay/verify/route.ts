import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createHmac } from "crypto";
import { db } from "@/lib/db";
import { students, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { PlanKey } from "@/lib/razorpay";
import { PLANS } from "@/lib/razorpay";

// POST /api/razorpay/verify
// Verifies Razorpay payment signature and activates subscription in DB.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
  } = await req.json() as {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    plan: PlanKey;
  };

  // Verify signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSig = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSig !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const userId = Number(session.user.id);

  // Find the student record for this user
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.userId, userId))
    .limit(1);

  if (!student) {
    return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
  }

  const planInfo = PLANS[plan];
  const now = new Date();
  const renewsAt = new Date(now);
  renewsAt.setMonth(renewsAt.getMonth() + 1);

  // Insert subscription record
  await db.insert(subscriptions).values({
    studentId:            student.id,
    tier:                 plan,
    status:               "active",
    amountPaise:          planInfo.amountPaise,
    razorpaySubscriptionId: razorpay_payment_id,
    startedAt:            now,
    renewsAt,
  });

  // Update student's subscription tier + status
  await db
    .update(students)
    .set({ subscriptionTier: plan, subscriptionStatus: "active" })
    .where(eq(students.id, student.id));

  return NextResponse.json({ success: true, plan, renewsAt });
}
