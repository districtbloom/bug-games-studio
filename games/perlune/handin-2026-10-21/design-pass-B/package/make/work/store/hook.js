// Store-tile hook for render.js (passed as a view's `js`). PROPOSED LOOKS ONLY: nothing here touches the game's
// files. It wraps the game's own drawCreature at render time and swaps what the body / halo instance is drawn with,
// using the game's own meshes (M.*), materials (MAT.*), colours (hex) and iridescence (iri). window.__look picks the look.
if (!window.__storeHook) {
  window.__storeHook = 1;
  const dc0 = drawCreature, dd0 = drawCreatureDust;
  window.__dc0 = dc0;
  drawCreatureDust = function () { const K = window.__look || {}; if (K.hide || K.nodust) return; return dd0(); };
  drawCreature = function (pos, n, face, o) {
    const K = window.__look || {};
    if (K.extra) K.extra(pos, n, face);
    if (K.hide) return;
    const sp0 = M.sphere.put, tp0 = M.torus.put, GOLD = hex(0xffd27a); let first = true;
    if (K.body) M.sphere.put = function (p, q, s, c, mat, emit, wob, flash, seed) {
      if (first && mat === MAT.LIQUID) { first = false; return K.body(sp0.bind(this), p, q, s, emit, wob, flash, seed); }
      return sp0.call(this, p, q, s, c, mat, emit, wob, flash, seed);
    };
    if (K.halo) M.torus.put = function (p, q, s, c, mat, emit, ...r) {
      if (c === GOLD && mat === MAT.GLOW) return K.halo(tp0.bind(this), p, q, s, emit);
      return tp0.call(this, p, q, s, c, mat, emit, ...r);
    };
    try { return dc0(pos, n, face, o); } finally { delete M.sphere.put; delete M.torus.put; }
  };
}
window.K_OPAL = Object.assign({ fire: 0.45, n: 150, r: 0.055, el: 1.0, skin: 0.04, deep: 0.985, body: 0.24 }, window.K_OPAL_SET || {});
window.__fib = function (i, N) { const y = 1 - (i + 0.5) / N * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963; return new V3(r * Math.cos(th), y, r * Math.sin(th)); };
window.__LOOKS = {
  // OPAL: milky pearl body (the game's PEARL material, the thin-film Nacre's moon wears) with flecks of colour set
  // under a thin milky GLASS skin (small emissive flakes in the game's own accents: cyan, pink, soft blue, violet)
  opal: {
    body(put, p, q, s, emit, wob, flash, seed) {
      put(p, q, new V3(s.x * 0.97, s.y * 0.97, s.z * 0.97), [0.84, 0.83, 0.90], MAT.PEARL, K_OPAL.body, wob, flash, seed);
      put(p, q, new V3(s.x * 1.02, s.y * 1.02, s.z * 1.02), [0.95, 0.95, 1.0], MAT.GLASS, K_OPAL.skin, wob, flash, seed); // milky skin over the fire
      const PAL = [hex(0x5ff3ff), hex(0xff5c9a), hex(0x8fb8ff), hex(0xff8ad0), hex(0x9ff6ff), hex(0xc58bff)];
      const N = K_OPAL.n, Y = new V3(0, 1, 0), qq = new Q(), ss = new V3();
      for (let i = 0; i < N; i++) {
        const d = __fib(i, N);
        if (d.z > 0.55 && Math.abs(Math.abs(d.x) - 0.33) < 0.26 && Math.abs(d.y - 0.28) < 0.3) continue; // keep the eyes clear
        const h = Math.sin(i * 12.9898) * 43758.5453, rnd = h - Math.floor(h);
        const lp = new V3(d.x * s.x * K_OPAL.deep, d.y * s.y * K_OPAL.deep, d.z * s.z * K_OPAL.deep).applyQ(q).add(p);
        const wn = d.clone().applyQ(q); qq.fromUnit(Y, wn); qq.mul(new Q().axisAngle(Y, rnd * 40.0));
        const r = s.x * K_OPAL.r * (0.6 + 0.8 * rnd); ss.set(r, r * 0.15, r * K_OPAL.el * (0.5 + rnd));
        const c = PAL[i % PAL.length]; put(lp, qq, ss, c, MAT.GLOW, K_OPAL.fire * (0.7 + 0.5 * rnd));
      }
    }
  },
  // SMOKE GLASS: a dark obsidian core (the game's OBSID material: dark centre, coloured rim) inside a smoked violet
  // shell of the game's GLASS material; the eyes and their white catchlights are the game's own, untouched
  smoke: {
    body(put, p, q, s, emit, wob, flash, seed) {
      put(p, q, new V3(s.x * 0.95, s.y * 0.95, s.z * 0.95), [0.20, 0.10, 0.42], MAT.OBSID, 0.0, wob, flash, seed);
      put(p, q, s, [0.30, 0.20, 0.55], MAT.GLASS, 0.06, wob, flash, seed);
    }
  },
  // GLASS HALO: the Chimera's halo (a GLOW torus in gold, 0xffd27a, in the game) drawn instead as clear glass in the
  // crest's own cyan (0x9ff6ff), with a thin cyan light inside it
  halo: {
    halo(put, p, q, s, emit) {
      put(p, q, s, hex(0x9ff6ff), MAT.GLASS, 0.25);
      M.ring.put(p, q, s * 1.0, hex(0x9ff6ff), MAT.GLOW, 0.9);
    }
  },
  trail: {},
  // MOONLET: shown as itself: a small pearl sphere (the game's PEARL material, Nacre's moon colour 0xfff2fb) on a thin
  // orbit line drawn with the game's FX.strip, around where the droplet would be
  moon: { hide: true }
};
