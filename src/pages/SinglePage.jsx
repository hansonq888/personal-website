import { useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { projects } from "../data/projects";

const SHOW_IDS = ["macroboard", "realtor-website", "live-chord-detector"];
const displayedProjects = projects.filter((p) => SHOW_IDS.includes(p.id));

function firstSentence(text) {
  if (!text || typeof text !== "string") return "";
  const match = text.match(/^[^.]*\.?/);
  return match ? match[0].trim() : text;
}

function ProjectTile({ proj }) {
  return (
    <Link
      to={`/projects/${proj.id}`}
      className="group flex flex-col w-full h-full min-h-[320px] md:min-h-[380px] overflow-hidden bg-black border-2 border-white/20 hover:border-white hover:bg-white/5 transition-all duration-200"
    >
      {proj.image && (
        <div className="flex-1 min-h-[200px] md:min-h-[260px] overflow-hidden">
          <img
            src={proj.image}
            alt=""
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
          />
        </div>
      )}
      <div className="p-2 md:p-3 flex flex-col justify-center border-t border-white/20">
        <span className="project-title-font text-white text-sm md:text-base font-bold block mb-0.5">
          {proj.title}
        </span>
        {proj.description && (
          <p className="geist-light text-white/80 text-xs line-clamp-2">
            {firstSentence(proj.description)}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function SinglePage() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="overflow-x-hidden bg-black">
      {/* Hero */}
      <section id="hero" className="min-h-screen">
        <Hero />
      </section>

      {/* About — asymmetric: title left, content + photo right */}
      <section id="about" className="border-t border-white/20">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-5 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-6 gap-4">
            <div className="md:col-span-4 flex flex-col justify-center">
<h2 className="project-title-font text-[clamp(1rem,4vw,1.5rem)] text-white font-bold leading-tight">
              About
              </h2>
            </div>
            <div className="md:col-span-8 flex flex-col md:flex-row md:items-start md:gap-6 gap-3">
              <div className="flex-1 space-y-2 min-w-0">
                <p className="geist-light text-white text-sm leading-relaxed">
                  <span className="geist-light-italic text-white/90">Yale sophomore originally from Vancouver, Canada, studying CS & Mathematics.</span>
                  {" "}I build software, work in ML and design, and like to mix code and creativity.
                </p>
                <p className="geist-light text-white text-sm leading-relaxed">
                  Outside of academics, I love playing ultimate frisbee, exploring music production, and staying active. I'm always excited to learn new skills, tackle challenging problems, and share knowledge with others.
                </p>
                <p className="geist-light text-white text-sm leading-relaxed">
                  This site is a space to showcase my work, projects, and explorations in technology, design, and music.
                </p>
              </div>
              <div className="flex-shrink-0">
                <img src="/AboutPhoto.jpg" alt="" className="w-32 md:w-40 object-cover block border-2 border-white/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects — full-bleed 3 columns, dense */}
      <section id="projects" className="border-t border-white/20">
        <div className="px-4 md:px-8 py-5 md:py-8">
          <h2 className="project-title-font text-[clamp(1rem,4vw,1.5rem)] text-white font-bold leading-tight mb-4 md:mb-5">
            Projects
          </h2>
          <div className="max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {displayedProjects.map((proj) => (
              <ProjectTile key={proj.id} proj={proj} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact — single column list, dense */}
      <section id="contact" className="border-t border-white/20">
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-5 md:py-8">
          <h2 className="project-title-font text-[clamp(1rem,4vw,1.5rem)] text-white font-bold leading-tight mb-2">
            Contact
          </h2>
          <p className="geist-light text-white/90 text-sm mb-5">
            <span className="geist-light-italic text-white/90">Always open to chat about projects, music, or anything else.</span>
            {" "}Feel free to reach out.
          </p>
          <div className="flex flex-col gap-0 border-t border-white/20">
            <a href="mailto:hansonq888@gmail.com" className="octosale text-white text-sm border-b border-white/20 py-3 hover:bg-white/5 px-1 transition-colors tracking-wider">
              hansonq888@gmail.com
            </a>
            <a href="mailto:hanson.qin@yale.edu" className="octosale text-white text-sm border-b border-white/20 py-3 hover:bg-white/5 px-1 transition-colors tracking-wider">
              hanson.qin@yale.edu
            </a>
            <a href="https://www.linkedin.com/in/hanson-q/" target="_blank" rel="noopener noreferrer" className="octosale text-white text-sm border-b border-white/20 py-3 hover:bg-white/5 px-1 transition-colors tracking-wider">
              LinkedIn
            </a>
            <a href="https://github.com/hansonq888" target="_blank" rel="noopener noreferrer" className="octosale text-white text-sm border-b border-white/20 py-3 hover:bg-white/5 px-1 transition-colors tracking-wider">
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
