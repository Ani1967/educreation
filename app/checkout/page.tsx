"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CheckoutContent(){
  const params = useSearchParams();
  const plan = params.get("plan") || "1999";
  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"white", padding:40, display:"flex", justifyContent:"center" }}>
      <div style={{ background:"white", color:"black", borderRadius:20, padding:32, maxWidth:500, width:"100%" }}>
        <h1 style={{ fontSize:28, fontWeight:700, fontFamily:"serif" }}>Get 1-on-1 Mentor</h1>
        <p style={{ marginTop:8, color:"#6b7280" }}>Free guide done → Now unlock teacher for hand-holding</p>
        <div style={{ background:"#f3f4f6", borderRadius:12, padding:16, marginTop:20 }}>
          <p><b>Plan:</b> Mentor + Full Solution</p>
          <p style={{ fontSize:28, fontWeight:800, marginTop:8 }}>₹{plan}</p>
        </div>
        <button onClick={()=>window.location.href='https://rzp.io/l/YOUR_RAZORPAY_LINK'} style={{ width:"100%", background:"#22c55e", color:"black", padding:14, borderRadius:12, fontWeight:700, marginTop:20 }}>Pay ₹{plan} Now</button>
        <p style={{ fontSize:12, color:"#9ca3af", marginTop:12, textAlign:"center" }}>Replace YOUR_RAZORPAY_LINK later with your real link</p>
        <button onClick={()=>window.location.href='/get-pdf'} style={{ width:"100%", marginTop:12, background:"black", color:"white", padding:12, borderRadius:12 }}>← Back to guide</button>
      </div>
    </div>
  );
}

export default function Page(){
  return <Suspense fallback={<div>Loading...</div>}><CheckoutContent/></Suspense>
}
