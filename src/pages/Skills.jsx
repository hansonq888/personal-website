import PageShell from "../components/PageShell";
import HalftoneBackground from "../components/HalftoneBackground";

const skillSections = [
  { title: "Programming Languages", skills: ["TypeScript", "JavaScript", "Python", "Java", "C", "C++"], description: null },
  { title: "Frontend", skills: ["React", "Next.js", "TypeScript", "HTML / CSS"], description: "Building responsive user interfaces, reusable component systems, and client/server-rendered applications." },
  { title: "Backend & APIs", skills: ["Node.js", "Flask", "FastAPI", "REST APIs"], description: "Designing backend services, building ingestion pipelines, creating APIs, handling ETL workflows, and writing clean, testable code." },
  { title: "Data & Analytics", skills: ["Pandas", "NumPy"], description: "Working with large datasets, building analytics pipelines, and supporting ML-driven workflows." },
  { title: "Infrastructure & Databases", skills: ["AWS (S3)", "PostgreSQL", "SQL"], description: "Building ingestion pipelines, managing data storage, and supporting reproducible processing workflows." },
  { title: "Engineering Practices", skills: ["Git", "Linux", "CI/CD"], description: "Writing and reviewing pull requests, collaborating in multi-developer codebases, documenting systems, debugging production issues, and prioritizing reliability and maintainability." },
];

export default function Skills() {
  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black p-3 sm:p-4 md:p-6 lg:p-8 min-w-0">
        <div className="max-w-[1600px] mx-auto w-full">
          {/* Title only — colourful box */}
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-black/5 shadow-md mb-6 sm:mb-8 p-4 sm:p-6 md:p-8 min-h-[100px] sm:min-h-[120px] flex items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#A7F3D0] via-[#34D399] to-[#10B981]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="jersey-25-heading text-[4rem] md:text-[6rem] font-bold text-black/10 select-none">Skills</span>
            </div>
            <div className="absolute inset-0 opacity-90">
              <HalftoneBackground width={600} height={200} dotSpacing={8} baseRadius={0.2} maxRadius={2.5} bgColor="transparent" dotColor="#064e3b" dotOpacity={0.1} />
            </div>
            <div className="relative z-10">
              <h1 className="jersey-25-heading text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-2">
                Skills
              </h1>
              <p className="text-sm md:text-base text-black/90" style={{ backgroundColor: "#6EE7B7", padding: "4px 6px", width: "fit-content" }}>
                What I use
              </p>
            </div>
          </div>

          {/* Body — plain white */}
          <div className="space-y-3 sm:space-y-5 mb-6 sm:mb-8">
            {skillSections.map((section, i) => (
              <div key={i} className="rounded-xl sm:rounded-2xl border border-black/10 bg-white p-3 sm:p-4 md:p-5 shadow-sm min-w-0">
                <h2 className="jersey-25-heading text-black text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3">
                  {section.title}
                </h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {section.skills.map((skill, j) => (
                    <span key={j} className="text-black/90 text-xs md:text-sm border border-black/15 px-2.5 py-1 rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
                {section.description && (
                  <p className="text-black/80 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-xl sm:rounded-2xl border border-black/10 bg-white p-4 sm:p-6 md:p-8 shadow-sm min-w-0">
            <h2 className="jersey-25-heading text-black text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
              How I Work
            </h2>
            <p className="text-black/90 text-sm md:text-base leading-relaxed">
              I enjoy owning problems end-to-end, learning unfamiliar systems quickly, and turning complex ideas into reliable software. I care deeply about code quality, performance, and user experience, and I'm comfortable stepping into uncomfortable technical territory to learn and deliver impact.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
