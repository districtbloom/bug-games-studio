# Gallery close-ups (second run): one honest playthrough of the current build, Case 01 start to finale, then Case 02
# from the finale's "Play Case 02" button through to the relay-7 cut. Tutorial skipped (Prefs.tutOff, the
# same flag the in-game "Skip tutorial" button sets). Everything is done through the game's own UI by mouse,
# except one Case 02 search, which uses the game's own runSearch() with the query a player would type
# (the technique of the game's own playtest test/s_c2.py).
# Moments are frozen by pausing the running CSS/Web animations (a freeze frame of the real build), shot
# full-frame at the device scale given on the command line, then thawed.
import time, json
await ev("try{localStorage.clear()}catch(e){}"); await pg.reload(); await pg.wait_for_function("document.documentElement.dataset.ready")
await ev("Prefs.tutOff=true; savePrefs(); try{Sound.setSfx(0);Sound.setMusic(0)}catch(e){}")
await ev("""(() => {
  window.__fz = []; window.__frozen = false;
  window.__freeze = () => { window.__fz = document.getAnimations().filter(a => a.playState === 'running'); window.__fz.forEach(a => a.pause()); window.__frozen = true; };
  window.__thaw = () => { window.__fz.forEach(a => { try { a.play(); } catch (e) {} }); window.__fz = []; window.__frozen = false; };
  window.__freezeIn = (ms) => { window.__frozen = false; setTimeout(window.__freeze, ms); };
  window.__armFreeze = (sel, ms) => { window.__frozen = false; const iv = setInterval(() => { if (document.querySelector(sel)) { clearInterval(iv); setTimeout(window.__freeze, ms); } }, 8); };
})()""")
log = []
async def st():
    return await ev("JSON.stringify({case:S.case, beat:S.beat, ev:S.ev, caught:Object.keys(S.caught||{}), tank:S.tank, modal:Modal.open, cine:Cine.on, phase:S.phase})")
CLIP = [None]
async def grab(name):
    # freeze frame: the running animations are paused in the page and the game's timers are held by
    # Playwright's clock, so nothing moves or changes while the whole stage is shot; then both resume.
    if not await ev("window.__frozen"): await ev("window.__freeze()")
    for m in (30, 60, 120, 250):
        try:
            await pg.clock.pause_at((await ev("Date.now()") + m) / 1000); break
        except Exception as e:
            print('  pause retry', m)
    t = time.time(); await shot(name, clip=CLIP[0]); await ev("window.__thaw()"); await pg.clock.resume()
    print('grab', name, round(time.time() - t, 2), 's'); log.append(name)
async def grab_when_frozen(name, timeout=30000):
    await pg.wait_for_function("window.__frozen", polling=5, timeout=timeout); await grab(name)
async def seq(prefix, steps):
    # more frames of the same moment: freeze again after `d` ms of game time
    for d in steps:
        await ev(f"window.__freezeIn({d})"); await grab_when_frozen(f'{prefix}+{d}')
async def c(sel):
    loc = pg.locator(sel).first
    if not await loc.count(): return None
    b = await loc.bounding_box()
    if not b: return None
    return (b['x'] + b['width'] / 2, b['y'] + b['height'] / 2)
async def click(sel, w=700):
    a = await c(sel)
    if not a: print('  !! missing', sel); return False
    await pg.mouse.click(*a); await wait(w); return True
async def drag(a, b, w=900, freeze=None):
    A = await c(a); B = await c(b)
    if not A or not B: print('  !! missing', a if not A else b); return False
    await pg.mouse.move(*A); await pg.mouse.down(); await pg.mouse.move(A[0] + 15, A[1] + 8, steps=3)
    await pg.mouse.move(*B, steps=14)
    if freeze is not None: await ev(f"window.__freezeIn({freeze})")
    await pg.mouse.up(); await wait(w); return True
async def clear_toasts():
    # a player clicks a tip/toast away
    for i in range(6):
        n = await pg.locator('#toasts .toast.in').count()
        if not n: break
        await click('#toasts .toast.in', 500)
    await wait(500)
async def deals_no():
    if await pg.locator('[data-act="deal-no"]').count():
        await pg.click('[data-act="deal-no"]'); await wait(1500); print('  deal: no')
async def shoo():
    if await ev("typeof Stamp!=='undefined' && Stamp.state==='aim'"):
        await click('#stamp', 600); print('  stamp swatted')
async def skip_cines():
    while await ev("Cine.on"):
        await ev("Cine.skip()"); await wait(900)

# ================= CASE 01 (played through by mouse, no grabs) =================
await pg.click('[data-title="new"]'); await wait(1500)
await ev("Cine.on && Cine.skip()"); await wait(900)
await pg.click('[data-cine="next"]'); await wait(2500)
await drag('#w-case .sticker', '.slot.val'); await click('.run', 1800)
for i in range(60):
    await wait(1000)
    if await ev("S.ev.includes('locker')"): break
await wait(1200)
await drag('#w-ev [data-pick="slip_hr"]', '#w-ev [data-pick="locker"]', 2400)
for i in range(30):
    await wait(500)
    if await pg.locator('[data-act="deal-no"]').count(): break
