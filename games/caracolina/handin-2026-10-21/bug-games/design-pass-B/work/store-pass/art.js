/* Caracolina · store and pass art (bug.games design pass B, agent store-pass).
   Runs inside the game's page and draws with the game's own 2D code:
   - people_paint.js: drawFigure (the traveller), pattern (stripes), the residents' rules for cut paper:
     a white paper margin round every silhouette, gouache-flat colour, a darker "cubist" plane on one side
     (rgba(30,20,60,.16)) and pencil (#1d1a33) wandering a little off the paint;
   - ui.js UI.grain's recipe for the paper's fibres; style.css for the sketchbook page (#f3ead7, faint cobalt rules),
     the prints (#fffdf7) and the washi tape (two colours in 45-degree stripes, torn ends);
   - paint.js: the gouache stroke layer (strokeLayer) and the trencadis method (texMosaic);
   - index.html: the #i-shell spiral; the game's RNG for every random choice.
   Colours: only free ones (measured with measure.py; see notes). */
'use strict';
const K = {
  paper: '#f3ead7', tile: '#fbf8f1', fig: '#fbf8f0', print: '#fffdf7', ink: '#1d1a33', ink2: '#4a4466',
  cobalt: '#2a55b8', cobaltM: '#2f5fae', cobaltD: '#24499f', night: '#152760', night2: '#1b2f6b', iron: '#1e2a3a', navy: '#1e2a4a',
  oxblood: '#8e2a22', plum: '#6a3a8a', plumL: '#8c62a3', viridian: '#1f6b5a', dusk: '#4b4f8f', duskV: '#7d6f98', mortar: '#c4c0b8',
  vsea: '#303466', mauve: '#605076', wood: '#8a5634', woodL: '#b98a5a', black: '#1c1c24', glassG: '#2e7f73', glassB: '#3d74b8',
  teal: '#357f8f', tealD: '#2a6a78', pink: '#f2c3b3', slate: '#3a3a48', grey: '#6b6b78'
};
const SHADE = 'rgba(30,20,60,.16)';          /* the residents' second, darker plane */
const CUT = 'rgba(29,26,51,.26)';            /* style.css --cut: the hard little shadow of cut paper */

/* ---------- small tools ---------- */
function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function url(c) { return c.toDataURL('image/png'); }
function ctx2(c) { const x = c.getContext('2d'); x.lineJoin = 'round'; x.lineCap = 'round'; return x; }
function pathOf(pts) { const p = new Path2D(); pts.forEach((q, i) => i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])); p.closePath(); return p; }
function ellPts(cx, cy, rx, ry, rot = 0, n = 48, a0 = 0, a1 = TAU) { const o = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n, ex = Math.cos(a) * rx, ey = Math.sin(a) * ry; o.push([cx + ex * Math.cos(rot) - ey * Math.sin(rot), cy + ex * Math.sin(rot) + ey * Math.cos(rot)]); } return o; }
/* pencil over the paint, wandering a little off it (people_paint.js: each point nudged by up to a pixel) */
function pencilPts(x, pts, R, lw, j = 1.2, closed = true, col = K.ink) {
  x.save(); x.strokeStyle = col; x.lineWidth = lw; x.beginPath();
  pts.forEach((p, i) => { const q = [p[0] + R.r(-j, j), p[1] + R.r(-j, j)]; i ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1]); });
  if (closed) x.closePath(); x.stroke(); x.restore();
}
function pencilPath(x, path, R, lw, j = 1.2, col = K.ink) { x.save(); x.strokeStyle = col; x.lineWidth = lw; x.translate(R.r(-j, j), R.r(-j, j)); x.stroke(path); x.restore(); }
function plane(x, clipPath, draw, col = SHADE) { x.save(); x.clip(clipPath); x.fillStyle = col; x.beginPath(); draw(x); x.fill(); x.restore(); }
function bez(p0, p1, p2, p3, n = 16) { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]); } return o; }
function quad(p0, p1, p2, n = 12) { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]); } return o; }

/* the paper's fibres: ui.js UI.grain(), same recipe and seed */
const GRAIN = (() => {
  const c = cv(220, 220), x = c.getContext('2d');
  const R = RNG(77), img = x.createImageData(220, 220), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const v = 128 + (R.f() - .5) * 26; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 26; }
  x.putImageData(img, 0, 0);
  x.globalAlpha = .12; x.strokeStyle = '#6b5a3a'; x.lineWidth = .7;
  for (let i = 0; i < 70; i++) { const px = R.f() * 220, py = R.f() * 220, a = R.f() * 6.28, l = 4 + R.f() * 14; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a + .6) * l * .5, py + Math.sin(a + .6) * l * .5, px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
  x.globalAlpha = .06; x.fillStyle = '#fff'; for (let i = 0; i < 400; i++) x.fillRect(R.f() * 220, R.f() * 220, 1, 1);
  return c;
})();
function grainOver(c, a = 1, atop = true) { const x = c.getContext('2d'); x.save(); if (atop) x.globalCompositeOperation = 'source-atop'; x.globalAlpha = a; x.fillStyle = x.createPattern(GRAIN, 'repeat'); x.fillRect(0, 0, c.width, c.height); x.restore(); }

