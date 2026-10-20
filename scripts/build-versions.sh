#!/usr/bin/env bash
# Builds every saved version (git tags v1, v2, …) into versions/, plus any unsaved drafts listed in
# scripts/version-drafts.json, with a page to flip between them. Serve it with `npm run versions:serve`.
# A tag's message is "Name — one line about it"; the viewer shows the name.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
out="$root/versions"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

rm -rf "$out"
mkdir -p "$out"

build() { # <id> <source dir>
  (cd "$2" && npx vite build --base="/$1/" --outDir "$out/$1" --emptyOutDir --logLevel error)
  echo "built $1"
}
json() { node -e 'process.stdout.write(JSON.stringify(process.argv[1]))' "$1"; }

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
  message="$(git -C "$root" tag --list "$tag" --format='%(contents:subject)')"
  name="${message%% — *}"
  note="${message#* — }"
  [ "$note" = "$message" ] && note=""
  entries+=("{\"id\":\"$tag\",\"label\":\"${tag#v}\",\"name\":$(json "$name"),\"note\":$(json "$note"),\"draft\":false}")
done

# Unsaved drafts that live in other folders: [{ "id", "name", "note", "path" }], paths relative to this repo.
drafts="$root/scripts/version-drafts.json"
if [ -f "$drafts" ]; then
  while IFS=$'\t' read -r id name note path; do
    dir="$(cd "$root" && cd "$path" 2>/dev/null && pwd)" || { echo "skipped draft $id: $path not found"; continue; }
    build "$id" "$dir"
    entries+=("{\"id\":\"$id\",\"label\":\"–\",\"name\":$(json "$name"),\"note\":$(json "$note"),\"draft\":true}")
  done < <(node -e 'for (const d of require(process.argv[1])) console.log([d.id, d.name, d.note, d.path].join("\t"))' "$drafts")
fi

# The working copy joins the list only when the site itself has unsaved changes.
if [ -n "$(git -C "$root" status --porcelain -- src index.html public data)" ]; then
  build now "$root"
  entries+=('{"id":"now","label":"–","name":"Working copy","note":"what you see in the dev server, not saved yet","draft":true}')
fi

(IFS=,; echo "[${entries[*]}]") > "$out/versions.json"
mkdir -p "$out/fonts"
cp "$root/public/fonts/"*.woff2 "$out/fonts/" 2>/dev/null || true
cp "$root/scripts/versions-index.html" "$out/index.html"
echo "done: $out"
