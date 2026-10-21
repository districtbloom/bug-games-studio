set -e
cd /home/claude/designpass
python3 work/store/ev.py --js src/common.js --js src/store.js --js src/store-reward.js --expr "JSON.stringify({ink: STAMPED_ART.ink(), tool: STAMPED_ART.tool(), thunk: STAMPED_ART.thunk(), shade: STAMPED_ART.shade(), defs: defsBasq()})" --out work/store/reward-parts.json
python3 work/store/build_reward.py
python3 tools/render.py --css bug/reward/stamped.css --js bug/reward/stamped.js --expr "'<div class=\"oosst oosst-held\" style=\"width:400px;height:400px\">' + OOSStamped.heldSVG() + '</div>'" --out bug/reward-held.png --w 400 --h 400 --dpr 2 --final 400 400 --alpha
