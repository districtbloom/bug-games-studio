# Brief for every agent · Caracolina, bug.games design pass B

`B` = `/tmp/claude-0/-home-claude/f5687e90-63e7-5f07-9dce-8a52b890766a/scratchpad/passB`

## Read first
1. `B/pack/START_HERE.md` and `B/pack/DIRECTION.md`: the rules and every picture's spec. Your pictures' sections are the contract.
2. `B/bug/NOTES.md`: the style note and the plan (one line per picture). Follow them.
3. The finished poster: `B/bug/poster.png` (2400×1200), `poster-2x3.png`, `poster-1x1.png`, focus `B/bug/publish.json` (0.655, 0.30).
   - It shows the lighthouse on legs straddling the setting sun, alone in the bay, at the game's 19:48 sunset light.
   - Your pictures take their finish and light from it.
4. `B/pack/examples/` and `B/pack/reference/`: learn the job each picture does, never its look.

## The game
- Source: `/home/claude/cara3d/src/*.js` (read only; never change it). The build used for rendering is `/home/claude/cara3d/test/studio_local.html`: the game plus the studio's shot code.
- The game's own 2D drawing code you can call inside that page:
  - `people_paint.js`: `drawFigure(ctx, ox, oy, sp, side, frame, id)` draws a paper resident from `CAST` (cells are `CELL_W=112` × `CELL_H=288`), plus `face`, `hat`, `drawCat` and `drawBird`. Read the code for the arguments.
  - `paint.js`: the hand-painted textures (brush, pencil, trencadís mosaic `MOS`, floors, paper).
  - `studio_main.js`: `fireworks()`, `drawViewfinder`, `drawDevelop` and `drawTitle` (the title lettering code, which needs the Caprasimo/Kalam fonts this sandbox does not have).
  - `index.html`: the `#i-shell` snail-shell symbol.
