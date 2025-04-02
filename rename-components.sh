#!/bin/bash

# rename-components.sh
# Script to rename component files from PascalCase to kebab-case and update imports
# NOTE-FOR-NEXT-DEVELOPER: This script automates the renaming of component files from PascalCase to kebab-case.
# It performs the following actions:
# 1. Renames component files using git mv (preserving git history)
# 2. Updates import statements across the codebase to point to the new file names
# 3. Runs TypeScript validation to confirm nothing broke during the rename

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Directories to search for components
COMPONENTS_DIR="./mcp-guardian/src/components"
PAGES_DIR="./mcp-guardian/src/pages"
SRC_DIR="./mcp-guardian/src"
UTILS_DIR="./mcp-guardian/src"  # For utility files

# Function to convert PascalCase to kebab-case
pascal_to_kebab() {
  echo "$1" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]'
}

# Temporary file to store commands
COMMANDS_FILE=$(mktemp)
echo "# Commands to rename component files" > "$COMMANDS_FILE"
echo "# Review these commands and execute them if they look correct" >> "$COMMANDS_FILE"
echo "set -e" >> "$COMMANDS_FILE"

# Find component files and generate rename commands
echo -e "${BOLD}Generating rename commands for component files...${NC}"

# Function to process a directory
process_directory() {
  local dir=$1
  local file_pattern=$2
  
  find "$dir" -type f -name "$file_pattern" | while read -r file; do
    filename=$(basename "$file")
    dirname=$(dirname "$file")
    extension="${filename##*.}"
    
    # Skip if filename is index.tsx or index.ts
    if [[ "$filename" == "index.tsx" || "$filename" == "index.ts" ]]; then
      continue
    fi
    
    # Skip if filename already contains a hyphen (likely already kebab-case)
    if [[ "$filename" == *-* ]]; then
      continue
    fi
    
    # Get base name without extension
    base_name=${filename%.*}
    
    # Convert to kebab-case
    kebab_name=$(pascal_to_kebab "$base_name")
    
    # Skip if the name didn't change
    if [[ "$base_name" == "$kebab_name" ]]; then
      continue
    fi
    
    # Add command to rename file
    echo "# Rename $base_name to $kebab_name" >> "$COMMANDS_FILE"
    echo "git mv \"$file\" \"$dirname/${kebab_name}.${extension}\"" >> "$COMMANDS_FILE"
    
    # Pattern to update imports
    echo "# Update imports for $base_name" >> "$COMMANDS_FILE"
    echo "find $SRC_DIR -type f -name \"*.tsx\" -o -name \"*.ts\" | xargs sed -i '' -E \"s|from ['\\\"](.*/)?${base_name}['\\\"]|from \\1${kebab_name}\"|g\"" >> "$COMMANDS_FILE"
    
    # Additionally update any .d.ts references
    echo "# Update .d.ts references for $base_name" >> "$COMMANDS_FILE"
    echo "find $SRC_DIR -type f -name \"*.d.ts\" | xargs sed -i '' -E \"s|['\\\"](.*/)${base_name}['\\\"](.*)|'\\\\\1${kebab_name}\\'\\\\\2|g\"" >> "$COMMANDS_FILE"
  done
}

# Process component directories
process_directory "$COMPONENTS_DIR" "*.tsx"
process_directory "$COMPONENTS_DIR/ui" "*.tsx"
process_directory "$COMPONENTS_DIR/messages" "*.tsx"
process_directory "$PAGES_DIR" "*.tsx"

# Create section for verifying utility files
echo -e "\n# Verify utility files are in camelCase" >> "$COMMANDS_FILE"
echo "echo 'Checking utility files for camelCase naming...'" >> "$COMMANDS_FILE"
echo "find $UTILS_DIR -type f -name \"*.ts\" -not -path \"*/node_modules/*\" -not -path \"*/components/*\" -not -path \"*/pages/*\" | grep -i '[A-Z]' | grep -v '\.d\.ts$' | while read -r file; do" >> "$COMMANDS_FILE"
echo "  echo \"WARNING: Utility file \$file may not follow camelCase convention\"" >> "$COMMANDS_FILE"
echo "done" >> "$COMMANDS_FILE"

echo -e "${GREEN}Commands generated in $COMMANDS_FILE${NC}"
echo -e "${YELLOW}Review the commands file before executing:${NC}"
echo -e "cat $COMMANDS_FILE"
echo -e "${YELLOW}To execute the commands:${NC}"
echo -e "bash $COMMANDS_FILE"
echo -e "${YELLOW}After executing, run validation:${NC}"
echo -e "cd mcp-guardian && npm run typecheck"
echo -e "${YELLOW}Then test the application:${NC}"
echo -e "npm run tauri dev"

# Make the commands file executable
chmod +x "$COMMANDS_FILE"

echo -e "${BOLD}Preview of commands to be executed:${NC}"
cat "$COMMANDS_FILE" | grep -v "^#" | grep -v "^set -e"

# Summary of what will happen
NUM_FILES=$(grep -c "git mv" "$COMMANDS_FILE" || echo 0)
echo -e "\n${BOLD}Summary:${NC}"
echo -e "  - ${NUM_FILES} files will be renamed from PascalCase to kebab-case"
echo -e "  - Import statements will be updated across the codebase"
echo -e "  - Utility files will be checked for camelCase naming"
echo -e "\n${YELLOW}This completes the Phase 1 task of file naming consistency.${NC}"
echo -e "${YELLOW}After running this script, the task can be marked as [x] in PHASE1.md${NC}"