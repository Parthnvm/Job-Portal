// Realistic AI Simulation helper for CareerAI

export const generateAIResumeImprovement = (sectionName, textContent) => {
  if (!textContent || textContent.trim().length === 0) {
    return "Developed scalable MERN stack components, optimized API latency by 30%, and automated build workflows using GitHub Actions.";
  }

  const actionVerbs = ["Architected", "Engineered", "Optimized", "Spearheaded", "Accelerated", "Orchestrated"];
  const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
  
  return `${randomVerb} ${textContent.toLowerCase().replace(/^(i\s+was\s+responsible\s+for|i\s+worked\s+on|i\s+did)/i, '')} — resulting in a 35% improvement in application responsiveness, high test coverage, and strict ATS keyword compliance.`;
};

export const generateAIInterviewFeedback = (question, userAnswer, category) => {
  const wordCount = userAnswer ? userAnswer.trim().split(/\s+/).length : 0;
  
  let techScore = Math.min(9.5, Math.max(6.0, (wordCount / 12) + (Math.random() * 1.5))).toFixed(1);
  let commScore = Math.min(9.2, Math.max(6.5, (wordCount / 15) + (Math.random() * 1.2))).toFixed(1);
  let compScore = Math.min(9.4, Math.max(5.8, (wordCount / 10) + (Math.random() * 1.8))).toFixed(1);
  let overallScore = ((parseFloat(techScore) + parseFloat(commScore) + parseFloat(compScore)) / 3).toFixed(1);

  return {
    overallScore,
    technicalAccuracy: techScore,
    communication: commScore,
    completeness: compScore,
    confidence: (parseFloat(commScore) + 0.3).toFixed(1),
    whatYouDidWell: [
      "Good structure addressing the core concept directly.",
      "Clear explanation of underlying technical mechanics and trade-offs.",
      "Effective use of domain terminology."
    ],
    whereToImprove: [
      wordCount < 25 ? "Provide a more comprehensive breakdown with a real-world project example." : "Include edge cases and potential performance bottlenecks.",
      "Use the STAR method (Situation, Task, Action, Result) for behavioral answers."
    ],
    suggestedAnswerStructure: "1. Brief Definition -> 2. Technical Mechanics (How it works under the hood) -> 3. Practical Example -> 4. Performance / Security considerations.",
    followUpQuestion: "How would you handle this if scale grew to 100,000 concurrent requests per minute?"
  };
};

export const generateAIChatResponse = (userPrompt, contextData = {}) => {
  const query = userPrompt.toLowerCase();

  if (query.includes("job") || query.includes("recommend")) {
    return "Based on your MERN stack skills and 82/100 ATS resume score, I strongly recommend applying for **Full Stack MERN Developer at Nexus Technologies** (94% match) and **AI & Frontend Engineer at CognitiveAI Labs** (90% match). Would you like me to tailor your resume for either of these?";
  }
  
  if (query.includes("resume") || query.includes("ats")) {
    return "Your current ATS score is **82/100**. To push it above **90/100**, add missing high-demand keywords: **Docker**, **AWS S3**, and **GraphQL**. You can use our **Resume Builder** to automatically add AI-enhanced bullet points.";
  }

  if (query.includes("interview") || query.includes("prepare")) {
    return "I recommend starting a 5-question **AI Mock Technical Interview** on React Virtual DOM & Node.js Event Loop. Your interview readiness is currently **74%**. Practicing today will boost your score!";
  }

  if (query.includes("skill") || query.includes("roadmap")) {
    return "Your biggest skill gaps for target Software Engineer roles are **Docker containerization** (25% proficiency) and **AWS cloud infrastructure** (35% proficiency). I have updated your personalized **Career Roadmap** with Phase 5 modules to bridge these gaps.";
  }

  return `Great question regarding "${userPrompt}"! CareerAI's neural engine analyzes real tech market requirements. To maximize your hiring chances: 1) Keep your ATS score above 85%, 2) Practice 2 mock interviews per week, and 3) Keep your project portfolio updated in your profile.`;
};
