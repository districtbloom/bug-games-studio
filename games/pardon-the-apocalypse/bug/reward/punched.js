/* Pardon the Apocalypse · owned mark · "punched"
   A bus-transfer punch clips a round hole into the tile's lower-right corner and the paper chad drops out.
   Self-contained: no game code, no fonts, no network. Draws in the game's medium: hand-placed pixels on a
   100 x 100 grid (scaled up with no smoothing), a 1 px ink line #2a1c25, light and shade as Bayer dither,
   one light (Kindly's candy pink, from up-right). No gold, no glow, no platform colours.

   draw(ctx, w, h, t, opts?)  paints the overlay for time t (ms since the purchase) over a tile already drawn
                              at (0, 0, w, h) on ctx. Stateless in t: call it every frame after drawing the tile.
   DURATION                   850 ms. For t >= DURATION it paints the held frame (the hole) and nothing moves.
   drawHeld(ctx, w, h)        the held frame alone (same as draw(ctx, w, h, DURATION)).
   opts.src                   an image/canvas of the clean tile to cut the chad from (default: ctx.canvas,
                              sampled on the first frame). opts.sx, opts.sy: where the tile sits in src (px).
*/
const G = 100, DURATION = 850, INK = '#2a1c25';
const HOLE = { cx: 83.5, cy: 83.5, r: 12 };
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + .5) / 16);
const bay = (x, y) => BAYER[(y & 3) * 4 + (x & 3)];
const CHADS = new WeakMap();
let LAYER = null, BACK = null;

function layer() {
  if (!LAYER) { LAYER = document.createElement('canvas'); LAYER.width = LAYER.height = G; }
  const g = LAYER.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, G, G); g.imageSmoothingEnabled = false;
  return g;
}
const px = (g, x, y, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), 1, 1); };
const ease = u => 1 - Math.pow(1 - Math.min(1, Math.max(0, u)), 3);
const clamp01 = u => Math.min(1, Math.max(0, u));

/* the hole, as it stays: crushed paper round it, the ink edge, the cut face catching the light on its lower-left,
   and the dark card underneath with the tile's own shadow falling into it */
function paintHole(g, press = 1, open = true) {
  const { cx, cy, r } = HOLE, lx = Math.SQRT1_2, ly = -Math.SQRT1_2; // toward the light: up-right
  for (let y = Math.floor(cy - r - 3); y <= Math.ceil(cy + r + 3); y++) for (let x = Math.floor(cx - r - 3); x <= Math.ceil(cx + r + 3); x++) {
    const dx = x + .5 - cx, dy = y + .5 - cy, d = Math.hypot(dx, dy), nx = dx / (d || 1), ny = dy / (d || 1), facing = nx * lx + ny * ly; // +1 = up-right rim
    if (d >= r + 2.4) continue;
    if (d >= r) { // the paper the die pressed: dithered, darker on the side away from the light
      const k = (d < r + 1.2 ? .55 : .25) * press * (facing > 0 ? .7 : 1.1);
      if (bay(x, y) < k) px(g, x, y, '#0e0a18');
      continue;
    }
    if (!open) continue;
    if (d >= r - 1) { px(g, x, y, INK); continue; }                         // the ink edge
    if (d >= r - 3) {                                                        // the cut face, two pixels deep
      if (facing < -.35) px(g, x, y, d >= r - 2 ? '#fff4e0' : (facing < -.8 && bay(x, y) < .5 ? '#ffc4e3' : '#e6e0d0'));
      else if (facing < .35) px(g, x, y, d >= r - 2 ? '#dcd6d0' : '#aaa49e');
      else px(g, x, y, d >= r - 2 ? '#8d8584' : '#4a4450');
      continue;
    }
    // the card below: the tile's shadow falls into the upper-right of the hole; pink light reaches the lower-left
    let c = '#0b0812';
    if (facing > .1 && bay(x, y) < .75) c = '#050309';
    else if (facing < -.45 && d > r - 6 && bay(x, y) < .5) c = '#2e2146';
    else if (facing < -.75 && d > r - 5) c = '#4a2e58';
    px(g, x, y, c);
  }
}

/* the chad: a disc of the tile itself, cut out on the first frame */
function chadFrom(src, w, h, sx = 0, sy = 0) {
  const { cx, cy, r } = HOLE, n = Math.ceil(r * 2) + 2, c = document.createElement('canvas'); c.width = c.height = n;
  const q = c.getContext('2d'); q.imageSmoothingEnabled = true;
  const k = w / G, k2 = h / G;
  try { q.drawImage(src, sx + (cx - n / 2) * k, sy + (cy - n / 2) * k2, n * k, n * k2, 0, 0, n, n); } catch (e) { q.fillStyle = '#2e2146'; q.fillRect(0, 0, n, n); }
  // keep a disc, quantise it to the grid, ink it
  const img = q.getImageData ? (() => { try { return q.getImageData(0, 0, n, n); } catch (e) { return null; } })() : null;
  const out = document.createElement('canvas'); out.width = out.height = n; const o = out.getContext('2d');
  if (img) { const d = img.data; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const dd = Math.hypot(x + .5 - n / 2, y + .5 - n / 2), i = (y * n + x) * 4; if (dd >= r - 1) { d[i + 3] = 0; continue; } d[i + 3] = 255; } o.putImageData(img, 0, 0); }
  else { o.save(); o.beginPath(); o.arc(n / 2, n / 2, r - 1, 0, 7); o.clip(); o.drawImage(c, 0, 0); o.restore(); }
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const dd = Math.hypot(x + .5 - n / 2, y + .5 - n / 2); if (dd >= r - 1 && dd < r) px(o, x, y, INK); }
  return out;
}
function chadBack(n) { // the back of the transfer: plain paper
  const c = document.createElement('canvas'); c.width = c.height = n; const o = c.getContext('2d'), r = HOLE.r;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const dd = Math.hypot(x + .5 - n / 2, y + .5 - n / 2); if (dd >= r) continue; px(o, x, y, dd >= r - 1 ? INK : bay(x, y) < .12 ? '#d6c29c' : x + y > n ? '#dcd6d0' : '#efe6d8'); }
  return c;
}

