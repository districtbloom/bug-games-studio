from pv import *
P0 = pn('nacre', 0.3)
vs = [
 view('gf', stage_js(look='away', dist=6, fov=0.6) + NOCREATURE, neb=0.12),
 view('gfc', stage_js(look='away', dist=6, fov=0.6), neb=0.12),
 view('gb', stage_js(look='umbra', dist=14, fov=0.2) + thin_eclipse_js() + NOCREATURE, keep=['umbra'], sunburst=0.2, neb=0.05, light=[-0.6,0.45,-0.55]),
 view('gbc', stage_js(look='umbra', dist=14, fov=0.2) + thin_eclipse_js(), keep=['umbra'], sunburst=0.2, neb=0.05, light=[-0.6,0.45,-0.55]),
 view('gp', NOCREATURE, pn=P0, theta=0.0, dist=3.0, up=3.5, ty=0.3, fov=0.8, cleared='s'),
 view('gpc', '', pn=P0, theta=0.0, dist=3.0, up=3.5, ty=0.3, fov=0.8, cleared='s'),
]
run(vs, 306, 243, 1, WORK + '/t1')
