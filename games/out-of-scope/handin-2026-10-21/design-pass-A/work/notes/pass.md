# Pass group notes (agent: pass)

Pass **Night Shift**, step unit **a lie broken**. These are pictures only: nothing is declared, and there are no prices or counts. All code is in `src/pass.js` (`PASS.tile()`, `PASS.ground(k)`, `PASS.marker(pose)`, `PASS.reward(id)`). Renders and checks come from `work/pass/jobs.py` (render list), `work/pass/rail.py`, `work/pass/mk.py`, `work/pass/checks.py` and `work/pass/guardmax.py`. Every render had zero console errors.

## Plan lines changed or made specific

- **Free ground** ("brown wood, a ruled sheet"). The ruled sheet is now only a corner in the lower left. A whole sheet, or a strip along the edge, fought the rewards and read as a border. The wood grain is the game's own `#brush` hatch (the dry brush on `officeScene()`'s desk), turned 90° to run along the wood and calmed with a 70% wash of the same `#5a3a2a`.
- **Bug ground** ("the navy night window with the city"). The city's dark towers are brought close and fill most of the ground. Their lit windows (`#ffd35a`, sun-guarded) are kept few, small and at 35–70% opacity, so the ground never reads as sun inside the platform's sun outline: 0 guarded px after blending. The night-window reward, with its navy glass, moon and lit city, then stands out on it.
- **Pass ground** (the dark office in the screen's acid light). The light is a lit pocket right of centre, with its acid core running off the right edge toward the screen. The full-strength toxic step (`#39e07a`, caution vs mint, ΔE 13.5) stays inside the cell, and only the dim steps reach the corners where platform marks may sit.
- **sticky-pad.** The game's sticky-note yellow `#ffe94a` (from `rawGlyph('notes')` and `.t-sticky`) is sun-guarded, ΔE 11.1. A first version passed the 24×24 block test only because of the hatch: its largest all-guarded square was 16×16, and it looked like a solid yellow block. I kept the game's colour and changed the drawing instead. The notes are smaller and ruled edge to edge in the game's grey `#8a8378`, like its own notes glyph. Result: 8.7% guarded pixels, largest all-guarded square 10×10.
- **desk-lamp.** This is `officeScene()`'s red lamp: black stalk with an elbow, blood `#d4141c` shade at the scene's tilt. The scene's flat quad shade is opened slightly into a cone, and a small dark foot (`#2d2a38`) is added so the lamp can stand alone. Without these it read as a red box at 120 px. It stays unlit (cream bulb showing under the shade), so the one light is still the screen.
- **Slips on the trails** (not in design.json). paperclip-trail throws the orange FAC slip (`picto('cleared')`), and envelope-trail throws the pink HR slip (`picto('fired')`). The slip is the game's `.slip2`: paper `#fff6e6`, black line, hard 4 px black shadow, colour strip. Its words became plain bars.
- **Line filter.** The game's `#rough` and `#roughS` size their filter region from the shape's bounding box. A single straight line has a box with no height (or width), so the game's own filter clips it away entirely; the game's office desk-edge line has the same issue. `SL()` uses copies of the two filters with identical primitives (turbulence .04/.06, displacement 4.5/1.8) and a region in user space, and is used only for straight lines.

## Pictures

### `bug/pass/tile.png`
- **Shows:** Gordon's office on the night shift. "NIGHT / SHIFT" is lettered on the night glass, with the moon, the city, and the rubber stamp raised over his desk in the screen's acid light.
- **Made:** Drawn in the game's code.
  - Lettering in the title screen's face, after `.tl-name`: Tabloid 700, acid `#e6ff2e`, a 3 px cobalt `#1f4bff` offset, -2°, two lines at line height .86, tracking .04em. The title's glow is left out.
  - `officeScene()`'s window (navy `#141f45`, the `rng(11)` city `#0a0f22` with lit windows, moon `#fff6e6`, void mullions).
  - The desk `#5a3a2a` with `#brush` grain.
  - The poster's light, as flat torn steps (acid → lime → toxic → toxic thinning).
  - The stamp from `floatStamp()`/`bigStamp()` parts, with an acid rim (`DP.rimFilter`) and the float marks.
- **Agent:** pass
- **Check:**
  - `tools/previews.py sizes` at 40, 80, 120 and 169 px → `bug/checks/pass/tile-sizes.png`. The name reads from 80 px up, and even at 40 px the navy, the acid name and the stamp's red rubber hold.
  - `colours.py --noplay`: PASS, guarded 0.3%, largest guarded square 3×3 (city windows) → `bug/checks/pass/colours.txt`.
- **Not made / caveats:** No price or count. Guarded `#ffd35a` appears only as tiny lit windows. Caution colours: blood is the stamp's rubber, and toxic is the light on the desk.

### `bug/pass/ground-free.png`
- **Shows:** Gordon's office desk (the free row): brown wood, grain, a ruled sheet's corner.
- **Made:** Drawn in the game's code: `#5a3a2a` flat, the game's `#brush` hatch turned along the wood under a wash, `ST` grain and knot in `#8a5a3a`, and the sheet as `OL` paper `#fff6e6` with grey rules. It is opaque.
- **Agent:** pass
- **Check:** `bug/checks/pass/grounds.png` (full size, 120 px, greyscale) and `bug/checks/pass/rail.png`. `colours.py --noplay`: PASS, 0 guarded px.
- **Not made / caveats:** none

### `bug/pass/ground-pass.png`
- **Shows:** The dark office in the cracked screen's acid light (the pass row): a lit pocket of torn steps in the dark.
- **Made:** Drawn in the game's code with the poster's light: torn rings in acid, lime `#b6f03c`, then toxic at 100/55/26/12%, on the office dark `#0b0a14`, with paper specks. It is opaque.
- **Agent:** pass
- **Check:** `bug/checks/pass/grounds.png` and `bug/checks/pass/rail.png`. `colours.py --noplay`: PASS, 0.0% guarded, largest guarded square 3×3.
- **Not made / caveats:** The full toxic step (caution vs mint) touches the right edge in two short spans at mid-height. It sits beside a mint owned outline in the rail preview and still separates clearly. The corners are dim steps.

### `bug/pass/ground-bug.png`
- **Shows:** The navy night through Gordon's window (the bug.pass row): sky, stars, and the city's dark towers close up with a few dim lit windows.
- **Made:** Drawn in the game's code from `officeScene()`'s window: navy `#141f45`, towers `#0a0f22` from the scene's city code, windows `#ffd35a` at 35–70%, star dots `#fff6e6`. It is opaque.
- **Agent:** pass
- **Check:** `bug/checks/pass/rail.png` shows it inside the platform's sun outline: clearly not sun-like. `colours.py --noplay`: PASS, 0 guarded px.
- **Not made / caveats:** none

### `bug/marker-next.png`
- **Shows:** The rubber stamp raised and tilted, hovering, ready: float marks either side and a hard little shadow below.
- **Made:** Drawn in the game's code for 48 px from `floatStamp()`/`bigStamp()` parts.
  - Void knob, neck and block with the game's white highlights.
  - A thin flat blood rubber; at this size the brush hatch turned it pink.
  - The acid rim, and the float marks in paper `#fffbea`.
  - Transparent.
- **Agent:** pass
- **Check:**
  - `bug/checks/pass/marker.png`: 1× on all three grounds and on night and linen, plus 4× nearest.
  - `bug/checks/pass/rail.png`: riding over the next cell.
  - `colours.py --noplay`: PASS.
- **Not made / caveats:** Nothing counts. Red is only the thin rubber strip, so it can't read as Play. The float marks are paper white, drawn for the dark rail cells; on a linen ground they vanish, though the stamp itself still reads (see `marker.png`).

### `bug/marker-held.png`
- **Shows:** The same stamp pressed flat on the cell: the body squashed, ink squeezed out at both ends, and two impact ticks.
- **Made:** As for marker-next, with `squash` lowering the block and flattening the rubber. The blood ink squirts and drops are small, and the impact ticks are paper `#fffbea`. Transparent.
- **Agent:** pass
- **Check:** `bug/checks/pass/marker.png`, and `bug/checks/pass/rail.png` (on the last earned step). `colours.py --noplay`: PASS.
- **Not made / caveats:** As with next, the white impact ticks vanish on linen; the stamp and its ink still read.

### `bug/pass/sticky-pad.png`
- **Shows:** A pad of the game's yellow sticky notes, with one note torn off (ripped top edge, curled corner) for the case board.
- **Made:** Drawn in the game's code: `OL` notes in `#ffe94a` with the brush hatch, the stacked sheet edges, grey rules, the curl in `#e9e1cf`, the acid rim and a contact shadow. Transparent, centred in the 243 square.
- **Agent:** pass
- **Check:** `bug/checks/pass/rewards-120.png` (120 px on its ground, night, linen, greyscale) and `bug/checks/pass/rail.png`. `colours.py --noplay`: PASS, 8.7% guarded (sun), largest all-guarded square 10×10.
- **Not made / caveats:** The note yellow is the game's own and sits 11.1 ΔE from sun. It was not changed. The drawing breaks it up (see the plan changes above). It sits on the free row, away from the sun-outlined bug.pass row.

### `bug/pass/paperclip-trail.png`
- **Shows:** A thrown slip in flight, trailing a chain of paper clips.
- **Made:** Drawn in the game's code: the `.slip2` slip (orange strip, `picto('cleared')`, bars for words). The gem paper clips are a black marker line under a metal `#c7c2bb` wire. There are no paper clips in the game's art, so these are drawn with its helpers and palette. Acid rim, contact shadow, transparent.
- **Agent:** pass
- **Check:** `bug/checks/pass/rewards-120.png` and `bug/checks/pass/rail.png`. `colours.py --noplay`: PASS.
- **Not made / caveats:** Caution colours appear only in small parts (the orange strip and the picto's box and leaf). No crumbs.

### `bug/pass/desk-lamp.png`
- **Shows:** Gordon's red office lamp on a small dark foot.
- **Made:** From `officeScene()`'s lamp path data and colours (black stalk, blood `#d4141c` shade), with the shade opened into a cone and a foot added (see the plan changes above). Cream bulb, the game's white highlight, acid rim, contact shadow. Transparent.
- **Agent:** pass
- **Check:** `bug/checks/pass/rewards-120.png` and `bug/checks/pass/rail.png`. `colours.py --noplay`: PASS.
- **Not made / caveats:** Unlit, as in the game, so the screen stays the one light.

### `bug/pass/envelope-trail.png`
- **Shows:** A thrown slip in flight, trailing little envelopes.
- **Made:** Drawn in the game's code: the `.slip2` slip (pink HR strip, `picto('fired')`), and envelopes from `envSVG()` in `pipeScene()`'s white and hot pink. Acid rim, contact shadow, transparent.
- **Agent:** pass
- **Check:** `bug/checks/pass/rewards-120.png` and `bug/checks/pass/rail.png`. `colours.py --noplay`: PASS.
- **Not made / caveats:** none

### `bug/pass/pinstripe-glove.png`
- **Shows:** Your drag hand in Regent's pinstripe: pointing, with a white cuff and a gold button.
- **Made:** The tutorial's own drag hand (`TUT_HAND` path, tutor.js) filled with `suitB()`'s suit `#1f1d27` and its `#5a5668` pinstripe. The finger creases are from `TUT_HAND`. It has suitB's white cuff, and one of his `P.gold` buttons as a cufflink. Acid rim, contact shadow, transparent.
- **Agent:** pass
- **Check:** `bug/checks/pass/rewards-120.png` and `bug/checks/pass/rail.png`. `colours.py --noplay`: PASS; the gold button is 5×5 px.
- **Not made / caveats:** Regent has no hands in the game (he is an empty suit). The glove is the player's hand in his fabric, which is what the proposal says.

### `bug/pass/night-window.png`
- **Shows:** The night city behind your desk: `officeScene()`'s window with the moon, the lit city, black mullions and a desk-brown sill.
- **Made:** From `officeScene()`'s window code: navy glass, the `rng(11)` city with `#ffd35a` windows, moon, void frame and cross. The `#5a3a2a` sill is added. Acid rim, contact shadow, transparent.
- **Agent:** pass
- **Check:** `bug/checks/pass/rewards-120.png`, and `bug/checks/pass/rail.png` (on the bug ground inside the sun outline). `colours.py --noplay`: PASS, largest guarded square 3×3.
- **Not made / caveats:** The window sky is the same navy as the bug ground. It separates through the black frame, its acid rim, the moon and the brighter lit city against the darker towers.

## Check sheets (bug/checks/pass/)
- `rail.png`: the rail with three rows over four steps, each reward on its row ground at 120 px tall. Stand-in platform states: mint owned (outline and tick) on free and pass steps 1–2, a lilac selected outline on the glove, the sun outline on every bug.pass cell, the marker held on step 2 (last earned) and next over step 3. The pack does not give the step layout, so it is illustrative only, and nothing is declared.
- `rewards-120.png`: each reward at 120 px tall on its row ground, on night, on linen, and in greyscale.
- `grounds.png`: the three grounds at full size, at 120 px, and in greyscale.
- `marker.png`: both poses at 1× on the three grounds and on night and linen, plus 4× nearest.
- `tile-sizes.png`: `previews.py sizes` at 40, 80, 120 and 169 px, on night and linen, greyscale and black fill.
- `colours.txt`: `colours.py image --noplay` for all 12 pictures (all PASS), the largest all-guarded square for each, and `colours.py hexes` (the not-free lines).
