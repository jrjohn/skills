#!/usr/bin/env node
/**
 * NTP Exit Gate
 * Validates that a node can be exited
 */

const fs = require('fs');
const path = require('path');

/**
 * Generic validation functions
 */
const validators = {
  /**
   * Check if file exists
   */
  fileExists: (filePath) => {
    return {
      check: 'File exists',
      path: filePath,
      passed: fs.existsSync(filePath),
      error: `File not found: ${filePath}`
    };
  },

  /**
   * Check if file is valid JSON
   */
  validJson: (filePath) => {
    if (!fs.existsSync(filePath)) {
      return {
        check: 'Valid JSON',
        path: filePath,
        passed: false,
        error: `File not found: ${filePath}`
      };
    }

    try {
      JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return {
        check: 'Valid JSON',
        path: filePath,
        passed: true,
        error: null
      };
    } catch (e) {
      return {
        check: 'Valid JSON',
        path: filePath,
        passed: false,
        error: `Invalid JSON: ${e.message}`
      };
    }
  },

  /**
   * Check if JSON has required field
   */
  hasField: (filePath, fieldPath) => {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const value = fieldPath.split('.').reduce((obj, key) => obj?.[key], data);

      return {
        check: `Has field: ${fieldPath}`,
        path: filePath,
        passed: value !== undefined && value !== null && value !== '',
        error: `Missing or empty field: ${fieldPath}`
      };
    } catch (e) {
      return {
        check: `Has field: ${fieldPath}`,
        path: filePath,
        passed: false,
        error: e.message
      };
    }
  },

  /**
   * Check if JSON field matches pattern
   */
  fieldMatches: (filePath, fieldPath, pattern) => {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const value = fieldPath.split('.').reduce((obj, key) => obj?.[key], data);
      const regex = new RegExp(pattern);

      return {
        check: `Field matches pattern: ${fieldPath}`,
        path: filePath,
        passed: regex.test(value),
        error: `Field ${fieldPath} does not match pattern ${pattern}`
      };
    } catch (e) {
      return {
        check: `Field matches pattern: ${fieldPath}`,
        path: filePath,
        passed: false,
        error: e.message
      };
    }
  },

  /**
   * Check if directory exists
   */
  directoryExists: (dirPath) => {
    return {
      check: 'Directory exists',
      path: dirPath,
      passed: fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory(),
      error: `Directory not found: ${dirPath}`
    };
  },

  /**
   * Check if JSON array has minimum length
   */
  arrayMinLength: (filePath, fieldPath, minLength) => {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const value = fieldPath.split('.').reduce((obj, key) => obj?.[key], data);

      return {
        check: `Array min length: ${fieldPath} >= ${minLength}`,
        path: filePath,
        passed: Array.isArray(value) && value.length >= minLength,
        error: `Array ${fieldPath} has fewer than ${minLength} items`
      };
    } catch (e) {
      return {
        check: `Array min length: ${fieldPath}`,
        path: filePath,
        passed: false,
        error: e.message
      };
    }
  }
};

/**
 * Run a set of validations
 */
function runValidations(validationList) {
  const results = [];
  let allPassed = true;

  for (const validation of validationList) {
    const result = validation();
    results.push(result);
    if (!result.passed) {
      allPassed = false;
    }
  }

  return {
    passed: allPassed,
    results: results,
    failures: results.filter(r => !r.passed)
  };
}

/**
 * Print validation results
 */
function printResults(validationResults) {
  console.log('');
  for (const result of validationResults.results) {
    const status = result.passed ? '✓' : '✗';
    console.log(`${status} ${result.check}`);
    if (!result.passed) {
      console.log(`  Error: ${result.error}`);
    }
  }
  console.log('');

  if (validationResults.passed) {
    console.log('All validations passed!');
  } else {
    console.log(`${validationResults.failures.length} validation(s) failed.`);
  }
}

// Export for use as module
module.exports = {
  validators,
  runValidations,
  printResults
};

// CLI usage
if (require.main === module) {
  console.log('NTP Exit Gate');
  console.log('');
  console.log('This module provides validation functions for exit gates.');
  console.log('Import it in your exit-validation scripts:');
  console.log('');
  console.log('  const { validators, runValidations } = require("./exit-gate.js");');
  console.log('');
  console.log('Available validators:');
  console.log('  - fileExists(path)');
  console.log('  - validJson(path)');
  console.log('  - hasField(path, fieldPath)');
  console.log('  - fieldMatches(path, fieldPath, pattern)');
  console.log('  - directoryExists(path)');
  console.log('  - arrayMinLength(path, fieldPath, minLength)');
}
