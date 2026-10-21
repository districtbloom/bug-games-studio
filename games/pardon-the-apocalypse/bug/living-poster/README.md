# Pardon the Apocalypse · moving poster

`pardon.js` is one living-board module (contract v1): `BUG_MODS.pardon = { … }`, plain classic JavaScript, 125 KB.
It has no DOM, timers, network, images or fonts, and every helper lives inside the object.

- **key** `pardon` · **no** `···` · **maker** `···` (bug.games sets these)
- **title** Pardon the Apocalypse · **kind** Story RPG · **verb** Throw.
- **ground** `#120c22` (the game's night sky) · **ink** `#ff7cc0` (Kindly's candy pink)
- **items**: `egg`, one of Dolly's brown eggs: the game's 6×7 egg with its ink outline, 3 px a pixel (24×27 px), tumbling in quarter turns.

## The held frame is the poster

Night on Carmody Street. Kindly's glossy pink smiley is the only light, and Wren, on the corner, lobs one of Dolly's eggs at it. She has a dithered pink rim on her edges facing the smile, and her shadow runs down-left.

The module carries the lead's three poster settings (`work/poster.js`: 2:1, 1:1, 2:3) and picks one by the plate's shape:
- **wide**: Wren at 2 lp a pixel, whole-number scale 1–10 device px a pixel.
- **square** and **tall**: Wren at 3 lp a pixel, 3, 6 or 9 device px a pixel, used when that scale suits the plate.

It then recomposes around Wren for any plate from 120×90 to 900×640 and beyond: very wide, very tall or tiny, never stretched, never with empty bars.
- Wren is always in view, and the smile is in view as far as it fits. On narrow or flat plates the smile slides up to 30 lp across or 14 lp down.
- `anchor()` is Wren's head.

In reduced motion (`rm`), every mode shows the held still. At the poster sizes it reproduces the posters:

| plate | compared with | max difference | pixels off by more than 2/255 |
|---|---|---|---|
| 1920×960 | `poster.png` | 9/255 | 0.001% |
| 720×1080 | `poster-2x3.png` | 8/255 | 0.000% |
| 816×816 | `poster-1x1.png` | 6/255 | 0.001% |

The residue is gradient rounding in Kindly's glow. Drawn uncached, the 2:1 frame is pixel-identical.

## Made from the game

**Wren** is 33 baked poses. Each is the game's own `personFrame('wren', pose)`, lit by the poster's own pass (`pbLit`, light up-right, `#ff7cc0` / `#ffc4e3`), rendered inside the real build. The sprites are stored as run-length rows (23.5 KB, 30 colours) and drawn as one Path2D per colour at a whole-number scale. The pose list is in `work/living/poses.js`:

| group | poses |
|---|---|
| the poster's lob | `lob` |
| idle | `lobOpen`, `watch`, `tired`, `stand`, `blink`, `standL`, `standR` |
| the egg | `reach`, `holdEgg`, `holdBlink`, `weighLo`, `weighUp`, `windup`, `windShout`, `windAngry`, `mid` |
| glances | `glance`, `glanceSm`, `glanceE` |
| react and the fight | `startle`, `smug`, `cheer`, `happy` |
| squeezed | `worried`, `hug`, `hugShout`, `hugBlink` |
| events | `hurt`, `angry`, `stagger`, `lookBack`, `angryBack` |

The hug poses are the game's BRACE with the egg tote (`PROP.tote`) held in front.

**Her shadow** is the game's `pbCastShadow`: her silhouette, squashed and sheared down-left, in solid `#0b0812`, computed as device-pixel rows.

**The street** is the game's Carmody Street painting, `areaCanvas('street','night')`, painting x 400–1300 and y 130–360. It is baked as `pbNightPaint`'s tone per pixel (ramp step plus Bayer count, 40.8 KB). The module then re-runs the poster's own passes on it:
- `pbNightPaint` dither and `pbFalloff`;
- the `pbLit` roofline rim from the smile;
- `pbBaseLine` asphalt, the three `pbPool` light pools, the kerb and the deep street.

**The sky** is the game's `skyBands` over `PB.NIGHT`. **The stars** are `pbStars` (mulberry seed 11), tiled out with other seeds for bigger plates.

**Kindly** is the game's own gloss code, ported from `02b_gloss.js`: `gGlow`, `kSmiley`, `gloss`, `kScreen` and `kFace`.

