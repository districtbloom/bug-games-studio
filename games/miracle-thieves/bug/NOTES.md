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
