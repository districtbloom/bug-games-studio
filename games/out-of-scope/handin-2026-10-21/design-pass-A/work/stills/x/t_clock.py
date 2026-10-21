import asyncio, time
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={'width':1440,'height':900})
        await pg.clock.install()
        t=time.time(); await pg.goto('file:///home/claude/oos3/out/test.html'); print('goto', time.time()-t)
        for i in range(10):
            r = await pg.evaluate("[document.documentElement.dataset.ready||'', Date.now(), performance.now()]"); print(r); await asyncio.sleep(1)
            if r[0]: break
        await b.close()
asyncio.run(main())
