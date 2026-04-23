import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import PageShell from "../components/PageShell";
import HalftoneBackground from "../components/HalftoneBackground";

const SHOW_IDS = [
  "sample8",
  "dealsignal-ai",
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

          {/* BIG / bold / playful featured block */}
          {featuredProject && (
            <Link
              to={`/projects/${featuredProject.id}`}
              className="block mb-8 rounded-2xl overflow-hidden border border-black/10 shadow-xl group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#f472b6] via-[#e879f9] to-[#fb923c]" />
              <div className="absolute inset-0 opacity-80">
                <HalftoneBackground width={1800} height={600} dotSpacing={12} baseRadius={0.14} maxRadius={1.65} bgColor="transparent" dotColor="#111827" dotOpacity={0.11} />
              </div>
              <div className="relative p-4 sm:p-6 md:p-8 lg:p-10">
                <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-stretch">
                  <div className="lg:w-[58%] flex flex-col justify-between min-w-0">
                    <div>
                      <p className="text-[10px] sm:text-xs font-bold tracking-[0.22em] text-black/70 uppercase mb-2">Featured project</p>
                      <h2 className="jersey-25-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.88] text-black drop-shadow-sm flex items-end gap-2 flex-wrap">
                        {featuredProject.title}
                      </h2>
                      {featuredProject.description && (
                        <p className="mt-3 text-black/80 text-sm sm:text-base md:text-lg max-w-2xl leading-snug">
                          {firstSentence(featuredProject.description)}
                        </p>
                      )}
                    </div>
                    <p className="mt-5 inline-flex w-fit text-[11px] sm:text-xs font-bold tracking-wide uppercase px-2.5 py-1 bg-white/80 border border-black/10 rounded-full text-black/75">
                      Tap to view more
                    </p>
                  </div>

                  <div className="lg:w-[42%] min-w-0">
                    <div className="relative rounded-2xl overflow-hidden border-2 border-black/15 bg-white/60 backdrop-blur-sm shadow-2xl rotate-[-1deg] group-hover:rotate-0 transition-transform duration-500">
                      {featuredProject.image ? (
                        <div className="bg-black/5 overflow-hidden max-h-[460px] flex items-center justify-center">
                          <img
                            src={featuredProject.image}
                            alt=""
                            className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[4/3] bg-black/10" />
                      )}
                      <span className="absolute top-2 right-2 text-[10px] sm:text-xs px-2 py-1 rounded-full bg-black text-white tracking-wide uppercase">
                        spotlight
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Playful collage grid */}
          {otherProjects.length > 0 && (
            <>
              <h2 className="jersey-25-heading text-xl sm:text-2xl text-black/80 mb-3">More projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherProjects.map((proj, i) => {
                  const palettes = [
                    "from-[#fef3c7] via-[#fde68a] to-[#fcd34d]",
                    "from-[#e0f2fe] via-[#7dd3fc] to-[#38bdf8]",
                    "from-[#fce7f3] via-[#f9a8d4] to-[#f472b6]",
                    "from-[#dcfce7] via-[#86efac] to-[#34d399]",
                    "from-[#ede9fe] via-[#c4b5fd] to-[#a78bfa]",
                    "from-[#ffe4e6] via-[#fda4af] to-[#fb7185]",
                  ];
                  const rotate = ["rotate-[-1deg]", "rotate-[0.8deg]", "rotate-[-0.6deg]"][i % 3];
                  return (
                    <Link
                      key={proj.id}
                      to={`/projects/${proj.id}`}
                      className={`group relative rounded-2xl overflow-hidden border border-black/10 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.015] ${rotate} hover:rotate-0`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${palettes[i % palettes.length]}`} />
                      <div className="absolute inset-0 opacity-65">
                        <HalftoneBackground width={700} height={350} dotSpacing={10} baseRadius={0.12} maxRadius={1.45} bgColor="transparent" dotColor="#111827" dotOpacity={0.11} />
                      </div>

                      <div className="relative z-10 p-3 sm:p-4">
                        <div className="rounded-xl overflow-hidden border border-black/10 bg-white/70 mb-3">
                          {proj.image ? (
                            <div className="aspect-video bg-black/5">
                              <img src={proj.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                            </div>
                          ) : (
                            <div className="aspect-video bg-black/10" />
                          )}
                        </div>
                        <span className="jersey-25-heading text-xl sm:text-2xl text-black block leading-none">
                          {proj.title}
                        </span>
                        {proj.description && (
                          <p className="text-black/70 text-xs sm:text-sm mt-1 line-clamp-2">
                            {firstSentence(proj.description)}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
