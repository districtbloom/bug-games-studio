# Perlune · style sheet (stage 1)

Every asset in the package is made new in this look. The board (`style-sheet.png`) shows the frames and the pilots. This file is the text version.

## Reference frames (from the game's own key art, cover and play)

1. **Key art 16:9**: the droplet in front, the Eclipse behind its head like a halo, Nacre's rings arcing across.
2. **Cover with lettering**: title, three-lineage eyebrow, tagline, iridescent button shape.
3. **Key art 9:16**: the same image stacked. Eclipse above, droplet below, horizon at the foot.
4. **Worlds**: tiny ringed planets, pearl-dust rings, contour-line sky, the Eclipse's sunburst.
5. **Light**: the finale star. Emissive cores, sunburst rays, bloom, thin orbit lines.
6. **In play**: a planet surface with banded contour fills, glass shards and dust motes, under the tilt-shift lens.

## Rules

**Line.** No ink outlines, ever. A form is made by light: a bright thin-film rim (fresnel) and a silhouette against night. Lines appear only as light:
- neon contour lines in the sky (thin, glowing, pink / cyan / pearl);
- contour bands on planets;
- ribbons;
- orbit hairlines;
- sunburst rays.

**Fill.** Glossy materials, never flat:
- liquid pearl-chrome for the droplet;
- pearl;
- clear glass;
- obsidian with a coloured rim;
- pure emissive glow.

Every shiny surface mirrors one procedural "studio": a dark violet sky, a cyan band and a pale horizon line. Planets get banded fills that follow the terrain.

**Texture.** Smooth gradients, fine film grain, star specks and dust motes. Nothing else: no paper, hatching, crayon, pixels, halftone or photo texture.

**Lighting.**
- The key light comes from the upper left, behind the viewer, with wrap light on planets.
- Bloom goes on emissive parts only: the halo, eye catchlights, the Eclipse rim and rays.
- Horizontal anamorphic streaks sit on the hottest highlights.
- A miniature lens keeps the subject sharp and the near and far planes soft (tilt-shift or round depth of field).

**Subject and framing.**
- The droplet is always the subject: one round body and two big dark oval eyes, each with one white catchlight. Only the droplet has a face.
- The one image is the Eclipse behind the droplet's head like a halo.
- Worlds are tiny, and a horizon curve is always in reach.
- It is night everywhere, never black-black: void `#05040A` to nebula `#2A0B4D`.

**Lettering.**
- "PERLUNE" is set in heavy geometric capitals tracked +4 %. Its fill is the iridescent sweep: pink → cyan → cream → lilac, with a small cyan / magenta split and a soft violet glow.
- The eyebrow is mono capitals with wide tracking, in the three lineage colours. The tagline is light geometric capitals with wide tracking, in warm white.
- Title lettering appears only where it is allowed (cover, share card, lockup). It never goes on a plate that can shrink below ~200 px.
- Near Play, a price or a selected state, the sweep's cream and lilac stops become peach `#FFC2A8` and violet `#8F6BFF`.
- **Fonts:** the game's own title face (Tilt Prism, loaded from Google Fonts in the build) cannot be fetched in this workspace. Stand-ins:
  - TeX Gyre Adventor Bold for the title, as on the shipped cover;
  - Poppins for Syne;
  - DejaVu Sans Mono for Martian Mono.

## What never appears

- Outlines, flat cartoon fills, pixel art, paper or crayon textures, photographs.
- A face on anything but the droplet. Enemies are faceless sculptures with one hostile glow.
- Text, numbers or prices in stills, seals, tiles or rewards. No HUD or menu chrome.
- Halo gold, eclipse gold or resonance violet as a flat, button-like fill, or within 120 px of Play, a price or a selected state.
- Gold meaning "earned" on a seal.
- Rounded frames; fog or glow over everything; gore.
- Another game's art, characters, names or words.

## Palette

Measured with `tools/measure.py colour` (ΔE2000 to ember `#FF5A36`, lilac `#C4B5FF` and sun `#FFCB57`), always with the `#`.

**Key-art set**: posters, stills, backdrops and banners. The guarded colours appear only as gradients and glows, away from any UI edge.

