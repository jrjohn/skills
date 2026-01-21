# Node 05: Validation

> **COR Node**: Validates complete skill structure and documentation

## Purpose

Run comprehensive validation on the generated skill to ensure it meets all requirements and standards.

## Entry Conditions

- Node 04 (framework) completed
- All files generated

## Validation Categories

### 1. Structure Validation

Verify directory structure matches skill type:

| Check | Simple | Standard | Complex |
|-------|--------|----------|---------|
| SKILL.md exists | ✓ | ✓ | ✓ |
| README.md exists | ✓ | ✓ | ✓ |
| patterns/ exists | - | ✓ | ✓ |
| checklists/ exists | - | ✓ | - |
| process/ exists | - | - | ✓ |
| workspace-template/ exists | - | - | ✓ |
| frameworks/ exists | - | - | ✓ |

### 2. Documentation Validation

Verify documentation quality:

| Check | Required |
|-------|----------|
| SKILL.md has YAML frontmatter | ✓ |
| SKILL.md has name field | ✓ |
| SKILL.md has description | ✓ |
| SKILL.md has allowed-tools | ✓ |
| README.md has usage section | ✓ |
| README.md has examples | Recommended |

### 3. COR Compliance (Complex only)

Verify COR chain integrity:

| Check | Required |
|-------|----------|
| All nodes have README.md | ✓ |
| All nodes have exit-validation.sh | ✓ |
| Node chain is complete | ✓ |
| Entry node defined | ✓ |
| Exit node defined | ✓ |

### 4. AFP Compliance (Complex only)

Verify AFP state management:

| Check | Required |
|-------|----------|
| workspace-template/current-process.json | ✓ |
| State schema is valid | ✓ |
| Recovery mechanism exists | ✓ |

### 5. NTP Compliance (Complex only)

Verify NTP gates:

| Check | Required |
|-------|----------|
| Exit validation per node | ✓ |
| Scripts are executable | ✓ |

## Actions

1. **Run structure validator**
   ```bash
   node validators/validate-structure.js $TARGET_DIR
   ```

2. **Run documentation validator**
   ```bash
   node validators/validate-documentation.js $TARGET_DIR
   ```

3. **Run COR compliance validator** (Complex only)
   ```bash
   node validators/validate-cor-compliance.js $TARGET_DIR
   ```

4. **Collect validation results**

5. **Create validation.json**
   ```json
   {
     "skill_name": "document-generator",
     "skill_type": "standard",
     "validations": {
       "structure": {
         "passed": true,
         "checks": 5,
         "failures": 0
       },
       "documentation": {
         "passed": true,
         "checks": 6,
         "failures": 0,
         "warnings": 1
       },
       "cor_compliance": {
         "skipped": true,
         "reason": "Not complex type"
       }
     },
     "overall_status": "passed",
     "validated_at": "2026-01-21T10:25:00Z"
   }
   ```

6. **Report results to user**
   - Show passed checks
   - Highlight any warnings
   - Block on failures

## Validation Script

```javascript
// validate-all.js
const { validateStructure } = require('./validate-structure');
const { validateDocumentation } = require('./validate-documentation');
const { validateCorCompliance } = require('./validate-cor-compliance');

async function validateSkill(targetDir, skillType) {
  const results = {
    structure: await validateStructure(targetDir, skillType),
    documentation: await validateDocumentation(targetDir),
    cor_compliance: skillType === 'complex'
      ? await validateCorCompliance(targetDir)
      : { skipped: true, reason: 'Not complex type' }
  };

  const overallPassed = results.structure.passed &&
                        results.documentation.passed &&
                        (results.cor_compliance.skipped || results.cor_compliance.passed);

  return {
    ...results,
    overall_status: overallPassed ? 'passed' : 'failed'
  };
}
```

## Exit Validation

Run: `bash exit-validation.sh`

### Success Criteria
- [ ] validation.json exists
- [ ] structure validation passed
- [ ] documentation validation passed
- [ ] COR compliance passed (or skipped)
- [ ] overall_status is "passed"

### Blocking Conditions
- Any validation failed
- Critical files missing
- Invalid YAML frontmatter

## Next Node

On success → `06-finalize`

## Error Handling

| Error | Action |
|-------|--------|
| Structure validation failed | List missing items |
| Documentation failed | Show what's missing |
| COR compliance failed | Show broken chain |

## User Feedback

On validation complete, display:

```
=== Skill Validation Results ===

✓ Structure Validation: PASSED (5/5 checks)
✓ Documentation Validation: PASSED (6/6 checks)
⚠ Warning: examples.md is minimal
✓ COR Compliance: SKIPPED (not complex type)

Overall: PASSED

Proceeding to finalization...
```

On failure:

```
=== Skill Validation Results ===

✓ Structure Validation: PASSED (5/5 checks)
✗ Documentation Validation: FAILED
  - SKILL.md missing 'allowed-tools' in frontmatter

Please fix the issues above and re-run validation.
```
