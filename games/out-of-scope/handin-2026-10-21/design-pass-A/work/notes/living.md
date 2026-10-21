# Living poster · notes (agent: living)

**Plan line (17 · Moving poster): kept.** "`living-poster/outofscope.js` draws Regent and the CRT on canvas from the game's own path data, and its held frame is the poster."

Choices I made on top of that line:
- **Fields:**
  - `kind: 'Detective'`, `verb: 'Object.'`. That's one imperative: you object to the lie by throwing proof.
  - `rants: ['#@$%!', '?!', '!!']` and `hits: ['#@!', '?!']`, grawlix only.
  - `no` and `maker` are `'···'`.
- **The loop happens inside the screen.** The enter pushes the camera into the CRT glass. In the last quarter of the push, a CRT refresh wipe rolls down the glass and the game's desk appears on the screen. That desk is placed so the push lands exactly on the loop's first frame, so there's no cut. The pull-back after hover does the same in reverse. A wipe in the game's own medium is what the contract allows.
- **The loop frames Regent as the game does on its desk:** chest up at the lower right, with his lie bubble at his mouth and the Evidence window at the upper left. This also keeps his gold buttons below the crop, out of the bottom band where Play sits.
- **The throwable is `slip`:** an approval slip freshly stamped with Regent's red box, about 26 px, drawn by `items.slip`.

