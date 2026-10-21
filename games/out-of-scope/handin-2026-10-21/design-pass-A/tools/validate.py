#!/usr/bin/env python3
"""Check that every file the platform reads exists at its exact name and size.  python3 tools/validate.py bug"""
import json, os, sys
from PIL import Image

B = sys.argv[1] if len(sys.argv) > 1 else 'bug'
D = json.load(open(os.path.join(B, 'design.json')))
moments = [m['id'] for m in D['moments_proposed']['list']] + [D['event']['id']]
need = {
    'poster.png': ('ratio', 2.0, (1600, 800)), 'poster-2x3.png': ('ratio', 2 / 3, None), 'poster-1x1.png': ('ratio', 1.0, None),
    'poster-9x16.png': ('exact', (1080, 1920)), 'icon-46.png': ('exact', (92, 92)), 'emblem-30.png': ('exact', (60, 60)),
    'chip-64.png': ('exact', (128, 128)), 'key-still.png': ('exact', (720, 352)), 'result-still.png': ('exact', (1600, 352)),
    'pass/tile.png': ('exact', (400, 400)), 'pass/ground-free.png': ('exact', (306, 243)), 'pass/ground-pass.png': ('exact', (306, 243)),
    'pass/ground-bug.png': ('exact', (306, 243)), 'marker-next.png': ('max', (48, 48)), 'marker-held.png': ('max', (48, 48)),
    'updates/case-02.png': ('exact', (1600, 800)), f'events/{D["event"]["id"]}-banner.png': ('exact', (1720, 600)),
    'backdrop.png': ('exact', (1440, 577)), 'backdrop-phone.png': ('exact', (390, 826)), 'share-card.png': ('exact', (1200, 630)),
    'title-lockup.png': ('any', None),
}
for i in range(1, 7): need[f'gallery/{i:02d}.png'] = ('exact', (1600, 800))
for m in moments:
    for s in ('earned', 'progress', 'locked'): need[f'seals/{m}-{s}.png'] = ('exact', (192, 192))
for it in D['store']: need[f'store/{it["id"]}.png'] = ('exact', (400, 400))
for r in D['pass']['rewards']: need[f'pass/{r["id"]}.png'] = ('exact', (306, 243))
bad = 0
for f, spec in need.items():
    p = os.path.join(B, f)
    if not os.path.exists(p): print('MISSING', f); bad += 1; continue
    w, h = Image.open(p).size
    ok = True
    if spec[0] == 'exact': ok = (w, h) == spec[1]
    elif spec[0] == 'max': ok = w <= spec[1][0] and h <= spec[1][1]
    elif spec[0] == 'ratio':
        ok = abs(w / h - spec[1]) < .01 and (spec[2] is None or (w >= spec[2][0] and h >= spec[2][1]))
    if not ok: print('SIZE', f, (w, h), spec); bad += 1
for f in ['NOTES.md', 'design.json', 'publish.json', 'living-poster/outofscope.js']:
    if not os.path.exists(os.path.join(B, f)): print('MISSING', f); bad += 1
if not (os.path.exists(os.path.join(B, 'reward-held.png')) or os.path.isdir(os.path.join(B, 'reward'))): print('MISSING reward'); bad += 1
pj = json.load(open(os.path.join(B, 'publish.json')))
assert 0 <= pj['focus']['x'] <= 1 and 0 <= pj['focus']['y'] <= 1
print(f'{len(need)} pictures checked, {bad} problems')
sys.exit(1 if bad else 0)
