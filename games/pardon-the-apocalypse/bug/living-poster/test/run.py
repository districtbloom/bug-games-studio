"""run.py OUTDIR [scenario-set]   Drive test/plate.html in headless Chromium (Python Playwright) and save PNGs.
Sets: shots (every mode, every plate shape), poster (the reduced-motion frame at 1920x960), time (frame timing), all.
Prints console/page errors; exits 3 if there were any."""
import asyncio, base64, json, os, sys
from playwright.async_api import async_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]
SET = sys.argv[2] if len(sys.argv) > 2 else 'all'
os.makedirs(OUT, exist_ok=True)

def idle(d, **k): return dict(mode='idle', dur=d, **k)
def seq(*names_durs): return [dict(mode=m, dur=d) for m, d in names_durs]
HOVER = [('idle', .5), ('react', .8), ('enter', .7)]

SHOTS = {
  # the held frame on the board's common shapes
  'held_760x380': dict(w=760, h=380, steps=[idle(.5)]),
  'held_900x640': dict(w=900, h=640, steps=[idle(.5)]),
  'held_560x380': dict(w=560, h=380, steps=[idle(.5)]),
  'held_420x370': dict(w=420, h=370, steps=[idle(.5)]),
  'held_270x370': dict(w=270, h=370, steps=[idle(.5)]),
  'held_150x370': dict(w=150, h=370, steps=[idle(.5)]),
  'held_140x305': dict(w=140, h=305, steps=[idle(.5)]),
  'held_577x163': dict(w=577, h=163, steps=[idle(.5)]),
  'held_900x200': dict(w=900, h=200, steps=[idle(.5)]),
  'held_120x90': dict(w=120, h=90, steps=[idle(.5)]),
  'held_200x150': dict(w=200, h=150, steps=[idle(.5)]),
  'held_400x370': dict(w=400, h=370, steps=[idle(.5)]),
  'held_760x380_dpr2': dict(w=760, h=380, dpr=2, steps=[idle(.5)]),
  'held_150x370_dpr2': dict(w=150, h=370, dpr=2, steps=[idle(.5)]),
  # idle life (seeded): after the first hold, the live beats
  **{f'idle_760_t{int(t*10):03d}': dict(w=760, h=380, steps=[idle(t)]) for t in [2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.5, 11.0]},
  'idle_near': dict(w=760, h=380, steps=[idle(5.0), dict(mode='idle', dur=1.0, near=.6)]),
  'idle_near_hi': dict(w=760, h=380, steps=[idle(5.0), dict(mode='idle', dur=1.0, near=.95)]),
  # react / enter
  **{f'react_{int(t*100):03d}': dict(w=760, h=380, steps=[idle(.5), dict(mode='react', dur=t)]) for t in [.05, .12, .25, .5, .79]},
  **{f'enter_{int(t*100):03d}': dict(w=760, h=380, steps=[idle(.5), dict(mode='react', dur=.8), dict(mode='enter', dur=t)]) for t in [.1, .25, .4, .55, .69]},
  # the loop
  **{f'loop_{int(t*100):03d}': dict(w=760, h=380, steps=[idle(.5), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=t)]) for t in [.1, .4, 1.1, 1.6, 2.0, 2.7, 3.2, 3.5, 3.85, 4.15, 4.6, 5.4, 6.1, 6.6, 7.0, 7.19]},
  'loop_900x640_330': dict(w=900, h=640, steps=[idle(.5), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=3.3)]),
  'loop_900x640_440': dict(w=900, h=640, steps=[idle(.5), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=4.4)]),
  **{f'loopN_150x370_{int(t*100):03d}': dict(w=150, h=370, steps=[idle(.5), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=t)]) for t in [.3, 1.6, 2.6, 3.05, 3.5, 4.3, 5.5, 6.6]},
  'loop_560x380_220': dict(w=560, h=380, steps=[idle(.5), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=2.2)]),
  # the largest scale (900x640 at dpr 2: 10 device px a pixel) for the guarded-colour audit
  **{f'big_loop_{int(t*100):03d}': dict(w=900, h=640, dpr=2, steps=[idle(.5), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=t)]) for t in [.3, 1.1, 3.3, 3.8, 4.4, 5.3, 6.6]},
  'big_held': dict(w=900, h=640, dpr=2, steps=[idle(.5)]),
  'big_squeezed': dict(w=420, h=640, dpr=2, steps=[idle(.5), dict(mode='squeezed', dur=2.0, squeeze=.8)]),
  # back to idle after the loop: the settle
  **{f'settle_{int(t*100):03d}': dict(w=760, h=380, steps=[idle(.5), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=2.5), dict(mode='idle', dur=t)]) for t in [.15, .3, .5, 1.2]},
  # squeezed: a neighbour opens
  **{f'squeezed_{int(q*100):03d}_{int(mt*10)}': dict(w=int(270 - 150 * q), h=int(370 - 90 * q), steps=[idle(.5), dict(mode='squeezed', dur=mt, squeeze=q)]) for q, mt in [(.2, .3), (.5, 1.0), (.8, 2.0), (1.0, 2.1), (.8, 3.0)]},
  # a plate resizing (the harness's RESIZE plate, 120x90 <-> 400x370) and a squeeze in progress
  **{f'resize_{i}': dict(w=400, h=370, steps=[dict(mode='idle', dur=t, resize=[120, 90, 400, 370, 12.0])]) for i, t in enumerate([.5, 1.5, 2.5, 3.5, 4.5, 6.0])},
  # board events in idle
  'ev_cue_070': dict(w=420, h=370, steps=[idle(3.0), dict(mode='idle', dur=.7, on={'type': 'cue'})]),
  'ev_cue_100': dict(w=420, h=370, steps=[idle(3.0), dict(mode='idle', dur=1.0, on={'type': 'cue'})]),
  'ev_hit_020': dict(w=420, h=370, steps=[idle(3.0), dict(mode='idle', dur=.2, on={'type': 'hit', 'item': 'clip', 'from': 'carbon', 'x': 120, 'y': 150})]),
  'ev_hit_080': dict(w=420, h=370, steps=[idle(3.0), dict(mode='idle', dur=.8, on={'type': 'hit', 'item': 'clip', 'from': 'carbon', 'x': 120, 'y': 150})]),
  'ev_look_left': dict(w=420, h=370, steps=[idle(3.0), dict(mode='idle', dur=.8, on={'type': 'look', 'dx': -1, 'dy': 0})]),
  'ev_look_right': dict(w=420, h=370, steps=[idle(3.0), dict(mode='idle', dur=.8, on={'type': 'look', 'dx': 1, 'dy': 0})]),
  'ev_shake': dict(w=420, h=370, steps=[idle(3.0), dict(mode='idle', dur=.15, on={'type': 'shake', 'amount': 1})]),
  # odd plates: very small, fractional device ratios, larger than the board's range
  'odd_60x40': dict(w=60, h=40, steps=[idle(.5)]),
  'odd_1200x800_dpr1.5': dict(w=1200, h=800, dpr=1.5, steps=[idle(.5), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=1.0)]),
  'odd_333x777_dpr1.25': dict(w=333, h=777, dpr=1.25, steps=[idle(.5), dict(mode='squeezed', dur=1.0, squeeze=.5)]),
  'odd_1000x150': dict(w=1000, h=150, steps=[idle(.5), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=3.3)]),
  # the one throwable (drawn by the board's overlay)
  'item_egg': dict(w=300, h=60, items=[0, .8, 1.6, 2.4, 3.2, 4.0, 4.8]),
  'item_egg_dpr2': dict(w=300, h=60, dpr=2, items=[0, .8, 1.6, 2.4, 3.2, 4.0, 4.8]),
  # back to the poster after a hover: settle, one lob, the hold
  **{f'back_{int(t*100):03d}': dict(w=760, h=380, steps=[idle(.5), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=2.5), dict(mode='idle', dur=t)]) for t in [.8, 1.3, 1.7, 2.5]},
  # reduced motion (any mode shows the held still)
  'rm_760x380_loop': dict(w=760, h=380, rm=True, steps=[dict(mode='loop', dur=2.0)]),
  'rm_150x370': dict(w=150, h=370, rm=True, steps=[dict(mode='idle', dur=.3)]),
  # without OffscreenCanvas (fallback path)
  'fallback_760x380': dict(w=760, h=380, noOffscreen=True, steps=[idle(.5)]),
  'fallback_loop_760x380': dict(w=760, h=380, noOffscreen=True, steps=[idle(.5), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=3.3)]),
}
POSTER = {'rm_1920x960': dict(w=1920, h=960, rm=True, steps=[dict(mode='idle', dur=.1)]),
          'rm_720x1080': dict(w=720, h=1080, rm=True, steps=[dict(mode='idle', dur=.1)]),
          'rm_816x816': dict(w=816, h=816, rm=True, steps=[dict(mode='idle', dur=.1)])}
