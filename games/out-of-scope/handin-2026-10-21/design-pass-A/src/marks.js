/* ============================================================
   SMALL MARKS · icon (46), emblem (30), chip (64) for Out of Scope.
   Each one is purpose-built SVG at its own delivered size (92, 60, 128 units), drawn
   with the game's helpers (OL / ST / SP / DOT) on the fine url(#roughS) filter, the way
   the game draws its own small glyphs. Shape data is taken from Regent's code in
   gang4.js (suitB / suitFace / suitCrown) and re-laid at mark size, so every line
   weight is chosen for the display size instead of being shrunk with the drawing.
   Colours are the game's: void #050407, suit #1f1d27 / #2d2a38, blood #d4141c,
   gold #ffc400 (thin crescents only), hat paper #f6f1e4 / #e9e1cf, and the poster's
   light in flat torn steps: acid #e6ff2e -> lime #b6f03c -> toxic #39e07a -> toxic into void.
   (Namespace SMARK: the game already has a global called MARKS.)
   ============================================================ */
window.SMARK = (() => {
  const { torn, rimFilter, ACID, TOXIC, VOID } = DP;
  const LIME = '#b6f03c', GOLD = P.gold, PAPER = '#f6f1e4', BRIM = '#e9e1cf';
  const S = (s) => s.replace(/url\(#rough\)/g, 'url(#roughS)');          // the game's small-glyph swap
  const f1 = (n) => (+n.toFixed(2)).toString();
  /* the game's OL, with its 3-unit print slip scaled for the mark (3 units in a 92 box is 4 % of
     the head, twice the slip the game draws at full size, and reads as a second outline) */
  let SLIP = 1.4;
  const OLk = (d, f, sw, flat = false) => { const t = OL(d, f, sw).replace('transform="translate(3 3)"', `transform="translate(${SLIP} ${SLIP})"`); return flat ? t.replace(' filter="url(#brush)"', '') : t; };
  /* flat = no brush hatch: on the small red shapes (tie, stamp rubber) the game's hatch is finer than
     a pixel at mark size and averages the blood red into pink, so they are laid flat */

  /* move Regent's own path data (gang4.js, 340x490 space) into mark space:
     absolute coords are scaled by s and shifted by (dx,dy); relative ones are only scaled. */
  function tp(d, s, dx = 0, dy = 0) {
    const tok = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g), out = []; let cmd = '', k = 0;
    for (const t of tok) {
      if (/[a-zA-Z]/.test(t)) { cmd = t; out.push(t); k = 0; continue; }
      const v = +t, rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase();
      const off = rel ? 0 : C === 'H' ? dx : C === 'V' ? dy : (k % 2 === 0 ? dx : dy);
      out.push(f1(v * s + off)); k++;
    }
    return out.join(' ');
  }
  /* rotate a point about a centre (degrees, SVG sense) */
  const rot = ([x, y], [cx, cy], a) => { const r = a * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]; };

  /* the poster's light as flat torn steps: rings round a source (cx,cy) off the right edge.
     list: [[radius, colour, opacity], ...] from the outside in. */
  function steps(cx, cy, list, { seed = 3, step = 9, amp = 2.2, sq = 1 } = {}) {
    const ring = (R, sd) => { const n = 56, pts = []; for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; pts.push([cx + Math.cos(t) * R, cy + Math.sin(t) * R * sq]); } return torn(pts, { seed: sd, step, amp }); };
    return list.map(([R, c, op], i) => `<path d="${ring(R, seed + i * 2)}" fill="${c}"${op < 1 ? ` opacity="${op}"` : ''}/>`).join('');
  }

  /* ---------- Regent's parts (gang4.js), in his own 340x490 space ---------- */
  const HEAD = 'M106 130 C104 76 236 70 238 130 C240 172 206 176 172 176 C136 176 108 172 106 130 Z';   // the void egg
  const EYES = ['M128 122 Q146 100 164 122', 'M180 122 Q198 100 216 122'];                            // gleeful crescents
  const GRIN = 'M118 138 L226 138 Q172 204 118 138 Z';                                                   // gleeful grin
  const HAT = 'M118 70 L172 0 L226 70 Z', HATBRIM = 'M104 62 L240 62 L236 86 L108 86 Z';                 // folded paper hat
  const BODY = 'M98 172 Q170 150 244 172 L262 342 L80 342 Z', SHIRT = 'M140 166 L170 240 L200 166 Z';
  const TIE = 'M162 176 Q170 168 178 176 L190 290 Q170 318 150 290 Z';
  const LAPEL = ['M140 166 L118 256 L162 226 Z', 'M200 166 L222 256 L178 226 Z'];
  const COLLAR = ['M132 158 L170 174 L148 198 Z', 'M208 158 L170 174 L192 198 Z'];
  const ARM_L = 'M100 176 L72 286 L100 292 L120 204 Z';
  const ARM_R = 'M242 176 L292 110 L310 126 L262 206 Z', CUFF_R = 'M290 106 L312 124 L322 112 L300 94 Z';

  /* the paper hat: fold, red stamp box (no letters), brim. Brim bottom-centre (172,86) lands at (ax,ay). */
  function hat(hs, ax, ay, o = {}) {
    const hx = ax - 172 * hs, hy = ay - 86 * hs, sw = o.sw || 3.4, bw = 52 * hs * (o.box || 1), bh = 24 * hs * (o.box || 1);
    const bc = [176 * hs + hx, 40 * hs + hy + (o.boxDy || 0)];
    return `<g transform="rotate(${o.rot ?? -9} ${f1(172 * hs + hx)} ${f1(66 * hs + hy)})">
      ${OLk(tp(HAT, hs, hx, hy), PAPER, sw)}
      <g transform="rotate(-14 ${f1(bc[0])} ${f1(bc[1])})"><rect x="${f1(bc[0] - bw / 2)}" y="${f1(bc[1] - bh / 2)}" width="${f1(bw)}" height="${f1(bh)}" fill="none" stroke="${D.blood}" stroke-width="${o.boxW || 3.4}" filter="url(#roughS)"/></g>
      ${o.noBrim ? '' : OLk(tp(HATBRIM, hs, hx, hy), BRIM, sw)}
    </g>`;
  }
  /* the void head with the gleeful face, at scale s, offset (dx,dy) */
  function head(s, dx, dy, o = {}) {
    const face = `${EYES.map((d) => ST(tp(d, s, dx, dy), o.eyeW || 4.6, GOLD)).join('')}<path d="${tp(GRIN, s, dx, dy)}" fill="#fff"/>`;
    return `${OLk(tp(HEAD, s, dx, dy), D.void, o.sw || 3.4)}${face}`;
  }

  /* ---------- ICON · 92x92, drawn for 46 ----------
     Survivors: the void head with gold crescents and the white grin, and the paper hat with its
     red stamp box. Ground: the poster's light from the right, acid -> lime -> toxic -> toxic
     thinning at the left, edge to edge. */
  function icon(o = {}) {
    const W = 92, H = 92; SLIP = o.slip || 1.4;
    const g = steps(o.cx ?? 132, o.cy ?? 30, o.steps || [[400, TOXIC, .55], [112, TOXIC, 1], [86, LIME, 1], [62, ACID, 1]], { seed: 5, step: o.step || 11, amp: o.amp || 3.2, sq: 1.2 });
    const s = o.s || .5, dx = 46 - 172 * s, dy = 86 - 176 * s, hs = s * .88;
    const out = `<rect width="${W}" height="${H}" fill="${VOID}"/>${g}
      ${head(s, dx, dy, { sw: 3.4, eyeW: 4.8 })}
      ${hat(hs, 172 * s + dx, 86 * s + dy + 1.5, { sw: 3.4, boxW: 3.6, rot: -9 })}`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${S(out)}</svg>`;
  }

  /* ---------- EMBLEM · 60x60, drawn for 30 ----------
     o.v = 'hat' (delivered): the white grin under the paper hat with its red stamp box, in the dark.
       No head is drawn and no eyes: the suit is empty and only the hat and the grin show.
       A sliver of the acid light (a torn acid step on a thinner toxic one) on the right edge.
     o.v = 'dark' (the plan's first idea, kept for the comparison sheet): the gold crescents and the
       grin in the dark with the same sliver. At 30 px it reads as a generic grinning smiley. */
  function emblem(o = {}) {
    const W = 60, H = 60, v = o.v || 'hat'; SLIP = 1.1;
    const sliver = steps(o.cx ?? 112, o.cy ?? 26, [[64, TOXIC, .55], [58, ACID, 1]], { seed: 9, step: 6, amp: 1.6, sq: 1.25 });
    let art;
    if (v === 'dark') {
      const s = .4, dx = 30 - 172 * s - 1, dy = 28 - 140 * s;
      art = `${EYES.map((d) => ST(tp(d, s, dx, dy), 4.6, GOLD)).join('')}<path d="${tp(GRIN, s, dx, dy)}" fill="#fff"/>`;
    } else {
      const s = o.s || .4, gx = o.gx ?? 27, dx = gx - 172 * s, dy = (o.y ?? 45) - 140 * s;
      art = `<path d="${tp(GRIN, s, dx, dy)}" fill="#fff"/>${hat(o.hs || .32, o.hx ?? 26, o.hy ?? 29.5, { sw: o.sw || 2.6, boxW: 3.2, rot: o.rot ?? -14, box: 1.05 })}`;
    }
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${S(`<rect width="${W}" height="${H}" fill="${VOID}"/>${sliver}${art}`)}</svg>`;
  }

  /* ---------- CHIP · 128x128, drawn for 64 ----------
     More than the icon, less than the poster: head + hat, collar, white shirt V, red tie, lapels,
     and the raised stamp hand, on the poster's stepped light. No pinstripes, no pocket square,
     no buttons, no legs (the poster keeps those). */
  function chip(o = {}) {
    const W = 128, H = 128; SLIP = 1.6;
    const s = o.s || .46, dx = (o.dx ?? 4) - 76 * s, dy = (o.dy ?? 3.5);
    const T = (d) => tp(d, s, dx, dy), sw = o.sw || 3.6, swT = o.swT || 3;
    const g = steps(o.cx ?? 150, o.cy ?? 44, o.steps || [[400, TOXIC, .3], [150, TOXIC, .6], [118, TOXIC, 1], [90, LIME, 1], [66, ACID, 1]], { seed: 13, step: 10, amp: 2.8, sq: 1.15 });
    // the raised arm swung a little toward the head so the stamp stays inside the square
    const sh = [242 * s + dx, 176 * s + dy], ang = o.armRot ?? -8;
    const st = (() => {   // the stamp at the end of the arm (suitB: translate(314 58) rotate(-18)), in mark space
      const [x, y] = rot([314 * s + dx, 58 * s + dy], sh, ang);
      const k = s;
      return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${-18 + ang})">
        ${OLk(`M${f1(-9 * k)} ${f1(-30 * k)} L${f1(9 * k)} ${f1(-30 * k)} L${f1(9 * k)} ${f1(4 * k)} L${f1(-9 * k)} ${f1(4 * k)} Z`, D.void, swT)}
        ${SP(0, f1(-36 * k), f1(11 * k), D.void, swT)}
        ${OLk(`M${f1(-38 * k)} ${f1(4 * k)} L${f1(38 * k)} ${f1(4 * k)} L${f1(38 * k)} ${f1(28 * k)} L${f1(-38 * k)} ${f1(28 * k)} Z`, D.blood, sw, true)}
      </g>`;
    })();
    const arm = `<g transform="rotate(${ang} ${f1(sh[0])} ${f1(sh[1])})">${OLk(T(ARM_R), D.suit, sw)}${OLk(T(CUFF_R), '#fff', swT)}</g>`;
    const fig = `${OLk(T(ARM_L), D.suit, sw)}
      ${arm}${st}
      ${OLk(T(BODY), D.suit, sw)}
      ${OLk(T(SHIRT), '#fff', swT)}
      ${OLk(T(TIE), D.blood, swT, true)}
      ${LAPEL.map((d) => OLk(T(d), D.suit2, swT)).join('')}
      ${COLLAR.map((d) => OLk(T(d), '#fff', swT)).join('')}
      ${head(s, dx, dy, { sw, eyeW: o.eyeW || 4.4 })}
      ${hat(s * .96, 172 * s + dx, 86 * s + dy + 1, { sw, boxW: 3.4, rot: -9 })}`;
    const rim = o.rim === false ? '' : rimFilter('mkrim', ACID, 1, -.3, o.rimW || 2.4, 1);
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${rim}</defs>${S(`<rect width="${W}" height="${H}" fill="${VOID}"/>${g}<g${rim ? ' filter="url(#mkrim)"' : ''}>${fig}</g>`)}</svg>`;
  }

  return { tp, steps, hat, head, icon, emblem, chip };
})();
