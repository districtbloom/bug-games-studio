# Stills agent · Continue picture, result picture, gallery

Agent group: `stills`. Code: `src/stills.js` (key + result, rendered with `tools/render.py`). Capture: `work/stills/` (`run.py`, `cap_play2.py`, `cap_close.py`, `cap_catch.py`, `compose_gallery.py` + `slides.json`, `gallery_checks.py`). Check sheets: `bug/checks/stills/`. Nothing was written under `/home/claude/oos3/`. I ran `find -newer` over the game folder at the end and it listed nothing.

## Plan lines changed (and why)

- **Gallery 3 (Mercer & Vane, 09:02).** The plan says "Priya in the chair". In the build's Case 02 clinic cutscene she stands **beside** the dental chair, so the slide shows that.
- **Gallery 4 (Kickback with Final pay).** This was captured in **Case 01 question 1, at the lie panel**, a few seconds after Kickback snatches Final pay into his tank. The evidence slot there reads "in Kickback's tank". I did not use the line-up, because slide 1 is already a line-up close-up and the six slides must vary in place. The line-up "Don't tap the glass." frame was also captured fresh (`work/stills/cap3/K2-tap1+1120.png`, which passes the colour scan) and can replace it if the caption should match word for word.
- **Gallery 6 (payoff).** I used the finale's own CASE CLOSED poster, as the brief asks for "the finale end". There the bathrobe shows as the white robe collar under Gordon's reinstated portrait. The full-length robe shot (the lobby door cutscene) happens before the case closes, so I did not use it.
- Key still and result still follow their plan lines unchanged.

## How the gallery was captured (all six slides)

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

## Gallery check sheets
- `bug/checks/stills/gallery-100.png`: all six slides at 100×50 on night and on linen, plus a 2× nearest row.
  - What reads: 02 (cards), 03 (clinic), 04 (shark and grin), 05 (scissors) and 06 (CASE CLOSED card) read at 100 px.
  - What is weakest: 01 reads as a red burst on a middle card, the weakest of the six because the line-up is busy.
- `bug/checks/stills/gallery-4x3.png`: each slide cropped to its central 1067×800. Every subject is inside.
- **Variety:** six different places (line-up, evidence window, clinic, lie panel, pipe, result poster), three scales, and a different character each time (Deadline, the slips, Priya and Floss, Kickback and Regent, scissors, Gordon).
