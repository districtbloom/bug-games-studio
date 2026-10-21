/* stills agent: frames from the game's renderer, with real mural pins staged the way game.js pins them.
   node stage.js <outDir> <specs.json>
   spec: { name, w, h, lt, shot | shotJs, png, settle, reset:true (fresh residents),
           keep:"key"   (also keep this frame in the page as a print, JPEG like game.js capture()),
           pins:[[idx,"key"],...] (pin kept prints on the mural, pinMatrix() from game.js),
           probe:"js"   (print JSON instead of rendering) } */
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs');
const out = process.argv[2]; const specs = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1000, height: 700 } });
  const logs = []; p.on('pageerror', e => logs.push('PAGEERROR ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/ERR_|net::|fonts/.test(m.text())) logs.push('ERR ' + m.text()); });
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());   /* the sandbox has no route to the fonts; fail fast */
  await p.goto('file:///home/claude/cara3d/test/studio_local.html', { timeout: 0 });
  await p.waitForFunction(() => /ready/.test(document.querySelector('#studioState')?.textContent || ''), null, { timeout: 300000 });
  await p.evaluate(() => {
    /* pins pass through to the renderer exactly as game.js frame() passes S.pins */
    const R = CARA.R, orig = R.render.bind(R);
    window.__PINS = []; window.__PRINTS = {};
    R.render = (cam, L, t, o) => { if (window.__PINS.length) o.pins = window.__PINS; return orig(cam, L, t, o); };
    /* game.js pinMatrix(pin) for pin.who === 'mural', landscape print */
    window.__pinMatrix = idx => {
      const s = WORLD.pinSpots.mural[idx]; const o = add(s.o, [0, .35, 0]), n = s.n, w = 3, h = 2;
      const t = norm(cross([0, 1, 0], n)), m = new Float32Array(16);
      m[0] = t[0] * w; m[1] = 0; m[2] = t[2] * w; m[5] = h; m[8] = n[0]; m[9] = n[1]; m[10] = n[2]; m[12] = o[0] + n[0] * .03; m[13] = o[1]; m[14] = o[2] + n[2] * .03; m[15] = 1;
      return m;
    };
  });
  for (const s of specs) {
    const t0 = Date.now();
    if (s.load) { await p.evaluate(m => { Object.assign(window.__PRINTS, m); }, Object.fromEntries(Object.entries(s.load).map(([k, f]) => [k, 'data:image/jpeg;base64,' + fs.readFileSync(f).toString('base64')]))); console.log('loaded prints', Object.keys(s.load).join(' ')); continue; }
    if (s.probe) { const r = await p.evaluate(e => JSON.stringify(new Function(e)()), s.probe); console.log('PROBE', s.name || '', r); continue; }
    if (s.pins) {
      await p.evaluate(async (pins) => {
        window.__PINS = [];
        for (const [idx, key] of pins) {
          const url = window.__PRINTS[key]; if (!url) throw new Error('no print ' + key);
          const im = new Image(); im.src = url; await im.decode();
          window.__PINS.push({ m: window.__pinMatrix(idx), tex: CARA.R.texFrom(im) });   /* game.js pinTex(): R.texFrom(image of pr.url) */
        }
      }, s.pins);
    } else await p.evaluate(() => { window.__PINS = []; });
    const data = await p.evaluate(async (s) => {
      const R = STUDIO_RUN; R.C = CARA; R.S = CARA.S; R.R = CARA.R;
      const W = s.w, H = s.h || Math.round(W * 9 / 16);
      window.CARA_VIEW = { w: W / 2, h: H / 2 }; window.CARA_FIXEDRES = true; CARA.S.maxScale = 2; CARA.S.scale = 1; CARA.fit();
      const shot = s.shotJs ? new Function(s.shotJs)() : s.shot;
      shot.t0 = 0; shot.t1 = s.len || 10;
      const job = { shots: [shot], texts: [], fps: 30, dur: 100 };
      if (s.reset !== false) for (const w of PEOPLE.list) { w.entry = -1; w.visible = false; w.pos = null; w.state = 'hidden'; w.route = null; w.pose = null; }
      PEOPLE.festival = !!shot.festival;
      const simT = 100 + s.lt;
      for (let k = 0; k < (s.settle ?? 40); k++) PEOPLE.update(.05, shot.hour, simT - 2 + k * .05);
      /* the opening (sketch phase): game.js frame() leaves the residents out until the colour floods in */
      if (s.hideRes) for (const w of PEOPLE.list) if (w.resident) w.visible = false;
      R.trk = null;
      R.renderShot(job, s.lt); R.renderShot(job, s.lt);
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      c.getContext('2d').drawImage(document.getElementById('gl'), 0, 0, W, H);
      if (s.keep) window.__PRINTS[s.keep] = c.toDataURL('image/jpeg', .9);   /* game.js capture(): JPEG .9 */
      return [c.toDataURL(s.png ? 'image/png' : 'image/jpeg', .95), s.keep ? window.__PRINTS[s.keep] : null];
    }, s);
    if (data[1]) fs.writeFileSync(path.join(out, s.name + '.print.jpg'), Buffer.from(data[1].split(',')[1], 'base64'));
    fs.writeFileSync(path.join(out, s.name + (s.png ? '.png' : '.jpg')), Buffer.from(data[0].split(',')[1], 'base64'));
    console.log(s.name, Date.now() - t0, 'ms');
  }
  console.log(logs.slice(0, 20).join('\n'));
  await b.close();
})();
