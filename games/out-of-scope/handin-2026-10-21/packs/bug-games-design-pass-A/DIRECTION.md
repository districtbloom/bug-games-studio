# The pictures, one by one

Three rounds, made in one go (see START_HERE.md for the order and the fan-out). PLAN FIRST lines go into NOTES.md before making anything; don't stop to wait for an okay.

## Round 1 · For You and the game page

Needed for every game.

### 1. For You poster

- **Size:** 2:1, at least 1600×800, plus tall (2:3) and square versions, or a moving poster that lays out
- **Save as:** `bug/poster.png, plus bug/poster-2x3.png and bug/poster-1x1.png`
- **What it's for:** The one picture people see on For You, on the game page and in lists.
- **Must:**
  - One image you can name in five words, on the game's own ground, edge to edge
  - One character in one moment, or one object in one light
  - A register chosen for the wall: silhouette (one shape holds the world), stage (one lit pocket in the dark) or edition (printed lettering is the art)
  - Two to four inks, one of them the game's own
  - The game's own look (medium, line, light, characters), but not the key art itself: no title, buttons, full cast or busy background
  - Light that visibly comes from a source in the picture
  - A clear focal path at rest: detail lives where the eye lands
  - Tall (2:3) and square versions in which the one image still holds; recompose them if a crop loses it
  - Reads at 90×70
- **Never:**
  - Title lettering, numbers, prices, a HUD, a play button, badges, a frame, a border or a vignette (lettering only on an approved Edition poster, on a plate never squeezed below ~200 px)
  - Anything important in the bottom 26 px (the caption strip) or a busy bottom-left corner (the stamps sit there)
  - Ember, lilac or sun as a flat block of 24×24 or more, or within 120 px of the caption strip, where Play appears
  - Changing the game's own colours to pass a check
- **Check:** Preview it at 740×370, 260×367, 150×177 and 90×70, and in every wall shape (wall.py). Measure its light band (measure.py light): no light poster beside a light one, no loud beside loud.
- *Direction: PD-3.1*

### 2. Focus point

- **Size:** x and y, 0–1
- **Save as:** `bug/publish.json as {"focus":{"x":…,"y":…}}`
- **What it's for:** The spot that must stay in view when the wall reshapes the poster: compressed plates crop around it, open plates grow from it.
- **Must:**
  - The one image survives every wall shape around this point, from a 3.5:1 strip (577×163) to a 1:2.2 column (140×305)
  - It sits on the character or the one object, not on empty ground
  - It still holds where the poster is shown 4:3 (the phone game page) and as a half plate (the phone wall)
- **Check:** Run wall.py with --focus x,y and look at every shape; then crop the poster to 4:3 around the point.
- *Direction: PD-3.1*

### 3. Icon

- **Size:** 92×92, drawn for 46
- **Save as:** `bug/icon-46.png`
- **What it's for:** The small square in rows, Continue, Inbox and the Wallet. Shown at 46 px.
- **Must:**
  - Drawn for 46, not the poster shrunk: name the 2–3 last survivors (a head, eyes, one hot colour) and draw only those
  - Square with sharp corners, never masked
  - Reads at 1× on night and on linen, beside three other games' marks
- **Never:**
  - Full bodies, fine lines, text or a scene
  - A shape that reads as a generic symbol: a blob, a gem, wifi, a letter, a gear
- **Check:** Look at it at 1× on night and on linen, and at 4× with hard pixels, beside three other games' icons.
- *Direction: PD-3.7*

### 4. Emblem

- **Size:** 60×60, drawn for 30
- **Save as:** `bug/emblem-30.png`
- **What it's for:** The tiny mark on avatars, friend lines and seal corners. Shown at 30 px.
- **Must:**
  - Fewer parts than the icon
  - Square with sharp corners, never masked
  - Reads at 1× on night and on linen
- **Never:**
  - The icon scaled down
  - Text, fine lines or a scene
  - A generic symbol
- **Check:** Look at it at 30 px, 1× on night and on linen, and at 4× with hard pixels.
- *Direction: PD-3.7*

### 5. Continue picture · PLAN FIRST

- **Size:** 720×352
- **Save as:** `bug/key-still.png`
- **What it's for:** "The world as you left it": the Continue card on Home (360×176) and on the game page (132×66).
- **Plan first:** which moment it shows. Write it as one line in NOTES.md before you make it.
- **Must:**
  - One moment of tension: the world as you left it
  - The subject in the middle
  - The same finish as the poster; a daylight scene still gets one light drawn in the style
