from pv import *
P0 = pn('nacre', 0.3)
LB = [-0.6,0.45,-0.55]
LK = [-0.45, 0.7, 0.45]
MT = [(-1.2,-0.35,0.3),(-1.6,-0.05,0.75),(-1.85,0.3,1.2),(-2.3,0.4,1.4),(-2.55,0.75,1.6),(-3.0,0.7,1.7)]
UD = pn('nacre', 0.9)
def over(**k):  # floating over Nacre's woken surface, camera looking down onto it
    a = dict(world='nacre', ud=UD, lift=2.6, look='away', cam=2.2, pitch=0.42, dist=5.0, up=0.0, ty=0.0, fov=0.6)
    a.update(k); return stage_js(**a)
vs = [
 view('mote', stage_js(look='away', dist=7.0, fov=0.6, face=0.45, side=0.7, ty=0.15, pitch=-0.06) + mote_trail_js(pts=MT, size=0.28, strip=0.1), neb=0.05, lx=0.6, ly=0.3, light=LK),
 view('crest', stage_js(look='away', dist=3.2, fov=0.6, face=-0.65, ty=0.9, up=0.5) + pearl_crest_js(), neb=0.05, lx=-0.5, ly=0.6, light=LK),
 view('blink', stage_js(look='umbra', dist=10.5, fov=0.22, ty=0.08) + thin_eclipse_js((16,0.6),(10,0.3), 0.2) + dim_umbra_js(0.15) + eclipse_eyes_js(rim='#fff4e6', rimEmit=7, glow='#ffd9b0', glowEmit=0.5, rays=1.4, round=1.0, rimR=1.0), keep=['umbra'], sunburst=0.12, neb=0.04, light=LB, dof=0.25, ly=0.1),
 view('gp5', over() + NOCREATURE, neb=0.05, light=LK, dof=0.4),
 view('gp6', over(pitch=0.3, lift=1.8) + NOCREATURE, neb=0.05, light=LK, dof=0.4),
 view('nacre', over() + NACRE_SKIN, neb=0.05, light=LK, dof=0.4, ly=0.5),
 view('prism', over(ty=0.55, dist=5.6) + prism_halo_js(), form=11, neb=0.05, light=LK, dof=0.4, ly=0.5),
 view('ring', over(dist=5.8) + ringlet_js(tiltX=0.75, tiltZ=-0.9, beads=22, bead=0.1), neb=0.05, light=LK, dof=0.4, ly=0.5),
]
run(vs, 306, 243, 1, WORK + '/t5')
