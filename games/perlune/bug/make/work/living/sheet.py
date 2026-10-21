import sys, glob, re
from PIL import Image, ImageDraw
P={'a':(40,64,760,380),'b':(840,64,560,380),'c':(40,488,150,370),'d':(230,488,270,370),'e':(540,488,420,370),'f':(1000,488,400,370)}
plate=sys.argv[1]; out=sys.argv[2]; scale=float(sys.argv[3]) if len(sys.argv)>3 else 1
files=sorted(glob.glob('shots/HarnessPerluneLiving-poster-1440-t*.png'), key=lambda f:int(re.findall(r't(\d+)',f)[0]))
x,y,w,h=P[plate]; W=int(w*scale); H=int(h*scale)
cols=4 if W<500 else 2
rows=(len(files)+cols-1)//cols
sheet=Image.new('RGB',(cols*(W+6),rows*(H+20)),(20,16,25)); d=ImageDraw.Draw(sheet)
for i,f in enumerate(files):
    im=Image.open(f).crop((x,y,x+w,y+h)).resize((W,H),Image.LANCZOS)
    cx=(i%cols)*(W+6); cy=(i//cols)*(H+20)
    sheet.paste(im,(cx,cy+18)); d.text((cx+2,cy+2),re.findall(r't\d+',f)[0],fill=(220,220,220))
sheet.save(out)
