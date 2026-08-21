#!/usr/bin/env python3
"""Generate four role carousel banners."""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path("/workspace")
H5 = ROOT / "assets" / "images"
MP = ROOT / "miniprogram" / "images" / "banners"
for p in (H5, MP):
    p.mkdir(parents=True, exist_ok=True)

W, H = 900, 480


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient(size, top, bottom):
    im = Image.new("RGB", size)
    px = im.load()
    w, h = size
    for y in range(h):
        t = y / (h - 1)
        color = lerp(top, bottom, t)
        for x in range(w):
            px[x, y] = color
    return im


def save(im, name):
    im = im.convert("RGB")
    for folder in (H5, MP):
        im.save(folder / name, quality=88)


def banner_steward():
    im = gradient((W, H), (46, 92, 78), (18, 42, 36))
    d = ImageDraw.Draw(im)
    d.rectangle([80, 220, 360, 430], fill=(232, 214, 186))
    d.polygon([(60, 220), (220, 120), (380, 220)], fill=(196, 92, 38))
    d.rectangle([140, 300, 210, 430], fill=(90, 58, 40))
    d.rectangle([240, 270, 320, 340], fill=(250, 236, 214))
    d.ellipse([430, 70, 540, 180], fill=(212, 160, 84))
    d.rectangle([500, 300, 820, 430], fill=(36, 70, 60))
    d.ellipse([620, 250, 700, 330], fill=(74, 138, 116))
    save(im, "banner-steward.jpg")


def banner_provider():
    im = gradient((W, H), (196, 92, 38), (92, 40, 22))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([90, 150, 360, 400], radius=28, fill=(255, 247, 236))
    d.ellipse([140, 190, 310, 360], outline=(196, 92, 38), width=14)
    d.rectangle([214, 230, 236, 320], fill=(196, 92, 38))
    d.rectangle([180, 262, 270, 284], fill=(196, 92, 38))
    d.rounded_rectangle([420, 200, 820, 390], radius=24, fill=(42, 36, 32))
    d.rectangle([470, 250, 770, 270], fill=(232, 214, 186))
    d.rectangle([470, 300, 680, 320], fill=(212, 160, 84))
    save(im, "banner-provider.jpg")


def banner_partner():
    im = gradient((W, H), (212, 160, 84), (138, 72, 28))
    d = ImageDraw.Draw(im)
    d.polygon([(140, 300), (280, 160), (420, 300)], fill=(255, 247, 236))
    d.rectangle([180, 300, 380, 420], fill=(247, 241, 232))
    d.polygon([(320, 280), (500, 120), (680, 280)], fill=(44, 95, 79))
    d.rectangle([380, 280, 620, 420], fill=(36, 74, 62))
    d.rectangle([430, 330, 490, 420], fill=(232, 214, 186))
    d.rectangle([530, 310, 590, 370], fill=(250, 236, 214))
    save(im, "banner-partner.jpg")


def banner_publisher():
    im = gradient((W, H), (61, 76, 122), (24, 30, 52))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([120, 90, 780, 410], radius=18, fill=(247, 241, 232))
    d.rectangle([150, 130, 750, 150], fill=(196, 92, 38))
    for i, y in enumerate((190, 250, 310)):
        d.rectangle([170, y, 520 if i < 2 else 430, y + 18], fill=(90, 82, 74) if i == 0 else (196, 184, 168))
    d.ellipse([600, 220, 720, 340], fill=(44, 95, 79))
    save(im, "banner-publisher.jpg")


if __name__ == "__main__":
    banner_steward()
    banner_provider()
    banner_partner()
    banner_publisher()
    print("banners written")
