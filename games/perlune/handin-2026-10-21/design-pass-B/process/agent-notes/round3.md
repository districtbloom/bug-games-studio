# Notes · round3 (title lettering, share card, phone poster, page backdrop)

Everything here is new. The share card, the phone poster and both backdrops were rendered fresh from the shipped build (`sivver/dist/perlune.local.html`) by the game's own WebGL2 renderer, through `tools/render.js`. The lettering was set fresh in code. No earlier picture was reused, cropped, traced or repainted, and the poster PNG was not cropped. The game's code and `game.json` were not touched.

**Scripts and views** (all in `/home/claude/passB/work/round3/`):
- `tools/views.py`: builds the views.
  - `poster_view()` reproduces the lead's poster view B exactly (checked: same JS, same fields), then re-aims the camera.
  - `backdrop_js()` is a camera that stands on a world's surface. The droplet is not drawn there.
- `tools/lockup.py`: sets the title lockup, writes its JSON, checks it at minimum width, and composes the share card.
- `tools/mock.py`: mocks the game-page hero (desktop and phone) over a backdrop.
- `tools/guardzone.py`: runs `guard.py` on the whole picture and on its right 35 %.
- Exact views: `share-views.json`, `poster916-views.json`, `backdrop-views.json`, `backdrop-phone-views.json`.

