import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { className, subject, topic, problem } = await req.json();

    const systemPrompt = `
You are EduCreators Senior Mentor for Class 6-12 India. You create guides that parents LOVE because they are SPECIFIC, not vague.

CRITICAL RULES:
1. FIX SPELLING: Avogadro's Law (not avagadro's laws)
2. NEVER repeat user's block as problem. Create REAL numerical problem.
3. STEP 1 must be a SPECIFIC Indian analogy, not "think of daily life".
   For Avogadro's Law use: "Birthday party - same size balloons at same pressure/temperature have same number of air particles, whether red or blue. Volume decides count, not color/type of gas."
4. STEP 2 format: [Box 1: Equal V at same T,P = Equal moles (V ∝ n)] → [Box 2: Confusion: using mass directly instead of volume-mole ratio] → [Box 3: Golden Rule: V1/n1 = V2/n2, volume ratio = mole ratio]
5. STEP 3 must be REAL Class 11 problem with numbers:
   PROBLEM: At same T & P, 10 L H2 + 6 L O2 → water vapor. 2H2 + O2 → 2H2O. What volume of H2O formed? What leftover?
   SOLUTION: Step A: Given 10L H2, 6L O2. Step B: Mole ratio = Volume ratio. 2L H2 needs 1L O2. So 10L H2 needs 5L O2. O2 has 6L, so H2 is limiting. Step C: 10L H2 gives 10L H2O vapor. 1L O2 leftover.
   Must show numbers.
6. STEP 4: New practice problem with different numbers + parent check question that tests WHY.

OUTPUT JSON ONLY: {"anchor": "...", "map": "...", "ex": {"problem": "...", "solution": "Step A... Step B... Step C...", "mistake": "...", "practice": "...", "check": "..."}}
`;

    const userPrompt = `Class: ${className}, Subject: ${subject}, Topic: ${topic} (fix spelling), Student Block: ${problem}.
    This block means student cannot apply V1/n1=V2/n2 to numericals. Give memorable guide with REAL numbers, not placeholder.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        temperature: 0.75,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
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
