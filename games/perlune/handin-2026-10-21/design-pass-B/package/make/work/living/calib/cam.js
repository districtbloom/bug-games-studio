// calibrate the poster camera (titlejs B view) in camera space
const V=(x,y,z)=>({x,y,z}), add=(a,b)=>V(a.x+b.x,a.y+b.y,a.z+b.z), sub=(a,b)=>V(a.x-b.x,a.y-b.y,a.z-b.z), sc=(a,s)=>V(a.x*s,a.y*s,a.z*s);
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z, cross=(a,b)=>V(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x), nrm=a=>sc(a,1/Math.hypot(a.x,a.y,a.z));
function rotAround(v,k,a){ // Rodrigues
  const c=Math.cos(a), s=Math.sin(a); return add(add(sc(v,c), sc(cross(k,v),s)), sc(k,dot(k,v)*(1-c)));
}
const T={ ud:[-0.2768,0.9578,-0.0772], lift:5.5, cam:-0.33, face:-0.2, dist:5.6, up:1.1, ty:0.25, fov:0.62, side:0.8 };
const nacre=V(430,0,120), r=17, U=V(0,1,0);
const ud=nrm(V(...T.ud)); const C=add(nacre, sc(ud, r+T.lift));
let E=sub(V(0,0,0),C); E.y=0; E=nrm(E);
let fc=sc(E,-1); fc=rotAround(fc,U,T.cam);
let fa=rotAround(fc,U,T.face);
const rt=nrm(cross(fc,U));
const pos=add(add(C,sc(fc,T.dist)),sc(U,T.up)); const tgt=add(add(C,sc(U,T.ty)),sc(rt,T.side));
const f=nrm(sub(tgt,pos)); const right=nrm(cross(f,U)); const up2=cross(right,f);
const toCam=p=>{ const d=sub(p,pos); return V(dot(d,right),dot(d,up2),-dot(d,f)); }; // z negative in front
const dirCam=d=>V(dot(d,right),dot(d,up2),-dot(d,f));
const W=1600,H=800, th=Math.tan(T.fov/2);
const proj=p=>{ const c=toCam(p); const z=-c.z; return [W/2 + c.x/z/th*(H/2), H/2 - c.y/z/th*(H/2), z]; };
console.log('C proj',proj(C));
console.log('ud cam',dirCam(ud));
// light
const bk=nrm(sub(pos,tgt)); const rt2=nrm(cross(U,bk));
const L=nrm(add(add(sc(rt2,-0.6),sc(U,0.45)),sc(bk,-0.55)));
console.log('L cam',dirCam(L));
console.log('U cam',dirCam(U), 'fa cam',dirCam(fa));
// creature frame: x = cross(n, face), y = n, z = face  (n = U for title)
const X=nrm(cross(U,fa)), Y=U, Z=fa;
const loc=(x,y,z)=>add(C, add(add(sc(X,x),sc(Y,y)),sc(Z,z)));
const lx=-0.7*0.13, ly=0.9*0.09;
for(const sx of [-1,1]){ console.log('eye',sx, proj(loc(sx*0.29+lx,0.26+ly,0.86)), 'catch', proj(loc(sx*0.29-0.035+lx,0.31+ly,0.92))); }
console.log('crest base', proj(loc(0,0.95,-0.15)), 'top', proj(add(loc(0,0.95,-0.15), sc(rotAround(Y, X, -0.5),0.42))));
// sphere silhouette radius approx
const d=Math.hypot(...Object.values(sub(C,pos))); console.log('dist',d,'R px', Math.tan(Math.asin(1/d))/th*(H/2));
console.log('X cam',dirCam(X),'Z cam',dirCam(Z));
// eclipse
console.log('umbra proj', proj(V(0,0,0)));
console.log(JSON.stringify({pos,f,right,up2,C,L,fa,X,Y,Z,ud}));