**Finish (the poster's):**
- vig 0, grain 0.01, streak 0.45, bloom default (render.js resets it to the game's 0.6), exp and sat at the game's defaults, neb 0.03.
- The share card and phone poster use the poster's staging: `titlejs` over Nacre, form 2, solo plus Umbra, no rings, sunburst 0.2, no decor, eyes lx −0.7/−0.6 and ly 0.9, key light `[-0.6, 0.45, -0.55]`, dof 0.55.
- The backdrops use the same key light and dof 0.55, with the focus set on the floor (there is no subject).

**render.js fix (coordinator's note):** none of my renders were affected:
- every view had its own `cleared` key, so the page reloaded for each view;
- no view changed bloom, exp or sat, and neb was set explicitly in every view;
- all finals were rendered after the fix (07:20–07:25, fix at 07:12).

---

## title-lockup.png (+ title-lockup.json)
- **file:** `bug/title-lockup.png`: a 1600×577 transparent master. `bug/title-lockup.json` holds `{"file":"title-lockup.png","min_width_px":120,"font":"TeX Gyre Adventor Bold","note":…}`.
- **shows:** "PERLUNE" in capitals, filled with the game's iridescent sweep. A soft violet glow sits behind it, with a small cyan/magenta split.
- **made by:** set in code (`tools/lockup.py`, PIL with raqm, pair kerning kept), following the lead's font decision:
  - **Face:** TeX Gyre Adventor Bold, the lettering the game has already published on its cover and trailers.
  - **Tracking:** +4 %.
  - **Fill:** the game's own `--iri` gradient at 100°, computed the way CSS paints it (#FF9AD5 0 % → #9FF6FF 30 % → #FFE6A8 55 % → #C9A8FF 80 % → #FF9AD5 100 %), clipped to the letters.
  - **Glow:** the game's resonance violet #B28CFF, as a glow only, at two blur radii, like its bloom.
  - **Split:** the game's glass cyan #5FF3FF and dust magenta #FF5C9A, offset ±0.25 % of the width, at 55 %.
- **agent:** round3
- **check:**
  - **Smallest readable width: 120 px** (letters 19 px tall there). It was set from an 18 px cap height, the strict end of the pack's 12–18 px.
  - `work/round3/lockup-check-min.png` shows it at 120 px on night (#05040A) and on linen, at 1× and at 4× with hard pixels:
    - on night it reads cleanly;
    - on linen it is legible but pale (a pastel sweep on cream). It is drawn for the night, and both of its uses (the share card and the video's end card) are night.
  - **guard.py** (on night, master scale): ember 0 %. Lilac 7.0 %, mint 1.7 % and sun 0.7 % are guarded, all inside the letters. These are the sweep's #C9A8FF, #FFE6A8 and the cyan↔cream blend. The lead allows this inside lettering, and the lockup must stay away from Play.
  - **measure.py light** (on night): mid, L 0.229.
- **couldn't make / caveats:**
  - **The game's in-game title face is Tilt Prism** (`#title h1`, letter-spacing .01em, #F2ECF7). It cannot be fetched here: `/home/claude/video/fonts/TiltPrism.ttf`, `Syne.ttf` and `MartianMono.ttf` are 378-byte error stubs (a failed GitHub download, not fonts), fonts.googleapis.com is refused by the egress proxy (403), and no copy exists anywhere on the machine (searched). **Re-set the lockup in Tilt Prism once the file is supplied:**
    ```
    python3 /home/claude/passB/work/round3/tools/lockup.py --font <TiltPrism.ttf> --track 0.01 --share-art /home/claude/passB/work/round3/share-card-art.png
    ```
    This rewrites `title-lockup.png`, `title-lockup.json` (with a new `min_width_px`) and `share-card.png`.
  - The script only accepts the two approved faces (Tilt Prism and TeX Gyre Adventor), so a random fallback can't slip in.

## share-card.png
- **file:** `bug/share-card.png`, 1200×630. The untitled art is kept as `work/round3/share-card-art.png`, so the title can be re-set later.
- **shows:** the poster's one image, "A droplet faces the Eclipse", recomposed for the link card:
  - the droplet is on the right, its centre at **0.73** of the width, eyes turned up-left to the Eclipse;
  - the Eclipse hangs just above-left of it, at 0.43–0.63, as the only light;
  - the left 43 % is the plain contour-line night, with the title lockup lower-left (letters from 5 % to 45 % of the width, centred at 60 % of the height);
  - the bottom band holds only a few dust motes.
- **made by:** rendered fresh from the game, not cropped from the poster.
  - It uses the poster's staging and finish, at 600×315 css @2.
  - The camera was re-aimed for this frame: `cam −0.30, dist 4.7, up 1.1, ty 0.15, fov 0.80, side 1.7`. The wider fov and nearer camera keep the Eclipse out of the title zone while it still touches the droplet, as on the poster.
  - The lockup was composited by `lockup.py`.
- **agent:** round3
- **check:**
  - **270 px wide** with a linen bug.games bar, beside the wall poster (`work/round3/share-270-final.png`): the same image and register as the wall. The title reads, with letters about 20 px tall at that size (108 px wide, which is at or above the 120 px master minimum once its glow margin is counted).
  - **guard.py:** ember 0 % (no ember anywhere). Nothing guarded in the bottom band (the platform bar). Lilac 1.49 % (largest block 20×20), mint 0.25 % (15×15) and sun 0.09 % (12×12) come from the droplet's pale highlights and the lettering's sweep. No block reaches 24×24.
  - **measure.py light:** dark, L 0.144 (the poster is 0.121).
- **couldn't make / caveats:**
  - The title is in the published cover/trailer lettering, not Tilt Prism (see above).
  - No player names, no Play and no ember.

## poster-9x16.png
- **file:** `bug/poster-9x16.png`, 1080×1920.
- **shows:** "A droplet faces the Eclipse", recomposed for 9:16:
  - the Eclipse with its rays fills the upper half, at (0.36, 0.32);
  - the droplet floats below it, at (0.58, 0.66), its eyes turned up-left to the light;
  - the pink/cyan title dust trails off below.
- **made by:** rendered fresh from the game with the poster's staging and finish, at 540×960 css @2. The camera was re-aimed for the tall frame (`cam −0.13, dist 5.8, up 2.6, ty 1.2, fov 0.95, side 0.28, lx −0.6`). It is not a crop of any poster.
- **agent:** round3
- **check:**
  - **Compared with the 2:1 poster and the 2:3 side by side** (`work/round3/cmp-9x16.png`): the same one image, the same register (one lit pocket in the dark), the same light and inks.
  - **guard.py:** ember 0 %. Lilac 0.46 %, largest block 21×21, from the droplet's lavender highlights; the lead's poster measures 0.50 % and 23×23. Sun 0 %, mint 0.01 %.
  - **measure.py light:** dark, L 0.137 (the 2:3 is 0.136).
- **couldn't make / caveats:** none.

## backdrop.png and backdrop-phone.png
- **files:** `bug/backdrop.png` 1440×577 and `bug/backdrop-phone.png` 390×826. Each was composed and rendered at its own size, not cropped from the other.
- **shows:** Ferrum Dunes at rest, under one light from the upper left.
  - The dark contour-line night of Ferrum's own sky fills the top.
  - The world's curved horizon runs the full width as a hard edge, with its floor below in dusky iron-rose and Ferrum's pink contour lines; a few glints catch the light on the left.
  - The horizon sits at 0.80 of the height at its highest, falling to 0.87 at the sides (desktop), and at 0.63 (phone), so the floor runs under the hero: below the poster card and the rail on desktop, and below the info card on phone.
  - There is no droplet, no Eclipse and no text.
- **made by:** rendered from the game (`backdrop_js`):
  - the camera stands 1.2 above Ferrum's surface and looks along the ground (desktop fov 0.42, phone fov 0.60), with the poster's key light;
  - `solo`, no sunburst, no rings, no decor, no floating dust;
  - the droplet is not drawn, and its ground glow was moved off-world with it.
  - The world is shown in its own landing state: `wake 0.3`, the muted colour a world has when you land on it, before you wake it (`wakeTarget()` in juice.js). The fully woken floor is a loud brick-orange that competed with the hero and sat right above Play.
- **Why Ferrum:** I rendered Cathedra, Hydrargyra, Ferrum, Nacre and the Geode from the same camera and ran guard.py on each:
  - **Cathedra:** lilac-guarded. Its contour colour #C7A6FF (lilac 4.7) lights the horizon rim and lines (15 % of the floor zone, 17×17 block).
  - **Hydrargyra:** sun-guarded. Its #FFC23D (sun 3.0) lines and gold mirror.
  - **Nacre:** lilac and mint in the pearl film (mint 0.5 % in the rail zone).
  - **Geode:** mint and lilac, and it is the secret world.
  - **Ferrum:** the only ground that measured free of all four platform colours.
  - Its dark iron-rose also sits apart from the poster's violet, amber and pearl, so the poster leads.
- **agent:** round3
- **check:**
  - **guard.py, whole picture and right 35 % (the info rail):**
    - desktop: 0.00 % ember, lilac, sun and mint in both;
    - phone: 0.00 % for all four (the right 35 % has ember caution 0.01 %, nothing guarded).
    - A 3 px ember-red glint sliver near where the phone's Continue sits was removed by turning the view 0.05 rad (phone yawE 1.25 against desktop 1.2).
  - **Floor colour** (median): desktop #78383F (ember ΔE 33.4), phone #612F30 (ember ΔE 37.0). Both free.
  - **measure.py light:** desktop dark, L 0.048; phone dark, L 0.093.
  - **Page mocks** with the poster laid over them the way references 04 and 07 lay out the page (`work/round3/mock-backdrop-desktop.png`, `mock-backdrop-phone.png`): the poster leads. The floor reads as ground under the hero and the rail stays on calm night.
- **couldn't make / caveats:**
  - **The phone floor reaches the bottom of the 826 px asset.** If the page shows the whole asset, Continue sits on the dusky floor (ember on #612F30, contrast ≈ 3.5:1, against ≈ 6:1 on the page night). In reference 07 the backdrop stops just under the info card, which would show only the horizon and the first band of floor.
  - Ferrum's sky contour lines are its own muddy olive and red (s1/s2 at neb 0.03). They show only in the side margins.

## Choices
- **Share-card title placement:** lower-left, below the Eclipse's level. The letters then span 40 % of the width without touching the Eclipse, and stay above the minimum size at a 270 px preview.
- **Lockup fill:** the sweep, not the title screen's plain #F2ECF7, following the lead.
- **Lockup minimum:** an 18 px cap height (the strict end), because the lettering carries a glow and a split.
- **Backdrop light:** one key from the upper left, the same vector as the poster. No light source is drawn: the poster's Eclipse is the page's only drawn light.
- **No Eclipse and no sunburst in the backdrop**, so there is no second focal point.
