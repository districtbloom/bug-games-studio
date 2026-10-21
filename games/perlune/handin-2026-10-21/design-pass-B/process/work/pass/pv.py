"""Pass group (Perlune design pass B): view builder for /home/claude/passB/tools/render.js.
Every picture is rendered by the game's own WebGL2 renderer. Cosmetic looks are proposals: they are drawn at
render time inside the page (js hooks wrap drawCreature / mesh puts for one call and restore them); the game's
files are never edited."""
import json, os, subprocess, sys
sys.path.insert(0, '/home/claude/passB/tools')
from pose import pn

WORK = '/home/claude/passB/work/pass'
RENDER = '/home/claude/passB/tools/render.js'

# ---------- prelude: restore anything a previous view in the same page wrapped ----------
PRE = r"""
(function(){ const W = window;
  if (!W.__keep) W.__keep = { dc: drawCreature, dcd: drawCreatureDust, sph: M.sphere.put, ball: M.ball.put, oct: M.oct.put, torus: M.torus.put, ring: M.ring.put, gem0: M.gem0.put };
  const K = W.__keep; drawCreature = K.dc; drawCreatureDust = K.dcd;
  M.sphere.put = K.sph; M.ball.put = K.ball; M.oct.put = K.oct; M.torus.put = K.torus; M.ring.put = K.ring; M.gem0.put = K.gem0;
  P.motes = []; G.state = 'play'; G.titlePos = null; G.titleFace = null; W.__extra = null;
})();
"""

def stage_js(world='nacre', ud=None, lift=5.5, look='away', cam=0.0, pitch=0.0, dist=6.0, up=0.0, ty=0.0, side=0.0,
             fov=0.6, face=0.0, notdust=True, camv=None):
    """Float the creature the way the game's title screen does (title state, title scale 1.0) and pose a camera.
    look='umbra': the camera stands beyond the creature on the line from the Eclipse, so the Eclipse is right behind it.
    look='away' : the camera stands on the Eclipse side and looks away from it (sky only behind the creature)."""
    if ud is None: ud = pn(world, 0.3)
    S = dict(world=world, ud=ud, lift=lift, look=look, cam=cam, pitch=pitch, dist=dist, up=up, ty=ty, side=side, fov=fov, face=face, notdust=notdust, camv=camv)
    return "window.__S = %s;" % json.dumps(S) + r"""
G.state = 'title';
{ const T = window.__S, pl = planetById(T.world), U = new V3(0, 1, 0);
  const ud = new V3(T.ud[0], T.ud[1], T.ud[2]).norm(); const C = pl.c.clone().addS(ud, pl.r + T.lift);
  const Uc = planetById('umbra').c.clone();
  let d; if (T.camv) d = new V3(T.camv[0], T.camv[1], T.camv[2]).norm(); else if (T.look === 'umbra') d = C.clone().sub(Uc).norm(); else { d = Uc.clone().sub(C); d.y = 0; d.norm(); }
  rotAround(d, U, T.cam);
  const rt0 = new V3().crossOf(d, U).norm(); if (T.pitch) rotAround(d, rt0, T.pitch);
  const camPos = C.clone().addS(d, T.dist).addS(U, T.up);
  const rt = new V3().crossOf(d, U).norm();
  const fa = d.clone(); fa.y = 0; fa.norm(); rotAround(fa, U, T.face);
  window.__C = C; window.__F = fa;
  G.titlePos = C.clone(); G.titleFace = fa.clone();
  G.camHook = function (CB) { G.titlePos = C.clone(); G.titleFace = fa.clone(); CB.pos.copy(camPos); CB.target.copy(C).addS(U, T.ty).addS(rt, T.side); CB.up.set(0, 1, 0); CB.fov = T.fov; return 1; };
  if (T.notdust) { const dd = R.drawDust; R.drawDust = function (o) { if (G.state === 'title' && o.c && G.titlePos && o.c.dist(G.titlePos) < 0.01) return; return dd.call(R, o); }; }
}
"""

NOCREATURE = "drawCreature = function () {}; drawCreatureDust = function () {};"

