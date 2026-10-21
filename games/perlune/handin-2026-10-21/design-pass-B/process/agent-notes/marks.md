# Notes · marks (icon, emblem, chip)

All three are new renders from the game's own WebGL2 renderer (`tools/render.js` driving `sivver/dist/perlune.local.html` headless). Each one is rendered separately, for its own size, at 8× its master. None is the poster shrunk, and none reuses an earlier picture. The game's code and `game.json` were not touched.

**Scripts:** all in `/home/claude/passB/work/marks/`:
- `mk_render.py`: builds the views;
- `mk_marks.py`: the settings for each mark (render, then finish);
- `mk_finish.py`: lays the render on the night ground and reduces it;
- `mk_check.py`: the check board;
- `mk_variants.py`: side-by-side trials.

The raw renders are in `work/marks/raw/`.

## How all three were made (shared)

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

## Entries

### icon-46.png
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

### emblem-30.png
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

### chip-64.png
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

## Choices
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

**Check board:** `/home/claude/passB/work/marks/marks-check.png` holds:
- all three marks at 1× on night and on linen, beside Night Swim, Miradouro and Typos, cropped from `reference/16-profile.png` for the board only;
- each at 4× with hard pixels beside the same three;
- a look-alike row next to the roster planet-with-eyes game;
- the masters at 1:1.

Guard maps are in `work/marks/guard-*.png`, and the results are in `guard-results.txt`.
