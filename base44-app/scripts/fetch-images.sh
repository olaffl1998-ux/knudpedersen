#!/usr/bin/env bash
# Køres INDE i Base44-sandboxen fra appens rod. Henter billeder, der mangler i public/, fra den nuværende webshops billedserver.
# Stien /billeder/... svarer til /upload_dir/... på shop16933.sfstatic.io (eller knudpedersen.dk).
set -uo pipefail
LIST=${1:-/tmp/kp/base44-app/scripts/missing-images.txt}
fetch() {
  f="$1"; out="public${f//\/\//\/}"; [ -s "$out" ] && return 0
  src="${f#/billeder}"; src="${src//\/\//\/}"
  mkdir -p "$(dirname "$out")"
  for host in https://shop16933.sfstatic.io/upload_dir https://knudpedersen.dk/upload_dir; do
    if curl -sfL --max-time 60 -o "$out.tmp" "$host$src" && [ -s "$out.tmp" ]; then mv "$out.tmp" "$out"; return 0; fi
  done
  rm -f "$out.tmp"; echo "MANGLER $f" >&2
}
export -f fetch
xargs -P 12 -I{} bash -c 'fetch "$@"' _ {} < "$LIST" 2> /tmp/fetch-missing.log
echo "Hentet. Mangler stadig: $(grep -c MANGLER /tmp/fetch-missing.log)"
