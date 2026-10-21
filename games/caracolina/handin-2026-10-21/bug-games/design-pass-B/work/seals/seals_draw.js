/* Caracolina seals, drawn in the game page with the game's own 2D code:
   paint.js textures (texPaper, texBrush, texHatch), people_paint.js (face, hair, hat, drawCat, drawBird),
   the #i-shell symbol from index.html, and the game's palette re-measured to colours that are free
   against the platform's ember, lilac, sun and mint. 192 x 192 masters, three states. */
(() => {
  const S = 192, CX = 96, CY = 96;
  const INK = '#1d1a33', TILE = '#fbf8f1', MARGIN = '#fbf8f0', GRAPH = '#46434f';
  const C = {
    cobalt: '#2a55b8', cobaltD: '#16357c', blue2: '#1f4fb4', blue3: '#2e74cc', blue4: '#4f94dc',
    night: '#152760', night2: '#172d4e', nightD: '#1b1d3e', iron: '#1e2a3a', paper: '#f3ead7', tile: TILE,
    vsea: '#303466', dusk: '#4b4f8f', duskv: '#7d6f98', mauve: '#605076',
    roseM: '#b9768a', blushL: '#e3aaa6', blush: '#f0d0c8', shell: '#e28d9a', shellD: '#ad5a6a', shellL: '#f3d9d0',
    crimson: '#a8282e', oxblood: '#8e2a22', brick: '#a4412e', viridian: '#1f6b5a', green: '#2f5234',
    lemon: '#c4e153', lemonD: '#a2b521', cream: '#f6f4dc', wood: '#b98a5a', ochre: '#c98026', brass: '#a18a2a', bell: '#b5812a',
    grey: '#7c7884', black: '#1c1c24', pinkHot: '#e27b98', pink: '#e0689a', line: '#4a4660'
  };
  /* the game's own colours that sit near the platform's, mapped to free neighbours (measure.py) */
  const MAP = { '#c8342c': C.crimson, '#f2cf3a': C.lemon, '#2fb1ac': '#17a5a8', '#d9b24a': C.brass, '#e9c46a': C.wood, '#8a3a3a': '#7a2a32' };
  const mapped = ctx => new Proxy(ctx, {
    set(t, k, v) { if ((k === 'fillStyle' || k === 'strokeStyle') && typeof v === 'string' && MAP[v.toLowerCase()]) v = MAP[v.toLowerCase()]; t[k] = v; return true; },
    get(t, k) { const v = t[k]; return typeof v === 'function' ? v.bind(t) : v; }
  });

  /* ---------- small helpers ---------- */
  const hx = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const hs = a => '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mixH = (a, b, t) => { const A = hx(a), B = hx(b); return hs(A.map((v, i) => v + (B[i] - v) * t)); };
  const rgba = (h, a) => { const c = hx(h); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
  const mk = (w = S, h = S) => { const c = mkCanvas(w, h); const x = c.getContext('2d'); x.lineJoin = 'round'; x.lineCap = 'round'; return [c, x]; };
  const sst = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
  const P2 = (pts, closed = true, jit = 0, R = null) => { const p = new Path2D(); pts.forEach((q, i) => { const x = q[0] + (jit ? R.r(-jit, jit) : 0), y = q[1] + (jit ? R.r(-jit, jit) : 0); i ? p.lineTo(x, y) : p.moveTo(x, y); }); if (closed) p.closePath(); return p; };
  const ell = (cx, cy, rx, ry, rot = 0, n = 64) => { const o = []; for (let i = 0; i < n; i++) { const a = i / n * TAU, x = Math.cos(a) * rx, y = Math.sin(a) * ry; o.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]); } return o; };
  const cr = (ctrl, closed = true, k = 10) => {
    const n = ctrl.length, o = [], get = i => closed ? ctrl[(i + n) % n] : ctrl[Math.max(0, Math.min(n - 1, i))], segs = closed ? n : n - 1;
    for (let i = 0; i < segs; i++) { const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2); for (let j = 0; j < k; j++) { const t = j / k, t2 = t * t, t3 = t2 * t; o.push([0, 1].map(d => .5 * (2 * p1[d] + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3))); } }
    if (!closed) o.push(ctrl[n - 1]); return o;
  };
  const bbox = pts => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const p of pts) { a = Math.min(a, p[0]); b = Math.min(b, p[1]); c = Math.max(c, p[0]); d = Math.max(d, p[1]); } return [a, b, c, d]; };
  const rot = (pts, cx, cy, a) => pts.map(([x, y]) => [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)]);
  const tint = (src, col) => { const [c, x] = mk(src.width, src.height); x.drawImage(src, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, c.width, c.height); return c; };
  const lum = (r, g, b) => (.2126 * r + .7152 * g + .0722 * b) / 255;

  /* ---------- the game's textures ---------- */
  const TP = texPaper(256);
  const TBsrc = texBrush(256);
  const greyOf = (src, ch) => { const [c, x] = mk(src.width, src.height); const d = src.getContext('2d').getImageData(0, 0, src.width, src.height); for (let i = 0; i < d.data.length; i += 4) { const v = d.data[i + ch]; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } x.putImageData(d, 0, 0); return c; };
  const TB = greyOf(TBsrc, 0);
  const THc = texHatch(512), THd = THc.getContext('2d').getImageData(0, 0, 512, 512).data;
  const hatchMask = (col, ch, k) => { const [c, x] = mk(512, 512); const id = x.createImageData(512, 512); const cc = hx(col); for (let i = 0; i < THd.length; i += 4) { id.data[i] = cc[0]; id.data[i + 1] = cc[1]; id.data[i + 2] = cc[2]; id.data[i + 3] = THd[i + ch] * k; } x.putImageData(id, 0, 0); return c; };
  const HATCH_SHADE = hatchMask('#3c2440', 0, 1);

  /* ---------- glyph renderer: parts -> painted layers ---------- */
  /* part kinds: poly {pts, fill, shade, rim, edge, margin}, line {pts, lw, col}, draw {fn, sil}, detail {pts, lw, col, closed},
     clipline {clip, pts, lw, col}, glow {c, r, col, a}, dot -> poly */
  const MW = 4.2;
  function shadePlane(x, pts, sh) {
    const [a, b, c, d] = bbox(pts), cx = (a + c) / 2 + (sh.off || 0) * (c - a), cy = (b + d) / 2, ang = sh.ang ?? .32, side = sh.side || 1;
    const dx = Math.sin(ang), dy = -Math.cos(ang), L = 400, nx = -dy * side, ny = dx * side;
    x.beginPath(); x.moveTo(cx - dx * L, cy - dy * L); x.lineTo(cx + dx * L, cy + dy * L); x.lineTo(cx + dx * L - nx * L * -1, cy + dy * L - ny * L * -1); x.lineTo(cx - dx * L - nx * L * -1, cy - dy * L - ny * L * -1); x.closePath();
  }
  function paintGlyph(G, st, opt = {}) {
    const [F, f] = mk(), [Lc, l] = mk(), [M, m] = mk();
    const R = RNG(G.seed || 5);
    m.fillStyle = m.strokeStyle = '#fff';
    for (const p of G.parts) {
      if (p.margin === false) continue;
      if (p.t === 'poly') { const pa = P2(p.pts); m.lineWidth = 2 * (p.mw ?? MW); m.stroke(pa); m.fill(pa); }
      else if (p.t === 'line') { m.lineWidth = p.lw + 2 * (p.mw ?? MW); m.stroke(P2(p.pts, false)); }
      else if (p.t === 'draw') { m.save(); (p.sil || p.fn)(m, st); m.restore(); }
    }
    if (!opt.noShadow) f.drawImage(tint(M, 'rgba(29,26,51,.42)'), 1.6, 2.6);
    f.drawImage(tint(M, MARGIN), 0, 0);
    const rimCol = st === 'progress' ? 'rgba(170,185,235,.28)' : 'rgba(255,236,226,.55)';
    for (const p of G.parts) {
      if (p.t === 'poly') {
        const pa = P2(p.pts);
        f.fillStyle = p.fill; f.fill(pa);
        if (p.shade !== false) {
          const sh = p.shade || {};
          f.save(); f.clip(pa); shadePlane(f, p.pts, sh); f.fillStyle = sh.col || `rgba(60,36,62,${sh.a ?? .2})`; f.fill();
          f.clip(); f.globalAlpha = sh.h ?? .22; f.fillStyle = f.createPattern(HATCH_SHADE, 'repeat'); f.fillRect(0, 0, S, S); f.restore();
        }
        if (p.rim !== false) { f.save(); f.clip(pa); f.translate(2.4, 1.8); f.strokeStyle = p.rimCol || rimCol; f.lineWidth = 5; f.stroke(pa); f.restore(); }
        if (p.edge !== false) {
          const ec = p.edgeCol || mixH(p.fill, INK, .75);
          l.strokeStyle = ec; l.lineWidth = p.elw || 2.1; l.globalAlpha = .92; l.stroke(P2(p.pts, true, .45, R));
          l.lineWidth = 1.1; l.globalAlpha = .45; l.stroke(P2(p.pts, true, .9, R)); l.globalAlpha = 1;
        }
      } else if (p.t === 'line') {
        const pa = P2(p.pts, false);
        if (p.edge !== false) { f.strokeStyle = p.edgeCol || mixH(p.col, INK, .7); f.lineWidth = p.lw + 2.6; f.stroke(pa); }
        f.strokeStyle = p.col; f.lineWidth = p.lw; f.stroke(pa);
        if (p.pencil && opt.sketch) { l.strokeStyle = INK; l.lineWidth = p.lw * .55; l.stroke(pa); }
        if (p.lit) { f.save(); f.translate(-p.lw * .22, -p.lw * .18); f.strokeStyle = p.lit; f.lineWidth = p.lw * .35; f.stroke(pa); f.restore(); }
      } else if (p.t === 'draw') { f.save(); p.fn(f, st, l); f.restore(); }
      else if (p.t === 'detail') { l.strokeStyle = p.col || INK; l.lineWidth = p.lw || 2; l.globalAlpha = p.a ?? 1; l.stroke(P2(p.pts, !!p.closed, p.jit ?? .3, R)); l.globalAlpha = 1; if (p.fill) { l.fillStyle = p.fill; l.fill(P2(p.pts, true)); } }
      else if (p.t === 'clipline') { f.save(); f.clip(P2(p.clip)); f.strokeStyle = p.col; f.lineWidth = p.lw; f.stroke(P2(p.pts, false)); f.restore(); }
      else if (p.t === 'glow') { if (st === 'locked' || opt.noGlow) continue; const g = f.createRadialGradient(p.c[0], p.c[1], 0, p.c[0], p.c[1], p.r); g.addColorStop(0, rgba(p.col, p.a)); g.addColorStop(1, rgba(p.col, 0)); f.fillStyle = g; f.fillRect(0, 0, S, S); }
    }
    return { F, L: Lc, M };
  }
  /* the glyph as a graphite pencil sketch on paper, made from the painted layers: tone -> hatching, lines -> pencil, cut edge -> outline */
  function sketchGlyph(G, seed) {
    const lay = paintGlyph(G, 'earned', { noShadow: true, noGlow: true, sketch: true });
    const Fd = lay.F.getContext('2d').getImageData(0, 0, S, S).data, Ld = lay.L.getContext('2d').getImageData(0, 0, S, S).data;
    /* outline of the cut-out: the margin minus the margin eroded */
    const [E, e] = mk(); e.drawImage(lay.M, 0, 0); e.globalCompositeOperation = 'destination-in';
    for (const [dx, dy] of [[2.2, 0], [-2.2, 0], [0, 2.2], [0, -2.2]]) e.drawImage(lay.M, dx, dy);
    const [O, o] = mk(); o.drawImage(lay.M, 0, 0); o.globalCompositeOperation = 'destination-out'; o.drawImage(E, 0, 0);
    const Od = o.getImageData(0, 0, S, S).data;
    const [Gc, g] = mk(); const id = g.createImageData(S, S), cc = hx(GRAPH), ox = (seed * 37) % 300, oy = (seed * 53) % 300;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4, a = Fd[i + 3] / 255; let al = 0;
      if (a > 0) {
        const d = Math.max(0, Math.min(1, (1 - lum(Fd[i], Fd[i + 1], Fd[i + 2]) - .05) / .9));
        const j = (((y + oy) % 512) * 512 + ((x + ox) % 512)) * 4, hr = THd[j] / 255, hg = THd[j + 1] / 255, hb = THd[j + 2] / 255;
        al = (hr * sst(.12, .3, d) * .55 + hg * sst(.38, .58, d) * .45 + hb * sst(.62, .82, d) * .5 + d * .1) * a;
      }
      const la = Ld[i + 3] / 255; if (la > 0) al = Math.max(al, la * (1 - lum(Ld[i], Ld[i + 1], Ld[i + 2])) * 1.05);
      al = Math.max(al, Od[i + 3] / 255 * .8);
      id.data[i] = cc[0]; id.data[i + 1] = cc[1]; id.data[i + 2] = cc[2]; id.data[i + 3] = Math.min(.92, al) * 255;
    }
    g.putImageData(id, 0, 0);
    return Gc;
  }

  /* ---------- grounds ---------- */
  const BANDS = { sky: ['#78648a', '#9a6f93', '#b9768a'] };
  function ground(x, w, h, kind, seed) {
    const R = RNG(seed);
    if (kind === 'paper') { x.fillStyle = '#d2ccbf'; x.fillRect(0, 0, w, h); return; }
    if (kind === 'night') {
      x.fillStyle = C.nightD; x.fillRect(0, 0, w, h);
      x.fillStyle = C.night; x.beginPath(); x.moveTo(0, h * .45); for (let i = 0; i <= 12; i++) x.lineTo(w * i / 12, h * .45 + Math.sin(i * 1.7 + seed) * 2); x.lineTo(w, h); x.lineTo(0, h); x.fill();
      return;
    }
    const B = BANDS[kind === 'sea' || kind === 'sky' ? 'sky' : kind] || BANDS.sky;
    const ys = kind === 'sea' ? [0, .4, .66] : [0, .44, .74];
    B.forEach((col, k) => { x.fillStyle = col; x.beginPath(); const y0 = h * ys[k]; x.moveTo(-2, k ? y0 : -2); if (!k) x.lineTo(w + 2, -2); if (k) for (let i = 0; i <= 14; i++) x.lineTo(w * i / 14, y0 + Math.sin(i * 1.3 + seed + k) * 1.6 + R.r(-.6, .6)); x.lineTo(w + 2, h + 2); x.lineTo(-2, h + 2); x.closePath(); x.fill(); });
    /* the low sun is in the west: a warm wash from the left */
    const g = x.createRadialGradient(-w * .1, h * .72, 0, -w * .1, h * .72, w * .9); g.addColorStop(0, 'rgba(255,212,204,.32)'); g.addColorStop(1, 'rgba(255,212,204,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    if (kind === 'sea') {
      const sy = h * .8; x.fillStyle = C.vsea; x.beginPath(); x.moveTo(0, sy); for (let i = 0; i <= 10; i++) x.lineTo(w * i / 10, sy + Math.sin(i * 2.1 + seed) * .8); x.lineTo(w, h); x.lineTo(0, h); x.fill();
      x.strokeStyle = 'rgba(240,208,200,.75)'; x.lineWidth = 1.6;
      for (let k = 0; k < 9; k++) { const yy = sy + 4 + R.r(0, h - sy - 6), xx = R.r(0, w * .6), L = R.r(5, 12); x.beginPath(); x.moveTo(xx, yy); x.lineTo(xx + L, yy); x.stroke(); }
    }
  }

  /* blue hour: toward deep blue, desaturated, dimmer (measured: every white stays clear of lilac) */
  const BH = [28, 40, 100];
  function gradePx(d, i, a) {
    const k = .5 * a, dim = 1 - .3 * a, ds = .35 * a;
    let r = d[i], g = d[i + 1], b = d[i + 2]; const L = .3 * r + .59 * g + .11 * b;
    r += (L - r) * ds; g += (L - g) * ds; b += (L - b) * ds;
    d[i] = (r + (BH[0] - r) * k) * dim; d[i + 1] = (g + (BH[1] - g) * k) * dim; d[i + 2] = (b + (BH[2] - b) * k) * dim;
  }
  function graded(c, a) { const x = c.getContext('2d'), d = x.getImageData(0, 0, c.width, c.height); for (let i = 0; i < d.data.length; i += 4) if (d.data[i + 3]) gradePx(d.data, i, a); x.putImageData(d, 0, 0); return c; }
  const groundC = (w, h, kind, seed, st) => { const [c, x] = mk(w, h); ground(x, w, h, kind, seed); return st === 'progress' ? graded(c, 1) : c; };
  const glyphC = (G, st, seed) => st === 'locked' ? sketchGlyph(G, seed) : st === 'progress' ? graded(composeGlyph(G, st), .72) : composeGlyph(G, st);

  /* ---------- kinds: feat medallion with a trencadís rim ---------- */
  const RIM_I = 73, RIM_O = 92;
  function trencadis(st, seed) {
    const R = RNG(seed), seeds = [];
    for (const [r, n, off] of [[78, 21, 0], [88, 25, .5]]) for (let i = 0; i < n; i++) { const a = (i + off + R.r(-.3, .3)) / n * TAU, rr = r + R.r(-2.2, 2.2); seeds.push({ x: CX + Math.cos(a) * rr, y: CY + Math.sin(a) * rr, a }); }
    const locked = st === 'locked';
    const pal = locked ? ['#aeaaa2', '#b8b4ac', '#a39f98', '#b2aea6', '#9e9a93', '#b6b2ab'] : ['#2a55b8', '#1f4fb4', '#16357c', '#2e74cc', '#2a55b8', '#1f4fb4', '#2e74cc', '#16357c', '#2a55b8', '#f7f2e6', '#1f4fb4', '#2e74cc'];
    for (const s of seeds) { s.c = hx(R.pick(pal)); s.g = R.r(0, TAU); s.sh = R.r(-.06, .06); s.hl = R.f(); s.o = R.r(-1.4, .4); }
    const [c, x] = mk(); const id = x.createImageData(S, S), d = id.data, grout = hx(locked ? '#8f8b94' : '#77737f');
    for (let py = 0; py < S; py++) for (let px = 0; px < S; px++) {
      const dx = px + .5 - CX, dy = py + .5 - CY, r = Math.hypot(dx, dy);
      if (r < RIM_I - 1 || r > RIM_O + 1) continue;
      let b1 = 1e9, b2 = 1e9, bp = null;
      for (const s of seeds) { const dd = (px + .5 - s.x) ** 2 + (py + .5 - s.y) ** 2; if (dd < b1) { b2 = b1; b1 = dd; bp = s; } else if (dd < b2) b2 = dd; }
      const ro = RIM_O + bp.o, aOut = Math.max(0, Math.min(1, ro - r + .5)); if (aOut <= 0) continue;
      const edge = (Math.sqrt(b2) - Math.sqrt(b1)) / 2; let col;
      if (edge < 1.1) col = grout;
      else {
        const t = Math.cos(bp.g) * (px - bp.x) + Math.sin(bp.g) * (py - bp.y), glaze = 1 + (locked ? .02 : .05) * t / 6 + bp.sh;
        const warm = locked ? 0 : Math.max(0, -Math.cos(bp.a)) * .16; /* tiles on the west side catch the low sun */
        const hl = !locked && bp.hl > .55 && Math.abs(t - 2) < 1.1 && edge > 2.6 ? 26 : 0;
        col = bp.c.map((v, i) => v * glaze * (edge < 2.2 ? .9 : 1) * (1 - warm) + [255, 214, 196][i] * warm + hl);
      }
      const o = (py * S + px) * 4; d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = 255 * aOut;
    }
    x.putImageData(id, 0, 0);
    /* the field's own grout line, where tiles meet the picture */
    return c;
  }
  function feat(G, st, seed) {
    const [c, x] = mk();
    x.fillStyle = 'rgba(29,26,51,.30)'; x.beginPath(); x.arc(CX, CY + 2.6, RIM_O - .3, 0, TAU); x.fill();
    x.drawImage(trencadis(st, seed), 0, 0);
    const [Fi, fi] = mk(); fi.save(); fi.beginPath(); fi.arc(CX, CY, RIM_I + .6, 0, TAU); fi.clip();
    fi.drawImage(groundC(S, S, st === 'locked' ? 'paper' : (G.ground || 'sky'), seed, st), 0, 0);
    fi.drawImage(glyphC(G, st, seed), 0, 0); fi.restore();
    x.drawImage(Fi, 0, 0);
    const pc = st === 'locked' ? GRAPH : INK;
    x.strokeStyle = rgba(pc, .85); x.lineWidth = 2.2; x.beginPath(); x.arc(CX, CY, RIM_I + .4, 0, TAU); x.stroke();
    x.strokeStyle = rgba(pc, .55); x.lineWidth = 1.6; x.beginPath(); x.arc(CX, CY, RIM_O - .9, 0, TAU); x.stroke();
    return { c, inner: circleMask(RIM_I + .6) };
  }
  const circleMask = r => { const [c, x] = mk(); x.fillStyle = '#fff'; x.beginPath(); x.arc(CX, CY, r, 0, TAU); x.fill(); return c; };
  function composeGlyph(G, st) { const L = paintGlyph(G, st); const [c, x] = mk(); x.drawImage(L.F, 0, 0); x.drawImage(L.L, 0, 0); return c; }

  /* ---------- kinds: collection, a square print held by washi tape ---------- */
  const PR = { cx: 96, cy: 101, half: 72, border: 10, ang: -.06 };
  function collection(G, st, seed) {
    const [c, x] = mk(), locked = st === 'locked', pw = (PR.half - PR.border) * 2;
    const [Pc, p] = mk(pw, pw);
    p.drawImage(groundC(pw, pw, locked ? 'paper' : (G.ground || 'sky'), seed, st), 0, 0);
    /* the glyph is drawn in seal space centred on (96, 96): move it into the picture */
    p.drawImage(glyphC(G, st, seed), -(CX - pw / 2), -(CY - pw / 2));
    x.save(); x.translate(PR.cx, PR.cy); x.rotate(PR.ang);
    x.fillStyle = 'rgba(29,26,51,.30)'; x.fillRect(-PR.half + 1.2, -PR.half + 3, PR.half * 2, PR.half * 2);
    x.fillStyle = locked ? '#cbc6bc' : TILE; x.fillRect(-PR.half, -PR.half, PR.half * 2, PR.half * 2);
    x.drawImage(Pc, -pw / 2, -pw / 2);
    x.strokeStyle = rgba(locked ? GRAPH : INK, .55); x.lineWidth = 1.4; x.strokeRect(-pw / 2, -pw / 2, pw, pw);
    x.strokeStyle = rgba(locked ? GRAPH : INK, .8); x.lineWidth = 1.8; x.strokeRect(-PR.half, -PR.half, PR.half * 2, PR.half * 2);
    x.restore();
    /* the tape: the game's striped washi, in free colours, torn at both ends */
    x.save(); x.translate(PR.cx + 4, PR.cy - PR.half + 1); x.rotate(PR.ang + .1);
    const tw = 94, th = 25, R = RNG(seed + 3), torn = []; torn.push([-tw / 2, -th / 2]); torn.push([tw / 2, -th / 2]);
    for (let i = 1; i < 6; i++) torn.push([tw / 2 + (i % 2 ? 3 : 0) + R.r(-1, 1), -th / 2 + th * i / 6]);
    torn.push([tw / 2, th / 2]); torn.push([-tw / 2, th / 2]); for (let i = 5; i > 0; i--) torn.push([-tw / 2 - (i % 2 ? 3 : 0) + R.r(-1, 1), -th / 2 + th * i / 6]);
    const tp = P2(torn);
    x.save(); x.clip(tp);
    if (locked) { x.fillStyle = 'rgba(178,174,166,.62)'; x.fillRect(-60, -20, 120, 40); x.strokeStyle = 'rgba(70,67,79,.28)'; x.lineWidth = 3.5; for (let k = -12; k < 12; k++) { x.beginPath(); x.moveTo(k * 9, -20); x.lineTo(k * 9 + 40, 20); x.stroke(); } }
    else { x.fillStyle = rgba('#f3ead7', .8); x.fillRect(-60, -20, 120, 40); x.strokeStyle = rgba(C.shell, .9); x.lineWidth = 6.5; for (let k = -12; k < 12; k++) { x.beginPath(); x.moveTo(k * 13, -20); x.lineTo(k * 13 + 40, 20); x.stroke(); } }
    x.restore();
    x.strokeStyle = rgba(locked ? GRAPH : INK, .35); x.lineWidth = 1; x.stroke(tp);
    x.restore();
    /* where the picture is: the progress dim is stronger there */
    const [Mi, mi] = mk(); mi.translate(PR.cx, PR.cy); mi.rotate(PR.ang); mi.fillStyle = '#fff'; mi.fillRect(-pw / 2, -pw / 2, pw, pw);
    return { c, inner: Mi };
  }

  /* ---------- kinds: event, a scallop shell ---------- */
  const H = [96, 170], NR = 9, PHI = 1.02;
  const fanR = t => 138 - 34 * t * t;
  function scallopPts(inset = 0) {
    const pts = [];
    /* left ear */
    if (!inset) { pts.push([H[0] - 8, H[1] + 10]); pts.push([H[0] - 46, H[1] + 10]); pts.push([H[0] - 50, H[1] - 2]); }
    const N = 180;
    for (let i = 0; i <= N; i++) {
      const t = i / N * 2 - 1, ph = t * (PHI - inset * .0016), u = (t + 1) / 2 * NR, fr = u - Math.floor(u);
      const bump = inset ? 0 : 6.5 * Math.pow(Math.sin(fr * PI), .6);
      const r = fanR(t) - inset + bump;
      pts.push([H[0] + Math.sin(ph) * r, H[1] - Math.cos(ph) * r]);
    }
    if (!inset) { pts.push([H[0] + 50, H[1] - 2]); pts.push([H[0] + 46, H[1] + 10]); pts.push([H[0] + 8, H[1] + 10]); }
    else { /* inner field stops short of the hinge */
      const r0 = 46; for (let i = 0; i <= 30; i++) { const t = 1 - i / 30 * 2, ph = t * (PHI - inset * .0016); pts.push([H[0] + Math.sin(ph) * r0, H[1] - Math.cos(ph) * r0]); }
    }
    return pts;
  }
  function eventKind(G, st, seed) {
    const [c, x] = mk(), locked = st === 'locked';
    const out = scallopPts(0), inn = scallopPts(17), po = P2(out), pi = P2(inn);
    x.save(); x.translate(0, 2.6); x.fillStyle = 'rgba(29,26,51,.30)'; x.fill(po); x.restore();
    const band = locked ? '#c4c0b8' : C.shell, groove = locked ? '#8f8b94' : C.shellD, light = locked ? '#d6d2ca' : C.shellL;
    x.fillStyle = band; x.fill(po);
    /* ribs: alternate light and shade wedges from the hinge, with grooves between them */
    x.save(); x.clip(po);
    for (let k = 0; k < NR; k++) {
      const t0 = k / NR * 2 - 1, t1 = (k + 1) / NR * 2 - 1, tm = (t0 + t1) / 2;
      x.fillStyle = rgba(light, locked ? .5 : .55); x.beginPath(); x.moveTo(H[0], H[1]); for (const t of [t0 + .02, tm - .01]) x.lineTo(H[0] + Math.sin(t * PHI) * 170, H[1] - Math.cos(t * PHI) * 170); x.closePath(); x.fill();
      x.strokeStyle = groove; x.lineWidth = 2.4; x.beginPath(); x.moveTo(H[0], H[1]); x.lineTo(H[0] + Math.sin(t0 * PHI) * 170, H[1] - Math.cos(t0 * PHI) * 170); if (k) x.stroke();
    }
    /* the ears' hinge line */
    x.strokeStyle = groove; x.lineWidth = 2; x.beginPath(); x.moveTo(H[0] - 44, H[1] + 3); x.lineTo(H[0] + 44, H[1] + 3); x.stroke();
    x.restore();
    if (!locked) { x.save(); x.clip(po); x.translate(2.4, 2); x.strokeStyle = 'rgba(255,236,226,.5)'; x.lineWidth = 5; x.stroke(po); x.restore(); }
    /* the night inside */
    const [Fi, fi] = mk(); fi.save(); fi.clip(pi);
    fi.drawImage(groundC(S, S, locked ? 'paper' : 'night', seed, st), 0, 0);
    fi.drawImage(glyphC(G, st, seed), 0, 0); fi.restore();
    x.drawImage(Fi, 0, 0);
    const pc = locked ? GRAPH : INK;
    x.strokeStyle = rgba(pc, .8); x.lineWidth = 2; x.stroke(pi);
    x.strokeStyle = rgba(pc, .85); x.lineWidth = 2.2; x.stroke(P2(out, true, .4, RNG(seed)));
    const [Mi, mi] = mk(); mi.fillStyle = '#fff'; mi.fill(pi);
    return { c, inner: Mi };
  }

  /* ---------- finishing: gouache streaks, paper grain, and the blue-hour grade ---------- */
  function finish(c, st, inner) {
    const x = c.getContext('2d');
    const [T, t] = mk(); t.fillStyle = t.createPattern(TB, 'repeat'); t.fillRect(0, 0, S, S); t.globalCompositeOperation = 'destination-in'; t.drawImage(c, 0, 0);
    x.save(); x.globalCompositeOperation = 'soft-light'; x.globalAlpha = st === 'locked' ? .15 : .27; x.drawImage(T, 0, 0); x.restore();
    const [P, p] = mk(); p.fillStyle = p.createPattern(TP, 'repeat'); p.fillRect(0, 0, S, S); p.globalCompositeOperation = 'destination-in'; p.drawImage(c, 0, 0);
    x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = st === 'locked' ? .3 : .2; x.drawImage(P, 0, 0); x.restore();
    if (st === 'progress') {
      /* the outline takes the blue hour lightly; the picture inside was graded before it went in */
      const d = x.getImageData(0, 0, S, S), m = inner.getContext('2d').getImageData(0, 0, S, S).data;
      for (let i = 0; i < d.data.length; i += 4) { if (!d.data[i + 3]) continue; const a = .7 * (1 - m[i + 3] / 255); if (a > 0) gradePx(d.data, i, a); }
      x.putImageData(d, 0, 0);
    }
    return c;
  }

  /* ================= the glyphs (a 100-unit box mapped onto the field, centred) ================= */
  const box = (k = 1.2, cx = CX, cy = CY) => { const ox = cx - 50 * k, oy = cy - 50 * k; return { k, p: ([u, v]) => [ox + u * k, oy + v * k], P: pts => pts.map(([u, v]) => [ox + u * k, oy + v * k]) }; };
  /* a body along a centre line with a half-width profile */
  function ribbon(cl, wf) {
    const L = [], Rr = [];
    for (let i = 0; i < cl.length; i++) {
      const a = cl[Math.max(0, i - 1)], b = cl[Math.min(cl.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1, w = wf(i / (cl.length - 1));
      L.push([cl[i][0] - dy / n * w, cl[i][1] + dx / n * w]); Rr.push([cl[i][0] + dy / n * w, cl[i][1] - dx / n * w]);
    }
    return L.concat(Rr.reverse());
  }
  const hullOf = pts => { const P = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = []; for (const p of P) { while (lo.length > 1 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); } for (const p of P.reverse()) { while (up.length > 1 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); } return lo.slice(0, -1).concat(up.slice(0, -1)); };
  const noM = { shade: false, rim: false, margin: false };

  const GLYPHS = {};
  window.SEALS_VARIANT = window.SEALS_VARIANT || '';
  /* 1. the shell shutter: the game's own #i-shell symbol, painted as the snail it draws */
  GLYPHS['one-photograph'] = { kind: 'feat', seed: 11, make(st) {
    const m = box(1.22, CX, CY + 1), d = document.querySelector('#i-shell path').getAttribute('d');
    const raw = d.replace(/[ML]/g, ' ').trim().split(/\s+/).map(Number), sp = []; for (let i = 0; i < raw.length; i += 2) sp.push([raw[i], raw[i + 1]]);
    const T = ([x, y]) => [44 + (x - 39) * 1.32, 48 + (y - 57) * 1.32];
    const cut = sp.findIndex(q => q[1] > 80.4 && q[0] < 45);
    const spiral = sp.slice(0, cut + 1).map(T);
    const shellPts = cr(hullOf(spiral), true, 3);
    /* the snail the shutter symbol draws: its foot along the ground, its head and two horns up */
    const footCl = cr([[92, 82], [72, 84], [50, 84], [30, 81], [18, 74], [12, 64]], false, 8);
    const foot = ribbon(footCl, s => s < .12 ? 1.6 + s * 30 : s < .85 ? 5.2 + s * 1.2 : 6.2);
    const head = [12, 63];
    return { parts: [
      { t: 'poly', pts: m.P(foot), fill: '#8d8296', shade: { side: 1, ang: 1.4, off: .1 } },
      { t: 'poly', pts: m.P(ell(head[0], head[1], 6.4, 6.6, 0, 24)), fill: '#8d8296', shade: false },
      { t: 'line', pts: m.P([[head[0] - 2, head[1] - 4], [head[0] - 7, head[1] - 18]]), lw: 3.2, col: '#8d8296', mw: 2.6 },
      { t: 'line', pts: m.P([[head[0] + 2.5, head[1] - 4.5], [head[0] + 5, head[1] - 19]]), lw: 3.2, col: '#8d8296', mw: 2.6 },
      { t: 'poly', pts: m.P(shellPts), fill: '#f4efe6', shade: { off: .12 } },
      { t: 'line', pts: m.P(spiral), lw: 6.2, col: C.cobalt, edge: false, margin: false, pencil: true },
      { t: 'poly', pts: m.P(ell(head[0] - 7.4, head[1] - 19.5, 2.2, 2.2, 0, 12)), fill: INK, ...noM, edge: false },
      { t: 'poly', pts: m.P(ell(head[0] + 5.2, head[1] - 20.5, 2.2, 2.2, 0, 12)), fill: INK, ...noM, edge: false },
      { t: 'poly', pts: m.P(ell(head[0] - 2, head[1] - 1, 1.3, 1.3, 0, 10)), fill: INK, ...noM, edge: false }
    ] };
  } };
  /* 2. one sheet billowing off the line, one peg still holding */
  GLYPHS['sheets-in-the-air'] = { kind: 'feat', seed: 12, make(st) {
    const m = box(1.24, CX, CY + 4);
    const line = cr([[-14, 50], [20, 55], [60, 56], [114, 48]], false, 8);
    /* pegged at two corners on the line; the wind has lifted the rest up and away */
    const sheet = cr([[18, 54], [12, 38], [16, 20], [30, 6], [50, 2], [70, 8], [88, 4], [98, 16], [92, 30], [84, 40], [70, 46], [56, 55], [38, 52]], true, 7);
    const hem = cr([[34, 2], [52, -2], [72, 4], [90, 0], [104, 12]], false, 8);
    const s1 = hem.map(([u, v]) => [u - 2, v + 8]), s2 = hem.map(([u, v]) => [u - 3, v + 14]);
    return { parts: [
      { t: 'line', pts: m.P(line), lw: 3.6, col: '#3d3a52', mw: 2.4 },
      { t: 'poly', pts: m.P(sheet), fill: '#f7f4ee', shade: { side: 1, ang: .45, off: .12, a: .17 } },
      { t: 'clipline', clip: m.P(sheet), pts: m.P(s1), lw: 5, col: C.cobalt },
      { t: 'clipline', clip: m.P(sheet), pts: m.P(s2), lw: 2.6, col: C.cobalt },
      { t: 'detail', pts: m.P(cr([[30, 50], [36, 30], [48, 12]], false, 8)), lw: 1.8, col: '#7d6f98', a: .75 },
      { t: 'detail', pts: m.P(cr([[50, 52], [62, 34], [74, 14]], false, 8)), lw: 1.6, col: '#7d6f98', a: .6 },
      { t: 'poly', pts: m.P([[15, 48], [22, 47], [23, 64], [16, 65]]), fill: C.wood, shade: false, mw: 2.6, rim: false },
      { t: 'poly', pts: m.P([[51, 49], [58, 49], [58.5, 66], [51.5, 66.5]]), fill: C.wood, shade: false, mw: 2.6, rim: false }
    ] };
  } };
  /* 3. Pere and Mercè, together in one picture: two paper heads by the game's people painter */
  function paperHead(x, sp, k, mood) {
    const hw = 35.2, hh = 44, X = mapped(x);
    x.save(); x.fillStyle = MARGIN; x.strokeStyle = MARGIN; x.lineWidth = 7; x.beginPath(); x.ellipse(0, 0, hw / 2 + 3, hh / 2 + 3, 0, 0, TAU); x.stroke(); x.fill();
    x.beginPath(); x.moveTo(-k * hw * .42, -6); x.lineTo(-k * (hw * .5 + 8), 5); x.lineTo(-k * hw * .45, 8); x.closePath(); x.stroke(); x.fill(); x.restore();
    x.save(); x.beginPath(); x.ellipse(0, 0, hw / 2, hh / 2, 0, 0, TAU); x.clip(); x.fillStyle = sp.skin; x.fillRect(-40, -40, 80, 80);
    x.fillStyle = sp.skin2; x.beginPath(); x.moveTo(k * 2, -30); for (let i = 0; i <= 8; i++) { const t = i / 8; x.lineTo(k * (2 + Math.sin(t * 6) * 3), -30 + t * 60); } x.lineTo(k * 40, 30); x.lineTo(k * 40, -30); x.closePath(); x.fill(); x.restore();
    x.fillStyle = sp.skin2; x.beginPath(); x.moveTo(-k * hw * .42, -6); x.lineTo(-k * (hw * .5 + 8), 5); x.lineTo(-k * hw * .45, 8); x.closePath(); x.fill();
    hair(X, sp, 0, 0, hw, hh, k, INK); face(X, sp, 0, 0, hw, hh, k, mood, INK); if (sp.hat) hat(X, sp.hat, 0, 0, hw, hh, INK);
    x.strokeStyle = INK; x.lineWidth = 2; x.beginPath(); x.ellipse(0, 0, hw / 2, hh / 2, 0, 0, TAU); x.stroke();
  }
  GLYPHS['two-in-one-picture'] = { kind: 'feat', seed: 13, make(st) {
    const m = box(1.18, CX, CY + 1);
    const pere = { skin: '#c1a290', skin2: '#986c50', hair: '#9a9a9a', hairStyle: 'short', hat: 'beret' };
    const merce = { skin: '#f3bfa8', skin2: '#b99478', hair: '#6b3a2a', hairStyle: 'curls' };
    const tP = m.P([[8, 106], [14, 74], [47, 72], [51, 106]]), tM = m.P([[51, 106], [55, 75], [88, 76], [94, 106]]);
    const head = (cx, cy, r, sp, k, mood) => ({ t: 'draw', fn: (x) => { const [X, Y] = m.p([cx, cy]); x.translate(X, Y); x.rotate(r); x.scale(m.k * .98, m.k * .98); paperHead(x, sp, k, mood); } });
    return { parts: [
      { t: 'poly', pts: tP, fill: '#fbf6ea', shade: { off: .1 } },
      ...[80, 89, 98].map(v => ({ t: 'clipline', clip: tP, pts: m.P([[0, v], [60, v]]), lw: 4.4, col: C.cobalt })),
      { t: 'poly', pts: tM, fill: C.pink, shade: { off: .1 } },
      head(30, 46, .2, pere, -1, 'grin'), head(70, 48, -.2, merce, 1, 'glasses')
    ] };
  } };
  /* 4. Lluna in the air, head first, the sea waiting below */
  GLYPHS['lluna-in-the-air'] = { kind: 'feat', ground: 'sea', seed: 14, make(st) {
    /* head first off the stone head, arms together ahead of her; the splash is where she is going */
    const m = box(1.24, CX, CY), P0 = [8, 24], P1 = [66, -6], P2 = [82, 86], cl = [];
    for (let i = 0; i <= 60; i++) { const s = i / 60, u = 1 - s; cl.push([u * u * P0[0] + 2 * u * s * P1[0] + s * s * P2[0], u * u * P0[1] + 2 * u * s * P1[1] + s * s * P2[1]]); }
    const prof = s => s < .04 ? 3 + s * 40 : s < .34 ? 4.6 + (s - .04) * 9 : s < .62 ? 7.6 : s < .66 ? 7.6 - (s - .62) * 100 : s < .97 ? 3.6 - (s - .66) * 2.5 : 2.8;
    const body = ribbon(cl, prof);
    const suit = ribbon(cl.slice(20, 38), () => 8.2);
    const hi = 45, hp = cl[hi], hq = cl[hi + 1], ha = Math.atan2(hq[1] - hp[1], hq[0] - hp[0]), nx = -Math.sin(ha), ny = Math.cos(ha);
    const hc = [hp[0] - nx * 4.8, hp[1] - ny * 4.8];
    const hairPts = []; for (let i = 0; i <= 18; i++) { const a = Math.atan2(-ny, -nx) - PI * .6 + i / 18 * PI * 1.2; hairPts.push([hc[0] + Math.cos(a) * 9.6, hc[1] + Math.sin(a) * 9.6]); }
    hairPts.push([hc[0], hc[1]]);
    const sp = [P2[0] + 2, 97];
    const splash = [[sp[0] - 15, sp[1] + 3], [sp[0] - 10, sp[1] - 8], [sp[0] - 5, sp[1] - 2], [sp[0] - 1, sp[1] - 13], [sp[0] + 3, sp[1] - 2], [sp[0] + 9, sp[1] - 9], [sp[0] + 15, sp[1] + 3]];
    return { parts: [
      { t: 'poly', pts: m.P(splash), fill: TILE, shade: false, rim: false, mw: 2, edgeCol: '#4b4f8f' },
      { t: 'poly', pts: m.P(body), fill: '#c1a290', shade: { side: -1, ang: .6, a: .16 }, mw: 4.4 },
      { t: 'poly', pts: m.P(suit), fill: C.crimson, shade: { side: -1, ang: .6, a: .14 }, margin: false },
      { t: 'poly', pts: m.P(ell(hc[0], hc[1], 9.2, 9.2, 0, 36)), fill: '#c1a290', shade: { side: -1, ang: .6 }, mw: 4.4 },
      { t: 'poly', pts: m.P(hairPts), fill: C.black, ...noM },
      { t: 'poly', pts: m.P(ell(hc[0] + nx * 3.4 + Math.cos(ha) * 2, hc[1] + ny * 3.4 + Math.sin(ha) * 2, 1.8, 1.8, 0, 10)), fill: INK, ...noM, edge: false }
    ] };
  } };
  /* 5. the lighthouse on legs, its lamp burning (dark at blue hour, before it is lit) */
  GLYPHS['the-lamp-on-legs'] = { kind: 'feat', ground: 'sea', seed: 15, make(st) {
    const m = box(1.22, CX, CY + 1), lit = st !== 'progress', parts = [];
    const legs = [];
    for (const sd of [-1, 1]) {
      legs.push(cr([[50 + sd * 9, 60], [50 + sd * 34, 75], [50 + sd * 38, 86], [50 + sd * 33, 104]], false, 8));
      legs.push(cr([[50 + sd * 5, 61], [50 + sd * 17, 77], [50 + sd * 18.5, 88], [50 + sd * 14, 105]], false, 8));
    }
    const knees = []; for (const sd of [-1, 1]) { knees.push([50 + sd * 37.2, 81]); knees.push([50 + sd * 18.3, 83]); }
    const body = [[37.5, 30], [62.5, 30], [65, 56], [59, 61.5], [41, 61.5], [35, 56]];
    if (lit) parts.push({ t: 'glow', c: m.p([50, 19]), r: 30, col: '#fbdcdc', a: .65 });
    legs.forEach((L, i) => parts.push({ t: 'line', pts: m.P(L), lw: i % 2 ? 4 : 4.8, col: C.iron, mw: 2.6 }));
    knees.forEach(k => parts.push({ t: 'poly', pts: m.P(ell(k[0], k[1], 3, 3, 0, 16)), fill: C.iron, shade: false, rim: false, mw: 2.4 }));
    parts.push({ t: 'poly', pts: m.P(body), fill: TILE, shade: { off: .14 } });
    parts.push({ t: 'poly', pts: m.P([[36.6, 35], [63.4, 35], [64, 42], [36, 42]]), fill: C.crimson, shade: { off: .14 }, margin: false });
    parts.push({ t: 'poly', pts: m.P([[35.8, 47], [64.2, 47], [64.7, 54], [35.3, 54]]), fill: C.crimson, shade: { off: .14 }, margin: false });
    parts.push({ t: 'poly', pts: m.P([[31, 26], [69, 26], [69, 30.5], [31, 30.5]]), fill: C.iron, shade: false, rim: false });
    parts.push({ t: 'poly', pts: m.P([[41.5, 14], [58.5, 14], [58.5, 26], [41.5, 26]]), fill: lit ? '#fff7ee' : C.vsea, shade: false, rim: false });
    parts.push({ t: 'poly', pts: m.P([[50, 0], [61, 14.3], [39, 14.3]]), fill: C.crimson, shade: { off: .1 } });
    return { parts };
  } };
  /* 6. the lemon, squeezing itself (a lemon-yellow that stays clear of the platform's sun) */
  GLYPHS['the-lemon-squeezes'] = { kind: 'feat', seed: 16, make(st) {
    /* a lemon nipped in at the waist, squirting juice from its tip like the fountain at noon
       (its yellow is measured clear of the platform's sun: a cool lemon-yellow, lit with cream) */
    const m = box(1.3, CX - 4, CY + 6), top = [], bot = [], cx = 46, cy = 58;
    for (let i = 0; i <= 44; i++) { const u = i / 44, x = cx - 32 + u * 64, e = (x - cx) / 32, base = 23 * Math.pow(Math.max(0, 1 - e * e), .5), pinch = 1 - .13 * Math.exp(-(((x - cx) / 7) ** 2)); top.push([x, cy - base * pinch]); bot.push([x, cy + base * pinch * .97]); }
    let lemon = [[cx - 39, cy + .5], [cx - 36, cy - 2.5], [cx - 33, cy - 4]].concat(top, [[cx + 33, cy - 4], [cx + 36, cy - 2.5], [cx + 39, cy + .5], [cx + 36, cy + 3], [cx + 33, cy + 4]], bot.reverse(), [[cx - 33, cy + 4], [cx - 36, cy + 3]]);
    const A = -.42, R_ = p => rot(p, cx, cy, A);
    lemon = R_(lemon);
    const hi = R_(cr([[cx - 29, cy - 4], [cx - 23, cy - 14], [cx - 11, cy - 19], [cx - 5, cy - 16], [cx - 13, cy - 10], [cx - 23, cy - 2]], true, 6));
    const leaf = R_(cr([[cx - 33, cy - 4], [cx - 40, cy - 16], [cx - 52, cy - 22], [cx - 46, cy - 8]], true, 6));
    /* the pinch: pressure marks either side of the waist */
    const press = [[[cx - 6, cy - 33], [cx, cy - 27], [cx + 6, cy - 33]], [[cx - 6, cy + 32], [cx, cy + 26], [cx + 6, cy + 32]]].map(p => R_(p));
    const tip = R_([[cx + 42, cy]])[0];
    const drops = [[tip[0] + 6, tip[1] - 8, 4.4, .9], [tip[0] + 13, tip[1] - 18, 3.6, .7], [tip[0] + 2, tip[1] - 20, 3, .3], [tip[0] + 17, tip[1] - 5, 2.8, 1.3]];
    const parts = [
      { t: 'poly', pts: m.P(lemon), fill: C.lemon, shade: { off: .02, ang: 1.15, side: -1, a: .13, h: .16 }, edgeCol: '#4f5a12', rim: false },
      { t: 'poly', pts: m.P(hi), fill: C.cream, ...noM, edge: false },
      { t: 'poly', pts: m.P(leaf), fill: C.viridian, shade: false, rim: false },
    ];
    for (const [x, y, r, a] of drops) { const dp = []; for (let i = 0; i < 20; i++) { const t = i / 20 * TAU, rr = r * (1 + .9 * Math.pow(Math.max(0, Math.cos(t)), 6)); dp.push([x + Math.cos(t + a + PI / 2) * rr * .9, y + Math.sin(t + a + PI / 2) * rr]); } parts.push({ t: 'poly', pts: m.P(dp), fill: TILE, shade: false, mw: 2.4, edgeCol: '#6b7520' }); }
    return { parts };
  } };
  /* 7. the broken face in the garden of eyes, seen whole: its own planes from districts2.js */
  GLYPHS['the-face-made-whole'] = { kind: 'feat', seed: 17, make(st) {
    const m = box(1.2, CX, CY + 1), F = ([u, v]) => [51 + u * 168, 52 - v * 168];
    const oval = []; for (let i = 0; i < 44; i++) { const a = i / 44 * TAU; oval.push([Math.cos(a) * .2 * (1 + .12 * Math.sin(a * 3)) + .01, Math.sin(a) * .27 + .02]); }
    const pupil = (cx, cy, r) => { const p = []; for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; };
    const sh = pts => m.P(pts.map(F));
    return { parts: [
      { t: 'poly', pts: sh(oval), fill: '#c1a290', shade: false },
      { t: 'poly', pts: sh([[.0, .26], [.2, .18], [.23, -.05], [.12, -.26], [0, -.2]]), fill: C.cobalt, shade: false, mw: 1.6 },
      { t: 'poly', pts: sh([[-.2, .2], [-.05, .33], [.18, .3], [.24, .14], [.08, .22], [-.12, .12]]), fill: C.black, shade: false, mw: 1.6, rim: false },
      { t: 'poly', pts: sh([[-.14, .06], [-.075, .12], [.0, .075], [-.05, .012]]), fill: TILE, shade: false, mw: 1.2, rim: false },
      { t: 'poly', pts: sh(pupil(-.066, .064, .024)), fill: C.black, ...noM },
      { t: 'poly', pts: sh([[.04, .125], [.125, .165], [.175, .1], [.1, .07]]), fill: TILE, shade: false, mw: 1.2, rim: false },
      { t: 'poly', pts: sh(pupil(.11, .116, .024)), fill: C.green, ...noM },
      { t: 'poly', pts: sh([[.0, .06], [-.075, -.075], [.015, -.085]]), fill: C.crimson, shade: false, mw: 1.4 },
      { t: 'poly', pts: sh([[-.09, -.13], [-.035, -.1], [0, -.12], [.035, -.1], [.08, -.13], [0, -.185]]), fill: C.crimson, shade: false, mw: 1.4 }
    ] };
  } };
  /* 8. doves round the tower of eggs at noon: drawBird from people_paint.js */
  const birdPart = (m, bx, by, sc, f, flip) => ({ t: 'draw', fn: (x) => {
    const [px, py] = m.p([bx, by]); x.translate(px, py); x.scale(sc * (flip ? -1 : 1), sc); x.translate(-CELL_W / 2, -(CELL_H - 40));
    const c = [CELL_W / 2, CELL_H - 40]; x.save(); x.strokeStyle = MARGIN; x.fillStyle = MARGIN; x.lineWidth = 11; x.beginPath();
    if (f === 0) { x.moveTo(c[0] - 40, c[1] - 18); x.quadraticCurveTo(c[0] - 18, c[1] - 4, c[0], c[1]); x.quadraticCurveTo(c[0] + 18, c[1] - 4, c[0] + 40, c[1] - 18); x.quadraticCurveTo(c[0] + 18, c[1] + 6, c[0], c[1] + 8); x.quadraticCurveTo(c[0] - 18, c[1] + 6, c[0] - 40, c[1] - 18); }
    else { x.moveTo(c[0] - 40, c[1] + 14); x.quadraticCurveTo(c[0] - 18, c[1] + 2, c[0], c[1]); x.quadraticCurveTo(c[0] + 18, c[1] + 2, c[0] + 40, c[1] + 14); x.quadraticCurveTo(c[0] + 18, c[1] + 10, c[0], c[1] + 8); x.quadraticCurveTo(c[0] - 18, c[1] + 10, c[0] - 40, c[1] + 14); }
    x.closePath(); x.stroke(); x.fill(); x.restore(); drawBird(mapped(x), 0, 0, f);
  } });
  GLYPHS['doves-round-the-tower'] = { kind: 'feat', seed: 18, make(st) {
    /* close on the top of the tower of eggs, where Dolors rings at noon and the doves go round */
    const m = box(1.24, CX, CY + 2), parts = [], X = 45, k = 6.3;
    let y = 120;
    for (const [s, col] of [[2.4, TILE], [1.9, C.brick], [1.5, C.cobalt], [1.1, TILE]]) {
      const pr = []; for (let i = 0; i <= 14; i++) { const t = i / 14, a = t * PI; pr.push([Math.sin(a) * s * (1 - .18 * t) * k, (1 - Math.cos(a)) * s * 1.28 * k]); }
      const pts = pr.map(([r, h]) => [X + r, y - h]).concat(pr.slice().reverse().map(([r, h]) => [X - r, y - h]));
      parts.push({ t: 'poly', pts: m.P(pts), fill: col, shade: { off: .1 } });
      y -= (s * 2.56 - s * .35) * k;
    }
    parts.push({ t: 'line', pts: m.P([[X - 5, y + 5], [X, y - 6], [X + 5, y + 5]]), lw: 2.6, col: C.iron, mw: 2.4 });
    parts.push({ t: 'poly', pts: m.P([[X - 5, y - 1.5], [X + 5, y - 1.5], [X + 6.8, y + 5.5], [X - 6.8, y + 5.5]]), fill: '#8d5a3a', shade: false, mw: 2.4 });
    parts.push(birdPart(m, 82, 30, .52, 0, false), birdPart(m, 16, 46, .42, 1, true), birdPart(m, 78, 66, .36, 1, false));
    return { parts };
  } };
  /* 9. the sun sitting on the lip of the great shell */
  GLYPHS['the-sun-on-the-shell'] = { kind: 'feat', seed: 19, make(st) {
    const m = box(1.22, CX, CY + 2), hc = [50, 100], parts = [], N = 9;
    const fan = [[hc[0] - 15, hc[1] + 2], [hc[0] - 22, hc[1] - 7]];
    for (let i = 0; i <= 90; i++) { const t = i / 90 * 2 - 1, ph = t * 1.0, u = (t + 1) / 2 * N, fr = u - Math.floor(u), r = 60 - 11 * t * t + 2.8 * Math.pow(Math.sin(fr * PI), .6); fan.push([hc[0] + Math.sin(ph) * r, hc[1] - Math.cos(ph) * r]); }
    fan.push([hc[0] + 22, hc[1] - 7]); fan.push([hc[0] + 15, hc[1] + 2]);
    const fanR = rot(fan, hc[0], hc[1], .07);
    parts.push({ t: 'glow', c: m.p([54, 24]), r: 44, col: '#fbdcdc', a: .55 });
    parts.push({ t: 'poly', pts: m.P(ell(54.5, 24, 17, 17, 0, 44)), fill: '#fdf8f0', shade: false, edge: false, rim: false, mw: 2 });
    parts.push({ t: 'poly', pts: m.P(fanR), fill: C.shell, shade: { off: .06, a: .16 } });
    for (let k = 1; k < N; k++) { const t = k / N * 2 - 1, a = t * 1.0 + .07; parts.push({ t: 'clipline', clip: m.P(fanR), pts: m.P([[hc[0] + Math.sin(a) * 6, hc[1] - Math.cos(a) * 6], [hc[0] + Math.sin(a) * 70, hc[1] - Math.cos(a) * 70]]), lw: 2.6, col: C.shellD }); }
    for (let k = 0; k < N; k++) { const t = (k + .5) / N * 2 - 1, a = t * 1.0 + .07; parts.push({ t: 'clipline', clip: m.P(fanR), pts: m.P([[hc[0] + Math.sin(a) * 12, hc[1] - Math.cos(a) * 12], [hc[0] + Math.sin(a) * 70, hc[1] - Math.cos(a) * 70]]), lw: 3.6, col: rgba(C.shellL, .7) }); }
    return { parts };
  } };
  /* 10. the big egg on the fishermen's roof hatches: the lid tipped off, something blinking inside */
  GLYPHS['the-egg-hatches'] = { kind: 'feat', seed: 20, make(st) {
    const m = box(1.24, CX - 2, CY + 4), k = 25, base = [50, 98];
    const prof = []; for (let i = 0; i <= 28; i++) { const t = i / 28, a = t * PI; prof.push([Math.sin(a) * (1 - .18 * t) * k, (1 - Math.cos(a)) * 1.28 * k]); }
    const crackH = 1.28 * k * 1.08, crackY = base[1] - crackH, tA = Math.acos(1 - 1.08) / PI, rr = Math.sin(tA * PI) * (1 - .18 * tA) * k;
    const teeth = []; for (let i = 0; i <= 8; i++) teeth.push([base[0] - rr + i / 8 * rr * 2, crackY + (i % 2 ? -6 : 1.2)]);
    const side = prof.filter(([r, h]) => h < crackH).map(([r, h]) => [r, h]);
        const lowerShell = side.map(([r, h]) => [base[0] + r, base[1] - h]).concat(teeth.slice().reverse(), side.slice().reverse().map(([r, h]) => [base[0] - r, base[1] - h]));
    const upperProf = prof.filter(([r, h]) => h >= crackH);
    const lid0 = upperProf.map(([r, h]) => [base[0] + r, base[1] - h]).concat(upperProf.slice().reverse().map(([r, h]) => [base[0] - r, base[1] - h]));
    const lid = rot(lid0.concat(teeth), base[0] + rr, crackY, .5).map(([x, y]) => [x + 6, y - 9]);
    const hole = ell(base[0], crackY - 1, rr - 1.8, 6.5, 0, 30);
    return { parts: [
      { t: 'poly', pts: m.P(lowerShell), fill: '#fbfaf3', shade: { off: .12 } },
      { t: 'poly', pts: m.P(hole), fill: C.iron, ...noM, edge: false },
      { t: 'poly', pts: m.P(ell(base[0] - 6, crackY - 2, 3, 3, 0, 14)), fill: TILE, ...noM, edge: false },
      { t: 'poly', pts: m.P(ell(base[0] + 5, crackY - 2.4, 3, 3, 0, 14)), fill: TILE, ...noM, edge: false },
      { t: 'poly', pts: m.P(ell(base[0] - 5.4, crackY - 1.7, 1.4, 1.4, 0, 10)), fill: INK, ...noM, edge: false },
      { t: 'poly', pts: m.P(ell(base[0] + 5.6, crackY - 2.1, 1.4, 1.4, 0, 10)), fill: INK, ...noM, edge: false },
      { t: 'detail', pts: m.P(teeth), lw: 2.2, col: '#4a4660' },
      { t: 'poly', pts: m.P(lid), fill: '#fbfaf3', shade: { off: .12 } }
    ] };
  } };
  /* 11. Tinta, who walks the whole town: drawCat from people_paint.js */
  GLYPHS['tinta-in-every-quarter'] = { kind: 'collection', seed: 21, make(st) {
    return { parts: [{ t: 'draw', fn: (x) => { x.translate(CX - 4, CY + 6); x.scale(1.34, 1.34); x.translate(-CELL_W / 2, -(CELL_H - 44)); drawCat(mapped(x), CAST.tinta, 'front', 1); } }] };
  } };
  /* 12. the wall is full: Aurora's six panels at the summit, one for each quarter */
  GLYPHS['the-wall-is-full'] = { kind: 'collection', seed: 22, make(st) {
    /* Aurora's wall at the summit, all six quarters up: six prints, each taped as the game tapes them */
    const m = box(1.22, CX, CY + 1), parts = [], R = RNG(4);
    const pans = [[C.duskv, C.cobalt, 1], [C.lemon, C.viridian, 0], [C.blushL, C.brick, 1], [C.viridian, C.green, 0], [C.roseM, C.dusk, 1], [C.blushL, C.vsea, 1]];
    parts.push({ t: 'poly', pts: m.P([[-6, -6], [106, -6], [106, 106], [-6, 106]]), fill: '#e6e2da', shade: false, rim: false, edge: false, margin: false });
    pans.forEach(([a, b, sun], i) => {
      const col = i % 3, row = Math.floor(i / 3), w = 26, h = 26, cx = 17 + col * 33 + R.r(-1.5, 1.5), cy = 30 + row * 40 + R.r(-1.5, 1.5), x0 = cx - w / 2, y0 = cy - h / 2, r = (i % 2 ? 1 : -1) * R.r(.06, .13);
      const Q = pts => m.P(rot(pts, cx, cy, r)), bd = 3;
      parts.push({ t: 'poly', pts: Q([[x0 - bd, y0 - bd], [x0 + w + bd, y0 - bd], [x0 + w + bd, y0 + h + bd], [x0 - bd, y0 + h + bd]]), fill: TILE, shade: false, rim: false, mw: 1.2, edgeCol: '#5a5068' });
      parts.push({ t: 'poly', pts: Q([[x0, y0], [x0 + w, y0], [x0 + w, y0 + h * .56], [x0, y0 + h * .56]]), fill: a, ...noM, edge: false });
      parts.push({ t: 'poly', pts: Q([[x0, y0 + h * .56], [x0 + w, y0 + h * .56], [x0 + w, y0 + h], [x0, y0 + h]]), fill: b, ...noM, edge: false });
      if (sun) parts.push({ t: 'poly', pts: Q(ell(x0 + w * .64, y0 + h * .56, 4.6, 4.6, 0, 16)), fill: '#fdf8f0', ...noM, edge: false });
      parts.push({ t: 'poly', pts: Q([[cx - 7, y0 - bd - 3], [cx + 7, y0 - bd - 3.6], [cx + 7.2, y0 - bd + 3], [cx - 6.8, y0 - bd + 3.4]]), fill: rgba(C.shell, .85), ...noM, edge: false });
    });
    return { parts };
  } };
  /* the event: a festival firework as the game paints them (a chrysanthemum, each spark trailing a stroke, drooping as it dies) */
  GLYPHS['festival-of-the-shell'] = { kind: 'event', seed: 23, make(st) {
    const parts = [], c = [96, 90], n = 12, R = RNG(9), prog = st === 'progress';
    parts.push({ t: 'glow', c, r: 50, col: '#fff2ec', a: prog ? .22 : .5 });
    for (let k = 0; k < n; k++) {
      const a = k / n * TAU + .13, Rk = 39 * (.86 + .14 * R.f()), droop = prog ? 10 : 5;
      const pts = []; for (let i = 0; i <= 8; i++) { const t = .26 + i / 8 * .74; pts.push([c[0] + Math.cos(a) * Rk * t, c[1] + Math.sin(a) * Rk * t + droop * t * t]); }
      const hot = k % 3 === 1;
      parts.push({ t: 'line', pts, lw: 4.6, col: hot ? C.pinkHot : '#fff6ee', mw: 1.8, edge: false });
      const tip = pts[pts.length - 1];
      parts.push({ t: 'poly', pts: ell(tip[0], tip[1], 4.4, 4.4, 0, 16), fill: hot ? C.pinkHot : '#fffaf4', shade: false, rim: false, mw: 1.8, edgeCol: hot ? '#7a2a46' : '#8a6a6a' });
    }
    parts.push({ t: 'poly', pts: ell(c[0], c[1], 6.5, 6.5, 0, 18), fill: '#fffaf4', shade: false, rim: false, edge: false, mw: 2 });
    return { parts };
  } };

  const ORDER = ['one-photograph', 'sheets-in-the-air', 'two-in-one-picture', 'lluna-in-the-air', 'the-lamp-on-legs', 'the-lemon-squeezes', 'the-face-made-whole', 'doves-round-the-tower', 'the-sun-on-the-shell', 'the-egg-hatches', 'tinta-in-every-quarter', 'the-wall-is-full', 'festival-of-the-shell'];
  function render(name, st) {
    const D = GLYPHS[name], G = D.make(st); G.ground = D.ground; G.seed = D.seed;
    const r = D.kind === 'feat' ? feat(G, st, D.seed) : D.kind === 'collection' ? collection(G, st, D.seed) : eventKind(G, st, D.seed);
    finish(r.c, st, r.inner);
    return r.c.toDataURL('image/png');
  }
  window.SEALS = { names: ORDER, render, setVariant: v => { window.SEALS_VARIANT = v; } };
})();
