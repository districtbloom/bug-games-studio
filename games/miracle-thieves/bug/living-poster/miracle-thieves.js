BUG_MODS.miraclethieves = {
  key: 'miraclethieves',
  no: '···',
  title: 'Miracle Thieves',
  maker: '···',
  kind: 'Co-op cathedral heist',
  verb: 'Steal.',
  ground: '#d9c0a3',
  ink: '#2f63e0',
  rants: ['oi!', '…!?', '#@$%'],
  hits: ['!', 'oof'],
  acts: { bolt: 'shoot', relic: 'grab' },
  items: {
    /* an Arc Bolt: Pim's rounded cobalt spark, white core, ink line (~24 px) */
    bolt(ctx, x, y, t, a) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(a || 0);
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.strokeStyle = '#1d1620'; ctx.lineWidth = 1.4;
      for (let i = 3; i >= 1; i--) {
        ctx.fillStyle = i === 3 ? '#9db8ff' : '#5f86f0';
        ctx.beginPath(); ctx.arc(-i * 5.2, Math.sin((t || 0) * 18 + i) * 1.6, 4.4 - i, 0, 6.2832); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(47,99,224,0.22)'; ctx.beginPath(); ctx.arc(0, 0, 11, 0, 6.2832); ctx.fill();
      ctx.fillStyle = '#2f63e0'; ctx.beginPath(); ctx.ellipse(0, 0, 8, 6.4, 0, 0, 6.2832); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#eaf0ff'; ctx.beginPath(); ctx.ellipse(1.6, -0.6, 3.6, 2.6, 0, 0, 6.2832); ctx.fill();
      ctx.restore();
    },
    /* a stolen relic: a miracle's round warm light in a little brass reliquary ring (~24 px) */
    relic(ctx, x, y, t, a) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin((t || 0) * 6) * 0.25);
      ctx.lineJoin = 'round'; ctx.strokeStyle = '#1d1620'; ctx.lineWidth = 1.4;
      ctx.fillStyle = 'rgba(255,214,120,0.28)'; ctx.beginPath(); ctx.arc(0, 0, 13, 0, 6.2832); ctx.fill();
      ctx.fillStyle = '#b08a3e'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, 6.2832); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffe7a8'; ctx.beginPath(); ctx.arc(0, 0, 6.6, 0, 6.2832); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff8e4'; ctx.beginPath(); ctx.arc(-1.6, -1.8, 2.6, 0, 6.2832); ctx.fill();
      ctx.fillStyle = '#b08a3e'; ctx.beginPath(); ctx.moveTo(-2.4, -9.6); ctx.lineTo(0, -15); ctx.lineTo(2.4, -9.6); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
  },
  create(api) {
    const R = api.rnd, TAU = Math.PI * 2, PI = Math.PI;
    const cl = (v, a, b) => (v < a ? a : v > b ? b : v);
    const lerp = (a, b, k) => a + (b - a) * k;
    const ease = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k));
    const seg = (t, a, b) => ease((t - a) / (b - a));
    const bump = (t, a, b) => (t <= a || t >= b ? 0 : Math.sin(PI * (t - a) / (b - a)));
    const hash = (n) => { const s = Math.sin(n * 127.1 + 0.37) * 43758.5453; return s - Math.floor(s); };

    // ---------- the game's palette ----------
    const OUT = '#1d1620', LIME = '#d9c0a3', LIME_D = '#c4a687', LIME_L = '#e9d6bd', LIME_LL = '#f1e2cc';
    const IVORY = '#efe8da', TILE = '#ded3c0', INDIGO = '#2b2459', INDIGO_D = '#211b47', INDIGO_L = '#3d3578';
    const BRASS = '#b08a3e', BRASS_D = '#6a4f22', BRASS_L = '#d0a552';
    const COB = '#2f63e0', COB_L = '#9db8ff', COB_W = '#eaf0ff', RUBY = '#c8233c', RUBY_D = '#7a1e32';
    const SHELL = '#f2d3b6', SHELL_D = '#dcae8e', SHELL_L = '#fbe7d2';
    const SNB = '#6c5878', SNB_D = '#4f3f5c', PORTAL = '#4a2c1c', PORTAL_D = '#341d12';
    const FLAME = '#ffc94f', FLAME_C = '#fff3c4', AMBER = '#e6b35e', TEAL = '#2f6f73';
    const OAK = '#8d5a30', OAK_L = '#b07740', OAK_D = '#5c3a1e';

    // ---------- camera: a real pitch + perspective, so "enter" is a physical crane down into play ----------
    const CAM = { tx: 0, ty: 1.2, tz: -0.6, ph: 0.08, D: 16, f: 100, cx: 0, cy: 0, sp: 0, cp: 1, camY: 0, camZ: 0 };
    let PX = 0, PY = 0, PS = 1, PZ = 1;
    function setCam(tx, ty, tz, ph, D) {
      CAM.tx = tx; CAM.ty = ty; CAM.tz = tz; CAM.ph = ph; CAM.D = D; CAM.sp = Math.sin(ph); CAM.cp = Math.cos(ph);
      CAM.camY = ty + D * CAM.sp; CAM.camZ = tz + D * CAM.cp;
    }
    function P(x, y, z) {
      const dx = x - CAM.tx, dy = y - CAM.camY, dz = z - CAM.camZ;
      const yc = dy * CAM.cp - dz * CAM.sp; let zc = -dy * CAM.sp - dz * CAM.cp; if (zc < 0.05) zc = 0.05;
      PZ = zc; PS = CAM.f / zc; PX = CAM.cx + dx * PS; PY = CAM.cy - yc * PS;
    }
    function wpath(ctx, a, close) {
      for (let i = 0; i < a.length; i += 3) { P(a[i], a[i + 1], a[i + 2]); if (i === 0) ctx.moveTo(PX, PY); else ctx.lineTo(PX, PY); }
      if (close) ctx.closePath();
    }
    // a vertical quad in a z-plane
    function quad(ctx, x0, y0, x1, y1, x2, y2, x3, y3, z) {
      P(x0, y0, z); ctx.moveTo(PX, PY); P(x1, y1, z); ctx.lineTo(PX, PY); P(x2, y2, z); ctx.lineTo(PX, PY); P(x3, y3, z); ctx.lineTo(PX, PY); ctx.closePath();
    }

    // ---------- precomputed world geometry ----------
    const WALLZ = -3.9, COLZ = -3.5;
    const ARCH = [], ARCH_O = [];
    for (let i = 0; i <= 28; i++) { const u = -1 + 2 * i / 28; ARCH.push(u * 1.85, 5.7 * (1 - u * u), WALLZ); ARCH_O.push(u * 2.12, 6.25 * (1 - u * u), WALLZ); }
    const RINGS = [];
    for (const r of [0.62, 1.05, 1.5, 1.95]) { const a = []; for (let i = 0; i <= 30; i++) { const q = i / 30 * TAU; a.push(Math.cos(q) * r, 2.9 + Math.sin(q) * r, WALLZ); } RINGS.push(a); }
    const ORN = [];
    for (const sx of [-1, 1]) { const a = []; for (let i = 0; i <= 24; i++) { const q = i / 24 * TAU; a.push(sx * 3.05 + Math.cos(q) * 0.5, 6.4 + Math.sin(q) * 0.5, WALLZ + 0.1); } ORN.push(a); }
    const COLX = [-9.6, -6.5, -3.55, 3.55, 6.5, 9.6];
    const SPECK = []; for (let i = 0; i < 26; i++) SPECK.push(-1.8 + hash(i) * 3.7, -0.35 - hash(i + 40) * 1.3, 0.016 + hash(i + 80) * 0.024);
    const MOTES = []; for (let i = 0; i < 9; i++) MOTES.push({ x: (hash(i + 5) - 0.5) * 0.24, ph: hash(i + 9), sp: 0.08 + hash(i + 13) * 0.07, r: 0.025 + hash(i + 17) * 0.03 });
    const SER = []; for (let i = 0; i < 30; i++) { const q = i / 30 * TAU; SER.push(Math.cos(q), Math.sin(q)); }

    // the Custodian's coiled shell: a logarithmic tube, precomputed (shell-local units)
    const SP = { base: [], tube: [], hl: [], ribs: [], wins: [], eye: [0, 0], top: [0, 0], lip: [0, 0, 0] };
    (function () {
      const N = 120, TH = 2.2 * PI, k = 0.12, sq = 0.74, a0 = PI / 2;
      const o = [], inn = [], h1 = [], h2 = [];
      let minY = 1e9;
      for (let i = 0; i <= N; i++) {
        const th = i / N * TH, rc = 1.3 * Math.exp(-k * th), hw = 0.42 * Math.exp(-k * th), a = a0 + th, c = Math.cos(a), sn = Math.sin(a) * sq;
        o.push(c * (rc + hw), sn * (rc + hw)); inn.push(c * (rc - hw), sn * (rc - hw)); h1.push(c * (rc + hw * 0.62), sn * (rc + hw * 0.62)); h2.push(c * (rc + hw * 0.18), sn * (rc + hw * 0.18));
        if (sn * (rc + hw) < minY) { minY = sn * (rc + hw); SP.top = [c * (rc + hw * 0.6), sn * (rc + hw * 0.6)]; }
        if (i % 8 === 4 && i < N - 6) SP.ribs.push(c * (rc - hw), sn * (rc - hw), c * (rc + hw), sn * (rc + hw));
      }
      SP.tube = o.concat(inn.reverse().flatMap((v, j, A) => j % 2 ? [] : [A[j + 1], A[j]]));
      SP.hl = h1.concat(h2.reverse().flatMap((v, j, A) => j % 2 ? [] : [A[j + 1], A[j]]));
      const nb = Math.round(N * TAU / TH); for (let i = 0; i <= nb; i++) SP.base.push(o[i * 2], o[i * 2 + 1]);
      const end = TH, rce = 1.3 * Math.exp(-k * end); SP.eye = [-0.05, 0.02]; SP.lip = [Math.cos(a0) * 1.3, Math.sin(a0) * sq * 1.3, 0.42];
      for (const th of [0.45, 1.05, 4.1]) { const rc = 1.3 * Math.exp(-k * th), a = a0 + th; SP.wins.push(Math.cos(a) * rc, Math.sin(a) * sq * rc + 0.05, 2.6 * Math.exp(-k * th)); }
    })();
    function wloop(ctx, a) { ctx.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) ctx.lineTo(a[i], a[i + 1]); ctx.closePath(); }

    // ---------- the loop's script (6 s, seamless) ----------
    const LT = 6;
    const PATH = [ // t, x, z  (Pim's feet, before the plate's spread factor)
      [0, -1.25, 0.95], [2.0, 0.35, 0.8], [2.42, 0.35, 0.8], [2.72, 1.35, 0.35], [3.05, 1.35, 0.35], [4.1, 0.05, -0.6], [4.6, 0.05, -0.6], [5.75, -1.25, 0.95], [6, -1.25, 0.95]
    ];
    function pathAt(t) {
      for (let i = 1; i < PATH.length; i++) if (t <= PATH[i][0]) {
        const a = PATH[i - 1], b = PATH[i], k = (t - a[0]) / (b[0] - a[0] || 1), e = i === 4 ? ease(k) : k;
        return [lerp(a[1], b[1], e), lerp(a[2], b[2], e), (b[1] - a[1]) / (b[0] - a[0] || 1)];
      }
      return [PATH[0][1], PATH[0][2], 0];
    }
    const MITES = []; // spawn t, death t, side (-1 left, 1 right, 0 from behind the Custodian), lane z
    for (let i = 0; i < 15; i++) { const ts = i * 0.37, td = Math.min(5.92, ts + 0.95 + (i % 3) * 0.22); MITES.push([ts, td, [-1, 1, 0, 1, -1][i % 5], -0.6 + hash(i + 3) * 2.4]); }
    const RING = { t0: 1.95, t1: 2.95, x: 0.35, z: 0.8 };

    // ---------- state ----------
    const S = {
      clock: 0, mode: '', k: 0, kFrom: 0, sp: 1, gx: 1, phase: 'hold', ph0: 0, phDur: 2, beat: 'glance', beatN: 0,
      gag: null, gagN: 0, hit: null, look: null, shake: null, parts: [], tip: [0, 0], head: [0, 0], anc: { x: 0.3, y: 0.6 },
      lastGame: [-1.25, 0.95], snap: null, snapT: -9, base: null, w: 1, h: 1, rm: false
    };
    const BEATS = ['glance', 'mite', 'lunge', 'sneak', 'spark'];
    function newPhase(kind) {
      S.phase = kind; S.ph0 = S.clock;
      if (kind === 'live') { S.phDur = 2.5 + R() * 3.5; S.beat = BEATS[S.beatN++ % BEATS.length]; }
      else S.phDur = 1.5 + R() * 3.5;
    }

    // ---------- pose ----------
    const HELD = { bob: 0, sx: 1, sy: 1, lean: 0, turn: 0, head: 1, hs: -0.55, eyes: 0, brow: 0, mouth: 0, hatLift: 0, hatRot: 0.12, hatCrush: 0,
      staffA: 0.12, armUp: 0, armL: 0, spec: 0.08, jar: 0.15, gait: -1, face: 1, ex: -0.4, ey: 0, beard: 0, step: 0, orb: 0, blow: 0 };
    const KEYS = Object.keys(HELD);
    const copy = (p) => { const o = {}; for (const k of KEYS) o[k] = p[k]; return o; };
    function mix(a, b, k) { const o = {}; for (const kk of KEYS) o[kk] = (kk === 'face' ? (k < 0.5 ? a[kk] : b[kk]) : lerp(a[kk], b[kk], k)); return o; }

    // ---------- particles (screen-space, deterministic enough; never a full-frame flash) ----------
    function puff(x, y, n, sz, kind) {
      for (let i = 0; i < n; i++) {
        const a = R() * TAU, v = (0.4 + R()) * sz * 2.2;
        S.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - sz * 1.2, life: 0, max: 0.45 + R() * 0.35, r: sz * (0.05 + R() * 0.06), kind });
      }
    }
    function drawParts(ctx, dt, sz) {
      for (let i = S.parts.length - 1; i >= 0; i--) {
        const p = S.parts[i]; p.life += dt; if (p.life > p.max) { S.parts.splice(i, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt; p.vy += sz * 3 * dt; p.vx *= 0.96;
        const k = 1 - p.life / p.max, r = Math.max(0.6, p.r * (0.4 + 0.6 * k));
        ctx.fillStyle = p.kind === 'cob' ? (i % 3 ? COB : COB_L) : p.kind === 'wood' ? (i % 2 ? OAK_L : OAK) : p.kind === 'stone' ? LIME_D : IVORY;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, TAU); ctx.fill();
        if (p.kind !== 'dust') { ctx.strokeStyle = OUT; ctx.lineWidth = 0.8; ctx.stroke(); }
      }
    }

    // ================= drawing: the court =================
    function drawCourt(ctx, w, h, t, amb) {
      ctx.fillStyle = IVORY; ctx.fillRect(0, 0, w, h);
      // the wall
      ctx.fillStyle = LIME; ctx.beginPath(); quad(ctx, -60, 0, 60, 0, 60, 40, -60, 40, WALLZ); ctx.fill();
      // block courses
      ctx.strokeStyle = LIME_D; ctx.lineWidth = 1; ctx.beginPath();
      for (let y = 0.55; y < 16; y += 0.55) { P(-40, y, WALLZ); ctx.moveTo(PX, PY); P(40, y, WALLZ); ctx.lineTo(PX, PY); }
      for (let y = 0, r = 0; y < 16; y += 0.55, r++) for (let x = -12 + (r % 2) * 0.6; x < 12; x += 1.2) { P(x, y, WALLZ); ctx.moveTo(PX, PY); P(x, y + 0.55, WALLZ); ctx.lineTo(PX, PY); }
      ctx.globalAlpha = 0.45; ctx.stroke(); ctx.globalAlpha = 1;
      // brass ring ornaments
      ctx.strokeStyle = OUT; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const a of ORN) { P(0, 6, WALLZ); const s = PS; ctx.lineWidth = Math.max(2, s * 0.17); ctx.beginPath(); wpath(ctx, a, true); ctx.stroke(); ctx.strokeStyle = BRASS; ctx.lineWidth = Math.max(1, s * 0.11); ctx.stroke(); ctx.strokeStyle = OUT; }
      // portal: brass rim, dark interior, rings, the gold shaft
      ctx.lineWidth = 1.6;
      ctx.fillStyle = BRASS; ctx.beginPath(); wpath(ctx, ARCH_O, true); ctx.fill(); ctx.stroke();
      ctx.save(); ctx.beginPath(); wpath(ctx, ARCH, true); ctx.fillStyle = PORTAL; ctx.fill(); ctx.stroke(); ctx.clip();
      P(0, 2.9, WALLZ); const ps = PS;
      ctx.fillStyle = PORTAL_D; ctx.beginPath(); quad(ctx, -2, 0, 2, 0, 2, 0.5, -2, 0.5, WALLZ); ctx.fill();
      for (let i = 0; i < RINGS.length; i++) {
        ctx.beginPath(); wpath(ctx, RINGS[i], true);
        ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(1.5, ps * 0.09); ctx.stroke();
        ctx.strokeStyle = i % 2 ? BRASS_D : BRASS; ctx.lineWidth = Math.max(0.8, ps * 0.055); ctx.stroke();
      }
      // radial ticks
      ctx.strokeStyle = BRASS; ctx.lineWidth = Math.max(1, ps * 0.05); ctx.beginPath();
      for (let i = 0; i < 12; i++) { const q = i / 12 * TAU + 0.26; P(Math.cos(q) * 2.15, 2.9 + Math.sin(q) * 2.15, WALLZ); ctx.moveTo(PX, PY); P(Math.cos(q) * 2.6, 2.9 + Math.sin(q) * 2.6, WALLZ); ctx.lineTo(PX, PY); }
      ctx.stroke();
      // shaft
      ctx.fillStyle = '#f0c25e'; ctx.beginPath(); quad(ctx, -0.2, 0, 0.2, 0, 0.2, 5.8, -0.2, 5.8, WALLZ); ctx.fill();
      ctx.fillStyle = FLAME_C; ctx.beginPath(); quad(ctx, -0.07, 0, 0.07, 0, 0.07, 5.8, -0.07, 5.8, WALLZ); ctx.fill();
      // motes drifting up the shaft (tiny, steady)
      ctx.fillStyle = FLAME_C;
      for (const m of MOTES) { const y = ((m.ph + t * m.sp) % 1) * 5.4; P(m.x * 1.6, y, WALLZ + 0.05); ctx.beginPath(); ctx.arc(PX, PY, Math.max(0.6, m.r * PS), 0, TAU); ctx.fill(); }
      ctx.restore();
      // the jewel at the crown of the portal
      P(0, 5.25, WALLZ + 0.05); ctx.fillStyle = '#d4504a'; ctx.strokeStyle = OUT; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(PX, PY, Math.max(2, PS * 0.26), 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f2a08a'; ctx.beginPath(); ctx.arc(PX - PS * 0.07, PY - PS * 0.08, Math.max(0.8, PS * 0.08), 0, TAU); ctx.fill();
      // the grown buttresses leaning in to the portal, ivory knobs along their spines
      for (const s of [-1, 1]) {
        const z = -3.7;
        ctx.fillStyle = LIME_L; ctx.strokeStyle = OUT; ctx.lineWidth = 1.6;
        ctx.beginPath(); quad(ctx, s * 4.15, 0, s * 5.1, 0, s * 1.85, 11, s * 0.95, 11, z); ctx.fill(); ctx.stroke();
        ctx.fillStyle = LIME_LL; ctx.beginPath(); quad(ctx, s * 4.15, 0, s * 4.45, 0, s * 1.25, 11, s * 0.95, 11, z); ctx.fill();
        for (let i = 1; i < 5; i++) {
          const u = i / 5.2; P(lerp(s * 4.15, s * 0.95, u) - s * 0.05, 11 * u, z + 0.05);
          ctx.fillStyle = LIME_LL; ctx.beginPath(); ctx.arc(PX, PY, Math.max(1.5, PS * 0.17), 0, TAU); ctx.fill(); ctx.stroke();
        }
      }
      // columns with brass rings
      for (const x of COLX) {
        const hw = 0.5;
        ctx.fillStyle = LIME_L; ctx.strokeStyle = OUT; ctx.lineWidth = 1.6;
        ctx.beginPath(); quad(ctx, x - hw, 0, x + hw, 0, x + hw, 30, x - hw, 30, COLZ); ctx.fill();
        ctx.fillStyle = LIME_D; ctx.beginPath(); quad(ctx, x + hw * 0.35, 0, x + hw, 0, x + hw, 30, x + hw * 0.35, 30, COLZ); ctx.fill();
        ctx.beginPath(); quad(ctx, x - hw, 0, x + hw, 0, x + hw, 30, x - hw, 30, COLZ); ctx.stroke();
        ctx.fillStyle = LIME_D; ctx.beginPath(); quad(ctx, x - hw - 0.12, 0, x + hw + 0.12, 0, x + hw + 0.12, 0.4, x - hw - 0.12, 0.4, COLZ + 0.05); ctx.fill(); ctx.stroke();
        for (const ry of [1.55, 5.2]) { ctx.fillStyle = BRASS; ctx.beginPath(); quad(ctx, x - hw - 0.08, ry, x + hw + 0.08, ry, x + hw + 0.08, ry + 0.17, x - hw - 0.08, ry + 0.17, COLZ + 0.05); ctx.fill(); ctx.stroke(); }
      }
      // the court floor
      const nz = CAM.camZ - 0.8;
      ctx.fillStyle = IVORY; ctx.beginPath(); P(-60, 0, WALLZ); ctx.moveTo(PX, PY); P(60, 0, WALLZ); ctx.lineTo(PX, PY); P(60, 0, nz); ctx.lineTo(PX, PY); P(-60, 0, nz); ctx.lineTo(PX, PY); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = OUT; ctx.lineWidth = 1.6; ctx.beginPath(); P(-60, 0, WALLZ); ctx.moveTo(PX, PY); P(60, 0, WALLZ); ctx.lineTo(PX, PY); ctx.stroke();
      ctx.strokeStyle = TILE; ctx.lineWidth = 1; ctx.beginPath();
      for (let z = WALLZ + 0.9; z < nz; z += 0.9) { P(-30, 0, z); ctx.moveTo(PX, PY); P(30, 0, z); ctx.lineTo(PX, PY); }
      for (let x = -12.6; x <= 12.6; x += 1.4) { P(x, 0, WALLZ); ctx.moveTo(PX, PY); P(x, 0, nz); ctx.lineTo(PX, PY); }
      ctx.stroke();
      // the processional path: indigo bands, a brass inlay
      for (const s of [-1, 1]) {
        ctx.fillStyle = INDIGO; ctx.beginPath(); P(s * 2.55, 0, WALLZ); ctx.moveTo(PX, PY); P(s * 2.72, 0, WALLZ); ctx.lineTo(PX, PY); P(s * 2.72, 0, nz); ctx.lineTo(PX, PY); P(s * 2.55, 0, nz); ctx.lineTo(PX, PY); ctx.closePath(); ctx.fill();
        ctx.fillStyle = BRASS; ctx.beginPath(); P(s * 2.38, 0, WALLZ); ctx.moveTo(PX, PY); P(s * 2.44, 0, WALLZ); ctx.lineTo(PX, PY); P(s * 2.44, 0, nz); ctx.lineTo(PX, PY); P(s * 2.38, 0, nz); ctx.lineTo(PX, PY); ctx.closePath(); ctx.fill();
      }
      // indigo rosettes set into the floor
      ctx.fillStyle = '#aaa4cc'; ctx.strokeStyle = INDIGO_L; ctx.lineWidth = 1;
      for (const [x, z] of [[-4.6, -1.4], [4.6, -1.4], [-4.0, 1.6], [4.0, 1.6], [-7.5, 0.2], [7.5, 0.2], [0, 2.6]]) {
        P(x, 0, z - 0.2); const y0 = PY; P(x, 0, z + 0.2); const y1 = PY, cx = PX;
        ctx.beginPath(); ctx.ellipse(cx, (y0 + y1) / 2, Math.max(1, PS * 0.3), Math.max(0.5, Math.abs(y1 - y0) / 2), 0, 0, TAU); ctx.fill(); ctx.stroke();
      }
    }

    // flat ring on the floor (the game's player rings, the gold hold circle)
    function floorRing(ctx, x, z, r, col, lw, fill) {
      P(x, 0, z - r); const y0 = PY; P(x, 0, z + r); const y1 = PY, cx = PX, rx = r * PS;
      const ry = Math.max(0.5, Math.abs(y1 - y0) / 2);
      ctx.beginPath(); ctx.ellipse(cx, (y0 + y1) / 2, Math.max(0.5, rx), ry, 0, 0, TAU);
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (col) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke(); }
    }

    // ================= drawing: the Custodian of Lesser Miracles =================
    function drawSnail(ctx, C, lw, t) {
      ctx.lineWidth = lw; ctx.strokeStyle = OUT; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      const rc = C.recoil;
      // velvet dais with brass hem and drops
      ctx.fillStyle = INDIGO_D; ctx.beginPath(); ctx.ellipse(0, -0.08, 2.1, 0.24, 0, 0, PI); ctx.lineTo(-2.1, -0.3); ctx.ellipse(0, -0.3, 2.1, 0.24, 0, PI, 0, true); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INDIGO_L; ctx.beginPath(); ctx.ellipse(0, -0.3, 2.1, 0.24, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = BRASS; ctx.lineWidth = lw * 2.4; ctx.beginPath(); ctx.ellipse(0, -0.09, 2.08, 0.23, 0, 0.12, PI - 0.12); ctx.stroke();
      ctx.strokeStyle = OUT; ctx.lineWidth = lw;
      ctx.fillStyle = BRASS;
      for (let i = 1; i < 12; i++) { const q = i / 12 * PI; const x = Math.cos(q) * 2.06, y = -0.08 + Math.sin(q) * 0.23; ctx.beginPath(); ctx.ellipse(x, y + 0.05, 0.045, 0.07, 0, 0, TAU); ctx.fill(); ctx.stroke(); }
      ctx.save(); ctx.translate(-rc * 0.18, -C.breathe * 0.03);
      // brass sun-mask behind the head
      ctx.save(); ctx.translate(1.78, -1.62); ctx.rotate(-0.2 - rc * 0.35);
      ctx.fillStyle = BRASS; ctx.beginPath(); ctx.arc(0, 0, 0.72, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = BRASS_D; ctx.beginPath(); for (let i = -3; i <= 3; i++) { ctx.moveTo(i * 0.18, -0.62); ctx.lineTo(i * 0.18 + 0.05, 0.62 - Math.abs(i) * 0.06); } ctx.globalAlpha = 0.5; ctx.stroke(); ctx.globalAlpha = 1;
      ctx.strokeStyle = OUT; ctx.fillStyle = BRASS_L; ctx.beginPath(); ctx.arc(0.05, 0.02, 0.5, -1.2, 1.9); ctx.quadraticCurveTo(-0.3, 0, 0.05, -0.48); ctx.fill(); ctx.stroke();
      ctx.restore();
      // eye stalks
      const stalk = (bx, by, len, a, side) => {
        const tx = bx + Math.sin(a) * len, ty = by - Math.cos(a) * len;
        ctx.strokeStyle = OUT; ctx.lineWidth = 0.2 + lw * 2; ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + Math.sin(a) * len * 0.3 + side * 0.12, by - len * 0.55, tx, ty); ctx.stroke();
        ctx.strokeStyle = SNB; ctx.lineWidth = 0.2; ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = lw;
        const er = 0.2 + C.wide * 0.06;
        ctx.fillStyle = IVORY; ctx.beginPath(); ctx.arc(tx, ty, er, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = BRASS; ctx.lineWidth = lw * 2.2; ctx.beginPath(); ctx.arc(tx, ty, er * 0.98, 0.3, 2.8); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = lw;
        const sq = C.squint;
        ctx.fillStyle = OUT; ctx.beginPath(); ctx.ellipse(tx + C.lx * er * 0.45, ty + C.ly * er * 0.4, er * 0.32, er * 0.32 * (1 - sq * 0.75), 0, 0, TAU); ctx.fill();
        if (sq > 0.05) { ctx.fillStyle = SNB; ctx.beginPath(); ctx.ellipse(tx, ty - er * (1 - sq * 0.5), er * 1.05, er * sq * 0.9, 0, 0, TAU); ctx.fill(); ctx.stroke(); }
        return [tx, ty];
      };
      const sl = 1.25 * (1 - rc * 0.55);
      // body: the long foot and the rising neck
      ctx.fillStyle = SNB; ctx.beginPath();
      ctx.moveTo(-1.95, -0.3); ctx.quadraticCurveTo(-1.95, -0.66, -1.25, -0.7); ctx.quadraticCurveTo(-0.1, -1.5, 0.85, -0.98);
      ctx.bezierCurveTo(1.0, -0.95, 0.95, -1.55, 1.25, -1.72); ctx.bezierCurveTo(1.55, -1.88, 1.95, -1.6, 1.86, -1.2);
      ctx.bezierCurveTo(1.8, -0.85, 1.85, -0.5, 2.0, -0.3); ctx.closePath(); ctx.fill();
      ctx.save(); ctx.clip(); ctx.fillStyle = SNB_D; ctx.beginPath();
      for (let i = 0; i < SPECK.length; i += 3) { ctx.moveTo(SPECK[i] + SPECK[i + 2], SPECK[i + 1]); ctx.arc(SPECK[i], SPECK[i + 1], SPECK[i + 2], 0, TAU); }
      ctx.fill(); ctx.restore(); ctx.stroke();
      stalk(1.32, -1.7, sl * 0.95, -0.28 + C.ea + 0.1, -1);
      const eR = stalk(1.62, -1.62, sl, 0.18 + C.ea, 1);
      // face on the head: a sleepy brass-lidded eye line and a small mouth
      ctx.fillStyle = SNB_D; ctx.beginPath(); ctx.ellipse(1.72, -1.05, 0.08, 0.04 + C.mouth * 0.06, 0.2, 0, TAU); ctx.fill(); ctx.stroke();
      // the shell: a coiled reliquary
      ctx.save(); ctx.translate(-0.2, -2.2 - C.breathe * 0.04 - rc * 0.1); ctx.rotate(-rc * 0.08 + C.wob * 0.05); ctx.scale(1.2, 1.2);
      // base (the shadowed hollows between whorls)
      ctx.fillStyle = SHELL_D; ctx.beginPath(); wloop(ctx, SP.base); ctx.fill(); ctx.stroke();
      // the tube, its highlight and the brass ribs
      ctx.fillStyle = SHELL; ctx.beginPath(); wloop(ctx, SP.tube); ctx.fill(); ctx.stroke();
      ctx.fillStyle = SHELL_L; ctx.beginPath(); wloop(ctx, SP.hl); ctx.fill();
      ctx.beginPath(); for (let i = 0; i < SP.ribs.length; i += 4) { ctx.moveTo(SP.ribs[i], SP.ribs[i + 1]); ctx.lineTo(SP.ribs[i + 2], SP.ribs[i + 3]); }
      ctx.lineWidth = lw * 4.4; ctx.stroke(); ctx.strokeStyle = BRASS; ctx.lineWidth = lw * 2.4; ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = lw;
      // the aperture's flared lip
      ctx.fillStyle = SHELL_D; ctx.beginPath(); ctx.ellipse(SP.lip[0] + 0.02, SP.lip[1], 0.12, SP.lip[2] * 1.05, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#6b4038'; ctx.beginPath(); ctx.ellipse(SP.lip[0] + 0.04, SP.lip[1], 0.06, SP.lip[2] * 0.78, 0, 0, TAU); ctx.fill();
      // lancet windows of jewel glass, black leading
      const win = (x, y, s, col) => {
        ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - 0.07 * s, y + 0.1 * s); ctx.lineTo(x - 0.07 * s, y - 0.04 * s); ctx.quadraticCurveTo(x - 0.07 * s, y - 0.13 * s, x, y - 0.17 * s); ctx.quadraticCurveTo(x + 0.07 * s, y - 0.13 * s, x + 0.07 * s, y - 0.04 * s); ctx.lineTo(x + 0.07 * s, y + 0.1 * s); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y - 0.17 * s); ctx.lineTo(x, y + 0.1 * s); ctx.moveTo(x - 0.07 * s, y - 0.01 * s); ctx.lineTo(x + 0.07 * s, y - 0.01 * s); ctx.stroke();
      };
      for (let i = 0; i < SP.wins.length; i += 3) win(SP.wins[i], SP.wins[i + 1], SP.wins[i + 2] * (i === 6 ? 0.8 : 1), i === 6 ? '#3f9a6a' : AMBER);
      // a clock in the coil's eye
      const ckx = SP.eye[0], cky = SP.eye[1];
      ctx.fillStyle = BRASS; ctx.beginPath(); ctx.arc(ckx, cky, 0.27, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = IVORY; ctx.beginPath(); ctx.arc(ckx, cky, 0.21, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.beginPath(); for (let i = 0; i < 12; i++) { const q = i / 12 * TAU; ctx.moveTo(ckx + Math.cos(q) * 0.15, cky + Math.sin(q) * 0.15); ctx.lineTo(ckx + Math.cos(q) * 0.19, cky + Math.sin(q) * 0.19); } ctx.stroke();
      const hq = t * 0.05 + 2.2; ctx.lineWidth = lw * 1.4; ctx.beginPath(); ctx.moveTo(ckx, cky); ctx.lineTo(ckx + Math.cos(hq) * 0.12, cky + Math.sin(hq) * 0.12); ctx.moveTo(ckx, cky); ctx.lineTo(ckx + Math.cos(hq * 12) * 0.17, cky + Math.sin(hq * 12) * 0.17); ctx.stroke(); ctx.lineWidth = lw;
      // the little cathedral on its back
      ctx.save(); ctx.translate(SP.top[0], SP.top[1] + 0.12); ctx.scale(0.68, 0.68);
      // side spires with jewel finials
      const spire = (x, y0, hgt, wd, jew) => {
        ctx.fillStyle = SHELL_L; ctx.beginPath(); ctx.moveTo(x - wd, y0); ctx.quadraticCurveTo(x - wd * 0.6, y0 - hgt * 0.6, x, y0 - hgt); ctx.quadraticCurveTo(x + wd * 0.6, y0 - hgt * 0.6, x + wd, y0); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = BRASS; ctx.lineWidth = lw * 1.8; ctx.beginPath(); ctx.moveTo(x - wd * 0.8, y0 - hgt * 0.25); ctx.lineTo(x + wd * 0.8, y0 - hgt * 0.25); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = lw;
        if (jew) { ctx.fillStyle = jew; ctx.beginPath(); ctx.moveTo(x, y0 - hgt - 0.13); ctx.lineTo(x + 0.07, y0 - hgt - 0.04); ctx.lineTo(x, y0 - hgt + 0.04); ctx.lineTo(x - 0.07, y0 - hgt - 0.04); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      };
      spire(-0.88, 0.3, 1.05, 0.13, '#3f6fe0'); spire(0.82, 0.2, 0.95, 0.12, '#2f9a62'); spire(-1.15, 0.55, 0.62, 0.09, '#e6a53c');
      // drum with parabolic arches
      ctx.fillStyle = SHELL_L; ctx.beginPath(); ctx.moveTo(-0.5, 0.05); ctx.lineTo(-0.44, -0.62); ctx.lineTo(0.44, -0.62); ctx.lineTo(0.5, 0.05); ctx.closePath(); ctx.fill(); ctx.stroke();
      for (let i = -1; i <= 1; i++) {
        const x = i * 0.27, wd = 0.1, top = -0.5, bot = -0.04;
        ctx.fillStyle = PORTAL; ctx.beginPath(); ctx.moveTo(x - wd, bot); ctx.quadraticCurveTo(x - wd, top + 0.02, x, top); ctx.quadraticCurveTo(x + wd, top + 0.02, x + wd, bot); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      // the miracle, hoarded in the middle arch
      if (C.orbIn > 0.01) {
        const r = 0.085 * C.orbIn;
        ctx.fillStyle = 'rgba(255,214,120,0.35)'; ctx.beginPath(); ctx.arc(0, -0.2, r * 1.9, 0, TAU); ctx.fill();
        ctx.fillStyle = '#ffe39a'; ctx.beginPath(); ctx.arc(0, -0.2, r, 0, TAU); ctx.fill();
        ctx.fillStyle = '#fffaf0'; ctx.beginPath(); ctx.arc(-r * 0.25, -0.2 - r * 0.25, r * 0.45, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = TEAL; ctx.beginPath(); ctx.ellipse(0, -0.64, 0.5, 0.08, 0, 0, TAU); ctx.fill(); ctx.stroke();
      // central spire with a brass ball
      ctx.fillStyle = SHELL; ctx.beginPath(); ctx.moveTo(-0.3, -0.68); ctx.quadraticCurveTo(-0.16, -1.4, 0.0, -2.0); ctx.quadraticCurveTo(0.16, -1.4, 0.3, -0.68); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = SHELL_L; ctx.beginPath(); ctx.moveTo(-0.2, -0.7); ctx.quadraticCurveTo(-0.1, -1.4, 0.0, -1.98); ctx.lineTo(-0.05, -0.7); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = BRASS; ctx.lineWidth = lw * 2.2; ctx.beginPath(); ctx.moveTo(-0.24, -0.92); ctx.lineTo(0.24, -0.92); ctx.moveTo(-0.15, -1.3); ctx.lineTo(0.15, -1.3); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = lw;
      ctx.fillStyle = BRASS; ctx.beginPath(); ctx.arc(0, -2.05, 0.07, 0, TAU); ctx.fill(); ctx.stroke();
      // candles on the rim, flames that flicker
      const candle = (x, y, hh, i) => {
        ctx.fillStyle = '#f6efdc'; ctx.beginPath(); ctx.rect(x - 0.045, y - hh, 0.09, hh); ctx.fill(); ctx.stroke();
        const fl = 0.85 + 0.15 * Math.sin(t * 9 + i * 2.1) * C.flick, lean = Math.sin(t * 5.3 + i) * 0.03 * C.flick + C.flameLean;
        ctx.fillStyle = FLAME; ctx.beginPath(); ctx.moveTo(x - 0.045, y - hh - 0.02); ctx.quadraticCurveTo(x - 0.05, y - hh - 0.1 * fl, x + lean, y - hh - 0.2 * fl); ctx.quadraticCurveTo(x + 0.05, y - hh - 0.1 * fl, x + 0.045, y - hh - 0.02); ctx.closePath(); ctx.fill(); ctx.stroke();
      };
      candle(-0.62, 0.12, 0.26, 0); candle(-0.5, 0.06, 0.36, 1); candle(0.54, 0.06, 0.32, 2); candle(0.66, 0.14, 0.22, 3); candle(1.0, 0.28, 0.3, 4);
      ctx.restore();
      ctx.restore(); // shell
      ctx.restore(); // recoil
      return eR;
    }

    // ================= drawing: Pim =================
    function limb(ctx, x0, y0, x1, y1, wd, col, lw) {
      ctx.lineCap = 'round'; ctx.strokeStyle = OUT; ctx.lineWidth = wd + lw * 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = lw;
    }
    function drawPim(ctx, p, lw, t, withOrb) {
      ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = OUT; ctx.lineWidth = lw;
      ctx.save(); ctx.scale(p.face, 1); ctx.translate(0, -p.bob); ctx.rotate(p.lean); ctx.scale(p.sx, p.sy);
      const front = p.turn >= 0.5, g = p.gait;
      // the staff hand
      const sa = p.staffA, hx = 0.25 - p.armUp * 0.08, hy = -0.32 - p.armUp * 0.62;
      const dx = Math.sin(sa), dy = -Math.cos(sa);
      const sb = [hx - dx * 0.36, hy - dy * 0.36], st = [hx + dx * 0.66, hy + dy * 0.66];
      const jar = () => {
        const jx = front ? -0.15 : 0, jy = front ? -0.66 : -0.46, s = front ? 0.8 : 1;
        ctx.fillStyle = 'rgba(188,214,236,0.92)'; ctx.beginPath(); ctx.moveTo(jx - 0.11 * s, jy - 0.13 * s); ctx.lineTo(jx - 0.12 * s, jy + 0.13 * s); ctx.quadraticCurveTo(jx, jy + 0.18 * s, jx + 0.12 * s, jy + 0.13 * s); ctx.lineTo(jx + 0.11 * s, jy - 0.13 * s); ctx.closePath(); ctx.fill(); ctx.stroke();
        const gl = p.jar;
        ctx.fillStyle = COB; ctx.beginPath();
        for (let i = 0; i < 4; i++) { const a = t * (1.5 + i * 0.4) * (0.3 + gl) + i * 1.7; ctx.moveTo(jx + Math.cos(a) * 0.05 * s + 0.035 * s, jy + Math.sin(a * 1.3) * 0.07 * s); ctx.arc(jx + Math.cos(a) * 0.05 * s, jy + Math.sin(a * 1.3) * 0.07 * s, (0.025 + gl * 0.02) * s, 0, TAU); }
        ctx.fill();
        if (gl > 0.3) { ctx.fillStyle = COB_W; ctx.beginPath(); ctx.arc(jx, jy, 0.03 * s * gl, 0, TAU); ctx.fill(); }
        ctx.fillStyle = BRASS; ctx.beginPath(); ctx.rect(jx - 0.12 * s, jy - 0.19 * s, 0.24 * s, 0.07 * s); ctx.fill(); ctx.stroke();
      };
      if (front) jar();
      // legs and boots
      const l1 = g >= 0 ? Math.sin(g) : 0, lift1 = g >= 0 ? Math.max(0, Math.sin(g)) * 0.07 : 0, lift2 = g >= 0 ? Math.max(0, -Math.sin(g)) * 0.07 : 0;
      const st1 = p.step;
      limb(ctx, -0.08, -0.16, -0.09 - l1 * 0.06 - st1 * 0.04, -0.05 - lift1, 0.09, '#3a3350', lw);
      limb(ctx, 0.08, -0.16, 0.09 + l1 * 0.06 + st1 * 0.06, -0.05 - lift2 - st1 * 0.06, 0.09, '#3a3350', lw);
      ctx.fillStyle = '#5a3a22';
      ctx.beginPath(); ctx.ellipse(-0.1 - l1 * 0.06 - st1 * 0.04, -0.035 - lift1, 0.085, 0.05, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0.11 + l1 * 0.06 + st1 * 0.06, -0.035 - lift2 - st1 * 0.06, 0.085, 0.05, 0, 0, TAU); ctx.fill(); ctx.stroke();
      // left arm behind (back view: towards the snail)
      const lax = -0.25 + p.armL * 0.06 * p.armUp, lay = -0.3 - p.armL * (0.46 + 0.16 * p.armUp);
      if (!front) limb(ctx, -0.16, -0.46, lax, lay, 0.1, '#2f4a90', lw);
      // the coat: a barrel with a flared hem
      ctx.fillStyle = '#3e5fae';
      ctx.beginPath(); ctx.moveTo(-0.2, -0.3); ctx.quadraticCurveTo(-0.27, -0.14, -0.25, -0.1); ctx.quadraticCurveTo(0, -0.05, 0.25, -0.1); ctx.quadraticCurveTo(0.27, -0.14, 0.2, -0.3); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, -0.35, 0.225, 0.24, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#2f4a90'; ctx.beginPath(); ctx.ellipse(0.1, -0.33, 0.1, 0.2, 0, -1.3, 1.3); ctx.fill();
      if (front) {
        // cobalt damask lining, brass buttons, belt, the empty glass bell
        ctx.fillStyle = '#244bb8'; ctx.beginPath(); ctx.moveTo(0.0, -0.56); ctx.lineTo(0.06, -0.12); ctx.lineTo(-0.02, -0.12); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = BRASS; for (const y of [-0.48, -0.4]) { ctx.beginPath(); ctx.arc(-0.06, y, 0.022, 0, TAU); ctx.fill(); ctx.stroke(); }
      } else {
        ctx.beginPath(); ctx.moveTo(0, -0.5); ctx.lineTo(0, -0.12); ctx.stroke();
      }
      ctx.fillStyle = '#5a3a22'; ctx.beginPath(); ctx.rect(-0.215, -0.27, 0.43, 0.05); ctx.fill(); ctx.stroke();
      if (front) { ctx.fillStyle = BRASS; ctx.beginPath(); ctx.rect(-0.035, -0.28, 0.07, 0.07); ctx.fill(); ctx.stroke(); }
      ctx.fillStyle = 'rgba(220,236,240,0.9)'; ctx.beginPath(); ctx.moveTo(-0.2, -0.22); ctx.quadraticCurveTo(-0.27, -0.2, -0.27, -0.1); ctx.lineTo(-0.15, -0.1); ctx.quadraticCurveTo(-0.15, -0.2, -0.2, -0.22); ctx.fill(); ctx.stroke();
      if (!front) jar();
      if (front) limb(ctx, -0.16, -0.46, lax, lay, 0.1, '#3e5fae', lw);
      ctx.fillStyle = '#f2b892'; ctx.beginPath(); ctx.arc(lax, lay, 0.045, 0, TAU); ctx.fill(); ctx.stroke();
      // staff
      limb(ctx, sb[0], sb[1], st[0], st[1], 0.05, '#8a5a2e', lw);
      ctx.save(); ctx.translate(st[0], st[1]); ctx.rotate(sa);
      ctx.strokeStyle = OUT; ctx.lineWidth = 0.035 + lw * 2; ctx.beginPath(); ctx.arc(0, -0.07, 0.07, 0.2, PI - 0.2, true); ctx.stroke();
      ctx.strokeStyle = BRASS; ctx.lineWidth = 0.035; ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = lw;
      const br = 0.045 + p.jar * 0.02;
      ctx.fillStyle = COB; ctx.beginPath(); ctx.arc(0, -0.08, br, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = COB_W; ctx.beginPath(); ctx.arc(-0.012, -0.092, br * 0.4, 0, TAU); ctx.fill();
      ctx.restore();
      S.tipL = [st[0] + dx * 0.08, st[1] + dy * 0.08];
      // right arm and hand on the staff
      limb(ctx, 0.15, -0.47, hx, hy, 0.1, front ? '#3e5fae' : '#2f4a90', lw);
      ctx.fillStyle = '#f2b892'; ctx.beginPath(); ctx.arc(hx, hy, 0.048, 0, TAU); ctx.fill(); ctx.stroke();
      // head
      ctx.save(); ctx.translate(0, -0.66);
      const hs = p.hs, fx = hs * 0.055, faceOn = p.head >= 0.5;
      ctx.fillStyle = '#f2b892';
      ctx.beginPath(); ctx.ellipse(-0.155 + fx * 0.3, 0.0, 0.06, 0.075, -0.4, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0.155 + fx * 0.3, 0.0, 0.06, 0.075, 0.4, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 0.145, 0, TAU); ctx.fill(); ctx.stroke();
      if (!faceOn) {
        ctx.fillStyle = '#e2772b'; ctx.beginPath(); ctx.ellipse(0, -0.02, 0.152, 0.14, 0, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#d06a24'; ctx.beginPath(); ctx.moveTo(-0.13, 0.04); ctx.quadraticCurveTo(-0.15, 0.13, -0.08, 0.15); ctx.lineTo(-0.1, 0.05); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0.13, 0.04); ctx.quadraticCurveTo(0.15, 0.13, 0.08, 0.15); ctx.lineTo(0.1, 0.05); ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        // beard (puffs on a startle)
        const bp = 1 + p.beard * 0.25;
        ctx.fillStyle = '#e07028'; ctx.beginPath();
        ctx.moveTo(-0.14 + fx * 0.4, 0.0); ctx.quadraticCurveTo(-0.16 * bp + fx, 0.17 * bp, fx * 1.2, 0.22 * bp); ctx.quadraticCurveTo(0.16 * bp + fx, 0.17 * bp, 0.14 + fx * 0.4, 0.0);
        ctx.quadraticCurveTo(fx, 0.06, -0.14 + fx * 0.4, 0.0); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#b8561c'; ctx.beginPath(); ctx.moveTo(fx - 0.05, 0.1); ctx.lineTo(fx - 0.04, 0.16); ctx.moveTo(fx + 0.05, 0.1); ctx.lineTo(fx + 0.05, 0.16); ctx.stroke(); ctx.strokeStyle = OUT;
        // mouth
        ctx.fillStyle = '#5a2418';
        if (p.mouth > 0.15) { ctx.beginPath(); ctx.ellipse(fx * 1.1, 0.09, 0.03 + p.mouth * 0.02, 0.025 + p.mouth * 0.045, 0, 0, TAU); ctx.fill(); ctx.stroke(); }
        else if (p.mouth < -0.15) { ctx.beginPath(); ctx.moveTo(fx - 0.05, 0.085); ctx.lineTo(fx - 0.02, 0.075); ctx.lineTo(fx + 0.01, 0.09); ctx.lineTo(fx + 0.05, 0.078); ctx.stroke(); }
        else { ctx.beginPath(); ctx.moveTo(fx - 0.035, 0.08); ctx.quadraticCurveTo(fx, 0.095, fx + 0.04, 0.078); ctx.stroke(); }
        if (p.blow > 0.1) { ctx.fillStyle = '#5a2418'; ctx.beginPath(); ctx.arc(fx * 1.2 + 0.02, 0.085, 0.022, 0, TAU); ctx.fill(); }
        // nose
        ctx.fillStyle = '#e59a76'; ctx.beginPath(); ctx.ellipse(fx * 1.25, 0.02, 0.04, 0.034, 0, 0, TAU); ctx.fill(); ctx.stroke();
        // eyes behind spectacles, pupils that follow
        const wide = p.eyes;
        for (const s of [-1, 1]) {
          const ex = fx + s * 0.062, ey = -0.035;
          if (wide > 0.2) { ctx.fillStyle = '#fffaf0'; ctx.beginPath(); ctx.arc(ex, ey, 0.024 + wide * 0.016, 0, TAU); ctx.fill(); }
          ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(ex + p.ex * 0.012, ey + p.ey * 0.01, 0.016 - wide * 0.004, 0, TAU); ctx.fill();
        }
        ctx.save(); ctx.translate(fx, -0.035); ctx.rotate(p.spec);
        ctx.strokeStyle = BRASS_D; ctx.lineWidth = lw * 1.3;
        ctx.beginPath(); ctx.arc(-0.062, 0, 0.045, 0, TAU); ctx.moveTo(0.107, 0); ctx.arc(0.062, 0, 0.045, 0, TAU); ctx.moveTo(-0.017, 0); ctx.lineTo(0.017, 0); ctx.stroke();
        ctx.restore(); ctx.strokeStyle = OUT; ctx.lineWidth = lw;
        // brows
        const bw = p.brow;
        ctx.lineWidth = lw * 1.6; ctx.strokeStyle = '#b8561c'; ctx.beginPath();
        ctx.moveTo(fx - 0.1, -0.1 - bw * 0.025 - Math.max(0, -bw) * -0.01); ctx.lineTo(fx - 0.03, -0.1 - bw * 0.02 + Math.max(0, -bw) * 0.03);
        ctx.moveTo(fx + 0.03, -0.1 - bw * 0.02 + Math.max(0, -bw) * 0.03); ctx.lineTo(fx + 0.1, -0.1 - bw * 0.025);
        ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = lw;
        // ginger mop on top
        ctx.fillStyle = '#e2772b'; ctx.beginPath(); ctx.ellipse(fx * 0.4, -0.115, 0.15, 0.06, 0, PI, TAU); ctx.lineTo(0.15, -0.09); ctx.quadraticCurveTo(0.17, -0.02, 0.135, 0.0); ctx.lineTo(0.12, -0.08); ctx.lineTo(-0.12, -0.08); ctx.lineTo(-0.135, 0.0); ctx.quadraticCurveTo(-0.17, -0.02, -0.15, -0.09); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      S.headL = [0, -0.66];
      // the crooked hat
      ctx.save(); ctx.translate(p.hatLift * 0.15 * Math.sin(p.hatRot * 3), -0.12 - p.hatLift); ctx.rotate(p.hatRot); ctx.scale(1, 1 - p.hatCrush * 0.55);
      const cr = p.hatCrush;
      ctx.fillStyle = '#22306a'; ctx.beginPath(); ctx.ellipse(0, 0, 0.27, 0.06, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#2b3d82'; ctx.beginPath(); ctx.moveTo(-0.15, 0.0);
      ctx.quadraticCurveTo(-0.1, -0.3, 0.0 + cr * 0.05, -0.44 + cr * 0.12);
      ctx.quadraticCurveTo(0.12 + cr * 0.1, -0.52 + cr * 0.2, 0.24 + cr * 0.12, -0.43 + cr * 0.3);
      ctx.quadraticCurveTo(0.1, -0.4 + cr * 0.1, 0.08, -0.3 + cr * 0.05);
      ctx.quadraticCurveTo(0.12, -0.12, 0.15, 0.0); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#3a52a8'; ctx.beginPath(); ctx.moveTo(-0.1, -0.02); ctx.quadraticCurveTo(-0.06, -0.28, -0.0, -0.4 + cr * 0.12); ctx.lineTo(-0.05, -0.02); ctx.closePath(); ctx.fill();
      ctx.fillStyle = BRASS; ctx.beginPath(); ctx.moveTo(-0.15, -0.0); ctx.lineTo(0.15, 0.0); ctx.lineTo(0.135, -0.065); ctx.lineTo(-0.135, -0.065); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffe39a'; ctx.beginPath(); ctx.arc(0.02, -0.033, 0.02, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.restore();
      ctx.restore();
      // the held miracle, overhead, in both hands
      if (withOrb) {
        const ox = (lax + hx) / 2, oy = Math.min(lay, hy) - 0.2;
        ctx.fillStyle = 'rgba(255,214,120,0.32)'; ctx.beginPath(); ctx.arc(ox, oy, 0.26, 0, TAU); ctx.fill();
        ctx.fillStyle = '#ffe39a'; ctx.beginPath(); ctx.arc(ox, oy, 0.16, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fffaf0'; ctx.beginPath(); ctx.arc(ox - 0.045, oy - 0.05, 0.065, 0, TAU); ctx.fill();
        ctx.fillStyle = '#f2b892'; ctx.beginPath(); ctx.arc(lax, lay, 0.045, 0, TAU); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(hx, hy, 0.048, 0, TAU); ctx.fill(); ctx.stroke();
      }
      ctx.restore();
    }

    // ================= the other three: simpler silhouettes, seen from behind =================
    function drawVesna(ctx, v, lw, t) {
      ctx.lineJoin = 'round'; ctx.strokeStyle = OUT; ctx.lineWidth = lw;
      ctx.save(); ctx.translate(0, -v.bob); ctx.rotate(v.lean); ctx.scale(v.sx, v.sy);
      // staff with the Lesk weathervane
      limb(ctx, 0.25, 0.0, 0.27, -1.5, 0.035, '#3a3640', lw);
      ctx.save(); ctx.translate(0.27, -1.52); ctx.scale(Math.cos(v.vane), 1);
      ctx.fillStyle = '#5f9a74'; ctx.beginPath();
      ctx.moveTo(-0.16, 0.02); ctx.lineTo(0.17, 0.02); ctx.lineTo(0.13, -0.02); ctx.moveTo(0.17, 0.02); ctx.lineTo(0.13, 0.06); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-0.1, -0.02); ctx.quadraticCurveTo(-0.14, -0.14, -0.08, -0.2); ctx.lineTo(-0.04, -0.12); ctx.lineTo(0.04, -0.12); ctx.quadraticCurveTo(0.06, -0.22, 0.1, -0.24); ctx.quadraticCurveTo(0.14, -0.2, 0.11, -0.16); ctx.lineTo(0.13, -0.12); ctx.lineTo(0.09, -0.11); ctx.quadraticCurveTo(0.1, -0.02, 0.02, -0.02); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = '#3a3640'; ctx.beginPath(); ctx.ellipse(-0.06, -0.03, 0.06, 0.04, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0.07, -0.03, 0.06, 0.04, 0, 0, TAU); ctx.fill(); ctx.stroke();
      // oilskin cape
      ctx.fillStyle = '#e3ddcf'; ctx.beginPath(); ctx.moveTo(-0.13, -0.9); ctx.quadraticCurveTo(-0.2, -0.5, -0.21, -0.08); ctx.quadraticCurveTo(0, -0.04, 0.21, -0.08); ctx.quadraticCurveTo(0.2, -0.5, 0.13, -0.9); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#cbc3b1'; ctx.beginPath(); ctx.moveTo(0.06, -0.85); ctx.quadraticCurveTo(0.16, -0.5, 0.15, -0.09); ctx.lineTo(0.21, -0.08); ctx.quadraticCurveTo(0.2, -0.5, 0.13, -0.9); ctx.closePath(); ctx.fill();
      // satchel
      ctx.fillStyle = '#8a6a48'; ctx.beginPath(); ctx.moveTo(-0.09, -0.72); ctx.lineTo(0.09, -0.72); ctx.quadraticCurveTo(0.1, -0.5, 0.0, -0.48); ctx.quadraticCurveTo(-0.1, -0.5, -0.09, -0.72); ctx.fill(); ctx.stroke();
      limb(ctx, 0.12, -0.84, 0.26, -0.55, 0.07, '#d8d1c1', lw);
      // scarf to the nose, silver plait
      ctx.fillStyle = '#7fa3a8'; ctx.beginPath(); ctx.ellipse(0, -0.91, 0.14, 0.055, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#cfd2d4'; ctx.beginPath(); ctx.arc(0, -1.01, 0.105, 0, TAU); ctx.fill(); ctx.stroke();
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(Math.sin(t * 1.3 + i) * 0.006 * v.amb, -0.9 + i * 0.07, 0.03, 0.04, 0, 0, TAU); ctx.fill(); ctx.stroke(); }
      ctx.restore();
    }
    function drawOttoline(ctx, o, lw, t) {
      ctx.lineJoin = 'round'; ctx.strokeStyle = OUT; ctx.lineWidth = lw;
      ctx.save(); ctx.translate(0, -o.bob); ctx.rotate(o.lean); ctx.scale(o.sx, o.sy);
      // bell staff
      limb(ctx, -0.33, 0.0, -0.35, -1.0, 0.04, '#6a4f22', lw);
      ctx.fillStyle = BRASS; ctx.save(); ctx.translate(-0.35, -1.02); ctx.rotate(Math.sin(o.swing) * 0.3);
      ctx.beginPath(); ctx.moveTo(-0.06, 0.07); ctx.quadraticCurveTo(-0.06, -0.06, 0, -0.07); ctx.quadraticCurveTo(0.06, -0.06, 0.06, 0.07); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      // the bell robe
      ctx.fillStyle = INDIGO; ctx.beginPath(); ctx.moveTo(-0.1, -0.78); ctx.quadraticCurveTo(-0.3, -0.55, -0.34, -0.06); ctx.quadraticCurveTo(0, 0.0, 0.34, -0.06); ctx.quadraticCurveTo(0.3, -0.55, 0.1, -0.78); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = BRASS; ctx.lineWidth = lw * 1.6; ctx.beginPath();
      ctx.moveTo(0, -0.42); ctx.lineTo(0.11, -0.3); ctx.lineTo(0, -0.18); ctx.lineTo(-0.11, -0.3); ctx.closePath();
      ctx.moveTo(0, -0.36); ctx.lineTo(0.05, -0.3); ctx.lineTo(0, -0.24); ctx.lineTo(-0.05, -0.3); ctx.closePath();
      ctx.moveTo(-0.32, -0.12); ctx.quadraticCurveTo(0, -0.07, 0.32, -0.12); ctx.stroke(); ctx.strokeStyle = OUT; ctx.lineWidth = lw;
      // five mended bells on the hem
      ctx.fillStyle = BRASS;
      for (let i = 0; i < 5; i++) {
        const x = -0.24 + i * 0.12, y = -0.07; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(o.swing + i * 0.9) * 0.35);
        ctx.beginPath(); ctx.moveTo(-0.032, 0.06); ctx.quadraticCurveTo(-0.032, 0.0, 0, -0.005); ctx.quadraticCurveTo(0.032, 0.0, 0.032, 0.06); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
      }
      // head, red beret with three wax sticks
      ctx.fillStyle = '#4a2a1c'; ctx.beginPath(); ctx.arc(0, -0.86, 0.1, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.save(); ctx.translate(0.02, -0.95); ctx.rotate(0.12 + o.beret);
      ctx.strokeStyle = OUT; ctx.fillStyle = '#f1e9d2';
      for (const x of [-0.07, 0.0, 0.07]) { ctx.beginPath(); ctx.rect(x - 0.012, -0.12, 0.024, 0.1); ctx.fill(); ctx.stroke(); }
      ctx.fillStyle = '#bf3b2b'; ctx.beginPath(); ctx.ellipse(0, 0, 0.16, 0.065, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.restore();
      ctx.restore();
    }
    function drawScrawl(ctx, c, lw, t) {
      ctx.lineJoin = 'round'; ctx.strokeStyle = OUT; ctx.lineWidth = lw;
      ctx.save(); ctx.translate(0, -c.bob); ctx.rotate(c.lean); ctx.scale(c.sx, c.sy);
      // long legs
      limb(ctx, -0.05, -0.5, -0.07, -0.03, 0.06, '#59664c', lw); limb(ctx, 0.05, -0.5, 0.07, -0.03, 0.06, '#59664c', lw);
      ctx.fillStyle = OUT; ctx.beginPath(); ctx.ellipse(-0.08, -0.02, 0.06, 0.03, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0.08, -0.02, 0.06, 0.03, 0, 0, TAU); ctx.fill();
      // quill staff
      limb(ctx, 0.22, 0.0, 0.26, -1.42, 0.03, '#e8dfc8', lw);
      ctx.fillStyle = '#f6f1e4'; ctx.beginPath(); ctx.moveTo(0.26, -1.25); ctx.quadraticCurveTo(0.36, -1.5, 0.28, -1.72); ctx.quadraticCurveTo(0.2, -1.5, 0.26, -1.25); ctx.fill(); ctx.stroke();
      // white tailcoat, stooped
      ctx.save(); ctx.translate(0, -0.45); ctx.rotate(0.06);
      ctx.fillStyle = '#f1ede4'; ctx.beginPath(); ctx.moveTo(-0.13, -0.58); ctx.quadraticCurveTo(-0.17, -0.3, -0.13, 0.12); ctx.lineTo(-0.02, 0.06); ctx.lineTo(0.0, 0.0); ctx.lineTo(0.02, 0.06); ctx.lineTo(0.13, 0.12); ctx.quadraticCurveTo(0.17, -0.3, 0.13, -0.58); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -0.55); ctx.lineTo(0, 0.0); ctx.stroke();
      limb(ctx, 0.12, -0.52, 0.22, -0.18, 0.06, '#e6e0d3', lw);
      ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(0.22, -0.16, 0.055, 0, TAU); ctx.fill();
      // head and candle hat
      ctx.fillStyle = '#7a4e34'; ctx.beginPath(); ctx.arc(0.0, -0.66, 0.085, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f1e9d2'; ctx.beginPath(); ctx.rect(-0.09, -0.86, 0.18, 0.14); ctx.fill(); ctx.stroke();
      ctx.fillStyle = BRASS; ctx.beginPath(); ctx.rect(-0.1, -0.74, 0.2, 0.035); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f6efdc';
      const cs = [[-0.05, 0.13], [0.0, 0.2], [0.05, 0.1]];
      for (let i = 0; i < 3; i++) {
        const [x, hh] = cs[i]; ctx.fillStyle = '#f6efdc'; ctx.beginPath(); ctx.rect(x - 0.02, -0.86 - hh, 0.04, hh); ctx.fill(); ctx.stroke();
        const fl = 0.85 + 0.15 * Math.sin(t * 8 + i * 2) * c.flick, ln = c.flameLean + Math.sin(t * 6 + i) * 0.01 * c.flick;
        ctx.fillStyle = FLAME; ctx.beginPath(); ctx.moveTo(x - 0.02, -0.86 - hh); ctx.quadraticCurveTo(x - 0.025, -0.9 - hh, x + ln, -0.94 - hh - 0.04 * fl); ctx.quadraticCurveTo(x + 0.025, -0.9 - hh, x + 0.02, -0.86 - hh); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      ctx.restore();
      ctx.restore();
    }

    // ================= a Pew Mite: a misericord broken off the choir stalls =================
    function drawMite(ctx, ph, chat, lw, face) {
      ctx.lineJoin = 'round'; ctx.strokeStyle = OUT; ctx.lineWidth = lw; ctx.save(); ctx.scale(face, 1);
      const sk = Math.sin(ph * 14), bob = Math.abs(sk) * 0.025;
      for (let i = 0; i < 3; i++) {
        const lift = (i % 2 ? sk : -sk) > 0 ? 0.04 : 0;
        const x = -0.2 + i * 0.2;
        limb(ctx, x, -0.18 - bob, x + 0.09, -0.12 - bob, 0.035, OAK_D, lw); limb(ctx, x + 0.09, -0.12 - bob, x + 0.12, -0.01 - lift, 0.03, OAK_D, lw);
      }
      ctx.translate(0, -bob);
      // pierced lancet backrest
      ctx.fillStyle = OAK; ctx.beginPath(); ctx.moveTo(-0.24, -0.36); ctx.lineTo(-0.24, -0.52); ctx.quadraticCurveTo(-0.22, -0.7, 0.0, -0.8); ctx.quadraticCurveTo(0.22, -0.7, 0.24, -0.52); ctx.lineTo(0.24, -0.36); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = OAK_D; ctx.beginPath(); ctx.moveTo(-0.08, -0.42); ctx.lineTo(-0.08, -0.56); ctx.quadraticCurveTo(-0.07, -0.64, 0, -0.68); ctx.quadraticCurveTo(0.07, -0.64, 0.08, -0.56); ctx.lineTo(0.08, -0.42); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = BRASS; ctx.beginPath(); ctx.moveTo(-0.03, -0.79); ctx.lineTo(0, -0.9); ctx.lineTo(0.03, -0.79); ctx.closePath(); ctx.fill(); ctx.stroke();
      // seat box and apron with a grotesque
      ctx.fillStyle = OAK; ctx.beginPath(); ctx.rect(-0.3, -0.38, 0.6, 0.22); ctx.fill(); ctx.stroke();
      ctx.fillStyle = OAK_L; ctx.beginPath(); ctx.rect(-0.27, -0.34, 0.54, 0.14); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0.08, -0.27, 0.07, 0.055, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffd36a'; ctx.beginPath(); ctx.arc(0.05, -0.285, 0.018, 0, TAU); ctx.arc(0.11, -0.285, 0.018, 0, TAU); ctx.fill();
      ctx.fillStyle = OAK_L; ctx.beginPath(); ctx.moveTo(0.13, -0.27); ctx.lineTo(0.2, -0.23); ctx.lineTo(0.12, -0.24); ctx.fill(); ctx.stroke();
      // chattering velvet lid
      ctx.save(); ctx.translate(-0.28, -0.38); ctx.rotate(-chat);
      ctx.fillStyle = OAK_L; ctx.beginPath(); ctx.rect(0, -0.04, 0.6, 0.04); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INDIGO_L; ctx.beginPath(); ctx.rect(0.05, -0.1, 0.5, 0.06); ctx.fill(); ctx.stroke();
      ctx.restore();
      ctx.restore();
    }

    // ================= the ruby warning (danger only: toothed, on the ground) =================
    function drawWarning(ctx, x, z, r, pulse, snap) {
      if (r <= 0.02) return;
      ctx.beginPath();
      for (let i = 0; i < SER.length; i += 2) {
        const j = i / 2, rr = r * (j % 2 ? 0.84 - snap * 0.3 : 1);
        P(x + SER[i] * rr, 0, z + SER[i + 1] * rr); if (i === 0) ctx.moveTo(PX, PY); else ctx.lineTo(PX, PY);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(200,35,60,' + (0.22 + pulse * 0.12 + snap * 0.3).toFixed(3) + ')'; ctx.fill();
      ctx.strokeStyle = RUBY; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i <= 30; i += 2) { const q = i / 30 * TAU, rr = r * 0.55; P(x + Math.cos(q) * rr, 0, z + Math.sin(q) * rr); if (i === 0) ctx.moveTo(PX, PY); else ctx.lineTo(PX, PY); }
      ctx.strokeStyle = RUBY_D; ctx.lineWidth = 1.5; ctx.stroke();
    }
    function drawCracks(ctx, x, z, r, k) {
      ctx.strokeStyle = OUT; ctx.lineWidth = 1.4; ctx.globalAlpha = 1 - k; ctx.beginPath();
      for (let i = 0; i < 7; i++) { const q = i / 7 * TAU + 0.3; P(x, 0, z); ctx.moveTo(PX, PY); P(x + Math.cos(q) * r * 0.5, 0, z + Math.sin(q) * r * 0.5); ctx.lineTo(PX, PY); P(x + Math.cos(q + 0.2) * r, 0, z + Math.sin(q + 0.2) * r); ctx.lineTo(PX, PY); }
      ctx.stroke(); ctx.globalAlpha = 1;
    }

    // an Arc Bolt in flight (rounded cobalt, white core)
    function drawBolt(ctx, x, y, r, vx, vy) {
      const a = Math.atan2(vy, vx);
      ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(1, r * 0.18);
      ctx.fillStyle = COB_L; ctx.beginPath(); ctx.arc(-r * 1.7, 0, r * 0.45, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#5f86f0'; ctx.beginPath(); ctx.arc(-r * 1.05, 0, r * 0.65, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = COB; ctx.beginPath(); ctx.ellipse(0, 0, r * 1.1, r * 0.85, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = COB_W; ctx.beginPath(); ctx.ellipse(r * 0.2, -r * 0.1, r * 0.5, r * 0.36, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    function drawOrb(ctx, x, y, r) {
      ctx.fillStyle = 'rgba(255,214,120,0.3)'; ctx.beginPath(); ctx.arc(x, y, r * 1.8, 0, TAU); ctx.fill();
      ctx.fillStyle = '#ffe39a'; ctx.strokeStyle = OUT; ctx.lineWidth = Math.max(1, r * 0.12); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fffaf0'; ctx.beginPath(); ctx.arc(x - r * 0.28, y - r * 0.3, r * 0.42, 0, TAU); ctx.fill();
    }

    // ================= Pim's pose for each mode =================
    function idlePose(p, mt, near, hover, pimSX, w) {
      const amb = S.amb;
      // breathing and weight
      p.sy = 1 + Math.sin(S.clock * 2.1) * 0.012 * amb; p.sx = 2 - p.sy;
      if (S.phase === 'live') {
        const u = S.clock - S.ph0, b = S.beat;
        if (b === 'glance') {
          const turn = seg(u, 0.0, 0.25) * (1 - seg(u, 1.9, 2.3));
          p.hs = lerp(-0.55, 0.05, turn); p.ex = lerp(-0.4, 0, turn); p.brow = 0.6 * turn;
          const hand = bump(u, 0.45, 1.5); p.armL = hand; p.hatRot = 0.12 - 0.22 * seg(u, 0.6, 0.9) + 0.34 * seg(u, 1.15, 1.25) * (1 - seg(u, 1.6, 2.2));
          p.mouth = -0.4 * bump(u, 1.2, 1.9); p.brow -= 1.4 * bump(u, 1.2, 1.9);
        } else if (b === 'lunge') {
          const an = bump(u, 0.0, 0.35), go = seg(u, 0.3, 0.45) * (1 - seg(u, 1.05, 1.5));
          p.lean = -0.12 * an + 0.42 * go * (1 + 0.35 * Math.sin((u - 0.45) * 15) * bump(u, 0.45, 1.1));
          p.sy -= 0.1 * an; p.staffA = 0.12 + 1.1 * go; p.step = go; p.turn = 0; p.eyes = 0.8 * go; p.mouth = 0.8 * bump(u, 0.45, 1.0);
          p.armL = 0.9 * bump(u, 0.5, 1.1); p.hatRot = 0.12 + 0.3 * go;
          // "meant to do that"
          const proud = bump(u, 1.4, 2.4); p.hs = lerp(-0.55, 0.1, proud); p.brow += 0.8 * proud; p.lean -= 0.08 * proud; p.armL = Math.max(p.armL, 0.5 * proud);
          if (S.prevU < 0.5 && u >= 0.5) S.fizz = S.clock;
        } else if (b === 'sneak') {
          const out = seg(u, 0.1, 1.1) * (1 - seg(u, 2.1, 2.9));
          p.step = out * 0.0; p.sy -= 0.06 * out; p.lean = 0.1 * out; S.sneakX = 0.4 * out;
          p.gait = (u > 0.1 && u < 1.1) || (u > 2.1 && u < 2.9) ? u * 9 : -1;
          const caught = bump(u, 1.1, 2.15); p.eyes = caught; p.hs = lerp(-0.55, 0.15, caught); p.mouth = caught > 0.5 ? 0.25 : 0; p.blow = caught; p.brow = 0.9 * caught;
          S.snailLook = caught;
        } else if (b === 'mite') {
          // a Pew Mite skitters out from behind the dais; he jumps, zaps it, it bolts back
          const jump = bump(u, 0.95, 1.3), aim = seg(u, 1.15, 1.3) * (1 - seg(u, 1.9, 2.3));
          p.bob = 0.2 * jump; p.eyes = Math.max(bump(u, 0.8, 1.6), 0); p.turn = u > 0.9 && u < 2.3 ? 1 : 0; p.head = 1; p.hs = lerp(-0.55, 0.6, seg(u, 0.5, 0.8) * (1 - seg(u, 2.0, 2.4)));
          p.ex = lerp(-0.4, 1, seg(u, 0.5, 0.8)) * (1 - seg(u, 2.0, 2.4)); p.ey = 0.5; p.hatLift = 0.25 * jump; p.hatRot = 0.12 - 0.5 * jump;
          p.staffA = lerp(0.12, 1.3, aim); p.lean = -0.1 * aim; p.brow = -0.8 * aim + 0.8 * jump; p.mouth = jump > 0.2 ? 0.8 : -0.5 * aim; p.armL = 0.6 * jump;
          if (S.prevU < 1.3 && u >= 1.3) S.fizz = S.clock;
          S.imite = u;
        } else if (b === 'spark') {
          const reach = bump(u, 0.1, 1.0); p.armL = 0.3 * reach; p.jar = 0.15 + 0.85 * bump(u, 0.35, 1.6);
          p.staffA = 0.12 + 0.35 * bump(u, 0.9, 1.9); p.hs = lerp(-0.55, 0.3, bump(u, 0.9, 1.9)); p.blow = bump(u, 1.2, 1.8); p.brow = 0.5 * bump(u, 0.9, 1.9);
          if (S.prevU < 0.45 && u >= 0.45) S.jarPop = S.clock;
        }
        S.prevU = u;
      }
      // glance toward the cursor as it nears
      if (near > 0.02) {
        let dir = 0; if (hover) dir = cl((hover.x - pimSX) / (w * 0.4), -1, 1);
        p.hs = lerp(p.hs, dir * 0.6, near); p.ex = lerp(p.ex, dir, near); p.ey = lerp(p.ey, -0.3, near); p.brow = lerp(p.brow, 0.7, near);
        p.eyes = Math.max(p.eyes, near * 0.6);
      }
    }
    function reactPose(p, mt) {
      const an = bump(mt, 0, 0.18), up = bump(mt, 0.12, 0.5), land = bump(mt, 0.46, 0.62), aft = seg(mt, 0.5, 0.62);
      p.sy = 1 - 0.16 * an + 0.12 * up - 0.14 * land; p.sx = 1 + 0.12 * an - 0.06 * up + 0.12 * land;
      p.bob = 0.32 * up; p.turn = 1; p.head = 1; p.hs = 0; p.eyes = seg(mt, 0.08, 0.16); p.brow = 1; p.mouth = 0.9 * seg(mt, 0.1, 0.18);
      p.beard = seg(mt, 0.1, 0.2); p.spec = 0.35 * seg(mt, 0.12, 0.3);
      // the hat flies off, spins and lands crooked the other way
      const hf = seg(mt, 0.12, 0.3) * (1 - seg(mt, 0.36, 0.6));
      p.hatLift = 0.55 * hf; p.hatRot = lerp(0.12, -0.42, seg(mt, 0.15, 0.58)) + Math.sin(seg(mt, 0.15, 0.58) * PI) * 1.2; p.hatCrush = 0.18 * aft;
      p.armUp = up; p.armL = 1 * up + 0.4 * aft; p.staffA = 0.12 - 0.7 * up + 0.2 * aft;
      p.lean = -0.08 * up + Math.sin(mt * 60) * 0.02 * aft;
      p.ex = 0.3 * aft; p.ey = -0.6;
    }
    function squeezePose(p, sq, mt) {
      const e = cl(sq * 0.85 + mt * 0.22, 0, 1), e2 = seg(e, 0.45, 0.75), e3 = seg(e, 0.8, 1);
      p.turn = 1; p.head = 1; p.hs = 0.4; p.face = -1; p.sy = 1 - 0.22 * e; p.sx = 1 + 0.2 * e;
      p.hatCrush = 0.2 + 0.8 * e; p.hatRot = 0.12 + 0.5 * e; p.brow = -1 * Math.min(1, e * 1.6); p.mouth = -1 * seg(e, 0.15, 0.3) + 0.9 * e3 * (Math.sin(mt * 9) > 0 ? 1 : 0.2);
      p.eyes = 0.2 * (1 - e2); p.spec = 0.25 * e; p.ex = 0.7; p.ey = 0;
      // brace the staff against the edge and push back
      p.staffA = lerp(0.12, 1.45, e2); p.armUp = 0.2 * e2; p.lean = 0.18 * e2 + Math.sin(mt * 30) * 0.015 * e2; p.step = 0.7 * e2;
      // then stamping fury, the jar crackling
      p.bob = e3 * Math.max(0, Math.sin(mt * 9.4)) * 0.08; p.jar = 0.15 + 0.85 * e3;
    }
    function loopPose(p, lt) {
      const q = pathAt(lt), moving = Math.abs(q[2]) > 0.05;
      p.turn = 0.7; p.head = 1; p.face = q[2] < -0.05 ? -1 : 1; p.hs = 0.35;
      p.gait = moving ? lt * 15 : -1; p.lean = moving ? 0.12 : 0; p.staffA = 0.3; p.jar = 0.35;
      if (lt > 5.75) p.face = 1;
      // the warning blooms: notice it, then dash
      const see = bump(lt, 2.22, 2.6); p.eyes = Math.max(see, bump(lt, 4.05, 4.9)); p.ey = 0.8 * see; p.hatLift = 0.12 * bump(lt, 2.25, 2.45); p.mouth = 0.8 * see;
      if (lt > 2.42 && lt < 2.72) { p.lean = 0.45; p.sx = 1.15; p.sy = 0.88; p.gait = -1; p.step = 1; }
      const land = bump(lt, 2.72, 2.95); p.sy -= 0.12 * land; p.sx += 0.1 * land;
      if (lt > 2.95 && lt < 3.25) { p.face = -1; p.brow = 0.8; p.blow = 1; }
      // grab the miracle and hold it high
      const hold = lt > 4.1 && lt < 5.62;
      if (hold) { p.armUp = 1; p.armL = 1; p.staffA = -0.5; p.mouth = 0.6; p.brow = 0.9; }
      const hop = bump(lt, 4.15, 4.5); p.bob = 0.18 * hop; p.sy += 0.08 * hop;
      const tuck = bump(lt, 5.55, 5.95); p.jar = Math.max(p.jar, 0.35 + 0.65 * tuck); p.armL = Math.max(p.armL, 0.4 * tuck);
      S.holding = hold;
    }

    return {
      frame(ctx, s) {
        const w = s.w, h = s.h, rm = !!s.rm, dt = rm ? 0 : (s.dt || 0);
        if (!(w > 2 && h > 2)) return;
        S.rm = rm; S.w = w; S.h = h;
        S.clock += dt;
        const t = rm ? 0 : S.clock;
        const mode = rm ? 'idle' : (s.mode || 'idle'), mt = rm ? 0 : (s.mt || 0);
        if (mode !== S.mode) {
          S.snap = S.pose ? copy(S.pose) : null; S.snapT = S.clock; S.kFrom = S.k;
          if (mode === 'idle') newPhase(S.mode === '' ? 'hold' : 'live');
          S.mode = mode;
        }
        S.base = ctx.getTransform(); const inv = S.base.inverse();
        const toPlate = (m, x, y) => { const a = m.transformPoint({ x, y }), b = inv.transformPoint(a); return [b.x, b.y]; };

        // ---- idle live/hold rhythm ----
        if (mode === 'idle' && !rm) { if (S.clock - S.ph0 > S.phDur) newPhase(S.phase === 'live' ? 'hold' : 'live'); }
        const liveU = S.clock - S.ph0;
        S.amb = rm ? 0 : mode !== 'idle' ? 1 : S.phase === 'live' ? seg(liveU, 0, 0.4) * (1 - seg(liveU, S.phDur - 0.5, S.phDur)) : 0;
        const amb = S.amb;

        // ---- camera blend: 0 = the poster's long low view, 1 = the game's high three-quarter view ----
        let k;
        if (rm) k = 0;
        else if (mode === 'enter') k = ease(mt / 0.7);
        else if (mode === 'loop') k = 1;
        else k = S.kFrom * (1 - ease(mt / (mode === 'idle' ? 0.7 : 0.35)));
        S.k = k;

        // ---- composition for this plate's shape ----
        const asp = w / h, spread = cl((asp - 0.45) / 1.35, 0, 1), sxp = lerp(0.42, 1, spread), gx = lerp(0.5, 1, spread);
        let tiny = Math.max(cl((230 - h) / 120, 0, 1) * (w < 260 ? 1 : 0.6), cl((asp - 2.6) / 2.4, 0, 0.55));
        if (mode === 'squeezed') tiny = Math.max(tiny, 0.6 * cl((s.squeeze || 0) * 1.2 + mt * 0.2, 0, 1));
        const lt = mode === 'loop' ? mt % LT : 0;
        const posterPos = [[-1.72 * sxp, 0.62], [-0.8 * sxp, 0.18], [0.68 * sxp, 0.25], [1.58 * sxp, 0.42]];
        const gameSide = [null, [-1.95 * gx, -1.05], [1.95 * gx, -1.15], [2.15 * gx, 1.0]];
        let pg;
        if (mode === 'loop') { const q = pathAt(lt); pg = [q[0] * gx, q[1]]; S.lastGame = pg; }
        else if (mode === 'enter') { const q = pathAt(0); pg = [q[0] * gx, q[1]]; S.lastGame = pg; }
        else pg = S.lastGame;
        const pimX = lerp(posterPos[0][0] + (S.sneakX || 0) * (mode === 'idle' ? 1 : 0), pg[0], k), pimZ = lerp(posterPos[0][1], pg[1], k);
        const snailZ = lerp(-1.6, -1.95, k);
        const pitch = lerp(0.075, 0.98, k);
        setCam(0, lerp(1.25, 0, k), lerp(-0.6, -0.5, k), pitch, 16);
        // fit: poster keypoints vs. game keypoints, tiny plates close in on Pim
        CAM.f = 1; CAM.cx = 0; CAM.cy = 0;
        const bx = [1e9, -1e9, 1e9, -1e9];
        const acc = (B, x, y, z) => { P(x, y, z); if (PX < B[0]) B[0] = PX; if (PX > B[1]) B[1] = PX; if (PY < B[2]) B[2] = PY; if (PY > B[3]) B[3] = PY; };
        const vy = lerp(1, 0.82, k);
        const B0 = [1e9, -1e9, 1e9, -1e9], B1 = [1e9, -1e9, 1e9, -1e9], BT = [1e9, -1e9, 1e9, -1e9];
        const sw = lerp(0.55, 1, spread);
        acc(B0, -2.05 * sw, 0, snailZ); acc(B0, 2.05 * sw, 0, snailZ); acc(B0, 0, 4.35, snailZ);
        acc(B0, posterPos[0][0] - 0.35, -0.04, posterPos[0][1]); acc(B0, posterPos[3][0] + 0.3, -0.04, posterPos[3][1]); acc(B0, posterPos[0][0], 1.25, posterPos[0][1]);
        acc(B1, -1.9 * gx, 0, 1.45); acc(B1, 1.9 * gx, 0, 1.45); acc(B1, 0, 3.35 * vy, snailZ); acc(B1, -1.9 * gx, 0, -0.9);
        acc(BT, pimX - 0.55, -0.05, pimZ); acc(BT, pimX + 0.95 - k * 0.4, 0, pimZ); acc(BT, pimX, 1.35, pimZ); acc(BT, pimX + 0.9, lerp(1.75, 1.0, k), lerp(snailZ, pimZ, k));
        for (let i = 0; i < 4; i++) bx[i] = lerp(lerp(B0[i], B1[i], k), BT[i], tiny);
        const mx = 0.04, my = lerp(0.07, 0.05, k);
        const f = Math.min(w * (1 - 2 * mx) / (bx[1] - bx[0]), h * (1 - 2 * my) / (bx[3] - bx[2]));
        CAM.f = f; CAM.cx = w / 2 - f * (bx[0] + bx[1]) / 2;
        // keep the floor low in tall plates: sit the subject a little below the middle
        const extraH = h - f * (bx[3] - bx[2]);
        CAM.cy = h / 2 - f * (bx[2] + bx[3]) / 2 + extraH * 0.18;
        // shakes and hits jolt the camera a little (never the light)
        if (S.shake && !rm) { const u = S.clock - S.shake.t0; if (u < 0.6) CAM.cy += Math.sin(u * 40) * (1 - u / 0.6) * 4 * S.shake.a; }

        // ---- the court ----
        drawCourt(ctx, w, h, t, amb);

        // ---- Pim's pose ----
        const p = copy(HELD);
        P(pimX, 0, pimZ); const pimSX = PX;
        S.snailLook = 0; S.holding = false; S.imite = -1;
        if (mode === 'idle' && !rm) idlePose(p, mt, s.near || 0, s.hover, pimSX, w);
        else if (mode === 'react') reactPose(p, mt);
        else if (mode === 'enter') {
          const u = mt / 0.7; reactPose(p, 0.8); const run = copy(HELD); loopPose(run, 0);
          const m2 = mix(p, run, ease(u)); for (const kk of KEYS) p[kk] = m2[kk];
          p.bob = 0.25 * Math.sin(PI * cl(u * 1.2, 0, 1)); p.hatRot -= Math.sin(u * PI) * 0.4;
        } else if (mode === 'loop') loopPose(p, lt);
        else if (mode === 'squeezed') squeezePose(p, s.squeeze || 0, mt);
        // events
        if (!rm && S.gag) {
          const u = S.clock - S.gag.t0;
          if (u > 1.7) S.gag = null;
          else if (S.gag.item === 'bolt') {
            const aim = seg(u, 0.0, 0.35) * (1 - seg(u, 1.1, 1.6));
            p.turn = 1; p.head = 1; p.hs = 0.5; p.staffA = lerp(p.staffA, 1.25, aim); p.armUp = 0.25 * aim; p.jar = Math.max(p.jar, bump(u, 0.15, 0.85));
            p.lean = 0.08 * aim - 0.18 * bump(u, 0.78, 1.05); p.brow = -0.6 * aim; p.mouth = 0.6 * bump(u, 0.78, 1.2); p.step = 0.5 * aim;
          } else {
            const lift = seg(u, 0.0, 0.3) * (1 - seg(u, 0.85, 1.0)); p.turn = 1; p.head = 1; p.hs = 0.4; p.armL = lift; p.armUp = 0.6 * bump(u, 0.5, 0.95);
            p.lean = -0.2 * bump(u, 0.35, 0.75) + 0.25 * bump(u, 0.75, 1.0); p.brow = 0.8 * lift; p.mouth = 0.3; S.gagOrb = lift;
          }
        }
        if (!rm && S.hit) {
          const u = S.clock - S.hit.t0;
          if (u > 1.1) S.hit = null;
          else {
            const kn = bump(u, 0, 0.35), sulk = seg(u, 0.35, 0.5) * (1 - seg(u, 0.9, 1.1)), dir = S.hit.dir;
            p.lean += -0.5 * kn * dir; p.hatLift += 0.35 * kn; p.hatRot += 0.9 * kn * dir; p.eyes = Math.max(p.eyes, kn); p.spec += 0.5 * (kn + sulk);
            p.turn = 1; p.head = 1; p.hs = 0.3 * dir; p.brow = lerp(p.brow, -1, sulk); p.mouth = kn > 0.3 ? 0.8 : -0.8 * sulk; p.sy -= 0.1 * kn;
          }
        }
        if (!rm && S.look) {
          const u = S.clock - S.look.t0; if (u > 1.5) S.look = null;
          else { const lk = bump(u, 0, 1.5) > 0 ? Math.min(1, Math.min(u, 1.5 - u) * 5) : 0; const d = S.look.dx >= 0 ? 1 : -1; p.head = 1; p.hs = lerp(p.hs, 0.7 * d, lk); p.ex = lerp(p.ex, d, lk); p.brow = lerp(p.brow, 0.6, lk); }
        }
        let shk = 0;
        if (!rm && S.shake) { const u = S.clock - S.shake.t0; if (u > 0.9) S.shake = null; else { shk = Math.sin(u * 22) * (1 - u / 0.9) * S.shake.a; p.lean += shk * 0.25; p.hatRot += shk * 0.3; p.bob += Math.max(0, Math.sin(u * 11)) * 0.06 * (1 - u / 0.9); } }
        // a quick physical settle from the last mode (no fades, a short blend of the body)
        if (S.snap && S.clock - S.snapT < 0.3 && mode !== 'react') { const m2 = mix(S.snap, p, ease((S.clock - S.snapT) / 0.3)); for (const kk of KEYS) p[kk] = m2[kk]; }
        S.pose = p;

        // ---- the Custodian ----
        const C = { recoil: 0, breathe: Math.sin(t * 1.1) * amb, ea: 0, lx: -0.6, ly: 0.3, squint: 0.35, wide: 0, mouth: 0, wob: 0, orbIn: 1, flick: rm ? 0 : 1, flameLean: 0 };
        C.ea = Math.sin(t * 0.6) * 0.18 * amb;
        if (mode === 'idle') { const sl = S.snailLook || 0; C.ea = lerp(C.ea, -0.5, sl); C.squint = lerp(0.35, 0, sl); C.lx = lerp(-0.6, -1, sl); C.ly = lerp(0.3, 0.8, sl); C.squint = lerp(C.squint, 0.0, s.near || 0); C.lx = lerp(C.lx, 0, s.near || 0); }
        if (mode === 'react') { const r = seg(mt, 0.1, 0.25); C.ea = -0.5 * r; C.squint = 0.35 * (1 - r); C.lx = -1; C.ly = 0.8 * r; C.wide = r; }
        if (mode === 'enter' || mode === 'loop') { C.squint = 0; C.lx = 0; C.ly = 1; C.wide = 0.3; }
        if (mode === 'loop') {
          const rc = seg(lt, 4.12, 4.35) * (1 - seg(lt, 4.9, 5.6)); C.recoil = rc; C.wide = 0.3 + 0.7 * rc; C.mouth = rc; C.wob = Math.sin(lt * 30) * bump(lt, 4.12, 4.9);
          C.lx = cl((pimX - 0) / 2, -1, 1); C.ly = 1; C.orbIn = lt < 0.15 ? 1 - lt / 0.15 : 0; if (lt > 5.85) C.orbIn = (lt - 5.85) / 0.15;
          C.flameLean = -0.05 * rc;
          if (lt > 2.3 && lt < 2.95) C.squint = 0.6;
        }
        if (mode === 'squeezed') { const e = cl((s.squeeze || 0) * 0.85 + mt * 0.22, 0, 1); C.squint = 0.35 + 0.55 * e; C.flameLean = 0.06 * e; C.lx = -0.8; }
        if (S.gag && S.gag.item === 'relic') C.orbIn = 1 - (S.gagOrb || 0) * 0.6;

        // ---- the stage, sorted by depth ----
        const others = [
          { id: 1, z: lerp(posterPos[1][1], gameSide[1][1], k), x: lerp(posterPos[1][0], gameSide[1][0], k) },
          { id: 2, z: lerp(posterPos[2][1], gameSide[2][1], k), x: lerp(posterPos[2][0], gameSide[2][0], k) },
          { id: 3, z: lerp(posterPos[3][1], gameSide[3][1], k), x: lerp(posterPos[3][0], gameSide[3][0], k) }
        ];
        const ringCol = ['#2f63e0', '#9fd3e6', '#d9b04a', '#a99ad6'];
        // ground rings and shadows first
        floorRing(ctx, 0.1, snailZ + 0.1, 2.05, null, 0, 'rgba(60,40,50,' + (0.13 - 0.06 * k).toFixed(3) + ')');
        if (k > 0.02) floorRing(ctx, 0.0, -0.6, 0.62 * k, '#d9b04a', 2.5, 'rgba(228,181,60,0.12)');
        for (const o of others) { floorRing(ctx, o.x, o.z, 0.3, null, 0, 'rgba(60,40,50,0.18)'); floorRing(ctx, o.x, o.z, 0.42, ringCol[o.id], 2, null); }
        floorRing(ctx, pimX, pimZ, 0.28, null, 0, 'rgba(60,40,50,0.2)'); floorRing(ctx, pimX, pimZ, 0.42, ringCol[0], 2.4, null);
        // the ruby warning on the floor (loop only)
        if (mode === 'loop') {
          const rx = RING.x * gx, rz = RING.z;
          const grow = seg(lt, RING.t0, RING.t0 + 0.45), snap = seg(lt, RING.t1 - 0.08, RING.t1);
          if (lt > RING.t0 && lt < RING.t1 + 0.05) drawWarning(ctx, rx, rz, 0.8 * grow, 0.5 + 0.5 * Math.sin(lt * TAU * 2), snap);
          if (lt > RING.t1 && lt < RING.t1 + 0.9) drawCracks(ctx, rx, rz, 0.85, (lt - RING.t1) / 0.9);
          if (S.prevLt < RING.t1 && lt >= RING.t1) { P(rx, 0.1, rz); puff(PX, PY, 10, PS * 0.6, 'stone'); puff(PX, PY, 6, PS * 0.5, 'dust'); }
        }

        const lw0 = (ps) => Math.max(0.9, Math.min(2.4, ps * 0.024)) / ps;
        const items = [];
        items.push({ z: snailZ, d: () => {
          P(0, 0, snailZ); const ps = PS; ctx.save(); ctx.translate(PX, PY); ctx.scale(ps, ps * vy);
          drawSnail(ctx, C, lw0(ps), t); ctx.restore();
        } });
        for (const o of others) items.push({ z: o.z, d: () => {
          P(o.x, 0, o.z); const ps = PS; ctx.save(); ctx.translate(PX, PY); ctx.scale(ps, ps * vy);
          const q = { bob: 0, lean: 0, sx: 1, sy: 1, amb, vane: 0, swing: 0, beret: 0, flick: rm ? 0 : 1, flameLean: 0 };
          const id = o.id, ph = t * (1.3 + id * 0.17) + id;
          q.sy = 1 + Math.sin(ph * 1.6) * 0.012 * amb; q.lean = Math.sin(ph * 0.7) * 0.025 * amb;
          q.vane = (rm ? 0.35 : 0.35 + t * 0.6 * (0.3 + amb));
          q.swing = Math.sin(t * 2.4 + id) * (0.15 + 0.5 * amb);
          if (mode === 'react') { const j = bump(mt, 0.15 + id * 0.05, 0.5 + id * 0.05); q.bob = 0.12 * j; q.sy += 0.06 * j; q.swing = Math.sin(mt * 25) * 1.2; q.flameLean = 0.04 * j; }
          if (mode === 'loop' || mode === 'enter') { q.bob = Math.max(0, Math.sin(t * 6 + id * 2)) * 0.04; q.swing = Math.sin(t * 6 + id) * 0.8; }
          if (mode === 'squeezed') { const e = cl((s.squeeze || 0) * 0.85 + mt * 0.22, 0, 1); q.sy -= 0.1 * e; q.sx = 1 + 0.08 * e; q.lean = (id === 2 ? 0.1 : -0.12) * e; q.swing = Math.sin(t * 14) * e; q.beret = 0.3 * e; q.flameLean = 0.05 * e; }
          if (shk) { q.lean += shk * 0.15; q.bob += Math.abs(shk) * 0.04; }
          if (id === 1) drawVesna(ctx, q, lw0(ps), t); else if (id === 2) drawOttoline(ctx, q, lw0(ps), t); else drawScrawl(ctx, q, lw0(ps), t);
          ctx.restore();
        } });
        // idle gag: a Pew Mite peeking out from behind the dais
        if (mode === 'idle' && S.imite >= 0 && S.imite < 2.6) {
          const u = S.imite, out = seg(u, 0.3, 0.9) * (1 - seg(u, 1.4, 2.2)), x0 = posterPos[0][0] + 1.0 + (S.sneakX || 0), mx3 = lerp(x0 + 0.5, x0, out), mz3 = lerp(snailZ - 0.2, posterPos[0][1] - 0.25, out);
          const face = u < 1.35 ? -1 : 1, flip = bump(u, 1.3, 1.55);
          items.push({ z: mz3, d: () => { P(mx3, 0.0, mz3); const ps = PS * 0.95; ctx.save(); ctx.translate(PX, PY - flip * ps * 0.3); ctx.rotate(flip * 2.5 * face); ctx.scale(ps, ps * vy); drawMite(ctx, u * 1.3, Math.max(0, Math.sin(u * 20)) * 0.5 + flip, lw0(ps), face); ctx.restore(); } });
          if (S.prevMU !== undefined && S.prevMU < 1.32 && u >= 1.32) { P(mx3, 0.3, mz3); puff(PX, PY, 6, PS * 0.5, 'cob'); puff(PX, PY, 4, PS * 0.4, 'wood'); }
          S.prevMU = u;
        } else S.prevMU = undefined;
        // Pew Mites, bolts and the miracle (loop)
        const loopFx = [];
        if (mode === 'loop' || (mode === 'enter' && mt > 0.4)) {
          const L2 = mode === 'loop' ? lt : 0;
          // the miracle, drifting down from the belfry, then on the gold circle
          if (!S.holding && L2 < 4.1 && mode === 'loop') {
            const d = seg(L2, 0.0, 1.1), ox = 0, oz = lerp(snailZ - 0.05, -0.6, d), oy = lerp(3.5, 0.55, d) + Math.sin(t * 2.2) * 0.06;
            items.push({ z: oz, d: () => { P(ox, oy, oz); drawOrb(ctx, PX, PY, PS * lerp(0.1, 0.17, d)); } });
          }
          if (mode === 'loop') for (let i = 0; i < MITES.length; i++) {
            const m = MITES[i], ts = m[0], td = m[1];
            if (L2 < ts || L2 > td + 0.6) continue;
            const pd = pathAt(td), tgx = pd[0] * gx, tgz = pd[1];
            let sx0, sz0;
            if (m[2] === 0) { sx0 = (i % 2 ? 0.9 : -0.9); sz0 = snailZ - 0.4; }
            else { P(CAM.tx, 0, m[3]); const xl = CAM.tx - CAM.cx / PS, xr = CAM.tx + (w - CAM.cx) / PS; sx0 = m[2] < 0 ? xl - 0.5 : xr + 0.5; sz0 = m[3]; }
            const ang = Math.atan2(sz0 - tgz, sx0 - tgx), ex = tgx + Math.cos(ang) * 0.75, ez = tgz + Math.sin(ang) * 0.75;
            if (L2 <= td) {
              const u = (L2 - ts) / (td - ts), mx2 = lerp(sx0, ex, u), mz2 = lerp(sz0, ez, u) + Math.sin(L2 * 9 + i) * 0.06;
              const face = ex > sx0 ? 1 : -1;
              items.push({ z: mz2, d: () => { P(mx2, 0, mz2); const ps = PS; ctx.save(); ctx.translate(PX, PY); ctx.scale(ps * 1.05, ps * 1.05 * vy); drawMite(ctx, L2 + i, Math.max(0, Math.sin(L2 * 22 + i)) * 0.5, lw0(ps * 1.05), face); ctx.restore(); } });
              // the bolt that casts itself at this mite
              const tf = td - 0.3;
              if (L2 >= tf) {
                const u2 = (L2 - tf) / 0.3, pp = pathAt(tf), bx0 = pp[0] * gx + 0.2, bz0 = pp[1], by0 = 0.95;
                const bxx = lerp(bx0, ex, u2), bzz = lerp(bz0, ez, u2), byy = lerp(by0, 0.3, u2) + Math.sin(u2 * PI) * 0.35;
                loopFx.push(() => { P(bxx, byy, bzz); const a = PX, b2 = PY, r = PS * 0.11; P(ex, 0.3, ez); drawBolt(ctx, a, b2, Math.max(2, r), PX - a, PY - b2); });
              }
            }
            if (S.prevLt < td && L2 >= td) { P(ex, 0.25, ez); puff(PX, PY, 6, PS * 0.4, 'wood'); puff(PX, PY, 3, PS * 0.4, 'cob'); }
          }
        }
        items.push({ z: pimZ + 0.001, d: () => {
          P(pimX, 0, pimZ); const ps = PS; ctx.save(); ctx.translate(PX, PY); ctx.scale(ps, ps * vy);
          const m = ctx.getTransform();
          drawPim(ctx, p, lw0(ps), t, S.holding || (S.gag && S.gag.item === 'relic' && (S.gagOrb || 0) > 0.3));
          // where his head and staff tip are, in plate px
          const hd = toPlate(m, p.face * 0, -0.7 * p.sy - p.bob); S.head = hd;
          const sa = p.staffA, hx = 0.25 - p.armUp * 0.08, hy = -0.32 - p.armUp * 0.62;
          let tx = hx + Math.sin(sa) * 0.8, ty = hy - Math.cos(sa) * 0.8;
          const ca = Math.cos(p.lean), sn = Math.sin(p.lean); tx *= p.sx; ty *= p.sy; const rx = tx * ca - ty * sn, ry = tx * sn + ty * ca;
          S.tip = toPlate(m, rx * p.face, ry - p.bob);
          ctx.restore();
        } });
        items.sort((a, b) => a.z - b.z);
        for (const it of items) it.d();
        for (const fx of loopFx) fx();
        S.prevLt = mode === 'loop' ? lt : 0;

        // jar sparks, fizzles and the cue's charge (small, rounded, cobalt)
        if (!rm) {
          if (S.fizz && S.clock - S.fizz < 0.02 + dt) { puff(S.tip[0], S.tip[1], 6, Math.min(w, h) * 0.06, 'cob'); S.fizz = 0; }
          if (S.jarPop && S.clock - S.jarPop < 0.02 + dt) { puff(S.head[0], S.head[1] + Math.min(w, h) * 0.05, 5, Math.min(w, h) * 0.05, 'cob'); S.jarPop = 0; }
          if (mode === 'squeezed' && p.jar > 0.6 && R() < 0.25) puff(S.head[0], S.head[1] + Math.min(w, h) * 0.06, 1, Math.min(w, h) * 0.04, 'cob');
          if (S.gag && !S.gag.thrown && S.clock - S.gag.t0 > 0.8) {
            S.gag.thrown = true;
            api.emit({ type: 'throw', item: S.gag.item, x: S.tip[0], y: S.tip[1], vx: 1, vy: -0.45 });
            if (S.gag.item === 'bolt') puff(S.tip[0], S.tip[1], 6, Math.min(w, h) * 0.05, 'cob');
          }
          if (S.gag && S.gag.item === 'bolt') { const u = S.clock - S.gag.t0; if (u > 0.2 && u < 0.8) { const r = Math.min(w, h) * (0.02 + u * 0.04); drawBolt(ctx, S.tip[0], S.tip[1], r, 1, -0.4); } }
        }
        drawParts(ctx, dt, Math.min(w, h));

        // the game's own HUD bit in play: a gold-ringed level badge (static numeral)
        if (k > 0.92 && mode === 'loop') {
          const r = cl(Math.min(w, h) * 0.05, 8, 18), x = r + Math.max(6, r * 0.6), y = r + Math.max(6, r * 0.6);
          ctx.fillStyle = INDIGO; ctx.strokeStyle = '#e4b53c'; ctx.lineWidth = Math.max(1.5, r * 0.18);
          ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
          ctx.strokeStyle = OUT; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r + ctx.lineWidth + r * 0.09, 0, TAU); ctx.stroke();
          ctx.fillStyle = IVORY; ctx.font = '700 ' + Math.round(r * 1.15) + 'px Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('7', x, y + r * 0.06);
        }

        S.anc = { x: cl(S.head[0] / w, 0.06, 0.94), y: cl(S.head[1] / h, 0.08, 0.92) };
      },
      on(evt) {
        if (!evt || S.rm) return;
        if (evt.type === 'cue') { S.gagN++; S.gag = { t0: S.clock, item: S.gagN % 3 === 0 ? 'relic' : 'bolt', thrown: false }; S.gagOrb = 0; }
        else if (evt.type === 'hit') {
          const x = evt.x || 0, y = evt.y || 0; S.hit = { t0: S.clock, dir: x < S.head[0] ? 1 : -1 };
          const sz = Math.min(S.w, S.h); puff(x, y, 7, sz * 0.06, evt.item === 'bolt' ? 'cob' : 'dust'); puff(x, y, 4, sz * 0.05, 'dust');
        } else if (evt.type === 'look') S.look = { t0: S.clock, dx: evt.dx || 0, dy: evt.dy || 0 };
        else if (evt.type === 'shake') S.shake = { t0: S.clock, a: cl(evt.amount || 0.6, 0.2, 1) };
      },
      anchor() { return S.anc; }
    };
  }
};
