# Pass group notes (pictures 10, 11, 12, 13) · agent: pass

Pass **"Pearl Orbit"**, step unit **a world woken**. These are design pictures only: no price, no count, nothing declared, game files untouched.

Every picture here is rendered by the game's own WebGL2 renderer: the shipped build `/home/claude/sivver/dist/perlune.local.html`, driven headless through `/home/claude/passB/tools/render.js`.
- The cosmetic looks are **proposals**. They are drawn at render time inside the page through render.js `js` hooks; the game's files were never edited.
- Each hook wraps `drawCreature` for the length of one call. While it runs, it either swaps a material or colour on one of the game's own `Mesh.put` calls, or draws extra parts with the game's own meshes and materials (`M.ring`, `M.torus`, `M.ball`, `M.oct`, `M.gem0`, `MAT.PEARL`, `MAT.GLOW`), the game's `FX.strip` and `drawSunburst`. When the call ends it puts everything back.
- Code:
  - builders: `/home/claude/passB/work/pass/pv.py`;
  - finals: `final_rewards.py`, `final_tile.py`, `final_marker.py`;
  - the rail mock: `railmock.py`, in the same folder.
- Every final was rendered at 2× (the marker at 8×) and reduced with Lanczos, or a box filter for the marker.
- Every final was rendered **after** the coordinator's render.js fix that resets post settings per view. My views never changed bloom, exposure or saturation, and they set `neb` themselves.

## Choices

**The three tiers are three places in the game:**
- free = the plain night sky;
- pass = Nacre's woken pole, its pearl limb glowing, "a world woken";
- bug.pass = the Eclipse's own dark with its corona.

They read as tiers at 120 px: dark and empty, then a bright pearl world, then a black disc in a thin warm ring. See `rail-mock.png`.

**Rewards are opaque.** Each one is rendered over its own row's ground scene, from the same kind of camera. The tier shows whether or not the platform draws the ground PNG under it. Nothing is dimmed or veiled.

**The Eclipse stays a thin glow** (guarded amber `#FFB52E` and violet `#B28CFF`). For the bug.pass scenes:
- Umbra's two corona atmospheres are drawn with a steeper falloff (power 16 and 10) and at 0.42 and 0.3 of their strength, so each is a thin ring;
- the inner violet rim is drawn at 0.2 of its strength;
- the disc is drawn with the game's own `dim` factor at 0.15 (the game dims locked worlds the same way);
- the sunburst is at 0.1.

guard finds no sun-guarded pixels in `ground-bug.png`.

**No gold on any reward.**
- `prism-halo` replaces the Chimera's gold torus. The new halo is six thin `M.ring` GLOW rings: `#FF5C9A`, `#FF9AD5`, `#FFF6FA`, `#9FF6FF`, `#5FF3FF` and `#6A8CFF` (measure.py: none guarded).
- The eclipse eyes' rims are warm white `#FFF4E6`, not amber.

**Staying clear of the "Five Tiny Worlds" look.**
- **Ringlet:** the ring of pearls never crosses the face. It is a tilted orbit that passes behind the head and in front of the lower body, on a dark sky over a magenta world. The droplet is pearl-white, not purple, and the ground is not pink.
- **Tile:** Nacre's rings arc across the sky behind the droplet, as seen from the world's surface. No ringed planet is drawn as an object, and no planet has a face.

**The game's display face is missing, so the tile has no lettering.**
- `/home/claude/video/fonts/TiltPrism.ttf`, `Syne.ttf` and `MartianMono.ttf` are 378-byte JSON error stubs: the download failed with "Host not in allowlist".
- Google Fonts, GitHub raw and npm are all blocked from this machine.
- Lettering "Pearl Orbit" in any other face would not be the game's own, so the tile carries the name through its picture (Nacre's pearl ring, the orbit). The platform prints the pass name under the tile.
- **For the lead:** a lettered variant is a few lines of PIL once a real `TiltPrism.ttf` exists. This also affects anyone doing the title lockup or the share card.

