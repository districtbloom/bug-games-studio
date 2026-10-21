import json, sys
sys.path.insert(0, '.')
from ushot import spec, off
S = []
H = 19.8
e = off((0.38, -1), 2.9)
S.append(spec('u1_45_dof', 800, 400, 'tomas', H, e, [0, 1.25, 0], 45, dof={'f': 2.9, 'ap': 3}))
S.append(spec('u2_45', 800, 400, 'tomas', H, e, [-0.25, 1.25, 0], 45))
S.append(spec('u3_45_noattn', 800, 400, 'tomas', H, e, [0, 1.25, 0], 45, attn=False))
S.append(spec('u4_thumb85', 616, 308, 'tomas', H, e, [0, 1.45, 0], 85))
json.dump(S, open(sys.argv[1], 'w'), indent=1)
