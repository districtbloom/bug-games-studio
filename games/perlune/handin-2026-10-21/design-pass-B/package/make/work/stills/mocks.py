#!/usr/bin/env python3
"""Check boards for the stills group (the mock's words are for the check only; they are never in the pictures).
  continue: key-still inside a Continue card at 360x176 (Home) and at 132x66 (game page), modelled on reference 13
  result:   result-still behind a session-result headline and numbers, modelled on reference 14
  gallery:  each slide at 100 px wide, and cropped to its central 4:3 (plus the bottom 26 px marked)
"""
import sys, os, json
from PIL import Image, ImageDraw, ImageFont
F = '/tmp/claude-0/-home-claude/abf4d099-0c77-5d2d-a155-12d3f9d77b55/scratchpad/packB/bug-games-design-pass-B/tools/fonts/'
BOLD = F + 'InstrumentSans-Bold.ttf'; MONO = F + 'GeistMono-Regular.ttf'
NIGHT = (24, 19, 34); CARD = (34, 28, 48); LINE = (60, 52, 80); TXT = (238, 232, 246); DIM = (150, 140, 170)
EMBER = (255, 90, 54); LILAC = (196, 181, 255); SUN = (255, 203, 87); MINT = (127, 227, 192)
W = '/home/claude/passB/work/stills/'
f = lambda p, s: ImageFont.truetype(p, s)


def cont(still, out):
    im = Image.open(still).convert('RGB')
    B = Image.new('RGB', (1000, 520), NIGHT); d = ImageDraw.Draw(B)
    d.text((40, 24), 'Pick up where you left off', font=f(BOLD, 22), fill=TXT)
    # Home card: window 360x176 on the left
    x, y = 40, 70; d.rectangle([x, y, x + 900, y + 200], fill=CARD, outline=LINE)
    B.paste(im.resize((360, 176), Image.LANCZOS), (x + 12, y + 12))
    d.text((x + 392, y + 18), 'CONTINUE  ·  PERLUNE', font=f(MONO, 12), fill=DIM)
    d.text((x + 392, y + 38), 'The dunes are waiting', font=f(BOLD, 24), fill=TXT)
    d.text((x + 392, y + 72), 'Ferrum Dunes · harvest', font=f(MONO, 13), fill=DIM)
    d.text((x + 392, y + 150), 'PASS', font=f(MONO, 11), fill=DIM)
    for i in range(30): d.rectangle([x + 392 + i * 11, y + 168, x + 400 + i * 11, y + 176], fill=LILAC if i < 9 else LINE)
    d.rectangle([x + 750, y + 140, x + 884, y + 178], fill=EMBER); d.text((x + 772, y + 150), '▶ CONTINUE', font=f(MONO, 13), fill=(30, 10, 5))
    # game page: 132x66
    x, y = 40, 300; d.text((x, y), 'game page · 132x66', font=f(MONO, 12), fill=DIM)
    d.rectangle([x, y + 22, x + 420, y + 22 + 90], fill=CARD, outline=LINE)
    B.paste(im.resize((132, 66), Image.LANCZOS), (x + 12, y + 34))
    d.text((x + 160, y + 40), 'Your place', font=f(BOLD, 18), fill=TXT); d.text((x + 160, y + 66), 'Ferrum Dunes', font=f(MONO, 12), fill=DIM)
    # 1x crops at true size, and a 4x of the 132 version
    small = im.resize((132, 66), Image.LANCZOS)
    B.paste(small.resize((528, 264), Image.NEAREST), (460, 240))
    B.save(out)


def result(still, out):
    im = Image.open(still).convert('RGB')
    B = Image.new('RGB', (980, 520), NIGHT); d = ImageDraw.Draw(B)
    x, y = 40, 30; d.rectangle([x, y, x + 900, y + 470], fill=CARD, outline=LINE)
    d.text((x + 40, y + 16), 'SESSION OVER  ·  PERLUNE', font=f(MONO, 12), fill=DIM)
    d.text((x + 680, y + 16), '✓ PROGRESS SAVED', font=f(MONO, 12), fill=MINT)
    d.text((x + 40, y + 40), 'You woke ', font=f(BOLD, 46), fill=TXT)
    w = d.textlength('You woke ', font=f(BOLD, 46)); d.text((x + 40 + w, y + 40), '2 worlds.', font=f(BOLD, 46), fill=LILAC)
    B.paste(im.resize((800, 176), Image.LANCZOS), (x + 50, y + 108))
    d.rectangle([x + 50, y + 108, x + 850, y + 284], outline=LINE)
    d.text((x + 60, y + 300), '23', font=f(BOLD, 44), fill=TXT); d.text((x + 60, y + 352), 'forms grown', font=f(MONO, 13), fill=DIM)
    d.text((x + 330, y + 300), '41 s', font=f(BOLD, 44), fill=TXT); d.text((x + 330, y + 352), 'in the heart fight', font=f(MONO, 13), fill=DIM)
    d.rectangle([x + 600, y + 300, x + 850, y + 380], fill=SUN); d.text((x + 615, y + 345), 'New achievement', font=f(MONO, 13), fill=(40, 30, 10))
    d.rectangle([x + 680, y + 410, x + 850, y + 450], fill=EMBER); d.text((x + 735, y + 422), '▶ PLAY', font=f(MONO, 13), fill=(30, 10, 5))
    # guide: middle 720 of 1600 = middle 360 of 800
    d.rectangle([x + 50 + 220, y + 108, x + 50 + 580, y + 284], outline=(90, 90, 110))
    B.save(out)


def gallery(files, out):
    cols = []
    for p in files:
        im = Image.open(p).convert('RGB'); Wd, H = im.size
        a = im.resize((100, 50), Image.LANCZOS)
        cw = H * 4 // 3; x0 = (Wd - cw) // 2; c = im.crop((x0, 0, x0 + cw, H)).resize((240, 180), Image.LANCZOS)
        full = im.resize((480, 240), Image.LANCZOS); dd = ImageDraw.Draw(full)
        dd.rectangle([(480 - 320) // 2, 0, (480 + 320) // 2 - 1, 239], outline=(255, 255, 255)); dd.line([0, 240 - 8, 480, 240 - 8], fill=(255, 60, 60))
        cols.append((a, c, full, os.path.basename(p)))
    B = Image.new('RGB', (40 + 100 + 20 + 240 + 20 + 480 + 40, 40 + len(cols) * 200), NIGHT); d = ImageDraw.Draw(B)
    for i, (a, c, full, n) in enumerate(cols):
        y = 30 + i * 200
        d.text((40, y - 18), n, font=f(MONO, 12), fill=DIM)
        B.paste(a, (40, y + 10)); B.paste(c, (160, y)); B.paste(full, (420, y - 20 if False else y))
    B.save(out)


if __name__ == '__main__':
    k = sys.argv[1]
    if k == 'continue': cont(sys.argv[2], sys.argv[3])
    elif k == 'result': result(sys.argv[2], sys.argv[3])
    elif k == 'gallery': gallery(sys.argv[3:], sys.argv[2])
