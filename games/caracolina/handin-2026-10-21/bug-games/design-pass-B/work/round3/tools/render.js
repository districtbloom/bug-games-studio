/* clean key-art frames from the studio's shot code: node render.js outDir specs.json
   spec: { name, w, lt, shot: {...trailer shot...}, shotJs?: "return {...}" } */
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs');
const out = process.argv[2]; const specs = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1000, height: 700 } });
  const logs = []; p.on('pageerror', e => logs.push('PAGEERROR ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/ERR_|net::|fonts/.test(m.text())) logs.push('ERR ' + m.text()); });
  await p.goto('file:///home/claude/cara3d/test/studio_local.html', { waitUntil: 'domcontentloaded', timeout: 300000 });
  await p.waitForFunction(() => /ready/.test(document.querySelector('#studioState')?.textContent || ''), null, { timeout: 300000 });
  for (const s of specs) {
    const t0 = Date.now();
    const data = await p.evaluate(async (s) => {
      const R = STUDIO_RUN; R.C = CARA; R.S = CARA.S; R.R = CARA.R;
      const W = s.w, H = s.h || Math.round(W * 9 / 16);
      window.CARA_VIEW = { w: W / 2, h: H / 2 }; window.CARA_FIXEDRES = true; CARA.S.maxScale = 2; CARA.S.scale = 1; CARA.fit();
      const shot = s.shotJs ? new Function(s.shotJs)() : s.shot;
      shot.t0 = 0; shot.t1 = s.len || 10;
      const job = { shots: [shot], texts: [], fps: 30, dur: 100 };
      PEOPLE.festival = !!shot.festival;
      const simT = 100 + s.lt;
      for (let k = 0; k < (s.settle ?? 40); k++) PEOPLE.update(.05, shot.hour, simT - 2 + k * .05);
      R.trk = null;
      R.renderShot(job, s.lt); R.renderShot(job, s.lt);
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      c.getContext('2d').drawImage(document.getElementById('gl'), 0, 0, W, H);
      return c.toDataURL(s.png ? 'image/png' : 'image/jpeg', .95);
    }, s);
    fs.writeFileSync(path.join(out, s.name + (s.png ? '.png' : '.jpg')), Buffer.from(data.split(',')[1], 'base64'));
    console.log(s.name, Date.now() - t0, 'ms');
  }
  console.log(logs.slice(0, 20).join('\n'));
  await b.close();
})();
