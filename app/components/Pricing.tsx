import { WA_URL } from "@/lib/constants";

export default function Pricing() {
  return (
    <section className="section pricing-section" id="pricing">
      <div className="container">
        <div className="section-header reveal">
          <p className="section-label">Simple pricing</p>
          <h2>Start for free.<br /><em>Pay only when it works.</em></h2>
          <p>Every student gets one full concept session at no cost — no credit card, no countdown, no pressure. If the system works, you&apos;ll know it.</p>
        </div>
        <div className="pricing-grid">

          {/* Spark */}
          <div className="plan-card reveal" style={{ background: "var(--dark)", transitionDelay: "0.05s" }}>
            <div className="plan-top" style={{ background: "var(--dark2)" }}>
              <span className="plan-badge" style={{ background: "rgba(201,169,110,0.12)", color: "var(--gold)", border: "0.5px solid rgba(201,169,110,0.3)" }}>Starter</span>
              <p className="plan-name">Spark</p>
              <p className="plan-tagline">2 subjects · Gap-focused entry</p>
              <div className="plan-price">
                <span className="plan-currency" style={{ color: "var(--gold)" }}>₹</span>
                <span className="plan-amount" style={{ color: "var(--gold)" }}>499</span>
              </div>
              <p className="plan-period" style={{ color: "rgba(240,230,206,0.4)" }}>per month</p>
              <p className="plan-annual">₹4,999/year — save ₹989</p>
            </div>
            <div className="plan-body" style={{ background: "var(--dark)" }}>
              <p className="plan-includes">What&apos;s included</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>Concept maps for 2 subjects</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>Daily study rhythm planner</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>Weekly concept mastery check</p>
              <p className="plan-feature dim">Exam readiness tracker</p>
              <p className="plan-feature dim">Weekly parent report</p>
              <p className="plan-feature dim">Live doubt sessions</p>
              <a href={WA_URL} target="_blank" rel="noreferrer" className="plan-btn" style={{ background: "rgba(201,169,110,0.12)", color: "var(--gold)", border: "1px solid rgba(201,169,110,0.3)" }}>Get started</a>
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
                <span className="plan-amount" style={{ color: "var(--dark)" }}>999</span>
              </div>
              <p className="plan-period" style={{ color: "rgba(26,23,20,0.5)" }}>per month</p>
              <p className="plan-annual" style={{ color: "rgba(26,23,20,0.5)" }}>₹9,999/year — save ₹1,989</p>
            </div>
            <div className="plan-body" style={{ background: "var(--dark)" }}>
              <p className="plan-includes">Everything in Spark, plus</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.85)" }}>All subjects — complete coverage</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.85)" }}>Personalised daily study rhythm</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.85)" }}>Exam readiness tracker &amp; score</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.85)" }}>Weekly parent concept report</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.85)" }}>2 live doubt sessions per month</p>
              <p className="plan-feature dim">1-on-1 mentor sessions</p>
              <a href={WA_URL} target="_blank" rel="noreferrer" className="plan-btn" style={{ background: "var(--gold)", color: "var(--dark)" }}>Get started — most popular</a>
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
                <span className="plan-amount" style={{ color: "var(--gold)" }}>1,999</span>
              </div>
              <p className="plan-period" style={{ color: "rgba(240,230,206,0.4)" }}>per month</p>
              <p className="plan-annual">₹19,999/year — save ₹3,989</p>
            </div>
            <div className="plan-body" style={{ background: "var(--dark)" }}>
              <p className="plan-includes">Everything in Illuminate, plus</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>4 live doubt sessions per month</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>2 personal mentor sessions/month</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>Board exam booster programme</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>Priority weekly parent call</p>
              <p className="plan-feature" style={{ color: "rgba(240,230,206,0.75)" }}>Emergency concept rescue session</p>
              <a href={WA_URL} target="_blank" rel="noreferrer" className="plan-btn" style={{ background: "rgba(201,169,110,0.12)", color: "var(--gold)", border: "1px solid rgba(201,169,110,0.3)" }}>Get started</a>
            </div>
          </div>

        </div>
        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.85rem", color: "rgba(240,230,206,0.35)" }}>
          No EMI traps · No long-term commitments · Cancel anytime · First session always free
        </p>
        <p style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.85rem", color: "rgba(240,230,206,0.4)" }}>
          Schools &amp; institutions — <a href={WA_URL} target="_blank" rel="noreferrer" style={{ color: "var(--gold)", textDecoration: "none" }}>contact us</a> for partnership pricing starting at ₹950/student/year
        </p>
      </div>
    </section>
  );
}
