import sys
from PIL import Image, ImageDraw
# python3 sheet.py out.jpg cols width img...
out, cols, tw = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); ims = sys.argv[4:]
th = None; tiles = []
for f in ims:
    im = Image.open(f).convert('RGB'); h = round(tw * im.height / im.width); tiles.append((f.split('/')[-1], im.resize((tw, h))))
th = max(t[1].height for t in tiles); rows = (len(tiles) + cols - 1) // cols
S = Image.new('RGB', (cols * tw, rows * (th + 16)), (30, 30, 30)); d = ImageDraw.Draw(S)
for i, (n, t) in enumerate(tiles):
    x, y = (i % cols) * tw, (i // cols) * (th + 16); S.paste(t, (x, y + 16)); d.text((x + 4, y + 2), n, fill=(255, 255, 255))
S.save(out, quality=88)
