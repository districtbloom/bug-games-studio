#!/usr/bin/env python3
"""bug.games ingestion harness · validate an upload package against the SDK and the creator kit.

usage: python3 validate.py <package_dir> [--out DIR] [--label NAME] [--zipname NAME.zip]
writes DIR/report.json and DIR/report.md (DIR defaults to ./selfcheck-report in the current folder) and prints the
fails, UNSOURCED and UNDECIDED lines. Needs Python 3.10+ and Pillow (pip install Pillow); ffprobe is optional (video sizes).

A package is a folder holding game.json (SDK storefront metadata) somewhere inside, optionally a manifest.json
(slot -> file -> size) at its root, the build (index.html + files), and any kit art. Nothing in the package is
executed; code is only read as text. Statuses: pass · warn · fail · UNDECIDED (hits one of the upload kit's open
questions; the harness never decides it) · UNSOURCED (a price or number with no source).
"""
import json, math, os, re, subprocess, sys, hashlib
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import kit_spec as K  # noqa: E402
try:
    import PIL  # noqa: F401
except ImportError:
    PIL = None

IMG_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}
VID_EXT = {".mp4", ".webm", ".mov"}


# ------------------------------------------------------------------ helpers
def canon(s):
    return re.sub(r"[^a-z0-9]+", "_", str(s).strip().lower()).strip("_")


def slugify(s):
    s = re.sub(r"[’']", "", str(s).lower())
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


SLOT_OF = {}
for _k, _v in K.SLOTS.items():
    SLOT_OF[_k] = _k
    for _a in _v.get("alias", []):
        SLOT_OF[canon(_a)] = _k


def split_slot(raw):
    """'seal:Out of the nap room' / 'seals/out-of-the-nap-room' / 'store_item.blue-wellies' / 'marker_next' -> (slot, sub)."""
    raw = str(raw).strip()
    m = re.match(r"^([A-Za-z0-9_\- ]+?)\s*[:/\[.#]\s*(.+?)\]?$", raw)
    base, sub = (m.group(1), m.group(2)) if m else (raw, "")
    b = canon(base)
    if b in ("marker_next", "marker_held"):
        return "marker", b.split("_")[1]
    if b in SLOT_OF:
        return SLOT_OF[b], sub
    # 'seal_out_of_the_nap_room' style: longest known prefix wins
    for key in sorted(SLOT_OF, key=len, reverse=True):
        if b.startswith(key + "_"):
            return SLOT_OF[key], b[len(key) + 1:]
    return None, raw


def parse_size(v):
    if v is None:
        return None
    if isinstance(v, (list, tuple)) and len(v) >= 2:
        return int(v[0]), int(v[1])
    if isinstance(v, dict):
        w = v.get("w", v.get("width")); h = v.get("h", v.get("height"))
        return (int(w), int(h)) if w and h else None
    m = re.search(r"(\d+)\s*[x×X*]\s*(\d+)", str(v))
    return (int(m.group(1)), int(m.group(2))) if m else None


def media_size(path):
    ext = os.path.splitext(path)[1].lower()
    try:
        if ext == ".svg":
            t = open(path, encoding="utf-8", errors="ignore").read(4000)
            w = re.search(r'\swidth="([\d.]+)', t); h = re.search(r'\sheight="([\d.]+)', t)
            if w and h:
                return int(float(w.group(1))), int(float(h.group(1)))
            vb = re.search(r'viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"', t)
            return (int(float(vb.group(1))), int(float(vb.group(2)))) if vb else None
        if ext in VID_EXT:
            out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                                  "stream=width,height:format=duration", "-of", "json", path],
                                 capture_output=True, text=True, timeout=30).stdout
            j = json.loads(out or "{}"); s = (j.get("streams") or [{}])[0]
            return (s.get("width"), s.get("height"), float(j.get("format", {}).get("duration", 0) or 0))
        from PIL import Image
        with Image.open(path) as im:
            return im.size
    except Exception:
        return None


def hex_to_lab(h):
    h = h.lstrip("#")
    r, g, b = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = lin(r), lin(g), lin(b)
    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722)
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883
    f = lambda t: t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116
    fx, fy, fz = f(x), f(y), f(z)
    return 116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)


def de2000(c1, c2):
    L1, a1, b1 = hex_to_lab(c1); L2, a2, b2 = hex_to_lab(c2)
    C1, C2 = math.hypot(a1, b1), math.hypot(a2, b2); Cb = (C1 + C2) / 2
    G = 0.5 * (1 - math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)))
    a1p, a2p = a1 * (1 + G), a2 * (1 + G)
    C1p, C2p = math.hypot(a1p, b1), math.hypot(a2p, b2)
    h1p = math.degrees(math.atan2(b1, a1p)) % 360; h2p = math.degrees(math.atan2(b2, a2p)) % 360
    dL, dC = L2 - L1, C2p - C1p
    dh = 0 if C1p * C2p == 0 else (h2p - h1p if abs(h2p - h1p) <= 180 else h2p - h1p - 360 if h2p > h1p else h2p - h1p + 360)
    dH = 2 * math.sqrt(C1p * C2p) * math.sin(math.radians(dh / 2))
    Lb, Cbp = (L1 + L2) / 2, (C1p + C2p) / 2
    hb = h1p + h2p if C1p * C2p == 0 else ((h1p + h2p) / 2 if abs(h1p - h2p) <= 180 else (h1p + h2p + 360) / 2 if h1p + h2p < 360 else (h1p + h2p - 360) / 2)
    T = 1 - 0.17 * math.cos(math.radians(hb - 30)) + 0.24 * math.cos(math.radians(2 * hb)) + 0.32 * math.cos(math.radians(3 * hb + 6)) - 0.2 * math.cos(math.radians(4 * hb - 63))
    SL = 1 + 0.015 * (Lb - 50) ** 2 / math.sqrt(20 + (Lb - 50) ** 2); SC = 1 + 0.045 * Cbp; SH = 1 + 0.015 * Cbp * T
    RT = -2 * math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7)) * math.sin(math.radians(60 * math.exp(-((hb - 275) / 25) ** 2)))
    return math.sqrt((dL / SL) ** 2 + (dC / SC) ** 2 + (dH / SH) ** 2 + RT * (dC / SC) * (dH / SH))


# ------------------------------------------------------------------ the report
class Report:
    def __init__(self):
        self.items = []

    def add(self, area, check, status, detail, source="", q=None, slot=None, ref=None):
        self.items.append(dict(id=f"{canon(area)}.{len(self.items) + 1:03d}", area=area, check=check, status=status,
                               detail=detail, source=source, q=q, slot=slot, ref=ref))


def load_json(path, R, label):
    try:
        return json.load(open(path, encoding="utf-8"))
    except Exception as e:
        R.add("Package", f"{label} parses", "fail", f"{os.path.basename(path)}: {e}", "SDK: a bad file is a directive, not a deploy")
        return None


def find_first(root, name):
    best = None
    for d, dirs, files in os.walk(root):
        dirs[:] = [x for x in dirs if not x.startswith(".") and x != "node_modules"]
        if name in files:
            p = os.path.join(d, name)
            if best is None or p.count(os.sep) < best.count(os.sep):
                best = p
    return best


# ------------------------------------------------------------------ package loading
def load_package(pkg, R):
    P = dict(root=os.path.abspath(pkg), game={}, manifest=None, slots={}, extra={}, sources={})
    if not os.path.isdir(pkg):
        R.add("Package", "folder exists", "fail", f"{pkg} is not a folder"); return P
    gj = find_first(pkg, "game.json")
    P["game_dir"] = os.path.dirname(gj) if gj else P["root"]
    if gj:
        P["game"] = load_json(gj, R, "game.json") or {}
        P["sources"]["game.json"] = os.path.relpath(gj, pkg)
    else:
        R.add("Listing", "game.json present", "warn", "no game.json: the game still publishes with a bare card", "SDK")
    mf = os.path.join(pkg, "manifest.json")
    if not os.path.exists(mf):
        mf = find_first(pkg, "manifest.json")
    if mf:
        P["manifest"] = load_json(mf, R, "manifest.json")
        P["manifest_dir"] = os.path.dirname(mf)
        P["sources"]["manifest.json"] = os.path.relpath(mf, pkg)
    # side files the package may use for drafts (not SDK; read as data)
    for name in ["store.draft.json", "pass.draft.json", "store.json", "products.json", "pass.json", "events.json", "events.draft.json",
                 "updates.json", "updates.draft.json", "words.json", "voice.json", "featured.json"]:
        key = name.split(".")[0]
        if key in P["extra"]:
            continue
        p = find_first(pkg, name)
        if p:
            v = load_json(p, R, name)
            if v is not None:
                P["extra"][key] = v; P["sources"][name] = os.path.relpath(p, pkg)
    for name in ["HANDOFF_NOTE.md", "QUESTIONS.md"]:
        p = find_first(pkg, name)
        if p:
            P["sources"][name] = os.path.relpath(p, pkg)
    collect_slots(P, R)
    return P


