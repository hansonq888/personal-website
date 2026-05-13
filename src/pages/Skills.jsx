import PageShell from "../components/PageShell";

const skillSections = [
  {
    title: "AI & ML",
    skills: ["OpenAI API", "LLM Prompt Engineering", "RAG Pipelines", "Vector Search", "Pandas", "NumPy"],
    description: "Building AI-powered product features, retrieval workflows, and practical ML-assisted tools from prototyping to deployment.",
  },
  {
    title: "Languages",
    skills: ["TypeScript", "JavaScript", "Python", "Java", "C", "C++"],
    description: null,
  },
  {
    title: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "HTML / CSS"],
    description: "Building responsive user interfaces, reusable component systems, and client/server-rendered applications.",
  },
  {
    title: "Backend & APIs",
    skills: ["Node.js", "Flask", "FastAPI", "REST APIs", "Supabase"],
    description: "Designing backend services, building ingestion pipelines, creating APIs, handling ETL workflows.",
  },
  {
    title: "Data & Analytics",
    skills: ["PostgreSQL", "SQL", "Pandas", "NumPy"],
    description: "Working with large datasets, building analytics pipelines, and supporting ML-driven workflows.",
  },
  {
    title: "Infrastructure",
    skills: ["AWS (S3)", "Supabase", "PostgreSQL", "Vercel"],
    description: "Managing data storage, building ingestion pipelines, and supporting reproducible processing workflows.",
  },
  {
    title: "Engineering",
    skills: ["Git", "Linux", "CI/CD"],
    description: "Writing and reviewing pull requests, collaborating in multi-developer codebases, debugging production issues.",
  },
];

export default function Skills() {
  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black px-4 sm:px-8 md:px-12 pt-12 md:pt-16 pb-20 md:pb-28 min-w-0 overflow-x-hidden">
        <div className="relative w-full max-w-6xl mx-auto">
          <h1
            className="leading-[0.9] tracking-tight"
            style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: "clamp(4rem, 11vw, 10rem)" }}
          >
            Skills
          </h1>
          <p
            className="mt-1 sm:mt-2 uppercase tracking-[0.22em] text-[11px] sm:text-xs text-black/55"
            style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}
          >
            What I use
          </p>

          <div className="mt-10 md:mt-12 flex flex-col gap-8 md:gap-10">
            {skillSections.map((section, i) => (
              <div key={i} className="pt-6 md:pt-7">
                <div className={`max-w-4xl ${i % 2 === 0 ? "" : "md:ml-auto"}`}>
                  <h2
                    className="uppercase"
                    style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: "clamp(1.25rem, 3vw, 2.2rem)", letterSpacing: "0.02em" }}
                  >
                    {section.title}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {section.skills.map((skill, j) => (
                      <span
                        key={j}
                        className="text-[11px] sm:text-xs uppercase px-0 py-0 text-black/75"
                        style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500, letterSpacing: "0.08em" }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  {section.description && (
                    <p className="mt-4 text-sm sm:text-base text-black/65 leading-relaxed max-w-[62ch]" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}>
                      {section.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 md:mt-20">
            <p
              className="uppercase tracking-[0.22em] text-[11px] sm:text-xs text-black/50 mb-3"
              style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}
            >
              How I Work
            </p>
            <p className="text-base sm:text-lg text-black/70 leading-relaxed max-w-4xl" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}>
              I enjoy owning problems end-to-end, learning unfamiliar systems quickly, and turning complex ideas into reliable software. I care deeply about code quality, performance, and user experience, and I am comfortable stepping into uncomfortable technical territory to learn and deliver impact.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
