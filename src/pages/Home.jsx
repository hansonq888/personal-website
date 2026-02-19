import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import PageShell from "../components/PageShell";
import { projects } from "../data/projects";

const PREVIEW_IDS = ["macroboard", "realtor-website", "live-chord-detector"];
const previewProjects = projects.filter((p) => PREVIEW_IDS.includes(p.id));

export default function Home() {
  return (
    <PageShell isHome scrollContent={false}>
      <div className="h-full flex flex-col min-h-0 min-w-0 overflow-hidden w-full max-w-full">
      {/* Center — name + about preview (compact Hero) */}
      <div className="flex-1 min-h-0 flex flex-col">
        <Hero compact />
      </div>

      {/* Bottom — 3 previews as buttons (larger, same hover as buttons) */}
      <div className="flex-shrink-0 grid grid-cols-3 divide-x divide-white/20 border-t border-white/20 min-h-0 max-h-[28vh] md:max-h-[26vh]">
        <Link
          to="/experiences"
          className="group block p-3 md:p-4 min-w-0 overflow-hidden border border-white/20 hover:bg-white transition-colors"
        >
          <div className="project-title-font text-white group-hover:text-black text-xs md:text-sm font-bold uppercase tracking-wider mb-1.5">
            Experiences
          </div>
          <p className="geist-light text-white/80 group-hover:text-black/80 text-xs md:text-sm leading-snug line-clamp-2">
            Work, research, and other experiences.
          </p>
        </Link>

        <Link
          to="/projects"
          className="group block p-3 md:p-4 min-w-0 overflow-hidden border border-white/20 hover:bg-white transition-colors"
        >
          <div className="project-title-font text-white group-hover:text-black text-xs md:text-sm font-bold uppercase tracking-wider mb-2">
            Projects
          </div>
          <ul className="space-y-1">
            {previewProjects.map((p) => (
              <li key={p.id} className="geist-light text-white/80 group-hover:text-black/80 text-xs md:text-sm truncate">
                {p.title}
              </li>
            ))}
          </ul>
        </Link>

        <Link
          to="/skills"
          className="group block p-3 md:p-4 min-w-0 overflow-hidden border border-white/20 hover:bg-white transition-colors"
        >
          <div className="project-title-font text-white group-hover:text-black text-xs md:text-sm font-bold uppercase tracking-wider mb-1.5">
            Skills
          </div>
          <p className="geist-light text-white/80 group-hover:text-black/80 text-xs md:text-sm">
            Technologies and tools I work with.
          </p>
        </Link>
      </div>
      </div>
    </PageShell>
  );
}
