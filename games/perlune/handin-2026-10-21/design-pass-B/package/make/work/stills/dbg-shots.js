const N = require('./shots.js').nacre;
const H = ['dust', 'others', 'sunburst', 'decor'];
const cam = { yaw: 0, dist: 12, up: 3.2, ty: 0.75, fov: 0.3 };
const caps = [];
[1.2, 0.15, 0.15, 0.15].forEach((run, i) => {
  caps.push({ id: 'k' + i, run, eyes: [0, 0.35], cam, post: { neb: 0.02, dof: 0 }, hide: H });
  caps.push({ id: 'k' + i + 'off', eyes: [0, 0.35], cam, post: { neb: 0.02, dof: 0 }, hide: H, js: `window.__w = G.bl.p[3]; G.bl.p[3] = -1; window.__restoreW = true;` });
  caps.push({ id: 'k' + i + 'r', pre: `G.bl.p[3] = window.__w;`, eyes: [0, 0.35], cam: { yaw: 0, dist: 1, up: 30, ty: 0, fov: 0.6 }, post: { neb: 0.02, dof: 0 }, hide: H });
});
module.exports = { d: { setup: N.setup, caps } };
