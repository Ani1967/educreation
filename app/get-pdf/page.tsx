"use client";
import { useState } from "react";

export default function Page() {
  const [className, setClassName] = useState("Class 11");
  const [subject, setSubject] = useState("Science");
  const [topic, setTopic] = useState("");
  const [block, setBlock] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setData(null);
    const res = await fetch("/api/generate-guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ className, subject, topic, problem: block }),
    });
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">EduCreators - 4 Step Guide Generator</h1>
      <input className="border p-2 w-full mb-2" value={className} onChange={e=>setClassName(e.target.value)} placeholder="Class" />
      <input className="border p-2 w-full mb-2" value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject" />
      <input className="border p-2 w-full mb-2" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic e.g. Avogadros law" />
      <textarea className="border p-2 w-full mb-2" value={block} onChange={e=>setBlock(e.target.value)} placeholder="Block e.g. cannot understand problems" />
      <button onClick={generate} className="bg-black text-white px-4 py-2 rounded w-full">{loading ? "Generating..." : "Generate Real Guide"}</button>

      {data && !data.error && (
        <div className="mt-8 space-y-6 border-t pt-6">
          <div><b>Step 1: Real-Life Anchor</b><p className="mt-2">{data.anchor}</p></div>
          <div><b>Step 2: 3-Box Visual Map</b><p className="mt-2">{data.map}</p></div>
          <div><b>Step 3: Worked Example ⭐</b><p className="mt-2"><b>PROBLEM:</b> {data.ex?.problem}</p><p className="mt-2"><b>SOLUTION:</b> {data.ex?.solution}</p><p className="mt-2 text-red-600"><b>Mistake:</b> {data.ex?.mistake}</p></div>
          <div><b>Step 4: Your Turn</b><p className="mt-2">{data.ex?.practice}</p><p className="mt-2 italic">{data.ex?.check}</p></div>
        </div>
      )}
      {data?.error && <p className="text-red-500 mt-4">{data.error}</p>}
    </div>
  );
}
