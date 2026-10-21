# Perlune · design pass B · notes

Made by the chat that built Perlune, on 20 Oct 2026, in one pass. Every picture here is new: none of the earlier cover, key art, trailer stills, pilots or store art was reused, cropped, traced or repainted. Every picture is either:
- rendered by the game's own WebGL2 renderer, driving the shipped build headless with posed cameras and the game's own functions; or
- drawn in code with the game's own material maths and palette, where noted.

The game's code and its (missing) `game.json` were not changed.

## Style note (every picture follows this)

- **Medium:** real-time 3D sculpture from the game's own WebGL2 renderer. Glossy materials (liquid pearl-chrome, clear glass, obsidian, pure glow) all mirror one procedural "studio". Thin-film iridescent rims, HDR bloom on emissive parts, horizontal anamorphic streaks, a miniature lens with shallow focus. Night is never black-black.
- **Line:** no ink outlines anywhere. Lines exist only as light: thin neon contour lines in the sky, contour bands on the worlds, rays, orbit hairlines.
- **Main colours:**
  - night `#05040A` → `#2A0B4D`;
  - pearl `#F4F8FF` (the droplet);
  - glass cyan `#5FF3FF`;
  - dust magenta `#FF5C9A`;
  - the Eclipse's own amber `#FFB52E` and violet `#B28CFF`, which only ever appear as glows and rings, never as fills.
- **Light:** the key comes from the upper left. In a picture with a source, it comes from that source (the Eclipse, the halo, a lantern pool). Bloom only on what emits.
- **Characters:**
  - the droplet: a liquid pearl-chrome bead with two big dark eyes and a small cyan glass crest. It grows a glass mantle, a gold halo, a comet tail and an inner star as it changes.
  - faceless sculptural foes, each with one hostile glow;
  - five world-hearts;
  - the Eclipse.
- **In one sentence:** Perlune is a roguelite shooter in which a droplet of liquid metal, glass and magnetic dust lands on small worlds, absorbs what it breaks, grows new organs with every change and, at the Eclipse, becomes a star.

## Plan (written before making anything)

**Poster register:** stage (one lit pocket in the dark). One image in five words: **"A droplet faces the Eclipse."** It is staged the way the game's own title screen stages its creature: floating above Nacre at title scale, with the title's pink/cyan dust. The Eclipse hangs upper left as the only light, and the droplet's rim is lit from that side. Inks: night, pearl, the Eclipse's violet and amber.

**PLAN FIRST lines:**
- **Continue picture (`key-still`):** on Ferrum Dunes mid-harvest, a ring of iron moths closes on the droplet, which turns to face them. The subject is in the middle.
- **Gallery (6, in this order; captions ≤60 characters):**
  1. Core loop: "Shoot, and drink the matter your foes leave behind."
  2. Second mechanic: "Every change grows on your body: wings, crowns, eyes."
  3. A place: "Cathedra, the glass garden, one of five small worlds."
  4. A character: "Each world has a heart, and every heart fights back." (a world-heart in its own world)
  5. The glide: "Launch, then glide between worlds through rings of light."
  6. The payoff: "At the Eclipse, the droplet becomes a star."
  
  No co-op slide (the game is solo).
- **Seals: one glyph per moment.** `game.json` does not exist yet, so it declares no moments. The seals are drawn for **proposed** moments, each one a thing the current build really records (stages, world-hearts, the Geode, the finale, the Codex). They are listed in `design.json` → `moments`.

  | moment | kind | glyph |
  |---|---|---|
  | `bead` | feat | a pearl inside an offset glass shell |
  | `halo` | feat | a tilted ring floating over a bead |
  | `nova` | feat | a four-point star inside a bead |
  | `bell` | feat | a bell |
  | `geode` | feat | a cracked six-sided crystal |
  | `star` | feat | the Eclipse: a dark disc in a broken ring of rays |
  | `resonances` | collection | two linked rings |
  | `forms` | collection | four beads on one orbit |
  | `constellation` | collection | three stars joined by lines |
  | `lantern-night` | event | one light inside a dark disc |

  Outline by kind: feat = round pearl ring; collection = six-sided glass facet; event = a 12-ray corona.
- **Store (how each reads at 40 px):**
  - `opal`: the droplet worn in milky opal with colour flecks, a pale sphere with two eyes;
  - `smoke-glass`: the droplet in smoked violet glass, a dark sphere with bright catchlights and rim;
  - `glass-halo`: a clear cyan glass ring above the droplet;
  - `ribbon-trail`: a pink-to-cyan ribbon curling behind the droplet;
  - `moonlet`: a tiny pearl moon on a thin orbit line, shown as itself.
  
  Owned-mark verb: **absorbed**. A bead of liquid pearl lands in the tile's lower-left corner and closes into a small pearl seal with one ripple.
- **Pass rewards and step unit:** pass **"Pearl Orbit"**. The step unit is **a world woken** (a world whose heart falls and whose colour floods back).
  - free: `mote-trail` (pink dust motes follow), `pearl-crest` (the glass crest turns to pearl);
  - pass: `nacre-skin` (mother-of-pearl body), `prism-halo` (the halo splits light), `ringlet` (a small ring of pearl dust circles the droplet, no effect);
  - bug.pass: `eclipse-blink` (the eyes become two tiny eclipses for a moment).
  
  Marker: a matter gem from the world; next = spinning over the cell, held = settled into a pearl ring.
- **Update (one change):** **Metamorphosis**, a change already in the build (round three). It is a close-up of the instant the droplet becomes the Chimera: the gold halo and tall glass crest arrive and iridescent rings run out across the ground.
- **Event:** **Lantern Night**. The Eclipse's shadow falls on every world: the ground goes dark except the pool of light around the droplet (Umbra's own darkness mechanic, cast on Nacre). Shared goal: wake worlds together. Count and dates are UNDECIDED.


## Pictures

