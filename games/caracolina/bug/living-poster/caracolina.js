BUG_MODS.caracolina = {
  key: 'caracolina',
  no: '···',
  title: 'Caracolina',
  maker: '···',
  kind: 'Seaside photo walk',
  verb: 'Look.',
  ground: '#a47e7e',
  ink: '#2a55b8',
  rants: ['…', '!?', 'hmph'],
  hits: ['!'],
  items: {
    /* a scallop shell, kicked up out of the bay: paper white, brick ribs, ink line (~22 px) */
    shell(ctx, x, y, t, a) {
      const n = 7, R = 11, hy = 5, A0 = Math.PI * 1.08, A1 = Math.PI * 1.92;
      const P = (an, r) => [Math.cos(an) * r, hy + Math.sin(an) * r];
      const fan = () => {
        ctx.beginPath(); ctx.moveTo(-2.6, hy + 0.6);
        const p0 = P(A0, R); ctx.lineTo(p0[0], p0[1]);
        for (let i = 0; i < n; i++) {
          const b0 = A0 + (A1 - A0) * i / n, b1 = A0 + (A1 - A0) * (i + 1) / n, c = P((b0 + b1) / 2, R * 1.14), e = P(b1, R);
          ctx.quadraticCurveTo(c[0], c[1], e[0], e[1]);
        }
        ctx.lineTo(2.6, hy + 0.6); ctx.closePath();
      };
      ctx.save(); ctx.translate(x, y - 1); ctx.rotate(a || 0);
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      fan(); ctx.fillStyle = '#f3ead7'; ctx.fill();
      ctx.strokeStyle = '#9c4426'; ctx.lineWidth = 1.2; ctx.beginPath();
      for (let i = 1; i < n; i++) { const an = A0 + (A1 - A0) * i / n, s0 = P(an, 2.4), e = P(an, R * 1.02); ctx.moveTo(s0[0], s0[1]); ctx.lineTo(e[0], e[1]); }
      ctx.stroke();
      ctx.fillStyle = '#9c4426'; ctx.beginPath(); ctx.moveTo(-5.2, hy + 0.4); ctx.lineTo(5.2, hy + 0.4); ctx.lineTo(3.2, hy + 4); ctx.lineTo(-3.2, hy + 4); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#1d1a33'; ctx.lineWidth = 1.4; fan(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-5.2, hy + 0.4); ctx.lineTo(-3.2, hy + 4); ctx.lineTo(3.2, hy + 4); ctx.lineTo(5.2, hy + 0.4); ctx.stroke();
      ctx.restore();
    }
  },
  create(api) {
    /* Caracolina, 19:48: the lighthouse on legs straddling the low sun, alone in the bay.
       Drawn in Canvas 2D in the game's own look (gouache bands with hard edges, coloured-pencil contour,
       pencil hatching in shade, paper grain) from the poster's measured geometry and colours.
       World units: 1 = the poster's height; x = 0 at the lighthouse, y = 0 at the horizon (down is +). */
    const R = api.rnd, TAU = Math.PI * 2, PI = Math.PI;
    const cl = (v, a, b) => (v < a ? a : v > b ? b : v);
    const lerp = (a, b, k) => a + (b - a) * k;
    const ss = (a, b, v) => { const k = cl((v - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
    const env = (u, D, a, b) => ss(0, a, u) * (1 - ss(D - b, D, u));
    const bump = (u, c, hw) => ss(c - hw, c, u) * (1 - ss(c, c + hw, u));
    const backOut = (x) => { x = cl(x, 0, 1); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
    const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    const mixc = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
    const css = (c) => 'rgb(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ')';
    const tab = (T, y) => { if (y <= T[0][0]) return T[0][1]; for (let i = 1; i < T.length; i++) if (y <= T[i][0]) { const a = T[i - 1], b = T[i]; return a[1] + (b[1] - a[1]) * (y - a[0]) / (b[0] - a[0]); } return T[T.length - 1][1]; };

    /* ---------- the sky: bands round the sun (fitted to the poster), a halo laid on in rings ---------- */
    const SKY_Y = [-1.1, -0.8, -0.58, -0.45, -0.32, -0.2, -0.1, -0.01, 0];
    const SKY_A = ['#6f5290', '#a0659e', '#ba5c8e', '#f07d8a', '#ffa385', '#ffc17a', '#ffe178', '#ffdb76', '#ffdb76'].map(hex);
    const SKY_B = ['#3f3866', '#4f4470', '#4f4062', '#6a5562', '#b67264', '#e97161', '#e2725f', '#d66c61', '#d66c61'].map(hex);
    const SKY_CY = -0.197, SKY_N = 16, SKY_D = [], SKY_W = [];
    for (let i = 1; i < SKY_N; i++) { const d = 1.5 * Math.pow(i / SKY_N, 1 / 1.643); if (d < 1.43) SKY_D.push(d); }
    for (let j = 0; j <= SKY_D.length; j++) SKY_W.push(Math.min(0.88, (j + 0.5) / SKY_N));
    const HALO_R = [0.62, 0.5, 0.4, 0.31, 0.23, 0.16, 0.105], HALO_A = [0.076, 0.096, 0.14, 0.175, 0.188, 0.173, 0.07];
    const SUN_Y = -0.247, SUN_R = 0.08;
    // band edges painted by hand: a slow wander plus brush-width ripples, so the rings read as strokes, not a target
    const wob = (cx, cy, r, n, amp, sq) => {
      const p = [], f1 = R() * TAU, f2 = R() * TAU, f3 = R() * TAU;
      for (let i = 0; i < n; i++) { const a = i / n * TAU, rr = r * (1 + amp * (0.5 * Math.sin(2 * a + f1) + 0.3 * Math.sin(5 * a + f2) + 0.2 * Math.sin(11 * a + f3)) + amp * 0.35 * (R() - 0.5)); p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * sq]); }
      return p;
    };
    const BANDS = SKY_D.map((d) => wob(0, SKY_CY, d, 96, 0.024, 0.94));
    const HALOS = HALO_R.map((r) => wob(0, SUN_Y, r, 64, 0.03, 0.96));
    const STROKES = [];
    for (let i = 0; i < 46; i++) STROKES.push([-2.2 + R() * 3.6, -0.015 - Math.pow(R(), 1.3) * 0.95, 0.08 + R() * 0.32, 0.003 + R() * 0.008, R() < 0.55]);

    /* ---------- the sea: bands from the horizon down, the sun's path, wave dabs ---------- */
    const SEA = [[0, '#b27b80'], [0.004, '#8f6d7e'], [0.012, '#705d7b'], [0.025, '#5e5377'], [0.045, '#504b73'], [0.07, '#434472'], [0.1, '#393f71'], [0.13, '#303a6f'], [0.17, '#2a366e'], [0.21, '#24336c'], [0.26, '#1f306a'], [0.32, '#1a2d69'], [0.38, '#162a67'], [0.45, '#132865'], [0.6, '#10255f'], [0.9, '#0d2158'], [1.0, '#0c2056']];
    const MAUVE = [[0, 0.1], [0.01, 0.22], [0.03, 0.32], [0.06, 0.36], [0.1, 0.38], [0.2, 0.4], [0.3, 0.39], [0.38, 0.37], [0.46, 0.36], [0.6, 0.38], [0.8, 0.4], [1.2, 0.44]];
    const PINK = [[0, 0.04], [0.01, 0.12], [0.03, 0.19], [0.06, 0.22], [0.1, 0.24], [0.2, 0.27], [0.3, 0.265], [0.38, 0.26], [0.46, 0.25], [0.6, 0.25], [0.8, 0.24], [1.2, 0.22]];
    const PEACH = [[0, 0], [0.02, 0], [0.04, 0.06], [0.07, 0.14], [0.1, 0.17], [0.2, 0.21], [0.3, 0.2], [0.38, 0.17], [0.46, 0.12], [0.55, 0.06], [0.65, 0]];
    const CREAM = [[0, 0], [0.05, 0], [0.07, 0.06], [0.1, 0.1], [0.2, 0.15], [0.3, 0.135], [0.36, 0.1], [0.4, 0.04], [0.42, 0]];
    const CORE = [[0, 0], [0.08, 0], [0.1, 0.03], [0.15, 0.06], [0.25, 0.075], [0.32, 0.06], [0.36, 0.03], [0.38, 0]];
    const pathXC = (y) => 0.015 - 0.1 * Math.max(0, y - 0.3);
    // each level of the path is a stack of horizontal gouache dabs, one per wave row, so its edge is scalloped like the poster's facets
    const dabRows = (T, jag) => {
      const out = []; let y = 0.003;
      while (y < 1.3) {
        const dy = 0.004 + 0.024 * y, ym = y + dy * 0.5, hw = tab(T, ym);
        if (hw > 0.002) { const a = hw * (1 + jag * (R() * 2 - 1)), b = hw * (1 + jag * (R() * 2 - 1)); out.push([pathXC(ym) + (a - b) / 2, ym, (a + b) / 2, dy * 0.78]); }
        y += dy;
      }
      return out;
    };
    const PATHS = [[MAUVE, '#82638b', 0.16], [PINK, '#ef9ca7', 0.18], [PEACH, '#fbc8b9', 0.2], [CREAM, '#fff1d6', 0.2], [CORE, '#fffbe9', 0.24]].map((p) => [dabRows(p[0], p[2]), p[1]]);
    const DABS = { dark: [], light: [], facet: [], streak: [], glint: [] };
    for (let i = 0; i < 150; i++) {
      const y = 0.01 + Math.pow(R(), 1.6) * 1.05, x = -2.2 + R() * 3.8, len = (0.03 + 0.09 * R()) * (0.2 + 1.3 * y), th = len * (0.07 + 0.05 * R());
      const inPath = Math.abs(x - pathXC(y)) < tab(PINK, y) * 0.95;
      (inPath ? DABS.facet : (R() < 0.6 ? DABS.dark : DABS.light)).push([x, y, len, th]);
    }
    for (let i = 0; i < 46; i++) { const y = 0.03 + R() * 0.6, hw = tab(PINK, y), len = (0.02 + 0.05 * R()) * (0.3 + 1.4 * y); DABS.facet.push([pathXC(y) + (R() * 2 - 1) * hw * 0.92, y, len, len * 0.1]); }
    for (let i = 0; i < 70; i++) { const y = 0.05 + R() * 0.42, xc = pathXC(y), hw = tab(PEACH, y) + 0.02, len = (0.025 + 0.07 * R()) * (0.3 + 1.4 * y); DABS.streak.push([xc + (R() * 2 - 1) * hw, y, len, len * 0.055]); }
    for (let i = 0; i < 50; i++) { const y = 0.02 + R() * 0.5, xc = pathXC(y), a = tab(PINK, y), b = tab(MAUVE, y), len = (0.015 + 0.04 * R()) * (0.3 + 1.4 * y); DABS.glint.push([xc + (R() < 0.5 ? -1 : 1) * lerp(a * 0.9, b, R()), y, len, len * 0.07]); }
    const SHIM = [];
    for (let i = 0; i < 46; i++) {
      const y = 0.02 + Math.pow(R(), 1.2) * 0.52, xc = pathXC(y), hw = tab(PINK, y), x = xc + (R() * 2 - 1) * hw * 0.95;
      const inCream = Math.abs(x - xc) < tab(CREAM, y) * 1.1 + 0.01;
      SHIM.push({ x, y, len: (0.014 + 0.04 * R()) * (0.35 + 1.5 * y), th: (0.002 + 0.0028 * R()) * (0.5 + 1.6 * y), col: inCream ? '#fffdf2' : (R() < 0.5 ? '#ffe2d0' : '#ffc4c0'), ph: R() * TAU, w: 0.8 + R() * 0.9, dr: 0.003 + R() * 0.01, w2: 0.25 + R() * 0.4 });
    }
    SHIM.sort((a, b) => (a.col < b.col ? -1 : 1));

    /* ---------- the land: headland (left), island, the cove's rocks and pier (right), clouds ---------- */
    const HEAD = [[-1.385, -0.168], [-1.312, -0.178], [-1.262, -0.18], [-1.212, -0.187], [-1.162, -0.192], [-1.137, -0.191], [-1.112, -0.188], [-1.087, -0.18], [-1.062, -0.173], [-1.037, -0.178], [-1.012, -0.195], [-0.987, -0.211], [-0.962, -0.221], [-0.937, -0.224], [-0.912, -0.21], [-0.887, -0.196], [-0.862, -0.168], [-0.837, -0.127], [-0.812, -0.081], [-0.787, -0.023], [-0.775, 0.006], [-0.86, 0.009], [-1.0, 0.011], [-1.18, 0.013], [-1.25, -0.055], [-1.312, -0.112], [-1.36, -0.15]];
    const HEAD_LIT = [[-0.937, -0.224], [-0.912, -0.21], [-0.887, -0.196], [-0.862, -0.168], [-0.837, -0.127], [-0.812, -0.081], [-0.787, -0.023], [-0.775, 0.006], [-0.83, 0.008], [-0.862, -0.05], [-0.892, -0.12], [-0.915, -0.18]];
    const HEAD_SH = [[-1.062, -0.173], [-1.037, -0.178], [-1.012, -0.195], [-0.987, -0.211], [-0.962, -0.221], [-0.937, -0.224], [-0.926, -0.19], [-0.935, -0.152], [-0.968, -0.132], [-1.01, -0.145], [-1.045, -0.16]];
    const ISLE = [[-0.362, 0.005], [-0.333, 0.001], [-0.312, -0.003], [-0.291, -0.0075], [-0.27, -0.012], [-0.256, -0.024], [-0.249, -0.0325], [-0.228, -0.049], [-0.207, -0.054], [-0.187, -0.0575], [-0.145, -0.06], [-0.103, -0.061], [-0.07, -0.058], [-0.041, -0.053], [-0.02, -0.0515], [0.001, -0.046], [0.022, -0.048], [0.043, -0.0475], [0.07, -0.042], [0.105, -0.035], [0.126, -0.027], [0.147, -0.022], [0.168, -0.016], [0.188, -0.012], [0.209, -0.005], [0.234, 0.002], [0.234, 0.005]];
    const ISLE_LIT = [[0.02, -0.048], [0.043, -0.0475], [0.07, -0.042], [0.105, -0.035], [0.126, -0.027], [0.147, -0.022], [0.168, -0.016], [0.188, -0.012], [0.209, -0.005], [0.234, 0.002], [0.234, 0.005], [0.07, 0.005], [0.035, -0.022]];
    const ROCK_A = [[0.29, 0.06], [0.294, -0.018], [0.305, -0.045], [0.322, -0.058], [0.338, -0.064], [0.356, -0.06], [0.372, -0.05], [0.386, -0.028], [0.394, 0.02], [0.392, 0.06]];
    const ROCK_B = [[0.44, 0.065], [0.446, 0.0], [0.455, -0.02], [0.472, -0.029], [0.488, -0.043], [0.505, -0.0525], [0.522, -0.055], [0.54, -0.05], [0.553, -0.034], [0.562, -0.008], [0.566, 0.065]];
    const ROCK_C = [[0.628, 0.125], [0.63, 0.03], [0.64, -0.032], [0.655, -0.062], [0.672, -0.09], [0.69, -0.108], [0.712, -0.12], [0.742, -0.126], [0.782, -0.113], [0.822, -0.09], [0.862, -0.062], [0.902, -0.032], [0.952, -0.004], [1.0, 0.03], [1.06, 0.13]];
    const ROCK_BASE = [[0.3, 0.044], [0.38, 0.05], [0.46, 0.06], [0.56, 0.062], [0.64, 0.066], [0.66, 0.08], [0.64, 0.11], [0.5, 0.078], [0.38, 0.074], [0.31, 0.062]];
    const CLOUD = [[0.035, -0.069], [0.12, -0.074], [0.25, -0.085], [0.38, -0.1], [0.5, -0.114], [0.62, -0.124], [0.72, -0.13], [0.84, -0.124], [0.98, -0.112], [1.12, -0.1], [1.12, -0.068], [0.95, -0.07], [0.8, -0.075], [0.65, -0.078], [0.5, -0.074], [0.35, -0.068], [0.2, -0.066], [0.08, -0.066]];
    const CLOUD_LO = [[0.3, -0.071], [0.5, -0.083], [0.7, -0.09], [0.9, -0.087], [1.12, -0.08], [1.12, -0.068], [0.9, -0.071], [0.7, -0.077], [0.5, -0.074], [0.3, -0.068]];
    const WISP = [[0.2, -0.131], [0.4, -0.138], [0.6, -0.141], [0.64, -0.137], [0.4, -0.133], [0.22, -0.128]];
    const PUFF = [[0.605, -0.282], [0.635, -0.293], [0.67, -0.298], [0.712, -0.293], [0.735, -0.284], [0.7, -0.279], [0.65, -0.278]];
    const LWISP = [[-0.75, -0.028], [-0.67, -0.033], [-0.58, -0.031], [-0.6, -0.027], [-0.7, -0.025]];
    const RSTR = [];
    for (let i = 0; i < 26; i++) { const isC = i < 14, x = isC ? 0.64 + R() * 0.32 : 0.3 + R() * 0.26, y = isC ? -0.1 + R() * 0.2 : -0.055 + R() * 0.1, l = 0.02 + R() * 0.05; RSTR.push([x, y, x + l, y + (R() - 0.5) * 0.02, x + l * 0.5, y - 0.008 - R() * 0.01]); }
    const HHATCH = [];
    for (let i = 0; i < 18; i++) { const x = -1.06 + i * 0.0075, y = -0.135 - R() * 0.01; HHATCH.push([x, y, x + 0.018, y - 0.07 - R() * 0.03]); }

    /* ---------- the lighthouse on legs (DIST 3: centre 24/159, legs from the sea to the body) ---------- */
    const LH = { body: '#40205a', bodyLit: '#54306f', band: '#40040e', bandLit: '#5a0b17', under: '#7a3056', gal: '#120a1e', galRim: '#3b2346', lant: '#8f515a', lantLit: '#a5646d', lens: '#6e3a48', mull: '#6c3442', roof: '#5a0a14', roofLit: '#7a1620', eave: '#2e050d', pencil: '#1c0c28', hatch: '#24103a', leg: '#08040f', legCore: '#211a33' };
    const PIV = -0.2855;
    // hip x, hip y, foot x, foot y, knee bow (rest, measured on the poster), side
    const LEG = [[-0.0242, -0.2825, -0.0792, 0.0675, 0.0317, -1], [-0.0175, -0.2825, -0.0558, 0.0675, 0.0217, -1], [0.0183, -0.2825, 0.0642, 0.0675, 0.0252, 1], [0.0233, -0.2825, 0.0767, 0.0675, 0.0275, 1]];
    const HATCH = [];
    for (let y = -0.398; y < -0.27; y += 0.0056) {
      const len = 0.014 + 0.012 * R(); let x0 = -0.0328, y0 = y + 0.003 * R(), x1 = x0 + len * 0.62, y1 = y0 - len * 0.78;
      if (y0 > -0.2885) { const k = (y0 + 0.2885) / (y0 - y1); x0 += (x1 - x0) * k; y0 = -0.2885; }
      if (y1 < -0.4035) { const k = (-0.4035 - y1) / (y0 - y1); x1 -= (x1 - x0) * k; y1 = -0.4035; }
      if (y0 > y1) HATCH.push([x0, y0, x1, y1]);
    }
    const KEYS = ['bx', 'by', 'tilt', 'sy', 'head', 'eye', 'capL', 'capT', 'spl', 'kk', 'b0', 'b1', 'b2', 'b3', 'l0', 'l1', 'l2', 'l3', 'f0', 'f1', 'f2', 'f3'];
    const P = { lamp: 0, sun: 0 }, V = {}, REST = { lamp: 0, sun: 0 };
    for (const k of KEYS) { P[k] = 0; V[k] = 0; REST[k] = 0; }
    const LOOP = 6.4;

    const S = {
      t: 0, mode: 'idle', phase: 'hold', phEnd: 1.6 + R() * 1.2, beat: null, beatT0: 0, beatD: 0, last: '', side: 1, leg: 3, sunBeat: false,
      gag: null, hit: null, look: null, parts: [], rings: [], prevLift: [0, 0, 0, 0], foot: [[0, 0], [0, 0], [0, 0], [0, 0]],
      hud: 0, hudV: 0, L: null, anchor: { x: 0.6558, y: 0.33 }, print: null, printT: -9
    };

    /* ---------- layout: recompose round the lighthouse for any plate ---------- */
    function layout(w, h, Z) {
      const a = w / h;
      let Hv = a >= 2 ? 2 / a : 1 + 0.35 * cl((2 - a) / 1.5, 0, 1);
      Hv /= 1 + 0.45 * cl((200 - Math.min(w, h)) / 120, 0, 1);
      Hv = Math.max(Hv, 0.6, 0.36 / a);
      let V = a * Hv, k = h / Hv;
      const p = V >= 2 ? 0.6558 : 0.5 + 0.1558 * ss(0.45, 2.0, V);
      let x0 = -p * V, y0;
      if (Hv >= 1) y0 = -0.5325 - (Hv - 1) * 0.62;
      else y0 = Math.min(Math.max(-0.0325 - Hv / 2, 0.09 - Hv), -0.49);
      if (Z !== 1) { const ay = -0.195; x0 /= Z; y0 = ay - (ay - y0) / Z; k *= Z; V /= Z; Hv /= Z; y0 = lerp(y0, Math.min(y0, -0.457 - 0.1 * Hv), cl((Z - 1) / 0.16, 0, 1)); }
      return { w, h, k, x0, y0, V, Hv };
    }

    /* ---------- the still world (cached while the plate keeps its size) ---------- */
    const G = new WeakMap();
    function grads(c) {
      let g = G.get(c);
      if (g) return g;
      g = { sky: [], sea: null };
      for (let j = 0; j < SKY_W.length; j++) {
        const lg = c.createLinearGradient(0, -1.1, 0, 0);
        for (let i = 0; i < SKY_Y.length; i++) lg.addColorStop(1 + SKY_Y[i] / 1.1, css(mixc(SKY_A[i], SKY_B[i], SKY_W[j])));
        g.sky.push(lg);
      }
      const sg = c.createLinearGradient(0, 0, 0, 1);
      for (let i = 0; i < SEA.length - 1; i++) { const col = css(mixc(hex(SEA[i][1]), hex(SEA[i + 1][1]), 0.5)); sg.addColorStop(SEA[i][0], col); sg.addColorStop(SEA[i + 1][0], col); }
      g.sea = sg;
      G.set(c, g);
      return g;
    }
    const ppath = (c, pts) => { c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); };
    const spath = (c, pts) => {
      const n = pts.length; c.moveTo((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2);
      for (let i = 1; i <= n; i++) { const p = pts[i % n], q = pts[(i + 1) % n]; c.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); }
      c.closePath();
    };
    const fillP = (c, pts, col, smooth) => { c.fillStyle = col; c.beginPath(); (smooth ? spath : ppath)(c, pts); c.fill(); };
    function dabs(c, list, col, xa, xb) {
      c.fillStyle = col; c.beginPath();
      for (const d of list) { if (d[0] + d[2] < xa || d[0] - d[2] > xb) continue; c.moveTo(d[0] + d[2], d[1]); c.ellipse(d[0], d[1], d[2], Math.max(d[3], 1e-5), 0, 0, TAU); }
      c.fill();
    }
    function drawWorld(c, L) {
      const k = L.k, px = 1 / k, xa = L.x0, xb = L.x0 + L.V, ya = L.y0, yb = L.y0 + L.Hv, g = grads(c);
      c.save(); c.translate(-L.x0 * k, -L.y0 * k); c.scale(k, k);
      // sky bands, outer to inner, then the halo in rings
      if (ya < 0.02) {
        c.fillStyle = g.sky[9]; c.fillRect(xa - 0.01, ya - 0.01, L.V + 0.02, 0.04 - ya);
        for (let j = 8; j >= 0; j--) { c.fillStyle = g.sky[j]; c.beginPath(); ppath(c, BANDS[j]); c.fill(); }
        c.fillStyle = '#fffdb4';
        for (let j = 0; j < HALOS.length; j++) { c.globalAlpha = HALO_A[j]; c.beginPath(); ppath(c, HALOS[j]); c.fill(); }
        c.globalAlpha = 1;
        // the brush in the sky
        for (const s of STROKES) {
          if (s[0] + s[2] < xa || s[0] - s[2] > xb) continue;
          c.fillStyle = s[4] ? 'rgba(255,240,215,0.075)' : 'rgba(110,55,95,0.055)';
          c.beginPath(); c.ellipse(s[0], s[1], s[2], s[3], -0.03, 0, TAU); c.fill();
        }
        fillP(c, CLOUD, '#f0917a', true); fillP(c, CLOUD_LO, '#e3806d', true); fillP(c, WISP, '#f6a585', true); fillP(c, PUFF, '#df8d86', true); fillP(c, LWISP, '#f7a46f', true);
      }
      // sea bands, the sun's path, waves
      if (yb > 0) {
        c.fillStyle = g.sea; c.fillRect(xa - 0.01, 0, L.V + 0.02, yb + 0.01);
        for (const p of PATHS) dabs(c, p[0], p[1], xa, xb);
        c.globalAlpha = 0.5; dabs(c, DABS.dark, '#132458', xa, xb);
        c.globalAlpha = 0.32; dabs(c, DABS.light, '#4a5490', xa, xb);
        c.globalAlpha = 0.5; dabs(c, DABS.facet, '#c98399', xa, xb);
        c.globalAlpha = 0.55; dabs(c, DABS.streak, '#eaa2ad', xa, xb);
        c.globalAlpha = 0.45; dabs(c, DABS.glint, '#ffe4d6', xa, xb);
        c.globalAlpha = 1;
      }
      // the headland, lit from the bay; hatching in its shade; the old tower on its flank
      if (xa < -0.77) {
        fillP(c, HEAD, '#bc795e', true); fillP(c, HEAD_LIT, '#cf8a6c', true); fillP(c, HEAD_SH, '#94626c', true);
        if (k > 260) { c.save(); c.beginPath(); spath(c, HEAD_SH); c.clip(); c.strokeStyle = 'rgba(70,36,60,0.5)'; c.lineWidth = Math.max(0.0012, 0.7 * px); c.beginPath(); for (const hh of HHATCH) { c.moveTo(hh[0], hh[1]); c.lineTo(hh[2], hh[3]); } c.stroke(); c.restore(); }
        c.fillStyle = '#7a466e'; c.fillRect(-1.222, -0.148, 0.024, 0.095); c.beginPath(); c.moveTo(-1.224, -0.148); c.lineTo(-1.21, -0.158); c.lineTo(-1.196, -0.148); c.closePath(); c.fill();
        c.fillStyle = '#702529'; c.fillRect(-1.219, -0.108, 0.008, 0.006); c.fillRect(-1.207, -0.093, 0.006, 0.005);
        c.strokeStyle = 'rgba(90,48,70,0.55)'; c.lineWidth = Math.max(0.0012, 0.8 * px); c.beginPath(); spath(c, HEAD); c.stroke();
      }
      // the island
      if (xa < 0.24 && xb > -0.37) {
        fillP(c, ISLE, '#754673', true); fillP(c, ISLE_LIT, '#b06763', true);
        c.strokeStyle = '#8f5d82'; c.lineWidth = Math.max(0.002, 1.1 * px); c.beginPath(); c.moveTo(-0.27, -0.012); for (let i = 5; i < 16; i++) c.lineTo(ISLE[i][0], ISLE[i][1] + 0.0012); c.stroke();
        c.strokeStyle = 'rgba(58,30,60,0.6)'; c.lineWidth = Math.max(0.0012, 0.8 * px); c.beginPath(); spath(c, ISLE); c.stroke();
      }
      // the cove: rocks, the dome, a house with an egg on its roof, a tree, the pier
      if (xb > 0.15) {
        const rock = (pts) => { fillP(c, pts, '#3e1a3a', true); c.save(); c.translate(0.004, 0.005); fillP(c, pts, '#170a20', true); c.restore(); };
        rock(ROCK_A); rock(ROCK_B); rock(ROCK_C); fillP(c, ROCK_BASE, '#150818', true);
        c.fillStyle = '#4a2245'; c.beginPath(); c.ellipse(0.392, 0.052, 0.062, 0.082, 0, PI, TAU); c.closePath(); c.fill();
        c.fillStyle = '#63305a'; c.beginPath(); c.ellipse(0.392, 0.052, 0.062, 0.082, 0, PI, PI * 1.28); c.lineTo(0.392, 0.052); c.closePath(); c.fill();
        c.fillStyle = '#2a0c1e'; c.beginPath(); c.ellipse(0.416, 0.036, 0.011, 0.014, 0, PI, TAU); c.lineTo(0.427, 0.052); c.lineTo(0.405, 0.052); c.closePath(); c.fill();
        c.fillStyle = '#595a21'; c.beginPath(); c.arc(0.574, -0.014, 0.016, 0, TAU); c.fill(); c.fillStyle = '#6e6d28'; c.beginPath(); c.arc(0.569, -0.019, 0.008, 0, TAU); c.fill();
        c.fillStyle = '#71386e'; c.fillRect(0.585, -0.045, 0.057, 0.058); c.fillStyle = '#57295a'; c.fillRect(0.626, -0.045, 0.016, 0.058);
        c.fillStyle = '#3a1c3c'; c.fillRect(0.583, -0.047, 0.061, 0.004); c.fillStyle = '#2a1030'; c.fillRect(0.596, -0.031, 0.009, 0.013);
        c.fillStyle = '#0b010b'; c.beginPath(); c.ellipse(0.606, -0.0585, 0.0105, 0.0135, 0, 0, TAU); c.fill();
        c.strokeStyle = '#3d2c48'; c.lineWidth = Math.max(0.0014, 0.8 * px); c.beginPath(); c.ellipse(0.606, -0.0585, 0.0085, 0.0115, 0, PI * 0.95, PI * 1.45); c.stroke();
        c.strokeStyle = 'rgba(70,32,64,0.7)'; c.lineWidth = Math.max(0.0012, 0.7 * px);
        c.save(); c.beginPath(); spath(c, ROCK_C); spath(c, ROCK_A); spath(c, ROCK_B); c.clip(); c.beginPath(); for (const r of RSTR) { c.moveTo(r[0], r[1]); c.quadraticCurveTo(r[4], r[5], r[2], r[3]); } c.stroke(); c.restore();
        c.fillStyle = '#3a1a38'; c.fillRect(0.161, 0.0415, 0.155, 0.0055);
        c.fillStyle = '#241020'; for (let x = 0.164; x < 0.32; x += 0.035) c.fillRect(x, 0.047, Math.max(0.0035, 1.2 * px), 0.019);
        c.fillStyle = '#3a2038'; c.fillRect(0.1805, 0.017, 0.005, 0.0245); c.fillStyle = '#bd797c'; c.beginPath(); c.arc(0.183, 0.0135, 0.0036, 0, TAU); c.fill();
      }
      c.restore();
      grain(c, 0, 0, L.w, L.h);
    }
    const C = { cv: null, cx: null, key: '', last: '', stable: 0, ok: true };
    function stillLayer(ctx, L, dpr) {
      const key = L.w + '|' + L.h + '|' + dpr.toFixed(3) + '|' + L.k.toFixed(4) + '|' + L.x0.toFixed(6) + '|' + L.y0.toFixed(6);
      if (key === C.last) C.stable++; else { C.stable = 0; C.last = key; }
      if (C.ok && C.stable >= 2) {
        if (C.key !== key) {
          try {
            const W = Math.max(1, Math.ceil(L.w * dpr)), H = Math.max(1, Math.ceil(L.h * dpr));
            if (!C.cv) { C.cv = new OffscreenCanvas(W, H); C.cx = C.cv.getContext('2d'); } else if (C.cv.width !== W || C.cv.height !== H) { C.cv.width = W; C.cv.height = H; }
            C.cx.setTransform(dpr, 0, 0, dpr, 0, 0); drawWorld(C.cx, L); C.key = key;
          } catch (e) { C.ok = false; }
        }
        if (C.ok && C.key === key) { if (TX.cv && TX.k) { TX.cv.width = TX.cv.height = 1; TX.k = 0; } ctx.drawImage(C.cv, 0, 0, C.cv.width / dpr, C.cv.height / dpr); return; }
      }
      if (C.ok && moving(ctx, L, dpr)) return;
      drawWorld(ctx, L);
    }
    /* while the plate grows or squeezes, the still world is painted once with a margin and re-framed each frame
       (a uniform scale within 14 %, never a stretch); it is repainted when the frame leaves it, and exactly once the plate rests */
    const TX = { cv: null, cx: null, k: 0, dpr: 0, x0: 0, y0: 0, x1: 0, y1: 0 };
    function moving(ctx, L, dpr) {
      const r = TX.k ? L.k / TX.k : 0;
      if (!(TX.k && TX.dpr === dpr && r > 0.87 && r < 1.14 && L.x0 >= TX.x0 && L.y0 >= TX.y0 && L.x0 + L.V <= TX.x1 && L.y0 + L.Hv <= TX.y1)) {
        try {
          const px = L.V * 0.28, py = L.Hv * 0.28, TL = { k: L.k, x0: L.x0 - px, y0: L.y0 - py, V: L.V + 2 * px, Hv: L.Hv + 2 * py };
          TL.w = TL.V * L.k; TL.h = TL.Hv * L.k;
          const W = Math.max(1, Math.ceil(TL.w * dpr)), H = Math.max(1, Math.ceil(TL.h * dpr));
          if (!TX.cv) { TX.cv = new OffscreenCanvas(W, H); TX.cx = TX.cv.getContext('2d'); } else { TX.cv.width = W; TX.cv.height = H; }
          TX.cx.setTransform(dpr, 0, 0, dpr, 0, 0); drawWorld(TX.cx, TL);
          Object.assign(TX, { k: L.k, dpr, x0: TL.x0, y0: TL.y0, x1: TL.x0 + TL.V, y1: TL.y0 + TL.Hv });
        } catch (e) { C.ok = false; return false; }
      }
      const sc = TX.k * dpr;
      ctx.drawImage(TX.cv, (L.x0 - TX.x0) * sc, (L.y0 - TX.y0) * sc, L.V * sc, L.Hv * sc, 0, 0, L.w, L.h);
      return true;
    }

    /* ---------- the moving world ---------- */
    function bodyPt(Q, x, y) { const c = Math.cos(Q.tilt), s = Math.sin(Q.tilt), dy = (y - PIV) * (1 + Q.sy); return [Q.bx + x * c - dy * s, PIV + Q.by + x * s + dy * c]; }
    function legGeom(Q, L) {
      const out = [];
      for (let i = 0; i < 4; i++) {
        const g = LEG[i], sd = g[5], outer = i === 0 || i === 3;
        const hp = bodyPt(Q, g[0], g[1]);
        const fx = g[2] + Q['f' + i] + sd * (outer ? 0.032 : 0.018) * Q.spl, fy = g[3] - Q['l' + i];
        const rest = Math.hypot(g[2] - g[0], g[3] - g[1]), len = Math.hypot(fx - hp[0], fy - hp[1]);
        const mx = (hp[0] + fx) / 2, my = (hp[1] + fy) / 2;
        const bow = cl(g[4] + (rest - len) * 1.1 + Q['b' + i], 0.004, 0.075);
        const da = Math.atan2(fy - hp[1], fx - hp[0]) - Math.atan2(g[3] - g[1], g[2] - g[0]);
        const lift = Q['l' + i], kk = i === 3 ? cl(Q.kk, 0, 1) : 0, sharp = cl(lift / 0.035, 0, 1) * 0.8 * (1 - kk);
        let kx = mx + sd * Math.cos(da) * bow + sd * lift * 0.5 * (1 - kk), ky = my + sd * Math.sin(da) * bow - lift * (1.1 - 0.8 * kk);
        if (Q.spl > 0.001 && L) {
          const wall = sd < 0 ? L.x0 + 0.012 + 3 / L.k : L.x0 + L.V - 0.012 - 3 / L.k;
          let tx = sd < 0 ? Math.max(wall, kx - 0.14) : Math.min(wall, kx + 0.14);
          if ((tx - kx) * sd < 0) tx = kx;
          const f = outer ? 1 : 0.72;
          kx = lerp(kx, tx, Q.spl * f) + (S.mode === 'squeezed' ? sd * 0.0012 * Math.sin(S.t * 31 + i * 1.7) * Q.spl : 0);
          ky -= 0.02 * Q.spl * f;
        }
        const cx = 2 * kx - mx, cy = 2 * ky - my;
        // two arcs that meet at the knee: one smooth curve at rest, a bent knee when the leg is lifted
        out.push({ hx: hp[0], hy: hp[1], fx, fy, kx, ky, lift,
          ax: lerp((hp[0] + cx) / 2, (hp[0] + kx) / 2, sharp), ay: lerp((hp[1] + cy) / 2, (hp[1] + ky) / 2, sharp),
          bx: lerp((cx + fx) / 2, (kx + fx) / 2, sharp), by: lerp((cy + fy) / 2, (ky + fy) / 2, sharp) });
      }
      return out;
    }
    function drawLegs(c, G, px) {
      const lw = Math.max(0.0068, 1.5 * px);
      c.lineCap = 'round';
      c.strokeStyle = LH.leg; c.lineWidth = lw; c.beginPath();
      for (const g of G) { c.moveTo(g.hx, g.hy); c.quadraticCurveTo(g.ax, g.ay, g.kx, g.ky); c.quadraticCurveTo(g.bx, g.by, g.fx, g.fy); }
      c.stroke();
      if (lw * 0.42 > 1.1 * px) { const o = lw * 0.12; c.strokeStyle = LH.legCore; c.lineWidth = lw * 0.42; c.beginPath(); for (const g of G) { c.moveTo(g.hx + o, g.hy + 0.004); c.quadraticCurveTo(g.ax + o, g.ay, g.kx + o, g.ky); c.quadraticCurveTo(g.bx + o, g.by, g.fx + o, g.fy - 0.002); } c.stroke(); }
      const kr = Math.max(0.0058, 1.45 * px);
      c.fillStyle = LH.leg; c.beginPath(); for (const g of G) { c.moveTo(g.kx + kr, g.ky); c.arc(g.kx, g.ky, kr, 0, TAU); } c.fill();
      if (kr > 2.5 * px) { c.fillStyle = '#3a2c4c'; c.beginPath(); for (const g of G) { c.moveTo(g.kx - kr * 0.25 + kr * 0.3, g.ky - kr * 0.3); c.arc(g.kx - kr * 0.25, g.ky - kr * 0.3, kr * 0.3, 0, TAU); } c.fill(); }
    }
    const bodyPath = (c) => { c.moveTo(-0.0345, -0.2865); c.lineTo(-0.0336, -0.296); c.lineTo(-0.032, -0.4055); c.lineTo(0.032, -0.4055); c.lineTo(0.0336, -0.296); c.lineTo(0.0345, -0.2865); c.closePath(); };
    const bandPath = (c) => { c.moveTo(-0.0333, -0.381); c.quadraticCurveTo(0, -0.3854, 0.0333, -0.381); c.lineTo(0.0337, -0.356); c.quadraticCurveTo(0, -0.3604, -0.0337, -0.356); c.closePath(); };
    function drawTower(c, Q, px, detail) {
      c.save();
      c.translate(Q.bx, Q.by + PIV); c.rotate(Q.tilt); c.scale(1 - 0.35 * Q.sy, 1 + Q.sy); c.translate(0, -PIV);
      const lw = Math.max(0.0016, 0.9 * px);
      c.fillStyle = LH.under; c.beginPath(); c.ellipse(0, -0.2865, 0.0345, 0.0052, 0, 0, TAU); c.fill();
      c.fillStyle = LH.body; c.beginPath(); bodyPath(c); c.fill();
      c.fillStyle = LH.bodyLit; c.beginPath(); c.moveTo(0.0095, -0.2865); c.lineTo(0.0095, -0.4055); c.lineTo(0.032, -0.4055); c.lineTo(0.0336, -0.296); c.lineTo(0.0345, -0.2865); c.closePath(); c.fill();
      c.fillStyle = LH.band; c.beginPath(); bandPath(c); c.fill();
      c.fillStyle = LH.bandLit; c.beginPath(); c.moveTo(0.0095, -0.38302); c.quadraticCurveTo(0.0214, -0.3834, 0.0333, -0.381); c.lineTo(0.0337, -0.356); c.quadraticCurveTo(0.0216, -0.3584, 0.0095, -0.35802); c.closePath(); c.fill();
      c.fillStyle = '#5a0a14'; c.fillRect(-0.0215, -0.318, 0.0026, 0.007); c.fillRect(-0.0168, -0.318, 0.0026, 0.007);
      if (detail && px < 1 / 260) { c.strokeStyle = LH.hatch; c.globalAlpha = 0.55; c.lineWidth = Math.max(0.0011, 0.6 * px); c.beginPath(); for (const hh of HATCH) { c.moveTo(hh[0], hh[1]); c.lineTo(hh[2], hh[3]); } c.stroke(); c.globalAlpha = 1; }
      c.strokeStyle = LH.pencil; c.lineWidth = lw; c.lineJoin = 'round'; c.globalAlpha = 0.9;
      c.beginPath(); bodyPath(c); c.moveTo(-0.0333, -0.381); c.quadraticCurveTo(0, -0.3854, 0.0333, -0.381); c.moveTo(0.0337, -0.356); c.quadraticCurveTo(0, -0.3604, -0.0337, -0.356); c.stroke();
      if (detail && px < 1 / 500) { c.globalAlpha = 0.35; c.save(); c.translate(0.6 * px, -0.5 * px); c.beginPath(); bodyPath(c); c.stroke(); c.restore(); }
      c.globalAlpha = 1;
      c.strokeStyle = LH.galRim; c.lineWidth = lw * 0.8; c.beginPath(); c.ellipse(0, -0.2865, 0.0345, 0.0052, 0, 0.1, PI - 0.1); c.stroke();
      // the lamp room: the head, which turns
      const lamp = Q.lamp || 0, ly = -0.4105, lh = 0.0215, lwid = 0.0138;
      c.fillStyle = lamp > 0.001 ? css(mixc(hex(LH.lant), [255, 231, 176], lamp)) : LH.lant; c.fillRect(-lwid, ly - lh, lwid * 2, lh);
      if (lamp < 0.999) { c.fillStyle = LH.lantLit; c.globalAlpha = 1 - lamp; c.fillRect(0.004, ly - lh, lwid - 0.004, lh); c.globalAlpha = 1; }
      const hd = cl(Q.head, -1.4, 1.4) * 0.95, lx = lwid * 0.78 * Math.sin(hd);
      const ey = Q.eye || 0, eh = lh * 0.62 * (ey > 0 ? 1 + 0.4 * ey : Math.max(0.22, 1 + 0.75 * ey)), ew = 0.0072 * (1 + 0.25 * Math.max(0, ey));
      c.fillStyle = lamp > 0.001 ? css(mixc(hex(LH.lens), [255, 251, 232], lamp)) : LH.lens; c.fillRect(lx - ew / 2, ly - lh * 0.47 - eh / 2, ew, eh);
      c.strokeStyle = LH.mull; c.lineWidth = Math.max(0.0009, 0.55 * px); c.beginPath();
      for (const o of [-1.05, 1.05]) { const a = hd + o; if (Math.cos(a) > 0.05) { const x = lwid * Math.sin(a); c.moveTo(x, ly - lh); c.lineTo(x, ly); } }
      c.stroke();
      c.strokeStyle = LH.pencil; c.lineWidth = lw; c.strokeRect(-lwid, ly - lh, lwid * 2, lh);
      if (lamp > 0.001) {
        const gy = ly - lh / 2;
        c.fillStyle = 'rgba(255,226,160,' + (0.2 * lamp).toFixed(3) + ')'; c.beginPath(); c.arc(0, gy, 0.056, 0, TAU); c.fill();
        c.fillStyle = 'rgba(255,240,205,' + (0.36 * lamp).toFixed(3) + ')'; c.beginPath(); c.arc(0, gy, 0.028, 0, TAU); c.fill();
        c.fillStyle = 'rgba(255,250,232,' + (0.6 * lamp).toFixed(3) + ')'; c.beginPath(); c.ellipse(0, gy, 0.07 * lamp, 0.0035, 0, 0, TAU); c.moveTo(0.003, gy); c.ellipse(0, gy, 0.003, 0.034 * lamp, 0, 0, TAU); c.fill();
      }
      // the gallery ring
      c.fillStyle = LH.gal; c.beginPath(); c.ellipse(0, -0.4085, 0.037, 0.0048, 0, 0, TAU); c.fill();
      c.strokeStyle = LH.galRim; c.lineWidth = lw * 0.8; c.beginPath(); c.ellipse(0, -0.4085, 0.037, 0.0048, 0, 0.15, PI - 0.15); c.stroke();
      // the cap: a red cone that lifts like a hat
      c.save(); c.translate(0, -0.4318 - Q.capL); c.rotate(Q.capT);
      c.fillStyle = LH.roof; c.beginPath(); c.moveTo(-0.0215, 0); c.quadraticCurveTo(-0.009, -0.011, 0, -0.026); c.quadraticCurveTo(0.009, -0.011, 0.0215, 0); c.closePath(); c.fill();
      c.fillStyle = LH.roofLit; c.beginPath(); c.moveTo(0.004, 0); c.lineTo(0.0012, -0.0215); c.quadraticCurveTo(0.009, -0.011, 0.0215, 0); c.closePath(); c.fill();
      c.fillStyle = LH.eave; c.beginPath(); c.ellipse(0, 0, 0.0225, 0.0028, 0, 0, TAU); c.fill();
      c.strokeStyle = LH.pencil; c.lineWidth = lw; c.beginPath(); c.moveTo(-0.0215, 0); c.quadraticCurveTo(-0.009, -0.011, 0, -0.026); c.quadraticCurveTo(0.009, -0.011, 0.0215, 0); c.stroke();
      c.restore();
      c.restore();
    }
    function drawBeam(c, Q, px) {
      const lamp = Q.lamp || 0; if (lamp < 0.01) return;
      const o = bodyPt(Q, 0, -0.421), b = -2.75 + 2.3 * ss(0, 1, (S.beamU || 0)), cb = Math.cos(b), len = 2.4 * Math.abs(cb), spr = 0.035 + 0.05 * (1 - Math.abs(cb));
      if (len < 0.05) return;
      const ex = o[0] + Math.sign(cb) * len, gr = c.createLinearGradient(o[0], o[1], ex, o[1]);
      gr.addColorStop(0, 'rgba(255,238,196,' + (0.4 * lamp).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(255,238,196,0)');
      c.fillStyle = gr; c.beginPath(); c.moveTo(o[0], o[1] - 0.004); c.lineTo(ex, o[1] - len * spr * 0.5 + 0.01); c.lineTo(ex, o[1] + len * spr * 0.5 + 0.01); c.lineTo(o[0], o[1] + 0.004); c.closePath(); c.fill();
    }
    function drawSun(c) {
      const y = SUN_Y + P.sun;
      c.fillStyle = 'rgba(255,239,176,0.33)'; c.beginPath(); c.arc(0, y, SUN_R * 1.16, 0, TAU); c.fill();
      c.fillStyle = '#fff8da'; c.beginPath(); c.arc(0, y, SUN_R, 0, TAU); c.fill();
    }
    const SHIM_COLS = ['#fffdf2', '#ffe2d0', '#ffc4c0'], SHIM_B = [];
    for (let i = 0; i < 18; i++) SHIM_B.push([]);
    function drawShimmer(c, L, rm) {
      const t = rm ? 0 : S.t, xa = L.x0, xb = L.x0 + L.V, yb = L.y0 + L.Hv;
      for (const b of SHIM_B) b.length = 0;
      for (const d of SHIM) {
        if (d.y - d.th > yb) continue;
        const x = d.x + d.dr * Math.sin(t * d.w2 + d.ph * 1.3);
        if (x + d.len < xa || x - d.len > xb) continue;
        const a = 0.18 + 0.62 * (0.5 + 0.5 * Math.sin(t * d.w + d.ph)), q = Math.min(5, Math.round(a * 6 - 0.5));
        SHIM_B[SHIM_COLS.indexOf(d.col) * 6 + q].push(x, d.y, d.len, d.th);
      }
      for (let i = 0; i < 18; i++) {
        const b = SHIM_B[i]; if (!b.length) continue;
        c.globalAlpha = ((i % 6) + 0.5) / 6; c.fillStyle = SHIM_COLS[(i / 6) | 0]; c.beginPath();
        for (let j = 0; j < b.length; j += 4) { c.moveTo(b[j] + b[j + 2], b[j + 1]); c.ellipse(b[j], b[j + 1], b[j + 2], b[j + 3], 0, 0, TAU); }
        c.fill();
      }
      c.globalAlpha = 1;
    }
    function drawWater(c, G, px, dt, rm) {
      const t = rm ? 0 : S.t, lw = Math.max(0.0012, 0.8 * px);
      c.lineWidth = Math.max(0.006, 1.3 * px); c.strokeStyle = 'rgba(14,8,30,0.38)'; c.beginPath();
      for (let i = 0; i < 4; i++) { const g = G[i]; if (g.lift > 0.03) continue; const wx = g.fx, s = 0.0016 * Math.sin(t * 1.7 + i); c.moveTo(wx, 0.07); c.lineTo(wx + s, 0.079); c.moveTo(wx - s, 0.083); c.lineTo(wx + s * 0.5, 0.092); }
      c.stroke();
      c.lineWidth = lw;
      for (let i = 0; i < 4; i++) {
        const g = G[i], ph = rm ? 0.3 : (t * 0.42 + i * 0.27) % 1, rx = 0.011 + 0.008 * ph;
        c.strokeStyle = 'rgba(255,236,224,' + (0.55 * (1 - ph)).toFixed(3) + ')'; c.beginPath(); c.ellipse(g.fx, 0.0685, rx, rx * 0.26, 0, 0, TAU); c.stroke();
        // drips from a lifted foot; a ring when it goes back in
        if (!rm) {
          if (g.lift > 0.012 && R() < dt * 9) S.parts.push({ x: g.fx + (R() - 0.5) * 0.004, y: g.fy, vx: (R() - 0.5) * 0.02, vy: 0, age: 0, life: 1.2 });
          if (S.prevLift[i] > 0.01 && g.lift < 0.004) S.rings.push({ x: g.fx, y: 0.0685, t0: S.t, life: 0.9, r0: 0.006, r1: 0.034 });
          S.prevLift[i] = g.lift;
        }
      }
    }
    function drawParts(c, px, dt) {
      const r = Math.max(0.0026, 1.1 * px);
      S.parts = S.parts.filter((p) => { p.age += dt; p.vy += 0.9 * dt; p.x += p.vx * dt; p.y += p.vy * dt; return p.age < p.life && !(p.y > 0.072 && p.vy > 0); });
      if (S.parts.length) { c.fillStyle = '#fff3e4'; c.beginPath(); for (const p of S.parts) { c.moveTo(p.x + r, p.y); c.arc(p.x, p.y, r, 0, TAU); } c.fill(); }
      S.rings = S.rings.filter((g) => S.t - g.t0 < g.life);
      c.lineWidth = Math.max(0.0014, 0.9 * px);
      for (const g of S.rings) { const q = (S.t - g.t0) / g.life, rx = lerp(g.r0, g.r1, 1 - (1 - q) * (1 - q)); c.strokeStyle = 'rgba(255,238,226,' + (0.75 * (1 - q)).toFixed(3) + ')'; c.beginPath(); c.ellipse(g.x, g.y, rx, rx * 0.28, 0, 0, TAU); c.stroke(); }
    }
    function splash(x, y, n, up, side) { for (let i = 0; i < n; i++) S.parts.push({ x: x + (R() - 0.5) * 0.01, y, vx: (side || 0) * 0.08 + (R() - 0.5) * 0.12, vy: -up * (0.6 + R() * 0.5), age: 0, life: 1.1 }); }

    /* ---------- paper grain (screen space, like the game's comp pass) ---------- */
    let GR = null; const GP = new WeakMap();
    function grain(ctx, x0, y0, w, h) {
      if (GR === null) {
        GR = false;
        try {
          const g = new OffscreenCanvas(128, 128), x = g.getContext('2d');
          for (let i = 0; i < 1500; i++) { const d = R() < 0.6; x.fillStyle = d ? 'rgba(34,16,46,' + (0.05 + R() * 0.16).toFixed(3) + ')' : 'rgba(255,246,228,' + (0.05 + R() * 0.15).toFixed(3) + ')'; x.fillRect(Math.floor(R() * 128), Math.floor(R() * 128), R() < 0.3 ? 2 : 1, 1); }
          x.strokeStyle = 'rgba(110,88,80,0.14)'; x.lineWidth = 0.7;
          for (let i = 0; i < 46; i++) { const px = R() * 128, py = R() * 128, a = R() * TAU, l = 3 + R() * 9; for (const ox of [-128, 0, 128]) for (const oy of [-128, 0, 128]) { x.beginPath(); x.moveTo(px + ox, py + oy); x.lineTo(px + ox + Math.cos(a) * l, py + oy + Math.sin(a) * l); x.stroke(); } }
          GR = g;
        } catch (e) { GR = false; }
      }
      if (!GR) return;
      let grPat = GP.get(ctx); if (!grPat) { grPat = ctx.createPattern(GR, 'repeat'); GP.set(ctx, grPat); }
      if (w <= 0 || h <= 0) return;
      ctx.save(); ctx.globalAlpha = 0.42; ctx.fillStyle = grPat; ctx.fillRect(x0, y0, w, h); ctx.restore();
    }

    /* ---------- the player's viewfinder, the shutter, the print (the game's own HUD bits; no type) ---------- */
    function vfRect(L) {
      const w = L.w, h = L.h, asp = w >= h * 0.95 ? 1.5 : 1 / 1.5;
      let fh = Math.min(h * 0.84, 0.6 * L.k), fw = fh * asp;
      if (fw > w * 0.9) { fw = w * 0.9; fh = fw / asp; }
      const lx = (P.bx - L.x0) * L.k, ly = (-0.2 - L.y0) * L.k, m = 4 + 7 * cl(Math.min(w, h) / 420, 0.42, 1.1);
      if (fh > h - 2 * m) { fh = h - 2 * m; fw = fh * asp; }
      if (fw > w - 2 * m) { fw = w - 2 * m; fh = fw / asp; }
      return { x: cl(lx, fw / 2 + m, w - fw / 2 - m) - fw / 2, y: cl(ly, fh / 2 + m, h - fh / 2 - m) - fh / 2, w: fw, h: fh };
    }
    function drawMini(c, iw, ih) {
      const hz = ih * 0.66, m = ih / 0.75, lx = iw * 0.56;
      const bands = ['#c4778f', '#e58a93', '#f9a08f', '#ffb886', '#ffcf7f', '#ffe08a'];
      for (let i = 0; i < bands.length; i++) { c.fillStyle = bands[i]; c.fillRect(0, hz * i / bands.length, iw, hz / bands.length + 0.5); }
      c.fillStyle = 'rgba(255,246,190,0.45)'; c.beginPath(); c.arc(lx, hz + SUN_Y * m, SUN_R * m * 1.7, 0, TAU); c.fill();
      c.fillStyle = '#fff8da'; c.beginPath(); c.arc(lx, hz + SUN_Y * m, SUN_R * m, 0, TAU); c.fill();
      c.fillStyle = '#754673'; c.beginPath(); c.moveTo(lx - 0.36 * m, hz); c.quadraticCurveTo(lx - 0.25 * m, hz - 0.07 * m, lx - 0.1 * m, hz - 0.06 * m); c.quadraticCurveTo(lx + 0.12 * m, hz - 0.05 * m, lx + 0.24 * m, hz); c.closePath(); c.fill();
      c.fillStyle = '#273a74'; c.fillRect(0, hz, iw, ih - hz);
      c.fillStyle = '#ef9ca7'; c.beginPath(); c.moveTo(lx - 0.03 * m, hz); c.lineTo(lx + 0.03 * m, hz); c.lineTo(lx + 0.24 * m, ih); c.lineTo(lx - 0.26 * m, ih); c.closePath(); c.fill();
      c.fillStyle = '#fff1d6'; c.beginPath(); c.moveTo(lx - 0.01 * m, hz + 0.02 * m); c.lineTo(lx + 0.01 * m, hz + 0.02 * m); c.lineTo(lx + 0.12 * m, ih); c.lineTo(lx - 0.14 * m, ih); c.closePath(); c.fill();
      c.save(); c.translate(lx, hz); c.scale(m, m);
      const Q = Object.assign({}, REST, { lamp: 1 });
      drawLegs(c, legGeom(Q, null), 1.2 / m); drawTower(c, Q, 1 / m, false);
      c.restore();
    }
    function printState(u) {
      if (u < 2.7 || u > 5.55) return null;
      const e = backOut((u - 2.7) / 0.8), fall = Math.pow(ss(4.9, 5.55, u), 2);
      return { rise: e, fall, rot: lerp(0.1, -0.044, cl(e, 0, 1.2)) - 0.16 * fall, dev: ss(2.9, 4.3, u), tape: u >= 3.7 ? 1 + 0.6 * (1 - ss(3.7, 3.82, u)) : 0 };
    }
    const MINI = { cv: null, key: '' };
    function miniImage(c, iw, ih, dpr) {
      const key = iw.toFixed(1) + '|' + ih.toFixed(1) + '|' + dpr;
      if (MINI.key !== key && MINI.key !== 'x') {
        try {
          const W = Math.max(1, Math.ceil(iw * dpr)), H = Math.max(1, Math.ceil(ih * dpr));
          if (!MINI.cv) MINI.cv = new OffscreenCanvas(W, H); else { MINI.cv.width = W; MINI.cv.height = H; }
          const x = MINI.cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); drawMini(x, iw, ih); MINI.key = key;
        } catch (e) { MINI.key = 'x'; }
      }
      if (MINI.key === key) c.drawImage(MINI.cv, 0, 0, MINI.cv.width / dpr, MINI.cv.height / dpr); else drawMini(c, iw, ih);
    }
    function drawPrint(c, L, p) {
      const w = L.w, h = L.h, land = w >= h;
      const pw = land ? Math.min(w * 0.3, h * 0.5) : w * 0.56, pad = pw * 0.045, iw = pw - 2 * pad, ih = iw / 1.5, ph = pad + ih + pad * 2.8;
      const cx = land ? w - pw * 0.66 : w * 0.6, cy = h - ph * 0.42 + (1 - p.rise) * (ph * 1.3 + 30) + p.fall * (ph * 1.6 + 40);
      c.save(); c.translate(cx, cy); c.rotate(p.rot);
      c.fillStyle = 'rgba(29,26,51,0.22)'; c.fillRect(-pw / 2 + pw * 0.025, -ph / 2 + pw * 0.04, pw, ph);
      c.fillStyle = '#fffdf7'; c.fillRect(-pw / 2, -ph / 2, pw, ph);
      c.save(); c.translate(-pw / 2 + pad, -ph / 2 + pad);
      miniImage(c, iw, ih, S.dpr || 1);
      if (p.dev < 1) { c.fillStyle = 'rgba(214,190,160,' + (0.35 * (1 - p.dev)).toFixed(3) + ')'; c.fillRect(0, 0, iw, ih); c.fillStyle = 'rgba(243,234,215,' + (0.85 * (1 - p.dev)).toFixed(3) + ')'; c.fillRect(0, 0, iw, ih); }
      c.restore();
      c.strokeStyle = 'rgba(29,26,51,0.25)'; c.lineWidth = 1; c.strokeRect(-pw / 2 + pad, -ph / 2 + pad, iw, ih);
      if (p.tape) {
        const tw = pw * 0.36, th = pw * 0.1; c.save(); c.translate(0, -ph / 2); c.rotate(-0.05); c.scale(p.tape, p.tape);
        c.fillStyle = 'rgba(232,101,58,0.55)'; c.beginPath(); c.moveTo(-tw / 2, -th / 2 + 1); c.lineTo(tw / 2, -th / 2); c.lineTo(tw / 2 - 1.5, th / 2); c.lineTo(-tw / 2 + 1, th / 2 - 0.5); c.closePath(); c.fill();
        c.fillStyle = 'rgba(242,208,107,0.6)'; c.beginPath();
        const st = Math.max(3, th * 0.6), xl = -tw / 2 + 1, xr = tw / 2 - 1.5;
        for (let x = xl - th; x < xr; x += st * 2) { const a0 = Math.max(xl, x), a1 = Math.min(xr, x + st), b0 = Math.max(xl, x + th), b1 = Math.min(xr, x + th + st); if (a1 <= a0 && b1 <= b0) continue; c.moveTo(a0, th / 2 - 0.5); c.lineTo(Math.max(a0, a1), th / 2 - 0.5); c.lineTo(Math.max(b0, b1), -th / 2 + 0.5); c.lineTo(b0, -th / 2 + 0.5); c.closePath(); }
        c.fill(); c.restore();
      }
      c.restore();
    }
    function drawHUD(c, s, L) {
      const w = L.w, h = L.h, k = cl(S.hud, 0, 1.25), sc = cl(Math.min(w, h) / 420, 0.42, 1.1), F = vfRect(L);
      const loop = s.mode === 'loop', u = loop ? s.mt % LOOP : -1;
      const snap = loop ? bump(u, 2.47, 0.12) : 0, still = loop ? 1 - bump(u, 2.4, 0.6) : 1;
      let fx = lerp(-14, F.x, k), fy = lerp(-14, F.y, k), fw = lerp(w + 28, F.w, k), fh = lerp(h + 28, F.h, k);
      if (loop) { fx += 2.2 * sc * Math.sin(S.t * 0.8) * still; fy += 1.6 * sc * Math.sin(S.t * 1.1 + 1) * still + 2 * sc * snap; }
      c.save();
      { const x0 = cl(fx, 0, w), y0 = cl(fy, 0, h), x1 = cl(fx + fw, 0, w), y1 = cl(fy + fh, 0, h); c.fillStyle = 'rgba(14,12,30,0.26)';
        c.fillRect(0, 0, w, y0); c.fillRect(0, y1, w, h - y1); c.fillRect(0, y0, x0, y1 - y0); c.fillRect(x1, y0, w - x1, y1 - y0); }
      // the shutter: an iris of six blades closes on the frame and opens again
      if (loop && u > 2.35 && u < 2.62) {
        const q = Math.sin(PI * (u - 2.35) / 0.27), R0 = 0.56 * Math.hypot(fw, fh), rr = R0 * (1 - q), ccx = fx + fw / 2, ccy = fy + fh / 2, rot = 0.7 * q;
        const vs = []; for (let i = 0; i < 6; i++) { const a = rot + i / 6 * TAU; vs.push([ccx + Math.cos(a) * rr, ccy + Math.sin(a) * rr]); }
        c.save(); c.beginPath(); c.rect(fx, fy, fw, fh); c.clip();
        c.fillStyle = '#1d1a33'; c.beginPath(); c.rect(fx, fy, fw, fh); ppath(c, vs); c.fill('evenodd');
        c.strokeStyle = 'rgba(78,72,120,0.9)'; c.lineWidth = 1; c.beginPath();
        for (let i = 0; i < 6; i++) { const a = vs[i], b = vs[(i + 1) % 6], dx = b[0] - a[0], dy = b[1] - a[1], dl = Math.hypot(dx, dy) || 1; c.moveTo(a[0], a[1]); c.lineTo(a[0] + dx / dl * R0 * 1.2, a[1] + dy / dl * R0 * 1.2); }
        c.stroke(); c.restore();
      }
      c.strokeStyle = 'rgba(255,248,226,0.85)'; c.lineWidth = 1.5; c.strokeRect(fx, fy, fw, fh);
      if (k > 0.6) { c.strokeStyle = 'rgba(255,250,240,0.2)'; c.lineWidth = 1; c.beginPath(); for (const q of [1 / 3, 2 / 3]) { c.moveTo(fx + fw * q, fy); c.lineTo(fx + fw * q, fy + fh); c.moveTo(fx, fy + fh * q); c.lineTo(fx + fw, fy + fh * q); } c.stroke(); }
      const bl = Math.max(9, 26 * sc), off = 6 * sc - 3 * sc * snap;
      for (const pass of [0, 1]) {
        c.strokeStyle = pass ? '#fff8e2' : 'rgba(14,12,30,0.35)'; c.lineWidth = pass ? Math.max(1.8, 3 * sc) : Math.max(3, 4.5 * sc); c.lineCap = 'square';
        c.beginPath();
        for (const [cx, cy, sx, sy] of [[fx, fy, 1, 1], [fx + fw, fy, -1, 1], [fx, fy + fh, 1, -1], [fx + fw, fy + fh, -1, -1]]) { c.moveTo(cx - sx * off, cy - sy * off + sy * bl); c.lineTo(cx - sx * off, cy - sy * off); c.lineTo(cx - sx * off + sx * bl, cy - sy * off); }
        c.stroke();
      }
      // the focus patch on the lamp room, and the focus ring pulling in
      const lp = bodyPt(P, 0, -0.421), lxs = (lp[0] - L.x0) * L.k, lys = (lp[1] - L.y0) * L.k;
      if (k > 0.5) { const pw2 = 34 * sc, ph2 = 24 * sc; c.fillStyle = 'rgba(255,220,120,0.08)'; c.fillRect(lxs - pw2 / 2, lys - ph2 / 2, pw2, ph2); c.strokeStyle = 'rgba(255,230,150,0.9)'; c.lineWidth = 1.5; c.strokeRect(lxs - pw2 / 2, lys - ph2 / 2, pw2, ph2); }
      if (loop && u > 0.3 && u < 2.42) {
        const r = 22 * sc * (1 + 0.6 * (1 - ss(0.3, 0.75, u))) * (1 - ss(2.3, 2.42, u));
        if (r > 1) { c.strokeStyle = '#fff8e2'; c.lineWidth = Math.max(1.5, 2.6 * sc); c.beginPath(); c.arc(lxs, lys, r, 0, TAU); c.stroke(); }
      }
      c.restore();
    }

    /* ---------- what the lighthouse wants to do (targets), springs carry it there ---------- */
    function idleBeats(T) {
      const t = S.t;
      if (t >= S.phEnd) {
        if (S.phase === 'hold') {
          const list = ['shift', 'lift', 'peer', 'stretch'].filter((b) => b !== S.last);
          S.beat = list[Math.floor(R() * list.length)]; S.last = S.beat; S.phase = 'live'; S.beatT0 = t; S.beatD = 2.5 + R() * 3.5; S.phEnd = t + S.beatD;
          S.side = R() < 0.5 ? -1 : 1; S.leg = Math.floor(R() * 4); S.sunBeat = R() < 0.5;
          if (S.beat === 'peer' && S.beatD < 3.2) { S.beatD = 3.2 + R() * 2; S.phEnd = t + S.beatD; }
        } else { S.phase = 'hold'; S.beat = null; S.phEnd = t + 1.5 + R() * 3.5; }
      }
      if (S.phase !== 'live' || !S.beat) return;
      const u = t - S.beatT0, D = S.beatD, sd = S.side;
      if (S.sunBeat) T.sun += 0.009 * env(u, D, D * 0.45, D * 0.45);
      if (S.beat === 'shift') {
        const e = env(u, D, 0.7, 0.8), flex = bump(u, D * 0.5, Math.min(0.6, D * 0.22)), li = sd < 0 ? 0 : 3, lj = sd < 0 ? 1 : 2;
        T.bx += 0.013 * sd * e; T.tilt += 0.03 * sd * e; T.by += 0.004 * e + 0.007 * flex;
        T['b' + li] += 0.022 * flex + 0.008 * e; T['b' + lj] += 0.006 * e; T.head += 0.35 * sd * e;
      } else if (S.beat === 'lift') {
        const i = S.leg, sl = i < 2 ? -1 : 1, e = env(u, D, 0.55, 0.6), shake = bump(u, D * 0.5, D * 0.25);
        T['l' + i] += 0.045 * e; T['b' + i] += 0.012 * e; T['f' + i] += sl * 0.01 * e + 0.006 * Math.sin(u * 13) * shake;
        T.bx -= 0.008 * sl * e; T.tilt -= 0.035 * sl * e; T.head += 0.6 * sl * e;
      } else if (S.beat === 'peer') {
        const m = D * 0.45, a = ss(0.2, 0.7, u) * (1 - ss(m, m + 0.5, u)), b = ss(m + 0.1, m + 0.6, u) * (1 - ss(D - 0.7, D - 0.1, u)), d = -a + b;
        T.head += d * sd; T.tilt += 0.035 * d * sd; T.capT += 0.12 * d * sd; T.by -= 0.006 * env(u, D, 0.4, 0.5); T.bx += 0.004 * d * sd;
      } else if (S.beat === 'stretch') {
        const e = env(u, D, 0.9, 0.9);
        T.by += -0.022 * e + 0.012 * bump(u, D - 0.55, 0.25); T.sy += 0.035 * e; T.capL += 0.014 * bump(u, D * 0.5, D * 0.3);
      }
    }
    function targets(s, T) {
      for (const k of KEYS) T[k] = 0;
      T.lamp = 0; T.sun = 0;
      const mode = s.mode, mt = s.mt || 0;
      let K = [150, 17], hdir = 0;
      if (s.hover && S.L) { const lx = (P.bx - S.L.x0) * S.L.k; hdir = cl((s.hover.x - lx) / (0.3 * s.w), -1, 1); }
      const hs = hdir >= 0 ? 1 : -1;
      if (mode === 'react') {
        K = [520, 30];
        const a = ss(0, 0.11, mt), up = ss(0.11, 0.25, mt);
        T.by = 0.022 * a * (1 - up) - 0.034 * up; T.sy = 0.05 * up;
        T.capL = -0.003 * a * (1 - up) + 0.045 * up - 0.01 * ss(0.45, 0.8, mt); T.capT = -0.4 * hs * up;
        T.tilt = -0.06 * hs * up; T.head = hs * up; T.eye = up - 0.6 * a * (1 - up);
        for (let i = 0; i < 4; i++) T['b' + i] = 0.022 * a * (1 - up);
        T.bx = 0.0015 * Math.sin(mt * 75) * up * (1 - ss(0.5, 0.8, mt));
      } else if (mode === 'enter') {
        K = [260, 21]; T.by = -0.004; T.head = 0.2 * hdir;
      } else if (mode === 'loop') {
        K = [200, 20];
        const u = mt % LOOP, pose = ss(0.6, 1.1, u) * (1 - ss(5.0, 5.8, u)), look = bump(u, 3.75, 0.75);
        T.by = -0.012 * pose + 0.006 * bump(u, 2.75, 0.15); T.sy = 0.012 * pose;
        T.capT = 0.18 * bump(u, 1.0, 0.3) + 0.12 * look; T.capL = 0.008 * bump(u, 1.0, 0.3);
        T.head = 0.35 * hdir * (1 - pose) + look * 1.0; T.tilt = 0.04 * look; T.bx = 0.006 * look;
        T.lamp = ss(1.5, 2.1, u) * (1 - ss(4.6, 5.3, u)); T.sun = 0.008 * env(u, LOOP, 1.6, 1.6);
        S.beamU = cl((u - 1.5) / 3.8, 0, 1);
      } else if (mode === 'squeezed') {
        K = [240, 22];
        const q = cl(s.squeeze || 0, 0, 1), e = ss(0, 1.0, mt), glare = ss(0.35, 0.55, mt), huff = mt > 1.2 ? bump(mt % 2.6, 0.25, 0.18) : 0;
        T.by = 0.048 * q + 0.012 * huff * q; T.spl = q;
        T.head = 1.25 * glare; T.eye = -0.85 * glare; T.capT = 0.3 * glare * q; T.capL = -0.007 * q + 0.012 * huff;
        T.tilt = -0.05 * q * e; T.bx = -0.006 * q;
      } else {
        idleBeats(T);
        const n = cl(s.near || 0, 0, 1);
        if (n > 0) { T.by -= 0.012 * n; T.head += 0.75 * n; T.tilt += 0.045 * n; T.capL += 0.006 * n; T.capT += 0.1 * n; }
      }
      if (S.gag) {
        const u = S.t - S.gag.t0;
        if (u > 1.6) S.gag = null;
        else {
          K = [380, 25];
          const wind = ss(0, 0.35, u) * (1 - ss(0.38, 0.5, u)), kick = ss(0.4, 0.58, u) * (1 - ss(0.75, 1.25, u)), back = ss(0, 0.3, u) * (1 - ss(1.0, 1.5, u));
          T.bx += -0.014 * back; T.tilt += -0.07 * wind - 0.11 * kick; T.by += 0.004 * wind;
          T.l3 += 0.05 * wind + 0.12 * kick; T.f3 += -0.03 * wind + 0.15 * kick; T.b3 += 0.025 * wind - 0.02 * kick; T.eye += 0.6 * kick; T.kk += kick;
          T.head += 0.8 * back; T.capL += 0.01 * kick; T.capT += -0.2 * kick;
          if (!S.gag.thrown && u >= 0.62 && S.L) {
            S.gag.thrown = true;
            const f = S.foot[3], L = S.L;
            splash(f[0], f[1], 8, 0.5, 1);
            api.emit({ type: 'throw', item: 'shell', x: (f[0] - L.x0) * L.k, y: (f[1] - L.y0) * L.k - 6, vx: 1, vy: -1.3 });
          }
        }
      }
      if (S.hit) {
        const u = S.t - S.hit.t0;
        if (u > 1.1) S.hit = null;
        else {
          K = [420, 26];
          const f = ss(0, 0.06, u) * (1 - ss(0.25, 1.0, u)), sd = S.hit.side;
          T.by += 0.03 * f; T.tilt += -sd * 0.12 * f; T.capL += 0.022 * f; T.capT += -sd * 0.35 * f; T.head += sd * ss(0.15, 0.35, u) * (1 - ss(0.8, 1.1, u));
          for (let i = 0; i < 4; i++) T['b' + i] += 0.012 * f;
        }
      }
      if (S.look) {
        const u = S.t - S.look.t0;
        if (u > 1.5) S.look = null;
        else { const e = env(u, 1.5, 0.25, 0.35); T.head += S.look.d * e; T.tilt += 0.04 * S.look.d * e; T.capT += 0.12 * S.look.d * e; }
      }
      return K;
    }
    function springs(T, K, dt) {
      const k = K[0], c = K[1], n = Math.max(1, Math.ceil(dt * 120)), h = dt / n;
      for (let j = 0; j < n; j++) for (const key of KEYS) { V[key] += (k * (T[key] - P[key]) - c * V[key]) * h; P[key] += V[key] * h; }
      for (const key of KEYS) if (Math.abs(P[key] - T[key]) < 2e-6 && Math.abs(V[key]) < 2e-5) { P[key] = T[key]; V[key] = 0; }
      P.lamp = T.lamp; P.sun = T.sun;
      const ht = S.mode === 'enter' || S.mode === 'loop' ? 1 : 0;
      for (let j = 0; j < n; j++) { S.hudV += (240 * (ht - S.hud) - 25 * S.hudV) * h; S.hud += S.hudV * h; }
      if (Math.abs(S.hud - ht) < 1e-4 && Math.abs(S.hudV) < 1e-3) { S.hud = ht; S.hudV = 0; }
    }

    return {
      frame(ctx, s) {
        const w = Math.max(1, s.w || 1), h = Math.max(1, s.h || 1), rm = !!s.rm, dt = rm ? 0 : cl(s.dt || 0, 0, 0.05);
        S.t = rm ? 0 : s.t || 0;
        const mode = rm ? 'idle' : s.mode || 'idle';
        if (mode !== S.mode) { S.mode = mode; if (mode === 'idle') { S.phase = 'hold'; S.beat = null; S.phEnd = S.t + 1.6 + R() * 2.4; } }
        if (rm) { for (const k of KEYS) { P[k] = 0; V[k] = 0; } P.lamp = 0; P.sun = 0; S.hud = 0; S.hudV = 0; S.parts.length = 0; S.rings.length = 0; S.gag = S.hit = S.look = null; }
        else { const T = {}; springs(T, targets(Object.assign({}, s, { mode }), T), dt); }
        const L = layout(w, h, 1 + 0.16 * cl(S.hud, 0, 1.3)); S.L = L;
        let dpr = 1;
        try { const m = ctx.getTransform(); dpr = Math.hypot(m.a, m.b) || 1; } catch (e) { dpr = 1; }
        S.dpr = Math.min(3, Math.round(dpr * 4) / 4);
        stillLayer(ctx, L, dpr);
        const px = 1 / L.k;
        ctx.save(); ctx.translate(-L.x0 * L.k, -L.y0 * L.k); ctx.scale(L.k, L.k);
        drawSun(ctx);
        drawShimmer(ctx, L, rm);
        const G = legGeom(P, L);
        for (let i = 0; i < 4; i++) { S.foot[i][0] = G[i].fx; S.foot[i][1] = G[i].fy; }
        drawWater(ctx, G, px, dt, rm);
        drawBeam(ctx, P, px);
        drawLegs(ctx, G, px);
        drawTower(ctx, P, px, true);
        drawParts(ctx, px, dt);
        ctx.restore();
        { const a = bodyPt(P, 0, -0.47), b2 = bodyPt(P, 0, -0.28), gx = (Math.min(a[0], b2[0]) - 0.05 - L.x0) * L.k, gy = (a[1] - 0.04 - L.y0) * L.k; grain(ctx, Math.floor(gx), Math.floor(gy), Math.ceil((Math.abs(a[0] - b2[0]) + 0.1) * L.k), Math.ceil((b2[1] - a[1] + 0.06) * L.k)); }
        if (S.hud > 0.003) drawHUD(ctx, Object.assign({}, s, { mode }), L);
        // the print slides out of the camera, develops, gets taped; it drops away if the hover ends
        if (mode === 'loop') { const p = printState((s.mt || 0) % LOOP); S.print = p; S.printT = S.t; if (p) drawPrint(ctx, L, p); }
        else if (S.print && S.t - S.printT < 0.5) { const q = (S.t - S.printT) / 0.5; drawPrint(ctx, L, Object.assign({}, S.print, { fall: Math.max(S.print.fall, q * q) })); }
        else S.print = null;
        if (S.gag && !rm) { const u = S.t - S.gag.t0; if (u > 0.44 && u < 0.62) { const f = S.foot[3], q = (u - 0.44) / 0.18; BUG_MODS.caracolina.items.shell(ctx, (f[0] - L.x0) * L.k + 4 * q, (f[1] - L.y0) * L.k - 4 - 10 * q, u, -0.4 + q * 2.5); } }
        const lp = bodyPt(P, 0, -0.421);
        S.anchor = { x: cl((lp[0] - L.x0) * L.k / w, 0.05, 0.95), y: cl((lp[1] - L.y0) * L.k / h, 0.05, 0.95) };
      },
      on(e) {
        if (!e) return;
        if (e.type === 'cue') { if (!S.gag) S.gag = { t0: S.t, thrown: false }; }
        else if (e.type === 'hit') {
          const L = S.L, lx = L ? (P.bx - L.x0) * L.k : 0;
          S.hit = { t0: S.t, side: (e.x || 0) >= lx ? 1 : -1 };
          if (L && e.x != null && e.y != null) { const wx = e.x / L.k + L.x0, wy = e.y / L.k + L.y0; if (wy > 0.004) { S.rings.push({ x: wx, y: Math.max(0.006, wy), t0: S.t, life: 1.0, r0: 0.008, r1: 0.05 }); splash(wx, Math.max(0.006, wy), 7, 0.45, 0); } else splash(wx, wy, 5, 0.25, 0); }
        } else if (e.type === 'look') S.look = { t0: S.t, d: (e.dx || 0) >= 0 ? 1 : -1 };
        else if (e.type === 'shake') { const a = cl(+e.amount || 0.5, 0, 2); V.bx += (R() < 0.5 ? -1 : 1) * 0.06 * a; V.tilt += (R() < 0.5 ? -1 : 1) * 0.6 * a; V.by += 0.05 * a; }
      },
      anchor() { return S.anchor; }
    };
  }
};
