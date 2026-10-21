#!/usr/bin/env python3
"""Build a 1440x900 test board for one living-board game module.
usage: python3 harness.py <key> <out_folder> [module.js]   (default module: modules/<key>.js next to this file)
writes <out_folder>/render/Harness<Key>.dc.html and copies tools/support.js beside it."""
import sys, os, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
key, out = sys.argv[1], sys.argv[2]
src = sys.argv[3] if len(sys.argv) > 3 else os.path.join(HERE, 'modules', key + '.js')
mod = open(src).read()
Key0 = key
Key = key[:1].upper() + key[1:] + (os.path.basename(os.path.dirname(os.path.abspath(sys.argv[3]))).capitalize() if len(sys.argv) > 3 else '')

PLATES = [  # id, x, y, w, h, label
  ('a', 40, 64, 760, 380, 'LIVE · hover me (react → enter → loop)'),
  ('b', 840, 64, 560, 380, 'AUTO · idle 3s → react → enter → loop'),
  ('c', 40, 488, 150, 370, 'TALL · idle, cursor near'),
  ('d', 230, 488, 270, 370, 'SQUEEZED · rants'),
  ('e', 540, 488, 420, 370, 'HITS · cue + hit every 3s'),
  ('f', 1000, 488, 400, 370, 'RESIZE · 120×90 ↔ 400×370'),
]
plates_html = '\n'.join(
  f'<div style="position: absolute; left: {x}px; top: {y-22}px; font: 400 10.5px/1 \'DM Mono\', monospace; letter-spacing: .06em; text-transform: uppercase; color: #ADA3CA">{lab}</div>'
  f'<div ref="{{{{w_{i}}}}}" onPointerMove="{{{{mv_{i}}}}}" onPointerLeave="{{{{lv_{i}}}}}" style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; overflow: hidden; outline: 1px solid #3B3247"><canvas ref="{{{{c_{i}}}}}" style="display: block"></canvas></div>'
  for i, x, y, w, h, lab in PLATES)
refs = ', '.join(f"w_{i}: this.r('w_{i}'), c_{i}: this.r('c_{i}'), mv_{i}: (e) => this.mv('{i}', e), lv_{i}: () => this.lv('{i}')" for i, *_ in PLATES)
plates_js = repr([dict(id=i, x=x, y=y, w=w, h=h) for i, x, y, w, h, _ in PLATES]).replace("'", '"')

