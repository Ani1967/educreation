import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { students, subscriptions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import CheckoutButton from "@/app/components/CheckoutButton";

const TIER_COLOR: Record<string, string> = {
  spark:      "#5b8dee",
  illuminate: "#d4a843",
  mastery:    "#c084fc",
};

const TIER_PRICE: Record<string, string> = {
  spark:      "₹499",
  illuminate: "₹999",
  mastery:    "₹1,999",
};

export default async function ParentSubscriptionPage() {
  const session = await auth();
  if (!session || session.user.role !== "parent") redirect("/login");

  const parentUserId = Number(session.user.id);

  const [child] = await db
    .select()
    .from(students)
    .where(eq(students.parentId, parentUserId))
    .limit(1);

  const subHistory = child
    ? await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.studentId, child.id))
        .orderBy(desc(subscriptions.startedAt))
    : [];

  const activeSub = subHistory.find((s) => s.status === "active");

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>Subscription</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>Manage your child's learning plan.</p>

      {/* Active plan */}
      <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.8rem", color: "#555", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Current Plan
        </div>
        {!activeSub ? (
          <div>
            <div style={{ color: "#aaa", marginBottom: "0.5rem" }}>No active subscription</div>
            <div style={{ color: "#555", fontSize: "0.875rem", marginBottom: "1rem" }}>
              Your child is on the free trial. Subscribe to unlock regular sessions.
            </div>
            <Link href="/pricing" style={{
              display: "inline-block",
              padding: "0.6rem 1.2rem",
              background: "linear-gradient(135deg,#d4a843,#f0c060)",
              borderRadius: "8px",
              color: "#000",
              fontWeight: 700,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}>
              View Plans →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span style={{
                display: "inline-block",
                padding: "0.3rem 0.8rem",
                borderRadius: "6px",
                background: (TIER_COLOR[activeSub.tier] || "#555") + "22",
                color: TIER_COLOR[activeSub.tier] || "#555",
                fontSize: "0.9rem",
                fontWeight: 700,
                textTransform: "capitalize",
                marginBottom: "0.5rem",
              }}>
                {activeSub.tier} Plan
              </span>
              <div style={{ color: "#888", fontSize: "0.875rem" }}>
                {TIER_PRICE[activeSub.tier]}/month · Started {new Date(activeSub.startedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              {activeSub.renewsAt && (
                <div style={{ color: "#555", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                  Renews {new Date(activeSub.renewsAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              )}
            </div>
            <span style={{
              padding: "0.3rem 0.8rem",
              borderRadius: "6px",
              background: "#1a3a1a",
              color: "#4caf7d",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}>
              Active
            </span>
          </div>
        )}
      </div>

      {/* Upgrade options */}
      {(!activeSub || activeSub.tier !== "mastery") && (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#555", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {activeSub ? "Upgrade Plan" : "Subscribe"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {(["spark", "illuminate", "mastery"] as const)
              .filter((t) => !activeSub || t !== activeSub.tier)
              .map((tier) => (
                <div key={tier} style={{
                  background: "#161616",
                  border: `1px solid ${TIER_COLOR[tier]}33`,
                  borderRadius: "10px",
                  padding: "1.25rem",
                }}>
                  <div style={{ color: TIER_COLOR[tier], fontWeight: 700, textTransform: "capitalize", marginBottom: "0.25rem" }}>
                    {tier}
                  </div>
                  <div style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 800, marginBottom: "1rem" }}>
                    {TIER_PRICE[tier]}<span style={{ color: "#555", fontSize: "0.8rem", fontWeight: 400 }}>/mo</span>
                  </div>
                  <CheckoutButton plan={tier} label={tier} price={TIER_PRICE[tier]} isLoggedIn={true} />
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Billing history */}
      {subHistory.length > 0 && (
        <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "1.5rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#555", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Billing History
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {subHistory.map((s) => (
              <div key={s.id} style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.75rem 1rem",
                background: "#161616",
                borderRadius: "8px",
                fontSize: "0.875rem",
              }}>
                <div>
                  <span style={{ color: "#bbb", textTransform: "capitalize" }}>{s.tier} Plan</span>
                  <span style={{ color: "#444", marginLeft: "0.75rem" }}>
                    {new Date(s.startedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <span style={{ color: "#888" }}>₹{(s.amountPaise / 100).toLocaleString("en-IN")}</span>
                  <span style={{
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    background: s.status === "active" ? "#1a3a1a" : "#1a1a1a",
                    color: s.status === "active" ? "#4caf7d" : "#555",
                    fontSize: "0.75rem",
                    textTransform: "capitalize",
                  }}>
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
