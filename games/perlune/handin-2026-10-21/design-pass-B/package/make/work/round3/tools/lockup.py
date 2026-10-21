#!/usr/bin/env python3
"""Perlune title lockup, set fresh (no earlier picture reused).

Face: the game's own in-game display face is Tilt Prism (src/shell.html: #title h1 {font-family:'Tilt Prism';
letter-spacing:.01em; color:#F2ECF7}). It cannot be fetched in this workspace (the files in /home/claude/video/fonts are
378-byte error stubs and every font host is blocked). By the lead's decision the lockup is set in the lettering the game
has already published on its cover and trailers: TeX Gyre Adventor Bold, "PERLUNE" in capitals, tracked about +4 %,
filled with the game's iridescent sweep (--iri: linear-gradient(100deg, #ff9ad5 0%, #9ff6ff 30%, #ffe6a8 55%,
#c9a8ff 80%, #ff9ad5 100%), background-clip:text, as the game fills its display text), with a soft violet glow behind
(the game's resonance violet #B28CFF, a glow only) and a small cyan/magenta split (the game's glass #5FF3FF and dust
#FF5C9A, the way its lens splits colour). Re-run with --font <TiltPrism.ttf> --track 0.01 once the file is supplied.

usage:
  lockup.py --font <ttf/otf> [--track 0.04] [--out-dir /home/claude/passB/bug] [--share-art <1200x630 art>]
            [--check-dir /home/claude/passB/work/round3] [--min-cap 18] [--no-split] [--no-glow]
writes  <out-dir>/title-lockup.png   transparent master, 1600 px wide
        <out-dir>/title-lockup.json  {"file","min_width_px","font",...}
        <out-dir>/share-card.png     (with --share-art) the art with the lockup in its left plain zone
        <check-dir>/lockup-check-min.png  the lockup at its minimum width on night and on linen, 1x and 4x hard pixels
"""
import argparse, json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

TEXT = 'PERLUNE'
IRI = [(0.00, (0xff, 0x9a, 0xd5)), (0.30, (0x9f, 0xf6, 0xff)), (0.55, (0xff, 0xe6, 0xa8)), (0.80, (0xc9, 0xa8, 0xff)), (1.00, (0xff, 0x9a, 0xd5))]
VIOLET = (0xB2, 0x8C, 0xFF)   # the game's resonance violet (--res), used only as a glow
GLASS = (0x5F, 0xF3, 0xFF)    # --glass
DUST = (0xFF, 0x5C, 0x9A)     # --dust
NIGHT = (0x05, 0x04, 0x0A)    # --void
LINEN = (0xEE, 0xE7, 0xDA)    # the platform's linen bar (approx.)
APPROVED = {'Tilt Prism', 'TeX Gyre Adventor'}


def family(path):
    try:
        f = ImageFont.truetype(path, 20); return ' '.join(f.getname())
    except Exception as e:
        return 'unreadable (%s)' % e


def set_text(font_path, size, track_em):
    """L mask of TEXT with CSS-style letter-spacing (added after each glyph; pair kerning kept via raqm)."""
    f = ImageFont.truetype(font_path, size, layout_engine=ImageFont.Layout.RAQM)
    track = track_em * size
    xs = [f.getlength(TEXT[:i]) + i * track for i in range(len(TEXT))]
    W = int(f.getlength(TEXT) + len(TEXT) * track + size * 2); H = int(size * 2.2)
    m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
    for i, ch in enumerate(TEXT):
        d.text((size * 0.5 + xs[i], size * 0.5), ch, font=f, fill=255)
    return m, m.getbbox()


def iri_fill(w, h, angle_deg=100.0):
    """CSS linear-gradient(<angle>, --iri stops) painted over a w x h box."""
    a = math.radians(angle_deg)
    dx, dy = math.sin(a), -math.cos(a)  # CSS: 0deg = to top, 90deg = to right; screen y points down
    L = abs(w * dx) + abs(h * dy)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float64)
    t = np.clip(0.5 + ((xx + 0.5 - w / 2) * dx + (yy + 0.5 - h / 2) * dy) / L, 0, 1)
    out = np.zeros((h, w, 3))
    for (p0, c0), (p1, c1) in zip(IRI[:-1], IRI[1:]):
        k = np.clip((t - p0) / (p1 - p0), 0, 1)[..., None]
        sel = ((t >= p0) & (t <= p1))[..., None]
        out = np.where(sel, np.array(c0) * (1 - k) + np.array(c1) * k, out)
    return out


def over(dst_c, dst_a, src_c, src_a):
    """straight-alpha 'over'"""
    src_c = np.broadcast_to(np.asarray(src_c, np.float64), dst_c.shape)
    out_a = src_a + dst_a * (1 - src_a)
    out_c = (src_c * src_a[..., None] + dst_c * (dst_a * (1 - src_a))[..., None]) / np.maximum(out_a, 1e-6)[..., None]
    return out_c, out_a


