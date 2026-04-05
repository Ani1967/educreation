const problems = [
  { bg: "#FCEBEB22", border: "#A32D2D55", iconColor: "#E24B4A", title: "Rote learning builds no foundation", body: "Students who memorise for exams forget everything after. A child who understands why gravity works will never forget it." },
  { bg: "#FAEEDA22", border: "#BA751755", iconColor: "#BA7517", title: "Tuition covers chapters — not gaps", body: "Coaching teaches Chapter 1 to every student equally. EduCreation starts from where your child actually is — not where the syllabus says they should be." },
  { bg: "#E6F1FB22", border: "#185FA555", iconColor: "#185FA5", title: "Parents see grades — not understanding", body: "A 70% score tells you nothing about what your child actually knows. EduCreation's weekly concept mastery report shows you exactly what they understand — in plain language." },
  { bg: "#EAF3DE22", border: "#3B6D1155", iconColor: "#3B6D11", title: "The solution: EduCreation", body: "One concept at a time. Always asking why. Students who explain what they know — not recite what they've memorised. This is what owning your learning feels like.", star: true },
];

export default function Problem() {
  return (
    <section className="section problem-section">
      <div className="container">
        <div className="problem-grid">
          <div className="reveal">
            <p className="section-label">The problem</p>
            <blockquote className="problem-quote">
              &ldquo;Why is my child studying<br />so much — and still not <strong>understanding</strong>?&rdquo;
            </blockquote>
            <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "rgba(240,230,206,0.5)", lineHeight: 1.75 }}>
              Every parent in India asks this question. The answer is not effort. It is method. Memorisation and understanding are not the same thing — and only one of them lasts.
            </p>
          </div>
          <div className="problem-items reveal" style={{ transitionDelay: "0.15s" }}>
            {problems.map((item, i) => (
              <div className="problem-item" key={i}>
                <div className="problem-icon" style={{ background: item.bg, border: `0.5px solid ${item.border}` }}>
                  {item.star ? (
                    <svg viewBox="0 0 16 16" fill="none"><path d="M8 2l1.5 3.5h3.5l-2.8 2.2 1.1 3.5L8 9.5l-3.3 1.7 1.1-3.5L2.8 5.5H6.5z" stroke={item.iconColor} strokeWidth="1.1" strokeLinejoin="round" /></svg>
                  ) : (
                    <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke={item.iconColor} strokeWidth="1.3" /><line x1="8" y1="5" x2="8" y2="9" stroke={item.iconColor} strokeWidth="1.3" strokeLinecap="round" /><circle cx="8" cy="11" r="0.7" fill={item.iconColor} /></svg>
                  )}
                </div>
                <div>
                  <p className="problem-item-title">{item.title}</p>
                  <p className="problem-item-body">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
