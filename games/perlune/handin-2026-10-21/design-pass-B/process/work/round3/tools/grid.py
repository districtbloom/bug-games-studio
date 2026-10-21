import sys
from PIL import Image, ImageDraw
pre, ks = sys.argv[1], sys.argv[2]
lines = [float(x) for x in (sys.argv[3].split(',') if len(sys.argv) > 3 else ['0.45', '0.70', '0.76'])]
ims = [Image.open(f'{pre}-{k}.png').convert('RGB') for k in ks]
W, H = ims[0].size
cols = 2 if len(ims) > 1 else 1
rows = (len(ims) + cols - 1) // cols
out = Image.new('RGB', (W * cols + 10 * (cols - 1), H * rows + 10 * (rows - 1)), (40, 40, 40))
for i, im in enumerate(ims):
    d = ImageDraw.Draw(im)
    for fx in lines:
        d.line([(fx * W, 0), (fx * W, H)], fill=(80, 255, 80))
    d.text((4, 4), ks[i], fill=(255, 255, 255))
    out.paste(im, ((i % cols) * (W + 10), (i // cols) * (H + 10)))
out.save(f'{pre}-grid.png')
