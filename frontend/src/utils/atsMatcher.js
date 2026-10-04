/**
 * ATS Skills Matching Engine
 * Compares user skills (from Profile & AI Resume Analyzer)
 * against actual job requirements / description.
 */

export const KNOWN_TECH_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", ".NET", "PHP", "Ruby", "Go", "Rust", "Swift", "Kotlin", "Scala", "C",
  "React", "React Native", "Angular", "Vue", "Next.js", "Node.js", "Express", "Django", "Flask",
  "FastAPI", "Spring Boot", "Laravel", "HTML", "CSS", "Tailwind CSS", "Bootstrap", "Redux", "Storybook",
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra", "Oracle", "SQLite", "DynamoDB",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Git", "GitHub", "Linux", "Terraform",
  "REST API", "GraphQL", "Microservices", "Kafka", "RabbitMQ", "Machine Learning", "Deep Learning",
  "Data Science", "Pandas", "NumPy", "TensorFlow", "PyTorch", "NLP", "Computer Vision",
  "Tableau", "Power BI", "Excel", "Figma", "UI/UX", "Prototyping", "Interaction Design", "Lottie",
  "Agile", "Scrum", "Jira", "Unit Testing", "Jest", "Cypress", "Selenium", "Cybersecurity", "Zero Trust"
];

// Mapping of common variants to canonical skill terms
const SKILL_ALIASES = {
  "js": "javascript",
  "java script": "javascript",
  "javascript": "javascript",
  "ts": "typescript",
  "typescript": "typescript",
  "react": "react",
  "react.js": "react",
  "reactjs": "react",
  "react native": "react native",
  "react-native": "react native",
  "next": "next.js",
  "next.js": "next.js",
  "nextjs": "next.js",
  "node": "node.js",
  "node.js": "node.js",
  "nodejs": "node.js",
  "express": "express",
  "express.js": "express",
  "expressjs": "express",
  "vue": "vue",
  "vue.js": "vue",
  "vuejs": "vue",
  "angular": "angular",
  "angular.js": "angular",
  "angularjs": "angular",
  "postgres": "postgresql",
  "postgresql": "postgresql",
  "psql": "postgresql",
  "mongo": "mongodb",
  "mongodb": "mongodb",
  "tailwind": "tailwind css",
  "tailwindcss": "tailwind css",
  "tailwind css": "tailwind css",
  "golang": "go",
  "go": "go",
  "cpp": "c++",
  "c++": "c++",
  "csharp": "c#",
  "c#": "c#",
  "amazon web services": "aws",
  "aws": "aws",
  "google cloud": "gcp",
  "google cloud platform": "gcp",
  "gcp": "gcp",
  "microsoft azure": "azure",
  "azure": "azure",
  "k8s": "kubernetes",
  "kubernetes": "kubernetes",
  "docker": "docker",
  "containers": "docker",
  "containerization": "docker",
  "cicd": "ci/cd",
  "ci-cd": "ci/cd",
  "ci/cd": "ci/cd",
  "gql": "graphql",
  "graphql": "graphql",
  "rest": "rest api",
  "rest api": "rest api",
  "restful": "rest api",
  "restful api": "rest api",
  "html": "html",
  "html5": "html",
  "css": "css",
  "css3": "css",
  "py": "python",
  "python": "python"
};

/**
 * Normalizes a skill string to lowercase canonical key.
 */
