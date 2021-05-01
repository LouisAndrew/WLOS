module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    // '^@(.*)$': '<rootDir>$1',
    "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules",
    '^@c/(.*)$': '<rootDir>/components/$1',
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@t/(.*)$': '<rootDir>/types/$1',
    '^@h/(.*)$': '<rootDir>/hooks/$1',
    '^@v/(.*)$': '<rootDir>/views/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },
}
