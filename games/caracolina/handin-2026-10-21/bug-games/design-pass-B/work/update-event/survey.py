import json, sys
sys.path.insert(0, '.')
from ushot import spec, off
S = []
S.append(spec('s1_remei1950', 640, 320, 'remei', 19.5, off((0.3, -1), 5), [0, 1, 0], 26))
S.append(spec('s2_tomas_ne', 640, 320, 'tomas', 19.75, off((0.45, -1), 3.2), [0, 1.1, 0], 26))
S.append(spec('s3_aurora_w', 640, 320, 'aurora', 19.75, off((-1, 0.25), 3.2), [0, 1.1, 0], 32))
S.append(spec('s4_aurora_s', 640, 320, 'aurora', 19.75, off((0.3, 1), 3.2), [0, 1.1, 0], 32))
json.dump(S, open(sys.argv[1], 'w'), indent=1)
