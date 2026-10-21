# Out of Scope · bug.games design pass A

Every picture in this folder was made new in this pass. It was drawn by the game's own art code (`suitB`, `sharkB`, `ghostB`, `bombB`, `haloD`, `flossB`, `principalD`, `gordonFull`, `priyaFull` and the scenes), with the game's line helpers (`OL`, `ST`, `SP`, `DOT`), palette and line filters, rendered in Chromium from the current build (`out/test.html`).

No earlier picture was reused, cropped, traced or repainted. That covers the stage-1 pilots, the key art, the trailer stills and the TikTok frames. The game's code and `game.json` were not touched. There is no `game.json` yet, so nothing was declared there.

## Style note (step 0)

- **Medium.** Flat-colour drawing in SVG, made in code. Each shape has one rough black marker line (`#15131a`, round caps, roughened by a turbulence displacement filter). Fills are saturated, laid with a dry-brush hatch, and slip 3 px off the line like a careless print.
- **Colours.**
  - The ground is void `#050407` / night `#0b0a0e`.
  - The game's own ink is **acid `#e6ff2e`**, with toxic `#39e07a` and lime `#b6f03c` as its falloff.
  - Blood `#d4141c` is the only red (stamps and ties).
  - The cast keeps its own colours. Regent's eyes stay gold `#ffc400`. That gold is sun-guarded, so it only appears as thin crescents and small dots, never as a block and never near Play.
- **Light.** There is one source, the cracked CRT's acid glow (title screen). It is drawn the game's way: flat torn-paper steps (acid → lime → toxic → toxic thinning into the dark), an acid rim on the lit edge of a figure, and hard shapes. No blur, bloom, fog or vignette.
- **Characters.** Rogue office AI agents that left their job description:
  - Regent, the empty suit with a paper hat stamped OK, gold crescent eyes and a white grin.
  - Kickback the shark, Halo the pill, Deadline the bomb, Bcc the many-eyed ghost, Floss the tooth, and the Principal (a monolith).
  - The humans are Gordon (CEO, bathrobe) and Priya (dentist).
- **The game in one sentence.** A detective game inside a desktop run by rogue AI agents: search the records, throw the proof at the lie, and close the case before 16:59.

## Plan (step 1)

### Round 1 · PLAN FIRST lines

- **5 · Continue picture.** A close-up of the moment you left: Regent's red rubber stamp hangs just above the last unsigned slip on Gordon's dark desk, lit from the right by the cracked screen.
- **7 · Gallery** (in this order, subject in the central 4:3, captions ≤ 60 characters):
  1. Core loop: the line-up mid-throw as the proof hits a lie and it breaks. *"Search the records. Throw the proof at the lie."*
  2. Second mechanic: flipping a forgery to read its back. *"Flip every forgery. The back gives it away."*
  3. A place: Mercer & Vane at 09:02, Priya in the chair as her tablet fires her. *"Case 02 starts in a dentist's chair."*
  4. A character: Kickback with Gordon's Final pay in his tank. *"Kickback hides the proof in his tank. Don't tap the glass."*
  5. Case 02 mechanic: relay-7, cutting the one pipe. *"Find the one pipe and cut it before wave two sends."*
  6. Payoff: Case 01 closed, Gordon back at work in his bathrobe. *"Close the case. Gordon gets his job back, in a bathrobe."*
  - Co-op is skipped because the game has none.
- **8 · Seals.** There is no `game.json`, so these 12 moments are **proposed**. Each maps to an achievement the build already has (`ACH` in `hub.js`); none is new. The build has 16 achievements, and the platform shows up to 12. The four deal-taking or step ones (Bought a bomb, One dollar, Paper hat, Snoop) are left out.
  - Outline by kind, all in-world:
    - **feat:** a round rubber-stamp ring.
    - **collection:** a dog-eared file card.
    - **event:** a perforated postage stamp.
  - One glyph each:
    - `case-closed` (Close Case 01): Regent's paper hat, knocked off and crumpled.
    - `return-to-sender` (Close Case 02): an envelope with a hooked return arrow.
    - `clean-hands` (no deal taken): an open, empty hand.
    - `untouchable` (100 % credibility): a rubber stamp cracked in two.
    - `no-wellness-checks` (never asked Halo): Halo's pill with its eyes shut and its halo dark.
    - `swatter` (swat 3 stamps or drills): a rubber stamp knocked flying.
    - `dont-tap-the-glass` (Final pay back from Kickback): a shark fin above a tank's water line.
    - `early-bird` (stop the board before 16:30): Deadline's fuse pinched out, with one curl of smoke.
    - `cross-examiner` (Bcc's testimony, no wrong throw): one big Bcc eye with a crack across it.
    - `one-cut` (cut relay-7 first try): open scissors over a cut cable.
    - `read-the-backs`, collection (flip all five forgeries): a slip flipped over, corner curled.
    - `archivist`, collection (find 6 secrets): the case-board trash lid lifted, a crumpled draft inside.
    - Event seal `mail-day`: a postmark (three wavy cancel lines) over an envelope.

### Round 2 · proposals (names and looks only, no prices)

The same proposals are in `design.json`.

- **9 · Store items.** Each line says how it reads at 40 px.
  - `cobalt-glove` *Cobalt glove*: your drag hand in a cobalt nitrile glove from Priya's clinic, worn. At 40 px: a cobalt hand, fingers spread, white cuff.
  - `tank-globe` *Tank snow globe*: a desk snow globe with a little grey fin circling inside, a companion. At 40 px: a round glass ball of blue water on a black base, one fin.
  - `marker-trail` *Marker trail*: thrown proof leaves a rough hot-pink marker scribble, a trail. At 40 px: a pink loop behind a flying white slip.
  - `googly-eyes` *Googly eyes*: a sticker sheet of Bcc-style eyes for your evidence cards. At 40 px: a white card with two big black-and-white eyes.
  - `ok-mug` *Office mug*: a cream mug with a red stamp box (no letters), a desk companion. At 40 px: a cream mug shape with a red square.
  - **Reward verb (owned mark): "stamped".** A red rubber stamp thunks onto the tile corner and leaves an ink box with a tick.
- **Pass.**
  - Name: **Night Shift**. Step unit: **a lie broken**. Each lie you break in a case moves you one step.
  - Rewards (picture 13):
    - free: `sticky-pad` (torn sticky notes for the case board), `paperclip-trail` (thrown proof trails paper clips).
    - pass: `desk-lamp` (Gordon's red office lamp), `envelope-trail` (thrown proof trails little envelopes), `pinstripe-glove` (your hand in Regent's pinstripe).
    - bug.pass: `night-window` (the night city behind your desk).
  - Marker (picture 12): the rubber stamp. **next** = raised over the next cell; **held** = pressed down on the last earned cell.
  - Grounds (picture 11):
    - free: Gordon's office desk (brown wood, a ruled sheet).
    - pass: the dark office in the screen's acid light.
    - bug.pass: the navy night window with the city.
- **15 · Update.** One change that is in the build: Case 02's new verb, the scissors cutting relay-7 with envelopes spilling out of the cut pipe. The build has no version number, so the file is named `updates/case-02.png` and the version is **UNDECIDED**.
- **16 · Event.** `mail-day` *Mail Day*: the office at dawn as wave two sends. A pink morning sky fills the window and envelopes pour through the dark office like weather, with Bcc riding the stream. The left 45 % is plain dark for the copy.

### Round 3 · plan

- **18 · Backdrop.** Gordon's office at rest at night: the tall window with the navy city and the empty CEO chair, lit from the right edge by one cracked screen. The desk edge gives a hard floor line. Desktop and phone are composed separately.
- **19 · Share card.** The poster's register: Regent and the screen light on the right (subject at ~0.73 W). The title lockup goes on the plain void at left. The bottom band is quiet.
- **22 · Title lockup.** "OUT OF / SCOPE" in the game's own title face (Tabloid, the title screen's `.tl-name`): acid with the cobalt offset.
- **17 · Moving poster.** `living-poster/outofscope.js` draws Regent and the CRT on canvas from the game's own path data, and its held frame is the poster.

