const steps = [
  {
    num: "01", color: "#BA7517", name: "Diagnose", tagline: "Know your gaps first",
    desc: "A concept-based diagnostic — not a test. Maps exactly what your child understands vs. what they've only memorised. Every student starts from their real position.",
    outcomes: ["Full concept map per subject", "Gap priority sequence set", "Parents briefed on Day 1"],
    icon: <svg viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="#BA7517" strokeWidth="1.4"/><circle cx="11" cy="11" r="3.5" stroke="#BA7517" strokeWidth="1.2"/><circle cx="11" cy="11" r="1.2" fill="#BA7517"/><line x1="11" y1="3" x2="11" y2="1" stroke="#BA7517" strokeWidth="1.3" strokeLinecap="round"/><line x1="11" y1="21" x2="11" y2="19" stroke="#BA7517" strokeWidth="1.3" strokeLinecap="round"/><line x1="3" y1="11" x2="1" y2="11" stroke="#BA7517" strokeWidth="1.3" strokeLinecap="round"/><line x1="21" y1="11" x2="19" y2="11" stroke="#BA7517" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
  {
    num: "02", color: "#185FA5", name: "Build", tagline: "One idea at a time",
    desc: "Bite-sized concept blocks. Each session targets one idea — with a WHY question, a plain-language explanation, a visual, and a self-check. The map turns green, one node at a time.",
    outcomes: ["One concept per session", "Daily 90-minute rhythm", "Weekly parent reports"],
    icon: <svg viewBox="0 0 22 22" fill="none"><rect x="3" y="14" width="4" height="5" rx="1" stroke="#185FA5" strokeWidth="1.3"/><rect x="9" y="10" width="4" height="9" rx="1" stroke="#185FA5" strokeWidth="1.3"/><rect x="15" y="5" width="4" height="14" rx="1" stroke="#185FA5" strokeWidth="1.3"/><path d="M5 13l6-5 6-6" stroke="#185FA5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    num: "03", color: "#c9a96e", name: "Connect", tagline: "Ideas across subjects",
    desc: "Geography links to Science. History meets English. Maths unlocks Economics. Cross-subject connections are where understanding becomes permanent — and curiosity becomes natural.",
    outcomes: ["Cross-subject links built", "\"Teach it back\" sessions", "Student asks WHY alone"],
    icon: <svg viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="2.5" fill="#c9a96e"/><circle cx="4" cy="5" r="2" stroke="#c9a96e" strokeWidth="1.2"/><circle cx="18" cy="5" r="2" stroke="#c9a96e" strokeWidth="1.2"/><circle cx="4" cy="17" r="2" stroke="#c9a96e" strokeWidth="1.2"/><circle cx="18" cy="17" r="2" stroke="#c9a96e" strokeWidth="1.2"/><line x1="5.8" y1="6.5" x2="9.2" y2="9.5" stroke="#c9a96e" strokeWidth="1"/><line x1="12.8" y1="9.5" x2="16.2" y2="6.5" stroke="#c9a96e" strokeWidth="1"/><line x1="5.8" y1="15.5" x2="9.2" y2="12.5" stroke="#c9a96e" strokeWidth="1"/><line x1="12.8" y1="12.5" x2="16.2" y2="15.5" stroke="#c9a96e" strokeWidth="1"/></svg>,
  },
  {
    num: "04", color: "#3B6D11", name: "Level Up", tagline: "Exam-ready with calm",
    desc: "No cramming. No panic. Practice built on concepts already owned. Students walk into exam halls having prepared week by week — not the night before. Confidence is earned, not manufactured.",
    outcomes: ["85%+ readiness target", "Concept-mapped practice", "Calm exam day entry"],
    icon: <svg viewBox="0 0 22 22" fill="none"><path d="M11 2l2 5h5l-4 3 1.5 5L11 13l-4.5 2L8 10 4 7h5z" stroke="#3B6D11" strokeWidth="1.3" strokeLinejoin="round" fill="#3B6D1122"/><line x1="11" y1="18" x2="11" y2="21" stroke="#3B6D11" strokeWidth="1.3" strokeLinecap="round"/><line x1="8" y1="21" x2="14" y2="21" stroke="#3B6D11" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  },
];

export default function System() {
  return (
    <section className="section system-section" id="system">
      <div className="container">
        <div className="section-header reveal">
          <p className="section-label">The EduCreation system</p>
          <h2>Four steps.<br /><em>One transformation.</em></h2>
          <p>Not a course. Not an app. A system that teaches students how to own their learning — for life.</p>
        </div>
        <div className="steps-grid reveal" style={{ transitionDelay: "0.1s" }}>
          {steps.map((step) => (
            <div className="step-card" key={step.num} style={{ "--step-color": step.color } as React.CSSProperties}>
              <div className="step-number">{step.num}</div>
              <div className="step-icon-wrap" style={{ "--step-color": step.color } as React.CSSProperties}>{step.icon}</div>
              <div className="step-name">{step.name}</div>
              <div className="step-tagline">{step.tagline}</div>
              <p className="step-desc">{step.desc}</p>
              <div className="step-outcomes">
                {step.outcomes.map((o) => <div className="step-outcome" key={o}>{o}</div>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
