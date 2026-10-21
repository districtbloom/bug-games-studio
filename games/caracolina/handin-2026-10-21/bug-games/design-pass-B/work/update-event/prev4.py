import json, sys, math
sys.path.insert(0, '.')
from ushot import spec, off
def rot(v, deg):
    a = math.radians(deg); return (v[0] * math.cos(a) - v[1] * math.sin(a), v[0] * math.sin(a) + v[1] * math.cos(a))
S = []
H = 19.8
A = (0.987, -0.153)
S.append(spec('v1_p5_40', 800, 400, 'quim', H, off(rot(A, 5), 3.0), [0, 1.5, 0], 40))
S.append(spec('v2_m6_40', 800, 400, 'quim', H, off(rot(A, -6), 3.0), [0, 1.5, 0], 40))
S.append(spec('v3_m6_35_close', 800, 400, 'quim', H, off(rot(A, -6), 2.6), [0, 1.5, 0], 35))
S.append(spec('v4_thumb70', 616, 308, 'quim', H, off(rot(A, -6), 3.0), [0, 1.55, 0], 70))
json.dump(S, open(sys.argv[1], 'w'), indent=1)
