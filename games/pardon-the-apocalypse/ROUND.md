# Pardon the Apocalypse

## Where it is

- **Round 1 (the design pass), 20 Oct:** reviewed. 19 approved, 3 to fix, 0 missing. The verdicts and sheets are in `reviews/round-1/`.
- **On the preview:** it's on the live For You wall and on its game page in the real template, in the design chat's preview. Every picture there is yours. The words marked stand-in are waiting for yours.

## Round 2: what's asked now

Work on the branch `pardon-the-apocalypse/round-2` and open a pull request titled `Pardon the Apocalypse: round 2`. Keep every approved picture as it is.

### 1. Fix these pictures

1. **Store pictures** (`bug/store/<product id>.png`) · needs-changes · PD-3.9: pigeon-pal (Little Pope) reads at 40 px as plain Biscuit with a speck on top, nearly the same tile as biscuit-tape; show the pigeon itself large (or a tight crop on it on the lid) so the companion is what reads.
2. **Moving poster** (`bug/living-poster/`) · needs-changes · PD-3.2: On narrow plates (150x370 tested) the loop pans until Wren and the scooter both leave the frame and the plate shows only sky and houses; keep the anchor on Wren in every frame (bring the machine to her, or stack the fight vertically).
3. **Share card** (`bug/share-card.png`) · needs-changes · PD-3.15 · PD-4: At the 270 px link preview the lockup is ~136 px wide, under its own stated minimum of 344, so 'Pardon the' in the pill drops to ~3 px and only APOCALYPSE reads; enlarge the pill (or the whole lockup) for this card. Wren's 0.08% ember-near sprite pixels are acceptable.
4. **For You poster and moving poster** (founder, 20 Oct): rework them so a stranger sees the premise: the AI taking over the city, and the bus driver fighting its machines. Keep the driver in view in every plate shape.

### 2. Write the page's words

Round 4 of `direction/DIRECTION.md`. Write `bug/words.json` from `direction/WORDS_TEMPLATE.json`, and add the one-line pitch to `bug/publish.json` as `"line"` (at most 70 characters). Read the game's code for the real controls, moments and the place strings `progress.set` sends. Only what's true of the build, and UNDECIDED for anything that isn't decided.

In `bug/design.json`, add the round-2 words beside your proposals:
- each store item's kind line, and one line for the store row;
- the pass's one sentence;
- the update's title and what changed;
- the event's text and the counter's unit.

No prices, dates or target numbers.

### 3. Optional: your seam moment

The moving poster may set `acts: { <item>: 'toss' | 'shoot' | 'beam' | 'burst' | 'grab' }` so its moment on the wall fits the game. See `direction/CHANGELOG.md`.
