### poster.png · poster-2x3.png · poster-1x1.png · publish.json

**Files**

| file | size |
|---|---|
| `poster.png` | 1600×800 |
| `poster-2x3.png` | 960×1440, recomposed |
| `poster-1x1.png` | 1200×1200, recomposed |
| `publish.json` | `{"focus": {"x": 0.60, "y": 0.50}}` |

**What it shows:** "A droplet faces the Eclipse." The bare droplet (the first stage, before any mantle or halo) floats in the dark, turned up-left toward the Eclipse, the only light in the picture.
- The Eclipse is upper left: a dark disc with amber contour veins, its amber ring, violet aura and faint rays.
- The droplet's rim and highlight band are lit from the Eclipse's side.
- The ground is the game's night sky, with its contour lines at a whisper and the title screen's pink and cyan dust around the droplet.
- Register: stage. Inks: night, pearl, the Eclipse's violet and amber.

**How it was made:** rendered by the game's own WebGL2 renderer, driving the shipped build headless (`tools/render.js`).
- Staging: the game's title-screen staging (`titlejs`). The creature floats 5.5 units above Nacre at title scale 1.0, exactly as on the real title screen. The camera is posed so the Eclipse (Umbra, at the centre of the system) sits upper left.
- Scene: other worlds and ring dust hidden for a calm plate; the Eclipse's rays at 0.2 strength.
- Finish:
  - the game's bloom and anamorphic streaks;
  - grain 0.01;
  - depth of field 0.55;
  - no vignette (`vig 0`);
  - key light turned to come from the Eclipse's side, `[-0.6, 0.45, -0.55]`.
- Rendered at 800×400 CSS, device pixel ratio 2. Views: `work/poster/poster-views.json`, `tall-views.json` (T2), `sq-views2.json` (S3).
- The tall and square versions are separate renders with their own cameras: the Eclipse above and the droplet below for 2:3, closer together for 1:1. Neither is a crop.

**Agent:** lead.

**Checks**
- **wall.py, every shape:** the No 1 hero, 3.5:1 strip, wide, band, tall, half, column, small and tile, plus 90×70. The droplet and its eyes stay in view in every shape. The Eclipse survives in all but the column and tall shapes, where the droplet alone carries the plate.
- **4:3 crop around the focus** (phone game page): holds.
- **measure.py light:** `poster.png` L 0.121 C 0.061 dark · `poster-2x3.png` L 0.136 C 0.078 dark · `poster-1x1.png` L 0.125 C 0.066 dark (re-rendered one step farther at the check step: its lilac sheen block measured 25×25 and now measures 23×23).
- **guard.py on `poster.png`:**
  - ember, sun and mint: 0 % guarded;
  - lilac: 0.50 % guarded, all of it on the droplet's own lavender top reflection and rim, high in the frame. The largest solid block is 23×23 px, under 24.
  - Bottom 146 px (caption strip plus Play zone): 0 % guarded.
- **Measured readings:**

  | sample | measured | ΔE |
  |---|---|---|
  | Eclipse amber ring | `#7D4600` | sun 44.6, free |
  | Eclipse aura | `#33205B` | lilac 58.5, free |

  They are darker as rendered than the game's source hexes.
- **Never list:** no lettering, numbers, frame, border or vignette.
- **Corners:** the bottom-left corner (where the stamps sit) is calm: dark sky with faint rays.

**Choices and caveats**
- Nacre's surface, the first ground tried, measured lilac-guarded (pale pearl ground, ΔE ≈ 11.9) right where Play sits. So the poster uses the game's title-screen float, which keeps the world below the frame. No colour of the game was changed to pass a check.
- The poster is not the earlier key art: no title, no rings across the frame, no halo, and the Eclipse sits beside the droplet rather than behind its head.

### updates/metamorphosis.png · updates/metamorphosis-thumb.png (lead redo, replaces the store agent's version)

**Files:** `updates/metamorphosis.png` (1600×800) and `updates/metamorphosis-thumb.png` (308×154, its own render with a closer camera).

**What it shows:** the moment the droplet becomes the Chimera. The gold halo and the tall glass crest have just arrived. A ring of white light runs out across Ferrum's dunes, and the dust lineage's magenta motes and poles are around it.

**How it was made:** rendered by the game.
- **The moment is real:** the game's own `metamorphosis(2)` was called on a form-11 body (dust build: Lodestone Heart 3, Static Veil 3, Iron Swarm 2, Polar Burst 2), then the game ran for 0.6 s.
- **Removed for a calm still:**
  - the full-screen flash, warp and shake;
  - the 70 iridescent particles, which read as noise in a still;
  - the ground flood (`bloomAt`). On every world it woke the ground into large blocks of guarded gold, lilac or mint (up to 64×64 px of sun on Ferrum).
- The ring of light, the halo, the crest and the body are the game's own.
- Views: `work/lead-upd/v5.json` (G2) and `v6.json`.

**Agent:** lead. The store agent's version (`work/store/superseded/`) showed the same moment, but its Lens Wings build read as an aeroplane and the frame cut the droplet off. It was replaced at the bring-together step.

**Checks:**
- Read at 104×52: the halo and droplet read.
- Subject inside the central 4:3.
- guard.py: the largest block is sun 11×11, lilac 10×10, ember 1×1, mint 1×1. The thumbnail's largest is 3×3.
- measure.py light: L 0.178 C 0.153, dark.
- No version, date, NEW or the word "update".

**Caveat:** the world is Ferrum, not Nacre. Nacre's and Cathedra's grounds put large lilac blocks under the rings.