**The marker** is Nacre's matter gem, exactly as `drawPickups` draws it: `M.gem0`, `MAT.GLOW`, Nacre's matter colour `#FFC6EA ×2.2`, the same spin axis. measure.py: `#FFC6EA` is lilac caution 16.6, not guarded.
- **next:** emission 1.0, two after-images a little behind in the spin (the game's dash-ghost idea), and a small star glint. The glint is built the way the Nova star is built: two crossed `M.oct` GLOW plus an `M.ball`.
- **held:** the gem a little smaller and calmer (emission 0.8), settled into a small pearl ring (`M.torus`, `MAT.PEARL #FFF2FB`) and seen from above.
- **Alpha:** each pose is rendered on black, plus a flat-white matte pass of the same shapes. Solid parts get alpha 1; the glow gets an additive alpha (its brightest channel). The result is reduced 8×8 in premultiplied space.
- Nothing in either pose counts or holds a number.

## Pictures

### `bug/pass/tile.png` (400×400)
- **shows:** the droplet floating over Nacre's woken pole, with Nacre's own pearl rings (the game's ring dust and pearl chunks) arcing across the night above it: the pearl orbit.
- **made by:** rendered from the game.
  - Title-state staging over Nacre's pole, lift 1.6; camera elevation 0.5 rad, azimuth 0.4 (looking toward the high side of the tilted rings); `ownRings` true; upper-left key.
  - Sky contour lines held at 0.015 so the top corners stay calm.
  - 800×800, reduced to 400.
- **agent:** pass
- **check:**
  - Previewed at 40, 80, 120 and 169 px (`work/pass/tile-sizes.png`). It reads at 40 as a white bead with two eyes on a magenta world under a pale arc.
  - Top corners are dark sky: guard top zone 0.00% for all four colours.
  - guard on the whole tile: lilac 0.47% (largest block 4×4), mint 0.02% (1×1), ember and sun 0.
  - Seen beside the poster (`poster-vs-tile.png`): same finish and same droplet.
- **couldn't make / caveats:** no lettering, because the game's display face isn't on this machine (see Choices). The rings' second band carries a little of Nacre's own lilac and cyan dust (in game colours); it stays thin dust.

### `bug/pass/ground-free.png` (306×243)
- **shows:** the plain night with faint contour lines (the game's sky and its neon contour lines) and a few dust stars. Nothing else.
- **made by:** rendered from the game: title-state camera looking away from the Eclipse, with no worlds, no creature, `neb` 0.05 and an upper-left key.
- **agent:** pass
- **check:**
  - guard: all four colours 0.00%.
  - On the rail mock with mint check and lilac outline: both read clearly.
- **couldn't make / caveats:** none.

### `bug/pass/ground-pass.png` (306×243)
- **shows:** Nacre woken, seen from just above its pole. The pearl limb crosses the middle with its iridescent film and pink contour line, under the night: "a world woken".
- **made by:** rendered from the game: Nacre's pole, lift 2.4, camera elevation 0.55 rad, no creature, woken (`wake` and `awake` = 1), no decor.
- **agent:** pass
- **check:**
  - guard: lilac 0.01% (1×1), the rest 0.
  - The lilac selected outline stays distinct from the world's magenta and violet on the rail mock.
- **couldn't make / caveats:** none.

### `bug/pass/ground-bug.png` (306×243)
- **shows:** the Eclipse's own dark: Umbra's disc darkened, a thin amber corona ring, a thin violet rim and faint rays.
- **made by:** rendered from the game: telephoto (fov 0.22) from beyond Nacre with the Eclipse straight behind, plus the thin-corona staging described above. Backlit key, as in the poster.
- **agent:** pass
- **check:**
  - guard: all four colours 0.00%. The corona's amber stays a thin glow below the guard.
  - On the rail mock with the platform's sun outline: the outline stays the strongest warm line, and the corona sits well inside it.
- **couldn't make / caveats:** none.

### `bug/marker-next.png` (48×48, RGBA)
- **shows:** Nacre's matter gem mid-spin, with faint after-images and a small star glint.
- **made by:** rendered from the game: `M.gem0` / `MAT.GLOW` / Nacre matter colour, glint from the Nova's crossed `M.oct`. Rendered at 384 with a matte pass, reduced to 48. Alpha on the border is 0.
- **agent:** pass
- **check:**
  - Previewed riding over the next cell on the cell rail (`rail-mock.png`) and on a 30-cell step strip at 48 and 24 px (`rail-compact.png`).
  - 4× hard pixels on night and on linen (`marker-zoom.png`).
  - guard on night: 0.00% for all four colours.
- **couldn't make / caveats:** drawn for the dark page. On linen the white-pink gem is pale.

### `bug/marker-held.png` (48×48, RGBA)
- **shows:** the same gem settled, calmer, into a small pearl ring.
- **made by:** rendered from the game: `M.gem0` GLOW plus `M.torus` `MAT.PEARL`, with a matte pass, reduced to 48.
- **agent:** pass
- **check:**
  - Previewed sitting on the last earned cell on the rail mock and on the step strip at 48 and 24 px.
  - guard on night: lilac 0.09% (1×1), the rest 0.
- **couldn't make / caveats:** pale on linen, as above.

### `bug/pass/mote-trail.png` (306×243, free)
- **shows:** the droplet looking ahead, with a few hot-pink dust motes trailing behind it in a loose curve.
- **made by:** rendered from the game. The motes are drawn exactly as the game draws its motes (`M.oct`, `MAT.GLOW`, `#FF5C9A`), seven of them, getting smaller and dimmer, each turned on its own axis. Free sky ground, upper-left key.
- **agent:** pass
- **check:** reads at 120 px (`s27.png`). guard: lilac 0.14% (2×2), the rest 0.
- **couldn't make / caveats:** a proposed look, made at render time.

### `bug/pass/pearl-crest.png` (306×243, free)
- **shows:** a close-up of the droplet's head with its crest in pearl.
- **made by:** rendered from the game. The crest's own `M.oct` call is swapped from `MAT.GLASS #9FF6FF` to `MAT.PEARL #FFF2FB`. The crest is drawn at the Chimera's crest height (1.75×, the game's own taller crest) so it reads at 120 px.
- **agent:** pass
- **check:** reads at 120 px. guard: lilac 0.21% (4×4); caution 23% from the pearly lavender-white sheen, but no blocks.
- **couldn't make / caveats:** at the bare droplet's own crest size the crest did not read at 120 px, hence the taller crest. Say so if the look should keep the small crest.

### `bug/pass/nacre-skin.png` (306×243, pass)
- **shows:** the droplet with a mother-of-pearl body (milky, with a pink, green and cyan film), floating over Nacre's woken limb.
- **made by:** rendered from the game. The body's own `M.sphere` call is swapped from `MAT.LIQUID` to `MAT.PEARL`, tint `#FFF2EE`, film offset 0.3. That offset was picked out of four for the least lilac.
- **agent:** pass
- **check:** reads at 120 px. guard: lilac 0.30% (4×4), mint 0.93% (3×3, the green of the film at the rim).
- **couldn't make / caveats:** a proposed look.

### `bug/pass/prism-halo.png` (306×243, pass)
- **shows:** the Chimera (glass mantle, tall crest) with its halo split into a ring of colours, over Nacre's woken limb.
- **made by:** rendered from the game, form 11. The gold `M.torus` is replaced by six thin `M.ring` GLOW bands, as above.
- **agent:** pass
- **check:** reads at 120 px. guard: lilac 0.38% (3×3). No gold.
- **couldn't make / caveats:** a proposed look. The halo exists only from the Chimera stage, so the picture shows the Chimera.

### `bug/pass/ringlet.png` (306×243, pass)
- **shows:** a small tilted ring of pearl dust and beads orbiting the droplet, over Nacre's woken limb.
- **made by:** rendered from the game: `M.ring` plus 34 `M.ball`, all `MAT.PEARL #FFF2FB` in mixed sizes, drawn after the creature in its own frame.
- **agent:** pass
- **check:** reads at 120 px. guard: lilac 0.82% (4×4).
- **couldn't make / caveats:** a proposed look. Composed away from the "Five Tiny Worlds" ringed-face look (see Choices).

### `bug/pass/eclipse-blink.png` (306×243, bug.pass)
- **shows:** the emote. The droplet's face in front of the Eclipse, its two eyes become two tiny eclipses: round dark discs with a thin bright rim and a small corona of rays.
- **made by:** rendered from the game, on the bug.pass ground's camera.
  - The eye discs (`BLACK`) are made round, 1.35× (like the game's joy widening), and lifted onto the body's surface.
  - The catchlights are left out.
  - A thin `M.ring` GLOW rim (`#FFF4E6`) and a tiny `drawSunburst` (the game's own Eclipse rays) are drawn around each eye.
- **agent:** pass
- **check:** reads at 120 px as two small eclipses. guard: lilac 1.79% (7×7, the body's lavender sheen at the rim), the rest 0.
- **couldn't make / caveats:** a proposed look. It is one held frame of a moment, not an animation.

## Checks run (summary)
- guard.py on all 12 files.
  - No ember or sun anywhere.
  - The largest guarded block anywhere is 7×7 px (lilac sheen on chrome), well under 24×24.
  - The markers on the night page are clean.
- The rail mock (`/home/claude/passB/work/pass/rail-mock.png`) shows three rows × six steps with:
  - the platform's mint owned checks;
  - the lilac selected outline;
  - the sun bug.pass outline;
  - the marker in both poses.

  The tiers and all three states read clearly.
- The compact 30-cell strip (`rail-compact.png`) shows the marker at 48 and 24 px.
- The tile at 40, 80, 120 and 169 px.
- The rewards at 120 px (`s27.png`).
