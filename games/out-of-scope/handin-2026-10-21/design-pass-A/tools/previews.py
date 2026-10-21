#!/usr/bin/env python3
"""Preview sheets for the checks DIRECTION.md asks for.

  python3 tools/previews.py squint bug/poster.png out.png [fx fy]
      the poster at 740x370, 260x367, 150x177, 90x70 (covered and cropped around the focus), plus a 4:3 crop
  python3 tools/previews.py marks out.png bug/icon-46.png:46 [bug/emblem-30.png:30 ...]
      each mark 1x on night (#0B0910) and on linen (#F1ECE4) beside three other games' stand-in marks,
      then 4x with hard (nearest) pixels
  python3 tools/previews.py strip out.png 32 a.png b.png ...
      every picture at N px in one strip, on night and on linen (the seal strip check)
  python3 tools/previews.py sizes out.png pic.png 40 120 169 ...
      one picture at several widths, on night and linen, plus greyscale and black-fill versions
  python3 tools/previews.py card out.png key-still.png
      the Continue card at 360x176 and 132x66
  python3 tools/previews.py over out.png result-still.png
      a stand-in headline and numbers printed over the result picture at 800x176
"""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageOps

NIGHT, LINEN = (11, 9, 16), (241, 236, 228)
F = '/home/claude/designpass/pack/tools/fonts/'


def font(n, s):
    try: return ImageFont.truetype(F + n, s)
    except Exception: return ImageFont.load_default()


def cover(im, w, h, fx=.5, fy=.5):
    s = max(w / im.width, h / im.height)
    big = im.resize((max(w, round(im.width * s)), max(h, round(im.height * s))), Image.LANCZOS)
    x = int(min(max(fx * big.width - w / 2, 0), big.width - w)); y = int(min(max(fy * big.height - h / 2, 0), big.height - h))
    return big.crop((x, y, x + w, y + h))


def squint(src, out, fx=.5, fy=.5):
    im = Image.open(src).convert('RGB')
    sizes = [(740, 370), (260, 367), (150, 177), (90, 70)]
    W = sum(w for w, _ in sizes) + 20 * 6 + 300
    S = Image.new('RGB', (W, 430), NIGHT); d = ImageDraw.Draw(S); x = 20
    for w, h in sizes:
        S.paste(cover(im, w, h, fx, fy), (x, 20)); d.text((x, 400), f'{w}x{h}', fill=(170, 170, 170), font=font('GeistMono-Regular.ttf', 12)); x += w + 20
    S.paste(cover(im, 280, 210, fx, fy), (x, 20)); d.text((x, 400), '4:3 around focus', fill=(170, 170, 170), font=font('GeistMono-Regular.ttf', 12))
    S.save(out); print('wrote', out)


