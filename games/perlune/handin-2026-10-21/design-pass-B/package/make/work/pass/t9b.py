import sys; sys.argv = ['x', 'none']
exec(open('final_rewards.py').read().split("ids = sys.argv")[0])
def NS(seed, tint):
    return WRAP + r"""
__wrapDC(function (k, m, a, put) {
  if (k === 'sphere' && a[4] === MAT.LIQUID && a[8] === 1) return put(a[0], a[1], a[2], hex(%s), MAT.PEARL, (a[5] || 0) + 0.04, a[6], a[7], %f);
  return put(...a);
});
""" % (tint, seed)
vs = [view('n%d' % i, pole() + NS(s, t), ly=0.6, **PASS) for i, (s, t) in enumerate([(0.45, '0xfff0f8'), (0.7, '0xfff0f8'), (0.95, '0xfff0f8'), (0.3, '0xfff2ee')])]
run(vs, 306, 243, 2, WORK + '/t9')
