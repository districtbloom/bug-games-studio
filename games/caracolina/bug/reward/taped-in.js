/* Caracolina · the owned mark, "taped in".
   A strip of washi tape slaps across the store tile's lower-left corner and settles flat, the way the game
   tapes prints into the sketchbook (style.css .tape: two-colour stripes at 45 degrees, hand-torn ends).
   Canvas 2D, no dependencies, transparent overlay. Colours: cobalt #2a55b8 and sketchbook paper #f3ead7
   (both free against ember, lilac, sun and mint), ink #1d1a33 for the hard little shadow.

   drawTapedIn(ctx, w, h, p)   draws the overlay for progress p (0..1) on a w x h tile; p = 1 is the held frame.
   playTapedIn(canvas, opts)   plays it once (DURATION_MS), starting at once and ending on the held frame;
                               honours prefers-reduced-motion (draws the held frame straight away).
                               opts: { onDone }. Returns a function that stops it (leaving the held frame). */

export const DURATION_MS = 620;

const COBALT = [42, 85, 184], PAPER = [243, 234, 215], INK = [29, 26, 51];
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const ease = t => 1 - Math.pow(1 - clamp01(t), 3);              /* fast in, soft landing */
const smooth = t => { t = clamp01(t); return t * t * (3 - 2 * t); };
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/* a fixed, hand-torn outline for the strip in its own frame (length 1 x thickness 1), so every frame tears the same */
const EDGE = (() => {
  let s = 911; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const top = [], bot = [];
  for (let i = 0; i <= 14; i++) { const u = i / 14; top.push([u, -.5 + (r() - .5) * .05]); bot.push([u, .5 + (r() - .5) * .05]); }
  const endL = [], endR = [];
  for (let i = 1; i < 7; i++) { const v = -.5 + i / 7; endL.push([(i % 2 ? .018 : -.004) + (r() - .5) * .012, v]); endR.push([1 + (i % 2 ? -.018 : .004) + (r() - .5) * .012, v]); }
  return [...top, ...endR, ...bot.reverse(), ...endL.reverse()];
})();

function stripPath(ctx, L, T) {
  ctx.beginPath();
  EDGE.forEach(([u, v], i) => { const x = (u - .5) * L, y = v * T; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
  ctx.closePath();
}

export function drawTapedIn(ctx, w, h, p) {
  p = clamp01(p);
  const S = Math.min(w, h);
  /* the held pose: across the lower-left corner at 45 degrees, both ends running off the tile's edges */
  const hx = .155 * w, hy = h - .155 * h, ha = Math.PI / 4, L = .7 * S, T = .145 * S;
  /* approach (0 .. .4): flies in from below-left, big and lifted; slap at .4; settle (.4 .. 1) */
  const a = ease(p / .4);
  const land = p < .4 ? 0 : (p - .4) / .6;
  const wob = p < .4 ? 0 : Math.sin(land * Math.PI * 2.2) * Math.exp(-land * 5);
  const lift = 1 - a;                                          /* 1 = in the air, 0 = on the page */
  const cx = hx + (-.2 * S) * lift, cy = hy + (.16 * S) * lift;
  const ang = ha - .32 * lift + .05 * wob;
  const sc = 1 + .32 * lift;
  const sqx = p < .4 ? 1 : 1 + .05 * Math.exp(-land * 7) , sqy = p < .4 ? 1 : 1 - .14 * Math.exp(-land * 7);
  const alpha = .9 * smooth(p / .08 + .35);

  ctx.save();
  /* the hard little shadow: far and faint while lifted, tight once it is down */
  ctx.save();
  ctx.translate(cx + S * (.012 + .07 * lift), cy + S * (.016 + .09 * lift));
  ctx.rotate(ang); ctx.scale(sc * sqx, sc * sqy);
  stripPath(ctx, L, T); ctx.fillStyle = rgba(INK, (.24 - .12 * lift) * alpha / .9); ctx.fill();
  ctx.restore();

  /* the tape: cobalt with fine paper stripes at 60 degrees in the tape's own frame (three parts cobalt to one of paper,
     so the strip still reads cobalt at 40 px and never averages toward lilac) */
  ctx.save();
  ctx.translate(cx, cy); ctx.rotate(ang); ctx.scale(sc * sqx, sc * sqy);
  stripPath(ctx, L, T); ctx.clip();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = rgba(COBALT, 1); ctx.fillRect(-L, -T, 2 * L, 2 * T);
  ctx.fillStyle = rgba(PAPER, 1);
  const per = T * .42, st = per * .25, sl = T * 1.15;
  for (let k = -L - 2 * sl; k < L; k += per) { ctx.beginPath(); ctx.moveTo(k, -T); ctx.lineTo(k + st, -T); ctx.lineTo(k + st + sl, T); ctx.lineTo(k + sl, T); ctx.closePath(); ctx.fill(); }
  /* creases while it lands, smoothed away by the thumb */
  const crease = p < .4 ? 0 : Math.exp(-land * 4) * (1 - land);
  if (crease > .01) {
    ctx.globalAlpha = alpha * crease; ctx.strokeStyle = rgba(INK, .5); ctx.lineWidth = Math.max(1, S * .006);
    for (const u of [-.18, .12]) { ctx.beginPath(); ctx.moveTo(u * L - T * .2, -T * .5); ctx.lineTo(u * L + T * .25, T * .5); ctx.stroke(); }
  }
  /* the thumb pressing it flat: a soft sheen running along the strip */
  if (p > .4 && p < .95) {
    const u = smooth((p - .4) / .5), sx = (u - .5) * L * 1.2, sw = T * 1.1;
    const g = ctx.createLinearGradient(sx - sw, 0, sx + sw, 0);
    g.addColorStop(0, 'rgba(255,253,247,0)'); g.addColorStop(.5, `rgba(255,253,247,${.42 * (1 - u)})`); g.addColorStop(1, 'rgba(255,253,247,0)');
    ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(sx - sw, -T, 2 * sw, 2 * T);
  }
  ctx.restore();
  ctx.restore();
}

export function playTapedIn(canvas, opts = {}) {
  const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
  const still = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0, t0 = 0, done = false;
  const frame = p => { ctx.clearRect(0, 0, w, h); drawTapedIn(ctx, w, h, p); };
  const finish = () => { if (done) return; done = true; cancelAnimationFrame(raf); frame(1); if (opts.onDone) opts.onDone(); };
  if (still) { finish(); return () => {}; }
  frame(0);
  const tick = now => { if (!t0) t0 = now; const p = (now - t0) / DURATION_MS; if (p >= 1) return finish(); frame(p); raf = requestAnimationFrame(tick); };
  raf = requestAnimationFrame(tick);
  return finish;
}

export default drawTapedIn;
