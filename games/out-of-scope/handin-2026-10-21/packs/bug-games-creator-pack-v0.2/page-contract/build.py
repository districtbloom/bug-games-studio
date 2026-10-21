#!/usr/bin/env python3
"""REFERENCE COPY · this is the platform's page build. It does not run outside the platform (it needs the platform's page kit,
check.py and every roster game's poster module). Creators read it for REQUIRED_DATA, REQUIRED_HOOKS and OPTIONAL_HOOKS: the list of
what one game page consumes. Your package's art slots feed these hooks; you never write data.js or hooks.js.

bug.games game page kit v2: build one game page (desktop 1440 design, fluid 1280-1920, and the 390 phone) from a game folder.

    python3 build.py carbon                       # -> ../render/GameCarbon.dc.html + GameCarbonMobile.dc.html (+ support.js)
    python3 build.py carbon --layout A --out ../studies --suffix StudyA

A game folder (games/<key>/) holds: game.json, data.js, hooks.js, vendor/ (poster module + harvested art). See ../GAMEPAGE.md.
The build lints the folder (required data, required asset hooks, platform rules), assembles one .dc.html per width and runs check.py.
"""
import json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
LB = os.path.join(HERE, 'poster-modules')   # platform only: every roster game's poster module
rd = lambda *p: open(os.path.join(*p), encoding='utf-8').read()

REQUIRED_HOOKS = ['icon', 'cont', 'store', 'rw', 'seal', 'event', 'update', 'share', 'reward']   # keep in step with KIT.REQUIRED (core/kit.js)
OPTIONAL_HOOKS = ['poster', 'loop', 'roster', 'backdrop']
REQUIRED_DATA = ['key', 'name', 'no', 'slug', 'mod', 'maker', 'kicker', 'lead', 'love', 'revCount', 'chips', 'meta', 'playing', 'playingWord', 'hint', 'hintM', 'friends',
                 'echo', 'ownWord', 'boughtLine', 'cont.t', 'cont.s', 'cont.pct', 'cont.where',
                 'pass.name', 'pass.unit', 'pass.at', 'pass.left', 'pass.price', 'pass.desc', 'pass.rows', 'pass.free', 'pass.bug',
                 'ev.name', 'ev.text', 'ev.count', 'ev.unit', 'ev.ends', 'ev.when', 'media', 'store', 'storeSub', 'owned0', 'updates', 'reviews', 'aboutP', 'goal', 'details',
                 'controls', 'tips', 'achs', 'next.v', 'next.n', 'next.when', 'next.from', 'lastPct', 'requests', 'crew', 'followers', 'built', 'more', 'moreSub', 'dnote']
EMBER = '#ff5a36'
WARN = []
def die(msg): print('BUILD FAILED: ' + msg); sys.exit(1)
def warn(msg): print('  warning: ' + msg); WARN.append(msg)

def eval_data(path):
    js = "const src=require('fs').readFileSync(process.argv[1],'utf8');const GAME=new Function(src+';return GAME')();console.log(JSON.stringify(GAME))"
    r = subprocess.run(['node', '-e', js, path], capture_output=True, text=True)
    if r.returncode: die('data.js does not evaluate:\n' + r.stderr[-600:])
    return json.loads(r.stdout)

def dig(o, path):
    for k in path.split('.'):
        if not isinstance(o, dict) or k not in o: return None
        o = o[k]
    return o

