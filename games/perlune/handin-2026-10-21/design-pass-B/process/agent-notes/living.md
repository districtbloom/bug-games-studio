# Notes · group **living** (picture 17, the moving poster)

## bug/living-poster/perlune.js

- **file:** `bug/living-poster/perlune.js`. It is one classic-JS file (80 KB) that only does `BUG_MODS.perlune = { key:'perlune', no:'···', title:'Perlune', maker:'···', kind:'Evolving shooter', verb:'Absorb.', ground:'#05040A', ink:'#FF5C9A', rants, hits, items:{bead}, create(api) }`. It follows `LIVING_POSTER_CONTRACT.md` v1.
- **shows:** the poster, alive: "A droplet faces the Eclipse." The held frame is the poster. Hover makes the droplet startle, then dive onto Nacre and play a short, seamless 6 s loop.
- **made by:** drawn in Canvas 2D with the game's own maths. No images, fonts, DOM, timers or network.
  - **The camera** is the poster's own staging, recomputed from the lead's `titlejs` parameters (Nacre, cam −0.33, face −0.2, dist 5.6, up 1.1, ty 0.25, fov 0.62, side 0.8, light [−0.6, 0.45, −0.55]). The droplet centre lands within 8 px of the poster and the crest tip within 1 px; eyes and Eclipse land within ~12 px. Eyes, crest and dust are placed by projecting the game's `drawCreature` geometry through this camera.
  - **The body** is the game's LIQUID material, ported line by line from `engine.js` and shaded per pixel once into a cached sprite. It uses `SCULPT_FS` m==6, `GLSL_ENV` with Nacre's env blended with space as `blendPalettes` does, `film()`, the vertex wobble (wob 0.07), then ACES, sat 1.12 and gamma. It is evaluated at the poster's own moment (R.time = 7.55, found by fitting the port to the poster: MSE 0.009). The sprite refines over a few frames on a ~1 ms/frame budget and is shared by all plates of the game.
  - **The motion** uses the game's own rules from `updateCreatureLife` / `drawCreature`:
    - wobble `sin(T*9)*0.03`, jig `0.12*sin(T*24)`, joy bounce `sin(T*30)*0.05`;
    - blink every 1.8–5.2 s (0.15 s closed);
    - eyes damped toward a look target (rate 10), with the eye offsets 0.13 / 0.09;
    - joy widens the eyes (×1.3 / ×1.2, catchlight ×1.35); hurt squints them (0.28 / 1.25 for 0.45 s);
    - slosh spring 70 / 8; metamorphosis spin 0.7 s easeOut; the elastic grow ease.
  - **Dust** is the title dust ring as drawn by `drawDust`: 200 motes, r 1.2–2.2, speed 1.2, bias 0.8, flat 0.6, pink-to-cyan by latitude.
  - **The Eclipse** uses `drawSunburst` (44 rays, 4 colours, 5 lengths, from 1.35r to 13r, turning at 0.012 rad/s). Its two shells (`drawAtmo` amber 1.9r and violet 3.0r) are built from the poster's measured radial profile; my render matches it within a few levels at every radius.
  - **Nacre in the loop** uses the world's own palette (p0–p3, atmo #ff9ad5, matter #ffc6ea). The foes are the build's mite and tumbler: pearl sphere with orbiting chrome tets, chrome box in a pearl ring, one hostile #ff2e6a glow each. Beads (#e8fbff), matter gems, ringFx-style rings and the harvest bar's `--iri` gradient also come from the build.
- **agent:** living
- **check:**
  - **Pack harness:** `harness.py perlune … perlune.js` wrote `work/living/render/HarnessPerluneLiving-poster.dc.html` (the harness appends the folder name to the key). `shot.mjs … seq 500 1500 3000 4500 7000 10000` and `rm` both gave **errors []**. I looked at every frame, plus extra sequences at 0.1 s steps from my own bench (`work/living/tools/test.mjs`).
  - **Held frame vs poster:** the reduced-motion frame at 1600×800 sits beside `poster.png` in `work/living/held-vs-poster.png` and reads as the same picture.
    - `measure.py light`: held L 0.129 / C 0.067 (dark) against the poster's 0.121 / 0.061 (dark).
    - Every mode stays dark: idle, react, loop and squeezed all measure L 0.109–0.132, so no flashes and no whole-frame colour shift.
  - **guard.py on the held frame:** largest guarded block is lilac 21×21 px (the poster has 23×23 from the same film rim). Sun 8 px, mint 11 px, ember 1 px. There is 0.36% lilac in the bottom 146 px, which is the droplet's thin iridescent bottom rim, not a block.
  - **Sizes:** 120×90, 90×70, 140×305, 150×177, 260×367, 400×400, 577×163, 600×400, 740×370 and 900×640, plus a squeeze from 270×370 to 120×280. All recompose with no stretch and no bars, and `anchor()` sits on the head. Sheets are in `work/living/zoom/` (`sizes.png`, `strip.png`, `m-sq.png`, `sq-zoom.png`).
  - **Loop seam:** the frame-to-frame change across the 6 s wrap equals an ordinary step (mean 1.006 vs 0.97–1.05).
  - **Timing at 600×400, median per frame:**
    - Main-thread JS (what a GPU-composited laptop pays): idle 0.4, react 0.3, enter 0.5, loop 0.6, squeezed 1.1 ms.
    - The same with raster forced in headless Chromium with no GPU, on a 2-CPU box shared with other agents (load ~2.8): idle 2.1, react 1.8, enter 3.7, loop 3.9, squeezed 2.6, reduced motion 1.8 ms.
    - The numbers swing with load; p25 is about 10–20% lower.
  - **One-time cost:** `create()` takes ~60–120 ms for the first plate and ~0 ms after that, because the data is shared. The body sprite then refines at ≤1500 px per frame.