def add_slot(P, R, raw_slot, entry, base_dir, origin):
    if isinstance(entry, str):
        entry = {"file": entry}
    if not isinstance(entry, dict):
        return
    f = entry.get("file") or entry.get("path") or entry.get("src")
    st_files = {k: (v if isinstance(v, str) else (v.get("png") or v.get("file") or "") if isinstance(v, dict) else "") for k, v in entry["states"].items()} \
        if isinstance(entry.get("states"), dict) else {}
    if not f and not any(st_files.values()):
        return  # an empty template entry: not supplied (the art check reports the fallback)
    slot, sub = split_slot(raw_slot)
    sub = entry.get("id") or entry.get("for") or entry.get("moment") or entry.get("pose") or sub
    if slot is None:
        R.add("Art", f"slot '{raw_slot}' known", "warn", f"'{raw_slot}' is not a slot in the creator kit or the page kit; kept, not placed",
              "KIT tier 1/2 lists", slot=raw_slot, ref=f)
        slot = "other:" + canon(raw_slot)
    if isinstance(f, dict):
        f = f.get("png") or f.get("file")
    rec = dict(slot=slot, sub=str(sub or ""), file=f, declared=parse_size(entry.get("size") or entry.get("px") or entry.get("dims")),
               origin=origin, raw=raw_slot, meta={k: v for k, v in entry.items() if k not in ("file", "path", "src", "size")})
    if f:
        path = os.path.normpath(os.path.join(base_dir, f))
        rec["path"] = path
        rec["exists"] = os.path.exists(path)
        rec["actual"] = media_size(path) if rec["exists"] else None
    st = entry.get("states")
    if isinstance(st, dict):
        rec["states"] = {}
        for k, v in st_files.items():
            sp = os.path.normpath(os.path.join(base_dir, v)) if isinstance(v, str) and v else None
            rec["states"][k] = dict(file=v, path=sp, exists=bool(sp and os.path.exists(sp)), actual=media_size(sp) if sp and os.path.exists(sp) else None)
        if not f:
            e0 = rec["states"].get("earned") or next(iter(rec["states"].values()), None)
            if e0 and e0.get("file"):
                rec.update(file=e0["file"], path=e0["path"], exists=e0["exists"], actual=e0["actual"])
    elif isinstance(st, list):
        rec["states_listed"] = st
    P["slots"].setdefault(slot, []).append(rec)


def collect_slots(P, R):
    m = P.get("manifest")
    if isinstance(m, dict):
        body = m.get("slots", m.get("assets", m.get("art", m)))
        if isinstance(body, dict):
            for k, v in body.items():
                if k in ("game", "version", "words", "events", "updates", "store", "products", "pass", "featured", "voice", "notes", "$schema", "name", "title",
                         "measure", "proposed", "undecided", "package", "slug"):
                    continue
                if canon(k) in ("living_poster_parts", "parts", "parts_kit"):
                    continue  # the parts kit is read from its parts.json (check_parts)
                for e in (v if isinstance(v, list) else [v]):
                    add_slot(P, R, k, e, P["manifest_dir"], "manifest")
        elif isinstance(body, list):
            for e in body:
                if isinstance(e, dict):
                    add_slot(P, R, e.get("slot") or e.get("name") or "?", e, P["manifest_dir"], "manifest")
    elif isinstance(m, list):
        for e in m:
            if isinstance(e, dict):
                add_slot(P, R, e.get("slot") or "?", e, P["manifest_dir"], "manifest")
    collect_drafts(P, R)
    if "living_poster" not in P["slots"]:
        for d in ("living-poster", "living_poster", "poster-module", "module"):
            dd = os.path.join(P["root"], d)
            if os.path.isdir(dd):
                for f in sorted(os.listdir(dd)):
                    if f.endswith(".js"):
                        add_slot(P, R, "living_poster", os.path.join(d, f), P["root"], "found")
    g = P["game"]
    if g.get("cover") and "cover" not in P["slots"]:
        add_slot(P, R, "cover", g["cover"], P["game_dir"], "game.json")
    for i, s in enumerate(g.get("screenshots") or []):
        add_slot(P, R, f"screenshot:{i + 1}", s, P["game_dir"], "game.json")
    if g.get("trailer"):
        add_slot(P, R, "trailer", g["trailer"], P["game_dir"], "game.json")


def _file_of(x):
    if isinstance(x, str) and re.search(r"\.(png|jpe?g|webp|gif|svg)$", x, re.I):
        return x
    if isinstance(x, dict):
        return x.get("png") or x.get("file") or x.get("master")
    return None


def drafts_of(P):
    m = P.get("manifest")
    d = m.get("drafts") if isinstance(m, dict) else None
    return d if isinstance(d, dict) else {}


def collect_drafts(P, R):
    """art a manifest keeps under "drafts" (event banner and seal, update close-ups, Featured still) instead of slots."""
    d = drafts_of(P)
    base = P.get("manifest_dir") or P["root"]
    evs = d.get("events") or ([d["event"]] if isinstance(d.get("event"), dict) else [])
    for e in evs if isinstance(evs, list) else []:
        f = _file_of(e.get("banner") or e.get("art"))
        if f and "event_banner" not in P["slots"]:
            add_slot(P, R, "event_banner:" + str(e.get("id") or e.get("name") or "event"), {"file": f, "proposal": True}, base, "manifest drafts")
    ups = d.get("updates") or ([d["update"]] if isinstance(d.get("update"), dict) else [])
    for u in ups if isinstance(ups, list) else []:
        cl = u.get("closeups") or u.get("closeup") or u.get("art")
        f = _file_of(cl[0] if isinstance(cl, list) and cl else cl)
        if f and "update" not in P["slots"]:
            add_slot(P, R, "update:" + str(u.get("id") or u.get("version") or "update"), {"file": f, "proposal": True}, base, "manifest drafts")
    fe = d.get("featured")
    if isinstance(fe, dict) and "featured_still" not in P["slots"]:
        f = _file_of(fe.get("still") or fe)
        if f:
            add_slot(P, R, "featured", {"file": f, "note": str(fe.get("motion") or fe.get("motion_note") or "")[:200]}, base, "manifest drafts")


def merged(P, *keys):
    """first value found for any key in game.json, then manifest top level, then side files."""
    for src in (P["game"], P["manifest"] if isinstance(P["manifest"], dict) else {}, P["extra"]):
        for k in keys:
            if isinstance(src, dict) and src.get(k) not in (None, "", []):
                return src[k]
    return None


# ------------------------------------------------------------------ code scan (read as text, never run)
def scan_build(P, R):
    gd = P["game_dir"]
    idx = os.path.join(gd, "index.html")
    S = dict(index=os.path.exists(idx), refs_missing=[], external=[], sdk=set(), moments_code=[], places=[], save=False,
             multiplayer=False, logic=os.path.exists(os.path.join(gd, "logic.js")) or os.path.exists(os.path.join(gd, "logic.wasm")),
             build_bytes=0, store_bytes=0, files=0)
    storefront = set()
    for rec in sum(P["slots"].values(), []):
        if rec.get("path"):
            storefront.add(os.path.abspath(rec["path"]))
    for d, dirs, files in os.walk(gd):
        for f in files:
            p = os.path.abspath(os.path.join(d, f)); sz = os.path.getsize(p)
            if p in storefront or f in ("game.json", "manifest.json"):
                S["store_bytes"] += sz
            else:
                S["build_bytes"] += sz; S["files"] += 1
    if not S["index"]:
        if P.get("manifest") is not None:
            R.add("Build", "build in the package", "warn", "no index.html next to game.json: the build is not in this package, so the build checks did not run (send game/ with the build, or say where it lives)", "creator pack START_HERE")
        else:
            R.add("Build", "index.html at the root", "fail", "no index.html next to game.json", "SDK Rules: index.html at the workspace root is the entry point")
        return S
    R.add("Build", "index.html at the root", "pass", "index.html found", "SDK Rules")
    texts = {}
    for d, dirs, files in os.walk(gd):
        for f in files:
            if f.endswith((".html", ".js", ".mjs", ".css")):
                p = os.path.join(d, f)
                try:
                    texts[os.path.relpath(p, gd)] = open(p, encoding="utf-8", errors="ignore").read()
                except Exception:
                    pass
    html = texts.get("index.html", "")
    for ref in re.findall(r'(?:src|href)\s*=\s*["\']([^"\'#?]+)', html) + re.findall(r'url\(\s*["\']?([^"\')]+)', html):
        if ref.startswith(("data:", "#", "/sdk/", "mailto:")):
            continue
        if re.match(r"^(https?:)?//", ref):
            S["external"].append(ref); continue
        if not os.path.exists(os.path.normpath(os.path.join(gd, ref.lstrip("/")))):
            S["refs_missing"].append(ref)
    alljs = "\n".join(v for k, v in texts.items() if not k.endswith(".css"))
    for u in sorted(set(re.findall(r'["\'`](https?://[^"\'`\s]+)', alljs))):
        if not re.search(r"w3\.org|schemas\.|xmlns|example\.(com|org)", u):
            S["external"].append(u)
    for name in ["init", "loaded", "loading", "failed", "gameplayStart", "gameplayStop", "onPause", "onResume", "onMute",
                 "progress.set", "progress.moment", "kv", "save", "files", "board", "monetization", "multiplayer", "logic", "social", "analytics.track"]:
        if re.search(r"\.(?:bp\??\.|bloomplay\??\.)?" + re.escape(name).replace(r"\.", r"\??\.") + r"\b\s*[\.(]", alljs) and \
                re.search(r"(bp|bloomplay)\??\." + re.escape(name).replace(r"\.", r"\??\."), alljs):
            S["sdk"].add(name)
    S["head_import"] = "/sdk/bloomplay.js" in html
    S["save"] = bool({"kv", "save"} & S["sdk"]) or "localStorage" in alljs
    S["multiplayer"] = bool({"multiplayer", "logic"} & S["sdk"])
    S["moments_code"] = sorted(set(re.findall(r'\.moment\(\s*["\']([^"\']+)["\']', alljs)))
    # place strings: literal args to progress()/progress.set(), label maps, template pieces
    lits = re.findall(r'\.progress(?:\.set)?\(\s*["\']([^"\']+)["\']\s*\)', alljs)
    tmpl = re.findall(r'\.progress(?:\.set)?\(\s*`([^`]*)`\s*\)', alljs)
    maps = []
    for t in tmpl:
        names = re.findall(r"\$\{\s*([A-Z_][A-Z0-9_]*)\[", t)
        dflt = re.findall(r'\?\?\s*"([^"]+)"', t)
        statics = re.sub(r"\$\{[^{}]*\}", "", t)
        conds = re.findall(r'"([^"]*)"\s*:\s*""', t)
        for n in names:
            mm = re.search(n + r'\s*=\s*\{([^}]*)\}', alljs)
            if mm:
                maps += re.findall(r':\s*"([^"]+)"', mm.group(1))
        base = maps + dflt
        for b in base:
            S["places"].append(dict(text=b + statics, how="label map"))
            for c in conds:
                S["places"].append(dict(text=b + statics + c, how="label map + conditional suffix"))
    for l in lits:
        S["places"].append(dict(text=l, how="literal"))
    seen = set(); S["places"] = [x for x in S["places"] if not (x["text"] in seen or seen.add(x["text"]))]
    return S


