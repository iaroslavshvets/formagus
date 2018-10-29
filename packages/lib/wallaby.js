'use strict';

module.exports = function (wallaby) {
  return {
    files: [
      {pattern: 'tsconfig.json', instrument: false},
      {pattern: 'test/**/*.ts*', instrument: false},
      {pattern: 'jest.config.js', instrument: false},
      {pattern: 'src/**/*.ts*'},
    ],
    tests: [
      '__tests__/*.ts*'
    ],
    slowTestThreshold: 200, // 200 ms
    testFramework: 'jest',
    env: {
      type: 'node',
      runner: process.env.NODE_HOME
    },
    setup: function (w) {
      const path = require('path');
      const jestConfig = require(path.resolve(process.cwd(), './jest.config'));
      w.testFramework.DEFAULT_TIMEOUT_INTERVAL = 2500;
      w.testFramework.configure(jestConfig)
    }
  }
}
