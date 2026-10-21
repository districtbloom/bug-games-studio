"""nearest free colour (dmin >= 21 to ember, lilac, sun, mint) to each target: python3 -I freenear.py <pack tools> '#hex' ..."""
import sys, math
sys.path.insert(0, sys.argv[1])
import measure as M
P = [M.lab(v) for v in M.PLATFORM.values()]
def dmin(lab): return min(M.de2000(p, lab) for p in P)
for t in sys.argv[2:]:
    tl = M.lab(t); best = None
    r0, g0, b0 = [int(t[i:i + 2], 16) for i in (1, 3, 5)]
    for dr in range(-64, 65, 4):
        for dg in range(-64, 65, 4):
            for db in range(-64, 65, 4):
                r, g, b = r0 + dr, g0 + dg, b0 + db
                if not (0 <= r < 256 and 0 <= g < 256 and 0 <= b < 256): continue
                h = '#%02x%02x%02x' % (r, g, b); l = M.lab(h)
                if dmin(l) < 21: continue
                d = M.de2000(tl, l)
                if best is None or d < best[0]: best = (d, h)
    print(t, '->', best[1] if best else None, 'dE %.1f' % best[0] if best else '')
