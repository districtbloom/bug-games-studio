import sys; sys.argv = ['x', 'none']
exec(open('final_rewards.py').read().split("ids = sys.argv")[0])
from PIL import Image
def bl(id, big, dist, ty, rimEmit=2.6, glowEmit=0.0, rays=3.0, glow='#ffe0f0'):
    cam = dict(BUGCAM); cam.update(dist=dist, ty=ty)
    return view(id, stage_js(**cam) + ECL + eclipse_eyes_js(rim='#fff4e6', rimEmit=rimEmit, glow=glow, glowEmit=glowEmit, rays=rays, round=1.0, rimR=0.98, fwd=0.04, big=big), ly=0.1, **BUG)
vs = [bl('b1', 1.3, 10.5, 0.08), bl('b2', 1.35, 9.0, 0.22, rimEmit=3.2), bl('b3', 1.4, 9.5, 0.18, rimEmit=3.0, glowEmit=0.35, rays=4.0)]
run(vs, 306, 243, 2, WORK + '/tb')
for v in vs: Image.open(WORK + '/tb-%s.png' % v['id']).convert('RGB').resize((306, 243), Image.LANCZOS).save(WORK + '/tb-%s-s.png' % v['id'])
