# Seals · notes (agent: seals)

## Plan lines (written before drawing)

`game.json` does not exist yet, so the game declares no moments. These are the **proposed** moments from `design.json` → `moments`. Each is a thing the current build really records:
- `STAGES` in `content.js`: the stage reached in a journey (BEAD, CHIMERA, NOVA);
- `BOSS_DEFS.bell`: the first world-heart unmade;
- `geodeComplete()` in `flow.js`: the Geode opened (`G.run.geode`);
- `updateFinale()`: the finale reached (adds `codex.forms`, `meta.journeys++`);
- `RESON` and `meta.res`: the 10 resonances;
- `FORMS`: the 4 final forms;
- `STARS` and `meta.lit`: the 11 stars of the constellation.

`lantern-night` is the proposed event (design.json → event). None of this is declared in the game. When a `game.json` is written, its moment ids must match these file names, or the seals must be renamed to match.

| id | kind | outline | glyph (as drawn) | hot accent |
|---|---|---|---|---|
| bead | feat | round pearl ring | the droplet (pearl body, two eyes, cyan glass crest) resting inside its offset glass mantle | glass cyan |
| halo | feat | round pearl ring | the droplet with a tilted ring of white light floating above its head; its tall crest pokes up behind the ring | dust magenta |
| nova | feat | round pearl ring | a four-point star of light inside the bead's clear glass mantle | glass cyan |
| bell | feat | round pearl ring | the Bell of Nacre, seen a little from below: chrome body, dark mouth with its glowing ring, pearl clapper | dust magenta |
| geode | feat | round pearl ring | a tall six-sided glass crystal point, cracked across, its heart glowing through the crack | glass cyan |
| star | feat | round pearl ring | the Eclipse's dark obsidian disc, a magenta limb, and one bead of white light breaking out of the limb (the droplet becoming a star) | dust magenta |
| resonances | collection | six-sided glass facet ring | two linked rings: one pearl, one glass lit from inside | glass cyan |
| forms | collection | six-sided glass facet ring | four beads on one tilted orbit with no body in the middle: quicksilver, dust, glass, pearl | dust magenta |
| constellation | collection | six-sided glass facet ring | three stars of the game's own map (Warm Start, Resonant Memory, Stardust Tide, at their real x/y), joined by their two real lines | glass cyan |
| lantern-night | event | 12-ray corona | Nacre gone dark under the Eclipse's shadow; one pool of light with the droplet's spark at its centre | dust magenta |

## Pictures

All 30 files are 192×192 RGBA PNGs with the seal centred and transparent corners. There is one entry per seal; the three states share one entry because they are the same art.

Made by, for every seal: **drawn in the game's code**, not rendered. `work/seals/seals.py` draws each seal at 8× (1536 px) and reduces it with premultiplied Lanczos. It uses the game's own maths:
- the material terms of `engine.js` SCULPT_FS (chrome m0, pearl m1, glass m2, glow m3, obsidian m4, liquid m6), via the numpy port in `/home/claude/pkgtools/drawkit.py`;
- the studio env and thin-film from GLSL_ENV (ENV_SPACE for cyan seals, ENV_NACRE for magenta ones);
- the game's ACES grade;
- for the in-progress state, the planet shader's not-yet-awake grade (PLANET_FS).

Shapes are signed-distance fields with per-shape normals. Game data used as-is: the bell's lathe profile (`game.js bellProfile`), the droplet's eye, catchlight and crest layout (`drawCreature`), the Bell's glow torus colour `#ff2e88` → dust magenta, Nacre's palette p0–p3 and its `u_dark`/`u_lantern` darkness, and the constellation stars' x/y and links (`content.js STARS`). Nothing earlier was reused, cropped or traced.

