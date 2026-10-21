# Miracle Thieves

## Where it is

- **New to the studio, 21 Oct.** No pictures or words here yet. This is round 1: the whole design pass.
- **The game:** `districtbloom/miracle-thieves`, `main` (v2, tests green). Nothing on bug.games yet.
- **Its old store art is out:** `public/cover.png` and `shot-1..4.png` are from the 1 Oct art pass and show the v1 game. Don't reuse, crop or repaint them (START_HERE rule 1).

## Round 1: what's asked now

Work on the branch `miracle-thieves/round-1` and open a pull request titled `Miracle Thieves: round 1`. Do the whole pass in one go, as `direction/START_HERE.md` says: all four rounds of `direction/DIRECTION.md`, pictures 1–22 and words 23–31, then hand back once.

### 1. From the game itself

- **Render from the v2 build.** Use the game's own renderer and its stage tools (`tools/stills.mjs`, `tools/stage-*.mjs`, `tools/scenes.mjs`), with `window.__envSnap = true`.
- **Where a picture can't be rendered,** draw it with the game's own code and palette (`docs/ART-DIRECTION.md`, `src/sim/defs.ts` `EL_COLOR`), and say so in `NOTES.md`.
- **The style note** (step 0) comes from `docs/ART-DIRECTION.md` and DESIGN.md §5:
  - the contrast: broke, patched thieves in a magnificent, slightly wrong cathedral;
  - the area palettes and shared materials.
- **The influences are original adaptations.** Never copy a reference artwork or name an artist on a picture.
- **Look at every capture** before you call a picture done. Under SwiftShader, expect about 1 fps, and text that lingers in a still is usually a frame-locked artefact.
- **Don't change the game for this work:** no edits to `src/`, `public/` or `game.json` in the game repo. Everything you make goes in `games/miracle-thieves/` here.

### 2. What the pictures must show

- **The For You poster shows the premise** (founder, 20 Oct): who you are and what you're up against.
  - Who you are: four broke wizards.
  - What you're up against: a cathedral that hoards miracles, and the Custodian.
  - Keep a thief in view in every shape: 2:1, 2:3, 1:1 and 9:16.
- **The moving poster** (`bug/living-poster/`) follows `direction/LIVING_POSTER_CONTRACT.md`:
  - It is a small drawing module: no imports, no images, no timers. three.js can't come with it, so draw the scene in 2D, in the game's palette and shapes.
  - Keep a thief in view on every plate, from narrow to wide.
  - Pick the seam moment that fits the game (`acts`). A spell is `shoot`, `beam` or `burst`; a stolen relic is `grab`.
- **Readability stays the game's own:**
  - ruby, serrated shapes only for danger;
  - friendly magic is rounded;
  - ivory means the safe way.
- **bug.games' colours:** the game's gold (`#e4b53c`, also its accent) sits near bug.games' sun `#FFCB57`, and its vermilion and ruby sit near ember `#FF5A36`.
  - Check each one with `python3 direction/tools/measure.py colour '#RRGGBB'`.
  - Never use them as a flat, button-like block where the page's controls sit.

### 3. Seals: the seven moments the build sends

These come from `ACH` in `src/client/save.ts`, the entries that carry a `moment`, and they match `game.json`.

| Moment | File stem |
|---|---|
| Into the Cloister | `into-the-cloister` |
| The Custodian Wakes | `the-custodian-wakes` |
| A Miracle Stolen | `a-miracle-stolen` |
| Nobody Left Behind | `nobody-left-behind` |
| All Seals Broken | `all-seals-broken` |
| Public Nuisance | `public-nuisance` |
| Least Favourite Thieves | `least-favourite-thieves` |

Each moment gets `-earned`, `-progress` and `-locked`. Check them in one 32 px strip, the not-yet state included.

### 4. Round 2, design only

- **Store pictures:** the game's two real products are `starter_pack` (Thieves' Starter Pack, cosmetic) and `miracle_relight` (Miracle Relight, the once-per-run revive).
  - Picture both.
  - Any further items are proposals in `bug/design.json`.
  - Nothing sells power: that is the game's own ban.
- **The update picture:** the v2 update is real (fair boss, getaway, new spells, duets, Today's Job). Picture that one.
- **The pass and the event** are proposals only. Today's Job is the game's daily heist; it is not an event unless Yelnur says so.
- **No prices.** The placeholder prices in `public/products.json` are not decided. Write UNDECIDED.

### 5. Round 4, the words

- **Write `bug/words.json`** from `direction/WORDS_TEMPLATE.json`, and put the one-line pitch in `bug/publish.json` as `"line"` (≤ 70 characters).
- **Use only what's true of the build.**
  - Its copy lives in `src/sim/defs.ts`. Use British spelling and the fixed names in DESIGN.md §6.
  - The place strings are what `progress.set` sends (`src/client/game.ts`): the area and level during a run, then `Stole a miracle` or `Souls confiscated — try again`.
  - The controls are keyboard, touch and gamepad, read from the build. `game.json`'s list is v1, so check it against the build.
- **Run length:** the build's first win is about 6–7 minutes, against the original brief's 10–15. `game.json` still says 13, and Yelnur hasn't settled it.
  - Write what the build does.
  - Flag it in your pull request.
- **Stale text** you find in the build (for example "Muffle" in the achievement "Ropes, Smoke and Wax") goes in `NOTES.md`, not into the words as if it were current.

### 6. Hand back

Push the branch, open the pull request, and list:
- what you made;
- what you couldn't make, and why;
- what you found stale in the game.

The design chat reviews it on the real wall and page.
