/* ============================================================
   SEALS · picture 8 (and the event seal of picture 16)
   One 192x192 seal per moment, in three states, drawn with OUT OF SCOPE's own helpers
   (OL / ST / SP / DOT, the page's #roughS / #rough / #brush filters, BK, D, P) and the
   poster's light (flat torn steps acid -> lime -> toxic -> void, an acid rim on the lit edge).

   Outline by kind (all things in the world):
     feat        a round rubber-stamp impression: thick double ring, rough inked edge
     collection  a dog-eared file card
     event       a perforated postage stamp
   States, all drawn (no veil, no overlay):
     earned      the world lit: void ground, the screen's acid light step from the upper right,
                 an acid rim on the glyph, the glyph in its own game colours, one hot accent
     progress    the light is low: dim green steps instead of acid, ink half laid, no rim
     locked      a quiet grey outline, the symbol in grey line only
   No text, no numbers, no gold, no padlock.
   ============================================================ */
window.SEALS = (() => {
  const { torn, blob, rnd, rimFilter, ACID, TOXIC, VOID } = DP;
  const LIME = '#b6f03c', DIM = '#1d6b3a', DEEP = '#0d3a22';     // the poster's falloff + the CRT glass's dim greens
  const PINK = '#ff2e88', BLOOD = D.blood, PAPER = '#fff6e6', WHITE = '#ffffff';
  const GREY = '#8a8398';                                       // the game's own "not yet" achievement grey (.ach in style.css)
  const HALF = .42;                                             // ink half laid (progress)
  const LDIR = [.74, -.67];                                     // the screen is to the upper right (as on the poster)
  let _id = 0; const uid = (p) => `${p}${++_id}`;
  const rs = (s) => s.replace(/url\(#rough\)/g, 'url(#roughS)');

  /* ---------- the drawing kit for one state: the game's helpers, state-aware ---------- */
  function kit(state) {
    const lock = state === 'locked', prog = state === 'progress';
    const half = (s) => s.replace(' transform="translate(3 3)"', ` fill-opacity="${HALF}" transform="translate(3 3)"`);
    const g = {
      state, lock, prog, lit: state === 'earned',
      /* outlined, filled shape (OL) */
      o: (d, f, sw = 6) => lock ? ST(d, sw * .8, GREY) : prog ? half(OL(d, f, sw)) : OL(d, f, sw),
      /* a fill with no line (water, a shadow) */
      f: (d, f, op = 1) => lock ? '' : `<path d="${d}" fill="${f}" opacity="${prog ? op * HALF : op}"/>`,
      /* marker stroke (ST); coloured strokes are ink, half laid in progress */
      s: (d, sw = 6, c = BK) => lock ? ST(d, Math.max(sw * .8, 2.5), GREY) : prog && c !== BK ? ST(d, sw, c).replace('fill="none"', `fill="none" stroke-opacity="${HALF + .08}"`) : ST(d, sw, c),
      /* BK detail strokes that drop out of the grey line drawing */
      d: (d, sw = 4, c = BK) => lock ? '' : g.s(d, sw, c),
      sp: (cx, cy, r, f, sw = 4) => lock ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${GREY}" stroke-width="${sw * .8}" filter="url(#rough)"/>` : prog ? SP(cx, cy, r, f, sw).replace('stroke=', `fill-opacity="${HALF}" stroke=`) : SP(cx, cy, r, f, sw),
      dot: (cx, cy, r, f) => lock ? '' : prog ? DOT(cx, cy, r, f).replace('/>', ` opacity="${HALF}"/>`) : DOT(cx, cy, r, f),
      /* the rubber-stamp ink box (the hat's box, the deal), never with letters */
      box: (x, y, w, h, c, sw) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${lock ? GREY : c}" stroke-width="${lock ? sw * .8 : sw}"${prog ? ` stroke-opacity="${HALF + .08}"` : ''} filter="url(#roughS)"/>`,
    };
    return g;
  }

  /* ---------- the light: torn flat steps round a source, clipped to the inside of the seal ---------- */
  function ringPath(cx, cy, r, seed, step = 15, amp = 4.5) {
    const n = Math.max(18, Math.round(2 * Math.PI * r / 14)), pts = [];
    for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r * .96]); }
    return torn(pts, { seed, step, amp });
  }
  function light(state, sx, sy, R, k = 1) {
    if (state === 'locked') return '';
    const steps = state === 'earned'
      ? [[1.62, TOXIC, .22], [1.34, TOXIC, .5], [1.08, TOXIC, 1], [.84, LIME, 1], [.6, ACID, 1]]
      : [[1.62, DEEP, .7], [1.30, DEEP, 1], [1.02, DIM, 1], [.7, TOXIC, .5]];
    return steps.map(([f, c, op], i) => `<path d="${ringPath(sx, sy, R * f * k, 5 + i * 3)}" fill="${c}" opacity="${op}"/>`).join('');
  }
  /* light dust (the poster's specks), earned only */
  function specks(state, clip, sx, sy, R, seed) {
    if (state !== 'earned') return '';
    const r = rnd(seed); let s = '';
    for (let i = 0; i < 7; i++) { const a = Math.PI * (.55 + r() * .5), d = R * (.3 + r() * 1.1); s += `<circle cx="${(sx + Math.cos(a) * d).toFixed(1)}" cy="${(sy - Math.sin(a) * d * -1).toFixed(1)}" r="${(1 + r() * 1.3).toFixed(1)}" fill="#fffbea" opacity="${(.35 + r() * .4).toFixed(2)}"/>`; }
    return `<g clip-path="url(#${clip})">${s}</g>`;
  }

  /* ============================================================
     OUTLINES BY KIND · each returns {under, clip (inside path), over, cx, cy, R, src}
     ============================================================ */
  /* feat: a rubber-stamp impression. The ink is the screen's acid (earned), dim toxic (progress),
     a grey ring (not yet). Thick outer ring + thin inner ring, ragged ink edge, dry-ink flecks. */
  function feat(state, seed = 3) {
    const C = 96, ink = state === 'earned' ? ACID : TOXIC;
    const disc = blob(C, C, 91, 91, { seed: seed + 1, n: 64, amp: .01 });
    const oA = blob(C, C, 87.5, 87.5, { seed: seed + 2, n: 72, amp: .016 }), oB = blob(C, C, 76, 76, { seed: seed + 3, n: 64, amp: .016 });
    const iA = blob(C, C, 72, 72, { seed: seed + 4, n: 60, amp: .016 }), iB = blob(C, C, 68, 68, { seed: seed + 5, n: 56, amp: .016 });
    const inside = blob(C, C, 70, 70, { seed: seed + 6, n: 56, amp: .01 });
    if (state === 'locked') {
      const over = `<g filter="url(#rough)">${ST(blob(C, C, 82, 82, { seed: seed + 2, n: 72, amp: .012 }), 7, GREY)}${ST(blob(C, C, 70, 70, { seed: seed + 4, n: 60, amp: .015 }), 3.5, GREY)}</g>`;
      return { under: '', clip: inside, over, cx: C, cy: C, R: 68 };
    }
    const r = rnd(seed + 40); let fl = '';
    for (let i = 0; i < 16; i++) { const a = r() * Math.PI * 2, d = 75 + r() * 10, rr = .8 + r() * 1.7; fl += `<circle cx="${(C + Math.cos(a) * d).toFixed(1)}" cy="${(C + Math.sin(a) * d).toFixed(1)}" r="${rr.toFixed(1)}" fill="${VOID}"/>`; }
    const band = `<g filter="url(#rough)"><path d="${oA} ${oB}" fill="${ink}" fill-rule="evenodd"/><path d="${iA} ${iB}" fill="${ink}" fill-rule="evenodd"/></g>${fl}`;
    return { under: `<path d="${disc}" fill="${VOID}"/>`, clip: inside, over: band, cx: C, cy: C, R: 68 };
  }

  /* collection: a dog-eared file card, tilted, its face the dark of the room, its edge catching the light;
     the folded corner catches the screen. */
  function collection(state) {
    const C = [96, 98], rot = -6 * Math.PI / 180;
    const T = ([x, y]) => [C[0] + x * Math.cos(rot) - y * Math.sin(rot), C[1] + x * Math.sin(rot) + y * Math.cos(rot)];
    const P = (pts) => 'M' + pts.map((p) => T(p).map((v) => v.toFixed(1)).join(' ')).join(' L') + ' Z';
    const W = 82, H = 61, E = 38;                                 // half sizes, dog-ear size
    const card = [[-W, -H], [W - E, -H], [W, -H + E], [W, H], [-W, H]];
    const flap = [[W - E, -H], [W, -H + E], [W - E, -H + E]];
    const inner = [[-W + 9, -H + 9], [W - E - 4, -H + 9], [W - 9, -H + E + 4], [W - 9, H - 9], [-W + 9, H - 9]];
    const cardD = P(card), flapD = P(flap);
    if (state === 'locked') {
      const over = `${ST(cardD, 6, GREY)}${ST(flapD, 4.5, GREY)}`;
      return { under: '', clip: P(inner), over, cx: C[0] + 2, cy: C[1] + 4, R: 58 };
    }
    const edge = state === 'earned' ? ACID : TOXIC, fold = state === 'earned' ? ACID : DIM;
    const under = `<path d="${cardD}" fill="${VOID}" stroke="${VOID}" stroke-width="14" stroke-linejoin="round"/>`;
    const over = `${ST(cardD, 7, edge)}
      <path d="${flapD}" fill="${fold}" stroke="${VOID}" stroke-width="5" stroke-linejoin="round" filter="url(#rough)"/>
      ${ST(P([[W - E + 6, -H + E - 4], [W - 6, -H + E - 4]]), 3, state === 'earned' ? LIME : DEEP)}`;
    return { under, clip: P(inner), over, cx: C[0] + 2, cy: C[1] + 4, R: 58 };
  }

  /* event: a perforated postage stamp. Paper margin with the tear-off teeth, the picture in the dark of the room. */
  function perfPath(x0, y0, x1, y1, r, pitchW, pitchH) {
    const nx = Math.round((x1 - x0) / pitchW), ny = Math.round((y1 - y0) / pitchH);
    const px = (x1 - x0) / nx, py = (y1 - y0) / ny;
    let d = `M${x0} ${y0}`;
    for (let i = 0; i < nx; i++) { const c = x0 + (i + .5) * px; d += ` L${(c - r).toFixed(1)} ${y0} A${r} ${r} 0 0 0 ${(c + r).toFixed(1)} ${y0}`; }
    d += ` L${x1} ${y0}`;
    for (let i = 0; i < ny; i++) { const c = y0 + (i + .5) * py; d += ` L${x1} ${(c - r).toFixed(1)} A${r} ${r} 0 0 0 ${x1} ${(c + r).toFixed(1)}`; }
    d += ` L${x1} ${y1}`;
    for (let i = nx - 1; i >= 0; i--) { const c = x0 + (i + .5) * px; d += ` L${(c + r).toFixed(1)} ${y1} A${r} ${r} 0 0 0 ${(c - r).toFixed(1)} ${y1}`; }
    d += ` L${x0} ${y1}`;
    for (let i = ny - 1; i >= 0; i--) { const c = y0 + (i + .5) * py; d += ` L${x0} ${(c + r).toFixed(1)} A${r} ${r} 0 0 0 ${x0} ${(c - r).toFixed(1)}`; }
    return d + ' Z';
  }
  function event(state) {
    const x0 = 26, y0 = 12, x1 = 166, y1 = 180;
    const outer = perfPath(x0, y0, x1, y1, 6.6, 20, 21);
    const pic = `M${x0 + 16} ${y0 + 16} H${x1 - 16} V${y1 - 16} H${x0 + 16} Z`;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    if (state === 'locked') {
      return { under: '', clip: pic, over: `${ST(outer, 4.5, GREY)}${ST(pic, 3, GREY)}`, cx, cy, R: 62 };
    }
    const paper = state === 'earned' ? PAPER : '#8f8670';
    const rid = uid('srim');
    const under = `<defs>${rimFilter(rid, state === 'earned' ? ACID : DIM, LDIR[0], LDIR[1], 5)}</defs>
      <g filter="url(#${rid})"><path d="${outer}" fill="${paper}"/></g>${ST(outer, 4, BK)}
      <path d="${pic}" fill="${VOID}"/>`;
    return { under, clip: pic, over: ST(pic, 4, BK), cx, cy, R: 62 };
  }

  /* ============================================================
     GLYPHS · local coordinates, centre (0,0), about 100 units across.
     Shapes taken from the game's own art where it has them.
     ============================================================ */
  const arrowHead = (x, y, ang, L) => `M${(x - L * Math.cos(ang - .55)).toFixed(1)} ${(y - L * Math.sin(ang - .55)).toFixed(1)} L${x} ${y} L${(x - L * Math.cos(ang + .55)).toFixed(1)} ${(y - L * Math.sin(ang + .55)).toFixed(1)}`;
  const G = {
    /* case-closed · Regent's paper hat (suitCrown), knocked off and crumpled; the blood stamp box, no letters */
    hat: (g) => `<g transform="translate(2 4) rotate(-36)">
        ${g.o('M-42 16 L-22 -14 L-13 -11 L0 -44 L42 16 Z', '#f6f1e4', 7)}
        ${g.d('M-13 -11 L-5 12 M8 -26 L14 -2', 3.5, '#a39c90')}
        <g transform="rotate(-13 0 -6)">${g.box(-16, -14, 32, 16, BLOOD, 6)}</g>
        ${g.o('M-54 8 L-4 5 L54 9 L50 30 L2 26 L-50 30 Z', '#e9e1cf', 7)}
        ${g.d('M-46 19 L-3 16 L46 19', 3, '#b9b1a2')}
      </g>${g.d('M42 -28 q10 6 12 18 M50 -40 q14 8 16 24', 4.5)}`,

    /* return-to-sender · the game's envelope (envSVG) and a hooked marker arrow in hot pink */
    envReturn: (g) => {
      const ang = Math.atan2(-34 + 62, -30 + 8);
      return `<g transform="translate(0 12) rotate(-7)">${g.o('M-42 -14 H42 V36 H-42 Z', WHITE, 7)}${g.s('M-42 -14 L0 14 L42 -14', 6)}</g>
        ${g.s('M30 -8 C40 -50 -8 -64 -30 -34', 9, PINK)}${g.s(arrowHead(-30, -34, ang, 15), 9, PINK)}`;
    },

    /* clean-hands · the game's white hand (the tutorial hand), opened flat and empty; Kickback's deal
       (his blood patch colour) dropping away */
    hand: (g) => {
      const fing = (x, y, w, L, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})">${g.o(`M${-w / 2} 6 V${-L} A${w / 2} ${w / 2} 0 0 1 ${w / 2} ${-L} V6 Z`, WHITE, 6)}</g>`;
      return `<g transform="translate(-6 -4)">
        ${fing(-17, -10, 13, 34, -16)}${fing(-2, -14, 13, 40, -4)}${fing(12, -12, 13, 36, 8)}${fing(24, -5, 11, 26, 22)}${fing(-24, 12, 13, 24, -64)}
        ${g.o('M-28 -14 Q0 -22 31 -10 L33 16 C33 32 22 40 10 42 L-14 42 C-25 37 -30 27 -30 12 Z', WHITE, 6)}
        ${g.d('M-8 6 Q2 12 14 8', 3, '#c7c2bb')}
        ${g.o('M-20 38 L17 38 L20 58 L-23 58 Z', '#1f4bff', 6)}
        <g transform="translate(44 30) rotate(30)">${g.o('M-13 -9 H13 V9 H-13 Z', BLOOD, 5)}${g.d('M-7 -2 H7 M-7 3 H3', 2.5, WHITE)}</g>
        ${g.d('M38 8 l3 7 M47 6 l1 8', 3.5)}</g>`;
    },

    /* untouchable · the game's rubber stamp (floatStamp / bigStamp), cracked in two; blood pad */
    stampCracked: (g) => {
      const L = uid('ckl'), R = uid('ckr');
      const crack = 'M22 -44 L13 -30 L24 -21 L11 -11 L18 -1 L9 12';
      const stamp = `${g.sp(0, -76, 13, VOID, 6)}${g.o('M-9 -66 L9 -66 L9 -34 L-9 -34 Z', VOID, 6)}${g.o('M-54 -36 L54 -36 L54 -10 L-54 -10 Z', VOID, 6.5)}${g.o('M-58 -10 L58 -10 L58 6 L-58 6 Z', BLOOD, 6.5)}${g.s(crack, 5)}`;
      return `<defs><clipPath id="${L}"><path d="M-90 -120 L22 -120 ${crack.replace('M', 'L')} L9 30 L-90 30 Z"/></clipPath><clipPath id="${R}"><path d="M90 -120 L22 -120 ${crack.replace('M', 'L')} L9 30 L90 30 Z"/></clipPath></defs>
        <g transform="translate(-4 34) scale(.86)">
          <g clip-path="url(#${L})">${stamp}</g>
          <g transform="translate(12 12) rotate(16 30 -12)"><g clip-path="url(#${R})">${stamp}</g></g>
          ${g.o('M26 -50 L34 -54 L31 -45 Z', VOID, 3)}${g.o('M14 22 L22 20 L19 29 Z', VOID, 3)}
        </g>`;
    },

    /* no-wellness-checks · Halo (haloD): the pink and pale capsule, eyes shut, the halo dark */
    halo: (g) => {
      const k = .29, w = (p) => p / k;
      return `<g transform="scale(${k}) translate(-190 -186)">
        <g transform="rotate(-18 190 190)">${g.o('M190 110 L100 110 A80 80 0 0 0 100 270 L190 270 Z', PINK, w(6.5))}${g.o('M190 110 L280 110 A80 80 0 0 1 280 270 L190 270 Z', '#eef6cf', w(6.5))}${g.d('M72 170 Q76 136 102 124', w(4.5), WHITE)}</g>
        ${g.s('M118 162 Q146 214 178 168', w(7))}${g.s('M200 150 Q228 202 260 154', w(7))}
        ${g.d('M174 232 Q192 240 210 228', w(4.5))}
        <g transform="rotate(-10 190 40)">${g.lock ? g.s('M112 40 C112 6 268 6 268 40 C268 74 112 74 112 40', w(6.5)) : ST('M112 40 C112 6 268 6 268 40 C268 74 112 74 112 40', w(8.5), BK) + ST('M112 40 C112 6 268 6 268 40 C268 74 112 74 112 40', w(4), '#2d2a38')}</g>
      </g>`;
    },

    /* swatter · the rubber stamp swatted out of the air: tilted, tumbling away into the dark,
       speed marks behind it in the light; blood pad */
    stampFlying: (g) => `<g transform="translate(-12 10) rotate(34) scale(.8) translate(0 40)">
        ${g.sp(0, -76, 13, VOID, 6.5)}${g.o('M-9 -66 L9 -66 L9 -34 L-9 -34 Z', VOID, 6.5)}${g.o('M-54 -36 L54 -36 L54 -10 L-54 -10 Z', VOID, 7)}${g.o('M-58 -10 L58 -10 L58 6 L-58 6 Z', BLOOD, 7)}
      </g>
      ${g.s('M22 -26 L44 -48 M34 -10 L56 -32 M8 -38 L26 -56', 6)}`,

    /* dont-tap-the-glass · the inside of the seal is Kickback's tank: the water (D.water) and its wave line,
       his fin (sharkB) breaking the surface, his back under it, a tap crack in the glass, the tank's SALE sign
       as a blank blood tag */
    tank: (g) => `
      ${g.f('M-90 6 Q-75 -1 -60 6 T-30 6 T0 6 T30 6 T60 6 T90 6 V90 H-90 Z', D.water, 1)}
      ${g.f('M-58 30 C-30 18 30 16 66 28 C40 40 -20 42 -58 30 Z', D.sharkD, .6)}
      ${g.o('M-30 8 C-16 -8 -4 -30 6 -52 C10 -30 17 -9 28 8 Z', D.shark, 6.5)}${g.d('M-4 -16 C0 -28 3 -38 5 -46', 3, 'rgba(255,255,255,.55)')}
      ${g.s('M-90 6 Q-75 -1 -60 6 T-30 6 T0 6 T30 6 T60 6 T90 6', 4.5, '#2aa7b4')}
      ${g.o('M24 26 L46 21 L50 37 L28 42 Z', BLOOD, 4.5)}
      ${g.d('M-50 -36 V52', 4.5, 'rgba(255,255,255,.6)')}
      ${g.d('M-32 -26 l9 -3 l6 -9 M-32 -26 l3 10 l-4 7 M-32 -26 l-9 2', 2.6, WHITE)}`,

    /* early-bird · Deadline (bombB): void body, cap, LED band left blank, blood pupils; the fuse pinched out,
       one curl of smoke. Mirrored so the smoke rises into the dark. */
    bomb: (g) => {
      const k = .28, w = (p) => p / k;
      return `<g transform="scale(${-k} ${k}) translate(-170 -222)">
        ${g.o('M140 112 L200 112 L200 140 L140 140 Z', '#8a8898', w(5.5))}
        ${g.s('M170 112 C170 84 196 76 210 70 C224 64 236 70 238 86', w(6))}${g.dot(238, 88, w(3.2), BK)}
        ${g.s('M240 72 C258 50 230 36 244 14 C256 -4 246 -24 228 -18 C216 -14 220 -2 230 -4', w(4.5), '#5a5668')}
        ${g.o('M170 138 C236 138 290 190 290 256 C290 322 236 372 170 372 C104 372 50 322 50 256 C50 190 104 138 170 138 Z', VOID, w(6.5))}
        ${g.d('M88 196 Q104 168 136 156', w(5), 'rgba(255,255,255,.55)')}
        ${g.o('M96 324 L244 324 L240 350 L100 350 Z', '#8a8898', w(4.5))}${g.lock ? '' : `<rect x="140" y="324" width="60" height="26" rx="3" fill="#1a0000" stroke="${BK}" stroke-width="${w(2)}"/>`}
        ${g.sp(126, 236, 30, WHITE, w(4))}${g.dot(118, 242, 13, BLOOD)}${g.sp(212, 236, 30, WHITE, w(4))}${g.dot(204, 242, 13, BLOOD)}
        ${g.lock ? '' : `<path d="M92 204 L162 204 L162 226 L92 226 Z" fill="${VOID}"/>`}${g.s('M94 224 L160 228', w(4.5), g.lock ? BK : WHITE)}${g.s('M184 202 L240 212', w(5), g.lock ? BK : WHITE)}
      </g>`;
    },

    /* cross-examiner · Bcc (ghostB): the navy ghost with its blue carbon copy, one big eye, cracked;
       the furious iris in blood */
    bcc: (g) => {
      const k = .3, w = (p) => p / k;
      const body = 'M70 390 L70 170 C70 50 290 50 290 170 L290 390 L262 362 L236 398 L208 362 L180 398 L152 362 L124 398 L96 364 Z';
      return `<g transform="scale(${k}) translate(-180 -228)">
        ${g.lock ? '' : `<path d="${body}" fill="${D.copy}" opacity="${g.prog ? .6 * HALF : .6}" transform="translate(18 12)" filter="url(#rough)"/>`}
        ${g.o(body, D.ghost, w(6))}
        ${g.sp(180, 196, 78, WHITE, w(5))}${g.dot(186, 210, 33, BLOOD)}${g.dot(186, 210, 13, VOID)}${g.dot(164, 180, 10, WHITE)}
        ${g.s('M104 168 L134 186 L146 170 L174 198 L192 184 L222 214 L258 206', w(4.5))}
        ${g.sp(110, 300, 18, WHITE, w(3.5))}${g.dot(112, 302, 7.5, VOID)}${g.sp(256, 292, 20, WHITE, w(3.5))}${g.dot(258, 294, 8.5, VOID)}
      </g>`;
    },

    /* one-cut · the game's scissors (scissorsSVG), open, over relay-7's cable cut through; blood core at the cut */
    scissors: (g) => {
      const k = 1.5, w = (p) => p / k;
      return `${g.o('M-60 26 L-14 22 L-9 28 L-15 34 L-60 38 Z', '#5a5668', 6)}${g.o('M60 24 L14 22 L9 28 L15 34 L60 36 Z', '#5a5668', 6)}
        ${g.d('M-56 28 L-18 25 M56 27 L18 25', 2.5, '#8a8898')}${g.dot(-12, 28, 5, BLOOD)}${g.dot(12, 28, 5, BLOOD)}
        <g transform="translate(0 -10) rotate(180) scale(${k}) translate(-32 -24)">
          ${g.sp(18, 46, 10, WHITE, w(6))}${g.sp(46, 46, 10, WHITE, w(6))}
          ${g.o('M24 38 L44 6 L48 8 L32 40 Z', '#c7c2bb', w(5.5))}${g.o('M40 38 L20 6 L16 8 L32 40 Z', '#c7c2bb', w(5.5))}${g.dot(32, 30, w(3.5), BK)}
        </g>`;
    },

    /* read-the-backs · a slip turned over: its back with Halo's heart mark (markIcon), the corner curling */
    slipBack: (g) => `<g transform="rotate(-7)">
        ${g.lock ? '' : `<path d="M44 4 Q28 2 18 -6 Q20 14 22 32 Z" fill="${VOID}" opacity=".55" transform="translate(4 5)"/>`}
        ${g.o('M-48 -32 H48 V4 L22 32 H-48 Z', PAPER, 7)}
        ${g.d('M2 -18 H34 M2 -6 H24', 3.5, '#a39c90')}
        ${g.o('M48 4 Q30 4 16 -6 Q20 14 22 32 Z', '#e9e1cf', 6)}${g.d('M40 6 Q28 6 20 0', 2.5, '#b9b1a2')}
        <g transform="translate(-22 2) scale(.6) translate(-32 -32)">${g.o('M32 54 L10 32 C2 22 10 8 22 10 C28 11 31 16 32 19 C33 16 36 11 42 10 C54 8 62 22 54 32 Z', PINK, 9)}${g.d('M18 22 Q20 16 26 16', 5, WHITE)}</g>
      </g>`,

    /* archivist · the case board's trash (trashGlyph), lid lifted, a crumpled draft inside with one blood edit */
    trash: (g) => {
      const k = 1.4, w = (p) => p / k;
      return `<g transform="scale(${k}) translate(-30 -32)">
        ${g.o('M14 30 H48 L44 64 H18 Z', '#c7c2bb', w(6))}${g.d('M24 38 V56 M31 38 V56 M38 38 V56', w(3))}
        <g transform="rotate(48 50 28)">${g.o('M12 25 H52 V31 H12 Z', '#8a8898', w(5))}${g.s('M26 21 H38', w(5))}</g>
        ${g.o('M14 18 L20 4 L30 7 L36 -2 L46 4 L50 16 L44 28 L32 31 L20 28 Z', WHITE, w(5.5))}${g.d('M20 4 L28 18 M36 -2 L34 14 M46 4 L38 18 M14 18 L28 20', w(2.5), '#a39c90')}${g.s('M19 13 L44 9', w(4), BLOOD)}
      </g>`;
    },

    /* mail-day (event) · a hot pink envelope from wave two (pipeScene), the postmark's three wavy cancel lines */
    post: (g) => `<g transform="rotate(-6)">${g.o('M-40 -22 H40 V28 H-40 Z', PINK, 7)}${g.s('M-40 -22 L0 6 L40 -22', 6)}</g>
      ${g.s('M-74 -14 q9 -7 18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0', 5.5)}
      ${g.s('M-74 0 q9 -7 18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0', 5.5)}
      ${g.s('M-74 14 q9 -7 18 0 t18 0 t18 0 t18 0 t18 0 t18 0 t18 0', 5.5)}`,
  };

  /* ---------- the moments (bug/design.json moments_proposed + the event) ---------- */
  const LT = [.82, -.78, 1], LD = [.28, -.36, 1];             // light up-right (light glyphs) / right behind (dark glyphs)
  const M = {
    'case-closed': { kind: 'feat', glyph: 'hat', s: 1.08, dx: 0, dy: 2, L: LT },
    'return-to-sender': { kind: 'feat', glyph: 'envReturn', s: 1.06, dx: 0, dy: 0, L: LT },
    'clean-hands': { kind: 'feat', glyph: 'hand', s: 1.06, dx: 2, dy: 0, L: LT },
    'untouchable': { kind: 'feat', glyph: 'stampCracked', s: 1.08, dx: 0, dy: 0, L: LD },
    'no-wellness-checks': { kind: 'feat', glyph: 'halo', s: 1.08, dx: 0, dy: 2, L: [.4, -.7, 1] },
    'swatter': { kind: 'feat', glyph: 'stampFlying', s: 1.06, dx: 0, dy: 0, L: LD },
    'dont-tap-the-glass': { kind: 'feat', glyph: 'tank', s: 1.0, dx: 0, dy: 4, L: LT, clip: true },
    'early-bird': { kind: 'feat', glyph: 'bomb', s: 1.08, dx: 0, dy: 2, L: LD },
    'cross-examiner': { kind: 'feat', glyph: 'bcc', s: 1.08, dx: 0, dy: 4, L: LD },
    'one-cut': { kind: 'feat', glyph: 'scissors', s: 1.06, dx: 0, dy: 2, L: LT },
    'read-the-backs': { kind: 'collection', glyph: 'slipBack', s: .95, dx: 0, dy: 0, L: LT },
    'archivist': { kind: 'collection', glyph: 'trash', s: .92, dx: 0, dy: 0, L: LT },
    'mail-day': { kind: 'event', glyph: 'post', s: .92, dx: 0, dy: 0, L: LT },
  };
  const IDS = Object.keys(M);
  const KINDS = { feat, collection, event };

  /* one seal, 192x192, as inner svg markup */
  function inner(id, state) {
    const m = M[id], g = kit(state), O = KINDS[m.kind](state, 3 + IDS.indexOf(id));
    const clip = uid('sc'), rim = uid('sr');
    const sx = O.cx + m.L[0] * O.R, sy = O.cy + m.L[1] * O.R;
    const glyph = rs(G[m.glyph](g));
    let placed = `<g transform="translate(${O.cx + m.dx} ${O.cy + m.dy}) scale(${m.s})">${glyph}</g>`;
    if (m.clip) placed = `<g clip-path="url(#${clip})">${placed}</g>`;
    return `<defs><clipPath id="${clip}"><path d="${O.clip}"/></clipPath>${rimFilter(rim, ACID, LDIR[0], LDIR[1], 4.5)}</defs>
      ${O.under}
      <g clip-path="url(#${clip})">${light(state, sx, sy, O.R, m.L[2])}</g>${specks(state, clip, sx, sy, O.R, 7 + IDS.indexOf(id))}
      ${m.kind === 'event' ? '' : O.over}
      ${state === 'earned' ? `<g filter="url(#${rim})">${placed}</g>` : placed}
      ${m.kind === 'event' ? O.over : ''}`;
  }
  const one = (id, state) => `<svg viewBox="0 0 192 192" width="192" height="192">${inner(id, state)}</svg>`;
  /* a review sheet: rows of seals at 192 (ids x states) on a ground */
  function sheet(ids = IDS, states = ['earned', 'progress', 'locked'], bg = 'none', gap = 8) {
    const W = ids.length * (192 + gap) + gap, H = states.length * (192 + gap) + gap;
    let s = '';
    states.forEach((st, r) => ids.forEach((id, c) => { s += `<g transform="translate(${gap + c * (192 + gap)} ${gap + r * (192 + gap)})">${inner(id, st)}</g>`; }));
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${bg !== 'none' ? `<rect width="${W}" height="${H}" fill="${bg}"/>` : ''}${s}</svg>`;
  }
  return { one, sheet, IDS, M, G };
})();
