# list every colour used in a rendered slot (fill/stroke/stop-color attributes + inline styles)
import asyncio, sys, re
from playwright.async_api import async_playwright
SRC = '/home/claude/bugpack/src/'
async def main(expr):
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page()
        await pg.goto('file:///home/claude/oos3/out/test.html'); await pg.wait_for_function('document.documentElement.dataset.ready', timeout=60000)
        await pg.add_style_tag(path=SRC + 'pack.css'); await pg.add_script_tag(path=SRC + 'pack.js')
        await pg.evaluate(f"PK.show({expr})")
        h = await pg.evaluate("document.getElementById('pkw').innerHTML")
        print(' '.join(sorted(set(x.lower() for x in re.findall(r'#[0-9a-fA-F]{6}\b', h))))); await b.close()
asyncio.run(main(sys.argv[1]))
