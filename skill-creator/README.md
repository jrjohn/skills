# Skill Creator

A meta-skill for creating standardized Claude Code skills following the COR-AFP-NTP protocol.

## Overview

Skill Creator helps you build new skills with proper structure, documentation, and protocols based on complexity:

- **Simple Skills**: Quick, single-purpose tools (3-5 files)
- **Standard Skills**: Tools with patterns and checklists (8-15 files)
- **Complex Skills**: Multi-phase workflows with state management (20+ files)

## Usage

### Invoke the Skill

```
/skill-creator
```

### Follow the Guided Process

1. **Requirements** - Describe your skill's purpose
2. **Classification** - System determines skill type
3. **Structure** - Directories are created
4. **Templates** - Files are generated
5. **Framework** - COR/AFP/NTP configured (Complex only)
6. **Validation** - Structure verified
7. **Finalize** - Documentation completed

## Skill Types

### Simple

Best for:
- Single-function utilities
- Stateless operations
- Quick transformations

Generated structure:
```
skill-name/
├── SKILL.md
└── README.md
```

### Standard

Best for:
- Tools with multiple patterns
- Checklist-based workflows
- Reference-heavy skills

Generated structure:
```
skill-name/
├── SKILL.md
├── README.md
├── examples.md
├── patterns/
│   └── *.md
└── checklists/
    └── *.md
```

### Complex

Best for:
- Multi-phase workflows
- State-dependent processes
- Recovery-critical operations

Generated structure:
```
skill-name/
├── SKILL.md
├── README.md
├── process/
│   ├── 00-node/
│   │   ├── README.md
│   │   └── exit-validation.sh
│   └── ...
├── workspace-template/
│   └── current-process.json
├── frameworks/
│   ├── cor/
│   ├── afp/
│   └── ntp/
└── references/
```

## COR-AFP-NTP Protocol

### COR (Chain of Repository)

Sequential node-based workflow:
- Each node has specific purpose
- Nodes execute in order
- Each node has exit validation

### AFP (Anti-Fragile Protocol)

State persistence and recovery:
- Session state saved to JSON
- Automatic recovery on resume
- No progress loss on interruption

### NTP (Node Transition Protocol)

Gated transitions between nodes:
- Exit validation must pass
- Clear success/failure criteria
- Blocking on validation failure

## Examples

### Create a Simple Skill

```
User: /skill-creator
AI: What skill would you like to create?
User: A skill that formats JSON files
AI: [Classifies as Simple, generates basic structure]
```

### Create a Complex Skill

```
User: /skill-creator
AI: What skill would you like to create?
User: A skill for IEC 62304 compliant medical software documentation
AI: [Classifies as Complex, generates full COR-AFP-NTP structure]
```

## Resuming Sessions

If interrupted, simply invoke the skill again:

```
/skill-creator
```

The system will detect the existing session and resume from the last completed node.

## Manual Operations

### Check Session Status
```bash
cat ~/.claude/skills/skill-creator/workspace/current-process.json
```

### Reset Session
```bash
rm -rf ~/.claude/skills/skill-creator/workspace/
```

### Validate Generated Skill
```bash
node ~/.claude/skills/skill-creator/validators/validate-structure.js /path/to/skill
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Skill not starting | Check SKILL.md exists |
| Resume not working | Verify workspace/current-process.json |
| Validation failing | Run exit-validation.sh manually |
| Template errors | Check templates/ directory |

## Contributing

To improve skill-creator:

1. Modify templates in `templates/`
2. Update node logic in `process/*/README.md`
3. Enhance validators in `validators/`
4. Add references in `references/`

## Version

- **Current**: 1.0.0
- **Date**: 2026-01-21
- **Protocol**: COR-AFP-NTP v1
