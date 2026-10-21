"""count 24x24 windows that are flat (per-channel std < T) AND guarded (dE2000 < 12 to ember/lilac/sun/mint) — python3 -I flatblocks.py <pack tools> <img> [T]"""
import sys
sys.path.insert(0, sys.argv[1]); import measure
import numpy as np
from PIL import Image
T = float(sys.argv[3]) if len(sys.argv) > 3 else 4.0
a = np.asarray(Image.open(sys.argv[2]).convert('RGB')).astype(float)
H, W, _ = a.shape; n = flat = 0; hits = {}
cache = {}
for y in range(0, H - 24, 12):
    for x in range(0, W - 24, 12):
        w = a[y:y + 24, x:x + 24].reshape(-1, 3); n += 1
        if w.std(axis=0).max() >= T: continue
        flat += 1
        m = tuple(int(v) for v in w.mean(axis=0)); key = tuple(v // 4 for v in m)
        if key not in cache:
            h = '#%02x%02x%02x' % m; lab = measure.lab(h)
            ds = {k: measure.de2000(measure.lab(p), lab) for k, p in measure.PLATFORM.items()}; k = min(ds, key=ds.get); cache[key] = (k, ds[k])
        k, d = cache[key]
        if d < 12: hits.setdefault(k, []).append((x, y))
print(sys.argv[2].split('/')[-1], f'windows {n}, flat (std<{T}) {flat}, flat+guarded:', {k: len(v) for k, v in hits.items()}, 'e.g.', {k: v[:3] for k, v in hits.items()})
