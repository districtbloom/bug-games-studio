"""spec builder for the festival banner. Fireworks: the game launches each burst at az in [0.1pi, 0.9pi]
(over the southern sea), el in [.18, .48] (game.js festival()). Here each burst is placed in screen space
(NDC sx, sy) and converted to the game's (az, el); every burst is checked to lie inside the game's range.
The studio's fireworks() is replaced in the page by a function returning these bursts."""
import json, math
def cam(eye, look, lens, W, H):
    d = [look[i] - eye[i] for i in range(3)]
    yaw = math.atan2(d[0], -d[2]); pitch = math.atan2(d[1], math.hypot(d[0], d[2]))
    fwd = [math.cos(pitch) * math.sin(yaw), math.sin(pitch), -math.cos(pitch) * math.cos(yaw)]
    r = [-fwd[2], 0.0, fwd[0]]; n = math.hypot(r[0], r[2]); r = [r[0] / n, 0, r[2] / n]   # fwd x (0,1,0)
    up = [r[1] * fwd[2] - r[2] * fwd[1], r[2] * fwd[0] - r[0] * fwd[2], r[0] * fwd[1] - r[1] * fwd[0]]
    t = math.tan(math.atan(12 / lens)); asp = W / H
    return fwd, r, up, t, asp
def ndc_to_fw(eye, look, lens, W, H, sx, sy):
    fwd, r, up, t, asp = cam(eye, look, lens, W, H)
    d = [fwd[i] + r[i] * sx * t * asp + up[i] * sy * t for i in range(3)]
    az = math.atan2(d[2], d[0]); el = d[1] / math.hypot(d[0], d[2])
    return az, el
def world_to_ndc(eye, look, lens, W, H, p):
    fwd, r, up, t, asp = cam(eye, look, lens, W, H)
    v = [p[i] - eye[i] for i in range(3)]; z = sum(v[i] * fwd[i] for i in range(3))
    return (sum(v[i] * r[i] for i in range(3)) / z / (t * asp), sum(v[i] * up[i] for i in range(3)) / z / t, z)
def spec(name, W, H, hour, eye, look, lens, bursts, lt=3.0, png=False, check=True, extra=''):
    fws = []
    for (sx, sy, seed, age) in bursts:
        az, el = ndc_to_fw(eye, look, lens, W, H, sx, sy)
        ok = 0.1 * math.pi - 1e-6 <= az <= 0.9 * math.pi + 1e-6 and 0.18 <= el <= 0.48
        if check and not ok: raise SystemExit(f'{name}: burst at ({sx},{sy}) -> az {az / math.pi:.3f}pi el {el:.3f} is outside the game range')
        fws.append([round(az, 5), round(el, 5), seed, age])
    js = (f"window.fireworks=function(){{return {json.dumps(fws)};}};\n" + extra +
          f"return {json.dumps(dict(hour=hour, eye=[eye, eye], look=[look, look], lens=lens, festival=True))};")
    return dict(name=name, w=W, h=H, lt=lt, png=png, shotJs=js), fws
