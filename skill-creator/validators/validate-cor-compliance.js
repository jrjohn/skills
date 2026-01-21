#!/usr/bin/env node
/**
 * COR Compliance Validator
 * Validates that a complex skill properly implements COR-AFP-NTP protocol
 */

const fs = require('fs');
const path = require('path');

/**
 * Validate COR (Chain of Repository) compliance
 */
function validateCOR(skillDir) {
  const results = {
    passed: true,
    checks: 0,
    failures: [],
    warnings: []
  };

  const processDir = path.join(skillDir, 'process');

  // Check process directory exists
  results.checks++;
  if (!fs.existsSync(processDir)) {
    results.passed = false;
    results.failures.push('COR: process/ directory not found');
    return results;
  }

  // Get all node directories
  const nodes = fs.readdirSync(processDir).filter(f => {
    const nodePath = path.join(processDir, f);
    return fs.statSync(nodePath).isDirectory() && /^[0-9]{2}-/.test(f);
  }).sort();

  // Check at least one node exists
  results.checks++;
  if (nodes.length === 0) {
    results.passed = false;
    results.failures.push('COR: No process nodes found');
    return results;
  }

  // Check node numbering is sequential
  results.checks++;
  for (let i = 0; i < nodes.length; i++) {
    const expectedPrefix = String(i).padStart(2, '0');
    if (!nodes[i].startsWith(expectedPrefix)) {
      results.warnings.push(`COR: Node numbering gap - expected ${expectedPrefix}-*, found ${nodes[i]}`);
    }
  }

  // Check each node has required files
  for (const node of nodes) {
    const nodeDir = path.join(processDir, node);

    results.checks++;
    if (!fs.existsSync(path.join(nodeDir, 'README.md'))) {
      results.passed = false;
      results.failures.push(`COR: Node ${node} missing README.md`);
    }

    results.checks++;
    if (!fs.existsSync(path.join(nodeDir, 'exit-validation.sh'))) {
      results.passed = false;
      results.failures.push(`COR: Node ${node} missing exit-validation.sh`);
    }
  }

  // Check SKILL.md has COR documentation
  results.checks++;
  const skillMd = path.join(skillDir, 'SKILL.md');
  if (fs.existsSync(skillMd)) {
    const content = fs.readFileSync(skillMd, 'utf8');
    if (!content.includes('## COR Process Flow') && !content.includes('COR')) {
      results.warnings.push('COR: SKILL.md should document the COR process flow');
    }
  }

  results.nodes = nodes;
  return results;
}

/**
 * Validate AFP (Anti-Fragile Protocol) compliance
 */
function validateAFP(skillDir) {
  const results = {
    passed: true,
    checks: 0,
    failures: [],
    warnings: []
  };

  // Check workspace-template exists
  results.checks++;
  const wsTemplate = path.join(skillDir, 'workspace-template');
  if (!fs.existsSync(wsTemplate)) {
    results.passed = false;
    results.failures.push('AFP: workspace-template/ directory not found');
    return results;
  }

  // Check current-process.json template exists
  results.checks++;
  const processJson = path.join(wsTemplate, 'current-process.json');
  if (!fs.existsSync(processJson)) {
    results.passed = false;
    results.failures.push('AFP: workspace-template/current-process.json not found');
  } else {
    // Validate it's valid JSON (or template)
    try {
      const content = fs.readFileSync(processJson, 'utf8');
      // Allow template variables like {{VARIABLE}} - replace with valid placeholder
      const cleaned = content.replace(/\{\{[A-Z_]+\}\}/g, 'placeholder');
      JSON.parse(cleaned);
      results.checks++;
    } catch (e) {
      results.passed = false;
      results.failures.push('AFP: current-process.json is not valid JSON');
    }
  }

  // Check AFP framework directory
  results.checks++;
  const afpDir = path.join(skillDir, 'frameworks', 'afp');
  if (!fs.existsSync(afpDir)) {
    results.warnings.push('AFP: frameworks/afp/ directory not found');
  } else {
    // Check for recovery script
    results.checks++;
    const recoveryScript = path.join(afpDir, 'recover-state.js');
    if (!fs.existsSync(recoveryScript)) {
      results.warnings.push('AFP: recover-state.js not found');
    }

    // Check for health check script
    results.checks++;
    const healthCheck = path.join(afpDir, 'quick-health-check.sh');
    if (!fs.existsSync(healthCheck)) {
      results.warnings.push('AFP: quick-health-check.sh not found');
    }
  }

  // Check SKILL.md has AFP documentation
  results.checks++;
  const skillMd = path.join(skillDir, 'SKILL.md');
  if (fs.existsSync(skillMd)) {
    const content = fs.readFileSync(skillMd, 'utf8');
    if (!content.includes('## AFP State') && !content.includes('State Management')) {
      results.warnings.push('AFP: SKILL.md should document state management');
    }
  }

  return results;
}

/**
 * Validate NTP (Node Transition Protocol) compliance
 */
