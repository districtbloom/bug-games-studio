// Frame cost of the module at 600x400 per mode: 6 trials of 150 frames each, amortized over a final raster flush; min and median reported.
import fs from 'fs';
const pw = await import('/home/claude/.npm-global/lib/node_modules/playwright/index.mjs');
const chromium = pw.chromium || pw.default.chromium;
const mod = fs.readFileSync(process.argv[2], 'utf8');
const b = await chromium.launch(); const pg = await b.newPage();
await pg.setContent('<!doctype html><body></body>');
await pg.addScriptTag({ content: 'const BUG_MODS = {};\n' + mod });
for (const mode of ['idle', 'react', 'loop', 'squeezed']) {
  const r = await pg.evaluate((mode) => {
    let seed = 9; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const inst = BUG_MODS.caracolina.create({ rnd, emit: () => {} }); const cv = document.createElement('canvas'); cv.width = 600; cv.height = 400; const ctx = cv.getContext('2d');
    let t = 0; const run = (k) => { for (let i = 0; i < k; i++) { inst.frame(ctx, { w: 600, h: 400, t, dt: 1 / 60, mode, mt: mode === 'react' ? (t % 0.8) : t, near: 0.3, hover: mode === 'idle' || mode === 'squeezed' ? null : { x: 240, y: 200 }, grow: 0, squeeze: mode === 'squeezed' ? 0.6 : 0, rm: false }); t += 1 / 60; } };
    run(60); ctx.getImageData(0, 0, 1, 1);
    const out = []; for (let k = 0; k < 6; k++) { const t0 = performance.now(); run(150); ctx.getImageData(0, 0, 1, 1); out.push((performance.now() - t0) / 150); }
    out.sort((a, b) => a - b); return { min: +out[0].toFixed(3), median: +out[3].toFixed(3) };
  }, mode);
  console.log(mode, JSON.stringify(r));
}
await b.close();
