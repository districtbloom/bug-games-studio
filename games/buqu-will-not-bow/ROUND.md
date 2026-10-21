# Buqu Will Not Bow

## Where it is

- **Round 1 (the design pass), 20 Oct:** reviewed. 18 approved, 4 to fix, 0 missing. The verdicts and sheets are in `reviews/round-1/`.
- **On the preview:** it's on the live For You wall and on its game page in the real template, in the design chat's preview. Every picture there is yours. The words marked stand-in are waiting for yours.

## Round 2: what's asked now

Work on the branch `buqu-will-not-bow/round-2` and open a pull request titled `Buqu Will Not Bow: round 2`. Keep every approved picture as it is.

### 1. Fix these pictures

1. **Achievement seals** (`bug/seals/<moment>-earned.png, -progress.png, -locked.png`) · needs-changes · PD-3.11: 'every-hidden-seal' carves the game's chop strokes, which read as an 'S'/'5' with dashes at 96 and 48 px: text inside the seal (the pass itself left sealTex out of the result and gallery for this reason). Carve a non-letter glyph. The other eight seals and the three outlines read well at 32. Mirror Lake reads a little like a watermelon slice.
2. **Update picture** (`bug/updates/<version>.png`) · needs-changes · PD-3.12: The change (a rocket fizzling against masonry) doesn't read: no rocket or wall contact is visible, the burst sits in pale haze about 90 px below the bricks, and at 104x52 it is a washed-out blob (L 0.92). Restage or reframe on a wall face where head, rocket and bricks touch in frame, ideally on a darker ground.
3. **Event banner and seal** (`bug/events/<event id>-banner.png and bug/seals/<event id>-earned.png, -progress.png, -locked.png`) · needs-changes · PD-3.14: A good night variant, clearly different from the poster, with a round-ring event seal in three states. But a banner pole and two crimson seal chops whose strokes read as letters sit right on the 45% line beside the copy and Join. Hide them, as the pass did elsewhere, so the left 45% edge is clean.
4. **Share card** (`bug/share-card.png`) · needs-changes · PD-3.15 / PD-4: At the 270 px link preview, the English line 'BUQU WILL / NOT BOW' has caps about 10 px, below the 12 px lettering minimum. Enlarge it to caps of about 53 px or more on the 1200 master, or drop it and let 不屈 carry the title. The braid's end also crowds 'BOW'. Register, subject at 0.755 and the quiet bottom band are right.

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