export function normalizeSkill(skill = "") {
  if (!skill || typeof skill !== "string") return "";
  const cleaned = skill.trim().toLowerCase().replace(/[^\w\s+#.-]/g, "").replace(/\s+/g, " ");
  return SKILL_ALIASES[cleaned] || cleaned;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Extracts skills from raw text (title + description) using boundary matching.
 */
export function extractSkillsFromText(text = "") {
  if (!text || typeof text !== "string") return [];
  const found = new Set();

  for (const skill of KNOWN_TECH_SKILLS) {
    const escaped = escapeRegExp(skill);
    // Boundary match: handles C++, C#, .NET, Go safely
    const pattern = skill.includes("+") || skill.includes("#") || skill.startsWith(".")
      ? `(?:^|\\s)${escaped}(?:\\s|$|[.,;!])`
      : `\\b${escaped}\\b`;
    const regex = new RegExp(pattern, "i");
    if (regex.test(text)) {
      found.add(skill);
    }
  }

  return Array.from(found);
}

/**
 * Extracts required skills from a job object.
 * Priority: job.requirements -> job.skills -> job.tags -> extracted from description.
 */
export function extractJobSkills(job) {
  if (!job) return [];
  const skillsSet = new Set();

  const directSources = [
    job.requirements,
    job.skills,
    job.tags,
    job.requiredSkills,
  ];

  for (const src of directSources) {
    if (Array.isArray(src)) {
      src.forEach((s) => {
        if (typeof s === "string" && s.trim()) skillsSet.add(s.trim());
      });
    } else if (typeof src === "string" && src.trim()) {
      src.split(/[,;]/).forEach((s) => {
        if (s.trim()) skillsSet.add(s.trim());
      });
    }
  }

  // If no direct skills or fewer than 2 skills, extract from title and description
  if (skillsSet.size < 2) {
    const textToScan = `${job.title || ""} ${job.description || ""}`;
    const extracted = extractSkillsFromText(textToScan);
    extracted.forEach((s) => skillsSet.add(s));
  }

  return Array.from(skillsSet);
}

/**
 * Extracts combined user skills from profile and AI Resume Analysis.
 */
export function extractUserSkills(user = {}, resumeAnalysis = null) {
  const skillsSet = new Set();

  // 1. Profile skills
  const profileSkills = user?.profile?.skills;
  if (Array.isArray(profileSkills)) {
    profileSkills.forEach((s) => {
      if (typeof s === "string" && s.trim()) skillsSet.add(s.trim());
    });
  } else if (typeof profileSkills === "string" && profileSkills.trim()) {
    profileSkills.split(/[,;]/).forEach((s) => {
      if (s.trim()) skillsSet.add(s.trim());
    });
  }

  // 2. AI Resume Analysis skills inventory
  const analysisSkills = resumeAnalysis?.skills;
  if (analysisSkills && typeof analysisSkills === "object") {
    Object.values(analysisSkills).forEach((category) => {
      if (Array.isArray(category)) {
        category.forEach((item) => {
          const name = typeof item === "string" ? item : item?.name;
          if (typeof name === "string" && name.trim()) {
            skillsSet.add(name.trim());
          }
        });
      }
    });
  }

  return Array.from(skillsSet);
}

/**
 * Computes deterministic ATS skills match score and details.
 */
export function calculateATSScore(userSkills = [], jobSkills = [], hasResume = true) {
  if (!hasResume) {
    return {
      score: null,
      status: "no_resume",
      matched: [],
      missing: Array.isArray(jobSkills) ? jobSkills : [],
      totalRequired: Array.isArray(jobSkills) ? jobSkills.length : 0,
      totalMatched: 0,
      summaryMessage: "Upload a resume in My Profile to activate ATS skills matching against this job.",
    };
  }

  if (!Array.isArray(userSkills) || userSkills.length === 0) {
    return {
      score: null,
      status: "no_user_skills",
      matched: [],
      missing: jobSkills || [],
      totalRequired: jobSkills?.length || 0,
      totalMatched: 0,
      summaryMessage: "Add skills in My Profile or upload a resume to calculate your skills match.",
    };
  }

  if (!Array.isArray(jobSkills) || jobSkills.length === 0) {
    return {
      score: null,
      status: "no_job_requirements",
      matched: [],
      missing: [],
      totalRequired: 0,
      totalMatched: 0,
      summaryMessage: "Skills match unavailable because this job does not provide sufficient requirements.",
    };
  }

  // Build normalized user lookup map
  const normalizedUserSkills = new Map();
  for (const s of userSkills) {
    const norm = normalizeSkill(s);
    if (norm) normalizedUserSkills.set(norm, s);
  }

  const matched = [];
  const missing = [];

  for (const jobReq of jobSkills) {
    const normReq = normalizeSkill(jobReq);
    if (!normReq) continue;

    // Check exact normalized match
    let isMatch = normalizedUserSkills.has(normReq);

    // If not matched, check substring/word token containment
    if (!isMatch) {
      for (const [normUserSkill] of normalizedUserSkills.entries()) {
        if (
          normUserSkill === normReq ||
          (normReq.length > 3 && normUserSkill.includes(normReq)) ||
          (normUserSkill.length > 3 && normReq.includes(normUserSkill))
        ) {
          isMatch = true;
          break;
        }
      }
    }

    if (isMatch) {
      matched.push(jobReq);
    } else {
      missing.push(jobReq);
    }
  }

  const totalRequired = matched.length + missing.length;
  if (totalRequired === 0) {
    return {
      score: null,
      status: "no_job_requirements",
      matched: [],
      missing: [],
      totalRequired: 0,
      totalMatched: 0,
      summaryMessage: "Skills match unavailable because this job does not provide sufficient requirements.",
    };
  }

  const score = Math.round((matched.length / totalRequired) * 100);

  let status = "low_match";
  let summaryMessage = `Low match. ${missing.length} key required skill${missing.length > 1 ? "s are" : " is"} missing.`;

  if (score === 100 && missing.length === 0) {
    status = "full_match";
    summaryMessage = "✨ You have all the matching skills for this position!";
  } else if (score >= 70) {
    status = "high_match";
    summaryMessage = `Strong match! You meet ${matched.length} of ${totalRequired} required skills (${score}%).`;
  } else if (score >= 40) {
    status = "partial_match";
    summaryMessage = `Moderate match. You meet ${matched.length} of ${totalRequired} required skills (${score}%).`;
  }

  return {
    score,
    status,
    matched,
    missing,
    totalRequired,
    totalMatched: matched.length,
    summaryMessage,
  };
}
