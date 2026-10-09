import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { featuredProjects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import { experiences } from "../data/experiences";
import { skillSections } from "../data/skills";
import { initGrounds, initDither } from "../components/sheet/grounds";
import "../styles/sheet.css";

const ROMAN = ["I", "II", "III", "IV", "V"];

// the stack on About; whichever is clicked comes to the front
const PRINTS = [
  { id: "headshot", src: "/headshot.jpg", cap: "HEADSHOT.JPG" },
  { id: "sideeye", src: "/sideeye.JPG", cap: "SIDEEYE.JPG" },
  { id: "baby", src: "/AboutPhoto.jpg", cap: "ABOUTPHOTO.JPG" },
];
const LAYER = ["front", "back", "back2"];

// a fixed wobble, so the timeline reads as something laid out by hand
const LOOSE = [
  { nudge: "0px", tilt: "-2.6deg", pad: "34px" },
  { nudge: "46px", tilt: "1.9deg", pad: "26px" },
  { nudge: "18px", tilt: "-1.1deg", pad: "40px" },
  { nudge: "62px", tilt: "2.6deg", pad: "28px" },
];
const PAGES = ["Home", "About", "Experience", "Projects", "Skills"];


/* The hero is split per word, then per letter: each word stays in one
   unbreakable box, or the per-letter spans let it wrap mid-word. The letters
   swing down out of the page on a spring rather than wiping up. */
function Giant({ text, delay = 0 }) {
  const still = useReducedMotion();
  const words = text.split(" ");
  let n = 0;
  return (
    <p className="giant">
      {words.map((word, wi) => (
        <span className="w" key={wi}>
          {[...word].map((ch, ci) => {
            const i = n++;
            return (
              <motion.span
                className="g"
                key={ci}
                initial={still ? false : { opacity: 0, rotateX: -88, y: "0.34em", filter: "blur(10px)" }}
                animate={{ opacity: 1, rotateX: 0, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: (delay + i * 46) / 1000,
                  type: "spring",
                  stiffness: 140,
                  damping: 17,
                  mass: 0.9,
                }}
              >
                {ch}
              </motion.span>
            );
          })}
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </p>
  );
}

/* Text that settles into place a word at a time: each one rises out of a blur
   rather than simply fading, which is what makes it read as smooth rather than
   as a cut. Motion handles the stagger and the spring. */
const LINE = { hidden: {}, show: { transition: { staggerChildren: 0.03, delayChildren: 0.04 } } };
const WORD = {
  hidden: { opacity: 0, y: "0.55em", filter: "blur(7px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 190, damping: 25, mass: 0.7 },
  },
};

function Reveal({ as = "p", text, className, style }) {
  const still = useReducedMotion();
  const Tag = motion[as];
  if (still) {
    const Plain = as;
    return <Plain className={className} style={style}>{text}</Plain>;
  }
  const words = text.split(" ");
  return (
    <Tag
      className={className}
      style={style}
      variants={LINE}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={WORD} style={{ display: "inline-block", whiteSpace: "pre" }}>
          {i < words.length - 1 ? w + " " : w}
        </motion.span>
      ))}
    </Tag>
  );
}

function Spec({ left, leftSub, right, rightSub, bar = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // observe the section, not the label: a clip-path on the target zeroes its
    // own intersection ratio, so observing .spec directly would never fire
    const host = el.closest("[data-page]") || el;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }),
      { threshold: 0.12 }
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  return (
    <div className="spec" ref={ref}>
      <div><b>{left}</b><i>{leftSub}</i></div>
      {bar ? <span className="bar" aria-hidden="true" /> : null}
      <div className="r"><b>{right}</b><i>{rightSub}</i></div>
    </div>
  );
}

