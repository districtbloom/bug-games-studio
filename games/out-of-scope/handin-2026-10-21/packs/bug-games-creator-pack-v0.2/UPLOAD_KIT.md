# Game upload kit: everything a game needs on bug.games

Oct 19, 2026 · @Someone

To go live, a game needs a self-contained web build wired to the bug.games SDK, a `game.json` listing, a cover and a one-line pitch; everything else raises how the game looks and earns, and the platform has a fallback for each missing piece. Sources throughout: the SDK reference (`@bloomplay/runtime`), the design canvas and its creator kit. Nothing here is a price or a rule that isn't written in one of them; undecided things are in the last section.

## At a glance

| Layer | What it includes | Checked by |
| --- | --- | --- |
| To publish | `index.html` with every asset inside; SDK handshake, loading and play signals; phone controls if it says touch; cover (16:9); one-line pitch | `publish_checks` and the Publish screen |
| Listing | `game.json`: title, hook, description, mood, genre, minutes, tags, players and co-op, inputs, controls, moments, accent, content note | Validated at publish |
| Art tier 0 | A title, a kind, one line | Platform fallbacks everywhere; not eligible for For You |
| Art tier 1 (target for every game) | Poster master and crops, icon 46, emblem 30, key still, result still, seals, pass reward art, store item art, pass marker; title ≤ 40, place string ≤ 30, one verb | Creator kit self-check (designed, not built) |
| Art tier 2 | Living poster module, event banner, update close-ups, share card, chip 64, phone 9:16, title lockup, voice sheet | The 13 roster worlds |
| Selling | Products and a pass declared in `game.json`, each with art | Staff review; nothing sells before approval |
| Live game | Events, updates, creator subscription perks, replies on Shape it | Studio |
| Social | Moments as achievements, share, invites and rooms, boards | SDK |

## Where a game appears

A published game shows up on 25 surfaces. The game supplies the words, art and signals in the middle column; the platform draws, counts and orders everything else. Source: the boards on the design canvas, as of today.

| Surface | The game supplies | The platform supplies |
| --- | --- | --- |
| Home · For You wall | Living poster (or held still), title, maker, kind, verb, short line | Slot and rotation, caption strip, stamps (New, Staff pick, Live), loved %, players, length |
| Home · Continue | Icon, place string, pass name and step, next reward | Order, pass ring, "one step away" |
| Home · Featured (pick of the week) | A commissioned move of its poster | The pick, dates, band copy, Play |
| Home · Live & next | Event name, line, shared counter, dates; update name; pass name and days left | Card order, reminders, Join / Remind me |
| Home · vibe wall, lists | 1–3 vibes; three stills (idle, in play, on the page); bug.pass extra; latest update | Lists (In play, New this week, Most played, Most shaped, Extras with bug.pass) |
| Welcome | Poster, short description, length, players | Pick three |
| Discover and search | Vibes, tags, length, players, plays on, name, line | Search, filters, sorts, Hidden gems, Brand new |
| Game page · hero | Poster, icon, title, lead line, 3 chips, players and length, hover hint, the "playing" word, maker | Loved %, playing now, friends in, Continue, Play together |
| Game page · This week | Event plate, next 4 pass rewards, bug.pass extra | Countdown, Join |
| Game page · Store | Items (art, name, kind line, price), store line | Buying, owned state, wallet |
| Game page · Updates | Version, date, title, which changes came from players, close-up art | Layout |
| Game page · About | About text, goal, controls per input, tips, details | Layout |
| Game page · Achievements | Seals in three states, name, rule, kind, progress | Rarity, earned date, pin to profile |
| Game page · pass | Pass name, unit, one line, every step's reward and art, row grounds | Rail, states, phone sheet |
| Game page · Made by, Shape it | Crew, creator subscription perks, next update, replies to requests | Shape it board, Me too, follow |
| Game page · More like this | Today: four neighbours listed by hand | Neighbour posters |
| Play and pause | Place string, in-world pause line, controls, store and pass inside the menu | Esc menu, party, settings, bug reports with a 10 s replay |
| In-game moments | Revive points, unlockable chapters, real timers to skip | The overlay, prices, sign-in |
| End of session | End signal, headline verb and quantity, 2–3 stats, unlocked item, next action, result still | Saved, pass steps, rating, Play again, Shape it |
| Share and a friend's link | Share card, result line, touch-control line | Invite, guest play, guest save |
| Inbox | Update shipped, event reminder, pass out, devlog, icon | 3 a day at most, followed games only |
| Friends and parties | Players, mode, two quick-chat lines, ghosts and challenge links for solo games | Matching, safety, Lately lines |
| Profile, Creator page | Tall poster crop, icon, emblem, seals, creator's own signature piece | Taste, level, badges, followers |
| bug.pass page, Wallet, offers | The bug.pass extra reward (or a gift), pass name and price, item names | Plans, crumb bundles, the one-a-day offer slot |
| Studio, Publish | Everything above, plus cover tests and a share kit | Metrics, payouts, review, link |

