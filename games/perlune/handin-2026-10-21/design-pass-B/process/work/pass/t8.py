from pv import *
import math
LK = [-0.45, 0.7, 0.45]
def cv(az, el): return [math.cos(az)*math.cos(el), math.sin(el), math.sin(az)*math.cos(el)]
def pole(el=0.55, az=3.4, lift=2.4, dist=5.5, **k):
    a = dict(world='nacre', ud=[0,1,0], lift=lift, camv=cv(az, el), dist=dist, fov=0.6); a.update(k); return stage_js(**a)
MT = [(-1.05,-0.5,0.35),(-1.32,-0.2,0.95),(-1.45,0.22,1.45),(-1.85,0.1,1.8),(-1.95,0.55,2.1),(-2.3,0.42,2.4),(-2.35,0.8,2.7)]
vs = [
 view('mote', stage_js(look='away', dist=6.4, fov=0.6, face=0.5, side=0.05, ty=0.1) + mote_trail_js(pts=MT, size=0.16, emit=2.0, strip=0.0), neb=0.05, lx=0.7, ly=0.35, light=LK),
 view('r1', pole(dist=6.2) + ringlet_js(rad=1.35, tiltX=0.3, tiltZ=-0.5, beads=30, bead=0.085), neb=0.05, light=LK, dof=0.4, ly=0.6),
 view('r2', pole(dist=6.2) + ringlet_js(rad=1.35, tiltX=1.2, tiltZ=-0.35, beads=30, bead=0.085), neb=0.05, light=LK, dof=0.4, ly=0.6),
 view('r3', pole(dist=6.2) + ringlet_js(rad=1.35, tiltX=0.75, tiltZ=0.45, beads=30, bead=0.085), neb=0.05, light=LK, dof=0.4, ly=0.6),
 view('r4', pole(dist=6.2) + ringlet_js(rad=1.25, tiltX=1.35, tiltZ=0.0, beads=30, bead=0.085), neb=0.05, light=LK, dof=0.4, ly=0.6),
]
run(vs, 306, 243, 1, WORK + '/t8')
