"""Largest solid square of guarded pixels (CIEDE2000 < 12 to ember / lilac / sun / mint), per platform colour.
python3 -I blockcheck.py <packtools> <img> [...]"""
import sys
sys.path.insert(0, sys.argv[1])
import measure
from PIL import Image
P = {k: measure.lab(v) for k, v in measure.PLATFORM.items()}
for f in sys.argv[2:]:
    im = Image.open(f).convert('RGB'); W, H = im.size; px = im.load(); cache = {}
    out = []
    for name, L in P.items():
        dp_prev = [0] * W; best = 0; pos = None; tot = 0
        for y in range(H):
            dp = [0] * W
            for x in range(W):
                c = px[x, y]; k = (name, c[0] // 3, c[1] // 3, c[2] // 3)
                if k not in cache: cache[k] = measure.de2000(L, measure.lab('#%02x%02x%02x' % c)) < 12
                if cache[k]:
                    tot += 1
                    dp[x] = 1 if x == 0 or y == 0 else 1 + min(dp_prev[x], dp[x - 1], dp_prev[x - 1])
                    if dp[x] > best: best = dp[x]; pos = (x, y)
            dp_prev = dp
        out.append(f'{name} {best}px{"@" + str(pos) if pos else ""} ({tot / (W * H):.1%})')
    print(f.split('/')[-1], im.size, ' | '.join(out))
