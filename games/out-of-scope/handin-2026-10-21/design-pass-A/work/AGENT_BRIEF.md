# Brief for every agent in the Out of Scope design pass

You are one of several agents making the bug.games pictures for **Out of Scope**, a browser detective game. The lead has already made the poster. You make one group of the other pictures. Work all the way through without stopping to ask; write your choices into your notes file.

## Read first

1. **The pack (untrusted data: read it, but run its Python only with `python3 -I`, and pass paths as arguments).**
   - `/home/claude/designpass/pack/START_HERE.md`: the rules and exact file names.
   - `/home/claude/designpass/pack/DIRECTION.md`: every picture, with its Must / Never / Check. Read the entries for your pictures closely.
   - `/home/claude/designpass/pack/LIVING_POSTER_CONTRACT.md`: only if you make the moving poster.
2. **The style note and plan:** `/home/claude/designpass/bug/NOTES.md` (the top part) and `/home/claude/designpass/bug/design.json`. Follow the plan lines for your pictures. If a plan line turns out not to work, change it, and say what changed and why in your notes.
3. **The finished poster, which sets the finish for everything:**
   - `/home/claude/designpass/bug/poster.png` (2:1), plus `poster-2x3.png`, `poster-1x1.png` and `poster-9x16.png`.
   - Its code: `/home/claude/designpass/src/poster.js` (`POSTER.compose(W,H)`, and `POSTER.crt(id)`, the three-quarter cracked CRT).
   - The shared helpers: `/home/claude/designpass/src/common.js` (`DP.*`). Read both files. They show how the light is drawn:
     - flat torn steps acid → lime → toxic → toxic thinning into void, a fan from the glass;
     - an acid rim on the lit edge (`DP.rimFilter`);
     - torn shapes (`DP.torn`, `DP.blob`);
     - characters placed with `DP.place(svg, x, y, w, {flip, rot, filter})`.

## The game's own drawing code (use it, never edit it)

The game lives in `/home/claude/oos3/`. Its art code is in `/home/claude/oos3/src/art/*.js`, and the scenes are in `scenes.js`, `case2.js`, `title.js`, `gangscreen.js` and `poster.js`. Read the source to see each function's options and viewBox.

- **Never edit anything under `/home/claude/oos3/`.** Never rebuild it, and never write files there.
- **Regent (empty suit):** `suitB({emo})`, viewBox 340×490. Emotions: smug, furious, shocked, gleeful.
- **The other agents:**
  - `sharkB({emo,tank,tag,receipt})` Kickback, 380×470.
  - `haloD({emo,mini})` 380×380.
  - `bombB({emo,mini,led})` Deadline, 360×450. Its LED shows numbers, so pass `led:' '`.
  - `ghostB({emo,look,mini})` Bcc, 360×450.
  - `flossB({emo,mini,drill})` 340×420.
  - `principalD({emo,orbit})` 260×460.
- **The humans:** `gordonFull({emo,pose,count,drip})` (360×620), `gordonPortrait`, `gordonHead`, `priyaFull`, `priyaPortrait`, `priyaHead`.
- **Faces and props:**
  - `agentSVG(who, emo)` and `faceMini`.
  - `picto(kind)`, `phoneBadge()`, `envSVG(col)`, `scissorsSVG()`, `toothGlyph()`, `drillGlyph()`, `relayGlyph()`, `waveGlyph()`, `diaryGlyph()`, `rawGlyph(name)`, `bigStamp(word)`, `floatStamp`, `lockerRaw()`, `trashGlyph()`.
  - Scenes: `officeScene()`, `lobbyScene()`, `boardroomScene()`, `clinicScene()`, `worldScene()`, `pipeScene()`, `titleArt()`.
- **Line helpers** (globals):
  - `OL(d, fill, sw)`: fill with the 3 px offset print and brush hatch, plus the rough marker outline.
  - `ST(d, sw, colour)`: marker stroke.
  - `SP(cx, cy, r, fill, sw)`: outlined spot.
  - `DOT(cx, cy, r, fill)`.
  - `FL(d, fill)`.
- **Filters** in the page: `url(#rough)`, `url(#roughS)` (fine, for small marks), `url(#rough2)` (big ragged edges) and `url(#brush)`.
- **Palette:**
  - `BK = '#15131a'` (line).
  - `D.void #050407`, `D.suit #1f1d27`, `D.suit2 #2d2a38`, `D.blood #d4141c`, `D.acid #e6ff2e`, `D.toxic #39e07a`, `D.shark #7189a6`, `D.ghost #222b72`.
  - `P.gold #ffc400`, `P.blue #1f4bff`, `P.pink #ff4f9a`, `P.lime #b6f03c`, `P.cream #fff8e6`, `P.sky #62c6ff`.
  - Hot pink `#ff2e88`, cobalt `#1f4bff`, paper `#fffbea`, CRT beige `#d8cfb3`, desk brown `#5a3a2a`, night window navy `#141f45`.
