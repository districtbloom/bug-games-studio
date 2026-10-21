"""Mock the bug.games game-page hero over a backdrop (desktop 1440x577, phone 390x826), the way reference 04 / 07 lay it out.
usage: mock.py desktop|phone <backdrop.png> <poster.png> <out.png>"""
import sys
from PIL import Image, ImageDraw, ImageFont
mode, bd, po, out = sys.argv[1:5]
NIGHT = (21, 18, 28)
F = '/tmp/claude-0/-home-claude/abf4d099-0c77-5d2d-a155-12d3f9d77b55/scratchpad/packB/bug-games-design-pass-B/tools/fonts/InstrumentSans-Bold.ttf'
M = '/tmp/claude-0/-home-claude/abf4d099-0c77-5d2d-a155-12d3f9d77b55/scratchpad/packB/bug-games-design-pass-B/tools/fonts/GeistMono-Regular.ttf'
b = Image.open(bd).convert('RGB'); p = Image.open(po).convert('RGB')
if mode == 'desktop':
    W, H = 1440, 790
    page = Image.new('RGB', (W, H), NIGHT); d = ImageDraw.Draw(page)
    page.paste(b.resize((1440, 577), Image.LANCZOS), (0, 93))
    d.rectangle([0, 0, W, 56], fill=NIGHT); d.line([0, 56, W, 56], fill=(60, 55, 70))
    d.text((80, 18), 'bug', font=ImageFont.truetype(F, 22), fill=(240, 236, 230))
    # poster card 73..918 x 110..610: image 845x425, thumb strip below
    d.rectangle([73, 110, 918, 610], fill=(16, 14, 22), outline=(80, 74, 92))
    page.paste(p.resize((843, 423), Image.LANCZOS), (74, 111))
    for i in range(3):
        page.paste(p.resize((110, 55), Image.LANCZOS), (85 + i * 116, 548))
    d.text((630, 568), 'KEY ART · THE FOR YOU POSTER', font=ImageFont.truetype(M, 11), fill=(200, 195, 210))
    # info rail 935..1367 x 110..647
    d.rectangle([935, 110, 1367, 647], fill=(22, 19, 30), outline=(80, 74, 92))
    d.text((1024, 160), 'Perlune', font=ImageFont.truetype(F, 40), fill=(240, 236, 230))
    d.rectangle([1023, 288, 1100, 308], fill=(0x7F, 0xE3, 0xC0)); d.rectangle([1240, 368, 1328, 400], outline=(240, 236, 230))
    d.rectangle([1055, 425, 1150, 520], outline=(0xC4, 0xB5, 0xFF), width=2)
    # bottom bar with Play
    d.rectangle([0, 670, W, H], fill=NIGHT); d.line([0, 670, W, 670], fill=(60, 55, 70))
    d.rectangle([558, 688, 748, 740], fill=(0xFF, 0x5A, 0x36)); d.text((610, 704), '▶ CONTINUE', font=ImageFont.truetype(M, 13), fill=(30, 10, 5))
else:
    W, H = 390, 1000
    page = Image.new('RGB', (W, H), NIGHT); d = ImageDraw.Draw(page)
    page.paste(b.resize((390, 826), Image.LANCZOS), (0, 52))
    d.rectangle([0, 0, W, 51], fill=NIGHT); d.text((16, 14), 'bug', font=ImageFont.truetype(F, 20), fill=(240, 236, 230))
    page.paste(p.resize((390, 293), Image.LANCZOS) if False else p.resize((586, 293), Image.LANCZOS).crop((98, 0, 488, 293)), (0, 52))
    d.rectangle([8, 357, 382, 608], fill=(22, 19, 30), outline=(80, 74, 92))
    d.text((82, 405), 'Perlune', font=ImageFont.truetype(F, 30), fill=(240, 236, 230))
    d.rectangle([82, 515, 156, 535], fill=(0x7F, 0xE3, 0xC0))
    d.rectangle([16, 620, 334, 660], fill=(22, 19, 30), outline=(80, 74, 92))
    d.rectangle([16, 686, 270, 738], fill=(0xFF, 0x5A, 0x36)); d.text((95, 704), '▶ CONTINUE', font=ImageFont.truetype(M, 12), fill=(30, 10, 5))
page.save(out)
