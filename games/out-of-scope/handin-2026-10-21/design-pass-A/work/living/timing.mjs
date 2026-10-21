// Time the module's frame() at 600x400 inside the harness page (the board running alongside it).
// usage: node timing.mjs
import fs from 'fs'; import http from 'http'; import path from 'path';
import { createRequire } from 'module';
const require = createRequire('/home/claude/.npm-global/lib/node_modules/');
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const root = '/home/claude/designpass/work/living/render';
const port = 8700 + Math.floor(Math.random() * 90);
const srv = http.createServer((q, r) => { const p = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': p.endsWith('.js') ? 'text/javascript' : 'text/html' }); fs.createReadStream(p).pipe(r); }).listen(port);
const src = fs.readFileSync('/home/claude/designpass/bug/living-poster/outofscope.js', 'utf8');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const pg = await b.newPage({ viewport: { width: 1440, height: 900 } });
await pg.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (r) => r.abort());
await pg.goto(`http://localhost:${port}/HarnessOutofscopeLiving-poster.dc.html`);
await pg.waitForTimeout(2500);
const VAR = JSON.parse(process.env.VARIANTS || '[["base",[]]]');
const all = {};
for (const [vname, reps] of VAR) {
let vsrc = src; for (const [a, bb] of reps) { if (!vsrc.includes(a)) throw new Error('missing ' + a); vsrc = vsrc.split(a).join(bb); }
const res = await pg.evaluate(([src, FLUSH]) => {
  const M = new Function('const BUG_MODS = {};\n' + src + '\nreturn BUG_MODS.outofscope;')();
  const cv = document.createElement('canvas'); const dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = 600 * dpr; cv.height = 400 * dpr; document.body.appendChild(cv); const ctx = cv.getContext('2d');
  let seed = 3; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const out = {};
  const run = (label, mode, t0, opts = {}) => {
    const inst = M.create({ rnd, emit: () => {} });
    // warm up (geometry build, fan cache)
    for (let i = 0; i < 20; i++) { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); inst.frame(ctx, Object.assign({ w: 600, h: 400, t: t0 + i / 60, dt: 1 / 60, mode, mt: t0 + i / 60, near: 0, hover: null, grow: 0, squeeze: 0, rm: false }, opts)); }
    const N = 300, ts = [];
    for (let i = 0; i < N; i++) {
      const t = t0 + 1 + i / 60; const s = Object.assign({ w: 600, h: 400, t, dt: 1 / 60, mode, mt: t, near: 0.3, hover: null, grow: 0, squeeze: 0, rm: false }, opts);
      if (opts.resize) { s.w = 600 - (i % 60); s.h = 400 - (i % 40); }
      if (opts.enterLate) { s.mt = 0.45 + (i % 25) / 100; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const a = performance.now(); inst.frame(ctx, s); if (FLUSH) ctx.getImageData(0, 0, 1, 1); ts.push(performance.now() - a);
    }
    ts.sort((x, y) => x - y);
    out[label] = { avg: +(ts.reduce((x, y) => x + y, 0) / N).toFixed(3), median: +ts[N >> 1].toFixed(3), p95: +ts[Math.floor(N * 0.95)].toFixed(3) };
  };
  run('idle', 'idle', 2);
  run('loop', 'loop', 0);
  run('squeezed', 'squeezed', 0, { squeeze: 0.8 });
  run('idle-resizing', 'idle', 2, { resize: true });
  run('enter-late', 'enter', 0.45, { enterLate: true });
  const t0 = performance.now(); M._build(M.geo); out.buildMs = +(performance.now() - t0).toFixed(1);
  out.dpr = dpr;
  return out;
}, [vsrc, !!process.env.FLUSH]);
all[vname] = res;
console.log(vname, JSON.stringify(res));
}
await b.close(); srv.close();
