import sys, glob, re
from PIL import Image, ImageDraw
# usage: msheet.py prefix out.png cols scale [tmin tmax]
pre, out, cols, sc = sys.argv[1], sys.argv[2], int(sys.argv[3]), float(sys.argv[4])
tmin = float(sys.argv[5]) if len(sys.argv) > 5 else -1; tmax = float(sys.argv[6]) if len(sys.argv) > 6 else 1e9
fs = sorted(glob.glob(f'out/motion/{pre}-*.png'))
fs = [f for f in fs if tmin <= int(re.findall(r'-(\d+)\.png', f)[0]) / 100 <= tmax]
ims = [Image.open(f).convert('RGB') for f in fs]
W = max(i.width for i in ims); H = max(i.height for i in ims)
w, h = int(W * sc), int(H * sc); rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (cols * (w + 4), rows * (h + 16)), (24, 20, 30)); d = ImageDraw.Draw(S)
for k, (f, im) in enumerate(zip(fs, ims)):
    x = (k % cols) * (w + 4); y = (k // cols) * (h + 16)
    S.paste(im.resize((int(im.width * sc), int(im.height * sc)), Image.LANCZOS), (x, y + 14)); d.text((x + 2, y + 1), str(int(re.findall(r'-(\d+)\.png', f)[0]) / 100), fill=(230, 230, 230))
S.save(out)
