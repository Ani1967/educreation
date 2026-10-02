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

  const mapBoxes = data?.map ? data.map.split("→").map((s:string)=>s.trim()) : [];

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", padding:24, color:"white" }}>
      <p style={{ color:"#9ca3af", fontSize:14, marginBottom:12 }}>Enter child's class + topic + problem → Get instant PDF. No payment.</p>
      <h1 style={{ fontSize:42, fontFamily:"serif", marginBottom:20 }}>EduCreators - 4 Step Guide Generator</h1>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:30 }}>
        <input value={classVal} onChange={e=>setClassVal(e.target.value)} style={{ padding:"8px 12px", borderRadius:6, color:"black", background:"white" }} />
        <input value={subject} onChange={e=>setSubject(e.target.value)} style={{ padding:"8px 12px", borderRadius:6, color:"black", background:"white" }} />
        <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic e.g. Avogadros law" style={{ padding:"8px 12px", borderRadius:6, color:"black", background:"white", width:220 }} />
        <textarea value={problem} onChange={e=>setProblem(e.target.value)} placeholder="Block e.g. cannot understand problems" style={{ padding:"8px 12px", borderRadius:6, color:"black", background:"white", width:260, height:38 }} />
        <button onClick={generate} style={{ background:"white", color:"black", padding:"8px 16px", borderRadius:6, fontWeight:700 }}>{loading?"Generating...":"Generate Real Guide"}</button>
      </div>

      {data && !data.error && (
        <div style={{ background:"white", color:"black", borderRadius:20, padding:32, maxWidth:850 }}>
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
                    {i < mapBoxes.length-1 && <span style={{ fontSize:20 }}>→</span>}
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
            <button style={{ flex:1, background:"black", color:"white", padding:14, borderRadius:12, fontWeight:700 }}>Download as PDF</button>
            <button onClick={()=>window.location.href='/checkout?plan=1999'} style={{ flex:1, background:"#22c55e", color:"black", padding:14, borderRadius:12, fontWeight:700 }}>Get Mentor for ₹1,999</button>
          </div>
        </div>
      )}
    </div>
  );
}
