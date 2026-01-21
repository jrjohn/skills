#!/bin/bash
# Node 00: Requirements - Exit Validation
# Validates that requirements have been properly collected

set -e

WORKSPACE_DIR="$HOME/.claude/skills/skill-creator/workspace"
REQUIREMENTS_FILE="$WORKSPACE_DIR/requirements.json"

echo "=== Node 00: Requirements Exit Validation ==="
echo ""

# Check 1: requirements.json exists
echo -n "Checking requirements.json exists... "
if [ ! -f "$REQUIREMENTS_FILE" ]; then
    echo "FAILED"
    echo "  Error: $REQUIREMENTS_FILE not found"
    exit 1
fi
echo "OK"

# Check 2: File is valid JSON
echo -n "Checking valid JSON... "
if ! jq empty "$REQUIREMENTS_FILE" 2>/dev/null; then
    echo "FAILED"
    echo "  Error: Invalid JSON in requirements.json"
    exit 1
fi
echo "OK"

# Check 3: skill_name exists and is not empty
echo -n "Checking skill_name... "
SKILL_NAME=$(jq -r '.skill_name // empty' "$REQUIREMENTS_FILE")
if [ -z "$SKILL_NAME" ]; then
    echo "FAILED"
    echo "  Error: skill_name is required"
    exit 1
fi
echo "OK ($SKILL_NAME)"

# Check 4: skill_name follows naming convention
echo -n "Checking skill_name format... "
if ! echo "$SKILL_NAME" | grep -qE '^[a-z][a-z0-9-]*[a-z0-9]$|^[a-z]$'; then
    echo "FAILED"
    echo "  Error: skill_name must be lowercase with dashes (e.g., my-skill)"
    exit 1
fi
echo "OK"

# Check 5: skill_description exists and is not empty
echo -n "Checking skill_description... "
DESCRIPTION=$(jq -r '.skill_description // empty' "$REQUIREMENTS_FILE")
if [ -z "$DESCRIPTION" ]; then
    echo "FAILED"
    echo "  Error: skill_description is required"
    exit 1
fi
echo "OK"

# Check 6: workflow_type is valid
echo -n "Checking workflow_type... "
WORKFLOW_TYPE=$(jq -r '.workflow_type // empty' "$REQUIREMENTS_FILE")
if [ -z "$WORKFLOW_TYPE" ]; then
    echo "FAILED"
    echo "  Error: workflow_type is required"
    exit 1
fi
if [[ ! "$WORKFLOW_TYPE" =~ ^(simple|standard|complex)$ ]]; then
    echo "FAILED"
    echo "  Error: workflow_type must be simple, standard, or complex"
    exit 1
fi
echo "OK ($WORKFLOW_TYPE)"

# Check 7: allowed_tools has at least one entry
echo -n "Checking allowed_tools... "
TOOLS_COUNT=$(jq '.allowed_tools | length' "$REQUIREMENTS_FILE")
if [ "$TOOLS_COUNT" -eq 0 ]; then
    echo "FAILED"
    echo "  Error: At least one tool must be selected"
    exit 1
fi
echo "OK ($TOOLS_COUNT tools)"

echo ""
echo "=== All validations passed ==="
echo ""
echo "Summary:"
echo "  Skill Name: $SKILL_NAME"
echo "  Workflow Type: $WORKFLOW_TYPE"
echo "  Tools: $TOOLS_COUNT selected"
echo ""
echo "Ready to proceed to Node 01: Classification"
exit 0
