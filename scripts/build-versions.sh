#!/usr/bin/env bash
# Builds every saved version (git tags v1, v2, …) plus the working copy into versions/,
# with a page to flip between them. Serve it with `npm run versions:serve` (port 4180).
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
out="$root/versions"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

rm -rf "$out"
mkdir -p "$out"

build() { # <name> <source dir>
  (cd "$2" && npx vite build --base="/$1/" --outDir "$out/$1" --emptyOutDir --logLevel error)
  echo "built $1"
}

entries=()
for tag in $(git -C "$root" tag --list 'v*' --sort=version:refname); do
  src="$work/$tag"
  mkdir -p "$src"
  git -C "$root" archive "$tag" | tar -x -C "$src"
  ln -s "$root/node_modules" "$src/node_modules"
  # Image paths written straight into components skip Vite's base rewrite.
  for file in $(grep -rlE "[\"' ]/img/" "$src/src" || true); do
    sed -i '' -E "s#([\"' ])/img/#\\1/$tag/img/#g" "$file"
  done
  build "$tag" "$src"
  note="$(git -C "$root" log -1 --format=%s "$tag" | sed -E 's/^v[0-9]+: *//; s/"/\\"/g')"
  entries+=("{\"id\":\"$tag\",\"note\":\"$note\"}")
done

build now "$root"
entries+=('{"id":"now","note":"what you see in the dev server, not saved yet"}')

(IFS=,; echo "[${entries[*]}]") > "$out/versions.json"
cp "$root/scripts/versions-index.html" "$out/index.html"
echo "done: $out"
