#!/usr/bin/env python3
"""See your poster where it will live: on the bug.games For You wall.

usage:
  python3 tools/wall.py poster.png --title "Your Game" [--focus 0.5,0.4] [--icon icon.png]

writes, next to your poster:
  wall-hero.png    the real For You wall with your poster in the No 1 slot
  wall-shapes.png  your poster in every slot shape the wall uses, at real size,
                   plus 90x70, and your icon at 46 px on night and on linen

The wall reshapes posters: from a 3.5:1 strip to a 1:2 column. The platform
crops your 2:1 poster around one focus point (--focus x,y as fractions of the
width and height; default is the centre). If your one image is lost in any
shape, move it, or move the focus. Needs Python 3 and Pillow.
"""
import argparse, os, sys
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
WALL = os.path.join(HERE, '..', 'reference', '01-home-for-you-wall.png')
FONT_T = os.path.join(HERE, 'fonts', 'InstrumentSans-Bold.ttf')
FONT_M = os.path.join(HERE, 'fonts', 'GeistMono-Regular.ttf')

NIGHT = (11, 9, 16)        # page and caption strip
LINEN = (241, 236, 228)    # light ground (#F1ECE4)
TITLE = (236, 232, 226)
MUTED = (150, 146, 150)
CAP = 24                   # caption strip under every poster, in px

HERO = (86, 131, 685, 343)  # x, y, w, h of the No 1 cell on the wall image

# every distinct slot shape on the wall: (name, picture w, picture h); the caption strip sits below
SHAPES = [
    ('No 1 · hero', 685, 319), ('strip', 577, 163), ('wide', 443, 149), ('band', 288, 126),
    ('tall', 236, 316), ('half', 288, 316), ('column', 140, 305),
    ('small', 237, 137), ('small', 200, 137), ('tile', 137, 126),
]


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default(size)


def cover(img, w, h, fx, fy):
    """Scale to cover w x h, then crop around the focus point."""
    s = max(w / img.width, h / img.height)
    big = img.resize((max(w, round(img.width * s)), max(h, round(img.height * s))), Image.LANCZOS)
    cx, cy = fx * big.width, fy * big.height
    x = int(min(max(cx - w / 2, 0), big.width - w))
    y = int(min(max(cy - h / 2, 0), big.height - h))
    return big.crop((x, y, x + w, y + h))


def caption(d, x, y, w, title):
    d.rectangle((x, y, x + w - 1, y + CAP - 1), fill=NIGHT)
    ft, fm = font(FONT_T, 13), font(FONT_M, 11)
    no = 'No ---'
    nw = d.textlength(no, font=fm)
    t, room = title, w - nw - 26
    if d.textlength(t, font=ft) > room:
        while t and d.textlength(t + '…', font=ft) > room:
            t = t[:-1]
        t = t.rstrip() + '…' if t else ''
    d.text((x + 9, y + 5), t, font=ft, fill=TITLE)
    d.text((x + w - 9 - nw, y + 7), no, font=fm, fill=MUTED)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('poster')
    ap.add_argument('--title', default='Your game')
    ap.add_argument('--focus', default='0.5,0.5')
    ap.add_argument('--icon')
    a = ap.parse_args()
    fx, fy = (float(v) for v in a.focus.split(','))
    poster = Image.open(a.poster).convert('RGB')
    out = os.path.dirname(os.path.abspath(a.poster))
    if abs(poster.width / poster.height - 2) > 0.02:
        print(f'note: poster is {poster.width}x{poster.height}; the brief asks for 2:1 (1600x800)')

    # 1 · the wall, your poster in the No 1 slot
    if os.path.exists(WALL):
        wall = Image.open(WALL).convert('RGB')
        x, y, w, h = HERO
        wall.paste(cover(poster, w, h - CAP, fx, fy), (x, y))
        caption(ImageDraw.Draw(wall), x, y + h - CAP, w, a.title)
        wall.save(os.path.join(out, 'wall-hero.png'))
        print('wrote', os.path.join(out, 'wall-hero.png'))
    else:
        print('wall image not found at', WALL, '(keep tools/ beside reference/)')

    # 2 · every shape, at real size
    pad, gap, lab = 32, 22, 22
    rows = [SHAPES[:4], SHAPES[4:7], SHAPES[7:]]
    extra_w = 90 + gap + (46 * 2 + 3 * gap + 2 * 30 if a.icon else 0)
    widths = [sum(s[1] for s in r) + gap * (len(r) - 1) for r in rows]
    W = max(widths + [extra_w]) + pad * 2
    heights = [max(s[2] for s in r) + CAP + lab for r in rows]
    H = pad * 2 + sum(heights) + gap * len(rows) + lab + 140
    sheet = Image.new('RGB', (W, H), NIGHT)
    d = ImageDraw.Draw(sheet)
    fm = font(FONT_M, 11)
    yy = pad
    for r, rh in zip(rows, heights):
        xx = pad
        for name, w, h in r:
            d.text((xx, yy), f'{name} · {w}×{h}'.upper(), font=fm, fill=MUTED)
            sheet.paste(cover(poster, w, h, fx, fy), (xx, yy + lab))
            caption(d, xx, yy + lab + h, w, a.title)
            xx += w + gap
        yy += rh + gap
    # 90 x 70 and the icon
    d.text((pad, yy), 'AT 90×70', font=fm, fill=MUTED)
    sheet.paste(cover(poster, 90, 70, fx, fy), (pad, yy + lab))
    if a.icon:
        icon = Image.open(a.icon).convert('RGBA').resize((46, 46), Image.LANCZOS)
        x0 = pad + 90 + gap * 2
        d.text((x0, yy), 'ICON 46 · NIGHT AND LINEN', font=fm, fill=MUTED)
        for i, g in enumerate((NIGHT, LINEN)):
            gx = x0 + i * (46 + 60 + gap)
            d.rectangle((gx, yy + lab, gx + 46 + 59, yy + lab + 69), fill=g)
            sheet.paste(icon, (gx + 30, yy + lab + 12), icon)
    sheet.save(os.path.join(out, 'wall-shapes.png'))
    print('wrote', os.path.join(out, 'wall-shapes.png'))


if __name__ == '__main__':
    sys.exit(main())