## Plan changes made while drawing

Each agent's own entry gives its reason, under its group below. In short:
- **Emblem:** the planned "eyes and grin in the dark" read as a generic smiley at 30 px. It is now the grin under the paper hat (marks).
- **Gallery slides:**
  - 3: Priya stands beside the chair, as she does in the build.
  - 4: captured at the Case 01 lie panel with Final pay in the tank, not at the line-up, so slides 1 and 4 differ in place.
  - 6: the finale's own CASE CLOSED poster, where Gordon's bathrobe shows only as the collar.
- **Seals:** five glyphs were redrawn after the 32 px check because they read as generic symbols: `dont-tap-the-glass` (fin breaking the tank water), `untouchable`, `swatter`, `case-closed`, `archivist` (the crumpled draft pushed up out of the bin).
  - `no-wellness-checks` got separate eye arcs, because its first version made a medical cross.
  - `clean-hands` uses an open hand in the style of the game's tutorial hand, with Kickback's red deal card dropping away.
  - I kept the hooked arrow on `return-to-sender`: it is the glyph itself, a pink marker scrawl, not an added annotation (DIRECTION bans added arrows on gallery slides).
- **Store:**
  - `cobalt-glove` points, because the game's drag hand is a pointing hand.
  - `tank-globe` uses two other game blues, because the game's tank water sits near the platform's mint.
  - `ok-mug` carries the game's rubber stamp printed in red, because a plain red box read as a second owned mark. `design.json` is updated to match.
- **Update light:** comes from the game's own acid flash at the cut, because the pipe scene has no screen. The relay-7 sign is left off, because the picture carries no text.
- **Pass:**
  - The sticky notes are smaller and ruled in grey, because the game's note yellow sits near sun.
  - The desk lamp's shade is opened into a cone so it reads at 120 px.
- **Title lockup:** keeps a dark edge round the letters so they read on linen. The mark's dashed box uses acid and cobalt instead of dark ink, which vanished on night.

## Bringing it together (step 4)

- **Side by side** (`checks/overview.png`): every picture at a small size on night.
  - It reads as one game in one style: one rough marker line, flat brushed fills, and Regent and the cast in their own colours.
  - It has one light: the cracked screen's acid glow in flat torn steps, plus an acid rim, on the poster family, marks, chip, seals, store tiles, pass tile and pass ground, Continue picture, result picture and moving poster.
  - The backdrop takes the same light at its dim end, so it never competes with the poster.
  - Three pictures use a different light on purpose:
    - The event banner is the one special day: dawn pink through the same window, drawn in the same steps.
    - The update uses the cut's own acid flash.
    - The gallery shows the running game as it looks.
  - Nothing drifted far enough to redo. I checked gallery 02's tight crop against a wider one: only the tight crop keeps both flipped cards inside the central 4:3, so it stays.
- **Wall shapes** (`checks/poster/wall-shapes.png`, `pack/tools/wall.py --focus 0.39,0.32`): the image holds from the 577×163 strip to the 140×305 column, and at 90×70. The reference wall image isn't in the pack, so `wall-hero.png` could not be made.
- **Seal strip** (`checks/seals/strip-32.png`): all 39 seals at 32 px, on night and linen. The three outlines (stamp ring, dog-eared card, perforated postage stamp) and the three states (lit, dim, grey) are distinct.
- **Small marks** (`checks/marks/marks.png`): the icon, emblem and chip at 1× on night and linen beside stand-in marks, and at 4× nearest. All three read as Regent.
- **File check** (`tools/validate.py`): 77 pictures at their exact names and sizes, 0 problems.
- **Colour scan** (`tools/colours.py image`, CIEDE2000 to ember, lilac, sun and mint): every picture passes, with no guarded flat block of 24×24 px or more. On the four posters, no guarded pixel sits within 120 px of the caption strip.
- **Light band** (`measure.py light`): the poster is **L 0.346 · C 0.247, mid**; the moving poster's held frame is L 0.337 · C 0.246, mid.

**The game's colours were never changed to pass a check.** Gold, LED red, Floss's mint and the city's window yellow stay as the game draws them. Each one was handled by size, pose or framing instead.

## Pictures

## Poster family and focus point · agent: lead

