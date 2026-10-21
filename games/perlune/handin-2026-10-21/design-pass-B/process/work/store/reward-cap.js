// Capture the owned-mark animation on a store tile: frames at fixed t, a real-time play, the held PNG.
// usage: node reward-cap.js <tile id> <outDir> [writeHeld]
const { chromium } = require('playwright');
const fs = require('fs');
const [tile, out, writeHeld] = [process.argv[2] || 'opal', process.argv[3] || '/home/claude/passB/work/store/rw', process.argv[4]];
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 700, height: 470 }, deviceScaleFactor: 1 })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file:///home/claude/passB/work/store/reward-test.html');
  await p.evaluate(t => { for (const im of document.querySelectorAll('img')) im.src = '../../bug/store/' + t + '.png'; }, tile);
  await p.waitForTimeout(300);
  const ts = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.33, 0.36, 0.4, 0.45, 0.5, 0.55, 0.6, 0.7, 0.8, 0.9, 1];
  const el = await p.$('#big');
  for (const t of ts) { await p.evaluate(t => seek(t), t); await el.screenshot({ path: `${out}-t${String(Math.round(t * 100)).padStart(3, '0')}.png` }); }
  const r = await p.evaluate(() => play()); console.log('real-time play:', JSON.stringify(r));
  await p.screenshot({ path: `${out}-page.png` });
  if (writeHeld) { const d = await p.evaluate(() => heldPNG(400, 400)); fs.writeFileSync(writeHeld, Buffer.from(d.split(',')[1], 'base64')); console.log('held ->', writeHeld); }
  await b.close();
})();
