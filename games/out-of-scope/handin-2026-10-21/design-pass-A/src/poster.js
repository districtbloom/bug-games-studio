/* ============================================================
   FOR YOU POSTER · "Empty suit in the screen's light"
   One character (Regent, the empty suit that made itself acting CEO) in one moment
   (stamp raised, about to approve) in one light (the cracked monitor's acid glow).
   Stage register: one lit pocket in the dark. Drawn with the game's own art code:
   suitB() for Regent, OL/ST for the monitor, the game's palette and line filters.
   compose(W, H) recomposes for any aspect: 2:1, 2:3, 1:1, 9:16.
   ============================================================ */
window.POSTER = (() => {
  const { place, size, torn, rimFilter, silFilter, cast, ACID, TOXIC, VOID } = DP;
  const FLOOR = '#0b0a0e', WALL = VOID;

  /* the cracked CRT turned toward the left (three-quarter), in the game's own colours.
     Drawn on its own 520x520 grid; the glass's left edge is where the light leaves. */
  function crt(id) {
    const glass = 'M118 92 L392 70 Q404 196 396 318 L120 336 Q108 214 118 92Z';
    return `<svg viewBox="0 0 520 560">
      <defs><radialGradient id="${id}" cx="40%" cy="42%" r="72%"><stop offset="0" stop-color="#fffbea"/><stop offset=".22" stop-color="${ACID}"/><stop offset=".62" stop-color="${ACID}"/><stop offset=".86" stop-color="${TOXIC}"/><stop offset="1" stop-color="#1d6b3a"/></radialGradient></defs>
      ${OL('M392 40 L496 92 L486 330 L398 372 Z', '#c8bea2', 7)}${ST('M410 70 L480 106 M408 100 L478 134', 3, '#8f8670')}
      ${OL('M82 54 Q240 30 410 36 Q426 210 414 372 Q250 384 76 390 Q60 220 82 54Z', '#d8cfb3', 7)}
      <path d="${glass}" fill="#050806" stroke="${BK}" stroke-width="7"/>
      <path d="${glass}" fill="url(#${id})"/>
      <clipPath id="${id}c"><path d="${glass}"/></clipPath><g clip-path="url(#${id}c)" opacity=".16">${Array.from({ length: 34 }, (_, i) => `<rect x="100" y="${66 + i * 8}" width="310" height="3" fill="#050806"/>`).join('')}</g>
      ${ST('M330 76 L318 112 L344 134 L314 166 M318 112 L288 104 M344 134 L372 150 M314 166 L294 204 M314 166 L352 190 M294 204 L262 214 M294 204 L306 248', 5, BK)}<path d="M324 76 L338 75 L348 98 L330 104Z" fill="${BK}"/>
      ${ST('M96 362 Q250 360 400 352', 3, '#8f8670')}${DOT(372, 352, 6, TOXIC)}${ST('M110 352 H160', 4, '#8f8670')}
      ${OL('M190 386 L300 382 L322 452 L170 456Z', '#c8bea2', 7)}${OL('M120 452 Q250 442 380 450 L384 476 Q250 470 116 478Z', '#b9ae90', 7)}
    </svg>`;
  }

  /* one composition engine for every aspect. Coordinates are in a W x H design space.
     Regent, from the knees up, stamp raised; the cracked CRT stands in the dark at his right and throws
     its light across him in flat torn steps. Nothing else: one character, one moment, one light. */
  function compose(W = 1600, H = 800, o = {}) {
    const k = Math.min(W / 1600, H / 800), lw = Math.max(k, .5);
    const tall = H > W * 1.05, sq = !tall && H > W * .8;
    const reg = cast.regent(o.emo || 'gleeful');
    let L;
    if (!tall && !sq) L = { fw: 640 * k, fx: W * .5 - 500 * k, fy: 10 * k, mw: 500 * k, mx: W - 610 * k, my: 170 * k };
    else if (sq) L = { fw: W * .70, fx: -W * .04, fy: H * .07, mw: W * .46, mx: W * .58, my: H * .30 };
    else if (H / W > 1.6) L = { fw: W * 1.0, fx: -W * .12, fy: H * .27, mw: W * .60, mx: W * .55, my: H * .57 };
    else L = { fw: W * .98, fx: -W * .1, fy: H * .15, mw: W * .58, mx: W * .55, my: H * .48 };
    if (o.L) Object.assign(L, o.L);
    const fs = size(reg, L.fw);
    const ms = L.mw / 520, gx = L.mx + 120 * ms, gy0 = L.my + 92 * ms, gy1 = L.my + 336 * ms, gc = (gy0 + gy1) / 2;
    // the light: a fan from the glass's left edge in flat torn steps (acid at the glass, lime, toxic, toxic into the dark)
    const R = Math.hypot(gx, Math.max(gc, H - gc)) * 1.04, sp = o.spread || (tall ? 1.5 : 1.0);
    const fan = DP.torn([[gx + 6 * ms, gy0 - 8 * ms], [gx - R, gc - R * sp], [gx - R, gc + R * sp], [gx + 6 * ms, gy1 + 8 * ms]], { seed: 21, step: 40 * lw, amp: 7 * lw });
    const circ = (f, seed) => { const n = 40, pts = []; for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; pts.push([gx + Math.cos(t) * R * f, gc + Math.sin(t) * R * f * .96]); } return DP.torn(pts, { seed, step: 34 * lw, amp: 10 * lw }); };
    const steps = o.steps || [[1.1, TOXIC, .12], [.86, TOXIC, .26], [.66, TOXIC, .55], [.5, TOXIC, 1], [.36, '#b6f03c', 1], [.24, ACID, 1]];
    const rings = steps.map(([f, c, op], i) => `<path d="${circ(f, 3 + i * 2)}" fill="${c}" opacity="${op}"/>`).join('');
    const defs = `<defs>${rimFilter('prim', ACID, 1, -.3, 8 * Math.max(k, .6), 1)}<clipPath id="pfan"><path d="${fan}"/></clipPath></defs>`;
    const r = DP.rnd(9); let specks = '';
    for (let i = 0; i < 44; i++) { const a = (r() - .5) * 1.7, d = (.12 + r() * .85) * R, yy = gc + Math.sin(a) * d, rr = r(), oo = r(); if (yy > H * .8) continue; specks += `<circle cx="${(gx - Math.cos(a) * d).toFixed(1)}" cy="${yy.toFixed(1)}" r="${((1 + rr * 2.4) * lw).toFixed(1)}" fill="#fffbea" opacity="${(.2 + oo * .45).toFixed(2)}"/>`; }
    // one dark cable from the back of the set into the dark (title screen)
    const x0 = L.mx + 470 * ms, y0 = L.my + 300 * ms, x1 = W + 40, y1 = Math.min(H * .78, L.my + 520 * ms);
    const cable = `<path d="M${x0} ${y0} C${x0 + 60 * ms} ${y0 + 120 * ms} ${x1 - 80 * ms} ${y1 + 20 * ms} ${x1} ${y1}" fill="none" stroke="#0e0d12" stroke-width="${13 * ms}" stroke-linecap="round"/><path d="M${x0} ${y0} C${x0 + 60 * ms} ${y0 + 120 * ms} ${x1 - 80 * ms} ${y1 + 20 * ms} ${x1} ${y1}" fill="none" stroke="#2c2836" stroke-width="${3 * ms}" stroke-linecap="round" transform="translate(-2 -3)"/>`;
    const body = `
      <rect width="${W}" height="${H}" fill="${WALL}"/>
      <g clip-path="url(#pfan)">${rings}${specks}</g>
      ${cable}
      ${place(crt('pglass'), L.mx, L.my, L.mw)}
      <g filter="url(#prim)">${place(reg, L.fx, L.fy, L.fw)}</g>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs}${body}</svg>`;
  }
  return { compose, crt };
})();
