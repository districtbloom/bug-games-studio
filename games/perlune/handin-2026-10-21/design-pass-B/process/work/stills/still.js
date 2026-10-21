// Perlune design pass B · stills group: stage REAL moments of the shipped build and capture posed frames.
// Reuses the approach of /home/claude/video/cap.js (virtual timers so the game's own setTimeouts fire in order)
// and the posing of /home/claude/passB/tools/render.js (camera relative to the creature, the poster's finish).
// usage: MSAA=4 node still.js <cssW> <cssH> <dpr> <outPrefix> <shots.js> <shotId> [capId,capId...]
// A shot = { setup: [js | ms], caps: [{ id, pre: js, run: secs, cam: {...}, light: [r,u,b], post: {...}, js: js }] }
//   setup runs once (simulate the journey with the game's own bot); caps run in order on the same live game:
//   pre (js), run (secs of simulation, timers advanced), then pose the camera and render one finished frame.
// cam (relative to the creature, like render.js): { yaw, dist, up, side, ty, dx, fov } or { abs: 'js returning {pos,target,up,fov}' }
// post: dof, tilt, grain (0.01), streak (0.45), vig (0: never a vignette), bloom, exp, sat, neb, ca
const { chromium } = require('playwright');
const path = require('path');
const [w, h, dpr, pre, mod, shotId, capList] = [+process.argv[2], +process.argv[3], +process.argv[4], process.argv[5], process.argv[6], process.argv[7], process.argv[8]];
const SHOTS = require(path.resolve(mod)); const S = SHOTS[shotId];
if (!S) { console.error('unknown shot', shotId, Object.keys(SHOTS)); process.exit(1); }
const want = capList ? new Set(capList.split(',')) : null;

const HELPERS = `
window.H = {
  hide(ids) { for (const id of ids) { const e = document.getElementById(id); if (e) e.style.setProperty('display', 'none', 'important'); } },
  build(evos, form, scale) {
    P.evos = Object.assign({}, evos); P.myth = {}; P.res = {};
    for (const k in RESON) { const r = RESON[k]; if (P.evos[r.a] && P.evos[r.b]) P.res[k] = true; }
    P.form = form; for (const k in P.evos) P.grow[k] = 1; recomputeStats(); P.hp = P.maxHp;
    P.stage = stageOf(form); P.scale = scale || (0.52 + 0.042 * form + 0.07 * (P.evos.mass || 0)); try { UI.updateTray(); } catch (e) {}
  },
  land(id, cleared) {
    const pl = planetById(id); G.run.cleared = cleared.slice();
    P.pos.copy(pl.c).addS(new V3(0.5, 0.4, 0.7).norm(), pl.r + 50); G.sp.H = pl.c.clone().sub(P.pos).norm(); G.sp.H.y = 0; G.sp.H.norm();
    startLanding(pl); H.run(2.6); snapWake();
  },
  ageFx(dt) { // the game ages rings/beams/arcs while drawing; we simulate without drawing, so age them here
    for (const L of [G.rings, G.beams, G.arcs]) for (let i = L.length - 1; i >= 0; i--) { L[i].life -= dt; if (L[i].life <= 0) L.splice(i, 1); }
    for (const r of G.rings) r.rad += r.spd * dt;
  },
  run(secs, every) { const st = 1 / 60, n = Math.round(secs / st); for (let i = 0; i < n; i++) { PERLUNE.sim(st, st); H.ageFx(st); __vt.advance(1000 * st); if (every) every(i * st); } },
  dashEvery(t, e) { if (G.state === 'play' && P.dashCD <= 0 && Math.floor(t / e) !== Math.floor((t - 1 / 60) / e)) IN.dashPressed = true; }
};
G.meta.hints = new Proxy({}, { get: () => 1, set: () => true });
for (const k of Object.keys(AU)) if (typeof AU[k] === 'function' && !['setKey','setMood'].includes(k)) AU[k] = function () {};
`;

