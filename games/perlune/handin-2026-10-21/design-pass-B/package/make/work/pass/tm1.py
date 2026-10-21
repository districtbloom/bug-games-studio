from pv import *
P = dict(solo=True, keep=[], neb=0.0, bg=False, grain=0.0, dof=0.0, light=[-0.45, 0.7, 0.45], sunburst=False)
M0 = dict(P, bloom=0.0, streak=0.0)
vs = [
 view('next', marker_js('next'), **P), view('nextM', marker_js('next', matte=True), **M0),
 view('held', marker_js('held'), **P), view('heldM', marker_js('held', matte=True), **M0),
]
run(vs, 192, 192, 2, WORK + '/tm1')
