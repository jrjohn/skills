#!/bin/bash
# Node 03: Templates - Exit Validation
# Validates that templates have been applied

set -e

WORKSPACE_DIR="$HOME/.claude/skills/skill-creator/workspace"
TEMPLATES_FILE="$WORKSPACE_DIR/templates.json"
STRUCTURE_FILE="$WORKSPACE_DIR/structure.json"

echo "=== Node 03: Templates Exit Validation ==="
echo ""

# Check 1: templates.json exists
echo -n "Checking templates.json exists... "
if [ ! -f "$TEMPLATES_FILE" ]; then
    echo "FAILED"
    echo "  Error: $TEMPLATES_FILE not found"
    exit 1
fi
echo "OK"

# Check 2: File is valid JSON
echo -n "Checking valid JSON... "
if ! jq empty "$TEMPLATES_FILE" 2>/dev/null; then
    echo "FAILED"
    echo "  Error: Invalid JSON in templates.json"
    exit 1
fi
echo "OK"

# Check 3: Get target directory
TARGET_DIR=$(jq -r '.target_directory // empty' "$STRUCTURE_FILE")
if [ -z "$TARGET_DIR" ]; then
    echo "FAILED: Cannot determine target directory"
    exit 1
fi

# Check 4: SKILL.md has content
echo -n "Checking SKILL.md has content... "
SKILL_MD="$TARGET_DIR/SKILL.md"
if [ ! -s "$SKILL_MD" ]; then
    echo "FAILED"
    echo "  Error: SKILL.md is empty"
    exit 1
fi
# Check for placeholder indicators
if grep -q "^# Placeholder" "$SKILL_MD" 2>/dev/null; then
    echo "FAILED"
    echo "  Error: SKILL.md still has placeholder content"
    exit 1
fi
echo "OK"

# Check 5: README.md has content
echo -n "Checking README.md has content... "
README_MD="$TARGET_DIR/README.md"
if [ ! -s "$README_MD" ]; then
    echo "FAILED"
    echo "  Error: README.md is empty"
    exit 1
fi
echo "OK"

# Check 6: No remaining {{VARIABLE}} placeholders
echo -n "Checking for unsubstituted variables... "
REMAINING=$(grep -r '{{[A-Z_]*}}' "$TARGET_DIR"/*.md 2>/dev/null | head -5 || true)
if [ -n "$REMAINING" ]; then
    echo "WARNING"
    echo "  Found unsubstituted variables:"
    echo "$REMAINING" | head -3
    # This is a warning, not a failure
else
    echo "OK"
fi

# Check 7: Templates applied count
echo -n "Checking templates applied... "
TEMPLATES_COUNT=$(jq '.templates_applied | length' "$TEMPLATES_FILE")
if [ "$TEMPLATES_COUNT" -eq 0 ]; then
    echo "FAILED"
    echo "  Error: No templates were applied"
    exit 1
fi
echo "OK ($TEMPLATES_COUNT templates)"

echo ""
echo "=== All validations passed ==="
echo ""
echo "Summary:"
echo "  Target Directory: $TARGET_DIR"
echo "  Templates Applied: $TEMPLATES_COUNT"
echo ""
echo "Ready to proceed to Node 04: Framework"
exit 0
