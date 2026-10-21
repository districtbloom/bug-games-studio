import fs from 'fs';
const { chromium } = await import('/home/claude/.npm-global/lib/node_modules/playwright/index.mjs');
const mod = fs.readFileSync(process.argv[2], 'utf8'); const args = process.argv[3] === 'cpu' ? ['--disable-gpu', '--disable-accelerated-2d-canvas'] : [];
const b = await chromium.launch({ args }); const pg = await b.newPage();
await pg.setContent(`<canvas id=c></canvas><script>const BUG_MODS={};\n${mod}\n</script>`);
const r = await pg.evaluate(() => {
  const M = BUG_MODS.perlune, inst = M.create({ rnd: Math.random, emit: () => {} }), cv = document.getElementById('c'); cv.width = 600; cv.height = 400; const ctx = cv.getContext('2d');
  const S = (mode, mt, rm) => ({ w: 600, h: 400, t: mt, dt: 1 / 60, mode, mt, near: 0, hover: null, grow: 0, squeeze: 0, rm });
  for (let i = 0; i < 300; i++) inst.frame(ctx, S('idle', 0, true));
  const out = {};
  for (const fl of [false, true]) {
    globalThis.__FLUSH = fl; globalThis.__PF = {}; const ts = [];
    for (let i = 0; i < 120; i++) { const a = performance.now(); inst.frame(ctx, S('idle', i / 60, false)); if (!fl) ctx.getImageData(0, 0, 1, 1); ts.push(performance.now() - a); }
    ts.sort((x, y) => x - y); const pf = {}; for (const k in __PF) pf[k] = +(__PF[k] / 120).toFixed(2);
    out[fl ? 'flushEach' : 'flushEnd'] = { p25: +ts[30].toFixed(2), med: +ts[60].toFixed(2), layers: pf };
  }
  // JS-only (no flush at all)
  globalThis.__FLUSH = false; const ts = []; for (let i = 0; i < 120; i++) { const a = performance.now(); inst.frame(ctx, S('idle', i / 60, false)); ts.push(performance.now() - a); }
  ts.sort((x, y) => x - y); out.jsOnly = { p25: +ts[30].toFixed(2), med: +ts[60].toFixed(2) };
  // empty frame baseline
  const tb = []; for (let i = 0; i < 120; i++) { const a = performance.now(); ctx.fillStyle = '#05040A'; ctx.fillRect(0, 0, 600, 400); ctx.getImageData(0, 0, 1, 1); tb.push(performance.now() - a); }
  tb.sort((x, y) => x - y); out.emptyFlush = +tb[60].toFixed(2);
  return out;
});
console.log(process.argv[3] || 'gpu', JSON.stringify(r)); await b.close();
