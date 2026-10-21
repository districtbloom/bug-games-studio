# Stills group · notes (agent: stills)

Pictures 5, 6 and 7 of DIRECTION.md: the Continue picture, the result picture and the six gallery slides. Every one is a frame rendered by the shipped build (`/home/claude/sivver/dist/perlune.local.html`) with its own WebGL2 renderer. Nothing was painted, composited, traced or retouched afterwards, and no earlier picture was reused. The game's code was not changed.

## How they were made (shared by all eight)

- **Tool:** `/home/claude/passB/work/stills/still.js` is my variant of `tools/render.js`, with the virtual-timer harness of `video/cap.js`.
  - It loads the build headless (Chromium + SwiftShader).
  - It plays a real journey with the game's own functions (`newJourney`, `startLanding`, the director, the test bot, `spawnEnemy`, `hitEnemy` → `bossDefeated` → `grandWave`, `startLaunch` → `enterSpace`, `startFinale`).
  - It advances the game's `setTimeout`s on virtual time, so timed effects fire in order.
  - It then poses a camera and captures one frame.
  - `Math.random` is seeded, so a test render and the final render play the same moment.
- **Shot setups:**
  - `work/stills/shots.js`: `ferrum` = key still, `nacre` = result. `shots-final.js` is a frozen copy of the result setup.
  - `work/stills/gshots.js`: `core`, `body`, `cathedra`, `lode`, `space`, `finale`.
- **Finish, the same as the poster:**
  - vignette 0, grain 0.01, streak 0.45;
  - lens focus 0.55 (0.45 on slide 03, a wide world view);
  - the game's own bloom 0.6, exposure 0.95 and saturation 1.12, reset on every capture;
  - sky contour lines low (`neb` 0.02–0.05, the poster used 0.03).
- **Clean backgrounds:**
  - the world's floating dust is hidden;
  - on the result still, the other worlds, the Eclipse rays and Nacre's decor are hidden too;
  - the DOM HUD is not drawn.
- **Light:**
  - The key light is the game's own camera-relative key on the key still, gallery 01, 02, 04 and 05, and the finale's own light on 06.
  - The result still uses the poster's back-left key `[-0.6, 0.45, -0.55]`.
  - Slide 03 uses a back key `[-0.35, 0.45, -0.82]`, chosen so the glass world's lit face stays off the platform's lilac.
- **Renders:** finals at 2× (gallery and key still, the key still then reduced to 720×352) or 1× (result) with MSAA 4.

## Pictures

### key-still.png (720×352)

- **file:** `bug/key-still.png`
- **shows:** On Ferrum Dunes mid-harvest (the world still half-muted, wake ≈ 0.5), a ring of iron moths closes in and the droplet turns to face the nearest one. The droplet is in the middle.
- **made by:**
  - Rendered from the game. A real journey: the bot plays Ferrum for 16 s with a small build (spines, shatter bloom, lodestone heart, form 7).
  - The storm front is held off, and the bot is paused.
  - Seven iron moths are spawned with the game's `spawnEnemy` in a broken ring 4–5 units around the droplet. They then fly for 0.06 s under their own AI.
  - The droplet is turned toward the moth ahead of it (`P.face`). The camera sits low in front, three-quarters, fov 0.45.
  - Rendered at 1440×704 and reduced to 720×352.
