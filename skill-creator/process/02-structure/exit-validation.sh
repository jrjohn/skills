#!/bin/bash
# Node 02: Structure - Exit Validation
# Validates that directory structure has been created

set -e

WORKSPACE_DIR="$HOME/.claude/skills/skill-creator/workspace"
STRUCTURE_FILE="$WORKSPACE_DIR/structure.json"
CLASSIFICATION_FILE="$WORKSPACE_DIR/classification.json"

echo "=== Node 02: Structure Exit Validation ==="
echo ""

# Check 1: structure.json exists
echo -n "Checking structure.json exists... "
if [ ! -f "$STRUCTURE_FILE" ]; then
    echo "FAILED"
    echo "  Error: $STRUCTURE_FILE not found"
    exit 1
fi
echo "OK"

# Check 2: File is valid JSON
echo -n "Checking valid JSON... "
if ! jq empty "$STRUCTURE_FILE" 2>/dev/null; then
    echo "FAILED"
    echo "  Error: Invalid JSON in structure.json"
    exit 1
fi
echo "OK"

# Check 3: Target directory exists
echo -n "Checking target directory... "
TARGET_DIR=$(jq -r '.target_directory // empty' "$STRUCTURE_FILE")
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
echo "OK ($TARGET_DIR)"

# Check 4: SKILL.md exists
echo -n "Checking SKILL.md... "
if [ ! -f "$TARGET_DIR/SKILL.md" ]; then
    echo "FAILED"
    echo "  Error: SKILL.md not found in $TARGET_DIR"
    exit 1
fi
echo "OK"

# Check 5: README.md exists
echo -n "Checking README.md... "
if [ ! -f "$TARGET_DIR/README.md" ]; then
    echo "FAILED"
    echo "  Error: README.md not found in $TARGET_DIR"
    exit 1
fi
echo "OK"

# Check 6: Type-specific directories
SKILL_TYPE=$(jq -r '.skill_type // empty' "$CLASSIFICATION_FILE")
echo -n "Checking type-specific structure ($SKILL_TYPE)... "

case "$SKILL_TYPE" in
    standard)
        for dir in patterns checklists references; do
            if [ ! -d "$TARGET_DIR/$dir" ]; then
                echo "FAILED"
                echo "  Error: Directory $dir not found"
                exit 1
            fi
        done
        ;;
    complex)
        for dir in process workspace-template frameworks validators references; do
            if [ ! -d "$TARGET_DIR/$dir" ]; then
                echo "FAILED"
                echo "  Error: Directory $dir not found"
                exit 1
            fi
        done
        ;;
esac
echo "OK"

echo ""
echo "=== All validations passed ==="
echo ""
echo "Summary:"
echo "  Target Directory: $TARGET_DIR"
echo "  Skill Type: $SKILL_TYPE"
CREATED_DIRS=$(jq '.created_directories | length' "$STRUCTURE_FILE")
CREATED_FILES=$(jq '.created_files | length' "$STRUCTURE_FILE")
echo "  Directories Created: $CREATED_DIRS"
echo "  Files Created: $CREATED_FILES"
echo ""
echo "Ready to proceed to Node 03: Templates"
exit 0
