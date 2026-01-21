#!/usr/bin/env node
/**
 * Structure Validator
 * Validates that a skill has the correct directory structure for its type
 */

const fs = require('fs');
const path = require('path');

/**
 * Structure requirements by skill type
 */
const STRUCTURE_REQUIREMENTS = {
  simple: {
    files: ['SKILL.md', 'README.md'],
    directories: []
  },
  standard: {
    files: ['SKILL.md', 'README.md'],
    directories: ['patterns', 'checklists', 'references']
  },
  complex: {
    files: ['SKILL.md', 'README.md'],
    directories: ['process', 'workspace-template', 'frameworks', 'validators', 'references']
  }
};

/**
 * Validate skill structure
 */
function validateStructure(skillDir, skillType) {
  const results = {
    passed: true,
    checks: 0,
    failures: [],
    warnings: []
  };

  const requirements = STRUCTURE_REQUIREMENTS[skillType];
  if (!requirements) {
    results.passed = false;
    results.failures.push(`Unknown skill type: ${skillType}`);
    return results;
  }

  // Check required files
  for (const file of requirements.files) {
    results.checks++;
    const filePath = path.join(skillDir, file);

    if (!fs.existsSync(filePath)) {
      results.passed = false;
      results.failures.push(`Missing required file: ${file}`);
    } else if (fs.statSync(filePath).size === 0) {
      results.warnings.push(`File is empty: ${file}`);
    }
  }

  // Check required directories
  for (const dir of requirements.directories) {
    results.checks++;
    const dirPath = path.join(skillDir, dir);

    if (!fs.existsSync(dirPath)) {
      results.passed = false;
      results.failures.push(`Missing required directory: ${dir}`);
    } else if (!fs.statSync(dirPath).isDirectory()) {
      results.passed = false;
      results.failures.push(`Expected directory, found file: ${dir}`);
    }
  }

  // Additional checks for complex skills
  if (skillType === 'complex') {
    // Check for at least one process node
    const processDir = path.join(skillDir, 'process');
    if (fs.existsSync(processDir)) {
      results.checks++;
      const nodes = fs.readdirSync(processDir).filter(f => {
        return fs.statSync(path.join(processDir, f)).isDirectory() &&
               /^[0-9]{2}-/.test(f);
      });

      if (nodes.length === 0) {
        results.passed = false;
        results.failures.push('No process nodes found (expected directories like 00-init)');
      }
    }

    // Check workspace-template has current-process.json
    const wsTemplate = path.join(skillDir, 'workspace-template', 'current-process.json');
    results.checks++;
    if (!fs.existsSync(wsTemplate)) {
      results.passed = false;
      results.failures.push('Missing workspace-template/current-process.json');
    }

    // Check frameworks subdirectories
    for (const framework of ['cor', 'afp', 'ntp']) {
      const fwDir = path.join(skillDir, 'frameworks', framework);
      results.checks++;
      if (!fs.existsSync(fwDir)) {
        results.warnings.push(`Missing framework directory: frameworks/${framework}`);
      }
    }
  }

  return results;
}

/**
 * Print validation results
 */
function printResults(results, skillDir, skillType) {
  console.log('=== Structure Validation Results ===\n');
  console.log(`Skill Directory: ${skillDir}`);
  console.log(`Skill Type: ${skillType}`);
  console.log(`Checks Run: ${results.checks}`);
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
    console.log('RESULT: PASSED');
  } else {
    console.log('RESULT: FAILED');
  }

  return results.passed;
}

/**
 * Detect skill type from SKILL.md
 */
function detectSkillType(skillDir) {
  const skillMd = path.join(skillDir, 'SKILL.md');
  if (!fs.existsSync(skillMd)) {
    return null;
  }

  const content = fs.readFileSync(skillMd, 'utf8');

  // Check for COR indicators (complex)
  if (content.includes('COR Process Flow') || content.includes('COR-AFP-NTP')) {
    return 'complex';
  }

  // Check for patterns directory mention (standard)
  if (content.includes('patterns/') || content.includes('## Patterns')) {
    return 'standard';
  }

  // Default to simple
  return 'simple';
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('Usage: validate-structure.js <skill-directory> [skill-type]');
    console.log('');
    console.log('If skill-type is not provided, it will be auto-detected from SKILL.md');
    console.log('Valid types: simple, standard, complex');
    process.exit(1);
  }

  const skillDir = path.resolve(args[0]);
  let skillType = args[1];

  if (!fs.existsSync(skillDir)) {
    console.log(`Error: Directory not found: ${skillDir}`);
    process.exit(1);
  }

  if (!skillType) {
    skillType = detectSkillType(skillDir);
    if (!skillType) {
      console.log('Error: Could not detect skill type. Please specify it.');
      process.exit(1);
    }
    console.log(`Auto-detected skill type: ${skillType}\n`);
  }

  const results = validateStructure(skillDir, skillType);
  const passed = printResults(results, skillDir, skillType);

  process.exit(passed ? 0 : 1);
}

module.exports = {
  validateStructure,
  detectSkillType,
  STRUCTURE_REQUIREMENTS
};
