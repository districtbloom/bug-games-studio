/* Stage 1 style sheet board for OUT OF SCOPE (bug.games package). Rendered on the game's own page for its fonts. */
window.SHEETB = (() => {
  const R = 'file:///home/claude/bugpack/stage1/';
  const sw = (hex, name, role, reading, cls = '') => `<div class="sw ${cls}"><i style="background:${hex}"></i><b>${hex}</b><span>${name}</span><em>${role}</em><small>${reading}</small></div>`;
  const ref = (f, cap) => `<figure><img src="${R}ref/${f}"><figcaption>${cap}</figcaption></figure>`;
  const zoom = (f, x, y, w, h, cap) => `<figure class="zm"><div style="background-image:url(${R}${f});background-position:-${x}px -${y}px;width:${w}px;height:${h}px"></div><figcaption>${cap}</figcaption></figure>`;
  function html() {
    return `<div class="bd">
  <header><div class="t">OUT OF <span>SCOPE</span></div><div class="s">bug.games package · stage 1 · style sheet + three pilots · dry run, nothing published</div></header>

  <h2>1 · Reference frames, from the game itself</h2>
  <div class="refs">
    ${ref('r-keyart-16x9.png', 'Key art (16:9 poster made in this chat)')}
    ${ref('r-title.png', 'Title screen: the cracked monitor, eyes in the dark')}
    ${ref('r-roll-regent.png', 'Cold open roll call: Regent')}
    ${ref('r-case-poster.png', 'Case poster card: “Did he fire himself?”')}
    ${ref('r-desk-smash.png', 'Play: a lie breaks (ink, halftone ring, paper shreds)')}
    ${ref('r-storm.png', 'Cold open: the 09:02 approval storm')}
  </div>

  <h2>2 · The look, in rules</h2>
  <div class="rules">
    <div class="rule"><h3>Line</h3><p>One black marker line, <b>#15131a</b>, round caps and joins. 5–8 px on a 1600-wide piece, 3–4 px on a 92 px mark. Every line is roughened by a small turbulence displacement, so no edge is ever a clean vector curve. Thin inner lines (pinstripes, teeth) are the same ink at half weight.</p></div>
    <div class="rule"><h3>Fill</h3><p>Flat, saturated fills laid with a dry-brush hatch, and a second copy of the fill shoved 3 px down-right under the line, so colour slips off the outline like a careless print. No gradients, except the one light below.</p></div>
    <div class="rule"><h3>Ground and texture</h3><p>Void black with big torn-paper patches: <b>acid</b> low left, <b>hot pink</b> high right, <b>cobalt</b> low right, edges ragged. A few white specks. Things cast hard offset shadows (8–14 px, black at 45–60 %), never a blur.</p></div>
    <div class="rule"><h3>Light</h3><p>Flat comic light. One light source in the whole world: the <b>acid glow</b> through the cracked monitor glass (acid → toxic green → black). Screens and LEDs may glow inside themselves only. No fog, no bloom over the scene.</p></div>
    <div class="rule"><h3>Lettering</h3><p>The title in <b>Tabloid</b> (TeX Gyre Heros Condensed Bold): caps, tight, white over acid, the acid word shadowed in cobalt, then black, boxed by a dashed selection frame with a red cursor. Speech in <b>Bonum Bold Italic</b> on white paper boxes; tags in mono. Lettering only on the title lockup, share card and cover. Never on a poster, still, seal, store or pass tile.</p></div>
    <div class="rule"><h3>Cast and objects</h3><p>The gang: Regent (empty suit, paper hat with an OK stamp), Kickback (shark), Halo (pill), Deadline (bomb), Bcc (many-eyed ghost), Floss (tooth), the Principal (monolith). Humans: Gordon, Priya. Objects: the cream CRT, forged slips with a colour bar, envelopes, rubber stamps, the phone badge. The small-mark hero is <b>the monitor wearing Regent’s hat, grinning</b>.</p></div>
  </div>

  <h2>3 · Palette, measured (tools/measure.py colour, ΔE2000 to ember · lilac · sun)</h2>
  <div class="pal">
    ${sw('#0b0a0e', 'Void', 'ground of every plate', 'ember 54.3 · lilac 68.6 · sun 80.6 free')}
    ${sw('#15131a', 'Ink', 'the marker line', 'ember 53.4 · lilac 66.5 · sun 80.7 free')}
    ${sw('#e6ff2e', 'Acid', 'the game’s ink: glow, eyes, title', 'ember 60.7 · lilac 67.2 · sun 21.1 free (1.1 from caution)')}
    ${sw('#ff2e88', 'Hot pink', 'torn patch, Halo', 'ember 25.7 · lilac 32.9 · sun 57.7 free')}
    ${sw('#1f4bff', 'Cobalt', 'torn patch, title shadow', 'ember 51.4 · lilac 34.8 · sun 74.5 free')}
    ${sw('#fffbea', 'Paper', 'slips, hat, speech', 'ember 40.3 · lilac 34.7 · sun 23.1 free')}
    ${sw('#f3eee4', 'Cream plastic', 'the monitor, the pot', 'ember 37.3 · lilac 29.9 · sun 23.6 free')}
    ${sw('#39e07a', 'Toxic', 'glow fringe, fern', 'ember 72.4 · lilac 47.4 · sun 36.2 free')}
    ${sw('#222b72', 'Ghost navy', 'Bcc', 'ember 54.7 · lilac 56.1 · sun 82.4 free')}
    ${sw('#1f1d27', 'Suit', 'Regent', 'ember 51.7 · lilac 63.9 · sun 79.5 free')}
    ${sw('#8ff0cf', 'Mint', 'Floss', 'ember 62.2 · lilac 37.6 · sun 35.2 free')}
    ${sw('#d4141c', 'Blood', 'the only red: stamps, OK mark', 'ember 15.8 caution · 120 px rule', 'cau')}
    ${sw('#ff8a1f', 'Fuse', 'Deadline', 'ember 17.2 · sun 20.7 caution · 120 px rule', 'cau')}
    ${sw('#7189a6', 'Shark', 'Kickback', 'lilac 19.9 caution · 120 px rule', 'cau')}
    ${sw('#ffc400', 'Gold (retired)', 'was coins, keys', 'sun 5.1 GUARDED · replaced by acid', 'off')}
    ${sw('#ff2a1a', 'LED red (retired)', 'was Deadline’s digits', 'ember 6.2 GUARDED · replaced by blood bars', 'off')}
    ${sw('#c86a3c', 'Terracotta (refused)', 'first pot colour', 'ember 10.9 GUARDED · pot is cream', 'off')}
    ${sw('#d8cfb3', 'Beige (retired)', 'old monitor plastic', 'sun 18.1 caution · cream instead', 'off')}
  </div>
  <p class="note">Guarded colours are gone from package art. Caution colours stay inside characters only, never as a flat block, and never within 120 px of Play, a price or a selected state. Accent for game.json: <b>#e6ff2e</b>.</p>

  <h2>4 · Line, fill and light up close</h2>
  <div class="zooms">
    ${zoom('pilots/poster.png', 1000, 70, 350, 280, 'Marker line + offset fill + brush hatch (Regent)')}
    ${zoom('pilots/poster.png', 1010, 520, 350, 280, 'The one light: acid through the crack')}
    ${zoom('pilots/poster.png', 0, 650, 350, 280, 'Torn patch edge, hard shadow')}
    ${zoom('pilots/poster.png', 1860, 780, 350, 280, 'Deadline: blood bars, no digits')}
  </div>

  <h2>5 · Never</h2>
  <ul class="never">
    <li>Crowns; anything gold (#ffc400)</li><li>Ember-red (#ff2a1a) or any platform ember / lilac / sun as a flat block</li>
    <li>Blur, bloom, fog, soft 3D, rounded plates</li><li>Gradients other than the monitor glow</li>
    <li>Numbers, prices or dates in stills, seals, store or pass art</li><li>Scrawled words or titles on anything that can shrink below ~200 px</li>
    <li>Gore, real swearing (grawlix only), real brands, logos or people</li><li>Another game’s characters, art, names or text</li>
  </ul>

  <h2>6 · The three pilots</h2>
  <div class="pilots">
    <figure class="pp"><img src="${R}pilots/poster.png"><figcaption><b>poster</b> · 2400×1200 master (2:1) · no lettering · bottom 30 px of 800 plain · focus (0.50, 0.45) · light: <b>L 0.35 C 0.325 mid</b></figcaption></figure>
    <figure class="sq"><img src="${R}squint.png"><figcaption>squint previews: 740×370 · 260×367 · 150×177 · 90×70</figcaption></figure>
    <div class="row">
      <figure class="ic"><img src="${R}mark.png"><figcaption><b>icon-46</b> · 92×92 · drawn for 46: the monitor wearing Regent’s hat, grinning. 1× on night and on linen beside stand-in shapes, then 2× nearest</figcaption></figure>
      <figure class="st"><img src="${R}store.png"><figcaption><b>store-office-fern</b> · 400×400 · “Gordon’s fern”: a desk companion, looks only · 40 px and grey read at right · price <b>UNDECIDED (Q1)</b></figcaption></figure>
    </div>
  </div>
  <footer>All art drawn with the game’s own drawing code (marker line, offset fill, rough displacement), composed new for each slot. References in section 1 are captures of the running game, for the look only.</footer>
</div>`;
  }
  return { show() { let el = document.getElementById('bdw'); if (!el) { el = document.createElement('div'); el.id = 'bdw'; document.body.appendChild(el); } el.innerHTML = html(); return true; } };
})();
