import json, sys, math
sys.path.insert(0, '.')
from ushot import spec, off
def ang(deg, dist, h=1.62):
    a = math.radians(deg); return [round(math.cos(a) * dist, 3), h, round(math.sin(a) * dist, 3)]
S = []
H = 19.8
S.append(spec('w1_eyewall_se', 800, 400, 'quim', H, off((0.2, 1), 3.0), [0, 1.75, 0], 35))
S.append(spec('w2_eyewall_sw', 800, 400, 'quim', H, off((-0.35, 1), 3.0), [0, 1.75, 0], 35))
S.append(spec('w3_eyewall_se_noattn', 800, 400, 'quim', H, off((0.2, 1), 3.0), [0, 1.75, 0], 35, attn=False))
S.append(spec('w4_sunthumb60', 616, 308, 'quim', H, ang(-16, 3.0), [0, 1.62, 0], 60))
json.dump(S, open(sys.argv[1], 'w'), indent=1)
