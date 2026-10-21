# `laid.js`: the owned mark, "Laid"

Buqu Will Not Bow's own mark on a store item the player owns. **Laid**: the last tessera is pressed into the grout at the tile's bottom-right corner. It plays once (720 ms), starts at once and ends on the held frame: a small crimson inset tile in a cream grout bed, bottom right. No gold, no glow, no text.

The two pictures it moves (the grout bed and the tessera) are drawn with the game's own mosaic code (`Draw` + `tessellate`, in `tools/pass/store-pass/sp.ts`) and embedded in the module as PNG data URLs, so the module is one self-contained file with no imports.

## API (ES module)

```js
import { play, held, drawAt, DURATION, BOX } from './laid.js';

await play(canvas);                       // animate once, resolve on the held frame (720 ms)
await play(canvas, { reducedMotion: true });  // draw the held frame at once
await held(canvas);                       // draw the held frame at once (an item owned before this visit)
drawAt(canvas, t);                        // draw the state at t ms, 0..DURATION (tests, scrubbing); false until decoded
DURATION                                  // 720
BOX                                       // { x: 0.76, y: 0.76, s: 0.21 }: the inset, as fractions of the tile
```

- `canvas` is a transparent overlay placed exactly over the store tile. Set its `width`/`height` in device pixels (e.g. 338×338 for a 169 px tile at devicePixelRatio 2); everything is laid out in fractions of the tile, so any size works.
- `play()` honours `prefers-reduced-motion: reduce` unless `opts.reducedMotion` is given; it uses `requestAnimationFrame` and draws nothing else on the page.
- The module only clears and draws its own canvas. It holds no state between calls, so the same module can serve any number of tiles.

## The frames

| t (ms) | what happens |
| --- | --- |
| 0–120 | the grout bed opens at the bottom-right corner (fades in over 60 ms, settles from 86 % to full size) |
| 0–380 | the crimson tessera falls in from above-left, turning (−24° to 0°) and shrinking from 132 % to its size, as if pressed toward the wall |
| 380–560 | it is pressed home: a 7 % squash and back |
| 380–680 | a few cream grout chips squeeze out from under it and fall away |
| 720 | the held frame: tessera seated in its bed (identical to `../reward-held.png`) |

## Files

- `bug/reward/laid.js`: the module (about 8.6 KB, pictures included).
- `bug/reward-held.png`: the held frame as a 400×400 transparent overlay for the 400 px store tile master (the page shows the tile at 169 px; scale the overlay with the tile). It was rendered by this module (`held()` on a 400×400 canvas), so the animation ends exactly on it.
- Source and build: `tools/pass/store-pass/sp.ts` (`laidSocket`, `laidTile`), `tools/pass/store-pass/laid_build.py` (writes the module), `tools/pass/store-pass/laid_check.mjs` (renders the frames, times one real `play()`, writes `reward-held.png`).

## Checked

- One real `play()` in Chromium resolved after 716–722 ms (under 900 ms). Frames at 0, 60 … 720 ms: `passwork/checks/store-pass/owned-mark.png`.
- The held frame over all four store tiles at 169 px and at 40 px (1× and 2×, on night and on linen): at 40 px it is an 8 px crimson square with a cream rim in the bottom-right corner, clear on cream, blue, jade and dusk grounds.
- Colours: crimson `#a42438` / `#b3283d` / `#7a1d2e`, grout `#f1ece2`, stone `#cfc6b8` / `#b5aa9a`. No pixel within ΔE 12 of ember, lilac, sun or mint; no gold.
