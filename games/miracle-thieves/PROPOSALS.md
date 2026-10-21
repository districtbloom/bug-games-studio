# Miracle Thieves: what to sell, what to earn, what comes next

Round 1, design first (ROUND.md §0 and §4). These are proposals for Yelnur's yes, through the design chat. Nothing here is in the game's code or `game.json`, nothing is declared, and there are no prices: every price is **UNDECIDED**. The same proposals, for tools, are in `bug/design.json`.

Everything below is read against the build on `districtbloom/miracle-thieves` `main` (3df72de): `DESIGN.md` §3 (rules), §3.12 (commerce), §7 (bans), `src/client/save.ts` (`ACH`), `src/sim/defs.ts` (cosmetics, notoriety), `src/client/meta.ts` (when each achievement fires).

**The game's own commerce rules, which every proposal keeps** (DESIGN.md §3.12, §7):
- Nothing sells power.
- At most one paid recovery per player per run.
- No paid offer before the free rescue chance, and never after a teammate's knockout.
- Checkout never holds the squad.
- Cosmetics never change hitboxes, the colours of magic or the shape of a telegraph. Ruby and serrated shapes stay danger-only; friendly magic stays rounded; ivory stays "the safe way".

**How the game plays, in the four lines these proposals lean on:**
1. A run is a break-in, three areas, a boss and a **getaway** home at dawn. The getaway is the game's last word: your miracle floats over your head and the cathedral chases you out.
2. **Co-op is the point.** Shared XP, ghosts you rescue, and **duets**: one thief sets a foe up, another sets it off.
3. **Notoriety 0–5** is the long replay ladder; each level adds a twist and gives one cosmetic for the first win.
4. **Today's Job** is the daily seeded heist with a board, ranked on time.

---

## 1. Store items

Four items: the two real products and two new looks. Each new one is worn somewhere a player already looks every run.

| id | Name | Kind line | Status |
|---|---|---|---|
| `starter_pack` | Thieves' Starter Pack | Pack · six stolen looks, for all four thieves | **real** (in the build, not yet registered) |
| `miracle_relight` | Miracle Relight | Relight · once a run, after the free rescue | **real** (in the build, not yet registered) |
| `pending_ghosts` | Filed Under Pending | Ghost look · how you look while you wait to be rescued | proposal |
| `dawn_barrow` | The Dawn Barrow | Getaway look · what your miracle rides home in | proposal |

**Store row line:** *Stolen looks for broke wizards.*

### `starter_pack` · Thieves' Starter Pack (real)
- **What it is:** six cosmetics for every wizard: Crooked Mitre, Spoon-Crowned Beret, Stained-Glass Cloche (hats), Midnight Brocade (robe), Censer Staff (staff), and the Candlewax spell look. Durable.
- **How it fits:** the game's whole look is the contrast between patched thieves and a magnificent cathedral. These are the cathedral's own finery, stolen and worn badly. A hat is on screen the entire run, and in co-op your friends see it all run too.
- **What a player sees and does:** in the **Wardrobe** (title screen → "🎩 Wardrobe"), the pack's looks sit in each slot beside the earned ones. Buying it once dresses all four thieves. Ownership is re-checked every session (`commerce.ts`).

### `miracle_relight` · Miracle Relight (real)
- **What it is:** the once-per-run paid revive, consumable: back on your feet at full health with a moment of shelter.
- **How it fits:** the rescue game. It is offered only after the free chance is gone (the solo candle has burned out, or a co-op ghost has waited 8 s), never after a teammate's spell knocked you down, and at most once per player per run. A free "Restart run" always sits beside it. Checkout pauses only the buyer's screen.
- **What a player sees and does:** a small offer over their own ghost, with the price and the effect. It is never shown in the store row as a thing to stock up on: the tile exists so the Wallet can show what was bought.
- **Proposed change:** none to the rules. One words change: the store tile and Wallet call it "a relight", never "a life".

### `pending_ghosts` · Filed Under Pending (proposal)
- **What it is:** a ghost look. When a thief is knocked out they become a ghost the squad can rescue. This dresses that ghost as the cathedral's paperwork: your soul in a manila folder with a "Pending" ribbon, a filing drawer you drift in, or a candle in a confiscation jar. Three looks, one per variant, all wizards.
- **How it fits:** the game's own joke ("The Custodian's clerks confiscate your souls and file them under "Pending"", defs.ts). The ghost is the one moment a player isn't playing, so it is the honest place for a look. The ghost keeps its outline, its ground ring and its rescue circle exactly as they are, so a rescuer reads it the same.
- **What a player sees and does:** chooses it in a new Wardrobe slot ("Ghost"). Friends see it while they come to the rescue.
- **Needs:** a new cosmetic slot in the client (`save.ts` looks, the ghost renderer). Not built.

