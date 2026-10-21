# Stage 1 pilots

## `poster`: `pilots/poster.png`

| | |
|---|---|
| Master size | 2400×1200 (2:1, above the 1600×800 minimum) |
| Scene | The moment they got out. Regent climbs out of the cracked cream monitor. Kickback lunges from the left of the glass and Bcc slides out of the right edge. Halo floats above, Deadline sits on the cobalt patch, and forged slips with no words fly round them. |
| Lettering | None. The game's scrawled words are switched off. Regent's tiny OK hat stamp stays as part of the character. |
| Focus | (0.50, 0.45), the monitor and Regent's grin |
| Caption strip | The bottom 30 of 800 design px are a plain black floor. That is more than 26 px. |
| Squint | `squint.png` shows 740×370, 260×367, 150×177 and 90×70. At 90×70 you still see a glowing broken screen, a grinning black head and the shark. |
| Light | `L 0.35 C 0.325 mid`: not loud |
| Colours | Every colour in the plate was measured. None is guarded. The caution colours (shark grey, blood, fuse orange, a cardboard brown in one slip icon) sit inside characters and objects, away from the right edge. |

## `icon-46`: `pilots/icon-46.png`

- **Size.** 92×92, drawn for 46 px. The source is `src/marks/icon-46.svg`.
- **Last survivors.** The cream monitor, the acid crescent eyes and white teeth, and Regent's paper hat worn on top.
- **Parts dropped for size.** The cables, the stand detail, the red stamp colour (now an ink box, so no caution colour sits next to Continue) and the torn patch.
- **Checks** (`mark.png`)
  - 1× on night and on linen, beside a blob, a gem and a letter. Linen is approximated as `#efe9dc`.
  - 2× nearest-neighbour.
  - It reads as a grinning monitor in a paper hat, not as a blob, gem or letter.
- **Colours.** All free.
- **Light.** `L 0.246 C 0.062 mid`.

## `store-office-fern`: `pilots/store-office-fern.png`

- **Size.** 400×400. The 40 px and greyscale reads are in `store.png`.
- **What it shows.** Gordon's fern, the plant Kickback walks off with in the cold open, as a desk companion.
- **Ground.** The desk, with acid and pink torn patches behind. The pot is office-issue cream with a cobalt band.
- **Colours.** All free. The terracotta pot was measured GUARDED (ember 10.9) and replaced.
- **Light.** `L 0.432 C 0.307 mid`.
- **Draft entry** (goes in `store.draft.json` in stage 3):

```json
{ "id": "office-fern", "name": "Gordon's fern", "description": "A desk fern that sits by your evidence. Looks only.",
  "kind": "durable", "price": "UNDECIDED (Q1)", "proposal": true }
```

- **PROPOSAL.** The game has no looks or store layer yet. To show this item, it would need a desk-companion slot, and buying through `monetization.purchase` once staff approve.
