#!/usr/bin/env python3
"""Check boards for the seals: a 32 px strip of all seals in all three states (+ a 4x nearest-pixel enlargement),
a 96 px board, and a 48/64 row. Seals are drawn on the page's dark panel (#141019, sampled from the profile
reference) the way the page shows them.
usage: python3 board.py <seal dir> <out dir>"""
import sys, os
from PIL import Image

IDS = ['bead', 'halo', 'nova', 'bell', 'geode', 'star', 'resonances', 'forms', 'constellation', 'lantern-night']
STATES = ['earned', 'progress', 'locked']
PANEL = (0x14, 0x10, 0x19)


def board(src, size, gap, pad, light=False):
    n = len(IDS)
    W = pad * 2 + n * size + (n - 1) * gap; H = pad * 2 + 3 * size + 2 * gap
    im = Image.new('RGBA', (W, H), (236, 232, 240, 255) if light else PANEL + (255,))
    for r, st in enumerate(STATES):
        for c, sid in enumerate(IDS):
            p = os.path.join(src, f'{sid}-{st}.png')
            if not os.path.exists(p): continue
            s = Image.open(p).convert('RGBA')
            if s.size[0] != size: s = s.resize((size, size), Image.LANCZOS)
            im.alpha_composite(s, (pad + c * (size + gap), pad + r * (size + gap)))
    return im.convert('RGB')


def main():
    src, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    s32 = board(src, 32, 8, 8); s32.save(os.path.join(out, 'strip-32.png'))
    s32.resize((s32.width * 4, s32.height * 4), Image.NEAREST).save(os.path.join(out, 'strip-32-x4.png'))
    board(src, 96, 16, 16).save(os.path.join(out, 'board-96.png'))
    board(src, 48, 10, 10).save(os.path.join(out, 'board-48.png'))
    board(src, 64, 12, 12).save(os.path.join(out, 'board-64.png'))
    board(src, 32, 8, 8, light=True).save(os.path.join(out, 'strip-32-light.png'))
    print('boards ->', out)


if __name__ == '__main__':
    main()
