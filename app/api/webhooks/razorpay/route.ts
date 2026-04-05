import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { db } from "@/lib/db";
import { subscriptions, students } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Razorpay webhook — configured in Razorpay Dashboard → Webhooks
// Events handled: payment.captured, subscription.cancelled, subscription.halted
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  // Verify webhook signature
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (webhookSecret) {
    const expected = createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");
    if (expected !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  let event: { event: string; payload: Record<string, unknown> };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log(`[razorpay-webhook] ${event.event}`);

  switch (event.event) {
    case "payment.captured": {
      // Already handled in /api/razorpay/verify — nothing extra needed
      break;
    }

    case "subscription.cancelled": {
      const sub = (event.payload as { subscription?: { entity?: { id: string } } })
        ?.subscription?.entity;
      if (sub?.id) {
        await db
          .update(subscriptions)
          .set({ status: "cancelled", cancelledAt: new Date() })
          .where(eq(subscriptions.razorpaySubscriptionId, sub.id));
      }
      break;
    }

    case "subscription.halted": {
      const sub = (event.payload as { subscription?: { entity?: { id: string } } })
        ?.subscription?.entity;
      if (sub?.id) {
        await db
          .update(subscriptions)
          .set({ status: "paused" })
          .where(eq(subscriptions.razorpaySubscriptionId, sub.id));
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
