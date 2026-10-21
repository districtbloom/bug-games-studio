"""spec builder for the update picture: a resident turned to the eye by the game's own PEOPLE.attend().
eye and look are offsets from the resident's standing point (x, y above her floor, z).
spec(name, w, h, who, hour, eye_off, look_off, lens, attn=True, dof=None) -> render.js spec"""
import json, math
def spec(name, w, h, who, hour, eye, look, lens, attn=True, dof=None, lt=2.0, png=False, extra=''):
    js = (f"PEOPLE.festival=false; const r=PEOPLE.find('{who}'); r.visible=false; r.entry=-1; r.attnK=0;\n"
          f"for(let k=0;k<30;k++) PEOPLE.update(.05,{hour},98+k*.05);\n"
          f"const P=r.pos, E=[P[0]+{eye[0]},P[1]+{eye[1]},P[2]+{eye[2]}], L=[P[0]+{look[0]},P[1]+{look[1]},P[2]+{look[2]}];\n"
          + ("PEOPLE.attn={id:'%s',p:[E[0],E[2]]};\n" % who if attn else "PEOPLE.attn=null;\n")
          + "for(let k=0;k<40;k++) PEOPLE.attend(.05);\n" + extra
          + f"window.__shot={{who:'{who}',P:P.slice(),E,L}};\n"
          + f"return {{hour:{hour},eye:[E,E],look:[L,L],lens:{lens}" + (f",dof:{json.dumps(dof)}" if dof else "") + "};")
    return dict(name=name, w=w, h=h, lt=lt, png=png, shotJs=js)
def off(d, dist, h=1.62):
    n = math.hypot(*d); d = (d[0] / n, d[1] / n)
    return [round(d[0] * dist, 3), h, round(d[1] * dist, 3)]
