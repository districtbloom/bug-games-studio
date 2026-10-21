# bug.games design pass: every picture and every word your game's page needs

You are the chat that made this game. bug.games is a web games platform, and your game is going on it. This pass makes the full set of pictures the platform shows (the For You poster, the page, the small marks, the seals, and the store and pass art) and writes every word the game page prints in the game's voice: the one line under the title, About, the controls, the details, the seals' names and rules, the gallery captions and the small lines around play. Everything is made fresh, in your game's own style, world and voice.

Read this file, then `DIRECTION.md` (both in `direction/`), which covers every picture and every set of words, one by one.

## The rules for this pass

1. **Start from scratch.** Don't reuse, crop, trace or repaint any picture made before this pass. That includes the cover, earlier posters, icons, pilots, store art, and anything made under earlier bug.games instructions. Those were made under a different direction, and they're out. Every picture here is new.
2. **Your game's own style and world.** Render from the game itself wherever you can: its renderer, sprites, drawing code, characters and light. Where you can't render, draw it with the game's own code and palette. If you make a picture any other way, say so in `NOTES.md`.
3. **Pictures and words only.** Don't change the game's code or `game.json`. Don't add achievements or store items to the game. Don't declare products or a pass, and don't set prices. The words go in `bug/words.json` (start from `WORDS_TEMPLATE.json`), including drafts of what would live in `game.json` (title, hook, description, controls, moments, tags). They move into `game.json` after Yelnur's yes. The tools are in `direction/tools/`: run them as `python3 direction/tools/wall.py …` from the repository root.
4. **No trailer or gameplay video** in this pass.
5. **Never fake it.** If a picture can't be made honestly from your game, say so instead.
6. **bug.games' own colours stay bug.games'.** Ember `#FF5A36` is Play, lilac `#C4B5FF` marks what's selected, sun `#FFCB57` means crumbs and earned, and mint `#7FE3C0` means owned. Your art may use colours near them, but never as a flat button-like block, and never right where those controls sit. `python3 tools/measure.py colour '#RRGGBB'` tells you how close a colour is.
7. **Nothing invented about bug.games.** No prices, rules or features that aren't in this pack. If something isn't covered, ask.

## How to work: all the way through, in one go

Don't stop between steps to ask for an okay. Work through everything, then hand back once. Write every choice you make in `NOTES.md` so it can be reviewed afterwards.

**Step 0 · Take stock (you, the lead).** Look at your game and write 4–6 lines on its own look: the medium, the line, its 2–4 main colours (as hex), where the light comes from, the characters, and what the game is in one sentence. This style note goes at the top of `NOTES.md`. Every picture follows it.

**Step 1 · Plan (you, the lead).** Write into `NOTES.md`:
- one line for each picture marked **PLAN FIRST** in DIRECTION.md;
- for round 2, your proposals by name, look and words, with no prices: 3–6 store items (each with a kind line, plus one line for the store row), a pass name, its step unit, one sentence on it and its rewards, one update (title and the change) and one event (name, what everyone does, the counter's unit).

Write the same proposals to `bug/design.json`.

**Step 2 · The poster first (you, the lead).** Make picture 1, the For You poster with its tall and square versions, and picture 2, its focus point. Check them. Most other pictures take their finish from the poster, so it comes before anything else.

**Step 3 · Fan out.** If you can run agents or parallel tasks, split the rest across them now. For example:
- one agent for the small marks (icon, emblem, chip);
- one for the Continue picture, the result picture and the gallery;
- one for the seals;
- one for round 2 (store, pass, update, event);
- one for round 3 (backdrop, share card, phone poster, title lettering);
- one for round 4, the words. It reads the game's code for the real controls, moments and the place strings `progress.set` sends, and writes only what's true of the build;
- one for the moving poster.

Give every agent this pack, your style note, your plan lines and the finished poster. Each agent saves under `bug/` with the exact file names and adds its own entries to `NOTES.md`.

If you can't fan out, do the same groups yourself, in that order.

**Step 4 · Bring it together (you, the lead).**
- Look at everything side by side. Does it all read as one game, in one style, with one light? Redo anything that drifted.
- Run the checks each picture asks for: the wall shapes, all the seals in one 32 px strip, the small marks on dark and on light.
- Read the words next to the pictures: the same world and voice? Every seal's name matches its picture, every caption its slide, every control the build?
- Then hand back.

## Handing back

1. Push your branch `<slug>/round-<n>` and open a pull request into `main` (see the repository's README).
2. `bug/NOTES.md` holds the style note and the plan, and `bug/words.json` holds the words. Then, for every picture:
   - the file;
   - what it shows, in one line;
   - how it was made: rendered from the game, or drawn in its code;
   - which agent made it;
   - the check result;
   - anything you couldn't make, and why.
3. bug.games reviews the pull request on the real For You wall and game page, and comments on files. Each note names its rule. Fix on the same branch.

## File names (the platform reads these exact names, inside `games/<slug>/`)

```
bug/
  NOTES.md                    style note + one entry per picture
  design.json                 round-2 proposals: names, looks and words, no prices
  words.json                  every word on the page (from WORDS_TEMPLATE.json)
  publish.json                {"focus": {"x": 0.0–1.0, "y": 0.0–1.0}, "line": "one sentence of what you do, ≤ 70 characters"}
  poster.png  poster-2x3.png  poster-1x1.png  poster-9x16.png
  icon-46.png  emblem-30.png  chip-64.png
  key-still.png  result-still.png
  gallery/01.png … 06.png
  seals/<moment>-earned.png  -progress.png  -locked.png    (one set per moment in game.json; <moment> = lower case, hyphens: "Two, please" → two-please)
  store/<item id>.png
  pass/tile.png  pass/ground-free.png  pass/ground-pass.png  pass/ground-bug.png  pass/<reward id>.png
  marker-next.png  marker-held.png
  reward-held.png             or reward/ (a small code module) for the owned mark
  updates/<version>.png
  events/<event id>-banner.png   + seals/<event id>-earned.png … for the event seal
  living-poster/              the moving poster, as a code module
  backdrop.png  backdrop-phone.png
  share-card.png
  title-lockup.png
```
