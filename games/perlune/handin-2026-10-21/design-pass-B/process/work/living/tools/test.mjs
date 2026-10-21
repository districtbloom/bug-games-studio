// Perlune living poster: test bench (held frame, sizes, modes, timing). Not part of the deliverable.
// usage: node test.mjs <module.js> <outDir> <job.json>
// job: { shots: [{name, w, h, rm, mode, mt, t, near, squeeze, hover, pre:[secs of simulated frames before], events:[[time,evt]]}], timing: {w,h,frames} }
import fs from 'fs'; import path from 'path';
const PW = '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const { chromium } = await import(PW);
const [modPath, outDir, jobPath] = process.argv.slice(2);
const mod = fs.readFileSync(modPath, 'utf8'); const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(async () => chromium.launch());
const pg = await (await b.newContext({ viewport: { width: 1000, height: 800 }, deviceScaleFactor: job.dpr || 1 })).newPage();
const errs = []; pg.on('pageerror', (e) => errs.push('pageerror: ' + e.message)); pg.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
await pg.setContent(`<!doctype html><html><body style="margin:0;background:#141019"><canvas id="c"></canvas><script>const BUG_MODS = {};\n${mod}\n</script></body></html>`);
const res = await pg.evaluate(async (job) => {
  const M = BUG_MODS.perlune; const out = { shots: [], timing: null, emits: [] };
  const cv = document.getElementById('c'); const dpr = window.devicePixelRatio || 1;
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (const sh of job.shots) {
    const inst = M.create({ rnd, emit: (e) => out.emits.push([sh.name, e]) });
    cv.width = Math.round(sh.w * dpr); cv.height = Math.round(sh.h * dpr); cv.style.width = sh.w + 'px'; cv.style.height = sh.h + 'px';
    const ctx = cv.getContext('2d');
    // warm-up: let the body sprite refine (it refines a few rows per frame)
    const draw = (s) => { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, s.w, s.h); ctx.clip(); inst.frame(ctx, s); ctx.restore(); };
    const base = { w: sh.w, h: sh.h, t: 0, dt: 1 / 60, mode: 'idle', mt: 0, near: 0, hover: null, grow: 0, squeeze: 0, rm: !!sh.rm };
    for (let i = 0; i < (sh.warm ?? 400); i++) draw(Object.assign({}, base, { rm: true }));
    // simulated timeline: list of segments [mode, secs, extra]
    let t = 0; const ev = (sh.events || []).slice();
    for (const seg of (sh.timeline || [])) {
      const [mode, secs, extra] = seg; let mt = 0;
      for (let f = 0; f < Math.round(secs * 60); f++) {
        while (ev.length && ev[0][0] <= t) inst.on(ev.shift()[1]);
        const sx = Object.assign({}, base, extra || {}, { t, mt, mode, dt: 1 / 60, rm: false });
        if (sx.squeezeTo !== undefined) { const q = Math.min(1, mt / (sx.squeezeIn || 1)) * sx.squeezeTo; sx.squeeze = q; sx.w = Math.round(sh.w - (sh.w - (sx.wTo || sh.w)) * q / sx.squeezeTo); sx.h = Math.round(sh.h - (sh.h - (sx.hTo || sh.h)) * q / sx.squeezeTo); }
        if (sx.w !== cv.width / dpr || sx.h !== cv.height / dpr) { cv.width = Math.round(sx.w * dpr); cv.height = Math.round(sx.h * dpr); }
        draw(sx);
        if (sh.every && f % Math.round(sh.every * 60) === 0) out.shots.push({ name: sh.name + '-' + String(Math.round(t * 100)).padStart(5, '0'), url: cv.toDataURL('image/png'), anchor: inst.anchor() });
        t += 1 / 60; mt += 1 / 60;
      }
    }
    if (sh.final) draw(Object.assign({}, base, sh.final, { t, rm: !!sh.rm }));
    else draw(Object.assign({}, base, { t, rm: !!sh.rm }));
    out.shots.push({ name: sh.name, url: cv.toDataURL('image/png'), anchor: inst.anchor() });
  }
  if (job.timing) {
    const tj = job.timing; const inst = M.create({ rnd, emit: () => {} });
    cv.width = tj.w * dpr; cv.height = tj.h * dpr; const ctx = cv.getContext('2d');
    const draw = (s) => { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); inst.frame(ctx, s); };
    for (let i = 0; i < 400; i++) draw({ w: tj.w, h: tj.h, t: 0, dt: 1 / 60, mode: 'idle', mt: 0, near: 0, hover: null, grow: 0, squeeze: 0, rm: true });
    const r = {};
    for (const mode of ['idle', 'react', 'enter', 'loop', 'squeezed']) {
      const ts = []; let mt = 0;
      for (let f = 0; f < tj.frames; f++) {
        const s = { w: tj.w, h: tj.h, t: f / 60, dt: 1 / 60, mode, mt, near: 0.3, hover: { x: tj.w * 0.6, y: tj.h * 0.4 }, grow: 1, squeeze: mode === 'squeezed' ? 0.8 : 0, rm: false };
        const a = performance.now(); draw(s); ctx.getImageData(0, 0, 1, 1); ts.push(performance.now() - a); mt += 1 / 60;
        if (mode === 'react' && mt > 0.8) mt = 0.8; if (mode === 'enter' && mt > 0.7) mt = 0.7;
      }
      ts.sort((x, y) => x - y); r[mode] = { median: +ts[ts.length >> 1].toFixed(3), p90: +ts[Math.floor(ts.length * 0.9)].toFixed(3), mean: +(ts.reduce((x, y) => x + y, 0) / ts.length).toFixed(3) };
    }
    // sprite cost (one-time)
    out.timing = r;
  }
  return out;
}, job);
for (const s of res.shots) { fs.writeFileSync(path.join(outDir, s.name + '.png'), Buffer.from(s.url.split(',')[1], 'base64')); }
console.log(JSON.stringify({ errors: errs, timing: res.timing, anchors: res.shots.map((s) => [s.name, s.anchor]), emits: res.emits.slice(0, 6) }, null, 0));
await b.close();
