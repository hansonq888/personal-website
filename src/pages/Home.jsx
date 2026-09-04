import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub, FaInstagram, FaEnvelope } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen w-full min-w-0 text-black overflow-x-hidden bg-white flex flex-col relative">
      {/* Hero */}
      <div className="flex-1 flex flex-col justify-center items-center px-3 pt-8 pb-4">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
          <div className="w-full flex justify-start">
            <div className="w-full max-w-[520px] leading-[0.18] text-left">
              <p
                className="mb-4"
                style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: "clamp(3rem, 18vw, 16rem)", letterSpacing: "-0.02em", lineHeight: 1 }}
              >
                Hi! I&apos;m
              </p>
              <div
                className="flex items-baseline justify-start"
                style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: "clamp(3rem, 18vw, 16rem)", letterSpacing: "-0.02em", lineHeight: 1 }}
              >
                <span>Hanson</span>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center md:justify-end md:-mt-44">
            <div className="w-full max-w-[520px] flex flex-col items-center">
              <img
                className="w-full h-auto block"
                src="/ezgif.com-gif-maker.gif"
                alt="Animated intro"
              />
              <nav className="mt-3 sm:mt-4 flex flex-wrap justify-center items-center gap-5 sm:gap-7">
                <Link to="/about"       className="text-sm tracking-wide hover:underline underline-offset-2" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}>About</Link>
                <Link to="/experiences" className="text-sm tracking-wide hover:underline underline-offset-2" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}>Experience</Link>
                <Link to="/projects"    className="text-sm tracking-wide hover:underline underline-offset-2" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}>Projects</Link>
                <Link to="/skills"      className="text-sm tracking-wide hover:underline underline-offset-2" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}>Skills</Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="w-full max-w-6xl mt-8 sm:mt-10 mb-12 md:mb-20 flex items-start">
          <div style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}>
            <p className="text-sm tracking-wide">--STUDENT DEV & BUILDER</p>
            <p className="text-sm tracking-wide">:YALE · VANCOUVER</p>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="px-3 sm:px-5 py-3 flex flex-wrap justify-between items-center gap-4 border-t border-black flex-shrink-0">
        <p className="text-[11px] tracking-wide" style={{ fontFamily: '"Inter", sans-serif' }}>© 2026 Hanson Qin</p>
        <div className="flex items-center gap-4 sm:gap-5">
          <a href="https://www.linkedin.com/in/hanson-q/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-black hover:opacity-50 transition-opacity">
            <FaLinkedin className="w-4 h-4" />
          </a>
          <a href="https://www.instagram.com/hanson.q888/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-black hover:opacity-50 transition-opacity">
            <FaInstagram className="w-4 h-4" />
          </a>
          <a href="https://github.com/hansonq888" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-black hover:opacity-50 transition-opacity">
            <FaGithub className="w-4 h-4" />
          </a>
          <a href="mailto:hansonq888@gmail.com" aria-label="Email" className="text-black hover:opacity-50 transition-opacity">
            <FaEnvelope className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
