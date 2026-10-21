"""Check board for the small marks: each at 1x on night (#0B0910) and on linen (#F1ECE4) beside three other games' icons
(cropped from the pack's reference screenshots, for this board only), at 4x with hard pixels, and the master.

usage: python3 mk_check.py <out.png> [icon.png emblem.png chip.png]
"""
import sys
from PIL import Image, ImageDraw, ImageFont

REF = '/tmp/claude-0/-home-claude/abf4d099-0c77-5d2d-a155-12d3f9d77b55/scratchpad/packB/bug-games-design-pass-B/reference/16-profile.png'
FONT = '/tmp/claude-0/-home-claude/abf4d099-0c77-5d2d-a155-12d3f9d77b55/scratchpad/packB/bug-games-design-pass-B/tools/fonts'
NIGHT, LINEN = (11, 9, 16), (241, 236, 228)
# 42x42 game icons in the profile's "Played lately" list: Night Swim, Miradouro, Typos
OTHERS = {'Night Swim': (54, 1774), 'Miradouro': (54, 1850), 'Typos': (54, 2002)}


def others(px):
    a = Image.open(REF).convert('RGB')
    return [(n, a.crop((x, y, x + 42, y + 42)).resize((px, px), Image.LANCZOS)) for n, (x, y) in OTHERS.items()]


def font(sz):
    import glob
    fs = sorted(glob.glob(FONT + '/*.ttf'))
    try:
        return ImageFont.truetype(fs[0], sz)
    except Exception:
        return ImageFont.load_default()


def row(board, d, y, marks, px, bg, label, f):
    """a row of tiles at 1x on bg: ours first, then the three others"""
    W = board.width
    d.rectangle((0, y, W, y + px + 40), fill=bg)
    d.text((16, y + 6), label, fill=(150, 140, 160) if bg == NIGHT else (90, 80, 90), font=f)
    x = 16
    for im in marks:
        board.paste(im, (x, y + 24)); x += px + 14
    return y + px + 40


def main():
    out = sys.argv[1]
    paths = sys.argv[2:] or ['/home/claude/passB/bug/icon-46.png', '/home/claude/passB/bug/emblem-30.png', '/home/claude/passB/bug/chip-64.png']
    icon, emb, chip = [Image.open(p).convert('RGB') for p in paths]
    f = font(12)
    W = 1100
    board = Image.new('RGB', (W, 2000), NIGHT); d = ImageDraw.Draw(board)
    y = 0
    for size, im, name in ((46, icon, 'icon 46'), (30, emb, 'emblem 30'), (64, chip, 'chip 64')):
        one = im.resize((size, size), Image.LANCZOS)  # shown at 1x (the master is 2x)
        oth = [o for _, o in others(size)]
        for bg, bgn in ((NIGHT, 'night #0B0910'), (LINEN, 'linen #F1ECE4')):
            y = row(board, d, y, [one] + oth, size, bg, f'{name} at 1x on {bgn}  ·  Perlune, Night Swim, Miradouro, Typos', f)
    # 4x hard pixels of the 1x marks, beside the three other games' icons at the same 4x
    for size, im, name in ((46, icon, 'icon 46'), (30, emb, 'emblem 30'), (64, chip, 'chip 64')):
        y += 10; d.text((16, y), f'{name} at 4x, hard pixels  ·  Perlune, Night Swim, Miradouro, Typos', fill=(150, 140, 160), font=f); y += 22
        x = 16
        for t in [im.resize((size, size), Image.LANCZOS)] + [o for _, o in others(size)]:
            board.paste(t.resize((size * 4, size * 4), Image.NEAREST), (x, y)); x += size * 4 + 12
        y += size * 4 + 8
    # look-alike watch: the roster game with a purple ringed planet with two eyes must not be confused with ours
    y += 10; d.text((16, y), 'look-alike watch at 1x: Perlune icon + emblem beside the roster planet-with-eyes game', fill=(150, 140, 160), font=f); y += 22
    a = Image.open(REF).convert('RGB').crop((54, 2154, 96, 2196))
    x = 16
    for t in (icon.resize((46, 46), Image.LANCZOS), a.resize((46, 46), Image.LANCZOS), emb.resize((30, 30), Image.LANCZOS), a.resize((30, 30), Image.LANCZOS)):
        board.paste(t, (x, y)); x += t.width + 14
    y += 60
    d.text((16, y), 'masters at 1:1 (92, 60, 128)', fill=(150, 140, 160), font=f); y += 22
    y2 = y
    x = 16
    for im in (icon, emb, chip):
        board.paste(im, (x, y2)); x += im.width + 16
    board = board.crop((0, 0, W, y2 + 140))
    board.save(out); print('wrote', out, board.size)


if __name__ == '__main__':
    main()
