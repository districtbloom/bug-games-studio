import json, sys, math
sys.path.insert(0, '.')
from bshot import spec
S = []
def lk(eye, az, pitch):
    a = math.radians(az); return [round(eye[0] + math.cos(a) * 10, 3), round(eye[1] + math.tan(math.radians(pitch)) * 10, 3), round(eye[2] + math.sin(a) * 10, 3)]
FW = [(0.22, 0.52, 1.5, .5), (0.6, 0.22, 3.5, .38), (0.86, 0.6, 2.5, .62), (0.45, 0.78, 4.0, .8)]
def add(name, eye, az, pitch, lens, H=22.0, fw=FW):
    s, f = spec(name, 860, 300, H, eye, lk(eye, az, pitch), lens, fw, check=False)
    print(name, [(round(a / math.pi, 3), round(e, 3)) for a, e, *_ in f]); S.append(s)
add('b1_e_162', [4, 25.62, -63], 122, 6, 26)
add('b2_e_120', [4, 25.2, -63], 122, 7, 26)
add('b3_se_24', [5, 25.4, -61], 125, 6, 24)
add('b4_ne_28', [6, 25.62, -66], 125, 6, 28)
json.dump(S, open(sys.argv[1], 'w'), indent=1)
