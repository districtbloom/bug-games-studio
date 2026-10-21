# Buqu Will Not Bow · moving poster

`buqu.js` is one classic-JavaScript module for the living For You board (LIVING_POSTER_CONTRACT v1). It does one thing: `BUG_MODS.buqu = { … }`.

| field | value |
|---|---|
| key | `buqu` |
| no / maker | `···` / `···` (bug.games sets them) |
| title | Buqu Will Not Bow |
| kind / verb | Head-flinging / Fling. |
| ground | `#8a6db8` (the gate sky's dusk violet, free colour) |
| ink | `#b3283d` (the mark crimson; the game's vermilion is guarded near the caption chip) |
| item | `braidTile`: one white tessera off the end of his braid, on its grout bed, with the jade ribbon (≈ 25 × 17 px) |
| rants / hits | `hmph!`, `#@$%!`, `never!` / `hmph!`, `#@$%` |

Canvas 2D only. No images, no DOM, no timers, no network, no globals, no `Math.random` (it uses `api.rnd`). It draws every pixel of the plate each frame.

## What it shows

**Held frame = the poster.** Buqu's head howling across the Last Gate sunset: the gate sky set (`#1d2a70 #3a4aa0 #8a6db8 #ec8e78 #f9bf8a`) laid as brick-bond tiles stepping from indigo to coral, the gate sun (`#ffb070`) as concentric rings of radial tiles with its outer ring of glazed rays behind-right of his face, karst crags with the distant wall on their crests and pale domes behind, a turquoise hill, the white mist belt, his vermilion trail coming in from the left edge, his white braid with the jade ribbon. Rotation −14°, howl, light from the sun in tile steps (warm on the sun side, lilac on the far side), as the poster.

It recomposes for any plate from the three poster layouts (`passwork/poster/layout_*.json`): head centre, radius, sun offset and radius are keyframed on the plate's aspect (1:2.2 … 2:3 … 1:1 … 2:1 … 3.5:1) and scaled with `min(w, h)`; the sky's glaze is set by height above the plate's bottom (fitted to the poster), so tall plates get the poster-2x3 indigo top and wide ones the poster's violet. Nothing stretches; there are no bars. `anchor()` returns his face.

**Motion, in the world's gait**
- **idle** (14 s cycle): hold the poster pose 3.2 s (only the sun's ray ring creeps, clouds drift, the braid's travelling sway) → live 4.2 s (blink, a bob of flight with a ripple along the trail, a glare out at you, cheeks filled, a bigger howl) → hold 3.1 s → live 3.5 s (a glance back at his trail, a blink, a gust he grits through) → howl. As `near` rises he stops howling and glares out toward the viewer.
- **react** (0.8 s): squash and grit (anticipation) → stretch into a bigger howl, mouth wider, the braid whipping → hold with a shudder; pupils follow the cursor.
- **enter** (0.7 s): he is flung on along his own flight line (−25°, the poster's); the camera whips with him and pulls back, the crags rush past, the trail lays new tesserae behind him while the poster's trail stays where it was laid and dissolves from its tail (paint.ts), and the Great Wall rises into frame. No fades.
- **loop** (6 s, seamless): real play on the Last Gate wall walk. He skims and bounces (squash on contact, the game's faces: glare, grit before landing, fear at the net, howl on launch, bliss at the top), paint chips splash on each impact, the flight arcs are laid as vermilion tiles every 2.6 units and dissolve from the tail (paint.ts rules), lantern strings swing as he passes, he bonks a net guard on the hat (the guard topples) and a gold-rimmed seal pops behind him, he spins through a big arc collecting coins, a seal is stamped on the walkway where he lands, and the best throw's ghost dots hang in the sky. No HUD numbers. Returns to the held pose with a quick physical settle (the wall drops away, the trail is re-laid tile by tile).
- **squeezed**: pressed against the plate's edge, cheek and nose flattened on it, glaring at the neighbour, braid flattened back; with time he fills his cheeks, pulls back and slams into the edge (paint chips flake off his frill), again and again, escalating with `squeeze`.
- **events**: `cue` → he whirls his braid like a sling and throws its end tile (`braidTile`) at 0.8 s, then looks smug while the tile is re-laid; `hit` → knocked away from the impact (fear → grit → a glare back at where it came from, chips fly); `look` → eyes and head turn that way for 1.5 s; `shake` → a wobble with fear then grit.
- **reduced motion** (`s.rm`): the held poster frame, still; events don't animate (a cue still throws on time).

No brightening flashes, no whole-frame colour shifts, nothing flashing faster than 3 a second, nothing gory (the neck is a frill of paint), no text.

## How it is made

A canvas port of the game's own drawing code, not the game's renderer:
- head: `src/art2/msprites.ts` `headTex` geometry for howl, glare, grit, fear, bliss, smug, puff (+ a blink), cut into tesserae once in `create()` (Voronoi cells on flow rows for skin and hair, Voronoi for fine parts, rows of tiles along tapers and strokes, flowing rows for the hair cap), lit per tile as `tools/pass/p_poster.ts` lit the poster's head, each tile inset by the grout;
- braid: `src/game/head.ts` (a chain of white quads on a grout bed, jade ribbon on the last two, verlet with the game's damping);
- trail and chips: `src/game/paint.ts` `stroke`/`flush`/`splat`, and the poster's ribbon rule from `tools/pass/compose_poster.py`;
- sky and sun: `src/render/post.ts` (brick-bond sky, ring/segment sun with its outer ring of rays and grout seams) with the composite grade (saturation 1.1, contrast 1.05) and `SKIES.gate`;
- crags, domes, mist and the distant wall: `src/paint/layers.ts` (`peak` crag with the gate PD glaze, contour courses, strata, crest line, `distantWall`, `billow`);
- Great Wall: `src/paint/terrain.ts` gate palette (parapet with crenels, walkway, ink band, slate/indigo courses, plinth, ridge courses);
- guard, lanterns, coins, seals: `figureTex('netguard')`, `lanternTex`, `coinTex`, `sealTex`.

The cut tiles are shared between plates. Static layers (sky, crags, clouds, wall, sun disc) are painted once into OffscreenCanvas strips at the plate's exact device scale and blitted 1:1 (a scaled blit costs ~10× more in software GL); a head or trail that holds still is kept as device pixels too. While a plate resizes, strips are drawn scaled and re-cut once its size settles. Without OffscreenCanvas everything is drawn directly with coarser tiles (correct, but ~15 ms a frame).

## Sizes tested

Held frame: 1600×800, 800×1200, 1000×1000, 900×640, 760×380, 740×370, 600×400 (dpr 1 and 2), 577×163, 300×200, 260×367, 150×177, 150×290, 140×305, 120×90, 90×70. Harness: all six plates (760×380 live hover, 560×380 auto cycle, 150×370 tall with `near`, 270×370→120×280 squeezed, 420×370 cue/hits, 120×90↔400×370 resizing), seq 0.5–10 s and `rm`: zero console errors.

## Frame time

Measured in headless Chromium (software GL / SwiftShader) on a shared 2-core machine, wall clock over 200 frames including raster, `frame()` at 600×400 dpr 1, low load: idle ≈ 1.3–1.5 ms, loop ≈ 1.1–1.5 ms, squeezed ≈ 1.6–1.9 ms, while the plate resizes every frame ≈ 2.7–3.4 ms. Under heavier load from other jobs the same runs read 2–4 ms. 900×640 ≈ 2.6–3.2 ms idle. First frame of a plate ≈ 110–150 ms (cutting the head ~25 ms once for all plates, the sky ~17 ms and crag strip ~29 ms per plate). A laptop GPU should be well under these software-GL numbers.

## How the held frame matches the poster

Checked side by side at 2:1, 2:3 and 1:1 (`passwork/checks/living-poster/held-vs-poster.png`): same composition (head across the sunset, sun behind-right of the face, braid up-left to its bead, trail from the left edge into the back of his head, crags and mist along the bottom), same palette and tile finish. Light band (measure.py): poster 2:1 L 0.595 C 0.305 / held L 0.604 C 0.338; 2:3 0.566/0.274 / 0.587/0.320; 1:1 0.587/0.284 / 0.621/0.314; the loop stays in the same band (L 0.549 C 0.284). Differences: tiles are cut by this port, not by the game's tessellator, so their exact shapes differ; the crags are the port's own arrangement in the poster's places.
