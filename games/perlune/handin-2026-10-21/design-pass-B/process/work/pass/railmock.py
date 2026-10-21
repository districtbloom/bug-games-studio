"""Rail mock (work file, not a deliverable): the three row grounds and the rewards at the size the page shows them,
with the platform's states drawn over them: mint #7FE3C0 owned check, lilac #C4B5FF selected outline, sun #FFCB57 bug.pass
outline, and the marker in both poses. Platform chrome here is a stand-in drawn with the pack's board fonts."""
from PIL import Image, ImageDraw, ImageFont
B = '/home/claude/passB/bug/'
FD = '/tmp/claude-0/-home-claude/abf4d099-0c77-5d2d-a155-12d3f9d77b55/scratchpad/packB/bug-games-design-pass-B/tools/fonts/'
mono = ImageFont.truetype(FD + 'GeistMono-Regular.ttf', 11); bold = ImageFont.truetype(FD + 'InstrumentSans-Bold.ttf', 15)
BG, PANEL, LINE, INK, MUTED = (18, 15, 26), (27, 23, 38), (60, 54, 78), (242, 236, 247), (150, 140, 170)
MINT, LILAC, SUN = (127, 227, 192), (196, 181, 255), (255, 203, 87)
CW, CH = 120, 95
def cell(name):
    return Image.open(B + 'pass/' + name + '.png').convert('RGB').resize((CW, CH), Image.LANCZOS)
rows = [('FREE', 'ground-free', {1: 'mote-trail', 3: 'pearl-crest'}),
        ('PASS', 'ground-pass', {2: 'nacre-skin', 3: 'prism-halo', 5: 'ringlet'}),
        ('BUG.PASS', 'ground-bug', {4: 'eclipse-blink'})]
def rail(pose, earned=2, nxt=3, y0=0, im=None):
    d = ImageDraw.Draw(im)
    X0 = 110
    d.text((24, y0), ('Pearl Orbit  ·  marker: ' + pose).upper(), font=mono, fill=MUTED)
    y = y0 + 24
    for lab, g, rw in rows:
        d.text((24, y + CH // 2 - 6), lab, font=mono, fill=MUTED)
        for s in range(1, 7):
            x = X0 + (s - 1) * (CW + 10)
            im.paste(cell(rw.get(s, g)), (x, y))
            if lab == 'BUG.PASS': d.rectangle([x - 1, y - 1, x + CW, y + CH], outline=SUN, width=2)
            if s == nxt and lab != 'BUG.PASS' and s in rw: d.rectangle([x - 2, y - 2, x + CW + 1, y + CH + 1], outline=LILAC, width=2)
            if s <= earned and lab != 'BUG.PASS':  # owned: the platform's mint check in the corner
                d.ellipse([x + CW - 22, y + 4, x + CW - 6, y + 20], fill=MINT); d.line([x + CW - 18, y + 12, x + CW - 15, y + 16, x + CW - 9, y + 8], fill=(18, 15, 26), width=2)
        y += CH + 10
    # step strip under the rows: the platform's step cells, the marker riding on it
    d.text((24, y + 6), 'STEPS', font=mono, fill=MUTED)
    for s in range(1, 7):
        x = X0 + (s - 1) * (CW + 10); col = LILAC if s <= earned else LINE
        d.rectangle([x, y + 8, x + CW, y + 14], fill=col)
    mk = Image.open(B + ('marker-next.png' if pose == 'next' else 'marker-held.png'))
    s = nxt if pose == 'next' else earned
    x = X0 + (s - 1) * (CW + 10) + CW // 2 - 24
    im.alpha_composite(mk, (x, y + 11 - 24 - (14 if pose == 'next' else 0)))
    # the same at 24 px (Continue / result size)
    m24 = mk.resize((24, 24), Image.LANCZOS)
    return y + 40
W, H = 110 + 6 * (CW + 10) + 30, 2 * (24 + 3 * (CH + 10) + 50) + 40
im = Image.new('RGBA', (W, H), BG + (255,))
y = rail('next', y0=16, im=im); rail('held', y0=y + 12, im=im)
im.save('/home/claude/passB/work/pass/rail-mock.png'); print(im.size)

# compact rail: the Continue card / session result strip, 30 cells, marker at 48 and 24 px
c = Image.new('RGBA', (700, 210), BG + (255,)); d = ImageDraw.Draw(c)
for row, (pose, sz) in enumerate([('next', 48), ('held', 48), ('next', 24), ('held', 24)]):
    yy = 40 + row * 45 if sz == 48 else 40 + row * 45
    d.text((16, yy - 4), f'{pose} {sz}px', font=mono, fill=MUTED)
    for i in range(30):
        x = 120 + i * 18; d.rectangle([x, yy, x + 13, yy + 7], fill=LILAC if i < 13 else LINE)
    mk = Image.open(B + ('marker-next.png' if pose == 'next' else 'marker-held.png'))
    if sz != 48: mk = mk.resize((sz, sz), Image.LANCZOS)
    i = 13 if pose == 'next' else 12; x = 120 + i * 18 + 7 - sz // 2
    c.alpha_composite(mk, (x, yy + 4 - sz // 2 - (sz // 4 if pose == 'next' else 0)))
c.save('/home/claude/passB/work/pass/rail-compact.png')