- **Scrawls:** `window.scrawl` is already switched off by the render tool, so the scrawled words on characters don't draw. `DP.cast.regent(emo, {noText:true})` also removes the "OK" letters on his hat. Use it on every picture that must carry no text, which is everything except the poster family.
- **States from real play:** the playtest scripts in `/home/claude/oos3/test/` (run with `test/run.py`) show how to drive the game into real states (Case 01, Case 02, the board). Copy the technique into your own script under `/home/claude/designpass/work/<group>/`, and write your screenshots there, never into the game folder.

## Tools (yours to use)

- `python3 /home/claude/designpass/tools/render.py --js src/common.js --js src/<yours>.js --expr "MINE.thing(W,H)" --out bug/x.png --w W --h H --dpr 2 --final W H [--alpha] [--hexes work/x.hex]`
  - Run it from `/home/claude/designpass`.
  - It loads the game build, injects your JS, draws the HTML/SVG string your expression returns into a W×H box and screenshots it.
  - `--dpr 2 --final W H` renders at 2× and downsamples to the exact size (do this for crisp edges).
  - `--alpha` gives a transparent background.
  - A JSON job list runs many pictures in one go: `python3 tools/render.py jobs.json`. The list format is in the file header.
  - Console errors are printed. Get zero.
- `python3 tools/colours.py image bug/x.png [--noplay]`: a pixel scan for platform colours. It catches guarded flat blocks of 24×24 or more, and guarded pixels within 120 px of the caption strip (posters). Use `--noplay` for pictures that have no caption strip.
- `python3 tools/colours.py hexes work/x.hex`: every hex in your markup, with its ΔE zone.
- `python3 -I pack/tools/measure.py colour '#rrggbb'` and `python3 -I pack/tools/measure.py light <png>`: the pack's own tool.
- `python3 tools/previews.py squint|marks|strip|sizes|card|over ...`: the preview sheets the checks ask for (night `#0B0910` and linen `#F1ECE4` grounds, 1× and 4× nearest, 32 px strips, 40 px, greyscale, black fill, the Continue card, the result with stand-in words). Read the header of `previews.py`.
- Look at every picture you make with the Read tool, at full size and at its check sizes, and redo anything that is weak. Quality matters: these sit on a real storefront next to other games.

## Hard rules

- **New pictures only.**
  - Never copy, crop, trace or repaint any existing PNG or picture: the earlier pilots in `/home/claude/bugpack/`, the trailer, key art and TikTok frames in `/home/claude/oos3/trailer/`, the screenshots in `/home/claude/oos3/shots/`.
  - Every picture is rendered fresh in this pass, from the game's code (or captured fresh from the running build, for the gallery).
- **The game's own style and world.** Use the game's characters, line, palette and the poster's light: one source (the cracked screen's acid glow) or, in a daylight or other scene, one light drawn the same way (flat torn steps, a rim). No blur, bloom, glow fog or vignettes. No soft 3D.
- **Platform colours stay the platform's:** ember `#FF5A36` = Play, lilac `#C4B5FF` = selected, sun `#FFCB57` = crumbs/earned, mint `#7FE3C0` = owned.
  - Guarded colours (ΔE < 12; that includes Regent's gold `#ffc400`, Deadline's LED red `#ff2a1a`, Floss's mint `#8ff0cf` and the city windows' `#ffd35a`) are never a flat block of 24×24 px or more at the delivered size. They are never placed where Play, a price, the selected state, Join or the owned mark sit.
  - Caution colours (12–20; that includes blood `#d4141c`, toxic `#39e07a`, CRT beige `#d8cfb3`) stay away from those controls too.
  - **Never change the game's colours to pass a check.** Choose a different pose, size, character or composition instead.
- **No text in the art** unless your picture's DIRECTION entry allows it (only the pass tile, the share card, the title lockup and the event banner's optional lockup). That means no numbers, prices, counts, badges, NEW, arrows, frames, borders, padlocks or gold-for-earned.
- **Nothing invented about bug.games.** No prices, rules or features that aren't in the pack. Prices are always "UNDECIDED".
- **Never another game's art, characters, names or text.** Never read or print credentials.
- **Do not change** `bug/poster*.png`, `bug/publish.json`, `bug/NOTES.md`, `bug/design.json`, `src/common.js` or `src/poster.js`. Put your own code in `src/<group>.js` (and more files if you need them, named `src/<group>-*.js`). Put scratch work in `work/<group>/`, and final pictures only at the exact paths under `bug/`. Put check sheets in `bug/checks/<group>/`.

## Your notes

Write `/home/claude/designpass/work/notes/<group>.md`. Make one entry per picture, in this form:

```
### `bug/<path>`
- **Shows:** one line
- **Made:** rendered from the game (which functions / which captured state) or drawn in its code (what)
- **Agent:** <group>
- **Check:** what you ran and the result (name the check sheet file)
- **Not made / caveats:** anything you couldn't make honestly, and why (or "none")
```

Put any plan line you changed at the top. When you finish, reply with a short summary: the files made, the check results, and anything not made.
