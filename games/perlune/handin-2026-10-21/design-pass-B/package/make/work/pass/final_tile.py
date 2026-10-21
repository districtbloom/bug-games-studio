"""Pass tile: the droplet over Nacre's woken pole, Nacre's own pearl rings (the game's ring dust and pearl chunks) arcing
above it: the pearl orbit. Rendered by the game at 800x800 and reduced to 400x400. No lettering (see notes)."""
from pv import *
import math
from PIL import Image
LK = [-0.45, 0.7, 0.45]
def cv(az, el): return [math.cos(az)*math.cos(el), math.sin(el), math.sin(az)*math.cos(el)]
v = view('tile', stage_js(world='nacre', ud=[0, 1, 0], lift=1.6, camv=cv(0.4, 0.5), dist=5.4, fov=1.05, ty=0.75) + neb_js(0.015),
         neb=0.025, light=LK, dof=0.3, lx=0.15, ly=0.95, ownRings=True)
run([v], 400, 400, 2, WORK + '/fin')
Image.open(WORK + '/fin-tile.png').convert('RGB').resize((400, 400), Image.LANCZOS).save('/home/claude/passB/bug/pass/tile.png'); print('saved tile')
