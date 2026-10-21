"""compare variants: python3 -I compare.py <display px> <out.png> a.png b.png ...
each variant at 1x on night and linen, then 4x nearest, labelled by index."""
import sys
from PIL import Image, ImageDraw
D, out, files = int(sys.argv[1]), sys.argv[2], sys.argv[3:]
NIGHT, LINEN = (0x0b, 0x09, 0x10), (0xF1, 0xEC, 0xE4)
g = 10
ims = [Image.open(f).convert('RGB').resize((D, D), Image.BOX) for f in files]
W = len(ims) * (D * 4 + 20) + 20
H = 20 + (D + 2 * g) * 2 + 20 + D * 4 + 30
S = Image.new('RGB', (W, H), (60, 58, 64)); d = ImageDraw.Draw(S)
for i, im in enumerate(ims):
    x0 = 20 + i * (D * 4 + 20)
    for j, bg in enumerate((NIGHT, LINEN)):
        t = Image.new('RGB', (D + 2 * g, D + 2 * g), bg); t.paste(im, (g, g)); S.paste(t, (x0 + j * (D + 2 * g + 6), 10))
    S.paste(im.resize((D * 4, D * 4), Image.NEAREST), (x0, 30 + (D + 2 * g)))
    d.text((x0, H - 22), f'{i}: {files[i].split("/")[-1]}', fill=(230, 230, 230))
S.save(out); print(out, S.size)
