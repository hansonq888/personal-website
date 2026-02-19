import PageShell from "../components/PageShell";

const skillSections = [
  {
    title: "Programming Languages",
    skills: ["TypeScript", "JavaScript", "Python", "Java", "C", "C++"],
    description: null,
  },
  {
    title: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "HTML / CSS"],
    description:
      "Building responsive user interfaces, reusable component systems, and client/server-rendered applications.",
  },
  {
    title: "Backend & APIs",
    skills: ["Node.js", "Flask", "FastAPI", "REST APIs"],
    description:
      "Designing backend services, building ingestion pipelines, creating APIs, handling ETL workflows, and writing clean, testable code.",
  },
  {
    title: "Data & Analytics",
    skills: ["Pandas", "NumPy"],
    description:
      "Working with large datasets, building analytics pipelines, and supporting ML-driven workflows.",
  },
  {
    title: "Infrastructure & Databases",
    skills: ["AWS (S3)", "PostgreSQL", "SQL"],
    description:
      "Building ingestion pipelines, managing data storage, and supporting reproducible processing workflows.",
  },
  {
    title: "Engineering Practices",
    skills: ["Git", "Linux", "CI/CD"],
    description:
      "Writing and reviewing pull requests, collaborating in multi-developer codebases, documenting systems, debugging production issues, and prioritizing reliability and maintainability.",
  },
];

export default function Skills() {
  return (
    <PageShell>
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <h1 className="project-title-font text-white text-2xl md:text-3xl font-bold mb-6 border-b border-white/20 pb-3">
          Skills
        </h1>

        <div className="space-y-6">
          {skillSections.map((section, i) => (
            <div key={i} className="border border-white/20 p-4 md:p-5">
              <h2 className="project-title-font text-white text-base md:text-lg font-bold mb-3">
                {section.title}
              </h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {section.skills.map((skill, j) => (
                  <span
                    key={j}
                    className="geist-light text-white/90 text-xs md:text-sm border border-white/20 px-2.5 py-1"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              {section.description && (
                <p className="geist-light text-white/80 text-sm md:text-base leading-relaxed">
                  {section.description}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 border border-white/20 p-4 md:p-5">
          <h2 className="project-title-font text-white text-base md:text-lg font-bold mb-3">
            How I Work
          </h2>
          <p className="geist-light text-white/80 text-sm md:text-base leading-relaxed">
            I enjoy owning problems end-to-end, learning unfamiliar systems quickly, and turning complex ideas into reliable software. I care deeply about code quality, performance, and user experience, and I'm comfortable stepping into uncomfortable technical territory to learn and deliver impact.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