# ------------------------------------------------------------------ checks
def check_listing(P, R):
    g = P["game"]
    extra = sorted(set(g) - K.SDK_FIELDS)
    if extra:
        R.add("Listing", "fields are SDK fields", "warn", "not in the SDK's game.json (kept as data, not validated at publish): " + ", ".join(extra), "SDK Storefront metadata")
    t = g.get("title")
    if not t:
        R.add("Listing", "title", "fail", "missing (tier 0 needs a title)", "KIT tier 0")
    else:
        R.add("Listing", "title ≤40", "pass" if len(t) <= K.TITLE_MAX else "fail", f"\"{t}\" · {len(t)} chars", "KIT W")
    h = g.get("hook")
    if not h:
        R.add("Listing", "hook present", "fail", "missing: the one-line pitch (publish check)", "SDK, UK listing table")
    else:
        R.add("Listing", "hook present", "pass", f"{len(h)} chars", "SDK")
        if len(h) > K.LEAD_WARN:
            R.add("Listing", "hook ≤110 (one line on the rail)", "warn", f"{len(h)} chars; the build warns past 110", "surface list")
    if not g.get("description"):
        R.add("Listing", "description", "warn", "missing: the About tab has no text", "SDK")
    md = g.get("mood")
    if md is None:
        R.add("Listing", "mood in the SDK list", "warn", "no mood: no Home shelf", "SDK mood")
    elif md in K.MOODS:
        R.add("Listing", "mood in the SDK list", "pass", f"\"{md}\" (Home shelf: {shelf_of(md)})", "SDK mood")
    else:
        R.add("Listing", "mood in the SDK list", "fail", f"\"{md}\" is not one of the 17 words; refused with the list", "SDK mood")
    vib = merged(P, "vibes")
    R.add("Listing", "vibes (canvas, 7)", "UNDECIDED", ("vibes given: " + ", ".join(vib) if vib else "no vibes given") +
          "; the SDK has mood, the canvas has vibes, not linked", "UK", q=9)
    tags = g.get("tags")
    if not tags:
        R.add("Listing", "tags", "warn", "none: the line under the title falls back to genre · mood", "SDK tags")
    else:
        bad = [x for x in tags if not (K.TAG_LEN[0] <= len(x) <= K.TAG_LEN[1])]
        if len(tags) > K.TAGS_MAX_SDK or bad:
            R.add("Listing", "tags ≤5, 2–24 chars", "fail", f"{len(tags)} tags; bad length: {bad}", "SDK tags")
        else:
            R.add("Listing", "tags ≤5, 2–24 chars", "pass", ", ".join(tags), "SDK tags")
        if len(tags) > K.TAGS_MAX_PUBLISH:
            R.add("Listing", "tag count (SDK 5 vs Publish 4)", "UNDECIDED", f"{len(tags)} tags: SDK allows 5, the Publish screen 4", "UK", q=8)
    mo = g.get("moments") or []
    if not mo:
        R.add("Listing", "moments", "warn", "none: no achievements, no share pins", "SDK moments")
    else:
        R.add("Listing", "moments ≤12, in play order", "pass" if len(mo) <= K.MOMENTS_MAX else "fail", f"{len(mo)}: " + " · ".join(mo), "SDK moments")
    ins = g.get("inputs") or []
    badin = [x for x in ins if x not in K.INPUTS]
    if not ins:
        R.add("Listing", "inputs", "warn", "none declared: 'Plays on' is empty", "SDK inputs")
    else:
        R.add("Listing", "inputs values", "fail" if badin else "pass", ("unknown: " + ", ".join(badin)) if badin else ", ".join(ins), "SDK inputs")
    ctl = g.get("controls") or []
    if "touch" in ins and not any(re.search(r"touch|tap|thumb|swipe", (c.get("key", "") + c.get("action", "")), re.I) for c in ctl):
        R.add("Listing", "touch controls listed", "warn", "touch declared but no control row says how", "SDK controls, Publish check 2")
    elif ctl:
        R.add("Listing", "controls", "pass", f"{len(ctl)} rows", "SDK controls")
    for p in g.get("permissions") or []:
        if p not in K.PERMISSIONS:
            R.add("Listing", "permissions values", "fail", f"\"{p}\"", "SDK permissions")
    if "contentNote" in g:
        R.add("Listing", "contentNote", "pass", f"\"{g['contentNote']}\"", "SDK contentNote")
    else:
        R.add("Listing", "contentNote", "warn", "absent (optional): confirm the game needs none, e.g. flashing lights", "SDK contentNote")
    acc = g.get("accent")
    if acc and re.match(r"^#[0-9a-fA-F]{6}$", acc):
        worst = min(((n, de2000(acc, c)) for n, c in K.PLATFORM_COLOURS.items()), key=lambda x: x[1])
        st = "warn" if worst[1] < K.CAUTION_DE else "pass"
        band = "guarded (<12)" if worst[1] < K.GUARD_DE else "caution (12–20)" if worst[1] < K.CAUTION_DE else "clear"
        R.add("Listing", "accent vs platform colours", st, f"{acc}: ΔE2000 {worst[1]:.1f} to {worst[0]} → {band}. Guarded = never a button-like fill, never within 120 px of Play, a price or a selected state", "KIT self-check 5, art-direction guide (colour guard)")
    return


def shelf_of(md):
    groups = [K.MOODS[0:5], K.MOODS[5:9], K.MOODS[9:13], K.MOODS[13:17]]
    for gr in groups:
        if md in gr:
            return gr[0]
    return "?"


def check_honesty(P, R, S):
    g = P["game"]; pl = str(g.get("players", "")); coop = g.get("coop")
    nums = [int(x) for x in re.findall(r"\d+", pl)] or [1]
    mx = max(nums)
    if coop and mx < 2:
        R.add("Listing", "co-op honesty", "fail", f"coop: true but players \"{pl}\"", "SDK coop")
    elif coop and not S.get("multiplayer"):
        R.add("Listing", "co-op honesty", "fail", "coop: true but the code never joins a room (multiplayer/logic)", "SDK coop: seeing each other is NOT co-op")
    elif not coop and S.get("multiplayer") and mx >= 2:
        R.add("Listing", "co-op honesty", "warn", "the code joins rooms but coop is false", "SDK coop")
    else:
        R.add("Listing", "co-op honesty", "pass", f"players \"{pl}\", coop {str(bool(coop)).lower()}; the code joins no room" if not S.get("multiplayer") else f"players \"{pl}\", coop {coop}", "SDK coop, Publish check 5")


