# render one package slot: python3 render.py <js expression returning html> <out.png> <W> <H> [dpr]
import asyncio, sys
from playwright.async_api import async_playwright
SRC = '/home/claude/bugpack/src/'
async def main(expr, out, W, H, dpr):
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={'width': W, 'height': H}, device_scale_factor=dpr)
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        await pg.goto('file:///home/claude/oos3/out/test.html'); await pg.wait_for_function('document.documentElement.dataset.ready', timeout=60000)
        await pg.evaluate("Title.hide()")
        await pg.add_style_tag(path=SRC + 'pack.css'); await pg.add_script_tag(path=SRC + 'pack.js')
        await pg.evaluate(f"PK.show({expr})"); await pg.wait_for_timeout(700)
        await pg.screenshot(path=out, clip={'x': 0, 'y': 0, 'width': W, 'height': H})
        print(out, errs[:4]); await b.close()
a = sys.argv
asyncio.run(main(a[1], a[2], int(a[3]), int(a[4]), float(a[5]) if len(a) > 5 else 1))
