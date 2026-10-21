from pv import *
LK = [-0.45, 0.7, 0.45]
T = dict(world='nacre', solo=True, keep=[], neb=0.05, light=LK, dof=0.2, lx=-0.5, ly=0.35, sunburst=False)
vs = [
 view('a', orbit2_js(DN=260, dC=8.0, ox=0.17, oy=-0.15, aimR=0.06, aimU=-0.03, face=0.0, alpha=0.0), ownRings=True, **T),
 view('b', orbit2_js(DN=200, dC=8.0, ox=0.2, oy=-0.17, aimR=0.08, aimU=-0.05, face=0.0, alpha=0.0) + world_ring_js(k=1.6, tilt=-0.3, w=0.45), ownRings=False, **T),
 view('c', orbit2_js(DN=220, el=0.3, dC=8.0, ox=0.2, oy=-0.15, aimR=0.08, aimU=-0.04, face=0.0, alpha=0.0), ownRings=True, **T),
]
run(vs, 400, 400, 1, WORK + '/tt5')
