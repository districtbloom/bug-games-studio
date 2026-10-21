// usage: node shot.mjs <file.dc.html> [W] [H] [mode] [times...] [--root DIR] [--out DIR] [--chromium PATH] [--playwright PATH]
// mode: full | view | seq (viewport shots at times in ms) | rm (reduced motion full)
// Prints one line: "<file> <W> height <h> errors [...]" (console errors, page errors, blocked network).
import http from 'http'; import path from 'path'; import fs from 'fs';
import { here, parseArgs, loadChromium, fontCSS, serve, guard } from './pw.mjs';

const { flags, pos } = parseArgs(process.argv.slice(2));
const root = path.resolve(flags.root || path.join(here, 'render'));
const outDir = path.resolve(flags.out || path.join(here, 'shots')); fs.mkdirSync(outDir, { recursive: true });
const f = pos[0]; const W = +(pos[1] || 1440), H = +(pos[2] || 900);
const mode = pos[3] || 'full'; const times = pos.slice(4).map(Number);
const port = 8800 + Math.floor(Math.random() * 900);
const srv = serve(http, root, port);
const { chromium, launchOpts } = await loadChromium(flags);
const b = await chromium.launch(launchOpts);
const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: mode === 'rm' ? 'reduce' : 'no-preference' });
const pg = await ctx.newPage();
const errs = [];
await guard(pg, port, fontCSS(port), errs);
pg.on('pageerror', (e) => errs.push('pageerror: ' + e.message)); pg.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
const t0 = Date.now();
await pg.goto(`http://localhost:${port}/` + f, { waitUntil: 'domcontentloaded' }).catch((e) => errs.push(e.message));
const base = path.join(outDir, f.replace('.dc.html', '') + '-' + W);
if (mode === 'seq') {
  for (const t of times) { const wait = t - (Date.now() - t0); if (wait > 0) await pg.waitForTimeout(wait); await pg.screenshot({ path: `${base}-t${t}.png` }); }
} else {
  await pg.waitForLoadState('networkidle').catch(() => {});
  await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(+(process.env.WAIT || 4000));
  if (mode === 'view') await pg.screenshot({ path: base + '-view.png' });
  else await pg.screenshot({ path: base + (mode === 'rm' ? '-rm' : '') + '.png', fullPage: true });
}
const h = await pg.evaluate(() => document.documentElement.scrollHeight);
console.log(f, W, 'height', h, 'errors', JSON.stringify(errs.slice(0, 6)));
await b.close(); srv.close();
process.exit(errs.length ? 3 : 0);
