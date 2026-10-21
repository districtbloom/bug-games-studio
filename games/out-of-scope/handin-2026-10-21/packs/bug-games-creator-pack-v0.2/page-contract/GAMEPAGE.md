# GAMEPAGE.md · one shared game page (kit v2)

**Decision.** Every game gets the same page, on the platform's black. The game's individuality lives only in its **assets**: the living poster, the world backdrop behind the hero, the continue still, store items, pass rewards, the reward moment, seals, event art, update close-ups, the share card and small marks. Pages no longer get a per-game premise (paper form, enamel sign, web, crate…). The strongest premise art survives as each game's **backdrop** asset behind the hero only.

_Creator edition: the platform's page spec with its internal build, porting and test sections left out. You do not build the page; the platform builds it from your package. What matters to you is §3 (what the platform owns) and §4 (the assets each part of the page draws)._

## 3. Layout rules (platform-owned; no game changes these)

Order, desktop (1280 column, fluid 1280–1920, designed at 1440):
1. **Chrome**: header, ticker (desktop only), sticky index bar after Continue scrolls away (icon, name, 6 links, ember Continue).
2. **Stage** (full bleed): the game's `backdrop` asset behind; breadcrumb on an ink label; **hero row** = living poster 2:1 in a 6 px ink seam plus a 1 px linen hairline outside it (so a dark poster never melts into a dark backdrop, nor a light one into a light backdrop) (8/12) + **info rail** on night, same seam and hairline (4/12): icon 50, kicker (latest update, links to Updates), title (Bricolage 42, one line: the kit steps it down to 28 to fit, ellipsis only past that), one line (at most 3 lines; the build warns past 110 characters), loved % (mint, links to Reviews) + 3 tags + players/length, continue card (cont still + place + progress), **the one ember Continue** + Play together + Save, pass card (name, step x of 30, Next, rail, See pass), friends + maker. The stage ends with a hard line; below is night. A game whose backdrop has a floor scene sets `foot: [desktop px, phone px]` in data and the stage grows by that much so the scene shows under the hero row (Inkstrike's Gus asleep, Handling's van, Brother's door: `[150, 0]`).
3. **This week**: event plate (copy on an opaque plate left, art right, ember Join, ends in) 7/12 + the pass's next 4 rewards in house frames + the bug.pass extra 5/12.
4. **Tabs** Store · Updates · Reviews · About · Achievements (store first). One tablist. Desktop: panels stacked in one grid cell, so the page height never changes. Phone: each panel sizes to its content and the **tab row stays anchored** (the content above never changes and the page below the tab row is always longer than a screen, so switching never moves what you are looking at); this removed the empty band under the short store panel. Store = 7 tiles in one row; Updates = 3 cards; Reviews = big loved % + 3 quotes; About = text + goal | controls (3 chips) + "All details"; Achievements = 8 seals in a row, one selected shows rule/state/rarity.
5. **Made by** (crew, Follow, next update card) + **Shape it** (3 requests with Me too, Suggest a change).
6. **More like this**: 4 neighbours' untouched posters with the house caption.
7. Platform footer with the design note.

Phone (390, mobile-first): no breadcrumb; poster 4:3 full width, thumbs as small chips on the poster; info rail becomes a card on the backdrop (4 px seam); This week = event card + **two-up tiles** (next pass reward · an item from the store that is not the same thing); tabs scroll sideways; Store and More are **swipe rows**; About shows controls two-up without notes; Shape it collapsed ("Show 3 requests"); **sticky play bar** at the bottom (icon, name, place · step, ember Continue) appears as soon as the hero Continue leaves the screen; the pass opens as a full-screen sheet, a vertical list scrolled to your step.

Fixed rules: ember only on Continue / Play to fill it / Join event · lilac = selected, yours, your step · sun = crumbs and the bug.pass line · mint = loved, owned · information always on opaque plates, never on the backdrop · the backdrop never carries text · one live element (the hero; the backdrop is a still) · reward moments start at once, play once, < 1 s, end on the held frame · reduced motion = composed stills: hero idle still, reward drawn held, ticker and pulses stop, no transitions · visible focus on every stop (tested 70) · Escape/close/backdrop close the pass and focus returns to the opener · after a buy, focus lands on the bought tile.

