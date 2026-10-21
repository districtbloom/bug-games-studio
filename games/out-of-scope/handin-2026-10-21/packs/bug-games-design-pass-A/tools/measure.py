#!/usr/bin/env python3
"""bug.games light-map and colour-guard measurements (GUIDE.md §3.4, §3.8).

  python3 -I tools/measure.py light <keyart-2x1.png> [more.png ...]
      L = mean Rec.709 luma of the gamma-encoded sRGB pixels / 255
      C = mean (max(R,G,B) - min(R,G,B)) / 255
      measured on the 2:1 held still (reduced-motion frame), resized to 200x100 (Lanczos)
      band: dark L < .20 · mid .20-.50 · light >= .50 · loud C >= .45 · quiet sheet L >= .85 and C <= .08

  python3 -I tools/measure.py wall
      audits every shared edge of the 13-slot wall (LB_SLOT copy below) against data/lightmap.json

  python3 -I tools/measure.py colour '#RRGGBB' [...]
      CIEDE2000 distance to ember #FF5A36, lilac #C4B5FF, sun #FFCB57, mint #7FE3C0
      (mint = owned: reported so you can see it; whether the 120 px rule applies near the owned check is undecided)
      < 12 guarded · 12-20 caution · >= 20 free   (rules in GUIDE.md §3.8)
"""
import json, math, os, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, '..', 'data', 'lightmap.json')
# the wall slot layout (LB_SLOT) as of 20:38 (Gob <-> Seam Ripper swapped): [col0, col1, row0, row1] on a 7x4 grid
LB_SLOT = {'carbon': [0, 3, 0, 2], 'threadbare': [3, 7, 0, 1], 'tinyworlds': [3, 5, 1, 2], 'nightswim': [5, 6, 1, 2],
           'brother': [6, 7, 1, 3], 'miradouro': [0, 2, 2, 3], 'inkstrike': [2, 3, 2, 4], 'queue': [3, 4, 2, 3],
           'outofscope': [4, 6, 2, 4], 'handling': [0, 1, 3, 4], 'gob': [1, 2, 3, 4], 'typos': [3, 4, 3, 4], 'seamripper': [6, 7, 3, 4]}
PLATFORM = {'ember': '#FF5A36', 'lilac': '#C4B5FF', 'sun': '#FFCB57', 'mint': '#7FE3C0'}


def band(L, C):
    b = 'dark' if L < .20 else ('mid' if L < .50 else 'light')
    if C >= .45: b += ' · LOUD'
    if L >= .85 and C <= .08: b += ' · QUIET SHEET'
    return b


def light(path):
    im = Image.open(path).convert('RGB').resize((200, 100), Image.LANCZOS)
    px = list(im.getdata())
    L = sum(.2126 * r + .7152 * g + .0722 * b for r, g, b in px) / len(px) / 255
    C = sum(max(p) - min(p) for p in px) / len(px) / 255
    return round(L, 3), round(C, 3)


def adj(a, b):
    a0, a1, ar0, ar1 = a; b0, b1, br0, br1 = b
    return ((a1 == b0 or b1 == a0) and min(ar1, br1) > max(ar0, br0)) or \
           ((ar1 == br0 or br1 == ar0) and min(a1, b1) > max(a0, b0))


def wall():
    LM = json.load(open(DATA))
    keys = list(LB_SLOT)
    for i, a in enumerate(keys):
        for b in keys[i + 1:]:
            if not adj(LB_SLOT[a], LB_SLOT[b]): continue
            (La, Ca), (Lb, Cb) = LM[a], LM[b]
            ba, bb = band(La, Ca).split(' ')[0], band(Lb, Cb).split(' ')[0]
            flag = ''
            if ba == bb == 'light': flag = 'LIGHT|LIGHT'
            elif ba == bb == 'mid' and abs(La - Lb) < .10: flag = 'mid~mid (dL < .10)'
            elif Ca >= .45 and Cb >= .45: flag = 'LOUD|LOUD'
            elif ba == bb == 'dark': flag = 'dark|dark (tolerated)'
            print(f'{a:>11} | {b:<11} dL {abs(La - Lb):.2f}  {flag}')


def lab(h):
    r, g, b = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    f = lambda c: ((c + .055) / 1.055) ** 2.4 if c > .04045 else c / 12.92
    r, g, b = f(r), f(g), f(b)
    X = (.4124 * r + .3576 * g + .1805 * b) / .95047; Y = .2126 * r + .7152 * g + .0722 * b; Z = (.0193 * r + .1192 * g + .9505 * b) / 1.08883
    t = lambda v: v ** (1 / 3) if v > .008856 else 7.787 * v + 16 / 116
    return 116 * t(Y) - 16, 500 * (t(X) - t(Y)), 200 * (t(Y) - t(Z))


def de2000(c1, c2):
    L1, a1, b1 = c1; L2, a2, b2 = c2
    Cb = (math.hypot(a1, b1) + math.hypot(a2, b2)) / 2
    G = .5 * (1 - math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)))
    a1p, a2p = (1 + G) * a1, (1 + G) * a2
    C1p, C2p = math.hypot(a1p, b1), math.hypot(a2p, b2)
    h1p, h2p = math.degrees(math.atan2(b1, a1p)) % 360, math.degrees(math.atan2(b2, a2p)) % 360
    dh = 0 if C1p * C2p == 0 else (h2p - h1p - 360 if h2p - h1p > 180 else h2p - h1p + 360 if h2p - h1p < -180 else h2p - h1p)
    dHp = 2 * math.sqrt(C1p * C2p) * math.sin(math.radians(dh / 2))
    Lbp, Cbp = (L1 + L2) / 2, (C1p + C2p) / 2
    if C1p * C2p == 0: hbp = h1p + h2p
    elif abs(h1p - h2p) <= 180: hbp = (h1p + h2p) / 2
    else: hbp = (h1p + h2p + 360) / 2 if h1p + h2p < 360 else (h1p + h2p - 360) / 2
    T = 1 - .17 * math.cos(math.radians(hbp - 30)) + .24 * math.cos(math.radians(2 * hbp)) + .32 * math.cos(math.radians(3 * hbp + 6)) - .20 * math.cos(math.radians(4 * hbp - 63))
    dth = 30 * math.exp(-((hbp - 275) / 25) ** 2); RC = 2 * math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7))
    SL = 1 + .015 * (Lbp - 50) ** 2 / math.sqrt(20 + (Lbp - 50) ** 2); SC = 1 + .045 * Cbp; SH = 1 + .015 * Cbp * T
    RT = -math.sin(math.radians(2 * dth)) * RC
    return math.sqrt(((L2 - L1) / SL) ** 2 + ((C2p - C1p) / SC) ** 2 + (dHp / SH) ** 2 + RT * ((C2p - C1p) / SC) * (dHp / SH))


def colour(h):
    out = []
    for role, ph in PLATFORM.items():
        d = de2000(lab(ph), lab(h))
        out.append(f'{role} {d:5.1f} ' + ('GUARDED' if d < 12 else 'caution' if d < 20 else 'free'))
    print(h, ' · '.join(out))


if __name__ == '__main__':
    mode, args = sys.argv[1], sys.argv[2:]
    if mode == 'light':
        for p in args:
            L, C = light(p); print(f'{p}: L {L} C {C}  {band(L, C)}')
    elif mode == 'wall':
        wall()
    elif mode == 'colour':
        for h in args: colour(h if h.startswith('#') else '#' + h)