def check_build(P, R, S):
    if not S.get("index"):
        return
    if S["refs_missing"]:
        R.add("Build", "files present", "fail", "index.html points at files not in the package: " + ", ".join(sorted(set(S["refs_missing"]))), "SDK Rules: bundle all assets; Publish check 1")
    else:
        R.add("Build", "files present", "pass", "every file index.html points at is in the package", "Publish check 1")
    if S["external"]:
        R.add("Build", "nothing loads from the web", "fail", ", ".join(sorted(set(S["external"]))[:6]), "SDK Rules, Publish check 1")
    else:
        R.add("Build", "nothing loads from the web", "pass", "no external URLs in index.html or the scripts", "Publish check 1")
    R.add("Build", "SDK in the page head", "pass" if S["head_import"] else "warn", "/sdk/bloomplay.js imported in the head" if S["head_import"] else "no head import: the first boot stage is lost", "SDK")
    need = ["loaded", "gameplayStart", "progress.moment"]
    miss = [x for x in need if x not in S["sdk"]]
    R.add("Build", "SDK calls", "warn" if miss else "pass", "uses " + ", ".join(sorted(S["sdk"])) + (("; missing " + ", ".join(miss)) if miss else ""), "SDK")
    decl = P["game"].get("moments") or []
    cm = S["moments_code"]
    undeclared = [m for m in cm if m not in decl]; unreported = [m for m in decl if m not in cm]
    if decl:
        st = "pass" if not undeclared and not unreported else "fail" if unreported else "warn"
        R.add("Build", "moments reported = declared", st, f"{len(cm)} reported in code" + (f"; never reported: {unreported}" if unreported else "") + (f"; not declared (ignored): {undeclared}" if undeclared else ""), "SDK progress.moment")
    if not S["save"]:
        R.add("Build", "saves come back", "warn", "no save layer (no kv, save or localStorage): a closed tab restarts the afternoon. Exempt for a ~10 min single run? Not stated", "Publish check 3")
    for pl in S["places"]:
        n = len(pl["text"])
        R.add("Words", "place string ≤30", "pass" if n <= K.PLACE_MAX else "fail", f"\"{pl['text']}\" · {n} chars ({pl['how']}, read from the code)", "KIT W; the surface list notes roster data also runs long")
    mb = S["build_bytes"] / 1e6
    R.add("Build", "size and load budget", "UNDECIDED", f"build {mb:.1f} MB in {S['files']} files (+{S['store_bytes'] / 1e6:.1f} MB storefront media); no cap is set", "UK", q=16)


def check_art(P, R):
    present = {k for k, v in P["slots"].items() if any(r.get("exists") for r in v)}
    g = P["game"]
    moments = g.get("moments") or []
    for slot in [s for s in K.SLOTS] + sorted(k for k in P["slots"] if k.startswith("other:")):
        spec = K.SLOTS.get(slot)
        recs = P["slots"].get(slot, [])
        if spec is None or spec.get("media"):
            continue
        if not recs:
            if slot == "cover":
                R.add("Art", "cover", "fail", "no cover: Publish check 6 'Cover picture'", "Publish check 6", slot=slot)
                continue
            if spec.get("per") == "product" and not products_of(P):
                continue
            if spec.get("per") == "reward" and not pass_of(P):
                continue
            if spec.get("per") == "event" and not events_of(P):
                continue
            if spec.get("per") == "update" and not updates_of(P):
                continue
            lvl = "warn" if spec["tier"] in (1, 2) else "warn"
            if slot in ("backdrop", "backdrop_mobile", "profile_banner", "phone_916", "title_lockup", "featured_still"):
                lvl = "warn"
            R.add("Art", f"{slot} supplied", lvl, f"missing → fallback: {K.FALLBACK.get(slot, 'none')}", spec["src"] + f" · tier {spec['tier']}" if spec["tier"] else spec["src"], slot=slot)
            continue
        for r in recs:
            label = slot + (f" · {r['sub']}" if r["sub"] else "")
            if not r.get("file"):
                R.add("Art", label, "fail", "manifest entry has no file", spec["src"], slot=slot); continue
            if not r.get("exists"):
                R.add("Art", label, "fail", f"{r['file']} is not in the package", spec["src"], slot=slot, ref=r["file"]); continue
            if spec.get("text"):
                R.add("Art", label, "pass", f"{r['file']} present", spec["src"], slot=slot, ref=r["file"]); continue
            if spec.get("code"):
                lint_module(r, R); continue
            a = r.get("actual")
            if not a:
                R.add("Art", label, "fail", f"{r['file']}: cannot read its size", spec["src"], slot=slot, ref=r["file"]); continue
            w, h = a[0], a[1]
            if r.get("declared") and tuple(r["declared"]) != (w, h):
                R.add("Art", label + " size as declared", "fail", f"manifest says {r['declared'][0]}×{r['declared'][1]}, the file is {w}×{h}", "manifest", slot=slot, ref=r["file"])
            st, why = size_verdict(spec, w, h)
            q = None
            if slot == "cover":
                if abs(w / h - 16 / 9) > 0.01:
                    st, why = "fail", f"{w}×{h} is not 16:9"
                else:
                    st, why, q = "UNDECIDED", f"{w}×{h}, 16:9 as the SDK asks; Publish asks 1920×1080 with no text, the creator kit a 2:1 poster, Studio A/B a 2:3 with a title", 3
            if slot == "chip64" and (w, h) == (64, 48):
                st, why = "warn", "64×48 (bible) — Home draws 64×64 (surface list; not one of the 19 questions)"
            if slot == "pass_reward" and st == "pass":
                why += "; note the page's rw hook is square (surface list)"
            if slot == "profile_banner":
                why += " · not in the creator kit (surface list): checked against the canvas art"
                if st == "fail":
                    st = "warn"
            R.add("Art", label, st, f"{r['file']} · {why}", spec["src"], q=q, slot=slot, ref=r["file"])
            if slot == "seal":
                check_seal_states(r, label, spec, R)
    # per-moment seals, two marker poses
    if moments:
        have = {canon(r["sub"]) for r in P["slots"].get("seal", []) if r.get("exists")}
        missing = [m for m in moments if canon(m) not in have and slugify(m).replace("-", "_") not in have]
        if P["slots"].get("seal"):
            if missing:
                R.add("Art", "a seal per moment", "warn", f"{len(moments) - len(missing)} of {len(moments)}; no seal for: " + " · ".join(missing) + " → black square with a sun diamond", "KIT 6", slot="seal")
            else:
                R.add("Art", "a seal per moment", "pass", f"{len(moments)} of {len(moments)}", "KIT 6", slot="seal")
    mk = P["slots"].get("marker", [])
    if mk:
        poses = {canon(r["sub"]) for r in mk}
        R.add("Art", "marker: two poses", "pass" if {"next", "held"} <= poses else "warn", "poses: " + ", ".join(sorted(poses)) + ("" if {"next", "held"} <= poses else " (needs next and held)"), "KIT 9", slot="marker")
    shots = P["slots"].get("screenshot", []) + P["slots"].get("trailer", [])
    for r in shots:
        a = r.get("actual") or ()
        dims = f"{a[0]}×{a[1]}" + (f", {a[2]:.0f} s" if len(a) > 2 else "") if a else "unreadable"
        nobuild = P.get("manifest") is not None and not os.path.exists(os.path.join(P["game_dir"], "index.html"))
        R.add("Art", ("trailer" if r["slot"] == "trailer" else "screenshot " + r["sub"]) + " size", "UNDECIDED" if r.get("exists") else ("warn" if nobuild else "fail"),
              f"{r['file']} · {dims}; the SDK takes the field, no size is set anywhere" if r.get("exists") else
              (f"{r['file']} is named in game.json but not in this package (the build is not in it either)" if nobuild else f"{r['file']} missing"), "UK", q=17 if r.get("exists") else None, slot=r["slot"], ref=r["file"])
    return present


def check_seal_states(r, label, spec, R):
    """KIT 6 / platform answers: three states (earned, progress, locked), each a 96×96 master."""
    sts = r.get("states")
    if not sts:
        R.add("Art", label + " · three states", "warn", ("states listed (" + ", ".join(map(str, r["states_listed"])) + ") but no file per state" if r.get("states_listed") else "one image only")
              + ": the page draws the same picture for earned, progress and locked", "KIT 6 seals, three states", slot="seal", ref=r.get("file"))
        return
    probs = []
    for want in ("earned", "progress", "locked"):
        v = sts.get(want)
        if not v:
            probs.append(f"no {want}"); continue
        if not v["exists"]:
            probs.append(f"{want}: {v['file']} missing"); continue
        a = v.get("actual")
        if a and size_verdict(spec, a[0], a[1])[0] == "fail":
            probs.append(f"{want}: {a[0]}×{a[1]}")
    R.add("Art", label + " · three states", "warn" if probs else "pass", "; ".join(probs) if probs else "earned, progress, locked", "KIT 6 seals, three states", slot="seal", ref=r.get("file"))


ZIP_NAME = r"^[a-z0-9]+(?:-[a-z0-9]+)*-package-v\d+\.zip$"


