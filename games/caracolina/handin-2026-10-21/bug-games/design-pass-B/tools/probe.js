/* evaluate a JS expression in the game (studio build) and print the JSON: node probe.js '<expr>' */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 800, height: 500 } });
  await p.goto('file:///home/claude/cara3d/test/studio_local.html');
  await p.waitForFunction(() => /ready/.test(document.querySelector('#studioState')?.textContent || ''), null, { timeout: 300000 });
  const r = await p.evaluate(e => JSON.stringify(new Function(e)()), process.argv[2]);
  console.log(r); await b.close();
})();
