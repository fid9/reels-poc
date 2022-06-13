/**
 * Jest configuration
 * @version nestjs-template-jest-configuration@2.0
 */

process.env.STAGE = process.env.STAGE || 'test';

process.env.TEST_SCOPE = process.env.TEST_SCOPE || 'unit';

const config = {
  unit: {
    testRegex: '.(unit|spec|e2e).ts$',
    roots: ['src'],
  },
  e2e: {
    testRegex: '.e2e-spec.ts$',
    roots: ['src', 'test'],
  },
  all: {
    testRegex: '.(unit|spec|e2e|e2e-spec).ts$',
    roots: ['src', 'test'],
  },
}[process.env.TEST_SCOPE];

module.exports = {
  preset: 'ts-jest',

  // where to find tests
  rootDir: '.',
  roots: ['src'],

  /**
   * There are different kinds of tests depending on development cycles
   *  - unit, is a test of function or a method, without dependencies, great for TDD
   *  - spec, is a test of a interface, optional services, great for BDD
   *  - e2e, is a test of a HTTP interface, with services, great for BDD
   */
  testRegex: config.testRegex,
  testMatch: null, // ts-node needs this to apply testRegex

  // report all tests
  verbose: true,

  // coverage
  //collectCoverageFrom: ['**/*.(t|j)s'],
  //coverageDirectory: '../coverage',
  //reporters: ['default', 'jest-junit'],

  // set up ~ prefixes
  moduleNameMapper: {
    '~(.*)$': '<rootDir>/src/$1',
  },
};