/* cut paper: a white paper margin all round the painted item, then the hard little shadow under it */
function cutPaper(item, o = {}) {
  const w = item.width, h = item.height, m = o.margin ?? 6, R = RNG(o.seed || 5);
  const sil = cv(w, h), sx = sil.getContext('2d'); sx.drawImage(item, 0, 0); sx.globalCompositeOperation = 'source-in'; sx.fillStyle = '#000'; sx.fillRect(0, 0, w, h);
  const mar = cv(w, h), mx = mar.getContext('2d');
  if (m > 0) for (const f of [1, .66, .33]) for (let i = 0; i < 28; i++) { const a = i / 28 * TAU, r = m * f * (0.9 + R.f() * 0.2); mx.drawImage(sil, Math.cos(a) * r, Math.sin(a) * r); }
  mx.drawImage(sil, 0, 0);
  mx.globalCompositeOperation = 'source-in'; mx.fillStyle = o.edge || K.fig; mx.fillRect(0, 0, w, h);
  const out = cv(w, h), ox = out.getContext('2d');
  if (o.shadow !== false) { const sh = cv(w, h), shx = sh.getContext('2d'); shx.drawImage(mar, 0, 0); shx.globalCompositeOperation = 'source-in'; shx.fillStyle = o.shadowCol || CUT; shx.fillRect(0, 0, w, h); ox.drawImage(sh, o.sdx ?? 4, o.sdy ?? 6); }
  ox.drawImage(mar, 0, 0); ox.drawImage(item, 0, 0);
  if (o.grain !== false) grainOver(out, .9);
  return out;
}
function silhouette(c) { const s = cv(c.width, c.height), x = s.getContext('2d'); x.drawImage(c, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#000'; x.fillRect(0, 0, s.width, s.height); return s; }
function onGround(ground, item, dx = 0, dy = 0) { const c = cv(ground.width, ground.height), x = c.getContext('2d'); x.drawImage(ground, 0, 0); x.drawImage(item, dx, dy); return c; }
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }

/* ---------- grounds ---------- */
/* the sketchbook page (style.css #book .page): paper, its fibres, faint cobalt rules */
function pageGround(w, h, o = {}) {
  const c = cv(w, h), x = c.getContext('2d');
  x.fillStyle = o.col || K.paper; x.fillRect(0, 0, w, h);
  x.fillStyle = x.createPattern(GRAIN, 'repeat'); x.fillRect(0, 0, w, h);
  const gap = o.gap || 36; x.strokeStyle = `rgba(42,85,184,${o.ruleA ?? .1})`; x.lineWidth = o.ruleW || 2;
  for (let y = o.y0 ?? gap * .78; y < h; y += gap) { x.beginPath(); x.moveTo(0, y); x.lineTo(w, y); x.stroke(); }
  return c;
}
/* gouache strokes (paint.js strokeLayer's stroke: a bent stroke with bristle marks at its end), opaque, in a few hard values */
function gouacheStrokes(x, R, n, cols, box, wr, lr, inside) {
  x.lineCap = 'round'; x.lineJoin = 'round';
  for (let i = 0; i < n; i++) {
    let px, py, tries = 0;
    do { px = R.r(box[0], box[2]); py = R.r(box[1], box[3]); } while (inside && !inside(px, py) && ++tries < 40);
    if (inside && !inside(px, py)) continue;
    const lw = R.r(wr[0], wr[1]), l = R.r(lr[0], lr[1]), a = (R.ch(.55) ? -.8 : .5) + R.r(-.4, .4);
    const dx = Math.cos(a) * l / 2, dy = Math.sin(a) * l / 2, bx = R.r(-l * .15, l * .15), by = R.r(-l * .15, l * .15);
    const col = R.pick(cols); x.strokeStyle = col; x.lineWidth = lw;
    x.beginPath(); x.moveTo(px - dx, py - dy); x.quadraticCurveTo(px + bx, py + by, px + dx, py + dy); x.stroke();
    if (R.ch(.5)) { x.lineWidth = Math.max(1.2, lw * .06); for (let k = -2; k <= 2; k++) { const of = k * lw * .18; x.beginPath(); x.moveTo(px + dx - Math.sin(a) * of, py + dy + Math.cos(a) * of); x.lineTo(px + dx * 1.18 - Math.sin(a) * of, py + dy * 1.18 + Math.cos(a) * of); x.stroke(); } }
  }
}
function gouacheGround(w, h, base, cols, seed) {
  const c = cv(w, h), x = c.getContext('2d'), R = RNG(seed);
  x.fillStyle = base; x.fillRect(0, 0, w, h);
  gouacheStrokes(x, R, Math.round(w * h / 200), cols, [-60, -30, w + 60, h + 30], [9, 22], [70, 170]);
  x.fillStyle = x.createPattern(GRAIN, 'repeat'); x.fillRect(0, 0, w, h);
  return c;
}
/* trencadis, the way paint.js texMosaic sets it: broken tiles round jittered seeds, grey grout, a glaze slope and a lip */
function trencadis(w, h, pal, grout, seed, n = 13) {
  const c = cv(w, h), x = c.getContext('2d'), id = x.createImageData(w, h), d = id.data, R = RNG(seed);
  const cell = w / n, rows = Math.ceil(h / cell) + 1, pts = [];
  for (let j = -1; j <= rows; j++) for (let i = -1; i <= n; i++) pts.push({ i, j, x: (i + R.r(.1, .9)) * cell, y: (j + R.r(.1, .9)) * cell, c: hexRGB(R.pick(pal)).map(v => clamp(v + R.r(-.03, .03), 0, 1)), g: R.r(0, TAU), hl: R.f() });
  const at = (i, j) => pts[(j + 1) * (n + 2) + (i + 1)];
  const G = hexRGB(grout);
  for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) {
    const ci = Math.floor(px / cell), cj = Math.floor(py / cell); let b1 = 1e9, b2 = 1e9, bp = null;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const p = at(ci + di, cj + dj); if (!p) continue; const dd = (px - p.x) ** 2 + (py - p.y) ** 2; if (dd < b1) { b2 = b1; b1 = dd; bp = p; } else if (dd < b2) b2 = dd; }
    const edge = (Math.sqrt(b2) - Math.sqrt(b1)) / 2, o = (py * w + px) * 4;
    let r, g, b;
    if (edge < 1.3) { [r, g, b] = G; }
    else {
      const t = Math.cos(bp.g) * (px - bp.x) + Math.sin(bp.g) * (py - bp.y), glaze = 1 + t / cell * .12;
      const lip = edge < 2.6 ? .88 : 1, hl = bp.hl > .7 && Math.abs(t - cell * .2) < 1.1 && edge > 3.5 ? .12 : 0;
      r = bp.c[0] * glaze * lip + hl; g = bp.c[1] * glaze * lip + hl; b = bp.c[2] * glaze * lip + hl;
    }
    d[o] = clamp(r * 255, 0, 255); d[o + 1] = clamp(g * 255, 0, 255); d[o + 2] = clamp(b * 255, 0, 255); d[o + 3] = 255;
  }
  x.putImageData(id, 0, 0);
  x.fillStyle = x.createPattern(GRAIN, 'repeat'); x.fillRect(0, 0, w, h);
  return c;
}

/* ---------- washi tape (style.css .tape: two colours in 45-degree stripes, torn ends) ---------- */
function tapeStrip(L, T, colA, colB, R, o = {}) {
  const pad = 6, c = cv(Math.ceil(L + 2 * pad), Math.ceil(T + 2 * pad)), x = c.getContext('2d');
  const top = [], bot = [], n = Math.max(6, Math.round(L / 24));
  for (let i = 0; i <= n; i++) { const u = i / n; top.push([pad + u * L, pad + R.r(-.6, .6)]); bot.push([pad + u * L, pad + T + R.r(-.6, .6)]); }
  const teeth = Math.max(4, Math.round(T / 7)), endL = [], endR = [];
  for (let i = 1; i < teeth; i++) { const v = pad + T * i / teeth, d = (i % 2 ? 1 : -.3) * Math.min(5, T * .09) + R.r(-1, 1); endR.push([pad + L - d, v]); endL.push([pad + d, v]); }
  const pts = [...top, ...endR, ...bot.reverse(), ...endL.reverse()];
  x.save(); x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); x.clip();
  x.fillStyle = colA; x.fillRect(0, 0, c.width, c.height);
  if (colB) { x.fillStyle = colB; const st = o.stripe || T * .3, per = o.period || 2 * st; for (let k = -c.height; k < c.width + c.height; k += per) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k + st, 0); x.lineTo(k + st + c.height, c.height); x.lineTo(k + c.height, c.height); x.closePath(); x.fill(); } }
  x.restore();
  c.pad = pad; return c;
}
function placeTape(x, strip, cx, cy, ang, alpha = .85, shadow = true) {
  x.save(); x.translate(cx, cy); x.rotate(ang);
  if (shadow) { x.save(); x.globalAlpha = .16; x.filter = 'brightness(0)'; x.drawImage(strip, -strip.width / 2 + 1.5, -strip.height / 2 + 2.5); x.restore(); }
  x.globalAlpha = alpha; x.drawImage(strip, -strip.width / 2, -strip.height / 2); x.restore();
}

/* ---------- a print (style.css .printT: #fffdf7, the picture, a deeper bottom margin) ---------- */
function printCard(img, pw, ph, o = {}) {
  const b = o.border ?? 12, bb = o.bottom ?? b * 1.35, W = pw + 2 * b, H = ph + b + bb;
  const c = cv(W, H), x = c.getContext('2d');
  x.fillStyle = K.print; x.fillRect(0, 0, W, H);
  if (img) { const s = Math.max(pw / img.width, ph / img.height) * (o.zoom || 1), sw = pw / s, sh = ph / s; x.drawImage(img, (img.width - sw) / 2 + (o.sx || 0) * img.width, (img.height - sh) / 2 + (o.sy || 0) * img.height, sw, sh, b, b, pw, ph); }
  return c;
}
function deckle(c, R, amp = 4, fringe = 3) {
  /* tear the print's edge: a ragged outline with a thinner, fibrous fringe */
  const W = c.width, H = c.height, out = cv(W, H), x = out.getContext('2d');
  const edge = (inset, a) => { const pts = []; const side = (x0, y0, x1, y1) => { const L = Math.hypot(x1 - x0, y1 - y0), n = Math.round(L / 3.2), nx = (y1 - y0) / L, ny = -(x1 - x0) / L; let wv = 0; for (let i = 0; i < n; i++) { const t = i / n; wv = wv * .55 + R.r(-1, 1) * .45; const dep = inset + Math.abs(wv) * a + (R.ch(.04) ? R.r(1, 2.2) * a : 0); pts.push([x0 + (x1 - x0) * t - nx * dep, y0 + (y1 - y0) * t - ny * dep]); } }; side(0, 0, W, 0); side(W, 0, W, H); side(W, H, 0, H); side(0, H, 0, 0); return pts; };
  x.save(); x.globalAlpha = .55; x.beginPath(); edge(0, amp * .6).forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); x.clip(); x.drawImage(c, 0, 0); x.restore();
  x.save(); x.beginPath(); edge(fringe, amp).forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); x.clip(); x.drawImage(c, 0, 0); x.restore();
  return out;
}
function rotated(c, ang, pad = 20) { const d = Math.ceil(Math.hypot(c.width, c.height)) + 2 * pad, o = cv(d, d), x = o.getContext('2d'); x.translate(d / 2, d / 2); x.rotate(ang); x.drawImage(c, -c.width / 2, -c.height / 2); return o; }
function centreOn(dst, src, cx, cy) { dst.getContext('2d').drawImage(src, Math.round(cx - src.width / 2), Math.round(cy - src.height / 2)); }

/* =====================================================================
   STORE ITEMS (400 x 400): one item, centred, on the sketchbook page
   ===================================================================== */
const TS = 400;