## 4. The asset contract (what a game supplies)

On the platform each game's page is fed by a folder with `game.json`, `data.js` (`const GAME = {…}`, facts only), `hooks.js` (registers `ART.draw.*`) and `vendor/` (poster module + its drawing code); one roster game's real files are in `nightswim/`. **You do not write these**: your package's art slots feed the same hooks (the operator's harness maps them). Every hook paints its whole box. Sizes OBSERVED on the 13 roster pages (CSS px):

| hook (args after ctx, w, h) | where | 1440 | 390 |
|---|---|---|---|
| poster module `BUG_MODS.<mod>` (live) | hero (idle → react → enter → loop on hover/tap) | 837 × 419 | 390 × 293 |
| `backdrop(mobile)` *optional* | full-bleed behind the hero row; end with a hard edge or floor | 1440 × 577 | 390 × 826 |
| `icon` | info rail, sticky bars, pass card | 36–50 sq | 36–46 sq |
| `cont` | continue card (key still, number-free) | 132 × 66 | 132 × 66 |
| `store(id)` (id `pass` = pass tile) | store tiles, pass card, dialog head | 40–169 sq | 40–174 sq |
| `rw(item, ground, tier, state)` tier free/pass/bug, state owned/next/locked | pass rewards (This week, dialog) | 118–123 sq | 99–174 sq |
| `reward(id, p)` p 0…1, transparent overlay, **p = 1 is the held/owned mark** | bought tile, owned tiles | 169 sq | 158 sq |
| `seal(g, state, pct)` state earned/progress/locked | Achievements | 48–64 sq | 48–56 sq |
| `event` | This week plate (copy is the platform's, beside the art) | 430 × 250 | 358 × 201 |
| `update(id)` | updates, media thumbs | 104–413 × 52–233 | 52–120 × 30–68 |
| `share` | Play together popover (1200:630) | 348 × 183 | ~342 × 180 |
| `loop(t)` *optional* (default: module loop frame) | media thumb 2 | | |
| `roster(key)` *default* | More like this (neighbour still + house caption) | 308 × 193 | 250 × 156 |

Data knobs the platform reads: `foot` (optional, see §3), `echo` (hover echo colour: the hard shadow of a lifted tile; never ember/lilac/sun, the build refuses them), `rewardMs` (≤ 900) and `rewardSteps` (0 = smooth; n = stepped gait for pixel/stop-motion worlds), `ownWord` ("Filed", "Kept", "Wrapped", "Found"), `boughtLine`, `playingWord`, `hint`/`hintM`, `inLabel`. Required data fields are listed in `build.py` (REQUIRED_DATA, REQUIRED_HOOKS, OPTIONAL_HOOKS): read it as the list of what a page consumes; it does not run outside the platform.

## 7. Strongest assets (what to preserve when porting; OBSERVED on the 13 v1 pages)

The living posters (all 13; the hero keeps them live); store tiles drawn on the world's own ground (Miradouro's sunset row, Carbon's ruled paper, Threadbare's night, Night Swim's dot sea); the reward verbs (13 distinct); seals by kind (Night Swim lattice, Threadbare gem outlines, Seam Ripper patches); event art with room for copy; update close-ups (Carbon's Copy Room, Miradouro's blue hour, Threadbare's reeds); the page premises, now reduced to the backdrop (Carbon blueprint arcade + diamond floor, Miradouro evening sky, Threadbare orb web, Night Swim dot sea and tower; to come: Brother hallway, Gob set, Handling dock, Queue facade, Seam Ripper table, Typos printout, Tiny Worlds "fall in", Inkstrike newsprint, Out of Scope desktop). Dropped on purpose: per-page plate surfaces, world tabs, quiet passages, floors at the page foot, world-coloured headings.
