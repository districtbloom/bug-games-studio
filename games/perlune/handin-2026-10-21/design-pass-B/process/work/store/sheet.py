"""Contact sheet: python3 sheet.py out.png img1 img2 ...  -> row at full size (scaled to 400), row at 169, row at 40 (x1 and x3 nearest),
black-fill silhouette row (pixels brighter than the tile's ground) and greyscale row."""
import sys
import numpy as np
from PIL import Image, ImageOps

out, files = sys.argv[1], sys.argv[2:]
ims = [Image.open(f).convert('RGB') for f in files]
n = len(ims)
G = 16
W = n * (400 + G) + G
rows = []
# full
rows.append([im.resize((400, 400), Image.LANCZOS) for im in ims])
H = G + 400 + G + 169 + G + 120 + G + 169 + G + 169 + G
sheet = Image.new('RGB', (W, H), (24, 22, 30))
y = G
for i, im in enumerate(ims):
    sheet.paste(im.resize((400, 400), Image.LANCZOS), (G + i * (400 + G), y))
y += 400 + G
for i, im in enumerate(ims):
    sheet.paste(im.resize((169, 169), Image.LANCZOS), (G + i * (400 + G), y))
    s40 = im.resize((40, 40), Image.LANCZOS)
    sheet.paste(s40, (G + i * (400 + G) + 169 + G, y))
    sheet.paste(s40.resize((120, 120), Image.NEAREST), (G + i * (400 + G) + 169 + G + 40 + G, y))
y += 169 + G
for i, im in enumerate(ims):
    s40 = im.resize((40, 40), Image.LANCZOS)
    # silhouette at 40: what stands out from the ground -> black on white
    a = np.asarray(s40.convert('L')).astype(float)
    bg = np.median(np.concatenate([a[:6].ravel(), a[:, :6].ravel(), a[:, -6:].ravel()]))
    m = (np.abs(a - bg) > 28)
    sil = Image.fromarray(np.where(m, 0, 255).astype(np.uint8)).convert('RGB')
    sheet.paste(sil.resize((120, 120), Image.NEAREST), (G + i * (400 + G), y))
    sheet.paste(ImageOps.grayscale(s40).convert('RGB').resize((120, 120), Image.NEAREST), (G + i * (400 + G) + 136, y))
    sheet.paste(ImageOps.grayscale(im.resize((120, 120), Image.LANCZOS)).convert('RGB'), (G + i * (400 + G) + 272, y))
y += 120 + G
sheet = sheet.crop((0, 0, W, y))
sheet.save(out)
print('sheet ->', out)
