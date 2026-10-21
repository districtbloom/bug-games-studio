"""check sheet for one mark: python3 -I sheet.py <mark.png> <display px> <out.png> [label]
1x on night and on linen beside three other games' icons (cropped from the pack's reference
screenshot 16-profile.png, for this check only), then the same strip at 4x with hard pixels."""
import sys, os
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__))
B = os.path.abspath(os.path.join(HERE, '..', '..'))
REF = os.path.join(B, 'pack', 'reference', '16-profile.png')
NIGHT, LINEN = (0x0b, 0x09, 0x10), (0xF1, 0xEC, 0xE4)
mark, D, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
ref = Image.open(REF).convert('RGB')
# inner 40x40 boxes of the "Played lately" icons: Night Swim, Miradouro, Typos
others = [ref.crop((55, t + 1, 95, t + 41)) for t in (1774, 1850, 2002)]
others = [o.resize((D, D), Image.BICUBIC) for o in others]
m = Image.open(mark).convert('RGB').resize((D, D), Image.BOX)
gap = max(8, D // 4)

def strip(bg, items):
    W = gap + len(items) * (D + gap); H = D + 2 * gap
    s = Image.new('RGB', (W, H), bg)
    for i, it in enumerate(items): s.paste(it, (gap + i * (D + gap), gap))
    return s

# ours placed second from the right, between neighbours
items = [others[0], others[1], m, others[2]]
n1, l1 = strip(NIGHT, items), strip(LINEN, items)
n4 = n1.resize((n1.width * 4, n1.height * 4), Image.NEAREST)
l4 = l1.resize((l1.width * 4, l1.height * 4), Image.NEAREST)
master = Image.open(mark).convert('RGB')
W = max(n4.width, l4.width) + 40
H = 30 + n1.height * 2 + 20 + n4.height + l4.height + 40 + master.height * 2
sheet = Image.new('RGB', (W, H), (60, 58, 64)); d = ImageDraw.Draw(sheet)
y = 10
sheet.paste(n1, (20, y)); sheet.paste(l1, (40 + n1.width, y)); y += n1.height + 10
d.text((20, y), '1x  night | linen   (neighbours: Night Swim, Miradouro, [Caracolina], Typos)', fill=(220, 220, 220)); y += 20
sheet.paste(n4, (20, y)); y += n4.height + 10
sheet.paste(l4, (20, y)); y += l4.height + 10
d.text((20, y), '4x nearest neighbour above; master (2x) below, and master 2x nearest', fill=(220, 220, 220)); y += 20
sheet.paste(master, (20, y)); sheet.paste(master.resize((master.width * 2, master.height * 2), Image.NEAREST), (40 + master.width, y))
sheet.save(out)
print(out, sheet.size)
