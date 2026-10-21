"""largest share of guarded pixels (dE2000 < 12 to ember, lilac, sun, mint) in any 24x24 window: python3 -I guard_block.py <pack tools> imgs..."""
import sys
sys.path.insert(0, sys.argv[1])
import measure
from PIL import Image
for f in sys.argv[2:]:
    im = Image.open(f).convert('RGBA'); W, H = im.size; px = im.load(); cache = {}
    g = [[0] * (W + 1) for _ in range(H + 1)]
    for y in range(H):
        row = 0
        for x in range(W):
            p = px[x, y]; v = 0
            if p[3] > 200:
                c = p[:3]
                if c not in cache:
                    l = measure.lab('#%02x%02x%02x' % c); cache[c] = min(measure.de2000(measure.lab(q), l) for q in measure.PLATFORM.values()) < 12
                v = 1 if cache[c] else 0
            row += v; g[y + 1][x + 1] = g[y][x + 1] + row
    best = 0; at = None; n = 24
    for y in range(0, H - n + 1, 2):
        for x in range(0, W - n + 1, 2):
            s = g[y + n][x + n] - g[y][x + n] - g[y + n][x] + g[y][x]
            if s > best: best, at = s, (x, y)
    print(f'{f.split("/")[-1]}: max guarded in a 24x24 window {best}/{n * n} ({best / n / n:.0%}) at {at}')
