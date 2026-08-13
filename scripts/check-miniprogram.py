#!/usr/bin/env python3
"""Validate 亲情公寓 mini-program project files."""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MP = os.path.join(ROOT, "miniprogram")
errors = []

def need(path):
    full = os.path.join(ROOT, path) if not path.startswith("/") else path
    if not os.path.exists(full):
        errors.append("missing " + path)

need("index.html")
need("preview/index.html")
need("preview/js/app.js")
need("preview/js/data.js")
need("preview/js/store.js")
need("preview/css/app.css")
need("miniprogram/app.js")
need("miniprogram/app.json")
need("miniprogram/app.wxss")
need("miniprogram/project.config.json")

app = json.load(open(os.path.join(MP, "app.json"), encoding="utf-8"))
pages = app["pages"]
for page in pages:
    for ext in (".js", ".json", ".wxml", ".wxss"):
        need(os.path.join("miniprogram", page + ext))

for name in ("home", "health", "family", "service", "mine"):
    need(f"miniprogram/images/tab/{name}.png")
    need(f"miniprogram/images/tab/{name}-active.png")

for rel in ("miniprogram/app.json", "miniprogram/project.config.json", "miniprogram/sitemap.json"):
    json.load(open(os.path.join(ROOT, rel), encoding="utf-8"))

preview = open(os.path.join(ROOT, "preview/js/data.js"), encoding="utf-8").read()
seed = open(os.path.join(MP, "utils/data.js"), encoding="utf-8").read()
for token in ("QQ-8821", "张桂兰", "李婷", "亲情公寓"):
    if token not in preview or token not in seed:
        errors.append("seed missing " + token)

if errors:
    print("FAIL")
    for e in errors:
        print(" -", e)
    sys.exit(1)
print("OK", len(pages), "pages")
