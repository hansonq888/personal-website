import { Link } from "react-router-dom";
import { featuredProjects as displayedProjects } from "../data/projects";
import PageShell from "../components/PageShell";

const INTER = '"Inter", sans-serif';

function Card({ project }) {
  return (
    <Link to={`/projects/${project.id}`} className="group block">
      <div className="relative overflow-hidden bg-[#f4f4f4] aspect-[16/9]">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover object-top block transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none"
        />
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="mono-meta w-10 h-10 bg-black text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            ↗
          </span>
        </span>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h2
          className="mono-meta leading-none"
          style={{ fontWeight: 700, letterSpacing: "0.01em", fontSize: "clamp(0.85rem, 1.2vw, 1rem)" }}
        >
          {project.title}
        </h2>
        {project.year && (
          <span className="mono-meta shrink-0 tracking-[0.14em] text-[9px] text-black/45">
            {project.year}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function Projects() {
  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black px-4 sm:px-8 md:px-12 pt-12 md:pt-16 pb-28 md:pb-40 min-w-0 overflow-x-clip">
        <div className="w-full max-w-5xl mx-auto">
          {/* Wordmark with item count */}
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <h1
              className="leading-[0.85] tracking-tight flex items-start"
              style={{ fontFamily: INTER, fontWeight: 700, fontSize: "clamp(2.25rem, 7vw, 5rem)", letterSpacing: "-0.03em" }}
            >
              Projects
              <sup className="mono-meta ml-2 text-[0.16em] tracking-[0.1em] text-black/45">
                {String(displayedProjects.length).padStart(2, "0")}
              </sup>
            </h1>
            <img
              src="/camera_shutter_dotted.gif"
              alt=""
              className="w-[78px] sm:w-[92px] md:w-[110px] h-auto block select-none pointer-events-none mt-1"
            />
          </div>

          {/* Grid */}
          <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-10 md:gap-x-14 gap-y-14 md:gap-y-20">
            {displayedProjects.map((p) => (
              <Card key={p.id} project={p} />
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