/* paper-dove: a white paper dove, cut out and painted like the residents, on a cobalt gouache wash of sky */
function washBlob(w, h, cx, cy, rx, ry, cols, seed, o = {}) {
  /* a patch of gouache brushed onto the page: a ragged, dry-brushed edge, long strokes in a few hard values */
  const c = cv(w, h), x = ctx2(c), R = RNG(seed), n = 90, rim = [];
  let wv = 0;
  for (let i = 0; i < n; i++) { const a = i / n * TAU; wv = wv * .6 + R.r(-1, 1) * .4; const r = 1 + wv * .07 + (R.ch(.12) ? R.r(-.06, .05) : 0); rim.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); }
  x.save(); x.clip(pathOf(rim));
  x.fillStyle = cols[0]; x.fillRect(0, 0, w, h);
  gouacheStrokes(x, R, o.n || 160, cols, [cx - rx - 20, cy - ry - 20, cx + rx + 20, cy + ry + 20], o.wr || [10, 24], o.lr || [70, 170]);
  x.restore();
  /* dry brush where the paint ran out at the rim */
  x.strokeStyle = cols[0]; x.lineCap = 'round';
  for (let i = 0; i < 70; i++) { const k = R.i(0, n - 1), p = rim[k], a = Math.atan2(p[1] - cy, p[0] - cx) + PI / 2 + R.r(-.3, .3), l = R.r(10, 30); x.lineWidth = R.r(1.2, 3); x.globalAlpha = R.r(.5, 1); x.beginPath(); x.moveTo(p[0] - Math.cos(a) * l / 2, p[1] - Math.sin(a) * l / 2); x.lineTo(p[0] + Math.cos(a) * l / 2, p[1] + Math.sin(a) * l / 2); x.stroke(); }
  x.globalAlpha = 1;
  grainOver(c, 1);
  return c;
}
function storeDove() {
  const g = pageGround(TS, TS), gx = g.getContext('2d');
  /* the sky: cobalt gouache brushed onto the page in three hard values */
  gx.drawImage(washBlob(TS, TS, 208, 214, 138, 122, [K.cobalt, K.cobaltM, K.cobaltD], 301), 0, 0);
  const item = cv(TS, TS), x = ctx2(item), P = RNG(41);
  const near = pathOf([...bez([168, 206], [150, 150], [178, 92], [246, 56]), [262, 90], [250, 106], [266, 130], [252, 148], [262, 172], [238, 206]]);
  const far = pathOf([...bez([214, 200], [226, 146], [266, 106], [322, 92]), [318, 116], [302, 126], [312, 144], [292, 156], [296, 178], [262, 208]]);
  const tail = pathOf([[256, 216], [330, 190], [344, 200], [338, 214], [352, 226], [342, 240], [348, 256], [332, 262], [256, 242]]);
  const bodyPts = [...bez([118, 204], [126, 262], [214, 272], [266, 238]), [272, 214], ...bez([272, 214], [232, 196], [176, 172], [140, 168])];
  const body = pathOf(bodyPts);
  const headPts = ellPts(134, 186, 31, 30, 0, 40), head = pathOf(headPts);
  const beak = pathOf([[106, 178], [82, 191], [107, 199]]);
  /* far wing: its other side, a cooler white */
  x.fillStyle = '#e9e4dc'; x.fill(far); plane(x, far, c => c.rect(150, 140, 300, 200));
  x.fillStyle = K.fig; x.fill(tail); plane(x, tail, c => c.rect(296, 150, 100, 200));
  x.fill(body);
  plane(x, body, c => { c.moveTo(208, 150); for (let i = 0; i <= 8; i++) { const t = i / 8; c.lineTo(208 + Math.sin(t * 6) * 6, 150 + t * 140); } c.lineTo(300, 290); c.lineTo(300, 150); c.closePath(); });
  x.fillStyle = K.fig; x.fill(near); plane(x, near, c => { c.moveTo(150, 176); c.lineTo(300, 120); c.lineTo(300, 240); c.lineTo(150, 240); c.closePath(); });
  x.fillStyle = K.fig; x.fill(head);
  x.fillStyle = K.ink2; x.fill(beak);
  /* pencil */
  for (const p of [far, tail, body, near, head]) pencilPath(x, p, P, 3.6, 1.1);
  pencilPath(x, beak, P, 3, .6);
  x.strokeStyle = K.ink; x.lineWidth = 2.6;
  for (const [a, b] of [[[262, 90], [236, 108]], [[266, 130], [238, 140]], [[262, 172], [234, 174]], [[338, 214], [300, 216]], [[342, 240], [300, 232]]]) { x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); }
  /* one big eye, the residents' frontal eye */
  x.fillStyle = K.fig; x.beginPath(); x.ellipse(128, 182, 11.5, 9, 0, 0, TAU); x.fill(); x.lineWidth = 2.8; x.stroke();
  x.fillStyle = K.ink; x.beginPath(); x.arc(125.5, 182.5, 5, 0, TAU); x.fill();
  const cut = cutPaper(item, { margin: 6, sdx: 5, sdy: 7, seed: 9 });
  return { tile: onGround(g, cut), item: cut };
}

/* fisherman-beret: the game's traveller (CAST.trav1) drawn by drawFigure, wearing the game's beret in cobalt */
function storeBeret() {
  const s = 4.15, fc = cv(Math.ceil(CELL_W * s), Math.ceil(CELL_H * s)), fx = fc.getContext('2d'); fx.scale(s, s);
  const orig = window.hat;
  window.hat = function (x, kind, cx, cy, w, h, ink) {
    if (kind !== 'beret') return orig(x, kind, cx, cy, w, h, ink);
    x.fillStyle = K.cobalt; x.beginPath(); x.ellipse(cx + 3, cy - h * .42, w * .55, h * .16, -.15, 0, TAU); x.fill();   /* hat('beret'), recoloured */
  };
  try { drawFigure(fx, 0, 0, Object.assign({}, CAST.trav1, { hat: 'beret' }), 'front', 0, 'trav1'); } finally { window.hat = orig; }
  const item = cv(TS, TS), x = item.getContext('2d');
  x.drawImage(fc, Math.round(200 - (CELL_W / 2 + 1) * s), Math.round(54 - 13.6 * s));
  const cut = cutPaper(item, { margin: 0, sdx: 6, sdy: 8, grain: true });
  return { tile: onGround(pageGround(TS, TS), cut), item: cut };
}

/* sea-glass-tape: two strips of sea-glass green and blue washi crossed on the page */
function storeTape() {
  /* sea-glass green with viridian stripes, sea-glass blue with cobalt stripes (pale sea-glass sits on mint and lilac, so the glass is deep) */
  const g = pageGround(TS, TS), item = cv(TS, TS), x = item.getContext('2d'), R = RNG(77);
  const a = tapeStrip(300, 76, K.glassG, K.viridian, R, { stripe: 15 }), b = tapeStrip(262, 76, K.glassB, K.cobalt, R, { stripe: 15 });
  placeTape(x, a, 196, 196, -.12, .86);
  placeTape(x, b, 214, 238, .62, .86);
  return { tile: onGround(g, item), item };
}

/* deckle-edge: a print with a torn, deckled edge; the picture is a frame rendered by the game (the town from the pier at 19:48) */
function storeDeckle(img) {
  const R = RNG(55);
  const pc = deckle(printCard(img, 252, 178, { border: 24, bottom: 30 }), R, 6.5, 4);
  const rot = rotated(pc, -.06, 16), item = cv(TS, TS);
  centreOn(item, rot, 200, 222);
  const cut = cutPaper(item, { margin: 0, sdx: 5, sdy: 7 });
  return { tile: onGround(pageGround(TS, TS), cut), item: cut };
}