## The build

A game is a folder with `index.html` at its root, every asset bundled inside it, and the bug.games SDK (`/sdk/bloomplay.js`) wired to a handful of calls. Everything else on this page hangs off those calls and one file, `game.json`.

| Requirement | What the game does | Why the platform needs it |
| --- | --- | --- |
| Entry point | `index.html` at the workspace root; no CDNs, all assets in the folder | Games run in a sandboxed frame on their own origin; outside requests may be blocked |
| Handshake | `bloomplay.init({ preload: ["save"] })` | Gives the player, the save, the invite payload and limits in one answer |
| Loading | `loading(0..1, label)` during boot, `loaded()` when the player can act, `failed(msg)` if the boot dies | The platform draws your progress instead of a spinner; without it, it gives up at 25 s |
| Play edges | `gameplayStart()` / `gameplayStop()` | Tells the platform when real play starts and stops |
| Pause, mute | Handle `onPause` (hidden, signin, purchase, dialog, page), `onResume(hiddenMs)`, `onMute` | Platform sheets (buying, signing in) open over the game |
| Save | `bloomplay.save({ key, cache })` — never a hand-written save layer | Saves follow the player across devices; a failed read must never wipe an account |
| Continue label | `progress.set("Round 2 of 3")` | The line on the player's Continue card on Home |
| Moments | Declare up to 12 in `game.json`; report with `progress.moment(name)` | Each moment is an achievement, a share and bug pin, and the spine of the game page |
| Store and pass | `monetization.getProducts()`, `purchase(id)`, `getEntitlements()`, `getPass()` | Draw the shop from what the platform returns; it is empty until staff approve |
| Phone | Touch controls if `inputs` lists `touch` | The page and the publish checks test phone controls |
| Multiplayer (optional) | `multiplayer.join` for rooms, or a deterministic `logic.js` / `logic.wasm` for authoritative play | Co-op and parties; `logic.js` must pass the determinism lint |
| Shared boards (optional) | `bloomplay.board(name)` for leaderboards and "strangers in your world" | The only state shared across players |
| Player-made things (optional) | `bloomplay.files` (8 MB a file) and `social.share` | Photos, levels, recordings a player keeps or sends |

`publish_checks` runs the same test the game page will: the folder, that it runs in the browser, load time, phone controls, cover and one-line pitch, the SDK, and any jam entry. A game without `game.json` still publishes, with a bare card.

## Listing and identity

The listing lives in `game.json` at the workspace root. Every field is optional and validated at publish; a game without `game.json` still publishes, with a bare card. Sources: the SDK reference for `game.json` fields, the creator kit for the place string and verb.

