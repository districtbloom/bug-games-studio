"""Guarded / caution share in the parts of a desktop backdrop that stay visible beside the info rail
(page layout after reference 04: 1440x577 backdrop under a 57 px nav; rail panel x 936-1360, from y 47 to the bottom;
poster block x 74-936, y 47-548). python3 -I railguard.py <packtools> <backdrop.png>"""
import sys
sys.path.insert(0, sys.argv[1])
import measure
from PIL import Image
im = Image.open(sys.argv[2]).convert('RGB').resize((1440, 577))
s = im.resize((360, 144)); q = s.quantize(colors=200, method=Image.Quantize.MEDIANCUT); pal = q.getpalette()
cls = {}
for i in range(200):
    h = '#%02x%02x%02x' % tuple(pal[i*3:i*3+3]); d = min(measure.de2000(measure.lab(p), measure.lab(h)) for p in measure.PLATFORM.values())
    cls[i] = 2 if d < 12 else 1 if d < 20 else 0
px = q.load()
def zone(name, x0, x1, y0, y1):
    c = [0, 0, 0]
    for y in range(int(y0 / 4), int(y1 / 4)):
        for x in range(int(x0 / 4), int(x1 / 4)): c[cls[px[x, y]]] += 1
    T = sum(c) or 1
    print(f'{name:28s} guarded {c[2]/T:6.1%}  caution {c[1]/T:6.1%}')
zone('right margin (x>1360)', 1360, 1440, 0, 577)
zone('top band over rail', 936, 1440, 0, 47)
zone('left margin (x<74)', 0, 74, 0, 577)
zone('top band over poster', 0, 936, 0, 47)
zone('bottom band (y>548)', 0, 936, 548, 577)
