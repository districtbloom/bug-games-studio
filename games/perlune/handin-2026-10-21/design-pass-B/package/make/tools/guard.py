#!/usr/bin/env python3
"""Where do bug.games' guarded colours sit in a picture?

usage: python3 guard.py <image> [--zone bottom:146] [--map out.png] [--min-block 24]
  Reports, for ember / lilac / sun / mint (CIEDE2000 < 12 = guarded, < 20 = caution, the pack's measure.py maths):
    - share of pixels that are guarded, in the whole picture and in the zone (default: the bottom 146 px,
      i.e. the 26 px caption strip plus 120 px where Play appears; scaled for pictures that are not 800 px tall)
    - the largest solid square of guarded pixels (a "flat block"), in px
  --map writes a picture with guarded pixels painted (ember red, lilac blue, sun yellow, mint green).
"""
import sys, os, argparse, math
import numpy as np
from PIL import Image
sys.path.insert(0, '/tmp/claude-0/-home-claude/abf4d099-0c77-5d2d-a155-12d3f9d77b55/scratchpad/packB/bug-games-design-pass-B/tools')
import measure as M  # the pack's own colour maths

PLAT = {'ember': '#FF5A36', 'lilac': '#C4B5FF', 'sun': '#FFCB57', 'mint': '#7FE3C0'}
PAINT = {'ember': (255, 40, 40), 'lilac': (60, 90, 255), 'sun': (255, 230, 0), 'mint': (0, 220, 120)}


def classify(rgb):
    """rgb: Nx3 uint8 -> dict role -> bool mask (guarded), and caution masks"""
    q = (rgb // 4).astype(np.int32)  # 64 levels per channel
    key = q[:, 0] * 4096 + q[:, 1] * 64 + q[:, 2]
    uk, inv = np.unique(key, return_inverse=True)
    out_g = {r: np.zeros(len(uk), bool) for r in PLAT}
    out_c = {r: np.zeros(len(uk), bool) for r in PLAT}
    plab = {r: M.lab(h) for r, h in PLAT.items()}
    for i, k in enumerate(uk):
        r, g, b = (k // 4096) * 4 + 2, ((k // 64) % 64) * 4 + 2, (k % 64) * 4 + 2
        L = M.lab('#%02X%02X%02X' % (r, g, b))
        for role in PLAT:
            d = M.de2000(plab[role], L)
            out_g[role][i] = d < 12
            out_c[role][i] = d < 20
    return {r: out_g[r][inv] for r in PLAT}, {r: out_c[r][inv] for r in PLAT}


def largest_square(mask):
    h, w = mask.shape
    dp = np.zeros((h + 1, w + 1), np.int32)
    best = 0
    for y in range(h):
        row = mask[y]
        prev = dp[y]
        cur = dp[y + 1]
        for x in np.nonzero(row)[0]:
            v = min(prev[x], prev[x + 1], cur[x]) + 1
            cur[x + 1] = v
            if v > best: best = v
    return best


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('image')
    ap.add_argument('--zone', default='bottom:146')
    ap.add_argument('--map')
    a = ap.parse_args()
    im = Image.open(a.image).convert('RGB')
    arr = np.asarray(im)
    H, W = arr.shape[:2]
    g, c = classify(arr.reshape(-1, 3))
    side, px = a.zone.split(':'); px = int(px)
    zpx = px if H == 800 else round(px * H / 800)
    print(f'{os.path.basename(a.image)} {W}x{H}  zone = {side} {zpx} px')
    paint = arr.copy() // 3
    for role in PLAT:
        gm = g[role].reshape(H, W); cm = c[role].reshape(H, W)
        z = gm[H - zpx:] if side == 'bottom' else gm[:zpx]
        sq = largest_square(gm) if gm.any() else 0
        print(f'  {role:<5} guarded {gm.mean()*100:5.2f}% (caution {cm.mean()*100:5.2f}%) · in zone {z.mean()*100:5.2f}% · largest solid block {sq}x{sq}px')
        paint[gm] = PAINT[role]
    if a.map:
        Image.fromarray(paint.astype(np.uint8)).save(a.map); print('  map ->', a.map)


if __name__ == '__main__':
    main()
