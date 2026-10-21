/* ============================================================
   EVENT · Mail Day banner (agent: store)
   Gordon's office at dawn as wave two sends. The office window (officeScene: the tall window,
   black mullions, the city, the empty CEO chair, Gordon's desk) now holds a pink morning sky,
   and envelopes (envSVG, in pipeScene's white / hot pink / acid) pour in through it like
   weather. Bcc (ghostB, the game's own art) rides the stream.
   One light, drawn the poster's way: the low sun in the window, in flat torn steps
   (white -> cream -> pink -> hot pink -> ghost blue -> night navy), with a cream rim on
   everything that faces it. The left 45 % (774 px) is plain dark for the platform's copy and
   Join: nothing hot crosses it. No text, no counter.
   ============================================================ */
window.EVENT = (() => {
  const { torn, rnd, rimFilter, place, VOID } = DP;
  const CREAM = '#fff6e6', SUN = '#fffbea', PINK = '#ff4f9a', HOT = '#ff2e88', NAVY = '#141f45', GHOST = '#222b72', WALL = '#0b0a14';

  function banner(W = 1720, H = 600, o = {}) {
    const KEEP = Math.round(W * .45);                       // 774: the copy side, plain dark
    const win = { x0: 904, y0: 30, x1: 1654, y1: 420 };       // the office window
    const midX = 1272, midY = 214;
    const sun = o.sun || [1482, 304];
    // the dawn sky: stepped rings around the low sun (the poster's torn steps, in the window's colours)
    const ring = (f, seed) => { const n = 44, pts = []; for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; pts.push([sun[0] + Math.cos(t) * 700 * f, sun[1] + Math.sin(t) * 380 * f]); } return torn(pts, { seed, step: 34, amp: 9 }); };
    const sky = [[1.0, GHOST], [.68, HOT], [.4, PINK]].map(([f, c], i) => `<path d="${ring(f, 4 + i * 5)}" fill="${c}"/>`).join('')
      + `<path d="${DP.blob(sun[0], sun[1], 66, 66, { seed: 3, amp: .05 })}" fill="${CREAM}"/><circle cx="${sun[0]}" cy="${sun[1]}" r="42" fill="#fff"/>`;
    // the city (officeScene's skyline, in the boardroom's dawn maroon); low where the sun comes up
    const R = rnd(11); let city = '';
    for (let i = 0; i < 18; i++) { const x = win.x0 - 10 + i * 44, near = Math.abs(x + 20 - sun[0]) < 96, h = near ? 22 + R() * 26 : 56 + R() * 140, w = 34 + R() * 18; city += `<rect x="${x.toFixed(0)}" y="${(win.y1 - h).toFixed(0)}" width="${w.toFixed(0)}" height="${(h + 4).toFixed(0)}" fill="#3a1a2a"/>`; for (let wy = win.y1 - h + 14; wy < win.y1 - 10; wy += 24) for (let wx = x + 7; wx < x + w - 8; wx += 13) if (R() > .82) city += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="5" height="8" fill="${CREAM}" opacity=".5"/>`; }
    const env = (x, y, w, r, col, sw) => { const h = w * 36 / 56; return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(1)})">${OL(`M${-w / 2} ${-h / 2} H${w / 2} V${h / 2} H${-w / 2} Z`, col, sw)}${ST(`M${-w / 2} ${-h / 2} L0 ${h * .1} L${w / 2} ${-h / 2}`, sw * .85)}</g>`; };
    const cols = ['#fff', HOT, D.acid];

    // the stream, as weather: envelopes blow in out of the sunrise and fall across the room, top right to bottom
    // left along one diagonal river that Bcc rides. Far ones are small and in the window; near ones big and few.
    const sr = rnd(o.seed || 9), far = [], near = [], placed = [];
    const bx = o.bx || 1150, by = o.by || 66;                       // Bcc (262 wide), centred in the right 55 %
    const core = (y) => 1650 - (y - 80) * 1.2;                     // the river's centre line: x at height y
    for (let i = 0; i < 900 && placed.length < (o.keep || 62); i++) {
      const y = 60 + sr() * (H - 30), d = (sr() + sr() - 1) * (120 + y * .35);
      const x = core(y) + d;
      const depth = Math.min(1, Math.max(0, (y - 50) / (H - 50)) * .85 + sr() * .3);
      const w = 16 + 96 * depth * depth;
      if (x - w * .6 < KEEP + 64 || x + w * .5 > W - 6 || y - w * .4 < 36 || y > H + 4) continue;
      if (x > bx - 10 && x < bx + 262 && y > by + 30 && y < by + 350) continue;          // Bcc's own space
      if (placed.some(([px, py, pw]) => Math.hypot(px - x, (py - y) * 1.3) < (pw + w) * .5)) continue;  // room around each
      if (Math.hypot(x - sun[0], y - sun[1]) < 74 + w * .5) continue;                       // the sun stays clear
      const inside = x > win.x0 + 14 && x < win.x1 - 14 && y > win.y0 + 14 && y < win.y1 - 14;
      if (!inside && w < 44) continue;                                                       // small (far) ones only out in the sky
      placed.push([x, y, w]);
      const inWin = x > win.x0 + 8 && x < win.x1 - 8 && y > win.y0 + 8 && y < win.y1 - 8 && w < 38;
      (inWin ? far : near).push([w, env(x, y, w, -24 + (sr() - .5) * 100, cols[i % 3], 2 + w / 24)]);
    }
    near.sort((a, b) => a[0] - b[0]);
    const nearBack = near.filter((v) => v[0] < 56).map((v) => v[1]).join(''), nearFront = near.filter((v) => v[0] >= 56).map((v) => v[1]).join('');

    const windowG = `<clipPath id="evWin"><path d="M${win.x0} ${win.y0} H${win.x1} V${win.y1} H${win.x0} Z"/></clipPath>
      <g clip-path="url(#evWin)"><rect x="${win.x0}" y="${win.y0}" width="${win.x1 - win.x0}" height="${win.y1 - win.y0}" fill="${NAVY}"/>${sky}${city}<g filter="url(#evRim)">${far.map((v) => v[1]).join('')}</g></g>
      ${ST(`M${win.x0} ${win.y0} H${win.x1} V${win.y1} H${win.x0} Z M${midX} ${win.y0} V${win.y1} M${win.x0} ${midY} H${win.x1}`, 14, VOID)}
      ${OL(`M${win.x0 - 22} ${win.y1 + 2} H${win.x1 + 22} V${win.y1 + 22} H${win.x0 - 22} Z`, '#2d2a38', 7)}${ST(`M${win.x0 - 18} ${win.y1 + 5} L${win.x1 + 18} ${win.y1 + 3}`, 3, PINK)}`;

    // the light the window throws on Gordon's desk: the window's shape, flat steps, the mullions' cross in it
    const fl = (k, seed) => torn([[win.x0 - 10 - 60 * k, 508], [win.x1 + 10 + 20 * k, 508], [win.x1 - 70 + 30 * k, H + 20], [win.x0 - 170 - 80 * k, H + 20]], { seed, step: 30, amp: 5 });
    const cross = `<path d="M${midX - 52} 508 L${midX - 18} 508 L${midX - 96} ${H + 20} L${midX - 136} ${H + 20} Z" fill="#2a1e18"/>`;
    const shaft = `<path d="${fl(1, 3)}" fill="${PINK}" opacity=".1"/><path d="${fl(0, 7)}" fill="${PINK}" opacity=".2"/>${cross}`;
    const desk = `M${KEEP + 110} 506 H${W + 20} V${H + 20} H${KEEP + 60} Z`;
    const deskG = `<path d="${desk}" fill="#3a2a22"/><clipPath id="evDesk"><path d="${desk}"/></clipPath><g clip-path="url(#evDesk)">${shaft}</g>
      ${ST(desk, 7, VOID)}${ST(`M${KEEP + 116} 510 L${W + 10} 507`, 4, PINK)}`;

    // Bcc riding the crest on three envelopes, leaning into it, all eyes ahead
    const bcc = ghostB({ emo: 'gleeful', look: [-.75, .3], mini: false });
    const bccG = `<g filter="url(#evRimB)">${place(bcc, bx, by, 262, { rot: -18 })}</g>`;
    const board = env(bx + 108, by + 330, 156, -22, '#fff', 7) + env(bx + 46, by + 352, 112, -30, HOT, 6) + env(bx + 176, by + 300, 100, -12, D.acid, 6);

    const defs = `<defs>${rimFilter('evRim', CREAM, 1, -.4, 6)}${rimFilter('evRimB', CREAM, 1, -.3, 9)}</defs>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs}
      <rect width="${W}" height="${H}" fill="${WALL}"/>
      ${windowG}
      ${deskG}
      <g filter="url(#evRim)">${nearBack}</g>
      <g filter="url(#evRim)">${board}</g>
      ${bccG}
      <g filter="url(#evRim)">${nearFront}</g>
    </svg>`;
  }
  return { banner };
})();
