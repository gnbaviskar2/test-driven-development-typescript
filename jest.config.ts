import type { Config } from '@jest/types';

const baseDir = '<rootDir>/src';

const config: Config.InitialOptions = {
  preset: 'ts-jest', // to understand the typescript code
  testEnvironment: 'node',
  verbose: true, // will show more info in the console
  // collectCoverage: true, // collect coverage report for jest running tests
  // collectCoverageFrom: [`${baseDir}/**/*.ts`], // collect coverage from src typescript files

  // testMatch: [`${baseTestDir}/**/*.ts`], // this will check test from basetestDir only
};

export default config;
