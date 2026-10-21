"""flat guarded blocks: any 24x24 window where >= 85 % of pixels are guarded (dE2000 < 12 to ember, lilac, sun or mint)
python3 -I blocks.py <pack tools dir> <img> [out.png]"""
import sys
sys.path.insert(0, sys.argv[1])
import measure
import numpy as np
from PIL import Image
im = Image.open(sys.argv[2]).convert('RGB')
q = im.quantize(colors=256, method=Image.Quantize.MEDIANCUT)
pal = q.getpalette()[:256 * 3]
g = np.zeros(256, bool); who = {}
for i in range(len(pal) // 3):
    h = '#%02x%02x%02x' % tuple(pal[i * 3:i * 3 + 3]); lab = measure.lab(h)
    ds = {k: measure.de2000(measure.lab(p), lab) for k, p in measure.PLATFORM.items()}
    k = min(ds, key=ds.get)
    if ds[k] < 12: g[i] = True; who[i] = k
idx = np.array(q); G = g[idx].astype(np.int32)
S = np.pad(G.cumsum(0).cumsum(1), ((1, 0), (1, 0)))
N = 24; H, W = G.shape
win = S[N:, N:] - S[:-N, N:] - S[N:, :-N] + S[:-N, :-N]
hit = win >= .85 * N * N
ys, xs = np.nonzero(hit)
print(f'{sys.argv[2].split("/")[-1]} {W}x{H}: guarded px {G.mean():.2%} · flat 24px guarded blocks: {len(ys)} windows'
      + (f' · y range {ys.min()}-{ys.max() + N}, x range {xs.min()}-{xs.max() + N}' if len(ys) else '')
      + f' · in bottom 120 px: {int((ys + N > H - 120).sum())}')
if len(sys.argv) > 3:
    base = np.array(im.convert('L').convert('RGB')) // 2
    base[G.astype(bool)] = [255, 0, 80]
    for y, x in zip(ys, xs): base[y:y + N, x:x + N] = base[y:y + N, x:x + N] // 2 + [0, 120, 0]
    Image.fromarray(base.astype(np.uint8)).save(sys.argv[3])
