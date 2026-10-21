# numpy port of Perlune's LIQUID body shading (engine.js SCULPT_FS m==6 + GLSL_ENV + COMP_FS tonemap)
# used only to calibrate the canvas module against the poster (time phase, look); writes comparison crops.
import json, math, sys
import numpy as np
from PIL import Image

J = json.load(open('/home/claude/passB/work/living/calib/cam.json'))
v = lambda d: np.array([d['x'], d['y'], d['z']], float)
POS, F, RT, UP2, C, L, X, Y, Z = [v(J[k]) for k in ['pos', 'f', 'right', 'up2', 'C', 'L', 'X', 'Y', 'Z']]
NACRE = np.array([430., 0., 120.])
W, H, FOV = 1600, 800, 0.62

def lin(h):
    c = np.array([(h >> 16) & 255, (h >> 8) & 255, h & 255], float) / 255
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)

SPACE = [0x05030c, 0x2a1650, 0x3ff2ff, 0xffe8f6]
NAC = [0x0b0716, 0x5b3a8a, 0xff9ad5, 0xfff2fb]
E = [(0.25 * lin(a) + 3 * lin(b)) / 3.25 for a, b in zip(SPACE, NAC)]
PCOL = lin(0x2e1d42) * 6 / 3.25 + 0.02
TINT = np.array([0.92, 0.93, 0.98])

def sstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

def env(d, up, time):
    y = np.sum(d * up, -1)
    side = np.cross(up, np.array([0.31, 0.83, 0.46])); side /= np.linalg.norm(side, axis=-1, keepdims=True)
    cs = np.cross(up, side)
    az = np.arctan2(np.sum(d * side, -1), np.sum(d * cs, -1))
    sw = np.sin(az * 3 + time * 0.15 + y * 4)
    c = np.broadcast_to(E[0], d.shape).copy()
    c += E[1] * (sstep(0.15, 1, y) * 0.8)[..., None]
    c += E[2] * ((np.maximum(0, np.sin(y * 7 + sw * 1.3)) ** 14) * 2.2 * sstep(-0.05, 0.1, y))[..., None]
    c += E[3] * (sstep(0.965, 0.998, np.sin(y * 4 + 1.1 + sw * 0.25)) * 3.2)[..., None]
    c += E[3] * (sstep(0.988, 1, np.sin(az * 2 + 0.7)) * sstep(0.1, 0.6, y) * 3.0)[..., None]
    g = PCOL * (0.3 + 0.25 * np.sin(az * 7 + y * 24))[..., None]
    k = sstep(0.02, -0.2, y)[..., None]
    c = c * (1 - k) + g * k
    c += E[3] * (np.exp(-np.abs(y + 0.01) * 50) * 1.3)[..., None]
    return c

def film(c):
    return 0.5 + 0.5 * np.cos(6.2832 * (c[..., None] + np.array([0, 0.33, 0.67])))

def aces(x):
    return np.clip((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0, 1)

def render(time, box=(700, 170, 1270, 740), step=1, wob=0.07, bounce=None, nolines=False):
    x0, y0, x1, y1 = box
    xs = np.arange(x0, x1, step) + 0.5; ys = np.arange(y0, y1, step) + 0.5
    px, py = np.meshgrid(xs, ys)
    th = math.tan(FOV / 2)
    nx = (px / W * 2 - 1) * th * (W / H); ny = (1 - py / H * 2) * th
    d = F[None, None] + RT * nx[..., None] + UP2 * ny[..., None]
    d /= np.linalg.norm(d, axis=-1, keepdims=True)
    b = math.sin(time * 9) * 0.03 if bounce is None else bounce
    sc = np.array([1 + b, 1 - b, 1.0])  # radii along X, Y, Z (body frame)
    B = np.stack([X, Y, Z])  # rows
    o = (POS - C) @ B.T; dl = d @ B.T  # body-frame ray
    # wobble displacement: iterate radius
    a3 = np.array([[3.1, 1.7, 2.3], [-1.9, 2.9, 1.3], [1.3, -2.1, 3.7]])
    t = time + 7.0
    rad = np.ones(px.shape)
    hit = None
    for it in range(3):
        S = sc[None, None] * rad[..., None]
        oo = o / S; dd = dl / S
        A = np.sum(dd * dd, -1); Bq = 2 * np.sum(oo * dd, -1); Cq = np.sum(oo * oo, -1) - 1
        disc = Bq * Bq - 4 * A * Cq
        tt = (-Bq - np.sqrt(np.maximum(disc, 0))) / (2 * A)
        hitp = oo + dd * tt[..., None]  # unit-sphere point (model space)
        s1 = hitp @ a3[0] + t * 4.1; s2 = hitp @ a3[1] + t * 3.3; s3 = hitp @ a3[2] - t * 5.2
        dsp = (np.sin(s1) + np.sin(s2) + np.sin(s3)) * wob / 3
        rad = 1 + dsp
        hit = (disc > 0)
    n = hitp.copy()
    g = (a3[0] * np.cos(s1)[..., None] + a3[1] * np.cos(s2)[..., None] + a3[2] * np.cos(s3)[..., None]) * wob / 3
    n = n - (g - n * np.sum(g * n, -1, keepdims=True)); n /= np.linalg.norm(n, axis=-1, keepdims=True)
    # to world: normal transforms with inverse scale
    nw = (n / sc) @ B; nw /= np.linalg.norm(nw, axis=-1, keepdims=True)
    pw = (hitp * sc * rad[..., None]) @ B + C
    V = POS - pw; V /= np.linalg.norm(V, axis=-1, keepdims=True)
    nv = np.clip(np.sum(nw * V, -1), 0, 1); fr = (1 - nv) ** 4
    R = 2 * np.sum(nw * V, -1, keepdims=True) * nw - V
    up = pw - NACRE; up /= np.linalg.norm(up, axis=-1, keepdims=True)
    e = env(R, up, time)
    dif = np.maximum(np.sum(nw * L, -1), 0); spec = np.maximum(np.sum(R * L, -1), 0) ** 48
    col = e * TINT * (0.5 + 0.6 * fr)[..., None] + TINT * (0.1 + 0.32 * dif)[..., None] + film(nv * 1.2 + 1) * ((1 - nv) ** 2 * 0.5)[..., None] + (spec * 3)[..., None]
    c = aces(col * 0.95)
    l = np.sum(c * np.array([0.299, 0.587, 0.114]), -1, keepdims=True); c = l + (c - l) * 1.12
    c = np.clip(c, 0, 1) ** (1 / 2.2)
    return c, hit

if __name__ == '__main__':
    poster = np.asarray(Image.open('/home/claude/passB/bug/poster.png').convert('RGB')).astype(float) / 255
    box = (700, 170, 1270, 740)
    ref = poster[box[1]:box[3]:4, box[0]:box[2]:4]
    best = []
    for T in np.arange(0, 42, 0.25):
        c, hit = render(T, box, 4)
        m = hit & (np.linalg.norm(ref - 0, axis=-1) >= 0)
        err = np.mean(((c - ref) ** 2)[hit])
        best.append((err, T))
    best.sort(); print(best[:8])
    T = best[0][1]
    c, hit = render(T, box, 1)
    out = np.where(hit[..., None], c, 0)
    img = np.concatenate([out, poster[box[1]:box[3], box[0]:box[2]]], 1)
    Image.fromarray((img * 255).astype(np.uint8)).save('/home/claude/passB/work/living/calib/port-vs-poster.png')
