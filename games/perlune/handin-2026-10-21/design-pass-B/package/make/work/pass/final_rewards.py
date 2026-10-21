"""Finals: the three row grounds and the six rewards, rendered by the game at 612x486 and reduced to 306x243."""
from pv import *
import math, sys
from PIL import Image
LB = [-0.6, 0.45, -0.55]   # the poster's key: from behind-left, the Eclipse side
LK = [-0.45, 0.7, 0.45]    # upper-left key in front (the game's default family)
def cv(az, el): return [math.cos(az)*math.cos(el), math.sin(el), math.sin(az)*math.cos(el)]
def pole(el=0.55, az=3.4, lift=2.4, dist=5.5, **k):   # floating over Nacre's woken pole, looking down onto the pearl limb
    a = dict(world='nacre', ud=[0, 1, 0], lift=lift, camv=cv(az, el), dist=dist, fov=0.6); a.update(k); return stage_js(**a)
MT = [(-0.95,-0.5,0.35),(-1.2,-0.2,0.95),(-1.3,0.2,1.45),(-1.62,0.08,1.85),(-1.7,0.5,2.2),(-1.98,0.38,2.55),(-2.02,0.74,2.85)]
ECL = thin_eclipse_js((16, 0.42), (10, 0.3), 0.2) + dim_umbra_js(0.15)
BUGCAM = dict(look='umbra', dist=10.5, fov=0.22, ty=0.08)
FREE = dict(neb=0.05, light=LK)
PASS = dict(neb=0.05, light=LK, dof=0.4)
BUG = dict(keep=['umbra'], sunburst=0.1, neb=0.04, light=LB, dof=0.25)
V = {
 'ground-free': view('ground-free', stage_js(look='away', dist=6.0, fov=0.6) + NOCREATURE, **FREE),
 'mote-trail': view('mote-trail', stage_js(look='away', dist=6.2, fov=0.6, face=0.5, side=0.2, ty=0.1) + mote_trail_js(pts=MT, size=0.16, emit=2.0, strip=0.0), lx=0.7, ly=0.35, **FREE),
 'pearl-crest': view('pearl-crest', stage_js(look='away', dist=3.0, fov=0.6, face=-0.6, ty=1.05, side=-0.25, up=0.35) + pearl_crest_js(), lx=-0.5, ly=0.6, **FREE),
 'ground-bug': view('ground-bug', stage_js(**BUGCAM) + ECL + NOCREATURE, **BUG),
 'eclipse-blink': view('eclipse-blink', stage_js(**dict(BUGCAM, dist=10.2, ty=0.1)) + ECL + eclipse_eyes_js(rim='#fff4e6', rimEmit=2.6, glowEmit=0.0, rays=3.0, round=1.0, rimR=0.98, fwd=0.09, big=1.35, lift=0.05), ly=0.1, **BUG),
 'ground-pass': view('ground-pass', pole() + NOCREATURE, **PASS),
 'nacre-skin': view('nacre-skin', pole() + NACRE_SKIN, ly=0.6, **PASS),
 'prism-halo': view('prism-halo', pole(dist=6.6, ty=0.5) + prism_halo_js(), form=11, ly=0.6, **PASS),
 'ringlet': view('ringlet', pole(dist=6.2) + ringlet_js(rad=1.35, tiltX=0.3, tiltZ=-0.5, beads=34, bead=0.07), ly=0.6, **PASS),
}
ids = sys.argv[1].split(',') if len(sys.argv) > 1 else list(V)
pre = WORK + '/fin'
run([V[i] for i in ids], 306, 243, 2, pre)
for i in ids:
    im = Image.open(f'{pre}-{i}.png').convert('RGB'); assert im.size == (612, 486), im.size
    im.resize((306, 243), Image.LANCZOS).save(f'/home/claude/passB/bug/pass/{i}.png'); print('saved', i)
