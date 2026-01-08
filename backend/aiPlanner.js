import OpenAI from "openai";

export async function generateAgentPlan(resume, jd) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  // Create client ONLY when function is called
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const prompt = `
You are an AI agent planner.

Goal: Optimize a resume for a job application.

Resume length: ${resume.length}
Job description length: ${jd.length}

Return a short step-by-step plan as bullet points.
`;

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt
  });

  // Convert response into array
  return response.output_text
    .split("\n")
    .map(step => step.trim())
    .filter(Boolean);
}
