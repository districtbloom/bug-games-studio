import numpy as np, sys
sys.argv=['x']
exec(open('port.py').read().split("if __name__")[0])
from PIL import Image
poster = np.asarray(Image.open('/home/claude/passB/bug/poster.png').convert('RGB')).astype(float) / 255
box = (700, 170, 1270, 740)
ref = poster[box[1]:box[3]:3, box[0]:box[2]:3]
res=[]
for T in np.arange(7.0, 8.0, 0.05):
    for b in [None, 0.0]:
        c, hit = render(T, box, 3, bounce=b)
        res.append((np.mean(((c - ref) ** 2)[hit]), round(T,2), b))
res.sort(); print(res[:6])
