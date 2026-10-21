# START HERE · bug.games creator pack v0.2

**Paste this file's text into your game's chat (Claude or ChatGPT) and attach this whole zip.** Everything your AI needs is inside the zip; it does not need to open any link.

---

You're picking up work on **bug.games**, a curated indie web-games platform where creators make games with their own AI and bug.games acts as "a game studio inside your chat". Your job in this chat: make the **upload package** for this game, so the platform can show it on every surface as itself. This is a **dry run**: nothing is published, uploaded or sent for review.

## 1. Read, in this order

1. `START_HERE.md` (this file) to the end.
2. `UPLOAD_KIT.md`: everything a game needs to go live, every surface it appears on, and **19 open questions** (the last section) that the founder has not decided yet.
3. The SDK: if your chat has the **bug.games connector**, read the real contract with its `sdk_docs` tool. If not, read `SDK_NOTES.md` (the `game.json`, store and pass part, verbatim).
4. `ANSWERS_FIRST_GAME.md`: how the platform answered the first game that went through this. Precedent, not rules about your game.
5. `page-contract/CREATOR_KIT.md` (art tiers, sizes, fallbacks, the self-check) and `page-contract/GAMEPAGE.md` (the shared game page and which asset feeds which part of it).
6. `manifest.template.json` and `manifest.schema.json`: the package format.
7. `living-poster/CONTRACT.md` (version A) and `living-poster/PARTS.md` (version B).
8. `sample-nightswim/`: one roster game's finished art, for sizes and finish only. **Never copy it.**

Then read your own game: its code, `game.json`, art, and what it does in play. If you can run it, play it.

## 2. Hard rules

- **Never invent prices, rules, catalogue games or facts.** If the SDK, the upload kit or `ANSWERS_FIRST_GAME.md` doesn't say it, it is open: write `"UNDECIDED (Qn)"` with the upload kit's question number (`Q1`–`Q19`), or list it in `QUESTIONS.md` and ask. Every price is `"UNDECIDED (Q1)"`. A pass's `price` and `days` are `"UNDECIDED (Q4)"`.
- **Dry run.** No publishing (`publish_live` is off limits), no uploads, and **no `products`, `pass` or `memberGift` in `game.json`**: drafts go in `store.draft.json` and `pass.draft.json`.
- **Currency is crumbs.** € appears only on crumb bundles, subscriptions and payouts, never in your package. No percentages and no creator share anywhere.
- **Your game's original art style, always.** Make every asset new, in the exact style of the game's key art and cover: its line, fills, textures, palette, lighting and lettering. A plain engine screenshot that doesn't already look like that is not acceptable; compose and draw each piece in the style. Never another game's art, never a named game's characters, names or text.
- **Platform colours.** bug.games draws on black, with sharp corners; ember (orange) belongs to Play and Join only, lilac means selected, sun means crumbs. Measure your palette (section 4); a guarded colour is never a button-like flat fill and never within 120 px of Play, a price or a selected state.
- **Words.** Plain and short. Never "teardown", "Fair Play", streak or scarcity words ("only N left", "last chance"), or superlatives about the game.
- **Never read or print credentials.**

## 3. Make all of this, new, made to fit the platform

Sizes are **master sizes, already at 2×** the display size. PNG, or SVG for marks; JPG is fine for stills. Slot names are the template's. Compose each one for its slot; never a shrunk or stretched copy of another.

**Posters and places**
- `poster` 2:1, at least 1600×800: the For You plate and the hero. Reads at 90×70. Bottom 26 px plain (the caption strip sits there). No lettering if it can shrink below ~200 px.
- Composed crops, each re-framed (not just cut): `poster-2x3` 460×690, `poster-1x1` 800×800, `poster-9x16` 472×840, `wide` 660×308.
- `profile-banner` 1280×340 (a player can put your game on their profile).
- `backdrop-desktop` 1440×577 and `backdrop-phone` 390×826: behind the hero on your game page. No text; end on a hard edge or floor.

**Live surfaces** (mark them `"proposal": true`: there is no live event or update in a dry run)
- `event-banner-<id>` 1720×600, the left 45 % kept plain for the platform's copy. Its words (name, one line, shared goal) go in `HANDOFF_NOTE.md`; dates `UNDECIDED`.
- `featured` (pick of the week) still, about 2.9:1 and at least 1268×440, plus a **motion note** in its `note`: what moves, for how long, and the held frame.
- `update-closeup-<id>` 308×154 (2:1) for each change you can show (existing or proposed; say which).

**Small marks, drawn for their size** (draw them from a clean render; never your poster shrunk)
- `icon-46` 92×92 · `emblem-30` 60×60 (fewer parts than the icon) · `chip-64` 128×128.
- `title-lockup`: your title's lettering for fixed-size pieces, with its minimum width (`min_width_px`).

**Stills and cards**
- `key-still` 720×352 (the world as the player left it; no numbers) · `result-still` 1600×352 (subject in the middle 720×352; no text, no numbers).
- `share-card` 1200×630 (title lettering allowed here).
- `cover` 16:9 (keep your live cover if you have one) and `cover-clean` 1920×1080 with **no text** (whether lettering is allowed is Q3).

