# Pardon the Apocalypse · moving poster (round 2)

`pardon.js` is one living-board module (contract v1): `BUG_MODS.pardon = { … }`, plain classic JavaScript, 144 KB.
It has no DOM, timers, network, images or fonts, and every helper lives inside the object.

- **key** `pardon` · **no** `···` · **maker** `···` (bug.games sets these)
- **title** Pardon the Apocalypse · **kind** Story RPG · **verb** Throw.
- **ground** `#120c22` (the game's night sky) · **ink** `#ff7cc0` (Kindly's candy pink)
- **acts** `{ egg: 'toss' }`: the seam moment is Wren's own verb, a lobbed egg.
- **items**: `egg`, one of Dolly's brown eggs: the game's 6×7 egg, lit from up-right as on the poster, with its ink outline, 3 px a pixel (24×27 px), tumbling in quarter turns.

## The premise, and the held frame

Kindly's AI has the city. Its glossy pink smile hangs over Carmody Street and its swarm of drone pills streams over the roofs. A SCANNING Hoverly drone hangs in front of Wren, and a REVVING Glyde scooter waits further down the street. Wren, the bus driver, lobs one of Dolly's eggs at them.

The held frame is the round-2 poster. The module carries the poster's three settings (`work/r2poster/p.js`: 2:1, 1:1, 2:3) and picks one by the plate's shape:
- **wide**: Wren at 2 lp a pixel, whole-number scale 1–10 device px a pixel.
- **square** and **tall**: Wren at 3 lp a pixel, 3, 6 or 9 device px a pixel.

In reduced motion (`rm`), every mode shows the held still. At the poster sizes it reproduces the posters:

| plate | compared with | max difference | pixels off by more than 2/255 |
|---|---|---|---|
| 1920×960 | `poster.png` | 13/255 | 0.021% |
| 720×1080 | `poster-2x3.png` | 12/255 | 0.030% |
| 816×816 | `poster-1x1.png` | 16/255 | 0.028% |

The residue is gradient rounding in Kindly's glow and the machines' gloss. Sheet: `../checks/living-held-vs-poster.png`.

## Wren stays in view, on every plate

The camera never moves. For each plate the view is set once: the poster's own placement, the smile as far as it fits, then Wren's whole box (every pose, every nudge) inside the plate, which wins over everything else. Then the machines are brought to her:
- each machine goes to its poster place, clamped into the view and kept clear of the caption strip (the bottom 16% of the plate);
- on a plate too narrow for the fight side by side, the fight **stacks**: the scooter waits up the street above her head, and the drone hovers over it, scanning down at her;
- the scooter's charge ends right beside her, its screen just clear of her.

`anchor()` is Wren's head in every frame. The module also has a `box()` test hook, which gives her sprite box in plate px.

`test/inview.py` checks every frame at dt 1/60. It runs two loops after react and enter, the settle, 20 s of idle with board events (cue, hits of every kind, shake, look) and 4 s squeezed. The plates are 150×370 (also at dpr 2), 140×305, 120×300, 1000×150, and one squeezing from 270×370 to 120×280. Wren is out of view in **0 of 15,480 frames**. Sheets: `../checks/living-inview.png` and `../checks/living-modes-narrow.png`.

## Made from the game

**Wren** is 36 baked poses. Each is the game's own `personFrame('wren', pose)`, lit by the poster's own pass (`pbLit`, light up-right, `#ff7cc0` / `#ffc4e3`), rendered inside the real build. They are stored as run-length rows and drawn as one Path2D per colour at a whole-number scale. Round 2 adds `shield`, `duck` and `yanked` for the kinds of hit.

**Her shadow** is the game's `pbCastShadow`.

**The street** is the game's Carmody Street painting, `areaCanvas('street','night')`, baked as `pbNightPaint`'s tone per pixel. The module re-runs the poster's passes on it: the `pbNightPaint` dither, `pbFalloff`, the `pbLit` roofline rim, `pbBaseLine` asphalt, the two `pbPool` pools and the kerb.

**Kindly and its machines** are the game's own gloss code, ported as is:
- the smile and glow: `gGlow`, `kSmiley`, `gloss`, `kScreen`, `kFace`;
- the swarm: the poster's `pbSwarm` (the game's drone pill, its own seeded spread);
- the drone: `paintDrone`, in its SCANNING state (red screen, scan cone);
- the scooter: `paintScooter`, REVVING.

Both machines are rendered the way `drawEnemy` draws them inside `zoomDraw` (the gloss sprite at K = scale × zoom). Over each one goes the poster's smooth backlit shade from the up-right.

**Crack and freed pixels** are the game's `crackGloss` output, baked:
- `enemyCracked('drone', {scan}, 1 | 2)` and `enemyCracked('scooter', {rev}, 1 | 2)`;
- `enemyFreed('drone' | 'scooter')`.

The cracked pixels are drawn at a whole-number scale, pinned at the first hole. Freed, a machine is lit the way people are lit (a `pbLit` port).

