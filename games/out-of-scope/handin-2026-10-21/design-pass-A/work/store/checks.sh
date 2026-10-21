set -e
cd /home/claude/designpass
for i in cobalt-glove tank-globe marker-trail googly-eyes ok-mug; do
  python3 tools/previews.py sizes bug/checks/store/$i-sizes.png bug/store/$i.png 40 80 120 169
  python3 tools/previews.py sizes bug/checks/store/$i-silhouette.png work/store/item-$i.png 40 80 120 169
done
python3 work/store/strip40.py bug/store/%s.png bug/checks/store/store-40px.png
python3 work/store/frames.py bug/checks/store/reward-frames.png 0 120 140 250 400 600 900
python3 tools/previews.py sizes bug/checks/store/reward-held-alone-sizes.png bug/reward-held.png 40 80 120 169
python3 - <<'PY'
from PIL import Image, ImageDraw, ImageFont
D='/home/claude/designpass/'
F=ImageFont.truetype(D+'pack/tools/fonts/GeistMono-Regular.ttf',12)
B=ImageFont.truetype(D+'pack/tools/fonts/InstrumentSans-Bold.ttf',30)
NIGHT,LINEN=(11,9,16),(241,236,228)
ids=['cobalt-glove','tank-globe','marker-trail','googly-eyes','ok-mug']
# 1. held frame on every tile at 40 / 80 / 169, night and linen
h=Image.open(D+'bug/reward-held.png'); sizes=[40,80,169]; rowh=169+40
S=Image.new('RGB',(20+5*(sum(sizes)+3*14+24),2*rowh+40),(40,40,44)); d=ImageDraw.Draw(S)
for r,bg in enumerate((NIGHT,LINEN)):
    y0=20+r*rowh; d.rectangle((0,y0-10,S.width,y0+rowh-20),fill=bg); x=20
    for n in ids:
        t=Image.open(D+f'bug/store/{n}.png').convert('RGBA'); t.alpha_composite(h)
        for s in sizes:
            S.paste(t.resize((s,s),Image.LANCZOS),(x,y0+169-s)); x+=s+14
        x+=24
d.text((20,2*rowh+16),'owned mark, held frame (bug/reward-held.png) on every store tile at 40, 80, 169 px; night and linen',fill=(200,200,200),font=F)
S.save(D+'bug/checks/store/reward-held-sizes.png')
# 2. update at 104x52
im=Image.open(D+'bug/updates/case-02.png').convert('RGB'); th=Image.open(D+'bug/updates/case-02-thumb.png').convert('RGB')
S=Image.new('RGB',(1000,620),(40,40,44)); d=ImageDraw.Draw(S)
d.rectangle((0,0,1000,300),fill=NIGHT); d.rectangle((0,300,1000,620),fill=LINEN)
S.paste(im.resize((480,240),Image.LANCZOS),(20,20)); d.text((20,266),'case-02.png at 480x240',fill=(200,200,200),font=F)
S.paste(im.crop((267,0,1333,800)).resize((320,240),Image.LANCZOS),(520,20)); d.text((520,266),'central 4:3 (phone crop)',fill=(200,200,200),font=F)
S.paste(th,(20,320)); d.text((20,480),'case-02-thumb.png 308x154',fill=(60,60,60),font=F)
s104=im.resize((104,52),Image.LANCZOS); S.paste(s104,(360,320)); d.text((360,378),'104x52',fill=(60,60,60),font=F)
S.paste(th.resize((104,52),Image.LANCZOS),(490,320)); d.text((490,378),'thumb at 104x52',fill=(60,60,60),font=F)
S.paste(s104.resize((416,208),Image.NEAREST),(360,400)); d.text((780,590),'104x52, 4x nearest',fill=(60,60,60),font=F)
S.save(D+'bug/checks/store/case-02-small.png')
# 3. banner with the left 45% covered, and the right 55% alone
im=Image.open(D+'bug/events/mail-day-banner.png').convert('RGB')
S=Image.new('RGB',(900,1060),NIGHT); d=ImageDraw.Draw(S)
s=im.resize((860,300),Image.LANCZOS); S.paste(s,(20,20)); d.text((20,326),'banner as shown, 860x300',fill=(200,200,200),font=F)
c=s.copy(); dc=ImageDraw.Draw(c); dc.rectangle((0,0,387,300),fill=(60,58,66))
dc.text((24,40),'Mail Day',fill=(255,255,255),font=B); dc.text((24,86),'stand-in copy (platform)',fill=(210,210,210),font=F)
dc.rounded_rectangle((24,220,140,260),radius=8,outline=(210,210,210),width=2); dc.text((58,233),'Join',fill=(230,230,230),font=F)
S.paste(c,(20,360)); d.text((20,666),'left 45% covered (387 of 860 px): stand-in copy and Join',fill=(200,200,200),font=F)
S.paste(im.crop((774,0,1720,600)).resize((473,300),Image.LANCZOS),(20,700)); d.text((20,1006),'right 55% alone (946x600 at 473x300)',fill=(200,200,200),font=F)
S.paste(im.crop((774,0,1720,600)).resize((237,150),Image.LANCZOS),(520,700)); d.text((520,856),'right 55% at 237x150',fill=(200,200,200),font=F)
S.save(D+'bug/checks/store/mail-day-banner-cover.png')
print('sheets ok')
PY
