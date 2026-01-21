#!/bin/bash
# Node 05: Validation - Exit Validation
# Validates that all skill validations passed

set -e

WORKSPACE_DIR="$HOME/.claude/skills/skill-creator/workspace"
VALIDATION_FILE="$WORKSPACE_DIR/validation.json"

echo "=== Node 05: Validation Exit Validation ==="
echo ""

# Check 1: validation.json exists
echo -n "Checking validation.json exists... "
if [ ! -f "$VALIDATION_FILE" ]; then
    echo "FAILED"
    echo "  Error: $VALIDATION_FILE not found"
    exit 1
fi
echo "OK"

# Check 2: File is valid JSON
echo -n "Checking valid JSON... "
if ! jq empty "$VALIDATION_FILE" 2>/dev/null; then
    echo "FAILED"
    echo "  Error: Invalid JSON in validation.json"
    exit 1
fi
echo "OK"

# Check 3: Structure validation passed
echo -n "Checking structure validation... "
STRUCTURE_PASSED=$(jq -r '.validations.structure.passed // false' "$VALIDATION_FILE")
if [ "$STRUCTURE_PASSED" != "true" ]; then
    echo "FAILED"
    echo "  Error: Structure validation did not pass"
    jq -r '.validations.structure.failures // []' "$VALIDATION_FILE"
    exit 1
fi
STRUCTURE_CHECKS=$(jq -r '.validations.structure.checks // 0' "$VALIDATION_FILE")
echo "OK ($STRUCTURE_CHECKS checks)"

# Check 4: Documentation validation passed
echo -n "Checking documentation validation... "
DOC_PASSED=$(jq -r '.validations.documentation.passed // false' "$VALIDATION_FILE")
if [ "$DOC_PASSED" != "true" ]; then
    echo "FAILED"
    echo "  Error: Documentation validation did not pass"
    jq -r '.validations.documentation.failures // []' "$VALIDATION_FILE"
    exit 1
fi
DOC_CHECKS=$(jq -r '.validations.documentation.checks // 0' "$VALIDATION_FILE")
echo "OK ($DOC_CHECKS checks)"

# Check 5: COR compliance (if applicable)
echo -n "Checking COR compliance... "
COR_SKIPPED=$(jq -r '.validations.cor_compliance.skipped // false' "$VALIDATION_FILE")
if [ "$COR_SKIPPED" = "true" ]; then
    echo "SKIPPED"
else
    COR_PASSED=$(jq -r '.validations.cor_compliance.passed // false' "$VALIDATION_FILE")
    if [ "$COR_PASSED" != "true" ]; then
        echo "FAILED"
        echo "  Error: COR compliance validation did not pass"
        exit 1
    fi
    echo "OK"
fi

# Check 6: Overall status
echo -n "Checking overall status... "
OVERALL=$(jq -r '.overall_status // empty' "$VALIDATION_FILE")
if [ "$OVERALL" != "passed" ]; then
    echo "FAILED"
    echo "  Error: Overall validation status is '$OVERALL'"
    exit 1
fi
echo "PASSED"

# Check for warnings
WARNINGS=$(jq -r '.validations.documentation.warnings // 0' "$VALIDATION_FILE")
if [ "$WARNINGS" -gt 0 ]; then
    echo ""
    echo "Warnings: $WARNINGS (non-blocking)"
fi

echo ""
echo "=== All validations passed ==="
echo ""
echo "Summary:"
echo "  Structure Checks: $STRUCTURE_CHECKS passed"
echo "  Documentation Checks: $DOC_CHECKS passed"
echo "  Warnings: $WARNINGS"
echo ""
echo "Ready to proceed to Node 06: Finalize"
exit 0
