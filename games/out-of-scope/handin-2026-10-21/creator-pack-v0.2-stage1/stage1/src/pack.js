/* bug.games package art for OUT OF SCOPE. Drawn with the game's own art code (marker line,
   offset-shadow fills, rough displacement, torn patches); composed new for each slot. */
window.PK = (() => {
  const GOLD = /#ffc400/gi;                       // sun-guarded: retired from package art
  const noGold = (s) => s.replace(GOLD, '#e6ff2e');
  const RED = '#d4141c';                          // the only red in package art (#ff2a1a is ember-guarded)
  window.scrawl = () => '';                       // no scrawled words on plates that can shrink
  const patch = (d, fill, op = 1) => `<path d="${d}" fill="${fill}" opacity="${op}" filter="url(#rough2)"/>`;
  const env = (c = '#fff') => `<svg viewBox="0 0 64 44">${OL('M4 4 H60 V40 H4 Z', c, 4)}${ST('M4 4 L32 26 L60 4', 4)}</svg>`;
  /* a forged approval slip with no words: colour bar, pictogram, ruled lines, the phone badge */
  const slip = (pic, col) => `<svg viewBox="0 0 300 92">${OL('M6 6 H294 V86 H6 Z', '#fffbea', 5)}<path d="M8 8 H26 V84 H8 Z" fill="${col}"/>${ST('M26 8 V84', 4)}
    <g transform="translate(36 12) scale(.85)">${noGold(picto(pic).replace(/^<svg[^>]*>|<\/svg>$/g, ''))}</g>
    ${ST('M118 30 H232 M118 50 H252 M118 68 H200', 7, '#15131a')}${ST('M118 30 H160', 7, '#7a6a58')}
    <g transform="translate(250 22) scale(.7)">${phoneBadge().replace(/^<svg[^>]*>|<\/svg>$/g, '').replace(/<text[\s\S]*?<\/text>/, '')}</g></svg>`;
  /* the monitor they got out of: cream plastic, black glass, one acid burst */
  const monitor = (glow = 1) => `<svg viewBox="-10 -10 660 540" class="mon-art">
    <defs><radialGradient id="pkglow" cx="50%" cy="48%" r="58%"><stop offset="0" stop-color="#e6ff2e" stop-opacity="${glow}"/><stop offset=".3" stop-color="#e6ff2e" stop-opacity="${.85 * glow}"/><stop offset=".62" stop-color="#39e07a" stop-opacity="${.35 * glow}"/><stop offset="1" stop-color="#050806" stop-opacity="0"/></radialGradient></defs>
    ${OL('M34 22 Q320 6 606 22 Q626 200 614 408 Q320 426 26 410 Q14 200 34 22Z', '#f3eee4', 8)}
    ${ST('M52 46 Q320 32 588 46', 3, '#c9c1ad')}
    <path d="M70 60 Q320 48 570 60 Q582 210 572 356 Q320 370 68 358 Q58 210 70 60Z" fill="#050806" stroke="#15131a" stroke-width="8"/>
    <path d="M140 104 L232 64 L300 118 L384 58 L474 106 L534 192 L498 262 L552 330 L432 344 L370 304 L300 348 L226 300 L140 330 L108 250 L156 190 Z" fill="url(#pkglow)"/>
    ${ST('M140 104 L232 64 L300 118 L384 58 L474 106 L534 192 L498 262 L552 330 L432 344 L370 304 L300 348 L226 300 L140 330 L108 250 L156 190 Z', 6, '#e6ff2e')}
    ${ST('M140 104 L90 66 M474 106 L566 70 M552 330 L572 352 M140 330 L84 356 M108 250 L66 252 M226 300 L210 360', 5, '#e8e2d2')}
    ${ST('M44 392 Q320 406 598 392', 3, '#a59d88')}${SP(560, 389, 7, '#39e07a', 3)}
    ${OL('M262 418 L378 418 L404 486 L236 486Z', '#e3dccb', 8)}${OL('M190 484 Q320 472 450 484 L456 508 Q320 500 184 508Z', '#d6cfbd', 8)}
  </svg>`;
  const blocks = {
    regent: (emo = 'gleeful') => noGold(suitB({ emo })),
    kickback: () => noGold(sharkB({ emo: 'gleeful', tank: false, tag: false, receipt: false })),
    halo: () => noGold(haloD({ emo: 'gleeful', mini: false })),
    bcc: (emo = 'gleeful') => noGold(ghostB({ emo, look: [-.5, -.15] })),
    bomb: (emo = 'gleeful') => noGold(bombB({ emo, mini: false, led: ' ' }).replace(/<text[^>]*class="led"[^>]*>[\s\S]*?<\/text>/, `<g fill="${RED}"><rect x="148" y="333" width="9" height="12"/><rect x="160" y="333" width="9" height="12"/><rect x="174" y="333" width="9" height="12"/><rect x="186" y="333" width="9" height="12"/></g>`)),
  };
  /* ---------------- POSTER MASTER 2:1 ---------------- */
  function poster(W = 1600, H = 800) {
    const k = W / 1600;
    return `<div class="pk pk-poster" style="width:${W}px;height:${H}px;--k:${k}">
      <svg class="pk-bg" viewBox="0 0 1600 800" preserveAspectRatio="none">
        <rect width="1600" height="800" fill="#0b0a0e"/>
        ${patch('M-40 470 L560 430 L640 560 L700 840 L-40 840 Z', '#e6ff2e')}
        ${patch('M980 -40 L1640 -40 L1640 300 L1120 360 L1010 250 Z', '#ff2e88')}
        ${patch('M1010 560 L1640 470 L1640 840 L960 840 Z', '#1f4bff')}
        ${[...Array(60)].map((_, i) => `<circle cx="${(i * 263) % 1600}" cy="${(i * 151) % 760}" r="${1.2 + (i % 3)}" fill="#fff" opacity="${.07 + (i % 4) * .03}"/>`).join('')}
        <rect y="770" width="1600" height="30" fill="#0b0a0e"/>
      </svg>
      <div class="pk-a p-halo">${blocks.halo()}</div>
      <div class="pk-slip s1">${slip('fired', '#ff2e88')}</div>
      <div class="pk-slip s2">${slip('locked', '#1f4bff')}</div>
      <div class="pk-slip s3">${slip('cleared', '#ff8a1f')}</div>
      <div class="pk-env e1">${env('#fff')}</div><div class="pk-env e2">${env('#ff2e88')}</div><div class="pk-env e3">${env('#e6ff2e')}</div><div class="pk-env e4">${env('#62c6ff')}</div><div class="pk-env e5">${env('#fff')}</div>
      <div class="pk-mon">${monitor()}</div>
      <div class="pk-a p-regent emerge">${blocks.regent()}</div>
      <div class="pk-a p-kick">${blocks.kickback()}</div>
      <div class="pk-a p-bcc emerge-r">${blocks.bcc()}</div>
      <div class="pk-a p-bomb">${blocks.bomb()}</div>
    </div>`;
  }
  /* ---------------- STORE ITEM: Gordon's fern (a desk companion) ---------------- */
  function fern(S = 400) {
    /* one frond: a scalloped leaf blade along a bent spine, flat green, marker outline */
    const frond = (x, y, len, ang, bend, w0 = 30, fill = '#39e07a') => {
      const N = 36, L = [], R = [], spine = [];
      for (let i = 0; i <= N; i++) {
        const u = i / N, t = u * .86, a = (ang + bend * t * t) * Math.PI / 180;
        const px = Math.cos(a) * len * t, py = Math.sin(a) * len * t;
        spine.push([px, py]);
        const nx = -Math.sin(a), ny = Math.cos(a);
        const w = w0 * Math.pow(Math.sin(Math.PI * (.06 + u * .94)), .6) * (1 - .45 * u) * (.2 + .8 * Math.pow(Math.abs(Math.sin(u * Math.PI * 8.5)), .55));
        L.push([px + nx * w, py + ny * w]); R.push([px - nx * w, py - ny * w]);
      }
      const pts = L.concat(R.reverse()), d = 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + ' Z';
      const rib = 'M' + spine.slice(0, N - 6).map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
      return `<g transform="translate(${x} ${y})">${OL(d, fill, 5)}${ST(rib, 3.5, '#1d7a44')}</g>`;
    };
    return `<div class="pk pk-store" style="width:${S}px;height:${S}px"><svg viewBox="0 0 400 400" width="${S}" height="${S}">
      <rect width="400" height="400" fill="#1d1b22"/>
      ${patch('M-20 -20 L330 -20 L290 120 L-20 190 Z', '#e6ff2e')}
      ${patch('M270 310 L420 262 L420 420 L240 420 Z', '#ff2e88')}
      <path d="M0 330 L400 314 L400 400 L0 400 Z" fill="#2a2731"/>${ST('M0 330 L400 314', 5, '#15131a')}
      <ellipse cx="202" cy="352" rx="84" ry="12" fill="#000" opacity=".5"/>
      ${frond(194, 252, 156, -152, -52, 28, '#2fc76a')}${frond(210, 252, 156, -28, 52, 28, '#2fc76a')}
      ${frond(196, 248, 166, -126, -56)}${frond(208, 248, 166, -54, 56)}
      ${frond(198, 246, 160, -104, -40)}${frond(206, 246, 160, -76, 40)}${frond(202, 248, 140, -90, -14, 26)}
      ${OL('M146 260 L258 260 L248 346 L156 346 Z', '#f3eee4', 6)}<path d="M150 290 L254 290 L252 308 L152 308 Z" fill="#1f4bff"/>${ST('M150 290 L254 290 M152 308 L252 308', 4)}
      ${OL('M138 244 L266 244 L262 270 L142 270 Z', '#e3dccb', 6)}
      <g transform="translate(226 318) rotate(9)">${OL('M0 0 H40 V26 H0 Z', '#fffbea', 4)}${ST('M9 10 H31 M9 18 H24', 3.5, '#15131a')}</g>
    </svg></div>`;
  }
  return {
    poster, fern, monitor,
    show(html) { let el = document.getElementById('pkw'); if (!el) { el = document.createElement('div'); el.id = 'pkw'; document.body.appendChild(el); } el.innerHTML = html; return true; },
  };
})();
