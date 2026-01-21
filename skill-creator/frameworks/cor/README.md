# COR Framework (Chain of Repository)

## Overview

COR (Chain of Repository) is a sequential node-based workflow pattern for complex skills.

## Principles

1. **Sequential Execution**: Nodes execute in defined order
2. **Single Responsibility**: Each node has one primary purpose
3. **Clear Boundaries**: Entry and exit conditions are explicit
4. **State Persistence**: Progress is saved after each node

## Node Structure

```
process/
├── 00-{first-node}/
│   ├── README.md           # Node documentation
│   └── exit-validation.sh  # Gate validation
├── 01-{second-node}/
│   ├── README.md
│   └── exit-validation.sh
└── ...
```

## Node Template

Each node directory contains:

### README.md

```markdown
# Node {INDEX}: {NAME}

> **COR Node**: {DESCRIPTION}

## Purpose
[What this node does]

## Entry Conditions
- Previous node completed
- Required inputs available

## Actions
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Output
Create `workspace/{output-file}.json`

## Exit Validation
Run: `bash exit-validation.sh`

### Success Criteria
- [ ] Criteria 1
- [ ] Criteria 2

### Blocking Conditions
- Condition 1
- Condition 2

## Next Node
On success → `{NEXT_NODE}`
```

### exit-validation.sh

```bash
#!/bin/bash
set -e

# Validate node completion
# Exit 0 on success, non-zero on failure
```

## Node Chain Definition

Define the chain in SKILL.md:

```markdown
## COR Process Flow

00-init → 01-collect → 02-process → 03-validate → 04-output
```

## Best Practices

1. **Naming**: Use descriptive names (e.g., `00-requirements`, `01-classification`)
2. **Documentation**: Each node MUST have README.md
3. **Validation**: Each node MUST have exit-validation.sh
4. **Independence**: Nodes should be re-runnable
5. **Idempotence**: Running a node twice should produce same result

## Error Handling

- If a node fails, execution stops
- User is informed of failure point
- Recovery starts from failed node (not beginning)

## Integration with AFP

COR works with AFP (Anti-Fragile Protocol) to:
- Save state after each node completes
- Enable recovery from any point
- Track completed nodes

## Integration with NTP

COR works with NTP (Node Transition Protocol) to:
- Validate exit conditions before proceeding
- Block invalid transitions
- Log transition events
