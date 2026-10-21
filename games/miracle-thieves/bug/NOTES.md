# Miracle Thieves: design pass notes (round 1)

Account C, 21 October 2026. Branch `miracle-thieves/round-1`. Game: `districtbloom/miracle-thieves` `main` 3df72de (v2).

## Style note (step 0)

- **Medium:** the game's own real-time 3D, three.js toon shading with black outline shells, seen from the build's renderer. Flat cel bands, no shadow maps, no post-processing.
- **Line:** an even black outline on everything. Jewel glass is drawn with dark leading. Architecture is grown and parabolic, with Gaudí-like openings and Earle-like stacked spires.
- **Colours:** warm limestone and court ivory `#efe8da`, night indigo velvet `#2b2459` with dark iron `#2c2838`, and aged brass `#b08a3e`. The game's gold `#e4b53c` is an accent only: it sits 5.8 from bug.games' sun, so it's never a flat block. Ruby `#c8233c` is for danger only.
- **Light:** the cathedral's own. A high, soft sky light, plus one warm key that comes from a source in the world: the vault shaft in the court, door light in the yard, amber pools in the galleries. It turns amber-rose when the Custodian wakes, rose with the alarm, and to dawn in the yard.
- **Characters:** four small, patched, eccentric thieves against the Custodian of Lesser Miracles, a reliquary snail with a cathedral on its back:
  - Pim, with his jam-jar battery;
  - Vesna, with her weathervane;
  - Ottoline, in her bell-hung robe;
  - Scrawl, with his ink and candles.
- **In one sentence:** four broke wizards rob a magnificent, slightly wrong cathedral of the miracles it hoards, and run home at dawn.

**How every picture here was made:** with the v2 build's own renderer, unless its entry says otherwise. The build ran on this PC's GPU (headless Chromium, ANGLE/D3D11, an RTX 5080), served from `dist/` and staged with the game's own debug hooks:
- `debug.mutate` moves the clock, places the thieves and holds the Custodian still;
- `stage.update` takes a fixed camera;
- the DOM HUD is hidden unless an entry says the HUD stays.

Stills are rendered at about 2× and downsampled (Lanczos). Nothing was painted over. The kit is `mtcap.mjs`, kept outside the repository.

## Plan (step 1)

**Order changed by ROUND.md §0.** Design came first: `../PROPOSALS.md` and `design.json`, committed before any art. The store, pass, update and event pictures, and their words, wait for Yelnur's yes.

PLAN FIRST lines:
- **Continue picture (5):** Ottoline holding the Reliquary's gold circle in the indigo galleries, while a ruby, toothed charge warning opens on the floor beside her. This is the world as you left it, mid-heist.
- **Gallery (7)**, in this order (captions go in `words.json`):
  1. **The core loop:** Pim in the Pale Cloister, his bolts and ribbon firing by themselves into a swarm of Pew Mites.
  2. **A second mechanic, reactions:** frost meets flame in a crowd and Steam bursts, with shards and a shove.
  3. **A place:** the Reliquary Galleries, indigo walls, amber pools and lit cases of miracles, with the gold hold circle.
  4. **A character:** the Custodian of Lesser Miracles awake in the court, bells on its back.
  5. **Together:** four thieves, one a ghost, the others coming to the rescue.
  6. **The payoff:** the getaway, running home through the alarm-lit cathedral with miracles over their heads.
- **Seals (8), one glyph each, for the seven moments the build sends:**

| Seal | Glyph |
|---|---|
| Into the Cloister | the broken parabolic service gate |
| The Custodian Wakes | the snail's spiral shell with a spire |
| A Miracle Stolen | cupped hands holding a round light |
| Nobody Left Behind | a hand lifting a small ghost |
| All Seals Broken | a round wax seal cracked in three |
| Public Nuisance | a falling bell |
| Least Favourite Thieves | the Crown of Lesser Miracles, askew |

  Outlines by kind: feat and collection now; the event outline is reserved for the event seal after the yes.
- **Store (9), pass (10–13), owned mark (14), update (15), event (16):** proposals in `design.json`. Their pictures wait for the yes.

## Pictures

### 1. For You poster · `poster.png` (2400×1200), `poster-2x3.png` (1200×1800), `poster-1x1.png` (1500×1500)
- **What it shows:** "Four thieves face the Custodian." Seen from behind in the Processional Court, the four stand small at the foot of the reliquary snail. Its cathedral shell is lit by the vault shaft behind it. Pim glances back at you.
- **Register:** stage. One lit pocket, the vault portal's gold shaft, behind the one shape. Inks: limestone and ivory, indigo, brass and gold, with the portal's ruby jewel as the one hot point.
- **How it was made:** rendered from the build in the court during the boss phase. The Custodian is held facing the thieves between attacks; foes and seal stones are cleared from the frame. The camera is long and low, so the snail towers. The 2:3, 1:1 and 9:16 versions are separate renders, with the thieves closer together and the camera recomposed, not crops.
- **Made by:** the lead.
- **Checks:**
  - `wall.py` in every shape with `--focus 0.5,0.6`: the thieves and the snail's face hold from the strip to the column, and the 90×70 still reads as a giant over four small figures.
  - `measure.py light`: L 0.50, C 0.30, a **light** band. It must never sit beside another light, loud plate.
  - The bottom 26 px are floor only. The bottom-left corner is floor and Pim's ground ring, and no ember, lilac or sun block sits there.
  - The wall preview (`01-home-for-you-wall.png`) wasn't in `direction/reference/`, so `wall.py` only made the shapes sheet.

### 2. Focus point · `publish.json`
- `{"x": 0.5, "y": 0.6}`: between the thieves' heads and the Custodian's face. It holds in the 4:3 crop.

### 21. Phone poster · `poster-9x16.png` (1080×1920)
- **What it shows:** the same image, recomposed for 9:16. The Hoard Orrery and the vault portal rise above the Custodian, and the four thieves stand closer together at its foot.
- **How it was made:** rendered from the build (see 1).
- **Made by:** the lead.
- **Check:** compared beside the 2:1. It's the same one image, in the same register.

