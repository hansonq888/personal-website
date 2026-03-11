import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import PageShell from "../components/PageShell";
import HalftoneBackground from "../components/HalftoneBackground";

const SHOW_IDS = [
  "sample8",
  "macroboard",
  "realtor-website",
  "live-chord-detector",
  "priority-email-labeler",
  "mini-shell",
  "mini-compiler",
];
const displayedProjects = SHOW_IDS.map((id) => projects.find((p) => p.id === id)).filter(Boolean);
const featuredProject = displayedProjects[0];
const otherProjects = displayedProjects.slice(1);

const STARRED_IDS = ["sample8", "realtor-website", "live-chord-detector"];

function firstSentence(text) {
  if (!text || typeof text !== "string") return "";
  const match = text.match(/^[^.]*\.?/);
  return match ? match[0].trim() : text;
}

export default function Projects() {
  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black p-3 sm:p-4 md:p-6 lg:p-8 min-w-0">
        <div className="max-w-[1600px] mx-auto w-full">
          {/* Title only — colourful box */}
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-black/5 shadow-md mb-6 sm:mb-8 p-4 sm:p-6 md:p-8 min-h-[100px] sm:min-h-[120px] flex items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7DD3FC] via-[#38BDF8] to-[#0EA5E9]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="jersey-25-heading text-[4rem] md:text-[6rem] font-bold text-black/10 select-none">Projects</span>
            </div>
            <div className="absolute inset-0 opacity-90">
              <HalftoneBackground width={600} height={200} dotSpacing={8} baseRadius={0.2} maxRadius={2.5} bgColor="transparent" dotColor="#0c4a6e" dotOpacity={0.12} />
            </div>
            <div className="relative z-10">
              <h1 className="jersey-25-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-2">
                Projects
              </h1>
              <p className="text-sm md:text-base text-black/90" style={{ backgroundColor: "#BAE6FD", padding: "4px 6px", width: "fit-content" }}>
                Things I've built
              </p>
            </div>
          </div>

          {/* 2 columns: featured (left) + all others stacked (right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
            {/* Left: single featured project — title on top of image */}
            {featuredProject && (
              <Link
                to={`/projects/${featuredProject.id}`}
                className="rounded-xl overflow-hidden border border-black/10 shadow-md bg-black/10 group block relative"
              >
                {featuredProject.image && (
                  <div className="w-full aspect-[3/2] bg-black/5 overflow-hidden relative">
                    <img
                      src={featuredProject.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
                    />
                    {/* Gradient overlay for text readability */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"
                      aria-hidden
                    />
                    {/* Title and meta on top of image */}
                    <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 text-white">
                      <p className="text-[10px] font-bold tracking-widest text-white/80 uppercase mb-0.5">Featured</p>
                      <span className="jersey-25-heading text-lg sm:text-xl font-bold flex items-center gap-1.5 flex-wrap">
                        {featuredProject.title}
                        <span className="text-amber-300 text-sm sm:text-base" aria-hidden>★ ★ ★</span>
                      </span>
                      {featuredProject.description && (
                        <p className="text-white/90 text-xs sm:text-sm mt-0.5 line-clamp-2">
                          {firstSentence(featuredProject.description)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            )}

            {/* Right: all other projects stacked vertically */}
            <div className="flex flex-col gap-2 sm:gap-3 min-w-0">
              {otherProjects.length > 0 && (
                <h2 className="jersey-25-heading text-sm font-bold text-black/80 mb-0.5">More projects</h2>
              )}
              {otherProjects.map((proj) => (
                <Link
                  key={proj.id}
                  to={`/projects/${proj.id}`}
                  className="flex gap-3 p-2.5 sm:p-3 rounded-xl border border-black/10 bg-white shadow-sm hover:shadow-md hover:border-black/20 transition-all group min-w-0"
                >
                  {proj.image ? (
                    <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-black/5">
                      <img src={proj.image} alt="" className="w-full h-full object-cover group-hover:opacity-95 transition-opacity" />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-black/10" />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="jersey-25-heading text-sm sm:text-base font-bold text-black flex items-center gap-1 min-w-0">
                      <span className="truncate">{proj.title}</span>
                      {STARRED_IDS.includes(proj.id) && (
                        <span className="text-amber-500 text-xs flex-shrink-0" aria-hidden>★ ★ ★</span>
                      )}
                    </span>
                    {proj.description && (
                      <p className="text-black/60 text-xs mt-0.5 line-clamp-2">
                        {firstSentence(proj.description)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