def thin_eclipse_js(amber=(4.5, 0.5), violet=(7.0, 0.30), core=1.0):
    """Keep the Eclipse's corona a thin glow: the game draws Umbra's amber (1.9 r) and violet (3.0 r) atmospheres as
    wide rims; here they are drawn with a higher falloff power so they stay thin rings (staging only)."""
    return """{ const da = R.drawAtmo, um = planetById('umbra');
  R.drawAtmo = function (c, r, col, pw, it) { if (c === um.c) { if (Math.abs(r - um.r * 1.9) < 0.5) return da.call(R, c, r, col, %f, it * %f);
    if (Math.abs(r - um.r * 3.0) < 0.5) return da.call(R, c, r, col, %f, it * %f); return da.call(R, c, r, col, pw, it * %f); } return da.call(R, c, r, col, pw, it); }; }
""" % (amber[0], amber[1] / 0.55, violet[0], violet[1] / 0.35, core)

BASE = dict(world='nacre', form=2, solo=True, keep=[], noRings=['umbra'], ownRings=False, sunburst=False, neb=0.08,
            nodecor=True, ly=0.25, lx=0.0, grain=0.01, streak=0.45, dof=0.55, vig=0)

def view(id, js='', **kw):
    v = dict(BASE); v.update(kw); v['id'] = id; v['js'] = PRE + js; return v

def run(views, w, h, dpr, prefix, msaa=4):
    env = dict(os.environ, NODE_PATH='/home/claude/.npm-global/lib/node_modules', MSAA=str(msaa))
    js = json.dumps(views)
    with open(prefix + '-views.json', 'w') as f: json.dump(views, f, indent=1)
    r = subprocess.run(['node', RENDER, str(w), str(h), str(dpr), prefix, js], env=env, capture_output=True, text=True, timeout=1500)
    print(r.stdout[-3000:], r.stderr[-3000:])

def dim_umbra_js(k=0.25):
    """The Eclipse's own dark: draw Umbra's disc with the game's own `dim` factor (the game dims locked worlds the same way)."""
    return "{ const dp = R.drawPlanet; R.drawPlanet = function (pl, geo, pp, rip, dim) { return dp.call(R, pl, geo, pp, rip, pl.id === 'umbra' ? dim * %f : dim); }; }" % k

# ---------- cosmetic proposals, drawn at render time inside the page (game files untouched) ----------
# __wrapDC(hook, post): for the duration of one drawCreature call, every Mesh.put goes through hook(meshName, mesh, args, PUT);
# afterwards post(pos, n, face, opts, q) may draw extra parts in the creature's own frame (q from the game's creatureFrame).
WRAP = r"""
window.__wrapDC = function (hook, post) {
  const dc0 = window.__keep.dc, PUT = Mesh.prototype.put, names = ['sphere', 'ball', 'oct', 'torus', 'ring', 'cone', 'gem'];
  drawCreature = function (pos, n, face, opts) {
    window.__dcPos = pos.clone();
    if (hook) for (const k of names) { const m = M[k]; m.put = function (...a) { return hook(k, m, a, (...b) => PUT.apply(m, b)); }; }
    const r = dc0(pos, n, face, opts);
    if (hook) for (const k of names) delete M[k].put;
    if (post) { const q = new Q(); creatureFrame(pos, n, face, q); post(pos, n, face, opts || {}, q); }
    return r;
  };
};
window.__same = (c, h) => { const x = hex(h); return Math.abs(c[0] - x[0]) + Math.abs(c[1] - x[1]) + Math.abs(c[2] - x[2]) < 1e-4; };
"""

PEARL_CREST = WRAP + r"""
__wrapDC(function (k, m, a, put) {
  if (k === 'oct' && a[4] === MAT.GLASS && __same(a[3], 0x9ff6ff)) return put(a[0], a[1], a[2], hex(0xfff2fb), MAT.PEARL, 0.06, 0, 0, 0.35);
  return put(...a);
});
"""

