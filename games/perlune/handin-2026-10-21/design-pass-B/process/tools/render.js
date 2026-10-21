// Perlune design pass B: render posed stills with the game's own WebGL2 renderer (headless Chromium + SwiftShader).
// usage: node render.js <cssW> <cssH> <dpr> <outPrefix> '<json list of views>'   (env MSAA=4 recommended)
// Writes <outPrefix>-<view.id>.png at cssW*dpr x cssH*dpr.
//
// View fields (all optional except id/world):
//   id, world ('nacre'|'ferrum'|'cathedra'|'hydrargyra'|'umbra'|'geode'), sim (secs to simulate after landing, default 4)
//   form (0..30; stage: 0-4 droplet, 5 bead, 11 chimera (halo), 18 comet, 25 nova), build {evoId: level} (default {} = bare droplet)
//   pn [x,y,z]  the surface normal where the creature stands (picks the spot on the world)
//   theta       face the camera so the Eclipse (Umbra) is behind the creature, rotated by theta radians; or yaw (rotate current facing)
//   dist, up, side, fov, dx, ty    camera: distance in front, height along normal, sideways; target offset sideways (dx) and up (ty)
//   lx, ly      eye look (-1..1), blink:false, joy (secs of joy), scale (creature scale override)
//   neb, bloom, dof, tilt, vig (default 0: never a vignette), grain (0.01), streak (0.45), exp, sat, ca
//   solo        hide every other world, their rings and atmospheres (clean background); keep ['umbra'] keeps listed worlds
//   noRings ['umbra']  hide the ring dust of listed worlds;  sunburst: number scales the Eclipse rays' strength
//   sunburst    false hides the Eclipse sunburst rays;  ownRings false hides this world's ring dust
//   nodecor     clears the world's decor sculptures;  nodust hides the world's floating dust
//   halo {col:'#rrggbb', gain}  recolours the gold halo (0xffd27a) for COSMETIC LOOK proposals only
//   trail {...} cosmetic ribbon (see code)
//   enemies [{t:'mite', d:3.5, a:0.3}]  spawn real enemies at distance d (world units) and angle a (radians, 0 = in front of the creature)
//   js          a string of JS evaluated in the page after posing, before render (full access to the game's globals)
//   light [r,u,b] key light direction in camera space (right, up, toward camera); game default [-0.35,0.75,0.55]
//   bg          false hides the sky (R.drawSky) so the plate is black behind the scene (for cut-outs)
const { chromium } = require('playwright');
const [w, h, dpr, pre] = [+process.argv[2], +process.argv[3], +process.argv[4], process.argv[5]];
const views = JSON.parse(process.argv[6]);
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  const p = await ctx.newPage(); p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
  await p.route('**/fonts.g*/**', r => r.abort());
  await p.addInitScript(() => { window.setTimeout = () => 0; });
  const W = w * dpr, H = h * dpr; let lastKey = null;
  for (const v of views) {
    const key = v.world + '|' + (v.cleared || '');
    if (key !== lastKey) {
      lastKey = key;
      await p.goto('file:///home/claude/sivver/dist/perlune.local.html'); await p.addStyleTag({ content: 'body > *:not(#gl){display:none !important;}' });
      await p.evaluate(([W, H, ms]) => { G.test.manual = true; G.test.god = true; MSAA = ms; R.w = 0; R.resize(W, H); }, [W, H, +(process.env.MSAA || 0)]);
      await p.evaluate(`void 0;
        function build(evos, form) { P.evos = Object.assign({}, evos); P.myth = {}; P.res = {}; for (const k in RESON) { const r = RESON[k]; if (P.evos[r.a] && P.evos[r.b]) P.res[k] = true; }
          P.form = form; for (const k in P.evos) P.grow[k] = 1; recomputeStats(); P.hp = P.maxHp; P.scale = 0.52 + 0.042 * form; }
        window.build = build;
        newJourney(); G.test.bot = true; tryOpenEvo = function () {}; build({}, 0);
        const pl = planetById('${v.world}'); G.run.cleared = ['nacre','ferrum','cathedra','hydrargyra'].filter(x => x !== '${v.world}').slice(0, ${v.world === 'umbra' ? 4 : 1});
        if ('${v.world}' === 'geode') { P.res = { a: 1, b: 1 }; }
        P.pos.copy(pl.c).addS(new V3(0.5, 0.4, 0.7).norm(), pl.r + 50); G.sp.H = pl.c.clone().sub(P.pos).norm(); G.sp.H.y = 0; G.sp.H.norm(); startLanding(pl); PERLUNE.sim(2.6); snapWake();
        PERLUNE.sim(${v.sim || 4}); G.cur.wake = 1; G.cur.awake = 1; if (G.world) G.world.dark = 0;
        window.__post0 = { bloomI: R.post.bloomI, exp: R.post.exp, sat: R.post.sat, neb: R.sky.neb }; window.__orig = { begin: R.begin, drawPlanet: R.drawPlanet, drawAtmo: R.drawAtmo, drawSky: R.drawSky, drawDust: R.drawDust, drawRingDust, drawRingBits, drawSunburst, drawDecor, drawSlickTrail };`);
    }
    await p.evaluate(v => {
      const O = window.__orig; const cur0 = G.cur;
      { const q = window.__post0; R.post.bloomI = q.bloomI; R.post.exp = q.exp; R.post.sat = q.sat; R.sky.neb = q.neb; } // every view starts from the game's own post settings
      // restore everything, then apply this view's switches
      R.begin = O.begin; R.drawPlanet = O.drawPlanet; R.drawAtmo = O.drawAtmo; R.drawSky = O.drawSky; R.drawDust = O.drawDust; drawRingDust = O.drawRingDust; drawRingBits = O.drawRingBits; drawSunburst = O.drawSunburst; drawDecor = O.drawDecor; drawSlickTrail = O.drawSlickTrail;
      build(v.build || {}, v.form ?? 12); if (cur0 && cur0.id === 'geode') { G.meta.myths = G.meta.myths.length ? G.meta.myths : ['sun']; } P.ab.crown = []; while (P.ab.crown.length < (S.crownN || 0)) P.ab.crown.push(1);
      if (v.scale) P.scale = v.scale;
      G.enemies.length = 0; G.pshots.length = 0; G.eshots.length = 0; G.beams.length = 0; G.arcs.length = 0; G.rings.length = 0; G.pickups.length = 0; G.hazards.length = 0; PT.n = 0; G.debris.length = 0; P.hist.length = 0; P.vel.set(0, 0, 0); P.slosh.set(0, 0, 0); P.ghosts.length = 0; P.dashT = 0;
      const cur = G.cur;
      { // which worlds are drawn: solo = only this one (+ v.keep ids); rings: ownRings false / noRings [ids]
        const keep = new Set([cur.id].concat(v.keep || [])), shown = pl => !v.solo || keep.has(pl.id);
        const shownC = c => !v.solo || G.planets.some(pl => pl.c === c && keep.has(pl.id));
        const noR = new Set(v.noRings || []); if (v.ownRings === false) noR.add(cur.id);
        R.drawPlanet = function (pl, ...a) { if (shown(pl)) return O.drawPlanet.call(R, pl, ...a); };
        R.drawAtmo = function (c, ...a) { if (shownC(c)) return O.drawAtmo.call(R, c, ...a); };
        drawRingBits = function (pl) { if (shown(pl) && !noR.has(pl.id)) return O.drawRingBits(pl); };
        drawRingDust = function (pl, d) { if (shown(pl) && !noR.has(pl.id)) return O.drawRingDust(pl, d); };
      }
      if (v.sunburst === false) drawSunburst = function () {};
      else if (v.sunburst !== undefined) drawSunburst = function (c, r0, r1, a, w) { return O.drawSunburst(c, r0, r1, a * v.sunburst, w); };
      if (v.nodecor) { cur.decor.length = 0; }
      if (v.nodust) R.drawDust = function (o) { if (o.c !== cur.c) return O.drawDust.call(R, o); };
      if (v.bg === false) R.drawSky = function () {};
      if (v.light) { // key light in camera space [right, up, toward camera]; the game's own default is [-0.35, 0.75, 0.55]
        R.begin = function (...a) { const bk = new V3().copy(R.cam.pos).sub(R.cam.target).norm(), rt = new V3().crossOf(R.cam.up, bk).norm();
          R.light.set(0, 0, 0).addS(rt, v.light[0]).addS(R.cam.up, v.light[1]).addS(bk, v.light[2]).norm(); return O.begin.apply(R, a); };
      }
      let f;
      if (v.pn) { P.n.set(...v.pn).norm(); }
      wpos(P.n, P.h, P.pos);
      if (v.theta !== undefined) {
        const E = planetById('umbra').c.clone().sub(P.pos).tangent(P.n).norm(); rotAround(E, P.n, v.theta);
        f = E.clone().neg();
      } else { f = P.face.clone(); rotAround(f, P.n, v.yaw || 0); }
      const n = P.n.clone(); P.face.copy(f); P.F.copy(f); wpos(P.n, P.h, P.pos);
      for (const m of P.motes) m.p.copy(P.pos);
      const right = new V3().crossOf(f, n).norm();
      if (v.halo && !window.__hexPatched) { window.__hexPatched = true; const h0 = hex; hex = function (hh, m) { return hh === 0xffd27a && window.__haloCol !== undefined ? h0(window.__haloCol, (m || 1) * (window.__haloGain || 1)) : h0(hh, m); }; }
      window.__haloCol = v.halo ? parseInt(v.halo.col.slice(1), 16) : undefined; window.__haloGain = v.halo ? (v.halo.gain || 1) : 1;
      if (v.trail) {
        const T = v.trail; P.hist.length = 0;
        for (let i = 0; i < T.n; i++) { const s = i * T.step; const nn = offsetN(P.n, s, T.ang0 + T.curve * s, new V3()); P.hist.push({ p: wpos(nn, P.h, new V3()), n: nn }); }
        const cols = T.cols.map(hh => hex(parseInt(hh.slice(1), 16), T.gain || 1.6));
        const mix = (t) => { const x = Math.min(cols.length - 1.001, Math.max(0, t * (cols.length - 1))); const i = Math.floor(x), k = x - i; return mixc(cols[i], cols[i + 1], k); };
        drawSlickTrail = function () {
          const pts = []; for (let i = 0; i < P.hist.length; i++) pts.push(wpos(P.hist[i].n, 0.09, VP.get()));
          FX.strip(pts, surfUp, t => P.scale * T.width * (1 - t * (T.taper ?? 0.55)), t => mix(t), t => T.alpha * Math.pow(1 - t, T.fall ?? 1.1));
          const pts2 = []; for (let i = 0; i < P.hist.length; i++) pts2.push(wpos(P.hist[i].n, 0.11, VP.get()));
          FX.strip(pts2, surfUp, t => P.scale * T.width * 0.28 * (1 - t * 0.7), hex(0xfff6e8, 2.2), t => T.alpha * 0.9 * Math.pow(1 - t, 1.6));
        };
      }
      if (v.enemies) for (const e of v.enemies) {
        const dir = f.clone(); rotAround(dir, n, e.a || 0); const nn = offsetN(P.n, e.d / cur.r, Math.atan2(0, 1), new V3());
        // place along dir: move the normal toward dir by angle d / r
        const tgt = P.n.clone().addS(dir, Math.tan(e.d / cur.r)).norm();
        try { const en = spawnEnemy(e.t, tgt); if (en) { en.spawn = 0; if (e.face) en.face = e.face; } } catch (err) { console.log('spawn failed', e.t, err.message); }
      }
      G.camHook = (CB) => {
        CB.pos.copy(P.pos).addS(f, v.dist ?? 6).addS(n, v.up ?? 1.2).addS(right, v.side || 0);
        CB.target.copy(P.pos).addS(n, v.ty ?? 0.6).addS(right, v.dx || 0); CB.up.copy(n); CB.fov = v.fov || 0.8; return 1; };
      if (v.js) { (0, eval)(v.js); }
      P.lookX = v.lx || 0; P.lookY = v.ly ?? 0.15; P.blinkT = 3; P.joyT = v.joy || 0; P.jig = 0; P.hurtT = 9; P.iT = 0; P.surgeT = 0;
      for (let i = 0; i < (v.warm ?? 30); i++) { R.time += 1 / 60; updateCamera(1 / 60); postDecay(1 / 60); }
      if (v.simAfter) { PERLUNE.sim(v.simAfter); }
      P.lookX = v.lx || 0; P.lookY = v.ly ?? 0.15; P.blinkT = 3; P.joyT = v.joy || 0; R.time += (v.tAdd ?? 0.37);
      const pp = R.post;
      if (v.neb !== undefined) R.sky.neb = v.neb; if (v.bloom !== undefined) pp.bloomI = v.bloom;
      pp.dof = v.dof ?? 0.55; pp.tilt = v.tilt ?? 0; pp.grain = v.grain ?? 0.01; pp.streakI = v.streak ?? 0.45; pp.vig = v.vig ?? 0;
      if (v.exp !== undefined) pp.exp = v.exp; if (v.sat !== undefined) pp.sat = v.sat;
      if (v.jsPost) { (0, eval)(v.jsPost); }
      render(); if (v.neb !== undefined) R.sky.neb = v.neb; pp.vig = v.vig ?? 0; render();
    }, v);
    const f = `${pre}-${v.id}.png`; await p.screenshot({ path: f }); console.log('wrote', f);
  }
  await b.close();
})();
