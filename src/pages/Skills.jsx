import PageShell from "../components/PageShell";

const skillSections = [
  {
    title: "Languages",
    skills: ["Python", "TypeScript", "JavaScript", "SQL", "Java", "C / C++", "HTML / CSS"],
    description: null,
  },
  {
    title: "Frontend",
    skills: ["React", "React Native", "Next.js", "Expo", "Tailwind CSS"],
    description: "Building responsive web and mobile interfaces and reusable component systems.",
  },
  {
    title: "Backend & APIs",
    skills: ["Node.js", "FastAPI", "Flask", "REST APIs", "OAuth 2.0 / OIDC"],
    description: "Designing backend services, REST APIs, authentication flows, and ingestion pipelines.",
  },
  {
    title: "Data & Analytics",
    skills: ["PostgreSQL", "Pandas", "NumPy", "NetworkX", "D3", "Recharts"],
    description: "Working with relational data, analytics pipelines, and data visualization.",
  },
  {
    title: "AI & ML",
    skills: ["OpenAI API", "LLM Prompt Engineering", "RAG Pipelines", "Vector Search"],
    description: "Building AI-powered product features, retrieval workflows, and practical ML-assisted tools.",
  },
  {
    title: "Infrastructure",
    skills: ["Docker", "AWS (S3, ECS, SQS)", "CI/CD (GitHub Actions, EAS)", "Supabase", "Vercel"],
    description: "Containerized services, cloud storage and queues, and automated build and deploy pipelines.",
  },
  {
    title: "Engineering",
    skills: ["Git", "Linux", "Sentry", "PostHog"],
    description: "Reviewing pull requests, collaborating in multi-developer codebases, and monitoring production.",
  },
];


export default function Skills() {
  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black px-4 sm:px-8 md:px-12 pt-12 md:pt-16 pb-20 md:pb-28 min-w-0 overflow-x-hidden">
        <div className="relative w-full max-w-6xl mx-auto">
          <div className="flex items-end gap-10 sm:gap-16 md:gap-24 flex-wrap">
            <h1
              className="leading-[0.9] tracking-tight"
              style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: "clamp(2.75rem, 12vw, 10rem)" }}
            >
              Skills
            </h1>
            <img
              src="/swimming_fish.gif"
              alt=""
              className="w-[150px] sm:w-[190px] md:w-[240px] h-auto block select-none pointer-events-none mb-4 md:mb-8"
            />
          </div>

          <div className="mt-10 md:mt-14 flex flex-col">
            {skillSections.map((section, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-12 gap-y-3 gap-x-6 lg:gap-x-10 items-start border-t border-black/15 py-7 md:py-9 last:border-b last:border-black/15"
              >
                <h2
                  className="md:col-span-3 uppercase md:pt-1"
                  style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: "clamp(1.1rem, 2vw, 1.4rem)", letterSpacing: "0.02em" }}
                >
                  {section.title}
                </h2>

                <div className="md:col-span-5 min-w-0 flex flex-wrap items-baseline gap-x-2 gap-y-1.5">
                  {section.skills.map((skill, j) => (
                    <span key={j} className="inline-flex items-baseline gap-2">
                      <span
                        className="text-[11px] sm:text-xs uppercase text-black/75"
                        style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500, letterSpacing: "0.08em" }}
                      >
                        {skill}
                      </span>
                      {j < section.skills.length - 1 && (
                        <span aria-hidden className="text-[11px] text-black/25">/</span>
                      )}
                    </span>
                  ))}
                </div>

                <div className="md:col-span-4 min-w-0">
                  {section.description && (
                    <p className="text-sm text-black/60 leading-relaxed" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}>
                      {section.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 md:mt-20 flex items-center justify-between gap-6">
            <div className="min-w-0">
              <p
                className="uppercase tracking-[0.22em] text-[11px] sm:text-xs text-black/50 mb-3"
                style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}
              >
                How I Work
              </p>
              <p className="text-base sm:text-lg text-black/70 leading-relaxed max-w-[62ch]" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}>
                I enjoy owning problems end-to-end, learning unfamiliar systems quickly, and turning complex ideas into reliable software. I care deeply about code quality, performance, and user experience, and I am comfortable stepping into uncomfortable technical territory to learn and deliver impact.
              </p>
            </div>
            <img
              src="/dotted_star_shining.gif"
              alt=""
              className="hidden sm:block w-[280px] md:w-[400px] h-auto select-none pointer-events-none flex-shrink-0 -my-12"
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