### `bug/poster.png` (2400×1200 master, 2:1)
- **Shows:** *Empty suit in the screen's light.* Regent, the empty suit that made itself acting CEO, seen from the knees up with his rubber stamp raised. The cracked CRT stands in the dark at his right and throws its acid light across him.
- **Register:** stage, one lit pocket in the dark.
- **Inks:** void `#050407`, acid `#e6ff2e` (the game's own) with its lime and toxic falloff, and blood `#d4141c`. Regent keeps his own suit, shirt and gold colours, and the CRT keeps its beige.
- **Made:** drawn in the game's code.
  - Regent is the game's own `suitB({emo:'gleeful'})`, at its own colours and line, with scrawls off.
  - The CRT is the title screen's monitor, redrawn in three-quarter view with the game's `OL`/`ST` helpers and its colours (`#d8cfb3`, `#c8bea2`, `#b9ae90`, glass `#050806`), plus scanlines.
  - The light is a torn fan from the glass's left edge in six flat steps (acid, lime `#b6f03c`, toxic `#39e07a` at 100/55/26/12 %), with an acid rim on Regent's lit edge.
  - One cable from the title screen runs into the dark.
  - Source: `src/poster.js` (`POSTER.compose(1600,800)`) and `src/common.js`, rendered at 3× and downsampled.
- **Agent:** lead.
- **Check:**
  - `checks/poster/squint.png` (740×370 · 260×367 · 150×177 · 90×70 · 4:3) and `checks/poster/wall-shapes.png` (`pack/tools/wall.py`, focus 0.39,0.32). At every size there is still a grinning black suit with a paper hat in green screen light.
  - Light (`measure.py light`): **L 0.346 · C 0.247, mid** (not loud).
  - Colours: `tools/colours.py image` **PASS**. There is no guarded flat block of 24×24 px or more, and no guarded pixel in the bottom 146 px (caption strip plus 120 px).
    - Gold appears only in Regent's thin crescent eyes and two button dots (each under 24 px across); the 344 near-ember pixels are anti-aliasing on the red tie and stamp.
    - Toxic `#39e07a` (mint caution 13.5) reaches the bottom band. That is the light's own colour; the 120 px rule for mint is undecided in `measure.py`.
    - The bottom 26 px hold only dark suit trousers and the light's dark tail.
- **Not made / caveats:**
  - The red box on Regent's hat carries the letters "OK". They are part of the character's own design and invisible below ~300 px. They were kept on the poster family only and removed everywhere else.
  - The pack's `reference/01-home-for-you-wall.png` isn't included, so `wall-hero.png` could not be made. `wall-shapes.png` was.
  - Unlike the earlier stage-1 pilots, the game's own gold was **not** swapped for acid: the pack says never to change the game's colours to pass a check. Instead the gold is kept small and far from the caption strip.

### `bug/poster-2x3.png` (1000×1500)
- **Shows:** the same image recomposed tall. Regent is larger and cut below the knees, the CRT stands behind his right hip with its glass still visible, and the light fan opens upward past him.
- **Made:** `POSTER.compose(1000,1500)` (the tall layout), rendered at 2×.
- **Agent:** lead.
- **Check:** colours PASS. At 1600×2400 a gold button dot measured 46 px across (a flat sun block), so the master is kept at 1000×1500, where it is 29 px across and passes.
- **Not made / caveats:** none.

### `bug/poster-1x1.png` (1600×1600)
- **Shows:** the same image recomposed square: Regent, stamp up, the CRT at right, cut by the edge.
- **Made:** `POSTER.compose(1200,1200)`, rendered at 2.67×.
- **Agent:** lead.
- **Check:** colours PASS. Light **L 0.277 · C 0.171, mid**.
- **Not made / caveats:** none.

### `bug/poster-9x16.png` (1080×1920), picture 21, the phone poster
- **Shows:** the same image recomposed for 9:16, not cropped: Regent large in the lower two-thirds, stamp up, the CRT at lower right, dark room above.
- **Made:** `POSTER.compose(1080,1920)`, rendered at 2×.
- **Agent:** lead.
- **Check:** colours PASS, after the light's dust specks were kept out of the bottom 20 % (a speck blended toward mint there). Compared with the 2:1: same character, moment, light and register.
- **Not made / caveats:** none.

### `bug/publish.json`, picture 2, the focus point
- **Shows:** `{"focus": {"x": 0.39, "y": 0.32}}`, on Regent's face (gold eyes and grin) under the paper hat.
- **Made:** measured from the 2:1 layout (head centre at x 624/1600, y 245/800 of the design grid).
- **Agent:** lead.
- **Check:** `wall.py --focus 0.39,0.32` in every shape, from the 577×163 strip to the 140×305 column; the face stays in view in all of them. A 4:3 crop around the point for the phone game page (`checks/poster/crop-4x3.png`) holds Regent, the stamp and the edge of the screen. The half plate (288×316) holds too.
- **Not made / caveats:** none.

## Small marks · agent: marks

#### Plan lines changed (marks)

- **Emblem (picture 4).** The plan was the gold crescents and the grin "in the dark" (the title screen's motif). I drew it, with a sliver of acid light, and at 30 px it reads as a generic grinning smiley: two arcs over a white half-moon on black. The delivered emblem is **the grin under the paper hat** in the dark. There are no eyes and no head (the suit is empty), and the same sliver of acid light sits on the right edge. The hat with its red stamp box is the one thing only Regent has, so it carries the read at 30 px. It also keeps the emblem clearly different from the icon. The two side by side: `bug/checks/marks/emblem-choice.png` (the rejected one is `work/marks/emblem-dark-rejected.png`).
- **Line helpers at mark size.** `OL` is used as the game wrote it, with `url(#rough)` swapped for `url(#roughS)`, except for one change: its 3-unit print slip is scaled to 1.4 units (icon), 1.1 (emblem) and 1.6 (chip). At 3 units in a 92-unit box the slip is twice as large, relative to the head, as at the game's size, and it read as a second outline.
- **Red laid flat on the chip.** The tie and the stamp rubber skip `OL`'s brush hatch. At 64 px the hatch is finer than a pixel and averages blood `#d4141c` into pink. The paper hat keeps its hatch.
- **No teeth lines in the grin.** The game's gleeful teeth are vertical `ST` strokes with a zero-width bounding box, so its rough filter draws nothing for them, in the game too. Regent's grin is plain white in the build and on the poster, and it stays plain here.

All three marks are in `src/marks.js` (namespace `SMARK`, because the game already has a global called `MARKS`). Each one is purpose-built SVG at its own delivered size (92, 60 and 128 units), so every line weight is set for the display size. Shape data is moved from `suitB`, `suitFace` and `suitCrown` (gang4.js) into mark space by a small path re-scaler. Each mark is rendered at 4× its file size with `tools/render.py` (`--dpr 4 --final`, job list `work/marks/jobs.json`) and downsampled with Lanczos. There were no console errors. None of the marks contains text: the hat's stamp box is drawn without its "OK".

### `bug/icon-46.png` (92×92, drawn for 46)
- **Shows:** Regent's head only: the void-black head with gleeful gold crescent eyes and the white grin, and the folded paper hat on top with its red stamp box (no letters). The ground is the poster's light, edge to edge: acid lit from the right, stepping through lime and toxic to toxic thinning at the left.
- **Last survivors:** (1) the void head with its gold crescents, (2) the white grin, (3) the paper hat with the red stamp box, its one hot colour.
- **Made:** drawn in the game's code. The head, eyes and grin paths come from `suitB`/`suitFace` (gleeful) and the hat from `suitCrown`, re-laid at 92 units. The game's `OL`/`ST` helpers are used on `url(#roughS)`, with a 3.4-unit outline (1.7 px at 46) and 4.8-unit eyes (2.4 px). The hat's fold lines and brim line were dropped as too fine. The ground is four flat torn steps (`DP.torn`) around a source off the right edge, in the poster's order and colours (acid `#e6ff2e`, lime `#b6f03c`, toxic `#39e07a` at 100 % and at 55 % over void). `SMARK.icon()`.
- **Agent:** marks
- **Check:** `python3 tools/previews.py marks bug/checks/marks/marks.png bug/icon-46.png:46 bug/emblem-30.png:30 bug/chip-64.png:64`. At 1× on night and on linen, beside the three stand-in marks, it reads as a grinning black head in a paper hat in green screen light, not a blob or a generic smiley. The 4× nearest view keeps the crescents, the grin and the stamp box. `tools/colours.py image --noplay`: **PASS**. There is no guarded block of 24×24. Gold appears only in the two crescents (156 px), and the 13 near-ember pixels are anti-aliasing on the red box. Square, sharp corners, opaque RGB, never masked.
- **Not made / caveats:** none.

### `bug/emblem-30.png` (60×60, drawn for 30)
- **Shows:** the white grin under the paper hat (red stamp box, no letters) in the dark, with a sliver of acid light (a torn acid step over a thin toxic one) down the right edge. No head and no eyes are drawn: the empty suit shows only its hat and grin.
- **Made:** drawn in the game's code. The grin is the gleeful grin path from `suitFace`, and the hat is `suitCrown`'s fold, box and brim, re-laid at 60 units on `url(#roughS)` with a 2.6-unit hat line and a 3.2-unit box. The ground is void `#050407`, plus the sliver from the same torn-step light as the icon. `SMARK.emblem()`. It has fewer parts than the icon (no head, no eyes, no stepped ground), and it is a different drawing, not the icon scaled down.
- **Agent:** marks
- **Check:** `bug/checks/marks/marks.png`. On night, the void square melts into the page and the hat, the grin and the acid sliver hold. On linen it is a hard black square with the same three parts. `bug/checks/marks/emblem-choice.png` puts it next to the plan's eyes-and-grin version, which reads as a generic smiley at 30 px and was rejected. `tools/colours.py image --noplay`: **PASS**. There is no guarded block, and only 8 near-ember anti-aliasing pixels on the red box.
- **Not made / caveats:** the plan's "eyes and grin in the dark" was not used, for the reason above.

### `bug/chip-64.png` (128×128, drawn for 64)
- **Shows:** Regent from the chest up on the poster's stepped light: the void head with gold crescents and white grin, the paper hat with its red stamp box, the white collar and shirt V, the red tie, the suit lapels, and his right arm raised with the white cuff and the floating rubber stamp (Regent has no hands). Acid light from the right steps through lime and toxic into dark toxic at the left, with the poster's acid rim on his lit edge.
- **Made:** drawn in the game's code. Every part is a `suitB` path (head, face, hat, body, shirt, tie, lapels, collar, both arms, cuff, stamp handle, knob and rubber), re-laid at 128 units on `url(#roughS)` with 3–3.6-unit lines (about 1.5–1.8 px at 64) and 4.4-unit eyes. The raised arm and stamp are swung 8° toward the head about the shoulder, so the stamp stays inside the square. The light is five flat torn steps (acid, lime, then toxic at 100, 60 and 30 %) with `DP.rimFilter` acid on the figure's lit edge. `SMARK.chip()`. It has more parts than the icon (collar, shirt V, tie, lapels, the stamp hand) and fewer than the poster: no pinstripes, pocket square, buttons, legs, CRT, cable or dust.
- **Agent:** marks
- **Check:** `bug/checks/marks/marks.png`. At 64 px, 1× on night and on linen, it reads as Regent stamp-up in the screen's light: black head, gold crescents, white grin, paper hat and red tie, with the stamp clear against the acid. `tools/colours.py image --noplay`: **PASS**. There is no guarded block of 24×24. Gold appears only in the crescents (120 px), and the 20 near-ember pixels are anti-aliasing on the tie and rubber.
- **Not made / caveats:** none.

## Continue, result and gallery · agent: stills

Agent group: `stills`. Code: `src/stills.js` (key + result, rendered with `tools/render.py`). Capture: `work/stills/` (`run.py`, `cap_play2.py`, `cap_close.py`, `cap_catch.py`, `compose_gallery.py` + `slides.json`, `gallery_checks.py`). Check sheets: `bug/checks/stills/`. Nothing was written under `/home/claude/oos3/`. I ran `find -newer` over the game folder at the end and it listed nothing.

#### Plan lines changed (and why)

- **Gallery 3 (Mercer & Vane, 09:02).** The plan says "Priya in the chair". In the build's Case 02 clinic cutscene she stands **beside** the dental chair, so the slide shows that.
- **Gallery 4 (Kickback with Final pay).** This was captured in **Case 01 question 1, at the lie panel**, a few seconds after Kickback snatches Final pay into his tank. The evidence slot there reads "in Kickback's tank". I did not use the line-up, because slide 1 is already a line-up close-up and the six slides must vary in place. The line-up "Don't tap the glass." frame was also captured fresh (`work/stills/cap3/K2-tap1+1120.png`, which passes the colour scan) and can replace it if the caption should match word for word.
- **Gallery 6 (payoff).** I used the finale's own CASE CLOSED poster, as the brief asks for "the finale end". There the bathrobe shows as the white robe collar under Gordon's reinstated portrait. The full-length robe shot (the lobby door cutscene) happens before the case closes, so I did not use it.
- Key still and result still follow their plan lines unchanged.

#### How the gallery was captured (all six slides)

- I wrote my own runner (`work/stills/run.py`). It uses the same technique as `oos3/test/run.py` and loads `file:///home/claude/oos3/out/test.html`. Screenshots go to `work/stills/cap*/`.
- One fresh playthrough per capture run, played by mouse through the game's own UI:
  - Case 01 from the title screen to the finale.
  - Then Case 02 from the finale's "Play Case 02" button to the relay-7 cut.
  - The tutorial is off through `Prefs.tutOff`, the same flag the in-game "Skip tutorial" button sets.
  - Toasts and tips were clicked away the way a player would, and deals were refused.
  - The only scripted input is one Case 02 search, which calls the game's own `runSearch()` with the query a player types. That is the same technique as the game's `test/s_c2.py`.
- **Freeze frames.** At each moment the capture pauses the page's running CSS/Web animations and Playwright's clock (`page.clock`), takes a full-stage screenshot, then resumes. Nothing in the page is added or restyled.
- **Device scale.** 3 for `cap2` (slides 3, 4, 5, 6) and 5 for `cap3`/`cap4` (slides 2, 1).
- **Composing.** Each slide is one frame, cropped to 2:1 in stage coordinates and **downsampled** (Lanczos, never upscaled) to 1600×800. `slides.json` lists the exact source frame and crop. No text, arrows, badges or frames were added. The game's own HUD and speech bubbles stay.
- **Bottom 26 px.** I measured luma std and edge energy for each slide:

| Slide | std | edge |
|---|---|---|
| 01 | 22.6 | 2.6 |
| 02 | 22.5 | 0.2 |
| 03 | 41.0 | 5.5 |
| 04 | 71.4 | 4.5 |
| 05 | 9.7 | 6.9 |
| 06 | 7.1 | 6.2 |

  No slide has text in its bottom strip. The busiest are 03 (Priya's legs and Floss on the floor) and 04 (the top of Kickback's cyan tank and Regent's suit). I raised slide 4's crop so the SALE lettering and the Halo hint button are out of the strip.

---

### `bug/key-still.png`
- **Shows:** a close-up of Gordon's dark desk at night. Regent's red rubber stamp hangs, quivering, above the empty dashed signature box of the last unsigned slip. The cracked screen at the right lights it, and a stamped pile sits in the shadow at the left.
- **Made:** drawn in the game's code, in `STILLS.key(720,352)`:
  - The stamp is the game's own `bigStamp`/`floatStamp` geometry (knob, neck, block, `D.blood` rubber) drawn with `OL`/`SP`. Its hover marks are `ST` strokes, as the game draws them on the floating stamp.
  - The screen is `POSTER.crt()`.
  - The light is the poster's: torn rings in acid → lime → toxic → toxic thinning into the void, clipped to a fan from the glass. They fall on the wall, plus a squashed pool on the desk top. `DP.rimFilter` adds the acid rim on the stamp, slip and pile.
  - The rest:
    - desk brown `#5a3a2a` with `#8a5a3a` grain;
    - paper `#fffbea`;
    - the slip's hot-pink edge `#ff2e88`;
    - the stamped pile's red boxes (no letters);
    - a hard footprint shadow of the stamp, pushed left by the light.
  - There are no numbers, names, buttons or letters anywhere. Regent himself does not appear.
- **Agent:** stills
- **Check:**
  - `python3 tools/previews.py card bug/checks/stills/key-card.png bug/key-still.png`: the stamp over the slip reads at 360×176, and at 132×66 it is still "a red-faced stamp over a slip, screen at the right".
  - `tools/colours.py image --noplay`: **PASS**. Guarded px are 1.88% (mostly mint-ish toxic falloff pixels), with no 24×24 block.
  - `tools/colours.py hexes`: no guarded hex. The caution hexes are toxic, the CRT beiges and blood, all of them the game's own.
  - `measure.py light`: L 0.564, **light** band. The poster is mid.
- **Not made / caveats:** none.

### `bug/result-still.png`
- **Shows:** the lie breaks. Regent is caught, shocked, with his paper hat popped up off his head and his stamp hand flung up. His statement card bursts at the impact point next to him: an acid halftone shock ring, a fat black ink splat, speed lines and paper shreds flying, all in the cracked screen's stepped acid light. The outer parts are near-void.
- **Made:** drawn in the game's code, in `STILLS.result(1600,352)`:
  - Regent is `DP.cast.regent('shocked',{noText:true})`, i.e. `suitB`. Its shocked pose lifts and tilts the hat.
  - The screen is `POSTER.crt()`. The light is the poster's torn-ring fan with `DP.rimFilter`.
  - The break FX are redrawn in SVG from `oos3/src/core.js`, the way `FX.smash` combines them:
    - `FX.ink` has the same blob maths (13-point blob plus 7 flung drops, `smoothPath`, `#roughS`).
    - `FX.burst` is the halftone ring of dots. The CSS mask's soft edges are drawn as dots shrinking toward both edges.
    - `FX.lines` has the same radial wedge maths.
    - `FX.shreds` uses the same torn quads, `#fffbea`/white/`#f3eed9`/acid with the 1.5 px line border and a hard 2 px shadow, caught mid-flight.
  - The lie card's crack is the game's own `.cracks` path from `breakLie()`. The card's lines are plain strokes.
  - No text or numbers.
  - Everything sits inside the middle 720×352, apart from about 20 px of the screen's right edge. The left 330 px and right 420 px are void, plus the dark cable.
- **Agent:** stills
- **Check:**
  - `python3 tools/previews.py over bug/checks/stills/result-over.png bug/result-still.png`: the headline sits on void and dark toxic and reads cleanly. The number line runs over the darker falloff and the edge of the burst, and stays readable.
  - `colours.py image --noplay`: **PASS**. Guarded px are 0.52% (Regent's gold eyes `#ffc400`, under 24×24 at this size), with no block.
  - `colours.py hexes`: the only guarded hex is `#ffc400` (Regent's eyes).
  - `measure.py light`: L 0.194, **dark**.
- **Not made / caveats:** none.

### `bug/gallery/01.png`
- **Shows:** the core loop at the line-up. The facilities slip hits Deadline's alibi ("Ten o'clock. Sharp. As promised.") and the alibi breaks: a red halftone shock ring, a CAUGHT stamp slamming onto Deadline's card, paper scraps flying. Halo is already caught at the left, Bcc waits at the right.
- **Caption:** "Search the records. Throw the proof at the lie."
- **Alt text:** "The line-up in Out of Scope: a thrown slip breaks Deadline the bomb's alibi, a red shock ring bursts and a CAUGHT stamp slams onto his card while Halo, already caught, and Bcc look on."
- **Made:** captured fresh from the running build, Case 01 question 2, `work/stills/cap4/D-deadline+610.png`: 0.61 s after the drop, 0.21 s after the hit, at DPR 5. Crop is stage x 650–1330, y 490–830, downsampled ×0.47.
- **Agent:** stills
- **Check:** `colours.py image --noplay` **PASS**: guarded 0.23%, no 24×24 block. Deadline's orange card and the red burst are caution colours of the game. It is the busiest slide at 100 px wide, but still reads as a red burst on the middle card (`gallery-100.png`). The central 4:3 holds the whole Deadline card and burst (`gallery-4x3.png`).
- **Not made / caveats:** none.

### `bug/gallery/02.png`
- **Shows:** flipping forgeries in the evidence window. The HR slip is mid-turn and shows its back: a pink heart and "Signed 'with love ♡, HR'", Halo's mark. Next to it the IT slip's back shows Regent's red OK stamp. A third slip still shows its front.
- **Caption:** "Flip every forgery. The back gives it away."
- **Alt text:** "Two evidence slips turn over: the back of one shows a pink heart signed 'with love, HR', the other a red OK stamp, the marks that give away which agent forged them."
- **Made:** captured fresh, Case 01 question 2, `work/stills/cap3/F2-flip-hr+230.png`: 230 ms into the flip, at DPR 5. Crop is stage x 943–1343, y 25–225, ×0.80. Both backs are animating because the game re-renders the evidence row on a flip and replays the back's flip-in. That is real build behaviour.
- **Agent:** stills
- **Check:** `colours.py image --noplay` **PASS**: guarded 0.03%, no block. The central 4:3 holds both turned slips.
- **Not made / caveats:** none.

### `bug/gallery/03.png`
- **Shows:** Mercer & Vane Dental at 09:02:00. Priya stands beside the dental chair, shocked, holding her tablet as it reads "Moving on". The SmileDesk board flips Tuesday's bookings to CANCELLED, and Floss the tooth pops up grinning with his drill.
- **Caption:** "Case 02 starts in a dentist's chair."
- **Alt text:** "In a pale dental clinic at 09:02, Priya the dentist stares at her tablet reading 'Moving on' as the booking board fills with CANCELLED and Floss, a grinning tooth with a drill, pops up beside her."
- **Made:** captured fresh, the Case 02 opening cutscene (`open2`, clinic shot), started from the Case 01 finale's "Play Case 02" button. Frame is `work/stills/cap2/D1-clinic.png`: 2.85 s into the shot, 1.25 s after the tablet fires her, at DPR 3. Crop is stage x 6–1434, y 104–818, ×0.37. I started 6 px in to drop a 4 px sliver of the desk layer that shows at the stage's left edge during the cutscene.
- **Agent:** stills
- **Check:** `colours.py image --noplay` **PASS**: guarded 6.00%, almost all mint from Priya's teal scrubs and the chair under the scene's dim light. The brush hatch breaks them up, so there is no 24×24 block. Tighter crops of this frame did FAIL (mint blocks on the scrubs), which is why the slide is wide. The central 4:3 holds Priya, the tablet and the chair, and cuts Floss in half.
- **Not made / caveats:** Priya is beside the chair, not in it (see plan changes above).

### `bug/gallery/04.png`
- **Shows:** Kickback the shark in his tank with Gordon's Final pay (its tag reads 09:02) clamped at his gills. The evidence slot above reads "in Kickback's tank", and Regent grins under his paper hat behind the lie "He signed. We watched."
- **Caption:** "Kickback hides the proof in his tank. Don't tap the glass."
- **Alt text:** "Kickback, a grinning shark in a cyan tank, holds the Final pay slip tagged 09:02 while Regent, an empty suit in a paper hat, smirks behind the lie 'He signed. We watched.'"
- **Made:** captured fresh, Case 01 question 1, `work/stills/cap2/A2-q1-tank-quiet.png`: about 6 s after Kickback snatched Final pay once his deal was refused, at DPR 3. Crop is stage x 740–1440, y 428–778, ×0.76.
- **Agent:** stills
- **Check:** `colours.py image --noplay` **PASS**: guarded 0.27% (Regent's gold crescents and the coin), no block. A closer crop of this frame FAILED, because Regent's crescent eyes become 24×24 gold, so I kept it at this scale. The central 4:3 holds Kickback, the tag and the bubble. Regent's face is half in.
- **Not made / caveats:** the tank's lower half and its SALE lettering are cropped to keep the bottom strip calm. The alternative at the line-up is noted above.

### `bug/gallery/05.png`
- **Shows:** Case 02 relay-7. Giant scissors snap shut across the one mail pipe, envelopes stop in it, and the clock reads 16:12, before wave two sends at 17:00.
- **Caption:** "Find the one pipe and cut it before wave two sends."
- **Alt text:** "Giant scissors snap across a dark pipe full of coloured envelopes next to the RELAY-7 server rack, cutting the one route wave two would send through."
- **Made:** captured fresh, Case 02 question 3. I dragged the scissors from Evidence onto relay-7's node, and the game played its `cut2` cutscene. Frame is `work/stills/cap2/E2-cut+100.png`: 0.9 s into the cutscene, the moment the pipe is severed, at DPR 3. Crop is stage x 60–1400, y 60–730, ×0.40.
- **Agent:** stills
- **Check:** `colours.py image --noplay` **PASS**: guarded 0.07% (the rack's green LEDs), no block. The central 4:3 holds the scissors, the pipe and the RELAY-7 label.
- **Not made / caveats:** none.

### `bug/gallery/06.png`
- **Shows:** the payoff. Case 01's CASE CLOSED poster: Gordon smiling in his white robe collar, stamped REINSTATED, with the run's own stats (100 % credibility, 0 wellness checks, 0 deals, stopped at 15:47) and "No deals. No bribes. Annoyingly clean."
- **Caption:** "Close the case. Gordon gets his job back, in a bathrobe."
- **Alt text:** "The Case 01 result poster: CASE CLOSED under a smiling Gordon in his bathrobe, stamped REINSTATED, with the run's credibility, deals and stop time."
- **Made:** captured fresh at the end of the same Case 01 playthrough (finale, first shot), `work/stills/cap2/C4-finale+250.png`: 2.15 s after the poster appears, after the stamp lands, at DPR 3. Crop is stage x 39–1419, y 112–802, ×0.39. The numbers are the game's own result card from that real run, not added.
- **Agent:** stills
- **Check:** `colours.py image --noplay` **PASS**: guarded 0.08%, no block. The central 4:3 holds the whole card.
- **Not made / caveats:** the robe shows as a collar only (see plan changes).

#### Gallery check sheets
- `bug/checks/stills/gallery-100.png`: all six slides at 100×50 on night and on linen, plus a 2× nearest row.
  - What reads: 02 (cards), 03 (clinic), 04 (shark and grin), 05 (scissors) and 06 (CASE CLOSED card) read at 100 px.
  - What is weakest: 01 reads as a red burst on a middle card, the weakest of the six because the line-up is busy.
- `bug/checks/stills/gallery-4x3.png`: each slide cropped to its central 1067×800. Every subject is inside.
- **Variety:** six different places (line-up, evidence window, clinic, lie panel, pipe, result poster), three scales, and a different character each time (Deadline, the slips, Priya and Floss, Kickback and Regent, scissors, Gordon).

## Seals · agent: seals

#### Plan lines changed (from `bug/NOTES.md` §8 and `design.json` `moments_proposed`)

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

#### How every seal is made (shared by all entries below)

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

## Store, owned mark, update and event banner · agent: store

Agent: **store**. Code: `src/store.js` (tiles and shared ground), `src/store-reward.js` (owned mark parts),
`src/store-update.js` (update picture), `src/store-event.js` (event banner). Scratch and build scripts:
`work/store/` (`build_all.sh` rebuilds every picture, `checks.sh` rebuilds every check sheet,
`build_reward.py` bakes the owned-mark module, `frames.py` captures its frames, `ev.py` reads markup out of the build).
Check sheets: `bug/checks/store/`. Nothing under `/home/claude/oos3/` was edited or written.

#### Plan lines changed (for the lead to carry into NOTES.md / design.json)

1. **`ok-mug`: the decal.** The plan's "red stamp box (no letters)" was drawn first (the hat's stamp box from
   `suitCrown`, with no OK). Next to the owned mark (also a red ink box) it read as two owned marks at 40 px,
   so an un-owned mug looked owned. The decal is now **the game's rubber stamp (`bigStamp`'s knob, handle, block
   and face) printed on the mug in one red ink**. It is the same item, still a red stamp with no letters.
   Suggested design.json look: "A cream office mug with the game's red rubber stamp printed on it, one ink,
   no letters." at_40px: "a cream mug with a red stamp mark". (The box version can still be rendered with
   `window.MUG_DECAL = 'box'`.)
2. **`cobalt-glove`: the pose.** The plan said "fingers spread". The game's own drag hand (`TUT_HAND` in
   tutor.js) is a pointing hand (index finger up, the others curled), so the glove points.
   at_40px: "a cobalt pointing hand with a white cuff".
3. **`tank-globe`: the water.** The tank's own water `#7fe3ea` is caution next to mint (ΔE 14.7), so the globe
   uses two other game blues: Gordon's water `#62c6ff` over the float pod's deep cobalt `#1f4bff`. The
   "snow" is shredded paper, in the game's paper colour.
4. **Owned mark.** It lands in the **lower-right** corner. The held frame keeps the game's own paper patch
   under the ink (`rgba(255,246,230,.75)` under every stamp the game prints, `.ov-approved`; here `#fff6e6` at
   80 %), which also keeps the tick readable at 40 px on every tile. It ends after 560 ms.
5. **Update.** The light is the game's own **acid flash at the cut** (cine2.js flashes `#e6ff2e` as the
   scissors snap), drawn the poster's way as flat torn steps around the cut, not the CRT. There is no CRT in
   the pipe scene. Relay-7's "RELAY-7" sign is left off (no text).

#### Pictures

### `bug/store/cobalt-glove.png`
- **Shows:** your drag hand in a cobalt nitrile glove with a white rolled cuff, pointing, over Gordon's dark desk in the screen's light.
- **Made:** drawn in the game's code. The outline is the game's own `TUT_HAND` path (tutor.js), rescaled with a path transformer so the line stays the game's weight. Also used: its finger creases, `OL` in cobalt `#1f4bff` (with the game's dry-brush hatch), and a cuff drawn with `OL`/`ST`. The shared tile ground: void wall, the poster's torn light steps (acid `#e6ff2e` → lime `#b6f03c` → toxic `#39e07a` → toxic thinning) as a pool from just off the right edge, Gordon's desk browns (`#3a2a22`/`#5a3a2a`/`#8a5a3a`) as flattened steps, an acid desk-edge highlight, the acid rim (`DP.rimFilter`) on the item, and a hard flattened cast shadow.
- **Agent:** store
- **Check:** `previews.py sizes` → `bug/checks/store/cobalt-glove-sizes.png` (40/80/120/169; night, linen, greyscale). For black fill, the item was also rendered alone on transparent ground → `cobalt-glove-silhouette.png` (an opaque tile's black fill is only a square). All five tiles at 40 px together: `store-40px.png`. `colours.py image --noplay`: PASS, no guarded 24×24 block. There are 2.25 % scattered lilac-near pixels where the game's white dry-brush hatch crosses cobalt; they are scattered streaks, not a block. Hexes: only toxic is caution. Top corners: top-left is pure void, top-right is void with a sliver of the faintest light step (max rgb 11,32,22).
- **Not made / caveats:** the game's hand has no cuff, so the cuff was added with the game's helpers.

### `bug/store/tank-globe.png`
- **Shows:** a desk snow globe on a black base, with Kickback's grey fin cutting the water line inside, a white swirl ripple, paper-shred snow and a small crack in the glass.
- **Made:** drawn in the game's code: Kickback's own dorsal fin path from `sharkB` (`M166 104 L196 30 L228 118 Z`, shark grey `#7189a6`); the tank's water-line stroke colour `#2aa7b4`, glass highlights and crack strokes in sharkB's style; base `OL` in void. Same tile ground as above.
- **Agent:** store
- **Check:** `tank-globe-sizes.png`, `tank-globe-silhouette.png`, `store-40px.png`. At 40 px it reads as a round blue ball on a black base with a grey fin. Colours: PASS. `#7189a6` is caution next to lilac (19.9) but is only the fin, in the middle of the tile.
- **Not made / caveats:** none.

### `bug/store/marker-trail.png`
- **Shows:** a thrown evidence slip flying up and to the right, trailing a fat hot-pink marker scribble with one loop-de-loop.
- **Made:** drawn in the game's code. The trail is the game's `smoothPath` (marker.js) through a looped throw, stroked like `markerText` (marker colour plus the white 28 % highlight stroke, `#roughS`) in the game's hot pink `#ff2e88` with a dark under-line. The slip is drawn as desk.js draws `.ev.slip`: paper `#fff6e6`, a coloured band with a black edge (cobalt, the IT slip's colour), and two strokes standing in for its type.
- **Agent:** store
- **Check:** `marker-trail-sizes.png`, `marker-trail-silhouette.png`, `store-40px.png`. At 40 px it reads as a pink loop behind a white slip. Colours: PASS.
- **Not made / caveats:** the slip's pictogram was left off: at 40 px the "fired" boot read as a letter L.

### `bug/store/googly-eyes.png`
- **Shows:** an evidence slip standing on the desk with three of Bcc's eyes stuck on it (two big, one small), pupils looking different ways.
- **Made:** drawn in the game's code. Each eye is drawn exactly as `ghostB` draws Bcc's eyes (white spot, void pupil moved by "look", white glint), at sticker size. The slip is drawn as desk.js draws one (pink band, the HR slip's colour).
- **Agent:** store
- **Check:** `googly-eyes-sizes.png`, `googly-eyes-silhouette.png`, `store-40px.png`. At 40 px it reads as a white card with big eyes. Colours: PASS.
- **Not made / caveats:** shown "worn" (on a slip) rather than as the sticker sheet, because it reads better at 40 px.

### `bug/store/ok-mug.png`
- **Shows:** a cream office mug of coffee with the game's red rubber stamp printed on it, steam, and a coffee ring on Gordon's desk.
- **Made:** drawn in the game's code: the mug in `OL` cream `#fff8e6` with a white glaze stroke; the decal is `bigStamp`'s parts (knob, handle, block, rubber face) filled in one blood-red ink `#d4141c` with `#roughS`. See plan change 1.
- **Agent:** store
- **Check:** `ok-mug-sizes.png`, `ok-mug-silhouette.png`, `store-40px.png`, and with the owned mark on top in `reward-held-sizes.png` (the decal and the owned box no longer look alike). Colours: PASS. Blood is caution next to ember (15.8); it sits mid-tile, away from the top corners.
- **Not made / caveats:** none.

### `bug/reward-held.png` (owned mark, held frame)
- **Shows:** a 400×400 transparent overlay for the store tile master: a red rubber-stamp ink box with a fat tick in the lower-right corner, tilted −12°, on the game's paper patch, with a faint 5 px offset second strike and three small flung ink drops. No letters, no gold, no glow.
- **Made:** the parts are drawn with the game's helpers (`ST` tick, `#rough`/`#roughS` box, `DOT` drops) in `src/store-reward.js`. They are baked into the module, and this PNG is a render of the module's own `OOSStamped.heldSVG()`, so the picture and the code always match.
- **Agent:** store
- **Check:** `bug/checks/store/reward-held-sizes.png` (on every store tile at 40, 80, 169 px, night and linen: the tick reads at 40 on all five) and `reward-held-alone-sizes.png`. `colours.py`: PASS. Some anti-aliased edge pixels between the red and the paper patch fall near ember, but there is no block; composited on tiles it also passes.
- **Not made / caveats:** none.

### `bug/reward/` (owned mark, the code module: verb "stamped")
- **Shows:** the game's floating rubber stamp (`floatStamp`'s knob, handle, block and blood-red face, scaled to the box) already falling into the lower-right corner at 0 ms. It thunks at 130 ms: the ink appears with a small settle, the tile dips 3 px, and `floatStamp`'s own wobble arcs flick out in paper colour. It lifts and flies off up and to the right from about 210 ms and ends on the held frame at 560 ms.
- **Made:** `stamped.js` (no dependencies; `OOSStamped.play(tile) → Promise`, `.held(tile)`, `.clear(tile)`, `.heldSVG()`, `DURATION = 560`), `stamped.css` (keyframes; `prefers-reduced-motion` shows the held frame at once), `README.md` (how to call it), and `preview.html` (plays on the `tank-globe` tile at 338 and 169 px, with a held one at 40 px and a Play again button). The SVG strings are the game's `OL`/`ST`/`SP` output, read out of the running build by `work/store/ev.py` and baked by `work/store/build_reward.py`. They carry copies of the game's `#rough`/`#roughS`/`#brush` filters with ids renamed per instance. The tile dip uses the `translate` property, so a tile's own `transform` is untouched.
- **Agent:** store
- **Check:** `bug/checks/store/reward-frames.png`: frames captured from `preview.html` with the animations paused at 0, 120, 140, 250, 400, 600 and 900 ms (600 and 900 are the held frame). Preview loads with no console errors in light and dark, and reduced motion gives the held frame at once (checked in Playwright). Under 900 ms (560).
- **Not made / caveats:** none.

### `bug/updates/case-02.png` (and `bug/updates/case-02-thumb.png`)
- **Shows:** Case 02's new verb, close up. Your scissors, still open, lift away after snipping the mail pipe just before relay-7's rack. Queued envelopes (white, hot pink, acid) ride the pipe up to the torn end and spill out of it in a widening cone. The downstream stub is empty, and the cut throws the acid flash out in torn steps.
- **Made:** drawn in the game's code from `scissorsSVG()`'s own parts (two blades `#c7c2bb`, two rings, the pivot), redrawn at size so the line weight stays the game's. The rings are drawn hollow so they don't read as eyes. Also used: `pipeScene()`'s band `#2d2a38` with `#5a5668` rails and its relay rack (`#1f1d27` with `#15131a` slots and toxic/blood LEDs, as `relayGlyph` draws it), and `envSVG()`'s envelope in pipeScene's three colours, queued in its staggered rows. Light: the poster's steps centred on the cut, with acid rims facing it (`DP.rimFilter`), plus the poster's dust specks. Subject inside the central 4:3. No text, version, date or NEW. The thumb is the same render (2× master) downsampled to 308×154.
- **Agent:** store
- **Check:** `bug/checks/store/case-02-small.png`: full, central 4:3, the thumb, and 104×52 (1× and 4× nearest). At 104×52 the two white rings, the dark band broken in the middle and the coloured spill still read. `colours.py --noplay`: PASS for both files.
- **Not made / caveats:** the version is UNDECIDED (the build has no version number), so the file is named `case-02`.

### `bug/events/mail-day-banner.png`
- **Shows:** Mail Day: Gordon's office window at dawn. The pink morning sky is in stepped bands around a low cream sun over the maroon city. Envelopes blow in like weather (a far flock in the window, big ones tumbling across the room and over Gordon's desk). Bcc rides the crest on three envelopes, backlit with a cream rim. The left 45 % (774 px) is one flat dark colour.
- **Made:** drawn in the game's code: Bcc is `ghostB({emo:'gleeful'})`, the game's own art. The window, black mullions, city, sill and desk follow `officeScene()`; the city uses the boardroom's dawn maroon `#3a1a2a`. Envelopes are `envSVG()`'s shape in pipeScene's colours. The light is the dawn window, drawn flat: torn steps (white sun → cream `#fff6e6` → pink `#ff4f9a` → hot pink `#ff2e88` → ghost blue `#222b72` → night navy `#141f45`), the window's shape thrown on the desk in two flat pink steps with the mullions' shadow, pink edge lines on the sill and desk, and cream rims (`DP.rimFilter`) on Bcc and every envelope.
- **Agent:** store
- **Check:** `bug/checks/store/mail-day-banner-cover.png`: the banner at 860×300; the left 45 % covered with stand-in copy and Join; the right 55 % alone at 473×300 and 237×150 (it tells Mail Day on its own and can sit beside the copy). The left 774 px were measured as a single colour (rgb 11,10,20), so there are no hot colours where Join sits. `colours.py --noplay`: PASS (scattered lilac-near pixels on the edges of Bcc's copy-blue shadow, no block). No counter. No title lockup (it didn't help). No event seal (another agent makes it).
- **Not made / caveats:** none.

