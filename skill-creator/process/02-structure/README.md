# Node 02: Structure Generation

> **COR Node**: Creates directory structure for the new skill

## Purpose

Generate the appropriate directory structure based on skill type classification.

## Entry Conditions

- Node 01 (classification) completed
- `workspace/classification.json` exists
- Skill type determined

## Structure Templates

### Simple Structure

```
{skill-name}/
├── SKILL.md          # Main skill file
└── README.md         # User documentation
```

### Standard Structure

```
{skill-name}/
├── SKILL.md          # Main skill file
├── README.md         # User documentation
├── examples.md       # Usage examples
├── patterns/         # Pattern definitions
│   └── .gitkeep
├── checklists/       # Validation checklists
│   └── .gitkeep
└── references/       # Reference documentation
    └── .gitkeep
```

### Complex Structure

```
{skill-name}/
├── SKILL.md                    # COR entry point
├── README.md                   # User documentation
├── process/                    # COR nodes
│   ├── 00-{first-node}/
│   │   ├── README.md
│   │   └── exit-validation.sh
│   └── ...
├── workspace-template/         # AFP state template
│   └── current-process.json
├── frameworks/                 # COR-AFP-NTP
│   ├── cor/
│   │   └── README.md
│   ├── afp/
│   │   ├── README.md
│   │   └── recover-state.js
│   └── ntp/
│       ├── README.md
│       └── node-transition.js
├── templates/                  # Output templates
│   └── .gitkeep
├── validators/                 # Validation scripts
│   └── .gitkeep
└── references/                 # Reference docs
    └── .gitkeep
```

## Actions

1. **Read classification and requirements**
   ```bash
   cat workspace/classification.json
   cat workspace/requirements.json
   ```

2. **Determine target directory**
   - Default: `~/.claude/skills/{skill-name}/`
   - Ask user if different location needed

3. **Create directory structure**
   ```bash
   # Example for standard type
   SKILL_DIR="$HOME/.claude/skills/$SKILL_NAME"
   mkdir -p "$SKILL_DIR"/{patterns,checklists,references}
   ```

4. **Create placeholder files**
   - `.gitkeep` in empty directories
   - Placeholder SKILL.md and README.md

5. **Create structure.json**
   ```json
   {
     "skill_name": "my-skill",
     "skill_type": "standard",
     "target_directory": "/Users/user/.claude/skills/my-skill",
     "created_directories": [
       "patterns",
       "checklists",
       "references"
     ],
     "created_files": [
       "SKILL.md",
       "README.md"
     ],
     "structure_created_at": "2026-01-21T10:10:00Z"
   }
   ```

6. **Update process state**

## Directory Creation Script

```bash
#!/bin/bash
# create-structure.sh

SKILL_NAME="$1"
SKILL_TYPE="$2"
BASE_DIR="${3:-$HOME/.claude/skills}"
SKILL_DIR="$BASE_DIR/$SKILL_NAME"

# Create base directory
mkdir -p "$SKILL_DIR"

case "$SKILL_TYPE" in
  simple)
    # Simple: just base directory
    touch "$SKILL_DIR/SKILL.md"
    touch "$SKILL_DIR/README.md"
    ;;

  standard)
    # Standard: add patterns and references
    mkdir -p "$SKILL_DIR"/{patterns,checklists,references}
    touch "$SKILL_DIR/SKILL.md"
    touch "$SKILL_DIR/README.md"
    touch "$SKILL_DIR/examples.md"
    touch "$SKILL_DIR/patterns/.gitkeep"
    touch "$SKILL_DIR/checklists/.gitkeep"
    touch "$SKILL_DIR/references/.gitkeep"
    ;;

  complex)
    # Complex: full COR-AFP-NTP structure
    mkdir -p "$SKILL_DIR"/process
    mkdir -p "$SKILL_DIR"/workspace-template
    mkdir -p "$SKILL_DIR"/frameworks/{cor,afp,ntp}
    mkdir -p "$SKILL_DIR"/{templates,validators,references}
    touch "$SKILL_DIR/SKILL.md"
    touch "$SKILL_DIR/README.md"
    touch "$SKILL_DIR/workspace-template/current-process.json"
    touch "$SKILL_DIR/frameworks/cor/README.md"
    touch "$SKILL_DIR/frameworks/afp/README.md"
    touch "$SKILL_DIR/frameworks/ntp/README.md"
    ;;
esac

echo "Structure created at: $SKILL_DIR"
```

## Exit Validation

Run: `bash exit-validation.sh`

### Success Criteria
- [ ] Target directory exists
- [ ] All required subdirectories exist for type
- [ ] SKILL.md placeholder exists
- [ ] README.md placeholder exists
- [ ] structure.json created

### Blocking Conditions
- Directory creation failed
- Insufficient permissions
- Directory already exists (ask to overwrite)

## Next Node

On success → `03-templates`

## Error Handling

| Error | Action |
|-------|--------|
| Directory exists | Ask user: overwrite, merge, or rename |
| Permission denied | Report and suggest alternative |
| Disk full | Report error |

## Example Output

```json
{
  "skill_name": "document-generator",
  "skill_type": "standard",
  "target_directory": "/Users/user/.claude/skills/document-generator",
  "created_directories": [
    "patterns",
    "checklists",
    "references"
  ],
  "created_files": [
    "SKILL.md",
    "README.md",
    "examples.md",
    "patterns/.gitkeep",
    "checklists/.gitkeep",
    "references/.gitkeep"
  ],
  "structure_created_at": "2026-01-21T10:10:00Z"
}
```