/* shell-stamp: a small rubber stamp and the oxblood scallop it presses */
function scallopPath(cx, cy, r, R, bumps = 9) {
  const pts = [];
  for (let i = 0; i <= bumps * 6; i++) { const t = i / (bumps * 6), a = PI + .18 + t * (PI - .36), bump = Math.abs(Math.sin(t * bumps * PI)) * r * .06; pts.push([cx + Math.cos(a) * (r + bump), cy + Math.sin(a) * (r + bump) * .92]); }
  pts.push([cx + r * .2, cy + r * .1], [cx + r * .38, cy + r * .12], [cx + r * .36, cy + r * .34], [cx - r * .36, cy + r * .34], [cx - r * .38, cy + r * .12], [cx - r * .2, cy + r * .1]);
  return pts;
}
function stampedShell(w, h, cx, cy, r, R, col = K.oxblood) {
  const c = cv(w, h), x = ctx2(c), bumps = 9;
  x.fillStyle = col; x.fill(pathOf(scallopPath(cx, cy, r, R, bumps)));
  x.globalCompositeOperation = 'destination-out';
  /* ribs: the paper shows between them */
  x.strokeStyle = '#000'; x.lineWidth = r * .07;
  for (let i = 1; i < bumps; i++) { const a = PI + .18 + i / bumps * (PI - .36); x.beginPath(); x.moveTo(cx + Math.cos(a) * r * .2, cy - r * .02 + Math.sin(a) * r * .14); x.lineTo(cx + Math.cos(a) * r * .86, cy + Math.sin(a) * r * .8); x.stroke(); }
  x.lineWidth = r * .06; x.beginPath(); x.moveTo(cx - r * .3, cy + r * .12); x.lineTo(cx + r * .3, cy + r * .12); x.stroke();
  /* rubber-stamp ink: a few clean misses where the rubber did not touch, more of them on one side */
  x.fillStyle = '#000';
  for (let i = 0; i < 46; i++) { const px = cx + R.r(-r, r), py = cy + R.r(-r * .95, r * .3), k = (px - cx) / r; if (R.f() < .35 + .45 * Math.max(0, k)) { x.beginPath(); x.ellipse(px, py, R.r(1.5, 4.5), R.r(1, 2.2), R.r(0, PI), 0, TAU); x.fill(); } }
  x.globalCompositeOperation = 'source-over';
  return c;
}
function storeStamp() {
  const g = pageGround(TS, TS), R = RNG(88);
  const print = stampedShell(TS, TS, 284, 268, 74, R);
  g.getContext('2d').drawImage(print, 0, 0);
  const item = cv(TS, TS), x = ctx2(item), P = RNG(12);
  x.save(); x.translate(124, 262);
  /* the block: rubber below, a wooden block seen from above and in front, a turned neck and a round knob */
  const bw = 70, bh = 46, dx = 22, dy = -18;
  const rubber = pathOf([[-bw + 5, bh], [bw - 5, bh], [bw - 6, bh + 12], [-bw + 6, bh + 12]]);
  const front = pathOf([[-bw, 0], [bw, 0], [bw, bh], [-bw, bh]]);
  const top = pathOf([[-bw, 0], [-bw + dx, dy], [bw + dx, dy], [bw, 0]]);
  const side = pathOf([[bw, 0], [bw + dx, dy], [bw + dx, bh + dy], [bw, bh]]);
  const nx = dx / 2, ny = dy / 2;
  const neck = pathOf([[nx - 17, ny + 2], [nx - 12, ny - 34], [nx - 18, ny - 44], [nx + 18, ny - 44], [nx + 12, ny - 34], [nx + 17, ny + 2]]);
  const knob = pathOf(ellPts(nx, ny - 76, 44, 38, 0, 56));
  x.fillStyle = K.oxblood; x.fill(rubber);
  x.fillStyle = K.wood; x.fill(front); x.fill(side); plane(x, side, c => c.rect(bw - 2, dy - 4, dx + 8, bh + 30), 'rgba(30,20,60,.3)');
  x.fillStyle = K.woodL; x.fill(top);
  x.fillStyle = K.wood; x.fill(neck); plane(x, neck, c => c.rect(nx + 2, ny - 50, 30, 60));
  x.fillStyle = K.woodL; x.fill(knob); plane(x, knob, c => { c.moveTo(nx + 6, ny - 120); for (let i = 0; i <= 8; i++) { const t = i / 8; c.lineTo(nx + 6 + Math.sin(t * 6) * 4, ny - 120 + t * 90); } c.lineTo(nx + 60, ny - 30); c.lineTo(nx + 60, ny - 120); c.closePath(); }, 'rgba(30,20,60,.22)');
  /* the wood's grain, in pencil */
  x.strokeStyle = 'rgba(29,26,51,.35)'; x.lineWidth = 2.2;
  for (const yy of [14, 30]) { x.beginPath(); x.moveTo(-bw + 8, yy); x.bezierCurveTo(-30, yy - 5, 20, yy + 6, bw - 8, yy - 2); x.stroke(); }
  /* the label on the knob: the shell it prints */
  x.fillStyle = K.fig; x.beginPath(); x.ellipse(nx - 10, ny - 90, 17, 13, -.2, 0, TAU); x.fill();
  x.fillStyle = K.oxblood; x.fill(pathOf(scallopPath(nx - 10, ny - 86, 11, R, 7)));
  for (const p of [rubber, front, top, side, neck, knob]) pencilPath(x, p, P, 3.6, 1);
  x.restore();
  const cut = cutPaper(item, { margin: 6, sdx: 6, sdy: 7, seed: 3 });
  const both = cv(TS, TS); both.getContext('2d').drawImage(print, 0, 0); both.getContext('2d').drawImage(cut, 0, 0);
  return { tile: onGround(g, cut), item: both };
}

/* =====================================================================
   THE SKETCHBOOK PASS: its tile (400 x 400)
   ===================================================================== */
function passTile(img) {
  const g = pageGround(TS, TS), item = cv(TS, TS), x = ctx2(item), R = RNG(500), P = RNG(501);
  x.save(); x.translate(200, 226); x.rotate(-.05);
  const W = 236, H = 270;
  /* the page block under the cover, with its edges showing */
  const pages = pathOf([[-W / 2 + 8, -H / 2 + 10], [W / 2 + 10, -H / 2 + 12], [W / 2 + 12, H / 2 + 12], [-W / 2 + 10, H / 2 + 12]]);
  x.fillStyle = '#f6efe0'; x.fill(pages);
  x.strokeStyle = 'rgba(29,26,51,.28)'; x.lineWidth = 1.6;
  for (let k = 3; k < 12; k += 3) { x.beginPath(); x.moveTo(W / 2 + k - 1, -H / 2 + 14); x.lineTo(W / 2 + k - 1, H / 2 + k); x.lineTo(-W / 2 + 12, H / 2 + k); x.stroke(); }
  /* the tabs down the side (the sketchbook's index tabs), in the game's own tab shape */
  const tabs = [[-60, K.pink], [-4, K.paper], [52, K.duskV]];
  for (const [ty, col] of tabs) { const t = pathOf([[W / 2, ty - 22], [W / 2 + 26, ty - 20], [W / 2 + 30, ty - 12], [W / 2 + 30, ty + 14], [W / 2 + 26, ty + 22], [W / 2, ty + 22]]); x.fillStyle = col; x.fill(t); plane(x, t, c => c.rect(W / 2 + 16, ty - 30, 30, 60)); pencilPath(x, t, P, 3, .8); }
  pencilPath(x, pages, P, 3, .8);
  /* the cover: cobalt gouache in three hard values */
  const cover = pathOf([[-W / 2, -H / 2], [W / 2, -H / 2], [W / 2, H / 2], [-W / 2, H / 2]]);
  x.save(); x.clip(cover); x.fillStyle = K.cobalt; x.fillRect(-W, -H, 2 * W, 2 * H);
  gouacheStrokes(x, R, 220, [K.cobalt, K.cobaltM, K.cobaltD], [-W / 2 - 40, -H / 2 - 20, W / 2 + 40, H / 2 + 20], [9, 22], [70, 170]);
  x.fillStyle = SHADE; x.beginPath(); x.moveTo(W * .18, -H); x.lineTo(W, -H); x.lineTo(W, H); x.lineTo(W * .26, H); x.closePath(); x.fill();
  x.restore();
  pencilPath(x, cover, P, 3.6, .9);
  /* a print taped to the cover: a sunset, the pass's step (a frame rendered by the game) */
  const pr = printCard(img, 150, 104, { border: 10, bottom: 15 });
  x.save(); x.translate(-2, -14); x.rotate(.07);
  x.fillStyle = CUT; x.fillRect(-pr.width / 2 + 4, -pr.height / 2 + 6, pr.width, pr.height);
  x.drawImage(pr, -pr.width / 2, -pr.height / 2);
  x.restore();
  const tp = tapeStrip(84, 24, K.cobalt, K.paper, R, { stripe: 4, period: 15 });
  placeTape(x, tp, -4, -80, -.06, .9);
  /* a blank paper label, room for the pass's name (lettering left to the lead: the sandbox lacks the game's fonts) */
  const lab = pathOf([[-76, 70], [78, 68], [80, 108], [-74, 110]]);
  x.fillStyle = K.paper; x.fill(lab); pencilPath(x, lab, P, 3, .7);
  /* the spiral binding along the top (style.css #book .rings) */
  for (let i = 0; i < 9; i++) {
    const rx = -W / 2 + 22 + i * (W - 44) / 8;
    x.fillStyle = K.slate; x.beginPath(); x.arc(rx, -H / 2 + 14, 5.5, 0, TAU); x.fill();
    x.strokeStyle = K.ink; x.lineWidth = 6.5; x.beginPath(); x.ellipse(rx, -H / 2 + 1, 6, 15, 0, PI * 1.05, PI * 2.6); x.stroke();
    x.strokeStyle = K.mortar; x.lineWidth = 3.4; x.beginPath(); x.ellipse(rx, -H / 2 + 1, 6, 15, 0, PI * 1.05, PI * 2.6); x.stroke();
  }
  x.restore();
  const cut = cutPaper(item, { margin: 0, sdx: 6, sdy: 8 });
  return { tile: onGround(g, cut), item: cut };
}

