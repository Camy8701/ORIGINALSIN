from pathlib import Path
import re

from PIL import Image, ImageDraw, ImageFont


ROOT = Path("/Users/kyss/ORIGINALSIN")
LOGO_SRC = "static/lynck-studio-logo.png"
LOGO_PATH = ROOT / LOGO_SRC
FONT_PATH = Path("/System/Library/Fonts/Supplemental/Bodoni 72.ttc")

HEADER_COMPONENT_RE = re.compile(
    r"const p=\{.*?\};function e\(l,t\)\{.*?\}const i=\{render:e\};export\{i as O\};",
    re.S,
)
FOOTER_COMPONENT_RE = re.compile(
    r"const q=\{.*?\};function z\(f,e\)\{.*?\}const T=\{render:z\},",
    re.S,
)
HEADER_LOGO_RE = re.compile(
    r'<svg xmlns="http://www\.w3\.org/2000/svg" fill="none" viewbox="0 0 258 81" class="logo" data-v-de3bea18>.*?</svg>',
    re.S,
)
FOOTER_LOGO_RE = re.compile(
    r'(<button class="logo-scroll-top"[^>]*>)<svg.*?</svg>(</button>)',
    re.S,
)


def tracked_width(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, tracking: int) -> int:
    width = 0
    for char in text:
        left, _, right, _ = draw.textbbox((0, 0), char, font=font)
        width += right - left + tracking
    return width - tracking


def draw_tracked(
    draw: ImageDraw.ImageDraw,
    canvas_width: int,
    text: str,
    font: ImageFont.FreeTypeFont,
    y: int,
    tracking: int,
) -> None:
    width = tracked_width(draw, text, font, tracking)
    cursor = (canvas_width - width) / 2
    for char in text:
        draw.text((cursor, y), char, font=font, fill=(17, 17, 17, 255))
        left, _, right, _ = draw.textbbox((cursor, y), char, font=font)
        cursor += (right - left) + tracking


def generate_logo() -> None:
    LOGO_PATH.parent.mkdir(parents=True, exist_ok=True)
    width, height = 1400, 620
    image = Image.new("RGBA", (width, height), (255, 255, 255, 0))
    draw = ImageDraw.Draw(image)
    top_font = ImageFont.truetype(str(FONT_PATH), 250)
    bottom_font = ImageFont.truetype(str(FONT_PATH), 170)

    draw_tracked(draw, width, "LYNCK", top_font, 10, -8)
    draw_tracked(draw, width, "STUDIO", bottom_font, 250, -2)
    image.save(LOGO_PATH)


def rewrite_header_component() -> None:
    path = ROOT / "_nuxt/EEUyll1y.js"
    text = path.read_text(encoding="utf-8")
    replacement = (
        'const p={src:"static/lynck-studio-logo.png",alt:"Lynck Studio"};'
        'function e(l,t){return a(),o("img",p)}'
        "const i={render:e};export{i as O};"
    )
    updated = HEADER_COMPONENT_RE.sub(replacement, text, count=1)
    if updated != text:
        path.write_text(updated, encoding="utf-8")


def rewrite_footer_component() -> None:
    path = ROOT / "_nuxt/CGt6lxgT.js"
    text = path.read_text(encoding="utf-8")
    replacement = (
        'const q={src:"static/lynck-studio-logo.png",alt:"Lynck Studio",style:{width:"10.8rem",height:"auto"}};'
        'function z(f,e){return a(),u("img",q)}'
        "const T={render:z},"
    )
    updated = FOOTER_COMPONENT_RE.sub(replacement, text, count=1)
    if updated != text:
        path.write_text(updated, encoding="utf-8")


def rewrite_html_pages() -> None:
    header_img = f'<img src="{LOGO_SRC}" alt="Lynck Studio" class="logo" data-v-de3bea18>'
    footer_img = f'<img src="{LOGO_SRC}" alt="Lynck Studio" style="width:10.8rem;height:auto">'
    for path in ROOT.rglob("*.html"):
        text = path.read_text(encoding="utf-8")
        updated = HEADER_LOGO_RE.sub(header_img, text)
        updated = FOOTER_LOGO_RE.sub(rf"\1{footer_img}\2", updated)
        updated = updated.replace("Chapter 1: Original Sin", "Lynck Studio")
        updated = updated.replace("Original Sin", "Lynck Studio")
        if updated != text:
            path.write_text(updated, encoding="utf-8")


def rewrite_bundle_brand_strings() -> None:
    replacements = {
        ROOT / "_nuxt/Dcu2akvg.js": {
            'title:"Original Sin - Lookbook"': 'title:"Lynck Studio - Lookbook"',
        },
        ROOT / "_nuxt/B08hbhNn.js": {
            'title:"Original Sin - All products"': 'title:"Lynck Studio - All products"',
        },
        ROOT / "_nuxt/CCXT-GXq.js": {
            '??"Original Sin"': '??"Lynck Studio"',
        },
    }
    for path, mapping in replacements.items():
        text = path.read_text(encoding="utf-8")
        updated = text
        for source, target in mapping.items():
            updated = updated.replace(source, target)
        if updated != text:
            path.write_text(updated, encoding="utf-8")


def main() -> None:
    generate_logo()
    rewrite_header_component()
    rewrite_footer_component()
    rewrite_html_pages()
    rewrite_bundle_brand_strings()


if __name__ == "__main__":
    main()
