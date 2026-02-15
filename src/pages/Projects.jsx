import { Link } from "react-router-dom";
import { projects } from "../data/projects";

const SHOW_IDS = [
  "macroboard",
  "realtor-website",
  "live-chord-detector",
  "priority-email-labeler",
  "mini-shell",
  "mini-compiler",
];
const displayedProjects = projects.filter((p) => SHOW_IDS.includes(p.id));

const CARD_POSITIONS = [
  { top: "34%", left: "80%" },
  { top: "42%", left: "48%" },
  { top: "62%", left: "22%" },
  { top: "22%", left: "28%" },
  { top: "72%", left: "65%" },
  { top: "78%", left: "46%" },
];

function firstSentence(text) {
  if (!text || typeof text !== "string") return "";
  const match = text.match(/^[^.]*\.?/);
  return match ? match[0].trim() : text;
}

function ProjectCard({ proj, isFeatured, className = "" }) {
  const cardSize = isFeatured ? "w-52 md:w-64" : "w-36 md:w-40";
  const titleSize = isFeatured ? "text-lg md:text-xl" : "text-sm md:text-base";
  return (
    <Link
      to={`/projects/${proj.id}`}
      className={`geist-light flex flex-col group rounded-lg transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.12),0_0_40px_rgba(255,255,255,0.06)] ${cardSize} ${className}`}
    >
      <span className={`jersey-25-heading text-white/90 ${titleSize} font-medium text-left mb-2`}>
        {proj.title}
      </span>
      {proj.image && (
        <div className="aspect-video w-full overflow-hidden">
          <img src={proj.image} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      {proj.description && (
        <p className={`geist-light text-white/70 mt-2 ${isFeatured ? "text-xs" : "text-[10px]"}`}>
          {firstSentence(proj.description)}
        </p>
      )}
    </Link>
  );
}

export default function Projects() {
  return (
    <div className="relative min-h-screen md:h-screen overflow-hidden flex flex-col">
      {/* Thin vertical line — left */}
      <div
        className="absolute left-4 md:left-12 top-20 md:top-24 bottom-36 md:bottom-44 w-0.5 bg-white/20 z-[1]"
        aria-hidden
      />

      {/* Top left — labels */}
      <div className="absolute top-4 md:top-8 left-4 md:left-12 z-10">
        <span className="geist-light text-white/75 text-[10px] md:text-xs tracking-[0.2em] block">
          Work
        </span>
        <span className="geist-light text-white/75 text-[10px] md:text-xs tracking-[0.2em] block mt-1">
          Projects
        </span>
      </div>

      {/* Top right — intro */}
      <div className="absolute top-4 md:top-8 right-4 md:right-12 z-10 text-right max-w-[75%] md:max-w-md">
        <p className="geist-light text-white/75 text-xs md:text-base leading-relaxed">
          <span className="geist-light-italic text-white/75">Things I've built.</span>
          {" "}Click through to read more or try them out.
        </p>
      </div>

      {/* Mobile: project grid — more horizontal space, no scrollbar */}
      <div className="md:hidden absolute left-6 right-6 sm:left-8 sm:right-8 top-28 bottom-24 z-10 overflow-y-auto scrollbar-none">
        <div className="grid grid-cols-2 gap-3 pb-6">
          {displayedProjects.map((proj, i) => (
            <ProjectCard
              key={proj.id}
              proj={proj}
              isFeatured={i < 3}
              className="w-full"
            />
          ))}
        </div>
      </div>

      {/* Desktop: scattered cards */}
      {displayedProjects.map((proj, i) => {
        const pos = CARD_POSITIONS[i] ?? { top: "50%", left: "50%" };
        const isFeatured = i < 3;
        return (
          <div
            key={proj.id}
            className="hidden md:block absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ top: pos.top, left: pos.left }}
          >
            <ProjectCard proj={proj} isFeatured={isFeatured} />
          </div>
        );
      })}

      {/* Bottom left — headline */}
      <div className="absolute bottom-4 md:bottom-8 left-4 md:left-12 z-10 pt-4">
        <h1 className="project-title-font text-[clamp(1.75rem,8vw,4rem)] text-white/75 font-bold leading-tight">
          Projects
        </h1>
      </div>

      {/* Bottom right — back */}
      <div className="absolute bottom-4 md:bottom-8 right-4 md:right-12 z-10">
        <Link
          to="/"
          className="geist-light text-white/75 text-sm border border-white/30 rounded-full px-4 md:px-5 py-2 md:py-2.5 hover:bg-white/10 transition-colors tracking-wider inline-block"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
