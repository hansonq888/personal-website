import { Link } from "react-router-dom";
import { projects } from "../data/projects";

export default function ProjectsPreview() {
  const featured = projects.slice(0, 3);

  return (
    <section
      className="relative px-6 py-0 bg-cover bg-no-repeat bg-fixed border-t border-b border-white/15"
      style={{ backgroundImage: "url('/ProjectsBackground.png')" }}
    >
      <div className="max-w-7xl mx-auto py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
          <Link
            to="/projects"
            className="text-sm md:text-base bg-[#3CCB43] text-black px-4 py-2 hover:opacity-90 border border-[#1e4fb5]"
          >
            View all projects
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="group rounded-md overflow-hidden border border-zinc-300/60 bg-white shadow-[0_2px_0_0_#c1c1c1,0_6px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_2px_0_0_#c1c1c1,0_10px_18px_rgba(0,0,0,0.35)] transition-all"
            >
              {/* XP-style title bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-b from-[#3f7ef6] to-[#245edb] text-white border-b border-[#1e4fb5]">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold tracking-tight">{p.title}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-4 w-7 grid place-items-center text-[11px] leading-none bg-[#e5f2ff] text-[#0b5cd5] border border-[#9ec5ff]">_</span>
                  <span className="h-4 w-7 grid place-items-center text-[11px] leading-none bg-[#e5f2ff] text-[#0b5cd5] border border-[#9ec5ff]">□</span>
                  <span className="h-4 w-7 grid place-items-center text-[11px] leading-none bg-[#ff9b9b] text-[#5c0b0b] border border-[#c45b5b]">×</span>
                </div>
              </div>

              <div className="aspect-video overflow-hidden bg-white border border-zinc-200">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="text-xl font-semibold text-black mb-1">{p.title}</h3>
                <p className="text-zinc-700 text-sm mb-2">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tech?.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-[#e0f2ff] text-[#0b5cd5] px-2 py-1 border border-[#9ec5ff]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">Read more</span>
                  <a
                    href={p.github}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs underline text-[#0b5cd5] hover:text-black"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


