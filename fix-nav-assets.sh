#!/bin/bash
set -e

ASSETS_DIR="node_modules/@react-navigation/elements/lib/module/assets"
mkdir -p "$ASSETS_DIR"

for img in back-icon.png back-icon-mask.png clear-icon.png close-icon.png search-icon.png error.png; do
  echo "Creating $ASSETS_DIR/$img"
  convert -size 1x1 xc:transparent "$ASSETS_DIR/$img"
done
