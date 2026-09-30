import PageShell from "../components/PageShell";

const experiences = [
  {
    role: "Software Engineer Intern",
    org: "Kira Learning",
    url: "https://www.kira-learning.com/",
    image: "/kira.avif",
    dates: "June 2026 – August 2026 · New York",
  },
  {
    role: "Founding Software Engineer",
    org: "Shown Space",
    url: "https://shownspace.com",
    image: "/shownspace-logo.png",
    dates: "November 2025 – Present",
    blurb: "Building the web app, mobile app, and data pipelines for a sports analytics platform.",
  },
  {
    role: "Software Engineer",
    org: "Yale Cancer Center — Blenman Innovation Group",
    url: "https://blenmaninnovationgroup.org/",
    image: "/blenman.png",
    dates: "January 2026 – Present · New Haven, CT",
  },
  {
    role: "Head of Sponsorships",
    org: "Yale AI Association",
    url: "https://www.yale-ai.org/",
    image: "/yale-ai.png",
    dates: "September 2025 – Present · New Haven, CT",
    blurb: "Leading sponsorship outreach for Yale's AI student organization.",
  },
];

export default function Experiences() {
  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black px-4 sm:px-8 md:px-12 pt-12 md:pt-16 pb-20 md:pb-28 min-w-0 overflow-x-hidden">
        <div className="relative w-full max-w-6xl mx-auto">
          <div className="flex items-end gap-10 sm:gap-16 md:gap-24 flex-wrap">
            <h1
              className="leading-[0.9] tracking-tight"
              style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: "clamp(2.75rem, 12vw, 10rem)", letterSpacing: "-0.02em" }}
            >
              Experience
            </h1>
            <img
              src="/realistic_dot_matrix_dog_running.gif"
              alt=""
              className="w-[120px] sm:w-[160px] md:w-[200px] h-auto block select-none pointer-events-none mb-3 md:mb-6"
            />
          </div>

          <div className="mt-12 md:mt-16 flex flex-col">
            {experiences.map((exp, i) => (
              <article
                key={i}
                className="grid grid-cols-1 md:grid-cols-12 gap-y-4 gap-x-6 lg:gap-x-10 items-start border-t border-black/15 py-9 md:py-12 last:border-b last:border-black/15"
              >
                <p
                  className="md:col-span-3 uppercase tracking-[0.18em] text-[10px] sm:text-xs text-black/45 md:pt-2"
                  style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}
                >
                  {exp.dates}
                </p>

                <div className="md:col-span-5 min-w-0">
                  <h2
                    className="leading-[0.95]"
                    style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: "clamp(1.7rem, 3.6vw, 2.8rem)", letterSpacing: "-0.01em" }}
                  >
                    {exp.role}
                  </h2>
                  <p className="mt-1.5 text-base text-black/70" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 400 }}>
                    {exp.url ? (
                      <a href={exp.url} target="_blank" rel="noopener noreferrer" className="hover:text-black underline underline-offset-2 transition-colors">
                        {exp.org}
                      </a>
                    ) : (
                      exp.org
                    )}
                  </p>
                  {exp.blurb && (
                    <p className="mt-4 text-sm sm:text-base text-black/70 leading-relaxed max-w-[44ch]" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}>
                      {exp.blurb}
                    </p>
                  )}
                </div>

                <div className="md:col-span-4 min-w-0">
                  {exp.image && (
                    <img
                      src={exp.image}
                      alt={`${exp.org} preview`}
                      className="w-full max-w-[320px] md:max-w-full h-auto object-cover block"
                    />
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
