#!/usr/bin/env python3
"""Share-card check: the card at 270 px wide (a link preview), beside the poster at the same width so the
register can be compared, then the 270 px card with a stand-in linen bar over its bottom band, and the
270 px card at 3x with hard pixels.

  python3 work/round3/share_check.py bug/share-card.png bug/poster.png out.png
"""
import sys
from PIL import Image, ImageDraw, ImageFont

F = '/home/claude/designpass/pack/tools/fonts/'
LINEN, NIGHT = (241, 236, 228), (11, 9, 16)


def font(n, s):
    try: return ImageFont.truetype(F + n, s)
    except Exception: return ImageFont.load_default()


def main(card, poster, out):
    C = Image.open(card).convert('RGB'); P = Image.open(poster).convert('RGB')
    w = 270; h = round(w * C.height / C.width); c = C.resize((w, h), Image.LANCZOS)
    p = P.resize((w, round(w * P.height / P.width)), Image.LANCZOS)
    bar = c.copy(); d = ImageDraw.Draw(bar); bh = round(h * .14)
    d.rectangle((0, h - bh, w, h), fill=LINEN); d.text((8, h - bh + 4), 'bug.games  (stand-in bar)', fill=(60, 56, 70), font=font('GeistMono-Regular.ttf', 9))
    big = c.resize((w * 3, h * 3), Image.NEAREST)
    W = 40 + w * 3 + 40; H = 40 + h + 40 + h + 40 + big.height + 60
    S = Image.new('RGB', (max(W, 3 * w + 4 * 30), H), (40, 40, 44)); dd = ImageDraw.Draw(S)
    y = 30
    for i, (im, name) in enumerate(((c, 'share card at 270'), (p, 'poster at 270 (the wall)'), (bar, 'with a stand-in linen bar'))):
        x = 30 + i * (w + 30); S.paste(im, (x, y)); dd.text((x, y + max(h, p.height) + 6), name, fill=(220, 220, 220), font=font('GeistMono-Regular.ttf', 11))
    y += max(h, p.height) + 40
    S.paste(big, (30, y)); dd.text((30, y + big.height + 8), 'share card at 270, 3x hard pixels', fill=(220, 220, 220), font=font('GeistMono-Regular.ttf', 12))
    S = S.crop((0, 0, S.width, y + big.height + 34))
    S.save(out); print('wrote', out, S.size)


if __name__ == '__main__':
    main(*sys.argv[1:4])
