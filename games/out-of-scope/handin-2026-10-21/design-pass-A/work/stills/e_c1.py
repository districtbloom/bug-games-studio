import time
await ev("try{localStorage.clear()}catch(e){}"); await pg.reload(); await pg.wait_for_function("document.documentElement.dataset.ready")
await ev("Prefs.tutOff=true; savePrefs(); try{Sound.setSfx(0);Sound.setMusic(0)}catch(e){}")
n = [0]
async def snap(name):
    n[0] += 1; t = time.time(); await shot(f'e1-{n[0]:02d}-{name}'); print('snap', name, round((time.time()-t)*1000), 'ms')
async def st():
    return await ev("JSON.stringify({beat:S.beat, ev:S.ev, caught:Object.keys(S.caught||{}), tank:S.tank, modal:Modal.open, cine:Cine.on, phase:S.phase})")
async def c(sel):
    b = await pg.locator(sel).first.bounding_box()
    if not b: return None
    return (b['x'] + b['width'] / 2, b['y'] + b['height'] / 2)
async def click(sel, w=700):
    a = await c(sel)
    if not a: print('  !! missing', sel); return
    await pg.mouse.click(*a); await wait(w)
async def drag(a, b, w=900):
    A = await c(a); B = await c(b)
    if not A or not B: print('  !! missing', a if not A else b); return
    await pg.mouse.move(*A); await pg.mouse.down(); await pg.mouse.move(A[0] + 15, A[1] + 8, steps=3)
    await pg.mouse.move(*B, steps=12); await pg.mouse.up(); await wait(w)
await pg.click('[data-title="new"]'); await wait(1500)
await ev("Cine.on && Cine.skip()"); await wait(900); await snap('poster')
await pg.click('[data-cine="next"]'); await wait(2500); await snap('desk')
await drag('#w-case .sticker', '.slot.val'); await click('.run', 1800); await snap('rows'); print(await st())
for i in range(40):
    await wait(1000)
    if await ev("S.ev.includes('locker')"): break
await wait(800); await snap('locker'); print(await st())
await drag('#w-ev [data-pick="slip_hr"]', '#w-ev [data-pick="locker"]', 2400); await snap('impossible'); print(await st())
for i in range(20):
    await wait(700)
    if await pg.locator('[data-act="deal-no"]').count(): break
await snap('deal')
if await pg.locator('[data-act="deal-no"]').count(): await pg.click('[data-act="deal-no"]'); await wait(3500)
await snap('snatched'); print(await st())
await drag('#w-ev [data-pick="impossible"]', '#lie', 0)
for ms in [300, 520, 700, 900, 1200]:
    pass
await wait(560); await snap('break1-a'); await wait(150); await snap('break1-b'); await wait(1500); await snap('break1-c')
await wait(3000)
while await ev("Cine.on"):
    await ev("Cine.skip()"); await wait(900)
await wait(2500); await snap('q2'); print(await st())
