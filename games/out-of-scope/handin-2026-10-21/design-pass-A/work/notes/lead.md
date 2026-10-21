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
