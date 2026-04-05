import Razorpay from "razorpay";

// Lazy init — prevents build failure if env vars not set
let _rzp: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!_rzp) {
    _rzp = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return _rzp;
}

// Plan IDs — created once in Razorpay dashboard / via API
// Prices in paise (100 paise = ₹1)
export const PLANS = {
  spark: {
    name:        "Spark",
    amountPaise: 49900,   // ₹499/mo
    description: "2 sessions/week · Core concepts",
  },
  illuminate: {
    name:        "Illuminate",
    amountPaise: 99900,   // ₹999/mo
    description: "4 sessions/week · Deep learning",
  },
  mastery: {
    name:        "Mastery",
    amountPaise: 199900,  // ₹1999/mo
    description: "Daily sessions · Full exam prep",
  },
} as const;

export type PlanKey = keyof typeof PLANS;
