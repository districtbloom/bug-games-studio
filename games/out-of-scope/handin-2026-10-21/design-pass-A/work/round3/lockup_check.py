#!/usr/bin/env python3
"""Title-lockup check: the delivered PNG scaled down as a page would scale it (Lanczos), at its stated
minimum width and a few larger ones, on night (#0B0910) and linen (#F1ECE4); then the minimum width at
4x with hard pixels, with the measured letter height printed.

  python3 work/round3/lockup_check.py bug/title-lockup.png out.png 92 61 140 220 430
"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

NIGHT, LINEN = (11, 9, 16), (241, 236, 228)
F = '/home/claude/designpass/pack/tools/fonts/'
CAP = 718 / 3640.86          # cap height / lockup width (font units: caps 718, lockup box 3640.86)


def font(s):
    try: return ImageFont.truetype(F + 'GeistMono-Regular.ttf', s)
    except Exception: return ImageFont.load_default()


def main(src, out, widths):
    im = Image.open(src).convert('RGBA'); ws = [int(w) for w in widths]; mn = ws[0]
    sm = {w: im.resize((w, round(w * im.height / im.width)), Image.LANCZOS) for w in ws}
    rowh = max(t.height for t in sm.values()) + 46
    big = sm[mn].resize((mn * 4, sm[mn].height * 4), Image.NEAREST)
    W = max(sum(max(w, 130) for w in ws) + 40 * (len(ws) + 1), 2 * big.width + 120)
    H = 2 * rowh + big.height + 90
    S = Image.new('RGB', (W, H), (40, 40, 44)); d = ImageDraw.Draw(S)
    for r, bg in enumerate((NIGHT, LINEN)):
        y = r * rowh; d.rectangle((0, y, W, y + rowh - 4), fill=bg); x = 40
        for w in ws:
            t = sm[w]; S.paste(t, (x, y + 10), t)
            d.text((x, y + rowh - 28), f'{w}px · caps {CAP * w:.1f}px', fill=(130, 126, 140), font=font(11)); x += max(w, 130) + 40
    y = 2 * rowh + 10
    for k, bg in enumerate((NIGHT, LINEN)):
        x = 40 + k * (big.width + 40); d.rectangle((x - 10, y - 6, x + big.width + 10, y + big.height + 6), fill=bg)
        S.paste(big, (x, y), big)
    d.text((40, y + big.height + 14), f'minimum width {mn}px at 4x, hard pixels (night, linen) · letters {CAP * mn:.1f}px tall', fill=(220, 220, 220), font=font(13))
    S.save(out); print('wrote', out, S.size)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3:])
