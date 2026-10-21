### bug/living-poster/caracolina.js
- Shows: the poster, alive. The lighthouse on legs stands over the low sun in the bay. It shifts its weight, flexes a knee, lifts a dripping leg like a heron, peers out, and stretches. The sea path shimmers and the sun sinks a hair and comes back.
  - On hover it startles: its legs buckle, it shoots up on tiptoe, its lamp-eye widens and its red cap pops off like a hat.
  - Enter: the player's viewfinder brackets close in as the camera pushes.
  - Loop (6.4 s): focus ring, it poses, the lamp comes on, the shutter irises shut and open, a print slides up, develops and gets taped, then drops away and it is back in the held pose.
  - Squeezed: it crouches, its legs splay against the plate walls, and it glares sideways with a squint and its cap pulled down, huffing.
  - Cue: it kicks a scallop shell out of the water (the throwable, `shell`).
  - Hit: it flinches.
- Made: drawn with the game's look in Canvas 2D, inside one module (`BUG_MODS.caracolina = {…}`), key `caracolina`, no/maker `···`.
  - Why not rendered: the contract forbids images, fonts beyond its list and WebGL, so the game's renderer cannot be used.
  - What it is drawn from:
    - the poster's measured geometry and colours (sun, horizon, legs, tower, island, headland, cove, path);
    - the lighthouse's own build in `src/districts3.js`: white body, one oxblood band, iron gallery, lamp room, red cone, four iron legs with knee balls;
    - the 19:48 light and pencil colour in `src/render.js`.
  - The look follows `src/shaders.js` and `paint.js`:
    - gouache bands with hard, hand-wobbled edges: 16 sky bands round the sun fitted to the poster, a halo laid on in rings, and the sea path as stacked wave dabs;
    - two hard values per surface;
    - a coloured-pencil contour on the tower and legs;
    - pencil hatching on the shaded side of the body and the headland;
    - screen-space paper grain from a precomputed pattern.
  - The HUD is the game's own: the viewfinder outline, corner brackets, thirds, the focus patch, and a print card with the game's washi tape. It has no type, counts, prices or Play, and leaves out the brass shutter button so nothing reads as a button.
  - Item: `shell`, paper `#f3ead7`, brick `#9c4426` ribs and ink `#1d1a33`, all free colours.
  - Card fields: ground `#a47e7e` (the poster's mean colour, free), ink cobalt `#2a55b8`, kind "Seaside photo walk", verb "Look.".
- Agent: living-poster
- Check:
  - **Held frame vs poster.** The reduced-motion and at-rest frame rendered at 2400×1200 gives `measure.py light`: L 0.525 C 0.311, against the poster's L 0.526 C 0.312 (ΔL 0.001, ΔC 0.001).
    - The 900×450 held frame reads the same (L 0.525 C 0.311).
    - Mean luma difference per cell on a 24×12 grid is 5.4/255. The composition is the same: lighthouse at x 0.656, sun disc r 0.08 H behind the top of the legs, horizon at 0.533 H, same island, headland, cove and pier.
    - Side by side: `work/living-poster/compare_poster_vs_held.png` (poster on top).
    - Narrow crops match the poster's own crops around the focus: 120×280 gives L 0.754, the poster crop L 0.759.
  - **Harness.** The creator-pack harness (`harness.py` + `tools/shot.mjs`, seq 500…10000 ms, plus the `rm` mode) shows `errors []`. All six frames and the reduced-motion frame were looked at.
  - **Own driver.** `work/living-poster/tools/lp.mjs` with `specs.json` steps every frame at 60 fps. It covers:
    - plate sizes: 900×450, 900×640, 600×400, 300×600, 160×120, 120×90, 140×305, 577×163 and 900×200;
    - idle over 24 s, near, react, enter, loop at 11 moments, the settle back to idle, squeezed at 4 levels, cue, hit, look, shake, dpr 2, and a live grow and squeeze;
    - `errors []`. Every frame was looked at: `sheet_final_modes.png`, `sheet_final_idle.png`.
    - The cue emits one throw at 0.62 s. The anchor stays on the lamp room (e.g. 0.656, 0.111 at 2:1).
  - **Light during play.** Loop frames read L 0.51–0.54. The single darkening is the shutter iris, once per loop (L 0.30 for about 0.1 s).
    - No brightening flashes: the lamp ramps up over 0.6 s.
    - Nothing flashes faster than 3/s: shimmer periods are 3.7–8 s.
  - **Frame time.** Measured at 600×400 in headless Chromium, which renders canvas with SwiftShader (software emulation) on a shared 2-core machine, so it is pessimistic for a laptop GPU. Per frame, amortised over 150 frames with a raster flush, min–median of 6 trials:

    | Mode | min–median per frame |
    |---|---|
    | idle | 0.46–0.72 ms |
    | react | 0.49–1.16 ms |
    | loop | 0.88–2.3 ms |
    | squeezed | 0.51–1.35 ms |
    | live resize (plate size changes every frame) | 1.9–4.4 ms |

    - The still world is cached in an OffscreenCanvas.
    - While the size changes, a padded copy is re-framed with a uniform scale of at most ±14 % and is never stretched.
    - There are no `getImageData`, no per-pixel loops, no per-frame path clips, no timers, no DOM, no images and no text.
  - **Code scan.** No `window`, `document`, `fillText`, `import`, `export` or timers. `node --check` passes.
- Couldn't:
  - Render the moving poster with the game's own WebGL renderer, because the contract allows only Canvas 2D in one file.
  - Show the game's lettering or counts, which DIRECTION forbids here.
  - The poster's smooth 3D sky and faceted waves are painted as hard-edged gouache bands and dabs, so the 2:1 still matches the poster in composition and light band, not pixel for pixel.
  - Frame time is above 2 ms only in this sandbox's software renderer: the loop median under load, and live resizing.
- Scripts: `work/living-poster/tools/` holds `lp.mjs`, `specs.py`/`specs.json`, `timeit.mjs`, `timeit_resize.mjs`, `sheet.py`, `diffmap.py` and `fitsky.py`, the fit of the sky bands to the poster, which yields numbers only.
