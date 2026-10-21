### bug/icon-46.png
- Shows: the lighthouse on legs standing over the low sun, on a flat dusk-rose ground; 92×92, drawn for 46.
- Last survivors: (1) the head: a red cap, the pale lamp room, the dark gallery ring, the white body with one red band; (2) four dark iron legs, bowed out to the knees and then straight down off the bottom edge; (3) one round pale sun with one hard glow step behind the hips. Nothing else: no sea, no island, no feet.
- Made: other (drawn). Canvas 2D in the game's palette, rasterised in Chromium via Playwright. The finish comes from the game's own `paint.js`, loaded with `core.js` (read only): the `texBrush` R channel sets the gouache value strokes (±3.5 %), and `texPaper` gives the grain, using shaders.js's `c *= mix(1, paper*1.06, k)`. The edges are coloured pencil in the evening pencil ink, broken by a paper-tooth pattern. The leg geometry is the game's own (`districts3.js`: hip, knee, foot), with the head drawn larger to suit 46 px. Shapes snap to the 46 px grid. Code: `B/work/marks/marks.js`, `marks.html` and `draw.js` (run `NODE_PATH=… node draw.js <outdir>`).
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
  - Looked at 1× on night `#0b0910` and on linen `#F1ECE4`, and at 4× nearest-neighbour, beside Night Swim, Miradouro and Typos (`B/work/marks/check-icon-46.png`). It reads as a lighthouse on legs, a different object from the whale, the sunset town and the face, and not a blob, gem or letter. The red band and cap carry it on both grounds.
- Couldn't: nothing.

### bug/emblem-30.png
- Shows: the lighthouse head on two legs over a big pale sun; 60×60, drawn for 30, with fewer parts than the icon.
- Last survivors: (1) the head: cap, lamp, gallery ring, white body and red band, with no cap shading; (2) two legs, one per side, each bent at the knee and running straight down off the edge; (3) the sun as one large disc with no glow step. Dropped from the icon: the back pair of legs, the knee knobs, the glow ring and the cap shade.
- Made: other (drawn). The same Canvas 2D code, palette and `paint.js` finish as the icon, with its own numbers for 30 px. It is not the icon scaled down: the proportions are new, the sun is bigger and higher, and the legs are new. Script `B/work/marks/marks.js` (`drawEmblem`).
- Agent: marks
- Check:
  - Colour: the same measured colours as the icon, minus the glow, and all free.
  - `guard2.py`: guarded 0.0 %, caution 0.9 %. That 0.9 % is the 3 px band blending with white in guard2's quarter-size (15 px) downsample, which is anti-aliasing. The full-resolution guard found 0 guarded and 0 caution, and so did the shown 30 px.
  - Looked at 1× on night and on linen and at 4× nearest-neighbour beside the same three marks (`check-emblem-30.png`). It still reads as a lighthouse on legs and holds against both grounds.
- Couldn't: nothing.

### bug/chip-64.png
- Shows: the whole lighthouse on legs standing in the cobalt bay with the low sun behind it and its path on the water; 128×128, drawn for 64.
- Parts: the icon's head, legs and sun, plus round knee knobs as in the game's model, feet standing in the sea, a cobalt sea band, three glints of the sun's path, and a glint ring at each foot. That is more than the icon and fewer than the poster: no island, no pier, no town, no sky gradient.
- Made: other (drawn). The same Canvas 2D code, palette and `paint.js` finish, with its own numbers for 64 px. The water glints are flat dabs with slanted ends, set on the pixel grid. Script `B/work/marks/marks.js` (`drawChip`).
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
