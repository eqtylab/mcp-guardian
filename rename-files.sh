#!/bin/bash

# Simple script to rename component files to kebab-case
# This script directly executes the rename commands

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Convert PascalCase to kebab-case
pascal_to_kebab() {
  echo "$1" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]'
}

echo -e "${BOLD}Starting file renaming...${NC}"

# Function to rename component files in a directory
rename_components() {
  local dir=$1
  echo -e "Processing directory: $dir"
  
  find "$dir" -type f -name "*.tsx" | while read -r file; do
    filename=$(basename "$file")
    dirname=$(dirname "$file")
    
    # Skip index files and files that are already kebab-case
    if [[ "$filename" == "index.tsx" || "$filename" == *-* ]]; then
      continue
    fi
    
    base_name=${filename%.tsx}
    kebab_name=$(pascal_to_kebab "$base_name")
    
    # Only rename if the name actually changed
    if [[ "$base_name" != "$kebab_name" ]]; then
      echo "Renaming $base_name to $kebab_name"
      git mv "$file" "$dirname/$kebab_name.tsx"
      
      # Update imports in all .ts and .tsx files
      echo "Updating imports for $base_name"
      find ./mcp-guardian/src -type f \( -name "*.tsx" -o -name "*.ts" \) | xargs sed -i '' -E "s|from ['\"](.*/)?$base_name['\"]|from \\1$kebab_name\"|g"
    fi
  done
}

# Process all component directories
rename_components "./mcp-guardian/src/components"
rename_components "./mcp-guardian/src/components/ui"
rename_components "./mcp-guardian/src/components/messages"
rename_components "./mcp-guardian/src/pages"

echo -e "${GREEN}File renaming complete!${NC}"
echo -e "${YELLOW}Running validation...${NC}"
cd mcp-guardian && npm run typecheck

echo -e "\n${BOLD}Next steps:${NC}"
echo -e "1. Test the application: npm run tauri dev"
echo -e "2. Commit the changes if everything looks good"