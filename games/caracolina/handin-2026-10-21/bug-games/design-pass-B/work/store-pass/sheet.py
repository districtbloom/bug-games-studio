"""contact sheets for review: python3 -I sheet.py <out.png> <bg hex> <cell px> <cols> files..."""
import sys
from PIL import Image
out, bg, cell, cols = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
fs = sys.argv[5:]
rows = (len(fs) + cols - 1) // cols
pad = 8
S = Image.new('RGB', (cols * (cell + pad) + pad, rows * (cell + pad) + pad), bg)
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGBA')
    s = cell / max(im.size); im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    x = pad + (i % cols) * (cell + pad) + (cell - im.width) // 2; y = pad + (i // cols) * (cell + pad) + (cell - im.height) // 2
    S.paste(im, (x, y), im)
S.save(out)
