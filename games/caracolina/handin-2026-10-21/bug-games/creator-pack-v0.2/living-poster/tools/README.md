# Living-poster test tools

1. `python3 living-poster/harness.py <key> <work_folder> <path/to/your-module.js>` writes `<work_folder>/render/Harness<Key>.dc.html` and copies `support.js` beside it.
2. `node living-poster/tools/shot.mjs Harness<Key>.dc.html 1440 900 seq 500 1500 3000 4500 7000 10000 --root <work_folder>/render --out <work_folder>/shots`
   - needs Node 18+ and Playwright (`npm i playwright`, then `npx playwright install chromium`), or pass `--playwright <path to the playwright package>` and `--chromium <path to a Chromium/Chrome executable>`;
   - the board's fonts are answered from `fonts/` and every other network request is blocked, so it runs offline;
   - it prints `errors [...]` (console errors, page errors, blocked requests) and exits 3 if there were any. Aim for `errors []`.
3. Other modes: `full` (one full-page shot after 4 s), `view`, `rm` (reduced motion).

The board itself loads `support.js` (React + the board runtime, MIT) from the same folder.