def check_package(P, R, zipname=None):
    """The package format asked of a creator's AI (creator pack START_HERE): a zip <slug>-package-v<N>.zip with manifest.json,
    store.draft.json, pass.draft.json, HANDOFF_NOTE.md, QUESTIONS.md. A dry run: nothing declared for sale in game.json."""
    m = P.get("manifest")
    if zipname:
        R.add("Package", "zip name", "pass" if re.match(ZIP_NAME, os.path.basename(zipname)) else "warn", os.path.basename(zipname) + ("" if re.match(ZIP_NAME, os.path.basename(zipname)) else " · expected <slug>-package-v<N>.zip"), "START_HERE")
    if m is None:
        R.add("Package", "manifest.json", "warn", "no manifest.json: read as a plain game folder (only game.json art: cover, screenshots, trailer)", "START_HERE, manifest.template.json")
        return
    R.add("Package", "manifest.json", "pass", P["sources"].get("manifest.json", "manifest.json"), "manifest.template.json")
    for name, why in (("store.draft.json", "the drafted store (prices UNDECIDED)"), ("pass.draft.json", "the drafted pass (price and days UNDECIDED)"),
                      ("HANDOFF_NOTE.md", "what was made and how"), ("QUESTIONS.md", "the open questions, numbered")):
        R.add("Package", name, "pass" if name in P["sources"] else "warn", P["sources"].get(name) or f"missing: {why}", "START_HERE")
    g = P["game"]
    decl = [k for k in ("products", "pass", "memberGift") if k in g]
    if decl:
        R.add("Package", "dry run: nothing declared in game.json", "fail", "game.json declares " + ", ".join(decl) + ": drafts belong in store.draft.json / pass.draft.json until the founder decides (Q1, Q4, Q10)", "START_HERE")
    elif g:
        R.add("Package", "dry run: nothing declared in game.json", "pass", "no products, pass or memberGift in game.json", "START_HERE")
    if isinstance(m, dict):
        slug = m.get("game") or m.get("slug")
        if slug and g.get("title") and slug != slugify(g["title"]):
            R.add("Package", "slug", "warn", f"manifest game \"{slug}\" vs title slug \"{slugify(g['title'])}\"", "manifest.template.json")
        meas = m.get("measure") or {}
        col = meas.get("colour") if isinstance(meas, dict) else None
        lig = meas.get("light") if isinstance(meas, dict) else None
        if not col and not lig:
            R.add("Package", "measure.py readings", "warn", "no light or colour readings in manifest.measure", "CREATOR_KIT self-check 4–5, tools/measure.py")
        else:
            txt = json.dumps(col or {})
            nohash = sorted(set(re.findall(r'(?<![#0-9A-Za-z])([0-9A-Fa-f]{6})(?![0-9A-Za-z])', txt)))
            R.add("Package", "measure.py colour readings with the #", "fail" if nohash else "pass",
                  ("hex without '#': " + ", ".join(nohash) + " (read them again as '#RRGGBB')") if nohash else f"{len(re.findall(r'#[0-9A-Fa-f]{6}', txt))} colours; light: {'yes' if lig else 'no'}",
                  "tools/measure.py colour '#RRGGBB'")
        und = m.get("undecided")
        if isinstance(und, dict) and und:
            bad = [k for k, v in und.items() if not re.search(r"UNDECIDED \(Q\d+", str(v))]
            if bad:
                R.add("Package", "undecided fields name their question", "warn", "no '(Qn)': " + ", ".join(bad[:8]), "START_HERE")
    hasA = any(r.get("exists") for r in P["slots"].get("living_poster", []))
    hasB = bool(find_first(P["root"], "parts.json"))
    R.add("Package", "living poster: both versions", "pass" if hasA and hasB else "warn", f"A (code module): {'yes' if hasA else 'no'} · B (parts kit): {'yes' if hasB else 'no'}", "living-poster/CONTRACT.md, PARTS.md")


MODULE_BANNED = [(r"\bimport\s*[({\"'*a-zA-Z]", "import"), (r"\bexport\b", "export"), (r"\bwindow\b", "window"), (r"\bdocument\b", "document"),
                 (r"\b(fetch|XMLHttpRequest|WebSocket|EventSource)\b", "network"), (r"\b(setTimeout|setInterval|requestAnimationFrame)\b", "timers"),
                 (r"\b(eval|Function)\s*\(", "eval"), (r"\bnew\s+Image\b|\.src\s*=", "images"), (r"\blocalStorage|indexedDB|cookie\b", "storage"),
                 (r"getImageData", "getImageData (perf rule)")]


def lint_module(r, R):
    """CONTRACT.md: one file that does exactly BUG_MODS.<key> = {...}; no DOM, timers, network, images. Read as text only."""
    src = open(r["path"], encoding="utf-8", errors="ignore").read()
    code = re.sub(r"/\*.*?\*/", "", src, flags=re.S); code = re.sub(r"(?m)//.*$", "", code)
    m = re.search(r"BUG_MODS\.([A-Za-z_$][\w$]*)\s*=\s*\{", code)
    r["module_key"] = m.group(1) if m else None
    lab = "living poster · " + os.path.basename(r["file"])
    if not m:
        R.add("Art", lab, "fail", "does not assign BUG_MODS.<key> = {…}", "living-poster/CONTRACT.md", slot="living_poster", ref=r["file"]); r["lint_ok"] = False; return
    bad = sorted({lab_ for rx, lab_ in MODULE_BANNED if re.search(rx, code)})
    tops = [x for x in re.findall(r"(?m)^(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)", code)]
    fields = [f for f in ("key", "no", "title", "maker", "kind", "verb", "ground", "ink", "items", "create") if not re.search(r"\b" + f + r"\s*[:(]", code)]
    modes = [x for x in ("react", "enter", "loop", "squeezed") if not re.search(r"['\"]" + x + r"['\"]", code)]
    r["lint_ok"] = not bad and not tops
    R.add("Art", lab + " contract", "fail" if bad or tops else "pass",
          (f"uses {', '.join(bad)}" if bad else "no DOM, timers, network or images") + (f"; top-level names outside the object: {', '.join(tops)}" if tops else "") + f"; key '{m.group(1)}', {len(code) / 1024:.0f} KB",
          "living-poster/CONTRACT.md", slot="living_poster", ref=r["file"])
    R.add("Art", lab + " fields and modes", "warn" if fields or modes else "pass",
          ("missing fields: " + ", ".join(fields) + "; " if fields else "all fields; ") + ("no mention of modes: " + ", ".join(modes) if modes else "react, enter, loop, squeezed all handled"),
          "living-poster/CONTRACT.md", slot="living_poster", ref=r["file"])


def size_verdict(spec, w, h):
    if "exact" in spec:
        ok = [tuple(spec["exact"])] + [tuple(x) for x in spec.get("alt", [])]
        if (w, h) in ok:
            return "pass", f"{w}×{h}"
        ew, eh = spec["exact"]
        if abs(w / h - ew / eh) < 0.01 and w > ew:
            return "warn", f"{w}×{h}: right shape, larger than the kit's {ew}×{eh} (scaled down)"
        return "fail", f"{w}×{h}: the kit asks {ew}×{eh}"
    if "max" in spec:
        mw, mh = spec["max"]
        return ("pass", f"{w}×{h} (≤{mw}×{mh})") if w <= mw and h <= mh else ("fail", f"{w}×{h}: the kit asks ≤{mw}×{mh}")
    why = f"{w}×{h}"
    if "ratio" in spec and abs(w / h - spec["ratio"]) / spec["ratio"] > 0.01:
        return "fail", f"{w}×{h} is {w / h:.3f}:1, the kit asks {spec['ratio']:.3f}:1"
    if "min" in spec and (w < spec["min"][0] or h < spec["min"][1]):
        return "fail", f"{w}×{h}: below the kit's minimum {spec['min'][0]}×{spec['min'][1]}"
    return "pass", why


# ------------------------------------------------------------------ money: products, pass, gift
def _sources(P, *keys):
    """candidate values in order: game.json, the side files (store.draft.json, pass.draft.json…), the manifest."""
    m = P["manifest"] if isinstance(P["manifest"], dict) else {}
    for src in (P["game"], P["extra"], m):
        for k in keys:
            if isinstance(src, dict) and src.get(k) not in (None, "", []):
                yield src[k]


def _items(v):
    if isinstance(v, dict):
        extra = []
        for k, x in v.items():
            if k in ("items", "products") or not re.search(r"featured|limited|proposal", k, re.I):
                continue
            extra += [i for i in (x if isinstance(x, list) else [x]) if isinstance(i, dict) and i.get("id")]
        base = v.get("items") if isinstance(v.get("items"), list) else v.get("products") if isinstance(v.get("products"), list) else []
        v = base + extra
    return [i for i in v if isinstance(i, dict)] if isinstance(v, list) else []


def products_of(P):
    for v in _sources(P, "products", "store"):
        it = _items(v)
        if it:
            return it
    return []


def pass_of(P):
    for v in _sources(P, "pass"):
        if isinstance(v, dict) and (isinstance(v.get("steps"), list) or (v.get("name") and not v.get("file"))):
            return v
    return None


def events_of(P):
    d = drafts_of(P)
    v = merged(P, "events", "event") or d.get("events") or d.get("event")
    if isinstance(v, dict):
        v = v.get("events") if isinstance(v.get("events"), list) else [v]
    return v if isinstance(v, list) else []


def updates_of(P):
    d = drafts_of(P)
    v = merged(P, "updates", "update") or d.get("updates") or d.get("update")
    if isinstance(v, dict):
        v = v.get("updates") if isinstance(v.get("updates"), list) else [v]
    return v if isinstance(v, list) else []


