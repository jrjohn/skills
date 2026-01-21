#!/bin/bash
# Node 04: Framework - Exit Validation
# Validates COR-AFP-NTP framework configuration

set -e

WORKSPACE_DIR="$HOME/.claude/skills/skill-creator/workspace"
FRAMEWORK_FILE="$WORKSPACE_DIR/framework.json"
STRUCTURE_FILE="$WORKSPACE_DIR/structure.json"
CLASSIFICATION_FILE="$WORKSPACE_DIR/classification.json"

echo "=== Node 04: Framework Exit Validation ==="
echo ""

# Check 1: framework.json exists
echo -n "Checking framework.json exists... "
if [ ! -f "$FRAMEWORK_FILE" ]; then
    echo "FAILED"
    echo "  Error: $FRAMEWORK_FILE not found"
    exit 1
fi
echo "OK"

# Check 2: File is valid JSON
echo -n "Checking valid JSON... "
if ! jq empty "$FRAMEWORK_FILE" 2>/dev/null; then
    echo "FAILED"
    echo "  Error: Invalid JSON in framework.json"
    exit 1
fi
echo "OK"

# Check 3: Check if skipped
SKIPPED=$(jq -r '.skipped // false' "$FRAMEWORK_FILE")
SKILL_TYPE=$(jq -r '.skill_type // empty' "$CLASSIFICATION_FILE")

if [ "$SKIPPED" = "true" ]; then
    echo ""
    echo "Framework configuration skipped (skill type: $SKILL_TYPE)"
    echo ""
    echo "=== Validation passed (skipped) ==="
    echo ""
    echo "Ready to proceed to Node 05: Validation"
    exit 0
fi

# Complex type validations
TARGET_DIR=$(jq -r '.target_directory // empty' "$STRUCTURE_FILE")

# Check 4: Process directory exists
echo -n "Checking process directory... "
if [ ! -d "$TARGET_DIR/process" ]; then
    echo "FAILED"
    echo "  Error: process/ directory not found"
    exit 1
fi
echo "OK"

# Check 5: At least one node exists
echo -n "Checking process nodes... "
NODE_COUNT=$(find "$TARGET_DIR/process" -maxdepth 1 -type d -name "[0-9]*" | wc -l | tr -d ' ')
if [ "$NODE_COUNT" -eq 0 ]; then
    echo "FAILED"
    echo "  Error: No process nodes found"
    exit 1
fi
echo "OK ($NODE_COUNT nodes)"

# Check 6: Each node has README.md
echo -n "Checking node READMEs... "
for node_dir in "$TARGET_DIR/process"/[0-9]*; do
    if [ -d "$node_dir" ]; then
        if [ ! -f "$node_dir/README.md" ]; then
            echo "FAILED"
            echo "  Error: README.md missing in $(basename "$node_dir")"
            exit 1
        fi
    fi
done
echo "OK"

# Check 7: Each node has exit-validation.sh
echo -n "Checking exit-validation scripts... "
for node_dir in "$TARGET_DIR/process"/[0-9]*; do
    if [ -d "$node_dir" ]; then
        if [ ! -f "$node_dir/exit-validation.sh" ]; then
            echo "FAILED"
            echo "  Error: exit-validation.sh missing in $(basename "$node_dir")"
            exit 1
        fi
    fi
done
echo "OK"

# Check 8: workspace-template exists
echo -n "Checking workspace-template... "
if [ ! -f "$TARGET_DIR/workspace-template/current-process.json" ]; then
    echo "FAILED"
    echo "  Error: workspace-template/current-process.json not found"
    exit 1
fi
echo "OK"

# Check 9: AFP recover-state exists
echo -n "Checking AFP recover-state... "
if [ ! -f "$TARGET_DIR/frameworks/afp/recover-state.js" ]; then
    echo "WARNING (recover-state.js not found)"
else
    echo "OK"
fi

# Check 10: NTP node-transition exists
echo -n "Checking NTP node-transition... "
if [ ! -f "$TARGET_DIR/frameworks/ntp/node-transition.js" ]; then
    echo "WARNING (node-transition.js not found)"
else
    echo "OK"
fi

echo ""
echo "=== All validations passed ==="
echo ""
echo "Summary:"
echo "  Skill Type: complex"
echo "  Process Nodes: $NODE_COUNT"
echo ""
echo "Ready to proceed to Node 05: Validation"
exit 0
