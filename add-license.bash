#!/usr/bin/env bash

for FILE in $(find src -name '*\.ts'); do
  cat addme.ts | cat - $FILE | sponge $FILE
done

