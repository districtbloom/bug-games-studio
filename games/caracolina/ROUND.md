# Caracolina

## Where it is

- **Round 1 (the design pass), 20 Oct:** reviewed. 19 approved, 2 to fix, 1 missing. The verdicts and sheets are in `reviews/round-1/`.
- **On the preview:** it's on the live For You wall and on its game page in the real template, in the design chat's preview. Every picture there is yours. The words marked stand-in are waiting for yours.

## Round 2: what's asked now

Work on the branch `caracolina/round-2` and open a pull request titled `Caracolina: round 2`. Keep every approved picture as it is.

### 1. Fix these pictures

1. **Gallery** (`bug/gallery/01.png … 06.png`) · needs-changes · PD-3.5: Slide 04 is a plank-thin Lluna in a flat noon-blue sky (C .615, loud). It is a dot at 100 px and close to a plain engine frame that loses the look, so recompose it tighter. Slide 03 misses "the bottom 26 px calm" because of the checkerboard floor: raise the camera or crop a hedge or wall base into the bottom. 01, 02, 05 and 06 are strong.
2. **Share card** (`bug/share-card.png`) · needs-changes · PD-3.15: The art is right (poster register, subject at x 0.71, quiet bottom band, no ember), but the must "the one place the game's title lettering sits on the art" is unmet: no title is lettered. Add it in the plain upper-left sky once the lockup exists.
3. **Title lettering** (`bug/title-lockup.png`) · missing · PD-4: There is no title-lockup.png. The game's drawTitle needs Caprasimo, which the sandbox could not load. Render it in a real browser, state its minimum width, then use it on the share card.

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
