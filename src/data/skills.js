// Shared by the long-scroll sheet and the standalone Skills page.
//
// Every entry here comes from the SKILLS block of the resume, split into finer
// groups than the resume uses but with nothing added and nothing dropped:
//   Languages & Frameworks -> Languages, Frontend, Runtime & Data
//   Backend & Systems      -> Storage, Platform
//   AI & Infrastructure    -> AI & Observability (plus Git/Linux/Vercel under Platform)
export const skillSections = [
  {
    title: "Languages",
    skills: ["Python", "TypeScript", "JavaScript", "SQL", "C / C++ (C++20)", "R"],
    description: null,
  },
  {
    title: "Frontend",
    skills: ["React", "React Native", "Next.js", "Expo"],
    description: "Building responsive web and mobile interfaces and reusable component systems.",
  },
  {
    title: "Runtime & Data",
    skills: ["Node.js", "WebAssembly (WASM/SIMD)", "Pandas", "NumPy", "scikit-learn"],
    description: "Compiling native work to run in the browser, and the analysis around it.",
  },
  {
    title: "Storage",
    skills: ["PostgreSQL", "SQLite", "IndexedDB", "Supabase"],
    description: "Relational data, offline-first stores, and the sync layers between them.",
  },
  {
    title: "Platform",
    skills: ["AWS (S3, SQS)", "Docker", "Vercel", "RESTful APIs", "OAuth 2.0 / PKCE", "Git", "Linux"],
    description: "Containerized services, cloud storage and queues, authentication, and deploys.",
  },
  {
    title: "AI & Observability",
    skills: ["LLMs", "Embeddings", "Retrieval Systems", "LangSmith", "SSE", "Sentry", "PostHog"],
    description: "AI-powered product features, and the monitoring that keeps them honest.",
  },
];

export default skillSections;
