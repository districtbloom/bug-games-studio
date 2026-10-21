from pv import *
import math
LK = [-0.45, 0.7, 0.45]
def cv(az, el): return [math.cos(az)*math.cos(el), math.sin(el), math.sin(az)*math.cos(el)]
def pole(el=0.55, az=3.4, lift=2.4, dist=5.5, **k):
    a = dict(world='nacre', ud=[0,1,0], lift=lift, camv=cv(az, el), dist=dist, fov=0.6); a.update(k); return stage_js(**a)
T = dict(neb=0.05, light=LK, dof=0.3, lx=0.2, ly=0.5, ownRings=True)
vs = [
 view('g1', pole() + NOCREATURE, **T),
 view('t1', pole(el=0.4, dist=7.0, fov=0.75, ty=-0.3), **T),
 view('t2', pole(el=0.3, dist=7.0, fov=0.8, ty=0.2, az=2.4), **T),
 view('t3', pole(el=0.48, dist=6.5, fov=0.8, ty=-0.6, az=4.4, lift=3.0), **T),
]
run(vs, 400, 400, 1, WORK + '/tt7')
