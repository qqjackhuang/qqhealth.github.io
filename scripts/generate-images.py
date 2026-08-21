#!/usr/bin/env python3
"""Generate tab-bar icons and stylized listing cover images."""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path("/workspace")
H5_IMG = ROOT / "assets" / "images"
MP_TAB = ROOT / "miniprogram" / "images" / "tab"
MP_COVER = ROOT / "miniprogram" / "images" / "covers"

for p in (H5_IMG, MP_TAB, MP_COVER):
    p.mkdir(parents=True, exist_ok=True)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def fill_gradient(im, top, bottom, horizontal=False):
    w, h = im.size
    px = im.load()
    for y in range(h):
        for x in range(w):
            t = x / (w - 1) if horizontal else y / (h - 1)
            px[x, y] = lerp(top, bottom, t)


def draw_icon(path, kind, color, size=81):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    s = size
    m = int(s * 0.18)
    stroke = max(3, s // 16)

    if kind == "home":
        roof = [(s // 2, m), (s - m, s * 0.48), (m, s * 0.48)]
        d.polygon(roof, fill=color)
        d.rectangle([m + 6, s * 0.46, s - m - 6, s - m], outline=color, width=stroke)
        d.rectangle([s * 0.42, s * 0.62, s * 0.58, s - m], fill=color)
    elif kind == "listings":
        gap = 8
        box = (s - 2 * m - gap) // 2
        coords = [
            (m, m),
            (m + box + gap, m),
            (m, m + box + gap),
            (m + box + gap, m + box + gap),
        ]
        for x, y in coords:
            d.rounded_rectangle([x, y, x + box, y + box], radius=6, outline=color, width=stroke)
        d.rectangle([coords[0][0] + 6, coords[0][1] + 6, coords[0][0] + box - 6, coords[0][1] + 14], fill=color)
    elif kind == "publish":
        cx = cy = s // 2
        r = s // 2 - m
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=stroke)
        d.rectangle([cx - 2, cy - r + 14, cx + 2, cy + r - 14], fill=color)
        d.rectangle([cx - r + 14, cy - 2, cx + r - 14, cy + 2], fill=color)
    elif kind == "profile":
        d.ellipse([s * 0.32, m + 2, s * 0.68, s * 0.48], outline=color, width=stroke)
        d.arc([m + 4, s * 0.42, s - m - 4, s + 20], 200, 340, fill=color, width=stroke)

    im.save(path)


def rounded_rect(draw, box, radius, fill):
    draw.rounded_rectangle(box, radius=radius, fill=fill)


def draw_tree(d, x, y, r, foliage, trunk):
    d.rectangle([x - 3, y, x + 3, y + r + 8], fill=trunk)
    d.ellipse([x - r, y - r, x + r, y + r * 0.4], fill=foliage)


def draw_windows(d, x, y, w, h, cols, rows, lit, dark, sill):
    pad_x, pad_y = 10, 12
    ww = (w - pad_x * (cols + 1)) // cols
    hh = (h - pad_y * (rows + 1)) // rows
    i = 0
    for r in range(rows):
        for c in range(cols):
            wx = x + pad_x + c * (ww + pad_x)
            wy = y + pad_y + r * (hh + pad_y)
            color = lit if (i * 7 + r * 3) % 5 != 0 else dark
            d.rectangle([wx, wy, wx + ww, wy + hh], fill=color)
            d.rectangle([wx, wy + hh - 2, wx + ww, wy + hh], fill=sill)
            i += 1


COVERS = [
    {
        "name": "cover-a1.jpg",
        "sky": ((255, 214, 176), (247, 232, 214)),
        "body": (196, 92, 38),
        "body2": (168, 74, 32),
        "accent": (232, 196, 140),
        "floors": 6,
        "cols": 4,
    },
    {
        "name": "cover-b2.jpg",
        "sky": ((186, 216, 204), (236, 244, 238)),
        "body": (44, 95, 79),
        "body2": (32, 74, 62),
        "accent": (212, 180, 120),
        "floors": 8,
        "cols": 5,
    },
    {
        "name": "cover-c1.jpg",
        "sky": ((255, 228, 196), (255, 244, 230)),
        "body": (140, 78, 62),
        "body2": (112, 60, 48),
        "accent": (236, 210, 168),
        "floors": 5,
        "cols": 6,
    },
    {
        "name": "cover-d3.jpg",
        "sky": ((210, 226, 232), (244, 248, 250)),
        "body": (74, 98, 120),
        "body2": (56, 78, 98),
        "accent": (196, 154, 92),
        "floors": 7,
        "cols": 4,
    },
    {
        "name": "cover-e2.jpg",
        "sky": ((255, 220, 200), (255, 240, 228)),
        "body": (176, 92, 70),
        "body2": (148, 72, 54),
        "accent": (240, 214, 170),
        "floors": 6,
        "cols": 3,
    },
    {
        "name": "cover-f1.jpg",
        "sky": ((220, 208, 232), (244, 238, 248)),
        "body": (92, 70, 110),
        "body2": (72, 54, 90),
        "accent": (212, 168, 96),
        "floors": 9,
        "cols": 5,
    },
    {
        "name": "cover-u1.jpg",
        "sky": ((255, 232, 186), (255, 246, 220)),
        "body": (180, 124, 52),
        "body2": (150, 100, 40),
        "accent": (92, 122, 88),
        "floors": 5,
        "cols": 4,
    },
    {
        "name": "cover-u2.jpg",
        "sky": ((200, 224, 214), (232, 242, 236)),
        "body": (58, 108, 92),
        "body2": (42, 86, 72),
        "accent": (220, 170, 110),
        "floors": 4,
        "cols": 5,
    },
]


def draw_cover(cfg, path):
    w, h = 750, 500
    im = Image.new("RGB", (w, h))
    fill_gradient(im, cfg["sky"][0], cfg["sky"][1])
    d = ImageDraw.Draw(im)

    # sun / moon disc
    d.ellipse([560, 36, 640, 116], fill=(255, 244, 214))

    # distant hills
    d.polygon([(0, 340), (180, 260), (340, 320), (520, 240), (750, 310), (750, 500), (0, 500)], fill=(lerp(cfg["body"], (180, 170, 150), 0.7)))

    # ground
    d.rectangle([0, 390, w, h], fill=(92, 78, 64))
    d.rectangle([0, 390, w, 398], fill=(120, 100, 80))

    # building
    bw, bh = 420, 280 + cfg["floors"] * 2
    bx = (w - bw) // 2 - 20
    by = 390 - bh
    rounded_rect(d, [bx + 18, by + 16, bx + bw + 18, by + bh + 16], 8, (30, 24, 20))
    rounded_rect(d, [bx, by, bx + bw, by + bh], 10, cfg["body"])
    # side shade
    d.rectangle([bx + bw - 48, by, bx + bw, by + bh], fill=cfg["body2"])
    # roof slab
    d.rectangle([bx - 12, by - 18, bx + bw + 8, by + 10], fill=cfg["accent"])
    d.rectangle([bx + 40, by - 36, bx + 120, by - 10], fill=cfg["body2"])  # penthouse

    draw_windows(
        d,
        bx + 12,
        by + 24,
        bw - 70,
        bh - 50,
        cfg["cols"],
        max(4, cfg["floors"] - 1),
        (255, 236, 200),
        (70, 52, 42),
        (210, 170, 120),
    )

    # entrance
    ex = bx + bw // 2 - 36
    d.rectangle([ex, 390 - 54, ex + 72, 390], fill=(42, 34, 28))
    d.polygon([(ex - 16, 390 - 54), (ex + 36, 390 - 78), (ex + 88, 390 - 54)], fill=cfg["accent"])

    draw_tree(d, 90, 340, 38, (62, 110, 78), (90, 64, 46))
    draw_tree(d, 150, 355, 28, (86, 132, 88), (90, 64, 46))
    draw_tree(d, 680, 348, 34, (54, 102, 74), (90, 64, 46))

    im.save(path, "JPEG", quality=86, optimize=True)


def draw_hero(path):
    w, h = 900, 560
    im = Image.new("RGB", (w, h))
    fill_gradient(im, (255, 214, 176), (247, 232, 214))
    d = ImageDraw.Draw(im)
    d.ellipse([620, 40, 720, 140], fill=(255, 244, 214))
    d.polygon([(0, 360), (220, 250), (420, 330), (640, 220), (900, 320), (900, 560), (0, 560)], fill=(168, 140, 110))
    d.rectangle([0, 430, w, h], fill=(92, 78, 64))

    buildings = [
        (80, 210, 160, 220, (196, 92, 38)),
        (220, 160, 200, 270, (44, 95, 79)),
        (400, 190, 170, 240, (140, 78, 62)),
        (560, 140, 190, 290, (74, 98, 120)),
        (730, 200, 130, 230, (176, 92, 70)),
    ]
    for x, y, bw, bh, color in buildings:
        d.rectangle([x + 10, y + 10, x + bw + 10, y + bh + 10], fill=(40, 32, 26))
        d.rectangle([x, y, x + bw, y + bh], fill=color)
        d.rectangle([x - 6, y - 12, x + bw + 4, y + 8], fill=(212, 168, 96))
        draw_windows(d, x + 8, y + 16, bw - 16, bh - 40, 3, 5, (255, 236, 200), (60, 44, 36), (210, 170, 120))

    draw_tree(d, 50, 390, 40, (62, 110, 78), (90, 64, 46))
    draw_tree(d, 860, 400, 36, (54, 102, 74), (90, 64, 46))
    im.save(path, "JPEG", quality=86, optimize=True)


def main():
    gray = (138, 126, 114, 255)
    active = (196, 92, 38, 255)
    for kind in ("home", "listings", "publish", "profile"):
        draw_icon(H5_IMG / f"tab-{kind}.png", kind, gray)
        draw_icon(H5_IMG / f"tab-{kind}-active.png", kind, active)
        draw_icon(MP_TAB / f"{kind}.png", kind, gray)
        draw_icon(MP_TAB / f"{kind}-active.png", kind, active)

    draw_hero(H5_IMG / "hero.jpg")
    draw_hero(MP_COVER / "hero.jpg")

    for cfg in COVERS:
        draw_cover(cfg, H5_IMG / cfg["name"])
        draw_cover(cfg, MP_COVER / cfg["name"])

    print("images generated")


if __name__ == "__main__":
    main()
