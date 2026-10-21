"""full-resolution guard: every pixel measured against ember/lilac/sun/mint with the pack's measure.py.
python3 -I fullguard.py <pack tools> <img> <out.png>: reports guarded/caution shares and whether each
caution pixel is an edge pixel (its 3x3 neighbourhood holds more than one flat colour)."""
import sys
sys.path.insert(0, sys.argv[1])
import measure
from PIL import Image
im = Image.open(sys.argv[2]); a = im.getchannel('A') if im.mode == 'RGBA' else None
im = im.convert('RGB'); W, H = im.size; px = im.load()
cache = {}
def cls(c):
    if c not in cache:
        lab = measure.lab('#%02x%02x%02x' % c)
        ds = {k: measure.de2000(measure.lab(p), lab) for k, p in measure.PLATFORM.items()}
        k = min(ds, key=ds.get); d = ds[k]; cache[c] = (2 if d < 12 else 1 if d < 20 else 0, k, d)
    return cache[c]
out = im.convert('L').convert('RGB'); o = out.load()
n = [0, 0, 0]; edge = 0; who = {}
def lum(c): return .3 * c[0] + .59 * c[1] + .11 * c[2]
for y in range(H):
    for x in range(W):
        b, k, d = cls(px[x, y]); n[b] += 1
        if b:
            # edge test: local luminance range in 3x3 > 40
            ls = [lum(px[xx, yy]) for xx in range(max(0, x - 1), min(W, x + 2)) for yy in range(max(0, y - 1), min(H, y + 2))]
            e = max(ls) - min(ls) > 40; edge += e; who[k] = who.get(k, 0) + 1
            o[x, y] = (255, 0, 80) if b == 2 else ((255, 200, 0) if e else (255, 120, 0))
out.resize((W * 4, H * 4), Image.NEAREST).save(sys.argv[3])
T = W * H
print(f'{sys.argv[2].split("/")[-1]}: alpha min {a.getextrema()[0] if a else 255} · guarded {n[2]} px ({n[2]/T:.2%}) · caution {n[1]} px ({n[1]/T:.2%}), of which on edges {edge} · nearest {who}')
