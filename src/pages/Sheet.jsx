import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { featuredProjects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import { experiences } from "../data/experiences";
import { skillSections } from "../data/skills";

// three.js is a large chunk; it loads on its own rather than blocking the page
const ExperienceScene = lazy(() => import("../components/sheet/ExperienceScene"));
import { initGrounds, initDither } from "../components/sheet/grounds";
import "../styles/sheet.css";

const ROMAN = ["I", "II", "III", "IV", "V"];

// a fixed wobble, so the timeline reads as something laid out by hand
const LOOSE = [
  { nudge: "0px", tilt: "-2.6deg", pad: "34px" },
  { nudge: "46px", tilt: "1.9deg", pad: "26px" },
  { nudge: "18px", tilt: "-1.1deg", pad: "40px" },
  { nudge: "62px", tilt: "2.6deg", pad: "28px" },
];
const PAGES = ["Home", "About", "Experience", "Projects", "Skills"];


/* The hero is split per word, then per letter: each word stays in one
   unbreakable box, or the per-letter spans let it wrap mid-word. */
function Giant({ text, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const glyphs = ref.current?.querySelectorAll(".g") || [];
    const anims = [...glyphs].map((g, i) =>
      g.animate(
        [{ transform: "translateY(102%)" }, { transform: "translateY(0)" }],
        { duration: 520, delay: delay + i * 34, easing: "cubic-bezier(.22,1,.3,1)", fill: "both" }
      )
    );
    return () => anims.forEach((a) => a.cancel());
  }, [delay]);

  return (
    <p className="giant" ref={ref}>
      {text.split(" ").map((word, wi, all) => (
        <span className="w" key={wi}>
          {[...word].map((ch, ci) => (
            <span className="clip" key={ci}>
              <span className="g" style={{ transform: "translateY(102%)" }}>{ch}</span>
            </span>
          ))}
          {wi < all.length - 1 ? " " : null}
        </span>
      ))}
    </p>
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
  const rolesRef = useRef(null);
  const skillsRef = useRef(null);
  const arcRef = useRef(null);
  const tvRef = useRef(null);

  // the scene only loads where it is wanted: not under reduced-motion, and not
  // on a narrow screen where it would cost more than it gives
  const [use3D, setUse3D] = useState(false);
  useEffect(() => {
    const ok =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(min-width: 860px)").matches;
    if (!ok) return;
    const el = document.getElementById("sheet-experience");
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setUse3D(true); io.disconnect(); } }),
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
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

  // the polaroid tilts toward the cursor, with a sheen that tracks it — the
  // parallax lives on the wrapper so the two transforms never fight
  useEffect(() => {
    const wrap = meRef.current;
    if (!wrap || window.matchMedia("(pointer: coarse)").matches) return;
    const card = wrap.querySelector(".polaroid");
    if (!card) return;
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--ry", (x * 30).toFixed(2) + "deg");
      card.style.setProperty("--rx", (-y * 25).toFixed(2) + "deg");
      card.style.setProperty("--mx", (e.clientX - r.left).toFixed(0) + "px");
      card.style.setProperty("--my", (e.clientY - r.top).toFixed(0) + "px");
    };
    const onLeave = () => {
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--rx", "0deg");
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

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

    const RAIL_W = 150;                    // matches the node column in sheet.css
    const TIP = { x: 0.346, y: 0.994 };    // where the pencil's point sits in its image

    const layout = () => {
      const rows = [...list.querySelectorAll(".role")];
      if (!rows.length) return;
      const lb = list.getBoundingClientRect();
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

      const N = 640;
      let d = "";
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        // the wobble fades out at the very ends so the stroke starts and stops clean
        const taper = Math.min(1, Math.min(t, 1 - t) * 9);
        let x = baseX(t) + (wobble(t) - wob0 * (1 - taper)) * taper;
        let y = yTop + t * span + Math.sin(t * 6.283 * 9.3 + wob[1].ph) * 1.6 * taper;
        for (const lp of loops) {
          const dt = t - lp.c;
          if (Math.abs(dt) >= lp.w) continue;
          const phi = Math.PI * (dt / lp.w + 1);   // a full turn across the window
          x += lp.dir * lp.r * Math.sin(phi);
          y -= lp.r * (1 - Math.cos(phi)) * lp.squash;
        }
        d += (i ? "L" : "M") + x.toFixed(1) + "," + y.toFixed(1);
      }

      svg.setAttribute("viewBox", "0 0 " + RAIL_W + " " + Math.max(1, lb.height));
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
      smooth.lean = lerp(smooth.lean, clamp(off * 0.5, 24), 0.16);
      smooth.ry = lerp(smooth.ry, clamp(off * 0.8, 30), 0.14);
      smooth.rx = lerp(smooth.rx, clamp(-dy * 1.6, 16) + 6, 0.12);

      const w = pencil.offsetWidth || 300;
      const h = pencil.offsetHeight || 169;
      // the hand swings in from the right as the stroke starts and lifts away
      // at the end, rather than simply fading
      const IN = 0.07;
      const present = Math.max(0, Math.min(1, Math.min(p / IN, (1 - p) / IN)));
      const e = 1 - present;
      const ease = e * e;
      // a slow rock, as a wrist does while it writes
      const bob = Math.sin(at / 26) * 2.4 * present;

      pencil.style.transformOrigin = TIP.x * 100 + "% " + TIP.y * 100 + "%";
      pencil.style.transform =
        "translate3d(" + (x - TIP.x * w + ease * 300).toFixed(1) + "px," +
        (y - TIP.y * h + ease * 56).toFixed(1) + "px,0) " +
        "rotateX(" + (smooth.rx * present).toFixed(2) + "deg) " +
        "rotateY(" + (smooth.ry * present + ease * 26).toFixed(2) + "deg) " +
        "rotateZ(" + (smooth.lean + bob + ease * 18).toFixed(2) + "deg) " +
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
        <Spec left="Hanson Qin" leftSub="Software Engineer" right="INDEX.HTML" rightSub="1280X1080PX" />
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
          <h2 className="sec-title">About me</h2>
          <div className="about-row">
            <div>
              <p className="lab">CS + Math @ Yale</p>
              <p className="lab dim">Vancouver, BC x New Haven, CT</p>
              <p className="lab dim" style={{ maxWidth: "38ch", marginTop: 20 }}>
                I build things that run in the browser and have no right to — an audio engine in C++,
                a model that rates how you train, stats for a sport nobody tracks.
              </p>
              <img className="motif inv" src="/swimming_fish.gif" alt="" data-drift=".05"
                   style={{ width: "min(340px, 80%)", marginTop: 26 }} />
            </div>
            <div className="me-wrap" data-slide=".055" ref={meRef}>
              <div className="polaroid">
                <img src="/headshot.jpg" alt="Hanson Qin" />
                <p className="cap">HANSON QIN &middot; VANCOUVER</p>
              </div>
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
      <div className="panel-group paper" data-ground="Experience">
      <section className="panel tall" id="sheet-experience" data-page="Experience">
        <Spec left="Experience" leftSub={`${experiences.length} Entries`} right="ROLES.TXT" rightSub="2025—2026" />
        <div className="body">
          <div className="xp-band">
            {use3D ? (
              <Suspense fallback={null}>
                <ExperienceScene />
              </Suspense>
            ) : null}
            <h2 className="sec-title">Experience</h2>
          </div>
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
        <canvas className="dissolve" data-dissolve aria-hidden="true" />
        <Spec left="Projects" leftSub={`${featuredProjects.length} Entries`} right="GRID.JPG" rightSub="1600X900PX" />
        <div className="body">
          <h2 className="sec-title center">Projects</h2>
          <div className="proj-grid" data-fly="3" ref={gridRef}>
            {featuredProjects.map((p) => (
              <div key={p.id}><ProjectCard project={p} /></div>
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
                <span className="items" data-drift={i % 2 ? "-.03" : ".038"}>
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
