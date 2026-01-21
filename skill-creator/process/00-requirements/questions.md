# Requirements Questions Reference

Quick reference for gathering skill requirements.

## Question Flow

```
1. Name → 2. Purpose → 3. Users → 4. Workflow → 5. Tools → 6. Patterns (if needed)
```

## AskUserQuestion Configurations

### Q1: Skill Name

```json
{
  "question": "What would you like to name your skill?",
  "header": "Name",
  "options": [
    {"label": "Enter custom name", "description": "Use lowercase-with-dashes format (e.g., my-skill)"}
  ],
  "multiSelect": false
}
```

**Validation Rules:**
- Lowercase letters, numbers, dashes only
- Must start with letter
- Must end with letter or number
- No consecutive dashes
- Length: 2-50 characters

### Q2: Skill Purpose

```json
{
  "question": "What is the primary purpose of this skill?",
  "header": "Purpose",
  "options": [
    {"label": "Describe purpose", "description": "Brief description of what the skill does"}
  ],
  "multiSelect": false
}
```

### Q3: Target Users

```json
{
  "question": "Who will primarily use this skill?",
  "header": "Users",
  "options": [
    {"label": "Developers", "description": "Software engineers and programmers"},
    {"label": "Designers", "description": "UI/UX designers and product designers"},
    {"label": "Project Managers", "description": "PMs and project coordinators"},
    {"label": "Mixed/All", "description": "Multiple user types"}
  ],
  "multiSelect": true
}
```

### Q4: Workflow Type

```json
{
  "question": "What type of workflow does this skill need?",
  "header": "Workflow",
  "options": [
    {"label": "Simple", "description": "Single action, no state tracking (3-5 files)"},
    {"label": "Standard", "description": "Pattern-based with references (8-15 files)"},
    {"label": "Complex", "description": "Multi-phase workflow with state (20+ files, COR-AFP-NTP)"}
  ],
  "multiSelect": false
}
```

### Q5: Required Tools

```json
{
  "question": "Which tools should this skill have access to?",
  "header": "Tools",
  "options": [
    {"label": "Read", "description": "Read files from filesystem"},
    {"label": "Write", "description": "Create new files"},
    {"label": "Edit", "description": "Modify existing files"},
    {"label": "Bash", "description": "Execute shell commands"}
  ],
  "multiSelect": true
}
```

**Extended Tools (second question if needed):**
```json
{
  "question": "Any additional tools needed?",
  "header": "More Tools",
  "options": [
    {"label": "Glob", "description": "Search for files by pattern"},
    {"label": "Grep", "description": "Search file contents"},
    {"label": "WebFetch", "description": "Fetch URL content"},
    {"label": "AskUserQuestion", "description": "Interactive user prompts"}
  ],
  "multiSelect": true
}
```

### Q6: Patterns (Standard/Complex only)

```json
{
  "question": "What patterns or templates should be included?",
  "header": "Patterns",
  "options": [
    {"label": "Enter patterns", "description": "Comma-separated list of pattern names"}
  ],
  "multiSelect": false
}
```

### Q7: Workflow Phases (Complex only)

```json
{
  "question": "What are the main phases of your workflow?",
  "header": "Phases",
  "options": [
    {"label": "Enter phases", "description": "e.g., init, collect, process, validate, output"}
  ],
  "multiSelect": false
}
```

## Tool Categories

| Category | Tools | Use When |
|----------|-------|----------|
| File I/O | Read, Write, Edit | Almost always |
| Search | Glob, Grep | File/content search needed |
| Execution | Bash | Commands, scripts |
| Network | WebFetch, WebSearch | External resources |
| Interaction | AskUserQuestion | User input required |
| Planning | TodoWrite | Task management |

## Common Combinations

| Skill Type | Typical Tools |
|------------|---------------|
| Code Generator | Read, Write, Glob |
| Linter/Validator | Read, Grep, Bash |
| Documentation | Read, Write, Edit |
| API Integration | WebFetch, Write, Bash |
| Interactive Workflow | AskUserQuestion, TodoWrite, Read, Write |

## Validation Summary

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| skill_name | string | Yes | `^[a-z][a-z0-9-]*[a-z0-9]$` |
| skill_display_name | string | Yes | Non-empty |
| skill_description | string | Yes | Non-empty, min 10 chars |
| target_users | array | Yes | At least one |
| workflow_type | enum | Yes | simple\|standard\|complex |
| allowed_tools | array | Yes | At least one |
| patterns | array | No | For standard/complex |
| phases | array | No | For complex only |
