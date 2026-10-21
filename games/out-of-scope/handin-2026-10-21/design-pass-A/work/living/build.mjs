// Pack work/living/geo.json (extracted from the game's drawing code) into the module template src/living.js
// and write the classic-JS module bug/living-poster/outofscope.js.
// Entry format in the module: [part, fill, stroke, sw, flags, op, subs, closed]
//   flags: b = brush hatch (OL fill), r = rough line, s = fine rough line, g = the glass gradient, p = pupil
import fs from 'fs';
const geo = JSON.parse(fs.readFileSync('/home/claude/designpass/work/living/geo.json', 'utf8'));
const src = fs.readFileSync('/home/claude/designpass/src/living.js', 'utf8');
const r1 = (v) => { const x = Math.round(v * 10) / 10; return Object.is(x, -0) ? 0 : x; };
function pack(e, partOverride) {
  if (e.op === 0) return null;
  // SVG quirk the game relies on: a filtered element whose bounding box has zero width or height renders nothing
  // (the gleeful grin's tooth lines, the hat brim line, the tie's centre line are invisible in the game and the poster)
  if (e.filter) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const s of e.sub) for (let i = 0; i < s.length; i += 2) { x0 = Math.min(x0, s[i]); x1 = Math.max(x1, s[i]); y0 = Math.min(y0, s[i + 1]); y1 = Math.max(y1, s[i + 1]); }
    if (x1 - x0 < 0.01 || y1 - y0 < 0.01) return null;
  }
  let part = partOverride || e.part;
  if (e.part === 'arm' && /^M298 84/.test(e.d0)) part = 'swish';
  let fl = '';
  if (e.filter === 'brush') fl += 'b';
  if (e.filter === 'rough') fl += 'r';
  if (e.filter === 'roughS') fl += 's';
  if (e.grad) fl += 'g';
  if (e.part === 'face' && e.tag === 'circle' && e.fill === '#050407') fl += 'p';
  const subs = e.sub.map((s) => s.map(r1));
  // the filter region (the element's bounding box + 5% each side) clips what the filter draws: e.g. the gleeful eyes'
  // 8-unit arcs come out thin with flat ends in the game. Recorded where the element's own space is the part's (translation only).
  let clip = 0;
  if (e.filter && e.m && Math.abs(e.m[0] - 1) < 1e-6 && Math.abs(e.m[3] - 1) < 1e-6 && !e.m[1] && !e.m[2]) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const s of e.sub) for (let i = 0; i < s.length; i += 2) { x0 = Math.min(x0, s[i]); x1 = Math.max(x1, s[i]); y0 = Math.min(y0, s[i + 1]); y1 = Math.max(y1, s[i + 1]); }
    const mx = (x1 - x0) * 0.05, my = (y1 - y0) * 0.05;
    clip = [x0 - mx, y0 - my, x1 + mx, y1 + my].map(r1);
  } else if (e.filter && e.m) {
    // rotated element (the OK box): the region is its bounding box in its own space; pass the matrix along
    const [a, b, c, d, tx, ty] = e.m, det = a * d - b * c;
    const inv = (x, y) => [(d * (x - tx) - c * (y - ty)) / det, (-b * (x - tx) + a * (y - ty)) / det];
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const s of e.sub) for (let i = 0; i < s.length; i += 2) { const [u, v] = inv(s[i], s[i + 1]); x0 = Math.min(x0, u); x1 = Math.max(x1, u); y0 = Math.min(y0, v); y1 = Math.max(y1, v); }
    const mx = (x1 - x0) * 0.05, my = (y1 - y0) * 0.05;
    clip = [x0 - mx, y0 - my, x1 + mx, y1 + my].map((v) => Math.round(v * 100) / 100).concat(e.m);
  }
  return [part, e.fill || '', e.stroke || '', e.sw ? r1(e.sw) : 0, fl, e.op != null ? e.op : 1, subs, e.closed.join(''), clip];
}
const reg = geo.REG.gleeful.filter((e) => e.part !== 'face').map((e) => pack(e)).filter(Boolean);
const faces = {};
for (const emo of Object.keys(geo.REG)) faces[emo] = geo.REG[emo].filter((e) => e.part === 'face').map((e) => pack(e)).filter(Boolean);
// sanity: the non-face parts are identical across emotions (only the face and the hat's transform change)
for (const emo of Object.keys(geo.REG)) {
  const a = JSON.stringify(geo.REG[emo].filter((e) => e.part !== 'face').map((e) => e.sub));
  const b = JSON.stringify(geo.REG.gleeful.filter((e) => e.part !== 'face').map((e) => e.sub));
  if (a !== b) console.log('note: body differs for', emo);
}
const data = { reg, faces, crt: geo.CRT.map((e) => pack(e)).filter(Boolean), hand: geo.HAND.map((e) => pack(e)).filter(Boolean), pic: geo.PIC.map((e) => pack(e)).filter(Boolean) };
const lit = JSON.stringify(data);
if (!src.includes('null /*GEO*/')) throw new Error('template has no GEO slot');
const out = src.replace('null /*GEO*/', lit);
fs.mkdirSync('/home/claude/designpass/bug/living-poster', { recursive: true });
fs.writeFileSync('/home/claude/designpass/bug/living-poster/outofscope.js', out);
console.log('wrote bug/living-poster/outofscope.js', (out.length / 1024).toFixed(1) + ' KB', 'data', (lit.length / 1024).toFixed(1) + ' KB');
