"""Darken the left of the share card for the title: multiply toward a free dusk ink with a smooth left->right ramp.
python3 -I darken.py <in.png> <out.png> <hex> <alpha_at_left> <end_frac>"""
import sys
from PIL import Image
import numpy as np
src, out, hx, a0, end = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4]), float(sys.argv[5])
im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32) / 255
H, W, _ = im.shape
c = np.array([int(hx[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255
x = np.linspace(0, 1, W)[None, :, None]
t = np.clip(x / end, 0, 1); ramp = a0 * (1 - t * t * (3 - 2 * t))
mult = im * c  # multiply toward the ink
res = im * (1 - ramp) + mult * ramp
Image.fromarray((np.clip(res, 0, 1) * 255 + .5).astype(np.uint8)).save(out)
