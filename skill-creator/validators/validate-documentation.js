#!/usr/bin/env node
/**
 * Documentation Validator
 * Validates that a skill has proper documentation
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse YAML frontmatter from markdown
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return null;
  }

  const yamlContent = match[1];
  const frontmatter = {};

  yamlContent.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Handle arrays (simple detection)
      if (value === '') {
        // Could be a multi-line array, skip for now
        frontmatter[key] = [];
      } else {
        frontmatter[key] = value;
      }
    }
  });

  return frontmatter;
}

/**
 * Validate SKILL.md documentation
 */
function validateSkillMd(skillDir) {
  const results = {
    passed: true,
    checks: 0,
    failures: [],
    warnings: []
  };

  const skillMdPath = path.join(skillDir, 'SKILL.md');

  // Check file exists
  results.checks++;
  if (!fs.existsSync(skillMdPath)) {
    results.passed = false;
    results.failures.push('SKILL.md not found');
    return results;
  }

  const content = fs.readFileSync(skillMdPath, 'utf8');

  // Check has YAML frontmatter
  results.checks++;
  const frontmatter = parseFrontmatter(content);
  if (!frontmatter) {
    results.passed = false;
    results.failures.push('SKILL.md missing YAML frontmatter (---...---)');
    return results;
  }

  // Check required frontmatter fields
  const requiredFields = ['name', 'description'];
  for (const field of requiredFields) {
    results.checks++;
    if (!frontmatter[field]) {
      results.passed = false;
      results.failures.push(`SKILL.md missing required frontmatter field: ${field}`);
    }
  }

  // Check allowed-tools (warning if missing)
  results.checks++;
  if (!frontmatter['allowed-tools']) {
    results.warnings.push('SKILL.md missing allowed-tools in frontmatter');
  }

  // Check has a title
  results.checks++;
  if (!content.match(/^#\s+.+/m)) {
    results.passed = false;
    results.failures.push('SKILL.md missing main title (# Title)');
  }

  // Check has Purpose or description section
  results.checks++;
  if (!content.includes('## Purpose') && !content.includes('## Description')) {
    results.warnings.push('SKILL.md missing ## Purpose or ## Description section');
  }

  // Check has Usage section
  results.checks++;
  if (!content.includes('## Usage') && !content.includes('## Quick Start')) {
    results.warnings.push('SKILL.md missing ## Usage or ## Quick Start section');
  }

  // Check minimum content length
  results.checks++;
  if (content.length < 500) {
    results.warnings.push('SKILL.md appears to have minimal content');
  }

  return results;
}

/**
 * Validate README.md documentation
 */
function validateReadmeMd(skillDir) {
  const results = {
    passed: true,
    checks: 0,
    failures: [],
    warnings: []
  };

  const readmePath = path.join(skillDir, 'README.md');

  // Check file exists
  results.checks++;
  if (!fs.existsSync(readmePath)) {
    results.passed = false;
    results.failures.push('README.md not found');
    return results;
  }

  const content = fs.readFileSync(readmePath, 'utf8');

  // Check has a title
  results.checks++;
  if (!content.match(/^#\s+.+/m)) {
    results.passed = false;
    results.failures.push('README.md missing main title');
  }

  // Check has installation or usage section
  results.checks++;
  if (!content.includes('## Installation') && !content.includes('## Usage')) {
    results.warnings.push('README.md missing ## Installation or ## Usage section');
  }

  // Check has examples
  results.checks++;
  if (!content.includes('## Example') && !content.includes('```')) {
    results.warnings.push('README.md missing examples');
  }

  // Check minimum content length
  results.checks++;
  if (content.length < 300) {
    results.warnings.push('README.md appears to have minimal content');
  }

  return results;
}

/**
 * Validate process node documentation (for complex skills)
 */
function validateNodeDocs(skillDir) {
  const results = {
    passed: true,
    checks: 0,
    failures: [],
    warnings: []
  };

  const processDir = path.join(skillDir, 'process');
  if (!fs.existsSync(processDir)) {
    return results; // Not a complex skill
  }

  const nodes = fs.readdirSync(processDir).filter(f => {
    const nodePath = path.join(processDir, f);
    return fs.statSync(nodePath).isDirectory() && /^[0-9]{2}-/.test(f);
  });

  for (const node of nodes) {
    const nodeDir = path.join(processDir, node);

    // Check README.md exists
    results.checks++;
    const readmePath = path.join(nodeDir, 'README.md');
    if (!fs.existsSync(readmePath)) {
      results.passed = false;
      results.failures.push(`Node ${node} missing README.md`);
    } else {
      const content = fs.readFileSync(readmePath, 'utf8');

      // Check has title
      results.checks++;
      if (!content.match(/^#\s+/m)) {
        results.warnings.push(`Node ${node}/README.md missing title`);
      }

      // Check has Purpose section
      results.checks++;
      if (!content.includes('## Purpose')) {
        results.warnings.push(`Node ${node}/README.md missing ## Purpose`);
      }

      // Check has Exit Validation section
      results.checks++;
      if (!content.includes('## Exit Validation')) {
        results.warnings.push(`Node ${node}/README.md missing ## Exit Validation`);
      }
    }

    // Check exit-validation.sh exists
    results.checks++;
    const exitValPath = path.join(nodeDir, 'exit-validation.sh');
    if (!fs.existsSync(exitValPath)) {
      results.passed = false;
      results.failures.push(`Node ${node} missing exit-validation.sh`);
    }
  }

  return results;
}

/**
 * Run all documentation validations
 */
function validateDocumentation(skillDir) {
  const skillMdResults = validateSkillMd(skillDir);
  const readmeResults = validateReadmeMd(skillDir);
  const nodeResults = validateNodeDocs(skillDir);

  return {
    passed: skillMdResults.passed && readmeResults.passed && nodeResults.passed,
    checks: skillMdResults.checks + readmeResults.checks + nodeResults.checks,
    failures: [...skillMdResults.failures, ...readmeResults.failures, ...nodeResults.failures],
    warnings: [...skillMdResults.warnings, ...readmeResults.warnings, ...nodeResults.warnings],
    details: {
      skill_md: skillMdResults,
      readme: readmeResults,
      nodes: nodeResults
    }
  };
}

/**
 * Print validation results
 */
function printResults(results, skillDir) {
  console.log('=== Documentation Validation Results ===\n');
  console.log(`Skill Directory: ${skillDir}`);
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

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('Usage: validate-documentation.js <skill-directory>');
    process.exit(1);
  }

  const skillDir = path.resolve(args[0]);

  if (!fs.existsSync(skillDir)) {
    console.log(`Error: Directory not found: ${skillDir}`);
    process.exit(1);
  }

  const results = validateDocumentation(skillDir);
  const passed = printResults(results, skillDir);

  process.exit(passed ? 0 : 1);
}

module.exports = {
  validateDocumentation,
  validateSkillMd,
  validateReadmeMd,
  validateNodeDocs,
  parseFrontmatter
};
