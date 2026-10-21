# bug.games creator pack v0.1

Everything a game's own AI needs to hand bug.games a complete upload package, with no access to the platform's canvas, docs or machines. **Start with `START_HERE.md`.**

| File / folder | What it is |
|---|---|
| `START_HERE.md` | The prompt: what to read, the rules, every asset to make, how to check it, how to hand it back |
| `UPLOAD_KIT.md` | The Game upload kit (the platform's doc, exported 19 Oct 2026), with its 19 open questions |
| `SDK_NOTES.md` | Where the real SDK is (`sdk_docs` on the bug.games connector) and, verbatim, its `game.json` / products / pass part |
| `ANSWERS_FIRST_GAME.md` | The platform's answers to the first game's questions (precedent; UNDECIDED = an open founder question) |
| `manifest.template.json` · `manifest.schema.json` | The package format (one file per slot, master sizes at 2×) and its JSON Schema |
| `page-contract/` | `CREATOR_KIT.md` (tiers, sizes, fallbacks, self-check), `GAMEPAGE.md` (the shared game page and its asset hooks), `build.py` (reference only: the list of data and hooks a page consumes), `nightswim/` (one roster game's real page data) |
| `living-poster/` | `CONTRACT.md` (version A, a code module), `PARTS.md` (version B, a parts kit), `harness.py` (a test board for a module), `example-modules/nightswim.js`, `tools/` (screenshots: `shot.mjs`, fonts, `support.js`) |
| `tools/measure.py` | `colour '#RRGGBB' …` (ΔE to ember, lilac, sun) and `light <image>` (the light-map band). Python + Pillow |
| `selfcheck/` | `validate.py` + `kit_spec.py`: the platform's own package validator. `python3 selfcheck/validate.py <package_dir>` |
| `sample-nightswim/` | One roster game's art as the platform uses it, for sizes and finish. Never copy its art |

Requirements: Python 3.10+ with Pillow for `measure.py` and the self-check; Node 18+ with Playwright (and a Chromium) only to screenshot the living-poster harness.

The fonts in `living-poster/tools/fonts/` (Bricolage Grotesque, DM Mono, Geist Mono, Instrument Serif, Instrument Sans) are under the SIL Open Font License 1.1 (licence texts beside them). `living-poster/tools/support.js` bundles React (MIT).
