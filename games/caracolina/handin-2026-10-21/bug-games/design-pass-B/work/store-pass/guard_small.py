"""colour guard for small or flat images (where guard2's 128-colour quantise fails): every opaque pixel's colour
measured with the pack's measure.py against ember, lilac, sun, mint. python3 -I guard_small.py <pack tools> <img> [bg hex]"""
import sys
sys.path.insert(0, sys.argv[1])
import measure
from PIL import Image
im = Image.open(sys.argv[2]).convert('RGBA')
if len(sys.argv) > 3:
    bg = Image.new('RGBA', im.size, sys.argv[3]); bg.alpha_composite(im); im = bg
cnt = {}
for p in (im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata()):
    if p[3] < 200: continue
    cnt[p[:3]] = cnt.get(p[:3], 0) + 1
cache = {}; tot = [0, 0, 0]; who = {}
for c, n in cnt.items():
    h = '#%02x%02x%02x' % c
    l = measure.lab(h); ds = {k: measure.de2000(measure.lab(v), l) for k, v in measure.PLATFORM.items()}
    k = min(ds, key=ds.get); d = ds[k]; b = 2 if d < 12 else 1 if d < 20 else 0
    tot[b] += n
    if b == 2: who[k] = who.get(k, 0) + n
T = sum(tot)
print(f'{sys.argv[2].split("/")[-1]}: opaque px {T} · guarded {tot[2] / T:.1%} caution {tot[1] / T:.1%} · guarded by {who}')
