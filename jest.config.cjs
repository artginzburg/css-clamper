/** @see https://github.com/facebook/jest/blob/654949b5897c93cc3d7cf5d9c0efbb45c21a8c45/packages/jest-config/src/Defaults.ts#L28 */
const defaultCoverageReporters = (require('jest-config')).defaults.coverageReporters;

/**
 * The same config that's suggested in the GH issue, but with `transform`, `globals` and `extensionsToTreatAsEsm` removed, since these were not needed in css-clamper.
 * @see https://github.com/kulshekhar/ts-jest/issues/1057#issuecomment-1068342692
 * @type {import('@jest/types').Config.ProjectConfig}
 */
const webCompatibleConfig = {
  moduleNameMapper: {
    '(.+)\\.js': '$1',
  },
};

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // #region TypeScript Jest essentials (`ts-jest config:init`)
  preset: 'ts-jest',
  testEnvironment: 'node',
  // #endregion

  ...webCompatibleConfig,

  collectCoverage: true,
  coverageDirectory: '../coverage',
  rootDir: './src',
  coverageReporters: [...defaultCoverageReporters, 'json-summary'],
};
