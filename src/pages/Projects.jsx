import { featuredProjects as displayedProjects } from "../data/projects";
import PageShell from "../components/PageShell";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black px-4 sm:px-8 md:px-12 pt-12 md:pt-16 pb-28 md:pb-40 min-w-0 overflow-x-clip">
        <div className="w-full max-w-5xl mx-auto">
          {/* Wordmark with item count */}
          <div className="flex items-start gap-6 flex-wrap">
            <h1
              className="leading-[0.85] tracking-tight"
              style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: "clamp(2.25rem, 7vw, 5rem)", letterSpacing: "-0.03em" }}
            >
              Projects
            </h1>
          </div>

          {/* Grid */}
          <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-10 md:gap-x-14 gap-y-14 md:gap-y-20">
            {displayedProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
