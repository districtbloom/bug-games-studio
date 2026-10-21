# SDK notes

**The real contract is the bug.games SDK reference.** If your chat has the bug.games connector, read it with the connector's `sdk_docs` tool (and use `publish_checks` on a preview, never `publish_live`, in this round). It is the only full and current version: every call, the save layer, multiplayer, boards, files and the rules for `index.html`.

For creators **without** the connector, below are the parts a package depends on, copied verbatim from the SDK reference as of 19 Oct 2026: the store and pass calls, and the whole `game.json` section (storefront metadata, products, pass, memberGift) with the paragraphs that follow it. Two reading notes from the platform:

- The numbers in the comments (`"price": 40`, "60 a revive, 300 a look, 700 a whole story", a pass at 950 crumbs for 30 days) are **syntax examples, not a price guide**. In this round every price is `"UNDECIDED (Q1)"`, and pass `price` and `days` are `"UNDECIDED (Q4)"` (see `UPLOAD_KIT.md`, last section).
- This round is a dry run: **do not** add `products`, `pass` or `memberGift` to your `game.json`. Draft them in `store.draft.json` and `pass.draft.json` with the same field names.

## Store and pass calls (verbatim)

```
  bloomplay.monetization.getProducts() / purchase(productId) / getEntitlements()
                                                                          // prices are crumbs (~€0.01 each). Products are
                                                                          // staff-approved; the list is EMPTY until then.
                                                                          // entitlement productIds: your product ids,
                                                                          // pass:<passId>, pass:<passId>:<rewardId>,
                                                                          // gift:<giftId> (a bug.pass member, no pass)
  await bloomplay.monetization.getPass()                                   // { pass, progress, member, gift } — your
    -> pass: { id, productId, name, price, days, startsAt, endsAt,          // game.json pass as approved, or null. Steps
               stepSeconds, steps: [{ step, free, pass, member }] }        // fill from foreground play (~1 per 20 min),
       progress: { step, seconds, nextStepInSeconds, owned, claimed }      // the platform counts it — you never report
  bloomplay.monetization.purchase(pass.productId)                          // buy the pass track: same sheet as products
```

## game.json: storefront metadata, products, pass (verbatim)

```
Storefront metadata — game.json at the workspace root (all fields optional,
validated at publish; a bad file is a directive, not a deploy):
  {
    "title": "Red Wind", "hook": "An ink-brush sword duel. Read the sleeve, cut once.",
    "description": "Longer copy. Blank lines make paragraphs.",
    "mood": "triumphant",           // the feeling a player is LEFT with. One word from the platform's
                                    // vocabulary: thrilling/tense/frantic/brutal/triumphant,
                                    // cosy/gentle/homely/meditative, curious/playful/strange/clever,
                                    // tender/melancholy/lonely/bittersweet. The home page groups by the
                                    // SHELF (the first word of each group); your page shows your word.
                                    // A word we do not have is refused WITH the list, and your ask is
                                    // recorded — two games asking makes it claimable.
    "genre": "Duel", "minutes": 2,  // typical session length
    "tags": ["ink-brush duel",      // up to five, 2-24 chars, in YOUR words. They show under your title
             "read the sleeve",     // exactly as written — the one line on the page in your voice — and
             "one cut"],            // the store folds them onto its own shelves so players find you.
                                    // A word we have not folded yet is NOT refused: it still shows, it
                                    // just adds no shelf until somebody files it, so an unusual one
                                    // costs you nothing. Say what the game IS: no superlatives, no other
                                    // games' names, no prices.
    "players": "1", "coop": false,  // coop = players in ONE session together (a room). Seeing each other —
                                    // presence, a board of other people's times, a ghost, an invite link —
                                    // is NOT co-op, and the card says "Co-op" to two people who then can't.
    "inputs": ["keyboard", "mouse"],  // keyboard | mouse | touch | gamepad ("touch" = playable on phones)
    "permissions": ["microphone"],  // microphone | camera — delegated into your frame so getUserMedia can work
                                    // at all (your frame is another origin). Declaring is not granting: the
                                    // browser still asks the player. Omit it unless the game needs the device.
    "controls": [{ "key": "Click", "action": "Cut" }, { "key": "Space", "action": "Step aside" }],
    "moments": ["The first exchange", "Half health", "The final cut"],   // in play order, ≤12
    "cover": "cover.png",           // 16:9 key art in the workspace (write_file_base64)
    "screenshots": ["shot1.png"], "trailer": "trailer.mp4",
    "accent": "#c8452a", "contentNote": "Flashing lights.",
    "jam": "one-light",             // enter the game jam with this tag at publish (the current one is at
                                    // /api/jams/current); ignored once it has ended — publish_checks says so
    "products": [                   // things you ask to sell for crumbs. DECLARING IS NOT SELLING: staff
      { "id": "second-wind",        // approve each one, and getProducts() returns the approved ones only.
        "name": "Second Wind",      // id is permanent (entitlements point at it) — rename via "name".
        "description": "One more pass at the duel you just lost.",
        "price": 40,                // crumbs, about €0.01 each: 60 a revive, 300 a look, 700 a whole story
        "kind": "consumable" },     // consumable = buyable again | durable = owned once, second buy refused
      { "id": "lantern-ember", "name": "Ember lantern", "price": 300, "kind": "durable",
        "limited": "Back in December" }   // a limited item MUST say when it returns
    ],
    "pass": {                       // OPTIONAL: your game's pass. Reviewed like products. Free track for
      "id": "lamplight",            // everyone, pass track bought with crumbs, one bug.pass reward.
      "name": "Lamplight pass", "price": 950, "days": 30,    // runs "days" from approval; new id = new season
      "steps": [                    // ~30 steps; one fills per ~20 min of play (the platform counts it)
        { "free": { "id": "moth-sticker", "name": "Moth sticker" },
          "pass": { "id": "night-wings-dusk", "name": "Night Wings, dusk" } },
        { "pass": { "id": "lantern-trail", "name": "Lantern trail" } }       // either track, or both
      ],
      "memberReward": { "step": 10, "id": "gold-dust-wings", "name": "Gold-dust wings" }
    }
    // no pass? "memberGift": { "id": "extra-revive", "name": "1 extra free revive every run" }
    //   — bug.pass members hold the entitlement gift:extra-revive while they are members
  }
Moments are the spine of the game page: each declared moment is an
achievement (report it with bloomplay.progress.moment(name) — undeclared
names are ignored), bug flags and share links pin to them, the maker's
funnel is drawn over them, and a player who remembers nothing else can
find your game by searching one. A game without game.json still
publishes; it just has a bare card.

Selling things: declare them in game.json, publish, then list_products. A
declaration is a REQUEST — platform staff approve each product before a player
can spend a crumb on it, because crumbs are bought with real money and only the
platform can stand behind what they buy. Nothing you can buy beats other
players: staff refuse anything sold into a versus or ranked mode that makes the
buyer stronger there, and a limited item that does not say when it returns. So bloomplay.monetization.getProducts() is
EMPTY until approval: draw the shop from what it returns and an unapproved
game shows a shop with nothing in it, not a broken screen. Approval copies your
declaration into the platform's own row, so editing a price afterwards does not
change what players are charged — it goes back into review while the approved
price keeps selling. Entitlements are per player and forever (durable); a
withdrawn product stays owned by whoever bought it.
```