def lint(data, hooks_src, folder):
    miss = [k for k in REQUIRED_DATA if dig(data, k) is None]
    if miss: die('data.js is missing: ' + ', '.join(miss))
    P = data['pass']
    if len(P['rows']) < 12: die('pass.rows needs one [item, ground, name] per step (at least 12)')
    if not 1 <= P['at'] <= len(P['rows']): die('pass.at must be inside pass.rows')
    if len(data['media']) != 3: die('media needs exactly 3 pictures (key art live, in the game, a still)')
    if len(data['controls']) != 3 or [c['id'] for c in data['controls']] != ['kbd', 'pad', 'touch']: die('controls needs kbd, pad, touch in that order')
    if len(data['more']) != 4: die('more needs 4 neighbour games')
    if not any(s.get('pass') for s in data['store']): die('store needs the pass as one item with pass: true')
    for it in data['store']:
        if not isinstance(it.get('crumbs'), int): die('store item "%s": price must be a whole number of crumbs' % it.get('id'))
    for m in data['more']:
        if not os.path.exists(os.path.join(LB, m['key'] + '.js')): die('more: no poster module for "%s" in the platform\'s poster modules' % m['key'])
    have = set(re.findall(r'ART\.draw\.(\w+)\s*=', hooks_src))
    if re.search(r'KIT\.delegate\(', hooks_src): have |= {'icon', 'cont', 'event', 'share', 'store', 'rw', 'seal', 'update'}
    for ex in re.findall(r'extra:\s*\[([^\]]*)\]', hooks_src): have |= set(re.findall(r"'(\w+)'", ex))
    gone = [h for h in REQUIRED_HOOKS if h not in have]
    if gone: die('hooks.js does not register: ' + ', '.join('ART.draw.' + h for h in gone))
    names = set()
    for k in ('media', 'updates'):
        for x in data[k]: names.add(x['draw'].split('|')[0])
    for n in sorted(names):
        if n not in have and n not in OPTIONAL_HOOKS: die('data.js asks for draw "%s" but hooks.js has no ART.draw.%s' % (n, n))
    for what, text in (('data.js', rd(folder, 'data.js')), ('hooks.js', hooks_src)):
        if EMBER in text.lower(): warn('%s uses the ember colour. Ember belongs to Play and Join only' % what)
    if re.search(r'teardown', json.dumps(data), re.I): warn('copy rule: never the word "teardown"')
    if len(data['lead']) > 110: warn('lead is %d characters; keep it to one or two lines (<= 110)' % len(data['lead']))
    if 'foot' in data and not (isinstance(data['foot'], list) and len(data['foot']) == 2): die('foot must be [desktop px, phone px]')
    if 'PROPOSED' not in data['dnote']: warn('dnote must say which content is PROPOSED')
    if not re.fullmatch(r'#[0-9A-Fa-f]{6}', data['echo']): die('echo must be a #RRGGBB colour')
    if data['echo'].lower() in ('#ff5a36', '#c4b5ff', '#ffcb57'): die('echo may not be ember, lilac or sun')

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args: die(__doc__)
    opt = lambda k, d: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
    key = args[0]; layout = opt('--layout', 'rec'); out = os.path.abspath(opt('--out', os.path.join(HERE, '..', 'render'))); suffix = opt('--suffix', '')
    folder = os.path.join(HERE, 'games', key)
    game = json.load(open(os.path.join(folder, 'game.json')))
    data = eval_data(os.path.join(folder, 'data.js'))
    hooks = rd(folder, 'hooks.js')
    lint(data, hooks, folder)

    # ---- markup: the layout with its partials ----
    P = lambda n: re.sub(r'\{#.*?#\}\n?', '', rd(HERE, 'core', 'parts', n + '.html'), flags=re.S)
    lay = re.sub(r'\{#.*?#\}\n?', '', rd(HERE, 'layouts', layout + '.html'), flags=re.S)
    tabs = P('tabs').replace('%%LIVEPANEL%%', P('livepanel').replace('%%live%%', P('live')) if layout == 'B' else '')
    for n, v in [('header', P('header')), ('footer', P('footer')), ('overlays', P('overlays')), ('hero', P('hero')), ('title', P('title')), ('you', P('you')),
                 ('live', P('live')), ('tabs', tabs), ('lower', P('lower'))]:
        lay = lay.replace('%%' + n + '%%', v)
    logo = re.search(r'<svg.*</svg>', rd(HERE, 'core', 'logo.svg'), re.S).group(0)
    markup = lay.replace('%%LOGO%%', logo)
    css = rd(HERE, 'core', 'base.css') + rd(HERE, 'core', 'parts.css') + rd(HERE, 'layouts', layout + '.css')

    # ---- script ----
    parts = [rd(folder, m) for m in game['modules']]
    roster = []
    for m in data['more']:
        if m['key'] not in roster and m['key'] != data['mod']: roster.append(m['key'])
    parts += [rd(LB, k + '.js') for k in roster]
    fonts = game.get('fonts', {})
    preload = fonts.get('preload', ["600 30px 'Bricolage Grotesque'", "400 12px 'DM Mono'"])
    parts.append(rd(HERE, 'core', 'kit.js').replace('%%FONTS%%', json.dumps({'preload': preload})))
    parts.append(rd(folder, 'data.js'))
    parts.append("const G = KIT.build(GAME);\ntry { window.__kit = { G, ART, KIT, MOBILE, LAYOUT }; } catch (e) {}")
    art = '\n'.join(rd(folder, a) for a in game.get('art', []))
    parts.append('// ---- ' + key + ': harvested art + asset hooks, in one function scope (KG = the kit\'s G, safe even if harvested code declares its own G or GAME) ----\n(function (KG, KGAME) {\n' + art + '\n' + hooks + '\n})(G, GAME);')
    parts.append(rd(HERE, 'core', 'comp.js'))
    js = '\n'.join(parts)
    if '</script>' in js: die('a source file contains </script>')
    fams = ['Bricolage+Grotesque:opsz,wght@12..96,400..800', 'DM+Mono:wght@400;500'] + [f.replace(' ', '+') for f in fonts.get('google', [])]
    link = 'https://fonts.googleapis.com/css2?family=' + '&amp;family='.join(fams) + '&amp;display=swap'

    def page(mobile):
        w, h = (390, 3400) if mobile else (1440, 3200)
        extra = '.m{width:390px;margin:0 auto}' if mobile else ''
        title = game['title'] + ' · game page' + (' · phone' if mobile else '') + (' · ' + suffix if suffix else '')
        return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="{link}">
<style>
{css}
{extra}
</style>
</helmet>
{markup}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{w},"height":{h}}}}}'>
const BUG_MODS = {{}};
const MOBILE = {'true' if mobile else 'false'};
const LAYOUT = '{layout}';
{js}
</script>
</body>
</html>
'''
    os.makedirs(out, exist_ok=True); files = []
    base = 'Game' + game['file'] + suffix
    for mobile, name in [(False, base), (True, base + 'Mobile')]:
        html = page(mobile); assert '%%' not in html, 'unreplaced %% token: ' + re.search(r'%%\w+%%', html).group(0)
        p = os.path.join(out, name + '.dc.html'); open(p, 'w', encoding='utf-8').write(html); files.append(p)
        print('wrote', os.path.relpath(p, os.path.join(HERE, '..')), len(html))
    open(os.path.join(out, 'support.js'), 'wb').write(open(os.path.join(HERE, 'core', 'support.js'), 'rb').read())
    r = subprocess.run([sys.executable, os.path.join(HERE, 'tools', 'check.py')] + files, capture_output=True, text=True); print(r.stdout.strip())
    if any('unclosed: []' not in l or 'errors: []' not in l or 'bad holes: []' not in l for l in r.stdout.splitlines()): die('check.py is not clean')
    print('OK %s %s%s' % (key, layout, ' with %d warning(s)' % len(WARN) if WARN else ''))

main()
