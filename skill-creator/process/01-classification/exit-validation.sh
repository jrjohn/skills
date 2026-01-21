#!/bin/bash
# Node 01: Classification - Exit Validation
# Validates that skill type has been determined

set -e

WORKSPACE_DIR="$HOME/.claude/skills/skill-creator/workspace"
CLASSIFICATION_FILE="$WORKSPACE_DIR/classification.json"

echo "=== Node 01: Classification Exit Validation ==="
echo ""

# Check 1: classification.json exists
echo -n "Checking classification.json exists... "
if [ ! -f "$CLASSIFICATION_FILE" ]; then
    echo "FAILED"
    echo "  Error: $CLASSIFICATION_FILE not found"
    exit 1
fi
echo "OK"

# Check 2: File is valid JSON
echo -n "Checking valid JSON... "
if ! jq empty "$CLASSIFICATION_FILE" 2>/dev/null; then
    echo "FAILED"
    echo "  Error: Invalid JSON in classification.json"
    exit 1
fi
echo "OK"

# Check 3: skill_type exists and is valid
echo -n "Checking skill_type... "
SKILL_TYPE=$(jq -r '.skill_type // empty' "$CLASSIFICATION_FILE")
if [ -z "$SKILL_TYPE" ]; then
    echo "FAILED"
    echo "  Error: skill_type is required"
    exit 1
fi
if [[ ! "$SKILL_TYPE" =~ ^(simple|standard|complex)$ ]]; then
    echo "FAILED"
    echo "  Error: skill_type must be simple, standard, or complex"
    exit 1
fi
echo "OK ($SKILL_TYPE)"

# Check 4: confidence exists
echo -n "Checking confidence... "
CONFIDENCE=$(jq -r '.confidence // empty' "$CLASSIFICATION_FILE")
if [ -z "$CONFIDENCE" ]; then
    echo "FAILED"
    echo "  Error: confidence level is required"
    exit 1
fi
echo "OK ($CONFIDENCE)"

echo ""
echo "=== All validations passed ==="
echo ""
echo "Summary:"
echo "  Skill Type: $SKILL_TYPE"
echo "  Confidence: $CONFIDENCE"
echo ""
echo "Ready to proceed to Node 02: Structure"
exit 0
