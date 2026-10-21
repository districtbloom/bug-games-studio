// Extract the living poster's path data from Out of Scope's own drawing code.
// Loads the game build (out/test.html), injects the design-pass helpers (src/common.js, src/poster.js),
// calls suitB({emo}) for each emotion, POSTER.crt('x') for the cracked CRT and TUT_HAND for the player's hand,
// and parses every drawn element into {part, fill, stroke, sw, op, filter, sub:[flat points], closed:[...]}.
// Curves and arcs are flattened; straight segments keep their exact vertices; every transform is baked in
// (relative to the element's rig part). Writes work/living/geo.json.
// usage: node extract.mjs
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire('/home/claude/.npm-global/lib/node_modules/');
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');

const OUT = '/home/claude/designpass/work/living/geo.json';
const OK = JSON.parse(fs.readFileSync('/home/claude/designpass/work/living/ok.json', 'utf8')).d;
const exe = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium')).sort().map((d) => `/opt/pw-browsers/${d}/chrome-linux/chrome`).find((p) => fs.existsSync(p));
const b = await chromium.launch(exe ? { executablePath: exe, args: ['--enable-unsafe-swiftshader'] } : { args: ['--enable-unsafe-swiftshader'] });
const pg = await b.newPage({ viewport: { width: 1200, height: 900 } });
const errs = [];
pg.on('pageerror', (e) => errs.push('pageerror ' + e.message));
pg.on('console', (m) => { if (m.type() === 'error') errs.push('console ' + m.text()); });
await pg.goto('file:///home/claude/oos3/out/test.html');
await pg.waitForFunction('document.documentElement.dataset.ready', null, { timeout: 90000 });
await pg.evaluate(() => { try { Title.hide(); } catch (e) {} try { Sound.setSfx && Sound.setSfx(0); Sound.setMusic && Sound.setMusic(0); } catch (e) {} });
await pg.addScriptTag({ path: '/home/claude/designpass/src/common.js' });
await pg.addScriptTag({ path: '/home/claude/designpass/src/poster.js' });

