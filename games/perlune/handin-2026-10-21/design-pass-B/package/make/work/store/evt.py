"""Lantern Night banner: Nacre gone dark except the pool of light around the droplet.
Staged with the game's own darkness mechanic (the planet and sculpture shaders' u_dark / u_lantern, which the game
uses on Umbra): render() recomputes R.dark each frame (0 off Umbra), so a wrapper around R.begin sets R.dark and
R.lantern just before the frame is drawn. Nothing else about the world changes.
usage: python3 evt.py <cssW> <cssH> <dpr> <outPrefix> <ids|all> [msaa]
"""
import json, os, subprocess, sys
sys.path.insert(0, '/home/claude/passB/tools')
from pose import pn


def dark_js(dark=1.0, lantern=0.042, extra=''):
    return f"""
R.time = 200;   // a fixed clock so a small test predicts the final
for (let i = 0; i < 12; i++) G.bl.p[i * 4 + 3] = -1; for (let i = 0; i < 8; i++) G.ripples[i * 4 + 3] = 99;   // no rings left over from the landing
G.state = 'play'; G.test.bot = false; P.vel.set(0, 0, 0); P.jig = 0; P.joyT = 0; P.spinT = 0;
{{ const b0 = R.begin; R.begin = function (...a) {{ R.dark = {dark}; R.lantern = {lantern}; return b0.apply(R, a); }}; }}
{extra}
"""


BASE = dict(world='nacre', solo=True, sunburst=False, nodecor=True, neb=0.025, ownRings=False,
            light=[-0.3, 0.8, 0.5], lx=-0.35, ly=0.35, streak=0.45, dof=0.4, grain=0.01, warm=10)


def views():
    V = []
    cam = dict(pn=pn('nacre', 0.2), theta=2.2, dist=6.5, up=3.2, ty=0.2, fov=0.7, side=0.0, dx=-2.2)
    V.append(dict(BASE, **cam, id='A', form=2, js=dark_js()))
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
            if len(item) > 3: v['js'] = dark_js(**item[3])
            vs.append(v)
    elif ids != 'all':
        vs = [v for v in vs if v['id'] in ids.split(',')]
    env = dict(os.environ, NODE_PATH='/home/claude/.npm-global/lib/node_modules', MSAA=msaa)
    subprocess.run(['node', '/home/claude/passB/tools/render.js', w, h, dpr, pre, json.dumps(vs)], env=env, check=True)
