# ORIGINALSIN

Static standalone replica of `originalsin.co`, prepared for deployment from this repository.

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://127.0.0.1:8000/`.

## Notes

- The site is packaged as static files at the repository root.
- `_nuxt/` assets are kept intact for fidelity.
- `.nojekyll` is included so GitHub Pages will serve underscore-prefixed folders.
- Checkout is intentionally not wired to a real backend yet.
