import React, { useState } from 'react';
import './App.css';

function App() {
  const [goal, setGoal] = useState('');

  const planningSteps = [
    'Parse resume',
    'Analyze job description',
    'Match skills',
    'Calculate ATS score',
    'Rewrite resume bullets',
    'Generate cover letter'
  ];

  return (
    <div className="app">
      <header className="header">
        <h1>Job-Application Agent</h1>
        <p>AI agent that autonomously plans and optimizes resumes for ATS</p>
      </header>

      <div className="card">
        <h2>Goal Input</h2>
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Optimize my resume for the given job description"
          rows="4"
        />
      </div>

      <div className="card">
        <h2>Agent Planning</h2>
        <ol>
          {planningSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default App;