**Hand-drawn in the game's palette:**
- the yolk on the screens;
- the splat bits;
- the THANK YOU stars and FREED hearts (without the game's sun-gold);
- the skid dust;
- the dust where a neighbour's item lands.

## The modes

- **idle** alternates live (2.5–6 s) and hold (1.5–5 s, the poster's frame).
  - Live is a seeded script of beats that always ends in the lob. She watches the drone *duck* her last egg (it bobs up out of the way with wide eyes), then breathes, blinks and shifts her weight. Then she takes another egg, weighs it, winds up and lobs.
  - The drone hovers and the scooter revs, easing to still for the hold.
  - As `near` rises she looks out at the cursor.
- **react** (0.8 s): a startle and a shouted wind-up, while the drone lifts in alarm and the scooter revs harder.
- **enter** (0.7 s): the throw. The egg leaves her hand and reaches the poster's spot exactly as the loop begins.
- **loop** (7.0 s, seamless, `mt % 7`). The machines come for the bus driver and she fights back with Dolly's eggs.
  1. **0–2.5 s:** the poster's egg lands. SPLAT on the scanning drone: yolk on its screen, its gloss cracks into pixels and, freed, it floats up and away with hearts.
  2. **1.2–2.7 s:** the scooter charges her. Her second egg yolks it mid-charge and it skids up blind, wheels spinning.
  3. **2.75–4.6 s:** THANK YOU. Her cheer and the game's pink stars leave it FLUSTERED, it turns to pixels, freed, and rides off.
  4. **4.6–7 s:** the next drone drops in from the swarm and the next scooter rolls up revving. She weighs an egg and lobs, back to the poster's frame.
  - Through it all the swarm mills over the city, in six bands that return to the poster's places each loop.
  - The loop's first and last frames are pixel-identical to the held still.
- **squeezed**: she hugs the egg tote (the game's BRACE) and glares, and shouts as the squeeze grows. The machines keep hovering and revving.
- **back to idle**: a 0.45 s settle. The machines play the rest of the fight forward quickly back to their places, then she makes one lob and holds on the poster.
- **on()**:
  - `cue`: she winds up and calls `emit({type:'throw', item:'egg', …})` at 0.8 s.
  - `hit` reacts by `kind`, with dust where it landed, then a glare toward the side it came from:

    | kind | reaction |
    |---|---|
    | `toss` | a flinch |
    | `shoot` | a duck |
    | `beam` | shielding her eyes |
    | `burst` | blown about |
    | `grab` | yanked toward it |

  - `look`: she turns to look for 1.5 s.
  - `shake`: a 0.7 s stagger.

There is no type, price, count or Play button anywhere. There are no brightening flashes and no whole-frame colour shifts. Over the loop the frame's mean luma stays between 0.160 and 0.183, and it moves by at most 0.0035 from one frame to the next. The light band is **dark**, as on the poster.

`audit.py` was run on all 158 shots, with the caption zone scaled to the plate (146/960 of its height). It found 0 flat 24×24 guarded blocks, up to 10 device px a pixel at 900×640 dpr 2, and 0 guarded pixels in the caption zone.

## Performance

Timed at 600×400 in headless Chromium with software raster, forcing each frame's rasterization:

| case | mean | p95 |
|---|---|---|
| idle | 0.56 ms | 0.7 ms |
| loop | 0.74 ms | 1.2 ms |
| loop at dpr 2 | 1.3–1.9 ms (two runs) | 2.2–3.0 ms |
| a plate squeezing continuously | 0.97 ms | 1.9 ms |
| a plate resizing continuously | 1.9 ms | 3.7 ms |

Each frame blits two cached layers:
- the back: sky, stars, glow and smile;
- the front: the street.

Between them go six cached swarm bands. Then the machines (cached gloss per look), Wren (about 25 Path2D fills) and a few rects. The first `create()` builds the street bitmaps once for every plate (about 50–70 ms). A machine look is drawn the first time it appears.

`OffscreenCanvas` and `ImageData` are used only for these caches. Without them, the module draws everything directly. That leaves the street undithered and is much slower: about 7 ms a frame on average, with spikes while machine looks are drawn.

## Test

All of these use Python Playwright with Chromium, and drive `test/plate.html` on a virtual clock (dt = 1/60).

- `python3 test/run.py OUTDIR [shots|poster|time|all|<prefix>]` writes PNGs and timings for:
  - every mode and plate shape, including tiny, tall, narrow, wide and squeezed;
  - the reduced-motion posters;
  - every kind of hit, plus the other events and odd sizes.

  It exits 3 on any console error.
- `python3 test/inview.py OUTDIR`: Wren's box in every frame (see above). It exits 4 on any frame out of view.
- `python3 test/rhythm.py OUTDIR`: the holds, the live stretches, the loop's repeat, the loop boundary against the held still, and the frame's luma.

The rebuild pipeline is in `work/living/r2/`:
1. `poses2.js` and `bake2.js` run in the game page via `tools/render.py` and write `bake/bake.json`.
2. `build2.py` joins `head2.js`, the shared library and `create2.js`, injects the data, and writes this `pardon.js`.
