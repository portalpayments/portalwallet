#!/usr/bin/env bash
echo "⏳ Waiting for changes..."
DIR_TO_WATCH='src/wallet-standard-adapter/'
CHANGES_TO_WATCH='attrib,modify,close_write,move,move_self,create,delete,delete_self'
while inotifywait -qqre "$CHANGES_TO_WATCH" "$DIR_TO_WATCH"; do
  echo "🟢 Building..."
  npm run build:content-script
  echo "✅ Done"
done
