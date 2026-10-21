# store-pass · notes (agent: store-pass)

How everything here was made:
- **Drawing.** All drawing is Canvas 2D in the game's own page, `/home/claude/cara3d/test/studio_local.html`, loaded in Playwright. It calls the game's own 2D code:
  - `people_paint.js`: `drawFigure`, `hat`, `pattern`, and the residents' cut-paper rules: a #fbf8f0 paper margin, gouache-flat colour, the `rgba(30,20,60,.16)` "cubist" plane on one side, and #1d1a33 pencil nudged off the paint;
  - `ui.js` `UI.grain`, same recipe and seed;
  - `paint.js`: the `strokeLayer` stroke and the `texMosaic` trencadís method;
  - `index.html` `#i-shell`;
  - `style.css`: the sketchbook page (#f3ead7 with cobalt rules), prints (#fffdf7), washi `.tape`, the ring binding and the tab shapes;
  - the game's `RNG` for every random choice.
- **Drafts and finals.** Drafts ran in a light harness page (`B/work/store-pass/harness.html`) that loads the same `src/*.js` files, to save CPU. Every final in `bug/` was then redrawn in `studio_local.html` from the same code.
- **Code.**
  - `B/work/store-pass/art.js` holds the drawing code.
  - `run.js` is the runner: `NODE_PATH=/home/claude/.npm-global/lib/node_modules node run.js <out> all --renders renders`.
  - `check.py`, `sheet.py`, `guard_small.py` and `guard_block.py` make the checks.
- **Prints inside the art.** The three pictures inside the prints were rendered by the game's renderer in `studio_local.html` at 19:48 (`hour` 19.8). The specs are `renders_test3.json` (`lh_up2`, used as `deckle_lh`) and `renders_final.json` (`tide_court`, `pass_sunset`). The frames are in `B/work/store-pass/renders/`.
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
- **No guarded blocks.** No 24×24 window anywhere is mostly guarded (`guard_block.py`). The worst windows are inside rendered photographs: deckle-edge 22 %, tidemark 16 %, tile 11 %. All results are in `B/work/store-pass/guard/guard-results.txt`.
- **Check sheets,** all in `B/work/store-pass/`:
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
  - Free tier; it sits on `ground-free` (preview `B/work/store-pass/previews/tape-plum-on-free.png`).
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

Previews of every reward on all three grounds are in `B/work/store-pass/previews/<id>-on-<free|pass|bug>.png`. Every reward reads on every ground, thanks to its paper margin and hard shadow.

### bug/reward/taped-in.js
- **Shows:** the owned mark, the verb **"taped in"**. A strip of cobalt washi with fine paper stripes flies in lifted and large, slaps across the tile's lower-left corner (a squash, two creases), and a thumb-sheen runs along it as it settles flat. It ends on the held frame. The tape's ends run off the tile's edges, as if the tile were taped into the book.
- **Made:**
  - a dependency-free Canvas 2D ES module: `drawTapedIn(ctx, w, h, p)` draws the transparent overlay at p 0..1 (p = 1 is the held frame);
  - `playTapedIn(canvas, {onDone})` plays it once in `DURATION_MS` = 620 ms, starting at once. With `prefers-reduced-motion` it draws the held frame straight away.
- **Agent:** store-pass
- **Check:**
  - It imports cleanly as an ES module (exports DURATION_MS, drawTapedIn, playTapedIn, default).
  - Frames at p = 0, .3, .6 and 1 were played on a store tile (`B/work/store-pass/owned-mark-frames.png`; all frames in `owned-frames/`). The held frame reads at 40 px as a blue band across the corner (`store-check.png`, bottom row).
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
