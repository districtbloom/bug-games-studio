# perlune-studio

The bug.games side of **Perlune**: the art and platform work done for bug.games in the chat that made the game. The game itself (source, build, tests, video tooling) and the main documents are in the game repository: read its `HANDOFF.md`, `DESIGN.md` and `docs/PROMPTS.md` first.

There was no existing "studio clone" when the game left the chat. Perlune was never created on the bug.games account, so there was no studio workspace to clone. This repository was assembled on 21 Oct 2026 from the files that work left behind, so that nothing is lost.

## What is here

```
design-pass-B/
  package/            what was handed back to bug.games on 20 Oct 2026 as perlune-design-pass.zip:
                      every picture under the pack's exact names, NOTES.md (style note, plan, one entry per
                      picture, checks, open questions), design.json (proposed moments, store, pass, update,
                      event), publish.json (poster focus), checks/ (check boards), make/ (the scripts and
                      views that made every picture)
  process/            BRIEF.md given to the seven agents, their notes, the shared tools (render.js, guard.py…),
                      their scripts, and the superseded update pictures
creator-pack-dry-run/ stage 1 of the bug.games creator pack v0.2 dry run (19 Oct 2026):
  stage1/             poster, icon-46 and "Glass halo" store pilots, docs/STYLE.md, docs/style-sheet.png
  board/              the style-sheet page (style.html), its reference frames and check images
                      This run stopped after stage 1, waiting for answers that never came, and was replaced
                      by design pass B. It is unfinished on purpose; keep it for the record.
packs/                the two bug.games packs as received (creator pack v0.2, design pass B) and the
                      bloomplay SDK reference saved from the bug.games MCP connector (sdk_docs)
```

## Status (21 Oct 2026)

- Design pass B: handed back, waiting for bug.games' review notes. Its open items are at the end of `design-pass-B/package/NOTES.md`.
- Nothing in this repository is declared to bug.games:
  - no prices;
  - no products or pass in any `game.json` (there is no `game.json`);
  - nothing uploaded or published.
- The pictures are rendered by the game's own renderer (or drawn with its material maths). To re-render them you need the game repository at the path the scripts expect (`/home/claude/sivver/dist/perlune.local.html`), or edit that path in `make/tools/render.js`.

## Not committed (too large, superseded)

These stayed on the old machine:
- the exploration renders behind design pass B: about 89 MB in `/home/claude/passB/scratch/`, mostly the dozens of rejected poster compositions;
- the agents' work images: about 627 MB in `/home/claude/passB/work/`.

Only their scripts and views are here (`design-pass-B/process/work/`), plus `share-card-art.png`, which the lockup script needs. The rejected poster ideas and why they failed are written up in the game repository's `DESIGN.md` §4.6.
