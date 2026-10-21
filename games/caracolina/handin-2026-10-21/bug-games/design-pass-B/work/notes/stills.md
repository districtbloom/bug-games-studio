# Stills agent: Continue picture, result picture, gallery

The stills agent made all eight pictures from scratch in this pass, with the game's own renderer. They come from `test/studio_local.html` through `STUDIO_RUN.renderShot`, at the size they ship. No picture made before this pass was opened or reused.

- **Script.** `B/work/stills/stage.js` is `B/tools/render.js` with three additions:
  - it resets the residents before each shot, so each one is placed by the game's own day schedule;
  - it can keep a frame as a print, as a JPEG at quality .9 like `game.js capture()`;
  - it can pin kept prints on the mural. It builds the same `{m, tex}` pins that `game.js frame()` builds from `S.pins`: the matrix is `pinMatrix()` for `who:'mural'`, and the texture is `R.texFrom(image of the print)`, as in `pinTex()`. They are passed to `R.render` as `o.pins`.
- **Specs.** All final specs are in `B/work/stills/final_specs.json`, and every preview round is kept (`t*.json`, `f*.json`).
- **Checks.** Check sheets and guard maps are in `B/work/stills/checks/`.
- **The two colour checks:**
  - "blocks" is `B/work/stills/blocks.py`: a 24×24 window counts when at least 85 % of its pixels are guarded (ΔE2000 below 12 to ember, lilac, sun or mint, using `pack/tools/measure.py`);
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
  - **The six prints** were rendered fresh in this pass, one standing in each quarter, so `districtOf(eye)` gives that quarter (specs in `final_specs.json` under `prints`; the files are in `B/work/stills/prints/`).
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
