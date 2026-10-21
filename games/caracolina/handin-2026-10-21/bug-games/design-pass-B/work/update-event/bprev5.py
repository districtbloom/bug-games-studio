import json, sys, math
sys.path.insert(0, '.')
from bshot import spec
S = []
def lk(eye, az, pitch):
    a = math.radians(az); return [round(eye[0] + math.cos(a) * 10, 3), round(eye[1] + math.tan(math.radians(pitch)) * 10, 3), round(eye[2] + math.sin(a) * 10, 3)]
FW = [(0.12, 0.5, 1.5, .55), (0.42, 0.26, 3.5, .34), (0.64, 0.62, 2.5, .66), (0.85, 0.36, 4.0, .45), (0.3, 0.78, 1.0, .85)]
def add(name, eye, az, pitch, lens, H=22.0, fw=FW):
    s, f = spec(name, 860, 300, H, eye, lk(eye, az, pitch), lens, fw, check=True)
    print(name, [(round(a / math.pi, 3), round(e, 3)) for a, e, *_ in f]); S.append(s)
add('e1', [8.4, 26.6, -63.6], 112, 6, 30)
add('e2', [8.4, 26.3, -63.6], 111, 8, 28)
json.dump(S, open(sys.argv[1], 'w'), indent=1)
