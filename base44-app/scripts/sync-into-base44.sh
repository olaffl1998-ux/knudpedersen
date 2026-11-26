#!/usr/bin/env bash
# Køres INDE i Base44-appens sandbox (fra appens rod). Henter base44-app/ fra GitHub og lægger den ind
# uden at røre Base44-skabelonens egne filer (src/components/ui, auth, lib/AuthContext osv.).
# Filer fra sidste synk står i .kp-manifest og fjernes først, så omdøbte sider ikke bliver liggende.
set -euo pipefail
BRANCH=${1:-claude/project-thread-afn35l}
rm -rf /tmp/kp && git clone -q --depth 1 -b "$BRANCH" https://github.com/olaffl1998-ux/knudpedersen /tmp/kp
if [ -f .kp-manifest ]; then while read -r f; do [ -n "$f" ] && rm -f "$f"; done < .kp-manifest; fi
(cd /tmp/kp/base44-app && find src public -type f) > .kp-manifest
cp -r /tmp/kp/base44-app/src/. src/
mkdir -p public && cp -r /tmp/kp/base44-app/public/. public/
[ -d public/billeder ] || cp -r /tmp/kp/public/billeder public/
echo "Synkroniseret $(wc -l < .kp-manifest) filer fra $BRANCH"
