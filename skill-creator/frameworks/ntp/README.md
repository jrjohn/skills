# NTP Framework (Node Transition Protocol)

## Overview

NTP (Node Transition Protocol) manages gated transitions between COR nodes.

## Principles

1. **Gate Validation**: Every transition requires passing exit validation
2. **Blocking**: Failed validation blocks progression
3. **Logging**: All transitions are logged
4. **Reversibility**: Blocked transitions don't corrupt state

## Transition Flow

```
[Current Node]
      ↓
[Exit Validation]
      ↓
  ┌───┴───┐
  │       │
PASS    FAIL
  │       │
  ↓       ↓
[Next]  [Block]
```

## Exit Gate Structure

Each node has an `exit-validation.sh` script:

```bash
#!/bin/bash
set -e

# Validation checks
# Exit 0 = pass, non-zero = fail

echo "=== Node XX: Name Exit Validation ==="

# Check 1: Required file exists
echo -n "Checking required file... "
if [ ! -f "expected_file.json" ]; then
    echo "FAILED"
    exit 1
fi
echo "OK"

# Check 2: File is valid
echo -n "Checking validity... "
if ! jq empty "expected_file.json"; then
    echo "FAILED"
    exit 1
fi
echo "OK"

echo "=== All validations passed ==="
exit 0
```

## Validation Categories

| Category | Description | Example |
|----------|-------------|---------|
| Existence | File/directory exists | `[ -f file.json ]` |
| Format | Correct format/schema | `jq empty file.json` |
| Content | Required fields present | `jq '.field'` |
| Integrity | Data consistency | Cross-reference checks |

## Transition Script

```javascript
// node-transition.js
function attemptTransition(fromNode, toNode) {
  // Run exit validation
  const validationResult = runExitValidation(fromNode);

  if (!validationResult.passed) {
    return {
      success: false,
      blocked: true,
      reason: validationResult.errors,
      stayAt: fromNode
    };
  }

  // Update state
  updateState({
    current_node: toNode,
    completed_nodes: [...state.completed_nodes, fromNode]
  });

  return {
    success: true,
    blocked: false,
    transitionedTo: toNode
  };
}
```

## Gate Types

### Hard Gate

Must pass to proceed. Blocks on failure.

```bash
# Hard gate example
if [ ! -f "required.json" ]; then
    echo "FAILED: required.json missing"
    exit 1
fi
```

### Soft Gate (Warning)

Warns but allows proceeding.

```bash
# Soft gate example
if [ ! -f "optional.json" ]; then
    echo "WARNING: optional.json missing"
    # Continue, don't exit
fi
```

## Best Practices

1. **Clear Messages**: Explain why validation failed
2. **Actionable Errors**: Tell user how to fix
3. **Idempotent**: Running twice gives same result
4. **Fast**: Validations should be quick
5. **Comprehensive**: Check all requirements

## Integration with COR

NTP is invoked between COR nodes:

```
Node 00 → [NTP Gate] → Node 01 → [NTP Gate] → Node 02
```

## Integration with AFP

NTP updates AFP state on transition:
- Records completed node
- Updates current node
- Timestamps transition

## Blocked Transition Handling

When a transition is blocked:

1. User is informed of failure
2. Specific errors are listed
3. Suggestions are provided
4. User can fix and retry

```
=== Transition Blocked ===

From: 00-requirements
To: 01-classification

Failures:
  1. requirements.json not found
  2. skill_name is empty

Actions:
  - Ensure requirements are collected
  - Re-run node 00-requirements
```
