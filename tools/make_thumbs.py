"""Make web-sized copies of portfolio photos and video thumbnails.

Run from the repo root:  python tools/make_thumbs.py
GitHub runs this automatically after you upload photos or videos
(see .github/workflows/thumbnails.yml), so you normally never run it yourself.

- portfolio/<folder>/<photo>.jpg  ->  assets/thumbs/<folder>/<photo>.jpg  (900px wide, for the grid)
- videos/**/<video>.mp4 with no matching .jpg  ->  creates the .jpg thumbnail (needs ffmpeg)
- video thumbnails larger than needed are shrunk in place
"""
import pathlib
import shutil
import subprocess

from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
PHOTO_EXTS = {".jpg", ".jpeg", ".png", ".webp"}
GRID_WIDTH = 900
POSTER_WIDTH = {"reels": 640, "tours": 1280}
changed = 0


def save_resized(src, dst, width, quality=78):
    global changed
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        if im.width > width:
            im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        dst.parent.mkdir(parents=True, exist_ok=True)
        im.save(dst, "JPEG", quality=quality, optimize=True, progressive=True)
    changed += 1


# 1. Grid thumbnails for every portfolio photo
for src in sorted((ROOT / "portfolio").glob("*/*")):
    if src.suffix.lower() not in PHOTO_EXTS:
        continue
    dst = ROOT / "assets" / "thumbs" / src.parent.name / (src.stem + ".jpg")
    if not dst.exists() or dst.stat().st_mtime < src.stat().st_mtime:
        save_resized(src, dst, GRID_WIDTH)

# Remove thumbnails whose photo was deleted
thumb_root = ROOT / "assets" / "thumbs"
if thumb_root.exists():
    for t in thumb_root.glob("*/*.jpg"):
        if not any((ROOT / "portfolio" / t.parent.name / (t.stem + e)).exists() for e in PHOTO_EXTS | {".JPG", ".JPEG", ".PNG"}):
            t.unlink()
            changed += 1

# 2. Video thumbnails: create missing ones, shrink oversized ones
for folder, width in POSTER_WIDTH.items():
    for vid in sorted((ROOT / "videos" / folder).glob("*.mp4")):
        poster = vid.with_suffix(".jpg")
        if not poster.exists() and shutil.which("ffmpeg"):
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", "3", "-i", str(vid),
                            "-frames:v", "1", "-q:v", "2", str(poster)], check=False)
            changed += 1
        if poster.exists():
            with Image.open(poster) as im:
                too_big = im.width > width
            if too_big:
                save_resized(poster, poster, width, quality=80)

print(f"thumbnails updated: {changed}")
