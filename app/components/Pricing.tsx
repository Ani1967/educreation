"use client";

import { useState } from "react";
import { WA_URL } from "@/lib/constants";

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="section pricing-section" id="pricing">
      <div className="container">
        <div className="section-header reveal">
          <p className="section-label">Simple pricing</p>
          <h2>Start for free.<br /><em>Pay only when it works.</em></h2>
          <p>Every student gets a free 4-step PDF guide for their topic — no credit card. If the system works, you'll know it, then pick a plan.</p>
        </div>

        {/* MONTHLY / YEARLY TOGGLE */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.2rem" }}>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(201,169,110,0.25)", borderRadius: "999px", padding: "4px", gap: "4px" }}>
            <button
              onClick={() => setBilling("monthly")}
              style={{
                padding: "8px 18px", borderRadius: "999px", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.06em",
                background: billing === "monthly" ? "var(--gold)" : "transparent",
                color: billing === "monthly" ? "var(--dark)" : "rgba(240,230,206,0.6)",
                transition: "all 0.2s"
              }}
            >Monthly</button>
            <button
              onClick={() => setBilling("yearly")}
              style={{
                padding: "8px 18px", borderRadius: "999px", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.06em",
                background: billing === "yearly" ? "var(--gold)" : "transparent",
                color: billing === "yearly" ? "var(--dark)" : "rgba(240,230,206,0.6)",
                transition: "all 0.2s"
              }}
            >Yearly <span style={{ opacity: 0.7, marginLeft: "4px" }}>Save up to 17%</span></button>
          </div>
        </div>

        <div className="pricing-grid">

          {/* Free Guide */}
          <div className="plan-card reveal" style={{ background: "var(--dark)", transitionDelay: "0.02s", border: "1px solid rgba(34,197,94,0.3)" }}>
            <div className="plan-top" style={{ background: "var(--dark2)" }}>
              <span className="plan-badge" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "0.5px solid rgba(34,197,94,0.3)" }}>FREE</span>
              <p className="plan-name">Free Guide</p>
              <p className="plan-tagline">Instant PDF · No payment</p>
              <div className="plan-price">
                <span className="plan-currency" style={{ color: "#22c55e" }}>₹</span>
                <span className="plan-amount" style={{ color: "#22c55e" }}>0</span>
              </div>
              <p className="plan-period" style={{ color: "rgba(240,230,206,0.4)" }}>Instant PDF</p>
              <p className="plan-annual">Personalised 4-step concept guide</p>
            </div>
            <div className="plan-body" style={{ background: "var(--dark)" }}>
              <p className="plan-includes">What's included</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>Enter child's class + topic + problem</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>Easy steps parents can follow at home</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>No commitment - try first</p>
              <p className="plan-feature dim">2 personalised sessions per week</p>
              <p className="plan-feature dim">Weekly progress report</p>
              <p className="plan-feature dim">Concept block tracker</p>
              <a href="/get-pdf" className="plan-btn" style={{ background: "#22c55e", color: "#000", border: "1px solid #22c55e" }}>Get Free PDF</a>
            </div>
          </div>

          {/* Spark */}
          <div className="plan-card reveal" style={{ background: "var(--dark)", transitionDelay: "0.05s" }}>
            <div className="plan-top" style={{ background: "var(--dark2)" }}>
              <span className="plan-badge" style={{ background: "rgba(201,169,110,0.12)", color: "var(--gold)", border: "0.5px solid rgba(201,169,110,0.3)" }}>Starter</span>
              <p className="plan-name">Spark</p>
              <p className="plan-tagline">2 subjects · Gap-focused entry</p>
              <div className="plan-price">
                <span className="plan-currency" style={{ color: "var(--gold)" }}>₹</span>
                <span className="plan-amount" style={{ color: "var(--gold)" }}>{billing === "monthly" ? "1,999" : "19,999"}</span>
              </div>
              <p className="plan-period" style={{ color: "rgba(240,230,206,0.4)" }}>{billing === "monthly" ? "per month" : "per year"}</p>
              <p className="plan-annual">{billing === "monthly" ? "₹19,999/year — save ₹3,989" : "Save ₹3,989 · ₹1,666/mo billed yearly"}</p>
            </div>
            <div className="plan-body" style={{ background: "var(--dark)" }}>
              <p className="plan-includes">What's included</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>Concept maps for 2 subjects</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>Daily study rhythm planner</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>Weekly concept mastery check</p>
              <p className="plan-feature dim">Exam readiness tracker</p>
              <p className="plan-feature dim">Weekly parent report</p>
              <p className="plan-feature dim">Live doubt sessions</p>
              <a href="/pricing" className="plan-btn" style={{ background: "rgba(201,169,110,0.12)", color: "var(--gold)", border: "1px solid rgba(201,169,110,0.3)" }}>
                {billing === "monthly" ? "Get started — ₹1,999/mo" : "Get started — ₹19,999/yr"}
              </a>
            </div>
          </div>

          {/* Illuminate */}
          <div className="plan-card featured reveal" style={{ background: "var(--dark)", transitionDelay: "0.1s" }}>
            <div className="plan-top" style={{ background: "var(--gold)" }}>
              <span className="plan-badge" style={{ background: "rgba(26,23,20,0.2)", color: "var(--dark)" }}>Most popular</span>
              <p className="plan-name" style={{ color: "var(--dark)" }}>Illuminate</p>
              <p className="plan-tagline" style={{ color: "rgba(26,23,20,0.6)" }}>The complete system</p>
              <div className="plan-price">
                <span className="plan-currency" style={{ color: "var(--dark)" }}>₹</span>
                <span className="plan-amount" style={{ color: "var(--dark)" }}>{billing === "monthly" ? "2,999" : "29,999"}</span>
              </div>
              <p className="plan-period" style={{ color: "rgba(26,23,20,0.5)" }}>{billing === "monthly" ? "per month" : "per year"}</p>
              <p className="plan-annual" style={{ color: "rgba(26,23,20,0.5)" }}>{billing === "monthly" ? "₹29,999/year — save ₹5,989" : "Save ₹5,989 · ₹2,499/mo billed yearly"}</p>
            </div>
            <div className="plan-body" style={{ background: "var(--dark)" }}>
              <p className="plan-includes">Everything in Spark, plus</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.85)" }}>All subjects — complete coverage</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.85)" }}>Personalised daily study rhythm</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.85)" }}>Exam readiness tracker & score</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.85)" }}>Weekly parent concept report</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.85)" }}>2 live doubt sessions per month</p>
              <p className="plan-feature dim">1-on-1 mentor sessions</p>
              <a href="/pricing" className="plan-btn" style={{ background: "var(--gold)", color: "var(--dark)" }}>
                {billing === "monthly" ? "Get started — ₹2,999/mo" : "Get started — ₹29,999/yr"}
              </a>
            </div>
          </div>

          {/* Mastery */}
          <div className="plan-card reveal" style={{ background: "var(--dark)", transitionDelay: "0.15s" }}>
            <div className="plan-top" style={{ background: "var(--dark2)" }}>
              <span className="plan-badge" style={{ background: "rgba(201,169,110,0.12)", color: "var(--gold)", border: "0.5px solid rgba(201,169,110,0.3)" }}>Premium</span>
              <p className="plan-name">Mastery</p>
              <p className="plan-tagline">Serious exam preparation</p>
              <div className="plan-price">
                <span className="plan-currency" style={{ color: "var(--gold)" }}>₹</span>
                <span className="plan-amount" style={{ color: "var(--gold)" }}>{billing === "monthly" ? "4,999" : "49,999"}</span>
              </div>
              <p className="plan-period" style={{ color: "rgba(240,230,206,0.4)" }}>{billing === "monthly" ? "per month" : "per year"}</p>
              <p className="plan-annual">{billing === "monthly" ? "₹49,999/year — save ₹9,989" : "Save ₹9,989 · ₹4,166/mo billed yearly"}</p>
            </div>
            <div className="plan-body" style={{ background: "var(--dark)" }}>
              <p className="plan-includes">Everything in Illuminate, plus</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>4 live doubt sessions per month</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>2 personal mentor sessions/month</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>Board exam booster programme</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>Priority weekly parent call</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>Emergency concept rescue session</p>
              <a href="/pricing" className="plan-btn" style={{ background: "rgba(201,169,110,0.12)", color: "var(--gold)", border: "1px solid rgba(201,169,110,0.3)" }}>
                {billing === "monthly" ? "Get started — ₹4,999/mo" : "Get started — ₹49,999/yr"}
              </a>
            </div>
          </div>

        </div>
        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.85rem", color: "rgba(240,230,206,0.35)" }}>
          No EMI traps · No long-term commitments · Cancel anytime · Free PDF requires no payment
        </p>
        <p style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.85rem", color: "rgba(240,230,206,0.4)" }}>
          Schools & institutions — <a href={WA_URL} target="_blank" rel="noreferrer" style={{ color: "var(--gold)", textDecoration: "none" }}>contact us</a> for partnership pricing starting at ₹950/student/year
        </p>
      </div>
    </section>
  );
}
