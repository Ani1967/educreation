export default function ConceptPreview() {
  return (
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
  );
}