/* =====================================================================
   PASS ROW GROUNDS (306 x 243)
   ===================================================================== */
const RW = 306, RH = 243;
function groundFree() { return pageGround(RW, RH, { gap: 27, ruleA: .11, ruleW: 1.6, y0: 18 }); }
function groundPass() { return gouacheGround(RW, RH, K.cobalt, [K.cobalt, K.cobaltM, K.cobaltD], 611); }
function groundBug() { return trencadis(RW, RH, [K.night, K.night2, '#16357c', '#22305e', K.vsea, '#25407e'], '#3f4462', 733, 11); }

/* =====================================================================
   PASS REWARDS (306 x 243, the item centred in the 243 square, transparent)
   ===================================================================== */
function rewardCanvas(draw, o = {}) {
  const item = cv(RW, RH), x = ctx2(item); x.save(); x.translate(RW / 2, RH / 2); draw(x); x.restore();
  return o.cut === false ? item : cutPaper(item, Object.assign({ margin: 6, sdx: 4, sdy: 6 }, o));
}

/* tape-plum: a roll of plum washi with a strip pulled out */
function rTapePlum() {
  const R = RNG(901), P = RNG(902);
  const item = cv(RW, RH), x = ctx2(item); x.translate(RW / 2, RH / 2);
  const strip = tapeStrip(150, 44, K.plum, K.plumL, R, { stripe: 13 });
  /* the strip, pulled out and lying flat */
  placeTape(x, strip, 28, 50, .32, .88, false);
  /* the roll: an edge of wound tape, a face, the card core */
  const ox = -30, oy = -14, rO = 74, rI = 46, th = 22;
  const rim = pathOf([...ellPts(ox, oy, rO, rO * .62, -.25, 40, 0, PI), ...ellPts(ox, oy + th, rO, rO * .62, -.25, 40, PI, 0)]);
  x.fillStyle = K.plum; x.fill(rim); plane(x, rim, c => c.rect(ox, oy - 100, 120, 220), 'rgba(30,20,60,.28)');
  x.strokeStyle = 'rgba(251,248,240,.35)'; x.lineWidth = 1.4;
  for (let k = 5; k < th; k += 5) { x.beginPath(); ellPts(ox, oy + k, rO - 1, rO * .62 - 1, -.25, 40, .15, PI - .15).forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.stroke(); }
  const face = pathOf(ellPts(ox, oy, rO, rO * .62, -.25, 60));
  x.fillStyle = K.plum; x.fill(face);
  x.save(); x.clip(face); x.fillStyle = K.plumL; const st = 12; for (let k = -200; k < 200; k += 2 * st) { x.beginPath(); x.moveTo(k, -120); x.lineTo(k + st, -120); x.lineTo(k + st + 240, 120); x.lineTo(k + 240, 120); x.closePath(); x.fill(); } x.restore();
  x.strokeStyle = 'rgba(29,26,51,.3)'; x.lineWidth = 1.6; for (let r = rI + 7; r < rO; r += 7) { x.beginPath(); ellPts(ox, oy, r, r * .62, -.25, 50).forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.stroke(); }
  const core = pathOf(ellPts(ox, oy, rI, rI * .62, -.25, 50));
  x.fillStyle = '#e6dfcf'; x.fill(core);
  const hole = pathOf(ellPts(ox, oy + 3, rI - 9, (rI - 9) * .62, -.25, 50));
  for (const p of [rim, face, core]) pencilPath(x, p, P, 3.2, .9);
  x.save(); x.globalCompositeOperation = 'destination-out'; x.fill(hole); x.restore();
  pencilPath(x, hole, P, 2.6, .6);
  return cutPaper(item, { margin: 6, sdx: 4, sdy: 6, seed: 4 });
}

/* sticker-black-egg: a black egg like the ones on the town's roofs, as a sticker with one edge lifting off */
function eggPts(cx, cy, rx, ry) { const o = []; for (let i = 0; i <= 72; i++) { const a = i / 72 * TAU, sn = Math.sin(a); o.push([cx + Math.cos(a) * rx * (1 + .13 * sn), cy + sn * ry]); } return o; }
function rEggPeel() {
  const P = RNG(911);
  const item = cv(RW, RH), x = ctx2(item); x.translate(RW / 2, RH / 2 + 2);
  const egg = pathOf(eggPts(0, 0, 60, 84));
  x.fillStyle = K.black; x.fill(egg);
  plane(x, egg, c => { c.moveTo(8, -100); for (let i = 0; i <= 8; i++) { const t = i / 8; c.lineTo(8 + Math.sin(t * 6) * 5, -100 + t * 200); } c.lineTo(90, 100); c.lineTo(90, -100); c.closePath(); }, 'rgba(75,79,143,.34)');
  x.fillStyle = K.duskV; x.beginPath(); x.ellipse(-27, -38, 9, 22, .42, 0, TAU); x.fill();
  x.fillStyle = K.fig; x.beginPath(); x.ellipse(-31, -52, 4, 6, .42, 0, TAU); x.fill();
  pencilPath(x, egg, P, 3.4, .9);
  const st = cutPaper(item, { margin: 14, shadow: false, grain: false, seed: 21 });
  /* lift the sticker's lower-right edge: cut it off along a chord and fold it back over, showing the backing */
  const W = RW, H = RH, px = W / 2 + 47, py = H / 2 + 74, th = -.7;   /* chord through (px,py), angle th */
  const nx = -Math.sin(th), ny = Math.cos(th);                          /* normal pointing to the lower right */
  const half = c => { c.beginPath(); const L = 400; c.moveTo(px - Math.cos(th) * L, py - Math.sin(th) * L); c.lineTo(px + Math.cos(th) * L, py + Math.sin(th) * L); c.lineTo(px + Math.cos(th) * L + nx * L, py + Math.sin(th) * L + ny * L); c.lineTo(px - Math.cos(th) * L + nx * L, py - Math.sin(th) * L + ny * L); c.closePath(); };
  const flap = cv(W, H), fx = flap.getContext('2d');
  fx.save(); half(fx); fx.clip(); fx.drawImage(silhouette(st), 0, 0); fx.restore();
  fx.globalCompositeOperation = 'source-in'; fx.fillStyle = '#e6dfcf'; fx.fillRect(0, 0, W, H);
  const sx = st.getContext('2d'); sx.save(); half(sx); sx.globalCompositeOperation = 'destination-out'; sx.fill(); sx.restore();
  const reflect = c => { c.translate(px, py); c.rotate(th); c.scale(1, -1); c.rotate(-th); c.translate(-px, -py); };
  const out = cv(W, H), ox = out.getContext('2d');
  /* the hard shadows: under the sticker, and under the lifted flap */
  ox.save(); ox.globalAlpha = 1; const sh = silhouette(st), shx = sh.getContext('2d'); shx.globalCompositeOperation = 'source-in'; shx.fillStyle = CUT; shx.fillRect(0, 0, W, H); ox.drawImage(sh, 4, 6); ox.restore();
  ox.drawImage(st, 0, 0);
  ox.save(); reflect(ox); const fs = silhouette(flap), fsx = fs.getContext('2d'); fsx.globalCompositeOperation = 'source-in'; fsx.fillStyle = 'rgba(29,26,51,.3)'; fsx.fillRect(0, 0, W, H); ox.drawImage(fs, -3, 5); ox.drawImage(flap, 0, 0); ox.restore();
  const fl = cv(W, H), flx = fl.getContext('2d'); flx.save(); reflect(flx); flx.drawImage(flap, 0, 0); flx.restore();
  const PP = RNG(5); ox.save(); ox.strokeStyle = 'rgba(29,26,51,.55)'; ox.lineWidth = 2; ox.beginPath(); ox.moveTo(px - Math.cos(th) * 70, py - Math.sin(th) * 70); ox.lineTo(px + Math.cos(th) * 70, py + Math.sin(th) * 70); ox.globalCompositeOperation = 'source-atop'; ox.stroke(); ox.restore();
  grainOver(out, .9);
  return out;
}

