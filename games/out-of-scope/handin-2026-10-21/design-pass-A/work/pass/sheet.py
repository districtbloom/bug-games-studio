#!/usr/bin/env python3
"""Iteration sheet: each reward composited on its row ground, at full size and at 120 px tall.
   python3 work/pass/sheet.py <dir-with-pngs> <prefix> out.png"""
import sys
from PIL import Image
d, pre, out = sys.argv[1], sys.argv[2], sys.argv[3]
ROW = {'sticky-pad': 'free', 'paperclip-trail': 'free', 'desk-lamp': 'pass', 'envelope-trail': 'pass', 'pinstripe-glove': 'pass', 'night-window': 'bug'}
def P(n): return Image.open(f'{d}/{pre}{n}.png').convert('RGBA')
S = Image.new('RGB', (6 * 316 + 10, 243 + 10 + 120 + 30), (40, 40, 44))
for i, (r, g) in enumerate(ROW.items()):
    G = P(f'ground-{g}'); R = P(r); G.alpha_composite(R)
    S.paste(G.convert('RGB'), (10 + i * 316, 10))
    sm = G.resize((151, 120), Image.LANCZOS)
    S.paste(sm.convert('RGB'), (10 + i * 316, 263))
S.save(out); print('wrote', out)
