#!/bin/bash
# AFP Quick Health Check
# Verifies workspace state integrity

set -e

WORKSPACE_DIR="${WORKSPACE_DIR:-$HOME/.claude/skills/skill-creator/workspace}"
STATE_FILE="$WORKSPACE_DIR/current-process.json"

echo "=== AFP Quick Health Check ==="
echo ""

# Check 1: Workspace exists
echo -n "Workspace directory... "
if [ ! -d "$WORKSPACE_DIR" ]; then
    echo "NOT FOUND"
    echo "  No active session"
    exit 0
fi
echo "OK"

# Check 2: State file exists
echo -n "State file... "
if [ ! -f "$STATE_FILE" ]; then
    echo "NOT FOUND"
    echo "  No session state"
    exit 0
fi
echo "OK"

# Check 3: Valid JSON
echo -n "JSON validity... "
if ! jq empty "$STATE_FILE" 2>/dev/null; then
    echo "INVALID"
    echo "  State file is corrupted"
    exit 1
fi
echo "OK"

# Check 4: Required fields
echo -n "Required fields... "
SESSION_ID=$(jq -r '.session_id // empty' "$STATE_FILE")
CURRENT_NODE=$(jq -r '.current_node // empty' "$STATE_FILE")

if [ -z "$SESSION_ID" ] || [ -z "$CURRENT_NODE" ]; then
    echo "MISSING"
    echo "  State is incomplete"
    exit 1
fi
echo "OK"

# Check 5: Node outputs
echo -n "Node outputs... "
COMPLETED=$(jq -r '.completed_nodes[]?' "$STATE_FILE")
MISSING_OUTPUTS=0

for node in $COMPLETED; do
    OUTPUT_FILE=$(jq -r ".node_outputs[\"$node\"] // empty" "$STATE_FILE")
    if [ -n "$OUTPUT_FILE" ] && [ ! -f "$WORKSPACE_DIR/$OUTPUT_FILE" ]; then
        MISSING_OUTPUTS=$((MISSING_OUTPUTS + 1))
    fi
done

if [ "$MISSING_OUTPUTS" -gt 0 ]; then
    echo "WARNING ($MISSING_OUTPUTS missing)"
else
    echo "OK"
fi

# Summary
echo ""
echo "=== Session Summary ==="
echo "Session ID: $SESSION_ID"
echo "Current Node: $CURRENT_NODE"
echo "Started: $(jq -r '.started_at // "unknown"' "$STATE_FILE")"
echo "Updated: $(jq -r '.updated_at // "unknown"' "$STATE_FILE")"

COMPLETED_COUNT=$(jq '.completed_nodes | length' "$STATE_FILE")
echo "Completed Nodes: $COMPLETED_COUNT"

SKILL_NAME=$(jq -r '.skill_name // empty' "$STATE_FILE")
if [ -n "$SKILL_NAME" ]; then
    echo "Skill Name: $SKILL_NAME"
fi

SKILL_TYPE=$(jq -r '.skill_type // empty' "$STATE_FILE")
if [ -n "$SKILL_TYPE" ]; then
    echo "Skill Type: $SKILL_TYPE"
fi

echo ""
echo "=== Health Check Complete ==="
echo "Status: HEALTHY"
echo ""
echo "To resume: Read process/$CURRENT_NODE/README.md"
exit 0