(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('PAGEERROR', e.message, (e.stack || '').split('\n')[1]));
  p.on('console', m => { const t = m.text(); if (m.type() === 'error' && !/fonts|ERR_/.test(t)) console.log('CONSOLE', t); else if (m.type() === 'log') console.log('page:', t); });
  await p.route('**/fonts.g*/**', r => r.abort());
  await p.addInitScript(seed => { // seeded Math.random so a test render and the final render play the same moment
    let a = seed >>> 0; window.__rng = { save() { return a; }, load(v) { a = v; } }; Math.random = function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }, +(process.env.SEED || S.seed || 1));
  await p.addInitScript(() => {
    let vt = 0, id = 1; const q = new Map();
    window.__vt = { advance(ms) { const end = vt + ms; for (;;) { let best = null; for (const [k, v] of q) if (v.at <= end && (!best || v.at < best[1].at)) best = [k, v]; if (!best) break; q.delete(best[0]); vt = Math.max(vt, best[1].at); try { best[1].fn(...best[1].args); } catch (e) { console.error(e && e.message); } } vt = end; } };
    window.setTimeout = (fn, ms, ...args) => { const k = id++; q.set(k, { at: vt + (+ms || 0), fn: typeof fn === 'function' ? fn : () => {}, args }); return k; };
    window.clearTimeout = k => { q.delete(k); };
    performance.now = () => vt;
  });
  await p.goto('file:///home/claude/sivver/dist/perlune.local.html');
  await p.addStyleTag({ content: 'body > *:not(#gl){display:none !important;}' });
  const W = w * dpr, Hh = h * dpr;
  await p.evaluate(([W, Hh, ms]) => { G.test.manual = true; G.test.god = true; MSAA = ms; R.w = 0; R.resize(W, Hh); G.fxDt = 1 / 60; }, [W, Hh, +(process.env.MSAA || 0)]);
  await p.evaluate(HELPERS);
  for (const step of [].concat(S.setup)) {
    if (typeof step === 'number') { await p.evaluate(ms => __vt.advance(ms), step); continue; }
    await p.evaluate(step); await p.evaluate(() => __vt.advance(20));
  }
  for (const c of S.caps) {
    if (c.pre) await p.evaluate(c.pre);
    if (c.run) await p.evaluate(s => H.run(s), c.run);
    const skip = !!(want && !want.has(c.id));
    const info = await p.evaluate(([c, skip]) => {
      const rs = __rng.save(); const pp = R.post;
      if (c.face) { // turn the creature to face a point: 'nearest' foe, or an angle (radians) from its current facing
        if (c.face === 'boss' && G.boss) { towards(P.n, G.boss.n, P.face); P.F.copy(P.face); }
        else if (c.face === 'first' && window.__m0) { towards(P.n, window.__m0.n, P.face); P.F.copy(P.face); }
        else if (c.face === 'nearest') { let best = null, bd = 1e9; for (const e of G.enemies) { const d = e.pos.dist(P.pos); if (d < bd) { bd = d; best = e; } } if (best) { towards(P.n, best.n, P.face); P.F.copy(P.face); } }
        else { rotAround(P.face, P.n, c.face); P.F.copy(P.face); }
      }
      if (c.eyes) { P.lookX = c.eyes[0]; P.lookY = c.eyes[1]; P.blinkT = 3; }
      // camera (relative to the creature's facing; camFace: relative to the facing before 'face' turned it)
      const n = P.n.clone(), f = (c.cam.fixedF && window.__F0) ? window.__F0.clone().tangent(n).norm() : P.face.clone(); rotAround(f, n, c.cam.yaw || 0); const right = new V3().crossOf(f, n).norm();
      const C = c.cam;
      G.camHook = C.game ? null : C.abs ?(CB) => { const o = (0, eval)('(' + C.abs + ')')(); CB.pos.copy(o.pos); CB.target.copy(o.target); CB.up.copy(o.up || new V3(0, 1, 0)); CB.fov = o.fov || 0.8; return 1; }
        : (CB) => { CB.pos.copy(P.pos).addS(f, C.dist ?? 6).addS(n, C.up ?? 1.2).addS(right, C.side || 0);
          CB.target.copy(P.pos).addS(n, C.ty ?? 0.6).addS(right, C.dx || 0).addS(f, C.dz || 0); CB.up.copy(C.worldUp ? new V3(0, 1, 0) : n); CB.fov = C.fov || 0.8; return 1; };
      if (c.light) { const O = window.__beginO || (window.__beginO = R.begin); R.begin = function (...a) { const bk = new V3().copy(R.cam.pos).sub(R.cam.target).norm(), rt = new V3().crossOf(R.cam.up, bk).norm();
        R.light.set(0, 0, 0).addS(rt, c.light[0]).addS(R.cam.up, c.light[1]).addS(bk, c.light[2]).norm(); return O.apply(R, a); }; }
      else if (window.__beginO) R.begin = window.__beginO;
      for (let i = 0; i < (C.game ? 90 : 4); i++) updateCamera(1 / 60);
      if (c.js) (0, eval)(c.js);
      const po = Object.assign({ dof: 0.55, tilt: 0, grain: 0.01, streak: 0.45, vig: 0 }, c.post || {});
      const set = () => { pp.dof = po.dof; pp.tilt = po.tilt; pp.grain = po.grain; pp.streakI = po.streak; pp.vig = po.vig; pp.warp = 0; pp.flash = [0, 0, 0]; pp.impactT = 0;
        pp.bloomI = po.bloom ?? 0.6; pp.exp = po.exp ?? 0.95; pp.sat = po.sat ?? 1.12; /* every capture starts from the game's own post settings */ if (po.neb !== undefined) R.sky.neb = po.neb; };
      // staging switches (restored after the capture): hide = ['dust' (the world's floating dust), 'ringdust', 'others' (other worlds; keep: ids), 'sunburst']
      const hide = new Set(c.hide || []), O = { drawDust: R.drawDust, drawRingDust, drawRingBits, drawSunburst, drawDecor, drawPlanet: R.drawPlanet, drawAtmo: R.drawAtmo };
      if (hide.has('dust')) R.drawDust = function (o) { if (!G.cur || o.c !== G.cur.c) return O.drawDust.call(R, o); };
      if (hide.has('ringdust')) drawRingDust = function () {};
      if (hide.has('sunburst')) drawSunburst = function () {};
      if (hide.has('decor')) drawDecor = function (pl) { if (pl !== G.cur) return O.drawDecor(pl); };
      if (hide.has('others')) { const keep = new Set([(G.cur || {}).id].concat(c.keep || [])); R.drawPlanet = function (pl, ...a) { if (keep.has(pl.id)) return O.drawPlanet.call(R, pl, ...a); };
        R.drawAtmo = function (cc, ...a) { if (G.planets.some(pl => pl.c === cc && keep.has(pl.id))) return O.drawAtmo.call(R, cc, ...a); };
        drawRingBits = function (pl) { if (keep.has(pl.id)) return O.drawRingBits(pl); }; const rd = drawRingDust; drawRingDust = function (pl, d) { if (keep.has(pl.id)) return rd(pl, d); }; }
      if (c.calm !== false) { P.surgeT = 0; P.hurtT = 9; P.iT = 0; P.jig = 0; P.flash = 0; P.vel.set(0, 0, 0); P.slosh.set(0, 0, 0); P.dashT = 0; P.spinT = 0; for (const e of G.enemies) e.flash = 0; }
      const fx = G.fxDt; G.fxDt = 0; G.shake = 0;
      const comp = R.composite; if (c.focus) R.composite = function (...a) { R.post.focus = c.focus; return comp.apply(R, a); };
      set(); render(); set(); render(); R.composite = comp; __rng.load(rs); /* capturing never perturbs the simulation's random stream */
      G.fxDt = fx; R.drawDust = O.drawDust; drawRingDust = O.drawRingDust; drawRingBits = O.drawRingBits; drawSunburst = O.drawSunburst; drawDecor = O.drawDecor; R.drawPlanet = O.drawPlanet; R.drawAtmo = O.drawAtmo;
      if (c.post && c.post.focus) { /* explicit focus override handled by re-render */ }
      return { wave: +G.bl.p[3].toFixed(2), ts: G.timeScale, slow: +(G.slowT||0).toFixed(2), state: G.state, mode: G.mode, cur: G.cur && G.cur.id, wake: G.cur && +G.cur.wake.toFixed(2), form: P.form, scale: +P.scale.toFixed(2), enemies: G.enemies.length, pickups: G.pickups.length, boss: !!G.boss, shots: G.pshots.length };
    }, [c, skip]);
    if (skip) continue; /* a skipped capture is still staged and rendered (rendering touches the creature's pose state), so every run plays the same moment */
    const f = `${pre}-${c.id}.png`; await p.screenshot({ path: f }); console.log('wrote', f, JSON.stringify(info));
  }
  await b.close();
})();
