"""variants: python3 var.py <prefix> '<json [[newid, baseid, overrides, extra_js_before]...]>'"""
import json, os, subprocess, sys
sys.path.insert(0, '/home/claude/passB/work/store')
import build as b
allv = {v['id']: v for v in b.views()}
out = []
for item in json.loads(sys.argv[2]):
    nid, bid, o = item[:3]; pre = item[3] if len(item) > 3 else ''
    post = item[4] if len(item) > 4 else ''
    v = dict(allv[bid]); v.update(o); v['id'] = nid; v['js'] = pre + '\n' + v['js'] + '\n' + post; out.append(v)
env = dict(os.environ, NODE_PATH='/home/claude/.npm-global/lib/node_modules', MSAA=os.environ.get('MSAA', '0'))
w = os.environ.get('W', '400'); h = os.environ.get('H', '400'); d = os.environ.get('DPR', '1')
subprocess.run(['node', '/home/claude/passB/tools/render.js', w, h, d, sys.argv[1], json.dumps(out)], env=env, check=True)
