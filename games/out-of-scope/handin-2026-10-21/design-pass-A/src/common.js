/* ============================================================
   bug.games design pass · shared helpers for every picture.
   Everything here draws with OUT OF SCOPE's own drawing code: the art functions
   (suitB, sharkB, haloD, bombB, ghostB, flossB, principalD, gordonFull, priyaFull, ...),
   the line helpers (OL, ST, SP, DOT, FL), the palette (BK, D, P) and the page's
   line filters (#rough, #roughS, #rough2, #brush), all live in the game build.
   This file only adds: placement, a light (rim + cast shadow + stepped glow), and
   torn-paper shapes. It never changes the game's colours.
   ============================================================ */
window.DP = (() => {
  window.scrawl = () => '';                 // no scrawled words on platform art (they would be text)

  /* ---------- svg plumbing ---------- */
  const strip = (s) => s.replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  const vb = (s) => ((s.match(/viewBox="([^"]+)"/) || [, '0 0 100 100'])[1]).trim().split(/[\s,]+/).map(Number);
  /* place a whole art svg (one of the game's characters) at x,y, w wide (height from its viewBox) */
  function place(svg, x, y, w, { flip = false, rot = 0, filter = '', cls = '', h = null, op = 1 } = {}) {
    const [vx, vy, vw, vh] = vb(svg); const H = h != null ? h : w * vh / vw;
    const inner = `<svg x="0" y="0" width="${w}" height="${H}" viewBox="${vx} ${vy} ${vw} ${vh}" overflow="visible">${strip(svg)}</svg>`;
    let t = `translate(${x} ${y})`;
    if (rot) t += ` rotate(${rot} ${w / 2} ${H / 2})`;
    if (flip) t += ` translate(${w} 0) scale(-1 1)`;
    return `<g transform="${t}"${filter ? ` filter="url(#${filter})"` : ''}${cls ? ` class="${cls}"` : ''}${op !== 1 ? ` opacity="${op}"` : ''}>${inner}</g>`;
  }
  const size = (svg, w) => { const [, , vw, vh] = vb(svg); return { w, h: w * vh / vw }; };

  /* ---------- seeded random ---------- */
  function rnd(seed = 1) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  /* ---------- torn paper: a polygon whose edges are ripped (the game's patch language) ---------- */
  function torn(pts, { seed = 4, step = 26, amp = 9 } = {}) {
    const r = rnd(seed); const out = [];
    for (let i = 0; i < pts.length; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length];
      const L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.round(L / step));
      const nx = -(y1 - y0) / (L || 1), ny = (x1 - x0) / (L || 1);
      for (let k = 0; k < n; k++) {
        const u = k / n, j = k === 0 ? 0 : (r() - .5) * 2 * amp;
        out.push([x0 + (x1 - x0) * u + nx * j, y0 + (y1 - y0) * u + ny * j]);
      }
    }
    return 'M' + out.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + ' Z';
  }
  /* a ragged blob around a centre (for light pools): radius rx, ry, ripped edge */
  function blob(cx, cy, rx, ry, { seed = 7, n = 34, amp = .08, rot = 0 } = {}) {
    const r = rnd(seed); const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2, k = 1 + (r() - .5) * 2 * amp;
      const x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k, c = Math.cos(rot), s = Math.sin(rot);
      pts.push([cx + x * c - y * s, cy + x * s + y * c]);
    }
    return 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + ' Z';
  }

  /* ---------- the light ----------
     The world has one light: the acid glow of the cracked monitor (title screen: #e6ff2e fading
     through toxic #39e07a into the dark). Here it is drawn the way the game draws everything:
     flat, hard-edged steps, with a rim on the lit edge of a figure and a hard cast shadow. */
  const ACID = '#e6ff2e', TOXIC = '#39e07a', VOID = '#050407', NIGHT = '#0b0a0e', INK = '#15131a';
  /* rim light filter: paints `col` on the edge of a shape facing direction (dx,dy) (unit) with width w */
  const rimFilter = (id, col = ACID, dx = 1, dy = 0, w = 7, op = 1) => `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
      <feOffset in="SourceAlpha" dx="${(-dx * w).toFixed(2)}" dy="${(-dy * w).toFixed(2)}" result="sh"/>
      <feComposite in="SourceAlpha" in2="sh" operator="out" result="edge"/>
      <feFlood flood-color="${col}" flood-opacity="${op}"/><feComposite in2="edge" operator="in" result="rim"/>
      <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="rim"/></feMerge></filter>`;
  /* silhouette filter: the shape as one flat colour (for cast shadows) */
  const silFilter = (id, col = VOID, op = 1) => `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
      <feFlood flood-color="${col}" flood-opacity="${op}"/><feComposite in2="SourceAlpha" operator="in"/></filter>`;
  /* stepped glow: concentric ragged rings, light to dark, around a source */
  function glow(cx, cy, rx, ry, { steps = [[1, ACID, 1]], seed = 11, amp = .07, rot = 0 } = {}) {
    return steps.map(([k, col, op], i) => `<path d="${blob(cx, cy, rx * k, ry * k, { seed: seed + i * 13, amp, rot })}" fill="${col}" opacity="${op}"/>`).join('');
  }

  /* ---------- the cast, with the game's own art and colours ---------- */
  /* remove letters from a character (the hat's OK, any <text>): for pictures that must carry no text */
  const noText = (svg) => svg.replace(/<text[\s\S]*?<\/text>/g, '');
  const cast = {
    regent: (emo = 'gleeful', o = {}) => (o.noText ? noText(suitB({ emo })) : suitB({ emo })),
    kickback: (emo = 'greedy', o = {}) => sharkB(Object.assign({ emo, tank: false, tag: false, receipt: false }, o)),
    halo: (emo = 'gleeful', o = {}) => haloD(Object.assign({ emo, mini: false }, o)),
    deadline: (emo = 'smug', o = {}) => bombB(Object.assign({ emo, mini: false, led: ' ' }, o)),  // LED left blank: no numbers in platform art
    bcc: (emo = 'gleeful', o = {}) => ghostB(Object.assign({ emo, look: [0, 0] }, o)),
    floss: (emo = 'gleeful', o = {}) => flossB(Object.assign({ emo, mini: false }, o)),
    principal: (emo = 'smug', o = {}) => principalD(Object.assign({ emo, orbit: false }, o)),
    gordon: (o = {}) => gordonFull(Object.assign({ emo: 'shocked', pose: 'phone', count: '', drip: true }, o)),
    priya: (o = {}) => priyaFull(Object.assign({ emo: 'shocked', tablet: true }, o)),
  };

  /* the cracked monitor, drawn with the game's helpers in the game's own colours (title.js):
     beige plastic #d8cfb3, stand #c8bea2, foot #b9ae90, screen #050806, power LED toxic.
     `lit` (0..1) fills the glass with the acid glow; the crack is where they got out. */
  function monitor({ lit = 1, id = 'mglow', crack = true } = {}) {
    const g = `<defs><radialGradient id="${id}" cx="58%" cy="40%" r="70%"><stop offset="0" stop-color="${ACID}" stop-opacity="${lit}"/><stop offset=".42" stop-color="${ACID}" stop-opacity="${.92 * lit}"/><stop offset=".74" stop-color="${TOXIC}" stop-opacity="${.75 * lit}"/><stop offset="1" stop-color="#0d3a22" stop-opacity="${lit}"/></radialGradient></defs>`;
    return `<svg viewBox="-10 -10 660 540">${g}
      ${OL('M34 22 Q320 6 606 22 Q626 200 614 408 Q320 426 26 410 Q14 200 34 22Z', '#d8cfb3', 7)}
      <path d="M70 60 Q320 48 570 60 Q582 210 572 356 Q320 370 68 358 Q58 210 70 60Z" fill="#050806" stroke="${BK}" stroke-width="7"/>
      <path d="M70 60 Q320 48 570 60 Q582 210 572 356 Q320 370 68 358 Q58 210 70 60Z" fill="url(#${id})"/>
      ${crack ? `${ST('M520 60 L500 104 L532 130 L494 168 M500 104 L462 96 M532 130 L566 150 M494 168 L470 210 M494 168 L540 196 M470 210 L430 222 M470 210 L486 262', 5, BK)}<path d="M512 60 L526 60 L538 88 L516 94Z" fill="${BK}"/>` : ''}
      ${ST('M44 392 Q320 406 598 392', 3, '#8f8670')}${DOT(560, 388, 6, TOXIC)}${ST('M92 388 H150', 4, '#8f8670')}${ST('M92 398 H130', 4, '#8f8670')}
      ${OL('M260 418 L380 418 L408 488 L232 488Z', '#c8bea2', 7)}${OL('M190 486 Q320 474 450 486 L456 508 Q320 500 184 508Z', '#b9ae90', 7)}
    </svg>`;
  }

  return { noText, strip, vb, place, size, rnd, torn, blob, glow, rimFilter, silFilter, cast, monitor, ACID, TOXIC, VOID, NIGHT, INK };
})();
