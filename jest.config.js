/**
 * @type {import('ts-jest').JestConfigWithTsJest['coverageReporters']}
 *
 * @see https://github.com/facebook/jest/blob/654949b5897c93cc3d7cf5d9c0efbb45c21a8c45/packages/jest-config/src/Defaults.ts#L28
 */
const defaultCoverageReporters = require('jest-config').defaults.coverageReporters;

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // #region TypeScript Jest essentials (`ts-jest config:init`)
  preset: 'ts-jest',
  testEnvironment: 'node',
  // #endregion

  collectCoverage: true,
  coverageDirectory: '../coverage',
  rootDir: './src',
  coverageReporters: [...defaultCoverageReporters, 'json-summary'],
};
