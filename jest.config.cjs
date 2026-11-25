/** @type {import('jest').Config} */
module.exports = {
  // jest-fixed-jsdom = jsdom + les globals fetch/Request/Response de Node (requis par MSW)
  testEnvironment: 'jest-fixed-jsdom',
  testEnvironmentOptions: { customExportConditions: [''] },
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { jsc: { transform: { react: { runtime: 'automatic' } } } }],
  },
  // MSW est épinglé en 2.7.x : les versions suivantes dépendent de paquets ESM-only incompatibles avec Jest
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/mocks/**', '!src/main.tsx', '!src/test/**'],
};
