# Pardon the Apocalypse · design pass review (arm B)

**Overall: nearly there. 19 approved, 3 needs-changes, 0 missing (video excluded).**

The whole set is made inside the real build, using the game's own drawing functions, or hand-placed in its code and palette. It holds together as one finish: pixel people with a 1 px ink line, smooth gloss for Kindly and its machines, Bayer dither for light and shadow, and one visible light in every picture. The poster (Wren lobs an egg at Kindly's smiley moon) is a clean *stage* plate in the dark band. It holds in the wall hero and in every wall.py shape. Nothing was reused from earlier pictures, and nothing was copied from the examples.

Sheets: `sheet-foryou.png`, `sheet-page.png`, `sheet-marks.png`, `sheet-money.png`, plus `wall-hero.png` and `wall-shapes.png`.

## The 3 strongest pictures

1. **Poster.** One character, one moment, one light, and it can be named in five words. The pink rim falls on the side facing the smile, and the caption strip and bottom-left stay calm. On the wall it sits dark beside Threadbare (dark|dark is tolerated). The 2:3, 1:1 and 9:16 versions are real recompositions, not crops.
2. **Continue picture (key-still).** Wren freezes and holds Biscuit back while the drone's pink scan ring lands one step below them. It's real tension with the subject centred, and it still reads at 132×66.
3. **Result picture.** Dolly and Wren laugh over the tarts under the one pendant lamp. It's warm, lit by the people's own light, and every part of it sits inside the middle 720. It has no text: the stove dial's figures were painted out.

Also strong: the event banner's dark Kindly pod (the poster's moon, switched off), the "punched" owned mark (a reward verb that belongs to this world) and the three seal outlines (token, bus transfer, gable).

## Top 5 changes, in priority order

1. **Store · pigeon-pal (PD-3.9, "shown as itself or worn, whichever reads better at 40 px").** At 40 px it reads as plain Biscuit with a speck on top, almost the same tile as biscuit-tape. Show the pigeon itself large, or crop tight on it on the lid.
2. **Share card (PD-3.15 / PD-4, letters at least 12–18 px wherever the lockup appears).** At the 270 px link preview the lockup is about 136 px wide, under its own stated minimum of 344 px. "Pardon the" in the pill drops to about 3 px, so only APOCALYPSE reads. Enlarge the pill, or the whole lockup, for this card. Wren's ember-near sprite pixels (0.08%) are acceptable: they're single pixels of her own art.
3. **Moving poster (PD-3.2, "an anchor() on the character, so every crop keeps it in view").** On the 150×370 plate the loop pans until Wren and the scooter both leave the frame, and some frames show only sky and houses. Keep Wren in every frame: bring the machine to her, or stack the fight vertically.
4. **Poster polish (PD-3.1, light from a source in the picture).** The flying egg's highlight sits on its up-left, away from the smile. Relight it from the up-right, as the marker egg already is. It's small, but it's on the focal path.
5. **Event banner polish (PD-3.14).** The string bulbs read as little pastel crosses, like bunting, and their warm light barely lands on the diners. Make the bulbs read as bulbs and let a warm rim fall on faces and cloth. Also, use the update picture only if the antenna ships after launch: it's already in the build.

Optional: a focus y of about 0.50 would keep the smile's face in the 577×163 strip, which now shows only its lower half.

## Per-slot verdicts

| Slot | Verdict | Note | Rule |
|---|---|---|---|
| poster | approved | Stage plate, one light, dark band, recomposed 2:3 and 1:1. Polish: relight the egg from up-right. | PD-3.1 |
| focus | approved | 0.47,0.56 holds every shape, the 4:3 crop and the half plate. The strip clips the smile. | PD-3.1 |
| icon | approved | Capped head in profile, drawn for 46, one pink rim. Reads on night and linen. | PD-3.7 |
| emblem | approved | The red cap alone, fewer parts than the icon, not generic. | PD-3.7 |
| keyStill | approved | The drone's scan lands below Wren and Biscuit. Subject centred, same finish. | PD-3.8 |
| result | approved | The tart table under one lamp, inside the middle 720, no text. | PD-3.8 |
| gallery | approved | Six real, varied moments, subject in the central 4:3, only the game's own HUD on 01. | PD-3.5 |
| seals | approved | 9 sets × 3 states. The outlines differ at 32 px. Weakest: the lever glyph; progress is subtle. | PD-3.11 |
| store | **needs-changes** | pigeon-pal reads as plain Biscuit at 40 px. Show the pigeon. | PD-3.9 |
| passTile | approved | Name on a transfer ticket in ptext. No price. | PD-3.10 |
| passGrounds | approved | Night pavement, Car 17 slats, teal linoleum: three clearly different. | PD-3.10 |
| marker | approved | The egg rolling and the egg in a carton cup, drawn for 48. | CK-9 |
| passRewards | approved | Six items, full art at rest. The tart's custard reads like a bun. | PD-3.10 |
| owned | approved | "Punched" hole, under 900 ms, the held ring visible at 40 px. | PD-3.9 |
| update | approved | Antenna and walkie rings, no version lettering, reads at 104×52. Only if it ships after launch. | PD-3.12 |
| event | approved | A different night, left 45% plain, distinct gable seal. The bulbs are weak. | PD-3.14 |
| living | **needs-changes** | The loop loses Wren entirely on narrow plates. Keep the anchor. | PD-3.2 |
| backdrop | approved | The street at rest with one off-frame glow. Phone composed separately. The poster leads. | PD-3.6 |
| share | **needs-changes** | The title pill is illegible at 270 px. Enlarge it. Ember pixels OK. | PD-3.15 / PD-4 |
| chip | approved | Wren raises an egg toward the glow. Between the icon and the poster in detail. | PD-3.7 |
| phone | approved | A true 9:16 recomposition, same one image. | PD-2 #19 |
| lockup | approved | The game's own lettering, minimum width 344 px, off the poster. | PD-4 |

## Copying (arm B)

None. The big pink disc behind the character recalls Gob's pink disc, but here it is Kindly's own `kSmiley` from the game code, in the game's own pink. No moonbeam wedge, crystal, clay, thumbprints, ruled paper, stamps, dot whale or lighthouse beams appear. The seal-outline idea (coin, tag, gable) follows the rule, not Gob's materials.

## How it was made

The art was rendered in a headless browser inside the current build (`tools/render.py`), calling the game's functions (`areaCanvas`, `personFrame`, `kSmiley`, `drawBiscuit`, `drawEnemy`, gloss) with new light passes written on the game's helpers. The small marks, the seals and some props are hand-placed pixel maps in the game palette. The moving poster and the owned mark are hand-written JS modules with baked game sprites. Seven agents worked in parallel, with a lead who reviewed side by side and sent two pictures back to be remade.
