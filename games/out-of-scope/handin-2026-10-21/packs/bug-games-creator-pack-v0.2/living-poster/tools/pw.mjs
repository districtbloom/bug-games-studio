// Shared bits for shot.mjs and states.mjs: flags, Playwright + Chromium lookup, the local font server.
// Flags (anywhere on the command line):
//   --chromium PATH      Chromium/Chrome executable (else $CHROMIUM_PATH, else Playwright's own browser)
//   --playwright PATH    the playwright package folder or its index.mjs (else $PLAYWRIGHT_MODULE, else `import('playwright')`)
//   --root DIR           folder served as the site (default: ./render next to this script)
//   --out DIR            where screenshots go (default: ./shots next to this script)
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { pathToFileURL } from 'url';

export const here = path.dirname(new URL(import.meta.url).pathname);
export const FONT_DIR = path.join(here, 'fonts');

export function parseArgs(argv) {
  const flags = {}, pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) { flags[a.slice(2)] = argv[i + 1]; i++; } else pos.push(a);
  }
  return { flags, pos };
}

export async function loadChromium(flags) {
  let spec = flags.playwright || process.env.PLAYWRIGHT_MODULE || '';
  let mod = null;
  const tryImport = async (p) => { try { return await import(p); } catch (e) { return null; } };
  if (spec) {
    let p = path.resolve(spec);
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = fs.existsSync(path.join(p, 'index.mjs')) ? path.join(p, 'index.mjs') : path.join(p, 'index.js');
    mod = await tryImport(pathToFileURL(p).href);
    if (!mod) throw new Error('cannot load Playwright from ' + spec);
  } else {
    mod = await tryImport('playwright');
    if (!mod) { try { const req = createRequire(path.join(process.cwd(), 'x.js')); mod = req('playwright'); } catch (e) { mod = null; } }
    if (!mod) throw new Error('Playwright not found: npm i playwright (or pass --playwright <path to the playwright package>)');
  }
  const chromium = mod.chromium || (mod.default && mod.default.chromium);
  const exe = flags.chromium || process.env.CHROMIUM_PATH || undefined;
  return { chromium, launchOpts: exe ? { executablePath: exe } : {} };
}

const FACES = [['Bricolage Grotesque', 'BricolageGrotesque-Regular', '100 549'], ['Bricolage Grotesque', 'BricolageGrotesque-Bold', '550 900'],
  ['DM Mono', 'DMMono-Regular', '100 900'], ['Geist Mono', 'GeistMono-Regular', '400'], ['Geist Mono', 'GeistMono-Bold', '500 700'],
  ['Instrument Serif', 'InstrumentSerif-Regular', '400'], ['Instrument Serif', 'InstrumentSerif-Italic', '400', 'italic'],
  ['Instrument Sans', 'InstrumentSans-Regular', '400 549'], ['Instrument Sans', 'InstrumentSans-Bold', '550 900']];
// the pages ask Google Fonts for these faces; the harness answers locally so a run needs no network
export const fontCSS = (port) => FACES.filter(([, file]) => fs.existsSync(path.join(FONT_DIR, file + '.ttf')))
  .map(([fam, file, w, st]) => `@font-face{font-family:'${fam}';src:url(http://localhost:${port}/_f/${file}.ttf);font-weight:${w};font-style:${st || 'normal'}}`).join('\n');

export const TYPES = (p) => p.endsWith('.js') ? 'text/javascript' : p.endsWith('.png') ? 'image/png' : p.endsWith('.svg') ? 'image/svg+xml' : /\.jpe?g$/.test(p) ? 'image/jpeg'
  : p.endsWith('.webp') ? 'image/webp' : p.endsWith('.mp4') ? 'video/mp4' : p.endsWith('.ttf') ? 'font/ttf' : p.endsWith('.css') ? 'text/css' : 'text/html';

export function serve(http, root, port) {
  return http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const p = u.startsWith('/_f/') ? path.join(FONT_DIR, path.basename(u)) : path.join(root, path.normalize(u).replace(/^(\.\.[\/\\])+/, ''));
    if (!p.startsWith(root) && !p.startsWith(FONT_DIR)) { res.writeHead(403); return res.end(); }
    if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': TYPES(p), 'access-control-allow-origin': '*' }); fs.createReadStream(p).pipe(res);
  }).listen(port, '127.0.0.1');
}

// every request that is not our local server or the (locally answered) font CSS is blocked and recorded
export async function guard(pg, port, css, errs) {
  await pg.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: css }));
  await pg.route((url) => !/^(http:\/\/(localhost|127\.0\.0\.1):\d+\/|data:|blob:|about:)/.test(url.href) && !/fonts\.(googleapis|gstatic)\.com/.test(url.host), (r) => { errs.push('blocked network: ' + r.request().url()); r.abort(); });
}
