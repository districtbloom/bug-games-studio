// Shot setups for the stills group (key-still, result-still, gallery). Every moment is played by the shipped build:
// the game's own bot and director run the journey; we only stage foes with the game's own spawnEnemy/bossDefeated and pose the camera.
const ALL4 = `['nacre','ferrum','cathedra','hydrargyra']`;
// a ring of iron moths closing on the creature (spawned with the game's own spawnEnemy; they then fly by their own AI)
const MOTH_RING = (k, d, a0, gap) => `G.enemies.length = 0; G.eshots.length = 0; G.pshots.length = 0;
  for (let i = 0; i < ${k}; i++) { const a = ${a0} + i / ${k} * (TAU - ${gap}); const n = offsetN(P.n, ${d} + (i % 3) * 0.6, a, new V3()); const e = spawnEnemy('moth', n); if (e) { e.spawn = 0; e.t = i * 0.37; e.stT = 3; } }`;

// moths placed around the creature relative to its facing (angle 0 = straight ahead); window.__m0 = the one ahead
const MOTH_RING_F = (list) => `G.enemies.length = 0; G.eshots.length = 0; G.pshots.length = 0; window.__m0 = null;
  for (const [a, d] of ${JSON.stringify(list)}) { const dir = P.face.clone(); rotAround(dir, P.n, a); const n = P.n.clone().addS(dir, Math.tan(d / G.cur.r)).norm();
    const e = spawnEnemy('moth', n); if (e) { e.spawn = 0; e.t = a * 3; e.stT = 3; if (!window.__m0) window.__m0 = e; } }`;

