import sys
from PIL import Image
# usage: crop.py shot.png plate out.png [scale]
P={'a':(40,64,760,380),'b':(840,64,560,380),'c':(40,488,150,370),'d':(230,488,270,370),'e':(540,488,420,370),'f':(1000,488,400,370)}
im=Image.open(sys.argv[1]); x,y,w,h=P[sys.argv[2]]; s=float(sys.argv[4]) if len(sys.argv)>4 else 1
c=im.crop((x,y,x+w,y+h))
if s!=1: c=c.resize((int(w*s),int(h*s)),Image.LANCZOS)
c.save(sys.argv[3])
