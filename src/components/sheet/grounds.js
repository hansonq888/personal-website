/* ============================================================================
   Section backgrounds for the long-scroll sheet.

   Each section owns its own canvas and its own renderer, so the light/dark
   change lands on a hard horizontal edge rather than a crossfade, and no two
   pages share a texture. Projects deliberately gets none.

   init(root) wires everything up and returns a teardown function.
   ========================================================================== */

const CELL = 6;
const PHI = 1.6180339887;

// Floyd–Steinberg weather. base is the paper level (higher = less ink),
// gx/gy tilt the density across the frame, each lobe is
// [freqU, freqV, amplitude, drift].
const WEATHER = {
  // one field for Home and About together: open cloud, tilted so it gathers
  // toward the skyline at the foot of the run
  Home: {
    base: 0.88, gx: 0, gy: -0.18,
    L: [[2.3, 1.1, 0.1, 0.000045], [-1.4, 2.7, 0.07, -0.000031], [5.1, -3.3, 0.05, 0.000068]],
  },
};

// section -> [renderer, parallax factor]. Negative moves against the scroll.
const SYSTEM = {
  Home: ["dither", 0.05],      // spans Home + About
  Experience: ["phi", -0.15],  // spans Experience + Projects
  Projects: ["orbits", 0.1],   // rings and dials, no field behind them
  Skills: ["contour", 0.13],
};

const hair = (S) => (S.light ? "rgba(11,11,12,.125)" : "rgba(250,250,247,.155)");
const faint = (S) => (S.light ? "rgba(11,11,12,.06)" : "rgba(250,250,247,.08)");

