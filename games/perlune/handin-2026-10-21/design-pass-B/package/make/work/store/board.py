"""Store contact board: each tile at 169 and 40 px (1x, and 40 px blown up x3 with hard pixels), on night and on linen,
as a black fill (silhouette, from an item-only render of the same view) and in greyscale; plus a store-row mock.
No names, prices or counts are lettered; the row mock shows the platform's slots as plain grey bars."""
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

B = '/home/claude/passB/bug/store/'
W_ = '/home/claude/passB/work/store/'
IDS = ['opal', 'smoke-glass', 'glass-halo', 'ribbon-trail', 'moonlet']
FONT = '/tmp/claude-0/-home-claude/abf4d099-0c77-5d2d-a155-12d3f9d77b55/scratchpad/packB/bug-games-design-pass-B/tools/fonts/'
import glob
fonts = sorted(glob.glob(FONT + '*.ttf'))
f = ImageFont.truetype(fonts[0], 14) if fonts else ImageFont.load_default()
NIGHT, LINEN, INK = (20, 17, 28), (238, 232, 220), (200, 196, 210)

cols = 5; cw = 300; G = 20
H = 40 + 190 + 40 + 140 + 30 + 140 + 30 + 140 + 30 + 260
board = Image.new('RGB', (G + cols * cw, H), NIGHT)
d = ImageDraw.Draw(board)
y0 = 12
d.text((G, y0), 'Perlune store tiles (proposed looks) · 169 px · 40 px on night / linen · x3 hard pixels · black fill · greyscale', fill=INK, font=f)
for i, n in enumerate(IDS):
    im = Image.open(B + n + '.png').convert('RGB')
    x = G + i * cw; y = 40
    d.text((x, y), n, fill=INK, font=f); y += 20
    board.paste(im.resize((169, 169), Image.LANCZOS), (x, y)); y += 169 + 20
    s40 = im.resize((40, 40), Image.LANCZOS)
    # 40 px on night and on linen plates
    board.paste(Image.new('RGB', (60, 60), NIGHT), (x, y)); board.paste(s40, (x + 10, y + 10))
    board.paste(Image.new('RGB', (60, 60), LINEN), (x + 70, y)); board.paste(s40, (x + 80, y + 10))
    board.paste(s40.resize((120, 120), Image.NEAREST), (x + 150, y)); y += 140
    # black fill: the item alone (rendered with the ground and sky off), as a solid black shape on white
    sil = np.asarray(Image.open(W_ + 'sil-' + n + '.png').convert('L').resize((400, 400), Image.LANCZOS)).astype(float)
    m = sil > 18
    S = Image.fromarray(np.where(m, 0, 255).astype(np.uint8)).convert('RGB')
    board.paste(S.resize((120, 120), Image.LANCZOS), (x, y))
    board.paste(S.resize((40, 40), Image.LANCZOS), (x + 140, y))
    board.paste(S.resize((40, 40), Image.LANCZOS).resize((80, 80), Image.NEAREST), (x + 190, y))
    y += 140 + 30
    g = ImageOps.grayscale(im)
    board.paste(g.resize((120, 120), Image.LANCZOS).convert('RGB'), (x, y))
    g40 = g.resize((40, 40), Image.LANCZOS)
    board.paste(g40.convert('RGB'), (x + 140, y))
    board.paste(g40.resize((80, 80), Image.NEAREST).convert('RGB'), (x + 190, y))
    y += 140 + 30
# store row mock (the platform's card: art, then a row under it; slots drawn as plain grey bars, no names or prices)
y = 40 + 20 + 189 + 140 + 170 + 170 + 10
d.text((G, y), 'store row mock at 169 px (the row under the art is the platform\'s; drawn as grey bars, nothing lettered)', fill=INK, font=f)
y += 24
for i, n in enumerate(IDS):
    x = G + i * (169 + 16)
    im = Image.open(B + n + '.png').convert('RGB').resize((169, 169), Image.LANCZOS)
    d.rectangle([x - 1, y - 1, x + 169, y + 169 + 110], fill=(14, 12, 20), outline=(46, 42, 58))
    board.paste(im, (x, y))
    d.rectangle([x + 10, y + 169 + 14, x + 110, y + 169 + 26], fill=(70, 66, 84))
    d.rectangle([x + 10, y + 169 + 34, x + 140, y + 169 + 42], fill=(48, 45, 60))
    d.rectangle([x + 10, y + 169 + 72, x + 50, y + 169 + 84], fill=(48, 45, 60))
    d.rectangle([x + 110, y + 169 + 64, x + 160, y + 169 + 92], outline=(90, 86, 110))
    if i in (0, 3):  # corner stamps where NEW / YOURS sit: plain boxes
        d.rectangle([x + 169 - 52, y + 8, x + 169 - 8, y + 24], outline=(196, 181, 255))
        d.rectangle([x + 8, y + 8, x + 44, y + 24], outline=(200, 196, 210))
board = board.crop((0, 0, board.width, y + 169 + 120))
board.save(W_ + 'contact-board.png')
print('->', W_ + 'contact-board.png', board.size)
