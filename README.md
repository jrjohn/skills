# Claude Code Skills

A collection of custom skills for Claude Code.

## What are Skills?

Skills are specialized capabilities that extend Claude Code's functionality. They provide domain-specific knowledge, workflows, and tools that can be invoked via slash commands.

## Available Skills

| Skill | Description | Command |
|-------|-------------|---------|
| [skill-creator](./skill-creator/) | Meta-skill for creating standardized skills following the COR-AFP-NTP protocol | `/skill-creator` |

## Installation

Copy the desired skill directory to your Claude Code skills folder:

```bash
cp -r skill-creator ~/.claude/skills/
```

## Usage

Once installed, invoke any skill using its slash command:

```
/skill-creator
```

## Skill Types

Skills in this repository follow three complexity levels:

- **Simple**: Single-function utilities (3-5 files)
- **Standard**: Tools with patterns and checklists (8-15 files)
- **Complex**: Multi-phase workflows with state management (20+ files)

## COR-AFP-NTP Protocol

Complex skills follow a standardized protocol:

- **COR** (Chain of Repository): Sequential node-based workflow
- **AFP** (Anti-Fragile Protocol): State persistence and recovery
- **NTP** (Node Transition Protocol): Gated transitions between nodes

## Contributing

To add a new skill:

1. Use the `skill-creator` skill to generate the initial structure
2. Implement your skill logic following the appropriate complexity template
3. Test thoroughly
4. Submit a pull request

## License

MIT
