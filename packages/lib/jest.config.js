module.exports = {
  setupFiles: [
    './test/jest-setup.ts',
  ],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
      ignoreCoverageForDecorators: true,
      ignoreCoverageForAllDecorators: true,
    },
  },
  testRegex: '/__tests__/.*\\.(ts|tsx)$',
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
    'tsx',
  ],
  preset: 'ts-jest',
  testMatch: null,
};

