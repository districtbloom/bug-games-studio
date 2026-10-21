/* ============================================================
   OWNED MARK · "stamped" (agent: store)
   The game's core image is a red rubber stamp coming down on a slip. When you own a
   store item, the world stamps its tile: the stamp (the game's floatStamp: void knob,
   handle and block, a blood-red rubber face) thunks onto the lower-right corner and lifts,
   leaving a red ink box with a tick, on the paper patch the game puts under every stamp
   it prints (.ov-approved: rgba(255,246,230,.75)). No letters, no gold, no glow.
   This file draws the parts with the game's own helpers; tools/build in work/store bakes
   them into the self-contained module bug/reward/stamped.js.
   Coordinates: the 400x400 store tile master.
   ============================================================ */
window.STAMPED_ART = (() => {
  const BLOOD = '#d4141c', PAPER = '#fff6e6', VOID = '#050407';
  const C = [298, 300], ROT = -12;            // centre of the ink box, and its tilt (the game's stamps sit at -10 to -14)
  const BW = 146, BH = 120;                    // the box
  // the ink: paper patch, rough red box, a fat tick, three flung drops (FX.ink's drops, small)
  function ink() {
    const x0 = C[0] - BW / 2, y0 = C[1] - BH / 2;
    const tick = `M${x0 + 34} ${y0 + 62} L${x0 + 62} ${y0 + 90} L${x0 + 114} ${y0 + 30}`;
    return `<g transform="rotate(${ROT} ${C[0]} ${C[1]})">
      <rect x="${x0}" y="${y0}" width="${BW}" height="${BH}" fill="${PAPER}" opacity=".8" filter="url(#roughS)"/>
      <g opacity=".34" transform="translate(5 4)"><rect x="${x0}" y="${y0}" width="${BW}" height="${BH}" fill="none" stroke="${BLOOD}" stroke-width="9" filter="url(#rough)"/>${ST(tick, 14, BLOOD)}</g>
      <rect x="${x0}" y="${y0}" width="${BW}" height="${BH}" fill="none" stroke="${BLOOD}" stroke-width="13" stroke-linejoin="round" filter="url(#roughS)"/>
      ${ST(tick, 22, BLOOD)}
      ${DOT(x0 + BW + 16, y0 + 18, 5, BLOOD)}${DOT(x0 + BW + 9, y0 - 8, 3.5, BLOOD)}${DOT(x0 - 14, y0 + BH + 8, 4, BLOOD)}
    </g>`;
  }
  // the stamp itself: floatStamp's parts (gangscreen.js), scaled so the rubber face is the box's width.
  // Its origin (0,0) is the centre of the rubber face's lower edge.
  function tool() {
    const k = BW / 116;
    const g = (d) => STORE.xf(d, k, 0, 0);
    return `<g transform="rotate(${ROT})">
      ${SP(0, -84 * k, 14 * k, VOID, 5)}${OL(g('M-9 -72 L9 -72 L9 -38 L-9 -38 Z'), VOID, 5)}
      ${OL(g('M-54 -40 L54 -40 L54 -14 L-54 -14 Z'), VOID, 6)}${ST(g('M-46 -31 L40 -33'), 3, '#2d2a38')}
      ${OL(g('M-58 -14 L58 -14 L58 0 L-58 0 Z'), BLOOD, 6)}
    </g>`;
  }
  // the thunk: floatStamp's own wobble arcs either side of the rubber, in paper (the tile is dark), shown only at impact
  function thunk() {
    const k = BW / 116, g = (d) => STORE.xf(d, k, 0, 0);
    return `<g transform="rotate(${ROT})">${ST(g('M-70 -30 q-10 16 0 32 M70 -30 q10 16 0 32'), 5, '#fff6e6')}${ST(g('M-84 -36 q-12 22 0 44 M84 -36 q12 22 0 44'), 4, '#fff6e6')}</g>`;
  }
  // the flat shadow of the stamp on the tile while it is close (an ellipse at .3, as principalD casts one)
  const shade = () => `<ellipse cx="0" cy="0" rx="${BW * .56}" ry="${BW * .2}" fill="${VOID}" opacity=".32" transform="rotate(${ROT})"/>`;
  return { ink, tool, thunk, shade, C, ROT, BW, BH };
})();
