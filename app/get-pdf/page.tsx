"use client";
import { useState } from "react";

export default function Page() {
  const [classVal, setClassVal] = useState("Class 11");
  const [subject, setSubject] = useState("Science");
  const [topic, setTopic] = useState("");
  const [problem, setProblem] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if(!topic){ alert("Please enter Topic e.g. integers, Avogadros law"); return; }
    setLoading(true);
    const res = await fetch("/api/generate-guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ className: classVal, subject, topic, problem }),
    });
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  const handleDownload = () => {
    const el = document.getElementById("guide-card");
    if(!el) return;
    const win = window.open("", "", "width=900,height=900");
    if(!win) return;
    win.document.write(`<html><head><title>${topic} Guide</title>
      <style>body{font-family:serif;padding:24px} h2{font-size:22px} .step{border-left:4px solid #22c55e;padding-left:12px;margin:20px 0} .boxes{display:flex;gap:10px} .box{background:#f9fafb;border:1px solid #ddd;border-radius:10px;padding:12px;flex:1}</style>
      </head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  const mapBoxes = data?.map ? data.map.split("→").map((s:string)=>s.trim()) : [];

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", padding:24, color:"white" }}>
      <p style={{ color:"#9ca3af", fontSize:14, marginBottom:12 }}>Enter child's class + topic + problem → Get instant PDF. No payment.</p>
      <h1 style={{ fontSize:40, fontFamily:"serif", marginBottom:20 }}>EduCreators - 4 Step Guide Generator</h1>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1.5fr", gap:12, marginBottom:24, maxWidth:1000 }}>
        <div>
          <label style={{ fontSize:12, color:"#9ca3af" }}>Class *</label>
          <input value={classVal} onChange={e=>setClassVal(e.target.value)} placeholder="e.g. Class 8, Class 11" style={{ width:"100%", padding:"10px 12px", borderRadius:8, color:"black", background:"white", marginTop:4 }} />
          <small style={{ color:"#6b7280", fontSize:11 }}>Ex: Class 8, Class 10</small>
        </div>
        <div>
          <label style={{ fontSize:12, color:"#9ca3af" }}>Subject *</label>
          <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="e.g. math, Science" style={{ width:"100%", padding:"10px 12px", borderRadius:8, color:"black", background:"white", marginTop:4 }} />
          <small style={{ color:"#6b7280", fontSize:11 }}>Ex: math, Science</small>
        </div>
        <div>
          <label style={{ fontSize:12, color:"#9ca3af" }}>Topic *</label>
          <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. integers, Avogadros law" style={{ width:"100%", padding:"10px 12px", borderRadius:8, color:"black", background:"white", marginTop:4 }} />
          <small style={{ color:"#6b7280", fontSize:11 }}>Be specific: e.g. integers</small>
        </div>
        <div>
          <label style={{ fontSize:12, color:"#9ca3af" }}>Block / Problem (be specific)</label>
          <textarea value={problem} onChange={e=>setProblem(e.target.value)} placeholder="e.g. cannot understand adding negatives, mixes mass & volume, cannot solve NCERT Q5" style={{ width:"100%", padding:"10px 12px", borderRadius:8, color:"black", background:"white", marginTop:4, height:42 }} />
          <small style={{ color:"#fbbf24", fontSize:11 }}>Tip: Write exact confusion, not just topic</small>
        </div>
      </div>
      <button onClick={generate} style={{ background:"white", color:"black", padding:"10px 20px", borderRadius:8, fontWeight:700, marginBottom:30 }}>{loading?"Generating...":"Generate Real Guide"}</button>

      {data && !data.error && (
        <div id="guide-card" style={{ background:"white", color:"black", borderRadius:20, padding:32, maxWidth:900 }}>
          <h2 style={{ fontSize:24, fontFamily:"serif", fontWeight:700 }}>{topic} - 4 Step Guide for {classVal}</h2>
          <p style={{ color:"#6b7280", fontSize:14, marginTop:4 }}>Subject: {subject} | Topic: {topic}</p>

          <div style={{ marginTop:28, display:"flex", flexDirection:"column", gap:28 }}>
            <div style={{ borderLeft:"4px solid #22c55e", paddingLeft:16 }}>
              <b style={{ fontSize:20, fontFamily:"serif" }}>Step 1: Real-Life Anchor</b>
              <p style={{ marginTop:8 }}>{data.anchor}</p>
            </div>
            <div style={{ borderLeft:"4px solid #22c55e", paddingLeft:16 }}>
              <b style={{ fontSize:20, fontFamily:"serif" }}>Step 2: 3-Box Visual Map</b>
              <div style={{ marginTop:12, display:"flex", gap:12, flexWrap:"wrap" }}>
                {mapBoxes.map((b:string,i:number)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, flex:1 }}>
                    <div style={{ flex:1, background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:10, padding:12, fontSize:14 }}>{b.replace(/^\[|\]$/g,'')}</div>
                    {i < mapBoxes.length-1 && <span>→</span>}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderLeft:"4px solid #22c55e", paddingLeft:16 }}>
              <b style={{ fontSize:20, fontFamily:"serif" }}>Step 3: Worked Example ⭐</b>
              <p style={{ marginTop:8 }}><b>PROBLEM:</b> {data.ex?.problem}</p>
              <p style={{ marginTop:8 }}><b>SOLUTION:</b> {data.ex?.solution}</p>
              <p style={{ marginTop:8, color:"#dc2626" }}><b>Mistake:</b> {data.ex?.mistake}</p>
            </div>
            <div style={{ borderLeft:"4px solid #22c55e", paddingLeft:16 }}>
              <b style={{ fontSize:20, fontFamily:"serif" }}>Step 4: Your Turn</b>
              <p style={{ marginTop:8 }}>{data.ex?.practice}</p>
              <p style={{ marginTop:8, fontStyle:"italic", color:"#6b7280" }}>{data.ex?.check}</p>
            </div>
          </div>

          <div style={{ marginTop:32, display:"flex", gap:16 }}>
            <button onClick={handleDownload} style={{ flex:1, background:"black", color:"white", padding:14, borderRadius:12, fontWeight:700 }}>Download as PDF</button>
            <button onClick={()=>window.location.href='/checkout?plan=1999'} style={{ flex:1, background:"#22c55e", color:"black", padding:14, borderRadius:12, fontWeight:700 }}>Get Mentor for ₹1,999</button>
          </div>
        </div>
      )}
    </div>
  );
}
