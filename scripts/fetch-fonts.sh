#!/usr/bin/env bash
# Re-downloads the latin woff2 files from Google Fonts into public/fonts and rewrites src/fonts.css.
# Variable families (Archivo Narrow, Oswald) come down as one file covering the weight range.
set -euo pipefail
cd "$(dirname "$0")/.."
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
URL="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400;0,700;1,400&family=Oswald:wght@500;700&family=Caveat:wght@600&display=swap"
mkdir -p public/fonts
curl -sA "$UA" "$URL" | node scripts/fonts-from-css.mjs
