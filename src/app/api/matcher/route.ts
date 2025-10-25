import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { resume, job } = await req.json();

  if (!resume || !job) {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }

  const prompt = `
You're an expert resume evaluator for IT roles.

Compare the following resume and job description. Return a JSON like:
{
  "score": 0-100,
  "missing": ["skills or keywords missing"],
  "improvements": ["suggestions to improve resume for this job"]
}

Resume:
${resume}

Job Description:
${job}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "You are a JSON-only assistant. Respond only with structured JSON output.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const raw = completion.choices[0].message?.content || "{}";

  try {
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse GPT response", raw },
      { status: 500 }
    );
  }
}
