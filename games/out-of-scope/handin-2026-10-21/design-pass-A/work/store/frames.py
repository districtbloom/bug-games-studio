#!/usr/bin/env python3
"""Capture the owned-mark animation at fixed times from bug/reward/preview.html and lay them out in a sheet.
   python3 work/store/frames.py out.png [tile.png]"""
import asyncio, sys, os
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont

D = '/home/claude/designpass'
TIMES = [0, 60, 120, 130, 160, 250, 400, 600, 900]
F = D + '/pack/tools/fonts/GeistMono-Regular.ttf'


async def main(out, times):
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={'width': 760, 'height': 520}, device_scale_factor=1)
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        await pg.goto('file://' + D + '/bug/reward/preview.html?still')
        await pg.wait_for_timeout(300)
        await pg.evaluate("""() => { window._pending = null; const real = window.setTimeout;
            window.setTimeout = (f, ms) => { if (ms >= 500) { window._pending = f; return 0; } return real(f, ms); };
            const big = document.getElementById('big'); OOSStamped.play(big);
            document.getAnimations().forEach(a => a.pause()); window.setTimeout = real; }""")
        shots = []
        for t in times:
            if t >= 900:
                await pg.evaluate("() => { document.getAnimations().forEach(a => { a.currentTime = 2000; }); if (window._pending) window._pending(); }")
            else:
                await pg.evaluate("(t) => document.getAnimations().forEach(a => { a.currentTime = t; })", t)
            await pg.wait_for_timeout(60)
            path = f'{D}/work/store/frame-{t}.png'
            await pg.locator('#big').screenshot(path=path)
            shots.append((t, path))
        print('errors:', errs)
        await b.close()
    ims = [(t, Image.open(pth).convert('RGB')) for t, pth in shots]
    w, h = ims[0][1].size; s = 200
    cols = len(ims)
    S = Image.new('RGB', (20 + cols * (s + 12), s + 60), (11, 9, 16)); d = ImageDraw.Draw(S)
    fnt = ImageFont.truetype(F, 13)
    for i, (t, im) in enumerate(ims):
        S.paste(im.resize((s, s), Image.LANCZOS), (20 + i * (s + 12), 16))
        d.text((20 + i * (s + 12), s + 26), f'{t} ms' + (' (held)' if t >= 600 else ''), fill=(200, 200, 200), font=fnt)
    S.save(out); print('wrote', out)

times = [int(x) for x in sys.argv[2:]] or TIMES
asyncio.run(main(sys.argv[1], times))
