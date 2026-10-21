#!/usr/bin/env python3
"""Bake the owned mark ("stamped") into the self-contained module bug/reward/.
Reads work/store/reward-parts.json (the markup the game's own helpers drew, via ev.py) and writes
stamped.js, stamped.css, README.md and preview.html. Filter ids are renamed per instance."""
import json, re, os

D = '/home/claude/designpass'
parts = json.load(open(f'{D}/work/store/reward-parts.json'))
OUT = f'{D}/bug/reward'
os.makedirs(OUT, exist_ok=True)


def local(s):
    s = s.replace('url(#roughS)', 'url(#oosst-roughS-__ID__)').replace('url(#rough2)', 'url(#oosst-rough2-__ID__)')
    s = s.replace('url(#rough)', 'url(#oosst-rough-__ID__)').replace('url(#brush)', 'url(#oosst-brush-__ID__)')
    s = re.sub(r'(\d+\.\d{3})\d+', r'\1', s)          # trim long decimals
    return re.sub(r'\s*\n\s*', '', s)


# the game's line filters (basq.js defsBasq), with ids local to each overlay
defs = re.findall(r'<filter[\s\S]*?</filter>', parts['defs'])
defs = ''.join(defs)
for n in ('roughS', 'rough2', 'rough', 'brush'):
    defs = defs.replace(f'id="{n}"', f'id="oosst-{n}-__ID__"')
defs = re.sub(r'\s*\n\s*', '', defs)
INK, TOOL, SHADE, THUNK = local(parts['ink']), local(parts['tool']), local(parts['shade']), local(parts['thunk'])
C = (298, 300)
LAND = (C[0] - 4, C[1] + 26)        # where the rubber face's lower edge lands (side view, as the game's stamps do)

js = r'''/* ============================================================
   OUT OF SCOPE · owned mark "stamped"
   A red rubber stamp thunks onto a store tile once and leaves a red ink box with a tick.
   Self-contained: no dependencies, no network, no fonts. Drawn by the game's own line code
   (OL/ST/SP and its #rough/#roughS/#brush filters), baked into the strings below.
   Usage (see README.md):  OOSStamped.play(tileEl)  ·  OOSStamped.held(tileEl)  ·  OOSStamped.clear(tileEl)
   ============================================================ */
(function (root) {
  'use strict';
  var DEFS = '__DEFS__';
  var INK = '__INK__';
  var TOOL = '__TOOL__';
  var SHADE = '__SHADE__';
  var THUNK = '__THUNK__';
  var LAND = [__LX__, __LY__];
  var DURATION = 560;          // ms, from the call to the held frame (the brief allows < 900)
  var IMPACT = 130;            // ms, when the rubber meets the tile
  var n = 0;

  function reduced() { try { return root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  function markup(withTool) {
    var id = (++n).toString(36);
    var s = function (t) { return t.replace(/__ID__/g, id); };
    return '<svg class="oosst-svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">' +
      '<defs>' + s(DEFS) + '</defs>' +
      (withTool ? '<g transform="translate(' + LAND[0] + ' ' + LAND[1] + ')"><g class="oosst-shade">' + SHADE + '</g></g>' : '') +
      '<g class="oosst-ink">' + s(INK) + '</g>' +
      (withTool ? '<g transform="translate(' + LAND[0] + ' ' + LAND[1] + ')"><g class="oosst-thunk">' + s(THUNK) + '</g><g class="oosst-tool">' + s(TOOL) + '</g></g>' : '') +
      '</svg>';
  }
  function host(tile) {
    if (root.getComputedStyle && root.getComputedStyle(tile).position === 'static') tile.style.position = 'relative';
    var old = tile.querySelector(':scope > .oosst'); if (old) old.remove();
    var el = document.createElement('div'); el.className = 'oosst'; el.setAttribute('aria-hidden', 'true');
    tile.appendChild(el); return el;
  }
  /* the held frame, at once (an item that is already owned) */
  function held(tile) { var el = host(tile); el.innerHTML = markup(false); el.classList.add('oosst-held'); return el; }
  /* play once: starts at once, ends on the held frame after DURATION ms. Returns a Promise. */
  function play(tile, opts) {
    opts = opts || {};
    if (reduced()) { held(tile); if (opts.onDone) opts.onDone(); return Promise.resolve(); }
    var el = host(tile); el.innerHTML = markup(true); el.classList.add('oosst-go');
    if (opts.jolt !== false && tile.animate) {
      try { tile.animate([{ translate: '0 0' }, { translate: '0 3px', offset: .3 }, { translate: '0 0' }], { duration: 150, delay: IMPACT, easing: 'ease-out' }); } catch (e) {}
    }
    return new Promise(function (res) {
      setTimeout(function () {
        if (!el.isConnected) return res();
        el.innerHTML = markup(false); el.classList.remove('oosst-go'); el.classList.add('oosst-held');
        if (opts.onDone) opts.onDone(); res();
      }, DURATION);
    });
  }
  function clear(tile) { var o = tile.querySelector(':scope > .oosst'); if (o) o.remove(); }
  function heldSVG() { return markup(false); }
  var api = { play: play, held: held, clear: clear, heldSVG: heldSVG, DURATION: DURATION, IMPACT: IMPACT };
  root.OOSStamped = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : this);
'''
js = js.replace("'__DEFS__'", json.dumps(defs)).replace("'__INK__'", json.dumps(INK)).replace("'__TOOL__'", json.dumps(TOOL)).replace("'__SHADE__'", json.dumps(SHADE)).replace("'__THUNK__'", json.dumps(THUNK))
js = js.replace('__LX__', str(LAND[0])).replace('__LY__', str(LAND[1]))
open(f'{OUT}/stamped.js', 'w').write(js)