/* postcard-stamp-lighthouse: a perforated postage stamp, the lighthouse on legs over the sea at sunset */
function rStamp() {
  const P = RNG(921), R = RNG(922);
  const W = 150, H = 186, item = cv(RW, RH), x = ctx2(item); x.translate(RW / 2, RH / 2); x.rotate(-.06);
  /* paper with perforations */
  x.fillStyle = K.tile; x.fillRect(-W / 2, -H / 2, W, H);
  x.save(); x.globalCompositeOperation = 'destination-out';
  const pr = 6.2, step = 15.5;
  for (let t = -W / 2; t <= W / 2 + .1; t += W / Math.round(W / step)) for (const y of [-H / 2, H / 2]) { x.beginPath(); x.arc(t, y, pr, 0, TAU); x.fill(); }
  for (let t = -H / 2; t <= H / 2 + .1; t += H / Math.round(H / step)) for (const xx of [-W / 2, W / 2]) { x.beginPath(); x.arc(xx, t, pr, 0, TAU); x.fill(); }
  x.restore();
  /* the picture */
  const pw = W - 34, ph = H - 34, px = -pw / 2, py = -ph / 2;
  x.save(); x.beginPath(); x.rect(px, py, pw, ph); x.clip();
  const sky = x.createLinearGradient(0, py, 0, py + ph * .66); sky.addColorStop(0, K.night2); sky.addColorStop(.55, K.dusk); sky.addColorStop(1, K.duskV);
  x.fillStyle = sky; x.fillRect(px, py, pw, ph);
  const hz = py + ph * .66;
  x.fillStyle = K.paper; x.beginPath(); x.arc(0, hz - 2, 34, PI, TAU); x.fill();     /* the sun, just on the sea, behind the legs */
  x.fillStyle = K.night; x.fillRect(px, hz, pw, ph);
  x.strokeStyle = 'rgba(243,234,215,.75)'; x.lineWidth = 2.4; for (let k = 0; k < 5; k++) { const yy = hz + 6 + k * 7, ww = 22 - k * 3; x.beginPath(); x.moveTo(-ww, yy); x.lineTo(ww, yy); x.stroke(); }
  /* the lighthouse on legs (as the map draws it: curved legs, a white body with a red band, a cap) */
  x.strokeStyle = K.iron; x.lineWidth = 4;
  for (const s of [-1, -.35, .35, 1]) { x.beginPath(); x.moveTo(s * 7, -12); x.quadraticCurveTo(s * 30, 10, s * 26, hz + 12); x.stroke(); }
  x.fillStyle = K.tile; x.fillRect(-11, -52, 22, 42); x.fillStyle = K.oxblood; x.fillRect(-11, -36, 22, 8);
  x.fillStyle = K.iron; x.fillRect(-14, -12, 28, 5); x.fillRect(-14, -56, 28, 5);
  x.fillStyle = K.oxblood; x.beginPath(); x.moveTo(-10, -56); x.lineTo(0, -70); x.lineTo(10, -56); x.closePath(); x.fill();
  x.restore();
  x.strokeStyle = K.ink; x.lineWidth = 2.4; x.strokeRect(px, py, pw, ph);
  /* the postmark: wavy cancellation lines, no words */
  x.save(); x.beginPath(); x.rect(-W / 2 + 4, -H / 2 + 4, W - 8, H - 8); x.clip();
  x.strokeStyle = 'rgba(29,26,51,.55)'; x.lineWidth = 2.6;
  for (let k = 0; k < 4; k++) { x.beginPath(); for (let t = 0; t <= 30; t++) { const xx = 18 + t * 3.4, yy = -66 + k * 11 + Math.sin(t * .55) * 4; t ? x.lineTo(xx, yy) : x.moveTo(xx, yy); } x.stroke(); }
  x.restore();
  return cutPaper(item, { margin: 0, sdx: 4, sdy: 6 });
}

/* chalk-steps: a paving stone of the town's dark stone, chalk footprints walking across it, and the chalk */
function rChalk() {
  const P = RNG(931), R = RNG(932);
  const item = cv(RW, RH), x = ctx2(item); x.translate(RW / 2, RH / 2);
  const slab = pathOf([[-100, -64], [-90, -76], [90, -80], [102, -68], [104, 62], [92, 74], [-92, 78], [-102, 66]]);
  x.fillStyle = K.vsea; x.fill(slab);
  plane(x, slab, c => { c.moveTo(36, -90); c.lineTo(120, -90); c.lineTo(120, 90); c.lineTo(48, 90); c.closePath(); }, 'rgba(30,20,60,.3)');
  pencilPath(x, slab, P, 3.4, 1);
  /* bare footprints in chalk, broken by the stone's tooth */
  const chalk = cv(RW, RH), cx = ctx2(chalk); cx.translate(RW / 2, RH / 2); cx.fillStyle = K.tile;
  const foot = (fx, fy, a, s) => { cx.save(); cx.translate(fx, fy); cx.rotate(a); cx.scale(s, 1);
    cx.beginPath(); cx.moveTo(0, -18); cx.bezierCurveTo(11, -19, 13, -6, 10, 4); cx.bezierCurveTo(8, 12, 9, 18, 6, 24); cx.bezierCurveTo(2, 31, -9, 30, -10, 21); cx.bezierCurveTo(-11, 12, -5, 8, -7, 0); cx.bezierCurveTo(-9, -9, -8, -18, 0, -18); cx.fill();
    for (const [tx, ty, tr] of [[-5, -26, 4.6], [3, -28, 3.6], [9.5, -25.5, 3.1], [14, -21, 2.7], [16.5, -15.5, 2.3]]) { cx.beginPath(); cx.arc(tx, ty, tr, 0, TAU); cx.fill(); }
    cx.restore(); };
  for (const [fx, fy, s] of [[-70, 36, -1], [-36, 6, 1], [-2, 16, -1], [32, -20, 1], [64, -8, -1]]) foot(fx + s * 8, fy, .98, s * 1.05);
  cx.globalCompositeOperation = 'destination-out'; cx.fillStyle = '#000';
  for (let i = 0; i < 520; i++) { cx.beginPath(); cx.ellipse(R.r(-110, 110), R.r(-90, 90), R.r(.7, 2), R.r(.5, 1.2), R.r(0, PI), 0, TAU); cx.fill(); }
  x.drawImage(chalk, -RW / 2, -RH / 2);
  /* the stick of chalk */
  x.save(); x.translate(58, 56); x.rotate(-.42);
  const stick = pathOf([[-32, -9], [26, -9], [32, -4], [32, 4], [26, 9], [-32, 9]]);
  x.fillStyle = K.tile; x.fill(stick); plane(x, stick, c => c.rect(-40, 1, 80, 12)); pencilPath(x, stick, P, 3, .6);
  x.restore();
  return cutPaper(item, { margin: 6, sdx: 4, sdy: 6, seed: 7 });
}

/* paper-gull: a paper gull gliding, cut out like the residents: long wings with the game's bird curve, grey mantle, ink tips */
function rGull() {
  const P = RNG(941);
  return rewardCanvas(x => {
    x.translate(-9, 14); x.scale(.92, .92);
    const far = pathOf([[6, -12], ...quad([6, -12], [40, -44], [118, -72]), [110, -58], [100, -50], ...quad([90, -42], [60, -20], [34, -6])]);
    const near = pathOf([[-22, -8], ...quad([-22, -8], [0, -64], [64, -112]), [62, -94], [54, -82], [48, -70], ...quad([44, -58], [34, -20], [22, 2])]);
    const body = pathOf([...bez([-62, -14], [-40, -30], [20, -22], [58, -2]), [104, -2], [108, 6], [100, 12], [58, 14], ...bez([58, 14], [20, 30], [-40, 26], [-62, 4])]);
    const head = pathOf(ellPts(-62, -6, 22, 20, 0, 40));
    const beak = pathOf([[-80, -8], [-108, -2], [-82, 4]]);
    x.fillStyle = K.grey; x.fill(far); plane(x, far, c => { c.moveTo(92, -100); c.lineTo(130, -100); c.lineTo(130, -30); c.lineTo(96, -40); c.closePath(); }, K.ink); pencilPath(x, far, P, 3, .7);
    x.fillStyle = K.fig; x.fill(body); plane(x, body, c => { c.moveTo(-70, 6); c.quadraticCurveTo(10, 30, 110, 4); c.lineTo(110, 40); c.lineTo(-70, 40); c.closePath(); }); pencilPath(x, body, P, 3.2, .8);
    x.fillStyle = '#8e8b99'; x.fill(near);
    plane(x, near, c => { c.moveTo(40, -130); c.lineTo(90, -130); c.lineTo(90, -60); c.lineTo(46, -76); c.closePath(); }, K.ink);
    plane(x, near, c => { c.moveTo(-30, 10); c.quadraticCurveTo(30, -24, 70, -100); c.lineTo(80, -100); c.lineTo(80, 20); c.closePath(); }, K.fig);
    pencilPath(x, near, P, 3.2, .8);
    x.fillStyle = K.fig; x.fill(head); plane(x, head, c => { c.moveTo(-58, -30); for (let i = 0; i <= 8; i++) { const t = i / 8; c.lineTo(-58 + Math.sin(t * 6) * 2.5, -30 + t * 48); } c.lineTo(-30, 20); c.lineTo(-30, -30); c.closePath(); });
    pencilPath(x, head, P, 3.2, .7);
    x.fillStyle = K.mortar; x.fill(beak); pencilPath(x, beak, P, 2.6, .4);
    x.fillStyle = K.oxblood; x.beginPath(); x.arc(-96, 0, 2.8, 0, TAU); x.fill();
    /* one big eye */
    x.fillStyle = K.fig; x.strokeStyle = K.ink; x.lineWidth = 2.6; x.beginPath(); x.ellipse(-68, -10, 8.5, 6.5, 0, 0, TAU); x.fill(); x.stroke();
    x.fillStyle = K.ink; x.beginPath(); x.arc(-70, -9.5, 3.6, 0, TAU); x.fill();
    /* tucked feet */
    x.strokeStyle = K.ink; x.lineWidth = 3; x.beginPath(); x.moveTo(18, 20); x.lineTo(30, 30); x.moveTo(26, 18); x.lineTo(38, 28); x.stroke();
  }, { margin: 6, sdx: 4, sdy: 7, seed: 13 });
}

