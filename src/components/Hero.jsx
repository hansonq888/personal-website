import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";

const GLOW_BTN_MAX = 120;
const GLOW_BTN_MIN = 40;
const CUTOUT_BASE = "/cutout%20letters";
// "Hanson Qin" — each entry is either { src, alt } or { space: true }
const NAME_LETTERS = [
  { src: `${CUTOUT_BASE}/h.webp`, alt: "H" },
  { src: `${CUTOUT_BASE}/A.webp`, alt: "a" },
  { src: `${CUTOUT_BASE}/N.webp`, alt: "n" },
  { src: `${CUTOUT_BASE}/S.png`, alt: "s" },
  { src: `${CUTOUT_BASE}/O.webp`, alt: "o" },
  { src: `${CUTOUT_BASE}/N2.png`, alt: "n" },
  { space: true, nameBreak: true },
  { src: `${CUTOUT_BASE}/Q1.webp`, alt: "Q" },
  { src: `${CUTOUT_BASE}/I.webp`, alt: "i" },
  { src: `${CUTOUT_BASE}/N3.png`, alt: "n" },
];
const LETTER_PHASE_SCALE = 0.72;
const LETTER_PHASE_FLOAT_X = 0.48;
const LETTER_PHASE_FLOAT_Y = 0.61;
// Per-letter variation (deterministic from index): tilt in degrees, size scale
function letterTilt(i) {
  return ((i * 37) % 17) - 8;
}
function letterSizeScale(i) {
  return 0.82 + ((i * 23) % 19) / 95;
}

export default function Hero({ compact = false }) {
  const nameRef = useRef(null);
  const sectionRef = useRef(null);
  const newHavenRef = useRef(null);
  const [glowButtons, setGlowButtons] = useState(() => Array(5).fill(0));
  const [letterTime, setLetterTime] = useState(0);
  const [lineCoords, setLineCoords] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });

  const handleMouseMove = useCallback((e) => {
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
    let lastMove = 0;
    const throttleMs = 80;
    const onMove = (e) => {
      const now = performance.now();
      if (now - lastMove >= throttleMs) {
        lastMove = now;
        handleMouseMove(e);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const start = performance.now();
    let rafId;
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      setLetterTime(elapsed);
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

  const getGlowStyle = (intensity) => {
    if (intensity <= 0) {
      return { textShadow: "none", transition: "text-shadow 0.25s ease-out" };
    }
    const combined = Math.min(1, intensity * 0.6 + 0.05);
    return {
      textShadow: `0 0 ${14 + combined * 28}px rgba(255,255,255,${0.08 + combined * 0.35}), 0 0 ${32 + combined * 50}px rgba(255,255,255,${0.04 + combined * 0.12})`,
      transition: "text-shadow 0.25s ease-out",
    };
  };

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden bg-black ${compact ? "flex-1 flex flex-col justify-center min-h-0" : "min-h-screen"}`}
    >
      {!compact && (
        <>
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-[1] hidden md:block"
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
          <div
            className="absolute z-10 pointer-events-none -translate-x-1/2 hidden md:block"
            style={{ left: lineCoords.x1, top: lineCoords.y2 + 12 }}
            aria-hidden
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]">
              <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2z" fill="currentColor" />
            </svg>
          </div>
          <div ref={newHavenRef} className="absolute top-4 md:top-8 left-4 md:left-12 z-10">
            <span className="geist-light text-white text-xs md:text-sm tracking-[0.2em] block">Student developer & builder</span>
            <span className="geist-light text-white text-xs md:text-sm tracking-[0.2em] block mt-1">New Haven, CT</span>
          </div>
        </>
      )}
      <div className={`absolute inset-0 z-10 flex justify-center items-center pointer-events-none overflow-hidden px-2 ${compact ? "py-2" : "pt-[8vh] pb-[28vh] md:pt-0 md:pb-0"}`}>
        <div className="flex flex-col items-center gap-2 md:gap-3 pointer-events-auto w-full max-w-full min-w-0">
          <h1
            ref={nameRef}
            className="flex justify-center items-end flex-wrap max-w-full min-w-0"
            style={{ gap: 0 }}
          >
            {NAME_LETTERS.map((item, i) => {
              const isSpace = !!item.space;
              const phaseScale = i * LETTER_PHASE_SCALE;
              const phaseX = i * LETTER_PHASE_FLOAT_X;
              const phaseY = i * LETTER_PHASE_FLOAT_Y;
              const breathScale = 1 + 0.07 * Math.sin(letterTime * 1.3 + phaseScale);
              const sizeScale = letterSizeScale(i);
              const tilt = letterTilt(i);
              const floatX = 2.2 * Math.sin(letterTime * 0.35 + phaseX);
              const floatY = 1.6 * Math.cos(letterTime * 0.4 + phaseY);
              const transform = isSpace
                ? undefined
                : `translate(${floatX}px, ${floatY}px) rotate(${tilt}deg) scale(${breathScale * sizeScale})`;
              const baseHeight = compact
                ? "clamp(3.25rem, 10vw, 5.5rem)"
                : "clamp(5.5rem, 20vw, 11rem)";
              return (
                <span
                  key={i}
                  className="inline-block origin-bottom will-change-transform"
                  style={{
                    transform,
                    marginRight: isSpace ? undefined : "-0.8em",
                    ...(isSpace ? { width: item.nameBreak ? "2.8em" : "0.2em", minWidth: item.nameBreak ? "1.5em" : "0.2em", flexShrink: 0 } : {}),
                  }}
                >
                  {isSpace ? (
                    <span aria-hidden className="inline-block w-full" />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-auto object-contain block align-bottom"
                      style={{ height: baseHeight }}
                      draggable={false}
                    />
                  )}
                </span>
              );
            })}
          </h1>
          {compact ? (
            <Link
              to="/about"
              className="geist-light flex items-center justify-center gap-1.5 text-white/90 hover:text-white text-xs md:text-sm tracking-wide mt-1 md:mt-2 max-w-md text-center transition-colors line-clamp-2"
            >
              <span>Yale sophomore originally from Vancouver, Canada. I build software, work in ML and design…</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
              <Link
                to="/about"
                data-glow-btn
                className="octosale bg-transparent text-white text-sm md:text-base border-2 border-white px-3 py-1.5 md:px-4 md:py-2 hover:bg-white hover:text-black transition-colors tracking-wider"
                style={getGlowStyle(glowButtons[1] ?? 0)}
              >
                About
              </Link>
              <Link
                to="/projects"
                data-glow-btn
                className="octosale bg-transparent text-white text-sm md:text-base border-2 border-white px-3 py-1.5 md:px-4 md:py-2 hover:bg-white hover:text-black transition-colors tracking-wider"
                style={getGlowStyle(glowButtons[2] ?? 0)}
              >
                Projects
              </Link>
              <Link
                to="/contact"
                data-glow-btn
                className="octosale bg-transparent text-white text-sm md:text-base border-2 border-white px-3 py-1.5 md:px-4 md:py-2 hover:bg-white hover:text-black transition-colors tracking-wider"
                style={getGlowStyle(glowButtons[3] ?? 0)}
              >
                Contact
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
