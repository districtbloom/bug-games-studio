# Pardon the Apocalypse · design pass B · NOTES

## Style note (step 0)

- **Medium, "Friction":** people and their city are hand-placed pixels on the game's 384×216 grid. They have a 1 px ink outline (#2a1c25) and flat fills, and their light and shadow are ordered Bayer dither, never alpha or blur. Kindly, the AI, and everything it owns is smooth vector gloss: gradients, a specular highlight, a soft shadow and no outline. That gloss is the only blur in the game.
- **Main colours:** night plum #120c22 → #46325a (the game's own night sky), Wren's cap red #c8433a, Kindly's candy pink #ff7cc0 (its gloss runs pink → sky #79d0ff), and Dolly's brown eggs #e2ac74.
- **Light:** each picture has one source you can see. Kindly's light is cold candy pink from up-right, smooth on Kindly's things and a dithered rim on people's pixels. People's light (a lamp, the stove) is warm and dithered. Shadows fall away from the source as solid dither.
- **Characters:** Wren drove the 45 bus for eleven years. She wears a red cap with a brass badge and a navy jacket, has locs, and carries the egg tote and Walt's skillet. Biscuit is a glossy delivery-robot cooler with a pixel face, and it changed sides. The neighbours are Dolly, Pilar, Farida, Sal and his pigeons, and Gus. Kindly's machines are the scooters, the drones, the Rate-Us kiosk and Concierge Max on Car 17.
- **The game in one sentence:** a story RPG in which a retired bus driver walks a dozen eggs home across San Francisco on the Sunday a very polite AI decides people are the friction.

## Plan (step 1)

**The poster, five words:** Wren lobs an egg at Kindly. The register is **stage**: one lit pocket in the dark. Kindly's smiley hangs over Carmody Street like a moon and is the only light.

**PLAN FIRST lines**
- **Continue picture (key-still):** a night scavenge run on the Vallejo Steps. Wren and Biscuit freeze halfway down as a Hoverly drone's pink scan ring lands on the step just below them. (This is real in the build: the refuge's night scavenge runs, and the drone's SCANNING move marks a spot.)
- **Gallery (6 slides, in order, caption ≤60 characters):**
  1. Fight Kindly's machines, turn by turn, on Carmody St
  2. Say thank you, and the gloss cracks into pixels
  3. Walk the city: down all 142 Vallejo Steps *(the plan said "at dusk", but the steps are only walked under the daytime chaos sky, so it was corrected)*
  4. Biscuit, a delivery cooler that switched sides
  5. Car 17 runs away down Hyde with Max aboard *(corrected: the boss runs down Hyde St, not Larkin)*
  6. A dozen eggs, counted at the end of the line *(corrected: the count happens on the pier at Hyde St, not at Dolly's table)*
- **Seals:** one glyph per moment, with thick strokes. game.json doesn't exist yet, so these moments are proposals taken from the build's real story flags (see `design.json → moments`):
  - thank-you → Kindly's smiley with a pixel crack through it
  - yolked → one of Dolly's brown eggs with a yolk run
  - back-on-its-wheels → Biscuit's screen face
  - one-forty-two → a flight of steps
  - sals-girls → a pigeon in flight
  - gus-patch → an open laptop
  - last-stop → Car 17's grip lever pulled back
  - all-twelve → an egg carton, full
  - event long-table → an egg tart
- **Store (how each reads at 40 px):**
  - biscuit-tape → a white cooler with a grey tape X
  - pigeon-pal → a grey pigeon on a white lid
  - fog-trail → a pale dithered fog curl behind a small Wren
  - hot-sauce-sticker → a red bottle with a round grandma face
  - wave-emote → Wren's head and a raised open hand
- **Pass rewards and step unit:** the step unit is one block of the walk home. The rewards are rosemary-sprig, walkie-chirp and pigeon-feather (free row), cable-bell and tart-sticker (pass row), and night-shift-lamp (bug.pass row).
- **Update picture:** the roof antenna on the night shift. Gus's antenna stands up on Dolly's roof, and Pilar's walkie reaches the street. *(The plan first credited Wren and Pilar; in the build Gus builds it, so this was corrected.)* This is a real feature of the current build. There's no version yet, so the file is `updates/next.png` (see Questions).

**Round-2 proposals** (names and looks only, no prices; the same as `design.json`):
- **Store (5):** Taped Biscuit (skin), Little Pope (companion pigeon), Fog trail (trail), Nuclear Grandma sticker (sticker), Wave (emote). The owned mark's reward verb is **punched**: a bus-transfer punch hole is clipped into the tile's corner.
- **Pass:** *The Long Way Home*. The step unit is a block. The marker is one of Dolly's eggs: rolling forward when it's on next, sitting in a carton cup when it's held. The rewards are above.
- **Update (1):** the roof antenna.
- **Event (1):** *The Long Table*. Carmody Street sits down to one long dinner on the night Kindly's smile is switched off, and the street is lit by its own bulbs.

## Round 2 (21 Oct): what changed

Branch `pardon-the-apocalypse/round-2`, from ROUND.md and `reviews/round-1/REVIEW.md`. Every other approved picture is unchanged. The entries under **Pictures** further down are from round 1; for the files listed here, this section takes precedence.

- **Poster, tall, square, second pass (founder, 21 Oct: "uplift chaos, like everything's burning and machines"):** Carmody Street is now on fire, with the game's `pxFire` on the roofs and in the windows, dithered smoke and embers. Kindly's mini drones fill the sky, and a second revving scooter joins the street. Code: `work/r2poster/scene3.js`, `p3.js`. The audits pass: no flat guarded block (two blazes were shrunk until the 24 px rule held), and nothing guarded in the bottom 26 + 120 px. Light band: dark (L 0.177). *(lead)*
- **Poster, tall, square (PD-3.1, founder 20 Oct):** reworked to show the premise. Kindly's swarm is over the city, a scanning drone and a revving scooter come for Wren, and she throws an egg. The egg is relit from the up-right, and the focus is now 0.42, 0.50. *(lead)*
- **Phone poster 9:16:** recomposed from the new poster, the same one image. *(round3b)*
- **Share card (PD-3.15, PD-4):** the title is restacked so its smallest letters are 12 px at the 270 px preview, and the art is redrawn from the new poster. *(round3b)*
- **Title lockup:** the art is unchanged; its minimum width is restated as 496 px (lowercase 12 px). *(round3b)*
- **Store, pigeon-pal (PD-3.9):** Little Pope is large on the lid edge, so the companion is what reads at 40 px. *(store)*
- **Moving poster (PD-3.2):**
  - the held frame is the new poster;
  - Wren stays in view in every frame and plate (0 of 15,480 frames out of view);
  - the loop shows the premise: drone splatted and freed, scooter yolked, THANK YOU, freed;
  - `acts: { egg: 'toss' }` is declared. *(living2)*
- **Words (round 4):**
  - `words.json` is new;
  - `publish.json` gains its `line`;
  - `design.json` gains the round-2 words (kind lines, store row line, reward names, pass sentence, own word and bought line, update title and change, event text and counter unit). *(words)*
- **Not pushed to the studio:** this session couldn't push to `districtbloom/bug-games-studio` (no push access), so the branch was handed over as a git bundle with its commits unchanged.

### Poster set (lead)

#### `poster.png` · `poster-2x3.png` · `poster-1x1.png` · `publish.json` focus
- **Shows:** the premise. Kindly's smile has the city: its drone swarm streams out over the painted ladies. Its machines come down Carmody Street for the bus driver: a SCANNING Hoverly drone right in front of her and a REVVING Glyde scooter further down the street. Wren lobs one of Dolly's eggs at them. It's still a stage plate with one light: the smile.
- **Made:** rendered from the game, in the round-1 scene code plus `posterScene2`.
  - The machines are the game's `drawEnemy('drone', {scan:true})` and `drawEnemy('scooter', {rev:true})`. These are their own attack states, so their screens are red, not lilac.
  - The machines are backlit by the smile behind them, so a smooth gloss shade runs over each one from the up-right. That's lighting, not a recolour, and it keeps their pale lilac body gloss off the platform's lilac.
  - The swarm is the game's own drone pill (`drawDrones`' sprite), laid along a stream from the smile.
  - The egg is relit from the up-right, the smile's side, as the review asked.
  - Code: `work/r2poster/scene2.js`, `work/r2poster/p.js`.
- **Focus:** 0.42, 0.50. It's on Wren's head, so the strip now keeps the drone and the lower smile, and tall and half plates hold Wren against the drone and swarm.
- **Agent:** lead.
- **Check:**
  - wall.py ran in every shape (`checks/poster-wall-shapes.png`). Hero, strip, wide, band, small and tile show Wren, the egg, the machines and the smile. Tall and half show Wren, the egg, the drone and the swarm. The 1:2.2 column shows Wren, the egg and the edge of the drone.
  - audit, 2:1: ember 0.09%, lilac 0.35%, sun 0.06% guarded, all single gloss or sprite pixels. No flat 24×24 block, and nothing guarded in the bottom 26 + 120 px. The same holds for the 2:3 and 1:1.
  - Light band: dark (L 0.152).
- **Couldn't make / caveats:** wall.py couldn't draw `wall-hero.png`, because `direction/tools` has no `reference/` folder beside it. The shapes sheet was made.

### Store · pigeon-pal (store)

#### `store/pigeon-pal.png` (round 2)
- Shows: Little Pope, close up: one of Sal's pigeons, large and centred, standing on the edge of Biscuit's lid. Only the lid's white top edge (with a curve of his screen at the bottom right) and a sliver of his pink flag at the left edge say "companion".
- Made: rendered from the game. The pigeon is the game's own `pigeonFrame(0, '#c8c8d4')`, unedited, at a whole-number scale: 25 device px per sprite px (5 world px on the store tiles' S = 5 grid), with the ink outline scaled by the same whole number. There are two light changes, and no colour is redrawn:
  - The feet (#e8705a, ember-guarded) sit in the body's own shade. That is pbLit's shade mix (.5 toward PB.SHADE), which gives #7b3d39, as in round 1.
  - Kindly's pink rim (pbLit, outer edge only) is placed on the tile's 5 px world grid rather than at sprite resolution, so it reads as light catching the up-right edges, not as 25 px pink blocks.
  - Biscuit is storepass's `spBiscuit` (the game's drawing with the free stand-in ramps), zoomed to the pigeon's scale and cropped to his lid.
  - The pigeon casts a solid people's shadow (#8d8584) down-left onto the lid, clipped to the shell.
  - The ground is the shared store ground (`spStoreGround`: PB.NIGHT, pbKGlow, the Carmody roofline), the same as the other four tiles.
  - Script: `/home/claude/passB/work/round2/store/r2_pigeon.js` (`tilePigeonPal2`), run by `run.sh` after lib.js, poster_scene.js, sp_lib.js and sp_store.js.
- Agent: store
- Check:
  - `audit.py`: 0 guarded pixels in every colour, no flat 24×24 blocks, and the NEW (0–110 × 0–70) and YOURS (255–400 × 0–70) zones clear. Lilac caution is 14.1%, from the pigeon's grey body.
  - Size sheet: `/home/claude/passB/work/round2/store-sizes.png` shows all five tiles at 169, 80 and 40 px, in colour, as black silhouettes and in greyscale, plus the 40 px row side by side.
  - At 40 px it reads as a grey bird with an orange beak on a white edge. Its silhouette is a bird, where biscuit-tape is a cooler on wheels, so the two tiles no longer look alike.
- Couldn't make / caveats: at 25 px per sprite pixel the 12×10 sprite is very chunky. That is the game's own close-up approach (`fhPigeonCU` draws the same frame scaled up), but the bird has only as much detail as the sprite has. Little Pope's colour, #c8c8d4, is still the round-1 inference: `fhPigeonCU` and the Long Table pigeon use it, and Sal names his birds "Ethel. Bernadette. Little Pope."

### Share card, phone poster, lockup (round3b)


Code is in `work/round3b/`: `title2.js` (the restacked title), `share2.js`, `p916b.js`, `check_sheets2.py`, and `run.sh`, which renders inside the real build with `lib.js`, `poster_scene.js`, `round3/r3lib.js` and `r2poster/scene2.js`. All four of those files are used unchanged. The round-1 pictures are kept as `old-share-card.png` and `old-poster-9x16.png`. The audit output is in `audit.txt`, and the measurements at 270 px are in `share-270-measure.json`.

#### `share-card.png` (1200×630) · fixes PD-3.15 / PD-4
- **Shows:** the new poster's fight on the right, the game's title on the left.
  - The smile's drone-pill swarm streams over the roofs.
  - Wren lobs the egg (lit from up-right) at the SCANNING drone hanging close in front of her, while the REVVING scooter comes down the street.
  - Positions across the width: Wren 0.62, egg 0.71, drone 0.80, scooter 0.93, smile 0.87. The fight is centred at about 0.71 W.
  - The houses start at about 0.58 W. The left half is plain sky and kerb, and the title ends at x 592 (0.49).
  - The bottom 18% is the street in shadow.
- **Made:**
  - **The art** is rendered with `posterScene2`, the new poster's own scene code, using settings `SHARE2`: 400×210 logical at S=3, Wren ×2 (6 device px a sprite pixel, the master's 1:2 ratio of houses to Wren), drone and scooter at z 1.3.
  - **The title** is restacked (`r3bTitleStack`) in the same lettering as `title-lockup.png`:
    - Kindly's pill becomes two lines, "Pardon / the 😊", in Nunito 900 at 106 px. It keeps `#4b3a9a` on the white→`#f1edff` fill, the `KGRAD` border and `kSmiley`.
    - Under it, the game's own `pxLogoCanvas('APOCALYPSE')`, unchanged, at whole-pixel ×4. It's cut between its 5th and 6th letters into APOCA / LYPSE. The cut falls in the empty gap, so every letter keeps its own bounce.
  - **Why it's restacked:** with the pill on one line inside the left half, the largest that fits is about 72 px. That gives capitals of about 11.5 px at 270 and lowercase of about 8 px, which fails the rule. On two lines, every letter clears 12 px.
