// Frame cost while the plate changes size every frame (no still-layer cache): a squeeze 600x400 -> 300x320 and back.
import fs from 'fs';
const pw = await import('/home/claude/.npm-global/lib/node_modules/playwright/index.mjs');
const chromium = pw.chromium || pw.default.chromium;
const mod = fs.readFileSync(process.argv[2], 'utf8');
const b = await chromium.launch(); const pg = await b.newPage();
await pg.setContent('<!doctype html><body></body>');
await pg.addScriptTag({ content: 'const BUG_MODS = {};\n' + mod });
const r = await pg.evaluate(() => {
  let seed = 9; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const inst = BUG_MODS.caracolina.create({ rnd, emit: () => {} }); const cv = document.createElement('canvas'); cv.width = 600; cv.height = 400; const ctx = cv.getContext('2d');
  let t = 0; const run = (k) => { for (let i = 0; i < k; i++) { const q = 0.5 - 0.5 * Math.cos(t * 2), w = Math.round(600 - 300 * q), h = Math.round(400 - 80 * q); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip(); inst.frame(ctx, { w, h, t, dt: 1 / 60, mode: 'squeezed', mt: t, near: 0, hover: null, grow: 0, squeeze: q, rm: false }); ctx.restore(); t += 1 / 60; } };
  run(30); ctx.getImageData(0, 0, 1, 1);
  const out = []; for (let k = 0; k < 6; k++) { const t0 = performance.now(); run(100); ctx.getImageData(0, 0, 1, 1); out.push((performance.now() - t0) / 100); }
  out.sort((a, b) => a - b); return { min: +out[0].toFixed(3), median: +out[3].toFixed(3) };
});
console.log('squeezing (size changes every frame)', JSON.stringify(r));
await b.close();
