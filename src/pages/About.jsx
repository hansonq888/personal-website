import PageShell from "../components/PageShell";

export default function About() {
  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black px-4 sm:px-8 md:px-12 pt-12 md:pt-16 pb-20 md:pb-28 min-w-0 overflow-x-hidden">
        <div className="relative w-full max-w-6xl mx-auto">
          <h1
            className="leading-[0.9] tracking-tight"
            style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: "clamp(4rem, 11vw, 10rem)" }}
          >
            About
          </h1>

          <p
            className="mt-1 sm:mt-2 uppercase tracking-[0.22em] text-[11px] sm:text-xs text-black/55"
            style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}
          >
            Random notes about me
          </p>

          <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="space-y-5 md:space-y-6">
              <p
                className="leading-tight"
                style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: "clamp(1.5rem, 4vw, 2.8rem)" }}
              >
                Yale sophomore from Vancouver.
              </p>

              <p
                className="max-w-[32ch] leading-[1.35] text-black/75"
                style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300, fontSize: "clamp(1rem, 2.2vw, 1.5rem)" }}
              >
                I build software, work with ML, and enjoy finding that sweet spot where code, design, and story all click.
              </p>

              <p
                className="uppercase tracking-[0.25em] text-black/45 text-xs"
                style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}
              >
                New Haven, CT x Vancouver, BC
              </p>
            </div>

            <div className="w-full md:pl-8 lg:pl-14 md:-mt-6">
              <img src="/AIheadshot.jpg" alt="" className="w-full max-w-[170px] ml-auto h-auto object-cover block" />
            </div>
          </div>

          <div className="mt-14 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <p
                className="uppercase tracking-[0.22em] text-[10px] sm:text-xs text-black/50 mb-2"
                style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}
              >
                Focus
              </p>
              <p
                className="leading-none"
                style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800, fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
              >
                Code x Design
              </p>
            </div>

            <div className="md:translate-y-8">
              <p
                className="uppercase tracking-[0.22em] text-[10px] sm:text-xs text-black/50 mb-2"
                style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}
              >
                Interests
              </p>
              <p
                className="leading-[1.05]"
                style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800, fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
              >
                AI · Music · Systems
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
