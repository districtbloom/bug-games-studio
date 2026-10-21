/* Perlune · owned mark · verb: "absorbed"
 *
 * A bead of liquid pearl drops into the tile's lower-left corner, splashes, pulls its splash back in (the way the
 * droplet absorbs the matter it breaks), spreads and closes into a small pearl seal, and one ripple runs out once.
 * As it sets, the droplet's own small glass crest (0x9ff6ff) rises on the seal: what the droplet absorbs is its own.
 * Drawn in Canvas 2D with Perlune's own material maths, flattened to 2D: the pearl body (the game's PEARL / LIQUID
 * look: a cool white dome lit from the upper left, one horizon reflection, a thin-film fringe in the creature's own
 * dust colours pink 0xff5c9a and cyan 0x5ff3ff) and the game's dash afterimages for the fall. No gold, no glow.
 *
 * API (the only global this file creates is BUG_REWARD):
 *   BUG_REWARD.verb   'absorbed'
 *   BUG_REWARD.ms     800            play length in ms (once, under 900 ms); it starts at t = 0 with the bead visible
 *   BUG_REWARD.draw(ctx, w, h, t)    paint the mark for time t (0..1) onto ctx, over a tile of w x h (CSS px; apply any
 *                                    devicePixelRatio transform to ctx first). t = 1 is the held frame; t >= 0.92 looks
 *                                    the same as the held frame. draw() never clears: use a transparent overlay canvas
 *                                    and clearRect it before each frame (or redraw the tile underneath).
 *   BUG_REWARD.held(ctx, w, h)       same as draw(ctx, w, h, 1)
 * Play once:  const t0 = performance.now(); (function f(now){ const t = Math.min(1, (now - t0) / BUG_REWARD.ms);
 *               ctx.clearRect(0, 0, w, h); BUG_REWARD.draw(ctx, w, h, t); if (t < 1) requestAnimationFrame(f); })(t0);
 * Reduced motion: call held() only.
 * The mark sits in the lower-left corner (centre at 15.5% / 84.5% of the tile, radius 9.5% of its side; the ripple
 * reaches 23%) and never enters the top corners where NEW and YOURS sit.
 */
