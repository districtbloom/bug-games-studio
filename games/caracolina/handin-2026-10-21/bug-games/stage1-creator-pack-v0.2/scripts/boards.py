"""Caracolina stage-1 boards (style sheet + pilots), as HTML for rasterising.
python3 -I boards.py <boarddir> <stage1dir>"""
import sys, os, html

BD, S1 = sys.argv[1], sys.argv[2]

HEAD = """<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Bricolage;src:url(fonts/BricolageGrotesque-Bold.ttf);font-weight:700}
@font-face{font-family:Bricolage;src:url(fonts/BricolageGrotesque-Regular.ttf);font-weight:400}
@font-face{font-family:DMMono;src:url(fonts/DMMono-Regular.ttf)}
@font-face{font-family:ISans;src:url(fonts/InstrumentSans-Regular.ttf);font-weight:400}
@font-face{font-family:ISans;src:url(fonts/InstrumentSans-Bold.ttf);font-weight:700}
@font-face{font-family:ISerif;src:url(fonts/InstrumentSerif-Italic.ttf);font-style:italic}
*{box-sizing:border-box}
html,body{margin:0;background:#000;color:#efe9dc;font-family:ISans,sans-serif}
.b{width:1800px;padding:44px 48px 52px}
h1{font-family:Bricolage;font-weight:700;font-size:44px;margin:0 0 4px;letter-spacing:-.01em}
.sub{font-family:DMMono;font-size:15px;color:#9d978a;margin:0 0 28px;letter-spacing:.02em}
.k{font-family:DMMono;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#9d978a}
.grid{display:grid;gap:22px}
.fig img{display:block;width:100%;border:1px solid #2b2925}
.cap{margin-top:9px;font-size:16px;line-height:1.38;color:#d9d3c6}
.cap b{color:#efe9dc;font-weight:700}
.rule{border-top:1px solid #2b2925;padding-top:14px}
.rule h3{font-family:Bricolage;font-size:22px;margin:0 0 8px}
.rule ul{margin:0;padding-left:18px;font-size:16px;line-height:1.45;color:#d9d3c6}
.rule li{margin:0 0 5px}
.sw{display:grid;grid-template-columns:54px 1fr;gap:10px;align-items:center;font-size:14px;line-height:1.3}
.chip{width:54px;height:40px;border:1px solid #2b2925}
.hex{font-family:DMMono;font-size:14px;color:#efe9dc}
.ro{color:#bdb6a7}
.me{font-family:DMMono;font-size:12px;color:#8d877b}
.band{font-family:DMMono;font-size:12px;letter-spacing:.06em;text-transform:uppercase;padding:2px 6px;border:1px solid #57524a;color:#d9d3c6}
.band.g{border-color:#efe9dc;color:#efe9dc}
.lin{background:#efe9dc;color:#1d1a33}
.note{font-size:15px;color:#bdb6a7;line-height:1.4}
</style></head><body>"""


def esc(s): return html.escape(s)


def board1():
    F = [
        ('img/A_keyart.jpg', 'A · Key art (the cover’s picture)', 'Sunset over the sea: violet clouds on gold, cobalt water, the rock that thinks it is a cloud, El Caracol’s spiral stair, a confetti of roofs. <b>The hour and the light of the brand.</b>'),
        ('img/B_title.jpg', 'B · Title card (trailer end frame)', 'The wordmark in cobalt with a white tile outline; the “o” is a coral shell spiral. Kalam line under it, oxblood caps below. <b>The only place the title is lettered.</b>'),
        ('img/C_aurora.jpg', 'C · People: Aurora at her easel', 'Residents are paper cut-outs painted on both sides: flat colour, one big eye, a white paper edge. Turquoise wall in gouache, a mosaic floor. <b>Faces stay simple.</b>'),
        ('img/C_jardi.jpg', 'D · Architecture: the garden of eyes', 'The town is strange on purpose: a broken face you can stand inside, eyes painted on walls, a checkerboard floor. <b>Hard shadow, pencil edges, no gore, no menace.</b>'),
        ('img/C_festival.jpg', 'E · Night: the Festival of the Shell', 'Navy and violet sky, the moon, fireworks drawn as dotted bursts, the paper crowd on the summit. <b>Night is the free-colour palette.</b>'),
        ('img/F_ui.jpg', 'F · Paper: the game’s own interface', 'A sketchbook card with faint cobalt rules, torn edges, the name in Caprasimo, the line in Kalam. <b>Information sits on paper, never on the scene.</b>'),
    ]
    o = [HEAD, '<div class="b"><h1>Caracolina · style sheet</h1><p class="sub">STAGE 1 · REFERENCE FRAMES · all six are from the game’s own key art, title card, prints and phone frames (real renders, real fonts)</p>']
    o.append('<div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">')
    for src, k, c in F[:2]:
        o.append(f'<div class="fig"><img src="{src}"><div class="cap"><span class="k">{esc(k)}</span><br>{c}</div></div>')
    o.append('</div><div class="grid" style="grid-template-columns:repeat(4,minmax(0,1fr));margin-top:28px">')
    for src, k, c in F[2:]:
        o.append(f'<div class="fig"><img src="{src}"><div class="cap"><span class="k">{esc(k)}</span><br>{c}</div></div>')
    o.append('</div>')
    o.append('<p class="note" style="margin-top:26px">The look in one line: <b style="color:#efe9dc">a gentle, strange seaside town painted in gouache and coloured pencil, at the hour the light is low, with paper people and broken-tile mosaic.</b></p>')
    o.append('</div></body></html>')
    return '\n'.join(o)


