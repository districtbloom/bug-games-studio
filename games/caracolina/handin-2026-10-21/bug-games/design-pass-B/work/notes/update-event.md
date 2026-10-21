# Update picture and event banner (agent: update-event)

Work folder: `B/work/update-event/`. All renders come from the game's own WebGL renderer, through `render_ue.js`. That file is `B/tools/render.js` with one change: the page-load timeout is raised to 300 s, because the shared CPU ran past the 30 s default. Nothing made before this pass was opened or used.

**Plan change for the lead (update).** The plan line and `design.json` say "Remei at her washing line". I made Quim instead, for these reasons:
- From 19:30 to 19:50 Remei is not at her washing line. She stands at the Mirador del Blau (from 18:35 to 20:06, at [1.6, −4.2, 33.6]).
- That spot sits in the great shell's evening shadow. I checked at 19:30 and at 19:45, and she is shaded in every framing (`prev1/`, `survey/`).
- Tomàs on the pier is in full sun, but from where a player can stand on the pier, his front is in shade (`prev2/`).
- Aurora is still walking up to the summit at that hour.
- Quim stands at his place in the garden of eyes from 15:00 to 20:36, facing the sunset door. That is the one resident who is in the open low sun at 19:48, at a spot where you can stand facing him with the sun behind him.

Please change `design.json` `update.look` to match: "Quim in the garden of eyes at sunset, turned toward you, the low sun behind him".

### bug/updates/3.png
- **Shows:** Quim, the gardener, at his place in the garden of eyes at 19:48. His paper cut-out is turned square to you mid-conversation, standing in the eye-shaped sunset door. The low western sun is beside him, his paper glows from behind, and the balustrade's long shadows rake the chequered floor.
- **Made:** rendered from the game, 1600×800. The spec is in `update_final.py` (builder `ushot.py`) and `final_update.json`.
  - Shot: hour 19.8; eye 3.0 m from Quim at 1.62 m (the game's eye height), bearing −24° from him, which is east, on his sun-opposite side; 45 mm; look 4° right of him at 1.67 m.
  - The turn is the game's own code. Before rendering, `PEOPLE.attn = {id:'quim', p:[eyeX, eyeZ]}` is set and `PEOPLE.attend(.05)` runs 40 times. That is exactly what `game.js` does while you talk (attnK reaches 1). `people.js` `cards()` then turns him to face the eye.
  - Before/after check: without the turn, the same camera shows his back side, the eyes-shut "face he keeps" (`final_update/3_check_noturn.jpg` vs `3_check_turn.jpg`). The turn is real, and only visible in version 3.
  - No version number, date, NEW or "update" in the picture.
- **Agent:** update-event
- **Check:**
  - Looked at it at 1600×800, 308×154 and 104×52 (`check_update.png`). At 104×52 it reads as a figure facing you inside a dark doorway, with the sun beside him.
  - The subject (Quim, the door and the sun) sits in x 0.33–0.75, inside the central 4:3 (0.167–0.833).
  - `measure.py light`: L 0.467, C 0.28, mid.
  - guard2: guarded 15.3%, caution 38.9%. The poster's own figures are 11.5% and 39.2%.
    - The guarded pixels are the sky glow round the sun (sun) and the sunlit paper of his face (ember). This is the poster's own light.
    - Flat guarded 24-px windows: 9.1% of windows here against 10.1% on the poster (`flatblocks.py`). All of them are sky near the sun.
    - No control sits on this picture.
- **Couldn't:** Remei, as planned (see above).

### bug/updates/3-thumb.png
- **Shows:** a tighter framing of the same moment: Quim's head and shoulders, with his one eye on you, against the black slab of the sunset door, and the sun to the right.
- **Made:** rendered from the game, recomposed rather than cropped: eye 2.4 m from him, same bearing, 60 mm, look 4.5° right at 1.70 m, same turn code. Rendered at 616×308 and downsampled with Lanczos to 308×154 (`update_final.py` THUMB).
- **Agent:** update-event
- **Check:**
  - Looked at it at 308×154 and at 104×52 (`check_update.png`). The face, the eye and the hat read against the dark door; the sun reads at the right.
  - guard2: guarded 15.3% (sky round the sun), caution 39.4%. Flat guarded 24-px windows: 2 of 264.
- **Couldn't:** —

### bug/events/festival-of-the-shell-banner.png
- **Shows:** the Festival of the Shell night on El Cim at 22:00, seen from the summit's east edge, looking south-south-west over the balustrade.
  - Left: a dark violet night sky with stars, the night sea and dark roofs below, kept calm for the copy and Join.
  - Right 55%: the whole town in paper on the summit along the balustrade (Tomàs in front, Remei waving, Tinta at their feet), a festival lantern, and fireworks over the sea in violet, cyan, blue and teal with gold sparks.
- **Made:** rendered from the game with `festival:true` (the crowd is placed by `people.js` on the festival night), 1720×600. The spec is in `banner_final.py` (builder `bshot.py`) and `banner_final.json`.
  - Shot: eye [8.4, 26.6, −63.6], bearing 115°, pitch +6°, 32 mm.
  - Fireworks: the studio's `fireworks()` centres its bursts on wherever the camera looks. I replaced it in the page with five fixed bursts, placed in the right 55% in screen space and converted to the game's (az, el).
    - Each burst is checked against `game.js` `festival()`, which uses az 0.1π–0.9π (over the southern sea) and el 0.18–0.48.
    - Used: az 0.67–0.88π, el 0.18–0.37. The shader draws them as in the game.
  - It is a new frame, not the trailer's: the trailer looked east from the summit's west side, and at 21.6–21.7.
- **Agent:** update-event
- **Check:**
  - Mock copy plate over the left 45%, the right 55% cropped alone, display size 860×300 and a 150-px card (`check_banner.png`).
    - With the copy covered, the right 55% still says "festival night on the summit".
    - Cropped alone, it holds as its own picture: fireworks above, the crowd and the balustrade below.
  - guard2, whole image: guarded 0.0%, caution 0.8% (firework spark tips, the lanterns, the lamp-lit balustrade top). Flat guarded 24-px windows: 0.
  - Left 45% (774 px): guarded 0, caution 0, no hot pixels, mean luminance 0.134.
  - Join zone (x < 500, y > 360): mean luminance 0.110, brightest pixel rgb(115,106,149).
  - The nearest lantern sits just right of the copy edge, at x ≈ 795–830.
  - `measure.py light`: L 0.161, C 0.132, dark.
  - No counter in the art.
- **Couldn't:** the title lockup. The game's fonts (Caprasimo, Kalam) are not available in this sandbox, so lettering is left to the lead. The event seal belongs to the seals agent.
