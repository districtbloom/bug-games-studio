BUG_MODS.perlune = {
  key: 'perlune',
  no: '···',
  title: 'Perlune',
  maker: '···',
  kind: 'Evolving shooter',
  verb: 'Absorb.',
  ground: '#05040A',
  ink: '#FF5C9A',
  rants: ['!?', '…', 'hmph', '#@$%'],
  hits: ['plip!', '!'],
  items: {
    // a bead of liquid pearl flicked off the droplet (~20 px): the droplet's own sky-over-horizon chrome
    bead(ctx, x, y, t, a) {
      t = t || 0; a = a || 0;
      const r = 10, w = Math.sin(t * 17) * 0.09, ca = Math.cos(a), sa = Math.sin(a), k1 = 1.12 + w, k2 = 0.9 - w;
      ctx.save();
      ctx.translate(x, y);
      ctx.globalCompositeOperation = 'lighter';
      const gl = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 2.2);
      gl.addColorStop(0, 'rgba(255,140,200,0.30)'); gl.addColorStop(1, 'rgba(255,92,154,0)');
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(0, 0, r * 2.2, 0, 6.2832); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.transform(ca * ca * k1 + sa * sa * k2, ca * sa * (k1 - k2), ca * sa * (k1 - k2), sa * sa * k1 + ca * ca * k2, 0, 0);
      const g = ctx.createLinearGradient(0, -r, 0, r);
      g.addColorStop(0, '#d8ccf2'); g.addColorStop(0.34, '#9f90bb'); g.addColorStop(0.45, '#fdf8ff'); g.addColorStop(0.53, '#958ca2'); g.addColorStop(1, '#4e4759');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.2832); ctx.fill();
      const f = ctx.createRadialGradient(0, 0, r * 0.55, 0, 0, r);
      f.addColorStop(0, 'rgba(255,154,213,0)'); f.addColorStop(0.7, 'rgba(255,154,213,0.18)'); f.addColorStop(1, 'rgba(255,110,200,0.9)');
      ctx.fillStyle = f; ctx.fill();
      const c = ctx.createLinearGradient(-r, r, r * 0.2, 0);
      c.addColorStop(0, 'rgba(95,243,255,0.75)'); c.addColorStop(1, 'rgba(95,243,255,0)');
      ctx.strokeStyle = c; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(0, 0, r - 0.8, 1.6, 3.6); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.beginPath(); ctx.ellipse(-r * 0.4, -r * 0.42, r * 0.2, r * 0.12, -0.6, 0, 6.2832); ctx.fill();
      ctx.restore();
    }
  },
  create(api) {
    const rnd = api && api.rnd ? api.rnd : Math.random;
    const BEAD = (this && this.items && this.items.bead) || null;
    const emit = api && api.emit ? api.emit : () => {};
    const TAU = Math.PI * 2;
    const sin = Math.sin, cos = Math.cos, sqrt = Math.sqrt, abs = Math.abs, exp = Math.exp, pow = Math.pow, floor = Math.floor;
    const cl = (v, a, b) => (v < a ? a : v > b ? b : v);
    const lerp = (a, b, k) => a + (b - a) * k;
    const sst = (a, b, x) => { const k = cl((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
    const eOut = (k) => { k = cl(k, 0, 1); return 1 - (1 - k) * (1 - k) * (1 - k); };
    const eIn = (k) => { k = cl(k, 0, 1); return k * k; };
    const elastic = (k) => (k >= 1 ? 1 : k <= 0 ? 0 : 1 - exp(-6 * k) * cos(k * 13)); // the game's grow easing
    const damp = (a, b, k, dt) => a + (b - a) * (1 - exp(-k * dt)); // the game's damp
    const h1 = (n) => { const s = sin(n * 127.1 + 311.7) * 43758.5453; return s - floor(s); };
    const h2 = (x, y) => { const s = sin(x * 127.1 + y * 311.7) * 43758.5453; return s - floor(s); };
    const h3 = (x, y, z) => { const s = sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - floor(s); };
    const rr = (a, b) => a + (b - a) * rnd();

    // shared, one-time data (every plate of this game reuses it)
    const SH = (this && typeof this === 'object') ? (this._sh || (this._sh = {})) : {};
    const mkCanvas = (w, h) => {
      try { if (typeof OffscreenCanvas !== 'undefined') { const c = new OffscreenCanvas(w, h), x = c.getContext('2d'); if (x) return { c, x }; } } catch (e) { /* no offscreen */ }
      return null;
    };

    /* ---------------- the poster's camera ----------------
       Calibrated from the game's own title-screen staging used for the poster (titlejs: Nacre, cam -0.33, face -0.2,
       dist 5.6, up 1.1, ty 0.25, fov 0.62, side 0.8; key light [-0.6, 0.45, -0.55] from the Eclipse side).
       World units: the droplet's radius is 1 (title scale). Everything below is relative to the droplet's centre. */
    const W0 = 1600, H0 = 800, TH = Math.tan(0.31), CX0 = 975.169, CY0 = 458.401, RP0 = 222.243;
    const OW = [4.615076, 1.1, 3.171919];                 // camera − droplet (world)
    const FW = [-0.885995, -0.148592, -0.439242], RW = [0.444173, 0, -0.895941], UW = [-0.13313, 0.988899, -0.066001];
    const XB = [0.718851, 0, -0.695164], ZB = [0.695164, 0, 0.718851]; // the creature's frame (Y = world up)
    const LW = [-0.847317, 0.413962, 0.332701];             // key light
    const CN = [-6.22813, 21.55094, -1.73704];              // droplet − Nacre's centre (the env's "up")
    const T0 = 7.55;                                        // the poster's moment (R.time): wobble, env sweep, bounce
    const B0 = sin(T0 * 9) * 0.03;
    const DEPTH0 = 5.6456;
    const PJ = [0, 0, 0];
    function proj(x, y, z) { // world offset from the droplet -> poster px offset / RP0 (u right, v down), depth
      const qx = x - OW[0], qy = y - OW[1], qz = z - OW[2];
      const zz = qx * FW[0] + qy * FW[1] + qz * FW[2];
      const xx = qx * RW[0] + qz * RW[2], yy = qx * UW[0] + qy * UW[1] + qz * UW[2];
      const k = (H0 / 2) / (zz * TH);
      PJ[0] = (W0 / 2 + xx * k - CX0) / RP0; PJ[1] = (H0 / 2 - yy * k - CY0) / RP0; PJ[2] = zz;
      return PJ;
    }

    /* ---------------- the body: the game's LIQUID material, evaluated per pixel once ----------------
       engine.js SCULPT_FS m==6 with GLSL_ENV (Nacre's studio, blended with space as blendPalettes does),
       the vertex wobble (wob 0.07), film(), ACES, sat 1.12, gamma 2.2 — at the poster's moment T0. */
    const lin = (hx) => [(hx >> 16) & 255, (hx >> 8) & 255, hx & 255].map((c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : pow((c + 0.055) / 1.055, 2.4); });
    const SPACE = [0x05030c, 0x2a1650, 0x3ff2ff, 0xffe8f6], NAC = [0x0b0716, 0x5b3a8a, 0xff9ad5, 0xfff2fb];
    const EV = SPACE.map((s, i) => { const a = lin(s), b = lin(NAC[i]); return [0, 1, 2].map((j) => (0.25 * a[j] + 3 * b[j]) / 3.25); });
    const PC = lin(0x2e1d42).map((c) => c * 6 / 3.25 + 0.02), TINT = [0.92, 0.93, 0.98];
    const OB = [OW[0] * XB[0] + OW[2] * XB[2], OW[1], OW[0] * ZB[0] + OW[2] * ZB[2]], OO = OB[0] * OB[0] + OB[1] * OB[1] + OB[2] * OB[2];
    const TW = T0 + 7, WOB = 0.07, MARG = 1.13;
    const aces = (x) => cl((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0, 1);
    const SHO = [0, 0, 0, 0];
    function shade(u, v, ppu) {
      const px = CX0 + u * RP0, py = CY0 + v * RP0;
      const nx = (px / W0 * 2 - 1) * TH * 2, ny = (1 - py / H0 * 2) * TH;
      let dx = FW[0] + RW[0] * nx + UW[0] * ny, dy = FW[1] + UW[1] * ny, dz = FW[2] + RW[2] * nx + UW[2] * ny;
      let l = 1 / sqrt(dx * dx + dy * dy + dz * dz); dx *= l; dy *= l; dz *= l;
      const bx = dx * XB[0] + dz * XB[2], by = dy, bz = dx * ZB[0] + dz * ZB[2];
      const od = OB[0] * bx + OB[1] * by + OB[2] * bz, perp = sqrt(Math.max(0, OO - od * od));
      let rad = 1, hx = 0, hy = 0, hz = 0, n0 = 0, n1 = 0, n2 = 0, s1 = 0, s2 = 0, s3 = 0;
      for (let it = 0; it < 3; it++) {
        const disc = od * od - (OO - rad * rad), tt = disc > 0 ? -od - sqrt(disc) : -od;
        hx = OB[0] + bx * tt; hy = OB[1] + by * tt; hz = OB[2] + bz * tt;
        const hl = 1 / sqrt(hx * hx + hy * hy + hz * hz); n0 = hx * hl; n1 = hy * hl; n2 = hz * hl;
        s1 = n0 * 3.1 + n1 * 1.7 + n2 * 2.3 + TW * 4.1; s2 = -n0 * 1.9 + n1 * 2.9 + n2 * 1.3 + TW * 3.3; s3 = n0 * 1.3 - n1 * 2.1 + n2 * 3.7 - TW * 5.2;
        rad = 1 + (sin(s1) + sin(s2) + sin(s3)) * WOB / 3;
      }
      const cover = cl((rad - perp) * ppu + 0.5, 0, 1);
      SHO[3] = cover; if (cover <= 0) return SHO;
      const c1 = cos(s1), c2 = cos(s2), c3 = cos(s3), kw = WOB / 3;
      const gx = (3.1 * c1 - 1.9 * c2 + 1.3 * c3) * kw, gy = (1.7 * c1 + 2.9 * c2 - 2.1 * c3) * kw, gz = (2.3 * c1 + 1.3 * c2 + 3.7 * c3) * kw;
      const gn = gx * n0 + gy * n1 + gz * n2;
      let mx = n0 - (gx - n0 * gn), my = n1 - (gy - n1 * gn), mz = n2 - (gz - n2 * gn);
      l = 1 / sqrt(mx * mx + my * my + mz * mz); mx *= l; my *= l; mz *= l;
      const Nx = mx * XB[0] + mz * ZB[0], Ny = my, Nz = mx * XB[2] + mz * ZB[2];
      const pwx = hx * XB[0] + hz * ZB[0], pwy = hy, pwz = hx * XB[2] + hz * ZB[2];
      let Vx = OW[0] - pwx, Vy = OW[1] - pwy, Vz = OW[2] - pwz; l = 1 / sqrt(Vx * Vx + Vy * Vy + Vz * Vz); Vx *= l; Vy *= l; Vz *= l;
      const ndv = Nx * Vx + Ny * Vy + Nz * Vz, nv = cl(ndv, 0, 1), fr = pow(1 - nv, 4);
      const Rx = 2 * ndv * Nx - Vx, Ry = 2 * ndv * Ny - Vy, Rz = 2 * ndv * Nz - Vz;
      let ux = CN[0] + pwx, uy = CN[1] + pwy, uz = CN[2] + pwz; l = 1 / sqrt(ux * ux + uy * uy + uz * uz); ux *= l; uy *= l; uz *= l;
      // env(R, up)
      const y = Rx * ux + Ry * uy + Rz * uz;
      let sx = uy * 0.46 - uz * 0.83, sy = uz * 0.31 - ux * 0.46, sz = ux * 0.83 - uy * 0.31; l = 1 / sqrt(sx * sx + sy * sy + sz * sz); sx *= l; sy *= l; sz *= l;
      const qx = uy * sz - uz * sy, qy = uz * sx - ux * sz, qz = ux * sy - uy * sx;
      const az = Math.atan2(Rx * sx + Ry * sy + Rz * sz, Rx * qx + Ry * qy + Rz * qz);
      const sw = sin(az * 3 + T0 * 0.15 + y * 4);
      const k1 = sst(0.15, 1, y) * 0.8;
      const s7 = sin(y * 7 + sw * 1.3), k2 = s7 > 0 ? pow(s7, 14) * 2.2 * sst(-0.05, 0.1, y) : 0;
      const k3 = sst(0.965, 0.998, sin(y * 4 + 1.1 + sw * 0.25)) * 3.2 + sst(0.988, 1, sin(az * 2 + 0.7)) * sst(0.1, 0.6, y) * 3;
      const gk = 0.3 + 0.25 * sin(az * 7 + y * 24), kg = sst(0.02, -0.2, y), kh = exp(-abs(y + 0.01) * 50) * 1.3;
      const dif = Math.max(Nx * LW[0] + Ny * LW[1] + Nz * LW[2], 0), rl = Math.max(Rx * LW[0] + Ry * LW[1] + Rz * LW[2], 0), spec = pow(rl, 48);
      const fc = nv * 1.2 + 1, f2 = (1 - nv) * (1 - nv) * 0.5;
      const lum = [0, 0, 0];
      for (let j = 0; j < 3; j++) {
        let e = EV[0][j] + EV[1][j] * k1 + EV[2][j] * k2 + EV[3][j] * k3;
        e = e * (1 - kg) + PC[j] * gk * kg + EV[3][j] * kh;
        const film = 0.5 + 0.5 * cos(6.2832 * (fc + j * 0.33 + (j === 2 ? 0.01 : 0)));
        const col = e * TINT[j] * (0.5 + 0.6 * fr) + TINT[j] * (0.1 + 0.32 * dif) + film * f2 + spec * 3;
        lum[j] = aces(col * 0.95);
      }
      const L = lum[0] * 0.299 + lum[1] * 0.587 + lum[2] * 0.114;
      for (let j = 0; j < 3; j++) SHO[j] = pow(cl(L + (lum[j] - L) * 1.12, 0, 1), 1 / 2.2) * 255;
      return SHO;
    }
    function newLevel(Rs) {
      const N = 2 * Math.ceil(Rs * MARG) + 2, cv = mkCanvas(N, N);
      if (!cv) return null;
      return { Rs, N, cv, img: cv.x.createImageData(N, N), row: 0, ready: false };
    }
    function stepLevel(L, rows) {
      if (!L || L.ready) return;
      const N = L.N, d = L.img.data, r0 = L.row, r1 = Math.min(N, r0 + rows);
      for (let j = r0; j < r1; j++) {
        const v = (j + 0.5 - N / 2) / L.Rs;
        for (let i = 0; i < N; i++) {
          const u = (i + 0.5 - N / 2) / L.Rs, o = (j * N + i) * 4;
          if (u * u + v * v > MARG * MARG) { d[o + 3] = 0; continue; }
          const c = shade(u, v, L.Rs);
          if (c[3] <= 0) { d[o + 3] = 0; continue; }
          d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = c[3] * 255;
        }
      }
      L.cv.x.putImageData(L.img, 0, 0, 0, r0, N, r1 - r0);
      L.row = r1; if (r1 >= N) { L.ready = true; L.img = null; }
    }
    if (!SH.lv) {
      SH.lv = [newLevel(44), newLevel(118), newLevel(236)];
      if (SH.lv[0]) stepLevel(SH.lv[0], 1e9);
    }
    const LV = SH.lv;

    /* ---------------- small sprites: glows and dust motes (additive) ---------------- */
    function glowSprite(rgb, core) {
      const c = mkCanvas(64, 64); if (!c) return null;
      const g = c.x.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, `rgba(${core || rgb},1)`); g.addColorStop(0.18, `rgba(${rgb},0.75)`); g.addColorStop(0.45, `rgba(${rgb},0.22)`); g.addColorStop(1, `rgba(${rgb},0)`);
      c.x.fillStyle = g; c.x.fillRect(0, 0, 64, 64); return c.c;
    }
    if (!SH.gl) {
      SH.gl = {
        white: glowSprite('255,255,255'), pink: glowSprite('255,92,154', '255,236,246'), cyan: glowSprite('95,243,255', '236,255,255'),
        lav: glowSprite('214,190,255', '255,250,255'), rose: glowSprite('255,150,205', '255,245,250'), hot: glowSprite('255,46,106', '255,220,230'),
        gem: glowSprite('255,198,234', '255,250,253'), bead: glowSprite('232,251,255', '255,255,255'), streak: glowSprite('158,199,255', '235,245,255')
      };
      // title dust: mix(pink, cyan, seed.y), 5 bins
      SH.mote = [0, 0.25, 0.5, 0.75, 1].map((k) => {
        const p = [255, 92, 154], q = [95, 243, 255];
        const c = p.map((v, i) => Math.round(lerp(v, q[i], k)));
        const cv = mkCanvas(32, 32); if (!cv) return null;
        const g = cv.x.createRadialGradient(16, 16, 0, 16, 16, 16), cc = c.join(','), core = c.map((v) => Math.round(lerp(v, 255, 0.55))).join(',');
        g.addColorStop(0, `rgba(${core},1)`); g.addColorStop(0.22, `rgba(${cc},0.95)`); g.addColorStop(0.45, `rgba(${cc},0.4)`); g.addColorStop(0.7, `rgba(${cc},0.1)`); g.addColorStop(1, `rgba(${cc},0)`);
        cv.x.fillStyle = g; cv.x.fillRect(0, 0, 32, 32); return cv.c;
      });
    }
    const GL = SH.gl;
    function glow(ctx, spr, x, y, r, a, sx, sy) {
      if (a <= 0.003 || r <= 0.2) return;
      ctx.globalAlpha = cl(a, 0, 1);
      if (spr) ctx.drawImage(spr, x - r * (sx || 1), y - r * (sy || 1), 2 * r * (sx || 1), 2 * r * (sy || 1));
      else { ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.ellipse(x, y, r * 0.5 * (sx || 1), r * 0.5 * (sy || 1), 0, 0, TAU); ctx.fill(); }
    }

    /* ---------------- noise + contour lines (marching squares, chained) ---------------- */
    function vn2(x, y) {
      const xi = floor(x), yi = floor(y); let xf = x - xi, yf = y - yi; xf = xf * xf * (3 - 2 * xf); yf = yf * yf * (3 - 2 * yf);
      const a = h2(xi, yi), b = h2(xi + 1, yi), c = h2(xi, yi + 1), d = h2(xi + 1, yi + 1);
      return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
    }
    const fbm2 = (x, y) => (vn2(x, y) * 0.5 + vn2(x * 2.03 + 5.2, y * 2.03 + 1.3) * 0.25 + vn2(x * 4.07 + 9.1, y * 4.07 + 3.7) * 0.125) / 0.875;
    function gn2(x, y) { // gradient noise, quintic fade
      const xi = floor(x), yi = floor(y), xf = x - xi, yf = y - yi;
      const d = (i, j) => { const a = h2(xi + i, yi + j) * TAU; return cos(a) * (xf - i) + sin(a) * (yf - j); };
      const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10), v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
      return lerp(lerp(d(0, 0), d(1, 0), u), lerp(d(0, 1), d(1, 1), u), v);
    }
    const gfbm = (x, y) => gn2(x, y) * 0.7 + gn2(x * 2.01 + 3.7, y * 2.01 + 8.1) * 0.3;
    function chaikin(l, it) {
      for (let k = 0; k < it; k++) {
        const n = l.length / 2, closed = n > 3 && abs(l[0] - l[l.length - 2]) < 1e-6 && abs(l[1] - l[l.length - 1]) < 1e-6, o = [];
        if (!closed) o.push(l[0], l[1]);
        for (let i = 0; i < n - 1; i++) { const x0 = l[i * 2], y0 = l[i * 2 + 1], x1 = l[i * 2 + 2], y1 = l[i * 2 + 3]; o.push(x0 * 0.75 + x1 * 0.25, y0 * 0.75 + y1 * 0.25, x0 * 0.25 + x1 * 0.75, y0 * 0.25 + y1 * 0.75); }
        if (closed) o.push(o[0], o[1]); else o.push(l[l.length - 2], l[l.length - 1]);
        l = o;
      }
      return l;
    }
    function vn3(x, y, z) {
      const xi = floor(x), yi = floor(y), zi = floor(z); let xf = x - xi, yf = y - yi, zf = z - zi;
      xf = xf * xf * (3 - 2 * xf); yf = yf * yf * (3 - 2 * yf); zf = zf * zf * (3 - 2 * zf);
      const L = (a, b, k) => a + (b - a) * k;
      return L(L(L(h3(xi, yi, zi), h3(xi + 1, yi, zi), xf), L(h3(xi, yi + 1, zi), h3(xi + 1, yi + 1, zi), xf), yf),
        L(L(h3(xi, yi, zi + 1), h3(xi + 1, yi, zi + 1), xf), L(h3(xi, yi + 1, zi + 1), h3(xi + 1, yi + 1, zi + 1), xf), yf), zf);
    }
    function march(nx, ny, val, lev, X0, Y0, D) {
      const W = nx + 1, pts = new Map(), adj = new Map(), segs = [];
      const eid = (i, j, v) => (j * W + i) * 2 + v;
      const pt = (id) => {
        if (pts.has(id)) return; const v = id & 1, k = id >> 1, i = k % W, j = (k - i) / W;
        const a = val[j * W + i], b = v ? val[(j + 1) * W + i] : val[j * W + i + 1], f = (lev - a) / (b - a);
        pts.set(id, v ? [X0 + i * D, Y0 + (j + f) * D] : [X0 + (i + f) * D, Y0 + j * D]);
      };
      const add = (p, q) => { pt(p); pt(q); const s = segs.length; segs.push([p, q]); for (const e of [p, q]) { if (!adj.has(e)) adj.set(e, []); adj.get(e).push(s); } };
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const a = val[j * W + i] > lev, b = val[j * W + i + 1] > lev, c = val[(j + 1) * W + i + 1] > lev, d = val[(j + 1) * W + i] > lev;
        const code = (a ? 1 : 0) | (b ? 2 : 0) | (c ? 4 : 0) | (d ? 8 : 0); if (code === 0 || code === 15) continue;
        const T = eid(i, j, 0), R = eid(i + 1, j, 1), B = eid(i, j + 1, 0), Lf = eid(i, j, 1);
        switch (code) {
          case 1: case 14: add(Lf, T); break; case 2: case 13: add(T, R); break; case 3: case 12: add(Lf, R); break;
          case 4: case 11: add(R, B); break; case 6: case 9: add(T, B); break; case 7: case 8: add(Lf, B); break;
          case 5: add(Lf, T); add(R, B); break; case 10: add(T, R); add(B, Lf); break;
        }
      }
      const used = new Uint8Array(segs.length), lines = [];
      for (let s0 = 0; s0 < segs.length; s0++) {
        if (used[s0]) continue; used[s0] = 1;
        const chain = [segs[s0][0], segs[s0][1]];
        for (const dir of [1, 0]) {
          for (;;) {
            const end = dir ? chain[chain.length - 1] : chain[0];
            const nb = (adj.get(end) || []).find((s) => !used[s]); if (nb === undefined) break;
            used[nb] = 1; const nxt = segs[nb][0] === end ? segs[nb][1] : segs[nb][0];
            if (dir) chain.push(nxt); else chain.unshift(nxt);
          }
        }
        const arr = []; for (const id of chain) { const p = pts.get(id); arr.push(p[0], p[1]); }
        lines.push(arr);
      }
      return lines;
    }
    const toPath = (lines, minPts) => {
      const P = new Path2D();
      for (const l of lines) { if (l.length < minPts * 2) continue; P.moveTo(l[0], l[1]); for (let i = 2; i < l.length; i += 2) P.lineTo(l[i], l[i + 1]); }
      return P;
    };

    /* ---------------- the sky: faint contour lines (the game's nebula lines) and stars ---------------- */
    if (!SH.sky) {
      const X0 = -9.5, Y0 = -8, D = 0.12, nx = 134, ny = 98, val = new Float32Array((nx + 1) * (ny + 1));
      for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
        const x = (X0 + i * D) * 0.42, y = (Y0 + j * D) * 0.42;
        const wx = x + gfbm(x + 3.3, y + 1.1) * 1.3, wy = y + gfbm(x + 13.1, y + 7.7) * 1.3;
        val[j * (nx + 1) + i] = gfbm(wx * 0.9, wy * 0.9);
      }
      const groups = [[], [], []];
      [-0.16, 0.0, 0.17].forEach((lv, k) => { for (const l of march(nx, ny, val, lv, X0, Y0, D)) groups[k].push(chaikin(l, 2)); });
      SH.sky = groups.map((g) => toPath(g, 10));
      const stars = [];
      for (let i = 0; i < 150; i++) {
        const b = h1(i + 0.5);
        stars.push({ x: -9.5 + h1(i * 1.7 + 2.1) * 16, y: -8 + h1(i * 2.3 + 7.9) * 11.5, a: b < 0.85 ? 0.18 + b * 0.35 : 0.65 + (b - 0.85) * 2,
          r: b < 0.85 ? 0.55 : 1.0, ph: h1(i + 4.4) * TAU, sp: 1 + h1(i + 9.1) * 3, c: h1(i + 3.3) < 0.5 ? '255,226,246' : '196,232,255' });
      }
      SH.stars = stars;
      // the Eclipse's veins: amber contour lines of a 3D field on the sphere (foreshortened at the limb)
      const vN = 60, vv = new Float32Array((vN + 1) * (vN + 1));
      for (let j = 0; j <= vN; j++) for (let i = 0; i <= vN; i++) {
        const x = -1 + 2 * i / vN, y = -1 + 2 * j / vN, q = 1 - x * x - y * y, z = q > 0 ? sqrt(q) : 0;
        vv[j * (vN + 1) + i] = vn3(x * 2.6 + 4.1, y * 2.6 + 1.7, z * 2.6 + 8.3) * 0.7 + vn3(x * 6.2, y * 6.2 + 3, z * 6.2) * 0.3;
      }
      const vl = []; [0.43, 0.6].forEach((lv) => { for (const l of march(vN, vN, vv, lv, -1, -1, 2 / vN)) vl.push(chaikin(l, 2)); });
      SH.veins = toPath(vl, 4);
      // the sunburst (juice.js drawSunburst): 44 rays, 4 colours, 5 lengths, alternate strength
      const SUN = ['255,194,61', '255,63,180', '178,140,255', '255,122,43'];
      SH.rays = []; for (let i = 0; i < 44; i++) SH.rays.push({ a: i / 44 * TAU, len: 0.55 + 0.45 * ((i * 7) % 5) / 4, c: SUN[i % 4], k: i % 2 ? 0.6 : 1 });
      // the title dust (flow.js: rmin 1.2, rmax 2.2, speed 1.2, bias 0.8, size 0.06, 200 motes, flat 0.6)
      const dust = [];
      for (let i = 0; i < 200; i++) {
        const sx = h1(i * 3.1 + 0.3), sy = h1(i * 5.7 + 1.9), sz = h1(i * 7.3 + 4.2), sw = h1(i * 2.9 + 8.8);
        const th = sx * TAU, ph = Math.acos(sy * 2 - 1);
        let p = [sin(ph) * cos(th), cos(ph), sin(ph) * sin(th)];
        let ax = [sin(sz * TAU), sw - 0.5, cos(sz * TAU)]; let l = Math.hypot(ax[0], ax[1], ax[2]); ax = ax.map((v) => v / l * 0.2);
        ax[1] += 0.8; l = Math.hypot(ax[0], ax[1], ax[2]); ax = ax.map((v) => v / l);
        const pa = p[0] * ax[0] + p[1] * ax[1] + p[2] * ax[2]; p = p.map((v, j) => v - ax[j] * pa * 0.6); l = Math.hypot(p[0], p[1], p[2]); p = p.map((v) => v / l);
        const fr = (sw * 7.31 + sx * 3.1) % 1;
        dust.push({ p, ax, r: 1.2 + fr, sp: 1.2 * (0.55 + sy * 0.9), ph: sz * TAU, size: 0.06 * (0.5 + sw), bin: Math.round(sst(0.12, 0.88, sy) * 4), sx, sy, sz });
      }
      SH.dust = dust;
    }

    /* ---------------- layout: recompose for any plate ----------------
       Keys from the three posters (2:1, 1:1, 2:3) extended to a 1:2.3 column and a 3.5:1 strip. */
    const LA = [-1.2, -0.585, 0, 0.5, 1, 1.8];
    const TB = {
      R: [0.117, 0.16, 0.2165, 0.251, 0.2778, 0.2875],
      cx: [0.57, 0.573, 0.62, 0.615, 0.6095, 0.635],
      cy: [0.775, 0.748, 0.635, 0.603, 0.573, 0.56],
      ex: [0.37, 0.344, 0.3375, 0.347, 0.3542, 0.335],
      ey: [0.37, 0.368, 0.333, 0.338, 0.3474, 0.365],
      es: [1.12, 1.07, 0.9, 0.915, 0.929, 0.94]
    };
    const tab = (arr, la) => {
      if (la <= LA[0]) return arr[0];
      for (let i = 1; i < LA.length; i++) if (la <= LA[i]) return lerp(arr[i - 1], arr[i], (la - LA[i - 1]) / (LA[i] - LA[i - 1]));
      return arr[arr.length - 1];
    };
    function layout(w, h, o) {
      const la = Math.log2(w / h);
      o.R = tab(TB.R, la) * h; o.cx = tab(TB.cx, la) * w; o.cy = tab(TB.cy, la) * h;
      o.ex = tab(TB.ex, la) * w; o.ey = tab(TB.ey, la) * h; o.rp = tab(TB.es, la) * o.R / 3;
      return o;
    }

    /* ---------------- state (the game's P life fields) ---------------- */
    const S = {
      mode: 'idle', clock: 0, phase: 'hold', phaseT: rr(1.6, 3.2), beat: null, beatT: rr(0.4, 1.0),
      blinkT: rr(1.8, 5.2), lookX: -0.7, lookY: 0.9, joyT: 0, spinT: 0, jig: 0, absorbT: 0, hurtT: 9,
      slx: 0, sly: 0, svx: 0, svy: 0, offX: 0, offY: 0, ovx: 0, ovy: 0, bobA: 0, bA: 0, sqA: 0, sqV: 0, sqD: 0,
      gag: null, gagN: 0, lookEvt: null, splash: [], drink: null, from: null, last: null,
      head: { x: 0.57, y: 0.5 }, react: null
    };
    const LAY = { R: 0, cx: 0, cy: 0, ex: 0, ey: 0, rp: 0 }, LAY2 = { R: 0, cx: 0, cy: 0, ex: 0, ey: 0, rp: 0 };
    const LOOP_L = 6;

    // the pose that frame() draws, rebuilt every frame
    const P = {
      cx: 0, cy: 0, R: 0, ax: 1, ay: 1, stx: 0, sty: 0, yaw: 0, lx: -0.7, ly: 0.9, ey: 1, ex: 1, joy: 0, lid: 0, lidT: 0,
      skyX: 0, skyY: 0, skyR: 1, ex_: 0, ey_: 0, rp: 1, rayA: 0, world: 0, wy: 0, wcx: 0, wR: 1, dust: 1, dustSpin: 0, dustA: 1,
      crest: 1, tint: 0, mass: 0, wall: 0, wallX: 0, bud: 0, budA: 0, bob: 0, drink: 0, drinkA: 0
    };

    function snapshot() { return { cx: P.cx, cy: P.cy, R: P.R, skyY: P.skyY, world: P.world, wy: P.wy, ax: P.ax, ay: P.ay, yaw: P.yaw }; }
    function onMode(prev, next) {
      if (next === 'idle' && prev !== 'idle') { S.from = snapshot(); S.fromMode = prev; S.phase = 'live'; S.phaseT = rr(2.5, 4); S.beat = null; S.beatT = 0.7; }
      if (next === 'react') { S.react = { x: P.cx, y: P.cy }; }
      if (next === 'enter') { S.enterFrom = snapshot(); }
      if (next === 'loop') { S.loopK = 0; }
    }

    /* ---------------- the life of the creature (updateCreatureLife + idle beats) ---------------- */
    function lifeUpdate(dt, s) {
      S.clock += dt;
      S.blinkT -= dt; if (S.blinkT < -0.02) S.blinkT = S.phase === 'hold' && s.mode === 'idle' ? rr(3.2, 5.2) : rr(1.8, 5.2);
      S.joyT = Math.max(0, S.joyT - dt); S.spinT = Math.max(0, S.spinT - dt); S.absorbT = Math.max(0, S.absorbT - dt * 3); S.hurtT += dt;
      S.jig *= exp(-dt * 5);
      // slosh: the liquid lags behind acceleration and overshoots (game constants 70 / 8)
      S.svx += (0 - S.slx) * 70 * dt; S.svy += (0 - S.sly) * 70 * dt; S.svx *= exp(-8 * dt); S.svy *= exp(-8 * dt);
      S.slx += S.svx * dt; S.sly += S.svy * dt;
      // body offset spring (staggers, recoils)
      S.ovx += (0 - S.offX) * 90 * dt; S.ovy += (0 - S.offY) * 90 * dt; S.ovx *= exp(-9 * dt); S.ovy *= exp(-9 * dt);
      S.offX += S.ovx * dt; S.offY += S.ovy * dt;
      // jelly squash (hits, shakes): compress along sqD and spring back with overshoot
      S.sqV += -S.sqA * 150 * dt; S.sqV *= exp(-6.5 * dt); S.sqA += S.sqV * dt;
      for (let i = S.splash.length - 1; i >= 0; i--) { const d = S.splash[i]; d.t += dt; d.vy += 600 * dt * d.g; d.x += d.vx * dt; d.y += d.vy * dt; if (d.t > d.life) S.splash.splice(i, 1); }
      if (S.lookEvt) { S.lookEvt.t -= dt; if (S.lookEvt.t <= 0) S.lookEvt = null; }
    }
    function idleBeats(dt, s) {
      S.phaseT -= dt;
      if (S.phaseT <= 0) {
        if (S.phase === 'live') { S.phase = 'hold'; S.phaseT = rr(1.5, 5); S.beat = null; }
        else { S.phase = 'live'; S.phaseT = rr(2.5, 6); S.beatT = rr(0.2, 0.6); }
      }
      if (S.phase === 'live') {
        if (S.beat) { S.beat.t += dt; if (S.beat.t > S.beat.dur) { S.beat = null; S.beatT = rr(0.5, 1.3); } }
        else if ((S.beatT -= dt) <= 0 && S.phaseT > 1.2) {
          const k = rnd(); let b;
          if (k < 0.34) b = { kind: 'glance', dur: rr(0.9, 1.6), lx: rr(-1, 1), ly: rr(-0.6, 0.7) };
          else if (k < 0.52) b = { kind: 'admire', dur: 1.3 };
          else if (k < 0.72) b = { kind: 'drink', dur: 1.25, a: rr(0, TAU) };
          else if (k < 0.86) b = { kind: 'shiver', dur: 0.7 };
          else b = { kind: 'hop', dur: 0.9 };
          b.t = 0; S.beat = b;
          if (b.kind === 'shiver') S.jig = Math.max(S.jig, 0.9);
          if (b.kind === 'admire') S.joyT = Math.max(S.joyT, 1.1);
        }
      }
    }

    /* ---------------- the eclipse look direction (eyes look at the Eclipse in the held pose) ---------------- */
    function lookAt(px, py, cx, cy, out) {
      const dx = px - cx, dy = py - cy, l = Math.hypot(dx, dy) || 1;
      out[0] = cl(dx / l * 0.77, -1, 1); out[1] = cl(-dy / l * 2 + 0.06, -1, 1); return out;
    }
    const LK = [0, 0];

    /* ---------------- gameplay loop (Nacre): beads, foes, matter ---------------- */
    // foes: [kind, spawn time, death time, lane offset]; times are within the 6 s cycle, a negative spawn means
    // it walks in during the end of the previous cycle (so the loop is seamless)
    const FOES = [
      { k: 'mite', s: -1.1, d: 1.25, y: 0, x0: 1.25, x1: 0.62 },
      { k: 'mite', s: -0.4, d: 2.75, y: 0.06, x0: 1.25, x1: 0.74 },
      { k: 'tumbler', s: 1.2, d: 4.2, y: -0.02, x0: 1.3, x1: 0.68 }
    ];
    const SHOTS = []; // [fire time, foe index]
    for (const [f, a, b] of [[0, 0.15, 1.2], [1, 1.7, 2.7], [2, 3.0, 4.15]]) for (let tt = a; tt < b - 0.05; tt += 0.22) SHOTS.push([tt, f]);
    const ABS = [1.95, 3.45, 4.85]; // matter reaches the droplet
    const CHANGE = 5.0;             // the bar is full: metamorphosis (spin + joy + rings on the ground)

    function loopState(mt, w, h, out) {
      const k = Math.floor(mt / LOOP_L), tc = mt - k * LOOP_L;
      let n = k * 3; for (const a of ABS) if (tc >= a) n++;
      // growth: each absorb adds a little, with the game's elastic ease; it saturates (+11%)
      let g = 0; for (let i = 0; i < n + 1; i++) { const ti = i < n ? 1 : 0; g += ti * 0.035 * pow(0.78, i); }
      for (const a of ABS) if (tc >= a && tc < a + 0.6) g += 0.035 * pow(0.78, k * 3 + ABS.indexOf(a)) * (elastic((tc - a) / 0.6) - 1);
      out.k = k; out.tc = tc; out.grow = 1 + g;
      let fill = 0; for (const a of ABS) fill += sst(a, a + 0.25, tc) / 3; fill *= 1 - sst(CHANGE + 0.15, CHANGE + 0.75, tc);
      out.fill = fill;
      return out;
    }
    const LS = { k: 0, tc: 0, grow: 1, fill: 0 };

    /* ---------------- frame ---------------- */
    function frame(ctx, s) {
      const w = s.w, h = s.h;
      if (!(w > 1 && h > 1)) return;
      const rm = !!s.rm;
      const dt = rm ? 0 : cl(s.dt || 0.016, 0, 0.05);
      const mode = rm ? 'idle' : (s.mode || 'idle');
      const mt = rm ? 0 : (s.mt || 0);
      let dpr = 1; try { const m = ctx.getTransform(); dpr = Math.hypot(m.a, m.b) || 1; } catch (e) { dpr = 1; }
      if (mode !== S.mode) { onMode(S.mode, mode); S.mode = mode; }
      if (!rm) lifeUpdate(dt, s);
      const T = T0 + S.clock;
      layout(w, h, LAY);
      buildPose(w, h, mode, mt, s, rm, T, dt);
      // refine the body sprite a few rows at a time when the plate needs more pixels
      const need = P.R * dpr * 1.05;
      if (LV[1] && !LV[1].ready && need > 40) stepLevel(LV[1], 14);
      else if (LV[2] && !LV[2].ready && need > 112) stepLevel(LV[2], 7);
      ctx.save();
      drawScene(ctx, w, h, mode, mt, s, rm, T, dpr);
      ctx.restore();
    }

    /* ---------------- pose ---------------- */
    function buildPose(w, h, mode, mt, s, rm, T, dt) {
      const L = LAY;
      P.cx = L.cx; P.cy = L.cy; P.R = L.R; P.ax = 1; P.ay = 1; P.stx = 0; P.sty = 0; P.yaw = 0; P.joy = 0; P.lid = 0; P.lidT = 0;
      P.skyX = L.cx; P.skyY = L.cy; P.skyR = L.R; P.ex_ = L.ex; P.ey_ = L.ey; P.rp = L.rp; P.world = 0;
      P.dust = 1; P.dustA = 1; P.crest = 1; P.tint = 0; P.mass = 0; P.wall = 0; P.bud = 0; P.bob = 0; P.drink = 0;
      P.rayA = 0.09 + (rm ? 0 : S.clock * 0.012);
      lookAt(L.ex, L.ey, L.cx, L.cy, LK); let tlx = LK[0], tly = LK[1];
      let ey = 1, ex = 1, bAmp = 1;
      if (rm) { P.lx = tlx; P.ly = tly; P.ey = 1; P.ex = 1; P.ax = 1 + B0; P.ay = 1 - B0; return; }

      if (mode === 'idle') {
        idleBeats(dt, s);
        const hold = S.phase === 'hold';
        S.bA = damp(S.bA, hold ? 0 : 1, 3, dt); bAmp = S.bA;
        S.bobA = damp(S.bobA, hold ? 0 : 1, 2, dt);
        P.bob = sin(S.clock * 1.7) * 0.035 * S.bobA;
        const b = S.beat;
        if (b) {
          const k = b.t / b.dur;
          if (b.kind === 'glance') { const g = sst(0, 0.15, k) * (1 - sst(0.8, 1, k)); tlx = lerp(tlx, b.lx, g); tly = lerp(tly, b.ly, g); }
          if (b.kind === 'admire') { const g = sst(0, 0.2, k) * (1 - sst(0.75, 1, k)); P.bob -= 0.06 * g; ey = 1 + 0.12 * g; }
          if (b.kind === 'hop') { const ph = k; P.bob -= sin(Math.min(1, ph * 1.4) * Math.PI) * 0.09; if (ph < 0.12) { P.ay *= 1 - 0.08 * sin(ph / 0.12 * Math.PI); } if (ph > 0.65 && ph < 0.8) S.jig = Math.max(S.jig, 0.35); }
          if (b.kind === 'drink') {
            // a passing pink mote is pulled in and absorbed (absorb(): jig + absorbT)
            if (b.t > 0.95 && !b.done) { b.done = true; S.absorbT = 1; S.jig += 0.25; S.sqD = b.a + Math.PI; S.sqV += 0.9; }
            P.drink = b.t < 0.95 ? b.t / 0.95 : 0; P.drinkA = b.a;
            const g = sst(0.1, 0.4, k) * (1 - sst(0.85, 1, k)); tlx = lerp(tlx, cos(b.a) * 0.9, g); tly = lerp(tly, -sin(b.a) * 0.9, g);
          }
        }
        // the cursor draws its eyes out of the plate (toward the viewer) as it comes near
        const nr = sst(0.25, 0.9, s.near || 0);
        tlx = lerp(tlx, 0.05, nr); tly = lerp(tly, 0.05, nr); ey *= 1 + 0.1 * nr;
        // settle back after hover / squeeze: a damped spring from the last pose
        if (S.from) {
          const f = S.from, k = exp(-mt * 7) * cos(mt * 11), k2 = exp(-mt * 6);
          if (mt > 1.2) S.from = null;
          else {
            P.cx = lerp(P.cx, f.cx, k2); P.cy = lerp(P.cy, f.cy, k2) ; P.R = lerp(P.R, f.R, k2);
            P.skyY = lerp(P.skyY, f.skyY, k2); P.ey_ += (f.skyY - L.cy) * k2; P.world = f.world > 0.01 ? 1 : 0; P.wy = lerp(h * 1.4, f.wy, k2);
            P.ay *= 1 + 0.12 * k * (S.fromMode === 'loop' || S.fromMode === 'enter' ? 1 : 0.5); P.ax *= 1 - 0.08 * k;
            P.yaw = f.yaw * k2;
          }
        }
      } else if (mode === 'react') {
        // startle: anticipation (squash) -> action (stretch up, eyes wide) -> hold
        const a = sst(0, 0.16, mt), up = sst(0.14, 0.34, mt), set = mt > 0.34 ? exp(-(mt - 0.34) * 6) * cos((mt - 0.34) * 18) : 1;
        const sq = a * (1 - up);
        P.ay *= 1 - 0.14 * sq + 0.24 * up * (0.55 + 0.45 * set); P.ax *= 1 + 0.12 * sq - 0.16 * up * (0.55 + 0.45 * set);
        P.bob = 0.05 * sq - 0.22 * up;
        if (mt > 0.14) { S.joyT = Math.max(S.joyT, 0.9); }
        ey *= mt < 0.15 ? 1 - 0.55 * sst(0.02, 0.12, mt) : 1;
        P.dust = 1 + 0.3 * up; bAmp = 0.5;
        const hv = s.hover; if (hv && mt > 0.16) { lookAt(hv.x, hv.y, P.cx, P.cy - 0.3 * P.R, LK); tlx = LK[0] * 0.9; tly = cl(LK[1], -0.6, 0.6); } else if (mt > 0.16) { tlx = 0.1; tly = 0.1; }
        P.crest = 1 + 0.12 * up;
      } else if (mode === 'enter' || mode === 'loop') {
        poseWorld(w, h, mode, mt, s, T, dt);
        tlx = P.lx; tly = P.ly; ey = P.ey; ex = P.ex; bAmp = 0.6;
      } else if (mode === 'squeezed') {
        const q = cl(s.squeeze || 0, 0, 1), grow = sst(0, 1, q), esc = sst(0.4, 2.4, mt) * grow;
        // pressed against the plate's right edge, like liquid on glass
        P.R = L.R * (1 + 0.3 * grow);
        const fl = 0.3 * grow + 0.06 * esc;
        let push = 0;
        if (esc > 0.5) { const ph = (mt % 1.5) / 1.5; push = sin(cl(ph / 0.35, 0, 1) * Math.PI) * esc; if (ph > 0.3 && ph < 0.36) S.jig = Math.max(S.jig, 0.3); }
        P.ax *= 1 - fl + 0.08 * push; P.ay *= 1 + fl * 0.75 - 0.05 * push;
        P.cx = lerp(L.cx, w - P.R * P.ax * 0.74, sst(0.05, 0.6, q)) - 0.05 * push * P.R;
        P.cy = L.cy - 0.04 * L.R * grow;
        P.wall = sst(0.15, 0.6, q); P.wallX = w;
        tlx = lerp(tlx, 0.95, grow); tly = lerp(tly, 0.25, grow);
        P.lid = sst(0.15, 0.55, q); P.lidT = 0.25 + 0.2 * esc; ey *= 1 - 0.1 * grow;
        if (esc > 0.8 && (mt % 3.4) > 2.9) { tlx = -0.2; tly = 0.6; } // a look away to the sky, then back to the wall
        P.dust = 1 - 0.35 * grow; P.dustA = 1; P.crest = 1 - 0.25 * fl;
        bAmp = 0.4;
      }
      // board events: gag, look, hit
      if (S.gag) gagPose(dt);
      if (S.lookEvt) { const k = sst(0, 0.2, 1.5 - S.lookEvt.t) * sst(0, 0.25, S.lookEvt.t); tlx = lerp(tlx, S.lookEvt.lx, k); tly = lerp(tly, S.lookEvt.ly, k); }
      if (S.gag) { const g = S.gag; if (g.look > 0) { tlx = lerp(tlx, g.lx, g.look); tly = lerp(tly, g.ly, g.look); } ey *= g.ey; }
      // eyes (updateCreatureLife: damp 10 toward the target)
      S.lookX = damp(S.lookX, tlx, 10, dt); S.lookY = damp(S.lookY, tly, 10, dt);
      P.lx = S.lookX; P.ly = S.lookY;
      if (S.blinkT < 0.13 && S.blinkT > -0.02) ey = 0.1;
      if (S.hurtT < 0.45) { ey = Math.min(ey, 0.28); ex = 1.25; }
      const joy = S.joyT > 0; if (joy) { ey *= 1.3; ex *= 1.2; }
      P.ey = ey; P.ex = ex; P.joy = joy ? 1 : 0;
      // wobble: sin(T*9)*0.03 + jig*0.12*sin(T*24) + joy bounce
      const bounce = sin(T * 9) * 0.03 * bAmp + S.jig * 0.12 * sin(T * 24) + (joy ? sin(T * 30) * 0.05 * Math.min(1, S.joyT) : 0);
      const bb = lerp(B0, bounce, cl(bAmp * 1.5 + S.jig + (joy ? 1 : 0), 0, 1));
      P.ax *= 1 + bb; P.ay *= 1 - bb;
      if (S.spinT > 0) P.yaw += eOut(1 - S.spinT / 0.7) * TAU;
      P.stx = S.slx; P.sty = S.sly;
      P.tint = S.absorbT;
      P.cx += (S.offX + S.slx * 0.28) * P.R; P.cy += (S.offY + S.sly * 0.28 + P.bob) * P.R;
    }

    function gagPose(dt) {
      const g = S.gag; g.t += dt; const t = g.t;
      g.look = sst(0, 0.25, t) * (1 - sst(0.9, 1.3, t)); g.ey = 1;
      if (t > 0.28 && t < 0.72) { const k = sst(0.28, 0.6, t); g.ey = 1 - 0.42 * k; P.ax *= 1 + 0.08 * k; P.ay *= 1 - 0.1 * k; S.slx = lerp(S.slx, -g.dx * 0.16, 0.25); S.sly = lerp(S.sly, -g.dy * 0.1, 0.25); }
      if (t > 0.6 && t < 0.78) { const k = sst(0.6, 0.7, t); S.slx = lerp(S.slx, g.dx * 0.34, k * 0.5); S.sly = lerp(S.sly, g.dy * 0.34, k * 0.5); }
      P.bud = t < 0.72 ? sst(0.3, 0.62, t) : 0; P.budA = Math.atan2(g.dy, g.dx); P.budOut = t < 0.72 ? sst(0.6, 0.72, t) : 0;
      if (t >= 0.72 && !g.thrown) {
        g.thrown = true; S.jig += 0.5; S.joyT = Math.max(S.joyT, 0.7);
        const r = P.R * 1.12, x = P.cx + Math.cos(P.budA) * r, y = P.cy + Math.sin(P.budA) * r;
        emit({ type: 'throw', item: 'bead', x, y, vx: g.dx * 320, vy: g.dy * 320 });
      }
      if (t > 1.35) S.gag = null;
    }

    // enter: the droplet launches down at a world, the camera follows, the horizon rises; loop: play on Nacre's curve
    function poseWorld(w, h, mode, mt, s, T, dt) {
      const L = LAY;
      const Rl = Math.min(0.17 * h, 0.12 * w), gx = 0.33 * w, horizon = 0.77 * h;
      const wR = 1.5 * Math.max(w, h), wcx = 0.52 * w;
      const groundAt = (x) => horizon + wR - sqrt(Math.max(0, wR * wR - (x - wcx) * (x - wcx)));
      const lyGround = groundAt(gx) - Rl * 1.18;
      const skyShift = 0.46 * h;
      P.wR = wR; P.wcx = wcx; P.wy = horizon; P.Rl = Rl;
      let lx = 0.85, ly = 0.05, ey = 1, ex = 1;
      if (mode === 'enter') {
        // from the startled pose (raised, stretched) straight down into play
        const k = mt / 0.7, a = sst(0, 0.18, k), fall = eIn(sst(0.12, 1, k));
        const sy0 = L.cy - 0.22 * L.R;
        P.cx = lerp(L.cx, gx, fall * 0.92 + a * 0.02); P.cy = lerp(sy0 - 0.06 * L.R * a, lyGround, fall); P.R = lerp(L.R, Rl, sst(0.2, 1, k));
        P.skyY = L.cy - skyShift * fall; P.ey_ = L.ey - skyShift * fall;
        P.world = sst(0.25, 0.9, k); P.wy = lerp(h + 0.25 * h, horizon, eOut(sst(0.25, 1, k)));
        // stretch along the dive, squash at touchdown
        const v = sst(0.15, 0.6, k) * (1 - sst(0.85, 1, k));
        P.ay *= 1 + 0.32 * v - 0.12 * sst(0.92, 1, k); P.ax *= 1 - 0.18 * v + 0.12 * sst(0.92, 1, k);
        ly = lerp(0.6, -0.9, sst(0.05, 0.3, k)); lx = lerp(0.2, 0.3, k); ey = 1.15; P.yaw = 0.75 * sst(0.3, 1, k);
        S.joyT = Math.max(S.joyT, 0.3);
        P.dust = lerp(1.25, 1, k); P.dustA = 1 - 0.4 * fall;
      } else {
        const st = loopState(mt, w, h, LS);
        const tc = st.tc;
        P.cx = gx; P.cy = lyGround + sin(T * 2.2) * 0.04 * Rl; P.R = Rl * st.grow;
        P.cy -= (P.R - Rl) * 1.0;
        P.skyY = L.cy - skyShift; P.ey_ = L.ey - skyShift; P.world = 1; P.wy = horizon;
        // landing squash at the very start
        if (mt < 0.45) { const q = exp(-mt * 9) * cos(mt * 16); P.ay *= 1 - 0.16 * q; P.ax *= 1 + 0.14 * q; }
        // aim at the live foe; recoil a touch on every bead
        let tgt = -1; for (let i = 0; i < FOES.length; i++) { const f = FOES[i]; if (tc >= f.s - 0.2 && tc < f.d) { tgt = i; break; } }
        if (tgt >= 0) { lx = 0.55; ly = 0.1; } else { lx = 0.3; ly = 0.35; }
        for (const sh of SHOTS) { const d = tc - sh[0]; if (d >= 0 && d < 0.12) { const q = 1 - d / 0.12; P.ax *= 1 - 0.04 * q; P.cx -= 0.03 * q * P.R; } }
        for (const a of ABS) { const d = tc - a; if (d >= 0 && d < 0.5) { const q = exp(-d * 8) * cos(d * 24); P.ax *= 1 + 0.06 * q; P.ay *= 1 - 0.06 * q; P.tint = Math.max(P.tint, 1 - d * 2); } }
        // the change: spin, joy, rings out across the ground
        const c = tc - CHANGE;
        P.yaw = 0.75 + (c >= 0 && c < 0.7 ? eOut(c / 0.7) * TAU : 0);
        if (c >= -0.05 && c < 1.0) { ey = 1.3; ex = 1.2; P.joy = 1; lx = 0.1; ly = 0.5; }
        if (c >= 0 && c < 0.5) { const q = exp(-c * 6) * cos(c * 20); P.ay *= 1 + 0.08 * q; P.ax *= 1 - 0.06 * q; }
        P.dust = 1 + 0.15 * sst(0, 0.2, c) * (1 - sst(0.4, 1, c)); P.dustA = 0.6;
      }
      P.lx = lx; P.ly = ly; P.ey = ey; P.ex = ex;
    }

    /* ---------------- drawing ---------------- */
    const DS = []; for (let i = 0; i < 200; i++) DS.push({ x: 0, y: 0, z: 0, s: 0, a: 0, b: 0 });
    function drawScene(ctx, w, h, mode, mt, s, rm, T, dpr) {
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      ctx.fillStyle = '#05040A'; ctx.fillRect(0, 0, w, h);
      drawSky(ctx, w, h, rm, T);
      drawRays(ctx);
      /*drawEclipse(ctx);*/
      if (P.world > 0.001) drawWorld(ctx, w, h, mode, mt, T);
      computeDust(rm, T);
      drawDust(ctx, true);
      if (mode === 'loop' || mode === 'enter') drawPlay(ctx, w, h, mode === 'loop' ? mt : mt - 0.7, T, 0);
      drawCreature(ctx, dpr, T);
      drawDust(ctx, false);
      if (mode === 'loop') drawPlay(ctx, w, h, mt, T, 1);
      drawSplash(ctx);
    }

    function drawSky(ctx, w, h, rm, T) {
      const k = P.skyR;
      ctx.save(); ctx.translate(P.skyX, P.skyY); ctx.scale(k, k);
      ctx.lineWidth = Math.max(1, k * 0.0095) / k; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      const cols = ['rgba(110,200,205,0.2)', 'rgba(255,95,168,0.24)', 'rgba(222,216,238,0.24)'];
      for (let i = 0; i < 3; i++) { ctx.strokeStyle = cols[i]; ctx.stroke(SH.sky[i]); }
      ctx.restore();
      // stars
      const tt = rm ? 0 : S.clock;
      for (const st of SH.stars) {
        const x = P.skyX + st.x * k, y = P.skyY + st.y * k; if (x < -2 || y < -2 || x > w + 2 || y > h + 2) continue;
        ctx.globalAlpha = st.a * (0.6 + 0.4 * sin(tt * st.sp * 0.6 + st.ph));
        ctx.fillStyle = `rgb(${st.c})`; const r = st.r * cl(k / 120, 0.7, 1.6);
        ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
      }
      ctx.globalAlpha = 1;
    }

    function drawRays(ctx) {
      const ex = P.ex_, ey = P.ey_, rp = P.rp;
      ctx.globalCompositeOperation = 'lighter';
      const r0 = 1.35 * rp, w0 = r0 * 0.06 * 0.5, w1 = 13 * rp * 0.05 * 0.5, A = 0.16;
      for (const ry of SH.rays) {
        const a = ry.a + P.rayA, ca = cos(a), sa = -sin(a), r1 = 13 * rp * ry.len;
        const x0 = ex + ca * r0, y0 = ey + sa * r0, x1 = ex + ca * r1, y1 = ey + sa * r1, nx = -sa, ny = ca;
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        const f3 = cl((3.05 * rp - r0) / (r1 - r0), 0, 0.9), a0 = A * ry.k;
        g.addColorStop(0, `rgba(${ry.c},${a0 * 0.22})`); g.addColorStop(f3, `rgba(${ry.c},${a0 * 0.3 * (1 - f3)})`);
        g.addColorStop(Math.min(1, f3 + 0.04), `rgba(${ry.c},${a0 * (1 - f3 - 0.04)})`); g.addColorStop(1, `rgba(${ry.c},0)`);
        ctx.fillStyle = g; ctx.beginPath();
        ctx.moveTo(x0 + nx * w0, y0 + ny * w0); ctx.lineTo(x1 + nx * w1, y1 + ny * w1); ctx.lineTo(x1 - nx * w1, y1 - ny * w1); ctx.lineTo(x0 - nx * w0, y0 - ny * w0);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    // the Eclipse: Umbra's dark disc with amber veins, its own violet atmosphere and the two shells
    // (flow.js: drawAtmo(p.c, r*1.9, #ffb52e, 1.8, 0.55) and drawAtmo(p.c, r*3.0, #b28cff, 2.2, 0.35)), measured off the poster
    const ECL = [[0, '10,5,0'], [0.6, '16,8,6'], [0.70, '48,28,28'], [0.75, '70,40,38'], [0.81, '96,60,62'], [0.87, '126,88,98'], [0.93, '106,70,132'], [0.99, '122,82,166'],
      [1.04, '98,64,144'], [1.10, '50,28,38'], [1.16, '50,28,4'], [1.28, '68,38,0'], [1.39, '88,49,0'], [1.51, '110,62,0'], [1.62, '136,80,0'],
      [1.74, '163,105,0'], [1.80, '171,113,0'], [1.86, '112,60,14'], [1.91, '34,16,23'], [1.97, '17,9,25'], [2.14, '17,11,35'], [2.32, '23,15,48'],
      [2.49, '35,21,66'], [2.67, '48,30,89'], [2.84, '65,41,118'], [2.96, '82,53,142'], [3.01, '69,46,126'], [3.07, '21,13,38'], [3.13, '0,0,0']];
    function drawEclipse(ctx) {
      const x = P.ex_, y = P.ey_, rp = P.rp, rd = 0.88 * rp;
      if (y + 3.2 * rp < 0) return;
      const g0 = ctx.createRadialGradient(x - 0.3 * rd, y - 0.3 * rd, 0, x, y, rd);
      g0.addColorStop(0, '#140b08'); g0.addColorStop(0.7, '#0d0706'); g0.addColorStop(1, '#1a0c18');
      ctx.fillStyle = g0; ctx.beginPath(); ctx.arc(x, y, rd, 0, TAU); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(x, y, rd, 0, TAU); ctx.clip();
      ctx.translate(x, y); ctx.scale(rd, rd); ctx.rotate(-0.25 + P.rayA * 0.5);
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgba(255,130,20,0.16)'; ctx.lineWidth = Math.max(2, rd * 0.05) / rd; ctx.stroke(SH.veins);
      ctx.strokeStyle = 'rgba(255,170,40,0.78)'; ctx.lineWidth = Math.max(0.6, rd * 0.017) / rd; ctx.stroke(SH.veins);
      ctx.restore();
      ctx.globalCompositeOperation = 'lighter';
      const R3 = 3.13 * rp, g = ctx.createRadialGradient(x, y, 0, x, y, R3);
      for (const [r, c] of ECL) g.addColorStop(r / 3.13, `rgb(${c})`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R3, 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    function computeDust(rm, T) {
      const tt = rm ? 0 : S.clock, sp = P.dustSpin;
      const sc = P.dust;
      for (let i = 0; i < 200; i++) {
        const d = SH.dust[i], o = DS[i];
        const ang = (T0 + tt) * d.sp + d.ph;
        const ax = d.ax, p = d.p, c = cos(ang), sn = sin(ang), kd = ax[0] * p[0] + ax[1] * p[1] + ax[2] * p[2];
        const cx = ax[1] * p[2] - ax[2] * p[1], cy = ax[2] * p[0] - ax[0] * p[2], cz = ax[0] * p[1] - ax[1] * p[0];
        const r = d.r * sc, jt = 0.08 * r, T1 = T0 + tt;
        const x = (p[0] * c + cx * sn + ax[0] * kd * (1 - c)) * r + sin(T1 * 1.3 + d.sx * 40) * jt;
        const y = (p[1] * c + cy * sn + ax[1] * kd * (1 - c)) * r + sin(T1 * 1.1 + d.sy * 40) * jt;
        const z = (p[2] * c + cz * sn + ax[2] * kd * (1 - c)) * r + sin(T1 * 0.9 + d.sz * 40) * jt;
        const q = proj(x, y, z);
        o.x = q[0]; o.y = q[1]; o.z = q[2];
        o.s = d.size * 1.0 * (DEPTH0 / q[2]);
        o.a = (0.55 + 0.45 * sin(T1 * 3 + d.sx * 60)) * P.dustA;
        o.b = d.bin;
      }
    }
    function drawDust(ctx, behind) {
      ctx.globalCompositeOperation = 'lighter';
      const R = P.R, cx = P.cx, cy = P.cy, sk = P.dust;
      for (let i = 0; i < 200; i++) {
        const o = DS[i]; if ((o.z > DEPTH0) !== behind) continue;
        const dist = Math.hypot(o.x, o.y) / Math.max(0.3, sk);
        const blur = sst(1.5, 2.6, dist);
        const x = cx + o.x * R, y = cy + o.y * R, r = Math.max(0.8, o.s * R * 0.42 * (1 + 0.9 * blur));
        glow(ctx, SH.mote[o.b], x, y, r * 1.9, o.a * 1.15 * (1 - 0.4 * blur));
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }

    // eyes, crest, glows: positions from the game's drawCreature, projected through the poster camera
    const EYE = [{}, {}];
    function bodyPt(lx, ly, lz, yaw, out) { // creature-local -> world offset (yaw turns the face around the body's up)
      const c = cos(yaw), s = sin(yaw);
      const Xx = XB[0] * c + XB[2] * s, Xz = XB[2] * c - XB[0] * s, Zx = ZB[0] * c + ZB[2] * s, Zz = ZB[2] * c - ZB[0] * s;
      out[0] = Xx * lx + Zx * lz; out[1] = ly; out[2] = Xz * lx + Zz * lz; return out;
    }
    const BP = [0, 0, 0], BQ = [0, 0, 0];
    function drawCreature(ctx, dpr, T) {
      const R = P.R, cx = P.cx, cy = P.cy, k = R / 1.0;
      // the body's 2D deformation: stretch along the slosh (st), wobble (ax, ay)
      let stx = P.stx, sty = P.sty, st = Math.hypot(stx, sty); if (st > 0.6) { stx *= 0.6 / st; sty *= 0.6 / st; st = 0.6; }
      const th = st > 1e-4 ? Math.atan2(sty, stx) : 0, c = cos(th), s = sin(th);
      const a1 = 1 + st, a2 = 1 - st * 0.35;
      // M = Rot(th) diag(a1,a2) Rot(-th) · Rot(qd) diag(1-q, 1+0.6q) Rot(-qd) · diag(ax, ay)
      const q = cl(S.sqA, -0.3, 0.32), qc = cos(S.sqD), qs = sin(S.sqD), b1 = 1 - q, b2 = 1 + 0.6 * q;
      const s11 = c * c * a1 + s * s * a2, s12 = c * s * (a1 - a2), s22 = s * s * a1 + c * c * a2;
      const q11 = qc * qc * b1 + qs * qs * b2, q12 = qc * qs * (b1 - b2), q22 = qs * qs * b1 + qc * qc * b2;
      const n11 = s11 * q11 + s12 * q12, n12 = s11 * q12 + s12 * q22, n21 = s12 * q11 + s22 * q12, n22 = s12 * q12 + s22 * q22;
      const m11 = n11 * P.ax, m12 = n12 * P.ay, m21 = n21 * P.ax, m22 = n22 * P.ay;
      const tx = (u, v) => cx + (m11 * u + m12 * v) * R, ty = (u, v) => cy + (m21 * u + m22 * v) * R;
      const yaw = P.yaw;
      // --- crest (a glass octahedron behind the top) ---
      drawCrest(ctx, tx, ty, yaw);
      // --- body sprite ---
      const need = R * dpr;
      let lv = null; for (const L of LV) { if (L && L.ready) { lv = L; if (L.Rs >= need) break; } }
      ctx.save();
      if (P.wall > 0.01) { ctx.beginPath(); ctx.rect(-10, -10, P.wallX - 1.5 + 10, 1e5); ctx.clip(); }
      ctx.transform(m11, m21, m12, m22, cx - (m11 * cx + m12 * cy) + 0, cy - (m21 * cx + m22 * cy));
      if (lv) {
        ctx.imageSmoothingEnabled = true; try { ctx.imageSmoothingQuality = 'high'; } catch (e) { /* older */ }
        const sz = lv.N * R / lv.Rs; ctx.drawImage(lv.cv.c, cx - sz / 2, cy - sz / 2, sz, sz);
      } else fallbackBody(ctx, cx, cy, R);
      // absorb tint (the world's matter colour, Nacre's p3) and a little mass glow
      if (P.tint > 0.01) {
        ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.16 * P.tint;
        ctx.fillStyle = '#f6c8ea'; ctx.beginPath(); ctx.arc(cx, cy, R * 0.98, 0, TAU); ctx.fill();
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      }
      ctx.restore();
      // --- bloom on the body's hot rim (left = toward the Eclipse) and a faint anamorphic streak ---
      ctx.globalCompositeOperation = 'lighter';
      const lxp = tx(-0.985, -0.085), lyp = ty(-0.985, -0.085), rxp = tx(0.995, -0.06), ryp = ty(0.995, -0.06);
      ctx.save(); ctx.transform(m11, m21, m12, m22, cx - (m11 * cx + m12 * cy), cy - (m21 * cx + m22 * cy));
      const hg = ctx.createRadialGradient(cx, cy, R * 0.97, cx, cy, R * 1.16);
      hg.addColorStop(0, 'rgba(255,190,226,0)'); hg.addColorStop(0.2, 'rgba(255,190,226,0.13)'); hg.addColorStop(0.45, 'rgba(255,180,220,0.05)'); hg.addColorStop(1, 'rgba(255,170,215,0)');
      ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(cx, cy, R * 1.16, 0, TAU); ctx.fill();
      ctx.restore();
      glow(ctx, GL.white, lxp + R * 0.03, lyp, R * 0.3, 1, 0.7, 1.15);
      glow(ctx, GL.white, lxp, lyp + R * 0.02, R * 0.6, 0.4, 0.6, 1.4);
      glow(ctx, GL.white, rxp - R * 0.03, ryp, R * 0.27, 0.95, 0.7, 1.1);
      glow(ctx, GL.white, rxp, ryp + R * 0.04, R * 0.5, 0.3, 0.6, 1.5);
      glow(ctx, GL.streak, lxp - R * 0.3, lyp, R * 1.2, 0.22, 1, 0.04);
      glow(ctx, GL.rose, cx, cy, R * 1.22, 0.06);
      ctx.globalCompositeOperation = 'source-over';
      // --- eyes ---
      drawEyes(ctx, tx, ty, m11, m12, m21, m22, R, yaw, T);
      // --- a passing dust mote pulled in and drunk (absorb) ---
      if (P.drink > 0) {
        const k = P.drink, a = P.drinkA + k * 2.4, d = R * lerp(1.95, 0.75, k * k), x = cx + cos(a) * d, y = cy - sin(a) * d * 0.55;
        ctx.globalCompositeOperation = 'lighter';
        glow(ctx, SH.mote[0], x, y, R * 0.09 * (1 + 0.6 * k), 0.95);
        glow(ctx, GL.pink, x, y, R * 0.2, 0.35 * k);
        ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      }
      // --- the bead bud (cue gag): a pearl swelling out of the body, then flicked ---
      if (P.bud > 0.01) {
        const a = P.budA, rr0 = R * (0.86 + 0.26 * P.bud + 0.12 * (P.budOut || 0));
        const bx = cx + cos(a) * rr0, by = cy + sin(a) * rr0, br = R * 0.2 * P.bud;
        ctx.save(); ctx.translate(bx, by); ctx.scale(br / 10, br / 10);
        if (BEAD) BEAD(ctx, 0, 0, S.clock, a); ctx.restore();
      }
      // --- squeezed: the flat contact against the plate's edge (a meniscus of light) ---
      if (P.wall > 0.01) {
        // where the body meets the edge: a flat contact patch with a meniscus of light (film colours at its ends)
        const x = P.wallX - 1.5, ex = (x - cx) / (R * m11), hy = ex < 1 ? R * m22 * sqrt(1 - ex * ex) : 0;
        if (hy > 2) {
          const y0 = cy - hy, y1 = cy + hy;
          ctx.globalCompositeOperation = 'lighter';
          const g = ctx.createLinearGradient(0, y0, 0, y1);
          g.addColorStop(0, `rgba(255,120,200,${0.9 * P.wall})`); g.addColorStop(0.12, `rgba(255,236,250,${0.85 * P.wall})`); g.addColorStop(0.5, `rgba(255,255,255,${0.75 * P.wall})`);
          g.addColorStop(0.88, `rgba(159,246,255,${0.8 * P.wall})`); g.addColorStop(1, `rgba(95,243,255,${0.6 * P.wall})`);
          ctx.fillStyle = g; ctx.fillRect(x - 2, y0, 2.6, y1 - y0);
          const g2 = ctx.createLinearGradient(x - R * 0.35, 0, x, 0);
          g2.addColorStop(0, 'rgba(255,214,240,0)'); g2.addColorStop(1, `rgba(255,214,240,${0.3 * P.wall})`);
          ctx.fillStyle = g2; ctx.fillRect(x - R * 0.35, y0 + hy * 0.12, R * 0.35, (y1 - y0) * 0.88);
          glow(ctx, GL.white, x, y0 + hy * 0.15, R * 0.22, 0.7 * P.wall, 0.5, 1);
          ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
        }
      }
      S.head.x = tx(-0.33, -0.22); S.head.y = ty(-0.33, -0.22);
    }

    function fallbackBody(ctx, cx, cy, R) {
      const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
      g.addColorStop(0, '#e9e1f4'); g.addColorStop(0.5, '#9a8fb0'); g.addColorStop(0.9, '#776f86'); g.addColorStop(1, '#e48ad0');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
    }

    function drawCrest(ctx, tx, ty, yaw) {
      const ck = P.crest, c5 = cos(-0.5), s5 = sin(-0.5);
      // octahedron axes (local): X' = X*0.18, Y' = rot(Y, X, -0.5)*0.42, Z' = rot(Z, X, -0.5)*0.1
      const cyl = 0.95, czl = -0.15;
      const ax = [[0.18, 0, 0], [0, 0.42 * ck * c5, 0.42 * ck * s5], [0, -0.1 * s5, 0.1 * c5]];
      const V = [];
      for (let i = 0; i < 6; i++) {
        const a = ax[i >> 1], sg = i & 1 ? -1 : 1;
        bodyPt(a[0] * sg, cyl + a[1] * sg, czl + a[2] * sg, yaw, BP);
        const q = proj(BP[0], BP[1], BP[2]); V.push([tx(q[0], q[1]), ty(q[0], q[1]), q[2]]);
      }
      // faces: (±X, ±Y, ±Z) — vertex ids 0/1 = ±X, 2/3 = ±Y, 4/5 = ±Z ; only the upper (+Y) four show above the body
      const F = [];
      for (const xi of [0, 1]) for (const zi of [4, 5]) {
        const A = V[xi], B = V[2], C = V[zi];
        const cr = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
        F.push({ A, B, C, z: (A[2] + B[2] + C[2]) / 3, left: xi === 1, front: zi === 4, cr });
      }
      F.sort((a, b) => b.z - a.z);
      for (const f of F) {
        // glass: lit faces toward the Eclipse (left) read pale sage, the others slate; back faces faint through the glass
        const facing = f.front ? 1 : 0.35;
        ctx.fillStyle = f.left ? `rgba(176,186,172,${0.95 * facing})` : `rgba(72,96,108,${0.95 * facing})`;
        ctx.beginPath(); ctx.moveTo(f.A[0], f.A[1]); ctx.lineTo(f.B[0], f.B[1]); ctx.lineTo(f.C[0], f.C[1]); ctx.closePath(); ctx.fill();
      }
      // a thin lit ridge
      ctx.strokeStyle = 'rgba(214,250,255,0.35)'; ctx.lineWidth = Math.max(0.6, P.R * 0.006);
      ctx.beginPath(); ctx.moveTo(V[2][0], V[2][1]); ctx.lineTo(V[4][0], V[4][1]); ctx.stroke();
    }

    function drawEyes(ctx, tx, ty, m11, m12, m21, m22, R, yaw, T) {
      const lx = P.lx * 0.13, ly = P.ly * 0.09, ez = 0.86 + Math.hypot(P.stx, P.sty) * 0.4;
      const ey = P.ey, ex = P.ex, joy = P.joy;
      for (const sx of [-1, 1]) {
        const ex0 = sx * 0.29 + lx, ey0 = 0.26 + ly;
        const cl0 = Math.hypot(ex0, ey0, ez), dep = cl(1 - cl0, 0, 0.12), cap = 0.9 * sqrt(1 - (dep / 0.13) * (dep / 0.13)), push = 1 + 2.2 * dep / cl0;
        bodyPt(ex0 * push, ey0 * push, ez * push, yaw, BP);
        // facing: is the eye on the visible side?
        const nl = Math.hypot(BP[0], BP[1], BP[2]), vx = OW[0] - BP[0], vy = OW[1] - BP[1], vz = OW[2] - BP[2], vl = Math.hypot(vx, vy, vz);
        const facing = (BP[0] * vx + BP[1] * vy + BP[2] * vz) / (nl * vl);
        const vis = sst(-0.02, 0.18, facing); if (vis <= 0.01) continue;
        const q = proj(BP[0], BP[1], BP[2]); const u = q[0], v = q[1];
        const X = tx(u, v), Y = ty(u, v);
        // the ellipsoid's three axes (0.13ex, 0.19ey, 0.08) projected and deformed with the body
        let m1 = 0, m2 = 0, m3 = 0;
        const axes = [[0.13 * ex * cap, 0, 0], [0, 0.19 * ey * cap, 0]];
        for (const a of axes) {
          bodyPt(ex0 * push + a[0], ey0 * push + a[1], ez * push + a[2], yaw, BQ); const p = proj(BQ[0], BQ[1], BQ[2]);
          const du = p[0] - u, dv = p[1] - v, ax = (m11 * du + m12 * dv) * R, ay = (m21 * du + m22 * dv) * R;
          m1 += ax * ax; m2 += ay * ay; m3 += ax * ay;
        }
        const tr = (m1 + m2) / 2, dd = sqrt(Math.max(0, tr * tr - (m1 * m2 - m3 * m3)));
        const r1 = sqrt(tr + dd), r2 = sqrt(Math.max(0.01, tr - dd)), rot = 0.5 * Math.atan2(2 * m3, m1 - m2);
        ctx.save();
        ctx.globalAlpha = vis;
        // annoyed lid: a flat cut across the top of the eye (squeezed)
        if (P.lid > 0.01) {
          const ly0 = Y - Math.max(r1, r2) * (1 - 0.95 * P.lid), tilt = sx * P.lidT * (1 - 0.3 * P.lid);
          ctx.beginPath(); ctx.moveTo(X - 3 * R, ly0 + tilt * 3 * R * 0.2); ctx.lineTo(X + 3 * R, ly0 - tilt * 3 * R * 0.2); ctx.lineTo(X + 3 * R, Y + 3 * R); ctx.lineTo(X - 3 * R, Y + 3 * R); ctx.closePath(); ctx.clip();
        }
        const cu = proj(...bodyPt(ex0 - 0.035, ey0 + 0.05, ez + 0.06, yaw, BQ));
        const CXp = tx(cu[0], cu[1]), CYp = ty(cu[0], cu[1]);
        const g = ctx.createRadialGradient(CXp, CYp, 0, X, Y, Math.max(r1, r2) * 1.05);
        g.addColorStop(0, '#aaa7af'); g.addColorStop(0.26, '#6b6771'); g.addColorStop(0.6, '#36323c'); g.addColorStop(1, '#1d1a22');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(X, Y, r1, r2, rot, 0, TAU); ctx.fill();
        // catchlight (white glow ball) + its bloom
        if (ey > 0.2) {
          const cr = 0.05 * Math.min(1.3, ey) * (joy ? 1.35 : 1) * R;
          ctx.globalCompositeOperation = 'lighter';
          glow(ctx, GL.white, CXp, CYp, cr * 4.2, 1 * vis);
          ctx.globalAlpha = vis; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(CXp, CYp, cr, 0, TAU); ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    function drawSplash(ctx) {
      if (!S.splash.length) return;
      ctx.globalCompositeOperation = 'source-over';
      for (const d of S.splash) {
        const a = 1 - d.t / d.life; if (a <= 0) continue;
        ctx.globalAlpha = a; ctx.save(); ctx.translate(d.x, d.y); ctx.scale(d.r / 10, d.r / 10);
        if (BEAD) BEAD(ctx, 0, 0, d.t, Math.atan2(d.vy, d.vx)); ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    /* ---------------- the world (Nacre, the pearl nursery) ---------------- */
    function drawWorld(ctx, w, h, mode, mt, T) {
      const a = P.world, wR = P.wR, wcx = P.wcx, top = P.wy, wcy = top + wR;
      if (top > h + 4) return;
      ctx.save(); ctx.globalAlpha = 1;
      // atmosphere above the horizon (Nacre's atmo #ff9ad5)
      ctx.globalCompositeOperation = 'lighter';
      const ga = ctx.createRadialGradient(wcx, wcy, wR * 0.98, wcx, wcy, wR * 1.08);
      ga.addColorStop(0, 'rgba(255,154,213,0)'); ga.addColorStop(0.18, `rgba(255,154,213,${0.22 * a})`); ga.addColorStop(1, 'rgba(255,154,213,0)');
      ctx.fillStyle = ga; ctx.beginPath(); ctx.arc(wcx, wcy, wR * 1.08, 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      // the surface: Nacre's bands p0..p2 with pearl, lit from the Eclipse side
      const gs = ctx.createLinearGradient(0, top, 0, top + 0.5 * h);
      gs.addColorStop(0, '#5e4270'); gs.addColorStop(0.08, '#3a2752'); gs.addColorStop(0.45, '#22152f'); gs.addColorStop(1, '#120a20');
      ctx.fillStyle = gs; ctx.beginPath(); ctx.arc(wcx, wcy, wR, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(wcx, wcy, wR, 0, TAU); ctx.clip();
      // contour bands (u_line, p3 #f6c8ea), scrolling as the world turns under the droplet (seamless with the cycle)
      const scroll = mode === 'loop' ? (mt % LOOP_L) / LOOP_L : 0;
      ctx.lineWidth = Math.max(1, P.Rl * 0.03);
      for (let i = 0; i < 9; i++) {
        const d = pow((i + 0.35) / 9, 1.7) * 0.42 * h; const r = wR - d;
        ctx.strokeStyle = `rgba(246,200,234,${(0.34 - i * 0.025) * a})`;
        ctx.beginPath();
        const steps = 48;
        for (let j = 0; j <= steps; j++) {
          const x = j / steps * w; const ang = Math.asin(cl((x - wcx) / r, -1, 1));
          const wv = sin(ang * 9 + i * 1.7 + scroll * TAU * 2) * 0.012 * h * (1 + i * 0.25) + sin(ang * 23 - i + scroll * TAU * 3) * 0.004 * h;
          const y = wcy - r * cos(ang) + wv;
          if (j) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      // the droplet's pool of light on the ground
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, GL.rose, P.cx, top + 0.02 * h, P.R * 2.4, 0.22 * a, 1.4, 0.35);
      ctx.restore();
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      // the rim of the world (pearl fresnel)
      ctx.strokeStyle = `rgba(246,200,234,${0.75 * a})`; ctx.lineWidth = Math.max(1, h * 0.004);
      ctx.beginPath(); ctx.arc(wcx, wcy, wR, -Math.PI / 2 - 1.2, -Math.PI / 2 + 1.2); ctx.stroke();
    }

    /* ---------------- play: foes, beads, bursts, matter, the change, the HUD bar ---------------- */
    function foeAt(f, tl, w, h, o) { // position of a foe at local cycle time tl
      const k = sst(f.s, f.s + 1.5, tl);
      const x = lerp(f.x0, f.x1, k) * w;
      const wR = P.wR, wcx = P.wcx, top = P.wy;
      const gy = top + wR - sqrt(Math.max(0, wR * wR - (x - wcx) * (x - wcx)));
      o.x = x; o.y = gy - P.Rl * (0.85 + f.y * 4) + sin(tl * 5 + f.x0 * 9) * P.Rl * 0.05; o.k = k; return o;
    }
    const FO = { x: 0, y: 0, k: 0 }, FO2 = { x: 0, y: 0, k: 0 };
    function drawPlay(ctx, w, h, mt, T, layer) {
      const tc = mt < 0 ? mt : mt % LOOP_L, Rl = P.Rl;
      if (layer === 0) {
        // foes from this cycle and those walking in for the next one
        for (let i = 0; i < FOES.length; i++) {
          const f = FOES[i];
          for (const tl of [tc, tc - LOOP_L]) {
            if (tl < f.s || tl > f.d + 0.6) continue;
            foeAt(f, Math.min(tl, f.d), w, h, FO);
            if (tl < f.d) {
              let flash = 0; for (const sh of SHOTS) if (sh[1] === i) { const d = tl - sh[0] - 0.2; if (d >= 0 && d < 0.08) flash = 1 - d / 0.08; }
              drawFoe(ctx, f.k, FO.x, FO.y, Rl, tl, flash, 1);
            } else burst(ctx, FO.x, FO.y, Rl, tl - f.d);
          }
        }
      } else {
        // beads in flight (0.2 s each)
        ctx.globalCompositeOperation = 'lighter';
        for (const sh of SHOTS) {
          const d = tc - sh[0]; if (d < 0 || d > 0.2) continue;
          const f = FOES[sh[1]]; foeAt(f, sh[0] + 0.2, w, h, FO);
          const x0 = P.cx + P.R * 0.9, y0 = P.cy - P.R * 0.05, k = d / 0.2;
          const x = lerp(x0, FO.x, k), y = lerp(y0, FO.y, k);
          glow(ctx, GL.bead, x, y, Rl * 0.42, 0.85, 1.5, 0.75);
          glow(ctx, GL.white, x, y, Rl * 0.13, 1, 1.4, 1);
        }
        // matter: pops out of the burst, hops, then flies into the droplet with a trail
        for (let i = 0; i < FOES.length; i++) {
          const f = FOES[i], ab = ABS[i];
          if (tc < f.d || tc > ab) continue;
          foeAt(f, f.d, w, h, FO);
          for (let j = 0; j < 2; j++) {
            const d = tc - f.d, hop = Math.min(d, 0.45), mag = sst(0.4, ab - f.d, d);
            const hx = FO.x + (j ? 1 : -1) * Rl * 0.5 * hop / 0.45, hy = FO.y - sin(hop / 0.45 * Math.PI * 0.8) * Rl * 0.9;
            const k = eIn(mag), x = lerp(hx, P.cx, k), y = lerp(hy, P.cy, k) - sin(k * Math.PI) * Rl * 0.4 * (j ? 1 : -0.6);
            if (mag > 0.05) { const px = lerp(hx, P.cx, eIn(Math.max(0, mag - 0.12))), py = lerp(hy, P.cy, eIn(Math.max(0, mag - 0.12))); ctx.strokeStyle = 'rgba(255,198,234,0.5)'; ctx.lineWidth = Math.max(1, Rl * 0.06); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke(); }
            glow(ctx, GL.gem, x, y, Rl * 0.45, 0.6);
            ctx.globalCompositeOperation = 'source-over';
            gem(ctx, x, y, Rl * 0.17, tc * 7 + j * 2);
            ctx.globalCompositeOperation = 'lighter';
          }
        }
        // the change: iridescent rings run out across the ground (ringFx, iri(i/3))
        const c = tc - CHANGE;
        if (c > 0 && c < 1.1) {
          const IRI = ['255,154,213', '159,246,255', '255,230,168'];
          for (let i = 0; i < 3; i++) {
            const k = (c - i * 0.12) / 0.9; if (k <= 0 || k >= 1) continue;
            const r = Rl * (1.3 + k * (5 + i * 1.5)), a = (1 - k) * (1 - k) * 0.8;
            ctx.strokeStyle = `rgba(${IRI[i]},${a})`; ctx.lineWidth = Math.max(1.2, Rl * 0.07 * (1 - k * 0.5));
            ctx.beginPath(); ctx.ellipse(P.cx, P.wy + Rl * 0.05, r, r * 0.16, 0, 0, TAU); ctx.stroke();
          }
        }
        ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
        // HUD: the harvest bar (the game's 3 px iridescent track), top-left; no type, no numbers
        const bw = Math.min(118, w * 0.26), bx = Math.max(10, w * 0.03), by = Math.max(10, h * 0.05), fill = LS.fill;
        ctx.fillStyle = 'rgba(242,236,247,0.14)'; ctx.fillRect(bx, by, bw, 3);
        if (fill > 0.002) {
          const g = ctx.createLinearGradient(bx, 0, bx + bw, 0);
          g.addColorStop(0, '#ff9ad5'); g.addColorStop(0.3, '#9ff6ff'); g.addColorStop(0.55, '#ffe6a8'); g.addColorStop(0.8, '#c9a8ff'); g.addColorStop(1, '#ff9ad5');
          ctx.fillStyle = g; ctx.fillRect(bx, by, bw * fill, 3);
        }
      }
    }
    function gem(ctx, x, y, r, a) {
      const s = abs(cos(a));
      ctx.fillStyle = '#ffe3f4'; ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r * 0.7 * (0.3 + 0.7 * s), y); ctx.lineTo(x, y + r); ctx.lineTo(x - r * 0.7 * (0.3 + 0.7 * s), y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#f39ccd'; ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r * 0.7 * (0.3 + 0.7 * s), y); ctx.lineTo(x, y + r); ctx.closePath(); ctx.fill();
    }
    function burst(ctx, x, y, Rl, d) {
      if (d > 0.6) return;
      const k = d / 0.6;
      ctx.globalCompositeOperation = 'lighter';
      // a ring on the ground and pearl shards
      ctx.strokeStyle = `rgba(255,242,251,${0.7 * (1 - k)})`; ctx.lineWidth = Math.max(1, Rl * 0.06);
      ctx.beginPath(); ctx.ellipse(x, y + Rl * 0.7, Rl * (0.5 + 2.2 * k), Rl * (0.12 + 0.4 * k), 0, 0, TAU); ctx.stroke();
      for (let i = 0; i < 9; i++) {
        const a = i / 9 * TAU + 0.4, sp = Rl * (1.2 + (i % 3) * 0.5);
        const px = x + cos(a) * sp * k, py = y + sin(a) * sp * k * 0.8 + 2.2 * Rl * k * k;
        glow(ctx, i % 2 ? GL.white : GL.gem, px, py, Rl * 0.16 * (1 - k * 0.6), 0.9 * (1 - k));
      }
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }
    // faceless sculptural foes, each with one hostile glow (enemies.js: mite, tumbler)
    function drawFoe(ctx, kind, x, y, Rl, tl, flash, a) {
      const T = tl;
      if (kind === 'mite') {
        const r = Rl * 0.62;
        const spike = (i, front) => {
          const an = T * 3 + i * TAU / 4, sx = cos(an), sz = sin(an); if ((sz > 0) !== front) return;
          const px = x + sx * r * 0.82, py = y - r * 0.18 + sz * r * 0.08, sr = r * 0.32;
          ctx.fillStyle = front ? '#d8dcf0' : '#8d90a6'; ctx.beginPath(); ctx.moveTo(px + sx * sr * 1.3, py - sr * 0.2); ctx.lineTo(px - sr * 0.4, py - sr * 0.8); ctx.lineTo(px - sr * 0.3, py + sr * 0.6); ctx.closePath(); ctx.fill();
          ctx.fillStyle = front ? '#ffffff' : '#b9bbcc'; ctx.beginPath(); ctx.moveTo(px + sx * sr * 1.3, py - sr * 0.2); ctx.lineTo(px - sr * 0.4, py - sr * 0.8); ctx.lineTo(px, py - sr * 0.1); ctx.closePath(); ctx.fill();
        };
        for (let i = 0; i < 4; i++) spike(i, false);
        const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x, y, r);
        g.addColorStop(0, '#fff6fc'); g.addColorStop(0.35, '#e8d4ea'); g.addColorStop(0.75, '#9a7fa3'); g.addColorStop(1, '#5b4466');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, r * 0.95, r * 0.88, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = 'rgba(159,246,255,0.45)'; ctx.lineWidth = Math.max(0.8, r * 0.06); ctx.beginPath(); ctx.ellipse(x, y, r * 0.93, r * 0.86, 0, 1.7, 3.6); ctx.stroke();
        for (let i = 0; i < 4; i++) spike(i, true);
        if (flash > 0) { ctx.globalAlpha = 0.5 * flash; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(x, y, r * 0.95, r * 0.88, 0, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
        ctx.globalCompositeOperation = 'lighter';
        glow(ctx, GL.hot, x - r * 0.25, y - r * 0.02, r * 0.55, 0.9);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#ff2e6a'; ctx.beginPath(); ctx.arc(x - r * 0.25, y - r * 0.02, r * 0.13, 0, TAU); ctx.fill();
      } else {
        const r = Rl * 0.55, cy = y - r * 0.3;
        // pearl torus (rotating about the vertical): an ellipse that breathes
        const rw = abs(cos(T * 2)) * 0.9 + 0.1;
        ctx.lineWidth = Math.max(1.5, r * 0.22);
        ctx.strokeStyle = '#a98fb5'; ctx.beginPath(); ctx.ellipse(x, cy, r * 1.45 * rw, r * 1.45, 0, Math.PI, TAU); ctx.stroke();
        // chrome box tumbling
        ctx.save(); ctx.translate(x, cy); ctx.rotate(T * 3.5);
        const gb = ctx.createLinearGradient(-r, -r, r, r); gb.addColorStop(0, '#ffffff'); gb.addColorStop(0.45, '#c9cde0'); gb.addColorStop(0.55, '#5c5f78'); gb.addColorStop(1, '#2c2b3c');
        ctx.fillStyle = gb; ctx.fillRect(-r * 0.75, -r * 0.75, r * 1.5, r * 1.5);
        ctx.strokeStyle = 'rgba(255,214,240,0.6)'; ctx.lineWidth = Math.max(0.8, r * 0.05); ctx.strokeRect(-r * 0.75, -r * 0.75, r * 1.5, r * 1.5);
        if (flash > 0) { ctx.globalAlpha = 0.5 * flash; ctx.fillStyle = '#fff'; ctx.fillRect(-r * 0.75, -r * 0.75, r * 1.5, r * 1.5); ctx.globalAlpha = 1; }
        ctx.restore();
        ctx.lineWidth = Math.max(1.5, r * 0.22);
        const gt = ctx.createLinearGradient(x - r, cy - r, x + r, cy + r); gt.addColorStop(0, '#fff2fb'); gt.addColorStop(1, '#b896c4');
        ctx.strokeStyle = gt; ctx.beginPath(); ctx.ellipse(x, cy, r * 1.45 * rw, r * 1.45, 0, 0, Math.PI); ctx.stroke();
        ctx.globalCompositeOperation = 'lighter';
        glow(ctx, GL.hot, x, cy - r * 1.15, r * 0.6, 0.9);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#ff2e6a'; ctx.beginPath(); ctx.arc(x, cy - r * 1.15, r * 0.16, 0, TAU); ctx.fill();
      }
    }

    /* ---------------- board events ---------------- */
    function on(evt) {
      if (!evt) return;
      if (evt.type === 'cue') {
        if (S.gag) return;
        S.gagN++; const dir = S.gagN % 2 ? 1 : -1;
        const dx = dir * 0.82, dy = -0.57;
        S.gag = { t: 0, dx, dy, lx: dir * 0.95, ly: 0.5, look: 0, ey: 1, thrown: false };
      } else if (evt.type === 'hit') {
        const x = +evt.x || P.cx, y = +evt.y || P.cy;
        const dx = P.cx - x, dy = P.cy - y, l = Math.hypot(dx, dy) || 1;
        S.sqD = Math.atan2(dy, dx); S.sqV += 3.4; S.svx += dx / l * 1.2; S.svy += dy / l * 1.2; S.ovx += dx / l * 1.6; S.ovy += dy / l * 1.1;
        S.jig += 0.6; S.hurtT = 0; S.lookEvt = { t: 1.0, lx: cl(-dx / l, -1, 1), ly: cl(dy / l * 1.5, -1, 1) };
        for (let i = 0; i < 9; i++) {
          const a = -Math.PI / 2 + (i - 4) * 0.33 + (rnd() - 0.5) * 0.3, sp = rr(90, 210);
          S.splash.push({ x, y, vx: cos(a) * sp, vy: sin(a) * sp, r: rr(2.4, 4.6), t: 0, life: rr(0.45, 0.75), g: 1 });
        }
      } else if (evt.type === 'look') {
        const dx = +evt.dx || 0, dy = +evt.dy || 0, l = Math.hypot(dx, dy) || 1;
        S.lookEvt = { t: 1.5, lx: cl(dx / l, -1, 1), ly: cl(-dy / l * 1.4, -1, 1) };
      } else if (evt.type === 'shake') {
        const a = cl(+evt.amount || 1, 0, 3);
        S.jig += 0.6 * a; S.sqD = rr(0, TAU); S.sqV += 1.6 * a; S.svx += (rnd() - 0.5) * 2.5 * a; S.svy += (rnd() - 0.3) * 1.5 * a; S.ovx += (rnd() - 0.5) * 1.5 * a;
      }
    }

    function anchor() {
      const w = S.lastW || 1, h = S.lastH || 1;
      return { x: cl(S.head.x / w, 0.05, 0.95), y: cl(S.head.y / h, 0.05, 0.95) };
    }

    return {
      frame(ctx, s) { S.lastW = s.w; S.lastH = s.h; frame(ctx, s); },
      on,
      anchor
    };
  }
};
