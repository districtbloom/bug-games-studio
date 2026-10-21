#!/usr/bin/env python3
"""Pass rail preview (check sheet): three rows (free, pass, bug.pass), rewards on their row grounds at 120 px tall,
   with stand-in platform states (mint owned, lilac selected, sun outline on the bug.pass row) and the marker in both
   poses (held on the last earned cell, next riding over the next cell).
   python3 work/pass/rail.py <dir> <prefix> <marker-dir-prefix> out.png"""
import sys
from PIL import Image, ImageDraw, ImageFont
d, pre, mpre, out = sys.argv[1:5]
F = '/home/claude/designpass/pack/tools/fonts/'
def font(n, s):
    try: return ImageFont.truetype(F + n, s)
    except Exception: return ImageFont.load_default()
NIGHT = (11, 9, 16); MINT = (0x7F, 0xE3, 0xC0); LILAC = (0xC4, 0xB5, 0xFF); SUN = (0xFF, 0xCB, 0x57)
CW, CH, GAP = 151, 120, 12
rows = ['free', 'pass', 'bug']
label = {'free': 'free', 'pass': 'pass', 'bug': 'bug.pass'}
# step -> row -> reward (None = ground only)
steps = [
    {'free': 'sticky-pad', 'pass': 'desk-lamp', 'bug': None},
    {'free': 'paperclip-trail', 'pass': 'envelope-trail', 'bug': None},
    {'free': None, 'pass': 'pinstripe-glove', 'bug': 'night-window'},
    {'free': None, 'pass': None, 'bug': None},
]
owned = {(0, 'free'), (1, 'free'), (0, 'pass'), (1, 'pass')}
selected = (2, 'pass')
held_step, next_step = 1, 2
X0, Y0, TRACK = 110, 30, 58
W = X0 + len(steps) * (CW + GAP) + 20; H = Y0 + TRACK + 3 * (CH + GAP) + 60
S = Image.new('RGBA', (W, H), NIGHT + (255,)); dr = ImageDraw.Draw(S)
fl, fs = font('GeistMono-Regular.ttf', 13), font('GeistMono-Regular.ttf', 11)
dr.text((X0, 8), 'pass rail preview · cells at 120 px tall · platform states are stand-ins', fill=(170, 170, 170), font=fs)
# the track the marker rides on
ty = Y0 + TRACK - 14
dr.line((X0, ty, X0 + len(steps) * (CW + GAP) - GAP, ty), fill=(60, 58, 70), width=3)
for i in range(len(steps)):
    cx = X0 + i * (CW + GAP) + CW // 2
    dr.ellipse((cx - 4, ty - 4, cx + 4, ty + 4), fill=(90, 88, 100) if i > held_step else MINT)
for r, row in enumerate(rows):
    y = Y0 + TRACK + r * (CH + GAP)
    dr.text((14, y + CH // 2 - 8), label[row], fill=(200, 200, 200), font=fl)
    for i, st in enumerate(steps):
        x = X0 + i * (CW + GAP)
        g = Image.open(f'{d}/{pre}ground-{row}.png').convert('RGBA')
        if st[row]: g.alpha_composite(Image.open(f'{d}/{pre}{st[row]}.png').convert('RGBA'))
        S.alpha_composite(g.resize((CW, CH), Image.LANCZOS), (x, y))
        if row == 'bug': dr.rectangle((x - 2, y - 2, x + CW + 1, y + CH + 1), outline=SUN, width=3)
        if (i, row) in owned:
            dr.rectangle((x - 2, y - 2, x + CW + 1, y + CH + 1), outline=MINT, width=3)
            dr.ellipse((x + 6, y + 6, x + 24, y + 24), fill=MINT); dr.line((x + 10, y + 15, x + 14, y + 19, x + 20, y + 10), fill=NIGHT, width=3)
        if (i, row) == selected: dr.rectangle((x - 5, y - 5, x + CW + 4, y + CH + 4), outline=LILAC, width=4)
# the marker: held on the last earned cell, next riding over the next cell
mh = Image.open(f'{mpre}marker-held.png').convert('RGBA'); mn = Image.open(f'{mpre}marker-next.png').convert('RGBA')
hx = X0 + held_step * (CW + GAP) + CW // 2 - 24; nx = X0 + next_step * (CW + GAP) + CW // 2 - 24
S.alpha_composite(mh, (hx, ty - 40)); S.alpha_composite(mn, (nx, ty - 46))
dr.text((hx - 6, Y0 + TRACK + 3 * (CH + GAP) + 6), 'held (last earned)', fill=(170, 170, 170), font=fs)
dr.text((nx - 6, Y0 + TRACK + 3 * (CH + GAP) + 6), 'next', fill=(170, 170, 170), font=fs)
dr.text((X0, H - 24), 'mint = owned   lilac = selected   sun = bug.pass row (platform)   marker: the rubber stamp', fill=(150, 150, 150), font=fs)
S.convert('RGB').save(out); print('wrote', out)