### `dawn_barrow` · The Dawn Barrow (proposal)
- **What it is:** a getaway look. During the getaway each thief's miracle floats over their head on the way home. This puts it in something stolen instead: the wheelbarrow from the opening, a padded transport case, a birdcage, a soup tureen. Four looks.
- **How it fits:** the premise ("four broke wizards arrive with stolen spellbooks and a wheelbarrow") and the game's payoff. It shows only in the getaway and the yard at dawn, so it never sits over the fight.
- **What a player sees and does:** picks it in the Wardrobe; sees it on the run home and in the dawn payoff, where every escaped thief's miracle manifests from it.
- **Needs:** a new cosmetic slot and its draw in `getaway.ts` / `fx-getaway.ts`. Not built. It must stay smaller than the thief and never in ruby.

### Turned down
- Anything that touches the four wants (Pim's sister's laugh, Lesk, Agnes, Tobiah). They are the game's sincere heart; selling them would cheapen them.
- Spell looks that recolour magic: banned by the game.
- Revive bundles, XP boosts, card rerolls, a second relight: all sell power or break the one-recovery rule.

---

## 2. The main paid featured item

**The Thieves' Starter Pack** leads the store.

- **Why this one:**
  - It is real: built, wired to `getEntitlements()`, and tested end to end against the dev host (`commerce-e2e` 13/13). The two new looks are proposals; the Relight is a recovery and should never be the thing the store pushes.
  - It is the item with the most surface: a hat, a robe and a staff on screen for a whole run, on every wizard, seen by friends in co-op.
  - It is the game's contrast in one purchase: the cathedral's finery on the thieves who robbed it.
- **Where a player meets it in the game:** the Wardrobe, opened from the title screen. Its looks sit in each slot beside the earned ones (Candle Stack hat, Choir Surplice, Gilded Crook, the notoriety looks), so a player sees exactly what they'd wear.
- **Where it is never pushed:** not during a run, not on the results screen, not on the knockout screen.

---

## 3. Achievements

The build has 20 (`ACH` in `save.ts`), 7 of which carry a platform moment. They already cover the break-in, the boss and the unlocks well. What they under-reward is what the game is most about: **duets, the getaway, Today's Job, and getting everybody out**. The proposal keeps all 20, fixes two, and moves five more onto the page as moments, for 12 in all (the platform's limit).

### Keep, with a moment (the 7 the build sends now; their seals are being made in this round)
| Name | Rule (as the build checks it) | Kind |
|---|---|---|
| Into the Cloister | Break in through the service entrance. | feat |
| The Custodian Wakes | Face the reliquary snail. | feat |
| A Miracle Stolen | Win a run. | feat |
| Nobody Left Behind | Rescue 5 friends, over any runs. | collection |
| All Seals Broken | Break all three seals in one run. | feat |
| Public Nuisance | Win a run at notoriety 3. | feat |
| Least Favourite Thieves | Win a run at notoriety 5. | feat |

### Keep, and add a moment (5, so they get a seal; seals wait for the yes)
| Name | Rule | Kind | Why it earns a seal |
|---|---|---|---|
| Two Hands, One Crime | Trigger 25 duets, over any runs: one thief sets it up, another sets it off. | collection | Duets are the game's co-op idea. Today nothing on the page says so. |
| Under the Wire | Escape with your miracle in the last 15 seconds. | feat | The getaway is the payoff; this is its best story. |
| Kettle On | Get every thief out in one run, two or more of you. | feat | The co-op ending: nobody caged. **Rule change below.** |
| Daily Bread | Win 5 of Today's Jobs, over any days. | collection | The daily heist is the game's reason to come back; it has no seal. |
| Slow and Steady | Win with every wizard. | collection | The four thieves are the game's people; this one is their set. It already gives the Snail Helm. |

Proposed page order (the page shows 8): Into the Cloister · The Custodian Wakes · A Miracle Stolen · Nobody Left Behind · Two Hands, One Crime · Under the Wire · Kettle On · All Seals Broken · Daily Bread · Public Nuisance · Slow and Steady · Least Favourite Thieves. The first eight tell a run in order: in, the boss, the win, the rescue, the duet, the getaway, everyone out, the full heist.

### Change
- **Kettle On:** today it fires on any run where every thief escapes (`meta.ts`: `f.escaped === f.players`), so **any solo win earns it**. Proposed: count only when two or more thieves started the run. That makes it the co-op seal it reads as.
- **Ropes, Smoke and Wax:** its line still says "Muffle". The reaction was renamed **Lost Wax**. Proposed line: "Trigger Snapback, Burnt Offering and Lost Wax in one run." (Stale text; also noted in `bug/NOTES.md`.)
- **Daily Bread:** its line says "Complete 5 daily heists… Today's Job counts when you win it". Proposed, plainer: "Win 5 of Today's Jobs, over any days." Same rule.

### Keep as they are, no moment (8)
Crooked Galleries, Wax Breaker, Holding Pattern (they are unlocks and fire in the first run or two), Absurdly Powerful, Catastrophic Chemistry, Clean Getaway, New Tricks, Ropes, Smoke and Wax.

### Not proposed
- New achievements for buying anything. None.
- More notoriety seals (N1, N2, N4): the ladder already has two seals and five cosmetics; more would crowd the page.

