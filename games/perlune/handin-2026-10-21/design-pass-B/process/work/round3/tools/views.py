"""Build render.js views with the poster's finish (round3)."""
import json, sys
sys.path.insert(0, '/home/claude/passB/tools')
from titlejs import titlejs

UD = [-0.2768, 0.9578, -0.0772]  # the poster's spot above Nacre
FINISH = dict(world='nacre', form=2, solo=True, keep=['umbra'], noRings=['umbra'], ownRings=False, sunburst=0.2,
              neb=0.03, nodecor=True, ly=0.9, lx=-0.7, light=[-0.6, 0.45, -0.55])  # vig 0, grain .01, streak .45, bloom default via render.js

def poster_view(id, cleared, **cam):
    c = dict(lift=5.5, cam=-0.33, face=-0.2, dist=5.6, up=1.1, ty=0.25, fov=0.62, side=0.8, scale=1.0)
    lx = cam.pop('lx', None); ly = cam.pop('ly', None)
    c.update(cam)
    v = dict(FINISH); v.update(id=id, cleared=str(cleared), js=titlejs(world='nacre', up_dir=UD, **c))
    if lx is not None: v['lx'] = lx
    if ly is not None: v['ly'] = ly
    return v

if __name__ == '__main__':
    print(json.dumps([poster_view('t', 1)]))


def backdrop_js(h=1.4, pitch=-0.12, yawE=-1.0, fov=0.55, focus=(0.5, 0.12), hide=True, wake=None, away=True):
    """A camera standing h above the world's surface at the spot P.n, looking along the ground.
    yawE: look direction measured from the direction toward the Eclipse (0 = looking straight at it, + = turn right);
    pitch: radians, negative looks down. The droplet is not drawn (the backdrop is the world's place at rest)."""
    hid = "drawCreature = function(){}; drawCreatureDust = function(){};" if hide else ""
    wk = "" if wake is None else f"G.cur.wake={wake}; G.cur.awake=0;"
    return f"""{hid}{wk}
{{ const pl=G.cur, n0=P.n.clone().norm();
  const E=planetById('umbra').c.clone().sub(P.pos).tangent(n0).norm();
  const d=E.clone(); rotAround(d, n0, {-yawE});
  const dir=d.clone().scale(Math.cos({pitch})).addS(n0, Math.sin({pitch})).norm();
  const pos=pl.c.clone().addS(n0, pl.r + {h});
  window.__bd={{pos, dir}};
  G.camHook=function(CB){{ CB.pos.copy(pos); CB.target.copy(pos).addS(dir, 10); CB.up.copy(n0); CB.fov={fov}; return 1; }};
  if ({str(away).lower()}) P.pos.copy(pl.c).addS(n0, -(pl.r + 1));  // no droplet here, so no droplet glow on the ground either
  const oc=R.composite; R.composite=function(...a){{ R.post.focus=[{focus[0]},{focus[1]}]; return oc.apply(R,a); }};
}}"""


def backdrop_view(id, world, cleared, pn=None, light=(-0.6, 0.45, -0.55), extra=None, **cam):
    v = dict(id=id, world=world, cleared=str(cleared), form=2, solo=True, sunburst=False, ownRings=False,
             neb=0.03, light=list(light), js=backdrop_js(**cam))
    if pn is not None: v['pn'] = pn
    if extra: v.update(extra)
    return v


def pitch_for(h, r, fov, apex=0.85):
    """pitch that puts the horizon's highest point at `apex` of the frame height (from the top)."""
    import math
    d = math.acos(r / (r + h)); th = math.atan((apex - 0.5) * 2 * math.tan(fov / 2)); return round(-(d - th), 4)
