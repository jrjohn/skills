#!/usr/bin/env node
/**
 * NTP Node Transition Script
 * Manages gated transitions between COR nodes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE_DIR = process.env.WORKSPACE_DIR ||
  path.join(process.env.HOME, '.claude/skills/skill-creator/workspace');
const PROCESS_DIR = process.env.PROCESS_DIR ||
  path.join(process.env.HOME, '.claude/skills/skill-creator/process');

/**
 * Load current state
 */
function loadState() {
  const statePath = path.join(WORKSPACE_DIR, 'current-process.json');
  try {
    return JSON.parse(fs.readFileSync(statePath, 'utf8'));
  } catch (error) {
    return null;
  }
}

/**
 * Save state
 */
function saveState(state) {
  const statePath = path.join(WORKSPACE_DIR, 'current-process.json');
  state.updated_at = new Date().toISOString();
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

/**
 * Run exit validation for a node
 */
function runExitValidation(nodeId) {
  const validationScript = path.join(PROCESS_DIR, nodeId, 'exit-validation.sh');

  if (!fs.existsSync(validationScript)) {
    return {
      passed: false,
      errors: [`Exit validation script not found: ${validationScript}`],
      output: ''
    };
  }

  try {
    const output = execSync(`bash "${validationScript}"`, {
      cwd: WORKSPACE_DIR,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    return {
      passed: true,
      errors: [],
      output: output
    };
  } catch (error) {
    return {
      passed: false,
      errors: [error.stderr || error.message],
      output: error.stdout || ''
    };
  }
}

/**
 * Get next node in chain
 */
function getNextNode(currentNode) {
  const nodeOrder = [
    '00-requirements',
    '01-classification',
    '02-structure',
    '03-templates',
    '04-framework',
    '05-validation',
    '06-finalize'
  ];

  const currentIndex = nodeOrder.indexOf(currentNode);
  if (currentIndex === -1 || currentIndex === nodeOrder.length - 1) {
    return null;
  }

  return nodeOrder[currentIndex + 1];
}

/**
 * Attempt transition from current node to next
 */
function attemptTransition(fromNode, toNode) {
  console.log(`\n=== NTP: Attempting transition ===`);
  console.log(`From: ${fromNode}`);
  console.log(`To: ${toNode}`);
  console.log('');

  // Run exit validation
  console.log('Running exit validation...');
  const validation = runExitValidation(fromNode);

  if (!validation.passed) {
    console.log('\n=== TRANSITION BLOCKED ===\n');
    console.log('Exit validation failed:');
    validation.errors.forEach(err => console.log(`  - ${err}`));
    console.log('\nPlease fix the issues and retry.');

    return {
      success: false,
      blocked: true,
      reason: validation.errors,
      stayAt: fromNode
    };
  }

  console.log('Exit validation passed!\n');

  // Update state
  const state = loadState();
  if (state) {
    if (!state.completed_nodes.includes(fromNode)) {
      state.completed_nodes.push(fromNode);
    }
    state.current_node = toNode;
    saveState(state);
    console.log('State updated.');
  }

  console.log('\n=== TRANSITION SUCCESSFUL ===\n');
  console.log(`Now at node: ${toNode}`);
  console.log(`Read: process/${toNode}/README.md`);

  return {
    success: true,
    blocked: false,
    transitionedTo: toNode
  };
}

/**
 * Transition to next node automatically
 */
function transitionToNext() {
  const state = loadState();
  if (!state) {
    console.log('No active session found.');
    return;
  }

  const currentNode = state.current_node;
  const nextNode = getNextNode(currentNode);

  if (!nextNode) {
    console.log('Already at final node or invalid state.');
    return;
  }

  return attemptTransition(currentNode, nextNode);
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'next':
      transitionToNext();
      break;

    case 'to':
      const fromNode = args[1];
      const toNode = args[2];
      if (!fromNode || !toNode) {
        console.log('Usage: node-transition.js to <from-node> <to-node>');
        process.exit(1);
      }
      attemptTransition(fromNode, toNode);
      break;

    case 'validate':
      const nodeId = args[1];
      if (!nodeId) {
        console.log('Usage: node-transition.js validate <node-id>');
        process.exit(1);
      }
      const result = runExitValidation(nodeId);
      console.log(result.passed ? 'PASSED' : 'FAILED');
      if (!result.passed) {
        result.errors.forEach(e => console.log(`  ${e}`));
        process.exit(1);
      }
      break;

    default:
      console.log('NTP Node Transition Script');
      console.log('');
      console.log('Commands:');
      console.log('  next                    - Transition to next node');
      console.log('  to <from> <to>          - Transition between specific nodes');
      console.log('  validate <node>         - Run exit validation for a node');
  }
}

module.exports = {
  attemptTransition,
  runExitValidation,
  getNextNode,
  transitionToNext
};