html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Harness · {key}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&amp;family=DM+Mono:wght@400;500&amp;family=Instrument+Serif:ital@0;1&amp;display=swap">
<style>body{{margin:0;background:#141019}}</style>
</helmet>
<div style="position: relative; width: 1440px; height: 900px; background: #141019; color: #F1ECE4; font-family: 'Bricolage Grotesque', system-ui, sans-serif; overflow: hidden">
<div style="position: absolute; left: 40px; top: 18px; font: 700 18px/1 'Bricolage Grotesque', sans-serif">Harness · {key} <span style="font: 400 11px/1 'DM Mono', monospace; color: #ADA3CA; letter-spacing: .06em">{{{{meta}}}}</span></div>
{plates_html}
<canvas ref="{{{{ov}}}}" style="position: absolute; left: 0; top: 0; pointer-events: none"></canvas>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":1440,"height":900}}}}'>
const BUG_MODS = {{}};
{mod}
const PLATES = {plates_js};
class Component extends DCLogic {{
  constructor(p) {{ super(p); this.els = {{}}; this._r = {{}}; this.ptr = {{}}; }}
  r(n) {{ return this._r[n] || (this._r[n] = (el) => {{ this.els[n] = el; }}); }}
  mv(i, e) {{ const el = this.els['w_' + i]; if (!el) return; const b = el.getBoundingClientRect(); this.ptr[i] = {{ x: e.clientX - b.left, y: e.clientY - b.top }}; }}
  lv(i) {{ this.ptr[i] = null; }}
  componentDidMount() {{
    this.M = BUG_MODS['{key}'];
    if (!this.M) {{ console.error('module {key} not registered'); return; }}
    this.rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seed = 7; const rnd = () => {{ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }};
    this.flying = []; this.bubbles = [];
    this.P = PLATES.map((p) => {{
      const st = {{ id: p.id, p, mode: 'idle', m0: 0, w: p.w, h: p.h }};
      st.inst = this.M.create({{ rnd, emit: (evt) => this.emit(st, evt) }});
      return st;
    }});
    this.t0 = performance.now(); this.last = this.t0; this.mounted = true;
    const loop = (now) => {{ if (!this.mounted) return; try {{ this.tick(now); }} catch (err) {{ console.error(err); }} this.raf = requestAnimationFrame(loop); }};
    this.raf = requestAnimationFrame(loop);
    this.forceUpdate();
  }}
  componentWillUnmount() {{ this.mounted = false; cancelAnimationFrame(this.raf); }}
  emit(st, evt) {{
    if (evt.type === 'throw') {{
      const s = st.p, tgt = this.P.find((q) => q.id === 'b');
      const x0 = s.x + (evt.x || s.w / 2), y0 = s.y + (evt.y || s.h / 2);
      const x1 = tgt.p.x + tgt.w * 0.5, y1 = tgt.p.y + tgt.h * 0.6;
      this.flying.push({{ item: evt.item, x0, y0, x1, y1, t: 0, to: tgt }});
    }} else if (evt.type === 'shout') this.bubble(st, evt.text);
  }}
  bubble(st, text) {{ const a = (st.inst.anchor && st.inst.anchor()) || {{ x: 0.5, y: 0.4 }}; this.bubbles.push({{ st, text: String(text || ''), a, t: 0 }}); }}
  size(st, w, h) {{
    const cv = this.els['c_' + st.id], wrap = this.els['w_' + st.id]; if (!cv || !wrap) return null;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (st.cw !== w || st.ch !== h) {{ st.cw = w; st.ch = h; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); cv.style.width = w + 'px'; cv.style.height = h + 'px'; wrap.style.width = w + 'px'; wrap.style.height = h + 'px'; }}
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); return ctx;
  }}
  setMode(st, m, t) {{ if (st.mode !== m) {{ st.mode = m; st.m0 = t; }} }}
  tick(now) {{
    const t = (now - this.t0) / 1000, dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
    for (const st of this.P) {{
      let w = st.p.w, h = st.p.h, near = 0, hover = null, squeeze = 0, grow = 0;
      if (st.id === 'a') {{
        hover = this.ptr.a || null;
        if (hover) {{ const mt = t - st.m0; if (st.mode === 'idle') this.setMode(st, 'react', t); else if (st.mode === 'react' && mt > 0.8) this.setMode(st, 'enter', t); else if (st.mode === 'enter' && mt > 0.7) this.setMode(st, 'loop', t); grow = 1; }}
        else this.setMode(st, 'idle', t);
      }} else if (st.id === 'b') {{
        const c = t % 13; const m = c < 3 ? 'idle' : c < 3.8 ? 'react' : c < 4.5 ? 'enter' : c < 12 ? 'loop' : 'idle';
        if (st.mode !== m) {{ st.mode = m; st.m0 = t; }} grow = m === 'idle' ? 0 : 1;
        if (m !== 'idle') hover = {{ x: w * (0.5 + 0.2 * Math.sin(t)), y: h * 0.5 }};
      }} else if (st.id === 'c') {{ near = 0.5 + 0.5 * Math.sin(t * 0.9); }}
      else if (st.id === 'd') {{ const q = 0.5 - 0.5 * Math.cos(t * 0.8); squeeze = q; w = Math.round(270 - 150 * q); h = Math.round(370 - 90 * q); this.setMode(st, q > 0.15 ? 'squeezed' : 'idle', t);
        if (st.mode === 'squeezed' && (!st.lastRant || t - st.lastRant > 3.2)) {{ st.lastRant = t; const R = this.M.rants || ['HEY!']; this.bubble(st, R[Math.floor(t / 3.2) % R.length]); }} }}
      else if (st.id === 'e') {{
        const k = Math.floor(t / 3);
        if (k !== st.k) {{ st.k = k;
          if (k % 2) {{ st.inst.on && st.inst.on({{ type: 'cue' }}); }}
          else {{ const items = Object.keys(this.M.items || {{}}); const x = w * (0.25 + 0.5 * ((k * 37) % 10) / 10), y = h * 0.45;
            this.flying.push({{ item: items[0], x0: st.p.x - 60, y0: st.p.y - 40, x1: st.p.x + x, y1: st.p.y + y, t: 0, to: st }}); }} }}
      }} else if (st.id === 'f') {{ const q = 0.5 - 0.5 * Math.cos(t * 0.5); w = Math.round(120 + 280 * q); h = Math.round(90 + 280 * q); }}
      st.w = w; st.h = h;
      const ctx = this.size(st, w, h); if (!ctx) continue;
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
      st.inst.frame(ctx, {{ w, h, t: this.rm ? 0 : t, dt, mode: this.rm ? 'idle' : st.mode, mt: this.rm ? 0 : t - st.m0, near, hover, grow, squeeze, rm: !!this.rm }});
      ctx.restore();
    }}
    this.overlay(dt);
  }}
  overlay(dt) {{
    const cv = this.els.ov; if (!cv) return; const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== 1440 * dpr) {{ cv.width = 1440 * dpr; cv.height = 900 * dpr; cv.style.width = '1440px'; cv.style.height = '900px'; }}
    const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, 1440, 900);
    this.flying = this.flying.filter((f) => {{
      f.t += dt / 0.6; const q = Math.min(1, f.t), x = f.x0 + (f.x1 - f.x0) * q, y = f.y0 + (f.y1 - f.y0) * q - Math.sin(q * Math.PI) * 90;
      const draw = this.M.items && this.M.items[f.item];
      if (draw) {{ c.save(); draw(c, x, y, f.t, Math.atan2(f.y1 - f.y0, f.x1 - f.x0) + q * 6); c.restore(); }}
      if (q >= 1) {{ const st = f.to; st.inst.on && st.inst.on({{ type: 'hit', item: f.item, from: '{key}', x: f.x1 - st.p.x, y: f.y1 - st.p.y }}); const H = this.M.hits || ['OW!']; this.bubble(st, H[Math.floor(Math.random() * H.length)]); return false; }}
      return true;
    }});
    this.bubbles = this.bubbles.filter((b) => {{
      b.t += dt; if (b.t > 1.8) return false;
      const st = b.st, x = st.p.x + b.a.x * st.w, y = st.p.y + b.a.y * st.h - 18;
      c.font = "800 15px 'Bricolage Grotesque', sans-serif"; const tw = c.measureText(b.text).width, bw = tw + 22, bh = 30;
      const bx = Math.max(4, Math.min(1436 - bw, x - bw * 0.3)), by = Math.max(4, y - bh - 12);
      const pop = b.t < 0.06 ? 1.15 : 1;
      c.save(); c.translate(bx + bw / 2, by + bh / 2); c.scale(pop, pop); c.translate(-bx - bw / 2, -by - bh / 2);
      c.fillStyle = '#1A1220'; c.fillRect(bx + 4, by + 4, bw, bh);
      c.fillStyle = '#F1ECE4'; c.fillRect(bx, by, bw, bh); c.strokeStyle = '#1A1220'; c.lineWidth = 2; c.strokeRect(bx, by, bw, bh);
      c.beginPath(); c.moveTo(bx + bw * 0.3 - 6, by + bh); c.lineTo(x, y); c.lineTo(bx + bw * 0.3 + 8, by + bh); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#1A1220'; c.textBaseline = 'middle'; c.fillText(b.text, bx + 11, by + bh / 2 + 1); c.restore();
      return true;
    }});
  }}
  renderVals() {{
    const M = this.M; const meta = M ? (M.no + ' · ' + M.title + ' · ' + M.kind + ' · ' + M.verb) : '';
    return {{ meta, ov: this.r('ov'), {refs} }};
  }}
}}
</script>
</body>
</html>
'''
os.makedirs(os.path.join(out, 'render'), exist_ok=True)
open(os.path.join(out, 'render', f'Harness{Key}.dc.html'), 'w').write(html)
sup = os.path.join(HERE, 'tools', 'support.js')
if os.path.exists(sup):
    shutil.copyfile(sup, os.path.join(out, 'render', 'support.js'))
print('wrote', os.path.join(out, 'render', f'Harness{Key}.dc.html'))
