import asyncio, time
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={'width':1440,'height':900})
        await pg.clock.install()
        await pg.goto('file:///home/claude/oos3/out/test.html')
        await pg.wait_for_function("document.documentElement.dataset.ready", timeout=20000); print('ready')
        await pg.evaluate("window.__f=false; setTimeout(()=>window.__f=true, 500)")
        t=time.time(); await pg.wait_for_function("window.__f", timeout=10000); print('wff default', time.time()-t)
        await pg.evaluate("window.__f=false; setTimeout(()=>window.__f=true, 500)")
        t=time.time()
        try:
            await pg.wait_for_function("window.__f", polling=5, timeout=10000); print('wff poll5', time.time()-t)
        except Exception as e: print('poll5 fail', str(e)[:100])
        t=time.time(); n=await pg.evaluate("Date.now()"); await pg.clock.pause_at(n+1); print('paused', time.time()-t)
        a=await pg.evaluate("Date.now()"); await asyncio.sleep(1); b2=await pg.evaluate("Date.now()"); print('frozen?', a, b2)
        t=time.time(); await pg.screenshot(path='work/stills/x/t.png'); print('shot', time.time()-t)
        await pg.clock.resume(); a=await pg.evaluate("Date.now()"); await asyncio.sleep(1); b2=await pg.evaluate("Date.now()"); print('resumed', b2-a)
        await b.close()
asyncio.run(main())
