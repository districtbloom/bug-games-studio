import json, sys, math
sys.path.insert(0, '.')
from bshot import spec, ndc_to_fw
CIM = [-5, 24, -64]
S = []
H = 21.7
B = [(0.0, 0.55, 1.3, .45), (0.45, 0.35, 4.1, .6), (0.8, 0.62, 2.2, .35)]
def add(name, eye, look, lens, bursts=B):
    s, f = spec(name, 860, 300, H, eye, look, lens, bursts, check=False); S.append(s)
    print(name, [(round(a / math.pi, 3), round(e, 3)) for a, e, *_ in f])
# o1: north-west of the summit looking south-east, crowd to the right
add('o1_nw_se', [-12.5, 25.62, -70.5], [10, 25.0, -50], 26)
# o2: west edge looking east-south-east
add('o2_w_ese', [-16.5, 25.62, -61.5], [15, 24.5, -50], 26)
# o3: north of the crowd, centre, looking south (reference)
add('o3_n_s', [-5, 25.62, -69], [-5, 24.5, -40], 26)
# o4: north-east looking south
add('o4_ne_s', [3, 25.62, -70], [-2, 24.5, -40], 26)
json.dump(S, open(sys.argv[1], 'w'), indent=1)
