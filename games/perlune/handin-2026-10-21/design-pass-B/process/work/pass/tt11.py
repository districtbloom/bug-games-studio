from pv import *
import math
LK = [-0.45, 0.7, 0.45]
def cv(az, el): return [math.cos(az)*math.cos(el), math.sin(el), math.sin(az)*math.cos(el)]
def pole(el=0.55, az=3.4, lift=2.4, dist=5.5, **k):
    a = dict(world='nacre', ud=[0,1,0], lift=lift, camv=cv(az, el), dist=dist, fov=0.6); a.update(k); return stage_js(**a)
T = dict(neb=0.05, light=LK, dof=0.3, lx=0.15, ly=0.8, ownRings=True)
vs = [
 view('a', pole(az=0.4, el=0.62, dist=5.2, fov=1.0, ty=0.05, lift=1.6), **T),
 view('b', pole(az=0.4, el=0.66, dist=5.0, fov=1.05, ty=0.2, lift=1.6), **T),
 view('c', pole(az=0.3, el=0.6, dist=5.4, fov=1.0, ty=0.15, lift=1.8, side=0.0), **T),
]
run(vs, 400, 400, 1, WORK + '/tt11')
