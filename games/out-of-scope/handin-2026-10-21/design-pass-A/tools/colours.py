#!/usr/bin/env python3
"""Colour guard checks for bug.games art (CIEDE2000, same maths as pack/tools/measure.py).

  python3 tools/colours.py hexes work/poster.hex          # every hex used in the markup, with its zone
  python3 tools/colours.py image bug/poster.png [--strip 26] [--play 120] [--block 24]
      pixel scan of the finished picture (at its real size):
      - GUARDED pixels (dE < 12 to ember #FF5A36, lilac #C4B5FF, sun #FFCB57, mint #7FE3C0)
      - any flat guarded block of 24x24 px or more  -> FAIL
      - any guarded pixel within 120 px of the bottom caption strip (bottom 26 px) -> FAIL (posters only)
      - caution pixels (12-20) near the caption strip are listed as a note
  python3 tools/colours.py image some.png --noplay        # skip the caption-strip test (stills, tiles)
"""
import sys
import numpy as np
from PIL import Image

PLATFORM = {'ember': '#FF5A36', 'lilac': '#C4B5FF', 'sun': '#FFCB57', 'mint': '#7FE3C0'}


def hex2rgb(h):
    h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float64)


def lab(rgb):  # rgb: (..., 3) 0..255  -> same formula as measure.py
    c = rgb / 255.0
    c = np.where(c > .04045, ((c + .055) / 1.055) ** 2.4, c / 12.92)
    r, g, b = c[..., 0], c[..., 1], c[..., 2]
    X = (.4124 * r + .3576 * g + .1805 * b) / .95047
    Y = .2126 * r + .7152 * g + .0722 * b
    Z = (.0193 * r + .1192 * g + .9505 * b) / 1.08883
    t = lambda v: np.where(v > .008856, np.cbrt(v), 7.787 * v + 16 / 116)
    fx, fy, fz = t(X), t(Y), t(Z)
    return np.stack([116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)], -1)


def de2000(l1, l2):
    L1, a1, b1 = l1[..., 0], l1[..., 1], l1[..., 2]
    L2, a2, b2 = l2[..., 0], l2[..., 1], l2[..., 2]
    Cb = (np.hypot(a1, b1) + np.hypot(a2, b2)) / 2
    G = .5 * (1 - np.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)))
    a1p, a2p = (1 + G) * a1, (1 + G) * a2
    C1p, C2p = np.hypot(a1p, b1), np.hypot(a2p, b2)
    h1p = np.degrees(np.arctan2(b1, a1p)) % 360
    h2p = np.degrees(np.arctan2(b2, a2p)) % 360
    d = h2p - h1p
    dh = np.where(C1p * C2p == 0, 0, np.where(d > 180, d - 360, np.where(d < -180, d + 360, d)))
    dHp = 2 * np.sqrt(C1p * C2p) * np.sin(np.radians(dh / 2))
    Lbp, Cbp = (L1 + L2) / 2, (C1p + C2p) / 2
    s = h1p + h2p
    hbp = np.where(C1p * C2p == 0, s, np.where(np.abs(h1p - h2p) <= 180, s / 2, np.where(s < 360, (s + 360) / 2, (s - 360) / 2)))
    T = 1 - .17 * np.cos(np.radians(hbp - 30)) + .24 * np.cos(np.radians(2 * hbp)) + .32 * np.cos(np.radians(3 * hbp + 6)) - .20 * np.cos(np.radians(4 * hbp - 63))
    dth = 30 * np.exp(-((hbp - 275) / 25) ** 2)
    RC = 2 * np.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7))
    SL = 1 + .015 * (Lbp - 50) ** 2 / np.sqrt(20 + (Lbp - 50) ** 2)
    SC = 1 + .045 * Cbp
    SH = 1 + .015 * Cbp * T
    RT = -np.sin(np.radians(2 * dth)) * RC
    return np.sqrt(((L2 - L1) / SL) ** 2 + ((C2p - C1p) / SC) ** 2 + (dHp / SH) ** 2 + RT * ((C2p - C1p) / SC) * (dHp / SH))


