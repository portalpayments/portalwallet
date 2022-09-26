#!/usr/bin/env bash
set -euo pipefail
ZIP_FILE_NAME="portal-wallet-ycombinator-demo.zip"

# Zone.Identifier files can cause errors when unzipping
find . -name '*Zone.Identifier' -exec rm '{}' ';'

npm run build-vite-only;
rm -f "${ZIP_FILE_NAME}"; 
cd dist
zip -r "${ZIP_FILE_NAME}" *
mv "${ZIP_FILE_NAME}" ..
echo "✅ Completed successfully. Open ${ZIP_FILE_NAME}"
