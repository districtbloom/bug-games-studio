"""Lantern Night banner checks: (1) the left 45% covered, the right 55% alone; (2) a mock of the platform's event card
(after reference 05/08: copy + Join on the left part) at the shown size 860x300 and at 2x. The mock's words are the
proposal's own line from design.json; count and dates are UNDECIDED, so they show as '···'. The Join button is drawn
as the platform's (ember), only in this mock: the banner art itself has no button or lettering."""
from PIL import Image, ImageDraw, ImageFont

F = '/tmp/claude-0/-home-claude/abf4d099-0c77-5d2d-a155-12d3f9d77b55/scratchpad/packB/bug-games-design-pass-B/tools/fonts/'
B = '/home/claude/passB/bug/events/lantern-night-banner.png'
W_ = '/home/claude/passB/work/store/'
art = Image.open(B).convert('RGB')
bold = lambda s: ImageFont.truetype(F + 'InstrumentSans-Bold.ttf', s)
mono = lambda s: ImageFont.truetype(F + 'GeistMono-Regular.ttf', s)


def mock(scale):
    w, h = 860 * scale, 300 * scale
    im = art.resize((w, h), Image.LANCZOS)
    d = ImageDraw.Draw(im)
    s = scale
    x0, y0 = 28 * s, 30 * s
    # LIVE EVENT chip (platform chrome)
    d.rectangle([x0, y0, x0 + 96 * s, y0 + 18 * s], outline=(200, 196, 210), width=s)
    d.ellipse([x0 + 7 * s, y0 + 6 * s, x0 + 13 * s, y0 + 12 * s], fill=(255, 90, 54))
    d.text((x0 + 18 * s, y0 + 3 * s), 'LIVE EVENT', font=mono(10 * s), fill=(220, 216, 230))
    d.text((x0, y0 + 32 * s), 'Lantern Night', font=bold(30 * s), fill=(244, 240, 250))
    line = ["The Eclipse's shadow falls on every world.", 'Carry your light. Wake worlds together.']
    for i, t in enumerate(line):
        d.text((x0, y0 + 76 * s + i * 19 * s), t, font=bold(13 * s), fill=(196, 190, 210))
    d.text((x0, y0 + 160 * s), '···  SO FAR  ·  ENDS IN ···', font=mono(10 * s), fill=(170, 164, 186))
    # Join (the platform's own button, ember = Play/Join)
    bx, by = x0, y0 + 186 * s
    d.rectangle([bx, by, bx + 150 * s, by + 40 * s], fill=(255, 90, 54))
    d.text((bx + 36 * s, by + 13 * s), 'JOIN EVENT', font=mono(12 * s), fill=(20, 12, 10))
    return im


m1 = mock(1); m1.save(W_ + 'banner-mock-860.png')
m2 = mock(2); m2.save(W_ + 'banner-mock-1720.png')
# cover check board
cov = art.copy(); d = ImageDraw.Draw(cov); d.rectangle([0, 0, int(1720 * 0.45), 600], fill=(40, 38, 48))
right = art.crop((int(1720 * 0.45), 0, 1720, 600))
board = Image.new('RGB', (1720, 600 + 20 + 600 + 20 + 300), (20, 17, 28))
board.paste(cov, (0, 0)); board.paste(m2, (0, 620))
board.paste(right.resize((right.width // 2, 300), Image.LANCZOS), (0, 1240))
board.paste(m1, (right.width // 2 + 20, 1240))
board.save(W_ + 'banner-board.png')
print('ok')
