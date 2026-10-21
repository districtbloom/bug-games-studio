"""Compose the six gallery slides from fresh captures of the running build (work/stills/cap2, cap3).
Each slide is one captured frame, cropped to 2:1 in stage coordinates and resampled (Lanczos) to 1600x800.
Nothing is added: no text, arrows, badges or frames. Run: python3 work/stills/compose_gallery.py
"""
import os, json
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.environ.get('GOUT', '/home/claude/designpass/bug/gallery')
# (slide, source frame, clip origin of that frame in stage px, device scale, crop x0, y0, width) -- height = width / 2
SLIDES = json.load(open(os.path.join(HERE, 'slides.json')))


def make(s):
    src = os.path.join(HERE, s['src'])
    im = Image.open(src).convert('RGB')
    ox, oy = s.get('origin', [0, 0]); d = s['dpr']
    x0, y0, w = s['crop']; h = w / 2
    box = [round((x0 - ox) * d), round((y0 - oy) * d), round((x0 - ox + w) * d), round((y0 - oy + h) * d)]
    assert box[0] >= 0 and box[1] >= 0 and box[2] <= im.width and box[3] <= im.height, (s['n'], box, im.size)
    c = im.crop(box)
    up = 1600 / c.width
    out = c.resize((1600, 800), Image.LANCZOS)
    os.makedirs(OUT, exist_ok=True)
    p = os.path.join(OUT, f"{s['n']:02d}.png"); out.save(p, optimize=True)
    print(f"{p}: from {s['src']} crop {box} ({c.width}x{c.height} px, x{up:.2f})")


if __name__ == '__main__':
    for s in SLIDES: make(s)
