import time
await ev("try{localStorage.clear()}catch(e){}"); await pg.reload(); await pg.wait_for_function("document.documentElement.dataset.ready")
await ev("Progress.cases[1]={done:true,cred:95,hints:1,deals:1,stopAt:1000}; saveProg(); Prefs.tutOff=true; savePrefs(); Title.show()")
await ev("""(() => {
  window.__fz = []; window.__frozen = false;
  window.__freeze = () => { window.__fz = document.getAnimations().filter(a => a.playState === 'running'); window.__fz.forEach(a => a.pause()); window.__frozen = true; };
  window.__thaw = () => { window.__fz.forEach(a => { try { a.play(); } catch (e) {} }); window.__fz = []; window.__frozen = false; };
  window.__armFreeze = (sel, ms) => { window.__frozen = false; const iv = setInterval(() => { if (document.querySelector(sel)) { clearInterval(iv); setTimeout(window.__freeze, ms); } }, 8); };
})()""")
async def hold_grab(name):
    await pg.wait_for_function("window.__frozen", polling=5, timeout=30000)
    await pg.clock.pause_at((await ev("Date.now()") + 1) / 1000)
    t = time.time(); await shot(name); print('grab', name, round(time.time() - t, 2))
    await ev("window.__thaw()"); await pg.clock.resume()
await wait(500)
await pg.click('[data-title="new"]'); await wait(1400)
await ev("window.__armFreeze('#cine .g-priya', 3000)")
await pg.click('[data-hub="case:2"]')
await hold_grab('clk-clinic-3000')
await ev("setTimeout(window.__freeze, 1400)")
await hold_grab('clk-clinic-4400')