- **Never:**
  - Numbers, names or buttons
  - A flat render
- **Check:** Look at it in the Continue card at 360×176 and at 132×66.
- *Direction: PD-3.8*

### 6. Result picture

- **Size:** 1600×352, subject in the middle 720×352
- **Save as:** `bug/result-still.png`
- **What it's for:** The payoff behind the session result (shown about 800×176). The platform prints every word and number over it.
- **Must:**
  - The game's payoff moment
  - The subject in the middle 720×352
  - The same finish as the poster
- **Never:**
  - Any text or numbers at all; a sign in the world becomes a shape
  - A count or a price baked in (it goes stale and can lie)
- **Check:** Preview it with the platform's headline and numbers over it.
- *Direction: PD-3.8*

### 7. Gallery · PLAN FIRST

- **Size:** 2:1, 1600×800, subject inside the central 4:3
- **Save as:** `bug/gallery/01.png … 06.png`
- **What it's for:** The pictures people flick through under the poster before they press Play. Each one shows one feature.
- **Plan first:** which 6 features (at least 3), in what order, with a caption of ≤60 characters each. Write it as one line in NOTES.md before you make it.
- **Must:**
  - Up to 6 feature slides, one feature each (6 fills the strip; at least 3), in an order that tells the game: the core loop, a second mechanic, a place, a character, together (only if co-op), the payoff
  - A real moment from the current build, staged with the game's own renderer and finished like the poster
  - The subject inside the central 4:3: the phone shows a 4:3 crop
  - Slides that vary: different places, scales or characters
  - The bottom 26 px calm
  - Alt text that says what happens
