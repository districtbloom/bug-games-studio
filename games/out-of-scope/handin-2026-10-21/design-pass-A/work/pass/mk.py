#!/usr/bin/env python3
"""Marker preview: both poses at 1x on crops of the three grounds and on night/linen, then 4x nearest.
   python3 work/pass/mk.py <next.png> <held.png> <ground-dir> <prefix> out.png"""
import sys
from PIL import Image
nx, hd, d, pre, out = sys.argv[1:6]
M = [Image.open(nx).convert('RGBA'), Image.open(hd).convert('RGBA')]
grounds = [Image.open(f'{d}/{pre}ground-{g}.png').convert('RGBA').resize((76, 60), Image.LANCZOS) for g in ('free', 'pass', 'bug')]
S = Image.new('RGB', (830, 310), (40, 40, 44))
x = 10
for g in grounds:
    for m in M:
        c = g.copy(); c.alpha_composite(m, (14, 6)); S.paste(c.convert('RGB'), (x, 10)); x += 86
for bg in ((11, 9, 16), (241, 236, 228)):
    for m in M:
        c = Image.new('RGBA', (60, 60), bg + (255,)); c.alpha_composite(m, (6, 6)); S.paste(c.convert('RGB'), (x, 10)); x += 70
x = 10
for m in M:
    big = m.resize((192, 192), Image.NEAREST); c = Image.new('RGBA', (192, 192), (11, 9, 16, 255)); c.alpha_composite(big); S.paste(c.convert('RGB'), (x, 100)); x += 202
    g = grounds[1].resize((304, 240), Image.NEAREST).crop((56, 24, 248, 216)); g.alpha_composite(big); S.paste(g.convert('RGB'), (x, 100)); x += 202
S.save(out); print('wrote', out)
