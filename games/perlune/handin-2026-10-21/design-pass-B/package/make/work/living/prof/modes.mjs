import fs from 'fs';
const { chromium } = await import('/home/claude/.npm-global/lib/node_modules/playwright/index.mjs');
const mod = fs.readFileSync(process.argv[2], 'utf8'); const cpu = process.argv[3] === 'cpu'; const W = +(process.argv[4] || 600), H = +(process.argv[5] || 400);
const b = await chromium.launch({ args: cpu ? ['--disable-gpu', '--disable-accelerated-2d-canvas'] : [] }); const pg = await b.newPage();
await pg.setContent(`<canvas id=c></canvas><script>const BUG_MODS={};\n${mod}\n</script>`);
const r = await pg.evaluate(([W, H]) => {
  const M = BUG_MODS.perlune; const t0 = performance.now(); const inst = M.create({ rnd: Math.random, emit: () => {} }); const tCreate = performance.now() - t0;
  const cv = document.getElementById('c'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d');
  const S = (mode, mt, rm, extra) => Object.assign({ w: W, h: H, t: mt, dt: 1 / 60, mode, mt, near: 0.3, hover: { x: W * 0.7, y: H * 0.4 }, grow: 1, squeeze: mode === 'squeezed' ? 0.8 : 0, rm }, extra || {});
  const tw = performance.now(); for (let i = 0; i < 400; i++) inst.frame(ctx, S('idle', 0, true)); ctx.getImageData(0, 0, 1, 1); const tWarm = performance.now() - tw;
  const out = { create_ms: +tCreate.toFixed(1), warm400_ms: +tWarm.toFixed(0) };
  const stat = (ts) => { ts.sort((x, y) => x - y); return { p25: +ts[Math.floor(ts.length * 0.25)].toFixed(2), med: +ts[ts.length >> 1].toFixed(2), p90: +ts[Math.floor(ts.length * 0.9)].toFixed(2) }; };
  const plan = { idle: [0, 12], react: [0, 0.8], enter: [0, 0.7], loop: [0, 12], squeezed: [0, 8] };
  for (const mode in plan) {
    const [a, z] = plan[mode], n = 180, tsF = [], tsJ = [];
    for (let i = 0; i < n; i++) {
      const mt = a + (z - a) * i / n; const s = S(mode, mt, false);
      let q = performance.now(); inst.frame(ctx, s); const j = performance.now() - q; ctx.getImageData(0, 0, 1, 1); tsF.push(performance.now() - q); tsJ.push(j);
    }
    out[mode] = { total: stat(tsF), js: stat(tsJ) };
  }
  const ts = []; for (let i = 0; i < 120; i++) { const q = performance.now(); inst.frame(ctx, S('idle', 0, true)); ctx.getImageData(0, 0, 1, 1); ts.push(performance.now() - q); } out.rm = stat(ts);
  return out;
}, [W, H]);
console.log((cpu ? 'cpu-raster ' : 'default ') + W + 'x' + H, JSON.stringify(r)); await b.close();
