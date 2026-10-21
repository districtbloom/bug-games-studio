"""check strips: all seals x three states, at 32 and 64 px (and 96 for a close look), on night and linen.
python3 -I strip.py <seal dir> <out dir>"""
import sys, os
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
ORDER = ['one-photograph', 'sheets-in-the-air', 'two-in-one-picture', 'lluna-in-the-air', 'the-lamp-on-legs', 'the-lemon-squeezes',
         'the-face-made-whole', 'doves-round-the-tower', 'the-sun-on-the-shell', 'the-egg-hatches', 'tinta-in-every-quarter',
         'the-wall-is-full', 'festival-of-the-shell']
STATES = ['earned', 'progress', 'locked']
BGS = {'night': (11, 9, 16), 'linen': (241, 236, 228)}


def strip(size, gap, scale=1):
    n = len(ORDER)
    W = n * (size + gap) + gap
    Hh = len(STATES) * (size + gap) + gap
    sheet = Image.new('RGB', (W, Hh * 2 + gap), (128, 128, 128))
    for bi, (bn, bg) in enumerate(BGS.items()):
        panel = Image.new('RGB', (W, Hh), bg)
        for si, st in enumerate(STATES):
            for i, name in enumerate(ORDER):
                p = os.path.join(src, f'{name}-{st}.png')
                if not os.path.exists(p): continue
                im = Image.open(p).convert('RGBA').resize((size, size), Image.LANCZOS)
                panel.paste(im, (gap + i * (size + gap), gap + si * (size + gap)), im)
        sheet.paste(panel, (0, bi * (Hh + gap)))
    if scale != 1: sheet = sheet.resize((sheet.width * scale, sheet.height * scale), Image.NEAREST)
    return sheet


strip(32, 8).save(os.path.join(out, 'strip-32.png'))
strip(32, 8, 3).save(os.path.join(out, 'strip-32-x3.png'))
strip(64, 10).save(os.path.join(out, 'strip-64.png'))
strip(96, 12).save(os.path.join(out, 'strip-96.png'))
print('ok')
