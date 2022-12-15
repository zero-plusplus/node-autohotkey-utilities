import { InitialOptionsTsJest } from 'ts-jest/dist/types';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [ `<rootDir>/build` ],
} as InitialOptionsTsJest;
