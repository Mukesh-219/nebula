import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateAgentPlan } from "./aiPlanner.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Predefined skill list (simple & explainable)
const SKILLS = [
  "javascript",
  "react",
  "node",
  "express",
  "mongodb",
  "sql",
  "html",
  "css",
  "python",
  "api",
  "git"
];

// Tool: Extract skills from text
function extractSkillsTool(text) {
  console.log("🛠️ Tool: extractSkills");
  const lowerText = text.toLowerCase();
  return SKILLS.filter(skill => lowerText.includes(skill));
}

// Tool: Calculate ATS score and identify matches/misses
function calculateATSTool(jdSkills, resumeSkills) {
  console.log("🛠️ Tool: calculateATS");
  const matchedSkills = resumeSkills.filter(skill => jdSkills.includes(skill));
  const missingSkills = jdSkills.filter(skill => !resumeSkills.includes(skill));
  const atsScore =
    jdSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / jdSkills.length) * 100);

  return { matchedSkills, missingSkills, atsScore };
}

// AI Agent endpoint
app.post("/run-agent", async (req, res) => {
  try {
    const { resume, jd } = req.body;

    // Input validation
    if (!resume || !jd || resume.trim() === "" || jd.trim() === "") {
      return res.status(400).json({
        error: "Resume and Job Description are required."
      });
    }

    // -------- AGENT PLANNING --------
    let agentPlan = [];

    if (process.env.OPENAI_API_KEY) {
      console.log("🧠 Agent planning using OpenAI");
      agentPlan = await generateAgentPlan(resume, jd);
    } else {
      console.log("⚠️ OpenAI key missing — using fallback plan");
      agentPlan = [
        "Analyze resume and job description",
        "Extract relevant skills",
        "Calculate ATS score",
        "Identify missing skills"
      ];
    }

    const agentSteps = [];

    // -------- AGENT EXECUTION --------
    agentSteps.push("Extracting skills from job description");
    const jdSkills = extractSkillsTool(jd);

    agentSteps.push("Extracting skills from resume");
    const resumeSkills = extractSkillsTool(resume);

    agentSteps.push("Matching skills and calculating ATS score");
    const { matchedSkills, missingSkills, atsScore } =
      calculateATSTool(jdSkills, resumeSkills);

    agentSteps.push("Returning structured agent output");

    // -------- RESPONSE --------
    res.json({
      agentPlan,
      agentSteps,
      atsScore,
      matchedSkills,
      missingSkills
    });

  } catch (error) {
    console.error("❌ Agent execution failed:", error.message);
    res.status(500).json({
      error: "Agent execution failed",
      message: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Agent running on port ${PORT}`);
});
