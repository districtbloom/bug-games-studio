await ev("Prefs.tutOff=true; savePrefs()")
await ev("S = freshState(); S.deals={d1:'no',d2:'no'}; S.found={session:1}; S.caught={halo:'slip_hr',regent:'slip_it',deadline:'slip_fac',kickback:'slip_fin',bcc:'mail_bye'}; S.flags.lie1=true; S.flags.lie2=true; Title.hide(); buildDesk(); startBeat(3)")
await wait(2500); await shot('ph-q3')
print(await ev("JSON.stringify([...document.querySelectorAll('#taskbar [data-act^=\"tab:\"]')].map(e=>e.dataset.act))"))
for t in ['ev','lineup','search','result']:
    if await pg.locator(f'[data-act="tab:{t}"]').count():
        await pg.click(f'[data-act="tab:{t}"]'); await wait(500); await shot('ph-tab-' + t)
print(await ev("JSON.stringify({lie: (()=>{const r=document.querySelector('#lie').getBoundingClientRect(); return [r.x,r.y,r.width,r.height]})(), regent: (()=>{const r=document.querySelector('#regent').getBoundingClientRect(); return [r.x,r.y,r.width,r.height]})()})"))
