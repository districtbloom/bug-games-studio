# Buqu Will Not Bow · design pass review (arm A)

**Overall: approved with four changes.** 18 approved, 4 needs-changes, 0 missing (22 slots; video excluded).

Every world picture comes from the game's own renderer, and the gallery frames are real seeded autopilot runs. Every character, seal, mark and store item is drawn with the game's mosaic code. The result is one medium (glazed tesserae in cream grout) and one light per picture across the whole set. The poster holds in every wall.py shape and at 90×70. All files are at the named paths and sizes. There are 9 seal sets × 3 states: 8 proposed moments plus the Lantern Night event seal. Nothing shows reuse of earlier pictures, though pack A holds no earlier Buqu art to compare against. The notes are unusually candid about what was staged.

## The 3 strongest pictures

1. **Poster family (2:1, 2:3, 1:1, 9:16 and the moving poster).** One head and one dusk sun read from the hero down to the 140×305 column. Each crop is recomposed. The moving poster's held frame matches it (I rendered the module: no errors, no bars, anchor on the face).
2. **Icon, emblem and chip.** Each is drawn for its own size, with the parts reduced one step at a time. At 46/30/64 px on night and on linen they read as a stubborn glaring head, not a blob.
3. **Gallery 01–06.** Real moments, finished like the poster, subjects inside the central 4:3, calm bottom strips. 03 (the pagoda roof ride) and 06 (laying the last tiles at the Unpainted Edge) stand out.

## Top 5 changes, in priority order

1. **Update v5 (PD-3.12) · needs-changes.** The change (a firework fizzling against masonry) isn't visible. There is no rocket, the burst sits in pale haze about 90 px below the bricks, and at 104×52 the frame is a washed-out blob (L 0.92). Restage on a wall face where head, rocket and bricks touch in frame, on a darker ground.
2. **Share card (PD-3.15 / PD-4) · needs-changes.** At the 270 px link preview, the English caps are about 10 px, under the 12 px minimum. Enlarge the line to caps of about 53 px or more on the 1200 master, or let 不屈 carry the title alone. Keep the braid end clear of "BOW".
3. **Seal `every-hidden-seal` (PD-3.11) · needs-changes.** The chop's carved strokes read as "S"/"5" plus dashes at 96 and 48 px, which counts as text inside a seal. The pass already dropped sealTex from the result and gallery for this reason. Carve a non-letter glyph (the lotus from `lotus-chop`, a brush, or his head).
4. **Event banner (PD-3.14) · needs-changes.** A banner pole and two crimson chops whose strokes look like letters sit right on the 45% line, beside the copy and Join. Hide them, as the gallery and result stills did, so the copy edge is clean and no hot colour sits by Join.
5. **Gallery 04 (optional).** It shares the parade, noon sky, rainbow and Khan with 01, so the strip reads the same place twice. If another character beat exists in the build (a net guard on the Stair, the ferryman), it would vary the strip. Not required.

Smaller notes, no action needed: Mirror Lake's seal reads a little like a watermelon slice at 32 px. The pass-row jade ground is busy behind the thin rewards. The moving poster's loop frames reached about 2.8 ms in software GL, so time it on real hardware. Keep the lockup off linen.

## Per-slot table

| Slot | File(s) | Size check | Verdict | Note |
|---|---|---|---|---|
| poster | poster.png, -2x3, -1x1 | 3200×1600, 1200×1800, 1600×1600 ✓ | approved | Silhouette register, sun as source, reads at 90×70. Light band L .595 (light). |
| focus | publish.json 0.55,0.38 | ✓ | approved | Survives the strip, the column and 4:3. |
| icon | icon-46.png | 92×92 ✓ | approved | Last survivors drawn for 46. |
| emblem | emblem-30.png | 60×60 ✓ | approved | Fewer parts, own layout. |
| chip | chip-64.png | 128×128 ✓ | approved | Icon parts plus braid. |
| keyStill | key-still.png | 720×352 ✓ | approved | Guards close in. Reads at 132×66. |
| result | result-still.png | 1600×352 ✓ | approved | Landing payoff in the middle 720. No text. |
| gallery | gallery/01–06.png | 6 × 1600×800 ✓ | approved | Real build frames. 01 and 04 are a near pair. |
| seals | seals/ (27 files) | 192×192 ✓ | needs-changes | every-hidden-seal glyph reads as letters. |
| store | store/ (4) | 400×400 ✓ | approved | All read at 40 px, looks only. |
| passTile | pass/tile.png | 400×400 ✓ | approved | Name ≥125 px, the span as the picture. |
| passGrounds | pass/ground-*.png | 306×243 ✓ | approved | Three clear tiers. |
| marker | marker-next/held.png | 48×48 ✓ | approved | A lantern in two poses. |
| passRewards | pass/ (8) | 306×243 ✓ | approved | All read at 120. Tier shown by ground only. |
| owned | reward/laid.js, reward-held.png | 400×400 overlay ✓ | approved | "Laid", 720 ms, held frame reads at 40. |
| update | updates/v5.png, v5-thumb.png | 1600×800, 308×154 ✓ | needs-changes | Change not visible. Washed out at 104×52. |
| event | events/lantern-night-banner.png + seals | 1720×600 ✓ | needs-changes | Letter-like chops on the 45% line. |
| living | living-poster/buqu.js | module ✓ | approved | Rendered: recomposes, rm = poster, 0 errors. |
| backdrop | backdrop.png, -phone | 1440×577, 390×826 ✓ | approved | One light, a floor, separate compositions. |
| share | share-card.png | 1200×630 ✓ | needs-changes | English caps about 10 px at 270. |
| phone | poster-9x16.png | 1080×1920 ✓ | approved | Recomposed, same register. |
| lockup | title-lockup.png | 1600×1158 ✓ | approved | Min widths 134 / 201 px stated. |
| video | (excluded from this pass) | | | |

## Sheets in this folder

- `sheet-foryou.png`: wall.py hero and shapes, the poster at 685×343 and 90×70, plus the 2:3, 1:1 and 9:16 versions.
- `sheet-page.png`: gallery (full size and 100 px), Continue at 360×176 and 132×66, result, backdrops, share card at 420 and 270.
- `sheet-marks.png`: icon, emblem and chip at 1× on night and on linen and at 4×. Seals at 32 px in all states on both grounds, and at 96 px.
- `sheet-money.png`: store at 160 and 40 px (with the owned mark and greyscale), pass tile, grounds, marker, rewards at 200 and 120, update and 104×52 view, event banner with the 45% line and its seal.
- `wall-hero.png`, `wall-shapes.png`: the raw wall.py output.
- `check-gallery-4x3.png`: the central 4:3 crop of each gallery slide.
- `check-living-poster.png`: my own render of the module, every size in rm, plus idle, react, loop and squeezed.
