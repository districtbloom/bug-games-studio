# Fit a banded-sky model to the poster's sky (numbers only; nothing is copied into the module but the fitted colours).
import sys, json, numpy as np
from PIL import Image
from scipy.optimize import least_squares
P = sys.argv[1]
im = Image.open(P).convert('RGB').resize((160, 80), Image.BOX)
a = np.asarray(im).astype(float) / 255
H, W = a.shape[:2]
ys, xs = np.mgrid[0:H, 0:W]
X = ((xs + .5) * 15 - 1574) / 1200.0
Y = ((ys + .5) * 15 - 639) / 1200.0
m = (Y < -0.012)
m &= ~((X < -0.74) & (Y > -0.235))                       # headland
m &= ~((X > -0.37) & (X < 0.25) & (Y > -0.075))          # island
m &= ~((X > 0.27) & (Y > -0.13))                         # rocks
m &= ~((X > 0.0) & (Y > -0.145) & (Y < -0.04))           # cloud streak
m &= ~((X > 0.58) & (Y > -0.33) & (Y < -0.25))           # small cloud
m &= ~((np.abs(X) < 0.045) & (Y > -0.47) & (Y < -0.27))  # tower
m &= ~((np.abs(X) < 0.13) & (Y > -0.3) & (Y < 0.0))      # legs region
m &= ~(np.hypot(X, Y + 0.247) < 0.095)                   # sun disc
m &= ~((X < -1.2) & (Y > -0.13))                         # under-headland haze
x, y, c = X[m], Y[m], a[m]
KN = np.array([-0.58, -0.45, -0.32, -0.20, -0.10, -0.01])
def prof(k, yy):
    k = k.reshape(len(KN), 3)
    return np.stack([np.interp(yy, KN, k[:, i]) for i in range(3)], -1)
def model(p, xx, yy):
    yc, e, D, g = p[0], p[1], 1.40, p[3]
    A = prof(p[4:22], yy); B = prof(p[22:40], yy)
    hc = p[40:43]; hh, sg = p[43], p[44]
    d = np.sqrt(xx ** 2 + ((yy - yc) / e) ** 2)
    w = np.clip(d / D, 0, 1) ** g
    C = A * (1 - w[:, None]) + B * w[:, None]
    rs = np.hypot(xx, yy + 0.247)
    hw = hh * np.exp(-(rs / sg) ** 2)
    return C * (1 - hw[:, None]) + hc[None, :] * hw[:, None]
p0 = np.concatenate([[ -0.2, 0.7, 1.5, 0.9], np.tile([1, .8, .6], 6), np.tile([.5, .35, .4], 6), [1, .95, .7], [.4, .15]])
lo = np.concatenate([[-0.6, 0.2, 0.3, 0.3], np.zeros(36), np.zeros(3), [0, 0.03]])
hi = np.concatenate([[0.2, 3.0, 4.0, 3.0], np.ones(36), np.ones(3), [1, 0.6]])
r = least_squares(lambda p: (model(p, x, y) - c).ravel(), p0, bounds=(lo, hi), max_nfev=60)
p = r.x
err = np.abs(model(p, x, y) - c).mean(0)
print('mean abs err rgb', err, 'rms', np.sqrt(((model(p, x, y) - c) ** 2).mean()))
out = {'yc': p[0], 'e': p[1], 'D': p[2], 'g': p[3], 'KN': KN.tolist(), 'A': p[4:22].reshape(6, 3).tolist(), 'B': p[22:40].reshape(6, 3).tolist(), 'halo': p[40:43].tolist(), 'hh': p[43], 'sg': p[44]}
print(json.dumps(out))
def hx(v): v = np.clip(np.round(np.array(v) * 255), 0, 255).astype(int); return '#%02x%02x%02x' % tuple(v)
print('A', [hx(v) for v in out['A']]); print('B', [hx(v) for v in out['B']]); print('halo', hx(out['halo']))
json.dump(out, open(sys.argv[2], 'w'))
