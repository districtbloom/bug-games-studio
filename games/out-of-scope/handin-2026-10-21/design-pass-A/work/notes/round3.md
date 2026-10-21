# Round 3 notes (agent: round3)

Code: `src/round3.js` (`R3.backdrop`, `R3.share`, `R3.lockup`), plus `src/round3-type.js`, which is generated: the title letters' outlines taken from the game build's embedded Tabloid face. Render jobs are in `work/round3/final.json`. Check scripts are `work/round3/compose_check.py`, `share_check.py`, `lockup_check.py` and `export_svg.py`. Every render printed zero console errors.

## Plan lines changed

- **22 · Title lockup.** The plan said "acid with the cobalt offset". Two additions were needed:
  - **An ink edge.** There is a `#15131a` edge under the letters, 40 font units showing outside each letter. Acid `#e6ff2e` on linen `#F1ECE4` has almost no contrast, so without the edge the name only showed as a blue shadow. On night the edge is next to invisible, so on dark grounds the lockup still looks like the title screen's `.tl-name`.
  - **The mark's dashes in acid and cobalt.** `rawGlyph('mark')` draws its dashed box in ink `#15131a`, and that disappears on night (see `work/round3/lk1g.png`). In the lockup the dashes take the name's own inks: acid, a cobalt offset and the same ink edge. They are walked round the box in the game's 6-on/4-off rhythm, fitted so that every corner turns on an L. The red cursor is the game's own, unchanged (`OL`, `#d4141c`).
  - The soft glow half of `.tl-name`'s text-shadow is dropped, as briefed. The hard 3px-at-70px cobalt offset is kept, scaled with the size.
- **18 · Backdrop.** "Lit from the right edge by one cracked screen" now means the screen sits just past the right edge.
  - Only the outer, toxic-thinning steps of its fan fall on the wall (toxic `#39e07a` at .04 to .32). The acid and lime steps stay off frame, so the info rail (right 30 %) sits on dark green rather than on a bright patch.
  - The acid shows where the poster puts it: as a rim on the lit edge (the chair), and in three torn steps (acid, lime, toxic) along the desk's lit edge.
  - I did not call `officeScene()` itself. It brings Regent, the "G. PEMBERTON · CEO" plate and a radial-gradient vignette. Instead I redrew its set pieces with its own shapes, colours and helpers.
- **19 · Share card.** Regent is drawn full length, standing on a hard floor line, so the bottom 82 px are a flat, quiet floor band for the platform's linen bar. The CRT stands on the floor at the right edge, which crops it. This is otherwise the plan as written.

## Entries

### `bug/backdrop.png`
- **Shows:** Gordon's office at rest at night. The tall window on the navy city, the moon, the empty CEO chair behind the desk, and the desk edge as the floor. The cracked screen's light comes in from the right edge in flat torn steps.
- **Made:** Drawn in the game's code, at 1440×577 (rendered at 2×, downsampled).
  - From `officeScene()`: wall `#0b0a14`, window `#141f45` with its `#050407` frame cross (`ST`, rough line), skyline `#0a0f22` built by its rule (blocks on a 50-unit pitch, 6×9 windows on a 14×26 grid), moon `#fff6e6` at .85, and the chair path `M596 300 C596 250 844 250 844 300 L850 640 L590 640 Z` in `#2d2a38` with `#15131a` tufts (`OL`, `DOT`).
  - The desk is `#5a3a2a` with its `#8a5a3a` edge, flat-filled with the 3 px offset print and the rough ink line. The dry-brush hatch turned into grey static across a slab 1440 px wide.
  - The light is the poster's: torn rings clipped to a fan (`DP.torn`), plus an acid rim on the chair (`DP.rimFilter`).
  - **City windows `#ffd35a` (sun-guarded):** about 10 % of window cells are lit, all left of x = 640, each 6×9 px, never recoloured.
  - There is no text: the name plate is not drawn.
- **Agent:** round3
- **Check:**
  - **Composite.** `bug/checks/round3/backdrop-with-poster.png` puts the poster at 685 px wide in two hero spots (left column at x 64; centred in the left 70 % at x 161), with the rail as the right 30 % (stand-in copy and a stand-in Play pill). It also shows the bare backdrop and a greyscale squint. The poster leads in both spots: it is the brightest, busiest thing, and the backdrop reads as dark set. The chair sits low behind the desk, so it is not a second subject, and only a thin acid rim catches the light.
  - **`colours.py image --noplay`:** PASS.
    - Guarded pixels: 725, all city windows, at x 132–637, nowhere near the rail (x ≥ 1008). No 24×24 block.
    - Caution pixels in the right 30 %: 698. These are the anti-aliased edges of the thin acid rim and desk-edge strip; no flat block.
  - **Markup hexes:** `#ffd35a` guarded (the tiny windows) and `#39e07a` caution (used only at .04–.32 opacity over the wall).
- **Not made / caveats:** I don't know the real hero spot, so the check uses two plausible ones. The desk line (y 492) sits just under a hero whose bottom edge is near y 455–490.

### `bug/backdrop-phone.png`
- **Shows:** The same office, composed for the phone:
  - a taller, narrower window with an unlit city and a small moon;
  - the top of the empty chair behind the desk at bottom right;
  - the desk edge as the floor;
  - the screen's light stepping in on the right wall.