NACRE_SKIN = WRAP + r"""
__wrapDC(function (k, m, a, put) {
  if (k === 'sphere' && a[4] === MAT.LIQUID && a[8] === 1) return put(a[0], a[1], a[2], hex(0xfff2ee), MAT.PEARL, (a[5] || 0) + 0.04, a[6], a[7], 0.3);
  return put(...a);
});
"""

def prism_halo_js(cols=('#ff5c9a', '#ff9ad5', '#fff6fa', '#9ff6ff', '#5ff3ff', '#6a8cff'), emit=1.7, spread=0.075):
    return WRAP + "window.__PH = %s;" % json.dumps(dict(cols=list(cols), emit=emit, spread=spread)) + r"""
__wrapDC(function (k, m, a, put) {
  if (k === 'torus' && a[4] === MAT.GLOW && __same(a[3], 0xffd27a)) { // the Chimera's gold halo -> a prism of thin rings
    const H = window.__PH, n = H.cols.length, s = a[2];
    for (let i = 0; i < n; i++) { const t = (i - (n - 1) / 2) * H.spread; M.ring.put(a[0], a[1], s * (1 + t) , hex(parseInt(H.cols[i].slice(1), 16)), MAT.GLOW, H.emit); }
    return; }
  return put(...a);
});
"""

def ringlet_js(rad=1.45, tiltX=0.9, tiltZ=-0.6, beads=18, bead=0.075, emit=0.05):
    return WRAP + "window.__RL = %s;" % json.dumps(dict(rad=rad, tx=tiltX, tz=tiltZ, beads=beads, bead=bead, emit=emit)) + r"""
__wrapDC(null, function (pos, n, face, o, q) {
  const L = window.__RL, sc = (o.scale ?? P.scale), T = R.time;
  const rq = q.clone().mul(new Q().axisAngle(new V3(0, 0, 1), L.tz)).mul(new Q().axisAngle(new V3(1, 0, 0), L.tx));
  const c = pos.clone();
  M.ring.put(c, rq, sc * L.rad, hex(0xfff2fb), MAT.PEARL, L.emit, 0, 0, 0.2);
  for (let i = 0; i < L.beads; i++) { const a = i / L.beads * TAU + 0.4, p = new V3(Math.cos(a) * L.rad * sc, 0, Math.sin(a) * L.rad * sc).applyQ(rq).add(c);
    M.ball.put(p, q, sc * L.bead * (0.8 + 0.4 * ((i * 7) % 5) / 4), hex(0xfff2fb), MAT.PEARL, 0.08, 0, 0, i * 0.37); }
});
"""

def mote_trail_js(n=7, pts=None, size=0.22, emit=2.2, strip=0.35):
    # pts: list of [right, up, back] offsets (in creature radii) for the motes, nearest first
    return WRAP + "window.__MT = %s;" % json.dumps(dict(n=n, pts=pts, size=size, emit=emit, strip=strip)) + r"""
__wrapDC(null, function (pos, n, face, o, q) {
  const L = window.__MT, sc = (o.scale ?? P.scale), T = R.time, ps = [];
  for (let i = 0; i < L.pts.length; i++) { const d = L.pts[i]; ps.push(local(pos, q, sc, d[0], d[1], -d[2], new V3())); }
  for (let i = 0; i < ps.length; i++) { const k = 1 - i / ps.length;
    M.oct.put(ps[i], new Q().axisAngle(new V3(Math.sin(i * 2.1), 1, Math.cos(i * 1.3)).norm(), T * 6 + i * 1.7).mul(new Q().axisAngle(new V3(1, 0, 0), 0.6 + i * 0.9)), L.size * sc * (0.55 + 0.45 * k), hex(0xff5c9a), MAT.GLOW, L.emit * (0.6 + 0.4 * k)); }
  if (L.strip > 0) { const up = (p, o2) => o2.copy(R.cam.pos).sub(p).norm(); const pp = [local(pos, q, sc, -0.55, -0.1, -0.35, VP.get())].concat(ps.map(p => VP.get().copy(p)));
    FX.strip(pp, up, t => sc * 0.07 * (1 - t * 0.7), hex(0xff5c9a, 1.4), t => L.strip * (1 - t)); }
});
"""

