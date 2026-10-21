# Caracolina · bug.games design pass B

## Style note (step 0, the lead)

- **The game in one sentence.** You walk a town wound round a hill above the sea and photograph what its people wish to see, so that Aurora, a painter losing her sight, can paint the town before the Festival of the Shell.
- **Medium and line.** The game's own WebGL renderer paints the 3D town as gouache: opaque colour in two or three hard-edged values, with coloured-pencil contours on silhouettes, pencil hatching in shade and paper grain over everything. What is not yet painted is graphite on paper. The residents are paper cut-outs painted on both sides by the game's Canvas 2D code (`people_paint.js`), each with one big eye.
- **Main colours.** Cobalt `#2a55b8` (the game's own ink: its lettering and doors), night sea `#152760`, sunset peach `#fabe8f`, and the lighthouse's dark iron `#1e2a3a`. The signature coral `#e8653a` and the sun's cream `#fee7aa` sit next to ember and sun, so they appear only as light, never as a fill near controls.
- **Light.** One low sun in the west over the sea (the game's evening, about 19:45). On night pieces: the festival's lamps and fireworks, or the lighthouse lamp. The light always comes from something you can see.
- **Characters and things.**
  - Aurora the painter; Remei and her sheets that fly at six; Lluna, who dives from the stone head; Tomàs and his lighthouse on legs; Pere and Mercè; Tinta the cat.
  - Strange architecture: eggs on roofs, a rock that thinks it is a cloud, a broken face in a garden of eyes.

Every picture follows this note.

## Ground rules I applied

- **Start from scratch.** Nothing made before this pass is used: not the cover, the earlier posters, the stage-1 pilots or their renders, the trailer and TikTok frames, or the poster artifact. Every picture is a new render from the game's renderer, or new drawing in the game's own code and palette. Tools (my render script, the colour-guard script) were reused as code only.
- **No `game.json` exists.** Caracolina is not on bug.games yet: it runs as a claude.ai artifact and is not wired to the bug.games SDK.
  - The seals therefore follow the game's own moments: the residents' wishes in `src/story.js` (`WISHES`) and the mural in `src/game.js`.
  - Each seal's file name is the name the moment would get if it were declared. Nothing was declared; `game.json` was not created or changed.
- **Fonts.** The game draws its lettering in Caprasimo, Kalam and Alegreya Sans, loaded from Google Fonts in the browser. This sandbox cannot load them, and I did not route around that.
  - Title lettering was made by the game's own lettering code in a real browser (see title-lockup), or it is marked as not made.

## Plan (step 1, the lead)

**Poster (1–2).** Silhouette register: the lighthouse on legs straddling the setting sun, alone in the bay. Five words: "a lighthouse standing over the sun". Inks: sunset peach, night-sea blue, the lighthouse's dark iron and its red band.

**Continue picture (5) · PLAN FIRST.** The great shell at the Mirador at sunset, the sun a finger above its lip: you left just before the sun sat on the shell (Aurora's wish, "the sun likes to sit on the lip of the great shell").

**Gallery (7) · PLAN FIRST.** Six slides, in this order:

| # | Feature | Caption |
|---|---|---|
| 01 | Core loop | Catch Remei's sheets the moment they fly at six |
| 02 | Second mechanic | Where you look, the pencil sketch fills with paint |
| 03 | A place | The garden of eyes, where a broken face waits |
| 04 | A character | Lluna dives from the stone head at noon |
| 05 | A moment the town keeps | At noon the lemon fountain squeezes itself |
| 06 | The payoff | Fill Aurora's wall and the town holds its festival |

No "together" slide: the game's friends mode uses claude.ai's room, not a bug.games co-op session.

**Seals (8) · PLAN FIRST.** One glyph each. The outline shows the kind:
- feat: a round medallion with a trencadís rim;
- collection: a square print held by washi tape;
- event: a scallop shell.

States: earned is painted in the evening light; in progress is the same art at blue hour, dimmer; not yet is a graphite pencil sketch on paper (the game's own "not painted yet" state).

| Moment | Kind | Glyph |
|---|---|---|
| one-photograph | feat | the shell shutter: a snail-shell spiral |
| sheets-in-the-air | feat | one sheet billowing off a line |
| two-in-one-picture | feat | two paper heads side by side |
| lluna-in-the-air | feat | a diver arcing head-first |
| the-lamp-on-legs | feat | the lighthouse on four legs |
| the-lemon-squeezes | feat | a lemon pinched at the waist |
| the-face-made-whole | feat | two half-faces meeting, one eye each |
| doves-round-the-tower | feat | a dove in flight |
| the-sun-on-the-shell | feat | a scallop fan with the sun on its lip |
| the-egg-hatches | feat | a cracked egg |
| tinta-in-every-quarter | collection | Tinta the cat's head |
| the-wall-is-full | collection | six panels in a 2×3 grid |

The event seal, festival-of-the-shell, is a firework burst in the scallop outline.

**Store (9) · PLAN FIRST** (looks only; all proposals: the game has no cosmetics yet). How each reads at 40 px:

| id | Look | At 40 px |
|---|---|---|
| paper-dove | companion: a white paper dove that rides your traveller's shoulder | a white bird on a blue sky |
| fisherman-beret | skin: a cobalt beret, worn by your paper traveller (drawn by the game's people painter) | a round blue hat on a face |
| sea-glass-tape | trim: washi tape for your prints, sea-glass green and blue | crossed translucent stripes on paper |
| deckle-edge | trim: your prints come out with a torn deckle edge | a ragged white rectangle with a blue picture |
| shell-stamp | sticker: a rubber stamp that presses a little oxblood shell onto a print | a stamp block beside its red shell print |

Owned mark, the reward verb **"taped in"**: a strip of washi tape slaps across the tile's lower-left corner, the way prints are taped into the sketchbook.

**Pass (10–13) · PLAN FIRST.** Name: **Sketchbook pass**. Step unit: **a sunset**. Marker: a small print hanging from one strip of tape (next) and taped flat (held).

| Track | Rewards |
|---|---|
| free | tape-plum (plum washi tape), sticker-black-egg (a black egg sticker for prints), postcard-stamp-lighthouse (a lighthouse postage stamp for the postcards you send), chalk-steps (a trail of chalk footprints behind your traveller) |
| pass | paper-gull (companion), sailor-stripes (a striped top for your traveller), paper-lantern (carried at night), tidemark-border (a sea-blue watercolour edge on your prints) |
| bug.pass | keeper-cap (Tomàs's lighthouse-keeper's cap) |

**Update (15) · PLAN FIRST.** Version 3 (the game's third publish): the residents turn to face you when you talk to them. Close-up: planned as Remei at her washing line; made with Quim in the garden of eyes, turned toward the camera at 19:48, because at that hour Remei stands in the great shell's shadow (see updates/3.png).

**Event (16).** festival-of-the-shell, "The Festival of the Shell" (a proposal):
- the line: a week of festival nights, the whole town on the summit under fireworks;
- the shared goal: photographs of the fireworks, counted together;
- target and dates: not decided here.

The banner: the summit at festival night, fireworks over the sea in the right 55 %, dark sky on the left.

**Round 3.**
- **Moving poster:** the lighthouse on legs, alive.
- **Backdrop:** the Mirador del Blau's balustrade and mosaic floor at dusk.
- **Share card:** the poster's register on the right, title on the left.
- **Phone poster:** recomposed 9:16.
- **Title lettering:** made by the game's own title code.

---

## Pictures

## Poster, focus and the step-4 review (the lead)

### bug/poster.png · bug/poster-2x3.png · bug/poster-1x1.png
- **Shows:** the lighthouse on legs straddling the setting sun, alone in the southern bay. The sun's path runs from between its legs to the bottom edge; a headland with its small far lighthouse frames the left, and a few dark rocks of the cove of eggs sit at the right edge.
  - Register: silhouette. Five words: "a lighthouse standing over the sun".
  - Inks: sunset peach `#fabe8f`, night-sea blue `#152760`, the lighthouse's dark iron `#1e2a3a`, and its red band. Cobalt and violet are the game's own.
  - The light source is in the picture: the sun.
- **Made:** rendered from the game with its own renderer (`tools/render.js` driving the studio build).
  - 2:1 (2400×1200): hour 19.8; d = `lightAt(19.8).sunDisc`; lighthouse centre c = [24, −20, 159]; eye = c − d·130 at y −35 (just above the sea); look [24, −32.5, 184]; lens 40.
  - 2:3 (1200×1800, lens 30, look [24, −27, 163]) and 1:1 (1600×1600, lens 34, look [24, −29, 166]): the same camera recomposed in the renderer, not cropped.
  - Specs: `work/poster3.json`, `work/poster2.json`.
  - About 40 framings were tried first (`work/p1`–`p11`).
    - The floating rock at sunset was rejected: from the sun's side the town always stands in front of it, and hiding buildings would fake the world.
    - Framings with the cove's houses in view were rejected as busy.
- **Agent:** the lead.
- **Check:**
  - `wall.py --focus 0.655,0.30`: the lighthouse and sun hold in every wall shape, from the 577×163 strip to the 140×305 column and at 90×70 (`work/wallcheck/wall-shapes.png`, `wall-hero.png`).
  - Previews at 740×370, 260×367, 150×177, 90×70, and a 4:3 phone crop around the focus (`work/poster_previews.png`).
  - `measure.py light`: 2:1 `L 0.526 C 0.312 light`; 2:3 `L 0.616 C 0.279 light`; 1:1 `L 0.595 C 0.297 light`. A light poster: it should not sit beside another light plate. The wall's light map (`data/lightmap.json`) is not in this pack, so `measure.py wall` could not run.
  - Guard map (`tools/guard2.py`), bottom 38 % (120 px above the caption strip on the 319 px hero plate): **0.0 % guarded**, 16.9 % caution (the sun's path on the water).
    - Guarded pixels overall are 11.5 %. They are all the sun's gold and the ember-pink haze in the upper sky: painted light, no flat block.
    - The first framing had guarded sky inside that band, so it was recomposed, without changing the game's colours.
  - Bottom 26 px: calm water. Bottom-left corner: calm water.
- **Couldn't:** nothing.

### bug/publish.json
- **Shows:** focus `{"x": 0.655, "y": 0.30}`, on the lighthouse's hips where the sun sits between its legs.
- **Made:** chosen by the lead.
- **Check:** wall.py with this focus in every shape; the 4:3 phone crop and the half plate keep the lighthouse and the sun.

### Step 4 · bringing it together (the lead)
- **Side by side:** every picture is in `work/review/round1.png` and `work/review/round23.png`.
  - **One world:** the scene pictures are all the game's renderer, in the gouache-and-pencil town, mostly in the same 19:30–19:50 low western sun (the key still, gallery 01, the update, the backdrop, the share card, the 9:16). The rest are the game's own other hours: gallery 02–06, the festival banner at night.
  - **One drawn language:** the drawn pieces share one paper-sticker look on the game's sketchbook paper and cobalt: the marks, seals, store, pass, marker and owned mark.
  - Nothing drifted from the style note, so nothing was redone for drift.
- **Seals:** I put all 39 in one 32 px strip, and again at 64 px, on night and on linen, built from the delivered files (`work/review/seals-32.png`, `seals-64.png`).
  - The three kinds read apart by outline alone: round tile-rimmed medallion (feat), taped print (collection), scallop (event).
  - Earned, progress and locked read as lit, blue hour and pencil sketch.
  - Weakest glyph at 32 px: doves-round-the-tower.
- **Small marks:** checked at 1× on night and on linen, and at 3–4× with hard pixels (`work/review/marks_view.png`, and the marks agent's sheets beside three other games' icons cropped from the pack's reference screens). Icon, emblem and chip read as one lighthouse straddling a pale sun.
- **Gallery 03, retried by the lead:**
  - The garden of eyes' floor is a black-and-white checkerboard, so its bottom 26 px are not calm.
  - Tried: hours 14:00, 20:24, 21:12, 22:00 and 07:12; three lower, set-back framings meant to put a hedge in front (`work/lead/g03`, `g03b`).
  - The floor stays high-contrast at every hour and angle, because it is the place itself. Kept as made, with the miss recorded. Swap the place if bug.games rejects it.
- **Corrections:** the update's resident is Quim, not Remei; `design.json` and the plan were updated to match.

## Small marks (marks agent)

### bug/icon-46.png
- Shows: the lighthouse on legs standing over the low sun, on a flat dusk-rose ground; 92×92, drawn for 46.
- Last survivors: (1) the head: a red cap, the pale lamp room, the dark gallery ring, the white body with one red band; (2) four dark iron legs, bowed out to the knees and then straight down off the bottom edge; (3) one round pale sun with one hard glow step behind the hips. Nothing else: no sea, no island, no feet.
- Made: other (drawn). Canvas 2D in the game's palette, rasterised in Chromium via Playwright. The finish comes from the game's own `paint.js`, loaded with `core.js` (read only): the `texBrush` R channel sets the gouache value strokes (±3.5 %), and `texPaper` gives the grain, using shaders.js's `c *= mix(1, paper*1.06, k)`. The edges are coloured pencil in the evening pencil ink, broken by a paper-tooth pattern. The leg geometry is the game's own (`districts3.js`: hip, knee, foot), with the head drawn larger to suit 46 px. Shapes snap to the 46 px grid. Code: `work/marks/marks.js`, `marks.html` and `draw.js` (run `NODE_PATH=… node draw.js <outdir>`).
- Agent: marks
- Check:
  - Colour: every flat colour was measured with `measure.py colour`, and all are free:
    - sky `#a35d7a` (ember 28.8 · lilac 31.5 · sun 52.5 · mint 61.8);
    - glow and shade side `#e7a3a8`, the game's C.rose (22.4 · 24.3 · 35.0 · 49.5);
    - sun `#fbf1e4` (36.8 · 30.9 · 22.6 · 26.1);
    - tower `#fbf8f1` tile white (38.7 · 29.4 · 25.2 · 24.8);
    - lamp `#f3ead7` paper (37.0 · 33.6 · 20.8 · 24.2);
    - band and cap `#8e2a22` oxblood (28.3 · 53.7 · 55.6 · 71.0);
    - band and cap in shade `#6e2020` (35.1 · 59.9 · 64.6 · 76.4);
    - legs and gallery `#1e2a3a` iron (52.6 · 60.2 · 76.7 · 71.8);
    - pencil edge `#2a1a3c` (53.1 · 61.6 · 84.4 · 78.5).
  - Swaps: the lighthouse's own red `#c8342c` is caution against ember (15.6), so the band and cap use oxblood. The lamp cream `#f3dd9a` is guarded against sun (10.3), so the lamp is paper and the sun is `#fbf1e4`. Paper `#f3ead7` itself is only 20.8 from sun, which is too close under grain for a big disc.
  - `guard2.py`: guarded 0.0 %, caution 0.0 %. A full-resolution per-pixel guard (`fullguard.py`) found 0 guarded and 3 caution pixels, all on anti-aliased edges. At the shown 46 px it found 0 and 0.
  - Looked at 1× on night `#0b0910` and on linen `#F1ECE4`, and at 4× nearest-neighbour, beside Night Swim, Miradouro and Typos (`work/marks/check-icon-46.png`). It reads as a lighthouse on legs, a different object from the whale, the sunset town and the face, and not a blob, gem or letter. The red band and cap carry it on both grounds.
- Couldn't: nothing.

### bug/emblem-30.png
- Shows: the lighthouse head on two legs over a big pale sun; 60×60, drawn for 30, with fewer parts than the icon.
- Last survivors: (1) the head: cap, lamp, gallery ring, white body and red band, with no cap shading; (2) two legs, one per side, each bent at the knee and running straight down off the edge; (3) the sun as one large disc with no glow step. Dropped from the icon: the back pair of legs, the knee knobs, the glow ring and the cap shade.
- Made: other (drawn). The same Canvas 2D code, palette and `paint.js` finish as the icon, with its own numbers for 30 px. It is not the icon scaled down: the proportions are new, the sun is bigger and higher, and the legs are new. Script `work/marks/marks.js` (`drawEmblem`).
- Agent: marks
- Check:
  - Colour: the same measured colours as the icon, minus the glow, and all free.
  - `guard2.py`: guarded 0.0 %, caution 0.9 %. That 0.9 % is the 3 px band blending with white in guard2's quarter-size (15 px) downsample, which is anti-aliasing. The full-resolution guard found 0 guarded and 0 caution, and so did the shown 30 px.
  - Looked at 1× on night and on linen and at 4× nearest-neighbour beside the same three marks (`check-emblem-30.png`). It still reads as a lighthouse on legs and holds against both grounds.
- Couldn't: nothing.

### bug/chip-64.png
- Shows: the whole lighthouse on legs standing in the cobalt bay with the low sun behind it and its path on the water; 128×128, drawn for 64.
- Parts: the icon's head, legs and sun, plus round knee knobs as in the game's model, feet standing in the sea, a cobalt sea band, three glints of the sun's path, and a glint ring at each foot. That is more than the icon and fewer than the poster: no island, no pier, no town, no sky gradient.
- Made: other (drawn). The same Canvas 2D code, palette and `paint.js` finish, with its own numbers for 64 px. The water glints are flat dabs with slanted ends, set on the pixel grid. Script `work/marks/marks.js` (`drawChip`).
- Agent: marks
- Check:
  - Colour: the icon's colours plus the sea `#2a55b8`, cobalt, the game's own ink (ember 50.7 · lilac 36.7 · sun 69.4 · mint 55.6), and the glint `#e06a9a`, the game's C.pink (26.3 · 26.6 · 52.6 · 66.2).
  - Why C.pink: the poster's reflection pink `#e69b9c` is caution (ember 19.8). A softer rose glint on cobalt blends into lilac caution (≈17–19) at its anti-aliased edges. C.pink stays ≥ 24.8 from lilac at every blend with cobalt and ≥ 26 flat under ±4 % grain.
  - `guard2.py`: guarded 0.0 %, caution 0.0 % (bottom band 0.0 % and 0.0 %). The full-resolution guard found 0 guarded and 3 caution pixels, all on edges. The shown 64 px found 0 and 0.
  - Looked at 1× on night and on linen and at 4× nearest-neighbour beside the same three marks (`check-chip-64.png`). The family of chip, icon and emblem is in `check-family-1x.png` and `check-family-4x.png`, and the masters at 3× are in `check-masters-3x.png`.
- Couldn't: nothing.

Note for all three:
- The other games' icons in the check sheets were cropped from `pack/reference/16-profile.png` ("Played lately") for the check only. They are not used in any deliverable.
- No picture from before this pass was opened or reused. The only picture looked at was this pass's `bug/poster.png`, for the subject and light.

## Continue, result and gallery (stills agent)

# Stills agent: Continue picture, result picture, gallery

The stills agent made all eight pictures from scratch in this pass, with the game's own renderer. They come from `test/studio_local.html` through `STUDIO_RUN.renderShot`, at the size they ship. No picture made before this pass was opened or reused.

- **Script.** `work/stills/stage.js` is `B/tools/render.js` with three additions:
  - it resets the residents before each shot, so each one is placed by the game's own day schedule;
  - it can keep a frame as a print, as a JPEG at quality .9 like `game.js capture()`;
  - it can pin kept prints on the mural. It builds the same `{m, tex}` pins that `game.js frame()` builds from `S.pins`: the matrix is `pinMatrix()` for `who:'mural'`, and the texture is `R.texFrom(image of the print)`, as in `pinTex()`. They are passed to `R.render` as `o.pins`.
- **Specs.** All final specs are in `work/stills/final_specs.json`, and every preview round is kept (`t*.json`, `f*.json`).
- **Checks.** Check sheets and guard maps are in `work/stills/checks/`.
- **The two colour checks:**
  - "blocks" is `work/stills/blocks.py`: a 24×24 window counts when at least 85 % of its pixels are guarded (ΔE2000 below 12 to ember, lilac, sun or mint, using `pack/tools/measure.py`);
  - "guard2" is `B/tools/guard2.py`.

### key-still.png
- **Shows:** the great scallop shell at the Mirador del Blau at sunset. The sun hangs a finger above its upper-left lip, just before it sits. Remei waits by the bougainvillea wall, and Aurora's easel stands at the shell's foot.
- **Made:** rendered from the game at 720×352. The shot is `{hour:19.56, eye:[11.6,-2.6,37.3], look:[-3.1,-1.35,38.35], lens:38}`.
  - The eye is a standing eye on the Mirador floor.
  - It is not the trailer's `sun:true` shot: different eye, framing and hour.
  - The shell (`WORLD.shell`, centre [-0.93,-4.2,36.93]) and the sun (`lightAt(h).sunDisc`) were located with probes. The hour was chosen so the sun disc clears the lip. At 19.6 the disc touches it; at 19.5 it floats well clear.
- **Agent:** stills
- **Check:**
  - It reads at the Continue card's 360×176 and at 132×66; the fan shape and the sun's glow survive (`checks/key-still_check.png`).
  - It has no numbers, names, buttons or HUD.
  - Light: `measure.py light` gives L .398, C .242 (mid).
  - guard2, bottom 34 %: guarded 0.4 %, caution 0.9 %.
  - blocks: no guarded 24 px block in the bottom 120 px. The sun-yellow sky just left of the shell (y 111–229) is the sun's own glow, as on the poster.
- **Couldn't:** nothing.

### result-still.png
- **Shows:** the payoff. Aurora stands at dusk before her mural at the summit, and all six frames hold the player's photographs:
  - the sun on the shell (La Petxina);
  - the lemon fountain at noon (Mercat);
  - the egg tower (El Cim);
  - the broken face made whole (Jardí dels Ulls);
  - a trencadís arch (Les Escales);
  - the lighthouse on legs (Cala dels Ous).
  The low sun rakes in from the west: the east half of the wall glows, the west half is in shade. The legs of the summit's water tower cross the sixth frame.
- **Made:** rendered from the game at 1600×352, and staged as the game stages it.
  - **The six prints** were rendered fresh in this pass, one standing in each quarter, so `districtOf(eye)` gives that quarter (specs in `final_specs.json` under `prints`; the files are in `work/stills/prints/`).
  - **Pinned in mural order.** They are pinned in `DISTRICT_ORDER` (petxina, mercat, cim, jardi, escales, cala), at `WORLD.pinSpots.mural[0..5]`, with game.js `pinMatrix()` and `R.texFrom()`.
  - **Aurora is placed by the game.** Her schedule puts her at the summit facing the wall from 19.6.
  - **Shot:** `{hour:19.62, eye:[-4.8,25.6,-66.6], look:[-4.4,26.75,-77], lens:24}`, with `pins:[[0,p0]…[5,p5]]`.
  - **Composition.** The egg tower hides the middle panels from any distant view, so the eye stands at the tower's north foot. The middle 720×352 holds Aurora and panels 1–4, and the full strip holds all six.
- **Agent:** stills
- **Check:**
  - Mock check sheet: `checks/result-still_check.png` previews the strip with a mock headline and numbers above it, and again printed over it with a Play Again button. Both read.
  - No text or numbers are baked in. The prints carry no lettering.
  - Light: L .28, C .26 (mid).
  - guard2, bottom 25 %: guarded 0.1 %, caution 29.4 % (the peach of the lit floor).
  - blocks: the guarded blocks are on the sunlit cream wall (x 862–1291, y 27–233); the bottom 95 px are clean.
  - Hours tried: 19.7, 19.8 and 19.9 put more of the sun-yellow light on the floor near the bottom, so I kept 19.62.
- **Couldn't:** the photographs read only as small pictures. On panels in shade, the game's hatching speckles them white. That is how pins look in the game.

### gallery/01.png
- **Caption:** Catch Remei's sheets the moment they fly at six (47)
- **Alt:** Looking up from Aurora's courtyard at six o'clock: Remei's painted sheets tear off the washing lines and wheel into the sky, the low sun shining between the roofs.
- **Shows:** the moment the sheets lift off the lines, with the sun in frame.
- **Made:** rendered from the game, 1600×800. The shot is `{hour:18.05, flight:true, lt:0.4, eye:[6,1.4,-1.5], look:[-1,7.6,1.5], lens:20}`.
  - `lt` 0.4 is the lift-off, mid-flight. The trailer's shot is full flight from (3.2,1.5,-3.6).
- **Agent:** stills
- **Check:**
  - The sun and the sheets sit inside the central 4:3, and the slide reads at 100 px.
  - The bottom 26 px are dark roofs (luma std 27).
  - Light: L .293, C .289.
  - guard2, bottom 15 %: guarded 0.0 %.
  - blocks: no guarded block in the bottom 120 px. The sun's halo (y 284–648) is the only guarded area.
- **Couldn't:** nothing.

### gallery/02.png
- **Caption:** Where you look, the pencil sketch fills with paint (50)
- **Alt:** The game's opening: Aurora's courtyard is a graphite sketch on paper, and colour floods in wherever the gaze rests. The lemon tree, her easel and the house beside them are already painted.
- **Shows:** the pencil opening, seen from the game's real starting point. The house of bones, the lemon tree and the painter's corner have bloomed into colour; the rest of the courtyard is still pencil.
- **Made:** rendered from the game, 1600×800. The shot is `{hour:16.6, pencil:true, lt:7.5, hideRes:true, eye:[-5.6,1.56,3.2], look:[-5.2,2.6,-3.0], lens:18}`.
  - The eye is the game's `START` position and the hour is the opening's fixed 16.6.
  - Residents are hidden because `game.js frame()` leaves them out in the sketch phase.
  - The blooms come from the studio's scripted `STUDIO_RUN.pencil()`, which stands in for the player's resting gaze.
- **Agent:** stills
- **Check:**
  - The tree and easel sit inside the central 4:3, and the slide reads at 100 px.
  - The bottom 26 px are pale pencil floor (std 45).
  - Light: L .479, C .085.
  - guard2: guarded 0 %. blocks: none.
- **Couldn't:** nothing.

### gallery/03.png
- **Caption:** The garden of eyes, where a broken face waits (45)
- **Alt:** Jardí dels Ulls: in a checkerboard garden of clipped hedges, a painted face hangs in loose pieces on iron stalks, and an eye watches from the black wall. The face only becomes whole from one spot.
- **Shows:** La Cara Trencada seen from 1.4 m off its one true viewpoint, so the face is still broken. The garden is in hard early-afternoon light.
- **Made:** rendered from the game, 1600×800. The shot is `shotJs`: `eye = brokenFace.E − 1.4·R`, `look = E + 8.6·D − 0.7·R (+0.5 y)`, hour 14.0, lens 32.
  - The trailer's shot sweeps onto the exact viewpoint at 17.9.
  - At 15–20.6 Quim stands in front of the face, so 14.0 is when the garden is clear.
- **Agent:** stills
- **Check:**
  - The face sits inside the central 4:3, and the slide reads at 100 px.
  - Light: L .232, C .195.
  - guard2, bottom 15 %: guarded 0.2 %, caution 7.7 %.
  - blocks: no guarded block in the bottom 120 px.
  - Hours tried: 19.0 and 19.5 turned the cream floor tiles sun-yellow near the bottom, so the shot uses 14.0.
- **Couldn't:** the bottom 26 px are not as calm as asked. The garden's own black-and-white checkerboard floor runs under the whole frame (luma std 107). Pitching up or changing the hour did not remove it (`fG/03a.png`, `fG/03g.png`). No hedge stands where it could fill the bottom while the face still reads, so it needs the lead's call.

### gallery/04.png
- **Caption:** Lluna dives from the stone head at noon (39)
- **Alt:** Lluna, in a red swimsuit, flies flat out through the noon sky at the top of her dive from El Cap, the great stone head in the sea. The white houses of the cove are behind her.
- **Shows:** Lluna at the top of her dive arc (k ≈ .38), front-lit by the noon sun. Below her are the stone head's sunlit crown and the cove's houses.
- **Made:** rendered from the game, 1600×800. The shot is `{hour:12.2, slow:0.001, tBase:15.15, eye:[2.5,-36.9,137], look:[-5.28,-31.25,128.78], lens:80}`.
  - The dive is the game's real `PEOPLE` 'dive' cycle at that time.
  - It is shot from the sea side (south). The trailer's tracking shot is from the north.
- **Agent:** stills
- **Check:**
  - Lluna sits inside the central 4:3. At 100 px she is a small red figure over the dome.
  - The bottom 26 px are the stone dome and a house base (std 55).
  - Light: L .383, C .615 (mid, loud: the noon sky).
  - guard2: guarded 0 %; caution 66.9 % in the bottom 15 % (the sunlit cream stone).
  - blocks: none.
- **Couldn't:**
  - From this side the head shows its crown, not its face.
  - From the north and west Lluna is backlit and tiny at noon. From the north-west and the west the poster's lighthouse on legs stands right behind the head (`fC/G4k`, `G4l`), and the poster is not to be repeated.
  - So the slide favours Lluna, the character.

### gallery/05.png
- **Caption:** At noon the lemon fountain squeezes itself (42)
- **Alt:** Noon in the Mercat de les Ones: the lemon fountain squeezes itself and twelve jets of lemonade arc into its basin, while a resident in yellow watches beside it under the market's mosaic canopy.
- **Shows:** the lemon fountain in its noon moment, with a resident beside it, the red market hall and a glimpse of the sea.
- **Made:** rendered from the game, 1600×800. The shot is `{hour:12.2, lemon:true, eye:[41.2,7.5,-18.8], look:[46.4,9.2,-13.4], lens:24}`.
  - It looks from the north-west. The trailer's shot is from the north-east.
- **Agent:** stills
- **Check:**
  - The fountain sits inside the central 4:3, and the slide reads at 100 px.
  - The bottom 26 px are dark (std 26).
  - Light: L .156 (dark), C .157.
  - guard2, bottom 15 %: guarded 1.0 % (scattered lemonade pixels, not a block).
  - blocks: none in the bottom 120 px. One guarded block is the pale sky beside the stall (near mint), at mid height.
- **Couldn't:** nothing.

### gallery/06.png
- **Caption:** Fill Aurora's wall and the town holds its festival (50)
- **Alt:** The night of the Festival of the Shell: the whole town stands on the summit by the balustrade as fireworks burst over the sea beside the moon. Aurora, palette in hand, is among them.
- **Shows:** the festival crowd on the summit, with gold, teal and magenta bursts over the sea.
- **Made:** rendered from the game, 1600×800. The shot is `{hour:21.7, festival:true, lt:12.6, eye:[1.5,25.75,-64.5], look:[-6,28.6,-38], lens:22}`.
  - The six prints are pinned on the mural, as they would be on festival night, though the wall is behind the camera.
  - The fireworks are the studio's `fireworks()`. The camera heads 16° west of south, so every burst falls inside the azimuth range the game itself uses (0.1π–0.9π, over the sea).
  - `lt` 12.6 was chosen for a spread of bursts.
  - The trailer's two festival shots look east and north-west. This one looks south-south-west from among the crowd.
- **Agent:** stills
- **Check:**
  - The bursts and crowd sit inside the central 4:3, and the slide reads at 100 px.
  - The bottom 26 px show the dim floor and the lower edges of three figures (std 29).
  - Light: L .228, C .141.
  - guard2: guarded 0 %. blocks: none.
- **Couldn't:** the nearest figures are cut at the shins by the frame. Moving the eye back brings the egg tower into frame (`fE/06b.png`).

## Not made / open
- Every picture asked for was made. The result still shows the mural: the pins were staged in the game as it stages them, so the festival fallback was not needed.
- **HUD.** The game's HUD is not drawn in any picture; it needs fonts the sandbox lacks.
- **Captions** for the lead (≤ 60 characters, the plan's own):
  - 01 Catch Remei's sheets the moment they fly at six
  - 02 Where you look, the pencil sketch fills with paint
  - 03 The garden of eyes, where a broken face waits
  - 04 Lluna dives from the stone head at noon
  - 05 At noon the lemon fountain squeezes itself
  - 06 Fill Aurora's wall and the town holds its festival

## Seals (seals agent)

# Seals (agent: seals)

## The system (applies to every entry below)

- **Masters.** 192×192 RGBA PNG with a transparent outside, made to be shown at 96 and at 48–64. Each seal has three files: `-earned`, `-progress` and `-locked`.
- **Outline by kind.** The three kinds stay distinct at 32 px, on night and on linen.
  - **feat:** a round medallion with a trencadís rim. The broken cobalt and white tiles are set in grey grout, made with the Voronoi method of `paint.js` `texMosaic`, and the tiles on the west side catch the low sun.
  - **collection:** a square white print, tilted 3.5°, held by a strip of the game's striped washi tape. The tape keeps the game's two-colour diagonal stripe, recoloured to shell pink on paper because the game's own coral and lemon tape is guarded.
  - **event:** a scallop shell with nine ribs, a bumped lip and the two ears at the hinge, with the festival night inside it.
- **One glyph per seal**, drawn as a paper cut-out like the residents. Each has a white paper margin and a hard little shadow, gouache flats in two values (a plum shade plane hatched with `texHatch`, and a warm rim light from the west), and a dark coloured-pencil edge.
- **States, drawn in the world.** No veil, no padlock, no text, no numbers.
  - **earned:** the evening light. A mauve-to-rose dusk sky in hard bands, with a warm wash coming from the west (left), and rim light on the glyph.
  - **progress:** the same art at blue hour. The sky gets the full grade, the glyph a lighter one (0.72), so it still reads, and the outline the lightest (0.7). The grade is toward deep blue `#1c2864`, desaturated and dimmer. In the lamp seal, the lamp is not yet lit.
  - **locked ("not yet"):** a quiet grey ring, grey print or grey shell, and the glyph as a graphite sketch on paper `#d2ccbf`, which is the game's own unpainted state.
    - The sketch comes from the painted glyph: its tone becomes `texHatch` hatching, its lines become pencil, and its cut edge becomes an outline.
- **No gold, and at most one hot accent per seal.** The accent is crimson `#a8282e` (Lluna's swimsuit, the lighthouse band and cap, the face's nose and mouth) or a pink (Mercè's top, the firework sparks). The bronze bell is `#8d5a3a`, and the gold egg of the tower became cobalt.
- **Made:** drawn with the game's own code, in the game page. That is Canvas 2D inside `/home/claude/cara3d/test/studio_local.html`, loaded in Playwright with the Google-font requests blocked; nothing is rendered by WebGL.
  - From `paint.js`: `texPaper` (paper grain, multiplied), `texBrush` (gouache streaks, soft-light) and `texHatch` (shade hatching and the graphite sketch).
  - From `people_paint.js`: `face`, `hair`, `hat`, `drawCat` and `drawBird`. Each is called through a context proxy that swaps the game's near-platform colours for measured free neighbours: `#c8342c`→`#a8282e` and `#f2cf3a`→`#c4e153`.
  - The `#i-shell` path, read from the page's own SVG symbol.
  - Geometry taken from the source: the broken-face planes (`districts2.js`), the egg profile (`land.js` `egg`), the egg-tower stack (`districts1.js`), the lighthouse legs and bands (`districts3.js`), the scallop rib count and lip (`petxina.js`), and the firework chrysanthemum (`shaders.js`).
  - Code is in `work/seals/`:
    - `seals_draw.js` is all the drawing;
    - `run.js` renders, with `NODE_PATH=/home/claude/.npm-global/lib/node_modules node run.js <outdir> [names]`;
    - `strip.py` makes the strips;
    - `cautionlist.py`, `gradecheck.py` and `freenear.py` are the colour checks.
- **Checks, whole set.**
  - **Colour:** all 60 flat colours used were measured with `measure.py colour` (`work/seals/palette_measure.txt`), and every one is free.
    - The lowest margins are: lemon `#c4e153` (sun 20.4), brick `#a4412e` (ember 21.0), the shell's `#e28d9a` (ember 21.1), skin `#b99478`, `#986c50` and `#f3bfa8` (about 21.1), and peg wood `#b98a5a` (21.2).
    - The blue-hour grade was solved so that every white stays clear of lilac (`gradecheck.py`).
  - **`guard2.py`** on all 39: 0.0 % guarded everywhere, and caution of 0–5.6 % (only in the earned states). A full-resolution colour list (`cautionlist.py`) puts the caution only in textured gradients and anti-aliased edges, at 16–20 ΔE, never a flat area.
  - **Strips:** `work/seals/strip-32.png` (1×), `strip-32-x3.png` (the 32 px strip blown up ×3 with hard pixels) and `strip-64.png`. Each shows all 13 seals in all three states, on night `#0b0910` and on linen `#F1ECE4`. Close looks are in `work/seals/final/`: `strip-96.png`, `sheet-96-linen.png` and `sheet-192-linen.png`.
  - **What the strips show:**
    - At 32 px the circle, the taped square and the scallop are told apart at once.
    - Every glyph keeps its silhouette.
    - Locked reads as a quiet colourless "not yet". On night it is lighter than progress, but it carries no colour.
    - The event seal is the only one that is a fan shape and the only one with a night inside, so it is distinct from every moment seal.
- **Couldn't:**
  - Nothing is declared. There is no `game.json`, so the moment names follow the lead's plan.
  - The lemon cannot be the game's warm lemon yellow, because every warm or pale lemon yellow is guarded or caution against the platform's sun. It is a cool lemon yellow, `#c4e153`, lit with cream, and it reads a little green, toward lime.

---

### bug/seals/one-photograph-earned.png · -progress.png · -locked.png
- Shows: feat. The game's own shutter symbol (`#i-shell`) painted as the snail it draws: a cream shell with the cobalt spiral, a grey-violet foot and two horns.
- Rule for the Achievements tab: "Take one photograph. Anything." (Aurora, wish `first`)
- Made: drawn with the game's code (the `#i-shell` path from the page; `paint.js` textures), as in the system note.
- Agent: seals
- Check:
  - Shell `#f4efe6` (sun 23.9), spiral cobalt `#2a55b8`, foot `#8d8296`; all free.
  - guard2: 0 % guarded; caution 3.7 % on earned (edges and gradient); 0 % on progress and locked.
  - Reads at 32 px as a snail with a spiral shell.
- Couldn't: —

### bug/seals/sheets-in-the-air-earned.png · -progress.png · -locked.png
- Shows: feat. One white sheet with a cobalt stripe, held by two wooden pegs on a washing line, its body lifted up and away by the wind.
- Rule: "At six, when the wind comes over the roofs, catch Remei's sheets in the air." (wish `flight`)
- Made: drawn with the game's code (the sheet white `#f7f4ee`, line and peg colours come from `build.js` `laundry`; `paint.js` textures).
- Agent: seals
- Check:
  - All colours free (pegs `#b98a5a` ember 21.2).
  - guard2: 0 % guarded; caution 3.1 % on earned; 0 % on the others.
  - At 32 px it is a white cloth on a dark line.
- Couldn't: —

### bug/seals/two-in-one-picture-earned.png · -progress.png · -locked.png
- Shows: feat. Pere and Mercè leaning their heads together: Pere in his beret and striped top, Mercè in curls and glasses with her pink top.
- Rule: "Take Pere and Mercè together, in one picture. Nobody ever has." (wish `together`)
- Made: drawn with the game's code. `people_paint.js` `hair`, `face` and `hat` draw the heads, with the two-tone head and profile nose of `drawFigure` copied out. Skins are recoloured to free neighbours: Pere `#c1a290` / `#986c50`, Mercè `#f3bfa8` / `#b99478`. The mouths go through the proxy as crimson.
- Agent: seals
- Check:
  - All colours free; the pink top `#e0689a` is the one accent.
  - guard2: 0 % guarded; caution 3.1 % on earned; 0 % on the others.
  - At 32 px it reads as two paper faces, not a generic "people" icon: each has one big eye, glasses or a beret, and the two-tone skin.
- Couldn't: —

### bug/seals/lluna-in-the-air-earned.png · -progress.png · -locked.png
- Shows: feat. Lluna in mid-dive, head first, arms together. She wears her crimson swimsuit and her wet black hair, and a white splash waits on the violet sea below.
- Rule: "Catch Lluna in the air when she dives from the stone head. Not before, not after." (wish `air`)
- Made: drawn with the game's code. Her colours come from `CAST.lluna`, with the red swapped to crimson `#a8282e` and the skin to `#c1a290`; the textures are from `paint.js`. The pose is drawn new: one curved body line, as the game's dive frame (`drawFigure` frame 3) draws her.
- Agent: seals
- Check:
  - All colours free.
  - guard2: 0 % guarded; caution 2.2 % on earned; 0 % on the others.
  - At 32 px: a figure bent head-down over the water, with one red accent.
- Couldn't: —

### bug/seals/the-lamp-on-legs-earned.png · -progress.png · -locked.png
- Shows: feat. The lighthouse on four bowed iron legs standing in the sea, with its crimson bands and cap. It is drawn chunkier than the real thing so it reads small.
  - Earned: the lamp is burning, a pale pink-white with a glow.
  - Progress (blue hour): the lamp is not lit yet.
- Rule: "Photograph the lighthouse on legs at night, with its lamp burning." (wish `lamp`)
- Made: drawn with the game's code. The legs (hip, knee, foot), the bands, gallery and cap come from `districts3.js`. The red `#c8342c` (caution) became crimson `#a8282e`, and the lamp cream `#f3dd9a` (guarded) became `#fff7ee` with a `#fbdcdc` glow.
- Agent: seals
- Check:
  - All colours free.
  - guard2: 0 % guarded; caution 1.7 % on earned; 0 % on the others.
  - At 32 px the legs and the red band read on both grounds.
- Couldn't: —

### bug/seals/the-lemon-squeezes-earned.png · -progress.png · -locked.png
- Shows: feat. A lemon nipped in at the waist, with a viridian leaf, squirting four white drops of juice from its tip.
- Rule: "At noon the lemon fountain squeezes itself. Take it squeezing." (Rosalia, wish `squeeze`)
- Made: drawn with the game's code (`paint.js` textures). The lemon is a cool lemon yellow `#c4e153` (sun 20.4, free) with a cream highlight `#f6f4dc` (sun 21.7). The game's `#f2cf3a` is guarded, and every warmer or paler lemon yellow I tested is guarded or caution against sun. The lemon has no warm rim light, because cream over lemon drifts toward sun.
- Agent: seals
- Check:
  - guard2: 0 % guarded; caution 1.0 % on earned; 0 % on the others.
  - At 32 px it reads as a lemon (citrus shape, nubs, leaf), though greener than the game's.
- Couldn't: the warm game lemon colour (guarded).

### bug/seals/the-face-made-whole-earned.png · -progress.png · -locked.png
- Shows: feat. La Cara Trencada seen whole, made of its own planes:
  - a skin oval, and the cobalt right half-face (two halves meeting);
  - black hair;
  - two eyes, one with a black pupil and one with a green pupil;
  - a crimson nose and mouth.
  - Each plane is cut out of paper with a thin margin, so you can see it was put together.
- Rule: "Find the one place in the garden where the broken face is whole, and take it." (Quim, wish `whole`)
- Made: drawn with the game's code.
  - The plane outlines are the shape coordinates in `districts2.js`, mapped flat.
  - Ochre `#e9a846` (guarded) became skin `#c1a290`, which keeps crimson as the one hot accent.
  - Red became crimson.
- Agent: seals
- Check:
  - All colours free.
  - guard2: 0 % on all three.
  - The strongest read in the set at 32 px.
- Couldn't: —

### bug/seals/doves-round-the-tower-earned.png · -progress.png · -locked.png
- Shows: feat. A close view of the top of the tower of eggs, with its iron bell frame and bronze bell, and three of the game's paper birds circling it.
  - The eggs are white, brick, cobalt and white.
  - The game's gold egg became cobalt, so the seal has no gold.
- Rule: "At noon Dolors rings and the doves go round the tower. Catch them flying." (wish `bell`)
- Made: drawn with the game's code. `people_paint.js` `drawBird` draws the birds, with a paper margin added. The egg profile and the stacking come from `districts1.js`. The textures are from `paint.js`.
- Agent: seals
- Check:
  - All colours free.
  - guard2: 0 % guarded; caution 1.1 % on earned; 0 % on the others.
  - At 32 px it reads as a stacked tower with white birds about it. The birds are the weakest part at 32; the tower carries it.
- Couldn't: —

### bug/seals/the-sun-on-the-shell-earned.png · -progress.png · -locked.png
- Shows: feat. The great scallop from the Mirador, with its ribs and ears, and the low sun sitting on its lip.
- Rule: "The sun likes to sit on the lip of the great shell. Everyone says so. Prove it." (Aurora, wish `shell`)
- Made: drawn with the game's code. The rib count and bumped lip come from the shell in `petxina.js`. Its coral `#ea7d72` is close to ember, so the shell is `#e28d9a` with `#ad5a6a` grooves. The sun is `#fdf8f0` with a pink glow `#fbdcdc`, not the guarded sun cream.
- Agent: seals
- Check:
  - All colours free.
  - guard2: 0 % guarded; caution 0.8 % on earned; 0 % on the others.
  - It is distinct from the event seal at 32 px. Here the shell sits inside the blue tiled coin under a dusk sky. The event seal is shell-shaped itself, with a night inside.
- Couldn't: —

### bug/seals/the-egg-hatches-earned.png · -progress.png · -locked.png
- Shows: feat. The big white egg broken along a toothed crack, its lid tipped off, and two eyes blinking out of the dark inside.
- Rule: "At dawn the big egg on the fishermen's roof hatches. Bring proof." (Jaume, wish `hatch`)
- Made: drawn with the game's code. The egg profile is `land.js` `egg`, and the toothed rim and tipped lid follow `districts3.js`. The chick is yellow `#f6d23a` (guarded), so it is shown only by its eyes.
- Agent: seals
- Check:
  - All colours free.
  - guard2: 0 % guarded; caution 1.6 % on earned; 0 % on the others.
  - Reads at 32 px.
- Couldn't: the yellow chick itself (guarded colour).

### bug/seals/tinta-in-every-quarter-earned.png · -progress.png · -locked.png
- Shows: collection. Tinta, the black cat, walking, in a taped print.
- Rule: "Tinta, Jaume's cat, walks the whole town. Find her in all six quarters." (wish `cats`)
- Made: drawn with the game's code. `people_paint.js` `drawCat` draws her (walking frame, its own paper margin); her yellow eyes go through the proxy as `#c4e153`. The print, tape and textures are from this set.
- Agent: seals
- Check:
  - All colours free.
  - guard2: 0 % guarded; caution 2.4 % on earned; 0 % on the others.
  - At 32 px the black cat with its tail up holds on every ground.
  - The plan said "Tinta's head". The whole walking cat is the game's own drawing and reads much better at 32, so I changed it.
- Couldn't: —

### bug/seals/the-wall-is-full-earned.png · -progress.png · -locked.png
- Shows: collection. Aurora's wall at the summit with all six quarters up.
  - There are six small prints in a 3×2 grid on whitewash `#e6e2da`, each tilted and taped.
  - Each print is a tiny two-tone landscape in a different quarter's colours, some with a low sun.
- Rule: "Give Aurora one photograph from each quarter until the wall at the summit is full." (the mural in `game.js`; Aurora: "The wall is full. Tonight is the Festival of the Shell.")
- Made: drawn with the game's code (`paint.js` textures). The in-game panel frames are gold `--gold` and would be guarded, so the panels are shown as taped prints, which is how the game handles prints.
- Agent: seals
- Check:
  - All colours free.
  - guard2: 0 % guarded; caution 5.6 % on earned (from guard2's quarter-size downsample: print edges and small blends); 0 % on the others.
  - A plain 3×2 colour grid read as a palette or a building front, so it was redrawn as taped prints. It now reads as a wall of photographs.
- Couldn't: —

### bug/seals/festival-of-the-shell-earned.png · -progress.png · -locked.png
- Shows: event. The scallop shell itself is the outline: shell pink, nine ribs, the lip and the ears. Inside is the festival night, with one firework chrysanthemum: white strokes, pink sparks at every third tip, drooping a little.
  - Progress: the night at blue hour, the burst dimmer and drooping further.
  - Locked: a grey shell with a graphite burst.
- Rule (a proposal; nothing is declared, and the target and dates are not decided): "Photograph the fireworks over the summit during the Festival of the Shell; the town counts them together."
- Made: drawn with the game's code. The burst follows the firework painter in `shaders.js` (spokes with trailing strokes, a centre flash, droop with age). The night is `#1b1d3e` and `#152760`. The shell takes its rib and lip logic from `petxina.js`.
- Agent: seals
- Check:
  - All colours free; the sparks' `#e27b98` (ember 23.2) is the one accent.
  - guard2: 0 % on all three.
  - At 32 px it is the only fan-shaped seal and the only one with a night inside: clearly the event, apart from all 12 moments.
- Couldn't: —

## Store, pass, marker and owned mark (store-pass agent)

# store-pass · notes (agent: store-pass)

How everything here was made:
- **Drawing.** All drawing is Canvas 2D in the game's own page, `/home/claude/cara3d/test/studio_local.html`, loaded in Playwright. It calls the game's own 2D code:
  - `people_paint.js`: `drawFigure`, `hat`, `pattern`, and the residents' cut-paper rules: a #fbf8f0 paper margin, gouache-flat colour, the `rgba(30,20,60,.16)` "cubist" plane on one side, and #1d1a33 pencil nudged off the paint;
  - `ui.js` `UI.grain`, same recipe and seed;
  - `paint.js`: the `strokeLayer` stroke and the `texMosaic` trencadís method;
  - `index.html` `#i-shell`;
  - `style.css`: the sketchbook page (#f3ead7 with cobalt rules), prints (#fffdf7), washi `.tape`, the ring binding and the tab shapes;
  - the game's `RNG` for every random choice.
- **Drafts and finals.** Drafts ran in a light harness page (`work/store-pass/harness.html`) that loads the same `src/*.js` files, to save CPU. Every final in `bug/` was then redrawn in `studio_local.html` from the same code.
- **Code.**
  - `work/store-pass/art.js` holds the drawing code.
  - `run.js` is the runner: `NODE_PATH=/home/claude/.npm-global/lib/node_modules node run.js <out> all --renders renders`.
  - `check.py`, `sheet.py`, `guard_small.py` and `guard_block.py` make the checks.
- **Prints inside the art.** The three pictures inside the prints were rendered by the game's renderer in `studio_local.html` at 19:48 (`hour` 19.8). The specs are `renders_test3.json` (`lh_up2`, used as `deckle_lh`) and `renders_final.json` (`tide_court`, `pass_sunset`). The frames are in `work/store-pass/renders/`.
- **Colours.** Every flat colour was measured with `measure.py colour` and is **free**:
  - paper #f3ead7 (sun 20.8), tile #fbf8f1, print #fffdf7, ink #1d1a33;
  - cobalt #2a55b8, #2f5fae, #24499f, night #152760, #1b2f6b, iron #1e2a3a, navy #1e2a4a;
  - oxblood #8e2a22, plum #6a3a8a, #8c62a3, viridian #1f6b5a, dusk #4b4f8f, dusk violet #7d6f98, mortar #c4c0b8, violet sea #303466;
  - wood #8a5634, #b98a5a (21.2), black #1c1c24;
  - sea-glass green #2e7f73 (mint 29.5), sea-glass blue #3d74b8 (lilac 28.7), teal #357f8f, #2a6a78;
  - tab pink #f2c3b3 (ember 24.9), greys #6b6b78, #8e8b99 (lilac 21.6), whites #e9e4dc, #e6dfcf, #f6efe0, #fbf6ea;
  - mosaic #16357c, #22305e, #25407e, grout #3f4462.
- **Translucent tapes and stripes.** These were checked as the colours they actually make on the page:
  - green tape at .86 over paper gives #4c8f82 (mint 23.5); blue gives #567cba (lilac 24.3); teal wash #619ba6 (mint 24.9); plum strip #7f5496.
  - Pale sea-glass sits on mint or lilac, so the "sea glass" is a deep bottle glass. Turquoise #19ac8e is not used.
  - A cobalt and white stripe at 50/50 averages toward lilac (guarded) at small sizes. So every cobalt tape is three parts cobalt to one part paper, and the sailor stripes are navy, not cobalt.
- **Only caution colour on purpose.** The traveller's skin, #c98a62 (CAST.trav1; ember 15.8), is the game's own colour and was not changed.
- **guard2 results.** `B/tools/guard2.py` gives 0.0 % guarded on every final. Rewards were checked on their own tier ground. `ground-free`, the markers and `reward-held` are too flat or too small for guard2's 128-colour quantise, so they were checked pixel by pixel (`guard_small.py`): 0.0 % guarded.
- **No guarded blocks.** No 24×24 window anywhere is mostly guarded (`guard_block.py`). The worst windows are inside rendered photographs: deckle-edge 22 %, tidemark 16 %, tile 11 %. All results are in `work/store-pass/guard/guard-results.txt`.
- **Check sheets,** all in `work/store-pass/`:
  - `store-check.png`: each tile at 169 and at 40 on night and linen, ×3 hard pixels, a black fill, greyscale, and the owned mark at 120 and 40;
  - `pass-tile-sizes.png`;
  - `rail-rewards-120.png`, with mock mint owned, lilac next and the sun outline on bug.pass;
  - `rewards-all-grounds-120.png`, `marker-rail.png`, `marker-poses.png`, `owned-mark-frames.png`.

### bug/store/paper-dove.png
- **Shows:** a white paper dove in flight, cut out and painted like the residents (one big eye, a cooler far wing, cubist shade, pencil), on a patch of cobalt gouache sky brushed onto the sketchbook page.
- **Made:** drawn with the game's code in `studio_local.html`: `art.js` `storeDove`, with the page ground, the `strokeLayer`-style gouache and the cut-paper margin and shadow. Not `drawBird`, whose outline is the gull's M; the dove is a cut-out in the residents' manner.
- **Agent:** store-pass
- **Check:**
  - 400×400; top corners are bare paper.
  - At 40 px it reads as a white bird on a blue patch. The black fill reads as a bird; greyscale holds.
  - guard2: 0.0 % guarded, 2.1 % caution (antialiasing where the white edge meets cobalt).
- **Couldn't:** —

### bug/store/fisherman-beret.png
- **Shows:** a paper traveller (head and shoulders) wearing a cobalt beret, on the sketchbook page.
- **Made:** drawn by the game's people painter in `studio_local.html`:
  - `drawFigure(ctx, 0, 0, {...CAST.trav1, hat: 'beret'}, 'front', 0, 'trav1')` at ×4.15;
  - for this one call, the game's `hat('beret')` was swapped for the same ellipse in cobalt #2a55b8, then restored. Nothing else about the figure was changed.
  - I used trav1 instead of trav2 because trav2's top is lemon #f2d06b, which is guarded and would fill the shoulders. trav1's own colours are free (viridian top with paper stripes).
- **Agent:** store-pass
- **Check:**
  - At 40 px it reads as a round blue hat on a face; the black fill reads as a head and shoulders.
  - guard2: 0.0 % guarded, 5.1 % caution. The caution is the game's skin #c98a62 (ember 15.8), left as the game paints it.
- **Couldn't:** the skin is not a free colour. It is the game's own CAST colour, and every traveller's skin is caution.

### bug/store/sea-glass-tape.png
- **Shows:** two strips of washi crossed off-square on the sketchbook page, with hand-torn ends:
  - sea-glass green with viridian stripes;
  - sea-glass blue with cobalt stripes.
- **Made:** drawn with the game's code: `art.js` `tapeStrip`, the game's `.tape` (two-colour stripes, torn ends) at .86 opacity.
- **Agent:** store-pass
- **Check:**
  - At 40 px it reads as crossed translucent stripes. It was crossed off-square on purpose, so it does not read as an ×.
  - The composites on paper are free (above). guard2: 0.0 % guarded, 0.8 % caution.
- **Couldn't:** true pale sea glass sits on mint or lilac, so the glass is deep.

### bug/store/deckle-edge.png
- **Shows:** a print with a torn, deckled white edge. Inside it, the lighthouse on legs seen from the sea, looking up into the deep blue sky at 19:48.
- **Made:**
  - The picture was rendered by the game's renderer (`studio_local.html`, `renders_test3.json` `lh_up2`: hour 19.8, eye [16,-36.8,150], look [24,-9,159], lens 30).
  - The print was drawn with the game's code: `art.js` `printCard`, then `deckle` and the cut-paper shadow.
- **Agent:** store-pass
- **Check:**
  - At 40 px it reads as a ragged white rectangle with a blue picture.
  - guard2: 0.0 % guarded, 0.6 % caution. A tighter lens-36 framing put more of the sunlit body in "sun" range, so it was not used (kept in `out/final/renders_unused/`).
- **Couldn't:** —

### bug/store/shell-stamp.png
- **Shows:** a small wooden rubber stamp (oxblood rubber, a shell on the knob's label) beside the oxblood scallop it printed on the page.
- **Made:** drawn with the game's code: `art.js` `storeStamp` / `stampedShell`. The rubber-stamp ink has clean misses, with no partial alpha, so it does not wash to rose.
- **Agent:** store-pass
- **Check:**
  - At 40 px it reads as a brown stamp beside a red shell. The black fill (stamp and print) holds.
  - guard2: 0.0 % guarded, 1.1 % caution.
- **Couldn't:** —

### bug/pass/tile.png
- **Shows:** the Sketchbook pass as the sketchbook itself, on the sketchbook page:
  - a cobalt gouache cover with the spiral binding along the top and the index tabs down the side;
  - a print taped to the cover (the pier at sunset, the pass's step);
  - a blank paper label.
- **Made:**
  - The cover print was rendered by the game's renderer (`renders_final.json` `pass_sunset`: hour 19.8, eye [0,-34,118], look [60,-34,150], lens 30).
  - The book was drawn with the game's code (`art.js` `passTile`):
    - the rings follow style.css `#book .rings`, with the wire in mortar instead of #8d8aa0, which is lilac caution;
    - the tabs use the game's tab pink #f2c3b3, paper and dusk violet. The game's other tab colours are guarded or caution.
- **Agent:** store-pass
- **Check:**
  - Previewed at 40, 80, 120 and 169 on night and linen; it reads as a blue notebook with a picture at every size.
  - guard2: 0.0 % guarded, 3.8 % caution. The caution is the sunset sky in the print; no guarded block.
- **Couldn't:** **no lettering.** This sandbox lacks the game's fonts (Caprasimo, Kalam). The blank label on the cover is the place for "Sketchbook pass" if the lead letters it later.

### bug/pass/ground-free.png
- **Shows:** the free row's ground: the bare sketchbook page (paper #f3ead7, the game's grain, faint cobalt rules).
- **Made:** drawn with the game's code (`art.js` `pageGround`, `UI.grain` recipe).
- **Agent:** store-pass
- **Check:**
  - 306×243, no lettering or numbers.
  - Pixel check: 0.0 % guarded, 0.3 % caution. guard2 cannot quantise this near-flat image (its 128-colour palette fails), so `guard_small.py` was used.
  - It reads clearly as the lightest tier.
- **Couldn't:** —

### bug/pass/ground-pass.png
- **Shows:** the pass row's ground: the page painted over in cobalt gouache (long strokes in three hard values, bristle ends, grain).
- **Made:** drawn with the game's code (`art.js` `gouacheGround`, the `paint.js` `strokeLayer` stroke).
- **Agent:** store-pass
- **Check:** 306×243; guard2 0.0 % guarded, 0.0 % caution. It is the middle tier.
- **Couldn't:** —

### bug/pass/ground-bug.png
- **Shows:** the bug.pass row's ground: night trencadís, broken tiles in night blues set in grey-blue grout, with a glaze slope and lip.
- **Made:** drawn with the game's trencadís method (`paint.js` `texMosaic`'s Voronoi, grout, glaze and lip), with a free night palette (`art.js` `trencadis`).
- **Agent:** store-pass
- **Check:**
  - 306×243; guard2 0.0 % guarded, 0.0 % caution.
  - It is the darkest and richest tier. The platform's sun outline was checked on it in `rail-rewards-120.png`.
- **Couldn't:** —

### bug/marker-next.png
- **Shows:** a small print (a sunset on the sea) hanging from one strip of pink washi at its top-left corner, swung toward the next cell.
- **Made:** drawn for 48 with the game's code and palette (`art.js` `marker('next')`):
  - ink edges between colours, so no edge blends toward lilac;
  - the tape is the sketchbook's tab pink #f2c3b3 with plum stripes, light enough to read on the dark rail.
- **Agent:** store-pass
- **Check:**
  - 48×48, transparent; nothing that counts.
  - Previewed on a mock 30-cell rail at 1× and 3× (`marker-rail.png`) and on night and linen (`marker-poses.png`).
  - Pixel check: 0.0 % guarded, 0.6 % caution.
- **Couldn't:** —

### bug/marker-held.png
- **Shows:** the same print taped flat with one strip across its top (the game's own way of taping prints), square to the page.
- **Made:** drawn for 48 (`art.js` `marker('held')`), pixel-aligned.
- **Agent:** store-pass
- **Check:**
  - 48×48, transparent. It sits on the last earned cell on the mock rail and reads at 1×.
  - Pixel check: 0.0 % guarded, 1.4 % caution.
- **Couldn't:** —

### bug/pass/tape-plum.png
- **Shows:** a roll of plum washi (striped face, wound edge, card core) with a strip pulled out to a torn end.
- **Made:** drawn with the game's code (`art.js` `rTapePlum`), cut paper with a margin and hard shadow; transparent.
- **Agent:** store-pass
- **Check:**
  - Free tier; it sits on `ground-free` (preview `work/store-pass/previews/tape-plum-on-free.png`).
  - Reads at 120 px on all three grounds. Inside the 243 square.
  - guard2 on its ground: 0.0 % guarded.
- **Couldn't:** —

### bug/pass/sticker-black-egg.png
- **Shows:** a black egg (like the roof eggs) as a die-cut sticker with a thick white edge, its lower-right edge lifting to show the backing.
- **Made:** drawn with the game's code (`art.js` `rEggPeel`); transparent.
- **Agent:** store-pass
- **Check:** free tier, on `ground-free`; reads at 120 px; guard2 0.0 % guarded, 0.0 % caution.
- **Couldn't:** —

### bug/pass/postcard-stamp-lighthouse.png
- **Shows:** a perforated postage stamp:
  - the lighthouse on legs over the sea at sunset (a paper sun behind the legs, night sea, dusk sky), drawn the way the game's map draws it;
  - a wordless wavy postmark.
- **Made:** drawn with the game's code and palette (`art.js` `rStamp`). The red band is oxblood, not the caution lighthouse red. No denomination, no lettering.
- **Agent:** store-pass
- **Check:** free tier, on `ground-free`; reads at 120 px; guard2 0.0 % guarded, 0.0 % caution.
- **Couldn't:** —

### bug/pass/chalk-steps.png
- **Shows:** a paving stone of the town's dark stone with a trail of bare chalk footprints walking across it, and the stick of chalk.
- **Made:** drawn with the game's code (`art.js` `rChalk`); the chalk is broken by the stone's tooth; transparent.
- **Agent:** store-pass
- **Check:** free tier, on `ground-free`; reads at 120 px as footprints on a dark slab; guard2 0.0 % guarded.
- **Couldn't:** —

### bug/pass/paper-gull.png
- **Shows:** a paper gull gliding: grey wings with ink tips, white body, one big eye, a pale beak with the gull's red spot in oxblood.
- **Made:** drawn with the game's code in the residents' cut-paper manner (`art.js` `rGull`); transparent.
- **Agent:** store-pass
- **Check:**
  - Pass tier; it sits on `ground-pass` (preview `previews/paper-gull-on-pass.png`). Reads at 120 px.
  - guard2 on its ground: 0.0 % guarded, 2.5 % caution (antialiasing where the white edge meets cobalt).
- **Couldn't:** —

### bug/pass/sailor-stripes.png
- **Shows:** a striped top for the traveller as a paper-doll cut-out with fold tabs, in navy stripes on white.
- **Made:**
  - drawn with the game's code: `drawFigure`'s torso and arm proportions, and the game's own `pattern(x, 'stripes', …)` with navy #1e2a4a (`art.js` `rStripes`);
  - navy rather than cobalt, because cobalt and white stripes average to lilac at 120 px.
- **Agent:** store-pass
- **Check:** pass tier, on `ground-pass`; reads at 120 px; guard2 0.0 % guarded.
- **Couldn't:** —

### bug/pass/paper-lantern.png
- **Shows:** a round paper lantern on a wooden stick, lit from inside, with oxblood caps and tassel and the game's shell spiral (`#i-shell`) painted on it in cobalt.
- **Made:** drawn with the game's code (`art.js` `rLantern`). The glow is the paper's own whites, with no warm fill near the sun colour.
- **Agent:** store-pass
- **Check:** pass tier, on `ground-pass`; reads at 120 px; guard2 0.0 % guarded, 2.0 % caution.
- **Couldn't:** —

### bug/pass/tidemark-border.png
- **Shows:** a print whose border is a sea-teal watercolour wash dried to a darker tidemark. Inside it, the courtyard's bunting against the blue sky at 19:48.
- **Made:**
  - the picture was rendered by the game's renderer (`renders_final.json` `tide_court`: hour 19.8, eye [3.2,1.5,-3.6], look [-3.4,9.5,2.0], lens 24), cropped;
  - the wash was drawn with the game's code (`art.js` `rTidemark`).
- **Agent:** store-pass
- **Check:**
  - Pass tier, on `ground-pass`; reads at 120 px.
  - guard2 0.0 % guarded, 5.7 % caution. Full resolution shows 96 scattered ember-range pixels from the rendered bunting and roof edge; no block (worst 24×24 window 16 %).
- **Couldn't:** —

### bug/pass/keeper-cap.png
- **Shows:** Tomàs's lighthouse-keeper's cap (navy crown, iron band with stitching, black peak). Its badge is a paper oval with the lighthouse on legs.
- **Made:** drawn with the game's code after the game's `hat('cap')` (`art.js` `rCap`). The badge replaces the game's brass #d9b24a, which is guarded.
- **Agent:** store-pass
- **Check:**
  - bug.pass tier; it sits on `ground-bug` (preview `previews/keeper-cap-on-bug.png`).
  - Reads at 120 px with the sun outline. guard2 0.0 % guarded, 1.0 % caution.
- **Couldn't:** —

**Tier grounds.** All nine rewards are transparent PNGs. Each is drawn to sit on its tier's ground, which the platform puts under it:
- free: `ground-free`;
- pass: `ground-pass`;
- bug.pass: `ground-bug`.

Previews of every reward on all three grounds are in `work/store-pass/previews/<id>-on-<free|pass|bug>.png`. Every reward reads on every ground, thanks to its paper margin and hard shadow.

### bug/reward/taped-in.js
- **Shows:** the owned mark, the verb **"taped in"**. A strip of cobalt washi with fine paper stripes flies in lifted and large, slaps across the tile's lower-left corner (a squash, two creases), and a thumb-sheen runs along it as it settles flat. It ends on the held frame. The tape's ends run off the tile's edges, as if the tile were taped into the book.
- **Made:**
  - a dependency-free Canvas 2D ES module: `drawTapedIn(ctx, w, h, p)` draws the transparent overlay at p 0..1 (p = 1 is the held frame);
  - `playTapedIn(canvas, {onDone})` plays it once in `DURATION_MS` = 620 ms, starting at once. With `prefers-reduced-motion` it draws the held frame straight away.
- **Agent:** store-pass
- **Check:**
  - It imports cleanly as an ES module (exports DURATION_MS, drawTapedIn, playTapedIn, default).
  - Frames at p = 0, .3, .6 and 1 were played on a store tile (`work/store-pass/owned-mark-frames.png`; all frames in `owned-frames/`). The held frame reads at 40 px as a blue band across the corner (`store-check.png`, bottom row).
  - The stripes are three parts cobalt to one of paper (measured 75/25 along the strip), so it reads cobalt, never lilac.
  - It is clear of the top corners (NEW, YOURS). No gold, no glow.
  - It is distinct from stamp, brackets, silk, scope creep, number called, lights, squash, lift, splat, stet, found, rings and unpick.
- **Couldn't:** —

### bug/reward-held.png
- **Shows:** the held frame of "taped in": the striped strip across the lower-left corner with its hard little shadow.
- **Made:** drawn by `bug/reward/taped-in.js` itself (`drawTapedIn(ctx, 400, 400, 1)`) in `studio_local.html`.
- **Agent:** store-pass
- **Check:** 400×400, transparent; pixel check 0.0 % guarded, 5.2 % caution (stripe edges); it reads on all five store tiles at 40 px.
- **Couldn't:** —

## Update and event (update-event agent)

# Update picture and event banner (agent: update-event)

Work folder: `work/update-event/`. All renders come from the game's own WebGL renderer, through `render_ue.js`. That file is `B/tools/render.js` with one change: the page-load timeout is raised to 300 s, because the shared CPU ran past the 30 s default. Nothing made before this pass was opened or used.

**Plan change for the lead (update).** The plan line and `design.json` say "Remei at her washing line". I made Quim instead, for these reasons:
- From 19:30 to 19:50 Remei is not at her washing line. She stands at the Mirador del Blau (from 18:35 to 20:06, at [1.6, −4.2, 33.6]).
- That spot sits in the great shell's evening shadow. I checked at 19:30 and at 19:45, and she is shaded in every framing (`prev1/`, `survey/`).
- Tomàs on the pier is in full sun, but from where a player can stand on the pier, his front is in shade (`prev2/`).
- Aurora is still walking up to the summit at that hour.
- Quim stands at his place in the garden of eyes from 15:00 to 20:36, facing the sunset door. That is the one resident who is in the open low sun at 19:48, at a spot where you can stand facing him with the sun behind him.

Please change `design.json` `update.look` to match: "Quim in the garden of eyes at sunset, turned toward you, the low sun behind him".

### bug/updates/3.png
- **Shows:** Quim, the gardener, at his place in the garden of eyes at 19:48. His paper cut-out is turned square to you mid-conversation, standing in the eye-shaped sunset door. The low western sun is beside him, his paper glows from behind, and the balustrade's long shadows rake the chequered floor.
- **Made:** rendered from the game, 1600×800. The spec is in `update_final.py` (builder `ushot.py`) and `final_update.json`.
  - Shot: hour 19.8; eye 3.0 m from Quim at 1.62 m (the game's eye height), bearing −24° from him, which is east, on his sun-opposite side; 45 mm; look 4° right of him at 1.67 m.
  - The turn is the game's own code. Before rendering, `PEOPLE.attn = {id:'quim', p:[eyeX, eyeZ]}` is set and `PEOPLE.attend(.05)` runs 40 times. That is exactly what `game.js` does while you talk (attnK reaches 1). `people.js` `cards()` then turns him to face the eye.
  - Before/after check: without the turn, the same camera shows his back side, the eyes-shut "face he keeps" (`final_update/3_check_noturn.jpg` vs `3_check_turn.jpg`). The turn is real, and only visible in version 3.
  - No version number, date, NEW or "update" in the picture.
- **Agent:** update-event
- **Check:**
  - Looked at it at 1600×800, 308×154 and 104×52 (`check_update.png`). At 104×52 it reads as a figure facing you inside a dark doorway, with the sun beside him.
  - The subject (Quim, the door and the sun) sits in x 0.33–0.75, inside the central 4:3 (0.167–0.833).
  - `measure.py light`: L 0.467, C 0.28, mid.
  - guard2: guarded 15.3%, caution 38.9%. The poster's own figures are 11.5% and 39.2%.
    - The guarded pixels are the sky glow round the sun (sun) and the sunlit paper of his face (ember). This is the poster's own light.
    - Flat guarded 24-px windows: 9.1% of windows here against 10.1% on the poster (`flatblocks.py`). All of them are sky near the sun.
    - No control sits on this picture.
- **Couldn't:** Remei, as planned (see above).

### bug/updates/3-thumb.png
- **Shows:** a tighter framing of the same moment: Quim's head and shoulders, with his one eye on you, against the black slab of the sunset door, and the sun to the right.
- **Made:** rendered from the game, recomposed rather than cropped: eye 2.4 m from him, same bearing, 60 mm, look 4.5° right at 1.70 m, same turn code. Rendered at 616×308 and downsampled with Lanczos to 308×154 (`update_final.py` THUMB).
- **Agent:** update-event
- **Check:**
  - Looked at it at 308×154 and at 104×52 (`check_update.png`). The face, the eye and the hat read against the dark door; the sun reads at the right.
  - guard2: guarded 15.3% (sky round the sun), caution 39.4%. Flat guarded 24-px windows: 2 of 264.
- **Couldn't:** —

### bug/events/festival-of-the-shell-banner.png
- **Shows:** the Festival of the Shell night on El Cim at 22:00, seen from the summit's east edge, looking south-south-west over the balustrade.
  - Left: a dark violet night sky with stars, the night sea and dark roofs below, kept calm for the copy and Join.
  - Right 55%: the whole town in paper on the summit along the balustrade (Tomàs in front, Remei waving, Tinta at their feet), a festival lantern, and fireworks over the sea in violet, cyan, blue and teal with gold sparks.
- **Made:** rendered from the game with `festival:true` (the crowd is placed by `people.js` on the festival night), 1720×600. The spec is in `banner_final.py` (builder `bshot.py`) and `banner_final.json`.
  - Shot: eye [8.4, 26.6, −63.6], bearing 115°, pitch +6°, 32 mm.
  - Fireworks: the studio's `fireworks()` centres its bursts on wherever the camera looks. I replaced it in the page with five fixed bursts, placed in the right 55% in screen space and converted to the game's (az, el).
    - Each burst is checked against `game.js` `festival()`, which uses az 0.1π–0.9π (over the southern sea) and el 0.18–0.48.
    - Used: az 0.67–0.88π, el 0.18–0.37. The shader draws them as in the game.
  - It is a new frame, not the trailer's: the trailer looked east from the summit's west side, and at 21.6–21.7.
- **Agent:** update-event
- **Check:**
  - Mock copy plate over the left 45%, the right 55% cropped alone, display size 860×300 and a 150-px card (`check_banner.png`).
    - With the copy covered, the right 55% still says "festival night on the summit".
    - Cropped alone, it holds as its own picture: fireworks above, the crowd and the balustrade below.
  - guard2, whole image: guarded 0.0%, caution 0.8% (firework spark tips, the lanterns, the lamp-lit balustrade top). Flat guarded 24-px windows: 0.
  - Left 45% (774 px): guarded 0, caution 0, no hot pixels, mean luminance 0.134.
  - Join zone (x < 500, y > 360): mean luminance 0.110, brightest pixel rgb(115,106,149).
  - The nearest lantern sits just right of the copy edge, at x ≈ 795–830.
  - `measure.py light`: L 0.161, C 0.132, dark.
  - No counter in the art.
- **Couldn't:** the title lockup. The game's fonts (Caprasimo, Kalam) are not available in this sandbox, so lettering is left to the lead. The event seal belongs to the seals agent.

## Backdrops, share card and phone poster (round-3 agent)

### bug/backdrop.png
- Shows: Caracolina's bay at rest at 19:45, looking east, away from the sunset. It is open water out to the far headland and island, with the evening's violet sky and its peach horizon band. The clouds are lit from behind the viewer by the low western sun, and the moon sits on the horizon. 1440×577.
- Made: rendered from the game. The shot spec is in `work/round3/specs_final.json` (entry `backdrop-2x`):
  - hour 19.75; eye [52, −35.3, 146]; looking at bearing 62° (east-south-east), pitch −0.46°; lens 30;
  - rendered at 2880×1154 and downscaled (LANCZOS) to 1440×577.
- Why not the Mirador (the plan): I tried hard. Sheets are in `work/round3/`: `a_sheet`, `b_sheet`, `e_sheet`, `h_sheet`, `j_sheet`, `pano_sheet`, `fl_sheet`; the window maths is in my notes below.
  - The Mirador's only open sea view is the iron rail. That rail looks south-south-east straight at the floating rock, and the lighthouse on legs sits behind it in the distance.
  - The clear window between the rock and El Caracol (the coral tower) is at most about 41° wide. A 2.5:1 frame needs a lens of about 80 mm to fit inside it, and at that lens the Mirador itself drops out of the frame.
  - West is the sun and the great shell (the subject of the Continue still). North is the walls, with Remei and the easel. The east walls catch the sun and render ember-hot (#f63a04, ΔE 4.6).
  - The bay keeps the plan's "sea beyond, in the poster's evening light", with nothing that competes.
- Hour: 19:45, 3 minutes before the poster's 19:48. At 19.8 the eastern horizon band reads ΔE 11–12 to ember, which is guarded, right beside the info rail. At 19.75 it drops to caution. I checked seven view directions and three hours (`sweep/`, `hr/`), so this is a property of the sky, not of the framing.
- Agent: round3
- Check:
  - **Page mock:** `work/round3/final/page_desktop.png`, made with `tools/pagecheck.py` after reference 04. The poster sits in the left 8/12 of the 1280 column with a 6 px ink seam and the rail on the right.
    - The poster leads: its bright sunset sits against a dusky backdrop.
    - The backdrop's horizon lines up with the poster's horizon, so the bay runs on past both edges of the hero, and the sea is the floor under it.
  - **guard2:** guarded 0.0 %, caution 23.6 %; bottom 16 %: 0 / 0.
  - **Next to the info rail** (`tools/railguard.py`): right margin guarded 0.0 % (caution 24 %, the peach horizon band); top band over the rail 0 / 0; bottom band 0 / 0.
  - **Largest solid guarded square** (`tools/blockcheck.py`): ember 1 px; sun, lilac and mint 0.
  - **measure.py light:** L 0.357, C 0.306, mid. The poster is L 0.526, light, so the backdrop sits one band below it.
  - No text. No lighthouse, rock, shell or people: the lighthouse and pier are 127° behind the camera.
- Couldn't: a wide Mirador frame without the rock, the far lighthouse or the coral tower (see above).

### bug/backdrop-phone.png
- Shows: the Mirador del Blau at 19:45: the iron rail and its telescope, the trencadís bench, the sea beyond, peach-lit clouds, and the blue-wave mosaic floor (in shade) filling the lower 60 %. 390×826.
- Made: rendered from the game. The spec is `backdrop-phone-2x` in `specs_final.json`:
  - hour 19.75; eye [2.5, −2.9, 35.5]; bearing 41.5°, pitch −12°; lens 26;
  - rendered at 780×1652 and downscaled.
- The window: the tall frame (±12.3°) fits between the rock's ladder (26° away) and El Caracol, which the green treetop hides. The lighthouse, rock, shell, Remei and Tinta are all out of frame.
- Composed on its own, not cropped from the desktop, around the phone page:
  - The sky and horizon sit under the 4:3 poster.
  - The rail's bars show in the gap between the poster and the info card.
  - The shaded wave floor is what shows round Continue and below it.
- Agent: round3
- Check:
  - **Phone mock:** `work/round3/final/page_phone.png`; the poster leads.
  - **guard2:** guarded 0.9 %; bottom 33 % (Continue and Play): 0 % guarded, 0 % caution.
  - **Largest solid guarded square:** 17 px (ember), on the telescope's sunlit brass head at (139, 223). That spot is under the poster on the page and far from any control.
  - Ember specks in the sunlit floor patch sit under the info card.
  - **measure.py light:** L 0.308, C 0.253, mid.
- Note for the lead: desktop and phone are different places (the bay, and the Mirador). If you want them to match, an alternate bay phone backdrop is at `work/round3/final/alt-backdrop-phone-bay.png` (0 % guarded, L 0.306). Its mock is `final/phone_sheet.png`, the right pair.
- Couldn't: —

### bug/poster-9x16.png
- Shows: the poster's one image recomposed for 9:16: the lighthouse on legs straddling the setting sun, alone in the bay. 1080×1920.
  - The lighthouse is a little right of centre (x 0.60), from cap y 0.245 to feet y 0.675.
  - The violet-to-pink-to-yellow sky takes the top quarter, the island is whole on the left and the pier is on the right.
- Made: rendered from the game. The spec is `poster-9x16-b` in `specs_final.json`:
  - the same hour and camera as the poster: 19.8; eye = c − d·130 with y −35, where d = `lightAt(19.8).sunDisc` and c = [24, −20, 159];
  - lens 34 (the poster uses 40) for a taller frame and a bigger subject;
  - the look is solved so the lighthouse sits at x 0.60 and the horizon at y 0.62. I chose x 0.60 so the cove's dome rock leaves the right edge instead of being sliced by it.
  - It is not a crop: the 2:1 poster has neither this lens nor this vertical extent.
- Agent: round3
- Check:
  - **Side by side** with the 2:1 poster: `work/round3/final/compare_poster_9x16_share.png`. Same image, same light, same register.
  - **Bottom:** the bottom 20 % is soft sea-path water with no objects. guard2 for the bottom 20 % reads 0 % guarded, 30 % caution (the pink path).
  - **guard2 overall:** guarded 13.0 %, all of it the sun's glow round the disc (the poster is 11.5 %).
  - **Largest solid guarded square:** sun 247 px (the glow), ember 4 px.
  - **measure.py light:** L 0.674, C 0.281, light. The poster is L 0.526 and the 2:3 is 0.616. It runs lighter because the tall frame holds more of the bright sky and sea path.
- Couldn't: —

### bug/share-card.png  (+ work/round3/share-card-art.png, the same file; work/round3/share-card-art-2400.png at 2×)
- Shows: the poster's lighthouse on legs over the sun at x 0.71, cap y 0.10, feet y 0.80, with the island, pier and cove on the right. The upper left 45 % is plain pink-to-peach evening sky, ready for the title. The bottom 18 % is sea only, quiet for the linen bar. 1200×630.
- Made: rendered from the game. The spec is `share-2x-1975` in `specs_final.json`:
  - the poster's camera line (eye = c − d·130, y −35); lens 54; the look solved for lighthouse x 0.71 and horizon y 0.71;
  - rendered at 2400×1260 and downscaled.
  - Hour 19.75, not 19.8: at 19.8 the sunlit face of the far headland at the lower left measures as an ember block (42 px). The share card must never carry ember. At 19.75 the largest ember block is 1 px, and the image is otherwise the same.
- No title lettering. The game's fonts are not in this sandbox; the lead composites the title over the plain upper-left sky (about x 0.04–0.48, y 0.08–0.42).
- Agent: round3
- Check:
  - **At 270 px:** `work/round3/final/share_270_check.png`, with a mock linen bar. The lighthouse and sun read clearly and the title area is clean.
  - **guard2:** bottom 18 %: 0 % guarded. Overall: 19.2 % guarded, all sun glow (the same register as the poster).
  - **Largest solid guarded square:** ember 1 px; sun 176 px (the glow).
  - **measure.py light:** L 0.63, C 0.314, light.
  - No player names, no ember.
- Couldn't: a fully empty left 45 %. The poster's far headland (about 26° left of the lighthouse) stays in the lower-left corner (x < 0.17, y 0.41–0.72) at every lens that keeps the lighthouse under about 75 % of the frame height.
  - A darkened-left variant made it muddy (`work/round3/share_dk_sheet.png`), so I left the art as rendered. The title fits above the headland.

### Tools and specs (work/round3/)
- `specs_final.json`: the five final shots, including the alternate.
- `tools/render.js`: `B/tools/render.js` with a longer page-load timeout. The original timed out at 30 s while other agents rendered.
- Check scripts:
  - `tools/pagecheck.py`: the page mocks;
  - `tools/railguard.py`: the guarded share in the margins beside the rail;
  - `tools/blockcheck.py`: the largest solid guarded square;
  - `tools/embermap.py`: where the ember pixels are.

## Moving poster (living-poster agent)

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

## Title lettering (the lead)

### bug/title-lockup.png · NOT MADE in this pass (also the share card's title and the pass tile's name)
- **Shows:** nothing yet.
- **Made:** prepared, not finished.
  - The game sets its title with its own code (`src/studio_main.js`, `drawTitle`): Caprasimo in cobalt with a white tile outline, and a coral snail-shell spiral for the "o". Its hand lettering is Kalam.
  - Those fonts load from Google Fonts in the browser. This sandbox can't load them; an earlier font download was refused, and I did not route around it.
  - So I published a private page, "Caracolina lettering press". It runs the game's title code in a real browser with the real fonts and keeps four transparent PNG proofs in the page's own file store:
    - the title lockup, about 2.3k px wide;
    - a 64 px-size proof for the minimum width;
    - "Sketchbook pass";
    - "The Festival of the Shell".
  - The page only runs when it is open in the owner's app, and it was not opened before hand-back. Its file store was still empty at the last check.
- **Agent:** the lead.
- **Check:** none possible yet.
- **Couldn't:** no title lettering anywhere in this zip.
  - `share-card.png` is the art with its left half plain and ready for the title; the art-only copy is the same file.
  - `pass/tile.png` has a blank label for the pass name.
  - The event banner carries no lockup, which is optional.
  - **To finish:** open the lettering press page once. I then read the proofs and add `title-lockup.png` (with its minimum width stated), the share card's title and the pass name, as the next version of this zip.