function validateNTP(skillDir) {
  const results = {
    passed: true,
    checks: 0,
    failures: [],
    warnings: []
  };

  const processDir = path.join(skillDir, 'process');
  if (!fs.existsSync(processDir)) {
    return results; // Already caught by COR validation
  }

  // Get all node directories
  const nodes = fs.readdirSync(processDir).filter(f => {
    const nodePath = path.join(processDir, f);
    return fs.statSync(nodePath).isDirectory() && /^[0-9]{2}-/.test(f);
  }).sort();

  // Check each node has exit validation
  for (const node of nodes) {
    const nodeDir = path.join(processDir, node);
    const exitVal = path.join(nodeDir, 'exit-validation.sh');

    results.checks++;
    if (fs.existsSync(exitVal)) {
      const content = fs.readFileSync(exitVal, 'utf8');

      // Check it's a bash script
      if (!content.startsWith('#!/bin/bash')) {
        results.warnings.push(`NTP: ${node}/exit-validation.sh missing shebang`);
      }

      // Check it has at least one validation
      if (!content.includes('echo') || !content.includes('exit')) {
        results.warnings.push(`NTP: ${node}/exit-validation.sh may be incomplete`);
      }
    }
  }

  // Check NTP framework directory
  results.checks++;
  const ntpDir = path.join(skillDir, 'frameworks', 'ntp');
  if (!fs.existsSync(ntpDir)) {
    results.warnings.push('NTP: frameworks/ntp/ directory not found');
  } else {
    // Check for transition script
    results.checks++;
    const transitionScript = path.join(ntpDir, 'node-transition.js');
    if (!fs.existsSync(transitionScript)) {
      results.warnings.push('NTP: node-transition.js not found');
    }
  }

  return results;
}

/**
 * Run full COR-AFP-NTP compliance check
 */
function validateCorCompliance(skillDir) {
  const corResults = validateCOR(skillDir);
  const afpResults = validateAFP(skillDir);
  const ntpResults = validateNTP(skillDir);

  const allPassed = corResults.passed && afpResults.passed && ntpResults.passed;
  const totalChecks = corResults.checks + afpResults.checks + ntpResults.checks;

  return {
    passed: allPassed,
    checks: totalChecks,
    failures: [...corResults.failures, ...afpResults.failures, ...ntpResults.failures],
    warnings: [...corResults.warnings, ...afpResults.warnings, ...ntpResults.warnings],
    details: {
      cor: corResults,
      afp: afpResults,
      ntp: ntpResults
    },
    nodes: corResults.nodes || []
  };
}

/**
 * Print validation results
 */
function printResults(results, skillDir) {
  console.log('=== COR-AFP-NTP Compliance Validation ===\n');
  console.log(`Skill Directory: ${skillDir}`);
  console.log(`Checks Run: ${results.checks}`);

  if (results.nodes && results.nodes.length > 0) {
    console.log(`Process Nodes: ${results.nodes.length}`);
    results.nodes.forEach(n => console.log(`  - ${n}`));
  }
  console.log('');

  // COR Results
  console.log('--- COR (Chain of Repository) ---');
  console.log(`  Status: ${results.details.cor.passed ? 'PASSED' : 'FAILED'}`);
  console.log(`  Checks: ${results.details.cor.checks}`);

  // AFP Results
  console.log('--- AFP (Anti-Fragile Protocol) ---');
  console.log(`  Status: ${results.details.afp.passed ? 'PASSED' : 'FAILED'}`);
  console.log(`  Checks: ${results.details.afp.checks}`);

  // NTP Results
  console.log('--- NTP (Node Transition Protocol) ---');
  console.log(`  Status: ${results.details.ntp.passed ? 'PASSED' : 'FAILED'}`);
  console.log(`  Checks: ${results.details.ntp.checks}`);

  console.log('');

  if (results.failures.length > 0) {
    console.log('FAILURES:');
    results.failures.forEach(f => console.log(`  ✗ ${f}`));
    console.log('');
  }

  if (results.warnings.length > 0) {
    console.log('WARNINGS:');
    results.warnings.forEach(w => console.log(`  ⚠ ${w}`));
    console.log('');
  }

  if (results.passed) {
    console.log('OVERALL RESULT: PASSED');
  } else {
    console.log('OVERALL RESULT: FAILED');
  }

  return results.passed;
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('Usage: validate-cor-compliance.js <skill-directory>');
    console.log('');
    console.log('Validates that a complex skill properly implements COR-AFP-NTP protocol.');
    process.exit(1);
  }

  const skillDir = path.resolve(args[0]);

  if (!fs.existsSync(skillDir)) {
    console.log(`Error: Directory not found: ${skillDir}`);
    process.exit(1);
  }

  const results = validateCorCompliance(skillDir);
  const passed = printResults(results, skillDir);

  process.exit(passed ? 0 : 1);
}

module.exports = {
  validateCorCompliance,
  validateCOR,
  validateAFP,
  validateNTP
};
