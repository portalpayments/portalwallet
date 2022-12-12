while inotifywait -e modify public/manifest.json; 
do 
  cp public/manifest.json dist
done
