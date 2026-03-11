import PageShell from "../components/PageShell";
import HalftoneBackground from "../components/HalftoneBackground";

const experiences = [
  {
    role: "Founding Software Engineer",
    org: "Shown Space",
    url: "https://shownspace.com",
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
          {/* Title in colourful box */}
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-black/5 shadow-md mb-4 sm:mb-5 min-h-[90px] sm:min-h-[100px] p-4 sm:p-6 md:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F9A8D4] via-[#F472B6] to-[#EC4899]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="jersey-25-heading text-[3rem] md:text-[4rem] font-bold text-black/10 select-none">Experience</span>
            </div>
            <div className="absolute inset-0 opacity-90">
              <HalftoneBackground width={500} height={160} dotSpacing={8} baseRadius={0.2} maxRadius={2.5} bgColor="transparent" dotColor="#831843" dotOpacity={0.1} />
            </div>
            <div className="relative z-10">
              <h1 className="jersey-25-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-2">
                Experience
              </h1>
              <p className="text-sm md:text-base text-black/90" style={{ backgroundColor: "#FBCFE8", padding: "4px 6px", width: "fit-content" }}>
                Where I've worked
              </p>
            </div>
          </div>

          {/* Body — plain white cards */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            {experiences.map((exp, i) => (
              <div key={i} className="rounded-xl sm:rounded-2xl border border-black/10 bg-white p-4 sm:p-5 md:p-6 shadow-sm min-w-0">
                <h2 className="jersey-25-heading text-black text-lg sm:text-xl md:text-2xl font-bold mb-1">
                  {exp.role}
                </h2>
                <p className="text-black/80 text-sm md:text-base mb-0.5">
                  {exp.url ? (
                    <a href={exp.url} target="_blank" rel="noopener noreferrer" className="text-black/80 hover:text-black underline underline-offset-2 transition-colors">
                      {exp.org}
                    </a>
                  ) : (
                    exp.org
                  )}
                </p>
                <p className="text-black/60 text-xs md:text-sm tracking-wide mb-4">
                  {exp.dates}
                </p>
                {exp.paragraphs.map((para, j) => (
                  <p key={j} className="text-black/90 text-sm md:text-base leading-relaxed mb-3 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
