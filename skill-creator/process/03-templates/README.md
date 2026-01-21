# Node 03: Template Application

> **COR Node**: Applies templates and substitutes variables

## Purpose

Populate the created structure with appropriate content from templates.

## Entry Conditions

- Node 02 (structure) completed
- Directory structure exists
- `workspace/structure.json` exists

## Template System

### Variable Substitution

| Variable | Source | Example |
|----------|--------|---------|
| `{{SKILL_NAME}}` | requirements.json | my-awesome-skill |
| `{{SKILL_DISPLAY_NAME}}` | requirements.json | My Awesome Skill |
| `{{SKILL_DESCRIPTION}}` | requirements.json | A skill for... |
| `{{SKILL_TYPE}}` | classification.json | standard |
| `{{ALLOWED_TOOLS}}` | requirements.json | Read, Write, Bash |
| `{{GENERATED_DATE}}` | System | 2026-01-21 |
| `{{VERSION}}` | Default | 1.0.0 |
| `{{NODES}}` | requirements.json (complex) | 00-init, 01-process |

### Template Locations

```
templates/
├── simple/
│   ├── SKILL.md.template
│   └── README.md.template
├── standard/
│   ├── SKILL.md.template
│   ├── README.md.template
│   └── examples.md.template
└── complex/
    ├── SKILL.md.template
    ├── SKILL-cor.md.template
    ├── README.md.template
    └── process/
        ├── node-README.md.template
        └── exit-validation.sh.template
```

## Actions

1. **Read requirements and classification**
   ```bash
   cat workspace/requirements.json
   cat workspace/classification.json
   cat workspace/structure.json
   ```

2. **Load appropriate templates**
   Based on skill_type, load from:
   - Simple: `templates/simple/`
   - Standard: `templates/standard/`
   - Complex: `templates/complex/`

3. **Prepare substitution map**
   ```json
   {
     "SKILL_NAME": "document-generator",
     "SKILL_DISPLAY_NAME": "Document Generator",
     "SKILL_DESCRIPTION": "Generate technical documentation",
     "SKILL_TYPE": "standard",
     "ALLOWED_TOOLS": "Read, Write, Glob, Grep",
     "GENERATED_DATE": "2026-01-21",
     "VERSION": "1.0.0"
   }
   ```

4. **Apply templates**
   - Read each .template file
   - Replace all `{{VARIABLE}}` placeholders
   - Write to target directory (without .template extension)

5. **For Complex type**: Generate process nodes
   - Create README.md for each phase
   - Create exit-validation.sh for each phase
   - Update COR chain references

6. **Create templates.json**
   ```json
   {
     "skill_type": "standard",
     "templates_applied": [
       "SKILL.md",
       "README.md",
       "examples.md"
     ],
     "substitutions": {
       "SKILL_NAME": "document-generator",
       "SKILL_DISPLAY_NAME": "Document Generator"
     },
     "templates_applied_at": "2026-01-21T10:15:00Z"
   }
   ```

## Template Processing Script

```javascript
// process-template.js
const fs = require('fs');
const path = require('path');

function processTemplate(templatePath, substitutions) {
  let content = fs.readFileSync(templatePath, 'utf8');

  for (const [key, value] of Object.entries(substitutions)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    content = content.replace(regex, value);
  }

  return content;
}

function applyTemplates(skillType, targetDir, substitutions) {
  const templateDir = path.join(__dirname, '..', 'templates', skillType);
  const files = fs.readdirSync(templateDir);

  for (const file of files) {
    if (file.endsWith('.template')) {
      const templatePath = path.join(templateDir, file);
      const targetFile = file.replace('.template', '');
      const targetPath = path.join(targetDir, targetFile);

      const content = processTemplate(templatePath, substitutions);
      fs.writeFileSync(targetPath, content);

      console.log(`Applied: ${targetFile}`);
    }
  }
}
```

## Exit Validation

Run: `bash exit-validation.sh`

### Success Criteria
- [ ] SKILL.md has content (not placeholder)
- [ ] README.md has content (not placeholder)
- [ ] No remaining {{VARIABLE}} placeholders
- [ ] All .template files processed
- [ ] templates.json created

### Blocking Conditions
- Template file missing
- Variable not substituted
- Write permission denied

## Next Node

On success → `04-framework`

## Error Handling

| Error | Action |
|-------|--------|
| Template not found | Use default template |
| Variable missing | Leave placeholder, warn user |
| Write failed | Report and retry |

## Example Output

```json
{
  "skill_type": "standard",
  "target_directory": "/Users/user/.claude/skills/document-generator",
  "templates_applied": [
    "SKILL.md",
    "README.md",
    "examples.md"
  ],
  "substitutions": {
    "SKILL_NAME": "document-generator",
    "SKILL_DISPLAY_NAME": "Document Generator",
    "SKILL_DESCRIPTION": "Generate technical documentation from code",
    "SKILL_TYPE": "standard",
    "ALLOWED_TOOLS": "Read, Write, Glob, Grep",
    "GENERATED_DATE": "2026-01-21",
    "VERSION": "1.0.0"
  },
  "warnings": [],
  "templates_applied_at": "2026-01-21T10:15:00Z"
}
```
