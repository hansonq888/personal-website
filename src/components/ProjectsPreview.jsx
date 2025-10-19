import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import { useMemo } from "react";

export default function ProjectsPreview() {
  const featured = useMemo(() => projects.slice(0, 3), []);

  return (
    <section
      className="relative px-6 pt-0 pb-12 -mb-px overflow-visible"
    >
      <div className="relative z-10 max-w-7xl mx-auto pt-10 pb-0">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
          <Link
            to="/projects"
            className="text-sm md:text-base bg-white text-black px-4 py-2 hover:opacity-90 border border-black"
          >
            View all projects
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="group overflow-hidden rounded-2xl border border-white/20 bg-gray-900 hover:bg-gray-800 shadow-md hover:shadow-lg transition-all"
            >
              {/* Sleek header */}
              <div className="px-4 py-3 border-b border-white/10 text-white">
                <h3 className="text-lg font-semibold instrument-serif-regular">{p.title}</h3>
              </div>

              <div className="aspect-video overflow-hidden bg-white border border-zinc-200">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4 text-white">
                <p className="text-sm text-white/80 instrument-serif-regular mb-2">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tech?.slice(0, 3).map((t) => (
                    <span key={t} className="text-[11px] px-2 py-0.5 bg-white/10 text-white border border-white/20 instrument-serif-regular">{t}</span>
                  ))}
                </div>
                
                {/* Special highlighting for MacroBoard live link and Chord Detector download */}
                {(p.id === "macroboard" && p.website) || (p.id === "live-chord-detector" && p.download) ? (
                  <div className="mb-3">
                    {p.id === "macroboard" && p.website && (
                      <a 
                        href={p.website} 
                        onClick={(e) => e.stopPropagation()} 
                        className="block w-full border border-white/20 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-2xl text-center transition-all duration-200 hover:border-white/40 hover:shadow-lg" 
                        target="_blank" 
                        rel="noreferrer"
                      >
                        🌐 Visit Live Site
                      </a>
                    )}
                    {p.id === "live-chord-detector" && p.download && (
                      <a 
                        href={p.download} 
                        onClick={(e) => e.stopPropagation()} 
                        className="block w-full border border-white/20 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-2xl text-center transition-all duration-200 hover:border-white/40 hover:shadow-lg" 
                        download
                      >
                        📥 Download Project
                      </a>
                    )}
                  </div>
                ) : null}
                
                <div className="flex items-center justify-between text-white/70 text-xs">
                  <span>Read more</span>
                  <div className="flex gap-3">
                    {p.website && p.id !== "macroboard" && (
                      <a href={p.website} onClick={(e) => e.stopPropagation()} className="underline hover:text-white" target="_blank" rel="noreferrer">Live</a>
                    )}
                    {p.download && p.id !== "live-chord-detector" && (
                      <a href={p.download} onClick={(e) => e.stopPropagation()} className="underline hover:text-white" download>Download</a>
                    )}
                    {p.github && p.id !== "spam-email-detector" && (
                      <a href={p.github} onClick={(e) => e.stopPropagation()} className="underline hover:text-white" target="_blank" rel="noreferrer">Code</a>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


