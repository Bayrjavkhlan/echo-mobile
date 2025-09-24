#!/bin/bash
set -e

ASSETS_DIR="node_modules/expo-router/assets"
mkdir -p "$ASSETS_DIR"

for img in logotype.png unmatched.png file.png pkg.png forward.png sitemap.png arrow_down.png error.png; do
  echo "Creating $ASSETS_DIR/$img"
  convert -size 1x1 xc:transparent "$ASSETS_DIR/$img"
done