- **file:** `bug/seals/bead-earned.png`, `bead-progress.png`, `bead-locked.png`
  - **shows:** the droplet resting inside its glass mantle.
  - **made by:** drawn in code (see above): liquid pearl droplet with eyes and crest, glass mantle with a cyan thin-film edge, pearl ring.
  - **agent:** seals
  - **check:** see Checks.
  - **couldn't make / caveats:** proposed moment (no game.json).
- **file:** `bug/seals/halo-earned.png`, `-progress.png`, `-locked.png`
  - **shows:** the droplet with a ring of light floating above its head.
  - **made by:** drawn in code. The game's halo is gold `#FFD27A` (a guarded colour that must never mean earned), so the seal's halo is pearl-white light with a dust-magenta glow. The crest is drawn pale glass, not cyan, so the seal keeps one accent.
  - **agent:** seals
  - **check:** see Checks.
  - **couldn't make / caveats:** the halo is deliberately not the in-game gold. Proposed moment.
- **file:** `bug/seals/nova-earned.png`, `-progress.png`, `-locked.png`
  - **shows:** a four-point star of light inside the bead's glass mantle.
  - **made by:** drawn in code (glass sphere, emissive faceted star, cyan inner light).
  - **agent:** seals
  - **check:** see Checks. The first two tries failed at 32 px: a big star read as a plain white diamond, and a star in a dark liquid bead read as a lone sparkle. Placing the star inside the clear mantle (the Nova keeps the Bead's mantle in the game) reads at 32 px in all three states.
  - **couldn't make / caveats:** the game draws the Nova's star above the halo. The seal puts it inside the bead, as planned ("a small star has lit inside the droplet"). Proposed moment.
- **file:** `bug/seals/bell-earned.png`, `-progress.png`, `-locked.png`
  - **shows:** the Bell of Nacre with its glowing mouth and pearl clapper.
  - **made by:** drawn in code from the game's `bellProfile` (PCHIP-smoothed), chrome `#fff0f8`, seen slightly from below.
  - **agent:** seals
  - **check:** see Checks.
  - **couldn't make / caveats:** two changes so it reads as a bell at 32 px, not a cone:
    - the crown is widened up to ×1.3, fading out by the waist;
    - the clapper hangs a little lower than in the game, and the glow torus sits just inside the lip.
- **file:** `bug/seals/geode-earned.png`, `-progress.png`, `-locked.png`
  - **shows:** a six-sided glass crystal point, cracked, its heart glowing through the crack.
  - **made by:** drawn in code. Faceted glass with constant facet normals; faces turned away from the key light are darker.
  - **agent:** seals
  - **check:** see Checks.
  - **couldn't make / caveats:** the game's Geode crystals are stretched octahedra in violet `#c77dff` and cyan. Violet sits near lilac, so the seal uses clear and cyan glass only. Proposed moment.
- **file:** `bug/seals/star-earned.png`, `-progress.png`, `-locked.png`
  - **shows:** the Eclipse's dark disc with one bead of white light breaking out of its limb (the "diamond ring").
  - **made by:** drawn in code: an obsidian disc (SCULPT_FS m4 terms, with a crisper limb exponent), a magenta limb, the bead of light, and the lens's horizontal streak.
  - **agent:** seals
  - **check:** see Checks.
  - **couldn't make / caveats:** the plan said "a dark disc in a broken ring of rays". The rays went to the event outline (the 12-ray corona), so the feat stays clearly apart from the event at 32 px. The broken ring is now the limb, broken by the bead of light. The Eclipse's amber and violet rings are left out (guarded colours).
- **file:** `bug/seals/resonances-earned.png`, `-progress.png`, `-locked.png`
  - **shows:** two linked rings, one pearl and one glass lit from inside.
  - **made by:** drawn in code (tube normals, over/under crossing).
  - **agent:** seals
  - **check:** see Checks.
  - **couldn't make / caveats:** proposed moment.
- **file:** `bug/seals/forms-earned.png`, `-progress.png`, `-locked.png`
  - **shows:** four beads on one tilted orbit, one per final form: quicksilver, dust (magenta), glass and pearl.
  - **made by:** drawn in code, with no body at the centre, so it never reads as a ringed planet.
  - **agent:** seals
  - **check:** see Checks.
  - **couldn't make / caveats:** proposed moment.
- **file:** `bug/seals/constellation-earned.png`, `-progress.png`, `-locked.png`
  - **shows:** three stars of the game's constellation map, joined by their real lines.
  - **made by:** drawn in code at the STARS x/y of `warm` (56,70), `resmem` (72,48) and `tide` (90,62). Lit stars are white with cyan light; the game's lit-star glow uses gold `#ffd27a`, which is left out.
  - **agent:** seals
  - **check:** see Checks.
  - **couldn't make / caveats:** proposed moment.
- **file:** `bug/seals/lantern-night-earned.png`, `-progress.png`, `-locked.png`
  - **shows:** a dark world with one pool of light around the droplet's spark, inside a 12-ray corona.
  - **made by:** drawn in code. The world uses PLANET_FS maths: Nacre's p0–p3 bands, its contour lines, and `col *= mix(1, 0.06 + 0.94·lant, u_dark)`.
  - **agent:** seals
  - **check:** see Checks.
  - **couldn't make / caveats:** proposed event (design.json). The count and dates are undecided, and nothing is painted for them.

## Choices

- **Corners are transparent, not night.**
  - The page draws seals on dark panels (`#141019`, sampled from the profile reference). With transparent corners the outline itself is the silhouette: round, hexagon or spiky corona. That is the strongest cue at 32 px.
  - Night corners would make every seal the same dark square, and the outline would have to compete with the square's edge.
  - Inside the outline each seal carries its own night (`#05040A` lifting to `#2A0B4D` toward the upper left, with the sky's faint contour lines). The glyph never depends on the panel, and the seals also read on a light ground (`work/seals/strip-32-light.png`).
- **Outlines by kind:**
  - **feat:** round pearl tube ring. Pearl terms, with the thin-film phase sweeping round the ring like nacre.
  - **collection:** pointy-top hexagon in glass, 6 sides × 3 cut facets (outer bevel, crown, inner bevel), with a hairline of light on the facet edges.
  - **event:** 12 faceted pearl rays (the Eclipse's twelve orbiting octahedra) on a pearl ring. It is the only spiky silhouette, so the event seal stands apart from every moment seal at 32 px.
- **One hot accent per seal:** glass cyan `#5FF3FF` (bead, nova, geode, resonances, constellation) or dust magenta `#FF5C9A` (halo, bell, star, forms, lantern-night), five each.
  - The env follows the accent: cyan seals reflect the default studio (cyan bands), magenta seals reflect Nacre's studio (pink bands). This keeps a second hot colour out of the reflections.
  - No gold. Nothing in `#FFD27A`, `#FFB52E`, `#C9A8FF` or `#B28CFF`.
- **Thin-film sweep:** the game's cosine thin-film palette is used only along its pink–violet–cyan arc, which is the poster droplet's sheen. Its green–yellow arc is left out. That arc is what put pixels near mint and sun on the first renders (up to 0.9% mint and a sun pixel on the bell); after the change both are 0.00%.
- **Light:** key from the upper left (the poster's side), with a thin-film rim light on surfaces turned that way. Bloom and the lens's horizontal streak apply only to what emits.
- **The three states:**
  - **earned:** the lit world. Full colour, bloom, iridescent rim, one accent.
  - **in progress:** the same art through the planet shader's not-yet-awake grade (PLANET_FS: `col = mix(lum·(0.9, 0.88, 1.08), col, mix(0.2, 1, viv)) · mix(0.74, 1, viv)`).
    - Emissive parts run at 40% until awake, as the world's lines do (`line·u_line·mix(0.4, 1, viv)`).
    - Colour has come back inside one bloom at the lower left, with the wake ring at its front in the seal's own accent.
    - The bloom is the same on every seal, so it never reads as an amount.
  - **not yet:** flat and calm. A quiet grey outline in the seal's kind shape (`#4C4A58`), the symbol in flat grey (`#67657A`) with cut-outs (eyes, crack, mouth) in night (`#0B0A11`), and no shading or glow. Glass parts become a grey band.
- **Why drawn, not rendered with render.js:** at 32 px a posed 3D render brings perspective, scene and dust noise. Drawing with the game's material maths keeps one clean glyph and the same light on all ten. The shapes that matter (the bell profile, the droplet's face, the constellation's map, Nacre's palette) are the game's own data.
- No lettering, numbers, padlock or frame inside any seal.

## Checks (on the final files in `bug/seals/`)

- **Format:** 30 files, all 192×192 RGBA. Corner alpha is 0 and the inside is opaque.
- **32 px strip:** `work/seals/strip-32.png`, viewed at 1×, and `work/seals/strip-32-x4.png` (4×, nearest pixels).
  - All ten seals in all three states, on the page panel `#141019`.
  - The three outline kinds are distinct in every state: smooth circle, flat-sided hexagon, and 12-spike corona. The corona is the only spiky silhouette, so the event stands apart.
  - Every glyph reads at 32 px: a face in a bubble, a face with a halo, a star in a bubble, a bell, a cracked shard, a dark disc with a spark on its limb, two linked rings, beads on an orbit, three joined stars, and a dark disc with a centre light.
  - The rows read apart too:
    - earned has accent glows and the iridescent rim;
    - in progress is grey, dimmer, with colour back at the lower left;
    - not yet is flat grey.
  - Redone along the way: nova twice (it read as a white diamond, then as a lone sparkle), the bell (it read as a cone or hat), forms (a squiggle), the star's and lantern-night's locked states (a plain circle, a gear), and two glows cut off by a straight edge (constellation, forms).
- **Other sizes:**
  - `work/seals/board-96.png` (96 px board) and `board-48.png` / `board-64.png` (page sizes) all hold.
  - `work/seals/strip-32-light.png`: the seals also read on a light ground.
- **Guard:** `python3 /home/claude/passB/tools/guard.py` on every earned seal, both the raw file and composited on the panel (`work/seals/check.sh`; output in `work/seals/check-final.txt`).
  - **ember, sun, mint:** 0.00% on all ten, raw and on the panel.
  - **lilac:** at most 4.5%, only as thin pearl-sheen arcs. The largest solid block of any guarded colour is 4×4 px (limit 24×24).
  - The in-progress and locked files on the panel: sun, mint and ember are 0.00%, and lilac is at most 1.1%.
- **`measure.py colour`** (`python3 -I <PACK>/tools/measure.py colour …`):
  - glass cyan `#5FF3FF`: ember 59.6, lilac 34.2, sun 43.0, mint 16.8. Caution, not guarded. It stays a glow, never a fill, and no cyan pixel in any seal measures guarded against mint.
  - dust magenta `#FF5C9A`: ember 25.5, lilac 28.9, sun 54.2, mint 71.0. Free.
  - pearl `#F4F8FF`: free (lilac 21.4).
  - glass tints `#E6FBFF`, `#D8FAFF`, `#CFF8FF`, `#9FF6FF`: free, or caution against mint at 16.5–21.
  - bell chrome `#FFF0F8`: free.
  - Nacre line `#F6C8EA`: lilac 15.3, caution. It is used only as thin lines inside the lantern pool.
  - night `#05040A` / `#2A0B4D`, sky lines `#5B3A8A`, locked greys `#4C4A58` / `#67657A` / `#0B0A11` / `#2E2C39`: free.
- **Rebuild:** `python3 /home/claude/passB/work/seals/seals.py --ss 8 --out <dir>` (about 90 s for all 30). Boards: `python3 /home/claude/passB/work/seals/board.py <dir> <out>`.
