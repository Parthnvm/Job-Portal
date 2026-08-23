export const interviewCategories = [
  { id: "technical", name: "Technical Interview", icon: "Code", count: 24, recommended: true },
  { id: "hr", name: "HR & Culture Fit", icon: "Users", count: 18, recommended: false },
  { id: "behavioral", name: "Behavioral (STAR Method)", icon: "BrainCircuit", count: 15, recommended: true },
  { id: "system-design", name: "System Design & Architecture", icon: "Layers", count: 12, recommended: false },
  { id: "coding", name: "Live Coding & Algorithms", icon: "Terminal", count: 20, recommended: false }
];

export const interviewQuestions = [
  {
    id: "q-1",
    category: "technical",
    role: "Full Stack / React Developer",
    difficulty: "Medium",
    question: "Explain the difference between Virtual DOM and Real DOM in React, and how reconciliation works under the hood.",
    keyPoints: [
      "Virtual DOM is an in-memory lightweight JS representation of real DOM elements.",
      "React uses diffing algorithm (reconciliation) to compare old and new Virtual DOM state.",
      "Only batch-updated changes are rendered into the real DOM, minimizing costly browser reflows."
    ],
    sampleAnswer: "Virtual DOM is a lightweight copy of the physical DOM tree maintained in memory by React. When component state changes, React creates a new Virtual DOM tree, compares it with the previous snapshot using its diffing algorithm (reconciliation), and updates only the modified nodes in the real browser DOM. This drastically minimizes expensive browser repaint and reflow operations."
  },
  {
    id: "q-2",
    category: "technical",
    role: "Full Stack / Node Developer",
    difficulty: "Medium",
    question: "How does the Node.js Event Loop work? Describe phases like Timers, Poll, and Check.",
    keyPoints: [
      "Node.js uses single-threaded event-driven architecture powered by Libuv.",
      "Main phases: Timers (setTimeout), Pending Callbacks, Poll (I/O execution), Check (setImmediate), and Close callbacks.",
      "Non-blocking I/O delegates long operations to the system thread pool."
    ],
    sampleAnswer: "Node.js runs on a single thread using the Libuv event loop. It delegates async I/O operations (like file reads or DB queries) to kernel operations or worker threads. The event loop passes through sequential phases: Timers (executes setTimeout/setInterval callbacks), Poll (retrieves new I/O events), Check (executes setImmediate callbacks), and Close callbacks. Microtasks like Promise callbacks run immediately after each phase."
  },
  {
    id: "q-3",
    category: "behavioral",
    role: "Software Engineer",
    difficulty: "Medium",
    question: "Describe a situation where you encountered a major bug right before a production deadline. How did you handle it?",
    keyPoints: [
      "STAR framework: Situation, Task, Action, Result.",
      "Prioritizing root cause analysis under pressure.",
      "Transparent communication with team members and deployment rollback/fix strategy."
    ],
    sampleAnswer: "Situation: During final testing for our team hackathon project, a database memory leak caused server crashes under simulated concurrent users. Task: I needed to diagnose and patch the leak within 2 hours before submission. Action: I used Chrome DevTools and Node heap profiling to isolate an unclosed database cursor. Result: We patched the leak, reducing latency by 45% and winning 1st place."
  },
  {
    id: "q-4",
    category: "hr",
    role: "General",
    difficulty: "Easy",
    question: "Why do you want to join our engineering team, and where do you see yourself in 3 years?",
    keyPoints: [
      "Aligning personal engineering interests with company vision.",
      "Focus on growth, technical ownership, and mentorship.",
      "Demonstrating enthusiasm for learning and continuous improvement."
    ],
    sampleAnswer: "I am inspired by your company's mission to build high-scale, accessible developer tools. In 3 years, I see myself growing into a Senior Full Stack Engineer who leads core feature modules, mentors junior engineers, and contributes to key architectural decisions."
  },
  {
    id: "q-5",
    category: "system-design",
    role: "Full Stack Engineer",
    difficulty: "Hard",
    question: "How would you design a rate limiter for a public API to prevent abuse?",
    keyPoints: [
      "Algorithms: Token Bucket, Leaky Bucket, Fixed Window, Sliding Window Log.",
      "Using Redis memory store for low latency atomic counters (INCR/EXPIRE).",
      "Handling HTTP 429 Too Many Requests response headers."
    ],
    sampleAnswer: "I would implement a Token Bucket algorithm using Redis as an in-memory cache layer. When an API request arrives, middleware checks the user's IP/API key bucket in Redis. If tokens remain, it decrements the counter and permits the request; otherwise, it returns HTTP 429 status with a Retry-After header."
  }
];

export const mockInterviewHistory = [
  {
    id: "int-101",
    role: "Full Stack Engineer",
    date: "Yesterday, 4:30 PM",
    totalQuestions: 5,
    score: 84,
    technicalScore: 86,
    communicationScore: 80,
    problemSolvingScore: 88,
    confidenceScore: 82,
    feedback: "Excellent technical depth on React Virtual DOM and async Node.js concepts. Focus on pacing behavioral answers using the STAR method for even higher impact.",
    weakAreas: ["System Design", "Pacing"],
    strongAreas: ["React Hooks", "REST API Design", "Node.js Event Loop"]
  },
  {
    id: "int-100",
    role: "Frontend Developer",
    date: "3 days ago",
    totalQuestions: 4,
    score: 78,
    technicalScore: 80,
    communicationScore: 75,
    problemSolvingScore: 78,
    confidenceScore: 79,
    feedback: "Good grasp of UI state management. Practicing voice recording will help improve verbal confidence.",
    weakAreas: ["Web Vitals", "CSS Grid Layouts"],
    strongAreas: ["State Management", "Component Design"]
  }
];
