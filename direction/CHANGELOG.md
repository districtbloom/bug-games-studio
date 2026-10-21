# What changed in the direction

Newest first. Every change says where it came from.

## 21 Oct 2026 · the moving poster's seam moment has kinds
- **A module can set `acts: { <item>: kind }`**, where the kind is `toss`, `shoot`, `beam`, `burst` or `grab`. It's drawn in the thrower's ink, the crossed seam lights as before, and the target gets `hit` with the `kind`. Without `acts` it's a toss, as before. (Living board round 2, from the founder's "variety… more lively and chaotic", 20 Oct.)
- **The wall now has a squeeze guard:** when a squeezed plate would push the module's `anchor()` out of view, the wall eases the squeeze. Modules should still keep their subject in view themselves.

## 21 Oct 2026 · the studio opens
- **The direction now lives here** and replaces the zip packs. It's the same text as pack A, with a fourth round for the words.
- **Round 4, the page's words** (founder, 20 Oct 23:21): the one-line pitch, the title and the line under it, About, controls for every input, details and tags, seal names and rules, gallery captions, place strings and the game's voice. They go in `bug/words.json`. Round-2 proposals carry their words in `bug/design.json`.
- **From the founder's look at the live For You (20 Oct 23:13):**
  - **The poster:** it shows what the game is about, meaning who you are and what you're up against, not only a mood.
  - **The moving poster:**
    - squeezed, narrow and wide plates keep the character in view;
    - the seam moment fits the game (toss, shot, beam, burst or grab);
    - the loop shows the premise.
  - **The one-line pitch:** at most 70 characters, in `bug/publish.json` as `"line"`.
- **From round-1 reviews:**
  - lettering on the share card and the title lockup is at least about 12 px tall at 270 px;
  - check the gallery at 100 px beside the central 4:3;
  - the 32 px seal strip includes the not-yet state, and no glyph may read as a letter, Play or a warning sign.
