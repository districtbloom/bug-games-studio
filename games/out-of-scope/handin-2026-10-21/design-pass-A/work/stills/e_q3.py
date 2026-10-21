import time
await ev("Prefs.tutOff=true; savePrefs()")
await ev("S = freshState(); S.deals={d1:'no',d2:'no'}; S.found={session:1}; S.caught={halo:'slip_hr',regent:'slip_it',deadline:'slip_fac',kickback:'slip_fin',bcc:'mail_bye'}; S.flags.lie1=true; S.flags.lie2=true; Title.hide(); buildDesk(); startBeat(3)")
await wait(2500); await shot('q3-01')
async def hold_throw(item, target):
    await pg.click(f'#w-ev [data-pick="{item}"]', force=True); await wait(250)
    await pg.click(target, force=True); await wait(900)
ra = await pg.locator('#w-ev .chip.mini').first.bounding_box(); rb = await pg.locator('.slot.val').bounding_box()
await pg.mouse.move(ra['x']+ra['width']/2, ra['y']+ra['height']/2); await pg.mouse.down()
await pg.mouse.move(ra['x']+30, ra['y']+20, steps=3); await pg.mouse.move(rb['x']+rb['width']/2, rb['y']+rb['height']/2, steps=8)
await pg.mouse.up(); await wait(300)
await pg.click('.run', force=True); await wait(2000)
await hold_throw('policy', '#lie'); await wait(1200)
await pg.click('[data-act="pop:table"]', force=True); await wait(300); await pg.click('[data-act="set-table:badges"]'); await wait(200)
await pg.click('.slot.val', force=True); await wait(300); await pg.click('[data-act="set-value:gordon"]'); await wait(200)
await pg.click('.run', force=True); await wait(3000)
await pg.click('#w-ev .tool', force=True); await wait(300)
await pg.click('#w-ev [data-pick="slip_it"]', force=True); await wait(1500)
t0 = time.time()
for ms in [1000, 2400, 3300]:
    dt = ms/1000 - (time.time()-t0)
    if dt > 0: await asyncio.sleep(dt)
    await shot(f'q3-door-{ms}')
await wait(6000); await shot('q3-09-back')
await hold_throw('policy', '#lie'); await shot('q3-10-break')
# c3 starts at +2300 after break (afterLie)
await wait(1000)
for i in range(40):
    if await ev("Cine.on"): break
    await wait(100)
t0 = time.time()
for ms in [1500, 2600, 3200, 4300, 5000, 5900, 6600, 7300, 8200, 9000]:
    dt = ms/1000 - (time.time()-t0)
    if dt > 0: await asyncio.sleep(dt)
    await shot(f'q3-c3-{ms}')
for i in range(30):
    await wait(1000)
    if await pg.locator('.s-closed, .closed').count(): break
    if await ev("Cine.on && Cine.i < 4 && false"): pass
t0 = time.time()
for ms in [600, 1500, 2500, 4000]:
    dt = ms/1000 - (time.time()-t0)
    if dt > 0: await asyncio.sleep(dt)
    await shot(f'q3-fin-{ms}')
await wait(5000); await shot('q3-fin-twist')
await wait(8000); await shot('q3-fin-next')
print(await ev("JSON.stringify({beat:S.beat, phase:S.phase, cine:Cine.on, i:Cine.i, name:Cine.name})"))