def marks(out, specs):
    ims = []
    for s in specs:
        p, px = s.rsplit(':', 1); ims.append((Image.open(p).convert('RGBA'), int(px), p))
    rowh = max(px for _, px, _ in ims) + 40
    W = 1100; H = 2 * rowh + 40 + max(im.height * 4 for im, _, _ in ims) + 60
    S = Image.new('RGB', (W, H), (40, 40, 44)); d = ImageDraw.Draw(S)
    for r, bg in enumerate((NIGHT, LINEN)):
        y0 = 20 + r * (rowh + 10)
        d.rectangle((20, y0, W - 20, y0 + rowh), fill=bg)
        x = 40
        for im, px, _ in ims:
            t = im.resize((px, px), Image.LANCZOS); S.paste(t, (x, y0 + (rowh - px) // 2), t); x += px + 28
        # three stand-in marks from "other games": a striped square, a two-tone square, a face square
        for k in range(3):
            px = ims[0][1]; yy = y0 + (rowh - px) // 2
            if k == 0:
                d.rectangle((x, yy, x + px, yy + px), fill=(46, 92, 160))
                for i in range(0, px, 8): d.rectangle((x, yy + i, x + px, yy + i + 3), fill=(240, 200, 120))
            elif k == 1:
                d.rectangle((x, yy, x + px, yy + px), fill=(232, 228, 214)); d.polygon([(x, yy + px), (x + px, yy), (x + px, yy + px)], fill=(220, 70, 90))
            else:
                d.rectangle((x, yy, x + px, yy + px), fill=(30, 120, 90)); d.ellipse((x + px * .2, yy + px * .3, x + px * .4, yy + px * .5), fill=(255, 255, 255)); d.ellipse((x + px * .6, yy + px * .3, x + px * .8, yy + px * .5), fill=(255, 255, 255))
            x += px + 28
    y = 20 + 2 * (rowh + 10) + 20; x = 40
    for im, px, p in ims:
        b = im.resize((px, px), Image.LANCZOS).resize((px * 4, px * 4), Image.NEAREST)
        bg = Image.new('RGB', b.size, NIGHT); bg.paste(b, (0, 0), b); S.paste(bg, (x, y))
        d.text((x, y + b.height + 6), f'{p.split("/")[-1]} at {px}px, 4x nearest', fill=(200, 200, 200), font=font('GeistMono-Regular.ttf', 12)); x += b.width + 30
    S.save(out); print('wrote', out)


def strip(out, px, paths):
    n = len(paths); W = 20 + n * (px + 8) + 20
    S = Image.new('RGB', (max(W, 200), 2 * (px + 20) + 20), NIGHT); d = ImageDraw.Draw(S)
    d.rectangle((0, px + 30, S.width, S.height), fill=LINEN)
    for r in range(2):
        x = 20
        for p in paths:
            im = Image.open(p).convert('RGBA').resize((px, px), Image.LANCZOS)
            S.paste(im, (x, 10 + r * (px + 30)), im); x += px + 8
    S.save(out); print('wrote', out)


def sizes(out, src, widths):
    im = Image.open(src).convert('RGBA')
    ws = [int(w) for w in widths]
    hs = [round(w * im.height / im.width) for w in ws]
    W = sum(ws) + 20 * (len(ws) + 1); rowh = max(hs) + 20
    S = Image.new('RGB', (max(W, 300), rowh * 4 + 20), (40, 40, 44))
    variants = [('night', NIGHT, lambda t: t), ('linen', LINEN, lambda t: t),
                ('grey', NIGHT, lambda t: ImageOps.grayscale(t.convert('RGB')).convert('RGBA')),
                ('black fill', LINEN, lambda t: Image.merge('RGBA', (*Image.new('RGB', t.size, (0, 0, 0)).split(), t.split()[3])))]
    for r, (name, bg, f) in enumerate(variants):
        y = 10 + r * rowh; ImageDraw.Draw(S).rectangle((0, y - 5, S.width, y + rowh - 15), fill=bg); x = 20
        for w, h in zip(ws, hs):
            t = f(im.resize((w, h), Image.LANCZOS)); S.paste(t, (x, y), t); x += w + 20
    S.save(out); print('wrote', out)


def card(out, src):
    im = Image.open(src).convert('RGB')
    S = Image.new('RGB', (640, 260), NIGHT); d = ImageDraw.Draw(S)
    S.paste(im.resize((360, 176), Image.LANCZOS), (20, 20)); S.paste(im.resize((132, 66), Image.LANCZOS), (420, 20))
    d.text((20, 205), 'Continue card 360x176', fill=(200, 200, 200), font=font('GeistMono-Regular.ttf', 12))
    d.text((420, 95), 'game page 132x66', fill=(200, 200, 200), font=font('GeistMono-Regular.ttf', 12))
    S.save(out); print('wrote', out)


def over(out, src):
    im = Image.open(src).convert('RGB').resize((800, 176), Image.LANCZOS)
    S = Image.new('RGB', (840, 216), NIGHT); S.paste(im, (20, 20)); d = ImageDraw.Draw(S)
    d.text((44, 44), 'Case closed', fill=(255, 255, 255), font=font('InstrumentSans-Bold.ttf', 30))
    d.text((44, 92), '3 lies broken · 98% · 15:44', fill=(230, 230, 230), font=font('GeistMono-Regular.ttf', 16))
    d.text((620, 150), 'stand-in words', fill=(160, 160, 160), font=font('GeistMono-Regular.ttf', 11))
    S.save(out); print('wrote', out)


if __name__ == '__main__':
    m, a = sys.argv[1], sys.argv[2:]
    if m == 'squint': squint(a[0], a[1], *(float(v) for v in a[2:4])) if len(a) > 2 else squint(a[0], a[1])
    elif m == 'marks': marks(a[0], a[1:])
    elif m == 'strip': strip(a[0], int(a[1]), a[2:])
    elif m == 'sizes': sizes(a[0], a[1], a[2:])
    elif m == 'card': card(a[0], a[1])
    elif m == 'over': over(a[0], a[1])
