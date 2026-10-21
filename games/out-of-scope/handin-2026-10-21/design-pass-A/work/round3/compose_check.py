#!/usr/bin/env python3
"""Round-3 backdrop check: the poster over the backdrop where a game page hero sits.

  python3 work/round3/compose_check.py desktop bug/backdrop.png bug/poster.png out.png
  python3 work/round3/compose_check.py phone bug/backdrop-phone.png bug/poster.png out.png

Desktop: the poster at 685 px wide in two plausible hero spots (left column; centred in the left 70 %),
the info rail as the right 30 % with stand-in grey copy bars and a stand-in Play pill, then the bare
backdrop, and a greyscale squint of the first layout (does the poster still lead?).
Phone: the poster as the phone page shows it (4:3 around the focus in publish.json), full width under
a stand-in top bar, stand-in copy and Play below it; plus the bare backdrop.
Everything drawn here except the two pictures is a stand-in, labelled as such.
"""
import json, sys
from PIL import Image, ImageDraw, ImageFont, ImageOps

F = '/home/claude/designpass/pack/tools/fonts/'
EMBER, NIGHT = (255, 90, 54), (11, 9, 16)


def font(n, s):
    try: return ImageFont.truetype(F + n, s)
    except Exception: return ImageFont.load_default()


def focus():
    try: f = json.load(open('/home/claude/designpass/bug/publish.json'))['focus']; return f['x'], f['y']
    except Exception: return .5, .5


def cover(im, w, h, fx=.5, fy=.5):
    s = max(w / im.width, h / im.height)
    big = im.resize((max(w, round(im.width * s)), max(h, round(im.height * s))), Image.LANCZOS)
    x = int(min(max(fx * big.width - w / 2, 0), big.width - w)); y = int(min(max(fy * big.height - h / 2, 0), big.height - h))
    return big.crop((x, y, x + w, y + h))


def rail(d, x0, y0, x1, scale=1.0, label=True):
    """stand-in info rail copy: title, maker, a Play pill, two lines of copy"""
    g = (226, 222, 214); g2 = (150, 146, 160)
    d.rectangle((x0, y0, x0 + int(230 * scale), y0 + int(26 * scale)), fill=g)
    d.rectangle((x0, y0 + int(40 * scale), x0 + int(140 * scale), y0 + int(52 * scale)), fill=g2)
    py = y0 + int(76 * scale)
    d.rounded_rectangle((x0, py, x0 + int(150 * scale), py + int(44 * scale)), radius=int(22 * scale), fill=EMBER)
    d.text((x0 + int(50 * scale), py + int(12 * scale)), 'Play', fill=(20, 10, 10), font=font('InstrumentSans-Bold.ttf', int(18 * scale)))
    for i, w in enumerate((300, 270, 210)):
        yy = py + int((70 + i * 22) * scale); d.rectangle((x0, yy, x0 + int(w * scale), yy + int(10 * scale)), fill=g2)
    if label: d.text((x0, py + int(150 * scale)), 'stand-in rail', fill=(120, 116, 130), font=font('GeistMono-Regular.ttf', int(11 * scale)))


def desktop(bd, po, out):
    B = Image.open(bd).convert('RGB'); P = Image.open(po).convert('RGB')
    W, H = B.size; pw = 685; ph = round(pw * P.height / P.width); Ps = P.resize((pw, ph), Image.LANCZOS)
    spots = [('hero left column (x 64, y 112)', 64, 112), ('hero centred in the left 70 % (x 161, y 112)', 161, 112)]
    pad = 30; S = Image.new('RGB', (W + 2 * pad, (H + 50) * 4 + pad), (40, 40, 44)); d = ImageDraw.Draw(S)
    first = None
    for i, (name, x, y) in enumerate(spots):
        C = B.copy(); C.paste(Ps, (x, y)); cd = ImageDraw.Draw(C)
        cd.rectangle((0, 0, W, 56), outline=(90, 86, 100)); cd.text((16, 20), 'stand-in top bar', fill=(120, 116, 130), font=font('GeistMono-Regular.ttf', 11))
        cd.line((int(W * .7), 56, int(W * .7), H), fill=(90, 86, 100))
        rail(cd, int(W * .7) + 40, 112, W)
        if first is None: first = C
        oy = pad + i * (H + 50); S.paste(C, (pad, oy)); d.text((pad, oy + H + 8), name + ' · poster 685 px wide · info rail = right 30 %', fill=(220, 220, 220), font=font('GeistMono-Regular.ttf', 13))
    oy = pad + 2 * (H + 50); S.paste(B, (pad, oy)); d.text((pad, oy + H + 8), 'backdrop alone', fill=(220, 220, 220), font=font('GeistMono-Regular.ttf', 13))
    oy = pad + 3 * (H + 50); S.paste(ImageOps.grayscale(first).convert('RGB'), (pad, oy)); d.text((pad, oy + H + 8), 'greyscale squint of the first layout: the poster should be the lightest, busiest thing', fill=(220, 220, 220), font=font('GeistMono-Regular.ttf', 13))
    S.save(out); print('wrote', out)


def phone(bd, po, out):
    B = Image.open(bd).convert('RGB'); P = Image.open(po).convert('RGB'); W, H = B.size
    fx, fy = focus(); top = 56; ph = round(W * 3 / 4); crop = cover(P, W, ph, fx, fy)
    C = B.copy(); C.paste(crop, (0, top)); cd = ImageDraw.Draw(C)
    cd.rectangle((0, 0, W, top), outline=(90, 86, 100)); cd.text((10, 22), 'stand-in top bar', fill=(120, 116, 130), font=font('GeistMono-Regular.ttf', 10))
    rail(cd, 16, top + ph + 22, W, scale=1.0)
    C2 = B.copy(); inset = 16; pw2 = W - 2 * inset; ph2 = round(pw2 * 3 / 4); C2.paste(cover(P, pw2, ph2, fx, fy), (inset, top + 12)); cd2 = ImageDraw.Draw(C2)
    rail(cd2, 16, top + 12 + ph2 + 22, W, scale=1.0)
    pad = 24; S = Image.new('RGB', (W * 4 + pad * 5, H + 70), (40, 40, 44)); d = ImageDraw.Draw(S)
    for i, (im, name) in enumerate(((C, '4:3 full width'), (C2, '4:3 inset 16'), (B, 'backdrop alone'), (ImageOps.grayscale(C).convert('RGB'), 'greyscale squint'))):
        S.paste(im, (pad + i * (W + pad), pad)); d.text((pad + i * (W + pad), pad + H + 8), name, fill=(220, 220, 220), font=font('GeistMono-Regular.ttf', 12))
    S.save(out); print('wrote', out)


if __name__ == '__main__':
    m = sys.argv[1]
    (desktop if m == 'desktop' else phone)(*sys.argv[2:5])
