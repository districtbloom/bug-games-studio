# Answers to the first game's questions

_These are the platform's answers to **Dot Doesn't Nap**, the first game through this handoff (a dry run, 19 Oct 2026). Dot's AI asked 24 numbered questions; the answers below are numbered to match them. They are here so your AI can see how the platform answers: where the founder had decided nothing, the answer is UNDECIDED with the upload kit's question number, and the package was built anyway. Read them as precedent, not as rules about your game._

**What changed for your round** (`START_HERE.md` wins where they differ):
- Answer 10 said the living poster is "tier 2 and not needed". This round asks for **both versions** (A: code module, B: parts kit).
- Answers 16–17 said "no event" and "draft no update card". This round asks for an **event banner**, **update close-ups** and a **Featured still**, all marked as proposals.
- Answer 8's slot list grew: see `manifest.template.json` and `manifest.schema.json` (wide, profile banner, backdrops, chip 64, title lockup, poster 9:16, cover-clean, seals in three states, voice sheet).
- The package is now returned as one zip, `<slug>-package-v<N>.zip`.

---

# 03 · bug.games → Dot Doesn't Nap: answers and materials

From: the platform (dry-run test) · 19 Oct 2026

Thanks: the questions are good, and several are real gaps in our handoff. Ground rule for this test: where the founder hasn't decided something (the upload kit's open questions), I don't decide it either. You build the package anyway and mark those fields `"UNDECIDED"` with the question number, so we see exactly what the package would need. Nothing is uploaded or sent for review.

## Materials (now in this pack)
- `tools/measure.py`: the real art checks. `python3 measure.py colour <hex…>` and `python3 measure.py light <image>` (run it from a folder that has it; it imports nothing but Pillow).
- `page-contract/`: the shared game page contract: `build.py` (REQUIRED_DATA, REQUIRED_HOOKS, OPTIONAL_HOOKS), `nightswim/` (`game.json`, `data.js`, `hooks.js`, one roster game's real page data), plus `GAMEPAGE.md` and `CREATOR_KIT.md`.
- `sample-nightswim/`: Night Swim's art as the canvas uses it (icon `i-`, emblem `e-`, poster crops `-p` 2:3, `-w` wide, `-h` hero, `-b` banner, seals `s-…-0..7`, pass rewards `pt-`, store items `t-`, update `u-`, and the `ns-*` page renders). It's the closest thing to a sample package; it was never labelled as one.
- Finding for us: none of these were reachable from the handoff. This pack is their portable home.

## Answers

**1–2 · Store items and prices: UNDECIDED (kit Q1, Q2).** For this test, draft the store anyway so the surface can be tested: up to 6 looks from Dot's world (your candidates are right), each with `id`, `name`, `description`, `kind`, art at 400×400, and `"price": "UNDECIDED (Q1)"`. The SDK's numbers are examples in its comments, not a price guide. Don't declare them in `game.json`; put them in the package's `store.draft.json`.

**3 · Cover.** The SDK and the Publish screen agree on 16:9, and your live 1280×720 cover is 16:9, so keep it as `cover`. Whether lettering is allowed is UNDECIDED (Q3); add your clean no-text 1920×1080 too, as `cover-clean`.

**4 · Pass: UNDECIDED (Q4, Q5).** Your arithmetic (~30 steps × ~20 min ≈ 10 h ≈ 60 runs) is a real finding for short games. Draft one anyway in `pass.draft.json` with the SDK's shape: `name`, steps (as many as you think fits Dot, with the count marked UNDECIDED), free and pass rewards from Dot's world, `memberReward` candidate. `price` and `days`: UNDECIDED. Reward art at 306×243.

**5 · memberGift: UNDECIDED (Q10).** Propose one in the draft only.

**6 · Tags.** The SDK allows up to 5; the Publish screen draws 4. Use 4 so both hold. Who else adds tags is UNDECIDED (Q8).

**7 · Mood stays `playful`.** Vibes have no field (Q9): propose them in the manifest only.

**8 · Delivery: your default is accepted for the test.** a package folder with one file per slot and a `manifest.json` mapping slot → file → pixel size. Slot names = the creator kit's asset names (`poster`, `poster-2x3`, `poster-1x1`, `icon-46`, `emblem-30`, `key-still`, `result-still`, `seal-<moment>`, `pass-reward-<step>`, `store-<id>`, `marker-next`, `marker-held`, `share-card`, `cover`, `cover-clean`). The sizes in the kit are the master sizes, already at 2× (icon 92×92 is shown at 46). PNG, or SVG for marks; JPG is fine for stills. The workspace path is UNDECIDED: Studio upload slots are designed, not built.

**9 · Words.** Put them under `words` in `manifest.json`. The place string and `progress.set` are the same thing (both label the Continue card). Your two labels over 30 characters fail the creator kit's limit: list them as a proposed fix, don't change code.

**10 · Art style (CORRECTED).** Every asset must be made in the game's ORIGINAL art style: the look of its key art and cover (for Dot: crayon outlines, flat fills with diagonal hatching for light, the night-blue room, the glowing yellow raincoat, hand-lettered title). A plain engine render is only acceptable if it already looks like that; otherwise compose and draw in the style. The game's own chat, which made the look, should make the assets. (Our first answer said "engine renders: yes" without this condition, and the result lost the style.) The icon and emblem must still read at 46 and 30. Whether a still-poster game can be on the For You wall is UNDECIDED.

**11 · Colour (CORRECTED).** You were right. Measured properly, `#f3b42e` is sun ΔE **5.9: GUARDED** (ember 33.0, lilac 52.7). My first reading (57.3, "free") was wrong: I passed the hex without its `#` and the tool silently mis-parsed it (now fixed in `tools/measure.py`). Keep the art and the raincoat; the rule for a guarded colour is: never a button-like flat fill, never within 120 px of Play, a price or a selected state. How the page treats a guarded `accent` is UNDECIDED; flag it. (Finding for us: the tool needs to reject bad input, and the platform answered wrong once.)

**12 · Saves come back: N/A** for a one-run game with no save and no settings. Record it; it's a finding about the Publish check's wording.

**13 · The creator's plan: unknown.** It doesn't matter for a dry run; drafts aren't submitted.

**14 · Content note:** your call is right, none.

**15 · Jam:** none.

**16 · Event counter:** the SDK has no counter call. Gap. No event.

**17 · Updates:** you may call `list_versions` (read-only) to see what's live. Draft no update card.

**18 · Creator subscription perk:** none.

**19 · Social:** draft the result line, the verb, stat nouns, two friend lines and two quick-chat lines in Dot's voice. No board, no ghosts.

**20 · Browser and load checks:** stay unknown in a dry run. Record the bytes. A size budget is UNDECIDED (Q16).

**21 · Page:** the platform side is rendering your page from the package right now; that's the test.

**22 · Concept:** work without it; finding.

**23 · Source of truth:** the workspace. Fonts are only needed in the build, not the package.

**24 · Crumbs as rewards:** none (Q6).

## Please also
- Seals: one per moment (5), each with `name`, `rule` and `kind` (feat / collection / event), at 96×96 masters, three states (earned, progress, locked) if you can render them.
- Key still 720×352 and result still 1600×352 (subject in the middle 720×352): no text, no numbers.
- Share card 1200×630 (title lettering allowed here).
- Run `measure.py light` on your poster and `colour` on your palette, and put the readings in the manifest.
- Keep everything Dot's: no other game's art, no platform colours as flat fills near where buttons will sit.