One entry per picture, by group. Paths are relative to `bug/`. The scripts that made each picture are in `make/` (the shared tools are in `make/tools/`; each group's scripts and exact views are in `make/work/<group>/`). `make/work/` holds scripts and views only: the work images the group notes mention (test renders, maps, extra boards) stayed in the workspace. The key boards are in `checks/` (JPG copies of the boards each check produced; `checks/guard-all.txt` is the guard.py table for every picture).


---

## Poster, focus point and the update redo (lead)

#### poster.png · poster-2x3.png · poster-1x1.png · publish.json

**Files**

| file | size |
|---|---|
| `poster.png` | 1600×800 |
| `poster-2x3.png` | 960×1440, recomposed |
| `poster-1x1.png` | 1200×1200, recomposed |
| `publish.json` | `{"focus": {"x": 0.60, "y": 0.50}}` |

**What it shows:** "A droplet faces the Eclipse." The bare droplet (the first stage, before any mantle or halo) floats in the dark, turned up-left toward the Eclipse, the only light in the picture.
- The Eclipse is upper left: a dark disc with amber contour veins, its amber ring, violet aura and faint rays.
- The droplet's rim and highlight band are lit from the Eclipse's side.
- The ground is the game's night sky, with its contour lines at a whisper and the title screen's pink and cyan dust around the droplet.
- Register: stage. Inks: night, pearl, the Eclipse's violet and amber.

**How it was made:** rendered by the game's own WebGL2 renderer, driving the shipped build headless (`tools/render.js`).
- Staging: the game's title-screen staging (`titlejs`). The creature floats 5.5 units above Nacre at title scale 1.0, exactly as on the real title screen. The camera is posed so the Eclipse (Umbra, at the centre of the system) sits upper left.
- Scene: other worlds and ring dust hidden for a calm plate; the Eclipse's rays at 0.2 strength.
- Finish:
  - the game's bloom and anamorphic streaks;
  - grain 0.01;
  - depth of field 0.55;
  - no vignette (`vig 0`);
  - key light turned to come from the Eclipse's side, `[-0.6, 0.45, -0.55]`.
- Rendered at 800×400 CSS, device pixel ratio 2. Views: `work/poster/poster-views.json`, `tall-views.json` (T2), `sq-views2.json` (S3).
- The tall and square versions are separate renders with their own cameras: the Eclipse above and the droplet below for 2:3, closer together for 1:1. Neither is a crop.

**Agent:** lead.

**Checks**
- **wall.py, every shape:** the No 1 hero, 3.5:1 strip, wide, band, tall, half, column, small and tile, plus 90×70. The droplet and its eyes stay in view in every shape. The Eclipse survives in all but the column and tall shapes, where the droplet alone carries the plate.
- **4:3 crop around the focus** (phone game page): holds.
- **measure.py light:** `poster.png` L 0.121 C 0.061 dark · `poster-2x3.png` L 0.136 C 0.078 dark · `poster-1x1.png` L 0.125 C 0.066 dark (re-rendered one step farther at the check step: its lilac sheen block measured 25×25 and now measures 23×23).
- **guard.py on `poster.png`:**
  - ember, sun and mint: 0 % guarded;
  - lilac: 0.50 % guarded, all of it on the droplet's own lavender top reflection and rim, high in the frame. The largest solid block is 23×23 px, under 24.
  - Bottom 146 px (caption strip plus Play zone): 0 % guarded.
- **Measured readings:**

  | sample | measured | ΔE |
  |---|---|---|
  | Eclipse amber ring | `#7D4600` | sun 44.6, free |
  | Eclipse aura | `#33205B` | lilac 58.5, free |

  They are darker as rendered than the game's source hexes.
- **Never list:** no lettering, numbers, frame, border or vignette.
- **Corners:** the bottom-left corner (where the stamps sit) is calm: dark sky with faint rays.

**Choices and caveats**
- Nacre's surface, the first ground tried, measured lilac-guarded (pale pearl ground, ΔE ≈ 11.9) right where Play sits. So the poster uses the game's title-screen float, which keeps the world below the frame. No colour of the game was changed to pass a check.
- The poster is not the earlier key art: no title, no rings across the frame, no halo, and the Eclipse sits beside the droplet rather than behind its head.

#### updates/metamorphosis.png · updates/metamorphosis-thumb.png (lead redo, replaces the store agent's version)

**Files:** `updates/metamorphosis.png` (1600×800) and `updates/metamorphosis-thumb.png` (308×154, its own render with a closer camera).

**What it shows:** the moment the droplet becomes the Chimera. The gold halo and the tall glass crest have just arrived. A ring of white light runs out across Ferrum's dunes, and the dust lineage's magenta motes and poles are around it.

**How it was made:** rendered by the game.
- **The moment is real:** the game's own `metamorphosis(2)` was called on a form-11 body (dust build: Lodestone Heart 3, Static Veil 3, Iron Swarm 2, Polar Burst 2), then the game ran for 0.6 s.
- **Removed for a calm still:**
  - the full-screen flash, warp and shake;
  - the 70 iridescent particles, which read as noise in a still;
  - the ground flood (`bloomAt`). On every world it woke the ground into large blocks of guarded gold, lilac or mint (up to 64×64 px of sun on Ferrum).
- The ring of light, the halo, the crest and the body are the game's own.
- Views: `work/lead-upd/v5.json` (G2) and `v6.json`.

**Agent:** lead. The store agent's version (`work/store/superseded/`) showed the same moment, but its Lens Wings build read as an aeroplane and the frame cut the droplet off. It was replaced at the bring-together step.

**Checks:**
- Read at 104×52: the halo and droplet read.
- Subject inside the central 4:3.
- guard.py: the largest block is sun 11×11, lilac 10×10, ember 1×1, mint 1×1. The thumbnail's largest is 3×3.
- measure.py light: L 0.178 C 0.153, dark.
- No version, date, NEW or the word "update".

**Caveat:** the world is Ferrum, not Nacre. Nacre's and Cathedra's grounds put large lilac blocks under the rings.


---

## Small marks (agent: marks)

All three are new renders from the game's own WebGL2 renderer (`tools/render.js` driving `sivver/dist/perlune.local.html` headless). Each one is rendered separately, for its own size, at 8× its master. None is the poster shrunk, and none reuses an earlier picture. The game's code and `game.json` were not touched.

**Scripts:** all in `make/work/marks/`:
- `mk_render.py`: builds the views;
- `mk_marks.py`: the settings for each mark (render, then finish);
- `mk_finish.py`: lays the render on the night ground and reduces it;
- `mk_check.py`: the check board;
- `mk_variants.py`: side-by-side trials.

The raw renders are in `work/marks/raw/`.

### How all three were made (shared)

- **Staging (the poster's):**
  - `titlejs()` floats the droplet over Nacre, at title scale 1.0 on the poster's `up_dir`, so its pearl-chrome reflects the same studio (Nacre's palette).
  - It is the bare droplet: form 2, `build {}`.
  - The key light is the poster's `[-0.6, 0.45, -0.55]`: upper left, from behind, the Eclipse side.
- **Clean plate:**
  - `bg:false` (no sky);
  - no Nacre, no rings, no dust (the title dust ring is off too), no decor;
  - dof 0, tilt 0, grain 0, streak 0 (no fine lines), vig 0.
- **Drawn for the size:** in the headless page only, `drawCreature` is re-read from the shipped build and evaluated again with a few numbers scaled, so the parts survive at 46, 30 and 64 px.
  - **Same in every mark:** the parts, their materials and their placement.
  - **Eyes:** the black eye ellipsoid is scaled up and the white GLOW catchlight is made bigger.
  - **Catchlight emission:** lowered from 4 to 2.2–2.5, so its bloom doesn't wash the dark eye grey.
  - **Crest:** its scale and its glass emission are set per mark (see each entry). In the game the crest's emission is 0.1, or 0.45 at the Chimera.
  - **Body:** the wobble clock is fixed at `R.time = 10.5`, a round phase with both eyes clear. The amount of wobble is the game's own.
- **Two passes per mark** (same pose, same clock):
  1. the look pass;
  2. a coverage pass (no bloom, exposure 60), with the eye holes filled, because the eyes are opaque black in the game.
- **Ground:** the game's night, edge to edge. It is a radial ramp from `#2A0B4D` at the upper left (where the light comes from) to `#05040A` at the lower right, laid under the render in linear light: `out = render + ground × (1 − coverage)`.
  - The droplet's own bloom stays additive light, so it falls on the ground.
  - Measured corners: top left `#260647`, bottom right `#080410`.
- **Reduction from 8×:**
  - a box average, blended 60/40 between an sRGB average and a linear-light average, so the dark eyes keep their full size and the catchlights stay bright;
  - then a light unsharp mask (radius 0.6, 60%).
- **Colour:** the per-size adjustments are exposure (the game's own `exp`) and saturation (1.1–1.15). All the colours are the game's.
- **Format:** square, sharp corners, RGB with no alpha (never masked), no text, no numbers.

**Hot colour:** the thin-film **pink/magenta rim** on the droplet's edge, as in the poster.
- The crest stays muted teal glass, measured about `#5F99A6` in the icon. This is the game's own glass tint.
- The Eclipse's amber and violet appear only on the chip, as rings and glow.

### Entries

#### icon-46.png
- **file:** `bug/icon-46.png` (92×92, drawn for 46)
- **shows:**
  - the droplet's round pearl-chrome head, with its pink thin-film rim;
  - two big dark eyes, each with one white catchlight;
  - the small cyan glass crest on top;
  - rim light from the upper left, on the game's night.
- **made by:** rendered from the game, then finished.
  - `render.js` at 368 css × dpr 2 (736 px, 8×), MSAA 4;
  - `titlejs(cam -0.33, face -0.08, dist 6.0, up 1.4, ty 0.19, fov 0.415)`;
  - eyes look `lx -0.1, ly 0.25`;
  - eyes ×1.45 (depth ×1.4), set 0.03 wider apart; catchlight ×1.6 at emission 2.2;
  - crest ×1.1 at glass emission 0.3;
  - bloom 0.2, exposure 1.6;
  - composed on night, reduced 8× → 92, saturation 1.15.
  - Settings: `mk_marks.py` → `MARKS['icon']`.
- **agent:** marks
- **check:**
  - **1× on night `#0B0910` and on linen `#F1ECE4`, beside Night Swim, Miradouro and Typos:**
    - it reads as this droplet;
    - the eyes and catchlights are clear at 46;
    - the crest reads as a small teal spike;
    - the pale head on deep violet holds by value next to their saturated marks.
  - **4× hard pixels:** each eye is about 5×7 px with a 2×2 catchlight; the crest is fully inside the frame.
  - For comparison, the poster's own droplet shrunk to 46 loses its eyes to grey smudges, which is why the eyes are drawn bigger here.
  - **Look-alike watch:** beside the roster planet-with-eyes game it does not read as a planet: it has the crest, no ring, a pearl body and a night ground.
  - **`wall.py`** (poster, `--focus 0.60,0.50 --icon icon-46.png`): the icon at 46 on night and on linen sits well beside the poster's droplet. The outputs were moved to `work/marks/wall-hero.png` and `wall-shapes.png`.
  - **`guard.py`:**
    - ember 0%;
    - lilac 2.69% guarded, largest block 2×2;
    - sun 0%;
    - mint 1.61% guarded (the thin-film cyan-green band at the lower rim), largest block 2×2.
    - **Pass:** no flat block ≥ 24×24.
- **couldn't make / caveats:**
  - The eyes, catchlights and crest are drawn bigger than in play: a deliberate change for 46 px, made with the game's own code and numbers.
  - The poster's white horizon reflection runs through the eyes, as it does in the poster.
  - The pink rim is about 1 px at 46. It is the hottest colour present, but it is thin, as it is in the game.

#### emblem-30.png
- **file:** `bug/emblem-30.png` (60×60, drawn for 30)
- **shows:** fewer parts than the icon: the droplet's head and two bolder eyes only (no crest), face on, filling the square, with the pink thin-film rim.
- **made by:** rendered from the game, then finished.
  - `render.js` at 240 css × dpr 2 (480 px, 8×);
  - `titlejs(cam -0.33, face -0.04, dist 6.0, up 1.4, ty 0.0, fov 0.38)`;
  - eyes look `lx -0.15, ly 0.3`;
  - eyes ×1.9 (depth ×1.6), set 0.07 wider apart; catchlight ×2.1 at emission 2.2;
  - crest scale 0, so it is not drawn;
  - bloom 0.15, exposure 1.6;
  - composed on night, reduced 8× → 60, saturation 1.15.
  - Settings: `MARKS['emblem']`.
  - It is a separate render with its own camera and eyes, not the icon scaled down.
- **agent:** marks
- **check:**
  - **1× at 30 on night and on linen, beside the same three games:** it reads as the droplet's face. The two black eyes with white catchlights carry it, and the pearl iridescence and rim hold the body.
  - **4× hard pixels:** clean eyes about 7×9 px each, with a clear gap between them.
  - **`guard.py`:**
    - ember 0%;
    - lilac 3.64%, largest block 2×2;
    - sun 0%;
    - mint 1.97%, largest block 2×2.
    - **Pass.**
- **couldn't make / caveats:**
  - Without the crest it depends on the eyes and the pearl material.
  - I tried eyes ×2.05: they nearly touched and read as a mask, so I kept ×1.9.

#### chip-64.png
- **file:** `bug/chip-64.png` (128×128, drawn for 64)
- **shows:**
  - more parts than the icon: the droplet's head, eyes and crest, with the eyes looking up toward the Eclipse;
  - the Eclipse small behind it at the upper left (its violet aura, amber ring and dark core), its light rimming the droplet's left edge.
  - Fewer parts than the poster: no rays, no dust, no sky lines.
- **made by:** rendered from the game, as one frame with the droplet and the Eclipse together, then finished.
  - `render.js` at 512 css × dpr 2 (1024 px, 8×);
  - poster staging with a closer, wider camera, so the Eclipse is small next to the droplet: `titlejs(cam -0.37, face -0.15, dist 2.95, up 1.0, ty 0.2, fov 1.0, side 0.3)`;
  - **shown:** Umbra (the Eclipse) and its two atmospheres;
  - **hidden:** Nacre, every ring, all dust and the sunburst rays (`sunburst:false`);
  - eyes look `lx -0.5, ly 0.6`;
  - eyes ×1.35, catchlight ×1.6 at emission 2.5;
  - crest glass emission 0.25;
  - bloom 0.25, exposure 1.5;
  - composed on night (the atmospheres stay additive light on the ground), reduced 8× → 128, saturation 1.1.
  - Settings: `MARKS['chip']`.
- **agent:** marks
- **check:**
  - **1× at 64 on night and on linen, beside the same three games:**
    - the droplet reads at once;
    - the Eclipse reads as a small violet and amber ring behind it at the upper left;
    - the left rim glare faces it.
  - **4× hard pixels:** clean.
  - **`guard.py`:**
    - ember 0% (caution 0.48%);
    - lilac 1.84%, largest block 2×2;
    - sun 0.15% guarded (the Eclipse's amber ring), largest block 1×1;
    - mint 0.73%, largest block 2×2.
    - **Pass.** The amber stays a thin ring, never a block, and is never "earned".
- **couldn't make / caveats:** I left out the Eclipse's rays. At 64 px they are hairlines that read as noise. I tried them at strength 0.12.

### Choices
- **Hot colour = the pink thin-film rim, not the cyan:**
  - it matches the poster's droplet;
  - it wraps the whole silhouette, while the crest is a few pixels;
  - the crest is kept as the game's muted glass teal, so it doesn't compete.
- **Rendered, not drawn:** drawkit was not needed. The game renderer gave the exact poster material.
- **Eyes and catchlights:** each mark's eyes and catchlights were sized for its own display size.
  - The first renders at the game's own proportions lost the eyes at 46 px.
  - A large catchlight with the game's emission of 4 bloomed the eyes grey, so emission and bloom were lowered.
- **Camera height:** the white horizon reflection's place on the face depends on the camera height.
  - **Lower camera:** it became a wide "smile" under the eyes. It was rejected, because it reads as an emoji face, a generic symbol, and the droplet has no mouth.
  - **Kept:** the poster's slight top-down view (about 13°), with the band at eye level as in the poster.
- **Working fix:** `render.js` keeps post values between views, so every view now sets bloom and exposure explicitly. Without this, the look pass after a coverage pass rendered blown out.

**Check board:** `make/work/marks/marks-check.png` holds:
- all three marks at 1× on night and on linen, beside Night Swim, Miradouro and Typos, cropped from `reference/16-profile.png` for the board only;
- each at 4× with hard pixels beside the same three;
- a look-alike row next to the roster planet-with-eyes game;
- the masters at 1:1.

Guard maps are in `work/marks/guard-*.png`, and the results are in `guard-results.txt`.


---

## Continue picture, result picture, gallery (agent: stills)

Pictures 5, 6 and 7 of DIRECTION.md: the Continue picture, the result picture and the six gallery slides. Every one is a frame rendered by the shipped build (the shipped build (`perlune.local.html`)) with its own WebGL2 renderer. Nothing was painted, composited, traced or retouched afterwards, and no earlier picture was reused. The game's code was not changed.

### How they were made (shared by all eight)

- **Tool:** `make/work/stills/still.js` is my variant of `tools/render.js`, with the virtual-timer harness of `video/cap.js`.
  - It loads the build headless (Chromium + SwiftShader).
  - It plays a real journey with the game's own functions (`newJourney`, `startLanding`, the director, the test bot, `spawnEnemy`, `hitEnemy` → `bossDefeated` → `grandWave`, `startLaunch` → `enterSpace`, `startFinale`).
  - It advances the game's `setTimeout`s on virtual time, so timed effects fire in order.
  - It then poses a camera and captures one frame.
  - `Math.random` is seeded, so a test render and the final render play the same moment.
- **Shot setups:**
  - `work/stills/shots.js`: `ferrum` = key still, `nacre` = result. `shots-final.js` is a frozen copy of the result setup.
  - `work/stills/gshots.js`: `core`, `body`, `cathedra`, `lode`, `space`, `finale`.
- **Finish, the same as the poster:**
  - vignette 0, grain 0.01, streak 0.45;
  - lens focus 0.55 (0.45 on slide 03, a wide world view);
  - the game's own bloom 0.6, exposure 0.95 and saturation 1.12, reset on every capture;
  - sky contour lines low (`neb` 0.02–0.05, the poster used 0.03).
- **Clean backgrounds:**
  - the world's floating dust is hidden;
  - on the result still, the other worlds, the Eclipse rays and Nacre's decor are hidden too;
  - the DOM HUD is not drawn.
- **Light:**
  - The key light is the game's own camera-relative key on the key still, gallery 01, 02, 04 and 05, and the finale's own light on 06.
  - The result still uses the poster's back-left key `[-0.6, 0.45, -0.55]`.
  - Slide 03 uses a back key `[-0.35, 0.45, -0.82]`, chosen so the glass world's lit face stays off the platform's lilac.
- **Renders:** finals at 2× (gallery and key still, the key still then reduced to 720×352) or 1× (result) with MSAA 4.

### Pictures

#### key-still.png (720×352)

- **file:** `bug/key-still.png`
- **shows:** On Ferrum Dunes mid-harvest (the world still half-muted, wake ≈ 0.5), a ring of iron moths closes in and the droplet turns to face the nearest one. The droplet is in the middle.
- **made by:**
  - Rendered from the game. A real journey: the bot plays Ferrum for 16 s with a small build (spines, shatter bloom, lodestone heart, form 7).
  - The storm front is held off, and the bot is paused.
  - Seven iron moths are spawned with the game's `spawnEnemy` in a broken ring 4–5 units around the droplet. They then fly for 0.06 s under their own AI.
  - The droplet is turned toward the moth ahead of it (`P.face`). The camera sits low in front, three-quarters, fov 0.45.
  - Rendered at 1440×704 and reduced to 720×352.
- **agent:** stills
- **check:**
  - Continue card mock at 360×176 and at 132×66 (`work/stills/mock-continue.png`, modelled on reference 13): the droplet and the glowing moths read at both sizes, and the subject sits in the middle.
  - `guard.py`: ember 0.20 % (largest block 7 px), sun 1.39 % (block 20 px: the moths' orange glow cores), lilac and mint ≈ 0. No block ≥ 24.
  - `measure.py light`: L 0.126, C 0.191, **dark** (poster: L 0.121, dark).
- **couldn't make / caveats:**
  - The moths' glow is the game's own `#FF7A2B` hostile glow, which sits near ember (ΔE 10.7). It is only small glows (≤ 7 px ember), never a block.
  - The final was rendered before I added random-stream saving to `still.js`. Re-running the `ferrum` setup today gives a near-identical but not pixel-identical frame.

#### result-still.png (1600×352)

- **file:** `bug/result-still.png`
- **shows:** Nacre wakes. Its heart, the Bell of Nacre, has just been broken on top of the droplet. Its pearl-chrome shards are still settling around the droplet, which stands at the centre with its eyes on us. The colour-flood ring the game sends out from where the heart fell runs across the pearl world as an iridescent band.
- **made by:**
  - Rendered from the game. A real journey on Nacre: the bot harvests, the director warns, and the Bell rises.
  - The Bell is moved 0.4 units in front of the droplet and given its killing hit through the game's own `hitEnemy`. That runs `bossDefeated`: `grandWave` (u_bl[0] ring in the planet shader), the bell debris, the matter burst, the vacuum and the joy.
  - The frame is 1.93 s into the wave (front ≈ 21 units out across the 17-radius world, the ring glow still on the visible hemisphere).
  - Camera in front, 14 units out and 6.5 up, fov 0.34. The poster's back-left light. Other worlds, the Eclipse rays and decor hidden for a clean sky.
- **agent:** stills
- **check:**
  - Session-result mock (`work/stills/mock-result.png`, modelled on reference 14) with a headline above and numbers, an achievement tile and Play below. The subject sits inside the middle 720×352 (box drawn on the mock). The dark flanks take overlaid words.
  - `guard.py`: lilac 0.38 % (largest block 11 px: the lit pearl ground), ember, sun and mint 0. No block ≥ 24.
  - `measure.py light`: L 0.177, C 0.042, **dark**.
  - No text or numbers in the picture.
- **couldn't make / caveats:**
  - **The awakening is subtler in the real build than the plan line suggests.** When the heart falls, Nacre is already at wake 0.8, because harvesting has brought most of its colour back. So the flood shows mostly as the travelling glow ring (`wring`), an iridescent band, and not as grey turning to colour. I kept the real values; I did not mute the world to fake the contrast.
  - Seen from straight above (where the ring reads as a full circle), the pearl ground fills the plate with near-lilac pinks (guarded blocks up to 30 px). So I chose the low front view, where the ring reads as a band crossing the world.

#### gallery/01.png … 06.png (1600×800) + captions.json

The order tells the game: core loop → second mechanic → a place → a character → the glide → the payoff. Six different places and scales: Nacre, Hydrargyra, Cathedra (whole world), Ferrum with its heart, open space, and the Eclipse. None repeats the poster (the droplet floating over Nacre facing the Eclipse). No text, arrows or badges were added, and the game's HUD is not drawn.

- **01 core loop**
  - **shows:** On Nacre, the droplet fires glowing beads into a swarm of pearl mites and chrome tumblers. Matter from three mites it has just broken (killed with the game's `hitEnemy`, dropped by the game's `dropMatter`) flies back into it.
  - **made by:** A real Nacre journey (bot 5 s, form 4). The swarm is spawned with `spawnEnemy` 6–9 units ahead. The droplet auto-fires by itself for 0.38 s. Long lens, low and to the side. The world's decor is hidden for a clean ground.
  - **light:** mid, L 0.287.
- **02 second mechanic: a grown body**
  - **shows:** On Hydrargyra, a CHIMERA-stage droplet (form 13, gold halo) carries real evolutions: Shard Crown 2, Lens Wings 2, Prism Eye 2, Quicksilver Spines, Shatter Bloom and Kaleidoscope (prism ring at its feet). It fights between two hydras.
  - **made by:** Built with the game's own `recomputeStats` path (as in `video/cap.js`). The bot plays the mercury sea for about 12 s. The camera is turned to the nearest foe.
  - **light:** mid, L 0.212.
- **03 a place**
  - **shows:** A wide view of Cathedra, the glass garden: the glass world under its glass ring band, crystal spires (its refracting prisms), three jellies, and the droplet small but findable at the centre of the 4:3.
  - **made by:** A real Cathedra journey (bot 8 s). The droplet is placed 3.4 units from a prism cluster with three jellies spawned ahead, then 0.36 s of play. High camera behind, fov 0.8.
  - **light:** dark, L 0.168.
- **04 a character**
  - **shows:** On Ferrum Dunes, the Lodemother (gold chrome rings around a magnetic core, red and cyan poles) rises over the droplet, which faces up at her.
  - **made by:** A real Ferrum journey: harvest done, the director spawns the Lodemother. She is moved 8 units in front of the droplet and plays 0.4 s of her own AI. Camera low over the droplet's shoulder, looking up at her.
  - **light:** dark, L 0.165.
- **05 the glide**
  - **shows:** After the launch from Nacre, the droplet glides through one of the rings of light the game lays toward the next world (Cathedra), with the next rings leading on.
  - **made by:** A real launch: `startLaunch` → `enterSpace`. The game's own space autopilot (bot) flies until the droplet is inside a hoop (stepped at 1/480 s to catch the crossing). Camera behind and above the hoop.
  - **light:** dark, L 0.154.
- **06 the payoff**
  - **shows:** At the Eclipse, the droplet has become a star, its final form (glass line: "The Prism Cathedral"). Rays burst out of it, and the worlds it woke circle it on gold orbits.
  - **made by:** A real finale: a late build on Umbra, the Eclipse given its killing hit (`hitEnemy` → `bossDefeated` → `startFinale`). The game's own hold-to-absorb and phase 2 run, captured 3.4 s into phase 2 with the game's own finale camera.
  - **light:** dark, L 0.092.
- **agent:** stills
- **check:**
  - **Contact sheet** `work/stills/contact-gallery.png`: each slide at 100 px wide, its central 4:3 crop, and the full slide with the 4:3 box and the 26 px line. Every subject sits inside the central 4:3. At 100 px:
    - 01 (droplet and beads), 02 (haloed droplet), 04 (gold rings and droplet), 05 (ring of light) and 06 (star) read clearly;
    - 03 reads as the glass world, with the droplet findable only from about 240 px up.
  - **`guard.py`** (largest solid block): 01 lilac 20 px; 02 sun 21 px / lilac 16 px; 03 lilac 17 px; 04 sun 18 px / ember 11 px; 05 sun 12 px; 06 lilac 7 px / sun 7 px. No guarded block ≥ 24 on any slide.
  - **Bottom 26 px** (`work/stills/zone.py`, guard.py's maths): 01, 02, 04, 05 and 06 have 0 guarded pixels. 03 has 5 px, see the caveat below.
  - **`captions.json`** written. Captions are 43–57 characters (all ≤ 60), and the alt text says what happens.
- **couldn't make / caveats:**
  - **03:** Cathedra's own contour-line colour is `#C7A6FF` (ΔE 4.7 to lilac). Five isolated pixels of the globe's outline hairline (ΔE 9–12) touch the bottom-left of the 26 px strip. That is two 1–3 px line fragments, no block. More than a dozen reframings did not reach zero without losing the world.
  - **03:** The droplet is seen from behind there (wings and crest), as the place is the subject.
  - **04:** The Lodemother's gold rings are her own chrome `#FFE0B0` lit by the key. They show as sun-near glints (≤ 18 px), never a flat block, and they don't mean "earned".
  - **06:** The gold orbit lines are the game's halo gold `#FFD27A` (a Perlune guarded colour), drawn as thin rings only.

### Choices

- I wrote my own capture script (`still.js`) instead of `render.js`. Real moments need the game to keep running between captures (the bot, the director, timers, a boss's death, the space glide, the finale), and `render.js` resets the scene on every view.
- Every "staging" step uses the game's own functions and positions (moving a spawned foe or a heart closer, pausing the bot, turning the droplet to a foe). Nothing is drawn that the build does not draw.
- The light band is dark on everything except slides 01 and 02 (mid). The pass has no light-on-light pairs.


---

## Seals (agent: seals)

### Plan lines (written before drawing)

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

### Pictures

All 30 files are 192×192 RGBA PNGs with the seal centred and transparent corners. There is one entry per seal; the three states share one entry because they are the same art.

Made by, for every seal: **drawn in the game's code**, not rendered. `work/seals/seals.py` draws each seal at 8× (1536 px) and reduces it with premultiplied Lanczos. It uses the game's own maths:
- the material terms of `engine.js` SCULPT_FS (chrome m0, pearl m1, glass m2, glow m3, obsidian m4, liquid m6), via the numpy port in `make/tools/drawkit.py`;
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

### Choices

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

### Checks (on the final files in `bug/seals/`)

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
- **Guard:** `python3 make/tools/guard.py` on every earned seal, both the raw file and composited on the panel (`work/seals/check.sh`; output in `work/seals/check-final.txt`).
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
- **Rebuild:** `python3 make/work/seals/seals.py --ss 8 --out <dir>` (about 90 s for all 30). Boards: `python3 make/work/seals/board.py <dir> <out>`.


---

## Store, owned mark, update, event (agent: store)

Pictures 9, 14, 15 and 16 of DIRECTION.md: the store tiles, the owned mark, the update close-up and the event banner. These are design-only proposals. Nothing is declared, there are no prices, and the game's files and `game.json` were not touched. Every render drives the shipped build (the shipped build (`perlune.local.html`)) through `make/tools/render.js`. All scripts are in `make/work/store/`.

### Choices that apply to all four

- **One world.** Everything is on Nacre, the poster's world, so the store row, update and banner read as one place.
- **Proposed looks are rendered by the game at render time.** `work/store/hook.js` wraps the game's own `drawCreature` and swaps the material or colour of one instance (the body or the halo). It uses only the game's meshes (`M.*`), materials (`MAT.*`), colours (`hex`) and ribbon drawing (`FX.strip`). The game is never edited.
- **Fixed clock for staged moments.** In the update and banner renders, `R.time` is set to a fixed value, so a small test render predicts the final one exactly.
- **Leftover state cleared.** Bloom rings and ground ripples left over from the landing (`G.bl`, `G.ripples`) are cleared before staging.
- **render.js carry-over fix (from the coordinator).** Every store view set `exp` and `neb` itself, and none set `bloom` or `sat`, so the store tiles were not affected. I re-rendered four of them with the fixed render.js to confirm: exposure and mean brightness match. The only differences are animation phase (wobble, dust), so the finals stand. The update and banner were rendered after the fix, as single views.
- **No lettering anywhere.** This follows the lead's font note: TiltPrism.ttf is a stub, so the banner is unlettered.

---

### store/opal.png
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

### store/smoke-glass.png
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

### store/glass-halo.png
- **file:** `bug/store/glass-halo.png` (400×400)
- **shows:** The Chimera (glass mantle, tall crest), wearing its halo as clear cyan glass instead of gold light.
- **made by:** Rendered from the game at form 11 (the Chimera stage, where the halo exists). `hook.js` replaces only the halo instance: the game's gold `0xffd27a` `GLOW` torus is drawn instead as `MAT.GLASS` in the crest's own cyan `0x9ff6ff`, with a thin cyan `GLOW` ring inside. This is a **proposed** look. Camera raised so the ring opens.
- **agent:** store
- **check:**
  - At 40 px: the ring reads as a small cyan ellipse over the head. The silhouette (ring over a dome) is distinct.
  - guard: sun 0.00% (no gold left anywhere in the frame); lilac 2×2.
- **couldn't make / caveats:** A proposed look.

### store/ribbon-trail.png
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

### store/moonlet.png
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

### reward-held.png + reward/absorbed.js (owned mark, verb "absorbed")
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

### updates/metamorphosis.png + metamorphosis-thumb.png — SUPERSEDED

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

### events/lantern-night-banner.png
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


---

## Pass (agent: pass)

Pass **"Pearl Orbit"**, step unit **a world woken**. These are design pictures only: no price, no count, nothing declared, game files untouched.

Every picture here is rendered by the game's own WebGL2 renderer: the shipped build the shipped build (`perlune.local.html`), driven headless through `make/tools/render.js`.
- The cosmetic looks are **proposals**. They are drawn at render time inside the page through render.js `js` hooks; the game's files were never edited.
- Each hook wraps `drawCreature` for the length of one call. While it runs, it either swaps a material or colour on one of the game's own `Mesh.put` calls, or draws extra parts with the game's own meshes and materials (`M.ring`, `M.torus`, `M.ball`, `M.oct`, `M.gem0`, `MAT.PEARL`, `MAT.GLOW`), the game's `FX.strip` and `drawSunburst`. When the call ends it puts everything back.
- Code:
  - builders: `make/work/pass/pv.py`;
  - finals: `final_rewards.py`, `final_tile.py`, `final_marker.py`;
  - the rail mock: `railmock.py`, in the same folder.
- Every final was rendered at 2× (the marker at 8×) and reduced with Lanczos, or a box filter for the marker.
- Every final was rendered **after** the coordinator's render.js fix that resets post settings per view. My views never changed bloom, exposure or saturation, and they set `neb` themselves.

### Choices

**The three tiers are three places in the game:**
- free = the plain night sky;
- pass = Nacre's woken pole, its pearl limb glowing, "a world woken";
- bug.pass = the Eclipse's own dark with its corona.

They read as tiers at 120 px: dark and empty, then a bright pearl world, then a black disc in a thin warm ring. See `rail-mock.png`.

**Rewards are opaque.** Each one is rendered over its own row's ground scene, from the same kind of camera. The tier shows whether or not the platform draws the ground PNG under it. Nothing is dimmed or veiled.

**The Eclipse stays a thin glow** (guarded amber `#FFB52E` and violet `#B28CFF`). For the bug.pass scenes:
- Umbra's two corona atmospheres are drawn with a steeper falloff (power 16 and 10) and at 0.42 and 0.3 of their strength, so each is a thin ring;
- the inner violet rim is drawn at 0.2 of its strength;
- the disc is drawn with the game's own `dim` factor at 0.15 (the game dims locked worlds the same way);
- the sunburst is at 0.1.

guard finds no sun-guarded pixels in `ground-bug.png`.

**No gold on any reward.**
- `prism-halo` replaces the Chimera's gold torus. The new halo is six thin `M.ring` GLOW rings: `#FF5C9A`, `#FF9AD5`, `#FFF6FA`, `#9FF6FF`, `#5FF3FF` and `#6A8CFF` (measure.py: none guarded).
- The eclipse eyes' rims are warm white `#FFF4E6`, not amber.

**Staying clear of the "Five Tiny Worlds" look.**
- **Ringlet:** the ring of pearls never crosses the face. It is a tilted orbit that passes behind the head and in front of the lower body, on a dark sky over a magenta world. The droplet is pearl-white, not purple, and the ground is not pink.
- **Tile:** Nacre's rings arc across the sky behind the droplet, as seen from the world's surface. No ringed planet is drawn as an object, and no planet has a face.

**The game's display face is missing, so the tile has no lettering.**
- `the trailer's scripts folder fonts/TiltPrism.ttf`, `Syne.ttf` and `MartianMono.ttf` are 378-byte JSON error stubs: the download failed with "Host not in allowlist".
- Google Fonts, GitHub raw and npm are all blocked from this machine.
- Lettering "Pearl Orbit" in any other face would not be the game's own, so the tile carries the name through its picture (Nacre's pearl ring, the orbit). The platform prints the pass name under the tile.
- **For the lead:** a lettered variant is a few lines of PIL once a real `TiltPrism.ttf` exists. This also affects anyone doing the title lockup or the share card.

**The marker** is Nacre's matter gem, exactly as `drawPickups` draws it: `M.gem0`, `MAT.GLOW`, Nacre's matter colour `#FFC6EA ×2.2`, the same spin axis. measure.py: `#FFC6EA` is lilac caution 16.6, not guarded.
- **next:** emission 1.0, two after-images a little behind in the spin (the game's dash-ghost idea), and a small star glint. The glint is built the way the Nova star is built: two crossed `M.oct` GLOW plus an `M.ball`.
- **held:** the gem a little smaller and calmer (emission 0.8), settled into a small pearl ring (`M.torus`, `MAT.PEARL #FFF2FB`) and seen from above.
- **Alpha:** each pose is rendered on black, plus a flat-white matte pass of the same shapes. Solid parts get alpha 1; the glow gets an additive alpha (its brightest channel). The result is reduced 8×8 in premultiplied space.
- Nothing in either pose counts or holds a number.

### Pictures

#### `bug/pass/tile.png` (400×400)
- **shows:** the droplet floating over Nacre's woken pole, with Nacre's own pearl rings (the game's ring dust and pearl chunks) arcing across the night above it: the pearl orbit.
- **made by:** rendered from the game.
  - Title-state staging over Nacre's pole, lift 1.6; camera elevation 0.5 rad, azimuth 0.4 (looking toward the high side of the tilted rings); `ownRings` true; upper-left key.
  - Sky contour lines held at 0.015 so the top corners stay calm.
  - 800×800, reduced to 400.
- **agent:** pass
- **check:**
  - Previewed at 40, 80, 120 and 169 px (`work/pass/tile-sizes.png`). It reads at 40 as a white bead with two eyes on a magenta world under a pale arc.
  - Top corners are dark sky: guard top zone 0.00% for all four colours.
  - guard on the whole tile: lilac 0.47% (largest block 4×4), mint 0.02% (1×1), ember and sun 0.
  - Seen beside the poster (`poster-vs-tile.png`): same finish and same droplet.
- **couldn't make / caveats:** no lettering, because the game's display face isn't on this machine (see Choices). The rings' second band carries a little of Nacre's own lilac and cyan dust (in game colours); it stays thin dust.

#### `bug/pass/ground-free.png` (306×243)
- **shows:** the plain night with faint contour lines (the game's sky and its neon contour lines) and a few dust stars. Nothing else.
- **made by:** rendered from the game: title-state camera looking away from the Eclipse, with no worlds, no creature, `neb` 0.05 and an upper-left key.
- **agent:** pass
- **check:**
  - guard: all four colours 0.00%.
  - On the rail mock with mint check and lilac outline: both read clearly.
- **couldn't make / caveats:** none.

#### `bug/pass/ground-pass.png` (306×243)
- **shows:** Nacre woken, seen from just above its pole. The pearl limb crosses the middle with its iridescent film and pink contour line, under the night: "a world woken".
- **made by:** rendered from the game: Nacre's pole, lift 2.4, camera elevation 0.55 rad, no creature, woken (`wake` and `awake` = 1), no decor.
- **agent:** pass
- **check:**
  - guard: lilac 0.01% (1×1), the rest 0.
  - The lilac selected outline stays distinct from the world's magenta and violet on the rail mock.
- **couldn't make / caveats:** none.

#### `bug/pass/ground-bug.png` (306×243)
- **shows:** the Eclipse's own dark: Umbra's disc darkened, a thin amber corona ring, a thin violet rim and faint rays.
- **made by:** rendered from the game: telephoto (fov 0.22) from beyond Nacre with the Eclipse straight behind, plus the thin-corona staging described above. Backlit key, as in the poster.
- **agent:** pass
- **check:**
  - guard: all four colours 0.00%. The corona's amber stays a thin glow below the guard.
  - On the rail mock with the platform's sun outline: the outline stays the strongest warm line, and the corona sits well inside it.
- **couldn't make / caveats:** none.

#### `bug/marker-next.png` (48×48, RGBA)
- **shows:** Nacre's matter gem mid-spin, with faint after-images and a small star glint.
- **made by:** rendered from the game: `M.gem0` / `MAT.GLOW` / Nacre matter colour, glint from the Nova's crossed `M.oct`. Rendered at 384 with a matte pass, reduced to 48. Alpha on the border is 0.
- **agent:** pass
- **check:**
  - Previewed riding over the next cell on the cell rail (`rail-mock.png`) and on a 30-cell step strip at 48 and 24 px (`rail-compact.png`).
  - 4× hard pixels on night and on linen (`marker-zoom.png`).
  - guard on night: 0.00% for all four colours.
- **couldn't make / caveats:** drawn for the dark page. On linen the white-pink gem is pale.

#### `bug/marker-held.png` (48×48, RGBA)
- **shows:** the same gem settled, calmer, into a small pearl ring.
- **made by:** rendered from the game: `M.gem0` GLOW plus `M.torus` `MAT.PEARL`, with a matte pass, reduced to 48.
- **agent:** pass
- **check:**
  - Previewed sitting on the last earned cell on the rail mock and on the step strip at 48 and 24 px.
  - guard on night: lilac 0.09% (1×1), the rest 0.
- **couldn't make / caveats:** pale on linen, as above.

#### `bug/pass/mote-trail.png` (306×243, free)
- **shows:** the droplet looking ahead, with a few hot-pink dust motes trailing behind it in a loose curve.
- **made by:** rendered from the game. The motes are drawn exactly as the game draws its motes (`M.oct`, `MAT.GLOW`, `#FF5C9A`), seven of them, getting smaller and dimmer, each turned on its own axis. Free sky ground, upper-left key.
- **agent:** pass
- **check:** reads at 120 px (`s27.png`). guard: lilac 0.14% (2×2), the rest 0.
- **couldn't make / caveats:** a proposed look, made at render time.

#### `bug/pass/pearl-crest.png` (306×243, free)
- **shows:** a close-up of the droplet's head with its crest in pearl.
- **made by:** rendered from the game. The crest's own `M.oct` call is swapped from `MAT.GLASS #9FF6FF` to `MAT.PEARL #FFF2FB`. The crest is drawn at the Chimera's crest height (1.75×, the game's own taller crest) so it reads at 120 px.
- **agent:** pass
- **check:** reads at 120 px. guard: lilac 0.21% (4×4); caution 23% from the pearly lavender-white sheen, but no blocks.
- **couldn't make / caveats:** at the bare droplet's own crest size the crest did not read at 120 px, hence the taller crest. Say so if the look should keep the small crest.

#### `bug/pass/nacre-skin.png` (306×243, pass)
- **shows:** the droplet with a mother-of-pearl body (milky, with a pink, green and cyan film), floating over Nacre's woken limb.
- **made by:** rendered from the game. The body's own `M.sphere` call is swapped from `MAT.LIQUID` to `MAT.PEARL`, tint `#FFF2EE`, film offset 0.3. That offset was picked out of four for the least lilac.
- **agent:** pass
- **check:** reads at 120 px. guard: lilac 0.30% (4×4), mint 0.93% (3×3, the green of the film at the rim).
- **couldn't make / caveats:** a proposed look.

#### `bug/pass/prism-halo.png` (306×243, pass)
- **shows:** the Chimera (glass mantle, tall crest) with its halo split into a ring of colours, over Nacre's woken limb.
- **made by:** rendered from the game, form 11. The gold `M.torus` is replaced by six thin `M.ring` GLOW bands, as above.
- **agent:** pass
- **check:** reads at 120 px. guard: lilac 0.38% (3×3). No gold.
- **couldn't make / caveats:** a proposed look. The halo exists only from the Chimera stage, so the picture shows the Chimera.

#### `bug/pass/ringlet.png` (306×243, pass)
- **shows:** a small tilted ring of pearl dust and beads orbiting the droplet, over Nacre's woken limb.
- **made by:** rendered from the game: `M.ring` plus 34 `M.ball`, all `MAT.PEARL #FFF2FB` in mixed sizes, drawn after the creature in its own frame.
- **agent:** pass
- **check:** reads at 120 px. guard: lilac 0.82% (4×4).
- **couldn't make / caveats:** a proposed look. Composed away from the "Five Tiny Worlds" ringed-face look (see Choices).

#### `bug/pass/eclipse-blink.png` (306×243, bug.pass)
- **shows:** the emote. The droplet's face in front of the Eclipse, its two eyes become two tiny eclipses: round dark discs with a thin bright rim and a small corona of rays.
- **made by:** rendered from the game, on the bug.pass ground's camera.
  - The eye discs (`BLACK`) are made round, 1.35× (like the game's joy widening), and lifted onto the body's surface.
  - The catchlights are left out.
  - A thin `M.ring` GLOW rim (`#FFF4E6`) and a tiny `drawSunburst` (the game's own Eclipse rays) are drawn around each eye.
- **agent:** pass
- **check:** reads at 120 px as two small eclipses. guard: lilac 1.79% (7×7, the body's lavender sheen at the rim), the rest 0.
- **couldn't make / caveats:** a proposed look. It is one held frame of a moment, not an animation.

### Checks run (summary)
- guard.py on all 12 files.
  - No ember or sun anywhere.
  - The largest guarded block anywhere is 7×7 px (lilac sheen on chrome), well under 24×24.
  - The markers on the night page are clean.
- The rail mock (`make/work/pass/rail-mock.png`) shows three rows × six steps with:
  - the platform's mint owned checks;
  - the lilac selected outline;
  - the sun bug.pass outline;
  - the marker in both poses.

  The tiers and all three states read clearly.
- The compact 30-cell strip (`rail-compact.png`) shows the marker at 48 and 24 px.
- The tile at 40, 80, 120 and 169 px.
- The rewards at 120 px (`s27.png`).


---

## Round 3: lettering, share card, phone poster, backdrops (agent: round3)

Everything here is new. The share card, the phone poster and both backdrops were rendered fresh from the shipped build (`sivver/dist/perlune.local.html`) by the game's own WebGL2 renderer, through `tools/render.js`. The lettering was set fresh in code. No earlier picture was reused, cropped, traced or repainted, and the poster PNG was not cropped. The game's code and `game.json` were not touched.

**Scripts and views** (all in `make/work/round3/`):
- `tools/views.py`: builds the views.
  - `poster_view()` reproduces the lead's poster view B exactly (checked: same JS, same fields), then re-aims the camera.
  - `backdrop_js()` is a camera that stands on a world's surface. The droplet is not drawn there.
- `tools/lockup.py`: sets the title lockup, writes its JSON, checks it at minimum width, and composes the share card.
- `tools/mock.py`: mocks the game-page hero (desktop and phone) over a backdrop.
- `tools/guardzone.py`: runs `guard.py` on the whole picture and on its right 35 %.
- Exact views: `share-views.json`, `poster916-views.json`, `backdrop-views.json`, `backdrop-phone-views.json`.

**Finish (the poster's):**
- vig 0, grain 0.01, streak 0.45, bloom default (render.js resets it to the game's 0.6), exp and sat at the game's defaults, neb 0.03.
- The share card and phone poster use the poster's staging: `titlejs` over Nacre, form 2, solo plus Umbra, no rings, sunburst 0.2, no decor, eyes lx −0.7/−0.6 and ly 0.9, key light `[-0.6, 0.45, -0.55]`, dof 0.55.
- The backdrops use the same key light and dof 0.55, with the focus set on the floor (there is no subject).

**render.js fix (coordinator's note):** none of my renders were affected:
- every view had its own `cleared` key, so the page reloaded for each view;
- no view changed bloom, exp or sat, and neb was set explicitly in every view;
- all finals were rendered after the fix (07:20–07:25, fix at 07:12).

---

### title-lockup.png (+ title-lockup.json)
- **file:** `bug/title-lockup.png`: a 1600×577 transparent master. `bug/title-lockup.json` holds `{"file":"title-lockup.png","min_width_px":120,"font":"TeX Gyre Adventor Bold","note":…}`.
- **shows:** "PERLUNE" in capitals, filled with the game's iridescent sweep. A soft violet glow sits behind it, with a small cyan/magenta split.
- **made by:** set in code (`tools/lockup.py`, PIL with raqm, pair kerning kept), following the lead's font decision:
  - **Face:** TeX Gyre Adventor Bold, the lettering the game has already published on its cover and trailers.
  - **Tracking:** +4 %.
  - **Fill:** the game's own `--iri` gradient at 100°, computed the way CSS paints it (#FF9AD5 0 % → #9FF6FF 30 % → #FFE6A8 55 % → #C9A8FF 80 % → #FF9AD5 100 %), clipped to the letters.
  - **Glow:** the game's resonance violet #B28CFF, as a glow only, at two blur radii, like its bloom.
  - **Split:** the game's glass cyan #5FF3FF and dust magenta #FF5C9A, offset ±0.25 % of the width, at 55 %.
- **agent:** round3
- **check:**
  - **Smallest readable width: 120 px** (letters 19 px tall there). It was set from an 18 px cap height, the strict end of the pack's 12–18 px.
  - `work/round3/lockup-check-min.png` shows it at 120 px on night (#05040A) and on linen, at 1× and at 4× with hard pixels:
    - on night it reads cleanly;
    - on linen it is legible but pale (a pastel sweep on cream). It is drawn for the night, and both of its uses (the share card and the video's end card) are night.
  - **guard.py** (on night, master scale): ember 0 %. Lilac 7.0 %, mint 1.7 % and sun 0.7 % are guarded, all inside the letters. These are the sweep's #C9A8FF, #FFE6A8 and the cyan↔cream blend. The lead allows this inside lettering, and the lockup must stay away from Play.
  - **measure.py light** (on night): mid, L 0.229.
- **couldn't make / caveats:**
  - **The game's in-game title face is Tilt Prism** (`#title h1`, letter-spacing .01em, #F2ECF7). It cannot be fetched here: `the trailer's scripts folder fonts/TiltPrism.ttf`, `Syne.ttf` and `MartianMono.ttf` are 378-byte error stubs (a failed GitHub download, not fonts), fonts.googleapis.com is refused by the egress proxy (403), and no copy exists anywhere on the machine (searched). **Re-set the lockup in Tilt Prism once the file is supplied:**
    ```
    python3 make/work/round3/tools/lockup.py --font <TiltPrism.ttf> --track 0.01 --share-art make/work/round3/share-card-art.png
    ```
    This rewrites `title-lockup.png`, `title-lockup.json` (with a new `min_width_px`) and `share-card.png`.
  - The script only accepts the two approved faces (Tilt Prism and TeX Gyre Adventor), so a random fallback can't slip in.

### share-card.png
- **file:** `bug/share-card.png`, 1200×630. The untitled art is kept as `work/round3/share-card-art.png`, so the title can be re-set later.
- **shows:** the poster's one image, "A droplet faces the Eclipse", recomposed for the link card:
  - the droplet is on the right, its centre at **0.73** of the width, eyes turned up-left to the Eclipse;
  - the Eclipse hangs just above-left of it, at 0.43–0.63, as the only light;
  - the left 43 % is the plain contour-line night, with the title lockup lower-left (letters from 5 % to 45 % of the width, centred at 60 % of the height);
  - the bottom band holds only a few dust motes.
- **made by:** rendered fresh from the game, not cropped from the poster.
  - It uses the poster's staging and finish, at 600×315 css @2.
  - The camera was re-aimed for this frame: `cam −0.30, dist 4.7, up 1.1, ty 0.15, fov 0.80, side 1.7`. The wider fov and nearer camera keep the Eclipse out of the title zone while it still touches the droplet, as on the poster.
  - The lockup was composited by `lockup.py`.
- **agent:** round3
- **check:**
  - **270 px wide** with a linen bug.games bar, beside the wall poster (`work/round3/share-270-final.png`): the same image and register as the wall. The title reads, with letters about 20 px tall at that size (108 px wide, which is at or above the 120 px master minimum once its glow margin is counted).
  - **guard.py:** ember 0 % (no ember anywhere). Nothing guarded in the bottom band (the platform bar). Lilac 1.49 % (largest block 20×20), mint 0.25 % (15×15) and sun 0.09 % (12×12) come from the droplet's pale highlights and the lettering's sweep. No block reaches 24×24.
  - **measure.py light:** dark, L 0.144 (the poster is 0.121).
- **couldn't make / caveats:**
  - The title is in the published cover/trailer lettering, not Tilt Prism (see above).
  - No player names, no Play and no ember.

### poster-9x16.png
- **file:** `bug/poster-9x16.png`, 1080×1920.
- **shows:** "A droplet faces the Eclipse", recomposed for 9:16:
  - the Eclipse with its rays fills the upper half, at (0.36, 0.32);
  - the droplet floats below it, at (0.58, 0.66), its eyes turned up-left to the light;
  - the pink/cyan title dust trails off below.
- **made by:** rendered fresh from the game with the poster's staging and finish, at 540×960 css @2. The camera was re-aimed for the tall frame (`cam −0.13, dist 5.8, up 2.6, ty 1.2, fov 0.95, side 0.28, lx −0.6`). It is not a crop of any poster.
- **agent:** round3
- **check:**
  - **Compared with the 2:1 poster and the 2:3 side by side** (`work/round3/cmp-9x16.png`): the same one image, the same register (one lit pocket in the dark), the same light and inks.
  - **guard.py:** ember 0 %. Lilac 0.46 %, largest block 21×21, from the droplet's lavender highlights; the lead's poster measures 0.50 % and 23×23. Sun 0 %, mint 0.01 %.
  - **measure.py light:** dark, L 0.137 (the 2:3 is 0.136).
- **couldn't make / caveats:** none.

### backdrop.png and backdrop-phone.png
- **files:** `bug/backdrop.png` 1440×577 and `bug/backdrop-phone.png` 390×826. Each was composed and rendered at its own size, not cropped from the other.
- **shows:** Ferrum Dunes at rest, under one light from the upper left.
  - The dark contour-line night of Ferrum's own sky fills the top.
  - The world's curved horizon runs the full width as a hard edge, with its floor below in dusky iron-rose and Ferrum's pink contour lines; a few glints catch the light on the left.
  - The horizon sits at 0.80 of the height at its highest, falling to 0.87 at the sides (desktop), and at 0.63 (phone), so the floor runs under the hero: below the poster card and the rail on desktop, and below the info card on phone.
  - There is no droplet, no Eclipse and no text.
- **made by:** rendered from the game (`backdrop_js`):
  - the camera stands 1.2 above Ferrum's surface and looks along the ground (desktop fov 0.42, phone fov 0.60), with the poster's key light;
  - `solo`, no sunburst, no rings, no decor, no floating dust;
  - the droplet is not drawn, and its ground glow was moved off-world with it.
  - The world is shown in its own landing state: `wake 0.3`, the muted colour a world has when you land on it, before you wake it (`wakeTarget()` in juice.js). The fully woken floor is a loud brick-orange that competed with the hero and sat right above Play.
- **Why Ferrum:** I rendered Cathedra, Hydrargyra, Ferrum, Nacre and the Geode from the same camera and ran guard.py on each:
  - **Cathedra:** lilac-guarded. Its contour colour #C7A6FF (lilac 4.7) lights the horizon rim and lines (15 % of the floor zone, 17×17 block).
  - **Hydrargyra:** sun-guarded. Its #FFC23D (sun 3.0) lines and gold mirror.
  - **Nacre:** lilac and mint in the pearl film (mint 0.5 % in the rail zone).
  - **Geode:** mint and lilac, and it is the secret world.
  - **Ferrum:** the only ground that measured free of all four platform colours.
  - Its dark iron-rose also sits apart from the poster's violet, amber and pearl, so the poster leads.
- **agent:** round3
- **check:**
  - **guard.py, whole picture and right 35 % (the info rail):**
    - desktop: 0.00 % ember, lilac, sun and mint in both;
    - phone: 0.00 % for all four (the right 35 % has ember caution 0.01 %, nothing guarded).
    - A 3 px ember-red glint sliver near where the phone's Continue sits was removed by turning the view 0.05 rad (phone yawE 1.25 against desktop 1.2).
  - **Floor colour** (median): desktop #78383F (ember ΔE 33.4), phone #612F30 (ember ΔE 37.0). Both free.
  - **measure.py light:** desktop dark, L 0.048; phone dark, L 0.093.
  - **Page mocks** with the poster laid over them the way references 04 and 07 lay out the page (`work/round3/mock-backdrop-desktop.png`, `mock-backdrop-phone.png`): the poster leads. The floor reads as ground under the hero and the rail stays on calm night.
- **couldn't make / caveats:**
  - **The phone floor reaches the bottom of the 826 px asset.** If the page shows the whole asset, Continue sits on the dusky floor (ember on #612F30, contrast ≈ 3.5:1, against ≈ 6:1 on the page night). In reference 07 the backdrop stops just under the info card, which would show only the horizon and the first band of floor.
  - Ferrum's sky contour lines are its own muddy olive and red (s1/s2 at neb 0.03). They show only in the side margins.

### Choices
- **Share-card title placement:** lower-left, below the Eclipse's level. The letters then span 40 % of the width without touching the Eclipse, and stay above the minimum size at a 270 px preview.
- **Lockup fill:** the sweep, not the title screen's plain #F2ECF7, following the lead.
- **Lockup minimum:** an 18 px cap height (the strict end), because the lettering carries a glow and a split.
- **Backdrop light:** one key from the upper left, the same vector as the poster. No light source is drawn: the poster's Eclipse is the page's only drawn light.
- **No Eclipse and no sunburst in the backdrop**, so there is no second focal point.


---

## Moving poster (agent: living)

### bug/living-poster/perlune.js

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

#### Choices (living)

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

---

## Bring-together (lead): side by side, checks, what changed at the end

**Side by side** (`checks/all-pictures.jpg`): every picture reads as one game. They share:
- one material, the liquid pearl-chrome droplet with dark eyes and a glass crest;
- one night with faint contour lines;
- one key light from the upper left, or from the source in the picture;
- the same finish: bloom on what emits, grain 0.01, no vignette.

Two pictures drifted and were redone by the lead:
- **The update close-up.** The Lens Wings build read as an aeroplane, and the droplet was cut off. It was re-rendered on Ferrum, with the ground flood left out because it made large guarded blocks.
- **`poster-1x1.png`.** Its lilac sheen block measured 25×25, so it was re-rendered one step farther away (now 23×23).

**Checks run at the end**

| check | result |
|---|---|
| Wall shapes, poster with the icon (`checks/poster-wall-shapes.jpg`, `checks/poster-wall-hero.jpg`) | The one image survives every shape, from the 3.5:1 strip to the column and 90×70. The 4:3 crop around the focus holds (`checks/poster-crop-4x3.jpg`). |
| All seals in one 32 px strip, all three states (`checks/seals-strip-32*.jpg`) | Every glyph and the three outline kinds (round = feat, six-sided = collection, 12-ray corona = event) read at 32 px. |
| Small marks at 1× on night and on linen beside three other games' icons, and at 4× hard pixels (`checks/marks-night-linen-4x.jpg`) | The icon reads at 46 and the emblem at 30 as this droplet. |
| guard.py on every PNG (`checks/guard-all.txt`, largest solid guarded block per colour) | See below. |

guard.py details:
- No art picture has a block of 24×24 or more of ember, lilac, sun or mint.
- The largest blocks are lilac 23×23 on `poster.png` and `poster-1x1.png` (the droplet's own lavender top reflection, high in the frame) and sun 21×21 on `gallery/02.png` (the halo and the hydras' gold glow).
- The poster's bottom 146 px (caption strip plus Play zone) has 0 % guarded colours.
- `title-lockup.png` has larger blocks inside its letters: the game's iridescent sweep stops `#C9A8FF` / `#FFE6A8` are lilac- and sun-guarded. This is allowed in lettering; keep the lockup away from Play.

**Light bands (measure.py light)**

| picture | L | band |
|---|---|---|
| `poster.png` | 0.121 | dark |
| `poster-2x3.png` | 0.136 | dark |
| `poster-1x1.png` | 0.125 | dark |
| `poster-9x16.png` | 0.137 | dark |
| `share-card.png` | 0.144 | dark |
| `key-still.png` | 0.126 | dark |
| `result-still.png` | 0.177 | dark |
| `gallery/01.png` | 0.287 | mid |
| `gallery/02.png` | 0.212 | mid |
| `gallery/03.png` | 0.168 | dark |
| `gallery/04.png` | 0.165 | dark |
| `gallery/05.png` | 0.154 | dark |
| `gallery/06.png` | 0.092 | dark |
| `updates/metamorphosis.png` | 0.178 | dark |
| `backdrop.png` | 0.048 | dark |
| moving poster, held frame | 0.129 | dark |

## Couldn't make, caveats, and questions for Yelnur

1. **The game's own fonts aren't available in this workspace.** Tilt Prism (display), Syne and Martian Mono load from Google Fonts in the build. Here every font source is blocked, and the local copies are download-error stubs.
   - The title lockup and the share card's title are set in the lettering the game already published on its cover and trailers: TeX Gyre Adventor Bold in capitals with the game's iridescent sweep.
   - The pass tile is left unlettered; the platform prints the name under it.
   - Send `TiltPrism.ttf` and one command re-sets the lockup and the share card: `make/work/round3/tools/lockup.py --font <TiltPrism.ttf> …`, see the round3 notes.
2. **`game.json` doesn't exist yet, so it declares no moments.** The nine seals are drawn for proposed moments, each something the build really records: stages, the Bell, the Geode, the finale, resonances, forms, the constellation. When `game.json` is written, its moment ids should match the seal file names, or the seals get renamed. The Lantern Night seal is the proposed event's.
3. **Store looks, pass rewards and the event are proposals.** They are rendered by the game's own renderer, with the looks applied at render time in the page; the game's files were never edited. The event's darkness is Umbra's own mechanic, cast on Nacre.
4. **The update file is named after the change** (`updates/metamorphosis.png`), not a version number, because the game has no platform version yet. Rename it to the version when you know it.
5. **The icon, emblem and chip draw the eyes larger than the game's proportions** (×1.35–1.9), so they survive at 46 and 30 px. At true size the eyes vanish.
6. **Moving poster:** on a laptop GPU every mode is about 0.3–1.1 ms per frame. With forced software raster, enter and loop take about 4 ms, over the ~2 ms budget. The held frame matches the poster.
7. **Gallery 03 (Cathedra):** five isolated pixels of the world's own lilac outline sit in the bottom 26 px, as two line fragments with no block. The world can't be reframed without losing it.
8. **Phone backdrop:** its floor runs to the bottom of the 826 px picture. If the page shows all of it, Continue sits on the dark floor.
9. **Moonlet store tile:** the moon is shown as itself on a thin orbit line. Earlier stagings read as a ringed planet, too close to another game's poster, so this one was chosen.

**Not in this pass:** no trailer or gameplay video (rule 4), no change to the game's code, no products, pass or prices declared.
