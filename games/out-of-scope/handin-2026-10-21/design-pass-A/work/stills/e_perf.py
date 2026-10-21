import time
await ev("Prefs.tutOff=true; savePrefs()")
await ev("S = freshState(); S.deals.d1='no'; S.tank='slip_fin'; S.found={slip_hr:1,slip_it:1,slip_fac:1,slip_fin:1,locker:1}; S.flags.lie1=true; Title.hide(); buildDesk(); startBeat(2)")
await wait(3000)
fps = await ev("new Promise(r => { let n=0, t0=performance.now(); function f(){ n++; if (performance.now()-t0 < 2000) requestAnimationFrame(f); else r(n/2); } requestAnimationFrame(f); })")
print('fps', fps)
t = time.time(); await shot('perf-full'); print('full shot', time.time()-t)
t = time.time(); await shot('perf-clip', clip={'x':350,'y':490,'width':720,'height':360}); print('clip shot', time.time()-t)
