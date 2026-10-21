/* ============================================================
   ROUND 3 · page backdrop (desktop + phone), share card, title lockup.
   Drawn with OUT OF SCOPE's own art code and palette:
   - the office set from officeScene() (scenes.js): wall #0b0a14, window #141f45 with its
     #050407 frame cross, skyline #0a0f22, lit windows #ffd35a (6x9), moon #fff6e6, the CEO chair
     (#2d2a38, tufted with #15131a dots), the desk #5a3a2a with its #8a5a3a edge;
   - Regent suitB() and the poster's cracked CRT (POSTER.crt) for the share card;
   - the title screen's name (.tl-name: Tabloid 700, .04em, acid, 3px cobalt offset, -2deg) and
     the game's mark rawGlyph('mark') for the lockup.
   The light is the poster's: flat torn steps from the cracked screen (acid, lime, toxic, toxic
   thinning into the dark) and an acid rim on lit edges. No blur, no gradients over the scene.
   ============================================================ */
window.R3 = (() => {
  const { place, size, torn, rimFilter, cast, rnd, ACID, TOXIC, VOID } = DP;
  const LIME = '#b6f03c', COBALT = '#1f4bff', WALL = '#0b0a14', NAVY = '#141f45', CITY = '#0a0f22',
    LIT = '#ffd35a', MOON = '#fff6e6', CHAIR = '#2d2a38', DESK = '#5a3a2a', DESK2 = '#8a5a3a', FRAME = '#050407';

  /* ---------------- the light: the poster's torn steps, from a source (sx,sy) ----------------
     rings are torn circles around the source, clipped to a fan that opens toward `dir` (-1 = left). */
  function light(id, sx, sy, R, { steps, spread = 1, gh = 120, dir = -1, lw = 1, seed = 3, fanSeed = 21 } = {}) {
    const fan = torn([[sx, sy - gh], [sx + dir * R * 1.3, sy - R * 1.3 * spread], [sx + dir * R * 1.3, sy + R * 1.3 * spread], [sx, sy + gh]], { seed: fanSeed, step: 40 * lw, amp: 7 * lw });
    const circ = (f, s) => { const n = 44, pts = []; for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; pts.push([sx + Math.cos(t) * R * f, sy + Math.sin(t) * R * f * .96]); } return torn(pts, { seed: s, step: 34 * lw, amp: 10 * lw }); };
    const rings = steps.map(([f, c, op], i) => `<path d="${circ(f, seed + i * 2)}" fill="${c}" opacity="${op}"/>`).join('');
    return { defs: `<clipPath id="${id}"><path d="${fan}"/></clipPath>`, body: `<g clip-path="url(#${id})">${rings}</g>` };
  }

  /* ---------------- the office pieces (officeScene's own shapes and colours) ---------------- */
  // skyline: officeScene's rule (blocks on a 50-unit pitch, 6x9 windows on a 14x26 grid), with the
  // lit windows thinned out and kept to x < litMax so the sun-guarded #ffd35a never nears the rail.
  function skyline(x0, x1, base, { k = 1, seed = 11, hMin = 90, hMax = 340, litP = 0, litMax = -1, litMinY = -1e9, litMaxY = 1e9 } = {}) {
    const R = rnd(seed); let s = '', lit = '';
    for (let x = x0 - 20 * k; x < x1; x += 50 * k) {
      const h = (hMin + R() * (hMax - hMin)) * k, w = (40 + R() * 16) * k;
      s += `<rect x="${x.toFixed(1)}" y="${(base - h).toFixed(1)}" width="${w.toFixed(1)}" height="${(h + 40).toFixed(1)}" fill="${CITY}"/>`;
      for (let wy = base - h + 14 * k; wy < base - 10 * k; wy += 26 * k) for (let wx = x + 8 * k; wx < x + w - 8 * k; wx += 14 * k) {
        const r = R(), o = R();
        if (r > 1 - litP && wx < litMax && wy > litMinY && wy < litMaxY) lit += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="${(6 * k).toFixed(1)}" height="${(9 * k).toFixed(1)}" fill="${LIT}" opacity="${(.5 + o * .5).toFixed(2)}"/>`;
      }
    }
    return s + lit;
  }
  // the CEO chair from officeScene: back 'M596 300 C596 250 844 250 844 300 L850 640 L590 640 Z', tufted
  function chair() {
    return `<svg viewBox="560 230 320 420">${OL('M596 300 C596 250 844 250 844 300 L850 640 L590 640 Z', CHAIR)}${[640, 720, 800].map((x) => DOT(x, 360, 6, '#15131a')).join('')}${[680, 760].map((x) => DOT(x, 430, 6, '#15131a')).join('')}${[640, 720, 800].map((x) => DOT(x, 500, 6, '#15131a')).join('')}</svg>`;
  }

  /* ---------------- 18 · page backdrop ----------------
     Gordon's office at rest at night: the tall window on the navy city, the empty CEO chair, the desk
     edge as the floor. One light: the cracked screen, just past the right edge, in flat torn steps. */
  function backdrop(W = 1440, H = 577, o = {}) {
    const phone = H > W;
    const L = phone ? {
      win: [16, 26, 300, 720], mx: 166, my: 300, moon: [70, 84, 12], desk: 730, k: .6, cityBase: 730, hMin: 150, hMax: 520,
      chair: [238, 588, 136], src: [W + 170, 600], R: 620, spread: 1.2, gh: 80,
      litP: 0, litMax: -1, edgeW: 3, frameW: 7, deskW: 5,
    } : {
      win: [44, 30, 880, 560], mx: 470, my: 262, moon: [128, 96, 15], desk: 492, k: 1, cityBase: 498, hMin: 90, hMax: 330,
      chair: [818, 328, 196], src: [W + 230, 380], R: 1150, spread: 1.4, gh: 130,
      litP: .10, litMax: 640, edgeW: 4, frameW: 10, deskW: 6,
    };
    Object.assign(L, o.L || {});
    const [wx, wy, ww, wh] = L.win, lw = phone ? .6 : 1;
    const steps = o.steps || [[1.1, TOXIC, .04], [.86, TOXIC, .07], [.66, TOXIC, .11], [.5, TOXIC, .16], [.36, TOXIC, .23], [.24, TOXIC, .32]];
    const lt = light('r3bl' + (phone ? 'p' : 'd'), L.src[0], L.src[1], L.R, { steps, spread: L.spread, gh: L.gh, lw, seed: 5 });
    const city = skyline(wx, wx + ww, L.cityBase, { k: L.k, seed: phone ? 7 : 11, hMin: L.hMin, hMax: L.hMax, litP: L.litP, litMax: L.litMax });
    const [cx, cy, cw] = L.chair;
    const rim = rimFilter('r3rim', ACID, 1, -.15, (phone ? 3 : 4.5), 1);
    // the desk: officeScene's slab (#5a3a2a with its #8a5a3a edge line) as a flat band across the
    // bottom, the hard floor of the page; flat fill (the dry-brush hatch turns to static on a slab this
    // wide), the 3px offset print and the rough ink line. Its lit end catches the screen in torn steps
    // along the edge: acid, lime, toxic.
    const dk = L.desk, edgeR = rnd(4);
    const deskD = `M-30 ${dk} H${W + 30} V${H + 40} H-30 Z`;
    const cuts = [W * (phone ? .55 : .8), W * (phone ? .25 : .6), W * (phone ? -.1 : .38)];
    // (thin torn strips, not filtered strokes: a horizontal line has a zero-height box, and the rough
    // filter's region would clip it away)
    const strip = (x0, x1, y, h, seed) => torn([[x0, y - h / 2], [x1, y - h / 2], [x1, y + h / 2], [x0, y + h / 2]], { seed, step: 26 * lw, amp: .9 });
    const edge = [[cuts[0], ACID, .9], [cuts[1], LIME, .6], [cuts[2], TOXIC, .3]].map(([x0, c, op], i) => {
      const x1 = i === 0 ? W + 20 : cuts[i - 1];
      return `<path d="${strip(x0 + (edgeR() - .5) * 24, x1, dk + .5, L.edgeW, 7 + i)}" fill="${c}" opacity="${op}"/>`;
    }).join('');
    const hiY = dk + (phone ? 11 : 15), hi = `<path d="${strip(-30, W + 30, hiY, phone ? 3.5 : 5, 3)}" fill="${DESK2}"/>`;
    const body = `
      <rect width="${W}" height="${H}" fill="${WALL}"/>
      ${lt.body}
      <rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="${NAVY}"/>
      ${L.moon ? `<circle cx="${L.moon[0]}" cy="${L.moon[1]}" r="${L.moon[2]}" fill="${MOON}" opacity=".85"/>` : ''}
      ${city}
      ${ST(`M${wx} ${wy} H${wx + ww} V${wy + wh} H${wx} Z M${L.mx} ${wy} V${wy + wh} M${wx} ${L.my} H${wx + ww}`, L.frameW, FRAME)}
      <g filter="url(#r3rim)">${place(chair(), cx, cy, cw)}</g>
      <path d="${deskD}" fill="${DESK}" transform="translate(3 3)"/>${hi}${ST(deskD, L.deskW)}
      ${edge}`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${rim}${lt.defs}</defs>${body}</svg>`;
  }

  /* ---------------- 22 · title lockup ----------------
     The title screen's name, outlined from the game's own Tabloid face (src/round3-type.js), set as
     .tl-name sets it: 700, letter-spacing .04em, line-height .86, centred, acid, a 3px-at-70px cobalt
     offset (the hard half of its text-shadow; the soft glow half is dropped), rotated -2deg.
     Above it, as on the title screen, the mark rawGlyph('mark'): the dashed selection box and the red
     cursor that got out. Layout in font units (1000/em). */
  const T = () => window.R3TYPE;
  function setLine(txt) {
    const t = T(); let x = 0; const g = [];
    for (const ch of txt) {
      if (ch === ' ') { x += t.space + 40; continue; }
      const G = t.g[ch]; g.push([x, G.d]); x += G.adv + 40;
    }
    return { w: x - 40, g };
  }
  /* mark: 'game' = rawGlyph('mark') exactly (ink dashes); 'lit' = the dashes in the name's acid and
     cobalt offset so the box reads on night as well as on linen; the cursor is the game's either way. */
  function markSVG(style = 'lit', id = 'r3', e = 1.2) {
    if (style === 'game') return rawGlyph('mark').replace(/url\(#roughS\)/g, `url(#${id}roughS)`).replace(/url\(#brush\)/g, `url(#${id}brush)`);
    // the box's dashes as explicit pieces walked round the 38x34 box at (6,8), in the game's 6-on/4-off
    // rhythm fitted to each side (four periods a side, so every corner turns on an L-shaped dash and the
    // box is even all round). Each piece is drawn three times: an ink edge e units bigger all round,
    // the cobalt offset, the acid.
    const per = [[6, 8], [44, 8], [44, 42], [6, 42]], lens = [38, 34, 38, 34], P = 144;
    const start = [0, 38, 72, 110];
    const at = (s) => { s = ((s % P) + P) % P; let i = 0; while (i < 3 && s > lens[i]) { s -= lens[i]; i++; } const [x0, y0] = per[i], [x1, y1] = per[(i + 1) % 4]; const t = s / lens[i]; return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]; };
    const piece = (s0, s1) => { const pts = [at(s0)]; start.concat(start.map((c) => c + P), start.map((c) => c - P)).forEach((c) => { if (c > s0 && c < s1) pts.push(at(c)); }); pts.push(at(s1)); return 'M' + pts.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join(' L'); };
    const half = (i) => .3 * lens[(i + 4) % 4] / 4;
    const dashes = (ext) => {
      const out = [];
      for (let i = 0; i < 4; i++) {
        out.push(piece(start[i] - half(i - 1) - ext, start[i] + half(i) + ext));                 // the corner L
        for (let j = 1; j < 4; j++) { const c = start[i] + j * lens[i] / 4; out.push(piece(c - half(i) - ext, c + half(i) + ext)); }
      }
      return out.join(' ');
    };
    const dash = (c, dx) => `<path d="${dashes(0)}" transform="translate(${dx} ${dx})" fill="none" stroke="${c}" stroke-width="3.5" stroke-linejoin="miter" stroke-linecap="butt"/>`;
    const ink = (dx) => e ? `<path d="${dashes(e)}" transform="translate(${dx} ${dx})" fill="none" stroke="#15131a" stroke-width="${3.5 + 2 * e}" stroke-linejoin="miter" stroke-linecap="butt"/>` : '';
    const cur = OL('M30 24 L30 58 L38 50 L44 62 L50 59 L44 47 L55 47 Z', '#d4141c', 3).replace(/url\(#rough\)/g, `url(#${id}roughS)`).replace(/url\(#brush\)/g, `url(#${id}brush)`);
    // the dashes take the name's cobalt offset, tightened to 1.8 units so a 3.5-unit dash keeps one shape
    return `<svg viewBox="0 0 64 64">${ink(1.8)}${ink(0)}${dash(COBALT, 1.8)}${dash(ACID, 0)}${cur}</svg>`;
  }
  const filtDefs = (id) => `<filter id="${id}roughS" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="1.8" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="${id}brush" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="turbulence" baseFrequency=".9 .035" numOctaves="2" seed="5" result="n"/><feColorMatrix in="n" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.1 .42" result="w"/><feComposite in="w" in2="SourceAlpha" operator="in" result="s"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="s"/></feMerge></filter>`;
  /* returns the lockup as an <svg> fitted to its own box. w = output width in px (height follows).
     o.mark: 'lit' | 'game' | false;  o.edge: ink edge stroke (font units) under the letters (default 80,
     40 showing outside the letter: invisible on night, the letters' edge on linen), 0 = none. */
  function lockup(w = 1200, o = {}) {
    const id = o.id || 'r3', mark = o.mark === undefined ? 'lit' : o.mark, edge = o.edge === undefined ? 80 : o.edge;
    const l1 = setLine('OUT OF'), l2 = setLine('SCOPE'), bw = Math.max(l1.w, l2.w);
    const off = 1000 * 3 / 70; // the cobalt offset: 3px at the title screen's 70px
    const b1 = 829, b2 = 829 + 860, bh = 1720; // baselines for line-height .86 (Tabloid ascent 1105, descent 307)
    const line = (L, b, fill, dx = 0, dy = 0, stroke = '') => L.g.map(([x, d]) => `<path transform="translate(${(x - L.w / 2 + dx).toFixed(1)} ${(b + dy).toFixed(1)})" d="${d}" fill="${fill}"${stroke}/>`).join('');
    const ink = edge ? ` stroke="#15131a" stroke-width="${edge}" stroke-linejoin="round"` : '';
    const name = `<g transform="rotate(-2 0 ${bh / 2})">
        ${edge ? line(l1, b1, '#15131a', off, off, ink) + line(l2, b2, '#15131a', off, off, ink) + line(l1, b1, '#15131a', 0, 0, ink) + line(l2, b2, '#15131a', 0, 0, ink) : ''}
        ${line(l1, b1, COBALT, off, off)}${line(l2, b2, COBALT, off, off)}
        ${line(l1, b1, ACID)}${line(l2, b2, ACID)}</g>`;
    const ms = 657, mg = 114; // mark 46px and gap 8px at 70px
    const mk = mark ? place(markSVG(mark, id, edge ? 1.0 : 0), -ms / 2, -mg - ms, ms) : '';
    const pad = 70 + edge;
    const x0 = -bw / 2 - pad, x1 = bw / 2 + off + pad, y0 = (mark ? -mg - ms + 40 : -40) - pad, y1 = bh + off + 40 + pad;
    const vw = x1 - x0, vh = y1 - y0, h = w * vh / vw;
    return `<svg viewBox="${x0.toFixed(1)} ${y0.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" xmlns="http://www.w3.org/2000/svg"><defs>${filtDefs(id)}</defs>${mk}${name}</svg>`;
  }
  const lockupH = (w, o) => { const s = lockup(w, o); return +s.match(/height="([\d.]+)"/)[1]; };

  /* a check sheet for the lockup at a few widths, on night and on linen */
  function lockupSheet(widths = [90, 120, 180, 300], o = {}) {
    const rows = [['#0B0910', 'night'], ['#F1ECE4', 'linen']];
    const tot = widths.reduce((a, b) => a + b + 40, 40), hh = Math.max(...widths.map((w) => lockupH(w, o))) + 40;
    let s = '';
    rows.forEach(([bg], r) => { s += `<rect x="0" y="${r * hh}" width="${tot}" height="${hh}" fill="${bg}"/>`; let x = 40; widths.forEach((w, i) => { s += `<g transform="translate(${x} ${r * hh + 20})">${lockup(w, Object.assign({ id: 'ls' + r + i }, o))}</g>`; x += w + 40; }); });
    return `<svg viewBox="0 0 ${tot} ${hh * 2}" width="${tot}" height="${hh * 2}">${s}</svg>`;
  }

  /* ---------------- 19 · share card ----------------
     The poster's register, recomposed for the link preview: Regent full length on a hard floor line,
     stamp raised, in the light of the cracked CRT standing on the floor at the right edge (cropped by
     it). The fan dies out before the middle, so the left half stays plain void for the lockup, and the
     floor band at the bottom is flat and quiet (the platform lays its linen bar there). */
  function share(W = 1200, H = 630, o = {}) {
    const reg = cast.regent(o.emo || 'gleeful');
    const L = Object.assign({ fw: 390, fx: null, fy: 14, face: .71, mw: 320, mx: 955, floor: 548, R: 470, spread: 2.2, lw: 430, lx: 255, ly: 274, rim: 7 }, o.L || {});
    const fx = L.fx != null ? L.fx : W * L.face - .506 * L.fw;
    const ms = L.mw / 520, my = L.my != null ? L.my : L.floor - 478 * ms;
    const gx = L.mx + 120 * ms, gy0 = my + 92 * ms, gy1 = my + 336 * ms, gc = (gy0 + gy1) / 2;
    const steps = o.steps || [[1.1, TOXIC, .12], [.86, TOXIC, .26], [.66, TOXIC, .55], [.5, TOXIC, 1], [.36, LIME, 1], [.24, ACID, 1]];
    const lt = light('r3sf', gx + 6 * ms, gc, L.R, { steps, spread: L.spread, gh: (gy1 - gy0) / 2 + 8 * ms, lw: .8, seed: 3 });
    const r = rnd(9); let specks = '';
    for (let i = 0; i < 30; i++) { const a = (r() - .5) * 1.6, d = (.12 + r() * .85) * L.R, yy = gc + Math.sin(a) * d, rr = r(), oo = r(); if (yy > L.floor - 20) continue; specks += `<circle cx="${(gx - Math.cos(a) * d).toFixed(1)}" cy="${yy.toFixed(1)}" r="${(1 + rr * 2).toFixed(1)}" fill="#fffbea" opacity="${(.2 + oo * .45).toFixed(2)}"/>`; }
    const lk = o.noTitle ? '' : (() => { const lwpx = L.lw, lh = lockupH(lwpx); return `<g transform="translate(${(L.lx - lwpx / 2).toFixed(1)} ${(L.ly - lh / 2).toFixed(1)})">${lockup(lwpx, { id: 'sc' })}</g>`; })();
    const body = `
      <rect width="${W}" height="${H}" fill="${VOID}"/>
      <g clip-path="url(#r3wall)">${lt.body.replace(/<\/g>$/, specks + '</g>')}</g>
      <rect x="-10" y="${L.floor}" width="${W + 20}" height="${H - L.floor + 10}" fill="${DP.NIGHT}"/>
      ${ST(`M-10 ${L.floor} H${W + 10}`, 4, '#15131a')}
      ${place(POSTER.crt('r3glass'), L.mx, my, L.mw)}
      <g filter="url(#r3prim)">${place(reg, fx, L.fy, L.fw)}</g>
      ${lk}`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${rimFilter('r3prim', ACID, 1, -.2, L.rim, 1)}${lt.defs}<clipPath id="r3wall"><rect x="-10" y="-10" width="${W + 20}" height="${L.floor + 10}"/></clipPath></defs>${body}</svg>`;
  }

  return { backdrop, share, lockup, lockupH, lockupSheet, light, skyline, chair, markSVG };
})();
