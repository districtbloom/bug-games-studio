# Owned mark: "stamped" (Out of Scope)

The world's own mark on something a player owns. Out of Scope is about rubber-stamping approvals, so when
a store item becomes yours, a red rubber stamp thunks onto its tile and leaves a red ink box with a tick
(no letters, no gold, no glow). It plays once, starts at once, and ends on the held frame after **560 ms**.

Files:

- `stamped.js`: the module (no dependencies). Defines `window.OOSStamped` (and `module.exports`).
- `stamped.css`: its styles and keyframes.
- `preview.html`: the mark playing on the `tank-globe` store tile, at the page size (169 px) and at 40 px.
- `../reward-held.png`: the held frame as a 400x400 transparent overlay for the store tile master.

## How to call it

```html
<link rel="stylesheet" href="reward/stamped.css">
<script src="reward/stamped.js"></script>
```

```js
// after a purchase: play once on the item's tile (any element; it becomes the overlay's box)
OOSStamped.play(tileEl).then(() => { /* the held frame is showing */ });
// options: { jolt: false } skips the 3 px dip of the tile at impact; { onDone: fn } is a callback
// form of the promise.

OOSStamped.held(tileEl);   // an item that is already owned: the held frame, no animation
OOSStamped.clear(tileEl);  // remove the mark
OOSStamped.DURATION;       // 560 (ms)
```

- The overlay is a `div.oosst` appended to the tile, `position:absolute; inset:0`, holding one SVG with
  `viewBox="0 0 400 400"`, the store tile master's grid, so the mark lands in the lower-right corner at any
  tile size (40 to 169 px and up). If the tile is `position:static`, it is set to `relative`.
- Timeline: 0 ms the stamp is already falling into the corner; 130 ms it hits (the ink appears and the
  tile dips 3 px for 150 ms, done with the `translate` property so a tile's own `transform` is untouched);
  210 ms it lifts and flies off up and to the right; 560 ms only the ink remains (the held frame).
- `prefers-reduced-motion: reduce` shows the held frame at once, with no movement.
- The top corners (NEW and YOURS) are never touched: the mark lives in the lower-right corner.
- Colours: blood red `#d4141c` (the game's stamp red), the game's paper `#fff6e6` at 80 % under the ink
  (the same patch the game prints under every stamp, `.ov-approved`), void `#050407` for the stamp's
  handle. No gold, no glow, no platform colour.
