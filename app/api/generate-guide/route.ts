import { NextRequest, NextResponse } from "next/server";

const FORBIDDEN = ["think of your daily life", "One line definition", "Why does", "Your block", "One rule to fix", "Break it: Step A", "change numbers"];

function isVague(json: any){
  const text = JSON.stringify(json).toLowerCase();
  return FORBIDDEN.some(p => text.includes(p.toLowerCase())) || json.ex?.problem?.includes("cannot understand");
}

export async function POST(req: NextRequest) {
  try {
    const { className, subject, topic, problem } = await req.json();

    const SYSTEM = `
You are EduCreators Senior Mentor for Class 6-12, India. Parent is not a teacher. You must make child understand in 10 mins.

GOLDEN RULES FOR ANY TOPIC:
- FIX SPELLING: avagadro -> Avogadro's Law, pythagoras -> Pythagoras
- If block is vague like "cannot understand problems", INFER the #1 real reason students fail that topic.
- ANCHOR (Step 1): ONE specific Indian analogy with objects. Kitchen/market/cricket/mela. 2 sentences, with numbers. NEVER say "Think of daily life".
  BAD: Think of avagadro's laws from daily life
  GOOD: Birthday party - all balloons same size, same room temp, same tightness = same number of air particles, whether red or blue. Volume = count, not colour.
- MAP (Step 2): MUST be exactly: [Box 1: definition with formula] → [Box 2: specific confusion] → [Box 3: golden rule with formula] Each box max 15 words.
- EXAMPLE (Step 3): MUST be REAL problem with numbers for that class. Not placeholder.
  Structure: problem (full question), solution (Step A Given, Step B Apply rule with calc, Step C Answer + check), mistake (specific), practice (new numbers), check (teach-back question)
- BANNED PHRASES: ${FORBIDDEN.join(", ")}

FEW-SHOT EXAMPLE 1:
Input: Class 10 Math, Pythagoras, cannot find hypotenuse
Output: {"anchor": "Cricket field: Corner to corner is always longest. Like diagonal of your notebook is longer than side. That's hypotenuse - always opposite 90°.", "map": "[Box 1: a²+b²=c², c is longest] → [Box 2: Picks any long side as c] → [Box 3: Rule: c is always opposite 90°]", "ex": {"problem": "Right triangle, sides 6cm, 8cm, find hypotenuse", "solution": "Step A: Given 6,8, right angle. Step B: c²=6²+8²=36+64=100. Step C: c=10cm. Check 10 is longest, ok.", "mistake": "Adding 6+8=14 as hypotenuse. Fix: must square first.", "practice": "Sides 5 and 12, find hypotenuse?", "check": "Ask: Why can't 6 be hypotenuse here?"}}

FEW-SHOT EXAMPLE 2:
Input: Class 11 Science, Avogadro's Law, cannot solve problems
Output: {"anchor": "Same steel dabbas at same sweet shop temp & pressure hold same number of laddoos, whether besan or motichoor. Volume decides count, not type of gas.", "map": "[Box 1: Same T,P, Equal V = Equal moles, V/n = constant] → [Box 2: Uses mass directly not V ratio] → [Box 3: Golden Rule: V1/n1=V2/n2, volume ratio = mole ratio]", "ex": {"problem": "At same T,P, 10L H2 + 6L O2 -> H2O vapour. 2H2+O2->2H2O. Find H2O volume and leftover.", "solution": "Step A: Given 10L H2, 6L O2. Step B: 2L H2 needs 1L O2, so 10L H2 needs 5L O2. O2 is 6L, so H2 limiting. 10L H2 gives 10L H2O. Step C: Answer 10L H2O, 1L O2 left. Check: volume ratio = mole ratio, makes sense.", "mistake": "Forgetting same T,P condition and using mass. Fix: Always use V1/n1=V2/n2.", "practice": "At same T,P, 8L N2 + 18L H2 -> 2NH3. Find NH3 volume.", "check": "Ask child: Why 10L H2 gave 10L H2O not 20L? Explain ratio."}}

Now produce for given input. JSON ONLY.
`;

    const makeCall = async () => {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          temperature: 0.65,
          messages: [{ role: "system", content: SYSTEM }, { role: "user", content: `Class ${className}, Subject ${subject}, Topic ${topic}, Block ${problem}` }]
        })
      });
      const j = await r.json();
      return JSON.parse(j.choices[0].message.content);
    };

    let data = await makeCall();
    if (isVague(data)) { // auto-retry once if still vague
      console.log("Vague detected, retrying...");
      data = await makeCall();
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
