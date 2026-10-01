import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { className, subject, topic, problem } = await req.json();

    const systemPrompt = `You are EduCreators Senior Mentor for Class 6-12 India. Generate JSON: {"anchor": "...", "map": "...", "ex": {"problem": "...", "solution": "...", "mistake": "...", "practice": "...", "check": "..."}} Rules: Step1 real-life Indian analogy specific to ${topic} and block "${problem}", Step2 actual 3-box map →→, Step3 solves EXACTLY "${problem}", Step4 new practice question different from Step3.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Class: ${className}, Subject: ${subject}, Topic: ${topic}, Block: ${problem}` }
        ]
      }),
    });

    const result = await response.json();
    const data = JSON.parse(result.choices[0].message.content);
    return NextResponse.json(data);

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
