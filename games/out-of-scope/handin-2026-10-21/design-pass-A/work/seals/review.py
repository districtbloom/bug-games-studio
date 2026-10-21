#!/usr/bin/env python3
"""Seals review: render the 13x3 sheet with alpha (2x, downsampled), split it into 192 cells,
and build night/linen review boards at 192, 96, 64 and 32 px. Scratch only (work/seals/)."""
import json, subprocess, sys
from PIL import Image

ROOT = '/home/claude/designpass'
OUT = ROOT + '/work/seals'
NIGHT, LINEN = (11, 9, 16), (241, 236, 228)
N, S, GAP = 13, 3, 8
W, H = N * (192 + GAP) + GAP, S * (192 + GAP) + GAP

job = [{"js": ["src/common.js", "src/seals.js"], "expr": "SEALS.sheet()", "out": OUT + "/sheet.png",
        "w": W, "h": H, "dpr": 2, "final": [W, H], "alpha": True, "hexes": OUT + "/sheet.hex"}]
json.dump(job, open(OUT + '/sheet.json', 'w'))
r = subprocess.run(['python3', ROOT + '/tools/render.py', OUT + '/sheet.json'], cwd=ROOT, capture_output=True, text=True)
print(r.stdout.strip(), r.stderr.strip()[-800:])
sh = Image.open(OUT + '/sheet.png').convert('RGBA')
cells = [[sh.crop((GAP + c * (192 + GAP), GAP + r * (192 + GAP), GAP + c * (192 + GAP) + 192, GAP + r * (192 + GAP) + 192)) for c in range(N)] for r in range(S)]


def board(px, name):
    pad = 6 if px <= 48 else 10
    bw = N * (px + pad) + pad
    bh = 2 * (S * (px + pad) + pad)
    B = Image.new('RGB', (bw, bh), NIGHT)
    B.paste(LINEN, (0, bh // 2, bw, bh))
    for half in range(2):
        for r in range(S):
            for c in range(N):
                t = cells[r][c].resize((px, px), Image.LANCZOS)
                B.paste(t, (pad + c * (px + pad), half * bh // 2 + pad + r * (px + pad)), t)
    B.save(f'{OUT}/{name}'); print('wrote', name, B.size)


for px in (192, 96, 64, 32):
    board(px, f'board-{px}.png')
# 32 px zoomed 3x (nearest) to inspect pixels
b = Image.open(f'{OUT}/board-32.png'); b.resize((b.width * 3, b.height * 3), Image.NEAREST).save(f'{OUT}/board-32x3.png')
