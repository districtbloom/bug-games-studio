/* store-pass runner: loads the game's studio build (/home/claude/cara3d/test/studio_local.html), optionally renders
   frames with the game's renderer, injects art.js (drawing code that calls the game's own 2D painters) and saves
   every PNG it returns.
   NODE_PATH=/home/claude/.npm-global/lib/node_modules node run.js <outdir> <job> [--render specs.json] [--renders dir] */
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs');
const out = process.argv[2], job = process.argv[3], args = process.argv.slice(4);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const rspec = opt('--render'), rdir = opt('--renders');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const t0 = Date.now();
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1000, height: 700 } });
  const logs = []; p.on('pageerror', e => logs.push('PAGEERROR ' + e.message)); p.on('console', m => { const t = m.text(); if (!/ERR_|net::|fonts/.test(t)) logs.push(m.type() + ' ' + t); });
  const PAGE = args.includes('--draft') ? 'file://' + path.join(__dirname, 'harness.html') : 'file:///home/claude/cara3d/test/studio_local.html';
  console.log('page:', PAGE);
  await p.goto(PAGE, { waitUntil: 'commit', timeout: 300000 });
  if (rspec) await p.waitForFunction(() => /ready/.test(document.querySelector('#studioState')?.textContent || ''), null, { timeout: 300000 });
  else await p.waitForFunction(() => typeof drawFigure === 'function' && typeof PEOPLE_ATLAS !== 'undefined' && typeof texMosaic === 'function' && document.querySelector('#i-shell path'), null, { timeout: 300000, polling: 250 });
  console.log('page', Date.now() - t0, 'ms');
  const renders = {};
  if (rdir) for (const f of fs.readdirSync(rdir)) if (/^render_.*\.png$/.test(f)) renders[f.slice(7, -4)] = 'data:image/png;base64,' + fs.readFileSync(path.join(rdir, f)).toString('base64');
  if (rspec) {
    for (const s of JSON.parse(fs.readFileSync(rspec, 'utf8'))) {
      const t1 = Date.now();
      renders[s.name] = await p.evaluate(async (s) => {
        const R = STUDIO_RUN; R.C = CARA; R.S = CARA.S; R.R = CARA.R;
        const W = s.w, H = s.h;
        window.CARA_VIEW = { w: W / 2, h: H / 2 }; window.CARA_FIXEDRES = true; CARA.S.maxScale = 2; CARA.S.scale = 1; CARA.fit();
        const shot = s.shot; shot.t0 = 0; shot.t1 = 10;
        const jb = { shots: [shot], texts: [], fps: 30, dur: 100 };
        PEOPLE.festival = !!shot.festival;
        const simT = 100 + s.lt;
        for (let k = 0; k < 40; k++) PEOPLE.update(.05, shot.hour, simT - 2 + k * .05);
        R.trk = null; R.renderShot(jb, s.lt); R.renderShot(jb, s.lt);
        const c = document.createElement('canvas'); c.width = W; c.height = H;
        c.getContext('2d').drawImage(document.getElementById('gl'), 0, 0, W, H);
        return c.toDataURL('image/png');
      }, s);
      fs.mkdirSync(path.join(out, 'renders'), { recursive: true });
      fs.writeFileSync(path.join(out, 'renders', 'render_' + s.name + '.png'), Buffer.from(renders[s.name].split(',')[1], 'base64'));
      console.log('render', s.name, Date.now() - t1, 'ms');
    }
  }
  if (job !== 'none') {
    const modf = path.join(__dirname, '..', '..', 'bug', 'reward', 'taped-in.js');
    if (fs.existsSync(modf)) await p.addScriptTag({ content: '(function(){' + fs.readFileSync(modf, 'utf8').replace(/^export (default )?/gm, '') + '\nwindow.drawTapedIn = drawTapedIn; window.TAPED_MS = DURATION_MS;})();' });
    await p.addScriptTag({ content: '(function(){' + fs.readFileSync(path.join(__dirname, 'art.js'), 'utf8') + '\nwindow.ART_JOB = ART_JOB;})();' });
    const res = await p.evaluate(async ([job, renders]) => await ART_JOB(job, renders), [job, renders]);
    for (const [name, data] of Object.entries(res)) { const f = path.join(out, name + '.png'); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, Buffer.from(data.split(',')[1], 'base64')); }
    console.log(Object.keys(res).length, 'files', Date.now() - t0, 'ms');
  }
  console.log(logs.filter(l => /error|ERR/i.test(l)).slice(0, 20).join('\n'));
  await b.close();
})();
