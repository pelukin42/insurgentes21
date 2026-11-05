"""Build a single self-contained HTML preview (images/videos inlined, compressed).

Usage: npm run build && python3 scripts/preview.py <out.html> <workdir> [--light]
Requires ImageMagick (convert) and ffmpeg.
"""
import base64, glob, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out, work = sys.argv[1], sys.argv[2]
LIGHT = "--light" in sys.argv  # smaller assets for inline viewers
os.makedirs(work, exist_ok=True)

src = "".join(open(f).read() for f in glob.glob(f"{ROOT}/src/**/*.ts*", recursive=True))
paths = {f"/img/{m}" for m in re.findall(r'\bp\("([^"]+)"\)', src)}
paths |= set(re.findall(r'asset\("(/[^"]+)"\)', src))
for n in re.findall(r'\bv\("([^"]+)"\)', src):
    paths |= {f"/video/{n}.mp4", f"/video/{n}.jpg"}

def shrink(path):
    srcf = f"{ROOT}/public{path}"
    dst = os.path.join(work, path.strip("/").replace("/", "__"))
    if not os.path.exists(dst):
        if path.endswith(".mp4"):
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", srcf, "-vf", "scale=360:-2" if LIGHT else "scale=540:-2", "-c:v", "libx264",
                            "-crf", "34" if LIGHT else "30", "-preset", "slow", "-an", "-movflags", "+faststart", dst], check=True)
        elif path.endswith(".jpg"):
            subprocess.run(["convert", srcf, "-resize", "800x800>" if LIGHT else "1100x1100>", "-quality", "60" if LIGHT else "70", "-strip", dst], check=True)
        else:
            dst = srcf
    return dst

mime = {".jpg": "image/jpeg", ".mp4": "video/mp4", ".svg": "image/svg+xml"}
assets = {}
for pth in sorted(paths):
    f = shrink(pth)
    assets[pth] = f"data:{mime[os.path.splitext(pth)[1]]};base64," + base64.b64encode(open(f, "rb").read()).decode()

html = open(f"{ROOT}/dist/index.html").read()
css = "".join(open(f).read() for f in glob.glob(f"{ROOT}/dist/assets/*.css"))
js = "".join(open(f).read() for f in glob.glob(f"{ROOT}/dist/assets/*.js")).replace("</script", "<\\/script")
html = re.sub(r'<link rel="stylesheet"[^>]*>', "", html)
html = re.sub(r'<script type="module"[^>]*></script>', "", html)
html = re.sub(r'<link rel="(icon|apple-touch-icon)"[^>]*>\n?', "", html)
html = re.sub(r'<meta property="og:image"[^>]*>\n?', "", html)
import json
head = f"<style>{css}</style>\n<link rel=\"icon\" href=\"{assets.get('/logo.svg', '')}\" />"
body = f"<script>window.__ASSETS={json.dumps(assets)};</script>\n<script type=\"module\">{js}</script>"
html = html.replace("</head>", head + "\n</head>").replace("</body>", body + "\n</body>")
open(out, "w").write(html)
print(f"{len(assets)} assets, {os.path.getsize(out)/1e6:.1f} MB -> {out}")