- **couldn't make / caveats:**
  - Reduced motion and the held pose put the dust motes, stars and contour lines in the same character as the poster, not at its exact positions. The game's own random seeds and its 3D nebula can't be reproduced. The droplet, Eclipse, rings, rays, light and camera are the poster's.
  - The body's reflections are baked at the poster's moment. The droplet squashes, stretches, wobbles and spins, but the live vertex-wobble shimmer of the game's mirror surface is not re-shaded every frame, which would cost too much per pixel.
  - Rays turn in 0.003 rad steps (one step every ~0.25 s) because the backdrop is cached. On very large plates at 2× DPR the backdrop (contour lines and rays only) is cached at half resolution.
  - `OffscreenCanvas` is used for the caches (as the pack's own example module does). Without it the module falls back to a simple gradient droplet and draws everything live.
  - Thrown-in items from the harness hit plate b during its loop. The droplet flinches with the game's hurt squint, which is intended.

### Choices (living)

- **idle:** live 2.5–6 s and hold 1.5–5 s, starting with a short hold.
  - Hold is exactly the poster pose, with the bounce frozen at the poster's own value and the eyes on the Eclipse. Blinks, dust drift, star twinkle and the slow ray turn continue.
  - Live beats: glance, admire (joy eyes and a small rise), drink (a pink mote spirals in and is absorbed with the game's absorb tint and jig), shiver and hop.
  - As `near` rises the eyes turn out of the plate toward the viewer. Idle carries no cursor position, so the viewer is the target.
- **react (0.8 s):** squash with a squint (anticipation), then stretch up 22% with joy eyes snapping to the cursor and the dust ring flaring, then hold with wobble overshoot.
- **enter (0.7 s):** one dive. The droplet falls and stretches along its fall while the camera tilts down after it. The sky, Eclipse and rays slide up and Nacre's horizon rises from below. It lands with a squash, with no fades or cuts. The foes for the first cycle are already walking in.
- **loop (6 s, `mt % 6`, seamless):** the droplet hovers on Nacre's curve facing the foes.
  - It fires beads at two mites and a tumbler; each bursts into pearl matter that hops, then flies in with a trail.
  - Each absorb gives an elastic size pop and fills the game's 3 px iridescent harvest bar, top left. The bar has no type and no numbers.
  - At the full bar comes the metamorphosis: the 0.7 s spin, joy eyes, and iridescent rings running out across the ground.
  - Growth adds up across cycles but saturates at +11%, so the loop never jumps.
  - Foes nudge back when hit instead of flashing white, because they would otherwise flash 4.5 times per second.
  - When hover ends, a damped spring brings it back to the poster pose (~0.5 s). Nacre and its foes sink out of the plate and the sky and Eclipse come back down.
- **squeezed:** the droplet is pushed into the right edge.
  - The body flattens like liquid on glass: the contact side is clipped flat with a meniscus of light (pink to white to cyan), and the body bulges taller.
  - Annoyed eyes: lids cut across the top in a V, with the side-eye toward the wall.
  - It escalates with `squeeze` and `mt`: the lids lower, then it shoves the wall every 1.5 s, with a look away to the sky every ~3.4 s.
- **Board events:**
  - **cue:** the droplet looks toward the throw, winds up while a pearl bud swells out of its side, then flicks. `emit({type:'throw', item:'bead'})` fires at 0.72 s, followed by recoil and proud joy eyes. Throws alternate right and left.
  - **hit:** jelly squash along the hit direction, the game's hurt squint, a recoil, and a spray of pearl beads.
  - **look:** the eyes look toward the event for 1.5 s.
  - **shake:** jig plus a squash.
  - With reduced motion on, all transient effects are cleared and nothing is thrown.
- **Throwable `bead`:** ~20 px of liquid pearl in the droplet's own sky-over-horizon chrome, with a film rim and catchlight. It stretches along its flight and wobbles.
- **rants and hits:** rants `['!?', '…', 'hmph', '#@$%']`, hits `['plip!', '!']` (the contract allows grawlix).
- **Layout:** keys come from the lead's three posters (2:1, 1:1, 2:3) and are extended to a 1:2.3 column and a 3.5:1 strip. In the strip, the droplet is larger and the Eclipse sits closer.
- **ink #FF5C9A:** the game's dust magenta (`--dust`), free against all four platform colours.
