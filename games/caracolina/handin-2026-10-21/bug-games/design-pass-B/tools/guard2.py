"""guard map with the pack's measure.py (ember, lilac, sun, mint).
python3 -I guard2.py <pack tools dir> <image> <out.png> [bottom_frac]
reports guarded / caution shares overall and in the bottom band (default .376 = 120 px of a 319 px hero plate)"""
import sys
sys.path.insert(0, sys.argv[1])
import measure
from PIL import Image
bf = float(sys.argv[4]) if len(sys.argv) > 4 else .376
im = Image.open(sys.argv[2]).convert('RGB')
small = im.resize((max(1, im.width // 4), max(1, im.height // 4)))
q = small.quantize(colors=128, method=Image.Quantize.MEDIANCUT)
pal = q.getpalette()[:128 * 3]
band = []; who = []
for i in range(128):
    h = '#%02x%02x%02x' % tuple(pal[i * 3:i * 3 + 3]); lab = measure.lab(h)
    ds = {k: measure.de2000(measure.lab(p), lab) for k, p in measure.PLATFORM.items()}
    k = min(ds, key=ds.get); d = ds[k]
    band.append(2 if d < 12 else 1 if d < 20 else 0); who.append(k)
px = q.load(); W, H = q.size
ov = Image.new('RGBA', q.size, (0, 0, 0, 0)); o = ov.load()
tot = [0, 0, 0]; bot = [0, 0, 0]; whog = {}
for y in range(H):
    for x in range(W):
        i = px[x, y]; b = band[i]; tot[b] += 1
        if y >= H * (1 - bf): bot[b] += 1
        if b == 2: o[x, y] = (255, 0, 80, 210); whog[who[i]] = whog.get(who[i], 0) + 1
        elif b == 1: o[x, y] = (255, 230, 0, 130)
base = small.convert('L').convert('RGBA'); base.alpha_composite(ov); base.save(sys.argv[3])
T = sum(tot); Bt = sum(bot)
print(f'{sys.argv[2].split("/")[-1]}: guarded {tot[2] / T:.1%} caution {tot[1] / T:.1%} · bottom {bf:.0%}: guarded {bot[2] / Bt:.1%} caution {bot[1] / Bt:.1%} · guarded by {whog}')
