#!/usr/bin/env python3
"""Build the pass group's check sheets from the final files in bug/.
   rewards-120.png : each reward at 120 px tall on its row ground, on night, on linen, and in greyscale on its ground
   grounds.png     : the three grounds at full size, at 120 px tall, and in greyscale (tier check)
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageOps
os.chdir('/home/claude/designpass')
F = 'pack/tools/fonts/'
def font(n, s):
    try: return ImageFont.truetype(F + n, s)
    except Exception: return ImageFont.load_default()
NIGHT, LINEN, BGC = (11, 9, 16), (241, 236, 228), (40, 40, 44)
ROW = {'sticky-pad': 'free', 'paperclip-trail': 'free', 'desk-lamp': 'pass', 'envelope-trail': 'pass', 'pinstripe-glove': 'pass', 'night-window': 'bug'}
fs = font('GeistMono-Regular.ttf', 12)
CW, CH = 151, 120
# rewards at 120 px
S = Image.new('RGB', (40 + 6 * (CW + 16), 30 + 4 * (CH + 26) + 10), BGC); d = ImageDraw.Draw(S)
labels = ['on its row ground', 'on night #0B0910', 'on linen #F1ECE4', 'greyscale on its ground']
for r, lab in enumerate(labels): d.text((40, 12 + r * (CH + 26)), lab, fill=(190, 190, 190), font=fs)
for i, (rw, g) in enumerate(ROW.items()):
    R = Image.open(f'bug/pass/{rw}.png').convert('RGBA').resize((CW, CH), Image.LANCZOS)
    G = Image.open(f'bug/pass/ground-{g}.png').convert('RGBA').resize((CW, CH), Image.LANCZOS)
    x = 40 + i * (CW + 16)
    a = G.copy(); a.alpha_composite(R)
    for r, bg in enumerate([a, Image.new('RGBA', (CW, CH), NIGHT + (255,)), Image.new('RGBA', (CW, CH), LINEN + (255,)), None]):
        y = 28 + r * (CH + 26)
        if r == 0: t = a
        elif r == 3: t = ImageOps.grayscale(a.convert('RGB')).convert('RGBA')
        else: t = bg.copy(); t.alpha_composite(R)
        S.paste(t.convert('RGB'), (x, y))
    d.text((x, 28 + 4 * (CH + 26) - 22), f'{rw} ({g})', fill=(150, 150, 150), font=fs)
S.save('bug/checks/pass/rewards-120.png'); print('wrote bug/checks/pass/rewards-120.png')
# grounds
S = Image.new('RGB', (40 + 3 * (306 + 20), 30 + 243 + 20 + CH + 40), BGC); d = ImageDraw.Draw(S)
for i, g in enumerate(('free', 'pass', 'bug')):
    G = Image.open(f'bug/pass/ground-{g}.png').convert('RGB'); x = 40 + i * (306 + 20)
    d.text((x, 10), {'free': 'ground-free · the desk', 'pass': 'ground-pass · acid light', 'bug': 'ground-bug · night window'}[g], fill=(190, 190, 190), font=fs)
    S.paste(G, (x, 30)); sm = G.resize((CW, CH), Image.LANCZOS); S.paste(sm, (x, 30 + 243 + 20))
    S.paste(ImageOps.grayscale(sm).convert('RGB'), (x + CW + 4, 30 + 243 + 20))
d.text((40, 30 + 243 + 20 + CH + 12), 'full size · at 120 px tall · greyscale at 120 px', fill=(150, 150, 150), font=fs)
S.save('bug/checks/pass/grounds.png'); print('wrote bug/checks/pass/grounds.png')
