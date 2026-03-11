import PageShell from "../components/PageShell";
import HalftoneBackground from "../components/HalftoneBackground";

export default function About() {
  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black p-3 sm:p-4 md:p-6 lg:p-8 min-w-0">
        <div className="max-w-[1600px] mx-auto w-full">
          {/* Title only — colourful box */}
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-black/5 shadow-md mb-6 sm:mb-8 p-4 sm:p-6 md:p-8 min-h-[100px] sm:min-h-[120px] flex items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFE066] via-[#FCD34D] to-[#FBBF24]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="jersey-25-heading text-[4rem] md:text-[6rem] font-bold text-black/10 select-none">About</span>
            </div>
            <div className="absolute inset-0 opacity-90">
              <HalftoneBackground width={600} height={200} dotSpacing={8} baseRadius={0.2} maxRadius={2.5} bgColor="transparent" dotColor="#1c1917" dotOpacity={0.1} />
            </div>
            <div className="relative z-10">
              <h1 className="jersey-25-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-2">
                About
              </h1>
              <p className="text-sm md:text-base text-black/90" style={{ backgroundColor: "#FDE68A", padding: "4px 6px", width: "fit-content" }}>
                Get to know me
              </p>
            </div>
          </div>

          {/* Body — plain white */}
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 max-w-3xl w-full min-w-0">
            <div className="flex-1 space-y-4">
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
              <span className="text-black/60 text-xs tracking-widest uppercase block mt-4">
                New Haven, CT
              </span>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <div className="rounded-xl border border-black/10 overflow-hidden shadow-md w-32 sm:w-40 md:w-48 max-w-full mx-auto sm:mx-0">
                <img src="/AboutPhoto.jpg" alt="" className="w-full aspect-square object-cover block max-w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
