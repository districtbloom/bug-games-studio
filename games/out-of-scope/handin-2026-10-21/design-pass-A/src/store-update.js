/* ============================================================
   UPDATE · Case 02's new verb (agent: store)
   A close-up of the cut: your scissors (scissorsSVG's own geometry: two white rings, two steel
   blades, the pivot) have just snipped the mail pipe at relay-7 (pipeScene: the #2d2a38 band
   with its #5a5668 rails, the relay rack with its slots and LEDs), and the queued envelopes
   (envSVG, in pipeScene's white / hot pink / acid) spill out of the cut end and tumble.
   The light is the game's own flash at the cut (cine2.js flashes #e6ff2e as the scissors
   snap), drawn the poster's way: flat torn steps acid -> lime -> toxic -> toxic thinning into
   the void, with acid rims on whatever faces it. No text: the rack's RELAY-7 sign is left off.
   ============================================================ */
window.UPDATE = (() => {
  const { torn, rnd, rimFilter, ACID, TOXIC, VOID } = DP;
  const LIME = '#b6f03c', PINK = '#ff2e88', STEEL = '#c7c2bb', PIPE = '#2d2a38', RAIL = '#5a5668';
  const xf = (d, k, tx, ty) => STORE.xf(d, k, tx, ty);

  /* one envelope, envSVG's shape (64x44 grid) at width w, centred at x,y, turned r degrees */
  function env(x, y, w, r, col, sw = 6) {
    const k = w / 56, h = 36 * k;
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(1)})">${OL(`M${-w / 2} ${-h / 2} H${w / 2} V${h / 2} H${-w / 2} Z`, col, sw)}${ST(`M${-w / 2} ${-h / 2} L0 ${h * .1} L${w / 2} ${-h / 2}`, sw * .85)}</g>`;
  }

  function compose(W = 1600, H = 800, o = {}) {
    const CX = o.cx || 770, CY = 448;                  // the cut: the light's centre
    const y0 = 378, y1 = 520;                          // the pipe band (pipeScene: 360-520, a little closer here)
    const cutL = CX - 66, cutR = CX + 70, rackX = o.rackX || 1224;
    const R = o.R || 640;
    const ring = (f, seed) => { const n = 44, pts = []; for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; pts.push([CX + Math.cos(t) * R * f, CY + Math.sin(t) * R * f * .86]); } return torn(pts, { seed, step: 38, amp: 10 }); };
    const steps = [[1.1, TOXIC, .12], [.86, TOXIC, .26], [.64, TOXIC, .55], [.47, TOXIC, 1], [.33, LIME, 1], [.21, ACID, 1]];
    const light = steps.map(([f, c, op], i) => `<path d="${ring(f, 5 + i * 3)}" fill="${c}"${op < 1 ? ` opacity="${op}"` : ''}/>`).join('');
    const r = rnd(31); let specks = '';
    for (let i = 0; i < 54; i++) { const a = r() * Math.PI * 2, d = (.12 + r() * .74) * R, x = CX + Math.cos(a) * d, y = CY + Math.sin(a) * d * .86; if (y > H - 40) continue; specks += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.4 + r() * 2.6).toFixed(1)}" fill="#fffbea" opacity="${(.25 + r() * .45).toFixed(2)}"/>`; }

    /* the pipe, cut: torn ends where the blades went through */
    const endL = [], endR = [], rr = rnd(8);
    for (let i = 0; i <= 10; i++) { const y = y0 + (y1 - y0) * i / 10; endL.push([cutL + (i % 2 ? 14 : -8) + rr() * 10, y]); endR.push([cutR + (i % 2 ? -14 : 8) - rr() * 10, y]); }
    const P = (pts) => pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L');
    const pipeL = `M-60 ${y0} L${P(endL)} L-60 ${y1} Z`;
    const pipeR = `M${rackX + 20} ${y0} L${P(endR)} L${rackX + 20} ${y1} Z`;
    const rails = (xa, xb) => ST(`M${xa} ${y0 + 20} H${xb} M${xa} ${y1 - 20} H${xb}`, 5, RAIL);
    const pipes = `<g filter="url(#uRimR)">${OL(pipeL, PIPE, 9)}${rails(-60, cutL - 20)}</g><g filter="url(#uRimL)">${OL(pipeR, PIPE, 9)}${rails(cutR + 22, rackX)}</g>`;

    /* relay-7's rack (pipeScene's rack, closer): slots and LEDs; the pipe runs into it */
    let slots = '';
    for (let i = 0; i < 9; i++) { const yy = 34 + i * 92; slots += OL(`M${rackX + 26} ${yy} H${rackX + 330} V${yy + 70} H${rackX + 26} Z`, '#15131a', 5) + DOT(rackX + 296, yy + 35, 9, i % 3 === 1 ? D.blood : TOXIC); }
    const rack = `<g filter="url(#uRimL)">${OL(`M${rackX} -40 H${rackX + 360} V${H + 40} H${rackX} Z`, '#1f1d27', 9)}${slots}</g>
      ${OL(`M${rackX - 6} ${y0 - 8} H${rackX + 30} V${y1 + 8} H${rackX - 6} Z`, '#15131a', 7)}`;

    /* the envelopes: a queue riding the band (pipeScene's three staggered rows) */
    const cols = ['#fff', PINK, ACID];
    let queue = '';
    for (let i = 0; i < 9; i++) { const x = cutL - 64 - i * 92, row = i % 3; queue += env(x, y0 + 38 + row * 34, 80, (i % 2 ? 2 : -3), cols[i % 3], 5.5); }
    /* ... and the spill: shot out of the cut end by the snap, arcing over the gap and falling toward us */
    const rimOf = (x, y) => { const dx = CX - x, dy = CY - y; return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'R' : 'L') : (dy > 0 ? 'D' : 'U'); };
    const byRim = { L: '', R: '', U: '', D: '' };
    // x, y, width, turn, colour (0 white, 1 pink, 2 acid): a cone that opens downward from the cut end
    [[744, 422, 84, -10, 1], [794, 482, 92, 24, 0], [734, 556, 100, -32, 2], [856, 572, 108, 38, 1], [684, 640, 116, 14, 0],
     [920, 652, 122, -22, 2], [806, 688, 126, 46, 1], [596, 700, 112, -40, 2], [1010, 572, 96, 64, 0], [1022, 704, 114, 8, 1],
     [846, 262, 70, 34, 1], [930, 318, 62, -26, 0]]
      .forEach(([x, y, w, t, c]) => { byRim[rimOf(x, y)] += env(x, y, w, t, cols[c], 6 + w / 40); });
    const spillG = Object.keys(byRim).map((kk) => `<g filter="url(#uRim${kk})">${byRim[kk]}</g>`).join('');

    /* the scissors: scissorsSVG's parts (64 grid) redrawn at k. They come in from the upper left, blades
       down toward the cut, still open just after the snip. The rings are hollow (the light shows through). */
    const k = o.k || 8.2, piv = [32, 30], th = o.th || 122;
    const S = (d) => xf(d, k, 0, 0);
    const ringD = (cx, cy) => { const a = 10 * k, b = 5.2 * k; return `M${cx - a} ${cy} A${a} ${a} 0 1 0 ${cx + a} ${cy} A${a} ${a} 0 1 0 ${cx - a} ${cy} Z M${cx - b} ${cy} A${b} ${b} 0 1 1 ${cx + b} ${cy} A${b} ${b} 0 1 1 ${cx - b} ${cy} Z`; };
    const ringG = (cx, cy) => `<path d="${ringD(cx, cy)}" fill="#fff" fill-rule="evenodd" transform="translate(3 3)" filter="url(#brush)"/>${ST(ringD(cx, cy), 9)}`;
    const dir = [Math.sin(th * Math.PI / 180), -Math.cos(th * Math.PI / 180)];           // where the blades point
    const tip = o.tip || [cutL + 10, y0 - 6];
    const pv = [tip[0] - dir[0] * 25 * k, tip[1] - dir[1] * 25 * k];
    const sc = `<g transform="translate(${pv[0].toFixed(1)} ${pv[1].toFixed(1)}) rotate(${th}) translate(${-piv[0] * k} ${-piv[1] * k})">
        ${OL(S('M24 38 L44 6 L48 8 L32 40 Z'), STEEL, 9)}${ST(S('M30 34 L44 10'), 4, 'rgba(255,255,255,.75)')}
        ${OL(S('M40 38 L20 6 L16 8 L32 40 Z'), STEEL, 9)}${ST(S('M34 34 L20 10'), 4, 'rgba(255,255,255,.75)')}
        ${OL(S('M23 37 L32 40 L27 45 L20 42 Z'), STEEL, 7)}${OL(S('M41 37 L32 40 L37 45 L44 42 Z'), STEEL, 7)}
        ${ringG(18 * k, 47 * k)}${ringG(46 * k, 47 * k)}
        ${SP(piv[0] * k, piv[1] * k, 3.2 * k, '#8a8898', 6)}
      </g>`;
    // the snap's sparks, short strokes off the cut
    const sparks = [[-1, -.2], [-.7, .8], [.9, .5], [1, -.4], [.15, 1], [-.25, -1], [.6, -.9]].map(([dx, dy], i) => ST(`M${CX + dx * 30} ${CY + dy * 34} L${CX + dx * (62 + i * 5)} ${CY + dy * (66 + i * 5)}`, 6, i % 2 ? '#fffbea' : '#15131a')).join('');

    const defs = `<defs>${rimFilter('uRimL', ACID, -1, 0, 9)}${rimFilter('uRimR', ACID, 1, 0, 9)}${rimFilter('uRimU', ACID, 0, -1, 8)}${rimFilter('uRimD', ACID, 0, 1, 9)}${rimFilter('uRimS', ACID, dir[0], dir[1], 10)}</defs>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs}
      <rect width="${W}" height="${H}" fill="#0b0a14"/>
      ${light}${specks}
      ${rack}${pipes}
      <g filter="url(#uRimU)">${queue}</g>
      ${sparks}
      ${spillG}
      <g filter="url(#uRimS)">${sc}</g>
    </svg>`;
  }
  return { compose, env };
})();
