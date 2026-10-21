"""titlejs(...): a render.js `js` string that stages the creature the way the game's TITLE SCREEN does:
floating above a world (5.5 units over Nacre's surface on the real title), at title scale 1.0, with the title's
pink/cyan dust ring, and a posed camera.
  world: the world it floats over;  up_dir: [x,y,z] direction from the world's centre (default: the side that faces the
  Eclipse, tilted k above it, see pose.pn);  lift: height above the surface (title: 5.5)
  cam: angle of the camera from the line creature->Eclipse (0 = Eclipse right behind the creature)
  face: extra turn of the creature's face from the camera toward the Eclipse;  dist, up, ty, fov, side: camera
"""
def titlejs(world='nacre', up_dir=None, lift=5.5, cam=-0.3, face=0.45, dist=6.0, up=0.0, ty=0.0, fov=0.55, side=-0.5, scale=1.0):
    ud = 'null' if up_dir is None else '[%s]' % ','.join(str(x) for x in up_dir)
    return f"""G.state='title'; window.__tt = {{ world: '{world}', ud: {ud}, lift: {lift}, cam: {cam}, face: {face}, dist: {dist}, up: {up}, ty: {ty}, fov: {fov}, side: {side}, scale: {scale} }};
{{ const T=window.__tt, pl=planetById(T.world), U=new V3(0,1,0);
  const ud=T.ud ? new V3(T.ud[0],T.ud[1],T.ud[2]).norm() : U.clone();
  const C=pl.c.clone().addS(ud, pl.r + T.lift);
  const E=planetById('umbra').c.clone().sub(C); E.y=0; E.norm();
  const fc=E.clone().neg(); rotAround(fc, U, T.cam);
  const fa=fc.clone(); rotAround(fa, U, T.face);
  const rt=new V3().crossOf(fc,U).norm();
  window.__ttC=C; window.__ttF=fa;
  G.camHook=function(CB){{ G.titlePos=C.clone(); G.titleFace=fa.clone(); CB.pos.copy(C).addS(fc,T.dist).addS(U,T.up); CB.target.copy(C).addS(U,T.ty).addS(rt,T.side); CB.up.set(0,1,0); CB.fov=T.fov; return 1; }};
  if (T.scale !== 1.0) {{ const dc=drawCreature; drawCreature=function(p,n,f,o){{ return dc(p,n,f,Object.assign({{}},o||{{}},{{scale:T.scale}})); }}; }}
}}"""
