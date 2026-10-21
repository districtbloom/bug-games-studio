from pv import *
import math
LK = [-0.45, 0.7, 0.45]
def cv(az, el): return [math.cos(az)*math.cos(el), math.sin(el), math.sin(az)*math.cos(el)]
def pole(el=0.55, az=3.4, lift=2.4, dist=5.5, **k):
    a = dict(world='nacre', ud=[0,1,0], lift=lift, camv=cv(az, el), dist=dist, fov=0.6); a.update(k); return stage_js(**a)
T = dict(neb=0.05, light=LK, dof=0.3, lx=0.2, ly=0.6, ownRings=True)
vs = [
 view('a', pole(az=0.4, el=0.12, dist=7.0, fov=0.9, ty=0.9, lift=1.3), **T),
 view('b', pole(az=0.4, el=0.05, dist=7.5, fov=0.95, ty=1.2, lift=1.0), **T),
 view('c', pole(az=0.55, el=0.1, dist=6.5, fov=1.0, ty=1.4, lift=1.2), **T),
 view('d', pole(az=0.4, el=0.0, dist=7.0, fov=1.0, ty=1.0, lift=1.4), **T),
]
run(vs, 400, 400, 1, WORK + '/tt9')
