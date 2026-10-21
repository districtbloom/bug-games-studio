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
