"""pn(world, k): the surface normal on <world> from which the Eclipse (Umbra, at the origin) stands atan(k) above the horizon."""
import math
POS = {'nacre': (430, 120), 'ferrum': (-160, 430), 'cathedra': (250, -390), 'hydrargyra': (-430, -170), 'geode': (120, 260)}
def pn(world, k):
    x, z = POS[world]; l = math.hypot(x, z); dx, dz = -x / l, -z / l
    v = (dx * k, 1.0, dz * k); n = math.sqrt(sum(c * c for c in v)); return [round(c / n, 4) for c in v]