def eclipse_eyes_js(rim='#fff0d8', rimEmit=4.0, glow='#ffb52e', glowEmit=0.9, rays=0.0, round=1.0, rimR=1.06, fwd=0.07, big=1.0, lift=0.0):
    return WRAP + "window.__EE = %s;" % json.dumps(dict(rim=rim, rimEmit=rimEmit, glow=glow, glowEmit=glowEmit, rays=rays, round=round, rimR=rimR, fwd=fwd, big=big, lift=lift)) + r"""
window.__eyes = [];
__wrapDC(function (k, m, a, put) {
  if (k === 'sphere' && a[3] === BLACK) { const s = a[2], E = window.__EE; const r = Math.max(s.x, s.y * 0.82) ; const sx = (s.x + (r - s.x) * E.round) * E.big, sy = (s.y + (r - s.y) * E.round) * E.big;
    window.__eyes.push({ p: a[0].clone(), r: Math.max(sx, sy) }); const cen = window.__dcPos; const nn0 = cen ? a[0].clone().sub(cen).norm() : new V3(0, 0, 0); const pe = a[0].clone().addS(nn0, (E.lift || 0) * Math.max(sx, sy) / 0.17);
    window.__eyes[window.__eyes.length - 1].p = pe.clone(); return put(pe, a[1], new V3(sx, sy, s.z * E.big), BLACK, MAT.GLOW, 0); }
  if (k === 'ball' && a[4] === MAT.GLOW && __same(a[3], 0xffffff)) return; // the catchlights give way to the rims
  return put(...a);
}, function (pos, n, face, o, q) {
  const E = window.__EE, eyes = window.__eyes.splice(0), sc = (o.scale ?? P.scale);
  const fq = q.clone().mul(new Q().axisAngle(new V3(1, 0, 0), Math.PI / 2));
  for (const e of eyes) { const nn = e.p.clone().sub(pos).norm(); const p = e.p.clone().addS(nn, E.fwd * sc);
    M.ring.put(p, fq, e.r * E.rimR, hex(parseInt(E.rim.slice(1), 16)), MAT.GLOW, E.rimEmit);
    if (E.glowEmit > 0) M.torus.put(p.clone().addS(nn, -0.01 * sc), fq, e.r * (E.rimR + 0.16), hex(parseInt(E.glow.slice(1), 16)), MAT.GLOW, E.glowEmit);
    if (E.rays > 0) drawSunburst(p, e.r * 1.25, e.r * 2.6, E.rays, 0); }
});
"""

def ringlet_dust_js(rad=1.45, tiltX=0.5, tiltZ=-0.5, beads=9, bead=0.11, line=True, dust=True):
    """Ringlet as the game draws its sand rings (R.drawDust, flat), in pearl, plus a few pearl beads on the same orbit."""
    return WRAP + "window.__RD = %s;" % json.dumps(dict(rad=rad, tx=tiltX, tz=tiltZ, beads=beads, bead=bead, line=line, dust=dust)) + r"""
__wrapDC(null, function (pos, n, face, o, q) {
  const L = window.__RD, sc = (o.scale ?? P.scale);
  const rq = q.clone().mul(new Q().axisAngle(new V3(0, 0, 1), L.tz)).mul(new Q().axisAngle(new V3(1, 0, 0), L.tx));
  const ax = new V3(0, 1, 0).applyQ(rq);
  if (L.dust) R.drawDust({ c: pos.clone(), axis: ax, col0: hex(0xfff2fb), col1: hex(0xffc6ea), rmin: sc * (L.rad - 0.1), rmax: sc * (L.rad + 0.1), speed: 1.2, bias: 1, size: 0.05, count: 380, offset: 1300, flat: 1, bright: 1.1 });
  if (L.line) M.ring.put(pos, rq, sc * L.rad, hex(0xfff2fb), MAT.PEARL, 0.05, 0, 0, 0.2);
  for (let i = 0; i < L.beads; i++) { const a = i / L.beads * TAU + 0.3 + 0.25 * Math.sin(i * 2.3), p = new V3(Math.cos(a) * L.rad * sc, 0, Math.sin(a) * L.rad * sc).applyQ(rq).add(pos);
    M.ball.put(p, q, sc * L.bead * (0.6 + 0.4 * ((i * 7) % 5) / 4), hex(0xfff2fb), MAT.PEARL, 0.06, 0, 0, i * 0.37); }
});
"""