export function initGrounds(root) {
  if (!root) return () => {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // A ground host is not always one section: Home and About share one, so the
  // field runs unbroken across both instead of meeting at a seam.
  const panels = [...root.querySelectorAll("[data-ground]")];
  if (!panels.length) return () => {};

  const sections = panels.map((panel) => {
    const page = panel.dataset.ground;
    const [kind, par] = SYSTEM[page] || [null, 0];
    const sparkle = panel.classList.contains("sparkle");
    const streaks = panel.classList.contains("streaks");
    const S = {
      panel, page, kind, par, light: true, visible: false, last: -1e9, prog: 0,
      w: 0, h: 0, cols: 0, rows: 0,
      canvas: null, ctx: null, off: null, octx: null, sparks: null, sctx: null, pts: [],
      streak: null, strCtx: null, stars: [],
    };
    if (kind) {
      S.canvas = document.createElement("canvas");
      S.canvas.className = "layer";
      S.canvas.setAttribute("aria-hidden", "true");
      panel.prepend(S.canvas);
      S.ctx = S.canvas.getContext("2d");
    }
    if (sparkle) {
      S.sparks = document.createElement("canvas");
      S.sparks.className = "layer";
      S.sparks.setAttribute("aria-hidden", "true");
      if (S.canvas) S.canvas.after(S.sparks);
      else panel.prepend(S.sparks);
      S.sctx = S.sparks.getContext("2d");
    }
    if (streaks) {
      S.streak = document.createElement("canvas");
      S.streak.className = "layer"; S.streak.setAttribute("aria-hidden", "true");
      const after = S.sparks || S.canvas;
      if (after) after.after(S.streak); else panel.prepend(S.streak);
      S.strCtx = S.streak.getContext("2d");
    }
    return S;
  });

  // Read the ground actually painted behind the layer, so the ink is never the
  // same colour as what it sits on. Trusting the CSS class instead is what made
  // three of these invisible under a dark theme.
  function readPolarity(S) {
    const m = (getComputedStyle(S.panel).backgroundColor.match(/[\d.]+/g) || [255, 255, 255]).map(Number);
    S.light = 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2] > 128;
  }

  function sizeSection(S) {
    const w = S.panel.clientWidth;
    const h = Math.round(S.panel.clientHeight * 1.28);
    if (!w || !h || (w === S.w && h === S.h)) return;
    S.w = w; S.h = h;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (S.canvas) {
      if (S.kind === "dither") {
        S.cols = Math.ceil(w / CELL);
        S.rows = Math.ceil(h / CELL);
        S.canvas.width = S.cols;
        S.canvas.height = S.rows;
        S.ctx.imageSmoothingEnabled = false;
        S.off = document.createElement("canvas");
        S.off.width = S.cols;
        S.off.height = S.rows;
        S.octx = S.off.getContext("2d");
      } else {
        S.canvas.width = w * dpr;
        S.canvas.height = h * dpr;
        S.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      S.canvas.style.width = w + "px";
      S.canvas.style.height = h + "px";
    }
    if (S.sparks) {
      S.sparks.width = w * dpr;
      S.sparks.height = h * dpr;
      S.sparks.style.width = w + "px";
      S.sparks.style.height = h + "px";
      S.sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      S.pts = Array.from({ length: Math.round((w * h) / 6200) }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        ph: Math.random() * 6.283, sp: 0.25 + Math.random() * 0.8,
        r: 0.4 + Math.random() * 1.1, big: Math.random() < 0.14,
      }));
    }
    if (S.streak) {
      const dpr2 = Math.min(2, window.devicePixelRatio || 1);
      S.streak.width = w * dpr2; S.streak.height = h * dpr2;
      S.streak.style.width = w + "px"; S.streak.style.height = h + "px";
      S.strCtx.setTransform(dpr2, 0, 0, dpr2, 0, 0);
      // the first is the long throw: it leaves the title page and lands well
      // inside About, which the two can only share because they are one run
      S.stars = [
        { x0: .14, y0: .07, x1: .95, y1: .74, a: .02, b: .60, w: 2.0 },
        { x0: .60, y0: .03, x1: .89, y1: .19, a: .10, b: .28, w: 1.3 },
        { x0: .05, y0: .26, x1: .29, y1: .39, a: .26, b: .44, w: 1.1 },
        { x0: .68, y0: .52, x1: .97, y1: .68, a: .52, b: .72, w: 1.5 },
      ].map((st) => ({ ...st, x0: st.x0 * w, y0: st.y0 * h, x1: st.x1 * w, y1: st.y1 * h }));
    }
    S.last = -1e9;
  }

  /* --- I, II: Floyd–Steinberg weather --- */
  function drawDither(S, t) {
    const { cols, rows } = S;
    const P = WEATHER[S.page];
    if (!P || !S.octx) return;
    const L = P.L;
    const TAU = Math.PI * 2;
    const buf = new Float32Array(cols * rows);
    for (let y = 0; y < rows; y++) {
      const v = y / rows;
      for (let x = 0; x < cols; x++) {
        const u = x / cols;
        buf[y * cols + x] =
          P.base + P.gx * (u - 0.5) + P.gy * (v - 0.5) +
          L[0][2] * Math.sin((u * L[0][0] + v * L[0][1] + t * L[0][3]) * TAU) +
          L[1][2] * Math.sin((u * L[1][0] + v * L[1][1] + t * L[1][3]) * TAU) +
          L[2][2] * Math.sin((u * L[2][0] + v * L[2][1] + t * L[2][3]) * TAU);
      }
    }
    const img = S.octx.createImageData(cols, rows);
    const o = img.data;
    const r = S.light ? 11 : 250, g = S.light ? 11 : 250, b = S.light ? 12 : 247;
    const alpha = Math.round(255 * (S.light ? 0.055 : 0.1));
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        const val = buf[i];
        const out = val > 0.5 ? 1 : 0; // 1 = bare paper, 0 = a dot
        const err = val - out;
        if (x + 1 < cols) buf[i + 1] += (err * 7) / 16;
        if (y + 1 < rows) {
          if (x > 0) buf[i + cols - 1] += (err * 3) / 16;
          buf[i + cols] += (err * 5) / 16;
          if (x + 1 < cols) buf[i + cols + 1] += (err * 1) / 16;
        }
        o[i * 4] = r; o[i * 4 + 1] = g; o[i * 4 + 2] = b;
        o[i * 4 + 3] = out ? 0 : alpha;
      }
    }
    S.octx.putImageData(img, 0, 0);
    S.ctx.clearRect(0, 0, cols, rows);
    S.ctx.drawImage(S.off, 0, 0);
  }

  /* --- III: the golden-ratio construction, slowly turning --- */
  // A ground can be several screens tall, and one subdivision stretched over
  // that is just a few near-vertical lines. So the construction is drawn at a
  // fixed aspect and tiled down the run, mirroring every other block.
  function phiBlock(c, W, H, S) {
    let x = 0, y = 0, w = W, h = H;
    for (let i = 0; i < 8; i++) {
      c.strokeStyle = i > 2 ? faint(S) : hair(S);
      c.strokeRect(x, y, w, h);
      if (w >= h) { const nw = w / PHI; if (i % 2 === 0) x += w - nw; w = nw; }
      else { const nh = h / PHI; if (i % 2 === 0) y += h - nh; h = nh; }
    }
    const cx = x + w / 2, cy = y + h / 2;
    const bb = Math.log(PHI) / (Math.PI / 2);
    const a0 = Math.min(W, H) * 0.016;
    c.strokeStyle = hair(S);
    c.beginPath();
    for (let i = 0; i <= 420; i++) {
      const th = (i / 420) * Math.PI * 5.2 - Math.PI * 1.1;
      const r = a0 * Math.exp(bb * th);
      const px = cx + r * Math.cos(th);
      const py = cy - r * Math.sin(th);
      if (i) c.lineTo(px, py); else c.moveTo(px, py);
    }
    c.stroke();
    c.strokeStyle = faint(S);
    c.beginPath();
    c.moveTo(0, cy); c.lineTo(W, cy);
    c.moveTo(cx, 0); c.lineTo(cx, H);
    c.stroke();
  }

  function drawPhi(S, t, prog) {
    const c = S.ctx;
    const W = S.w, H = S.h;
    c.clearRect(0, 0, W, H);
    c.lineWidth = 1;
    // long chords drifting across the whole run, under the construction
    c.strokeStyle = faint(S);
    for (let i = 0; i < 7; i++) {
      const ph = i * 1.37;
      const y0 = (((i / 7 + t * 0.0000055 + Math.sin(ph) * 0.02) % 1) + 1) % 1 * H;
      const slope = (i % 2 ? 1 : -1) * (0.08 + (i % 3) * 0.05);
      c.beginPath();
      c.moveTo(0, y0);
      c.lineTo(W, y0 + W * slope);
      c.stroke();
    }
    const unit = Math.min(H, Math.max(420, W * 0.62));
    const n = Math.ceil(H / unit);
    for (let i = 0; i < n; i++) {
      c.save();
      c.translate(0, i * unit);
      if (i % 2) { c.translate(W, 0); c.scale(-1, 1); }   // mirror every other block
      c.translate(W / 2, unit / 2);
      c.rotate((prog - 0.5) * 0.1 + Math.sin(t * 0.00006 + i) * 0.012);
      c.translate(-W / 2, -unit / 2);
      phiBlock(c, W, unit, S);
      c.restore();
    }
  }

  /* --- IV: orbits. rings that butterfly open and planets that ride them --- */
  // Concentric at the middle of the section, splaying into mirrored pairs of
  // flattened dials at either end, in step with the cards unzipping.
  function drawOrbits(S, t, prog) {
    const c = S.ctx;
    const W = S.w, H = S.h;
    c.clearRect(0, 0, W, H);
    c.lineWidth = 1;
    const cx = W / 2, cy = H / 2;
    const maxR = Math.min(W, H) * 0.46;
    const a = Math.min(1, Math.abs(prog - 0.5) * 2);   // 0 centred, 1 at either end
    const spread = a * W * 0.17;                        // the zipper
    const squash = 1 - a * 0.48;                        // rings flatten into dials
    const fan = a * 0.52;                               // and fan apart
    const N = 7;
    for (let i = 0; i < N; i++) {
      const f = (i + 1) / N;
      const r = maxR * f;
      const side = i % 2 ? 1 : -1;                      // the butterfly
      c.save();
      c.translate(cx + side * spread * (0.4 + f), cy);
      c.rotate(side * fan * f);
      c.strokeStyle = i % 3 === 0 ? hair(S) : faint(S);
      c.beginPath();
      c.ellipse(0, 0, r, r * squash, 0, 0, Math.PI * 2);
      c.stroke();

      // every third ring is a dial, with ticks around its rim
      if (i % 3 === 1) {
        c.strokeStyle = faint(S);
        for (let k = 0; k < 36; k++) {
          const th = (k / 36) * Math.PI * 2;
          const co = Math.cos(th), si = Math.sin(th);
          const len = k % 9 === 0 ? 9 : 4;
          c.beginPath();
          c.moveTo(co * r, si * r * squash);
          c.lineTo(co * (r - len), si * (r - len) * squash);
          c.stroke();
        }
      }

      // spokes, like the face of a dial
      if (i % 3 === 2) {
        c.strokeStyle = faint(S);
        for (let k2 = 0; k2 < 12; k2++) {
          const th2 = (k2 / 12) * Math.PI * 2 + t * 0.00004 * (i % 2 ? 1 : -1);
          c.beginPath();
          c.moveTo(Math.cos(th2) * r * 0.42, Math.sin(th2) * r * squash * 0.42);
          c.lineTo(Math.cos(th2) * r, Math.sin(th2) * r * squash);
          c.stroke();
        }
      }

      // a planet riding the ring
      const th = t * 0.00022 * (1 + i * 0.26) + i * 1.1;
      c.fillStyle = hair(S);
      c.beginPath();
      c.arc(Math.cos(th) * r, Math.sin(th) * r * squash, i % 3 === 0 ? 4 : 2.6, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    // a second family, smaller and turning the other way
    c.save();
    c.translate(cx, cy);
    c.rotate(-t * 0.000035 - a * 0.4);
    c.strokeStyle = faint(S);
    for (let i = 0; i < 4; i++) {
      const rr = maxR * (0.18 + i * 0.1);
      c.beginPath();
      c.ellipse(0, 0, rr, rr * (0.5 + a * 0.3), 0, 0, Math.PI * 2);
      c.stroke();
    }
    c.restore();
  }

  /* --- V: contour rings, breathing outward --- */
  function drawContour(S, t) {
    const c = S.ctx;
    const W = S.w, H = S.h;
    c.clearRect(0, 0, W, H);
    c.lineWidth = 1;
    const cx = W * 0.78, cy = H * 0.5, N = 16;
    const maxR = Math.hypot(W, H) * 0.78;
    const drift = (t * 0.000035) % (1 / N);
    for (let i = 0; i < N; i++) {
      const r = (i / N + drift) * maxR;
      if (r < 6) continue;
      c.strokeStyle = i % 4 === 0 ? hair(S) : faint(S);
      c.beginPath();
      c.ellipse(cx, cy, r, r * 0.74, 0, 0, Math.PI * 2);
      c.stroke();
    }
  }

  // Shooting stars carried by the scroll rather than a timer, so one of them
  // can begin on the title page and finish inside About.
  function drawStreaks(S) {
    const c = S.strCtx;
    if (!c) return;
    c.clearRect(0, 0, S.w, S.h);
    for (const st of S.stars) {
      const p = (S.prog - st.a) / (st.b - st.a);
      if (p <= 0 || p >= 1) continue;
      const x = st.x0 + (st.x1 - st.x0) * p;
      const y = st.y0 + (st.y1 - st.y0) * p;
      const dx = st.x1 - st.x0, dy = st.y1 - st.y0;
      const L = Math.hypot(dx, dy) || 1;
      const ux = dx / L, uy = dy / L;
      // they only show while the page is actually moving
      const fade = Math.min(1, p * 5) * Math.min(1, (1 - p) * 5) * activity;
      if (fade < 0.02) continue;
      const tail = L * 0.22 * fade;
      if (tail < 1) continue;
      const g = c.createLinearGradient(x, y, x - ux * tail, y - uy * tail);
      g.addColorStop(0, "rgba(255,253,245," + (0.95 * fade).toFixed(3) + ")");
      g.addColorStop(1, "rgba(255,253,245,0)");
      c.strokeStyle = g;
      c.lineWidth = st.w;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x - ux * tail, y - uy * tail);
      c.stroke();
      c.fillStyle = "rgba(255,253,245," + (0.98 * fade).toFixed(3) + ")";
      c.beginPath();
      c.arc(x, y, st.w * 0.95, 0, 6.283);
      c.fill();
    }
  }

  function drawSparks(S, t) {
    const c = S.sctx;
    c.clearRect(0, 0, S.w, S.h);
    // on paper the glints are ink; on a dark ground they are light
    const rgb = S.light ? "11,11,12" : "255,253,245";
    const k = S.light ? 0.5 : 1;
    for (const q of S.pts) {
      const a = Math.pow(Math.max(0, Math.sin(q.ph + t * 0.0012 * q.sp)), 5);
      if (a < 0.02) continue;
      c.fillStyle = "rgba(" + rgb + "," + (a * 0.95 * k).toFixed(3) + ")";
      c.beginPath();
      c.arc(q.x, q.y, q.r, 0, 6.283);
      c.fill();
      if (q.big && a > 0.45) {
        const Lr = 5 + a * 9;
        c.strokeStyle = "rgba(" + rgb + "," + (a * 0.5 * k).toFixed(3) + ")";
        c.lineWidth = 0.7;
        c.beginPath();
        c.moveTo(q.x - Lr, q.y); c.lineTo(q.x + Lr, q.y);
        c.moveTo(q.x, q.y - Lr); c.lineTo(q.x, q.y + Lr);
        c.stroke();
      }
    }
  }

  function paint(S, t) {
    if (!S.canvas) return;
    if (S.kind === "dither") drawDither(S, t);
    else if (S.kind === "phi") drawPhi(S, t, S.prog);
    else if (S.kind === "orbits") drawOrbits(S, t, S.prog);
    else drawContour(S, t);
  }

  // only the sections on screen are worth drawing
  const vio = new IntersectionObserver(
    (es) => es.forEach((e) => {
      const S = sections.find((s) => s.panel === e.target);
      if (S) S.visible = e.isIntersecting;
    }),
    { rootMargin: "160px 0px" }
  );
  sections.forEach((S) => vio.observe(S.panel));

  const pars = [...root.querySelectorAll("[data-par]")].map((el) => ({
    el,
    f: parseFloat(el.dataset.par),
    host: el.closest("[data-page], .panel") || el.parentElement,
  }));

  // Elements that ride in from the edge, sit while their section is centred,
  // and withdraw the way they came. The slide owns the whole transform, so its
  // attribute value doubles as the vertical parallax factor.
  const slides = [...root.querySelectorAll("[data-slide]")].map((el) => ({
    el,
    f: parseFloat(el.dataset.slide) || 0,
    host: el.closest("[data-page], .panel") || el.parentElement,
  }));

  // Drift measured against the element's own row rather than the whole section,
  // so a long list layers instead of sliding as one slab.
  const drifts = [...root.querySelectorAll("[data-drift]")].map((el) => ({
    el,
    f: parseFloat(el.dataset.drift) || 0,
    host: el.closest(".role, .skill") || el.parentElement,
  }));

  // Something that swims: it crosses its section sideways as you scroll, with
  // a gentle rise and fall on the way.
  const swims = [...root.querySelectorAll("[data-swim]")].map((el) => ({
    el,
    f: parseFloat(el.dataset.swim) || 0.3,
    host: el.closest("[data-page], .panel") || el.parentElement,
  }));

  // A stack that deals itself out: --fan runs 0 to 1 as the section arrives,
  // and the cards read it to spread.
  const fans = [...root.querySelectorAll("[data-fan]")].map((el) => ({
    el,
    host: el.closest("[data-page], .panel") || el.parentElement,
  }));

  // Containers that publish how far they have been scrolled through, as --p.
  const meters = [...root.querySelectorAll("[data-progress]")];

  // Containers whose children light as they cross the playhead.
  const lits = [...root.querySelectorAll("[data-lit]")];

  // The project grid unzips: cards converge as they reach the middle of the
  // view and fly apart along their column's axis as they leave it.
  const fliers = [];
  root.querySelectorAll("[data-fly]").forEach((grid) => {
    const cols = grid.dataset.fly.split(",").map(Number);
    [...grid.children].forEach((el, i) => {
      const n = cols[0] || 3;
      fliers.push({ el, dir: (i % n) - (n - 1) / 2 });
    });
  });

  // Every layer parallaxes inside its own section's overhang, clamped so it can
  // never expose an edge.
  // A first-order filter on every scroll-driven value. Tracking the raw
  // position frame for frame is what makes these effects feel brittle.
  // how hard the page is being scrolled right now: snaps up, decays slowly
  let lastY = window.scrollY, activity = 0;
  function readActivity() {
    const y = window.scrollY;
    const vel = Math.abs(y - lastY);
    lastY = y;
    const target = Math.min(1, vel / 9);
    activity = target > activity ? target : activity + (target - activity) * 0.06;
  }

  const EASE = 0.16;
  function damp(store, key, target) {
    const cur = store[key];
    if (cur === undefined || Math.abs(target - cur) > 2000) { store[key] = target; return target; }
    const next = cur + (target - cur) * EASE;
    store[key] = Math.abs(next - target) < 0.01 ? target : next;
    return store[key];
  }

  function parallax() {
    readActivity();
    const vh = window.innerHeight;
    for (const S of sections) {
      if (!S.visible) continue;
      const r = S.panel.getBoundingClientRect();
      const rel = vh / 2 - (r.top + r.height / 2);
      const raw = Math.max(-0.12, Math.min(0.12, (rel / vh) * S.par)) * S.h;
      const shift = damp(S, "_shift", raw);
      const tf = "translate3d(0," + shift.toFixed(1) + "px,0)";
      if (S.canvas) S.canvas.style.transform = tf;
      if (S.sparks) S.sparks.style.transform = "translate3d(0," + (shift * 0.55).toFixed(1) + "px,0)";
      S.prog = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh)));
    }
    for (const q of pars) {
      const r = q.host.getBoundingClientRect();
      const rel = r.top + r.height / 2 - vh / 2;
      q.el.style.transform = "translate3d(0," + damp(q, "_y", -rel * q.f).toFixed(1) + "px,0)";
    }
    for (const q of slides) {
      const r = q.host.getBoundingClientRect();
      // 0 as the section enters from the bottom, 0.5 centred, 1 as it leaves
      const p = (vh - r.top) / (r.height + vh);
      const away = Math.min(1, Math.abs(p - 0.5) * 2.35);   // flat through the middle
      const e = damp(q, "_e", Math.pow(away, 1.7));
      const x = e * 170;              // percent of its own width
      const z = -e * 560;             // swings back into the scene as it leaves
      const ry = -e * 58;             // and turns right onto its edge, like a door
      const rz = e * 11;              // rocking as it goes
      const rel = r.top + r.height / 2 - vh / 2;
      q.el.style.transform =
        "translate3d(" + x.toFixed(1) + "%," + (-rel * q.f).toFixed(1) + "px," +
        z.toFixed(1) + "px) rotateY(" + ry.toFixed(2) + "deg) rotateZ(" + rz.toFixed(2) + "deg)";
      q.el.style.setProperty("--near", (1 - e).toFixed(3));
    }

    for (const q of drifts) {
      const r = q.host.getBoundingClientRect();
      const rel = r.top + r.height / 2 - vh / 2;
      q.el.style.transform = "translate3d(0," + damp(q, "_y", -rel * q.f).toFixed(1) + "px,0)";
    }

    for (const q of swims) {
      const r = q.host.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      const x = damp(q, "_sx", p * q.f * r.width);
      const y = Math.sin(p * Math.PI * 2) * 18;
      q.el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
    }

    for (const q of fans) {
      const r = q.host.getBoundingClientRect();
      const raw = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.95)));
      // thrown, not slid: quick at first, settling at the end
      const e = 1 - Math.pow(1 - raw, 3);
      q.el.style.setProperty("--fan", e.toFixed(4));
    }

    for (const el of meters) {
      const r = el.getBoundingClientRect();
      // the playhead sits low, so the stroke is already running as the list
      // crests the bottom of the screen
      const play = vh * 0.92;
      const raw = Math.max(0, Math.min(1, (play - r.top) / Math.max(1, r.height)));
      // the stroke holds at its start for the first stretch, so whatever draws
      // it can arrive and sit still before it begins
      const HOLD = 0.03;
      const p = Math.max(0, Math.min(1, (raw - HOLD) / (1 - HOLD)));
      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--pr", raw.toFixed(4));
    }

    for (const el of lits) {
      const play = vh * 0.58;
      for (const child of el.children) {
        if (child.dataset.lit === undefined && !child.matches(".role, .skill")) continue;
        const r = child.getBoundingClientRect();
        child.classList.toggle("lit", r.top + r.height * 0.5 <= play);
      }
    }

    for (const q of fliers) {
      const r = q.el.getBoundingClientRect();
      const t = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh * 0.85)));
      const a = damp(q, "_a", Math.pow(Math.abs(t), 1.6));
      const x = q.dir * a * 190;
      const ry = -q.dir * a * 16;
      const z = -a * 260;
      q.el.style.transform =
        "translate3d(" + x.toFixed(1) + "px,0," + z.toFixed(1) + "px) rotateY(" + ry.toFixed(2) + "deg)";
    }
  }

  let raf = 0;
  function tick(t) {
    parallax();
    for (const S of sections) {
      if (!S.visible) continue;
      sizeSection(S);
      if (S.canvas) {
        const every = S.kind === "dither" ? 70 : 40; // weather is slow; line work can be smoother
        if (t - S.last > every) { S.last = t; paint(S, t); }
      }
      if (S.sparks) drawSparks(S, t);
      if (S.streak) drawStreaks(S);
    }
    raf = requestAnimationFrame(tick);
  }

  function layout() {
    sections.forEach((S) => {
      readPolarity(S);
      S.w = 0; S.h = 0;
      sizeSection(S);
      S.prog = 0.5;
      paint(S, 0);
      if (S.sparks) drawSparks(S, 0);
      if (S.streak) drawStreaks(S);
    });
    parallax();
  }

  layout();
  if (!reduce) raf = requestAnimationFrame(tick);

  const onResize = () => layout();
  window.addEventListener("resize", onResize);
  // a theme change repaints every ground, so the fields have to be redrawn with it
  const scheme = window.matchMedia("(prefers-color-scheme: dark)");
  const onScheme = () => layout();
  if (scheme.addEventListener) scheme.addEventListener("change", onScheme);
  else scheme.addListener(onScheme);

  return () => {
    cancelAnimationFrame(raf);
    vio.disconnect();
    window.removeEventListener("resize", onResize);
    if (scheme.removeEventListener) scheme.removeEventListener("change", onScheme);
    else scheme.removeListener(onScheme);
    sections.forEach((S) => { S.canvas?.remove(); S.sparks?.remove(); S.streak?.remove(); });
  };
}

