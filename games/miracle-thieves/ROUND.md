# Miracle Thieves

## Where it is

- **New to the studio, 21 Oct.** No pictures or words here yet. This is round 1: the whole design pass.
- **The game:** `districtbloom/miracle-thieves`, `main` (v2, tests green). Nothing on bug.games yet.
- **Its old store art is out:** `public/cover.png` and `shot-1..4.png` are from the 1 Oct art pass and show the v1 game. Don't reuse, crop or repaint them (START_HERE rule 1).

## Round 1: what's asked now

Work on the branch `miracle-thieves/round-1` and open a pull request titled `Miracle Thieves: round 1`. The pass covers all four rounds of `direction/DIRECTION.md`: pictures 1–22 and words 23–31. This round runs in a different order from START_HERE's.

### 0. The order of work (founder, 21 Oct)

- **Design comes before art.** These are game design first:
  - the store items and the main paid featured item;
  - the achievements;
  - the pass and the event;
  - a planned update.

  Each one should come from how Miracle Thieves plays, not exist because a picture slot needs filling. Design them first (section 4). Their pictures come only after the design is agreed.
- **Hand the design in first.**
  1. Commit `PROPOSALS.md` and `bug/design.json` as the branch's first work.
  2. Open the pull request as a draft.
  3. Say in your reply that the design is up.

  Yelnur decides it, through the design chat, which answers on the pull request. Store items and achievements are rules, and a rule changes only on his yes.
- **Meanwhile, make everything that doesn't depend on that design.** Don't wait for the answer. These come now:
  - the For You poster, with its 2:3, 1:1 and 9:16 versions, and its focus point (1, 2, 21);
  - the icon, the emblem and the chip (3, 4, 20);
  - the Continue picture, the result picture and the gallery (5, 6, 7);
  - the seals for the game's seven existing moments (8, section 3);
  - the moving poster, the backdrops, the share card and the title lettering (17, 18, 19, 22);
  - the words for everything above (section 5).
- **These wait for the yes:**
  - the store pictures (9);
  - the pass tile, row grounds, marker and rewards, and the owned mark (10–14);
  - the update picture (15);
  - the event banner and seal (16);
  - the seals and words for any new moment you propose;
  - the words for the store, the pass, the update and the event.

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

### 3. Seals: the seven moments the build sends now

These come from `ACH` in `src/client/save.ts`, the entries that carry a `moment`, and they match `game.json`. Make them now.

| Moment | File stem |
|---|---|
| Into the Cloister | `into-the-cloister` |
| The Custodian Wakes | `the-custodian-wakes` |
| A Miracle Stolen | `a-miracle-stolen` |
| Nobody Left Behind | `nobody-left-behind` |
| All Seals Broken | `all-seals-broken` |
| Public Nuisance | `public-nuisance` |
| Least Favourite Thieves | `least-favourite-thieves` |

- Each moment gets `-earned`, `-progress` and `-locked`.
- Check them in one 32 px strip, the not-yet state included.
- If your achievement design (section 4) changes a moment or adds one, its seal waits for the yes.

### 4. Design first: what to sell, what to earn, what comes next

Write it in `games/miracle-thieves/PROPOSALS.md`, so Yelnur can read it, and in `bug/design.json`, so the tools can.

**Every proposal says:**
- what it is;
- how it fits how the game plays (DESIGN.md, the code);
- what a player sees and does with it.

Nothing goes into the game's code or `game.json`. No prices: write UNDECIDED.

**What to design:**
- **Store items.**
  - Start from the game's two real products: `starter_pack` (Thieves' Starter Pack, cosmetic) and `miracle_relight` (Miracle Relight, the once-per-run revive).
  - Propose 3–6 items in all, each with a kind line, plus one line for the store row.
  - Keep the game's own commerce rules (DESIGN.md §3.12 and §7): nothing sells power, at most one paid recovery per player per run, no paid offer before the free rescue or after a teammate's knockout, and cosmetics never change hitboxes, magic colours or telegraphs.
- **The main paid featured item.** The one item the store leads with:
  - which one it is, and why it's the one;
  - where a player meets it in the game.
- **Achievements.**
  - Look at the 20 in `ACH` against how the game plays.
  - Propose what to keep, change or add, so they reward what the game is about: duets, rescues, the getaway, notoriety, Today's Job.
  - Mark which ones carry a moment, and so get a seal.
  - Names and lines go in the game's voice, within its limits.
- **The pass.** Its name, its step unit, one sentence on it, and its rewards, drawn from the game's cosmetics.
- **The event.** Its name, what everyone does, and the counter's unit. Today's Job is the game's daily heist; it isn't the event unless Yelnur says so.
- **The planned update: what could be improved in the game.**
  - Draw on HANDOFF.md ("What I would do next", the known bugs and stale text, the draw-call budget, the balance notes) and DESIGN.md §10 (open questions).
  - Give it a title, what changes, and why a player would care.
  - It's a plan only. Nothing in the game changes in this round.

### 5. Round 4, the words

- **Write `bug/words.json`** from `direction/WORDS_TEMPLATE.json`, and put the one-line pitch in `bug/publish.json` as `"line"` (≤ 70 characters).
- **Now:** the pitch, the title and line, About, the controls, the details and tags, the gallery captions, the place strings, the voice, and the names and rules of the seven existing seals.
- **After the yes:** the words for the store, the pass, the update, the event and any new seal.
- **Use only what's true of the build.**
  - Its copy lives in `src/sim/defs.ts`. Use British spelling and the fixed names in DESIGN.md §6.
  - The place strings are what `progress.set` sends (`src/client/game.ts`): the area and level during a run, then `Stole a miracle` or `Souls confiscated — try again`.
  - The controls are keyboard, touch and gamepad, read from the build. `game.json`'s list is v1, so check it against the build.
- **Run length:** the build's first win is about 6–7 minutes, against the original brief's 10–15. `game.json` still says 13, and Yelnur hasn't settled it.
  - Write what the build does.
  - Flag it in your pull request.
- **Stale text** you find in the build (for example "Muffle" in the achievement "Ropes, Smoke and Wax") goes in `NOTES.md`, not into the words as if it were current.

### 6. Hand back

1. **The design, first:** the draft pull request with `PROPOSALS.md` and `bug/design.json`.
2. **The art that doesn't wait:** push it to the same branch as it's done. When it's all in, say so, and list what you made, what you couldn't make and why, and what you found stale in the game.
3. **After the yes:** make the pictures and words for the agreed design on the same branch, then mark the pull request ready.

The design chat reviews it on the real wall and page.
