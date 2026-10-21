# Seals (picture 8, plus the event seal of picture 16) · agent: seals

## Plan lines changed (from `bug/NOTES.md` §8 and `design.json` `moments_proposed`)

Every moment, kind and glyph subject from the plan is kept. The changes below are to how a glyph is drawn, made because the first version did not read as itself at 32 px.

- **`untouchable`** (a rubber stamp cracked in two). The crack now runs through the block and pad only, and the right end of the stamp snaps off and drops. In the first version the crack ran the full length, which split the narrow handle into two slivers around a gap of light that read as a light bulb or lightning bolt at 32 px.
- **`swatter`** (a rubber stamp knocked flying). The stamp is now tilted 34° with three speed marks behind it in the light. Tumbled upside down (−128°), it read as a stick.
- **`dont-tap-the-glass`** (a shark fin above a tank's water line).
  - Problem: a framed tank, a grey triangle and a red sticker read as a generic "image" icon (frame, mountain, sun) at 32 px.
  - Redesign: the inside of the seal is now the tank itself, with no frame. Kickback's fin breaks the surface, his back shows dark under the water, and there is a small tap crack in the glass. The tank's SALE sign becomes a blank blood tag, since a sign in the world becomes a shape.
  - Water opacity: the water is laid at full opacity in the game's `D.water #7fe3ea` (caution, mint 14.7). At the game's own 0.92 opacity it blended over the dark into mint's guarded zone, giving 3,371 guarded px. Now it gives 161, all at edges. The colour itself is unchanged.
- **`case-closed`** (Regent's paper hat, knocked off and crumpled). The crumple is now one dent and two creases, and the hat is tipped −36° with two motion arcs. Heavily crumpled, it was unreadable. Tipped only −20°, it read as a sailboat.
- **`archivist`** (the trash lid lifted, a crumpled draft inside). The crumpled draft is now the subject, pushed up out of the bin with its lid swung open. A plain bin read as the generic "delete" icon.
- **`no-wellness-checks`** (Halo, eyes shut, halo dark). The shut eyes are now two deep, separate arcs, and the halo is a wider, open ellipse. Shallow arcs crossed the capsule seam and made a "+" (a medical cross), and the thick, flat halo read as a dash.
- **`clean-hands`** (an open, empty hand).
  - The game has no open hand, so it is drawn in the language of the game's own white tutorial hand (`TUT_HAND` in `tutor.js`: white, rough black line, round fingertips), opened flat. The cuff is the auditor's cobalt jacket.
  - The one hot accent is Kickback's deal dropping away from the hand: a small card in his blood patch colour (`AGENTS.kickback.patch`, the colour of his deal pop-up).
- **`read-the-backs`** (a slip flipped over, corner curled). The curl is larger and moved to the lower right, so that it doesn't echo the file card's own dog-ear at the upper right.
- **`early-bird`** (Deadline's fuse pinched out, one curl of smoke).
  - Deadline is mirrored so that the fuse and smoke rise on the left.
  - The smoke is the game's darker grey `#5a5668` so that it reads against the light behind him. Light grey `#c7c2bb` vanished against acid.
  - His legs and blood shoes are left out (a second hot colour). His LED is left blank.

## How every seal is made (shared by all entries below)

- **Code:** `src/seals.js` (`SEALS.one(id, state)`), drawn with the game's helpers `OL` / `ST` / `SP` / `DOT`. Every line uses the game's `url(#roughS)` filter at this size (the inked ring uses `url(#rough)`), and fills keep the game's `#brush` hatch and 3 px offset print. Colours are the game's own (`BK`, `D.*`, `P.*`, and greys from `style.css`).
  - Every hex in the earned markup was checked against the game's source hexes, and all of them come from the game.
- **Rendering:** `tools/render.py work/seals/final.json`, at 2× with `--final 192 192 --alpha`. All 39 PNGs are 192×192 RGBA: transparent outside the seal's shape, and inside it too for the not-yet state. There were zero console errors.
- **Outline by kind** (in-world, distinct at 32 px):
  - **feat:** a rubber-stamp impression. A thick outer ring and a thin inner ring, inked, with a ragged edge (`url(#rough)`) and dry-ink flecks, on a void disc whose dark lip keeps it readable on linen.
  - **collection:** a dog-eared file card, tilted −6° and landscape. Its face is the dark of the room, its edge catches the light, and the folded corner catches the screen.
  - **event:** a perforated postage stamp, portrait and upright. It has a paper margin (`#fff6e6`) with tear-off teeth, an acid rim on its lit edge, and the picture in the dark.
- **States** (drawn in the world, never a veil or overlay):
  - **Earned:**
    - The ground inside the shape is void.
    - The poster's light comes from the upper right in flat torn steps (acid, then lime `#b6f03c`, then toxic at 100/50/22 %), with a few of the poster's light specks.
    - The glyph gets an acid rim on its lit edge (`DP.rimFilter`) and keeps its own game colours.
    - The ring, card edge and fold are acid.
    - Each seal has exactly one hot accent (listed per entry) and no gold.
    - For light glyphs (the paper, the white hand) the light sits up and to the right, so the glyph also shows against the dark. For dark glyphs (stamps, Deadline, Bcc) the light sits right behind them, as Regent stands against it on the poster.
  - **In progress:** the light is lower.
    - The ring and card edge are toxic `#39e07a`, and the inside steps are the CRT glass's dim greens (`#0d3a22`, `#1d6b3a`, toxic at 50 %).
    - The glyph is unlit (no rim), and its ink is half laid (fills at 42 % over the dark ground, the poster's own "thinning into the dark").
    - The stamp's margin is paper in shadow (`#8f8670`, the CRT's shade line).
  - **Not yet:** a quiet grey outline (two rough rings for feat, the card's edge and fold, the perforated edge) and the symbol in grey line only. There are no fills and no details.
    - The grey is `#8a8398`, the game's own colour for a not-yet achievement (`.ach` in `style.css`).
    - No padlock.
- **No text or numbers anywhere.** The hat's box has no "OK", Deadline's LED is blank, and scrawls are off.
- **Check sheets** (`bug/checks/seals/`):
  - `strip-32.png`: `tools/previews.py strip … 32` with all 39 files in order (all earned, then all progress, then all locked), on night and linen. All three kinds and all three states are distinct at 32 px on both grounds.
  - `strip-64.png` and `strip-96.png`: the same 39 files at 64 and 96 px.
  - `colours-earned.txt`: `tools/colours.py image <13 earned> --noplay`. All 13 PASS, with no guarded block of 24×24. The guarded pixels are anti-aliased edge blends only (2–161 px per seal).
  - The progress and locked sets were scanned too: all 26 PASS.

---

### `bug/seals/case-closed-earned.png`, `-progress.png`, `-locked.png`
- **Shows:** Regent's paper hat (closing Case 01), knocked off his head, tipped over and dented, with two motion arcs. The rubber-stamp ring is the feat outline.
- **Made:**
  - Drawn in the game's code. The hat is taken from `suitCrown`: the paper triangle `#f6f1e4`, the brim band `#e9e1cf`, crease and paper lines `#a39c90` / `#b9b1a2`, and the blood stamp box `D.blood`, with its "OK" letters removed.
  - Hot accent: the blood stamp box.
- **Agent:** seals
- **Check:**
  - `strip-32.png`: reads as a tipped paper hat with a red mark.
  - Colours PASS (23 guarded px, all edges).
- **Not made / caveats:** the hat was redrawn after the 32 px check (see plan changes). Its crumple is lighter than "crumpled" might suggest, to keep it readable.

### `bug/seals/return-to-sender-earned.png`, `-progress.png`, `-locked.png`
- **Shows:** the game's envelope (closing Case 02) with a hooked marker arrow looping back over it. Feat ring.
- **Made:**
  - Drawn in the game's code: `envSVG` (white with the V flap, the game's rough line), and a hooked stroke with a head in the style of the game's own `markerArrow` (`marker.js`), in hot pink `#ff2e88`.
  - Hot accent: the pink hook.
- **Agent:** seals
- **Check:** `strip-32.png`: an envelope with a pink hook, clear on both grounds. Colours PASS (90 guarded px, edges).
- **Not made / caveats:** the brief's no-text list includes "arrows". This hook is the plan's glyph: a marker scrawl that belongs to the world, not a UI pointer. The lead should confirm it, or swap it for a plain returning envelope.

### `bug/seals/clean-hands-earned.png`, `-progress.png`, `-locked.png`
- **Shows:** an open, empty white hand with the auditor's cobalt cuff (no deal taken). Kickback's little blood-red deal card is dropping away beside it. Feat ring.
- **Made:**
  - Drawn in the game's code, in the style of the tutorial hand `TUT_HAND`: white, rough line, round fingertips, opened flat with the fingers spread.
  - Cuff `#1f4bff` (the auditor's jacket in `auditorRaw`). The deal is drawn in Kickback's patch colour `D.blood`, with two white rule lines and no text.
  - Hot accent: the deal card.
- **Agent:** seals
- **Check:**
  - `strip-32.png`: reads as a hand.
  - The deal card is a red fleck at 32 px and reads at 64–96.
  - Colours PASS (124 guarded px: the brush hatch on the cobalt cuff blends toward lilac at edges; no block).
- **Not made / caveats:** the game has no open hand of its own. This one is built from the tutorial hand's drawing language (see plan changes).

### `bug/seals/untouchable-earned.png`, `-progress.png`, `-locked.png`
- **Shows:** the rubber stamp cracked in two (100 % credibility). The handle and most of the block stand, and the right end of the block and pad has snapped off and drops, with two chips. Feat ring.
- **Made:**
  - Drawn in the game's code: the stamp from `floatStamp` / `bigStamp` (void knob, shaft and block, blood pad), split by a jagged crack with two `clipPath` halves.
  - The light sits right behind the stamp, as the stamp is lit on the poster. The rim catches the broken edges.
  - Hot accent: the blood pad.
- **Agent:** seals
- **Check:** `strip-32.png`: a dark stamp with a broken-off end against the light. Colours PASS (117 guarded px: the blood pad's edges blend toward ember; no block).
- **Not made / caveats:** the crack was redrawn after the 32 px check (see plan changes).

### `bug/seals/no-wellness-checks-earned.png`, `-progress.png`, `-locked.png`
- **Shows:** Halo asleep (never asked for a hint). The pink and pale capsule tilted as in the game, eyes shut, and the halo dark. Feat ring.
- **Made:**
  - Drawn in the game's code from `haloD`: the capsule halves `#ff2e88` / `#eef6cf` with the white shine, and the halo path in the game's own shape, dark (`#2d2a38` inside a black line) instead of gold.
  - Closed-eye arcs and a small sleeping mouth in `BK`. Fangs, eye spirals and drip are left out.
  - Hot accent: the pink half of the capsule.
- **Agent:** seals
- **Check:** `strip-32.png`: a pink and pale pill under a dark ring. Colours PASS (2 guarded px).
- **Not made / caveats:** the shut eyes are about 2 px at 32 and read from 64 px up.

### `bug/seals/swatter-earned.png`, `-progress.png`, `-locked.png`
- **Shows:** a floating rubber stamp swatted out of the air (3 stamps or drills swatted), tilted and tumbling away, with three speed marks behind it in the light. Feat ring.
- **Made:**
  - Drawn in the game's code: the whole stamp from `floatStamp`, at 34°. The speed marks are the game's marker strokes.
  - Hot accent: the blood pad.
- **Agent:** seals
- **Check:**
  - `strip-32.png`: a tilted rubber stamp with speed marks.
  - It is clearly different from `untouchable` (upright and broken) at 32 px.
  - Colours PASS (50 guarded px, edges).
- **Not made / caveats:** none.

### `bug/seals/dont-tap-the-glass-earned.png`, `-progress.png`, `-locked.png`
- **Shows:** inside Kickback's tank (got Final pay back from Kickback). His fin breaks the water line, his back shows dark below, there is a small tap crack in the glass, and the tank's SALE sign is a blank blood tag. Feat ring.
- **Made:**
  - Drawn in the game's code from `sharkB`: fin in `D.shark`, back `D.sharkD`, water `D.water`, wave line `#2aa7b4`, and the glass highlight and crack in the game's white highlight.
  - The glyph is clipped to the ring's inside. The light falls on the air above the water, and the rim catches the surface and the fin.
  - Hot accent: the blood tag.
- **Agent:** seals
- **Check:**
  - `strip-32.png`: a grey fin in a band of water.
  - Colours PASS: 161 guarded px, edges only, after the water was laid at full opacity. It was 3,371 px at the game's 0.92.
  - Water `#7fe3ea` is a caution colour (mint 14.7). It is a seal, nowhere near Play, price, selected, Join or owned.
- **Not made / caveats:**
  - Redesigned after the 32 px check (see plan changes).
  - In the not-yet state the line drawing is a fin over a wavy line.

### `bug/seals/early-bird-earned.png`, `-progress.png`, `-locked.png`
- **Shows:** Deadline (board stopped before 16:30) with his fuse bent over and pinched out, and one curl of smoke rising. Feat ring.
- **Made:**
  - Drawn in the game's code from `bombB`: void body, grey cap and LED band `#8a8898`, blank LED panel `#1a0000`, white shine, and smug lidded white eyes with blood pupils. The bomb is mirrored.
  - No spark (that would be gold and blood), no legs or shoes, and no numbers.
  - Hot accent: the blood pupils.
- **Agent:** seals
- **Check:** `strip-32.png`: a black bomb with a face, against the light. Colours PASS (16 guarded px).
- **Not made / caveats:** the pupils are under 1 px at 32 px (the eyes read as white) and read from 64 px up.

### `bug/seals/cross-examiner-earned.png`, `-progress.png`, `-locked.png`
- **Shows:** Bcc (testimony broken with no wrong throw): the navy many-eyed ghost with its blue carbon copy behind it, one big eye cracked across, and two small eyes below. Feat ring.
- **Made:**
  - Drawn in the game's code from `ghostB`: body `D.ghost`, carbon copy `D.copy` offset as in the game, the eye as the game's white spot with furious Bcc's blood iris and void pupil, and a jagged `BK` crack.
  - Hot accent: the blood iris.
- **Agent:** seals
- **Check:** `strip-32.png`: the navy ghost with one big eye is unmistakable. Colours PASS (5 guarded px).
- **Not made / caveats:** none.

### `bug/seals/one-cut-earned.png`, `-progress.png`, `-locked.png`
- **Shows:** the game's scissors, open, blades down, over relay-7's cable cut through in two, with its core showing at the cut (relay-7 cut on the first try). Feat ring.
- **Made:**
  - Drawn in the game's code: `scissorsSVG` (white loops, `#c7c2bb` blades, pivot) turned blade-down. The cable is in the pipe's `#5a5668` / `#8a8898`, with `D.blood` cores at the two cut ends.
  - Hot accent: the blood core at the cut.
- **Agent:** seals
- **Check:** `strip-32.png`: scissors over a cut line. Colours PASS (20 guarded px).
- **Not made / caveats:** at 32 px the cable is a thin grey line. The scissors carry the read.

### `bug/seals/read-the-backs-earned.png`, `-progress.png`, `-locked.png`
- **Shows:** a forgery slip turned over (all five forgeries flipped). Its back carries Halo's heart mark and two typed-line rules, and its lower-right corner curls up. The outline is the collection kind, the dog-eared file card.
- **Made:**
  - Drawn in the game's code: the slip in the game's paper `#fff6e6` with its black line, the heart from `markIcon('heart')` in `#ff2e88` with its white shine, and the curl in `#e9e1cf` with a void shadow.
  - Hot accent: the heart.
- **Agent:** seals
- **Check:** `strip-32.png`: a white slip with a pink heart on the tilted card. Colours PASS (2 guarded px).
- **Not made / caveats:** the slip's coloured strip (pink on the HR slip) is left off, to keep a single hot accent.

### `bug/seals/archivist-earned.png`, `-progress.png`, `-locked.png`
- **Shows:** the case board's trash (6 secrets found) with its lid swung open and the crumpled secret draft pushed up out of it, struck with one blood marker edit. Collection kind (dog-eared file card).
- **Made:**
  - Drawn in the game's code from `trashGlyph` (hub.js): bin `#c7c2bb` with ribs, lid `#8a8898` with handle. The crumpled draft is a white paper ball with crease lines and one `D.blood` stroke.
  - Hot accent: the blood edit.
- **Agent:** seals
- **Check:** `strip-32.png`: a bin with a white paper ball on top, not a closed "delete" bin. Colours PASS (31 guarded px).
- **Not made / caveats:** redrawn after the 32 px check (see plan changes).

### `bug/seals/mail-day-earned.png`, `-progress.png`, `-locked.png` (event seal, picture 16)
- **Shows:** a hot pink envelope from wave two, cancelled by the postmark's three wavy lines, which run in from the stamp's left margin. The outline is the event kind, a perforated postage stamp.
- **Made:**
  - Drawn in the game's code: the envelope from `envSVG` / `pipeScene` (whose envelopes are white, `#ff2e88` and acid) in `#ff2e88` with its black flap. The cancel lines are `BK` marker strokes.
  - The stamp is drawn with `ST` in the game's paper `#fff6e6`, with the acid rim on its lit edge.
  - Hot accent: the pink envelope.
- **Agent:** seals
- **Check:**
  - `strip-32.png`: the perforated paper edge and portrait shape set it apart from every moment seal at 32 px, on night and linen.
  - Colours PASS (2 guarded px).
- **Not made / caveats:** `mail-day` is a proposed event (`design.json`). Nothing is declared.
