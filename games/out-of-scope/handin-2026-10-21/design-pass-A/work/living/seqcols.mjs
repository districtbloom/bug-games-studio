// Render a sequence of frames (any mode) to PNGs for the colour scan and a luminance trace.
// usage: node seqcols.mjs <W> <H> <mode> <t0> <t1> <step> <outdir> [squeeze]
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire('/home/claude/.npm-global/lib/node_modules/');
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const [W, H, mode, t0, t1, step, outdir, sq] = process.argv.slice(2);
fs.mkdirSync(outdir, { recursive: true });
const mod = fs.readFileSync('/home/claude/designpass/bug/living-poster/outofscope.js', 'utf8');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const pg = await b.newPage({ viewport: { width: 400, height: 300 } });
const errs = []; pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await pg.setContent(`<!doctype html><canvas id="c"></canvas><script>const BUG_MODS = {};\n${mod}\n</script>`);
const shots = await pg.evaluate(({ W, H, mode, t0, t1, step, sq }) => {
  const cv = document.getElementById('c'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d');
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const inst = BUG_MODS.outofscope.create({ rnd, emit: () => {} });
  const out = []; let next = t0;
  for (let t = 0; t <= t1 + 1e-9; t += 1 / 30) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    inst.frame(ctx, { w: W, h: H, t, dt: 1 / 30, mode, mt: t, near: 0, hover: null, grow: 1, squeeze: sq, rm: false });
    if (t >= next - 1e-9) { const d = ctx.getImageData(0, 0, W, H).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; out.push([+t.toFixed(3), cv.toDataURL('image/png'), s / (W * H) / 255]); next += step; }
  }
  return out;
}, { W: +W, H: +H, mode, t0: +t0, t1: +t1, step: +step, sq: +(sq || 0) });
const lum = [];
for (const [t, url, L] of shots) { fs.writeFileSync(`${outdir}/${mode}-${W}x${H}-${t.toFixed(2)}.png`, Buffer.from(url.split(',')[1], 'base64')); lum.push([t, +L.toFixed(4)]); }
fs.writeFileSync(`${outdir}/${mode}-${W}x${H}-lum.json`, JSON.stringify(lum));
console.log('frames', shots.length, 'errors', JSON.stringify(errs));
await b.close();
