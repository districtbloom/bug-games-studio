#!/usr/bin/env python3
"""Contact board of every picture in bug/, grouped, each scaled to a common height, labelled with name and size.
usage: python3 board.py <bug dir> <out.png> [--h 180]"""
import sys, os, glob, argparse
from PIL import Image, ImageDraw, ImageFont

FM = '/tmp/claude-0/-home-claude/abf4d099-0c77-5d2d-a155-12d3f9d77b55/scratchpad/packB/bug-games-design-pass-B/tools/fonts/GeistMono-Regular.ttf'
GROUPS = [
    ('posters', ['poster.png', 'poster-2x3.png', 'poster-1x1.png', 'poster-9x16.png', 'share-card.png']),
    ('page', ['backdrop.png', 'backdrop-phone.png', 'key-still.png', 'result-still.png', 'title-lockup.png']),
    ('gallery', ['gallery/0%d.png' % i for i in range(1, 7)]),
    ('marks', ['icon-46.png', 'emblem-30.png', 'chip-64.png', 'marker-next.png', 'marker-held.png', 'reward-held.png']),
    ('store', ['store/*.png']),
    ('pass', ['pass/tile.png', 'pass/ground-*.png', 'pass/[!tg]*.png']),
    ('update + event', ['updates/*.png', 'events/*.png']),
    ('seals earned', ['seals/*-earned.png']),
    ('seals progress', ['seals/*-progress.png']),
    ('seals locked', ['seals/*-locked.png']),
]


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('bug'); ap.add_argument('out'); ap.add_argument('--h', type=int, default=180); ap.add_argument('--w', type=int, default=2400)
    a = ap.parse_args()
    f = ImageFont.truetype(FM, 13)
    rows = []
    seen = set()
    for name, pats in GROUPS:
        files = []
        for p in pats:
            for fp in sorted(glob.glob(os.path.join(a.bug, p))):
                if fp not in seen and fp.endswith('.png'): seen.add(fp); files.append(fp)
        if files: rows.append((name, files))
    tiles = []  # (row, img, label)
    y = 20; x = 20; H = a.h; out = []
    for name, files in rows:
        out.append(('title', name, x, y)); y += 24; x = 20
        rowh = 0
        for fp in files:
            im = Image.open(fp).convert('RGBA'); w0, h0 = im.size
            h = H if not name.startswith('seals') else 96
            if w0 <= 128 and h0 <= 128: h = h0  # small marks at master size
            w = max(1, round(w0 * h / h0))
            if x + w > a.w - 20: x = 20; y += rowh + 34; rowh = 0
            out.append(('img', im.resize((w, h), Image.LANCZOS), x, y, os.path.relpath(fp, a.bug) + f' {w0}x{h0}'))
            x += w + 14; rowh = max(rowh, h)
        y += rowh + 40; x = 20
    sheet = Image.new('RGB', (a.w, y + 20), (11, 9, 16)); d = ImageDraw.Draw(sheet)
    for o in out:
        if o[0] == 'title': d.text((o[2], o[3]), o[1].upper(), font=f, fill=(236, 232, 226))
        else:
            _, im, x, y0, lab = o
            bg = Image.new('RGBA', im.size, (40, 36, 48, 255)); bg.alpha_composite(im)
            sheet.paste(bg.convert('RGB'), (x, y0)); d.text((x, y0 + im.size[1] + 3), lab, font=ImageFont.truetype(FM, 10), fill=(150, 146, 150))
    sheet.save(a.out); print('wrote', a.out, sheet.size)


if __name__ == '__main__':
    main()
