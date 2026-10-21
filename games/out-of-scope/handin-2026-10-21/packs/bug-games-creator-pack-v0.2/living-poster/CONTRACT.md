# Living board — game scene module contract (v1)

Every game on the living For you board is ONE module file: `<key>.js` (in your package: `living-poster/<key>.js`).
The board engine (another agent) concatenates all module files into the board's logic script, after `const BUG_MODS = {};`. So a module file is plain classic JavaScript that does exactly one thing: `BUG_MODS.<key> = { … };`
- No `import`/`export`, no `window` globals, no DOM access, no timers, no network, no images, no fonts other than the board's (Bricolage Grotesque, DM Mono, Instrument Serif; you may also use system `monospace`, `Georgia`, `Impact`, `Courier New` inside game art).
- Everything is drawn with Canvas 2D into the `ctx` you are given. Top-level helpers must live INSIDE your object (e.g. as methods or closures in `create`) so module names never collide.

```js
BUG_MODS.carbon = {
  key: 'carbon',               // short, lowercase, unique
  no: '014',                   // catalogue number (3 digits, cold number)
  title: 'Carbon Body',        // warm name
  maker: '@papercut',          // invented maker handle
  kind: 'Office brawler',      // genre in 1–3 words
  verb: 'Staple.',             // one imperative
  ground: '#F2EEE3',           // the plate's base colour (what shows before the first frame)
  ink: '#FF5A1F',              // the game's accent ink (used by the engine for the caption chip edge)
  rants: ['!?', 'hey…', '#@$%'],   // OPTIONAL, rarely shown: tiny lines or symbols (≤ 14 chars). The reaction is mainly in the art.
  hits:  ['!'],                      // OPTIONAL, rarely shown
  items: {                     // things this game can throw across seams (drawn on the board overlay)
    clip(ctx, x, y, t, angle) { /* draw a paper clip centred at x,y, ~14–28 px */ }
  },
  create(api) {                // api: { rnd() seeded 0..1, emit(evt) }
    // set up your scene state here (closures are fine)
    return {
      frame(ctx, s) { /* draw the whole plate; see s below */ },
      on(evt) { /* react to board events; see below */ },
      anchor() { return { x: 0.3, y: 0.55 }; } // where the main character's mouth/head is, as fractions of w,h
    };
  }
};
```

## `frame(ctx, s)` — called every animation frame
`ctx` is already scaled to CSS pixels and cleared? **No — you paint every pixel of the plate** (start with a full background fill). The plate is clipped for you.
`s` = {
- `w, h` — plate size in CSS px **this frame**. It changes continuously while plates grow and squeeze (from about 120×90 up to about 900×640). Your scene MUST recompose for any aspect (very wide, very tall, tiny), never stretch, never leave empty bars. Anchor the main character sensibly; scale it with `Math.min(w,h)`.
- `t` — seconds since the board started (use for idle loops).
- `dt` — seconds since the last frame (clamped ≤ 0.05).
- `mode` — `'idle' | 'react' | 'enter' | 'loop' | 'squeezed'`.
- `mt` — seconds since this mode began.
- `near` — 0..1, how close the cursor is to this plate while idle (1 = at the edge). Use it to make the character glance/notice.
- `hover` — `{x,y}` cursor position in plate px while hovered, else `null`.
- `grow` — 0..1, how enlarged this plate is (1 = fully expanded).
- `squeeze` — 0..1, how compressed this plate is (1 = most compressed).
- `rm` — true when reduced motion is on: draw a single composed still pose (the idle key pose) and ignore time.
}

### The modes (the heart of the feature)
1. **idle** (default): the main character lives a lively, characterful loop in its world (3–8 s cycle, several little beats, never static). Some secondary life (background motion, props). It glances toward the cursor as `near` rises.
2. **react** (hover begins; lasts 0.8 s): the signature reaction — big, funny, emotional, readable at a glance (a take, a startle, a pose, a strike). Anticipation → action → hold.
3. **enter** (0.7 s, right after react): the character SMOOTHLY ENTERS its game. One continuous move from the reaction into gameplay, in the game's own way (camera pushes through a window, the character jumps into the page and it becomes the level, the web becomes the play field…). No fades, no cross-dissolves: a physical move, a cut on action, a wipe in the game's own medium.
4. **loop** (while still hovered, after enter): a short gameplay loop that represents the game (4–8 s, seamless repeat; use `mt % L`). It should feel like real play: the character doing the core verb, an enemy or obstacle, a mini-payoff, the game's own HUD bits (score/meter in the game's type). This is the placeholder for a future 15–20 s trailer.
5. **squeezed** (another plate is hovered and this one is compressed): the character REACTS with body and face, in its own way: shoved against the edge, squashed, startled, annoyed, pushing the wall back, hiding, falling over, giving the big neighbour a look — escalating with `squeeze` and `mt`. Not literal yelling: the reaction lives in the art (pose, face, timing, props). The engine only rarely adds a tiny bubble from `rants`.
When hover ends, mode returns to `idle` (mt resets); a quick, physical settle back is welcome (first 0.4 s of idle).

## `on(evt)` — board events (for the idle "talking to each other")
- `{type:'cue'}` — the engine asks you to start your idle GAG now: do something that ends with a throw within ~0.6–1.2 s by calling `api.emit({type:'throw', item:'<an item key>', x, y, vx, vy})` (x,y in plate px where it leaves; vx,vy rough direction). The engine flies the item to a neighbour.
- `{type:'hit', item, from, x, y}` — something from a neighbour (`from` = its key; `item` drawn by that game) landed in your plate at x,y: react physically (flinch, catch it, get knocked over, get angry). The engine may (rarely) add a tiny bubble from `hits`.
- `{type:'look', dx, dy}` — a neighbour is making a scene in that direction: look over for ~1.5 s.
- `{type:'shake', amount}` — the board jolted (a neighbour expanded): stagger.
You may also emit `{type:'shout', text}` (≤ 24 chars) to pop a bubble yourself, sparingly.

## Art direction (the GAME art rules apply)
- **Colourful, eye-catching, each game unmistakably different** — its own medium, palette and line. The board as a whole must look like 13 different games, not one template. Full colour is wanted.
- **Wild, alive, emotional animation.** Characters with personality: anticipation, squash, overshoot, holds, secondary motion, expressive faces. Comic timing.
- Crisp drawing; no cheap blur/glow fog over everything (the game's own neon or light is fine if it's part of its look). No text on the art except the game's own diegetic text (HUD, signs, stamps). The engine puts the caption.
- Edgy, funny, never gory, no real swear words (grawlix `#@$%!` only).
- Performance: ≤ ~2 ms per frame per plate at 600×400 on a laptop. Precompute paths; avoid per-pixel loops; no `getImageData`. Use `ctx.save()/restore()`.

## Test it with the harness
`python3 living-poster/harness.py <key> <your folder> <path to your module.js>` writes `<your folder>/render/Harness<Key>.dc.html` (and copies `support.js` beside it) (a 1440×900 test board showing your module in 5 plates: idle large, idle tiny/tall, an auto-cycling react→enter→loop, squeezed, and a plate receiving hits every 3 s, with a live hover on the big plate). Then:
`node living-poster/tools/shot.mjs Harness<Key>.dc.html 1440 900 seq 500 1500 3000 4500 7000 10000 --root <your folder>/render --out <your folder>/shots` and look at every frame (Node + Playwright; add `--chromium <path>` if Playwright has no browser of its own; see `living-poster/tools/README.md`). Zero console errors. Iterate until it's genuinely great.