/* sailor-stripes: a striped top for the traveller, as a paper-doll cut-out with fold tabs; body shape and stripes from drawFigure/pattern */
function rStripes() {
  const P = RNG(951), R = RNG(952);
  return rewardCanvas(x => {
    x.translate(0, -9); x.scale(.95, .95);
    const s = 2.15, cx = 0;                       /* drawFigure's torso for a 'tall' build, scaled up */
    const shW = 30 * .95 * s, waistW = 22 * .95 * s, shY = -66, waistY = shY + 88 * s * .92, armW = 6.5 * s;
    const tabsP = [];
    for (const sd of [-1, 1]) tabsP.push(pathOf([[sd * (shW - 18), shY - 2], [sd * (shW - 18), shY - 20], [sd * (shW - 4), shY - 22], [sd * (shW + 2), shY - 2]]), pathOf([[sd * (waistW + 2), waistY - 30], [sd * (waistW + 20), waistY - 28], [sd * (waistW + 20), waistY - 8], [sd * (waistW + 1), waistY - 6]]));
    for (const t of tabsP) { x.fillStyle = K.fig; x.fill(t); pencilPath(x, t, P, 2.4, .5); }
    const torso = [[cx - shW, shY], [cx + shW, shY], [cx + waistW, waistY], [cx - waistW, waistY]];
    const arms = [];
    for (const sd of [-1, 1]) { const s0 = [cx + sd * (shW - 3), shY + 4], hand = [cx + sd * (shW + 16), shY + 96]; arms.push([[s0[0] - armW, s0[1]], [s0[0] + armW, s0[1]], [hand[0] + armW * .8, hand[1]], [hand[0] - armW * .8, hand[1]]]); }
    const sp = { topPat2: K.navy };
    for (const pts of [...arms, torso]) {
      const p = pathOf(pts); x.fillStyle = '#fbf6ea'; x.fill(p);
      x.save(); x.clip(p); x.scale(s / 1.4, s / 1.4); pattern(x, 'stripes', sp, pts.map(q => [q[0] / (s / 1.4), q[1] / (s / 1.4)]), R); x.restore();
      plane(x, p, c => { c.moveTo(cx + 2, -140); c.lineTo(cx + 140, -140); c.lineTo(cx + 140, 140); c.lineTo(cx + 10, 140); c.closePath(); });
      pencilPts(x, pts, P, 3.2, 1);
    }
    /* the boat neck */
    x.fillStyle = K.fig; x.beginPath(); x.moveTo(-26, shY - .5); x.quadraticCurveTo(0, shY + 16, 26, shY - .5); x.closePath(); x.fill();
    x.strokeStyle = K.ink; x.lineWidth = 3; x.beginPath(); x.moveTo(-26, shY); x.quadraticCurveTo(0, shY + 16, 26, shY); x.stroke();
    /* fold lines on the tabs */
    x.setLineDash([5, 5]); x.lineWidth = 2; x.strokeStyle = 'rgba(29,26,51,.6)';
    for (const sd of [-1, 1]) { x.beginPath(); x.moveTo(sd * (shW - 18), shY - 1); x.lineTo(sd * (shW + 1), shY - 1); x.stroke(); x.beginPath(); x.moveTo(sd * (waistW + 2), waistY - 30); x.lineTo(sd * (waistW + 1), waistY - 6); x.stroke(); }
    x.setLineDash([]);
  }, { margin: 6, sdx: 4, sdy: 6, seed: 17 });
}

/* paper-lantern: a paper lantern on a stick, lit from inside, a cobalt shell spiral painted on it */
function rLantern() {
  const P = RNG(961);
  const shell = new Path2D(document.querySelector('#i-shell path').getAttribute('d'));
  return rewardCanvas(x => {
    x.translate(-2, -2); x.scale(.92, .92);
    /* the stick and the wire */
    x.strokeStyle = K.ink; x.lineWidth = 9; x.beginPath(); x.moveTo(-96, -104); x.lineTo(-8, -80); x.stroke();
    x.strokeStyle = K.wood; x.lineWidth = 5.5; x.beginPath(); x.moveTo(-96, -104); x.lineTo(-8, -80); x.stroke();
    x.strokeStyle = K.ink; x.lineWidth = 2.6; x.beginPath(); x.moveTo(-6, -80); x.lineTo(0, -66); x.stroke();
    /* the paper globe */
    const glob = pathOf(ellPts(0, 6, 72, 66, 0, 64));
    const lit = x.createRadialGradient(-6, 0, 6, 0, 6, 76); lit.addColorStop(0, K.print); lit.addColorStop(.55, K.tile); lit.addColorStop(1, K.paper);
    x.fillStyle = lit; x.fill(glob);
    plane(x, glob, c => { c.moveTo(26, -70); c.quadraticCurveTo(48, 6, 26, 80); c.lineTo(90, 80); c.lineTo(90, -70); c.closePath(); }, 'rgba(30,20,60,.12)');
    /* the folds of the paper */
    x.save(); x.clip(glob); x.strokeStyle = 'rgba(29,26,51,.28)'; x.lineWidth = 2;
    for (let k = -4; k <= 4; k++) { const yy = 6 + k * 14; x.beginPath(); x.ellipse(0, yy, 72 * Math.sqrt(1 - (k * 14 / 66) ** 2), 6, 0, 0, PI); x.stroke(); }
    x.restore();
    /* the shell, the game's own spiral (#i-shell), painted on in cobalt */
    x.save(); x.translate(-30, -26); x.scale(.62, .62); x.strokeStyle = K.ink; x.lineWidth = 14; x.stroke(shell); x.strokeStyle = K.cobalt; x.lineWidth = 8; x.stroke(shell); x.restore();
    pencilPath(x, glob, P, 3.4, .9);
    /* cap and base rings */
    for (const [yy, w] of [[-62, 30], [70, 34]]) { const r = pathOf([[-w, yy - 6], [w, yy - 6], [w - 3, yy + 6], [-w + 3, yy + 6]]); x.fillStyle = K.oxblood; x.fill(r); pencilPath(x, r, P, 2.6, .5); }
    /* a little tassel */
    x.strokeStyle = K.oxblood; x.lineWidth = 3; for (const dx of [-4, 0, 4]) { x.beginPath(); x.moveTo(0, 76); x.lineTo(dx * 1.6, 98); x.stroke(); }
  }, { margin: 6, sdx: 4, sdy: 6, seed: 19 });
}

/* tidemark-border: a print with a sea-blue watercolour edge, dried to a darker tidemark (picture rendered by the game) */
function rTidemark(img) {
  const R = RNG(971);
  const pw = 150, ph = 108, b = 18;
  const pc = printCard(img, pw, ph, { border: b, bottom: b * 1.3, zoom: 1.3, sx: -.1, sy: .02 });
  const x = ctx2(pc), W = pc.width, H = pc.height;
  /* the wash: a frame of teal pigment pooling to a tidemark on its outer edge */
  const ring = (inset, wob) => { const pts = []; const side = (x0, y0, x1, y1) => { const L = Math.hypot(x1 - x0, y1 - y0), n = Math.round(L / 6); for (let i = 0; i < n; i++) { const t = i / n; pts.push([x0 + (x1 - x0) * t + R.r(-wob, wob), y0 + (y1 - y0) * t + R.r(-wob, wob)]); } }; side(inset, inset, W - inset, inset); side(W - inset, inset, W - inset, H - inset); side(W - inset, H - inset, inset, H - inset); side(inset, H - inset, inset, inset); return pts; };
  const outer = ring(4, 1.6), inner = ring(b + 1, 2.2);
  const band = new Path2D(); band.addPath(pathOf(outer)); band.addPath(pathOf(inner));
  x.save(); x.globalAlpha = .78; x.fillStyle = K.teal; x.fill(band, 'evenodd'); x.restore();
  x.save(); x.clip(band, 'evenodd'); x.globalAlpha = .55; x.strokeStyle = K.tealD; x.lineWidth = 4; x.stroke(pathOf(outer)); x.lineWidth = 2; x.globalAlpha = .4; x.stroke(pathOf(inner));
  for (let i = 0; i < 40; i++) { x.globalAlpha = R.r(.06, .16); x.fillStyle = K.tealD; x.beginPath(); x.arc(R.r(0, W), R.r(0, H), R.r(3, 9), 0, TAU); x.fill(); }
  x.restore();
  const item = cv(RW, RH); centreOn(item, rotated(pc, .05, 10), RW / 2, RH / 2);
  return cutPaper(item, { margin: 0, sdx: 4, sdy: 6 });
}

