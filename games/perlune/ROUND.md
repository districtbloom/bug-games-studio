# Perlune

## Where it is

- **Round 1 (the design pass), 20 Oct:** reviewed. 20 approved, 2 to fix, 0 missing. The verdicts and sheets are in `reviews/round-1/`.
- **On the preview:** it's on the live For You wall and on its game page in the real template, in the design chat's preview. Every picture there is yours. The words marked stand-in are waiting for yours.

## Round 2: what's asked now

Work on the branch `perlune/round-2` and open a pull request titled `Perlune: round 2`. Keep every approved picture as it is.

### 1. Fix these pictures

1. **Result picture** (`bug/result-still.png`) · needs-changes · PD-3.8: The payoff doesn't read: the Bell's shards look like loose grey pyramids, and the droplet is about 100 px tall in the 352 px band, so behind the headline it is just 'a droplet on a planet'. Bring the camera in so the falling Bell and the colour-flood ring are the subject of the middle 720x352 (must: the game's payoff moment).
2. **Event banner and seal** (`bug/events/<event id>-banner.png and bug/seals/<event id>-earned.png, -progress.png, -locked.png`) · needs-changes · PD-3.14: Lantern Night doesn't read as a special night: the pearl film lights Nacre's cap and limb across the whole right half, so there is no visible pool of light around the droplet, and the droplet is a small 50 px shape near the top edge. Darken the world outside a clear lantern pool and bring the droplet larger and lower into the right 55% (must: the world on a special day or night; the subject in the right 55%).
3. **Moving poster** (founder, 20 Oct): when the plate is squeezed or made a strip, keep the droplet in frame, and hold the composition in a 3.5:1 strip. The wall now has a squeeze guard as a safety net, but the module should hold on its own.

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