- Story and moments: `story.js` (`WISHES`, residents' `LINES`); `game.js` (the mural, prints, pins, festival).

## Tools (code you may use; run from `B/tools`)
- **Render a frame with the game's renderer:** `cd B/tools && NODE_PATH=/home/claude/.npm-global/lib/node_modules node render.js <outdir> <specs.json>`.
  - A spec is `{"name","w","h","lt","png":true,"shot":{…}}` or `{…,"shotJs":"return {…}"}`. `shotJs` runs in the page and can use `WORLD`, `lightAt(h)`, `PEOPLE`, `CIM`, `JY_`.
  - Shot fields (see `src/studio_main.js`, `renderShot`):
    - `hour`; `eye:[[x,y,z],[x,y,z]]`; `look:[[…],[…]]`; `lens` (mm, 24 mm-tall frame); `dof:{f,ap}`;
    - `festival:true` (festival night: crowd on the summit and fireworks); `friends:true`; `residentsOnly:true`;
    - `pencil:true` (the pencil opening, where colour blooms); `flight:true` (Remei's sheets flying, around 18:00); `lemon:true` (the lemon fountain squeezing, noon); `hatch:true` (the egg hatching, dawn);
    - `sun:true` (look at the sun's disc); `lookDir:true` (the garden's broken face, seen whole); `track:'lluna'` with `slow`/`tBase` (Lluna's dive);
    - `title:true` (a slight warm grade).
  - `lt` is the time inside the shot, in seconds.
  - Render previews at about 1000 px wide first; finals after.
- **Evaluate any expression in the game:** `node probe.js '<js returning json>'`, e.g. to read positions or `lightAt(19.8).sunDisc`.
- **Map platform colours:** `python3 -I guard2.py B/pack/tools <img> <out.png> [bottom_frac]` maps guarded (red) and caution (yellow) pixels.
- **The pack's tools:** `python3 -I B/pack/tools/measure.py colour '#RRGGBB' …` (always with the #), `measure.py light <png>`, and `wall.py` for posters.
- **Proven camera positions:** `TRAILER.shots` and `TIKTOKS` in `src/studio_main.js` / `studio_tiktok.js` show where and when things are (Lluna's dive at noon from the stone head, the sheets at six, the garden's broken face, the lemon at noon, the festival at the summit).
  - Use them to find things.
  - Compose your own new frames; don't re-render the trailer's exact shots.
- **CPU:** the machine has 2 cores shared by several agents. Run one render at a time, and keep previews small.

## World facts
- The sea in the southern bay is at about y −37 (the walkable seabed −38.4).
- The lighthouse on legs stands at x 24, z 159: legs from y −46 to the body at −13, lamp at y −3.2, cap at about −0.3. Its lamp burns after about 20:50.
- The floating rock ("la pedra que pensa") is at [11, 9.5, 66].
- The stone head (El Cap) is near [0, ?, 116]; the cove of eggs near [20, 112]; the pier at [24, 140].
- The summit (El Cim, festival) is near [−5, 26, −64]. The mural's six pin spots are at y 25.2, from x −15.7 to 5.7 and z −72 to −77.
- Places (`WORLD.places`, x and z):
  - court [0, 0.5] (Aurora's courtyard), voltes [5.2, 12.5], key [4.9, 25.2], ovl [5.2, 36] (Mirador del Blau, the great shell);
  - mercat [46, −22], costa [24.5, −48], cim [−5, −64], baixada [−45.6, −30], jardi [−52, 5] (garden of eyes), ull [−22, 9.6];
  - escales [21.6, 37.8], caracol [36.3, 52], soft [25.3, 65.6], lean [29.7, 76.7], pier [24, 140], head [0, 116], cala [20, 112].
- The sun at 19:48 is in the west, `lightAt(19.8).sunDisc` ≈ (−0.92, 0.18, 0.27). Sunset light runs from about 18:45 to 19:55; the festival night from 21:30 to 22:00.

## Rules that bind every agent
- **Start from scratch.**
  - Never open, reuse, crop, trace or repaint any picture made before this pass. That means nothing from:
    - `…/scratchpad/poster/`, `…/scratchpad/bugwork/`, `…/scratchpad/hero*`, `…/scratchpad/st/`, `…/scratchpad/ti/`, `…/scratchpad/prev*`, `…/scratchpad/final/`;
    - `/mnt/user-data/outputs/`, `/home/claude/cara3d/post/`, `/home/claude/cara3d/studio/`, `/home/claude/cara3d/artifact/`.
  - Only new renders and new drawings, made in this pass, saved under `B/work/<your-agent>/` and `B/bug/`.
- **Render from the game** wherever you can. Where you can't, draw with the game's own 2D code and palette (Canvas 2D in the game page, or SVG in its palette, rasterised in Chromium), and say which in your notes.
- **Pictures only.** Never touch the game's code or `game.json`; never declare anything; no prices, counts or rarity.
- **No text or numbers in any picture**, except where DIRECTION allows lettering: the title lockup, the share card's title, the pass tile's name and the event lockup.
  - Lettering needs the game's fonts, which this sandbox lacks: leave lettering to the lead.
- **Colour.**
  - Measure every flat colour you put in small marks, store, pass, marker and seals with `measure.py colour`. Use only **free** colours (ΔE ≥ 20 to ember, lilac, sun and mint) for any flat area in those pieces; check the result with `guard2.py`.
  - Known readings:
    - Free: cobalt `#2a55b8`; night `#152760` / `#172d4e`; iron `#1e2a3a`; ink `#1d1a33`; paper `#f3ead7`; tile white `#fbf8f1`; oxblood `#8e2a22`; brick `#9c4426`; plum `#6a3a8a`; viridian `#1f6b5a`; dusk `#4b4f8f`; dusk violet `#7d6f98`; mortar `#c4c0b8`; violet sea `#303466`; mauve `#605076`.
    - Caution: lighthouse red `#c8342c` (ember 15.6); turquoise `#19ac8e` (mint 15.5); sunset peach `#fabe8f` (sun 14.6); rose `#d68a81` (ember 15.1).
    - Guarded: coral `#e8653a` (ember 4.3); sun cream `#fee7aa` (sun 11.7); lamp cream `#f3dd9a` (sun 10.3); lemon `#f2d06b`; brass `#d9b24a`; `#f6c27a`.
  - Scene renders (stills, gallery, banners, backdrops) keep the game's own light, but no guarded colour as a flat block of 24×24 px or more, and none where a control sits: Play at the bottom, Join on the left of the event banner, the info rail beside the backdrop.
- **The same light as the poster.** Evening pieces at about 19:30–19:55 with the low sun visible or clearly coming from the west; night pieces lit by the festival or the lamp.
- **Notes.** Write one entry per picture to `B/work/notes/<your-agent>.md` in this form:

  ```
  ### <file>
  - Shows: one line
  - Made: rendered from the game (shot spec) / drawn with the game's code (which) / other (say)
  - Agent: <name>
  - Check: what you checked and the result (measure readings, sizes)
  - Couldn't: anything not made, and why
  ```

  Include the spec JSON or script you used under `B/work/<your-agent>/`.
- **Finish.** Look at every picture you make: open the PNG and check it. Fix what's wrong before you report back.
