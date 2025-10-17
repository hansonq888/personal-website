import { Link } from "react-router-dom";
import { projects } from "../data/projects";

export default function Projects() {
  return (
    <div className="min-h-screen p-10 bg-black">
      <h1 className="text-6xl font-bold mb-5 instrument-serif-regular text-white">My Projects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <Link
            key={proj.id}
            to={`/projects/${proj.id}`}
            className="group overflow-hidden rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
          >
            <div className="px-4 py-3 border-b border-white/10 text-white">
              <h2 className="text-lg font-semibold instrument-serif-regular">{proj.title}</h2>
            </div>
            <div className="p-4 text-white">
              <div className="aspect-video mb-4 overflow-hidden">
                <img src={proj.image} alt={proj.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <p className="text-sm text-white/80 instrument-serif-regular">{proj.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(proj.tech || []).slice(0,3).map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 bg-white/10 text-white border border-white/20 instrument-serif-regular">{t}</span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-white/70 text-xs">
                <span>Read more</span>
                <div className="flex gap-3">
                  {proj.website && (
                    <a href={proj.website} onClick={(e) => e.stopPropagation()} className="underline hover:text-white" target="_blank" rel="noreferrer">Live</a>
                  )}
                  <a href={proj.github} onClick={(e) => e.stopPropagation()} className="underline hover:text-white" target="_blank" rel="noreferrer">Code</a>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
