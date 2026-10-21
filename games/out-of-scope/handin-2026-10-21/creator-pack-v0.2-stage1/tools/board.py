import asyncio, sys
from playwright.async_api import async_playwright
SRC = '/home/claude/bugpack/src/'
async def main(out):
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--enable-unsafe-swiftshader', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 1600, 'height': 1200}, device_scale_factor=1)
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        await pg.goto('file:///home/claude/oos3/out/test.html'); await pg.wait_for_function('document.documentElement.dataset.ready', timeout=60000)
        await pg.evaluate("Title.hide(); document.documentElement.style.overflow='visible'; document.body.style.overflow='visible'; document.body.style.height='auto'; document.getElementById('app').style.display='none'")
        await pg.add_style_tag(path=SRC + 'board.css'); await pg.add_script_tag(path=SRC + 'board.js')
        await pg.evaluate("SHEETB.show()"); await pg.wait_for_timeout(1500)
        h = await pg.evaluate("document.querySelector('.bd').offsetHeight")
        await pg.set_viewport_size({'width': 1600, 'height': h}); await pg.wait_for_timeout(400)
        await pg.screenshot(path=out, clip={'x': 0, 'y': 0, 'width': 1600, 'height': h}); print(out, h, errs[:4]); await b.close()
asyncio.run(main(sys.argv[1]))
