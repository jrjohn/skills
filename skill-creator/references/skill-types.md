# Skill Types Reference

## Overview

Skills are categorized into three types based on complexity and requirements.

## Type Comparison

| Aspect | Simple | Standard | Complex |
|--------|--------|----------|---------|
| **File Count** | 3-5 | 8-15 | 20+ |
| **State Management** | No | No | Yes |
| **Multiple Phases** | No | No | Yes |
| **Patterns/Templates** | No | Yes | Yes |
| **Recovery Needed** | No | No | Yes |
| **COR Protocol** | No | No | Yes |
| **AFP Protocol** | No | No | Yes |
| **NTP Protocol** | No | No | Yes |

## Simple Skills

### Characteristics

- Single-function utilities
- Stateless operations
- No workflow phases
- Quick transformations

### When to Use

- One-time actions
- Simple conversions
- Quick lookups
- Basic validations

### Structure

```
simple-skill/
├── SKILL.md      # Main definition
└── README.md     # User docs
```

### Example Use Cases

- JSON formatter
- Unit converter
- Code snippet generator
- Quick calculator

## Standard Skills

### Characteristics

- Pattern-based workflows
- Multiple templates
- Reference documentation
- Checklists and validations

### When to Use

- Repeatable processes
- Template-driven output
- Multiple output variations
- Reference-heavy operations

### Structure

```
standard-skill/
├── SKILL.md        # Main definition
├── README.md       # User docs
├── examples.md     # Usage examples
├── patterns/       # Pattern templates
├── checklists/     # Validation lists
└── references/     # Reference docs
```

### Example Use Cases

- Code generators
- Documentation writers
- API integrators
- Report generators

## Complex Skills

### Characteristics

- Multi-phase workflows
- State persistence
- Recovery mechanisms
- Gated transitions

### When to Use

- Long-running processes
- Multi-step workflows
- Critical operations
- User interaction required

### Structure

```
complex-skill/
├── SKILL.md                    # COR entry point
├── README.md                   # User docs
├── process/                    # COR nodes
│   ├── 00-init/
│   │   ├── README.md
│   │   └── exit-validation.sh
│   └── ...
├── workspace-template/         # AFP state
│   └── current-process.json
├── frameworks/                 # Protocols
│   ├── cor/
│   ├── afp/
│   └── ntp/
├── templates/                  # Output templates
├── validators/                 # Validation scripts
└── references/                 # Reference docs
```

### Example Use Cases

- Multi-file generators
- Workflow automation
- Document processing
- Integration pipelines

## Decision Matrix

Use this matrix to determine skill type:

| Question | Simple | Standard | Complex |
|----------|:------:|:--------:|:-------:|
| Single action? | ✓ | | |
| Needs patterns? | | ✓ | ✓ |
| Multiple phases? | | | ✓ |
| Needs recovery? | | | ✓ |
| User interaction? | | maybe | ✓ |
| Long-running? | | | ✓ |

## Migration Paths

### Simple → Standard

When a simple skill needs:
- Multiple output variations
- Pattern templates
- Reference documentation

### Standard → Complex

When a standard skill needs:
- State management
- Recovery mechanisms
- Multi-phase workflow
- Progress tracking

## Type Detection

The skill-creator can auto-detect type based on:

1. **Explicit Selection**: User chooses type
2. **Feature Analysis**:
   - Has phases defined → Complex
   - Has patterns defined → Standard
   - Default → Simple
3. **Tool Requirements**:
   - Many tools → Suggests higher complexity
   - TodoWrite → Suggests workflow
   - AskUserQuestion → Suggests interaction
