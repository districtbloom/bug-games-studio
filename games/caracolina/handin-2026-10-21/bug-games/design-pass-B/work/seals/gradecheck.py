import sys
sys.path.insert(0, sys.argv[1])
import measure as M
P = {k: M.lab(v) for k, v in M.PLATFORM.items()}
def grade(h, a, B, kk, dd, ds_):
    r, g, b = [int(h[i:i+2], 16) for i in (1, 3, 5)]
    k = kk * a; dim = 1 - dd * a; L = .3*r + .59*g + .11*b; ds = ds_ * a
    r += (L - r) * ds; g += (L - g) * ds; b += (L - b) * ds
    return '#%02x%02x%02x' % tuple(max(0, min(255, round(v))) for v in ((r + (B[0]-r)*k)*dim, (g + (B[1]-g)*k)*dim, (b + (B[2]-b)*k)*dim))
cols = ['#fbf8f1', '#f7f4ee', '#f3ead7', '#e28d9a', '#f3d9d0', '#c4e153', '#f6f4dc', '#e8b4b8', '#e3aaa6', '#b9768a', '#fdf8f0', '#4f94dc', '#e0689a', '#e27b98', '#efe6d4', '#fff7ee']
for B in [(26, 36, 96), (28, 40, 100), (24, 34, 90)]:
  for kk, dd, ds in [(.5, .3, .35), (.55, .3, .4), (.5, .34, .4)]:
    worst = []
    for a in (.7, .85, 1):
        for c in cols:
            gcol = grade(c, a, B, kk, dd, ds); l = M.lab(gcol)
            d = {n: M.de2000(p, l) for n, p in P.items()}; n = min(d, key=d.get)
            if d[n] < 20: worst.append(f'{c}@{a}->{gcol} {n} {d[n]:.1f}')
    print(B, kk, dd, ds, len(worst), worst[:6])