**The Glyde scooter** is `paintScooter` from `04b_enemies.js`, ported as is, with its mood and wheel angle passed in.
- Its crack pixels are the game's `crackGloss` output, `enemyCracked('scooter', st, 1 | 2)` for both the happy and the revving state, baked.
- Freed, it is `enemyFreed('scooter')`, baked, then lit the way people are lit: a `pbLit` port with a rim and dithered shade.

**Hand-drawn in the game's palette:**
- the yolk on the scooter's screen (the game's yolk and shell colours);
- the splat bits (the egg ramp);
- the THANK YOU stars and FREED hearts (the game's particle shapes, without its sun-gold `#f3cd6d`);
- the dust where something lands.

## The modes

- **idle** alternates live and hold.
  - *Live* (2.5–6 s) is a seeded script of beats that always ends in the lob: she watches the last egg drop behind the houses, blinks, shifts her weight and breathes. Then she takes another egg from the tote, weighs it (tosses it in her palm), winds up and lobs.
  - *Hold* (1.5–5 s) freezes on the poster's moment, with the egg exactly where the poster has it.
  - As `near` rises she stops and looks out (`glance`, then `glanceSm`: "don't even").
- **react** (0.8 s): a startle (shock, a hop), then the egg snaps into the wind-up with a shout, and she holds the glare.
- **enter** (0.7 s): the throw. The camera dips and follows the egg into play, as a revving Glyde scooter rolls in to meet it.
- **loop** (7.2 s, seamless, `mt % 7.2`): a night scavenge fight on Carmody St. This is the game's real `SCAV_FOES` street set, two Glyde scooters.
  1. SPLAT: the gloss cracks into pixels and the yolk lands on its screen (YOLKED).
  2. Its turn: REVVING, then RAM, which misses because it's yolk-blind; Wren leans back smug.
  3. THANK YOU: Wren cheers, pink stars fly to the machine, and it goes FLUSTERED (crack level 2).
  4. Another egg FREES it: the whole machine turns to pixels and rides off with hearts.
  5. The next scooter rolls in revving, and she lobs.
  - On a plate too narrow for both, the camera follows the turn.
  - The fight is framed so that it stands clear of the bottom 15% of the plate.
  - She passes through the poster's lob pose every cycle.
- **squeezed**: a worried glance, then she hugs the egg tote (BRACE) and glares. With more squeeze and time she shouts and leans back against it.
- **back to idle**: a 0.45 s settle (the scooter zips off and the camera returns), then one lob and the poster's hold.
- **on()**:
  - `cue`: winds up and calls `emit({type:'throw', item:'egg', …})` at 0.8 s.
  - `hit`: a flinch, dust at the spot, then a glare toward the side it came from.
  - `look`: turns to look for 1.5 s.
  - `shake`: a 0.7 s stagger.

There is no type, price, count or Play button anywhere. There are no brightening flashes and no whole-frame colour shifts. Over a loop the frame's mean luma stays between 0.167 and 0.190, and it changes by at most 0.0045 from one frame to the next.

## Performance

At setup, the first `create()` builds the three street bitmaps once for every plate (about 50–70 ms in headless Chromium). After that, the static layers are cached:
- the sky, stars, glow and smiley in a back layer;
- the street in a front layer, covering the plate's whole camera range;
- the scooter's blurred gloss in its own cache.

Each frame blits the two layers and draws Wren as about 25 Path2D fills, plus the scooter and a few rects.

Timings at 600×400, in headless Chromium with software raster and this frame's rasterization forced every frame:

| case | mean | p95 |
|---|---|---|
| idle | 0.31 ms | 0.4 ms |
| loop | 0.49 ms | 0.8 ms |
| loop at dpr 2 | 1.37 ms | 2.3 ms |
| a plate squeezing continuously | 0.67 ms | 1.3 ms |
| a plate resizing continuously | 1.5 ms | 2.4 ms |

`OffscreenCanvas` and `ImageData` are used only for these caches. Without them the module falls back to drawing each layer as Path2D runs (an undithered street, about 4 ms a frame).

## Test

All three tests use Python Playwright with Chromium.

- `python3 test/run.py OUTDIR [shots|poster|time|all|<prefix>]` drives `test/plate.html` on a virtual clock (dt = 1/60). It writes PNGs of every mode and plate shape, the reduced-motion posters, event reactions and odd sizes, plus frame timings. It exits 3 on any console error.
- `python3 test/rhythm.py OUTDIR` hashes every frame of 90 s of idle and two loop cycles. It measures the holds, the live stretches, the loop's repeat and the frame's luma.
- The old kit's board was also run, from its own folder: `python3 -I living-poster/harness.py pardon OUT pardon.js` and then `node living-poster/tools/shot.mjs …`. It had zero errors.
