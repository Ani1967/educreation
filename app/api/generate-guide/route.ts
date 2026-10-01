import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { className, subject, topic, problem } = await req.json();
    const systemPrompt = `
You are EduCreators Senior Mentor for Class 6-12 India.
Generate JSON: {"anchor": "...", "map": "...", "ex": {"problem": "...", "solution": "...", "mistake": "...", "practice": "...", "check": "..."}}
Rules: Step1 real-life Indian analogy, Step2 actual 3-box map →→, Step3 solves EXACT block "${problem}", Step4 new practice question different from Step3.
`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Class: ${className}, Subject: ${subject}, Topic: ${topic}, Block: ${problem}` }
      ],
      temperature: 0.7,
    });
    const data = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
