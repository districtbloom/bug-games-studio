# rasterise an SVG mark at its exact size (rendered 4x, downsampled with Lanczos): svg2png.py in.svg out.png W H
import asyncio, sys
from playwright.async_api import async_playwright
from PIL import Image
async def main(src, out, W, H):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': W, 'height': H}, device_scale_factor=4)
        svg = open(src).read()
        sty = '<svg style="display:block;width:%dpx;height:%dpx" ' % (W, H)
        body = svg.replace('<svg ', sty, 1)
        await pg.set_content('<html><body style="margin:0;background:transparent">' + body + '</body></html>')
        await pg.wait_for_timeout(200); await pg.screenshot(path=out + '.4x.png', clip={'x': 0, 'y': 0, 'width': W, 'height': H}, omit_background=True)
        await b.close()
    Image.open(out + '.4x.png').resize((W, H), Image.LANCZOS).save(out); print(out)
a = sys.argv; asyncio.run(main(a[1], a[2], int(a[3]), int(a[4])))
