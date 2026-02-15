import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";

const GLOW_BTN_MAX = 120;
const GLOW_BTN_MIN = 40;
const GLOW_NAME_MAX = 180;
const GLOW_NAME_MIN = 60;
const NAME_TEXT = "Hanson Qin";
const BREATH_CYCLE_MS = 16000; // one full inhale+exhale (much slower)
const ROTATE_LETTER_INDICES = [1, 4, 8]; // a few letters get subtle rotation (a, o, i)

export default function Hero() {
  const nameRef = useRef(null);
  const sectionRef = useRef(null);
  const newHavenRef = useRef(null);
  const cursorRef = useRef({ x: 0, y: 0 });
  const [glowButtons, setGlowButtons] = useState(() => Array(5).fill(0));
  const [glowLetters, setGlowLetters] = useState(() => Array(NAME_TEXT.length).fill(0));
  const [lineCoords, setLineCoords] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const [breath, setBreath] = useState(0);
  const [breathTime, setBreathTime] = useState(0);

  const handleMouseMove = useCallback((e) => {
    const pos = { x: e.clientX, y: e.clientY };
    cursorRef.current = pos;
    if (nameRef.current) {
      const letters = nameRef.current.querySelectorAll(".letter");
      if (letters.length > 0) {
        const newGlow = Array.from(letters).map((el) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const d = Math.hypot(e.clientX - cx, e.clientY - cy);
          return d < GLOW_NAME_MIN ? 1 : d > GLOW_NAME_MAX ? 0 : 1 - (d - GLOW_NAME_MIN) / (GLOW_NAME_MAX - GLOW_NAME_MIN);
        });
        setGlowLetters(newGlow);
      }
    }
    if (sectionRef.current) {
      const btns = sectionRef.current.querySelectorAll("[data-glow-btn]");
      if (btns.length > 0) {
        const newBtnGlow = Array.from(btns).map((el) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const d = Math.hypot(e.clientX - cx, e.clientY - cy);
          return d < GLOW_BTN_MIN ? 1 : d > GLOW_BTN_MAX ? 0 : 1 - (d - GLOW_BTN_MIN) / (GLOW_BTN_MAX - GLOW_BTN_MIN);
        });
        setGlowButtons(newBtnGlow);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const start = performance.now();
    let rafId;
    const tick = () => {
      const t = (performance.now() - start) / BREATH_CYCLE_MS;
      setBreathTime(t);
      const b = (1 + Math.sin(t * 2 * Math.PI)) / 2;
      setBreath(b);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const updateLine = () => {
      if (!sectionRef.current || !newHavenRef.current || !nameRef.current) return;
      const section = sectionRef.current.getBoundingClientRect();
      const from = newHavenRef.current.getBoundingClientRect();
      const to = nameRef.current.getBoundingClientRect();
      const gap = 32;
      const x = from.left - section.left;
      const y1 = from.bottom - section.top + gap;
      const y2 = to.top - section.top - gap;
      setLineCoords({ x1: x, y1, x2: x, y2 });
    };
    updateLine();
    window.addEventListener("resize", updateLine);
    const t = requestAnimationFrame(updateLine);
    return () => {
      window.removeEventListener("resize", updateLine);
      cancelAnimationFrame(t);
    };
  }, []);

  const getGlowStyle = (intensity, breathAmount = 0.5) => {
    const combined = Math.min(1, intensity * 0.6 + 0.05 + 0.9 * breathAmount);
    return {
      textShadow: combined > 0
        ? `0 0 ${14 + combined * 28}px rgba(255,255,255,${0.08 + combined * 0.35}), 0 0 ${32 + combined * 50}px rgba(255,255,255,${0.04 + combined * 0.12})`
        : "none",
      transition: "text-shadow 0.25s ease-out",
    };
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* Thin line from New Haven to name */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        aria-hidden
      >
        <line
          x1={lineCoords.x1}
          y1={lineCoords.y1}
          x2={lineCoords.x2}
          y2={lineCoords.y2}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* White star — right under the SVG line */}
      <div
        className="absolute z-10 pointer-events-none -translate-x-1/2"
        style={{
          left: lineCoords.x1,
          top: lineCoords.y2 + 12,
        }}
        aria-hidden
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-white/75 drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]"
        >
          <path
            d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Top left — labels */}
      <div ref={newHavenRef} className="absolute top-4 md:top-8 left-4 md:left-12 z-10">
        <span className="geist-light text-white/75 text-[10px] md:text-xs tracking-[0.2em] block">
          Student developer & builder
        </span>
        <span className="geist-light text-white/75 text-[10px] md:text-xs tracking-[0.2em] block mt-1">
          New Haven, CT
        </span>
      </div>

      {/* Top right — about me */}
      <div className="absolute top-4 md:top-8 right-4 md:right-12 z-10 text-right max-w-[75%] md:max-w-md md:max-w-lg px-2 md:px-0">
        <p className="geist-light text-white/75 text-sm md:text-base leading-relaxed">
          <span className="geist-light-italic text-white/75">
            Yale sophomore studying CS & Mathematics.
          </span>{" "}
          I build software, dabble in ML and design, and like to mix code and creativity. When I'm not coding, I'm on the ultimate field or messing with music.
        </p>
        <Link
          to="/about"
          data-glow-btn
          className="geist-light text-white/75 text-xs tracking-widest mt-4 inline-block transition-opacity hover:opacity-90"
          style={getGlowStyle(glowButtons[0] ?? 0)}
        >
          More about me →
        </Link>
      </div>

      {/* Center — name (each letter breathes at a different time via phase offset) */}
      <div className="absolute inset-0 z-10 flex justify-center items-center pointer-events-none">
        <h1
          ref={nameRef}
          className="hero-name-font text-[clamp(2.5rem,10vw,6rem)] md:text-[clamp(3.5rem,12vw,8rem)] leading-[0.92] text-white/75 font-bold flex justify-center items-center flex-wrap pointer-events-auto"
        >
          {NAME_TEXT.split("").map((char, i) => {
            const phase = (breathTime + i * 0.18) * 2 * Math.PI;
            const letterBreath = (1 + Math.sin(phase)) / 2;
            const scale = 0.96 + 0.08 * letterBreath;
            const rotateDeg = ROTATE_LETTER_INDICES.includes(i)
              ? (letterBreath - 0.5) * 6
              : 0;
            const transform =
              rotateDeg !== 0
                ? `scale(${scale}) rotate(${rotateDeg}deg)`
                : `scale(${scale})`;
            return (
              <span
                key={i}
                className="letter inline-block origin-center"
                style={{
                  ...getGlowStyle(glowLetters[i] ?? 0, letterBreath),
                  transform,
                }}
              >
                {char}
              </span>
            );
          })}
        </h1>
      </div>

      {/* Bottom right — nav */}
      <div className="absolute bottom-4 md:bottom-8 right-4 md:right-12 z-10 flex flex-col items-end gap-4">
        <div className="flex flex-wrap justify-end gap-2">
          <Link
            to="/about"
            data-glow-btn
            className="geist-light text-white/75 text-[10px] md:text-xs border border-white/30 rounded-full px-4 py-2 hover:bg-white/10 transition-colors tracking-wider"
            style={getGlowStyle(glowButtons[1] ?? 0)}
          >
            About
          </Link>
          <Link
            to="/projects"
            data-glow-btn
            className="geist-light text-white/75 text-[10px] md:text-xs border border-white/30 rounded-full px-4 py-2 hover:bg-white/10 transition-colors tracking-wider"
            style={getGlowStyle(glowButtons[2] ?? 0)}
          >
            Projects
          </Link>
          <Link
            to="/contact"
            data-glow-btn
            className="geist-light text-white/75 text-[10px] md:text-xs border border-white/30 rounded-full px-4 py-2 hover:bg-white/10 transition-colors tracking-wider"
            style={getGlowStyle(glowButtons[3] ?? 0)}
          >
            Contact
          </Link>
        </div>
        <Link
          to="/projects"
          data-glow-btn
          className="geist-light text-white/75 text-xs tracking-widest transition-opacity hover:opacity-90"
          style={getGlowStyle(glowButtons[4] ?? 0)}
        >
          Explore work
        </Link>
      </div>
    </section>
  );
}