def price_state(v, item):
    """('undecided'|'unsourced'|'sourced'|'missing', number or None)."""
    src = item.get("priceSource") or item.get("price_source") or item.get("source")
    if v is None:
        return "missing", None
    if isinstance(v, str) and re.search(r"undecided|tbd|not set|\?", v, re.I):
        return "undecided", None
    if isinstance(v, dict):
        return price_state(v.get("crumbs", v.get("value")), dict(item, priceSource=v.get("source") or src))
    try:
        n = float(v)
    except Exception:
        return "undecided", None
    return ("sourced" if src else "unsourced"), n


RETURN_WORDS = r"(back|returns?|again|january|february|march|april|may|june|july|august|september|october|november|december|spring|summer|autumn|fall|winter|christmas|halloween|\d{4}-\d\d|next (week|month|season|year))"


def check_money(P, R):
    prods = products_of(P)
    ids = set()
    if prods:
        R.add("Store", "who may sell", "UNDECIDED", f"{len(prods)} item(s) drafted; Plans board: Free sells looks, Publish screen: 'Selling comes with bug.pass'", "UK", q=11)
        R.add("Store", "item types and price guide", "UNDECIDED", "the SDK sets fields only; no item-type list or price guide exists", "UK", q=1)
        R.add("Store", "refunds", "UNDECIDED", "Wallet: unspent crumbs within 48 h; store rules: 'refunds within 48 hours'", "UK", q=18)
    for i, it in enumerate(prods):
        if not isinstance(it, dict):
            R.add("Store", f"item {i + 1}", "fail", "not an object", "SDK products"); continue
        nm = it.get("name") or it.get("id") or f"item {i + 1}"
        lab = f"item · {nm}"
        miss = [k for k in ("id", "name", "description", "price", "kind") if it.get(k) in (None, "")]
        if miss:
            R.add("Store", lab + " fields", "fail", "missing " + ", ".join(miss), "SDK products (id, name, description, price, kind)")
        else:
            R.add("Store", lab + " fields", "pass", "id, name, description, price, kind", "SDK products")
        if it.get("id") in ids:
            R.add("Store", lab + " id unique", "fail", f"duplicate id {it.get('id')}", "SDK: id is permanent")
        ids.add(it.get("id"))
        if it.get("kind") and it["kind"] not in K.PRODUCT_KINDS:
            R.add("Store", lab + " kind", "fail", f"\"{it['kind']}\": consumable or durable", "SDK products")
        ps, n = price_state(it.get("price"), it)
        if ps == "undecided":
            R.add("Store", lab + " price", "UNDECIDED", f"price \"{it.get('price')}\" → the page shows 'price not set'", "UK", q=1)
        elif ps == "unsourced":
            R.add("Store", lab + " price", "UNSOURCED", f"{n:g} crumbs with no source; no price guide exists (Q1)", "UK Q1; README: never invent prices", q=1)
        elif ps == "sourced":
            R.add("Store", lab + " price", "pass", f"{n:g} crumbs · source: {it.get('priceSource') or it.get('source')}", "SDK products")
        lim = it.get("limited")
        if lim is not None and lim is not False:
            txt = lim if isinstance(lim, str) else ""
            R.add("Store", lab + " limited says when it returns", "pass" if re.search(RETURN_WORDS, txt, re.I) else "fail",
                  f"limited: \"{txt}\"" if txt else "limited without a return line", "SDK: a limited item MUST say when it returns")
        if it.get("featured") or it.get("bundle") or it.get("starter") or it.get("sale") or it.get("discount"):
            k = [x for x in ("featured", "bundle", "starter", "sale", "discount") if it.get(x)]
            R.add("Store", lab + " " + "/".join(k), "UNDECIDED", "featured items, bundles, starter packs and sales are defined nowhere", "UK", q=2)
        if re.search(r"chapter", json.dumps(it), re.I):
            R.add("Store", lab + " members-only chapter", "UNDECIDED", "chapters: offered in Publish, conflicts with 'never sell unfinished content'", "UK", q=12)
        if re.search(r"\b(stronger|damage|faster|win|power|boost|advantage)\b", (it.get("description") or ""), re.I):
            R.add("Store", lab + " looks only", "warn", "the description may describe an advantage; staff refuse anything that beats other players", "SDK, KIT 8")
    pz = pass_of(P)
    if pz:
        lab = f"pass · {pz.get('name') or pz.get('id')}"
        miss = [k for k in ("id", "name", "price", "days", "steps") if pz.get(k) in (None, "", [])]
        R.add("Pass", "fields", "fail" if miss else "pass", ("missing " + ", ".join(miss)) if miss else "id, name, price, days, steps", "SDK pass")
        ps, n = price_state(pz.get("price"), pz)
        if ps == "undecided":
            R.add("Pass", lab + " price", "UNDECIDED", f"price \"{pz.get('price')}\" → 'price not set'", "UK", q=1)
        elif ps == "unsourced":
            R.add("Pass", lab + " price", "UNSOURCED", f"{n:g} crumbs with no source (roster 900/950, Publish 750 are placeholders)", "UK Q1", q=1)
        steps = pz.get("steps") or []
        mr = pz.get("memberReward")
        R.add("Pass", "length and bug.pass rewards", "UNDECIDED", f"{len(steps)} steps, {1 if mr else 0} memberReward; SDK ~30 steps + one memberReward, canvas 30/24/20 and 2–3 bug.pass rewards", "UK", q=4)
        R.add("Pass", "fill rate", "UNDECIDED", "SDK: one step per ~20 min of play; canvas: one per round", "UK", q=5)
        rids = []
        for i, s in enumerate(steps):
            if not isinstance(s, dict) or not (s.get("free") or s.get("pass")):
                R.add("Pass", f"step {i + 1}", "fail", "needs a free reward, a pass reward or both", "SDK pass.steps"); continue
            for tier in ("free", "pass"):
                r = s.get(tier)
                if r:
                    if not (r.get("id") and r.get("name")):
                        R.add("Pass", f"step {i + 1} {tier}", "fail", "reward needs id and name", "SDK pass.steps")
                    rids.append(r.get("id"))
                    if re.search(r"crumb", json.dumps(r), re.I):
                        R.add("Pass", f"step {i + 1} {tier} crumbs", "UNDECIDED", f"\"{r.get('name')}\" hands out crumbs", "UK", q=6)
        if mr:
            if not (mr.get("step") and mr.get("id") and mr.get("name")):
                R.add("Pass", "memberReward", "fail", "needs step, id, name", "SDK pass.memberReward")
            rids.append(mr.get("id"))
        dup = sorted({x for x in rids if rids.count(x) > 1 and x})
        if dup:
            R.add("Pass", "reward ids unique", "warn", "repeated: " + ", ".join(dup), "SDK")
        P["_pass_rewards"] = [x for x in rids if x]
    else:
        mg = merged(P, "memberGift")
        R.add("Pass", "pass or memberGift", "UNDECIDED", ("no pass; memberGift: " + json.dumps(mg)) if mg else "no pass and no memberGift: what the 'small gift' is stays open", "UK", q=10)
    evs = events_of(P)
    for e in evs:
        nm = e.get("name") or "event"
        miss = [k for k in ("name",) if not e.get(k)]
        when = e.get("ends") or e.get("end") or e.get("endsAt")
        R.add("Events", f"event · {nm}", "fail" if miss else "pass", ("missing " + ", ".join(miss)) if miss else
              f"line: {bool(e.get('line') or e.get('text'))}, counter: {bool(e.get('count') or e.get('target'))}, ends: {when or 'not given (no countdown)'}", "surface list events")
        if re.search(r"crumb", json.dumps(e), re.I):
            R.add("Events", f"event · {nm} crumbs", "UNDECIDED", "the event hands out crumbs", "UK", q=6)
    for u in updates_of(P):
        R.add("Updates", f"update · {u.get('version', '')} {u.get('name') or u.get('title') or ''}".strip(), "pass" if (u.get("name") or u.get("title")) and u.get("version") else "warn",
              "version + name" if (u.get("name") or u.get("title")) and u.get("version") else "needs version and name", "surface list updates")


def place_list(v):
    """place strings as a string, a list, or a dict holding lists / {text: length} maps (e.g. current, proposed)."""
    if isinstance(v, str):
        return [v]
    if isinstance(v, list):
        return [x for x in v if isinstance(x, str)]
    out = []
    if isinstance(v, dict):
        for k, x in v.items():
            if k in ("note", "notes", "why", "rule"):
                continue
            if isinstance(x, dict):
                out += [t for t in x if isinstance(t, str) and not t.startswith("<")]
            elif isinstance(x, list):
                out += [re.sub(r"\s*\(\d+\)$", "", t) for t in x if isinstance(t, str)]
    seen = set()
    return [t for t in out if not (t in seen or seen.add(t))]


