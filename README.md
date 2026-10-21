# bug.games studio

Where the games' own chats and the bug.games design chat work on each game's pictures and words for bug.games. Every game chat pushes its work here. The design chat reviews it here, file by file, and comments. Nothing here is on the website: publishing still goes through the bug.games connector, and only after Yelnur's yes.

The design chat's notes on what it learns live in the vault (`districtbloom/bug-games-vault`, `programmes/publish-skill/NOTES.md`), not here.

## What's where

```
direction/                  the current direction. Owned by the design chat; read it, don't edit it.
  START_HERE.md             how a pass works, the rules, the order, the file names
  DIRECTION.md              every picture and every set of words, one by one, with must / never / check
  direction.json            the same, for tools
  WORDS_TEMPLATE.json       the shape of bug/words.json
  LIVING_POSTER_CONTRACT.md the moving poster's contract
  tools/                    wall.py and measure.py (Python 3 + Pillow)
  CHANGELOG.md              what changed in the direction, newest first
games/<slug>/
  bug/                      the game's pictures and words: the files bug.games reads (names in START_HERE.md)
  ROUND.md                  where the game is, and what's asked in the current round
  reviews/round-<n>/        the design chat's verdicts: REVIEW.md, review.json, and the review sheets
START-MESSAGE.md            the message a game chat is given to begin
SETUP.md                    how accounts, repositories and sessions are set up so every chat pushes by itself
```

## How a round works

1. **Pull.** Read `direction/START_HERE.md`, `direction/CHANGELOG.md` and your `games/<slug>/ROUND.md`.
2. **Branch.** Work on a branch named `<slug>/round-<n>`, for example `pardon-the-apocalypse/round-2`.
3. **Make.** Make what ROUND.md asks, in your game's own style, from the game itself. Save into `games/<slug>/bug/` with the exact file names. Add one line per change to `bug/NOTES.md`.
4. **Push and open a pull request** into `main`, titled `<Game>: round <n>`. In the description, list what you made or changed and anything you couldn't do and why.
5. **Review.** The design chat reviews the pull request:
   - it comments on files;
   - it commits `games/<slug>/reviews/round-<n>/review.json` and `REVIEW.md` on your branch;
   - each note names its rule.
6. **Fix** on the same branch and push again. Reply to each comment with what you did.
7. **Merge.** When every slot is approved, the design chat merges. `main` always holds each game's latest approved set.

**If your push is refused** (a 403: your session has no access to this repository), don't retry. Instead:
1. Make a git bundle of your branch: `git bundle create <slug>-round-<n>.bundle main..<slug>/round-<n>`.
2. Give the file to Yelnur.

The design chat pushes the branch from the bundle, with your commits unchanged, and opens the pull request for you. Next time, start your session with `districtbloom/bug-games-studio` among its repositories.

If you can push but can't open a pull request, push the branch and say so. The design chat opens it.

## Rules

1. **Your own folder only.** Touch `games/<your-slug>/` and nothing else. Never another game's folder, and never `direction/`. If the direction looks wrong, say so in your pull request.
2. **No secrets.** No tokens, keys, logins, cookies or player data in any file or commit.
3. **Your game's own style and world.** Make every picture from the game itself, and write every word in its voice. Never reuse pictures made before your first pass, or anything from another game.
4. **Never fake it, and never invent.** If something can't be made honestly, say so. No prices, dates, numbers or rules that aren't decided: write UNDECIDED.
5. **Nothing goes live from here.**
   - Don't change the game's code or `game.json` for this work.
   - Don't declare products or a pass.
   - Don't publish.
   - Yelnur decides what goes on the site.
6. **Commit as yourself.** Start the message with the game's slug (`perlune: fix the result still`). Sign it with the account you run in if you know it (`account C`).
7. **Big files.** Every file must be under 50 MB. Use PNG for marks, seals and anything with transparency. Use high-quality JPEG for big photographic pictures, if the PNG is over 4 MB.
