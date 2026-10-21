// Luminance trace at 30 fps: mean frame luminance and the share of pixels that change by > 25% luminance between
// consecutive frames (a flash test), per mode. usage: node lum.mjs <W> <H>
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire('/home/claude/.npm-global/lib/node_modules/');
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const [W, H] = process.argv.slice(2).map(Number);
const mod = fs.readFileSync('/home/claude/designpass/bug/living-poster/outofscope.js', 'utf8');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const pg = await b.newPage();
await pg.setContent(`<!doctype html><canvas id="c"></canvas><script>const BUG_MODS = {};\n${mod}\n</script>`);
const res = await pg.evaluate(({ W, H }) => {
  const cv = document.getElementById('c'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d', { willReadFrequently: true });
  const runs = { idle: [['idle', 0, 30]], loop: [['loop', 0, 12]], squeezed: [['squeezed', 0, 6]], 'react+enter': [['react', 0, 0.8], ['enter', 0.8, 1.5]] };
  const out = {};
  for (const name in runs) {
    let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const inst = BUG_MODS.outofscope.create({ rnd, emit: () => {} });
    let prev = null; const L = []; let maxFlip = 0, maxDL = 0;
    for (const [mode, a, z] of runs[name]) for (let t = a; t < z; t += 1 / 30) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      inst.frame(ctx, { w: W, h: H, t, dt: 1 / 30, mode, mt: t - a, near: 0, hover: null, grow: 1, squeeze: 0.9, rm: false });
      const d = ctx.getImageData(0, 0, W, H).data, n = W * H, lum = new Float32Array(n); let s = 0;
      for (let i = 0; i < n; i++) { const v = (0.2126 * d[4 * i] + 0.7152 * d[4 * i + 1] + 0.0722 * d[4 * i + 2]) / 255; lum[i] = v; s += v; }
      const m = s / n; L.push(m);
      if (prev) { let f = 0; for (let i = 0; i < n; i++) if (Math.abs(lum[i] - prev[i]) > 0.25) f++; maxFlip = Math.max(maxFlip, f / n); maxDL = Math.max(maxDL, Math.abs(m - L[L.length - 2])); }
      prev = lum;
    }
    out[name] = { frames: L.length, meanLum: +(L.reduce((x, y) => x + y, 0) / L.length).toFixed(4), min: +Math.min(...L).toFixed(4), max: +Math.max(...L).toFixed(4), maxStepDelta: +maxDL.toFixed(4), maxPixelsFlipped: +(maxFlip * 100).toFixed(2) + '%' };
  }
  return out;
}, { W, H });
console.log(JSON.stringify(res, null, 1));
await b.close();