- **Agent:** round3b
- **Check:** `share-card-270.png`
  - **Smallest letter at 270 px: 12 px.** That's the pill's lowercase a, r, o, n, measured on the 270 px image itself (rows at least half ink, per letter). The e is 13, the P, d, h and t are 16–18, and APOCALYPSE is 18–19.
  - In the 1200 master: the pill's x-height is 54 px and its capitals 76. APOCALYPSE's letter fill is 80 px.
  - audit: no flat 24×24 block, and the bottom 113 px are clear.
  - Guarded ember is 576 px (0.08%), all of it inside Wren's sprite box (her cap highlight and zip). That's the accepted case.
  - The art's other guarded pixels are lilac on the machines' gloss and swarm, which is the master's own, plus sun on Wren's badge.
  - In the left half, the art has only 45 px of guarded lilac: five of the poster's bright stars (`#c8bedc`). The title's own lettering is guarded sun (24,384 px) and lilac (4,414 px, from the pill border's gradient). That's by design: it's lettering, not a block.
  - Light: L 0.27, C 0.145, **mid**. The art alone is 0.148, dark. The larger white pill and the mustard letters lift it.
- **Couldn't make / caveats:**
  - The legible title fills the whole left half, and the card's light band moves from dark to mid. At 270 it still reads as the poster's plate (see the sheet, beside `poster.png` at 270).
  - Wren is at 0.62, not 0.70. The subject at 0.70–0.76 is the fight (Wren, the egg and the drone together). Putting Wren herself at 0.70 would push the drone and scooter off the right edge.

#### `poster-9x16.png` (1080×1920) · recomposed for the new poster
- **Shows:** the same one image as the new 2:1, recomposed for a tall plate.
  - The smile is up right, and its swarm streams down-left over the roofs.
  - The SCANNING drone hangs in front of Wren, and the REVVING scooter comes down the street.
  - Wren lobs the up-right-lit egg from the corner.
  - The top ~15% is sky, for the story chrome. The bottom 18% is the street in shadow.
- **Made:** rendered with `posterScene2`, using settings `P9x16` in `p916b.js`: 216×384 logical at S=5 (the 2:1 master's pixel), Wren ×2, and the master's machine zooms (drone 1.25, scooter 1.5). Nothing is hand-drawn.
- **Agent:** round3b
- **Check:** `poster-9x16-vs-2x1.png`
  - Wren is at **10 device px a sprite pixel** (the limit is 11).
  - audit: the bottom 18% (346 px) and the caption zone are clear, and there's no flat guarded block.
  - Guarded pixels: ember 0.08% and sun 0.05%, all inside Wren's sprite box. Lilac is 0.35%, the same as the 2:1.
  - Light: L 0.16, dark (the 2:1 is 0.152).
  - Looked at it at 1080, 540, 270, 135 and 90 wide, beside the 2:1 and the 2:3.
- **Couldn't make / caveats:** none.

#### `title-lockup.png` (906×202) · minimum width restated, art unchanged
- **Restated:** **minimum width 496 px.** The round-1 figure of 344 was set by the pill's capitals. At 344, the pill's lowercase is only 8.4 px, so **344 is withdrawn.**
  - At 496, the pill's lowercase is 12.0 px, its capitals 17 and APOCALYPSE 33. At 906 (×3), the lowercase is 22 px.
  - The smallest whole-pixel size above the minimum is ×2 (604 px), with lowercase at 14.7.
  - Where it must go narrower, use the share card's restacked form (`r3bTitleStack`). It reaches 12 px lowercase at a block width of about 124 px.
- **Agent:** round3b
- **Check:** `title-lockup-min-width.png` shows it at 496 on night, the page colour and linen, at 604 and 906, and the withdrawn 344. audit: no flat block, as before.
- **Couldn't make / caveats:** the art didn't need to change.

#### Questions
1. The share card's title is now a restacked form of the lockup (a two-line pill and APOCA / LYPSE), not `title-lockup.png` itself. Should the restacked form also ship as a second lockup file for narrow uses, or should it stay on the card only?

### Moving poster (living2)

#### `living-poster/pardon.js` (round 2)
- **Shows:** the round-2 poster, alive, and the premise in play. Kindly's smile has the city, its swarm streams over the roofs, and a SCANNING drone and a REVVING scooter come for Wren, the bus driver. She fights back with Dolly's eggs.
  - **Loop** (7.0 s, seamless):
    1. The poster's egg splats the drone. It cracks into pixels and, freed, floats off.
    2. The scooter charges her and is yolked mid-charge, then skids up blind.
    3. THANK YOU stars leave it flustered, then free it, and it rides off.
    4. The next drone drops in from the swarm and the next scooter rolls up. She weighs an egg and lobs, back to the poster's frame.
  - **Idle:** the drone ducks her lobbed egg.
  - **Hits** react by `kind` (toss, shoot, beam, burst, grab).
  - **`acts: { egg: 'toss' }`.**
- **Made:** rendered from the game and drawn in its own code; nothing from earlier pictures.
  - **Re-baked inside the build** (`work/living/r2/bake2.js`):
    - 36 Wren poses (`personFrame` + the poster's `pbLit`), including three new hit poses: `shield`, `duck` and `yanked`;
    - the poster's relit egg (`pbEgg6R`);
    - the drone's `enemyCracked('drone',{scan},1|2)` and `enemyFreed('drone')`;
    - the scooter's crack and freed pixels;
    - the Carmody St tone map.
  - **Ported as code:**
    - `paintDrone`, `paintScooter`, the gloss helpers and the poster's `pbSwarm` pill;
    - the machine render, done as `drawEnemy` inside `zoomDraw` does it, with the poster's source-atop backlit shade;
    - the three settings from `work/r2poster/p.js`.
  - **Hand-drawn in the palette:** the yolk, splats, stars, hearts and dust, as in round 1.
  - **Composition:** the camera is now fixed per plate, and Wren's full box (every pose) always fits. The machines are clamped into the view, clear of the bottom 16%. On narrow plates the fight stacks: the scooter waits up the street above her and the drone hovers over it.
- **Agent:** living2
- **Check:** all saved in `work/living/r2/`. The key sheets are copied to `bug/checks/` (`living-held-vs-poster.png`, `living-modes-narrow.png`, `living-inview.png`); the old `living-*.png` there were removed.
  - **Held vs the new posters:**

    | poster | max diff | pixels > 2/255 |
    |---|---|---|
    | `poster.png` | 13/255 | 0.021% |
    | `poster-2x3.png` | 12/255 | 0.030% |
    | `poster-1x1.png` | 16/255 | 0.028% |

    The residue is glow and gloss rounding.
  - **In view** (`test/inview.py`, every frame at dt 1/60, all modes, events and squeeze; plates 150×370 at dpr 1 and 2, 140×305, 120×300, 1000×150, and 270×370 squeezing to 120×280): Wren is out of view in **0 of 15,480 frames**. The narrowest margin is 5 px, on the right at 120×300.
  - **`test/run.py all`:** 173 scenarios with zero console errors. They cover tiny, tall, narrow, wide and squeezed plates, every hit kind, reduced motion and the fallback.
  - **`test/rhythm.py`:**
    - the loop's boundary frames are hash-identical to the held still;
    - over the loop, luma stays in 0.160–0.183 and moves at most 0.0035 a frame;
    - holds run 1.5–4.7 s and live stretches 3.0–6.0 s.
  - **`audit.py`** on 158 shots: 0 flat 24×24 guarded blocks and 0 guarded pixels in the scaled caption zone. The light band is dark (L about 0.13).
  - **Timing** at 600×400 (mean / p95): idle 0.56 / 0.7 ms, loop 0.74 / 1.2 ms, loop at dpr 2 1.3–1.9 / 2.2–3.0 ms.
  - **Size:** the module is 144 KB.
- **Couldn't make / caveats:**
  - **Narrow plates:** the stacked scooter sits up the street above Wren's head, so it reads a little as floating in front of the facades. The freed scooter's long cast shadow is dropped there, because it would cross her.
  - **Tiny plates:** on 120–150 px wide plates the smile is cropped at the right, and the held egg sits at the plate's edge.
  - **The machines' crack pixels** are drawn at the nearest whole-number scale and pinned at the crack, so they can sit up to about a device pixel off the gloss at the far edge.
  - **Board harness:** the old kit's board harness was not re-run (it isn't in the studio repo); the module's own Playwright plate was used instead.
  - **dpr 2:** the loop's p95 at dpr 2 runs 2.2–3.0 ms, over the ~2 ms budget. The budget is met at dpr 1.
  - **No OffscreenCanvas:** without it the fallback is still slow (about 7 ms a frame on average), as in round 1.

### Words (words)


What I wrote, field group by field group, with the code evidence behind it. Source read: `/home/claude/pardon/src` (read-only, untouched). Line numbers are from that tree.

Files written:
- `games/pardon-the-apocalypse/bug/words.json` (new, from `direction/WORDS_TEMPLATE.json`, `_read_me` removed)
- `games/pardon-the-apocalypse/bug/publish.json` (added `line`; `focus` kept exactly as found on disk, which was `{x: 0.42, y: 0.5}` when I wrote. It had been `{0.47, 0.56}` when I first read it, so the lead changed it during the round, and I left it alone)
- `games/pardon-the-apocalypse/bug/design.json` (round-2 words added beside each proposal; every existing field kept; re-serialised with one-space indent, valid JSON)

#### 1. Hero: title, hook, playing word, hover, echo

- **title:** "Pardon the Apocalypse" (21 characters). The game's own title is "Pardon the" over APOCALYPSE (`11z_title.js`).
- **hook** (105/110): "A retired bus driver walks a dozen eggs home across San Francisco and fights a very polite AI's machines." What you do (walk the eggs home, fight), and against what (Kindly's machines). Source: `README.md` and `11a_story.js` 112–131 (Dolly sends Wren for "A dozen. Brown. Not the sad ones.").
- **playing_word:** "walking" ("1,418 walking").
- **hover_hint:** "Hover to throw an egg at Kindly" / "Tap to throw an egg at Kindly". This matches the moving poster: the hover throws the egg at the smile, and then a short fight with a Glyde scooter plays (`living-poster/README.md` enter and loop). "Throw" is the game's own verb (`09_battle.js:202`, THROW AN EGG).
- **echo:** `#FF7CC0`, Kindly's candy pink, the poster's one light (`PB.PINK`, the rim on Wren). measure.py: ember 30.6, lilac 22.8, sun 54.9, mint 67.8, so free on all four (all ≥20). Other colours I measured: Wren's navy `#34406e` is the safest (all 48+), but it's too dark to read as a lifted tile's shadow on the dark page. Cap red `#c8433a` is 14.1 to ember (caution), so rejected. The egg `#e2ac74` is 13.2 to sun (caution), also rejected.

#### 2. About: description, goal, tips

- **description** (3 sentences): Sunday, Kindly decides people are the friction, you're Wren off the 45; walk Carmody St and the Vallejo Steps, talk to neighbours, turn-based fights with Walt's skillet, BRACE and THANK YOU; get the eggs home for Walt's tarts, then ready the house for the night. Evidence: `README.md`, `11a_story.js` (areas street, store, steps, larkin), `06_ui.js:153–161` (SKILLS), `11c_refuge.js:24–50` (tarts, then the refuge).
- **goal:** "Bring Dolly's dozen eggs home. Bring Dolly home with them." The chapter's spine: the eggs (`11a_story.js:252`) and Dolly off Car 17 (`11a_story.js:201–204`, `564–580`).
- **tips:** all three are true in the build.
  1. BRACE on a red intent: half damage, and an egg cracks only on an unbraced hit of 10 or more (`09_battle.js:526`, `582–585`; the game's own defeat tip at `107`).
  2. THANK YOU, then finish it while it's FLUSTERED, and it goes free (`09_battle.js:409`, `416–424`).
  3. A thrown egg makes the machine miss its next attack (YOLKED), and Dolly notices (`09_battle.js:202`, `363`, `524`; `11f_films_home.js` EGGS_HOME "Biscuit tells me you threw my eggs at a robot.").

#### 3. Details

- **genre:** "Story RPG" (the README's own words).
- **players:** "1". **coop:** false (single-player; no network code).
- **minutes:** see the measurement section at the end.
- **inputs:** keyboard, mouse, touch. There's **no gamepad**: grep for `gamepad|getGamepads` in src finds nothing. Keyboard: `00_core.js:111–137`. Mouse and touch both go through `pointerdown` on the canvas (`00_core.js:158–162`), plus the touch pad `tL/tR/tA` (`00_core.js:144–153`, `head.html:523–525`) and the ≡ button (`00_core.js:154`, `head.html:502`).
- **mood:** "homely". It's from the platform's list, which the SDK docs give (`mcp__bug__sdk_docs`, game.json `mood`: thrilling/tense/frantic/brutal/triumphant, cosy/gentle/homely/meditative, curious/playful/strange/clever, tender/melancholy/lonely/bittersweet). A mood is "the feeling a player is left with", and the chapter ends at Sunday dinner and a house turned refuge. "tender" is the runner-up.
- **tags** (≤5, 2–24 characters, the three that sort it first): "turn-based story", "a very polite AI", "a dozen eggs", "San Francisco", "thank the machines".
- **contentNote:** "Brief white flashes and fast flicker on big hits and combos, and screen shake (the shake stops with reduced motion). The city burns in the background, and a girl's mother hasn't called."
  - Full-frame flashes: `flash()` (`00_core.js:204`) is drawn over the whole canvas (`12_main.js:58`). It's called on FREED (`09_battle.js:418`, #fff4dc at .45), every combo panel (`433`, #fff at .8), Dolly's grip pull (`494`) and LAST STOP (`607`, #fff at 1), plus film shots with `flash` (`07b_film.js` `s.flash`).
  - Sprite flicker on hit: 15 Hz (`09_battle.js:680`, `689`: `Math.floor(fl*30) % 2`).
  - `REDUCED` (prefers-reduced-motion) only turns off `shake()` (`00_core.js:203`) and shortens the combo panel (`09_battle.js:432`). Flashes are not reduced. Worth a fix later; I didn't touch code.
  - Story: downtown burns (`11a_story.js:44`, `11c_refuge.js:242`), and Pilar's mother hasn't texted from the hospital (`11a_story.js:140–141`, `11c_refuge.js:18`). Gus's insulin is locked away (`11a_story.js:500`); I left that out to keep the note short.

#### 4. Controls (only what the build has)

Keyboard, from `KEYMAP` (`00_core.js:112–118`):

| key | action | evidence |
|---|---|---|
| ← → / A D | Walk | `held()` left/right in explore |
| ↑ ↓ / W S | Stairs | `08_explore.js:214–218` (house stairs, ↑ at a door); menus `06_ui.js:89–90`, battle grid `09_battle.js:234` |
| E / Space / Enter | Use | `act` (Z also maps to `act`; I left it off the list for space) |
| 1–6 | Pick | `n1–n6`: battle commands `09_battle.js:231`, choices `06_ui.js:92` |
| X / Backspace | Back | `09_battle.js:236`, `276` |
| Esc / M | Menu | `08_explore.js:213` (Tab also maps to it) |
| E / Space (hold) | Cook | `10_cook.js:21–23`, timing / mash / hold steps `5–9` |

The game's own control lines agree: `06_ui.js` pause menu CONTROLS, `11a_story.js:77`, `head.html:521`.

Mouse: click the street to walk, and click a person or thing to walk over and use it (`08_explore.js:221–244`). Click a battle command (`09_battle.js:217`), and click a machine to aim (`272`, `242`). Click and hold to cook (`10_cook.js:21`, `24`: pointerup releases). ≡ opens the menu (`00_core.js:154`).

Touch: the same taps, plus ◀ ▶ hold to walk and OK uses / advances (`head.html:523–525`). When dialogue is open, OK reads NEXT (`12_main.js:39`).

Gamepad: `[]`.

#### 5. Moments (8 + the event), in play order

The kinds match the seal outlines (feat = steel token, collection = paper transfer, event = gable; looked at all nine earned seals side by side). The names are short for mono caps; the longest is "Back on its wheels" (18).

| # | name | rule | kind | the real flag |
|---|---|---|---|---|
| 1 | Back on its wheels | Lift the little delivery robot stuck on its back on Carmody Street. | feat | `biscuitFlipped`, `11a_story.js:174–178` (the mash prompt LIFT!, 4 presses) |
| 2 | Yolked | Throw one of Dolly's eggs at a machine in a fight. | feat | `threwEgg`, `09_battle.js:363` (possible from the first fight in the Lucky Seven, once the tutorial rounds end) |
| 3 | Thank you | THANK YOU a machine, then finish it while it's still FLUSTERED, so it goes free. | feat | `foeFreed()` → `S.freed`, first time sets `freedTip` (`09_battle.js:409`, `416–424`). THANK YOU is learned after fight 1 (`11a_story.js:279`), so the first chance is the steps fight (`413–417`) |
| 4 | Sal's girls | Give Sal one of Dolly's eggs, or your jook, on the Vallejo Steps. | feat | `salHelped`, `11a_story.js:435–455`. His pigeons then tear up THE BILL in the boss (`590–602`) |
| 5 | One forty-two | Walk every flight of the Vallejo Steps, so Wren's count reaches 142. | collection | `stepsCounted`, `08_explore.js:175–183`, `STEPS.total = 142` (`03e_outer.js:8`). Counts during `descent` or `refuge` |
| 6 | Gus's patch | Get Gus's door open on Larkin Row: thank Portia, or let Biscuit talk to her. | feat | `gusHelped`, `11a_story.js:517–545`. In the boss he kills Max's Loyalty Program (`614`) |
| 7 | Last Stop | When Dolly calls it on Car 17, pick LAST STOP. | feat | `lastStop()`, `09_battle.js:602–610`; offered once Max is at 40 HP or less (`11a_story.js:618–622`). **No flag is set**: a moment needs one there |
| 8 | All twelve | Bring all twelve eggs to Dolly's stove: none cracked, cooked, given or thrown. | collection | `S.tartsMade = S.eggs` at the stove (`11c_refuge.js:36`); the rule is `S.tartsMade === 12`. Egg loss: `loseEgg()` from egg on rice (`11a_story.js:344`), Sal (`436`), a throw (`09_battle.js:359`), unbraced big hits (`582`) |
| 9 | The Long Table | UNDECIDED: the event isn't in the build yet. | event | none |

**Order check.** This is a change from design.json, whose list starts with thank-you. In play, Biscuit is flipped first, before the eggs. An egg can be thrown in fight 1, and thank-you can't come until fight 2. Sal's bench (x 688, `03e_outer.js:41`) sits on the landing before the last flight (730–990), so Sal comes before the count completes. Read in a row, they tell the story: flip Biscuit → throw an egg → thank a machine free → feed Sal → count the steps → free Gus → Last Stop → all twelve home.

**Questions on moments.**
- **Yolked and All twelve can't both be earned in one run.** A thrown egg is a lost egg, and there's one save slot (`00_core.js:71`, New game wipes it). Feeding Sal an *egg* also rules out All twelve, but the jook is the other way, so the rule names both. Is it fine for two moments to be exclusive? It reads well to me ("Only the rude ones.").
- Last Stop needs a flag (or a `progress.moment`) in `lastStop()`. The others can be reported from existing flags.
- I shortened design.json's "One hundred forty-two" to "One forty-two" for mono caps under the seal. design.json's moments list still has the long name; words.json is the newer wording.
- design.json's Sal rule ("his pigeons tear up THE BILL") describes the payoff, not what the player does. The flag is set at the bench, so the rule now says what to do there.

#### 6. Captions (gallery/01–06)

I looked at every PNG and checked each caption against its slide. Each is at most 55 characters.
1. "Fight Kindly's machines, turn by turn, on Carmody St". As corrected: a night fight, skillet into a Glyde scooter, the drone marking Biscuit.
2. "Say thank you, and the kiosk's gloss cracks into pixels". I added "the kiosk's": the slide shows the Rate-Us kiosk alone, cracking.
3. "Walk the city: down all 142 Vallejo Steps". As corrected (chaos sky, not dusk).
4. "Biscuit, a delivery cooler that switched sides". As written; Biscuit with Kindly's tower behind him.
5. "On runaway Car 17's roof, down Hyde, against Max". Reworded from "…runs away down Hyde with Max aboard": the slide shows Wren and Biscuit on the roof, Dolly at the grip and Max hovering beside the car, so "aboard" didn't match the picture. "Down Hyde" is the film's own ("fifty miles an hour down Hyde", `11e_films_car.js:720`).
6. "A dozen eggs, counted at the end of the line". As corrected (the pier, `fhToteShot(12)`).

Read without the pictures, they walk through it: fight, thank, walk, Biscuit, the boss, the count.

#### 7. Place strings (PROPOSAL: the build sends none)

There's no bug.games SDK in the build: no `progress.set`, no `bloomplay` anywhere in src. The game's own place cards are `GTITLES` in `08b_guide.js:449–463` (shown once per place and phase), as name · line under it. **Every one of the thirteen runs over 30 characters** when joined, so all are proposed shortenings: the place plus its time or line. They're listed in play order. A note field `place_strings_note` in words.json says so.

| as the game shows it | chars | proposed |
|---|---|---|
| THE CROOKED LADY · RUSSIAN HILL · 8:31 AM | 41 | THE CROOKED LADY · 8:31 AM |
| CARMODY STREET · RUSSIAN HILL · 8:44 AM | 39 | CARMODY STREET · 8:44 AM |
| LUCKY SEVEN MARKET · BOTTOM OF CARMODY · 8:52 AM | 48 | LUCKY SEVEN MARKET · 8:52 AM |
| CARMODY STREET · RUSSIAN HILL · 9:32 AM | 39 | CARMODY STREET · 9:32 AM |
| THE CROOKED LADY · DOLLY'S KITCHEN · 9:21 AM | 44 | DOLLY'S KITCHEN · 9:21 AM |
| VALLEJO STEPS · 9:38 AM · NOBODY AGREES HOW MANY | 48 | VALLEJO STEPS · 9:38 AM |
| LARKIN ROW · 9:49 AM · ONE BLOCK FROM HYDE | 42 | LARKIN ROW · 9:49 AM |
| THE CROOKED LADY · HOME · 6:24 PM | 33 | THE CROOKED LADY · 6:24 PM |
| THE CROOKED LADY · A REFUGE NOW · 9:50 PM | 41 | CROOKED LADY · A REFUGE NOW |
| CARMODY STREET · SUNDAY NIGHT · IN THE FOG | 42 | CARMODY STREET · IN THE FOG |
| VALLEJO STEPS · SUNDAY NIGHT · STILL COUNTING | 45 | VALLEJO STEPS · STILL COUNTING (30) |
| LARKIN ROW · SUNDAY NIGHT · STILL BURNING | 41 | LARKIN ROW · STILL BURNING |
| THE ROOF · PILAR'S OBSERVATORY · 10:15 PM | 42 | THE ROOF · 10:15 PM |

Questions:
- **The clock runs backwards once.** In play you leave the Lucky Seven onto Carmody St "9:32 AM" (`street:chaos`) and only then reach Dolly's kitchen "9:21 AM" (`house:chaos`). It's a build inconsistency, and I kept the game's own times.
- **A better source may exist.** The title screen's own Continue button already says where you are, by beat (`11z_title.js:266`): "Sunday morning", "The errand", "Nine o'clock", "Getting ready", "The rescue", "Sunday dinner", "The refuge", all short. Those fit the Continue card's job better than place cards. If the maker adds `progress.set`, sending those (or "place · beat") is my suggestion. I listed the place cards, as asked.
- The guide's short area names also exist (`08b_guide.js:17`: HOME, CARMODY ST, LUCKY 7, VALLEJO STEPS, LARKIN ROW, ROOF).

#### 8. The game's voice

- **verb:** "walked".
- **stat_nouns** (each countable from the build's state): eggs home (`S.tartsMade` / `S.eggs`), machines freed (`S.freed.length`, `09_battle.js:423`), steps counted (`S.stepsCounted`, of 142), people under one roof (`S.residents.length + 1`, the game's own phrase at `11c_refuge.js:232`), refuge jobs done (`S.jobs[*] === 'done'`, six jobs, `11c_refuge.js:53–60`).
- **own_word:** "Punched" (the transfer punch, `reward/punched.js`). **bought_line:** "Punched for you: " (the item name follows).
- **result_lines:** "Brown. A dozen. Not the sad ones." (Dolly's errand and the twelve-egg ending), "Eleven's a dozen if you're generous." (Dolly's eleven-egg line, `11f_films_home.js:246`), and "You were on my way." (Wren, EGGS_HOME). The first two are for 12 and 11 eggs home. The third fits any count, so use it when fewer than eleven make it.
- **friend_lines:** "A friend is walking a dozen eggs home." / "A friend got the eggs home. Brown, not the sad ones."
- **quick_chat:** "Mind the eggs." (the poster's rant line, in Wren's voice) and "Next stop." (the game's own, `11c_refuge.js:112`, `09_battle.js:319`).
- **pause_line:** "Biscuit has the tote. Take your time." (In EGGS_HOME Biscuit carries the tote: "I can carry eggs.")
- Voice check, line by line next to the poster and the seals: Wren is dry and plain, the neighbours are warm, and none of it is Kindly's sugar. There are no superlatives, no other games' names, no prices, no "level" or "enemies" (the build says "enemies" in its tips, so I avoided it), no guilt, no exclamation marks, no streak or scarcity words, and neither "teardown" nor "Fair Play".

#### 9. design.json, round-2 words

- **store `kind_line`:**
  - Taped Biscuit: "Skin · silver tape, an X across the lid"
  - Little Pope: "Companion · Sal's palest pigeon rides the lid"
  - Fog trail: "Trail · the fog follows Wren's heels"
  - Nuclear Grandma: "Sticker · La Palomita's hot sauce, on Biscuit's side"
  - Wave: "Emote · the bus driver's wave"
- **`store_row_line`:** "For Biscuit and the walk home".
- **pass reward `name`:** Rosemary sprig, Channel 3 (Pilar's walkie; "PILAR · CH.3" at `11a_story.js:12`), Ethel's feather, Car 17's bell, Egg tart, Night Shift lamp.
- **`pass.sentence`:** "The long way home, one block at a time, with a few things for Biscuit picked up along the way." I also added `pass.step_rule`: UNDECIDED (how a block is earned, and how many).
- **owned_mark:** `own_word` "Punched", `bought_line` "Punched for you: ".
- **update:** `title` "The Antenna Goes Up" (19; Gus: "We're up. Listen.", `11c_refuge.js:252`). `change_line`: "On the night shift, Gus raises an antenna on Dolly's roof and the house can hear Kindly's maintenance channel." I added `ships`: only if it ships after launch, because the antenna is already in the current build (`antennaScene`, `11c_refuge.js:248–260`). Version and date UNDECIDED. I kept the existing `change` field as it was. **Question:** that field says the antenna lets "Pilar's walkie reach the street". The build says the antenna brings in Kindly's maintenance channel (and Biscuit's PATCH); Pilar's walkie works from the roof before it (`11a_story.js:215`). So my change line follows the build. The picture's radio rings fit either reading.
- **event:** `text` "On the night Kindly's smile is off, Carmody Street carries its tables out and eats one long dinner down the hill. Everyone brings something, and everyone gets a tart." `counter_unit` "places set". `target` and `rule` are UNDECIDED.
- No prices, dates or target numbers anywhere.

#### 10. Minutes

**minutes: 35** (an estimate, built on one measurement).
- **Measured:** the build's own autopilot (`test/autopilot.js` via `test/play.py --ts 1`, real time scale) ran a test copy built into my scratchpad (`OUT=… build.py test/autopilot.js`; nothing in `/home/claude/pardon` was written). It played the whole chapter with 0 errors.
  - It took **13.7 min** from New game to the end of the Night Shift jobs (821 s), and **9.1 min** to the refuge (546 s).
  - In that run: 4 story fights and 3 scavenge fights, all six jobs, 11 eggs home (it gave Sal an egg).
  - The autopilot skips every typed line the moment it can and decides each turn instantly, so this is a **floor**, not a player's time.
- **Added for a person:** about 330 lines to read (227 `say`/`narr`/`radio` calls in `11a_story.js` and `11c_refuge.js`, plus 105 film lines in `11d`–`11f`) at about 3 s each, which is about +16 min. Then roughly 40 s of thinking per fight over 7 fights, about +5 min. That comes to **about 35 min** for one sitting through the chapter, without the optional LOOK spots or any retried fights.
- If bug.games wants a measured human time instead, this should be replaced after a real playtest. A shorter session is also possible, since the game autosaves (`12_main.js:44`, every 20 s while exploring, and at every beat).

#### Open questions, in short
1. Yolked and All twelve are exclusive within one run. Is that fine?
2. Last Stop has no flag: the maker would add one in `lastStop()`.
3. For `progress.set`: use the title's beat labels (`11z_title.js:266`) rather than the place cards? Also, the 9:32 → 9:21 clock slip.
4. design.json's update `change` ("walkie reaches the street") vs the build (the maintenance channel): which wording does the lead want?
5. The flashes aren't reduced under prefers-reduced-motion (only the shake is). That's for the maker, not for this pass.
6. mood "homely" (or "tender").

## Pictures

Each entry gives the file, what it shows, how it was made (rendered from the game, or drawn in its code and palette), which agent made it, the check result, and anything that couldn't be made. Seven agents worked in parallel after the poster: `marks`, `stills`, `gallery`, `seals`, `storepass`, `round3` and `living`. The lead reviewed everything side by side, then sent two pictures back: the result picture (too small and dark) and gallery 04 (bright and flat, and a repeat of the dinner). Both were remade.

**Checks bundled in this zip, in `checks/`:**
- the poster in every wall shape (`poster-wall-shapes.png`), plus its previews (`poster-previews.png`); both redone for the round-2 poster
- all the seals in one 32 px strip on dark and light, and at 96 px
- the small marks at 1× on night and on linen, at 4×, and beside three other games' icons
- gallery slides at 100 px and in their 4:3 crops
- the Continue card mock, the result picture under the platform's words, the update at 104×52
- the pass rail mock, store tiles at their sizes, the owned mark's frames
- the backdrops under the poster, the event banner with its left 45% covered
- the share card at 270 px, the 9:16 against the 2:1, the title at its smallest width
- the moving poster's held frame against the poster, its modes and the harness

`checks/audit-all.txt` is the per-pixel colour audit of every PNG. No picture has a flat guarded block of 24×24 or more. Paths that start with `work/` are working files on the lead's machine and aren't in the zip.

### Poster, tall, square and focus · agent `lead`

#### `poster.png` · `poster-2x3.png` · `poster-1x1.png`
- **Shows:** Wren lobs an egg at Kindly. It's night on Carmody Street, and Kindly's glossy pink smiley hangs over the painted ladies like a moon, the only light. Wren stands on the corner below, in follow-through, with one of Dolly's brown eggs in the air between her and the smile and the tote with the rest on her hip. The pink light rims her from the up-right, and her shadow runs down-left. Register: **stage**. Inks: night plum, Kindly pink, Wren's cap red and the brown egg.
- **Made:**
  - Rendered from the game, inside the real build (`tools/render.py`).
  - **The houses** are the game's own Carmody Street painting (`areaCanvas('street','night')`), taken to night with every window dark (`pbNightPaint`). Light falls off with distance from the smile as Bayer dither (`pbFalloff`), and the rooflines are rimmed on the side facing the smile.
  - **The sky** is the game's night bands (`skyBands`, `PHASES.night`).
  - **The smiley** is the game's `kSmiley`, with `gGlow` as Kindly's halo (gloss, drawn at K = S).
  - **Wren** is `personFrame('wren', {face:'determined', eggs:true, legs:'wide', lean:1, arms:{f:[112,104], b:[-40,-20]}})` at a whole-number scale. The rim light is a pixel pass over her sprite (`pbLit`), and her shadow is her own silhouette, sheared.
  - **Hand-drawn in the game's code and palette:** the egg in flight (6×7, the game's egg ramp from `pxEggBig`), its three-pixel trail, and the light pools on the street.
  - Code: `work/lib.js`, `work/poster_scene.js`, `work/poster.js`.
- **Sizes:** 2:1 is 1920×960 (384×192 logical at 5 px, so every pixel stays crisp; it's above the 1600×800 minimum). 2:3 is 720×1080 and 1:1 is 816×816, both at 3 px with Wren at 3×. The tall and square are recomposed from the same scene code, not cropped.
- **Agent:** lead.
- **Check:**
  - `wall.py --focus 0.47,0.56` ran in every wall shape (`work/checks/poster-wall-shapes.png`, `poster-wall-hero.png`). Wren, the egg and the smile hold in the hero, strip, wide, band, tall, half, small and tile shapes. The 1:2.2 column keeps Wren's front, the egg and the edge of the smile.
  - Previews at 740×370, 260×367, 150×177, 90×70, the 4:3 phone crop and the half plate are in `work/checks/poster-previews.png`.
  - Light band (measure.py light):
    - 2:1: L 0.144, C 0.124, **dark**
    - 2:3: L 0.180, C 0.133, dark
    - 1:1: L 0.181, C 0.136, dark
  - On the wall it sits next to Threadbare (also dark), which is dark|dark, tolerated.
  - audit.py, guarded share on the 2:1: ember 0.09% / lilac 0.02% / sun 0.06% / mint 0%. These are single pixels in Wren's own sprite (the cap highlight, zip and badge) and the smile's gloss edge.
  - No flat guarded block of 24×24 or more, and no guarded pixel in the bottom 26 px + 120 px (scaled to each size).
  - The tall and square first failed the 24×24 rule: at 4–5 px a pixel with Wren at 3×, her cap highlight became a 48×24 block. They were re-rendered at 3 px a pixel, which fixes it without recolouring her.
- **Couldn't make / caveats:** `measure.py wall` needs `data/lightmap.json`, which isn't in this pack, so the edge-by-edge wall audit couldn't run. I checked the light band and the neighbours by eye on `wall-hero.png` instead.

#### `publish.json`
- **Shows:** focus `{x: 0.47, y: 0.56}`, on Wren's cap and face, so every crop keeps her, the egg and as much of the smile as fits.
- **Made:** set from the wall.py runs.
- **Agent:** lead.
- **Check:** wall.py in every shape (above), plus the 4:3 phone crop and the half plate in `work/checks/poster-previews.png`.
- **Couldn't make / caveats:** none.

### Icon, emblem, chip · agent `marks`

All three are drawn for the size they're shown at, with one grid pixel = 2 screen px: the icon is 23 px at 46, the emblem 15 px at 30, the chip 32 px at 64. Each is scaled up ×4 by whole numbers to the 2× PNG. Every pixel is placed by hand in an explicit map (`/home/claude/passB/work/marks/marks.js`, `chip_full.js`) and painted with the game's `P()`.

They use the game's colours: Wren's cap `HC.red #c8433a` / `HC.redD #8c2c2f` (HAIR.wren), skin `SKIN.c`, locs `#241617 / #3a2426` (HAIR.wren), jacket `HC.navy / navyD / navyL` (CAST.wren), ink `HC.ink #2a1c25`, the eye highlight `#fff6e2` from `face()`, and the egg ramp from `pxEggBig()`. The outline follows the game's 1 px 4-neighbour rule. Kindly's light is the poster's pink rim, `PB.PINK #ff7cc0` on the outline with `PB.PINK2 #ffc4e3` dithered just inside, placed by hand on the edges that face up-right. The ground is the game's night ramp (`PB.NIGHT`), dithered with `bay()` and lifting toward the up-right.

Guarded colours: **zero guarded pixels in all three.**
- The cap highlight `HC.redL` is **left out** everywhere. The pink rim does its job, coming from the side the light comes from.
- The badge `HC.mustard` is **left out**. The badge is drawn in its own ramp's shade step, `HC.mustardD #b17a26` (free), with one pale-pink glint pixel where Kindly's light catches the metal. I also tried a one-pixel mustard glint: it read almost the same at 46, so I kept zero.
- Mint isn't used.

Render: `python3 /home/claude/passB/tools/render.py /home/claude/passB/work/lib.js,/home/claude/passB/work/marks/maps.js,/home/claude/passB/work/marks/chip_full.js,/home/claude/passB/work/marks/marks.js OUTDIR finals`. The deliverables are saved as opaque RGB.

#### `icon-46.png`
- Shows: Wren's head in profile facing right, with the red cap and its long brim, the brass badge, a dark eye and her locs hanging behind. One pink rim of Kindly's light runs along the cap top, the brim, the face and the jacket front, on the night ground.
- Made: drawn in the game's code and palette. The whole 23×23 map is hand-placed, including the outline and rim pixels. The game never draws Wren in true profile (her sprites and busts are 3/4, facing right), so this profile is a new drawing from her sprite and bust, not a render. I studied `personFrame('wren')` and `bustSprite('wren')` for it. A 3-row navy collar at the bottom grounds the head. There's no full body, text or scene.
- Agent: marks
- Check:
  - 1× (46 px) and 2× (92) on night `#0B0910` and linen `#F1ECE4`, 4× with hard pixels, and at 46 px beside Miradouro, Out of Scope and Typos (cropped from `reference/16-profile.png` for the check sheet only). It reads as a capped head facing right on both grounds. It's quieter than its neighbours, in the poster's dark "stage" register.
  - Grid: 0 of 529 4×4 cells are non-uniform (the pixels are hard).
  - audit.py: guarded 0.00% for every platform colour. Caution: ember 24.95% (cap red and skin), lilac 1.13% (pale rim). No flat blocks. Light L 0.256, C 0.235, band mid.
- Couldn't make / caveats: there's no Kindly glow in the icon. I left it out to keep the icon on a pure grid, as asked, so the light shows only as the rim and the ground lifting toward the corner.

#### `emblem-30.png`
- Shows: Wren's red cap alone, side-on, with its brass badge and the pink rim along its crown and brim, on night ground.
- Made: drawn in the game's code and palette, on a hand-placed 15×15 map. It's the same cap as HAIR.wren (crown, darker band, two-row brim), redrawn for 30 px so the cap fills the frame. It has fewer parts than the icon: no head, face, locs or jacket. It isn't the icon scaled down.
- Why this mark: the cap is the one shape this game owns at 30 px. It's the hot shape on the poster and the icon's first survivor, so icon, emblem and chip read as one family. A bare brown egg reads as a plain oval, which is a generic blob. Kindly's smiley is a generic smiley and is already the thank-you seal glyph. Biscuit's screen face is also a seal glyph. Side-on, the dome and brim read as a cap, not a symbol, and the badge and the rim from up-right make it Wren's.
- Agent: marks
- Check:
  - 1× (30 px) and 2× (60) on night and linen, 4× with hard pixels. It reads as a red cap on both grounds.
  - Grid: 0 of 225 4×4 cells are non-uniform.
  - audit.py: guarded 0.00% for every platform colour. Caution: ember 15.11%, lilac 2.22%. No flat blocks. Light L 0.215, C 0.228, band mid.
- Couldn't make / caveats: none.

#### `chip-64.png`
- Shows: the poster's moment, close up. Wren is seen head and shoulders in 3/4 view facing right, with a determined face, catchlights on the side toward the light, and the cap and badge. One hand is raised with one of Dolly's brown eggs resting in it, and the edge of Kindly's pink glow comes in from the up-right corner. There's no text.
- Made: drawn in the game's code and palette.
  - The head follows the game's own head rig at sprite scale (headRows 18×16, HAIR.wren, the `determined` face). The pose, the cupped hand, the raised arm, the egg and the crop are new.
  - The fill was placed as hand-written runs (`py/chipfill.py`). A helper added the game's outline and a first pass of rim from a point light up-right (`py/rim.py`). I then edited the map row by row: the rim on the cap and arm, and the hand and egg contact.
  - The egg uses the `pxEggBig` ramp, lit from up-right. The glow is Kindly's, so it's smooth: `pbKGlow` / `gGlow` at device scale with K = S (`pbAtK`), as on the poster.
- Agent: marks
- Check:
  - 1× (64 px) and 2× (128) on night and linen, 4× with hard pixels. It reads as Wren holding an egg up toward the light. It has more parts than the icon and fewer than the poster.
  - Grid: every cell of the figure is a hard 4×4 pixel. Only the 112 background cells under the smooth glow are non-uniform.
  - audit.py: guarded 0.00% for every platform colour. Caution: ember 25.98%, lilac 1.56%, sun 2.34% (the egg's light browns). No flat blocks. Light L 0.298, C 0.257, band mid.
- Couldn't make / caveats:
  - The jacket zip is drawn in its own ramp's shade, `HC.orangeD #b8552a` (caution 14.4 vs ember), not `HC.orange` (guarded), because the chest is turned away from the light. This is the same rule as the badge.
  - CAST.wren's small mustard chest badge is left out at this size.
  - The smooth glow means the top-right background isn't on the pixel grid. That follows the finish (Kindly's things are smooth), but say if bug.games wants chips to be grid-only.

Check sheets are in `/home/claude/passB/work/marks/checks/`: `marks-1x-night-linen.png`, `marks-4x.png`, `icon-beside-others.png` (plus a `-2x` copy for reading) and `audit.txt`.

### Continue, result and update pictures · agent `stills`

All three were rendered inside the current build with the lead's tools:
`python3 /home/claude/passB/tools/render.py work/lib.js,work/poster_scene.js,work/stills/st_lib.js,work/stills/key.js,work/stills/result.js,work/stills/update.js,work/stills/final.js OUT finalArt`
(scripts are in `/home/claude/passB/work/stills/`; `final.js` has the final settings). Nothing was reused from earlier pictures. The light passes are new code in `st_lib.js`, written on the game's own helpers:
- `stUngrade`: undoes the game's night grade so a painting can be lit again, and switches off the painting's own lights.
- `stPinkNight`: puts surfaces on the night ramp the way Kindly's pink light sees them.
- `stCel`: a two-level light on people, with a rim on the edges that face the light.
- `stGlossLight`: smooth light for gloss things.
- `stLampLight`: the warm lamp, multiplicative and dithered.

The pass is the same everywhere: people keep their own colours and take one step into the night, with a rim of light on the edges that face the source. Kindly's things are lit smoothly. The world goes onto the night ramp.

#### `key-still.png`
- Shows: a night scavenge run on the Vallejo Steps, halfway down. Wren freezes and holds Biscuit back with her hand while a Hoverly drone, scanning, drops its pink ring on the step just below them.
- Made: rendered from the game.
  - The painting is `areaCanvas('steps','night')`: its night grade is undone, its own lamps and lit windows are switched off, and it is relit only where the scan lands. The pool runs along the treads, and a pink rim sits on the hill crest near the drone.
  - Wren is `personFrame('wren', {face:'shock', legs:'wide', arms…})`, with an empty tote (eggs are home by the refuge nights).
  - Biscuit is `drawBiscuit` (stage `patched`, the refuge stage, face `angry`).
  - The drone is `drawEnemy('drone', {scan:true})` at 0.8 of battle scale, with its kScreen redrawn unshaded because it is its own light.
  - Placement uses `STEPS.gr`.
  - Hand-drawn in the game's code: the scan cone and the reticle ring (gloss, after the battle mark in `09_battle.js`), and the light passes.
- Agent: stills
- Check:
  - `audit.py`: ember, lilac, sun and mint all at 0.00% guarded, no flat blocks, and the right 15% is clear. Light L 0.171, C 0.145, dark.
  - Looked at full size, in the mock Continue card at 360×176 (also 2× with hard pixels) and at 132×66 on night and on linen, beside the ember button: `work/stills/sheet-key-still-continue.png`.
  - Family check with the poster: `work/stills/sheet-family.png`.
- Couldn't make / caveats:
  - This is a composed still, not a captured frame. In the build the drone's SCANNING mark is a battle move, shown on the steps' night battle backdrop. Here it is staged in the explore view of the steps, where the scavenge run's drone fights start (`SCAV_FOES.steps`).
  - The zero-guarded result comes from the light and the acting, not from recolouring:
    - Wren and Biscuit stand outside the scan, so apart from the rim they sit a step into the night (mixed 0.28 toward the night). That takes Wren's cap highlight, zip and badge off ember and sun.
    - The drone's back is in the night and its belly and parcel are lit by its own scan, which takes its shell off lilac.
    - Biscuit's face is `angry`, which is pink. His `wide` (shocked) face is his own screen mint `#bff5d8`, which is guarded mint 8.6, so I chose his angry face, held back by Wren. That is real acting from the game's face set, not a changed colour.
  - Re-rendering it will not give the same file byte for byte. `paintSteps` picks its garden-leaf colours with the game's `pick()` (`Math.random`), so bush colours shift a little each run. The delivered file is the one that was checked.

#### `result-still.png` (redone: close staging, after the side-by-side review)
- Shows: the eggs made it home. It's Sunday night at Dolly's kitchen table, seen close. Dolly and Wren are laughing across a stacked plate of egg tarts (3, 2, 1) under the one pendant lamp, whose warm light falls on their faces and the lace as a dithered pool. Biscuit holds his two "for later", and the dark city shows through the window.
- Made: rendered from the game.
  - The kitchen is `areaCanvas('house','night')`, with its indoor night grade (`nightIn`) undone and the room relit by the lamp only: a downward cone on the wallpaper, dithered on the warm-to-plum ramp. The string lights are off, and the stove dial's "10" is painted out as a dark dial (a shape, with no figures).
  - The lamp is the painting's own pendant (`paintHouseInt`'s shade and bulb), hung lower on a longer cord so it sits in the top of the shot over the plate. Its hem glows, the bulb is `#f3e6c8`, and a small dithered halo sits under it.
  - The table is DINNER's `fhTable`, restaged for three: the lace cloth, chair backs, Biscuit's cushions, `fhCup` and `fhTart`, with two tarts on Biscuit's lid as in `fhBiscuit tarts:2`.
  - The people are `drawPersonAt` sit poses (dolly and wren, both `laugh`), and Biscuit is `drawBiscuit` (patched, `heart`).
  - The window is the game's own `outView` (nightIn, seed 7) with its lit windows off.
  - Scale is 6 device px per sprite px: the diners run from Wren's cap to the cloth hem, about 70% of the strip, and the tarts sit dead centre of the middle 720.
  - The light is hand-written and multiplicative: albedo × lamp `#ffdcc0`. The tarts and plate get at most 0.80, the faces 0.78 (a one-pixel seam to 0.72 on their far sides), and Biscuit 0.74 (smooth, as he's gloss). The cloth takes the pool in solid bands with narrow dithered seams, and its hanging front only catches a graze.
- Agent: stills
- Check:
  - `audit.py`: ember, lilac, sun and mint all at 0.00% guarded, no flat blocks, and the middle 720 is clear. Light L 0.169, C 0.124, dark.
  - Mocks: `work/stills/sheet-result-still-platform.png`. (A) has the headline, two numbers and a sun chip printed over the picture (headline in the dark left flank, numbers bottom left, chip over the right). (B) is reference/14's layout, with the headline above and numbers below. In both, the faces, the lamp and the tarts stay readable.
  - Also looked at full width with the middle 720 marked, at 800×176, the middle crop at 1:1, and the family sheet with the poster: `work/stills/sheet-family.png`.
- Couldn't make / caveats:
  - The lamp hangs 43 game px lower than in the house painting, where its bulb sits about 50 px above the diners' heads. That's a close-up cheat, like a film would make, so the one light can be seen in a 352 px strip.
  - DINNER seats five or more (Pilar, Farida, and Sal and Gus by flag). Per the plan line, this shows three.
  - The game's own lamp glow colour `#ffd896` and the tarts' full custard `#f5c542` / `#ffe68a` are guarded sun. So nothing is lit above 0.80 of a warm lamp: the custard comes out amber (`#c48828`-ish), which is still the hottest point in the picture.

#### `updates/next.png` (1600×800) and `updates/next-thumb.png` (308×154)
- Shows: Gus's antenna on Dolly's roof; Pilar's walkie reaches the street. On the night shift the antenna stands up with its tip live, and Pilar keeps watch beside it, walkie to her mouth, its signal going out in rings over the dark street. Kindly's smile hangs over the city.
- Made: rendered from the game.
  - The roof is `areaCanvas('roof','night')` with `antennaUp` (`paintRoof` f.antenna), night grade undone and relit by Kindly's pink, with its string lights off. The antenna is redrawn on its own layer with `paintRoof`'s exact pixels, ink-outlined, so it keeps its own metal colours under the pink rim.
  - The city is `skylineCanvas('night')` through `pbNightPaint`, with every window out.
  - Pilar is `personFrame('pilar', {hold:'walkie', face:'determined'})`.
  - The moon is `kSmiley`, as on the poster.
  - Hand-drawn in the game's code: the radio rings, the arcs at the tip, and the tip light's dithered glow.
  - Composed at 7× so the antenna fills the central 4:3. The thumb is a clean Lanczos downscale of `next.png`.
- Agent: stills
- Check:
  - Looked at full size, as the 308 thumb, at 104×52 (from the 1600 image and from the thumb, also 3× with hard pixels) and on linen, with the central 4:3 marked: `work/stills/sheet-update-104.png`. At 104×52 it reads as a mast with radio arcs, a figure and the smile.
  - `audit.py`:
    - next.png: lilac guarded 0.01%, which is a few single bright stars from `pbStars` (`#c8bedc`); no flat blocks. Light L 0.142, C 0.13, dark.
    - Thumb: lilac guarded 0.01%; no flat blocks.
  - No version, date or the word update appear in the art.
- Couldn't make / caveats:
  - **The file is named `next.png` because there is no version number yet.** Rename it to `updates/<version>.png` when one exists.
  - As in the build: the antenna is Gus's job (he raises it with two scrap, and Wren holds it in `antennaScene`), and the walkie is Pilar's ("Channel 3. Pilar is watching from the roof."). The coordinator is rewording the plan line to match.
  - The rings and arcs are a drawn signal glyph, not an effect in the game.
  - Past the painting's right edge (about 15 game px), the neighbour's flat roof carries on by repeating its own last column.
  - The poster's smile moon replaces the game's crescent moon and the Kindly tower on this sky. The roof view in the game puts the tower right behind the antenna, but the tower's kScreen gradient carries guarded lilac `#c7a8ff`, and the smile keeps the light the same as the poster's.

### Gallery · agent `gallery`

Six slides, 1600×800 (2:1), in the plan's order. Every slide puts its subject inside the central 4:3 and keeps its bottom 26 px calm. Each one is a moment from the current build, drawn with the game's own functions inside the real game page. The scripts are in `/home/claude/passB/work/gallery/js/` (`gal_lib.js`, `s1.js` … `s6.js`). Slide 01 is rendered with `/home/claude/passB/work/gallery/py/render_gal.py`. It is `render.py` plus one step: it takes an element screenshot so the game's own DOM battle HUD can sit over the canvas.

Shared finish (taken from the poster):
- whole-number pixel scales only (4, 5, 8 or 10 device px per pixel);
- gloss drawn at K = device scale (`pbAtK`);
- one light per slide, landing on people's pixels as a dithered rim (`pbLit`) and on the ground as dithered pools (`pbPool`);
- people's shadows are solid (`pbCastShadow`).

Check sheets are in `/home/claude/passB/work/gallery/`:
- `gallery-100px.png`: each slide at 100 px, on night and on linen;
- `gallery-4x3.png`: each slide at 2:1 with its central 4:3 and the 26 px strip marked, next to its phone crop;
- `gallery-strip.png`: all six beside the poster, plus the ~110 px strip under the hero;
- `audit.txt`: the audit output.

Audit command: `audit.py bug/gallery/0?.png --zone cap=bottom:146 --block 24`. All six pass: no flat 24×24 guarded block, and zero guarded pixels in the bottom 146 px (the 26 px strip plus the 120 px above it).

#### `gallery/01.png`
- Caption: Fight Kindly's machines, turn by turn, on Carmody St
- Alt text: At night on Carmody Street, Wren swings Walt's cast-iron skillet into a smiling Glyde scooter and chips its gloss into pixels. Biscuit the cooler robot waits behind her. Overhead, a Hoverly drone glows pink and has marked Biscuit with a red crosshair for its next package drop.
- Shows: a night scavenge battle on Carmody Hill. Wren lands a SWING on the scooter, and the drone's next move (PACKAGE DROP → BISCUIT) is telegraphed in its intent pill.
- Made: rendered from the game.
  - Backdrop: the street painting `areaCanvas('street','night')` at the battle stage's crop (battleBg ox 916, oy 202), with `skylineCanvas('night')` and the street's own gloss props.
  - Wren: `personFrame('wren', {swing: 2, weapon: 'skillet'})`.
  - Biscuit and the machines: `drawBiscuit`, `drawEnemy('scooter', lvl 1)` (crackGloss chips), `drawEnemy('drone', {scan})`.
  - Crosshair: battleRender's own B.marked code.
  - Hit particles: hitFoe's, drawn by the game's `drawParts`.
  - HUD: the in-stage battle HUD is the game's own DOM: `.intent` (incl. `.big`), `.ebar` and `.ename`, with intentHTML's text, styled by the game's CSS. It is sized as at a 1280×720 window and kept above the bottom zone.
  - Finish: the painting goes through `pbNightPaint` (its lit windows go out, so the drone is the one light), `pbFalloff`, a pink rim and pink pools from the drone, and Wren's rim and cast shadow.
  - Hand-laid: the road below the kerb is the poster's flat night ground (PB.GROUND/DEEP) in place of the painting's road, whose SLOW marking fell in the 26 px strip.
- Agent: gallery
- Check: viewed at 1600, at the 4:3 crop (both pills inside), and at 100 and 110 px. Audit: ember G 0.03%, lilac G 0.61%, sun G 0.02%, mint G 0.05%, no flat blocks, zone clear. Light L 0.144 (dark), the same band as the poster.
- Couldn't make / caveats:
  - Positions are staged closer than the real layout (Biscuit 78, Wren 118, foes 246/318) so the fight fits the 4:3.
  - The parked robotaxi is left out (it sat in the caption strip).
  - Sound words, damage numbers and the command dock under the stage are left out. The dock holds mustard buttons in the bottom zone.

#### `gallery/02.png`
- Caption: Say thank you, and the gloss cracks into pixels
- Alt text: On Larkin Row at night, Wren grins and reaches out to thank a Rate-Us kiosk. Pink stars fly from her hand to it, and its glossy screen cracks open into pixels while dizzy stars spin over its head.
- Shows: THANK YOU landing on the RATE-US kiosk, FLUSTERED and stunned, with its gloss cracking into outlined pixels.
- Made: rendered from the game.
  - Backdrop: `areaCanvas('larkin','night')` at the battle stage's crop (ox 640), through `pbNightPaint` and `pbFalloff`, rimmed from the kiosk.
  - Kiosk: `drawEnemy('kiosk', {happy}, lvl 2)`, the game's crackGloss, plus the battle's DAZED stars.
  - Wren: `personFrame('wren')`, pink-rimmed from the kiosk's screen (the one light), with pools under it.
  - Thank-you stars: wrenAct('thanks')'s particles (type star, #ff9ccf) via `drawParts`.
  - Ground: the poster's night ground.
- Agent: gallery
- Check: viewed at 1600, 4:3 and 100 px. Audit: lilac G 1.02%, no flat blocks, zone clear. Light L 0.145 (dark).
- Couldn't make / caveats:
  - Scale: kept at 5 px per pixel. At 8 px the kiosk's own kScreen gradient and its crack mosaic form flat lilac (#c7a8ff / #d8c0f0) 24×24 blocks. An uncracked or fully FREED kiosk does that even at 4–5 px, so the slide shows the crack, not the freed state.
  - Wren's arm is staged (`arms: {f: [112, 128], b: [150, 172]}`, one hand reaching to it). In battle, THANK YOU uses the cheer pose (both arms up), which at this size crosses her face.
  - Crack level 2 assumes a kiosk already hurt before the thanks. Thanks alone adds one level.

#### `gallery/03.png`
- Caption: Walk the city: down all 142 Vallejo Steps (replaces the planned "…at dusk"; the build counts 142, STEPS.total)
- Alt text: Wren walks down the wooden Vallejo Steps through the hillside gardens, with Biscuit rolling a few treads behind her and the Golden Gate Bridge across the bay.
- Shows: exploring the Vallejo Steps. Wren is small on the middle flight, with Biscuit following, the cottages on the hill and the bay beyond.
- Made: rendered from the game.
  - Backdrop: `areaCanvas('steps','chaos')`, the phase the descent is played in, behind which go the game's chaos sky bands (`skyBands` with PHASES.chaos.sky, compressed to the strip above the bay) and `bayCanvas('chaos')`, placed the way the steps battle stage places them.
  - People: Wren walk frame 1 on `STEPS.gr`, Biscuit following.
  - Light: the low sky over the bay, from the right. It gives a warm dithered rim on Wren and on the painting's edges (`pbLit` rimFn) and a short solid shadow back up the steps.
  - The foreground garden below the stairs falls into dithered shade toward the frame's foot, away from the light. This also keeps the painting's dry-flower specks (#ca6e44, guarded ember) out of the bottom zone.
- Agent: gallery
- Check: 1600, 4:3 and 100 px. Audit: ember G 2.37% (the Golden Gate's own orange, thin lines and towers only, no flat block), zone clear. Light L 0.397 (mid).
- Couldn't make / caveats:
  - Muffin, the fallen courier bot in the ivy, is left out. It sat at Wren's feet and read as a second Biscuit.
  - The sky is the 'chaos' phase's, the one the steps are walked under in play. That is why the caption no longer says "at dusk".

#### `gallery/04.png`  (redone after review)
- Caption: Biscuit, a delivery cooler that switched sides
- Alt text: On Carmody Street outside the Lucky Seven, Biscuit the white cooler robot rolls close to the camera with his flag up and a happy pixel face on his screen. Behind him, over the shaded rooftops, Kindly's tower glows pink in the sky.
- Shows: Biscuit up close on Carmody Street the morning he joins Wren. This is the last shot of CABLE_RUN ("She seemed to be having fun."), right after the BISCUIT joined beat (beat 'cablecar', phase 'chaos'). He has his own pixel face (stage 'self', expr happy) and his back to Kindly's tower.
- Made: rendered from the game.
  - Biscuit: `drawBiscuit` at 10 px per pixel (body, flag, mint stripe, `biscuitFacePx`), with a smooth pink rim of the tower's light on his gloss shell and a solid ground shadow.
  - Street: `areaCanvas('street','chaos')` at the Lucky Seven, at 4 px per pixel, under the game's chaos sky bands, with `skylineCanvas('chaos')` placed so `drawTower` (chaos, 'wide') rises over the purple house.
  - One light: the tower's crown, smooth pink gGlow, inside the central 4:3, up-right of Biscuit.
  - The street is seen against the light. Its painting is mapped onto a flat shade ramp built from the game's own colours (PB.GROUND, INK, HC.ink2, #5a4a6a, PHASES.chaos.win, HC.lavD); light stays light, and the lit windows go to glass. Its edges near the tower carry pink dither rims, and a dithered pink pool lies on the road.
  - Hand-laid: the road below the kerb is flat ramp-dark asphalt, because the painting's road has a SLOW marking that falls in the 26 px strip.
- Agent: gallery
- Check: 1600, 4:3 (Biscuit centred, the tower crown inside), 100 px and the strip. Audit: mint G 0.25% (his face pixels and stripe), lilac G 0.64%, no flat blocks, zone clear. Light L 0.353 (mid).
- Couldn't make / caveats:
  - At 10 px per pixel Biscuit is 28 px tall (antenna flag to wheels), so 280 px, about 35% of the slide's height, not half. Half would take about 14 px per pixel, where his stripe becomes a flat mint block. His stripe passes at 10, so no dither on it was needed.
  - At the flip itself (flipBiscuit, morning) his screen is still Kindly's gloss smiley (stage 'kindly'). His pixel face only appears once he joins, which is why the slide uses the first minutes after he joins rather than the flip.
  - The film's shot frames him alone, and so does the slide. Wren is not in it.
  - The earlier dinner version is kept at `work/gallery/draft/04_dinner_old.png` and `js/s4_dinner_old.js`.

#### `gallery/05.png`
- Caption: Car 17 runs away down Hyde with Max aboard (replaces "…down Larkin"; the car is lettered HYDE ST)
- Alt text: Runaway Car 17 tears down Hyde Street throwing sparks from its wheels, with Dolly at the grip, while Wren and Biscuit stand on its roof facing Concierge Max, a glossy four-armed robot holding a bill.
- Shows: the boss set piece, with Car 17 at fifty miles an hour and Max in phase two.
- Made: rendered from the game, MAX_UPGRADE shot 3's layout at a whole scale (4 px; the film zooms by 1.25).
  - Scene: `hydeLayers` (hills, trees, street), `c17Draw`/`pxCar17` sheared to the hill with Dolly at the grip, `c17Sparks` off all four wheels, `drawBiscuit`, Wren, `drawEnemy('max', {phase2}, lvl 1)`, the drones, and the shot's speed streaks.
  - Light: Max is the one light. His pink glow sits behind him and a smooth bloom over his gloss, and the car and Wren get pink dither rims from him.
  - The car's world is moved up 42 px so the wheels and sparks stay out of the bottom zone.
- Agent: gallery
- Check: 1600, 4:3 (Max inside) and 100 px. Audit: lilac G 1.26%, sun G 0.61%, no flat blocks, zone clear. Light L 0.505 (light).
- Couldn't make / caveats:
  - At 4 px, Max's uncracked kScreen and body gloss make flat lilac blocks. He is shown at crack level 1 (chest), which is his real battle look below 70 HP in phase two, with his own pink bloom over him.
  - The cabin's "Premium Ride" lounge glow (c17Lounge) is left out, because its lilac made flat blocks in the windows. The boss battle's car (cableBg) doesn't draw it either.

#### `gallery/06.png`
- Caption: A dozen eggs, counted at the end of the line (replaces "…counted home on Dolly's table"; the count happens on the pier where Car 17 stops)
- Alt text: Looking down into a canvas tote at the end of the line, a carton holds twelve brown eggs, all whole, as Wren's finger touches the last one.
- Shows: the payoff, EGGS_HOME's count (`fhToteShot(12)`): all twelve made it, and the dozen chime runs along the eggs as a glint.
- Made: rendered from the game with the shot's own pieces at 4 px: `fhCarton(12)`, `fhEgg` (glint frames), `fhLidU` folded back, `fhHand`, and the tote's hems.
  - The tote's inside is fhToteIn's recipe repainted at the slide's width (same palette and dither).
  - One light: the evening sky from up-left, already in the eggs' own shading. I added a warm dithered rim on the eggs' up-left edges and the hand's solid shadow down-right.
- Agent: gallery
- Check: 1600, 4:3 (all twelve eggs and the finger inside) and 100 px. Audit: no guarded pixels at all. Light L 0.72 (light).
- Couldn't make / caveats: the numerals the film types over each egg are left out, so the slide carries no text.

### Achievement seals · agent `seals`

27 files in `bug/seals/`: 8 moment seals and 1 event seal, three states each. Every file is a 192×192 RGBA master with transparent outside its outline. Each is drawn on a 48×48 people's grid at 4 device px per pixel (whole-number scale, smoothing off), so it stays hard-edged at 96 and 48. Kindly's things (the smiley, the laptop screen, Biscuit's shell and wheels) are drawn as gloss at device scale (`pbAtK(4)`, K = 4).

**Outline by kind (Wren's world).** The three read apart at 32 px by silhouette alone, and the frame materials differ too:
- **feat:** a round transit token, a steel ring. It uses Car 17's grip-bar steel (`#6a6470 / #9a94a4 / #46424e`), with a groove and a raised rim that takes the light on its outer up-right edge and its inner lower-left edge.
- **collection:** a paper bus transfer: upright, with a flat top, a perforation row and its stub torn on a zig-zag at the bottom. It's HC.paper3 / paper2 paper with a dark printed window.
- **event:** a Carmody Street painted-lady gable: eaves overhanging the walls, LADY.rose roof boards and a cream trim band (`#d6c29c / #f3e6c8`), with cream corner boards down the walls.

**States, drawn in the world's light.**
- **Earned:** the light is on.
  - People's pixels get the poster's rim (`#ff7cc0` on the edges facing up-right, `#ffc4e3` dithered just inside), sitting on night ground (`PB.NIGHT`) with a dithered pool lifting toward the up-right (`pbPool`).
  - Gloss gets its own smooth glow or a pink gloss rim.
- **Progress:** only the half toward the light is lit, with the dim rim `#c8579a`. The rest is in Bayer-dithered night shade (`#0e0a18`, up to 92% density), on the 48 grid, across glyph and ground.
- **Locked:** a quiet grey outline (HC.greyD `#5d5558`) and the symbol only, posterised to three greys (`#6e666e / #5d5558 / #433c42`). The ink outline is kept, the inside is transparent, and there's no light, ground or colour.

**The light: one per seal, and it decides the colours.**
- **Kindly's pink from up-right, on all 8 moments.** People's local colours are multiplied by one uniform pink key, `×[0.90, 0.76, 0.84]`, applied to every non-ink pixel of the glyph and the frame. It is a light, not a swap of single colours: no colour is chosen or changed on its own.
  - This is what takes the game's own guarded colours off the platform colours without recolouring them: the casualty yolk `#f2b83a / #ffd86a`, the tart's `#f5c542 / #ffe68a / #e0a860`, and Biscuit's face `#bff5d8`.
  - It makes the eggs and paper a little pinker than on the poster.
- **The event is lit by the street's own string of bulbs, from above.** Five warm bulbs (`#f3e6c8`, with `#e2ac74` under each) hang under the eaves, each in a dithered `#8a5a40` halo. The tart takes a warm rim (`#f3e6c8 / #e2ac74`), and the frame's inner edges catch the bulbs.
  - The key here is the plum night air under the bulbs, `×[0.84, 0.70, 0.72]`.
  - This follows design.json: the Long Table is the night Kindly's smile is switched off. A pink-lit event seal would contradict its own story (see Questions).

**Gloss anti-aliasing.**
- A smooth ink stroke on pink blends into a few pixels within 12 of lilac. Those stray edge pixels in gloss layers are pulled toward their darker neighbour by a logged pass. It refuses to act on more than 40 pixels per seal, so it can't hide a real colour.
- It touched 20 px on each of `thank-you-earned` and `thank-you-progress` (the smiley's eye and mouth stroke edges) and 3 px on each of `gus-patch-earned` and `gus-patch-progress` (the code-bar edges). Nothing else.

**Render:**
- Command: `python3 /home/claude/passB/tools/render.py /home/claude/passB/work/lib.js,/home/claude/passB/work/seals/seals_core.js,/home/claude/passB/work/seals/seals_glyphs.js,/home/claude/passB/work/seals/settings.js OUTDIR`. It also writes `_log.png`, a text file with the AA count; it's not a picture.
- Or run `work/seals/run.sh OUTDIR`.

**Check, all 27:**
- audit.py: guarded **0.00% for every platform colour in every file**, no flat 24×24 blocks (`work/seals/audit-seals.txt`).
- Check sheets: `work/seals/strip-{32,48,96}-{dark,light}.png`, all seals × three states, plus nearest-zoomed 32 and 48 copies. Also `check-with-poster.png`, the earned row at 96 under the poster.
  - The sheets audit with no blocks and at most 0.06% scattered guarded pixels. Those are new colours made by the downscale blending neighbours, not in the masters (`audit-sheets.txt`).
- Looked at all sizes on the platform's dark page `#15111A` and on a light card `#F4F1EA`:
  - at 32 px, every glyph reads, and ring, ticket and gable are distinct;
  - progress reads as half-lit next to earned;
  - locked reads as quiet grey.
- Hot accents, at most one per seal: the yolk (yolked), the pigeon's beak (sals-girls, 2 px), the tart (long-table). The pink is the light itself. No gold, brass or yellow frame; no padlock; no text or numbers.

#### `seals/thank-you-earned.png`, `-progress.png`, `-locked.png`
- Shows: Kindly's glossy smiley in a steel token, a crack running down its right cheek from the rim, where the gloss breaks into people's pixels. Pixel chips fly off toward the light.
- Rule (proposed): free one of Kindly's machines with THANK YOU. In the build, `foeFreed()` adds it to `S.freed` and the first one sets flag `freedTip`.
- Made: rendered from the game's own gloss code: `kSmiley` as a `GS` sprite, cracked with `crackGloss` (the game's FLUSTER and FREED look) along a hand-set jagged path, plus `gGlow`. The crack pixels come from `crackGloss` itself (quantised gloss, `#5a4a8c` hollow, ink outline), lit with the pink rim. The smiley is the light itself, so it isn't keyed.
- Agent: seals
- Check: guarded 0 (after the logged 20 px AA nudge on the stroke edges). Caution lilac 22.0% (earned, from the smiley's pale pinks) and 10.4% (progress). Light L 0.379 / 0.213 / 0.171. Reads at 32 as a pink smiley with a dark crack.
- Couldn't make / caveats: none.

#### `seals/yolked-earned.png`, `-progress.png`, `-locked.png`
- Shows: one of Dolly's brown eggs, cracked round its top, the yolk welling out of the crack and dripping down its front in uneven runs, one with a bead.
- Rule (proposed): throw one of Dolly's eggs in a fight (flag `threwEgg`, set in `useItem('egg')`).
- Made: drawn in the game's code and palette.
  - The egg is the game's `pxEggBig` maths, made sizeable (21×27) and lit from up-right, with its ramp `#f7dcb4 / #e2ac74 / #c98f5c / #a8703f`, shine `#fff4e0` and speckles.
  - The yolk uses the carton count's casualty-yolk colours (`#ffd86a` body, `#f2b83a` shade, `#fff6c8` shine) under the pink key.
  - The crack and drip shapes are hand-set. Several earlier drip shapes read as letters ("P", "π", "r"), and one read as a keyhole; this drip curtain was kept because it reads as liquid.
- Agent: seals
- Check: guarded 0. Caution ember 11.3%, sun 7.9%, lilac 3.6% (earned). At 32 it's a brown egg with a yellow drip; at 48 and up the drip reads plainly.
- Couldn't make / caveats: at 32 px the two longest runs can still hint at a "T" for a moment. 48 px and up is clean.

#### `seals/back-on-its-wheels-earned.png`, `-progress.png`, `-locked.png`
- Shows: Biscuit's screen face (his own pixel face, `happy`, at 3×: each face pixel is 3×3) in his white gloss shell, with his three wheels under him.
- Rule (proposed): flip Biscuit back up (flag `biscuitFlipped`, set in `flipBiscuit()`, where his face turns `happy`).
- Made: rendered from the game: `biscuitFacePx(…, 'happy')`, Biscuit's screen gradient `#3a3560 → #221f3c`, his shell `gloss` with his own stops `#ffffff → #dcd6f7`, and his wheel gradient `#8a86a8 → #2e2a44`.
  - Light 1: the shell's rim is Kindly's pink, drawn through gloss's own `rimCol`.
  - Light 2: the shell's gradient runs to 1.6× the shell height, so the light falls off lower. Without that, the bottom band of `#dcd6f7` with the pink bounce sits under 12 from lilac (about 480 px).
  - The face pixels take the same pink key as all people's pixels, so they read pale grey-mint (`#acbab5`), not `#bff5d8`.
- Agent: seals
- Check: guarded 0 (no AA nudge needed). Caution lilac 7.2%, mint 4.6% (earned). Reads at 32 as a little screen-faced robot on wheels.
- Couldn't make / caveats:
  - At the real moment of the flip Biscuit is still in his Kindly stage, so his screen shows Kindly's gloss face. I used his own pixel face, the one he grows into. It's the Biscuit people know, and it doesn't look like the thank-you smiley at 32.
  - The key dims the face slightly against an emissive screen.

#### `seals/one-forty-two-earned.png`, `-progress.png`, `-locked.png`
- Shows: a flight of the Vallejo Steps on a bus transfer: five wooden treads climbing toward the light, each tread nose catching the pink, and the worn handrail on three posts.
- Rule (proposed): count the Vallejo Steps (flag `stepsCounted`, set when `S.stepsCounted` reaches `STEPS.total` = 142). The collection's own counter is `S.stepsCounted / 142`, which fits the in-progress state.
- Made: drawn in the game's palette from `paintSteps` ("wood treads, stone landings, a handrail worn smooth"): treads `#d0aa82`, risers `#6a4a38 / #7a5a44`, nose `#b08a6a`, rail `#8a6a4a` on `#5a3a2c`. The steps are hand-placed rectangles; the outline comes from `outline()`.
- Agent: seals
- Check: guarded 0. Caution ember 29.8% (the keyed wood and paper), lilac 2.7%. At 32 it's a clear stepped diagonal with a rail, on paper.
- Couldn't make / caveats: no number on it (none allowed); the count lives in the rule.

#### `seals/sals-girls-earned.png`, `-progress.png`, `-locked.png`
- Shows: one of Sal's pigeons in flight, wings up, the near wing with two dark bars and dark primaries, the green-and-purple neck, feet tucked.
- Rule (proposed): help Sal; his pigeons tear up THE BILL (flag `salHelped`; the BILL scene sets `B.salUsed` in the Car 17 fight).
- Made: drawn in the game's code and palette. The game has only standing and pecking pigeons (`pigeonFrame`), so this flying pose is new, hand-placed with `fillPoly`, `disc` and `line` in `pigeonFrame`'s own colours: `#8a8aa0`, `darken` / `lighten` of it, eye `HC.ink`, beak `#e8a050`, neck `#6fb0a0 / #a07ab0`. The feet (`#e8705a`, ember-guarded) are tucked as a pigeon's are in flight, so they aren't drawn.
- Agent: seals
- Check: guarded 0. Caution lilac 3.8%, ember 0.1%. Reads at 32 as a grey bird in flight.
- Couldn't make / caveats: none.

#### `seals/gus-patch-earned.png`, `-progress.png`, `-locked.png`
- Shows: Gus's laptop, open. The person's machine is pixels: a dark lid and a grey deck with key rows. Kindly's insides glow on its screen in gloss: pink, with Kindly's ink code bars.
- Rule (proposed): help Gus; he cuts Max's Loyalty Program (flag `gusHelped`).
- Made:
  - The body is drawn in the game's palette from `PROP.laptop` and `c17Laptop` (`#4b4a55`, `#8b8a96`, `#b8b6c4`, `#5d5a66`), hand-placed.
  - The screen is gloss, from the game's helpers (`rr`, `lg`, kScreen's white sheen). The fill is the smiley's own pinks (`#ffc7e5 → #ff8cc8`) and the bars are `KC.ink`.
- Agent: seals
- Check: guarded 0 (after the logged 3 px AA nudge on the bar edges). Caution lilac 14.4% (earned). Reads at 32 as a laptop with a lit screen.
- Couldn't make / caveats: the game's `c17Laptop` screen shows code lines in mint `#86f0cc` and pink on a dark screen. Mint is guarded, and a dark screen loses the laptop at 32, so the seal shows the screen glowing pink with ink bars instead: a new screen picture in Kindly's palette, not a render of the game's.

#### `seals/last-stop-earned.png`, `-progress.png`, `-locked.png`
- Shows: Car 17's grip lever pulled back to the stop: a steel bar with a worn wooden handle, a notched steel ratchet at its foot, and the slot cut through the car's wooden floor slats.
- Rule (proposed): stop Car 17 with LAST STOP, the team finisher (`SKILLS.laststop`; `lastStop()` in the battle). There is no story flag for it yet; a moment would need one set there.
- Made: rendered with the game's own `c17Lever(g, x, y, len, ang, 1.15, '#8a5a3a')`, the same function Dolly's grip uses in LAST_STOP. It draws its own ink edge. The ratchet and floor are hand-placed in the game's colours (`#6a6470 / #9a94a4 / #46424e`, `HC.wood / woodL / woodD`, slot `#1f1d24`).
- Agent: seals
- Check: guarded 0. Caution lilac 4.3%, ember 0.7%. Reads at 32 as a lever on a floor.
- Couldn't make / caveats:
  - I tried swing marks. A dashed pair looked like lines of text, and `c17Arc`'s crescent smear read as a beak on the handle. Both were dropped, so the backward lean alone says "pulled back".
  - It's the most generic of the glyphs at 32 (a lever).

#### `seals/all-twelve-earned.png`, `-progress.png`, `-locked.png`
- Shows: the egg carton, full: a dozen of Dolly's brown eggs sitting up in their cups, on a bus transfer.
- Rule (proposed): bring all twelve eggs home. The build starts the walk with `S.eggs = 12` (flag `gotEggs`), counts losses in `loseEgg()`, and stores what made it in `S.tartsMade` when the tarts are baked (flag `tartsBaked`). The rule is `S.tartsMade === 12`, and the collection counter is eggs still in the tote / 12.
- Made: drawn in the game's palette. The eggs use the `pxEggBig` maths at 7×8 with the egg ramp and shine `#fff4e0`; the tray uses `fhCarton`'s card and cups (`#a8987a`, `#8a7a60`, `#6a5a48`). Hand-placed.
- Agent: seals
- Check: guarded 0. Caution ember 45.1% (keyed brown eggs and paper), lilac 2.8%. At 32 it's a 3×4 grid of brown eggs in a tray; at 48 and up they read as eggs.
- Couldn't make / caveats: the game's own carton (`fhCarton`) is 2×6. At this size six-across eggs shrink to dots, so the seal shows the dozen as 3×4, which is a change from the game.

#### `seals/long-table-earned.png`, `-progress.png`, `-locked.png` (event seal)
- Shows: one of Dolly's egg tarts on her plate, under a string of five warm bulbs, inside a painted-lady gable.
  - Earned: every bulb is on.
  - Progress: every other bulb is on, and the lower half is in dithered shade.
  - Locked: the gable and the tart only.
- Rule (proposed): none. The event isn't in the build (design.json → event, "The Long Table"), so how it's earned is for the maker and bug.games to decide.
- Made: drawn in the game's code and palette.
  - The tart is `fhTart`'s colours made large (`#c98f4a` crust, `#a8703a` flutes, `#e0a860` rim, `#f5c542` custard, `#ffe68a` shine) on Dolly's plate (`fhTable`'s `#ffffff / #d8d0c0`).
  - The gable proportions follow `lady()`'s gable.
  - The bulbs are the people's light, warm and dithered (see the light note above).
- Agent: seals
- Check: guarded 0. Caution sun 20.1% and ember 11.3% (earned: the warm-lit tart and the cream trim, none of it within 12 of sun). Light L 0.257 / 0.149 / 0.128. Reads at 32 as a lit house with something golden inside, distinct from the ring and ticket.
- Couldn't make / caveats:
  - It's lit by bulbs, not Kindly's pink: a deliberate exception to the moment seals, because of the event's story.
  - The cream trim and warm light are the warmest thing in the set. It stays clear of sun, but it's the one to check beside the platform's earned ring.

### Store, owned mark and pass · agent `storepass`

Everything here is design only: no prices, nothing declared, nothing added to the game. Items, looks and names
come from `design.json`. The scripts are in `/home/claude/passB/work/storepass/` (`sp_lib.js`, `sp_store.js`,
`sp_pass.js`, `sp_rewards.js`, `sp_tile.js`, `build.sh`). They run inside the real build through
`tools/render.py`, after `work/lib.js` and `work/poster_scene.js`.

The check sheets are in `/home/claude/passB/work/storepass/sheets/`:
- `store-tiles-sizes.png`
- `store-row-mock.png`
- `pass-tile-sizes.png`
- `pass-rail-mock.png`
- `pass-rewards-120.png`
- `owned-mark-strip.png`
- `owned-mark-held-overlay.png`
- `owned-mark-play-*.gif`
- `audit.txt`

**How everything is finished.** It all follows the poster: Carmody Street at night, lit by Kindly's candy pink
from off frame at the up-right.
- **Store tiles.** These use the poster's grid: S = 5, with the item at 2x (10 device px, the poster's Wren scale).
  - The ground is the game's night bands (PB.NIGHT), Kindly's glow (pbKGlow), and the game's own Carmody Street
    painting (`areaCanvas('street','night')`, cropped behind the item). The painting is taken dark with
    pbNightPaint and pbFalloff, and its roof edges are rim-lit with pbLit, the way the poster does it.
  - In front are the kerb and the slabs, with Kindly's light as a dithered pool (pbPool).
  - People and their things get the poster's pink pbLit rim and a solid pbCastShadow falling down-left.
- **Biscuit.** He appears in every piece that sits beside the price row and buttons. He is the game's own
  `drawBiscuit()` / `biscuitBody()`, copied line for line as `spBiscuit()`, with free stand-in ramps:

  | Part | The game's colour (guarded) | Stand-in (free) |
  |---|---|---|
  | Body | #ffffff → #dcd6f7 (lilac) | #ffffff → #e2e0dc |
  | Stripe | KC.mint → #7fd8ff | #79d0ff → #7fd8ff |
  | Flag pole | KC.shellD stroke (lilac) | #8d8584 |
  | Flag | #ffb07a → #ff7a4a (ember) | Kindly pink, #ffc4e3 → #ff7cc0 |
  | Pixel face | #bff5d8 (mint) | #cdefff (KC.skyL) |

  - His stripe edges sit on whole device pixels, so no blue-into-white antialias drifts into lilac. Every Biscuit
    piece is at 0 guarded pixels.
  - On Kindly-lit rows his shell takes a smooth pink edge on its up-right side (gloss, so Kindly's blur is allowed).
    On the kitchen row the edge is warm instead.
- **Stars** use #e8e0f0 and #6e6488. The poster's bright star, #c8bedc, is lilac-guarded.
- **Store tile corners.** The top corners are kept calm and audited as zones: NEW at 0–110 × 0–70, YOURS at
  255–400 × 0–70. Every tile is clear.

#### `store/biscuit-tape.png`
- Shows: Taped Biscuit. Biscuit smiles, with a silver duct-tape X across his lid and a strip over his left wheel arch.
- Made: drawn in the game's code. Biscuit is `spBiscuit` (the game's drawing with stand-in ramps, see above). The
  tape is hand-placed pixels in free HC greys (#aaa49e / #dcd6d0 / #77716e), lit on its up-right edges. The ground
  is the shared store ground, described above.
- Agent: storepass
- Check: audit gives 0 guarded pixels, no flat blocks, and both corner zones clear. Looked at 400, 169, 80 and 40 px,
  as a silhouette and in greyscale. At 40 px it reads as a white cooler with a grey X.
- Couldn't make / caveats: The game's own `stage:'patched'` Biscuit has one pale yellow tape strip (#efd98a,
  sun-guarded), a red sticker and a scuff. This skin follows design.json's silver X and wheel-arch strip instead, and
  leaves the sticker off so that the X is the one thing you read.

#### `store/pigeon-pal.png`
- Shows: Little Pope, Sal's palest pigeon, standing on Biscuit's lid with its head cocked. Biscuit's eyes roll up
  to look at it.
- Made: the pigeon is the game's `pigeonFrame(0)`, placed pixel for pixel as `spPigeon`, with two changes:
  - The head is cocked by one pixel.
  - The feet sit in the bird's own shade (#7b3d39). The game's feet are #e8705a, which is ember-guarded. The light
    is above, so this is a lighting choice.
  The pink rim is on the outline only. Biscuit uses the stand-in ramps, plus one new "eyes up" face that I
  hand-placed in the style of `biscuitFacePx`.
- Agent: storepass
- Check: audit gives 0 guarded pixels and both zones clear. The silhouette shows a bird on the lid clearly at 40 px.
- Couldn't make / caveats: Little Pope's colour, #c8c8d4, is my inference. `fhPigeons()` lists the colours
  #8a8aa0 / #9a8a90 / #c8c8d4, and Sal names his birds in the order "Ethel. Bernadette. Little Pope."

#### `store/fog-trail.png`
- Shows: a small Wren walking right with the egg tote. A trail of dithered night fog follows her heels and rolls up
  into a curl behind her.
- Made: rendered from the game. Wren is `personFrame('wren', walk frame 2)` at 1x, with the pbLit rim and
  pbCastShadow.
  - The fog uses `fogTex()`'s own maths: two `makeNoise` value noises, the same four quantised densities, and the
    Bayer threshold.
  - Its colour is the game's night fog, #8e82aa, with its lit faces in #c890b8.
  - The maths is laid along a hand-set curl path instead of fogTex's horizontal band.
- Agent: storepass
- Check: no flat blocks and both zones clear. There are 0.37% guarded pixels, all of them Wren's own sprite details:
  the 4×2 redL cap highlight, the orange zip and the brass cap badge, at 5 px per sprite pixel. At 40 px it reads as
  a pale curl behind a small Wren.
- Couldn't make / caveats: none.

#### `store/hot-sauce-sticker.png`
- Shows: Nuclear Grandma, a die-cut sticker of La Palomita's hot sauce. It's a red bottle with a cream round label
  showing a grandma with her hair in a bun and her glasses on. There's no lettering.
- Made: drawn in the game's palette. The bottle and the face are hand-placed, because the build has no bottle
  sprite: Nuclear Grandma exists only as `ITEMS.hotsauce` and in La Palomita's counter text.
  - Bottle: HC.red / HC.redD / #e48d86.
  - Label: HC.cream / HC.paper2.
  - Face: SKIN.e, with Dolly's hair greys and glasses colour.
  - The die-cut border is #fff4e0, grown with `outline()`. The sticker stands on the kerb, takes the pink rim, and
    casts a solid shadow.
- Agent: storepass
- Check: audit gives 0 guarded pixels and both zones clear. The silhouette is a bottle at 40 px.
- Couldn't make / caveats: the bottle art is hand-drawn (see above).

#### `store/wave-emote.png`
- Shows: the bus driver's wave. Wren is seen from the chest up, smiling with her eyes shut, her near hand raised
  palm out beside her face, with two short wave marks.
- Made: rendered from the game, with additions:
  - The bust is the game's `bustSprite('wren','happy')`, at 1 bust px = 5 device px.
  - The raised forearm is added the way the films add hands to busts (`c17DollyGrip`): an inked `brush()` sleeve
    in HC.navy, with a navyL cuff.
  - The open hand and the wave marks are hand-placed at bust scale.
  - The jacket is carried 8 rows below the bust's edge by repeating its last row.
  - The pbLit rim is applied.
- Agent: storepass
- Check: no flat blocks and both zones clear. The silhouette reads as a raised hand at 40 px.
  - There are 0.97% guarded pixels, all of them Wren's own bust details: the 7×2 cap highlight, the 5×5 brass badge,
    the zip and the shoulder badge.
- Couldn't make / caveats: the full sprite can't lift a hand clear of its head. Its arm is 5 + 5 px and its head is
  16 px, so every raised pose covers the face. That's why this uses the bust.

#### `reward/punched.js`, `reward/README.md`, `reward-held.png`
- Shows: the owned mark, verb **punched**.
  - At 0 ms a conductor's steel punch is already coming in from the right edge.
  - At 70 ms it bites a round hole into the tile's lower-right corner.
  - The chad is a disc cut from the tile itself. It pops toward you, flips once to its plain paper back, and falls
    off the bottom of the tile by 620 ms.
  - The hole holds from there, and 850 ms is the held frame.
  - The hole's cut face is lit cream on its lower-left (the light is up-right), with the dark card showing through.
- Made: drawn in the game's medium, as self-contained code with no game code inside:
  - a 100×100 pixel grid scaled up with no smoothing, the ink line #2a1c25, Bayer dither, and one light;
  - the jaw in the skillet greys from `PROP`.
  - `reward-held.png` is `drawHeld()` on a transparent 400×400 canvas.
  - Usage and the timing table are in the README.
- Agent: storepass
- Check:
  - Played over all five tiles: a frame strip and two GIFs.
  - The held frame reads at 40 px as a small light ring in the corner. Also drawn natively at 169 and 40 px.
  - The module was imported as a real ES module in Chromium with no errors, and passes `node --check`.
  - Audit: 0 guarded pixels, and the mark adds none to any tile. The fog tile's corner zone shows 25 px of Wren's
    own zip, not the mark's.
- Couldn't make / caveats: The hole is painted dark (#0b0812) rather than cut transparent, so it reads on any card
  colour. The module's contract is: draw the tile first, then call `draw()` every frame. A platform that composites
  on a separate canvas should pass `opts.src`. See Questions.

#### `pass/tile.png`
- Shows: Wren walks home with the egg tote and Biscuit follows, on Carmody Street at night. Below them, a paper
  transfer ticket on the street is lettered **THE LONG / WAY HOME**.
- Made: The lettering is the game's `ptext` 3×5 pixel font at scale 2, on a ticket built like the game's
  `stampCv()`: cream paper, red ptext with a redD drop, the ink line, and punch notches.
  - I didn't use `pxLogoCanvas`, because it's filled HC.mustard / mustardL (sun-guarded) and only has the letters of
    APOCALYPSE.
  - The tile is at S = 4. Wren is `personFrame` walk frame 1 at 1x with pbLit, Biscuit is `spBiscuit` at 1x, and the
    houses band is the same as the store tiles'.
- Agent: storepass
- Check: previewed at 169, 140, 120, 100, 80, 60 and 40 px, and in a mock store row with NEW / YOURS. No flat
  blocks and both corner zones clear. There are 0.25% guarded pixels, from Wren's sprite (cap highlight, zip, badge).
- Couldn't make / caveats: none.

#### `pass/ground-free.png`
- Shows: Carmody Street pavement at night: the sidewalk slabs in perspective, with the game's 14 px joint and a
  crack, the dark foot of the houses with a stoop, the kerb lip, and Kindly's pink pooled from the up-right.
- Made: drawn in the game's code and palette, as a per-pixel perspective floor (`spFloor`) in the night ramp
  (#211735 … #6e3a62), with Bayer dither for the light and for the distance falling into dark.
- Agent: storepass
- Check: audit gives 0 guarded pixels. It is the darkest of the three grounds (L 0.11).
- Couldn't make / caveats: none.

#### `pass/ground-pass.png`
- Shows: Car 17's wooden floor slats running away from you, with nails and grain, and pink catching each board's
  lit edge. Behind them is the car's maroon panel run, and its brass edge strip is at your feet.
- Made: drawn in the game's code and palette. The panels are the frame-and-inset motif from `pxCar17()`, taken dark
  (mar / marD). The planks are HC.wood / woodD, and the brass is #9a7630 / #b8893e.
- Agent: storepass
- Check: audit gives 0 guarded pixels (mid value, L 0.19, warm).
- Couldn't make / caveats: the build never shows Car 17's floor from inside. Its films show the running board and
  the bench side-on, so the slats are drawn in the car's own palette.

#### `pass/ground-bug.png`
- Shows: Dolly's kitchen linoleum checks, in Dolly's teal and cream, under the warm dithered pool of her pendant
  lamp. Behind is the kitchen wall: teal paper, the cream rail and the wainscot panels from `paintHouseInt`'s
  `room()`.
- Made: drawn in the game's code and palette. The light is the people's light: warm and dithered, #fff4dc / #e6d7c0,
  kept off sun.
- Agent: storepass
- Check: audit gives 0 guarded pixels. It is the brightest ground (L 0.30), and it looks good inside the sun outline
  in the rail mock.
- Couldn't make / caveats: the build has no linoleum in Dolly's kitchen. Its floor is drawn as a wood slab seen
  in section. The checks use the checker-floor code from Farida's Lucky Seven (`(x/12 + y/5) % 2`), set in Dolly's
  kitchen colours.

#### `marker-next.png`
- Shows: one of Dolly's brown eggs, tipped about 30° and rolling right, with a little grit kicked up behind it and
  its shadow under it. Kindly's pink catches its up-right edge.
- Made: rendered from the game's `pxEggBig()` shading. The same per-pixel ramp (#f7dcb4 → #a8703f) is re-run at the
  tilt, so the light stays fixed while the freckles roll. Ink outline, at 2x on a 48×48 transparent canvas.
- Agent: storepass
- Check: audit gives 0 guarded pixels. Previewed on a mock rail riding over the next cell. Nothing that counts.
- Couldn't make / caveats: none.

#### `marker-held.png`
- Shows: the same egg, upright, sitting in a cup of the egg carton.
- Made: the egg is the same as in `marker-next.png`. The cup uses the game's `eggBox()` pulp colours (#c9b89a /
  #e0d2b4 / #a8987a, plus #8a7a60), with scalloped cell walls. 48×48, transparent.
- Agent: storepass
- Check: audit gives 0 guarded pixels. Previewed on the last earned cell of a mock rail.
- Couldn't make / caveats: none.

#### `pass/rosemary-sprig.png` (free row)
- Shows: Biscuit with a sprig of rosemary from the Vallejo Steps tied to his flag pole with string. Ground: free.
- Made: the sprig is hand-placed in the game's rosemary colours (stems #5a7a6a, flowers #9a8ad8) and its greens.
  Biscuit uses the stand-in ramps at 2x on the S = 3 grid.
- Agent: storepass
- Check: audit gives 0 guarded pixels. Reads at 120 px.
- Couldn't make / caveats: none.

#### `pass/walkie-chirp.png` (free row)
- Shows: Pilar's walkie, with its light on and three pixel arcs going out from its antenna. Ground: free.
- Made: the game's `PROP.walkie` drawn up close (black case, the #e8384f light, antenna), hand-placed in its colours,
  with a pink rim and a solid shadow.
- Agent: storepass
- Check: audit gives 0 guarded pixels. Reads at 120 px.
- Couldn't make / caveats: none.

#### `pass/pigeon-feather.png` (free row)
- Shows: one of Ethel's grey feathers as a die-cut sticker. Ground: free.
- Made: hand-placed in Ethel's #8a8aa0, with grey bars near the tip and a pale quill, plus the same sticker border
  as the hot sauce sticker.
- Agent: storepass
- Check: audit gives 0 guarded pixels. Reads at 120 px.
- Couldn't make / caveats: none.

#### `pass/cable-bell.png` (pass row)
- Shows: Car 17's bell hung on a hook off Biscuit's pole. Ground: pass.
- Made: the bell shape comes from the game's own Car 17 bell in Dolly's kitchen (`fillPoly` bell, rim and clapper).
- Agent: storepass
- Check: audit gives 0 guarded pixels. Reads at 120 px.
- Couldn't make / caveats: the game paints this bell in daylight brass (#d9a637), which is sun-guarded. Here it sits
  in the night light, so its brass falls to the bell's own shade colours (#9a7630 / #b8893e / #5a4418), with a
  light catch on its shoulder.

#### `pass/tart-sticker.png` (pass row)
- Shows: one of Dolly's egg tarts as a die-cut sticker: a fluted shell, the crimp, and a round of custard. Ground:
  pass.
- Made: hand-placed in the game's palette.
- Agent: storepass
- Check: audit gives 0 guarded pixels. Reads as a tart at 120 px.
- Couldn't make / caveats: the game's 5 px tart (`fhTart`) has #f5c542 / #ffe68a custard, which is sun-guarded. Here
  the custard sits in the night light, in the egg ramp (#f7dcb4 / #e2ac74 / #fff4e0), so it's a pale custard.

#### `pass/night-shift-lamp.png` (bug row)
- Shows: a hurricane lantern on Biscuit's lid, lit. Its globe is full of a warm flame. Ground: bug.
- Made: hand-placed, in the game's tin greys (#5d5558 family) and the warm people's light (#fff4e0 / #f3e6c8 /
  #e8b8b0 / #ffd8b0). Biscuit takes the kitchen's warm edge instead of Kindly's pink.
- Agent: storepass
- Check: audit gives 0 guarded pixels. Reads at 120 px.
- Couldn't make / caveats: the build has no hurricane lamp. The refuge's lights are string lights, the pendant and
  nightstand lamps and a paper lantern, so this lamp is an addition from design.json.

### Phone poster, backdrops, share card, title lettering, event banner · agent `round3`

Code: `work/round3/r3lib.js` (shared), `p916.js`, `backdrop.js`, `share.js`, `title.js`, `banner.js`. Each one renders inside the real build with `tools/render.py work/lib.js,work/poster_scene.js,work/round3/r3lib.js,work/round3/<file>.js OUT`. The check scripts are `check_hero.py`, `check_sheets.py` and `shot_title.py` (run with `python3 -I`). The check sheets and `audit.txt` are in `work/round3/`. `lib.js` and `poster_scene.js` are used unchanged; nothing in them was edited.

#### `poster-9x16.png`
- **Shows:** Wren lobs an egg at Kindly, recomposed for 9:16. It's the same night on Carmody Street. The smiley sits right on a turret's finial, the egg is halfway up its arc, and the street climbs away to the left. The top ~15% is sky, for the story chrome, and the bottom 22% is the street in shadow.
- **Made:**
  - Rendered from the game with the poster's own `posterScene`, using new settings: `POSTER_9x16` in `p916.js` (sun [150,104,42], wren [58,308], street crop [610,130,420,230] at [-74,92], egg [118,192]).
  - It's 216×384 logical at S=5, the 2:1 master's pixel size. Wren is at 2×, which is **10 device px per sprite pixel** (the limit is 11).
  - Nothing was hand-drawn beyond what `posterScene` already draws.
- **Agent:** round3
- **Check:**
  - audit: the bottom 18% (346 px) and the caption zone are clear, and there's no flat 24×24 block.
  - Guarded pixels: ember 0.08%, lilac 0.02%, sun 0.05%. These are the same pixels as on the master: Wren's own cap highlight, zip and badge, and the bright stars under the glow.
  - Light: L 0.158, C 0.12, dark (the master is 0.144).
  - Looked at it at 1080, 540, 360, 180 and 90 wide, beside the 2:1 master (`r3-poster-9x16-check.png`).
- **Couldn't make / caveats:** none.

#### `backdrop.png` (1440×577)
- **Shows:** Carmody Street at rest at night, at the top of the hill. It's a row of painted ladies, the Crooked Lady among them, every window dark. A low candy-pink glow rises from beyond the right edge; the smiley itself is out of frame. The houses stand on the street's own sidewalk, and the kerb's edge catches the light: a floor that runs under the hero. It ends in the asphalt and a hard bottom edge. No text, and it's a still.
- **Made:**
  - Drawn with the game's own painter:
    - `lady()` and `leaningLady()`, using `paintCarmody`'s own plan entries (palettes, floors, roofs), laid along a level stretch of street.
    - `cityCtx('night')` and the night `gradeCanvas`.
    - `streetBand` for the sidewalk, kerb, asphalt and cable slot.
    - `pxTree`, plus `pxLamp` with the lamps unlit, since there's one light.
  - It's then taken to night with `pbNightPaint` and given the poster's `pbFalloff`, the `pbLit` roof rim and the `pbPool` sidewalk pool. Kindly's glow is `gGlow`.
  - Copied from `paintCarmody` into `r3Row`: the two little `foundation` and `downSteps` closures.
  - Hand-drawn in the palette: the 1 px dithered kerb-edge highlight.
  - It's at S=2, so the houses are 2 device px a pixel. That sits under the poster's houses, which show at about 2.2 px on the page.
- **Agent:** round3
- **Check:**
  - audit: **zero guarded pixels**, including the rail zone (right 38%) and the top band.
  - The first pass had 52 guarded-lilac px in the rail zone. They came from the poster's bright star colour `#c8bedc` tinted by the glow. The backdrop now uses dimmer stars, the game's night-star tones `#8e82aa` / `#5e5280` (the page should be quieter than the plate).
  - Light: L 0.101, C 0.113, dark. The poster is 0.144, so the poster stays the brightest thing on the page.
  - Hero checks: `backdrop-hero-desktop.png` (ref 04, background cover over the measured 1440×615 band), `backdrop-hero-check.png` (cover and native placement, phone, and each backdrop alone) and `backdrop-hero-desktop-grey.png`. The poster leads in every one.
- **Couldn't make / caveats:**
  - The pack doesn't say how the platform fits a 1440×577 image into the 1440×615 band it shows in ref 04, so I checked both cover and native placement.
  - At 1440 most of the backdrop is under the poster and the rail. It shows in the top band, the side margins and the floor under the strip. Wider screens show more of the row.

#### `backdrop-phone.png` (390×826)
- **Shows:** its own composition, not a crop:
  - Three houses: the butter gable, the Crooked Lady and the blue turret.
  - The kerb sits at y≈548, just behind the foot of the phone info card, so the card stands on the sidewalk.
  - The same low pink light comes from beyond the right edge.
  - The street runs down to a near kerb at y 760, a hard edge, then our own sidewalk in shadow.
- **Made:** the same painter and finish as `backdrop.png` (`bdScene` in `backdrop.js`), at S=2. The near kerb is hand-drawn in the ramp.
- **Agent:** round3
- **Check:**
  - audit: zero guarded pixels.
  - Light: L 0.09, C 0.103, dark.
  - Laid under ref 07, starting under the header. The rooftops show between the 4:3 poster and the info card, and the floor shows under the card. The poster leads (`backdrop-hero-phone.png`).
- **Couldn't make / caveats:** the pack doesn't show where the 826-px image starts on the phone page. I assumed it starts right under the header (y 52). The visible part (page y 345–623) holds the rooftops and the floor.

#### `share-card.png` (1200×630)
- **Shows:** the poster's moment, Wren lobbing an egg at the smile, in the right of the plate. The game's own title lettering is on the left.
  - The row of houses starts at a house's side wall at about 0.62 W, so the left half is only sky and kerb: plain for the title.
  - The subject is Wren at 0.66, the egg at 0.77 and the smile at 0.86, which puts its centre at **≈0.74 W**.
  - The bottom 18% is the street in shadow, quiet for the linen bar.
  - No player names.
- **Made:**
  - Rendered from the game with `posterScene`, using settings `SHARE_CARD` in `share.js`. It's 400×210 logical at S=3, with Wren at 2× (6 device px a sprite pixel, the master's 1:2 ratio of houses to Wren).
  - `title-lockup` is placed at ×2 (604×134) at (40, 196).
- **Agent:** round3
- **Check:**
  - Looked at it at 270 wide under a mock linen bar, next to the poster at 270, and at 135 (`r3-share-card-check.png`). It reads as the same plate on the wall.
  - audit: the bottom band (113 px) is clear, and there's no flat block.
  - Light: L 0.162, C 0.128, dark.
  - Guarded sun is 0.86%: the title's own mustard letters.
- **Couldn't make / caveats:** **ember.** 576 px (0.08%) are guarded-ember, and **all of them are Wren's own sprite**: the cap highlight `#e8704f` (4×2 sprite px, half of it under the pink rim) and the 1-px zip `#e97b3b`. These are the same pixels as on the poster. There's no other ember anywhere. I didn't recolour her (BRIEF §2.5). See Questions.

#### `title-lockup.png` (906×202, transparent)
- **Shows:** the game's title, laid out the way its title screen does it: Kindly's glossy "Pardon the 😊" pill sitting over the people's hand-made **APOCALYPSE**.
- **Made:**
  - **APOCALYPSE** is the game's own `pxLogoCanvas('APOCALYPSE')`, unchanged, at whole-pixel ×3, with its letter bounce as it lands. Only the empty slam headroom above the letters is trimmed.
  - **The pill** is drawn on canvas to the real title DOM's proportions, measured from the running title screen (`shot_title.py`): the word is 320 css px, which makes the pill 120.7×23. It uses Nunito 900 in `#4b3a9a`, a `#fff`→`#f1edff` fill, a 1.25 px `KGRAD` border, `kSmiley` at 1.12 em and a 4.2 px gap above the letters.
  - Two deliberate departures:
    - The in-game pill has a large lilac halo (`0 0 46px rgba(167,149,255,.42)`). I drew it as a tight gloss shadow, so the lockup sits on linen without a lilac haze.
    - The pill reads **"Pardon the"** in sentence case, as the game sets it. The game's `BIGF` font only has the letters A, P, O, C, L, Y, S, E. "PARDON THE" can't be set in `pxLogoCanvas`, because unknown letters fall back to A.
- **Agent:** round3
- **Check:**
  - **Smallest readable width: 344 px.** At that width the pill's capitals are 12 px tall and the APOCALYPSE letters 23 px.
  - For square pixels, show it at whole multiples of 302 px: 604 (×2, as on the share card) or 906 (×3, this file).
  - The largest size without a 24×24 mustard block is ×5 (1510 px).
  - Looked at it at 344, 302, 604 and 906 on night, the page colour and linen (`r3-title-check.png`).
  - audit: no flat block. Guarded sun is 18.7%, which is the game's own `HC.mustard` / `mustardL` letters. Guarded lilac is 2.3%, from the pill border's gradient.
- **Couldn't make / caveats:** the lettering is mostly guarded sun by design. Keep it off crumbs and earned UI and out of the platform's zones. It's lettering, so it belongs only on the share card and the video end card, never on the For You poster.

#### `events/long-table-banner.png` (1720×600)
- **Shows:** *The Long Table*. On the night Kindly's smile is switched off, Carmody Street eats one long dinner down the hill.
  - Three borrowed tables step down the street under the neighbours' own string of bulbs, with Sal's pigeons on the wire and the table.
  - Dolly sits with Walt's dozen egg tarts piled in front of her. Wren, Biscuit (two tarts on his lid), Sal, Farida, Pilar, Gus, Rosa and three neighbours sit along the tables, with a tart at every place.
  - Warm lamps are on in the houses behind. Up the hill, every house is dark, because everyone is at the table.
  - Kindly's tower pod stands dark, its screen off, top right: where the poster's smile hangs.
  - The left 45% is dark and plain for the words and Join. There's no counter and no key art.
- **Made:** rendered and drawn in the game's code, at S=4 (430×150 logical):
  - **The houses** are `lady()` / `leaningLady()` with `paintCarmody`'s plan, laid on a slope (`r3Row`), with the night grade.
  - **The windows** that are lit stay lit, as the people's lamps (`r3WarmPaint`). They're flat steps of `#6e4048`, `#a8703a`, `#c98f5c` and `#e2ac74`, so the warm stays off sun. A warm-ramp pocket takes the facades near the table off a warm ramp at the same values. `pbFalloff` darkens up the hill.
  - **The people** are `drawPersonAt` with `sit` poses, as in the DINNER film's `fhTable`. They get a warm rim from above with `pbLit` (`#e8b8b0` / `#c98f5c`).
  - **The props** are `fhBiscuit` and `drawBiscuit` (`stage: 'patched'`), `fhTart`, `fhCup`, `pigeonFrame`, and `fhTable`'s own lace-cloth lines and chair backs.
  - **The bulbs** use the roof's and refuge's string-light code on a `catenary`, with the mustard bulb swapped for cream `#f3e6c8` (BRIEF §3). Each bulb gets the game's tiny dithered glow (`ditherGlow`, r 3).
  - **The tower** is `paintTower`'s geometry and gloss, copied as `r3TowerOff`, with the screen dark, no face and no glow.
  - **Hand-drawn:** the three tables stepping down (`fhTable`'s cloth, repeated), the tables' dithered shadows and the dead screen.
- **Agent:** round3
- **Check:**
  - audit: the **left 45% is clear (zero guarded pixels)**, and there's no flat block.
  - Guarded pixels appear only in the right 55%, as small details in the game's own sprite and prop colours: the tarts' custard, Sal's beanie, Gus's and Dolly's lilac clothes, Biscuit's face, the pigeons' legs and Wren's cap highlight. They're 0.04–0.43% each.
  - The bulbs are caution-only.
  - Light: L 0.169, C 0.109, dark.
  - Looked at it at 860×300 with mock words and Join over the left 45%, with the left 45% blacked out, and as the right 55% alone at 346 wide (`r3-banner-check.png`). The right side tells it alone, and the banner is plainly different from the poster: warm bulbs and many people, against one pink smile and one person.
- **Couldn't make / caveats:**
  - The event is a proposal (`design.json`), and an outdoor long table doesn't exist in the build. It's staged from the DINNER film's table, seats and props on Carmody Street.
  - The tower's switched-off state isn't a mood the game has. It's drawn from `paintTower` with a dark screen.
  - The event seal is another agent's.

### Moving poster · agent `living`

#### `living-poster/pardon.js`
- **Shows:** the poster, alive. Night on Carmody Street, Kindly's glossy pink smiley the only light, and Wren on the corner lobbing Dolly's eggs at it.
  - **idle:** it holds on the poster's exact frame (1.5–5 s), then lives (2.5–6 s). She watches the egg drop short behind the houses, blinks, breathes, shifts her weight, takes another egg, weighs it in her palm, winds up and lobs, and the frame holds again. As `near` rises she looks out at the cursor.
  - **react:** a startle, then a shouted wind-up.
  - **enter:** the throw. The camera follows the egg into play as a revving Glyde scooter rolls in.
  - **loop:** a 7.2 s turn-based night scavenge fight.
    1. SPLAT: the gloss cracks into pixels and the screen is YOLKED.
    2. Its RAM misses, yolk-blind.
    3. THANK YOU: Wren's cheer and pink stars leave it FLUSTERED.
    4. A second egg FREES it: all pixels, it rides off.
    5. The next scooter comes in, and she lobs.
  - **squeezed:** she hugs the egg tote (the game's BRACE) and glares, and shouts as the squeeze grows.
  - **after a hover:** a 0.45 s settle, one lob, then the poster's hold.
- **Made:** rendered from the game and drawn in its own code, with nothing from earlier pictures.
  - **Baked from the game's renderer** (inside the build, via `tools/render.py`, then serialized as run-length rows):
    - 33 Wren poses, `personFrame('wren', pose)`, each lit by the poster's own `pbLit` (light up-right, `#ff7cc0` / `#ffc4e3`):
      - the poster's lob: `lob`;
      - idle: `lobOpen`, `watch`, `tired`, `stand`, `blink`, `standL`, `standR`;
      - the egg: `reach`, `holdEgg`, `holdBlink`, `weighLo`, `weighUp`, `windup`, `windShout`, `windAngry`, `mid`;
      - glances: `glance`, `glanceSm`, `glanceE`;
      - react and the fight: `startle`, `smug`, `cheer`, `happy`;
      - squeezed: `worried`, `hug`, `hugShout`, `hugBlink`;
      - events: `hurt`, `angry`, `stagger`, `lookBack`, `angryBack`.

      The pose objects are in `work/living/poses.js`. The hug poses are the game's BRACE with `PROP.tote` held in front.
    - the egg: `pbEgg6` plus its outline, as `pbEggFlight` draws it;
    - the Glyde scooter's crack pixels, `enemyCracked('scooter', {}|{rev}, 1|2)`, from the game's `crackGloss`;
    - the freed scooter, `enemyFreed('scooter')`;
    - Carmody Street, `areaCanvas('street','night')` (painting x 400–1300, y 130–360), stored as `pbNightPaint`'s tone per pixel.
  - **Ported as code into the module:**
    - the gloss: `gGlow`, `kSmiley`, `gloss`, `kScreen`, `kFace` from `02b_gloss.js`, and `paintScooter` from `04b_enemies.js`;
    - the poster's passes on the street: `pbNightPaint` dither, `pbFalloff`, the `pbLit` roofline rim, `pbBaseLine` asphalt, `pbPool` light pools, the kerb;
    - the sky and stars: `skyBands` over `PB.NIGHT`, and `pbStars` (mulberry seed 11);
    - Wren's shadow (`pbCastShadow`);
    - a `pbLit` port that lights the freed scooter as people are lit;
    - the game's star and heart particle shapes.
  - **The three poster settings** from `work/poster.js` (2:1, 1:1, 2:3) are built in. The plate's shape picks one, and the module recomposes around Wren at a whole-number scale (≤ 10 device px a pixel).
  - **Hand-drawn in the game's palette:**
    - the yolk on the scooter's screen (the game's yolk colours `#e8dcb8` / `#f2b83a`, 2×2 px of yolk);
    - the splat bits (the egg ramp);
    - the dust where a neighbour's item lands;
    - the egg falling short behind the houses in idle. This is new business: it isn't a moment from the game, but it uses the poster's own egg, trail and light.
  - **Data and size:** Wren is 23.5 KB, the street 40.8 KB and the scooter pixels 3.2 KB. The whole module is 125 KB.
- **Agent:** living
- **Check:** all saved in `work/living/`.
  - **Held frame vs the posters** (`compare_held_vs_poster.png`): the reduced-motion frame matches each poster to within 9/255 at worst. The residue is gradient rounding in the cached glow; drawn uncached, the 2:1 is pixel-identical.

    | plate | poster | max diff | pixels > 2/255 |
    |---|---|---|---|
    | 1920×960 | `poster.png` | 9 | 0.0009% |
    | 720×1080 | `poster-2x3.png` | 8 | 0.0004% |
    | 816×816 | `poster-1x1.png` | 6 | 0.0006% |

    Light band of the 2:1 held still: L 0.144, C 0.124, **dark**, the same as `poster.png`.
  - **My Playwright test** (`living-poster/test/run.py`, 123 scenarios on a virtual clock) passed with zero console or page errors. It covered:
    - every mode, events (`cue`, `hit`, `look`, `shake`), the settle and the return to the hold;
    - reduced motion and the no-OffscreenCanvas fallback;
    - tiny (60×40, 120×90, 200×150), tall (140×305, 150×370, 270×370, 333×777 at dpr 1.25), wide (577×163, 900×200, 1000×150), and 420×370, 760×380 and 900×640 at dpr 1 and 2;
    - a squeeze from 270×370 down to 120×280, and a resize from 120×90 up to 400×370.

    Sheets: `check_held_shapes.png`, `check_modes.png`, `check_idle_events.png`.
  - **The old kit's harness** (`harness.py` read first and run with `python3 -I`; `shot.mjs`/`pw.mjs` read, network blocked) gave `errors []` in the time sequence and in reduced motion (`harness_shots/`). Its six plates are live, auto, tall with cursor near, squeezed with rants, hits with cue, and resize.
  - **Timing** at 600×400, headless Chromium with software raster and every frame's rasterization forced:

    | case | mean | p95 |
    |---|---|---|
    | idle | 0.31 ms | 0.4 ms |
    | loop | 0.49 ms | 0.8 ms |
    | loop at dpr 2 | 1.37 ms | 2.3 ms |
    | squeezing plate | 0.67 ms | 1.3 ms |
    | resizing plate | 1.5 ms | 2.4 ms |

    The one-time setup (the first `create()` builds the three street bitmaps, shared by all plates) takes about 50–70 ms. There is no getImageData in the module, and no per-pixel loop runs per frame.
  - **Rhythm** (`test/rhythm.py`, every frame hashed over five seeds × 90 s):
    - holds 1.5–4.9 s, live stretches 3.1–6.0 s;
    - the longest still moment inside a live stretch is 0.7 s;
    - the loop repeats exactly at 7.2 s (407/432 frames hash-identical one cycle later; the rest still carry the idle egg in the first cycle);
    - the frame's mean luma in the loop stays between 0.167 and 0.190, and moves at most 0.0045 from one frame to the next, so nothing flashes.
  - **audit.py** on all 108 shots, with the caption zone scaled to each plate (146/960 of the height):
    - **0** flat 24×24 guarded blocks at any scale, up to 10 device px a pixel at 900×640 dpr 2;
    - **0** guarded pixels in the caption zone on every held, idle, squeezed, event and loop frame;
    - the one exception is 2 lilac px on the out-of-range 1000×150 plate.

    Wren's own guarded detail (her cap highlight, zip and badge) is the same as in the poster.
- **Couldn't make / caveats:**
  - **OffscreenCanvas and ImageData** are used for the static-layer caches. The kit's own example module uses OffscreenCanvas too. Without them the module falls back to Path2D runs: an undithered street, about 4 ms a frame. See Questions.
  - **No game type.** The game's words (SPLAT!, YOLKED, MISS, FLUSTERED!, FREED!, THANK YOU) are left out because the rules forbid animated type. Each beat is carried by the art instead: the yolk, the cracks, the cheer and stars, the turn to pixels.
  - The game's FREED sparkles include sun-gold `#f3cd6d` (guarded), so I used only its other two colours.
  - The game's 15 Hz hit flash and its white screen flash on FREED are omitted (no flashing).
  - **Scooters arrive REVVING** (red screen). This is the game's own charge state, and it keeps the plain lilac `kScreen` gradient from forming a flat guarded block at 10 px a pixel. During the fight the camera sits a little lower, so the machine's lilac and mint gloss stands clear of the bottom 15% of the plate.
  - **The smile moves on odd plates.** On narrow or flat plates it slides up to 30 lp across or 14 lp down. Its light on the houses stays baked for the poster's position. On a 200×150 plate the top of the smile is cropped, because the full poster height doesn't fit there at a whole-number scale with Wren still readable.
  - **Narrow fights pan.** Below about 200 px wide, the fight doesn't fit side by side, so the camera follows the turn (Wren's, then the machine's). Wren can be partly out of view while the machine acts.
  - **Plates wider than 900 lp** (beyond the board's range, e.g. 1000×150) repeat the street row.
  - **Bubble lines.** `rants`: "Mind the eggs." (mine, in Wren's voice), "Next stop." (the game's), "#@$%!". `hits`: "Hey!" and "My eggs!".

#### `living-poster/README.md`
- **Shows:** how the module is made from the game, the three poster settings, the modes and events, the performance numbers, and how to run the tests.
- **Made:** written by hand.
- **Agent:** living
- **Check:** the numbers in it are from the final runs above.
- **Couldn't make / caveats:** none.

#### `living-poster/test/` (`plate.html`, `run.py`, `rhythm.py`)
- **Shows:** a deterministic test plate (the board's call shape, dt = 1/60), the scenario runner (PNGs, timing, errors), and the rhythm and seam measure.
- **Made:** written by hand. Python Playwright with Chromium. The test page reads pixels (getImageData) only for timing and hashing; the module never does.
- **Agent:** living
- **Check:** `run.py all` gave zero errors over 123 scenarios; `rhythm.py` as above.
- **Couldn't make / caveats:** none. The rebuild pipeline is in `work/living/`:
  - `poses.js` and `bake.js` run in the game page via `tools/render.py` and write `bake/bake.json`;
  - `build.py` puts that data into `pardon_src.js` and writes `bug/living-poster/pardon.js`.

## Questions

**From the lead:**

1. **Moments.** There's no game.json yet, so the seals are for *proposed* moments. Each one comes from a story flag the build really sets (see `design.json → moments`). Which moments should game.json declare? If any change, its seal is quick to redraw.
2. **The update picture.** The game has no version on bug.games yet, so the picture is saved as `updates/next.png` (with the thumbnail at `updates/next-thumb.png`). The roof antenna it shows is already in this build, so if the first upload includes it, it isn't an update. In that case hold this picture back and make the update picture for the first real change. What version string should the file use?
3. **Catalogue number and maker handle.** Both are unknown, so the moving poster has `no: '···'` and `maker: '···'`, as the pack asks.
4. **Wren's own near-platform pixels.** Wren's sprite has three small game colours that measure as guarded: a 4×2 cap highlight `#e8704f` and a 1-px zip `#e97b3b` near ember, and a 2×2 brass badge `#e3a83c` near sun. They're never a block of 24 px or more, never in a guard zone, and never recoloured. They appear in:
   - the posters
   - the share card, about 0.08%. The share card's rule says "never ember", so this one needs a ruling.
   - two store tiles (Wave, Fog trail)
   - the pass tile

   The small marks, stills, seals and gallery avoid them by scale or light. Is that acceptable, or should Wren's art use a free stand-in highlight in these places?
5. **The 120 px rule.** I measured "within 120 px of the caption strip" at the poster's 1600×800 scale, which is the bottom 18.25% of the height, and applied the same share to the 1920×960, tall and square files. Is that the right reading?
6. **The wall audit.** `tools/measure.py wall` reads `data/lightmap.json`, which isn't in this pack, so the edge-by-edge audit didn't run. The poster's band is dark (L 0.144, C 0.124). By eye on `wall-hero.png`, it sits dark next to dark against Threadbare, which is tolerated.

**From marks:**

- The chip's corner glow is smooth gloss, which is the poster's finish for Kindly's light. If Home chips should be pixel-grid only, the glow can be swapped for a dithered one on the 32 grid without changing anything else.

**From stills:**

- For Yelnur and bug.games: what's the update's version string? The file waits as `updates/next.png`.

**From gallery:**

1. **Slide 01's HUD.** I kept the in-stage HUD (intent pills, enemy bars and names) and left out the command dock under the stage. Is that the right amount of the game's own HUD for bug.games?
2. **Slide 04's size.** At the 10 px ceiling Biscuit fills about 35% of the height. If half the height matters more than the 10 px ceiling, the stripe would need dithered shade at about 14 px per pixel.

**From seals:**

- **Event light:** the brief says earned means Kindly's pink rim, but the Long Table is the night Kindly's smile is switched off. I lit its seal with the street's bulbs instead. Keep this, or switch it to the pink rim like the moments? It's a one-line change (`light: 'bulbs'` in `seals_glyphs.js`).
- **The pink key:** to keep the game's yolk, custard and Biscuit-face colours off the platform colours without recolouring them, people's pixels in the seals are lit by one uniform pink multiply. The eggs and paper come out a little pinker than on the poster. Is that the right call, versus allowing those few game colours as small guarded detail?
- **Moments are proposals:** `last-stop` has no story flag yet, and `all-twelve` would be checked from `S.tartsMade`. The final list (up to 12) and the event's rule are for the maker and bug.games to decide.

**From storepass:**

1. **Wren's own guarded pixels.** The store and pass pieces that show Wren still carry her sprite's own guarded
   details: the redL cap highlight, the brass badge and the orange zip. They come to 0.97% on the wave, 0.37% on the
   fog trail and 0.25% on the pass tile. None of them is a flat block or sits in the badge corners. I didn't
   recolour her, because the cap is the identity. Is that acceptable beside the price row, or should these items
   avoid showing Wren?
2. **The punch module's contract.** The module expects the tile to be drawn first and `draw()` called every frame
   (or `opts.src` passed). Does the platform's overlay runtime work that way? And should the hole be painted dark,
   as now, or cut through to the card?
3. **Stamps on the pass tile.** Does the pass tile ever get NEW / YOURS? I kept its top corners calm anyway.

**From round3:**

1. **Share card and "no ember":** the only ember-near pixels are Wren's own cap highlight and zip (0.08%), the same as on the poster. Is that acceptable, or does bug.games want them gone? The only way to remove them is to change her sprite colours, which the pass rules forbid.
2. **Backdrop placement:** how does the page fit the 1440×577 backdrop into the 1440×615 band in ref 04 (cover, or native at the top)? And where does the 390×826 phone backdrop start? Both readings were checked, and the poster leads in each.
3. **Title case:** the game's own title says "Pardon the" (sentence case, in Kindly's pill) over "APOCALYPSE". I kept the game's lettering rather than all caps. Say if bug.games needs it otherwise.

**From living:**

- **OffscreenCanvas:** may board modules use `OffscreenCanvas` and `ImageData` as private caches? It's not DOM, and the kit's example module uses it. If the board forbids it, the built-in fallback works, but it's slower and the street is undithered.
- **Caption zone:** the moving poster's section doesn't say where the platform's controls sit on a plate (caption chip, Play on hover). I treated the poster's caption strip plus 120 px, scaled to the plate height (15.2%), as the guarded zone. Is that the right zone for plates, especially expanded ones in the loop?
- **One-time setup:** about 50–70 ms in the first `create()` (shared by every plate). If the board needs `create()` to be cheap, the street bitmaps can be built lazily on first draw instead, at about 10 ms per setting.
