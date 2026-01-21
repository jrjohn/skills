# Naming Conventions Reference

## Skill Names

### Format

```
lowercase-with-dashes
```

### Rules

| Rule | Valid | Invalid |
|------|-------|---------|
| Lowercase only | `my-skill` | `My-Skill` |
| Dashes for spaces | `code-generator` | `code_generator` |
| Start with letter | `a-skill` | `1-skill` |
| End with letter/number | `skill-v2` | `skill-` |
| No consecutive dashes | `my-skill` | `my--skill` |
| 2-50 characters | `ab` to `fifty-chars...` | `a` or >50 |

### Regex Pattern

```regex
^[a-z][a-z0-9-]*[a-z0-9]$|^[a-z]$
```

### Examples

| Good | Bad | Reason |
|------|-----|--------|
| `json-formatter` | `JsonFormatter` | No uppercase |
| `api-v2` | `api_v2` | Use dashes |
| `doc-gen` | `doc--gen` | No double dashes |
| `my-tool` | `-my-tool` | Start with letter |

## File Names

### Core Files

| File | Case | Extension |
|------|------|-----------|
| `SKILL.md` | UPPERCASE | `.md` |
| `README.md` | UPPERCASE | `.md` |
| `manifest.json` | lowercase | `.json` |
| `examples.md` | lowercase | `.md` |

### Script Files

| File | Case | Extension |
|------|------|-----------|
| `exit-validation.sh` | lowercase-dashes | `.sh` |
| `recover-state.js` | lowercase-dashes | `.js` |
| `node-transition.js` | lowercase-dashes | `.js` |
| `validate-structure.js` | lowercase-dashes | `.js` |

### Template Files

| File | Pattern |
|------|---------|
| Templates | `{name}.template` |
| Example | `SKILL.md.template` |

## Directory Names

### Standard Directories

| Directory | Case |
|-----------|------|
| `process` | lowercase |
| `templates` | lowercase |
| `frameworks` | lowercase |
| `validators` | lowercase |
| `references` | lowercase |
| `patterns` | lowercase |
| `checklists` | lowercase |
| `workspace-template` | lowercase-dashes |

### Process Node Directories

Format: `{index:02d}-{name}`

| Node | Name |
|------|------|
| First | `00-requirements` |
| Second | `01-classification` |
| Third | `02-structure` |
| etc. | `{nn}-{descriptive-name}` |

### Rules for Node Names

- Two-digit prefix: `00`, `01`, `02`, ...
- Hyphen separator
- Lowercase descriptive name
- Keep names short but meaningful

## Variable Names

### Template Variables

Format: `{{UPPERCASE_UNDERSCORE}}`

| Variable | Example Value |
|----------|---------------|
| `{{SKILL_NAME}}` | `my-skill` |
| `{{SKILL_DISPLAY_NAME}}` | `My Skill` |
| `{{SKILL_DESCRIPTION}}` | `A skill for...` |
| `{{SKILL_TYPE}}` | `standard` |
| `{{GENERATED_DATE}}` | `2026-01-21` |
| `{{VERSION}}` | `1.0.0` |

### JSON Keys

Format: `snake_case`

```json
{
  "skill_name": "my-skill",
  "skill_type": "standard",
  "target_directory": "/path/to/skill",
  "completed_nodes": []
}
```

## Display Names

### Format

Title Case with spaces

### Derivation

| Skill Name | Display Name |
|------------|--------------|
| `my-skill` | `My Skill` |
| `code-generator` | `Code Generator` |
| `api-v2-client` | `Api V2 Client` |

### Algorithm

```javascript
function toDisplayName(skillName) {
  return skillName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```

## Version Numbers

### Format

Semantic Versioning: `MAJOR.MINOR.PATCH`

| Component | Increment When |
|-----------|----------------|
| MAJOR | Breaking changes |
| MINOR | New features |
| PATCH | Bug fixes |

### Examples

| Version | Meaning |
|---------|---------|
| `1.0.0` | Initial release |
| `1.1.0` | New feature added |
| `1.1.1` | Bug fix |
| `2.0.0` | Breaking change |

## Common Mistakes

| Mistake | Correction |
|---------|------------|
| `MySkill` | `my-skill` |
| `my skill` | `my-skill` |
| `my_skill` | `my-skill` |
| `MY-SKILL` | `my-skill` |
| `skill.md` | `SKILL.md` |
| `Readme.md` | `README.md` |
| `1-init` | `01-init` |