### Small marks: how all three were made
- **Rendered from the build.** The title screen's own wizard rigs, rendered on the GPU. The title page ran with `#ui` hidden. The script is `marks-rig.mjs`, kept outside the repository with the kit.
- **Isolation:** every mesh that isn't the chosen rig was hidden. The lights stay, so the toon bands and outline shells are the game's own.
- **Matte:** the same frozen frame was shot on black and on white, and the alpha comes from the difference. Loose scraps were dropped by keeping only the largest piece; that included a few floating ruby dots from the scene and a soft blob shadow under the hat.
- **Posing:** Pim's staff bone is collapsed, so the staff stays out of the face. This is the same scale trick the game's `showHat` uses. In the icon, his hat bone is tipped by about 29° and his head by about 6°, so the crooked hat lies across the square and doesn't tower over it.
- **What was added on top of the render (stated):**
  - a black silhouette outline, about 1 px at 1×, laid under each figure: the game's own outline, thickened for the small size;
  - contrast ×1.1 and saturation ×1.1–1.15.
- **Downsampling:** about 2× the final size with premultiplied Lanczos.
- **The ground is drawn, not rendered.** It's one plain radial pool: night indigo `#2b2459` at the edges, warm limestone `#e6cfa6` in the centre (14 from sun: caution, not guarded). That's the court's one lit pocket. All three marks share it, so they read as one family. On linen, the indigo edge holds the tile.
- **Corners:** square and sharp, no mask, no text.

