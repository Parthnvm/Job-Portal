export const defaultRoadmaps = {
  "Full Stack Developer": {
    roleTitle: "Full Stack MERN Developer",
    estimatedTime: "6 Months",
    overallCompletion: 74,
    modules: [
      {
        id: "mod-1",
        title: "Phase 1: JavaScript & Web Core Mastery",
        status: "completed",
        progress: 100,
        topics: [
          { name: "ES6+ Modern Syntax, Promises & Async/Await", done: true },
          { name: "DOM Manipulation & Event Architecture", done: true },
          { name: "Functional Programming & Closures", done: true },
          { name: "Git Version Control & Collaboration", done: true }
        ]
      },
      {
        id: "mod-2",
        title: "Phase 2: React.js & Modern Frontend",
        status: "completed",
        progress: 100,
        topics: [
          { name: "React Components, Hooks & State Management", done: true },
          { name: "Tailwind CSS & Responsive Styling", done: true },
          { name: "React Router v7 Client-side Routing", done: true },
          { name: "Context API & Custom Hooks", done: true }
        ]
      },
      {
        id: "mod-3",
        title: "Phase 3: Backend Systems with Node & Express",
        status: "in-progress",
        progress: 85,
        topics: [
          { name: "Node.js Event Loop & Module System", done: true },
          { name: "Express.js RESTful API Architecture", done: true },
          { name: "JWT Authentication & Security Best Practices", done: true },
          { name: "Input Validation with Zod & Error Handling", done: false }
        ]
      },
      {
        id: "mod-4",
        title: "Phase 4: Database Engineering & MongoDB",
        status: "in-progress",
        progress: 60,
        topics: [
          { name: "MongoDB Atlas & Mongoose Schemas", done: true },
          { name: "Aggregation Pipelines & Data Indexing", done: true },
          { name: "PostgreSQL Relational DB Queries", done: false },
          { name: "Redis Caching Strategies", done: false }
        ]
      },
      {
        id: "mod-5",
        title: "Phase 5: DevOps, Docker & Cloud Deployment",
        status: "not-started",
        progress: 20,
        topics: [
          { name: "Docker Containerization of MERN Apps", done: true },
          { name: "AWS EC2, S3 & Nginx Reverse Proxy Setup", done: false },
          { name: "CI/CD Pipeline setup with GitHub Actions", done: false },
          { name: "Kubernetes Microservices Fundamentals", done: false }
        ]
      },
      {
        id: "mod-6",
        title: "Phase 6: System Design & AI Integration",
        status: "not-started",
        progress: 0,
        topics: [
          { name: "LLM API Integration & Vector Embeddings", done: false },
          { name: "Scalability, Load Balancing & Caching", done: false },
          { name: "System Design Mock Interviews", done: false }
        ]
      }
    ]
  }
};

export const mockRoadmapPhases = [
  {
    id: "phase-1",
    title: "Phase 1: Core Fundamentals & MERN Basics",
    description: "Master ES6+ JavaScript, React component state, Node.js event loop, and MongoDB CRUD.",
    estimatedDuration: "4 Weeks",
    status: "Completed",
    milestones: [
      { id: "m-1", title: "React Component State & Hooks", desc: "Build stateful interactive UIs using useState and useEffect.", status: "Completed", skills: ["React", "JavaScript", "JSX"] },
      { id: "m-2", title: "Express.js REST APIs", desc: "Design RESTful endpoints with proper middleware and JSON responses.", status: "Completed", skills: ["Node.js", "Express", "REST"] }
    ]
  },
  {
    id: "phase-2",
    title: "Phase 2: Database Schema Design & Auth",
    description: "Implement JWT authentication, password hashing, and Mongoose indexing.",
    estimatedDuration: "6 Weeks",
    status: "In Progress",
    milestones: [
      { id: "m-3", title: "JWT & Cookie Security", desc: "Protect API routes and refresh token rotation.", status: "Completed", skills: ["JWT", "Bcrypt", "Security"] },
      { id: "m-4", title: "MongoDB Aggregations", desc: "Write complex pipeline queries for analytics dashboards.", status: "In Progress", skills: ["MongoDB", "Aggregation"] }
    ]
  },
  {
    id: "phase-3",
    title: "Phase 3: Cloud & System Design",
    description: "Containerize apps with Docker and deploy to cloud platforms.",
    estimatedDuration: "8 Weeks",
    status: "Locked",
    milestones: [
      { id: "m-5", title: "Docker Multi-stage Builds", desc: "Package frontend & backend into optimized containers.", status: "Locked", skills: ["Docker", "Containers"] },
      { id: "m-6", title: "AWS Deployment & Nginx", desc: "Deploy with SSL certificates and custom domain names.", status: "Locked", skills: ["AWS", "Nginx", "DevOps"] }
    ]
  }
];

