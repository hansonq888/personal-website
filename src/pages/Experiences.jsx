import PageShell from "../components/PageShell";
import HalftoneBackground from "../components/HalftoneBackground";

const experiences = [
  {
    role: "Founding Software Engineer",
    org: "Shown Space",
    url: "https://shownspace.com",
    image: "/shownspace.png",
    dates: "November 2025 – Present",
    paragraphs: [
      "I help build Shown Space, a sports analytics platform focused on making game data easier to understand and explore. As part of a small team, I work across the stack to ship features, improve performance, and support real users.",
      "I've rebuilt major parts of the web application, helped design data pipelines, and worked closely with teammates to turn ideas into working systems. This role has taught me how to learn quickly, take ownership, and write code that others depend on.",
    ],
  },
  {
    role: "Software Engineer",
    org: "Yale Cancer Center — Blenman Innovation Group",
    url: "https://blenmaninnovationgroup.org/",
    dates: "January 2026 – Present",
    paragraphs: [],
  },
  {
    role: "Head of Sponsorships",
    org: "Yale AI Association",
    url: "https://www.yale-ai.org/",
    dates: "September 2025 – Present",
    paragraphs: [
      "I lead sponsorship outreach and help organize technical events and hackathons for the student community. I work with sponsors, coordinate logistics, and support initiatives that make technology more accessible on campus.",
    ],
  },
];

export default function Experiences() {
  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black p-3 sm:p-4 md:p-6 lg:p-8 min-w-0">
        <div className="max-w-[1600px] mx-auto w-full">
          {/* Big expressive header */}
          <div className="relative rounded-2xl overflow-hidden border border-black/10 shadow-xl mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f9a8d4] via-[#f472b6] to-[#7dd3fc]" />
            <div className="absolute inset-0 opacity-75">
              <HalftoneBackground width={1400} height={420} dotSpacing={11} baseRadius={0.12} maxRadius={1.6} bgColor="transparent" dotColor="#111827" dotOpacity={0.12} />
            </div>
            <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-10">
              <p className="text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase text-black/65 mb-2">
                Career path
              </p>
              <h1 className="jersey-25-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.85] text-black">
                Experience
              </h1>
              <p className="mt-2 inline-flex text-xs sm:text-sm text-black/85 px-2.5 py-1 bg-white/75 border border-black/10 rounded-full">
                Where I've worked
              </p>
            </div>
          </div>

          {/* Masonry-like layout with same card dimensions */}
          <div className="columns-1 lg:columns-2 gap-4 sm:gap-5 [column-fill:_balance]">
            {experiences.map((exp, i) => {
              const palettes = [
                "from-[#fde68a] via-[#fbbf24] to-[#f59e0b]",
                "from-[#bae6fd] via-[#7dd3fc] to-[#38bdf8]",
                "from-[#fbcfe8] via-[#f9a8d4] to-[#f472b6]",
              ];
              const rotate = i % 2 === 0 ? "rotate-[-0.6deg]" : "rotate-[0.6deg]";
              return (
                <div
                  key={i}
                  className={`relative mb-4 break-inside-avoid rounded-2xl overflow-hidden border border-black/10 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01] ${rotate} hover:rotate-0`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${palettes[i % palettes.length]}`} />
                  <div className="absolute inset-0 opacity-60">
                    <HalftoneBackground width={900} height={420} dotSpacing={10} baseRadius={0.11} maxRadius={1.45} bgColor="transparent" dotColor="#111827" dotOpacity={0.1} />
                  </div>
                  <div className="relative z-10 p-4 sm:p-5 md:p-6">
                    <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.16em] uppercase text-black/65 bg-white/70 border border-black/10 rounded-full px-2.5 py-1 mb-3">
                      <span>{exp.dates}</span>
                    </div>
                    <h2 className="jersey-25-heading text-black text-2xl sm:text-3xl md:text-4xl leading-[0.9] mb-1">
                      {exp.role}
                    </h2>
                    <p className="text-black/85 text-xs sm:text-sm mb-3 break-words">
                      {exp.url ? (
                        <a href={exp.url} target="_blank" rel="noopener noreferrer" className="text-black/85 hover:text-black underline underline-offset-2 transition-colors break-words">
                          {exp.org}
                        </a>
                      ) : (
                        exp.org
                      )}
                    </p>
                    {exp.image && (
                      <div className="mb-3 rounded-xl overflow-hidden border border-black/15 bg-white/70">
                        <img src={exp.image} alt={`${exp.org} preview`} className="w-full h-auto object-cover block" />
                      </div>
                    )}
                    {exp.paragraphs.length > 0 ? (
                      exp.paragraphs.map((para, j) => (
                        <p key={j} className="text-black/90 text-sm md:text-base leading-relaxed mb-3 last:mb-0">
                          {para}
                        </p>
                      ))
                    ) : (
                      <p className="text-black/75 text-sm md:text-base leading-relaxed italic">
                        Building across product and engineering; more details coming soon.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
