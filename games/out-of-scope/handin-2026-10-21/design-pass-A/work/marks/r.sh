#!/bin/bash
# usage: r.sh <expr> <name> <size>   -> work/marks/<name>.png (4x, downsampled) and <name>_big.png (4x view)
cd /home/claude/designpass
python3 tools/render.py --js src/common.js --js src/marks.js --expr "$1" --out work/marks/$2.png --w $3 --h $3 --dpr 4 --final $3 $3 --hexes work/marks/$2.hex
python3 - "$2" <<'PY'
import sys; from PIL import Image
n=sys.argv[1]; im=Image.open(f'/home/claude/designpass/work/marks/{n}.png'); im.resize((im.width*4,im.height*4),Image.NEAREST).save(f'/home/claude/designpass/work/marks/{n}_x4.png')
PY
