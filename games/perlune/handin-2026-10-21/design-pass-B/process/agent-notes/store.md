# Notes · group: store (agent: store)

Pictures 9, 14, 15 and 16 of DIRECTION.md: the store tiles, the owned mark, the update close-up and the event banner. These are design-only proposals. Nothing is declared, there are no prices, and the game's files and `game.json` were not touched. Every render drives the shipped build (`/home/claude/sivver/dist/perlune.local.html`) through `/home/claude/passB/tools/render.js`. All scripts are in `/home/claude/passB/work/store/`.

## Choices that apply to all four

- **One world.** Everything is on Nacre, the poster's world, so the store row, update and banner read as one place.
- **Proposed looks are rendered by the game at render time.** `work/store/hook.js` wraps the game's own `drawCreature` and swaps the material or colour of one instance (the body or the halo). It uses only the game's meshes (`M.*`), materials (`MAT.*`), colours (`hex`) and ribbon drawing (`FX.strip`). The game is never edited.
- **Fixed clock for staged moments.** In the update and banner renders, `R.time` is set to a fixed value, so a small test render predicts the final one exactly.
- **Leftover state cleared.** Bloom rings and ground ripples left over from the landing (`G.bl`, `G.ripples`) are cleared before staging.
- **render.js carry-over fix (from the coordinator).** Every store view set `exp` and `neb` itself, and none set `bloom` or `sat`, so the store tiles were not affected. I re-rendered four of them with the fixed render.js to confirm: exposure and mean brightness match. The only differences are animation phase (wobble, dust), so the finals stand. The update and banner were rendered after the fix, as single views.
- **No lettering anywhere.** This follows the lead's font note: TiltPrism.ttf is a stub, so the banner is unlettered.

---

## store/opal.png
- **file:** `bug/store/opal.png` (400×400)
- **shows:** The droplet, worn in milky opal with small flecks of colour, standing on Nacre's horizon at night.
- **made by:** Rendered from the game. The look is **proposed**, recoloured at render time by `hook.js`:
  - the body instance (`MAT.LIQUID`) is drawn as the game's `MAT.PEARL` (the material of Nacre's moon), milky tint;
  - 340 small emissive flakes in the game's own accents sit just under the surface (`0x5ff3ff`, `0xff5c9a`, `0x8fb8ff`, `0xff8ad0`, `0x9ff6ff`, `0xc58bff`; no yellow or green, which sit near sun and mint);
  - a thin milky `MAT.GLASS` skin goes over the flakes.
  
  Shown worn on the bare droplet (form 2).
- **render setup:** Same for all five tiles: `build.py`, 400 css at dpr 2, MSAA 4, Lanczos down to 400. Nacre with the other worlds hidden (`solo`), no decor, no world dust, `neb 0.006`, game-style key light from the upper left `[-0.45, 0.62, 0.62]`, `exp 0.75`, `vig 0`.
- **agent:** store
- **check:**
  - At 40 px, as a black fill and in greyscale: reads as a pale speckled sphere with eyes.
  - Its silhouette is the droplet's, the same as smoke-glass (both are skins). The two separate clearly by value in greyscale: pale vs dark.
  - guard: lilac 6×6 largest block; sun 0.00% (no gold); top-left and top-right 90×60 corners have mean luminance ≤ 1/255.
- **couldn't make / caveats:**
  - A proposed look, not in the game.
  - The first flecks read as polka dots. Smaller flakes under a milky skin fixed that.
  - Body emission was kept low so there is no glow around it (no "rarity glow").

## store/smoke-glass.png
- **file:** `bug/store/smoke-glass.png` (400×400)
- **shows:** The droplet, worn in smoked violet glass: a dark sphere with bright catchlights and a coloured rim.
- **made by:** Rendered from the game. The look is **proposed**, made by `hook.js`:
  - the body is drawn as the game's `MAT.OBSID` (dark centre, coloured rim) at 95%, in deep violet;
  - inside a smoky violet `MAT.GLASS` shell;
  - the eyes and their white catchlights are the game's own, untouched.
  
  Worn on the bare droplet.
- **agent:** store
- **check:**
  - At 40 px: a dark sphere with two bright dots. This is the most distinct tile in greyscale.
  - guard: lilac 5×5; sun 0%; corners calm.
