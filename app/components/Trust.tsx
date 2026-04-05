const cards = [
  { delay: "0.05s", iconBg: "#EAF3DE22", iconBorder: "#3B6D1144", icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="12" rx="2" stroke="#3B6D11" strokeWidth="1.3"/><line x1="5" y1="7" x2="13" y2="7" stroke="#3B6D11" strokeWidth="1.1" strokeLinecap="round"/><line x1="5" y1="10" x2="10" y2="10" stroke="#3B6D11" strokeWidth="1.1" strokeLinecap="round"/></svg>, title: "Weekly concept mastery report", body: "Not grades — a plain-language report of exactly what your child now understands, what they're working on, and one specific moment from that week's session. Sent every Sunday." },
  { delay: "0.1s",  iconBg: "#FAEEDA22", iconBorder: "#BA751744", icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2l2 4.5h4.5l-3.5 2.8 1.3 4.5L9 11.5l-4.3 2.3 1.3-4.5L2.5 6.5H7z" stroke="#BA7517" strokeWidth="1.2" strokeLinejoin="round"/></svg>, title: "Visible progress — not promises", body: "The concept map updates every session. You can see your child's understanding growing in real time — nodes turning green, gaps closing, readiness score rising week by week." },
  { delay: "0.15s", iconBg: "#E6F1FB22", iconBorder: "#185FA544", icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="7" r="4" stroke="#185FA5" strokeWidth="1.3"/><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#185FA5" strokeWidth="1.3" strokeLinecap="round"/></svg>, title: "A named personal mentor", body: "Your child has one dedicated mentor who knows their learning style, their gaps, and their personality. Not a different face every session. The same person, building real trust." },
  { delay: "0.2s",  iconBg: "#E1F5EE22", iconBorder: "#0F6E5644", icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 9l4 4 8-8" stroke="#0F6E56" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "No EMI traps. Month to month.", body: "EduCreation is month-to-month. No long-term lock-ins, no aggressive sales calls, no EMI commitments. You stay because results work — not because you're stuck in a contract." },
  { delay: "0.25s", iconBg: "#FBEAF022", iconBorder: "#99355644", icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2C9 2 13.5 6 13.5 10C13.5 12.5 11.5 14.5 9 14.5C6.5 14.5 4.5 12.5 4.5 10C4.5 6 9 2 9 2Z" stroke="#993556" strokeWidth="1.3"/></svg>, title: "The homework battle ends", body: "When a child understands the concept before the homework is assigned, homework takes 20 minutes instead of 90. Parents notice this change within 3–4 weeks. Every time." },
  { delay: "0.3s",  iconBg: "#c9a96e22", iconBorder: "rgba(201,169,110,0.3)", icon: <svg viewBox="0 0 18 18" fill="none"><path d="M2 16C2 12.7 4.7 10 8 10s6 2.7 6 6" stroke="#c9a96e" strokeWidth="1.3" strokeLinecap="round"/><circle cx="8" cy="6" r="4" stroke="#c9a96e" strokeWidth="1.3"/><path d="M12 8.5l1.5 1.5L17 6" stroke="#c9a96e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Free 30-day school pilot", body: "For schools and institutions — we run EduCreation in one class section for 30 days at no cost. Teachers feel the difference. Students understand more. Then you decide." },
];

export default function Trust() {
  return (
    <section className="section trust-section" id="parents">
      <div className="container">
        <div className="section-header reveal">
          <p className="section-label">For parents</p>
          <h2>Peace of mind.<br /><em>Every single week.</em></h2>
          <p>You don&apos;t just get a tutor. You get a window into exactly how your child is learning — in plain language, every week.</p>
        </div>
        <div className="trust-grid">
          {cards.map((card, i) => (
            <div className="trust-card reveal" key={i} style={{ transitionDelay: card.delay }}>
              <div className="trust-icon" style={{ background: card.iconBg, border: `0.5px solid ${card.iconBorder}` }}>{card.icon}</div>
              <p className="trust-title">{card.title}</p>
              <p className="trust-body">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
