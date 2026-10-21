/* rasterise the marks in Chromium: node draw.js <outdir> [variants.json]
   variants.json: [{ "name": "icon-a", "fn": "drawIcon", "M": 92, "v": {...} }, ...] */
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs');
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const jobs = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], 'utf8')) : [
  { name: 'icon-46', fn: 'drawIcon', M: 92 }, { name: 'emblem-30', fn: 'drawEmblem', M: 60 }, { name: 'chip-64', fn: 'drawChip', M: 128 }];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const logs = []; p.on('pageerror', e => logs.push('PAGEERROR ' + e.message)); p.on('console', m => logs.push(m.type() + ' ' + m.text()));
  await p.goto('file://' + path.join(__dirname, 'marks.html'));
  await p.waitForFunction(() => !!window.MARKS);
  for (const j of jobs) {
    const data = await p.evaluate(j => MARKS[j.fn](j.M, j.v || {}).toDataURL('image/png'), j);
    fs.writeFileSync(path.join(out, j.name + '.png'), Buffer.from(data.split(',')[1], 'base64'));
  }
  if (logs.length) console.log(logs.join('\n'));
  await b.close();
})();