| hex | role | reading |
|---|---|---|
| `#05040A` | Void, the ground of every plate | ember 55.2 free · lilac 69.1 free · sun 81.4 free |
| `#2A0B4D` | Nebula, sky depth | ember 56.3 free · lilac 62.2 free · sun 90.4 free |
| `#F4F8FF` | Pearl, the droplet's body | ember 40.8 free · lilac 21.4 free · sun 31.1 free |
| `#5FF3FF` | Glass, rims and the glass lineage | ember 59.6 free · lilac 34.2 free · sun 43.0 free |
| `#FF2E88` | Dust, contour lines and the dust lineage | ember 25.7 free · lilac 32.9 free · sun 57.7 free |
| `#FF9AD5` | Nacre, the pearl world and a sweep stop | ember 32.7 free · lilac 18.8 caution · sun 52.2 free |
| `#FF3FB4` | Eclipse magenta, rays and rims | ember 32.4 free · lilac 28.2 free · sun 62.4 free |
| `#FFD27A` | Halo gold, the halo and the chrome lineage | sun 4.1 **GUARDED** |
| `#FFB52E` | Eclipse gold, ring and rays | sun 6.8 **GUARDED** |
| `#B28CFF` | Resonance violet, the eclipse aura | lilac 11.1 **GUARDED** |

**Near-UI set**: icon, emblem, chip, marker, seals, store tiles, pass rewards and lockup. All measured free.

| hex | role | reading |
|---|---|---|
| `#FFC2A8` | Peach-gold, replaces both golds | ember 23.3 free · lilac 32.5 free · sun 21.2 free |
| `#8F6BFF` | Violet, replaces resonance violet | ember 45.0 free · lilac 20.7 free · sun 67.1 free |
| `#FF8FC8` | Pink, replaces Nacre pink | ember 30.8 free · lilac 20.9 free · sun 52.2 free |
| `#9FF6FF` | Pale glass, a sweep stop and highlights | ember 55.0 free · lilac 29.5 free · sun 39.8 free |
| `#FFF6E8` | Warm white, halo core and catchlights | ember 37.9 free · lilac 31.9 free · sun 22.8 free |
| `#7FE8FF` | Clear cyan glass (store look "Glass halo") | ember 54.3 free · lilac 28.8 free · sun 43.5 free |
| `#06030C` | Eye black | ember 55.3 free · lilac 68.9 free · sun 81.9 free |

**Other readings:**
- The iridescent sweep's own stops are `#FF9AD5` (lilac 18.8 caution), `#9FF6FF` (free), `#FFE6A8` (sun 11.2 GUARDED) and `#C9A8FF` (lilac 4.3 GUARDED). They stay on the key art and cover, as gradients and glows, never as flat fills.
- Ferrum's orange `#FF7A2B` measures ember 10.7 GUARDED. It stays inside planet art, never near a button.

## Pilot assets

| file | size | how it was made | light |
|---|---|---|---|
| `art/poster.png` | 1600×800 | Rendered in the game's own engine with a posed camera, a cleared scene and the sky's contour lines at half strength. Finished with a vignette and a plain bottom strip of 52 px (26 px at display size). No lettering. The guarded golds sit in the middle of the plate, more than 15 % in from the right edge. | L 0.177 C 0.079 dark |
| `art/icon-46.png` | 92×92 | Drawn for 46 px: head, two eyes, halo, the Eclipse behind. Made with the game's material maths ported from its shader (studio reflection, thin film, specular) at 8× and reduced. Near-UI set only. | L 0.323 C 0.216 mid |
| `store/store-halo-glass.png` | 400×400 | Look "Glass halo": the halo turns to clear cyan glass at the droplet's third stage. Rendered in the engine on Nacre's ground with the sky quieted. No gold, no lilac, nothing near the price row. Price: UNDECIDED (Q1). The game would have to build this look. | L 0.231 C 0.057 mid |

**Checks by eye:**
- The poster's squint test at 90×70 holds on the silhouette and the Eclipse; the eyes are lost at that size.
- The icon reads at 46 on night and on linen.
- The store tile reads at 40 px and in greyscale.
