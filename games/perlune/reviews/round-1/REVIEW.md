# Perlune: design pass review (arm B)

**Overall verdict: approved with two fixes.** 20 slots approved, 2 need changes, 0 missing (the video slot was excluded).

The pass is coherent and fresh, and it reads unmistakably as Perlune: one liquid-chrome droplet, one contour-lined night and one finish (bloom on what emits, no vignette, grain 0.01). Almost every picture was rendered by the game's own WebGL2 renderer, staging real build moments. Nothing was copied from the arm B examples.

## Strongest three

1. **The poster.** "A droplet faces the Eclipse" is a clean stage register. On the For You wall it is the only dark, glossy 3D plate, so it stands apart from every neighbour (L 0.121, dark). It survives every wall.py shape and 90×70, and the 2:3, 1:1 and 9:16 versions are true recompositions.
2. **The gallery.** Six real moments in a telling order: the loop, the grown body, a place, a world-heart, the glide and the star finale. They vary in place and scale, every subject sits inside the central 4:3, and nothing is added on top.
3. **The small marks.** The icon, emblem and chip were each drawn for their own size, with enlarged eyes so they survive at 46 and 30 px. They read at 1× on night and on linen.

Also great: the moving poster. Its held frame matches the poster, and its squeeze, throw and loop all come from the game's own creature rules.

## Top changes, in priority order

1. **Event banner: make the lantern pool visible** (PD-3.14, "the world on a special day or night"). Right now the pearl film lights the whole right half, and the droplet is a 50 px shape near the top edge. Darken everything outside a clear pool around the droplet, and bring the droplet larger and lower into the right 55%.
2. **Result picture: make the payoff read** (PD-3.8, "the game's payoff moment"). The Bell's shards look like loose grey pyramids, and the droplet is about 100 px tall in a 352 px band. Move the camera in so the falling Bell and the colour-flood ring fill the middle 720×352.
3. **Seals: widen the state step** (PD-3.11). At 32 px on night, earned and in-progress are close, and the star glyph's ray ring disappears. Optional.
4. **Phone backdrop: keep Continue on night** (PD-3.6). The dusky Ferrum floor runs to the bottom of the 826 px picture, which leaves Continue at about 3.5:1 contrast. End the floor higher, or let it fall to night.
5. **Small polish:**
   - Poster: the crest is a flat grey cone, and the brightest rim flare is on the droplet's right, away from the Eclipse.
   - Title lockup: re-set it in Tilt Prism when the font is supplied.
   - Pass marker: the "next" gem washes out on linen.

## Per slot

| slot | rule | verdict | note |
|---|---|---|---|
| poster | PD-3.1 | approved | Stage register; reads at 685×343 and 90×70; versions recomposed. Polish: the crest, and rim light from the Eclipse's side. |
| focus | PD-3.1 | approved | 0.60,0.50 sits on the eyes; holds from the strip to the column and in the 4:3 crop. |
| icon | PD-3.7 | approved | Head, eyes and crest; reads on night and on linen. |
| emblem | PD-3.7 | approved | Its own render with fewer parts (no crest); reads at 30 px. |
| chip | PD-3.7 | approved | The droplet plus a small Eclipse: between the icon and the poster. |
| keyStill | PD-3.8 | approved | Moths closing in, droplet centred; reads at 132×66. |
| result | PD-3.8 | **needs-changes** | The payoff (the Bell broken, the world waking) isn't legible; move the camera in. |
| gallery | PD-3.5 | approved | Six real, varied moments, each inside the central 4:3; no text. |
| seals | PD-3.11 | approved | 10×3 states; the outlines are distinct at 32 px; earned and in-progress are close. |
| store | PD-3.9 | approved | Five looks-only items; distinct at 40 px and in greyscale; calm corners. |
| owned | PD-3.9 | approved | "Absorbed", about 800 ms, ends on the held frame; only a small dot at 40 px. |
| passTile | PD-3.10 | approved | The world's ground; no price; reads from 40 to 169 px. |
| passGrounds | PD-3.10 | approved | Free, pass and bug.pass are clearly different. |
| marker | CK-9 · RETURN | approved | The gem and the pearl ring are world objects; "next" is weak on linen. |
| passRewards | PD-3.10 | approved | Full art; the tier shown by the ground; all read at about 120 px. |
| update | PD-3.12 | approved | The real Chimera metamorphosis; reads at 104×52. |
| event | PD-3.14 | **needs-changes** | No visible lantern pool; the subject is too small and too high. |
| living | PD-3.2 | approved | The held frame equals the poster; full behaviour set; about 4 ms under software raster. |
| backdrop | PD-3.6 | approved | Ferrum at rest with a hard horizon; the poster leads; the phone floor runs under Continue. |
| share | PD-3.15 | approved | A fresh render; the subject at 0.73; the title in the plain left 43%. |
| phone | PD-2 #19 | approved | A true 9:16 recomposition in the same register. |
| lockup | PD-4 | approved | 120 px minimum; the published cover face, not Tilt Prism yet. |

## Copying (arm B)

None. Nothing on any example's notYours list appears: no moonbeam wedge, web, crystal heart, clay, thumbprints, pink disc, ruled paper, stamps, blueprint office, printout or dot sea. The violet and magenta are Perlune's own Eclipse and dust colours.

## How it was made

- **Rendered by the game:** the shipped build ran headless (Chromium/SwiftShader) with posed cameras and the game's own functions (`spawnEnemy`, `hitEnemy`, `metamorphosis`, `startFinale` and others). The proposed store and pass looks were swapped in at render time through hooks.
- **Drawn in code:** the seals in Python/numpy, with a port of the game's material shaders; the owned mark and the moving poster in Canvas 2D, porting the game's maths. The lockup was set in PIL.

## Measured here

- **Light bands (measure.py light):** the posters 0.121–0.137 (dark); the gallery 0.09–0.29 (01 and 02 are mid); the backdrop 0.048; the event 0.062.
- **Eclipse amber ring, sampled:** #8E5500, ΔE to sun 37.4, so it is free. The game's source hexes #FFB52E and #B28CFF would be sun- and lilac-guarded, but they appear only as darker glows.

## Sheets

`sheet-foryou.png`, `sheet-page.png`, `sheet-marks.png`, `sheet-money.png`, plus `wall-hero.png` and `wall-shapes.png` from wall.py. Scratch copies are in `out/work/`.
