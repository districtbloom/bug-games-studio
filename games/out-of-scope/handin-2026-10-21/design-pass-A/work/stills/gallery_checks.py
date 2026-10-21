"""Gallery check sheets: all six slides at 100 px wide, and each cropped to its central 4:3 (1067x800).
usage: python3 work/stills/gallery_checks.py"""
from PIL import Image, ImageDraw
G = '/home/claude/designpass/bug/gallery/%02d.png'
OUT = '/home/claude/designpass/bug/checks/stills/'
NIGHT, LINEN = (11, 9, 16), (241, 236, 228)
ims = [Image.open(G % i).convert('RGB') for i in range(1, 7)]
# 100 px wide (100x50), on night and on linen, plus a 4x nearest blow-up row to see what survives
S = Image.new('RGB', (20 + 6 * 112, 20 + 50 + 20 + 50 + 20 + 200 + 20), NIGHT); d = ImageDraw.Draw(S)
d.rectangle((0, 90, S.width, 160), fill=LINEN)
for i, im in enumerate(ims):
    t = im.resize((100, 50), Image.LANCZOS); x = 20 + i * 112
    S.paste(t, (x, 20)); S.paste(t, (x, 100))
    S.paste(t.resize((100, 50), Image.NEAREST).resize((100, 50)), (x, 100))
for i, im in enumerate(ims):
    t = im.resize((100, 50), Image.LANCZOS).resize((200, 100), Image.NEAREST)
    S.paste(t, (20 + (i % 3) * 220, 180 + (i // 3) * 110))
S.save(OUT + 'gallery-100.png')
# central 4:3
W = 1067; x0 = (1600 - W) // 2
T = Image.new('RGB', (3 * 540 + 40, 2 * 405 + 30), NIGHT)
for i, im in enumerate(ims):
    c = im.crop((x0, 0, x0 + W, 800)).resize((533, 400), Image.LANCZOS)
    T.paste(c, (10 + (i % 3) * 543, 10 + (i // 3) * 410))
T.save(OUT + 'gallery-4x3.png')
print('wrote', OUT + 'gallery-100.png', OUT + 'gallery-4x3.png')
