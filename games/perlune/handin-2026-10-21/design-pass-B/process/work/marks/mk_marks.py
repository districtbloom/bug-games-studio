"""Perlune small marks, end to end: render (game renderer, 8x), compose on night, reduce per size.

usage: python3 mk_marks.py render <icon|emblem|chip> [--test]     render the look + mask passes at 8x (or 4x for --test)
       python3 mk_marks.py finish <icon|emblem|chip> [--test]     compose + reduce -> work/marks/<name>.png
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mk_render as MR
import mk_finish as F

WORK = '/home/claude/passB/work/marks'
RAW = WORK + '/raw'

# The droplet as in the poster: bare droplet (form 2), title staging over Nacre, poster key light from the upper left.
# Per-size choices (all written down in the notes):
#   ek / ekz   eye size (x,y) / depth factor      cl / cle   catchlight size / emission (game: 1 / 4)
#   crest      crest size factor                  crest_emit glass crest emission (game: 0.1; 0.45 at the Chimera)
#   bloom/exp  the game's own post bloom and exposure, set per size
MARKS = {
    # icon: head, eyes, crest; pink thin-film rim = the one hot colour; the eyes and catchlights drawn bigger for 46 px
    'icon': dict(size=92, view=dict(ek=1.45, ekz=1.4, cl=1.6, ex_dx=0.03, face=-0.08, lx=-0.1, ly=0.25, cle=2.2,
                                    crest=1.1, crest_emit=0.3, t0=10.5, bloom=0.2, exp=1.6, up=1.4, ty=0.19, fov=0.415, dist=6.0),
                 tone=dict(sat=1.15)),
    # emblem: fewer parts (head + eyes, no crest), bolder eyes, frontal, the head fills the square
    'emblem': dict(size=60, view=dict(ek=1.9, ekz=1.6, cl=2.1, ex_dx=0.07, face=-0.04, lx=-0.15, ly=0.3, cle=2.2,
                                      crest=0.0, t0=10.5, bloom=0.15, exp=1.6, up=1.4, ty=0.0, fov=0.38, dist=6.0),
                   tone=dict(sat=1.15)),
    # chip: head, eyes, crest + the Eclipse small behind at upper left, its light rimming the droplet; eyes look up at it
    'chip': dict(size=128, view=dict(ek=1.35, ekz=1.3, cl=1.6, ex_dx=0.02, face=-0.15, lx=-0.5, ly=0.6, cle=2.5,
                                     crest_emit=0.25, t0=10.5, bloom=0.25, exp=1.5, up=1.0, ty=0.2, fov=1.0, dist=2.95,
                                     cam=-0.37, side=0.3, clean=False, keep_eclipse=True, sunburst=False,
                                     extra=MR.ECLIPSE_ONLY),
                 tone=dict(sat=1.1)),
}


def render(name, test=False):
    m = MARKS[name]; os.makedirs(RAW, exist_ok=True)
    css = m['size'] * (2 if test else 4)       # dpr 2 -> 4x for tests, 8x for finals
    views = MR.pair(name, **m['view'])
    for k, v in m.get('extra_views', {}).items():
        views += MR.pair(k, **v)
    env = dict(os.environ, NODE_PATH='/home/claude/.npm-global/lib/node_modules', MSAA='4')
    subprocess.run(['node', '/home/claude/passB/tools/render.js', str(css), str(css), '2', f'{RAW}/{name}', json.dumps(views)], env=env, check=True)


def finish(name, test=False, **over):
    m = MARKS[name]; size = m['size']
    look = F.load(f'{RAW}/{name}-{name}.png'); cov = F.coverage(f'{RAW}/{name}-{name}-mask.png')
    H, W = cov.shape
    g = F.ground(W, H, **m.get('ground', {}))
    c = F.compose(look, cov, g)
    c = F.tone(c, **m.get('tone', {}))
    im = F.reduce(c, (size, size), **m.get('reduce', {}))
    out = f'{WORK}/{name}.png'; im.save(out); print('wrote', out, im.size)
    return im


if __name__ == '__main__':
    cmd, name = sys.argv[1], sys.argv[2]; test = '--test' in sys.argv
    if cmd == 'render': render(name, test)
    elif cmd == 'finish': finish(name, test)
    elif cmd == 'all': render(name, test); finish(name, test)
