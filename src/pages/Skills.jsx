import PageShell from "../components/PageShell";
import HalftoneBackground from "../components/HalftoneBackground";

const skillSections = [
  {
    title: "AI & ML",
    skills: ["OpenAI API", "LLM Prompt Engineering", "RAG Pipelines", "Vector Search", "Pandas", "NumPy"],
    description: "Building AI-powered product features, retrieval workflows, and practical ML-assisted tools from prototyping to deployment.",
  },
  { title: "Programming Languages", skills: ["TypeScript", "JavaScript", "Python", "Java", "C", "C++"], description: null },
  { title: "Frontend", skills: ["React", "Next.js", "TypeScript", "HTML / CSS"], description: "Building responsive user interfaces, reusable component systems, and client/server-rendered applications." },
  { title: "Backend & APIs", skills: ["Node.js", "Flask", "FastAPI", "REST APIs", "Supabase"], description: "Designing backend services, building ingestion pipelines, creating APIs, handling ETL workflows, and writing clean, testable code." },
  { title: "Data & Analytics", skills: ["PostgreSQL", "SQL", "Pandas", "NumPy"], description: "Working with large datasets, building analytics pipelines, and supporting ML-driven workflows." },
  { title: "Infrastructure & Databases", skills: ["AWS (S3)", "Supabase", "PostgreSQL", "Vercel"], description: "Building ingestion pipelines, managing data storage, and supporting reproducible processing workflows." },
  { title: "Engineering Practices", skills: ["Git", "Linux", "CI/CD"], description: "Writing and reviewing pull requests, collaborating in multi-developer codebases, documenting systems, debugging production issues, and prioritizing reliability and maintainability." },
];

export default function Skills() {
  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black p-3 sm:p-4 md:p-6 lg:p-8 min-w-0">
        <div className="max-w-[1600px] mx-auto w-full">
          {/* Big expressive hero */}
          <div className="relative rounded-2xl overflow-hidden border border-black/10 shadow-xl mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f472b6] via-[#e879f9] to-[#fb923c]" />
            <div className="absolute inset-0 opacity-80">
              <HalftoneBackground width={1400} height={450} dotSpacing={11} baseRadius={0.12} maxRadius={1.6} bgColor="transparent" dotColor="#111827" dotOpacity={0.12} />
            </div>
            <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-10">
              <p className="text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase text-black/70 mb-2">Toolkit</p>
              <h1 className="jersey-25-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.85] text-black">
                Skills
              </h1>
              <p className="mt-2 inline-flex text-xs sm:text-sm text-black/85 px-2.5 py-1 bg-white/75 border border-black/10 rounded-full">
                What I use
              </p>
            </div>
          </div>

          {/* Dynamic collage cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
            {skillSections.map((section, i) => {
              const palettes = [
                "from-[#fdf2f8] via-[#f9a8d4] to-[#f472b6]",
                "from-[#f3e8ff] via-[#e879f9] to-[#c084fc]",
                "from-[#ffe4e6] via-[#fda4af] to-[#fb7185]",
                "from-[#ffedd5] via-[#fdba74] to-[#fb923c]",
                "from-[#fae8ff] via-[#d8b4fe] to-[#c084fc]",
                "from-[#fce7f3] via-[#f9a8d4] to-[#fb923c]",
              ];
              const rotate = i % 2 === 0 ? "rotate-[-0.6deg]" : "rotate-[0.6deg]";
              return (
                <div
                  key={i}
                  className={`relative rounded-2xl overflow-hidden border border-black/10 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01] ${rotate} hover:rotate-0`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${palettes[i % palettes.length]}`} />
                  <div className="absolute inset-0 opacity-65">
                    <HalftoneBackground width={900} height={420} dotSpacing={10} baseRadius={0.12} maxRadius={1.45} bgColor="transparent" dotColor="#111827" dotOpacity={0.1} />
                  </div>
                  <div className="relative z-10 p-4 sm:p-5 md:p-6">
                    <h2 className="jersey-25-heading text-black text-2xl sm:text-3xl md:text-4xl leading-[0.9] mb-3">
                      {section.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {section.skills.map((skill, j) => (
                        <span
                          key={j}
                          className="text-black/90 text-xs md:text-sm border border-black/15 px-2.5 py-1 rounded-full bg-white/70 backdrop-blur-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    {section.description && (
                      <p className="text-black/85 text-sm md:text-base leading-relaxed">
                        {section.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-black/10 shadow-lg min-w-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#fdf2f8] via-[#e879f9] to-[#fb923c]" />
            <div className="absolute inset-0 opacity-60">
              <HalftoneBackground width={1200} height={300} dotSpacing={11} baseRadius={0.11} maxRadius={1.4} bgColor="transparent" dotColor="#111827" dotOpacity={0.1} />
            </div>
            <div className="relative z-10 p-4 sm:p-6 md:p-8">
              <h2 className="jersey-25-heading text-black text-3xl sm:text-4xl md:text-5xl leading-[0.9] mb-2 sm:mb-3">
                How I Work
              </h2>
              <p className="text-black/90 text-sm md:text-base leading-relaxed max-w-4xl">
                I enjoy owning problems end-to-end, learning unfamiliar systems quickly, and turning complex ideas into reliable software. I care deeply about code quality, performance, and user experience, and I'm comfortable stepping into uncomfortable technical territory to learn and deliver impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
