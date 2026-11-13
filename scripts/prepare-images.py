#!/usr/bin/env python3
"""Crop and export site images as <name>-800.webp / <name>-1600.webp.

spec.json: {"hero": {"src": "originals/photo.jpg", "box": [x0, y0, x1, y1]}, ...}
box values are fractions of width/height — crop so no brand badges or number plates remain visible.
Usage: python3 scripts/prepare-images.py spec.json public/sites/<slug>/img
"""
import json, sys
from pathlib import Path
from PIL import Image

spec, out = json.load(open(sys.argv[1])), Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
base = Path(sys.argv[1]).parent
for name, item in spec.items():
    im = Image.open(base / item["src"]).convert("RGB")
    w, h = im.size
    a, b, c, d = item.get("box", [0, 0, 1, 1])
    im = im.crop((int(a * w), int(b * h), int(c * w), int(d * h)))
    for size in (1600, 800):
        t = im if im.width <= size else im.resize((size, round(im.height * size / im.width)), Image.LANCZOS)
        t.save(out / f"{name}-{size}.webp", quality=78, method=6)
    print(f"{name}: {im.size}")
