from pv import *
P0 = pn('nacre', 0.3)
L = [-0.6,0.45,-0.55]
vs = [
 view('gf1', stage_js(look='away', dist=6, fov=0.6) + NOCREATURE, neb=0.05),
 view('gf2', stage_js(look='away', dist=6, fov=0.6, cam=0.8, pitch=-0.25) + NOCREATURE, neb=0.07),
 view('gb1', stage_js(look='umbra', dist=14, fov=0.2) + thin_eclipse_js((14,0.8),(10,0.3)) + dim_umbra_js(0.25) + NOCREATURE, keep=['umbra'], sunburst=0.12, neb=0.04, light=L),
 view('gb2', stage_js(look='umbra', dist=14, fov=0.16) + thin_eclipse_js((20,1.0),(12,0.35)) + dim_umbra_js(0.12) + NOCREATURE, keep=['umbra'], sunburst=0.1, neb=0.04, light=L),
 view('gp1', NOCREATURE, pn=P0, theta=0.0, dist=5.0, up=1.6, ty=1.2, fov=0.8, cleared='s', nodecor=False),
 view('gp2', NOCREATURE, pn=P0, theta=2.0, dist=4.0, up=2.4, ty=0.6, fov=0.8, cleared='s', nodecor=False, dof=0.3),
 view('gp3', NOCREATURE, pn=P0, theta=2.0, dist=4.0, up=2.4, ty=0.6, fov=0.8, cleared='s', nodecor=True, dof=0.3),
 view('gp4', '', pn=P0, theta=2.0, dist=4.0, up=2.4, ty=0.6, fov=0.8, cleared='s', nodecor=False, dof=0.3),
]
run(vs, 306, 243, 1, WORK + '/t2')
