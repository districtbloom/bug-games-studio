import time
await ev("Prefs.tutOff=true; savePrefs()")
await ev("S = freshState(); S.deals.d1='no'; S.tank='slip_fin'; S.found={slip_hr:1,slip_it:1,slip_fac:1,slip_fin:1,locker:1}; S.flags.lie1=true; Title.hide(); buildDesk(); startBeat(2)")
await wait(9000)
await ev("""window.__freezeAt = (ms) => { window.__frozen = false; setTimeout(() => { document.getAnimations().forEach(a => a.pause()); window.__frozen = true; }, ms); };
window.__thaw = () => { document.getAnimations().forEach(a => a.play()); };""")
async def c(sel):
    b = await pg.locator(sel).first.bounding_box()
    if not b: return None
    return (b['x'] + b['width'] / 2, b['y'] + b['height'] / 2)
async def drag(a, b, w=900, freeze=None):
    A = await c(a); B = await c(b)
    if not A or not B: print('  !! missing', a if not A else b); return
    await pg.mouse.move(*A); await pg.mouse.down(); await pg.mouse.move(A[0] + 15, A[1] + 8, steps=3)
    await pg.mouse.move(*B, steps=12)
    if freeze is not None: await ev(f"window.__freezeAt({freeze})")
    await pg.mouse.up(); await wait(w)
await shot('q2-00')
await pg.click('#w-ev [data-act="flip:slip_hr"]'); await wait(1200); await shot('q2-01-flip')
for fz in [470, 560]:
    pass
await drag('#w-ev [data-pick="slip_hr"]', '[data-drop="alibi:halo"]', 0, freeze=520)
await pg.wait_for_function("window.__frozen"); t=time.time(); await shot('q2-02-catch520'); print('shot', time.time()-t)
await ev("window.__thaw()"); await wait(3500); await shot('q2-03-after')
await pg.click('#w-ev [data-act="flip:slip_it"]'); await wait(1000)
await drag('#w-ev [data-pick="slip_it"]', '[data-drop="alibi:regent"]', 0, freeze=640)
await pg.wait_for_function("window.__frozen"); await shot('q2-04-catch640')
await ev("window.__thaw()"); await wait(4000); await shot('q2-05-after'); print(await ev("JSON.stringify({modal:Modal.open, tank:S.tank, caught:S.caught})"))
if await pg.locator('[data-act="deal-no"]').count(): await pg.click('[data-act="deal-no"]'); await wait(2500)
await shot('q2-06')
for i in range(3):
    await pg.click('.lu-kickback .fig', force=True); await wait(250); await shot(f'q2-07-glass{i}'); await wait(500)
await wait(1500); await shot('q2-08-spat')
