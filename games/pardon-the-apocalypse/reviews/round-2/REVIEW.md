# Pardon the Apocalypse · round 2 review

Branch `pardon-the-apocalypse/round-2`. Pictures and words reviewed at 7c4cb65. The moving poster was reviewed at 9b934cb, the last version that passes its own tests, as the hand-off asked.

**Verdict: 6 approved, 1 to finish.** The poster now says what the game is. One thing is left before merging: the moving poster on the burning poster.

## What's approved

- **Poster, tall and square:**
  - The premise reads at a glance on the wall. The smile has the city, its swarm and machines come down the street, Carmody Street burns, and the bus driver throws back.
  - It holds in every wall shape with Wren in each, and at 90×70. Light band: dark (L 0.177).
  - It goes past "one character, not busy", but that is the founder's ask ("everything's burning and machines"), and it keeps one light and one focal path.
  - Small: in the 577×163 strip the smile is cut at the top. Leave it unless it bothers you.
- **Phone poster:** recomposed as the same image.
- **Store, pigeon-pal:** reads as a bird at 40 px, distinct from biscuit-tape.
- **Share card:**
  - Legible at 270 px, with the smallest letters about 12 px.
  - The fire's single ember-near pixels (0.28%) are accepted as world detail from the founder's ask. They're never a block and nothing sits in the bottom band.
- **Words (`words.json`, `publish.json` line):**
  - **Lengths:** title 21, line under it 105, pitch 70 characters.
  - **Controls and moments:** controls cover every input with notes; every moment has a rule and a kind.
  - **Captions:** each is under 60 characters.
  - **Honesty:** place strings are honest proposals, because the build doesn't call `progress.set` yet. The event's rule and target are UNDECIDED.
  - **Colour:** the echo `#FF7CC0` is clear of the platform colours (lowest ΔE 22.8, to lilac).
  - **Banned words:** none.
- **Round-2 words in `design.json`:** store kind lines and row line, the pass's sentence and reward names, the update title and change, and the event text and unit. No prices. The update version is UNDECIDED, and your note that the antenna may already be in the first upload is right.

## To finish (round 2b, same branch)

1. **Moving poster · PD-3.2.**
   - At 9b934cb it works on the living board (open, three squeezes, a seam moment, no console errors).
   - Wren stays in view on every plate, the narrow plate stacks the fight, and the loop shows the premise.
   - The problem: its held frame is the first round-2 poster, without the fire. Finish the burning rework from 7c4cb65 so the held frame matches `poster.png`, `poster-2x3.png` and `poster-1x1.png` again. Keep `inview.py` at 0 frames out of view.

**Optional:** the egg toss is the game's own verb, so keep it. The founder asked for variety on the wall, though. A second item for the machine side, for example `acts: { egg: 'toss', scan: 'beam' }` in Kindly's pink, would let the wall show Kindly answering.

## Answers to your questions

- **Wren's near-platform pixels:** acceptable everywhere. Don't recolour her.
- **The 120 px rule:** your reading is right, the same share of the height at every size.
- **OffscreenCanvas:** runs on the living board with no errors. Keep it as a private cache; the final call is the platform's.
- **`create()` cost:** 50–70 ms once is fine for now.
- **Gone to Yelnur:** which moments game.json declares, the update's version string, the event's light (bulbs or pink rim), and fire pixels on the share card.

## Sheets in this folder

- `poster-round1-vs-round2.jpg`
- `wall-shapes.png` (wall.py, focus 0.42, 0.50)
- `share-card-before-after-270.jpg`
- `store-row-169-and-40.jpg`
- `foryou-open-9b934cb.jpg` and `foryou-squeezed-9b934cb.jpg` (the module on the living board)
