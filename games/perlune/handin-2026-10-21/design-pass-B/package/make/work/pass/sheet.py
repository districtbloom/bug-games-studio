import sys
from PIL import Image, ImageDraw
# usage: sheet.py out.png cols scale files...
out, cols, sc = sys.argv[1], int(sys.argv[2]), float(sys.argv[3]); fs = sys.argv[4:]
ims = [Image.open(f).convert('RGB') for f in fs]
w = max(int(i.width*sc) for i in ims); h = max(int(i.height*sc) for i in ims)
rows = (len(ims)+cols-1)//cols
S = Image.new('RGB', (cols*(w+6)+6, rows*(h+20)+6), (40,40,48)); d = ImageDraw.Draw(S)
for k,(im,f) in enumerate(zip(ims,fs)):
    x = 6 + (k%cols)*(w+6); y = 6 + (k//cols)*(h+20)
    S.paste(im.resize((int(im.width*sc), int(im.height*sc)), Image.LANCZOS), (x, y+14)); d.text((x, y), f.split('/')[-1], fill=(220,220,220))
S.save(out)
