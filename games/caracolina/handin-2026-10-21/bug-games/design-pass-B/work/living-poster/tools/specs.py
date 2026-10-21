# Writes the test specs for lp.mjs (all modes, all plate shapes, the held frame at poster size).
import json, sys
S = []
def add(name, w, h, seq=None, rm=False, events=None, dpr=1):
    S.append(dict(name=name, w=w, h=h, rm=rm, seq=seq or [], events=events or [], dpr=dpr))
add('held_2400x1200', 2400, 1200, rm=True)
for (w, h) in [(900, 450), (900, 640), (600, 400), (160, 120), (120, 90), (140, 305), (577, 163), (900, 200), (300, 600)]:
    add(f'rm_{w}x{h}', w, h, rm=True)
# idle life over time (one plate, several moments)
for t in [0.5, 2.5, 3.5, 5, 7, 9, 12, 15]:
    add(f'idle_600x400_t{t}', 600, 400, [dict(mode='idle', dur=t)])
add('idle_near_600x400', 600, 400, [dict(mode='idle', dur=1.0), dict(mode='idle', dur=1.5, near=1)])
for t in [0.06, 0.15, 0.3, 0.6, 0.8]:
    add(f'react_600x400_{t}', 600, 400, [dict(mode='idle', dur=1.0), dict(mode='react', dur=t, hover=[0.3, 0.5])])
for t in [0.15, 0.35, 0.7]:
    add(f'enter_600x400_{t}', 600, 400, [dict(mode='idle', dur=1.0), dict(mode='react', dur=0.8, hover=[0.3, 0.5]), dict(mode='enter', dur=t, hover=[0.3, 0.5])])
for u in [0.5, 1.0, 1.9, 2.4, 2.47, 2.9, 3.4, 3.9, 4.6, 5.2, 6.3]:
    add(f'loop_900x450_{u}', 900, 450, [dict(mode='idle', dur=1.0), dict(mode='react', dur=0.8, hover=[0.3, 0.5]), dict(mode='enter', dur=0.7, hover=[0.3, 0.5]), dict(mode='loop', dur=u, hover=[0.3, 0.5])])
for u in [2.4, 3.9]:
    add(f'loop_300x600_{u}', 300, 600, [dict(mode='idle', dur=1.0), dict(mode='react', dur=0.8, hover=[0.5, 0.5]), dict(mode='enter', dur=0.7, hover=[0.5, 0.5]), dict(mode='loop', dur=u, hover=[0.5, 0.5])])
    add(f'loop_160x120_{u}', 160, 120, [dict(mode='idle', dur=1.0), dict(mode='react', dur=0.8, hover=[0.5, 0.5]), dict(mode='enter', dur=0.7, hover=[0.5, 0.5]), dict(mode='loop', dur=u, hover=[0.5, 0.5])])
# back to idle after the loop: the settle
for t in [0.15, 0.45]:
    add(f'settle_600x400_{t}', 600, 400, [dict(mode='idle', dur=1.0), dict(mode='react', dur=0.8, hover=[0.3, 0.5]), dict(mode='enter', dur=0.7, hover=[0.3, 0.5]), dict(mode='loop', dur=3.6, hover=[0.3, 0.5]), dict(mode='idle', dur=t)])
# squeezed: the plate shrinks as in the harness
def sq(q): return int(270 - 150 * q), int(370 - 90 * q)
for q, mt in [(0.3, 0.5), (0.7, 1.0), (1.0, 2.0), (1.0, 3.6)]:
    seq = [dict(mode='idle', dur=0.5)]
    n = 12
    for i in range(n):
        qq = q * (i + 1) / n; w, h = sq(qq)
        seq.append(dict(mode='squeezed', dur=mt / n, squeeze=qq, w=w, h=h))
    w, h = sq(q)
    add(f'squeezed_{w}x{h}_{mt}', w, h, seq)
# cue (the kick that throws a shell) and hit (flinch)
for t in [0.3, 0.55, 0.7, 1.1]:
    add(f'cue_420x370_{t}', 420, 370, [dict(mode='idle', dur=1.0 + t)], events=[dict(at=1.0, evt=dict(type='cue'))])
for t in [0.08, 0.25, 0.6]:
    add(f'hit_420x370_{t}', 420, 370, [dict(mode='idle', dur=1.0 + t)], events=[dict(at=1.0, evt=dict(type='hit', item='clip', **{'from': 'carbon'}, x=150, y=260))])
add('look_420x370', 420, 370, [dict(mode='idle', dur=1.6)], events=[dict(at=1.0, evt=dict(type='look', dx=-1, dy=0))])
add('shake_420x370', 420, 370, [dict(mode='idle', dur=1.25)], events=[dict(at=1.0, evt=dict(type='shake', amount=1))])
# tiny / tall / wide plates alive
for (w, h, t) in [(140, 305, 6), (577, 163, 6), (120, 90, 6), (160, 120, 9), (900, 640, 6)]:
    add(f'alive_{w}x{h}', w, h, [dict(mode='idle', dur=t)])
add('dpr2_600x400', 600, 400, [dict(mode='idle', dur=4)], dpr=2)
# timing
for m in ['idle', 'loop', 'squeezed']:
    S.append(dict(name=f'time_{m}', time='600x400', mode=m))
    S.append(dict(name=f'time_{m}_flush', time='600x400', mode=m, flush=True))
json.dump(S, open(sys.argv[1], 'w'))
print(len(S), 'specs')
