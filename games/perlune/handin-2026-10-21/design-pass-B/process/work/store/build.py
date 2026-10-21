"""Build render.js views for the store tiles and run them.
usage: python3 build.py <cssW> <cssH> <dpr> <outPrefix> <ids comma list|all> [msaa]
"""
import json, os, subprocess, sys
sys.path.insert(0, '/home/claude/passB/tools')
from pose import pn

HERE = '/home/claude/passB/work/store'
HOOK = open(os.path.join(HERE, 'hook.js')).read()

# the ground: a quiet piece of Nacre (the pearl world, the poster's world) at night, nothing else in the sky
BASE = dict(world='nacre', solo=True, sunburst=False, nodecor=True, nodust=True, neb=0.02,
            light=[-0.45, 0.62, 0.62], lx=0.0, ly=0.25, streak=0.3, dof=0.35, grain=0.01, ownRings=False)
BASE['neb'] = 0.006

# the ribbon: a pink -> cyan strip (the creature's own dust colours 0xff5c9a / 0x5ff3ff) lying on the ground behind it,
# drawn with the game's FX.strip the way its slick trail is drawn
TRAIL_JS = """
{ const T = Object.assign({}, window.__rib, window.__rib0 || {}); window.__rib0 = null;
  const f = P.face.clone(), n0 = P.n.clone(), rt = new V3().crossOf(f, n0).norm();
  // the ribbon's path: control points in the ground plane around the droplet, (x along rt, z along face), Catmull-Rom
  const C = T.path, N = T.n, pts2d = [];
  for (let i = 0; i < N; i++) { const u = i / (N - 1) * (C.length - 1), k = Math.min(C.length - 2, Math.floor(u)), t = u - k;
    const p0 = C[Math.max(0, k - 1)], p1 = C[k], p2 = C[k + 1], p3 = C[Math.min(C.length - 1, k + 2)];
    const cr = j => 0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t * t + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t * t * t);
    pts2d.push([cr(0), cr(1)]); }
  P.hist.length = 0;
  for (const [x, z] of pts2d) { const d = new V3().addS(rt, x).addS(f, z); const s = d.len(); const dir = d.clone().norm();
    const nn = n0.clone().scale(Math.cos(s / G.cur.r)).addS(dir, Math.sin(s / G.cur.r)).norm(); P.hist.push({ p: wpos(nn, P.h, new V3()), n: nn }); }
  const cA = hex(0xff5c9a, T.gain), cB = hex(0x5ff3ff, T.gain), W = hex(0xfff6e8, 2.0);
  const st = G.cur.style, to = [0, 0], gh = nn => { terrainField(nn.x, nn.y, nn.z, st, to); return Math.max(0.0, (to[0] - 0.5) * st.amp) + 0.08; };
  drawSlickTrail = function () {
    const pts = []; for (let i = 0; i < P.hist.length; i++) pts.push(wpos(P.hist[i].n, gh(P.hist[i].n), new V3()));
    FX.strip(pts, surfUp, t => T.width * (1 - t * T.taper), t => mixc(cA, cB, Math.min(1, Math.max(0, (t - 0.12) * 1.35))), t => T.alpha * Math.min(1, t * 12) * (1 - Math.pow(t, T.fall || 3)));
    const pts2 = []; for (let i = 0; i < P.hist.length; i++) pts2.push(wpos(P.hist[i].n, gh(P.hist[i].n) + 0.02, new V3()));
    FX.strip(pts2, surfUp, t => T.width * 0.2 * (1 - t * 0.7), W, t => T.alpha * T.core * Math.min(1, t * 12) * Math.pow(1 - t, 1.6));
  };
}
"""

