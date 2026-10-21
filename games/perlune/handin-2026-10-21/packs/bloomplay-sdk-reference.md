# @bloomplay/runtime cheat sheet

Games run in a sandboxed iframe on a separate origin and talk to the platform
via the SDK (never fetch() bloomplay APIs directly — there are none exposed
to the game origin).

Include the SDK (served on the game's own origin — always use this exact path):
  <script type="module">
    import { bloomplay } from "/sdk/bloomplay.js";
    const ctx = await bloomplay.init({ preload: ["save"] });
    // ctx = { gameId, channel, user, capabilities, joinPayload, preloaded }
    // ctx.joinPayload?.data is whatever you put in social.invite/link payload —
    // untrusted on the way back (stale, hand-edited, another version).
    // ctx.preloaded.save is your save, ALREADY READ — { ok, value, version,
    // updatedAt }, version 0 if never written. No watchdog, no second render.
    // Write exactly this, because it is also right when the platform could not
    // read them (preloaded === null) and when you asked for more than 8 keys:
    //   const box = ctx.preloaded?.[key] ?? (await bloomplay.kv.tryGet(key));
    //   if (box.ok && box.version === 0) adoptTheLocalSave();
    // Never read a missing entry as an empty account.
    // ctx.joinPayload?.roomId is set when the player arrived via an invite
    // link — pass it to multiplayer.join({room}) / logic.join({room}).
    bloomplay.loaded();                    // hide platform loader when interactive
  </script>

Keeping the game runnable outside bloomplay (its own dev server, an offline
build, its tests) is worth the four lines it costs:
  if (window.parent === window) return null;        // check BEFORE importing,
  const { bloomplay } = await import("/sdk/bloomplay.js");  // or every offline
  if (!bloomplay.isEmbedded) return null;           // run logs a 404/CORS error
  const ctx = await bloomplay.init({ preload: ["save"] });
The connection belongs to the TOP frame: bloomplay.isEmbedded is false inside
a game nested in another same-origin frame (an anthology, a level editor's
preview, playing a friend's creation inline) — that frame cannot hold the
connection and init() there never resolves, so forward to the top frame
yourself. bloomplay.connected says whether the host has answered yet. If a
boot-time decision depends on the answer, do NOT sample a timer: pass
init({timeout}) and handle the rejection. A game that sampled at 1.5 s and
guessed wrong put two real players alone in their own browsers with an ONLINE
chip lit and no error anywhere.
Bundlers: esbuild/Rollup need /sdk/bloomplay.js marked external; Vite resolves
it before that and needs import(/* @vite-ignore */ "/sdk/bloomplay.js").
TypeScript cannot resolve a path-like specifier at all — @ts-ignore the import
and declare the slice you use.

Declare your save key in init({preload}) and the platform reads it before it
answers, so you render once with the right state. Otherwise the save is a
second round trip after the handshake and you need a watchdog to gate play on
it — and no clock inside a game is a bound: a setTimeout deadline starved by a
render loop fired at 13.6 s against a 2.5 s cap, and driving it off the frame
loop instead turned a 1.2 s debounce into 12 s at 2 fps.

Report loaded()/gameplayStart() from ordinary code, NOT from inside your
render loop: a throttled or starved frame loop makes the edge arrive late or
never. Anything you do before init() resolves is not recorded — if play can
start during the handshake, remember the state and re-emit it on connect.

If your boot takes more than a couple of seconds, call bloomplay.loading(0..1,
label) as it goes: the platform draws your figure and your words instead of an
indeterminate spinner over nothing, and a game that is reporting progress is
never given up on — without it, the platform's patience runs out at 25 s and it
draws a failure card over a game that is working. Loads in this catalogue run
5.8 s to 50 s. Then loaded() when the player can actually act.
THE FIRST STAGE IS THE ONE YOU LOSE, and moving the call earlier in your bundle
cannot save it: bloomplay.loading lives in a module your bundle has to await
import() first, and three games measured 79%, 91% and 14 s of their boot going
by before that resolved. Put three lines in your page HEAD so the module is in
hand before your first statement:
  <script type="module">
    if (window.parent !== window)
      window.__bp = import("/sdk/bloomplay.js").then(m => m.bloomplay);
  </script>
then: const bloomplay = await window.__bp — the same module instance.

YIELD WHILE YOU BOOT. Your frame and the page hosting it share an event loop,
so a boot that never hands the thread back cannot report to it and cannot be
answered by it: one game's handshake landed at 11.1 s of an 11.1 s world build.
A setTimeout(r, 16) between stages is enough; rAF is not (a hidden tab never
runs one, and your boot would never finish). Report a FRACTION on every call
once you have reported one at all — a label with no fraction swaps the bar back
to an indeterminate spinner, so a game that gives 25% and then a bare label
makes its own bar vanish. If the boot dies, call bloomplay.failed(message)
rather than loading(0, message): reporting progress buys patience, which is
exactly backwards for a page that is not coming back.

onPause tells you WHY: "hidden" (the tab — the browser has already stopped your
render loop), "signin" / "purchase" (a platform sheet is up; the player is still
here and the clock is still theirs), "dialog", "page". If you are in a co-op
room you must KEEP SIMULATING while hidden — a frozen host stalls everyone else
— so mute rather than stop, and run a throttled timer you are not drawing. Note
that your frame's own visibilitychange fires as well as onPause, so guard your
pause routine for idempotence; and do not resume audio on onResume if the
player left your own pause card up. On the way back, onResume carries hiddenMs
— resync from it rather than running your world forward from a clock that was
not ticking.

APIs (all async unless noted):
  ctx.user                                                                // the player, already in the handshake —
                                                                          // do NOT call profile.get() at boot for it
  bloomplay.profile.get() -> { id, username, displayName, avatarUrl, registered } | null
  bloomplay.profile.requestSignIn() -> profile | null
  bloomplay.profile.onChange(fn)                                          // fires when they sign in
  bloomplay.kv.get(key) / set(key, value) / delete(key) / list({prefix})   // per-player JSON store, 128KB/value,
                                                                          // 1024 keys (ctx.limits has the numbers)
  bloomplay.kv.getEntry(key) -> { value, version, updatedAt }             // version/stamp from the SERVER; absent key
                                                                          // reads { value: null, version: 0, updatedAt: null }
  bloomplay.kv.set(key, value, { ifVersion }) -> { version, updatedAt }   // compare-and-set; a stale write is refused
                                                                          // with code "conflict" and stores nothing
  bloomplay.kv.tryGet(key) -> { ok: true, value, version, updatedAt }     // never rejects; on failure there is no value
                            | { ok: false, error }                        // and no version to mistake for an empty account
  bloomplay.kv.tryList({prefix}) -> { ok, keys, cursor } | { ok: false, error }
  bloomplay.kv.getMany([keys]) -> { ok, entries } | { ok: false, error }   // one round trip; absent keys read version 0
  bloomplay.kv.setMany({k: v}, { ifVersions? }) -> { k: {version} }        // ATOMIC: all of them or none (32 keys max)
  bloomplay.kv.clear() -> { deleted }                                     // every key this game holds for this player
  bloomplay.kv.setOnExit(key, value)                                       // (sync) the value the platform writes if
                                                                          // the page goes away — call it on every
                                                                          // change; pagehide cannot await an RPC
  bloomplay.kv.health -> { reachable, error, failures }                    // are saves reaching the account? null = untested
  bloomplay.save({ key, cache, legacyCache?, merge?, debounceMs? })        // the whole save layer, done once — see below
  bloomplay.files.put(name, blob, {contentType?}) -> { size, sha256, … }   // the things a player MADE — kv is JSON
  bloomplay.files.get(name) -> { blob, size, contentType, sha256 } | null  // with a 128KB cap and an artifact is
  bloomplay.files.list(prefix?) -> { files, usedBytes }                    // neither. 8MB/file, 512 files, 64MB.
  bloomplay.files.remove(name) / bloomplay.files.clear(prefix?)           // Absence reads as null, not a throw; a
                                                                          // FAILED read throws with a code. clear()
                                                                          // lists first, so it reaches files this
                                                                          // device never held. Content-addressed, so
                                                                          // the same bytes are stored once and
                                                                          // CHARGED twice.
  bloomplay.board(name)                                                    // state shared with other players — see below
    board.put(value, { id?, rank? }) -> row                               // a row of YOUR OWN; same id replaces it
    board.top(limit?) / board.list({ order, dir, limit, cursor })          // everyone's rows, ordered by the SERVER
    board.mine() / board.remove(id?)                                      // yours only — nothing names another's row
    board.sample(n?)                                                      // a few of ANYONE's rows, at random, never
                                                                          // yours — strangers in a solo player's world
    bloomplay.board(name, { parse })                                      // parse(value, row) — THROW to drop a row
                                                                          // you would not have written. It moves the
                                                                          // guard off every call site; it does not
                                                                          // replace clamping, because a clamp must
                                                                          // not become a refusal. The name on a row
                                                                          // is row.by's — never put one in the value
  ctx.limits -> { kvValueBytes, kvKeys, kvBatchKeys, invitePayloadBytes,   // real numbers — measure, don't guess
                  boardValueBytes, boardRowsPerPlayer, boardsPerPlayer,
                  boardListLimit, boardRetentionDays, roomMessageBytes,
                  fileBytes, files, fileTotalBytes }
  bloomplay.hostLatencyMs                                                  // what the platform has been taking (ms);
                                                                          // reads reject after 20s, writes never do
  bloomplay.kv.onHealthChange(fn)                                          // one edge per change, so you can say it once
  bloomplay.analytics.track(event, props?)                                // fire-and-forget (sync)
  bloomplay.gameplayStart() / gameplayStop()                              // call on real play start/end (sync)
  bloomplay.loading(0.4, "Building the district")                          // (sync) your own boot progress — replaces
                                                                          // the platform spinner AND buys patience.
                                                                          // Posted at once, not queued behind init().
  bloomplay.failed("This game needs WebGL.")                               // (sync) the boot is DEAD — the opposite of
                                                                          // patience. The host says so, in your words.
  bloomplay.onPause(({reason}) => …) / onResume(fn)                        // reason: hidden | signin | purchase |
                                                                          // dialog | page
  bloomplay.onMute(muted => …) / bloomplay.muted / ctx.audio.muted         // the platform's sound switch. NOT a
                                                                          // pause: keep running, keep the clock,
                                                                          // stop your own sound. Read it before
                                                                          // your first note — they can arrive muted.
                                                                          // On iOS the SDK does two things for you on the
                                                                          // first touch inside your frame: resumes every
                                                                          // AudioContext you made, and keeps a looping silent
                                                                          // <audio> playing while your frame is visible, so the
                                                                          // ringer switch stops silencing Web Audio.
                                                                          // Still call resume() in your own gesture handler
                                                                          // for the copy that runs off-platform.
  bloomplay.now() -> epoch ms                                              // the PLATFORM's clock. Date.now() is the
  bloomplay.clock -> { trusted, skewMs, uncertaintyMs, syncedAt, stale }   // PLAYER's: moving it an hour is one OS
  await bloomplay.syncTime() -> epoch ms                                  // setting, so a daily reset decided by it
                                                                          // is decided by them. ctx.time carries the
                                                                          // first reading (no round trip at boot);
                                                                          // syncTime() again after a long session or
                                                                          // a sleep (clock.stale says which).
                                                                          // trusted:false = we could not reach the
                                                                          // server and this IS the device's clock:
                                                                          // draw the day, do not GRANT on it, say why.
                                                                          // Off the platform it answers Date.now()
                                                                          // with trusted:false, so a standalone
                                                                          // build still runs.
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
  bloomplay.multiplayer.join({room?, maxPlayers?, reconnect?, create?, durable?})  // create: ifMissing (default) |
    -> { roomId, selfId, peers, maxPlayers, resumed, created, durable, restored }  // never ("an invite is not a
                                                                            // room-maker") | only ("this code is mine")
  bloomplay.multiplayer.join({room: "camp:ada", durable: true})              // a PLACE: its state is written down and
                                                                            // handed back when the name is next
                                                                            // dialled. Needs a name. Nothing else
                                                                            // changes — setState, onState, and nobody
                                                                            // resolves a conflict, because writes
                                                                            // already arrive in one order.
                                                                            // restored = this world came out of
                                                                            // storage; created && restored is a new
                                                                            // room holding an old world. A world that
                                                                            // could not be READ refuses the join
                                                                            // instead of looking empty. Ceiling:
                                                                            // ctx.limits.durableRoomBytes, refused
                                                                            // whole. Not a backup.
  bloomplay.multiplayer.rooms() -> [{ id, players, maxPlayers, open, full, label }]  // the lobby: who is playing
                                                                            // BEFORE joining. REJECTS when the
                                                                            // directory could not be read — an empty
                                                                            // lobby and one you could not look at are
                                                                            // different screens. players counts HELD
                                                                            // seats (a dropped line keeps its chair
                                                                            // 20 s), and the directory is eventually
                                                                            // consistent, so your first read after
                                                                            // your own join may not list your room
  bloomplay.multiplayer.label("VEX · DANCE BATTLE")                          // what to CALL this room in that list.
                                                                            // Everything else that tells one room
                                                                            // from another is in its state, which you
                                                                            // can only read by joining. Untrusted,
                                                                            // like a board row. ctx.limits.roomLabelChars
  bloomplay.multiplayer.open(false)                                         // stop matchmaking filling this room —
                                                                            // an invite code still reaches it
  bloomplay.multiplayer.topics(["agency-1"])                                // which topics inside the room you hear
  bloomplay.multiplayer.send(data, to?) / setState(partialState) / leave()   // to: one peer id or an array of them
  bloomplay.multiplayer.send(data, { topic: "agency-1" })                    // only the peers listening to it
  bloomplay.multiplayer.away / onPeerAway(fn) / onPeerBack(fn)               // their line dropped; the runner is
                                                                            // holding their seat — not gone
  bloomplay.multiplayer.pressure / onPressure(fn)                            // { bufferedBytes, level } — ok |
                                                                            // behind | saturated. Send less.
  bloomplay.multiplayer.state                                                // room state as it stands
  bloomplay.multiplayer.onMessage(({from, data, seq}) => …)                 // seq counts the SENDER's sends, so a gap
                                                                          // means a message addressed elsewhere
  bloomplay.multiplayer.onPeerJoined(fn) / onPeerLeft(fn) / onMessage(fn) / onState(fn)
  bloomplay.multiplayer.presence({ready: true, floor: 3})                 // your own card: scoped to your peer id,
                                                                          // whole record published, silent when
                                                                          // unchanged, one write per tick, moved for
                                                                          // you when you reconnect as a new peer
  bloomplay.multiplayer.presences / presenceOf(peerId) / onPresence(fn)    // live peers only — a departed peer is gone
  catch (e) { e.detail }                                                  // WHY a room refused, so you need not read
                                                                          // the prose: room_full | no_such_room |
                                                                          // room_taken | room_closing | node_draining |
                                                                          // directory_unreadable | world_unreadable |
                                                                          // world_too_large | place_needs_name |
                                                                          // too_many_places. world_unreadable is the
                                                                          // one you must NOT work around: the world is
                                                                          // THERE and unread, so writing over it is
                                                                          // how an older copy replaces it
  bloomplay.multiplayer.roomId / .selfId / .maxPlayers / .connection        // no need to stash the join reply;
                                                                          // maxPlayers is the ROOM's, not your hint
  bloomplay.multiplayer.onConnectionChange(fn)                            // { state, roomId, selfId, peers?, downMs?,
                                                                          //   reason?, resumed? } — see below
  bloomplay.social.invite({payload?}) -> { ok, how, url }                  // share sheet with a room invite; how is
                                                                          // "shared" | "copied" | "unavailable", and
                                                                          // payload comes back as ctx.joinPayload.data
  bloomplay.social.link({payload}) -> { url }                              // a link into your game, no room — point at
                                                                          // a piece, a seed, a level someone built
  bloomplay.social.share({title, text, url, file}) -> { ok, how }          // share what the player MADE (file: a Blob)
  bloomplay.progress.set("Round 2 of 3")                                 // label on the player's "Continue" card (sync)
                                                                          // (write-only: a game cannot read these back yet)
  bloomplay.progress.moment("Half health")                               // a manifest moment reached → achievement (sync)
  bloomplay.logic.join({room?}) -> LogicRoom                              // tier-1 (needs logic.js — see below)
    room.state / room.tick / room.playerId                               // predicted, 0ms-feeling
    room.act(name, payload?)                                             // submit an action
    room.onChange((state, tick) => render(state))                       // fires every tick + reconciliation
    room.onLogicChanged(fn) / room.leave()
    room.connection / room.onConnectionChange(fn)                        // a tier-1 seat is not resumed — see below

Dropped connections: connection is "connected" | "reconnecting" |
"disconnected", and onConnectionChange tells you which. Without it a drop is
indistinguishable from every peer leaving at once, which is what the first
generation of ported games all concluded.

The runner HOLDS YOUR SEAT for a grace window (~20 s). Join with
reconnect: true and a re-join inside that window puts you back in the same
chair: the same selfId, nobody in the room saw a leave or a join, and the card
you wrote into room state is still yours. The connected edge that follows a
drop carries resumed: true and seatKept: true when that happened. It also works
for a TIER-1 room, which could not be resumed at all before: the playerId is
baked into every client's prediction, and the seat is what keeps it.

If the grace ran out, the same edge carries seatKept: false and a NEW selfId —
then, and only then:
- the other players saw you leave and rejoin, so say your presence again
  (bloomplay.multiplayer.presence does this for you);
- anything you wrote into room state under your old peer id is an orphan
  (room state keeps every key forever) — clear it by name, you still know it;
- a peer's id IS its peer id, so match a returning player on username.
From the other side you are told onPeerAway(id) when a peer's line drops and
onPeerBack(id) when they take the seat back; peerLeft only ever means gone.
Hold their place in your UI in between rather than writing them off.
Without reconnect: true a drop is simply reported as disconnected.

Presence versus messages — the split is by late joiners, not by rate. Room
state (and presence, which rides on it) is the ONLY channel replayed to a peer
who arrives later; send() has no re-send. So: a field a newcomer needs goes in
presence; a field rewritten every tick — a position, a cursor — goes on send().
A send is capped at ctx.limits.roomMessageBytes and a refused one is NOT
delivered; watch multiplayer.pressure rather than guessing a margin. Room state
now travels as a delta, so a setState costs only the keys that moved, and a
write that changes nothing costs nothing — onState still hands you the whole
state, with a changed list naming the keys.
Use multiplayer.presence() rather than setState for anything per-player: it
writes only under your own peer id, publishes your whole record (so a player
standing still is still visible to a newcomer — the trap that made two idle
players invisible to each other), drops departed peers from the view, and after
a reconnect moves your card to your new peer id and strikes out the orphan
under the old one. Room-state keys starting with "bp:" are reserved for it.

Do not write a save layer by hand. bloomplay.save owns the localStorage cache
mirror, the debounce, the flush on pause, the legacy key, the handoff for the
end of the session, the preload declaration — and, the reason it exists, the
DECISION: a read that failed is not an empty account, which copy wins is the
server's version and never a clock, and the one write that can flatten another
machine's save carries ifVersion. Fourteen of the first nineteen ported games
wrote this by hand and got the same branch wrong, six of them with the two
halves in different files.
  const save = bloomplay.save({ key: "save", cache: "mygame.save.v3" });
  await bloomplay.init();            // preloads "save", because save() asked
  render(save.value ?? fresh());     // synchronous: the cache, before any await
  await save.ready;                  // decided; save.value is now the truth. Never
                                     // rejects — it guards your destroy button.
  save.set(next);                    // cache now, KV debounced, handed over
  save.pending / save.onSync((ok, err) => …)     // what a "Saving…/Saved" chip reads
  save.clear()                       // erase: deletes the ACCOUNT's copy. set(null)
                                     // cannot express this and never propagates.
  save.onChange(v => …) / save.flush() / save.version / save.origin / save.syncing
  bloomplay.save({ …, storage })     // when your cache is not one localStorage key
                                     // (a dozen settings keys, or IndexedDB) — hand
                                     // it yours rather than mirroring the save twice
merge is for a save that only GROWS (min on times, max on medals, OR on flags);
without it the account's copy wins, because it is the one that followed the
player. Two things to get right, because a lattice on its own gets both wrong:
an ERASURE needs a counter in the value that only rises, decided BEFORE the
union — if (a.reset !== b.reset) return a.reset > b.reset ? a : b — or "start
over" on one device is undone by the other — every monotonic save has a reset
button; and SETTINGS ARE NOT MONOTONIC, so keep preferences in their own key
rather than merging them with progress, or a volume set on a phone is reverted
by a laptop.
bloomplay.save is a method on this module, which is served from the games
origin — a game played from a plain static server never imports it. Import
localSave from "@bloomplay/runtime/save" and BUNDLE it for that case: it is the
same layer with no account under it, so the call sites do not branch.

Files are for what the player MADE — a photograph, a recording, a painted
level — because kv is JSON with a 128 KB cap and one real print is 116,939
bytes of JPEG, over the cap the moment it goes into JSON (binary in JSON is
base64, a third bigger). Scoped per game and per player exactly like kv; names
may hold slashes, so keep a shape (prints/2026-09-30-dunes.jpg); the same
bytes stored twice cost once and sha256 tells you whether what you hold is
what you stored. Show one with URL.createObjectURL((await files.get(n)).blob)
and revoke it after. There is no public URL and no way to hand one to another
player — that is social.share (which takes a Blob) or a board row.
Before reaching for it: if the artifact can be REPRODUCED, sync the recipe
instead. One game syncs a 385-byte camera pose and re-renders the photograph on
the new device, which is smaller, faster and works offline.

Boards are the only place state belongs to more than one player. kv is always
scoped to the calling player and room state dies with the room, so a register
of everyone's times or a daily board of bests had nowhere to live.
  const week = bloomplay.board("weekly-2026-40");
  await week.put({ suit: "grey", ghost }, { rank: -timeMs });   // rank sorts it
  for (const r of await week.top(10)) draw(r.by.displayName, r.value, r.mine);
  await week.list({ order: "rank", dir: "asc" })                 // lower is better
"The top ten" and "a few strangers" are different reads: top()/list() rank,
sample() puts other people in a solo session and the SERVER picks them, because
a game sampling client-side would have to read the whole board to do it.
The author is stamped from the session, so nothing a game can call names
another player's row — that is the one guarantee a board makes. What it does
NOT do is validate what a row says: a board is the right shape for a register
people read and the WRONG shape for a standing anybody would cheat for, which
needs tier 1. One numeric sorts it (two orderings = two boards), writing the
same id again replaces the row (that is a personal best), a player holds a few
rows per board, and rows age out after ctx.limits.boardRetentionDays — so a
board for a week or a day is a NEW board named for it, and the old one ages out
on its own. A document several players edit over weeks is still not expressible.

Testing your game against the platform (no browser, no server, no network):
  import { fakePlatform } from "@bloomplay/runtime/testing";              // plain node, no build step
  const fake = fakePlatform({ store: { save: { day: 3 } }, user: { username: "ada" } });
  const ctx = await fake.bloomplay.init({ preload: ["save"] });           // hand fake.bloomplay to your game
  fake.faults.failReads({ times: 1 })                                     // a read that FAILED — prove you do not
                                                                          // read it as an empty account and push
                                                                          // your local save over a good one
  fake.faults.failWrites() / offline() / fail("multiplayer.join", { message: "room full" })
  fake.store.get(key) -> { value, version, updatedAt }                    // the row as the server holds it
  fake.store.set(key, value)                                              // as if another device wrote it
  fake.cache.set(k, raw) / fake.cache.value(k)                            // THIS DEVICE's localStorage — seed it and
                                                                          // the save layer's real branches run
  fake.boards.seed("weekly", [{ by: "bo", value, rank }])                 // strangers on a board, without seating them
  fake.files.seed(name, bytes|string, type?) / .bytes(n) / .text(n)       // artifacts an earlier session made
  fake.mute(true)                                                         // the player muted the platform
  fake.time.advance(86_400_000) / .set(ms) / .untrusted()                 // a day passes by being told to. untrusted()
                                                                          // is the platform unable to reach its own
                                                                          // clock — the case a daily reward must not
                                                                          // be handed out in, and nothing else here
                                                                          // can produce it
  const bo = fake.room.peer("bo");                                        // seat another player
  bo.send(data, to?) / bo.setState(patch) / bo.presence(fields) / bo.leave() / bo.received
  fake.room.drop(); fake.room.restore();                                  // back in the SAME seat (seatKept)
  fake.room.restore({ keepSeat: false })                                  // the grace ran out: a NEW selfId, and
                                                                          // your old room-state key is an orphan
  bo.away(); bo.back(); bo.setTopics([...])                               // a peer's line drops and comes back
  fake.pressure("behind")                                                 // the outbound link is falling behind
  fake.pause({ reason }) / fake.resume() / fake.exit()                    // exit() writes the setOnExit handoffs
  fake.reported -> { loaded, loading, gameplay, progress, moments, analytics, onExit, calls }
  await fake.settle();                                                    // every queued write has landed —
                                                                          // await it before you assert
It keeps the real semantics: server-counted versions, a refused ifVersion,
atomic setMany, the value/key caps, a per-sender seq, and room state merged
last-writer-wins and rebroadcast to the sender too. Tier-1 logic rooms are NOT
doubled — use lint_logic here or @bloomplay/logic-test for those.

Authoritative multiplayer (tier 1): ship a deterministic logic.js at the
workspace root and rooms for your game run it server-side; every client
runs the same reducer (predict-rollback), so only actions cross the wire
and cheating by state injection is impossible.

  // logic.js — a single self-contained file
  globalThis.logic = {
    minPlayers: 1, maxPlayers: 8, tickRate: 25,      // tickRate 1-30
    setup(playerIds, ctx) { return { /* JSON-plain state */ }; },
    actions: {
      move(state, payload, { playerId, ctx }) { /* mutate state */ },
    },
    update(state, ctx) { /* fixed-rate tick: everything players predict */ },
    playerJoined(state, playerId, ctx) {},
    playerLeft(state, playerId, ctx) {},
    // Optional prediction scope — for heavy world simulation (AI, pathing):
    simulated: ["mobs"],        // top-level state keys simulate() owns
    simulateEvery: 3,           // ticks between simulate() runs (1-30)
    simulate(state, ctx) { /* server-only; clients receive its patch */ },
  };

Prediction scope: update() runs on the runner AND every client (own input is
predicted, rolled back only on a real misprediction). simulate() runs on the
runner only; the keys it owns arrive on clients as a patch at that tick, so
clients never pay for the heavy part and still byte-match. It draws from its
own ctx.random() stream (update's stays identical everywhere). update() may
read the simulated keys; only simulate() should write them.

logic.js rules (the determinism lint enforces these at publish):
- ctx = { tick, random() } is the ONLY time and randomness. Banned: Date,
  Math.random, eval/Function, async/await/Promise, network, timers,
  WeakRef. Regex and try/catch are fine (one engine everywhere).
- State must be JSON-plain (objects/arrays/finite numbers/strings/
  booleans/null) and must never live outside the state object — module-
  scope variables desync rollback.
- Action payloads are untrusted client input: sanitize them (Number(x)
  guards, clamps) or NaN poisoning will fail the lint.
- Test headlessly before publishing: lint_logic here, or locally
  @bloomplay/logic-test (lint + fuzzed simulation + input-log replay).

logic.wasm — the wasm tier: ship logic.wasm INSTEAD of logic.js (never
both) for compute-heavy simulation; rooms and clients instantiate the same
module (AssemblyScript is the intended source language; anything that
targets wasm works). Snapshots are the instance's memory; the runner meters
CPU with fuel. ABI (all strings UTF-8 in memory the host gets from alloc;
results come back through one out buffer) — reference implementation:
examples/wasm-tap-race/assembly/index.ts:
  exports  memory, alloc(n)->ptr, free(ptr), out_ptr(), out_len()
           meta()                              -> out: JSON {minPlayers,maxPlayers,tickRate,actionNames,hasSimulate,simulateEvery}
           setup(seed:i32, idsPtr, idsLen)      idsPtr: JSON array of player ids
           action(namePtr,nameLen, pidPtr,pidLen, payloadPtr,payloadLen) -> 0 ok | nonzero rejected (reason in out)
           tick()                               fixed-rate tick, predicted by every client
           state()                              -> out: JSON — the WHOLE logical state (checksums hash it)
           optional: player_joined(p,l), player_left(p,l), simulate()->0|1 (patch in out), apply_patch(p,l)
  imports  only env.abort (AssemblyScript's); no host functions, no WASI.
Rules: seed all randomness from setup's seed (cursor in your state; a
second stream for simulate travels in its patch); keep NaN out of state;
reject an action BEFORE mutating anything; state() must emit everything
that matters. lint_logic gates logic.wasm exactly like logic.js.

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

Player feedback: every game has a Shape board. list_feedback returns its
wishes, ideas and bugs (each with its Me too count; bugs with the moment,
build and seconds into the session) and loves. patch_prompt turns one note
into a focused prompt: the game's concept + that change + keep everything
else. Ship with publish_live { addresses: [noteIds] } — those notes flip to
Shipped and everyone who posted or said Me too is credited ("You helped
shape 1.9"; start the publish note with the version to name it).

Saves that follow the player — use the save layer, do not rewrite it:
  const save = bloomplay.save({ key: "save", cache: "mygame.save.v3" });
  await bloomplay.init();     // preloads "save", because save() asked for it
  await save.ready;           // reconciled; save.value is the truth
  render(save.value ?? fresh());
  save.set(state);            // cache now, KV debounced, handed over for the
                              // end of the session; save.flush() to force it
  save.onChange(v => render(v));   // if ready replaced what you first drew
  save.origin      // "cache" | "account" | "merged" | "fresh" | "local-only"
  save.syncing     // false = not reaching their account. TELL THE PLAYER.
  save.version     // the server version this device has synced
Options: { key, cache, legacyCache: ["older.key"], debounceMs, merge, encode,
decode }. Pass merge if your save only grows — a lattice (min on times, max on
medals, OR on flags) — and keep SETTINGS IN THEIR OWN KEY, because settings are
not monotonic and a merge would silently revert a preference changed on another
device. Before anything destructive ("start a new run"), await save.ready inside
the button handler; that beats every watchdog.

This was 60 to 70 lines in every game that wrote it by hand, and fourteen of
the first nineteen got the same branch wrong. If you do write your own, the
shape that works:
localStorage as the synchronous cache, KV as the truth. Declare the key in
init({preload}) so ctx.preloaded has it and you render once; write the cache
immediately, KV debounced (~1s), flushing on onPause and at real checkpoints.
Writes to one key are serialised inside the SDK and a queued value replaces an
earlier queued one, so a debounce plus a checkpoint flush is safe.
beforeunload and pagehide cannot await an RPC, and a value posted from inside
them may never arrive — so call kv.setOnExit(key, value) beside the cache
write, on every change (one postMessage, no network), and the platform stores
it when the tab is hidden or the page goes away.

Before you upload a local save, make sure the account is really empty. A
rejected read caught into null reads exactly like an account nobody has
written to, and the next line of the obvious save layer — "the remote is
empty, adopt my local save and push it up" — then overwrites a good save on
one transient error. Fourteen of the first nineteen ported games shipped that
bug, six with the catch and the decision in different files. So read with
tryGet, and let only version === 0 mean empty:
  const r = await bloomplay.kv.tryGet("save");
  if (!r.ok) return playFromCache(r.error);   // do NOT write. Say so: kv.health
  if (r.version === 0) await adoptLocalSave(); else merge(r.value, r.version);
Same for kv.tryList when you discover your own shards through it — catching a
failed list into [] is the same bug over a whole world. And when you do
abandon a reconcile, tell the player: kv.health.reachable is false for the
rest of the session otherwise, silently, with nothing reaching their account.

Keep settings, the save and records in separate keys — settings are not
monotonic and must not ride in a value you merge — and read them back in one
kv.getMany. If two keys have to agree (save slots plus the index a title screen
draws from), write them with one kv.setMany: as two writes a tab that dies in
between leaves the index advertising a day the save does not hold, and the
player silently loads an older world.

Two devices, or two tabs: use the server's version, never a clock of your own.
Read with kv.getEntry(key) and cache the version you saw next to the value. On
the next boot, if the remote is still at that version nothing happened
elsewhere and your cache is simply newer; if it moved, the two sides really
diverged and you have to merge them. Write the merge back with
kv.set(key, merged, { ifVersion: remote.version }) — if that rejects with code
"conflict", someone wrote again while you were merging: read, merge and retry,
and never swallow the conflict, because carrying on stores nothing. updatedAt
is the server clock in epoch ms: show it to the player, do not compare with it
(and never truncate it — |0 makes epoch ms negative).

A refused write says which limit it hit: catch it and read e.code
("quota_exceeded" | "conflict" | "unavailable" | …) and e.detail
("value_too_large" | "too_many_keys"), rather than matching on the message.
Mirroring your already-serialised localStorage string into KV is JSON inside
JSON and costs about 30% — one game measured 48.6 KB against 37 KB for the same
save — so store the object, not the string.

Rules:
- index.html at the workspace root is the entry point.
- Bundle all assets in the workspace; don't rely on external CDNs (they may be
  blocked by CSP in production).
- Rust/wasm is fine: .wasm is served with application/wasm; ask the platform
  to enable cross-origin isolation (COOP/COEP) if you need threads.
- The preview channel serves the workspace instantly after every write;
  publish_live snapshots it for players; a candidate with review findings waits for a Bloomplay reviewer.