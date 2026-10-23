"""Render decks with LibreOffice and make contact sheets for visual QA.

    python render_check.py DECK.pptx [DECK2.pptx ...] --out render/ [--per-sheet 4] [--dpi 72]

Writes render/<name>.pdf, one PNG per slide and <name>-sheetN.png contact sheets (labelled "Slide N"),
then prints the sheet paths: open each with your image viewer / Read tool and look for overflow, overlaps,
titles wrapping into content, and text colliding with footers. Needs LibreOffice, pymupdf and Pillow.

Part of the investor-pitch-deck skill, created by Mohit Garg.
"""
import argparse
import glob
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pymupdf
from PIL import Image, ImageDraw


def find_soffice():
    for c in [shutil.which("soffice"), shutil.which("libreoffice"),
              r"C:\Program Files\LibreOffice\program\soffice.exe", r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
              "/Applications/LibreOffice.app/Contents/MacOS/soffice", "/usr/bin/soffice", "/usr/lib/libreoffice/program/soffice"]:
        if c and os.path.exists(c):
            return c
    sys.exit("LibreOffice not found. Install it (e.g. `choco install libreoffice-fresh`, `brew install --cask libreoffice`, `apt install libreoffice`).")


ap = argparse.ArgumentParser()
ap.add_argument("decks", nargs="+")
ap.add_argument("--out", default="render")
ap.add_argument("--per-sheet", type=int, default=4)
ap.add_argument("--dpi", type=int, default=72)
a = ap.parse_args()

out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
subprocess.run([find_soffice(), "--headless", "--convert-to", "pdf", "--outdir", str(out), *a.decks], check=True,
               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
for deck in a.decks:
    name = Path(deck).stem
    pdf = out / f"{name}.pdf"
    for old in glob.glob(str(out / f"{name}-*.png")):
        os.remove(old)
    doc = pymupdf.open(pdf)
    pages = []
    for i, page in enumerate(doc, 1):
        f = out / f"{name}-s{i:02d}.png"
        page.get_pixmap(dpi=a.dpi).save(str(f))
        pages.append(f)
    cols = 2
    for k in range(0, len(pages), a.per_sheet):
        grp = pages[k:k + a.per_sheet]
        ims = [Image.open(p) for p in grp]
        w, h = ims[0].size
        rows = (len(ims) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * w + 10, rows * (h + 22)), "white")
        d = ImageDraw.Draw(sheet)
        for j, (p, im) in enumerate(zip(grp, ims)):
            x, y = (j % cols) * (w + 10), (j // cols) * (h + 22)
            sheet.paste(im, (x, y + 18))
            d.text((x + 4, y + 3), f"Slide {k + j + 1}", fill="black")
        sp = out / f"{name}-sheet{k // a.per_sheet + 1}.png"
        sheet.save(sp)
        print(sp)
    print(f"{pdf}: {len(pages)} pages")