def pearl_crest_js(tall=1.75, emit=0.12):
    """The crest in pearl. tall: the crest's height factor (the game's own Chimera crest is 1.75x; 1 = the droplet's)."""
    return WRAP + "window.__PC = %s;" % json.dumps(dict(tall=tall, emit=emit)) + r"""
__wrapDC(function (k, m, a, put) {
  if (k === 'oct' && a[4] === MAT.GLASS && __same(a[3], 0x9ff6ff)) { const L = window.__PC, s = a[2];
    const up = new V3(0, 1, 0).applyQ(a[1]); const p = a[0].clone().addS(up, (L.tall - 1) * s.y * 0.48);
    return put(p, a[1], new V3(s.x * (1 + (L.tall - 1) * 0.25), s.y * L.tall, s.z * (1 + (L.tall - 1) * 0.25)), hex(0xfff2fb), MAT.PEARL, L.emit, 0, 0, 0.35); }
  return put(...a);
});
"""

def orbit_scene_js(az=0.6, lift=34.0, el=0.42, dist=7.0, cam_side=0.0, cam_up=0.0, aim=0.45, aim_side=0.0, aim_up=0.0, fov=0.75,
                   face=0.0, arc=3.6, a0=0.0, width=0.22, alpha=0.9, tilt=0.0):
    """Pass tile: the droplet riding a pearl orbit around Nacre (woken). The orbit is drawn the way the game draws its
    light strips (FX.strip, as for the space halos around worlds), fading behind the droplet like a path travelled."""
    S = dict(az=az, lift=lift, el=el, dist=dist, cam_side=cam_side, cam_up=cam_up, aim=aim, aim_side=aim_side, aim_up=aim_up, fov=fov,
             face=face, arc=arc, a0=a0, width=width, alpha=alpha, tilt=tilt)
    return "window.__O = %s;" % json.dumps(S) + r"""
G.state = 'title';
{ const T = window.__O, pl = planetById('nacre'), Nc = pl.c.clone(), U = new V3(0, 1, 0);
  const ud = new V3(Math.cos(T.az), 0, Math.sin(T.az)); const tg = new V3().crossOf(U, ud).norm();
  // orbit plane: spanned by ud and tg tilted about ud
  const t2 = tg.clone(); rotAround(t2, ud, T.tilt); const R0 = pl.r + T.lift;
  const C = Nc.clone().addS(ud, R0);
  const camDir = ud.clone(); rotAround(camDir, tg, -T.el);   // lift the camera above the orbit plane
  const camPos = C.clone().addS(camDir, T.dist).addS(tg, T.cam_side).addS(U, T.cam_up);
  const tgt = C.clone().lerp(Nc, T.aim).addS(tg, T.aim_side).addS(U, T.aim_up);
  const fa = camPos.clone().sub(C); fa.y = 0; fa.norm(); rotAround(fa, U, T.face);
  G.titlePos = C.clone(); G.titleFace = fa.clone(); window.__C = C;
  G.camHook = function (CB) { G.titlePos = C.clone(); G.titleFace = fa.clone(); CB.pos.copy(camPos); CB.target.copy(tgt); CB.up.set(0, 1, 0); CB.fov = T.fov; return 1; };
  const dd = R.drawDust; R.drawDust = function (o) { if (G.state === 'title' && o.c && o.c.dist(C) < 0.01) return; return dd.call(R, o); };
  const fx = drawFxLists; window.__orbitFx = function () {
    const pts = [], pts2 = [], n = 120; for (let i = 0; i <= n; i++) { const a = T.a0 - i / n * T.arc; const p = VP.get().copy(Nc).addS(ud, Math.cos(a) * R0).addS(t2, Math.sin(a) * R0); pts.push(p); pts2.push(VP.get().copy(p)); }
    const up = (p, o) => o.copy(R.cam.pos).sub(p).norm();
    FX.strip(pts, up, t => T.width * (1 - t * 0.5), t => mixc(hex(0xfff2fb, 1.7), hex(0xff9ad5, 1.3), t), t => T.alpha * Math.pow(1 - t, 1.3));
    FX.strip(pts2, up, t => T.width * 0.3 * (1 - t * 0.6), hex(0xffffff, 2.4), t => T.alpha * Math.pow(1 - t, 2.2));
  };
  const dc = window.__keep.dc; drawCreature = function (...a) { window.__orbitFx(); return dc(...a); };
}
"""

