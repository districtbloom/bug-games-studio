#!/usr/bin/env python3
"""Largest all-guarded square (dE<12 to a platform colour) in a picture, and a mask image.
   python3 work/pass/guardmax.py pic.png [mask.png]"""
import sys, numpy as np
sys.path.insert(0, '/home/claude/designpass/tools')
from colours import lab, de2000, hex2rgb, PLATFORM
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGBA'); a = np.asarray(im).astype(float)
rgb, al = a[..., :3], a[..., 3]
D = np.full(al.shape, 999.)
L = lab(rgb)
for h in PLATFORM.values():
    D = np.minimum(D, de2000(np.broadcast_to(lab(hex2rgb(h)[None]), L.shape), L))
g = (D < 12) & (al > 0)
ii = np.pad(g.astype(np.int32), ((1, 0), (1, 0))).cumsum(0).cumsum(1)
best = 0
for k in range(1, 60):
    if k > min(g.shape): break
    s = ii[k:, k:] - ii[:-k, k:] - ii[k:, :-k] + ii[:-k, :-k]
    if (s == k * k).any(): best = k
    else: break
print(f'{sys.argv[1]}: guarded {g.mean()*100:.1f}%  largest all-guarded square {best}x{best}')
if len(sys.argv) > 2:
    m = np.zeros(g.shape + (3,), np.uint8); m[..., :] = 40; m[g] = (255, 203, 87)
    Image.fromarray(m).resize((g.shape[1] * 2, g.shape[0] * 2), Image.NEAREST).save(sys.argv[2])
