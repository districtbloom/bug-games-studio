"""Update picture (version 3: residents turn to face you when you talk to them).
Quim at his place in the garden of eyes (15:00-20:36, facing the sunset door), 19:48.
The camera stands where you would stand to talk to him, east of him with the low sun behind him;
PEOPLE.attn = {id:'quim', p:[eye x, eye z]} and PEOPLE.attend(.05) x40 turn him to the eye, exactly as game.js does while talking."""
import json, sys, math
sys.path.insert(0, '.')
from ushot import spec
def ang(deg, dist, h=1.62):
    a = math.radians(deg); return [round(math.cos(a) * dist, 3), h, round(math.sin(a) * dist, 3)]
def look(phi, dist, yaw_off_deg, h):
    e = ang(phi, dist); dx, dz = -e[0], -e[2]; a = math.atan2(dz, dx) + math.radians(yaw_off_deg)
    L = math.hypot(dx, dz); return [round(e[0] + math.cos(a) * L, 3), h, round(e[2] + math.sin(a) * L, 3)]
H = 19.8
MAIN = dict(phi=-24, d=3.0, lens=45, yaw=4, h=1.67)
THUMB = dict(phi=-24, d=2.4, lens=60, yaw=4.5, h=1.70)
def mk(name, w, h, c, attn=True, png=True):
    return spec(name, w, h, 'quim', H, ang(c['phi'], c['d']), look(c['phi'], c['d'], c['yaw'], c['h']), c['lens'], attn=attn, png=png)
if __name__ == '__main__':
    which = sys.argv[2] if len(sys.argv) > 2 else 'all'
    S = []
    if which in ('all', 'main'): S.append(mk('3_main', 1600, 800, MAIN))
    if which in ('all', 'thumb'): S.append(mk('3_thumb_616', 616, 308, THUMB))
    if which in ('all', 'check'): S.append(mk('3_check_noturn', 800, 400, MAIN, attn=False, png=False)); S.append(mk('3_check_turn', 800, 400, MAIN, png=False))
    json.dump(S, open(sys.argv[1], 'w'), indent=1)