def orbit2_js(az=0.6, el=0.12, DN=113.0, dC=9.5, ox=0.2, oy=-0.17, aimR=0.07, aimU=-0.06, fov=0.75, tilt=0.0,
              arc=3.3, a0=-0.03, w0=0.06, w1=1.4, alpha=0.95, face=0.5, sgn=1):
    """Pass tile, take two: camera DN from Nacre's centre (azimuth az, elevation el); the droplet dC in front of the camera,
    offset (ox right, oy up, radians) from Nacre's direction; a pearl orbit around Nacre passes through the droplet and
    fades along the way it has come (FX.strip, the game's own light strips)."""
    S = dict(az=az, el=el, DN=DN, dC=dC, ox=ox, oy=oy, aimR=aimR, aimU=aimU, fov=fov, tilt=tilt, arc=arc, a0=a0, w0=w0, w1=w1, alpha=alpha, face=face, sgn=sgn)
    return "window.__O = %s;" % json.dumps(S) + r"""
G.state = 'title';
{ const T = window.__O, pl = planetById('nacre'), Nc = pl.c.clone(), Y = new V3(0, 1, 0);
  const w = new V3(Math.cos(T.az) * Math.cos(T.el), Math.sin(T.el), Math.sin(T.az) * Math.cos(T.el));
  const Cam = Nc.clone().addS(w, T.DN), v2 = w.clone().neg();
  const r = new V3().crossOf(v2, Y).norm(), u = new V3().crossOf(r, v2).norm();
  const v1 = v2.clone().addS(r, T.ox).addS(u, T.oy).norm(); const C = Cam.clone().addS(v1, T.dC);
  const e1 = C.clone().sub(Nc); const R0 = e1.len(); e1.norm();
  const no = Y.clone().addS(e1, -Y.dot(e1)).norm(); rotAround(no, e1, T.tilt);
  let t = new V3().crossOf(no, e1).norm(); if (t.dot(r) * T.sgn < 0) t.neg();
  const tdir = v2.clone().addS(r, T.aimR).addS(u, T.aimU).norm(); const tgt = Cam.clone().addS(tdir, 30);
  const fa = Cam.clone().sub(C); fa.y = 0; fa.norm(); rotAround(fa, Y, T.face);
  G.titlePos = C.clone(); G.titleFace = fa.clone();
  G.camHook = function (CB) { G.titlePos = C.clone(); G.titleFace = fa.clone(); CB.pos.copy(Cam); CB.target.copy(tgt); CB.up.set(0, 1, 0); CB.fov = T.fov; return 1; };
  const dd = R.drawDust; R.drawDust = function (o) { if (G.state === 'title' && o.c && o.c.dist(C) < 0.01) return; return dd.call(R, o); };
  window.__orbitFx = function () {
    const pts = [], pts2 = [], n = 160; for (let i = 0; i <= n; i++) { const a = T.a0 - i / n * T.arc; const p = VP.get().copy(Nc).addS(e1, Math.cos(a) * R0).addS(t, Math.sin(a) * R0); pts.push(p); pts2.push(VP.get().copy(p)); }
    const up = (p, o) => o.copy(R.cam.pos).sub(p).norm();
    FX.strip(pts, up, k => T.w0 + T.w1 * k, k => mixc(hex(0xfff2fb, 1.6), hex(0xff9ad5, 1.4), Math.min(1, k * 1.5)), k => T.alpha * Math.pow(1 - k, 1.2));
    FX.strip(pts2, up, k => (T.w0 + T.w1 * k) * 0.3, hex(0xffffff, 2.2), k => T.alpha * Math.pow(1 - k, 2.0));
  };
  const dc = window.__keep.dc; drawCreature = function (...a) { window.__orbitFx(); return dc(...a); };
}
"""

