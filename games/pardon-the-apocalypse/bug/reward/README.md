# reward/ · the owned mark · "punched"

Pardon the Apocalypse's mark on a thing a player owns. Wren drove the 45 bus for eleven years, so when you own
something it gets punched like a bus transfer. A conductor's punch bites a round hole into the tile's lower-right
corner, and the paper chad drops out. It plays once and then holds on the hole.

Design only. Nothing here is declared in the game or in `game.json`.

## Files

- `punched.js` is a self-contained ES module. It has no dependencies, no fonts, no network and no game code.
- `../reward-held.png` is the held frame as a still. It's a 400×400 overlay that is transparent except for the hole.

## Use

```js
import { draw, drawHeld, DURATION } from './reward/punched.js';

const t0 = performance.now();
function frame(now) {
  const t = now - t0;                  // ms since the purchase
  ctx.drawImage(tileImage, 0, 0, w, h); // draw the store tile first, every frame
  draw(ctx, w, h, t);                  // then the mark over it
  if (t < DURATION) requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

- `draw(ctx, w, h, t, opts?)` paints the mark for time `t` in ms over a tile already drawn at `(0, 0, w, h)`. It's
  stateless in `t`, never clears the canvas, and works at any size: 400, 169 or 40.
- `DURATION` is 850 ms. When `t >= DURATION` it paints the held frame, and that frame stays.
- `drawHeld(ctx, w, h)` paints the held frame alone. Use it for tiles that are already owned, and when the viewer
  prefers reduced motion.
- `opts.src` is a clean image of the tile to cut the chad from. By default the chad comes from `ctx.canvas`,
  sampled on the first frame.
- `opts.sx` and `opts.sy` say where the tile sits in `src`, in px. Use them when the tile isn't at the canvas origin.
  In that case, translate `ctx` to the tile first.

## Timing (one play, under 900 ms)

| ms      | what happens |
|---------|--------------|
| 0       | It starts at once. The punch's steel jaw is already coming in from the right edge. |
| 35–70   | The jaw presses and the paper dimples around the die. |
| 70      | The cut: the hole opens under the jaw. |
| 95–240  | The jaw lets go and leaves to the right. |
| 70–620  | The chad, a disc of the tile itself, pops toward you, flips once to its plain paper back, and drops off the bottom edge. A few paper fibres fly. |
| 620–850 | Nothing moves. 850 is the held frame. |

## Look

- The medium is the game's own people's medium: hand-placed pixels on a 100×100 grid, scaled up with no smoothing.
  It has a 1 px ink line `#2a1c25`, and its light and shade are Bayer dither. There's no blur, no glow and no gold.
- There is one light: Kindly's candy pink from the up-right, the same as the tiles. The cut face of the hole is lit
  on its lower-left (`#fff4e0`, `#e6e0d0`, a touch of `#ffc4e3`) and shaded on its upper-right (`#8d8584`,
  `#4a4450`). The card under the hole is dark (`#0b0812`), with the tile's shadow falling into it.
- The steel jaw uses the game's skillet greys (`#2c2a30` → `#8a8694`).
- No bug.games colour is used. The audit found zero guarded pixels in the held frame.
- The held frame reads at 40 px as a small light ring in the lower-right corner.

## Reduced motion

Call `drawHeld(ctx, w, h)` (or `draw(ctx, w, h, DURATION)`) and skip the animation.
