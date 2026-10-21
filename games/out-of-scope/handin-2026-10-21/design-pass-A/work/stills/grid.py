"""Overlay a stage-coordinate grid on a capture (for choosing crops). usage: grid.py in.png out.png [x0 y0 x1 y1] (stage px)"""
import sys
from PIL import Image, ImageDraw
im = Image.open(sys.argv[1]).convert('RGB'); s = im.width / 1440
x0, y0, x1, y1 = [int(v) for v in sys.argv[3:7]] if len(sys.argv) > 6 else (0, 0, 1440, 900)
im = im.crop((int(x0 * s), int(y0 * s), int(x1 * s), int(y1 * s)))
k = min(1600 / im.width, 1000 / im.height); im = im.resize((int(im.width * k), int(im.height * k)))
d = ImageDraw.Draw(im); step = 50 if (x1 - x0) > 500 else 20
for x in range((x0 // step + 1) * step, x1, step):
    X = (x - x0) * s * k; d.line((X, 0, X, im.height), fill=(255, 0, 255) if x % 100 == 0 else (120, 0, 120), width=1)
    if x % 100 == 0: d.text((X + 2, 2), str(x), fill=(255, 255, 255))
for y in range((y0 // step + 1) * step, y1, step):
    Y = (y - y0) * s * k; d.line((0, Y, im.width, Y), fill=(0, 255, 255) if y % 100 == 0 else (0, 120, 120), width=1)
    if y % 100 == 0: d.text((2, Y + 2), str(y), fill=(255, 255, 255))
im.save(sys.argv[2])
