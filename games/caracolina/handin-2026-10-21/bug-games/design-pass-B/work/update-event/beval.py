import sys, math
sys.path.insert(0, '.')
from bshot import world_to_ndc, ndc_to_fw
PI = math.pi; CIM = (-5, 24, -64)
names = ['aurora','remei','pere','merce','lluna','tomas','bernat','rosalia','quim','dolors','jaume','fisher','fisher2','shopper','shopper2','nonna','boy','boy2','musician','s','s','s','tinta']
crowd = []
for i, n in enumerate(names):
    if n == 's': continue
    a = .35 + ((i * .618034) % 1) * (PI - .7); r = 4.4 + (i % 3) * 2.3
    crowd.append((n, [CIM[0] + math.cos(a) * r, 24 + 1.7, CIM[2] + math.sin(a) * r]))
lanterns = [[CIM[0] + math.cos(a) * 12.7, 25.6, CIM[2] + math.sin(a) * 12.7] for a in (.5, 1.2, 1.95, 2.65)]
def ev(eye, az, pitch, lens, W=1720, H=600):
    a = math.radians(az); look = [eye[0] + math.cos(a) * 10, eye[1] + math.tan(math.radians(pitch)) * 10, eye[2] + math.sin(a) * 10]
    out = []
    for n, p in crowd:
        x, y, z = world_to_ndc(eye, look, lens, W, H, p)
        if z > 0: out.append((round((x + 1) / 2, 2), n, round(z, 1)))
    out.sort(); print('crowd x (0..1), dist:', out)
    for nm, p in [('egg', [CIM[0], 27, CIM[2]]), ('egg+3', [CIM[0], 27, CIM[2] + 3]), ('eggN', [CIM[0] + 3, 27, CIM[2]])] + [('lant%d' % i, l) for i, l in enumerate(lanterns)]:
        x, y, z = world_to_ndc(eye, look, lens, W, H, p)
        print(f'  {nm}: x {(x + 1) / 2:.2f} y(top=0) {(1 - y) / 2:.2f} dist {z:.1f}' + ('' if z > 0 else ' BEHIND'))
    for sx in (-0.1, 0.3, 0.7, 1.0):
        az_, el = ndc_to_fw(eye, look, lens, W, H, sx, 0.4); print(f'  sx {sx}: az {az_ / PI:.3f}pi')
    # horizon y
    x, y, z = world_to_ndc(eye, look, lens, W, H, [eye[0] + math.cos(a) * 1000, eye[1], eye[2] + math.sin(a) * 1000]); print(f'  horizon y(top=0) {(1 - y) / 2:.2f}')
    return look
if __name__ == '__main__':
    eye = [float(v) for v in sys.argv[1].split(',')]; ev(eye, float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]))