**Achievements**
- A seal for **every moment** in `game.json` `moments`: `seal-<moment>` 96×96 in **three states** (`earned`, `progress`, `locked`), each with `kind` (feat / collection / event: one outline per kind) and a one-line `rule`.

**Store and pass** (drafts only)
- Up to **6 looks** in `store.draft.json`, each `id`, `name`, `description`, `kind` (`consumable` / `durable`), `"price": "UNDECIDED (Q1)"`, art `store-<id>` 400×400 that still reads at 40 px. Looks only: nothing that helps anyone win, never your game's identity core. A **revive or unlock only if your game's design already has that moment**.
- One **PROPOSAL featured or limited item** (`"proposal": true`, `"featured": true` and/or `"limited": "Back in <when>"`): a limited item **must say when it returns**.
- A drafted pass in `pass.draft.json` in the SDK's shape (`id`, `name`, `steps` with `free` / `pass` rewards from your world, one `memberReward` candidate, `"price": "UNDECIDED (Q4)"`, `"days": "UNDECIDED (Q4)"`, the step count marked UNDECIDED), reward art `pass-reward-<step>` 306×243, and a marker in two poses, `marker-next` and `marker-held`, ≤48×48. Do the arithmetic for your game's length (~30 steps, ~20 min a step) and say what it means. You may propose a `memberGift` (Q10) in the draft.

**The living poster, both versions**
- **A · code module** to `living-poster/CONTRACT.md`: one file `living-poster/<slug>.js` that only does `BUG_MODS.<key> = {…}`. Test it with the harness (section 4) and look at every frame.
- **B · parts kit** to `living-poster/PARTS.md`: `living-poster-parts/parts.json` with layers, key poses (with alpha), one throwable and a 4–8 s gameplay clip.

**Words and voice**
- In `manifest.json` under `words`: title (≤40), hook, place strings (≤30 each: the same text your code sends with `progress.set`; list any longer ones as proposed fixes, don't change code), one verb, stat nouns, lead, 3 chips, goal, tips, playing word, hover hint, own word, result lines, two friend lines, two quick-chat lines, pause line.
- A **voice sheet** (`voice-sheet`, e.g. `voice.md`): the verb, rants and hits (tiny, grawlix only), yes/no lines.
- Under `proposed`: 4 tags in your own words, 1–3 vibes (Chaos, Cozy, Quick, Weird, Spooky, Together, Story), any place-string fixes.

## 4. Check it yourself

- **Measure** with `tools/measure.py` (Python + Pillow): `python3 tools/measure.py light art/poster.png` and `python3 tools/measure.py colour '#RRGGBB' …` for every palette hex, **always with the `#`**. Paste the printed lines into `manifest.measure` (`light` by file, `colour` by `#hex`).
- **Living poster A**: `python3 living-poster/harness.py <key> <work_folder> living-poster/<slug>.js`, then `node living-poster/tools/shot.mjs Harness<Key>.dc.html 1440 900 seq 500 1500 3000 4500 7000 10000 --root <work_folder>/render --out <work_folder>/shots` (Node + Playwright; see `living-poster/tools/README.md`). Look at every frame; zero console errors.
- **The self-check**: `python3 selfcheck/validate.py <your package folder>` (Python 3.10+ and Pillow only). It is the same validator the platform runs on your package. Fix every `fail` that is yours; leave `UNDECIDED` ones marked; read the warnings.
- Run `page-contract/CREATOR_KIT.md`'s self-check by eye: the squint test at 90×70, the 32 px seal strip, the small marks at 1× on black and on linen.

## 5. Hand it back

Return **one zip** named **`<slug>-package-v<N>.zip`** (`<slug>` = your title lowercased, apostrophes dropped, everything else that is not a letter or digit turned into `-`; `N` starts at 1 and goes up with every resend). At its root:

```
manifest.json        slot -> file -> size, words, proposed, measure, undecided   (manifest.template.json / manifest.schema.json)
store.draft.json     {"items": [ … up to 6 looks + the proposal item … ]}   every price "UNDECIDED (Q1)"
pass.draft.json      {"id", "name", "price": "UNDECIDED (Q4)", "days": "UNDECIDED (Q4)", "steps": [ … ], "memberReward": { … }}
HANDOFF_NOTE.md      what you made, how (renders, drawn, tools), what you could not make and why, the readings, the build's bytes
QUESTIONS.md         numbered questions ("1. …"), each saying what you need, why, your default, and the upload kit's Qn if it hits one
art/ … store/ … pass/ … living-poster/ … living-poster-parts/ …    the files the manifest points to
game/                game.json (no products/pass/memberGift) and the build (index.html + files) if you can include it
```

In your reply in the chat, say in a few lines what is in the zip, what is missing and why, and the self-check's counts. Then stop: the platform answers with a letter (answers, corrections, the boards it built from your package), and you make the next version.
