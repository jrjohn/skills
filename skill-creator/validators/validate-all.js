#!/usr/bin/env node
/**
 * Complete Skill Validator
 * Runs all validations on a skill
 */

const fs = require('fs');
const path = require('path');
const { validateStructure, detectSkillType } = require('./validate-structure');
const { validateDocumentation } = require('./validate-documentation');
const { validateCorCompliance } = require('./validate-cor-compliance');

/**
 * Run all validations
 */
function validateAll(skillDir, skillType = null) {
  // Auto-detect skill type if not provided
  if (!skillType) {
    skillType = detectSkillType(skillDir);
  }

  if (!skillType) {
    return {
      passed: false,
      error: 'Could not determine skill type',
      validations: {}
    };
  }

  const results = {
    passed: true,
    skill_dir: skillDir,
    skill_type: skillType,
    validations: {}
  };

  // Structure validation
  const structureResults = validateStructure(skillDir, skillType);
  results.validations.structure = structureResults;
  if (!structureResults.passed) {
    results.passed = false;
  }

  // Documentation validation
  const docResults = validateDocumentation(skillDir);
  results.validations.documentation = docResults;
  if (!docResults.passed) {
    results.passed = false;
  }

  // COR compliance (only for complex skills)
  if (skillType === 'complex') {
    const corResults = validateCorCompliance(skillDir);
    results.validations.cor_compliance = corResults;
    if (!corResults.passed) {
      results.passed = false;
    }
  } else {
    results.validations.cor_compliance = {
      skipped: true,
      reason: `Not a complex skill (type: ${skillType})`
    };
  }

  // Calculate totals
  let totalChecks = 0;
  let totalFailures = 0;
  let totalWarnings = 0;

  for (const [name, validation] of Object.entries(results.validations)) {
    if (!validation.skipped) {
      totalChecks += validation.checks || 0;
      totalFailures += (validation.failures || []).length;
      totalWarnings += (validation.warnings || []).length;
    }
  }

  results.summary = {
    total_checks: totalChecks,
    total_failures: totalFailures,
    total_warnings: totalWarnings
  };

  return results;
}

/**
 * Print comprehensive results
 */
function printResults(results) {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║                    SKILL VALIDATION REPORT                       ║');
  console.log('╠══════════════════════════════════════════════════════════════════╣');
  console.log(`║  Directory: ${results.skill_dir.substring(0, 50).padEnd(52)}║`);
  console.log(`║  Type: ${results.skill_type.padEnd(57)}║`);
  console.log('╠══════════════════════════════════════════════════════════════════╣');

  // Structure validation
  const struct = results.validations.structure;
  const structStatus = struct.passed ? '✓ PASSED' : '✗ FAILED';
  console.log(`║  Structure Validation: ${structStatus.padEnd(41)}║`);
  if (struct.failures && struct.failures.length > 0) {
    struct.failures.forEach(f => {
      console.log(`║    - ${f.substring(0, 58).padEnd(58)}║`);
    });
  }

  // Documentation validation
  const doc = results.validations.documentation;
  const docStatus = doc.passed ? '✓ PASSED' : '✗ FAILED';
  console.log(`║  Documentation Validation: ${docStatus.padEnd(37)}║`);
  if (doc.failures && doc.failures.length > 0) {
    doc.failures.forEach(f => {
      console.log(`║    - ${f.substring(0, 58).padEnd(58)}║`);
    });
  }

  // COR compliance
  const cor = results.validations.cor_compliance;
  if (cor.skipped) {
    console.log(`║  COR Compliance: SKIPPED (${cor.reason.substring(0, 33)})     ║`);
  } else {
    const corStatus = cor.passed ? '✓ PASSED' : '✗ FAILED';
    console.log(`║  COR Compliance: ${corStatus.padEnd(47)}║`);
    if (cor.failures && cor.failures.length > 0) {
      cor.failures.forEach(f => {
        console.log(`║    - ${f.substring(0, 58).padEnd(58)}║`);
      });
    }
  }

  console.log('╠══════════════════════════════════════════════════════════════════╣');

  // Warnings
  const allWarnings = [
    ...(struct.warnings || []),
    ...(doc.warnings || []),
    ...(!cor.skipped ? (cor.warnings || []) : [])
  ];

  if (allWarnings.length > 0) {
    console.log('║  WARNINGS:                                                       ║');
    allWarnings.slice(0, 5).forEach(w => {
      console.log(`║    ⚠ ${w.substring(0, 57).padEnd(57)}║`);
    });
    if (allWarnings.length > 5) {
      console.log(`║    ... and ${(allWarnings.length - 5).toString()} more                                              ║`);
    }
    console.log('╠══════════════════════════════════════════════════════════════════╣');
  }

  // Summary
  const sum = results.summary;
  console.log(`║  SUMMARY                                                         ║`);
  console.log(`║    Total Checks: ${sum.total_checks.toString().padEnd(47)}║`);
  console.log(`║    Failures: ${sum.total_failures.toString().padEnd(51)}║`);
  console.log(`║    Warnings: ${sum.total_warnings.toString().padEnd(51)}║`);
  console.log('╠══════════════════════════════════════════════════════════════════╣');

  const overallStatus = results.passed ? '✓ PASSED' : '✗ FAILED';
  console.log(`║  OVERALL: ${overallStatus.padEnd(54)}║`);
  console.log('╚══════════════════════════════════════════════════════════════════╝');

  return results.passed;
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('Usage: validate-all.js <skill-directory> [skill-type]');
    console.log('');
    console.log('Runs all validations on a skill:');
    console.log('  - Structure validation');
    console.log('  - Documentation validation');
    console.log('  - COR compliance (for complex skills)');
    process.exit(1);
  }

  const skillDir = path.resolve(args[0]);
  const skillType = args[1] || null;

  if (!fs.existsSync(skillDir)) {
    console.log(`Error: Directory not found: ${skillDir}`);
    process.exit(1);
  }

  console.log('');
  const results = validateAll(skillDir, skillType);
  const passed = printResults(results);

  process.exit(passed ? 0 : 1);
}

module.exports = {
  validateAll
};
