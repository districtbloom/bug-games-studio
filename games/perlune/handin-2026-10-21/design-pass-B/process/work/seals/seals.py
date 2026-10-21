#!/usr/bin/env python3
"""Perlune achievement seals: 10 seals x 3 states, 192x192 RGBA masters.

Drawn in code with the game's own material maths: the shading terms are the ones in engine.js SCULPT_FS
(m0 chrome, m1 pearl, m2 glass, m3 glow, m4 obsidian, m6 liquid), the studio env + thin-film from GLSL_ENV (via
/home/claude/pkgtools/drawkit.py), the game's ACES tone map, and the planet shader's "world not yet awake" grade
(engine.js PLANET_FS: col = mix(lum*(0.9,0.88,1.08), col, mix(0.2,1,viv)) * mix(0.74,1,viv), plus the wake ring).
Shapes are signed-distance fields drawn at SS x the size and reduced with premultiplied Lanczos.

usage: python3 seals.py [--ss 8] [--only bead,halo] [--out DIR] [--states earned,progress,locked]
"""
import sys, os, math, argparse
import numpy as np
from PIL import Image
from scipy import ndimage
from scipy.interpolate import PchipInterpolator
sys.path.insert(0, '/home/claude/pkgtools')
import drawkit as dk
from drawkit import lin, smoothstep, ENV_SPACE, ENV_NACRE


def film(c):
    """the game's thin-film palette (GLSL film(): 0.5+0.5cos(2pi(c+[0,.33,.67]))), swept only along its pink-violet-cyan
    arc, the poster droplet's sheen. Its green-yellow arc is left out so no seal pixel sits near mint #7FE3C0 or sun #FFCB57."""
    t = c - np.floor(c)
    tri = 1 - np.abs(2 * t - 1)
    return dk.film(0.06 + 0.22 * (1 - np.cos(np.pi * tri)))

F32 = np.float32
OUT = 192
UP = np.array([0, 1, 0], F32)


def n3(*v):
    v = np.array(v, F32); return v / np.linalg.norm(v)


LIGHT = n3(-0.5, 0.62, 0.6)          # key from the upper left (the poster's side)
ACC = {'cyan': '#5FF3FF', 'magenta': '#FF5C9A'}   # glass cyan, dust magenta (the style note's two hot inks)
ENVS = {'cyan': ENV_SPACE, 'magenta': ENV_NACRE}   # the default studio reflects cyan bands; Nacre's reflects pink

# locked state: flat, calm greys (the planet shader's grey is lum*(0.9,0.88,1.08): a cool grey)
L_NIGHT = '#0B0A11'
L_RING = '#4C4A58'
L_SYM = '#67657A'
L_DET = '#0B0A11'


def hex01(h):
    h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)], F32)


