#!/usr/bin/env bash
# Oversætter Next.js-udgaven (src/) til Base44's TanStack Start-skabelon (base44-app/src/).
# Kør fra repoets rod: bash base44-app/scripts/port.sh
set -euo pipefail
ROOT=$(pwd); STAGE=/tmp/kp-port; rm -rf "$STAGE"; mkdir -p "$STAGE"
cp -r src "$STAGE/src"; cd "$STAGE"
rm -rf src/app/api src/app/robots.ts src/app/sitemap.ts
sed -i 's#from "next/link"#from "@/lib/next/link"#; s#from "next/navigation"#from "@/lib/next/navigation"#; s#from "next/script"#from "@/lib/next/script"#' $(grep -rl 'from "next/' src)
grep -rl "process.env.NEXT_PUBLIC_" src | xargs sed -i 's/process\.env\.NEXT_PUBLIC_/import.meta.env.VITE_/g'
sed -i 's/export default async function/export default function/; s/(await params)/params/g; s/= await params;/= params;/' $(grep -rl "await params" src/app)
sed -i 's/export async function generateMetadata/export function generateMetadata/' $(grep -rl "async function generateMetadata" src)
perl -0pi -e 's/fetch\("\/api\/booking", \{ method: "POST", headers: \{ "Content-Type": "application\/json" \}, body: JSON\.stringify\((.*?)\) \}\)/postBooking($1)/g; s/fetch\("\/api\/newsletter", \{ method: "POST", headers: \{ "Content-Type": "application\/json" \}, body: JSON\.stringify\((.*?)\) \}\)/postNewsletter($1)/g' src/components/rolex/RolexForms.tsx src/components/BookingFlow.tsx src/components/Newsletter.tsx src/components/ContactForm.tsx
perl -0pi -e 's/fetch\(`\/api\/rolex-price\?rmc=\$\{encodeURIComponent\(rmc\)\}`\)\n\s*\.then\(\(r\) => \(r\.ok \? r\.json\(\) : null\)\)/fetchRolexPrice(rmc)/' src/components/rolex/client.tsx
for f in src/components/rolex/RolexForms.tsx src/components/BookingFlow.tsx src/components/Newsletter.tsx src/components/ContactForm.tsx; do perl -0pi -e 's/^("use client";\n)/$1\nimport { postBooking, postNewsletter } from "\@\/lib\/forms-client";\n/' $f; done
perl -0pi -e 's/^("use client";\n)/$1\nimport { fetchRolexPrice } from "\@\/lib\/forms-client";\n/' src/components/rolex/client.tsx
if grep -rn "/api/booking\|/api/newsletter\|fetch(\`/api" src --include=*.tsx | grep -v "^\s*\*"; then echo "API-kald blev ikke erstattet" >&2; exit 1; fi
cat > tsconfig.json <<'J'
{ "compilerOptions": { "target": "ESNext", "module": "ESNext", "moduleResolution": "Bundler", "jsx": "preserve", "outDir": "out", "rootDir": "src", "isolatedModules": true, "skipLibCheck": true, "noCheck": true, "types": [] }, "include": ["src/**/*.ts", "src/**/*.tsx"] }
J
"$ROOT/node_modules/.bin/tsc" -p tsconfig.json
cd "$ROOT"
node base44-app/scripts/assemble.mjs "$STAGE" base44-app
rm -f base44-app/src/views/layout.jsx
cp -r base44-app/overlay/src/. base44-app/src/
# Fjern Next-specifikke eslint-kommentarer uden at fjerne koden på samme linje
grep -rl "@next/next/no-img-element" base44-app/src | xargs -r perl -0pi -e 's{\{/\*\s*eslint-disable-next-line \@next/next/no-img-element\s*\*/\}\n?}{}g; s{/\*\s*eslint-disable-next-line \@next/next/no-img-element\s*\*/}{}g; s{^[ \t]*// eslint-disable-next-line \@next/next/no-img-element[ \t]*\n}{}mg'
if grep -rn "@next/next" base44-app/src; then echo "Next-kommentarer tilbage" >&2; exit 1; fi
grep -rl "catch { }" base44-app/src | xargs -r sed -i 's/catch { }/catch { \/* ignoreres *\/ }/g'
echo "Færdig: base44-app/src"