# timing: 600x400 at dpr 1 and 2, every mode, many frames; also a continuously resizing plate (squeeze)
TIME = {
  'flush_idle': dict(w=600, h=400, flush=True, noImage=True, steps=[idle(12.0)]),
  'flush_loop': dict(w=600, h=400, flush=True, noImage=True, steps=[idle(.2), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=14.4)]),
  'flush_loop_dpr2': dict(w=600, h=400, dpr=2, flush=True, noImage=True, steps=[idle(.2), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=7.2)]),
  'flush_squeeze': dict(w=600, h=400, flush=True, noImage=True, steps=[idle(.2), dict(mode='squeezed', dur=6.0, squeeze=.6)]),
  'flush_resize': dict(w=600, h=400, flush=True, noImage=True, steps=[dict(mode='idle', dur=8.0, resize=[600, 400, 300, 380, 4.0])]),
  'flush_squeezing': dict(w=270, h=370, flush=True, noImage=True, steps=[dict(mode='squeezed', dur=8.0, squeeze=.6, resize=[270, 370, 120, 280, 4.0])]),
  'flush_baseline': dict(w=600, h=400, flush=True, baseline=True, noImage=True, steps=[dict(mode='idle', dur=4.0)]),
  'time_idle': dict(w=600, h=400, noImage=True, steps=[idle(12.0)]),
  'time_loop': dict(w=600, h=400, noImage=True, steps=[idle(.2), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=14.4)]),
  'time_loop_dpr2': dict(w=600, h=400, dpr=2, noImage=True, steps=[idle(.2), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=14.4)]),
  'time_idle_dpr2': dict(w=600, h=400, dpr=2, noImage=True, steps=[idle(12.0)]),
  'time_squeeze': dict(w=600, h=400, noImage=True, steps=[idle(.2), dict(mode='squeezed', dur=6.0, squeeze=.6)]),
  'time_fallback': dict(w=600, h=400, noOffscreen=True, noImage=True, steps=[idle(.2), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=7.2)]),
}


