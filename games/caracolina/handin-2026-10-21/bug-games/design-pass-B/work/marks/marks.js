/* Caracolina small marks: the lighthouse on legs over the low sun.
   Canvas 2D in the game's palette, finished with the game's own paint.js textures
   (texBrush for the gouache value strokes, texPaper for the grain, combined the way shaders.js does it).
   Coordinates are in display pixels; the canvas is drawn at 2x (master). */
'use strict';
let PAL = {
  sky: '#a35d7a',    // dusk rose: the poster's upper sky (#91636f..#d8898c) as one flat ground (free)
  halo: '#e7a3a8',   // the sun's glow: the game's own rose (build.js C.rose), one hard step (free)
  sun: '#fbf1e4',    // pale sun, tile-white side of paper (free; lamp cream / sun cream are guarded)
  white: '#fbf8f1',  // tile white: the tower (free)
  shade: '#e7a3a8',  // the tower's shade side in evening light: the same rose (free)
  band: '#8e2a22',   // oxblood: the lighthouse red made free (lighthouse #c8342c is caution vs ember)
  bandS: '#6e2020',  // the band in shade (free)
  iron: '#1e2a3a',   // the legs, gallery, underside (the game's own lighthouse iron, free)
  ink: '#2a1a3c',    // coloured-pencil edge, the evening pencil (free)
  lamp: '#f3ead7',   // paper: the unlit lamp room (free)
  sea: '#2a55b8',    // cobalt, the game's own ink (free)
  glint: '#e06a9a'   // the sun's path on the water: the game's own pink (build.js C.pink); free flat and in every blend with cobalt
};
let _brushD = null, _paperD = null;
function texData() {
  if (!_brushD) { const b = texBrush(512); _brushD = b.getContext('2d').getImageData(0, 0, 512, 512).data; }
  if (!_paperD) { const p = texPaper(256); _paperD = p.getContext('2d').getImageData(0, 0, 256, 256).data; }
}
function mk(M) { const c = document.createElement('canvas'); c.width = c.height = M; return c; }
/* coloured pencil: the colour broken by the paper's tooth */
function tooth(x, col, s, seed = 91) {
  const N = 128, t = document.createElement('canvas'); t.width = t.height = N; const tx = t.getContext('2d'), id = tx.createImageData(N, N), R = RNG(seed);
  const [r, g, b] = hexRGB(col).map(v => v * 255);
  for (let i = 0; i < N * N; i++) { id.data[i * 4] = r; id.data[i * 4 + 1] = g; id.data[i * 4 + 2] = b; id.data[i * 4 + 3] = 255 * (.78 + .22 * Math.pow(R.f(), .45)); }
  tx.putImageData(id, 0, 0); const p = x.createPattern(t, 'repeat'); p.setTransform(new DOMMatrix().scale(1 / s)); return p;
}
function poly(x, pts) { x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); }
function circ(x, cx, cy, r) { x.beginPath(); x.arc(cx, cy, r, 0, TAU); }
function paintShape(x, s, path, fill, ew, ecol = PAL.ink) {
  path(); x.fillStyle = fill; x.fill();
  if (ew) { path(); x.lineJoin = 'round'; x.lineCap = 'round'; x.lineWidth = ew; x.strokeStyle = tooth(x, ecol, s); x.stroke(); }
}
/* the finish, as shaders.js does it: gouache value strokes (brush R) and paper grain c *= mix(1, paper*1.06, k) */
function finish(c, opt = {}) {
  texData();
  const x = c.getContext('2d'), M = c.width, id = x.getImageData(0, 0, M, M), d = id.data;
  const bv = opt.brush ?? .07, pk = opt.paper ?? .16, ox = opt.ox ?? 37, oy = opt.oy ?? 81, bs = opt.bscale ?? 1;
  for (let y = 0; y < M; y++) for (let X = 0; X < M; X++) {
    const o = (y * M + X) * 4;
    const bi = ((Math.floor((y * bs + oy)) % 512) * 512 + (Math.floor(X * bs + ox) % 512)) * 4;
    const pi = (((y + 13) % 256) * 256 + ((X + 29) % 256)) * 4;
    const v = 1 + (_brushD[bi] / 255 - .5) * bv;
    const p = 1 + ((_paperD[pi] / 255) * 1.06 - 1) * pk;
    for (let k = 0; k < 3; k++) d[o + k] = clamp(d[o + k] * v * p, 0, 255);
  }
  x.putImageData(id, 0, 0);
  return c;
}

