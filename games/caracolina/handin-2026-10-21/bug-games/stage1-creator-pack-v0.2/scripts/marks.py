"""Caracolina small marks and store art, drawn as SVG for their size.
usage: python3 -I marks.py <outdir> [print.jpg]
writes icon-46.svg, store-trencadis-frame.svg (+ .html wrappers for rasterising)
Palette: free colours only (measured against ember / lilac / sun with measure.py)."""
import sys, os, math, random, base64

OUT = sys.argv[1]
PRINT = sys.argv[2] if len(sys.argv) > 2 else None
os.makedirs(OUT, exist_ok=True)

C = dict(ink='#1d1a33', cobalt='#2a55b8', sea='#234f96', night='#172d4e', violet='#6f6a9a', dusk='#4b4f8f',
         dusk2='#7d6f98', paper='#f3ead7', paperw='#e9dfd0', tile='#fbf8f1', brick='#9c4426', brickd='#5e2a22',
         brickm='#7a3520', olive='#6b7a3a', viridian='#1f6b5a', turq='#19ac8e', oxblood='#8e2a22', plum='#6a3a8a',
         sky='#5c8fc2')


def jitter_path(pts, rnd, amt):
    """a hand-cut edge: every vertex nudged a little"""
    return [(x + rnd.uniform(-amt, amt), y + rnd.uniform(-amt, amt)) for x, y in pts]


def poly(pts, fill, stroke=None, sw=0, extra=''):
    d = 'M' + ' L'.join('%.2f %.2f' % p for p in pts) + ' Z'
    s = f'<path d="{d}" fill="{fill}"'
    if stroke: s += f' stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"'
    return s + f' {extra}/>'


def rock_outline(cx, top, w, tip_y, rnd, lumps=7):
    """the rock that thinks it is a cloud: a flat grassy top, a lumpy underside to a blunt tip"""
    half = w / 2
    left = [(cx - half, top)]
    right = [(cx + half, top)]
    n = lumps
    for i in range(1, n + 1):
        t = i / (n + 1)
        y = top + (tip_y - top) * t
        span = half * (1 - t) ** 1.15
        left.append((cx - span - rnd.uniform(0, half * .10) * (1 - t), y))
        right.append((cx + span + rnd.uniform(0, half * .14) * (1 - t), y))
    tip = [(cx + half * .06, tip_y), (cx - half * .05, tip_y - 1.2)]
    return left[:1] + right[:1] + right[1:] + tip + list(reversed(left[1:]))


