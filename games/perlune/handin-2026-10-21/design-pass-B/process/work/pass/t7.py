from pv import *
import math
LB = [-0.6,0.45,-0.55]
LK = [-0.45, 0.7, 0.45]
def cv(az, el): return [math.cos(az)*math.cos(el), math.sin(el), math.sin(az)*math.cos(el)]
def pole(el=0.55, az=3.4, lift=2.4, dist=5.5, **k):
    a = dict(world='nacre', ud=[0,1,0], lift=lift, camv=cv(az, el), dist=dist, fov=0.6); a.update(k); return stage_js(**a)
MT = [(-1.05,-0.45,0.35),(-1.38,-0.12,0.95),(-1.5,0.3,1.45),(-1.95,0.2,1.75),(-2.05,0.62,2.05),(-2.45,0.5,2.3),(-2.55,0.85,2.55)]
ECL = thin_eclipse_js((16,0.6),(10,0.3), 0.2) + dim_umbra_js(0.15)
BUGCAM = dict(look='umbra', dist=10.5, fov=0.22, ty=0.08)
vs = [
 view('gf', stage_js(look='away', dist=6.0, fov=0.6) + NOCREATURE, neb=0.05, light=LK),
 view('mote', stage_js(look='away', dist=6.4, fov=0.6, face=0.5, side=0.35, ty=0.1, up=0.6) + mote_trail_js(pts=MT, size=0.19, emit=2.0, strip=0.0), neb=0.05, lx=0.7, ly=0.35, light=LK),
 view('crest', stage_js(look='away', dist=3.0, fov=0.6, face=-0.6, ty=1.05, side=-0.25, up=0.35) + pearl_crest_js(), neb=0.05, lx=-0.5, ly=0.6, light=LK),
 view('gb', stage_js(**BUGCAM) + ECL + NOCREATURE, keep=['umbra'], sunburst=0.12, neb=0.04, light=LB, dof=0.25),
 view('blink', stage_js(**BUGCAM) + ECL + eclipse_eyes_js(rim='#fff4e6', rimEmit=2.2, glowEmit=0.0, rays=3.0, round=1.0, rimR=0.98, fwd=0.04), keep=['umbra'], sunburst=0.12, neb=0.04, light=LB, dof=0.25, ly=0.1),
 view('gp', pole() + NOCREATURE, neb=0.05, light=LK, dof=0.4),
 view('nacre', pole() + NACRE_SKIN, neb=0.05, light=LK, dof=0.4, ly=0.6),
 view('prism', pole(dist=6.6, ty=0.5) + prism_halo_js(), form=11, neb=0.05, light=LK, dof=0.4, ly=0.6),
 view('ring', pole(dist=6.2) + ringlet_js(rad=1.35, tiltX=0.45, tiltZ=-0.85, beads=30, bead=0.085), neb=0.05, light=LK, dof=0.4, ly=0.6),
]
run(vs, 306, 243, 1, WORK + '/t7')
