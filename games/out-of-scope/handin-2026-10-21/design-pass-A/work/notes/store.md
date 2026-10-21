# Store group (round 2): notes

Agent: **store**. Code: `src/store.js` (tiles and shared ground), `src/store-reward.js` (owned mark parts),
`src/store-update.js` (update picture), `src/store-event.js` (event banner). Scratch and build scripts:
`work/store/` (`build_all.sh` rebuilds every picture, `checks.sh` rebuilds every check sheet,
`build_reward.py` bakes the owned-mark module, `frames.py` captures its frames, `ev.py` reads markup out of the build).
Check sheets: `bug/checks/store/`. Nothing under `/home/claude/oos3/` was edited or written.

## Plan lines changed (for the lead to carry into NOTES.md / design.json)

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

## Pictures

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

## Notes for the lead
- **A trap in the line filters:** a single perfectly horizontal or vertical path drawn with `ST` (or anything under `#rough`/`#roughS`) disappears, because its bounding box has zero height or width, so the filter region is empty. My slip type lines, band edges and desk/sill lines are drawn with a 1–2 px slope for this reason. Other agents may hit it.
- I looked at two existing screenshots (`shots/c2-27-cut.png`, `c2-28-after.png`) only to understand how the cut scene and the CUT tool look. Nothing was copied, cropped, traced or repainted. Every picture here is rendered fresh from code.
