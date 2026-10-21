"""inview.py OUTDIR   Is Wren inside the plate in every frame? Drives test/plate.html (dt = 1/60) and reads the module's
box() hook (Wren's sprite box in plate px) every frame: two full loops after react and enter, then the settle back,
20 s of idle with board events, and a squeeze. Sizes: the narrow plates from the review (150x370, 140x305, 120x300),
the very wide 1000x150, and a plate squeezing from 270x370 to 120x280. Writes OUTDIR/inview.json; exits 4 on any miss."""
import asyncio, json, os, sys
from playwright.async_api import async_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
EV = [[1.0, {'type': 'cue'}], [4.0, {'type': 'hit', 'kind': 'burst', 'x': 20, 'y': 40}], [7.0, {'type': 'shake', 'amount': 1}], [10.0, {'type': 'hit', 'kind': 'grab', 'x': 5, 'y': 60}],
      [13.0, {'type': 'hit', 'kind': 'shoot', 'x': 10, 'y': 30}], [16.0, {'type': 'look', 'dx': -1, 'dy': 0}]]
def run_for(w, h, resize=None):
    hov = [dict(mode='idle', dur=.5), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=14.0), dict(mode='idle', dur=3.0)]
    rest = [dict(mode='idle', dur=20.0, onAt=EV), dict(mode='squeezed', dur=4.0, squeeze=.9)]
    if resize: rest[-1]['resize'] = resize
    return dict(w=w, h=h, boxes=True, noImage=True, steps=hov + rest)
CASES = {'150x370': run_for(150, 370), '140x305': run_for(140, 305), '120x300': run_for(120, 300), '1000x150': run_for(1000, 150),
         '150x370_dpr2': dict(run_for(150, 370), dpr=2), 'squeezing_270x370_to_120x280': run_for(270, 370, [270, 370, 120, 280, 2.0])}

async def main():
    rep, errs, bad = {}, [], 0
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, sc in CASES.items():
            ctx = await b.new_context(viewport={'width': max(sc['w'], 200), 'height': max(sc['h'], 200)})
            pg = await ctx.new_page()
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
            await pg.goto('file://' + os.path.join(HERE, 'plate.html'))
            res = await pg.evaluate('(o) => window.run(o)', sc)
            by = {}
            for mode, mt, x0, y0, x1, y1, ww, hh, pose, ax, ay in res['boxes']:
                r = by.setdefault(mode, dict(frames=0, out=0, minL=1e9, minR=1e9, minT=1e9, minB=1e9, anchorOut=0, union=[1e9, 1e9, -1e9, -1e9], size=[ww, hh]))
                r['frames'] += 1; u = r['union']; u[0], u[1], u[2], u[3] = min(u[0], x0), min(u[1], y0), max(u[2], x1), max(u[3], y1)
                L, R, T, B = x0, ww - x1, y0, hh - y1
                r['minL'], r['minR'], r['minT'], r['minB'] = min(r['minL'], L), min(r['minR'], R), min(r['minT'], T), min(r['minB'], B)
                if min(L, R, T, B) < -0.01: r['out'] += 1
                if not (0 <= ax <= 1 and 0 <= ay <= 1): r['anchorOut'] += 1
            for r in by.values():
                for k in ('minL', 'minR', 'minT', 'minB'): r[k] = round(r[k], 1)
                bad += r['out']
            rep[name] = by
            await ctx.close()
        await b.close()
    json.dump(rep, open(os.path.join(OUT, 'inview.json'), 'w'), indent=1)
    for name, by in rep.items():
        print(name)
        for mode, r in by.items(): print(f"  {mode:9s} frames {r['frames']:5d}  out of view {r['out']}  min margin L {r['minL']} R {r['minR']} T {r['minT']} B {r['minB']} px")
    print('frames with Wren out of view:', bad, '| errors', errs[:5])
    sys.exit(4 if bad or errs else 0)

asyncio.run(main())
