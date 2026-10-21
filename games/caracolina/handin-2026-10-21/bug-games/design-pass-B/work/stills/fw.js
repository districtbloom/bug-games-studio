function RNG(seed) { let a = seed >>> 0 || 1; const f = () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; return { f }; }
const PI = Math.PI;
function fireworks(t, t0, azC) { const out = [], R = RNG(5); for (let k = 0; k < 40; k++) { const at = t0 + k * .55 + R.f() * .3, age = (t - at) / 2.4; const az = azC + (R.f() - .5) * PI * .42, el = .17 + R.f() * .26, seed = R.f() * 7; if (age > 0 && age < 1) out.push([az, el, seed, age]); } return out.slice(-6); }
for (let lt = 1; lt <= 16; lt += 0.25) {
  const f = fireworks(lt, -1.5, 0);
  const s = f.map(b => `${(b[0] * 180 / PI).toFixed(0)}/${(b[1] * 180 / PI).toFixed(0)}/${b[3].toFixed(2)}`).join('  ');
  const good = f.filter(b => Math.abs(b[0]) < .3 && b[3] > .25 && b[3] < .8).length;
  console.log(lt.toFixed(2), good, s);
}
