"""Turn a .pptx built as a template into a real PowerPoint template (.potx): only the main part's content type differs.

    python to_potx.py Brand_Template.pptx Brand_Template.potx

Part of the investor-pitch-deck skill, created by Mohit Garg.
"""
import sys
import zipfile

PPTX = b"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"
POTX = b"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml"

src, dst = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename == "[Content_Types].xml":
            assert PPTX in data, "presentation content type not found"
            data = data.replace(PPTX, POTX)
        zout.writestr(item, data)
print(dst)
