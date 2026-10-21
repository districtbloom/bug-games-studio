from pv import *
import math
LK = [-0.45, 0.7, 0.45]
def cv(az, el): return [math.cos(az)*math.cos(el), math.sin(el), math.sin(az)*math.cos(el)]
T = dict(neb=0.05, light=LK, dof=0.3, lx=0.15, ly=0.95, ownRings=True)
def tv(id, el, dist, fov, ty, lift=1.6, az=0.4):
    return view(id, stage_js(world='nacre', ud=[0, 1, 0], lift=lift, camv=cv(az, el), dist=dist, fov=fov, ty=ty), **T)
vs = [tv('a', 0.52, 5.6, 1.0, 0.55), tv('b', 0.5, 5.4, 1.05, 0.75), tv('c', 0.48, 5.8, 1.1, 0.8, lift=1.4)]
run(vs, 400, 400, 1, WORK + '/tt12')