await shoo(); await pg.click('[data-act="deal-no"]'); await wait(4000); await shoo()
await drag('#w-ev [data-pick="impossible"]', '#lie', 4500); await skip_cines(); await wait(1500)
print('Q2', await st())
# ================= Q2: flipping one forgery (close-up, evidence window) =================
await clear_toasts(); await wait(8000); await clear_toasts()
CLIP[0] = {'x': 900, 'y': 0, 'width': 540, 'height': 300}
await ev("window.__armFreeze('#w-ev .ev.flipping', 70)")
await click('#w-ev [data-act="flip:slip_it"]', 0)
await grab_when_frozen('F1-flip-it+70')
for d, tot in [(60, 130), (50, 180), (50, 230), (50, 280), (50, 330), (60, 390), (80, 470)]:
    await ev(f"window.__freezeIn({d})"); await grab_when_frozen(f'F1-flip-it+{tot}')
await wait(1500); await clear_toasts()
await ev("window.__armFreeze('#w-ev .ev.flipping', 230)")
await click('#w-ev [data-act="flip:slip_hr"]', 0)
await grab_when_frozen('F2-flip-hr+230')
await wait(1800); await grab('F3-two-flipped')
# ================= Q2: Kickback, Final pay in his tank (close-up, line-up) =================
CLIP[0] = {'x': 60, 'y': 470, 'width': 780, 'height': 430}
await clear_toasts(); await grab('K0-kickback-tank')
await drag('#w-ev [data-pick="slip_hr"]', '[data-drop="alibi:halo"]', 4500); await clear_toasts()
await drag('#w-ev [data-pick="slip_it"]', '[data-drop="alibi:regent"]', 0)
for i in range(14):
    await wait(700)
    if await pg.locator('[data-act="deal-no"]').count(): break
await deals_no(); await wait(5000); await clear_toasts()
await grab('K1-before-tap')
await click('.lu-kickback .fig', 0)
for d, tot in [(120, 120), (200, 320), (300, 620), (500, 1120)]:
    await ev(f"window.__freezeIn({d})"); await grab_when_frozen(f'K2-tap1+{tot}')
await wait(2600); await clear_toasts()
await click('.lu-kickback .fig', 0)
for d, tot in [(160, 160), (400, 560), (700, 1260)]:
    await ev(f"window.__freezeIn({d})"); await grab_when_frozen(f'K3-tap2+{tot}')
await wait(2600); await clear_toasts()
await click('.lu-kickback .fig', 0)
for d, tot in [(200, 200), (600, 800)]:
    await ev(f"window.__freezeIn({d})"); await grab_when_frozen(f'K4-tap3+{tot}')
CLIP[0] = None
await wait(3500); await clear_toasts()
print('tank', await st())
await drag('#w-ev [data-pick="slip_fac"]', '[data-drop="alibi:deadline"]', 4500); await clear_toasts()
await drag('#w-ev [data-pick="slip_fin"]', '[data-drop="alibi:kickback"]', 9000); await clear_toasts()
if not await ev("S.q.table==='mail'"):
    await click('.slot.tbl', 800)
    if await pg.locator('#pop [data-act="set-table:mail"]').count(): await pg.click('#pop [data-act="set-table:mail"]'); await wait(900)
await drag('#w-case .sticker', '.slot.val'); await click('.run', 2600)
await click('#w-ev [data-act="flip:mail_bye"]', 900)
await drag('#w-ev [data-pick="mail_bye"]', '[data-drop="alibi:bcc"]', 5000)
print('after Q2', await st())
await skip_cines(); await wait(1800)
# ================= Q3: the last lie breaks (close-up) =================
print('Q3', await st())
await clear_toasts()
ok = await drag('#w-ev .k-notice .chip', '.slot.val')
if not ok: await drag('#w-ev .chip.mini', '.slot.val')
await click('.run', 2200)
await drag('#w-ev [data-pick="policy"]', '#lie', 3000); await deals_no(); await shoo()
await click('.slot.tbl', 700)
if await pg.locator('#pop [data-act="set-table:badges"]').count(): await pg.click('#pop [data-act="set-table:badges"]'); await wait(700)
await drag('#w-case .sticker', '.slot.val'); await click('.run', 2800); await deals_no(); await shoo()
await drag('#w-ev .tool', '#w-ev [data-pick="slip_it"]', 1500)
for i in range(40):
    await wait(500)
    if not await ev("Cine.on"): break
await wait(6000); await deals_no(); await shoo(); await clear_toasts(); await wait(1500); await clear_toasts()
print('pre-break3', await st())
CLIP[0] = {'x': 800, 'y': 440, 'width': 640, 'height': 460}
await grab('L0-before')
await drag('#w-ev [data-pick="badge"]', '#lie', 0, freeze=400)
await grab_when_frozen('L1-break+400')
for d, tot in [(60, 460), (60, 520), (60, 580), (80, 660), (80, 740), (80, 820), (100, 920), (120, 1040), (160, 1200), (300, 1500)]:
    await ev(f"window.__freezeIn({d})"); await grab_when_frozen(f'L1-break+{tot}')
CLIP[0] = None
await wait(3000)
print('end', await st())
print(json.dumps(log))