- **Never:**
  - Text added to the picture: titles, taglines, arrows, NEW badges, ratings, prices (the game's own HUD in real play may stay)
  - A plain engine screenshot that loses the look
  - The poster again
  - Menus, settings or loading screens
  - A moment that doesn't exist yet
- **Check:** Look at each at 100 px wide, and cropped to its central 4:3.
- *Direction: PD-3.5*

### 8. Achievement seals · PLAN FIRST

- **Size:** 192×192 master each (96 shown; 48–64 on the page), three states
- **Save as:** `bug/seals/<moment>-earned.png, -progress.png, -locked.png`
- **What it's for:** One badge per moment in the game, on the page, the result and the profile.
- **Plan first:** the one glyph for each moment. Write it as one line in NOTES.md before you make it.
- **Must:**
  - One seal per moment in game.json (up to 12)
  - An outline by kind: feat, collection or event, the three distinct at 32 px
  - One glyph inside, with thick strokes
  - Three states drawn in the world: earned (the world's lit state), in progress (dimmer inside the art), not yet (a quiet grey ring and the symbol)
- **Never:**
  - Text or numbers inside
  - Gold for earned
  - A padlock
  - More than one hot accent
  - A glyph that reads as something generic at 32 px
- **Check:** Put all seals in a 32 px strip, in all three states.
- *Direction: PD-3.11*

## Round 2 · Store, pass, update and event (design only)

Pictures only. Nothing goes into the game's code or game.json, nothing is declared, no prices. Propose the items first.

### 9. Store pictures · PLAN FIRST

- **Size:** 400×400 master each (shown 40–169 px)
- **Save as:** `bug/store/<product id>.png`
- **What it's for:** One picture for each thing the game sells, in the store row and the Wallet.
- **Plan first:** how each item reads at 40 px. Write it as one line in NOTES.md before you make it.
- **Must:**
  - One item per tile, centred, on the world's own ground, in the game's medium
  - Shown as itself or worn, whichever reads better at 40 px
  - Looks only: trims, skins, companions, emotes, trails, stickers
  - Calm top corners (NEW and YOURS sit there)
  - Its own reward verb for the owned mark, different from every other world's
- **Never:**
  - The game's identity core
  - Anything that helps the buyer win
  - A name, price, count, x2, rarity glow or gold
  - Ember, lilac or sun as fills
- **Check:** Look at each at 40 px, as a black fill and in greyscale.
- *Direction: PD-3.9*

### 10. Pass tile

- **Size:** 400×400
- **Save as:** `bug/pass/tile.png`
- **What it's for:** The pass's own tile, first in the store row.
- **Must:**
  - The pass name may be lettered here: the tile never shrinks below its card
  - The world's own ground, like the store tiles
- **Never:**
  - A price or count
  - Guarded colours as fills
- **Check:** Preview it at the store row's sizes, 40 to 169 px.
- *Direction: PD-3.10*

### 11. Pass row grounds

- **Size:** drawn under each 306×243 reward, three: free, pass, bug.pass
- **Save as:** `bug/pass/ground-free.png, ground-pass.png, ground-bug.png`
- **What it's for:** The three grounds the rewards sit on, so free, pass and bug.pass rows read as tiers.
- **Must:**
  - Free, pass and bug.pass rows on the world's own grounds
  - Three that differ clearly; the platform adds a sun outline to the bug.pass row
- **Never:**
  - Numbers or lettering
  - Guarded colours as fills
- **Check:** Preview the rail with the platform's mint, lilac and sun states on all three rows.
- *Direction: PD-3.10*

### 12. Pass marker

- **Size:** up to 48×48, two poses: next and held
- **Save as:** `bug/marker-next.png and bug/marker-held.png`
- **What it's for:** The little figure that shows where you are on the pass rail, on Continue and the result.
- **Must:**
  - One object from the world, drawn for 48 px (a paper clip, photo brackets, a spider on silk)
  - Two poses: next (rides over the next cell) and held (sits on the last earned cell)
- **Never:**
  - Anything that counts or holds a number
- **Check:** Preview it on the rail in both poses.
- *Direction: CK-9 · RETURN*

### 13. Pass rewards · PLAN FIRST

- **Size:** 306×243, the item centred in a 243 square
- **Save as:** `bug/pass/<reward id>.png`
- **What it's for:** A picture for each reward on the pass: the pass card, the rail on Continue, the result and the Wallet.
- **Plan first:** the list of reward items and the step unit. Write it as one line in NOTES.md before you make it.
- **Must:**
  - Full art at rest; the tier shown by the world's own ground, never by dimming
  - The step unit in the game's world: a sunset, a bout, a frame, a creature caught
  - Reads at about 120 px, where the page shows it
- **Never:**
  - A count or price on reward art
  - Dimming future steps with a veil (the world may draw its own "not yet" inside the art)
  - Crumbs as a reward (not for now)
- **Check:** Look at each reward at the size the page shows it, about 120 px.
- *Direction: PD-3.10*

### 14. Owned mark

- **Size:** an overlay on the store tile (169 px on the page), under 900 ms
- **Save as:** `bug/reward/ (a code module) or bug/reward-held.png`
- **What it's for:** The world's own mark on something a player owns, played once after they buy it.
- **Must:**
  - The world's own mark (stapled, inked, wrapped, found): the reward verb, distinct from every other world's
  - Starts at once, plays once in under 900 ms and ends on the held frame
- **Never:**
  - Gold or a rarity glow
- **Check:** Watch it once on a store tile; the held frame must read at 40 px.
- *Direction: PD-3.9*

### 15. Update picture · PLAN FIRST

- **Size:** 2:1, 1600×800, subject inside the central 4:3 (PROPOSED), plus a 308×154 thumbnail
- **Save as:** `bug/updates/<version>.png`
- **What it's for:** One close-up per update: the Updates tab, the gallery's New slide, Home and the followers' Inbox.
- **Plan first:** the one change it shows. Write it as one line in NOTES.md before you make it.
- **Must:**
  - A close-up of what changed inside the world, the way the game draws it
  - One change per picture
  - The same light and medium as the poster
  - Readable at 104×52
- **Never:**
  - The poster with a flag or NEW on it
  - A version number, date or the word update
  - A change that isn't in the build
- **Check:** Look at it at 104×52.
- *Direction: PD-3.12*

### 16. Event banner and seal

- **Size:** 1720×600 (shown 860×300), the left 45% kept for the copy; plus a 192×192 event seal in three states
- **Save as:** `bug/events/<event id>-banner.png and bug/seals/<event id>-earned.png, -progress.png, -locked.png`
- **What it's for:** The banner for a live event, on Home and the game page.
- **Must:**
  - The world on a special day or night, visibly different from the poster
  - The left 45% kept for the platform's words and Join; whether it's plain, dark or darkened is the game's choice
  - The subject in the right 55%
  - A title lockup is allowed, never over the brightest part
  - An event seal with the event-kind outline, distinct from the moment seals at 32 px
- **Never:**
  - Key art reused with new lettering
  - Hot colours where Join sits
  - A counter painted into the art
- **Check:** Cover the left 45%: the right 55% tells it alone, and can be cropped to sit beside the copy.
- *Direction: PD-3.14*

## Round 3 · Optional, makes it shine

Nice to have.

### 17. Moving poster

- **Size:** a code module, to LIVING_POSTER_CONTRACT.md in this pack (put "···" for the catalogue number and maker: bug.games sets them)
- **Save as:** `bug/living-poster/`
- **What it's for:** The poster, alive, drawn by the game's own code at whatever size the wall gives it. Up to 4 move on For You at once.
- **Must:**
  - Recomposes for any plate, from about 120×90 to about 900×640, very wide, very tall or tiny: never stretched, never empty bars
  - An anchor() on the character, so every crop keeps it in view
  - Idle with pauses (live 2.5–6 s, hold 1.5–5 s), one reaction on focus, an enter into a 4–8 s loop that returns to the held pose
  - A squeezed reaction in its own world for when a neighbour opens, and one throwable
  - The game's own renderer and drawing code, at the world's own gait
  - The held frame is the poster; reduced motion shows it still
- **Never:**
  - Animated type, prices, counts or Play
  - Changing the poster's light band: no brightening flashes, no whole-frame colour shifts
  - Flashing faster than 3 a second or pulsing the whole frame
  - Running while off screen, or more than about 2 ms a frame
- **Check:** Run it in the harness at tiny, tall and wide sizes and squeezed; time a frame; the held still matches the poster.
- *Direction: PD-3.2*

### 18. Page backdrop

- **Size:** 1440×577, and 390×826 for phone
- **Save as:** `bug/backdrop.png and bug/backdrop-phone.png`
- **What it's for:** The world behind the top of the game page.
- **Must:**
  - The world's own place at rest, with one light
  - It ends in a hard edge or a floor scene (a floor that runs under the hero sets foot)
  - Desktop and phone composed separately, not cropped
- **Never:**
  - Text
  - A second focal point that competes with the poster
  - Animation: the backdrop is a still
  - The platform's colours near the info rail
- **Check:** Put the poster over it: the poster still leads.
- *Direction: PD-3.6*

### 19. Share card

- **Size:** 1200×630
- **Save as:** `bug/share-card.png`
- **What it's for:** The picture people see when someone shares a link to the game.
- **Must:**
  - The poster's register, so a 270 px link preview still matches the wall
  - The art on the right, the subject at about 0.7–0.76 of the width; the left 40–50% plain for the title
  - The one place the game's title lettering sits on the art
  - The bottom band quiet: the platform adds a linen bug.games bar
- **Never:**
  - Player names
  - Ember (the platform's play colour)
- **Check:** Look at it 270 px wide.
- *Direction: PD-3.15*

### 20. Chip

- **Size:** 128×128, drawn for 64
- **Save as:** `bug/chip-64.png`
- **What it's for:** The mark on Home chips. Shown at 64 px.
- **Must:**
  - Drawn for 64: more parts than the icon, fewer than the poster
  - Square with sharp corners, never masked
- **Never:**
  - The poster shrunk
  - Text
- **Check:** Look at it at 64 px, 1× on night and on linen.
- *Direction: PD-3.7*

### 21. Phone poster

- **Size:** 9:16, 1080×1920 (PROPOSED)
- **Save as:** `bug/poster-9x16.png`
- **What it's for:** The poster for phone shares and stories.
- **Must:**
  - Recomposed for 9:16 around the one image, not a blind crop of the 2:1 poster
- **Check:** Compare it with the 2:1 poster: the same one image, the same register.
- *Direction: PD-2 #19 · CK §Bible 6*

### 22. Title lettering

- **Size:** PNG or SVG, with its smallest readable width
- **Save as:** `bug/title-lockup.png`
- **What it's for:** The game's name in its own lettering: on the share card and the end of the gameplay video.
- **Must:**
  - The game's own lettering, with its minimum size stated
  - Letters at least 12 to 18 px tall wherever it appears
- **Never:**
  - On the For You poster (only an approved Edition poster)
  - On any plate that can squeeze below about 200 px wide
- **Check:** Look at it at its smallest width.
- *Direction: PD-4*

## The two small tools

The checks name two small Python tools from the bug.games kit: wall.py (puts the poster on the real wall and in every shape) and measure.py (colour zones and light band). They're in `tools/` in this pack (Python 3 + Pillow): `python3 tools/wall.py bug/poster.png --title "Your Game" --focus 0.5,0.45 --icon bug/icon-46.png` and `python3 tools/measure.py light bug/poster.png`, `python3 tools/measure.py colour '#RRGGBB'`. If you can't run them, do the same check by eye and say so.
