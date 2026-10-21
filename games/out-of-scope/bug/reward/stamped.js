/* ============================================================
   OUT OF SCOPE · owned mark "stamped"
   A red rubber stamp thunks onto a store tile once and leaves a red ink box with a tick.
   Self-contained: no dependencies, no network, no fonts. Drawn by the game's own line code
   (OL/ST/SP and its #rough/#roughS/#brush filters), baked into the strings below.
   Usage (see README.md):  OOSStamped.play(tileEl)  ·  OOSStamped.held(tileEl)  ·  OOSStamped.clear(tileEl)
   ============================================================ */
(function (root) {
  'use strict';
  var DEFS = "<filter id=\"oosst-rough-__ID__\" x=\"-5%\" y=\"-5%\" width=\"110%\" height=\"110%\"><feTurbulence type=\"fractalNoise\" baseFrequency=\".04\" numOctaves=\"2\" seed=\"3\"/><feDisplacementMap in=\"SourceGraphic\" scale=\"4.5\" xChannelSelector=\"R\" yChannelSelector=\"G\"/></filter><filter id=\"oosst-roughS-__ID__\" x=\"-5%\" y=\"-5%\" width=\"110%\" height=\"110%\"><feTurbulence type=\"fractalNoise\" baseFrequency=\".06\" numOctaves=\"2\" seed=\"3\"/><feDisplacementMap in=\"SourceGraphic\" scale=\"1.8\" xChannelSelector=\"R\" yChannelSelector=\"G\"/></filter><filter id=\"oosst-rough2-__ID__\" x=\"-5%\" y=\"-5%\" width=\"110%\" height=\"110%\"><feTurbulence type=\"fractalNoise\" baseFrequency=\".02\" numOctaves=\"3\" seed=\"8\"/><feDisplacementMap in=\"SourceGraphic\" scale=\"16\" xChannelSelector=\"R\" yChannelSelector=\"G\"/></filter><filter id=\"oosst-brush-__ID__\" x=\"-5%\" y=\"-5%\" width=\"110%\" height=\"110%\"><feTurbulence type=\"turbulence\" baseFrequency=\".9 .035\" numOctaves=\"2\" seed=\"5\" result=\"n\"/><feColorMatrix in=\"n\" values=\"0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.1 .42\" result=\"w\"/><feComposite in=\"w\" in2=\"SourceAlpha\" operator=\"in\" result=\"s\"/><feMerge><feMergeNode in=\"SourceGraphic\"/><feMergeNode in=\"s\"/></feMerge></filter>";
  var INK = "<g transform=\"rotate(-12 298 300)\"><rect x=\"225\" y=\"240\" width=\"146\" height=\"120\" fill=\"#fff6e6\" opacity=\".8\" filter=\"url(#oosst-roughS-__ID__)\"/><g opacity=\".34\" transform=\"translate(5 4)\"><rect x=\"225\" y=\"240\" width=\"146\" height=\"120\" fill=\"none\" stroke=\"#d4141c\" stroke-width=\"9\" filter=\"url(#oosst-rough-__ID__)\"/><path d=\"M259 302 L287 330 L339 270\" fill=\"none\" stroke=\"#d4141c\" stroke-width=\"14\" stroke-linecap=\"round\" stroke-linejoin=\"round\" filter=\"url(#oosst-rough-__ID__)\"/></g><rect x=\"225\" y=\"240\" width=\"146\" height=\"120\" fill=\"none\" stroke=\"#d4141c\" stroke-width=\"13\" stroke-linejoin=\"round\" filter=\"url(#oosst-roughS-__ID__)\"/><path d=\"M259 302 L287 330 L339 270\" fill=\"none\" stroke=\"#d4141c\" stroke-width=\"22\" stroke-linecap=\"round\" stroke-linejoin=\"round\" filter=\"url(#oosst-rough-__ID__)\"/><circle cx=\"387\" cy=\"258\" r=\"5\" fill=\"#d4141c\"/><circle cx=\"380\" cy=\"232\" r=\"3.5\" fill=\"#d4141c\"/><circle cx=\"211\" cy=\"368\" r=\"4\" fill=\"#d4141c\"/></g>";
  var TOOL = "<g transform=\"rotate(-12)\"><circle cx=\"0\" cy=\"-105.724\" r=\"17.620\" fill=\"#050407\" stroke=\"#15131a\" stroke-width=\"5\" filter=\"url(#oosst-rough-__ID__)\"/><path d=\"M -11.33 -90.62 L 11.33 -90.62 L 11.33 -47.83 L -11.33 -47.83 Z\" fill=\"#050407\" transform=\"translate(3 3)\"/><path d=\"M -11.33 -90.62 L 11.33 -90.62 L 11.33 -47.83 L -11.33 -47.83 Z\" fill=\"none\" stroke=\"#15131a\" stroke-width=\"5\" stroke-linejoin=\"round\" stroke-linecap=\"round\" filter=\"url(#oosst-rough-__ID__)\"/><path d=\"M -67.97 -50.34 L 67.97 -50.34 L 67.97 -17.62 L -67.97 -17.62 Z\" fill=\"#050407\" transform=\"translate(3 3)\"/><path d=\"M -67.97 -50.34 L 67.97 -50.34 L 67.97 -17.62 L -67.97 -17.62 Z\" fill=\"none\" stroke=\"#15131a\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\" filter=\"url(#oosst-rough-__ID__)\"/><path d=\"M -57.9 -39.02 L 50.34 -41.53\" fill=\"none\" stroke=\"#2d2a38\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\" filter=\"url(#oosst-rough-__ID__)\"/><path d=\"M -73 -17.62 L 73 -17.62 L 73 0 L -73 0 Z\" fill=\"#d4141c\" transform=\"translate(3 3)\" filter=\"url(#oosst-brush-__ID__)\"/><path d=\"M -73 -17.62 L 73 -17.62 L 73 0 L -73 0 Z\" fill=\"none\" stroke=\"#15131a\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\" filter=\"url(#oosst-rough-__ID__)\"/></g>";
  var SHADE = "<ellipse cx=\"0\" cy=\"0\" rx=\"81.76\" ry=\"29.200\" fill=\"#050407\" opacity=\".32\" transform=\"rotate(-12)\"/>";
  var THUNK = "<g transform=\"rotate(-12)\"><path d=\"M -88.1 -37.76 q -12.59 20.14 0 40.28 M 88.1 -37.76 q 12.59 20.14 0 40.28\" fill=\"none\" stroke=\"#fff6e6\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" filter=\"url(#oosst-rough-__ID__)\"/><path d=\"M -105.72 -45.31 q -15.1 27.69 0 55.38 M 105.72 -45.31 q 15.1 27.69 0 55.38\" fill=\"none\" stroke=\"#fff6e6\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" filter=\"url(#oosst-rough-__ID__)\"/></g>";
  var LAND = [294, 326];
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
