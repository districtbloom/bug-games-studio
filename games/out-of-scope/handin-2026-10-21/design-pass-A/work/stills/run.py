"""Drive the running Out of Scope build (out/test.html) and save screenshots under work/stills/.
Same technique as /home/claude/oos3/test/run.py, but nothing is ever written into the game folder.

  python3 work/stills/run.py <script.py> [width height scale] [outdir]

The script body runs as an async function with: pg, ev, wait, shot(name, clip=None), msgs, asyncio, OUT.
"""
import asyncio, os, sys
from playwright.async_api import async_playwright

URL = 'file:///home/claude/oos3/out/test.html'
HERE = os.path.dirname(os.path.abspath(__file__))


async def main(script, w=1440, h=900, scale=1.0, out=None):
    out = out or os.path.join(HERE, 'x')
    os.makedirs(out, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width': w, 'height': h}, device_scale_factor=scale)
        msgs = []
        pg.on('pageerror', lambda e: msgs.append('PAGEERR ' + str(e)))
        pg.on('console', lambda m: msgs.append(m.type + ' ' + m.text) if m.type in ('error', 'warning') else None)
        if os.environ.get('CLOCK'):
            await pg.clock.install()   # Playwright's controllable clock: lets a capture hold the game's timers still while it shoots
        await pg.goto(URL)
        await pg.wait_for_function("document.documentElement.dataset.ready", timeout=90000)
        await pg.evaluate("() => { try { Sound.setSfx && Sound.setSfx(0); Sound.setMusic && Sound.setMusic(0); } catch (e) {} }")

        async def shot(name, clip=None):
            path = os.path.join(out, name + '.png')
            kw = {'path': path}
            if clip: kw['clip'] = clip
            await pg.screenshot(**kw)
            return path
        g = {'pg': pg, 'asyncio': asyncio, 'shot': shot, 'ev': pg.evaluate, 'wait': pg.wait_for_timeout, 'msgs': msgs, 'OUT': out}
        src = open(script).read()
        exec(compile('async def __s():\n' + '\n'.join('  ' + l for l in src.splitlines()), script, 'exec'), g)
        try:
            await g['__s']()
        finally:
            for m in msgs[:40]: print(m)
            await b.close()

if __name__ == '__main__':
    a = sys.argv
    asyncio.run(main(a[1], int(a[2]) if len(a) > 2 else 1440, int(a[3]) if len(a) > 3 else 900,
                     float(a[4]) if len(a) > 4 else 1, a[5] if len(a) > 5 else None))