def check_words(P, R, S):
    g = P["game"]
    words = merged(P, "words") or {}
    voice = merged(P, "voice") or {}
    if not isinstance(words, dict):
        words = {}
    if not isinstance(voice, dict):
        voice = {}
    verb = words.get("verb") or voice.get("verb") or g.get("verb")
    if verb:
        one = len(re.findall(r"[A-Za-z’'-]+", str(verb))) == 1
        R.add("Words", "one verb", "pass" if one else "fail", f"\"{verb}\"", "KIT W")
    else:
        R.add("Words", "one verb", "warn", "no verb supplied: the wall strip and the result headline go without it", "KIT W (tier 1)")
    places = words.get("place") or words.get("places") or words.get("place_strings")
    for pl in place_list(places):
        R.add("Words", "place string ≤30", "pass" if len(pl) <= K.PLACE_MAX else "fail", f"\"{pl}\" · {len(pl)} chars (words file)", "KIT W")
    kind = words.get("kind") or g.get("kind")
    R.add("Words", "kind (one phrase)", "pass" if (kind or g.get("genre")) else "warn", f"\"{kind}\"" if kind else (f"none; genre \"{g.get('genre')}\" stands in" if g.get("genre") else "none"), "KIT tier 0, surface list")
    # banned words over every text the package hands in
    texts = []
    def walk(x, path):
        if isinstance(x, str):
            texts.append((path, x))
        elif isinstance(x, dict):
            for k, v in x.items():
                if k not in ("file", "path", "src", "cover", "screenshots", "trailer", "accent", "id"):
                    walk(v, path + "." + str(k))
        elif isinstance(x, list):
            for i, v in enumerate(x):
                walk(v, f"{path}[{i}]")
    walk(g, "game.json"); walk(P["extra"], "files")
    if isinstance(P["manifest"], dict):
        walk({k: v for k, v in P["manifest"].items() if k in ("words", "events", "updates", "store", "products", "pass", "voice", "featured")}, "manifest")
    hits = []
    for path, t in texts:
        for rx, lab, src in K.BANNED:
            m = re.search(rx, t, re.I)
            if m:
                hits.append((lab, path, m.group(0), src))
    if hits:
        for lab, path, m, src in hits:
            R.add("Words", f"banned: {lab}", "fail" if lab != "superlative" else "warn", f"\"{m}\" in {path}", src)
    else:
        R.add("Words", "banned words", "pass", f"none of teardown, Fair Play, streak, 'only N left', scarcity, superlatives in {len(texts)} strings", "KIT self-check 11, UK")
    vs = P["slots"].get("voice_sheet")
    if voice or vs:
        have = [k for k in ("rants", "hits", "verb", "yes", "no") if voice.get(k)]
        R.add("Words", "voice sheet", "pass" if len(have) >= 3 else "warn", "has: " + (", ".join(have) or "a file only (not parsed)"), "KIT T2 voice sheet")


POSE_NAMES = {"idle": ["sneak", "idle", "walk", "cycle"], "react": ["react", "reaction", "take", "startle"],
              "squeezed": ["squeezed", "squeeze", "shoved", "squashed"], "still": ["still", "rm", "key", "held"]}


def normalize_parts(kit):
    """parts.json readers differ: map the common variants onto the shape parts-engine.js reads
    (poses.idle/react/squeezed/still, clip, throwable.file, one layer per depth). Returns (kit, notes)."""
    if not isinstance(kit, dict):
        return kit, []
    k = json.loads(json.dumps(kit)); notes = []
    poses = k.get("poses") if isinstance(k.get("poses"), dict) else {}
    pf = lambda name: (poses.get(name) or {}).get("file") if isinstance(poses.get(name), dict) else poses.get(name) if isinstance(poses.get(name), str) else None
    pbm = k.get("pose_by_mode") or k.get("poses_by_mode") or k.get("modes")
    if isinstance(pbm, dict):
        for mode in ("idle", "react", "squeezed", "still"):
            v = pbm.get(mode)
            if mode in poses or v is None:
                continue
            names = v if isinstance(v, list) else [re.split(r"\s*[+,(]\s*", str(v))[0].strip()]
            files = [pf(n) for n in names if pf(n)]
            if files:
                poses[mode] = {"frames": files, "fps": 7} if len(files) > 1 else files[0]
                notes.append(f"{mode} ← pose_by_mode")
    still = k.get("rm_still") or k.get("still")
    if "still" not in poses and still:
        poses["still"] = still if isinstance(still, str) else still.get("file")
        notes.append("still ← rm_still")
    k["poses"] = poses
    if not (k.get("clip") or k.get("loop") or k.get("gameplay")):
        for alt in ("loop_clip", "gameplay_clip", "clip_file", "video"):
            if k.get(alt):
                k["clip"] = k[alt] if isinstance(k[alt], (str, dict)) else None; notes.append(f"clip ← {alt}"); break
    t = k.get("throwable")
    if isinstance(t, dict) and not t.get("file"):
        fs = t.get("files") or t.get("frames")
        if isinstance(fs, list) and fs:
            t["file"] = fs[-1] if isinstance(fs[-1], str) else fs[-1].get("file"); notes.append("throwable ← files[-1]")
    lay = k.get("layers") or []
    if isinstance(lay, list) and lay and all(isinstance(l, dict) for l in lay) and any("z" in l for l in lay):
        seen, keep, alts = set(), [], []
        for l in sorted(lay, key=lambda l: l.get("z", 0)):
            if l.get("z", 0) in seen:
                alts.append(l); continue
            seen.add(l.get("z", 0)); keep.append(l)
        if alts:
            k["alternates"] = alts; notes.append("alternate layers (same z) kept aside: " + ", ".join(str(a.get("id") or a.get("file")) for a in alts))
        k["layers"] = keep
    return k, notes


def check_parts(P, R):
    """B: a parts kit the platform animates (parts-engine.js). Files, alpha, the poses each mode needs, the clip."""
    pj = None
    for cand in ("living-poster-parts", "living_poster_parts", "parts"):
        p = os.path.join(P["root"], cand, "parts.json")
        if os.path.exists(p):
            pj = p; break
    pj = pj or find_first(P["root"], "parts.json")
    if not pj:
        return
    kit = load_json(pj, R, "parts.json")
    if not isinstance(kit, dict):
        return
    kit, notes = normalize_parts(kit)
    base = os.path.dirname(pj); lab = "parts kit · " + os.path.relpath(pj, P["root"])
    if notes:
        R.add("Art", lab + " read as", "pass", "; ".join(notes), "parts-engine.js tolerant reader", slot="living_poster_parts")
    files = []
    def spec_files(v):
        if isinstance(v, str): return [v]
        if isinstance(v, list): return [x if isinstance(x, str) else x.get("file") for x in v]
        if isinstance(v, dict): return [x if isinstance(x, str) else x.get("file") for x in v.get("frames", [])] or ([v["file"]] if v.get("file") else [])
        return []
    layers = kit.get("layers") or []
    for l in layers:
        files.append(("layer", l if isinstance(l, str) else l.get("file")))
    poses = kit.get("poses") or {}
    for k, v in poses.items():
        for f in spec_files(v):
            files.append(("pose " + k, f))
    clip = kit.get("clip") or kit.get("loop") or kit.get("gameplay")
    for f in spec_files(clip):
        files.append(("clip", f))
    for l in kit.get("alternates") or []:
        files.append(("alternate layer", l.get("file")))
    if kit.get("throwable"):
        files.append(("throwable", kit["throwable"] if isinstance(kit["throwable"], str) else kit["throwable"].get("file")))
    missing, noalpha, total = [], [], os.path.getsize(pj)
    for role, f in files:
        ap = os.path.normpath(os.path.join(base, f or ""))
        if not f or not os.path.exists(ap):
            missing.append(f"{role}: {f}"); continue
        total += os.path.getsize(ap)
        if (role.startswith("pose") and role not in ("pose still", "pose rm")) or role == "throwable" or (role == "layer" and files.index((role, f)) > 0):
            try:
                from PIL import Image
                with Image.open(ap) as im:
                    if "A" not in im.getbands() and im.mode != "P":
                        noalpha.append(f)
            except Exception:
                pass
    R.add("Art", lab + " files", "fail" if missing else "pass", ("missing: " + "; ".join(missing)) if missing else f"{len(files)} files, {total / 1024:,.0f} KB", "parts-engine.js reader", slot="living_poster_parts")
    if noalpha:
        R.add("Art", lab + " alpha", "fail", "poses / upper layers need alpha: " + ", ".join(noalpha), "parts kit: layers and poses with alpha", slot="living_poster_parts")
    gaps = [m for m, names in POSE_NAMES.items() if not any(n in poses for n in names)]
    R.add("Art", lab + " poses per mode", "warn" if gaps else "pass", ("no pose for: " + ", ".join(gaps) + " (the engine reuses another)") if gaps else "idle/sneak, react, squeezed, still", "parts-engine.js modes", slot="living_poster_parts")
    if clip:
        cf = spec_files(clip)
        d = None
        if len(cf) == 1 and os.path.splitext(cf[0])[1].lower() in VID_EXT:
            m = media_size(os.path.normpath(os.path.join(base, cf[0])))
            d = m[2] if m and len(m) > 2 else None
        elif isinstance(clip, dict) and clip.get("frames"):
            d = len(clip["frames"]) / float(clip.get("fps") or 8)
        R.add("Art", lab + " gameplay clip", "pass" if d and 4 <= d <= 8 else "warn", f"{d:.1f} s" + ("" if d and 4 <= d <= 8 else " (the loop mode asks 4–8 s)") if d else "length unknown", "living-poster/CONTRACT.md loop 4–8 s", slot="living_poster_parts")
    else:
        R.add("Art", lab + " gameplay clip", "warn", "no clip: loop mode replays the idle", "parts kit", slot="living_poster_parts")
    if not kit.get("throwable"):
        R.add("Art", lab + " throwable", "warn", "no throwable: the board's idle gag has nothing to throw", "living-poster/CONTRACT.md items", slot="living_poster_parts")
    P["_parts_bytes"] = total


