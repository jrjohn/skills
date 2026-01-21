# Skill Development Best Practices

## General Principles

### 1. Single Responsibility

Each skill should do one thing well.

**Good:**
- `json-formatter` - Formats JSON
- `code-linter` - Lints code

**Bad:**
- `json-formatter-and-linter` - Does too much

### 2. Clear Documentation

Every skill must have:
- Purpose statement
- Usage instructions
- Examples
- Troubleshooting guide

### 3. Fail Fast

Validate inputs early and provide clear error messages.

```javascript
// Good
if (!input.name) {
  throw new Error('name is required');
}

// Bad
// Continue with undefined name...
```

### 4. Idempotence

Running a skill twice should produce the same result.

## SKILL.md Best Practices

### YAML Frontmatter

Always include:
```yaml
---
name: skill-name
description: Clear, concise description
version: 1.0.0
allowed-tools:
  - Read
  - Write
---
```

### Structure

1. Title with description
2. Purpose section
3. Usage/Quick Start
4. Examples
5. Reference sections
6. Error handling

### Tool Selection

Only request tools actually needed:

| Tool | When to Include |
|------|-----------------|
| Read | Reading files |
| Write | Creating files |
| Edit | Modifying files |
| Bash | Running commands |
| Glob | Finding files |
| Grep | Searching content |
| WebFetch | External URLs |
| AskUserQuestion | User input needed |
| TodoWrite | Task tracking |

## Complex Skill Best Practices

### COR (Chain of Repository)

1. **Sequential Numbering**: Always use `00-`, `01-`, etc.
2. **Descriptive Names**: `00-requirements` not `00-step1`
3. **Clear Gates**: Define what must pass before proceeding
4. **No Skips**: Don't skip nodes in the chain

### AFP (Anti-Fragile Protocol)

1. **Save Often**: Update state after every significant action
2. **Validate State**: Check state integrity before using
3. **Recovery Path**: Always provide way to recover
4. **Clean Cleanup**: Remove workspace on completion

### NTP (Node Transition Protocol)

1. **Exit Validation**: Every node must have validation
2. **Clear Errors**: Explain why validation failed
3. **Actionable**: Tell user how to fix issues
4. **Fast Checks**: Validations should be quick

## Template Best Practices

### Variable Naming

```
{{SKILL_NAME}}        # Lowercase with dashes
{{SKILL_DISPLAY_NAME}} # Title Case
{{SKILL_DESCRIPTION}}  # Full sentence
```

### Placeholder Content

Use meaningful placeholders:

```markdown
## Purpose

[Describe what this skill does and why it's useful]
```

Not:

```markdown
## Purpose

TODO
```

### Template Testing

Always test templates with real values before finalizing.

## Validation Best Practices

### Structure Validation

Check:
- Required files exist
- Required directories exist
- Files are not empty
- JSON files are valid

### Documentation Validation

Check:
- YAML frontmatter present
- Required sections exist
- Minimum content length
- Examples provided

### Exit Validation Scripts

```bash
#!/bin/bash
set -e  # Exit on error

# Check 1: Descriptive name
echo -n "Checking something... "
if [ ! condition ]; then
    echo "FAILED"
    echo "  Error: Clear explanation"
    exit 1
fi
echo "OK"
```

## Error Handling

### User-Facing Errors

```
Error: Could not find requirements.json

Expected: workspace/requirements.json
Action: Run node 00-requirements first
```

### Logging

- Use consistent prefixes
- Include timestamps for long operations
- Log success and failure

### Recovery

Always provide:
1. Clear error message
2. Cause of error
3. Steps to fix
4. Alternative approaches

## Testing

### Manual Testing

1. Create a test skill of each type
2. Verify structure
3. Test all workflows
4. Test error cases
5. Test recovery

### Automated Testing

```bash
# Run all validators
node validators/validate-all.js /path/to/skill
```

### Test Cases

| Test | Expected |
|------|----------|
| Create simple skill | Basic structure |
| Create standard skill | With patterns |
| Create complex skill | Full COR-AFP-NTP |
| Resume interrupted | Continues from state |
| Invalid input | Clear error |

## Performance

### Keep Skills Fast

- Minimize file operations
- Cache when appropriate
- Avoid unnecessary validations

### Large Files

- Split large reference files
- Use lazy loading
- Index for search

## Security

### Never Include

- API keys
- Passwords
- Private data
- User credentials

### Safe Practices

- Validate all inputs
- Sanitize file paths
- Use safe shell practices
- Don't execute untrusted code

## Maintenance

### Version Updates

1. Update version in frontmatter
2. Document changes
3. Test thoroughly
4. Update dependencies

### Deprecation

1. Mark as deprecated
2. Provide migration path
3. Keep working for transition period
4. Eventually remove
