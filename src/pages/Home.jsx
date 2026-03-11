import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLinkedin, FaGithub, FaInstagram, FaArrowRight, FaEnvelope, FaHeart } from "react-icons/fa";
import HalftoneBackground from "../components/HalftoneBackground";

export default function Home() {
  const navigate = useNavigate();
  const holdTimerRef = useRef(null);
  const [isHoldingHeart, setIsHoldingHeart] = useState(false);

  const startHeartHold = () => {
    setIsHoldingHeart(true);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      setIsHoldingHeart(false);
      navigate("/for-you");
    }, 2000);
  };

  const cancelHeartHold = () => {
    setIsHoldingHeart(false);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen w-full min-w-0 text-black overflow-x-hidden bg-white">
      {/* Editorial marquee — top of page, thin */}
      <div className="w-full overflow-hidden border-b border-black/10 py-1.5">
        <div className="flex animate-marquee whitespace-nowrap text-[11px] md:text-xs text-black/70 tracking-wide font-medium uppercase" style={{ width: "max-content" }}>
          <span className="inline-flex items-center gap-1 px-4 md:px-6">
            Hi! I'm Hanson, welcome to my site — currently building:
          </span>
          <Link to="/projects/sample8" className="inline-flex items-center px-4 md:px-6 hover:text-black transition-colors">
            SAMPLE 8
          </Link>
          <span className="px-1.5 text-black/40">·</span>
          <Link to="/experiences" className="inline-flex items-center px-4 md:px-6 hover:text-black transition-colors">
            Shown Space
          </Link>
          <span className="px-1.5 text-black/40">·</span>
          <Link to="/projects/macroboard" className="inline-flex items-center px-4 md:px-6 hover:text-black transition-colors">
            MacroBoard
          </Link>
          <span className="px-4 md:px-6 text-black/30">—</span>
          <span className="inline-flex items-center gap-1 px-4 md:px-6">
            Hi! I'm Hanson, welcome to my site — currently building:
          </span>
          <Link to="/projects/sample8" className="inline-flex items-center px-4 md:px-6 hover:text-black transition-colors">
            SAMPLE 8
          </Link>
          <span className="px-1.5 text-black/40">·</span>
          <Link to="/experiences" className="inline-flex items-center px-4 md:px-6 hover:text-black transition-colors">
            Shown Space
          </Link>
          <span className="px-1.5 text-black/40">·</span>
          <Link to="/projects/macroboard" className="inline-flex items-center px-4 md:px-6 hover:text-black transition-colors">
            MacroBoard
          </Link>
          <span className="px-4 md:px-6 text-black/30">—</span>
        </div>
      </div>

      {/* Masthead: small + medium = centered name row + highlights; lg+ = spread (Hanson, highlights, Qin right) */}
      <div className="w-full flex justify-center pt-3 md:pt-5 pb-1">
        <div className="max-w-2xl w-full px-3 md:px-5">
          {/* Small and medium: Hanson Qin in one row, then highlights, all centered */}
          <div className="flex flex-col items-center lg:hidden">
            <div className="flex flex-row items-baseline gap-2 md:gap-4">
              <h1 className="text-5xl md:text-7xl tracking-tight leading-none flex items-baseline text-black">
                <span className="text-[2.4em] leading-none" style={{ fontFamily: '"Luxurious Script", cursive' }}>H</span>
                <span style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800 }}>anson</span>
              </h1>
              <h1 className="text-5xl md:text-7xl tracking-tight leading-none flex items-baseline text-black">
                <span className="text-[2.4em] leading-none" style={{ fontFamily: '"Luxurious Script", cursive' }}>Q</span>
                <span style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800 }}>in</span>
              </h1>
            </div>
            <p className="text-sm mt-0.5 text-black/90" style={{ backgroundColor: "#fef08a", padding: "4px 6px", width: "fit-content" }}>Student developer & builder</p>
            <p className="text-sm mt-0.5 text-black/90" style={{ backgroundColor: "#fef08a", padding: "4px 6px", width: "fit-content" }}>Vancouver, Canada · Yale University</p>
          </div>
          {/* lg and up: spread layout — Hanson, highlights, then Qin bottom right */}
          <div className="hidden lg:block">
            <h1 className="text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none flex flex-wrap items-baseline text-black">
              <span className="text-[2.4em] leading-none" style={{ fontFamily: '"Luxurious Script", cursive' }}>H</span>
              <span style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800 }}>anson</span>
            </h1>
            <p className="text-sm md:text-base mt-0.5 text-black/90" style={{ backgroundColor: "#fef08a", padding: "4px 6px", width: "fit-content" }}>Student developer & builder</p>
            <p className="text-sm md:text-base mt-0.5 text-black/90" style={{ backgroundColor: "#fef08a", padding: "4px 6px", width: "fit-content" }}>Vancouver, Canada · Yale University</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none flex flex-wrap items-baseline justify-end -mt-50 mr-10 text-black">
              <span className="text-[2.4em] leading-none" style={{ fontFamily: '"Luxurious Script", cursive' }}>Q</span>
              <span style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800 }}>in</span>
            </h1>
          </div>
        </div>
      </div>

      {/* 4 sections — responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 pt-6 sm:pt-8 md:pt-10 px-3 sm:px-4 md:px-4 lg:px-6 w-full max-w-[1600px] mx-auto min-w-0">
        <Link to="/about" className="group relative rounded-xl sm:rounded-2xl overflow-hidden min-h-[110px] sm:min-h-[130px] md:min-h-[160px] border border-black/5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFE066] via-[#FCD34D] to-[#FBBF24]" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="jersey-25-heading text-[4rem] md:text-[5.5rem] font-bold text-black/10 select-none">About</span>
          </div>
          <div className="absolute inset-0 opacity-90">
            <HalftoneBackground width={400} height={220} dotSpacing={8} baseRadius={0.2} maxRadius={2.5} bgColor="transparent" dotColor="#1c1917" dotOpacity={0.12} />
          </div>
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest text-black/70 uppercase [writing-mode:vertical] [text-orientation:mixed] z-10">• Read more</span>
          <div className="relative z-10 flex items-end justify-between w-full p-4 md:p-5">
            <span className="jersey-25-heading font-bold text-lg sm:text-xl md:text-2xl text-black">About</span>
            <span className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 border-2 border-black/10 flex items-center justify-center text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-white shadow-sm">
              <FaArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        <Link to="/projects" className="group relative rounded-xl sm:rounded-2xl overflow-hidden min-h-[110px] sm:min-h-[130px] md:min-h-[160px] border border-black/5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7DD3FC] via-[#38BDF8] to-[#0EA5E9]" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="jersey-25-heading text-[4rem] md:text-[5.5rem] font-bold text-black/10 select-none">Projects</span>
          </div>
          <div className="absolute inset-0 opacity-90">
            <HalftoneBackground width={400} height={220} dotSpacing={8} baseRadius={0.2} maxRadius={2.5} bgColor="transparent" dotColor="#0c4a6e" dotOpacity={0.15} />
          </div>
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest text-black/70 uppercase [writing-mode:vertical] [text-orientation:mixed] z-10">• Read more</span>
          <div className="relative z-10 flex items-end justify-between w-full p-4 md:p-5">
            <span className="jersey-25-heading font-bold text-lg sm:text-xl md:text-2xl text-black">Projects</span>
            <span className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 border-2 border-black/10 flex items-center justify-center text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-white shadow-sm">
              <FaArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        <Link to="/experiences" className="group relative rounded-xl sm:rounded-2xl overflow-hidden min-h-[110px] sm:min-h-[130px] md:min-h-[160px] border border-black/5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F9A8D4] via-[#F472B6] to-[#EC4899]" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="jersey-25-heading text-[4rem] md:text-[5.5rem] font-bold text-black/10 select-none">Experience</span>
          </div>
          <div className="absolute inset-0 opacity-90">
            <HalftoneBackground width={400} height={220} dotSpacing={8} baseRadius={0.2} maxRadius={2.5} bgColor="transparent" dotColor="#831843" dotOpacity={0.12} />
          </div>
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest text-black/70 uppercase [writing-mode:vertical] [text-orientation:mixed] z-10">• Read more</span>
          <div className="relative z-10 flex items-end justify-between w-full p-4 md:p-5">
            <span className="jersey-25-heading font-bold text-lg sm:text-xl md:text-2xl text-black">Experience</span>
            <span className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 border-2 border-black/10 flex items-center justify-center text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-white shadow-sm">
              <FaArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        <Link to="/skills" className="group relative rounded-xl sm:rounded-2xl overflow-hidden min-h-[110px] sm:min-h-[130px] md:min-h-[160px] border border-black/5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#A7F3D0] via-[#34D399] to-[#10B981]" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="jersey-25-heading text-[4rem] md:text-[5.5rem] font-bold text-black/10 select-none">Skills</span>
          </div>
          <div className="absolute inset-0 opacity-90">
            <HalftoneBackground width={400} height={220} dotSpacing={8} baseRadius={0.2} maxRadius={2.5} bgColor="transparent" dotColor="#064e3b" dotOpacity={0.12} />
          </div>
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest text-black/70 uppercase [writing-mode:vertical] [text-orientation:mixed] z-10">• Read more</span>
          <div className="relative z-10 flex items-end justify-between w-full p-4 md:p-5">
            <span className="jersey-25-heading font-bold text-lg sm:text-xl md:text-2xl text-black">Skills</span>
            <span className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 border-2 border-black/10 flex items-center justify-center text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-white shadow-sm">
              <FaArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </div>

      {/* Social — responsive footer */}
      <div className="px-3 sm:px-4 md:px-5 lg:px-6 mt-6 sm:mt-8 pt-4 sm:pt-6 pb-4 sm:pb-5 flex flex-wrap justify-center gap-4 sm:gap-6 border-t border-black/10">
        <a href="https://www.linkedin.com/in/hanson-q/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-black hover:underline underline-offset-2 flex items-center gap-2" aria-label="LinkedIn">
          <FaLinkedin className="w-4 h-4 text-black/80" /> LinkedIn
        </a>
        <a href="https://www.instagram.com/hanson.q888/?hl=en" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-black hover:underline underline-offset-2 flex items-center gap-2" aria-label="Instagram">
          <FaInstagram className="w-4 h-4 text-black/80" /> Instagram
        </a>
        <a href="https://github.com/hansonq888" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-black hover:underline underline-offset-2 flex items-center gap-2" aria-label="GitHub">
          <FaGithub className="w-4 h-4 text-black/80" /> GitHub
        </a>
        <a href="mailto:hansonq888@gmail.com" className="text-sm font-medium text-black hover:underline underline-offset-2 flex items-center gap-2" aria-label="Email">
          <FaEnvelope className="w-4 h-4 text-black/80" /> Email
        </a>
        <button
          type="button"
          className="text-sm font-medium text-black hover:underline underline-offset-2 inline-flex items-center select-none"
          aria-label="For you (press and hold)"
          title="Press and hold"
          onPointerDown={startHeartHold}
          onPointerUp={cancelHeartHold}
          onPointerCancel={cancelHeartHold}
          onPointerLeave={cancelHeartHold}
          onContextMenu={(e) => e.preventDefault()}
        >
          <FaHeart className={`w-4 h-4 transition-opacity ${isHoldingHeart ? "opacity-100" : "opacity-80"}`} />
        </button>
      </div>
      <div className="pb-8" />
    </div>
  );
}
