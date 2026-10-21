"""check sheets for the stills (mock platform chrome is for checking only, never in the deliverables)
python3 -I checks.py key <key-still.png> <out.png>
python3 -I checks.py result <result-still.png> <out.png>
python3 -I checks.py gallery <out.png> <01.png> ... <06.png>"""
import sys, os
from PIL import Image, ImageDraw, ImageFont
F = '/tmp/claude-0/-home-claude/f5687e90-63e7-5f07-9dce-8a52b890766a/scratchpad/passB/pack/tools/fonts/'
def font(n, s): return ImageFont.truetype(F + n, s)
NIGHT, PANEL, LINE, TXT, MUT, EMBER, LILAC, SUN = (17, 14, 26), (27, 23, 38), (60, 55, 75), (236, 232, 226), (150, 146, 150), (255, 90, 54), (196, 181, 255), (255, 203, 87)
mode = sys.argv[1]

if mode == 'key':
    im = Image.open(sys.argv[2]).convert('RGB'); out = sys.argv[3]
    S = Image.new('RGB', (1180, 660), NIGHT); d = ImageDraw.Draw(S)
    d.text((24, 16), 'key-still.png at 1x (720x352)', font=font('GeistMono-Regular.ttf', 12), fill=MUT)
    S.paste(im, (24, 36))
    # mock Continue card on Home: 360x176 window + platform text + Continue button
    y0 = 410; d.rectangle((24, y0, 24 + 860, y0 + 196), fill=PANEL, outline=LINE)
    S.paste(im.resize((360, 176), Image.LANCZOS), (34, y0 + 10))
    d.text((410, y0 + 14), 'CONTINUE  ·  CARACOLINA', font=font('GeistMono-Regular.ttf', 11), fill=MUT)
    d.text((410, y0 + 34), 'Mock headline for the card', font=font('InstrumentSans-Bold.ttf', 24), fill=TXT)
    d.text((410, y0 + 68), 'mock place line', font=font('InstrumentSans-Bold.ttf', 13), fill=MUT)
    for i in range(30): d.rectangle((410 + i * 11, y0 + 160, 410 + i * 11 + 8, y0 + 168), fill=LILAC if i < 9 else LINE)
    d.rectangle((740, y0 + 140, 870, y0 + 176), fill=EMBER); d.text((768, y0 + 150), 'CONTINUE', font=font('GeistMono-Regular.ttf', 12), fill=NIGHT)
    # 132x66 on the game page / also-in-progress row, at 1x and at 3x hard pixels
    d.text((900, y0), '132x66', font=font('GeistMono-Regular.ttf', 12), fill=MUT)
    sm = im.resize((132, 66), Image.LANCZOS); S.paste(sm, (900, y0 + 20))
    S.paste(sm.resize((264, 132), Image.NEAREST), (900, y0 + 100))
    d.text((760, 16), '360x176 (Continue card window)', font=font('GeistMono-Regular.ttf', 12), fill=MUT)
    S.save(out)

elif mode == 'result':
    im = Image.open(sys.argv[2]).convert('RGB'); out = sys.argv[3]
    W = 900; S = Image.new('RGB', (W + 48, 700), NIGHT); d = ImageDraw.Draw(S)
    d.text((24, 16), 'SESSION OVER  ·  CARACOLINA   (mock platform chrome, check only)', font=font('GeistMono-Regular.ttf', 11), fill=MUT)
    d.text((24, 36), 'You kept 6 wishes.', font=font('InstrumentSans-Bold.ttf', 44), fill=TXT)
    pic = im.resize((W, round(W * im.height / im.width)), Image.LANCZOS); S.paste(pic, (24, 100))
    y = 100 + pic.height + 14
    for i, (n, l) in enumerate([('6', 'prints on the wall'), ('41 min', 'in town'), ('1', 'new seal')]):
        x = 24 + i * 300; d.text((x, y), n, font=font('InstrumentSans-Bold.ttf', 40), fill=TXT if i < 2 else NIGHT if False else TXT); d.text((x, y + 50), l, font=font('InstrumentSans-Bold.ttf', 14), fill=MUT)
    # the same picture with words printed over it (the platform may print over the art)
    y2 = y + 100; ov = pic.copy(); od = ImageDraw.Draw(ov, 'RGBA')
    od.rectangle((0, 0, W, 54), fill=(17, 14, 26, 110))
    od.text((16, 10), 'You kept 6 wishes.', font=font('InstrumentSans-Bold.ttf', 30), fill=TXT)
    od.text((16, ov.height - 34), '6 prints  ·  41 min  ·  +1 step', font=font('GeistMono-Regular.ttf', 16), fill=TXT)
    od.rectangle((W - 150, ov.height - 44, W - 14, ov.height - 12), fill=EMBER); od.text((W - 122, ov.height - 36), 'PLAY AGAIN', font=font('GeistMono-Regular.ttf', 13), fill=NIGHT)
    S.paste(ov, (24, y2))
    # middle 720 of 1600 marked
    mx0 = 24 + round(W * 440 / 1600); mx1 = 24 + round(W * 1160 / 1600)
    d.rectangle((mx0, 100, mx1, 100 + pic.height), outline=LILAC)
    d.text((mx0, 100 + pic.height + 2), 'middle 720x352', font=font('GeistMono-Regular.ttf', 10), fill=LILAC)
    S = S.crop((0, 0, S.width, y2 + ov.height + 24)); S.save(out)

elif mode == 'gallery':
    out = sys.argv[2]; files = sys.argv[3:]
    cw = 300; ch = 225; S = Image.new('RGB', (24 + len(files) * (cw + 16), 24 + 160 + ch + 70 + 60), NIGHT); d = ImageDraw.Draw(S)
    for i, f in enumerate(files):
        im = Image.open(f).convert('RGB'); x = 24 + i * (cw + 16)
        d.text((x, 6), os.path.basename(f), font=font('GeistMono-Regular.ttf', 11), fill=MUT)
        full = im.resize((cw, cw // 2), Image.LANCZOS); S.paste(full, (x, 24))
        c = im.crop((267, 0, 1333, 800)).resize((cw, ch), Image.LANCZOS); S.paste(c, (x, 24 + 160))
        d.text((x, 24 + 150 - 2), 'central 4:3', font=font('GeistMono-Regular.ttf', 9), fill=MUT)
        S.paste(im.resize((100, 50), Image.LANCZOS), (x, 24 + 160 + ch + 20))
        d.text((x + 108, 24 + 160 + ch + 36), '100 px', font=font('GeistMono-Regular.ttf', 9), fill=MUT)
        b = im.crop((0, 774, 1600, 800)).resize((cw, 5)); S.paste(b.resize((cw, 20), Image.NEAREST), (x, 24 + 160 + ch + 84))
        d.text((x, 24 + 160 + ch + 106), 'bottom 26 px', font=font('GeistMono-Regular.ttf', 9), fill=MUT)
    S.save(out)
