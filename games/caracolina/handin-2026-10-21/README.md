# Caracolina · studio

The production side of the game Caracolina: everything made for it that is not the game itself. The game, its build, its music and the film pipeline live in the game repository (`caracolina-game.bundle`); start with its `HANDOFF.md` and `DESIGN.md`.

This repository was created on 21 Oct 2026, when the game moved out of the claude.ai chat that made it. No studio clone existed before: Caracolina was never created on bug.games, so there was no Studio workspace to clone. The commits were made on 21 Oct, but each one's author date is the date that work was actually made, so `git log` reads as the real history.

```
poster-16x9/                      the 16:9 poster (28 Sep 2026)
  project/                        its claude.ai Design canvas files (canvas.json, Main.dc.html)
  assets/                         the four images it uses (a 4K sunset render, three prints)
  render/                         the render script and shot specs that made them
bug-games/
  creator-pack-v0.2/              the platform's first pack (docs, measure.py, the living-poster harness, the self-check)
  stage1-creator-pack-v0.2/       stage 1 under that pack: STYLE.md, measurements, the three boards (JPEG), scripts,
                                  and the three pilots (art/, store/; the 2:1 poster pilot is a JPEG copy of a 4.2 MB PNG,
                                  to keep this bundle under the 30 MiB file limit). Superseded by design pass B.
  reference/                      the bug.games SDK cheat sheet as read on 19 Oct 2026 (bloomplay runtime), for a future port
  design-pass-B/                  the current platform work (20 Oct 2026)
    bug/                          the folder as handed back to bug.games: 81 pictures, NOTES.md, design.json, publish.json,
                                  the moving poster (living-poster/caracolina.js), the owned mark (reward/taped-in.js)
    pack/                         the pass's own brief (START_HERE.md, DIRECTION.md, LIVING_POSTER_CONTRACT.md) and tools
    tools/                        render.js (drives the game's renderer), probe.js, guard2.py (platform-colour map)
    AGENT_BRIEF.md                the brief every agent worked from
    work/                         the agents' scripts, shot specs and notes (renders left out)
    lettering-press/              the page that sets the title in the game's own fonts, and its proofs
```

## What is in progress

The title lettering for design pass B. The lettering press set the proofs on 20 Oct, after the pass was handed back (`lettering-press/proofs/`). They are not yet composited into `bug/`, which still needs:

- `title-lockup.png` with its minimum width;
- the title on `share-card.png` (left 40–50 %, which is kept plain for it);
- the pass name on the blank label of `pass/tile.png`.

Then re-zip `bug/` as the next version of `caracolina-design-pass.zip`. The game repository's `HANDOFF.md` has the rest.

## Where things are published (claude.ai, private to the owner)

| What | Link |
|---|---|
| The 16:9 poster (Design canvas) | https://claude.ai/artifact/FDEbSz13sBcaxxaoBKbVqK |
| The lettering press | https://claude.ai/artifact/Ayiu8Y2TddqSWxdJJ2mESU |
| The game itself, the film studios | see the game repository's `HANDOFF.md` |

## Re-running the tools

`bug-games/design-pass-B/tools/render.js` renders a frame with the game's own renderer. It loads the game's studio build at `/home/claude/cara3d/test/studio_local.html`, the path in the old container. Build the game (`python3 build.py` in the game repository writes `test/studio_local.html`) and change that one path. The shot spec format is described in `AGENT_BRIEF.md`.
