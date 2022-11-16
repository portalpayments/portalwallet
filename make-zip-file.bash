#!/usr/bin/env bash
set -euo pipefail
ZIP_FILE_NAME="portal-alpha.zip"

# Zone.Identifier files can cause errors when unzipping
find . -name '*Zone.Identifier' -exec rm '{}' ';'

# Compile TS to JS
npm run build;

# Now make the zip file
rm -f "${ZIP_FILE_NAME}"; 
cd dist
zip -r "${ZIP_FILE_NAME}" *
mv "${ZIP_FILE_NAME}" ..

echo "🍾🥂 Completed successfully. Open ${ZIP_FILE_NAME}"
