import { useState } from "react";

export default function App() {
  const [result, setResult] = useState(null);

  const runAgent = async () => {
    const res = await fetch("http://localhost:5000/run-agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume: "I have experience in React and JavaScript",
        jd: "Looking for a React Node MongoDB developer"
      })
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px",
        fontFamily: "sans-serif"
      }}
    >
      <h1>Job-Application Agent</h1>
      <p>ATS-aware AI agent for resume optimization</p>

      <button
        onClick={runAgent}
        style={{
          marginTop: "20px",
          padding: "10px 16px",
          background: "#10b981",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Run Agent
      </button>

      {result && (
        <div
          style={{
            marginTop: "30px",
            background: "#020617",
            padding: "20px",
            borderRadius: "10px"
          }}
        >
          <h3>ATS Score: {result.atsScore}%</h3>

          <p>
            <b>Matched Skills:</b>{" "}
            {result.matchedSkills.length > 0
              ? result.matchedSkills.join(", ")
              : "None"}
          </p>

          <p>
            <b>Missing Skills:</b>{" "}
            {result.missingSkills.length > 0
              ? result.missingSkills.join(", ")
              : "None"}
          </p>

          <h4>Agent Steps</h4>
          <ul>
            {result.agentSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
