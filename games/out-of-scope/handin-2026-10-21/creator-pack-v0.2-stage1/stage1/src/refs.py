# capture reference frames of the game's own look (references for the style sheet, not package assets)
import asyncio, sys
from playwright.async_api import async_playwright
OUT = '/home/claude/bugpack/stage1/ref/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/oos3/out/test.html'); await pg.wait_for_function('document.documentElement.dataset.ready', timeout=60000)
        await pg.evaluate("try{localStorage.clear()}catch(e){}; Progress.cases[1]={done:true,cred:95}; Progress.cases[2]={done:true,cred:90}; saveProg(); Title.show()")
        await pg.wait_for_timeout(2600); await pg.screenshot(path=OUT + 'r-title.png')
        async def shot(k, ms, name):
            await pg.evaluate(f"Title.hide(); Cine.play('open', ()=>{{}}); Cine.stopTimers(); Cine.i = {k} - 1; Cine.next()")
            await pg.wait_for_timeout(ms); await pg.screenshot(path=OUT + name)
        await shot(8, 900, 'r-roll-regent.png')
        await shot(12, 900, 'r-roll-bcc.png')
        await shot(6, 7900, 'r-storm.png')
        await shot(16, 900, 'r-case-poster.png')
        await pg.evaluate("Cine.end()"); await pg.wait_for_timeout(600)
        # gameplay: the lie breaks
        await pg.evaluate("Prefs.tutOff=true; savePrefs(); Title.hide(); newGame(1,true)"); await pg.wait_for_timeout(900)
        await pg.evaluate("Cine.on && Cine.end()"); await pg.wait_for_timeout(700)
        await pg.evaluate("Clock.clear(); S.deals.d1='no'; S.flags.gordonMsg=1; S.q={table:'approvals',field:'signed_by',value:'gordon'}; renderSearch(); runSearch()"); await pg.wait_for_timeout(2200)
        await pg.evaluate("Clock.clear(); Speech.hushAll(); addEv(['locker','impossible'],{quiet:true})"); await pg.wait_for_timeout(1500)
        await pg.evaluate("Clock.clear(); Speech.hushAll(); throwLie('impossible', $('#lie'))"); await pg.wait_for_timeout(700)
        await pg.screenshot(path=OUT + 'r-desk-smash.png')
        await pg.evaluate("Cine.on && Cine.end()"); await pg.wait_for_timeout(500)
        await pg.evaluate("Hub.show()"); await pg.wait_for_timeout(1500); await pg.screenshot(path=OUT + 'r-board.png')
        print('errors', errs[:5]); await b.close()
asyncio.run(main())
