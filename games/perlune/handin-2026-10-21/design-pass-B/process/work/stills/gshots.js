// Gallery shot setups (stills group). Real journeys played by the game's own bot; we stage with the game's own functions.
const ALL4 = `['nacre','ferrum','cathedra','hydrargyra']`;
const BOSS_AT = (d, a) => `if (G.boss) { const dir = P.face.clone(); rotAround(dir, P.n, ${a}); const n = P.n.clone().addS(dir, Math.tan(${d} / G.cur.r)).norm(); G.boss.n.copy(n); if (G.boss.path) for (const s of G.boss.path) { s.n.copy(n); } G.boss.spawn = 0; }`;
module.exports = {
  lode: {
    setup: [`newJourney(); G.test.bot = true; tryOpenEvo = function () {}; H.build({ spines: 2, eye: 2, crown: 1, bloom: 1, lode: 1 }, 10); H.land('ferrum', ['nacre']); H.run(4);
      G.dir.harvest = G.dir.goal; H.run(4.8); console.log('boss', !!G.boss, G.boss && G.boss.type); G.world.storm = null; G.world.stormT = 60; G.test.bot = false; IN.move.x = 0; IN.move.y = 0; window.__face0 = P.face.clone();`],
    caps: [
      { id: 'j0', pre: `P.face.copy(__face0); rotAround(P.face, P.n, 1.6); P.F.copy(P.face);` + BOSS_AT(8, 0) + `H.run(0.4);`, face: 'boss', cam: { abs: `() => { const b = G.boss, n = P.n; const toB = b.pos.clone().sub(P.pos); toB.addS(n, -toB.dot(n)); const L = toB.len(); toB.scale(1 / L); const side = new V3().crossOf(toB, n).norm(); return { pos: P.pos.clone().addS(toB, -9).addS(n, 4.4).addS(side, 2.8), target: P.pos.clone().addS(toB, L * 0.42).addS(n, 0.0), up: n.clone(), fov: 0.6 }; }` }, eyes: [0, 0.3], post: { neb: 0.03 }, hide: ['dust'] },
      { id: 'j1', pre: `P.face.copy(__face0); rotAround(P.face, P.n, 4.7); P.F.copy(P.face);` + BOSS_AT(8, 0) + `H.run(0.4);`, face: 'boss', cam: { abs: `() => { const b = G.boss, n = P.n; const toB = b.pos.clone().sub(P.pos); toB.addS(n, -toB.dot(n)); const L = toB.len(); toB.scale(1 / L); const side = new V3().crossOf(toB, n).norm(); return { pos: P.pos.clone().addS(toB, -9).addS(n, 4.4).addS(side, 2.8), target: P.pos.clone().addS(toB, L * 0.42).addS(n, 0.0), up: n.clone(), fov: 0.7 }; }` }, eyes: [0, 0.3], post: { neb: 0.03 }, hide: ['dust'] },
      { id: 'j2', pre: `P.face.copy(__face0); rotAround(P.face, P.n, 1.6); P.F.copy(P.face);` + BOSS_AT(8, 0) + `H.run(0.4);`, face: 'boss', cam: { abs: `() => { const b = G.boss, n = P.n; const toB = b.pos.clone().sub(P.pos); toB.addS(n, -toB.dot(n)); const L = toB.len(); toB.scale(1 / L); const side = new V3().crossOf(toB, n).norm(); return { pos: P.pos.clone().addS(toB, -9).addS(n, 4.4).addS(side, -2.8), target: P.pos.clone().addS(toB, L * 0.42).addS(n, 0.0), up: n.clone(), fov: 0.6 }; }` }, eyes: [0, 0.3], post: { neb: 0.03 }, hide: ['dust'] },
      { id: 'j3', pre: `P.face.copy(__face0); rotAround(P.face, P.n, 4.7); P.F.copy(P.face);` + BOSS_AT(8, 0) + `H.run(0.4);`, face: 'boss', cam: { abs: `() => { const b = G.boss, n = P.n; const toB = b.pos.clone().sub(P.pos); toB.addS(n, -toB.dot(n)); const L = toB.len(); toB.scale(1 / L); const side = new V3().crossOf(toB, n).norm(); return { pos: P.pos.clone().addS(toB, -9).addS(n, 4.4).addS(side, -2.8), target: P.pos.clone().addS(toB, L * 0.42).addS(n, 0.0), up: n.clone(), fov: 0.6 }; }` }, eyes: [0, 0.3], post: { neb: 0.03 }, hide: ['dust'] },
    ]
  },
  serpent: {
    setup: [`newJourney(); G.test.bot = true; tryOpenEvo = function () {}; H.build({ spines: 2, twin: 1, eye: 2, crown: 2, wings: 1, mirror: 1 }, 14); H.land('hydrargyra', ['nacre', 'cathedra']); H.run(4);
      G.dir.harvest = G.dir.goal; H.run(4.8); console.log('boss', !!G.boss, G.boss && G.boss.type); H.run(3); console.log('st', G.boss && G.boss.st);`],
    caps: [
      { id: 'a', cam: { abs: `() => { const b = G.boss, n = P.n; const toB = b.pos.clone().sub(P.pos); const side = new V3().crossOf(toB, n).norm(); return { pos: P.pos.clone().addS(toB, -0.55).addS(n, 3.2).addS(side, 3.0), target: P.pos.clone().lerp(b.pos, 0.55), up: n.clone(), fov: 0.75 }; }` }, post: { neb: 0.03 }, hide: ['dust'] },
      { id: 'b', cam: { game: true }, post: { neb: 0.03 }, hide: ['dust'] },
    ]
  },
  finale: {
    setup: [`newJourney(); G.test.bot = true; tryOpenEvo = function () {}; H.build({ eye: 3, crown: 3, bloom: 3, wings: 3, shell: 2, kaleido: 2, spines: 1, twin: 1 }, 28); H.land('umbra', ${ALL4}); H.run(3);
      G.dir.harvest = G.dir.goal; H.run(5.4); if (G.boss) { G.boss.spawn = 0; G.boss.invuln = false; G.boss.hp = 0.5; hitEnemy(G.boss, 5, {}); }
      for (let k = 0; k < 2000 && !(G.fin && G.fin.ph === 2); k++) H.run(1 / 60); console.log('ph', G.fin.ph, G.fin.line);`],
    caps: [
      { id: 'f1', run: 1.6, cam: { game: true }, post: { neb: 0.03 }, js: `console.log('t', G.fin.t.toFixed(2), P.scale.toFixed(1))` },
      { id: 'f2', run: 0.9, cam: { game: true }, post: { neb: 0.03 }, js: `console.log('t', G.fin.t.toFixed(2), P.scale.toFixed(1))` },
      { id: 'f3', run: 0.9, cam: { game: true }, post: { neb: 0.03 }, js: `console.log('t', G.fin.t.toFixed(2), P.scale.toFixed(1))` },
      { id: 'f4', run: 0.9, cam: { game: true }, post: { neb: 0.03 }, js: `console.log('t', G.fin.t.toFixed(2), P.scale.toFixed(1))` },
      { id: 'f5', run: 0.9, cam: { game: true }, post: { neb: 0.03 }, js: `console.log('t', G.fin.t.toFixed(2), P.scale.toFixed(1), G.state)` },
      { id: 'f6', cam: { abs: `() => ({ pos: new V3(Math.cos(1.2) * 330, 60, Math.sin(1.2) * 330), target: P.pos.clone(), up: new V3(0,1,0), fov: 0.75 })` }, post: { neb: 0.03 } },
    ]
  },
  space: {
    setup: [`newJourney(); G.test.bot = true; tryOpenEvo = function () {}; H.build({ spines: 1, eye: 1, crown: 1, wings: 1, twin: 1, bloom: 1 }, 7); H.run(2.6); H.run(3);
      G.dir.cleared = true; if (!G.run.cleared.includes('nacre')) G.run.cleared.push('nacre'); G.enemies.length = 0; G.pickups.length = 0; G.eshots.length = 0; G.boss = null; G.pendingEvo.length = 0; startLaunch(); H.run(2.8);
      console.log('state', G.state, G.mode, 'hoops', G.hoops.length, G.hoops.map(h => h.pid).join(','), 'target', G.sp.target && G.sp.target.id);
      window.__nextHoop = (ahead) => { let best = null, bd = 1e9; for (const h of G.hoops) { if (h.got || h.pid !== (G.sp.target && G.sp.target.id)) continue; const along = P.pos.clone().sub(h.p).dot(h.dir); if (along < 0 && -along < bd) { bd = -along; best = h; } } return [best, bd]; };
      window.__flyTo = (gap) => { for (let k = 0; k < 4000; k++) { const [h, d] = __nextHoop(); if (h && d < gap) return d; const st = h && d < 5 ? 1 / 480 : 1 / 60; PERLUNE.sim(st, st); H.ageFx(st); __vt.advance(1000 * st); } return -1; };
      window.__flyIn = (gap, frac) => { for (let k = 0; k < 20000; k++) { for (const h of G.hoops) { if (h.got && h.gotT > 0.2) continue; const v = P.pos.clone().sub(h.p); const along = v.dot(h.dir); const rad = v.clone().addS(h.dir, -along).len(); if (along < 0 && -along < gap && rad < h.r * frac) { window.__hoop = h; return [along.toFixed(2), rad.toFixed(2), h.pid]; } } if (G.state !== 'space') return 'left space ' + G.state; PERLUNE.sim(1 / 480, 1 / 480); H.ageFx(1 / 480); __vt.advance(1000 / 480); } return -1; };
      console.log('flyIn', JSON.stringify(__flyIn(0.4, 0.5)));`],
    caps: [
      { id: 'z0', cam: { abs: `() => { const H = G.sp.H, U = new V3(0,1,0), rt = new V3().crossOf(H, U).norm(); const h = window.__hoop; const c = h ? h.p : P.pos; return { pos: c.clone().addS(H, -24).addS(U, 8).addS(rt, 4), target: c.clone().addS(H, 18).addS(rt, 1.5).addS(U, -1.5), up: U, fov: 0.66 }; }` }, post: { neb: 0.06 } },
    ]
  },
  cathedra: {
    setup: [`newJourney(); G.test.bot = true; tryOpenEvo = function () {}; H.build({ spines: 1, eye: 1, crown: 1, wings: 1 }, 9); H.land('cathedra', ['nacre']); H.run(8);
      G.test.bot = false; IN.move.x = 0; IN.move.y = 0; G.dir.spawnT = 99; G.enemies.length = 0; G.pickups.length = 0; G.eshots.length = 0; G.pshots.length = 0; G.debris.length = 0; P.hist.length = 0;
      const pc = G.cur; let pr = pc.prisms[0], bd = -2; for (const q of pc.prisms) { const d = q.n.dot(P.n); if (d > bd) { bd = d; pr = q; } } window.__pr = pr;
      const n = offsetN(pr.n, 3.4, 0.7, new V3()); P.n.copy(n); wpos(P.n, P.h, P.pos); towards(P.n, pr.n, P.face); P.F.copy(P.face); window.__F0 = P.face.clone();
      for (const [a, d] of [[0.0, 9], [0.25, 10.5], [-0.25, 10]]) { const dir = P.face.clone(); rotAround(dir, P.n, a); const nn = P.n.clone().addS(dir, Math.tan(d / pc.r)).norm(); const e = spawnEnemy('jelly', nn); if (e) e.spawn = 0; }
      console.log('prisms', pc.prisms.length, 'enemies', G.enemies.length);`],
    caps: [
      { id: 'Y0', run: 0.36, cam: { fixedF: true, yaw: 0, dist: 16, up: 10, ty: 0, dz: 1.5, fov: 0.8 }, eyes: [0, 0.4], post: { neb: 0.02, dof: 0.3 }, hide: ['dust'], light: [-0.35, 0.45, -0.82] },
      { id: 'J0', cam: { fixedF: true, yaw: 2.6, dist: 16, up: 11.2, ty: 0.1, dx: 0.6, dz: 1.5, fov: 0.8 }, eyes: [0, 0.4], post: { neb: 0.02, dof: 0.55 }, hide: ['dust'], light: [-0.35, 0.45, -0.82] },
      { id: 'J1', cam: { fixedF: true, yaw: 2.6, dist: 16, up: 11.2, ty: 0.1, dx: 0.6, dz: 1.5, fov: 0.78 }, eyes: [0, 0.4], post: { neb: 0.02, dof: 0.45 }, hide: ['dust'], light: [-0.35, 0.45, -0.82] },
      { id: 'J2', cam: { fixedF: true, yaw: 2.6, dist: 16, up: 11.2, ty: 0.4, dx: 0.6, dz: 1.5, fov: 0.8 }, eyes: [0, 0.4], post: { neb: 0.02, dof: 0.45 }, hide: ['dust'], light: [-0.35, 0.45, -0.82] },
      { id: 'J3', cam: { fixedF: true, yaw: 2.6, dist: 16, up: 11.2, ty: 0.1, dx: 0.2, dz: 1.5, fov: 0.82 }, eyes: [0, 0.4], post: { neb: 0.02, dof: 0.45 }, hide: ['dust'], light: [-0.35, 0.45, -0.82] },
      { id: 'H1', cam: { fixedF: true, yaw: 2.6, dist: 16, up: 11.2, ty: 0.1, dx: 0.6, dz: 1.5, fov: 0.8 }, eyes: [0, 0.4], post: { neb: 0.02, dof: 0.45 }, hide: ['dust'], light: [-0.35, 0.45, -0.82] },
    ],
  },
  core: {
    setup: [`newJourney(); G.test.bot = true; tryOpenEvo = function () {}; H.build({}, 4); H.run(2.6); H.run(5); G.test.bot = false; IN.move.x = 0; IN.move.y = 0; G.dir.spawnT = 99;
      G.enemies.length = 0; G.pickups.length = 0; G.eshots.length = 0; G.pshots.length = 0; G.debris.length = 0;
      window.__F0 = P.face.clone();
      const at = (a, d) => { const dir = __F0.clone(); rotAround(dir, P.n, a); return P.n.clone().addS(dir, Math.tan(d / G.cur.r)).norm(); };
      const T = ['tumbler','mite','mite','tumbler','mite','mite','mite','tumbler','mite','mite'];
      for (let i = 0; i < T.length; i++) { const e = spawnEnemy(T[i], at(-0.3 + 0.6 * i / (T.length - 1) + (Math.random() - 0.5) * 0.1, 6.0 + Math.random() * 3.0)); if (e) e.spawn = 0; }
      for (const a of [-0.25, 0.2, 0.0]) { const e = spawnEnemy('mite', at(a, 2.8)); if (e) { e.spawn = 0; hitEnemy(e, 99, {}); } }
      console.log('enemies', G.enemies.length, 'pickups', G.pickups.length);`],
    caps: [0,1,2,3].map(i => ({ id: 'n' + i, run: i ? 0.06 : 0.2 })).concat([0,1,2,3].map(k => ({ id: 'o' + k }))).map((c, j) => Object.assign({ face: 'nearest', cam: { fixedF: true, yaw: 1.05, dist: 17, up: [2.4, 2.0, 2.8, 2.4][j - 4] ?? 4.0, ty: [0.0, 0.2, -0.2, -0.1][j - 4] ?? 0.8, dz: [3.0, 3.0, 3.0, 3.0][j - 4] ?? 3.6, fov: [0.3, 0.3, 0.31, 0.32][j - 4] ?? 0.34 }, eyes: [0.7, 0.15], post: { neb: 0.03 }, hide: ['dust', 'decor'] }, c)),
  },
  core2: {
    setup: [`newJourney(); G.test.bot = true; tryOpenEvo = function () {}; H.build({ spines: 1, twin: 1 }, 4); H.land('hydrargyra', ['nacre']); H.run(5); G.test.bot = false; IN.move.x = 0; IN.move.y = 0; G.dir.spawnT = 99;
      G.enemies.length = 0; G.pickups.length = 0; G.eshots.length = 0; G.pshots.length = 0; G.debris.length = 0;
      window.__F0 = P.face.clone();
      const T = ['hydra2','hydra2','hydra3','hydra3','hydra3','hydra3','ray','hydra2','hydra3','hydra3'];
      for (let i = 0; i < T.length; i++) { const dir = P.face.clone(); rotAround(dir, P.n, (Math.random() - 0.5) * 1.0); const d = 4.5 + Math.random() * 3; const n = P.n.clone().addS(dir, Math.tan(d / G.cur.r)).norm(); const e = spawnEnemy(T[i], n); if (e) e.spawn = 0; }
      console.log('enemies', G.enemies.length);`],
    caps: [0,1,2,3,4,5].map(i => ({ id: 'h' + i, run: 0.25, face: 'nearest', cam: { fixedF: true, yaw: 0.9, dist: 9, up: 3.0, ty: 0.6, dz: 2.2, fov: 0.55 }, eyes: [0.6, 0.2], post: { neb: 0.03 }, hide: ['dust'] })),
  },
  body: {
    setup: [`newJourney(); G.test.bot = true; tryOpenEvo = function () {}; H.build({ crown: 2, wings: 2, eye: 2, spines: 1, bloom: 1, kaleido: 1 }, 13); H.land(window.__W || 'hydrargyra', ['nacre', 'cathedra']); H.run(9); window.__F0 = P.face.clone(); console.log('enemies', G.enemies.length, 'beams', G.beams.length);`],
    caps: [0,1,2,3,4,5].map(i => ({ id: 'b' + i, run: 0.3, face: 'nearest', cam: { yaw: 0.7, dist: 11, up: 3.6, ty: 0.9, fov: 0.5 }, eyes: [0.5, 0.2], post: { neb: 0.03 }, hide: ['dust'] })).concat([0,1,2,3,4,5,6,7].map(i => ({ id: 'c' + i, run: 0.2, face: 'nearest', cam: { yaw: [-0.7, 0.7][i % 2], dist: 11, up: 3.6, ty: 0.9, fov: 0.5 }, eyes: [[-0.5, 0.5][i % 2], 0.2], post: { neb: 0.03 }, hide: ['dust'] }))),
  },
};
