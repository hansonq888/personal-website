import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import PageShell from "../components/PageShell";

const SHOW_IDS = [
  "macroboard",
  "realtor-website",
  "live-chord-detector",
  "priority-email-labeler",
  "mini-shell",
  "mini-compiler",
];
const displayedProjects = projects.filter((p) => SHOW_IDS.includes(p.id));

function firstSentence(text) {
  if (!text || typeof text !== "string") return "";
  const match = text.match(/^[^.]*\.?/);
  return match ? match[0].trim() : text;
}

function ProjectCard({ proj }) {
  return (
    <Link
      to={`/projects/${proj.id}`}
      className="group block border border-white/20 hover:bg-white transition-colors overflow-hidden"
    >
      {proj.image && (
        <div className="aspect-video w-full overflow-hidden border-b border-white/20">
          <img src={proj.image} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-3 md:p-4">
        <span className="project-title-font text-white group-hover:text-black text-sm md:text-base font-bold block mb-1.5">
          {proj.title}
        </span>
        {proj.description && (
          <p className="geist-light text-white/80 group-hover:text-black/80 text-xs md:text-sm line-clamp-2">
            {firstSentence(proj.description)}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function Projects() {
  return (
    <PageShell>
      <div className="p-4 md:p-6">
        <h1 className="project-title-font text-white text-2xl md:text-3xl font-bold mb-6 border-b border-white/20 pb-3">
          Projects
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {displayedProjects.map((proj) => (
            <ProjectCard key={proj.id} proj={proj} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
