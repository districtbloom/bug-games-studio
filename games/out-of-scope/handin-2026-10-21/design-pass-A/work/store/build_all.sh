# Rebuild every picture of the store group, then every check sheet.
set -e
cd /home/claude/designpass
python3 tools/render.py work/store/jobs-tiles.json
python3 tools/render.py work/store/jobs-items.json
bash work/store/build_all_reward.sh
python3 tools/render.py --js src/common.js --js src/store.js --js src/store-update.js --expr "UPDATE.compose(1600,800)" --out work/store/update-2x.png --w 1600 --h 800 --dpr 2 --hexes work/store/update.hex
python3 - <<'PY'
from PIL import Image
D='/home/claude/designpass/'
im=Image.open(D+'work/store/update-2x.png').convert('RGB')
im.resize((1600,800),Image.LANCZOS).save(D+'bug/updates/case-02.png')
im.resize((308,154),Image.LANCZOS).save(D+'bug/updates/case-02-thumb.png')
PY
python3 tools/render.py --js src/common.js --js src/store.js --js src/store-event.js --expr "EVENT.banner(1720,600)" --out bug/events/mail-day-banner.png --w 1720 --h 600 --dpr 2 --final 1720 600 --hexes work/store/banner.hex
