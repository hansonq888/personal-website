import PageShell from "../components/PageShell";

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
      <div className="min-h-screen bg-white text-black px-4 sm:px-8 md:px-12 pt-12 md:pt-16 pb-20 md:pb-28 min-w-0 overflow-x-hidden">
        <div className="relative w-full max-w-6xl mx-auto">
          <h1
            className="leading-[1] tracking-tight"
            style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: "clamp(4rem, 11vw, 10rem)" }}
          >
            Experience
          </h1>
          <p
            className="mt-4 sm:mt-5 uppercase tracking-[0.22em] text-[11px] sm:text-xs text-black/55"
            style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}
          >
            Where I have worked
          </p>

          <div className="mt-16 md:mt-20 flex flex-col gap-14 md:gap-20">
            {experiences.map((exp, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""
                }`}
              >
                <div className={i % 2 === 0 ? "md:pr-6" : "md:pl-6 md:translate-y-6"}>
                  <p
                    className="uppercase tracking-[0.24em] text-[10px] sm:text-xs text-black/45 mb-3"
                    style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}
                  >
                    {exp.dates}
                  </p>
                  <h2
                    className="leading-[0.95]"
                    style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800, fontSize: "clamp(1.8rem, 4.8vw, 3.6rem)" }}
                  >
                    {exp.role}
                  </h2>
                  <p className="mt-2 text-base text-black/70" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 400 }}>
                    {exp.url ? (
                      <a href={exp.url} target="_blank" rel="noopener noreferrer" className="hover:text-black underline underline-offset-2 transition-colors">
                        {exp.org}
                      </a>
                    ) : (
                      exp.org
                    )}
                  </p>

                  <div className="mt-8 md:mt-10 space-y-4">
                    {exp.paragraphs.length > 0 ? (
                      exp.paragraphs.map((para, j) => (
                        <p key={j} className="text-sm sm:text-base text-black/70 leading-relaxed max-w-[60ch]" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}>
                          {para}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm sm:text-base text-black/45 leading-relaxed italic" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}>
                        Building across product and engineering; more details coming soon.
                      </p>
                    )}
                  </div>
                </div>

                <div className={i % 2 === 0 ? "md:pl-8 md:-translate-y-4" : "md:pr-8"}>
                  {exp.image ? (
                    <img src={exp.image} alt={`${exp.org} preview`} className="w-full max-w-[460px] h-auto object-cover block" />
                  ) : (
                    <p
                      className="uppercase tracking-[0.22em] text-[10px] sm:text-xs text-black/35 pt-2"
                      style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}
                    >
                      Visual coming soon
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