- **couldn't make / caveats:** A proposed look.

## store/glass-halo.png
- **file:** `bug/store/glass-halo.png` (400×400)
- **shows:** The Chimera (glass mantle, tall crest), wearing its halo as clear cyan glass instead of gold light.
- **made by:** Rendered from the game at form 11 (the Chimera stage, where the halo exists). `hook.js` replaces only the halo instance: the game's gold `0xffd27a` `GLOW` torus is drawn instead as `MAT.GLASS` in the crest's own cyan `0x9ff6ff`, with a thin cyan `GLOW` ring inside. This is a **proposed** look. Camera raised so the ring opens.
- **agent:** store
- **check:**
  - At 40 px: the ring reads as a small cyan ellipse over the head. The silhouette (ring over a dome) is distinct.
  - guard: sun 0.00% (no gold left anywhere in the frame); lilac 2×2.
- **couldn't make / caveats:** A proposed look.

## store/ribbon-trail.png
- **file:** `bug/store/ribbon-trail.png` (400×400)
- **shows:** A pink-to-cyan ribbon curling on Nacre's ground around and behind the droplet.
- **made by:** Rendered from the game. The ribbon is the game's `FX.strip`, the same call its slick trail uses, laid on the ground:
  - along a curl path (Catmull-Rom through points around the droplet);
  - following the terrain height through the game's own `terrainField`;
  - pink `0xff5c9a` to cyan `0x5ff3ff` (the creature's dust colours) with a pale core `0xfff6e8`.
  
  This is a **proposed** look. It is shown worn: the droplet is the one it follows. Camera higher (`up 2.4`), `exp 0.5` so the ground sits darker than the ribbon.
- **agent:** store
- **check:**
  - At 40 px: a pink-to-cyan hook around a pale bead. The silhouette is distinct.
  - guard: lilac 3×3; mint 0×0 (the cyan end stays clear of mint); corners dark.
- **couldn't make / caveats:**
  - A proposed look.
  - Nacre's ground seen from above is a bright mauve, so this tile is the loudest of the five. Exposure 0.5 tames it.

## store/moonlet.png
- **file:** `bug/store/moonlet.png` (400×400)
- **shows:** A small pearl moon on its orbit line, floating in Nacre's night sky above the world's horizon. It is shown as itself (the plan's choice).
- **made by:** Rendered from the game, drawn in a `js` hook:
  - the moon is `M.sphere` in the game's `MAT.PEARL` with Nacre's moon colour `0xfff2fb`;
  - the orbit is a full ellipse drawn with `FX.strip` as a hairline facing the camera, dimmer on its far side, with the moonlet on its near point;
  - the droplet is not drawn.
  
  This is a **proposed** companion; it never fires and never helps.
- **agent:** store
- **check:**
  - At 40 px: a pearl dot on an oval line. The silhouette is distinct from the other four.
  - guard: lilac 4×4; sun 0%.
- **couldn't make / caveats:**
  - A straight orbit line through the sphere read as a ringed planet. I rejected it, because it also comes close to the other game's purple ringed planet.
  - A one-sided trailing arc read as a ball on a string.
  - The closed ellipse with the moon on its near point is the clearest of the stagings I tried.

**Store contact board:** `work/store/contact-board.png`. It shows each tile at 169 px; at 40 px on night and on linen; at 40 px ×3 with hard pixels; as a black fill (taken from an item-only render of the same view, with ground and sky off); in greyscale; and in a store-row mock. The row under the art and the NEW/YOURS corner boxes are drawn as plain grey bars and outlines, with nothing lettered.

---

## reward-held.png + reward/absorbed.js (owned mark, verb "absorbed")
- **file:**
  - `bug/reward-held.png`: 400×400 transparent overlay for a 400×400 tile;
  - `bug/reward/absorbed.js`: Canvas 2D module. Its only global is `BUG_REWARD = { verb: 'absorbed', ms: 800, draw(ctx, w, h, t), held(ctx, w, h) }`, where `t` runs 0..1 and t = 1 is the held frame. It is documented in its header and also exports through `module.exports` when one exists.
- **shows:** The animation, in order:
  1. A bead of liquid pearl drops into the lower-left corner with two afterimages (the game's dash ghosts).
  2. It splashes four drops, which are pulled back in (absorbed, like matter flying to the droplet).
  3. It spreads with a liquid edge and closes into a small pearl seal.
  4. One ripple runs out (pearl, with a pink/cyan film edge).
  5. The droplet's own small glass crest (`0x9ff6ff`) rises on the seal.
  
  The held frame is a pearl bead with its crest on a soft dark contact shadow.
- **made by:** Drawn in Canvas 2D with the game's material maths flattened to 2D:
  - a pearl dome lit from the upper left, with one horizon reflection and a thin-film fringe in the creature's dust colours;
  - `spring()` echoes the game's `elastic()`.
  
  The held PNG is written by the module itself (`draw(ctx, 400, 400, 1)` in Playwright), so the PNG and the code match.
- **agent:** store
- **check:**
  - `work/store/reward-test.html` plays it on the opal tile (click to replay) and shows the held frame at 169 and 40 px.
  - `work/store/reward-cap.js` captured 18 frames (`rw-t000…rw-t100.png`, strip in `rw-strip.png`) and a real-time play: 801–804 ms over three runs, 48–50 frames, each ending on the held frame.
  - It starts at t = 0 with the bead visible. Every part settles by t = 0.92.
  - Held frame on all five tiles at 169 and 40 px (`work/store/owned-board.png`): reads as a white pearl bead in the lower-left corner on every tile.
  - Bounding box x 8–116, y 280–395: the lower-left only, clear of the top corners.
  - guard on the overlay over night and over mid ground: largest guarded block 1×1, sun 0%. No gold, no glow; the shadow is dark, not bright.
- **couldn't make / caveats:**
  - A first version had a pressed ring inside the seal. It read as a smile, so I removed it.
  - A dark lip ring read like a radio button, so I removed that too.
  - The crest makes the seal the droplet's own mark.

---

## updates/metamorphosis.png + metamorphosis-thumb.png — SUPERSEDED

> Lead, at the bring-together step: this version was replaced by the lead's re-render (see the lead's entry). It moved to `work/store/superseded/`. The text below describes the replaced picture and is kept for the record.

- **file:**
  - `bug/updates/metamorphosis.png` (1600×800);
  - `bug/updates/metamorphosis-thumb.png` (308×154; rendered separately at 616×308 with a closer camera, then reduced).
- **shows:** The instant the droplet becomes the Chimera on Nacre: the gold halo and the tall glass crest have arrived on the glass-mantled body, with wide eyes. Iridescent rings (the game's red, blue and green `ringFx` and its wake bloom) run out across the ground to the horizon, and iridescent particles are in the air.
- **made by:** Rendered from the game and **triggered for real** (`work/store/upd.py`):
  1. Posed one pick short of the Chimera: form 10 (Bead stage), with ten picks in the build: bloom 3, wings 2, lode 2, tail 1, eye 1, mass 1.
  2. The game's own `applyEvo('lode')` takes the 11th pick.
  3. The game is stepped 23 frames: the 380 ms that `applyEvo` waits before the ceremony.
  4. `metamorphosis(2)` is called. `applyEvo` queues it with `setTimeout`, which render.js disables, so I call it directly at the same moment. It runs its own shockwave, ground ripple, wake bloom, three `ringFx` rings and 70 particles.
  5. The game is stepped 12 more frames (`PERLUNE.sim` + `render`, because rings advance at draw time; on a small canvas while stepping) and captured.
  
  Capture choices for a still:
  - no camera shake;
  - the full-screen white flash zeroed for the captured frame;
  - the body caught at the point of its spin where it faces the camera;
  - the instant inside one jiggle period where the body passes through round, so the eyes show;
  - fixed clock; the test bot is off.
  
  Finish as the poster: its key light `[-0.6, 0.45, -0.55]`, `neb 0.03`, `streak 0.45`, `grain 0.01`, `vig 0`. Then `dof 0.12` and `exp 0.42`, because the bloom floods the ground with light. Camera low (`dist 6.2, up 1.05, ty 1.08, fov 0.72`). `theta` keeps the Eclipse out of frame (it would sit where the NEW UPDATE chip goes).
- **agent:** store
- **check:**
  - Viewed at 1600, 308 and 104×52: halo, crest, eyes and the creature read at 104×52; the dedicated thumb reads larger.
  - The central 4:3 crop holds the whole subject (`work/store/upd-crop43.png`).
  - guard: lilac 16×16, mint 7×7, sun 4×4 (the halo is a thin glowing ring), ember 1×1. Thumb: ≤ 6×6.
  - Light band: dark, L 0.159 (poster: dark, L 0.121).
  - No number, date, NEW or the word "update".
- **couldn't make / caveats:**
  - **Staged lower than I wanted.** Higher cameras show the rings as full concentric bands across the ground and read better. But on Nacre the wake bloom mixes the world's pink `0xf6c8ea` with the film sweep into broad pastel-violet and green bands: lilac-guarded up to 54×54 and mint up to 34×34 at 1600. I tried 8 clock values, 6 yaws, 3 spots on the world, exposures from 0.36 to 0.8, a wake of 0.25 to 1.0, and dof 0. None got under 24×24. Changing the game's colours is not allowed, so I lowered the camera: the rings read as the coloured bands at the horizon, and the ground is a thin bright arc.
  - The body is lumpy because the metamorphosis really jiggles it (`P.jig 2`).
  - The build's "mass" core is hidden inside the opaque body.

---

## events/lantern-night-banner.png
- **file:** `bug/events/lantern-night-banner.png` (1720×600, shown 860×300)
- **shows:** Lantern Night. Nacre has gone dark; light is left only around the droplet, where the world's pearl film still shines on the cap and limb. Elsewhere, only Nacre's contour lines and glints glow faintly. The droplet stands on top in the right part.
- **made by:** Rendered from the game and **staged** with the game's own darkness mechanic. On Umbra the planet and sculpture shaders use `u_dark` and `u_lantern`; `render()` sets `R.dark` to 0 off Umbra each frame. So a wrapper around `R.begin` in a `js` hook sets `R.dark = 1` and `R.lantern = 0.042`, the game's own Umbra value at full beat (Umbra varies 0.027–0.042), just before each frame is drawn. That casts Umbra's darkness on Nacre.

  Other staging choices (`work/store/evt.py`):
  - Form 4 (the droplet stage).
  - Leftover landing bloom rings cleared.
  - **Nacre's own atmosphere shell hidden.** The darkness does not reach the atmosphere, and from this distance it drew a lit pink arc across the left part.
  - The world's floating dust hidden, because unlit motes would float over the dark.
  - No other worlds and no Eclipse in frame: its amber corona is a guarded colour, and it is the poster's subject.
  - Camera `dist 22, up 6.5, fov 0.36`, `exp 0.65`, `neb 0.025`, `vig 0`.
  
  **Left 45%: darkened** (my choice): the world's own dark sky and the unlit side of Nacre, not a plate. **Unlettered**: the lockup is optional, and per the lead's font note TiltPrism is a stub.
- **agent:** store
- **check:**
  - **Cover check** (`work/store/banner-board.png`): with the left 45% covered, the right 55% shows the droplet alone on a dark world lit only around it.
  - **Mock** at 860×300 and 1720×600 (`work/store/banner-mock-860.png`, `banner-mock-1720.png`): LIVE EVENT chip, "Lantern Night", the proposal's line, `···` for the undecided count and dates, and the platform's Join. The copy and Join sit on dark, calm ground.
  - **guard:** whole picture lilac 1×1, everything else 0. The Join zones are clean: the bottom 40% of the left 45% (lilac 0.00%), and the far-right 12% (no guarded pixels).
  - **Light band:** dark, L 0.062.
  - **Different from the poster:** the droplet is on the ground of a darkened world, not facing the Eclipse in space.
  - No counter, no lettering.
- **couldn't make / caveats:**
  - **The darkness is staged:** the build does it only on Umbra.
  - **The pool is soft, not a hard spotlight.** Nacre's base ground is dark purple even when lit; its brightness comes from the pearl film at grazing angles. Under the game's own lantern falloff, the pool reads as the lit cap and limb around the droplet, fading to near black.
  - **The droplet is small** (~50 px at the shown size), so the dark world reads around it.
  - The square glints on the dark ground are Nacre's own `u_glint` sparkles. They shimmer in play; here they are frozen.
