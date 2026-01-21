# Node 04: Framework Configuration

> **COR Node**: Configures COR-AFP-NTP framework (Complex type only)

## Purpose

Set up the full COR-AFP-NTP framework for complex skills that require state management and multi-phase workflows.

## Entry Conditions

- Node 03 (templates) completed
- Skill type is **Complex** (skip if Simple or Standard)

## Skip Condition

```javascript
if (skillType !== 'complex') {
  // Create skip marker and proceed to validation
  createFile('workspace/framework.json', {
    skipped: true,
    reason: 'Not a complex skill',
    skill_type: skillType
  });
  // Proceed to Node 05
}
```

## Framework Components

### COR (Chain of Repository)

Creates sequential node structure:

```
process/
├── 00-{first-phase}/
│   ├── README.md
│   └── exit-validation.sh
├── 01-{second-phase}/
│   ├── README.md
│   └── exit-validation.sh
└── ...
```

### AFP (Anti-Fragile Protocol)

Creates state management:

```
workspace-template/
└── current-process.json

frameworks/afp/
├── README.md
├── recover-state.js
└── quick-health-check.sh
```

### NTP (Node Transition Protocol)

Creates transition logic:

```
frameworks/ntp/
├── README.md
├── node-transition.js
└── exit-gate.js
```

## Actions

1. **Check skill type**
   - If not Complex, create skip marker and proceed

2. **Read phases from requirements**
   ```bash
   cat workspace/requirements.json | jq '.phases'
   ```

3. **Create process nodes**
   For each phase:
   - Create directory `process/{index:02d}-{phase-name}/`
   - Generate README.md from template
   - Generate exit-validation.sh from template

4. **Configure AFP**
   - Create workspace-template/current-process.json
   - Create recover-state.js
   - Create quick-health-check.sh

5. **Configure NTP**
   - Define node chain
   - Create node-transition.js
   - Create exit-gate.js

6. **Update SKILL.md**
   - Add COR process flow diagram
   - Add node summary table
   - Add AFP state management section
   - Add NTP gate documentation

7. **Create framework.json**
   ```json
   {
     "skipped": false,
     "skill_type": "complex",
     "cor": {
       "nodes": ["00-init", "01-collect", "02-process", "03-output"],
       "entry_node": "00-init",
       "exit_node": "03-output"
     },
     "afp": {
       "workspace_template": "workspace-template/current-process.json",
       "recovery_script": "frameworks/afp/recover-state.js"
     },
     "ntp": {
       "transition_script": "frameworks/ntp/node-transition.js",
       "gates_defined": 4
     },
     "framework_configured_at": "2026-01-21T10:20:00Z"
   }
   ```

## Node Generation Template

For each phase, generate:

### README.md
```markdown
# Node {INDEX}: {PHASE_NAME}

> **COR Node**: {PHASE_DESCRIPTION}

## Purpose

[Generated from phase description]

## Entry Conditions

- Previous node completed
- Required inputs available

## Actions

1. [Phase-specific actions]

## Output

Create `workspace/{phase-name}-output.json`

## Exit Validation

Run: `bash exit-validation.sh`

### Success Criteria
- [ ] Output file exists
- [ ] [Phase-specific criteria]

## Next Node

On success → `{NEXT_NODE}`
```

### exit-validation.sh
```bash
#!/bin/bash
# Node {INDEX}: {PHASE_NAME} - Exit Validation

set -e
WORKSPACE_DIR="$HOME/.claude/skills/{SKILL_NAME}/workspace"

echo "=== Node {INDEX}: {PHASE_NAME} Exit Validation ==="

# [Phase-specific validations]

echo "=== All validations passed ==="
exit 0
```

## Exit Validation

Run: `bash exit-validation.sh`

### Success Criteria (Complex)
- [ ] All process nodes created
- [ ] Each node has README.md
- [ ] Each node has exit-validation.sh
- [ ] workspace-template/current-process.json exists
- [ ] AFP scripts exist
- [ ] NTP scripts exist
- [ ] SKILL.md updated with COR diagram

### Success Criteria (Non-Complex)
- [ ] framework.json exists with skipped: true

### Blocking Conditions
- Node directory creation failed
- Script generation failed

## Next Node

On success → `05-validation`

## Error Handling

| Error | Action |
|-------|--------|
| No phases defined | Generate default: init, process, complete |
| Invalid phase name | Sanitize to valid directory name |
| Script write failed | Retry with error message |
