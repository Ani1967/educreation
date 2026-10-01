"use client";
import { useState } from "react";
import Link from "next/link";

type Form = { className: string; subject: string; topic: string; problem: string; whatsapp: string };

function getAnchor(topic: string, subject: string, problem: string) {
  const t = topic.toLowerCase();
  if (t.includes("integer")) return `Think of integers as money: + = you GET Rs., - = you OWE Rs. You said "${problem}" - that happens because we mix getting and owing.`;
  if (t.includes("light")) return `Think of torch in dark room. Light goes straight until it hits something. Spoon in water looks bent - that's light bending. Your block "${problem}" is about that bend/bounce.`;
  if (t.includes("photo")) return `Think of kitchen: Leaf = kitchen, Sunlight = gas, Water+CO2 = vegetables, Glucose = cooked food.`;
  if (t.includes("algebra") || t.includes("equation")) return `Think of weighing scale: Left = Right. Whatever you do on left, do on right to keep balance.`;
  return `Think of ${topic} from your daily life, not textbook. Your exact block is "${problem || 'confusion'}" - we will fix that one point, not whole chapter.`;
}

function getConceptMap(topic: string) {
  const t = topic.toLowerCase();
  if (t.includes("integer")) return `[Box 1: Sign = Direction, + = GET, - = OWE] → [Box 2: Same sign = Add, keep sign (-3 + -2 = -5)] → [Box 3: Different sign = Subtract, bigger number's sign wins (-3 + 5 = +2)]`;
  if (t.includes("light")) return `[Box 1: Real Image = Light ACTUALLY meets, can catch on screen, inverted] → [Box 2: Virtual = Light SEEMS to meet, can't catch, erect like mirror] → [Box 3: Rule = Light travels straight, then reflects or refracts]`;
  if (t.includes("algebra")) return `[Box 1: Variable = empty dabba] → [Box 2: Equation = dabba + number = total] → [Box 3: Solve = Do opposite to isolate dabba]`;
  return `[Box 1: What is ${topic}? One line definition] → [Box 2: Why does "${topic}" get confusing? Your block] → [Box 3: One rule to fix it]`;
}

function getWorkedExample(topic: string, problem: string, className: string) {
  const t = topic.toLowerCase();
  const p = problem.toLowerCase();

  if (t.includes("integer") && (p.includes("negat") || p.includes("operat") || p.includes("add"))) {
    return {
      problem: `-3 + 5 = ?`,
      solution: `You OWE Rs.3 (-3), you GET Rs.5 (+5). Pay back Rs.3. You are left with Rs.2. So answer is +2.`,
      mistake: `Common Mistake: Most kids do -3 + 5 = -8 by adding 3+5. Don't add. When signs are different, SUBTRACT and take bigger number's sign.`
    };
  }
  if (t.includes("light") && (p.includes("real") || p.includes("virtual") || p.includes("image") || p.includes("solve"))) {
    return {
      problem: `Why is mirror image erect but projector image inverted?`,
      solution: `Mirror: Rays never meet behind mirror, they only SEEM to meet. Can't catch on screen = Virtual = erect. Projector/magnifier: Rays ACTUALLY meet on wall = Real = you can catch it = inverted.`,
      mistake: `Common Mistake: Thinking "If I can see it, it's real". No. Real = can catch on screen. Virtual = can't, even though you see it.`
    };
  }
  // Generic but uses their exact problem
  return {
    problem: `${topic} - ${problem || 'confusion in concept'}`,
    solution: `Break it: Step A - What is given? Step B - Apply ONE rule of ${topic}. Step C - Check: Does answer make sense for ${className} level?`,
    mistake: `Common Mistake: Trying to remember whole chapter. Fix only this: ${problem || topic}. Master one rule, not 10 formulas.`
  };
}

