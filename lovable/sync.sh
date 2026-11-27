#!/usr/bin/env bash
# Lægger hjemmesiden (den porterede TanStack-udgave i base44-app/) ind i Lovable-projektets repo.
# Kør fra knudpedersen-repoets rod: bash lovable/sync.sh /sti/til/knud-pedersen-aarhus
# Lovables egne filer (src/components/ui, src/lib/utils.ts, server.ts, router.tsx osv.) røres ikke.
# Filer fra sidste synk står i .kp-manifest og fjernes først, så omdøbte sider ikke bliver liggende.
set -euo pipefail
DEST=${1:?Angiv stien til Lovable-repoet}
ROOT=$(pwd)
STAGE=$(mktemp -d)
cp -r base44-app/src "$STAGE/src"
cp -r lovable/overlay/src/. "$STAGE/src/"
mkdir -p "$STAGE/public"
cp -r public/. "$STAGE/public/"
cp -r base44-app/public/. "$STAGE/public/"
cd "$DEST"
if [ -f .kp-manifest ]; then while read -r f; do [ -n "$f" ] && [ -f "$f" ] && rm -f "$f"; done < .kp-manifest; fi
rm -f src/routes/index.tsx
(cd "$STAGE" && find src public -type f | sort) > .kp-manifest
cp -r "$STAGE/src/." src/
cp -r "$STAGE/public/." public/
echo "Synkroniseret $(wc -l < .kp-manifest) filer til $DEST"
