BUG_MODS.buqu = {
  key: 'buqu',
  no: '···',
  title: 'Buqu Will Not Bow',
  maker: '···',
  kind: 'Head-flinging',
  verb: 'Fling.',
  ground: '#8a6db8',
  ink: '#b3283d',
  rants: ['hmph!', '#@$%!', 'never!'],
  hits: ['hmph!', '#@$%'],
  items: {
    // one tessera off the end of his braid: white glaze on its grout bed, tied with the jade ribbon
    braidTile(ctx, x, y, t, a) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((a || 0) * 0.5 + Math.sin((t || 0) * 6) * 0.35);
      const q = (p, c) => { ctx.beginPath(); ctx.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) ctx.lineTo(p[i], p[i + 1]); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); };
      q([-12.5, -8.4, 12.5, -6.8, 12.5, 6.8, -12.5, 8.4], '#ddcba6');
      q([-11, -7, -1.4, -6.2, -1.4, 6.2, -11, 7], '#f7f4ee');
      q([0, -6.1, 5, -5.7, 5, 5.7, 0, 6.1], '#d9d6de');
      q([6.4, -5.6, 11, -5.2, 11, 5.2, 6.4, 5.6], '#12909a');
      q([9.2, -5.3, 11, -5.2, 11, 5.2, 9.2, 5.3], '#0c6f7c');
      q([-9.6, -5.4, -5.4, -5, -5.8, -2.8, -9.6, -3.2], '#fbfaf5');
      ctx.restore();
    }
  },
  create(api) {
    // Buqu Will Not Bow, alive: a Canvas 2D port of the game's own drawing code (src/art2/msprites.ts
    // headTex, src/game/head.ts braid, src/game/paint.ts trail, src/render/post.ts sky and sun,
    // src/paint/layers.ts crags, src/paint/terrain.ts wall). Tiles are cut once here in
    // normalised units (Voronoi and flow rows for the head, brick bonds for the sky, contour
    // courses for the crags) and drawn transformed each frame. Static layers are kept in
    // offscreen strips when the browser has OffscreenCanvas, else drawn directly.
    const emit = api && api.emit ? api.emit : function () {};
    const rnd = api && api.rnd ? api.rnd : function () { return 0.5; };
    const TAU = Math.PI * 2, PI = Math.PI;
    const cl = (v, a, b) => (v < a ? a : v > b ? b : v);
    const lerp = (a, b, k) => a + (b - a) * k;
    const ss = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k));
    const eOut = (k) => { k = cl(k, 0, 1); return 1 - (1 - k) * (1 - k) * (1 - k); };
    const eIn = (k) => { k = cl(k, 0, 1); return k * k * k; };
    const eIO = (k) => { k = cl(k, 0, 1); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
    const bOut = (k) => { k = cl(k, 0, 1) - 1; return 1 + 2.4 * k * k * k + 1.4 * k * k; };
    const bump = (x, a, b) => (x <= a || x >= b ? 0 : Math.sin(PI * (x - a) / (b - a)));
    const wrapA = (a) => Math.atan2(Math.sin(a), Math.cos(a));
    function h2(a, b) {
      let x = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
      x = Math.imul(x, 0x85ebca6b) ^ 0x27d4eb2d; x ^= x >>> 15; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 13;
      return (x >>> 0) / 4294967296;
    }
    const sm3 = (f) => f * f * (3 - 2 * f);
    const noise1 = (x, seed) => { const i = Math.floor(x), f = x - i; const a = h2(i, seed), b = h2(i + 1, seed); return a + (b - a) * sm3(f); };

    // ------------------------------------------------------------------ palette (src/mosaic/palette.ts)
    const HX = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    const K = {};
    const KH = { grout: '#f1ece2', cream: '#f6efdf', cream2: '#ece0c6', cream3: '#ddcba6', rose: '#ee8aa0', blush3: '#d4817d',
      yellow: '#f6df7e', gold: '#e8ad2c', gold2: '#c98914', gold3: '#fae08c', tq: '#27b6b0', tq2: '#5ed3c7', tq3: '#12909a', tq4: '#9ee8dc',
      jade: '#24a66c', jade2: '#4fc585', jade3: '#177c54', jade4: '#8fdca6', teal: '#177f76', teal2: '#259f8b', teal3: '#0e585a',
      indigo: '#233a8e', indigo2: '#2f50b4', indigo3: '#1a2668', indigo4: '#4f70d0', indigo5: '#83a0ea', sky2: '#a2dbf4', sky3: '#d5effa',
      mist: '#eef3f1', mist2: '#dbe9ea', mist3: '#c6dbe0', terra: '#c4553a', terra2: '#963e2b', terra3: '#e38552', ochre: '#eda04a',
      tan: '#efc47f', tan2: '#e0a862', stone: '#cfc6b8', stone2: '#b5aa9a', stone3: '#9a8f84', slate: '#6f7488',
      ink: '#23264a', ink2: '#35395f', ink3: '#4a4e74', skin: '#f6d2b2', skin2: '#eab58e', skin3: '#d38d66',
      hair: '#f7f4ee', hair2: '#d9d6de', ver: '#e2412b', ver2: '#b92d1d', ver3: '#f26a45', white: '#fbfaf5' };
    for (const k in KH) K[k] = HX(KH[k]);
    const MIX = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    const MUL = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
    const C8 = (v) => (v < 0 ? 0 : v > 255 ? 255 : Math.round(v));
    const CSS = (c) => 'rgb(' + C8(c[0]) + ',' + C8(c[1]) + ',' + C8(c[2]) + ')';
    // the composite pass grades the world (src/render/post.ts): a touch more saturation and contrast
    const GRADE = (c) => {
      let r = c[0] / 255, g = c[1] / 255, b = c[2] / 255;
      const l = 0.299 * r + 0.587 * g + 0.114 * b;
      r = cl(l + (r - l) * 1.1, 0, 1); g = cl(l + (g - l) * 1.1, 0, 1); b = cl(l + (b - l) * 1.1, 0, 1);
      return [cl((r - 0.5) * 1.05 + 0.5, 0, 1) * 255, cl((g - 0.5) * 1.05 + 0.5, 0, 1) * 255, cl((b - 0.5) * 1.05 + 0.5, 0, 1) * 255];
    };
    const GCM = new Map();
    const GC = (c) => { const k = (C8(c[0]) << 16) | (C8(c[1]) << 8) | C8(c[2]); let v = GCM.get(k); if (!v) GCM.set(k, v = CSS(GRADE(c))); return v; };
    const GROUT = KH.grout;
    // the Last Gate's sky set and sun (src/render/view.ts SKIES.gate)
    const SKY = ['#1d2a70', '#3a4aa0', '#8a6db8', '#ec8e78', '#f9bf8a'].map(HX);
    const SUNC = HX('#ffb070');
    // where each glaze of the dusk sits, by height above the plate's bottom in units of min(w,h)
    const TY = [[0, 4.0], [0.13, 3.75], [0.25, 3.28], [0.42, 2.95], [0.55, 2.5], [0.7, 2.0], [1.0, 1.0], [1.35, 0.22], [4, 0]];
    function tOfY(Y) { for (let i = 1; i < TY.length; i++) if (Y <= TY[i][0]) { const a = TY[i - 1], b = TY[i]; return a[1] + (b[1] - a[1]) * (Y - a[0]) / (b[0] - a[0]); } return 0; }
    function skyAt(t) { t = cl(t, 0, 3.999); const i = Math.floor(t), f = t - i; return MIX(SKY[i], SKY[i + 1], ss((f - 0.2) / 0.6)); }

    // ------------------------------------------------------------------ geometry
    function clipHalf(p, nx, ny, d) {
      const out = [], n = p.length;
      for (let i = 0; i < n; i += 2) {
        const ax = p[i], ay = p[i + 1], j = (i + 2) % n, bx = p[j], by = p[j + 1];
        const da = nx * ax + ny * ay - d, db = nx * bx + ny * by - d;
        if (da <= 0) out.push(ax, ay);
        if ((da <= 0) !== (db <= 0)) { const t = da / (da - db); out.push(ax + (bx - ax) * t, ay + (by - ay) * t); }
      }
      return out;
    }
    function centroid(p) { let x = 0, y = 0; const n = p.length / 2; for (let i = 0; i < p.length; i += 2) { x += p[i]; y += p[i + 1]; } return [x / n, y / n]; }
    function area(p) { let a = 0; for (let i = 0, n = p.length; i < n; i += 2) { const j = (i + 2) % n; a += p[i] * p[j + 1] - p[j] * p[i + 1]; } return a / 2; }
    // shrink a convex tile by g on every edge: the grout between tesserae
    function inset(p, g) {
      const n = p.length / 2; if (n < 3) return null;
      const [cx, cy] = centroid(p); const Ls = [];
      for (let i = 0; i < n; i++) {
        const ax = p[2 * i], ay = p[2 * i + 1], bx = p[(2 * i + 2) % p.length], by = p[(2 * i + 3) % p.length];
        let nx = -(by - ay), ny = bx - ax; const len = Math.hypot(nx, ny); if (len < 1e-7) continue;
        nx /= len; ny /= len; if ((cx - ax) * nx + (cy - ay) * ny < 0) { nx = -nx; ny = -ny; }
        Ls.push(nx, ny, nx * ax + ny * ay + g);
      }
      const m = Ls.length / 3; if (m < 3) return null;
      const out = [];
      for (let i = 0; i < m; i++) {
        const k = (i + m - 1) % m, n1x = Ls[3 * k], n1y = Ls[3 * k + 1], c1 = Ls[3 * k + 2], n2x = Ls[3 * i], n2y = Ls[3 * i + 1], c2 = Ls[3 * i + 2];
        const det = n1x * n2y - n1y * n2x; if (Math.abs(det) < 1e-5) continue;
        out.push((c1 * n2y - n1y * c2) / det, (n1x * c2 - c1 * n2x) / det);
      }
      let ok = out.length >= 6;
      for (let v = 0; ok && v < out.length; v += 2) for (let i = 0; i < m; i++) if (Ls[3 * i] * out[v] + Ls[3 * i + 1] * out[v + 1] < Ls[3 * i + 2] - 1e-4) { ok = false; break; }
      if (ok && Math.abs(area(out)) > g * g * 0.5) return out;
      // fallback for slivers: shrink about the centre
      const a = Math.abs(area(p)); if (a < g * g * 4) return null;
      const k = cl(1 - 2.2 * g / Math.sqrt(a), 0.2, 0.95), r = [];
      for (let i = 0; i < p.length; i += 2) r.push(cx + (p[i] - cx) * k, cy + (p[i + 1] - cy) * k);
      return r;
    }
    function ellPoly(cx, cy, rx, ry, n) { const p = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; p.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); } return p; }
    function bbox(polys) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of polys) for (let i = 0; i < p.length; i += 2) { if (p[i] < x0) x0 = p[i]; if (p[i] > x1) x1 = p[i]; if (p[i + 1] < y0) y0 = p[i + 1]; if (p[i + 1] > y1) y1 = p[i + 1]; } return [x0, y0, x1, y1]; }
    function voro(seeds, clip, maxR) {
      const n = seeds.length / 2, cells = [], cs = maxR, grid = new Map();
      for (let i = 0; i < n; i++) { const k = Math.floor(seeds[2 * i] / cs) * 4096 + Math.floor(seeds[2 * i + 1] / cs); let a = grid.get(k); if (!a) grid.set(k, a = []); a.push(i); }
      for (let i = 0; i < n; i++) {
        const sx = seeds[2 * i], sy = seeds[2 * i + 1], gx = Math.floor(sx / cs), gy = Math.floor(sy / cs);
        let cell = clip;
        for (let a = -1; a <= 1 && cell.length >= 6; a++) for (let b = -1; b <= 1 && cell.length >= 6; b++) {
          const lst = grid.get((gx + a) * 4096 + gy + b); if (!lst) continue;
          for (const j of lst) {
            if (j === i) continue;
            const tx = seeds[2 * j], ty = seeds[2 * j + 1], dx = tx - sx, dy = ty - sy;
            cell = clipHalf(cell, dx, dy, dx * (sx + tx) / 2 + dy * (sy + ty) / 2);
            if (cell.length < 6) break;
          }
        }
        if (cell.length >= 6) cells.push(cell);
      }
      return cells;
    }
    // grout beds are unions of overlapping subpaths: give them all one winding so nonzero fill never cancels
    function orient(p) { if (area(p) >= 0) return p; const r = []; for (let i = p.length - 2; i >= 0; i -= 2) r.push(p[i], p[i + 1]); return r; }
    function polyPath(path, p) { path.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) path.lineTo(p[i], p[i + 1]); path.closePath(); }
    function resample(pts, m) { // open polyline -> m+1 points evenly by arc length
      const cum = [0]; for (let i = 2; i < pts.length; i += 2) cum.push(cum[cum.length - 1] + Math.hypot(pts[i] - pts[i - 2], pts[i + 1] - pts[i - 1]));
      const T = cum[cum.length - 1], out = []; let j = 1;
      for (let k = 0; k <= m; k++) { const s = T * k / m; while (j < cum.length - 1 && cum[j] < s) j++; const f = (s - cum[j - 1]) / Math.max(1e-9, cum[j] - cum[j - 1]); out.push(pts[2 * j - 2] + (pts[2 * j] - pts[2 * j - 2]) * f, pts[2 * j - 1] + (pts[2 * j + 1] - pts[2 * j - 1]) * f); }
      return { pts: out, len: T };
    }

    // ------------------------------------------------------------------ Buqu's head (src/art2/msprites.ts headTex)
    // the one light: the low gate sun behind and right of his face, in the head's own frame
    const LDIR = 24 * PI / 180, LX = Math.cos(LDIR), LY = Math.sin(LDIR);
    const WARM = HX('#ffc58e'), COOL = HX('#5a5fae');
    function lightStep(x, y) {
      const vx = x / 7.6, vy = y / 8, r = Math.hypot(vx, vy) || 1e-6, k = cl((r - 0.38) / 0.6, 0, 1), f = (vx * LX + vy * LY) / r * k;
      return f >= 0.72 ? 2 : f >= 0.35 ? 1 : f <= -0.75 ? -2 : f <= -0.35 ? -1 : 0;
    }
    function litC(c, st) { return st === 2 ? MIX(c, WARM, 0.42) : st === 1 ? MIX(c, WARM, 0.2) : st === -1 ? MIX(c, COOL, 0.22) : st === -2 ? MIX(c, COOL, 0.38) : c; }
    function glaze(c, v, hh) { const q = hh < 0.34 ? -1 : hh < 0.67 ? 0 : 1; const br = 1 + q * v * 0.8, wm = q * 0.02; return [c[0] * br * (1 + wm), c[1] * br, c[2] * br * (1 - wm)]; }
    const INKS = { ink: 1, ink2: 1, ink3: 1 };
    // materials: tile sizes in head units at ts = 1 (src/mosaic/tess.ts)
    const MT = { SKIN: { k: 'flow', row: 1.5, len: 1.9, v: 0.035 }, FLOW: { k: 'flow', row: 1.9, len: 2.6, v: 0.1 }, FINE: { k: 'voro', s: 1.15, v: 0.05 }, LINE: { k: 'voro', s: 1.3, v: 0.08 } };

    function Builder(ts, g) {
      const B = { ts, g, groups: {}, cur: null, seed: 1 };
      B.group = (name) => { B.cur = B.groups[name] || (B.groups[name] = { parts: [] }); };
      function addTiles(cells, under, colName, mt, lit) {
        const base = K[colName], tiles = [];
        const doLit = lit !== false && !INKS[colName];
        for (const c of cells) {
          const t = inset(c, g * 0.5); if (!t) continue;
          const [x, y] = centroid(c);
          let col = doLit ? litC(base, lightStep(x, y)) : base;
          col = glaze(col, mt.v, h2(B.seed++, 91));
          tiles.push({ p: t, c: CSS(col) });
        }
        const bb = bbox(under);
        let layer = 0; for (const q of B.cur.parts) if (q.bb[0] < bb[2] && q.bb[2] > bb[0] && q.bb[1] < bb[3] && q.bb[3] > bb[1]) layer = Math.max(layer, q.layer + 1);
        B.cur.parts.push({ tiles, under, bb, layer });
      }
      B.ell = (cx, cy, rx, ry, col, mt, lit) => {
        const clip = ellPoly(cx, cy, rx, ry, Math.max(14, Math.round(Math.max(rx, ry) * 7)));
        const seeds = [];
        if (mt.k === 'flow') {
          const row = mt.row * ts, len = mt.len * ts;
          for (let k = 0; k < 60; k++) {
            const d = (k + 0.5) * row, a = rx - d, b = ry - d;
            if (a < row * 0.45 || b < row * 0.45) { seeds.push(cx, cy); break; }
            const per = PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
            const m = Math.max(3, Math.round(per / len)), ph = h2(k, B.seed) * TAU;
            for (let i = 0; i < m; i++) { const an = ph + i / m * TAU, j = (h2(B.seed + i, k) - 0.5) * row * 0.25; seeds.push(cx + Math.cos(an) * (a + j), cy + Math.sin(an) * (b + j)); }
          }
        } else {
          const s = mt.s * ts;
          for (let y = Math.floor((cy - ry) / s) - 1; y <= Math.ceil((cy + ry) / s); y++) for (let x = Math.floor((cx - rx) / s) - 1; x <= Math.ceil((cx + rx) / s); x++) {
            const sx = (x + 0.12 + 0.76 * h2(x * 7 + B.seed, y)) * s, sy = (y + 0.12 + 0.76 * h2(y * 13 + B.seed, x + 3)) * s;
            const u = (sx - cx) / (rx + s), v = (sy - cy) / (ry + s); if (u * u + v * v <= 1) seeds.push(sx, sy);
          }
          if (!seeds.length) seeds.push(cx, cy);
        }
        B.seed += 7;
        const cs = (mt.k === 'flow' ? Math.max(mt.row, mt.len) : mt.s) * ts * 2.6;
        addTiles(voro(seeds, clip, cs), [clip], col, mt, lit);
      };
      B.disc = (cx, cy, r, col, mt, lit) => B.ell(cx, cy, r, r, col, mt, lit);
      B.poly = (pts, col, mt, lit) => { // convex polygon cut into Voronoi tesserae
        const s = (mt.s || mt.len * 0.8) * ts, [x0, y0, x1, y1] = bbox([pts]), seeds = [];
        for (let y = Math.floor(y0 / s); y <= Math.ceil(y1 / s); y++) for (let x = Math.floor(x0 / s); x <= Math.ceil(x1 / s); x++) seeds.push((x + 0.12 + 0.76 * h2(x * 5 + B.seed, y)) * s, (y + 0.12 + 0.76 * h2(y * 11 + B.seed, x)) * s);
        B.seed += 5;
        addTiles(voro(seeds, pts, s * 2.6), [pts], col, mt, lit);
      };
      B.rect = (x, y, w, h, col, mt, lit) => B.poly([x, y, x + w, y, x + w, y + h, x, y + h], col, mt, lit);
      // tapered strokes laid as a row of tesserae along the line, round ends (Draw.taper)
      B.taper = (pts, w0, w1, col, mt, closed, lit) => {
        const seg = (mt.k === 'flow' ? mt.len : mt.s) * ts * 0.9;
        const P = closed ? pts.concat([pts[0], pts[1]]) : pts;
        const R = resample(P, Math.max(closed ? 8 : 1, Math.round(resample(P, 64).len / seg)));
        const q = R.pts, m = q.length / 2 - 1, cells = [], under = [];
        const across = Math.max(1, Math.round(Math.max(w0, w1) / ((mt.k === 'flow' ? mt.row : mt.s) * ts * 1.6)));
        const nrm = (i) => { const a = Math.max(0, i - 1), b = Math.min(m, i + 1); let dx = q[2 * b] - q[2 * a], dy = q[2 * b + 1] - q[2 * a + 1]; if (closed && (i === 0 || i === m)) { dx = q[2] - q[2 * m - 2]; dy = q[3] - q[2 * m - 1]; } const L = Math.hypot(dx, dy) || 1; return [-dy / L, dx / L, dx / L, dy / L]; };
        for (let i = 0; i < m; i++) {
          const fa = i / m, fb = (i + 1) / m, ha = (w0 + (w1 - w0) * fa) / 2, hb = (w0 + (w1 - w0) * fb) / 2;
          const na = nrm(i), nb = nrm(i + 1);
          const ax = q[2 * i], ay = q[2 * i + 1], bx = q[2 * i + 2], by = q[2 * i + 3];
          for (let k = 0; k < across; k++) {
            const s0 = -1 + 2 * k / across, s1 = -1 + 2 * (k + 1) / across;
            const c = [ax + na[0] * ha * s0, ay + na[1] * ha * s0, bx + nb[0] * hb * s0, by + nb[1] * hb * s0, bx + nb[0] * hb * s1, by + nb[1] * hb * s1, ax + na[0] * ha * s1, ay + na[1] * ha * s1];
            cells.push(c); under.push(c);
          }
          if (!closed && (i === 0 || i === m - 1)) { // round end cap
            // half-disc beyond the end point: centre (cx, cy), radius hr, normal nn, outward tangent (tx, ty)
            const [cx, cy, hr, nn] = i === 0 ? [ax, ay, ha, na] : [bx, by, hb, nb], sg = i === 0 ? -1 : 1, tx = nn[2] * sg, ty = nn[3] * sg, cap = [];
            for (let j = 0; j <= 6; j++) { const an = -PI / 2 + j / 6 * PI; cap.push(cx + (nn[0] * Math.sin(an) + tx * Math.cos(an)) * hr, cy + (nn[1] * Math.sin(an) + ty * Math.cos(an)) * hr); }
            if (hr > g) { cells.push(cap); under.push(cap); }
          }
        }
        addTiles(cells, under, col, mt, lit);
      };
      B.stroke = (pts, w, col, mt, closed, lit) => B.taper(pts, w, w, col, mt, closed, lit);
      // the white hair cap: flowing rows between its outer edge and the hairline
      B.cap = (O, I, col, mt) => {
        const row = mt.row * ts, len = mt.len * ts;
        const ro = resample(O, 2), mm = Math.max(4, Math.round(ro.len / len));
        const o = resample(O, mm).pts, ii = resample(I, mm).pts, cells = [];
        for (let j = 0; j < mm; j++) {
          const th = (Math.hypot(o[2 * j] - ii[2 * j], o[2 * j + 1] - ii[2 * j + 1]) + Math.hypot(o[2 * j + 2] - ii[2 * j + 2], o[2 * j + 3] - ii[2 * j + 3])) / 2;
          const rows = Math.max(1, Math.round(th / row));
          for (let r = 0; r < rows; r++) {
            const a = r / rows, b = (r + 1) / rows, L = (j2, f) => [lerp(ii[2 * j2], o[2 * j2], f), lerp(ii[2 * j2 + 1], o[2 * j2 + 1], f)];
            const p1 = L(j, a), p2 = L(j + 1, a), p3 = L(j + 1, b), p4 = L(j, b);
            const c = [p1[0], p1[1], p2[0], p2[1], p3[0], p3[1], p4[0], p4[1]];
            if (Math.abs(area(c)) > 1e-3) cells.push(area(c) < 0 ? [p4[0], p4[1], p3[0], p3[1], p2[0], p2[1], p1[0], p1[1]] : c);
          }
        }
        const back = []; for (let i = I.length - 2; i >= 0; i -= 2) back.push(I[i], I[i + 1]);
        const under = [O.concat(back)];
        addTiles(cells, under, col, mt);
      };
      B.finish = () => {
        const out = {};
        for (const name in B.groups) {
          const parts = B.groups[name].parts, layers = [];
          for (const pt of parts) {
            const L = layers[pt.layer] || (layers[pt.layer] = { under: new Path2D(), map: new Map(), n: 0 });
            for (const u of pt.under) polyPath(L.under, orient(u));
            for (const t of pt.tiles) { let p = L.map.get(t.c); if (!p) L.map.set(t.c, p = new Path2D()); polyPath(p, t.p); L.n++; }
          }
          out[name] = layers.filter(Boolean).map((L) => ({ under: L.under, batches: Array.from(L.map, ([c, p]) => ({ c, p })), n: L.n }));
        }
        return out;
      };
      return B;
    }

    function buildHead(ts, g) {
      const B = Builder(ts, g), { SKIN, FLOW, FINE, LINE } = MT;
      B.group('base');
      // pigment frill where the neck was
      B.ell(-0.6, 7.2, 5.2, 2.6, 'ver2', FLOW);
      B.ell(-0.4, 6.6, 4.4, 1.9, 'ver', FLOW);
      for (const [dx, len] of [[-3.4, 2.4], [-0.6, 3.6], [2.4, 2.2]]) B.taper([dx, 7.6, dx + 0.2, 7.6 + len], 1.3, 0.5, 'ver', FINE);
      B.ell(-6.4, 0.6, 1.7, 2.3, 'skin2', SKIN);
      B.ell(0, 0, 7.4, 7.8, 'skin', SKIN);
      K.cheek = MIX(K.skin, K.rose, 0.35);
      B.ell(3.6, 3.4, 2.1, 1.3, 'cheek', SKIN);
      // white hair cap and the stubborn topknot
      B.cap([-7.6, -0.4, -7.4, -4.6, -4.2, -7.6, 1, -8.4, 5.4, -6.8, 6.2, -5], [-7.6, -0.4, -5.4, -1.6, -3, -4.4, 1.5, -5.6, 6.2, -5], 'hair', FLOW);
      B.ell(-1.4, -10, 3.2, 2.6, 'hair', FLOW);
      B.ell(-1.4, -10.4, 1.8, 1.3, 'hair2', FLOW);
      B.rect(-3.4, -8.4, 4, 1.1, 'tq', FINE);
      // long nose
      B.ell(7.4, 0.6, 2.4, 1.7, 'skin2', SKIN);
      B.stroke([5.6, -1.8, 7.4, 0.2, 9.4, 1.2], 0.55, 'skin3', LINE);
      // the head's ink ring
      B.stroke(ellPoly(0, 0, 7.6, 8.0, 64), 0.6, 'ink2', LINE, true);
      const ex1 = 4.4, ex2 = 0.6, ey = -1.4, my = 3.6;
      const eye = (x, y, rx, ry) => {
        B.group('eyes'); B.ell(x, y, rx + 0.4, ry + 0.4, 'white', FINE);
        B.group('pupils'); B.ell(x + 0.3, y, rx * 0.62, ry * 0.8, 'ink', FINE); B.disc(x + 0.5, y - ry * 0.35, 0.3, 'white', FINE, false);
      };
      const brow = (x0, y0, x1, y1, w) => { w = w || 1.5; B.group('brows'); B.taper([x0, y0, (x0 + x1) / 2, (y0 + y1) / 2 - 0.6, x1, y1], w, w * 0.6, 'hair', FINE); };
      const shut = (x, y, up) => { B.group('lids'); B.stroke(up ? [x - 1.3, y + 0.5, x, y - 0.6, x + 1.3, y + 0.5] : [x - 1.4, y, x + 1.4, y + 0.2], 0.55, 'ink', LINE); };
      const beard = () => { B.group('beard'); B.poly([1, 4.2, 6, 4.4, 4.2, 7.6, 2.4, 10.2, 1.4, 7.2], 'hair', FLOW); };
      const tache = (dr) => { B.group('tache'); B.taper([6.2, 2.4, 3.4, 3.2, 0.8, 4.6 + dr, -0.6, 6.6 + dr], 1.7, 0.5, 'hair', FLOW); B.taper([6.6, 2.4, 8.4, 3.6, 9, 5.6 + dr], 1.5, 0.5, 'hair', FLOW); };
      const heads = {};
      heads.base = B.finish().base;
      // each face is cut into its own groups (the shared builder keeps seeding and the light)
      const one = (fn) => { const keep = B.groups; B.groups = {}; fn(); const r = B.finish(); B.groups = keep; return r; };
      const F = {};
      F.glare = one(() => { eye(ex1, ey + 0.4, 1.1, 0.8); eye(ex2, ey + 0.5, 1, 0.8); brow(ex2 - 2, ey - 2.6, ex2 + 1.4, ey - 1.2); brow(ex1 - 0.8, ey - 1.3, ex1 + 2.2, ey - 2.4); beard(); B.group('mouth'); B.stroke([3, my + 0.6, 6, my + 0.2], 0.6, 'ink', LINE); tache(0); });
      F.grit = one(() => {
        shut(ex1, ey + 0.3); shut(ex2, ey + 0.3); brow(ex2 - 2, ey - 2.2, ex2 + 1.4, ey - 0.8, 1.7); brow(ex1 - 0.8, ey - 0.9, ex1 + 2.2, ey - 2.2, 1.7); beard();
        B.group('mouth'); B.rect(1.8, my - 0.2, 4.6, 2, 'white', FINE, false);
        B.group('teeth'); for (let x = 2.6; x < 6.4; x += 1.1) B.rect(x, my - 0.2, 0.3, 2, 'ink3', LINE); B.stroke([1.8, my + 0.8, 6.4, my + 0.8], 0.3, 'ink3', LINE); tache(-0.6);
      });
      F.howl = one(() => {
        eye(ex1, ey - 0.2, 1.2, 1.2); eye(ex2, ey - 0.1, 1.1, 1.1); brow(ex2 - 2, ey - 3.6, ex2 + 1.4, ey - 3.2); brow(ex1 - 0.8, ey - 3.2, ex1 + 2.2, ey - 3.8);
        B.group('mouth'); B.ell(4, my + 2, 2.6, 3.2, 'ink', FINE); B.ell(4, my + 3.4, 1.6, 1.2, 'rose', FINE, false); B.rect(2.2, my - 0.8, 3.6, 0.8, 'white', FINE, false);
        tache(-1); B.group('tip'); B.poly([2, 8.6, 5.4, 8.6, 3.8, 11.4], 'hair', FLOW);
      });
      F.fear = one(() => { eye(ex1, ey - 0.2, 1.3, 1.4); eye(ex2, ey - 0.1, 1.2, 1.3); brow(ex2 - 2, ey - 3.4, ex2 + 1.4, ey - 3.9); brow(ex1 - 0.8, ey - 4, ex1 + 2.2, ey - 3.4); beard(); B.group('mouth'); B.ell(4, my + 1.2, 1.1, 1.4, 'ink', FINE); tache(0.8); });
      F.bliss = one(() => { shut(ex1, ey + 0.4, true); shut(ex2, ey + 0.5, true); brow(ex2 - 2, ey - 2.6, ex2 + 1.4, ey - 2.8); brow(ex1 - 0.8, ey - 2.8, ex1 + 2.2, ey - 2.6); B.group('cheek'); B.ell(4.2, 2.4, 1.5, 0.9, 'rose', SKIN); beard(); B.group('mouth'); B.stroke([2.4, my + 0.2, 4.4, my + 1.2, 6.2, my + 0.2], 0.6, 'ink', LINE); tache(-0.4); });
      F.smug = one(() => {
        eye(ex1, ey + 0.4, 1.1, 0.7); eye(ex2, ey + 0.5, 1, 0.7); B.group('lids'); B.stroke([ex1 - 1.3, ey - 0.1, ex1 + 1.4, ey - 0.3], 0.7, 'skin3', LINE); B.stroke([ex2 - 1.2, ey, ex2 + 1.2, ey - 0.2], 0.7, 'skin3', LINE);
        brow(ex2 - 2, ey - 2.2, ex2 + 1.4, ey - 1.8); brow(ex1 - 0.8, ey - 3, ex1 + 2.2, ey - 3.6); beard(); B.group('mouth'); B.stroke([2.6, my + 0.8, 4.6, my + 0.6, 6.4, my - 0.4], 0.6, 'ink', LINE); tache(-0.3);
      });
      K.puffc = MIX(K.skin, K.rose, 0.3);
      F.puff = one(() => { shut(ex1, ey + 0.3); shut(ex2, ey + 0.3); brow(ex2 - 2, ey - 2.4, ex2 + 1.4, ey - 1.4); brow(ex1 - 0.8, ey - 1.4, ex1 + 2.2, ey - 2.4); B.group('cheek'); B.ell(5, 3, 3, 2.4, 'puffc', SKIN); beard(); B.group('mouth'); B.disc(7.4, my + 0.2, 0.8, 'ink', FINE); tache(0); });
      const blink = one(() => { shut(ex1, ey + 0.3); shut(ex2, ey + 0.3); });
      heads.F = F; heads.blink = blink.lids;
      return heads;
    }
    const ORDER = ['eyes', 'pupils', 'lids', 'brows', 'cheek', 'beard', 'mouth', 'teeth', 'tache', 'tip'];

    // shared between plates: the cut tiles never change
    let SHR = null;
    try { SHR = BUG_MODS.buqu._shared || null; if (!SHR) { SHR = {}; Object.defineProperty(BUG_MODS.buqu, '_shared', { value: SHR, enumerable: false }); } } catch (e) { SHR = {}; }
    function headLOD(fine) {
      const key = fine ? 'hf' : 'hc';
      if (!SHR[key]) SHR[key] = fine ? buildHead(0.45, 0.13) : buildHead(0.92, 0.2);
      return SHR[key];
    }

    function drawLayers(c, layers) {
      for (const L of layers) {
        c.fillStyle = GROUT; c.fill(L.under);
        for (const b of L.batches) { c.fillStyle = b.c; c.fill(b.p); }
      }
    }

    // ------------------------------------------------------------------ offscreen strips (with a direct fallback)
    let canOC = true;
    function newCanvas(w, h) { if (!canOC) return null; try { const c = new OffscreenCanvas(Math.max(1, w), Math.max(1, h)); const x = c.getContext('2d'); if (!x) { canOC = false; return null; } return { cv: c, ctx: x }; } catch (e) { canOC = false; return null; } }
    const bucket = (S) => Math.pow(2, Math.ceil(Math.log2(Math.max(8, S)) * 4 - 1e-6) / 4);

    // --- the sky: brick-bond tiles whose glazes step through the dusk (post.ts sky())
    const SKYP = 2; // strip period in units of min(w,h)
    const SKYM = new Map();
    function paintSky(c, S, Hs, coarse) { // c draws in device px of a strip SKYP*S wide, Hs*S tall; bottom of strip = plate bottom
      let bw = Math.max(0.0225, (coarse ? 15 : 6) / S); const nc = Math.max(8, Math.round(SKYP / bw)); bw = SKYP / nc; const bh = bw * 0.685;
      const nr = Math.ceil(Hs / bh) + 1, H = Hs * S, map = new Map();
      for (let r = 0; r < nr; r++) {
        const off = r & 1 ? 0.5 : 0, Y = (r + 0.5) * bh;
        const y0 = H - (r + 1) * bh * S, hh = bh * S;
        for (let ci = -1; ci <= nc; ci++) {
          const cm = ((ci % nc) + nc) % nc, hsh = h2(cm * 7 + 3, r * 131 + 17);
          let t = tOfY(Y) + (hsh - 0.5) * 0.5;
          t = cl(t, 0, 3.999); const i = Math.floor(t), f = t - i, q = Math.round(ss((f - 0.2) / 0.6) * 3) / 3;
          const bi = Math.round(h2(cm + 7, r + 7) * 2), mk = i * 100 + Math.round(q * 3) * 10 + bi;
          let css = SKYM.get(mk); if (!css) SKYM.set(mk, css = CSS(MUL(GRADE(MIX(SKY[i], SKY[Math.min(4, i + 1)], q)), 0.97 + 0.03 * bi)));
          let a = map.get(css); if (!a) map.set(css, a = []);
          a.push((ci + off) * bw * S, y0, bw * S, hh);
        }
      }
      for (const [css, a] of map) { c.fillStyle = css; c.beginPath(); for (let i = 0; i < a.length; i += 4) c.rect(a[i], a[i + 1], a[i + 2], a[i + 3]); c.fill(); }
      // grout, mixed with the glaze it sits in (65 % grout)
      const gw = Math.max(1, 0.0016 * S);
      c.fillStyle = 'rgba(241,236,226,0.62)'; c.beginPath();
      for (let r = 0; r < nr; r++) {
        const y0 = H - (r + 1) * bh * S; c.rect(0, y0, SKYP * S, gw);
        const off = r & 1 ? 0.5 : 0; for (let ci = -1; ci <= nc; ci++) c.rect((ci + off) * bw * S, y0, gw, bh * S);
      }
      c.fill();
    }
    // --- crags of the Last Gate (layers.ts peak 'crag' with the PD glaze), the distant wall on their crests,
    // pale domes behind, a turquoise hill and the mist belt
    const MTP = 2.32, MTH = 0.52, MTB = 0.3; // strip spans Y in [-MTB, MTH]
    const PD = { a: MIX(K.indigo2, K.sky2, 0.2), b: MIX(K.indigo, K.sky2, 0.2), line: K.indigo5 };
    const PF = { a: MIX(K.indigo4, K.sky2, 0.3), b: MIX(K.indigo2, K.sky2, 0.3), line: K.white };
    const PEAKS = [ // x centre, half width, top (u above plate bottom), type, palette, seed, wall
      [0.12, 0.32, 0.25, 'hill', null, 3, 0],
      [0.30, 0.21, 0.30, 'dome', PF, 11, 0], [0.86, 0.215, 0.345, 'dome', PF, 12, 0], [1.45, 0.24, 0.39, 'dome', PF, 13, 0], [2.0, 0.18, 0.28, 'dome', PF, 14, 0],
      [0.31, 0.205, 0.215, 'crag', PD, 21, 1], [0.87, 0.21, 0.31, 'crag', PD, 22, 1], [1.49, 0.2, 0.31, 'crag', PD, 23, 1], [2.02, 0.17, 0.24, 'crag', PD, 24, 1],
    ];
    function peakTop(type, t, seed) {
      const a = Math.abs(t); if (a >= 1) return 0;
      // karst-like: steep flanks and broad rounded tops, as the crags stand in the poster
      let v = type === 'crag' ? Math.pow(1 - Math.pow(a, 3.0), 0.42) * (0.88 + 0.12 * noise1(t * 5 + 9, seed)) : type === 'dome' ? Math.pow(1 - Math.pow(a, 3.2), 0.42) : Math.pow(1 - a * a, 0.75);
      return v + (noise1(t * 7 + seed, seed) - 0.5) * 0.05 * (1 - a);
    }
    function paintMountains(c, S, coarse) {
      const H = MTH * S, Yb = -MTB;
      const rh = Math.max(0.0105, (coarse ? 11 : 4.2) / S), ln = Math.max(0.0135, (coarse ? 14 : 5.4) / S), gw = Math.max(0.7, 0.0011 * S);
      const quad = (path, a) => { path.moveTo(a[0], a[1]); path.lineTo(a[2], a[3]); path.lineTo(a[4], a[5]); path.lineTo(a[6], a[7]); path.closePath(); };
      const X = (x) => x * S, Yp = (Y) => H - Y * S;
      const fills = (map) => { for (const [css, p] of map) { c.fillStyle = css; c.fill(p); } };
      function peak(pk, shift) {
        const [cx0, hw, top, type, pal, seed, wall] = pk, cx = cx0 + shift;
        const ht = top - Yb, Yt = (x) => Yb + ht * peakTop(type, (x - cx) / hw, seed);
        // silhouette in grout
        const sil = new Path2D(); sil.moveTo(X(cx - hw), Yp(Yb));
        for (let i = 0; i <= 64; i++) { const x = cx - hw + 2 * hw * i / 64; sil.lineTo(X(x), Yp(Yt(x))); }
        sil.closePath(); c.fillStyle = type === 'hill' ? GROUT : GC(pal.line); c.fill(sil);
        // contour courses: rows parallel to the crest, cut at x intervals (tess.ts course kind)
        const map = new Map();
        const nCol = Math.ceil(2 * hw / ln) + 2, nRow = Math.ceil(ht / rh) + 1;
        for (let r = 0; r < nRow; r++) {
          const off = h2(r, seed) * ln;
          for (let ci = -1; ci < nCol; ci++) {
            let xa = cx - hw + ci * ln + off, xb = xa + ln;
            xa = Math.max(cx - hw + 0.001, xa); xb = Math.min(cx + hw - 0.001, xb); if (xb - xa < ln * 0.2) continue;
            const ya0 = Yt(xa) - r * rh, yb0 = Yt(xb) - r * rh, ya1 = ya0 - rh, yb1 = yb0 - rh;
            if (Math.max(ya0, yb0) < (type === 'crag' ? -0.22 : 0.1)) continue; // always under the mist belt or the wall
            if (Math.min(ya1, yb1) < Yb) continue;
            const g = gw / S * 0.5, tx = (xa + xb) / 2, tc = (tx - cx) / hw;
            let col;
            if (type === 'hill') { const band = Math.floor((r * rh + 0.012 * noise1(tx * 20, seed)) / 0.03); col = [K.tq, K.tq3, K.tq, MIX(K.tq, K.tq2, 0.5)][band % 4]; if (r === 0) col = MIX(K.tq, K.mist3, 0.35); }
            else {
              const shade = type === 'crag' ? (noise1(tx / (hw * 0.18) + seed, seed) > 0.55 || tc > 0.35) : (r * rh > ht * 0.28 && tc > -0.1);
              col = shade ? pal.b : pal.a;
              if (r === 0 && h2(ci, seed + 5) < 0.75) col = MIX(pal.line, col, 0.25); // the pale crest line
              col = MUL(col, 0.95 + 0.1 * Math.round(h2(ci * 3 + 1, r * 5 + seed) * 2) / 2);
            }
            const css = GC(col);
            let p = map.get(css); if (!p) map.set(css, p = new Path2D());
            quad(p, [X(xa + g), Yp(ya0 - g), X(xb - g), Yp(yb0 - g), X(xb - g), Yp(yb1 + g), X(xa + g), Yp(ya1 + g)]);
          }
        }
        fills(map);
        if (type === 'crag') {
          // strata: dark wavy lines down the crag (layers.ts)
          c.strokeStyle = GC(MIX(pal.b, K.ink, 0.25)); c.lineWidth = Math.max(0.8, 0.0018 * S);
          for (let k = 0; k < 3; k++) {
            const x0 = cx + (h2(k, seed + 9) - 0.5) * hw * 1.2, y0 = Yt(x0) - 0.01;
            c.beginPath(); c.moveTo(X(x0), Yp(y0));
            for (let yy = y0; yy > 0; yy -= 0.006) c.lineTo(X(x0 + Math.sin(yy * 110 + k) * 0.003), Yp(yy));
            c.stroke();
          }
        }
        if (wall) {
          // the distant Great Wall threading the crest: tan walk, terracotta merlons, dark shrubs
          const wmap = new Map(), x0 = cx - hw * 0.82, x1 = cx + hw * 0.82, st = Math.max(0.01, 3.6 / S), th = Math.max(0.011, 3.6 / S);
          for (let x = x0, i = 0; x < x1; x += st, i++) {
            const xb = Math.min(x1, x + st), ya = Yt(x) + 0.002, yb = Yt(xb) + 0.002, g = gw / S * 0.5;
            const col = GC(i % 5 === 0 ? K.tan2 : h2(i, seed) < 0.3 ? K.gold3 : K.tan);
            let p = wmap.get(col); if (!p) wmap.set(col, p = new Path2D());
            quad(p, [X(x + g), Yp(ya + th), X(xb - g), Yp(yb + th), X(xb - g), Yp(yb + g), X(x + g), Yp(ya + g)]);
            if (i % 3 === 1) { const mc = GC(K.terra2); let q = wmap.get(mc); if (!q) wmap.set(mc, q = new Path2D()); q.rect(X(x + st * 0.2), Yp(ya + th * 1.9), st * 0.55 * S, th * 0.9 * S); }
          }
          c.fillStyle = GROUT; const gp = new Path2D();
          for (let x = x0; x < x1; x += st) { const xb = Math.min(x1, x + st); quad(gp, [X(x), Yp(Yt(x) + th + 0.003), X(xb), Yp(Yt(xb) + th + 0.003), X(xb), Yp(Yt(xb) - 0.001), X(x), Yp(Yt(x) - 0.001)]); }
          c.fill(gp); fills(wmap);
          for (let k = 0; k < 3; k++) {
            const x = cx + (h2(k, seed + 31) - 0.5) * hw * 1.3, y = Yt(x) + 0.004, r = Math.max(0.006, 2.4 / S);
            c.fillStyle = GROUT; c.beginPath(); c.ellipse(X(x), Yp(y), r * S * 1.25, r * S * 0.85, 0, 0, TAU); c.fill();
            c.fillStyle = GC(K.teal3); c.beginPath(); c.ellipse(X(x), Yp(y), r * S, r * S * 0.62, 0, 0, TAU); c.fill();
            c.fillStyle = GC(K.teal); c.beginPath(); c.ellipse(X(x - r * 0.25), Yp(y + r * 0.2), r * S * 0.6, r * S * 0.36, 0, 0, TAU); c.fill();
          }
        }
      }
      function mist(shift) {
        // mist belt: big cream-white bricks under a scalloped edge (layers.ts billow)
        const top = 0.125, bw0 = Math.max(0.045, (coarse ? 18 : 10) / S), nb = Math.round(MTP / bw0), bw = MTP / nb, bh = bw * 0.47;
        const map = new Map(), cols = [K.white, K.cream, K.mist, K.hair, K.mist2, K.white];
        c.fillStyle = GROUT; c.fillRect(0, Yp(top), MTP * S, (top + MTB) * S + 2);
        for (let r = 0; r * bh < top + MTB; r++) {
          const off = r & 1 ? 0.5 : 0, y1 = top - r * bh, y0 = Math.max(-MTB, y1 - bh);
          for (let i = -1; i <= nb; i++) {
            const cm = ((i % nb) + nb) % nb, css = GC(cols[Math.floor(h2(cm, r + 40) * cols.length)]);
            let p = map.get(css); if (!p) map.set(css, p = new Path2D());
            const g = gw / S * 0.6; p.rect(X((i + off) * bw + g), Yp(y1 - g), (bw - 2 * g) * S, (y1 - y0 - 2 * g) * S);
          }
        }
        fills(map);
        // scalloped top
        const sr = Math.max(0.016, 4 / S), n = Math.round(MTP / (sr * 1.7)), sw = MTP / n;
        const pa = new Path2D(), pb = new Path2D(), pg = new Path2D();
        for (let i = 0; i < n; i++) {
          const x = (i + 0.5) * sw, rr = sr * (0.75 + 0.45 * h2(i, 77));
          pg.ellipse(X(x), Yp(top), sw * 0.62 * S, rr * S + gw, 0, PI, TAU);
          pa.ellipse(X(x), Yp(top), sw * 0.55 * S, rr * S, 0, PI, TAU);
          pb.ellipse(X(x), Yp(top + rr * 0.15), sw * 0.33 * S, rr * 0.62 * S, 0, PI, TAU);
        }
        c.fillStyle = GROUT; c.fill(pg); c.fillStyle = GC(K.mist3); c.fill(pa); c.fillStyle = GC(K.white); c.fill(pb);
        c.fillStyle = GC(K.sky3); c.fillRect(0, Yp(top) - 0.5, MTP * S, Math.max(1, gw));
      }
      for (const shift of [0, -MTP, MTP]) for (const pk of PEAKS) if (pk[3] !== 'crag' && pk[0] + shift + pk[1] > -0.05 && pk[0] + shift - pk[1] < MTP + 0.05) peak(pk, shift);
      mist(0);
      for (const shift of [0, -MTP, MTP]) for (const pk of PEAKS) if (pk[3] === 'crag' && pk[0] + shift + pk[1] > -0.05 && pk[0] + shift - pk[1] < MTP + 0.05) peak(pk, shift);
    }
    // --- cloud belts (layers.ts cloudBelt / billow): white scallops over pale blue
    const CLP = 2.4; // cloud period in units of min(w,h)
    const CLOUDS = [[0.0, 0.5, 0.75], [1.21, 1.67, 0.765], [1.95, 2.06, 0.84], [0.62, 0.8, 0.92]];
    // one cloud in its own small box: x from x0 - 0.01, Y from y - 0.016 to y + 0.03
    function paintCloud(c, S, cl0) {
      const [x0, x1, y] = cl0, H = 0.046 * S, X = (x) => (x - x0 + 0.01) * S, Yp = (Y) => H - (Y - y + 0.016) * S;
      const gw = Math.max(0.8, 0.0012 * S);
      {
        const th = 0.011, sr = Math.max(0.0085, 3 / S), n = Math.max(2, Math.round((x1 - x0) / (sr * 1.9))), sw = (x1 - x0) / n;
        const pg = new Path2D(), pw = new Path2D(), pw2 = new Path2D(), pb = new Path2D(), pb2 = new Path2D();
        pg.rect(X(x0), Yp(y), (x1 - x0) * S, th * S + gw);
        for (let i = 0; i < n; i++) {
          const x = x0 + (i + 0.5) * sw, e = Math.min(1, (i + 0.7) / 2, (n - i - 0.3) / 2), rr = sr * (0.6 + 0.5 * h2(i, 9 + x0 * 10)) * e;
          pg.ellipse(X(x), Yp(y), sw * 0.6 * S + gw, rr * S + gw, 0, PI, TAU);
          (i % 3 ? pw : pw2).ellipse(X(x), Yp(y), sw * 0.52 * S, rr * S, 0, PI, TAU);
          (i % 2 ? pb : pb2).rect(X(x - sw / 2 + gw / S * 0.5), Yp(y) + gw * 0.5, sw * S - gw, th * S - gw);
        }
        c.fillStyle = GROUT; c.fill(pg);
        c.fillStyle = GC(K.white); c.fill(pw); c.fillStyle = GC(K.mist); c.fill(pw2);
        c.fillStyle = GC(K.sky3); c.fill(pb); c.fillStyle = GC(K.mist3); c.fill(pb2);
      }
    }
    // --- the Great Wall at the Last Gate (terrain.ts, gate palette): parapet with crenels, walkway, ink band,
    // slate and indigo face courses, plinth, indigo ridge courses
    const WP = 102, WS = 0.0078; // wall period in world units; 1 wu = WS u in play
    const WTOP = -9, WBOT = 82;
    function paintWall(c, S) { // S = device px per u; wu = S * WS
      const k = S * WS, X = (x) => x * k, Yp = (y) => (y - WTOP) * k, gw = Math.max(0.8, 0.3 * k);
      const map = new Map(), add = (css, x, y, w, h) => { let a = map.get(css); if (!a) map.set(css, a = []); a.push(X(x) + gw * 0.5, Yp(y) + gw * 0.5, w * k - gw, h * k - gw); };
      c.fillStyle = GROUT; c.fillRect(0, Yp(-3.5), WP * k, (WBOT + 3.5) * k);
      for (let m = 0; m < 10; m++) c.fillRect(X(m * 10.2) - gw * 0.5, Yp(-7.6), 6.7 * k + gw, 4.3 * k);
      const par = MIX(K.slate, K.sky2, 0.3), parTop = MIX(par, K.ink3, 0.35);
      // parapet merlons and crenels
      for (let m = 0; m < 10; m++) {
        const xm = m * 10.2;
        for (const [xa, xb, top] of [[xm, xm + 6.7, -7.5], [xm + 6.7, xm + 10.2, -3.4]]) {
          const n = Math.max(1, Math.round((xb - xa) / 2.4)), w = (xb - xa) / n;
          for (let i = 0; i < n; i++) { add(GC(parTop), xa + i * w, top, w, 1.1); for (let y = top + 1.1; y < -0.01; y += 2.4) add(GC(MUL(par, 0.96 + 0.08 * h2(m * 9 + i, y * 10))), xa + i * w, y, w, Math.min(2.4, -y)); }
        }
      }
      // walkway edge, band
      for (let x = 0, i = 0; x < WP - 0.01; x += 3.4, i++) add(GC(MUL(K.stone, 0.96 + 0.08 * h2(i, 3))), x, 0, Math.min(3.4, WP - x), 2);
      for (let x = 0, i = 0; x < WP - 0.01; x += 2.55, i++) add(GC(K.ink), x, 2, Math.min(2.55, WP - x), 1.6);
      // brick face courses
      const fh = (x) => 28 + 4 * Math.sin(x / WP * TAU);
      for (let r = 0; r < 11; r++) {
        const y = 3.6 + r * 3, off = h2(r, 51) * 4.4;
        for (let x = -off; x < WP; x += 4.4) {
          const xa = Math.max(0, x), xb = Math.min(WP, x + 4.4); if (xb - xa < 0.6) continue;
          const yb = Math.min(y + 3, fh((xa + xb) / 2)); if (yb <= y + 0.4) continue;
          const n = noise1((xa + 2) / 17 + r * 3.7, 11);
          let col = n > 0.86 ? K.indigo4 : n < 0.14 ? K.indigo2 : K.slate;
          if (Math.abs((xa + xb) / 2 - 38) < 2.6 && y > 8 && y < 15) col = K.ink;
          add(GC(MUL(col, 0.95 + 0.1 * h2(Math.round(x * 3), r))), xa, y, xb - xa, yb - y);
        }
      }
      // plinth, ridge contour courses with pale seams between bands
      const ridge = [K.indigo4, K.indigo2, K.indigo, K.indigo3];
      for (let x = 0, i = 0; x < WP - 0.01; x += 6, i++) { const y = fh(x + 3); add(GC(MUL(K.indigo, 0.95 + 0.1 * h2(i, 9))), x, y, Math.min(6, WP - x), 4.2); }
      for (let r = 0; r < 12; r++) {
        const off = h2(r, 61) * 6.4;
        for (let x = -off; x < WP; x += 6.4) {
          const xa = Math.max(0, x), xb = Math.min(WP, x + 6.4); if (xb - xa < 0.8) continue;
          const y0 = fh((xa + xb) / 2) + 4.2 + r * 4.6, band = Math.floor((r * 4.6) / 25), first = r > 0 && Math.floor(((r - 1) * 4.6) / 25) !== band;
          const col = first ? K.mist3 : ridge[Math.min(3, band)];
          add(GC(MUL(col, 0.95 + 0.1 * h2(Math.round(x * 5), r + 3))), xa, y0, xb - xa, 4.6);
        }
      }
      for (const [css, a] of map) { c.fillStyle = css; c.beginPath(); for (let i = 0; i < a.length; i += 4) c.rect(a[i], a[i + 1], a[i + 2], a[i + 3]); c.fill(); }
      // moss on the plinth, a shrub on the ridge
      for (const [x, y, r, col] of [[22, 31.2, 4, K.jade3], [70, 33, 3.2, K.jade3], [52, 48, 6, K.teal3], [86, 58, 5, K.teal3]]) {
        c.fillStyle = GROUT; c.beginPath(); c.ellipse(X(x), Yp(y), (r + 0.4) * k, (r * 0.55 + 0.4) * k, 0, 0, TAU); c.fill();
        c.fillStyle = GC(col); c.beginPath(); c.ellipse(X(x), Yp(y), r * k, r * 0.55 * k, 0, 0, TAU); c.fill();
        if (col === K.teal3) { c.fillStyle = GC(K.jade3); c.beginPath(); c.ellipse(X(x - r * 0.25), Yp(y - r * 0.12), r * 0.8 * k, r * 0.42 * k, 0, 0, TAU); c.fill(); c.fillStyle = GC(K.teal); c.beginPath(); c.ellipse(X(x + r * 0.15), Yp(y - r * 0.32), r * 0.45 * k, r * 0.25 * k, 0, 0, TAU); c.fill(); }
      }
    }
    // --- the gate sun's disc (post.ts): concentric rings of radial tesserae
    const RINGS = [8, 26, 43, 60];
    function paintSunDisc(c, rpx) { // centred in a (2r+4)^2 canvas
      const o = rpx + 2, rw = rpx / 3.2, gs = Math.max(0.7, rpx * 0.014);
      c.fillStyle = GC(MIX(K.grout, SUNC, 0.45)); c.beginPath(); c.arc(o, o, rpx, 0, TAU); c.fill();
      const map = new Map();
      for (let ring = 0; ring < 4; ring++) {
        const r0 = ring * rw, r1 = Math.min(rpx, (ring + 1) * rw), n = RINGS[ring];
        for (let s = 0; s < n; s++) {
          const hh = h2(ring * 97 + 5, s * 31 + 7);
          const base = ring === 0 ? MIX(SUNC, [255, 250, 230], 0.35) : SUNC;
          const css = GC(MUL(base, 0.95 + 0.08 * Math.round(hh * 3) / 3));
          let p = map.get(css); if (!p) map.set(css, p = new Path2D());
          const a0 = s / n * TAU - PI, a1 = (s + 1) / n * TAU - PI, ga = gs / Math.max(1, (r0 + r1) / 2) * 0.5;
          const ri = ring === 0 ? 0 : r0 + gs * 0.5, ro = r1 - gs * 0.5;
          if (ring === 0) { p.moveTo(o, o); p.arc(o, o, ro, a0 + ga * 2, a1 - ga * 2); p.closePath(); }
          else { p.arc(o, o, ro, a0 + ga, a1 - ga); p.arc(o, o, ri, a1 - ga, a0 + ga, true); p.closePath(); }
        }
      }
      for (const [css, p] of map) { c.fillStyle = css; c.fill(p); }
    }

    // a cache = an offscreen picture at a device scale; rebuilt when the plate's scale drifts
    function Cache(build) { return { build, c: null, S: 0, aux: 0 }; }
    const st = {
      sky: Cache(), mtn: Cache(), cld: CLOUDS.map(() => Cache()), wall: Cache(), sun: Cache(), heads: new Map(), hclock: 0,
      stable: 0, lastW: 0, lastH: 0, built: false,
    };
    function want(cache, S, aux, mk, exact) {
      // returns the cache to draw (may be stale but usable), rebuilding when allowed: exact caches are cut at
      // the plate's own device scale so they blit 1:1 (the fast path); while a plate resizes they draw scaled
      const ok = cache.c && cache.aux >= aux && (exact ? Math.abs(cache.S - S) <= S * 0.002 : cache.S >= S * 0.999 && cache.S <= S * 2.2);
      const usable = cache.c && cache.aux >= aux;
      if (Math.abs(S - (cache.req || 0)) > S * 0.001) { cache.req = S; cache.rs = 0; } else cache.rs = (cache.rs || 0) + 1;
      if (ok) return cache;
      if (!usable || (!st.built && ((st.stable >= 4 && cache.rs >= 4) || cache.S < S / 1.4 || cache.S > S * 2.6))) {
        const Sb = exact ? S : bucket(S), r = mk(Sb, aux);
        if (r) { cache.c = r; cache.S = Sb; cache.aux = aux; st.built = true; }
        else return null;
      }
      return cache.c ? cache : null;
    }
    // periodic strips get a whole number of device pixels per period
    const fitS = (P, S) => Math.max(1, Math.round(P * S)) / P;
    function mkSky(S, Hs) { const Sx = fitS(SKYP, S), r = newCanvas(Math.round(SKYP * Sx), Math.ceil(Hs * Sx)); if (!r) return null; paintSky(r.ctx, Sx, Hs); r.H = Hs; r.Sx = Sx; r.P = SKYP; return r; }
    function mkMtn(S) { const Sx = fitS(MTP, S), r = newCanvas(Math.round(MTP * Sx), Math.ceil((MTH + MTB) * Sx)); if (!r) return null; paintMountains(r.ctx, Sx); r.Sx = Sx; r.P = MTP; return r; }
    function mkCloud(i) { return (Sb) => { const C = CLOUDS[i], r = newCanvas(Math.ceil((C[1] - C[0] + 0.02) * Sb), Math.ceil(0.046 * Sb)); if (!r) return null; paintCloud(r.ctx, Sb, C); return r; }; }
    function mkWall(S) { const P = WP * WS, Sx = fitS(P, S), r = newCanvas(Math.round(P * Sx), Math.ceil((WBOT - WTOP) * Sx * WS)); if (!r) return null; paintWall(r.ctx, Sx); r.Sx = Sx; r.P = P; return r; }
    function mkSun(Sb) { const rp = Sb; const r = newCanvas(Math.ceil(rp * 2 + 4), Math.ceil(rp * 2 + 4)); if (!r) return null; paintSunDisc(r.ctx, rp); return r; }
    // head base sprite: box in head units
    const HB = [-9.2, -13.2, 10.2, 11.6];
    function mkHead(list) {
      return (Sb) => {
        const r = newCanvas(Math.ceil((HB[2] - HB[0]) * Sb), Math.ceil((HB[3] - HB[1]) * Sb)); if (!r) return null;
        r.ctx.setTransform(Sb, 0, 0, Sb, -HB[0] * Sb, -HB[1] * Sb); for (const L of list) drawLayers(r.ctx, L); return r;
      };
    }
    // sprites of the head per face: below the pupils (body + eye whites) and above them (lids, brows, whiskers, mouth)
    function headSpr(key, S, list) {
      if (!canOC) return null;
      let c = st.heads.get(key);
      if (!c) { if (st.heads.size > 26) { let old = null, ot = 1e18; for (const [k2, v] of st.heads) if (v.used < ot) { ot = v.used; old = k2; } st.heads.delete(old); } c = Cache(); st.heads.set(key, c); }
      c.used = ++st.hclock;
      return want(c, S, 0, mkHead(list));
    }

    // blit a horizontally periodic strip across the plate at device-pixel-rounded positions
    // draw a strip cache across the plate: 1:1 at whole device pixels when it was cut at this scale
    function strip(ctx, M, C, x0, yTop, u, dpr, w) {
      const r = C.c, cv = r.cv;
      if (Math.abs(C.S - u * dpr) <= C.S * 0.002) {
        const pw = cv.width; ctx.setTransform(1, 0, 0, 1, 0, 0);
        let xd = Math.round(x0 * M.a + M.e); const yd = Math.round(yTop * M.d + M.f), wd = w * M.a + M.e;
        xd -= Math.ceil((xd - M.e) / pw) * pw;
        for (; xd < wd; xd += pw) ctx.drawImage(cv, xd, yd);
        ctx.setTransform(M);
      } else blitStrip(ctx, M, cv, x0, yTop, r.P * u, cv.height * u / r.Sx, w);
    }
    function blitStrip(ctx, M, cv, x0, yTop, Pw, Hh, w) {
      if (!cv) return;
      const sx = M.a, ox = M.e, oy = M.f;
      let x = x0 - Math.ceil(x0 / Pw) * Pw;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const y0 = Math.round(yTop * M.d + oy), y1 = Math.round((yTop + Hh) * M.d + oy);
      for (; x < w; x += Pw) { const d0 = Math.round(x * sx + ox), d1 = Math.round((x + Pw) * sx + ox); ctx.drawImage(cv, d0, y0, d1 - d0, y1 - y0); }
      ctx.setTransform(M);
    }

    // ------------------------------------------------------------------ the poster's composition for any plate
    const KA = [0.45, 0.667, 1, 2, 3.5].map(Math.log);
    const KF = {
      hx: [0.47, 0.433, 0.45, 0.53, 0.53], hy: [0.355, 0.367, 0.43, 0.385, 0.40], R: [0.33, 0.29, 0.231, 0.215, 0.215],
      sdx: [1.0, 1.09, 1.1, 0.93, 0.93], sdy: [0.95, 0.94, 0.46, 0.16, 0.16], sr: [0.6, 0.6, 0.62, 0.79, 0.79], tdy: [1.35, 1.31, 0.95, 0.83, 0.8],
    };
    function kf(n, la) { const v = KF[n]; if (la <= KA[0]) return v[0]; for (let i = 1; i < KA.length; i++) if (la <= KA[i]) return v[i - 1] + (v[i] - v[i - 1]) * (la - KA[i - 1]) / (KA[i] - KA[i - 1]); return v[v.length - 1]; }
    const ROT0 = -14 * PI / 180;
    function layout(w, h) {
      const u = Math.min(w, h), la = Math.log(w / h), R = kf('R', la) * u, hx = kf('hx', la) * w, hy = kf('hy', la) * h;
      return { w, h, u, R, hx, hy, sunX: hx + kf('sdx', la) * R, sunY: hy + kf('sdy', la) * R, sunR: kf('sr', la) * R, tdy: kf('tdy', la) * R };
    }

    // ------------------------------------------------------------------ real play: Buqu skims and bounces along the wall
    const V = 170, LP = 6, DD = V * LP, GG = 520, YW = -8.6, YHAT = -33.5, T0 = 0.4;
    const HOPS = [[0.40, 0.85, YW, YW], [1.25, 0.60, YW, YW], [1.85, 0.28, YW, YW], [2.13, 0.26, YW, YW], [2.39, 0.24, YW, YW], [2.63, 0.55, YW, YHAT], [3.18, 1.22, YHAT, YW], [4.40, 0.42, YW, YW], [4.82, 0.38, YW, YW], [5.20, 1.20, YW, YW]];
    for (const hp of HOPS) hp.push((hp[3] - hp[2] - 0.5 * GG * hp[1] * hp[1]) / hp[1]);
    const BONK = 3.18, BIG = 6;
    const locT = (tau) => { let t = ((tau % LP) + LP) % LP; if (t < T0) t += LP; return t; };
    const iterOf = (tau) => Math.floor((tau - T0) / LP);
    function hopAt(tl) { for (let j = 0; j < HOPS.length; j++) { const hp = HOPS[j]; if (tl < hp[0] + hp[1] || j === HOPS.length - 1) { const tp = cl(tl - hp[0], 0, hp[1]); return { j, tp, y: hp[2] + hp[4] * tp + 0.5 * GG * tp * tp, vy: hp[4] + GG * tp, left: hp[1] - tp }; } } }
    // smoothed camera rise (periodic), so the walkway stays framed while big arcs carry him up
    const RISE = new Float32Array(240);
    {
      const raw = new Float32Array(240);
      for (let i = 0; i < 240; i++) raw[i] = Math.max(0, -hopAt(locT(i / 240 * LP)).y - 40) * 0.6;
      for (let i = 0; i < 240; i++) { let s = 0, ws = 0; for (let k = -24; k <= 24; k++) { const wgt = Math.exp(-(k * k) / 160); s += raw[(i + k + 240) % 240] * wgt; ws += wgt; } RISE[i] = s / ws; }
    }
    const riseAt = (tau) => { const f = (((tau % LP) + LP) % LP) / LP * 240, i = Math.floor(f), k = f - i; return RISE[i % 240] * (1 - k) + RISE[(i + 1) % 240] * k; };
    // the enter's own flight: leaves the poster's pose at its flight angle (-25 deg) and joins the loop's
    // arc at tau = 0 with the same height and speed (a gentler arc over the top)
    const LZ = hopAt(locT(0)), EV0 = -V * Math.tan(25 * PI / 180), EG = (LZ.vy - EV0) / 0.7, EY0 = LZ.y - EV0 * 0.7 - 0.245 * EG;
    const enterY = (tau) => { const k = tau + 0.7; return { y: EY0 + EV0 * k + 0.5 * EG * k * k, vy: EV0 + EG * k }; };
    const IMP = HOPS.map((hp) => { const t = hp[0] + hp[1], vy = hp[4] + GG * hp[1], power = cl(Math.abs(vy) / 400, 0, 1); return { t, power, y: hp[3] === YHAT ? YHAT + 8.6 : 0 }; });
    // trail tesserae of every flight arc (paint.ts stroke/flush): one tile per 2.6 units of path
    const ARCS = HOPS.map((hp, j) => {
      const tiles = []; let acc = 0, px = null, py = null, idx = 0;
      for (let tp = 0; tp <= hp[1]; tp += 0.0015) {
        const vy = hp[4] + GG * tp, sp = Math.hypot(V, vy), y = hp[2] + hp[4] * tp + 0.5 * GG * tp * tp;
        const bx = V * tp - V / sp * 5, by = y - vy / sp * 5;
        if (px !== null) {
          acc += Math.hypot(bx - px, by - py);
          if (acc >= 2.6) { acc -= 2.6; const w = cl(1.1 + tp * 0.9, 1.1, 3.2) * cl(sp / 650, 0.7, 1.35); tiles.push({ x: bx, y: by, a: Math.atan2(vy, V), hw: Math.max(0.6, w * 0.78), tb: hp[0] + tp, i: idx, c: Math.floor(h2(idx + j * 131, 7) * 4), jit: (h2(idx * 31 + j, 3) - 0.5) * 0.9 }); idx++; }
        }
        px = bx; py = by;
      }
      return { s: hp[0], e: hp[0] + hp[1], tiles, n: idx };
    });
    // paint chips of each impact (paint.ts splat)
    const CHIPS = IMP.map((im, j) => { const n = 5 + Math.round(im.power * 9), a = []; for (let i = 0; i < n; i++) { const sd = j * 37 + 5; const side = h2(sd + i, 1) < 0.5 ? -1 : 1; a.push({ dx: side * h2(sd + i * 7, 2) * (3 + im.power * 10), dy: -(h2(sd + i * 13, 3) - 0.2) * 2.4, r: h2(sd + i * 3, 4) * 3, s: 0.9 + h2(sd + i * 5, 5) * (0.8 + im.power), c: i % 4 }); } return { list: a, life: 2.2 + im.power * 1.5 }; });
    const COINS = [3.42, 3.62, 3.82, 4.02, 4.22];
    const LANTS = [[0.75, 1.55], [4.45, 5.2]];

    // ------------------------------------------------------------------ plate state
    const ST = {
      mode: '', mt: 0, T: 0, from: null, fromMode: '', last: null, phase: rnd() * 1.5, W: 0, H: 0,
      hit: null, look: null, shake: null, gag: null, chips: [], tileGone: 0, anchor: { x: 0.55, y: 0.4 }, nearSm: 0,
      br: { x: new Float64Array(9), y: new Float64Array(9), px: new Float64Array(9), py: new Float64Array(9), ok: false, tx: new Float64Array(18) },
    };
    const VERC = [K.ver, K.ver2, K.ver3, K.ver];
    // colour lookup tables: trail (4 glazes x 4 lights), braid (4 x 5), chips
    const TRC = VERC.map((c) => [MIX(c, WARM, 0.18), c, MIX(c, COOL, 0.108), MIX(c, COOL, 0.216)].map(CSS));
    const BRC = [K.hair, K.hair2, K.tq, K.tq3].map((c) => [-2, -1, 0, 1, 2].map((s) => CSS(litC(c, s))));
    const VERCSS = VERC.map(CSS);

    // ------------------------------------------------------------------ poses
    function basePose(L) {
      return { hx: L.hx, hy: L.hy, R: L.R, rot: ROT0, sx: 1, sy: 1, sqa: 0, expr: 'howl', blink: 0, lx: 0, ly: 0, mouthK: 1,
        mPan: 0, mY: 0, cPan: 0, sunX: L.sunX, sunY: L.sunY, sunR: L.sunR, rays: 0, rib: 1, ribGone: 0, ribT: null, world: null,
        bdir: ROT0 + 179 * PI / 180, bbend: -42 * PI / 180, bwave: 0.07, bpull: 9, bg: 0, ripple: -1, gone: 0 };
    }
    function idlePose(L, mt, T, s) {
      const P = basePose(L), R = L.R, C = 14, c = (mt + ST.phase) % C;
      P.rays = T * 0.028;
      P.bwave = 0.06; P.bph = T * 1.7;
      // live A
      if (c >= 3.25 && c < 3.39) P.blink = 1;
      if (c >= 3.6 && c < 4.6) { const k = (c - 3.6) / 1; P.hy -= 0.045 * R * Math.sin(k * PI) * Math.sin(k * PI); P.rot += 0.045 * Math.sin(k * TAU); P.ripple = k; P.bwave = 0.12; }
      if (c >= 4.6 && c < 5.6) { const b = bump(c, 4.6, 5.6), e = ss(Math.min(1, (c - 4.6) / 0.15)) * ss(Math.min(1, (5.6 - c) / 0.15)); P.expr = 'glare'; P.rot += 0.07 * b; P.lx = 0.65 * e; P.ly = 0.35 * e; P.bdir += 0.05 * b; }
      if (c >= 5.6 && c < 6.3) { const b = bump(c, 5.6, 6.3); P.expr = 'puff'; P.sy = 1 - 0.06 * b; P.sx = 1 + 0.05 * b; P.hy += 0.02 * R * b; P.R *= 1 - 0.02 * b; }
      if (c >= 6.3 && c < 7.4) { const b = bump(c, 6.3, 7.4), k = (c - 6.3) / 1.1; P.mouthK = 1 + 0.28 * b; P.R *= 1 + 0.05 * b; P.sy = 1 + 0.05 * b; P.sx = 1 - 0.03 * b; P.bwave = 0.07 + 0.2 * b; P.rays += 0.15 * eOut(k); P.ripple = k * 0.9; }
      if (c >= 7.4) P.rays += 0.15;
      // live B
      if (c >= 10.5 && c < 11.15) { const e = bump(c, 10.5, 11.15); P.expr = 'glare'; P.lx = -0.85 * Math.min(1, e * 1.6); P.ly = 0.15 * e; P.rot -= 0.04 * e; }
      if (c >= 11.2 && c < 11.34) P.blink = 1;
      if (c >= 11.5 && c < 12.6) { const e = bump(c, 11.5, 12.6), k = c - 11.5; P.expr = 'grit'; P.rot += 0.05 * Math.sin(k * 13) * e; P.hx -= 0.03 * R * e; P.bwave = 0.07 + 0.22 * e; P.bdir += 0.12 * e; P.sx = 1 - 0.03 * e; P.sy = 1 + 0.03 * e; }
      if (c >= 12.6 && c < 13.6) { const b = bump(c, 12.6, 13.6); P.mouthK = 1 + 0.15 * b; }
      if (c >= 10.5) P.rays += 0.12 * ss((c - 10.5) / 3);
      // the cursor comes near: he notices, stops howling and glares out at you
      ST.nearSm += ((s.near || 0) - ST.nearSm) * Math.min(1, (s.dt || 0) * 6);
      const nr = ST.nearSm;
      if (nr > 0.45 && P.expr === 'howl') P.expr = 'glare';
      if (nr > 0.05) { P.lx = lerp(P.lx, 0.7, nr); P.ly = lerp(P.ly, 0.42, nr); P.rot += 0.06 * nr; }
      return P;
    }
    function reactPose(L, mt, T, s) {
      const P = idlePose(L, 0, T, { near: 0, dt: s.dt }), R = L.R;
      P.rays = T * 0.028 + mt * 0.35;
      if (mt < 0.16) { const k = ss(mt / 0.16); P.sx = 1 + 0.09 * k; P.sy = 1 - 0.11 * k; P.hy += 0.05 * R * k; P.expr = 'grit'; P.bwave = 0.12; }
      else if (mt < 0.32) { const k = (mt - 0.16) / 0.16, b = bOut(k); P.sx = lerp(1.09, 0.93, b); P.sy = lerp(0.89, 1.12, b); P.hy += lerp(0.05, -0.08, b) * R; P.R *= 1 + 0.13 * ss(k); P.mouthK = 1 + 0.38 * ss(k); P.bwave = 0.35; P.bpull = 3; }
      else { const k = cl((mt - 0.32) / 0.48, 0, 1); P.sx = lerp(0.93, 0.97, k); P.sy = lerp(1.12, 1.06, k); P.hy -= 0.08 * R; P.R *= 1.13; P.mouthK = 1.38; P.rot += 0.022 * Math.sin(mt * 55) * (1 - k * 0.5); P.bwave = 0.3; P.bpull = 5; }
      P.bph = T * 1.7 + mt * 9;
      P.ripple = mt > 0.16 ? Math.min(1, (mt - 0.16) / 0.5) : -1;
      if (s.hover) { const dx = s.hover.x - P.hx, dy = s.hover.y - P.hy, d = Math.hypot(dx, dy) || 1; P.lx = dx / d * 0.8; P.ly = dy / d * 0.8; }
      return P;
    }
    function playCam(tau, L) {
      const u = L.u, ws = WS * u, tl = locT(tau), hs = hopAt(tl);
      let rise = riseAt(tau);
      if (tau < 0) { const e = enterY(Math.max(-0.7, tau)); hs.y = e.y; hs.vy = e.vy; rise = riseAt(0) + 0.6 * (LZ.y - e.y); }
      const yWall = L.h - 0.25 * u + rise * ws;
      return { ws, tau, tl, hs, hX: V * tau, hY: hs.y, hsx: 0.36 * L.w, hsy: yWall + hs.y * ws, k: ws, rise, yoff: 0, cut: -1e9 };
    }
    function loopHead(P, W, L, tau) {
      // displayed tilt along the flight, look at the landing, squash on impacts, the big spin after the bonk
      const hs = W.hs, tl = W.tl, j = hs.j, vy = hs.vy;
      let tilt = cl(Math.atan2(vy, V + 60) * 0.5, -0.45, 0.45);
      if (hs.left < 1.1) { const la = Math.atan2(HOPS[j][3] - hs.y, V * hs.left + 1); const lt = cl(wrapA(la) * 0.55, -0.7, 0.7); tilt = tilt * 0.3 + lt * 0.7; P.lx = Math.cos(la) * 0.55; P.ly = Math.sin(la) * 0.55; }
      let rot = tilt;
      if (j === BIG) rot += TAU * eIO((hs.tp - 0.12) / 0.62);
      P.rot = rot;
      // impacts
      let sq = 0, sqa = -PI / 2;
      for (const im of IMP) { let dtI = tl - im.t; if (dtI < -LP / 2) dtI += LP; if (dtI >= 0 && dtI < 0.25) sq = Math.max(sq, Math.min(1, 0.45 + im.power) - dtI / 0.11); }
      if (sq > 0) { const e = Math.sin(Math.min(1, sq) * PI / 2); P.sqa = sqa; P.sx = 1 - 0.3 * e; P.sy = 1 + 0.2 * e; }
      // faces by situation (game.ts)
      let ex = 'glare';
      if (j === 5 && hs.tp > 0.18) ex = 'fear';
      if (hs.left < 0.28) ex = 'grit';
      if (j === BIG) ex = hs.tp < 0.3 ? 'howl' : hs.tp < 0.8 ? 'bliss' : hs.left < 0.28 ? 'grit' : 'glare';
      if (j === 7) ex = 'smug';
      if (j === 9 && hs.tp < 0.35) ex = 'howl';
      P.expr = ex;
      if ((((tau % 7.3) + 7.3) % 7.3) < 0.12 && ex === 'glare') P.blink = 1;
      // braid streams back in the wind of his flight
      P.bdir = Math.atan2(vy, V) + PI; P.bbend = -0.35; P.bwave = 0.12; P.bph = tau * 9; P.bpull = 2.2; P.bg = 1;
    }
    function enterPose(L, mt, T, s) {
      const e = cl(mt / 0.7, 0, 1), ee = eIO(e), tau = mt - 0.7;
      const P0 = reactPose(L, 0.8, T, s), W = playCam(tau, L);
      const P = basePose(L);
      const Rp = 7.8 * 1.12 * W.ws, Zp = P0.R / Rp, Zc = lerp(Zp, 1, ee);
      W.k = W.ws * Zc;
      W.hsx = lerp(P0.hx, W.hsx, ee); W.hsy = lerp(P0.hy, W.hsy, ee);
      W.cut = -0.7;
      P.world = W; P.hx = W.hsx; P.hy = W.hsy; P.R = Rp * Zc;
      loopHead(P, W, L, tau);
      P.rot = lerp(P0.rot, P.rot, ee); P.sx = lerp(P0.sx, P.sx, ee); P.sy = lerp(P0.sy, P.sy, ee);
      if (e < 0.4) { P.expr = 'howl'; P.mouthK = lerp(1.38, 1, e / 0.4); }
      P.mPan = 0.7 * ee; P.mY = lerp(0, 0.2 - W.rise * WS * 0.3, ee); P.cPan = 0.12 * ee;
      const ps = playSun(L); P.sunX = lerp(P0.sunX, ps[0], ee); P.sunY = lerp(P0.sunY, ps[1], ee); P.sunR = lerp(P0.sunR, ps[2], ee);
      P.rays = T * 0.028 + 0.3;
      // the poster's trail stays where it was laid in the world and dissolves from its tail
      const dWorld = (V * -0.7 - W.hX) * W.k;
      P.ribT = { ax: P0.hx, ay: P0.hy, k: Zc / Zp, dx: W.hsx - P0.hx + dWorld, dy: W.hsy - P0.hy + (EY0 - W.hY) * W.k, R: P0.R, hx: P0.hx, hy: P0.hy };
      P.ribGone = ss(e * 1.15);
      P.bpull = lerp(6, 2.2, ee);
      return P;
    }
    function playSun(L) { return [0.7 * L.w, L.h - 0.6 * L.u, 0.065 * L.u]; }
    function loopPose(L, mt, T) {
      const tau = mt, W = playCam(tau, L), P = basePose(L);
      W.cut = -0.7;
      P.world = W; P.hx = W.hsx; P.hy = W.hsy; P.R = 7.8 * 1.12 * W.ws;
      loopHead(P, W, L, tau);
      P.mPan = 0.7 + tau * MTP / LP; P.mY = 0.2 - W.rise * WS * 0.3; P.cPan = 0.12;
      const ps = playSun(L); P.sunX = ps[0]; P.sunY = ps[1] + W.rise * W.ws * 0.05; P.sunR = ps[2];
      P.rays = T * 0.028 + 0.3; P.rib = 0;
      return P;
    }
    function squeezePose(L, mt, T, s) {
      // shoved against the plate's edge by the neighbour that opened: cheek and nose flattened on the edge,
      // glaring at it; after a beat he fills his cheeks, pulls back and slams into it, again and again
      const P = idlePose(L, 0, T, { near: 0, dt: s.dt }), sq = cl(s.squeeze || 0, 0, 1), w = L.w;
      P.R = L.R * (1 + 0.18 * sq);
      const R = P.R, k = ss(Math.min(1, sq * 1.7));
      let back = 0, slam = 0, ex = sq < 0.25 ? 'howl' : 'glare';
      if (mt > 0.9 && sq > 0.3) {
        const ph = ((mt - 0.9) % 1.5) / 1.5;
        if (ph < 0.32) { back = ss(ph / 0.32); ex = 'puff'; }
        else if (ph < 0.4) { back = 1 - ss((ph - 0.32) / 0.08); ex = 'grit'; }
        else if (ph < 0.62) { slam = 1 - (ph - 0.4) / 0.22; ex = 'grit'; }
      }
      P.sqa = 0; P.sx = 1 - 0.26 * sq - 0.08 * slam; P.sy = 1 + 0.12 * sq + 0.05 * slam;
      const push = w - 0.96 * R * P.sx;
      P.hx = lerp(L.hx, push, k) - 0.16 * R * back;
      P.hy = L.hy + 0.04 * R * sq;
      P.rot = lerp(ROT0, 0.08, k) - 0.06 * back;
      P.expr = ex; P.lx = 1; P.ly = 0.15;
      P.bdir = PI + 0.05; P.bbend = 0.25 * k; P.bwave = 0.03 + 0.1 * slam; P.bpull = 10;
      P.slam = slam; P.mouthK = 1;
      return P;
    }
    // event overlays
    function applyEvents(P, L, T) {
      const R = P.R;
      if (ST.hit) {
        const k = (T - ST.hit.t0) / 0.95;
        if (k > 1 || k < 0) ST.hit = null;
        else {
          let dx = P.hx - ST.hit.x, dy = P.hy - ST.hit.y; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
          const knock = k < 0.12 ? eOut(k / 0.12) : 1 - ss((k - 0.12) / 0.7);
          P.hx += dx * R * 0.3 * knock; P.hy += dy * R * 0.22 * knock;
          P.rot += 0.25 * knock * (dx > 0 ? 1 : -1);
          P.sqa = Math.atan2(dy, dx); P.sx = 1 - 0.2 * knock; P.sy = 1 + 0.12 * knock;
          P.expr = k < 0.2 ? 'fear' : k < 0.58 ? 'grit' : 'glare';
          if (k >= 0.58) { P.lx = -dx * 0.9; P.ly = -dy * 0.9; }
          P.blink = 0;
        }
      }
      if (ST.look) {
        const k = (T - ST.look.t0) / 1.5;
        if (k > 1 || k < 0) ST.look = null;
        else { const e = ss(Math.min(1, k * 5)) * ss(Math.min(1, (1 - k) * 4)); const d = Math.hypot(ST.look.dx, ST.look.dy) || 1; P.lx = lerp(P.lx, ST.look.dx / d, e); P.ly = lerp(P.ly, ST.look.dy / d, e); P.rot += 0.08 * e * (ST.look.dy / d); if (P.expr === 'howl' && e > 0.3) P.expr = 'glare'; }
      }
      if (ST.shake) {
        const k = (T - ST.shake.t0) / 0.9, a = ST.shake.a;
        if (k > 1 || k < 0) ST.shake = null;
        else { const f = 1 - k; P.rot += a * 0.3 * Math.sin(k * TAU * 2.6) * f; P.hx += a * 0.06 * R * Math.sin(k * TAU * 2.2) * f; P.hy += a * 0.03 * R * Math.sin(k * TAU * 3.1) * f; P.expr = k < 0.3 ? 'fear' : k < 0.6 ? 'grit' : P.expr; P.bwave = Math.max(P.bwave, 0.3 * f); }
      }
      if (ST.gag) {
        const g = ST.gag, k = g.age;
        if (k > 2.2) ST.gag = null;
        else if (!P.world) {
          if (k < 0.8) { const w = eIn(k / 0.8); P.rot -= 0.16 * ss(k / 0.3); P.expr = 'puff'; P.bdir = P.bdir - w * TAU * 2.25; P.bwave = 0.04; P.bbend = 0.2 + 0.7 * ss(k / 0.4); P.bpull = 16; P.sx *= 1 + 0.03 * Math.sin(k * 20) * w; }
          else if (k < 1.7) { const e = ss((k - 0.8) / 0.2); P.expr = k < 1.0 ? 'howl' : 'smug'; P.rot -= 0.16 * (1 - e) - 0.05 * bump(k, 0.8, 1.7); P.bpull = 4; }
          P.gone = k > 0.8 && k < 1.9 ? 1 : k >= 1.9 && k < 2.05 ? 1 - (k - 1.9) / 0.15 : 0;
        }
      }
    }
    const NUMK = ['hx', 'hy', 'R', 'rot', 'sx', 'sy', 'lx', 'ly', 'mouthK', 'mY', 'cPan', 'sunX', 'sunY', 'sunR', 'bdir', 'bbend', 'bwave'];
    function blendPose(A, B, k) {
      const P = Object.assign({}, B);
      for (const n of NUMK) P[n] = lerp(A[n], B[n], k);
      P.rot = A.rot + wrapA(B.rot - A.rot) * k; P.bdir = A.bdir + wrapA(B.bdir - A.bdir) * k;
      // squash axis: blend through the scales only
      if (A.sqa !== B.sqa) { P.sqa = k < 0.5 ? A.sqa : B.sqa; }
      const am = ((A.mPan % MTP) + MTP) % MTP; P.mPan = lerp(am, am > 0.2 * MTP ? MTP : 0, k);
      P.expr = k < 0.35 ? A.expr : B.expr;
      P.blink = k < 0.35 ? A.blink : B.blink;
      return P;
    }

    // a layer that holds still (the poster's pose) is kept as device pixels and blitted 1:1 until it moves
    const PZ = {};
    function posed(ctx, M, slot, key, bb, draw, moving) {
      moving = moving || draw;
      if (!canOC) { moving(ctx); return; }
      const z = PZ[slot] || (PZ[slot] = { key: '', n: 0, cv: null, cx: null, has: '', x: 0, y: 0, w: 0, h: 0 });
      if (z.has === key) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(z.cv, 0, 0, z.w, z.h, z.x, z.y, z.w, z.h); ctx.setTransform(M); return; }
      if (z.key === key) z.n++; else { z.key = key; z.n = 0; z.has = ''; }
      if (z.n >= 3 && !st.built) {
        const x0 = Math.floor(bb[0] * M.a + M.e) - 2, y0 = Math.floor(bb[1] * M.d + M.f) - 2, x1 = Math.ceil(bb[2] * M.a + M.e) + 2, y1 = Math.ceil(bb[3] * M.d + M.f) + 2;
        const W = Math.max(1, x1 - x0), H = Math.max(1, y1 - y0);
        if (!z.cv || z.cv.width < W || z.cv.height < H) { const nc = newCanvas(W + 24, H + 24); if (!nc) { moving(ctx); return; } z.cv = nc.cv; z.cx = nc.ctx; }
        else { z.cx.setTransform(1, 0, 0, 1, 0, 0); z.cx.clearRect(0, 0, z.cv.width, z.cv.height); }
        z.cx.setTransform(M.a, M.b, M.c, M.d, M.e - x0, M.f - y0);
        draw(z.cx);
        z.x = x0; z.y = y0; z.w = W; z.h = H; z.has = key; st.built = true;
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(z.cv, 0, 0, W, H, x0, y0, W, H); ctx.setTransform(M);
        return;
      }
      moving(ctx);
    }
    const q2 = (v) => Math.round(v * 100) / 100;

    // ------------------------------------------------------------------ drawing pieces
    const BUCK = new Map();
    function bq(key, css, a) { let b = BUCK.get(key); if (!b) BUCK.set(key, b = { css, a: [], n: 0 }); b.a.push(a); b.n++; }
    function flushB(ctx) {
      for (const b of BUCK.values()) {
        if (!b.n) continue;
        ctx.fillStyle = b.css; ctx.beginPath();
        for (const p of b.a) { ctx.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) ctx.lineTo(p[i], p[i + 1]); ctx.closePath(); }
        ctx.fill(); b.a.length = 0; b.n = 0;
      }
    }
    function rays(ctx, P, L) {
      // the outer ring of sun tesserae (post.ts: ring 3, every other tile glazed toward the sun)
      const r0 = P.sunR, r1 = P.sunR * 1.25, n = RINGS[3], g = Math.max(0.6, r0 * 0.012);
      for (let s = 0; s < n; s++) {
        // the ring turns as one: slot s shows tile (s - turned) so crossing a tile boundary never jumps
        const sOff = s - Math.floor(P.rays * n / TAU);
        if (h2(3 * 97 + 5, ((sOff % n) + n) % n * 31 + 7) >= 0.55) continue;
        const a0 = s / n * TAU + (P.rays % (TAU / n)) - PI, a1 = a0 + TAU / n;
        const am = (a0 + a1) / 2, ym = P.sunY + Math.sin(am) * (r0 + r1) / 2, Y = (L.h - ym) / L.u;
        const col = MIX(GRADE(skyAt(tOfY(Y))), GRADE(SUNC), 0.45);
        const ga = g / r0, gs = 1.6 * g / r0;
        const lenK = 1 + 0.06 * (h2(sOff, 11) - 0.5), ro = r1 * lenK;
        const sk = Math.round(Y * 40), sky = GRADE(skyAt(tOfY(Y)));
        // the grout seam around each glazed ray (post.ts: mix(grout, sky, 0.4)), then the ray
        bq('rs' + sk, CSS(MIX(K.grout, sky, 0.4)), [P.sunX + Math.cos(a0) * r0, P.sunY + Math.sin(a0) * r0, P.sunX + Math.cos(a1) * r0, P.sunY + Math.sin(a1) * r0, P.sunX + Math.cos(a1) * (ro + g), P.sunY + Math.sin(a1) * (ro + g), P.sunX + Math.cos(a0) * (ro + g), P.sunY + Math.sin(a0) * (ro + g)]);
        bq('ry' + sk, CSS(col), [P.sunX + Math.cos(a0 + gs) * (r0 + g), P.sunY + Math.sin(a0 + gs) * (r0 + g), P.sunX + Math.cos(a1 - gs) * (r0 + g), P.sunY + Math.sin(a1 - gs) * (r0 + g),
          P.sunX + Math.cos(a1 - gs) * ro, P.sunY + Math.sin(a1 - gs) * ro, P.sunX + Math.cos(a0 + gs) * ro, P.sunY + Math.sin(a0 + gs) * ro]);
      }
      flushB(ctx);
    }
    function sunDisc(ctx, P, M, dpr) {
      const Sd = P.sunR * dpr, C = canOC ? want(st.sun, Sd, 0, mkSun, true) : null;
      if (C && Math.abs(C.S - Sd) <= C.S * 0.002) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(C.c.cv, Math.round((P.sunX * M.a + M.e) - C.S - 2), Math.round((P.sunY * M.d + M.f) - C.S - 2)); ctx.setTransform(M); return; }
      if (C) { const r = C.c, k = P.sunR / C.S; ctx.drawImage(r.cv, P.sunX - (C.S + 2) * k, P.sunY - (C.S + 2) * k, r.cv.width * k, r.cv.height * k); return; }
      ctx.save(); ctx.translate(P.sunX - P.sunR - 2, P.sunY - P.sunR - 2); paintSunDisc(ctx, P.sunR); ctx.restore();
    }
    // the poster's trail: a ribbon of vermilion tesserae from the left edge into the back of his head
    function ribbon(ctx, P, L, T, M) {
      if (P.rib <= 0) return;
      if (!P.ribT && P.ripple < 0 && P.rib >= 1 && P.ribGone <= 0) {
        const key = [L.w, L.h, q2(P.hx), q2(P.hy), q2(P.R), Math.round(P.sunX), Math.round(P.sunY), M.a, M.e, M.f].join(',');
        posed(ctx, M, 'rib', key, [-0.06 * L.w, P.hy - 1.2 * P.R, P.hx + 0.6 * P.R, P.hy + L.tdy * (P.R / L.R) + 1.6 * P.R], (c) => ribbonDraw(c, P, L));
        return;
      }
      ribbonDraw(ctx, P, L);
    }
    function ribbonDraw(ctx, P, L) {
      const R = P.ribT ? P.ribT.R : P.R, hx = P.ribT ? P.ribT.hx : P.hx, hy = P.ribT ? P.ribT.hy : P.hy, s = R / 7.8;
      const fly = -25 * PI / 180, end = [hx - Math.cos(fly) * 5 * s, hy - Math.sin(fly) * 5 * s];
      const p0 = [-0.04 * L.w - 2 * s, (P.ribT ? hy : hy) + L.tdy * (R / L.R)];
      const span = Math.max(1, (end[0] - p0[0]) / (4.8 * R)), kk = cl(1 / span, 0.3, 1);
      const c1 = [lerp(p0[0], end[0], 0.33) + 0.15 * R * kk, lerp(p0[1], end[1], 0.33) + 0.4 * R * kk], c2 = [lerp(p0[0], end[0], 0.66) + 0.3 * R * kk, lerp(p0[1], end[1], 0.66) + 0.25 * R * kk];
      const N = 48, pts = [], cum = [0];
      for (let i = 0; i <= N; i++) { const t = i / N, v = 1 - t; pts.push([v * v * v * p0[0] + 3 * v * v * t * c1[0] + 3 * v * t * t * c2[0] + t * t * t * end[0], v * v * v * p0[1] + 3 * v * v * t * c1[1] + 3 * v * t * t * c2[1] + t * t * t * end[1]]); if (i) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); }
      const tot = cum[N], spacing = s, sdx = P.sunX - hx, sdy = P.sunY - hy, sdl = Math.hypot(sdx, sdy) || 1;
      const T2 = P.ribT;
      let sPos = spacing * 0.5, idx = 0, j = 1;
      const nT = Math.ceil(tot / spacing);
      while (sPos < tot) {
        while (cum[j] < sPos) j++;
        const a = pts[j - 1], b = pts[j], f = (sPos - cum[j - 1]) / Math.max(1e-6, cum[j] - cum[j - 1]);
        const x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f, L2 = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        const ux = (b[0] - a[0]) / L2, uy = (b[1] - a[1]) / L2, nx = -uy, ny = ux, fr = sPos / tot;
        const pf = idx / nT;
        if (pf >= P.ribGone && pf <= P.rib) {
          const w = (1.6 + (2.6 - 1.6) * Math.pow(fr, 0.8)) * s, hw = Math.max(0.6 * s, w * 0.78);
          let sc = 1;
          if (P.ripple >= 0) { const d = (fr - P.ripple) * 8; sc = 1 + 0.2 * Math.exp(-d * d); }
          const hl = (spacing * 0.5 - 0.35 * s / 2.6) * sc, jit = (h2(idx * 31 + 5, 1) - 0.5) * 0.9 * s / 1.6;
          const cx = x + nx * jit, cy = y + ny * jit;
          const n = Math.max(1, Math.round(3 * hw * 2 / (2.6 * 0.78 * 2 * s))), gap = 0.32 * s / 2.6;
          const lf = ((cx - hx) * sdx + (cy - hy) * sdy) / sdl / (R * 1.3), li = lf > 0.45 ? 0 : lf < -0.6 ? 3 : lf < -0.15 ? 2 : 1;
          for (let q = 0; q < n; q++) {
            const a0 = (-hw + 2 * hw * q / n + gap / 2) * sc, a1 = (-hw + 2 * hw * (q + 1) / n - gap / 2) * sc;
            const ci = Math.floor(h2(idx * 7 + q * 13 + 3, 2) * 4);
            let p = [cx + ux * hl + nx * a1, cy + uy * hl + ny * a1, cx - ux * hl + nx * a1, cy - uy * hl + ny * a1, cx - ux * hl + nx * a0, cy - uy * hl + ny * a0, cx + ux * hl + nx * a0, cy + uy * hl + ny * a0];
            if (T2) for (let i = 0; i < 8; i += 2) { p[i] = (p[i] - T2.ax) * T2.k + T2.ax + T2.dx; p[i + 1] = (p[i + 1] - T2.ay) * T2.k + T2.ay + T2.dy; }
            bq('t' + ci + li, TRC[ci][li], p);
          }
        }
        idx++; sPos += spacing;
      }
      flushB(ctx);
    }
    function headXf(P) {
      const s = P.R / 7.8, ca = Math.cos(P.sqa), sa = Math.sin(P.sqa), r2 = P.rot - P.sqa, cb = Math.cos(r2), sb = Math.sin(r2);
      // M = T * R(sqa) * S(sx,sy) * R(rot - sqa) * s
      const a = ca * P.sx, b = sa * P.sx, c = -sa * P.sy, d = ca * P.sy;
      return [(a * cb + c * sb) * s, (b * cb + d * sb) * s, (-a * sb + c * cb) * s, (-b * sb + d * cb) * s, P.hx, P.hy];
    }
    const XF = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
    function braid(ctx, P, L, dt, frozen, wshift) {
      const B = ST.br, m = headXf(P), s = P.R / 7.8, an = XF(m, -1.4, -11.2), seg = 3 * s * Math.hypot(P.sx, P.sy) / Math.SQRT2;
      const tg = B.tx; tg[0] = an[0]; tg[1] = an[1];
      for (let i = 1; i < 9; i++) { const t = i / 8, a = P.bdir + P.bbend * t + P.bwave * Math.sin(t * 5.1 - (P.bph || 0)) * (0.4 + t); tg[2 * i] = tg[2 * i - 2] + Math.cos(a) * seg; tg[2 * i + 1] = tg[2 * i - 1] + Math.sin(a) * seg; }
      if (!B.ok || frozen || Math.hypot(B.x[0] - an[0], B.y[0] - an[1]) > seg * 4) { for (let i = 0; i < 9; i++) { B.x[i] = B.px[i] = tg[2 * i]; B.y[i] = B.py[i] = tg[2 * i + 1]; } B.ok = true; }
      else {
        if (wshift) for (let i = 0; i < 9; i++) { B.x[i] += wshift[0]; B.px[i] += wshift[0]; B.y[i] += wshift[1]; B.py[i] += wshift[1]; }
        const n = Math.max(1, Math.ceil(dt * 60)), h = dt / n, damp = Math.pow(0.94, h * 60), kp = 1 - Math.exp(-P.bpull * h), gy = P.bg ? 9 * L.u : 0;
        for (let it = 0; it < n; it++) {
          for (let i = 1; i < 9; i++) { const vx = (B.x[i] - B.px[i]) * damp, vy = (B.y[i] - B.py[i]) * damp; B.px[i] = B.x[i]; B.py[i] = B.y[i]; B.x[i] += vx; B.y[i] += vy + gy * h * h; }
          for (let i = 1; i < 9; i++) { B.x[i] += (tg[2 * i] - B.x[i]) * kp; B.y[i] += (tg[2 * i + 1] - B.y[i]) * kp; }
          B.x[0] = an[0]; B.y[0] = an[1];
          for (let r = 0; r < 4; r++) for (let i = 1; i < 9; i++) {
            const dx = B.x[i] - B.x[i - 1], dy = B.y[i] - B.y[i - 1], dd = Math.hypot(dx, dy) || 1, df = (dd - seg) / dd;
            if (i === 1) { B.x[i] -= dx * df; B.y[i] -= dy * df; } else { B.x[i - 1] += dx * df * 0.5; B.y[i - 1] += dy * df * 0.5; B.x[i] -= dx * df * 0.5; B.y[i] -= dy * df * 0.5; }
          }
        }
      }
      // draw: a chain of white tesserae on a grout bed, the last two tied with the jade ribbon (head.ts render)
      const fine = s > 5.5, Lx = Math.cos(P.rot + LDIR), Ly = Math.sin(P.rot + LDIR);
      const lightAt = (x, y) => { const vx = (x - P.hx) / P.R, vy = (y - P.hy) / P.R, r = Math.hypot(vx, vy) || 1e-6, k = cl((r - 0.38) / 0.6, 0, 1), f = (vx * Lx + vy * Ly) / r * k; return f >= 0.72 ? 4 : f >= 0.35 ? 3 : f <= -0.75 ? 0 : f <= -0.35 ? 1 : 2; };
      const under = [], gone = P.gone || 0;
      for (let i = 1; i < 9; i++) {
        if (i === 8 && gone >= 1) continue;
        const ax = B.x[i - 1], ay = B.y[i - 1], bx = B.x[i], by = B.y[i], dx = bx - ax, dy = by - ay, Ln = Math.hypot(dx, dy) || 1, ux = dx / Ln, uy = dy / Ln, nx = -uy, ny = ux;
        const sc = i === 8 ? 1 - gone : 1, w = (1.25 - i * 0.07) * s * sc * 1.25, e = 0.12 * s;
        const x0 = ax - ux * e, y0 = ay - uy * e, x1 = bx + ux * e, y1 = by + uy * e, gw = w + 0.32 * s;
        under.push([x0 + nx * gw, y0 + ny * gw, x1 + nx * gw, y1 + ny * gw, x1 - nx * gw, y1 - ny * gw, x0 - nx * gw, y0 - ny * gw]);
        const col = i >= 7 ? (i === 8 ? 3 : 2) : (i % 2 ? 0 : 1), na = fine ? 2 : 1, nl = fine ? 2 : 1, g = Math.max(0.35, 0.13 * s);
        for (let q = 0; q < nl; q++) for (let r = 0; r < na; r++) {
          const ta = q / nl, tb = (q + 1) / nl, sa = -w + 2 * w * r / na, sb = -w + 2 * w * (r + 1) / na;
          const xa = lerp(x0, x1, ta) + ux * g, ya = lerp(y0, y1, ta) + uy * g, xb = lerp(x0, x1, tb) - ux * g, yb = lerp(y0, y1, tb) - uy * g;
          const p = [xa + nx * (sa + g), ya + ny * (sa + g), xb + nx * (sa + g), yb + ny * (sa + g), xb + nx * (sb - g), yb + ny * (sb - g), xa + nx * (sb - g), ya + ny * (sb - g)];
          const li = lightAt((xa + xb) / 2, (ya + yb) / 2);
          bq('b' + col + li, BRC[col][li], p);
        }
      }
      const t8 = [B.x[8], B.y[8]], rb = 1.55 * s * (1 - gone);
      if (rb > 0.3) {
        under.push(ellPoly(t8[0], t8[1], rb + 0.3 * s, rb + 0.3 * s, 12));
        const li = lightAt(t8[0], t8[1]);
        if (fine) { for (let q = 0; q < 5; q++) { const a0 = q / 5 * TAU + 0.3, a1 = (q + 1) / 5 * TAU + 0.3, g = 0.14 * s; bq('b0' + li, BRC[0][li], [t8[0] + Math.cos(a0 + 0.12) * rb * 0.45, t8[1] + Math.sin(a0 + 0.12) * rb * 0.45, t8[0] + Math.cos(a0 + 0.1) * (rb - g), t8[1] + Math.sin(a0 + 0.1) * (rb - g), t8[0] + Math.cos(a1 - 0.1) * (rb - g), t8[1] + Math.sin(a1 - 0.1) * (rb - g), t8[0] + Math.cos(a1 - 0.12) * rb * 0.45, t8[1] + Math.sin(a1 - 0.12) * rb * 0.45]); }
          bq('b1' + li, BRC[1][li], ellPoly(t8[0], t8[1], rb * 0.36, rb * 0.36, 8)); }
        else bq('b0' + li, BRC[0][li], ellPoly(t8[0], t8[1], rb * 0.85, rb * 0.85, 10));
      }
      ctx.fillStyle = GROUT; ctx.beginPath(); for (const q0 of under) { const p = orient(q0); ctx.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) ctx.lineTo(p[i], p[i + 1]); ctx.closePath(); } ctx.fill();
      flushB(ctx);
      return t8;
    }
    function head(ctx, P, M, dpr) {
      const s = P.R / 7.8, fine = s > 5.5 ? 2 : 1, H = headLOD(fine === 2), m = headXf(P);
      ctx.save();
      ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      const ex = H.F[P.expr] ? P.expr : 'howl', F = H.F[ex], blink = !!(P.blink && F.eyes), S = s * dpr * 1.18;
      const HW = HB[2] - HB[0], HH = HB[3] - HB[1];
      const OV = ORDER.slice(2), scaled = P.mouthK !== 1 && ex === 'howl';
      const direct = (c) => {
        drawLayers(c, H.base); if (!blink && F.eyes) drawLayers(c, F.eyes);
        if (!blink && F.pupils) { c.save(); c.translate(cl(P.lx, -1, 1) * 0.42, cl(P.ly, -1, 1) * 0.3); drawLayers(c, F.pupils); c.restore(); }
        if (blink) drawLayers(c, H.blink);
        for (const g of OV) { const lay = F[g]; if (!lay) continue; if (g === 'mouth' && scaled) { c.save(); c.translate(4, 5.0); c.scale(1 + (P.mouthK - 1) * 0.7, P.mouthK); c.translate(-4, -5.0); drawLayers(c, lay); c.restore(); } else drawLayers(c, lay); }
      };
      const key = [fine, ex, blink ? 1 : 0, Math.round(P.lx * 40), Math.round(P.ly * 40), q2(P.mouthK), m.map((v) => Math.round(v * 1e4)).join(':'), M.a, M.e, M.f].join(',');
      const cs = [[HB[0], HB[1]], [HB[2], HB[1]], [HB[2], HB[3]], [HB[0], HB[3]]].map(([x, y]) => XF(m, x, y));
      const bb = [Math.min(cs[0][0], cs[1][0], cs[2][0], cs[3][0]), Math.min(cs[0][1], cs[1][1], cs[2][1], cs[3][1]), Math.max(cs[0][0], cs[1][0], cs[2][0], cs[3][0]), Math.max(cs[0][1], cs[1][1], cs[2][1], cs[3][1])];
      ctx.restore();
      posed(ctx, M, 'head', key, bb, (c) => { c.save(); c.transform(m[0], m[1], m[2], m[3], m[4], m[5]); direct(c); c.restore(); }, (c) => {
        // moving: the body and eye whites as a sprite, pupils and features drawn live
        c.save(); c.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        const under = blink ? headSpr(fine + 'base', S, [H.base]) : headSpr(fine + ex + 'U', S, [H.base, F.eyes || []]);
        if (under) c.drawImage(under.c.cv, HB[0], HB[1], HW, HH);
        else { drawLayers(c, H.base); if (!blink && F.eyes) drawLayers(c, F.eyes); }
        if (!blink && F.pupils) { c.save(); c.translate(cl(P.lx, -1, 1) * 0.42, cl(P.ly, -1, 1) * 0.3); drawLayers(c, F.pupils); c.restore(); }
        if (blink) drawLayers(c, H.blink);
        for (const g of OV) { const lay = F[g]; if (!lay) continue; if (g === 'mouth' && scaled) { c.save(); c.translate(4, 5.0); c.scale(1 + (P.mouthK - 1) * 0.7, P.mouthK); c.translate(-4, -5.0); drawLayers(c, lay); c.restore(); } else drawLayers(c, lay); }
        c.restore();
      });
    }
    // ---- loop world pieces (drawn in world units through W)
    function wx(W, x) { return W.hsx + (x - W.hX) * W.k; }
    function wy(W, y) { return W.hsy + (y - W.hY) * W.k + W.yoff; }
    function seal(ctx, cx, cy, S, gold, seed, a) {
      // sealTex: vermilion tesserae with carved cream strokes, gold-rimmed for great feats
      ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, cy);
      const o = -S / 2;
      if (gold) { ctx.fillStyle = GC(K.gold); ctx.fillRect(o - S * 0.1, o - S * 0.1, S * 1.2, S * 1.2); }
      ctx.fillStyle = GROUT; ctx.fillRect(o, o, S, S);
      const n = 3, tw = S / n, g = Math.max(0.5, S * 0.04);
      ctx.fillStyle = VERCSS[0]; ctx.beginPath(); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) ctx.rect(o + i * tw + g, o + j * tw + g, tw - 2 * g, tw - 2 * g); ctx.fill();
      ctx.fillStyle = VERCSS[1]; ctx.fillRect(o + S * 0.2, o + S * 0.2, S * 0.6, S * 0.6);
      ctx.strokeStyle = KH.cream; ctx.lineWidth = Math.max(0.7, S * 0.07); ctx.lineCap = 'round'; ctx.beginPath();
      const q = S / 4;
      for (let cy2 = 0; cy2 < 3; cy2++) for (let cx2 = 0; cx2 < 3; cx2++) {
        const x = o + q * 0.6 + cx2 * q, y = o + q * 0.6 + cy2 * q;
        if (h2(cx2 * 7 + seed, cy2) < 0.55 && cx2 < 2) { ctx.moveTo(x, y); ctx.lineTo(x + q, y); }
        if (h2(cx2 + seed * 3, cy2 * 5) < 0.5 && cy2 < 2) { ctx.moveTo(x, y); ctx.lineTo(x, y + q); }
      }
      ctx.stroke(); ctx.restore();
    }
    function guard(ctx, W, x, tg) {
      // the net guard (msprites figureTex 'netguard'): ochre robe, terracotta hat, net on a pole
      const k = W.k, X = wx(W, x), Y = wy(W, 0);
      let ang = 0, sqy = 1, up = tg > -0.55;
      if (tg >= 0 && tg < 0.12) sqy = 1 - 0.22 * Math.sin(tg / 0.12 * PI);
      if (tg >= 0.12) { ang = 1.45 * eOut((tg - 0.12) / 0.4); up = false; }
      if (tg > 0.6) sqy = 1;
      ctx.save(); ctx.translate(X + 5 * k, Y); ctx.rotate(ang); ctx.scale(-k, k * sqy); ctx.translate(5 - 9, -27.6 - 0);
      const P2 = (pts, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.closePath(); ctx.fill(); };
      const cx = 9;
      P2([cx - 3.9, 10.5, cx + 3.9, 10.5, cx + 5.9, 28, cx - 5.9, 28], GROUT);
      P2([cx - 3.4, 11, cx + 3.4, 11, cx + 5.4, 27.6, cx - 5.4, 27.6], GC(K.ochre));
      P2([cx - 5.4, 27.6, cx + 5.4, 27.6, cx + 5, 25, cx - 5, 25], GC(K.terra3));
      ctx.fillStyle = GC(K.gold); ctx.fillRect(cx - 3.2, 16.6, 6.4, 1.4);
      ctx.fillStyle = GROUT; ctx.beginPath(); ctx.ellipse(cx + 0.4, 8.4, 3.1, 3.3, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = GC(K.skin); ctx.beginPath(); ctx.ellipse(cx + 0.4, 8.4, 2.6, 2.8, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = GC(K.ink); ctx.beginPath(); ctx.arc(cx + 1.6, 8, 0.45, 0, TAU); ctx.fill();
      P2([cx - 3.6, 7.2, cx, 2.6, cx + 3.6, 7.2], GROUT); P2([cx - 3, 6.8, cx, 3.2, cx + 3, 6.8], GC(K.terra2));
      const ny = up ? 1 : 8;
      ctx.strokeStyle = GC(K.terra2); ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(cx + 3, 16); ctx.lineTo(cx + 9, ny + 6); ctx.stroke();
      ctx.fillStyle = GC(MIX(K.cream, K.sky2, 0.3)); ctx.beginPath(); ctx.ellipse(cx + 11, ny + 4, 4.4, 5, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = GC(K.ink3); ctx.lineWidth = 0.35; ctx.beginPath();
      for (let q = -3; q <= 3; q += 1.5) { ctx.moveTo(cx + 11 + q, ny + 0.3); ctx.lineTo(cx + 11 + q, ny + 8.4); ctx.moveTo(cx + 7, ny + 4 + q); ctx.lineTo(cx + 15, ny + 4 + q); }
      ctx.stroke();
      ctx.restore();
    }
    function lanterns(ctx, W, x0, x1, tauAbs, i0) {
      const k = W.k, top = -56, sag = 15, n = 6;
      const yS = (u) => top + sag * (1 - (2 * u - 1) * (2 * u - 1));
      // poles
      for (const x of [x0, x1]) { ctx.fillStyle = GC(K.terra2); ctx.fillRect(wx(W, x) - 0.7 * k, wy(W, top - 3), 1.4 * k, (3 - top) * k); ctx.fillStyle = GC(K.gold); ctx.beginPath(); ctx.arc(wx(W, x), wy(W, top - 3.5), 1.4 * k, 0, TAU); ctx.fill(); }
      ctx.strokeStyle = GC(K.ink); ctx.lineWidth = Math.max(0.7, 0.45 * k); ctx.beginPath();
      for (let q = 0; q <= 16; q++) { const u = q / 16, X = wx(W, lerp(x0, x1, u)), Y = wy(W, yS(u)); if (q) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }
      ctx.stroke();
      for (let i = 0; i < n; i++) {
        const u = (i + 0.5) / n, lx = lerp(x0, x1, u), ly = yS(u);
        // a lantern he flies past gets knocked swinging
        const tPass = lx / V; let sw = 0.06 * Math.sin(tauAbs * 2.1 + i * 1.7);
        const dtp = tauAbs - tPass; if (dtp > 0 && dtp < 3) { const hp = hopAt(locT(tPass)); if (Math.abs(hp.y - ly - 6) < 22) sw += 0.5 * Math.exp(-dtp * 1.6) * Math.sin(dtp * 7); }
        ctx.save(); ctx.translate(wx(W, lx), wy(W, ly)); ctx.rotate(sw); ctx.scale(k, k);
        ctx.fillStyle = GC(K.ink); ctx.fillRect(-0.4, 0, 0.8, 1.6);
        ctx.fillStyle = GROUT; ctx.beginPath(); ctx.ellipse(0, 6.6, 4.1, 4.7, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = GC(K.gold2); ctx.fillRect(-2, 1.4, 4, 1); ctx.fillRect(-2, 10.6, 4, 1);
        ctx.fillStyle = GC(K.rose); ctx.beginPath(); ctx.ellipse(0, 6.6, 3.6, 4.2, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = GC(MIX(K.rose, K.white, 0.5)); ctx.beginPath(); ctx.ellipse(-0.7, 6, 1.4, 2.8, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = GC(K.blush3); ctx.fillRect(-0.2, 2.6, 0.4, 8);
        ctx.fillStyle = GC(K.gold); ctx.beginPath(); ctx.moveTo(-0.5, 11.6); ctx.lineTo(0.5, 11.6); ctx.lineTo(0.2, 13.4); ctx.lineTo(-0.2, 13.4); ctx.fill();
        ctx.restore();
      }
    }
    function coin(ctx, X, Y, k, f, a, sc) {
      const w = [4.2, 3, 1.3, 3][f & 3] * sc;
      ctx.save(); ctx.globalAlpha = a;
      ctx.fillStyle = GROUT; ctx.beginPath(); ctx.ellipse(X, Y, (w + 0.5) * k, 4.7 * k * sc, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = GC(K.gold2); ctx.beginPath(); ctx.ellipse(X, Y, w * k, 4.2 * k * sc, 0, 0, TAU); ctx.fill();
      if (w > 2 * sc) { ctx.fillStyle = GC(K.gold); ctx.beginPath(); ctx.ellipse(X, Y, (w - 1) * k, 3.2 * k * sc, 0, 0, TAU); ctx.fill(); ctx.fillStyle = GC(K.ink2); ctx.fillRect(X - 0.8 * k * sc, Y - 0.8 * k * sc, 1.6 * k * sc, 1.6 * k * sc); ctx.fillStyle = GC(K.gold3); ctx.beginPath(); ctx.arc(X - 1.4 * k * sc, Y - 2 * k * sc, 0.6 * k * sc, 0, TAU); ctx.fill(); }
      ctx.restore();
    }
    function world(ctx, P, L, M, dpr, T) {
      const W = P.world, k = W.k, tau = W.tau, it = iterOf(tau);
      // ghost of the best throw: sparse faint ink dots
      ctx.fillStyle = 'rgba(53,57,95,0.28)'; ctx.beginPath();
      const xa = W.hX - (W.hsx + 20) / k, xb = W.hX + (L.w - W.hsx + 20) / k;
      for (let x = Math.max(Math.floor(xa / 7), Math.ceil(V * W.cut / 7)) * 7; x < xb; x += 7) { const y = -48 - 30 * Math.sin(x / DD * TAU * 3 + 0.7); ctx.rect(wx(W, x) - 0.6 * k, wy(W, y) - 0.6 * k, 1.2 * k, 1.2 * k); }
      ctx.fill();
      // lantern strings behind him
      const xCut = V * W.cut;
      for (let i = it - 1; i <= it + 1; i++) for (const [a, b] of LANTS) { const x0 = V * (i * LP + a), x1 = V * (i * LP + b); if (x0 > xCut && wx(W, x1) > -20 && wx(W, x0) < L.w + 20) lanterns(ctx, W, x0, x1, tau, i); }
      // the wall
      const wallY = wy(W, WTOP);
      if (wallY < L.h) {
        const uz = L.u * (k / W.ws), Sd = uz * dpr, C = canOC ? want(st.wall, Sd, 0, mkWall, true) : null, Pw = WP * k, Hh = (WBOT - WTOP) * k, x0 = wx(W, 0);
        if (C) strip(ctx, M, C, x0, wallY, uz, dpr, L.w);
        else { ctx.save(); let x = x0 - Math.ceil(x0 / Pw) * Pw; for (; x < L.w; x += Pw) { ctx.save(); ctx.translate(x, wallY); ctx.scale(k / (L.u * WS), k / (L.u * WS)); paintWall(ctx, L.u); ctx.restore(); } ctx.restore(); }
        if (wallY + Hh < L.h) { ctx.fillStyle = GC(K.indigo3); ctx.fillRect(0, wallY + Hh - 1, L.w, L.h - wallY - Hh + 1); }
      }
      // the net guard
      for (let i = it - 1; i <= it + 1; i++) { const gx = V * (i * LP + BONK) + 1, tg = tau - (i * LP + BONK); if (tg < -LP / 2 || tg > 4 || gx < V * W.cut) continue; if (wx(W, gx) < -40 * k || wx(W, gx) > L.w + 40 * k) continue; guard(ctx, W, gx, tg); }
      // stamped seal on the walkway after the big arc, seal popping behind him at the bonk
      for (let i = it - 1; i <= it; i++) {
        const tS = i * LP + HOPS[BIG][0] + HOPS[BIG][1], ageS = tau - tS;
        if (ageS >= 0 && ageS < 4.5 && tS > W.cut) { const a = 0.92 * (ageS < 3.3 ? 1 : (4.5 - ageS) / 1.2); seal(ctx, wx(W, V * tS - 6), wy(W, 4.2), 6 * k * (ageS < 0.1 ? eOut(ageS / 0.1) : 1), false, 7, a); }
        const tB = i * LP + BONK, ageB = tau - tB;
        if (ageB >= 0 && ageB < 0.85 && tB > W.cut) { const sc = ageB < 0.16 ? bOut(ageB / 0.16) : 1, a = ageB < 0.6 ? 1 : (0.85 - ageB) / 0.25; seal(ctx, wx(W, V * tB - 18), wy(W, YHAT - 20 - 16 * eOut(ageB / 0.85)), 9 * k * sc, true, 3, a); }
      }
      // coins along the big arc
      for (let i = it; i <= it + 1; i++) for (let c = 0; c < COINS.length; c++) {
        const tc = i * LP + COINS[c], hp = hopAt(COINS[c]), X = wx(W, V * tc), Y = wy(W, hp.y);
        if (X < -20 || X > L.w + 20) continue;
        const age = tau - tc;
        if (age < 0) coin(ctx, X, Y, k, Math.floor(T * 8 + c), 1, 1);
        else if (age < 0.22) { coin(ctx, X, Y - age * 30 * k, k, 0, 1 - age / 0.22, 1 + age * 3); }
      }
      // paint: impact chips and flight arcs (paint.ts flush)
      for (let i = it - 1; i <= it; i++) for (let j = 0; j < IMP.length; j++) {
        const tI = i * LP + IMP[j].t, age = tau - tI, ch = CHIPS[j];
        if (age < 0 || age > ch.life || tI < W.cut) continue;
        const a = age < ch.life - 0.8 ? 1 : (ch.life - age) / 0.8, ab = Math.ceil(a * 4);
        const ix = V * tI, iy = IMP[j].y;
        for (const c of ch.list) {
          const s2 = c.s * (age < 0.08 ? age / 0.08 : 1) * k * 0.5, cs = Math.cos(c.r), sn = Math.sin(c.r), X = wx(W, ix + c.dx), Y = wy(W, iy + c.dy);
          bq('c' + c.c + ab, VERCSS[c.c], [X + (cs - sn) * s2, Y + (sn + cs) * s2, X + (-cs - sn) * s2, Y + (-sn + cs) * s2, X + (-cs + sn) * s2, Y + (-sn - cs) * s2, X + (cs + sn) * s2, Y + (sn - cs) * s2]);
        }
      }
      flushAlpha(ctx);
      for (let i = it - 1; i <= it; i++) for (let j = 0; j < ARCS.length; j++) {
        const A = ARCS[j], S0 = i * LP + A.s, E = i * LP + A.e;
        if (tau < S0) continue;
        const fin = tau >= E, f = fin ? (tau - E) / 1.1 : 0;
        if (f >= 1) continue;
        const x0 = V * S0;
        for (const tl of A.tiles) {
          const tb = i * LP + tl.tb;
          if (tb > tau || tb < W.cut) continue;
          let a = 1, tx = x0 + tl.x, ty = tl.y, ta = tl.a;
          if (tb < 0 && W.cut > -1e8) { const e = enterY(tb), sp = Math.hypot(V, e.vy); tx = V * tb - V / sp * 5; ty = e.y - e.vy / sp * 5; ta = Math.atan2(e.vy, V); }
          if (!fin) { const age = tau - tb; a = age < 1.6 ? 1 : Math.max(0, 1 - (age - 1.6) / 1.2); }
          else { const pf = tl.i / Math.max(1, A.n); a = cl((pf - (f * 1.3 - 0.3)) * 4, 0, 1); }
          if (a <= 0.03) continue;
          const X = wx(W, tx), Y = wy(W, ty); if (X < -10 || X > L.w + 10) continue;
          const ux = Math.cos(ta), uy = Math.sin(ta), nx = -uy, ny = ux, hl = (1.3 - 0.35) * k, hw = tl.hw * k, cx = X + nx * tl.jit * k, cy = Y + ny * tl.jit * k;
          bq('c' + tl.c + Math.ceil(a * 4), VERCSS[tl.c], [cx + ux * hl + nx * hw, cy + uy * hl + ny * hw, cx - ux * hl + nx * hw, cy - uy * hl + ny * hw, cx - ux * hl - nx * hw, cy - uy * hl - ny * hw, cx + ux * hl - nx * hw, cy + uy * hl - ny * hw]);
        }
      }
      flushAlpha(ctx);
    }
    function flushAlpha(ctx) {
      for (const [key, b] of BUCK) {
        if (!b.n) continue;
        ctx.globalAlpha = key.length > 2 ? (+key.slice(2)) / 4 : 1;
        ctx.fillStyle = b.css; ctx.beginPath();
        for (const p of b.a) { ctx.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) ctx.lineTo(p[i], p[i + 1]); ctx.closePath(); }
        ctx.fill(); b.a.length = 0; b.n = 0;
      }
      ctx.globalAlpha = 1;
    }
    // screen-space paint chips knocked off him (hits, shoves)
    function spawnChips(x, y, n, dirx, diry, sp) { for (let i = 0; i < n; i++) { const a = Math.atan2(diry, dirx) + (rnd() - 0.5) * 1.6, v = sp * (0.6 + rnd() * 0.6); ST.chips.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - sp * 0.3, r: rnd() * 3, s: 0.9 + rnd() * 0.8, c: i % 4, age: 0 }); } }
    function chipsDraw(ctx, dt, L, R) {
      const s = R / 7.8;
      for (let i = ST.chips.length - 1; i >= 0; i--) {
        const c = ST.chips[i]; c.age += dt; c.vy += L.u * 2.2 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.r += dt * 6;
        if (c.age > 1.6 || c.y > L.h + 20) { ST.chips.splice(i, 1); continue; }
        const z = c.s * s * 0.36, cs = Math.cos(c.r), sn = Math.sin(c.r);
        bq('k' + c.c, VERCSS[c.c], [c.x + (cs - sn) * z, c.y + (sn + cs) * z, c.x + (-cs - sn) * z, c.y + (-sn + cs) * z, c.x + (-cs + sn) * z, c.y + (-sn - cs) * z, c.x + (cs + sn) * z, c.y + (sn - cs) * z]);
      }
      flushB(ctx);
    }

    // ------------------------------------------------------------------ frame
    function frame(ctx, s) {
      const w = s.w, h = s.h; if (!(w > 1 && h > 1)) return;
      const rm = !!s.rm, mode = rm ? 'idle' : s.mode || 'idle', dt = rm ? 0 : cl(s.dt || 0, 0, 0.05), T = rm ? 0 : s.t || 0, mt = rm ? 0 : Math.max(0, s.mt || 0);
      ST.T = T;
      if (w !== ST.W || h !== ST.H) { st.stable = 0; ST.W = w; ST.H = h; } else st.stable++;
      st.built = false;
      if (mode !== ST.mode) { ST.from = ST.last; ST.fromMode = ST.mode; ST.mode = mode; ST.slamPrev = 0; }
      // the cue's throw keeps real time even with reduced motion (the plate itself stays still)
      if (ST.gag) { ST.gag.age += cl(s.dt || 0.016, 0, 0.05); if (!ST.gag.thrown && ST.gag.age >= 0.8) { ST.gag.thrown = true; emitThrow(); } if (rm && ST.gag.age > 2.2) ST.gag = null; }
      const M = ctx.getTransform ? ctx.getTransform() : { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, dpr = Math.hypot(M.a, M.b) || 1;
      const L = layout(w, h);
      let P;
      if (mode === 'react') P = reactPose(L, mt, T, s);
      else if (mode === 'enter') P = enterPose(L, mt, T, s);
      else if (mode === 'loop') P = loopPose(L, mt, T);
      else if (mode === 'squeezed') P = squeezePose(L, mt, T, s);
      else P = idlePose(L, mt, T, s);
      if (rm) { ST.hit = ST.look = ST.shake = null; ST.chips.length = 0; } else applyEvents(P, L, T);
      // settle into a new mode from wherever he was (a quick physical move, never a fade)
      const F = ST.from, bd = mode === 'idle' ? 0.5 : mode === 'squeezed' ? 0.3 : mode === 'react' ? 0.14 : 0;
      if (F && !rm && bd > 0 && mt < bd) {
        const k = mode === 'idle' ? bOut(mt / bd) : eOut(mt / bd), kk = cl(k, 0, 1);
        const B = blendPose(F, P, k);
        if (F.world) { B.world = Object.assign({}, F.world); B.world.yoff = (F.world.yoff || 0) + eIn(mt / bd) * (h * 0.9); B.ribGone = 0; B.rib = ss(mt / bd); B.ribT = null; }
        else if (F.ribT) { B.ribT = null; B.ribGone = 0; B.rib = ss(mt / bd); }
        if (F.world || F.ribT) { B.mY = lerp(F.mY, P.mY, kk); }
        P = B;
      }
      if (mode === 'squeezed' && P.slam > 0.9 && !(ST.slamPrev > 0.9)) spawnChips(w - 2, P.hy + P.R * 0.92, 4, -1, -0.2, L.u * 0.8);
      ST.slamPrev = P.slam || 0;
      render(ctx, P, L, M, dpr, T, dt, rm, mode);
      ST.last = P;
      const sU = P.R / 7.8, fc = [P.hx + Math.cos(P.rot) * 3 * sU - Math.sin(P.rot) * 1.5 * sU, P.hy + Math.sin(P.rot) * 3 * sU + Math.cos(P.rot) * 1.5 * sU];
      ST.anchor = { x: cl(fc[0] / w, 0.04, 0.96), y: cl(fc[1] / h, 0.04, 0.96) };
    }
    function render(ctx, P, L, M, dpr, T, dt, rm, mode) {
      const w = L.w, h = L.h, u = L.u;
      ctx.save();
      ctx.fillStyle = GROUT; ctx.fillRect(0, 0, w, h);
      // sky
      const Hs = h / u, Sd = u * dpr;
      const csk = canOC ? want(st.sky, Sd, Math.ceil((Hs * 1.15 + 0.05) * 8) / 8, mkSky, true) : null;
      if (csk) strip(ctx, M, csk, 0, h - csk.c.cv.height / csk.c.Sx * u, u, dpr, w);
      else { ctx.save(); ctx.translate(0, h - Hs * u); ctx.scale(1 / dpr, 1 / dpr); for (let x = 0; x < w * dpr; x += SKYP * Sd) { ctx.save(); ctx.translate(x, 0); paintSky(ctx, Sd, Hs, true); ctx.restore(); } ctx.restore(); }
      // sun: disc and its creeping outer ring
      sunDisc(ctx, P, M, dpr);
      rays(ctx, P, L);
      // clouds drifting slowly
      const cOff = (L.hx - 1.05 * u) - (P.cPan + T * 0.004) * u;
      const cDy = (P.mY || 0) * u * 0.3, Pc = CLP * u;
      for (let i = 0; i < CLOUDS.length; i++) {
        const C = CLOUDS[i], bx = (C[0] - 0.01) * u, bw2 = (C[1] - C[0] + 0.02) * u, by = h - (C[2] + 0.03) * u + cDy;
        let x = cOff + bx; x -= Math.ceil((x + bw2) / Pc) * Pc;
        for (; x < w; x += Pc) {
          if (x + bw2 < 0) continue;
          const cc = canOC ? want(st.cld[i], Sd, 0, mkCloud(i), true) : null;
          if (cc && Math.abs(cc.S - Sd) <= cc.S * 0.002) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(cc.c.cv, Math.round(x * M.a + M.e), Math.round(by * M.d + M.f)); ctx.setTransform(M); }
          else if (cc) ctx.drawImage(cc.c.cv, x, by, cc.c.cv.width * u / cc.S, cc.c.cv.height * u / cc.S);
          else { ctx.save(); ctx.translate(x, by); ctx.scale(u / Sd, u / Sd); paintCloud(ctx, Sd, C); ctx.restore(); }
        }
      }
      // crags, the pale domes behind them and the mist belt
      const mOff = (L.hx - 1.05 * u) - P.mPan * u, mTop = h - MTH * u - P.mY * u;
      const cm = canOC ? want(st.mtn, Sd, 0, mkMtn, true) : null;
      if (cm) strip(ctx, M, cm, mOff, mTop, u, dpr, w);
      else { let x = mOff - Math.ceil(mOff / (MTP * u)) * MTP * u; for (; x < w; x += MTP * u) { ctx.save(); ctx.translate(x, mTop); ctx.scale(u / Sd, u / Sd); paintMountains(ctx, Sd, true); ctx.restore(); } }
      if (P.mY > MTB) { ctx.fillStyle = GC(K.white); ctx.fillRect(0, mTop + (MTH + MTB) * u - 1, w, (P.mY - MTB) * u + 2); }
      // real play
      if (P.world) world(ctx, P, L, M, dpr, T);
      // the poster's trail
      ribbon(ctx, P, L, T, M);
      // braid, then the head
      // in play the braid swings in the world's frame: shift it by how far the world moved on screen
      let wsh = null;
      if (P.world && ST.last && ST.last.world && !rm) { const A = ST.last.world, B = P.world; wsh = [(B.hsx - A.hsx) + (A.hX - B.hX) * B.k, (B.hsy - B.hY * B.k + (B.yoff || 0)) - (A.hsy - A.hY * A.k + (A.yoff || 0))]; }
      const tip = braid(ctx, P, L, dt, rm, wsh);
      ST.tip = tip;
      head(ctx, P, M, dpr);
      chipsDraw(ctx, dt, L, P.R);
      ctx.restore();
    }
    function emitThrow() {
      const t = ST.tip || [ST.W * 0.4, ST.H * 0.3];
      emit({ type: 'throw', item: 'braidTile', x: t[0], y: t[1], vx: 260, vy: -220 });
    }

    function on(evt) {
      if (!evt || !evt.type) return;
      const T = ST.T;
      if (evt.type === 'cue') { if (!ST.gag) ST.gag = { age: 0, thrown: false }; }
      else if (evt.type === 'hit') {
        const x = typeof evt.x === 'number' ? evt.x : ST.W * 0.5, y = typeof evt.y === 'number' ? evt.y : ST.H * 0.4;
        ST.hit = { t0: T, x, y };
        const P = ST.last; if (P) { const dx = P.hx - x, dy = P.hy - y, d = Math.hypot(dx, dy) || 1; spawnChips(lerp(x, P.hx, 0.6), lerp(y, P.hy, 0.6), 4, -dx / d, -dy / d, Math.min(ST.W, ST.H) * 0.8); }
      } else if (evt.type === 'look') ST.look = { t0: T, dx: +evt.dx || 0, dy: +evt.dy || 0 };
      else if (evt.type === 'shake') ST.shake = { t0: T, a: cl(+evt.amount || 0.5, 0.1, 1.5) };
    }
    function anchor() { return ST.anchor; }
    return { frame, on, anchor };
  }
};