PAL = [
    ('free', '#1d1a33', 'Ink', 'pencil line, lettering ink, the eggs'),
    ('free', '#2a55b8', 'Cobalt', 'wordmark, doors, tiles, lit sea'),
    ('free', '#234f96', 'Sea', 'evening water'),
    ('free', '#172d4e', 'Night sea', 'deep water, night'),
    ('free', '#4b4f8f', 'Dusk', 'blue-hour sky band'),
    ('free', '#7d6f98', 'Dusk violet', 'clouds, far haze'),
    ('free', '#9c4426', 'Brick', 'the rock on small marks: their one hot colour'),
    ('free', '#5e2a22', 'Brick shade', 'shade sides, hatched'),
    ('free', '#1f6b5a', 'Viridian', 'cypress, pines'),
    ('free', '#19ac8e', 'Turquoise', 'courtyard walls, tape, tiles'),
    ('free', '#8e2a22', 'Oxblood', 'stamps, caps labels'),
    ('free', '#6a3a8a', 'Plum', 'shutters, tiles, house in shade'),
    ('free', '#f3ead7', 'Paper', 'sketchbook page, notes'),
    ('free', '#fbf8f1', 'Tile white', 'houses, wordmark outline'),
    ('free', '#c4c0b8', 'Mortar', 'grout between broken tiles'),
    ('caution', '#df8029', 'Rock orange', 'the rock in sunset light (scene art only)'),
    ('caution', '#eab583', 'Sky peach', 'sky above the gold (scene art only)'),
    ('caution', '#c49a8c', 'Dusk rose', 'haze on islands (scene art only)'),
    ('guarded', '#e8653a', 'Coral', 'the shell “o”, traveller tops: lockup, cover, share card only'),
    ('guarded', '#fac97d', 'Sunset gold', 'the horizon glow: painted light, never a fill'),
    ('guarded', '#f2d06b', 'Lemon', 'straw hats, lemons, sheets: inside scenes only'),
    ('guarded', '#d9b24a', 'Brass', 'the in-game shutter: never in platform art'),
]


def board2(measure):
    o = [HEAD, '<div class="b"><h1>Caracolina · the rules of the look</h1><p class="sub">STAGE 1 · LINE · FILL · TEXTURE · PALETTE · LIGHT · LETTERING · NEVER</p>']
    o.append('<div class="grid" style="grid-template-columns:1.05fr 1fr;gap:40px">')
    # left: rules
    R = [
        ('Line', ['Coloured pencil in ink #1d1a33: a dark edge on silhouettes and creases, 1.2–2 px on small marks; never an even vector stroke.',
                  'Shade sides are hatched with pencil at about 38°, ink at 30–40 %; never cross-hatched to black.',
                  'Edges are hand-cut, with a slight wobble. Only the eggs and the shell spiral are true curves.']),
        ('Fill', ['Gouache: opaque flat colour in 2–3 values per surface (lit, mid, shade) with hard edges, plus dry-brush streaks on the lit face.',
                  'No airbrush gradients except the sky, and the sky is painted in bands.',
                  'Trencadís: broken tiles set in grey mortar, irregular pieces, a glaze glint on some.',
                  'People: flat cut-outs painted on both sides, a white paper edge, one big simple eye.']),
        ('Texture', ['Paper grain on everything at low strength; brush grain on walls; mosaic on benches, towers and frames.',
                     'Where the world is not yet painted, it is graphite pencil on paper (the opening of the game).',
                     'The sketchbook page: paper #f3ead7 with faint cobalt rules at 10 %.']),
        ('Light', ['A low sun from one side, long shadows, warm lit faces against cool cobalt shade.',
                   'Two hours define the world: sunset (18:45–19:00) and festival night (21:30–22:00).',
                   'Night is navy and violet with lamp points and dotted fireworks. It is the free-colour palette.',
                   'Small marks use the blue hour (cobalt to violet, one pale line of last light), so they stay clear of the platform’s sun.']),
        ('Lettering', ['Wordmark: Caprasimo in cobalt #2a55b8, a white tile outline #fbf8f1, a soft ink drop; the “o” is the coral shell spiral. It appears only on the title lockup, the share card and the cover.',
                       'Hand: Kalam in ink on torn paper strips, for captions and notes. Caps: Alegreya Sans ExtraBold in oxblood, for stamps.',
                       'No lettering on the poster or any plate that can shrink below ~200 px, and none on small marks.']),
        ('Never', ['Coral, lemon, brass or sunset gold as a flat fill, or near Play, a price or a selected state. Gold never means “earned”.',
                   'Numbers in art. Glow fog, lens flares, chrome or bevelled UI, sticker outlines.',
                   'Menace: no weapons, no violence, no horror. The town is gentle and strange.',
                   'Photo textures, real people’s faces, another game’s anything. The surreal motifs are the town’s own: eggs, the rock, the lighthouse on legs, the broken face.']),
    ]
    o.append('<div class="grid" style="grid-template-columns:1fr 1fr;gap:20px 30px">')
    for h, items in R:
        o.append('<div class="rule"><h3>' + h + '</h3><ul>' + ''.join('<li>' + esc(i) + '</li>' for i in items) + '</ul></div>')
    o.append('</div>')
    # right: palette
    o.append('<div><div class="rule"><h3>Palette, measured</h3><p class="note" style="margin:0 0 12px">ΔE2000 to ember · lilac · sun, from <span class="hex">tools/measure.py colour</span>. <b style="color:#efe9dc">Free</b>: anywhere. <b style="color:#efe9dc">Caution</b>: scene art only, kept 120 px from Play, prices and selected states. <b style="color:#efe9dc">Guarded</b>: painted light inside scene art, never a flat fill.</p>')
    o.append('<div class="grid" style="grid-template-columns:1fr 1fr;gap:10px 18px">')
    for band, hx, name, role in PAL:
        m = measure.get(hx, '')
        o.append(f'<div class="sw"><div class="chip" style="background:{hx}"></div><div><span class="hex">{hx}</span> · <b>{esc(name)}</b> <span class="band{" g" if band == "guarded" else ""}">{band}</span><br><span class="ro">{esc(role)}</span><br><span class="me">{esc(m)}</span></div></div>')
    o.append('</div></div>')
    o.append('<div class="rule" style="margin-top:22px"><h3>Lettering, as the game draws it</h3><div class="fig"><img src="img/L_lettering.jpg"></div><p class="note">Crop of the trailer’s title card: Caprasimo wordmark, Kalam line, Alegreya Sans caps.</p></div>')
    o.append('</div></div></div></body></html>')
    return '\n'.join(o)


