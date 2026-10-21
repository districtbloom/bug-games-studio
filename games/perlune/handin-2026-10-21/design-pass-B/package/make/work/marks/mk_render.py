"""Perlune small marks: render the droplet with the game's own WebGL2 renderer (render.js), staged like the poster.

usage: python3 mk_render.py <cssW> <cssH> <dpr> <outPrefix> <view-set>
The views are built here so every choice is written down:
  - staging: titlejs() exactly as the poster (floating over Nacre, title scale 1.0, poster up_dir), so the droplet mirrors
    the same studio (Nacre's palette) and is lit by the poster's key light [-0.6, 0.45, -0.55] (upper left, from behind).
  - clean plate: bg false (no sky), no planets, no atmospheres, no rings, no sunburst, no dust (title dust ring off),
    no decor; dof 0, tilt 0, grain 0, streak 0 (no fine lines), vig 0.
  - drawn for the size: drawCreature is re-read from the shipped build and re-evaluated with bigger eye and catchlight
    factors (EK, CL): the same parts, materials and placement, only scaled so they survive at 46 / 30 px.
    Nothing in the game is changed; this lives only in the headless page for the render.
"""
import json, os, subprocess, sys
sys.path.insert(0, '/home/claude/passB/tools')
from titlejs import titlejs
from pose import pn

UP = [-0.2768, 0.9578, -0.0772]  # the poster's up_dir


def eyes_js(ek=1.0, ekz=1.0, cl=1.0, ex_dx=0.0, crest=1.0, cle=4, crest_emit=None):
    """Re-evaluate drawCreature from the shipped source with eye / catchlight / crest scale factors."""
    return f"""
if (!window.__dc0) window.__dc0 = drawCreature;
{{ let s = window.__dc0.toString(); const n0 = s.length;
  s = s.replace('sc * 0.13 * ex, sc * 0.19 * ey, sc * 0.08', 'sc * 0.13 * ex * {ek}, sc * 0.19 * ey * {ek}, sc * 0.08 * {ekz}');
  s = s.replace('sc * 0.045 * Math.min(1.3, ey)', 'sc * 0.045 * {cl} * Math.min(1.3, ey)');
  s = s.replace('local(BPOS, q, sc, sx * 0.29 + lx, 0.26 + ly, ez, _p1)', 'local(BPOS, q, sc, sx * (0.29 + {ex_dx}) + lx, 0.26 + ly, ez, _p1)');
  s = s.replace('local(BPOS, q, sc, sx * 0.29 - 0.035 + lx, 0.31 + ly, ez + 0.06, _p1)', 'local(BPOS, q, sc, sx * (0.29 + {ex_dx}) - 0.035 * {ek} + lx, 0.26 + 0.05 * {ek} + ly, ez + 0.06, _p1)');
  s = s.replace('(P.joyT > 0 ? 1.35 : 1), hex(0xffffff), MAT.GLOW, 4)', '(P.joyT > 0 ? 1.35 : 1), hex(0xffffff), MAT.GLOW, {cle})');
  {'' if crest_emit is None else "s = s.replace('MAT.GLASS, stg >= 2 ? 0.45 : 0.1)', 'MAT.GLASS, %s)');" % crest_emit}
  s = s.replace('new V3(sc * 0.18, sc * 0.42 * crestK, sc * 0.1), hex(0x9ff6ff)', 'new V3(sc * 0.18 * {crest}, sc * 0.42 * crestK * {crest}, sc * 0.1 * {crest}), hex(0x9ff6ff)');
  window.__dcPatched = (s.match(/\\* {ek}/g) || []).length;
  drawCreature = (0, eval)('(' + s + ')'); }}
"""


# the chip: the Eclipse (Umbra and its amber / violet atmospheres) stays, Nacre and every other world, ring and dust go
ECLIPSE_ONLY = """{ const um = planetById('umbra'); const dp = R.drawPlanet, da = R.drawAtmo;
  R.drawPlanet = function (pl, ...a) { if (pl.id === 'umbra') return dp.call(R, pl, ...a); };
  R.drawAtmo = function (c, ...a) { if (c === um.c) return da.call(R, c, ...a); }; }
drawRingDust=function(){}; drawRingBits=function(){}; R.drawDust=function(){}; drawDecor=function(){};"""
CLEAN = "R.drawPlanet=function(){}; R.drawAtmo=function(){}; drawSunburst=function(){}; drawRingDust=function(){}; drawRingBits=function(){}; R.drawDust=function(){}; drawDecor=function(){};"


def view(id, cam=-0.33, face=-0.15, dist=6.0, up=0.9, ty=0.15, fov=0.45, side=0.0, lx=-0.3, ly=0.35,
         ek=1.0, ekz=1.0, cl=1.0, ex_dx=0.0, crest=1.0, clean=True, light=(-0.6, 0.45, -0.55), bloom=None, exp=None,
         extra='', keep_eclipse=False, sunburst=None, cle=4, crest_emit=None, t0=None, mask=False):
    js = titlejs(world='nacre', up_dir=UP, lift=5.5, cam=cam, face=face, dist=dist, up=up, ty=ty, fov=fov, side=side)
    js += eyes_js(ek, ekz, cl, ex_dx, crest, cle, crest_emit)
    if clean:
        js += CLEAN
    js += extra
    v = dict(id=id, world='nacre', cleared='1', form=2, solo=True, keep=['umbra'] if keep_eclipse else [],
             noRings=['umbra'], ownRings=False, nodecor=True, lx=lx, ly=ly, light=list(light),
             dof=0, tilt=0, grain=0, streak=0, vig=0, neb=0.0, js=js)
    v['bg'] = False  # no sky: the night ground is laid under the render afterwards (mk_finish.ground)
    if sunburst is not None:
        v['sunburst'] = sunburst
    v['bloom'] = 0.6 if bloom is None else bloom   # always explicit: render.js keeps post values between views
    v['exp'] = 0.95 if exp is None else exp
    if t0 is not None:  # a fixed clock, so the liquid wobble is the same in the look pass and the mask pass
        v['jsPost'] = 'R.time = %s;' % t0
    if mask:  # coverage pass: no bloom, huge exposure -> every drawn pixel saturates, the empty plate stays 0;
        # additive light (atmospheres, sunburst rays, dust) is left out so it falls on the ground, as in the game
        v['bloom'] = 0; v['exp'] = 60; v['streak'] = 0; v['id'] = id + '-mask'
        v['js'] += 'R.drawAtmo=function(){}; drawSunburst=function(){}; R.drawDust=function(){};'
        v['sunburst'] = False
    return v


def pair(id, **k):
    """the look pass and its coverage-mask pass, same pose and clock"""
    return [view(id, **k), view(id, mask=True, **k)]


SETS = {
    'icon-test': [
        view('i-native'),
        view('i-big', ek=1.35, ekz=1.4, cl=2.0, ex_dx=0.03),
        view('i-big-front', ek=1.35, ekz=1.4, cl=2.0, ex_dx=0.03, face=0.0, lx=0.0, ly=0.2),
    ],
}

if __name__ == '__main__':
    w, h, dpr, pre, which = sys.argv[1:6]
    views = SETS[which] if which in SETS else json.load(open(which))
    env = dict(os.environ, NODE_PATH='/home/claude/.npm-global/lib/node_modules', MSAA='4')
    subprocess.run(['node', '/home/claude/passB/tools/render.js', w, h, dpr, pre, json.dumps(views)], env=env, check=True)
