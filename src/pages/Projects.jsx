import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projects } from "../data/projects";
import PageShell from "../components/PageShell";

const SHOW_IDS = [
  "sample8",
  "dealsignal-ai",
  "macroboard",
  "realtor-website",
  "live-chord-detector",
  "priority-email-labeler",
  "mini-shell",
  "mini-compiler",
];
const displayedProjects = SHOW_IDS.map((id) => projects.find((p) => p.id === id)).filter(Boolean);
const N = displayedProjects.length;
const NAVBAR_H = 0;
const STEP   = 150;
const TILT   = 25;
const EXPAND = 55;

const lerp  = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export default function Projects() {
  const navigate   = useNavigate();
  const cardRefs   = useRef([]);
  const rafRef     = useRef(null);
  const animVals   = useRef(
    displayedProjects.map((_, i) => ({ y: i * STEP, opacity: 1, expandScale: 1, rotX: -TILT }))
  );

  const hoverRef       = useRef(false);
  const expandRef      = useRef(0);
  const selectedRef    = useRef(null);
  const closingRef     = useRef(false);
  const closingCardRef = useRef(null);
  const timerRef       = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef = useRef(0);
  const [labelKey, setLabelKey] = useState(0);

  const [selectedId,  setSelectedId]  = useState(null);
  const [detailReady, setDetailReady] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  const selectedProj = displayedProjects.find(p => p.id === selectedId);

  const openDetail = (id) => {
    if (selectedRef.current) return;
    hoverRef.current    = false;
    selectedRef.current = id;
    setSelectedId(id);
    setDetailReady(false);
    timerRef.current = setTimeout(() => setDetailReady(true), 520);
  };

  const closeDetail = () => {
    setDetailReady(false);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      closingCardRef.current = selectedRef.current;
      closingRef.current     = true;
      selectedRef.current    = null;
      timerRef.current = setTimeout(() => {
        closingRef.current     = false;
        closingCardRef.current = null;
        timerRef.current = setTimeout(() => {
          setSelectedId(null);
        }, 700);
      }, 600);
    }, 60);
  };

  useEffect(() => {
    const vh = () => window.innerHeight - NAVBAR_H;

    const tick = () => {
      const scrollProgress = clamp(window.scrollY / vh(), 0, N - 1);
      const floored        = Math.floor(scrollProgress);

      if (floored !== activeRef.current) {
        activeRef.current = floored;
        setActiveIndex(floored);
        setLabelKey(k => k + 1);
      }

      const isAnySelected = selectedRef.current !== null;
      const isClosing     = closingRef.current;
      if (isAnySelected) hoverRef.current = false;

      expandRef.current = lerp(expandRef.current, hoverRef.current ? 1 : 0, 0.08);
      const expand = expandRef.current;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const card        = displayedProjects[i];
        const isSelected  = card.id === selectedRef.current;
        const isReturning = card.id === closingCardRef.current;
        const rel = i - scrollProgress;
        const cur = animVals.current[i];

        if (isSelected) {
          cur.y           = lerp(cur.y,           0,    0.08);
          cur.opacity     = 1;
          cur.expandScale = lerp(cur.expandScale, 1.35, 0.07);
          cur.rotX        = lerp(cur.rotX,        0,    0.08);
          el.style.transform = `translateY(${cur.y.toFixed(2)}px) perspective(600px) rotateX(${cur.rotX.toFixed(2)}deg) scale(${cur.expandScale.toFixed(4)})`;
          el.style.opacity   = "1";
          el.style.zIndex    = String(N + 5);
        } else if (isReturning) {
          const T = 0.11;
          cur.y           = lerp(cur.y,           rel * STEP, T);
          cur.expandScale = lerp(cur.expandScale, 1,          T);
          cur.rotX        = lerp(cur.rotX,        -TILT,      T);
          cur.opacity     = 1;
          el.style.transform = `translateY(${cur.y.toFixed(2)}px) perspective(600px) rotateX(${cur.rotX.toFixed(2)}deg) scale(${cur.expandScale.toFixed(4)})`;
          el.style.opacity   = "1";
          el.style.zIndex    = String(i + 1);
        } else {
          const expandAmt = rel > 0 ? EXPAND * 5 : EXPAND;
          cur.y           = lerp(cur.y, rel * (STEP + expand * expandAmt), 0.10);
          cur.opacity     = lerp(cur.opacity, (isAnySelected || isClosing) ? 0 : 1, 0.07);
          cur.expandScale = lerp(cur.expandScale, 1, 0.10);
          const flatness  = Math.max(0, 1 - Math.abs(rel)) * expand;
          cur.rotX        = lerp(cur.rotX, -TILT * (1 - flatness), 0.10);
          el.style.transform = `translateY(${cur.y.toFixed(2)}px) perspective(600px) rotateX(${cur.rotX.toFixed(2)}deg)`;
          el.style.opacity   = cur.opacity.toFixed(3);
          el.style.zIndex    = String(i + 1);
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const proj = displayedProjects[activeIndex];

  return (
    <PageShell>
      <div aria-hidden style={{ height: `calc(${N} * 100dvh)` }} />

      <div
        style={{
          position: "fixed", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", background: "#ffffff", zIndex: 10, cursor: "default",
        }}
      >
        {/* Card stack */}
        <div style={{ position: "relative", width: isMobile ? "min(92vw, 440px)" : "min(480px, 64vw)", aspectRatio: "16 / 10" }}>
          {displayedProjects.map((p, i) => (
            <div
              key={p.id}
              ref={el => { cardRefs.current[i] = el; }}
              onClick={() => openDetail(p.id)}
              onMouseEnter={() => { if (!selectedRef.current) hoverRef.current = true; }}
              onMouseLeave={() => { hoverRef.current = false; }}
              onTouchStart={() => { if (!selectedRef.current) hoverRef.current = true; }}
              onTouchEnd={() => { hoverRef.current = false; }}
              onTouchCancel={() => { hoverRef.current = false; }}
              style={{
                position: "absolute", inset: 0,
                overflow: "hidden", cursor: "pointer",
                background: "#d8d4cc", willChange: "transform, opacity",
                transformOrigin: "center center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.12)",
              }}
            >
              {p.image && (
                <img src={p.image} alt="" draggable={false} style={{
                  width: "100%", height: "100%",
                  objectFit: "cover", objectPosition: "top",
                  display: "block", userSelect: "none", pointerEvents: "none",
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Stack chrome */}
        <div style={{
          position: "absolute", inset: 0,
          opacity: selectedId ? 0 : 1, transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute", top: isMobile ? 88 : "50%", left: isMobile ? 16 : 36,
            transform: isMobile ? "none" : "translateY(-50%)",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            <div style={{ overflow: "hidden", height: "2rem" }}>
              <p key={labelKey} style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: "clamp(1.15rem, 2.4vw, 1.7rem)", fontWeight: 700, letterSpacing: "-0.01em",
                color: "rgba(0,0,0,0.88)", lineHeight: 1, whiteSpace: "nowrap",
                animation: "vpLabelIn 0.42s cubic-bezier(0.25,0.46,0.45,0.94) both",
              }}>{proj?.title}</p>
            </div>
            <div key={`t${labelKey}`} style={{ display: "flex", gap: 10, animation: "vpLabelIn 0.42s 0.06s cubic-bezier(0.25,0.46,0.45,0.94) both" }}>
              {proj?.tech?.slice(0, 3).map(t => (
                <span key={t} style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500, fontSize: 9, letterSpacing: "0.18em", color: "rgba(0,0,0,0.50)", textTransform: "uppercase" }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ position: "absolute", top: isMobile ? 56 : 72, right: isMobile ? 16 : 36 }}>
            <p style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500, fontSize: 10, letterSpacing: "0.26em", color: "rgba(0,0,0,0.32)", textTransform: "uppercase" }}>
              {String(activeIndex + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </p>
          </div>

          <div style={{
            position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            opacity: activeIndex === 0 ? 1 : 0, transition: "opacity 0.7s ease",
          }}>
            <p style={{ fontFamily: '"Inter", sans-serif', fontWeight: 500, fontSize: 8, letterSpacing: "0.32em", color: "rgba(0,0,0,0.28)", textTransform: "uppercase" }}>scroll</p>
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden>
              <line x1="5" y1="0" x2="5" y2="14" stroke="rgba(0,0,0,0.28)" strokeWidth="1.2" strokeLinecap="round"/>
              <polyline points="2,10 5,14 8,10" stroke="rgba(0,0,0,0.28)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Detail panel */}
        {selectedId && (
          <div
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: isMobile ? "center" : "flex-end",
              padding: isMobile ? "0 16px 20px 16px" : "0 60px",
              opacity: detailReady ? 1 : 0,
              transform: detailReady ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.45s ease, transform 0.45s ease",
              pointerEvents: detailReady ? "auto" : "none",
              zIndex: N + 15,
            }}
          >
            <div style={{ width: isMobile ? "100%" : "auto", maxWidth: isMobile ? 520 : 280, display: "flex", flexDirection: "column", gap: 18, background: isMobile ? "rgba(255,255,255,0.94)" : "transparent", padding: isMobile ? "14px 14px 10px 14px" : 0 }}>
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: "clamp(1.2rem, 2.4vw, 1.7rem)", fontWeight: 700, letterSpacing: "-0.01em", color: "rgba(0,0,0,0.88)", lineHeight: 1.1 }}>
                {selectedProj?.title}
              </p>
              <p style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300, fontSize: 13, color: "rgba(0,0,0,0.60)", lineHeight: 1.7 }}>
                {selectedProj?.description}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedProj?.tech?.map(t => (
                  <span key={t} style={{
                    fontFamily: '"Inter", sans-serif', fontWeight: 500,
                    fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "rgba(0,0,0,0.45)", border: "1px solid rgba(0,0,0,0.15)", padding: "3px 8px",
                  }}>{t}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                {selectedProj?.website && (
                  <a href={selectedProj.website} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: '"Inter", sans-serif', fontWeight: 500,
                    fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "rgba(0,0,0,0.7)", textDecoration: "none",
                    borderBottom: "1px solid rgba(0,0,0,0.25)", paddingBottom: 2,
                  }}>Live site →</a>
                )}
                {selectedProj?.github && (
                  <a href={selectedProj.github} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: '"Inter", sans-serif', fontWeight: 500,
                    fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "rgba(0,0,0,0.7)", textDecoration: "none",
                    borderBottom: "1px solid rgba(0,0,0,0.25)", paddingBottom: 2,
                  }}>GitHub →</a>
                )}
                {selectedProj?.video && (
                  <a href={selectedProj.video} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: '"Inter", sans-serif', fontWeight: 500,
                    fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "rgba(0,0,0,0.7)", textDecoration: "none",
                    borderBottom: "1px solid rgba(0,0,0,0.25)", paddingBottom: 2,
                  }}>Demo →</a>
                )}
              </div>
              <button onClick={closeDetail} style={{
                alignSelf: "flex-start", background: "transparent", border: "none",
                fontFamily: '"Inter", sans-serif', fontWeight: 500,
                padding: 0, cursor: "pointer", fontSize: 9, letterSpacing: "0.26em",
                textTransform: "uppercase", color: "rgba(0,0,0,0.35)", marginTop: 4,
              }}>← back</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes vpLabelIn {
          from { transform: translateY(105%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </PageShell>
  );
}
