"""check sheets for the update picture and the festival banner (check sheets only; nothing here ships)"""
import sys
from PIL import Image, ImageDraw
B = sys.argv[1]; W = sys.argv[2]
BG = (24, 22, 36)
# ---------- banner ----------
ban = Image.open(f'{B}/bug/events/festival-of-the-shell-banner.png').convert('RGB')
def plate(im):
    im = im.copy(); s = im.width / 1720
    ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    d.rectangle([0, 0, int(774 * s), im.height], fill=(20, 18, 42, 235))
    x0 = int(56 * s)
    d.rectangle([x0, int(70 * s), x0 + int(150 * s), int(96 * s)], outline=(200, 196, 220, 255), width=max(1, int(2 * s)))
    d.rectangle([x0, int(130 * s), x0 + int(470 * s), int(190 * s)], fill=(236, 232, 245, 255))
    for i, w in enumerate((600, 560, 380)):
        d.rectangle([x0, int((230 + i * 38) * s), x0 + int(w * s), int((248 + i * 38) * s)], fill=(150, 146, 175, 255))
    d.rectangle([x0, int(430 * s), x0 + int(320 * s), int(500 * s)], fill=(255, 90, 54, 255))   # Join (ember, platform)
    d.rectangle([x0 + int(350 * s), int(452 * s), x0 + int(560 * s), int(476 * s)], fill=(150, 146, 175, 255))
    im = im.convert('RGBA'); im.alpha_composite(ov); return im.convert('RGB')
disp = ban.resize((860, 300), Image.LANCZOS)
right = ban.crop((774, 0, 1720, 600)).resize((473, 300), Image.LANCZOS)
g = Image.open(f'{W}/guard_banner.png').convert('RGB').resize((860, 300), Image.NEAREST)
gd = ImageDraw.Draw(g); gd.line([(387, 0), (387, 300)], fill=(0, 200, 255), width=2)
S = Image.new('RGB', (1760, 980), BG)
S.paste(disp, (20, 20)); S.paste(plate(disp), (880, 20))
S.paste(right, (20, 340)); S.paste(plate(ban).resize((860, 300), Image.LANCZOS).crop((387, 0, 860, 300)), (513, 340))
S.paste(g, (880, 340))
# phone-ish: the right 55% as a narrow card at 300 px tall and at 150 px tall
S.paste(ban.crop((774, 0, 1720, 600)).resize((237, 150), Image.LANCZOS), (20, 660)); S.paste(disp.resize((430, 150), Image.LANCZOS), (280, 660))
S.save(f'{W}/check_banner.png')
# ---------- update ----------
m = Image.open(f'{B}/bug/updates/3.png').convert('RGB'); t = Image.open(f'{B}/bug/updates/3-thumb.png').convert('RGB')
m104 = m.resize((104, 52), Image.LANCZOS); t104 = t.resize((104, 52), Image.LANCZOS)
U = Image.new('RGB', (1700, 900), BG); d = ImageDraw.Draw(U)
U.paste(m.resize((800, 400), Image.LANCZOS), (20, 20))
d.rectangle([20 + 133, 20, 20 + 667, 420], outline=(0, 200, 255), width=1)   # central 4:3
U.paste(t, (840, 20)); U.paste(m.resize((308, 154), Image.LANCZOS), (1170, 20))
U.paste(t104, (840, 200)); U.paste(m104, (960, 200))
U.paste(t104.resize((416, 208), Image.NEAREST), (840, 270)); U.paste(m104.resize((416, 208), Image.NEAREST), (1270, 270))
a = Image.open(f'{W}/final_update/3_check_noturn.jpg').convert('RGB').resize((400, 200)); b = Image.open(f'{W}/final_update/3_check_turn.jpg').convert('RGB').resize((400, 200))
U.paste(a, (20, 440)); U.paste(b, (430, 440))
U.paste(Image.open(f'{W}/guard_3.png').convert('RGB').resize((400, 200), Image.NEAREST), (840, 500))
U.paste(Image.open(f'{W}/guard_3-thumb.png').convert('RGB').resize((308, 154), Image.NEAREST), (1250, 500))
U.save(f'{W}/check_update.png')
print('ok')
