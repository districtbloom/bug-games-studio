from pv import *
import math
LK = [-0.45, 0.7, 0.45]
def cv(az, el): return [math.cos(az)*math.cos(el), math.sin(el), math.sin(az)*math.cos(el)]
def pole(el=0.55, az=3.4, lift=2.4, dist=5.5, **k):
    a = dict(world='nacre', ud=[0,1,0], lift=lift, camv=cv(az, el), dist=dist, fov=0.6); a.update(k); return stage_js(**a)
T = dict(neb=0.05, light=LK, dof=0.35, lx=0.35, ly=0.45)
vs = [
 view('a', pole(el=0.5, dist=7.5, ty=-0.6, face=0.35) + limb_orbit_js(arc=1.4), **T),
 view('b', pole(el=0.42, dist=8.0, ty=-0.9, face=0.35, lift=3.2) + limb_orbit_js(arc=1.6, lean=0.25), **T),
 view('c', pole(el=0.62, dist=8.0, ty=-1.2, face=0.35, lift=3.2) + limb_orbit_js(arc=1.6, lean=-0.3, w0=0.1), **T),
 view('d', pole(el=0.5, dist=8.5, ty=-0.8, face=0.35, lift=4.0, side=0.6) + limb_orbit_js(arc=2.0, lean=0.5, w0=0.1), **T),
]
run(vs, 400, 400, 1, WORK + '/tt4')
