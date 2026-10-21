from pv import *
LK = [-0.45, 0.7, 0.45]
T = dict(world='nacre', solo=True, keep=[], ownRings=False, neb=0.05, light=LK, dof=0.3, lx=-0.3, ly=0.4, sunburst=False)
vs = [
 view('a', orbit_scene_js(lift=55, el=0.12, dist=6.5, aim=0.22, aim_side=1.2, aim_up=1.0, width=0.08, arc=3.4, fov=0.8), **T),
 view('b', orbit_scene_js(lift=70, el=0.18, dist=7.0, aim=0.2, aim_side=-1.5, aim_up=2.0, width=0.08, arc=3.4, fov=0.8, tilt=0.3), **T),
 view('c', orbit_scene_js(lift=60, el=-0.12, dist=6.5, aim=0.22, aim_side=1.5, aim_up=-1.0, width=0.08, arc=3.4, fov=0.8, tilt=-0.3), **T),
 view('d', orbit_scene_js(lift=80, el=0.1, dist=7.5, aim=0.18, aim_side=0.0, aim_up=3.5, width=0.08, arc=3.6, fov=0.75, tilt=0.5), **T),
]
run(vs, 400, 400, 1, WORK + '/tt2')
