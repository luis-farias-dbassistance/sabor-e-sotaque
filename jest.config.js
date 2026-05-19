/** @type {import('jest').Config} */
module.exports = {
  projects: [
    // Frontend tests (React components + lib)
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.test.tsx'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', {
          tsconfig: 'tsconfig.json',
          jsx: 'react-jsx',
        }],
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    },
    // Backend tests (Lambda handler)
    {
      displayName: 'backend',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/api/**/*.test.js'],
    },
  ],
};
