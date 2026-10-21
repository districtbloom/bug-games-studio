// Contact sheet for the living poster module: simulates each cell frame by frame (30 fps) so modes, events and
// state build up as on the board, then screenshots the sheet.
// usage: node dev.mjs <cells.json> <out.png> [cols] [dpr]
//   cells.json: [{ "label": "...", "w": 600, "h": 400, "at": 3.2, "rm": false,
//                  "tl": [[0, {"mode":"idle"}], [3, {"mode":"react"}], [2.5, {"event":{"type":"hit","x":100,"y":80}}],
//                         [0, {"squeeze": 0.8, "near": 0.5}]] }]
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire('/home/claude/.npm-global/lib/node_modules/');
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const [cellsPath, out, colsArg, dprArg] = process.argv.slice(2);
const cells = JSON.parse(fs.readFileSync(cellsPath, 'utf8'));
const mod = fs.readFileSync('/home/claude/designpass/bug/living-poster/outofscope.js', 'utf8');
const cols = +(colsArg || 3), dpr = +(dprArg || 1);
const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#141019;color:#ada3ca;font:11px monospace}
#g{display:flex;flex-wrap:wrap;gap:14px;padding:14px;width:${cols * 0}px}.c{display:flex;flex-direction:column;gap:4px}canvas{display:block;outline:1px solid #3b3247}</style></head>
<body><div id="g"></div><script>const BUG_MODS = {};\n${mod}\n</script></body></html>`;
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b = await chromium.launch(fs.existsSync(exe) ? { executablePath: exe } : {});
const pg = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: dpr });
const errs = [];
pg.on('pageerror', (e) => errs.push('pageerror ' + e.message));
pg.on('console', (m) => { if (m.type() === 'error') errs.push('console ' + m.text()); });
await pg.setContent(html);
const res = await pg.evaluate(({ cells, cols }) => {
  const g = document.getElementById('g');
  const maxW = Math.max(...cells.map((c) => c.w));
  g.style.width = (cols * (maxW + 14) + 14) + 'px';
  const M = BUG_MODS.outofscope; const emitted = [];
  for (const c of cells) {
    const d = document.createElement('div'); d.className = 'c';
    const lab = document.createElement('div'); lab.textContent = c.label || `${c.w}x${c.h} t=${c.at}`;
    const cv = document.createElement('canvas'); const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(c.w * dpr); cv.height = Math.round(c.h * dpr); cv.style.width = c.w + 'px'; cv.style.height = c.h + 'px';
    d.style.width = maxW + 'px'; d.appendChild(lab); d.appendChild(cv); g.appendChild(d);
    const ctx = cv.getContext('2d');
    let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const inst = M.create({ rnd, emit: (e) => emitted.push(Object.assign({ cell: c.label }, e)) });
    const tl = (c.tl || []).slice().sort((a, b) => a[0] - b[0]);
    let st = { mode: 'idle', squeeze: 0, near: 0, w: c.w, h: c.h }, m0 = 0, k = 0;
    const steps = c.rm ? [0] : Array.from({ length: Math.floor(c.at * 30) + 1 }, (_, i) => Math.min(c.at, i / 30));
    if (!c.rm && steps[steps.length - 1] < c.at) steps.push(c.at);
    let last = 0;
    for (const t of steps) {
      while (k < tl.length && tl[k][0] <= t + 1e-9) {
        const o = tl[k][1];
        if (o.mode && o.mode !== st.mode) { st.mode = o.mode; m0 = tl[k][0]; }
        if (o.squeeze != null) st.squeeze = o.squeeze; if (o.near != null) st.near = o.near; if (o.w) st.w = o.w; if (o.h) st.h = o.h;
        if (o.event) inst.on(o.event);
        k++;
      }
      const W = st.w, H = st.h;
      if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.width = W + 'px'; cv.style.height = H + 'px'; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
      inst.frame(ctx, { w: W, h: H, t: c.rm ? 0 : t, dt: Math.min(0.05, t - last || 1 / 30), mode: c.rm ? 'idle' : st.mode, mt: c.rm ? 0 : t - m0, near: st.near, hover: null, grow: 0, squeeze: st.squeeze, rm: !!c.rm });
      ctx.restore(); last = t;
    }
    if (c.anchor) { const a = inst.anchor(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.strokeStyle = '#ff2e88'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(a.x * st.w, a.y * st.h, 6, 0, 7); ctx.stroke(); }
  }
  return { emitted };
}, { cells, cols });
if (errs.length) console.log("errs", errs);
const box = await pg.locator('#g').boundingBox();
await pg.screenshot({ path: out, fullPage: true, clip: { x: 0, y: 0, width: Math.ceil(box.width), height: Math.ceil(box.height) } });
console.log('wrote', out, 'emitted', JSON.stringify(res.emitted).slice(0, 300), 'errors', JSON.stringify(errs));
await b.close();
