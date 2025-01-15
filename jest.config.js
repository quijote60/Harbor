module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@mocks/(.*)$': '<rootDir>/src/mocks/$1'
  },
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    },
};