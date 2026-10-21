#!/usr/bin/env python3
"""Build the render job list for the pass group and run it.
   python3 work/pass/jobs.py [all|grounds|rewards|marker|tile] [--scratch]
   --scratch writes into work/pass/ instead of bug/ (for iteration)."""
import json, subprocess, sys, os
os.chdir('/home/claude/designpass')
what = sys.argv[1] if len(sys.argv) > 1 else 'all'
scratch = '--scratch' in sys.argv
JS = ['src/common.js', 'src/pass.js']
REWARDS = ['sticky-pad', 'paperclip-trail', 'desk-lamp', 'envelope-trail', 'pinstripe-glove', 'night-window']
jobs = []
def out(p):
    return ('work/pass/' + p.replace('/', '_')) if scratch else p
if what in ('all', 'grounds'):
    for k, f in (('free', 'ground-free'), ('pass', 'ground-pass'), ('bug', 'ground-bug')):
        jobs.append(dict(js=JS, expr=f"PASS.ground('{k}')", out=out(f'bug/pass/{f}.png'), w=306, h=243, dpr=2, final=[306, 243], hexes=f'work/pass/{f}.hex'))
if what in ('all', 'rewards'):
    for r in REWARDS:
        jobs.append(dict(js=JS, expr=f"PASS.reward('{r}')", out=out(f'bug/pass/{r}.png'), w=306, h=243, dpr=2, final=[306, 243], alpha=True, hexes=f'work/pass/{r}.hex'))
if what in ('all', 'marker'):
    for p in ('next', 'held'):
        jobs.append(dict(js=JS, expr=f"PASS.marker('{p}')", out=out(f'bug/marker-{p}.png'), w=48, h=48, dpr=4, final=[48, 48], alpha=True, hexes=f'work/pass/marker-{p}.hex'))
if what in ('all', 'tile'):
    jobs.append(dict(js=JS, expr="PASS.tile()", out=out('bug/pass/tile.png'), w=400, h=400, dpr=2, final=[400, 400], hexes='work/pass/tile.hex'))
json.dump(jobs, open('work/pass/jobs.json', 'w'), indent=1)
sys.exit(subprocess.call(['python3', 'tools/render.py', 'work/pass/jobs.json']))
