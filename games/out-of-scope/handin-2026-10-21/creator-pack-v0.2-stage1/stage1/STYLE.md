# OUT OF SCOPE · style sheet (stage 1)

**Status.** Dry run for the bug.games package. Nothing has been published, uploaded or sent for review. This sheet is the look every package asset follows. The board is `out-of-scope-style-sheet.png`.

## Reference frames (captured from the running game)

These are captures for the look only. None of them is a package asset.

| File | What it shows |
|---|---|
| `ref/r-keyart-16x9.png` | Key art: the 16:9 poster made in this chat (agents bursting out of a cracked monitor) |
| `ref/r-title.png` | Title screen: the cracked cream CRT in a dark room, cables, the agents' eyes |
| `ref/r-roll-regent.png` | Cold open roll call: Regent on an acid patch |
| `ref/r-case-poster.png` | Case 01 poster card: "Did he fire himself?" |
| `ref/r-desk-smash.png` | Play: a lie breaks (ink splat, halftone ring, paper shreds) |
| `ref/r-storm.png` | Cold open: the 09:02 approval storm |

Spare frames: `ref/r-keyart-9x16.png`, `ref/r-roll-bcc.png`, `ref/r-board.png`.

## Rules of the look

- **Line**
  - One black marker line, `#15131a`, with round caps and joins.
  - Weight: 5–8 px on a 1600-wide piece, 3–4 px on a 92 px mark.
  - Every line is roughened by a small turbulence displacement. No clean vector edge survives.
  - Inner lines (pinstripes, teeth, ribs) use the same ink at half weight.
- **Fill**
  - Flat, saturated fills laid with a dry-brush hatch.
  - A second copy of the fill sits 3 px down and right under the line, like a careless print.
  - No gradients, except the one light below.
- **Ground and texture**
  - Void black (`#0b0a0e`) with big torn-paper patches with ragged edges: acid low left, hot pink high right, cobalt low right.
  - A few white specks.
  - Hard offset shadows only: 8–14 px, black at 45–60 %. Never blur.
- **Light**
  - Flat comic light.
  - The world has one light source: the acid glow through the cracked monitor glass, going acid → toxic green → black.
  - Screens and LEDs glow inside their own frame only.
  - No fog and no bloom.
- **Lettering**
  - The title is set in Tabloid (TeX Gyre Heros Condensed Bold), caps and tight. "OUT OF" is white; "SCOPE" is acid with a cobalt then black offset. A dashed selection frame with a red cursor sits around it.
  - Speech is Bonum Bold Italic on white paper boxes. Tags are in mono.
  - Lettering appears only on the title lockup, the share card and the cover.
  - Never on a poster, still, seal, store tile or pass tile. Scrawled words baked into characters are switched off for package art.
- **Cast and objects**
  - The agents: Regent (an empty suit with a paper hat carrying an OK stamp), Kickback (shark), Halo (pill), Deadline (bomb), Bcc (many-eyed ghost), Floss (tooth), the Principal (monolith).
  - The humans: Gordon and Priya.
  - Objects: the cream CRT, forged slips with a colour bar, envelopes, rubber stamps, the phone badge.
- **Small-mark hero.** The monitor wearing Regent's hat, grinning. It reads as "something got out of the computer" at 46 px.
- **Composition.** The cracked monitor sits at the centre, with the hero climbing out of it and the gang around. The focal point is (0.50, 0.45). The bottom of every plate is a plain black floor.

## Palette

Readings come from `tools/measure.py colour` and show ΔE2000 to ember, lilac and sun.

| Hex | Name | Role | Reading |
|---|---|---|---|
| `#0b0a0e` | Void | ground | ember 54.3 · lilac 68.6 · sun 80.6 · free |
| `#15131a` | Ink | the line | ember 53.4 · lilac 66.5 · sun 80.7 · free |
| `#e6ff2e` | Acid | the game's ink: glow, eyes, title | ember 60.7 · lilac 67.2 · sun 21.1 · free (1.1 from caution) |
| `#ff2e88` | Hot pink | patch, Halo | ember 25.7 · lilac 32.9 · sun 57.7 · free |
| `#1f4bff` | Cobalt | patch, title shadow | ember 51.4 · lilac 34.8 · sun 74.5 · free |
| `#fffbea` | Paper | slips, hat, speech | ember 40.3 · lilac 34.7 · sun 23.1 · free |
| `#f3eee4` | Cream plastic | monitor, pot | ember 37.3 · lilac 29.9 · sun 23.6 · free |
| `#39e07a` | Toxic | glow fringe, fern | ember 72.4 · lilac 47.4 · sun 36.2 · free |
| `#222b72` | Ghost navy | Bcc | ember 54.7 · lilac 56.1 · sun 82.4 · free |
| `#1f1d27` | Suit | Regent | ember 51.7 · lilac 63.9 · sun 79.5 · free |
| `#8ff0cf` | Mint | Floss | ember 62.2 · lilac 37.6 · sun 35.2 · free |
| `#d4141c` | Blood | the only red: stamps, OK mark | ember 15.8 · **caution** |
| `#ff8a1f` | Fuse | Deadline | ember 17.2 · sun 20.7 · **caution** |
| `#7189a6` | Shark | Kickback | lilac 19.9 · **caution** |

**Taken out of package art**

| Hex | Was | Reading | Replaced by |
|---|---|---|---|
| `#ffc400` | Gold (coins, Regent's buttons, Halo's ring) | sun 5.1 · **GUARDED** | acid |
| `#ff2a1a` | Deadline's LED digits | ember 6.2 · **GUARDED** | blood bars, no digits |
| `#c86a3c` | Terracotta, the first pot colour | ember 10.9 · **GUARDED** | cream pot with a cobalt band |
| `#d8cfb3` | Beige monitor plastic | sun 18.1 · caution | cream `#f3eee4` |
| `#f4ff9a` | Glow highlight | sun 19.0 · caution | acid |

**Colour rules**

- No guarded colour appears anywhere in package art. The script `tools/hexes.py` lists every colour used in a slot, and each list was measured.
- Caution colours stay inside characters and small objects only. They are never a flat block, never in small marks, and never within 120 px of Play, a price or a selected state.
- On the poster, the outer right 10 % (the side next to the hero's info rail) carries no caution colour.
- The `game.json` accent proposed is `#e6ff2e` (free).
- The poster's dominant inks are void, acid, hot pink and cobalt; the characters carry their own colours.

## Never

- Crowns, or anything gold.
- Ember, lilac or sun (or ember-red `#ff2a1a`) as a flat block.
- Blur, bloom, fog, soft 3D or rounded plates. Platform corners are sharp.
- Gradients other than the monitor glow.
- Numbers, prices or dates in stills, seals, store or pass art.
- Scrawled words or titles on anything that can shrink below about 200 px.
- Gore or real swearing (grawlix only).
- Real brands, logos or people.
- Another game's characters, art, names or text.

## How the art is made

Every asset is a new composition, drawn with the game's own drawing code:

- `OL` gives a fill plus its offset copy plus the marker outline.
- `ST` gives a marker stroke.
- The `rough` and `rough2` displacement filters give the jittered edges.
- The character functions draw the cast: `suitB`, `sharkB`, `haloD`, `ghostB`, `bombB`, `flossB` and `principalD`.

Pieces are rendered in Chromium at 1.5–4× and downsampled. Small marks are separate SVGs drawn for their display size.