def check_page(P, R, present):
    hooks = {}
    for h, slot in K.PAGE_HOOKS.items():
        if slot is None:
            hooks[h] = dict(source="none in the kit (a drawn reward moment)", fallback=True)
        else:
            ok = slot in present
            hooks[h] = dict(source=slot if ok else None, fallback=not ok, fb=None if ok else K.FALLBACK.get(slot))
    fb = [h for h, v in hooks.items() if v["fallback"]]
    R.add("Page", "page hooks fed (GAMEPAGE §4)", "UNDECIDED" if fb else "pass",
          (f"{len(K.PAGE_HOOKS) - len(fb)} of {len(K.PAGE_HOOKS)} hooks fed by the package; platform fallbacks drawn for: " + ", ".join(fb)) if fb else "all 9 hooks fed",
          "GP §4 (KIT.REQUIRED); UK", q=7 if fb else None)
    R.add("Page", "More like this", "UNDECIDED", "neighbours are hand-listed today; the board shows placeholders", "UK", q=15)
    return hooks


def art_tier(P, present):
    t1 = [s for s in K.TIER1_SLOTS if s not in present and not (s == "store_item" and not products_of(P)) and not (s == "pass_reward" and not pass_of(P))]
    t2 = [s for s in K.TIER2_SLOTS if s not in present]
    if t1:
        return 0, t1, t2
    return (2 if not t2 else 1), t1, t2


def facts_agree(P, R):
    m = P["manifest"] if isinstance(P["manifest"], dict) else {}
    g = P["game"]; diffs = []
    for k in ("title", "minutes", "players", "genre"):
        mv = m.get(k) if k in m else (m.get("game", {}) or {}).get(k) if isinstance(m.get("game"), dict) else None
        if mv not in (None, "") and g.get(k) not in (None, "") and str(mv) != str(g.get(k)):
            diffs.append(f"{k}: game.json {g.get(k)!r} vs manifest {mv!r}")
    if diffs:
        R.add("Listing", "one source for game facts", "UNDECIDED", "; ".join(diffs), "UK", q=19)


# ------------------------------------------------------------------ main
def validate(pkg, label=None, zipname=None):
    R = Report()
    P = load_package(pkg, R)
    check_package(P, R, zipname)
    S = scan_build(P, R)
    check_listing(P, R)
    check_honesty(P, R, S)
    check_build(P, R, S)
    present = check_art(P, R)
    check_money(P, R)
    check_words(P, R, S)
    check_parts(P, R)
    facts_agree(P, R)
    hooks = check_page(P, R, present)
    tier, miss1, miss2 = art_tier(P, present)
    counts = {}
    for f in R.items:
        counts[f["status"]] = counts.get(f["status"], 0) + 1
    und = sorted({f["q"] for f in R.items if f["q"]})
    rep = dict(
        package=os.path.relpath(P["root"], HERE) if P["root"].startswith(os.path.dirname(HERE)) else P["root"],
        package_abs=P["root"], label=label or os.path.basename(P["root"].rstrip("/")), date=str(date.today()),
        sources=P["sources"], tier=tier, tier_missing=dict(tier1=miss1, tier2=miss2), counts=counts,
        undecided=[dict(q=q, question=K.OPEN_QUESTIONS[q], findings=[f["id"] for f in R.items if f["q"] == q]) for q in und],
        hooks=hooks, findings=R.items,
        scan=dict(sdk=sorted(S.get("sdk", [])), moments_code=S.get("moments_code", []), places=S.get("places", []),
                  build_bytes=S.get("build_bytes", 0), store_bytes=S.get("store_bytes", 0), save=S.get("save"), multiplayer=S.get("multiplayer")),
        slots={k: [dict((kk, vv) for kk, vv in r.items() if kk != "path") | dict(rel=os.path.relpath(r["path"], P["root"]) if r.get("path") else None) for r in v] for k, v in P["slots"].items()},
    )
    return rep, P, S


STATUS_ORDER = ["fail", "UNSOURCED", "UNDECIDED", "warn", "pass"]


def print_summary(rep):
    for f in sorted(rep["findings"], key=lambda f: STATUS_ORDER.index(f["status"])):
        if f["status"] in ("fail", "UNSOURCED", "UNDECIDED"):
            print(f"  {f['status'] + (' Q' + str(f['q']) if f['q'] else ''):<14} {f['area']} · {f['check']}: {f['detail'][:160]}")


def write_md(rep, path):
    L = []
    c = rep["counts"]
    L.append(f"# Upload check · {rep['label']}")
    L.append("")
    L.append(f"Package `{rep['label']}` · checked {rep['date']} · harness `validate.py` (bug.games handoff harness). Sources: the SDK reference, `CREATOR_KIT.md`, the Game upload kit (19 open questions), `GAMEPAGE.md`, `manifest.template.json`.")
    L.append("")
    L.append("| fail | UNSOURCED | UNDECIDED | warn | pass | art tier |")
    L.append("|---|---|---|---|---|---|")
    L.append(f"| {c.get('fail', 0)} | {c.get('UNSOURCED', 0)} | {c.get('UNDECIDED', 0)} | {c.get('warn', 0)} | {c.get('pass', 0)} | **{rep['tier']}** |")
    L.append("")
    tm = rep["tier_missing"]
    L.append(f"Art tier {rep['tier']} (CREATOR_KIT). Missing for tier 1: {', '.join(tm['tier1']) or 'nothing'}. Missing for tier 2: {', '.join(tm['tier2']) or 'nothing'}.")
    L.append("")
    L.append("## Open questions this package hits (UNDECIDED: not decided here)")
    L.append("")
    L.append("| # | Question (upload kit) | Where it bites |")
    L.append("|---|---|---|")
    byid = {f["id"]: f for f in rep["findings"]}
    for u in rep["undecided"]:
        where = "; ".join(f"{byid[i]['check']}" for i in u["findings"][:4])
        L.append(f"| {u['q']} | {u['question']} | {where} |")
    L.append("")
    L.append("## Page build (GAMEPAGE §4 hooks)")
    L.append("")
    L.append("| hook | fed by | fallback drawn |")
    L.append("|---|---|---|")
    for h, v in rep["hooks"].items():
        L.append(f"| `{h}` | {v.get('source') or '—'} | {v.get('fb') or ('—' if not v['fallback'] else 'no drawn reward moment: owned tiles show the platform tick')} |")
    L.append("")
    areas = []
    for f in rep["findings"]:
        if f["area"] not in areas:
            areas.append(f["area"])
    for a in areas:
        L.append(f"## {a}")
        L.append("")
        L.append("| status | check | detail | source |")
        L.append("|---|---|---|---|")
        fs = sorted([f for f in rep["findings"] if f["area"] == a], key=lambda f: STATUS_ORDER.index(f["status"]))
        for f in fs:
            st = f["status"] + (f" Q{f['q']}" if f["q"] else "")
            L.append(f"| {st} | {f['check']} | {f['detail'].replace('|', '/')} | {f['source']} |")
        L.append("")
    sc = rep["scan"]
    L.append("## Read from the code (static, never run)")
    L.append("")
    L.append(f"- SDK calls: {', '.join(sc['sdk']) or 'none'}")
    L.append(f"- moments reported: {', '.join(sc['moments_code']) or 'none'}")
    L.append(f"- place strings: {', '.join(repr(p['text']) for p in sc['places']) or 'none found'}")
    L.append(f"- save layer: {'yes' if sc['save'] else 'no'} · rooms: {'yes' if sc['multiplayer'] else 'no'}")
    L.append("")
    open(path, "w", encoding="utf-8").write("\n".join(L) + "\n")


def main(argv):
    if len(argv) < 2:
        print(__doc__); return 2
    if PIL is None:
        print("validate.py needs Pillow to read image sizes: python3 -m pip install Pillow"); return 2
    pkg = argv[1]; out = os.path.join(os.getcwd(), "selfcheck-report"); label = None; zipname = None
    if "--out" in argv:
        out = argv[argv.index("--out") + 1]
    if "--label" in argv:
        label = argv[argv.index("--label") + 1]
    if "--zipname" in argv:
        zipname = argv[argv.index("--zipname") + 1]
    os.makedirs(out, exist_ok=True)
    rep, P, S = validate(pkg, label, zipname)
    json.dump(rep, open(os.path.join(out, "report.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    write_md(rep, os.path.join(out, "report.md"))
    c = rep["counts"]
    print(f"{rep['label']}: tier {rep['tier']} · " + " · ".join(f"{k} {c.get(k, 0)}" for k in STATUS_ORDER) + f" · undecided Qs {[u['q'] for u in rep['undecided']]}")
    print_summary(rep)
    print("report: " + os.path.join(out, "report.md"))
    return 1 if c.get("fail") else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
