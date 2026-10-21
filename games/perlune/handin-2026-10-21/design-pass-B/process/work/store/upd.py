"""Update close-up: the instant the droplet becomes the Chimera, triggered for real in the build.
usage: python3 upd.py <cssW> <cssH> <dpr> <outPrefix> <ids|all> [msaa]
The droplet is posed on Nacre one pick short of the Chimera (form 10, the Bead stage, glass mantle on); then the game's
own applyEvo() takes the 11th pick and the game's own metamorphosis(2) runs (it is normally queued by applyEvo with
setTimeout, which render.js disables, so it is called directly, exactly as applyEvo would 380 ms later). Then the game
is stepped frame by frame (PERLUNE.sim + render, because the rings advance at draw time) until the rings have run out.
"""
import json, os, subprocess, sys
sys.path.insert(0, '/home/claude/passB/tools')
from pose import pn

BUILD = {'bloom': 3, 'wings': 2, 'lode': 2, 'tail': 1, 'eye': 1, 'mass': 1}   # ten picks, low-profile organs


def meta_js(pick='lode', frames=30, wake=0.6, extra='', nometa=False, gap=23, t0=100.0):
    return f"""
// a clean start for this view: no blooms, ripples, slow-motion or flashes left over from an earlier view in the page
for (let i = 0; i < 12; i++) G.bl.p[i * 4 + 3] = -1; G.bl.last = -9; for (let i = 0; i < 8; i++) G.ripples[i * 4 + 3] = 99;
R.time = {t0};   // a fixed clock, so a test render predicts the final one exactly
G.slowT = 0; G.timeScale = 1; G.hitstop = 0; G.show = null; G.shake = 0; R.post.warp = 0; R.post.flash = [0, 0, 0]; P.jig = 0; P.flash = 0; P.spinT = 0; P.joyT = 0;
G.cur.wake = {wake}; G.cur.awake = 1; G.state = 'play'; G.test.bot = false; P.vel.set(0, 0, 0);
P.ab.crown = []; P.hist.length = 0;
for (let i = 0; i < 40; i++) P.hist.push({{ p: P.pos.clone(), n: P.n.clone() }});
window.__meta = {{ frames: {frames}, gap: {gap}, nometa: {str(nometa).lower()}, f0: P.face.clone() }};
if (window.__meta.nometa) {{ P.form = 11; recomputeStats(); }}
else {{ window.__meta.st0 = stageOf(P.form); applyEvo('{pick}'); P.face.copy(window.__meta.f0); P.F.copy(window.__meta.f0); }}   // the 11th pick: the game's own applyEvo
{extra}
"""


POST = """
{ const Mt = window.__meta, f0 = Mt.f0; G.fxDt = 1 / 60;
  // step the game frame by frame (sim + render: the rings advance at draw time); a small canvas while stepping, for speed
  const W0 = R.w, H0 = R.h; R.resize(Math.max(64, W0 >> 3), Math.max(32, H0 >> 3));
  const step = n => { for (let i = 0; i < n; i++) { PERLUNE.sim(1 / 60); G.shake = 0; render(); } };
  if (!Mt.nometa) {
    step(Mt.gap);                                                   // applyEvo queues the metamorphosis 380 ms after the pick
    if (stageOf(P.form) > Mt.st0) metamorphosis(stageOf(P.form));   // the game's own metamorphosis(2): shockwave, rings, bloom, particles
    step(Mt.frames);
  }
  R.resize(W0, H0);
  // capture choices (a still, not the game changing): no camera shake and no full-screen white flash on this frame,
  // and the body caught at the point of its spin where it faces the camera
  G.shake = 0; R.post.flash = [0, 0, 0];
  const th = P.spinT > 0 ? easeOut(1 - P.spinT / 0.7) * TAU : 0; P.face.copy(f0); P.F.copy(f0); rotAround(P.face, P.n, -th);
  P.blinkT = 3; P.lookX = -0.2; P.lookY = 0.55;
  // the instant inside one jiggle period (0.26 s) at which the body passes through round, so the eyes are not swallowed
  { const T0 = R.time; let best = 0, bv = 9; for (let d = 0; d < 0.262; d += 0.002) { const T = T0 + d, v = Math.abs(Math.sin(T * 24)) + 0.4 * Math.abs(Math.sin(T * 9)); if (v < bv) { bv = v; best = d; } } R.time = T0 + best; }
  if (window.__dbg) { const cd = R.cam.pos.clone().sub(P.pos).tangent(P.n).norm(); const ft = P.face.clone(); if (P.spinT > 0) rotAround(ft, P.n, easeOut(1 - P.spinT / 0.7) * TAU);
    console.error('DBG spinT', P.spinT.toFixed(3), 'th', th.toFixed(2), 'face.cam', ft.dot(cd).toFixed(3), 'f0.cam', f0.dot(cd).toFixed(3), 'jig', P.jig.toFixed(2), 'slosh', P.slosh.len().toFixed(3)); } }
"""

BASE = dict(world='nacre', solo=True, keep=['umbra'], noRings=['umbra'], sunburst=0.2, nodecor=True, neb=0.03,
            light=[-0.55, 0.62, 0.2], lx=-0.2, ly=0.55, streak=0.45, dof=0.55, grain=0.01, ownRings=False, warm=0)


def views():
    k = 0.18
    V = []
    cam = dict(pn=pn('nacre', k), theta=0.55, dist=6.4, up=2.4, ty=1.25, fov=0.72, side=0.0, dx=0.0)
    V.append(dict(BASE, **cam, id='A', form=10, build=BUILD, js=meta_js(), jsPost=POST))
    return V


if __name__ == '__main__':
    w, h, dpr, pre, ids = sys.argv[1:6]
    msaa = sys.argv[6] if len(sys.argv) > 6 else '0'
    vs = views()
    var = os.environ.get('VAR')
    if var:
        allv = {v['id']: v for v in vs}; vs = []
        for item in json.loads(var):
            nid, bid, o = item[:3]
            v = dict(allv[bid]); v.update(o); v['id'] = nid
            if len(item) > 3: v['js'] = meta_js(**item[3])
            vs.append(v)
    elif ids != 'all':
        vs = [v for v in vs if v['id'] in ids.split(',')]
    env = dict(os.environ, NODE_PATH='/home/claude/.npm-global/lib/node_modules', MSAA=msaa)
    subprocess.run(['node', '/home/claude/passB/tools/render.js', w, h, dpr, pre, json.dumps(vs)], env=env, check=True)
