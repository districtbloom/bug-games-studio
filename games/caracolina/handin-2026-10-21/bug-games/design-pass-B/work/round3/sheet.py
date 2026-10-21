import sys
from PIL import Image, ImageDraw
out=sys.argv[1]; files=sys.argv[2:]
ims=[Image.open(f).convert('RGB') for f in files]
W=max(i.width for i in ims); H=sum(i.height+18 for i in ims)
S=Image.new('RGB',(W,H),(20,20,30)); d=ImageDraw.Draw(S); y=0
for f,i in zip(files,ims):
    d.text((4,y+3),f.split('/')[-1],fill=(255,255,255)); S.paste(i,(0,y+18)); y+=i.height+18
S.save(out)
