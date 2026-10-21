# Perlune design pass B · shared tools

Everything here renders or checks pictures **from the game itself** (the shipped build at
`/home/claude/sivver/dist/perlune.local.html`, source in `/home/claude/sivver/src/`). Never edit the game.
Node needs `export NODE_PATH=/home/claude/.npm-global/lib/node_modules`. Headless Chromium + SwiftShader is slow-ish
and the machine has 2 CPUs shared by several agents: render small tests (800×400 @1) first, finals once.

## render.js — posed stills with the game's own WebGL2 renderer
`MSAA=4 node /home/claude/passB/tools/render.js <cssW> <cssH> <dpr> <outPrefix> '<json list of views>'`
writes `<outPrefix>-<id>.png` at cssW*dpr × cssH*dpr. Read the header of render.js for every field. Key ones:
- `world` nacre | ferrum | cathedra | hydrargyra | umbra | geode. A new `world` (or a new `cleared` string) reloads the page.
- `form` 0–30 sets the body: 0–4 droplet, 5 BEAD (glass mantle), 11 CHIMERA (gold halo + tall crest), 18 COMET (tail), 25 NOVA (inner star). `build` {evoId: level} adds anatomy (ids in src/content.js EVOS).
- `pn` where it stands; `theta` turns it so the Eclipse is behind; camera `dist up side fov dx ty`; eyes `lx ly`, `joy`.
- `solo` (+`keep`), `noRings`, `ownRings`, `sunburst` (number = strength), `nodecor`, `nodust`, `neb` (sky contour lines), `light` [right, up, toward camera].
- `enemies` [{t, d, a}] spawns real foes; `js` / `jsPost` run any JS in the page (full access to G, P, R, PERLUNE, spawnEnemy, bloomAt, ringFx, startFinale …).
- `vig` defaults to 0: **never a vignette**.

`pose.py` · `pn(world, k)` = the spot on a world from which the Eclipse stands atan(k) above the horizon.
`titlejs.py` · `titlejs(...)` stages the creature the way the game's TITLE SCREEN does (floating 5.5 above a world, title scale 1.0, its pink/cyan dust ring). **The poster was made with this.**
`spacejs.py` · lifts the creature into the space glide (works, but its body reflects a different environment; check it).

## The poster's finish (copy it)
`bug/poster.png` was rendered with: world nacre, form 2 (bare droplet), solo + keep umbra, noRings umbra, ownRings false,
sunburst 0.2, neb 0.03, nodecor, light [-0.6, 0.45, -0.55] (from the Eclipse side, upper left), eyes lx -0.7 ly 0.9,
vig 0, grain 0.01, streak 0.45, dof 0.55, bloom default; titlejs(up_dir=pn('nacre',0.3), cam=-0.33, face=-0.2, dist=5.6, up=1.1, fov=0.62, side=0.8, ty=0.25),
800×400 css at dpr 2. Views are in `/home/claude/passB/work/poster/poster-views.json`.

## Checks
- `python3 /home/claude/passB/tools/guard.py <png> [--zone bottom:146] [--map out.png]` → where ember / lilac / sun / mint sit (ΔE2000 < 12 guarded), share in a zone, and the largest solid guarded block. A guarded colour must never be a flat block ≥ 24×24 and never sit where Play, Join, a price, YOURS/NEW or a selected state sits.
- `python3 -I <PACK>/tools/measure.py colour '#RRGGBB' …` (always with the #) and `measure.py light <png>`.
- `python3 <PACK>/tools/wall.py <poster> --title "Perlune" --focus 0.60,0.50 --icon <icon>`.
  PACK = `/tmp/claude-0/-home-claude/abf4d099-0c77-5d2d-a155-12d3f9d77b55/scratchpad/packB/bug-games-design-pass-B`
- Fonts: the game's own faces (Tilt Prism display, Syne UI, Martian Mono) are **not available here**. The files in `/home/claude/video/fonts/` are 378-byte download-error stubs, and every font source is blocked. Lettering uses the game's published cover/trailer wordmark face, TeX Gyre Adventor Bold (`/usr/share/texmf/fonts/opentype/public/tex-gyre/texgyreadventor-bold.otf`), with the iridescent sweep. The pack's board fonts are in `<PACK>/tools/fonts/`.

## Reference scripts (drive the game; reuse code, never pictures)
- `/home/claude/video/shots.js` + `cap.js`: the trailer's scripted shots (finale, Cathedra, bosses, space glide, metamorphosis…). Their `setup` strings show how to stage real moments with the game's own functions.
- `/home/claude/sivver/*.js` (r3.js, r3g.js, features.js, finale.test.js, space.test.js…): smoke tests that drive journeys, bosses, the finale, the awakening.
- `/home/claude/pkgtools/drawkit.py`: a numpy port of the game's materials (liquid / chrome / pearl / glass sphere, env, thin-film, bloom) for drawing small marks at 8× and reducing. Code only: no earlier pictures may be reused.