def make_master(font_path, track, width=1600, pad_frac=0.06, glow=True, split=True):
    target = width * (1 - 2 * pad_frac)
    size = 200
    for _ in range(4):
        m, bb = set_text(font_path, size, track); size = size * target / (bb[2] - bb[0])
    size = int(round(size)); m, bb = set_text(font_path, size, track)
    ink = m.crop(bb); w, h = ink.size
    pad = int(round(width * pad_frac)); W = w + 2 * pad
    oy = pad + int(h * 0.25); H = h + 2 * oy                  # room above/below for the glow
    A = Image.new('L', (W, H), 0); A.paste(ink, (pad, oy))
    a_txt = np.asarray(A, np.float64) / 255.0
    C = np.zeros((H, W, 3)); Aout = np.zeros((H, W))
    if glow:   # soft violet glow behind the letters (two radii, like the game's bloom)
        g1 = np.asarray(A.filter(ImageFilter.GaussianBlur(h * 0.30)), np.float64) / 255.0
        g2 = np.asarray(A.filter(ImageFilter.GaussianBlur(h * 0.10)), np.float64) / 255.0
        ga = np.clip(g1 * 0.55 + g2 * 0.35, 0, 0.6)
        C, Aout = over(C, Aout, VIOLET, ga)
    if split:  # small cyan/magenta split: the game's lens fringe, offset 0.25 % of the width each way
        off = max(1, int(round(width * 0.0025)))
        for col, dx in ((GLASS, -off), (DUST, off)):
            C, Aout = over(C, Aout, col, np.roll(a_txt, dx, axis=1) * 0.55)
    C, Aout = over(C, Aout, iri_fill(W, H), a_txt)
    img = Image.fromarray(np.dstack([np.clip(C, 0, 255), np.clip(Aout * 255, 0, 255)]).astype(np.uint8), 'RGBA')
    if img.width != width:
        img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    return img, h / w, w / W, size   # cap/width (PERLUNE has no descenders), share of the master the letters span


def on(bg, lock, width):
    l = lock.resize((width, max(1, round(lock.height * width / lock.width))), Image.LANCZOS)
    c = Image.new('RGBA', (l.width + 16, l.height + 16), bg + (255,)); c.alpha_composite(l, (8, 8)); return c.convert('RGB')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--font', required=True)
    ap.add_argument('--track', type=float, default=0.04)
    ap.add_argument('--out-dir', default='/home/claude/passB/bug')
    ap.add_argument('--check-dir', default='/home/claude/passB/work/round3')
    ap.add_argument('--share-art')
    ap.add_argument('--min-cap', type=float, default=18.0)
    ap.add_argument('--share-letters', type=float, default=0.40, help='letters span this share of the card width, from 5%%')
    ap.add_argument('--share-y', type=float, default=0.60, help='vertical centre of the letters, share of the card height')
    ap.add_argument('--no-glow', action='store_true'); ap.add_argument('--no-split', action='store_true')
    a = ap.parse_args()
    fam = family(a.font)
    base = fam.replace(' Bold', '').replace(' Regular', '').strip()
    if base not in APPROVED:
        sys.exit(f'refusing: {a.font} is "{fam}"; approved faces: {sorted(APPROVED)}')
    os.makedirs(a.out_dir, exist_ok=True); os.makedirs(a.check_dir, exist_ok=True)
    img, cap_ratio, lf, size = make_master(a.font, a.track, glow=not a.no_glow, split=not a.no_split)
    min_w = int(math.ceil(a.min_cap / (cap_ratio * lf) / 10.0) * 10)
    img.save(os.path.join(a.out_dir, 'title-lockup.png'))
    meta = {'file': 'title-lockup.png', 'min_width_px': min_w, 'font': fam}
    if base != 'Tilt Prism':
        meta['note'] = ('The in-game title face is Tilt Prism, which cannot be fetched here; this lockup is set in the '
                        'lettering the game already published on its cover and trailers. Re-set it in Tilt Prism once the font file is supplied.')
    json.dump(meta, open(os.path.join(a.out_dir, 'title-lockup.json'), 'w'), indent=1)
    print('lockup', img.size, '|', fam, 'size', size, 'track', a.track, '| cap/width %.3f, letters span %.2f of the master' % (cap_ratio, lf),
          '| min_width_px', min_w, '(letters %.1f px tall there)' % (min_w * lf * cap_ratio))
    n1, l1 = on(NIGHT, img, min_w), on(LINEN, img, min_w)
    sw = n1.width
    sheet = Image.new('RGB', (sw * 5 + 30, n1.height * 8 + 20), (60, 60, 60))
    sheet.paste(n1, (0, 0)); sheet.paste(l1, (0, n1.height + 6))
    sheet.paste(n1.resize((sw * 4, n1.height * 4), Image.NEAREST), (sw + 20, 0))
    sheet.paste(l1.resize((sw * 4, l1.height * 4), Image.NEAREST), (sw + 20, n1.height * 4 + 10))
    sheet.save(os.path.join(a.check_dir, 'lockup-check-min.png'))
    if a.share_art:
        art = Image.open(a.share_art).convert('RGBA'); W, H = art.size
        letters_w = a.share_letters * W                        # letters from 5 % of the width into the left plain zone
        lw = int(round(letters_w / lf))
        l = img.resize((lw, round(img.height * lw / img.width)), Image.LANCZOS)
        x = int(W * 0.05 - lw * (1 - lf) / 2)
        y = int(H * a.share_y - l.height / 2)                  # below the Eclipse, clear of the bottom band
        art.alpha_composite(l, (x, y))
        out = os.path.join(a.out_dir, 'share-card.png'); art.convert('RGB').save(out)
        print('share card ->', out, '| letters %d px wide; at a 270 px preview %d px wide, %.1f px tall' % (letters_w, letters_w * 270 / W, letters_w * 270 / W * cap_ratio))


if __name__ == '__main__':
    main()
