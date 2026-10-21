#!/usr/bin/env python3
"""Evaluate a JS expression inside the game build (with injected JS) and print or save the result.
  python3 work/store/ev.py --js src/common.js --js src/store.js --expr "..." [--out file]
"""
import argparse, asyncio, os
from playwright.async_api import async_playwright

GAME = 'file:///home/claude/oos3/out/test.html'


async def main(a):
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={'width': 800, 'height': 600})
        errs = []
        pg.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
        pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
        await pg.goto(GAME)
        await pg.wait_for_function('document.documentElement.dataset.ready', timeout=90000)
        await pg.evaluate("() => { try { Title.hide(); } catch (e) {} }")
        for s in a.js:
            await pg.add_script_tag(path=os.path.abspath(s))
        v = await pg.evaluate("async (expr) => { window.scrawl = () => ''; let v = (0, eval)(expr); if (v && v.then) v = await v; return typeof v === 'string' ? v : JSON.stringify(v); }", a.expr)
        if a.out:
            open(a.out, 'w').write(v); print('wrote', a.out, len(v))
        else:
            print(v)
        for e in errs: print(e)
        await b.close()

ap = argparse.ArgumentParser(); ap.add_argument('--js', action='append', default=[]); ap.add_argument('--expr', required=True); ap.add_argument('--out')
asyncio.run(main(ap.parse_args()))
