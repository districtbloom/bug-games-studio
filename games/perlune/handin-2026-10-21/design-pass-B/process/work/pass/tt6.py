from pv import *
import numpy as np
LK = [-0.45, 0.7, 0.45]
A = np.array([0.28, 1, 0.12]); A /= np.linalg.norm(A)
h = np.cross(A, [0, 0, 1.0]); h /= np.linalg.norm(h)
def mk(lat=40, e=0.25, rot=0.0):
    t = np.radians(90 - lat)  # angle from the ring axis
    # rotate h around A by rot
    k = A; hr = h*np.cos(rot) + np.cross(k, h)*np.sin(rot) + k*np.dot(k, h)*(1-np.cos(rot))
    ud = A*np.cos(t) + hr*np.sin(t)
    # local north (toward the pole) at C
    north = A - ud*np.dot(A, ud); north /= np.linalg.norm(north)
    d = north*np.cos(e) + ud*np.sin(e)   # camera on the pole side, raised by e
    return [round(x, 4) for x in ud], [round(x, 4) for x in d]
T = dict(neb=0.05, light=LK, dof=0.3, lx=0.3, ly=0.45, ownRings=True)
vs = []
for i, (lat, e, rot, dist, ty) in enumerate([(35, 0.25, 0.0, 6.5, 1.2), (25, 0.2, 0.6, 6.5, 1.6), (45, 0.3, -0.6, 6.5, 1.0), (30, 0.1, 1.2, 7.0, 2.0)]):
    ud, d = mk(lat, e, rot)
    vs.append(view('r%d' % i, stage_js(world='nacre', ud=ud, lift=2.4, camv=d, dist=dist, ty=ty, fov=0.75), **T))
run(vs, 400, 400, 1, WORK + '/tt6')
