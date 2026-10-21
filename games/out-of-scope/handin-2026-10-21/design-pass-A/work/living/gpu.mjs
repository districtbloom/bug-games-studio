import { createRequire } from 'module';
const require = createRequire('/home/claude/.npm-global/lib/node_modules/');
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const pg = await b.newPage();
console.log(await pg.evaluate(() => { const g = document.createElement('canvas').getContext('webgl'); if (!g) return 'no webgl'; const d = g.getExtension('WEBGL_debug_renderer_info'); return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER); }), await b.version());
await b.close();
