from pv import *
import math
LK = [-0.45, 0.7, 0.45]
def cv(az, el): return [math.cos(az)*math.cos(el), math.sin(el), math.sin(az)*math.cos(el)]
def pole(el=0.55, az=3.4, lift=2.4, dist=5.5, **k):
    a = dict(world='nacre', ud=[0,1,0], lift=lift, camv=cv(az, el), dist=dist, fov=0.6); a.update(k); return stage_js(**a)
T = dict(neb=0.05, light=LK, dof=0.3, lx=0.2, ly=0.5, ownRings=True)
vs = [
 view('a', pole(az=0.4, el=0.25, dist=7.0, fov=0.8, ty=-0.4), **T),
 view('b', pole(az=0.4, el=0.15, dist=7.0, fov=0.9, ty=-0.8), **T),
 view('c', pole(az=0.9, el=0.22, dist=7.0, fov=0.85, ty=-0.6), **T),
 view('d', pole(az=0.4, el=0.35, dist=6.0, fov=0.9, ty=-0.9, lift=1.6), **T),
]
run(vs, 400, 400, 1, WORK + '/tt8')