async def main():
    sets = {'shots': SHOTS, 'poster': POSTER, 'time': TIME}
    todo = {}
    for k, v in sets.items():
        if SET in (k, 'all'): todo.update(v)
    if SET not in sets and SET != 'all': todo = {k: v for k, v in SHOTS.items() if k.startswith(SET)}
    errs, report = [], {}
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, sc in todo.items():
            ctx = await b.new_context(viewport={'width': max(sc['w'], 200), 'height': max(sc['h'], 200)}, device_scale_factor=1)
            pg = await ctx.new_page()
            pg.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
            pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
            await pg.route('**/*', lambda r: r.continue_() if r.request.url.startswith('file://') else r.abort())
            await pg.goto('file://' + os.path.join(HERE, 'plate.html'))
            res = await pg.evaluate('(o) => window.run(o)', sc)
            if res['url']:
                open(os.path.join(OUT, name + '.png'), 'wb').write(base64.b64decode(res['url'].split(',')[1]))
            t = sorted(res['times'])
            warm = res['times'][30:] or res['times']
            ws = sorted(warm)
            report[name] = dict(frames=res['frames'], mean=round(sum(warm) / len(warm), 3), p50=round(ws[len(ws) // 2], 3), p95=round(ws[int(len(ws) * .95)], 3), max=round(ws[-1], 3), first=round(res['times'][0], 2), emits=res['emits'], anchor=res['anchor'])
            await ctx.close()
        await b.close()
    json.dump(report, open(os.path.join(OUT, f'report_{SET}.json'), 'w'), indent=1)
    for k, v in report.items():
        print(f"{k:28s} frames {v['frames']:4d}  mean {v['mean']:.3f} ms  p50 {v['p50']:.3f}  p95 {v['p95']:.3f}  max {v['max']:.2f}  first {v['first']}  emits {len(v['emits'])}  anchor {v['anchor']['x']:.2f},{v['anchor']['y']:.2f}")
    print('errors', json.dumps(errs[:10]))
    sys.exit(3 if errs else 0)

asyncio.run(main())
