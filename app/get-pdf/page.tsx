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
    <div className="min-h-screen bg-[#0a0a0a] p-6 text-white">
      <p className="text-gray-400 mb-4">Enter child's class + topic + problem → Get instant PDF. No payment.</p>
      <h1 className="text-3xl font-serif mb-4">EduCreators - 4 Step Guide Generator</h1>
      
      <div className="flex flex-wrap gap-2 mb-8">
        <input value={classVal} onChange={e=>setClassVal(e.target.value)} className="px-3 py-2 rounded text-black" />
        <input value={subject} onChange={e=>setSubject(e.target.value)} className="px-3 py-2 rounded text-black" />
        <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic e.g. Avogadros law" className="px-3 py-2 rounded text-black w-64" />
        <textarea value={problem} onChange={e=>setProblem(e.target.value)} placeholder="Block e.g. cannot understand problems" className="px-3 py-2 rounded text-black w-64" />
        <button onClick={generate} className="bg-white text-black px-4 py-2 rounded font-bold">{loading ? "..." : "Generate Real Guide"}</button>
      </div>

      {data && !data.error && (
        <div className="bg-white text-black rounded-2xl p-8 max-w-4xl">
          <h2 className="text-2xl font-serif font-bold">{topic} - 4 Step Guide for {classVal}</h2>
          <p className="text-gray-600">Subject: {subject} | Topic: {topic}</p>

          <div className="mt-8 space-y-8">
            <div className="border-l-4 border-green-500 pl-4">
              <b className="text-xl font-serif">Step 1: Real-Life Anchor</b>
              <p className="mt-2">{data.anchor}</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <b className="text-xl font-serif">Step 2: 3-Box Visual Map</b>
              <div className="mt-4 flex flex-col md:flex-row gap-2 items-center">
                {mapBoxes.map((b:any,i:number)=>(
                  <><div key={i} className="flex-1 bg-gray-50 border rounded-lg p-3 text-sm">{b.replace(/^\[|\]$/g,'')}</div>{i<mapBoxes.length-1 && <span>→</span>}</>
                ))}
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <b className="text-xl font-serif">Step 3: Worked Example ⭐</b>
              <p className="mt-2"><b>PROBLEM:</b> {data.ex?.problem}</p>
              <p className="mt-2"><b>SOLUTION:</b> {data.ex?.solution}</p>
              <p className="mt-2 text-red-600"><b>Mistake:</b> {data.ex?.mistake}</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <b className="text-xl font-serif">Step 4: Your Turn</b>
              <p className="mt-2">{data.ex?.practice}</p>
              <p className="mt-2 italic text-gray-600">{data.ex?.check}</p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button className="flex-1 bg-black text-white py-3 rounded-xl font-bold">Download as PDF</button>
            <button onClick={()=>window.location.href='/checkout?plan=1999'} className="flex-1 bg-[#1ed760] text-black py-3 rounded-xl font-bold">
              Get Mentor for ₹1,999
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
