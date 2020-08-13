module.exports = {
  setupFiles: [
    './__tests__/jest-setup.ts',
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  globals: {
    'ts-jest': {
      diagnostics: false,
      ignoreCoverageForDecorators: true,
      ignoreCoverageForAllDecorators: true,
    },
  },
  testRegex: '/__tests__/specs/.*\\.(ts|tsx)$',
  testPathIgnorePatterns: ['/__tests__/specs/.*\\.d.ts$'],
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
    'tsx',
  ],
  preset: 'ts-jest',
  testMatch: null,
  collectCoverageFrom: [
    '!<rootDir>/src/index.ts',
    '<rootDir>/src/**'
  ]
};

