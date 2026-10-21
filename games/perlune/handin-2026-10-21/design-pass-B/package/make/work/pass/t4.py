from pv import *
P0 = pn('nacre', 0.3)
LB = [-0.6,0.45,-0.55]
MT = [(-1.35,-0.3,0.4),(-1.95,-0.05,0.9),(-2.35,0.35,1.3),(-2.95,0.45,1.5),(-3.3,0.85,1.6),(-3.85,0.8,1.7)]
vs = [
 view('mote', stage_js(look='away', dist=7.2, fov=0.6, face=0.4, side=-0.75, ty=0.2, pitch=-0.06) + mote_trail_js(pts=MT, size=0.26, strip=0.12), neb=0.05, lx=0.5, ly=0.3),
 view('crest', stage_js(look='away', dist=3.0, fov=0.6, face=-1.3, ty=0.55, up=-0.1) + PEARL_CREST, neb=0.05, lx=-0.6, ly=0.5),
 view('crestB', stage_js(look='away', dist=3.3, fov=0.6, face=-0.75, ty=0.6, up=0.6) + PEARL_CREST, neb=0.05, lx=-0.4, ly=0.5),
 view('blinkA', stage_js(look='umbra', dist=12.6, fov=0.22, ty=0.05) + thin_eclipse_js((16,0.6),(10,0.3), 0.2) + dim_umbra_js(0.15) + eclipse_eyes_js(rim='#fff4e6', rimEmit=3.5, glowEmit=0, rays=0.55, round=0.7, rimR=1.04), keep=['umbra'], sunburst=0.12, neb=0.04, light=LB, dof=0.25, ly=0.15),
 view('blinkB', stage_js(look='umbra', dist=12.6, fov=0.22, ty=0.05) + thin_eclipse_js((16,0.6),(10,0.3), 0.2) + dim_umbra_js(0.15) + eclipse_eyes_js(rim='#fff4e6', rimEmit=2.5, glow='#ff9ad5', glowEmit=0.35, rays=0.0, round=1.0, rimR=1.0), keep=['umbra'], sunburst=0.12, neb=0.04, light=LB, dof=0.25, ly=0.15),
 view('plain', '', pn=P0, theta=2.0, dist=3.0, up=0.9, ty=0.6, fov=0.7, cleared='s', dof=0.3, scale=0.85, ly=0.4),
 view('nacre', NACRE_SKIN, pn=P0, theta=2.0, dist=3.0, up=0.9, ty=0.6, fov=0.7, cleared='s', dof=0.3, scale=0.85, ly=0.4),
 view('prism', prism_halo_js(), form=11, pn=P0, theta=2.0, dist=3.6, up=2.0, ty=1.2, fov=0.7, cleared='s', dof=0.3, ly=0.3),
 view('ringA', ringlet_js(tiltX=0.95, tiltZ=-0.75, beads=14, bead=0.13), pn=P0, theta=2.0, dist=3.6, up=1.3, ty=0.7, fov=0.7, cleared='s', dof=0.3, scale=0.72, ly=0.4),
 view('ringB', ringlet_dust_js(tiltX=0.55, tiltZ=-0.55), pn=P0, theta=2.0, dist=3.6, up=1.3, ty=0.7, fov=0.7, cleared='s', dof=0.3, scale=0.72, ly=0.4),
]
run(vs, 306, 243, 1, WORK + '/t4')
