### bug/backdrop.png
- Shows: Caracolina's bay at rest at 19:45, looking east, away from the sunset. It is open water out to the far headland and island, with the evening's violet sky and its peach horizon band. The clouds are lit from behind the viewer by the low western sun, and the moon sits on the horizon. 1440×577.
- Made: rendered from the game. The shot spec is in `B/work/round3/specs_final.json` (entry `backdrop-2x`):
  - hour 19.75; eye [52, −35.3, 146]; looking at bearing 62° (east-south-east), pitch −0.46°; lens 30;
  - rendered at 2880×1154 and downscaled (LANCZOS) to 1440×577.
- Why not the Mirador (the plan): I tried hard. Sheets are in `work/round3/`: `a_sheet`, `b_sheet`, `e_sheet`, `h_sheet`, `j_sheet`, `pano_sheet`, `fl_sheet`; the window maths is in my notes below.
  - The Mirador's only open sea view is the iron rail. That rail looks south-south-east straight at the floating rock, and the lighthouse on legs sits behind it in the distance.
  - The clear window between the rock and El Caracol (the coral tower) is at most about 41° wide. A 2.5:1 frame needs a lens of about 80 mm to fit inside it, and at that lens the Mirador itself drops out of the frame.
  - West is the sun and the great shell (the subject of the Continue still). North is the walls, with Remei and the easel. The east walls catch the sun and render ember-hot (#f63a04, ΔE 4.6).
  - The bay keeps the plan's "sea beyond, in the poster's evening light", with nothing that competes.
- Hour: 19:45, 3 minutes before the poster's 19:48. At 19.8 the eastern horizon band reads ΔE 11–12 to ember, which is guarded, right beside the info rail. At 19.75 it drops to caution. I checked seven view directions and three hours (`sweep/`, `hr/`), so this is a property of the sky, not of the framing.
- Agent: round3
- Check:
  - **Page mock:** `work/round3/final/page_desktop.png`, made with `tools/pagecheck.py` after reference 04. The poster sits in the left 8/12 of the 1280 column with a 6 px ink seam and the rail on the right.
    - The poster leads: its bright sunset sits against a dusky backdrop.
    - The backdrop's horizon lines up with the poster's horizon, so the bay runs on past both edges of the hero, and the sea is the floor under it.
  - **guard2:** guarded 0.0 %, caution 23.6 %; bottom 16 %: 0 / 0.
  - **Next to the info rail** (`tools/railguard.py`): right margin guarded 0.0 % (caution 24 %, the peach horizon band); top band over the rail 0 / 0; bottom band 0 / 0.
  - **Largest solid guarded square** (`tools/blockcheck.py`): ember 1 px; sun, lilac and mint 0.
  - **measure.py light:** L 0.357, C 0.306, mid. The poster is L 0.526, light, so the backdrop sits one band below it.
  - No text. No lighthouse, rock, shell or people: the lighthouse and pier are 127° behind the camera.
- Couldn't: a wide Mirador frame without the rock, the far lighthouse or the coral tower (see above).

### bug/backdrop-phone.png
- Shows: the Mirador del Blau at 19:45: the iron rail and its telescope, the trencadís bench, the sea beyond, peach-lit clouds, and the blue-wave mosaic floor (in shade) filling the lower 60 %. 390×826.
- Made: rendered from the game. The spec is `backdrop-phone-2x` in `specs_final.json`:
  - hour 19.75; eye [2.5, −2.9, 35.5]; bearing 41.5°, pitch −12°; lens 26;
  - rendered at 780×1652 and downscaled.
- The window: the tall frame (±12.3°) fits between the rock's ladder (26° away) and El Caracol, which the green treetop hides. The lighthouse, rock, shell, Remei and Tinta are all out of frame.
- Composed on its own, not cropped from the desktop, around the phone page:
  - The sky and horizon sit under the 4:3 poster.
  - The rail's bars show in the gap between the poster and the info card.
  - The shaded wave floor is what shows round Continue and below it.
- Agent: round3
- Check:
  - **Phone mock:** `work/round3/final/page_phone.png`; the poster leads.
  - **guard2:** guarded 0.9 %; bottom 33 % (Continue and Play): 0 % guarded, 0 % caution.
  - **Largest solid guarded square:** 17 px (ember), on the telescope's sunlit brass head at (139, 223). That spot is under the poster on the page and far from any control.
  - Ember specks in the sunlit floor patch sit under the info card.
  - **measure.py light:** L 0.308, C 0.253, mid.
- Note for the lead: desktop and phone are different places (the bay, and the Mirador). If you want them to match, an alternate bay phone backdrop is at `work/round3/final/alt-backdrop-phone-bay.png` (0 % guarded, L 0.306). Its mock is `final/phone_sheet.png`, the right pair.
- Couldn't: —

### bug/poster-9x16.png
- Shows: the poster's one image recomposed for 9:16: the lighthouse on legs straddling the setting sun, alone in the bay. 1080×1920.
  - The lighthouse is a little right of centre (x 0.60), from cap y 0.245 to feet y 0.675.
  - The violet-to-pink-to-yellow sky takes the top quarter, the island is whole on the left and the pier is on the right.
- Made: rendered from the game. The spec is `poster-9x16-b` in `specs_final.json`:
  - the same hour and camera as the poster: 19.8; eye = c − d·130 with y −35, where d = `lightAt(19.8).sunDisc` and c = [24, −20, 159];
  - lens 34 (the poster uses 40) for a taller frame and a bigger subject;
  - the look is solved so the lighthouse sits at x 0.60 and the horizon at y 0.62. I chose x 0.60 so the cove's dome rock leaves the right edge instead of being sliced by it.
  - It is not a crop: the 2:1 poster has neither this lens nor this vertical extent.
- Agent: round3
- Check:
  - **Side by side** with the 2:1 poster: `work/round3/final/compare_poster_9x16_share.png`. Same image, same light, same register.
  - **Bottom:** the bottom 20 % is soft sea-path water with no objects. guard2 for the bottom 20 % reads 0 % guarded, 30 % caution (the pink path).
  - **guard2 overall:** guarded 13.0 %, all of it the sun's glow round the disc (the poster is 11.5 %).
  - **Largest solid guarded square:** sun 247 px (the glow), ember 4 px.
  - **measure.py light:** L 0.674, C 0.281, light. The poster is L 0.526 and the 2:3 is 0.616. It runs lighter because the tall frame holds more of the bright sky and sea path.
- Couldn't: —

### bug/share-card.png  (+ work/round3/share-card-art.png, the same file; work/round3/share-card-art-2400.png at 2×)
- Shows: the poster's lighthouse on legs over the sun at x 0.71, cap y 0.10, feet y 0.80, with the island, pier and cove on the right. The upper left 45 % is plain pink-to-peach evening sky, ready for the title. The bottom 18 % is sea only, quiet for the linen bar. 1200×630.
- Made: rendered from the game. The spec is `share-2x-1975` in `specs_final.json`:
  - the poster's camera line (eye = c − d·130, y −35); lens 54; the look solved for lighthouse x 0.71 and horizon y 0.71;
  - rendered at 2400×1260 and downscaled.
  - Hour 19.75, not 19.8: at 19.8 the sunlit face of the far headland at the lower left measures as an ember block (42 px). The share card must never carry ember. At 19.75 the largest ember block is 1 px, and the image is otherwise the same.
- No title lettering. The game's fonts are not in this sandbox; the lead composites the title over the plain upper-left sky (about x 0.04–0.48, y 0.08–0.42).
- Agent: round3
- Check:
  - **At 270 px:** `work/round3/final/share_270_check.png`, with a mock linen bar. The lighthouse and sun read clearly and the title area is clean.
  - **guard2:** bottom 18 %: 0 % guarded. Overall: 19.2 % guarded, all sun glow (the same register as the poster).
  - **Largest solid guarded square:** ember 1 px; sun 176 px (the glow).
  - **measure.py light:** L 0.63, C 0.314, light.
  - No player names, no ember.
- Couldn't: a fully empty left 45 %. The poster's far headland (about 26° left of the lighthouse) stays in the lower-left corner (x < 0.17, y 0.41–0.72) at every lens that keeps the lighthouse under about 75 % of the frame height.
  - A darkened-left variant made it muddy (`work/round3/share_dk_sheet.png`), so I left the art as rendered. The title fits above the headland.

### Tools and specs (work/round3/)
- `specs_final.json`: the five final shots, including the alternate.
- `tools/render.js`: `B/tools/render.js` with a longer page-load timeout. The original timed out at 30 s while other agents rendered.
- Check scripts:
  - `tools/pagecheck.py`: the page mocks;
  - `tools/railguard.py`: the guarded share in the margins beside the rail;
  - `tools/blockcheck.py`: the largest solid guarded square;
  - `tools/embermap.py`: where the ember pixels are.