export default function Sheet() {
  const rootRef = useRef(null);
  const bandRef = useRef(null);
  const gridRef = useRef(null);
  const meRef = useRef(null);
  const [order, setOrder] = useState([0, 1, 2]);
  const bringToFront = (idx) =>
    setOrder((o) => [idx, ...o.filter((x) => x !== idx)]);
  const rolesRef = useRef(null);
  const skillsRef = useRef(null);
  const arcRef = useRef(null);
  const tvRef = useRef(null);

  const pencilRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  // Smooth scrolling. Lenis takes over the wheel and drives its own rAF, which
  // every rect-based effect on the page then follows for free. It is skipped
  // entirely under reduced-motion, where the native scroll is the right answer.
  const lenisRef = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;
    let raf = 0;
    const tick = (t) => { lenis.raf(t); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef.current = null; };
  }, []);

  useEffect(() => initGrounds(rootRef.current), []);
  useEffect(() => initDither(bandRef.current, "/vancouver-strip.jpg"), []);



  // one staggered run of children, used by the timeline and the skills index
  const useStagger = (ref, step, threshold) =>
    useEffect(() => {
      const list = ref.current;
      if (!list) return;
      const rows = [...list.children];
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        rows.forEach((r) => r.classList.add("in"));
        return;
      }
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => {
          if (!e.isIntersecting) return;
          setTimeout(() => e.target.classList.add("in"), Math.max(0, rows.indexOf(e.target)) * step);
          io.unobserve(e.target);
        }),
        { threshold }
      );
      rows.forEach((r) => io.observe(r));
      return () => io.disconnect();
    }, [ref, step, threshold]);

  useStagger(rolesRef, 110, 0.3);

  // the set warms up once, the way a CRT does
  useEffect(() => {
    const stage = tvRef.current;
    if (!stage) return;
    const tv = stage.querySelector(".tv");
    if (!tv) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tv.classList.add("on");
      return;
    }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { tv.classList.add("on"); io.disconnect(); } }),
      { threshold: 0.25 }
    );
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  // and it turns toward the pointer
  useEffect(() => {
    const stage = tvRef.current;
    if (!stage || window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      stage.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      stage.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    };
    const onLeave = () => {
      stage.style.setProperty("--mx", "0");
      stage.style.setProperty("--my", "0");
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // The rail is a bow rather than a straight line: each node is pushed out
  // along an arc by how far down the list it sits, and the curve is drawn
  // through the nodes so the two can never disagree.
  useEffect(() => {
    const list = rolesRef.current;
    const svg = arcRef.current;
    if (!list || !svg) return;
    const track = svg.querySelector(".arc-track");
    const ghost = svg.querySelector(".arc-ghost");
    const fill = svg.querySelector(".arc-fill");

    // a seeded generator, so the stroke is random-looking but identical on
    // every layout pass — a line that redrew itself differently each resize
    // would read as noise, not as a drawn line
    const seeded = (a) => () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const RAIL_W = 560;                    // matches .arc in sheet.css
    const TIP = { x: 0.346, y: 0.994 };    // where the pencil's point sits in its image

    const layout = () => {
      const rows = [...list.querySelectorAll(".role")];
      if (!rows.length) return;
      const lb = list.getBoundingClientRect();
      // reach all the way to the top of the section, so the stroke starts as
      // high as the panel allows rather than at the list
      const panel = list.closest(".panel");
      const pb = panel ? panel.getBoundingClientRect() : lb;
      const OFF_Y = Math.max(0, Math.round(lb.top - pb.top));
      list.style.setProperty("--off", OFF_Y + "px");
      const title = panel && panel.querySelector(".sec-title");
      const tb = title ? title.getBoundingClientRect() : null;
      const LEAD = {
        x: tb ? Math.min(RAIL_W - 40, tb.right - lb.left + 44) : 470,
        y: 26,
      };
      const bow = Math.min(66, lb.width * 0.08);
      const pts = rows.map((row) => {
        const node = row.querySelector(".node");
        const nb = node.getBoundingClientRect();
        return { row, node, y: nb.top - lb.top + nb.height / 2 };
      });
      const yTop = Math.max(0, pts[0].y - 48);
      const yEnd = Math.min(lb.height, pts[pts.length - 1].y + 48);
      const span = Math.max(1, yEnd - yTop);
      const baseX = (t) => bow * Math.sin(Math.PI * t);

      // the nodes sit on the bare bow, so a loop may never cover one
      const nodeT = pts.map((pt) => (pt.y - yTop) / span);
      pts.forEach((pt, i) => {
        pt.x = baseX(nodeT[i]);
        pt.node.style.setProperty("--ax", pt.x.toFixed(1) + "px");
      });

      // a loop in each gap, each one its own size and direction
      const rnd = seeded(20260409);
      const loops = [];
      for (let i = 0; i < nodeT.length - 1; i++) {
        const gap = nodeT[i + 1] - nodeT[i];
        if (gap <= 0.14) continue;
        loops.push({
          c: (nodeT[i] + nodeT[i + 1]) / 2 + (rnd() - 0.5) * gap * 0.22,
          w: Math.min(0.082, gap * (0.28 + rnd() * 0.12)),
          r: 24 + rnd() * 20,
          dir: rnd() < 0.45 ? -1 : 1,
          squash: 0.42 + rnd() * 0.3,
        });
      }

      // the hand wobble: three slow waves plus a fine tremor
      const wob = [0, 1, 2, 3].map(() => ({ ph: rnd() * 6.283 }));
      const AMP = [6.5, 3.2, 1.7, 0.9];
      const FRQ = [5.9, 13.7, 29.3, 61.1];
      const wobble = (t) => {
        let v = 0;
        for (let k = 0; k < 4; k++) v += AMP[k] * Math.sin(FRQ[k] * t * 6.283 + wob[k].ph);
        return v;
      };
      const wob0 = wobble(0);

      const body = [];
      const N = 640;
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        // the wobble fades out at the very ends so the stroke starts and stops clean
        const taper = Math.min(1, Math.min(t, 1 - t) * 9);
        let x = baseX(t) + (wobble(t) - wob0 * (1 - taper)) * taper;
        let y = OFF_Y + yTop + t * span + Math.sin(t * 6.283 * 9.3 + wob[1].ph) * 1.6 * taper;
        for (const lp of loops) {
          const dt = t - lp.c;
          if (Math.abs(dt) >= lp.w) continue;
          const phi = Math.PI * (dt / lp.w + 1);   // a full turn across the window
          x += lp.dir * lp.r * Math.sin(phi);
          y -= lp.r * (1 - Math.cos(phi)) * lp.squash;
        }
        body.push([x, y]);
      }

      // the stroke begins beside the title and sweeps down into the rail
      const lead = [];
      const L0 = [LEAD.x, LEAD.y];
      const L3 = body[0];
      const L1 = [LEAD.x - 150, LEAD.y + 40];
      const L2 = [L3[0] + 120, L3[1] - 150];
      for (let i = 0; i < 90; i++) {
        const u = i / 90, v = 1 - u;
        const bx = v*v*v*L0[0] + 3*v*v*u*L1[0] + 3*v*u*u*L2[0] + u*u*u*L3[0];
        const by = v*v*v*L0[1] + 3*v*v*u*L1[1] + 3*v*u*u*L2[1] + u*u*u*L3[1];
        const wob2 = Math.sin(u * 6.283 * 3.1 + wob[2].ph) * 2.6 * Math.min(1, u * 6);
        lead.push([bx + wob2, by + wob2 * 0.4]);
      }

      const all = lead.concat(body);
      let d = "";
      for (let i = 0; i < all.length; i++) {
        d += (i ? "L" : "M") + all[i][0].toFixed(1) + "," + all[i][1].toFixed(1);
      }

      svg.setAttribute("viewBox", "0 0 " + RAIL_W + " " + Math.max(1, lb.height + OFF_Y));
      track.setAttribute("d", d);
      ghost.setAttribute("d", d);
      fill.setAttribute("d", d);
      const len = fill.getTotalLength ? fill.getTotalLength() : 1000;
      list.style.setProperty("--len", len.toFixed(1));
      ghost.style.strokeDasharray = len.toFixed(1);
      list._railLen = len;
    };

    // the pencil's point rides the end of the drawn stroke, leaning into the
    // direction it is travelling
    const pencil = pencilRef.current;
    let raf = 0;
    const smooth = { lean: 0, ry: 0, rx: 0 };
    const lerp = (a, b, k) => a + (b - a) * k;
    const ride = () => {
      raf = requestAnimationFrame(ride);
      if (!pencil || !fill.getPointAtLength) return;
      const len = list._railLen || 0;
      if (!len) return;
      const p = parseFloat(list.style.getPropertyValue("--p")) || 0;
      // presence runs on the unheld progress, so the hand is already in place
      // and waiting before the stroke starts moving
      const pr = parseFloat(list.style.getPropertyValue("--pr")) || 0;
      const sb = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      if (!vb || !vb.width || !vb.height) return;

      const at = len * p;
      const pt = fill.getPointAtLength(at);
      // a second sample a little further on gives the direction of travel
      const ahead = fill.getPointAtLength(Math.min(len, at + 7));
      const sx = sb.width / vb.width;
      const sy = sb.height / vb.height;
      const x = pt.x * sx;
      const y = pt.y * sy;
      const dx = (ahead.x - pt.x) * sx;
      const dy = (ahead.y - pt.y) * sy;

      // the rail runs downward, so measure the lean off vertical
      const off = Math.atan2(dx, Math.max(0.001, Math.abs(dy))) * (180 / Math.PI);
      const clamp = (v, m) => Math.max(-m, Math.min(m, v));
      // a lighter lean, and a slower filter on it, so the hand settles rather
      // than reacting to every kink in the line
      smooth.lean = lerp(smooth.lean, clamp(off * 0.12, 6), 0.045);
      smooth.ry = lerp(smooth.ry, clamp(off * 0.17, 7), 0.04);
      smooth.rx = lerp(smooth.rx, clamp(-dy * 0.34, 4) + 2, 0.035);

      const w = pencil.offsetWidth || 300;
      const h = pencil.offsetHeight || 169;
      // the hand swings in from the right as the stroke starts and lifts away
      // at the end, rather than simply fading
      // it arrives and then stays: there is no exit, so it rests on the end of
      // the stroke once the line is finished
      const IN = 0.045;
      const present = Math.max(0, Math.min(1, pr / IN));
      const e = 1 - present;
      const ease = e * e;
      // a slow rock, as a wrist does while it writes
      const bob = Math.sin(at / 70) * 0.4 * present;

      pencil.style.transformOrigin = TIP.x * 100 + "% " + TIP.y * 100 + "%";
      // it comes down from above rather than in from the corner
      pencil.style.transform =
        "translate3d(" + (x - TIP.x * w + ease * 60).toFixed(1) + "px," +
        (y - TIP.y * h - ease * 340).toFixed(1) + "px,0) " +
        "rotateX(" + (smooth.rx * present).toFixed(2) + "deg) " +
        "rotateY(" + (smooth.ry * present + ease * 10).toFixed(2) + "deg) " +
        "rotateZ(" + (smooth.lean + bob - ease * 12).toFixed(2) + "deg) " +
        "scale(" + (1 - ease * 0.18).toFixed(3) + ")";
      // the shadow swings opposite the tilt, which is what reads as height
      const sh = clamp(-smooth.ry * 0.7, 22);
      pencil.style.filter =
        "drop-shadow(" + sh.toFixed(1) + "px " + (18 + Math.abs(smooth.rx) * 0.6).toFixed(1) +
        "px " + (20 + Math.abs(sh)).toFixed(1) + "px rgba(0,0,0," + (0.3 * present).toFixed(3) + "))";
      pencil.style.opacity = present.toFixed(3);
    };
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) raf = requestAnimationFrame(ride);

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(list);
    window.addEventListener("resize", layout);
    const t = setTimeout(layout, 600);   // once the stagger has settled
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", layout);
      clearTimeout(t);
    };
  }, []);

  // the plates turn a little toward the pointer, the polaroid's trick at a
  // fraction of the angle
  useEffect(() => {
    const list = rolesRef.current;
    if (!list || window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e) => {
      const shot = e.target.closest?.(".shot");
      if (!shot) return;
      const r = shot.getBoundingClientRect();
      shot.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 16).toFixed(2) + "deg");
      shot.style.setProperty("--rx", (-((e.clientY - r.top) / r.height - 0.5) * 13).toFixed(2) + "deg");
    };
    const onOut = (e) => {
      const shot = e.target.closest?.(".shot");
      if (shot) { shot.style.setProperty("--ry", "0deg"); shot.style.setProperty("--rx", "0deg"); }
    };
    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerout", onOut);
    return () => {
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerout", onOut);
    };
  }, []);
  useStagger(skillsRef, 70, 0.25);

  // the project grid cuts in, one card at a time
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        [...grid.children].forEach((c, i) => setTimeout(() => c.classList.add("in"), i * 55));
        io.disconnect();
      }),
      { threshold: 0.1 }
    );
    io.observe(grid);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const panels = [...root.querySelectorAll("[data-page]")];
    const onScroll = () => {
      const top = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (top / max) * 100 : 0);
      let cur = 0;
      panels.forEach((p, i) => {
        const y = p.getBoundingClientRect().top + top;
        if (y - window.innerHeight * 0.4 <= top) cur = i;
      });
      setCurrent(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i) => (e) => {
    e.preventDefault();
    const el = document.getElementById("sheet-" + PAGES[i].toLowerCase());
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const y = el.getBoundingClientRect().top + window.scrollY;
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.3 });
    else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="sheet" ref={rootRef}>
      <div className="sheet-progress"><i style={{ width: progress.toFixed(2) + "%" }} /></div>

      <div className="sheet-bar">
        <span className="sig">Hanson Qin</span>
        <nav aria-label="Sections">
          {PAGES.map((p, i) => (
            <a key={p} href={"#sheet-" + p.toLowerCase()} onClick={go(i)}
               aria-current={i === current ? "true" : "false"}>
              <u>{ROMAN[i]}</u><b>{p}</b>
            </a>
          ))}
        </nav>
      </div>

      {/* ------------- I + II share one ground ------------- */}
      <div className="panel-group deep sparkle streaks" data-ground="Home">
      <section className="panel" id="sheet-home" data-page="Home">
        <Spec left="Hanson Qin" leftSub="Software Engineer" right="hansonqin.com" rightSub="New Haven, CT" />
        <div className="body" data-par=".035">
          <div className="hero-row">
            <div>
              <p className="lab dim" style={{ marginBottom: 14 }}>Hi, I'm</p>
              <Giant text="Hanson" delay={120} />
              <Giant text="Qin" delay={340} />
            </div>
            <img className="hero-gif" src="/ezgif.com-gif-maker.gif" alt="" />
          </div>
        </div>
        <div className="foot">
          <div>
            <p className="lab">Yale University</p>
            <p className="lab dim">Vancouver, BC x New Haven, CT</p>
          </div>
          <p className="lab dim">Scroll</p>
        </div>
      </section>

      {/* ---------------- II. ABOUT ---------------- */}
      <section className="panel" id="sheet-about" data-page="About">
        <Spec left="About" leftSub="Bitmap Session" right="HEADSHOT.JPG" rightSub="800X800PX" />
        <div className="body">
          <div className="title-row">
            <h2 className="sec-title">About me</h2>
            <img className="motif inv" src="/swimming_fish.gif" alt="" data-swim=".5"
                 style={{ width: "min(320px, 24vw)" }} />
          </div>
          <div className="about-row">
            <div>
              <Reveal className="lab" text="CS + Math @ Yale" />
              <Reveal className="lab dim" text="Vancouver, BC x New Haven, CT" />
              <Reveal
                className="lab dim"
                style={{ maxWidth: "38ch", marginTop: 20 }}
                text="I build low-level systems and ship them on the web: a C++ audio engine compiled to WebAssembly, a model that rates how you train, and live analytics for ultimate frisbee."
              />
            </div>
            <div className="me-wrap" data-slide=".055" data-fan ref={meRef}>
              {order.map((idx, pos) => {
                const print = PRINTS[idx];
                return (
                  <button
                    type="button"
                    key={print.id}
                    className={"polaroid " + LAYER[pos]}
                    onClick={() => bringToFront(idx)}
                    aria-label={"Bring " + print.cap + " to the front"}
                  >
                    <img src={print.src} alt={print.id === "headshot" ? "Hanson Qin" : ""} />
                    <p className="cap">{print.cap}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="band">
          <canvas ref={bandRef} data-cols="168" aria-hidden="true" />
          <p className="lab dim band-cap">VANCOUVER.BMP</p>
        </div>
      </section>
      </div>

      {/* ------------- III + IV share one ground ------------- */}
      <div className="panel-group paper sparkle" data-ground="Experience">
      <section className="panel tall" id="sheet-experience" data-page="Experience">
        <Spec left="Experience" leftSub={`${experiences.length} Entries`} right="ROLES.TXT" rightSub="2025—2026" />
        <div className="body">
          <h2 className="sec-title">Experience</h2>
          <div className="roles" ref={rolesRef} data-progress data-lit>
            <svg className="arc" ref={arcRef} aria-hidden="true" preserveAspectRatio="none">
              <path className="arc-track" />
              <path className="arc-ghost" />
              <path className="arc-fill" />
            </svg>
            <img className="pencil" ref={pencilRef} src="/pencl.png" alt="" aria-hidden="true" />
            {experiences.map((x, i) => (
              <a
                className="role"
                key={x.org}
                href={x.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  "--nudge": LOOSE[i % LOOSE.length].nudge,
                  "--tilt": LOOSE[i % LOOSE.length].tilt,
                  "--pad": LOOSE[i % LOOSE.length].pad,
                }}
              >
                <span className="node" aria-hidden="true" />
                <span className="when">{x.short.when}</span>
                <span className="who">
                  <b>{x.role}</b>
                  <i>{x.short.where}</i>
                </span>
                <span className="shot" data-drift={i % 2 ? "-.042" : ".055"}>
                  {x.image ? <img src={x.image} alt="" loading="lazy" /> : null}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- IV. PROJECTS ---------------- */}
      <section className="panel tall" id="sheet-projects" data-page="Projects" data-ground="Projects">
        <Spec left="Projects" leftSub={`${featuredProjects.length} Entries`} right="GRID.JPG" rightSub="1600X900PX" />
        <div className="body">
          <h2 className="sec-title center">Projects</h2>
          <div className="proj-grid" data-fly="3" ref={gridRef}>
            {featuredProjects.map((p) => (
              <div key={p.id}><ProjectCard project={p} demo /></div>
            ))}
          </div>
        </div>
      </section>
      </div>

      {/* ---------------- V. SKILLS ---------------- */}
      <section className="panel deep" id="sheet-skills" data-page="Skills" data-ground="Skills">
        <Spec left="Skills" leftSub={`${skillSections.length} Groups`} right="STACK.TXT" rightSub="Updated 2026" bar />
        <div className="body">
          <div className="title-row">
            <h2 className="sec-title">Skills</h2>
            <img className="motif inv" src="/dotted_star_shining.gif" alt=""
                 style={{ width: "min(220px, 44vw)" }} />
          </div>
          <div className="tv-stage" ref={tvRef} data-tilt3d>
          <div className="tv">
            <div className="tv-screen">
              <div className="tv-content">
          <div className="skills" ref={skillsRef} data-lit>
            {skillSections.map((g, i) => (
              <div className="skill" key={g.title}>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <b>{g.title}</b>
                <span className="items">
                  {g.skills.map((it, j) => (
                    <span key={it}>
                      {it}
                      {j < g.skills.length - 1 ? <em aria-hidden="true">/</em> : null}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
              </div>
              <div className="tv-scan" aria-hidden="true" />
              <div className="tv-glare" aria-hidden="true" />
            </div>
            <div className="tv-base">
              <span className="tv-brand">HANSON QIN</span>
              <span className="tv-dial" aria-hidden="true" />
              <span className="tv-ch">CH 005 &middot; STACK.TXT</span>
            </div>
          </div>
          </div>
        </div>
        <div className="sheet-foot">
          <a href="mailto:hanson.qin@yale.edu">hanson.qin@yale.edu</a>
          <a href="https://github.com/hansonq888" target="_blank" rel="noreferrer">github.com/hansonq888</a>
          <a href="https://www.linkedin.com/in/hansonqin/" target="_blank" rel="noreferrer">linkedin</a>
        </div>
      </section>
    </div>
  );
}
