"""Mock the game-page hero over a backdrop (desktop, after reference 04; phone, after reference 07).
python3 -I pagecheck.py <poster.png> <backdrop.png> <backdrop-phone.png> <out-desktop.png> <out-phone.png>"""
import sys
from PIL import Image, ImageDraw
poster, bd, bdp, outd, outp = sys.argv[1:6]
P = Image.open(poster).convert('RGB')
INK = (29, 26, 51); PANEL = (24, 21, 34)
# desktop: nav 57 px, backdrop 1440x577 under it, hero in a 1280 column
W, H = 1440, 790
page = Image.new('RGB', (W, H), (21, 18, 30))
B = Image.open(bd).convert('RGB').resize((1440, 577), Image.LANCZOS)
page.paste(B, (0, 57))
d = ImageDraw.Draw(page, 'RGBA')
d.rectangle((0, 0, W, 56), fill=(21, 18, 30, 255)); d.line((0, 56, W, 56), fill=(60, 56, 80, 255))
for i, t in enumerate(['HOME', 'DISCOVER', 'FRIENDS']): d.text((158 + i * 75, 22), t, fill=(200, 196, 220, 255))
d.rounded_rectangle((778, 10, 916, 45), 2, outline=(196, 181, 255, 255)); d.rectangle((1239, 11, 1319, 44), outline=(80, 76, 100, 255))
d.ellipse((1326, 11, 1360, 45), fill=(110, 80, 200, 255))
col0, colw = 80, 1280
pw = colw * 8 // 12 - 3; ph = pw // 2
py = 57 + 53
d.text((col0 + 8, 88), 'DISCOVER / CARACOLINA', fill=(200, 196, 220, 255))
d.rectangle((col0 - 6, py - 6, col0 + pw + 5, py + ph + 5 + 70), fill=INK + (255,))
page.paste(P.resize((pw, ph), Image.LANCZOS), (col0, py))
d.rectangle((col0, py + ph + 6, col0 + pw - 1, py + ph + 70), fill=PANEL + (235,))
for k in range(3): d.rectangle((col0 + 6 + k * 116, py + ph + 12, col0 + 116 + k * 116, py + ph + 64), fill=(50, 46, 70, 255))
rx = col0 + pw + 6
d.rectangle((rx, py - 6, col0 + colw, py + 537), fill=PANEL + (238,), outline=(70, 66, 90, 255))
d.rectangle((rx + 24, py + 24, rx + 88, py + 88), fill=(60, 56, 90, 255))
d.text((rx + 100, py + 40), 'Caracolina', fill=(243, 234, 215, 255))
for k in range(4): d.rectangle((rx + 24 + k * 98, py + 300, rx + 112 + k * 98, py + 390), fill=(50, 46, 70, 255))
d.rectangle((0, 672, W, H), fill=(21, 18, 30, 255)); d.line((0, 672, W, 672), fill=(60, 56, 80, 255))
d.rectangle((558, 688, 748, 740), fill=(255, 90, 54, 255)); d.text((620, 707), 'CONTINUE', fill=(29, 26, 51, 255))
page.save(outd)
# phone: 390 wide, header 52, backdrop 390x826 under it; poster as a 4:3 crop round the focus
W2, H2 = 390, 960
ph2 = Image.new('RGB', (W2, H2), (21, 18, 30))
Bp = Image.open(bdp).convert('RGB').resize((390, 826), Image.LANCZOS)
ph2.paste(Bp, (0, 52))
d = ImageDraw.Draw(ph2, 'RGBA')
d.rectangle((0, 0, W2, 51), fill=(21, 18, 30, 255))
fx = .655; cw = P.height * 4 // 3; x0 = int(min(max(fx * P.width - cw / 2, 0), P.width - cw))
crop = P.crop((x0, 0, x0 + cw, P.height)).resize((390, 292), Image.LANCZOS)
ph2.paste(crop, (0, 52))
for k in range(3): d.rectangle((212 + k * 58, 304, 266 + k * 58, 340), fill=(50, 46, 70, 255))
d.rectangle((8, 357, 382, 608), fill=PANEL + (240,), outline=(70, 66, 90, 255))
d.text((84, 410), 'Caracolina', fill=(243, 234, 215, 255))
d.rectangle((16, 620, 374, 668), fill=PANEL + (250,))
d.rectangle((0, 680, 270, 730), fill=(255, 90, 54, 255)); d.text((100, 700), 'CONTINUE', fill=(29, 26, 51, 255))
d.rectangle((0, 760, W2, H2), fill=(21, 18, 30, 200))
ph2.save(outp)
