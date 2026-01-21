# Node 00: Requirements Collection

> **COR Node**: First node in skill creation workflow

## Purpose

Collect all necessary information about the skill to be created.

## Entry Conditions

- Skill creator invoked
- No existing session OR user wants new skill

## Questions to Ask

### Required Questions

Use `AskUserQuestion` to gather:

#### 1. Skill Name
```
Question: What would you like to name your skill?
Header: Skill Name
Options:
- (User enters custom name)
Validation: lowercase-with-dashes, no spaces
```

#### 2. Skill Purpose
```
Question: What is the primary purpose of this skill?
Header: Purpose
Options:
- (User describes functionality)
```

#### 3. Target Users
```
Question: Who will use this skill?
Header: Users
Options:
- Developers
- Designers
- Project Managers
- Mixed/All
```

#### 4. Workflow Type
```
Question: What type of workflow does this skill need?
Header: Workflow
Options:
- Single action (Simple)
- Pattern-based with references (Standard)
- Multi-phase with state tracking (Complex)
```

#### 5. Tools Required
```
Question: Which tools should this skill have access to?
Header: Tools
MultiSelect: true
Options:
- Read (file reading)
- Write (file creation)
- Edit (file modification)
- Bash (command execution)
- Glob (file search)
- Grep (content search)
- WebFetch (URL fetching)
- AskUserQuestion (user interaction)
- TodoWrite (task tracking)
```

### Optional Questions (Based on Workflow Type)

#### For Standard/Complex:
```
Question: What patterns or checklists should be included?
Header: Patterns
```

#### For Complex:
```
Question: What are the main workflow phases?
Header: Phases
Example: "init → process → validate → output"
```

## Output

Create `workspace/requirements.json`:

```json
{
  "skill_name": "example-skill",
  "skill_display_name": "Example Skill",
  "skill_description": "A skill that does X",
  "target_users": ["developers"],
  "workflow_type": "standard",
  "allowed_tools": ["Read", "Write", "Bash"],
  "patterns": ["pattern-a", "pattern-b"],
  "phases": [],
  "collected_at": "2026-01-21T10:00:00Z"
}
```

## Actions

1. **Initialize workspace** (if new session)
   ```bash
   mkdir -p ~/.claude/skills/skill-creator/workspace
   ```

2. **Ask questions** using AskUserQuestion tool

3. **Validate responses**
   - Skill name follows naming convention
   - At least one tool selected
   - Workflow type specified

4. **Save requirements** to workspace/requirements.json

5. **Update process state**
   ```json
   {
     "current_node": "00-requirements",
     "completed_nodes": [],
     "node_outputs": {
       "00-requirements": "requirements.json"
     }
   }
   ```

## Exit Validation

Run: `bash exit-validation.sh`

### Success Criteria
- [ ] workspace/requirements.json exists
- [ ] skill_name is not empty
- [ ] skill_name follows naming convention (lowercase-with-dashes)
- [ ] skill_description is not empty
- [ ] workflow_type is valid (simple|standard|complex)
- [ ] allowed_tools has at least one entry

### Blocking Conditions
- Missing required fields
- Invalid skill name format
- No tools selected

## Next Node

On success → `01-classification`

## Error Handling

| Error | Action |
|-------|--------|
| User cancels | Save partial state, allow resume |
| Invalid name | Re-ask with format guidance |
| Empty description | Re-ask with examples |

## Example Interaction

```
AI: I'll help you create a new skill. Let me gather some information.

AI: What would you like to name your skill?
User: document-generator

AI: What is the primary purpose of this skill?
User: Generate technical documentation from code

AI: Who will use this skill?
User: Developers

AI: What type of workflow does this skill need?
- Single action (Simple)
- Pattern-based with references (Standard)
- Multi-phase with state tracking (Complex)
User: Standard

AI: Which tools should this skill have access to?
User: Read, Write, Grep, Bash

AI: Requirements collected. Proceeding to classification...
```
