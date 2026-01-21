---
name: skill-creator
description: Meta-skill for creating standardized skills following COR-AFP-NTP protocol
version: 1.0.0
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
  - TodoWrite
---

# Skill Creator Meta-Skill

> **COR-AFP-NTP Compliant Meta-Skill Generator**

## Purpose

This skill creates new skills that follow the standardized COR-AFP-NTP protocol:
- **COR** (Chain of Repository): Sequential node-based workflow
- **AFP** (Anti-Fragile Protocol): State recovery and persistence
- **NTP** (Node Transition Protocol): Gated transitions between nodes

---

## Skill Types

| Type | Features | COR | AFP | NTP | Files |
|------|----------|-----|-----|-----|-------|
| **Simple** | Single function, stateless | No | No | No | 3-5 |
| **Standard** | Patterns, checklists | No | No | No | 8-15 |
| **Complex** | Multi-phase workflow, state | Yes | Yes | Yes | 20+ |

---

## Quick Start

```
User: /skill-creator
AI: Starting skill creation workflow...
```

---

## COR Process Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  00-requirements → 01-classification → 02-structure → 03-templates          │
│                                                           ↓                 │
│                    06-finalize ← 05-validation ← 04-framework               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Node Summary

| Node | Purpose | Gate |
|------|---------|------|
| `00-requirements` | Collect skill requirements | requirements.json complete |
| `01-classification` | Determine skill type | classification.json complete |
| `02-structure` | Create directory structure | All directories exist |
| `03-templates` | Apply templates | All .template files processed |
| `04-framework` | Configure COR/AFP/NTP | Complex type only |
| `05-validation` | Validate structure | All validations pass |
| `06-finalize` | Generate docs, report | README complete |

---

## AFP State Management

### Workspace Location
```
~/.claude/skills/skill-creator/workspace-template/current-process.json
```

### State Schema
```json
{
  "session_id": "uuid",
  "current_node": "00-requirements",
  "skill_name": "",
  "skill_type": "",
  "started_at": "ISO8601",
  "updated_at": "ISO8601",
  "completed_nodes": [],
  "node_outputs": {}
}
```

### Recovery Commands
```bash
# Check current state
cat ~/.claude/skills/skill-creator/workspace/current-process.json

# Quick health check
bash ~/.claude/skills/skill-creator/frameworks/afp/quick-health-check.sh
```

---

## NTP Gate Validation

Each node must pass exit validation before proceeding:

```bash
# Example: Validate requirements node
bash ~/.claude/skills/skill-creator/process/00-requirements/exit-validation.sh
```

---

## Initialization Protocol

### On Skill Invocation:

1. **Check for existing session**
   ```bash
   if [ -f ~/.claude/skills/skill-creator/workspace/current-process.json ]; then
     # Resume existing session
   else
     # Start new session
   fi
   ```

2. **If resuming**: Read state and continue from `current_node`

3. **If new**:
   - Initialize workspace
   - Start at `00-requirements`

---

## Entry Point

**READ FIRST**: `~/.claude/skills/skill-creator/process/00-requirements/README.md`

Then follow the COR chain sequentially.

---

## File Index

### Core Files
| File | Purpose |
|------|---------|
| `SKILL.md` | This file - COR entry point |
| `README.md` | User documentation |

### Process Nodes
| Node | README | Validation |
|------|--------|------------|
| 00-requirements | `process/00-requirements/README.md` | `exit-validation.sh` |
| 01-classification | `process/01-classification/README.md` | `exit-validation.sh` |
| 02-structure | `process/02-structure/README.md` | `exit-validation.sh` |
| 03-templates | `process/03-templates/README.md` | `exit-validation.sh` |
| 04-framework | `process/04-framework/README.md` | `exit-validation.sh` |
| 05-validation | `process/05-validation/README.md` | `exit-validation.sh` |
| 06-finalize | `process/06-finalize/README.md` | `exit-validation.sh` |

### Templates
| Type | Location |
|------|----------|
| Simple | `templates/simple/` |
| Standard | `templates/standard/` |
| Complex | `templates/complex/` |

### Frameworks
| Framework | Location |
|-----------|----------|
| COR | `frameworks/cor/` |
| AFP | `frameworks/afp/` |
| NTP | `frameworks/ntp/` |

### Validators
| Validator | Purpose |
|-----------|---------|
| `validate-structure.js` | Check directory structure |
| `validate-documentation.js` | Check required docs |
| `validate-cor-compliance.js` | Check COR compliance |

---

## Template Variables

| Variable | Source | Example |
|----------|--------|---------|
| `{{SKILL_NAME}}` | User input | my-awesome-skill |
| `{{SKILL_DISPLAY_NAME}}` | User input | My Awesome Skill |
| `{{SKILL_DESCRIPTION}}` | User input | A skill for... |
| `{{SKILL_TYPE}}` | Auto-classified | standard |
| `{{ALLOWED_TOOLS}}` | User selection | [Read, Write, Bash] |
| `{{NODES}}` | Complex only | ["00-init", "01-process"] |
| `{{GENERATED_DATE}}` | System | 2026-01-21 |

---

## Validation Checklist

### All Types
- [ ] SKILL.md exists with YAML frontmatter
- [ ] README.md exists with usage instructions
- [ ] Directory structure matches type

### Standard Type (additional)
- [ ] patterns/ directory exists
- [ ] checklists/ or examples.md exists

### Complex Type (additional)
- [ ] process/ directory with all nodes
- [ ] workspace-template/ exists
- [ ] Each node has README.md + exit-validation.sh
- [ ] COR chain is complete
- [ ] AFP recovery scripts exist
- [ ] NTP gates are defined

---

## Error Recovery

### Common Issues

| Issue | Solution |
|-------|----------|
| Session corrupted | Delete workspace/ and restart |
| Node validation fails | Check exit-validation.sh output |
| Template not found | Verify templates/ directory |

### Reset Session
```bash
rm -rf ~/.claude/skills/skill-creator/workspace/
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-21 | Initial implementation |
