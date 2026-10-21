"""Try variants of one mark side by side (work tool): python3 mk_variants.py <mark> <out.png> '<json {id: {overrides}}>' [--test]
Each variant = the mark's view with overrides (view keys) and optional 'tone' / 'ground' / 'reduce' keys."""
import json, os, subprocess, sys
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mk_render as MR, mk_finish as F, mk_marks as MM

SCR = '/tmp/claude-0/-home-claude/abf4d099-0c77-5d2d-a155-12d3f9d77b55/scratchpad/marks/var'


def main():
    name, out, js = sys.argv[1], sys.argv[2], json.loads(sys.argv[3]); test = '--test' in sys.argv
    m = MM.MARKS[name]; size = m['size']; shown = size // 2
    os.makedirs(SCR, exist_ok=True)
    views = []
    for vid, ov in js.items():
        v = dict(m['view']); v.update({k: x for k, x in ov.items() if k not in ('tone', 'ground', 'reduce')})
        views += MR.pair(vid, **v)
    css = size * (2 if test else 4)
    env = dict(os.environ, NODE_PATH='/home/claude/.npm-global/lib/node_modules', MSAA='4')
    subprocess.run(['node', '/home/claude/passB/tools/render.js', str(css), str(css), '2', f'{SCR}/{name}', json.dumps(views)], env=env, check=True, stdout=subprocess.DEVNULL)
    tiles = []
    for vid, ov in js.items():
        look = F.load(f'{SCR}/{name}-{vid}.png'); cov = F.coverage(f'{SCR}/{name}-{vid}-mask.png')
        H, W = cov.shape
        c = F.compose(look, cov, F.ground(W, H, **ov.get('ground', m.get('ground', {}))))
        c = F.tone(c, **ov.get('tone', m.get('tone', {})))
        im = F.reduce(c, (size, size), **ov.get('reduce', m.get('reduce', {})))
        im.save(f'{SCR}/{name}-{vid}-final.png')
        tiles.append(im)
    k = 4
    tw = shown * k + 10
    board = Image.new('RGB', (len(tiles) * tw + 10, shown * k + shown + 60), (11, 9, 16))
    for i, im in enumerate(tiles):
        one = im.resize((shown, shown), Image.LANCZOS)
        board.paste(one.resize((shown * k, shown * k), Image.NEAREST), (10 + i * tw, 10))
        board.paste(one, (10 + i * tw, shown * k + 20))
        lin = Image.new('RGB', (shown + 16, shown + 16), (241, 236, 228)); lin.paste(one, (8, 8))
        board.paste(lin, (10 + i * tw + shown + 12, shown * k + 12))
    board.save(out); print('wrote', out)


if __name__ == '__main__':
    main()
