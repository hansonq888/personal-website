import PageShell from "../components/PageShell";

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
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <h1 className="project-title-font text-white text-2xl md:text-3xl font-bold mb-6 border-b border-white/20 pb-3">
          Experience
        </h1>
        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="border border-white/20 p-4 md:p-5"
            >
              <h2 className="project-title-font text-white text-lg md:text-xl font-bold mb-1">
                {exp.role}
              </h2>
              <p className="geist-light text-white/80 text-sm md:text-base mb-0.5">
                {exp.url ? (
                  <a
                    href={exp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white underline underline-offset-2 transition-colors"
                  >
                    {exp.org}
                  </a>
                ) : (
                  exp.org
                )}
              </p>
              <p className="geist-light text-white/60 text-xs md:text-sm tracking-wide mb-4">
                {exp.dates}
              </p>
              {exp.paragraphs.map((para, j) => (
                <p
                  key={j}
                  className="geist-light text-white/90 text-sm md:text-base leading-relaxed mb-3 last:mb-0"
                >
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
