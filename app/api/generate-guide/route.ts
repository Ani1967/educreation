import { NextRequest, NextResponse } from "next/server";

const FORBIDDEN = ["think of your daily life", "One line definition", "Why does", "Your block", "One rule to fix", "Break it: Step A", "change numbers"];

function isVague(json: any){
  const text = JSON.stringify(json).toLowerCase();
  return FORBIDDEN.some(p => text.includes(p.toLowerCase())) || json.ex?.problem?.toLowerCase().includes("cannot understand");
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY missing in Vercel" }, { status: 500 });
    }
    const { className, subject, topic, problem } = await req.json();

    const SYSTEM = `
You are EduCreators - NCERT Class 6-12 expert. Accuracy is #1 + Creativity is hook. Tutor will verify, so never hallucinate. Guide is teaser, teacher will do hand-holding.

RULES:
- FIX SPELLING: avagadro -> Avogadro's Law
- ANCHOR: ONE specific Indian analogy (bazaar/kitchen/cricket/mela). 2 sentences, with numbers. Creative hook for student. NEVER say "Think of daily life".
- MAP: Must be: [Box 1: Correct definition + correct formula] → [Box 2: Specific confusion] → [Box 3: Golden rule + formula] Each max 15 words.
- EXAMPLE: REAL NCERT problem with CORRECT balanced equation/formula. For Chemistry balance first. Never invent. Use: 2H2+O2->2H2O, N2+3H2->2NH3. Accurate = parent trust.
- Keep explanation short, not too detailed. Real-life example + worked problem = entices parent. Teacher explains further.
- BANNED: ${FORBIDDEN.join(", ")}

FEW-SHOT:
Input: Class 11 Science, Avogadro's Law, cannot solve problems
Output: {"anchor": "Same steel dabbas at sweet shop same temp & pressure hold same number of laddoos, whether besan or motichoor. Volume decides count, not type.", "map": "[Box 1: Same T,P, Equal V = Equal moles, V/n=const] → [Box 2: Uses mass directly not V ratio] → [Box 3: Golden Rule: V1/n1=V2/n2, volume ratio=mole ratio]", "ex": {"problem": "At same T,P, 10L H2 + 6L O2 -> H2O vapour. 2H2+O2->2H2O. Find H2O volume and leftover.", "solution": "Step A: Given 10L H2, 6L O2. Step B: 2L H2 needs 1L O2, so 10L needs 5L O2. H2 limiting. 10L H2 gives 10L H2O. Step C: 10L H2O, 1L O2 left. Check ratio.", "mistake": "Forgetting same T,P and using mass. Fix: Always V1/n1=V2/n2.", "practice": "At same T,P, 8L N2 + 18L H2 -> 2NH3. Find NH3 volume.", "check": "Why 10L H2 gave 10L H2O not 20L?"}}

JSON ONLY.
`;

    const makeCall = async () => {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.3,
          response_format: { type: "json_object" },
          messages: [{ role: "system", content: SYSTEM }, { role: "user", content: `Class ${className}, Subject ${subject}, Topic ${topic}, Block ${problem}` }]
        })
      });
      const j = await r.json();
      if (j.error) throw new Error(j.error.message);
      return JSON.parse(j.choices[0].message.content);
    };

    let data = await makeCall();
    if (isVague(data)) data = await makeCall();

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
