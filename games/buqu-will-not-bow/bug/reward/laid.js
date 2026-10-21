// Buqu Will Not Bow: the owned mark, "Laid".
// The last tessera is pressed into the grout at the store tile's bottom-right corner.
// Plays once in 720 ms, starts at once, ends on the held frame (a small inset tile, bottom right).
// No gold, no glow. The two pictures are drawn with the game's own mosaic code and embedded below.
//
//   import { play, held, drawAt, DURATION } from './laid.js';
//   await play(canvas);            // animate once over the tile, resolve on the held frame
//   held(canvas);                  // draw the held frame at once (already owned, reduced motion)
//   drawAt(canvas, t);             // draw the state at t ms (0 .. DURATION), for tests
//
// The canvas is a transparent overlay laid exactly over the store tile (any size, any devicePixelRatio:
// size the canvas's width/height in device pixels). Everything is placed in fractions of the tile.

const SOCKET = 'data:image/png;base64,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';
const TILE = 'data:image/png;base64,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';

export const DURATION = 720;
/** the inset box, as fractions of the tile: 84 x 84 px at bottom right of a 400 px master, 12 px from the edges */
export const BOX = { x: 304 / 400, y: 304 / 400, s: 84 / 400 };

function img(src) { const i = new Image(); i.src = src; return i.decode().then(() => i); }
const ready = Promise.all([img(SOCKET), img(TILE)]);
let pics = null;
ready.then(p => { pics = p; });

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const easeIn = t => t * t * t;
const easeOut = t => 1 - (1 - t) * (1 - t);
const CHIPS = [[-0.62, -0.1, -1, -0.2], [-0.2, -0.62, -0.3, -1], [0.3, -0.62, 0.4, -1], [0.62, 0.15, 1, 0.1], [0.12, 0.62, 0.2, 1], [-0.45, 0.62, -0.7, 1]];

function frame(ctx, W, H, t) {
  const [socket, tile] = pics;
  const s = BOX.s * W, bx = BOX.x * W, by = BOX.y * H, cx = bx + s / 2, cy = by + s / 2;
  ctx.clearRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  // the grout bed opens at once
  const o = easeOut(clamp(t / 120));
  ctx.save(); ctx.globalAlpha = clamp(t / 60); ctx.translate(cx, cy); ctx.scale(0.86 + 0.14 * o, 0.86 + 0.14 * o);
  ctx.drawImage(socket, -s / 2, -s / 2, s, s); ctx.restore();
  // the tessera falls in from above, turning, and is pressed home
  const TF = 380, TP = 560;
  let dx = 0, dy = 0, sc = 1, rot = 0, a = 1;
  if (t < TF) {
    const p = easeIn(clamp(t / TF)), q = 1 - p;
    dx = -0.3 * s * q; dy = -1.05 * s * q; sc = 1 + 0.32 * q; rot = -0.42 * q; a = clamp(t / 90);
  } else if (t < TP) {
    sc = 1 - 0.07 * Math.sin(Math.PI * (t - TF) / (TP - TF));
  }
  ctx.save(); ctx.globalAlpha = a; ctx.translate(cx + dx, cy + dy); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.drawImage(tile, -s / 2, -s / 2, s, s); ctx.restore();
  // grout squeezed out at the press: a few cream chips that settle and are gone before the end
  if (t >= TF && t < TF + 300) {
    const p = (t - TF) / 300, f = easeOut(p);
    ctx.save(); ctx.fillStyle = '#f1ece2'; ctx.strokeStyle = '#b5aa9a'; ctx.lineWidth = Math.max(1, s * 0.012);
    ctx.globalAlpha = 1 - p * p;
    for (const [px, py, vx, vy] of CHIPS) {
      const r = s * 0.055 * (1 - 0.5 * p);
      const x = cx + px * s * 0.5 + vx * s * 0.16 * f, y = cy + py * s * 0.5 + vy * s * 0.16 * f + s * 0.12 * p * p;
      ctx.beginPath(); ctx.rect(x - r, y - r, r * 2, r * 2); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }
}

/** Draw the state at t ms (clamped to 0 .. DURATION). Draws nothing until the pictures are decoded (a few ms). */
export function drawAt(canvas, t) {
  if (!pics) return false;
  frame(canvas.getContext('2d'), canvas.width, canvas.height, clamp(t, 0, DURATION));
  return true;
}
/** Draw the held frame at once. */
export async function held(canvas) { await ready; drawAt(canvas, DURATION); }
/** Play once and resolve on the held frame. Honours prefers-reduced-motion (draws the held frame). */
export async function play(canvas, opts = {}) {
  await ready;
  const reduce = opts.reducedMotion ?? (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduce) { drawAt(canvas, DURATION); return; }
  return new Promise(res => {
    let t0 = null;
    const step = now => {
      if (t0 === null) t0 = now;
      const t = now - t0;
      drawAt(canvas, t);
      if (t < DURATION) requestAnimationFrame(step); else { drawAt(canvas, DURATION); res(); }
    };
    requestAnimationFrame(step);
  });
}