module.exports = {
  /* 1. key-still: Ferrum Dunes mid-harvest, a ring of iron moths closes on the droplet, which turns to face them */
  ferrum: {
    setup: [`newJourney(); G.test.bot = true; tryOpenEvo = function () {}; H.build({ spines: 1, bloom: 1, lode: 1 }, 7); H.land('ferrum', ['nacre']); H.run(16);
      G.world.storm = null; G.world.stormT = 30; H.run(1.5); G.test.bot = false; IN.move.x = 0; IN.move.y = 0; window.__face0 = P.face.clone();
      console.log('harvest', G.dir.harvest, G.dir.goal, 'wake', G.cur.wake.toFixed(2), 'enemies', G.enemies.length);`],
    caps: [
      { id: 's0', pre: `P.face.copy(__face0); rotAround(P.face, P.n, 1.5); P.F.copy(P.face); G.debris.length = 0;` + MOTH_RING_F([[-0.4, 4.2], [-1.2, 4.8], [-1.9, 4.2], [-2.6, 5.2], [-3.3, 4.6], [2.6, 5.0], [2.0, 4.4]]) + `G.dir.spawnT = 99; H.run(0.06); G.pickups = G.pickups.filter(k => arcDist(k.n, P.n, G.cur.r) > 2.5);`, face: 'first',
        cam: { yaw: 1.05, dist: 12, up: 3.2, ty: 0.35, fov: 0.45 }, eyes: [0.3, 0.25], post: { neb: 0.05 }, hide: ['dust'] },
      { id: 's1', pre: `P.face.copy(__face0); rotAround(P.face, P.n, 1.5); P.F.copy(P.face); G.debris.length = 0;` + MOTH_RING_F([[-0.4, 4.2], [-1.2, 4.8], [-1.9, 4.2], [-2.6, 5.2], [-3.3, 4.6], [2.6, 5.0], [2.0, 4.4]]) + `G.dir.spawnT = 99; H.run(0.1); G.pickups = G.pickups.filter(k => arcDist(k.n, P.n, G.cur.r) > 2.5);`, face: 'first',
        cam: { yaw: 1.05, dist: 12, up: 3.2, ty: 0.35, fov: 0.45 }, eyes: [0.3, 0.25], post: { neb: 0.05 }, hide: ['dust'] },
      { id: 's2', pre: `P.face.copy(__face0); rotAround(P.face, P.n, 1.5); P.F.copy(P.face); G.debris.length = 0;` + MOTH_RING_F([[-0.4, 4.2], [-1.2, 4.8], [-1.9, 4.2], [-2.6, 5.2], [-3.3, 4.6], [2.6, 5.0], [2.0, 4.4]]) + `G.dir.spawnT = 99; H.run(0.14); G.pickups = G.pickups.filter(k => arcDist(k.n, P.n, G.cur.r) > 2.5);`, face: 'first',
        cam: { yaw: 1.05, dist: 12, up: 3.2, ty: 0.35, fov: 0.45 }, eyes: [0.3, 0.25], post: { neb: 0.05 }, hide: ['dust'] },
      { id: 's3', pre: `P.face.copy(__face0); rotAround(P.face, P.n, 1.5); P.F.copy(P.face); G.debris.length = 0;` + MOTH_RING_F([[-0.4, 4.2], [-1.2, 4.8], [-1.9, 4.2], [-2.6, 5.2], [-3.3, 4.6], [2.6, 5.0], [2.0, 4.4]]) + `G.dir.spawnT = 99; H.run(0.2); G.pickups = G.pickups.filter(k => arcDist(k.n, P.n, G.cur.r) > 2.5);`, face: 'first',
        cam: { yaw: 1.05, dist: 12, up: 3.2, ty: 0.35, fov: 0.45 }, eyes: [0.3, 0.25], post: { neb: 0.05 }, hide: ['dust'] },
      { id: 's4', pre: `P.face.copy(__face0); rotAround(P.face, P.n, 1.5); P.F.copy(P.face); G.debris.length = 0;` + MOTH_RING_F([[-0.4, 4.2], [-1.2, 4.8], [-1.9, 4.2], [-2.6, 5.2], [-3.3, 4.6], [2.6, 5.0], [2.0, 4.4]]) + `G.dir.spawnT = 99; H.run(0.26); G.pickups = G.pickups.filter(k => arcDist(k.n, P.n, G.cur.r) > 2.5);`, face: 'first',
        cam: { yaw: 1.05, dist: 12, up: 3.2, ty: 0.35, fov: 0.45 }, eyes: [0.3, 0.25], post: { neb: 0.05 }, hide: ['dust'] },
    ]
  },
  /* 2. result-still: Nacre wakes. The Bell of Nacre falls; the game's grandWave floods colour back across the world in a ring */
  nacre: {
    setup: [`newJourney(); G.test.bot = true; tryOpenEvo = function () {}; H.build({ spines: 1, bloom: 1 }, 5); H.land('nacre', []); H.run(4);
      G.dir.harvest = G.dir.goal; H.run(4.6); console.log('boss', !!G.boss, 'wake', G.cur.wake.toFixed(2));
      if (G.boss) { const n = P.n.clone(); sphereMove(n, P.F.clone(), 0.4, G.cur.r); G.boss.n.copy(n); G.boss.spawn = 0; H.run(0.3); G.boss.invuln = false; G.boss.hp = 0.5; G.test.bot = false; IN.move.x = 0; IN.move.y = 0; hitEnemy(G.boss, 5, {}); }
      window.__face0 = P.face.clone(); console.log('cleared', G.dir.cleared, 'wave', G.bl.p[3]);`],
    caps: [
      { id: 'W0', run: 2.3, eyes: [0, 0.2], cam: { yaw: 0, dist: 14, up: 6.5, ty: 0.35, fov: 0.34 }, light: [-0.6, 0.45, -0.55], post: { neb: 0.02 }, hide: ['dust', 'others', 'sunburst', 'decor'] },
      { id: 'W1', run: 0.2, eyes: [0, 0.2], cam: { yaw: 0, dist: 14, up: 6.5, ty: 0.35, fov: 0.34 }, light: [-0.6, 0.45, -0.55], post: { neb: 0.02 }, hide: ['dust', 'others', 'sunburst', 'decor'] },
      { id: 'W2', run: 0.2, eyes: [0, 0.2], cam: { yaw: 0, dist: 14, up: 6.5, ty: 0.35, fov: 0.34 }, light: [-0.6, 0.45, -0.55], post: { neb: 0.02 }, hide: ['dust', 'others', 'sunburst', 'decor'] },
      { id: 'W3', run: 0.2, eyes: [0, 0.2], cam: { yaw: 0, dist: 14, up: 6.5, ty: 0.35, fov: 0.34 }, light: [-0.6, 0.45, -0.55], post: { neb: 0.02 }, hide: ['dust', 'others', 'sunburst', 'decor'] },
    ]  },
};
