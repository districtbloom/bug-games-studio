# The pictures, one by one

Four rounds, made in one go (see START_HERE.md for the order and the fan-out). PLAN FIRST lines go into NOTES.md before making anything; don't stop to wait for an okay.

## Round 1 · For You and the game page

Needed for every game.

### 1. For You poster

- **Size:** 2:1, at least 1600×800, plus tall (2:3) and square versions, or a moving poster that lays out
- **Save as:** `bug/poster.png, plus bug/poster-2x3.png and bug/poster-1x1.png`
- **What it's for:** The one picture people see on For You, on the game page and in lists.
- **Must:**
  - One image you can name in five words, on the game's own ground, edge to edge
  - It shows what the game is about: who you are and what you're up against, not only a character's mood
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
- **Check:** Look at each at 100 px wide next to its central 4:3 crop: the subject must read in both.
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
- **Check:** Put all seals in a 32 px strip, in all three states, the not-yet state included: no glyph may read as a letter, a play button or a warning sign.
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
- **Words:** each item's name and a kind line ('Skin · the dots go pale'), plus one subtitle for the store row ('Skins for the sea'). No prices. Write them into bug/design.json with the proposal.
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
- **Words:** the pass name, its step unit in the world (a swim, a bout, a frame) and one sentence on what the pass is. No price. Write them into bug/design.json with the proposal.
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
- **Words:** a short name for each reward. Write them into bug/design.json with the proposal.
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
- **Words:** the own word and bought line (see The game's voice). Write them into bug/design.json with the proposal.
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
- **Words:** a title of at most about 40 characters in the game's voice ('The Second Lamp') and the change in one line. A next update only if it's really on the roadmap; its date is UNDECIDED. Write them into bug/design.json with the proposal.
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
- **Words:** the event's name, one or two sentences on what everyone does together, and the counter's unit ('letters found'). Any target number is UNDECIDED unless the founder sets it. Write them into bug/design.json with the proposal.
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
  - Squeezed, very narrow and very wide plates keep the character in view, recomposed for that shape, never sliding off the edge
  - Its seam moment fits the game: a toss, a shot, a beam, a splash or a grab in the game's own verb, declared with acts
  - The loop shows the game's premise, the conflict a player would recognise
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
  - Lettering at least ~12 px letter height at the 270 px link preview
- **Never:**
  - Player names
  - Ember (the platform's play colour)
- **Check:** Look at it 270 px wide. Measure the smallest letters at 270 px wide: at least ~12 px.
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
  - No letters under ~12 px letter height wherever it's shown; state its minimum width
- **Never:**
  - On the For You poster (only an approved Edition poster)
  - On any plate that can squeeze below about 200 px wide
- **Check:** Look at it at its smallest width.
- *Direction: PD-4*

## Round 4 · The page's words

No pictures. Every line the game page prints in the game's voice. Write them to bug/words.json, starting from WORDS_TEMPLATE.json. Words that game.json already holds (title, hook, description, genre, minutes, players, coop, inputs, controls, moments, mood, tags, contentNote) live there. The rest go in bug/words.json. In a design pass nothing is written to game.json: draft all of them in bug/words.json under the same names, and they move into game.json after the yes to publish. The kicker above the title is the latest update's version and title; it comes from the update's words, not a separate line. Leave these to bug.games: catalogue number, maker and crew handles, loved %, review count and reviews, how many are playing, friends, followers, Shape it requests, 'built from player requests', prices and crumbs, pass step and days left, event count and end time, dates, versions on cards, rarity and progress, NEW and YOURS, 'Nothing you can buy beats other players', More like this and its line, the ticker.

### 23. One-line pitch

- **Size:** one sentence, at most 70 characters
- **Write to:** bug/publish.json as {"line":"…"}
- **What it's for:** One sentence of what you do in the game. It replaces the verb on the For You strip when a plate opens.
- **Must:**
  - What the player does, in the game's own words, plain
  - Fits 70 characters
- **Never:**
  - Superlatives, prices or other games' names
- **Check:** Read it aloud: would a stranger know what they'd be doing?
- *Direction: Founder 20 Oct*

### 24. Title, one line and hover words

- **Size:** title ≤ 40 characters · one line ≤ 110 characters · one word · two short hints
- **Write to:** game.json title and hook · bug/words.json playing_word, hover_hint {desktop, phone}, echo
- **What it's for:** The words in the hero beside the poster: the title, the one line under it, the word for people playing now ('1,418 swimming') and the hint on the poster.
- **Must:**
  - A title that fits one line at 42 px (the page steps it down to 28 before it ever cuts it)
  - One line that says what you do and against what, in the game's verbs, at most 110 characters
  - A playing word in the world ('swimming', 'filing', 'hunting'), not 'playing'
  - A hover hint and a tap hint that say what the poster does when you touch it ('Hover to wake the whale' / 'Tap to wake the whale')
  - A hover echo colour for the hard shadow of a lifted tile
- **Never:**
  - Superlatives, other games' names or prices
  - An echo colour that is ember, lilac or sun
- **Check:** Read the title and the one line aloud to someone who has never seen the game: can they say what they'd do?
- **Example of the job** (another game's words, never yours): Night Swim · 'A whale made of stars swims past a lighthouse, collecting letters. The beam finds them first.' · swimming · Hover to wake the whale
- *Direction: GP-3.2*

### 25. About: what it is, the goal, tips

- **Size:** 2–3 sentences · 1 line · 3 tips
- **Write to:** game.json description · bug/words.json goal, tips
- **What it's for:** The About tab: two or three sentences on what it is and how you play, the goal in one line, and three tips.
- **Must:**
  - Say what the player does, in the game's verbs, in plain words
  - The goal fits one line
  - Three tips a first-time player can use, each one sentence
- **Never:**
  - Superlatives, other games' names or prices
  - Game-speak ('level', 'enemies'), guilt or a stack of exclamation marks
  - Pictures: About is words and controls only
- **Check:** Does the paragraph alone tell a stranger how to start?
- **Example of the job** (another game's words, never yours): Night Swim · goal 'Spell NIGHT in one swim. Then swim on.' · tip 'Letters drift in from the right. The beam finds them first.'
- *Direction: PD-3.13*

### 26. Controls, for every input

- **Size:** every control, for every input the game declares
- **Write to:** game.json inputs and controls · bug/words.json controls {keyboard, mouse, gamepad, touch: [{key, action, note}]}
- **What it's for:** The controls on the About tab, per input (Keys · Gamepad · Touch): the key, the action word, a short note.
- **Must:**
  - Every control in game.json, for every input in inputs
  - Touch is listed whenever inputs includes touch
  - The action is one or two words in the game's verbs; the note is a few words on when or how
  - Only controls the game really has
- **Never:**
  - A control the build doesn't have
  - Long notes: on phone the controls show two-up without notes
- **Check:** Play with each input using only this list.
- **Example of the job** (another game's words, never yours): Night Swim · Space · Swallow · Open wide when a letter is in the beam
- *Direction: PD-3.13*

### 27. Details and tags

- **Size:** genre · players · minutes · inputs · content note · mood · up to 5 tags (the hero shows 3)
- **Write to:** game.json genre, players, coop, minutes, inputs, contentNote, mood, tags
- **What it's for:** 'All details' on About, and the three tags and player count in the hero.
- **Must:**
  - Tags in the game's own words, 2–24 characters each; put the three that say most first
  - coop only when people play in one session together
  - A content note when the game has flashing lights or anything a player should know first
  - A mood word from the platform's list
- **Never:**
  - Superlatives, other games' names or prices in tags
  - 'Co-op' for a game where people only see each other's times or ghosts
- **Check:** Would the three tags alone sort the game onto the right shelf?
- **Example of the job** (another game's words, never yours): Night Swim · Arcade · Quiet · Solo · 1 player · ~15 min
- *Direction: PD-3.13*

### 28. Seal names and rules

- **Size:** ≤ 12 moments, in play order; the page shows 8 · one rule line each · a kind each
- **Write to:** game.json moments · bug/words.json moments [{name, rule, kind: feat | collection | event}]
- **What it's for:** Each seal's name (the moment) under it in mono caps, and the one-line rule the plate shows when a player selects it.
- **Must:**
  - Names in the world's words, short enough for mono caps under a seal
  - A rule that says exactly what to do, in one line
  - A kind for each, matching the seal's outline
- **Never:**
  - A moment the game can't report
  - Rarity, progress or dates: those are bug.games'
- **Check:** Read the 8 names in a row: do they tell the game's story in order?
- **Example of the job** (another game's words, never yours): Night Swim · NIGHT · 'Spell N, I, G, H, T in one swim.' · feat
- *Direction: PD-3.11*

### 29. Gallery captions

- **Size:** one caption per slide, ≤ about 60 characters after the kind
- **Write to:** bug/words.json captions {"gallery/01.png": "…"}
- **What it's for:** The caption under the gallery's main picture. bug.games writes the first half (the slide kind); the game writes the rest.
- **Must:**
  - What you see, in the game's words, plain and in its own verbs
- **Never:**
  - Text that the picture needs in order to make sense
- **Check:** Read the six captions without the pictures: do they walk through the game?
- **Example of the job** (another game's words, never yours): Night Swim · 'In the game · the whale, the beam, the letters'
- *Direction: PD-3.5*

### 30. Place strings

- **Size:** each ≤ 30 characters
- **Write to:** bug/words.json place_strings (the same text the code sends with progress.set)
- **What it's for:** Where a player is, as the game says it. It shows on the Continue card and the phone play bar.
- **Must:**
  - The same text the game sends with progress.set
  - In the world's terms ('Swim 4', 'Round 2 of 3')
- **Never:**
  - Longer than 30 characters: list a longer one as a proposed fix, don't change the code in this pass
- **Check:** Does each one tell a returning player where they'll land?
- **Example of the job** (another game's words, never yours): Night Swim · Swim 4
- *Direction: KIT-W*

### 31. The game's voice

- **Size:** one verb · stat nouns · own word · bought line · 2–3 result lines · 2 friend lines · ≤ 2 quick-chat lines · 1 pause line
- **Write to:** bug/words.json verb, stat_nouns, own_word, bought_line, result_lines, friend_lines, quick_chat, pause_line
- **What it's for:** Small lines bug.games prints in the game's voice: the owned word on store tiles, the line after a buy, the result headline, friend lines, quick chat and the pause line.
- **Must:**
  - Your world's verbs ('worked', 'stayed', 'hunted', 'Found', 'Filed')
  - An own word for what owned looks like in the world
  - Stat nouns the result screen can count ('letters', 'swims')
- **Never:**
  - Game-speak ('level', 'enemies'), guilt or exclamation stacks
  - Streak or scarcity words, 'teardown' or 'Fair Play'
- **Check:** Put each line next to the poster: same world, same voice?
- **Example of the job** (another game's words, never yours): Night Swim · own word Found · bought line 'Found for you: '
- *Direction: KIT-W*

## The two small tools

The checks name two small Python tools from the bug.games kit: wall.py (puts the poster on the real wall and in every shape) and measure.py (colour zones and light band). They're in `direction/tools/` (Python 3 + Pillow). From the repository root: `python3 direction/tools/wall.py /tmp/poster.png --title "Your Game" --focus 0.5,0.45 --icon games/<slug>/bug/icon-46.png`, `python3 direction/tools/measure.py light games/<slug>/bug/poster.png` and `python3 direction/tools/measure.py colour '#RRGGBB'`. wall.py saves its two images next to the poster file, so run it on a copy outside the repository (as above) and never commit its output. If you can't run them, do the same check by eye and say so.