def board3(light):
    o = [HEAD, '<div class="b"><h1>Caracolina · three pilots</h1><p class="sub">STAGE 1 · POSTER MASTER 2400×1200 · ICON-46 92×92 · STORE ITEM 400×400 · each shown with its checks</p>']
    o.append('<div class="rule"><h3>Poster master <span class="k">art/poster.png · 2400×1200 · 2:1</span></h3>'
             '<p class="note" style="margin:0 0 12px">A new 2:1 render in the key art’s light, framed for the plate. The rock stands centre-left, the house and egg lit, the lighthouse on legs on the right, El Caracol and the roofs bottom-left. No lettering. Focus (0.47, 0.45). The right edge’s lower two-thirds is sea (free): the hero’s Continue sits beside it.</p>'
             f'<div class="fig"><img src="img/poster_squint.png"></div><p class="note">Previews at 740×370 (outlined: the caption strip), 260×367, 150×177 and 90×70. At 90×70 it is still an orange cone with a house on it. Light: <span class="hex">{esc(light)}</span></p></div>')
    o.append('<div class="grid" style="grid-template-columns:1fr 1fr;gap:40px;margin-top:22px">')
    o.append('<div class="rule"><h3>icon-46 <span class="k">art/icon-46.png · 92×92 (+ .svg)</span></h3>'
             '<p class="note" style="margin:0 0 12px">Drawn for 46, not the poster shrunk. Last survivors: the floating rock (brick, the one hot colour), the white house with a cobalt door, the black egg, a cypress, the blue-hour sky. Free colours only: guarded 0.00 %, caution 0.48 % of pixels (lilac-side anti-alias).</p>'
             '<div class="fig"><img src="img/icon_checks.png"></div><p class="note">4× nearest; 1× at 46 and 30 on night and on linen, beside three plain catalogue squares.</p></div>')
    o.append('<div class="rule"><h3>store-trencadis-frame <span class="k">store/ · 400×400</span></h3>'
             '<p class="note" style="margin:0 0 12px">A look for your prints: they come out framed in broken tile. Drawn on the sketchbook page with turquoise tape; the print inside is the rock on festival night (a night print, so the tile beside the price stays free: guarded 0.02 %, caution 0.65 %, anti-alias only). PROPOSAL: the game has no print frames yet.</p>'
             '<div class="fig"><img src="img/store_checks.png"></div><p class="note">400 master; 40 px on night and linen; the greyscale test.</p></div>')
    o.append('</div></div></body></html>')
    return '\n'.join(o)


if __name__ == '__main__':
    meas = {}
    for line in open(os.path.join(S1, 'checks', 'measure_colour.txt')):
        p = line.strip().split(' ', 1)
        if len(p) == 2: meas[p[0]] = p[1]
    light = open(os.path.join(S1, 'checks', 'measure_light.txt')).read().strip().split(': ', 1)[1]
    open(os.path.join(BD, 'board1.html'), 'w').write(board1())
    open(os.path.join(BD, 'board2.html'), 'w').write(board2(meas))
    open(os.path.join(BD, 'board3.html'), 'w').write(board3(light))
    print('ok', light)