| Field | Limit or format | Where it shows | Checked at publish |
| --- | --- | --- | --- |
| `title` | ≤ 40 characters (creator kit) | Everywhere | — |
| `hook` | One line, the pitch | Cards, game page, share | Yes (one-line pitch) |
| `description` | Longer copy; blank lines make paragraphs | Game page | — |
| `mood` | One word from the platform's list: thrilling, tense, frantic, brutal, triumphant · cosy, gentle, homely, meditative · curious, playful, strange, clever · tender, melancholy, lonely, bittersweet | Home shelves group by it; the page shows the word | Refused if not on the list |
| `genre` | Free word | Game page | — |
| `minutes` | Typical session length | Cards | — |
| `tags` | Up to 5, 2–24 characters, the maker's own words; no superlatives, other games' names or prices | Under the title; folded into store shelves | — |
| `players`, `coop` | Co-op only if players share one session (a room) | Card badge | — |
| `inputs` | keyboard, mouse, touch, gamepad (`touch` = playable on phones) | Plays on | Yes (phone controls) |
| `controls` | Key → action | Game page, pause | — |
| `permissions` | microphone, camera; only if needed | Browser prompt in the frame | — |
| `moments` | ≤ 12, in play order | Achievements, share links, bug pins, search | — |
| `accent` | One hex | Page | — |
| `contentNote` | e.g. "Flashing lights." | Before play, on the page | — |
| `jam` | The current jam's tag | Jam | Yes (jam entry) |
| Place string | ≤ 30 characters (creator kit) | Continue card, result headline | — |
| Verb | One word in the world's voice (creator kit) | Result headline, friend lines | — |

Words never allowed in any field: "teardown", "Fair Play", streak or scarcity language, superlatives about the game itself.

## Art and media

A game with no art still works: the platform has a fallback for every asset (art tier 0). Tier 1 is the target for every published game; tier 2 is what the 13 roster worlds have. Supply at 2× the display size. Sources: the creator kit, the game-page spec, the SDK (`cover`, `screenshots`, `trailer`).

| Asset | Size | Where it shows | Tier | Fallback |
| --- | --- | --- | --- | --- |
| Poster master + held still | 2:1, at least 1600×800, with 2:3 and 1:1 crops; bottom 26 px kept plain | For You, game page hero, More like this, Welcome, Discover, lists | 1 | The "unwrapped" plate: linen, catalogue number, title, kind |
| Icon 46 | 92×92, drawn for 46 px, not the poster shrunk | Continue, rows, Inbox, chips, Wallet | 1 | Catalogue number on a linen square |
| Emblem 30 | 60×60 | Avatars, friend lines, seal corners | 1 | Same |
| Key still | 720×352, no numbers | Continue card on the game page | 1 | Centred poster crop |
| Result still | 1600×352, subject in the middle 720×352, no text or numbers | End of session | 1 | Poster crop |
| Seals (one per achievement) | 96×96, outline by kind (feat, collection, event), three states | Achievements, result, profile | 1 | Black square with a sun diamond |
| Pass reward art | 306×243 per step | Pass rail, This week, bug.pass page | 1 | Hatched tile with the item's name |
| Store item art | 400×400, must read at 40 px | Store, Wallet, result | 1 | Hatched tile with the item's name |
| Pass marker | ≤ 48×48, two poses (next, held) | Pass rail, friend avatars | 1 | Lilac diamond |
| Cover | 16:9 (SDK `cover`) | Publish check, search, links | — | — |
| Screenshots, trailer | SDK fields, no size set | Game page media strip | — | Poster loop |
| Living poster module | Idle, react, enter, 4–8 s loop, squeezed, one throwable, reduced-motion still | For You (live), hero, Welcome | 2 | The tier-1 still |
| Event banner | 1720×600, left 45 % kept plain for copy | This week, Live & next | 2 | A card with words only |
| Update close-up | Thumbnail 308×154 | Updates tab, Live & next, Inbox | 2 | A card with words only |
| Share card | 1200×630, title lettering allowed | Link previews, friend's link | 2 | Poster at 2:1 beside the title |
| Chip 64, phone 9:16, title lockup | As named | Home chips; fixed-size pieces | 2 | Icon; house type |
| Backdrop (optional) | 1440×577 desktop, 390×826 phone, no text | Game page stage | — | Platform night |

