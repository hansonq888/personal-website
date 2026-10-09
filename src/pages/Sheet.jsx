import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { featuredProjects } from "../data/projects";
import { experiences } from "../data/experiences";
import { initGrounds, initDither } from "../components/sheet/grounds";
import "../styles/sheet.css";

const ROMAN = ["I", "II", "III", "IV", "V"];
const PAGES = ["Home", "About", "Experience", "Projects", "Skills"];

const SKILLS = [
  ["Languages", "Python / TypeScript / SQL / C++"],
  ["Frontend", "React / React Native / Next.js / Expo"],
  ["Systems", "WebAssembly / Audio DSP / Lock-free"],
  ["Infra", "Docker / AWS / CI-CD / Vercel"],
];

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
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => initGrounds(rootRef.current), []);
  useEffect(() => initDither(bandRef.current, "/vancouver-strip.jpg"), []);

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
        if (p.offsetTop - window.innerHeight * 0.4 <= top) cur = i;
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
    window.scrollTo({ top: el.offsetTop, behavior: reduce ? "auto" : "smooth" });
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

      {/* ---------------- I. HOME ---------------- */}
      <section className="panel dark" id="sheet-home" data-page="Home">
        <Spec left="Hanson Qin" leftSub="Software Engineer" right="INDEX.HTML" rightSub="1280X1080PX" />
        <div className="body" data-par=".035">
          <div>
            <p className="lab dim" style={{ marginBottom: 14 }}>Hi, I'm</p>
            <Giant text="Hanson" delay={120} />
            <Giant text="Qin" delay={340} />
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
          <div className="about-row">
            <div>
              <p className="lab">CS + Math @ Yale</p>
              <p className="lab dim">Vancouver, BC x New Haven, CT</p>
              <p className="lab dim" style={{ maxWidth: "38ch", marginTop: 20 }}>
                I build things that run in the browser and have no right to — an audio engine in C++,
                a model that rates how you train, stats for a sport nobody tracks.
              </p>
            </div>
            <img className="me" src="/sideeye.JPG" alt="Hanson Qin" data-par=".055" />
          </div>
        </div>
        <div className="band">
          <canvas ref={bandRef} data-cols="168" aria-hidden="true" />
          <p className="lab dim band-cap">VANCOUVER.BMP</p>
        </div>
      </section>

      {/* ---------------- III. EXPERIENCE ---------------- */}
      <section className="panel tall dark" id="sheet-experience" data-page="Experience">
        <Spec left="Experience" leftSub={`${experiences.length} Entries`} right="ROLES.TXT" rightSub="2025—2026" />
        <div className="body">
          <div className="roles">
            {experiences.map((x) => (
              <a className="role" key={x.org} href={x.url} target="_blank" rel="noreferrer">
                <span>{x.short.when}</span>
                <b>{x.role}</b>
                <i className="r">{x.short.where}</i>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- IV. PROJECTS ---------------- */}
      <section className="panel tall" id="sheet-projects" data-page="Projects">
        <Spec left="Projects" leftSub={`${featuredProjects.length} Entries`} right="GRID.JPG" rightSub="1600X900PX" />
        <div className="body">
          <div className="grid" ref={gridRef}>
            {featuredProjects.map((p) => (
              <Link className="card" key={p.id} to={`/projects/${p.id}`}>
                <div className="frame">{p.image ? <img src={p.image} alt="" loading="lazy" /> : null}</div>
                <div className="lbl"><b>{p.title}</b><i>{p.year}</i></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- V. SKILLS ---------------- */}
      <section className="panel" id="sheet-skills" data-page="Skills">
        <Spec left="Skills" leftSub="Working Stack" right="STACK.TXT" rightSub="Updated 2026" />
        <div className="body">
          <div className="skills">
            {SKILLS.map(([k, v]) => (
              <div className="skill" key={k}><b>{k}</b><span>{v}</span></div>
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
