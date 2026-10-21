#!/usr/bin/env python3
"""Render a picture with Out of Scope's own drawing code.

The game build (out/test.html) is loaded in Chromium, so every art function, font and line filter
(#rough, #roughS, #rough2, #brush) is live. Your JS files are injected after it, then a JS expression
that returns an HTML/SVG string is drawn into a W x H box at the top-left and screenshotted.

  python3 tools/render.py --js src/common.js --js src/mine.js --expr "MINE.poster(1600,800)" \
      --out bug/poster.png --w 1600 --h 800 [--dpr 2] [--final 1600 800] [--alpha] [--hexes work/poster.hex]

  python3 tools/render.py jobs.json      # a list of the same fields as objects:
      [{"js": [...], "css": [...], "expr": "...", "out": "...", "w": 1600, "h": 800, "dpr": 2,
        "final": [1600, 800], "alpha": false, "hexes": "..."}]

--dpr renders at a higher pixel density; --final then downsamples with Lanczos to the exact size.
--alpha keeps the background transparent (everything outside your art is see-through).
--hexes writes every #rrggbb used in the rendered markup, one per line (feed it to tools/colours.py).
Console errors and page errors are printed; the exit code is 1 if there were any.
"""
import argparse, asyncio, json, os, re, sys
from playwright.async_api import async_playwright
from PIL import Image

GAME = 'file:///home/claude/oos3/out/test.html'
BASE_CSS = """
#dp{position:fixed;left:0;top:0;z-index:2147483647;overflow:hidden;contain:strict}
#dp > *{display:block}
html.dp-on, html.dp-on body{background:transparent !important;overflow:hidden !important}
html.dp-on body > *:not(#dp){visibility:hidden !important}
"""


async def run(jobs):
    bad = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--enable-unsafe-swiftshader', '--disable-web-security'])
        for j in jobs:
            W, H, dpr = int(j['w']), int(j['h']), float(j.get('dpr', 1))
            pg = await b.new_page(viewport={'width': max(W, 64), 'height': max(H, 64)}, device_scale_factor=dpr)
            errs = []
            pg.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
            pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
            await pg.goto(GAME)
            await pg.wait_for_function('document.documentElement.dataset.ready', timeout=90000)
            await pg.evaluate("""() => { try { Title.hide(); } catch (e) {} try { Sound.setSfx && Sound.setSfx(0); Sound.setMusic && Sound.setMusic(0); } catch (e) {} }""")
            await pg.add_style_tag(content=BASE_CSS)
            for c in j.get('css', []):
                await pg.add_style_tag(path=os.path.abspath(c))
            for s in j.get('js', []):
                await pg.add_script_tag(path=os.path.abspath(s))
            try:
                html = await pg.evaluate("""async ([expr, W, H]) => {
                    window.scrawl = () => '';
                    let el = document.getElementById('dp');
                    if (!el) { el = document.createElement('div'); el.id = 'dp'; document.body.appendChild(el); }
                    el.style.width = W + 'px'; el.style.height = H + 'px';
                    document.documentElement.classList.add('dp-on');
                    let v = (0, eval)(expr); if (v && v.then) v = await v;
                    el.innerHTML = v;
                    await document.fonts.ready;
                    return el.innerHTML;
                }""", [j['expr'], W, H])
            except Exception as e:
                print('FAILED', j['out'], str(e)[:600]); bad = 1; await pg.close(); continue
            await pg.wait_for_timeout(int(j.get('wait', 350)))
            out = j['out']
            os.makedirs(os.path.dirname(os.path.abspath(out)) or '.', exist_ok=True)
            await pg.screenshot(path=out, clip={'x': 0, 'y': 0, 'width': W, 'height': H}, omit_background=bool(j.get('alpha')))
            if j.get('final'):
                fw, fh = j['final']
                im = Image.open(out)
                im = im.convert('RGBA' if j.get('alpha') else 'RGB').resize((int(fw), int(fh)), Image.LANCZOS)
                im.save(out)
            elif not j.get('alpha'):
                Image.open(out).convert('RGB').save(out)
            if j.get('hexes'):
                hx = sorted(set(x.lower() for x in re.findall(r'#[0-9a-fA-F]{6}\b', html)))
                with open(j['hexes'], 'w') as f:
                    f.write('\n'.join(hx) + '\n')
            print('wrote', out, (Image.open(out).size), ('ERRORS: ' + ' | '.join(errs[:5])) if errs else '')
            if errs: bad = 1
            await pg.close()
        await b.close()
    return bad


def main():
    if len(sys.argv) == 2 and sys.argv[1].endswith('.json'):
        jobs = json.load(open(sys.argv[1]))
    else:
        ap = argparse.ArgumentParser()
        ap.add_argument('--js', action='append', default=[])
        ap.add_argument('--css', action='append', default=[])
        ap.add_argument('--expr', required=True)
        ap.add_argument('--out', required=True)
        ap.add_argument('--w', type=int, required=True)
        ap.add_argument('--h', type=int, required=True)
        ap.add_argument('--dpr', type=float, default=1)
        ap.add_argument('--final', type=int, nargs=2)
        ap.add_argument('--alpha', action='store_true')
        ap.add_argument('--hexes')
        ap.add_argument('--wait', type=int, default=350)
        a = ap.parse_args()
        jobs = [vars(a)]
    sys.exit(asyncio.run(run(jobs)))


if __name__ == '__main__':
    main()
