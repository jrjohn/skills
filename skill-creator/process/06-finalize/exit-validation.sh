#!/bin/bash
# Node 06: Finalize - Exit Validation
# Validates that skill creation is complete

set -e

WORKSPACE_DIR="$HOME/.claude/skills/skill-creator/workspace"
FINALIZE_FILE="$WORKSPACE_DIR/finalize.json"

echo "=== Node 06: Finalize Exit Validation ==="
echo ""

# Check 1: finalize.json exists
echo -n "Checking finalize.json exists... "
if [ ! -f "$FINALIZE_FILE" ]; then
    echo "FAILED"
    echo "  Error: $FINALIZE_FILE not found"
    exit 1
fi
echo "OK"

# Check 2: File is valid JSON
echo -n "Checking valid JSON... "
if ! jq empty "$FINALIZE_FILE" 2>/dev/null; then
    echo "FAILED"
    echo "  Error: Invalid JSON in finalize.json"
    exit 1
fi
echo "OK"

# Check 3: Get target directory
TARGET_DIR=$(jq -r '.target_directory // empty' "$FINALIZE_FILE")
echo -n "Checking target directory... "
if [ -z "$TARGET_DIR" ]; then
    echo "FAILED"
    echo "  Error: target_directory not specified"
    exit 1
fi
if [ ! -d "$TARGET_DIR" ]; then
    echo "FAILED"
    echo "  Error: Directory $TARGET_DIR does not exist"
    exit 1
fi
echo "OK"

# Check 4: manifest.json exists in target
echo -n "Checking manifest.json... "
if [ ! -f "$TARGET_DIR/manifest.json" ]; then
    echo "FAILED"
    echo "  Error: manifest.json not found in $TARGET_DIR"
    exit 1
fi
echo "OK"

# Check 5: SKILL.md has content
echo -n "Checking SKILL.md... "
if [ ! -s "$TARGET_DIR/SKILL.md" ]; then
    echo "FAILED"
    echo "  Error: SKILL.md is empty"
    exit 1
fi
echo "OK"

# Check 6: README.md has content
echo -n "Checking README.md... "
if [ ! -s "$TARGET_DIR/README.md" ]; then
    echo "FAILED"
    echo "  Error: README.md is empty"
    exit 1
fi
echo "OK"

# Get skill info
SKILL_NAME=$(jq -r '.skill_name // "unknown"' "$FINALIZE_FILE")
SKILL_TYPE=$(jq -r '.skill_type // "unknown"' "$FINALIZE_FILE")
FILES_CREATED=$(jq '.files_created | length' "$FINALIZE_FILE")

echo ""
echo "=== SKILL CREATION COMPLETE ==="
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    SKILL CREATED SUCCESSFULLY                ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  Skill Name: $SKILL_NAME"
echo "║  Skill Type: $SKILL_TYPE"
echo "║  Location:   $TARGET_DIR"
echo "║  Files:      $FILES_CREATED created"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  INVOKE YOUR SKILL:                                          ║"
echo "║  /$SKILL_NAME                                                 "
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
exit 0
