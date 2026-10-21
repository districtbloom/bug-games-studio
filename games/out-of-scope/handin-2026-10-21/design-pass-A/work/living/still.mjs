// Render one frame of the module to a PNG (the canvas only).
// usage: node still.mjs <W> <H> <out.png> [dpr] [rm|mode:at]   e.g.  node still.mjs 1600 800 held.png 1.5 rm
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire('/home/claude/.npm-global/lib/node_modules/');
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const [W, H, out, dprA, spec] = process.argv.slice(2);
const dpr = +(dprA || 1), rm = !spec || spec === 'rm';
const mod = fs.readFileSync('/home/claude/designpass/bug/living-poster/outofscope.js', 'utf8');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const pg = await b.newPage({ viewport: { width: 400, height: 300 } });
const errs = []; pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await pg.setContent(`<!doctype html><canvas id="c"></canvas><script>const BUG_MODS = {};\n${mod}\n</script>`);
const data = await pg.evaluate(({ W, H, dpr, rm, spec }) => {
  const cv = document.getElementById('c'); cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  const ctx = cv.getContext('2d');
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const inst = BUG_MODS.outofscope.create({ rnd, emit: () => {} });
  let mode = 'idle', at = 0; if (!rm) { [mode, at] = spec.split(':'); at = +at; }
  const n = rm ? 1 : Math.floor(at * 30) + 1;
  for (let i = 0; i < n; i++) { const t = rm ? 0 : Math.min(at, i / 30); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); inst.frame(ctx, { w: W, h: H, t, dt: 1 / 30, mode, mt: t, near: 0, hover: null, grow: 0, squeeze: mode === 'squeezed' ? 0.9 : 0, rm }); }
  return cv.toDataURL('image/png');
}, { W: +W, H: +H, dpr, rm, spec });
fs.writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'));
console.log('wrote', out, 'errors', JSON.stringify(errs));
await b.close();
