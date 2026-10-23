"""Cut a short pitch deck out of the full deck: keep only the listed slides, in the listed order.

    python make_pitch.py FULL.pptx PITCH.pptx --keep 1,2,3,8,4,11,5,6,16,10,22,24,25,29,32

Slide numbers are 1-based positions in FULL.pptx. Dropped slides are removed from the file (not hidden),
so the pitch deck genuinely contains fewer slides. Needs python-pptx.

Part of the investor-pitch-deck skill, created by Mohit Garg.
"""
import argparse
import uuid

from pptx import Presentation

P14 = "http://schemas.microsoft.com/office/powerpoint/2010/main"
R_ID = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"

ap = argparse.ArgumentParser()
ap.add_argument("full")
ap.add_argument("pitch")
ap.add_argument("--keep", required=True, help="comma-separated 1-based slide numbers, in pitch order")
ap.add_argument("--section", default="Pitch", help="name of the single section in the pitch deck")
a = ap.parse_args()

keep = [int(x) for x in a.keep.split(",")]
prs = Presentation(a.full)
lst = prs.slides._sldIdLst
ids = list(lst)
n = len(ids)
assert all(1 <= k <= n for k in keep) and len(set(keep)) == len(keep), f"--keep must be distinct numbers in 1..{n}"

kept = [ids[k - 1] for k in keep]
for el in ids:
    lst.remove(el)
    if el not in kept:
        prs.part.drop_rel(el.get(R_ID))  # unreachable slide parts are not written on save
for el in kept:
    lst.append(el)

# Rebuild the section list (PowerPoint sections reference slide ids; stale ids break the file).
for sec_lst in prs.part._element.iter(f"{{{P14}}}sectionLst"):
    for child in list(sec_lst):
        sec_lst.remove(child)
    sec = sec_lst.makeelement(f"{{{P14}}}section", {"name": a.section, "id": "{%s}" % str(uuid.uuid4()).upper()})
    sl = sec.makeelement(f"{{{P14}}}sldIdLst", {})
    for el in kept:
        sl.append(sl.makeelement(f"{{{P14}}}sldId", {"id": el.get("id")}))
    sec.append(sl)
    sec_lst.append(sec)

prs.save(a.pitch)
print(f"{a.pitch}: {len(kept)} of {n} slides")
