"""Outline the hat's "OK" from the game's own Tabloid face (oos3/fonts/tabloid.woff), positioned exactly as
suitCrown() sets it: <text x="176" y="44" text-anchor="middle" font-size="17" letter-spacing="1">OK</text>.
Writes the path (in suitB viewBox units, before the hat's transforms) to work/living/ok.json, so the module can
draw the letters as path data with no font dependency."""
import json, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

font = TTFont('/home/claude/oos3/fonts/tabloid.woff')
gs = font.getGlyphSet(); cmap = font.getBestCmap(); upm = font['head'].unitsPerEm
size, ls, x, y = 17.0, 1.0, 176.0, 44.0
s = size / upm
names = [cmap[ord(c)] for c in 'OK']
adv = [gs[n].width * s for n in names]
total = sum(adv) + ls * len(names)
x0 = x - total / 2
pen = SVGPathPen(gs)
cx = x0
for n, a in zip(names, adv):
    tp = TransformPen(pen, (s, 0, 0, -s, cx, y))
    gs[n].draw(tp)
    cx += a + ls
d = pen.getCommands()
json.dump({'d': d}, open(sys.argv[1] if len(sys.argv) > 1 else '/home/claude/designpass/work/living/ok.json', 'w'))
print(len(d), d[:120])
