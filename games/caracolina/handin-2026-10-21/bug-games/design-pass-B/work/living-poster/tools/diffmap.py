# Coarse luma/chroma difference between the poster and a held frame (numbers to steer the paint, not pixels to copy).
import sys
from PIL import Image
import numpy as np
a = np.asarray(Image.open(sys.argv[1]).convert('RGB').resize((24, 12), Image.BOX)).astype(float)
b = np.asarray(Image.open(sys.argv[2]).convert('RGB').resize((24, 12), Image.BOX)).astype(float)
la = (a * [.2126, .7152, .0722]).sum(2); lb = (b * [.2126, .7152, .0722]).sum(2)
d = (lb - la)
print('luma diff (render - poster), per cell, /255:')
for r in range(12): print(' '.join('%+4d' % v for v in d[r]))
ca = a.max(2) - a.min(2); cb = b.max(2) - b.min(2)
print('chroma diff:')
for r in range(12): print(' '.join('%+4d' % v for v in (cb - ca)[r]))
