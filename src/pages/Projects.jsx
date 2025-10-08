import { Link } from "react-router-dom";
import { projects } from "../data/projects";

export default function Projects() {
  return (
    <div className="min-h-screen p-10 bg-cover bg-no-repeat bg-fixed"
    style={{ backgroundImage: "url('/ProjectsBackground.png')" } }>
      <h1 className="text-6xl font-bold mb-5">My Projects</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/*makes the div a grid, with 1 column, 2 column for larger screens*/}
        {/*projects is an array from projects.js
        This is a loop where proj is the current item
        map makes each proj a react object
        makes each of them a link
         */}
        {projects.map((proj) => ( 
          <Link
            key={proj.id}
            to={`/projects/${proj.id}`}
            className="group rounded-md overflow-hidden border border-zinc-300/60 bg-white shadow-[0_2px_0_0_#c1c1c1,0_6px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_2px_0_0_#c1c1c1,0_10px_18px_rgba(0,0,0,0.35)] transition-all"
          >
            {/* XP-style title bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-b from-[#3f7ef6] to-[#245edb] text-white border-b border-[#1e4fb5]">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight">{proj.title}</h2>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-4 w-7 grid place-items-center text-[11px] leading-none bg-[#e5f2ff] text-[#0b5cd5] border border-[#9ec5ff]">_</span>
                <span className="h-4 w-7 grid place-items-center text-[11px] leading-none bg-[#e5f2ff] text-[#0b5cd5] border border-[#9ec5ff]">□</span>
                <span className="h-4 w-7 grid place-items-center text-[11px] leading-none bg-[#ff9b9b] text-[#5c0b0b] border border-[#c45b5b]">×</span>
              </div>
            </div>

            {/* Window body */}
            <div className="p-4 bg-white">
              <div className="aspect-video bg-white mb-4 overflow-hidden border border-zinc-200">
                <img src={proj.image} alt={proj.title} className="h-full w-full object-cover" />
              </div>
              <p className="text-zinc-700 text-sm">{proj.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(proj.tech || []).slice(0,3).map((t) => (
                  <span key={t} className="text-xs px-2 py-1 bg-[#e0f2ff] text-[#0b5cd5] border border-[#9ec5ff]">{t}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