def icon_svg(chain=False):
    rnd = random.Random(7)
    S = 92
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}" width="{S}" height="{S}" shape-rendering="geometricPrecision">']
    o.append('<defs><pattern id="hatch" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">'
             f'<line x1="0" y1="0" x2="0" y2="3.2" stroke="{C["ink"]}" stroke-width="0.9" stroke-opacity=".38"/></pattern></defs>')
    # sky in painted bands (gouache: hard edges, no airbrush), blue hour so nothing nears the platform's sun
    o.append(f'<rect width="{S}" height="{S}" fill="{C["cobalt"]}"/>')
    o.append(poly([(0, 30), (S, 26), (S, 46), (0, 50)], C['dusk']))
    o.append(poly([(0, 46), (S, 43), (S, 56), (0, 56)], C['dusk2']))
    o.append(poly([(8, 20), (34, 17), (40, 19), (18, 22)], C['violet']))          # one cloud stroke
    o.append(poly([(54, 33), (84, 31), (88, 33.5), (60, 35)], C['dusk2']))
    o.append('<rect x="0" y="56" width="92" height="3" fill="#f6f3ee" shape-rendering="crispEdges"/>')     # the last light on the horizon
    # the sea
    o.append(f'<rect x="0" y="59" width="92" height="33" fill="{C["sea"]}" shape-rendering="crispEdges"/>')
    o.append(poly([(0, 78), (S, 76), (S, S), (0, S)], C['night']))
    for x, y, w in [(9, 66, 9), (70, 69, 11), (24, 84, 7), (78, 86, 6)]:
        o.append(f'<path d="M{x} {y} h{w}" stroke="{C["tile"]}" stroke-opacity=".55" stroke-width="1.3" stroke-linecap="round"/>')
    if chain:
        o.append(f'<path d="M47 82 Q55 88 63 92" fill="none" stroke="{C["ink"]}" stroke-width="1.6" stroke-dasharray="2 1.4"/>')
    # the rock
    cx, top, w, tip = 45, 44, 60, 85
    R = [(15, 44.2), (75, 43.2), (74.2, 47), (71.6, 51), (68.8, 54.6), (71.4, 58.4), (68.2, 62.6), (62.4, 65.6), (59.6, 70.4),
         (54.6, 76.2), (50, 82.4), (46.6, 85.6), (44.2, 82.6), (40.4, 77), (35.4, 70.2), (30.6, 64.6), (27.6, 60.8), (23.2, 56.2), (19.6, 51.2), (16.4, 47.4)]
    o.append(poly(R, C['brick'], C['ink'], 1.7))
    # shadow side (light comes from the left, the low sun), hatched in pencil
    SH = [(49, 44), (75, 43.2), (74.2, 47), (71.6, 51), (68.8, 54.6), (71.4, 58.4), (68.2, 62.6), (62.4, 65.6), (59.6, 70.4),
          (54.6, 76.2), (50, 82.4), (46.9, 85.2), (47.4, 76), (49.6, 66), (51.6, 56)]
    o.append(poly(SH, C['brickd']))
    o.append(poly(SH, 'url(#hatch)'))
    # the bulge catches a little light
    o.append(f'<path d="M68.4 55.4 Q71 57.6 69.4 60.8" fill="none" stroke="{C["brickm"]}" stroke-width="1.6" stroke-linecap="round"/>')
    # dry-brush streaks on the lit face
    for d_ in ['M21 49 Q29 52 34 50', 'M26 58 Q33 61 40 59', 'M33 67 Q38 69 43 68', 'M18.5 46.5 Q30 48 44 47']:
        o.append(f'<path d="{d_}" fill="none" stroke="{C["brickm"]}" stroke-width="1.3" stroke-linecap="round" stroke-opacity=".8"/>')
    # a lit seam down the left, gouache dry-brush
    o.append(poly(R, 'none', C['ink'], 1.7))
    # grass rim
    o.append(f'<path d="M{cx - w / 2 + .5} {top + .3} L{cx + w / 2 - .5} {top - .3}" stroke="{C["olive"]}" stroke-width="3.2" stroke-linecap="round"/>')
    o.append(f'<path d="M{cx - w / 2} {top + 1.6} L{cx + w / 2} {top + 1.0}" stroke="{C["ink"]}" stroke-width="1.1" stroke-opacity=".7"/>')
    # the cypress
    o.append(poly([(63, 42.5), (60.2, 33), (61.4, 23), (63.4, 13.5), (65.6, 23), (66.8, 33), (64.4, 42.5)], C['viridian'], C['ink'], 1.2))
    # the little house, white with a cobalt door
    hx0, hx1, hy0, hy1 = 31, 52, 26, 43
    o.append(poly(jitter_path([(hx0, hy0), (hx1, hy0 - .4), (hx1 + .2, hy1), (hx0 - .2, hy1 + .3)], rnd, .25), C['tile'], C['ink'], 1.4))
    o.append(poly([(hx1 - 5.5, hy0 + .4), (hx1, hy0), (hx1 + .2, hy1), (hx1 - 5.5, hy1)], '#c8c4bc'))   # its shaded flank
    o.append(f'<path d="M{hx1 - 5.5} {hy0 + .6} V{hy1 - .2}" stroke="{C["ink"]}" stroke-width=".8" stroke-opacity=".6"/>')
    o.append(poly([(hx0 - 1.6, hy0 - 2.2), (hx1 + 1.8, hy0 - 2.6), (hx1 + 1.8, hy0 + .2), (hx0 - 1.6, hy0 + .4)], C['tile'], C['ink'], 1.2))  # roof slab
    o.append(f'<rect x="{hx0 + 3.2}" y="{hy0 + 4}" width="3.6" height="3.6" fill="{C["ink"]}"/>')
    o.append(f'<rect x="{hx0 + 10}" y="{hy0 + 4}" width="3.6" height="3.6" fill="{C["ink"]}"/>')
    o.append(f'<rect x="{hx0 + 4.4}" y="{hy1 - 7.6}" width="4.2" height="7.6" fill="{C["cobalt"]}" stroke="{C["ink"]}" stroke-width=".8"/>')
    # the black egg on the roof
    o.append(f'<ellipse cx="{hx0 + 8.5}" cy="{hy0 - 8.4}" rx="4.6" ry="6.1" fill="{C["ink"]}"/>')
    o.append(f'<path d="M{hx0 + 6.6} {hy0 - 11.4} q1.2 -1.6 2.6 -1.2" stroke="{C["tile"]}" stroke-opacity=".75" stroke-width="1.1" fill="none" stroke-linecap="round"/>')
    o.append('<filter id="g1" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="9"/>'
             '<feColorMatrix values="0 0 0 0 .11  0 0 0 0 .10  0 0 0 0 .20  0 0 0 .55 -.18"/></filter>')
    o.append(f'<rect width="{S}" height="{S}" filter="url(#g1)" opacity=".28"/>')
    o.append('</svg>')
    return '\n'.join(o)


