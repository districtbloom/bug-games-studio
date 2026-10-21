import sys; sys.argv = ['x', 'none']
exec(open('final_rewards.py').read().split("ids = sys.argv")[0])
from PIL import Image
def bl(id, big, dist, ty, lift, fwd=0.04, rimEmit=2.6, rays=3.0):
    cam = dict(BUGCAM); cam.update(dist=dist, ty=ty)
    return view(id, stage_js(**cam) + ECL + eclipse_eyes_js(rim='#fff4e6', rimEmit=rimEmit, glowEmit=0.0, rays=rays, round=1.0, rimR=0.98, fwd=fwd, big=big, lift=lift), ly=0.1, **BUG)
vs = [bl('c1', 1.35, 10.2, 0.1, 0.05, fwd=0.09), bl('c2', 1.35, 10.2, 0.1, 0.08, fwd=0.12)]
run(vs, 306, 243, 2, WORK + '/tb')
for v in vs: Image.open(WORK + '/tb-%s.png' % v['id']).convert('RGB').resize((306, 243), Image.LANCZOS).save(WORK + '/tb-%s-s.png' % v['id'])
