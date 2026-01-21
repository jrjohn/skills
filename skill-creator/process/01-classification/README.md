# Node 01: Classification

> **COR Node**: Determines skill type based on requirements

## Purpose

Analyze collected requirements and classify the skill as Simple, Standard, or Complex.

## Entry Conditions

- Node 00 (requirements) completed
- `workspace/requirements.json` exists and valid

## Classification Logic

### Automatic Classification

```javascript
function classifySkill(requirements) {
  const { workflow_type, patterns, phases } = requirements;

  // User explicitly chose type
  if (workflow_type) {
    return workflow_type;
  }

  // Infer from features
  if (phases && phases.length > 0) {
    return 'complex';
  }
  if (patterns && patterns.length > 0) {
    return 'standard';
  }

  return 'simple';
}
```

### Classification Criteria

| Criterion | Simple | Standard | Complex |
|-----------|--------|----------|---------|
| State Management | No | No | Yes |
| Multiple Phases | No | No | Yes |
| Patterns/Templates | No | Yes | Yes |
| Reference Docs | Minimal | Yes | Yes |
| Recovery Needed | No | No | Yes |
| File Count | 3-5 | 8-15 | 20+ |

### Indicator Weights

| Feature | Points | Threshold |
|---------|--------|-----------|
| Phases defined | +3 | Complex if > 0 |
| Patterns > 3 | +2 | Standard if > 0 |
| Tools > 5 | +1 | Suggests complexity |
| User interaction | +1 | Suggests workflow |
| Validation needed | +2 | Suggests standard+ |

**Scoring:**
- 0-1 points: Simple
- 2-4 points: Standard
- 5+ points: Complex

## Actions

1. **Read requirements**
   ```bash
   cat workspace/requirements.json
   ```

2. **Apply classification logic**

3. **Confirm with user** (if ambiguous)
   ```
   Based on your requirements, this appears to be a [TYPE] skill.
   - Simple: Quick, single-purpose (3-5 files)
   - Standard: Pattern-based with docs (8-15 files)
   - Complex: Full COR-AFP-NTP workflow (20+ files)

   Is this classification correct?
   ```

4. **Create classification.json**
   ```json
   {
     "skill_type": "standard",
     "confidence": "high",
     "indicators": {
       "has_patterns": true,
       "has_phases": false,
       "tool_count": 4,
       "needs_state": false
     },
     "classified_at": "2026-01-21T10:05:00Z"
   }
   ```

5. **Update process state**
   ```json
   {
     "current_node": "01-classification",
     "completed_nodes": ["00-requirements"],
     "node_outputs": {
       "00-requirements": "requirements.json",
       "01-classification": "classification.json"
     }
   }
   ```

## Output

Create `workspace/classification.json`

## Exit Validation

Run: `bash exit-validation.sh`

### Success Criteria
- [ ] classification.json exists
- [ ] skill_type is valid (simple|standard|complex)
- [ ] confidence level recorded
- [ ] Process state updated

### Blocking Conditions
- Invalid skill type
- Missing classification file

## Next Node

On success → `02-structure`

## Error Handling

| Error | Action |
|-------|--------|
| Ambiguous classification | Ask user to confirm |
| Invalid type specified | Default to 'standard' |

## Example Output

```json
{
  "skill_type": "standard",
  "confidence": "high",
  "indicators": {
    "has_patterns": true,
    "has_phases": false,
    "tool_count": 4,
    "needs_state": false,
    "user_selected": "standard"
  },
  "reasoning": "User selected standard type; has 2 patterns defined",
  "classified_at": "2026-01-21T10:05:00Z"
}
```
