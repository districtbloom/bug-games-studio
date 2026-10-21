# Caracolina · style sheet (stage 1)

A gentle, strange seaside town painted in gouache and coloured pencil, at the hour the light is low, with paper people and broken-tile mosaic.

## Reference frames (all from the game itself)

| | Frame | What it fixes |
|---|---|---|
| A | Key art: the sunset over the sea (the cover's picture) | The hour and the light. Violet clouds on gold, cobalt water, the floating rock, El Caracol's spiral stair, a confetti of roofs |
| B | Title card: the trailer's end frame | The lettering. Caprasimo wordmark in cobalt with a white tile outline; the "o" is the coral shell spiral; a Kalam line; oxblood caps |
| C | Aurora at her easel | The people. Paper cut-outs painted on both sides, one big eye, a white paper edge |
| D | The garden of eyes | The strangeness. A broken face you can stand inside, painted eyes, a checkerboard floor, hard shadow |
| E | The Festival of the Shell at night | Night, the free-colour palette. Navy and violet, the moon, dotted fireworks, the paper crowd |
| F | Aurora's card in the game's interface | Paper. A sketchbook card with faint cobalt rules and torn edges: the name in Caprasimo, the line in Kalam |

All six are real renders with the real fonts, from the key art, the trailer, the in-game prints and the phone films.

## Rules

**Line.** Coloured pencil in ink `#1d1a33`: a dark edge on silhouettes and creases, 1.2–2 px on small marks, never an even vector stroke. Shade sides get pencil hatching at about 38°, ink at 30–40 %, never cross-hatched to black. Edges are hand-cut with a slight wobble; only the eggs and the shell spiral are true curves.

**Fill.** Gouache: opaque flat colour in 2–3 values per surface (lit, mid, shade) with hard edges, plus dry-brush streaks on the lit face. No airbrush gradients except the sky, and the sky is painted in bands. Trencadís: broken tiles in grey mortar `#c4c0b8`, irregular pieces, a glaze glint on some. People: flat cut-outs painted on both sides.

**Texture.** Paper grain on everything at low strength; brush grain on walls; mosaic on benches, towers and frames. What is not yet painted is graphite pencil on paper (the game's opening). The sketchbook page is paper `#f3ead7` with faint cobalt rules at 10 %.

**Light.** A low sun from one side, long shadows, warm lit faces against cool cobalt shade. Two hours define the world: sunset (18:45–19:00) and festival night (21:30–22:00). Small marks use the blue hour (cobalt to violet, one pale line of last light), so they stay clear of the platform's sun.

**Lettering.** The wordmark is Caprasimo, cobalt `#2a55b8`, with a white tile outline `#fbf8f1`, a soft ink drop and the coral shell spiral for the "o". It appears only on the title lockup, the share card and the cover. Hand lettering is Kalam in ink on torn paper strips. Caps are Alegreya Sans ExtraBold in oxblood `#8e2a22`, for stamps. No lettering on the poster, on any plate that can shrink below ~200 px, or on small marks.

**Never.**
- Coral, lemon, brass or sunset gold as a flat fill, or near Play, a price or a selected state. Gold never means "earned".
- Numbers in art.
- Glow fog, lens flares, chrome or bevelled UI, sticker outlines.
- Weapons, violence, horror.
- Photo textures, real people's faces, another game's anything.

## Palette, measured (`tools/measure.py colour`, ΔE2000 to ember · lilac · sun)

| Hex | Name | Role | Reading |
|---|---|---|---|
| `#1d1a33` | Ink | pencil line, lettering ink, the eggs | ember 54.1 free · lilac 62.7 free · sun 83.5 free |
| `#2a55b8` | Cobalt | wordmark, doors, tiles, lit sea | ember 50.7 free · lilac 36.7 free · sun 69.4 free |
| `#234f96` | Sea | evening water | ember 51.5 free · lilac 41.6 free · sun 68.6 free |
| `#172d4e` | Night sea | deep water, night | ember 54.3 free · lilac 58.6 free · sun 78.6 free |
| `#4b4f8f` | Dusk | blue-hour sky band | ember 47.7 free · lilac 38.1 free · sun 66.7 free |
| `#7d6f98` | Dusk violet | clouds, far haze | ember 37.1 free · lilac 24.4 free · sun 53.5 free |
| `#9c4426` | Brick | the rock on small marks (their one hot colour) | ember 22.2 free · lilac 49.3 free · sun 45.1 free |
| `#5e2a22` | Brick shade | shade sides, hatched | ember 36.7 free · lilac 60.3 free · sun 63.6 free |
| `#1f6b5a` | Viridian | cypress, pines | ember 57.3 free · lilac 46.8 free · sun 50.5 free |
| `#19ac8e` | Turquoise | courtyard walls, tape, tiles | ember 61.8 free · lilac 39.6 free · sun 40.5 free |
| `#8e2a22` | Oxblood | stamps, caps labels | ember 28.3 free · lilac 53.7 free · sun 55.6 free |
| `#6a3a8a` | Plum | shutters, tiles, house in shade | ember 46.5 free · lilac 41.6 free · sun 72.2 free |
| `#f3ead7` | Paper | sketchbook page, notes | ember 37.0 free · lilac 33.6 free · sun 20.8 free |
| `#fbf8f1` | Tile white | houses, wordmark outline | ember 38.7 free · lilac 29.4 free · sun 25.2 free |
| `#c4c0b8` | Mortar | grout between broken tiles | ember 31.6 free · lilac 26.9 free · sun 23.7 free |
| `#df8029` | Rock orange | the rock in sunset light (scene art only) | ember 16.4 **caution** · lilac 46.5 free · sun 22.2 free |
| `#eab583` | Sky peach | sky above the gold (scene art only) | ember 24.4 free · lilac 39.7 free · sun 13.4 **caution** |
| `#c49a8c` | Dusk rose | haze on islands (scene art only) | ember 19.9 **caution** · lilac 29.1 free · sun 26.3 free |
| `#e8653a` | Coral | the shell "o", traveller tops: lockup, cover, share card only | ember 4.3 **GUARDED** · lilac 42.0 free · sun 33.8 free |
| `#fac97d` | Sunset gold | the horizon glow: painted light, never a fill | ember 31.9 free · lilac 46.3 free · sun 6.1 **GUARDED** |
| `#f2d06b` | Lemon | straw hats, lemons, sheets: inside scenes only | ember 39.0 free · lilac 52.2 free · sun 4.8 **GUARDED** |
| `#d9b24a` | Brass | the in-game shutter: never in platform art | ember 34.9 free · lilac 51.8 free · sun 7.5 **GUARDED** |

**What it means.**
- Small marks and anything that sits beside Play, a price or a selected state use **free colours only**: icon, emblem, chip, store items, pass rewards, markers, seals.
- Caution and guarded colours live only inside scene art (poster, stills, backdrops, banners) as painted light, never as a flat fill.
- In the 2:1 poster they are kept out of the lower two-thirds of the right edge, where the hero's Continue sits.
- The game's signature coral is guarded, so the platform `accent` I'd propose is cobalt `#2a55b8`, not coral.

## Pilots

| Pilot | File | Notes | Readings |
|---|---|---|---|
| Poster master | `art/poster.png`, 2400×1200 | A new 2:1 render in the key art's light, framed for the plate. No lettering. Focus (0.47, 0.45) | `L 0.441 C 0.352 mid`. Guarded pixels 11.2 %, all in the sky band and lit faces; the lower right edge is sea (free). Squint test at 90×70: an orange cone with a house on it |
| icon-46 | `art/icon-46.png`, 92×92, + `.svg` | Drawn for 46. The rock (brick), the white house with a cobalt door, the black egg, a cypress, a blue-hour sky | Per pixel: guarded 0.00 %, caution 0.48 % (lilac-side anti-alias) |
| Store item | `store/store-trencadis-frame.png`, 400×400 | "Trencadís frame": your prints come out framed in broken tile. A PROPOSAL: the game has no print frames yet. The print inside is the rock on festival night | Per pixel: guarded 0.02 %, caution 0.65 % (anti-alias) |

How they were made: the poster and the print inside the frame are new engine renders of Caracolina in the key art's camera and light. The key art itself is an engine render; the game's shaders are the gouache and pencil. The icon and the frame are drawn as SVG (pencil line, gouache bands, hatching, Voronoi-cut tiles) and rasterised in Chromium.
