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
  - Code is in `B/work/seals/`:
    - `seals_draw.js` is all the drawing;
    - `run.js` renders, with `NODE_PATH=/home/claude/.npm-global/lib/node_modules node run.js <outdir> [names]`;
    - `strip.py` makes the strips;
    - `cautionlist.py`, `gradecheck.py` and `freenear.py` are the colour checks.
- **Checks, whole set.**
  - **Colour:** all 60 flat colours used were measured with `measure.py colour` (`B/work/seals/palette_measure.txt`), and every one is free.
    - The lowest margins are: lemon `#c4e153` (sun 20.4), brick `#a4412e` (ember 21.0), the shell's `#e28d9a` (ember 21.1), skin `#b99478`, `#986c50` and `#f3bfa8` (about 21.1), and peg wood `#b98a5a` (21.2).
    - The blue-hour grade was solved so that every white stays clear of lilac (`gradecheck.py`).
  - **`guard2.py`** on all 39: 0.0 % guarded everywhere, and caution of 0–5.6 % (only in the earned states). A full-resolution colour list (`cautionlist.py`) puts the caution only in textured gradients and anti-aliased edges, at 16–20 ΔE, never a flat area.
  - **Strips:** `B/work/seals/strip-32.png` (1×), `strip-32-x3.png` (the 32 px strip blown up ×3 with hard pixels) and `strip-64.png`. Each shows all 13 seals in all three states, on night `#0b0910` and on linen `#F1ECE4`. Close looks are in `B/work/seals/final/`: `strip-96.png`, `sheet-96-linen.png` and `sheet-192-linen.png`.
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
