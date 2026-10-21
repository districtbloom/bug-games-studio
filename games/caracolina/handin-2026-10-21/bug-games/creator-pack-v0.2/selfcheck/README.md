# Self-check

The same validator the platform runs on every returned package (the operator pack's `validate.py` and `kit_spec.py`, unchanged).

```
python3 -m pip install Pillow            # the only dependency (ffprobe, if present, adds video sizes)
python3 selfcheck/validate.py <package_dir> [--out DIR] [--zipname <slug>-package-v<N>.zip]
```

It prints the counts and every `fail`, `UNSOURCED` and `UNDECIDED` line, and writes `report.md` and `report.json` to `./selfcheck-report/` (or `--out`). Exit code 1 means at least one `fail`.

- `fail`: fix it (a wrong size, a missing file, a place string over 30, a declaration in `game.json`, a reading without its `#`…).
- `UNSOURCED`: a number with no source (a price): replace it with `"UNDECIDED (Q1)"`.
- `UNDECIDED Qn`: one of the upload kit's open questions. Leave it marked; it is not yours to decide.
- `warn`: read each one; many are platform fallbacks you can remove by supplying the slot.

Nothing in the package is executed: code is only read as text.