---

## 4. The pass

- **Name:** **The Stolen Ledger**.
- **Step unit:** **a page**: one page of the cathedral's confiscation ledger, torn out each time you finish a heist (won or caught: you still made a mess of their paperwork).
- **One sentence:** *The cathedral's confiscation ledger, stolen; every heist tears out a page, and every page gives back something they took.*
- **How it fits:** the cathedral speaks in permits, confiscation and filing (DESIGN.md §6), and the game's motifs are numbered brass ownership plates, ruby wax seals and confiscation ledgers (§5). The rewards are the cathedral's confiscated finery, which is exactly what the game's cosmetics already are.
- **What a player sees and does:** plays heists as normal. Each finished run tears out a page and the marker moves along the rail. Nothing on the pass changes a run.
- **Marker:** a torn ledger page with a ruby wax seal (next: fluttering over the next cell; held: pinned flat on the last).
- **Rewards** (all looks, in the game's four slots; none exists in the build yet unless marked):

| Row | Reward | Slot | Look |
|---|---|---|---|
| free | Ledger Clip | hat | a brass bulldog clip worn as a crown, a page still in it |
| free | Ink-Stained Cuffs | robe | the wizard's robe with blotted clerk's cuffs |
| free | Pew Number | staff | a numbered brass ownership plate screwed to the staff |
| pass | Archdeacon's Lampshade | hat | a fringed vestry lampshade, worn with total confidence |
| pass | Confiscated Cope | robe | a gold-thread cope three sizes too big, hem patched |
| pass | Sanctus Bell Staff | staff | a staff with a little hand-bell lashed on with twine |
| pass | Sealing Wax | spell look | the same element colours, finished as dripped and stamped wax |
| pass | Reliquary Hood | hat | a glass relic dome, leaded, worn as a helmet |

- **bug.pass row:** left to bug.games; I haven't assumed what it holds.
- **Rules kept:** spell looks keep every element's colour; no reward changes a hitbox or a telegraph.

---

## 5. The event

- **Name:** **Lost Property Night**.
- **What everyone does:** for one week the cathedral holds its annual lost-property auction, and the precinct is stacked with confiscated odds and ends. Every **displaced relic** a squad wheels home to the wheelbarrow (the run's first objective, at about 62 s) counts toward one shared pile for everybody. When the pile is high enough, every player gets the event seal and a look.
- **Counter unit:** **relics wheeled home**.
- **Target:** UNDECIDED.
- **How it fits:** the relic objective is the first optional detour of every run, and today it's the one players are most likely to skip. The event makes it the thing everyone does together, without changing a rule: the relics are the same objective, with the same rewards.
- **What a player sees:** the precinct dressed for the auction (lot tags on the relics, bunting of confiscation tickets), and the counter on the page.
- **Not this:** Today's Job is the daily heist, not an event.

---

## 6. The planned update: what could be improved in the game

- **Title:** **Complaint Upheld**
- **The change, in one line:** the cathedral has read the complaints: the middle notoriety levels bite in duo, the falling bells hurt, Fire Ribbon is fairer against the boss, phones keep their frame rate in the Custodian fight, and the old wrong words are fixed.
- **Why a player would care:** notoriety is the reason to play again, and today duo is too easy from Whispered to Infamous. Phones are where many people will play, and the boss fight is the heaviest scene.
- **What changes**, from HANDOFF.md ("What I would do next", known bugs, draw calls, balance) and DESIGN.md §10:
  1. **Duo notoriety 1–4 bites.** Measured duo wins are 92–100% from N1 to N4, then 50% at N5. Target a smooth curve.
  2. **Falling bells (N3) can hurt**, with their ruby ground warning kept.
  3. **Fire Ribbon** keeps its crowd strength at tiers 1–3 and gains some against the Custodian.
  4. **Getaway clock** moves into the middle of its 55–75% target (it uses 55–58% now).
  5. **The Custodian on low detail** drops to the phone draw-call budget (≤110; it measures 106–120), and the yard ending on high gets lighter (259 calls).
  6. **Stale words fixed:** "Muffle" → Lost Wax in Ropes, Smoke and Wax; `game.json`'s v1 description and its 13 minutes; `HURT_NAMES` capitalisation; the "1 hp / 2 s" comment.
  7. **Kettle On** counts only with two or more thieves (§3 above).
- **Before it can ship:** the game has to be on bug.games and played on a real phone and GPU (HANDOFF items 1–3). This is a plan only; nothing in the game changes in this round.
- **Date:** UNDECIDED.

---

## Open for Yelnur
1. The two new looks (`pending_ghosts`, `dawn_barrow`) need new client code: yes, or keep the store to the two real products for now?
2. Five more moments (12 in all), and the Kettle On rule change.
3. The pass and the event: their names, and whether either runs at all.
4. Run length on the page: the build's first win is about 6–7 minutes against the brief's 10–15 (`game.json` says 13). The words in this round say what the build does.
