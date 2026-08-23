export const roleSkillsData = {
  "Software Engineer": {
    roleTitle: "Software Engineer",
    overallMatch: 76,
    readinessScore: 78,
    skillGapScore: 68,
    categories: [
      {
        name: "Frontend",
        skills: [
          { name: "React.js", current: 90, required: 90, status: "matched", demand: "High" },
          { name: "JavaScript / ES6+", current: 95, required: 90, status: "matched", demand: "High" },
          { name: "TypeScript", current: 40, required: 80, status: "gap", demand: "High" },
          { name: "Tailwind CSS", current: 90, required: 85, status: "matched", demand: "Medium" }
        ]
      },
      {
        name: "Backend",
        skills: [
          { name: "Node.js", current: 80, required: 85, status: "matched", demand: "High" },
          { name: "Express.js", current: 85, required: 80, status: "matched", demand: "High" },
          { name: "RESTful APIs", current: 85, required: 90, status: "matched", demand: "High" },
          { name: "GraphQL", current: 20, required: 70, status: "gap", demand: "Medium" }
        ]
      },
      {
        name: "Databases",
        skills: [
          { name: "MongoDB", current: 80, required: 75, status: "matched", demand: "High" },
          { name: "PostgreSQL / SQL", current: 50, required: 80, status: "gap", demand: "High" },
          { name: "Redis", current: 30, required: 70, status: "gap", demand: "Medium" }
        ]
      },
      {
        name: "DevOps & Tools",
        skills: [
          { name: "Git & Version Control", current: 85, required: 85, status: "matched", demand: "High" },
          { name: "Docker", current: 25, required: 75, status: "gap", demand: "High" },
          { name: "AWS Cloud Basics", current: 35, required: 70, status: "gap", demand: "High" },
          { name: "CI/CD Pipelines", current: 30, required: 75, status: "gap", demand: "Medium" }
        ]
      },
      {
        name: "Soft Skills",
        skills: [
          { name: "Problem Solving", current: 85, required: 90, status: "matched", demand: "High" },
          { name: "System Design Concepts", current: 55, required: 80, status: "gap", demand: "High" },
          { name: "Technical Communication", current: 80, required: 85, status: "matched", demand: "High" }
        ]
      }
    ]
  },
  "Frontend Developer": {
    roleTitle: "Frontend Developer",
    overallMatch: 90,
    readinessScore: 88,
    skillGapScore: 82,
    categories: [
      {
        name: "Core Web",
        skills: [
          { name: "React.js", current: 95, required: 90, status: "matched", demand: "High" },
          { name: "Next.js", current: 60, required: 85, status: "gap", demand: "High" },
          { name: "CSS3 & Tailwind", current: 90, required: 85, status: "matched", demand: "High" },
          { name: "Web Performance", current: 70, required: 80, status: "gap", demand: "Medium" }
        ]
      }
    ]
  },
  "AI & ML Engineer": {
    roleTitle: "AI & ML Engineer",
    overallMatch: 62,
    readinessScore: 60,
    skillGapScore: 50,
    categories: [
      {
        name: "AI Core",
        skills: [
          { name: "Python", current: 70, required: 95, status: "gap", demand: "High" },
          { name: "PyTorch / TensorFlow", current: 30, required: 85, status: "gap", demand: "High" },
          { name: "LLM Prompting & API Integration", current: 75, required: 80, status: "matched", demand: "High" }
        ]
      }
    ]
  }
};
