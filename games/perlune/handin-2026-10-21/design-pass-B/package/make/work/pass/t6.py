from pv import *
import math
LB = [-0.6,0.45,-0.55]
LK = [-0.45, 0.7, 0.45]
def cv(az, el): return [math.cos(az)*math.cos(el), math.sin(el), math.sin(az)*math.cos(el)]
def pole(el=0.6, az=3.4, lift=2.4, dist=5.5, **k):
    a = dict(world='nacre', ud=[0,1,0], lift=lift, camv=cv(az, el), dist=dist, fov=0.6); a.update(k); return stage_js(**a)
MT = [(-1.15,-0.4,0.3),(-1.55,-0.1,0.8),(-1.75,0.35,1.25),(-2.25,0.3,1.5),(-2.45,0.75,1.75),(-2.95,0.6,1.9),(-3.2,0.95,2.0)]
vs = [
 view('gpA', pole(0.55) + NOCREATURE, neb=0.05, light=LK, dof=0.4),
 view('gpB', pole(0.75) + NOCREATURE, neb=0.05, light=LK, dof=0.4),
 view('gpC', pole(0.75, lift=1.6, dist=5.0) + NOCREATURE, neb=0.05, light=LK, dof=0.4),
 view('nacre', pole(0.55) + NACRE_SKIN, neb=0.05, light=LK, dof=0.4, ly=0.6),
 view('ring', pole(0.55, dist=6.2) + ringlet_js(rad=1.35, tiltX=0.45, tiltZ=-0.85, beads=24, bead=0.09), neb=0.05, light=LK, dof=0.4, ly=0.6),
 view('ring2', pole(0.55, dist=6.2) + ringlet_js(rad=1.35, tiltX=0.62, tiltZ=0.75, beads=24, bead=0.09), neb=0.05, light=LK, dof=0.4, ly=0.6),
 view('mote', stage_js(look='away', dist=7.0, fov=0.6, face=0.45, side=0.55, ty=0.15, pitch=-0.06) + mote_trail_js(pts=MT, size=0.2, strip=0.0), neb=0.05, lx=0.6, ly=0.3, light=LK),
 view('blinkA', stage_js(look='umbra', dist=10.5, fov=0.22, ty=0.08) + thin_eclipse_js((16,0.6),(10,0.3), 0.2) + dim_umbra_js(0.15) + eclipse_eyes_js(rim='#ffe9f4', rimEmit=3.0, glow='#d9a6ff', glowEmit=0.45, rays=3.0, round=1.0, rimR=1.0, fwd=0.05), keep=['umbra'], sunburst=0.12, neb=0.04, light=LB, dof=0.25, ly=0.1),
 view('blinkB', stage_js(look='umbra', dist=10.5, fov=0.22, ty=0.08) + thin_eclipse_js((16,0.6),(10,0.3), 0.2) + dim_umbra_js(0.15) + eclipse_eyes_js(rim='#fff4e6', rimEmit=2.0, glow='#ffd9b0', glowEmit=0.0, rays=4.0, round=1.0, rimR=0.97, fwd=0.04), keep=['umbra'], sunburst=0.12, neb=0.04, light=LB, dof=0.25, ly=0.1),
]
run(vs, 306, 243, 1, WORK + '/t6')
