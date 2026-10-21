# Gallery capture: one honest playthrough of the current build, Case 01 start to finale, then Case 02
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
async def grab(name):
    # freeze frame: the running animations are paused in the page and the game's timers are held by
    # Playwright's clock, so nothing moves or changes while the whole stage is shot; then both resume.
    if not await ev("window.__frozen"): await ev("window.__freeze()")
    for m in (30, 60, 120, 250):
        try:
            await pg.clock.pause_at((await ev("Date.now()") + m) / 1000); break
        except Exception as e:
            print('  pause retry', m)
    t = time.time(); await shot(name); await ev("window.__thaw()"); await pg.clock.resume()
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

# ================= CASE 01 =================
await pg.click('[data-title="new"]'); await wait(1500)
await ev("Cine.on && Cine.skip()"); await wait(900)
await pg.click('[data-cine="next"]'); await wait(2500)
# Q1: search gordon
await drag('#w-case .sticker', '.slot.val'); await click('.run', 1800); print(await st())
for i in range(60):
    await wait(1000)
    if await ev("S.ev.includes('locker')"): break
await wait(1200)
await drag('#w-ev [data-pick="slip_hr"]', '#w-ev [data-pick="locker"]', 2400); print('impossible', await st())
for i in range(30):
    await wait(500)
    if await pg.locator('[data-act="deal-no"]').count(): break
await shoo()
await pg.click('[data-act="deal-no"]')
await wait(1400 + 520 + 700)   # Kickback snatches Final pay into his tank
await shoo(); await grab('A1-q1-tank-said')
await wait(5500); await clear_toasts(); await shoo(); await grab('A2-q1-tank-quiet')
# break lie 1 (reference)
await drag('#w-ev [data-pick="impossible"]', '#lie', 0, freeze=420 + 300)
await grab_when_frozen('A3-q1-break'); await seq('A3-q1-break', [150, 200])
await wait(4500); await skip_cines(); await wait(1500)
print('Q2', await st())
# ================= Q2: the line-up =================
await clear_toasts()
await wait(5600)   # Kickback: "Looking for Final pay? It's in here. With me." at +6.2s, typed at 24 ms/char
await clear_toasts(); await grab('B1-q2-kickback-says')
await wait(3000); await clear_toasts()
await click('#w-ev [data-act="flip:slip_hr"]', 900)
await click('#w-ev [data-act="flip:slip_it"]', 900)
await ev("window.__freezeIn(110)"); await click('#w-ev [data-act="flip:slip_fac"]', 0)
await grab_when_frozen('B2-q2-flip-fac'); await seq('B2-q2-flip-fac', [120, 90, 90])
await wait(1500); await clear_toasts(); await grab('B3-q2-flipped-all')
# catch Halo with the HR slip (the heart on its back)
await drag('#w-ev [data-pick="slip_hr"]', '[data-drop="alibi:halo"]', 0, freeze=400 + 150)
await grab_when_frozen('B4-q2-catch-halo'); await seq('B4-q2-catch-halo', [130, 130, 150, 200])
await wait(4500); await clear_toasts()
await drag('#w-ev [data-pick="slip_it"]', '[data-drop="alibi:regent"]', 0, freeze=200)
await grab_when_frozen('B5-q2-catch-regent'); await seq('B5-q2-catch-regent', [120, 230, 200])
for i in range(14):
    await wait(700)
    if await pg.locator('[data-act="deal-no"]').count(): break
await deals_no(); await wait(4500); await clear_toasts()
# tap the glass (Final pay is in his tank)
await click('.lu-kickback .fig', 0); await ev("window.__freezeIn(260)"); await grab_when_frozen('B7-q2-glass1'); await seq('B7-q2-glass1', [400])
await wait(2600); await clear_toasts()
await click('.lu-kickback .fig', 0); await ev("window.__freezeIn(300)"); await grab_when_frozen('B7-q2-glass2'); await seq('B7-q2-glass2', [550])
await wait(2600); await clear_toasts()
await click('.lu-kickback .fig', 0); await ev("window.__freezeIn(900)"); await grab_when_frozen('B8-q2-spat')
await wait(3500); await clear_toasts()
print('tank', await st())
await drag('#w-ev [data-pick="slip_fac"]', '[data-drop="alibi:deadline"]', 0, freeze=400 + 300)
await grab_when_frozen('B6-q2-catch-deadline')
await wait(4500); await clear_toasts()
await drag('#w-ev [data-pick="slip_fin"]', '[data-drop="alibi:kickback"]', 0, freeze=400 + 300)
await grab_when_frozen('B9-q2-catch-kickback')
await wait(9000); await clear_toasts()
# the fifth forgery: mail
if not await ev("S.q.table==='mail'"):
    await click('.slot.tbl', 800)
    if await pg.locator('#pop [data-act="set-table:mail"]').count(): await pg.click('#pop [data-act="set-table:mail"]'); await wait(900)