### `bug/living-poster/outofscope.js`
- **Shows:** the poster alive. Regent, the empty suit, stands with his stamp raised in the cracked CRT's acid light, recomposed for any plate. On hover he takes a startled jolt (hat pops off), slams the stamp down, and the camera pushes into the glass and refreshes into the game: the lie, his stamp sent at your proof and swatted, the throw, the lie breaking with red ink, his recovery.
- **Made:** drawn by the game's own drawing code, then replayed on Canvas 2D.
  - **Extraction.** `work/living/extract.mjs` (Node Playwright) loads `oos3/out/test.html`, injects `src/common.js` and `src/poster.js`, and calls:
    - `suitB({emo})` for gleeful, shocked, furious and smug;
    - `POSTER.crt('pg')`;
    - the tutorial hand `TUT_HAND`;
    - `picto('fired')`, for the evidence slip.

    It parses every element into `{part, fill, stroke, width, transform, opacity, filter}`, flattens the curves and bakes the transforms into each rig part (legs, larm, arm, torso, head, face, hat, stamp).
  - **OK lettering.** The hat's "OK" is outlined from the game's own `fonts/tabloid.woff` with fontTools (`okglyph.py`), so no font is needed.
  - **Packing.** `work/living/build.mjs` packs the data into the template `src/living.js` and writes the module (85 KB, of which 28 KB is path data).
  - **Line and fill.** Fills are `Path2D` with the game's 3 px offset print and a precomputed dry-brush hatch (white streaks clipped to each fill polygon at build time). Outlines are `#15131a`. The rough marker line comes as three jittered copies of every outline, pre-stroked into filled polygons, and they boil at 8 fps (static under reduced motion).
  - **Two SVG quirks the game relies on are reproduced**, so the held frame matches the poster:
    - a filtered element with a zero-size bounding box draws nothing (no tooth lines in the grin, no brim line);
    - the filter region (bbox + 5 %) clips its stroke (the thin, flat-ended gleeful eyes, the thin edges of the OK box).
  - **Light.** It's the poster's own: the torn fan from the glass's left edge in flat steps (acid, lime `#b6f03c`, toxic at 100/55/26/12 %). The seeds and tear counts are ported from `POSTER.compose`, and the counts are fixed so the tears never pop while a plate resizes. Dust drifts in the light. The CRT keeps its radial glass, scanlines and crack. The acid rim sits on Regent's lit edge.
  - **Layout.** It interpolates the poster's 2:1, 1:1, 2:3 and 9:16 compositions by aspect (log-aspect smoothstep), plus two extreme keys of my own: very tall, where the CRT drops below him, and very wide, where the light spreads between them. It scales with `min(w,h)`, never stretches and never shows bars. `anchor()` is his head in every mode, the loop included.
  - **Behaviour:**
    - **idle:** live 2.6–5.8 s and hold 1.6–4.8 s, with the schedule seeded per plate. The four beats are a grin bob with the stamp twitching, admiring the stamp then a practice stamp, tipping his hat, and a chuckle. His eyes open and glance as `near` rises. The screen flickers inside its glass only: a scanline roll, a roll bar, a sideways tear every 4.7 s and the LED blink.
    - **react (0.8 s):** anticipation, then a jolt back with the shocked face as the hat pops off his head, spins and hovers.
    - **enter (0.7 s):** a furious wind-up and the stamp slammed down with an ink splat. The set rocks, the picture tears and the LED is knocked dark. The camera pushes into the glass and the screen refreshes into the game.
    - **loop (6 s, seamless):**
      1. The lie bubble pops in.
      2. His stamp floats off to approve your proof and is swatted by the player's hand (the game's `TUT_HAND`).
      3. The slip is dragged and thrown. The lie cracks (the game's crack path), takes a red ink splat, turns to the game's broken state (dark, struck through in red) and pops.
      4. He is shocked, then furious, then fixes his hat. A new slip is dealt into the window.
      5. He returns to the held pose.

      The HUD is a credibility bar with no numbers, and the type never animates.
    - **squeezed:** furious; he clutches his hat and is shoved toward the edge, trembling and huffing. After about 1 s he pushes the wall back with the stamp pad.
    - **events:** `cue` runs a 1.5 s gag. He winds up, stamps a slip in the air and flicks it, emitting `throw` at 0.72 s from the stamp. `hit` makes him flinch away from the hit point, and the hat is knocked off and spins if the hit is near his head. `look` turns his eyes and head toward `dx`. `shake` makes him stagger and rocks the CRT.
    - **settle:** after hover he pulls back out of the glass from wherever the camera got to, then blends to the held pose.
- **Agent:** living
- **Check:** check sheets are in `bug/checks/living/`.
  - **Harness:** `python3 -I <pack>/living-poster/harness.py outofscope work/living bug/living-poster/outofscope.js`, then `shot.mjs HarnessOutofscopeLiving-poster.dc.html … seq 500 1500 3000 3500 4200 4500 7000 10000 12400` and the `rm` mode. Both report **`errors []`**. I looked at every frame. Sheets: `harness-t500.png` (board idle), `harness-t3500.png` (react), `harness-t4200.png` (enter), `harness-t7000.png` (loop, lie breaking), `harness-t12400.png` (settle back) and `harness-reduced-motion.png`.
  - **Held vs poster:** `held-vs-poster.png` and `held-vs-poster-detail.png`. The held still is rendered at 1600×800 (2400×1200) beside `bug/poster.png`. A 50 % overlay lines up shape for shape. Light band: held **L 0.337 · C 0.246, mid** against the poster's **L 0.346 · C 0.247, mid**.
  - **Sizes and modes:**
    - `living-sizes.png`: 900×640 down to 120×90, plus 900×150 and 120×640, with the `anchor()` ring drawn.
    - `living-idle.png`: the beats and holds.
    - `living-modes.png`: react, enter and the wipe into the loop.
    - `living-loop.png`: one cycle and the settle.
    - `living-events.png`: squeezed, hit, cue, shake, look and near.
  - **Frame time** (600×400, 300 calls, in the harness page; numbers in `living-numbers.txt`):
    - **frame() script time is 0.1–0.3 ms median, p95 ≤ 0.7 ms**, in every mode.
    - With the raster forced every call on this machine's software canvas (SwiftShader, no GPU, 2 cores), it's 4.4 ms idle, 3.4 ms loop and 5.3 ms squeezed, and 9.1 ms during the 0.26 s refresh wipe, when both scenes are drawn.
  - **Flashes** (30 fps luminance trace): idle never steps more than 0.004 in mean luminance between frames, and squeezed never more than 0.003. Nothing flashes, and nothing outside the glass changes brightness.
  - **Colours** (`tools/colours.py image` on every sampled frame at 900×640, plus the held frame at 2400×1200):
    - There is no guarded 24×24 block in any frame. The shocked eyes' void pupils keep each gold disc from holding a 24 px flat square at every plate size this layout produces.
    - Idle, react, loop and squeezed all PASS. The held frame PASSES.
    - In the loop, the HUD's lilac-caution dot was dropped, the acid patch was moved off the window's pink shadow (their anti-aliased edge read as sun), and the cobalt patch was moved off the white cuff's path (its edge read as lilac).
- **Not made / caveats:**
  - **Frame time on a software canvas.** On a GPU canvas the module is far inside the 2 ms budget (0.1–0.3 ms of script). Where the raster is in software (this machine), a frame costs about 4–5 ms at 600×400, and about 9 ms for the quarter second of the refresh wipe.
  - **Bottom band in the enter.** For about 0.25 s of the push (6 of 15 sampled frames at 900×640), his gold buttons and the anti-aliased red ink against the acid light sweep down through the bottom 146 px. It's never a block.
  - **Small plates.** On plates about 400 px tall or less, the held composition itself puts his gold buttons, and the anti-aliased edge of the CRT's toxic LED, inside the bottom 146 px. That is the poster scaled, the same as the poster PNG at those wall sizes. Like the poster, it's checked at its delivered size, where it passes.
  - **Caution colours near the bottom.** His blood-red tie and the toxic light reach the bottom band. Both are caution-zone colours (12–20), not guarded, as on the poster.
  - **The rim.** It's drawn as Regent's outline shifted toward the light, behind the figure. The poster's SVG filter paints the rim over the outer edge of the outline instead, so the lit-side outline reads a little heavier here. An exact copy needs an offscreen layer, which I avoided because the contract rules out DOM and images.
  - **The "OK" on his hat** is the game's own stamp lettering on the character, kept as on the poster family. It moves only rigidly with the hat. No type is ever animated, and the loop's lie is scribble marks, not letters.