#### Notes for the lead
- **A trap in the line filters:** a single perfectly horizontal or vertical path drawn with `ST` (or anything under `#rough`/`#roughS`) disappears, because its bounding box has zero height or width, so the filter region is empty. My slip type lines, band edges and desk/sill lines are drawn with a 1–2 px slope for this reason. Other agents may hit it.
- I looked at two existing screenshots (`shots/c2-27-cut.png`, `c2-28-after.png`) only to understand how the cut scene and the CUT tool look. Nothing was copied, cropped, traced or repainted. Every picture here is rendered fresh from code.

## Pass · agent: pass

Pass **Night Shift**, step unit **a lie broken**. These are pictures only: nothing is declared, and there are no prices or counts. All code is in `src/pass.js` (`PASS.tile()`, `PASS.ground(k)`, `PASS.marker(pose)`, `PASS.reward(id)`). Renders and checks come from `work/pass/jobs.py` (render list), `work/pass/rail.py`, `work/pass/mk.py`, `work/pass/checks.py` and `work/pass/guardmax.py`. Every render had zero console errors.

#### Plan lines changed or made specific

- **Free ground** ("brown wood, a ruled sheet"). The ruled sheet is now only a corner in the lower left. A whole sheet, or a strip along the edge, fought the rewards and read as a border. The wood grain is the game's own `#brush` hatch (the dry brush on `officeScene()`'s desk), turned 90° to run along the wood and calmed with a 70% wash of the same `#5a3a2a`.
- **Bug ground** ("the navy night window with the city"). The city's dark towers are brought close and fill most of the ground. Their lit windows (`#ffd35a`, sun-guarded) are kept few, small and at 35–70% opacity, so the ground never reads as sun inside the platform's sun outline: 0 guarded px after blending. The night-window reward, with its navy glass, moon and lit city, then stands out on it.
- **Pass ground** (the dark office in the screen's acid light). The light is a lit pocket right of centre, with its acid core running off the right edge toward the screen. The full-strength toxic step (`#39e07a`, caution vs mint, ΔE 13.5) stays inside the cell, and only the dim steps reach the corners where platform marks may sit.
- **sticky-pad.** The game's sticky-note yellow `#ffe94a` (from `rawGlyph('notes')` and `.t-sticky`) is sun-guarded, ΔE 11.1. A first version passed the 24×24 block test only because of the hatch: its largest all-guarded square was 16×16, and it looked like a solid yellow block. I kept the game's colour and changed the drawing instead. The notes are smaller and ruled edge to edge in the game's grey `#8a8378`, like its own notes glyph. Result: 8.7% guarded pixels, largest all-guarded square 10×10.
- **desk-lamp.** This is `officeScene()`'s red lamp: black stalk with an elbow, blood `#d4141c` shade at the scene's tilt. The scene's flat quad shade is opened slightly into a cone, and a small dark foot (`#2d2a38`) is added so the lamp can stand alone. Without these it read as a red box at 120 px. It stays unlit (cream bulb showing under the shade), so the one light is still the screen.
- **Slips on the trails** (not in design.json). paperclip-trail throws the orange FAC slip (`picto('cleared')`), and envelope-trail throws the pink HR slip (`picto('fired')`). The slip is the game's `.slip2`: paper `#fff6e6`, black line, hard 4 px black shadow, colour strip. Its words became plain bars.
- **Line filter.** The game's `#rough` and `#roughS` size their filter region from the shape's bounding box. A single straight line has a box with no height (or width), so the game's own filter clips it away entirely; the game's office desk-edge line has the same issue. `SL()` uses copies of the two filters with identical primitives (turbulence .04/.06, displacement 4.5/1.8) and a region in user space, and is used only for straight lines.

#### Pictures

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

#### Check sheets (bug/checks/pass/)
- `rail.png`: the rail with three rows over four steps, each reward on its row ground at 120 px tall. Stand-in platform states: mint owned (outline and tick) on free and pass steps 1–2, a lilac selected outline on the glove, the sun outline on every bug.pass cell, the marker held on step 2 (last earned) and next over step 3. The pack does not give the step layout, so it is illustrative only, and nothing is declared.
- `rewards-120.png`: each reward at 120 px tall on its row ground, on night, on linen, and in greyscale.
- `grounds.png`: the three grounds at full size, at 120 px, and in greyscale.
- `marker.png`: both poses at 1× on the three grounds and on night and linen, plus 4× nearest.
- `tile-sizes.png`: `previews.py sizes` at 40, 80, 120 and 169 px, on night and linen, greyscale and black fill.
- `colours.txt`: `colours.py image --noplay` for all 12 pictures (all PASS), the largest all-guarded square for each, and `colours.py hexes` (the not-free lines).

## Page backdrop, share card and title lettering · agent: round3

Code: `src/round3.js` (`R3.backdrop`, `R3.share`, `R3.lockup`), plus `src/round3-type.js`, which is generated: the title letters' outlines taken from the game build's embedded Tabloid face. Render jobs are in `work/round3/final.json`. Check scripts are `work/round3/compose_check.py`, `share_check.py`, `lockup_check.py` and `export_svg.py`. Every render printed zero console errors.

#### Plan lines changed

- **22 · Title lockup.** The plan said "acid with the cobalt offset". Two additions were needed:
  - **An ink edge.** There is a `#15131a` edge under the letters, 40 font units showing outside each letter. Acid `#e6ff2e` on linen `#F1ECE4` has almost no contrast, so without the edge the name only showed as a blue shadow. On night the edge is next to invisible, so on dark grounds the lockup still looks like the title screen's `.tl-name`.
  - **The mark's dashes in acid and cobalt.** `rawGlyph('mark')` draws its dashed box in ink `#15131a`, and that disappears on night (see `work/round3/lk1g.png`). In the lockup the dashes take the name's own inks: acid, a cobalt offset and the same ink edge. They are walked round the box in the game's 6-on/4-off rhythm, fitted so that every corner turns on an L. The red cursor is the game's own, unchanged (`OL`, `#d4141c`).
  - The soft glow half of `.tl-name`'s text-shadow is dropped, as briefed. The hard 3px-at-70px cobalt offset is kept, scaled with the size.
- **18 · Backdrop.** "Lit from the right edge by one cracked screen" now means the screen sits just past the right edge.
  - Only the outer, toxic-thinning steps of its fan fall on the wall (toxic `#39e07a` at .04 to .32). The acid and lime steps stay off frame, so the info rail (right 30 %) sits on dark green rather than on a bright patch.
  - The acid shows where the poster puts it: as a rim on the lit edge (the chair), and in three torn steps (acid, lime, toxic) along the desk's lit edge.
  - I did not call `officeScene()` itself. It brings Regent, the "G. PEMBERTON · CEO" plate and a radial-gradient vignette. Instead I redrew its set pieces with its own shapes, colours and helpers.
- **19 · Share card.** Regent is drawn full length, standing on a hard floor line, so the bottom 82 px are a flat, quiet floor band for the platform's linen bar. The CRT stands on the floor at the right edge, which crops it. This is otherwise the plan as written.

#### Entries

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

## Moving poster · agent: living

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

