import json, sys, math
sys.path.insert(0, '.')
from bshot import spec
S = []
def lk(eye, az, pitch):
    a = math.radians(az); return [round(eye[0] + math.cos(a) * 10, 3), round(eye[1] + math.tan(math.radians(pitch)) * 10, 3), round(eye[2] + math.sin(a) * 10, 3)]
FW = [(0.14, 0.45, 1.5, .5), (0.52, 0.28, 3.5, .36), (0.82, 0.55, 2.5, .62), (0.42, 0.7, 4.0, .82), (0.95, 0.4, 1.0, .2)]
def add(name, eye, az, pitch, lens, H=22.0, fw=FW):
    s, f = spec(name, 860, 300, H, eye, lk(eye, az, pitch), lens, fw, check=True)
    print(name, [(round(a / math.pi, 3), round(e, 3)) for a, e, *_ in f]); S.append(s)
add('c2', [7, 26.6, -65], 106, 6, 26)
add('c3', [6.5, 26.2, -66.5], 104, 8, 26)
json.dump(S, open(sys.argv[1], 'w'), indent=1)
