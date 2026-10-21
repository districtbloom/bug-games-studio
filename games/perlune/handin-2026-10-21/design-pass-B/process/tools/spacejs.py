"""spacejs(...): a render.js `js` string that lifts the creature into space (the glide between worlds) and poses a camera.
  pos: creature position (world units; Umbra/the Eclipse sits at the origin, Nacre at (430,0,120))
  cam: angle (radians) the camera sits from the line creature->Eclipse, seen from the creature (0 = the Eclipse right behind the creature)
  face: extra turn of the creature's face from the camera, toward the Eclipse (radians)
  dist, up, ty, fov, side: camera distance, height, target height, field of view, sideways shift of the target (+ = creature moves left)
"""
def spacejs(pos, cam=0.35, face=0.4, dist=5, up=0.5, ty=0.5, fov=0.7, side=0.0, hide_space_bits=True):
    px, py, pz = pos
    hide = "drawSpaceBits=function(){}; drawHoops=function(){}; drawSpaceRibbon=function(){};" if hide_space_bits else ""
    return f"""enterSpace(); G.state='space'; P.pos.set({px},{py},{pz}); P.n.set(0,1,0); G.sp.speed=0; P.vel.set(0,0,0);
const U=new V3(0,1,0), E=planetById('umbra').c.clone().sub(P.pos); E.y=0; E.norm();
const fc=E.clone().neg(); rotAround(fc, U, {cam});            /* from the creature toward the camera */
const fa=fc.clone(); rotAround(fa, U, {face}); P.face.copy(fa); P.F.copy(fa); G.sp.H.copy(fa);
{hide}
const rt=new V3().crossOf(fc,U).norm();
G.camHook=function(CB){{ CB.pos.copy(P.pos).addS(fc,{dist}).addS(U,{up}); CB.target.copy(P.pos).addS(U,{ty}).addS(rt,{side}); CB.up.set(0,1,0); CB.fov={fov}; return 1; }};"""
