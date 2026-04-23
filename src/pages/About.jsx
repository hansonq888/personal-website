import PageShell from "../components/PageShell";
import HalftoneBackground from "../components/HalftoneBackground";

export default function About() {
  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black p-3 sm:p-4 md:p-6 lg:p-8 min-w-0">
        <div className="max-w-[1600px] mx-auto w-full">
          {/* Big playful hero */}
          <div className="relative rounded-2xl overflow-hidden border border-black/10 shadow-xl mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f472b6] via-[#e879f9] to-[#fb923c]" />
            <div className="absolute inset-0 opacity-80">
              <HalftoneBackground width={1300} height={520} dotSpacing={11} baseRadius={0.12} maxRadius={1.6} bgColor="transparent" dotColor="#111827" dotOpacity={0.12} />
            </div>
            <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-8 items-center">
                <div>
                  <p className="text-[10px] sm:text-xs font-bold tracking-[0.22em] uppercase text-black/70 mb-2">Profile</p>
                  <h1 className="jersey-25-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.85] text-black">
                    About
                  </h1>
                  <p className="mt-2 inline-flex text-xs sm:text-sm text-black/85 px-2.5 py-1 bg-white/70 border border-black/10 rounded-full">
                    Get to know me
                  </p>
                  <p className="mt-4 text-black/80 text-sm sm:text-base md:text-lg max-w-2xl leading-snug">
                    Builder, designer, and problem-solver focused on creating useful systems with personality.
                  </p>
                </div>
                <div className="relative">
                  <div className="rounded-2xl border-2 border-black/15 overflow-hidden bg-white/70 shadow-2xl rotate-[-1.5deg] hover:rotate-0 transition-transform duration-500 max-w-[320px] sm:max-w-[360px] md:max-w-[420px] mx-auto">
                    <img src="/AboutPhoto.jpg" alt="" className="w-full h-auto object-cover block" />
                    <div className="p-2.5 border-t border-black/10 bg-white/80">
                      <span className="text-[11px] tracking-wide uppercase text-black/60">New Haven, CT</span>
                    </div>
                  </div>
                  <span className="absolute -top-2 -right-1 sm:right-2 text-[10px] sm:text-xs px-2 py-1 rounded-full bg-black text-white tracking-[0.14em] uppercase">
                    student dev
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Artistic body composition */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="lg:col-span-2 rounded-2xl border border-black/10 bg-white shadow-sm p-4 sm:p-5 md:p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-50 pointer-events-none">
                <HalftoneBackground width={900} height={360} dotSpacing={12} baseRadius={0.1} maxRadius={1.2} bgColor="transparent" dotColor="#0f172a" dotOpacity={0.08} />
              </div>
              <div className="relative z-10 space-y-4">
                <p className="text-black/90 text-sm md:text-base leading-relaxed">
                  <span className="italic">Yale sophomore originally from Vancouver, Canada, studying CS & Mathematics.</span>
                  {" "}I build software, work in ML and design, and like to mix code and creativity.
                </p>
                <p className="text-black/90 text-sm md:text-base leading-relaxed">
                  Outside of academics, I love playing ultimate frisbee, exploring music production, and staying active. I'm always excited to learn new skills, tackle challenging problems, and share knowledge with others.
                </p>
                <p className="text-black/90 text-sm md:text-base leading-relaxed">
                  This site is a space to showcase my work, projects, and explorations in technology, design, and music.
                </p>
                <span className="text-black/60 text-xs tracking-[0.14em] uppercase block pt-1">
                  New Haven, CT
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-black/10 shadow-sm p-4 bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]">
                <p className="text-[10px] uppercase tracking-[0.18em] text-black/60 mb-2">Focus</p>
                <p className="jersey-25-heading text-2xl sm:text-3xl text-black leading-none">Code x Design</p>
                <p className="text-xs sm:text-sm text-black/80 mt-2">I care about both technical depth and product feel.</p>
              </div>
              <div className="rounded-2xl border border-black/10 shadow-sm p-4 bg-gradient-to-br from-[#fce7f3] via-[#f9a8d4] to-[#f472b6]">
                <p className="text-[10px] uppercase tracking-[0.18em] text-black/60 mb-2">Interests</p>
                <p className="jersey-25-heading text-2xl sm:text-3xl text-black leading-none">AI · Music · Systems</p>
                <p className="text-xs sm:text-sm text-black/80 mt-2">Building things that are useful, expressive, and robust.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