- **Made:** Drawn in the game's code (same pieces and helpers as the desktop backdrop) at 390×826 (rendered at 3×). It is a separate layout, not a crop: window 300×720 with the cross at its own proportions, the city scaled 0.6, the chair at 136 px, the desk line at y 730, and the light source low at desk height. The city is left **unlit**, so no sun-guarded colour sits under the phone page's copy or Play.
- **Agent:** round3
- **Check:**
  - **Composite.** `bug/checks/round3/backdrop-phone-with-poster.png` shows the poster at 4:3 around the `publish.json` focus, full width and inset 16, under a stand-in top bar, with stand-in copy and Play below. It also shows the bare backdrop and a greyscale squint. The poster leads, and the copy sits over low-contrast navy and the city silhouettes.
  - **`colours.py`:** PASS, with 0 guarded pixels.
- **Not made / caveats:** The real phone layout is unknown. I assumed the poster sits at the top and the copy below it.

### `bug/share-card.png`
- **Shows:** Regent full length on a hard floor line, stamp raised, grinning in the cracked CRT's light. The CRT stands at the right edge, cropped by it. The title lockup sits on plain void at the left.
- **Made:** Drawn in the game's code at 1200×630 (rendered at 2×). It is a new composition in the poster's register, not a crop of the poster.
  - Regent is `DP.cast.regent('gleeful')` (`suitB`), 390 px wide, face centre at 0.71 W, with an acid rim (`DP.rimFilter`).
  - The CRT is `POSTER.crt()` at 320 px.
  - The light is the poster's steps (acid → lime → toxic → toxic thinning, torn rings in a fan with specks). The fan is sized so its outermost step ends at x ≈ 515, which keeps the left 43 % plain void.
  - The lockup is `R3.lockup(430)`, centred at x 255.
  - The floor band (y 548–630) is flat `#0b0a0e`, with nothing in it.
  - There are no player names and no ember. Regent's hat keeps its "OK" stamp, as on the poster: it is his costume, not added text.
- **Agent:** round3
- **Check:**
  - **At 270 px.** `bug/checks/round3/share-card-270.png` shows the card at 270 px beside the poster at 270 px, with a stand-in linen bar over the bottom 14 %, and at 3× hard pixels. At 270 the letters are about 19 px tall and clear. Regent's grin, gold eyes and the CRT's glow read, and the card matches the wall poster's register. The linen bar covers only the floor and the soles of his shoes.
  - **`colours.py`:** PASS, with no guarded block.
    - The scan does find 162 scattered near-ember pixels (and 967 sun, 34 mint). They are anti-alias and brush-hatch pixels of the game's own blood red `#d4141c` (tie, stamp, cursor), the gold eyes and buttons, and the toxic edges.
    - The lead's poster shows the same thing (344 near-ember pixels). No ember colour is used, and nothing was recoloured.
- **Not made / caveats:** none.

### `bug/title-lockup.png` (and `bug/title-lockup.svg`)
- **Shows:** "OUT OF / SCOPE" in the title screen's lettering, with the game's mark centred above it as on the title screen. The mark is the dashed selection box with the red cursor that got out.
- **Made:**
  - **Letters.** Outlined from the game build's own embedded Tabloid face (TeX Gyre Heros Condensed Bold, GUST licence) with fontTools, into `src/round3-type.js`. They are set exactly as `.tl-name` sets them: 700, letter-spacing .04em, line-height .86, centred, acid `#e6ff2e`, with a hard cobalt `#1f4bff` offset of 3px at 70px, rotated −2°.
  - **Fidelity.** Compared against the browser's own Tabloid rendering in `work/round3/cmp.png`: the letterforms and spacing match. There are no kerning pairs for these letters in the face.
  - **Ink edge.** `#15131a`, 40 units outside each letter, for linen.
  - **Mark.** From `rawGlyph('mark')`: the cursor is the game's `OL` path in `#d4141c`; the dashes are in acid and cobalt with an ink edge (see the top of these notes).
  - **PNG.** 1200×934, transparent (rendered at 2×).
  - **SVG.** It is clean: paths only, with no fonts and no `<text>`. It carries its own two filter defs (the game's `roughS` and `brush`, for the cursor's line and hatch). It parses as XML, and rendered on its own in Chromium it matches the PNG (mean difference 0.4 / 255).
- **Minimum width: 92 px.** At that width the letters are 18 px tall (cap height = 0.197 × lockup width). Never go below 61 px, where the letters are 12 px. Below about 92 px the mark shrinks to a dotted speck while the name still reads.
- **Agent:** round3
- **Check:**
  - **Sizes.** `bug/checks/round3/title-lockup-min.png` shows the PNG scaled down with Lanczos to 92, 61, 140, 220 and 430 px on night and on linen, plus 92 px at 4× hard pixels. It reads on both grounds at 92 px. On linen the ink edge gives the acid letters their shape. On night the edge is next to invisible: it is a flat 1–2 px dark rim, not a glow.
  - **`colours.py`:** PASS (composited on night and on linen). The 70–82 near-ember pixels are anti-aliased edges of the cursor's blood red, not a block.
- **Not made / caveats:** The lockup is acid-first and made for dark grounds. On linen it works because of the ink edge.
