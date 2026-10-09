import { useEffect, useRef, useState } from "react";
import { featuredProjects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import { experiences } from "../data/experiences";
import { skillSections } from "../data/skills";
import { initGrounds, initDither } from "../components/sheet/grounds";
import "../styles/sheet.css";

const ROMAN = ["I", "II", "III", "IV", "V"];
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

function Spec({ left, leftSub, right, rightSub }) {
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
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

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
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
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
      <div className="panel-group deep sparkle" data-ground="Home">
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
        <Spec left="About" leftSub="Bitmap Session" right="HANSON.JPG" rightSub="1616X1080PX" />
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
            </div>
            <div className="me-wrap" data-slide=".055" ref={meRef}>
              <div className="polaroid">
                <img src="/sideeye.JPG" alt="Hanson Qin" />
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
          <h2 className="sec-title">Experience</h2>
          <div className="roles" ref={rolesRef}>
            {experiences.map((x) => (
              <a className="role" key={x.org} href={x.url} target="_blank" rel="noreferrer">
                <span className="when">{x.short.when}</span>
                <span className="node" aria-hidden="true" />
                <span className="who">
                  <b>{x.role}</b>
                  <i>{x.short.where}</i>
                </span>
                <span className="shot">
                  {x.image ? <img src={x.image} alt="" loading="lazy" /> : null}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- IV. PROJECTS ---------------- */}
      <section className="panel tall" id="sheet-projects" data-page="Projects">
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
        <Spec left="Skills" leftSub={`${skillSections.length} Groups`} right="STACK.TXT" rightSub="Updated 2026" />
        <div className="body">
          <h2 className="sec-title">Skills</h2>
          <div className="skills" ref={skillsRef}>
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
        <div className="sheet-foot">
          <a href="mailto:hanson.qin@yale.edu">hanson.qin@yale.edu</a>
          <a href="https://github.com/hansonq888" target="_blank" rel="noreferrer">github.com/hansonq888</a>
          <a href="https://www.linkedin.com/in/hansonqin/" target="_blank" rel="noreferrer">linkedin</a>
        </div>
      </section>
    </div>
  );
}
