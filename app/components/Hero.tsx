import { WA_URL } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="hero-glow" />
      <div className="hero-glow2" />
      <div className="container">
        <div className="hero-inner">
          <div>
            <div className="hero-tag">Kolkata, India &nbsp;·&nbsp; Now enrolling</div>
            <h1>Not just knowledge —<br /><em>understanding</em><br />that stays for life.</h1>
            <p className="hero-sub">
              EduCreation is a revolutionary learning system where students don&apos;t just prepare for exams — they own how they learn. Stress-free. Conceptual. Built for every child.
            </p>
            <div className="hero-actions">
              <a href={WA_URL} target="_blank" rel="noreferrer" className="btn-primary">
                Book your free session
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#system" className="btn-secondary">See how it works</a>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">4-step</div>
                <div className="hero-stat-label">Learning system</div>
              </div>
              <div>
                <div className="hero-stat-num">₹0</div>
                <div className="hero-stat-label">First session free</div>
              </div>
              <div>
                <div className="hero-stat-num">NCERT</div>
                <div className="hero-stat-label">Fully aligned · All boards</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card-stack">
              <div className="hcs-card hcs-1">
                <p className="hcs-label">Concept map · Science</p>
                <p className="hcs-title">Gravitation</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "8px" }}>
                  <span className="hcs-node" style={{ background: "#EAF3DE22", border: "0.5px solid #3B6D11", color: "#6dd68a", fontSize: "0.7rem" }}>Universal Law ✓</span>
                  <span className="hcs-node" style={{ background: "#E6F1FB22", border: "0.5px solid #185FA5", color: "#60a8f0", fontSize: "0.7rem" }}>Free Fall →</span>
                  <span className="hcs-node" style={{ background: "rgba(42,33,24,0.8)", border: "0.5px solid rgba(201,169,110,0.2)", color: "rgba(240,230,206,0.4)", fontSize: "0.7rem" }}>Weight vs Mass</span>
                </div>
              </div>
              <div className="hcs-card hcs-2">
                <p className="hcs-label">Exam readiness</p>
                <div className="hcs-bar-wrap">
                  <div className="hcs-bar-label"><span>Science</span><span style={{ color: "#4dcea0", fontWeight: 600 }}>85%</span></div>
                  <div className="hcs-bar-bg"><div className="hcs-bar-fill" style={{ width: "85%", background: "#3B6D11" }} /></div>
                  <div className="hcs-bar-label"><span>Mathematics</span><span style={{ color: "#c9a96e", fontWeight: 600 }}>72%</span></div>
                  <div className="hcs-bar-bg"><div className="hcs-bar-fill" style={{ width: "72%", background: "#c9a96e" }} /></div>
                  <div className="hcs-bar-label"><span>Geography</span><span style={{ color: "#ff7070", fontWeight: 600 }}>40%</span></div>
                  <div className="hcs-bar-bg"><div className="hcs-bar-fill" style={{ width: "40%", background: "#E24B4A" }} /></div>
                </div>
              </div>
              <div className="hcs-card hcs-3">
                <p className="hcs-label">Parent report · This week</p>
                <p className="hcs-title" style={{ fontSize: "0.9rem" }}>&ldquo;Arjun asked WHY today —<br />without being prompted.&rdquo;</p>
                <p className="hcs-body" style={{ marginTop: "5px" }}>That is the shift we have been building. 4 concepts mastered this week.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
