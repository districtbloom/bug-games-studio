#!/usr/bin/env python3
"""Everything side by side, one sheet: python3 tools/overview.py bug out.png"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont
B, out = sys.argv[1], sys.argv[2]
F = ImageFont.truetype('/home/claude/designpass/pack/tools/fonts/GeistMono-Regular.ttf', 13)
D = json.load(open(os.path.join(B, 'design.json')))
rows = [
  ('poster family', ['poster.png', 'poster-2x3.png', 'poster-1x1.png', 'poster-9x16.png', 'share-card.png'], 220),
  ('marks', ['icon-46.png', 'chip-64.png', 'emblem-30.png', 'marker-next.png', 'marker-held.png', 'reward-held.png'], 110),
  ('stills', ['key-still.png', 'result-still.png', 'updates/case-02.png', 'events/mail-day-banner.png'], 160),
  ('gallery', [f'gallery/{i:02d}.png' for i in range(1, 7)], 130),
  ('store + pass', [f'store/{s["id"]}.png' for s in D['store']] + ['pass/tile.png'], 130),
  ('pass rewards', [f'pass/{r["id"]}.png' for r in D['pass']['rewards']] + ['pass/ground-free.png', 'pass/ground-pass.png', 'pass/ground-bug.png'], 110),
  ('seals earned', [f'seals/{m["id"]}-earned.png' for m in D['moments_proposed']['list']] + ['seals/mail-day-earned.png'], 90),
  ('page', ['backdrop.png', 'backdrop-phone.png', 'title-lockup.png'], 200),
]
W = 2200; pad = 16
H = sum(h + 40 for _, _, h in rows) + pad
S = Image.new('RGB', (W, H), (11, 9, 16)); d = ImageDraw.Draw(S); y = pad
for name, files, h in rows:
    d.text((pad, y), name.upper(), font=F, fill=(160, 156, 160)); y += 20; x = pad
    for f in files:
        im = Image.open(os.path.join(B, f)).convert('RGBA'); w = round(im.width * h / im.height)
        if x + w > W - pad: break
        im = im.resize((w, h), Image.LANCZOS); S.paste(im, (x, y), im); x += w + 10
    y += h + 20
S.save(out); print('wrote', out)
