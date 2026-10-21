# Caracolina · design pass review (arm B)

**Overall: approved with changes.** Of 22 slots (video excluded): 19 approved, 2 need changes, 1 missing.

This pass is fresh and coherent:
- Every scene is a new frame from the game's own gouache-and-pencil WebGL renderer, mostly in one low western sun.
- Every drawn piece (marks, seals, store, pass, owned mark) shares one cut-paper-on-sketchbook language, made with the game's own 2D code.
- The poster is a clean silhouette, and it survives every wall shape around the focus point (0.655, 0.30).

What is left: lettering (no lockup, so the share card has no title) and two gallery slides.

Copying (arm B): nothing was copied outright and no pixels were reused. There are two borderline echoes:
- The seal-kind scheme (round / taped square / scallop) mirrors Gob's, and Gob's `notYours` names "the taped tag". It is grounded in the game's own washi tape and shell.
- The ruled cream store ground recalls Carbon's tile, but without its orange margin line. The chat says it comes from the game's own sketchbook CSS, which I could not check here.

## Three strongest pictures

1. **Poster (and its moving version).** "A lighthouse standing over the sun", lit by a sun you can see.
   - It holds in the 577×163 strip, the 140×305 column, at 90×70 and in a 4:3 crop.
   - The 2:3, 1:1 and 9:16 were recomposed in the renderer, not cropped.
   - The moving poster recomposes at every plate size I ran it at (120×90 up to 900×200), with no errors and 0.1–1.3 ms a frame. Its held frame matches the still.
2. **Seals.** One system for all 13: a trencadís-rimmed coin (feat), a taped print (collection) and a scallop (event).
   - The three states are drawn in the world: dusk, blue hour, and the game's own graphite "not painted yet".
   - The three kinds read apart at 32 px. No gold, padlock or text.
3. **Gallery 02.** The pencil courtyard flooding with paint where you look. It shows the second mechanic in one frame, in the game's own look.

Honourable mentions:
- The store and pass family: cut-paper items on page, gouache and night-trencadís grounds.
- The key still: the sun a finger above the shell's lip.

## Top 5 changes, in priority order

1. **Lettering (PD-4, PD-3.15).**
   - Render `title-lockup.png` with the game's `drawTitle` (Caprasimo) in a real browser, and state its minimum width.
   - Letter the title into the share card's plain upper-left sky.
   - Optionally, letter "Sketchbook pass" on the pass tile's blank label.
2. **Gallery 04 (PD-3.5).** Lluna is a plank-thin figure in a flat noon-blue sky (C .615, loud), and a dot at 100 px. As it stands it is close to a plain engine frame that loses the look. Recompose it tighter, so she fills the central 4:3 and some gouache surface is in frame.
3. **Gallery 03 (PD-3.5, "bottom 26 px calm").** The checkerboard floor runs under the caption zone. Pitch up or crop so that a hedge or wall base takes the bottom, or swap the place for another.
4. **Result picture (PD-3.8), optional.** The six photographs read as white-speckled smudges at 800×176. If any lit angle or hour lets the prints read, use it, since they are the payoff.
5. **Seals at 32 px (PD-3.11), polish.**
   - Strengthen doves-round-the-tower (it reads as a totem) and lluna-in-the-air (a bent bar).
   - Lift the progress state a touch on night: it is almost black at 32 px.
   - Optionally, give the collection outline a form less like Gob's taped tag, such as a ring-bound sketchbook page.

## Per-slot verdicts

| Slot | Verdict | Note |
|---|---|---|
| poster | approved | Silhouette, sun in frame, calm bottom; the sun disc is a free colour and only its glow is guarded. Light band: light. |
| focus | approved | On the hips; holds in every wall shape and in 4:3. |
| icon | approved | Head, band, legs, sun: drawn for 46, reads on night and linen. |
| emblem | approved | New, fewer parts than the icon; holds at 30. |
| chip | approved | More parts than the icon, far fewer than the poster. |
| keyStill | approved | Real tension, centred, the poster's finish; reads at 132×66. |
| result | approved | Right payoff and centring; the prints read weakly. |
| gallery | needs-changes | 04 is weak (loud, tiny subject); 03's bottom 26 px are not calm. 01, 02, 05 and 06 are strong. |
| seals | approved | 12 moments + event, 3 states each; doves and lluna weakest at 32 px. |
| store | approved | Five looks-only items; calm corners; read at 40 px and in greyscale. |
| passTile | approved | The sketchbook itself; the name is optional and still to letter. |
| passGrounds | approved | Page / gouache / trencadís: three clear tiers. |
| marker | approved | Taped print, next and held; counts nothing. |
| passRewards | approved | Nine world objects; read at 120 px on their grounds. |
| owned | approved | "Taped in", 620 ms, plays once, held frame reads at 40 px. |
| update | approved | One change (a resident faces you); reads at 104×52; no version. |
| event | approved | Night, left 45% calm, right 55% tells it alone; distinct event seal. |
| living | approved | Recomposes at every size, fast, no errors; the iris dims the plate once a loop for about 0.17 s. |
| backdrop | approved | Bay at rest; the phone version is composed separately; the poster leads. |
| share | needs-changes | The art is right, but the title is not lettered (PD-3.15 must). |
| phone | approved | Recomposed at 9:16; same image and register. |
| lockup | missing | Not made: the fonts were unavailable in the sandbox. |

## How it was made
- **Renderer:** all posters, stills, gallery, update, event, backdrops and share card come from the game's own WebGL renderer.
- **Game's own 2D code:** marks, seals, store, pass and marker were drawn with it (paint.js, people_paint.js) via Playwright.
- **Canvas 2D modules:** the owned mark, and the moving poster.

## My checks
- Pixel sizes: every file matches its slot. `checks/` is absent, so I used my own sheets.
- `wall.py` was run with the game's focus point.
- `measure.py light` on every scene picture, and `measure.py colour` on the poster's sun disc and glow.
- Sheets: `sheet-foryou.png`, `sheet-page.png`, `sheet-marks.png`, `sheet-money.png`, plus `wall-hero.png` and `wall-shapes.png`.
- I ran the living-poster module in my own Playwright harness: 12 sizes and modes, frame times, and a luma trace of the loop.
