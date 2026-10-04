const KNOWN_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", ".NET", "PHP", "Ruby", "Go", "Rust", "Swift", "Kotlin",
  "React", "React.js", "React Native", "Angular", "Vue", "Vue.js", "Next.js", "Node.js", "Express", "Django", "Flask",
  "FastAPI", "Spring Boot", "Laravel", "HTML", "CSS", "Tailwind CSS", "Bootstrap", "Redux",
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra", "Oracle",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Git", "GitHub", "Linux", "Terraform",
  "REST API", "GraphQL", "Microservices", "Kafka", "RabbitMQ", "Machine Learning", "Deep Learning",
  "Data Science", "Pandas", "NumPy", "TensorFlow", "PyTorch", "NLP", "Computer Vision"
];

/** Extracts technical skills from text using word boundaries. */
export function extractSkills(text = "") {
  if (!text || typeof text !== "string") return [];
  const found = new Set();

  for (const skill of KNOWN_SKILLS) {
    // Word boundary matching
    const regex = new RegExp(`\\b${escapeRegExp(skill)}\\b`, "i");
    if (regex.test(text)) {
      found.add(skill);
    }
  }

  return Array.from(found);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