css = '''/* OUT OF SCOPE · owned mark "stamped" · pairs with stamped.js
   0 ms the stamp is already falling · 130 ms thunk (ink lands, the tile dips 3 px) · 210 ms lift · 560 ms held frame */
.oosst{position:absolute;inset:0;z-index:3;pointer-events:none;overflow:hidden}
.oosst>svg{display:block;width:100%;height:100%}
.oosst .oosst-ink{transform-origin:298px 300px}
.oosst-go .oosst-tool{animation:oosst-tool 560ms linear both}
.oosst-go .oosst-ink{animation:oosst-ink 560ms linear both}
.oosst-go .oosst-shade{animation:oosst-shade 560ms linear both}
.oosst-go .oosst-thunk{animation:oosst-thunk 560ms linear both}
@keyframes oosst-tool{
  0%{transform:translate(0,-260px);opacity:1;animation-timing-function:cubic-bezier(.5,0,1,.55)}
  23.2%{transform:translate(0,0) scale(1,1);animation-timing-function:ease-out}
  28.6%{transform:translate(0,5px) scale(1.06,.84);animation-timing-function:ease-in-out}
  37.5%{transform:translate(0,0) scale(1,1);opacity:1;animation-timing-function:cubic-bezier(.35,0,.7,.4)}
  72%{opacity:1}
  100%{transform:translate(64px,-330px) rotate(18deg);opacity:0}}
@keyframes oosst-ink{
  0%,23.1%{opacity:0;transform:scale(1.1)}
  23.2%{opacity:1;transform:scale(1.1);animation-timing-function:cubic-bezier(.2,.8,.4,1)}
  42%,100%{opacity:1;transform:scale(1)}}
@keyframes oosst-shade{
  0%{opacity:0;transform:scale(.5)}
  23.2%{opacity:1;transform:scale(1)}
  37.5%{opacity:1;transform:scale(1)}
  60%,100%{opacity:0;transform:scale(.6)}}
@keyframes oosst-thunk{
  0%,23.1%{opacity:0;transform:scale(.8)}
  23.2%{opacity:1;transform:scale(.8);animation-timing-function:ease-out}
  40%{opacity:1;transform:scale(1.15)}
  50%,100%{opacity:0;transform:scale(1.2)}}
@media (prefers-reduced-motion:reduce){.oosst-go .oosst-tool,.oosst-go .oosst-shade,.oosst-go .oosst-thunk{display:none}.oosst-go .oosst-ink{animation:none}}
'''
open(f'{OUT}/stamped.css', 'w').write(css)

readme = '''# Owned mark: "stamped" (Out of Scope)

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
'''
open(f'{OUT}/README.md', 'w').write(readme)

preview = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Stamped preview</title>
<link rel="stylesheet" href="stamped.css">
<style>
  :root{--bg:#0b0910;--fg:#f1ece4;--mut:#a69fb6}
  @media (prefers-color-scheme: light){:root:not([data-theme="dark"]){--bg:#f1ece4;--fg:#15131a;--mut:#5a5668}}
  body{margin:0;padding:24px 16px;background:var(--bg);color:var(--fg);font:15px/1.4 system-ui,sans-serif}
  .row{display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end}
  .tile{background:#050407 center/cover no-repeat;border-radius:10px;overflow:hidden}
  .t169{width:169px;height:169px}.t338{width:338px;height:338px}.t40{width:40px;height:40px;border-radius:6px}
  figure{margin:0}figcaption{margin-top:6px;color:var(--mut);font-size:13px}
  button{margin-top:20px;font:inherit;padding:8px 16px;border-radius:8px;border:1px solid var(--mut);background:transparent;color:var(--fg);cursor:pointer}
</style></head><body>
<div class="row">
  <figure><div class="tile t338" id="big" style="background-image:url(../store/tank-globe.png)"></div><figcaption>store tile, 338 px</figcaption></figure>
  <figure><div class="tile t169" id="mid" style="background-image:url(../store/tank-globe.png)"></div><figcaption>page size, 169 px</figcaption></figure>
  <figure><div class="tile t40" id="small" style="background-image:url(../store/tank-globe.png)"></div><figcaption>held, 40 px</figcaption></figure>
</div>
<button id="again" type="button">Play again</button>
<script src="stamped.js"></script>
<script>
  const big = document.getElementById('big'), mid = document.getElementById('mid'), small = document.getElementById('small');
  function go() { OOSStamped.clear(big); OOSStamped.clear(mid); OOSStamped.play(big); OOSStamped.play(mid); }
  OOSStamped.held(small);
  document.getElementById('again').addEventListener('click', go);
  if (!/[?&]still/.test(location.search)) go();
</script>
</body></html>
'''
open(f'{OUT}/preview.html', 'w').write(preview)
print('wrote', OUT, os.listdir(OUT))
