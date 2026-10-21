"""Marker, two poses, 48x48 RGBA: rendered by the game at 384x384 on black, with a flat-white matte pass of the same
shapes for the solid parts; glow keeps an additive alpha (alpha = brightest channel)."""
from pv import *
import numpy as np
from PIL import Image
P = dict(solo=True, keep=[], neb=0.0, bg=False, grain=0.0, dof=0.0, light=[-0.45, 0.7, 0.45], sunburst=False, streak=0.0)
M0 = dict(P, bloom=0.0)
vs = [view('mk-next', marker_js('next', emit=1.0), **P), view('mk-nextM', marker_js('next', matte=True), **M0),
      view('mk-held', marker_js('held', emit=1.0, heldK=0.8), **P), view('mk-heldM', marker_js('held', matte=True), **M0)]
run(vs, 192, 192, 2, WORK + '/fin')
def comp(b, m, out, n=48):
    B = np.asarray(Image.open(b).convert('RGB')).astype(np.float64) / 255
    Mt = np.asarray(Image.open(m).convert('L')).astype(np.float64) / 255
    Mt = np.clip((Mt - 0.1) / 0.8, 0, 1)
    a = np.maximum(Mt, B.max(axis=2)); a[a < 0.02] = 0
    pre = np.dstack([B * (a[..., None] > 0), a])            # premultiplied
    k = B.shape[0] // n
    pre = pre.reshape(n, k, n, k, 4).mean(axis=(1, 3))       # box reduce 8x8 (exact for premultiplied colour)
    A = pre[..., 3:4]; rgb = np.where(A > 1e-4, pre[..., :3] / np.maximum(A, 1e-4), 0)
    img = np.dstack([np.clip(rgb, 0, 1), np.clip(A, 0, 1)])
    Image.fromarray((img * 255 + 0.5).astype(np.uint8), 'RGBA').save(out)
    edge = np.concatenate([img[0, :, 3], img[-1, :, 3], img[:, 0, 3], img[:, -1, 3]]).max()
    print(out, 'max alpha on the border', round(float(edge), 3))
comp(WORK + '/fin-mk-next.png', WORK + '/fin-mk-nextM.png', '/home/claude/passB/bug/marker-next.png')
comp(WORK + '/fin-mk-held.png', WORK + '/fin-mk-heldM.png', '/home/claude/passB/bug/marker-held.png')
