# Out of Scope

## Where it is

- **Round 1 (the design pass), 20 Oct:** reviewed. 20 approved, 2 to fix, 0 missing. The verdicts and sheets are in `reviews/round-1/`.
- **On the preview:** it's on the live For You wall and on its game page in the real template, in the design chat's preview. Every picture there is yours. The words marked stand-in are waiting for yours.

## Round 2: what's asked now

Work on the branch `out-of-scope/round-2` and open a pull request titled `Out of Scope: round 2`. Keep every approved picture as it is.

### 1. Fix these pictures

1. **Gallery** (`bug/gallery/01.png … 06.png`) · needs-changes · PD-3.5: Slide 04 loses its subject: Kickback and his tank are cut at the bottom-left of the central 4:3, and a third of the frame is empty evidence slots, so 'hides the proof in his tank' doesn't show. Swap in the line-up 'Don't tap the glass' capture you already have, or recrop around the tank. Also loosen slide 01, whose bubbles are cut mid-word at both edges.
2. **Achievement seals** (`bug/seals/<moment>-earned.png, -progress.png, -locked.png`) · needs-changes · PD-3.11: 12 moments + the event, all three states, and the three outlines are distinct at 32 px. But at 32 px the not-yet case-closed is a right-pointing triangle in a ring (a Play button), and not-yet dont-tap-the-glass reads as a warning triangle. Keep the hat's brim and box, and the water band, in the grey line art.
3. **For You poster and moving poster** (founder, 20 Oct): rework them so they show rogue AI agents breaking out of the desktop, and what you do about it, not just a click.

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
