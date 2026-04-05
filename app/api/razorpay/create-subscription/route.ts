import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRazorpay, PLANS, PlanKey } from "@/lib/razorpay";
import { db } from "@/lib/db";
import { students } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// POST /api/razorpay/create-subscription
// Creates a Razorpay Order for the chosen plan.
// After payment, client calls /api/razorpay/verify to confirm.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json() as { plan: PlanKey };

  if (!PLANS[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const { amountPaise, name } = PLANS[plan];

  try {
    const rzp = getRazorpay();

    const order = await rzp.orders.create({
      amount:   amountPaise,
      currency: "INR",
      notes: {
        userId: session.user.id,
        plan,
      },
    });

    return NextResponse.json({
      orderId:  order.id,
      amount:   amountPaise,
      currency: "INR",
      keyId:    process.env.RAZORPAY_KEY_ID,
      name:     "EduCreation",
      description: `${name} Plan — Monthly`,
      prefill: {
        name:  session.user.name,
        email: session.user.email,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create order";
    console.error("Razorpay order error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
