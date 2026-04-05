import { auth } from "@/auth";
import CheckoutButton from "@/app/components/CheckoutButton";
import Link from "next/link";

const PLANS = [
  {
    key:         "spark" as const,
    name:        "Spark",
    price:       "₹499",
    sessions:    "2 sessions/week",
    color:       "#5b8dee",
    features: [
      "2 personalised sessions per week",
      "Core concept coverage",
      "Session notes shared with parents",
      "Weekly progress report",
    ],
  },
  {
    key:         "illuminate" as const,
    name:        "Illuminate",
    price:       "₹999",
    sessions:    "4 sessions/week",
    color:       "#d4a843",
    popular:     true,
    features: [
      "4 personalised sessions per week",
      "Deep concept + problem-solving focus",
      "Session notes + next-session plan",
      "Weekly progress report with mentor note",
      "Concept block tracker",
    ],
  },
  {
    key:         "mastery" as const,
    name:        "Mastery",
    price:       "₹1,999",
    sessions:    "Daily sessions",
    color:       "#c084fc",
    features: [
      "Daily personalised sessions",
      "Full exam preparation coverage",
      "Priority mentor availability",
      "Detailed weekly report + parent call",
      "Concept mastery tracking",
      "Mock test analysis",
    ],
  },
];

export default async function PricingPage() {
  const session = await auth();
  const isLoggedIn = !!session;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      fontFamily: "'Inter', sans-serif",
      padding: "4rem 1.5rem",
    }}>
      {/* Back link */}
      <div style={{ maxWidth: "1000px", margin: "0 auto 2rem" }}>
        <Link href="/" style={{ color: "#555", textDecoration: "none", fontSize: "0.9rem" }}>
          ← Back to home
        </Link>
      </div>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-0.5px",
          marginBottom: "1rem",
        }}>
          Choose Your Plan
        </h1>
        <p style={{ color: "#666", fontSize: "1.05rem", maxWidth: "500px", margin: "0 auto" }}>
          Every plan includes a dedicated mentor, personalised sessions, and parent progress reports.
        </p>
        <div style={{
          display: "inline-block",
          marginTop: "1rem",
          padding: "0.4rem 1rem",
          background: "#1a1500",
          border: "1px solid #d4a84333",
          borderRadius: "20px",
          color: "#d4a843",
          fontSize: "0.85rem",
        }}>
          Start with a free demo session — no commitment
        </div>
      </div>

      {/* Plans grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem",
        maxWidth: "1000px",
        margin: "0 auto",
      }}>
        {PLANS.map((plan) => (
          <div key={plan.key} style={{
            background: "#111",
            border: `1px solid ${plan.popular ? plan.color + "55" : "#1e1e1e"}`,
            borderRadius: "16px",
            padding: "2rem",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}>
            {plan.popular && (
              <div style={{
                position: "absolute",
                top: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "0.25rem 0.9rem",
                background: plan.color,
                borderRadius: "20px",
                color: "#000",
                fontSize: "0.75rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}>
                Most Popular
              </div>
            )}

            {/* Plan header */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ color: plan.color, fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {plan.name}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.3rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff" }}>{plan.price}</span>
                <span style={{ color: "#555", fontSize: "0.9rem" }}>/month</span>
              </div>
              <div style={{ color: "#666", fontSize: "0.875rem" }}>{plan.sessions}</div>
            </div>

            {/* Features */}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", flex: 1 }}>
              {plan.features.map((f) => (
                <li key={f} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  marginBottom: "0.6rem",
                  color: "#aaa",
                  fontSize: "0.875rem",
                  lineHeight: 1.4,
                }}>
                  <span style={{ color: plan.color, marginTop: "1px", flexShrink: 0 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <CheckoutButton
              plan={plan.key}
              label={plan.name}
              price={plan.price}
              isLoggedIn={isLoggedIn}
            />
          </div>
        ))}
      </div>

      {/* Trust note */}
      <p style={{ textAlign: "center", color: "#444", fontSize: "0.85rem", marginTop: "2.5rem" }}>
        Secure payments via Razorpay · Cancel anytime · No hidden fees
      </p>
    </div>
  );
}