- **agent:** stills
- **check:**
  - Continue card mock at 360×176 and at 132×66 (`work/stills/mock-continue.png`, modelled on reference 13): the droplet and the glowing moths read at both sizes, and the subject sits in the middle.
  - `guard.py`: ember 0.20 % (largest block 7 px), sun 1.39 % (block 20 px: the moths' orange glow cores), lilac and mint ≈ 0. No block ≥ 24.
  - `measure.py light`: L 0.126, C 0.191, **dark** (poster: L 0.121, dark).
- **couldn't make / caveats:**
  - The moths' glow is the game's own `#FF7A2B` hostile glow, which sits near ember (ΔE 10.7). It is only small glows (≤ 7 px ember), never a block.
  - The final was rendered before I added random-stream saving to `still.js`. Re-running the `ferrum` setup today gives a near-identical but not pixel-identical frame.

### result-still.png (1600×352)

- **file:** `bug/result-still.png`
- **shows:** Nacre wakes. Its heart, the Bell of Nacre, has just been broken on top of the droplet. Its pearl-chrome shards are still settling around the droplet, which stands at the centre with its eyes on us. The colour-flood ring the game sends out from where the heart fell runs across the pearl world as an iridescent band.
- **made by:**
  - Rendered from the game. A real journey on Nacre: the bot harvests, the director warns, and the Bell rises.
  - The Bell is moved 0.4 units in front of the droplet and given its killing hit through the game's own `hitEnemy`. That runs `bossDefeated`: `grandWave` (u_bl[0] ring in the planet shader), the bell debris, the matter burst, the vacuum and the joy.
  - The frame is 1.93 s into the wave (front ≈ 21 units out across the 17-radius world, the ring glow still on the visible hemisphere).
  - Camera in front, 14 units out and 6.5 up, fov 0.34. The poster's back-left light. Other worlds, the Eclipse rays and decor hidden for a clean sky.
- **agent:** stills
- **check:**
  - Session-result mock (`work/stills/mock-result.png`, modelled on reference 14) with a headline above and numbers, an achievement tile and Play below. The subject sits inside the middle 720×352 (box drawn on the mock). The dark flanks take overlaid words.
  - `guard.py`: lilac 0.38 % (largest block 11 px: the lit pearl ground), ember, sun and mint 0. No block ≥ 24.
  - `measure.py light`: L 0.177, C 0.042, **dark**.
  - No text or numbers in the picture.
- **couldn't make / caveats:**
  - **The awakening is subtler in the real build than the plan line suggests.** When the heart falls, Nacre is already at wake 0.8, because harvesting has brought most of its colour back. So the flood shows mostly as the travelling glow ring (`wring`), an iridescent band, and not as grey turning to colour. I kept the real values; I did not mute the world to fake the contrast.
  - Seen from straight above (where the ring reads as a full circle), the pearl ground fills the plate with near-lilac pinks (guarded blocks up to 30 px). So I chose the low front view, where the ring reads as a band crossing the world.

### gallery/01.png … 06.png (1600×800) + captions.json

The order tells the game: core loop → second mechanic → a place → a character → the glide → the payoff. Six different places and scales: Nacre, Hydrargyra, Cathedra (whole world), Ferrum with its heart, open space, and the Eclipse. None repeats the poster (the droplet floating over Nacre facing the Eclipse). No text, arrows or badges were added, and the game's HUD is not drawn.

- **01 core loop**
  - **shows:** On Nacre, the droplet fires glowing beads into a swarm of pearl mites and chrome tumblers. Matter from three mites it has just broken (killed with the game's `hitEnemy`, dropped by the game's `dropMatter`) flies back into it.
  - **made by:** A real Nacre journey (bot 5 s, form 4). The swarm is spawned with `spawnEnemy` 6–9 units ahead. The droplet auto-fires by itself for 0.38 s. Long lens, low and to the side. The world's decor is hidden for a clean ground.
  - **light:** mid, L 0.287.
- **02 second mechanic: a grown body**
  - **shows:** On Hydrargyra, a CHIMERA-stage droplet (form 13, gold halo) carries real evolutions: Shard Crown 2, Lens Wings 2, Prism Eye 2, Quicksilver Spines, Shatter Bloom and Kaleidoscope (prism ring at its feet). It fights between two hydras.
  - **made by:** Built with the game's own `recomputeStats` path (as in `video/cap.js`). The bot plays the mercury sea for about 12 s. The camera is turned to the nearest foe.
  - **light:** mid, L 0.212.
- **03 a place**
  - **shows:** A wide view of Cathedra, the glass garden: the glass world under its glass ring band, crystal spires (its refracting prisms), three jellies, and the droplet small but findable at the centre of the 4:3.
  - **made by:** A real Cathedra journey (bot 8 s). The droplet is placed 3.4 units from a prism cluster with three jellies spawned ahead, then 0.36 s of play. High camera behind, fov 0.8.
  - **light:** dark, L 0.168.
- **04 a character**
  - **shows:** On Ferrum Dunes, the Lodemother (gold chrome rings around a magnetic core, red and cyan poles) rises over the droplet, which faces up at her.
  - **made by:** A real Ferrum journey: harvest done, the director spawns the Lodemother. She is moved 8 units in front of the droplet and plays 0.4 s of her own AI. Camera low over the droplet's shoulder, looking up at her.
  - **light:** dark, L 0.165.
- **05 the glide**
  - **shows:** After the launch from Nacre, the droplet glides through one of the rings of light the game lays toward the next world (Cathedra), with the next rings leading on.
  - **made by:** A real launch: `startLaunch` → `enterSpace`. The game's own space autopilot (bot) flies until the droplet is inside a hoop (stepped at 1/480 s to catch the crossing). Camera behind and above the hoop.
  - **light:** dark, L 0.154.
- **06 the payoff**
  - **shows:** At the Eclipse, the droplet has become a star, its final form (glass line: "The Prism Cathedral"). Rays burst out of it, and the worlds it woke circle it on gold orbits.
  - **made by:** A real finale: a late build on Umbra, the Eclipse given its killing hit (`hitEnemy` → `bossDefeated` → `startFinale`). The game's own hold-to-absorb and phase 2 run, captured 3.4 s into phase 2 with the game's own finale camera.
  - **light:** dark, L 0.092.
- **agent:** stills
- **check:**
  - **Contact sheet** `work/stills/contact-gallery.png`: each slide at 100 px wide, its central 4:3 crop, and the full slide with the 4:3 box and the 26 px line. Every subject sits inside the central 4:3. At 100 px:
    - 01 (droplet and beads), 02 (haloed droplet), 04 (gold rings and droplet), 05 (ring of light) and 06 (star) read clearly;
    - 03 reads as the glass world, with the droplet findable only from about 240 px up.
  - **`guard.py`** (largest solid block): 01 lilac 20 px; 02 sun 21 px / lilac 16 px; 03 lilac 17 px; 04 sun 18 px / ember 11 px; 05 sun 12 px; 06 lilac 7 px / sun 7 px. No guarded block ≥ 24 on any slide.
  - **Bottom 26 px** (`work/stills/zone.py`, guard.py's maths): 01, 02, 04, 05 and 06 have 0 guarded pixels. 03 has 5 px, see the caveat below.
  - **`captions.json`** written. Captions are 43–57 characters (all ≤ 60), and the alt text says what happens.
- **couldn't make / caveats:**
  - **03:** Cathedra's own contour-line colour is `#C7A6FF` (ΔE 4.7 to lilac). Five isolated pixels of the globe's outline hairline (ΔE 9–12) touch the bottom-left of the 26 px strip. That is two 1–3 px line fragments, no block. More than a dozen reframings did not reach zero without losing the world.
  - **03:** The droplet is seen from behind there (wings and crest), as the place is the subject.
  - **04:** The Lodemother's gold rings are her own chrome `#FFE0B0` lit by the key. They show as sun-near glints (≤ 18 px), never a flat block, and they don't mean "earned".
  - **06:** The gold orbit lines are the game's halo gold `#FFD27A` (a Perlune guarded colour), drawn as thin rings only.

## Choices

- I wrote my own capture script (`still.js`) instead of `render.js`. Real moments need the game to keep running between captures (the bot, the director, timers, a boss's death, the space glide, the finale), and `render.js` resets the scene on every view.
- Every "staging" step uses the game's own functions and positions (moving a spawned foe or a heart closer, pausing the bot, turning the droplet to a foe). Nothing is drawn that the build does not draw.
- The light band is dark on everything except slides 01 and 02 (mid). The pass has no light-on-light pairs.
