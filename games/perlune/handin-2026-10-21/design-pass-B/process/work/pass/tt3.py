from pv import *
LK = [-0.45, 0.7, 0.45]
T = dict(world='nacre', solo=True, keep=[], ownRings=False, neb=0.05, light=LK, dof=0.25, lx=0.3, ly=0.35, sunburst=False)
vs = [
 view('a', orbit2_js(), **T),
 view('b', orbit2_js(el=0.2, ox=0.22, oy=-0.12, tilt=0.15), **T),
 view('c', orbit2_js(el=0.05, ox=0.2, oy=-0.2, tilt=-0.2, sgn=-1), **T),
 view('d', orbit2_js(az=2.2, el=0.15, ox=0.21, oy=-0.15), **T),
]
run(vs, 400, 400, 1, WORK + '/tt3')