def mosaic_band(x0, y0, x1, y1, inner, rnd, cell=19.0):
    """trencadís: broken tile pieces filling the band between the outer and inner rects, grout between them"""
    from scipy.spatial import Voronoi
    ix0, iy0, ix1, iy1 = inner
    pts = []
    y = y0 - cell
    while y < y1 + cell:
        x = x0 - cell
        while x < x1 + cell:
            pts.append((x + rnd.uniform(-.45, .45) * cell, y + rnd.uniform(-.45, .45) * cell))
            x += cell
        y += cell * .9
    vor = Voronoi(pts)
    cols = [C['cobalt'], C['cobalt'], C['cobalt'], C['turq'], C['turq'], C['tile'], C['tile'], C['sea'], C['viridian'], C['oxblood'], C['plum']]
    out = []
    for i, reg_i in enumerate(vor.point_region):
        reg = vor.regions[reg_i]
        if not reg or -1 in reg: continue
        P = [tuple(vor.vertices[v]) for v in reg]
        cxp = sum(p[0] for p in P) / len(P); cyp = sum(p[1] for p in P) / len(P)
        if not (x0 <= cxp <= x1 and y0 <= cyp <= y1): continue
        if ix0 < cxp < ix1 and iy0 < cyp < iy1: continue
        # shrink toward the centre for the grout line; a little rotation, as broken tile is laid
        k = .86 + rnd.uniform(-.04, .03)
        P = [(cxp + (px - cxp) * k, cyp + (py - cyp) * k) for px, py in P]
        out.append(poly(P, rnd.choice(cols)))
        if rnd.random() < .35:   # a glaze highlight on some pieces
            a = P[0]; b = P[1 % len(P)]
            out.append(f'<path d="M{a[0]:.1f} {a[1]:.1f} L{(a[0] + b[0]) / 2:.1f} {(a[1] + b[1]) / 2:.1f}" stroke="#fbf8f1" stroke-opacity=".7" stroke-width="1.4" stroke-linecap="round"/>')
    return out


def store_frame_svg(photo_uri):
    rnd = random.Random(31)
    S = 400
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {S} {S}" width="{S}" height="{S}">']
    o.append('<defs>'
             '<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/>'
             '<feColorMatrix values="0 0 0 0 .11  0 0 0 0 .10  0 0 0 0 .20  0 0 0 .09 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>'
             '<filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur stdDeviation="7"/></filter>'
             '<clipPath id="ph"><rect x="-120" y="-80" width="240" height="160"/></clipPath>'
             '<clipPath id="fr"><rect x="-158" y="-118" width="316" height="236"/></clipPath>'
             '</defs>')
    # the sketchbook page: paper, faint cobalt rules (as on the develop page)
    o.append(f'<rect width="{S}" height="{S}" fill="{C["paper"]}"/>')
    for y in range(26, S, 30):
        o.append(f'<path d="M0 {y} H{S}" stroke="{C["cobalt"]}" stroke-opacity=".10" stroke-width="2"/>')
    o.append(f'<rect width="{S}" height="{S}" fill="{C["paper"]}" filter="url(#grain)"/>')
    # the framed print, laid slightly crooked
    o.append('<g transform="translate(200 206) rotate(-5)">')
    o.append('<rect x="-158" y="-108" width="316" height="232" fill="#1d1a33" opacity=".32" filter="url(#shadow)" transform="translate(6 12)"/>')
    o.append('<rect x="-158" y="-118" width="316" height="236" fill="#c4c0b8"/>')   # mortar between the broken tiles
    o.append('<g clip-path="url(#fr)">'); o.extend(mosaic_band(-158, -118, 158, 118, (-124, -84, 124, 84), rnd)); o.append('</g>')
    o.append(f'<rect x="-124" y="-84" width="248" height="168" fill="{C["ink"]}"/>')
    if photo_uri:
        o.append(f'<image href="{photo_uri}" x="-120" y="-80" width="240" height="160" preserveAspectRatio="xMidYMid slice" clip-path="url(#ph)"/>')
    o.append(f'<rect x="-158" y="-118" width="316" height="236" fill="none" stroke="{C["ink"]}" stroke-width="2.4"/>')
    o.append('</g>')
    # washi tape, turquoise, a little see-through
    o.append(f'<g transform="translate(206 84) rotate(4)"><rect x="-62" y="-17" width="124" height="34" fill="{C["turq"]}" fill-opacity=".62"/>'
             f'<path d="M-62 -17 l4 6 -4 6 4 6 -4 6 4 6 -2 5" stroke="{C["paper"]}" stroke-opacity=".5" fill="none"/></g>')
    o.append('</svg>')
    return '\n'.join(o)


def wrap(svg, w, h):
    return f'<!doctype html><html><head><meta charset="utf-8"><style>html,body{{margin:0;background:transparent}}svg{{display:block}}</style></head><body>{svg}</body></html>'


if __name__ == '__main__':
    for nm, svg in [('icon-46', icon_svg(False)), ('icon-46-chain', icon_svg(True))]:
        open(os.path.join(OUT, nm + '.svg'), 'w').write(svg)
        open(os.path.join(OUT, nm + '.html'), 'w').write(wrap(svg, 92, 92))
    uri = None
    if PRINT:
        uri = 'data:image/jpeg;base64,' + base64.b64encode(open(PRINT, 'rb').read()).decode()
    svg = store_frame_svg(uri)
    open(os.path.join(OUT, 'store-trencadis-frame.html'), 'w').write(wrap(svg, 400, 400))
    print('ok')
