"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import CheckoutButton from "@/app/components/CheckoutButton";

export default function PricingClient({ isLoggedIn, plans }: any) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  useEffect(() => {
    const b = new URLSearchParams(window.location.search).get("billing");
    if (b === "yearly" || b === "monthly") setBilling(b);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", padding: "4rem 1.5rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto 2rem" }}>
        <Link href="/" style={{ color: "#555", textDecoration: "none" }}>← Back to home</Link>
      </div>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "#fff" }}>Choose Your Plan</h1>
        <p style={{ color: "#666", margin: "1rem auto", maxWidth: "520px" }}>Start with a free PDF guide for your child's topic, then pick the mentorship plan.</p>
        <Link href="/get-pdf" style={{ display: "inline-block", marginTop: "1rem", padding: "0.5rem 1.2rem", background: "#1a2e1a", border: "1px solid #22c55e33", borderRadius: "20px", color: "#22c55e", textDecoration: "none", fontWeight: 600 }}>🎁 Start with Free 4-Step PDF — No commitment</Link>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
        <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(201,169,110,0.25)", borderRadius: "999px", padding: "4px", gap: "4px" }}>
          <button onClick={() => setBilling("monthly")} style={{ padding: "8px 18px", borderRadius: "999px", border: "none", cursor: "pointer", fontWeight: 600, background: billing === "monthly" ? "#C9A96E" : "transparent", color: billing === "monthly" ? "#000" : "rgba(255,255,255,0.6)" }}>Monthly</button>
          <button onClick={() => setBilling("yearly")} style={{ padding: "8px 18px", borderRadius: "999px", border: "none", cursor: "pointer", fontWeight: 600, background: billing === "yearly" ? "#C9A96E" : "transparent", color: billing === "yearly" ? "#000" : "rgba(255,255,255,0.6)" }}>Yearly <span style={{ marginLeft: "4px", opacity: 0.7 }}>Save 17%</span></button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.5rem", maxWidth: "1100px", margin: "0 auto" }}>
        {plans.map((plan: any) => {
          const price = billing === "monthly" ? plan.priceMonthly : plan.priceYearly;
          const sub = billing === "monthly" ? plan.subMonthly : plan.subYearly;
          return (
            <div key={plan.key} style={{ background: "#111", border: `1px solid ${plan.popular ? plan.color + "55" : "#1e1e1e"}`, borderRadius: "16px", padding: "2rem", position: "relative", display: "flex", flexDirection: "column" }}>
              {plan.popular && <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", padding: "0.25rem 0.9rem", background: plan.color, borderRadius: "20px", color: "#000", fontSize: "0.75rem", fontWeight: 700 }}>Most Popular</div>}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ color: plan.color, fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}><span style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff" }}>{price}</span><span style={{ color: "#555" }}>{plan.key === "free-pdf" ? "" : billing === "monthly" ? "/month" : "/year"}</span></div>
                <div style={{ color: "#666", fontSize: "0.875rem" }}>{sub}</div>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", flex: 1 }}>
                {plan.features.map((f: string) => (<li key={f} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.6rem", color: "#aaa", fontSize: "0.875rem" }}><span style={{ color: plan.color }}>✓</span>{f}</li>))}
              </ul>
              {plan.key === "free-pdf" ? <Link href="/get-pdf" style={{ display: "block", textAlign: "center", padding: "0.9rem", background: plan.color, color: "#000", borderRadius: "10px", fontWeight: 700, textDecoration: "none" }}>Get Free PDF</Link> : <CheckoutButton plan={plan.key} label={plan.name} price={price} isLoggedIn={isLoggedIn} />}
            </div>
          );
        })}
      </div>
      <p style={{ textAlign: "center", color: "#444", fontSize: "0.85rem", marginTop: "2.5rem" }}>Secure payments via Razorpay · Cancel anytime · Free PDF requires no payment</p>
    </div>
  );
}
