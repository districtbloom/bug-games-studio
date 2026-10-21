# builds update preview specs: python3 mk_upd.py out.json  (edit CAMS below)
import json, sys, math
R = [1.6, -4.2, 33.6]
def spec(name, w, h, hour, eye, look, lens, attn=True, dof=None, lt=2.0, png=False):
    js = f"""
PEOPLE.festival=false;
const r=PEOPLE.find('remei'); r.visible=false; r.entry=-1; r.attnK=0;
for(let k=0;k<30;k++) PEOPLE.update(.05,{hour},98+k*.05);
PEOPLE.attn={'{'}id:'remei',p:[{eye[0]},{eye[2]}]{'}'};
if(!{str(attn).lower()}) PEOPLE.attn=null;
for(let k=0;k<40;k++) PEOPLE.attend(.05);
return {json.dumps(dict(hour=hour, eye=[eye, eye], look=[look, look], lens=lens, **({'dof': dof} if dof else {})))};
"""
    return dict(name=name, w=w, h=h, lt=lt, png=png, shotJs=js)
if __name__ == '__main__':
    H = 19.75
    def at(d, dist, h=1.55):  # camera at R + dist*d (d = unit xz from Remei to camera)
        n = math.hypot(*d); d = (d[0]/n, d[1]/n)
        return [round(R[0]+d[0]*dist, 3), round(R[1]+h, 3), round(R[2]+d[1]*dist, 3)]
    tgt = [R[0], R[1]+1.2, R[2]]
    S = []
    # P1: behind her (north-east), looking south-west, the sun at the right
    e1 = at((0.82, -0.57), 2.8); S.append(spec('p1_behind', 800, 400, H, e1, tgt, 40))
    # P2: east of her, looking west into the sun, sun beside her
    e2 = at((0.97, -0.38), 2.8); S.append(spec('p2_east', 800, 400, H, e2, tgt, 40))
    # P3: west of her, front lit
    e3 = at((-1, 0.1), 2.8); S.append(spec('p3_west', 800, 400, H, e3, tgt, 40))
    # P4: wide context from behind, 28mm
    e4 = at((0.6, -0.8), 4.5, 1.6); S.append(spec('p4_wide', 800, 400, H, e4, tgt, 26))
    json.dump(S, open(sys.argv[1], 'w'), indent=1)