const geo = await pg.evaluate((OKD) => {
  window.scrawl = () => '';
  const R2 = (v) => Math.round(v * 100) / 100;
  /* ---- a small SVG path parser: absolute polylines, curves flattened ---- */
  function parsePath(d) {
    const toks = d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g) || [];
    let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0, lcx = 0, lcy = 0, lqx = 0, lqy = 0, prev = '';
    const subs = []; let cur = null;
    const num = () => parseFloat(toks[i++]);
    const isNum = () => i < toks.length && !/^[a-zA-Z]$/.test(toks[i]);
    const start = (px, py) => { cur = { pts: [px, py], closed: false }; subs.push(cur); };
    const line = (px, py) => { if (!cur) start(x, y); cur.pts.push(px, py); };
    const cubic = (x1, y1, x2, y2, x3, y3) => {
      const L = Math.hypot(x1 - x, y1 - y) + Math.hypot(x2 - x1, y2 - y1) + Math.hypot(x3 - x2, y3 - y2);
      const n = Math.max(3, Math.min(48, Math.ceil(L / 2.2)));
      for (let k = 1; k <= n; k++) { const t = k / n, u = 1 - t; line(u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3, u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3); }
    };
    const quad = (x1, y1, x2, y2) => {
      const L = Math.hypot(x1 - x, y1 - y) + Math.hypot(x2 - x1, y2 - y1);
      const n = Math.max(3, Math.min(40, Math.ceil(L / 2.2)));
      for (let k = 1; k <= n; k++) { const t = k / n, u = 1 - t; line(u * u * x + 2 * u * t * x1 + t * t * x2, u * u * y + 2 * u * t * y1 + t * t * y2); }
    };
    const arc = (rx, ry, phi, fa, fs, x2, y2) => {
      if (rx === 0 || ry === 0) return line(x2, y2);
      rx = Math.abs(rx); ry = Math.abs(ry); const p = phi * Math.PI / 180, cp = Math.cos(p), sp = Math.sin(p);
      const dx = (x - x2) / 2, dy = (y - y2) / 2, x1p = cp * dx + sp * dy, y1p = -sp * dx + cp * dy;
      let lam = x1p * x1p / (rx * rx) + y1p * y1p / (ry * ry); if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
      const num2 = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p, den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
      let co = Math.sqrt(Math.max(0, num2 / den)); if (fa === fs) co = -co;
      const cxp = co * rx * y1p / ry, cyp = -co * ry * x1p / rx;
      const cx = cp * cxp - sp * cyp + (x + x2) / 2, cy = sp * cxp + cp * cyp + (y + y2) / 2;
      const ang = (ux, uy, vx, vy) => { const a = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy); return a; };
      const t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry); let dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
      if (!fs && dt > 0) dt -= 2 * Math.PI; else if (fs && dt < 0) dt += 2 * Math.PI;
      const n = Math.max(4, Math.ceil(Math.abs(dt) * Math.max(rx, ry) / 2.2));
      for (let k = 1; k <= n; k++) { const t = t1 + dt * k / n; line(cx + rx * Math.cos(t) * cp - ry * Math.sin(t) * sp, cy + rx * Math.cos(t) * sp + ry * Math.sin(t) * cp); }
    };
    while (i < toks.length) {
      if (/^[a-zA-Z]$/.test(toks[i])) cmd = toks[i++];
      const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase();
      if (C === 'Z') { if (cur) { cur.closed = true; x = sx; y = sy; } cur = null; prev = 'Z'; continue; }
      if (!isNum()) { i++; continue; }
      if (C === 'M') { let nx = num(), ny = num(); if (rel) { nx += x; ny += y; } x = sx = nx; y = sy = ny; start(x, y); cmd = rel ? 'l' : 'L'; prev = 'M'; continue; }
      if (C === 'L') { let nx = num(), ny = num(); if (rel) { nx += x; ny += y; } line(nx, ny); x = nx; y = ny; }
      else if (C === 'H') { let nx = num(); if (rel) nx += x; line(nx, y); x = nx; }
      else if (C === 'V') { let ny = num(); if (rel) ny += y; line(x, ny); y = ny; }
      else if (C === 'C') { let a = [num(), num(), num(), num(), num(), num()]; if (rel) a = a.map((v, k) => v + (k % 2 ? y : x)); cubic(...a); lcx = a[2]; lcy = a[3]; x = a[4]; y = a[5]; }
      else if (C === 'S') { let a = [num(), num(), num(), num()]; if (rel) a = a.map((v, k) => v + (k % 2 ? y : x)); const r1x = /[CS]/.test(prev) ? 2 * x - lcx : x, r1y = /[CS]/.test(prev) ? 2 * y - lcy : y; cubic(r1x, r1y, ...a); lcx = a[0]; lcy = a[1]; x = a[2]; y = a[3]; }
      else if (C === 'Q') { let a = [num(), num(), num(), num()]; if (rel) a = a.map((v, k) => v + (k % 2 ? y : x)); quad(...a); lqx = a[0]; lqy = a[1]; x = a[2]; y = a[3]; }
      else if (C === 'T') { let a = [num(), num()]; if (rel) a = [a[0] + x, a[1] + y]; const qx = /[QT]/.test(prev) ? 2 * x - lqx : x, qy = /[QT]/.test(prev) ? 2 * y - lqy : y; quad(qx, qy, a[0], a[1]); lqx = qx; lqy = qy; x = a[0]; y = a[1]; }
      else if (C === 'A') { const rx = num(), ry = num(), ph = num(), fa = num(), fs = num(); let nx = num(), ny = num(); if (rel) { nx += x; ny += y; } arc(rx, ry, ph, fa, fs, nx, ny); x = nx; y = ny; }
      prev = C;
    }
    return subs.filter((s) => s.pts.length >= 4);
  }
  const circ = (cx, cy, rx, ry) => { const n = Math.max(14, Math.min(64, Math.ceil(Math.max(rx, ry) * 1.3))); const p = []; for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2; p.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); } return [{ pts: p, closed: true }]; };
  const attr = (el, n) => { let e = el; while (e && e.getAttribute) { const v = e.getAttribute(n); if (v != null) return v; if (n !== 'fill' && n !== 'stroke' && n !== 'stroke-width' && n !== 'stroke-linecap' && n !== 'stroke-linejoin') return null; e = e.parentNode; } return null; };
  function opacityOf(el, stopAt) { let o = 1, e = el; while (e && e !== stopAt && e.getAttribute) { const v = e.getAttribute('opacity'); if (v != null) o *= parseFloat(v); e = e.parentNode; } return o; }
  function filterOf(el, stopAt) { let e = el; while (e && e !== stopAt && e.getAttribute) { const v = e.getAttribute('filter'); if (v) return v.replace(/url\(#|\)/g, ''); e = e.parentNode; } return null; }
  /* parse one svg string. partOf(el) names the rig part; frameOf(part) gives the element whose CTM is that part's origin */
  function parse(svgStr, partOf, frameOf) {
    const host = document.createElement('div'); host.style.cssText = 'position:absolute;left:0;top:0;visibility:hidden;pointer-events:none';
    host.innerHTML = svgStr; document.body.appendChild(host);
    const svg = host.querySelector('svg'); const vb = svg.viewBox.baseVal; svg.setAttribute('width', vb.width); svg.setAttribute('height', vb.height);
    const els = [...svg.querySelectorAll('path,circle,ellipse,rect,text,line,polyline,polygon')].filter((e) => !e.closest('defs') && !e.closest('clipPath'));
    const out = [];
    for (const el of els) {
      const part = partOf(el); if (!part) continue;
      let subs;
      const tag = el.tagName;
      if (tag === 'path') subs = parsePath(el.getAttribute('d'));
      else if (tag === 'circle') { const r = +el.getAttribute('r'); subs = circ(+el.getAttribute('cx'), +el.getAttribute('cy'), r, r); }
      else if (tag === 'ellipse') subs = circ(+el.getAttribute('cx'), +el.getAttribute('cy'), +el.getAttribute('rx'), +el.getAttribute('ry'));
      else if (tag === 'rect') { const x = +el.getAttribute('x') || 0, y = +el.getAttribute('y') || 0, w = +el.getAttribute('width'), h = +el.getAttribute('height'); subs = [{ pts: [x, y, x + w, y, x + w, y + h, x, y + h], closed: true }]; }
      else if (tag === 'text') { if (el.textContent.trim() !== 'OK') continue; subs = parsePath(OKD); }
      else continue;
      // transform relative to the part's frame
      const fr = frameOf(part, el); const M0 = fr ? fr.getCTM() : svg.getCTM(); const M1 = el.getCTM();
      const M = M0.inverse().multiply(M1);
      for (const s of subs) for (let k = 0; k < s.pts.length; k += 2) { const x = s.pts[k], y = s.pts[k + 1]; s.pts[k] = R2(M.a * x + M.c * y + M.e); s.pts[k + 1] = R2(M.b * x + M.d * y + M.f); }
      const fill = tag === 'text' ? el.getAttribute('fill') : attr(el, 'fill');
      const stroke = attr(el, 'stroke');
      const swRaw = attr(el, 'stroke-width');
      const scale = Math.sqrt(Math.abs(M.a * M.d - M.b * M.c));
      const e = { part, tag, d0: (el.getAttribute('d') || '').slice(0, 14), m: [M.a, M.b, M.c, M.d, M.e, M.f].map(R2) };
      if (fill && fill !== 'none') e.fill = fill;
      if (stroke && stroke !== 'none') { e.stroke = stroke; e.sw = R2((swRaw != null ? parseFloat(swRaw) : 1) * scale); e.cap = attr(el, 'stroke-linecap') || 'butt'; }
      const op = opacityOf(el, fr || svg); if (op !== 1) e.op = R2(op);
      const fo = el.getAttribute('fill-opacity'); if (fo != null) e.op = R2((e.op || 1) * parseFloat(fo));
      const f = filterOf(el, svg); if (f) e.filter = f;
      e.sub = subs.map((s) => s.pts); e.closed = subs.map((s) => s.closed ? 1 : 0);
      if (!e.fill && !e.stroke) e.fill = '#000';
      out.push(e);
    }
    host.remove();
    return out;
  }

  /* ---- Regent ---- */
  const REG = {};
  for (const emo of ['gleeful', 'shocked', 'furious', 'smug']) {
    const svgStr = suitB({ emo });
    let seenHead = false;
    const partOf = (el) => {
      if (el.closest('g.hat')) return 'hat';
      const sg = el.closest('g[transform^="translate(314 58)"]'); if (sg) return 'stamp';
      const d = el.getAttribute('d') || '';
      if (/^M298 84/.test(d)) return 'arm';
      if (/^M242 176|^M290 106/.test(d)) return 'arm';
      if (/^M100 176|^M70 284/.test(d)) return 'larm';
      if (/^M100 450|^M190 434|^M118 330/.test(d)) return 'legs';
      if (/^M106 130 C104 76/.test(d)) { seenHead = true; return 'head'; }
      return seenHead ? 'face' : 'torso';
    };
    const frameOf = (part, el) => part === 'hat' ? el.closest('g.hat') : part === 'stamp' ? el.closest('g[transform^="translate(314 58)"]') : null;
    REG[emo] = parse(svgStr, partOf, frameOf);
  }
  /* ---- the poster's CRT ---- */
  const crtStr = POSTER.crt('pg');
  const CRT = parse(crtStr, (el) => el.closest('g[clip-path]') ? null : 'crt', () => null).map((e) => { if (e.fill && /^url/.test(e.fill)) { e.grad = 1; delete e.fill; } return e; });
  /* ---- the tutorial hand (the player) ---- */
  const HAND = parse(TUT_HAND, () => 'hand', () => null);
  /* ---- one picto for the evidence slip (the 'fired' boot) ---- */
  const PIC = parse(picto('fired'), () => 'pic', () => null);
  return { REG, CRT, HAND, PIC, hatT: { gleeful: [0, -8], shocked: [-30, -14], furious: [0, 12], smug: [0, -8] } };
}, OK);
fs.writeFileSync(OUT, JSON.stringify(geo));
const n = (a) => a.length;
console.log('regent', Object.fromEntries(Object.entries(geo.REG).map(([k, v]) => [k, n(v)])), 'crt', n(geo.CRT), 'hand', n(geo.HAND), 'pic', n(geo.PIC));
console.log('errors', JSON.stringify(errs));
await b.close();
