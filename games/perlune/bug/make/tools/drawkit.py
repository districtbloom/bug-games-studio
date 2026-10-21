"""Perlune's material maths, ported from the game's shaders (engine.js GLSL_ENV, SCULPT_FS), for drawing small marks
at their own size. Everything is computed in linear light, tone-mapped with the game's ACES curve, then gamma-encoded.
Draw at SS x the target size and downsample with Lanczos for clean edges."""
import numpy as np
from PIL import Image, ImageFilter


def lin(h, m=1.0):
    h = h.lstrip('#'); c = np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)], np.float32)
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4) * m


def aces(x):
    return np.clip((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0, 1)


def encode(x, sat=1.12, exp=0.95):
    x = aces(x * exp)
    l = (x * np.array([0.299, 0.587, 0.114], np.float32)).sum(-1, keepdims=True)
    x = np.clip(l + (x - l) * sat, 0, 1)
    return (x ** (1 / 2.2) * 255).clip(0, 255).astype(np.uint8)


def norm(v):
    return v / np.maximum(np.linalg.norm(v, axis=-1, keepdims=True), 1e-6)


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)


# the default studio the game's chrome reflects (R.env in engine.js), and Nacre's
ENV_SPACE = dict(e0=lin('#0a0614'), e1=lin('#3b1a6b'), e2=lin('#2ff3ff'), e3=lin('#ffd9f2'), pcol=lin('#6b4a7e'))
ENV_NACRE = dict(e0=lin('#0b0716'), e1=lin('#5b3a8a'), e2=lin('#ff9ad5'), e3=lin('#fff2fb'), pcol=lin('#6b4a7e'))


def env(d, up, E, t=0.0):
    y = (d * up).sum(-1)
    side = norm(np.cross(up, np.array([0.31, 0.83, 0.46], np.float32)))
    az = np.arctan2((d * side).sum(-1), (d * np.cross(up, side)).sum(-1))
    sw = np.sin(az * 3 + t * 0.15 + y * 4)
    c = np.broadcast_to(E['e0'], d.shape).copy()
    c += E['e1'] * (smoothstep(0.15, 1, y) * 0.8)[..., None]
    c += E['e2'] * (np.maximum(0, np.sin(y * 7 + sw * 1.3)) ** 14 * 2.2 * smoothstep(-0.05, 0.1, y))[..., None]
    c += E['e3'] * (smoothstep(0.965, 0.998, np.sin(y * 4 + 1.1 + sw * 0.25)) * 3.2)[..., None]
    c += E['e3'] * (smoothstep(0.988, 1.0, np.sin(az * 2 + 0.7)) * smoothstep(0.1, 0.6, y) * 3.0)[..., None]
    g = E['pcol'] * (0.3 + 0.25 * np.sin(az * 7 + y * 24))[..., None]
    c = c + (g - c) * smoothstep(0.02, -0.2, y)[..., None]
    c += E['e3'] * (np.exp(-np.abs(y + 0.01) * 50) * 1.3)[..., None]
    return c


def film(c):
    return 0.5 + 0.5 * np.cos(6.2832 * (c[..., None] + np.array([0.0, 0.33, 0.67], np.float32)))


