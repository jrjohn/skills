#!/usr/bin/env node
/**
 * AFP State Recovery Script
 * Recovers and validates skill creation session state
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = process.env.WORKSPACE_DIR ||
  path.join(process.env.HOME, '.claude/skills/skill-creator/workspace');

/**
 * Load and parse JSON file safely
 */
function loadJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Validate state structure
 */
function validateState(state) {
  const required = ['session_id', 'current_node', 'started_at', 'completed_nodes'];
  const missing = required.filter(field => !state[field]);

  if (missing.length > 0) {
    return {
      valid: false,
      errors: [`Missing required fields: ${missing.join(', ')}`]
    };
  }

  // Validate current_node format
  if (!/^[0-9]{2}-[a-z-]+$/.test(state.current_node)) {
    return {
      valid: false,
      errors: [`Invalid current_node format: ${state.current_node}`]
    };
  }

  // Validate completed_nodes is array
  if (!Array.isArray(state.completed_nodes)) {
    return {
      valid: false,
      errors: ['completed_nodes must be an array']
    };
  }

  return { valid: true, errors: [] };
}

/**
 * Verify node outputs exist
 */
function verifyOutputs(state) {
  const warnings = [];
  const nodeOutputs = state.node_outputs || {};

  for (const [node, outputFile] of Object.entries(nodeOutputs)) {
    const outputPath = path.join(WORKSPACE_DIR, outputFile);
    if (!fs.existsSync(outputPath)) {
      warnings.push(`Missing output for ${node}: ${outputFile}`);
    }
  }

  return warnings;
}

/**
 * Recover state from workspace
 */
function recoverState() {
  const statePath = path.join(WORKSPACE_DIR, 'current-process.json');

  // Check if workspace exists
  if (!fs.existsSync(WORKSPACE_DIR)) {
    return {
      success: false,
      error: 'Workspace directory does not exist',
      state: null
    };
  }

  // Check if state file exists
  if (!fs.existsSync(statePath)) {
    return {
      success: false,
      error: 'No session state found',
      state: null
    };
  }

  // Load state
  const state = loadJson(statePath);
  if (!state) {
    return {
      success: false,
      error: 'Failed to parse state file',
      state: null
    };
  }

  // Validate state
  const validation = validateState(state);
  if (!validation.valid) {
    return {
      success: false,
      error: `Invalid state: ${validation.errors.join('; ')}`,
      state: state
    };
  }

  // Verify outputs
  const warnings = verifyOutputs(state);

  return {
    success: true,
    state: state,
    warnings: warnings,
    resume_from: state.current_node,
    completed: state.completed_nodes
  };
}

/**
 * Get resumption instructions
 */
function getResumptionInstructions(state) {
  const instructions = [];

  instructions.push(`Session ID: ${state.session_id}`);
  instructions.push(`Started: ${state.started_at}`);
  instructions.push(`Last Updated: ${state.updated_at}`);
  instructions.push(`Current Node: ${state.current_node}`);
  instructions.push(`Completed Nodes: ${state.completed_nodes.join(', ') || 'None'}`);

  if (state.skill_name) {
    instructions.push(`Skill Name: ${state.skill_name}`);
  }
  if (state.skill_type) {
    instructions.push(`Skill Type: ${state.skill_type}`);
  }

  instructions.push('');
  instructions.push(`To resume, read: process/${state.current_node}/README.md`);

  return instructions;
}

// Main execution
if (require.main === module) {
  console.log('=== AFP State Recovery ===\n');

  const result = recoverState();

  if (result.success) {
    console.log('State recovered successfully!\n');
    getResumptionInstructions(result.state).forEach(line => console.log(line));

    if (result.warnings.length > 0) {
      console.log('\nWarnings:');
      result.warnings.forEach(w => console.log(`  - ${w}`));
    }

    process.exit(0);
  } else {
    console.log(`Recovery failed: ${result.error}`);
    process.exit(1);
  }
}

module.exports = {
  recoverState,
  validateState,
  loadJson
};
