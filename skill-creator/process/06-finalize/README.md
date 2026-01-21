# Node 06: Finalize

> **COR Node**: Complete skill creation and generate final report

## Purpose

Finalize the skill creation process, generate documentation, and provide usage instructions.

## Entry Conditions

- Node 05 (validation) completed
- All validations passed

## Actions

### 1. Enhance Documentation

**Update README.md with:**
- Final usage examples
- Configuration instructions
- Troubleshooting section

**Update SKILL.md with:**
- Version information
- Creation date
- Any generated metadata

### 2. Make Scripts Executable

```bash
# For complex skills
find $TARGET_DIR -name "*.sh" -exec chmod +x {} \;
find $TARGET_DIR -name "*.js" -exec chmod +x {} \;
```

### 3. Create Skill Manifest

Generate `manifest.json` in skill directory:

```json
{
  "name": "document-generator",
  "display_name": "Document Generator",
  "description": "Generate technical documentation from code",
  "version": "1.0.0",
  "type": "standard",
  "created_at": "2026-01-21T10:30:00Z",
  "created_by": "skill-creator",
  "protocol": "COR-AFP-NTP",
  "allowed_tools": ["Read", "Write", "Glob", "Grep"],
  "entry_point": "SKILL.md",
  "files": {
    "core": ["SKILL.md", "README.md"],
    "patterns": [],
    "references": []
  }
}
```

### 4. Clean Up Workspace

```bash
# Archive workspace to skill's history
mkdir -p $TARGET_DIR/.skill-creator-history
cp -r $WORKSPACE_DIR/* $TARGET_DIR/.skill-creator-history/

# Clean workspace
rm -rf $WORKSPACE_DIR
```

### 5. Generate Completion Report

Create final report showing:
- Skill name and type
- Files created
- Next steps
- How to invoke

### 6. Create finalize.json

```json
{
  "skill_name": "document-generator",
  "skill_type": "standard",
  "target_directory": "/Users/user/.claude/skills/document-generator",
  "files_created": [
    "SKILL.md",
    "README.md",
    "examples.md",
    "manifest.json"
  ],
  "scripts_made_executable": [],
  "workspace_archived": true,
  "finalized_at": "2026-01-21T10:30:00Z"
}
```

## Completion Report Template

```
╔══════════════════════════════════════════════════════════════════╗
║                    SKILL CREATION COMPLETE                       ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  Skill Name:     {{SKILL_NAME}}                                  ║
║  Display Name:   {{SKILL_DISPLAY_NAME}}                          ║
║  Type:           {{SKILL_TYPE}}                                  ║
║  Location:       {{TARGET_DIRECTORY}}                            ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║  FILES CREATED                                                   ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  Core Files:                                                     ║
║    ✓ SKILL.md       - Main skill definition                      ║
║    ✓ README.md      - User documentation                         ║
║    ✓ manifest.json  - Skill manifest                             ║
║                                                                  ║
║  {{TYPE_SPECIFIC_FILES}}                                         ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║  NEXT STEPS                                                      ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  1. Review generated files in:                                   ║
║     {{TARGET_DIRECTORY}}                                         ║
║                                                                  ║
║  2. Customize SKILL.md with your specific logic                  ║
║                                                                  ║
║  3. Add patterns/templates as needed                             ║
║                                                                  ║
║  4. Test the skill:                                              ║
║     /{{SKILL_NAME}}                                              ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║  INVOKE YOUR SKILL                                               ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  User: /{{SKILL_NAME}}                                           ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

## Exit Validation

Run: `bash exit-validation.sh`

### Success Criteria
- [ ] manifest.json created
- [ ] All scripts executable (Complex)
- [ ] Workspace archived
- [ ] finalize.json created
- [ ] Completion report generated

### This is the Final Node

No next node - skill creation is complete.

## Post-Completion

After finalization:

1. **User can invoke skill**: `/skill-name`
2. **User can customize**: Edit files directly
3. **User can extend**: Add patterns, phases, etc.

## Error Handling

| Error | Action |
|-------|--------|
| Cannot make executable | Warn user, continue |
| Archive failed | Warn user, continue |
| Manifest creation failed | Report error |

## Session Complete

The COR chain is complete. Mark session as finished:

```json
{
  "session_id": "uuid",
  "status": "completed",
  "completed_at": "2026-01-21T10:30:00Z",
  "skill_created": "document-generator",
  "skill_location": "/Users/user/.claude/skills/document-generator"
}
```
