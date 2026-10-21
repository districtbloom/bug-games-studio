/* ============================================================
   STORE · round-2 pictures for Out of Scope (agent: store)
   Five store tiles (400x400), all on one ground: Gordon's dark desk at night,
   lit from the right by the poster's screen light (flat torn steps acid -> lime
   -> toxic -> toxic thinning into the void) with an acid rim on the item.
   Every item is drawn with the game's own helpers (OL, ST, SP, DOT) and, where
   the game has the shape, the game's own path data:
     cobalt-glove  the tutorial's drag hand (TUT_HAND, tutor.js)
     tank-globe    Kickback's dorsal fin (sharkB), the tank's water line and glass cracks
     marker-trail  the detective's marker (smoothPath, marker.js) behind an evidence slip
     googly-eyes   Bcc's eyes (ghostB) stuck on an evidence slip
     ok-mug        the game's rubber stamp (bigStamp's parts) printed on a cream mug in one red ink
   Nothing here changes a game colour. No text anywhere.
   ============================================================ */
window.STORE = (() => {
  const { torn, rnd, rimFilter, ACID, TOXIC, VOID } = DP;
  const LIME = '#b6f03c', PAPER = '#fff6e6', PINK = '#ff2e88', COBALT = '#1f4bff', SKY = '#62c6ff';
  const DESK = '#5a3a2a', DESK2 = '#8a5a3a', DESKD = '#3a2a22';

  /* ---------- scale + move an SVG path (the game's small glyph paths, redrawn at tile size so the
     line weight stays the game's own instead of being magnified). Handles M L H V C S Q T A Z, abs + rel. */
  function xf(d, k = 1, tx = 0, ty = 0) {
    const toks = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g); const N = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
    let i = 0, cmd = 'M', out = [];
    while (i < toks.length) {
      if (/[a-zA-Z]/.test(toks[i])) { cmd = toks[i++]; out.push(cmd); if (cmd.toUpperCase() === 'Z') continue; }
      const U = cmd.toUpperCase(), rel = cmd !== U, n = N[U]; const p = toks.slice(i, i + n).map(Number); i += n;
      let q;
      if (U === 'H') q = [p[0] * k + (rel ? 0 : tx)];
      else if (U === 'V') q = [p[0] * k + (rel ? 0 : ty)];
      else if (U === 'A') q = [p[0] * k, p[1] * k, p[2], p[3], p[4], p[5] * k + (rel ? 0 : tx), p[6] * k + (rel ? 0 : ty)];
      else q = p.map((v, j) => v * k + (rel ? 0 : (j % 2 ? ty : tx)));
      out.push(q.map((v) => +v.toFixed(2)).join(' '));
    }
    return out.join(' ');
  }
  const pathOf = (svg, i = 0) => [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1])[i];

  /* ---------- the tile ground: Gordon's desk in the dark, the screen light from the right ---------- */
  const S = 400;
  const SRC = [440, 292];                      // the screen is just off the right edge, a little below centre
  function rings(cx, cy, R, steps, seedBase, sy = .96) {
    const circ = (f, seed) => { const n = 34, pts = []; for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; pts.push([cx + Math.cos(t) * R * f, cy + Math.sin(t) * R * f * sy]); } return torn(pts, { seed, step: 22, amp: 6 }); };
    return steps.map(([f, c, op], i) => `<path d="${circ(f, seedBase + i * 2)}" fill="${c}"${op < 1 ? ` opacity="${op}"` : ''}/>`).join('');
  }
  function ground(id, { deskY = 288, seed = 3, R = 300 } = {}) {
    // the poster's steps, as a pool around the glass just off the right edge. Its outer edge stays clear of
    // both top corners (NEW and YOURS), which are plain dark.
    const wall = [[1.0, TOXIC, .12], [.8, TOXIC, .26], [.64, TOXIC, .55], [.5, TOXIC, 1], [.36, LIME, 1], [.24, ACID, 1]];
    // the same light on the desk top, in the game's own desk browns, as flattened steps (the desk is a plane)
    const desk = [[1.1, '#3a2a22', 1], [.74, DESK, 1], [.44, DESK2, 1]];
    const deskD = `M-10 ${deskY + 3} L${S + 10} ${deskY - 5} L${S + 10} ${S + 10} L-10 ${S + 10} Z`;
    const r = rnd(seed + 40); let specks = '';
    for (let i = 0; i < 22; i++) { const a = (r() - .5) * 1.5, d = (.2 + r() * .6) * R, x = SRC[0] - Math.cos(a) * d, y = SRC[1] + Math.sin(a) * d, rr = 1.2 + r() * 2, oo = .25 + r() * .4; if (y > deskY - 8 || y < 70) continue; specks += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="#fffbea" opacity="${oo.toFixed(2)}"/>`; }
    const defs = `<clipPath id="${id}d"><path d="${deskD}"/></clipPath><clipPath id="${id}w"><path d="M-10 -10 H${S + 10} V${deskY} H-10 Z"/></clipPath>
      ${rimFilter(id + 'r', ACID, 1, -.25, 7, 1)}
      <filter id="${id}s" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feFlood flood-color="${VOID}" flood-opacity=".6"/><feComposite in2="SourceAlpha" operator="in"/></filter>`;
    const back = `<rect width="${S}" height="${S}" fill="${VOID}"/>
      <g clip-path="url(#${id}w)">${rings(SRC[0], SRC[1], R, wall, seed, .8)}${specks}</g>
      <path d="${deskD}" fill="#2a1e18"/>
      <g clip-path="url(#${id}d)">${rings(SRC[0] - 10, deskY + 34, R, desk, seed + 20, .3)}
        ${ST(`M-10 ${deskY + 34} L${S + 10} ${deskY + 27}`, 2.5, '#2a1e18')}${ST(`M-10 ${deskY + 80} L${S + 10} ${deskY + 72}`, 2.5, '#2a1e18')}</g>
      ${ST(`M-10 ${deskY + 3} L${S + 10} ${deskY - 5}`, 6, VOID)}
      <path d="M${S * .5} ${deskY - 1} L${S + 10} ${deskY - 5}" stroke="${ACID}" stroke-width="3" fill="none" stroke-linecap="round" transform="translate(0 4)" filter="url(#roughS)"/>`;
    return { defs, back, rim: `${id}r`, sh: `${id}s` };
  }
  /* a hard cast shadow on the desk: the item's own shape, flattened and thrown left (away from the screen) */
  const shadow = (inner, bx, by, sh, c = .55, s = .12) => `<g filter="url(#${sh})"><g transform="matrix(1 0 ${c} ${s} ${-c * by} ${by - s * by})">${inner}</g></g>`;
  let ITEM_ONLY = false;     // true: the item alone on transparent ground (the black-fill / silhouette check)
  const tileSVG = (g, under, item) => `<svg viewBox="0 0 ${S} ${S}" width="${S}" height="${S}"><defs>${g.defs}</defs>${ITEM_ONLY ? item : g.back + under + `<g filter="url(#${g.rim})">${item}</g>`}</svg>`;

  /* ---------- 1 · cobalt-glove: the tutorial's drag hand (TUT_HAND), in a cobalt nitrile glove from Priya's clinic ---------- */
  function glove() {
    const g = ground('tg1');
    const hand = pathOf(TUT_HAND, 0);                      // the hand outline, viewBox 0 0 64 70
    const k = 4.3, tx = 54, ty = 4;
    const H = (d) => xf(d, k, tx, ty);
    const outline = H(hand);
    // the glove's rolled white cuff below the heel of the hand, and the wrist going down out of frame
    const cuff = H('M18 56 C26 64 44 68 57 55 L60 68 C47 81 26 80 14 68 Z');
    const creases = H('M34 27 V40 M43 30 V41 M52 33 V42');
    const nail = H('M26.5 9.5 Q29 6.5 31.5 9.5');
    const shine = H('M27 13 V24') + ' ' + H('M45 47 Q49 53 47 58');
    const art = `${OL(outline, COBALT, 7)}
      ${ST(creases, 4.5, '#15131a')}${ST(shine, 6, 'rgba(255,255,255,.62)')}${ST(nail, 3, 'rgba(255,255,255,.5)')}
      ${OL(cuff, '#fff', 6)}${ST(H('M17 66 C28 75 46 76 58 64'), 3, '#c7c2bb')}`;
    const g0 = `<g transform="rotate(-9 200 230)">${art}</g>`;
    return tileSVG(g, shadow(`<g transform="translate(-30 0)">${g0}</g>`, 200, 338, g.sh, .4, .1), g0);
  }

  /* ---------- 2 · tank-globe: a desk snow globe; Kickback's fin circling in it ---------- */
  function globe() {
    const g = ground('tg2');
    const cx = 200, cy = 178, R = 116, wl = cy - 18;   // water line
    const ball = `M${cx - R} ${cy} A${R} ${R} 0 1 1 ${cx + R} ${cy} A${R} ${R} 0 1 1 ${cx - R} ${cy} Z`;
    const id = 'tg2b';
    // Kickback's own dorsal fin (sharkB: M166 104 L196 30 L228 118 Z), small, cutting the water line
    const fk = 1.2, fx = cx - 196 * fk + 2, fy = wl - 104 * fk + 16;
    const fin = xf('M166 104 L196 30 L228 118 Z', fk, fx, fy);
    const r = rnd(12); let snow = '';
    for (let i = 0; i < 22; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * R * .86, x = cx + Math.cos(a) * d, y = cy + 8 + Math.sin(a) * d * .9; if (y < wl + 10) continue; const w = 5 + r() * 6; snow += `<rect x="${(x - w / 2).toFixed(1)}" y="${(y - 2).toFixed(1)}" width="${w.toFixed(1)}" height="4" fill="${PAPER}" transform="rotate(${(r() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; }
    const water = `<path d="M${cx - R - 10} ${wl} Q${cx - 70} ${wl - 12} ${cx - 30} ${wl} T${cx + 50} ${wl} T${cx + 130} ${wl} V${cy + R + 10} H${cx - R - 10} Z" fill="${SKY}"/>
      <path d="M${cx - R - 10} ${wl + 70} Q${cx - 60} ${wl + 58} ${cx - 10} ${wl + 70} T${cx + 90} ${wl + 70} T${cx + 170} ${wl + 70} V${cy + R + 10} H${cx - R - 10} Z" fill="${COBALT}"/>`;
    const swirl = `<ellipse cx="${cx + 8}" cy="${wl + 6}" rx="74" ry="13" fill="none" stroke="#fff" stroke-width="4" opacity=".7" filter="url(#roughS)"/>`;
    const base = `${OL(`M${cx - 92} ${cy + R - 16} L${cx + 92} ${cy + R - 16} L${cx + 112} ${cy + R + 38} L${cx - 112} ${cy + R + 38} Z`, VOID, 7)}
      ${ST(`M${cx - 96} ${cy + R + 5} L${cx + 98} ${cy + R + 3}`, 3, '#2d2a38')}${ST(`M${cx - 100} ${cy + R + 17} L${cx + 102} ${cy + R + 15}`, 3, '#2d2a38')}`;
    const inside = `<clipPath id="${id}"><path d="${ball}"/></clipPath>
      <path d="${ball}" fill="#141f45"/>
      <g clip-path="url(#${id})">${OL(fin, '#7189a6', 7)}${ST(xf('M178 66 L194 38', fk, fx, fy), 4, 'rgba(255,255,255,.55)')}
        ${water}
        ${ST(`M${cx - R} ${wl} Q${cx - 70} ${wl - 12} ${cx - 30} ${wl} T${cx + 50} ${wl} T${cx + 130} ${wl}`, 4, '#2aa7b4')}
        ${swirl}${snow}</g>`;
    const glass = `${ST(ball, 8)}
      ${ST(`M${cx - 78} ${cy - 50} Q${cx - 70} ${cy - 86} ${cx - 34} ${cy - 100}`, 8, 'rgba(255,255,255,.7)')}${ST(`M${cx + 82} ${cy + 36} Q${cx + 76} ${cy + 62} ${cx + 58} ${cy + 78}`, 5, 'rgba(255,255,255,.45)')}
      ${ST(`M${cx - 62} ${cy - 94} L${cx - 44} ${cy - 74} M${cx - 44} ${cy - 74} L${cx - 50} ${cy - 54} M${cx - 44} ${cy - 74} L${cx - 22} ${cy - 80}`, 3.5)}`;
    const art = `${base}${inside}${glass}`;
    const sil = `<path d="${ball}" fill="#000"/>${OL(`M${cx - 92} ${cy + R - 16} L${cx + 92} ${cy + R - 16} L${cx + 112} ${cy + R + 38} L${cx - 112} ${cy + R + 38} Z`, '#000', 7)}`;
    return tileSVG(g, shadow(sil, cx, cy + R + 38, g.sh, .55, .1), art);
  }

  /* an evidence slip as the game draws it (desk.js .ev.slip): paper, a coloured band on the left with a
     black edge, the slip's pictogram, and its two lines of type, which become plain strokes here */
  function slip(w, h, band, { pic = null, lines = true } = {}) {
    const bw = Math.max(12, w * .085);
    return `${OL(`M0 0 H${w} V${h} H0 Z`, PAPER, 6)}
      <path d="M3 3 H${bw} V${h - 3} H3 Z" fill="${band}"/>${ST(`M${bw} 3 L${bw + 1.5} ${h - 3}`, 4.5)}
      ${pic ? `<g transform="translate(${bw + w * .05} ${h * .07})">${DP.place(picto(pic), 0, 0, h * .44)}</g>` : ''}
      ${lines ? ST(`M${bw + w * .08} ${h * .66} L${w * .74} ${h * .66 - 2}`, h * .1, '#15131a') + ST(`M${bw + w * .08} ${h * .85} L${w * .56} ${h * .85 - 1.5}`, h * .045, '#8a7a68') : ''}`;
  }

  /* ---------- 3 · marker-trail: thrown proof leaves the detective's hot-pink marker behind it ---------- */
  function trail() {
    const g = ground('tg3');
    // the throw: from the lower left, one loop, up into the slip's tail (the game's smoothPath, as in markerText)
    const pts = [], P0 = [22, 334], P1 = [222, 182];
    const ang = Math.atan2(P1[1] - P0[1], P1[0] - P0[0]), ca = Math.cos(ang), sa = Math.sin(ang), L = Math.hypot(P1[0] - P0[0], P1[1] - P0[1]);
    const c = 15, b = 40, loopLen = c * Math.PI * 2, lead = (L - loopLen) * .42;
    const at = (u, v) => [P0[0] + ca * u - sa * v, P0[1] + sa * u + ca * v];   // u along the throw, v to its left (screen up)
    for (let i = 0; i <= 8; i++) pts.push(at(lead * i / 8, -Math.sin(i / 8 * Math.PI / 2) * 6));
    for (let i = 1; i <= 36; i++) { const th = i / 36 * Math.PI * 2; pts.push(at(lead + c * th + b * Math.sin(th), -6 - b * (1 - Math.cos(th)))); }
    for (let i = 1; i <= 8; i++) { const u = lead + loopLen + (L - lead - loopLen) * i / 8; pts.push(at(u, -6 + Math.sin(i / 8 * Math.PI) * 10)); }
    const d = smoothPath(pts);
    const tr = `<g filter="url(#roughS)"><path d="${d}" fill="none" stroke="#15131a" stroke-width="29" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${d}" fill="none" stroke="${PINK}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${d}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="4.5" stroke-linecap="round" transform="translate(-3 -3.5)"/></g>`;
    const sl = `<g transform="translate(196 116) rotate(-18 92 54)">${slip(184, 108, COBALT)}</g>`;
    return tileSVG(g, shadow(`<g transform="translate(-40 150) scale(1 .5)">${sl}</g>`, 200, 330, g.sh, .3, .14), tr + sl);
  }

  /* ---------- 4 · googly-eyes: Bcc's eyes, stuck on an evidence slip ---------- */
  function eyes() {
    const g = ground('tg4');
    // Bcc's eye, exactly as ghostB draws one (white spot, void pupil looking, white glint), at sticker size
    const eye = (x, y, r, lx, ly) => SP(x, y, r, '#fff', 6) + DOT(x + lx * r * .45, y + ly * r * .45, r * .42, VOID) + DOT(x + lx * r * .45 - r * .25, y + ly * r * .45 - r * .28, r * .14, '#fff');
    const w = 236, h = 170;
    const card = `<g transform="translate(82 116) rotate(-6 118 85)">${slip(w, h, PINK, { pic: null, lines: false })}
      ${ST(`M40 ${h * .8} L${w * .62} ${h * .8 - 2}`, 12, '#15131a')}${ST(`M40 ${h * .92} L${w * .44} ${h * .92 - 1.5}`, 5, '#8a7a68')}
      ${eye(92, 70, 50, -.55, .5)}${eye(186, 60, 58, .6, -.45)}${eye(150, 122, 20, .1, .9)}</g>`;
    return tileSVG(g, shadow(card, 200, 292, g.sh, .5, .1), card);
  }

  /* ---------- 5 · ok-mug: a cream office mug with Regent's red stamp box on it (no letters) ---------- */
  function mug() {
    const g = ground('tg5');
    const top = 128, bot = 330, L0 = 126, R0 = 286, L1 = 136, R1 = 276, ry = 20;
    const cx = (L0 + R0) / 2;
    const body = `M${L0} ${top} L${L1} ${bot - 12} Q${cx} ${bot + 14} ${R1} ${bot - 12} L${R0} ${top} Z`;
    const rim = `M${L0} ${top} C${L0} ${top - ry * 1.35} ${R0} ${top - ry * 1.35} ${R0} ${top} C${R0} ${top + ry * 1.35} ${L0} ${top + ry * 1.35} ${L0} ${top} Z`;
    const coffee = `M${L0 + 12} ${top + 2} C${L0 + 14} ${top - ry} ${R0 - 14} ${top - ry} ${R0 - 12} ${top + 2} C${R0 - 14} ${top + ry} ${L0 + 14} ${top + ry} ${L0 + 12} ${top + 2} Z`;
    const handle = `M${L0 + 4} ${top + 40} C${L0 - 64} ${top + 30} ${L0 - 74} ${top + 150} ${L1 + 2} ${top + 160} L${L1 - 1} ${top + 132} C${L0 - 40} ${top + 126} ${L0 - 38} ${top + 66} ${L0 + 2} ${top + 70} Z`;
    // the decal. MUG_DECAL 'box' is the first plan (the hat's stamp box without its OK); it read as a second owned mark
    // next to the owned stamp at 40 px, so the default is the game's rubber stamp (bigStamp's parts) printed in one red ink
    const stamp = (window.MUG_DECAL || 'stamp') === 'box'
      ? `<g transform="rotate(7 ${cx + 4} ${top + 92})"><rect x="${cx - 50}" y="${top + 62}" width="108" height="58" fill="none" stroke="#d4141c" stroke-width="11" filter="url(#roughS)"/></g>`
      : `<g transform="translate(${cx + 2} ${top + 146}) rotate(-8) scale(.58)" fill="#d4141c" filter="url(#roughS)"><circle cx="0" cy="-124" r="24"/><path d="M-17 -106 H17 V-58 H-17 Z"/><path d="M-112 -64 H112 V-26 H-112 Z"/><path d="M-120 -16 H120 V4 H-120 Z"/></g>`;
    const steam = ST(`M${cx - 26} ${top - 34} q-12 -18 0 -34 q12 -16 0 -32`, 5, 'rgba(255,255,255,.5)') + ST(`M${cx + 18} ${top - 38} q-10 -16 0 -30`, 4, 'rgba(255,255,255,.4)');
    const art = `${OL(handle, '#fff8e6', 7)}${OL(body, '#fff8e6', 7)}
      ${ST(`M${L0 + 22} ${top + 42} L${L1 + 18} ${bot - 46}`, 7, 'rgba(255,255,255,.9)')}
      ${OL(rim, '#e9e1cf', 6)}<path d="${coffee}" fill="${DESKD}"/><path d="M${L0 + 30} ${top + 4} C${L0 + 60} ${top + 14} ${R0 - 60} ${top + 14} ${R0 - 24} ${top + 2}" fill="none" stroke="${DESK}" stroke-width="5" stroke-linecap="round"/>
      ${stamp}`;
    const ring = `<ellipse cx="320" cy="352" rx="40" ry="11" fill="none" stroke="#2a1e18" stroke-width="5" filter="url(#roughS)"/>`;
    return tileSVG(g, ring + shadow(`<path d="${body}"/><path d="${handle}"/>`, cx, bot, g.sh, .55, .1) + steam, art);
  }

  const tiles = { 'cobalt-glove': glove, 'tank-globe': globe, 'marker-trail': trail, 'googly-eyes': eyes, 'ok-mug': mug };
  const tile = (id) => tiles[id]();
  const item = (id) => { ITEM_ONLY = true; try { return tiles[id](); } finally { ITEM_ONLY = false; } };
  return { xf, pathOf, ground, slip, tile, item, tiles, S };
})();
