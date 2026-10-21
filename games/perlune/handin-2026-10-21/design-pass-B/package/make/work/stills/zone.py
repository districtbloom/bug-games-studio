#!/usr/bin/env python3
"""zone.py <png...>: guarded share (ember/lilac/sun/mint) in the bottom 26 px (scaled to 800 tall), via guard.py's maths."""
import sys
sys.path.insert(0, '/home/claude/passB/tools')
import numpy as np
from PIL import Image
import guard as G
for f in sys.argv[1:]:
    a = np.asarray(Image.open(f).convert('RGB')); H, W = a.shape[:2]
    z = max(1, round(26 * H / 800)); g, _ = G.classify(a[H - z:].reshape(-1, 3))
    print(f, ' '.join('%s %.2f%%' % (k, v.mean() * 100) for k, v in g.items()))