**Every asset must pass** (art-direction guide and the creator kit's self-check): readable at 90×70; no numbers or prices in stills; no lettering on a plate that can shrink below about 200 px; small marks drawn for their size; colours kept clear of the platform's ember, lilac and sun near buttons; a held frame for reduced motion.

## Store

Each game sells its own things in crumbs (about €0.01 each), declared in `game.json` under `products`. Declaring is a request: staff approve every item, the shop is empty until then, and an approved price keeps selling while an edited one goes back into review.

**Each item needs**

- `id`: permanent (entitlements point at it); rename only through `name`.
- `name` and a one-line `description`.
- `price` in crumbs.
- `kind`: `consumable` (buyable again) or `durable` (owned once).
- `limited`: only for limited items, and it must say when the item returns ("Back in December").
- Art: a 400×400 master that still reads at 40 px (creator kit). No art → the item's name on a hatched tile.

**Which items and what they cost**

The SDK sets no list of item types and no price list. The canvas designs use these kinds of looks: skin, companion, emote, trail, throwable, sticker, frame, letter set, shown as six items plus the pass tile on the game page. Prices on the roster pages are design placeholders and disagree with each other, so no price guidance exists yet (see the last section).

**Always**

- Nothing you can buy beats other players: staff refuse anything sold into a versus or ranked mode that makes the buyer stronger there.
- A limited item must say when it returns.
- Draw the shop from `getProducts()`: an unapproved game shows an empty shop, not a broken one.
- A withdrawn item stays owned by everyone who bought it.

**Also on the canvas, not yet in the SDK**

- Four store rules shown in Studio for every new item: story and core loop stay free; cosmetics first; never sell a story outcome or unfinished content; nothing you can buy beats other players.
- Looks change trims, skins and companions, never the game's identity core.
- In-game moments sold through the platform overlay, never by the game's own buttons: a revive at the point of failure, an unlock for a chapter or world (the first one free), a skip for a real timer ("We never stretch timers to sell skips").
- Store items go to review at publish and show as "coming soon" until approved; the game plays the same either way.

## Game pass, starter pack, bundles, featured items, offers

Only the game pass is defined end to end. Starter packs, item bundles, featured items and sales exist nowhere yet, in the SDK or on the canvas.

**Game pass** (optional, declared in `game.json` under `pass`, reviewed like products)

| Field | What the SDK says |
| --- | --- |
| `id`, `name` | A new id is a new season |
| `price` | In crumbs; buys the pass track |
| `days` | Runs that many days from approval |
| `steps` | About 30; each step has a `free` reward, a `pass` reward, or both; one step fills per \~20 minutes of foreground play, counted by the platform |
| `memberReward` | One bug.pass reward at a named step |
| `memberGift` | Instead, for a game with no pass: a gift bug.pass members hold while they are members |

The game reads the pass with `monetization.getPass()` and sells the pass track with `purchase(pass.productId)`. For the rail, each step needs reward art (see Art and media).

**Starter pack, item bundles, featured items, sales:** not defined. The only "starter" items on the canvas are the platform's own: the smallest crumb bundle in the Wallet, and a starter-tasks offer for new players.

**Limited items** are allowed only if they say when they return (SDK and canvas agree). No "only N left" and no countdown unless something really ends.

**Offers the platform shows for a game** (Hooks board): "\<Game>'s pass is out" for a returning player on Home. Every offer follows the same rules: one a day at most, never during play, real deadlines only, closes with Esc. The game supplies the pass name, reward names and art, and its bug.pass extra.

## Creator subscription, events, updates

These are defined on the canvas (Studio boards, Publish, the game page); the SDK covers only the update credit.

**Creator subscription** — fans back the creator, not one game. Priced in crumbs a month. Needs at least one perk, reviewed like store items. Perks drawn on the canvas: early builds, a say in updates, one perk inside each of the creator's games (each game has to define it), members-only chapters. Never a story outcome, never anything that beats other players. Shows on the game page (Made by), the Creator page and the Wallet.

**Events** — what a game supplies:

- Name and one line with the shared goal.
- A shared counter: count, target, unit.
- Real start and end times (reminders and the countdown use them).
- An event seal (an event-kind achievement).
- Banner art (tier 2; otherwise a card with words only).

Kinds drawn in Studio: double-steps weekend, limited cosmetic drop, community challenge, crossover with another game, platform jams.

**Updates** — what a game supplies:

- Version, name, date.
- The changes, each tied to the Shape it requests it answers (the platform credits the people who asked).
- A close-up of what changed (tier 2; otherwise words only).

The platform handles the rollout, followers' notice, the "requests shipped" line on Home and the patch notes. When shipping through the SDK, `publish_live` with the request ids flips them to Shipped and credits everyone who asked.

## Social and replay

| Feature | The game supplies | Defined in |
| --- | --- | --- |
| Achievements | Declared `moments` (≤ 12, in play order), reported with `progress.moment(name)`; a seal per achievement with name, rule, kind and progress | SDK (moments), canvas (seals, rules, progress) |
| Share | `social.share` for what the player made; share card art; a result line | SDK, canvas |
| Invite and party | `social.invite` / `social.link`; `players`, `coop`; a room via `multiplayer.join`; two quick-chat lines in the game's own words | SDK, canvas (quick chat) |
| Leaderboards and "strangers in your world" | `bloomplay.board(name)`: one rank per board, a new board per week or day | SDK; the canvas never specifies a score type or scope |
| Ghosts and challenge links | A best-run replay and a challenge score for solo games | Canvas only |
| Shape it (requests) | Replies, status moves, shipping with the request ids | SDK (`list_feedback`, `patch_prompt`, `publish_live`), canvas |
| Continue | `progress.set("…")`, the place string | SDK, creator kit |
| Friend lines | The game's own verbs ("is on the bench now") | Canvas |

The canvas also shows platform badges, a level and XP on the result card, and a Daily Bug. What a game reports for XP or the Daily Bug is not defined anywhere.

## Discovery

A place on Home is earned, never bought; what a game controls is its words, tags and art.

| Placement | How a game gets there | What the game must have |
| --- | --- | --- |
| For You wall | Earned: loved %, moments completed, players coming back the next day, shares; a wall slot opens by rotation | Tier 1 art at least (tier 0 is not eligible); a living poster to play on the wall |
| Featured (pick of the week) | Editors' pick, one a week, no repeat within 6 weeks | A commissioned move of its poster (tier 2) |
| Editors' picks, jams | Editors look for a 10-second hook, phones loading under 3 s, a clear cover; jams through `jam` in `game.json` | Cover, one-line pitch, jam tag |
| Home shelves | Grouped by `mood` (SDK) | One mood word from the platform's list |
| Vibe wall | Membership in 1–3 of 7 vibes (canvas) | Vibes chosen by the maker |
| Search and Discover | Matches name, tags, vibes and derived words (short, solo, together, phone, new, gem); rows for Hidden gems and Brand new | Tags, length, players, inputs |
| More like this | Today: four neighbours listed by hand in the game's data | Nothing yet; the platform rule is not defined |
| Lists (In play, New this week, Most played, Most shaped) | Platform counts | Three stills |

Two vocabularies exist side by side and are not reconciled: the SDK's 17 `mood` words and the canvas's 7 vibes.

## Before publish

Two sets of checks exist: the automated `publish_checks` in the SDK, and the seven checks on the Publish screen. Store items and the pass also wait for staff review.

**`publish_checks` (SDK)** — the folder and `index.html`; runs in the browser; load time; phone controls; cover and one-line pitch; the SDK wired in; the jam entry if any. `logic.js` / `logic.wasm` must pass the determinism lint.

**Publish screen (canvas)**

1. Everything's inside the game (no outside requests).
2. Phone controls work.
3. Saves come back, and settings keep their own save.
4. Big moments marked.
5. Says honestly how many can play.
6. Cover picture.
7. Store waits for review.

**Review and policy**

- Every product and pass is reviewed by staff; nothing sells before approval; an edited price goes back to review while the approved price keeps selling.
- Nothing you can buy beats other players; limited items say when they return.
- Words: no "teardown", "Fair Play", streak or scarcity language (creator kit copy lint).
- Never imitate a named game's characters, names, art or text.
- `contentNote` when it applies (e.g. flashing lights); `permissions` only for devices the game uses.
- Safety around parties: quick-chat only with strangers, report and block on every seat, under-13s only in protected parties (canvas).
- The creator's own art self-check in Studio (squint at 90×70, small marks, colours, no numbers in art, reduced motion) is designed but not built.

## Gaps and open questions

Nineteen things need a decision before the kit can be a single spec. The first eight block an upload today; the rest are inconsistencies to clean up. Write the call in the last column.

| # | Question | What disagrees, or what's missing | Decision |
| --- | --- | --- | --- |
| 1 | Which item types can a game sell, and is there a price guide? | SDK sets fields only; roster pages use placeholder prices that disagree |  |
| 2 | Do per-game starter packs, bundles, featured items or sales exist? | Defined nowhere |  |
| 3 | What is the cover? | SDK and Publish: 16:9 (1920×1080, no text); creator kit: 2:1 poster; Studio A/B: 2:3 with a big title |  |
| 4 | How long is a pass, and how many bug.pass rewards does it hold? | SDK: \~30 steps, one `memberReward`; canvas: 30, 24 or 20 steps; 2–3 bug.pass rewards on every roster page |  |
| 5 | How fast does a pass fill? | SDK: one step per \~20 min of play; canvas: one step per round ("every swim") |  |
| 6 | Can a pass or event hand out crumbs, and who pays for them? | Roster passes give back more crumbs than they cost; no rule |  |
| 7 | Can a tier-1 game get a game page today? | The page build requires event, update, share and reward art that the creator kit calls tier 2; tier 0/1 fallbacks are not built |  |
| 8 | Tags: who sets them, how many, from which list? | SDK: up to 5 free words; Publish: up to 4; Studio: players add them; Discover: a fixed 12 |  |
| 9 | Mood (SDK, 17 words) or vibes (canvas, 7) — or both? | Two vocabularies, not linked |  |
| 10 | What is the "small gift" for games without a pass? | SDK has `memberGift`; the canvas never says what it is |  |
| 11 | Can Free creators sell looks? | Plans board: yes; Publish screen: "Selling comes with bug.pass" |  |
| 12 | Are members-only chapters allowed? | Offered in Publish; conflicts with "never sell unfinished content" |  |
| 13 | Leaderboards: score type, scope, what a revive tag means | Only the SDK `board` exists |  |
| 14 | Daily Bug and XP: does a game report anything? | Shown on the result and Home; not defined |  |
| 15 | More like this: what rule picks neighbours? | Hand-listed today |  |
| 16 | Size and load budget | No cap; only "phones under 3 s" as an editors' wish |  |
| 17 | Gameplay media sizes (screenshots, trailer) | In the SDK, not in the creator kit |  |
| 18 | Are item purchases refundable? | Wallet: unspent crumbs within 48 h; store rules: "refunds within 48 hours" |  |
| 19 | One source for game facts | Size, length and players differ between a game's page and the You boards |  |

**Fixes needed on the canvas** (they break standing decisions): "game sheet" still appears on six boards (now "game card"); "80%" and "70/30" show on public pages; streak words appear in Inbox and badges; friend-score comparisons on the return board; the template game page still lists invented catalogue games.
