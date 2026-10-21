import math
P=[(-15.66,-71.88,.804,.595),(-12.04,-75.22,.532,.847),(-7.46,-77.02,.186,.983),(-2.54,-77.03,-.185,.983),(2.05,-75.24,-.532,.847),(5.67,-71.89,-.804,.595)]
T=(-5,-64); TR=2.6
def seg_dist(a,b,p):
    ax,az=a; bx,bz=b; px,pz=p; dx,dz=bx-ax,bz-az; L=dx*dx+dz*dz; t=max(0,min(1,((px-ax)*dx+(pz-az)*dz)/L)); return math.hypot(ax+t*dx-px,az+t*dz-pz)
res=[]
for ex in [x*0.5 for x in range(-60,40)]:
  for ez in [z*0.5 for z in range(-150,-60)]:
    r=math.hypot(ex-T[0],ez-T[1])
    if r<3.2: continue
    ok=True; angs=[]; mind=1e9
    for (px,pz,nx,nz) in P:
        # panel edges +-1.7 along tangent
        tx,tz=nz,-nx
        for s in (-1.6,0,1.6):
            qx,qz=px+tx*s,pz+tz*s
            if seg_dist((ex,ez),(qx,qz),T)<TR: ok=False
        vx,vz=ex-px,ez-pz; d=math.hypot(vx,vz); mind=min(mind,d)
        if (vx*nx+vz*nz)/d<0.35: ok=False
        angs.append(math.atan2(pz-ez,px-ex))
    if not ok: continue
    a0=angs[0]; rel=[math.atan2(math.sin(a-a0),math.cos(a-a0)) for a in angs]
    span=max(rel)-min(rel)
    # include panel widths roughly
    res.append((math.degrees(span),ex,ez,round(r,1),round(mind,1)))
res.sort()
for x in res[:15]: print(x)
print('within summit r<11.5:')
for x in [y for y in res if y[3]<11.5][:15]: print(x)
