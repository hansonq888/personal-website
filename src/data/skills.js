// Shared by the long-scroll sheet and the standalone Skills page.
//
// Every entry comes word for word from the TECHNICAL SKILLS block of the
// resume, split into finer groups than its three, with nothing added or dropped:
//   Languages              -> Languages
//   Frameworks & Fullstack -> Frontend, Backend, Data, AI
//   Cloud & Infrastructure -> Cloud & DevOps
export const skillSections = [
  {
    title: "Languages",
    skills: ["Python", "Java", "C/C++ (C++20)", "TypeScript", "JavaScript", "SQL", "R", "Bash", "HTML/CSS"],
    description: null,
  },
  {
    title: "Frontend",
    skills: ["React", "Next.js", "React Native", "Expo", "three.js"],
    description: null,
  },
  {
    title: "Backend",
    skills: ["Node.js", "FastAPI", "WebSockets", "OAuth 2.0/PKCE"],
    description: null,
  },
  {
    title: "Data",
    skills: ["PostgreSQL", "Supabase", "SQLite"],
    description: null,
  },
  {
    title: "AI",
    skills: ["LLMs/RAG", "Microsoft Foundry", "Microsoft Agent Framework"],
    description: null,
  },
  {
    title: "Cloud & DevOps",
    skills: ["Azure (Container Apps, Event Hubs, Web PubSub, Cosmos DB)", "AWS (S3, SQS)", "Docker", "Linux", "CI/CD", "Git"],
    description: null,
  },
];

export default skillSections;
