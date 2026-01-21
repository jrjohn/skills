# AFP Framework (Anti-Fragile Protocol)

## Overview

AFP (Anti-Fragile Protocol) provides state persistence and recovery for complex skills.

## Principles

1. **State Persistence**: All progress is saved to workspace
2. **Crash Recovery**: Sessions can resume after interruption
3. **Health Monitoring**: Quick checks verify state integrity
4. **Graceful Degradation**: Partial failures don't lose all progress

## Workspace Structure

```
workspace/
├── current-process.json    # Main state file
├── requirements.json       # Node 00 output
├── classification.json     # Node 01 output
├── ...                     # Other node outputs
└── history/                # State history (optional)
```

## State Schema

### current-process.json

```json
{
  "session_id": "uuid-v4",
  "current_node": "01-classification",
  "skill_name": "my-skill",
  "skill_type": "standard",
  "target_directory": "/path/to/skill",
  "started_at": "2026-01-21T10:00:00Z",
  "updated_at": "2026-01-21T10:15:00Z",
  "completed_nodes": ["00-requirements"],
  "node_outputs": {
    "00-requirements": "requirements.json"
  },
  "metadata": {
    "creator_version": "1.0.0",
    "protocol": "COR-AFP-NTP"
  }
}
```

## Recovery Operations

### Check State

```bash
cat workspace/current-process.json | jq .
```

### Verify Integrity

```bash
bash frameworks/afp/quick-health-check.sh
```

### Recover State

```javascript
const state = require('./recover-state.js');
const recoveredState = state.recover('./workspace');
```

### Reset Session

```bash
rm -rf workspace/
```

## State Transitions

```
[New Session]
    ↓
[Initialize State]
    ↓
[Node Execution] ←──┐
    ↓               │
[Save State]        │
    ↓               │
[Next Node?] ──Yes──┘
    ↓ No
[Complete]
```

## Best Practices

1. **Save Often**: Update state after every significant action
2. **Validate Before Save**: Ensure state is consistent
3. **Version State**: Include schema version for migrations
4. **Backup**: Archive completed sessions

## Integration with COR

AFP tracks COR progress:
- `current_node`: Which node is active
- `completed_nodes`: Which nodes are done
- `node_outputs`: Output file for each node

## Integration with NTP

AFP records NTP events:
- Gate validation results
- Transition timestamps
- Blocking conditions encountered

## Error Recovery

| Scenario | Recovery Action |
|----------|-----------------|
| Crash mid-node | Resume from current_node |
| Corrupted state | Reset and restart |
| Missing output | Re-run current node |
| Invalid state | Run health check, fix or reset |
