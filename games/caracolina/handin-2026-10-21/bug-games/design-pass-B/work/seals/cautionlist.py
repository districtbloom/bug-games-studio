"""which quantized colours in a seal are caution/guarded, and how much: python3 -I cautionlist.py <pack tools> <png>..."""
import sys
sys.path.insert(0, sys.argv[1])
import measure as M
from PIL import Image
for path in sys.argv[2:]:
    im = Image.open(path).convert('RGBA'); px = im.load(); W, H = im.size
    rgb = Image.new('RGB', im.size); rp = rgb.load(); n = 0
    for y in range(H):
        for x in range(W):
            r, g, b, a = px[x, y]
            rp[x, y] = (r, g, b) if a > 250 else (0, 0, 0)
    q = rgb.quantize(colors=48, method=Image.Quantize.MEDIANCUT); pal = q.getpalette()[:48 * 3]
    counts = q.getcolors(48 * 48) or []
    tot = sum(c for c, i in counts if (pal[i*3], pal[i*3+1], pal[i*3+2]) != (0, 0, 0))
    out = []
    for c, i in sorted(counts, reverse=True):
        h = '#%02x%02x%02x' % tuple(pal[i*3:i*3+3])
        if h == '#000000': continue
        l = M.lab(h); d = {k: M.de2000(M.lab(v), l) for k, v in M.PLATFORM.items()}; k = min(d, key=d.get)
        if d[k] < 20: out.append(f'{h} {c/tot:.1%} {k} {d[k]:.1f}')
    print(path.split('/')[-1], '|', '; '.join(out))