def sphere(W, H, cx, cy, r, tint='#eef2fb', E=ENV_SPACE, mat='liquid', light=(-0.35, 0.75, 0.55), sx=1.0, sy=1.0, emit=0.0, seed=0.3, up=(0, 1, 0)):
    """A shaded ellipsoid the way SCULPT_FS draws the creature (orthographic view). Returns linear RGB, alpha."""
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    nx = (xx + 0.5 - cx) / (r * sx); ny = -(yy + 0.5 - cy) / (r * sy)
    rr = nx * nx + ny * ny
    a = (rr <= 1).astype(np.float32)
    nz = np.sqrt(np.clip(1 - rr, 0, 1))
    N = norm(np.stack([nx / sx, ny / sy, nz], -1))
    V = np.array([0, 0, 1], np.float32)
    L = norm(np.array(light, np.float32)); up = norm(np.array(up, np.float32))
    nv = np.clip(N[..., 2], 0, 1); fr = (1 - nv) ** 4
    R = -V + 2 * nv[..., None] * N
    dif = np.clip((N * L).sum(-1), 0, None); spec = np.clip((R * L).sum(-1), 0, None) ** 48
    T = lin(tint); e = env(R, up, E); f = film(nv * 1.2 + seed)
    if mat == 'chrome':
        col = e * T * (0.55 + 0.7 * fr)[..., None] + film(nv * 1.1 + seed) * ((1 - nv) ** 3 * 0.35)[..., None] * T + spec[..., None] * 2.5 * T + T * emit
    elif mat == 'pearl':
        col = T * (0.10 + 0.55 * dif)[..., None] * (1 + (f - 1) * 0.45) + e * (0.10 + 0.6 * fr)[..., None] + f * (0.5 * (1 - nv) ** 2)[..., None] + spec[..., None] * 1.4 + T * emit
    elif mat == 'glass':
        col = e * (0.12 + 0.95 * fr)[..., None] + T * (0.18 + emit) + film(nv * 1.6 + seed) * ((1 - nv) ** 2 * 0.7)[..., None] + spec[..., None] * 4.0
        a = a * np.clip(0.2 + 0.75 * fr + emit * 0.25, 0, 1)
    else:  # liquid: the droplet
        col = e * T * (0.5 + 0.6 * fr)[..., None] + T * (0.1 + 0.32 * dif)[..., None] + f * (0.5 * (1 - nv) ** 2)[..., None] + spec[..., None] * 3.0 + T * emit
    return col.astype(np.float32), a


def over(dst, src, a):
    """Composite linear src over dst with coverage a (H,W)."""
    return dst * (1 - a[..., None]) + src * a[..., None]


def add(dst, src, a=1.0):
    return dst + src * (a[..., None] if isinstance(a, np.ndarray) else a)


def blur(arr, radius):
    """Gaussian blur of a linear float image, per channel (radius = sigma in pixels)."""
    from scipy.ndimage import gaussian_filter
    return gaussian_filter(arr, sigma=(radius, radius, 0) if arr.ndim == 3 else radius, mode='nearest')


def bloom(lin_img, thr=1.0, radius=10, amount=0.6):
    l = lin_img.max(-1, keepdims=True)
    hot = lin_img * np.clip((l - thr) / np.maximum(l, 1e-4), 0, None)
    return lin_img + blur(hot, radius) * amount + blur(hot, radius * 3) * amount * 0.5


def ellipse_mask(W, H, cx, cy, rx, ry, rot=0.0):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    dx, dy = xx + 0.5 - cx, yy + 0.5 - cy
    c, s = np.cos(rot), np.sin(rot)
    u, v = dx * c + dy * s, -dx * s + dy * c
    return ((u / rx) ** 2 + (v / ry) ** 2 <= 1).astype(np.float32)


def ring_mask(W, H, cx, cy, rx, ry, width, rot=0.0):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    dx, dy = xx + 0.5 - cx, yy + 0.5 - cy
    c, s = np.cos(rot), np.sin(rot)
    u, v = dx * c + dy * s, -dx * s + dy * c
    d = np.sqrt((u / rx) ** 2 + (v / ry) ** 2)
    return (np.abs(d - 1) * min(rx, ry) <= width / 2).astype(np.float32)


def radial(W, H, cx, cy, r, inner, outer, power=1.0):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    k = np.clip(np.sqrt((xx + 0.5 - cx) ** 2 + (yy + 0.5 - cy) ** 2) / r, 0, 1) ** power
    return lin(inner)[None, None] * (1 - k[..., None]) + lin(outer)[None, None] * k[..., None]


def finish(lin_img, size, alpha=None):
    """Tone-map and downsample a supersampled linear image to its real size."""
    rgb = Image.fromarray(encode(lin_img))
    if alpha is not None:
        rgba = rgb.convert('RGBA'); rgba.putalpha(Image.fromarray((np.clip(alpha, 0, 1) * 255).astype(np.uint8)))
        return rgba.resize(size, Image.LANCZOS)
    return rgb.resize(size, Image.LANCZOS)
