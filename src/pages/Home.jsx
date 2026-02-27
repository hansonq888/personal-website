import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import PageShell from "../components/PageShell";
import { projects } from "../data/projects";

const PREVIEW_IDS = ["macroboard", "realtor-website", "live-chord-detector"];
const previewProjects = projects.filter((p) => PREVIEW_IDS.includes(p.id));

export default function Home() {
  return (
    <PageShell isHome>
      <div className="h-full min-h-full flex flex-col min-h-0 min-w-0 overflow-hidden w-full max-w-full">
      {/* Center — name + about preview (compact Hero); on mobile cap height so bottom previews stay visible */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden max-h-[65vh] md:max-h-none">
        <Hero compact />
      </div>

      {/* Bottom — 3 previews; sits at bottom but can grow without clipping */}
      <div className="mt-auto flex-shrink-0 grid grid-cols-3 divide-x divide-white/20 border-t border-white/20 min-h-[100px]">
        <Link
          to="/experiences"
          className="group grid grid-cols-2 p-4 border border-white/20 bg-black/60 hover:bg-black/80 hover:border-white/40 transition-colors items-start"
        >
          {/* LEFT COLUMN */}
          <div className="min-w-0 pr-4">
            <div className="project-title-font text-white text-sm font-bold uppercase tracking-wider mb-2 text-left">
              Experiences
            </div>
            <p className="geist-light text-white/80 text-sm leading-snug text-left">
              Work, research, and other experiences.
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex justify-end">
            <img
              src="/magicbook.png"
              alt="Magic book"
              className="h-20 md:h-24 object-contain drop-shadow-[0_0_14px_rgba(0,0,0,0.7)]"
            />
          </div>
        </Link>

        <Link
          to="/projects"
          className="group grid grid-cols-2 p-4 border border-white/20 bg-black/60 hover:bg-black/80 hover:border-white/40 transition-colors items-start"
        >
          <div className="min-w-0 pr-4">
            <div className="project-title-font text-white text-sm font-bold uppercase tracking-wider mb-2 text-left">
              Projects
            </div>
            <ul className="space-y-1">
              {previewProjects.map((p) => (
                <li
                  key={p.id}
                  className="geist-light text-white/80 text-sm truncate text-left"
                >
                  {p.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end">
            <img
              src="/magicleaf.png"
              alt="Magic leaf"
              className="h-16 md:h-20 object-contain drop-shadow-[0_0_12px_rgba(0,0,0,0.7)]"
            />
          </div>
        </Link>

        <Link
          to="/skills"
          className="group grid grid-cols-2 p-4 border border-white/20 bg-black/60 hover:bg-black/80 hover:border-white/40 transition-colors items-start"
        >
          <div className="min-w-0 pr-4">
            <div className="project-title-font text-white text-sm font-bold uppercase tracking-wider mb-2 text-left">
              Skills
            </div>
            <p className="geist-light text-white/80 text-sm text-left">
              Technologies and tools I work with.
            </p>
          </div>

          <div className="flex justify-end">
            <img
              src="/magiwand.png"
              alt="Magic wand"
              className="h-16 md:h-20 object-contain drop-shadow-[0_0_12px_rgba(0,0,0,0.7)]"
            />
          </div>
        </Link>
      </div>
      </div>
    </PageShell>
  );
}
