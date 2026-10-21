#!/usr/bin/env python3
"""Turn a game's studio folder into the folder the games connector uploads.

    python3 direction/tools/bug2upload.py <slug> --build <game.html> --out <dir> [--words <words.json>] [--money <money.json>]

Reads games/<slug>/bug/ (pictures by the direction's file names) and the
game's words.json (default: games/<slug>/bug/words.json), and writes:

    <out>/index.html   the game build
    <out>/bug/...      every picture, plus publish.json and words.json
    <out>/game.json    the page fields the platform reads, from words.json

The platform fills its art slots from bug/ by file name, so game.json names
no pictures except the cover (the 2:1 poster). Moments whose rule is
UNDECIDED, empty control lists and every price stay out: nothing is declared
that the game has not decided, unless --money names a file that declares
products, pass and events (a mock, or prices he has said yes to). Prints what it left out and why.
"""
import argparse, json, re, shutil, sys
from pathlib import Path

STUDIO = Path(__file__).resolve().parents[2]
RASTER = {".png", ".jpg", ".jpeg", ".webp"}
KEEP = RASTER | {".json"}
SKIP_DIRS = {"checks", "living-poster", "reward", "make"}  # code modules and working files, not slots yet
INPUTS = {"keyboard", "mouse", "gamepad", "touch"}

def undecided(v):
    return isinstance(v, str) and "UNDECIDED" in v

def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", re.sub(r"['’]", "", s.lower())).strip("-")

def seal_names(moment):
    """The names a moment's seal files may go by, most exact first."""
    a = slug(moment)
    b = slug(re.sub(r"['’]s\b", "", moment))       # Gus's patch -> gus-patch
    c = re.sub(r"^(the|a|an)-", "", a)            # The Long Table -> long-table
    return list(dict.fromkeys([a, b, c, re.sub(r"^(the|a|an)-", "", b)]))

def seals_art(bug, moments, notes):
    """game.json art lines for each moment's three seals, matched loosely to
    the seal files; the platform's own matching is exact."""
    have = {f.name for f in (bug / "seals").glob("*.png")} if (bug / "seals").is_dir() else set()
    art = {"seals": {}, "sealsProgress": {}, "sealsLocked": {}}
    used = set()
    for m in moments:
        for n in seal_names(m):
            if f"{n}-earned.png" in have:
                for state, slot in (("earned", "seals"), ("progress", "sealsProgress"), ("locked", "sealsLocked")):
                    if f"{n}-{state}.png" in have:
                        art[slot][m] = f"bug/seals/{n}-{state}.png"
                used.add(n)
                break
        else:
            notes.append(f"no seal for moment {m!r}: name its files seals/{slug(m)}-earned.png …")
    spare = sorted({re.sub(r"-(earned|progress|locked)\.png$", "", f) for f in have} - used)
    if spare:
        notes.append(f"seal files with no moment: {', '.join(spare)}")
    return {k: v for k, v in art.items() if v}

def clip(s, n):
    return s if len(s) <= n else s[: n - 1].rstrip() + "…"

def game_json(words, notes):
    g = {}
    for k, n in (("title", 80), ("hook", 120), ("description", 2000), ("genre", 40), ("players", 40), ("contentNote", 200)):
        v = words.get(k)
        if isinstance(v, str) and v.strip() and not undecided(v):
            if len(v) > n:
                notes.append(f"{k} cut to {n} characters")
            g[k] = clip(v.strip(), n)
    for k in ("coop", "minutes", "mood"):
        if k in words and not undecided(words[k]):
            g[k] = words[k]
    if isinstance(words.get("inputs"), list):
        g["inputs"] = [i for i in words["inputs"] if i in INPUTS][:4]
    if isinstance(words.get("tags"), list):
        g["tags"] = [t for t in words["tags"] if not undecided(t)][:5]

    # controls: the platform holds {key, action}; the first input's list,
    # keyboard before touch; the notes stay in words.json.
    c = words.get("controls")
    if isinstance(c, dict):
        for inp in ("keyboard", "touch", "mouse", "gamepad"):
            rows = c.get(inp) or []
            if rows:
                g["controls"] = [{"key": r["key"], "action": r["action"]} for r in rows if r.get("key") and r.get("action")][:12]
                notes.append(f"controls from {inp}; the other inputs and the notes stay in words.json")
                break
    elif isinstance(c, list):
        g["controls"] = c

    m = words.get("moments")
    if isinstance(m, list):
        names = []
        for x in m:
            name = x if isinstance(x, str) else x.get("name")
            rule = "" if isinstance(x, str) else x.get("rule", "")
            if not name or undecided(rule) or undecided(name):
                notes.append(f"moment {name!r} left out: undecided")
                continue
            names.append(name)
        g["moments"] = names[:12]
    return g

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--build", required=True, help="the game's built single-file html")
    ap.add_argument("--out", required=True)
    ap.add_argument("--words", help="words.json (default: the studio's bug/words.json)")
    ap.add_argument("--money", help="a JSON file with products, pass and events to declare (e.g. direction/mocks/<slug>.money.json)")
    a = ap.parse_args()

    bug = STUDIO / "games" / a.slug / "bug"
    if not bug.is_dir():
        sys.exit(f"no {bug}")
    words_path = Path(a.words) if a.words else bug / "words.json"
    if not words_path.is_file():
        sys.exit(f"no words.json at {words_path}: the page has no title or hook without it")
    words = json.loads(words_path.read_text())

    out = Path(a.out)
    if out.exists():
        shutil.rmtree(out)
    (out / "bug").mkdir(parents=True)
    shutil.copyfile(a.build, out / "index.html")

    copied = 0
    for f in sorted(bug.rglob("*")):
        rel = f.relative_to(bug)
        if not f.is_file() or rel.parts[0] in SKIP_DIRS or f.suffix.lower() not in KEEP:
            continue
        if f.suffix == ".json" and rel.name not in ("publish.json",):
            continue
        dst = out / "bug" / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(f, dst)
        copied += 1
    shutil.copyfile(words_path, out / "bug" / "words.json")

    notes = []
    g = game_json(words, notes)
    for name in ("poster.png", "poster-2x1.png"):
        if (bug / name).is_file():
            g["cover"] = f"bug/{name}"
            break
    else:
        notes.append("no poster: the page has no cover")
    if a.money:
        money = json.loads(Path(a.money).read_text())
        for k in ("products", "pass", "events"):
            if k in money:
                g[k] = money[k]
        notes.append(f"declared {', '.join(k for k in ('products', 'pass', 'events') if k in money)} from {a.money}: {money.get('status', '')[:60]}")
    seals = seals_art(bug, g.get("moments", []), notes)
    if seals:
        g["art"] = seals
    (out / "game.json").write_text(json.dumps(g, indent=2, ensure_ascii=False) + "\n")

    print(f"{out}: index.html, game.json, bug/ ({copied} files + words.json)")
    for n in notes:
        print(f"  · {n}")

if __name__ == "__main__":
    main()
