#!/usr/bin/env python3
"""Sanity checks for the 亲情公寓 mini-program project."""
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path("/workspace")
errors = []


def ok(msg):
    print("OK  ", msg)


def fail(msg):
    errors.append(msg)
    print("FAIL", msg)


def check_json(path):
    try:
        json.loads(path.read_text(encoding="utf-8"))
        ok(f"json {path.relative_to(ROOT)}")
    except Exception as exc:
        fail(f"json {path}: {exc}")


def check_js_syntax(path):
    result = subprocess.run(
        ["node", "--check", str(path)],
        capture_output=True,
        text=True,
    )
    if result.returncode == 0:
        ok(f"syntax {path.relative_to(ROOT)}")
    else:
        fail(f"syntax {path}: {result.stderr.strip()}")


def main():
    required = [
        "index.html",
        "assets/css/app.css",
        "assets/js/data.js",
    "assets/js/roles.js",
    "assets/js/store.js",
    "assets/js/cms-store.js",
    "assets/js/app.js",
    "join/steward.html",
    "join/provider.html",
    "join/partner.html",
    "join/publisher.html",
    "cms/index.html",
        "miniprogram/app.js",
        "miniprogram/app.json",
        "miniprogram/app.wxss",
        "miniprogram/project.config.json",
    ]
    for rel in required:
        path = ROOT / rel
        if path.exists() and path.stat().st_size > 0:
            ok(f"exists {rel}")
        else:
            fail(f"missing {rel}")

    covers = [
        "cover-a1.jpg",
        "cover-b2.jpg",
        "cover-c1.jpg",
        "cover-d3.jpg",
        "cover-e2.jpg",
        "cover-f1.jpg",
        "cover-u1.jpg",
        "cover-u2.jpg",
        "hero.jpg",
    ]
    for name in covers:
        for folder in (ROOT / "assets/images", ROOT / "miniprogram/images/covers"):
            if (folder / name).exists():
                ok(f"image {folder.name}/{name}")
            else:
                fail(f"missing image {folder}/{name}")

    for name in ("banner-steward.jpg", "banner-provider.jpg", "banner-partner.jpg", "banner-publisher.jpg"):
        for folder in (ROOT / "assets/images", ROOT / "miniprogram/images/banners"):
            if (folder / name).exists():
                ok(f"image {folder.name}/{name}")
            else:
                fail(f"missing image {folder}/{name}")

    for kind in ("home", "listings", "publish", "profile"):
        for suffix in ("", "-active"):
            p = ROOT / "miniprogram/images/tab" / f"{kind}{suffix}.png"
            if p.exists():
                ok(f"tab {p.name}")
            else:
                fail(f"missing tab {p}")

    app_json = json.loads((ROOT / "miniprogram/app.json").read_text(encoding="utf-8"))
    for page in app_json["pages"]:
        base = ROOT / "miniprogram" / page
        for ext in (".js", ".json", ".wxml", ".wxss"):
            if (pathlib.Path(str(base) + ext)).exists():
                ok(f"page {page}{ext}")
            else:
                fail(f"missing page {page}{ext}")

    for path in ROOT.rglob("*.json"):
        if ".git" in path.parts:
            continue
        check_json(path)

    for path in [
        ROOT / "assets/js/data.js",
        ROOT / "assets/js/roles.js",
        ROOT / "assets/js/store.js",
        ROOT / "assets/js/cms-store.js",
        ROOT / "assets/js/app.js",
        ROOT / "miniprogram/app.js",
        ROOT / "miniprogram/utils/store.js",
        ROOT / "miniprogram/utils/cms.js",
        ROOT / "miniprogram/data/listings.js",
        ROOT / "miniprogram/data/roles.js",
        ROOT / "miniprogram/pages/index/index.js",
        ROOT / "miniprogram/pages/apply/apply.js",
        ROOT / "miniprogram/pages/applications/applications.js",
        ROOT / "join/js/form.js",
        ROOT / "cms/js/cms.js",
    ]:
        check_js_syntax(path)

    html = (ROOT / "index.html").read_text(encoding="utf-8")
    for needle in ("房源", "意向", "发布", "assets/js/app.js"):
        if needle in html or needle in (ROOT / "assets/js/app.js").read_text(encoding="utf-8"):
            ok(f"copy contains {needle}")
        else:
            fail(f"missing copy {needle}")

    phone_re = re.compile(r"^1[3-9]\d{9}$")
    if phone_re.match("13800138000") and not phone_re.match("12345"):
        ok("phone regex")
    else:
        fail("phone regex")

    js = (ROOT / "assets/js/app.js").read_text(encoding="utf-8")
    for route in ("/listings", "/interest", "/publish", "/profile", "/listing", "/applications"):
        if route in js:
            ok(f"route {route}")
        else:
            fail(f"missing route {route}")

    index_wxml = (ROOT / "miniprogram/pages/index/index.wxml").read_text(encoding="utf-8")
    if "<swiper" in index_wxml and "openRole" in index_wxml:
        ok("miniprogram role carousel")
    else:
        fail("missing miniprogram role carousel")

    roles_js = (ROOT / "assets/js/roles.js").read_text(encoding="utf-8")
    for role in ("steward", "provider", "partner", "publisher"):
        if f'id: "{role}"' in roles_js:
            ok(f"role {role}")
        else:
            fail(f"missing role {role}")
        page = ROOT / "join" / f"{role}.html"
        if page.exists() and f'data-role="{role}"' in page.read_text(encoding="utf-8"):
            ok(f"join page {role}")
        else:
            fail(f"join page {role}")

    cms_html = (ROOT / "cms/index.html").read_text(encoding="utf-8")
    if "入驻申请" in cms_html and "cms.js" in cms_html:
        ok("cms collection page")
    else:
        fail("cms collection page")

    if "role_applications" in roles_js or "collection: \"role_applications\"" in roles_js:
        ok("cms collection name")
    else:
        fail("cms collection name")

    if errors:
        print(f"\n{len(errors)} failure(s)")
        sys.exit(1)
    print("\nall checks passed")


if __name__ == "__main__":
    main()
