"""rhythm.py OUTDIR : runs idle for 90 s and the loop for 2 cycles, hashing every frame (test only) to measure
holds (runs of identical frames), live stretches, the loop's seam, and the frame's mean luma over time (no flashes)."""
import asyncio, json, os, sys
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = sys.argv[1]
def runs(h):
    seg, cur, n = [], None, 0
    for i in range(1, len(h)):
        same = h[i] == h[i - 1]
        if same == cur: n += 1
        else:
            if cur is not None: seg.append((cur, n)); cur, n = same, 1
            else: cur, n = same, 1
    seg.append((cur, n)); return seg
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page()
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        await pg.goto('file://' + os.path.join(HERE, 'plate.html'))
        rep = {}
        for seed in (7, 11, 23, 5, 99):
            r = await pg.evaluate('(o) => window.run(o)', dict(w=240, h=120, seed=seed, hash=True, noImage=True, steps=[dict(mode='idle', dur=90.0)]))
            seg = runs(r['hashes'])
            # a hold: >= 0.5 s of identical frames; live: everything between holds
            # a hold: >= 1.4 s of identical frames (the poster's frame); live: the time between two holds; still: the longest still run inside live
            holds, lives, acc, still, st = [], [], 0, [], 0
            for same, n in seg:
                if same and n >= 84:
                    if acc: lives.append(round(acc / 60, 2)); still.append(round(st / 60, 2))
                    holds.append(round(n / 60, 2)); acc = 0; st = 0
                else:
                    acc += n
                    if same: st = max(st, n)
            lives = lives[1:]  # the first entry is the board's first frame before the opening hold
            rep[f'idle_seed{seed}'] = dict(holds_s=holds, live_s=lives, longest_still_in_live_s=max(still) if still else 0)
        r = await pg.evaluate('(o) => window.run(o)', dict(w=480, h=240, hash=True, noImage=True, steps=[dict(mode='idle', dur=.3), dict(mode='react', dur=.8), dict(mode='enter', dur=.7), dict(mode='loop', dur=14.4)]))
        lum = r['lum']; n0 = int(round((.3 + .8 + .7) * 60))
        L = lum[n0:]; per = 432
        seam = [abs(L[i] - L[i + per]) for i in range(len(L) - per)]
        jumps = [round(abs(L[i + 1] - L[i]), 4) for i in range(len(L) - 1)]
        rep['loop'] = dict(luma_min=round(min(L), 4), luma_max=round(max(L), 4), luma_idle=round(lum[5], 4), max_frame_jump=max(jumps), seam_repeat_maxdiff=round(max(seam), 5),
                           hash_repeats=sum(1 for i in range(len(r['hashes']) - n0 - per) if r['hashes'][n0 + i] == r['hashes'][n0 + i + per]), frames_compared=len(r['hashes']) - n0 - per)
        json.dump(dict(rep=rep, lum_loop=[round(v, 4) for v in L], errors=errs), open(os.path.join(OUT, 'rhythm.json'), 'w'))
        print(json.dumps(rep, indent=1)); print('errors', errs[:5])
        await b.close()
asyncio.run(main())