### 3. Icon · `icon-46.png` (92×92, drawn for 46)
- **What it shows:** Pim's face under his crooked blue pointed hat, with big goggle eyes, his grin and his orange ears, against the lit pocket.
- **The survivors at 46 px:** the crooked navy hat with its orange band, the two white goggle eyes, and the pink nose and grin. The warm accent is the band, the ears and the pompom.
- **How it was made:** rendered from the build (title rig 0, a front three-quarter close-up), then composed as above.
- **Made by:** agent marks.
- **Check (`checks/marks-night-linen-4x.jpg`):**
  - At 1× it sits in a row with Buqu Will Not Bow, Caracolina and Out of Scope, on night (#14121c) and on linen (#f3efe6). It reads as a character's face in a wizard hat on both, and doesn't match any neighbour's shape or ground.
  - At 4× with hard pixels the goggles, nose and grin are clean, and nothing is finer than 1 px.
  - Colour guard at 92 px: ember guarded block 6 px (the orange ear and band), sun 0 px guarded. No flat block of 24 or more.
- **Iterations:**
  - Tried an indigo ground with an amber pool: the skin merged.
  - Tried flat ivory: the tile vanished on linen.
  - Tried the upright hat: the hat took most of the square and the eyes were 3 px.
  - The tipped hat, the lower camera and the limestone pool won.

### 4. Emblem · `emblem-30.png` (60×60, drawn for 30)
- **What it shows:** Pim's hat alone. The crooked navy cone, the pompom, the orange band and the tin spoon tucked in it.
- **Fewer parts than the icon, and not the icon scaled down:** a separate render with the hat in its natural crook.
- **How it was made:** rendered from the build. The `body` bone was scaled to 0.001 and the `hat` bone to 1000, so only the hat stays, at true size. That's the `showHat` scale trick in reverse. The camera aims at the hat bone. Then composed as above.
- **Made by:** agent marks.
- **Check:**
  - At 30 px on night and on linen it reads as a crooked wizard's hat with a pompom, not as a blob, a gem or a letter. The navy holds against the limestone pool.
  - At 4× it's clean.
  - Guard: 0 px guarded for any colour.
- **The risk:** a hat is close to a generic symbol. Only the crook, the pompom and the spoon make it Pim's. If review finds it too generic, the next try is the Custodian's spiral shell with its spire. I didn't use the shell here because the seals already use it for The Custodian Wakes.

### 20. Chip · `chip-64.png` (128×128, drawn for 64)
- **What it shows:** Pim and Ottoline, head and shoulders, side by side.
  - Pim: blue hat, goggles, grin.
  - Ottoline: her gold bell hat, earrings and calm closed-eyed smile.
- **More parts than the icon** (two thieves, two hats, collar bells), **fewer than the poster** (no Custodian, no court).
- **How it was made:** rendered from the build. Title rigs 0 and 2 were moved close together and turned towards each other; Pim's staff was collapsed. Then composed as above.
- **Made by:** agent marks.
- **Check:**
  - At 64 px on night and on linen, both faces and both hats read.
  - Ottoline's bell hat is the game's gold and sits within 12 of sun, but its largest guarded block is 17 px in the 128 drawing, about 8 px at 64. That's well under 24, and it's shaded, not flat.
  - The bottom of her crimson robe shows. That's her costume colour, not ruby danger, and it's only a band at the bottom.
- **Couldn't do:** Pim with the snail's eye-stalk head. It would have meant joining two separate renders (the title rig and the boss in the court), and an honest single render can't put them side by side at chip scale. So the chip is two thieves' heads instead.

### 5. Continue picture · `key-still.png` (720×352)
- **What it shows:** Ottoline alone, standing in the Reliquary's gold hold circle in the west gallery. A Reliquary Beetle's ruby, toothed charge lane has just opened across the floor in front of her. The world as you left it, mid-heist.
- **How it was made:** rendered from the build at 1440×704 and downsampled (Lanczos). Ottoline runs solo at about 3:25, with the galleries open (`gt = 2`) and the hold objective live. The crowd and stray pickups are cleared, and one beetle is placed with its own charge telegraph (zone 25, frozen mid-count) aimed past her. The camera is fixed, low and close. HUD hidden. Script: `MT/.scratch/stills-cap.mjs continue`.
- **Made by:** agent stills.
- **Check:** `checks/key-still-continue-card.jpg` shows the card at 360×176 and 132×66. At 132 it still reads as a small red-robed figure in a gold ring with a ruby lane across it. `measure.py light`: L 0.43, a **mid** band.
  - The lane's lit pink measures `#c85061`, which is ember 19 (caution). It is the game's own danger telegraph, toothed and textured, not a flat block.
  - No numbers, names or buttons.

### 6. Result picture · `result-still.png` (1600×352)
- **What it shows:** the payoff in the Service Yard at dawn. The four thieves face us at the broken service gate, with the alarm-lit cathedral, the Orrery and the spires behind. Pim's glass bell, Vesna's lake-disc bell tower and Ottoline's locket portraits hang over their heads. The subject sits in the middle 720.
- **How it was made:** rendered from the build at 3200×704 and downsampled.
  - The staging follows `stills.mjs` 'ending' and `stage-getaway.mjs` 'payoff': the Custodian is felled, the escape runs, the thieves are set in the yard, and the game plays its own payoff (`ph = 2`, results panel held back).
  - The miracles are then re-fired on the effect clock with the build's own `fx.miracle()`, as the game's `stage-fx.mjs` 'miracle' does, and frozen together. In play they come one after another, so in this still three are in the air at once: Pim's, Vesna's and Ottoline's. Scrawl's vellum had already settled.
  - The camera is fixed, low and long, at the gate. HUD and captions hidden.
- I chose the yard over the vault beat. The vault renders as a near-white gold field, which is worse under white words. The yard keeps the four faces in the middle.
- **Made by:** agent stills.
- **Check:** `checks/result-still-with-words.jpg` puts a mock headline and stat line in plain white sans over it at 800×176.
  - The 30 px headline reads.
  - The smaller stat line is only fair over the bright dawn sky and stone. The platform's own scrim or shadow will matter here. If it prints bare white text, this picture is on the light side: `measure.py light` gives L 0.56, a **light** band.
  - No text or numbers in the picture.

### 7. Gallery · `gallery/01.png … 06.png` (1600×800 each)
Every slide was rendered from the build at 3200×1600 and downsampled (Lanczos). HUD hidden, no text added. Each subject sits inside the central 4:3, and the bottom 26 px are floor only. Script: `MT/.scratch/stills-cap.mjs <scene>`. Made by agent stills.

| # | Feature | How it was staged | Alt text | Draft caption (≤60) |
|---|---|---|---|---|
| 01 | Core loop | Pim alone in the Pale Cloister, Arc Bolt and Fire Ribbon at high tier. About 55 Pew Mites placed north of him; the game ran 1.3 s and then froze. | Pim stands in the Pale Cloister while his lightning arcs on its own through a swarm of pew mites. | Walk. Your spells cast themselves. The pews do not stop. |
| 02 | Reaction | Pim (Fire Ribbon) and Vesna (Rime Fan) in the Processional Court among knots of mites. The Steam and Shatter blasts fire through the game's own `fx.event`, as `stage-fx.mjs` 'reactions' does. | Vesna's frost and Pim's flame meet in a crowd: a burst of steam, and frozen mites cracking beside it. | Flame on frost makes Steam. Spark on frost: Shatter. |
| 03 | Place | The four thieves in the west wing of the Reliquary Galleries, inside the gold hold circle. Crowd cleared for a calm view of the indigo tiers, lit cases and lancet windows. | The four thieves hold the gold circle in the indigo Reliquary Galleries, among lit cases of miracles. | Hold the Reliquary's circle and the court opens early. |
| 04 | Character | The Custodian of Lesser Miracles, awake in the court and held between attacks, turned towards three of the thieves. The vault portal and hanging bells are behind it. | The Custodian of Lesser Miracles, a reliquary snail with a cathedral on its back, faces four small thieves. | The Custodian of Lesser Miracles is awake. And annoyed. |
| 05 | Together | Four thieves in the Pale Cloister. Vesna is held as a ghost, with her rescue part done; Pim, Ottoline and Scrawl stand close to bring her back. Foes cleared. | Vesna is a pale ghost; Pim, Ottoline and Scrawl crowd round her to bring her back. | A friend down is a ghost. Stand close to bring them back. |
| 06 | Payoff | The getaway, through `stage-getaway.mjs` staging: vault taken, escape clock running, the four running south through the cathedral's alarm light. Their carried miracles are drawn over their heads, with wax acolytes and mites behind. Camera follows the group; notoriety 0. | The four thieves run home through the rose-lit cathedral, each with a stolen miracle over their head. | Grab the miracles and run for the yard before time runs out. |

- **Check:** `checks/gallery-100px-and-4x3.jpg` shows each slide at 100 px wide beside its central 4:3 crop.
  - 01, 02, 04, 05 and 06 read in both. 01 reads as one thief against a swarm. 04 reads as giant against small.
  - 03 is a place slide. At 100 px the thieves are specks, but the gold ring, the indigo tiers and the lit cases read.
- **`measure.py light`:** 01 L 0.55 light; 02 L 0.61 light; 03 L 0.38 mid; 04 L 0.55 light; 05 L 0.57 light; 06 L 0.49 mid.
- **Bottom 26 px:** floor in all six. Slide 01 has a floor quatrefoil at the far right. Slide 02 has a mite's legs at the right edge.
- **06 colour:** a first pass at notoriety 4 lit the floor `#cf7b56`, which is ember 10 (GUARDED). The final uses notoriety 0, the build's normal first-run alarm. Its floor is `#d2966b`, ember 17.9 (caution). The game's colours are not altered.
- **Variety:** two places appear twice.
  - The cloister holds 01 and 05. The second is at a different scale, with all four thieves.
  - The court holds 02 and 04. 02 faces a side wall; 04 faces the snail and the vault.
  - 06 is the cloister's gate wall under alarm light.
  - None repeats the poster's frame: the poster is from behind, at the snail's foot. 04 is side-on with the snail facing the thieves.

**Found while staging:**
- Pim's solo default kit does not cast Shatter, which needs Spark or Glass on a frozen foe. In 02 the Shatter is the game's own reaction effect, fired through `fx.event` as the build's stage tool does. Caption 02 names both reactions as rules, which DESIGN §3 confirms.

### 8. Achievement seals · `seals/<stem>-earned.png`, `-progress.png`, `-locked.png` (21 files, 192×192, transparent)

**Drawn, not rendered.** The 3D build can't make an honest seal at 192 px, so these are drawn in the game's own palette, materials and shapes (`docs/ART-DIRECTION.md`, `EL_COLOR` in `src/sim/defs.ts`). The game's own pieces are the reference for each glyph: the Custodian's ivory shell and purple body, the Crown of Lesser Miracles in `wizard-cast.ts`, the ghost tint `#cfe6ff`, and Seal Drip's bottle-green wax.
- **How it was made:** SVG written by `seals-gen.mjs` (kept in MT/.scratch, outside the repository). Chromium rendered it through Playwright at 4× (768 px) with a transparent background, and Pillow downsampled it to 192 (Lanczos) with `work-seals/sheets.py`. No 3D capture was used.
- **Made by:** agent seals.

**One frame for the whole set:**
- an even black outline (`#17131f`, the game's ink line);
- a thin rim of aged brass `#b08a3e`;
- a ring of leaded glass, 12 panes with dark leading, lit from above (the cathedral's sky light);
- an indigo-velvet `#2b2459` centre;
- one glyph on top, in court ivory and wax, with the same thick black outline.

**Outline by kind:**
- **Feat:** a round seal.
- **Collection:** a quatrefoil: four lobes round a centre, the cloister's tracery. Its notches stay plain at 32 px in all three states.
- **Event (reserved, not saved):** a parabolic window, with a flat sill and a tall rounded parabolic head: the cathedral's own opening. It's taller than it is wide, so at 32 px it differs from both the circle and the quatrefoil. It was tested at 32 px on night and linen beside the other two (scratch only, `work-seals/kinds-32-*-x4.png`). It's not a pointed lancet, so it can't read as a warning triangle.

**The three states:**
- **Earned:** the lit glass, the brass rim, an ivory glyph and the seal's one accent.
- **In progress:** the same art, dimmed inside: the glass at about a third of its light, the ivory dropped to limestone grey `#a39c8e`, the rim to dark brass `#6a5530`, and the accent mixed 60% toward grey.
- **Not yet:** no fill at all. A quiet grey ring `#8e8a98` (the kind's own outline shape) and the glyph in the same grey, with dark-grey `#4a4754` inner lines. It holds on both night and linen.

**One hot accent per seal,** from `EL_COLOR` only:
- never ruby `#c8233c`, gold `#e4b53c` or vermilion `#e8472b` (6.3 from ember);
- never lavender `#a493c8` either: it's 11.1 from lilac, so it would look "selected".

**Colour checks (`measure.py colour`):**
- **Aged brass `#b08a3e`:** 19.3 from sun, "caution". My judgement: it's only the thin rim, 6 px at 192 and 1 px at 32. It's also the bell's lip and the door's planks, and never a large field.
- **Crown body:** a deeper brass `#a27e39`, 23.7, free. Not the game's gold.
- **Removed:** I tried a warm highlight `#d8b878` on the crown, but it measured 9.9 from sun (GUARDED), so I took it out.
- **Wax's emboss ring `#5fbf7a`:** 13.0 from mint, "caution". It's a thin line only, never a block.
- **Ghost `#cfe6ff`:** 14.1 from lilac, "caution". It's the game's own ghost tint, and only the small ghost uses it.
- **The rest are free:** cobalt `#2f63e0`, purple `#6b3fa0`, green `#2e8550` and ivory.
- **Teal `#2fb3a8`:** 14.9 from mint, "caution". It only tints the glass and the orb's ring, on one seal.

| Seal (stem) | Kind | Glyph | Accent | Rule as the build checks it (`ACH`, `src/client/save.ts`) |
|---|---|---|---|---|
| **Into the Cloister** (`into-the-cloister`) | feat | an ivory parabolic service gate with a bite broken out of its shoulder, one brass door hanging askew from a single hinge, night-blue glass beyond | cobalt `#2f63e0` | Break in through the service entrance. |
| **The Custodian Wakes** (`the-custodian-wakes`) | feat | the snail's ivory spiral shell with a tiny spire and pearl, on its purple body with one eye-stalk | purple `#6b3fa0` | Face the reliquary snail. |
| **A Miracle Stolen** (`a-miracle-stolen`) | feat | two cupped ivory hands holding a round pale light in a glass halo | teal `#2fb3a8` | Win a run. |
| **Nobody Left Behind** (`nobody-left-behind`) | collection | an open hand lifting a small ghost (the game's ghost tint) | cobalt (the ghost's eyes and glass) | Rescue 5 friends (over any runs). |
| **All Seals Broken** (`all-seals-broken`) | feat | a round bottle-green wax seal with drips, cracked into three pieces pushed apart from an off-centre break | Seal Drip green `#2e8550` (never ruby) | Break all three seals in one run. |
| **Public Nuisance** (`public-nuisance`) | feat | an ivory bell with a brass lip, falling at a tilt, two motion streaks above | purple (the clapper and glass) | Win a run at notoriety 3. |
| **Least Favourite Thieves** (`least-favourite-thieves`) | feat | the Crown of Lesser Miracles knocked askew, pearls on its points and the small blue lamp `#7fb8ff` | cobalt / lamp blue | Win a run at notoriety 5. |

- **The crown is drawn with five points.** The game builds it with seven, but seven points turn to mush at 32 px. Its brass is aged, never the gold it has in the game.

**Checks** (`checks/`):
- **`seals-strip-32.jpg`** (night) and **`seals-strip-32-light.jpg`** (linen): all 21 at 32 px. Rows: earned, then in progress, then not yet.
- **`seals-strip-32-x4.jpg`:** both strips at 4×, with hard pixels.
- **`seals-board-96.jpg`:** all 21 at 96, on night and on linen.

**What I looked for, and what I found:**
- **Seven distinct glyphs** in every state.
- **No letter reading:**
  - The gate's opening shows dark, with the door askew, so it isn't an "n".
  - The snail's spiral has a body and a spire, so it isn't an "@" or a "6".
  - The ghost isn't an "A".
- **No play-button or warning-sign reading:** nothing is a triangle, and the bell is tilted and round-shouldered.
- **The not-yet state is legible** on both grounds.
- **Feat and collection are distinct** at 32 px in all three states. Earned and in progress are clearly told apart.
- **No text, numbers or padlock** anywhere.

**How I iterated:**
1. **The gate:** the door first covered the opening, and the grey state read as a tombstone. I moved the door to one side and cut the opening out in the grey state.
2. **The wax:** three cracks from the centre made the grey state read as a peace sign or a steering wheel. Then the bumpy edge read as a cabbage. I settled on an off-centre break, wider gaps and a smoother edge. In the grey state the gaps are cut through to the ground. The glass behind it went from green to cobalt, so the wax stands out.
3. **The hands:** rays round the orb made it read as an eye with lashes. I replaced them with a glass halo.
4. **The bell:** the motion streaks moved away from its hanging loop, so they don't read as part of the bell.

**What's weak:**
- At 32 px, A Miracle Stolen in the grey state is the least specific: a ball in a bowl. It still reads as distinct from the others.
- All Seals Broken reads as "broken green wax" more than "seal" at 32 px. At 96 it's plain.

### 17. Moving poster · `living-poster/miracle-thieves.js`
- **What it shows:** the poster, alive. The four thieves stand at the foot of the Custodian, a reliquary snail with a coiled, brass-ribbed shell, a clock in the coil's eye and a little cathedral on its back, in front of the gold-shafted vault portal. On hover the camera cranes down into the game's high three-quarter view for a 6 s run.
- **How it was made:** **drawn, not rendered.** It's 2D Canvas, one classic-JS module (`BUG_MODS.miraclethieves`, LIVING_POSTER_CONTRACT v1 plus `acts`), because three.js can't come along. It uses the game's palette and shapes: limestone and ivory court, indigo velvet, aged brass, black outline strokes, leaded jewel glass, ruby for danger only, and rounded cobalt `#2f63e0` friendly magic. The Pew Mites follow `enemyBodies.ts` (misericord seat, lancet backrest, chattering velvet lid, six legs). Pim follows DESIGN §6 (ginger mop, jug ears, spectacles that go askew, cobalt lining, jam-jar battery, the empty glass bell on his belt, the overbalancing lunge). A small perspective camera (pitch plus perspective, projected per frame, paths precomputed) recomposes every plate from its aspect, and closes in on Pim on tiny, strip and squeezed plates. No images, timers, DOM, globals, `getImageData` or `Math.random` (it uses `api.rnd`).
  - **Fields:** `no` and `maker` are `···`. Title Miracle Thieves; kind "Co-op cathedral heist"; verb "Steal."; ground `#d9c0a3`; ink `#2f63e0`.
  - **Items:** `bolt` (an Arc Bolt) and `relic` (a miracle's round light in a brass ring), with `acts: { bolt: 'shoot', relic: 'grab' }`.
- **Modes:**
  - **Held, reduced motion and first frame:** the poster pose. Pim glances back over his shoulder at you.
  - **Idle:** live 2.5–6 s, then hold 1.5–5 s; the hold is the poster pose. Five beats rotate:
    - glance (he straightens his crooked hat and it flops back);
    - mite (a Pew Mite skitters out from behind the dais, he jumps, zaps it and it flips and bolts);
    - lunge (the overbalancing lunge, then "meant to do that");
    - sneak (tiptoes towards the snail, which swivels an eye; he whistles innocently);
    - spark (taps his jar and blows on the staff tip).
  - **Idle secondary motion and `near`:** the snail breathes and its eye stalks wander, the weathervane turns, Ottoline's bells sway, candle flames flicker and motes rise in the shaft. With `near`, Pim turns to the cursor and the snail opens its eyes on you.
  - **React (0.8 s):** squash, a startled leap, his hat flies off spinning and lands crooked the other way, spectacles askew, beard puffed, the others hop and the snail's eyes snap to him.
  - **Enter (0.7 s):** the camera cranes from the long low view down into the high three-quarter view while the party spreads to the arena edges. It's a physical move with no fades.
  - **Loop (6 s, seamless):** the miracle drifts down from the belfry onto the gold hold circle. Pim runs while his Arc Bolts cast themselves into a stream of Pew Mites (splinters and lids pop). A ruby toothed warning blooms under him, he spots it and dashes clear, and it snaps and cracks the floor. He runs in and grabs the miracle overhead, the snail recoils (eyes wide, shell jolts), and he scampers back and tucks it into his jar. The HUD is a static gold-ringed level badge "7".
  - **Squeezed:** squashed, hat crushed and annoyed brows, then he braces his staff against the near edge and pushes, then stamps while his jar crackles. It escalates with `squeeze` and `mt`, and the camera closes in on him.
  - **Events:** `cue` aims and shoots an Arc Bolt (every third cue, he lobs the relic). `hit` knocks him over with his hat off and spectacles askew, then he sulks. `look` turns his head that way for 1.5 s. `shake` makes him stagger.
- **Made by:** agent living
- **Checks** (`checks/`):
  - `living-harness-1500ms/3000ms/4500ms/7000ms/10000ms.jpg` and `living-harness-reduced-motion.jpg`: the harness board, all six plates. Harness: `errors []` for both the seq and rm runs.
  - `living-held-vs-poster.jpg`: the held frame (left) beside `poster.png` (right). Same register and composition: the portal and gold shaft centred, the snail filling the arch, and the four thieves in poster order (Pim, Vesna, Ottoline, Scrawl) at its foot.
  - `living-shapes.jpg`: 120×90 (still and loop), 150×370 (idle near and loop), 900×180 (still and loop), 120×280 squeezed (early and full) and 900×640. Pim stays in view in every shape.
  - `living-loop.jpg`: the loop at 0.6, 1.6, 2.3, 2.8, 3.4, 4.25, 5.0 and 5.8 s.
  - **Frame time** at 600×400 (Chromium, JS time per `frame()`): idle 12 s median 0.4 ms (p95 0.6); loop 12 s median 0.3 ms (p95 0.6); squeezed median 0.3 ms (p95 0.5). The 2 ms budget is met.
  - **Light band:** nothing brightens the frame. There are no whole-frame shifts. The only pulse is the ruby warning's fill alpha at 2 Hz, small and on the floor.
- **Couldn't / caveats:**
  - It isn't the game's three.js renderer, so it can't match the poster's toon-shaded 3D. It's a hand-drawn 2D reading of it.
  - The other three thieves are simpler back-view silhouettes.

### 18. Page backdrop · `backdrop.png` (1440×577), `backdrop-phone.png` (390×826)
- **What it shows:** the wet service yard at rest before the break-in, seen from above the yard wall. The cathedral's stacked spires, the orrery and the treasury glass rise behind the broken parabolic gate. The gatehouse lanterns are the one light, spilling down the cobbles. No thieves, no foes and no Custodian. The desktop version ends in the pale yard wall (a hard edge), with the lamp-lit cobbles running under the hero. The phone version is its own portrait view, low in the yard: sky above, the spires and gate in the middle, the cobbles and puddles below.
- **How it was made:** rendered from the build's title stage, which builds the whole precinct, with `window.__envSnap = true`. The four title thieves (`titleRigs`) and the DOM UI are hidden, and the camera is fixed with the stage's own `debugCam`. The area light is the yard key (camTarget z 47). Desktop: camera (−1.5, 8, 78) looking at (4.5, 7.5, 40), fov 44, rendered at 2880×1154. Phone: camera (0, 4, 66) looking at (0.5, 12, 30), fov 72, rendered at 1170×2478. Both were downsampled with Lanczos. Nothing was painted over. Script: `.scratch/page-bd.mjs`.
- I also looked at the Processional Court, the Pale Cloister and the Reliquary Galleries at rest. Each one puts a strong second focal point (the vault portal, the treasury dome, or the relic cases) right where the page frame shows. The yard's focal point, the gate, sits behind the poster.
- **Made by:** agent page.
- **Check:** `checks/backdrop-under-poster.jpg` and `checks/backdrop-phone-under-poster.jpg`. These are my own mocks, because ref 04 isn't in `direction/reference/`. Desktop puts the backdrop on cover over a 1440×615 band, with the poster at 740×370 and a dark rail panel at the measured ref-04 positions. Phone puts the poster full width at the top and an info panel below.
  - The poster leads in both, and in greyscale. Around the poster you see sky, spire tips, the left yard wall and the lamp-lit cobbles under the hero.
  - Guarded-colour audit (CIEDE2000 < 12, any solid 24×24 block): none on either file. Sun pixels are 0.9% (desktop) and 3.0% (phone), all scattered lamp glow.
  - `measure.py light` gives the desktop L 0.575, C 0.108: a light, quiet sheet.
  - A small lilac-ish jar and two red chests sit on the yard's right-hand stall, under the rail. They're the game's own props, all under 24 px.

### 22. Title lettering · `title-lockup.png` (1701×686, transparent)
- **What it shows:** "MIRACLE" over "THIEVES", stacked, in the game's title lettering, split by a brass key rule (a bow, a shaft and a rounded bit, with no teeth).
- **How it was made:** drawn with Pillow from the game's own title treatment.
  - I started the build to the title screen and screenshotted it (`work-page/title-screen.png`). The `.logo h1` asks for `'Cinzel Decorative', 'Cinzel', 'Palatino Linotype', …` at weight 900. No web font loads, so on Windows the game actually draws the title in **Palatino Linotype Bold**. The lockup uses that same installed face (`C:/Windows/Fonts/palab.ttf`).
  - Colours as on the title screen: "MIRACLE" in ivory `#f4f1e6`, "THIEVES" in gold, with an ink `#1d1830` outline and an ink drop shadow down-right.
  - **"THIEVES" is set as leaded glass:** a vertical gradient from gold `#e4b53c` to aged brass `#b08a3e`, crossed by a fine diamond leading like the game's treasury glass.
  - The title screen's ruby `#c8233c` up-left offset shadow is **left out**, because ruby means danger only.
- **Made by:** agent page.
- **Minimum width: 92 px.** At that width the caps are 12 px tall (cap fill; about 15 px with the ink outline). Caps reach 18 px at 138 px wide. The cap height is 13.05% of the lockup's width.
- **Check:** `checks/title-lockup-min-width.jpg` shows the lockup at 92, 138 and 270 px on night and on linen, and the 92 px version at 4×. It reads on both grounds at 92 px. The key rule turns into a line at that size, which is fine.
  - Guarded audit: no solid 24×24 sun block. The leading breaks up the gold, and sun-near pixels are 4.1%.
  - It isn't used on any poster.

### 19. Share card · `share-card.png` (1200×630)
- **What it shows:** the poster's image, the four thieves at the foot of the Custodian in the Processional Court, lit by the vault shaft. The subject's centre is at 0.73 of the width. The title lockup sits on the plain limestone wall on the left, and the court floor runs quiet along the bottom.
- **How it was made:** rendered from the build with the poster's own staging, which is `p6.mjs` copied as `.scratch/page-share.mjs`:
  - the same boss hold, the thieves' places and their facings;
  - foes and seal stones cleared;
  - the camera head-on like the poster's, (0, 2.6, −11.5) looking at (0, 5.6, −36), fov 44.
  - To put the subject at 0.73 without turning the view, the camera renders an off-centre window of a larger frame (`camera.setViewOffset(3504, 1660, 0, 290, 2400, 1260)`). This is the same perspective as the poster, framed right and up. It was rendered at 2400×1260 and downsampled with Lanczos.
  - The lockup, 510 px wide, sits at (46, 150). It's the one place the title sits on art.
- **Made by:** agent page.
- **Check:** `checks/share-card-270.jpg` shows the card at 270×142, with a mock 22 px linen bar, plus the title region at 2×.
  - **The smallest letters are 15.0 px cap height at 270 px wide** (67 px on the 1200 card). The 12 px minimum is met.
  - Ember, at 0.39%, is the portal's ruby jewels and the snail's tiny ruby finials. There's no 24×24 guarded block of any colour, and no player names.
  - The thieves' feet stay above y 0.90, so the bottom band is floor only.
  - `measure.py light` gives L 0.508, C 0.283: a light band, like the poster.
- **Caveat:** a stained-glass window shows faintly behind "THIEVES" on the left wall. The ink outline keeps the lettering clear, but the left side is "plain" limestone wall rather than an empty field.

### Found while working
- `poster.png` has a small blue/pink sliver at the top edge, around x 365 and y 0–8 at 2400 wide. *Lead's check:* I enlarged it. It's the bottom of a leaded stained-glass window in the court wall, part of the world, not HUD. Kept.

## Words (round 4, items 23–31)

### 23. One-line pitch · `publish.json` `"line"`
- "Rob a cathedral of a miracle. You move; your spells cast themselves." (68 characters). `focus` kept as `{"x": 0.5, "y": 0.6}`.
- **Why:** it says what you do (rob, move) and the one rule a stranger needs (you don't aim or fire). It doesn't say "with friends" because a solo run is the default start (no lobby wait for solo, DESIGN.md §1).
- **Made by:** agent words.

### 24–31. Page words · `words.json`
Started from `direction/WORDS_TEMPLATE.json`, with its `_read_me` line deleted. JSON validated with Python `json.load`; it parses. No store, pass, update or event words are in it: they wait for the yes, and their proposals stay in `design.json`, untouched. The template has no field that belongs only to those, so nothing was dropped. `bought_line` is in the Now list, so it is drafted. It follows the store verb in `design.json`.

**Title, one line, hover words (24)**
- **Title:** "Miracle Thieves".
- **Hook** (109 of 110): "Four broke wizards rob a cathedral that hoards miracles, crack its vault and run home before the grates shut." It is built on the fixed store tagline (DESIGN.md §6), plus the v2 getaway, which game.json's hook doesn't mention.
- **playing_word:** "robbing".
- **hover_hint:** "Hover to break in" / "Tap to break in". "Break In" is a fixed UI phrase. The moving poster's seam act wasn't settled when this was written, so the hint is neutral. If the moving poster's `acts` is `grab` or `shoot`, the lead may want "Hover to lift the miracle" or similar.
- **echo:** `#2b2459`, night indigo velvet from the style note. `measure.py colour`: ember 53.8, lilac 58.4, sun 83.4, mint 75.2, all free. Brass `#b08a3e` was checked and rejected: it is sun 19.3, caution.

**About (25)**
- **description:** three sentences. They cover:
  - who you are, 1–4 players, and drop-in mid-heist (late join is real: `world.ts:140`, and the lobby's "Friends can drop in mid-run too");
  - move and dash only, spells fire themselves, picks change behaviour, and the reactions;
  - the v2 run in order, ending with the getaway.

  It has no "level" or "enemies".
- **goal:** "Crack the Vault of Lesser Miracles and get a thief home to the Service Yard." The run is won if at least one thief escapes (DESIGN.md §2, and `onRunEnd` `won`).
- **tips:** built from the build's own loading tips (`meta.ts` `TIPS`), with game-speak removed:
  - relics open the galleries early. This is true: the galleries open 5 s after the last relic comes home (DESIGN.md §2).
  - the Custodian's bells ring before every attack. This is the build's banner sub-line, `game.ts:1206`.
  - a ghost is brought back by standing beside it for about 2 s within 2.2 u (DESIGN.md §3.8).

**Controls (26)**, read from `src/client/input.ts`, `game.ts:107–110, 289` and `ui.ts:71, 408`:
- **Keyboard:**
  - WASD or Arrows to move. Z and Q also work, for AZERTY.
  - Space or ShiftLeft/ShiftRight to dash.
  - Digit or Numpad 1, 2, 3 to pick a card.
  - Esc **or P** to pause.
  - Enter or Space on the title starts a solo run as the selected wizard.
- **Mouse:** clicking a card (`ui.ts:408`, the card is a button) and the ❚❚ pause button (`ui.ts:71`). These are listed under `mouse`, but `inputs` stays keyboard, touch and gamepad, as in game.json.
- **Gamepad:** left stick (axes 0/1, dead zone 0.2) to move, button 0 (A) to dash, button 9 (Start) to pause. **Nothing else is bound.**
- **Touch:**
  - a floating thumb-stick wherever you first touch in the left 62% of the screen;
  - the DASH button;
  - tap a card;
  - the ❚❚ button.
- **game.json v1 against the build:**
  - "Esc · Menu": the build pauses on Esc **and P**, and the gamepad's Start.
  - Not in game.json: ZQSD, Enter or Space to start from the title, and every gamepad control. The gamepad is declared in `inputs` but has no line in `controls`.
  - "Drag on the left to move" is right, but the zone is the left 62%, not half. DESIGN.md §3.1 says "left half".
  - "Move (your spells cast themselves)" and "Space / Shift · Dash" match the build.

**Details and tags (27)**
- **genre:** "Co-op survivors", kept from game.json.
- **players:** "1–4", coop true (one shared session, shared team XP, rescues).
- **inputs:** keyboard, touch, gamepad. The gamepad is supported (`input.ts` `poll`), with the gap flagged below.
- **minutes: 7.** The build's first win is about 6–7 minutes (DESIGN.md §1, D-v2-5). game.json says 13, and the original brief said 10–15. Yelnur hasn't settled it: **flag it in the PR.**
- **mood:** "thrilling", kept from game.json. The platform's mood list isn't in the pack.
- **tags:** Co-op heist · Wizards · Spell reactions · Drop-in friends · Daily heist, all 7–15 characters. The first three put it on the shelf. "Daily heist" is Today's Job, said plainly.
- **contentNote:** cartoon magic, crowds of foes and bright flashes, plus the two settings as they really work:
  - **Reduced flashing** skips `fx.screenFlash` entirely (`fx.ts:251`) and calms the HUD pulses, the warnings, the arena, the enemy and boss flashes, and the glare (`ui.ts:109–123`, `fxwarn.ts:72`, `game.ts:244, 448–450`).
  - **Camera shake** is a 0–1 slider in 0.05 steps, so it goes to off (`ui.ts:435, 445`).

  game.json's "optional bright-flash reduction setting" is true, but it doesn't mention the shake slider.

**Moments (28)**: the seven `ACH` entries with `moment` (`save.ts`). The names are unchanged, and each rule is the real condition:
- **Into the Cloister:** awarded in `onRunStart` (`game.ts:784`), on any heist start. The rule says start a heist.
- **The Custodian Wakes:** banner 5 (`game.ts:1205`), when the Custodian wakes, for everyone in the room, ghosts included. The rule says be in the heist when it wakes. The build's line "Face the reliquary snail" is looser than the code.
- **A Miracle Stolen:** `won` (`game.ts:821`), which means at least one thief escaped. A caught thief in a won co-op run earns it too, and the rule says so.
- **Nobody Left Behind:** collection. `stats.rescues ≥ 5`, counted only for free rescues **you** perform (`REVIVE` how 0, `byIdx === me`, `game.ts:1170`). The rule says "yourself, over any heists".
- **All Seals Broken:** OBJ 2 done (`game.ts:1190`), all three seals in one run.
- **Public Nuisance:** won at notoriety ≥ 3 (`meta.ts` `runAchievements`). The build's line says "at notoriety 3"; the code takes 3 **or higher**, so the rule says so and names Notorious.
- **Least Favourite Thieves:** won at notoriety ≥ 5, which is the maximum, Legendary.

The rules in `design.json`'s moments are the build's short lines. words.json carries the sharper ones above, and design.json was left alone.

**Gallery captions (29):** `notes/stills.md` didn't exist when this was written, so the captions come from the plan in `bug/NOTES.md`, all 49–58 characters. **The lead should check each one against the final slide.** In particular:
- 02 says Steam (frost meets fire). If the still shows Shatter, change it to "Frost, then sparks: the crowd shatters into glass".
- 05 assumes one ghost and the others coming.

**Place strings (30):** from `game.ts:726–731` and `836`, sent through `platform.progress` → `sdk.progress.set` (`platform.ts:148`).
- **During a run** (every 5 s): `` `${AREA_NAMES[areaAt(x,z)]} · level ${w.tm.lv}` ``, plus `" · the Custodian"` while `w.bs` is set. `w.bs` is cleared when the escape clock starts (`world.ts:317`), so the suffix shows during the fight only. The area names are Service Yard, Pale Cloister, Reliquary Galleries and Processional Court (`arena.ts:16`).
- **"level" is lower case.** The brief's example "Lv 4" isn't what the code sends.
- **At the end:** "Stole a miracle" or "Souls confiscated — try again" (29).
- **Lengths:**
  - "Reliquary Galleries · level {n}" is exactly 30 at a two-digit level, and over at 100+, which doesn't happen.
  - **Over 30:** "Processional Court · level {n} · the Custodian", 44–45 characters. It can also appear as "Reliquary Galleries · level {n} · the Custodian" (46) if a thief stands in the galleries during the fight. **Proposed fix (no code changed):** while the Custodian is up, send `the Custodian · level {n}` (24–25), or drop the area.
  - **Edge case:** with no rig of your own (`mine` undefined), the code sends " · level {n}", with a leading separator and an empty area. **Proposed fix:** fall back to the level alone, or to "Breaking in". It isn't listed in `place_strings`, because it's a bug, not a place.

**Voice (31)**
- **verb:** "robbed".
- **own_word:** "Pocketed", to match `design.json`'s store verb.
- **bought_line:** "Pocketed for you: ".
- **stat_nouns:** what `showResults` counts (`game.ts:900–915`):
  - miracles: thieves out, `res[7]`;
  - seals: `res[0]`, of 3;
  - duets: `res[11]`;
  - rescues: `myS.resc`;
  - foes felled: `myS.kills`.
- **result_lines:** the build's own register:
  - "Miracle stolen. The cathedral has already filed a complaint." (DESIGN.md §6);
  - "Everyone's out, miracle in hand." (the COPY-QA wording);
  - "Confiscated. Your souls are filed under Pending." (the Custodian's clerks line, DESIGN.md §6).
- **friend_lines:**
  - "Robbing a cathedral. There's room in the wheelbarrow."
  - "Drop in mid-heist. The cathedral won't mind. It will, but still."
- **quick_chat:** "Coming for your ghost." · "Relics first, then the vault."
- **pause_line:** "Heist on hold. The cathedral is catching up on its filing."
- No exclamation marks, no streak, scarcity, guilt or prices.

### Stale text and gaps found in the build (for NOTES.md; nothing changed)
- **Gamepad can't pick a card.** `input.ts` binds only the stick, A and Start, and `onPick` is keys 1–3 only. In co-op the first card is taken after 10 s. In solo the world holds while the cards are open, so a gamepad-only solo player has to reach for keys, mouse or touch. DESIGN.md §3.1 says "Pick a card: 1/2/3, tap, or gamepad", which the code doesn't do. **Proposed fix:** the d-pad or face buttons pick a card.
- **"Ropes, Smoke and Wax"** (`save.ts` `rsw`) says "Muffle". The reaction is **Lost Wax** (`defs.ts` `REACTIONS[10]`). The words leave it out, because it isn't one of the seven moments.
- **HURT_NAMES** (`defs.ts:210`) mixes lower case ("beetle charge", "holy wax") with Title Case ("Custodian shell").
- **The Custodian's pronoun:** the boss banner sub-line says "**Her** bells ring before every attack" (`game.ts:1206`). NOTORIETY and the banners say "it" ("it drops falling bells", "The Custodian retreats"). The words use neither; the tip says "The Custodian's bells".
- **Moment lines looser than the code:**
  - Public Nuisance says "at notoriety 3", but 3 or higher counts.
  - The Custodian Wakes says "Face the reliquary snail", but being present when it wakes counts.
- **The place string** uses game-speak "level", runs over 30 during the Custodian fight, and has the empty-area edge case (see 30).
- **The "left half" touch zone** in DESIGN.md §3.1 is the left 62% in code.
- **NOTORIETY[0] "Unknown"** reads as a placeholder (COPY-QA, still in defs).
- **game.json v1 text:**
  - "minutes": 13, but the build's first win is 6–7.
  - The description has no getaway, no new spells (Rope Trick, Thurible Swing, Seal Drip) and no notoriety or Today's Job. It ends at "face the Custodian".
  - The hook doesn't mention the run home.
  - The controls list has no gamepad lines and says Esc only, where the build also takes P and Start (see 26).
  - The contentNote doesn't mention the shake slider.
- The TIPS still use game-speak ("XP", "the whole team gets XP"). That's fine in-game, so the page words avoid it rather than copy it.

- **Made by:** agent words.

## Bringing it together (step 4, the lead)

- **Side by side:** `checks/all-pictures.jpg` holds the posters, share card, gallery, Continue, result, backdrops, marks, seals and lettering.
  - Everything rendered comes from one renderer and one precinct: toon bands, black outline shells, and the court's warm limestone and ivory against indigo velvet.
  - The light is the cathedral's own throughout. Vault gold in the court, amber pools in the galleries, rose for the alarm, and dawn in the yard are the game's own area states, not a grade.
  - The seals and the moving poster are drawn, not rendered, but in the same palette, outline weight and materials. Nothing drifted far enough to redo.
- **Words beside pictures:** every gallery caption matches its slide. Slide 2 is Steam with frozen mites, slide 5 Vesna as a ghost being fetched, slide 6 the alarm-lit run home. The seven seal names and glyphs match `words.json` `moments`. Controls were read from `input.ts`.
- **Agents, all on the session's model at its default effort.** This fan-out ran before the 21 Oct instruction to set model and effort per agent; later fan-outs will set both:
  - marks
  - stills (Continue, result, gallery)
  - seals
  - living (moving poster)
  - page (backdrops, share card, lettering)
  - words
- **Every agent's check images are in `checks/`.**

## Couldn't make, or made with a caveat

- **Wall preview:** `direction/reference/` (the For You wall and page references) isn't in the studio repository. So `wall.py` produced the shapes sheet but not the live-wall composite. The page agent mocked the hero and rail positions for the backdrop checks from an approved game's check sheet.
- **The result picture:** three miracles are shown in the air at once. In play they manifest one after another. They're re-fired with the game's own `fx.miracle()`, as its staging tool does. The small number line over the bright dawn sky reads only fairly if the platform prints bare white text.
- **Gallery slide 2:** the reaction burst (Steam on frozen mites) is fired with the game's own effect call, as its reactions staging tool does, rather than caught live.
- **The moving poster:** drawn in 2D, since three.js can't come along. The other three thieves are simpler silhouettes than Pim.
- **Waiting for Yelnur's yes (ROUND.md §0):** store pictures (9), the pass tile, grounds, marker and rewards, and the owned mark (10–14), the update picture (15), the event banner and seal (16), any new seal, and their words. The design is in `../PROPOSALS.md` and `design.json`.
- **Run length:** `words.json` says 7 minutes, what the build does. `game.json` says 13 and the brief 10–15. Flagged for Yelnur.
