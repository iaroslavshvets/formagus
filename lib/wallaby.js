module.exports = function (wallaby) {
  return {
    files: [
      {pattern: 'tsconfig.json', instrument: false},
      {pattern: 'test/**/*.ts*', instrument: false},
      {pattern: 'src/**/*.ts*'},
    ],
    tests: [
      {pattern: '__tests__/*.ts*'},
    ],
    testFramework: 'jest',
    env: {
      type: 'node',
    }
  };
};
