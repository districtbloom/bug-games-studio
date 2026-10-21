# Out of Scope: design pass review (arm A)

**Overall: approved with two changes.** 20 approved, 2 needs changes, 0 missing (22 slots; video excluded).

Every picture is new and made in the game's own code: its SVG drawing functions, rough marker line, dry-brush hatch and 3 px offset print, rendered in Chromium. Every slot sits at its named path and size. The whole set reads as one game under one light: the cracked CRT's acid glow in flat torn steps. Three pictures depart from that light on purpose, and say so: the event (dawn), the update (the cut's flash) and the gallery (the real build). Nothing reuses earlier art. The old wall tile (No 009, blue Regent with sharks) is a different picture.

My own checks:
- wall.py with focus 0.39,0.32 gives `wall-hero.png` and `wall-shapes.png`. The chat couldn't make the hero; I made it with the kit's reference wall.
- Light bands: poster L .346 / C .247, mid. Key still is light, result dark, backdrop dark, share card dark.
- Guarded-colour scan: no 24×24 block on any poster. The lowest guarded pixel sits 182 px above the bottom at 1600×800.
- 32 px seal strips in all states, on night and on linen.
- A harness run of the moving poster at tiny, tall, wide and squeezed sizes (`living-check.png`).

## The 3 strongest pictures
1. **Event banner, Mail Day.** Dawn pink through Gordon's window, envelopes blowing in like weather, Bcc riding the crest. It is clearly a special day, the left 45 % is one flat dark colour, and the right 55 % tells the event alone.
2. **The poster** (and its 2:3 / 1:1 / 9:16 family). It can be named in five words: grinning empty suit, raised stamp. One source of light, and on the real wall the face, hat and stamp survive from the 577×163 strip to the 140×305 column.
3. **Icon.** Head, gold crescents, white grin and hat, drawn for 46. Beside Carbon, Inkstrike and Typos it is the one you find first, on night and on linen.

Also very good: the result still (the lie breaking), the owned mark "stamped" (560 ms, readable at 40) and the title lockup (min 92 px, true).

## Top 5 changes, in priority order
1. **Gallery 04 (PD-3.5, "subject inside the central 4:3").** Kickback and his tank are cut at the bottom-left of the 4:3, and a third of the frame is empty evidence slots. The caption's "in his tank" doesn't show. Use the line-up "Don't tap the glass" capture the chat already took (`K2-tap1+1120`), or recrop around the tank.
2. **Seals case-closed and dont-tap-the-glass, not-yet state (PD-3.11, never "a glyph that reads as something generic at 32 px").** At 32 px the grey case-closed is a right-pointing triangle in a ring, which reads as a Play button. The grey shark fin reads as a warning triangle. Keep the hat's brim band and stamp box, and the water band, in the line art.
3. **Gallery 01 (PD-3.5).** The crop cuts Halo's and Bcc's bubbles mid-word at both edges, and it is the busiest slide at 100 px. Shift or widen it so the line-up reads as a row.
4. **Backdrop (PD-3.6), optional.** The empty CEO chair has no back or arms, and at page size it reads as a headstone with rivets. Give it a backrest and arms.
5. **Moving poster (PD-3.2, "≤ ~2 ms a frame").** I measured 3.5 ms a frame at 600×400 on this software canvas; the chat measured 0.1–0.3 ms of script time. Confirm on a GPU laptop before it ships.
   - Smaller: the update reads only just at 104×52. A tighter crop on the scissors would help.

## Per slot

| Slot | Verdict | Note | Rule |
|---|---|---|---|
| poster | approved | Stage register, one source of light, holds in every wall shape and at 90×70. The hat's "OK" is costume, not title lettering. | PD-3.1 |
| focus | approved | On the face. Strip, column, half plate and 4:3 all hold. | PD-3.1 |
| icon | approved | Drawn for 46; distinct among three other games' icons. | PD-3.7 |
| emblem | approved | Hat and grin only, a new drawing, holds at 30. | PD-3.7 |
| chip | approved | Chest-up, stamp raised; between icon and poster. | PD-3.7 |
| keyStill | approved | Stamp over the unsigned slip, no text, reads at 132×66. Light band is light; the hatch is noisy. | PD-3.8 |
| result | approved | The lie breaks, centred, no text. | PD-3.8 |
| gallery | **needs-changes** | Slide 04 loses Kickback and his tank. Slide 01 cuts its bubbles. Real build captures, varied, no added text. | PD-3.5 |
| seals | **needs-changes** | 13 × 3 states, outlines distinct, no gold or padlock. Not-yet case-closed reads as Play, dont-tap as a warning sign. | PD-3.11 |
| store | approved | Five looks-only items; read at 40 and in greyscale; calm top corners. | PD-3.9 |
| passTile | approved | Lettered "NIGHT SHIFT", readable from 80 px, no price. | PD-3.10 |
| passGrounds | approved | Wood, acid pocket and navy city: three clearly different grounds. | PD-3.10 |
| marker | approved | Rubber stamp, next and held, 48 px. | CK-9 |
| passRewards | approved | Six rewards read at 120. Watch night-window: navy on navy. | PD-3.10 |
| owned | approved | "Stamped", 560 ms, held frame reads at 40. | PD-3.9 |
| update | approved | Case 02 cut, one change, in the build. Weak at 104×52. | PD-3.12 |
| event | approved | Mail Day. Left 45 % flat, distinct event seal. | PD-3.14 |
| living | approved | Recomposes at every size, held frame = poster, no errors. Frame time unverified on GPU. | PD-3.2 |
| backdrop | approved | One light, hard floor, poster leads. The chair reads as a headstone. | PD-3.6 |
| share | approved | Poster's register; lockup at left; quiet floor band; matches at 270. | PD-3.15 |
| phone | approved | A 9:16 recomposition, not a crop. | PD-2 #19 |
| lockup | approved | The game's Tabloid face, min 92 px stated and true. | PD-4 |

Sheets: `sheet-foryou.png`, `sheet-page.png`, `sheet-marks.png`, `sheet-money.png`. Evidence: `wall-hero.png`, `wall-shapes.png`, `living-check.png`.
