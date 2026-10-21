"""check sheets for the store and pass art: python3 -I check.py <outdir> <sheetdir>"""
import sys, os
from PIL import Image, ImageDraw, ImageOps
D, S = sys.argv[1], sys.argv[2]
os.makedirs(S, exist_ok=True)
NIGHT, LINEN = (20, 17, 29), (239, 233, 220)
MINT, LILAC, SUN, EMBER = (127, 227, 192), (196, 181, 255), (255, 203, 87), (255, 90, 54)
STORE = ['paper-dove', 'fisherman-beret', 'sea-glass-tape', 'deckle-edge', 'shell-stamp']
REW = [('tape-plum', 'free'), ('sticker-black-egg', 'free'), ('postcard-stamp-lighthouse', 'free'), ('chalk-steps', 'free'),
       ('paper-gull', 'pass'), ('sailor-stripes', 'pass'), ('paper-lantern', 'pass'), ('tidemark-border', 'pass'), ('keeper-cap', 'bug')]
def op(p): return Image.open(os.path.join(D, p)).convert('RGBA')
def sz(im, w, h=None): return im.resize((w, h or round(im.height * w / im.width)), Image.LANCZOS)

# 1. store tiles: at 40 px on night and on linen, silhouette (black fill of the item) and greyscale
cols = [('40 on night', NIGHT), ('40 on linen', LINEN)]
W = 12 + len(STORE) * 190; sheet = Image.new('RGB', (W, 12 + 5 * 190), NIGHT); d = ImageDraw.Draw(sheet)
for i, k in enumerate(STORE):
    t = op(f'store/{k}.png'); it = op(f'layers/store-{k}-item.png'); x0 = 12 + i * 190
    # row 0: 169 (page size)
    sheet.paste(sz(t, 169), (x0, 12))
    # row 1: 40 px on night and on linen, and 1x40 enlarged x3 (hard pixels)
    sheet.paste(sz(t, 40), (x0, 200)); bg = Image.new('RGB', (56, 56), LINEN); bg.paste(sz(t, 40), (8, 8)); sheet.paste(bg, (x0 + 50, 192))
    sheet.paste(sz(t, 40).resize((120, 120), Image.NEAREST), (x0 + 30, 262))
    # row 2: silhouette of the item (black fill), at 120 and 40
    a = it.split()[3]; sil = Image.new('RGB', it.size, (255, 255, 255)); sil.paste((0, 0, 0), mask=a)
    sheet.paste(sz(sil, 120), (x0, 392)); sheet.paste(sz(sil, 40), (x0 + 128, 392))
    # row 3: greyscale at 120 and 40
    g = ImageOps.grayscale(t.convert('RGB')).convert('RGB')
    sheet.paste(sz(g, 120), (x0, 580)); sheet.paste(sz(g, 40), (x0 + 128, 580))
    # row 4: the owned mark (held) at 120 and 40
    tile = t.copy(); tile.alpha_composite(op('reward-held.png')); sheet.paste(sz(tile, 120), (x0, 770)); sheet.paste(sz(tile, 40), (x0 + 128, 770))
sheet.save(os.path.join(S, 'store-check.png'))

# 2. pass tile at 40, 80, 120, 169 on night and on linen
t = op('pass/tile.png'); sheet = Image.new('RGB', (12 + 40 + 80 + 120 + 169 + 48, 2 * 190 + 12), NIGHT)
for r, bg in enumerate([NIGHT, LINEN]):
    ImageDraw.Draw(sheet).rectangle([0, r * 190, sheet.width, r * 190 + 190], fill=bg); x = 12
    for s in (40, 80, 120, 169): sheet.paste(sz(t, s), (x, r * 190 + 10)); x += s + 12
sheet.save(os.path.join(S, 'pass-tile-sizes.png'))

