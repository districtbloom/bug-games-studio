"""Finishing for the small marks: put a game render (bg false, black plate) on the night ground and reduce it with care.

  compose(look, mask, ground): out = look + ground * (1 - coverage), in linear light. The look pass already holds the
    droplet's own bloom as additive light, so the bloom falls on the ground the way it would in the game; the coverage
    comes from the mask pass (same pose, same clock, no bloom, huge exposure), with the eye holes filled (the eyes are
    opaque black in the game, so they must not let the ground through).
  reduce(img, size): area-average from 8x in a light/gamma blend (so dark eyes do not shrink), then a mild unsharp mask.
"""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

NIGHT0, NIGHT1 = '#05040A', '#2A0B4D'


def s2l(a):
    a = np.asarray(a, np.float32) / 255.0
    return np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)


def l2s(x):
    x = np.clip(x, 0, 1)
    return np.where(x <= 0.0031308, x * 12.92, 1.055 * np.power(x, 1 / 2.4) - 0.055)


def hexl(h):
    h = h.lstrip('#'); return s2l([int(h[i:i + 2], 16) for i in (0, 2, 4)])


def load(path):
    return s2l(np.asarray(Image.open(path).convert('RGB')))


def coverage(mask_path, thr=0.5):
    m = load(mask_path).max(-1)
    hard = m > 0.02
    filled = ndi.binary_fill_holes(hard)
    soft = np.clip(m / thr, 0, 1)
    return np.where(filled & ~hard, 1.0, soft).astype(np.float32)


def ground(W, H, cx=0.22, cy=0.12, r=1.25, power=1.15):
    """the game's night, edge to edge: #2A0B4D where the light comes from (upper left) -> #05040A (lower right).
    Mixed in sRGB so the ramp is even to the eye."""
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((xx + 0.5) / W - cx) ** 2 + ((yy + 0.5) / H - cy) ** 2) / r
    k = np.clip(d, 0, 1) ** power
    a = np.array([int(NIGHT1[i:i + 2], 16) for i in (1, 3, 5)], np.float32)
    b = np.array([int(NIGHT0[i:i + 2], 16) for i in (1, 3, 5)], np.float32)
    srgb = a[None, None] * (1 - k[..., None]) + b[None, None] * k[..., None]
    return s2l(srgb)


def compose(look, cov, gnd):
    return look + gnd * (1 - cov[..., None])


def tone(x, exp=1.0, contrast=1.0, pivot=0.18, sat=1.0):
    """per-size exposure / contrast (around a mid-grey pivot, in log space) / saturation; keeps hues."""
    y = x * exp
    if contrast != 1.0:
        lum = np.maximum((y * np.array([0.2126, 0.7152, 0.0722], np.float32)).sum(-1, keepdims=True), 1e-5)
        nl = pivot * (lum / pivot) ** contrast
        y = y * (nl / lum)
    if sat != 1.0:
        lum = (y * np.array([0.2126, 0.7152, 0.0722], np.float32)).sum(-1, keepdims=True)
        y = lum + (y - lum) * sat
    return np.clip(y, 0, None)


def reduce(lin, size, gamma_mix=0.6, sharpen=(0.6, 60, 0)):
    """lin (H,W,3) linear -> PIL RGB at size. Box-average in linear light and in sRGB, blend (gamma_mix = share of the
    sRGB average: keeps dark eyes their full size), then a light unsharp mask (radius, percent, threshold)."""
    srgb8 = (l2s(lin) * 255).round().clip(0, 255).astype(np.uint8)
    lin8 = (np.clip(lin, 0, 1) * 65535).astype(np.uint16)
    a = np.asarray(Image.fromarray(srgb8).resize(size, Image.BOX), np.float32) / 255
    # linear-light average
    H, W = lin.shape[:2]; fy, fx = H // size[1], W // size[0]
    b = np.clip(lin, 0, 1)[:size[1] * fy, :size[0] * fx].reshape(size[1], fy, size[0], fx, 3).mean((1, 3))
    b = l2s(b)
    out = a * gamma_mix + b * (1 - gamma_mix)
    im = Image.fromarray((out * 255).round().clip(0, 255).astype(np.uint8))
    if sharpen:
        im = im.filter(ImageFilter.UnsharpMask(radius=sharpen[0], percent=sharpen[1], threshold=sharpen[2]))
    return im


def to_img(lin):
    return Image.fromarray((l2s(lin) * 255).round().clip(0, 255).astype(np.uint8))
