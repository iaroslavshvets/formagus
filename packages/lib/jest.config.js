module.exports = {
  setupFiles: [
    './test/jest-setup.ts',
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
  testRegex: '/__tests__/.*\\.(ts|tsx)$',
  testPathIgnorePatterns: ['/__tests__/.*\\.d.ts$'],
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

