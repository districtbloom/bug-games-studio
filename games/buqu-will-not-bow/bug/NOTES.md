# Buqu Will Not Bow · bug.games design pass A

Made in one go, from scratch. Nothing in this folder reuses, crops, traces or repaints a picture made before this pass (the trailer posters, the earlier poster, icon and store pilot are all out).

## Style note (every picture follows this)

- **Medium:** glazed ceramic mosaic. Every surface is cut into tesserae set in cream grout `#f1ece2`, each tile with its own slight glaze shift. The game lays this live with its own tessellator (`src/mosaic`).
- **Line:** no drawn outlines; edges are where tiles meet across the grout. Only Buqu's head carries an ink ring `#35395f` and ink features `#23264a`, laid as tiles too.
- **Main colours:** sky cobalt `#3a98da` to `#6cc1ec`, jade and turquoise hills `#24a66c` / `#27b6b0`, the court's imperial gold `#e8ad2c`, and Buqu's own vermilion paint `#e2412b` (the game's ink).
- **Light:** one sun in the sky. Flat, even daylight with the sun as a disc of tile rays; time of day is the zone's sky set (noon over the parade, pink at Mirror Lake, dusk indigo-to-coral at the Last Gate). Light changes colour in steps, tile by tile, never as airbrush.
- **Characters:** Buqu, the old court painter's stubborn head (white topknot on a jade band, white braid and moustache, a nose like a brush, a frill of vermilion paint where his neck was; glares, howls, grits). His Radiance the Khan on his golden watchtower, and his guards.
- **In one sentence:** the Khan flings his court painter's head off the watchtower for fun, and the head bounces, skims and chains its way along the wall to escape.

## Plan (written before making anything)

### Poster (picture 1) and focus (picture 2)
- **Five words:** *Buqu howls across the sunset.*
- **Register:** silhouette. One shape holds the world: Buqu's head, big, in mid-flight, crossing a low dusk sun, his vermilion paint trail curling back to where he came from. Below him the wall and the Last Gate's hills sit low and dark.
- **Inks (4):** dusk indigo `#1d2a70`/`#3a4aa0`, coral `#ec8e78`, the sun's warm disc, and Buqu's vermilion (the game's own).
- **Light:** the sun in the picture, behind and to the right of the head; his sun-side edge is lit warm in tile steps, the far side cools to dusk.
- **Made:** background rendered by the game (its renderer, the Last Gate's dusk sky set, its sun); Buqu's head rendered by the game's own head sprite code at high quality, lit with tile-stepped light before tessellation; the paint trail laid with the game's own mosaic code.
- **Tall and square:** recomposed (re-rendered at 2:3 and 1:1 around the head), not cropped.
- **Focus:** on Buqu's face.

### Continue picture (5) · PLAN FIRST
Buqu at rest on the wall's walk where the last run stopped, glaring back over his shoulder at the far watchtower while two guards with nets close in from the right: the world as you left it. Daylight (Jade Gorge sky set), one sun.

### Gallery (7) · PLAN FIRST
Six slides in this order, each a real moment staged with the game's renderer:
1. Core loop: the Khan winds up and flings Buqu off the watchtower. *Caption: "The Khan winds up and flings his painter's head"*
2. Second mechanic: Buqu skims low over the moat, chaining bounce after bounce. *Caption: "Skim the water low to chain bounce after bounce"*
3. A place: riding the curled roofs of the Stair of a Thousand Eaves. *Caption: "Ride the roofs of the Stair of a Thousand Eaves"*
4. A character: His Radiance on the parade wall, horrified as Buqu gets away. *Caption: "His Radiance did not plan for this"*
5. A place: the Last Gate at dusk with its lanterns lit. *Caption: "Slip through the Last Gate before it closes"*
6. The payoff: at the Unpainted Edge Buqu lays the last tiles of the world. *Caption: "Reach the Unpainted Edge and finish the picture"*
(No co-op slide: the game is one player.)

### Seals (8) · PLAN FIRST
The game has no `game.json` yet, so it declares no moments. The game itself marks eight milestones: the first time Buqu reaches each zone (the Khan's line and "Reached …" on the result) and finding every hidden seal. These are drawn as the proposed moments; the names are the game's own zone names. Outlines by kind: **feat** = an eight-sided window frame, **collection** = a square chop with notched corners, **event** = a round moon gate.
- Valley of Parting Clouds (feat): a cloud split in two.
- Jade Gorge (feat): a V-shaped gorge between two cliffs.
- Stair of a Thousand Eaves (feat): one curled pagoda eave.
- The Wind Gate (feat): a gust curl through a gate arch.
- Mirror Lake (feat): a lotus pad on a ripple.
- The Last Gate (feat): two shut gate doors.
- The Unpainted Edge (feat): a brush ending in a blank stroke.
- Every hidden seal (collection): Buqu's own chop, the square seal he stamps.
Earned = the world's lit glaze (the zone's own ground in full light, one crimson accent); in progress = the same glaze dimmed into dusk tones inside the art; not yet = a quiet grey ring and the glyph. Never gold, never a padlock.

### Round 2 proposals (names and looks only, no prices)
**Store items (4)** and how each reads at 40 px:
- `jade-trail` · Jade trail: the paint trail laid in jade tesserae instead of vermilion. At 40 px: one bold green arc of tiles.
- `peony-pin` · Peony hairpin: a pink peony pinned in the topknot. At 40 px: a pink flower on a white bun.
- `crane-companion` · Crane companion: a red-crowned crane that flies beside him. At 40 px: a white bird with black wingtips and a crimson crown.
- `fish-kite` · Fish kite: a paper carp kite tied to the end of his braid. At 40 px: a striped turquoise fish on a line.
Reward verb (owned mark): **Laid**. The owned item's tile gets its last tessera pressed into the grout at the corner; held frame: a small inset tile in the bottom-right corner.

**Pass:** *The Long Wall* pass. Step unit: **a span** (one stretch of wall between two watchtowers). Rows: free on cream paper grout, pass on jade-hill courses, bug.pass on the dusk indigo of the Last Gate.
Rewards (8): free `plum-trail` (plum-blossom trail), free `jade-tassel` (jade tassel on the braid), free `lotus-chop` (his seal stamps a lotus), pass `magpie-companion` (a magpie that flies with him), pass `cloud-ribbon` (cloud-scroll ribbon on the braid), pass `indigo-trail` (indigo glaze trail), pass `lantern-pin` (a paper lantern hairpin), bug.pass member reward `moon-pin` (a crescent-moon hairpin).
Marker: a single lantern; next = swinging on its cord, held = set down and lit.

**Update:** `v5` · Imperial fireworks now fizzle when they hit a wall: a close-up of a rocket against the wall bricks, sputtering out in a puff of tile smoke. (In the current build.)

**Event:** `lantern-night` · Lantern Night: the whole wall hung with paper lanterns under a night sky, Buqu flying through the strings. (Proposal: the game has no events.)

## How this pass was run

- **Lead:** style note, plan, `design.json`, the poster in three shapes and its focus point, the shared toolkit (`tools/pass/`), the brief for the agents (`passwork/BRIEF_AGENTS.md`), the side-by-side review and the hand-back.
- **Eight agents, each with its own group:** `marks` (icon, emblem, chip), `stills` (Continue and result pictures), `gallery` (six slides), `seals` (eight moment seals and the event seal), `store-pass` (store, owned mark, pass tile, grounds, marker, rewards), `update-event` (update close-up and event banner), `round3` (backdrops, share card, phone poster, title lettering), `living-poster` (the moving poster module). Every agent got the pack, the style note, the plan and the finished poster, and wrote its own entries (below).
- **How pictures were made:** every world is rendered by the game's own renderer (`dist/test.html`, driven by `tools/pass/look.mjs` and `tools/poster.mjs`); characters and objects are drawn with the game's own mosaic code (`src/mosaic` Draw + tessellate + palette, the sprite geometry from `src/art2/msprites.ts`, the braid and trail rules from `src/game/head.ts` and `src/game/paint.ts`) through `tools/pass/run.mjs`. Exceptions are named in each entry: the title letter shapes are traced from the game's font files with Pillow (the tile fill is the game's), and the moving poster is a Canvas 2D port of the game's drawing code (the contract forbids images).
- **Nothing reused.** No picture made before this pass was reused, cropped, traced or repainted; the earlier stage-1 folder was set aside unopened (`_old_stage1_not_for_reuse/`) and the trailer, shots and share folders were off limits to every agent.
- **Game untouched.** No change to `src/`, `dist/` or the game's data; no `game.json`; nothing declared; no prices. (One note: the render-only `seamPx` option in `src/mosaic/tess.ts` was added in the earlier stage-1 round, before this pass; it defaults to the game's own 1 px and changes nothing in play.)

## Changes made to the plan while making (all for honesty or legibility)

- **Continue picture:** made on the Stair of a Thousand Eaves at noon, not Jade Gorge: the net guards only exist on the Stair (and at the dusk Last Gate). "The far watchtower" is the Stair's nine-storey pagoda tower, since the Khan's watchtower can't be seen from any daylight spot with guards.
- **Gallery 02:** the water is the Jade Gorge river; the game has no moat.
- **Gallery 04:** shows His Radiance admiring himself in his mirror as Buqu spits paint across it. "Horrified as Buqu gets away" doesn't exist in the build (the Khan's figure holds its release pose for the whole flight). The caption still fits.
- **Seals:** the earned accent is crimson `#b3283d`, not vermilion (vermilion is guarded against ember, and seals sit beside the platform's states). The feat outline is a square with cut corners (still eight-sided): a regular octagon read as the round event ring at 32 px.
- **Store `fish-kite`:** the body is the deep turquoise `#12909a`, not the light turquoise, after the mint correction.
- **Small marks:** the face uses the mark skin tones (pinker than the poster's peach), as the plan asks for pieces that sit beside Play and prices.
- **Update v5:** staged, not caught: Buqu is placed in flight just before the Wind Gate's rocket rack and the game runs on its own from there (the fizzle against a wall happened only once in hours of autopilot). Said plainly in its entry.
- **Event banner:** the game has no night sky set; the night is built from the game's own indigo palette by patching its sky, with the sun turned into a moon. Said plainly in its entry.
- **Mint correction:** the first colour readings missed mint (`#7FE3C0`, owned). Re-measured: the game's light turquoise `#5ed3c7` and light jade `#4fc585` are guarded against mint, `#27b6b0` and `#24a66c` caution. Store, pass, seals and marks use deep jades and teals instead; world renders keep the game's own colours.

## Open questions for bug.games

1. **The 120 px rule:** is it measured on the 1600×800 master or in display pixels on the wall? On the master, the poster's guarded vermilion stays 250 px clear of the caption strip; at the hero's display size (685×319) the paint frill's drips are about 100 px above it.
2. **Where Play sits** in the caption strip, on the Continue card and over the result still: the poster's bottom-left holds the game's jade hill (mint caution 13.4); the Continue picture's guards' robes (the game's ochre and terracotta, caution/guarded) sit in its right third; the result still's gorge sun (guarded against sun, tiled, ~49 px) sits in the top right, outside the middle 720.
3. **Moments:** the game has no `game.json`, so the eight seals are drawn for proposed moments taken from the game's own milestones (first reach of each zone, every hidden seal). Rename the files if the declared moment names differ.
4. **Downscaling:** do the 46 / 30 / 64 px slots shrink the 2× masters with a box or mipmap filter? The 1× checks assume so.
5. **`reward-held.png`** is a 400×400 overlay matching the 400 px store master; a 169×169 copy is a straight downscale if wanted.
6. **Sizes below the lettering minimum:** the pass tile's name needs a tile of at least 125 px; the share card's English line needs at least about 320 px width (at 270 px the letters are about 10 px tall); the title lockup reads from 134 px wide (recommended 201 px).
7. **Backdrop:** does the page darken the backdrop behind the rail text and the phone info? A few of the game's pale tones under the rail sit near lilac and mint (no blocks).
8. **Moving poster:** is OffscreenCanvas allowed in board modules? The module caches its layers in it (as the pack's example does); without it a frame costs about 15 ms. Frames during a continuous plate resize cost about 3 ms (2 ms budget).
9. **Event banner:** where exactly Join sits in the left 45% (a darkened fort fills its outer fifth).
10. **Update v5** is very light (L 0.92, the Wind Gate's own haze): worth a look beside light posters.
11. **The wall photo** (`reference/01-home-for-you-wall.png`) is not in the pack, so `wall.py` made only the shapes sheet, not `wall-hero.png`.

## Findings about the game (seen while making; nothing changed)

- The Last Gate's mask (`maskTex`) renders as a plain gold egg with two eyes: a fill covers its face.
- The Last Gate's closing doors are drawn as flat red rectangles, not mosaic.
- The guard sprite (`figureTex`) cuts off its own net at the edge of its box.
- At small sizes the game's seal stamps (`sealTex`) read as letters or digits.
- The Khan's figure holds its release pose for the whole flight, so he can't be seen reacting while Buqu gets away.

## The pictures, one entry each

Each entry: the file · what it shows · how it was made · which agent made it · the check result · anything that could not be made. Check sheets are in `checks/<group>/` in this folder (as JPEG copies of the working folder's `passwork/checks/<group>/`, which the entries name); the scripts that rebuild every picture are in the game's `tools/pass/`.

### Poster and focus point (pictures 1–2) · agent: lead
##### `poster.png` · `poster-2x3.png` · `poster-1x1.png` (picture 1)
- **What it shows:** Buqu's head howling as he flies across a Last Gate sunset, his vermilion paint trail behind him and his white braid streaming back. Five words: *Buqu howls across the sunset.* Register: silhouette (his head is the one shape; the sun behind-right lights him).
- **Sizes:** 3200×1600 (2:1), 1200×1800 (2:3), 1600×1600 (1:1). The tall and square versions are recomposed (each background re-rendered at its own aspect with the sun placed for it, the head re-drawn and re-placed), not cropped from the 2:1.
- **How it was made:** the world (the Last Gate's dusk sky set, its sun, the snowy indigo karsts and the mist) is rendered by the game's own renderer (`tools/pass/look.mjs`, camera at x≈35,700, zoom 0.55; the sun's position and size moved through the game's sky uniform; the busy forts at the bottom cut off by rendering taller and keeping the top). Buqu's head is drawn with the game's own mosaic code (`Draw` + `tessellate` + palette) from the game's head-sprite geometry (`headTex` 'howl', ported in `tools/pass/head.ts` with a scale so its tiles stay as small as the world's; the game's sprite itself, blown up to this size, would give face tiles several times larger than the sky's bricks). The light is laid before tessellation in four flat bands (sun side warm, far side dusk-cool), so it steps tile by tile. The braid is the game's braid (a chain of white tesserae and a jade ribbon, `head.ts`) cut into small flowing tiles; the paint trail follows the game's trail rule (`paint.ts`: a tile every 2.6 units in the vermilion set), each bar laid as three tesserae. Compositing: `tools/pass/compose_poster.py` (layouts in `passwork/poster/layout_*.json`).
- **Inks:** dusk indigo `#1d2a70`/`#3a4aa0` (free), coral `#ec8e78` (caution, ember 12.0), the gate sun `#ffb070` (caution, sun 14.8), Buqu's vermilion `#e2412b` (the game's own ink, guarded: laid as tiles, never a block, kept out of the bottom of the frame).
- **Agent:** lead.
- **Checks:** previews at 740×370, 260×367, 150×177 and 90×70: the head reads in all, including 90×70 (`passwork/checks/poster/poster-previews.png`). `wall.py` shapes with focus 0.55, 0.38: the head holds from the 577×163 strip to the 140×305 column (`passwork/checks/poster/wall-shapes.png`; the wall photo is not in the pack, so `wall-hero.png` could not be made). Light band (`measure.py light`): 2:1 L 0.595 C 0.305 **light**; 2:3 L 0.566 C 0.274 light; 1:1 L 0.587 C 0.284 light. Not loud. Placement beside other light posters is the platform's call. Bottom 26 px: white mist and the bodies of the peaks, nothing important. Bottom-left corner: a jade hill and a peak, calm. Guarded colours (the vermilion trail and the paint frill at his neck) stay out of the bottom of the frame: their lowest tiles sit at 0.69 of the height in the 2:1 (250 px above the caption strip on a 1600×800 master, the rule's 120 px), 0.66 in the 2:3 and 0.76 in the 1:1. Read at the hero's display size (685×319) the frill's drips are about 100 px above the strip: if the 120 px rule is meant in display pixels, tell us and the head moves up. What sits in the bottom 15 % (120 px of a 1600×800 master): the white mist `#e3e4df` and the indigo peaks `#3459ab` (free), slivers of coral sky between the peaks (ember caution 12.8) and, at the far left, the Last Gate's jade hill (`#5dc8c8`, mint caution 13.4). Nothing guarded. These are the game's own colours; I left them rather than change them, and the hill stays in every camera position I tried. If Play or an owned mark appears at the left end of the caption strip, that corner needs a recompose. No text, numbers, HUD, frame or vignette.

##### `publish.json` (picture 2)
- **Focus:** x 0.55, y 0.38, on Buqu's face (between his eyes and his open mouth).
- **Checks:** `wall.py --focus 0.55,0.38` in every shape; 4:3 phone game page crop (520×390) and the half plate (288×316) keep his whole face and the sun beside it (`passwork/checks/poster/poster-previews.png`).
- **Agent:** lead.

### Small marks: icon, emblem, chip (agent: marks)

All three are drawn fresh with the game's own mosaic code. Nothing was reused, cropped or traced, and the poster was never shrunk. Each mark is drawn at its own size with its own tile scale.

**How they were made (all three):** `tools/pass/marks/marks.ts`, run through `tools/pass/run.mjs`. Parameters are in `tools/pass/marks/final.py`, and `node tools/pass/run.mjs tools/pass/marks/marks.ts "$(python3 -I tools/pass/marks/final.py)"` rebuilds the three files exactly.
- **Head:** the coordinates of the game's `headTex` (`src/art2/msprites.ts`): face, ring, topknot, jade band, nose, glare eyes and brows, and the pigment frill with its three drips. They are laid in the game's `Draw` and cut by the game's tessellator (`src/mosaic/tess.ts`), using only the game's materials: SKIN for the face, FLOW for the hair, ring and frill, CHIP and PLAIN for the eyes and brows, and FINE for the drips.
- **Braid (chip only):** the chain geometry from `src/game/head.ts`. It is white links tied off with the ribbon and ends in the white tassel.
- **Ground:** the game's sky bond (MT.BRICK) in the dusk indigo colours, one glaze per brick, stepping toward the light. It is laid in its own `Draw` at a larger tile scale than the head, so the bricks show about 11×6 px at display size. The head is composited over it pixel for pixel, and the head keeps its own edge grout.
- **Light:** one light from the upper right, as on the poster (sun behind and right). It is applied as flat glaze bands before tessellation (one lit step, one shade step), so the light changes tile by tile with no airbrush. Ink and white hair keep their glaze. The frill sits under the head facing away from the light, so it always takes the shade step.
- **Grout:** cream `#f1ece2`, 1 px on every master (92, 60 and 128 px).
- **Format:** square RGB PNGs, fully opaque, sharp corners, no mask, no text.

**Changes from the game's sprite, made only for legibility at mark sizes:**
- The head is tilted 20° chin-up, the way he flies on the poster.
- The eyes are enlarged 1.75–1.8× and set wider apart, so the two whites never join into one shape.
- The brows are ink, like `head.ts`'s 'icon' level of detail. They are turned back by the tilt so the glare keeps its angle on screen.
- The frill is enlarged 1.3–1.85× and the nose 1.3×.
- The ring is laid in FLOW rows rather than LINE, so the grout doesn't chop it into beads.

**Colours:**
- Mark skin is `#eab0a6` for the face, with `#f4c8bc` for the lit nose.
- The crimson is `#b3283d`, laid in the shade step (about `#a02d4d`). Plain `#b3283d` with its brightest glazes measured ember 17.6–19.5 (caution).
- The jade is darker than the game's: band `#24705e`, ribbon tie `#0f5a3e` (K.jade5). With `#1f8f5e`, the 1 px grout beside the band measured mint 19.2 (caution).
- The dusk ground runs `#1d2a70 → #2a3888 → #3a4aa0 → #5a5aab → #6b5fb0`. `#8a6db8` was dropped as the top step because its bright glazes measured lilac 15–19 (caution).
- There is no gold, no sun colour and no ember, lilac, sun or mint anywhere.

**Checks (all three):**
- **Colour zones** (`tools/pass/marks/zones.py`): every pixel measured with measure.py's own CIEDE2000. 0 guarded and 0 caution pixels in all three; results in `passwork/checks/marks/zones.txt`.
- **1× sheets** (`*-1x.png`): each mark at its display size on night and on linen, beside three neutral stand-ins (plain numbered linen squares). Each is also shown in a list row with the title, "Continue" and a Play pill on the right, for context only. The stand-ins, the row text and the Play pill appear only on the check sheets, never in the art.
- **4× sheets** (`*-4x.png`): the display size at 4× nearest neighbour, next to the master at 2× (icon, chip) or 4× (emblem) nearest neighbour.
- **Family sheet** (`family-1x.png`): all three at 1× together.
- **Wall shapes** (`passwork/checks/marks/wall/wall-shapes.png`): wall.py run on a copy of the poster with `--icon bug/icon-46.png`. The icon sits beside the poster in every wall shape. The wall photo isn't in the pack, so only the shapes sheet exists.
- **How the 1× size was made:** the master downscaled 2:1 with a box filter, standing in for the browser's mipmap downscale.

---

#### bug/icon-46.png
- **Shows:** Buqu's head, chin up and glaring right, on a dusk-indigo brick ground: a white topknot on the ink ring, two fierce eyes, the brush nose and a crimson paint frill.
- **Size:** 92×92, drawn for 46. Tiles are about 8–10 px at 92 (4–5 px at 46).
- **How:** drawn in the game's code (see above).
- **Agent:** marks.
- **Last survivors:**
  1. The white topknot with its jade band.
  2. The ink-ringed head with two fierce eyes under ink brows. The brush nose stays as the one bump on the ring so he faces right.
  3. One hot colour: the crimson paint frill with its three drips.
  Dropped: the hair cap, the ear, the cheek, the moustache, the beard and the mouth.
- **Check result:**
  - At 1× on night and on linen, beside three stand-ins: reads as a character's head, not a blob, gem, wifi, letter or gear. The white knot breaks the circle at the top left, the nose breaks it at the right, and the crimson collar sits underneath.
  - The dark square holds its edge on linen. On night, the indigo square is still clearly lighter than the page.
  - At 4× hard pixels: two separate eye whites with pupils and slanted ink brows, an unbroken ring, a white knot with a dark-jade band, and the drips visible below.
  - Colour zones: 0 caution / 0 guarded. The nearest platform colour is ember at 20.1 (a skin glaze).
  - Light band: L .54, C .22 (light). The pale face fills most of the mark.
- **Couldn't make:** nothing missing. Per direction, the poster's peach skin and vermilion are replaced by the mark tones, so the icon's face is pinker than the poster's.

#### bug/emblem-30.png
- **Shows:** the same head with fewer parts, a ringed face with two fierce eyes, a white knot and a crimson collar, on dusk indigo.
- **Size:** 60×60, drawn for 30. Tiles are bigger relative to the mark: about 10 px at 60 (5 px at 30), about 1/6 of the width.
- **How:** drawn in the game's code (see above). It is not the icon scaled down. It has its own layout and tile scale. Each eye white, pupil and brow is a single cut piece (PLAIN/CHIP), and the eyes are spaced so they stay two eyes at 30 px.
- **Agent:** marks.
- **Last survivors:**
  1. The white topknot. The jade band remains only as a thin tie.
  2. The ink ring with two fierce eyes.
  3. The crimson frill, a collar with no drips.
  Fewer parts than the icon: no nose and no drips.
- **Check result:**
  - At 1× (30 px) on night and on linen: reads as a round, glaring head with a knot on top and a red collar, and it is the same character as the icon.
  - At 4× hard pixels: two eyes, each with a slanted brow, and a clean ring.
  - Earlier tries were redone because they failed at 30 px:
    - Joined eye whites read as goggles.
    - Thick arched brows read like the characters "1S". That was a letter read, so it was rejected.
    - A thin frill read as a smile.
  - Colour zones: 0 caution / 0 guarded (nearest ember 20.9).
  - Light band: L .55, C .21 (light).
- **Couldn't make:** nothing missing. At 30 px the glare is legible but small. The silhouette of knot, ring and collar carries the mark.

#### bug/chip-64.png
- **Shows:** the icon's head, glaring right, with his white braid arcing back from the topknot to its jade ribbon and white tassel, on dusk indigo.
- **Size:** 128×128, drawn for 64. Tiles are about 9 px at 128 (4.5 px at 64).
- **How:** drawn in the game's code (see above). The braid uses the chain geometry from `src/game/head.ts`, with white links alternating with stone `#cfc6b8`.
- **Agent:** marks.
- **Parts:** the icon's three survivors (topknot, ringed head with fierce eyes and nose, crimson frill) plus one part, the braid, which ties it to the poster. That is more parts than the icon and fewer than the poster: no sun, no trail, no hills, no howl.
- **Check result:**
  - At 1× (64 px) on night and on linen, beside stand-ins and in a list row: reads as Buqu with his queue. It is a mark, not a scene.
  - An earlier braid in near-white links fused with the knot into a nightcap with a pompom. It was redone as a thinner plait with alternating links, starting from the back of the knot.
  - At 4× hard pixels: separate links, the ribbon and the tassel are all inside the frame.
  - Colour zones: 0 caution / 0 guarded (nearest ember 20.4, lilac 20.5).
  - Light band: L .47, C .25 (mid).
- **Couldn't make:** the dusk-sun sliver was not used. One extra part was allowed, and the braid ties to the poster more safely than a sun-coloured shape.

---

**Lettering:** none in any mark, so there is no minimum lettering size.

**Open questions for the platform:**
1. Do the 46/30/64 px slots downscale the 2× masters with a box/mipmap filter? The 1× checks assume so.
2. Are the marks shown on light seal faces? The emblem is a dark indigo square on purpose, so it holds on both night and linen.

### Stills (agent: stills) · DIRECTION 5 and 6

Both pictures are new for this pass. Each one is a world plate rendered by the game's own renderer (`tools/pass/look.mjs` on `dist/test.html`), with Buqu's head (and, in the Continue picture, the two net guards) drawn using the game's mosaic code and set into it. The same tools made the poster. Nothing comes from an earlier picture. Every step is in a script and rebuilds byte-identical output: `bash tools/pass/stills/make_key.sh` and `bash tools/pass/stills/make_result.sh`. Working files are in `passwork/stills/` and check sheets are in `passwork/checks/stills/`.

#### bug/key-still.png · 720×352 · Continue picture

- **What it shows:** Buqu at rest on the wall's walk on the Stair of a Thousand Eaves at noon. He glares back over his shoulder at the far nine-storey pagoda tower and the sun behind it. Two net guards close in from the right with their nets up. The last bit of his trail is dissolving behind him, and paint chips lie where he landed.
- **How it was made:**
  - **World:** rendered by the game (`tools/pass/stills/key_world.sh`).
    - Camera: zoom 5.6, centred on world x 14620.
    - Tile layers re-cut by `sharp.js` at the resolution they're shown at. Tile sizes in world units stay the game's own; the cut is just finer, so close-ups aren't blurry.
    - The game's vignette and out-of-focus foreground framing layer are off.
    - The game's own sun is moved to the upper left.
    - The sky's gradient is set lower (`uHorizon` = 0.92 × screen height) so the zone's cobalt shows above the wall.
    - Banners, coins, the drum and two pines near Buqu are hidden.
    - The trail remnant and the chips are laid by the game's `PaintLayer` (`stroke`, `endArc`, `splat`, `flush`), using its own dissolve rule.
  - **Head:** drawn with the game's head geometry (`tools/pass/head.ts` `drawHead`, scale 1, which is the game's sprite at its 1.12 display scale). Glare uses the `icon` level of detail (1.45× eyes and ink under the brows) so it still reads as a glare at 360×176. With the full level of detail the eyes read as sleepy at this size.
  - **Guards:** drawn by `tools/pass/stills/pieces.ts` `netguard`. This copies the geometry and colours of the game's `figureTex('netguard')` into a wider box. The game's 18-unit sprite box clips the net, so in play you see little more than the pole. The guards are mirrored to face Buqu, with one net raised (frame 1) and one low (frame 0).
  - **Light:** head and guards are lit in tile steps by the one sun (`applyLight`, warm `#fff2b0` from the pagoda sun, shade toward sky `#3a98da`). The guards get shade only: a warm lit band pushed their robes into the guarded range.
  - **Braid:** laid by `head.ts`'s rule (white tiles on a cream grout bed, two jade-ribbon tiles and a round tail), draped down his back onto the walk.
  - **Finish:** pieces get the post pass's grade (saturation ×1.1, contrast ×1.05) so they match the engine render. Compositing is done by `compose_stills.py`.
- **Agent:** stills.
- **Check:** `passwork/checks/stills/key-still_continue-card.png` shows the picture in a neutral rounded-card mock at 360×176 and 132×66, on night and on linen, plus 4× hard-pixel views.
  - **360×176:** the glare, the guards with their nets, the tower and the sun all read.
  - **132×66:** three shapes survive, reading left to right: tower and sun, then the round white head with its ink ring and dark eyes, then two orange guards.
  - **Layout:** the bottom third is calm pink wall. No numbers, names or buttons.
  - **Light band:** L 0.757, C 0.312, which is light. The poster is 0.595, also light.
  - **Comparison:** `stills_beside_poster.png` shows both stills beside the poster.
  - **Colours:** wall face, sky and stone are free. The sun disc (pagoda sun) measures caution, 13.6–17.6.
- **Couldn't make, or changed from the plan:**
  - The plan line says Jade Gorge, but the game has no net guards there. They only stand on the Stair of a Thousand Eaves (x 12100–15800) and at the Last Gate, which is dusk. So the picture is on the Stair, still a daylight zone.
  - The Khan's own watchtower can't be seen from any daylight spot that has net guards. "The far watchtower" is therefore the Stair's own landmark tower, the nine-storey pagoda in the middle distance, which the game draws in its parallax layer.
  - The lead may want to update the plan line in `NOTES.md` to say "the Stair of a Thousand Eaves" and "the far pagoda tower".
- **Open questions for the platform:**
  - The guards' robes are the game's ochre. Graded, it measures caution (about 14). The lighter glaze tiles within it measure guarded against sun (about 11).
  - The robe hems are the game's terracotta. Graded, it measures guarded against ember (about 10.6).
  - These are tiled, not flat, and sit in the right third of the picture. If the Continue card puts Play or Continue over the right side, they would sit near it. Where does Play sit on the Continue card?
  - A small gold wall ornament is cut by the left edge at mid-bottom.

#### bug/result-still.png · 1600×352 · result picture (subject in the middle 720×352)

- **What it shows:** in Jade Gorge at midday, a long flight's vermilion paint trail arcs over the gap in the broken bridge-wall. Buqu is howling as he comes down onto the far span in the middle of the frame, splashing paint chips, with his braid streaming back along the arc. Turquoise karsts and the gorge's far arched bridge stand behind on the left; the sun is upper right. The picture has no text, numbers, signs, counts or prices.
- **How it was made:**
  - **World:** rendered by the game (`tools/pass/stills/res_world.sh`).
    - Camera: zoom 6, landing at world x 8830, just past the 8600–8780 gap.
    - Same staging as the Continue picture: tile layers re-cut, no vignette, no foreground layer, the sun moved to the upper right, the sky's gradient set lower, coins and one pine hidden.
    - **Trail:** laid by the game's `PaintLayer` along a flight arc. Following `game.ts`, it runs 5 units behind the head centre and widens with air time.
    - **Landing chips:** from `PaintLayer.splat`, as a stubborn bounce makes them.
  - **Head:** the game's head geometry with the full level of detail, using howl (the face the game shows on a chained bounce or at speed). It's lit in tile steps by the sun (warm `#fbe488`, the gorge sun) and tilted 15° along the descent.
  - **Braid and finish:** braid laid by the game's rule; same post grade.
- **Agent:** stills.
- **Check:** `passwork/checks/stills/result-still_headline-mock.png` shows the picture at 800×176 with a mock of the platform's headline "You played for 24 minutes." and two numbers in Instrument Sans Bold. The mock is centred and left-aligned, in white with a soft shadow and in ink. The middle 720×352 is also shown at 360×176. The mock is only a check sheet; the delivered file has no text.
  - **Copy:** ink copy reads everywhere. White copy reads over the cobalt sky and is weaker over the pale mist at the bottom left.
  - **Centred copy** sits over Buqu, since the subject has to be in the middle.
  - **Left-aligned copy** sits over the busier karst side.
  - **Middle crop:** the 720 crop holds the arc's descent and Buqu.
  - **Light band:** L 0.755, C 0.29, which is light.
  - **Colours:** the stone deck and sky are free.
- **Couldn't make, or left out:**
  - **No seal popping behind him.** The game pops one on a stubborn bounce (`sealTex`), and the brief allowed it as a shape. I rendered all nine seal seeds: their carved strokes read as letters and digits at this size (B, S, H8, 5…), which would break "no text or numbers". A vermilion square with a gold rim beside the result numbers could also read as a badge. So it's left out.
- **Open question for the platform:** the sun disc is the game's gorge sun. Graded, it measures guarded against sun (8.5–11). It's laid in tile rings (not flat), about 49 px across, at x ≈ 1300 (outside the middle 720) and in the top fifth. Will the platform print its numbers in sun colour, and where do they sit?

#### Tools (`tools/pass/stills/`)
- `sharp.js`: re-cuts the engine's tile layers for a close camera (same tiles, finer cut).
- `key_world.sh`, `res_world.sh`: world plates via `look.mjs`, plus staging and the game's `PaintLayer`.
- `pieces.ts`: the head (`drawHead` with light), the net guard (the game's geometry in a wider box) and the game's seal (`sealTex`), run via `run.mjs`.
- `key_layout.py`, `res_layout.py`, `compose_stills.py`: layouts, braid by the game's rule, post grade, compositing.
- `check_key.py`, `check_result.py`: check sheets.
- `make_key.sh`, `make_result.sh`: one-command rebuilds.

### Gallery (DIRECTION section 7) · agent: gallery

Six slides, `bug/gallery/01.png … 06.png`, each 1600×800, in the order the plan fixes. Every slide is one frozen frame of a real run of the current build (`dist/test.html`). The run is played by the game's own autopilot (`B.autopilot(0.95, true)`) from the Khan's throw onward and drawn by the game's own renderer: tiles, sprites, sky and sun, water, paint trail, effects. Nothing is composited, painted over or retouched afterwards. There is no text, arrow, badge, price or menu on any slide. The game's HUD is DOM and does not appear in a canvas capture. The in-canvas overlays (combo plaque, Khan cameo medallion, landing reticle, timing ring) are hidden, the same as in `tools/poster.mjs`.

#### How they were made (all slides)

- **Tool:** `tools/pass/gallery/shot.mjs`. It is a variant of `tools/poster.mjs` and `look.mjs` that adds a probe mode, a per-frame watcher and a final tile pass. The slide table is in `tools/pass/gallery/slides.py`. To rebuild one slide: `python3 tools/pass/gallery/slides.py s<N> final`, or render all six one at a time with `tools/pass/gallery/finals.sh 1 2 3 4 5 6`. The moments were found with `search.py` and `roofsearch.py`, which run many autopilot throws and log skims, roof rides, gate passes and the escape. The checks come from `checks.py`.
- **Determinism:** the game steps at a fixed 1/60 s with a seeded `Math.random`. Before the run starts, the title-screen state (Khan rig joints, camera spring, head expression) is reset, so a probe at 400×200 and the final at 1600×800 replay the same throw frame for frame. This was checked twice, and both runs matched to the frame. The view is not stepped during play, but the game's own camera still drives which objects spawn.
- **Saves:** each slide uses a plausible save (upgrade levels; `runs` = 5 so the short ceremony plays, or 0 for the first-run ceremony). Hint flags are set so no tutorial prompts appear. The seed and save for each slide are listed below.
- **Finish:** these settings keep the poster's finish: glazed tesserae in cream grout, tile-stepped sky, one sun.
  1. **Tile texels:** world tiles, parallax layers and structures are painted with at least 1.05× the screen's pixels per world unit. These are the same tesserae with the same sizes, painted with more texels, so the zoomed frames keep crisp grout and are not upsampled. This is the capture tools' maxQ idea, extended past the `base/2.7` cap.
  2. **Sun:** the zone's own sun disc, in its own colour and ring tiling, is moved into open sky inside the central 4:3. Its radius is 0.07–0.075 of the frame height.
  3. **Vignette and flash:** the soft vignette (`uGrade.z`) is off, because it is airbrush. The screen flash is zeroed.
  4. **Foreground plane:** the foreground framing plane (`view.fg`) is hidden. It is painted at 1.5 texels per unit, so at these zooms its branches would blur, and on slide 3 a blossom bough covered the whole subject.
- **Previews:** 400×200 and 800×400 previews came first. Finals render in 10–35 s each, one browser at a time. A few finals were redone after the checks; the reasons are under Checks.

#### Slides

##### 01.png · core loop
- **Caption:** The Khan winds up and flings his painter's head (47)
- **Alt:** On top of his golden watchtower His Radiance the Khan, arm still outflung, has just let go. Buqu's head flies out of his hand into the noon sky, howling, with his white braid streaming and the first vermilion paint tiles of his trail behind him.
- **Shows:** 0.15 s after the release. The Khan is still in his throwing pose (the rig holds the release frame) and Buqu has just left his hand, with the first tiles of the trail behind him. The Radiant Parade at noon, with blue karst, a rainbow and the sun at upper right.
- **Made:** real run, save {gauntlet 3, skull 2, balcony 1}, runs 5, seed 12345, frame 150. The autopilot whirls him and lets go 0.22 rad late, so this is a "good" throw: the "perfect" seal pops would have littered the sky. Zoom 2.14; Buqu's head is about 97 px across and the Khan about 490 px tall. The bottom edge sits on the throne terrace, so the tower's gold roofs stay out of frame.
- **Check:** subject inside the 4:3 crop (the Khan at its left, Buqu at its upper right). The bottom 26 px hold the jade balustrade, the Khan's indigo boots and green hills. Light L 0.814, C 0.294 (light).
- **Note:** the gong (gold tesserae, ~70 px) touches the bottom strip at the far left. That corner is outside the 4:3 crop.

##### 02.png · second mechanic
- **Caption:** Skim the water low to chain bounce after bounce (47)
- **Alt:** Buqu's head skims the turquoise river of Jade Gorge between jade karst pillars, bouncing off the water with a spray of chips. His paint trail has turned gold on the chain and dips to the river at each bounce, its reflection broken across the water tiles, and red seals pop where he touched.
- **Shows:** the third skip of a seven-skip chain (combo 5) on the Jade Gorge river, with a ferryman's boat and an arch bridge above. The trail turns gold at a chain of four, which is the game's own rule.
- **Made:** real run, save {gauntlet 6, balcony 4, skull 5, drums 3, fireworks 3, roof 3, teeth 4, wind 3, ink 0}, runs 5, seed 2, frame 1122. Zoom 2.3; Buqu's head is about 104 px across. The chain's gold arc comes down from the upper left to the dip where he touches the water, and the sun shows between two pillars.
- **Check:** subject inside the 4:3 crop. The bottom 26 px are water tiles. Light L 0.762, C 0.328 (light).
- **Note:** the plan says "moat", but the game has no moat. The waters are the gorge river and Mirror Lake. The river's first skims are the lowest in any chain the search found.

##### 03.png · a place
- **Caption:** Ride the roofs of the Stair of a Thousand Eaves (46)
- **Alt:** Buqu's head rides up the curled eave of a tiered green-and-gold pagoda on the pink wall of the Stair of a Thousand Eaves. His vermilion trail climbs from the wall below, under a noon sun.
- **Shows:** a roof ride (`mode: roof`, the Roof Riding upgrade, the autopilot holding) on the pagoda at x 12483.
- **Made:** real run, save {gauntlet 4, balcony 2, skull 3, drums 2, fireworks 1, roof 3, teeth 2, wind 0, ink 0}, seed 3, third throw of the session, frame 8933. Zoom 2.6; Buqu's head is about 118 px across, on the curled eave with the pagoda's tiers filling the right half. The foreground blossom plane is hidden.
- **Check:** subject inside the 4:3 crop. The bottom 26 px hold the pagoda's white base and dark door and the green near hills. The thin ends of the hills' yellow crest lines and the tip of his paint trail (a few small tiles) touch the strip. Light L 0.767, C 0.34 (light).
- **Note:** roof rides in the build are short (3–6 frames before the eave launch), so the slide catches him at the eave rather than mid-slope.

##### 04.png · a character
- **Caption:** His Radiance did not plan for this (34)
- **Alt:** His Radiance stands with his eyes closed, smugly admiring himself in his golden hand mirror, not yet aware that Buqu, held up on a cushion beside him, has just spat a blob of vermilion paint across it. Buqu grits his teeth in triumph next to the court gong.
- **Shows:** the first-run ceremony on the Radiant Watchtower, 0.06 s after the spit (`launch.t` 1.76), with the mirror freshly splattered.
- **Made:** real first run (runs 0, long ceremony), seed 12345, frame 154. Zoom 3.1, the bottom edge on the throne terrace.
- **Replaced moment:** the plan had "horrified as Buqu gets away", which can't be staged honestly from this build:
  1. Once the throw happens, `launch.update` no longer runs, so the Khan's rig freezes in the release pose for the whole flight. His follow, laugh and horror poses never play while Buqu gets away.
  2. His one real horror pose, 0.15 s after this frame, reads as a grin at gallery size (the curled moustache).
  The spit is the clearest real character beat, and the caption still fits.
- **Check:** subject inside the 4:3 crop. The bottom 26 px hold the jade balustrade, the Khan's indigo boots, the gong stand and hills. Light L 0.81, C 0.301 (light).
- **Note:** the Khan's yellow robe ends about 70 px above the bottom edge, and the gold gong disc ends about 30 px above it.

##### 05.png · a place
- **Caption:** Slip through the Last Gate before it closes (43)
- **Alt:** At dusk Buqu's head rolls through the open arched doorway of the Last Gate, a fortress wall of indigo and slate brick. Beside the flanking bastion's small door, a gap in the walls shows the low coral sun over blue karst.
- **Shows:** a net-man at x 37000 catches Buqu and lets him go. The gate's doors swing open (5.2 s cycle) and he rolls through the doorway at x 37295. The doors start shutting 0.7 s later. It is the same throw that reaches the Unpainted Edge in slide 6.
- **Made:** real run, save {gauntlet 6, balcony 4, skull 5, drums 2, fireworks 1, roof 3, teeth 4, wind 3, ink 0}, runs 5, seed 1, frame 5291. At fireworks 1 there are no rocket racks at the gate, so he arrives low. Zoom 2.8, framed close on the doorway; Buqu's head is about 127 px across.
  - The frame's top edge sits at world y 81, just under the Khan's gold mask, so none of the mask is in frame.
  - At left are the flanking bastion's small arched door and the gap between bastion and gate wall, where the dusk sun shows over the karst.
- **Check:** subject (Buqu in the doorway) inside the 4:3 crop. The bottom 26 px are the wall's lower courses (indigo and pale-blue bricks, one jade line). Light L 0.418, C 0.308 (mid). The slide is now the gallery's one mid-toned slide.
- **Notes:**
  1. The frame is taken with the doors fully open. The closing leaves are drawn as flat Graphics rectangles, not mosaic, and would have broken the finish.
  2. In the build the gate's mask renders as a plain gold egg with two eyes. In `maskTex()` the last `ellipse(..., K.gold, MT.LINE)` fills over the painted face, so the Khan's face doesn't show. Because it reads as a flat sun-guarded block, the second pass keeps it out of frame.
  3. Only a few small gold tiles (wall lamps) remain, well above the bottom strip.
  4. The lantern strings and the gate's halls are outside this tight frame; the dusk reads from the indigo brick and the sun in the gap.

##### 06.png · the payoff
- **Caption:** Reach the Unpainted Edge and finish the picture (47)
- **Alt:** Past the Last Gate the world has faded to bare cream plaster. Buqu glides on with his eyes shut in bliss while a stream of indigo, turquoise, jade and gold tiles flies from him and settles into a patterned band on the blank ground, with little flowers sprouting from it and his vermilion trail running behind.
- **Shows:** the escape finale at `escapeT` 2.95, while the last tiles are being laid and just before he stamps his seal.
- **Made:** the same real run as 05 (seed 1), frame 6759. Zoom 3.0; Buqu's head is about 136 px across, with the tiles streaming from him down to the band below. The head and the finale tiles are drawn above the paper grade by the game itself, so they keep their colour. Vermilion survives the grade.
- **Check:** subject inside the 4:3 crop. The bottom 26 px are bare plaster. Light L 0.904, C 0.119 (light, not a quiet sheet).
- **Notes:**
  1. There is no visible sun here. The edge's sky set has a pale sun (alpha 0.4), but the paper grade washes it into the plaster, so this slide's one light is the bare even plaster.
  2. A few flying tiles pass in front of his chin; that is how the game lays them.
  3. The signing seal (t 3.2) was left out because the big chop reads like a badge.

#### Checks (sheets in `passwork/checks/gallery/`, all looked at)
- `gallery-100px.png` and `gallery-100px-x3.png` (each slide at 100 px wide): the six read as six different places and palettes: noon blue and gold, turquoise river, green pagoda, close-up of the Khan, indigo dusk wall, cream plaster.
  - Second pass: Buqu's head is now 97–141 px across on the 800 px masters (12–18% of the frame height), so it's a clear white disc even at 100 px wide.
  - Head sizes by slide: 01 97, 02 104, 03 118, 04 141, 05 127, 06 136.
- `gallery-4x3.png` and `gallery-4x3-phone.png` (central 1067×800 crop; at 360 px wide too): Buqu and the slide's subject are inside the crop on all six, and the sun is inside it on 01–05 (on 05 through the gap beside the bastion). On the phone crop (360 px wide) the head reads clearly on all six.
- `gallery-strip.png` (all six side by side): one finish throughout (same tesserae, grout and sky tiling) and one light per slide. Variety:
  - **Places:** parade, gorge, stair, parade, gate, edge.
  - **Scales:** after the second pass all six are close-to-mid; the place is carried by the background (karst and rainbow, river and pillars, pagoda tiers, the Khan's terrace, gate brick and arches, bare plaster).
  - **Characters:** the Khan with Buqu, Buqu with a ferryman, Buqu alone, the Khan with Buqu and the bearer, Buqu alone, Buqu alone.
  - **Weakest pairing:** 01 and 04 share the parade's noon sky and rainbow. They are kept apart in the order, and they differ in moment and framing (the throw with Buqu in the air, against the ceremony close-up).
- `gallery-bottom26.png`: the bottom 26 px are calm on all six (water, wall bricks, plaster, hills and balustrade). Gold and yellow appear there only as small tesserae: the gong's lower rim at the far left of 01, outside the 4:3; the hill crest lines at the corners of 03.
- `light.txt` (measure.py light): 01 0.814/0.294, 02 0.762/0.328, 03 0.767/0.34, 04 0.81/0.301, 05 0.418/0.308 (mid), 06 0.904/0.119. Five light and one mid, none loud.
- **Redone after checks:**
  - 04: the horror frame was swapped for the spit.
  - 01, 02 and 04: suns moved inside the 4:3.
  - 05: a frame where his face is upright.
  - 06: reframed.
  - 01: the throw changed from perfect to good, to drop the seal pops.
- **Second pass (coordinator's notes):**
  - Every slide but 04 is tighter, so the head is ≥ 9–10% of the frame height.
  - 01 moved to frame 150 so Buqu is just leaving the Khan's hand.
  - 05 is framed under the gold mask.
  - All checks were re-run on the new files.
- **Lettering:** none on any slide, so no minimum size applies.

#### Open questions for the lead / platform
- The Last Gate mask renders as a blank gold egg (the `maskTex` fill-order bug above). That is a game fix, outside this pass. Slide 05 now keeps it out of frame.
- If the platform overlays anything on gallery slides beyond the bottom 26 px, check slide 01's left edge (gong) and slide 04's lower centre (the Khan's yellow robe, which ends ~70 px above the bottom).

### Seals (DIRECTION §8, plus the event seal from §16) · agent: seals

All 27 files are 192×192 RGBA masters, drawn for 96 px display. Every seal is **drawn with the game's own mosaic code**: the game's `Draw`, its `MT` materials, its `tessellate` (cream grout `#f1ece2`) and its `K` palette. The shapes follow the game's own drawings, redrawn bold for 32 px (each one is named below). Script: `tools/pass/seals/p_seals.ts`, run with `node tools/pass/seals/render.mjs` (through `tools/pass/run.mjs`). Check sheets come from `python3 -I tools/pass/seals/sheets.py bug/seals passwork/checks/seals`. Nothing reuses an earlier picture, and nothing in `src/`, `dist/` or `bug/NOTES.md` was touched.

**Common to all seals**
- **Scale.** 32 × 32 world units at 6 px per unit, so 1 unit is 1 px when a seal is shown at 32 px. Grout is 2 px at the master (1 px at 96). The thinnest part that has to read at 32 px is 2 units or more; outlines and main strokes are 3–4 units.
- **Outside the outline is transparent** (my choice). The cream grout seam along the outer edge is the mosaic's own edge.
- **Outline by kind.** Each frame is laid as hand-cut voussoir tiles, and each tile takes one step of a single upper-left light.
  - **feat**: an eight-sided lattice window frame in turquoise. It is a square with chamfered corners, not a regular octagon, because a regular octagon was indistinguishable from the round ring at 32 px.
  - **collection**: a square chop with notched corners, in jade.
  - **event**: a round moon-gate ring in indigo.
- **Earned.** The world's lit glaze. Inside sits the zone's own brick-bond ground (its sky, lake or unpainted cream). The glyph is lit tile by tile from the upper left, and the light is read at the centre of each tile the tessellator will cut. There is at most one hot accent per seal, always crimson `#b3283d`/`#8f2236`, never vermilion. No gold anywhere.
- **Progress.** The same drawing re-glazed inside the art, before it is tessellated, so the grout stays cream:
  - every tile's glaze is mapped onto the Last Gate's dusk ramp (`#0d1338` → `#6a62aa`) by its own lightness, keeping 40 % of its hue;
  - the ground is the zone's dusk sky (gorge and eaves get the violet horizon, so their silhouettes hold);
  - Lantern Night's lantern goes unlit (no glow core, no halo).
  - This is not a veil on top.
- **Locked ("not yet").** No ground. A quiet stone-grey ring (`#8f857a`) and the glyph in two stone greys (`#867c71` / `#a69c8e`), with no light, no hue and no accent. Background parts of a glyph (the arch's dark opening, the blank tiles) drop out.
- **Colour guard (`colours.txt`).**
  - Every glaze covering 0.5 % or more of a seal measures at least 17 CIEDE2000 from ember, lilac, sun and mint; none is GUARDED.
  - The only readings under 20 are cream grout pixels tinted by turquoise or jade neighbours (17–19 to mint), the Last Gate's lit cream voussoirs (17–18 to sun, about 0.6 % each), and one rose lantern tile (19.6 to ember, 0.5 %).
  - **Deviation from the brief's readings.** The brief lists `#5ed3c7` (tq2) and `#4fc585` (jade2) as FREE, but `measure.py` rates them GUARDED to mint (8.6 / 11.1). Seals sit beside the platform's owned and earned states, so I used bluer turquoise (`#35a9b8 #1f9aa8 #0c6f7c`, `#56bccc` for details) and deeper jade (`#2c9c64 #1f8f5e #177c54 #0f5a3e`).
  - Dusk lights are capped below the platform's lilac (lavender dusk tones like `#a4abcf` are GUARDED to lilac).

**Checks** (in `passwork/checks/seals/`, all looked at):
- `strip32.png`: all nine seals at 32 px in three rows (earned, progress, locked), on night `#0B0910` on the left and linen `#F1ECE4` on the right. `strip32-x4.png` is the same pixels magnified 4×.
- `sheet96.png` and `sheet48.png`: the same layout at 96 and 48 px.
- `colours.txt`: the colour audit.
- Seal order in every sheet: valley, gorge, eaves, wind gate, mirror lake, last gate, unpainted edge, every hidden seal, lantern night.
- **Results at 32 px:**
  - The three kinds are distinct: chamfered square, notched square and round ring.
  - Every earned glyph reads on night and on linen.
  - Progress reads as the same seal at dusk: dimmer, and the glyph is still traceable.
  - Locked reads as a quiet grey "not yet" on both grounds. It is faint but present on linen.

---

##### valley-of-parting-clouds (feat)
- **Files:** `bug/seals/valley-of-parting-clouds-earned.png`, `-progress.png`, `-locked.png`
- **Glyph:** a cloud split in two. It is the game's auspicious cloud (layers.ts `cloud()`: white puffs on a pale glazed base, a turquoise curl at the end), cut straight down and drawn apart, one half drifting up-left and the other down-right, on the valley's noon sky.
- **How:** drawn in the game's code (PETAL tiles, brick sky `#2a86d2 #3a98da #56b0ec`). No accent.
- **Check:** reads at 32 as two white cloud halves with a gap. The curls carry the "auspicious cloud" from 48 px up.

##### jade-gorge (feat)
- **Files:** `bug/seals/jade-gorge-earned.png`, `-progress.png`, `-locked.png`
- **Glyph:** a V-shaped gorge between two jade karst cliffs (course tiles), with a turquoise stream leaving its foot. The left inner wall is in shade and the right inner wall is lit.
- **How:** drawn in the game's code (COURSE_S, lit per course tile, on the gorge sky). No accent.
- **Check:** at 32 the V of pale sky between two green masses reads. In progress the V glows violet.

##### stair-of-a-thousand-eaves (feat)
- **Files:** `bug/seals/stair-of-a-thousand-eaves-earned.png`, `-progress.png`, `-locked.png`
- **Glyph:** one curled pagoda eave. It is cut on the game's roof curve (blueprint.ts `roofTopY` and arch.ts `eaveBottom`, reimplemented with the same formulas). It is laid like `drawRoof()`: vertical tile rows in two indigo glazes, a dark eave edge with turquoise tile-ends, a turquoise ridge with curled ends, and painted brackets. Beneath it is the shadowed hall with two crimson pillars, and a crimson bell hangs at each upturned tip.
- **How:** drawn in the game's code. `drawRoof()` itself was tried first, but its 1-unit lines turned to grout at seal scale, and its gold bells, strip and ornaments would need recolouring anyway. Accent: crimson.
- **Check:** at 32 it reads as a curved temple roof on a hall, not a hat or boat.

##### the-wind-gate (feat)
- **Files:** `bug/seals/the-wind-gate-earned.png`, `-progress.png`, `-locked.png`
- **Glyph:** a gust curl through a gate arch. A ribbon of white tiles passes through a crimson round-topped gate (arch.ts `arch()` geometry, voussoir ring) and curls back over itself. Loose chips fly off its tail, as the game's WindLayer draws wind.
- **How:** drawn in the game's code. Accent: crimson.
- **Check:** the clearest of the set at 32.

##### mirror-lake (feat)
- **Files:** `bug/seals/mirror-lake-earned.png`, `-progress.png`, `-locked.png`
- **Glyph:** a lotus pad on a ripple, after `lotusTex`. It has a jade pad with a darker rim and a slit, a pink bloom (blossom and rose), and two bead rings of ripple on turquoise water.
- **How:** drawn in the game's code. No crimson; the soft pink bloom is the only warm colour.
- **Check:** at 32 a green pad with a pink bud inside a pale ring. It does not read as a pie or Pac-Man.

##### the-last-gate (feat)
- **Files:** `bug/seals/the-last-gate-earned.png`, `-progress.png`, `-locked.png`
- **Glyph:** two shut gate doors, the Last Gate's Doors (objects.ts). Crimson leaves with the right leaf in shade, an ink seam, and studs re-glazed cream and stone instead of gold, in a stone voussoir arch, on the gate's indigo-to-violet dusk.
- **How:** drawn in the game's code. Accent: crimson.
- **Check:** reads strongly at 32.

##### the-unpainted-edge (feat)
- **Files:** `bug/seals/the-unpainted-edge-earned.png`, `-progress.png`, `-locked.png`
- **Glyph:** a brush ending in a blank stroke. An upright dry brush (indigo handle, turquoise ferrule, white and stone hair) stands at the end of a stroke laid like the game's trail: two rows of tesserae, one every 2.6 units. The stroke starts crimson and runs out into blank porcelain tiles on the unpainted cream ground.
- **How:** drawn in the game's code. Accent: crimson. The brush is upright on purpose, so it doesn't read as the diagonal "edit" pencil.
- **Check:** at 32 the brush and the red head of the stroke read. The blank tail shows only from 48 px up, which is the point. Locked keeps the brush and the painted tiles only.

##### every-hidden-seal (collection)
- **Files:** `bug/seals/every-hidden-seal-earned.png`, `-progress.png`, `-locked.png`
- **Glyph:** Buqu's own chop. It uses `S.sealTex`'s geometry with seed 7, the chop he signs the finished picture with at the Unpainted Edge (game.ts), and its pattern comes from the game's own `hash2`. The chop is crimson, with the inner square in `#8f2236` and cream carved strokes widened to 2.2 units so they survive 32 px. It sits on cream paper inside the notched jade frame.
- **How:** drawn in the game's code. I did not call `sealTex` itself: its vermilion and its 1-unit carve don't suit a seal. Accent: crimson.
- **Check:** at 32 the notched square around a crimson chop is unmistakable, and distinct from both other kinds.

##### lantern-night (event)
- **Files:** `bug/seals/lantern-night-earned.png`, `-progress.png`, `-locked.png`
- **Glyph:** one paper lantern, after `lanternTex`. Rose paper in vertical gores and dark lacquer caps where the game uses gold, plus a short crimson tassel.
  - Earned: lit from inside (a glowing core) with a tile-stepped halo of lighter indigo bricks on the night sky.
  - Progress: the lantern hangs unlit.
- **How:** drawn in the game's code. Event-kind outline: the round indigo moon-gate ring. Accent: crimson tassel.
- **Check:** at 32 the round ring sets it apart from all eight moment seals, and the pink lantern reads.

---

**Open points for the lead and the platform**
- The game has no `game.json`. These slugs are the proposed moments from `bug/design.json` plus the proposed Lantern Night event. If `game.json` names the moments differently, rename the files (`<moment>-earned.png` …).
- The plan line in `bug/NOTES.md` says earned has "one vermilion accent". Per my task the accent is crimson `#b3283d` (vermilion is guarded next to the platform's states), so that line could be updated.
- Whether the mint guard applies near the owned state is "undecided" in `measure.py`. I kept seal glazes at 17 or more from mint regardless.

### store-pass · store tiles, pass tile, pass row grounds, pass marker, pass rewards, owned mark (pictures 9–14)

Agent: **store-pass**. Design only: nothing is declared, nothing goes into the game, no prices, no counts.

#### How everything here was made (applies to every entry)
- **Drawn in the game's own code**, from scratch: the game's mosaic surface and tessellator (`src/mosaic/draw.ts`, `tess.ts`, palette), its head geometry (`headTex`, through `tools/pass/head.ts`), its sprite geometry (`craneTex`, `lanternTex`, `sealTex`'s construction), its trail rule (`src/game/paint.ts`: a tile every step, split across, jittered, impact chips from `splat()`), its braid rule (`src/game/head.ts`: white tesserae, ribbon at the end), its terrain rules (`src/paint/terrain.ts`: walkway, parapet, brick-face courses, plinth, contour courses on the ridges), its architecture (`drawBox` from `src/paint/arch.ts` for the watchtowers) and its sky (the stepped brick sky, `lib.skyGround`, in each zone's own sky set). Nothing is cropped, traced or repainted from an earlier picture. No world render was needed (all pieces are small); no picture was made any other way.
- Entry: `tools/pass/store-pass/sp.ts`, run by `tools/pass/run.mjs` through `make.py` (draws each picture at 2× and downsamples; the markers at 4×). Lettering mask: `letter.py`. Owned-mark module: `laid_build.py`, `laid_check.mjs`. Checks: `checks.py`, `audit.py`.
- **Tile size and grout are set for each size**: store tiles and the owned mark 6 px per world unit at 400 (sky bricks about 31×16 px, face tiles about 9 px); the pass tile 4 px/unit (its towers need the room); rows and rewards 4.5 px/unit at 306×243 (tiles about 3–4 px at the 120 px the page shows); the markers 2.9 px/unit at 48 with a half-pixel grout, so a lantern is a dozen big tiles.
- **One light**, the same in every piece: high on the right (stepped in flat bands before the tiles are cut, as the poster's head is lit). No sun disc is drawn in these tiles: the game's sun colours are guarded beside prices, so the light is shown by the lit and shaded tiles only.
- **Colours**: free colours only for every area; Buqu's face and paint in the lead's mark tones (skin `#f4c8bc`, crimson `#b3283d`). The game's own colours that sit near the platform's (gold, yellow, vermilion, terracotta, its skin, ochre, tan, pale sky, and, after the coordinator's mint correction, turquoise `#27b6b0`, jade `#24a66c`, light jade, light turquoise) are moved to free neighbours before the tiles are cut (`GUARD` in `sp.ts`): greens are the deep jades and teals `#1f8f5e` `#1a8a5c` `#177c54` `#177f76` `#0e585a` `#12909a` `#0c6f7c`, with `#2f9468` only for thin lines; greens take the light in smaller steps so no lit tile climbs toward mint. The lantern paper is crimson `#a42438`/`#b3283d` with indigo caps `#1a2668` (no gold).
- **Colour audit** (`passwork/checks/store-pass/colour-audit.txt`, every pixel's ΔE2000 to ember, lilac, sun, mint): no ember- or sun-guarded pixel in any picture; no guarded block anywhere (largest guarded connected patch: lilac 127 px, about 16×13, on the fish kite's grout lines; mint 39 px on grout lines). The only near-mint pixels left are cream grout lines tinted by the green tiles beside them (on the jade row, 4–6 % of pixels, all thin lines); caution areas are small (largest: a 44×71 px web of grout lines round the jade tassel's small tiles vs mint; a single glazed cream paver 23×18 vs sun).

#### Store tiles (picture 9), 400×400, `bug/store/<id>.png`
Calm top corners on all four (plain sky or cream bricks); the bottom-right corner is kept plain too, for the owned mark.

- **`bug/store/jade-trail.png`** · Buqu's paint trail laid in jade and deep-turquoise tesserae, one bold arc over the Unpainted Edge's cream bricks, landing in a splash of chips. · Drawn in the game's code (the trail rule, three tesserae across each step; the edge sky set). · **40 px read:** one bold green arc of tiles on cream (black fill: a clean arc; greyscale: mid-grey arc on light). · Check: passed.
- **`bug/store/peony-pin.png`** · Buqu (glaring) with a pink peony pinned at the front of his white topknot, his braid behind, jade hills and noon sky. Worn, because the white bun under the flower is what makes it his. · Drawn in the game's code (head geometry in mark tones, lit in tile steps; peony in petal tiles; contour courses). · **40 px read:** a pink flower on a white bun, his eyes and moustache below (greyscale: the flower is the lightest spot on a mid sky). · Check: passed.
- **`bug/store/crane-companion.png`** · A red-crowned crane flying left over the noon sky and jade hills. Shown as itself. · Drawn in the game's code (the game's `craneTex` geometry, scaled, neck and head a little stouter so it reads; the crown moved from rose to crimson, black wingtips and tail plumes). · **40 px read:** a white bird, a black wingtip and tail, a crimson dot of crown (black fill: a long-necked bird). · Check: passed.
- **`bug/store/fish-kite.png`** · A paper carp kite (a windsock carp) flying in the Last Gate's dusk indigo, its line running down to the white end of Buqu's braid at lower left. Shown as itself (worn on the braid, the kite would be too small to read). · Drawn in the game's code (carp in flow tiles; the braid rule for the braid end; dusk sky set). · **40 px read:** a striped turquoise fish with a crimson tail on a line (greyscale: porcelain stripes on dark). The body is the deep turquoise `#12909a` (the light turquoise of the plan sits on mint). · Check: passed.
- Checks: `passwork/checks/store-pass/store-40.png` (each at 40 px, 1× and 4×; the item as a black fill on its ground and on white; greyscale; 169 px), `store-row-169.png` (the store row with the pass tile first).

#### Owned mark "Laid" (picture 14)
- **`bug/reward/laid.js`** (+ `bug/reward/README.md`, the API) · A tiny Canvas 2D module: the last tessera falls in, turning, and is pressed into a cream grout bed at the tile's bottom-right corner, a few grout chips squeezing out; it plays once in 720 ms, starts at once, and ends on the held frame. `play(canvas)`, `held(canvas)`, `drawAt(canvas, t)`, `DURATION`, `BOX`; honours reduced motion. · Its two pictures are drawn in the game's code (`laidSocket`, `laidTile` in `sp.ts`) and embedded; the motion is plain Canvas 2D. · Check: one real `play()` resolved after 716–722 ms in Chromium; frames at 0…720 ms in `owned-mark.png`.
- **`bug/reward-held.png`** · The held frame: a crimson glazed tessera (bevel lit high right, a glint of glaze) seated in a cream grout bed with a stone rim, bottom right, as a 400×400 transparent overlay for the 400 px tile master (scale it with the tile; the page shows 169 px). Rendered by the module's own `held()`, so the animation ends exactly on it. · **40 px read:** an 8 px crimson square with a cream rim in the bottom-right corner, clear on all four tiles, on night and on linen (`owned-mark.png`). No gold, no glow. · Check: passed.

#### Pass tile (picture 10)
- **`bug/pass/tile.png`** · "THE LONG / WALL" lettered over a noon sky, above one span of the Great Wall (walkway, crenellated parapet, brick face, arrow slits, plinth) between two stone watchtowers, on jade hills: the pass's step unit, a span, is the picture. · Drawn in the game's code (terrain rules with the Jade Gorge's stone palette; the towers are the game's `drawBox` stone boxes with crenels, arched door and window). The name is Fraunces 800 caps (opsz 42, as the game's title h1), rasterised by PIL into a mask, then laid as ink pieces cut whole (opus sectile) in a cream grout bed among the sky bricks. · Check (`pass-tile-sizes.png`): at 169 px the name reads clearly (caps 16 px), at 120 px it reads (caps 11.6 px), at 80 px it is just legible, at 40 px it is texture and the wall and towers carry the tile. No price or count; no guarded fills.
- **Lettering minimum size:** cap height is 9.6 % of the tile width (38.5 px on the 400 master). Caps reach 12 px at a **125 px tile**; that is the smallest size at which the name counts as lettering. Below that it is decoration and the picture still reads.

#### Pass row grounds (picture 11), 306×243
- **`bug/pass/ground-free.png`** · Cream paper grout: the Unpainted Edge's bare cream, big quiet pavers in four close creams. · Drawn in the game's code (big tiles, edge sky set colours). · Check: lightest of the three.
- **`bug/pass/ground-pass.png`** · Jade hill courses: three rolling hills in broad contour courses (deep jades and teal), thin lighter lines between bands. · Drawn in the game's code (terrain contour-course rule, wide bands so it stays calm under the rewards). · Check: the middle value; the platform's mint outline and check still stand out on it.
- **`bug/pass/ground-bug.png`** · The Last Gate's dusk indigo: the gate sky set's top steps in brick bond. · Drawn in the game's code (stepped brick sky). · Check: darkest; the platform's sun outline reads strongly on it.
- Check: `rail-mock.png` (a mock only: three rows, spans 1–2 owned in mint, span 3 the lilac "your step", the sun outline round the bug.pass row, the marker in both poses). The three rows differ clearly (light / mid / dark, cream / green / indigo). No lettering, no guarded fills.

#### Pass marker (picture 12), 48×48 with transparency
- **`bug/marker-next.png`** · A crimson paper lantern with indigo caps, swinging on its cord (tilted, cord from the top edge, tassel hanging). Rides over the next span. · Drawn for 48 in the game's code (the game's `lanternTex` geometry, a little rounder, two paper ribs added, gold caps and rose paper moved to indigo and crimson; drawn at 4× with big tiles). · Check (`markers.png`, `rail-mock.png`): reads at 1× on cream, jade, indigo and night; the grout rim keeps it off any ground.
- **`bug/marker-held.png`** · The same lantern set down upright, lit: its paper glows rose from within (a small pink core, no halo), the cord looped on top, the tassel laid down beside it. Sits on the last earned span. · Same making. · Check: passed; nothing that counts or holds a number. Kept out of ember (the paper is deep crimson; only edge pixels mixed with grout are within caution, ΔE 12–20).

#### Pass rewards (picture 13), 306×243, the item centred in the middle 243 square, each on its row's ground
Full art at rest; the tier is shown only by the ground (the grounds above, drawn the same way); nothing dimmed, no counts, no prices, no crumbs. All read at 120 px (`rewards-120.png`).
- **`bug/pass/plum-trail.png`** (free) · A trail of plum blossoms and loose petals, blossom-pink and rose with crimson hearts, arcing over cream. · The trail rule with petals in place of bars. · 120 px: a pink arc of flowers.
- **`bug/pass/jade-tassel.png`** (free) · The end of his white braid with its ribbon, a jade bead and a jade-and-teal tassel hanging below. · Braid rule + bead and strands. · 120 px: a green bead and tassel on a white braid.
- **`bug/pass/lotus-chop.png`** (free) · Buqu's square chop, in crimson `#b3283d` with a carved cream frame (`sealTex`'s square block of small tiles), whose carved mark is a lotus: five rounded overlapping petals (no points), the seed pod at its heart and a pad beneath, cut in cream out of the crimson. · `sealTex`'s construction with a lotus carved in place of its strokes. · 120 px: a red square seal with a white lotus on cream (redone at the coordinator's request: the first version, a pointed lotus outline, read as a leaf or a crown). · Colour audit: no guarded pixel; caution only on the crimson's grout edges (ember, largest 10×10 px).
- **`bug/pass/magpie-companion.png`** (pass) · A magpie flying right: black with a white belly, shoulder and wing patch, a blue sheen on wing and long tail. · Built the way the game builds its crane (one raised wing, flow tiles). · 120 px: a black-and-white bird with a long tail.
- **`bug/pass/cloud-ribbon.png`** (pass) · A sky-blue ribbon bow tied round his white braid, its tails ending in porcelain cloud scrolls. · Braid rule + cloth tiles. · 120 px: a blue bow on a white braid with two little clouds.
- **`bug/pass/indigo-trail.png`** (pass) · The paint trail laid in deep indigo glaze, with its landing chips. · The trail rule. · 120 px: an indigo arc of tiles on jade.
- **`bug/pass/lantern-pin.png`** (pass) · Buqu (smug) with a lacquer pin through his topknot, a small crimson paper lantern hanging from it behind his head. · Head geometry in mark tones + the lantern above. · 120 px: his head with a red lantern at his topknot.
- **`bug/pass/moon-pin.png`** (bug.pass member reward) · A porcelain crescent moon on a crimson lacquer hairpin with a turquoise bead and tassel, on the Last Gate's dusk indigo. · Petal tiles, the dusk sky. · 120 px: a pale crescent crossed by a red pin.

#### Open questions for the platform
1. `reward-held.png` is a 400×400 overlay matching the 400 px tile master (shown at 169). If the platform wants it at exactly 169×169, it is a straight downscale; say so and we will ship that size too.
2. Mint (owned) and the jade row: we kept every jade area off mint (deep jades only), but cream grout lines between green tiles read slightly green (thin lines, within ΔE 12 of mint in places). If the owned check is ever drawn as a thin mint line on the pass row, tell us and we will warm that row's grout.
3. The pass tile's name is legible from a 125 px tile (12 px caps). If the store row ever shows the pass tile below that, the name becomes texture.

#### Could not make
Nothing left out. No sun disc is drawn in the store and pass pieces (the game's sun colours are guarded beside prices); the light is carried by the lit tiles instead.

### update-event · notes (agent: update-event)

Scripts: `/home/claude/buqu/tools/pass/update-event/`
- `capture.mjs` catches a real moment in the game's own play and renders it with the game's renderer (configs: `v5.json`, `lantern-night-banner.json`).
- `probe.mjs` searches autopilot play for fizzles. `stage.mjs` tests staged starts.
- `night.js` is the Lantern Night dressing. `checks.py` makes the check sheets. `p_tex.ts` exports sprite textures so they can be inspected.

Sessions start from the same state every time: the page's animation frames are blocked, so the game's own ticker never runs before the seeded play. A given seed at a given aspect always gives the same moment.

Tiles: the game paints its tiles at a resolution fixed by the first screen size. For the zoomed cameras, `capture.mjs` re-runs `view.setupLayers` with the base scaled by the zoom. The tiles stay the same size in world units and only get finer pixels, the way `__buquMaxQ` works.

Nothing in `src/`, `dist/`, `bug/NOTES.md` or `bug/design.json` was touched. The event seal belongs to the seals agent.

---

#### bug/updates/v5.png (1600×800) and bug/updates/v5-thumb.png (308×154)

- **Shows:** a close-up in the Wind Gate. An Imperial Fireworks rack has launched Buqu, and the rocket drives him up into the underside of a floating stretch of wall, where it fizzles out. The fizzle is the game's small gold burst: `fireworkBurst(x, y, gold3, 10)` plus its ring. His vermilion paint trail marks the rocket's straight climb. He is dizzy. The subject sits inside the central 4:3.
- **The one change (in the build):** `src/game/game.ts` collide(), lines 598–602: "a rocket driven into masonry fizzles out instead of grinding against it". I confirmed this code is in `dist/test.html`.
- **How it was made:** rendered from the game. Everything in the frame is the game's own play, drawn by its renderer: the rack, the rocket, the collision, the burst and ring, the sparks, the paint trail, the braid and the head expression.
  - **Staged start (said plainly):** the head was placed in flight at world (22560, 305), moving 1100 u/s to the right, about 0.1 s before the Wind Gate rack at x 22700. From there the game ran 65 frames on its own until the fizzle at (23385, −659). The frame is 4 frames after that, during the impact hit-stop.
  - **Camera (redo after the coordinator's note):** a true close-up at zoom 6, up from 4.5, with tiles painted for that zoom (14.8 px per unit) and sprites at quality 3. Buqu's head is about a third of the frame height (its ink ring fills roughly 49–82% of the height). The wall's brick face fills the top third. The frame is 4 frames after the fizzle, during the impact hit-stop, so the head is still at the contact point.
    - I tried zoom 7 (the 1.6× asked for). The head filled about half the frame and the brick band shrank, so I took zoom 6 to keep the head at a third.
  - **Hidden or turned off:** the foreground parallax layer (it crossed the head), the best-throw ghost, the hit flash and the post vignette.
  - **Sun:** the Wind Gate's sun is moved out of frame. The guarded disc is gone; the light stays the zone's flat daylight.
- **Why staged:** I probed about 7 game-hours of autopilot play (deterministic sessions, several upgrade sets and skills).
  - Natural fizzles are common, but nearly all happen in two passages: the parade beacon's tunnel (x ≈ 1582) and the pagoda's ground-floor passage (x ≈ 14490).
  - This exact fizzle against the floating wall happened naturally once, at (23393, −658), in an early session that couldn't be reproduced. It needs a head moving faster than about 1050 u/s at the rack. In 16 later rack hits there, autopilot heads arrived slower.
  - I rendered seven natural beacon candidates. At 104×52 the head and burst are lost against the tan bricks and festival clutter, and the head is squashed sideways, so they don't read as a rocket.
- **Check** (sheet: `passwork/checks/update-event/update-check.png`):
  - At 104×52 (1×, ×4 nearest, greyscale, on dark and on light): a top band of tan wall bricks, under it the head as a disc with its dark ink ring and gold burst ring, and the red rocket trail climbing into it from the lower left. The dizzy face shows only as two teal marks at that size.
  - The thumbnail at 1× reads: bricks, face, burst and trail.
  - **Light band:** L 0.924, C 0.111, **light**. This is unchanged by the re-frame: the Wind Gate's own glazes (the pale aerial-blue wall, sky and cloud sea) are pale, and I didn't regrade the game's colours.
  - **Colours:** no sun disc in frame. The burst sparks are gold3 #f1c95e (sun-guarded) and the trail is vermilion (ember-guarded), both the game's own and only as tesserae under 24 px. There are no flat blocks.
- **Couldn't make:**
  - The floating fragment's collision underside sits about 5–8 world units below its painted bricks: its base is a cloud-wrapped band the game draws under the masonry. The game centres its fizzle burst on Buqu's head, so the burst sits at the bottom of that band, about 90 px below the last brick course at 1600 wide, not on the bricks themselves. Moving it would be faking the effect.
  - The rocket's own spark trail (1-unit specks) barely shows at this zoom. The paint trail carries the rocket's path.
- **Alt text:** "Buqu's head, shot up by a festival firework, smacks into the underside of a floating stretch of wall; the rocket fizzles out in a small ring of gold sparks, his red paint trail climbing behind him."

---

#### bug/events/lantern-night-banner.png (1720×600)

- **Shows:** the Last Gate on Lantern Night. Two tiers of paper-lantern strings glow under an indigo night sky with a small moon, and Buqu tumbles through them, howling, just after striking a lantern. The left 45% is dark night over the darkened first fort and crags.
- **How it was made:** rendered from the game. The moment is real play: an autopilot session (seed 51, strong head) caught the head striking a lantern on the Last Gate's first real string at x 35412 (`objects.ts` `Lanterns.hit`), frame 23267. The picture is one frame later. Camera zoom 3, tiles painted for that zoom.
- **Event dressing:** this is a proposal (the game has no events). It is made with the game's own renderer, objects and palette:
  1. **Night sky:** the game has no night set. I patched the post shader's sky uniforms (wrapping `view.updateSky`) with the game's indigo glazes from top to horizon: #1a2668, #1d2a70, #233a8e, #2f50b4, #3a4aa0. The zone's sun disc, laid in the same tile rings, is re-coloured cream #f6efdf as a moon. The sky grout is the game's cream grout under the same night tint.
  2. **Night light:** multiply tints on each plane.
     - Parallax layers: #2c3880, #36428c, #424e98, #4e5aa4 (far to near).
     - World #5c64aa, foreground #3c4890, head #f2dccf, paint #e8d4d0.
     - The lanterns keep their own glaze.
  3. **One extra lantern string**, using the game's own dusk-lit `Lanterns` object, hung above the Gate's real strings. The game hangs three strings between the forts here; the frame shows two tiers.
  4. **Lantern halos:** the game's soft additive dusk glow (a radial-gradient sprite) would read as airbrush. I re-laid it as rings of small tiles, built the way the post shader builds its sun: concentric rings cut into segments with grout seams, outer rings broken. The colours step from peach to coral to rose to dusk violet, all game glazes. The blend is normal.
  5. **Plain left 45%:** on the real string, lanterns left of world x 35325 (the 45% line) are hidden. The paint trail is masked and sparks are hidden left of that line. Coins (pickups) are hidden. The vignette is off.
- **No title lockup, no counter, no lettering.**
- **Check** (sheet: `passwork/checks/update-event/banner-check.png`):
  - **Left 45% covered:** the right 55% tells it alone (lantern tiers, moon, Buqu among them).
  - **Right 55% beside a mock copy block** (mock only, in the sheet): it sits cleanly. It still reads at 430×150 and 286×100; Buqu gets small there.
  - **Left 45%:** mean L 0.225, hot-pixel share 0 (no ember or vermilion). It holds only the darkened fort, crags and a thin string line.
  - **Light band:** L 0.243, C 0.372, **mid** (left 0.225, right 0.259). Clearly different from the coral poster (L 0.595, light).
  - **Right-side colours:** the main colours are free. Caution only for the head's peach #f0c8b1 (sun ΔE 19) and the halos' coral ring #ce8487 (ember ΔE 18). Both are at least about 106 px right of the 45% line, and lilac stays at ΔE ≥ 20.
- **Couldn't make:**
  - A real night sky set doesn't exist in the game; it was built as above.
  - Buqu is upside down. He spins in flight, and in every lantern-strike moment I checked (four sessions) he was tumbling. The rotation is the game's.
  - The fort in the left 45% is darkened but not blank. If the platform needs a flat plate behind the copy, it should add its own.
- **Alt text:** "Night at the Last Gate: strings of glowing paper lanterns hang across an indigo sky under a small moon, and Buqu's head tumbles through them, howling."

---

#### Open questions for the platform
- **Where does Join sit inside the banner's left 45%?** The left side is dark everywhere, but the darkened fort is in its outer fifth.
- **v5 is a light picture** (L 0.92). If updates appear in a row next to light posters, the lead may want it judged on the wall.

### Round 3 · backdrop, share card, phone poster, title lettering (agent: round3)

All four were made fresh for this pass. Nothing reuses the poster images: every world was re-rendered with the game's renderer, and every head was redrawn with the game's head code. Tools are in `tools/pass/round3/`: `bd.sh` (world render), `build.py` (share card and 9:16), `compose_r3.py` (a copy of `compose_poster.py` with options), `r3.ts` (`p_poster.ts` head() unchanged, plus `lockup()`), `run.mjs` (a copy of the runner that reads jobs from a file), `lockup_mask.py`, `lockup_job.py`, `render_backdrops.sh`, and the checks `guard.py`, `mock_page.py`, `checks.py`. Working files are in `passwork/round3/` and check sheets in `passwork/checks/round3/`.

How the colour checks were done: `guard.py` measures the CIEDE2000 distance to ember, lilac, sun and mint for every pixel, using the formula in `measure.py`. It reports the guarded share (< 12) and the densest guarded 24×24 window. A window at 100% would be a flat button-like block.

---

##### bug/backdrop.png · 1440×577
- **Shows:** the Last Gate at dusk, at rest. The gatehouse stands between two forts among indigo crags, with the low sun behind it. The wall walk and the moat run along the bottom as the floor.
- **How:** rendered by the game (`look.mjs` via `bd.sh`). Camera (36400, −60), zoom 0.52, rendered at 1440×577 dpr 2 and Lanczos-scaled to size. Hidden: Buqu, all live objects (banners, lanterns, crowds, guards, flagpoles), the paint, fx and the foreground framing. The sun was moved to (0.415, 0.43) with r 0.065·sh, and the sky's horizon band to 1.1·sh, with the patched `v.updateSky` as in the poster. The coral band therefore sits low, and the right third shows indigo and violet. The warm gatehouse and the sun sit inside the hero slot, so outside the poster nothing competes with it. The wall walk at y ≈ 491 runs under the hero as the floor.
- **Check** (`checks/round3/backdrop-desktop.png`, `backdrop-guard.png`):
  - I put the poster in a mock hero slot (853×427, a 6 px ink seam, at x 80 / y 64), with rail placeholders and an ember Play bar. The poster leads: warm and big against a cool indigo page.
  - Light band: L .459, C .299, **mid**. The poster is light (.595), so the hero stands off it.
  - Info rail (x 939–1440): 6.0% guarded pixels, almost all lilac at dE 10–12. These are grout seams in the violet sky band and pale crag glazes, i.e. the game's own sky and crags, left unchanged. Ember 0.11%, mint 0.13%. Densest window 35%, so no block. The Play row (y 140–230) peaks at a 22% window, with ember 0.
- **Couldn't:** the mock page layout is my assumption (48 px nav, hero at y 64), not the real game page.

##### bug/backdrop-phone.png · 390×826
- **Shows:** the Last Gate's wall seen close. The far crags and gate towers sit under a low dusk sun in the hero zone, and the parapet runs just under the 4:3 hero. Below it, the wall's indigo brick face with moss clumps and string courses runs down to a hard bottom edge.
- **How:** rendered by the game, composed separately (its own camera, not a crop): (36700, 153.2), zoom 2.6, 390×826 at dpr 2, then Lanczos. Same hiding and sun patch as the desktop: sun (0.55, 0.22), r 0.035·sh.
- **Check** (`checks/round3/backdrop-phone.png`):
  - Poster cropped 4:3 around publish.json's focus and placed over it: the poster leads.
  - Light band: L .416, C .312, **mid**.
  - Play row: guarded 4.8% (lilac grout seams), densest window 19%, ember 0.
  - Info area: guarded 6.7%. That is lilac 4.3% plus **mint 2.5%**: the wall's pale string courses (`#9fc4b4`, mint dE 11.6), lines 1–3 px wide, densest window 27%. They are the game's own wall colour and I left them unchanged.

##### bug/share-card.png · 1200×630
- **Shows:** the poster's register, Buqu howling across the low dusk sun at the Last Gate. His face is at 0.755 of the width, his braid streams back up-left and his vermilion paint trail curls in from the lower left. The title lockup sits on the plain dusk sky in the left 45%, and the crags sit low along the bottom.
- **How:**
  - World: rendered by the game. Camera (37300, −760), zoom 0.55, rendered 2400×1576 and the top 1260 kept. Sun patched to (0.842, 0.56H) with r 0.165H; horizon band 1.05H.
  - Head: drawn by `p_poster.ts` head() with the howl expression, lit toward the sun in tile steps and tessellated by the game's code.
  - Trail: laid by the compose rules (the paint.ts spacing, 3 tesserae across).
  - Lockup: `r3.ts lockup()` at the card's own scale (FLOW rows about 5 px), lit toward the card's sun.
  - Composed at 2400×1260, then Lanczos to 1200×630.
- **Check** (`checks/round3/share-card.png`):
  - At 270 wide beside the poster at 270: the same image, head, sun and dusk register.
  - Lettering at 270: 不屈 is about 40 px tall, and the English caps are about **10 px**. The caps reach 12 px from about 320 px wide.
  - Light band: L .584, C .303, light.
  - No player names. No ember `#FF5A36` anywhere.
  - **Guarded, said plainly:** the game's own vermilion is guarded against ember. That covers the paint trail, the frill and the lit tiles of 不屈 (`#e2412b`, dE 8.3); 不屈's base `#cc3522` is caution (14.1). It appears only as tesserae in the art and never in the bottom band. The coral sky (`#ec8e78`, dE 12.0) dips into guarded with its glaze, exactly as on the poster.
  - The densest guarded window is 93%, at (730, 443) in the paint trail: several tesserae with grout between them. The poster itself reaches 100%.
  - Bottom band (y 566–630): crag tops, a cloud hem and sky only, with mint 0. With a 64 px linen bar mocked over it, nothing is lost.

##### bug/poster-9x16.png · 1080×1920
- **Shows:** the same one image, Buqu howling across the low dusk sun. The braid streams up-left out of frame and the trail enters from the lower left. The crags and the cloud-hemmed wall sit at the bottom.
- **How:** recomposed, not cropped.
  - World: rendered by the game at 1080×3100. Camera (35500, −470), zoom 0.5, sun (0.76, 0.546H) with r 0.112H. The top 1920 were kept, the way the 2:3 kept 1800 of 2800.
  - Head: redrawn at this size by head(), with R = 330 px (the 2:3 uses 350 at 1800 high).
  - Composed by `compose_r3.py` with the poster's rules.
  - I chose camera x 35500 so that the gatehouse landmark stays out of frame and adds no second focal point.
- **Check** (`checks/round3/poster-9x16.png`, beside the 2:1 and 2:3): the same one image, head, sun and register.
  - Light band: L .536, C .275, light (the 2:1 is .595).
  - The densest guarded window is 100%, in the braid's lavender tiles near the topknot (lilac-near), the same as the lead's braid. A 9:16 has no platform controls on it.

##### bug/title-lockup.png · 1600×1158, transparent
- **Shows:** 不屈 in Ma Shan Zheng, above BUQU WILL / NOT BOW in Fraunces (opsz 30, wght 800, caps, tracking 0.16 em), laid in glazed tesserae with cream grout and one light from the upper right.
- **Why two lines:** the stack breaks the way the title screen's h1 (text-wrap: balance) breaks on a narrow screen, "Buqu Will / Not Bow". It also nearly halves the smallest readable width. I made a one-line version too, but it needs 253 px wide for 12 px caps, so I set it aside (`passwork/round3/lk_test2_1600.png`).
- **How:**
  - Letter shapes: rasterised from the game's own fonts with Pillow (`lockup_mask.py`). **This step is not the game's code.**
  - Fill: the shapes fill a game `Draw` with the game's glazes. 不屈 uses the title screen's `--ver` `#cc3522` as base, `#e2412b` (K.ver) where lit and `#b92d1d` (K.ver2) in shade. The letters use hair `#f7f4ee`, `#fbfaf5` lit and `#d9d6de` in shade. Both use the FLOW material.
  - Light: lit and shaded in tile steps from one light at −25°.
  - Tessellation: cut by the game's tessellator with grout `#f1ece2`.
- **Lettering minimum size:**
  - **Smallest readable width: 134 px** (caps 12 px, 不屈 about 48 px tall).
  - **Recommended minimum: 201 px** (caps 18 px). This matches the "never below about 200 px" plate rule.
- **Check** (`checks/round3/title-lockup.png`): viewed at 134 and 201 px on dusk indigo, night and violet, with 134 px also at 4× hard pixels. It reads on all three.
  - **On linen the white letters vanish.** The lockup needs a ground darker than the hair glaze; never put it on linen or cream.
  - 不屈 in vermilion is **guarded** (ember: lit tiles dE 8.3, base caution 14.1). It is fine on the share card's art, but keep it away from Play, prices and selected states.
  - Never on the For You poster.

##### Hex readings taken this round
| Hex | Role | Reading |
|---|---|---|
| `#cc3522` | 不屈 base | caution, ember 14.1 |
| `#e2412b` | lit vermilion | GUARDED, ember 8.3 |
| `#b92d1d` | shade vermilion | caution, ember 19.2 |
| `#f7f4ee`, `#fbfaf5` | letter glazes | free |
| `#d9d6de` | letter shade | caution, lilac 19.5 |
| `#9fc4b4` | phone wall string course | GUARDED, mint 11.6 |
| `#afbad5`, `#9dacd1`, `#92a2ca` | pale crag glazes, desktop rail | GUARDED, lilac 9.9–11.4 |
| `#b0b2cc`, `#aaacc6` | violet-band grout seams | GUARDED, lilac 11.4–11.9 |

##### Open questions for the platform
- Does the platform darken the backdrop behind the rail text and the phone info? The phone info sits on the wall's brick face.
- Where do the hero and the rail start vertically? My mocks assume a 48 px nav and the hero at y 64.
- Does the share card get shown below about 320 px wide? Below that, the English line falls under 12 px caps.

### Living poster (DIRECTION 17) · notes from the living-poster agent

#### bug/living-poster/buqu.js (+ README.md)

- **What it shows:** the poster alive: Buqu's head howling across the Last Gate sunset (gate sky set, the gate sun's ring of tile rays behind-right of his face, crags with the distant wall and the mist belt below, his vermilion trail from the left, the white braid with its jade ribbon). Hover: a bigger howl, then he is flung on and the camera whips into real play on the Last Gate wall walk (skims and bounces, paint chips, trail tiles, lantern strings, a net guard bonked on the hat, a gold-rimmed seal popping, coins on a spinning big arc, a stamped seal), 6 s seamless loop, back to the held pose. Squeezed: face flattened on the plate's edge, glaring at the neighbour, then shoving back. Throwable: `braidTile` (his braid's end tile, flung from a braid sling on `cue`).
- **How it was made:** a Canvas 2D port of the game's drawing code, **not the game's renderer**. Ported by hand from `src/art2/msprites.ts` (headTex expressions, netguard figure, lantern, coin, seal), `src/game/head.ts` (braid), `src/game/paint.ts` (trail, chips, dissolve rules), `src/render/post.ts` + `src/render/view.ts` SKIES.gate (brick sky, ring sun and rays, composite grade), `src/paint/layers.ts` (crag peaks, contour courses, strata, distant wall, mist belt), `src/paint/terrain.ts` (Great Wall in the gate palette), and the poster's own rules from `tools/pass/compose_poster.py` / `tools/pass/p_poster.ts` (layouts, trail ribbon, head light). Tile cutting is the port's own (Voronoi and flow rows computed in `create()`), so tile shapes are close to, not identical with, the game's tessellator. Nothing from earlier pictures was used; the poster was only looked at for comparison.
- **Agent:** living-poster.
- **Check results:**
  - Harness (`creator-pack/living-poster/harness.py` + `tools/shot.mjs`), seq 500/1500/3000/4500/7000/10000 ms and `rm`: **errors []** every run. All six plates looked at (live hover, auto cycle, tall with `near`, squeezed with rants, cue + hits, 120×90↔400×370 resize). Shots: `passwork/checks/living-poster/HarnessBuquLiving-poster-1440-*.png`.
  - Held frame vs poster at 2:1, 2:3, 1:1: `held-vs-poster.png`; same composition, palette and finish. Light band (measure.py): poster 2:1 L 0.595 C 0.305 vs held 0.604/0.338; 2:3 0.566/0.274 vs 0.587/0.320; 1:1 0.587/0.284 vs 0.621/0.314; loop 0.549/0.284. All "light"; no band change between modes.
  - Sizes: `sizes-held.png` (900×640, 740×370, 577×163 strip, 260×367, 140×305 column, 150×177, 120×90, 90×70, 600×400 at dpr 2): recomposed, never stretched, no bars, face anchored.
  - Motion sheets: `motion-idle.png` (14 s cycle: holds 3.2 s and 3.1 s, lives 4.2 s and 3.5 s), `motion-play.png` (react → enter → full loop → settle), `motion-squeeze.png`, `motion-events.png` (cue throw at 0.8 s, hit, look, shake), `motion-near.png`.
  - Frame time (headless Chromium, software GL, shared 2-core machine, 600×400 dpr 1, wall clock incl. raster): idle ≈ 1.3–1.5 ms, loop ≈ 1.1–1.5 ms, squeezed ≈ 1.6–1.9 ms at low load; 2–4 ms when other agents' renders were running; ≈ 2.7–3.4 ms on frames where the plate resizes every frame; first frame of a plate ≈ 110–150 ms (one-off cutting). Runs: `timing-runs.txt`; tools in `tools/pass/living/` (`timing.mjs`, `spikes.mjs`, `still.mjs`, `strip.mjs`, `make_checks.sh`).
  - Colours: free or the poster's own. Corrected for the mint reading: the turquoise hill uses `#27b6b0`/`#12909a` (no `#9ee8dc`, `#5ed3c7` only mixed), the wall's ridge seams use pale stone `#c6dbe0` instead of `#8fdca6`, moss and shrubs use `#177c54`/`#0e585a`/`#177f76`. Vermilion and gold appear only as small tesserae (trail, chips, seal, coins) away from flat blocks; the module's `ink` is the mark crimson `#b3283d`. No text, numbers, prices or Play in the art; the loop shows no HUD numbers.
- **Couldn't make / open points:**
  - The loop is drawn with the port, not captured from the running game (the contract asks for a code module; the game's renderer is WebGL/Pixi and can't run inside a plate).
  - Static layers rely on `OffscreenCanvas` (all evergreen browsers). Without it the module still draws correctly but at ~15 ms a frame (coarser tiles, everything direct). Question for the platform: is OffscreenCanvas fine inside board modules? (The pack's example module uses it the same way.)
  - Frame times above are software-GL numbers on a loaded machine; I couldn't time on a laptop GPU here. While a plate is resizing every frame, cost is ~2.7–3.4 ms here (strips drawn scaled until the size settles).
  - The first frame of each plate pays ~110–150 ms to cut its strips (the head's tiles are cut once and shared by all plates).
  - The module stores its shared tile cut on itself as a non-enumerable `BUG_MODS.buqu._shared` (no window globals); harmless if the engine forbids it (falls back to a per-plate cut).
