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
  Projects: ["orbits", 0.1],   // a binary field with dials over it
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
    S.bin = null;
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

  /* --- IV: a field of ones and zeroes, with dials turning over it --- */
  // Redrawn into its own buffer a few times a second and blitted every frame:
  // tens of thousands of glyphs cannot be laid out at 25fps, but they do not
  // need to be — the field drifts far more slowly than the rings turn.
  function drawBinary(S, t) {
    const W = S.w, H = S.h;
    if (!S.bin || S.binW !== W || S.binH !== H) {
      S.bin = document.createElement("canvas");
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      S.bin.width = W * dpr; S.bin.height = H * dpr;
      S.binCtx = S.bin.getContext("2d");
      S.binCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      S.binW = W; S.binH = H;
    }
    const c = S.binCtx;
    c.clearRect(0, 0, W, H);
    c.font = '600 12px ui-monospace, SFMono-Regular, Menlo, monospace';
    c.textBaseline = "top";
    const cell = 16;
    const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
    const TAU = Math.PI * 2;
    const rgb = S.light ? "11,11,12" : "250,250,247";
    const flip = Math.floor(t / 820);
    for (let y = 0; y < rows; y++) {
      const v = y / rows;
      for (let x = 0; x < cols; x++) {
        const u = x / cols;
        let n = Math.sin((u * 3.1 + v * 1.7 + t * 0.00004) * TAU)
              + 0.7 * Math.sin((u * -2.2 + v * 4.3 - t * 0.000027) * TAU);
        n = n * 0.5 + 0.5;
        if (n < 0.54) continue;              // most of the page stays bare
        const a = (n - 0.54) / 0.46;
        c.fillStyle = "rgba(" + rgb + "," + (0.14 + a * 0.46).toFixed(3) + ")";
        // a stable per-cell bit that turns over now and then
        const bit = (((x * 73856093) ^ (y * 19349663)) + flip + ((x * 3 + y) >> 2)) & 1;
        c.fillText(bit ? "1" : "0", x * cell, y * cell);
      }
    }
  }

  /* --- IV: orbits. rings that butterfly open and planets that ride them --- */
  // Concentric at the middle of the section, splaying into mirrored pairs of
  // flattened dials at either end, in step with the cards unzipping.
  function drawOrbits(S, t, prog) {
    const c = S.ctx;
    const W = S.w, H = S.h;
    c.clearRect(0, 0, W, H);
    if (t - (S.binLast || -1e9) > 160) { S.binLast = t; drawBinary(S, t); }
    if (S.bin) c.drawImage(S.bin, 0, 0, W, H);
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

      // a planet riding the ring
      const th = t * 0.00022 * (1 + i * 0.26) + i * 1.1;
      c.fillStyle = hair(S);
      c.beginPath();
      c.arc(Math.cos(th) * r, Math.sin(th) * r * squash, i % 3 === 0 ? 4 : 2.6, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
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
    for (const q of S.pts) {
      const a = Math.pow(Math.max(0, Math.sin(q.ph + t * 0.0012 * q.sp)), 5);
      if (a < 0.02) continue;
      c.fillStyle = "rgba(255,253,245," + (a * 0.95).toFixed(3) + ")";
      c.beginPath();
      c.arc(q.x, q.y, q.r, 0, 6.283);
      c.fill();
      if (q.big && a > 0.45) {
        const Lr = 5 + a * 9;
        c.strokeStyle = "rgba(255,253,245," + (a * 0.5).toFixed(3) + ")";
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

  // A dither dissolve over a section: paper-coloured cells that thin out as it
  // arrives, so the page resolves into view rather than sliding into it.
  const dissolves = [...root.querySelectorAll("[data-dissolve]")].map((el) => ({
    el,
    host: el.closest(".panel") || el.parentElement,
    ctx: el.getContext("2d"),
    w: 0, h: 0, cols: 0, rows: 0, last: -1,
  }));
  const DCELL = 11;

  function drawDissolve(q, p) {
    const host = q.host;
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    if (w !== q.w || h !== q.h) {
      q.w = w; q.h = h;
      q.cols = Math.ceil(w / DCELL); q.rows = Math.ceil(h / DCELL);
      q.el.width = q.cols; q.el.height = q.rows;
      q.el.style.width = w + "px"; q.el.style.height = h + "px";
      q.ctx.imageSmoothingEnabled = false;
    }
    const c = q.ctx;
    const img = c.createImageData(q.cols, q.rows);
    const o = img.data;
    // the section starts black and breaks up into the white page beneath it,
    // with a scatter of lit cells so the break reads as static rather than fade
    for (let y = 0; y < q.rows; y++) {
      // the top of the section clears first, so it wipes as well as dissolves
      const bias = (y / q.rows) * 0.42;
      for (let x = 0; x < q.cols; x++) {
        const i = y * q.cols + x;
        // a stable per-cell threshold
        let hsh = ((x * 73856093) ^ (y * 19349663)) >>> 0;
        hsh = ((hsh ^ (hsh >>> 13)) * 1274126177) >>> 0;
        const thr = (hsh >>> 8) / 16777216;
        // three depths: the near plane clears last, the far plane first
        const plane = (hsh >>> 20) % 3;
        const lead = [0.0, 0.16, 0.3][plane];
        const covered = thr > (p - lead) * 1.5 * (1 + bias) - bias * 0.5;
        if (!covered) { o[i*4+3] = 0; continue; }
        // busiest through the middle of the break-up
        const hot = ((hsh >>> 3) & 255) / 255 < 0.07 + Math.sin(Math.PI * p) * 0.1;
        const v = hot ? 250 : 11;
        o[i*4] = v; o[i*4+1] = v; o[i*4+2] = hot ? 247 : 12;
        // the far plane sits back behind the near one
        o[i*4+3] = hot ? 255 : [255, 200, 140][plane];
      }
    }
    c.putImageData(img, 0, 0);
  }

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

    for (const q of dissolves) {
      const r = q.host.getBoundingClientRect();
      // 0 as the section's top reaches the bottom of the view, 1 a third of the way up
      const p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.68)));
      if (p >= 0.999) { if (q.last !== 1) { q.el.style.display = "none"; q.last = 1; } continue; }
      if (q.last === 1 || q.el.style.display === "none") q.el.style.display = "";
      if (Math.abs(p - q.last) < 0.004) continue;
      q.last = p;
      drawDissolve(q, p);
    }

    for (const el of meters) {
      const r = el.getBoundingClientRect();
      // 0 when the list's top reaches the playhead, 1 when its bottom does
      const play = vh * 0.58;
      const p = Math.max(0, Math.min(1, (play - r.top) / Math.max(1, r.height)));
      el.style.setProperty("--p", p.toFixed(4));
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

  function resolveIn() {
    if (reduce) { bias = 0; render(); return; }
    const t0 = performance.now();
    const DUR = 780;
    requestAnimationFrame(function step(now) {
      if (!alive) return;
      const t = Math.min(1, (now - t0) / DUR);
      bias = -1 + t;
      render();
      if (t < 1) requestAnimationFrame(step);
    });
  }

  let io = null;
  img.onload = () => {
    if (!alive) return;
    prepare();
    render();
    io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { resolveIn(); io.disconnect(); } });
    }, { threshold: 0.25 });
    io.observe(canvas);
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
    io?.disconnect();
    host?.removeEventListener("pointermove", onMove);
    host?.removeEventListener("pointerleave", onLeave);
    if (scheme.removeEventListener) scheme.removeEventListener("change", onScheme);
  };
}
