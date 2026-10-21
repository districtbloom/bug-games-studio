/* ============================================================
   OUT OF SCOPE · living poster module (bug.games living board, contract v1)
   Source template: the build step (work/living/build.mjs) fills `geo` with path data
   extracted from the game's own drawing code (suitB for Regent in four emotions, the poster's
   cracked CRT, the tutorial hand TUT_HAND, picto('fired')) and writes
   bug/living-poster/outofscope.js. Everything is drawn with Path2D on Canvas 2D:
   fills with the game's 3 px offset print and dry-brush hatch, outlines in #15131a, and the
   game's rough marker line as three precomputed jittered copies that "boil" at 8 fps.
   The light is the poster's: flat torn steps acid -> lime -> toxic -> toxic thinning into the
   void, a fan from the glass's left edge, and an acid rim on Regent's lit edge.
   ============================================================ */
BUG_MODS.outofscope = {
  key: 'outofscope',
  no: '···',
  title: 'Out of Scope',
  maker: '···',
  kind: 'Detective',
  verb: 'Object.',
  ground: '#050407',
  ink: '#e6ff2e',
  rants: ['#@$%!', '?!', '!!'],
  hits: ['#@!', '?!'],
  geo: null /*GEO*/,
  items: {
    /* an approval slip, freshly stamped (Regent's red box), ~26 px */
    slip(ctx, x, y, t, a) {
      ctx.save();
      ctx.translate(x, y); ctx.rotate(a || 0);
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      const j = (Math.floor((t || 0) * 8) % 2) * 0.6;
      ctx.fillStyle = '#fff6e6';
      ctx.beginPath(); ctx.moveTo(-10.5, -7); ctx.lineTo(12.5, -7.6); ctx.lineTo(13.2, 9.2); ctx.lineTo(-11, 9.6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#15131a'; ctx.lineWidth = 2.1;
      ctx.beginPath(); ctx.moveTo(-12.4, -8.6 + j); ctx.lineTo(11.2, -9.2); ctx.lineTo(11.8 - j, 7.6); ctx.lineTo(-12.8, 8.1); ctx.closePath(); ctx.stroke();
      ctx.strokeStyle = '#8f8670'; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.moveTo(-9.4, -4.6); ctx.lineTo(-4.4, -4.8); ctx.moveTo(-9.4, -0.6); ctx.lineTo(-3.2, -0.8); ctx.moveTo(-9.4, 3.8); ctx.lineTo(5.6, 3.4); ctx.stroke();
      ctx.save(); ctx.translate(4.6, -1.4); ctx.rotate(-0.24);
      ctx.strokeStyle = '#d4141c'; ctx.lineWidth = 1.9; ctx.strokeRect(-5.2, -3.8, 10.4, 7.2);
      ctx.restore();
      ctx.restore();
    }
  },

  /* ---------- one-time geometry build (shared by every plate) ---------- */
  _build(D) {
    const rnd = (seed) => { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
    const hash = (i, j, s) => { let h = Math.imul(i, 374761393) ^ Math.imul(j, 668265263) ^ Math.imul(s + 1, 1274126177); h = Math.imul(h ^ (h >>> 13), 1103515245); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
    const vn = (x, y, s) => {
      const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
      const a = hash(i, j, s), b = hash(i + 1, j, s), c = hash(i, j + 1, s), d = hash(i + 1, j + 1, s);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };
    // the game's #rough: turbulence at ~.04 per unit displacing the line by a couple of units
    const nz = (x, y, s) => (vn(x * 0.045, y * 0.045, s) * 2 + vn(x * 0.11, y * 0.11, s + 31)) / 3 - 0.5;
    const subdiv = (p, closed, step) => {
      const o = [], n = p.length / 2, m = closed ? n : n - 1;
      for (let i = 0; i < m; i++) {
        const x0 = p[2 * i], y0 = p[2 * i + 1], j = (i + 1) % n, x1 = p[2 * j], y1 = p[2 * j + 1];
        const k = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step));
        for (let q = 0; q < k; q++) o.push(x0 + (x1 - x0) * q / k, y0 + (y1 - y0) * q / k);
      }
      if (!closed) o.push(p[2 * (n - 1)], p[2 * (n - 1) + 1]);
      return o;
    };
    // boil copy v: a fixed rough line (seed 0) plus a smaller per-copy wobble, so the line keeps its character
    const jit = (p, closed, amp, v) => {
      const o = subdiv(p, closed, 3.6);
      for (let i = 0; i < o.length; i += 2) {
        const x = o[i], y = o[i + 1];
        o[i] = x + (nz(x, y, 0) * 1.3 + nz(x, y, 11 + v * 7) * 0.9) * amp;
        o[i + 1] = y + (nz(x + 71.3, y - 19.7, 5) * 1.3 + nz(x + 71.3, y - 19.7, 13 + v * 7) * 0.9) * amp;
      }
      return o;
    };
    const toPath = (subs, closed) => {
      const P = new Path2D();
      subs.forEach((p, k) => { P.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) P.lineTo(p[i], p[i + 1]); if (closed[k]) P.closePath(); });
      return P;
    };
    let sseed = 17;
    // the game's #brush: thin vertical dry-brush streaks of white over a light fill. The streaks are clipped to the
    // fill polygon here, once (column by column), so no clip is needed per frame. Two densities: every other column
    // is dropped on small plates. Paths: [light, strong] x [level 0, level 1].
    const streaks = (subs) => {
      const r = rnd(sseed += 7), P = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
      let x0 = 1e9, x1 = -1e9; subs.forEach((p) => { for (let i = 0; i < p.length; i += 2) { x0 = Math.min(x0, p[i]); x1 = Math.max(x1, p[i]); } });
      let col = 0;
      for (let x = x0 + 0.3 + r() * 1.2; x < x1; x += 1.15 + r() * 0.9, col++) {
        // inside intervals of the vertical line at x (even-odd over every subpath)
        const ys = [];
        subs.forEach((p) => { const n = p.length / 2; for (let i = 0; i < n; i++) { const ax = p[2 * i], ay = p[2 * i + 1], bx = p[2 * ((i + 1) % n)], by = p[2 * ((i + 1) % n) + 1]; if ((ax <= x) !== (bx <= x)) ys.push(ay + (by - ay) * (x - ax) / (bx - ax)); } });
        ys.sort((a, b) => a - b);
        const lv = col % 2;
        for (let k = 0; k + 1 < ys.length; k += 2) {
          const top = ys[k], bot = ys[k + 1];
          let y = top - r() * 22;
          while (y < bot) {
            const L = 5 + r() * 26, g = 3 + r() * 15, strong = r() < 0.45, a = Math.max(y, top + 0.4), b = Math.min(y + L, bot - 0.4);
            if (b - a > 1.5) { const Q = P[(strong ? 1 : 0) + lv * 2]; Q.moveTo(x, a); Q.lineTo(x, b); }
            y += L + g;
          }
        }
      }
      return P;
    };
    // a marker stroke as a filled polygon, computed once: offset both sides along averaged normals (miter-limited),
    // round caps on open lines, the width breathing a little like the game's displaced line. Filling it each frame is
    // much cheaper than stroking a long jittered polyline.
    const area = (q) => { let a = 0; for (let i = 0, n = q.length / 2; i < n; i++) { const j = (i + 1) % n; a += q[2 * i] * q[2 * j + 1] - q[2 * j] * q[2 * i + 1]; } return a / 2; };
    const rev = (q) => { const o = []; for (let i = q.length - 2; i >= 0; i -= 2) o.push(q[i], q[i + 1]); return o; };
    const strokePoly = (p0, closed, w, breathe, seed) => {
      const p = [];
      for (let i = 0; i < p0.length; i += 2) { const n = p.length; if (n && Math.abs(p[n - 2] - p0[i]) < 1e-3 && Math.abs(p[n - 1] - p0[i + 1]) < 1e-3) continue; p.push(p0[i], p0[i + 1]); }
      if (closed && p.length > 4 && Math.abs(p[0] - p[p.length - 2]) < 1e-3 && Math.abs(p[1] - p[p.length - 1]) < 1e-3) p.length -= 2;
      const n = p.length / 2; if (n < 2) return [];
      const m = closed ? n : n - 1, sx = [], sy = [];
      for (let i = 0; i < m; i++) { const j = (i + 1) % n, dx = p[2 * j] - p[2 * i], dy = p[2 * j + 1] - p[2 * i + 1], L = Math.hypot(dx, dy) || 1; sx.push(-dy / L); sy.push(dx / L); }
      const Lr = [], Rr = [];
      for (let i = 0; i < n; i++) {
        const a = closed ? (i - 1 + m) % m : Math.max(0, i - 1), b = closed ? i % m : Math.min(m - 1, i);
        let mx = sx[a] + sx[b], my = sy[a] + sy[b]; const ml = Math.hypot(mx, my);
        if (ml < 1e-6) { mx = sx[b]; my = sy[b]; } else { mx /= ml; my /= ml; }
        const c = mx * sx[b] + my * sy[b], k = 1 / Math.max(c, 0.5);
        const x = p[2 * i], y = p[2 * i + 1], hw = w / 2 * (breathe ? 1 + breathe * nz(x * 1.7, y * 1.7, seed) : 1) * k;
        Lr.push(x + mx * hw, y + my * hw); Rr.push(x - mx * hw, y - my * hw);
      }
      if (closed) { let A = Lr, B = rev(Rr); if (Math.abs(area(A)) < Math.abs(area(B))) { const t = A; A = rev(B); B = rev(t); } if (area(A) < 0) { A = rev(A); B = rev(B); } return [A, B]; }
      const ring = Lr.slice(), cap = (cx, cy, ux, uy, hw) => { for (let k = 1; k < 6; k++) { const t = k / 6 * Math.PI, c = Math.cos(t), s = Math.sin(t); ring.push(cx + (ux * c + uy * s) * hw, cy + (uy * c - ux * s) * hw); } };
      const e = n - 1; cap(p[2 * e], p[2 * e + 1], sx[m - 1], sy[m - 1], Math.hypot(Lr[2 * e] - p[2 * e], Lr[2 * e + 1] - p[2 * e + 1]) || w / 2);
      ring.push(...rev(Rr));
      cap(p[0], p[1], -sx[0], -sy[0], Math.hypot(Lr[0] - p[0], Lr[1] - p[1]) || w / 2);
      return [area(ring) < 0 ? rev(ring) : ring];
    };
    // Sutherland-Hodgman against the filter region rectangle
    const clipRect = (q, r) => {
      let pts = q;
      for (let side = 0; side < 4 && pts.length >= 6; side++) {
        const ins = (x, y) => side === 0 ? x >= r[0] : side === 1 ? x <= r[2] : side === 2 ? y >= r[1] : y <= r[3];
        const cut = (ax, ay, bx, by) => { const k = side < 2 ? ((side === 0 ? r[0] : r[2]) - ax) / (bx - ax) : ((side === 2 ? r[1] : r[3]) - ay) / (by - ay); return [ax + (bx - ax) * k, ay + (by - ay) * k]; };
        const o = [], n = pts.length / 2;
        for (let i = 0; i < n; i++) {
          const ax = pts[2 * i], ay = pts[2 * i + 1], j = (i + 1) % n, bx = pts[2 * j], by = pts[2 * j + 1], ia = ins(ax, ay), ib = ins(bx, by);
          if (ia) o.push(ax, ay);
          if (ia !== ib) o.push(...cut(ax, ay, bx, by));
        }
        pts = o;
      }
      return pts;
    };
    const ringsPath = (rings) => { const P = new Path2D(); for (const q of rings) { P.moveTo(q[0], q[1]); for (let i = 2; i < q.length; i += 2) P.lineTo(q[i], q[i + 1]); P.closePath(); } return P; };
    const mk = (e) => {
      const [part, fill, stroke, sw, fl, op, subs, cs, clip] = e;
      const closed = subs.map((_, k) => cs[k] === '1' || !!fill);
      const o = { part, fill, stroke, sw, op, brush: fl.indexOf('b') >= 0, grad: fl.indexOf('g') >= 0, pupil: fl.indexOf('p') >= 0, led: fill === '#39e07a' };
      const amp = fl.indexOf('r') >= 0 ? 1.15 : fl.indexOf('s') >= 0 ? 0.45 : 0;
      o.P = toPath(subs, closed);
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      subs.forEach((p) => { for (let i = 0; i < p.length; i += 2) { x0 = Math.min(x0, p[i]); x1 = Math.max(x1, p[i]); y0 = Math.min(y0, p[i + 1]); y1 = Math.max(y1, p[i + 1]); } });
      o.bb = [x0, y0, x1, y1];
      // boil copies: jittered centre lines (for a rough fill) and their marker outlines (filled)
      const lines = amp ? [0, 1, 2].map((v) => subs.map((p, k) => jit(p, closed[k], amp, v))) : [subs];
      const cr = (rings) => {
        if (!clip) return rings;
        if (clip.length === 4) return rings.map((q) => clipRect(q, clip)).filter((q) => q.length >= 6);
        // rotated element: clip in its own space, then back
        const [a, b, c, d, tx, ty] = clip.slice(4), det = a * d - b * c, out = [];
        for (const q of rings) {
          const l = []; for (let i = 0; i < q.length; i += 2) { const x = q[i] - tx, y = q[i + 1] - ty; l.push((d * x - c * y) / det, (-b * x + a * y) / det); }
          const k = clipRect(l, clip); if (k.length < 6) continue;
          const g = []; for (let i = 0; i < k.length; i += 2) g.push(a * k[i] + c * k[i + 1] + tx, b * k[i] + d * k[i + 1] + ty);
          out.push(g);
        }
        return out;
      };
      o.JF = amp && fill ? lines.map((L) => ringsPath(cr(L))) : null;
      o.SF = stroke ? lines.map((L, v) => { const R = []; L.forEach((p, k) => R.push(...strokePoly(p, closed[k], sw, amp ? 0.22 : 0, 40 + v))); return ringsPath(cr(R)); }) : null;
      if (o.brush) o.S = streaks(subs);
      // rim candidates: outlines of Regent's outer shapes (shirt, tie, lapels and collar sit inside the jacket, so their rim is never seen)
      o.sil = stroke === '#15131a' && sw >= 4 && !(part === 'torso' && x1 - x0 < 150);
      return o;
    };
    const G = { parts: {}, faces: {} };
    for (const e of D.reg) { const o = mk(e); (G.parts[o.part] = G.parts[o.part] || []).push(o); }
    for (const emo in D.faces) G.faces[emo] = D.faces[emo].map(mk);
    G.crt = D.crt.map(mk);
    G.hand = D.hand.map(mk);
    G.pic = D.pic.map(mk);
    G.glass = G.crt.find((e) => e.grad);
    // scanlines (poster: 34 rects of 3 every 8 units on the glass), one extra row above for the roll
    G.scan = new Path2D(); for (let i = -1; i < 35; i++) G.scan.rect(100, 66 + i * 8, 310, 3);
    // the poster's torn fan and rings, counted on its own 1600x800 layout so the tears never pop while a plate resizes
    const ms = 500 / 520, gx = 990 + 120 * ms, gy0 = 170 + 92 * ms, gy1 = 170 + 336 * ms, gc = (gy0 + gy1) / 2;
    const R = Math.hypot(gx, Math.max(gc, 800 - gc)) * 1.04;
    const counts = (pts, step) => pts.map((p, i) => { const q = pts[(i + 1) % pts.length]; return Math.max(1, Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) / step)); });
    G.Rref = R;
    G.fanN = counts([[gx + 6 * ms, gy0 - 8 * ms], [gx - R, gc - R], [gx - R, gc + R], [gx + 6 * ms, gy1 + 8 * ms]], 40);
    G.STEPS = [[1.1, '#39e07a', 0.12], [0.86, '#39e07a', 0.26], [0.66, '#39e07a', 0.55], [0.5, '#39e07a', 1], [0.36, '#b6f03c', 1], [0.24, '#e6ff2e', 1]];
    G.ringN = G.STEPS.map(([f]) => { const pts = []; for (let i = 0; i < 40; i++) { const t = i / 40 * Math.PI * 2; pts.push([gx + Math.cos(t) * R * f, gc + Math.sin(t) * R * f * 0.96]); } return counts(pts, 34); });
    G.rnd = rnd;
    // ink splats for the broken lie (unit space): one ragged splat and droplets
    const r = rnd(77), spl = new Path2D(), n = 26;
    for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, k = i % 2 ? 0.55 + r() * 0.25 : 0.85 + r() * 0.5; const x = Math.cos(a) * k, y = Math.sin(a) * k * 0.8; i ? spl.lineTo(x, y) : spl.moveTo(x, y); }
    spl.closePath();
    for (let i = 0; i < 7; i++) { const a = r() * Math.PI * 2, d = 1.3 + r() * 1.1, rr = 0.07 + r() * 0.16; spl.moveTo(Math.cos(a) * d + rr, Math.sin(a) * d * 0.8); spl.arc(Math.cos(a) * d, Math.sin(a) * d * 0.8, rr, 0, Math.PI * 2); }
    G.splat = spl;
    // the game's crack (breakLie): viewBox 200x100, stretched over the bubble
    G.crack = new Path2D('M96 0 L104 30 L88 46 L112 64 L98 100 M104 30 L140 22 L170 40 M88 46 L50 50 L22 34 M112 64 L150 78 M50 50 L40 80');
    // the speech-bubble tail (renderLie): viewBox 60x50
    G.tail = new Path2D('M2 4 L58 44 L26 4');
    return G;
  },

  create(api) {
    const M = (this && this.geo) ? this : BUG_MODS.outofscope;
    const G = M._g || (M._g = M._build(M.geo));
    const rand = (api && api.rnd) || Math.random;
    const emit = (api && api.emit) || (() => {});
    const BK = '#15131a', ACID = '#e6ff2e', VOID = '#050407', BLOOD = '#d4141c';
    const D2R = Math.PI / 180;
    const cl = (v, a, b) => (v < a ? a : v > b ? b : v);
    const ss = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : k * k * (3 - 2 * k));
    const seg = (u, a, b) => cl((u - a) / (b - a), 0, 1);
    const eIn = (k) => k * k, eOut = (k) => 1 - (1 - k) * (1 - k);
    const back = (k) => { const s = 1.9; k -= 1; return k * k * ((s + 1) * k + s) + 1; };
    const lerp = (a, b, k) => a + (b - a) * k;
    /* ---------- tiny affine helpers: [a b c d e f] ---------- */
    const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
    const T = (x, y) => [1, 0, 0, 1, x, y];
    const Rt = (deg) => { const r = deg * D2R, c = Math.cos(r), s = Math.sin(r); return [c, s, -s, c, 0, 0]; };
    const Sc = (x, y) => [x, 0, 0, y == null ? x : y, 0, 0];
    const about = (m, px, py, deg, sx, sy) => { let n = mul(m, T(px, py)); if (deg) n = mul(n, Rt(deg)); if (sx != null && (sx !== 1 || sy !== 1)) n = mul(n, Sc(sx, sy)); return mul(n, T(-px, -py)); };
    const app = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
    const put = (ctx, m) => ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
    const STAMP0 = mul(T(314, 58), Rt(-18));
    const HAT = { gleeful: [0, -8], smug: [0, -8], shocked: [-30, -14], furious: [0, 12] };

    /* ---------- idle schedule: live 2.5-6 s, hold 1.5-5 s (first a hold, so a settle lands on the poster) ---------- */
    const SCH = []; let tt = 1.6 + rand() * 2.0; const k0 = Math.floor(rand() * 4);
    for (let i = 0; i < 12; i++) { const live = 2.6 + rand() * 3.2, hold = 1.6 + rand() * 3.2; SCH.push([tt, tt + live, (k0 + i) % 4]); tt += live + hold; }
    const SCH_T = tt;
    const LOOP = 6.0;
    const S = { mode: 'idle', prev: 'idle', snap: null, now: 0, hit: null, look: null, shake: null, gag: null, nearS: 0, anc: { x: 0.39, y: 0.3 }, last: null, lastWorld: true, fan: null, fanKey: '', desk: null, deskKey: '', gc: null, gr: null };

    const NUM = ['bx', 'by', 'br', 'sx', 'sy', 'tr', 'la', 'lay', 'ra', 'st', 'hx', 'hy', 'hr', 'hatX', 'hatY', 'hatR', 'px', 'py', 'crtX', 'crtY', 'crtR', 'tear'];
    const rest = () => ({ bx: 0, by: 0, br: 0, sx: 1, sy: 1, tr: 0, la: 0, lay: 0, ra: 0, st: 0, hx: 0, hy: 0, hr: 0, hatX: 0, hatY: 0, hatR: 0, px: 0, py: 0, crtX: 0, crtY: 0, crtR: 0, tear: 0, wipe: 0, emo: 'gleeful', hb: null, front: 0, free: null, slip: 0, ink: 0 });
    const mix = (a, b, k) => { const o = Object.assign({}, b); for (const n of NUM) o[n] = a[n] + (b[n] - a[n]) * k; return o; };

    /* ---------- layout: the poster's 2:1, 1:1, 2:3 and 9:16 compositions, interpolated by aspect ---------- */
    // [figure width / min(w,h), figure x / w, figure y / h, CRT width / min, CRT x / w, CRT y / h]  (from POSTER.compose)
    // plus two keys of our own for the extremes: very tall (the CRT drops under him) and very wide (the light spreads between them)
    const KEYS = [[Math.log(0.2), [1.25, -0.17, 0.24, 0.82, 0.3, 0.6]], [Math.log(9 / 16), [1.0, -0.12, 0.27, 0.6, 0.55, 0.57]], [Math.log(2 / 3), [0.98, -0.1, 0.15, 0.58, 0.55, 0.48]], [0, [0.7, -0.04, 0.07, 0.46, 0.58, 0.3]], [Math.log(2), [0.8, 0.1875, 0.0125, 0.625, 0.619, 0.2125]], [Math.log(5), [0.84, 0.43, 0.02, 0.62, 0.73, 0.22]]];
    function layout(W, H) {
      const m = Math.min(W, H), la = Math.log(W / H), n = KEYS.length;
      let v = KEYS[0][1];
      if (la >= KEYS[n - 1][0]) v = KEYS[n - 1][1];
      else if (la > KEYS[0][0]) for (let i = 0; i < n - 1; i++) if (la <= KEYS[i + 1][0]) { const k = ss((la - KEYS[i][0]) / (KEYS[i + 1][0] - KEYS[i][0])); v = KEYS[i][1].map((x, j) => x + (KEYS[i + 1][1][j] - x) * k); break; }
      return { W, H, m, fw: v[0] * m, fx: v[1] * W, fy: v[2] * H, mw: v[3] * m, mx: v[4] * W, my: v[5] * H, sp: 1 + 0.5 * ss(seg(-la, 0, -Math.log(0.82))) };
    }
    /* the light: the poster's fan from the glass's left edge, clipped rings in flat torn steps */
    function tornN(pts, counts, amp, seed) {
      const r = G.rnd(seed), P = new Path2D(); let first = true;
      for (let i = 0; i < pts.length; i++) {
        const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length], L = Math.hypot(x1 - x0, y1 - y0) || 1, n = counts[i];
        const nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
        for (let k = 0; k < n; k++) { const u = k / n, j = k === 0 ? 0 : (r() - 0.5) * 2 * amp, x = x0 + (x1 - x0) * u + nx * j, y = y0 + (y1 - y0) * u + ny * j; if (first) { P.moveTo(x, y); first = false; } else P.lineTo(x, y); }
      }
      P.closePath(); return P;
    }
    function fanGeo(Lay) {
      const key = Lay.W + 'x' + Lay.H;
      if (S.fanKey === key) return S.fan;
      const { W, H, mw, mx, my, sp } = Lay, ms = mw / 520;
      const gx = mx + 120 * ms, gy0 = my + 92 * ms, gy1 = my + 336 * ms, gc = (gy0 + gy1) / 2;
      const R = Math.hypot(gx, Math.max(gc, H - gc)) * 1.04, q = R / G.Rref;
      const fan = tornN([[gx + 6 * ms, gy0 - 8 * ms], [gx - R, gc - R * sp], [gx - R, gc + R * sp], [gx + 6 * ms, gy1 + 8 * ms]], G.fanN, 7 * q, 21);
      const rings = G.STEPS.map(([f, c, op], i) => { const pts = []; for (let k = 0; k < 40; k++) { const t = k / 40 * Math.PI * 2; pts.push([gx + Math.cos(t) * R * f, gc + Math.sin(t) * R * f * 0.96]); } return [tornN(pts, G.ringN[i], 10 * q, 3 + i * 2), c, op]; });
      const r = G.rnd(9), specks = [];
      for (let i = 0; i < 44; i++) { const a = (r() - 0.5) * 1.7, d = (0.12 + r() * 0.85) * R, yy = gc + Math.sin(a) * d, rr = r(), oo = r(); if (yy > H * 0.8) continue; specks.push([gx - Math.cos(a) * d, yy, Math.max(0.6, (1 + rr * 2.4) * q), 0.2 + oo * 0.45, i]); }
      const out = new Path2D(); out.rect(-W, -H, W * 3, H * 3); out.addPath(fan);
      S.fan = { fan, out, rings, specks, gx, gc, gy0, gy1, ms, q }; S.fanKey = key;
      return S.fan;
    }
    function drawFan(ctx, F, t, rm) {
      // rings, dust, then the dark outside the fan painted back over them (cheaper than a clip mask)
      for (const [P, c, op] of F.rings) { ctx.globalAlpha = op; ctx.fillStyle = c; ctx.fill(P); }
      // dust in the light, drifting slowly (still under reduced motion)
      ctx.fillStyle = '#fffbea';
      const B = [new Path2D(), new Path2D(), new Path2D()];
      for (const [x, y, r, o, i] of F.specks) {
        const dx = rm ? 0 : Math.sin(t * 0.37 + i * 1.7) * 5 * F.q, dy = rm ? 0 : Math.cos(t * 0.29 + i * 2.3) * 4 * F.q;
        const b = o < 0.35 ? 0 : o < 0.5 ? 1 : 2; B[b].moveTo(x + dx + r, y + dy); B[b].arc(x + dx, y + dy, r, 0, 6.2832);
      }
      ctx.globalAlpha = 0.27; ctx.fill(B[0]); ctx.globalAlpha = 0.42; ctx.fill(B[1]); ctx.globalAlpha = 0.57; ctx.fill(B[2]);
      ctx.globalAlpha = 1; ctx.fillStyle = VOID; ctx.fill(F.out, 'evenodd');
    }
    function drawCable(ctx, Lay) {
      const ms = Lay.mw / 520, k = Lay.m / 800, x0 = Lay.mx + 470 * ms, y0 = Lay.my + 300 * ms, x1 = Lay.W + 40, y1 = Math.min(Lay.H * 0.78, Lay.my + 520 * ms);
      const P = new Path2D(); P.moveTo(x0, y0); P.bezierCurveTo(x0 + 60 * ms, y0 + 120 * ms, x1 - 80 * ms, y1 + 20 * ms, x1, y1);
      ctx.strokeStyle = '#0e0d12'; ctx.lineWidth = 13 * ms; ctx.stroke(P);
      ctx.save(); ctx.translate(-2 * k, -3 * k); ctx.strokeStyle = '#2c2836'; ctx.lineWidth = 3 * ms; ctx.stroke(P); ctx.restore();
    }
    /* ---------- one drawn element: offset print fill + brush hatch, rough outline ---------- */
    function drawE(ctx, e, bi, brush) {
      if (e.fill) {
        ctx.globalAlpha = e.op; ctx.fillStyle = e.fill; ctx.fill(e.JF ? e.JF[bi] : e.P);
        if (e.brush && brush) {
          ctx.lineWidth = 1; ctx.lineCap = 'butt';
          if (brush > 1) { ctx.strokeStyle = 'rgba(255,255,255,.16)'; ctx.stroke(e.S[0]); ctx.stroke(e.S[2]); ctx.strokeStyle = 'rgba(255,255,255,.32)'; ctx.stroke(e.S[1]); ctx.stroke(e.S[3]); }
          else { ctx.lineWidth = 1.3; ctx.strokeStyle = 'rgba(255,255,255,.24)'; ctx.stroke(e.S[0]); ctx.strokeStyle = 'rgba(255,255,255,.44)'; ctx.stroke(e.S[1]); }
          ctx.lineCap = 'round';
        }
      }
      if (e.stroke) { ctx.globalAlpha = e.op; ctx.fillStyle = e.stroke; ctx.fill(e.SF[e.SF.length > 1 ? bi : 0]); }
      ctx.globalAlpha = 1;
    }
    function grad(ctx) {
      if (S.gc !== ctx) { S.gc = ctx; const g = ctx.createRadialGradient(0.4, 0.42, 0, 0.4, 0.42, 0.72); g.addColorStop(0, '#fffbea'); g.addColorStop(0.22, ACID); g.addColorStop(0.62, ACID); g.addColorStop(0.86, '#39e07a'); g.addColorStop(1, '#1d6b3a'); S.gr = g; }
      return S.gr;
    }
    /* the poster's three-quarter cracked CRT; the screen lives inside its glass only */
    function drawCRT(ctx, Lay, p, bi, t, rm, brush) {
      const ms = Lay.mw / 520; brush = brush && (ms > 0.85 ? 2 : ms > 0.3 ? 1 : 0);
      ctx.save(); ctx.translate(Lay.mx + p.crtX * ms, Lay.my + p.crtY * ms); ctx.scale(ms, ms);
      if (p.crtR) { ctx.translate(250, 470); ctx.rotate(p.crtR * D2R); ctx.translate(-250, -470); }
      const yw = p.wipe > 0 ? 60 + 290 * p.wipe : -1, gb = G.glass.bb;
      for (const e of G.crt) {
        const inGlass = yw > 0 && e.bb[0] >= gb[0] - 1 && e.bb[2] <= gb[2] + 1 && e.bb[1] >= gb[1] - 8 && e.bb[3] <= gb[3] + 1 && !e.grad && e !== G.glass;
        if (inGlass) { ctx.save(); ctx.beginPath(); ctx.rect(gb[0] - 20, yw, 400, 400); ctx.clip(); drawE(ctx, e, bi, brush); ctx.restore(); continue; }
        if (e.grad) {
          const [x0, y0, x1, y1] = e.bb;
          ctx.save(); ctx.clip(e.P); if (yw > 0) { ctx.beginPath(); ctx.rect(gb[0] - 20, yw, 400, 400); ctx.clip(); }
          const g = grad(ctx);
          ctx.save(); ctx.translate(x0, y0); ctx.scale(x1 - x0, y1 - y0); ctx.fillStyle = g; ctx.fillRect(0, 0, 1, 1); ctx.restore();
          if (!rm) {
            // a tear: one slice of the picture slips sideways (never brighter, never more often than every few seconds)
            const ph = t % 4.7, tear = Math.max(p.tear, ph < 0.13 ? 1 : 0);
            if (tear > 0.05) {
              const n = Math.floor(t / 4.7) + (p.tear > 0.05 ? Math.floor(t * 9) : 0), y = 100 + ((n * 97) % 190);
              ctx.save(); ctx.beginPath(); ctx.rect(100, y, 320, 10 + 8 * tear); ctx.clip();
              ctx.translate(x0 + 9 * tear, y0); ctx.scale(x1 - x0, y1 - y0); ctx.fillStyle = g; ctx.fillRect(-0.1, 0, 1.2, 1); ctx.restore();
            }
            // the roll bar drifting down the glass
            const yb = 52 + ((t * 26) % 330); ctx.globalAlpha = 0.1; ctx.fillStyle = '#050806'; ctx.fillRect(100, yb, 320, 30);
          }
          ctx.globalAlpha = 0.16; ctx.fillStyle = '#050806';
          ctx.translate(0, rm ? 0 : (t * 5) % 8); ctx.fill(G.scan);
          ctx.restore(); ctx.globalAlpha = 1;
          continue;
        }
        if (e.led && !rm && (p.led || (t % 1.6) > 1.25)) { ctx.fillStyle = '#1d6b3a'; ctx.fill(e.P); continue; }
        drawE(ctx, e, bi, brush);
      }
      ctx.restore();
    }

    /* ---------- Regent, rigged on the game's own parts ---------- */
    function rig(base, p) {
      const F = mul(T(base.x, base.y), Sc(base.sc));
      const B = about(mul(F, T(p.bx, p.by)), 170, 466, p.br, p.sx, p.sy);
      const Tt = about(B, 170, 336, p.tr);
      const La = about(mul(Tt, T(0, p.lay)), 108, 186, p.la);
      const Ar = about(Tt, 252, 191, p.ra);
      let St = mul(about(Ar, 311, 103, p.st), STAMP0);
      if (p.free) {
        const o = app(St, 0, 0), a = Math.atan2(St[1], St[0]) / D2R, f = p.free, k = f.k;
        St = mul(mul(T(lerp(o[0], f.x, k), lerp(o[1], f.y, k)), Rt(lerp(a, f.rot, k))), Sc(base.sc));
      }
      const Hd = about(mul(Tt, T(p.hx, p.hy)), 172, 172, p.hr);
      const hb = p.hb || HAT[p.emo] || HAT.gleeful;
      const Ht = mul(Hd, mul(T(172 + p.hatX, 66 + hb[0] + p.hatY), mul(Rt(hb[1] + p.hatR), T(-172, -66))));
      return { legs: B, larm: La, arm: Ar, swish: Ar, torso: Tt, head: Hd, face: Hd, hat: Ht, stamp: St };
    }
    const ORDER = ['legs', 'larm', 'arm', 'torso', 'head', 'face', 'hat', 'stamp', 'swish'];
    const ORDER_F = ['legs', 'arm', 'torso', 'head', 'face', 'hat', 'stamp', 'swish', 'larm'];
    function drawRegent(ctx, base, p, bi, rim, brush) {
      const X = rig(base, p), order = p.front ? ORDER_F : ORDER, face = G.faces[p.emo] || G.faces.gleeful;
      if (rim > 0) {
        // the acid rim on the lit (right, upper) edge: the outline, shifted toward the light, behind the figure
        ctx.save(); ctx.translate(rim, -0.3 * rim); ctx.strokeStyle = ACID; ctx.fillStyle = ACID;
        for (const part of order) {
          const L = part === 'face' ? null : G.parts[part]; if (!L) continue;
          ctx.save(); put(ctx, X[part]);
          for (const e of L) if (e.sil) { const k = e.SF.length > 1 ? bi : 0; ctx.fill(e.SF[k]); if (e.fill) ctx.fill(e.JF ? e.JF[k] : e.P); }
          ctx.restore();
        }
        ctx.restore();
      }
      for (const part of order) {
        const L = part === 'face' ? face : G.parts[part]; if (!L) continue;
        ctx.save(); put(ctx, X[part]);
        for (const e of L) {
          if (e.pupil) {
            const big = p.emo === 'shocked', dx = big ? cl(p.px * 0.6, -11, 11) : cl(p.px, -22, 7), dy = big ? cl(p.py, -9, 9) : cl(p.py, -2, 2);
            ctx.save(); ctx.translate(dx, dy); drawE(ctx, e, bi, brush); ctx.restore();
          } else drawE(ctx, e, bi, brush);
        }
        if (part === 'stamp' && p.slip > 0) { ctx.save(); ctx.translate(0, 38); ctx.rotate(0.12); ctx.scale(2.1, 2.1); M.items.slip(ctx, 0, 0, S.now, 0); ctx.restore(); }
        if (part === 'stamp' && p.ink > 0) { ctx.save(); ctx.translate(0, 36); ctx.scale(30 * p.ink, 12 * p.ink); ctx.fillStyle = BLOOD; ctx.fill(G.splat); ctx.restore(); }
        ctx.restore();
      }
      return X;
    }

    /* ---------- poses ---------- */
    function beat(p, kind, u, D) {
      const env = ss(u / 0.45) * ss((D - u) / 0.45);
      if (kind === 0) { // grin bob, the stamp twitching
        const ph = u * Math.PI / 0.46, bob = Math.abs(Math.sin(ph)) * env;
        p.by += -8 * bob; p.sy *= 1 + 0.02 * bob; p.sx *= 1 - 0.01 * bob; p.hatY += -6 * Math.abs(Math.sin(ph - 0.6)) * env; p.hatR += 4 * Math.sin(ph * 0.5) * env;
        p.hy += 2.5 * Math.abs(Math.sin(ph + 0.4)) * env; p.tr += 1.6 * Math.sin(ph * 0.5) * env;
        const tw = u % 1.4, k = tw < 0.24 ? Math.sin(tw / 0.24 * Math.PI) : 0; p.ra += -12 * k * env; p.st += 18 * k * env;
        p.hr += 4 * Math.sin(u * 2.4) * env;
      } else if (kind === 1) { // admires the stamp, then a practice stamp in the air
        if (env > 0.3) p.emo = 'smug';
        p.px += 6 * env; p.py += -2 * env; p.hr += 6 * env; p.hx += 2 * env; p.ra += -6 * env; p.st += 10 * Math.sin(u * 3.2) * env;
        const pr = seg(u, D - 1.3, D - 1.0), bk = seg(u, D - 1.0, D - 0.55), k = eIn(pr) * (1 - ss(bk));
        p.ra += 34 * k; p.st += -32 * k; p.by += 3 * k; p.tr += 2 * k;
      } else if (kind === 2) { // tips his hat
        const k = ss(seg(u, 0.3, 0.85)) * (1 - ss(seg(u, D - 1.0, D - 0.4))), lift = ss(seg(u, 0.8, 1.1)) * (1 - ss(seg(u, D - 1.25, D - 0.85)));
        p.la += 168 * k; p.front = k > 0.45 ? 1 : 0; p.hatY += -9 * lift; p.lay += -9 * lift; p.hatR += 6 * k; p.tr += 2.5 * k; p.hr += 4 * k;
      } else { // a chuckle that shakes his shoulders
        const w = Math.sin(u * 15) * env; p.tr += 2.3 * w; p.by += -2.2 * Math.abs(w); p.hatR += -3 * w; p.hatY += -1.5 * Math.abs(w); p.ra += 3 * w;
      }
    }
    function idlePose(p, it) {
      const c = it % SCH_T;
      for (const [a, b, kind] of SCH) if (c >= a && c < b) { beat(p, kind, c - a, b - a); break; }
    }
    function reactPose(p, u) {
      const a1 = seg(u, 0, 0.1), a2 = seg(u, 0.1, 0.24), a3 = seg(u, 0.24, 0.5), a4 = seg(u, 0.5, 0.8);
      const ant = ss(a1) * (1 - a2);
      p.sy *= 1 - 0.035 * ant; p.sx *= 1 + 0.04 * ant; p.by += 1 * ant; p.tr += 2 * ant;
      if (u >= 0.1) p.emo = 'shocked';
      const up = eOut(a2) * (1 - eIn(a3));
      // a startled take: he jolts back from the cursor and up onto his toes; the paper hat pops off his head and hovers
      p.by += -4 * up + 3 * eOut(a2); p.bx += -14 * eOut(a2) + 6 * ss(a4); p.tr += -7 * eOut(a2) + 4 * ss(a4);
      p.sy *= 1 + 0.035 * a2 * (1 - a3); p.sx *= 1 - 0.03 * a2 * (1 - a3);
      const land = Math.sin(Math.PI * seg(u, 0.4, 0.6)); p.sy *= 1 - 0.04 * land; p.sx *= 1 + 0.03 * land;
      // the hat is placed by the take itself (not the game's shocked crown, 30 units up, which would leave a 2:1 plate)
      p.hb = [-18 * eOut(a2) + 6 * ss(seg(u, 0.3, 0.75)), -8 - 22 * eOut(a2) + 12 * ss(seg(u, 0.3, 0.75)) + 4 * Math.sin(u * 20) * a3 * (1 - a4)];
      p.hatX += 8 * eOut(a2) - 3 * ss(a4);
      p.ra += -16 * eOut(a2) + 6 * ss(a4); p.st += 12 * Math.sin(u * 30) * a2 * (1 - a3);
      p.la += 55 * eOut(a2) - 30 * ss(a4);
      p.hr += -7 * eOut(a2) + 4 * ss(a3);
      p.px += Math.sin(u * 50) * 1.5 * a3;
    }
    function enterPose(p, u) {
      reactPose(p, 0.8);
      const e1 = seg(u, 0, 0.16), e2 = seg(u, 0.16, 0.27), e3 = seg(u, 0.27, 0.7), hk = ss(seg(u, 0.02, 0.2));
      p.hb = [lerp(p.hb[0], 0, hk), lerp(p.hb[1], 12, hk)];
      if (u > 0.06) p.emo = 'furious';
      p.ra += -24 * ss(e1) * (1 - e2) + 104 * eIn(e2);
      p.st += -88 * eIn(e2);
      p.tr += -4 * ss(e1) * (1 - e2) + 8 * eIn(e2);
      p.by += -4 * eIn(e2); p.hatY += 10 * e2;
      // the slam jolts the set: the CRT rocks, its picture tears, the power LED is knocked dark
      if (u >= 0.27) { const v = u - 0.27, imp = Math.exp(-v * 7); p.crtR += 2.4 * imp * Math.sin(v * 38); p.crtX += 4 * imp * Math.sin(v * 31); p.tear = imp; p.ink = Math.min(1, v / 0.06); p.sy *= 1 - 0.02 * imp; p.led = 1; }
    }
    function squeezePose(p, q, mt) {
      const e = ss(cl(q * 1.8, 0, 1)) * ss(mt / 0.3);
      const esc = ss(seg(mt, 0.9, 1.6)) * ss(seg(q, 0.3, 0.75));
      if (e > 0.15) p.emo = 'furious';
      const grab = ss(seg(mt, 0.05, 0.4)) * e;
      p.la += 170 * grab; p.front = grab > 0.45 ? 1 : 0; p.hatY += 6 * grab; p.lay += 6 * grab; p.hatR += -16 * grab;
      p.bx += -18 * e; p.br += -4 * e; p.sx *= 1 - 0.08 * e; p.sy *= 1 + 0.03 * e; p.crtX += 14 * e; p.crtR += 2 * e;
      const trm = Math.sin(mt * 38) * 0.9 * e; p.bx += trm; p.hatX += trm * 0.5;
      const huff = Math.pow(Math.max(0, Math.sin(mt * 3.9)), 8); p.sy *= 1 + 0.03 * huff * e; p.hr += -3 * e + 2 * huff * e;
      const push = esc * (0.78 + 0.22 * Math.sin(mt * 6.5));
      p.ra += 62 * push; p.st += -62 * push - 70 * esc; p.tr += 4 * push; p.bx += 5 * push;
    }
    function overlays(p, now, Xprev, Lay) {
      const h = S.hit;
      if (h) {
        const hu = now - h.t0;
        if (hu > 1.45) S.hit = null;
        else {
          const k = 1 - ss(seg(hu, 0.06, 1.0)), imp = ss(seg(hu, 0, 0.06)), side = h.side;
          p.bx += -side * 9 * imp * k; p.tr += -side * 6 * imp * k; p.hr += -side * 9 * imp * k; p.sy *= 1 - 0.05 * imp * k;
          p.emo = hu < 0.6 ? 'shocked' : 'furious';
          if (h.head) { const hh = seg(hu, 0, 0.78), b = HAT[p.emo]; p.hb = [b[0] * ss(seg(hu, 0.78, 1.1)) - 26 * Math.sin(Math.PI * hh), b[1] - side * 360 * eOut(hh)]; p.hatX += -side * 34 * Math.sin(Math.PI * hh); }
        }
      }
      const l = S.look;
      if (l) {
        const lu = now - l.t0;
        if (lu > 1.6) S.look = null;
        else { const e = ss(lu / 0.2) * ss((1.6 - lu) / 0.3), dx = cl(l.dx || 0, -1, 1), dy = cl(l.dy || 0, -1, 1); if (e > 0.3 && !h) p.emo = 'smug'; p.px += (dx > 0 ? 7 : 22) * dx * e; p.py += 2 * dy * e; p.hr += 6 * dx * e; p.tr += 2 * dx * e; p.hx += 3 * dx * e; }
      }
      const s = S.shake;
      if (s) {
        const su = now - s.t0;
        if (su > 1.3) S.shake = null;
        else { const a = cl(s.amount == null ? 0.6 : s.amount, 0.2, 1.5), osc = Math.sin(su * 24) * Math.exp(-su * 4.2); p.tr += 7 * a * osc; p.bx += 5 * a * osc; p.hatR += -12 * a * Math.sin(su * 24 - 0.9) * Math.exp(-su * 3.5); p.hatX += -3 * a * osc; p.crtR += 1.2 * a * osc; p.ra += -6 * a * osc; if (a > 0.5 && su < 0.45 && !h) p.emo = 'shocked'; }
      }
      const g = S.gag;
      if (g) {
        const gu = now - g.t0;
        if (gu > 1.5) S.gag = null;
        else {
          const a = seg(gu, 0, 0.28), b = seg(gu, 0.28, 0.4), c = seg(gu, 0.46, 0.74), d = seg(gu, 0.74, 1.5);
          p.ra += -22 * ss(a) * (1 - b) + 72 * eIn(b) * (1 - ss(c)) - 40 * ss(c) * (1 - ss(d));
          p.st += -62 * eIn(b) * (1 - ss(c)) + 26 * ss(c) * (1 - ss(d));
          p.tr += -3 * ss(a) * (1 - b) + 3 * c * (1 - d); p.by += 4 * b * (1 - c); p.sy *= 1 - 0.03 * ss(a) * (1 - b);
          p.slip = gu > 0.38 && gu < 0.72 ? 1 : 0;
          if (gu > 0.3) p.emo = 'gleeful';
          if (gu > 0.5) { const ch = Math.sin((gu - 0.5) * 22) * (1 - d); p.by += -1.8 * Math.abs(ch); }
          if (!g.thrown && gu >= 0.72 && Xprev) {
            g.thrown = true;
            const o = app(Xprev.stamp, 0, 38);
            emit({ type: 'throw', item: 'slip', x: cl(o[0], 0, Lay.W), y: cl(o[1], 0, Lay.H), vx: 1, vy: -1.3 });
          }
        }
      }
    }

    /* ---------- the game, inside the glass: the desk, the lie, the throw ---------- */
    function rr(P, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); P.moveTo(x + r, y); P.arcTo(x + w, y, x + w, y + h, r); P.arcTo(x + w, y + h, x, y + h, r); P.arcTo(x, y + h, x, y, r); P.arcTo(x, y, x + w, y, r); P.closePath(); return P; }
    function deskGeo(W, H) {
      const key = W + 'x' + H;
      if (S.deskKey === key) return S.desk;
      const m = Math.min(W, H), r = G.rnd(5), amp = 0.016 * m;
      const torn = (pts) => { const P = new Path2D(); let f = true; for (let i = 0; i < pts.length; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length], L = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / L, ny = (x1 - x0) / L; for (let k = 0; k < 16; k++) { const u = k / 16, j = k ? (r() - 0.5) * 2 * amp : 0, x = x0 + (x1 - x0) * u + nx * j, y = y0 + (y1 - y0) * u + ny * j; f ? P.moveTo(x, y) : P.lineTo(x, y); f = false; } } P.closePath(); return P; };
      // wallRaw('d'): acid at the lower left, hot pink from the top, cobalt at the lower right
      const acid = torn([[-20, H * 0.72], [W * 0.24, H * 0.69], [W * 0.21, H + 20], [-20, H + 20]]);
      const pink = torn([[W * 0.46, -20], [W * 0.66, -20], [W * 0.64, H * 0.3], [W * 0.48, H * 0.32]]);
      const blue = torn([[W * 0.74, H * 0.68], [W + 20, H * 0.65], [W + 20, H + 20], [W * 0.76, H + 20]]);
      const scan = new Path2D(); const sp = Math.max(3, m / 110); for (let y = 0; y < H; y += sp) scan.rect(0, y, W, sp * 0.38);
      // Regent as the game frames him on the desk: chest up at the lower right (his gold buttons stay below the crop,
      // so the bottom band where Play sits stays clear of guarded colours). wide: the evidence window at the upper left,
      // the lie at his mouth; tall: the window at the top, the lie over his hat. Blended by aspect.
      const wide = (() => {
        const sc = Math.min(H * 0.82 / 270, W * 0.52 / 340), fx = W - 352 * sc, fy = H - 270 * sc;
        const bw = Math.min(W * 0.33, 250 * sc), bh = bw * 0.44, bx = fx + 100 * sc - bw, by = Math.min(fy + 150 * sc, H * 0.76) - bh;
        const wx = W * 0.045, wy = H * 0.07, ww = Math.max(W * 0.16, Math.min(W * 0.26, bx - W * 0.07)), wh = Math.min(ww * 0.95, Math.max(H * 0.28, by + bh * 0.3 - wy - H * 0.02));
        return [sc, fx, fy, bw, bh, bx, by, ww, wx, wy, wh];
      })();
      const tall = (() => {
        const sc = Math.min(H * 0.45 / 270, W * 0.88 / 340), fx = W - 346 * sc, fy = H - 270 * sc;
        const bw = Math.min(W * 0.72, 300 * sc), bh = bw * 0.44, bx = W * 0.05, by = fy - bh - 2 * sc;
        const wx = W * 0.06, wy = H * 0.05, ww = Math.min(W * 0.6, H * 0.32), wh = Math.max(H * 0.12, Math.min(ww * 0.95, by - wy - H * 0.03));
        return [sc, fx, fy, bw, bh, bx, by, ww, wx, wy, wh];
      })();
      const kt = ss(seg(Math.log(W / H), Math.log(1.25), Math.log(0.85)));
      const [sc, fx, fy, bw, bh, bx, by, ww, wx, wy, wh] = wide.map((v, i) => lerp(v, tall[i], kt));
      const th = wh * 0.16, sw = ww * 0.8, sh = sw * 0.4, slot = [wx + ww / 2, wy + th + (wh - th) / 2];
      const hs = m * 0.12 / 64;
      S.desk = { kt, m, acid, pink, blue, scan, sc, fx, fy, bw, bh, bx, by, ww, wx, wy, wh, th, sw, sh, slot, hs, rest: [wx + ww * 0.84, wy + wh * 0.92] };
      S.deskKey = key;
      return S.desk;
    }
    function drawSlip(ctx, x, y, w, h, rot, drag) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); if (drag) ctx.scale(1.06, 1.06);
      const P = rr(new Path2D(), -w / 2, -h / 2, w, h, h * 0.16), lw = Math.max(1, h * 0.05);
      ctx.save(); ctx.translate(drag ? h * 0.14 : h * 0.07, drag ? h * 0.2 : h * 0.07); ctx.globalAlpha = drag ? 0.45 : 1; ctx.fillStyle = '#000'; ctx.fill(P); ctx.restore(); ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff6e6'; ctx.fill(P);
      ctx.save(); ctx.clip(P); ctx.fillStyle = '#ff2e88'; ctx.fillRect(-w / 2, -h / 2, h * 0.2, h); ctx.restore();
      ctx.lineWidth = lw; ctx.strokeStyle = '#000'; ctx.stroke(P);
      // the 'fired' picto from the game, 80x80 grid
      ctx.save(); ctx.translate(-w / 2 + h * 0.26, -h * 0.4); ctx.scale(h * 0.8 / 80, h * 0.8 / 80); for (const e of G.pic) drawE(ctx, e, 0, false); ctx.restore();
      // a redaction bar where the slip's time would be
      ctx.fillStyle = BK; ctx.fillRect(-w / 2 + h * 1.2, -h * 0.14, w - h * 1.5, h * 0.28);
      ctx.restore();
    }
    function drawHand(ctx, x, y, s, press) {
      ctx.save(); ctx.translate(x, y); ctx.scale(s * press, s * press); ctx.translate(-29, -6);
      for (const e of G.hand) if (e.stroke !== ACID) drawE(ctx, e, 0, false);
      ctx.restore();
    }
    function bubblePath(w, h) { return rr(new Path2D(), -w / 2, -h / 2, w, h, w * 0.072); }
    function scribble(ctx, w, h, col) {
      const P = new Path2D();
      [[0.38, 0.78], [0.68, 0.56]].forEach(([yy, len], li) => {
        const x0 = -w * 0.38, y0 = -h / 2 + h * yy, n = Math.round(len * 16);
        for (let i = 0; i <= n * 6; i++) { const th = i / 6 * Math.PI, x = x0 + (i / (n * 6)) * w * len * 0.86 - Math.sin(th) * w * 0.012, y = y0 - Math.cos(th) * h * 0.07 * (0.7 + 0.3 * Math.sin(i * 0.37 + li)); i ? P.lineTo(x, y) : P.moveTo(x, y); }
      });
      ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, w * 0.022); ctx.stroke(P);
      return P;
    }
    function loopPose(p, u, Dk) {
      // Regent on the desk: the lie, the stamp sent at your proof, swatted, the throw, the break, the recovery
      if (u < 0.5) { p.emo = 'smug'; p.by += -3 * Math.abs(Math.sin(u * 12)); p.px += 3; }
      else if (u < 1.18) { p.emo = 'smug'; p.ra += 22 * ss(seg(u, 0.5, 0.8)); p.px += -16; p.py += 2; p.hr += -3; }
      else if (u < 1.75) { p.emo = 'furious'; p.ra += 22 * (1 - ss(seg(u, 1.18, 1.6))); p.tr += -3 * Math.sin(Math.PI * seg(u, 1.18, 1.6)); p.hatR += 6 * Math.sin(Math.PI * seg(u, 1.18, 1.5)); }
      else if (u < 2.42) { p.emo = 'smug'; p.px += -18; p.py += -1; p.hr += -2; }
      else if (u < 3.6) { p.emo = 'shocked'; const a = seg(u, 2.42, 2.6); p.by += -14 * Math.sin(Math.PI * a); p.bx += 8 * eOut(a); p.tr += 5 * eOut(a) * (1 - ss(seg(u, 2.8, 3.6))); p.hatY += -20 * eOut(a) + 14 * ss(seg(u, 2.7, 3.4)); p.hatX += 10 * eOut(a) - 6 * ss(seg(u, 2.7, 3.4)); p.hatR += -20 * eOut(a) + 14 * ss(seg(u, 2.7, 3.4)); p.ra += -14 * eOut(a) * (1 - ss(seg(u, 2.8, 3.5))); p.la += 40 * Math.sin(Math.PI * seg(u, 2.42, 3.2)); p.bx += -8 * ss(seg(u, 2.9, 3.6)); }
      else if (u < 4.3) { p.emo = 'furious'; p.hatY += -10 * (1 - ss(seg(u, 3.6, 4.0))); p.hatR += -6 * (1 - ss(seg(u, 3.6, 4.0))); p.sy *= 1 + 0.02 * Math.sin(u * 30) * (1 - seg(u, 3.6, 4.3)); }
      else if (u < 5.3) { p.emo = u < 4.9 ? 'furious' : 'smug'; const k = Math.sin(Math.PI * seg(u, 4.3, 5.3)); p.la += 170 * ss(k * 1.4); p.front = k > 0.35 ? 1 : 0; p.hatR += 8 * Math.sin(Math.PI * seg(u, 4.55, 5.0)); p.lay += 4 * k; }
      else { p.emo = u < 5.55 ? 'smug' : 'gleeful'; }
      // the stamp floats off on its own toward your proof, gets swatted, flies home
      const sl = Dk.slot;
      if (u > 0.5 && u < 1.85) {
        let x, y, rot, k;
        const home = [Dk.fx + 330 * Dk.sc, Dk.fy + 40 * Dk.sc];
        const hov = Math.max(Dk.sh * 0.9 + Dk.sc * 40, sl[1] - Dk.sh * 2.3), low = sl[1] - Dk.sh * 1.05, lift = Math.min(Dk.m * 0.1, home[1] * 0.5);
        if (u < 1.18) { const a = ss(seg(u, 0.5, 1.0)), b = ss(seg(u, 0.98, 1.16)); x = lerp(home[0], sl[0], a); y = lerp(home[1] - lift * Math.sin(Math.PI * a), hov, a) + b * (low - hov) + Math.sin(u * 26) * Dk.m * 0.006; rot = lerp(-18, -6, a) + Math.sin(u * 18) * 4; k = ss(seg(u, 0.5, 0.62)); }
        else { const a = seg(u, 1.18, 1.85); x = lerp(sl[0], home[0], eOut(a)); y = lerp(low, home[1], eOut(a)) - lift * 1.6 * Math.sin(Math.PI * a); rot = -6 - 360 * eOut(seg(u, 1.18, 1.6)); k = 1 - ss(seg(u, 1.62, 1.85)); }
        p.free = { k, x, y, rot };
      }
    }
    function drawLoop(ctx, W, H, mt, bi, t, brush) {
      const Dk = deskGeo(W, H), u = mt % LOOP, m = Dk.m;
      let cs = 1; if (mt < 0.42) cs = 1 + 0.4 * (1 - eOut(mt / 0.42));
      let shx = 0, shy = 0; const si = u - 2.42; if (si > 0 && si < 0.3) { const k = 1 - si / 0.3; shx = Math.sin(si * 90) * 4 * k * m / 380; shy = Math.cos(si * 70) * 3 * k * m / 380; }
      ctx.save(); ctx.translate(W / 2 + shx, H / 2 + shy); ctx.scale(cs, cs); ctx.translate(-W / 2, -H / 2);
      ctx.fillStyle = '#121015'; ctx.fillRect(-W, -H, W * 3, H * 3);
      ctx.fillStyle = ACID; ctx.fill(Dk.acid); ctx.fillStyle = '#ff2e88'; ctx.fill(Dk.pink); ctx.fillStyle = '#1f4bff'; ctx.fill(Dk.blue);
      // HUD: the credibility meter, no numbers
      const hw = Math.max(40, W * 0.15), hh = Math.max(9, m * 0.05), hx = W * 0.965 - hw, hy = H * 0.05;
      ctx.fillStyle = '#1d1b22'; const HP = rr(new Path2D(), hx, hy, hw, hh, hh * 0.3); ctx.fill(HP); ctx.lineWidth = Math.max(1.2, m * 0.006); ctx.strokeStyle = '#000'; ctx.stroke(HP);
      ctx.fillStyle = ACID; ctx.fillRect(hx + hh * 0.45, hy + hh * 0.3, hw - hh * 0.9, hh * 0.4);
      // the evidence window (the game's window chrome: panel, title bar, three spots, offset shadow)
      const { wx, wy, ww, wh, th } = Dk, so = m * 0.018;
      const WP = rr(new Path2D(), wx, wy, ww, wh, m * 0.016);
      ctx.save(); ctx.translate(so, so); ctx.fillStyle = '#ff2e88'; ctx.fill(WP); ctx.restore();
      ctx.fillStyle = '#1d1b22'; ctx.fill(WP);
      ctx.save(); ctx.clip(WP); ctx.fillStyle = '#2a2731'; ctx.fillRect(wx, wy, ww, th); ctx.fillStyle = '#000'; ctx.fillRect(wx, wy + th - m * 0.004, ww, m * 0.007); ctx.restore();
      ctx.lineWidth = Math.max(1.4, m * 0.007); ctx.strokeStyle = '#000'; ctx.stroke(WP);
      ['#39e07a', ACID, '#ff2e88'].forEach((c, i) => { ctx.beginPath(); ctx.arc(wx + ww - th * (0.5 + i * 0.62), wy + th / 2, th * 0.2, 0, 6.2832); ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = Math.max(1, m * 0.005); ctx.stroke(); });
      // the slip: in the window, picked up, thrown, bouncing away; a new one dealt in
      const sl = Dk.slot, swd = Dk.sw, sht = Dk.sh;
      const bcx = Dk.bx + Dk.bw / 2, bcy = Dk.by + Dk.bh / 2, hit = [bcx - Dk.bw * 0.18, bcy + Dk.bh * 0.05];
      let hand = Dk.rest, press = 1;
      const hp = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
      const stampSwat = [sl[0], sl[1] - sht * 1.05];
      const swatAt = [stampSwat[0] + sht * 0.3, stampSwat[1] + sht * 0.75];
      if (u >= 0.95 && u < 1.18) hand = hp(Dk.rest, swatAt, ss(seg(u, 0.95, 1.14)));
      else if (u >= 1.18 && u < 1.5) { hand = hp(swatAt, [sl[0] + swd * 0.1, sl[1]], ss(seg(u, 1.28, 1.5))); press = 1 - 0.16 * Math.sin(Math.PI * seg(u, 1.16, 1.28)); }
      else if (u >= 1.5 && u < 2.0) { const w = ss(seg(u, 1.62, 1.95)); hand = [sl[0] + swd * 0.1 - w * m * 0.06, sl[1] + w * m * 0.05]; press = u < 1.62 ? 1 - 0.12 * Math.sin(Math.PI * seg(u, 1.5, 1.62)) : 1; }
      else if (u >= 2.0 && u < 2.7) { const k = eOut(seg(u, 2.0, 2.12)); hand = hp([sl[0] + swd * 0.1 - m * 0.06, sl[1] + m * 0.05], [sl[0] + swd * 0.42, sl[1] - m * 0.1], k); }
      else if (u >= 2.7 && u < 3.4) hand = hp([sl[0] + swd * 0.42, sl[1] - m * 0.1], Dk.rest, ss(seg(u, 2.7, 3.4)));
      // slip position
      let sx = sl[0], sy = sl[1], srot = 0, drag = false, showSlip = true, inWin = true;
      if (u >= 1.5 && u < 2.0) { sx = hand[0] - swd * 0.1; sy = hand[1]; srot = -6 * D2R; drag = u > 1.56; inWin = false; }
      else if (u >= 2.0 && u < 2.42) { const k = seg(u, 2.0, 2.42), x0 = sl[0] + swd * 0.1 - m * 0.06 - swd * 0.1, y0 = sl[1] + m * 0.05; sx = lerp(x0, hit[0], k); sy = lerp(y0, hit[1], k) - Math.sin(Math.PI * k) * Math.min(m * 0.2, Math.max(0, Math.min(y0, hit[1]) - sht)); srot = (-6 + 20 * k) * D2R; drag = true; inWin = false; }
      else if (u >= 2.42 && u < 3.2) { const k = u - 2.42; sx = hit[0] - k * m * 1.25; sy = hit[1] - k * m * 0.9 + k * k * m * 1.3; srot = (14 - k * 520) * D2R; inWin = false; if (sx < -swd || sy > H * 0.8) showSlip = false; }
      else if (u >= 3.2 && u < 4.6) showSlip = false;
      else if (u >= 4.6 && u < 5.2) { sx = lerp(Dk.wx - swd * 0.6, sl[0], back(seg(u, 4.6, 5.1))); }
      if (showSlip && inWin) { ctx.save(); const C = new Path2D(); C.rect(Dk.wx, Dk.wy + th, ww, wh - th); ctx.clip(C); drawSlip(ctx, sx, sy, swd, sht, srot, false); ctx.restore(); }
      // Regent
      const p = rest(); loopPose(p, u, Dk);
      const X = drawRegent(ctx, { x: Dk.fx, y: Dk.fy, sc: Dk.sc }, p, bi, 0, Dk.sc * 340 > 370 ? 2 : Dk.sc * 340 > 110 ? 1 : 0);
      // the lie: pops in, takes the hit, cracks, breaks (dark, struck through in red ink), drops away
      if (u < 4.15) {
        const bw = Dk.bw, bh = Dk.bh;
        let s = 1, rot = 0, ox = 0, oy = 0;
        if (u < 0.5) { const k = seg(u, 0.02, 0.5); s = k <= 0 ? 0 : 0.2 + 0.8 * back(k); rot = -12 * (1 - k); }
        const hu = u - 2.42;
        if (hu >= 0 && hu < 0.35) { const k = hu / 0.35; ox = (k < 0.25 ? k / 0.25 * 8 : k < 0.5 ? 8 - (k - 0.25) / 0.25 * 14 : -6 * (1 - (k - 0.5) / 0.5)) * bw / 250; oy = Math.sin(k * Math.PI * 2) * -4 * bw / 250; rot += (k < 0.25 ? 3 * k / 0.25 : k < 0.5 ? 3 - 5 * (k - 0.25) / 0.25 : -2 * (1 - (k - 0.5) / 0.5)); }
        if (hu >= 0 && hu < 0.5) { const k = hu / 0.5; s *= 1 + 0.12 * (k < 0.2 ? k / 0.2 : 1 - (k - 0.2) / 0.8); rot += -4 * (k < 0.2 ? k / 0.2 : 1 - (k - 0.2) / 0.8); }
        if (u > 3.85) { const k = seg(u, 3.85, 4.15); s *= k < 0.3 ? 1 + 0.14 * (k / 0.3) : 1.14 * (1 - eIn((k - 0.3) / 0.7)); rot += 8 * k; }
        if (s > 0.01) {
          const broken = u >= 2.62;
          ctx.save(); ctx.translate(bcx + ox, bcy + oy); ctx.rotate(rot * D2R); ctx.scale(s, s);
          const BP = bubblePath(bw, bh), lw = Math.max(1.2, bw * 3 / 250), k = bw / 250;
          // tail toward Regent, drawn like renderLie's svg (60x50 at the lower right)
          ctx.save(); ctx.translate(bw / 2 - 20 * k, bh / 2 - 24 * k); ctx.scale(k, k);
          ctx.fillStyle = broken ? BK : '#fff'; ctx.fill(G.tail); ctx.lineWidth = 3; ctx.strokeStyle = broken ? '#000' : BK; ctx.lineJoin = 'round'; ctx.stroke(G.tail);
          ctx.restore();
          ctx.save(); ctx.translate(5 * k, 5 * k); ctx.fillStyle = BK; ctx.fill(BP); ctx.restore();
          ctx.fillStyle = broken ? BK : '#fff'; ctx.fill(BP); ctx.lineWidth = lw; ctx.strokeStyle = broken ? '#000' : BK; ctx.stroke(BP);
          ctx.save(); ctx.translate(bw / 2 - 20 * k, bh / 2 - 24 * k); ctx.scale(k, k); ctx.strokeStyle = broken ? BK : '#fff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(4, 2); ctx.lineTo(28, 2); ctx.stroke(); ctx.restore();
          scribble(ctx, bw, bh, broken ? '#6a6478' : BK);
          if (broken) { ctx.strokeStyle = BLOOD; ctx.lineWidth = Math.max(1.5, bw * 4 / 250); ctx.beginPath(); ctx.moveTo(-bw * 0.4, -bh / 2 + bh * 0.38); ctx.lineTo(-bw * 0.4 + bw * 0.7, -bh / 2 + bh * 0.36); ctx.moveTo(-bw * 0.4, -bh / 2 + bh * 0.68); ctx.lineTo(-bw * 0.4 + bw * 0.5, -bh / 2 + bh * 0.7); ctx.stroke(); }
          if (hu >= 0) {
            if (!broken) { ctx.save(); ctx.translate(-bw / 2, -bh / 2); ctx.scale(bw / 200, bh / 100); ctx.strokeStyle = BK; ctx.lineWidth = 3.5; ctx.lineJoin = 'round'; ctx.stroke(G.crack); ctx.restore(); }
            const sk = Math.min(1, hu / 0.08); ctx.save(); ctx.translate(hit[0] - bcx, hit[1] - bcy); ctx.scale(bh * 0.32 * sk, bh * 0.32 * sk); ctx.fillStyle = BLOOD; ctx.fill(G.splat); ctx.restore();
          }
          ctx.restore();
        }
      }
      // the slip in flight is over everything
      if (showSlip && !inWin) drawSlip(ctx, sx, sy, swd, sht, srot, drag);
      // swat marks
      if (u > 1.16 && u < 1.32) { ctx.save(); ctx.translate(stampSwat[0], stampSwat[1]); ctx.strokeStyle = BK; ctx.lineWidth = Math.max(1.5, m * 0.009); ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i < 4; i++) { const a = -0.6 + i * 0.5, r0 = sht * 0.6, r1 = sht * 0.95; ctx.moveTo(Math.cos(a) * r0 - sht * 0.15, Math.sin(a) * r0 + sht * 0.3); ctx.lineTo(Math.cos(a) * r1 - sht * 0.15, Math.sin(a) * r1 + sht * 0.3); } ctx.stroke(); ctx.restore(); }
      drawHand(ctx, hand[0], hand[1], Dk.hs, press);
      // the screen we are inside
      ctx.globalAlpha = 0.12; ctx.fillStyle = '#050806'; ctx.fill(Dk.scan); ctx.globalAlpha = 1;
      ctx.restore();
      // anchor on his head (inside the loop scene)
      const hd = app(X.head, 172, 124), ax = W / 2 + shx + (hd[0] - W / 2) * cs, ay = H / 2 + shy + (hd[1] - H / 2) * cs;
      S.anc = { x: cl(ax / W, 0, 1), y: cl(ay / H, 0, 1) };
    }

    /* ---------- the poster world (idle, react, enter, squeezed) ---------- */
    function drawWorld(ctx, Lay, p, bi, t, rm, cam, brush) {
      const { W, H } = Lay;
      ctx.save();
      if (cam) { ctx.translate(W / 2, H / 2); ctx.scale(cam.s, cam.s); ctx.translate(-cam.x, -cam.y); }
      ctx.fillStyle = VOID; ctx.fillRect(-W, -H, W * 3, H * 3);
      const F = fanGeo(Lay);
      drawFan(ctx, F, t, rm);
      drawCable(ctx, Lay);
      drawCRT(ctx, Lay, p, bi, t, rm, brush);
      if (p.wipe > 0) {
        // the CRT refreshes into the game: a scan wipe rolls down the glass and the desk is on the screen,
        // placed so that when the push ends it is exactly the loop's own frame
        const ms = Lay.mw / 520, ox = Lay.mx + p.crtX * ms, oy = Lay.my + p.crtY * ms, yw = 60 + 290 * p.wipe, E = glassCam(Lay, 1), anc = S.anc;
        ctx.save(); ctx.translate(ox, oy); ctx.scale(ms, ms); ctx.clip(G.glass.P); ctx.beginPath(); ctx.rect(G.glass.bb[0] - 20, 0, 400, yw); ctx.clip();
        ctx.fillStyle = '#050806'; ctx.fillRect(G.glass.bb[0] - 20, yw - 4, 400, 4);
        ctx.beginPath(); ctx.rect(G.glass.bb[0] - 20, 0, 400, yw - 4); ctx.clip();
        ctx.scale(1 / ms, 1 / ms); ctx.translate(-ox, -oy);
        ctx.translate(E.x, E.y); ctx.scale(1 / E.s, 1 / E.s); ctx.translate(-W / 2, -H / 2);
        drawLoop(ctx, W, H, S.pictureMt || 0, bi, t, brush);
        ctx.restore(); S.anc = anc;
      }
      const sc = Lay.fw / 340, rim = cl(8 * Lay.m / 800, 1.4, 8);
      const X = drawRegent(ctx, { x: Lay.fx, y: Lay.fy, sc }, p, bi, rim, brush);
      ctx.restore();
      const hd = app(X.head, 172, 124); let ax = hd[0], ay = hd[1];
      if (cam) { ax = W / 2 + (ax - cam.x) * cam.s; ay = H / 2 + (ay - cam.y) * cam.s; }
      S.anc = { x: cl(ax / W, 0, 1), y: cl(ay / H, 0, 1) };
      return X;
    }
    function glassCam(Lay, k) {
      // the camera push into the CRT glass: k 0 -> 1
      const F = fanGeo(Lay), ms = F.ms, cx = Lay.mx + 256 * ms, cy = Lay.my + 236 * ms, gw = 270 * ms, gh = 200 * ms;
      const end = Math.max(Lay.W / (gw * 0.8), Lay.H / (gh * 0.8));
      return { s: Math.exp(Math.log(end) * k), x: lerp(Lay.W / 2, cx, Math.min(1, k * 1.6)), y: lerp(Lay.H / 2, cy, Math.min(1, k * 1.6)) };
    }

    return {
      frame(ctx, s) {
        const W = Math.max(1, s.w || 1), H = Math.max(1, s.h || 1), rm = !!s.rm, t = rm ? 0 : Math.max(0, s.t || 0), mt = rm ? 0 : Math.max(0, s.mt || 0);
        const mode = rm ? 'idle' : (s.mode || 'idle');
        S.now = t;
        if (mode !== S.mode) { S.prev = S.mode; S.mode = mode; S.snap = S.lastWorld && S.last ? S.last : null; S.settleK = S.camK || 0; S.settleW = S.wipeK || 0; }
        const dt = cl(s.dt || 0.016, 0, 0.05);
        S.nearS += ((rm ? 0 : (s.near || 0)) - S.nearS) * Math.min(1, dt * 6);
        const bi = rm ? 0 : (Math.floor(t * 8) % 3 + 3) % 3;
        const Lay = layout(W, H);
        // brush hatch level: full where a figure unit is over ~1.1 px, every other column below, none on tiny plates
        const brush = Lay.fw > 370 ? 2 : Lay.fw > 110 ? 1 : 0;
        ctx.save();
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        if (mode === 'loop') {
          drawLoop(ctx, W, H, mt, bi, t, brush);
          S.lastWorld = false; S.pictureMt = mt; S.camK = 1; S.wipeK = 1;
        } else {
          let p = rest(), cam = null;
          if (!rm) {
            if (mode === 'idle') {
              idlePose(p, mt);
              const g = ss(seg(S.nearS, 0.22, 0.7));
              if (g > 0) { if (g > 0.35 && p.emo === 'gleeful') p.emo = 'smug'; p.px += -9 * g; p.py += 1 * g; p.hr += -3 * g; p.ra += 7 * g; p.st += -5 * g; }
            } else if (mode === 'react') reactPose(p, mt);
            else if (mode === 'enter') { enterPose(p, mt); if (mt > 0.27) cam = glassCam(Lay, eIn(seg(mt, 0.27, 0.7))); p.wipe = seg(mt, 0.43, 0.69); S.pictureMt = 0; }
            else if (mode === 'squeezed') squeezePose(p, s.squeeze == null ? 1 : s.squeeze, mt);
            S.camK = mode === 'enter' ? eIn(seg(mt, 0.27, 0.7)) : 0; S.wipeK = mode === 'enter' ? p.wipe : 0;
            // the settle back out of the game: the camera pulls back from wherever it was in the glass, the screen refreshes back
            if ((mode === 'idle' || mode === 'squeezed') && S.settleK > 0.01 && mt < 0.5) {
              cam = glassCam(Lay, S.settleK * (1 - eOut(mt / 0.5))); p.wipe = S.settleW * (1 - seg(mt, 0.04, 0.28)); p.hatY += -8 * Math.sin(Math.PI * seg(mt, 0.3, 0.7));
            }
            if (mode === 'idle' || mode === 'squeezed') overlays(p, t, S.lastX, Lay);
            if (S.snap && mode !== 'enter' && mt < 0.28 && !cam) p = mix(S.snap, p, ss(mt / 0.28));
          }
          S.lastX = drawWorld(ctx, Lay, p, bi, t, rm, cam, brush);
          S.last = p; S.lastWorld = true;
        }
        S.layW = W; S.layH = H;
        // a cue that arrived mid-hover still ends in a throw on time, from his head
        const g = S.gag;
        if (g && !g.thrown && (mode !== 'idle' && mode !== 'squeezed') && t - g.t0 >= 0.72) { g.thrown = true; emit({ type: 'throw', item: 'slip', x: S.anc.x * W, y: S.anc.y * H, vx: 1, vy: -1.3 }); }
        if (g && t - g.t0 > 1.5) S.gag = null;
        ctx.restore();
      },
      on(evt) {
        if (!evt || !evt.type) return;
        const now = S.now;
        if (evt.type === 'cue') { if (!S.gag) S.gag = { t0: now, thrown: false }; }
        else if (evt.type === 'hit') {
          const W = S.layW || 400, H = S.layH || 300, ax = S.anc.x * W, ay = S.anc.y * H, x = evt.x == null ? ax : evt.x, y = evt.y == null ? ay : evt.y;
          S.hit = { t0: now, side: x >= ax ? 1 : -1, head: Math.hypot(x - ax, y - ay) < Math.min(W, H) * 0.3 };
        } else if (evt.type === 'look') S.look = { t0: now, dx: evt.dx || 0, dy: evt.dy || 0 };
        else if (evt.type === 'shake') S.shake = { t0: now, amount: evt.amount };
      },
      anchor() { return S.anc; }
    };
  }
};
