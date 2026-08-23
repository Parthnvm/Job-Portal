export const defaultResumeData = {
  personalInfo: {
    fullName: "Sumit Kumar",
    title: "Full Stack Engineer & Tech Graduate",
    email: "sumit.kumar@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, Karnataka, India",
    linkedin: "linkedin.com/in/sumitkumar-tech",
    github: "github.com/sumitkumar-dev",
    portfolio: "sumitkumar.dev",
    summary: "Motivated Computer Science graduate with hands-on experience in building scalable MERN stack web applications, RESTful APIs, and modern React interfaces. Passionate about AI integrations, clean code, and building high-performance web products."
  },
  education: [
    {
      id: "edu-1",
      institution: "National Institute of Technology (NIT)",
      degree: "B.Tech in Computer Science & Engineering",
      startDate: "2021",
      endDate: "2025",
      score: "CGPA: 8.7 / 10",
      description: "Core Coursework: Data Structures, Algorithms, Database Management Systems, Web Engineering, Operating Systems."
    }
  ],
  skills: [
    { name: "React.js", level: "Expert", category: "Frontend" },
    { name: "JavaScript (ES6+)", level: "Expert", category: "Languages" },
    { name: "Node.js", level: "Intermediate", category: "Backend" },
    { name: "Express.js", level: "Intermediate", category: "Backend" },
    { name: "MongoDB", level: "Intermediate", category: "Database" },
    { name: "Tailwind CSS", level: "Expert", category: "Frontend" },
    { name: "HTML5 / CSS3", level: "Expert", category: "Frontend" },
    { name: "Git & GitHub", level: "Intermediate", category: "Tools" },
    { name: "REST APIs", level: "Intermediate", category: "Backend" },
    { name: "TypeScript", level: "Beginner", category: "Languages" }
  ],
  experience: [
    {
      id: "exp-1",
      company: "TechNova Solutions",
      role: "Frontend Developer Intern",
      startDate: "Jun 2024",
      endDate: "Nov 2024",
      location: "Bengaluru (Hybrid)",
      description: [
        "Developed 12+ responsive UI components using React.js and Tailwind CSS, improving load speed by 25%.",
        "Integrated client-side REST API calls with Axios and optimized Redux state updates.",
        "Collaborated with UX designers to convert Figma prototypes into production code."
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "CareerAI — Job Portal & Preparation Platform",
      tech: "React.js, Node.js, Express, MongoDB, Tailwind CSS, Framer Motion",
      link: "github.com/sumit/career-ai",
      description: [
        "Architected an end-to-end AI career intelligence portal featuring ATS resume analysis, skill gap tracking, and AI mock interview simulations.",
        "Implemented custom algorithm for ATS match scoring and skill gap visualization using Recharts."
      ]
    },
    {
      id: "proj-2",
      title: "E-Commerce Microservices Engine",
      tech: "Node.js, Express, MongoDB, Redis, Docker",
      link: "github.com/sumit/ecommerce-backend",
      description: [
        "Built JWT authenticated user authentication and payment gateway webhook handling.",
        "Used Redis for session caching, decreasing database latency by 40%."
      ]
    }
  ],
  certifications: [
    { id: "cert-1", title: "Meta Front-End Developer Professional Certificate", issuer: "Coursera / Meta", year: "2024" },
    { id: "cert-2", title: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", year: "2024" }
  ],
  achievements: [
    "Winner - HackNIT 2024 (1st place among 85 participating engineering teams).",
    "Solved 350+ DSA problems on LeetCode & HackerRank."
  ]
};

export const defaultAnalysisResult = {
  overallScore: 82,
  atsScore: 88,
  contentScore: 79,
  skillsScore: 84,
  experienceScore: 80,
  formattingScore: 90,
  strengths: [
    "Clean single-column layout optimized for ATS parsers.",
    "Strong technical skill alignment with high-demand MERN roles.",
    "Measurable metrics provided in project descriptions (e.g., 'improved load speed by 25%').",
    "Clear contact details and GitHub/LinkedIn profile links."
  ],
  weaknesses: [
    "Lacks mentions of containerization tools like Docker and Cloud DevOps.",
    "Professional summary could include a stronger quantified value statement.",
    "No unit testing frameworks (Jest/RTL) explicitly listed under skills."
  ],
  missingKeywords: [
    "Docker", "AWS S3", "CI/CD Pipelines", "Jest", "Microservices", "System Design", "GraphQL"
  ],
  actionableSuggestions: [
    "Add Docker and basic AWS cloud deployment experience under technical skills.",
    "Include specific metrics for project performance (e.g., latency, user load, test coverage).",
    "Tailor the professional summary to match target role keywords in target job descriptions."
  ],
  grammarChecks: [
    { issue: "Capitalization consistency", line: "JavaScript (ES6+)", suggestion: "Maintain standardized technical spelling across all bullet points." }
  ],
  skillsDetected: [
    "React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "Tailwind CSS", "Git", "REST APIs", "TypeScript"
  ]
};
