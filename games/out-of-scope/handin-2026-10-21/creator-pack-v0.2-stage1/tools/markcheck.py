# small-mark check: 1x on night and on linen, beside 3 stand-in marks; and 4x nearest-neighbour
import sys
from PIL import Image, ImageDraw
out = sys.argv[1]; marks = sys.argv[2:]   # path:display_px
NIGHT, LINEN = (5, 4, 7), (239, 233, 220)
S = Image.new('RGB', (900, 330), (30, 30, 30)); d = ImageDraw.Draw(S)
x = 10
for bg in (NIGHT, LINEN):
    tile = Image.new('RGB', (420, 120), bg); tx = 14
    for m in marks:
        p, px = m.split(':'); px = int(px); im = Image.open(p).convert('RGBA').resize((px, px), Image.LANCZOS)
        tile.paste(im, (tx, 60 - px // 2), im); tx += px + 18
    # three neutral stand-ins (a blob, a gem, a letter) so the mark is judged beside other shapes
    td = ImageDraw.Draw(tile)
    td.ellipse((tx, 40, tx + 40, 80), fill=(120, 140, 210)); tx += 58
    td.polygon([(tx + 20, 38), (tx + 40, 60), (tx + 20, 82), (tx, 60)], fill=(220, 120, 160)); tx += 58
    td.text((tx, 48), 'Aa', fill=(90, 90, 90) if bg == LINEN else (200, 200, 200))
    S.paste(tile, (x, 10)); x += 440
x = 10
for m in marks:
    p, px = m.split(':'); im = Image.open(p).convert('RGBA'); big = im.resize((im.width * 2, im.height * 2), Image.NEAREST)
    bg = Image.new('RGB', big.size, NIGHT); bg.paste(big, (0, 0), big); S.paste(bg, (x, 140)); x += big.width + 20
S.save(out); print(out)