export default function GetPdfPage() {
  const [form, setForm] = useState<Form>({ className: "Class 8", subject: "Science", topic: "", problem: "", whatsapp: "" });
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if(!form.subject || !form.topic) { alert("Please enter subject and topic"); return; }
    setLoading(true);
    if(typeof window !== 'undefined' && (window as any).fbq) (window as any).fbq('track','Lead');
    
    setTimeout(()=> {
      const anchor = getAnchor(form.topic, form.subject, form.problem);
      const map = getConceptMap(form.topic);
      const ex = getWorkedExample(form.topic, form.problem, form.className);

      setGuide({
        title: `${form.topic} - 4 Step Guide for ${form.className}`,
        sub: `Subject: ${form.subject} | Topic: ${form.topic} | Block: ${form.problem || 'General'}`,
        steps: [
          { n: 1, t: `Real-Life Anchor`, d: anchor, color: "#22c55e" },
          { n: 2, t: `3-Box Visual Map`, d: map, color: "#22c55e" },
          { n: 3, t: `Worked Example - Your Block Solved`, d: `PROBLEM: ${ex.problem}\n\nSOLUTION: ${ex.solution}\n\n${ex.mistake}`, color: "#facc15", highlight: true },
          { n: 4, t: `Your Turn + Check Mastery`, d: `Try similar: ${ex.problem.replace('?', '').split('=')[0]} = ? (change numbers). \n\nParent check: Ask child "Can you teach me why answer is NOT the common mistake? If can teach, mastered. If not, revisit Step 1."`, color: "#22c55e" },
        ]
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Inter, sans-serif", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <Link href="/pricing" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>← Back to pricing</Link>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginTop: "1.5rem" }}>Free 4-Step Concept Guide</h1>
        <p style={{ color: "#888", marginTop: "0.5rem" }}>Enter child's class + topic + problem → Get instant PDF. No payment. With worked example.</p>
        
        {!guide ? (
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: "16px", padding: "1.5rem", marginTop: "2rem" }}>
            <label style={{ display: "block", color: "#aaa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Class</label>
            <select value={form.className} onChange={e=>setForm({...form, className:e.target.value})} style={{ width: "100%", padding: "0.8rem", background: "#0a0a0a", border: "1px solid #333", color: "#fff", borderRadius: "8px", marginBottom: "1rem" }}>
              {["Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"].map(c=> <option key={c}>{c}</option>)}
            </select>
            <label style={{ display: "block", color: "#aaa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Subject</label>
            <input value={form.subject} onChange={e=>setForm({...form, subject:e.target.value})} placeholder="e.g. Maths, Science" style={{ width: "100%", padding: "0.8rem", background: "#0a0a0a", border: "1px solid #333", color: "#fff", borderRadius: "8px", marginBottom: "1rem" }} />
            <label style={{ display: "block", color: "#aaa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Topic</label>
            <input value={form.topic} onChange={e=>setForm({...form, topic:e.target.value})} placeholder="e.g. Integers, Light" style={{ width: "100%", padding: "0.8rem", background: "#0a0a0a", border: "1px solid #333", color: "#fff", borderRadius: "8px", marginBottom: "1rem" }} />
            <label style={{ display: "block", color: "#aaa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>What problem is child facing?</label>
            <textarea value={form.problem} onChange={e=>setForm({...form, problem:e.target.value})} placeholder="e.g. Not able to understand operations on negative numbers" style={{ width: "100%", padding: "0.8rem", background: "#0a0a0a", border: "1px solid #333", color: "#fff", borderRadius: "8px", marginBottom: "1rem", minHeight: "80px" }} />
            <button onClick={generate} disabled={loading} style={{ width: "100%", padding: "1rem", background: "#22c55e", color: "#000", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>{loading ? "Generating..." : "🎁 Generate Free PDF Guide"}</button>
          </div>
        ) : (
          <div id="pdf-content" style={{ background: "#fff", color: "#000", borderRadius: "16px", padding: "2rem", marginTop: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>{guide.title}</h2>
            <p style={{ color: "#555", marginTop: "0.5rem", fontSize: "0.9rem" }}>{guide.sub}</p>
            <div style={{ marginTop: "1.5rem" }}>
              {guide.steps.map((s:any)=> (
                <div key={s.n} style={{ 
                  marginBottom: "1.2rem", 
                  borderLeft: `4px solid ${s.color}`, 
                  paddingLeft: "1rem",
                  background: s.highlight ? "#fef9c3" : "transparent",
                  padding: s.highlight ? "1rem" : "0 0 0 1rem",
                  borderRadius: s.highlight ? "8px" : "0",
                }}>
                  <h3 style={{ fontWeight: 700 }}>Step {s.n}: {s.t} {s.highlight && "⭐"}</h3>
                  <p style={{ color: "#222", marginTop: "0.4rem", lineHeight: 1.6, whiteSpace: "pre-wrap", fontWeight: s.highlight ? 500 : 400 }}>{s.d}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
              <button onClick={()=>window.print()} style={{ flex: 1, padding: "0.9rem", background: "#111", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600 }}>Download as PDF</button>
              <Link href="/pricing" style={{ flex: 1, textAlign: "center", padding: "0.9rem", background: "#22c55e", color: "#000", borderRadius: "8px", fontWeight: 700, textDecoration: "none" }}>Get Mentor for ₹1,999</Link>
            </div>
            <button onClick={()=>setGuide(null)} style={{ marginTop: "1rem", background: "none", border: "none", color: "#888", fontSize: "0.9rem", cursor: "pointer" }}>← Generate another</button>
          </div>
        )}
      </div>
    </div>
  );
}