def aces(x):
    return np.clip((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0, 1)


def encode_f(x, sat=1.12, exp=0.95):
    """the game's grade (drawkit.encode) as floats 0..1"""
    x = aces(np.maximum(x, 0) * exp)
    l = (x * np.array([0.299, 0.587, 0.114], F32)).sum(-1, keepdims=True)
    x = np.clip(l + (x - l) * sat, 0, 1)
    return x ** (1 / 2.2)


_XS = np.linspace(0, 6, 120001).astype(F32)
_YS = aces(_XS * 0.95)


def inv_hex(h):
    """linear HDR value that the grade turns back into this sRGB colour (so night really is #05040A)"""
    t = hex01(h) ** 2.2
    return np.interp(t, _YS, _XS).astype(F32)


# ------------------------------------------------------------------ shading (SCULPT_FS terms)
def shade(N, mat, tint, E, emit=0.0, seed=0.3, rim=0.0, rimseed=0.0):
    T = lin(tint) if isinstance(tint, str) else np.asarray(tint, F32)
    nx, ny, nz = N[..., 0], N[..., 1], N[..., 2]
    nv = np.clip(nz, 0, 1); fr = (1 - nv) ** 4
    R = np.stack([2 * nv * nx, 2 * nv * ny, 2 * nv * nz - 1], -1)
    dif = np.clip(N @ LIGHT, 0, None); spec = np.clip(R @ LIGHT, 0, None) ** 48
    a = np.ones(nv.shape, F32)
    if mat == 'glow':
        col = np.broadcast_to(T * emit, N.shape).astype(F32).copy()
    else:
        e = dk.env(R, UP, E)
        if mat == 'chrome':
            col = e * T * (0.55 + 0.7 * fr)[..., None] + film(nv * 1.1 + seed) * ((1 - nv) ** 3 * 0.35)[..., None] * T + spec[..., None] * 2.5 * T + T * emit
        elif mat == 'pearl':
            f = film(nv * 1.3 + seed)
            col = T * (0.10 + 0.55 * dif)[..., None] * (1 + (f - 1) * 0.45) + e * (0.10 + 0.6 * fr)[..., None] + f * (0.5 * (1 - nv) ** 2)[..., None] + spec[..., None] * 1.4 + T * emit
        elif mat == 'glass':
            f = film(nv * 1.6 + seed)
            col = e * (0.12 + 0.95 * fr)[..., None] + T * (0.18 + emit) + f * ((1 - nv) ** 2 * 0.7)[..., None] + spec[..., None] * 4.0
            a = np.clip(0.2 + 0.75 * fr + emit * 0.25, 0, 1).astype(F32)
        elif mat == 'obsid':
            col = e * (0.06 * (0.4 + fr))[..., None] + T * ((1 - nv) ** 2.2 * (2.2 + emit))[..., None] + spec[..., None] * 1.0
        elif mat == 'liquid':
            f = film(nv * 1.2 + seed)
            col = e * T * (0.5 + 0.6 * fr)[..., None] + T * (0.1 + 0.32 * dif)[..., None] + f * (0.5 * (1 - nv) ** 2)[..., None] + spec[..., None] * 3.0 + T * emit
        else:  # matte
            col = T * (0.12 + 0.88 * dif)[..., None] + e * (0.06 * fr)[..., None] + T * emit
    if rim:
        h = np.sqrt(nx * nx + ny * ny) + 1e-4
        ul = (-0.7071 * nx + 0.7071 * ny) / h
        col = col + film(nv * 1.3 + seed + rimseed) * (rim * (1 - nv) ** 2.5 * smoothstep(-0.2, 0.9, ul))[..., None]
    return col.astype(F32), a


def nstack(x, y, z):
    N = np.stack([x, y, z], -1).astype(F32)
    return N / np.maximum(np.linalg.norm(N, axis=-1, keepdims=True), 1e-6)


# ------------------------------------------------------------------ shapes (signed distance + normals)
def sph(X, Y, cx, cy, r, sx=1.0, sy=1.0):
    nx = (X - cx) / (r * sx); ny = (Y - cy) / (r * sy); rr = nx * nx + ny * ny
    d = (np.sqrt(rr) - 1) * r * min(sx, sy)
    nz = np.sqrt(np.clip(1 - rr, 0, 1))
    return d, nstack(nx / sx, ny / sy, nz)


def tube_circle(X, Y, cx, cy, R0, hw):
    dx, dy = X - cx, Y - cy; rho = np.sqrt(dx * dx + dy * dy) + 1e-6
    s = rho - R0; u = np.clip(s / hw, -1, 1)
    return np.abs(s) - hw, nstack(dx / rho * u, dy / rho * u, np.sqrt(1 - u * u))


def tube_ellipse(X, Y, cx, cy, rx, ry, hw, rot=0.0):
    c, s = math.cos(rot), math.sin(rot); dx, dy = X - cx, Y - cy
    qx = dx * c + dy * s; qy = -dx * s + dy * c
    k = np.sqrt((qx / rx) ** 2 + (qy / ry) ** 2) + 1e-6
    gx = qx / (rx * rx * k); gy = qy / (ry * ry * k); gl = np.sqrt(gx * gx + gy * gy) + 1e-6
    sd = (k - 1) / gl; u = np.clip(sd / hw, -1, 1)
    ex = (gx * c - gy * s) / gl; ey = (gx * s + gy * c) / gl
    t = np.arctan2(qy / ry, qx / rx)  # angle round the ellipse (front half: t < 0)
    return np.abs(sd) - hw, nstack(ex * u, ey * u, np.sqrt(1 - u * u)), t


def ellipse_sd(X, Y, cx, cy, rx, ry, rot=0.0):
    c, s = math.cos(rot), math.sin(rot); dx, dy = X - cx, Y - cy
    qx = dx * c + dy * s; qy = -dx * s + dy * c
    k = np.sqrt((qx / rx) ** 2 + (qy / ry) ** 2) + 1e-6
    gl = np.sqrt((qx / (rx * rx * k)) ** 2 + (qy / (ry * ry * k)) ** 2) + 1e-6
    return (k - 1) / gl


def capsule(X, Y, ax, ay, bx, by, hw):
    px, py = X - ax, Y - ay; ex, ey = bx - ax, by - ay; L2 = ex * ex + ey * ey
    t = np.clip((px * ex + py * ey) / L2, 0, 1); qx, qy = px - ex * t, py - ey * t
    dist = np.sqrt(qx * qx + qy * qy) + 1e-6; u = np.clip(dist / hw, 0, 1)
    return dist - hw, nstack(qx / dist * u, qy / dist * u, np.sqrt(1 - u * u)), t


def poly_sd(X, Y, pts):
    pts = np.asarray(pts, F32); n = len(pts)
    d = (X - pts[0, 0]) ** 2 + (Y - pts[0, 1]) ** 2; s = np.ones_like(X)
    j = n - 1
    for i in range(n):
        ex, ey = pts[j, 0] - pts[i, 0], pts[j, 1] - pts[i, 1]
        wx, wy = X - pts[i, 0], Y - pts[i, 1]
        t = np.clip((wx * ex + wy * ey) / max(ex * ex + ey * ey, 1e-12), 0, 1)
        bx, by = wx - ex * t, wy - ey * t
        d = np.minimum(d, bx * bx + by * by)
        c1 = Y >= pts[i, 1]; c2 = Y < pts[j, 1]; c3 = ex * wy > ey * wx
        flip = (c1 & c2 & c3) | (~c1 & ~c2 & ~c3)
        s = np.where(flip, -s, s)
        j = i
    return s * np.sqrt(d)


def rot2(pts, ang, cx=0.0, cy=0.0):
    c, s = math.cos(ang), math.sin(ang)
    return [(cx + x * c - y * s, cy + x * s + y * c) for x, y in pts]


# ------------------------------------------------------------------ canvas
class Canvas:
    def __init__(self, ss, acc):
        self.ss = ss; self.N = OUT * ss; self.pix = 2.0 / self.N
        self.acc = acc; self.E = ENVS[acc]; self.A = ACC[acc]
        n = self.N
        self.col = np.zeros((n, n, 3), F32)     # linear HDR, premultiplied by coverage
        self.a = np.zeros((n, n), F32)
        self.flat = np.zeros((n, n, 3), F32)    # locked state, sRGB 0..1, premultiplied
        self.fa = np.zeros((n, n), F32)
        self.emit = np.zeros((n, n, 3), F32)    # light from emissive parts only (what blooms)

    def win(self, x0, x1, y0, y1):
        n = self.N
        c0 = max(0, int(math.floor((x0 + 1) / 2 * n)) - 3); c1 = min(n, int(math.ceil((x1 + 1) / 2 * n)) + 3)
        r0 = max(0, int(math.floor((1 - y1) / 2 * n)) - 3); r1 = min(n, int(math.ceil((1 - y0) / 2 * n)) + 3)
        xs = ((np.arange(c0, c1) + 0.5) / n * 2 - 1).astype(F32)
        ys = (1 - (np.arange(r0, r1) + 0.5) / n * 2).astype(F32)
        X, Y = np.meshgrid(xs, ys)
        return (slice(r0, r1), slice(c0, c1)), X, Y

    def cov(self, d):
        return np.clip(0.5 - d / self.pix, 0, 1).astype(F32)

    def paint(self, sl, cov, rgb, amul=None, flat=None, flatcov=None, emissive=False):
        c = cov if amul is None else cov * amul
        if rgb is not None:
            self.col[sl] = self.col[sl] * (1 - c[..., None]) + rgb * c[..., None]
            self.emit[sl] = self.emit[sl] * (1 - c[..., None]) + (rgb * c[..., None] if emissive else 0)
            self.a[sl] = self.a[sl] + c * (1 - self.a[sl])
        if flat is not None:
            fc = cov if flatcov is None else flatcov
            self.flat[sl] = self.flat[sl] * (1 - fc[..., None]) + hex01(flat) * fc[..., None]
            self.fa[sl] = self.fa[sl] + fc * (1 - self.fa[sl])

    def light(self, sl, rgb, mask=None):
        """additive light (a glow) inside the art"""
        if mask is not None: rgb = rgb * mask[..., None]
        self.col[sl] += rgb; self.emit[sl] += rgb


# ------------------------------------------------------------------ the three outlines (by kind)
def smooth_noise(shape, cells, rng):
    g = rng.random((cells + 3, cells + 3)).astype(F32)
    z = ndimage.zoom(g, (shape[0] / cells, shape[1] / cells), order=3)
    o = int(shape[0] / cells)
    return z[o:o + shape[0], o:o + shape[1]]


def sky_lines(cv, X, Y, seed):
    """the sky's neon contour lines (engine.js NEB_FS: contours of a domain-warped noise field, n2*13), kept faint and
    in the night's own violet so they never add a second accent"""
    rng = np.random.default_rng(seed)
    n1 = smooth_noise(X.shape, 4, rng) * 0.65 + smooth_noise(X.shape, 9, rng) * 0.35
    w = smooth_noise(X.shape, 5, rng)
    n2 = (n1 * 0.7 + w * 0.3)
    cl = n2 * 13.0
    gy, gx = np.gradient(cl)
    fw = np.sqrt(gx * gx + gy * gy) + 1e-6
    di = np.minimum(cl - np.floor(cl), np.ceil(cl) - cl)
    px = cv.ss * 0.9   # about one 192-px pixel wide
    line = 1 - smoothstep(fw * px * 0.4, fw * px * 1.6, di)
    return (line * smoothstep(0.35, 0.6, n2)).astype(F32)


def night_fill(cv, sl, X, Y, cov):
    """the inside of every seal: night #05040A lifting to #2A0B4D toward the upper left"""
    base = inv_hex('#05040A'); lift = inv_hex('#2A0B4D')
    k = smoothstep(1.25, 0.0, np.sqrt((X + 0.45) ** 2 + (Y - 0.5) ** 2)) ** 1.6 * 0.55
    rgb = base + (lift - base) * k[..., None]
    rgb = rgb + lin('#5B3A8A') * (sky_lines(cv, X, Y, cv.seed) * 0.10)[..., None]
    cv.paint(sl, cov, rgb.astype(F32), flat=L_NIGHT)


def pearl_band(cv, X, Y, N, seed0=0.15, gain=1.55, rim=1.3):
    """the poster's pearl: the SCULPT_FS pearl terms, the thin-film phase sweeping round the ring like nacre"""
    ang = np.arctan2(Y, X)
    seed = seed0 + 0.22 * np.sin(2 * ang + 0.6) + 0.12 * np.sin(5 * ang)
    col, _ = shade(N, 'pearl', '#F4F8FF', cv.E, seed=seed, rim=rim)
    nv = np.clip(N[..., 2], 0, 1)
    col = col + film(nv * 1.3 + seed + 0.3) * (0.22 * (1 - nv) ** 1.5)[..., None]
    return col * gain


def outline_feat(cv, stage):
    """round pearl ring"""
    R0, hw = 0.84, 0.082
    sl, X, Y = cv.win(-1, 1, -1, 1)
    if stage == 'back':
        night_fill(cv, sl, X, Y, cv.cov(np.sqrt(X * X + Y * Y) - 0.77)); return
    d, N = tube_circle(X, Y, 0, 0, R0, hw)
    cv.paint(sl, cv.cov(d), pearl_band(cv, X, Y, N), flat=L_RING)


HEX_NS = [(math.cos(math.radians(a)), math.sin(math.radians(a))) for a in (0, 60, 120, 180, 240, 300)]


def hex_frame(X, Y):
    """pointy-top hexagon: per pixel the side it projects most onto (mitred corners) and its apothem coordinate"""
    dots = np.stack([X * nx + Y * ny for nx, ny in HEX_NS], -1)
    k = dots.argmax(-1); t = dots.max(-1)
    return k, t


def outline_collection(cv, stage):
    """six-sided glass facet ring: 6 sides x 3 cut facets (outer bevel, crown, inner bevel)"""
    A_OUT, W = 0.85, 0.175
    sl, X, Y = cv.win(-1, 1, -1, 1)
    k, t = hex_frame(X, Y)
    if stage == 'back':
        night_fill(cv, sl, X, Y, cv.cov(t - (A_OUT - W + 0.012))); return
    d = np.abs(t - (A_OUT - W / 2)) - W / 2
    s = (A_OUT - t) / W   # 0 at the outer edge .. 1 at the inner edge
    nxk = np.choose(k, [n[0] for n in HEX_NS]); nyk = np.choose(k, [n[1] for n in HEX_NS])
    outer = s < 0.36; inner = s > 0.70
    tilt = np.where(outer, 1.5, np.where(inner, -1.25, 0.18)).astype(F32)
    # each side's facets lean a little differently, like a hand-cut stone
    twist = np.choose(k, [0.10, -0.12, 0.06, -0.08, 0.12, -0.05]).astype(F32)
    N = nstack(nxk * tilt - nyk * twist, nyk * tilt + nxk * twist, np.ones_like(X))
    ang = np.arctan2(Y, X)
    col, a = shade(N, 'glass', '#E6FBFF', cv.E, emit=0.14, seed=0.55 + 0.2 * np.sin(2 * ang), rim=1.4)
    col = col * 1.45
    # the facet edges catch a hairline of light (the game's "lines exist only as light")
    edge = np.minimum(np.abs(s - 0.36), np.abs(s - 0.70)) * W
    col = col + lin('#F4F8FF') * (np.exp(-(edge / 0.007) ** 2) * 0.55)[..., None]
    cv.paint(sl, cv.cov(d), col, amul=np.clip(a + 0.62, 0, 1), flat=L_RING)


def outline_event(cv, stage):
    """12-ray corona (the Eclipse's twelve rays): a pearl ring and 12 faceted rays"""
    R0, hw = 0.655, 0.055
    sl, X, Y = cv.win(-1, 1, -1, 1)
    if stage == 'back':
        night_fill(cv, sl, X, Y, cv.cov(np.sqrt(X * X + Y * Y) - 0.62)); return
    rho = np.sqrt(X * X + Y * Y) + 1e-6; ang = np.arctan2(Y, X)
    r_in, r_mid, r_tip, w = 0.62, 0.74, 0.99, 0.095
    best = None
    for i in range(12):
        phi = math.pi / 2 + i * math.pi / 6
        er = (math.cos(phi), math.sin(phi)); et = (-math.sin(phi), math.cos(phi))
        pts = [(r_in * er[0], r_in * er[1]), (r_mid * er[0] + w * et[0], r_mid * er[1] + w * et[1]),
               (r_tip * er[0], r_tip * er[1]), (r_mid * er[0] - w * et[0], r_mid * er[1] - w * et[1])]
        dd = poly_sd(X, Y, pts)
        best = dd if best is None else np.minimum(best, dd)
    # facets: which ray (nearest angle), which side of its axis, inner or outer half
    k = np.round((ang - math.pi / 2) / (math.pi / 6)) % 12
    phi = math.pi / 2 + k * math.pi / 6
    erx, ery = np.cos(phi), np.sin(phi); etx, ety = -ery, erx
    along = X * erx + Y * ery; across = X * etx + Y * ety
    sa = np.where(across >= 0, 1.0, -1.0).astype(F32); so = np.where(along >= r_mid, 1.0, -1.0).astype(F32)
    nr = 0.45 * so; nt = 0.85 * sa
    N = nstack(nr * erx + nt * etx, nr * ery + nt * ety, np.ones_like(X))
    rc = pearl_band(cv, X, Y, N, seed0=0.25, gain=1.6)
    lum = (rc * np.array([0.3, 0.59, 0.11], F32)).sum(-1, keepdims=True)
    rc = lum + (rc - lum) * 0.35
    cv.paint(sl, cv.cov(best), rc, flat=L_RING)
    d, N = tube_circle(X, Y, 0, 0, R0, hw)
    cv.paint(sl, cv.cov(d), pearl_band(cv, X, Y, N), flat=L_RING)


OUTLINES = {'feat': outline_feat, 'collection': outline_collection, 'event': outline_event}


# ------------------------------------------------------------------ the droplet (game.js drawCreature, front view)
def droplet_crest(cv, cx, cy, r, crest, crestK, crestEmit):
    """the native glass crest (game.js: oct at local (0, 0.95 + (crestK-1)*0.2, -0.15), tilted back 0.5 rad), behind the body"""
    ccy = cy + r * (0.95 + (crestK - 1) * 0.2) * 0.9
    hwc, hhc = r * 0.18 * 1.25, r * 0.42 * crestK * 0.88 * 1.25
    pts = [(cx, ccy + hhc), (cx + hwc, ccy), (cx, ccy - hhc), (cx - hwc, ccy)]
    sl, X, Y = cv.win(cx - hwc, cx + hwc, ccy - hhc, ccy + hhc)
    d = poly_sd(X, Y, pts)
    left = X < cx
    N = nstack(np.where(left, -0.8, 0.8), (Y - ccy) / hhc * 0.5, np.ones_like(X))
    col, a = shade(N, 'glass', crest, cv.E, emit=crestEmit + 0.25, seed=0.4, rim=0.6)
    cv.paint(sl, cv.cov(d), col, amul=np.clip(a + 0.45, 0, 1), flat=L_SYM)


def droplet(cv, cx, cy, r, eyes=True, crest='#9FF6FF', crestK=1.0, crestEmit=0.1, look=(-0.7, 0.9), behind=None):
    if crest:
        droplet_crest(cv, cx, cy, r, crest, crestK, crestEmit)
    if behind: behind()
    sl, X, Y = cv.win(cx - r, cx + r, cy - r, cy + r)
    d, N = sph(X, Y, cx, cy, r)
    col, _ = shade(N, 'liquid', '#EEF2FB', cv.E, emit=0.02, seed=0.07, rim=1.1)
    cv.paint(sl, cv.cov(d), col * 1.3, flat=L_SYM)
    if eyes:
        lx, ly = look[0] * 0.13 * r, look[1] * 0.09 * r
        for sx in (-1, 1):
            ex, ey = cx + sx * 0.29 * r + lx, cy + 0.26 * r + ly
            rx, ry = 0.13 * r * 1.35, 0.19 * r * 1.35
            sl, X, Y = cv.win(ex - rx, ex + rx, ey - ry, ey + ry)
            d = ellipse_sd(X, Y, ex, ey, rx, ry)
            dd, N = sph(X, Y, ex, ey, rx, 1, ry / rx)
            col, _ = shade(N, 'chrome', '#141018', cv.E, seed=0.3)
            cv.paint(sl, cv.cov(d), col * 0.5, flat=L_DET)
            # catchlight
            hx, hy, hr = ex - 0.035 * r - 0.25 * rx, ey + 0.05 * r + 0.2 * ry, 0.045 * r * 1.6
            sl, X, Y = cv.win(hx - hr, hx + hr, hy - hr, hy + hr)
            d = np.sqrt((X - hx) ** 2 + (Y - hy) ** 2) - hr
            cv.paint(sl, cv.cov(d), np.broadcast_to(lin('#FFFFFF') * 3.2, X.shape + (3,)).astype(F32), emissive=True)


# ------------------------------------------------------------------ glyphs
def g_bead(cv):
    """the droplet inside its offset glass mantle (BEAD stage: 'a glass mantle closes around the metal')"""
    mx, my, mr = -0.035, 0.035, 0.53
    droplet(cv, 0.06, -0.13, 0.31, look=(-0.7, 0.9))
    sl, X, Y = cv.win(mx - mr, mx + mr, my - mr, my + mr)
    d, N = sph(X, Y, mx, my, mr)
    col, a = shade(N, 'glass', '#E6FBFF', cv.E, emit=0.03, seed=0.62, rim=1.4, rimseed=0.1)
    # the mantle's own thin-film edge carries the accent: glass cyan
    nv = np.clip(N[..., 2], 0, 1)
    col = col + lin(cv.A) * ((1 - nv) ** 3 * 1.1)[..., None]
    cov = cv.cov(d)
    flatband = cv.cov(np.abs(np.sqrt((X - mx) ** 2 + (Y - my) ** 2) - (mr - 0.045)) - 0.045)
    cv.paint(sl, cov, col, amul=a, flat=L_SYM, flatcov=flatband)


def g_halo(cv):
    """the droplet with a tilted ring of light above its head (CHIMERA: 'it grows a halo and a crest of light')"""
    hx, hy, hrx, hry, hhw, hrot = 0.0, 0.40, 0.29, 0.092, 0.052, math.radians(-7)
    sl, X, Y = cv.win(hx - hrx - hhw, hx + hrx + hhw, hy - hry - hhw - 0.05, hy + hry + hhw + 0.05)

    def halo_part(front):
        d, N, t = tube_ellipse(X, Y, hx, hy, hrx, hry, hhw, hrot)
        m = (t < 0) if front else (t >= 0)
        cov = cv.cov(d) * m
        col, _ = shade(N, 'pearl', '#FFF4FA', cv.E, emit=2.6, seed=0.8, rim=0.8)
        cv.paint(sl, cov, col, flat=L_SYM, emissive=True)
    halo_part(False)
    droplet(cv, 0.0, -0.17, 0.32, crest='#E8F6FF', crestK=1.75, crestEmit=0.2, look=(-0.4, 1.0))
    halo_part(True)
    # the halo's light: dust magenta
    sl, X, Y = cv.win(-0.75, 0.75, -0.2, 0.85)
    rr = ellipse_sd(X, Y, hx, hy, hrx, hry, hrot)
    g = np.exp(-(np.abs(rr) / 0.07) ** 2) * 0.9
    cv.light(sl, lin(cv.A) * g[..., None])


def star4(cx, cy, rv, rh, p=2.4, n=240, rot=0.0):
    pts = []
    for i in range(n):
        t = i / n * 2 * math.pi
        c, s = math.cos(t), math.sin(t)
        x = rh * math.copysign(abs(c) ** p, c); y = rv * math.copysign(abs(s) ** p, s)
        pts.append((x, y))
    return rot2(pts, rot, cx, cy)


def g_nova(cv):
    """a four-point star lit inside the bead (NOVA: 'a small star has lit inside the droplet'; the droplet still wears
    the BEAD's glass mantle, game.js stage >= 1)"""
    bx, by, br = 0.0, -0.01, 0.47
    sl, X, Y = cv.win(bx - br, bx + br, by - br, by + br)
    d, N = sph(X, Y, bx, by, br)
    col, a = shade(N, 'glass', '#E6FBFF', cv.E, emit=0.03, seed=0.62, rim=1.4, rimseed=0.1)
    nv = np.clip(N[..., 2], 0, 1)
    col = col + lin(cv.A) * ((1 - nv) ** 3 * 1.1)[..., None]
    rr = np.sqrt((X - bx) ** 2 + (Y - by) ** 2)
    band = cv.cov(np.abs(rr - (br - 0.045)) - 0.045)
    cv.paint(sl, cv.cov(d), col, amul=a, flat=L_SYM, flatcov=band)
    # the light inside: the star's glow fills the mantle
    cv.light(sl, lin(cv.A) * (np.exp(-(rr / 0.26) ** 2) * 0.55 * cv.cov(d))[..., None])
    # the star: two crossed light-octahedra (game.js NOVA stage), faceted
    sx, sy = bx, by
    pts = star4(sx, sy, 0.37, 0.32, p=2.9)
    sl, X, Y = cv.win(sx - 0.34, sx + 0.34, sy - 0.39, sy + 0.39)
    d = poly_sd(X, Y, pts)
    q = (np.where(X < sx, 1.0, 0.66) * np.where(Y > sy, 1.0, 0.76)).astype(F32)
    col = lin('#FFFFFF')[None, None] * (2.8 * q)[..., None]
    cv.paint(sl, cv.cov(d), col.astype(F32), flat=L_SYM, emissive=True)
    dd = np.sqrt((X - sx) ** 2 + (Y - sy) ** 2)
    cv.light(sl, lin('#FFFFFF') * (np.exp(-(dd / 0.05) ** 2) * 1.4)[..., None])


BELL_OUT = [(0, 1.25), (0.3, 1.2), (0.48, 1.0), (0.55, 0.6), (0.62, 0.1), (0.78, -0.45), (1.0, -0.8), (1.12, -0.95)]


def g_bell(cv):
    """the Bell of Nacre: game.js bellProfile lathed, chrome #fff0f8, pearl clapper, its magenta glow torus at the mouth"""
    s = 0.37; ox, oy = 0.0, 0.09          # bell units -> seal units
    hs = np.array([p[1] for p in BELL_OUT][::-1], F32); ws = np.array([p[0] for p in BELL_OUT][::-1], F32)
    wf = PchipInterpolator(hs, ws); dwf = wf.derivative()
    lip_h, lip_ry = -0.95, 0.26
    sl, X, Y = cv.win(ox - 1.3 * s, ox + 1.3 * s, oy + (-1.45) * s, oy + 1.35 * s)
    bx = (X - ox) / s; by = (Y - oy) / s
    # the crown is widened a little (x1.3 at the top, fading out by the waist) so the dome reads at 32 px
    widen = (1 + 0.30 * smoothstep(-0.3, 1.0, np.clip(by, lip_h, 1.25))).astype(F32)
    hb = np.clip(by, lip_h, 1.25)
    w = np.maximum(wf(hb).astype(F32), 1e-3) * widen
    body = np.maximum(np.abs(bx) - w, by - 1.25)
    body = np.where(by < lip_h, 1.0, body)
    xn = np.clip(bx / w, -1, 1)
    slope = -dwf(hb).astype(F32)
    N = nstack(xn, slope * 0.55 + 0.12, np.sqrt(1 - xn * xn) + 0.05)
    col, _ = shade(N, 'chrome', '#FFF0F8', cv.E, seed=0.35, rim=1.2)
    col = col * 1.25 + lin('#F4F8FF') * 0.04
    lipE = ellipse_sd(bx, by, 0, lip_h, 1.12, lip_ry)
    cv.paint(sl, cv.cov(np.minimum(body, lipE) * s), col, flat=L_SYM)
    # seen from a little below: the mouth, dark inside, its glow torus (game: GLOW #ff2e88 at the mouth) and the clapper
    mouth = ellipse_sd(bx, by, 0, lip_h, 1.0, lip_ry * 0.80)
    mcol = np.broadcast_to(inv_hex('#0B0716'), X.shape + (3,)).astype(F32)
    cv.paint(sl, cv.cov(mouth * s), mcol, flat=L_DET)
    d, N, t = tube_ellipse(bx, by, 0, lip_h - 0.01, 0.93, lip_ry * 0.70, 0.075)
    rc = lin(cv.A)[None, None] * (2.0 * np.sqrt(np.clip(N[..., 2], 0, 1)))[..., None] + lin('#FFFFFF')[None, None] * (np.clip(N[..., 2], 0, 1) ** 8 * 0.8)[..., None]
    cv.paint(sl, cv.cov(d * s), rc.astype(F32), emissive=True)
    cd, cN = sph(bx, by, 0.05, lip_h - 0.06, 0.24)
    col, _ = shade(cN, 'pearl', '#FFE6F6', cv.E, seed=0.3, rim=0.8)
    cv.paint(sl, cv.cov(cd * s), col * 1.3, flat=L_SYM)
    # the lip edge catches a line of light
    lipd = np.abs(lipE) * s
    cv.light(sl, lin('#FFF4FA') * (np.exp(-(lipd / 0.010) ** 2) * 0.9)[..., None])
    rd = np.abs(ellipse_sd(bx, by, 0, lip_h, 0.93, lip_ry * 0.7)) * s
    cv.light(sl, lin(cv.A) * (np.exp(-(rd / 0.05) ** 2) * 0.45)[..., None])


def g_geode(cv):
    """a tall six-sided crystal point (the Geode's glass), cracked across, its heart showing through the crack"""
    ang = math.radians(-12); cx, cy = 0.0, -0.02
    s_ = 0.2  # side length = half width
    vb, vt, va, vb2 = -0.40, 0.20, 0.56, -0.60
    crack = [(-1.0, 0.02), (-0.45, -0.07), (0.05, 0.05), (0.5, -0.05), (1.0, 0.01)]  # (u/s_, v)
    shift = (0.025, 0.06); gap = 0.03
    sl, X, Y = cv.win(-0.62, 0.62, -0.72, 0.72)
    c, sn = math.cos(-ang), math.sin(-ang)
    U = (X - cx) * c - (Y - cy) * sn; V = (X - cx) * sn + (Y - cy) * c   # crystal-local

    def crystal(U, V):
        outline = [(-s_, vb), (-s_, vt), (0, va), (s_, vt), (s_, vb), (0, vb2)]
        d = poly_sd(U, V, outline)
        h = s_ / 2
        # facet normals (local u, v, z): side faces, centre face, tip faces, foot faces
        nu = np.where(U < -h, -0.866, np.where(U > h, 0.866, 0.0)).astype(F32)
        nz = np.where(np.abs(U) > h, 0.5, 1.0).astype(F32)
        nvv = np.zeros_like(U)
        tip = V > vt + (np.abs(U) - 0) * 0  # refine below
        # tip zone: above the line from (+-s_, vt) to apex; split in 3 by lines apex->(+-h, vt)
        top = V > vt
        bot = V < vb
        nvv = np.where(top, 0.55, np.where(bot, -0.55, 0.0)).astype(F32)
        tl = top & (U < -h * (va - V) / (va - vt)); tr = top & (U > h * (va - V) / (va - vt))
        nu = np.where(top, np.where(tl, -0.75, np.where(tr, 0.75, 0.0)), nu).astype(F32)
        nz = np.where(top, np.where(tl | tr, 0.5, 0.83), nz).astype(F32)
        bl = bot & (U < -h * (V - vb2) / (vb - vb2)); br = bot & (U > h * (V - vb2) / (vb - vb2))
        nu = np.where(bot, np.where(bl, -0.75, np.where(br, 0.75, 0.0)), nu).astype(F32)
        nz = np.where(bot, np.where(bl | br, 0.5, 0.83), nz).astype(F32)
        # back to screen frame
        cs, ss = math.cos(ang), math.sin(ang)
        N = nstack(nu * cs - nvv * ss, nu * ss + nvv * cs, nz)
        return d, N

    cu = np.array([p[0] * s_ for p in crack], F32); cvv = np.array([p[1] for p in crack], F32)
    # lower piece
    d, N = crystal(U, V)
    below = V - np.interp(U, cu, cvv) < -gap / 2
    col, a = shade(N, 'glass', '#D8FAFF', cv.E, emit=0.22, seed=0.5, rim=1.2)
    col = col + lin('#D8FAFF') * (0.9 * np.clip(N @ LIGHT, 0, 1) ** 2)[..., None]
    col = col * (0.45 + 0.75 * np.clip(N @ LIGHT + 0.2, 0, 1))[..., None]
    cov = cv.cov(np.maximum(d, (V - np.interp(U, cu, cvv)) + gap / 2))
    cv.paint(sl, cov, col, amul=np.clip(a + 0.55, 0, 1), flat=L_SYM)
    # upper piece, lifted along the crack
    U2, V2 = U - shift[0], V - shift[1]
    d2, N2 = crystal(U2, V2)
    col2, a2 = shade(N2, 'glass', '#D8FAFF', cv.E, emit=0.22, seed=0.5, rim=1.2)
    col2 = col2 + lin('#D8FAFF') * (0.9 * np.clip(N2 @ LIGHT, 0, 1) ** 2)[..., None]
    col2 = col2 * (0.45 + 0.75 * np.clip(N2 @ LIGHT + 0.2, 0, 1))[..., None]
    cov2 = cv.cov(np.maximum(d2, -(V2 - np.interp(U2, cu, cvv)) + gap / 2))
    cv.paint(sl, cov2, col2, amul=np.clip(a2 + 0.55, 0, 1), flat=L_SYM)
    # the heart showing through the crack: glass cyan light
    mid = V - shift[1] / 2 - np.interp(U - shift[0] / 2, cu, cvv)
    inside = cv.cov(poly_sd(U - shift[0] / 2, V - shift[1] / 2, [(-s_ * 1.02, vb), (-s_ * 1.02, vt), (s_ * 1.02, vt), (s_ * 1.02, vb)]))
    core = np.exp(-(mid / 0.028) ** 2) * inside
    cv.paint(sl, core * 0.95, (lin('#FFFFFF') * 2.2 + lin(cv.A) * 2.0)[None, None].astype(F32) * np.ones_like(X)[..., None], flat=L_DET, flatcov=np.clip(core * 1.4, 0, 1), emissive=True)
    cv.light(sl, lin(cv.A) * (np.exp(-(mid / 0.09) ** 2) * inside * 0.55)[..., None])


def g_star(cv):
    """the Eclipse (obsidian disc, its magenta limb) with one bead of white light breaking out of the limb"""
    ex, ey, er = 0.03, -0.03, 0.40
    sl, X, Y = cv.win(-0.9, 0.9, -0.9, 0.9)
    d, N = sph(X, Y, ex, ey, er)
    nv0 = np.clip(N[..., 2], 0, 1)
    col = dk.env(np.stack([2 * nv0 * N[..., 0], 2 * nv0 * N[..., 1], 2 * nv0 * N[..., 2] - 1], -1), UP, cv.E) * (0.06 * (0.4 + (1 - nv0) ** 4))[..., None] \
        + lin(cv.A) * (0.55 * (1 - nv0) ** 3.5 * 2.2)[..., None]
    cv.paint(sl, cv.cov(d), col.astype(F32), flat=L_DET)
    # the limb: a thin bright crescent on the upper left, strongest at the bead (the diamond ring)
    pa = math.radians(132)
    px, py = ex + er * math.cos(pa), ey + er * math.sin(pa)
    rho = np.sqrt((X - ex) ** 2 + (Y - ey) ** 2); ang = np.arctan2(Y - ey, X - ex)
    da = np.angle(np.exp(1j * (ang - pa)))
    wid = 0.036 * np.exp(-(da / 0.9) ** 2) + 0.004
    arc = np.exp(-((rho - er) / wid) ** 2) * np.exp(-(da / 1.1) ** 2)
    crescent = cv.cov(np.abs(rho - er + 0.02) - (0.068 * np.exp(-(da / 0.95) ** 2) + 0.004)) * (np.abs(da) < 2.0)
    cv.paint(sl, np.clip(arc * 1.4, 0, 1), np.broadcast_to(lin('#FFFFFF') * 2.6, X.shape + (3,)).astype(F32),
             flat=L_SYM, flatcov=crescent, emissive=True)
    # the bead of light
    br = 0.095
    dd = np.sqrt((X - px) ** 2 + (Y - py) ** 2)
    dB, NB = sph(X, Y, px, py, br)
    cv.paint(sl, cv.cov(dB), np.broadcast_to(lin('#FFFFFF') * 4.0, X.shape + (3,)).astype(F32), flat=L_SYM,
             flatcov=cv.cov(dd - 0.14), emissive=True)
    cv.light(sl, (lin('#FFFFFF')[None, None] * (1.2 * np.exp(-(dd / 0.10) ** 2))[..., None]
                  + lin(cv.A)[None, None] * (0.5 * np.exp(-(dd / 0.22) ** 2))[..., None]).astype(F32))
    # the anamorphic streak the game's lens draws through every hot point
    st = np.exp(-((Y - py) / 0.012) ** 2) * np.exp(-((X - px) / 0.34) ** 2)
    cv.light(sl, lin('#FFFFFF') * (st * 1.1)[..., None])


def g_resonances(cv):
    """two linked rings: pearl and glass (a resonance: two lineages fused)"""
    hw = 0.072
    A = dict(cx=-0.165, cy=0.03, rx=0.285, ry=0.285, rot=0.0)
    B = dict(cx=0.165, cy=-0.03, rx=0.285, ry=0.285, rot=0.0)
    sl, X, Y = cv.win(-0.6, 0.6, -0.45, 0.45)

    def ring(R, mat, tint, emit, mask=None, emissive=False):
        d, N, t = tube_ellipse(X, Y, R['cx'], R['cy'], R['rx'], R['ry'], hw, R['rot'])
        col, a = shade(N, mat, tint, cv.E, emit=emit, seed=0.45, rim=1.1)
        cov = cv.cov(d) if mask is None else cv.cov(d) * mask
        cv.paint(sl, cov, col, amul=None if mat != 'glass' else np.clip(a + 0.5, 0, 1), flat=L_SYM, emissive=emissive)
        return d
    # B (glass, lit from within: the accent) under A, then A's lower crossing goes under B again
    dB = ring(B, 'glass', '#CFF8FF', 0.9, emissive=True)
    dA = ring(A, 'pearl', '#F4F8FF', 0.0)
    # the upper crossing: B passes over A
    over = (Y > 0).astype(F32)
    ring(B, 'glass', '#CFF8FF', 0.9, mask=over, emissive=True)
    # the glass ring's own light
    dB_c = np.abs(ellipse_sd(X, Y, B['cx'], B['cy'], B['rx'], B['ry']))
    cv.light(sl, lin(cv.A) * (np.exp(-(dB_c / 0.07) ** 2) * 0.45)[..., None])


def g_forms(cv):
    """four beads on one tilted orbit: the four final forms (chrome sun, prism glass, iron-aurora dust, pearl orrery)"""
    ox, oy, orx, ory, rot = 0.0, -0.01, 0.49, 0.22, math.radians(-9)
    hw = 0.042
    sl, X, Y = cv.win(-0.9, 0.9, -0.9, 0.9)
    beads = [  # (angle on the orbit, base radius, material, tint, emit)
        (math.radians(262), 0.17, 'liquid', '#EEF2FB', 0.02),    # front: quicksilver
        (math.radians(352), 0.135, 'glow', None, 0.0),            # right: iron aurora dust (the accent)
        (math.radians(82), 0.10, 'glass', '#E6FBFF', 0.25),       # back: prism glass
        (math.radians(172), 0.125, 'pearl', '#F4F8FF', 0.0),      # left: pearl orrery
    ]
    c, s = math.cos(rot), math.sin(rot)

    def pos(t):
        x, y = orx * math.cos(t), ory * math.sin(t)
        return ox + x * c - y * s, oy + x * s + y * c

    def orbit(front):
        d, N, t = tube_ellipse(X, Y, ox, oy, orx, ory, hw, rot)
        m = (t < 0) if front else (t >= 0)
        col = np.broadcast_to(lin('#F4F8FF') * 1.3, X.shape + (3,)).astype(F32)
        cv.paint(sl, cv.cov(d) * m * 0.9, col, flat=L_SYM, emissive=True)

    def bead(b):
        t, r, mat, tint, emit = b
        bx, by = pos(t)
        dd, N = sph(X, Y, bx, by, r)
        if mat == 'glow':
            nv = np.clip(N[..., 2], 0, 1)
            col = lin(cv.A)[None, None] * (1.4 + 1.2 * nv)[..., None] + lin('#FFFFFF')[None, None] * (nv ** 8 * 1.2)[..., None]
            cv.paint(sl, cv.cov(dd), col.astype(F32), flat=L_SYM, emissive=True)
            g = np.sqrt((X - bx) ** 2 + (Y - by) ** 2)
            cv.light(sl, lin(cv.A) * (np.exp(-(g / (r * 2.0)) ** 2) * 0.5)[..., None])
        else:
            col, a = shade(N, mat, tint, cv.E, emit=emit, seed=0.3 + t * 0.1, rim=1.0)
            col = col * 1.3
            cv.paint(sl, cv.cov(dd), col, amul=None if mat != 'glass' else np.clip(a + 0.5, 0, 1), flat=L_SYM)
    back = [b for b in beads if math.sin(b[0]) >= 0]; front = [b for b in beads if math.sin(b[0]) < 0]
    for b in back: bead(b)
    orbit(False)
    orbit(True)
    for b in front: bead(b)


def g_constellation(cv):
    """three stars of the game's constellation map (STARS in content.js: Warm Start, Resonant Memory, Stardust
    Tide at their own x/y) joined by their two real lines"""
    pts = {'warm': (56, 70), 'resmem': (72, 48), 'tide': (90, 62)}
    k = 0.0255
    P = {n: ((x - 73) * k, -(y - 59) * k - 0.02) for n, (x, y) in pts.items()}
    sl, X, Y = cv.win(-0.9, 0.9, -0.9, 0.9)
    for a, b in (('warm', 'resmem'), ('resmem', 'tide')):
        d, N, t = capsule(X, Y, *P[a], *P[b], 0.03)
        col, _ = shade(N, 'pearl', '#F4F8FF', cv.E, emit=0.9, seed=0.6)
        cv.paint(sl, cv.cov(d), col, flat=L_SYM, emissive=True)
        dd = np.abs(d + 0.03)
        cv.light(sl, lin(cv.A) * (np.exp(-(dd / 0.05) ** 2) * 0.25)[..., None])
    for n, (sx, sy) in P.items():
        r = 0.085 if n == 'resmem' else 0.07
        # glint: a four-point flare (the lit star's twinkle), then the star itself
        gl = star4(sx, sy, r * 2.3, r * 2.0, p=3.2, rot=math.radians(0))
        d = poly_sd(X, Y, gl)
        cv.paint(sl, cv.cov(d), np.broadcast_to(lin('#FFFFFF') * 2.2, X.shape + (3,)).astype(F32), flat=L_SYM, emissive=True)
        dd, N = sph(X, Y, sx, sy, r)
        nv = np.clip(N[..., 2], 0, 1)
        col = lin('#FFFFFF')[None, None] * (2.0 + 2.5 * nv)[..., None] + lin(cv.A)[None, None] * ((1 - nv) * 1.5)[..., None]
        cv.paint(sl, cv.cov(dd), col.astype(F32), flat=L_SYM, emissive=True)
        g = np.sqrt((X - sx) ** 2 + (Y - sy) ** 2)
        cv.light(sl, lin(cv.A) * (np.exp(-(g / (r * 2.4)) ** 2) * 0.9)[..., None])


def g_lantern(cv):
    """Lantern Night: Nacre gone dark under the Eclipse's shadow (PLANET_FS u_dark / u_lantern), one pool of light
    around the droplet's spark"""
    wx, wy, wr = 0.0, 0.0, 0.47
    sl, X, Y = cv.win(-0.62, 0.62, -0.62, 0.62)
    d, N = sph(X, Y, wx, wy, wr)
    # Nacre's own palette (content.js style p0..p3) and contour bands
    p0, p1, p2, p3 = lin('#120A20'), lin('#2E1D42'), lin('#5E4270'), lin('#F6C8EA')
    lat = np.arcsin(np.clip(N[..., 1], -1, 1)); lon = np.arctan2(N[..., 0], N[..., 2])
    t = (lat * 1.0 + 0.18 * np.sin(lon * 2.0 + 0.7)) * 3.2
    b = t - np.floor(t); idx = np.floor(t); k = (idx * 0.618 + 0.13) % 1.0
    base = np.where((k < 0.5)[..., None], p0 + (p1 - p0) * (k * 2)[..., None], p1 + (p2 - p1) * ((k - 0.5) * 2)[..., None])
    wrap = np.clip(0.5 + 0.5 * (N @ LIGHT), 0, 1)
    col = base * (0.1 + 0.95 * wrap ** 1.5)[..., None]
    lx, ly = -0.03, -0.05
    pd = np.sqrt((X - lx) ** 2 + (Y - ly) ** 2)
    lant = np.exp(-(pd / 0.21) ** 2)
    col = col * (0.06 + 0.94 * lant)[..., None] * 1.6
    fw = 0.045
    line = 1 - smoothstep(0.0, fw, np.minimum(b, 1 - b))
    col = col + (p3 * 1.6 - col) * (line * 0.4 * (0.25 + 0.75 * lant))[..., None]
    col = col + p3 * ((1 - np.clip(N[..., 2], 0, 1)) ** 5 * 0.22 * 0.15)[..., None]
    cv.paint(sl, cv.cov(d), col.astype(F32), flat='#2E2C39')
    # the pool of light (dust magenta) and the droplet's spark at its centre
    m = cv.cov(d)
    cv.light(sl, lin(cv.A) * (np.exp(-(pd / 0.16) ** 2) * 1.0 * m)[..., None])
    sr = 0.07
    dS, NS = sph(X, Y, lx, ly, sr)
    cs, _ = shade(NS, 'liquid', '#EEF2FB', cv.E, emit=2.4, seed=0.07)
    cv.paint(sl, cv.cov(dS), cs, flat=L_SYM, flatcov=cv.cov(pd - 0.11), emissive=True)
    cv.light(sl, lin('#FFFFFF') * (np.exp(-(pd / 0.06) ** 2) * 1.3)[..., None])


SEALS = {
    'bead': ('feat', 'cyan', g_bead),
    'halo': ('feat', 'magenta', g_halo),
    'nova': ('feat', 'cyan', g_nova),
    'bell': ('feat', 'magenta', g_bell),
    'geode': ('feat', 'cyan', g_geode),
    'star': ('feat', 'magenta', g_star),
    'resonances': ('collection', 'cyan', g_resonances),
    'forms': ('collection', 'magenta', g_forms),
    'constellation': ('collection', 'cyan', g_constellation),
    'lantern-night': ('event', 'magenta', g_lantern),
}


# ------------------------------------------------------------------ finishing
def bloom(cv, src, thr=0.9, amt=0.55, streak=0.12):
    """bloom only on what emits; computed at 2x and blurred (the game's HDR bloom + its horizontal streak)"""
    f = cv.ss // 2; n = cv.N // f
    l = src.max(-1, keepdims=True)
    hot = src * np.clip((l - thr) / np.maximum(l, 1e-4), 0, None)
    lo = hot.reshape(n, f, n, f, 3).mean((1, 3))
    s = n / OUT  # px per 192-px
    b = ndimage.gaussian_filter(lo, (1.6 * s, 1.6 * s, 0)) * amt + ndimage.gaussian_filter(lo, (5 * s, 5 * s, 0)) * amt * 0.6
    b += ndimage.gaussian_filter(lo, (0.6 * s, 14 * s, 0)) * streak
    return ndimage.zoom(b, (f, f, 1), order=1)[:cv.N, :cv.N].astype(F32)


def wake(cv, col, em=None):
    """'in progress' = the planet shader's world-not-yet-awake grade; colour has come back around one bloom
    (lower left), with the wake ring at its front"""
    n = cv.N
    c = ((np.arange(n) + 0.5) / n * 2 - 1).astype(F32)
    X, Y = np.meshgrid(c, -c)
    d = np.sqrt((X + 0.78) ** 2 + (Y + 0.78) ** 2)
    fr = 0.80
    viv = smoothstep(fr + 0.10, fr - 0.28, d).astype(F32)
    if em is not None:
        col = col - em * (0.6 * (1 - viv))[..., None]
    lum = (col * np.array([0.3, 0.59, 0.11], F32)).sum(-1, keepdims=True)
    grey = lum * np.array([0.9, 0.88, 1.08], F32)
    k = (0.2 + 0.8 * viv)[..., None]
    out = (grey + (col - grey) * k) * (0.74 + 0.26 * viv)[..., None]
    wring = np.exp(-np.abs(d - fr) / 0.03) * 0.35
    lum = (film(d * 3.0) * np.array([0.3, 0.59, 0.11], F32)).sum(-1, keepdims=True)
    ringcol = lin(cv.A)[None, None] * 0.75 + lum * 0.25
    out = out + ringcol * (wring * 0.5)[..., None] * cv.a[..., None]
    return out.astype(F32), viv


def reduce(rgb01, a):
    """premultiplied Lanczos reduction to 192"""
    n = rgb01.shape[0]
    pm = rgb01 * a[..., None]
    chans = []
    for i in range(3):
        chans.append(np.asarray(Image.fromarray(pm[..., i].astype(np.float32), 'F').resize((OUT, OUT), Image.LANCZOS)))
    al = np.clip(np.asarray(Image.fromarray(a.astype(np.float32), 'F').resize((OUT, OUT), Image.LANCZOS)), 0, 1)
    pm = np.clip(np.stack(chans, -1), 0, 1)
    rgb = np.where(al[..., None] > 1e-4, pm / np.maximum(al[..., None], 1e-4), 0)
    # nearly transparent edge pixels carry no hue of their own (invisible on any panel; keeps the raw file clean)
    k = np.clip((al - 0.05) / 0.6, 0, 1)[..., None]
    l = (rgb * np.array([0.3, 0.59, 0.11], F32)).sum(-1, keepdims=True)
    rgb = l + (rgb - l) * k
    out = np.dstack([np.clip(rgb, 0, 1), al])
    return Image.fromarray((out * 255 + 0.5).astype(np.uint8), 'RGBA')


def render(sid, ss, states):
    kind, acc, glyph = SEALS[sid]
    cv = Canvas(ss, acc)
    cv.seed = sum(ord(c) for c in sid) * 7
    OUTLINES[kind](cv, 'back')
    glyph(cv)
    OUTLINES[kind](cv, 'front')
    out = {}
    for st in states:
        if st == 'locked':
            a = cv.fa
            rgb = np.where(a[..., None] > 1e-4, cv.flat / np.maximum(a[..., None], 1e-4), 0)
            out[st] = reduce(rgb.astype(F32), a)
            continue
        col = cv.col.copy(); a = cv.a.copy(); em = cv.emit
        if st == 'progress':
            col, viv = wake(cv, col, em)
            em, _ = wake(cv, em * 0.4)
            b = bloom(cv, em, amt=0.45)
        else:
            b = bloom(cv, em)
        col = col + b
        a = a + (1 - a) * np.clip(b.max(-1) * 0.8, 0, 1)
        c = np.where(a[..., None] > 1e-4, col / np.maximum(a[..., None], 1e-4), 0)
        out[st] = reduce(encode_f(c), a)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--ss', type=int, default=8)
    ap.add_argument('--only', default='')
    ap.add_argument('--out', default='/home/claude/passB/work/seals/out')
    ap.add_argument('--states', default='earned,progress,locked')
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    ids = [s for s in a.only.split(',') if s] or list(SEALS)
    for sid in ids:
        res = render(sid, a.ss, a.states.split(','))
        for st, im in res.items():
            p = os.path.join(a.out, f'{sid}-{st}.png'); im.save(p, optimize=True); print(p)


if __name__ == '__main__':
    main()
