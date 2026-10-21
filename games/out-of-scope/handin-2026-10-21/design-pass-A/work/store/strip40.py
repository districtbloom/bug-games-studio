import sys
from PIL import Image, ImageOps
ids=['cobalt-glove','tank-globe','marker-trail','googly-eyes','ok-mug']
src = sys.argv[1] if len(sys.argv)>1 else 'bug/store/%s.png'
out = sys.argv[2] if len(sys.argv)>2 else 'work/store/strip40.png'
NIGHT,LINEN=(11,9,16),(241,236,228)
S=Image.new('RGB',(5*(40*4+20)+20, 2*(40+20)+40*4+40),(40,40,44))
for r,bg in enumerate((NIGHT,LINEN)):
    for i,n in enumerate(ids):
        im=Image.open(src%n).convert('RGBA').resize((40,40),Image.LANCZOS)
        b=Image.new('RGB',(60,60),bg); b.paste(im,(10,10),im); S.paste(b,(20+i*60,10+r*60))
for i,n in enumerate(ids):
    im=Image.open(src%n).convert('RGBA').resize((40,40),Image.LANCZOS).resize((160,160),Image.NEAREST)
    b=Image.new('RGB',(160,160),NIGHT); b.paste(im,(0,0),im); S.paste(b,(20+i*180,140))
S.save(out); print('wrote',out)
