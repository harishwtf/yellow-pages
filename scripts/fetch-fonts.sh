#!/usr/bin/env bash
# Re-downloads the latin woff2 files from Google Fonts into public/fonts and rewrites src/fonts.css.
# Archivo comes down as one variable file covering its width (62–125%) and weight axes; Caveat is the handwriting.
set -euo pipefail
cd "$(dirname "$0")/.."
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
URL="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Caveat:wght@600&family=Fraunces:opsz,wght@9..144,400..600&display=swap"
mkdir -p public/fonts
curl -sA "$UA" "$URL" | node scripts/fonts-from-css.mjs