def limb_orbit_js(arc=1.2, a0=-0.06, w0=0.12, w1=0.0, alpha=0.9, sgn=1, lean=0.0):
    """Pass tile: a pearl orbit (FX.strip, the game's light strips) on a great circle of Nacre through the droplet,
    the plane holding the camera's right vector so the path runs along the world's limb; it fades the way it came."""
    S = dict(arc=arc, a0=a0, w0=w0, w1=w1, alpha=alpha, sgn=sgn, lean=lean)
    return "window.__LO = %s;" % json.dumps(S) + r"""
{ const T = window.__LO, pl = planetById('nacre'), Nc = pl.c.clone();
  window.__orbitFx = function () { const C = G.titlePos; if (!C) return;
    const e1 = C.clone().sub(Nc); const R0 = e1.len(); e1.norm();
    const v = R.cam.target.clone().sub(R.cam.pos).norm(); const r = new V3().crossOf(v, R.cam.up).norm();
    let t = r.clone().addS(e1, -r.dot(e1)).norm(); rotAround(t, e1, T.lean); if (T.sgn < 0) t.neg();
    const pts = [], pts2 = [], n = 140; for (let i = 0; i <= n; i++) { const a = T.a0 - i / n * T.arc; const p = VP.get().copy(Nc).addS(e1, Math.cos(a) * R0).addS(t, Math.sin(a) * R0); pts.push(p); pts2.push(VP.get().copy(p)); }
    const up = (p, o) => o.copy(R.cam.pos).sub(p).norm();
    FX.strip(pts, up, k => T.w0 + T.w1 * k, k => mixc(hex(0xfff2fb, 1.6), hex(0xff9ad5, 1.4), Math.min(1, k * 1.4)), k => T.alpha * Math.pow(1 - k, 1.1));
    FX.strip(pts2, up, k => (T.w0 + T.w1 * k) * 0.3, hex(0xffffff, 2.2), k => T.alpha * Math.pow(1 - k, 1.8));
  };
  const dc = drawCreature; drawCreature = function (...a) { window.__orbitFx(); return dc(...a); };
}
"""

def world_ring_js(k=1.55, tilt=0.35, w=0.5, alpha=0.8):
    """A thin pearl orbit around Nacre (FX.strip circle, like the game's halo around a world you can land on)."""
    return "window.__WR = %s;" % json.dumps(dict(k=k, tilt=tilt, w=w, alpha=alpha)) + r"""
{ const T = window.__WR, pl = planetById('nacre'), Nc = pl.c.clone();
  window.__ringFx = function () {
    const v = R.cam.pos.clone().sub(Nc).norm(); const r = new V3().crossOf(v, new V3(0, 1, 0)).norm(); const u = new V3().crossOf(r, v).norm();
    const ax = u.clone(); rotAround(ax, r, T.tilt * 0 + (Math.PI / 2 - 0.32)); rotAround(ax, v, T.tilt);
    const e1 = new V3().crossOf(ax, v).norm(), e2 = new V3().crossOf(ax, e1).norm();
    const pts = [], n = 200; for (let i = 0; i <= n; i++) { const a = i / n * TAU; pts.push(VP.get().copy(Nc).addS(e1, Math.cos(a) * pl.r * T.k).addS(e2, Math.sin(a) * pl.r * T.k)); }
    const up = (p, o) => o.copy(R.cam.pos).sub(p).norm();
    FX.strip(pts, up, T.w, hex(0xfff2fb, 1.5), T.alpha);
  };
  const dc = drawCreature; drawCreature = function (...a) { window.__ringFx(); return dc(...a); };
}
"""

