import fs from 'fs';
const { chromium } = await import('/home/claude/.npm-global/lib/node_modules/playwright/index.mjs');
const mod = fs.readFileSync(process.argv[2], 'utf8');
const b = await chromium.launch(); const pg = await b.newPage();
await pg.setContent(`<canvas id=c></canvas><script>const BUG_MODS={};\n${mod}\n</script>`);
const r = await pg.evaluate(() => { const t = performance.now(); BUG_MODS.perlune.create({ rnd: Math.random, emit() {} }); const a = performance.now() - t; const P0 = JSON.parse(JSON.stringify(globalThis.__CT)); const t2 = performance.now(); BUG_MODS.perlune.create({ rnd: Math.random, emit() {} }); return { first: a, second: performance.now() - t2, parts: P0 }; });
console.log(JSON.stringify(r)); await b.close();
