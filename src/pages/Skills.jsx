import { useEffect, useRef, useState } from "react";
import PageShell from "../components/PageShell";
import PageFrame from "../components/PageFrame";
import { skillSections } from "../data/skills";
import { INTER, LIGHT } from "../data/media";

/* The old sheet's stack screen, brought onto the white page: a giant title on
   the left, and on the right a dark set with a bevelled bezel and curved glass
   holding the numbered list. Like the sheet's set it stands turned slightly
   away and leans toward the cursor, so it reads as an object, not a box. */

const BEZEL = {
  background: "linear-gradient(170deg, #3a3a3f 0%, #232327 42%, #171719 100%)",
  boxShadow:
    "inset 0 2px 0 rgba(255,255,255,0.14), inset 0 -3px 0 rgba(0,0,0,0.6), 0 30px 70px rgba(0,0,0,0.28), 0 8px 20px rgba(0,0,0,0.2)",
};
const GLASS = {
  background: "radial-gradient(120% 120% at 50% 40%, #121216 0%, #09090b 70%, #050506 100%)",
  // the uneven radii are what give it the bowed glass
  borderRadius: "42px / 34px",
  boxShadow: "inset 0 0 0 2px #0b0b0d, inset 0 0 44px rgba(0,0,0,0.95), inset 0 0 120px rgba(0,0,0,0.75)",
};
const SCANLINES = {
  background: "repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.22) 3px, rgba(0,0,0,0.22) 4px)",
  mixBlendMode: "multiply",
  opacity: 0.7,
};
const GLARE = {
  background:
    "linear-gradient(118deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0) 38%), radial-gradient(70% 50% at 50% 0%, rgba(255,255,255,0.07), rgba(255,255,255,0) 70%)",
};
const SET_TYPE = { fontFamily: INTER, fontSize: 11, letterSpacing: "0.16em", color: "rgba(250,250,247,0.62)" };

// the resting lean, and how far the cursor can push it either way (degrees)
const REST_Y = -4;
const REST_X = 1.5;
const PUSH_Y = 8;
const PUSH_X = 5.5;

/* Where the cursor is relative to the set's centre, each axis in -1..1. Held
   still at the resting lean for anyone who has asked for less motion. */
function useTilt(ref) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onMove = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const clamp = (v) => Math.max(-1, Math.min(1, v));
        setTilt({
          x: clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)),
          y: clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)),
        });
      });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [ref]);
  return tilt;
}

function StackScreen() {
  const stage = useRef(null);
  const tilt = useTilt(stage);
  const turn = {
    transform: `rotateY(${REST_Y + tilt.x * PUSH_Y}deg) rotateX(${REST_X - tilt.y * PUSH_X}deg)`,
    transition: "transform 0.25s linear",
    transformStyle: "preserve-3d",
  };
  return (
    <div ref={stage} style={{ perspective: "1700px", perspectiveOrigin: "50% 46%" }}>
    <div className="rounded-[26px] px-4 pt-4 sm:px-[22px] sm:pt-[22px]" style={{ ...BEZEL, ...turn }}>
      <div className="relative overflow-hidden" style={GLASS}>
        <div className="relative z-[1] px-6 sm:px-10 py-10 sm:py-14">
          {skillSections.map((g, i) => (
            <div
              key={g.title}
              className="grid grid-cols-[2.2rem_1fr] sm:grid-cols-[2.6rem_11rem_1fr] gap-x-3 gap-y-1 py-3 border-t border-white/10 last:border-b"
              style={{ fontFamily: INTER, color: "rgba(250,250,247,0.92)" }}
            >
              <span className="text-sm tabular-nums" style={{ opacity: 0.55 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <b className="text-sm sm:text-[15px] font-normal uppercase tracking-wide">{g.title}</b>
              <span className="col-start-2 sm:col-start-auto text-sm sm:text-[15px]" style={{ ...LIGHT, color: "rgba(250,250,247,0.72)" }}>
                {g.skills.join(", ")}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 pointer-events-none" style={SCANLINES} aria-hidden />
        <div className="absolute inset-0 pointer-events-none" style={GLARE} aria-hidden />
      </div>
      <div className="flex items-center gap-4 px-1.5 pt-3 pb-3.5">
        <span className="whitespace-nowrap" style={SET_TYPE}>HANSON QIN</span>
        <span className="flex-1 h-px bg-white/10" aria-hidden />
        <span className="whitespace-nowrap" style={SET_TYPE}>STACK.TXT</span>
      </div>
    </div>
    </div>
  );
}

export default function Skills() {
  return (
    <PageShell>
      <PageFrame
        title="Skills"
        aside={
          <p className="text-[15px] leading-relaxed text-black/70 max-w-[46ch]" style={LIGHT}>
            I enjoy owning problems end-to-end, learning unfamiliar systems quickly, and turning complex ideas into reliable software. I care deeply about code quality, performance, and user experience, and I am comfortable stepping into uncomfortable technical territory to learn and deliver impact.
          </p>
        }
      >
        {/* set lower than the title and kept off the right edge, which the tilt swings toward */}
        <div className="lg:mt-[12vh] lg:pr-6">
          <StackScreen />
        </div>
      </PageFrame>
    </PageShell>
  );
}
