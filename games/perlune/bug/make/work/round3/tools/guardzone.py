"""Run guard.py on the right part of a picture (the info rail side) and on the whole picture.
usage: guardzone.py <png> [right_fraction=0.35]"""
import sys, subprocess, os
from PIL import Image
p = sys.argv[1]; fr = float(sys.argv[2]) if len(sys.argv) > 2 else 0.35
im = Image.open(p); W, H = im.size
crop = os.path.splitext(p)[0] + '-right%d.png' % round(fr * 100)
im.crop((round(W * (1 - fr)), 0, W, H)).save(crop)
for f in (p, crop):
    print(subprocess.run(['python3', '/home/claude/passB/tools/guard.py', f], capture_output=True, text=True).stdout.strip())
os.remove(crop)