MOON_JS = """
{ const T = Object.assign({}, window.__moonT, window.__moonT0 || {}); window.__moonT0 = null;
  window.__look.extra = function (pos, n, face) {
    const rt = new V3().crossOf(face, n).norm();
    const ax = n.clone(); rotAround(ax, rt, T.tilt); rotAround(ax, face, T.roll);   // orbit plane normal, tilted
    const u = face.clone().tangent(ax).norm(), v = new V3().crossOf(ax, u).norm();
    let C; if (T.centre) C = pos.clone().addS(n, T.cy);       // the orbit's centre at the camera's target (where the droplet would float)
    else { const M0 = pos.clone().addS(n, T.cy); C = M0.clone().addS(u, -Math.cos(T.ma) * T.R).addS(v, -Math.sin(T.ma) * T.R); }
    const at = (a, r) => C.clone().addS(u, Math.cos(a) * r).addS(v, Math.sin(a) * r);
    const mp = at(T.ma, T.R);                                   // the moonlet sits on the orbit
    window.__moonPos = mp;
    M.sphere.put(mp, new Q().axisAngle(n, T.spin), T.s, hex(0xfff2fb), MAT.PEARL, 0.04, 0.0, 0, 3);
    // one-sided: the stretch of orbit it has just travelled, fading behind it (never a ring around it)
    if (T.full) { const g = T.s / T.R * 1.1, pts = []; for (let i = 0; i <= 240; i++) pts.push(at(T.ma + g + (TAU - 2 * g) * i / 240, T.R));
      FX.strip(pts, (p, o) => o.copy(R.cam.pos).sub(p).norm(), T.w, hex(0xfff2fb, T.lg), t => T.la * (0.55 + 0.45 * Math.cos(t * TAU))); return; }
    const sides = T.both ? [-1, 1] : [1];
    for (const sd of sides) { const a1 = T.ma - sd * T.s / T.R * 1.05, pts = []; for (let i = 0; i <= 160; i++) pts.push(at(a1 - sd * T.span * i / 160, T.R));
      FX.strip(pts, (p, o) => o.copy(R.cam.pos).sub(p).norm(), t => T.w * (1 - 0.6 * t), t => hex(0xfff2fb, T.lg), t => T.la * Math.pow(1 - t, 1.3)); }
  };
}
"""


def look_js(name, extra=''):
    return HOOK + f"\nwindow.__look = Object.assign({{}}, window.__LOOKS['{name}']);\n" + extra


def views():
    k = 0.15
    V = []
    cam = dict(dist=3.4, up=0.55, ty=0.18, fov=0.62, theta=2.6, pn=pn('nacre', k), exp=0.75)
    opal = "window.K_OPAL_SET={n:340,r:0.042,el:1.6,fire:0.6,skin:0.3,deep:0.975,body:0.10};\n"
    V.append(dict(BASE, **cam, id='opal', form=2, js=opal + look_js('opal')))
    V.append(dict(BASE, **cam, id='smoke-glass', form=2, js=look_js('smoke')))
    V.append(dict(BASE, **dict(cam, dist=5.9, up=2.2, ty=0.3, fov=0.62), id='glass-halo', form=11, ly=0.2, js=look_js('halo')))
    trail = dict(n=90, path=[[0, -0.2], [-0.7, -0.75], [-1.55, -0.2], [-1.45, 0.8], [-0.4, 1.45], [0.85, 1.35], [1.55, 0.55]],
                 width=0.5, taper=0.35, alpha=1.1, gain=2.4, core=0.3, fall=4)
    V.append(dict(BASE, **dict(cam, dist=3.4, up=2.4, side=0.0, ty=-0.5, dx=0, fov=0.85, exp=0.5), id='ribbon-trail', form=2, ly=0.45, lx=0.0, dof=0.12,
                  js=f"window.__rib = {json.dumps(trail)};\n" + TRAIL_JS + look_js('trail')))
    moon = dict(cy=0.75, tilt=-0.55, roll=0.0, R=1.0, ma=0.0, s=0.3, spin=0.4, w=0.018, lg=1.3, la=1.0, full=1)
    V.append(dict(BASE, **dict(cam, dist=3.6, up=0.9, ty=0.62, fov=0.62, dx=0.0), id='moonlet', form=2,
                  js=look_js('moon') + f"window.__moonT = {json.dumps(moon)};\n" + MOON_JS))
    return V

if __name__ == '__main__':
    w, h, dpr, pre, ids = sys.argv[1:6]
    msaa = sys.argv[6] if len(sys.argv) > 6 else '0'
    vs = views()
    if ids != 'all':
        want = ids.split(','); vs = [v for v in vs if v['id'] in want]
    var = os.environ.get('VAR')
    if var:
        allv = {v['id']: v for v in views()}; vs = []
        for nid, bid, o in json.loads(var):
            v = dict(allv[bid]); v.update(o); v['id'] = nid; vs.append(v)
    over = os.environ.get('OVER')
    if over:
        o = json.loads(over)
        for v in vs: v.update(o.get(v['id'], {}))
    env = dict(os.environ, NODE_PATH='/home/claude/.npm-global/lib/node_modules', MSAA=msaa)
    subprocess.run(['node', '/home/claude/passB/tools/render.js', w, h, dpr, pre, json.dumps(vs)], env=env, check=True)