/* keeper-cap: Tomas's lighthouse-keeper's cap (the game's 'cap': a navy crown and a peak), its badge the lighthouse on legs */
function rCap() {
  const P = RNG(981);
  return rewardCanvas(x => {
    x.translate(0, 8);
    const crown = pathOf([...ellPts(0, -14, 92, 46, 0, 40, PI, TAU), [84, 2], [70, 30], [-70, 30], [-84, 2]]);
    const band = pathOf([[-74, 6], [74, 6], [70, 34], [-70, 34]]);
    const peak = pathOf([...bez([-78, 30], [-50, 74], [50, 74], [78, 30]), ...bez([78, 30], [40, 46], [-40, 46], [-78, 30])]);
    x.fillStyle = K.navy; x.fill(crown); plane(x, crown, c => { c.moveTo(10, -80); c.quadraticCurveTo(26, -20, 18, 40); c.lineTo(120, 40); c.lineTo(120, -80); c.closePath(); }, 'rgba(30,20,60,.3)');
    x.fillStyle = K.iron; x.fill(band); plane(x, band, c => c.rect(16, 0, 80, 40), 'rgba(30,20,60,.3)');
    x.strokeStyle = 'rgba(251,248,240,.5)'; x.lineWidth = 2; x.setLineDash([5, 5]); x.beginPath(); x.moveTo(-70, 12); x.lineTo(70, 12); x.moveTo(-68, 28); x.lineTo(68, 28); x.stroke(); x.setLineDash([]);
    x.fillStyle = K.black; x.fill(peak);
    x.strokeStyle = 'rgba(125,111,152,.8)'; x.lineWidth = 4; x.beginPath(); x.moveTo(-44, 52); x.quadraticCurveTo(0, 64, 40, 54); x.stroke();
    for (const p of [crown, band, peak]) pencilPath(x, p, P, 3.4, .9);
    /* the badge: a paper oval with the lighthouse on legs */
    x.fillStyle = K.tile; x.beginPath(); x.ellipse(0, -14, 20, 24, 0, 0, TAU); x.fill(); x.strokeStyle = K.ink; x.lineWidth = 2.6; x.stroke();
    x.strokeStyle = K.iron; x.lineWidth = 2.6; for (const s of [-1, 1]) { x.beginPath(); x.moveTo(s * 3, -10); x.quadraticCurveTo(s * 12, -2, s * 11, 6); x.stroke(); }
    x.fillStyle = K.oxblood; x.fillRect(-5, -30, 10, 18); x.fillStyle = K.tile; x.fillRect(-5, -24, 10, 5);
  }, { margin: 6, sdx: 4, sdy: 6, seed: 23 });
}

/* =====================================================================
   MARKER (48 x 48): a small print hanging from one strip of tape (next), taped flat (held)
   ===================================================================== */
function markerPrint() {
  /* a print drawn for 48: white card, ink edge, an ink line round the picture, a sunset on the sea
     (cobalt sky, night sea, a paper sun); ink between colours so no edge blends toward lilac */
  const c = cv(30, 26), x = c.getContext('2d');
  x.fillStyle = K.ink; x.fillRect(0, 0, 30, 26);
  x.fillStyle = K.print; x.fillRect(1, 1, 28, 24);
  x.fillStyle = K.ink; x.fillRect(3, 3, 24, 19);
  x.fillStyle = K.cobalt; x.fillRect(4, 4, 22, 10);
  x.fillStyle = K.night; x.fillRect(4, 14, 22, 7);
  x.fillStyle = K.ink; x.fillRect(10, 10, 10, 4); x.fillRect(11, 9, 8, 1);
  x.fillStyle = K.paper; x.fillRect(11, 11, 8, 3); x.fillRect(12, 10, 6, 1);
  return c;
}
function markerTape(len) {
  /* washi in the sketchbook's tab pink (style.css #tabs) with plum stripes: light enough to read on the dark rail */
  const c = cv(len, 8), x = c.getContext('2d');
  x.fillStyle = K.pink; x.fillRect(0, 0, len, 8);
  x.fillStyle = K.plum; for (let k = -8; k < len; k += 5) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k + 1.6, 0); x.lineTo(k + 6.6, 8); x.lineTo(k + 5, 8); x.closePath(); x.fill(); }
  x.globalCompositeOperation = 'destination-out'; x.fillRect(0, 0, 1, 2); x.fillRect(0, 5, 1, 3); x.fillRect(len - 1, 2, 1, 3);
  return c;
}
function marker(pose) {
  const c = cv(48, 48), x = c.getContext('2d'), pr = markerPrint(), tp = markerTape(18);
  const shadow = fn => { x.save(); x.globalAlpha = .35; x.filter = 'brightness(0)'; fn(1, 1.5); x.restore(); };
  if (pose === 'held') {
    /* taped flat, the game's way: one strip across the top, the print square to the page */
    const dr = (ox, oy) => { x.save(); x.translate(24 + ox, 29 + oy); x.drawImage(pr, -15, -13); x.restore(); };
    shadow(dr); dr(0, 0);
    x.save(); x.translate(24, 16.5); x.rotate(-.07); x.globalAlpha = .94; x.drawImage(tp, -9, -4); x.restore();
  } else {
    /* hanging from one strip at its top-left corner, swung toward the next cell */
    const dr = (ox, oy) => { x.save(); x.translate(13 + ox, 9 + oy); x.rotate(.42); x.drawImage(pr, -1.5, -1.5); x.restore(); };
    shadow(dr); dr(0, 0);
    x.save(); x.translate(12.5, 9); x.rotate(-.7); x.globalAlpha = .94; x.drawImage(tp, -9, -4); x.restore();
  }
  return c;
}

/* =====================================================================
   THE JOB
   ===================================================================== */
async function ART_JOB(job, renders) {
  const out = {}, put = (k, c) => { out[k] = url(c); };
  const img = {};
  for (const [k, v] of Object.entries(renders || {})) img[k] = await loadImg(v);
  const pic = n => img[n] || null;
  if (job === 'store' || job === 'all') {
    for (const [id, fn] of [['paper-dove', storeDove], ['fisherman-beret', storeBeret], ['sea-glass-tape', storeTape], ['deckle-edge', () => storeDeckle(pic('deckle_lh'))], ['shell-stamp', storeStamp]]) {
      const r = fn(); put('store/' + id, r.tile); put('layers/store-' + id + '-item', r.item);
    }
  }
  if (job === 'pass' || job === 'all') {
    const t = passTile(pic('pass_sunset')); put('pass/tile', t.tile); put('layers/pass-tile-item', t.item);
    const gr = { free: groundFree(), pass: groundPass(), bug: groundBug() };
    for (const [k, v] of Object.entries(gr)) put('pass/ground-' + k, v);
    const rw = [['tape-plum', 'free', rTapePlum], ['sticker-black-egg', 'free', rEggPeel], ['postcard-stamp-lighthouse', 'free', rStamp], ['chalk-steps', 'free', rChalk],
      ['paper-gull', 'pass', rGull], ['sailor-stripes', 'pass', rStripes], ['paper-lantern', 'pass', rLantern], ['tidemark-border', 'pass', () => rTidemark(pic('tide_court'))], ['keeper-cap', 'bug', rCap]];
    for (const [id, tier, fn] of rw) {
      const r = fn(); put('pass/' + id, r);
      for (const [k, g] of Object.entries(gr)) put(`previews/${id}-on-${k}`, onGround(g, r));
    }
    put('marker-next', marker('next')); put('marker-held', marker('held'));
  }
  if (job === 'owned' || job === 'all') {
    const held = cv(400, 400); drawTapedIn(held.getContext('2d'), 400, 400, 1); put('reward-held', held);
    for (const p of [0, .15, .3, .45, .6, .8, 1, .38, .42, .5]) { const f = cv(400, 400); drawTapedIn(f.getContext('2d'), 400, 400, p); put('frames/owned-' + p, f); }
  }
  return out;
}
