# Contact sheet of rendered test frames (each frame scaled to fit a cell, its name under it).
import sys, os, glob
from PIL import Image, ImageDraw
src, out, pat = sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else '*'
files = sorted(glob.glob(os.path.join(src, pat + '.png')))
CW, CH, cols = 300, 230, 5
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * CW, rows * CH), (20, 16, 25))
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert('RGB'); s = min((CW - 10) / im.width, (CH - 26) / im.height, 1.0)
    im = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)
    x, y = (i % cols) * CW + 5, (i // cols) * CH + 5
    sheet.paste(im, (x, y)); d.text((x, y + CH - 22), os.path.basename(f)[:-4], fill=(200, 190, 220))
sheet.save(out); print(out, len(files))
