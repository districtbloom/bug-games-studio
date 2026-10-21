"""Where are the ember-guarded pixels? python3 -I embermap.py <packtools> <img> <out> -> bbox and count per region (per-pixel ΔE2000 on a 1/4 image)"""
import sys
sys.path.insert(0, sys.argv[1])
import measure
from PIL import Image
im = Image.open(sys.argv[2]).convert('RGB'); s = im.resize((im.width // 4, im.height // 4))
q = s.quantize(colors=256, method=Image.Quantize.MEDIANCUT); pal = q.getpalette()
E = measure.lab(measure.PLATFORM['ember']); band = {}
for i in range(256):
    h = '#%02x%02x%02x' % tuple(pal[i*3:i*3+3]); band[i] = measure.de2000(E, measure.lab(h))
px = q.load(); W, H = q.size; out = s.convert('L').convert('RGB'); o = out.load(); xs = []; ys = []
for y in range(H):
    for x in range(W):
        if band[px[x, y]] < 12: o[x, y] = (255, 0, 0); xs.append(x); ys.append(y)
out.save(sys.argv[3])
if xs: print('ember px', len(xs), 'bbox x %.2f-%.2f y %.2f-%.2f' % (min(xs)/W, max(xs)/W, min(ys)/H, max(ys)/H))
else: print('ember px 0')
