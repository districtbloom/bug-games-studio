"""where do platform-guarded colours sit in an image? python3 -I guard.py <measure.py dir> <image> <out.png>
paints each pixel by its nearest platform colour's band (guarded red, caution yellow, free clear)"""
import sys
sys.path.insert(0, sys.argv[1])
import measure
from PIL import Image
im = Image.open(sys.argv[2]).convert('RGB')
small = im.resize((im.width // 4, im.height // 4))
q = small.quantize(colors=96, method=Image.Quantize.MEDIANCUT)
pal = q.getpalette()[:96 * 3]
band = []
for i in range(96):
    h = '#%02x%02x%02x' % tuple(pal[i * 3:i * 3 + 3]); lab = measure.lab(h)
    d = min(measure.de2000(measure.lab(p), lab) for p in measure.PLATFORM.values())
    band.append(2 if d < 12 else 1 if d < 20 else 0)
px = q.load(); W, H = q.size
ov = Image.new('RGBA', q.size, (0, 0, 0, 0)); o = ov.load()
cnt = [0, 0, 0]; right = [0, 0, 0]
for y in range(H):
    for x in range(W):
        b = band[px[x, y]]; cnt[b] += 1
        if x > W * .88: right[b] += 1
        if b == 2: o[x, y] = (255, 0, 80, 200)
        elif b == 1: o[x, y] = (255, 230, 0, 120)
base = small.convert('L').convert('RGBA'); base.alpha_composite(ov); base.save(sys.argv[3])
T = sum(cnt); R = sum(right)
print(f'{sys.argv[2]}: guarded {cnt[2] / T:.1%} · caution {cnt[1] / T:.1%} · right 12%: guarded {right[2] / R:.1%} caution {right[1] / R:.1%}')