# 3. the rail: rewards on their grounds at 120 px with the platform's mock states
grounds = {k: op(f'pass/ground-{k}.png') for k in ('free', 'pass', 'bug')}
cw, ch = 120, round(120 * 243 / 306); pad = 14
rows = [('free', [r for r in REW if r[1] == 'free']), ('pass', [r for r in REW if r[1] == 'pass']), ('bug', [r for r in REW if r[1] == 'bug'])]
sheet = Image.new('RGB', (pad + 5 * (cw + pad) + 160, pad + 3 * (ch + pad) + 40), NIGHT); d = ImageDraw.Draw(sheet)
states = ['owned', 'owned', 'next', 'locked']
for ri, (tier, items) in enumerate(rows):
    y = pad + ri * (ch + pad)
    for ci, (k, _) in enumerate(items):
        x = pad + ci * (cw + pad); g = grounds[tier].copy(); g.alpha_composite(op(f'pass/{k}.png')); sheet.paste(sz(g, cw, ch), (x, y))
        st = states[ci] if tier != 'bug' else 'next'
        if st == 'owned': d.rectangle([x - 3, y - 3, x + cw + 2, y + ch + 2], outline=MINT, width=3); d.ellipse([x + cw - 18, y + ch - 18, x + cw - 4, y + ch - 4], fill=MINT)
        if st == 'next': d.rectangle([x - 3, y - 3, x + cw + 2, y + ch + 2], outline=LILAC, width=3)
        if tier == 'bug': d.rectangle([x - 6, y - 6, x + cw + 5, y + ch + 5], outline=SUN, width=2)
    # the same ground shown bare at the row's end
    sheet.paste(sz(grounds[tier], cw, ch), (pad + 4 * (cw + pad) + 20, y))
sheet.save(os.path.join(S, 'rail-rewards-120.png'))

# every reward on all three grounds at 120 (legibility on any ground)
sheet = Image.new('RGB', (pad + 9 * (cw + pad), pad + 3 * (ch + pad)), NIGHT)
for ci, (k, _) in enumerate(REW):
    for ri, tier in enumerate(('free', 'pass', 'bug')):
        g = grounds[tier].copy(); g.alpha_composite(op(f'pass/{k}.png')); sheet.paste(sz(g, cw, ch), (pad + ci * (cw + pad), pad + ri * (ch + pad)))
sheet.save(os.path.join(S, 'rewards-all-grounds-120.png'))

# 4. the marker on a mock rail (30 cells), next and held, at 1x and 3x
def rail(pose, held_at=12):
    im = Image.new('RGBA', (30 * 16 + 40, 80), NIGHT + (255,)); d = ImageDraw.Draw(im)
    for i in range(30):
        x = 20 + i * 16; c = (124, 92, 220) if i < held_at else ((196, 181, 255) if i == held_at else (52, 46, 70))
        d.rectangle([x, 56, x + 12, 64], fill=c)
    m = op(f'marker-{pose}.png'); cx = 20 + (held_at - 1 if pose == 'held' else held_at) * 16 + 6
    im.alpha_composite(m, (cx - 24, 56 - 48 + 2))
    return im
r1, r2 = rail('next'), rail('held')
sheet = Image.new('RGB', (r1.width * 3 + 24, 80 * 2 + 80 * 3 * 2 + 40), NIGHT)
sheet.paste(r1, (12, 0)); sheet.paste(r2, (12, 80))
cx = 20 + 12 * 16
sheet.paste(r1.crop((cx - 120, 0, cx + 120, 80)).resize((720, 240), Image.NEAREST), (12, 170))
sheet.paste(r2.crop((cx - 120, 0, cx + 120, 80)).resize((720, 240), Image.NEAREST), (12, 420))
sheet.save(os.path.join(S, 'marker-rail.png'))
# markers alone on night and on linen, 1x and 4x
sheet = Image.new('RGB', (2 * (48 + 12) + 2 * (192 + 12) + 12, 2 * 204 + 12), NIGHT)
for r, bg in enumerate([NIGHT, LINEN]):
    ImageDraw.Draw(sheet).rectangle([0, r * 204, sheet.width, r * 204 + 204], fill=bg)
    for i, pose in enumerate(('next', 'held')):
        m = op(f'marker-{pose}.png'); b = Image.new('RGBA', m.size, bg + (255,)); b.alpha_composite(m)
        sheet.paste(b, (12 + i * 60, r * 204 + 12)); sheet.paste(b.resize((192, 192), Image.NEAREST), (132 + i * 204, r * 204 + 6))
sheet.save(os.path.join(S, 'marker-poses.png'))

# 5. the owned mark played on a store tile: p = 0, .3, .6, 1 at 169, and held at 40
fr = ['0', '0.3', '0.6', '1']
sheet = Image.new('RGB', (12 + 4 * 181 + 60, 169 + 24), NIGHT)
for i, p in enumerate(fr):
    tile = op('store/shell-stamp.png'); tile.alpha_composite(op(f'frames/owned-{p}.png')); sheet.paste(sz(tile, 169), (12 + i * 181, 12))
tile = op('store/shell-stamp.png'); tile.alpha_composite(op('reward-held.png')); sheet.paste(sz(tile, 40), (12 + 4 * 181, 12))
sheet.save(os.path.join(S, 'owned-mark-frames.png'))
print('ok')