/* ---------- the tower head, shared construction, every size drawn with its own numbers ---------- */
function head(x, s, g) {
  const { cx, top, w, h, bandY, bandH, shadeW, ew } = g;
  const L = cx - w / 2, R = cx + w / 2, tw = g.taper ?? .5, B = top + h;
  const body = () => poly(x, [[L + tw, top], [R - tw, top], [R, B], [L, B]]);
  // underside / hips (iron)
  if (g.under) paintShape(x, s, () => poly(x, [[L + .5, B - .5], [R - .5, B - .5], [R - 1.5, B + g.under], [L + 1.5, B + g.under]]), PAL.iron, ew);
  paintShape(x, s, body, PAL.white, 0);
  // shade side: a flat hard-edged second value, irregular edge
  x.save(); body(); x.clip();
  const sx = R - shadeW;
  poly(x, [[sx + .6, top - 1], [R + 2, top - 1], [R + 2, B + 1], [sx - .4, B + 1]]); x.fillStyle = PAL.shade; x.fill();
  // the red band
  poly(x, [[L - 2, bandY], [R + 2, bandY], [R + 2, bandY + bandH], [L - 2, bandY + bandH]]); x.fillStyle = PAL.band; x.fill();
  poly(x, [[sx + .6, bandY], [R + 2, bandY], [R + 2, bandY + bandH], [sx + .1, bandY + bandH]]); x.fillStyle = PAL.bandS; x.fill();
  x.restore();
  body(); x.lineWidth = ew; x.lineJoin = 'round'; x.strokeStyle = tooth(x, PAL.ink, s, 5); x.stroke();
  // lamp room
  if (g.lamp) { const [lw, lh] = g.lamp; paintShape(x, s, () => poly(x, [[cx - lw / 2, top - g.gal[1] - lh], [cx + lw / 2, top - g.gal[1] - lh], [cx + lw / 2, top - g.gal[1] + .2], [cx - lw / 2, top - g.gal[1] + .2]]), PAL.lamp, ew); }
  // gallery ring (iron)
  if (g.gal) { const [gw, gh] = g.gal; paintShape(x, s, () => poly(x, [[cx - gw / 2, top - gh], [cx + gw / 2, top - gh], [cx + gw / 2 - .6, top + .4], [cx - gw / 2 + .6, top + .4]]), PAL.iron, ew); }
  // cap
  const [cw, ch] = g.cap, cy = top - (g.gal ? g.gal[1] : 0) - (g.lamp ? g.lamp[1] : 0) + .3; // base width, height; sits on the lamp
  paintShape(x, s, () => poly(x, [[cx, cy - ch], [cx + cw / 2, cy], [cx - cw / 2, cy]]), PAL.band, ew);
  if (g.capShade) { x.save(); poly(x, [[cx, cy - ch], [cx + cw / 2, cy], [cx - cw / 2, cy]]); x.clip(); poly(x, [[cx + .3, cy - ch - 1], [cx + cw, cy - ch - 1], [cx + cw, cy + 1], [cx + cw * .18, cy + 1]]); x.fillStyle = PAL.bandS; x.fill(); x.restore(); paintShape(x, s, () => poly(x, [[cx, cy - ch], [cx + cw / 2, cy], [cx - cw / 2, cy]]), 'rgba(0,0,0,0)', ew); }
}

