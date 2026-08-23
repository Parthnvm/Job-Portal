export const initialNotifications = [
  {
    id: "notif-1",
    title: "AI Job Recommendation",
    message: "Nexus Technologies matched 94% with your profile for Full Stack MERN Developer.",
    time: "10 mins ago",
    type: "job",
    unread: true
  },
  {
    id: "notif-2",
    title: "ATS Score Update",
    message: "Your resume score increased to 82/100 after adding project descriptions.",
    time: "2 hours ago",
    type: "resume",
    unread: true
  },
  {
    id: "notif-3",
    title: "Mock Interview Complete",
    message: "You scored 8.4/10 on Full Stack technical questions. View detailed AI feedback.",
    time: "Yesterday",
    type: "interview",
    unread: false
  },
  {
    id: "notif-4",
    title: "Skill Gap Alert",
    message: "Docker & AWS identified as high-demand missing skills for target SDE roles.",
    time: "2 days ago",
    type: "skill",
    unread: false
  }
];

export const mockRecruiterApplicants = [
  {
    id: "app-201",
    candidateName: "Priya Sharma",
    email: "priya.sharma@example.com",
    roleApplied: "Full Stack MERN Developer",
    aiMatch: 95,
    atsScore: 91,
    skills: ["React.js", "Node.js", "MongoDB", "Express", "TypeScript"],
    experience: "1.5 Years",
    status: "Shortlisted",
    appliedDate: "2026-08-18"
  },
  {
    id: "app-202",
    candidateName: "Aman Verma",
    email: "aman.v@example.com",
    roleApplied: "Full Stack MERN Developer",
    aiMatch: 88,
    atsScore: 84,
    skills: ["React.js", "JavaScript", "Tailwind CSS", "REST APIs"],
    experience: "Fresher (2025)",
    status: "Applied",
    appliedDate: "2026-08-19"
  },
  {
    id: "app-203",
    candidateName: "Rohan Gupta",
    email: "rohan.g@example.com",
    roleApplied: "AI & Frontend Systems Engineer",
    aiMatch: 91,
    atsScore: 89,
    skills: ["React.js", "Next.js", "Python", "LangChain"],
    experience: "1 Year",
    status: "Screening",
    appliedDate: "2026-08-17"
  }
];
