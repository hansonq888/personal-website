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

export default function Projects() {
  return (
    <div className="relative h-screen overflow-hidden flex flex-col">
      {/* Thin vertical line — left */}
      <div
        className="absolute left-8 md:left-12 top-24 bottom-44 w-0.5 bg-white/20 z-[1]"
        aria-hidden
      />

      {/* Top left — labels */}
      <div className="absolute top-8 left-8 md:left-12 z-10">
        <span className="geist-light text-white/75 text-[10px] md:text-xs tracking-[0.2em] block">
          Work
        </span>
        <span className="geist-light text-white/75 text-[10px] md:text-xs tracking-[0.2em] block mt-1">
          Projects
        </span>
      </div>

      {/* Top right — intro */}
      <div className="absolute top-8 right-8 md:right-12 z-10 text-right max-w-md">
        <p className="geist-light text-white/75 text-sm md:text-base leading-relaxed">
          <span className="geist-light-italic text-white/75">Things I've built.</span>
          {" "}Click through to read more or try them out.
        </p>
      </div>

      {/* Project cards — scattered around the page */}
      {displayedProjects.map((proj, i) => {
        const pos = CARD_POSITIONS[i] ?? { top: "50%", left: "50%" };
        const isFeatured = i < 3;
        const cardSize = isFeatured
          ? "w-52 md:w-64"
          : "w-36 md:w-40";
        const titleSize = isFeatured
          ? "text-lg md:text-xl"
          : "text-sm md:text-base";
        return (
          <Link
            key={proj.id}
            to={`/projects/${proj.id}`}
            className={`geist-light absolute z-10 ${cardSize} flex flex-col -translate-x-1/2 -translate-y-1/2 group rounded-lg transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.12),0_0_40px_rgba(255,255,255,0.06)]`}
            style={{ top: pos.top, left: pos.left }}
          >
            <span className={`jersey-25-heading text-white/90 ${titleSize} font-medium text-left mb-2`}>
              {proj.title}
            </span>
            {proj.image && (
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={proj.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {proj.description && (
              <p className={`geist-light text-white/70 mt-2 ${isFeatured ? "text-xs" : "text-[10px]"}`}>
                {firstSentence(proj.description)}
              </p>
            )}
          </Link>
        );
      })}

      {/* Bottom left — headline */}
      <div className="absolute bottom-8 left-8 md:left-12 z-10 pt-4">
        <h1 className="project-title-font text-[clamp(2rem,8vw,4rem)] text-white/75 font-bold leading-tight">
          Projects
        </h1>
      </div>

      {/* Bottom right — back */}
      <div className="absolute bottom-8 right-8 md:right-12 z-10">
        <Link
          to="/"
          className="geist-light text-white/75 text-sm border border-white/30 rounded-full px-5 py-2.5 hover:bg-white/10 transition-colors tracking-wider inline-block"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
