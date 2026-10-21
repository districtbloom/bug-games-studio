import json, sys, math
sys.path.insert(0, '.')
from ushot import spec, off
def rot(v, deg):
    a = math.radians(deg); return (v[0] * math.cos(a) - v[1] * math.sin(a), v[0] * math.sin(a) + v[1] * math.cos(a))
S = []
H = 19.8
toSunOpp = (0.987, -0.153)   # from the resident away from the sun (camera side)
S.append(spec('q1_quim_p8', 800, 400, 'quim', H, off(rot(toSunOpp, 8), 3.0), [0, 1.3, 0], 35))
S.append(spec('q2_quim_m8', 800, 400, 'quim', H, off(rot(toSunOpp, -8), 3.0), [0, 1.3, 0], 35))
S.append(spec('q3_quim_p8_noattn', 800, 400, 'quim', H, off(rot(toSunOpp, 8), 3.0), [0, 1.3, 0], 35, attn=False))
S.append(spec('q4_quim_wide', 800, 400, 'quim', H, off(rot(toSunOpp, 20), 6.0), [0, 1.3, 0], 22))
json.dump(S, open(sys.argv[1], 'w'), indent=1)
