"use client";
import { useState } from "react";
import Link from "next/link";

export default function GetPdfPage() {
  const [form, setForm] = useState({ className: "Class 10", subject: "", topic: "", problem: "", whatsapp: "" });
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if(!form.subject || !form.topic) { alert("Please enter subject and topic"); return; }
    setLoading(true);
    // Track Lead for Meta Pixel
    if(typeof window !== 'undefined' && (window as any).fbq) (window as any).fbq('track','Lead');
    
    setTimeout(()=> {
      setGuide({
        title: `${form.topic} - 4 Step Guide for ${form.className}`,
        steps: [
          { n: 1, t: `Understand ${form.topic}`, d: `Core concept of ${form.topic} in ${form.subject}: ${form.problem || 'Student finds it confusing'}. Start with definition + 1 real-life example.` },
          { n: 2, t: `Visual Concept Map`, d: `Break ${form.topic} into 3 parts: What, Why, How. Draw boxes and connect.` },
          { n: 3, t: `Practice in 15 mins`, d: `Do 3 questions: 1 easy (definition), 1 medium (example), 1 hard (from ${form.className} book). Use timer.` },
          { n: 4, t: `Check Mastery`, d: `Ask child to explain ${form.topic} in own words. If can teach, mastered. If not, revisit Step 1.` }
        ]
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Inter, sans-serif", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <Link href="/pricing" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>← Back to pricing</Link>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginTop: "1.5rem" }}>Free 4-Step Concept Guide</h1>
        <p style={{ color: "#888", marginTop: "0.5rem" }}>Enter child's class + topic + problem → Get instant PDF. No payment.</p>
        
        {!guide ? (
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: "16px", padding: "1.5rem", marginTop: "2rem" }}>
            <label style={{ display: "block", color: "#aaa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Class</label>
            <select value={form.className} onChange={e=>setForm({...form, className:e.target.value})} style={{ width: "100%", padding: "0.8rem", background: "#0a0a0a", border: "1px solid #333", color: "#fff", borderRadius: "8px", marginBottom: "1rem" }}>
              {["Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"].map(c=> <option key={c}>{c}</option>)}
            </select>
            <label style={{ display: "block", color: "#aaa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Subject</label>
            <input value={form.subject} onChange={e=>setForm({...form, subject:e.target.value})} placeholder="e.g. Maths, Science, SST" style={{ width: "100%", padding: "0.8rem", background: "#0a0a0a", border: "1px solid #333", color: "#fff", borderRadius: "8px", marginBottom: "1rem" }} />
            <label style={{ display: "block", color: "#aaa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Topic</label>
            <input value={form.topic} onChange={e=>setForm({...form, topic:e.target.value})} placeholder="e.g. Photosynthesis, Algebra" style={{ width: "100%", padding: "0.8rem", background: "#0a0a0a", border: "1px solid #333", color: "#fff", borderRadius: "8px", marginBottom: "1rem" }} />
            <label style={{ display: "block", color: "#aaa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>What problem is child facing? (optional)</label>
            <textarea value={form.problem} onChange={e=>setForm({...form, problem:e.target.value})} placeholder="e.g. Can't remember formula, confuses concepts" style={{ width: "100%", padding: "0.8rem", background: "#0a0a0a", border: "1px solid #333", color: "#fff", borderRadius: "8px", marginBottom: "1rem", minHeight: "80px" }} />
            <button onClick={generate} disabled={loading} style={{ width: "100%", padding: "1rem", background: "#22c55e", color: "#000", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "1rem", cursor: "pointer" }}>{loading ? "Generating..." : "🎁 Generate Free PDF Guide"}</button>
            <p style={{ textAlign: "center", color: "#444", fontSize: "0.8rem", marginTop: "1rem" }}>Secure · No spam · Free PDF requires no payment</p>
          </div>
        ) : (
          <div id="pdf-content" style={{ background: "#fff", color: "#000", borderRadius: "16px", padding: "2rem", marginTop: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>{guide.title}</h2>
            <p style={{ color: "#555", marginTop: "0.5rem" }}>Subject: {form.subject} | Topic: {form.topic}</p>
            <div style={{ marginTop: "1.5rem" }}>
              {guide.steps.map((s:any)=> (
                <div key={s.n} style={{ marginBottom: "1.5rem", borderLeft: "4px solid #22c55e", paddingLeft: "1rem" }}>
                  <h3 style={{ fontWeight: 700 }}>Step {s.n}: {s.t}</h3>
                  <p style={{ color: "#333", marginTop: "0.3rem", lineHeight: 1.5 }}>{s.d}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
              <button onClick={()=>window.print()} style={{ flex: 1, padding: "0.9rem", background: "#111", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600 }}>Download as PDF</button>
              <Link href="/signup" style={{ flex: 1, textAlign: "center", padding: "0.9rem", background: "#22c55e", color: "#000", borderRadius: "8px", fontWeight: 700, textDecoration: "none" }}>Get Mentor for ₹1,999</Link>
            </div>
            <button onClick={()=>setGuide(null)} style={{ marginTop: "1rem", background: "none", border: "none", color: "#888", fontSize: "0.9rem", cursor: "pointer" }}>← Generate another</button>
          </div>
        )}
      </div>
    </div>
  );
}
