import PageShell from "../components/PageShell";
import HalftoneBackground from "../components/HalftoneBackground";

export default function Contact() {
  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black p-3 sm:p-4 md:p-6 lg:p-8 min-w-0">
        <div className="max-w-[1600px] mx-auto w-full">
          {/* Title only — colourful box */}
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-black/5 shadow-md mb-6 sm:mb-8 p-4 sm:p-6 md:p-8 min-h-[100px] sm:min-h-[120px] flex items-center max-w-2xl w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7DD3FC] via-[#38BDF8] to-[#0EA5E9]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="jersey-25-heading text-[4rem] md:text-[5rem] font-bold text-black/10 select-none">Contact</span>
            </div>
            <div className="absolute inset-0 opacity-90">
              <HalftoneBackground width={500} height={200} dotSpacing={8} baseRadius={0.2} maxRadius={2.5} bgColor="transparent" dotColor="#0c4a6e" dotOpacity={0.1} />
            </div>
            <div className="relative z-10">
              <h1 className="jersey-25-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-2">
                Contact
              </h1>
              <p className="text-sm md:text-base text-black/90" style={{ backgroundColor: "#BAE6FD", padding: "4px 6px", width: "fit-content" }}>
                Get in touch
              </p>
            </div>
          </div>

          {/* Body — plain white */}
          <div className="max-w-2xl w-full min-w-0">
            <p className="text-black/90 text-sm md:text-base leading-relaxed mb-4 sm:mb-6">
              <span className="italic">Always open to chat about projects, music, or anything else.</span>
              {" "}Feel free to reach out.
            </p>
            <div className="flex flex-col gap-3">
              <a href="mailto:hansonq888@gmail.com" className="block rounded-xl border border-black/10 bg-white px-4 py-3 text-black text-sm font-medium hover:bg-black/5 transition-colors">
                hansonq888@gmail.com
              </a>
              <a href="mailto:hanson.qin@yale.edu" className="block rounded-xl border border-black/10 bg-white px-4 py-3 text-black text-sm font-medium hover:bg-black/5 transition-colors">
                hanson.qin@yale.edu
              </a>
              <a href="https://www.linkedin.com/in/hanson-q/" target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-black/10 bg-white px-4 py-3 text-black text-sm font-medium hover:bg-black/5 transition-colors">
                LinkedIn
              </a>
              <a href="https://github.com/hansonq888" target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-black/10 bg-white px-4 py-3 text-black text-sm font-medium hover:bg-black/5 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