/* ============================================================================
   The skyline: one image taken down to 1-bit at a low column count and blown
   up with smoothing off, so the pixels stay square. It resolves in by sweeping
   the threshold, and the cursor carries a torch across it.
   ========================================================================== */
export function initDither(canvas, src) {
  if (!canvas) return () => {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cols = Number(canvas.dataset.cols) || 150;
  const ctx = canvas.getContext("2d");
  const img = new Image();
  let rows = 0, gray = null, off = null, octx = null;
  let bias = -1;              // -1 (blank paper) .. 0 (the true image)
  let px = -999, py = -999;   // pointer, in grid space
  let raf = 0, alive = true;

  function inkRGB() {
    const v = getComputedStyle(canvas).color.match(/[\d.]+/g) || [0, 0, 0];
    return [Number(v[0]), Number(v[1]), Number(v[2])];
  }

  function prepare() {
    rows = Math.max(1, Math.round(cols * (img.naturalHeight / img.naturalWidth)));
    const s = document.createElement("canvas");
    s.width = cols; s.height = rows;
    const sc = s.getContext("2d", { willReadFrequently: true });
    sc.drawImage(img, 0, 0, cols, rows);
    const d = sc.getImageData(0, 0, cols, rows).data;
    gray = new Float32Array(cols * rows);
    for (let i = 0; i < cols * rows; i++) {
      // perceptual luminance, then a contrast push so the silhouette survives 1-bit
      const v = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
      gray[i] = Math.min(1, Math.max(0, (v - 0.5) * 1.3 + 0.5));
    }
    off = document.createElement("canvas");
    off.width = cols; off.height = rows;
    octx = off.getContext("2d");
    canvas.width = cols; canvas.height = rows;
    canvas.style.aspectRatio = cols + " / " + rows;
    ctx.imageSmoothingEnabled = false;
  }

  function render() {
    if (!gray) return;
    const buf = Float32Array.from(gray);
    const out = octx.createImageData(cols, rows);
    const o = out.data;
    const [ir, ig, ib] = inkRGB();
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        let v = buf[i] - bias * 0.55;
        const dx = x - px, dy = y - py, d2 = dx * dx + dy * dy;
        if (d2 < 225) v -= (1 - Math.sqrt(d2) / 15) * 0.34;
        const bit = v > 0.5 ? 1 : 0; // 1 = paper, 0 = ink
        const err = v - bit;
        if (x + 1 < cols) buf[i + 1] += (err * 7) / 16;
        if (y + 1 < rows) {
          if (x > 0) buf[i + cols - 1] += (err * 3) / 16;
          buf[i + cols] += (err * 5) / 16;
          if (x + 1 < cols) buf[i + cols + 1] += (err * 1) / 16;
        }
        o[i * 4] = ir; o[i * 4 + 1] = ig; o[i * 4 + 2] = ib;
        o[i * 4 + 3] = bit ? 0 : 255;
      }
    }
    octx.putImageData(out, 0, 0);
    ctx.clearRect(0, 0, cols, rows);
    ctx.drawImage(off, 0, 0);
  }

  function schedule() {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; render(); });
  }

  // The skyline builds with the scroll rather than on a timer: the threshold
  // follows how far the band has come up the view, so it resolves as you
  // arrive and breaks apart again if you scroll back.
  let follow = 0;
  let lastP = -1;
  function track() {
    follow = requestAnimationFrame(track);
    if (!gray) return;
    const r = canvas.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.62)));
    if (Math.abs(p - lastP) < 0.004) return;
    lastP = p;
    bias = -1 + p;
    render();
  }

  img.onload = () => {
    if (!alive) return;
    prepare();
    if (reduce) { bias = 0; render(); return; }
    render();
    follow = requestAnimationFrame(track);
  };
  img.src = src;

  const host = canvas.parentElement;
  const onMove = (ev) => {
    if (!gray) return;
    const r = canvas.getBoundingClientRect();
    px = ((ev.clientX - r.left) / r.width) * cols;
    py = ((ev.clientY - r.top) / r.height) * rows;
    schedule();
  };
  const onLeave = () => { px = -999; py = -999; schedule(); };
  host?.addEventListener("pointermove", onMove);
  host?.addEventListener("pointerleave", onLeave);

  const scheme = window.matchMedia("(prefers-color-scheme: dark)");
  const onScheme = () => render();
  if (scheme.addEventListener) scheme.addEventListener("change", onScheme);

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    cancelAnimationFrame(follow);
    host?.removeEventListener("pointermove", onMove);
    host?.removeEventListener("pointerleave", onLeave);
    if (scheme.removeEventListener) scheme.removeEventListener("change", onScheme);
  };
}
