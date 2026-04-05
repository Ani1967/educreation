"use client";

import { useEffect, useState } from "react";

const WA = "https://wa.me/919052416158?text=Hi%20I%20want%20to%20book%20a%20free%20session%20for%20my%20child";

export default function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    // Nav scroll effect
    const nav = document.getElementById("nav");
    const onScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll);

    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  async function handleBookingSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("loading");
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      parent_name: data.get("parent_name"),
      student_name: data.get("student_name"),
      whatsapp: data.get("whatsapp"),
      email: data.get("email"),
      class: data.get("class"),
      board: data.get("board"),
      subject: data.get("subject"),
      preferred_time: data.get("preferred_time"),
      concern: data.get("concern"),
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setFormState("success");
        const studentName = String(data.get("student_name") || "");
        const cls = String(data.get("class") || "");
        const msg = `Hi, I just booked a free session for ${studentName} (${cls}) on educreators.org. Please confirm the time.`;
        setTimeout(() => {
          window.open(`https://wa.me/919052416158?text=${encodeURIComponent(msg)}`, "_blank");
        }, 1500);
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(201,169,110,0.3)", borderRadius: "6px",
    color: "var(--ivory)", fontFamily: "'DM Sans',sans-serif",
    fontSize: "0.9rem", outline: "none",
  };
  const selectStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    background: "rgba(26,23,20,0.95)",
    border: "0.5px solid rgba(201,169,110,0.3)", borderRadius: "6px",
    color: "var(--ivory)", fontFamily: "'DM Sans',sans-serif",
    fontSize: "0.9rem", outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase",
    color: "var(--gold)", display: "block", marginBottom: "6px",
  };

  return (
    <>
      {/* NAV */}
      <nav id="nav">
        <div className="container">
          <div className="nav-inner">
            <a href="#" className="nav-logo">
              <div className="nav-logo-icon">
                <svg viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="6" r="4" stroke="#c9a96e" strokeWidth="1.3" />
                  <line x1="7" y1="9" x2="7" y2="10" stroke="#c9a96e" strokeWidth="1.1" />
                  <line x1="11" y1="9" x2="11" y2="10" stroke="#c9a96e" strokeWidth="1.1" />
                  <line x1="7" y1="10" x2="11" y2="10" stroke="#c9a96e" strokeWidth="1.1" />
                  <rect x="8" y="10.5" width="2" height="1" rx="0.5" stroke="#c9a96e" strokeWidth="1" />
                  <path d="M3 16Q9 13 15 16" stroke="#c9a96e" strokeWidth="1.3" fill="none" />
                  <path d="M3 16L3 14Q9 11 15 14L15 16" stroke="#c9a96e" strokeWidth="1.3" fill="none" />
                  <line x1="9" y1="11.5" x2="9" y2="13" stroke="#c9a96e" strokeWidth="1.1" />
                </svg>
              </div>
              <span className="nav-brand">EduCreation</span>
            </a>
            <ul className="nav-links">
              <li><a href="#system">The System</a></li>
              <li><a href="#students">Students</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#parents">For Parents</a></li>
              <li><a href={WA} target="_blank" rel="noreferrer" className="nav-cta">Book free session</a></li>
            </ul>
            <button className="nav-hamburger" onClick={() => setMobileNavOpen(true)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE NAV */}
      <div className={`mobile-nav${mobileNavOpen ? " open" : ""}`}>
        <a href="#system" onClick={() => setMobileNavOpen(false)}>The System</a>
        <a href="#students" onClick={() => setMobileNavOpen(false)}>Students</a>
        <a href="#pricing" onClick={() => setMobileNavOpen(false)}>Pricing</a>
        <a href="#parents" onClick={() => setMobileNavOpen(false)}>For Parents</a>
        <a href={WA} target="_blank" rel="noreferrer" onClick={() => setMobileNavOpen(false)} style={{ color: "var(--gold)" }}>
          Book free session →
        </a>
      </div>

      {/* HERO */}
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
              <p className="hero-sub">EduCreation is a revolutionary learning system where students don&apos;t just prepare for exams — they own how they learn. Stress-free. Conceptual. Built for every child.</p>
              <div className="hero-actions">
                <a href={WA} target="_blank" rel="noreferrer" className="btn-primary">
                  Book your free session
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
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

      {/* PROBLEM */}
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
              {[
                { bg: "#FCEBEB22", border: "#A32D2D55", iconColor: "#E24B4A", title: "Rote learning builds no foundation", body: "Students who memorise for exams forget everything after. A child who understands why gravity works will never forget it." },
                { bg: "#FAEEDA22", border: "#BA751755", iconColor: "#BA7517", title: "Tuition covers chapters — not gaps", body: "Coaching teaches Chapter 1 to every student equally. EduCreation starts from where your child actually is — not where the syllabus says they should be." },
                { bg: "#E6F1FB22", border: "#185FA555", iconColor: "#185FA5", title: "Parents see grades — not understanding", body: "A 70% score tells you nothing about what your child actually knows. EduCreation's weekly concept mastery report shows you exactly what they understand — in plain language." },
                { bg: "#EAF3DE22", border: "#3B6D1155", iconColor: "#3B6D11", title: "The solution: EduCreation", body: "One concept at a time. Always asking why. Students who explain what they know — not recite what they've memorised. This is what owning your learning feels like.", star: true },
              ].map((item, i) => (
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

      {/* 4-STEP SYSTEM */}
      <section className="section system-section" id="system">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-label">The EduCreation system</p>
            <h2>Four steps.<br /><em>One transformation.</em></h2>
            <p>Not a course. Not an app. A system that teaches students how to own their learning — for life.</p>
          </div>
          <div className="steps-grid reveal" style={{ transitionDelay: "0.1s" }}>
            {[
              { num: "01", color: "#BA7517", name: "Diagnose", tagline: "Know your gaps first", desc: "A concept-based diagnostic — not a test. Maps exactly what your child understands vs. what they've only memorised. Every student starts from their real position.", outcomes: ["Full concept map per subject", "Gap priority sequence set", "Parents briefed on Day 1"], icon: <svg viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="#BA7517" strokeWidth="1.4"/><circle cx="11" cy="11" r="3.5" stroke="#BA7517" strokeWidth="1.2"/><circle cx="11" cy="11" r="1.2" fill="#BA7517"/><line x1="11" y1="3" x2="11" y2="1" stroke="#BA7517" strokeWidth="1.3" strokeLinecap="round"/><line x1="11" y1="21" x2="11" y2="19" stroke="#BA7517" strokeWidth="1.3" strokeLinecap="round"/><line x1="3" y1="11" x2="1" y2="11" stroke="#BA7517" strokeWidth="1.3" strokeLinecap="round"/><line x1="21" y1="11" x2="19" y2="11" stroke="#BA7517" strokeWidth="1.3" strokeLinecap="round"/></svg> },
              { num: "02", color: "#185FA5", name: "Build", tagline: "One idea at a time", desc: "Bite-sized concept blocks. Each session targets one idea — with a WHY question, a plain-language explanation, a visual, and a self-check. The map turns green, one node at a time.", outcomes: ["One concept per session", "Daily 90-minute rhythm", "Weekly parent reports"], icon: <svg viewBox="0 0 22 22" fill="none"><rect x="3" y="14" width="4" height="5" rx="1" stroke="#185FA5" strokeWidth="1.3"/><rect x="9" y="10" width="4" height="9" rx="1" stroke="#185FA5" strokeWidth="1.3"/><rect x="15" y="5" width="4" height="14" rx="1" stroke="#185FA5" strokeWidth="1.3"/><path d="M5 13l6-5 6-6" stroke="#185FA5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
              { num: "03", color: "#c9a96e", name: "Connect", tagline: "Ideas across subjects", desc: "Geography links to Science. History meets English. Maths unlocks Economics. Cross-subject connections are where understanding becomes permanent — and curiosity becomes natural.", outcomes: ["Cross-subject links built", "\"Teach it back\" sessions", "Student asks WHY alone"], icon: <svg viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="2.5" fill="#c9a96e"/><circle cx="4" cy="5" r="2" stroke="#c9a96e" strokeWidth="1.2"/><circle cx="18" cy="5" r="2" stroke="#c9a96e" strokeWidth="1.2"/><circle cx="4" cy="17" r="2" stroke="#c9a96e" strokeWidth="1.2"/><circle cx="18" cy="17" r="2" stroke="#c9a96e" strokeWidth="1.2"/><line x1="5.8" y1="6.5" x2="9.2" y2="9.5" stroke="#c9a96e" strokeWidth="1"/><line x1="12.8" y1="9.5" x2="16.2" y2="6.5" stroke="#c9a96e" strokeWidth="1"/><line x1="5.8" y1="15.5" x2="9.2" y2="12.5" stroke="#c9a96e" strokeWidth="1"/><line x1="12.8" y1="12.5" x2="16.2" y2="15.5" stroke="#c9a96e" strokeWidth="1"/></svg> },
              { num: "04", color: "#3B6D11", name: "Level Up", tagline: "Exam-ready with calm", desc: "No cramming. No panic. Practice built on concepts already owned. Students walk into exam halls having prepared week by week — not the night before. Confidence is earned, not manufactured.", outcomes: ["85%+ readiness target", "Concept-mapped practice", "Calm exam day entry"], icon: <svg viewBox="0 0 22 22" fill="none"><path d="M11 2l2 5h5l-4 3 1.5 5L11 13l-4.5 2L8 10 4 7h5z" stroke="#3B6D11" strokeWidth="1.3" strokeLinejoin="round" fill="#3B6D1122"/><line x1="11" y1="18" x2="11" y2="21" stroke="#3B6D11" strokeWidth="1.3" strokeLinecap="round"/><line x1="8" y1="21" x2="14" y2="21" stroke="#3B6D11" strokeWidth="1.3" strokeLinecap="round"/></svg> },
            ].map((step) => (
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

      {/* WHO WE SERVE */}
      <section className="section audience-section" id="students">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-label">Who we serve</p>
            <h2>Every student.<br /><em>Same system. Different journey.</em></h2>
            <p>EduCreation adapts to every child — regardless of background, budget, or attitude toward studying.</p>
          </div>
          <div className="audience-grid">
            {[
              { color: "#4dcea0", bg: "#0a221822", letter: "M", who: "Meena — the motivated student", type: "Limited budget · High potential · Spark plan ₹499/month", problem: "Her mother can afford the Spark plan — barely. No tuition, no help at home. She is bright but her foundation has holes because no one ever explained the why — only the what.", solution: "One concept at a time, she builds what no one ever taught her. Within 6 weeks she is the student who asks the best questions in class.", delay: "0.05s" },
              { color: "#a888f0", bg: "#1a0f3a22", letter: "R", who: "Rohan — the disengaged student", type: "High budget · Zero motivation · Illuminate plan ₹999/month", problem: "His parents spend ₹8,000/month on 4 tutors. He attends all of them and learns nothing — because he sees no point. He has been told math is boring. He is bored, not incapable.", solution: "The WHY question is the hook. \"Why does the moon not fall?\" — and the mentor actually waits for his answer. EduCreation turns boredom into curiosity.", delay: "0.1s" },
              { color: "#e8a030", bg: "#2a180022", letter: "P", who: "Priya — the procrastinator", type: "Middle class · Casual attitude · Illuminate plan ₹999/month", problem: "Her parents worry because she studies at the last minute, forgets everything after exams, and says \"I'll do it tomorrow\" every single day. She isn't lazy — she's never felt the satisfaction of truly understanding something.", solution: "The daily rhythm and streak are designed for Priya. The moment she marks her first green node, the intrinsic motivation switches on permanently.", delay: "0.15s" },
              { color: "#60a8f0", bg: "#0f1f3a22", letter: "A", who: "Arjun — the serious but stuck student", type: "Any background · Studies hard · Still struggling · Mastery plan", problem: "He studies 4 hours a day, completes every homework. But he gets 58% because he memorises without understanding. He is stressed — and his parents can't understand why effort isn't converting.", solution: "Arjun is EduCreation's most dramatic transformation. His problem is method, not effort. The diagnosis session alone changes his trajectory. Three sessions in, marks start moving.", delay: "0.2s" },
            ].map((card) => (
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

      {/* CONCEPT BLOCK PREVIEW */}
      <section className="section-sm concept-section">
        <div className="container">
          <div className="section-header reveal" style={{ marginBottom: "2.5rem" }}>
            <p className="section-label">How a session works</p>
            <h2>Every concept. <em>Fully built.</em></h2>
            <p>All NCERT topics, all subjects, Classes 6–12. Each concept block has pre-identified student pain points, 8 years of CBSE past questions, and exact mentor guidance.</p>
          </div>
          <div className="concept-preview reveal" style={{ transitionDelay: "0.1s" }}>
            <div className="cp-header">
              <div className="cp-dots">
                <div className="cp-dot" style={{ background: "#ff5f57" }} />
                <div className="cp-dot" style={{ background: "#febc2e" }} />
                <div className="cp-dot" style={{ background: "#28c840" }} />
              </div>
              <p className="cp-title">Gravitation — NCERT Class 9 Science, Chapter 10 · 55 minutes</p>
              <div />
            </div>
            <div className="cp-body">
              <div className="cp-step" style={{ background: "#2a180022", borderColor: "#BA751744" }}>
                <p className="cp-step-num" style={{ color: "#e8a030" }}>Step 1 · 7 minutes — The WHY question</p>
                <p className="cp-step-title">Pose. Then wait. The silence is the teaching.</p>
                <div className="cp-step-quote" style={{ borderColor: "#BA7517" }}>
                  &ldquo;The moon is very close to the Earth. Earth has gravity. So why hasn&apos;t the moon crashed into us? Just think out loud — there&apos;s no wrong answer.&rdquo;<br /><br />
                  <em style={{ color: "rgba(240,230,206,0.5)", fontSize: "0.8rem" }}>Then go completely silent. Count to 90. Do not speak.</em>
                </div>
              </div>
              <div className="cp-step" style={{ background: "#0f1f3a22", borderColor: "#185FA544" }}>
                <p className="cp-step-num" style={{ color: "#60a8f0" }}>Step 2 · 15 minutes — Plain-language explanation</p>
                <p className="cp-step-title">One idea, stated simply. No jargon until the concept exists.</p>
                <div className="cp-step-quote" style={{ borderColor: "#185FA5" }}>
                  &ldquo;The moon <strong style={{ color: "#60a8f0" }}>is</strong> falling — always. But it&apos;s also moving sideways very fast. Every moment it falls toward Earth, it moves forward just enough to keep missing us. That balance — falling + moving sideways — is what we call an orbit.&rdquo;
                </div>
              </div>
              <div className="cp-step" style={{ background: "#2a201022", borderColor: "#c9a96e44" }}>
                <p className="cp-step-num" style={{ color: "#e8c97a" }}>Step 3 · 10 minutes — Draw it together</p>
                <p className="cp-step-title">Student holds the pen. Always.</p>
                <p className="cp-step-body">&ldquo;Take the paper. Draw Earth in the middle. Now draw the moon. Draw the direction gravity pulls it. Now draw its sideways motion. Erase the sideways arrow — what happens?&rdquo; They discover: the moon crashes. Add it back — it orbits. That drawing lasts forever.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className="cp-step" style={{ background: "#0a221822", borderColor: "#4dcea044", margin: 0 }}>
                  <p className="cp-step-num" style={{ color: "#4dcea0" }}>Step 4 · 12 min — CBSE question</p>
                  <p className="cp-step-body">&ldquo;The gravitational force is F. If both masses double and distance doubles — what is the new force?&rdquo; Guide only. Never solve.</p>
                </div>
                <div className="cp-step" style={{ background: "#1a0f3a22", borderColor: "#a888f044", margin: 0 }}>
                  <p className="cp-step-num" style={{ color: "#a888f0" }}>Step 5 · 5 min — Got it? check</p>
                  <p className="cp-step-body">&ldquo;Close everything. Explain gravitation to me like I&apos;m your younger sibling.&rdquo; If they can — the node turns green. They mark it themselves.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARENT TRUST */}
      <section className="section trust-section" id="parents">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-label">For parents</p>
            <h2>Peace of mind.<br /><em>Every single week.</em></h2>
            <p>You don&apos;t just get a tutor. You get a window into exactly how your child is learning — in plain language, every week.</p>
          </div>
          <div className="trust-grid">
            {[
              { delay: "0.05s", iconBg: "#EAF3DE22", iconBorder: "#3B6D1144", icon: <svg viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="12" rx="2" stroke="#3B6D11" strokeWidth="1.3"/><line x1="5" y1="7" x2="13" y2="7" stroke="#3B6D11" strokeWidth="1.1" strokeLinecap="round"/><line x1="5" y1="10" x2="10" y2="10" stroke="#3B6D11" strokeWidth="1.1" strokeLinecap="round"/></svg>, title: "Weekly concept mastery report", body: "Not grades — a plain-language report of exactly what your child now understands, what they're working on, and one specific moment from that week's session. Sent every Sunday." },
              { delay: "0.1s", iconBg: "#FAEEDA22", iconBorder: "#BA751744", icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2l2 4.5h4.5l-3.5 2.8 1.3 4.5L9 11.5l-4.3 2.3 1.3-4.5L2.5 6.5H7z" stroke="#BA7517" strokeWidth="1.2" strokeLinejoin="round"/></svg>, title: "Visible progress — not promises", body: "The concept map updates every session. You can see your child's understanding growing in real time — nodes turning green, gaps closing, readiness score rising week by week." },
              { delay: "0.15s", iconBg: "#E6F1FB22", iconBorder: "#185FA544", icon: <svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="7" r="4" stroke="#185FA5" strokeWidth="1.3"/><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#185FA5" strokeWidth="1.3" strokeLinecap="round"/></svg>, title: "A named personal mentor", body: "Your child has one dedicated mentor who knows their learning style, their gaps, and their personality. Not a different face every session. The same person, building real trust." },
              { delay: "0.2s", iconBg: "#E1F5EE22", iconBorder: "#0F6E5644", icon: <svg viewBox="0 0 18 18" fill="none"><path d="M3 9l4 4 8-8" stroke="#0F6E56" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "No EMI traps. Month to month.", body: "EduCreation is month-to-month. No long-term lock-ins, no aggressive sales calls, no EMI commitments. You stay because results work — not because you're stuck in a contract." },
              { delay: "0.25s", iconBg: "#FBEAF022", iconBorder: "#99355644", icon: <svg viewBox="0 0 18 18" fill="none"><path d="M9 2C9 2 13.5 6 13.5 10C13.5 12.5 11.5 14.5 9 14.5C6.5 14.5 4.5 12.5 4.5 10C4.5 6 9 2 9 2Z" stroke="#993556" strokeWidth="1.3"/></svg>, title: "The homework battle ends", body: "When a child understands the concept before the homework is assigned, homework takes 20 minutes instead of 90. Parents notice this change within 3–4 weeks. Every time." },
              { delay: "0.3s", iconBg: "#c9a96e22", iconBorder: "rgba(201,169,110,0.3)", icon: <svg viewBox="0 0 18 18" fill="none"><path d="M2 16C2 12.7 4.7 10 8 10s6 2.7 6 6" stroke="#c9a96e" strokeWidth="1.3" strokeLinecap="round"/><circle cx="8" cy="6" r="4" stroke="#c9a96e" strokeWidth="1.3"/><path d="M12 8.5l1.5 1.5L17 6" stroke="#c9a96e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Free 30-day school pilot", body: "For schools and institutions — we run EduCreation in one class section for 30 days at no cost. Teachers feel the difference. Students understand more. Then you decide." },
            ].map((card, i) => (
              <div className="trust-card reveal" key={i} style={{ transitionDelay: card.delay }}>
                <div className="trust-icon" style={{ background: card.iconBg, border: `0.5px solid ${card.iconBorder}` }}>{card.icon}</div>
                <p className="trust-title">{card.title}</p>
                <p className="trust-body">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="testimonial-section">
        <div className="container">
          <div className="testimonial-inner reveal">
            <p className="testimonial-quote">&ldquo;Arjun started asking &lsquo;why&rsquo; in his Geography session — on his own, without being prompted. That is the shift we have been building toward for weeks.&rdquo;</p>
            <p className="testimonial-author">— Rohan Sir, EduCreation Mentor · Kolkata Pilot Programme</p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section pricing-section" id="pricing">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-label">Simple pricing</p>
            <h2>Start for free.<br /><em>Pay only when it works.</em></h2>
            <p>Every student gets one full concept session at no cost — no credit card, no countdown, no pressure. If the system works, you&apos;ll know it.</p>
          </div>
          <div className="pricing-grid">
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
                <a href={WA} target="_blank" rel="noreferrer" className="plan-btn" style={{ background: "rgba(201,169,110,0.12)", color: "var(--gold)", border: "1px solid rgba(201,169,110,0.3)" }}>Get started</a>
              </div>
            </div>

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
                <a href={WA} target="_blank" rel="noreferrer" className="plan-btn" style={{ background: "var(--gold)", color: "var(--dark)" }}>Get started — most popular</a>
              </div>
            </div>

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
                <a href={WA} target="_blank" rel="noreferrer" className="plan-btn" style={{ background: "rgba(201,169,110,0.12)", color: "var(--gold)", border: "1px solid rgba(201,169,110,0.3)" }}>Get started</a>
              </div>
            </div>
          </div>
          <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.85rem", color: "rgba(240,230,206,0.35)" }}>No EMI traps · No long-term commitments · Cancel anytime · First session always free</p>
          <p style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.85rem", color: "rgba(240,230,206,0.4)" }}>
            Schools &amp; institutions — <a href={WA} target="_blank" rel="noreferrer" style={{ color: "var(--gold)", textDecoration: "none" }}>contact us</a> for partnership pricing starting at ₹950/student/year
          </p>
        </div>
      </section>

      {/* CTA / BOOKING FORM */}
      <section className="cta-section" id="contact">
        <div className="cta-glow" />
        <div className="container">
          <div className="cta-inner reveal">
            <p className="section-label" style={{ textAlign: "center", marginBottom: "0.75rem" }}>Start today</p>
            <h2>One free session.<br /><em>No commitment.</em></h2>
            <p>Book a free 45-minute concept session for your child. See the system work in real time — before you pay anything.</p>

            {formState !== "success" ? (
              <form onSubmit={handleBookingSubmit} style={{ marginTop: "2rem", maxWidth: "520px", marginLeft: "auto", marginRight: "auto", textAlign: "left" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={labelStyle}>Parent name *</label>
                    <input type="text" name="parent_name" required placeholder="e.g. Priya Sharma" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Student name *</label>
                    <input type="text" name="student_name" required placeholder="e.g. Arjun" style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={labelStyle}>Class *</label>
                    <select name="class" required style={selectStyle}>
                      <option value="">Select class</option>
                      {["Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Board *</label>
                    <select name="board" required style={selectStyle}>
                      <option value="">Select board</option>
                      {["CBSE","ICSE","West Bengal Board","Other"].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={labelStyle}>WhatsApp number *</label>
                    <input type="tel" name="whatsapp" required placeholder="e.g. 9876543210" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email (for confirmation)</label>
                    <input type="email" name="email" placeholder="optional but recommended" style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <label style={labelStyle}>Main subject concern</label>
                    <select name="subject" style={selectStyle}>
                      <option value="">Select subject</option>
                      {["Science","Mathematics","English","Geography","History","All subjects"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Preferred session time</label>
                    <select name="preferred_time" style={selectStyle}>
                      <option value="">Select time</option>
                      {["Morning (7–9am)","Afternoon (1–3pm)","Evening (5–7pm)","Evening (7–9pm)","Weekend morning"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>What&apos;s your main concern about your child&apos;s learning?</label>
                  <textarea name="concern" rows={3} placeholder="e.g. She studies hard but forgets everything in exams. I feel the foundation is weak..." style={{ ...inputStyle, resize: "vertical" }} />
                </div>
                <button type="submit" disabled={formState === "loading"}
                  style={{ width: "100%", padding: "14px", background: "var(--gold)", color: "var(--dark)", border: "none", borderRadius: "6px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s", opacity: formState === "loading" ? 0.7 : 1 }}>
                  {formState === "loading" ? "Sending..." : "BOOK MY FREE SESSION →"}
                </button>

                {formState === "error" && (
                  <div style={{ marginTop: "1rem", textAlign: "center", padding: "1rem", background: "rgba(163,45,45,0.12)", border: "0.5px solid rgba(163,45,45,0.3)", borderRadius: "8px" }}>
                    <p style={{ color: "#e87070", fontSize: "0.85rem" }}>Something went wrong. Please WhatsApp us directly at <a href="https://wa.me/919052416158" style={{ color: "var(--gold)" }}>+91 90524 16158</a></p>
                  </div>
                )}
              </form>
            ) : (
              <div style={{ marginTop: "2rem", textAlign: "center", padding: "1.25rem", background: "rgba(59,109,17,0.12)", border: "0.5px solid rgba(59,109,17,0.3)", borderRadius: "8px", maxWidth: "520px", marginLeft: "auto", marginRight: "auto" }}>
                <p style={{ color: "#7ec850", fontWeight: 500, marginBottom: "4px" }}>Booking received!</p>
                <p style={{ fontSize: "0.85rem", color: "rgba(240,230,206,0.6)" }}>We will WhatsApp you within 2 hours to confirm your session.</p>
              </div>
            )}

            <p className="cta-note" style={{ marginTop: "1.25rem" }}>We will WhatsApp you within 2 hours · Kolkata-based families only in Phase 1</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-inner">
            <div>
              <p className="footer-brand">EduCreation</p>
              <p className="footer-desc">A learning system built for every student in India. Not just knowledge — understanding that stays for life. Conceptual. Stress-free. Personalised.</p>
              <p style={{ marginTop: "1rem", fontSize: "0.82rem", color: "rgba(201,169,110,0.5)" }}>
                <a href="mailto:anirudhakar@gmail.com" style={{ color: "inherit" }}>anirudhakar@gmail.com</a><br />
                Kolkata, West Bengal, India
              </p>
            </div>
            <div>
              <p className="footer-col-title">System</p>
              <ul className="footer-links">
                <li><a href="#system">How it works</a></li>
                <li><a href="#system">The 4 steps</a></li>
                <li><a href="#students">For students</a></li>
                <li><a href="#parents">For parents</a></li>
                <li><a href={WA} target="_blank" rel="noreferrer">For schools</a></li>
              </ul>
            </div>
            <div>
              <p className="footer-col-title">Plans</p>
              <ul className="footer-links">
                <li><a href="#pricing">Spark — ₹499/mo</a></li>
                <li><a href="#pricing">Illuminate — ₹999/mo</a></li>
                <li><a href="#pricing">Mastery — ₹1,999/mo</a></li>
                <li><a href={WA} target="_blank" rel="noreferrer">Schools &amp; institutions</a></li>
              </ul>
            </div>
            <div>
              <p className="footer-col-title">Contact</p>
              <ul className="footer-links">
                <li><a href="mailto:anirudhakar@gmail.com">anirudhakar@gmail.com</a></li>
                <li><a href={WA} target="_blank" rel="noreferrer">WhatsApp us</a></li>
                <li><a href={WA} target="_blank" rel="noreferrer">Book a call</a></li>
                <li><a href={WA} target="_blank" rel="noreferrer">School pilot enquiry</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 EduCreation · educreators.org · All rights reserved</p>
            <p className="footer-tagline">&ldquo;Understand more. Stress less. Create always.&rdquo;</p>
          </div>
        </div>
      </footer>
    </>
  );
}