/* the conductor's punch: a steel jaw comes in from the right, bites, and goes */
function paintJaw(g, tipX) {
  const { cy, r } = HOLE, R0 = r + 3, top = cy - R0, bot = cy + R0;
  // its shadow first, dithered, down-left
  for (let y = Math.floor(top); y < bot + 4; y++) for (let x = Math.floor(tipX - R0 - 4); x < G; x++) {
    const sx = x + 3, sy = y - 3, inJ = (sx >= tipX && sy >= top && sy < bot) || Math.hypot(sx + .5 - tipX, sy + .5 - cy) < R0;
    if (inJ && bay(x, y) < .5) px(g, x, y, '#0b0812');
  }
  for (let y = Math.floor(top) - 1; y < bot + 1; y++) for (let x = Math.floor(tipX - R0) - 1; x < G; x++) {
    const d = Math.hypot(x + .5 - tipX, y + .5 - cy), inJ = (x + .5 >= tipX && y + .5 >= top && y + .5 < bot) || d < R0;
    const inO = (x + .5 >= tipX && y + 1.5 >= top && y - .5 < bot) || d < R0 + 1;
    if (!inO) continue;
    if (!inJ) { px(g, x, y, INK); continue; }
    const v = (y + .5 - top) / (bot - top), nose = x + .5 < tipX && d > R0 - 1.6 && y + .5 < cy; // steel: lit along its top edge and nose (the light is up-right)
    px(g, x, y, v < .08 || nose ? '#8a8694' : v < .22 ? '#5d5a66' : v < .78 ? '#46424e' : '#2c2a30');
  }
  // the die's rim on the jaw's face
  for (let a = 0; a < 6.283; a += .09) px(g, tipX + Math.cos(a) * (r - .5), cy + Math.sin(a) * (r - .5), '#2c2a30');
}

function draw(ctx, w, h, t, opts = {}) {
  t = Math.max(0, Math.min(DURATION, +t || 0));
  const src = opts.src || ctx.canvas;
  if (opts.src || t < 30 || !CHADS.has(src)) CHADS.set(src, chadFrom(src, w, h, opts.sx || 0, opts.sy || 0));
  const chad = CHADS.get(src), g = layer(), { cx, cy, r } = HOLE;
  const CUT = 70;
  // 1 · the press, and from the cut on, the hole
  if (t >= CUT) paintHole(g, 1); else if (t > 35) paintHole(g, (t - 35) / (CUT - 35), false); // the die presses, then cuts
  // 2 · the chad drops out: pops toward you, tumbles, falls off the bottom of the tile
  if (t >= CUT && t < 620) {
    const s = (t - CUT) / 1000, y = cy - 18 * s + .5 * 420 * s * s, x = cx - 38 * s, flip = Math.cos(s * 13), grow = 1 + .18 * clamp01(s * 7);
    const n = chad.width, sw = Math.max(.14, Math.abs(flip)) * grow, sh = grow, face = flip >= 0 ? chad : (BACK && BACK.width === n ? BACK : (BACK = chadBack(n)));
    if (s < .2) for (let yy = 0; yy < n; yy++) for (let xx = 0; xx < n; xx++) { const dd = Math.hypot(xx + .5 - n / 2, yy + .5 - n / 2); if (dd < r * sw && bay(xx, yy) < .5) px(g, Math.round(x - n / 2 + xx - 3 - s * 20), Math.round(y - n / 2 + yy + 3 + s * 20), '#0b0812'); }
    g.save(); g.imageSmoothingEnabled = false; g.translate(Math.round(x), Math.round(y)); g.scale(sw, sh); g.drawImage(face, -n / 2, -n / 2); g.restore();
    // a few fibres of paper thrown off the cut
    for (let i = 0; i < 5; i++) { const a = 2.2 + i * .45, v = 26 + i * 7, fx = cx + Math.cos(a) * (r + v * s), fy = cy + Math.sin(a) * (r + v * s) + 200 * s * s; if (s < .35 - i * .03) px(g, fx, fy, i % 2 ? '#f3e6c8' : '#fff4e0'); }
  }
  // 3 · the jaw: already closing at t = 0, bites at the cut, gone by 240 ms
  if (t < 240) { const tip = t < 50 ? 106 - (106 - cx) * ease(t / 50) : t < 95 ? cx : cx + (G + r + 6 - cx) * Math.pow(clamp01((t - 95) / 145), 2); paintJaw(g, tip); }
  ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(LAYER, 0, 0, w, h); ctx.restore();
}
const drawHeld = (ctx, w, h) => draw(ctx, w, h, DURATION);

export { draw, drawHeld, DURATION };
