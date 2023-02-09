module.exports = {
  clearMocks: true,
  // testEnvironment: 'jest-environment-jsdom',
  // preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
  testEnvironment: 'jsdom',
}
