import fs from 'fs';
const { chromium } = await import('/home/claude/.npm-global/lib/node_modules/playwright/index.mjs');
const mod = fs.readFileSync('prof/sh.js', 'utf8');
const b = await chromium.launch(); const pg = await b.newPage();
await pg.setContent(`<canvas id=c></canvas><script>const BUG_MODS={};\n${mod}\n</script>`);
const r = await pg.evaluate(() => { BUG_MODS.perlune.create({ rnd: Math.random, emit() {} }); const f = globalThis.__shadeInto; const d = new Uint8ClampedArray(4 * 300 * 300);
  const res = []; for (let rep = 0; rep < 3; rep++) { const t = performance.now(); let n = 0; for (let j = 0; j < 236; j++) for (let i = 0; i < 236; i++) { const u = (i - 118) / 105, v = (j - 118) / 105; if (u * u + v * v > 1.27) continue; f(u, v, 105, d, (j * 300 + i) * 4); n++; } res.push(((performance.now() - t) * 1000 / n).toFixed(3) + ' us/px over ' + n); } return res; });
console.log(r.join(' | ')); await b.close();
