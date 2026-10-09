import { Link } from "react-router-dom";

const INTER = '"Inter", sans-serif';

/* The project card, shared by the /projects page and the long-scroll sheet so
   the two cannot drift apart: dark wash lifting on hover, the image easing in
   a little, and a black ↗ badge in the middle. */
export default function ProjectCard({ project }) {
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
          className="uppercase leading-none"
          style={{
            fontFamily: INTER,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            fontSize: "clamp(0.95rem, 1.4vw, 1.2rem)",
          }}
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
