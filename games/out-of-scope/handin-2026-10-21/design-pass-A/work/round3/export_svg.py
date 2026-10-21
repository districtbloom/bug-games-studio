#!/usr/bin/env python3
"""Write the title lockup as a standalone SVG (the same markup the PNG is rendered from), then render
that file on its own in Chromium (no game page, no fonts) so it can be compared with the PNG.
  python3 work/round3/export_svg.py bug/title-lockup.svg work/round3/svg-standalone.png
"""
import asyncio, sys, os
from playwright.async_api import async_playwright
JS = ['src/common.js', 'src/poster.js', 'src/round3-type.js', 'src/round3.js']

async def main(out_svg, out_png):
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={'width': 1300, 'height': 1000})
        await pg.goto('file:///home/claude/oos3/out/test.html')
        await pg.wait_for_function('document.documentElement.dataset.ready', timeout=90000)
        for s in JS: await pg.add_script_tag(path=os.path.abspath(s))
        svg = await pg.evaluate("() => R3.lockup(1200)")
        await pg.close()
        svg = '<?xml version="1.0" encoding="UTF-8"?>\n<!-- Out of Scope · title lockup. Letters outlined from the game\'s Tabloid face (TeX Gyre Heros Condensed Bold, GUST Font License); mark from the game\'s rawGlyph(\'mark\'). Minimum width 92 px (letters 18 px tall). -->\n' + svg + '\n'
        open(out_svg, 'w').write(svg)
        pg = await b.new_page(viewport={'width': 1200, 'height': 934})
        await pg.goto('file://' + os.path.abspath(out_svg))
        await pg.wait_for_timeout(300)
        await pg.screenshot(path=out_png, omit_background=True)
        await b.close()
    print('wrote', out_svg, len(svg), 'bytes;', out_png)

asyncio.run(main(sys.argv[1], sys.argv[2]))
