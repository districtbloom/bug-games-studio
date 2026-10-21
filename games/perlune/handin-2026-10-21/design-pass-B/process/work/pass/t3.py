from pv import *
P0 = pn('nacre', 0.3)
LB = [-0.6,0.45,-0.55]
MT = [(1.25,-0.35,0.5),(1.7,-0.15,0.9),(2.1,0.1,1.2),(2.45,0.35,1.4),(2.8,0.5,1.5),(3.1,0.55,1.5),(3.35,0.5,1.4)]
vs = [
 view('mote', stage_js(look='away', dist=7.5, fov=0.6, face=0.35, side=-0.9, ty=0.1) + mote_trail_js(pts=MT), neb=0.05, lx=0.4, ly=0.3),
 view('crest', stage_js(look='away', dist=4.4, fov=0.6, face=-0.9, ty=0.35, up=-0.4) + PEARL_CREST, neb=0.05, lx=-0.5, ly=0.6),
 view('blink', stage_js(look='umbra', dist=12.6, fov=0.22, ty=0.05) + thin_eclipse_js((14,0.8),(10,0.3), 0.2) + dim_umbra_js(0.15) + eclipse_eyes_js(), keep=['umbra'], sunburst=0.12, neb=0.04, light=LB, dof=0.25, ly=0.15),
 view('nacre', NACRE_SKIN, pn=P0, theta=2.0, dist=3.2, up=1.5, ty=0.75, fov=0.7, cleared='s', nodecor=False, dof=0.3, scale=0.85, ly=0.3),
 view('prism', prism_halo_js(), form=11, pn=P0, theta=2.0, dist=4.4, up=2.6, ty=1.3, fov=0.7, cleared='s', nodecor=False, dof=0.3, ly=0.3),
 view('ringlet', ringlet_js(), pn=P0, theta=2.0, dist=3.6, up=1.7, ty=0.8, fov=0.7, cleared='s', nodecor=False, dof=0.3, scale=0.75, ly=0.3),
]
run(vs, 306, 243, 1, WORK + '/t3')
