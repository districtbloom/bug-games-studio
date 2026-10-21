/* render the seals with the game's own 2D drawing code, inside the game page:
   NODE_PATH=/home/claude/.npm-global/lib/node_modules node run.js <outDir> [only-name,only-name]
   loads cara3d/test/studio_local.html (fonts blocked), injects seals_draw.js, writes <moment>-<state>.png */
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const out = process.argv[2]; const only = process.argv[3] ? process.argv[3].split(',') : null;
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 800, height: 500 } });
  const logs = []; p.on('pageerror', e => logs.push('PAGEERROR ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/ERR_|net::|fonts/.test(m.text())) logs.push('ERR ' + m.text()); });
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await p.goto('file:///home/claude/cara3d/test/studio_local.html', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.waitForFunction(() => typeof drawFigure === 'function' && typeof texHatch === 'function' && typeof drawCat === 'function', null, { timeout: 300000 });
  const code = fs.readFileSync(path.join(__dirname, 'seals_draw.js'), 'utf8');
  await p.evaluate(code);
  if (process.env.VARIANT) await p.evaluate(v => SEALS.setVariant(v), process.env.VARIANT);
  const names = await p.evaluate(() => SEALS.names);
  for (const n of names) {
    if (only && !only.includes(n)) continue;
    for (const st of ['earned', 'progress', 'locked']) {
      const t0 = Date.now();
      const data = await p.evaluate(([n, st]) => SEALS.render(n, st), [n, st]);
      fs.writeFileSync(path.join(out, `${n}-${st}.png`), Buffer.from(data.split(',')[1], 'base64'));
      console.log(n, st, Date.now() - t0, 'ms');
    }
  }
  if (logs.length) console.log(logs.slice(0, 20).join('\n'));
  await b.close();
})();
