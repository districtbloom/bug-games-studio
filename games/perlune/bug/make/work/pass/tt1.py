from pv import *
LK = [-0.45, 0.7, 0.45]
T = dict(world='nacre', solo=True, keep=[], ownRings=False, neb=0.05, light=LK, dof=0.3, lx=0.2, ly=0.4, sunburst=False)
vs = [
 view('a', orbit_scene_js(), **T),
 view('b', orbit_scene_js(el=0.3, dist=6.0, aim=0.4, arc=4.2, tilt=0.25), **T),
 view('c', orbit_scene_js(el=0.55, dist=8.0, aim=0.5, cam_side=-2.0, aim_up=-3, arc=3.0), **T),
 view('d', orbit_scene_js(el=0.2, dist=5.5, aim=0.35, cam_side=2.0, aim_up=4, tilt=-0.35, arc=4.0), **T),
]
run(vs, 400, 400, 1, WORK + '/tt1')
