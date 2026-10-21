// Deterministic test driver for the Caracolina living poster (tool code; Playwright + Chromium).
// usage: node lp.mjs <module.js> <specs.json> <outdir>
//   spec: {name, w, h, dpr?, rm?, seq:[{mode, dur, near?, squeeze?, hover?:[fx,fy]}], events?:[{at, evt}], time?:'600x400'}
// Every frame is drawn at 60 fps from t=0 so the state is exactly what the board would show.
import fs from 'fs'; import path from 'path';
const [modPath, specPath, outDir] = process.argv.slice(2);
const pw = await import('/home/claude/.npm-global/lib/node_modules/playwright/index.mjs');
const chromium = pw.chromium || pw.default.chromium;
const mod = fs.readFileSync(modPath, 'utf8');
const specs = JSON.parse(fs.readFileSync(specPath, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });
const b = await chromium.launch();
const pg = await b.newPage();
const errs = [];
pg.on('pageerror', (e) => errs.push('pageerror: ' + e.message)); pg.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
await pg.setContent('<!doctype html><html><body style="margin:0;background:#141019"></body></html>');
await pg.addScriptTag({ content: 'const BUG_MODS = {};\n' + mod + '\nwindow.__M = BUG_MODS.caracolina;' });
await pg.evaluate(() => {
  window.__run = (spec) => {
    const M = window.__M; let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const emits = []; const inst = M.create({ rnd, emit: (e) => emits.push(e) });
    const dpr = spec.dpr || 1, cv = document.createElement('canvas'); cv.width = Math.round(spec.w * dpr); cv.height = Math.round(spec.h * dpr);
    const ctx = cv.getContext('2d');
    let t = 0, fr = 0; const dt = 1 / 60; const ev = (spec.events || []).slice();
    const draw = (s) => { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, s.w, s.h); ctx.clip(); inst.frame(ctx, s); ctx.restore(); };
    if (spec.rm) { draw({ w: spec.w, h: spec.h, t: 0, dt: 0, mode: 'idle', mt: 0, near: 0, hover: null, grow: 0, squeeze: 0, rm: true }); }
    else for (const st of spec.seq) {
      const n = Math.max(1, Math.round(st.dur / dt));
      for (let i = 0; i < n; i++) {
        while (ev.length && ev[0].at <= t) inst.on(ev.shift().evt);
        const w = st.w || spec.w, h = st.h || spec.h;
        draw({ w, h, t, dt, mode: st.mode, mt: i * dt, near: st.near || 0, hover: st.hover ? { x: st.hover[0] * w, y: st.hover[1] * h } : null, grow: 0, squeeze: st.squeeze || 0, rm: false });
        t += dt; fr++;
        if (spec.snaps && spec.snaps.length && t >= spec.snaps[0] - 1e-9) { spec.snaps.shift(); (window.__snaps = window.__snaps || []).push(cv.toDataURL('image/png')); }
      }
    }
    return { url: cv.toDataURL('image/png'), emits: emits.length, anchor: inst.anchor() };
  };
  window.__time = (w, h, mode, n, flush) => {
    const M = window.__M; let seed = 9; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const inst = M.create({ rnd, emit: () => {} }); const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const ctx = cv.getContext('2d');
    let t = 0; const run = (k) => { const out = []; for (let i = 0; i < k; i++) { const a = performance.now(); inst.frame(ctx, { w, h, t, dt: 1 / 60, mode, mt: t, near: 0.3, hover: mode === 'idle' ? null : { x: w * 0.4, y: h * 0.5 }, grow: 0, squeeze: mode === 'squeezed' ? 0.6 : 0, rm: false }); if (flush) ctx.getImageData(0, 0, 1, 1); out.push(performance.now() - a); t += 1 / 60; } return out; };
    run(60); ctx.getImageData(0, 0, 1, 1);
    const t0 = performance.now(); const v = run(n); ctx.getImageData(0, 0, 1, 1); const tot = performance.now() - t0; v.sort((p, q) => p - q);
    return { amortized: +(tot / n).toFixed(3), median: v[v.length >> 1], p95: v[Math.floor(v.length * 0.95)] };
  };
});
const report = {};
for (const s of specs) {
  if (s.time) { const [w, h] = s.time.split('x').map(Number); report[s.name] = await pg.evaluate(([w, h, m, f]) => window.__time(w, h, m, 200, f), [w, h, s.mode || 'idle', !!s.flush]); continue; }
  await pg.evaluate(() => { window.__snaps = []; });
  const r = await pg.evaluate((sp) => window.__run(sp), s);
  const snaps = await pg.evaluate(() => window.__snaps);
  snaps.forEach((u, i) => fs.writeFileSync(path.join(outDir, s.name + '_s' + String(i).padStart(2, '0') + '.png'), Buffer.from(u.split(',')[1], 'base64')));
  fs.writeFileSync(path.join(outDir, s.name + '.png'), Buffer.from(r.url.split(',')[1], 'base64'));
  report[s.name] = { emits: r.emits, anchor: r.anchor };
}
console.log(JSON.stringify(report));
console.log('errors', JSON.stringify(errs));
await b.close();
