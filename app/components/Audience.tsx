const cards = [
  { color: "#4dcea0", bg: "#0a221822", letter: "M", who: "Meena — the motivated student", type: "Limited budget · High potential · Spark plan ₹499/month", problem: "Her mother can afford the Spark plan — barely. No tuition, no help at home. She is bright but her foundation has holes because no one ever explained the why — only the what.", solution: "One concept at a time, she builds what no one ever taught her. Within 6 weeks she is the student who asks the best questions in class.", delay: "0.05s" },
  { color: "#a888f0", bg: "#1a0f3a22", letter: "R", who: "Rohan — the disengaged student", type: "High budget · Zero motivation · Illuminate plan ₹999/month", problem: "His parents spend ₹8,000/month on 4 tutors. He attends all of them and learns nothing — because he sees no point. He has been told math is boring. He is bored, not incapable.", solution: "The WHY question is the hook. \"Why does the moon not fall?\" — and the mentor actually waits for his answer. EduCreation turns boredom into curiosity.", delay: "0.1s" },
  { color: "#e8a030", bg: "#2a180022", letter: "P", who: "Priya — the procrastinator", type: "Middle class · Casual attitude · Illuminate plan ₹999/month", problem: "Her parents worry because she studies at the last minute, forgets everything after exams, and says \"I'll do it tomorrow\" every single day. She isn't lazy — she's never felt the satisfaction of truly understanding something.", solution: "The daily rhythm and streak are designed for Priya. The moment she marks her first green node, the intrinsic motivation switches on permanently.", delay: "0.15s" },
  { color: "#60a8f0", bg: "#0f1f3a22", letter: "A", who: "Arjun — the serious but stuck student", type: "Any background · Studies hard · Still struggling · Mastery plan", problem: "He studies 4 hours a day, completes every homework. But he gets 58% because he memorises without understanding. He is stressed — and his parents can't understand why effort isn't converting.", solution: "Arjun is EduCreation's most dramatic transformation. His problem is method, not effort. The diagnosis session alone changes his trajectory. Three sessions in, marks start moving.", delay: "0.2s" },
];

export default function Audience() {
  return (
    <section className="section audience-section" id="students">
      <div className="container">
        <div className="section-header reveal">
          <p className="section-label">Who we serve</p>
          <h2>Every student.<br /><em>Same system. Different journey.</em></h2>
          <p>EduCreation adapts to every child — regardless of background, budget, or attitude toward studying.</p>
        </div>
        <div className="audience-grid">
          {cards.map((card) => (
            <div className="audience-card reveal" key={card.letter} style={{ "--card-color": card.color, transitionDelay: card.delay } as React.CSSProperties}>
              <div className="audience-avatar" style={{ background: card.bg, borderColor: card.color, color: card.color }}>{card.letter}</div>
              <p className="audience-who">{card.who}</p>
              <p className="audience-type">{card.type}</p>
              <p className="audience-problem">{card.problem}</p>
              <p className="audience-solution">{card.solution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