def zone(d):
    return 'GUARDED' if d < 12 else 'caution' if d < 20 else 'free'


def hexes(path):
    hx = [l.strip() for l in open(path) if l.strip()]
    worst = []
    for h in hx:
        L = lab(hex2rgb(h)[None])
        parts = []
        mn = 999
        for role, ph in PLATFORM.items():
            d = float(de2000(lab(hex2rgb(ph)[None]), L)[0]); mn = min(mn, d)
            parts.append(f'{role} {d:5.1f}')
        z = zone(mn)
        if z != 'free': worst.append((h, z, mn))
        print(f'{h}  {" · ".join(parts)}  -> {z}')
    print('\nnot free:', ', '.join(f'{h} {z} ({m:.1f})' for h, z, m in worst) or 'none')


def image(path, strip=26, play=120, block=24, noplay=False):
    im = Image.open(path).convert('RGB')
    a = np.asarray(im).astype(np.float64)
    H, W, _ = a.shape
    # quantise to speed up: unique colours only
    q = (a[..., 0].astype(np.int64) << 16) | (a[..., 1].astype(np.int64) << 8) | a[..., 2].astype(np.int64)
    u, inv = np.unique(q.ravel(), return_inverse=True)
    rgb = np.stack([(u >> 16) & 255, (u >> 8) & 255, u & 255], -1).astype(np.float64)
    L = lab(rgb)
    dmin = np.full(len(u), 999.0); who = np.empty(len(u), dtype=object); who[:] = ''
    for role, ph in PLATFORM.items():
        d = de2000(np.broadcast_to(lab(hex2rgb(ph)[None]), L.shape), L)
        m = d < dmin; who[m] = role; dmin = np.minimum(dmin, d)
    D = dmin[inv].reshape(H, W); R = who[inv].reshape(H, W)
    g = D < 12; c = (D >= 12) & (D < 20)
    print(f'{path}: {W}x{H}  guarded px {g.sum()} ({100 * g.mean():.2f}%)  caution px {c.sum()} ({100 * c.mean():.2f}%)')
    if g.any():
        roles = {}
        for r in R[g]: roles[r] = roles.get(r, 0) + 1
        print('  guarded by role:', roles)
    # flat block test: any block x block window entirely guarded
    fail = False
    if g.any():
        ii = np.pad(g.astype(np.int32), ((1, 0), (1, 0))).cumsum(0).cumsum(1)
        s = ii[block:, block:] - ii[:-block, block:] - ii[block:, :-block] + ii[:-block, :-block]
        full = np.argwhere(s == block * block)
        if len(full):
            y, x = full[0]; fail = True
            print(f'  FAIL guarded flat block >= {block}x{block} at x={x} y={y} ({R[y, x]})  [{len(full)} windows]')
        else:
            print(f'  ok: no guarded block of {block}x{block}')
    if not noplay:
        top = H - strip - play
        zone_g = g[top:, :]
        if zone_g.any():
            ys, xs = np.nonzero(zone_g); fail = True
            print(f'  FAIL guarded px within {play} px of the caption strip: {zone_g.sum()} px, e.g. x={xs[0]} y={ys[0] + top}')
        else:
            print(f'  ok: no guarded px in the bottom {strip + play} px')
        zc = c[top:, :]
        if zc.any(): print(f'  note: {zc.sum()} caution px in the bottom {strip + play} px')
        bot = a[H - strip:, :, :]
        print(f'  caption strip (bottom {strip}px): mean {bot.mean():.0f}, std {bot.std():.1f} (calm = low std)')
    print('  RESULT:', 'FAIL' if fail else 'PASS')
    return not fail


if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'hexes':
        for p in sys.argv[2:]: hexes(p)
    elif mode == 'image':
        args = sys.argv[2:]
        noplay = '--noplay' in args
        paths = [x for x in args if not x.startswith('--')]
        ok = all([image(p, noplay=noplay) for p in paths])
        sys.exit(0 if ok else 1)
