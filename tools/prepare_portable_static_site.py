from pathlib import Path
import re


ROOT = Path("/Users/kyss/ORIGINALSIN")

BASE_SCRIPT = (
    '<script>(function(){var p=window.location.pathname.split("/").filter(Boolean);'
    'var roots={home:1,white:1,"coming-soon":1,lookbook:1,product:1,products:1,'
    '"privacy-policy":1,"shipping-and-returns":1,"terms-of-service":1,checkout:1};'
    'var b=p.length&&!roots[p[0]]?"/"+p[0]+"/":"/";'
    'window.__ORIGINALSIN_BASE__=b;document.write(\'<base href="\'+b+\'">\');})();</script>'
)

RUNTIME_SHIM = '<script src="__local/runtime-shim.js"></script>'
RUNTIME_SHIM_ABSOLUTE = '<script src="/__local/runtime-shim.js"></script>'
SHOPIFY_STUB = '<script src="__local/shopify-stub.js"></script>'
SHOPIFY_STUB_ABSOLUTE = '<script src="/__local/shopify-stub.js"></script>'


def patch_html(text: str) -> str:
    if "window.__ORIGINALSIN_BASE__" not in text:
        text = re.sub(r"<head>", "<head>" + BASE_SCRIPT, text, count=1)

    if RUNTIME_SHIM not in text and RUNTIME_SHIM_ABSOLUTE not in text:
        text = text.replace(SHOPIFY_STUB_ABSOLUTE, RUNTIME_SHIM + SHOPIFY_STUB_ABSOLUTE)
        text = text.replace(SHOPIFY_STUB, RUNTIME_SHIM + SHOPIFY_STUB)

    text = text.replace('href="/"', 'href="./"')
    text = text.replace("href='/'", "href='./'")

    text = re.sub(r'\bhref="/', 'href="', text)
    text = re.sub(r"\bhref='/", "href='", text)
    text = re.sub(r'\bsrc="/', 'src="', text)
    text = re.sub(r"\bsrc='/", "src='", text)
    text = text.replace('url("/', 'url("')
    text = text.replace("url('/", "url('")

    text = text.replace('baseURL:"/"', 'baseURL:window.__ORIGINALSIN_BASE__||"/"')
    text = text.replace(
        'buildAssetsDir:"/_nuxt/"',
        'buildAssetsDir:(window.__ORIGINALSIN_BASE__||"/")+"_nuxt/"',
    )
    return text


def main() -> None:
    for path in sorted(ROOT.rglob("*.html")):
        original = path.read_text(encoding="utf-8")
        updated = patch_html(original)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
