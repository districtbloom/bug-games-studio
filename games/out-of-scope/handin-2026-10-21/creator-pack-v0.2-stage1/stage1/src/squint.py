# the creator kit's preview sizes for a 2:1 poster: 740x370, 260x367, 150x177, 90x70 (centre crops around the focus), on night
import sys
from PIL import Image, ImageDraw
src, out = sys.argv[1], sys.argv[2]; fx, fy = (float(sys.argv[3]), float(sys.argv[4])) if len(sys.argv) > 4 else (.5, .45)
im = Image.open(src).convert('RGB'); W, H = im.size
def crop(w, h):
    r = w / h
    if r > W / H: cw, ch = W, W / r
    else: cw, ch = H * r, H
    x = min(max(fx * W - cw / 2, 0), W - cw); y = min(max(fy * H - ch / 2, 0), H - ch)
    return im.crop((int(x), int(y), int(x + cw), int(y + ch))).resize((w, h), Image.LANCZOS)
S = Image.new('RGB', (740 + 260 + 150 + 90 + 100, 400), (5, 4, 7)); d = ImageDraw.Draw(S); x = 10
for w, h in [(740, 370), (260, 367), (150, 177), (90, 70)]:
    S.paste(crop(w, h), (x, 10)); d.text((x, 385), f'{w}x{h}', fill=(200, 200, 200)); x += w + 20
S.save(out); print(out)