def neb_js(x):
    """Hold the sky's contour-line strength at x for this view (render() eases it toward the mode's value each frame)."""
    return "{ const ds = R.drawSky; R.drawSky = function (...a) { R.sky.neb = %f; return ds.apply(R, a); }; }" % x

def marker_js(pose='next', matte=False, spin=0.6, gem=0.5, col='0xffc6ea', emit=1.4, ring=0.62, tilt=1.15, glint=True, swoosh=True, dist=4.0, fov=0.5, heldK=0.55):
    """The pass marker: Nacre's matter gem exactly as drawPickups draws it (M.gem0, MAT.GLOW, the world's matter colour x2.2),
    alone in the dark. next: spinning (two fading after-images, the game's ghost trick) with a small star glint (the Nova's
    crossed-octahedra glint); held: settled, calmer, in a small pearl ring (M.torus, MAT.PEARL). matte=True draws the same
    shapes flat white for the alpha matte."""
    S = dict(pose=pose, matte=matte, spin=spin, gem=gem, col=col, emit=emit, ring=ring, tilt=tilt, glint=glint, swoosh=swoosh, dist=dist, fov=fov, heldK=heldK)
    return "window.__MK = %s;" % json.dumps(S) + r"""
G.state = 'title';
R.drawPlanet = function () {}; R.drawAtmo = function () {}; drawRingBits = function () {}; drawRingDust = function () {}; R.drawDust = function () {}; drawSunburst = function () {}; drawDecor = function () {};
{ const T = window.__MK, C = new V3(600, 300, 600), Y = new V3(0, 1, 0), F = new V3(0, 0, 1);
  G.titlePos = C.clone(); G.titleFace = F.clone();
  G.camHook = function (CB) { CB.pos.copy(C).addS(F, T.dist).addS(Y, T.pose === 'held' ? T.dist * 0.42 : T.dist * 0.08); CB.target.copy(C).addS(Y, T.pose === 'held' ? -0.04 : 0); CB.up.set(0, 1, 0); CB.fov = T.fov; return 1; };
  const W = hex(0xffffff), mc = hex(parseInt(T.col), 2.2);
  const put = (mesh, p, q, s, c, mat, e, seed) => T.matte ? mesh.put(p, q, s, W, MAT.GLOW, 1.0) : mesh.put(p, q, s, c, mat, e, 0, 0, seed || 0);
  drawCreature = function () {
    const ax = new V3(0.3, 1, 0.2).norm();
    if (T.pose === 'next') {
      const q = new Q().axisAngle(ax, T.spin);
      if (T.swoosh && !T.matte) for (let i = 1; i <= 2; i++) { const qi = new Q().axisAngle(ax, T.spin - i * 0.42); M.gem0.put(C.clone().addS(F, -0.02 * i), qi, T.gem * (1 + i * 0.02), mc, MAT.GLOW, T.emit * (0.42 / i)); }
      put(M.gem0, C.clone().addS(F, 0.01), q, T.gem, mc, MAT.GLOW, T.emit);
      if (T.glint) { const g = C.clone().add(new V3(T.gem * 0.62, T.gem * 0.66, T.gem * 0.5)); const gs = T.gem;
        for (let i = 0; i < 2; i++) { const qg = new Q().axisAngle(F, i * Math.PI / 2 + 0.25); put(M.oct, g, qg, new V3(gs * 0.06, gs * 0.62, gs * 0.06), hex(0xfff2d0), MAT.GLOW, 6); }
        put(M.ball, g, new Q(), gs * 0.1, W, MAT.GLOW, 8); }
    } else {
      const q = new Q().axisAngle(ax, T.spin);
      const rq = new Q().axisAngle(new V3(1, 0, 0), 0.0);
      put(M.torus, C.clone().addS(Y, -T.gem * 0.42), rq, T.ring, hex(0xfff2fb), MAT.PEARL, 0.06, 0.3);
      put(M.gem0, C.clone().addS(Y, -T.gem * 0.05), q, T.gem * 0.86, mc, MAT.GLOW, T.emit * T.heldK);
    }
  };
}
"""