await drag('#w-case .sticker', '.slot.val'); await click('.run', 2600)
await click('#w-ev [data-act="flip:mail_bye"]', 900)
await drag('#w-ev [data-pick="mail_bye"]', '[data-drop="alibi:bcc"]', 0, freeze=400 + 300)
await grab_when_frozen('B10-q2-catch-bcc')
print('after Q2', await st())
await wait(5000); await skip_cines(); await wait(1800)
# ================= Q3 =================
print('Q3', await st())
await clear_toasts()
ok = await drag('#w-ev .k-notice .chip', '.slot.val')
if not ok: await drag('#w-ev .chip.mini', '.slot.val')
await click('.run', 2200)
await drag('#w-ev [data-pick="policy"]', '#lie', 3000); await deals_no(); await shoo()
await click('.slot.tbl', 700)
if await pg.locator('#pop [data-act="set-table:badges"]').count(): await pg.click('#pop [data-act="set-table:badges"]'); await wait(700)
await drag('#w-case .sticker', '.slot.val'); await click('.run', 2800); await deals_no(); await shoo()
await ev("window.__armFreeze('#cine .g-lobby', 2400)")
await drag('#w-ev .tool', '#w-ev [data-pick="slip_it"]', 0)
# the door opens (Gordon badges in, in his robe)
await grab_when_frozen('C1-door', 20000); await seq('C1-door', [700])
for i in range(30):
    await wait(500)
    if not await ev("Cine.on"): break
await wait(2500); await deals_no(); await shoo(); await clear_toasts()
print('pre-break3', await st())
await drag('#w-ev [data-pick="badge"]', '#lie', 0, freeze=420 + 300)
await grab_when_frozen('C2-q3-break')
# finale: CASE CLOSED (the boardroom cutscene in between plays out untouched)
await ev("window.__armFreeze('#cine .cl-poster', 1400)")
await grab_when_frozen('C4-finale', 40000); await seq('C4-finale', [150, 150, 200, 250])
for i in range(40):
    await wait(1000)
    if await pg.locator('[data-cine="case2"]').count(): break
print('prog:', await ev("JSON.stringify({cases:Progress.cases, ach:Object.keys(Progress.ach)})"))
# ================= CASE 02 =================
await ev("window.__armFreeze('#cine .g-priya', 2850)")
await pg.click('[data-cine="case2"]')
await grab_when_frozen('D1-clinic', 20000); await seq('D1-clinic', [120, 120, 150])
await wait(600)
await ev("Cine.on && Cine.skipTo>=0 && Cine.i<Cine.skipTo && Cine.skip()"); await wait(900)
await pg.click('[data-cine="next"]'); await wait(1800)
print('C2', await st())
await clear_toasts()
await drag('#w-ev [data-pick="c2_mail_mv"]', '#w-trace .tr-drop'); await wait(900)
await drag('#w-ev [data-pick="c2_mail_pb"]', '#w-trace .tr-drop'); await wait(900)
await drag('#w-trace [data-pick="node:0:1"]', '#w-trace [data-pick="node:1:1"]'); await wait(900)
await drag('#w-trace [data-pick="node:0:2"]', '#w-trace [data-pick="node:1:2"]'); await wait(2200)
for i in range(14):
    await wait(700)
    if await pg.locator('[data-act="deal-no"]').count() or await pg.locator('[data-act="deal-yes"]').count(): break
await deals_no()
await drag('#w-ev [data-pick="c2_relay"]', '#lie'); await wait(4000)
await skip_cines(); await wait(1800)
print('C2 Q2', await st())
await click('[data-act="press:2"]', 1200)
await ev("S.q={table:'sends',field:'time',value:'09:02'}; renderSearch(); runSearch()"); await wait(2600)
await drag('#w-ev [data-pick="c2_sched"]', '[data-drop="stmt:2"]'); await wait(4000)
await skip_cines(); await wait(2600)
print('C2 Q3', await st())
await clear_toasts(); await shoo()
# the scissors held over relay-7
ra = await pg.locator('#w-ev .tool').first.bounding_box(); rb = await pg.locator('[data-drop="node:w:1"]').first.bounding_box()
await pg.mouse.move(ra['x'] + ra['width'] / 2, ra['y'] + ra['height'] / 2); await pg.mouse.down()
await pg.mouse.move(ra['x'] + ra['width'] / 2 + 20, ra['y'] + ra['height'] / 2 + 10, steps=3)
await pg.mouse.move(rb['x'] + rb['width'] / 2, rb['y'] + rb['height'] / 2, steps=12); await wait(600)
await grab('E1-hover-relay7')
await ev("window.__armFreeze('#cine .big-scissors', 600)")
await pg.mouse.up()
await grab_when_frozen('E2-cut', 20000); await seq('E2-cut', [100, 100, 100, 120, 200, 300])
await wait(4000)
print('end', await st())
print(json.dumps(log))
