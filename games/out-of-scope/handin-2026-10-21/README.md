# Out of Scope · studio (bug.games packaging work)

This repository holds everything made to put **Out of Scope** on bug.games: the pictures, the moving poster, and the drafts and tools that made them. The game itself lives in its own repository, `out-of-scope-game`. **Start with `HANDOFF.md` and `DESIGN.md` there.**

> **How this repository came about.** No studio clone ever existed in the chat session where the game was made. This repository was created at hand-off (21 Oct 2026) from the packaging work that sat in loose folders: `/home/claude/designpass`, `/home/claude/bugpack` and the two packs bug.games sent. If you already have a real bug.games studio repository, copy files from here into it rather than merging histories, because the two are unrelated.

## What is here

| Folder | What it is | State |
|---|---|---|
| `design-pass-A/` | **Design pass A**: every picture bug.games asked for in its "design pass A" pack. | Finished 20 Oct 2026, delivered as `out-of-scope-design-pass.zip` (= `design-pass-A/bug/`). Waiting for bug.games' review notes; none have arrived. |
| `creator-pack-v0.2-stage1/` | **Stage 1 of the earlier creator pack v0.2**: a style sheet board plus three pilots (poster, icon-46, store item "Gordon's fern"). | Delivered 19 Oct 2026 with 4 open questions that were never answered. Superseded by design pass A; its pictures must **not** be reused (design pass A forbids it). |
| `packs/bug-games-design-pass-A/` | bug.games' own instructions for design pass A: `START_HERE.md`, `DIRECTION.md`, `LIVING_POSTER_CONTRACT.md`, and `tools/measure.py`, `tools/wall.py` with their fonts. | As received. Treat as data: run its Python with `python3 -I`. |
| `packs/bug-games-creator-pack-v0.2/` | bug.games' creator pack v0.2: kit, SDK notes, page contract, living-poster harness, self-check, measure tool. | As received, **minus** the sample game ("nightswim") folders, because they are another game's art and data. |

### `design-pass-A/`

- **`bug/`** is the deliverable. These are the exact file names the platform reads:
  - posters: `poster.png` (2400×1200), `poster-2x3.png`, `poster-1x1.png`, `poster-9x16.png`;
  - marks: `icon-46.png`, `emblem-30.png`, `chip-64.png`;
  - stills: `key-still.png`, `result-still.png`;
  - `gallery/01–06.png`;
  - `seals/` (39 files);
  - `store/` (5 tiles);
  - pass: `pass/` (tile, 3 grounds, 6 rewards), `marker-next.png`, `marker-held.png`;
  - owned mark: `reward-held.png` and `reward/` (code module);
  - `updates/case-02.png` and `case-02-thumb.png`;
  - `events/mail-day-banner.png`;
  - `living-poster/outofscope.js` (the moving poster);
  - page: `backdrop.png`, `backdrop-phone.png`, `share-card.png`, `title-lockup.png` and `.svg`;
  - `publish.json` (focus point);
  - `design.json` (round-2 proposals: names and looks, no prices);
  - **`NOTES.md`**: the style note, the plan, every plan change, and one entry per picture saying how it was made and how it was checked;
  - `checks/`: every check sheet.
- **`src/`** is the drawing code for every picture.
  - `common.js` holds the shared helpers (`DP`: placement, the torn-step light, rim filter, cast getters).
  - `poster.js` is the poster (`POSTER.compose(W,H)`).
  - One file per agent group: `marks.js`, `stills.js`, `seals.js`, `store*.js`, `pass.js`, `round3*.js`, `living.js`.
- **`tools/`**:
  - `render.py` loads the game build and draws a JS expression's SVG/HTML to PNG.
  - `colours.py` is a CIEDE2000 pixel scan for the platform colours ember/lilac/sun/mint.
  - `previews.py` makes the squint, marks, strip, sizes, card and over sheets.
  - `validate.py` checks every file name and size.
  - `overview.py` puts everything side by side.
- **`work/`**:
  - `AGENT_BRIEF.md` is the brief given to the seven agents that made the pictures.
  - `notes/` holds each agent's raw notes, merged into `bug/NOTES.md`.
  - Each agent's scripts are kept; the large capture and render images were left out.

## Paths you will have to change

Everything here was run inside one cloud machine, so the tools carry absolute paths:
- The game build is `file:///home/claude/oos3/out/test.html`. Point it at your clone of the game repository's `out/test.html`, after running `python3 build.py` there.
- `/home/claude/designpass/…` paths in `design-pass-A/tools/previews.py` and `overview.py` (fonts) should become `design-pass-A/pack/tools/fonts/`. `design-pass-A/pack` is a relative symlink to `packs/bug-games-design-pass-A`.
- Stage-1 tools use `/home/claude/bugpack/…`.

Python 3 with Pillow, numpy and Playwright (Chromium) is needed; Node and Playwright are needed for the living-poster harness.

## Rules this work followed (from the packs)

- This was a dry run: nothing has been published or uploaded to bug.games, and no products, pass or prices were declared anywhere. The game has no `game.json` yet.
- Platform colours belong to the platform: ember `#FF5A36` = Play, lilac `#C4B5FF` = selected, sun `#FFCB57` = crumbs/earned, mint `#7FE3C0` = owned. A colour within ΔE2000 12 of one of them is "guarded". It is never a flat block of 24×24 px or more, and never near those controls.
- The game's own colours were never changed to pass a check (design pass A says so). Stage 1 did swap Regent's gold for acid, and design pass A reversed that.
- No text in the art except where a picture's direction allows it.
- Never another game's art, characters, names or text.