var BUG_REWARD = (function () {
  'use strict';
  var CREST = true, NIGHT = '5,4,10', PINK = '255,92,154', CYAN = '95,243,255';
  var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };
  var seg = function (t, a, b) { return clamp((t - a) / (b - a), 0, 1); };
  var easeIn = function (x) { return x * x; };
  var easeOut = function (x) { return 1 - (1 - x) * (1 - x); };
  var easeOutCubic = function (x) { return 1 - Math.pow(1 - x, 3); };
  // damped spring 0 -> 1 with overshoot, exactly 1 at x = 1 (the game's elastic() feel)
  var spring = function (x) { if (x >= 1) return 1; return 1 - Math.exp(-6 * x) * Math.cos(x * 10.5) * (1 - x); };

  // the pearl body, shaded as the game's pearl: lit from the upper left, a thin-film fringe, one horizon reflection
  // outline: an ellipse, or (lobe > 0) a liquid edge with soft lobes, as a spreading drop of the droplet's metal
  function body(ctx, rx, ry, lobe, ph) {
    ctx.beginPath();
    if (!lobe) { ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); return; }
    for (var i = 0; i <= 72; i++) {
      var th = i / 72 * Math.PI * 2, k = 1 + lobe * (Math.sin(5 * th + ph) * 0.62 + Math.sin(8 * th + 2.1 + ph * 0.5) * 0.38);
      var X = Math.cos(th) * rx * k, Y = Math.sin(th) * ry * k; if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
    }
    ctx.closePath();
  }
  function pearl(ctx, x, y, rx, ry, rot, a, fringe, lobe, ph) {
    if (rx <= 0.2 || ry <= 0.2 || a <= 0) return;
    lobe = lobe || 0; ph = ph || 0;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.globalAlpha = a;
    var r = Math.max(rx, ry);
    body(ctx, rx, ry, lobe, ph);
    var g = ctx.createRadialGradient(-rx * 0.38, -ry * 0.42, r * 0.05, -rx * 0.1, -ry * 0.12, r * 1.25);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.32, '#eef2fb'); g.addColorStop(0.7, '#b9bad0'); g.addColorStop(1, '#6e6b88');
    ctx.fillStyle = g; ctx.fill();
    // thin-film fringe near the edge (pink on one side, cyan on the other), as the game's film() on its rims
    if (fringe > 0) {
      ctx.save(); ctx.clip();
      var lg = ctx.createLinearGradient(-rx, ry, rx, -ry);
      lg.addColorStop(0, 'rgba(' + PINK + ',' + (0.75 * fringe) + ')'); lg.addColorStop(0.45, 'rgba(255,255,255,0)');
      lg.addColorStop(0.55, 'rgba(255,255,255,0)'); lg.addColorStop(1, 'rgba(' + CYAN + ',' + (0.7 * fringe) + ')');
      ctx.lineWidth = r * 0.22; ctx.strokeStyle = lg;
      body(ctx, rx, ry, lobe, ph); ctx.stroke();
      ctx.restore();
    }
    // horizon reflection: one bright band just below the middle, bowed up, as on the droplet's chrome
    ctx.save(); body(ctx, rx, ry, lobe, ph); ctx.clip();
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = Math.max(1, r * 0.07);
    ctx.beginPath(); ctx.ellipse(0, ry * 0.62, rx * 1.05, ry * 0.5, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.restore();
    // key highlight, upper left
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); ctx.ellipse(-rx * 0.38, -ry * 0.44, rx * 0.2, ry * 0.13, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(rx * 0.3, -ry * 0.5, r * 0.05, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function draw(ctx, w, h, t) {
    t = clamp(t, 0, 1);
    var u = Math.min(w, h), cx = 0.155 * w, cy = 0.845 * h, R = 0.095 * u;
    var T_HIT = 0.3;
    ctx.save();
    ctx.lineCap = 'round';

    // 1 · the fall (0 .. T_HIT): from above-right into the corner, stretched along its path, with two afterimages
    if (t < T_HIT + 0.02) {
      var p = function (k) { k = easeIn(k); return { x: cx + (0.25 * w - cx) * (1 - k) - 0.04 * u * Math.sin(k * Math.PI), y: cy + (0.47 * h - cy) * (1 - k) }; };
      var k = seg(t, 0, T_HIT), r0 = 0.062 * u;
      for (var i = 2; i >= 0; i--) {
        var kk = Math.max(0, k - i * 0.07), q = p(kk), q2 = p(Math.min(1, kk + 0.02));
        var ang = Math.atan2(q2.y - q.y, q2.x - q.x), st = 1 + 0.45 * kk;
        pearl(ctx, q.x, q.y, r0 * st, r0 / Math.sqrt(st), ang, i === 0 ? 1 : 0.28 / i, i === 0 ? 1 : 0);
      }
    }

    if (t >= T_HIT) {
      var s = seg(t, T_HIT, 1);
      // 2 · one ripple, running out once from the impact
      var rk = seg(t, T_HIT + 0.02, 0.9);
      if (rk > 0 && rk < 1) {
        var rr = R * (1.0 + 1.45 * easeOutCubic(rk)), ra = (1 - rk) * (1 - rk) * 0.9;
        ctx.lineWidth = Math.max(1, R * 0.12 * (1 - rk) + 0.6);
        ctx.strokeStyle = 'rgba(244,248,255,' + ra + ')';
        ctx.beginPath(); ctx.ellipse(cx, cy, rr, rr * 0.92, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.lineWidth = Math.max(0.8, R * 0.05 * (1 - rk));
        ctx.strokeStyle = 'rgba(' + CYAN + ',' + (ra * 0.6) + ')';
        ctx.beginPath(); ctx.ellipse(cx, cy, rr * 0.93, rr * 0.86, 0, Math.PI * 0.9, Math.PI * 2.1); ctx.stroke();
        ctx.strokeStyle = 'rgba(' + PINK + ',' + (ra * 0.55) + ')';
        ctx.beginPath(); ctx.ellipse(cx, cy, rr * 1.06, rr * 0.98, 0, -Math.PI * 0.1, Math.PI * 1.0); ctx.stroke();
      }

      // 3 · the splash: four drops thrown out at impact, then pulled back in and absorbed
      var sk = seg(t, T_HIT, 0.62);
      if (sk > 0 && sk < 1) {
        for (var j = 0; j < 4; j++) {
          var a = -Math.PI * 0.95 + j * 0.62 + (j % 2) * 0.12, out = Math.sin(Math.PI * Math.pow(sk, 0.8)) * R * (1.05 + 0.25 * (j % 2));
          var dr = R * (0.2 - 0.06 * (j % 2)) * (1 - sk * 0.6);
          pearl(ctx, cx + Math.cos(a) * (R * 0.7 + out), cy + Math.sin(a) * (R * 0.7 + out) * 0.9, dr, dr, 0, 1, 0);
        }
      }

      // 4 · contact shadow (dark, so the seal reads on the brightest ground)
      var grow = spring(seg(t, T_HIT, 0.8));
      var sh = ctx.createRadialGradient(cx, cy + R * 0.08, R * 0.7, cx, cy + R * 0.08, R * 1.42);
      sh.addColorStop(0, 'rgba(' + NIGHT + ',' + (0.6 * Math.min(1, s * 3)) + ')'); sh.addColorStop(1, 'rgba(' + NIGHT + ',0)');
      ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(cx, cy + R * 0.08, R * 1.42, 0, Math.PI * 2); ctx.fill();

      // 5 · the bead lands: squash and spread (from the falling bead's size to the seal's), springing to rest
      var sq = Math.exp(-7 * s) * Math.cos(s * 18) * (1 - s), rad = 0.062 * u + (R - 0.062 * u) * grow;
      var bx = rad * (1 + 0.42 * sq), by = rad * (1 - 0.36 * sq);
      // it closes: the splash's lobes pull in until a small round seal is left (a trace of liquid edge stays)
      var lobe = 0.03 + 0.26 * Math.exp(-5 * s) * (1 - s);

      // 6 · the seal sets: a small glass crest rises behind the bead's top, the droplet's own crest (0x9ff6ff glass), so the
      //     corner carries the droplet's mark: what it has absorbed is its own
      var ek = spring(seg(t, 0.5, 0.92));
      if (ek > 0.01 && CREST) {
        var ch = R * 0.62 * ek, cw = R * 0.26, bxx = cx + R * 0.1, byy = cy - by * 0.86;
        ctx.save(); ctx.translate(bxx, byy); ctx.rotate(0.22);
        ctx.beginPath(); ctx.moveTo(-cw, 0); ctx.lineTo(0, -ch); ctx.lineTo(cw, 0); ctx.closePath();
        var cg = ctx.createLinearGradient(-cw, -ch, cw, 0);
        cg.addColorStop(0, 'rgba(225,253,255,0.95)'); cg.addColorStop(0.5, 'rgba(159,246,255,0.75)'); cg.addColorStop(1, 'rgba(70,150,170,0.85)');
        ctx.fillStyle = cg; ctx.fill();
        ctx.strokeStyle = 'rgba(' + NIGHT + ',0.45)'; ctx.lineWidth = Math.max(0.8, R * 0.04); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = Math.max(0.8, R * 0.035);
        ctx.beginPath(); ctx.moveTo(-cw * 0.55, -ch * 0.12); ctx.lineTo(-cw * 0.05, -ch * 0.85); ctx.stroke();
        ctx.restore();
      }
      pearl(ctx, cx, cy, bx, by, 0, 1, 1, lobe, 0.9 + 2.0 * s * (1 - s));   // the bead, over the crest's foot
    }
    ctx.restore();
  }
  return { verb: 'absorbed', ms: 800, draw: draw, held: function (ctx, w, h) { draw(ctx, w, h, 1); } };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = BUG_REWARD;
