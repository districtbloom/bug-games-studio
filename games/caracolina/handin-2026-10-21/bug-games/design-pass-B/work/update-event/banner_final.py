"""Festival of the Shell banner: the summit on the festival night (festival:true), 22:00.
Camera at the east edge of El Cim, 2.6 m above the summit floor, looking SSW over the balustrade,
the crowd (the whole town, placed by people.js on the festival night) on the right, the fireworks over the sea.
Fireworks: the studio's fireworks() is replaced by six bursts placed in the right 55%; each one is converted to the
game's (az, el) and checked against game.js festival(): az in [0.1pi, 0.9pi], el in [.18, .48]."""
import json, sys, math
sys.path.insert(0, '.')
from bshot import spec
def lk(eye, az, pitch):
    a = math.radians(az); return [round(eye[0] + math.cos(a) * 10, 3), round(eye[1] + math.tan(math.radians(pitch)) * 10, 3), round(eye[2] + math.sin(a) * 10, 3)]
EYE, AZ, PITCH, LENS, HOUR = [8.4, 26.6, -63.6], 115, 6, 32, 22.0
FW = [(0.08, 0.42, 1.5, .55), (0.38, 0.24, 3.5, .38), (0.62, 0.56, 2.5, .62), (0.86, 0.39, 4.0, .48), (0.30, 0.74, 1.0, .86)]
if __name__ == '__main__':
    W, H, name, png = (1720, 600, 'festival_banner', True) if (len(sys.argv) < 3 or sys.argv[2] == 'final') else (860, 300, 'festival_banner_prev', False)
    s, f = spec(name, W, H, HOUR, EYE, lk(EYE, AZ, PITCH), LENS, FW, png=png, check=True)
    print([(round(a / math.pi, 3), round(e, 3)) for a, e, *_ in f])
    json.dump([s], open(sys.argv[1], 'w'), indent=1)
