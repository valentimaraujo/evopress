#!/bin/bash

# Configuration
SOURCE_DIR="/home/evodev/projects/evodev/belflora/lib/theme"
DEST_DIR="/home/evodev/projects/evodev/evopress/public/themes/gardyn"

echo "Creating destination directory: $DEST_DIR"
mkdir -p "$DEST_DIR"

echo "Copying assets from $SOURCE_DIR to $DEST_DIR..."

# Copy directories
cp -r "$SOURCE_DIR/css" "$DEST_DIR/"
cp -r "$SOURCE_DIR/js" "$DEST_DIR/"
cp -r "$SOURCE_DIR/fonts" "$DEST_DIR/"
cp -r "$SOURCE_DIR/images" "$DEST_DIR/"
cp -r "$SOURCE_DIR/demo" "$DEST_DIR/"

# Copy individual JS files if any in root
cp "$SOURCE_DIR/contact.js" "$DEST_DIR/" 2>/dev/null || true

echo "Asset copy completed successfully!"