/* a leg as the game builds it: hip -> knee bowed outward, knee -> foot nearly straight, the knee a knob */
function leg3(x, s, l, ew) {
  const { h, k, f, w, bow = 0, knob } = l;
  const mx = (h[0] + k[0]) / 2, my = (h[1] + k[1]) / 2, dx = k[0] - h[0], dy = k[1] - h[1], n = Math.hypot(dx, dy);
  let px = dy / n, py = -dx / n; if (px * (k[0] - h[0]) < 0) { px = -px; py = -py; } // perpendicular, pointing outward
  if (Math.abs(dx) < .01) { px = 0; py = 0; }
  const ctl = [mx + px * bow, my + py * bow];
  const path = () => { x.beginPath(); x.moveTo(h[0], h[1]); x.quadraticCurveTo(ctl[0], ctl[1], k[0], k[1]); if (f) x.quadraticCurveTo(k[0] + (f[0] - k[0]) * .3 + (l.kick || 0), k[1] + (f[1] - k[1]) * .5, f[0], f[1]); };
  x.lineCap = 'round'; x.lineJoin = 'round';
  if (ew) { path(); x.lineWidth = w + ew * 2; x.strokeStyle = tooth(x, PAL.ink, s, 17); x.stroke(); }
  path(); x.lineWidth = w; x.strokeStyle = PAL.iron; x.stroke();
  if (knob) paintShape(x, s, () => circ(x, k[0], k[1], knob), PAL.iron, ew);
}
function legs(x, s, L, ew) { for (const l of L) leg3(x, s, l, ew); }
function ground(x, D, v) {
  x.fillStyle = PAL.sky; x.fillRect(0, 0, D, D);
  if (v.sea) { x.fillStyle = PAL.sea; x.fillRect(0, v.sea, D, D - v.sea); }
}
function sun(x, v) {
  const [cx, cy, r] = v.sun;
  if (v.halo) { circ(x, cx, cy, r + v.halo); x.fillStyle = PAL.halo; x.fill(); }
  circ(x, cx, cy, r); x.fillStyle = PAL.sun; x.fill();
}
/* a flat brush dab on the water: top and bottom on the pixel grid, ends cut on a slant like a loaded brush */
function dab(x, px, py, l, w, col) { const t = py - w / 2, b = py + w / 2; poly(x, [[px - l + .8, t], [px + l, t], [px + l - .8, b], [px - l, b]]); x.fillStyle = col; x.fill(); }
function seaOver(x, v) { // the sea covers the lower halo and sun; the sun's path in thick pale strokes
  if (!v.sea) return;
  x.fillStyle = PAL.sea; x.fillRect(0, v.sea, 200, 200);
  x.lineCap = 'butt';
  for (const [px, py, l, w, col] of v.path || []) dab(x, px, py, l, w, PAL[col || 'glint']);
}
function mirrorLegs(cx, half) { // half: legs on the left; mirror to the right about cx
  const m = p => [2 * cx - p[0], p[1]];
  return half.concat(half.map(l => ({ ...l, h: m(l.h), k: m(l.k), f: l.f && m(l.f), kick: -(l.kick || 0) })));
}
function drawMark(D, M, v) {
  if (v.pal) Object.assign(PAL, v.pal);
  const s = M / D, c = mk(M), x = c.getContext('2d'); x.scale(s, s);
  ground(x, D, v); sun(x, v); seaOver(x, v);
  if (v.ripples) for (const [px, py, l, w] of v.ripples) dab(x, px, py, l, w, PAL.glint);
  const L = mirrorLegs(v.head.cx, v.legs);
  // back legs first (the inner ones), then front
  legs(x, s, L.filter(l => l.back), v.legEw ?? v.head.ew * .7);
  legs(x, s, L.filter(l => !l.back), v.legEw ?? v.head.ew * .7);
  head(x, s, v.head);
  return finish(c, v.fin);
}
const DEF = {
  /* icon survivors: the head (cap, lamp, gallery, white body, one red band), four legs with knees, the sun with one glow step */
  icon: {
    sun: [23, 29.5, 12], halo: 3.5,
    head: { cx: 23, top: 13, w: 12, h: 11, taper: .5, bandY: 16, bandH: 4, shadeW: 3.6, ew: 1.1, under: 2, lamp: [6, 3], gal: [16, 2], cap: [11, 5.5], capShade: true },
    legs: [
      { h: [21.3, 25], k: [14, 38], f: [14.5, 48], w: 1.9, bow: 1, knob: 1.6, back: true },
      { h: [19.8, 25], k: [7, 36.5], f: [7.5, 48], w: 2.2, bow: 1.6, knob: 1.9 }]
  },
  /* emblem survivors: the head (cap, lamp, gallery, body, band), two legs, the sun */
  emblem: {
    sun: [15, 18.5, 10.5],
    head: { cx: 15, top: 9, w: 10, h: 8, taper: .4, bandY: 11, bandH: 3, shadeW: 2.6, ew: 1, under: 1, lamp: [6, 2], gal: [12, 2], cap: [9, 4] },
    legs: [{ h: [12.5, 17.5], k: [5, 26], f: [5, 31], w: 2.4, bow: 1.2 }]
  },
  /* chip: the icon's parts plus the feet standing in the cobalt sea, the sun's path on the water and the rings at the feet */
  chip: {
    sun: [32, 33, 13.5], halo: 5.5, sea: 50,
    path: [[32, 53, 8, 2], [32, 57, 6, 2], [32, 61, 4, 2]],
    head: { cx: 32, top: 15, w: 14, h: 12, taper: .6, bandY: 18, bandH: 4, shadeW: 4.2, ew: 1.2, under: 2, lamp: [8, 4], gal: [18, 2], cap: [12, 6], capShade: true },
    legs: [
      { h: [30.2, 28.3], k: [22.5, 44.5], f: [23, 57], w: 1.9, bow: 1.2, knob: 2.3, back: true },
      { h: [27.8, 28.3], k: [13.5, 43], f: [14, 59], w: 2.3, bow: 2, knob: 2.8 }],
    ripples: [[23, 57, 3, 2], [14, 59, 4, 2]]
  }
};
function merge(a, b) { if (!b) return a; const o = Array.isArray(a) ? a.slice() : { ...a }; for (const k in b) o[k] = (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k] && typeof a[k] === 'object' && !Array.isArray(a[k])) ? merge(a[k], b[k]) : b[k]; return o; }
const drawIcon = (M = 92, v = {}) => drawMark(46, M, merge(DEF.icon, v));
const drawEmblem = (M = 60, v = {}) => drawMark(30, M, merge(DEF.emblem, v));
const drawChip = (M = 128, v = {}) => { const g = merge(DEF.chip, v); g.ripples = (g.ripples || []).flatMap(r => [r, [2 * g.head.cx - r[0], r[1], r[2], r[3]]]); return drawMark(64, M, g); };
window.MARKS = { drawIcon, drawEmblem, drawChip, PAL, DEF };
