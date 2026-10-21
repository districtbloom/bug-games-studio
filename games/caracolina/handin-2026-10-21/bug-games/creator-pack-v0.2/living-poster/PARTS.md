# Living poster, version B: the parts kit (the platform animates; the game supplies art)

Put everything in `living-poster-parts/` with a `parts.json`.

- **Layers** (PNG with alpha), made at the largest plate (~900×640) and recomposable for any aspect: background · the hero as a cut-out · foreground · optional second character.
- **Key poses** of the hero (cut-outs with alpha, each with an anchor point): idle A / idle B (a 2–4 frame cycle) · react (the hover reaction) · squeezed (pressed small) · the reduced-motion still (the full composed poster).
- **One throwable**: a small sprite that neighbours can receive.
- **Gameplay loop clip**: 4–8 s of real play captured from the game (MP4 or WebM, ≥ 900 px wide, no HUD clutter), played on hover.
- **parts.json**: each layer and pose: file, size, anchor, z-order, the safe area that must survive a tiny plate, and a note on use (parallax depth; which pose for which mode).

The platform engine animates: idle (parallax + cycle) → react (pose + hold) → enter (push-in into the clip) → loop (clip) → squeezed (pose) · reduced motion (still), recomposed to any plate from ~120×90 to ~900×640.

## The `parts.json` shape the platform reads

File paths are relative to `parts.json`. Sizes in pixels of the files as handed in.

```json
{
  "design": [1800, 1280],
  "focus": [0.5, 0.45],
  "safe_area": {"all_plates": [0.39, 0.20, 0.79, 0.77], "tiny_plate": [0.41, 0.37, 0.60, 0.77]},
  "layers": [
    {"id": "background", "file": "layer-background.png", "z": 0, "depth": 0.15, "note": "no characters"},
    {"id": "grownup", "file": "layer-grownup.png", "z": 1, "depth": 0.4},
    {"id": "foreground", "file": "layer-foreground.png", "z": 3, "depth": 0.9}
  ],
  "character": {"x": 760, "y": 420, "w": 290, "h": 520},
  "poses": {
    "idle": {"frames": ["poses/hero-idle-0.png", "poses/hero-idle-1.png", "poses/hero-idle-2.png"], "fps": 7},
    "react": "poses/hero-react.png",
    "squeezed": "poses/hero-squeezed.png",
    "still": "rm-still.png"
  },
  "throwable": {"id": "biscuit", "file": "throwable-biscuit-128.png"},
  "clip": {"file": "loop.mp4", "seconds": 6}
}
```

- `layers`: back to front, one per depth (`z`); upper layers and every pose need alpha. An alternative layer for a mode (e.g. the background in the enter mode) may share a `z`: the platform keeps it aside.
- `character`: the box (design px) where poses are drawn. If you also hand in a full-frame layer of the hero, the platform reads the box from that layer's alpha and draws the poses instead of it.
- Also read: `pose_by_mode` (mode → pose names), `rm_still`, `loop_clip`, `throwable.files` (the largest is used).
- Check it with `selfcheck/validate.py`: it reports which fields it read, missing files, alpha, a pose per mode and the clip length.
