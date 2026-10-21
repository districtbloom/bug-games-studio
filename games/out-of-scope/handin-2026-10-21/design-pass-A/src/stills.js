/* ============================================================
   STILLS · the Continue picture and the result picture.
   Drawn with OUT OF SCOPE's own code: bigStamp()/floatStamp() geometry for Regent's
   rubber stamp, suitB() for Regent, POSTER.crt() for the cracked screen, the game's
   line helpers (OL, ST, SP, DOT), its line filters, and the game's FX shapes
   (FX.ink / FX.burst / FX.shreds / FX.lines in core.js, redrawn here as SVG).
   The light is the poster's: flat torn steps acid -> lime -> toxic -> toxic thinning
   into the void, fanning from the screen's glass, with an acid rim on the lit edge.
   No letters, numbers or names anywhere.
   ============================================================ */
window.STILLS = (() => {
  const { place, torn, rimFilter, cast, rnd, ACID, TOXIC, VOID } = DP;
  const LIME = '#b6f03c', PAPER = '#fffbea', DESK = '#5a3a2a', DESK2 = '#8a5a3a', BLOOD = '#d4141c';
  const f1 = (v) => (+v).toFixed(1);
  const pts2d = (P) => 'M' + P.map((p) => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ' Z';

  /* concentric torn rings around the glass (the poster's light), optionally squashed (a lit plane seen at an angle) */
  function rings(gx, gc, R, steps, { ry = .96, seed = 3, lw = 1 } = {}) {
    return steps.map(([f, c, op], i) => {
      const n = 40, P = [];
      for (let k = 0; k < n; k++) { const t = k / n * Math.PI * 2; P.push([gx + Math.cos(t) * R * f, gc + Math.sin(t) * R * f * ry]); }
      return `<path d="${torn(P, { seed: seed + i * 2, step: 30 * lw, amp: 8 * lw })}" fill="${c}" opacity="${op}"/>`;
    }).join('');
  }
  const specks = (gx, gc, R, n, seed, lw, keep = () => true) => {
    const r = rnd(seed); let s = '';
    for (let i = 0; i < n; i++) { const a = (r() - .5) * 1.7, d = (.12 + r() * .85) * R, x = gx - Math.cos(a) * d, y = gc + Math.sin(a) * d, rr = r(), oo = r(); if (!keep(x, y)) continue; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1((1 + rr * 2.2) * lw)}" fill="${PAPER}" opacity="${(.2 + oo * .45).toFixed(2)}"/>`; }
    return s;
  };

  /* Regent's rubber stamp, the game's own shape (bigStamp / floatStamp): knob, neck, block, red rubber face.
     Drawn in its own units: face centre-bottom at 0,0; ~236 wide, ~146 tall. */
  const stampBody = () => `${SP(0, -122, 22, VOID, 5)}${OL('M-16 -104 H16 V-60 H-16 Z', VOID, 5)}${OL('M-110 -62 H110 V-22 H-110 Z', VOID, 6)}${OL('M-118 -22 H118 V2 H-118 Z', BLOOD, 6)}`;
  const stampSil = (col, op) => `<g opacity="${op}"><circle cx="0" cy="-122" r="24" fill="${col}"/><path d="M-18 -106 H18 V-58 H-18 Z M-112 -64 H112 V-20 H-112 Z M-120 -22 H120 V4 H-120 Z" fill="${col}"/></g>`;

  /* ======================= the Continue picture ======================= */
  function key(W = 720, H = 352, o = {}) {
    const k = Math.min(W / 720, H / 352), lw = Math.max(k, .6);
    // the cracked screen stands on the desk at the right, turned toward the stamp; its glass is the light
    const mw = (o.mw || 262) * k, ms = mw / 520, mx = W - (o.mr || 196) * k, footY = (o.foot || 206) * k, my = footY - 476 * ms;
    const gx = mx + 120 * ms, gy0 = my + 92 * ms, gy1 = my + 336 * ms, gc = (gy0 + gy1) / 2;
    const R = Math.hypot(gx, H - gc) * 1.02;
    const backL = (o.back || 104) * k, backR = backL - 8 * k;          // the desk's far edge
    const desk = [[-20, backL], [W + 20, backR], [W + 20, H + 20], [-20, H + 20]];
    const fan = torn([[gx + 6 * ms, gy0 - 8 * ms], [gx - R, gc - R * 1.0], [gx - R, gc + R * 1.3], [gx + 6 * ms, gy1 + 8 * ms]], { seed: 21, step: 36 * lw, amp: 7 * lw });
    const wallSteps = [[1.1, TOXIC, .1], [.86, TOXIC, .22], [.66, TOXIC, .45], [.5, TOXIC, .9], [.36, LIME, 1], [.24, ACID, 1]];
    const deskSteps = o.deskSteps || [[1.25, TOXIC, .14], [.98, TOXIC, .3], [.76, TOXIC, .6], [.56, TOXIC, 1], [.4, LIME, 1], [.25, ACID, 1]];
    // the slip, lying on the desk in perspective (u across, v into the desk)
    const sc = [(o.sx || 336) * k, (o.sy || 270) * k], ang = (o.ang || -6) * Math.PI / 180, sq = .5;
    const P = (u, v) => [sc[0] + (u * Math.cos(ang) - v * Math.sin(ang)) * k, sc[1] + (u * Math.sin(ang) + v * Math.cos(ang)) * sq * k];
    const quad = (u0, v0, u1, v1) => pts2d([P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)]);
    const line = (u0, v, u1) => `M${f1(P(u0, v)[0])} ${f1(P(u0, v)[1])} L${f1(P(u1, v)[0])} ${f1(P(u1, v)[1])}`;
    const sw = 5 * k, box = [-64, 2, 112, 70], bc = P((box[0] + box[2]) / 2, (box[1] + box[3]) / 2);
    const slip = `${OL(quad(-128, -84, 128, 84), PAPER, sw)}${OL(quad(-128, -84, -108, 84), '#ff2e88', sw * .8)}
      ${ST([line(-88, -52, 70), line(-88, -30, 92), line(-88, -8, 36)].join(' '), 2.6 * k, '#a39c90')}
      ${ST(line(-88, 50, -20), 3.2 * k, '#5a5668')}
      <path d="${quad(...box)}" fill="none" stroke="#15131a" stroke-width="${3 * k}" stroke-dasharray="${8 * k} ${6 * k}" filter="url(#roughS)"/>`;
    // every other slip already approved: a small stamped pile at the left, out of the light (red boxes, no words)
    const pile = [[56, 214, 9, '#d9d1bf'], [64, 232, -5, '#e3dccb'], [70, 250, 3, '#ece5d4']].map(([x0, y0, rot, c]) =>
      `<g transform="translate(${f1(x0 * k)} ${f1(y0 * k)}) rotate(${rot}) scale(${.62 * k} ${.31 * k})">${OL('M-110 -70 H110 V70 H-110 Z', c, 6)}${ST('M-80 -36 H50 M-80 -12 H70', 3, '#a39c90')}
        <g transform="rotate(-10 30 30)"><rect x="-6" y="10" width="82" height="44" fill="none" stroke="${BLOOD}" stroke-width="7" filter="url(#rough)"/>${ST('M8 32 H62', 6, BLOOD)}</g></g>`).join('');
    // the stamp hangs over the empty box; its hard shadow falls on the slip, down and to the left (light from the right)
    const sS = (o.ss || 1.0) * k, hov = (o.hov || 96) * k;
    const st = { x: bc[0] + 4 * k, y: bc[1] - hov };
    // footprint of the block on the slip, pushed left by the light; the neck and knob, higher up, fall further left
    const cu = (box[0] + box[2]) / 2 - (o.shx || 70), cv = (box[1] + box[3]) / 2 + 6, hw = 112 * sS / k;
    const knob = []; for (let i = 0; i < 16; i++) { const t = i / 16 * Math.PI * 2; knob.push(P(cu - hw - 70 + Math.cos(t) * 22, cv + Math.sin(t) * 16)); }
    const shadow = `<g fill="${VOID}" opacity=".62"><path d="${torn([P(cu - hw, cv - 22), P(cu + hw, cv - 22), P(cu + hw, cv + 22), P(cu - hw, cv + 22)], { seed: 3, step: 14 * k, amp: 1.6 * k })}"/><path d="${quad(cu - hw - 50, cv - 8, cu - hw + 4, cv + 8)}"/><path d="${pts2d(knob)}"/></g>`;
    const hover = `<g transform="translate(${f1(st.x)} ${f1(st.y)}) scale(${sS})">${ST('M-140 -72 q-14 22 0 44 M140 -72 q14 22 0 44', 5)}${ST('M-164 -80 q-18 30 0 60 M164 -80 q18 30 0 60', 3.5)}</g>`;
    const stamp = `<g transform="translate(${f1(st.x)} ${f1(st.y)}) rotate(3) scale(${sS})">${stampBody()}</g>`;
    // one drop of red ink let go of the rubber (the drop shape of the game's sweat drops, in the stamp's red)
    const drop = (x, y, sc) => `<path transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc)})" d="M0 0 q9 14 0 20 q-9 -6 0 -20 Z" fill="${BLOOD}" stroke="${BK}" stroke-width="2.5"/>`;
    const drops = !o.drop ? '' : drop(st.x - 46 * k, st.y + 22 * k, 1.25 * k);
    const spk = specks(gx, gc, R, 44, 9, lw, (x, y) => y < backR - 4 * k && x < gx - 16 * k);
    // wood grain on the desk top, running into the depth (perspective), dark in the light, warm in the dark
    const gr = rnd(5); let gd = '';
    for (let i = 0; i < 9; i++) { const y0 = backL + (22 + i * 30 + gr() * 12) * k, x0 = -20 + gr() * 120 * k, x1 = x0 + (180 + gr() * 320) * k, dy = -(x1 - x0) * .012; gd += `M${f1(x0)} ${f1(y0)} Q${f1((x0 + x1) / 2)} ${f1(y0 + dy - 3 * k)} ${f1(x1)} ${f1(y0 + dy)} `; }
    const grain = ST(gd, 2.6 * k, DESK2), grainLit = `<g opacity=".22">${ST(gd, 2.6 * k, VOID)}</g>`;
    const cable = `<path d="M${f1(mx + 470 * ms)} ${f1(my + 300 * ms)} C${f1(mx + 520 * ms)} ${f1(my + 430 * ms)} ${f1(W - 4 * k)} ${f1(H * .7)} ${f1(W + 40)} ${f1(H * .8)}" fill="none" stroke="#0e0d12" stroke-width="${12 * ms}" stroke-linecap="round"/>`;
    const defs = `<defs>${rimFilter('krim', ACID, 1, -.25, 6 * lw, 1)}${rimFilter('krim2', ACID, 1, -.6, 4 * lw, 1)}
      <clipPath id="kfan"><path d="${fan}"/></clipPath><clipPath id="kdesk"><path d="${pts2d(desk)}"/></clipPath><clipPath id="kwall"><rect x="0" y="0" width="${W}" height="${f1(backL + 4 * k)}"/></clipPath></defs>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs}
      <rect width="${W}" height="${H}" fill="${VOID}"/>
      <g clip-path="url(#kwall)"><g clip-path="url(#kfan)">${rings(gx, gc, R, wallSteps, { lw })}${spk}</g></g>
      ${OL(pts2d(desk), DESK, 6 * k)}
      <g clip-path="url(#kdesk)">${grain}<g clip-path="url(#kfan)">${rings(gx - 10 * k, footY + 4 * k, R * (o.pool || .86), deskSteps, { ry: .46, seed: 13, lw })}${grainLit}</g></g>
      ${ST(`M-20 ${f1(backL)} L${W + 20} ${f1(backR)}`, 9 * k, '#0e0c10')}${ST(`M-20 ${f1(backL + 7 * k)} L${W + 20} ${f1(backR + 7 * k)}`, 3.5 * k, DESK2)}
      ${cable}
      ${o.regent ? `<g clip-path="url(#kwall)">${place(cast.regent('smug', { noText: true }), o.regent[0] * k, o.regent[1] * k, o.regent[2] * k, { filter: 'krim2' })}</g>` : ''}
      <g>${pile}<g opacity=".42">${pile.replace(/fill="#[0-9a-f]{6}"/g, 'fill="#050407"').replace(/stroke="#[0-9a-f]{6}"/g, 'stroke="#050407"')}</g></g>
      <g filter="url(#krim2)">${slip}</g>
      ${shadow}
      ${place(POSTER.crt('kglass'), mx, my, mw)}
      ${hover}
      <g filter="url(#krim)">${stamp}</g>
      <g filter="url(#krim2)">${drops}</g>
    </svg>`;
  }

  /* ---------- the game's break FX (core.js FX.ink / FX.burst / FX.lines / FX.shreds), as SVG ---------- */
  /* FX.ink: one fat blob and a few flung drops, smoothPath'd, in the line colour, roughS */
  function ink(x, y, size = 1, seed = 7, color = '#15131a') {
    const R_ = rng(seed);
    const blob = (cx, cy, r, n = 11) => { const pts = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, rr = r * (.72 + R_() * .5); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return smoothPath(pts.concat([pts[0]])) + 'Z'; };
    let d = blob(0, 0, 38 * size, 13);
    for (let i = 0; i < 7; i++) { const a = R_() * Math.PI * 2, dist = (52 + R_() * 70) * size, r = (4 + R_() * 9) * size; d += blob(Math.cos(a) * dist, Math.sin(a) * dist, r, 7); }
    return `<path transform="translate(${f1(x)} ${f1(y)})" d="${d}" fill="${color}" filter="url(#roughS)"/>`;
  }
  /* FX.burst: the comic halftone shock ring (dots on an 11 px grid, masked to a ring). The CSS mask's soft
     edges are drawn the halftone way instead: the dots shrink toward both edges of the ring. */
  function burst(x, y, r0, r1, { color = ACID, grid = 11, dot = 2.5 } = {}) {
    let s = ''; const rm = (r0 + r1) / 2, hw = (r1 - r0) / 2;
    for (let gy = -r1; gy <= r1; gy += grid) for (let gx = -r1; gx <= r1; gx += grid) {
      const d = Math.hypot(gx, gy); if (d < r0 || d > r1) continue;
      const k = 1 - Math.pow(Math.abs(d - rm) / hw, 3); if (k < .15) continue;
      s += `<circle cx="${f1(x + gx)}" cy="${f1(y + gy)}" r="${f1(dot * k)}"/>`;
    }
    return `<g fill="${color}">${s}</g>`;
  }
  /* FX.lines: radial speed lines behind a big moment */
  function lines(x, y, { n = 22, r0 = 120, r1 = 420, w = 1, seed = 7, color = '#15131a', op = .85, skip = () => false } = {}) {
    const R_ = rng(seed); let d = '';
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 + R_() * .15, ra = r0 * (1 + R_() * .5), rb = r1 * (1 + R_() * .48), ww = (4 + R_() * 7) * w;
      if (skip(a)) continue;
      const c = Math.cos(a), sn = Math.sin(a), px = -sn * ww, py = c * ww;
      d += `M${f1(x + c * ra)} ${f1(y + sn * ra)} L${f1(x + c * rb + px)} ${f1(y + sn * rb + py)} L${f1(x + c * rb - px)} ${f1(y + sn * rb - py)} Z`;
    }
    return `<path d="${d}" fill="${color}" opacity="${op}"/>`;
  }
  /* FX.shreds: torn paper scraps, a 1.5 px line border and a hard 2 px offset shadow; caught mid-flight */
  function shreds(x, y, n = 18, { scale = 1, dist = [90, 310], seed = 4, cols = [PAPER, '#ffffff', '#f3eed9', ACID], keep = () => true, sectors = null } = {}) {
    const R_ = rng(seed); let s = '', got = 0;
    for (let i = 0; i < n * 8 && got < n; i++) {
      const w = (10 + R_() * 18) * scale, h = (6 + R_() * 12) * scale;
      const q = [[0, R_() * .3], [1, 0], [.7 + R_() * .3, 1], [R_() * .2, .7 + R_() * .3]].map(([u, v]) => [(u - .5) * w, (v - .5) * h]);
      const sec = sectors ? sectors[Math.floor(R_() * sectors.length)] : [0, 360], a = (sec[0] + R_() * (sec[1] - sec[0])) * Math.PI / 180, t = .35 + R_() * .65, dd = dist[0] + Math.sqrt(R_()) * (dist[1] - dist[0]);
      const cx = x + Math.cos(a) * dd, cy = y + Math.sin(a) * dd * .8 - 30 * scale * t + 60 * scale * t * t, rot = R_() * 400;
      if (!keep(cx, cy)) continue;
      const pd = 'M' + q.map((p) => f1(p[0]) + ' ' + f1(p[1])).join(' L') + ' Z';
      s += `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(rot)})"><path d="${pd}" transform="translate(${2 * scale} ${2 * scale})" fill="#000" opacity=".35"/><path d="${pd}" fill="${cols[got % cols.length]}" stroke="#15131a" stroke-width="${f1(1.5 * scale)}" stroke-linejoin="round"/></g>`;
      got++;
    }
    return s;
  }

  /* ======================= the result picture ======================= */
  function result(W = 1600, H = 352, o = {}) {
    const k = H / 352, lw = k, cxm = W / 2;               // design around the middle 720 x 352
    const X = (v) => cxm + (v - 800) * k;                   // x in a 1600-wide design space, kept centred
    // the screen at the right of the middle, its glass facing left
    const mw = (o.mw || 216) * k, ms = mw / 520, gxT = X(o.glassX || 1022), mx = gxT - 120 * ms, my = (o.my || 62) * k;
    const gx = mx + 120 * ms, gy0 = my + 92 * ms, gy1 = my + 336 * ms, gc = (gy0 + gy1) / 2;
    const R = (o.R || 630) * k;
    const fan = torn([[gx + 6 * ms, gy0 - 8 * ms], [gx - R * 1.2, gc - R * .8], [gx - R * 1.2, gc + R * .9], [gx + 6 * ms, gy1 + 8 * ms]], { seed: 21, step: 40 * lw, amp: 7 * lw });
    const steps = [[1.1, TOXIC, .1], [.86, TOXIC, .22], [.66, TOXIC, .5], [.5, TOXIC, 1], [.36, LIME, 1], [.24, ACID, 1]];
    // Regent, caught: shocked, hat popped up, from the chest up
    const rw = (o.rw || 380) * k, rs = rw / 340, hx = X(o.headX || 766), fx = hx - 172 * rs, fy = (o.fy || 76) * k;
    const reg = cast.regent('shocked', { noText: true });
    // the lie: his statement card, hit by the proof, breaking at the impact point
    const ix = X(o.impX || 590), iy = (o.impY || 96) * k;
    const cw = (o.cw || 180) * k, ch = (o.ch || 96) * k;
    const card = `<g transform="translate(${f1(ix)} ${f1(iy)}) rotate(-7)">
      ${OL(`M${-cw / 2} ${-ch / 2} H${cw / 2} V${ch / 2} H${cw * .2} L${cw * .36} ${ch / 2 + 30 * k} L${cw * .02} ${ch / 2} H${-cw / 2} Z`, '#ffffff', 5 * k)}
      ${ST(`M${-cw * .38} ${-ch * .2} H${cw * .34} M${-cw * .38} ${ch * .05} H${cw * .4} M${-cw * .38} ${ch * .3} H${cw * .1}`, 7 * k, '#a39c90')}
      <svg x="${-cw / 2}" y="${-ch / 2}" width="${cw}" height="${ch}" viewBox="0 0 200 100" preserveAspectRatio="none" overflow="visible"><path d="M96 0 L104 30 L88 46 L112 64 L98 100 M104 30 L140 22 L170 40 M88 46 L50 50 L22 34 M112 64 L150 78 M50 50 L40 80" fill="none" stroke="#15131a" stroke-width="4" stroke-linejoin="round"/></svg>
    </g>`;
    const spk = specks(gx, gc, R, 60, 9, lw, (x, y) => x > X(470) && y < H - 20 * k);
    const cable = `<path d="M${f1(mx + 470 * ms)} ${f1(my + 300 * ms)} C${f1(mx + 540 * ms)} ${f1(my + 470 * ms)} ${f1(X(1330))} ${f1(H * .9)} ${f1(X(1500))} ${f1(H + 30)}" fill="none" stroke="#0e0d12" stroke-width="${13 * ms}" stroke-linecap="round"/><path d="M${f1(mx + 470 * ms)} ${f1(my + 300 * ms)} C${f1(mx + 540 * ms)} ${f1(my + 470 * ms)} ${f1(X(1330))} ${f1(H * .9)} ${f1(X(1500))} ${f1(H + 30)}" fill="none" stroke="#2c2836" stroke-width="${3 * ms}" stroke-linecap="round" transform="translate(-2 -3)"/>`;
    const defs = `<defs>${rimFilter('rrim', ACID, 1, -.3, 7 * lw, 1)}${rimFilter('rrim2', ACID, 1, -.4, 4 * lw, 1)}<clipPath id="rfan"><path d="${fan}"/></clipPath></defs>`;
    const fxs = o.fx !== false;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs}
      <rect width="${W}" height="${H}" fill="${VOID}"/>
      <g clip-path="url(#rfan)">${rings(gx, gc, R, steps, { lw })}${spk}</g>
      ${fxs ? `<g clip-path="url(#rfan)">${lines(ix, iy, { r0: 86 * k, r1: (o.l1 || 270) * k, w: k * (o.lw || 1.1), seed: 7, skip: (a) => { const d = ((a * 180 / Math.PI) % 360 + 360) % 360; return d > 115 && d < 245; } })}</g>` : ''}
      ${cable}
      ${place(POSTER.crt('rglass'), mx, my, mw)}
      <g filter="url(#rrim)">${place(reg, fx, fy, rw)}</g>
      ${fxs ? burst(ix, iy, (o.b0 || 54) * k, (o.b1 || 120) * k, { color: o.burstCol || ACID, grid: 14 * k, dot: 3.4 * k }) : ''}
      <g filter="url(#rrim2)">${card}</g>
      ${fxs ? ink(ix + 6 * k, iy - 2 * k, 1.05 * k, o.inkSeed || 12) : ''}
      ${fxs ? shreds(ix, iy, o.nShreds || 18, { scale: 1.9 * k, dist: [(o.d0 || 96) * k, (o.d1 || 300) * k], seed: o.shredSeed || 23, sectors: o.sectors || [[195, 250], [250, 300], [140, 195], [70, 110], [300, 330]], keep: (x, y) => x > X(462) && x < X(1170) && y > -10 && y < H - 30 * k && !(x > fx + 92 * rs && x < fx + 252 * rs && y > fy - 50 * rs && y < fy + 100 * rs) && !(x > fx + 96 * rs && x < fx + 250 * rs && y > fy + 66 * rs) && !(Math.abs(x - ix) < cw * .5 && Math.abs(y - iy) < ch * .5) }) : ''}
    </svg>`;
  }

  return { key, result, ink, burst, lines, shreds, rings, specks, stampBody, stampSil };
})();
