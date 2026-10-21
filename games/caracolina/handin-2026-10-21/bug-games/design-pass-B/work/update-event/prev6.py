import json, sys, math
sys.path.insert(0, '.')
from ushot import spec
def ang(deg, dist, h=1.62):
    a = math.radians(deg); return [round(math.cos(a) * dist, 3), h, round(math.sin(a) * dist, 3)]
def look(phi, dist, yaw_off_deg, h):
    # look point: from the camera toward the resident, rotated by yaw_off (deg, + = to the right/-z side)
    e = ang(phi, dist); dx, dz = -e[0], -e[2]; a = math.atan2(dz, dx) + math.radians(yaw_off_deg)
    L = math.hypot(dx, dz); return [round(e[0] + math.cos(a) * L, 3), h, round(e[2] + math.sin(a) * L, 3)]
S = []
H = 19.8
S.append(spec('x1_door_m24_45', 800, 400, 'quim', H, ang(-24, 3.0), look(-24, 3.0, 4, 1.67), 45))
S.append(spec('x2_door_m28_45', 800, 400, 'quim', H, ang(-28, 3.0), look(-28, 3.0, 5, 1.67), 45))
S.append(spec('x3_m4_50', 800, 400, 'quim', H, ang(-4, 3.0), look(-4, 3.0, -3, 1.67), 50))
S.append(spec('x4_thumb_m24_70', 616, 308, 'quim', H, ang(-24, 3.0), look(-24, 3.0, 4, 1.75), 70))
json.dump(S, open(sys.argv[1], 'w'), indent=1)
