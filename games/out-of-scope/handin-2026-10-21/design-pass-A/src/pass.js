/* ============================================================
   PASS · "Night Shift" (step unit: a lie broken). Pictures only; nothing declared, no prices.
   Every item is drawn with OUT OF SCOPE's own art code and palette:
   - the line helpers OL / ST / SP / DOT and the page filters (#rough, #roughS, #brush)
   - officeScene()'s red lamp and night window (path data, colours, the city's rng(11))
   - envSVG() envelopes, picto() slip pictures, the .slip2 evidence slip, rawGlyph('notes') sticky note
   - TUT_HAND (the tutorial's drag hand) for the glove, suitB()'s pinstripe, cuffs and buttons
   - floatStamp() / bigStamp() parts for the rubber stamp (black knob, neck and block, thin blood rubber)
   The light is the poster's: the cracked screen's acid glow, drawn as flat torn steps and an acid rim
   on the lit (right) edge. No blur, glow, fog or vignette.
   ============================================================ */
window.PASS = (() => {
  const { place, torn, blob, rimFilter, rnd, ACID, TOXIC, VOID } = DP;
  const LIME = '#b6f03c', NAVY = '#141f45', CITY = '#0a0f22', WIN = '#ffd35a', MOON = '#fff6e6';
  const WOOD = '#5a3a2a', WOOD2 = '#8a5a3a', PAPER = '#fff6e6', OFFICE = '#0b0a14', GREY = '#8a8378', METAL = '#c7c2bb';
  const RW = 306, RH = 243, SQ = 243, SX = (RW - SQ) / 2;   // reward canvas, item centred in a 243 square
  const inner = (s) => DP.strip(s);
  const svgWrap = (W, H, body, defs = '') => `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs>${LINEF}${defs}</defs>${body}</svg>`;
  /* the game's #rough / #roughS sizes their filter region from the shape's box, so a single straight line (a box
     with no height or width) is clipped away. These copies keep the game's exact primitives with a region in user
     space, and SL() uses them for straight lines. */
  const LINEF = `<filter id="roughL" filterUnits="userSpaceOnUse" x="-700" y="-700" width="2000" height="2000"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="4.5" xChannelSelector="R" yChannelSelector="G"/></filter>`
    + `<filter id="roughLS" filterUnits="userSpaceOnUse" x="-700" y="-700" width="2000" height="2000"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="1.8" xChannelSelector="R" yChannelSelector="G"/></filter>`;
  const SL = (d, sw = 6, c = BK, fine = false) => ST(d, sw, c).replace('url(#rough)', `url(#${fine ? 'roughLS' : 'roughL'})`);
  const shadow = (cx, cy, rx, ry, op = .5, seed = 3) => `<path d="${blob(cx, cy, rx, ry, { seed, amp: .05, n: 28 })}" fill="${VOID}" opacity="${op}"/>`;

  /* ---------------- shared world pieces ---------------- */

  /* the evidence slip (.slip2): paper, black line, hard black shadow, the colour strip on the left,
     the slip's picto; its words become plain bars (no lettering on platform art). Box 0 0 150 92. */
  function slip(c, pic, { w = 150, h = 92 } = {}) {
    const r = 9, body = `M${r} 0 H${w - r} Q${w} 0 ${w} ${r} V${h - r} Q${w} ${h} ${w - r} ${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`;
    const strip = `M${r} 0 H16 V${h} H${r} Q0 ${h} 0 ${h - r} V${r} Q0 0 ${r} 0 Z`;
    return `<path d="${body}" fill="${BK}" transform="translate(5 5)"/>${OL(body, PAPER, 4)}<path d="${strip}" fill="${c}"/>${SL(`M16 2 V${h - 2}`, 3.5)}${ST(strip, 4)}
      ${place(picto(pic), 20, h * .12, h * .76)}
      ${SL(`M${24 + h * .76} ${h * .40} H${w - 12}`, 10)}${SL(`M${24 + h * .76} ${h * .66} H${w - 22}`, 5, GREY)}`;
  }
  /* a gem paper clip (wire with the game's black line under a metal stroke). Box ~0 0 22 62. */
  const CLIP = 'M7 20 V47 A4 4 0 0 0 15 47 V9 A6.5 6.5 0 0 0 2 9 V50 A9 9 0 0 0 20 50 V16';
  const clip = (k = 1) => `<g transform="scale(${k})"><path d="${CLIP}" fill="none" stroke="${BK}" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#roughS)"/><path d="${CLIP}" fill="none" stroke="${METAL}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 14 V44" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".8"/></g>`;

  /* a ripped edge from (x0,y0) to (x1,y1) as a list of points (for torn paper) */
  function rip(x0, y0, x1, y1, { seed = 6, step = 8, amp = 3 } = {}) {
    const r = rnd(seed), L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round(L / step)), nx = -(y1 - y0) / L, ny = (x1 - x0) / L, out = [];
    for (let k = 0; k <= n; k++) { const u = k / n, j = (k === 0 || k === n) ? 0 : (r() - .5) * 2 * amp; out.push(`${(x0 + (x1 - x0) * u + nx * j).toFixed(1)} ${(y0 + (y1 - y0) * u + ny * j).toFixed(1)}`); }
    return out;
  }

  /* the rubber stamp, from floatStamp()/bigStamp(): black knob, neck and block, thin blood rubber.
     Origin = centre of the rubber face. `squash` presses it down (held). */
  function stamp({ squash = 0, hi = true } = {}) {
    const sy = 1 - squash * .14, sx = 1 + squash * .06;
    return `<g transform="scale(${sx} ${sy})">
      ${SP(0, -78, 15, D.void, 4)}${OL('M-10 -66 L10 -66 L10 -36 L-10 -36 Z', D.void, 4.5)}
      ${OL('M-56 -38 L56 -38 L56 -10 L-56 -10 Z', D.void, 5)}
      ${OL(`M-60 -10 L60 -10 L60 ${4 - squash * 3} L-60 ${4 - squash * 3} Z`, D.blood, 5)}
      ${hi ? `${SL('M-46 -30 H10', 4, 'rgba(255,255,255,.5)')}${ST('M-8 -86 Q-2 -91 6 -88', 4, 'rgba(255,255,255,.55)')}` : ''}
    </g>`;
  }

  /* Gordon's red office lamp (officeScene: stalk M380 626 L400 520 L440 500, shade M420 470 L480 490 L462 530 L404 510),
     standing on a small dark foot so it can live on any desk. Drawn in the scene's own coordinates. */
  function lamp() {
    // the shade keeps the scene's red quad and its tilt, opened a little into a cone so it reads as a lamp at 120 px
    return `${OL('M350 628 C352 612 410 612 412 628 L414 640 L348 640 Z', D.suit2, 5)}
      ${ST('M381 626 L400 520 L434 494', 9)}${SP(400, 520, 7, D.void, 3)}
      <path d="M398 520 Q426 552 470 540 Q452 520 398 520 Z" fill="${MOON}" stroke="${BK}" stroke-width="4" stroke-linejoin="round" filter="url(#rough)"/>
      ${OL('M424 470 L452 480 L476 540 L396 520 Z', D.blood, 5)}${SP(438, 478, 7, D.void, 3)}${ST('M430 486 L414 512', 4, 'rgba(255,255,255,.5)')}`;
  }

  /* the night window from officeScene: navy #141f45, the city's blocks #0a0f22 with lit windows #ffd35a (rng(11)),
     the moon, black mullions. x0,y0,w,h = the glass; k = scale of the city. */
  function nightGlass(x0, y0, w, h, { seed = 11, n = 14, k = 1, wk = k, moon = [0.82, 0.2, 0.075], lit = .62, op = [.5, .5] } = {}) {
    let city = ''; const R = rng(seed); const bw = w / n, base = y0 + h;
    for (let i = 0; i < n; i++) {
      const x = x0 + i * bw - bw * .1, hh = (90 + R() * 250) * k * (h / 460), ww = (40 + R() * 16) / 50 * bw;
      city += `<rect x="${x.toFixed(1)}" y="${(base - hh).toFixed(1)}" width="${ww.toFixed(1)}" height="${hh.toFixed(1)}" fill="${CITY}"/>`;
      for (let wy = base - hh + 14 * wk; wy < base - 10 * wk; wy += 26 * wk) for (let wx = x + 8 * wk; wx < x + ww - 6 * wk; wx += 14 * wk) if (R() > lit) city += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="${(6 * wk).toFixed(1)}" height="${(9 * wk).toFixed(1)}" fill="${WIN}" opacity="${(op[0] + R() * op[1]).toFixed(2)}"/>`;
    }
    const m = moon ? `<circle cx="${x0 + w * moon[0]}" cy="${y0 + h * moon[1]}" r="${w * moon[2]}" fill="${MOON}" opacity=".92"/>` : '';
    return `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${NAVY}"/>${m}${city}`;
  }

  /* TUT_HAND (tutor.js), the game's own drag hand, viewBox 0 0 64 70 */
  const HAND = 'M24 30 V10 a5 5 0 0 1 10 0 V27 a5 5 0 0 1 9 1 a5 5 0 0 1 9 2 a5 5 0 0 1 9 3 V46 c0 12 -9 20 -21 20 h-5 c-8 0 -13 -4 -17 -10 L5 42 a5.5 5.5 0 0 1 9 -6 L24 44 Z';

  /* ---------------- the rewards (306x243, transparent, item centred in the 243 square) ---------------- */
  const REW = {
    /* free · torn sticky notes for the case board: the game's note (rawGlyph('notes'): #ffe94a, black line,
       ruled lines) as a pad, with one note torn off and lying beside it, corner curled. */
    'sticky-pad'() {
      // the note's yellow #ffe94a sits close to the platform's sun, so the notes are kept small and ruled edge to
      // edge, like the game's own notes glyph: no flat yellow block survives at the delivered size
      const rules = (x0, x1, y0, y1, gap) => { let d = ''; for (let y = y0; y <= y1; y += gap) d += `M${x0} ${y} H${x1} `; return SL(d, 3.6, GREY); };
      const pad = `<g transform="translate(96 98) rotate(-7)">
          ${[3, 2, 1].map((i) => OL(`M${-48 + i * 3} ${-48 + i * 4} H${48 + i * 3} V${48 + i * 4} H${-48 + i * 3} Z`, i === 3 ? '#e9e1cf' : '#ffe94a', 4)).join('')}
          ${OL('M-48 -48 H48 V48 H-48 Z', '#ffe94a', 5)}
          ${rules(-44, 44, -36, 40, 11)}${SL('M-26 -46 V46', 3)}
        </g>`;
      // one note torn off the pad: its top edge ripped, its corner curling up
      const d = `M${rip(-42, -38, 42, -38, { seed: 6, step: 7, amp: 3 }).join(' L')} L42 22 L26 40 L-42 40 Z`;
      const note = `<g transform="translate(172 156) rotate(13)">
          <path d="${d}" fill="#ffe94a" transform="translate(3 3)" filter="url(#brush)"/>
          <path d="${d}" fill="none" stroke="${BK}" stroke-width="5" stroke-linejoin="round" filter="url(#rough)"/>
          ${rules(-38, 38, -27, 34, 11)}${SL('M-22 -36 V38', 3)}
          ${OL('M42 22 L26 40 L22 18 Z', '#e9e1cf', 4)}
        </g>`;
      return { body: pad + note, shadow: shadow(128, 204, 92, 12, .45) };
    },

    /* free · thrown proof trails a chain of paper clips: the pink HR slip in flight, clips hooked one to the next */
    'paperclip-trail'() {
      const pts = [[134, 124, -40, 1.24], [101, 149, -60, 1.08], [66, 163, -78, .94], [33, 169, -92, .8]];
      const chain = pts.map(([x, y, r, k]) => `<g transform="translate(${x} ${y}) rotate(${r}) translate(${-11 * k} ${-31 * k})">${clip(k)}</g>`).reverse().join('');
      const s = `<g transform="translate(118 52) rotate(-16)">${slip('#ff8a1f', 'cleared', { w: 114, h: 64 })}</g>`;
      return { body: `<g transform="translate(121.5 121.5) scale(.95) translate(-125.5 -121.5)">${chain + s}</g>`, shadow: shadow(122, 214, 72, 9, .4) };
    },

    /* pass · Gordon's red office lamp (officeScene), on a small dark foot */
    'desk-lamp'() {
      return { body: `<g transform="translate(-292 -414)"><g transform="translate(380 640) scale(1.22) translate(-380 -640)">${lamp()}</g></g>`, shadow: shadow(92, 228, 54, 8, .5) };
    },

    /* pass · thrown proof trails little envelopes (envSVG, in pipeScene's white / pink / acid) */
    'envelope-trail'() {
      const env = [[134, 130, -24, 48, '#fff'], [94, 155, -10, 41, '#ff2e88'], [57, 168, 4, 34, '#fff'], [26, 174, 14, 27, '#ff2e88']];
      const trail = env.map(([x, y, r, w, c]) => `<g transform="translate(${x} ${y}) rotate(${r})">${place(envSVG(c), -w / 2, -w * 44 / 128, w)}</g>`).reverse().join('');
      const s = `<g transform="translate(118 52) rotate(-16)">${slip('#ff2e88', 'fired', { w: 114, h: 64 })}</g>`;
      return { body: `<g transform="translate(121.5 121.5) scale(.95) translate(-125.5 -121.5)">${trail + s}</g>`, shadow: shadow(122, 214, 72, 9, .4) };
    },

    /* pass · your drag hand (TUT_HAND) in Regent's pinstripe: suitB's suit #1f1d27, stripe #5a5668, white cuff, gold button */
    'pinstripe-glove'() {
      const id = 'pgc';
      const stripes = Array.from({ length: 13 }, (_, i) => `M${2 + i * 5} 0 L${4 + i * 5} 70`).join(' ');
      const hand = `<g transform="translate(26 6) scale(2.85)">
          <clipPath id="${id}"><path d="${HAND}"/></clipPath>
          <path d="${HAND}" fill="${D.suit}" transform="translate(1.2 1.2)"/>
          <g clip-path="url(#${id})"><path d="${stripes}" stroke="${D.stripe}" stroke-width="1.1" fill="none"/></g>
          <path d="${HAND}" fill="none" stroke="${BK}" stroke-width="2.6" stroke-linejoin="round" filter="url(#roughS)"/>
          <path d="M34 27 V40 M43 30 V41 M52 33 V42" stroke="${BK}" stroke-width="2.4" stroke-linecap="round" fill="none"/>
          <path d="M12 60 L46 71 L57 61 L20 53 Z" fill="#fff" stroke="${BK}" stroke-width="2.2" stroke-linejoin="round" filter="url(#roughS)"/>
          <circle cx="36" cy="63" r="1.9" fill="${P.gold}" stroke="${BK}" stroke-width="1"/>
          <path d="M27 10 Q29 7 32 8" stroke="#fff" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".6"/>
        </g>`;
      return { body: hand, shadow: shadow(118, 230, 60, 8, .45) };
    },

    /* bug.pass · the night city behind your desk: officeScene's window (navy, city, lit windows, moon, black mullions) on a sill */
    'night-window'() {
      const x0 = 30, y0 = 22, w = 186, h = 170;
      const glass = nightGlass(x0, y0, w, h, { seed: 11, n: 7, k: .55, moon: [.76, .22, .09] });
      const id = 'nwc';
      return {
        body: `<clipPath id="${id}"><rect x="${x0}" y="${y0}" width="${w}" height="${h}"/></clipPath>
          <rect x="${x0 - 8}" y="${y0 - 8}" width="${w + 16}" height="${h + 16}" fill="${VOID}" transform="translate(4 4)"/>
          <g clip-path="url(#${id})">${glass}</g>
          ${ST(`M${x0} ${y0} H${x0 + w} V${y0 + h} H${x0} Z`, 12, VOID)}${ST(`M${x0 + w / 2} ${y0} V${y0 + h} M${x0} ${y0 + h * .48} H${x0 + w}`, 8, VOID)}
          <path d="M${x0 - 16} ${y0 + h + 4} H${x0 + w + 16} V${y0 + h + 22} H${x0 - 16} Z" fill="${WOOD}" transform="translate(3 3)"/>${ST(`M${x0 - 16} ${y0 + h + 4} H${x0 + w + 16} V${y0 + h + 22} H${x0 - 16} Z`, 5)}${SL(`M${x0 - 8} ${y0 + h + 11} H${x0 + w + 8}`, 3, WOOD2)}`,
        shadow: shadow(122, 222, 112, 9, .5),
      };
    },
  };

  function reward(id) {
    const r = REW[id]();
    const defs = rimFilter('rrim', ACID, 1, -.35, 4.5, 1);
    return svgWrap(RW, RH, `<g transform="translate(${SX} 0)">${r.shadow}<g filter="url(#rrim)">${r.body}</g></g>`, defs);
  }

  /* ---------------- the three row grounds (306x243, opaque) ---------------- */
  /* free · Gordon's office desk: the wood, a few grain strokes, a ruled sheet's corner under everything */
  function groundFree() {
    // the grain is the game's own dry-brush hatch (#brush, as on officeScene's desk) turned to run along the wood,
    // calmed with a wash of the same brown so it sits under the reward
    const hatch = `<g transform="rotate(90 153 121.5)"><rect x="-80" y="-120" width="466" height="483" fill="${WOOD}" filter="url(#brush)"/></g><rect width="${RW}" height="${RH}" fill="${WOOD}" opacity=".7"/>`;
    const grain = ST('M-20 58 C60 50 120 66 200 56 C240 51 280 60 330 54', 2.4, WOOD2) + ST('M-20 196 C70 204 150 186 230 198 C270 204 300 196 330 200', 2.4, WOOD2)
      + ST('M236 104 C250 94 270 98 274 110 C266 120 246 118 236 104 Z', 2.4, WOOD2) + ST('M196 96 C220 84 280 82 330 92 M200 120 C230 132 280 132 330 122', 2, WOOD2);
    // a ruled sheet's corner under the lower left: plain paper with grey rules, no words
    const sheet = `<g transform="translate(-70 186) rotate(-24)">${OL('M0 0 H130 V160 H0 Z', PAPER, 4)}${SL('M0 26 H130 M0 46 H130 M0 66 H130 M0 86 H130 M0 106 H130 M0 126 H130', 2, '#c7c2bb')}</g>`;
    return svgWrap(RW, RH, `<rect width="${RW}" height="${RH}" fill="${WOOD}"/>${hatch}${grain}${sheet}`);
  }
  /* pass · the dark office in the screen's acid light: torn steps from the cracked screen just off the right edge */
  function groundPass() {
    // the lit pocket sits right of centre, its acid core running off the right edge toward the screen; the full
    // toxic step stays inside the cell, so the corners (where the platform draws its marks) are the dim steps
    const gx = 252, gy = 114, R0 = 300;
    const circ = (f, seed) => { const n = 36, pts = []; for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; pts.push([gx + Math.cos(t) * R0 * f, gy + Math.sin(t) * R0 * f * .84]); } return torn(pts, { seed, step: 20, amp: 6 }); };
    const steps = [[1.0, TOXIC, .12], [.72, TOXIC, .26], [.52, TOXIC, .55], [.38, TOXIC, 1], [.28, LIME, 1], [.19, ACID, 1]];
    const rings = steps.map(([f, c, op], i) => `<path d="${circ(f, 3 + i * 2)}" fill="${c}" opacity="${op}"/>`).join('');
    const r = rnd(9); let specks = '';
    for (let i = 0; i < 18; i++) specks += `<circle cx="${(r() * 300).toFixed(1)}" cy="${(r() * 236).toFixed(1)}" r="${(1 + r() * 1.6).toFixed(1)}" fill="#fffbea" opacity="${(.2 + r() * .4).toFixed(2)}"/>`;
    return svgWrap(RW, RH, `<rect width="${RW}" height="${RH}" fill="${OFFICE}"/>${rings}${specks}`);
  }
  /* bug.pass · the navy night window with the city: the sky, the city's dark blocks, a few lit windows, stars */
  function groundBug() {
    const r = rnd(4); let stars = '';
    for (let i = 0; i < 26; i++) { const x = 14 + r() * 278, y = 12 + r() * 120; stars += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(.9 + r() * 1.3).toFixed(1)}" fill="${MOON}" opacity="${(.35 + r() * .5).toFixed(2)}"/>`; }
    // the city's windows stay few, small and dim here, so the ground never reads as the platform's sun
    return svgWrap(RW, RH, `${nightGlass(-10, 0, 326, RH, { seed: 7, n: 8, k: 1.15, wk: .55, moon: null, lit: .9, op: [.35, .35] })}${stars}`);
  }
  const ground = (k) => ({ free: groundFree, pass: groundPass, bug: groundBug })[k]();

  /* ---------------- the marker (48x48, transparent) ---------------- */
  /* drawn for 48 px in the stamp's own units (one unit ~ 0.33 px): floatStamp()'s parts at marker weight,
     the rubber a flat thin strip of blood (the brush hatch turns pink at this size), white highlights from the game */
  function markerStamp({ squash = 0 } = {}) {
    const ry = 4 - squash * 5;
    return `${SP(0, -80, 17, D.void, 6)}${ST('M-8 -91 Q0 -97 9 -92', 6, 'rgba(255,255,255,.7)')}
      <path d="M-11 -66 L11 -66 L11 ${-38 + squash * 4} L-11 ${-38 + squash * 4} Z" fill="${D.void}" stroke="${BK}" stroke-width="6" filter="url(#roughS)"/>
      <path d="M-58 ${-40 + squash * 6} L58 ${-40 + squash * 6} L58 -10 L-58 -10 Z" fill="${D.void}" stroke="${BK}" stroke-width="7" stroke-linejoin="round" filter="url(#roughS)"/>
      ${SL(`M-48 ${-31 + squash * 5} H30`, 7, 'rgba(255,255,255,.62)')}
      <path d="M${-62 - squash * 4} -10 L${62 + squash * 4} -10 L${62 + squash * 4} ${ry} L${-62 - squash * 4} ${ry} Z" fill="${D.blood}" stroke="${BK}" stroke-width="6" stroke-linejoin="round" filter="url(#roughS)"/>`;
  }
  function marker(pose = 'next') {
    let body, vb;
    if (pose === 'next') {
      // raised and tilted, hovering over the next cell: floatStamp()'s float marks, a hard little shadow below
      vb = '-80 -130 160 160';
      body = `${shadow(0, 18, 44, 6, .6, 5)}
        <g filter="url(#mrim)"><g transform="translate(-3 -12) rotate(-17 0 -40)">${markerStamp()}</g></g>
        ${ST('M-62 -86 q-10 16 0 32', 7, '#fffbea')}${ST('M63 -72 q10 16 0 32', 7, '#fffbea')}`;
    } else {
      // pressed flat on the last earned cell: the body squashed down, ink squeezed out at both ends of the rubber
      vb = '-76 -128 152 152';
      const squirt = (s) => `<path d="M${s * 56} -10 Q${s * 70} -10 ${s * 68} 2 Q${s * 65} 10 ${s * 56} 6 Z" fill="${D.blood}" stroke="${BK}" stroke-width="4" stroke-linejoin="round" filter="url(#roughS)"/>`;
      body = `${squirt(-1)}${squirt(1)}${DOT(-58, 15, 5, D.blood)}${DOT(-42, 13, 3.4, D.blood)}${DOT(56, 15, 4.5, D.blood)}
        ${ST('M-60 -46 l-7 -10 M-50 -52 l-3 -12', 6, '#fffbea')}${ST('M60 -46 l7 -10 M50 -52 l3 -12', 6, '#fffbea')}
        <g filter="url(#mrim)"><g transform="translate(0 -3)">${markerStamp({ squash: 1 })}</g></g>`;
    }
    const [x, y, w, h] = vb.split(' ').map(Number);
    return `<svg viewBox="${vb}" width="48" height="48" xmlns="http://www.w3.org/2000/svg"><defs>${LINEF}${rimFilter('mrim', ACID, 1, -.55, 9, 1)}</defs>${body}</svg>`;
  }

  /* ---------------- the pass tile (400x400) ----------------
     Gordon's office on the night shift: the night through his window (officeScene's navy, city and moon), the
     rubber stamp raised over his desk in the cracked screen's acid light, and the pass's name in the title
     screen's own lettering (.tl-name: Tabloid 700, acid, a 3 px cobalt offset, rotated -2deg, two lines, line
     height .86, tracking .04em; its glow is left out: no glow on platform art). */
  function tile() {
    const W = 400, H = 400, deskY = 300;
    const glass = nightGlass(-6, -6, 412, deskY + 6, { seed: 11, n: 10, k: .62, wk: .62, moon: [.85, .2, .055], lit: .66 });
    const mull = SL(`M326 -10 V${deskY}`, 11, VOID) + SL(`M326 132 H410`, 9, VOID);
    // the desk (officeScene's #5a3a2a with the game's brush turned along the wood), its edge line
    const desk = `<rect x="-10" y="${deskY}" width="${W + 20}" height="${H - deskY + 10}" fill="${WOOD}"/>
      <g clip-path="url(#tdesk)"><g transform="rotate(90 200 350)"><rect x="100" y="100" width="200" height="500" fill="${WOOD}" filter="url(#brush)"/></g><rect x="0" y="${deskY}" width="${W}" height="${H - deskY}" fill="${WOOD}" opacity=".66"/></g>
      ${SL(`M-10 ${deskY} H${W + 10}`, 7)}${SL(`M-10 ${deskY + 12} H${W + 10}`, 4, WOOD2)}`;
    // the screen's light: flat torn steps across the desk from the right edge (acid, lime, toxic, toxic into the dark)
    const gx = 390, gy = 340, R0 = 300;
    const circ = (f, seed) => { const n = 36, pts = []; for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2; pts.push([gx + Math.cos(t) * R0 * f, gy + Math.sin(t) * R0 * f * .42]); } return torn(pts, { seed, step: 22, amp: 6 }); };
    const steps = [[1.0, TOXIC, .14], [.8, TOXIC, .3], [.62, TOXIC, .6], [.48, TOXIC, 1], [.35, LIME, 1], [.22, ACID, 1]];
    const light = `<g clip-path="url(#tdesk)">${steps.map(([f, c, op], i) => `<path d="${circ(f, 31 + i * 2)}" fill="${c}" opacity="${op}"/>`).join('')}</g>`;
    // the stamp, raised and ready, its hard shadow on the lit desk
    const sx = 268, sy = 282, sk = 1.36;
    const st = `${shadow(sx + 6, 340, 84, 12, .55, 9)}<g filter="url(#trim)"><g transform="translate(${sx} ${sy}) rotate(-12) scale(${sk})">${stamp()}</g></g>
      <g transform="translate(${sx} ${sy}) scale(${sk})">${ST('M-78 -66 q-11 18 0 36', 5, '#fffbea')}${ST('M80 -80 q11 18 0 36', 5, '#fffbea')}</g>`;
    // the name, in the title screen's lettering
    const fs = 80, lh = fs * .86;
    const word = (t, y, fill, dx = 0) => `<text x="${30 + dx}" y="${y + dx}" font-family="Tabloid,'Arial Narrow',sans-serif" font-weight="700" font-size="${fs}" letter-spacing="${(fs * .04).toFixed(1)}" fill="${fill}">${t}</text>`;
    const name = `<g transform="rotate(-2 140 120)">${word('NIGHT', 112, '#1f4bff', 3)}${word('SHIFT', 112 + lh, '#1f4bff', 3)}${word('NIGHT', 112, ACID)}${word('SHIFT', 112 + lh, ACID)}</g>`;
    const defs = `<clipPath id="tdesk"><rect x="0" y="${deskY + 3}" width="${W}" height="${H - deskY}"/></clipPath>${rimFilter('trim', ACID, 1, -.2, 6, 1)}`;
    return svgWrap(W, H, `<rect width="${W}" height="${H}" fill="${OFFICE}"/>${glass}${mull}${desk}${light}${name}${st}`, defs);
  }

  return { reward, ground, marker, tile, stamp, slip, clip, lamp, nightGlass, HAND, REWARDS: Object.keys(REW), RW, RH };
})();
